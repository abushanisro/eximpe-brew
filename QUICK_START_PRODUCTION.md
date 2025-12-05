# Quick Start - Production Setup

## 1. Environment Variables

**Backend** (`backend/.env.production`):
```
PORT=3001
NODE_ENV=production
SUPABASE_URL=https://sxvxtkobutlacnbdamau.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEWSAPI_KEY=your_key
GNEWS_API_KEY=your_key
FINNHUB_API_KEY=your_key
CORS_ORIGIN=https://yourdomain.com
```

**Frontend** (`.env.production`):
```
VITE_API_URL=https://api.yourdomain.com/api
```

## 2. Build & Deploy

### Backend
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

### Frontend
```bash
npm run build:prod
# Upload dist/ folder to hosting
```

## 3. Supabase Setup

Create tables in Supabase SQL editor:

```sql
CREATE TABLE market_snapshots (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE news_articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT,
  link TEXT,
  sentiment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_market_snapshots_timestamp ON market_snapshots(timestamp DESC);
CREATE INDEX idx_news_articles_created_at ON news_articles(created_at DESC);

ALTER TABLE market_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON market_snapshots FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON news_articles FOR SELECT USING (true);
```

## 4. Security

✓ CORS configured for your domain  
✓ Security headers enabled  
✓ HTTPS enforced  
✓ Rate limiting active  
✓ API keys in backend only  

## 5. Hosting Options

| Service | Cost | Setup |
|---------|------|-------|
| Render | $5-15/mo | Connect GitHub, set env vars |
| Railway | $5-15/mo | Connect GitHub, set env vars |
| Vercel (Frontend) | Free | Connect GitHub |
| Netlify (Frontend) | Free | Connect GitHub |

## 6. Test Production

```bash
# Health check
curl https://api.yourdomain.com/health

# Market data
curl https://api.yourdomain.com/api/market/all

# News
curl https://api.yourdomain.com/api/news/corporate
```

## 7. Monitoring

- Check backend logs: `pm2 logs eximpe-api`
- Monitor Supabase dashboard
- Set up uptime monitoring (UptimeRobot free)
- Enable error tracking (optional)

## Security Notes

⚠️ **Never commit `.env.production` to Git**  
⚠️ **Keep API keys secret**  
⚠️ **Use HTTPS only in production**  
⚠️ **Enable Supabase RLS policies**  
⚠️ **Monitor API rate limits**  

## Troubleshooting

**CORS errors?**
- Check `CORS_ORIGIN` in backend `.env.production`
- Verify frontend `VITE_API_URL` matches backend domain

**API returns 500?**
- Check backend logs
- Verify Supabase credentials
- Check API key validity

**Slow responses?**
- Check cache TTL (30s market, 5m news)
- Monitor external API latency
- Check database indexes

## Cost Breakdown

- Backend hosting: $5-15/month
- Frontend hosting: Free
- Supabase: Free tier (500MB storage)
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)

**Total: ~$5-30/month**
