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
echo "📚 Installing and upgrading standard dependencies..."
pip install --upgrade -r requirements.txt

# Install GUI Agents S2.5 (core automation engine)
echo "🤖 Installing GUI Agents S2.5..."
pip install git+https://github.com/aiwaves-cn/agents.git

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
echo ""
echo "------------------------------------------------"
echo "🚀 Now running interactive environment setup..."
echo "------------------------------------------------"
python3 setup_env.py

echo ""
echo "✅ Environment setup complete."
echo "💡 Next steps:"
echo "   1. Review the generated .env file and ensure all values are correct."
echo "   2. Run 'python run_fixed.py' to start the PostPrism backend."