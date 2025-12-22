# Environment Variables Configuration

## Frontend Environment Variables

### For Vercel Dashboard (Production)
```
REACT_APP_API_URL=https://your-backend-name.vercel.app/api
```

### For Local Development
Create file: `frontend/.env.local`
```env
REACT_APP_API_URL=http://localhost:3001/api
```

---

## Backend Environment Variables

### For Vercel Dashboard (Production)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financial-tracker?retryWrites=true&w=majority
NODE_ENV=production
FRONTEND_URL=https://your-frontend-name.vercel.app
```

### For Local Development
Create file: `backend/.env`
```env
MONGODB_URI=mongodb+srv://username:password@localhost:27017/financial-tracker
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
PORT=3001
```

---

## How to Set Environment Variables in Vercel

1. Go to your project in [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Settings**
3. Click **Environment Variables** in the left sidebar
4. Click **Add New**
5. Enter the variable name and value
6. Select which environments (Production, Preview, Development)
7. Click **Save**
8. **Redeploy** your project for changes to take effect

---

## Getting Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (if you don't have one)
3. Click **Connect** on your cluster
4. Choose **Connect your application**
5. Select **Node.js** and copy the connection string
6. Replace `<username>` and `<password>` with your credentials
7. Replace `<dbname>` with your database name

Example:
```
mongodb+srv://myuser:mypassword@cluster0.mongodb.net/financial-tracker?retryWrites=true&w=majority
```

---

## Important Notes

- **Never commit `.env` or `.env.local` files** to Git
- **Never share** your MongoDB connection string in public
- Update `REACT_APP_API_URL` in frontend after backend deployment
- Whitelist Vercel's IP ranges in MongoDB Atlas if using IP restrictions

