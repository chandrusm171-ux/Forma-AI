# 🚀 Deployment Guide — Forma-AI

> **Live Frontend:** [https://forma-ai-liart.vercel.app](https://forma-ai-liart.vercel.app)  
> **Live Backend:** [https://forma-ai-qut7.onrender.com](https://forma-ai-qut7.onrender.com)  
> **GitHub Repository:** [chandrusm171-ux/Forma-AI](https://github.com/chandrusm171-ux/Forma-AI)

---

## Table of Contents

- [Live Deployment](#live-deployment)
- [Local Development Setup](#local-development-setup)
- [Frontend — Vercel Deployment](#frontend--vercel-deployment)
- [Backend — Render Deployment](#backend--render-deployment)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Environment Variables Reference](#environment-variables-reference)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)

---

## Live Deployment

| Service    | URL                                                                           | Platform |
|------------|-------------------------------------------------------------------------------|----------|
| Frontend   | [https://forma-ai-liart.vercel.app](https://forma-ai-liart.vercel.app)        | Vercel   |
| Backend    | [https://forma-ai-qut7.onrender.com](https://forma-ai-qut7.onrender.com)      | Render   |
| Repository | [github.com/chandrusm171-ux/Forma-AI](https://github.com/chandrusm171-ux/Forma-AI) | GitHub |

### Health Checks

```bash
# Liveness
curl https://forma-ai-qut7.onrender.com/api/health

# Readiness (DB connected?)
curl https://forma-ai-qut7.onrender.com/api/ready
```

---

## Local Development Setup

### Prerequisites

| Tool       | Version  | Download                                     |
|------------|----------|----------------------------------------------|
| Node.js    | ≥ 20     | [nodejs.org](https://nodejs.org)             |
| npm        | ≥ 10     | Bundled with Node.js                         |
| MongoDB    | ≥ 7      | [mongodb.com](https://www.mongodb.com)       |
| Git        | any      | [git-scm.com](https://git-scm.com)          |

### Step 1 — Clone the Repository

```bash
git clone https://github.com/chandrusm171-ux/Forma-AI.git
cd Forma-AI
```

### Step 2 — Install Dependencies

```bash
# Backend
npm install --prefix backend

# Frontend
npm install --prefix frontend
```

### Step 3 — Configure Backend Environment

Create [`backend/.env`](../backend/.env):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/forma-ai
AUTH_TOKEN_SECRET=your_super_secret_jwt_key_here

# Groq AI (OpenAI-compatible)
AI_PROVIDER=openai
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=openai/gpt-oss-20b
OPENAI_API_KEY=gsk_your_groq_api_key_here

# CORS
FRONTEND_ORIGIN=http://localhost:5173
```

### Step 4 — Configure Frontend Environment

Create [`frontend/.env`](../frontend/.env):

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_LOCAL_AI_BASE_URL=http://localhost:5000/api
```

### Step 5 — Start Development Servers

**Terminal 1 — Backend:**

```bash
npm run dev --prefix backend
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**

```bash
npm run dev --prefix frontend
# App opens at http://localhost:5173
```

### Step 6 — Verify Setup

```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend
open http://localhost:5173
```

---

## Frontend — Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chandrusm171-ux/Forma-AI)

### Manual Steps

1. **Go to** [vercel.com](https://vercel.com) and sign in with GitHub
2. **Import** the `chandrusm171-ux/Forma-AI` repository
3. **Configure project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Add Environment Variables:**

   | Variable              | Value                                              |
   |-----------------------|----------------------------------------------------|
   | `VITE_API_BASE_URL`   | `https://forma-ai-qut7.onrender.com/api`          |

5. **Click Deploy**

### Vercel Configuration

[`frontend/vercel.json`](../frontend/vercel.json) (create if missing):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures React Router handles client-side routing correctly.

---

## Backend — Render Deployment

### Manual Steps

1. **Go to** [render.com](https://render.com) and sign in with GitHub
2. **Click** "New Web Service" → Connect `chandrusm171-ux/Forma-AI`
3. **Configure service:**
   - **Name:** `forma-ai-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Starter for always-on)
4. **Add Environment Variables:**

   | Variable            | Value                                            |
   |---------------------|--------------------------------------------------|
   | `PORT`              | `5000`                                           |
   | `MONGODB_URI`       | Your MongoDB Atlas connection string             |
   | `AUTH_TOKEN_SECRET` | A long random string (32+ chars)                 |
   | `AI_PROVIDER`       | `openai`                                         |
   | `OPENAI_BASE_URL`   | `https://api.groq.com/openai/v1`                |
   | `OPENAI_MODEL`      | `openai/gpt-oss-20b`                            |
   | `OPENAI_API_KEY`    | Your Groq API key (`gsk_...`)                   |
   | `FRONTEND_ORIGIN`   | `https://forma-ai-liart.vercel.app`             |

5. **Click Create Web Service**

### Important Notes

- **Free tier cold starts:** Render free instances spin down after 15 minutes of inactivity. The first request after idle may take 30–60 seconds.
- **Upgrade to Starter** (\$7/mo) to keep the service always-on.
- **Health check path:** Set to `/api/health` in Render settings.

---

## MongoDB Atlas Setup

1. **Create account** at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create a free cluster** (M0 — Free Tier)
3. **Create a database user:**
   - Username: `formaai`
   - Password: generate a strong password
4. **Allow network access:**
   - For Render: Add `0.0.0.0/0` (allow all IPs) since Render uses dynamic IPs
5. **Get connection string:**
   ```
   mongodb+srv://formaai:<password>@cluster0.xxxxx.mongodb.net/forma-ai?retryWrites=true&w=majority
   ```
6. **Set as `MONGODB_URI`** in Render environment variables

---

## Environment Variables Reference

### Backend Variables

| Variable            | Required | Description                                       |
|---------------------|----------|---------------------------------------------------|
| `PORT`              | ✅       | Server port (default: 5000)                       |
| `MONGODB_URI`       | ✅       | MongoDB connection string                         |
| `AUTH_TOKEN_SECRET` | ✅       | JWT signing secret (min 32 chars recommended)     |
| `AI_PROVIDER`       | ✅       | AI backend: `openai`                              |
| `OPENAI_BASE_URL`   | ✅       | Groq API: `https://api.groq.com/openai/v1`       |
| `OPENAI_MODEL`      | ✅       | Model ID: `openai/gpt-oss-20b`                   |
| `OPENAI_API_KEY`    | ✅       | Groq API key (starts with `gsk_`)                |
| `FRONTEND_ORIGIN`   | ✅       | Allowed CORS origin                               |
| `NODE_ENV`          | ❌       | `production` on Render (auto-set)                |

### Frontend Variables

| Variable                  | Required | Description                              |
|---------------------------|----------|------------------------------------------|
| `VITE_API_BASE_URL`       | ✅       | Backend API base URL                     |
| `VITE_LOCAL_AI_BASE_URL`  | ❌       | Local AI override (dev only)             |

---

## CI/CD Pipeline

Forma-AI uses **GitHub Actions** for automated checks on every push and pull request.

**File:** [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install --prefix backend
      - run: npm test --prefix backend

  frontend-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install --prefix frontend
      - run: npm run lint --prefix frontend
      - run: npm run build --prefix frontend
```

### Deployment Triggers

| Event              | Action                                              |
|--------------------|-----------------------------------------------------|
| Push to `main`     | Vercel auto-deploys frontend                        |
| Push to `main`     | Render auto-deploys backend (if connected to GitHub)|
| PR opened/updated  | CI runs lint + build checks (no deploy)             |

---

## Troubleshooting

### Backend not connecting to MongoDB

```bash
# Check URI format
echo $MONGODB_URI

# Test Atlas from local
mongosh "mongodb+srv://..." --eval "db.runCommand({ping:1})"
```

### Frontend 502 Bad Gateway

- Backend may be on Render free tier cold start — wait 60 seconds and retry
- Check backend logs in Render dashboard
- Verify `VITE_API_BASE_URL` points to the correct Render URL

### CORS Errors in Browser

- Ensure `FRONTEND_ORIGIN` on the backend matches **exactly** the Vercel URL (no trailing slash)
- Example: `https://forma-ai-liart.vercel.app` (not `https://forma-ai-liart.vercel.app/`)

### AI Extraction Not Working

```bash
# Test AI health
curl https://forma-ai-qut7.onrender.com/api/ai/models

# Should list available Groq models
# If 503 → check OPENAI_API_KEY and OPENAI_BASE_URL env vars
```

### React Router 404 on Refresh

Ensure `vercel.json` has the rewrite rule that redirects all paths to `index.html`.

---

*Last updated: November 2025 — Forma-AI v1.0*

