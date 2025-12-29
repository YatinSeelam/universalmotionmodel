from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from typing import Optional, List, Union
import os
import json
import uuid
import zipfile
import io
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables FIRST before importing modules that need them
load_dotenv()

from supabase import create_client, Client
from emailer import (
    send_waitlist_welcome,
    send_lab_request_confirmation,
    send_lab_request_admin_notification,
)

app = FastAPI(title="Robot Motion Data Platform API")

# CORS middleware - Allow localhost and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://umm-ruddy.vercel.app",  # Your Vercel domain
        "https://*.vercel.app",  # All Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
dev_user_id = os.getenv("DEV_USER_ID", "00000000-0000-0000-0000-000000000000")

# For MVP: allow starting without Supabase, but warn
if not supabase_url or not supabase_key:
    print("⚠️  WARNING: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY not set")
    print("   Backend will start but Supabase operations will fail")
    print("   Create a .env file with your Supabase credentials")
    supabase: Optional[Client] = None
else:
    supabase: Client = create_client(supabase_url, supabase_key)


# Pydantic models
class EpisodeMeta(BaseModel):
    episode_id: Optional[str] = None
    task_id: str
    hz: int
    steps: int
    duration_sec: float
    success: bool
    failure_reason: Optional[str] = None
    failure_time_sec: Optional[float] = None


class JobResponse(BaseModel):
    id: str
    task_id: str
    episode_id: str
    status: str
    claimed_by: Optional[str] = None
    fix_episode_id: Optional[str] = None
    created_at: str
    updated_at: str
    failure_reason: Optional[str] = None
    failure_time_sec: Optional[float] = None
    video_url: Optional[str] = None


# QC Functions
def compute_quality_score(episode: dict) -> int:
    score = 50
    if episode.get("success"):
        score += 30
    if episode.get("duration_sec", 0) > 15:
        score -= 20
    if episode.get("failure_reason"):
        score -= 10
    return max(0, min(100, score))


def is_edge_case(episode: dict) -> bool:
    if not episode.get("success"):
        return True
    if episode.get("duration_sec", 0) > 20:
        return True
    if episode.get("failure_reason"):
        return True
    return False


def is_accepted(episode: dict) -> bool:
    return episode.get("success") and episode.get("duration_sec", 0) <= 20


def is_fix_accepted(episode: dict) -> bool:
    return episode.get("success") and episode.get("duration_sec", 0) <= 10


# Helper to check Supabase is configured
def require_supabase():
    if not supabase:
        raise HTTPException(
            status_code=503,
            detail="Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file"
        )

# Storage helpers
def get_signed_url(storage_path: str, expires_in: int = 3600) -> str:
    require_supabase()
    try:
        # Supabase Python client returns signed URL directly or in a dict
        response = supabase.storage.from_("episodes").create_signed_url(
            storage_path, expires_in
        )
        # Handle both dict response and direct string response
        if isinstance(response, dict):
            url = response.get("signedURL") or response.get("signed_url") or response.get("url")
            if url:
                return url
        elif isinstance(response, str):
            return response
        
        print(f"Warning: Unexpected signed URL response format: {response}")
        return ""
    except Exception as e:
        print(f"Error creating signed URL for {storage_path}: {e}")
        import traceback
        traceback.print_exc()
        return ""


