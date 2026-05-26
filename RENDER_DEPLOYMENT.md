# Render Deployment Guide

## Overview

This project is configured to deploy on Render.com with:
- **Backend**: Node.js/Express API on a web service
- **Frontend**: Vue 3/Vite static site
- **Database**: SQLite with persistent disk storage
- **Auto-deploy**: Deploys automatically when you push to the `deploy` branch

## Prerequisites

1. A GitHub account with this repository connected
2. A Render.com account
3. The `render.yaml` file in your repository root (already created)

## Deployment Steps

### 1. Connect Your Repository to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Blueprint"
3. Select your GitHub repository: `sommerprojekt-wmc-summer-project-brunner-mostbauer-maric`
4. Click "Connect"

### 2. Review the Blueprint

- Render will automatically detect the `render.yaml` file
- Verify the following services appear:
  - `driving-planer-backend` (Web Service)
  - `driving-planer-frontend` (Static Site)

### 3. Configure Environment Variables

Before deploying, set the following secrets in the Render dashboard:

**For Backend Service:**
- `JWT_SECRET`: Set this to a secure random string (use `openssl rand -base64 32`)
  - This is used for signing JWT tokens
  - Keep this secret and never commit it to git

#### Optional Environment Variables:
- `ALLOWED_ORIGINS`: CORS-allowed domains (comma-separated, auto-set to frontend URL)
- `LOG_LEVEL`: debug, info, warn, error (default: info)

### 4. Create Database Disk

The `render.yaml` automatically creates a persistent disk at `/var/data` for SQLite storage. You don't need to manually create it.

### 5. Deploy

#### Option A: Automatic Deployment
1. Create/checkout the `deploy` branch:
   ```bash
   git checkout -b deploy
   git push origin deploy
   ```
2. Any push to the `deploy` branch will trigger automatic deployment

#### Option B: Manual Deployment
1. Go to your Render dashboard
2. Click on `driving-planer-backend` service
3. Click "Manual Deploy" → "Deploy Latest Commit"
4. Repeat for `driving-planer-frontend`

### 6. Verify Deployment

- **Backend**: Visit `https://<your-backend-url>/api-docs` to see Swagger documentation
- **Frontend**: Visit `https://<your-frontend-url>` to see your app
- **Health Check**: Backend has a health endpoint at `/health`

## Build Process

### Backend Build
```bash
cd backend && npm install && npm run build
```
- Compiles TypeScript to JavaScript
- Installs production dependencies
- Estimated time: 2-3 minutes

### Frontend Build
```bash
cd frontend/driving_planer && npm install && npm run build
```
- Builds Vue 3 + Vite production bundle
- Optimizes and minifies assets
- Creates static files in `dist/`
- Estimated time: 1-2 minutes

**Total Build Time**: ~3-5 minutes (with 30-minute timeout)

## Database

### SQLite Storage
- Location: `/var/data/driving_planer.db`
- Persistent across deployments (stored on Render's disk)
- **Disk Size**: 1GB (can be increased if needed)

### Database Initialization
- On first deploy, the database schema will be created from `backend/src/db-structure.ts`
- To add migration/seeding capabilities in the future, uncomment the cron job in `render.yaml`

## Accessing the Application

### Frontend
- URL: `https://driving-planer-frontend.onrender.com`
- Auto-redirects to `/login` for unauthenticated users

### Backend API
- Base URL: `https://driving-planer-backend.onrender.com/api`
- Documentation: `https://driving-planer-backend.onrender.com/api-docs`

### Database Connection String
- Automatically set to `/var/data/driving_planer.db`
- No external connection needed

## Troubleshooting

### Build Fails
1. Check build logs in Render dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compilation: `npm run build` locally first

### Backend 500 Errors
1. Check Render logs: `Logs` tab in the service dashboard
2. Verify `JWT_SECRET` is set
3. Ensure database file is created: check `/var/data/` directory

### Frontend Shows Blank Page
1. Check browser console for errors (F12)
2. Verify `VITE_API_URL` is correctly pointing to backend
3. Backend service must be deployed and running first

### Database Issues
1. Database persists across deployments (same file used)
2. To reset: go to service settings, delete the disk, and redeploy
3. For backups: download from Render dashboard under "Disks"

## Redeploying

### After Code Changes
1. Commit changes locally: `git commit -m "your message"`
2. Push to deploy branch: `git push origin deploy`
3. Render automatically deploys
4. Check logs: Render dashboard → Service → Logs

### Rollback
If deployment breaks:
1. Go to Render dashboard
2. Click "Deploys" tab
3. Select previous working deployment
4. Click "Redeploy"

## Performance Notes

- **Free Tier Limitations**:
  - Services spin down after 15 minutes of inactivity
  - First request after spindown takes ~30 seconds
  - Suitable for development/demo only

- **For Production**:
  - Upgrade to paid tier to prevent spindowns
  - Increase instance type for better performance
  - Consider PostgreSQL for better scalability

## Security Considerations

### Secrets Management
- Never commit `.env` files to git
- All secrets (JWT_SECRET, DB passwords, etc.) set via Render dashboard
- Render encrypts all environment variables

### HTTPS
- All services use HTTPS by default
- CORS is automatically configured between frontend and backend

### Database
- SQLite is suitable for small to medium projects
- For production with many concurrent users, consider PostgreSQL

## Environment Variables Reference

| Variable | Service | Required | Default | Example |
|----------|---------|----------|---------|---------|
| `NODE_ENV` | Backend | Yes | production | production |
| `JWT_SECRET` | Backend | Yes | - | super-secret-key-here |
| `DATABASE_URL` | Backend | Yes | /var/data/driving_planer.db | /var/data/driving_planer.db |
| `PORT` | Backend | No | 3000 | 3000 |
| `CORS_ORIGIN` | Backend | No | Frontend URL | https://frontend.onrender.com |
| `VITE_API_URL` | Frontend | No | Auto-detected | https://backend.onrender.com/api |

## Next Steps

1. Push to `deploy` branch to trigger first deployment
2. Monitor logs while building
3. Test login flow with a test account
4. If issues occur, check troubleshooting section
5. Consider upgrading to paid tier for production use

## Support

- Render Docs: https://render.com/docs
- Project Issues: Check GitHub issues
- Local Development: `./start.sh --dev`

---

**Last Updated**: 2026-05-26
**Branch**: deploy
**Deployment Method**: Automatic on push
