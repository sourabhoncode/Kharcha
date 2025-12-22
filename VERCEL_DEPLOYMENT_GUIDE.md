# Vercel Deployment Guide - Financial Tracker

## Overview
This guide walks you through deploying both the **Frontend** (React) and **Backend** (NestJS) to Vercel.

---

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Connect your repository to Vercel
3. **Vercel CLI** (optional for local testing):
   ```bash
   npm install -g vercel
   ```
4. **MongoDB Database**: 
   - Use MongoDB Atlas or another hosted solution
   - Keep your MongoDB connection string ready
   - Create a `.env.local` file with your connection string (not committed to git)

---

## Part 1: Deploy Frontend

### Step 1: Prepare Frontend for Vercel
The frontend is already configured with `vercel.json`. Build and test locally first:

```bash
cd frontend
npm run build
```

### Step 2: Deploy Frontend via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..." → "Project"**
3. Select your GitHub repository
4. Configure the deployment:
   - **Framework**: React
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 3: Set Environment Variables
In the Vercel dashboard, go to your project → **Settings → Environment Variables**:

Add these variables:
| Name | Value | Example |
|------|-------|---------|
| `REACT_APP_BASEAPI` | Your backend API URL | `https://financial-tracker-api.vercel.app/api` |

Click **Deploy** and wait for the build to complete.

---

## Part 2: Deploy Backend

### Step 1: Prepare Backend for Vercel

#### A. Install Required Dependencies
```bash
cd backend
npm install
```

The `vercel.json` is already configured in the backend directory.

#### B. Build the Backend
```bash
npm run build
```

Verify the `dist` folder is created with compiled JavaScript files.

### Step 2: Deploy Backend via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..." → "Project"**
3. Select your GitHub repository
4. Configure the deployment:
   - **Framework**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables
In the Vercel dashboard for the backend project, go to **Settings → Environment Variables**:

Add these variables:
| Name | Value | Notes |
|------|-------|-------|
| `MONGODB_URI` | Your MongoDB connection string | Required for database access |
| `NODE_ENV` | `production` | Set environment to production |
| `FRONTEND_URL` | Your frontend URL | `https://your-frontend.vercel.app` |

### Step 4: Deploy
Click **Deploy** and wait for the build to complete.

---

## Step 3: Connect Frontend to Backend

### Update Frontend Environment Variables
Once both are deployed, update the frontend environment variable:

1. Go to frontend project → **Settings → Environment Variables**
2. Update `REACT_APP_BASEAPI` to point to your backend URL:
   ```
   https://financial-tracker-api.vercel.app/api
   ```

3. **Redeploy** the frontend for changes to take effect:
   - Go to **Deployments** → **Redeploy** latest deployment

---

## Deployment URLs

Once deployed, you'll have:

- **Frontend**: `https://your-frontend-name.vercel.app`
- **Backend API**: `https://your-backend-name.vercel.app/api`

---

## API Endpoints

All API calls will be made to:
```
https://your-backend-name.vercel.app/api
```

Available endpoints:
- `GET /transactions` - List all transactions
- `POST /transactions` - Create new transaction
- `GET /categories` - List all categories
- `POST /categories` - Create new category
- `GET /health` - Health check

---

## Troubleshooting

### Frontend Not Loading
- ✅ Check `REACT_APP_BASEAPI` is set correctly in environment variables
- ✅ Verify CORS is enabled in backend (`app.enableCors()`)
- ✅ Check browser console for errors

### Backend API 502/503 Errors
- ✅ Verify `MONGODB_URI` is set correctly
- ✅ Check MongoDB Atlas whitelist includes Vercel IP ranges
- ✅ Review Vercel deployment logs for errors
- ✅ Ensure build completed successfully (`npm run build`)

### CORS Issues
The backend has CORS enabled with the `FRONTEND_URL` environment variable. Ensure it's set to your frontend domain.

### MongoDB Connection Issues
1. Check your MongoDB connection string format
2. Verify your IP is whitelisted in MongoDB Atlas
3. Test connection locally before deployment

---

## Local Development After Deployment

To continue developing locally:

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm start
```

Update `frontend/.env.local`:
```env
REACT_APP_BASEAPI=http://localhost:3001/api
```

---

## CI/CD with Git

Both frontend and backend will automatically redeploy when you push to the `main` branch:

1. Make code changes
2. Commit and push to GitHub
3. Vercel automatically detects changes and rebuilds
4. Monitor progress in Vercel dashboard

---

## Production Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Environment variables set in both projects
- [ ] API calls working from frontend to backend
- [ ] No CORS errors in browser console
- [ ] Database connection working
- [ ] Error handling verified
- [ ] Performance monitoring enabled (optional)

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

