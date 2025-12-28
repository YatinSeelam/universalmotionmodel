# Resend Domain Verification Setup

## Issue

When using Resend's default domain (`onboarding@resend.dev`), you can **only send emails to your own verified email address**. This is a Resend free tier limitation.

**Error message:**
```
You can only send testing emails to your own email address (yatinsaireddyseelam@gmail.com). 
To send emails to other recipients, please verify a domain at resend.com/domains
```

## Solutions

### Option 1: Verify Your Own Domain (Recommended for Production)

**Step-by-Step Guide:**

1. **Go to Resend Domains Dashboard**
   - Visit https://resend.com/domains
   - Log in to your Resend account

2. **Add Your Domain**
   - Click "Add Domain" button
   - Enter your domain name (e.g., `yourdomain.com` or `yatinseelam.com`)
   - Click "Add"

3. **Get DNS Records from Resend**
   Resend will show you DNS records to add. You'll typically need:
   - **SPF Record** (TXT): Authorizes Resend to send emails
   - **DKIM Record** (TXT): Ensures email authenticity
   - **DMARC Record** (TXT, optional but recommended): Email security policy

4. **Add DNS Records to Your Domain Provider**
   - Go to your domain registrar/DNS provider (e.g., GoDaddy, Namecheap, Cloudflare, Google Domains)
   - Navigate to DNS Management / DNS Settings
   - Add each record exactly as Resend shows:
     - **Type**: TXT (for SPF, DKIM, DMARC)
     - **Name/Host**: Copy exactly from Resend (might be `@` or `_resend` or similar)
     - **Value**: Copy the full value from Resend
     - **TTL**: Use default (usually 3600)

   **Important Tips:**
   - Some DNS providers auto-append the domain name. If so, add a trailing period (`.`) at the end of the value
   - Example: `feedback-smtp.eu-west-1.amazonses.com.` (with period)
   - Double-check for typos - even small errors prevent verification

5. **Wait for DNS Propagation**
   - DNS changes can take 5 minutes to 72 hours (usually 15-30 minutes)
   - You can check if records are live using: https://dns.email or https://mxtoolbox.com

6. **Verify in Resend Dashboard**
   - Go back to https://resend.com/domains
   - Click "Verify DNS Records" or "Check Verification"
   - Resend will validate the records
   - Status will change to "Verified" ✅ when complete

7. **Update Your `.env` File**
   Once verified, update your backend `.env`:
   ```env
   EMAIL_FROM=UMM Data Factory <noreply@yourdomain.com>
   ```
   Replace `yourdomain.com` with your actual verified domain.

8. **Restart Your Backend**
   ```bash
   # Stop and restart your FastAPI server
   uvicorn main:app --reload
   ```

**Common DNS Providers:**
- **Cloudflare**: DNS → Records → Add record
- **GoDaddy**: DNS Management → Add
- **Namecheap**: Advanced DNS → Add New Record
- **Google Domains**: DNS → Custom Records → Add

**Troubleshooting:**
- If verification fails, double-check the DNS records match exactly
- Use https://dns.email to verify records are publicly visible
- Make sure you're adding records to the correct DNS provider (check nameservers)
- Wait a bit longer if records were just added (propagation delay)

### Option 2: Use Your Verified Email for Testing (Quick Fix)

For testing purposes, you can temporarily change the recipient to your verified email:

1. In your `.env`, make sure `EMAIL_ADMIN_TO` is set to your verified email
2. For waitlist testing, submit the form with your own email address
3. For lab requests, use your own email in the form

### Option 3: Use Resend's Test Mode (Development Only)

For local development, you can set `EMAIL_ENABLED=false` to skip actual email sending:

```env
EMAIL_ENABLED=false
```

The system will log email attempts but won't actually send them.

## Current Status

- ✅ Resend API key configured
- ✅ Email templates ready
- ✅ Backend integration complete
- ⚠️  Domain not verified (can only send to: `yatinsaireddyseelam@gmail.com`)

## Next Steps

1. **For Production**: Verify your domain at https://resend.com/domains
2. **For Testing**: Use your verified email (`yatinsaireddyseelam@gmail.com`) in test submissions
3. **For Development**: Set `EMAIL_ENABLED=false` to skip emails

## Testing with Current Setup

Since you can only send to your verified email, test the waitlist by:

1. Go to http://localhost:3000/waitlist
2. Submit the form with email: `yatinsaireddyseelam@gmail.com`
3. Check your inbox for the welcome email

Once you verify a domain, you can send to any email address!

