#!/usr/bin/env python3
"""
Reset and seed demo data for UMM Data Factory.
- Deletes all storage objects
- Truncates all tables
- Seeds realistic demo data with multiple labs, workers, projects, tasks, episodes, jobs, and fixes
"""

import os
import sys
import json
import uuid
import random
from pathlib import Path
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
VIDEO_PATH = Path(__file__).parent.parent.parent / "jarvis.mp4"

# Fixed UUIDs for consistency
LAB_IDS = {
    'rutgers': '11111111-1111-1111-1111-111111111111',
    'princeton': '22222222-2222-2222-2222-222222222222',
    'columbia': '33333333-3333-3333-3333-333333333333',
}

PROJECT_IDS = {
    'rutgers_reflective': 'p1111111-1111-1111-1111-111111111111',
    'rutgers_bin': 'p1111111-1111-1111-1111-111111111112',
    'princeton_peg': 'p2222222-2222-2222-2222-222222222221',
    'princeton_place': 'p2222222-2222-2222-2222-222222222222',
    'columbia_handoff': 'p3333333-3333-3333-3333-333333333331',
    'columbia_pose': 'p3333333-3333-3333-3333-333333333332',
}

WORKER_IDS = {
    'ava': 'w1111111-1111-1111-1111-111111111111',
    'mateo': 'w2222222-2222-2222-2222-222222222222',
    'noor': 'w3333333-3333-3333-3333-333333333333',
    'ethan': 'w4444444-4444-4444-4444-444444444444',
    'sofia': 'w5555555-5555-5555-5555-555555555555',
}

TASK_IDS = {
    'pick_reflective_v1': ('rutgers', 'rutgers_reflective'),
    'pick_bin_v1': ('rutgers', 'rutgers_bin'),
    'peg_v1': ('princeton', 'princeton_peg'),
    'place_precise_v1': ('princeton', 'princeton_place'),
    'tool_handoff_v1': ('columbia', 'columbia_handoff'),
    'pose_hold_v1': ('columbia', 'columbia_pose'),
}

FAILURE_REASONS = ['slip_after_grasp', 'missed_grasp', 'timeout', 'collision_spike', 'other']

def compute_quality_score(episode: dict) -> int:
    """Compute quality score based on episode data."""
    score = 50
    if episode.get("success"):
        score += 30
    if episode.get("duration_sec", 0) > 15:
        score -= 20
    if episode.get("failure_reason"):
        score -= 10
    return max(0, min(100, score))

def is_edge_case(episode: dict) -> bool:
    """Check if episode is an edge case."""
    if not episode.get("success"):
        return True
    if episode.get("duration_sec", 0) > 20:
        return True
    if episode.get("failure_reason"):
        return True
    return False

def is_accepted(episode: dict) -> bool:
    """Check if episode is accepted."""
    return episode.get("success") and episode.get("duration_sec", 0) <= 20

def is_fix_accepted(episode: dict) -> bool:
    """Check if fix is accepted."""
    return episode.get("success") and episode.get("duration_sec", 0) <= 10

def delete_all_storage_objects(supabase_client):
    """Delete all objects in the episodes storage bucket."""
    print("🗑️  Deleting all storage objects...")
    try:
        # List all files in the bucket
        files = supabase_client.storage.from_("episodes").list()
        
        # Delete all files recursively
        deleted_count = 0
        for file_info in files:
            if file_info.get('name'):
                try:
                    # Try to delete (might be a folder)
                    supabase_client.storage.from_("episodes").remove([file_info['name']])
                    deleted_count += 1
                except:
                    pass
        
        # Also try to remove common paths
        for path in ['episodes/', 'episodes']:
            try:
                supabase_client.storage.from_("episodes").remove([path])
            except:
                pass
        
        print(f"   ✓ Deleted {deleted_count} storage objects")
    except Exception as e:
        print(f"   ⚠ Warning: Could not delete all storage objects: {e}")
        print("   Continuing anyway...")

def reset_database(supabase_client):
    """Execute SQL reset script."""
    print("🔄 Resetting database...")
    
    # Delete all rows from tables in correct order (respecting foreign keys)
    tables = ['jobs', 'episodes', 'tasks', 'projects', 'labs', 'workers', 'waitlist', 'lab_requests']
    
    for table in tables:
        try:
            # Get all rows and delete them
            result = supabase_client.table(table).select('id').execute()
            if result.data:
                # Delete in batches if needed
                ids = [row['id'] for row in result.data]
                for id_val in ids:
                    try:
                        supabase_client.table(table).delete().eq('id', id_val).execute()
                    except:
                        pass
        except Exception as e:
            print(f"   ⚠ Could not clear {table}: {e}")
    
    print("   ✓ Database reset complete")

