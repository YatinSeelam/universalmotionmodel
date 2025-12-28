# Step-by-Step: Add DNS Records to Your Domain

## What You Need to Do

You need to add **3 DNS records** to your domain provider. All are currently showing as "Pending" in Resend.

## Required Records (Copy from Resend Dashboard)

### 1. Domain Verification (DKIM)
- **Type:** `TXT`
- **Name:** `resend._domainkey`
- **Content:** (Copy the full value from Resend - starts with `p=MIGfMAOGCSqGSIb3DQEB...`)
- **TTL:** Auto (or 3600)

### 2. Enable Sending - SPF (TXT)
- **Type:** `TXT`
- **Name:** `send`
- **Content:** (Copy the full value from Resend - starts with `v=spf1 include:amazons...`)
- **TTL:** Auto (or 3600)

### 3. Enable Sending - MX
- **Type:** `MX`
- **Name:** `send`
- **Content:** (Copy the full value from Resend - starts with `feedback-smtp.us-east-...`)
- **Priority:** `10`
- **TTL:** Auto (or 3600)

### 4. DMARC (Optional but Recommended)
- **Type:** `TXT`
- **Name:** `_dmarc`
- **Content:** `v=DMARC1; p=none;`
- **TTL:** Auto (or 3600)

## Steps to Add Records

### Step 1: Find Your DNS Provider

**Where did you buy your domain?**
- Check your email for domain purchase confirmation
- Or use: https://lookup.icann.org to find your registrar

**Common providers:**
- Cloudflare
- GoDaddy
- Namecheap
- Google Domains
- Name.com
- Hover

### Step 2: Access DNS Management

Log into your domain registrar and find:
- "DNS Management"
- "DNS Settings"
- "Advanced DNS"
- "DNS Records"

### Step 3: Add Each Record

For each record above:

1. Click "Add Record" or "Create Record"
2. Select the **Type** (TXT or MX)
3. Enter the **Name** exactly as shown (e.g., `resend._domainkey` or `send`)
4. Paste the **Content/Value** exactly from Resend
5. Set **TTL** to Auto or 3600
6. For MX records, also set **Priority** (10 for the send MX record)
7. Click "Save" or "Add"

**Important:**
- Copy values EXACTLY - no typos
- Some providers auto-append domain name - if so, add a trailing `.` at the end
- Save each record separately

### Step 4: Wait for DNS Propagation

- Usually takes **15-30 minutes**
- Can take up to 72 hours (rare)
- You can check if records are live: https://dns.email

### Step 5: Verify in Resend

1. Go back to https://resend.com/domains
2. Click "Verify" or "Check Verification"
3. Status should change from "Pending" to "Verified" ✅

## Provider-Specific Instructions

### Cloudflare
1. Log in → Select your domain
2. Go to **DNS** → **Records**
3. Click **Add record**
4. Fill in Type, Name, Content
5. Click **Save**

### GoDaddy
1. Log in → My Products
2. Click **DNS** next to your domain
3. Scroll to **Records** section
4. Click **Add** button
5. Fill in Type, Name, Value
6. Click **Save**

### Namecheap
1. Log in → Domain List
2. Click **Manage** next to your domain
3. Go to **Advanced DNS** tab
4. Click **Add New Record**
5. Fill in Type, Host, Value
6. Click **Save**

### Google Domains
1. Log in → My domains
2. Click your domain
3. Go to **DNS** tab
4. Scroll to **Custom records**
5. Click **Create new record**
6. Fill in Type, Name, Data
7. Click **Save**

## Troubleshooting

**"Verification still pending"**
- Wait longer (up to 72 hours)
- Double-check records match exactly
- Use https://dns.email to verify records are live
- Make sure you added records to the correct DNS provider

**"Can't find DNS settings"**
- Check your registrar's help documentation
- Look for "DNS Management" or "DNS Settings"
- Contact your registrar's support

**"Records not showing up"**
- DNS propagation can take time
- Try checking with https://mxtoolbox.com
- Make sure you saved the records correctly

## After Verification

Once all records show "Verified" ✅:

1. Update `backend/.env`:
   ```env
   EMAIL_FROM=UMM Data Factory <noreply@yourdomain.com>
   ```
   Replace `yourdomain.com` with your actual domain.

2. Restart your backend:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

3. Test by submitting the waitlist form with any email address!

## Need Help?

If you tell me which DNS provider you're using, I can give you exact step-by-step instructions for that provider.

