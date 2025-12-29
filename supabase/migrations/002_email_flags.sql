-- Add email tracking flags to waitlist table
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE;

-- Add email tracking flags to lab_requests table
ALTER TABLE lab_requests 
ADD COLUMN IF NOT EXISTS confirmation_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admin_notified BOOLEAN DEFAULT FALSE;

-- Ensure unique constraint on waitlist.email (should already exist, but make sure)
-- This prevents duplicate signups from spamming emails
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'waitlist_email_key'
    ) THEN
        ALTER TABLE waitlist ADD CONSTRAINT waitlist_email_key UNIQUE (email);
    END IF;
END $$;

-- Add indexes for email flag queries
CREATE INDEX IF NOT EXISTS idx_waitlist_email_sent ON waitlist(email_sent);
CREATE INDEX IF NOT EXISTS idx_lab_requests_confirmation_sent ON lab_requests(confirmation_sent);
CREATE INDEX IF NOT EXISTS idx_lab_requests_admin_notified ON lab_requests(admin_notified);



