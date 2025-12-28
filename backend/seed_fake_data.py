#!/usr/bin/env python3
"""
Seed fake data for the Robot Motion Data Platform.
Creates 10 episodes (5 failures, 5 successes) using jarvis.mp4.
"""

import os
import sys
import json
import random
import requests
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
API_URL = os.getenv("API_URL", "http://localhost:8000")
VIDEO_PATH = Path(__file__).parent.parent / "jarvis.mp4"

# Failure reasons for edge cases
FAILURE_REASONS = [
    "slip_after_grasp",
    "missed_grasp",
    "timeout",
    "collision_spike"
]

def ensure_task_exists(supabase_client):
    """Ensure task pick_v1 exists in the database."""
    try:
        # Check if task exists
        result = supabase_client.table("tasks").select("id").eq("id", "pick_v1").execute()
        if result.data:
            print("✓ Task 'pick_v1' already exists")
            return
        
        # Create task if it doesn't exist
        supabase_client.table("tasks").insert({
            "id": "pick_v1",
            "name": "Pick Task v1",
            "description": "Basic pick and place task"
        }).execute()
        print("✓ Created task 'pick_v1'")
    except Exception as e:
        print(f"⚠ Warning: Could not ensure task exists: {e}")
        print("  You may need to create it manually in Supabase")

def generate_episode_meta(index: int, is_failure: bool) -> dict:
    """Generate episode metadata."""
    hz = 20
    steps = random.randint(150, 300)
    duration_sec = steps / hz
    
    if is_failure:
        failure_reason = random.choice(FAILURE_REASONS)
        # Failure time between 2.0 and duration_sec - 0.5
        failure_time_sec = random.uniform(2.0, max(2.5, duration_sec - 0.5))
        success = False
    else:
        failure_reason = None
        failure_time_sec = None
        success = True
    
    return {
        "task_id": "pick_v1",
        "hz": hz,
        "steps": steps,
        "duration_sec": round(duration_sec, 2),
        "success": success,
        "failure_reason": failure_reason,
        "failure_time_sec": round(failure_time_sec, 2) if failure_time_sec else None
    }

def upload_episode(meta: dict, video_path: Path) -> dict:
    """Upload an episode via the API."""
    try:
        with open(video_path, 'rb') as video_file:
            files = {
                'video': ('video.mp4', video_file, 'video/mp4')
            }
            data = {
                'meta_json': json.dumps(meta)
            }
            
            response = requests.post(
                f"{API_URL}/api/episodes/upload",
                files=files,
                data=data,
                timeout=60
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"  ❌ Upload failed: {e}")
        return None

def main():
    """Main function to seed fake data."""
    print("=" * 60)
    print("Robot Motion Data Platform - Fake Data Seeder")
    print("=" * 60)
    print()
    
    # Check if video file exists
    if not VIDEO_PATH.exists():
        print(f"❌ Error: Video file not found at {VIDEO_PATH}")
        print("   Please ensure jarvis.mp4 is in the project root directory")
        sys.exit(1)
    
    print(f"✓ Found video file: {VIDEO_PATH}")
    print()
    
    # Ensure task exists
    if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
        try:
            supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
            ensure_task_exists(supabase)
        except Exception as e:
            print(f"⚠ Warning: Could not connect to Supabase: {e}")
            print("  Task creation will be skipped. Make sure task 'pick_v1' exists.")
    else:
        print("⚠ Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set")
        print("  Task creation will be skipped. Make sure task 'pick_v1' exists.")
    
    print()
    print("Uploading 10 episodes (5 failures, 5 successes)...")
    print()
    
    # Generate and upload episodes
    # First 5 are failures, last 5 are successes
    results = []
    for i in range(1, 11):
        is_failure = i <= 5
        meta = generate_episode_meta(i, is_failure)
        
        print(f"[{i}/10] Uploading episode...", end=" ")
        result = upload_episode(meta, VIDEO_PATH)
        
        if result:
            episode = result.get("episode", {})
            edge_case = episode.get("edge_case", False)
            job_id = result.get("job_id")
            
            status = "✓" if result else "❌"
            edge_case_str = "edge_case=true" if edge_case else "edge_case=false"
            job_str = f", job_id={job_id}" if job_id else ""
            
            print(f"{status} Uploaded episode {i}, {edge_case_str}{job_str}")
            results.append({
                "index": i,
                "success": True,
                "edge_case": edge_case,
                "job_id": job_id
            })
        else:
            print(f"❌ Failed to upload episode {i}")
            results.append({
                "index": i,
                "success": False
            })
    
    print()
    print("=" * 60)
    print("Summary:")
    print("=" * 60)
    
    successful = sum(1 for r in results if r.get("success"))
    edge_cases = sum(1 for r in results if r.get("edge_case"))
    jobs_created = sum(1 for r in results if r.get("job_id"))
    
    print(f"✓ Successfully uploaded: {successful}/10 episodes")
    print(f"✓ Edge cases detected: {edge_cases}")
    print(f"✓ Jobs created: {jobs_created}")
    print()
    print(f"🌐 Open http://localhost:3000/jobs to see the Fix Queue")
    print()

if __name__ == "__main__":
    main()

