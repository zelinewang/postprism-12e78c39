#!/bin/bash

# PostPrism Cloud Deployment Script
# Optimizes the project for free cloud deployment (Lovable + Render.com)

echo "🚀 PostPrism Cloud Deployment Setup"
echo "=================================="

# Check if we're on the cloud-deployment branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "cloud-deployment" ]; then
    echo "⚠️  Warning: Not on cloud-deployment branch. Current: $CURRENT_BRANCH"
    echo "💡 Run: git checkout cloud-deployment"
    exit 1
fi

echo "✅ On cloud-deployment branch"

# 1. Setup cloud environment
echo "📝 Setting up cloud environment configuration..."
cp cloud.env.example .env.cloud.local
echo "✅ Cloud environment file created"

# 2. Install frontend dependencies
echo "📦 Installing frontend dependencies..."
if [ -f "package.json" ]; then
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "❌ package.json not found"
    exit 1
fi

# 3. Setup backend for cloud deployment
echo "🔧 Preparing backend for cloud deployment..."
cd backend

# Install Python dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📚 Installing Python dependencies..."
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        echo "📦 Virtual environment created"
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Upgrade pip
    pip install --upgrade pip
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Install cloud-specific optimizations
    echo "⚡ Installing cloud performance packages..."
    pip install gunicorn eventlet gevent redis
    
    echo "✅ Backend dependencies installed"
else
    echo "❌ requirements.txt not found in backend/"
    exit 1
fi

cd ..

# 4. Optimize for demo mode
echo "🎮 Optimizing for cloud demo experience..."

# Check if demo config exists
if [ -f "src/config/api.ts" ]; then
    echo "✅ Demo configuration found"
else
    echo "❌ Demo configuration not found"
    exit 1
fi

# 5. Validate deployment files
echo "📋 Validating cloud deployment files..."

# Check Render.com config
if [ -f "backend/render.yaml" ]; then
    echo "✅ Render.com configuration found"
else
    echo "❌ backend/render.yaml not found"
    exit 1
fi

# Check if package.json has correct scripts
if grep -q "\"build\"" package.json; then
    echo "✅ Build script found in package.json"
else
    echo "❌ Build script missing in package.json"
fi

# 6. Create deployment summary
echo ""
echo "🎉 Cloud Deployment Ready!"
echo "========================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "🔸 Frontend Deployment (Lovable):"
echo "   1. Push this branch to GitHub"
echo "   2. Visit https://lovable.dev"
echo "   3. Import your repository"
echo "   4. Set environment variables:"
echo "      - VITE_DEMO_MODE=true"
echo "      - VITE_API_URL=https://your-backend.onrender.com"
echo "   5. Deploy with one click!"
echo ""
echo "🔸 Backend Deployment (Render.com):"
echo "   1. Visit https://render.com"
echo "   2. Connect your GitHub repository"
echo "   3. Choose 'Web Service'"
echo "   4. Set environment variables:"
echo "      - FLASK_ENV=production"
echo "      - DEMO_MODE_BACKEND=true"
echo "      - CORS_ORIGINS=https://your-frontend.lovable.app"
echo "   5. Deploy automatically!"
echo ""
echo "🔸 Local Testing:"
echo "   npm run dev (frontend)"
echo "   python backend/run_fixed.py (backend)"
echo ""
echo "💡 For detailed deployment guide, see FREE_DEPLOYMENT_GUIDE.md"
echo ""
echo "🚀 Your PostPrism cloud demo will be available at:"
echo "   https://your-project.lovable.app"
echo ""

# 7. Optional: Start local development server for testing
read -p "🤔 Start local development server for testing? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting local development servers..."
    
    # Start backend in background
    echo "🔧 Starting backend..."
    cd backend
    source venv/bin/activate
    python run_fixed.py &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    echo "🎨 Starting frontend..."
    npm run dev &
    FRONTEND_PID=$!
    
    echo ""
    echo "✅ Local servers started!"
    echo "🔗 Frontend: http://localhost:8080"
    echo "🔗 Backend: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop servers"
    
    # Wait for user to stop
    trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
    wait
fi

echo "🎯 Cloud deployment setup complete!"