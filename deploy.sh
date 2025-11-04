#!/bin/bash

# Production Deployment Script for Video Image Capture
# This script builds and deploys the Next.js application for production

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18 or higher is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm version: $(npm -v)${NC}"

# Clean previous builds
echo -e "${YELLOW}📦 Cleaning previous builds...${NC}"
rm -rf .next
rm -rf node_modules/.cache
rm -rf out

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --production=false

# Build the Next.js application
echo -e "${YELLOW}🔨 Building Next.js application...${NC}"
npm run build

# Check if build was successful
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Build failed! .next directory was not created.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed successfully!${NC}"

# Display build information
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  Deployment Ready!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "To start the production server, run:"
echo -e "${YELLOW}  npm start${NC}"
echo ""
echo "Or use Docker:"
echo -e "${YELLOW}  docker-compose up -d${NC}"
echo ""
echo "The application will be available at:"
echo -e "${YELLOW}  http://localhost:3000${NC}"
echo ""
echo -e "${GREEN}✓ Deployment script completed!${NC}"

