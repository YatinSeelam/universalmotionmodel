# Reset and Seed Demo Data

## Overview
This guide explains how to reset all Supabase data and seed realistic demo data with multiple labs, workers, projects, tasks, episodes, jobs, and fixes.

## Prerequisites

1. **Environment Variables**: Ensure `.env` file has:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Video File**: Ensure `jarvis.mp4` exists in project root (used for all demo videos)

## Database Schema Updates

### New Tables
- **workers**: Stores worker names and emails
- **projects**: Organizes tasks under labs

### Updated Tables
- **jobs**: Added `claimed_by_worker_id` to reference workers
- **tasks, episodes, jobs**: Added `project_id` to reference projects

## Running the Reset and Seed Script

### Option 1: Python Script (Recommended)

```bash
cd backend
python scripts/reset_and_seed_demo.py
```

This script will:
1. ✅ Delete all objects in Supabase Storage bucket "episodes"
2. ✅ Truncate all database tables
3. ✅ Seed 3 labs with realistic names
4. ✅ Seed 6 projects (2 per lab)
5. ✅ Seed 5 workers with names
6. ✅ Seed 6 tasks (one per project)
7. ✅ Seed ~30 episodes (40% failures, 60% successes)
8. ✅ Create jobs for edge cases (~12 jobs)
9. ✅ Seed fixes for ~6 jobs (some accepted, some rejected)
10. ✅ Upload videos and meta.json files to storage

### Option 2: Manual SQL

If you prefer to run SQL manually:

1. Open Supabase SQL Editor
2. Run `supabase/migrations/999_reset_and_seed_demo.sql`
3. Note: This only seeds base data (labs, projects, workers, tasks)
4. Episodes and jobs must be seeded via Python script (for storage uploads)

## What Gets Seeded

### Labs (3)
- Rutgers Robotics Lab
- Princeton Manipulation Group
- Columbia Medical Robotics

### Projects (6)
**Rutgers:**
- Reflective Object Grasping
- Bin Picking v1

**Princeton:**
- Peg In Hole
- Precision Placement

**Columbia:**
- Surgical Tool Handoff
- Endoscope Pose Hold

### Workers (5)
- Ava Chen
- Mateo Rivera
- Noor Patel
- Ethan Park
- Sofia Martinez

### Tasks (6)
- pick_reflective_v1
- pick_bin_v1
- peg_v1
- place_precise_v1
- tool_handoff_v1
- pose_hold_v1

### Episodes (~30)
- 40% failures (edge cases): 6-20 seconds, various failure reasons
- 60% successes (accepted): 4-12 seconds
- All episodes have videos (jarvis.mp4)
- Quality scores computed automatically

### Jobs (~12)
- Created only for edge case episodes
- Mixed statuses: open, claimed, accepted, rejected
- Some jobs have fixes linked

### Fixes (~6)
- All fixes are successful
- Duration: 3-10 seconds
- Some accepted (duration <= 10s), some rejected
- Linked to jobs via fix_episode_id

## Verification

After running the script, verify:

1. **Lab Dashboard** (`/lab`):
   - Shows 3 labs in dropdown
   - Stats cards show realistic numbers
   - Recent uploads list populated

2. **Fix Queue** (`/work/queue`):
   - Shows jobs from multiple labs
   - Lab name tags visible
   - Worker names shown for claimed jobs
   - Filters work (lab, task, failure reason)

3. **Job Detail** (`/work/jobs/[id]`):
   - Shows lab name
   - Shows worker name if claimed
   - Video plays correctly
   - Failure markers work

4. **Dataset Browser** (`/lab/dataset`):
   - Tabs show: Accepted, Edge Cases, Fixes
   - Tables populated with episodes
   - Filters work

5. **Export** (`/lab/export`):
   - Dataset report shows stats
   - Download ZIP includes episodes + fixes + manifest.json

## Troubleshooting

### Storage Objects Not Deleted
If storage objects aren't deleted, manually delete them via Supabase Storage UI or run:
```python
# In Python console
from supabase import create_client
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
files = supabase.storage.from_("episodes").list()
for f in files:
    supabase.storage.from_("episodes").remove([f['name']])
```

### Foreign Key Errors
If you get foreign key errors, ensure tables are deleted in correct order:
1. jobs
2. episodes
3. tasks
4. projects
5. labs
6. workers

### Video Upload Fails
If video upload fails:
- Check that `jarvis.mp4` exists in project root
- Check Supabase Storage bucket permissions
- Episodes will still be created, just without videos

## Notes

- All UUIDs are fixed for consistency (easier to reference in demos)
- Videos are reused (jarvis.mp4) for all episodes (demo only)
- Quality scores and acceptance are computed automatically
- Fixes are always successful but may be rejected if duration > 10s