def seed_base_data(supabase_client):
    """Seed labs, projects, workers, and tasks."""
    print("📦 Seeding base data...")
    
    # Seed Labs
    labs = [
        {'id': LAB_IDS['rutgers'], 'name': 'Rutgers Robotics Lab'},
        {'id': LAB_IDS['princeton'], 'name': 'Princeton Manipulation Group'},
        {'id': LAB_IDS['columbia'], 'name': 'Columbia Medical Robotics'},
    ]
    for lab in labs:
        supabase_client.table('labs').upsert(lab).execute()
    print(f"   ✓ Seeded {len(labs)} labs")
    
    # Seed Projects
    projects = [
        {'id': PROJECT_IDS['rutgers_reflective'], 'lab_id': LAB_IDS['rutgers'], 'name': 'Reflective Object Grasping', 'description': 'Grasping reflective and transparent objects'},
        {'id': PROJECT_IDS['rutgers_bin'], 'lab_id': LAB_IDS['rutgers'], 'name': 'Bin Picking v1', 'description': 'Random bin picking with clutter'},
        {'id': PROJECT_IDS['princeton_peg'], 'lab_id': LAB_IDS['princeton'], 'name': 'Peg In Hole', 'description': 'Precision peg insertion tasks'},
        {'id': PROJECT_IDS['princeton_place'], 'lab_id': LAB_IDS['princeton'], 'name': 'Precision Placement', 'description': 'High-precision object placement'},
        {'id': PROJECT_IDS['columbia_handoff'], 'lab_id': LAB_IDS['columbia'], 'name': 'Surgical Tool Handoff', 'description': 'Handoff tasks in surgical scenarios'},
        {'id': PROJECT_IDS['columbia_pose'], 'lab_id': LAB_IDS['columbia'], 'name': 'Endoscope Pose Hold', 'description': 'Maintaining endoscope pose stability'},
    ]
    for project in projects:
        supabase_client.table('projects').upsert(project).execute()
    print(f"   ✓ Seeded {len(projects)} projects")
    
    # Seed Workers
    workers = [
        {'id': WORKER_IDS['ava'], 'name': 'Ava Chen', 'email': 'ava.chen@example.com'},
        {'id': WORKER_IDS['mateo'], 'name': 'Mateo Rivera', 'email': 'mateo.rivera@example.com'},
        {'id': WORKER_IDS['noor'], 'name': 'Noor Patel', 'email': 'noor.patel@example.com'},
        {'id': WORKER_IDS['ethan'], 'name': 'Ethan Park', 'email': 'ethan.park@example.com'},
        {'id': WORKER_IDS['sofia'], 'name': 'Sofia Martinez', 'email': 'sofia.martinez@example.com'},
    ]
    for worker in workers:
        supabase_client.table('workers').upsert(worker).execute()
    print(f"   ✓ Seeded {len(workers)} workers")
    
    # Seed Tasks
    tasks = [
        {'id': 'pick_reflective_v1', 'name': 'Reflective Object Grasp', 'description': 'Grasp reflective objects', 'lab_id': LAB_IDS['rutgers'], 'project_id': PROJECT_IDS['rutgers_reflective']},
        {'id': 'pick_bin_v1', 'name': 'Bin Picking', 'description': 'Random bin picking', 'lab_id': LAB_IDS['rutgers'], 'project_id': PROJECT_IDS['rutgers_bin']},
        {'id': 'peg_v1', 'name': 'Peg In Hole', 'description': 'Precision peg insertion', 'lab_id': LAB_IDS['princeton'], 'project_id': PROJECT_IDS['princeton_peg']},
        {'id': 'place_precise_v1', 'name': 'Precision Placement', 'description': 'High-precision placement', 'lab_id': LAB_IDS['princeton'], 'project_id': PROJECT_IDS['princeton_place']},
        {'id': 'tool_handoff_v1', 'name': 'Surgical Tool Handoff', 'description': 'Tool handoff in surgery', 'lab_id': LAB_IDS['columbia'], 'project_id': PROJECT_IDS['columbia_handoff']},
        {'id': 'pose_hold_v1', 'name': 'Endoscope Pose Hold', 'description': 'Maintain endoscope pose', 'lab_id': LAB_IDS['columbia'], 'project_id': PROJECT_IDS['columbia_pose']},
    ]
    for task in tasks:
        supabase_client.table('tasks').upsert(task).execute()
    print(f"   ✓ Seeded {len(tasks)} tasks")

