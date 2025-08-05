#!/bin/bash

# PostPrism Cloud Deployment Verification Script
# Verifies that all cloud deployment configurations are correct

echo "🔍 PostPrism Cloud Deployment Verification"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Function to check and report
check_item() {
    local description="$1"
    local check_command="$2"
    local required="$3"  # true/false
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    echo -n "🔸 $description... "
    
    if eval "$check_command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}❌ FAIL (Required)${NC}"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
        else
            echo -e "${YELLOW}⚠️  OPTIONAL${NC}"
        fi
        return 1
    fi
}

echo -e "${BLUE}📋 Checking branch and git status...${NC}"
echo ""

# Check if on cloud-deployment branch
check_item "On cloud-deployment branch" "[ \"\$(git branch --show-current)\" = \"cloud-deployment\" ]" true

# Check git status
check_item "Git working directory clean" "git diff-index --quiet HEAD --" false

echo ""
echo -e "${BLUE}📋 Checking required files...${NC}"
echo ""

# Check required files exist
check_item "Cloud environment template" "[ -f 'cloud.env.example' ]" true
check_item "Render.com deployment config" "[ -f 'backend/render.yaml' ]" true
check_item "Cloud deployment script" "[ -f 'deploy-cloud.sh' ]" true
check_item "Frontend package.json" "[ -f 'package.json' ]" true
check_item "Backend requirements.txt" "[ -f 'backend/requirements.txt' ]" true
check_item "Free deployment guide" "[ -f 'FREE_DEPLOYMENT_GUIDE.md' ]" true

echo ""
echo -e "${BLUE}📋 Checking code configuration...${NC}"
echo ""

# Check API configuration
check_item "API config has cloud support" "grep -q 'isCloudDeployment' src/config/api.ts" true
check_item "API config has CLOUD_CONFIG" "grep -q 'CLOUD_CONFIG' src/config/api.ts" true
check_item "Demo config enhanced" "grep -q 'cloudOptimized' src/config/api.ts" true

# Check component integration
check_item "CloudStatus component exists" "[ -f 'src/components/CloudStatus.tsx' ]" true
check_item "Index.tsx imports CloudStatus" "grep -q 'CloudStatus' src/pages/Index.tsx" true
check_item "LiveStreamViewer has cloud messages" "grep -q 'DEMO_CONFIG.demoMessages' src/components/SimplifiedLiveStreamViewer.tsx" true

echo ""
echo -e "${BLUE}📋 Checking deployment configurations...${NC}"
echo ""

# Check Render.com config
check_item "Render config has correct build command" "grep -q 'pip install.*requirements.txt' backend/render.yaml" true
check_item "Render config has gunicorn start" "grep -q 'gunicorn.*run_fixed:app' backend/render.yaml" true
check_item "Render config sets free plan" "grep -q 'plan: free' backend/render.yaml" true

# Check environment files
check_item "Cloud env has VITE_DEMO_MODE" "grep -q 'VITE_DEMO_MODE=true' cloud.env.example" true
check_item "Cloud env has DEMO_MODE_BACKEND" "grep -q 'DEMO_MODE_BACKEND=true' cloud.env.example" true
check_item "Cloud env has Render.com API URL" "grep -q 'onrender.com' cloud.env.example" true

echo ""
echo -e "${BLUE}📋 Checking documentation...${NC}"
echo ""

# Check documentation
check_item "FREE_DEPLOYMENT_GUIDE mentions Render.com" "grep -q -i 'render.com' FREE_DEPLOYMENT_GUIDE.md" true
check_item "FREE_DEPLOYMENT_GUIDE mentions Lovable" "grep -q -i 'lovable' FREE_DEPLOYMENT_GUIDE.md" true
check_item "DEPLOYMENT_STRATEGY mentions free deployment" "grep -q -i 'free.*deployment' DEPLOYMENT_STRATEGY.md" true

echo ""
echo -e "${BLUE}📋 Testing local functionality...${NC}"
echo ""

# Check if Node.js dependencies are installable
check_item "Node.js dependencies installable" "npm install --dry-run" false

# Check if TypeScript compiles
check_item "TypeScript compilation" "npx tsc --noEmit" false

# Check if build works
echo -n "🔸 Frontend build works... "
if npm run build >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${YELLOW}⚠️  SKIPPED (requires dependencies)${NC}"
fi
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

echo ""
echo -e "${BLUE}📋 Checking Python backend...${NC}"
echo ""

# Check Python backend
if [ -d "backend/venv" ]; then
    check_item "Virtual environment exists" "[ -d 'backend/venv' ]" false
    
    # Check if we can activate venv and check imports
    echo -n "🔸 Python imports work... "
    if (cd backend && source venv/bin/activate && python -c "import flask, flask_socketio; print('OK')" >/dev/null 2>&1); then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${YELLOW}⚠️  SKIPPED (venv not activated or dependencies missing)${NC}"
    fi
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
else
    echo "🔸 Virtual environment... ${YELLOW}⚠️  Not found (run deploy-cloud.sh first)${NC}"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
fi

echo ""
echo "=================================================="
echo -e "${BLUE}📊 Verification Summary${NC}"
echo "=================================================="
echo ""

# Calculate percentages
if [ $TOTAL_CHECKS -gt 0 ]; then
    PASS_PERCENTAGE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))
else
    PASS_PERCENTAGE=0
fi

echo "📋 Total Checks: $TOTAL_CHECKS"
echo -e "✅ Passed: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "❌ Failed: ${RED}$FAILED_CHECKS${NC}"
echo -e "📊 Success Rate: ${GREEN}$PASS_PERCENTAGE%${NC}"

echo ""

# Final assessment
if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}🎉 READY FOR CLOUD DEPLOYMENT!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push cloud-deployment branch to GitHub"
    echo "2. Deploy backend to Render.com (free tier)"
    echo "3. Deploy frontend to Lovable"
    echo "4. Test the deployed demo"
    echo ""
    echo "Use: git push origin cloud-deployment"
    exit 0
elif [ $PASS_PERCENTAGE -ge 80 ]; then
    echo -e "${YELLOW}⚠️  MOSTLY READY (some optional items missing)${NC}"
    echo ""
    echo "You can proceed with deployment, but consider fixing failed items."
    exit 0
else
    echo -e "${RED}❌ NOT READY FOR DEPLOYMENT${NC}"
    echo ""
    echo "Please fix the failed required items before deploying."
    echo "Run deploy-cloud.sh to set up missing components."
    exit 1
fi