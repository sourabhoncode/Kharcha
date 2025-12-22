#!/bin/bash

# Financial Tracker - Deployment Ready Setup Script
# This script prepares the application for production deployment

echo "🚀 Financial Tracker - Production Setup"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js installation
echo -e "${BLUE}📦 Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm installation
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Frontend setup
echo ""
echo -e "${BLUE}🎨 Setting up Frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Check .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}📝 Please update .env with your API URL${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Build frontend
echo -e "${YELLOW}🔨 Building Frontend...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend build successful${NC}"
else
    echo -e "${YELLOW}✗ Frontend build failed${NC}"
    exit 1
fi

# Check build folder
if [ -d "build" ]; then
    BUILDSIZE=$(du -sh build | cut -f1)
    echo -e "${GREEN}✓ Build folder created (${BUILDSIZE})${NC}"
else
    echo -e "${YELLOW}✗ Build folder not found${NC}"
    exit 1
fi

# Backend setup (optional)
echo ""
echo -e "${BLUE}⚙️  Checking Backend...${NC}"
cd ../backend

if [ -f "package.json" ]; then
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📥 Installing backend dependencies...${NC}"
        npm install
    else
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    fi
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  Backend .env file not found${NC}"
        echo -e "${YELLOW}📝 Please create .env file with your configuration${NC}"
    else
        echo -e "${GREEN}✓ Backend .env file exists${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Backend not found${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Production Setup Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Review and update .env files with production URLs"
echo "2. Verify Frontend build in frontend/build folder"
echo "3. Test locally: npm start (from frontend folder)"
echo "4. Deploy Frontend to Vercel/Netlify"
echo "5. Deploy Backend to your hosting service"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "- README.md - Project overview"
echo "- DEPLOYMENT.md - Detailed deployment guide"
echo "- PRODUCTION_CHECKLIST.md - Pre-deployment checklist"
echo ""
echo -e "${GREEN}🎉 Ready for deployment!${NC}"
