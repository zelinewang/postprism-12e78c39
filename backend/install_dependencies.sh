#!/bin/bash

# PostPrism Backend Dependencies Installation Script
# This script installs all required dependencies for PostPrism

echo "🚀 Installing PostPrism Backend Dependencies..."
echo "================================================"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip to latest version
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install standard dependencies from requirements.txt
echo "📚 Installing standard dependencies..."
pip install -r requirements.txt

# Install GUI Agents S2.5 (core automation engine)
echo "🤖 Installing GUI Agents S2.5..."
pip install git+https://github.com/computer-agents/gui-agents.git

# Install ORGO API client (virtual environment)
echo "🖥️  Installing ORGO API client..."
pip install orgo

# Verify installations
echo "✅ Verifying installations..."
python -c "
try:
    import flask
    import flask_socketio
    import openai
    import anthropic
    import PIL
    import requests
    from dotenv import load_dotenv
    print('✅ Standard dependencies: OK')
except ImportError as e:
    print(f'❌ Standard dependencies error: {e}')

try:
    from gui_agents.s2_5.agents.agent_s import AgentS2_5
    from gui_agents.s2_5.agents.grounding import OSWorldACI
    print('✅ GUI Agents S2.5: OK')
except ImportError as e:
    print(f'❌ GUI Agents S2.5 error: {e}')

try:
    from orgo import Computer
    print('✅ ORGO API: OK')
except ImportError as e:
    print(f'❌ ORGO API error: {e}')
"

echo ""
echo "🎉 Installation complete!"
echo "💡 Next steps:"
echo "   1. Copy .env.example to .env and configure your API keys"
echo "   2. Set ORGO_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY"
echo "   3. Configure platform-specific ORGO project IDs"
echo "   4. Run: python run_fixed.py"