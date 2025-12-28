# UMM Data Factory - Reorganization Summary

## Overview
This document summarizes the transformation of the MVP into a production-ready demo product with clear sections for public site, worker portal, and lab portal.

## Route Map

### Public Site (Marketing)
- `/` - Landing page with hero, features, and CTAs
- `/how` - How it works page
- `/waitlist` - Join waitlist form
- `/labs` - Lab integration request form

### Worker Portal (Crowdsourcing)
- `/work/queue` - Fix queue showing all jobs
- `/work/jobs/[id]` - Job detail page with replay video, failure markers, and fix submission

### Lab Portal (Buyers)
- `/lab/upload` - Upload episodes with clean form (no JSON typing)
- `/lab/export` - Dataset report and export
- `/lab/integration` - Integration contract documentation

## Files Changed

### New Files Created
1. **Frontend Components**
   - `frontend/app/components/Navbar.tsx` - Global navigation bar

2. **Public Pages**
   - `frontend/app/page.tsx` - Landing page (replaced)
   - `frontend/app/how/page.tsx` - How it works page
   - `frontend/app/waitlist/page.tsx` - Waitlist form
   - `frontend/app/labs/page.tsx` - Lab request form

3. **Worker Portal**
   - `frontend/app/work/queue/page.tsx` - Fix queue (moved from `/jobs`)
   - `frontend/app/work/jobs/[id]/page.tsx` - Job detail (moved from `/jobs/[id]`)

4. **Lab Portal**
   - `frontend/app/lab/upload/page.tsx` - Upload page (moved from `/upload`)
   - `frontend/app/lab/export/page.tsx` - Export page (moved from `/admin/export`)
   - `frontend/app/lab/integration/page.tsx` - Integration documentation

5. **Database Migrations**
   - `supabase/migrations/001_waitlist_and_lab_requests.sql` - New tables for waitlist and lab requests

### Files Modified
1. `frontend/app/layout.tsx` - Added Navbar component
2. `backend/main.py` - Added `/api/waitlist` and `/api/lab_requests` endpoints

### Files Removed/Deprecated
- `frontend/app/jobs/page.tsx` - Moved to `/work/queue`
- `frontend/app/jobs/[id]/page.tsx` - Moved to `/work/jobs/[id]`
- `frontend/app/upload/page.tsx` - Moved to `/lab/upload`
- `frontend/app/admin/export/page.tsx` - Moved to `/lab/export`

## Database Migrations

### New Tables

#### `waitlist`
- `id` (UUID, PK)
- `email` (TEXT, UNIQUE, NOT NULL)
- `role` (TEXT, NOT NULL, CHECK: operator|lab|student|other)
- `note` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ, default NOW())

#### `lab_requests`
- `id` (UUID, PK)
- `name` (TEXT)
- `email` (TEXT)
- `org` (TEXT)
- `use_case` (TEXT)
- `created_at` (TIMESTAMPTZ, default NOW())

**To apply migrations:**
```sql
-- Run the migration file in your Supabase SQL editor
-- File: supabase/migrations/001_waitlist_and_lab_requests.sql
```

## Key Improvements

### 1. Removed JSON Typing
- **Worker Fix Submission**: Replaced JSON textarea with clean form inputs:
  - Duration (seconds)
  - Control frequency (Hz)
  - Auto-calculated steps
  - Optional video upload
  - Success is automatically set to `true`

- **Lab Upload**: Replaced JSON textarea with clean form:
  - Task dropdown
  - Success checkbox
  - Conditional failure fields (reason, time)
  - Duration, Hz, auto-calculated steps
  - Optional video upload

### 2. Enhanced Replay UX
- Auto-seek to failure time on video load
- "Jump to Failure" button
- Visual timeline marker showing failure position
- Clear failure marker display

### 3. Global Navigation
- Consistent navbar across all pages
- Brand: "UMM Data Factory"
- Links: Home, How, Work, Labs, Waitlist

### 4. Status Badges
- Color-coded status pills (open, claimed, submitted, accepted, rejected)
- Consistent styling across worker portal

### 5. Production-Ready UI
- Clean, modern design
- Consistent spacing and max-widths
- Professional landing page
- Clear CTAs and forms

## Backend Endpoints

### New Endpoints
- `POST /api/waitlist` - Add email to waitlist
  - Body: `{ email, role, note? }`
  - Returns: `{ success, entry }`

- `POST /api/lab_requests` - Create lab integration request
  - Body: `{ name, email, org, use_case }`
  - Returns: `{ success, request }`

### Existing Endpoints (Unchanged)
- `POST /api/episodes/upload` - Upload episode
- `GET /api/jobs` - List jobs
- `GET /api/jobs/{job_id}` - Get job detail
- `POST /api/jobs/{job_id}/claim` - Claim job
- `POST /api/jobs/{job_id}/submit_fix` - Submit fix
- `GET /api/export` - Export dataset
- `GET /api/dataset/stats` - Get dataset statistics
- `GET /api/tasks` - Get all tasks

## How to Run Locally

### Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install  # if needed
npm run dev
```

### Database Migrations
1. Open Supabase dashboard
2. Go to SQL Editor
3. Run `supabase/migrations/001_waitlist_and_lab_requests.sql`

## Demo Flow Verification

### Worker Flow
1. Navigate to `/work/queue`
2. See list of jobs with status badges
3. Click "Fix" on a job
4. View job detail at `/work/jobs/[id]`
5. Video auto-seeks to failure time (if video exists)
6. Click "Jump to Failure" button
7. See visual timeline marker
8. Click "Submit Fix"
9. Fill form (duration, hz, optional video)
10. Submit → Job status changes to accepted/rejected

### Lab Flow
1. Navigate to `/lab/upload`
2. Fill form (task, success, failure fields if needed, duration, hz)
3. Upload optional video
4. Submit → Creates job if edge case detected
5. Navigate to `/lab/export`
6. Select task → See dataset report
7. Click "Download Dataset ZIP" → Downloads curated dataset

### Public Flow
1. Navigate to `/` → See landing page
2. Click "Join Waitlist" → Fill form → Success message
3. Click "For Labs" → Fill lab request form → Success message
4. Navigate to `/how` → See how it works page
5. Navigate to `/lab/integration` → See integration contract

## Notes

- All JSON textareas have been removed from the UI
- Forms now build `meta_json` internally before API calls
- Backend endpoints remain mostly unchanged
- Database schema extended with waitlist and lab_requests tables
- No breaking changes to existing functionality

## Next Steps

1. Apply database migrations in Supabase
2. Test all flows end-to-end
3. Verify video replay features work correctly
4. Test form submissions
5. Record demo video

