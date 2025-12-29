# Quick Guide: Verify Domain in Resend

## Why Verify a Domain?

- ✅ Send emails to **any recipient** (not just your verified email)
- ✅ Better deliverability (less likely to go to spam)
- ✅ Professional sender address (e.g., `noreply@yourdomain.com`)
- ✅ Higher email limits

## Quick Steps

### 1. Add Domain in Resend
1. Go to https://resend.com/domains
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yatinseelam.com`)
4. Click **"Add"**

### 2. Copy DNS Records
Resend will show you DNS records like:
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all
```

### 3. Add to Your DNS Provider

**Find your DNS provider:**
- Check where you bought your domain
- Or use: https://lookup.icann.org to find your registrar

**Common providers:**
- **Cloudflare**: DNS → Records → Add record
- **GoDaddy**: DNS Management → Add
- **Namecheap**: Advanced DNS → Add New Record
- **Google Domains**: DNS → Custom Records

**Add each record:**
- Copy **Type**, **Name**, and **Value** exactly from Resend
- Save the record
- Repeat for all records Resend shows

### 4. Wait & Verify
- Wait 15-30 minutes (DNS propagation)
- Go back to https://resend.com/domains
- Click **"Verify"** or **"Check Verification"**
- Status should change to **"Verified"** ✅

### 5. Update Your Code
Once verified, update `backend/.env`:
```env
EMAIL_FROM=UMM Data Factory <noreply@yourdomain.com>
```

Replace `yourdomain.com` with your actual domain.

### 6. Restart Backend
```bash
cd backend
# Restart your server
uvicorn main:app --reload
```

## Testing

After verification, test by:
1. Go to http://localhost:3000/waitlist
2. Submit with any email address
3. Email should arrive (and not go to spam!)

## Need Help?

- Resend Docs: https://resend.com/docs/dashboard/domains/introduction
- Check DNS: https://dns.email
- Resend Support: support@resend.com

## Common Issues

**"Verification failed"**
- Double-check DNS records match exactly
- Wait longer (up to 72 hours for some providers)
- Use https://dns.email to verify records are live

**"Can't find DNS settings"**
- Check your domain registrar's help docs
- Look for "DNS Management" or "DNS Settings"

**"Records not showing up"**
- Some providers take longer to propagate
- Try checking with https://mxtoolbox.com