def generate_episode(task_id: str, lab_id: str, project_id: str, is_failure: bool, index: int):
    """Generate episode data."""
    hz = 20
    
    if is_failure:
        # Failures: 6-20 seconds
        duration_sec = random.uniform(6.0, 20.0)
        failure_reason = random.choice(FAILURE_REASONS)
        failure_time_sec = random.uniform(2.0, duration_sec - 0.5)
        success = False
    else:
        # Successes: 4-12 seconds
        duration_sec = random.uniform(4.0, 12.0)
        failure_reason = None
        failure_time_sec = None
        success = True
    
    steps = round(duration_sec * hz)
    episode_id = str(uuid.uuid4())
    
    episode_data = {
        'id': episode_id,
        'task_id': task_id,
        'lab_id': lab_id,
        'project_id': project_id,
        'uploader_user_id': '00000000-0000-0000-0000-000000000000',
        'storage_path': f'episodes/{episode_id}',
        'video_path': f'episodes/{episode_id}/video.mp4',
        'success': success,
        'failure_reason': failure_reason,
        'failure_time_sec': round(failure_time_sec, 2) if failure_time_sec else None,
        'hz': hz,
        'steps': steps,
        'duration_sec': round(duration_sec, 2),
        'edge_case': False,  # Will be set
        'quality_score': 0,  # Will be computed
        'accepted': False,  # Will be set
        'created_at': (datetime.now() - timedelta(days=random.randint(1, 10))).isoformat(),
    }
    
    # Compute QC
    episode_data['edge_case'] = is_edge_case(episode_data)
    episode_data['accepted'] = is_accepted(episode_data)
    episode_data['quality_score'] = compute_quality_score(episode_data)
    
    # Meta JSON for storage
    meta = {
        'task_id': task_id,
        'hz': hz,
        'steps': steps,
        'duration_sec': episode_data['duration_sec'],
        'success': success,
        'failure_reason': failure_reason,
        'failure_time_sec': episode_data['failure_time_sec'],
    }
    
    return episode_data, meta, episode_id

def upload_video_and_meta(supabase_client, episode_id: str, meta: dict, video_path: Path):
    """Upload video and meta.json to storage."""
    storage_path = f'episodes/{episode_id}'
    
    # Upload meta.json
    meta_bytes = json.dumps(meta, indent=2).encode('utf-8')
    supabase_client.storage.from_('episodes').upload(
        f'{storage_path}/meta.json',
        meta_bytes,
        file_options={'content-type': 'application/json'}
    )
    
    # Upload video if it exists
    if video_path.exists():
        with open(video_path, 'rb') as f:
            video_bytes = f.read()
            supabase_client.storage.from_('episodes').upload(
                f'{storage_path}/video.mp4',
                video_bytes,
                file_options={'content-type': 'video/mp4'}
            )

def seed_episodes_and_jobs(supabase_client, video_path: Path):
    """Seed episodes and jobs."""
    print("📹 Seeding episodes and jobs...")
    
    episodes = []
    jobs = []
    
    # Generate ~30 episodes: 40% failures, 60% successes
    episode_count = 30
    failure_count = int(episode_count * 0.4)
    
    task_list = list(TASK_IDS.keys())
    
    for i in range(episode_count):
        task_id = random.choice(task_list)
        lab_key, project_key = TASK_IDS[task_id]
        lab_id = LAB_IDS[lab_key]
        project_id = PROJECT_IDS[project_key]
        
        is_failure = i < failure_count
        episode_data, meta, episode_id = generate_episode(task_id, lab_id, project_id, is_failure, i)
        
        # Upload to storage
        try:
            upload_video_and_meta(supabase_client, episode_id, meta, video_path)
        except Exception as e:
            print(f"   ⚠ Warning: Could not upload storage for {episode_id}: {e}")
        
        # Insert episode
        supabase_client.table('episodes').insert(episode_data).execute()
        episodes.append(episode_data)
        
        # Create job if edge case
        if episode_data['edge_case']:
            job_id = str(uuid.uuid4())
            job_data = {
                'id': job_id,
                'task_id': task_id,
                'lab_id': lab_id,
                'project_id': project_id,
                'episode_id': episode_id,
                'status': 'open',
                'created_at': episode_data['created_at'],
                'updated_at': episode_data['created_at'],
            }
            supabase_client.table('jobs').insert(job_data).execute()
            jobs.append((job_id, episode_data))
    
    print(f"   ✓ Seeded {len(episodes)} episodes ({failure_count} failures, {episode_count - failure_count} successes)")
    print(f"   ✓ Created {len(jobs)} jobs from edge cases")
    
    return episodes, jobs

