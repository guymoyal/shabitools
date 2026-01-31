#!/bin/bash

# Deployment Verification Script
# Usage: ./scripts/verify-deployment.sh <your-domain>

if [ -z "$1" ]; then
    echo "❌ Error: Please provide your domain"
    echo "Usage: ./scripts/verify-deployment.sh <your-domain>"
    echo "Example: ./scripts/verify-deployment.sh shabitools.pages.dev"
    exit 1
fi

DOMAIN="$1"
BASE_URL="https://${DOMAIN}"

echo "🔍 Verifying deployment for: ${DOMAIN}"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check URL
check_url() {
    local url="$1"
    local description="$2"
    
    echo -n "Checking ${description}... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        return 1
    fi
}

# Function to check content
check_content() {
    local url="$1"
    local search_term="$2"
    local description="$3"
    
    echo -n "Checking ${description}... "
    
    if curl -s "$url" | grep -q "$search_term"; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        return 1
    fi
}

# Start checks
PASSED=0
FAILED=0

echo "1. Basic Pages"
echo "--------------"
check_url "${BASE_URL}" "Homepage" && ((PASSED++)) || ((FAILED++))
check_url "${BASE_URL}/tools" "Tools page" && ((PASSED++)) || ((FAILED++))
check_url "${BASE_URL}/contact" "Contact page" && ((PASSED++)) || ((FAILED++))
echo ""

echo "2. SEO Files"
echo "------------"
check_url "${BASE_URL}/robots.txt" "robots.txt" && ((PASSED++)) || ((FAILED++))
check_url "${BASE_URL}/sitemap.xml" "sitemap.xml" && ((PASSED++)) || ((FAILED++))
echo ""

echo "3. AdSense Setup"
echo "----------------"
check_url "${BASE_URL}/ads.txt" "ads.txt file" && ((PASSED++)) || ((FAILED++))
check_content "${BASE_URL}/ads.txt" "pub-2858012859068424" "ads.txt content" && ((PASSED++)) || ((FAILED++))
check_content "${BASE_URL}" "google-adsense-account" "Meta tag in HTML" && ((PASSED++)) || ((FAILED++))
echo ""

echo "4. Sample Tool"
echo "--------------"
check_url "${BASE_URL}/tools/json-formatter" "JSON Formatter tool" && ((PASSED++)) || ((FAILED++))
echo ""

# Summary
echo "=========================================="
echo "Summary:"
echo -e "${GREEN}✅ Passed: ${PASSED}${NC}"
echo -e "${RED}❌ Failed: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your deployment looks good.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some checks failed. Please review the errors above.${NC}"
    exit 1
fi
