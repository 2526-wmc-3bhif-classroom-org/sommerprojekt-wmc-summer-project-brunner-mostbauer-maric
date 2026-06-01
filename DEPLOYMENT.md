# Deployment Guide

This guide provides the instructions and technical details for building, configuring, and deploying both the backend and frontend services of the **Driving Planer** application.

---

## 🚀 Architecture Overview

*   **Backend API**: Deployed on [Railway](https://railway.app/) using the Railway CLI.
*   **Frontend**: Hosted on [GitHub Pages](https://pages.github.com/) with automated deployments via GitHub Actions.

---

## 1. Backend Deployment (Railway)

The backend is a Node.js + Express application written in TypeScript. It is deployed as part of a monorepo setup directly from the repository root.

### Technical Architecture
*   **Engine**: Node.js v22
*   **Runtime Execution**: Executed directly via `tsx` (TypeScript Execute) without a separate pre-compilation step.
*   **Dependency Management**: Configured using **NPM Workspaces** in the root `package.json`. This ensures all backend-specific native dependencies (e.g., `better-sqlite3`, `bcrypt`) are correctly installed and built for the container architecture during Railway's build step.

### Configuration Files

#### A. Root Configuration (`/railway.json`)
Overrides the Railway dashboard's startup command to point to the monorepo's backend start script:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "deploy": {
    "startCommand": "npm run start:backend"
  }
}
```

#### B. Subdirectory Fallback (`/backend/railway.json`)
Provides a fallback if the Railway service's **Root Directory** is explicitly set to `/backend` in the dashboard:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "deploy": {
    "startCommand": "npm start"
  }
}
```

### Required Environment Variables

Configure these variables inside your Railway Service under the **Variables** tab:

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `PORT` | The port the Express application will listen on. | `3000` (Assigned automatically by Railway) |
| `NODE_ENV` | Running environment mode. | `production` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens. | *A cryptographically secure random string* |
| `CORS_ORIGIN` | Allowed origin for frontend requests. | `https://2526-wmc-3bhif-classroom-org.github.io` |

### How to Deploy

To deploy a new version of the backend, execute the following command from the **repository root**:

```bash
npx railway up
```
This indexes your local workspace, packages the files, uploads them to Railway, and triggers a container build using **Railpack/Nixpacks**.

---

## 2. Frontend Deployment (GitHub Pages)

The frontend is a Vue 3 single-page application built using Vite and Tailwind CSS. It is configured to run under a repository subdirectory prefix.

### Technical Architecture
*   **Vite Base Path**: Configured as `/sommerprojekt-wmc-summer-project-brunner-mostbauer-maric/` in `vite.config.ts`.
*   **Production API URL**: Managed via `frontend/driving_planer/.env.production`.

### Automated Deployment (GitHub Actions)

Deployments are **100% automated** via the GitHub Actions workflow file:
`/.github/workflows/deploy-frontend.yml`

#### How it works:
1. Pushing or merging code into the **`deploy` branch** that touches any files in `frontend/driving_planer/**` triggers the workflow.
2. The runner installs dependencies using `npm ci` inside `frontend/driving_planer`.
3. The runner builds the static bundle using `npm run build` (injecting `VITE_API_URL` from production environment settings).
4. The output `dist` directory is packaged and deployed directly to GitHub Pages.

### Manual Build / Local Verification

If you need to test the production build locally before pushing:

1. Navigate to the frontend directory:
   ```bash
   cd frontend/driving_planer
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 🔍 Troubleshooting & Common Issues

### 1. `Cannot find module '/app/server.js'`
*   **Cause**: Railway is attempting to run a legacy `server.js` startup entry point that has been removed from the repository.
*   **Solution**: Ensure that both `railway.json` files are committed in the repository. These configuration-as-code files override the dashboard's "Start Command" settings and instruct Railway to run `npm run start:backend` (root) or `npm start` (backend directory).

### 2. CORS Errors in the Frontend
*   **Cause**: The backend's allowed origins do not match the GitHub Pages URL.
*   **Solution**: Check `backend/src/app.ts`. Ensure your exact GitHub Pages origin (e.g., `https://2526-wmc-3bhif-classroom-org.github.io`) is listed in the `allowedOrigins` array.

### 3. Missing NPM Dependencies during Build
*   **Cause**: The build step ran from the project root but couldn't find the dependencies for the Express backend.
*   **Solution**: The workspace property `"workspaces": ["backend"]` in the root `package.json` resolves this. Do not remove this field, as it allows npm to discover and install subdirectory dependencies.
