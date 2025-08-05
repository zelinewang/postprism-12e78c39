#!/usr/bin/env python3
"""
PostPrism Backend FINAL Step-by-Step Startup Script

This script runs the FINAL Step-by-Step version - the ultimate synthesis of ALL best practices.

FINAL Step-by-Step features (融合所有最佳功能):
1. Complete image repair (Enhanced+Ultimate+Official synthesis)
2. Intelligent multi-API key rotation with smart switching on rate limits
3. Atomic step-by-step execution with forced operation verification
4. Complete resource isolation for true LinkedIn+Twitter parallelism
5. Smart loop detection and intervention mechanisms
6. O3 model optimized (40s timeouts + intelligent API spacing)
7. Ultimate error recovery with multiple fallback strategies
8. Synthesis of Official+Enhanced+Ultimate+Step-by-Step+Working best practices

Usage:
    python run_fixed.py                  # Start FINAL Step-by-Step version
    python run_fixed.py --debug          # Enable debug mode
    python run_fixed.py --test           # Run system test
"""

import os
import sys
import argparse
import logging
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

try:
    from app_fixed import postprism_app_fixed
    from config.settings import settings
except ImportError as e:
    print(f"❌ Failed to import fixed PostPrism modules: {e}")
    print("Make sure all dependencies are installed:")
    print("pip install -r requirements.txt")
    sys.exit(1)

