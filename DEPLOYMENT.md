# Deployment Guide

## Frontend Deployment (Vercel)

The frontend is a Next.js app that should be deployed to Vercel.

### Steps:
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. **Important Settings:**
   - **Root Directory:** Set to `frontend`
   - **Framework Preset:** Next.js (auto-detected)
   - **Build Command:** `npm run build` (runs automatically in `frontend/`)
   - **Output Directory:** `.next` (default for Next.js)

### Environment Variables:
Add these in Vercel project settings → Environment Variables:
- `NEXT_PUBLIC_API_URL` = Your backend URL (e.g., `https://your-backend.railway.app` or `https://your-backend.render.com`)

### The `vercel.json` file:
The project includes a `vercel.json` that tells Vercel the root is `frontend/`. This should fix the 404 error.

---

## Backend Deployment (Railway / Render / Fly.io)

The backend is a Python FastAPI app that needs to be deployed separately.

### Option 1: Railway (Recommended - Easiest)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python
5. **Settings:**
   - **Root Directory:** `backend`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables:**
     - Add all your database URLs, API keys, etc.

### Option 2: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. **Settings:**
   - **Name:** `your-backend-name`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** `backend`

### Option 3: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. In the `backend/` directory, run: `fly launch`
3. Follow the prompts
4. Deploy: `fly deploy`

---

## Important Notes:

1. **CORS:** Make sure your backend allows requests from your Vercel frontend URL
   - In `backend/main.py`, add your Vercel domain to CORS origins

2. **Database:** Your backend needs access to your database (Supabase/PostgreSQL)
   - Add database connection string as environment variable

3. **Environment Variables:**
   - **Frontend (Vercel):** Only `NEXT_PUBLIC_API_URL` (points to backend)
   - **Backend (Railway/Render):** All your API keys, database URLs, etc.

4. **Testing:**
   - After deploying backend, get the URL (e.g., `https://your-app.railway.app`)
   - Update `NEXT_PUBLIC_API_URL` in Vercel to point to that URL
   - Redeploy frontend

---

## Quick Checklist:

- [ ] Backend deployed and running (check by visiting `/docs` endpoint)
- [ ] Backend URL added to Vercel as `NEXT_PUBLIC_API_URL`
- [ ] CORS configured in backend to allow Vercel domain
- [ ] Database connection working in backend
- [ ] Frontend builds successfully on Vercel
- [ ] Test the app - no 404 errors!

