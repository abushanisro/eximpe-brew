#!/bin/bash

# Production Deployment Script

echo "Starting Production Deployment..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Git
echo -e "${BLUE}Step 1: Pushing to GitHub...${NC}"
git add .
git commit -m "Production deployment $(date +%Y-%m-%d\ %H:%M:%S)"
git push origin main
echo -e "${GREEN}✓ Pushed to GitHub${NC}"

# Step 2: Backend Build
echo -e "${BLUE}Step 2: Building backend...${NC}"
cd backend
npm install --production
echo -e "${GREEN}✓ Backend built${NC}"
cd ..

# Step 3: Frontend Build
echo -e "${BLUE}Step 3: Building frontend...${NC}"
npm run build:prod
echo -e "${GREEN}✓ Frontend built${NC}"

# Step 4: Verify builds
echo -e "${BLUE}Step 4: Verifying builds...${NC}"
if [ -d "dist" ]; then
  echo -e "${GREEN}✓ Frontend dist folder exists${NC}"
else
  echo -e "${RED}✗ Frontend dist folder not found${NC}"
  exit 1
fi

# Step 5: Display deployment info
echo -e "${GREEN}✓ Deployment ready!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Go to Railway: https://railway.app/dashboard"
echo "2. Go to Vercel: https://vercel.com/dashboard"
echo "3. Verify deployments are complete"
echo ""
echo -e "${BLUE}Test your deployment:${NC}"
echo "curl https://eximpe-api-prod.up.railway.app/health"
echo "curl https://eximpe.vercel.app"
echo ""
echo -e "${GREEN}Deployment complete! 🎉${NC}"
