#!/bin/bash

# Cloudflare Pages Deployment Script for iziTools
# This script builds the site as SSG and deploys to Cloudflare Pages

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed. Please install it first: npm install -g pnpm${NC}"
    exit 1
fi

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  wrangler is not installed. Installing...${NC}"
    pnpm add -D wrangler
fi

# Check if logged in to Cloudflare
echo -e "${BLUE}📋 Checking Cloudflare authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Cloudflare. Please run: pnpm cf:login${NC}"
    exit 1
fi

# Get deployment branch (default to current git branch or 'main')
BRANCH=${1:-main}
if [ "$BRANCH" = "preview" ]; then
    DEPLOY_BRANCH="preview"
    echo -e "${BLUE}📦 Deploying to PREVIEW branch...${NC}"
elif [ "$BRANCH" = "production" ] || [ "$BRANCH" = "main" ]; then
    DEPLOY_BRANCH="main"
    echo -e "${BLUE}📦 Deploying to PRODUCTION branch...${NC}"
else
    DEPLOY_BRANCH="$BRANCH"
    echo -e "${BLUE}📦 Deploying to branch: $DEPLOY_BRANCH${NC}"
fi

# Clean previous build
echo -e "${BLUE}🧹 Cleaning previous build...${NC}"
rm -rf .next out

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

# Build the site
echo -e "${BLUE}🔨 Building site (SSG)...${NC}"
pnpm build

# Check if build was successful
if [ ! -d "out" ]; then
    echo -e "${RED}❌ Build failed! 'out' directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Deploy to Cloudflare Pages
echo -e "${BLUE}🚀 Deploying to Cloudflare Pages...${NC}"
if [ "$DEPLOY_BRANCH" = "main" ]; then
    wrangler pages deploy out --branch main
else
    wrangler pages deploy out --branch "$DEPLOY_BRANCH"
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Your site should be live shortly on Cloudflare Pages${NC}"
