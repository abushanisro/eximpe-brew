# Free Tier Production Setup

## Completely Free Stack

- **Backend**: Railway.app (free tier)
- **Frontend**: Vercel (free tier)
- **Database**: Supabase (free tier - 500MB storage, 2GB bandwidth/month)
- **Domain**: Freenom or use Railway/Vercel subdomain
- **SSL**: Automatic (included)

**Total Cost: $0/month**

---

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Copy your credentials:
   - Project URL: `https://sxvxtkobutlacnbdamau.supabase.co`
   - Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 1.2 Run SQL Setup
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy entire content from `SUPABASE_SETUP.sql`
4. Paste into SQL Editor
5. Click "Run"

**Tables created:**
- `market_snapshots` - Historical market data
- `news_articles` - News storage
- Views for common queries
- Functions for data retrieval

### 1.3 Verify Setup
```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should show: market_snapshots, news_articles
```

---

## Step 2: Backend Deployment (Railway)

### 2.1 Prepare Backend
```bash
cd backend
npm install --production
```

### 2.2 Deploy to Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Select `backend` folder as root directory

### 2.3 Set Environment Variables
In Railway Dashboard → Variables:
```
PORT=3001
NODE_ENV=production
SUPABASE_URL=https://sxvxtkobutlacnbdamau.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEWSAPI_KEY=your_free_key
GNEWS_API_KEY=your_free_key
FINNHUB_API_KEY=your_free_key
CORS_ORIGIN=https://yourdomain.vercel.app
```

### 2.4 Get Backend URL
- Railway auto-generates: `https://eximpe-api-prod.up.railway.app`
- Copy this URL

---

## Step 3: Frontend Deployment (Vercel)

### 3.1 Build Frontend
```bash
npm run build:prod
```

### 3.2 Deploy to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Select your repository
5. Framework: Vite
6. Build command: `npm run build:prod`
7. Output directory: `dist`

### 3.3 Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://eximpe-api-prod.up.railway.app/api
```

### 3.4 Deploy
- Click "Deploy"
- Vercel auto-generates: `https://eximpe.vercel.app`

---

## Step 4: Connect Everything

### 4.1 Update Backend CORS
In Railway Variables, update:
```
CORS_ORIGIN=https://eximpe.vercel.app
```

### 4.2 Test Connection
```bash
# Test backend health
curl https://eximpe-api-prod.up.railway.app/health

# Test market data
curl https://eximpe-api-prod.up.railway.app/api/market/all

# Test news
curl https://eximpe-api-prod.up.railway.app/api/news/corporate
```

### 4.3 Test Frontend
- Open https://eximpe.vercel.app
- Check browser console for errors
- Verify data loads

---

## Free API Keys

Get free keys from:

| Service | Free Tier | Link |
|---------|-----------|------|
| NewsAPI | 100 req/day | https://newsapi.org |
| GNews | 100 req/day | https://gnews.io |
| Finnhub | 60 req/min | https://finnhub.io |

---

## Free Tier Limits

### Supabase
- Storage: 500 MB
- Bandwidth: 2 GB/month
- Database: PostgreSQL 15
- Connections: 10 concurrent

### Railway
- 500 hours/month (free tier)
- Enough for continuous deployment

### Vercel
- Unlimited deployments
- Unlimited bandwidth
- Automatic SSL

---

## Monitoring (Free)

### Uptime Monitoring
```bash
# Use UptimeRobot (free)
# Monitor: https://eximpe-api-prod.up.railway.app/health
```

### Logs
- Railway: Dashboard → Logs
- Vercel: Dashboard → Deployments → Logs
- Supabase: Dashboard → Logs

---

## Maintenance

### Monthly Tasks
1. Check Supabase storage usage
2. Run cleanup functions:
   ```sql
   SELECT delete_old_market_snapshots();
   SELECT delete_old_news_articles();
   ```
3. Monitor API key usage
4. Check error logs

### Scaling (When needed)
- Railway: Upgrade to paid ($5+/month)
- Vercel: Already unlimited
- Supabase: Upgrade to paid ($25+/month)

---

## Troubleshooting

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix**: Update `CORS_ORIGIN` in Railway to match Vercel URL

### 502 Bad Gateway
**Fix**: Check Railway logs for backend errors

### Slow API Response
**Fix**: Check Supabase query performance in dashboard

### Data Not Saving
**Fix**: Verify RLS policies are enabled in Supabase

---

## Quick Commands

```bash
# Build frontend
npm run build:prod

# Test backend locally
NODE_ENV=production npm start

# Check Railway logs
railway logs

# Check Vercel logs
vercel logs

# Verify Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
  https://sxvxtkobutlacnbdamau.supabase.co/rest/v1/market_snapshots
```

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Supabase | Free |
| Railway | Free (500 hrs/mo) |
| Vercel | Free |
| Domain | Free (use subdomain) |
| SSL | Free |
| **Total** | **$0/month** |

---

## Next Steps

1. ✅ Create Supabase project
2. ✅ Run SQL setup
3. ✅ Deploy backend to Railway
4. ✅ Deploy frontend to Vercel
5. ✅ Test all endpoints
6. ✅ Monitor logs
7. ✅ Set up uptime monitoring

**You're live in production for FREE!**