# API Endpoints
@app.post("/api/episodes/upload")
async def upload_episode(
    meta_json: str = Form(...),
    video: Optional[UploadFile] = File(None),
    lab_id: Optional[str] = Form(None),
):
    """Upload an episode and create a job if it's an edge case."""
    require_supabase()
    try:
        meta = json.loads(meta_json)
        episode_id = str(uuid.uuid4())
        
        # Default to Rutgers lab if lab_id not provided
        if not lab_id:
            lab_id = "00000000-0000-0000-0000-000000000001"
        
        # Get task to ensure lab_id matches
        task_result = supabase.table("tasks").select("lab_id").eq("id", meta["task_id"]).execute()
        if task_result.data:
            task_lab_id = task_result.data[0].get("lab_id")
            if task_lab_id:
                lab_id = task_lab_id
        
        # Create episode record
        episode_data = {
            "id": episode_id,
            "task_id": meta["task_id"],
            "lab_id": lab_id,
            "uploader_user_id": dev_user_id,
            "storage_path": f"episodes/{episode_id}",
            "video_path": f"episodes/{episode_id}/video.mp4" if video else None,
            "success": meta["success"],
            "failure_reason": meta.get("failure_reason"),
            "failure_time_sec": meta.get("failure_time_sec"),
            "hz": meta["hz"],
            "steps": meta["steps"],
            "duration_sec": meta["duration_sec"],
            "edge_case": False,  # Will be set after QC
            "quality_score": 0,  # Will be computed
            "accepted": False,  # Will be set after QC
        }
        
        # Run QC
        episode_data["edge_case"] = is_edge_case(episode_data)
        episode_data["accepted"] = is_accepted(episode_data)
        episode_data["quality_score"] = compute_quality_score(episode_data)
        
        # Upload files to Supabase storage
        storage_path = f"episodes/{episode_id}"
        
        # Upload meta.json
        meta_bytes = json.dumps(meta, indent=2).encode("utf-8")
        supabase.storage.from_("episodes").upload(
            f"{storage_path}/meta.json",
            meta_bytes,
            file_options={"content-type": "application/json"},
        )
        
        # Upload video if provided
        if video:
            video_bytes = await video.read()
            supabase.storage.from_("episodes").upload(
                f"{storage_path}/video.mp4",
                video_bytes,
                file_options={"content-type": "video/mp4"},
            )
        
        # Insert episode into database
        result = supabase.table("episodes").insert(episode_data).execute()
        
        job_id = None
        # Create job if edge case
        if episode_data["edge_case"]:
            job_data = {
                "id": str(uuid.uuid4()),
                "task_id": meta["task_id"],
                "lab_id": lab_id,
                "episode_id": episode_id,
                "status": "open",
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
            }
            job_result = supabase.table("jobs").insert(job_data).execute()
            if job_result.data:
                job_id = job_result.data[0]["id"]
        
        return {
            "episode": result.data[0] if result.data else episode_data,
            "job_id": job_id,
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ Upload error: {error_trace}")  # Log full traceback to console
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/api/jobs")
async def get_jobs(
    status: Optional[str] = None,
    lab_id: Optional[str] = None,
    task_id: Optional[str] = None,
    failure_reason: Optional[str] = None,
):
    """Get list of jobs, optionally filtered by status, lab_id, task_id, or failure_reason."""
    require_supabase()
    try:
        query = supabase.table("jobs").select(
            """
            *,
            episodes (
                failure_reason,
                failure_time_sec,
                video_path
            ),
            labs (
                name
            )
            """
        )
        
        if status:
            query = query.eq("status", status)
        if lab_id:
            query = query.eq("lab_id", lab_id)
        if task_id:
            query = query.eq("task_id", task_id)
        
        result = query.order("created_at", desc=True).execute()
        
        jobs = []
        for job in result.data:
            # Handle episodes relation (could be dict or list)
            episode = job.get("episodes")
            if isinstance(episode, list) and len(episode) > 0:
                episode = episode[0]
            elif not isinstance(episode, dict):
                episode = {}
            
            # Handle labs relation
            lab = job.get("labs")
            if isinstance(lab, list) and len(lab) > 0:
                lab = lab[0]
            elif not isinstance(lab, dict):
                lab = {}
            
            # Get worker name if claimed
            worker_name = None
            if job.get("claimed_by_worker_id"):
                try:
                    worker_result = supabase.table("workers").select("name").eq("id", job["claimed_by_worker_id"]).execute()
                    if worker_result.data:
                        worker_name = worker_result.data[0].get("name")
                except:
                    pass
            
            # Filter by failure_reason if specified
            if failure_reason and episode.get("failure_reason") != failure_reason:
                continue
            
            video_url = None
            if episode.get("video_path"):
                video_url = get_signed_url(episode["video_path"])
            
            jobs.append({
                "id": job["id"],
                "task_id": job["task_id"],
                "lab_id": job.get("lab_id"),
                "lab_name": lab.get("name") if lab else None,
                "episode_id": job["episode_id"],
                "status": job["status"],
                "claimed_by": job.get("claimed_by"),
                "claimed_by_worker_id": job.get("claimed_by_worker_id"),
                "claimed_by_worker_name": worker_name,
                "fix_episode_id": job.get("fix_episode_id"),
                "created_at": job["created_at"],
                "updated_at": job["updated_at"],
                "failure_reason": episode.get("failure_reason"),
                "failure_time_sec": episode.get("failure_time_sec"),
                "video_url": video_url,
            })
        
        return {"jobs": jobs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/jobs/{job_id}")
async def get_job(job_id: str):
    """Get job detail with signed video URL."""
    require_supabase()
    try:
        # First get the job
        job_result = supabase.table("jobs").select("*").eq("id", job_id).execute()
        
        if not job_result.data:
            raise HTTPException(status_code=404, detail="Job not found")
        
        job = job_result.data[0]
        episode_id = job["episode_id"]
        
        # Get episode separately to avoid relationship ambiguity
        episode_result = supabase.table("episodes").select("*").eq("id", episode_id).execute()
        
        if not episode_result.data:
            raise HTTPException(status_code=404, detail="Episode not found")
        
        episode = episode_result.data[0]
        
        # Get worker name if claimed
        worker_name = None
        if job.get("claimed_by_worker_id"):
            worker_result = supabase.table("workers").select("name").eq("id", job["claimed_by_worker_id"]).execute()
            if worker_result.data:
                worker_name = worker_result.data[0].get("name")
        
        # Get lab name
        lab_name = None
        if job.get("lab_id"):
            lab_result = supabase.table("labs").select("name").eq("id", job["lab_id"]).execute()
            if lab_result.data:
                lab_name = lab_result.data[0].get("name")
        
        # Generate signed URL for video if it exists
        video_url = None
        video_path = episode.get("video_path")
        if video_path:
            try:
                video_url = get_signed_url(video_path)
                if not video_url:
                    print(f"Warning: Failed to generate signed URL for {video_path}")
            except Exception as e:
                print(f"Error generating signed URL: {e}")
        
        return {
            "id": job["id"],
            "task_id": job["task_id"],
            "episode_id": job["episode_id"],
            "status": job["status"],
            "claimed_by": job.get("claimed_by"),
            "claimed_by_worker_id": job.get("claimed_by_worker_id"),
            "claimed_by_worker_name": worker_name,
            "lab_id": job.get("lab_id"),
            "lab_name": lab_name,
            "fix_episode_id": job.get("fix_episode_id"),
            "created_at": job["created_at"],
            "updated_at": job["updated_at"],
            "episode": episode,
            "video_url": video_url,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/jobs/{job_id}/claim")
async def claim_job(job_id: str, worker_id: Optional[str] = None):
    """Claim a job."""
    require_supabase()
    try:
        # Use provided worker_id or default to first worker for demo
        if not worker_id:
            # Get first worker as default
            workers_result = supabase.table("workers").select("id").limit(1).execute()
            if workers_result.data:
                worker_id = workers_result.data[0]["id"]
            else:
                worker_id = dev_user_id
        
        result = supabase.table("jobs").update({
            "status": "claimed",
            "claimed_by": dev_user_id,  # Keep for backward compatibility
            "claimed_by_worker_id": worker_id,
            "updated_at": datetime.utcnow().isoformat(),
        }).eq("id", job_id).eq("status", "open").execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Job not found or already claimed")
        
        return {"job": result.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/jobs/{job_id}/submit_fix")
async def submit_fix(
    job_id: str,
    meta_json: str = Form(...),
    video: Optional[UploadFile] = File(None),
):
    """Submit a fix for a job."""
    require_supabase()
    try:
        # Get job
        job_result = supabase.table("jobs").select("*").eq("id", job_id).execute()
        if not job_result.data:
            raise HTTPException(status_code=404, detail="Job not found")
        
        job = job_result.data[0]
        if job["status"] not in ["open", "claimed"]:
            raise HTTPException(status_code=400, detail="Job cannot accept fixes")
        
        # Parse fix episode meta
        meta = json.loads(meta_json)
        fix_episode_id = str(uuid.uuid4())
        
        # Create fix episode
        fix_episode_data = {
            "id": fix_episode_id,
            "task_id": meta["task_id"],
            "uploader_user_id": dev_user_id,
            "storage_path": f"episodes/{fix_episode_id}",
            "video_path": f"episodes/{fix_episode_id}/video.mp4" if video else None,
            "success": meta["success"],
            "failure_reason": meta.get("failure_reason"),
            "failure_time_sec": meta.get("failure_time_sec"),
            "hz": meta["hz"],
            "steps": meta["steps"],
            "duration_sec": meta["duration_sec"],
            "edge_case": False,
            "quality_score": compute_quality_score(meta),
            "accepted": False,
        }
        
        # QC the fix
        fix_episode_data["accepted"] = is_fix_accepted(fix_episode_data)
        fix_episode_data["edge_case"] = is_edge_case(fix_episode_data)
        
        # Upload files
        storage_path = f"episodes/{fix_episode_id}"
        meta_bytes = json.dumps(meta, indent=2).encode("utf-8")
        supabase.storage.from_("episodes").upload(
            f"{storage_path}/meta.json",
            meta_bytes,
            file_options={"content-type": "application/json"},
        )
        
        if video:
            video_bytes = await video.read()
            supabase.storage.from_("episodes").upload(
                f"{storage_path}/video.mp4",
                video_bytes,
                file_options={"content-type": "video/mp4"},
            )
        
        # Insert fix episode
        episode_result = supabase.table("episodes").insert(fix_episode_data).execute()
        
        # Update job
        new_status = "accepted" if fix_episode_data["accepted"] else "rejected"
        job_update = {
            "fix_episode_id": fix_episode_id,
            "status": new_status,
            "updated_at": datetime.utcnow().isoformat(),
        }
        
        job_update_result = supabase.table("jobs").update(job_update).eq("id", job_id).execute()
        
        return {
            "job": job_update_result.data[0] if job_update_result.data else job,
            "fix_episode": episode_result.data[0] if episode_result.data else fix_episode_data,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/export")
async def export_dataset(task_id: str):
    """Export accepted episodes and fixes as a ZIP."""
    require_supabase()
    try:
        # Get all accepted episodes for the task
        episodes_result = supabase.table("episodes").select("*").eq(
            "task_id", task_id
        ).eq("accepted", True).execute()
        
        # Get all accepted fixes (episodes that are fix_episode_id in jobs)
        jobs_result = supabase.table("jobs").select("fix_episode_id").eq(
            "task_id", task_id
        ).eq("status", "accepted").execute()
        
        fix_episode_ids = [j["fix_episode_id"] for j in jobs_result.data if j.get("fix_episode_id")]
        
        fixes_result = supabase.table("episodes").select("*").in_(
            "id", fix_episode_ids
        ).execute() if fix_episode_ids else {"data": []}
        
        # Create ZIP in memory
        zip_buffer = io.BytesIO()
        manifest = {
            "task_id": task_id,
            "exported_at": datetime.utcnow().isoformat(),
            "accepted_episodes": [],
            "accepted_fixes": [],
        }
        
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            # Add accepted episodes
            for episode in episodes_result.data:
                episode_id = episode["id"]
                manifest["accepted_episodes"].append({
                    "episode_id": episode_id,
                    "storage_path": episode["storage_path"],
                })
                
                # Download and add meta.json
                try:
                    meta_data = supabase.storage.from_("episodes").download(
                        f"{episode['storage_path']}/meta.json"
                    )
                    zip_file.writestr(
                        f"episodes/{episode_id}/meta.json",
                        meta_data
                    )
                except:
                    pass
                
                # Download and add video if exists
                if episode.get("video_path"):
                    try:
                        video_data = supabase.storage.from_("episodes").download(
                            episode["video_path"]
                        )
                        zip_file.writestr(
                            f"episodes/{episode_id}/video.mp4",
                            video_data
                        )
                    except:
                        pass
            
            # Add accepted fixes
            for fix in fixes_result.data:
                fix_id = fix["id"]
                manifest["accepted_fixes"].append({
                    "episode_id": fix_id,
                    "storage_path": fix["storage_path"],
                })
                
                try:
                    meta_data = supabase.storage.from_("episodes").download(
                        f"{fix['storage_path']}/meta.json"
                    )
                    zip_file.writestr(
                        f"fixes/{fix_id}/meta.json",
                        meta_data
                    )
                except:
                    pass
                
                if fix.get("video_path"):
                    try:
                        video_data = supabase.storage.from_("episodes").download(
                            fix["video_path"]
                        )
                        zip_file.writestr(
                            f"fixes/{fix_id}/video.mp4",
                            video_data
                        )
                    except:
                        pass
            
            # Add manifest
            zip_file.writestr(
                "manifest.json",
                json.dumps(manifest, indent=2)
            )
        
        zip_buffer.seek(0)
        
        return StreamingResponse(
            io.BytesIO(zip_buffer.read()),
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename=dataset_{task_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/tasks")
async def get_tasks(lab_id: Optional[str] = None):
    """Get all tasks, optionally filtered by lab_id."""
    require_supabase()
    try:
        query = supabase.table("tasks").select("*")
        if lab_id:
            query = query.eq("lab_id", lab_id)
        result = query.execute()
        return {"tasks": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/dataset/stats")
async def get_dataset_stats(task_id: str, lab_id: Optional[str] = None):
    """Get dataset statistics for a task, optionally filtered by lab_id."""
    require_supabase()
    try:
        # Get all episodes for the task
        episodes_query = supabase.table("episodes").select("*").eq("task_id", task_id)
        if lab_id:
            episodes_query = episodes_query.eq("lab_id", lab_id)
        episodes_result = episodes_query.execute()
        episodes = episodes_result.data
        
        # Get all jobs for the task
        jobs_query = supabase.table("jobs").select("*").eq("task_id", task_id)
        if lab_id:
            jobs_query = jobs_query.eq("lab_id", lab_id)
        jobs_result = jobs_query.execute()
        jobs = jobs_result.data
        
        # Calculate stats
        total_episodes = len(episodes)
        edge_cases = sum(1 for e in episodes if e.get("edge_case", False))
        accepted_episodes = sum(1 for e in episodes if e.get("accepted", False))
        
        # Fixes
        fixes_submitted = sum(1 for j in jobs if j.get("fix_episode_id") is not None)
        fixes_accepted = sum(1 for j in jobs if j.get("status") == "accepted")
        
        # Quality scores
        quality_scores = [e.get("quality_score", 0) for e in episodes if e.get("quality_score")]
        avg_quality_score = sum(quality_scores) / len(quality_scores) if quality_scores else 0
        
        # Failure reasons
        failure_reasons = {}
        for e in episodes:
            reason = e.get("failure_reason")
            if reason:
                failure_reasons[reason] = failure_reasons.get(reason, 0) + 1
        
        top_failure_reasons = sorted(
            failure_reasons.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:5]
        
        # Acceptance rate
        acceptance_rate = (accepted_episodes / total_episodes * 100) if total_episodes > 0 else 0
        
        return {
            "task_id": task_id,
            "total_episodes": total_episodes,
            "edge_cases": edge_cases,
            "fixes_submitted": fixes_submitted,
            "fixes_accepted": fixes_accepted,
            "accepted_episodes": accepted_episodes,
            "acceptance_rate": round(acceptance_rate, 1),
            "average_quality_score": round(avg_quality_score, 1),
            "top_failure_reasons": [{"reason": r, "count": c} for r, c in top_failure_reasons],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Waitlist and Lab Requests
class WaitlistEntry(BaseModel):
    email: str
    role: str  # operator, lab, student, other
    note: Optional[str] = None
    name: Optional[str] = None  # Optional name field
    source: Optional[str] = None  # Optional source field


class LabRequest(BaseModel):
    name: str
    email: str
    org: str
    use_case: str


class CreateLabRequest(BaseModel):
    name: str
    use_case: Optional[str] = None


class CreateProjectRequest(BaseModel):
    lab_id: str
    name: str
    robot_type: Optional[str] = None
    description: Optional[str] = None


class CreateWorkerRequest(BaseModel):
    email: str
    country: Optional[str] = None
    name: Optional[str] = None


class RejectJobRequest(BaseModel):
    reason: Optional[str] = None


@app.post("/api/waitlist")
async def add_to_waitlist(entry: WaitlistEntry):
    """
    Add an email to the waitlist.
    Sends welcome email if new signup or if email_sent is False.
    """
    require_supabase()
    try:
        # Check if email already exists
        existing = supabase.table("waitlist").select("id, email_sent").eq("email", entry.email).execute()
        
        is_new = not existing.data or len(existing.data) == 0
        email_sent = existing.data[0].get("email_sent", False) if existing.data else False
        
        # Upsert: insert or update
        if is_new:
            # Insert new entry
            result = supabase.table("waitlist").insert({
                "email": entry.email,
                "name": entry.name,
                "role": entry.role,
                "note": entry.note,
                "email_sent": False,  # Will be set to True after email is sent
            }).execute()
            entry_data = result.data[0] if result.data else None
        else:
            # Update existing entry (but don't overwrite email_sent if already True)
            update_data = {
                "name": entry.name,
                "role": entry.role,
                "note": entry.note,
            }
            result = supabase.table("waitlist").update(update_data).eq("email", entry.email).execute()
            entry_data = result.data[0] if result.data else existing.data[0]
        
        # Send welcome email if new OR if email_sent is False
        if is_new or not email_sent:
            email_success = send_waitlist_welcome(
                email=entry.email,
                name=entry.name,
            )
            
            # Update email_sent flag if email was sent successfully
            if email_success:
                supabase.table("waitlist").update({"email_sent": True}).eq("email", entry.email).execute()
        
        return {"success": True, "entry": entry_data}
    except Exception as e:
        # Handle unique constraint violation
        if "unique" in str(e).lower() or "duplicate" in str(e).lower():
            raise HTTPException(status_code=400, detail="Email already on waitlist")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/lab_requests")
async def create_lab_request(request: LabRequest):
    """
    Create a lab integration request.
    Sends confirmation email to requester and notification email to admin.
    """
    require_supabase()
    try:
        # Insert lab request
        result = supabase.table("lab_requests").insert({
            "name": request.name,
            "email": request.email,
            "org": request.org,
            "use_case": request.use_case,
            "confirmation_sent": False,
            "admin_notified": False,
        }).execute()
        
        request_data = result.data[0] if result.data else None
        
        # Send confirmation email to requester (if not already sent)
        if request_data and not request_data.get("confirmation_sent", False):
            confirmation_success = send_lab_request_confirmation(
                email=request.email,
                name=request.name,
                org=request.org,
            )
            
            if confirmation_success:
                supabase.table("lab_requests").update({
                    "confirmation_sent": True
                }).eq("id", request_data["id"]).execute()
        
        # Send admin notification (if not already notified)
        if request_data and not request_data.get("admin_notified", False):
            admin_success = send_lab_request_admin_notification({
                "name": request.name,
                "email": request.email,
                "org": request.org,
                "use_case": request.use_case,
            })
            
            if admin_success:
                supabase.table("lab_requests").update({
                    "admin_notified": True
                }).eq("id", request_data["id"]).execute()
        
        return {"success": True, "request": request_data}
    except Exception as e:
        # Log error but still return success (don't crash on email failures)
        import traceback
        print(f"Error in create_lab_request: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


# Labs endpoints
@app.get("/api/labs")
async def get_labs():
    """Get all labs."""
    require_supabase()
    try:
        result = supabase.table("labs").select("*").order("created_at", desc=True).execute()
        return {"labs": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/labs")
async def create_lab(request: CreateLabRequest):
    """Create a new lab."""
    require_supabase()
    try:
        result = supabase.table("labs").insert({
            "name": request.name,
            "use_case": request.use_case
        }).execute()
        return {"lab": result.data[0] if result.data else None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/labs/{lab_id}/summary")
async def get_lab_summary(lab_id: str):
    """Get high-level summary for a lab."""
    require_supabase()
    try:
        # Get counts
        episodes_result = supabase.table("episodes").select("id, accepted, edge_case").eq("lab_id", lab_id).execute()
        episodes = episodes_result.data
        
        jobs_result = supabase.table("jobs").select("id, status, fix_episode_id").eq("lab_id", lab_id).execute()
        jobs = jobs_result.data
        
        total_episodes = len(episodes)
        accepted_episodes = sum(1 for e in episodes if e.get("accepted", False))
        edge_cases = sum(1 for e in episodes if e.get("edge_case", False))
        fixes_submitted = sum(1 for j in jobs if j.get("fix_episode_id") is not None)
        fixes_accepted = sum(1 for j in jobs if j.get("status") == "accepted")
        
        acceptance_rate = (accepted_episodes / total_episodes * 100) if total_episodes > 0 else 0
        
        return {
            "lab_id": lab_id,
            "total_episodes": total_episodes,
            "accepted_episodes": accepted_episodes,
            "edge_cases": edge_cases,
            "fixes_submitted": fixes_submitted,
            "fixes_accepted": fixes_accepted,
            "acceptance_rate": round(acceptance_rate, 1),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/labs/{lab_id}/episodes")
async def get_lab_episodes(
    lab_id: str,
    accepted: Optional[bool] = None,
    edge_case: Optional[bool] = None,
    task_id: Optional[str] = None,
):
    """Get episodes for a lab with optional filters."""
    require_supabase()
    try:
        query = supabase.table("episodes").select("*").eq("lab_id", lab_id)
        
        if accepted is not None:
            query = query.eq("accepted", accepted)
        if edge_case is not None:
            query = query.eq("edge_case", edge_case)
        if task_id:
            query = query.eq("task_id", task_id)
        
        result = query.order("created_at", desc=True).execute()
        return {"episodes": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Projects endpoints
@app.get("/api/projects")
async def get_projects(lab_id: Optional[str] = None):
    """Get all projects, optionally filtered by lab_id."""
    require_supabase()
    try:
        query = supabase.table("projects").select("*")
        if lab_id:
            query = query.eq("lab_id", lab_id)
        result = query.order("created_at", desc=True).execute()
        return {"projects": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/projects")
async def create_project(request: CreateProjectRequest):
    """Create a new project."""
    require_supabase()
    try:
        result = supabase.table("projects").insert({
            "lab_id": request.lab_id,
            "name": request.name,
            "description": request.description,
            "robot_type": request.robot_type
        }).execute()
        return {"project": result.data[0] if result.data else None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Workers endpoints
@app.post("/api/workers")
async def create_worker(request: CreateWorkerRequest):
    """Create a new worker."""
    require_supabase()
    try:
        result = supabase.table("workers").insert({
            "email": request.email,
            "name": request.name or request.email.split("@")[0],
            "country": request.country
        }).execute()
        return {"worker": result.data[0] if result.data else None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Job approval/rejection
@app.post("/api/jobs/{job_id}/approve")
async def approve_job(job_id: str):
    """Approve a job submission."""
    require_supabase()
    try:
        result = supabase.table("jobs").update({
            "status": "accepted",
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", job_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Job not found")
        
        return {"job": result.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/jobs/{job_id}/reject")
async def reject_job(job_id: str, request: RejectJobRequest):
    """Reject a job submission."""
    require_supabase()
    try:
        result = supabase.table("jobs").update({
            "status": "rejected",
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", job_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Job not found")
        
        return {"job": result.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Episodes endpoints
@app.get("/api/episodes/{episode_id}")
async def get_episode(episode_id: str):
    """Get episode by ID with signed video URL."""
    require_supabase()
    try:
        result = supabase.table("episodes").select("*").eq("id", episode_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Episode not found")
        
        episode = result.data[0]
        
        # Get signed video URL if video_path exists
        video_url = None
        if episode.get("video_path"):
            video_url = get_signed_url(episode["video_path"])
        
        episode["video_url"] = video_url
        return episode
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

