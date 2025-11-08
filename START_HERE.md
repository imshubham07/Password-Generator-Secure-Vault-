# 🚀 How to Fix Login/Signup Error

## The Problem
Your backend server is **not running**, so the frontend cannot connect to the API.

## The Solution

### Option 1: Start Everything Together (Recommended)
Open a terminal and run:
```bash
npm run dev
```
This starts BOTH the frontend (Next.js) and backend (Express) servers together.

### Option 2: Start Separately
If you need to start them separately:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

---

## Verify It's Working

1. **Backend should show:**
   ```
   Backend server running on port 3001
   Connected to MongoDB
   ```

2. **Frontend should show:**
   ```
   ▲ Next.js running on http://localhost:3000
   ```

3. **Test the backend API:**
   Open http://localhost:3001/api/health in your browser
   - Should return: `{"status":"OK","timestamp":"..."}`

---

## Common Issues

### ❌ "MongoDB connection error"
- Make sure MongoDB is running OR
- Your `.env.local` has a valid `MONGODB_URI` (you're using MongoDB Atlas, which should work)

### ❌ "Port 3001 already in use"
```bash
# Kill the process using port 3001
lsof -ti:3001 | xargs kill -9
# Then restart
npm run dev
```

### ❌ "Cannot connect to http://localhost:3001"
- The backend is not running - run `npm run dev` or `npm run dev:backend`

---

## What I Fixed

✅ Changed `src/utils/api.ts` to use `http://localhost:3001/api` in development
✅ Your `.env.local` already has MongoDB and JWT settings configured

## Next Steps

1. Run `npm run dev` in your terminal
2. Open http://localhost:3000
3. Try login/signup - it should work now!
