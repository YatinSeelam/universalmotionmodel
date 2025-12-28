# Quick Start Guide

## 1. Supabase Setup (One-time)

1. Create project at https://supabase.com
2. Run SQL from `supabase/schema.sql` in SQL Editor
3. Create Storage bucket named `episodes` (Settings > Storage)
4. Copy your project URL and service role key

## 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
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
5. Set `EMAIL_ENABLED=false` to disable emails during local development

Start the backend:

```bash
uvicorn main:app --reload
```

## 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

## 4. Seed Fake Data (Optional)

Generate 10 fake episodes (5 failures, 5 successes) to populate the Fix Queue:

```bash
cd backend
python seed_fake_data.py
```

This will:
- Create task "pick_v1" if it doesn't exist
- Upload 10 episodes using jarvis.mp4
- Create jobs for edge cases (failures)
- Print summary of uploads

**Note**: Make sure jarvis.mp4 is in the project root directory.

## 5. Test Email Functionality (Optional)

Test that emails are working:

```bash
cd backend
python scripts/test_emails.py
```

This will send a test welcome email to `EMAIL_ADMIN_TO`. Make sure `EMAIL_ENABLED=true` in your `.env` file.

## 6. Test the Flow

1. Go to http://localhost:3000/waitlist to test waitlist signup (sends welcome email)
2. Go to http://localhost:3000/labs to test lab request (sends confirmation + admin notification)
3. Go to http://localhost:3000/jobs to see the Fix Queue (after seeding)
4. Click "Fix" on any job to view details and submit a fix
5. Or go to http://localhost:3000/upload to upload your own episode
6. Go to http://localhost:3000/admin/export to download dataset

## Example Episode Meta JSON

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

**Note**: Make sure to create a task first in Supabase:
```sql
INSERT INTO tasks (id, name, description) VALUES ('pick_v1', 'Pick Task v1', 'Basic pick and place');
```

## Email Verification Checklist

After setting up Resend, verify emails are working:

- [ ] Submit waitlist form at `/waitlist` → receives welcome email
- [ ] Submit lab request at `/labs` → receives confirmation email
- [ ] Admin receives notification email for lab request
- [ ] Duplicate waitlist signups don't send duplicate emails
- [ ] Test script (`python scripts/test_emails.py`) sends successfully

**Troubleshooting**:
- If emails aren't sending, check `EMAIL_ENABLED=true` in `.env`
- Check Resend dashboard for delivery status and errors
- Verify `RESEND_API_KEY` is correct
- For local dev, you can set `EMAIL_ENABLED=false` to skip emails

