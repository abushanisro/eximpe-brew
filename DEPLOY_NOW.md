# Deploy to Production NOW

## Step 1: Supabase Setup (5 min)

1. Go to https://supabase.com → Sign up
2. Create new project
3. Go to SQL Editor → New Query
4. Copy-paste entire `SUPABASE_SETUP.sql` file
5. Click Run
6. Copy your credentials:
   - Project URL
   - Anon Key

---

## Step 2: Backend Deployment (Railway) (5 min)

### 2.1 Push to GitHub
```bash
git add .
git commit -m "Production deployment"
git push origin main
```

### 2.2 Deploy to Railway
1. Go to https://railway.app → Sign up with GitHub
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Select `backend` folder as root directory
5. Railway auto-deploys

### 2.3 Set Environment Variables
In Railway Dashboard:
1. Click your project
2. Go to Variables tab
3. Add these variables:
```
PORT=3001
NODE_ENV=production
SUPABASE_URL=https://sxvxtkobutlacnbdamau.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEWSAPI_KEY=demo
GNEWS_API_KEY=demo
FINNHUB_API_KEY=demo
CORS_ORIGIN=https://eximpe.vercel.app
```

### 2.4 Get Backend URL
- Railway generates: `https://eximpe-api-prod.up.railway.app`
- Copy this URL

### 2.5 Test Backend
```bash
curl https://eximpe-api-prod.up.railway.app/health
```

---

## Step 3: Frontend Deployment (Vercel) (5 min)

### 3.1 Deploy to Vercel
1. Go to https://vercel.com → Sign up with GitHub
2. Click "New Project"
3. Select your repository
4. Framework: Vite
5. Build command: `npm run build:prod`
6. Output directory: `dist`
7. Click Deploy

### 3.2 Set Environment Variables
In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add:
```
VITE_API_URL=https://eximpe-api-prod.up.railway.app/api
```

### 3.3 Redeploy
- Click "Deployments" → "Redeploy" latest

### 3.4 Get Frontend URL
- Vercel generates: `https://eximpe.vercel.app`

---

## Step 4: Update Backend CORS (2 min)

### 4.1 Update Railway Variables
In Railway Dashboard:
```
CORS_ORIGIN=https://eximpe.vercel.app
```

### 4.2 Redeploy Backend
- Railway auto-redeploys on variable change

---

## Step 5: Verify Deployment (5 min)

### 5.1 Test Backend
```bash
# Health check
curl https://eximpe-api-prod.up.railway.app/health

# Market data
curl https://eximpe-api-prod.up.railway.app/api/market/all

# News
curl https://eximpe-api-prod.up.railway.app/api/news/corporate
```

### 5.2 Test Frontend
1. Open https://eximpe.vercel.app
2. Check browser console (F12)
3. Verify data loads
4. No CORS errors

### 5.3 Check Logs
- Railway: Dashboard → Logs
- Vercel: Dashboard → Deployments → Logs

---

## Step 6: Monitor (Ongoing)

### 6.1 Uptime Monitoring (Free)
1. Go to https://uptimerobot.com
2. Sign up
3. Add monitor:
   - URL: `https://eximpe-api-prod.up.railway.app/health`
   - Interval: 5 minutes
4. Get alerts if down

### 6.2 Check Logs Daily
- Railway logs for errors
- Vercel logs for frontend issues
- Supabase dashboard for storage usage

---

## Troubleshooting

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix**: 
1. Check `CORS_ORIGIN` in Railway matches Vercel URL
2. Redeploy backend

### 502 Bad Gateway
**Fix**: Check Railway logs for backend errors

### Data Not Loading
**Fix**: 
1. Check browser console for errors
2. Verify `VITE_API_URL` in Vercel
3. Test backend directly with curl

### Supabase Connection Error
**Fix**: 
1. Verify credentials in Railway
2. Check Supabase project is active
3. Verify RLS policies are enabled

---

## Quick Links

- Railway: https://railway.app/dashboard
- Vercel: https://vercel.com/dashboard
- Supabase: https://app.supabase.com
- UptimeRobot: https://uptimerobot.com

---

## Cost

- **Supabase**: Free (500MB storage, 2GB bandwidth)
- **Railway**: Free (500 hrs/month)
- **Vercel**: Free (unlimited)
- **Total**: **$0/month**

---

## You're Live! 🚀

Your production app is now running at:
- **Frontend**: https://eximpe.vercel.app
- **Backend**: https://eximpe-api-prod.up.railway.app
- **Database**: Supabase (free tier)

**Total deployment time: ~20 minutes**
