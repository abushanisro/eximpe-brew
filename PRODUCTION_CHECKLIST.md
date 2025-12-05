# Production Deployment Checklist

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] `.env.production` files created
- [ ] Supabase project created
- [ ] SQL setup completed in Supabase
- [ ] API keys obtained (or using demo)

## Supabase Setup

- [ ] Project created at https://supabase.com
- [ ] SQL from `SUPABASE_SETUP.sql` executed
- [ ] Tables created: `market_snapshots`, `news_articles`
- [ ] RLS policies enabled
- [ ] Credentials copied

## Backend Deployment (Railway)

- [ ] GitHub repository connected
- [ ] Backend folder selected as root
- [ ] Environment variables set:
  - [ ] `PORT=3001`
  - [ ] `NODE_ENV=production`
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `CORS_ORIGIN`
- [ ] Backend deployed successfully
- [ ] Health check passes: `curl https://your-railway-url/health`
- [ ] Backend URL copied

## Frontend Deployment (Vercel)

- [ ] GitHub repository connected
- [ ] Framework set to Vite
- [ ] Build command: `npm run build:prod`
- [ ] Output directory: `dist`
- [ ] Environment variables set:
  - [ ] `VITE_API_URL=https://your-railway-url/api`
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied

## Post-Deployment Verification

- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Market data endpoint responds
- [ ] News endpoint responds
- [ ] No CORS errors in browser console
- [ ] Data displays on frontend

## Monitoring Setup

- [ ] UptimeRobot configured for health check
- [ ] Email alerts enabled
- [ ] Slack notifications (optional)

## Documentation

- [ ] Production URLs documented
- [ ] Team notified of deployment
- [ ] Runbook created for troubleshooting
- [ ] Backup procedures documented

## Security

- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] API keys not exposed
- [ ] Security headers present
- [ ] Rate limiting enabled

## Performance

- [ ] Response times acceptable
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] Caching working (30s market, 5m news)

## Rollback Plan

- [ ] Previous version tagged in Git
- [ ] Rollback procedure documented
- [ ] Team trained on rollback

---

## Deployment URLs

**Frontend**: https://eximpe.vercel.app  
**Backend**: https://eximpe-api-prod.up.railway.app  
**Database**: Supabase (sxvxtkobutlacnbdamau)  

---

## Support Contacts

- Railway Support: https://railway.app/support
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support

---

## Sign-off

- [ ] QA approved
- [ ] Product owner approved
- [ ] Deployment completed
- [ ] Monitoring active

**Deployed by**: _______________  
**Date**: _______________  
**Time**: _______________