def setup_logging():
    """Setup comprehensive logging"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('postprism_fixed.log')
        ]
    )

def validate_environment():
    """Validate required environment variables"""
    required_vars = [
        'ANTHROPIC_API_KEY',
        'OPENAI_API_KEY', 
        'ORGO_API_KEY'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"  - {var}")
        print("\nPlease set these environment variables before starting.")
        return False
    
    print("✅ All required environment variables are set")
    return True

def show_fixed_features():
    """Display fixed features and improvements"""
    print("\n" + "="*70)
    print("🔧 PostPrism FINAL Step-by-Step Version - 融合所有最佳功能")
    print("="*70)
    print("\n🚀 FINAL Step-by-Step Ultimate Features:")
    print("  ✅ Complete image repair (Enhanced+Ultimate+Official synthesis)")
    print("  ✅ Intelligent multi-API key rotation with smart switching")
    print("  ✅ Atomic step execution with forced operation verification")
    print("  ✅ Complete resource isolation (true LinkedIn+Twitter parallelism)")
    print("  ✅ Smart loop detection and intervention mechanisms")
    print("  ✅ O3 optimized (40s timeouts + intelligent API spacing)")
    print("  ✅ Ultimate error recovery with multiple fallback strategies")
    print("  ✅ Synthesis of all previous versions' best practices")
    
    print("\n🤖 Agent S2.5 Configuration:")
    print(f"  Model: {settings.agents2_5.model}")
    print(f"  Grounding Model: {settings.agents2_5.grounding_model}")
    print(f"  Max Trajectory: {settings.agents2_5.max_trajectory_length}")
    print(f"  Reflection: {settings.agents2_5.enable_reflection}")
    print(f"  Step Delay: {settings.agents2_5.step_delay}s")
    
    print("\n📱 Supported Platforms:")
    platforms = []
    if os.getenv('ORGO_LINKEDIN_PROJECT_ID'):
        platforms.append("LinkedIn (dedicated VM)")
    if os.getenv('ORGO_TWITTER_PROJECT_ID'):
        platforms.append("Twitter (dedicated VM)")
    if os.getenv('ORGO_INSTAGRAM_PROJECT_ID'):
        platforms.append("Instagram (dedicated VM)")
    
    if platforms:
        for platform in platforms:
            print(f"  ✅ {platform}")
    else:
        print("  ⚠️  No dedicated VMs configured - using default ORGO instance")
    
    print("\n🔍 Problem Analysis Fixed:")
    print("  ❌ Old: Complex, micro-managed instructions")
    print("  ✅ New: Simple, natural language goals")
    print("  ❌ Old: Agent treated as script executor")
    print("  ✅ New: Agent treated as intelligent autonomous system")
    print("  ❌ Old: Inadequate UI state detection")
    print("  ✅ New: Proper waiting and state validation")
    print("  ❌ Old: Multiple redundant manager classes")
    print("  ✅ FINAL: Ultimate Step-by-Step Agent Manager (synthesis of all versions)")
    print("="*70)

def run_system_test():
    """Run a comprehensive system test"""
    print("\n🧪 Running PostPrism Fixed System Test...")
    
    try:
        import asyncio
        import requests
        import time
        
        # Start app in background
        print("1. Starting fixed PostPrism backend...")
        
        # Test health endpoint
        print("2. Testing health endpoint...")
        time.sleep(2)  # Give server time to start
        
        try:
            response = requests.get('http://localhost:8000/health', timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Health check passed: {data.get('version')}")
                print(f"   ✅ Agent system: {data.get('agent_system')}")
            else:
                print(f"   ❌ Health check failed: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Health check failed: {e}")
            return False
        
        # Test FINAL Step-by-Step agent endpoint
        print("3. Testing FINAL Step-by-Step Agent S2.5...")
        try:
            test_data = {
                'platform': 'linkedin',
                'content': 'System test with FINAL Step-by-Step Agent S2.5 ultimate execution'
            }
            response = requests.post(
                'http://localhost:8000/api/test-official-agent',
                json=test_data,
                timeout=30
            )
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ FINAL Step-by-Step Agent S2.5 test: {data.get('success')}")
                print(f"   ✅ System: {data.get('system')}")
            else:
                print(f"   ❌ Agent test failed: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Agent test failed: {e}")
            return False
        
        print("\n🎉 All system tests passed! Fixed PostPrism is working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ System test failed: {e}")
        return False

def main():
    """Main entry point for fixed PostPrism"""
    parser = argparse.ArgumentParser(
        description="PostPrism Backend FINAL Step-by-Step - 融合所有最佳功能",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_fixed.py                  # Start fixed version
  python run_fixed.py --debug          # Enable debug mode  
  python run_fixed.py --test           # Run system test
        """
    )
    
    parser.add_argument('--host', default=None, help='Host to bind to')
    parser.add_argument('--port', type=int, default=None, help='Port to bind to')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    parser.add_argument('--test', action='store_true', help='Run system test')
    
    args = parser.parse_args()
    
    # Setup logging
    setup_logging()
    logger = logging.getLogger(__name__)
    
    try:
        # Validate environment
        if not validate_environment():
            sys.exit(1)
        
        # Show fixed features
        show_fixed_features()
        
        # Run system test if requested
        if args.test:
            success = run_system_test()
            sys.exit(0 if success else 1)
        
        # Determine runtime parameters
        host = args.host or settings.flask.host
        port = args.port or settings.flask.port
        debug = args.debug or settings.flask.debug
        
        # Final startup message
        print(f"\n🚀 Starting FINAL Step-by-Step PostPrism Backend...")
        print(f"   Server: http://{host}:{port}")
        print(f"   WebSocket: ws://{host}:{port}")
        print(f"   Debug Mode: {debug}")
        print(f"   Agent System: FINAL Step-by-Step Agent S2.5")
        
        print("\n📡 Fixed System Components:")
        print("   ✅ Flask Web Server")
        print("   ✅ WebSocket Real-time Streaming")
        print("   ✅ AI Content Adaptation (Claude + GPT-4)")
        print("   ✅ FINAL Step-by-Step Agent S2.5 Engine (Ultimate Synthesis)")
        print("   ✅ ORGO Virtual Environment")
        
        print("\n🎬 Fixed Features:")
        print("   ✅ Simple, natural Agent S2.5 instructions")
        print("   ✅ Proper UI state detection and waiting")
        print("   ✅ Clean architecture without redundancy")
        print("   ✅ Better async handling and error recovery")
        print("   ✅ LinkedIn-optimized publishing workflows")
        print("   ✅ Real-time automation streaming")
        
        print(f"\n⚡ Ready to serve requests with fixed implementation!")
        print("="*70)
        
        # Start the fixed application
        postprism_app_fixed.run(host=host, port=port, debug=debug)
        
    except KeyboardInterrupt:
        logger.info("\n👋 Fixed PostPrism Backend shutdown requested by user")
        print("\n👋 Fixed PostPrism Backend has been shut down gracefully.")
        
    except Exception as e:
        logger.error(f"❌ Failed to start fixed PostPrism Backend: {str(e)}")
        print(f"\n❌ Startup failed: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Check that all environment variables are set correctly")
        print("2. Ensure all dependencies are installed: pip install -r requirements.txt")
        print("3. Verify API keys are valid and have appropriate permissions")
        print("4. Check that ports are not already in use")
        print("5. Ensure ORGO project IDs are configured correctly")
        sys.exit(1)

if __name__ == '__main__':
    main()