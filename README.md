# Robot Motion Data Platform MVP

A full-stack platform for ingesting, detecting edge cases, and managing fixes for robot motion data.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage

## Prerequisites

1. **Supabase Project**: Create a Supabase project at https://supabase.com
2. **Python 3.9+**: For the FastAPI backend
3. **Node.js 18+**: For the Next.js frontend
4. **Resend Account**: Create a free account at https://resend.com for transactional emails

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Go to Storage and create a bucket named `episodes` (make it public for signed URLs, or configure RLS policies)
4. Get your project URL and service role key from Settings > API

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DEV_USER_ID=00000000-0000-0000-0000-000000000000

# Email Configuration (Resend)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=UMM Data Factory <onboarding@resend.dev>
EMAIL_ADMIN_TO=your-email@yourdomain.com
EMAIL_REPLY_TO=your-email@yourdomain.com
EMAIL_ENABLED=true
```

**Email Setup (Resend)**:
1. Sign up at https://resend.com
2. Go to API Keys and create a new key
3. Copy the API key to `RESEND_API_KEY` in your `.env` file
4. For development, you can use Resend's default domain (`onboarding@resend.dev`)
5. For production, verify your own domain in Resend dashboard
6. Set `EMAIL_ENABLED=false` to disable emails during local development

Start the backend:

```bash
uvicorn main:app --reload
```

The API will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Usage

### 1. Upload Episodes

- Navigate to `/upload`
- Paste a JSON meta file (see format below)
- Optionally upload a video file
- Submit to create an episode and auto-detect edge cases

### 2. Fix Queue

- Navigate to `/jobs` to see all open edge case jobs
- Click "Fix" on any job to view details
- Watch the replay video and see failure information
- Claim the job and submit a fix

### 3. Export Dataset

- Navigate to `/admin/export`
- Select a task
- Click "Export Dataset" to download a ZIP with all accepted episodes and fixes

## Episode Format

### Meta JSON Example

```json
{
  "task_id": "pick_v1",
  "hz": 20,
  "steps": 200,
  "duration_sec": 10.0,
  "success": false,
  "failure_reason": "slip_after_grasp",
  "failure_time_sec": 8.2
}
```

### Required Fields

- `task_id`: Task identifier (must exist in tasks table)
- `hz`: Frequency (int)
- `steps`: Number of steps (int)
- `duration_sec`: Duration in seconds (float)
- `success`: Whether episode succeeded (boolean)

### Optional Fields

- `failure_reason`: Reason for failure (string)
- `failure_time_sec`: Time when failure occurred (float)

## QC Rules

### Edge Case Detection

An episode is marked as an edge case if:
- `success == false` OR
- `duration_sec > 20` OR
- `failure_reason` is not null

### Episode Acceptance

An episode is accepted if:
- `success == true` AND
- `duration_sec <= 20`

### Fix Acceptance

A fix is accepted if:
- `success == true` AND
- `duration_sec <= 10`

### Quality Score

- Starts at 50
- +30 if `success == true`
- -20 if `duration_sec > 15`
- -10 if `failure_reason` is present
- Clamped between 0 and 100

## API Endpoints

- `POST /api/episodes/upload` - Upload an episode
- `GET /api/jobs?status=open` - List jobs
- `GET /api/jobs/{job_id}` - Get job details
- `POST /api/jobs/{job_id}/claim` - Claim a job
- `POST /api/jobs/{job_id}/submit_fix` - Submit a fix
- `GET /api/export?task_id={task_id}` - Export dataset
- `GET /api/tasks` - List all tasks

## Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Backend environment variables
├── frontend/
│   ├── app/                 # Next.js app directory
│   │   ├── jobs/           # Jobs list and detail pages
│   │   ├── upload/       # Upload page
│   │   ├── admin/export/  # Export page
│   │   └── layout.tsx     # Root layout
│   ├── package.json
│   └── .env.local          # Frontend environment variables
├── supabase/
│   └── schema.sql          # Database schema
└── README.md
```

## Notes

- For MVP, authentication uses a dev user ID constant
- Videos are stored in Supabase Storage bucket `episodes`
- Signed URLs are generated for video access (1 hour expiry)
- All timestamps are in UTC

