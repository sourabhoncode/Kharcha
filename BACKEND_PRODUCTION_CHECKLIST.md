# Backend Production Deployment Checklist

## ✅ Code Readiness
- [x] Added global API prefix (/api)
- [x] Enhanced CORS configuration
- [x] Production logging configured
- [x] Error handling added
- [x] Serverless environment detection

## ✅ Configuration Files
- [x] Updated `vercel.json` for Vercel deployment
- [x] Updated `main.ts` for production
- [x] Updated `package.json` with Vercel script
- [x] Updated `.env.example` with production variables

## 📋 Pre-Deployment Steps

Before deploying to Vercel, ensure:

### 1. MongoDB Setup
- [ ] Create MongoDB Atlas account (if not already done)
- [ ] Create a cluster
- [ ] Create database user with credentials
- [ ] Get connection string in format:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/financial-tracker?retryWrites=true&w=majority
  ```
- [ ] Whitelist Vercel IP ranges in MongoDB Atlas:
  - Go to **Network Access** → **Add IP Address**
  - Add `0.0.0.0/0` (allows all IPs - only for testing)
  - Or use MongoDB's VPC Peering (for production)

### 2. Local Testing (Important!)
```bash
# Test build locally first
cd backend
npm run build

# Test locally with environment variables
set NODE_ENV=production
set MONGODB_URI=your_mongodb_connection_string
npm run start:prod
```

## 🚀 Vercel Deployment

### Step 1: Create Backend Project on Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your `financial-tracker-react` repository
4. **Root Directory**: `backend`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`

### Step 2: Set Environment Variables in Vercel
In Vercel Dashboard → Your Backend Project → **Settings** → **Environment Variables**:

| Variable | Value | Example |
|----------|-------|---------|
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db?...` |
| `NODE_ENV` | `production` | `production` |
| `FRONTEND_URL` | Your frontend Vercel URL | `https://financial-tracker-xxxx.vercel.app` |

**Important**: Do NOT use `@` symbol before variable names in values!

### Step 3: Deploy
1. Click **"Deploy"**
2. Wait for build to complete
3. Once deployed, note your backend URL:
   ```
   https://financial-tracker-backend-xxxx.vercel.app
   ```

## ✅ Post-Deployment Verification

After deployment, test these endpoints:

### Health Check
```bash
GET https://your-backend-url/api/health
```

### Get All Transactions
```bash
GET https://your-backend-url/api/transactions
```

### Get All Categories
```bash
GET https://your-backend-url/api/categories
```

### Create Transaction
```bash
POST https://your-backend-url/api/transactions
Content-Type: application/json

{
  "name": "Test",
  "amount": 100,
  "category": "test",
  "date": "2025-12-22"
}
```

## 🔗 Connect Frontend to Backend

After backend is deployed:

1. Go to **Frontend Vercel Project** → **Settings** → **Environment Variables**
2. Update `REACT_APP_API_URL` to:
   ```
   https://your-backend-url/api
   ```
3. **Redeploy** frontend for changes to take effect

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **502/503 Error** | Check MongoDB URI, whitelist Vercel IPs |
| **CORS Error** | Ensure `FRONTEND_URL` env var is set correctly |
| **404 on /api/...** | Verify routes are prefixed with `/api` |
| **Connection Timeout** | Check MongoDB whitelist, verify credentials |
| **Build Failed** | Check build logs, ensure `dist/` folder created |

## 📚 Environment Variables Summary

**Required** (must set in Vercel):
- `MONGODB_URI` - MongoDB connection string
- `FRONTEND_URL` - Frontend URL for CORS

**Optional**:
- `NODE_ENV` - Auto-set to "production" by Vercel
- `PORT` - Vercel manages this, defaults to 3001

---

**Your backend is now production-ready! 🎉**