def seed_fixes(supabase_client, jobs: list, video_path: Path):
    """Seed fixes for some jobs."""
    print("🔧 Seeding fixes...")
    
    # Fix ~6 jobs (half of total jobs)
    jobs_to_fix = random.sample(jobs, min(6, len(jobs)))
    worker_list = list(WORKER_IDS.values())
    
    fixes_created = 0
    fixes_accepted = 0
    
    for job_id, original_episode in jobs_to_fix:
        # Assign worker
        worker_id = random.choice(worker_list)
        
        # Update job to claimed
        supabase_client.table('jobs').update({
            'status': 'claimed',
            'claimed_by_worker_id': worker_id,
        }).eq('id', job_id).execute()
        
        # Generate fix episode (always success, shorter duration)
        fix_duration = random.uniform(3.0, 10.0)
        fix_hz = 20
        fix_steps = round(fix_duration * fix_hz)
        fix_episode_id = str(uuid.uuid4())
        
        fix_episode_data = {
            'id': fix_episode_id,
            'task_id': original_episode['task_id'],
            'lab_id': original_episode['lab_id'],
            'project_id': original_episode.get('project_id'),
            'uploader_user_id': '00000000-0000-0000-0000-000000000000',
            'storage_path': f'episodes/{fix_episode_id}',
            'video_path': f'episodes/{fix_episode_id}/video.mp4',
            'success': True,
            'failure_reason': None,
            'failure_time_sec': None,
            'hz': fix_hz,
            'steps': fix_steps,
            'duration_sec': round(fix_duration, 2),
            'edge_case': False,
            'quality_score': compute_quality_score({'success': True, 'duration_sec': fix_duration}),
            'accepted': False,
            'created_at': datetime.now().isoformat(),
        }
        
        fix_episode_data['accepted'] = is_fix_accepted(fix_episode_data)
        
        # Meta for fix
        fix_meta = {
            'task_id': original_episode['task_id'],
            'hz': fix_hz,
            'steps': fix_steps,
            'duration_sec': fix_episode_data['duration_sec'],
            'success': True,
        }
        
        # Upload to storage
        try:
            upload_video_and_meta(supabase_client, fix_episode_id, fix_meta, video_path)
        except Exception as e:
            print(f"   ⚠ Warning: Could not upload fix storage: {e}")
        
        # Insert fix episode
        supabase_client.table('episodes').insert(fix_episode_data).execute()
        
        # Update job
        new_status = 'accepted' if fix_episode_data['accepted'] else 'rejected'
        supabase_client.table('jobs').update({
            'fix_episode_id': fix_episode_id,
            'status': new_status,
        }).eq('id', job_id).execute()
        
        fixes_created += 1
        if fix_episode_data['accepted']:
            fixes_accepted += 1
    
    print(f"   ✓ Created {fixes_created} fixes ({fixes_accepted} accepted, {fixes_created - fixes_accepted} rejected)")

def main():
    """Main function."""
    print("=" * 70)
    print("UMM Data Factory - Reset and Seed Demo Data")
    print("=" * 70)
    print()
    
    # Check Supabase connection
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        print("❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
        sys.exit(1)
    
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    # Check video file
    if not VIDEO_PATH.exists():
        print(f"⚠ Warning: Video file not found at {VIDEO_PATH}")
        print("   Episodes will be created without videos")
        video_path = None
    else:
        video_path = VIDEO_PATH
        print(f"✓ Found video file: {VIDEO_PATH}")
    
    print()
    
    # Step 1: Delete storage
    delete_all_storage_objects(supabase)
    print()
    
    # Step 2: Reset database
    reset_database(supabase)
    print()
    
    # Step 3: Seed base data
    seed_base_data(supabase)
    print()
    
    # Step 4: Seed episodes and jobs
    episodes, jobs = seed_episodes_and_jobs(supabase, video_path)
    print()
    
    # Step 5: Seed fixes
    seed_fixes(supabase, jobs, video_path)
    print()
    
    # Summary
    print("=" * 70)
    print("Summary:")
    print("=" * 70)
    print(f"✓ Labs: 3")
    print(f"✓ Projects: 6")
    print(f"✓ Workers: 5")
    print(f"✓ Tasks: 6")
    print(f"✓ Episodes: {len(episodes)}")
    print(f"✓ Jobs: {len(jobs)}")
    print(f"✓ Fixes: ~6")
    print()
    print("🌐 Open http://localhost:3000/lab to see the Lab Dashboard")
    print("🌐 Open http://localhost:3000/work/queue to see the Fix Queue")
    print()

if __name__ == "__main__":
    main()

