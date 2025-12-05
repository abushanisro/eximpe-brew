# Production Deployment Checklist

## Pre-Deployment

- [ ] All environment variables configured in `.env.production`
- [ ] Supabase project created and tables initialized
- [ ] API keys obtained (NewsAPI, GNews, Finnhub)
- [ ] Domain registered and DNS configured
- [ ] SSL certificate ready (Let's Encrypt)
- [ ] Database backups enabled in Supabase

## Backend Deployment

- [ ] Install dependencies: `npm install --production`
- [ ] Test locally: `NODE_ENV=production npm start`
- [ ] Deploy to hosting (Render/Railway/VPS)
- [ ] Verify health endpoint: `curl https://api.yourdomain.com/health`
- [ ] Check logs for errors
- [ ] Test API endpoints with production data

## Frontend Deployment

- [ ] Build: `npm run build:prod`
- [ ] Verify `dist/` folder created
- [ ] Deploy to static hosting (Vercel/Netlify)
- [ ] Set `VITE_API_URL` environment variable
- [ ] Test all pages load correctly
- [ ] Verify API calls work from frontend

## Security Verification

- [ ] HTTPS enforced (no HTTP)
- [ ] CORS headers correct
- [ ] Security headers present
- [ ] API keys not exposed in frontend
- [ ] Rate limiting working
- [ ] Error messages don't leak sensitive info

## Monitoring Setup

- [ ] Application logs configured
- [ ] Error tracking enabled (Sentry optional)
- [ ] Uptime monitoring configured
- [ ] Database monitoring enabled
- [ ] Performance metrics tracked

## Post-Deployment

- [ ] Test all market data endpoints
- [ ] Test all news endpoints
- [ ] Verify caching works (30s market, 5m news)
- [ ] Check response times
- [ ] Monitor error rates
- [ ] Verify Supabase data storage

## Rollback Plan

- [ ] Previous version tagged in Git
- [ ] Database backup available
- [ ] Rollback procedure documented
- [ ] Team notified of deployment

## Quick Commands

```bash
# Backend deployment
cd backend
npm install --production
NODE_ENV=production npm start

# Frontend deployment
npm run build:prod
# Upload dist/ to hosting

# Health check
curl https://api.yourdomain.com/health

# View logs (PM2)
pm2 logs eximpe-api
```

## Support Contacts

- Supabase: https://supabase.com/support
- Hosting Provider: [Your provider support]
- Domain Registrar: [Your registrar support]
