# Lab Portal Upgrade Summary

## Overview
Upgraded the Lab Portal to support multiple labs, dataset management, and a cleaner UI. Labs can now see what worked, manage edge cases, and workers can see jobs from multiple labs.

## Database Changes

### Migration: `002_add_labs_and_lab_id.sql`
- Created `labs` table with id, name, created_at
- Added `lab_id` column to `tasks`, `episodes`, and `jobs` tables
- Created indexes for performance
- Seeded default lab: "Rutgers Robotics Lab"
- Updated all existing data to use the default lab

**Status:** ✅ Applied to Supabase

## Backend Updates

### Updated Endpoints
1. **POST /api/episodes/upload**
   - Now accepts optional `lab_id` parameter
   - Defaults to Rutgers lab if not provided
   - Sets lab_id on episodes and jobs

2. **GET /api/jobs**
   - Added filters: `lab_id`, `task_id`, `failure_reason`
   - Returns `lab_name` in job objects

3. **GET /api/tasks**
   - Added optional `lab_id` filter

4. **GET /api/dataset/stats**
   - Added optional `lab_id` filter

### New Endpoints
1. **GET /api/labs**
   - Returns list of all labs

2. **GET /api/labs/{lab_id}/summary**
   - Returns high-level stats: total episodes, accepted, edge cases, fixes, acceptance rate

3. **GET /api/labs/{lab_id}/episodes**
   - Returns episodes for a lab
   - Filters: `accepted`, `edge_case`, `task_id`

## Frontend Updates

### New Pages

1. **/lab** - Lab Dashboard
   - Lab selector (if multiple labs)
   - Summary cards: Total Episodes, Edge Cases, Accepted, Fixes Accepted, Acceptance Rate
   - Quick actions: Upload Run, View Dataset, Export
   - Recent uploads list

2. **/lab/dataset** - Dataset Browser
   - Tabs: Accepted | Edge Cases | Fixes
   - Filters: Lab, Task
   - Table view with: Time, Task, Status, Duration, Quality, Video
   - Note: Fixes tab currently shows edge cases - may need backend endpoint for actual fixes

### Updated Pages

1. **/lab/upload** - Compact 2-Column Layout
   - Left column: Lab, Task, Success checkbox, Failure fields (if failed)
   - Right column: Duration, Hz, Steps (read-only badge), Video
   - Reduced padding and spacing
   - Smaller labels and inputs
   - Steps shown as compact read-only badge

2. **/work/queue** - Multi-Lab Support
   - Shows lab name tag on each job card
   - Filters: Lab, Task, Failure Reason
   - Compact card layout

## UI Improvements

### Compact Layout Rules Applied
- Reduced padding: `p-4` instead of `p-8`
- Smaller labels: `text-xs` instead of `text-sm`
- Tighter gaps: `gap-3` instead of `gap-4`
- Max width: `max-w-3xl` for forms
- Steps displayed as small read-only badge
- Failure fields hidden unless `success=false`

## Files Changed

### Backend
- `backend/main.py` - Updated endpoints, added lab endpoints

### Frontend
- `frontend/app/lab/page.tsx` - New dashboard
- `frontend/app/lab/dataset/page.tsx` - New dataset browser
- `frontend/app/lab/upload/page.tsx` - Compact 2-column layout
- `frontend/app/work/queue/page.tsx` - Lab names and filters

### Database
- `supabase/migrations/002_add_labs_and_lab_id.sql` - Migration file

## Demo Flow

### Lab Flow
1. Navigate to `/lab` → See dashboard with stats
2. Click "Upload Run" → Compact form with lab selector
3. Upload episode → Creates job if edge case
4. Navigate to `/lab/dataset` → Browse by tabs (Accepted, Edge Cases, Fixes)
5. Navigate to `/lab/export` → Export curated dataset

### Worker Flow
1. Navigate to `/work/queue` → See jobs from all labs
2. Filter by lab, task, or failure reason
3. See lab name tag on each job card
4. Click "Fix" → Submit fix as before

## Notes

- All existing data has been assigned to "Rutgers Robotics Lab"
- Fixes tab in dataset browser may need backend endpoint to show actual fixes (episodes linked as fix_episode_id)
- UI is now more compact and professional
- Multi-lab support is fully functional

## Next Steps (Optional)

1. Add backend endpoint for fixes: `GET /api/labs/{lab_id}/fixes`
2. Add project/dataset grouping (tasks grouped under projects)
3. Add rewards/points system for workers
4. Add more detailed filtering in dataset browser



