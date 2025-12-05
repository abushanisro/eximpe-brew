# Production Deployment Guide

## Environment Setup

### Backend (.env.production)
```
PORT=3001
NODE_ENV=production
SUPABASE_URL=https://sxvxtkobutlacnbdamau.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEWSAPI_KEY=your_production_key
GNEWS_API_KEY=your_production_key
FINNHUB_API_KEY=your_production_key
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (.env.production)
```
VITE_API_URL=https://api.yourdomain.com/api
```

## Deployment Steps

### 1. Backend Deployment (Node.js)

**Option A: Render.com**
```bash
# Connect GitHub repo
# Set environment variables in Render dashboard
# Deploy automatically on push
```

**Option B: Railway.app**
```bash
# Connect GitHub repo
# Add .env.production variables
# Deploy
```

**Option C: Self-hosted (VPS)**
```bash
# SSH into server
ssh user@your-server.com

# Clone repo
git clone your-repo-url
cd eximpe/backend

# Install dependencies
npm install --production

# Start with PM2
npm install -g pm2
pm2 start server.js --name "eximpe-api"
pm2 startup
pm2 save
```

### 2. Frontend Deployment (Static)

**Option A: Vercel**
```bash
# Connect GitHub repo
# Set VITE_API_URL in environment variables
# Auto-deploys on push
```

**Option B: Netlify**
```bash
# Connect GitHub repo
# Build command: npm run build
# Publish directory: dist
# Set VITE_API_URL environment variable
```

**Option C: Cloudflare Pages**
```bash
# Connect GitHub repo
# Build command: npm run build
# Build output directory: dist
```

### 3. Supabase Configuration

**Create Tables:**

```sql
-- Market snapshots table
CREATE TABLE market_snapshots (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- News articles table
CREATE TABLE news_articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT,
  link TEXT,
  sentiment TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_market_snapshots_timestamp ON market_snapshots(timestamp DESC);
CREATE INDEX idx_news_articles_created_at ON news_articles(created_at DESC);
```

**Enable Row Level Security (RLS):**

```sql
-- Enable RLS
ALTER TABLE market_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON market_snapshots
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON news_articles
  FOR SELECT USING (true);

-- Allow service role write access
CREATE POLICY "Allow service role write" ON market_snapshots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role write" ON news_articles
  FOR INSERT WITH CHECK (true);
```

### 4. Reverse Proxy Setup (Nginx)

```nginx
upstream backend {
  server localhost:3001;
}

server {
  listen 443 ssl http2;
  server_name api.yourdomain.com;

  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;

  location /api {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }
}

# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name api.yourdomain.com;
  return 301 https://$server_name$request_uri;
}
```

### 5. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d api.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Security Checklist

- [ ] API keys stored in environment variables only
- [ ] CORS configured for specific origins
- [ ] HTTPS enforced (SSL/TLS)
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info
- [ ] Supabase RLS policies configured
- [ ] Database backups enabled
- [ ] Monitoring/logging configured

## Monitoring

### Application Logs
```bash
# PM2 logs
pm2 logs eximpe-api

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Health Check
```bash
curl https://api.yourdomain.com/health
```

## Rollback Procedure

```bash
# PM2 rollback
pm2 restart eximpe-api

# Git rollback
git revert <commit-hash>
git push
```

## Performance Optimization

- Cache TTL: 30 seconds (market data), 5 minutes (news)
- Gzip compression enabled
- Database indexes on timestamp fields
- Connection pooling configured
- CDN for static assets (frontend)

## Cost Estimation

- **Supabase**: Free tier (500MB storage, 2GB bandwidth/month)
- **Backend Hosting**: $5-15/month (Render/Railway)
- **Frontend Hosting**: Free (Vercel/Netlify)
- **Domain**: $10-15/year
- **SSL**: Free (Let's Encrypt)

**Total**: ~$5-30/month for production
