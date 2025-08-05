# 🚀 PostPrism Setup Guide

Welcome to PostPrism! This guide will help you set up the project for both development and production use.

## 📋 Prerequisites

### Required API Keys

1. **OpenAI API Key** 🤖
   - Visit: https://platform.openai.com/api-keys
   - Create a new API key
   - Cost: ~$0.01-0.05 per publishing session

2. **ORGO AI API Key** 🖥️
   - Visit: https://console.orgo.ai/
   - Sign up and get your API key
   - Cost: ~$0.10-0.30 per VM hour

### Optional (Recommended for Production)

3. **Dedicated VM Project IDs** 🏗️
   - Create separate projects for each platform at https://console.orgo.ai/projects
   - Benefits: Persistent login states, faster publishing

## 🎯 Quick Start Options

### Option 1: Demo Mode (No API Keys Required) 🎮

```bash
# Frontend only
npm install
npm run dev

# Set demo mode
echo "VITE_DEMO_MODE=true" > .env.local
```

**Perfect for**: Testing UI, understanding workflow, demonstrations

### Option 2: Local Development 🔧

```bash
# 1. Clone and setup
git clone <your-repo>
cd postprism
npm install

# 2. Backend setup
cd backend
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 4. Run both services
# Terminal 1 - Backend
cd backend && python run_fixed.py

# Terminal 2 - Frontend  
npm run dev
```

### Option 3: Cloud Deployment 🚀

#### Frontend (Lovable)
1. Visit: https://lovable.dev/projects/9ff328fc-5e74-44a5-963a-1855a28041e4
2. Fork the project
3. Configure environment variables in Lovable settings

#### Backend (Railway - Recommended)
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Deploy
cd backend
railway login
railway init
railway up

# 3. Set environment variables
railway variables set OPENAI_API_KEY=your_key
railway variables set ORGO_API_KEY=your_key
railway variables set FLASK_ENV=production
railway variables set CORS_ORIGINS=https://your-lovable-app.lovable.app
```

## 🔧 Detailed Configuration

### Environment Variables Explained

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | ✅ | OpenAI API for Agent S2.5 | `sk-...` |
| `ORGO_API_KEY` | ✅ | ORGO AI for virtual desktops | `orgo-...` |
| `ORGO_LINKEDIN_PROJECT_ID` | ⚪ | Dedicated LinkedIn VM | `proj_abc123` |
| `ORGO_TWITTER_PROJECT_ID` | ⚪ | Dedicated Twitter VM | `proj_def456` |
| `ORGO_INSTAGRAM_PROJECT_ID` | ⚪ | Dedicated Instagram VM | `proj_ghi789` |
| `VITE_DEMO_MODE` | ⚪ | Enable demo mode | `true/false` |

### Advanced Agent Configuration

For power users who want to customize Agent S2.5 behavior:

```bash
# Model Selection (balance cost vs performance)
AGENTS2_5_MODEL=gpt-4o-mini          # Fast, cheap
AGENTS2_5_MODEL=gpt-4o               # Balanced  
AGENTS2_5_MODEL=o3-2025-04-16        # Best performance

# Performance Tuning
AGENTS2_5_MAX_STEPS=15               # Max automation steps
AGENTS2_5_STEP_DELAY=1.0             # Delay between actions
AGENTS2_5_ENABLE_REFLECTION=true     # Enable learning
```

## 🎮 Usage Workflows

### Basic Publishing Flow
1. **Input Content**: Write your post once
2. **Select Platforms**: Choose LinkedIn, Twitter, Instagram
3. **Watch Live**: Observe AI working simultaneously
4. **Get Results**: View success metrics and post URLs

### Demo Mode Features
- ✅ Complete UI experience
- ✅ Simulated live streaming
- ✅ Mock publishing results
- ✅ No API costs
- ✅ Perfect for presentations

### Production Features
- ✅ Real Agent S2.5 automation
- ✅ Live video streaming of AI work
- ✅ Parallel multi-platform execution
- ✅ Persistent VM states
- ✅ Production-grade error handling

## 🚨 Troubleshooting

### Common Issues

**1. "Failed to connect to backend"**
```bash
# Check if backend is running
curl http://localhost:8000/health

# Check logs
tail -f backend/postprism.log
```

**2. "OpenAI API rate limit"**
```bash
# Switch to gpt-4o-mini for lower costs
AGENTS2_5_MODEL=gpt-4o-mini
```

**3. "ORGO VM creation failed"**
```bash
# Check ORGO API key and credits
curl -H "Authorization: Bearer $ORGO_API_KEY" https://api.orgo.ai/health
```

**4. "WebSocket connection failed"**
```bash
# For production deployment, ensure CORS is configured
CORS_ORIGINS=https://your-frontend-domain.com
```

### Performance Optimization

**For High-Volume Usage:**
1. Use dedicated VM project IDs for each platform
2. Set up VM persistence to avoid re-authentication
3. Use `gpt-4o-mini` for cost optimization
4. Enable reflection for improved success rates

**For Cost Optimization:**
```bash
# Minimize API calls
AGENTS2_5_MODEL=gpt-4o-mini
AGENTS2_5_MAX_STEPS=10
AGENTS2_5_STEP_DELAY=2.0

# Use shared VMs (slower but cheaper)
# Don't set platform-specific project IDs
```

## 📞 Support

### Getting Help
- 📖 **Documentation**: Check README.md for architecture details
- 🐛 **Issues**: Report bugs in GitHub Issues
- 💬 **Discord**: Join our community for real-time help
- 📧 **Email**: support@postprism.ai

### Contributing
We welcome contributions! See CONTRIBUTING.md for guidelines.

---

**Ready to revolutionize your social media workflow?** 🚀

Choose your setup option above and start publishing with AI in minutes!