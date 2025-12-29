# Email Setup Guide (Resend)

This document provides a complete guide for setting up transactional emails using Resend.

## Overview

The application sends transactional emails for:
1. **Waitlist signups** - Welcome email to new signups
2. **Lab requests** - Confirmation email to requester + notification to admin
3. **Worker accounts** (optional, not yet implemented)

## Setup Steps

### 1. Create Resend Account

1. Sign up at https://resend.com
2. Go to **API Keys** in the dashboard
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Configure Backend

Add to `backend/.env`:

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=UMM Data Factory <onboarding@resend.dev>
EMAIL_ADMIN_TO=your-email@yourdomain.com
EMAIL_REPLY_TO=your-email@yourdomain.com
EMAIL_ENABLED=true
```

**Notes**:
- For development, use Resend's default domain: `onboarding@resend.dev`
- For production, verify your own domain in Resend dashboard
- Set `EMAIL_ENABLED=false` to disable emails during local development

### 3. Configure Frontend

Add to `frontend/.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Database Migration

Apply the email flags migration:

```sql
-- Run in Supabase SQL Editor
-- File: supabase/migrations/002_email_flags.sql
```

This adds:
- `waitlist.email_sent` - Tracks if welcome email was sent
- `lab_requests.confirmation_sent` - Tracks if confirmation email was sent
- `lab_requests.admin_notified` - Tracks if admin notification was sent
- Unique constraint on `waitlist.email` to prevent duplicates

### 5. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This installs the `resend` package.

## Testing

### Test Script

Run the test script to verify email setup:

```bash
cd backend
python scripts/test_emails.py
```

This sends a test welcome email to `EMAIL_ADMIN_TO`.

### Manual Testing

1. **Waitlist Signup**:
   - Go to http://localhost:3000/waitlist
   - Submit form with your email
   - Check inbox for welcome email
   - Try submitting again with same email - should not send duplicate

2. **Lab Request**:
   - Go to http://localhost:3000/labs
   - Submit form with your email
   - Check inbox for confirmation email
   - Check `EMAIL_ADMIN_TO` inbox for admin notification

## Email Templates

Templates are defined in `backend/email_templates.py`:

- `waitlist_welcome()` - Welcome email for waitlist signups
- `lab_request_confirmation()` - Confirmation for lab requests
- `lab_request_admin_notification()` - Admin notification for lab requests

All templates are HTML-based and mobile-responsive.

## Error Handling

The email system is designed to be resilient:

- **Email failures don't crash requests** - If email fails, the database record is still saved
- **Idempotency** - Email flags prevent duplicate sends
- **Graceful degradation** - If `EMAIL_ENABLED=false`, emails are logged but not sent
- **Logging** - All email attempts are logged for debugging

## Troubleshooting

### Emails not sending

1. Check `EMAIL_ENABLED=true` in `.env`
2. Verify `RESEND_API_KEY` is correct
3. Check Resend dashboard for delivery status
4. Review backend logs for error messages

### Duplicate emails

- The system uses database flags to prevent duplicates
- If you see duplicates, check that migration `002_email_flags.sql` was applied

### Local Development

Set `EMAIL_ENABLED=false` to skip emails during development. The system will log email attempts but not send them.

## Production Checklist

- [ ] Resend account created and API key obtained
- [ ] Domain verified in Resend dashboard (for production)
- [ ] `EMAIL_FROM` updated to use verified domain
- [ ] `EMAIL_ADMIN_TO` set to admin email
- [ ] Database migration `002_email_flags.sql` applied
- [ ] Test emails sent successfully
- [ ] Waitlist signup sends welcome email
- [ ] Lab request sends confirmation + admin notification
- [ ] Duplicate signups don't send duplicate emails

## API Endpoints

### POST /api/waitlist

Accepts:
```json
{
  "email": "user@example.com",
  "role": "operator",
  "note": "Optional note",
  "name": "Optional name"
}
```

Sends welcome email if new signup or `email_sent=false`.

### POST /api/lab_requests

Accepts:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "org": "University Lab",
  "use_case": "Robot learning research"
}
```

Sends:
1. Confirmation email to requester
2. Notification email to admin (`EMAIL_ADMIN_TO`)

## Files Created/Modified

- `backend/emailer.py` - Email service using Resend
- `backend/email_templates.py` - HTML email templates
- `backend/main.py` - Updated endpoints with email logic
- `supabase/migrations/002_email_flags.sql` - Database migration
- `backend/scripts/test_emails.py` - Test script
- `frontend/app/waitlist/page.tsx` - Updated with name field and email confirmation message
- `frontend/app/labs/page.tsx` - Updated with email confirmation message
- `README.md` - Added email setup instructions
- `QUICKSTART.md` - Added email testing section



