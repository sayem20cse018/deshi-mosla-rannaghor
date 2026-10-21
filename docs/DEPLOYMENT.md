# Deployment & Environment Setup Guide

## Why Login is Not Working on Vercel

The most common reason: **`NEXT_PUBLIC_API_URL` is not set in Vercel**.

Without this variable, the frontend falls back to `http://localhost:5000` which
does not exist on Vercel's servers. Every API call (including login) will fail
with "Cannot reach server".

---

## STEP 1 — Set Vercel Environment Variables

Go to: https://vercel.com/dashboard
-> Select your project (deshi-moslar-rannaghar)
-> Settings -> Environment Variables

Add ALL of the following (select Environment: Production + Preview + Development):

| Variable Name | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://deshi-mosla-rannaghor-production.up.railway.app/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | `Deshi Moslar Rannaghar` |
| `NEXT_PUBLIC_APP_NAME_EN` | `Deshi Moslar Rannaghar` |
| `NEXT_PUBLIC_APP_URL` | `https://deshi-moslar-rannaghar.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `+8801739515598` |
| `NEXT_PUBLIC_FACEBOOK_URL` | `https://facebook.com/deshimoslar` |
| `NEXT_PUBLIC_INSTAGRAM_URL` | `https://instagram.com/deshimoslar` |
| `NEXT_PUBLIC_YOUTUBE_URL` | `https://youtube.com/deshimoslar` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `sybyd7tu` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `deshi_moslar_uploads` |

**After adding all variables, click "Redeploy" (Deployments tab -> ... -> Redeploy)**

---

## STEP 2 — Set Railway Environment Variables

Go to: https://railway.app/dashboard
-> Select your backend service
-> Variables tab

Add ALL of the following:

| Variable Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `API_PREFIX` | `api/v1` |
| `FRONTEND_URL` | `https://deshi-moslar-rannaghar.vercel.app` |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_iGWNf4elIn8V@ep-shiny-butterfly-aet9u7jc-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `JWT_SECRET` | `deshi-moslar-super-secret-jwt-key-2025-minimum-32-characters` |
| `JWT_EXPIRES_IN` | `7d` |
| `JWT_REFRESH_SECRET` | `deshi-moslar-refresh-secret-key-2025-minimum-32-characters` |
| `JWT_REFRESH_EXPIRES_IN` | `30d` |
| `ADMIN_JWT_SECRET` | `deshi-moslar-admin-jwt-secret-2025-minimum-32-characters` |
| `ADMIN_JWT_EXPIRES_IN` | `1d` |
| `BCRYPT_ROUNDS` | `12` |
| `CLOUDINARY_CLOUD_NAME` | `sybyd7tu` |
| `CLOUDINARY_API_KEY` | `795273171192616` |
| `CLOUDINARY_API_SECRET` | `yMQzXBelcdYEhfx8PlGnwQBzeJs` |
| `SSLCOMMERZ_STORE_ID` | `testbox` |
| `SSLCOMMERZ_STORE_PASSWORD` | `qwerty` |
| `SSLCOMMERZ_IS_LIVE` | `false` |
| `SSLCOMMERZ_SUCCESS_URL` | `https://deshi-moslar-rannaghar.vercel.app/payment/success` |
| `SSLCOMMERZ_FAIL_URL` | `https://deshi-moslar-rannaghar.vercel.app/payment/failed` |
| `SSLCOMMERZ_CANCEL_URL` | `https://deshi-moslar-rannaghar.vercel.app/payment/cancel` |
| `WHATSAPP_NUMBER` | `+8801739515598` |
| `THROTTLE_TTL` | `60` |
| `THROTTLE_LIMIT` | `100` |
| `CORS_ORIGINS` | `https://deshi-moslar-rannaghar.vercel.app` |

Railway auto-restarts after you add variables. No manual redeploy needed.

---

## STEP 3 — Test Admin Login

URL: https://deshi-moslar-rannaghar.vercel.app/admin/login

**Admin credentials:**
- Email: `admin@deshimoslar.com`
- Password: `Admin@12345`

**Super Admin credentials:**
- Email: `superadmin@deshimoslar.com`
- Password: `SuperAdmin@2025`

If login still fails after setting env vars, check STEP 4.

---

## STEP 4 — Verify Backend is Running

Open in browser:
```
https://deshi-mosla-rannaghor-production.up.railway.app/api/v1
```

You should see a JSON response. If you see an error or timeout, the Railway
service may be sleeping (free tier). Click "Deploy" in Railway to wake it up.

---

## STEP 5 — Verify Admin Users in Database

If login returns "Invalid email or password", the admin users may not be in the
database yet. Run this command locally:

```bash
cd backend
npx ts-node --transpile-only scripts/create-admin.ts
```

This creates both admin users in the Neon PostgreSQL database.

---

## Local Development Setup

1. Clone the repo
2. Copy `.env.example` to `.env` in `backend/` folder
3. Copy `.env.example` to `.env.local` in `frontend/` folder
4. Fill in your actual values
5. Run backend: `cd backend && npm run start:dev`
6. Run frontend: `cd frontend && npm run dev`
7. Open: http://localhost:3000/admin/login

---

## Architecture

```
Browser (Vercel)
    |
    | HTTPS API calls
    v
Backend (Railway) <---> Database (Neon PostgreSQL)
```

- Frontend: Next.js 14 deployed on Vercel
- Backend: NestJS deployed on Railway
- Database: PostgreSQL hosted on Neon
- Images: Cloudinary

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| "Cannot reach server" | `NEXT_PUBLIC_API_URL` not set in Vercel | Add env var in Vercel dashboard, redeploy |
| "Invalid email or password" | Admin user not in DB | Run `create-admin.ts` script |
| "Access denied" | Logged in as CUSTOMER role | Use admin email, not customer account |
| 502 Bad Gateway | Railway service sleeping | Open Railway dashboard, deploy/restart service |
| CORS error in browser console | `CORS_ORIGINS` not set in Railway | Add `CORS_ORIGINS` var in Railway |