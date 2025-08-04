"""
PostPrism Backend Configuration Module

This module manages all configuration settings for the PostPrism backend application.
It handles environment variables, API keys, and system configuration parameters.

Key Components:
- Environment variable loading and validation
- API key management for AI services
- AgentS2 and ORGO configuration
- Flask and WebSocket settings
- Logging configuration

Architecture:
The configuration is designed to be environment-aware, supporting development,
testing, and production environments with appropriate defaults and validation.
"""

import os
from typing import Optional, Dict, Any
from dataclasses import dataclass
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()

@dataclass
class AIModelConfig:
    """Configuration for AI model APIs (Anthropic Claude, OpenAI GPT)"""
    anthropic_api_key: str
    openai_api_key: str
    default_model: str = "gpt-4o"
    grounding_model: str = "claude-3-7-sonnet-20250219"
    max_tokens: int = 2000
    temperature: float = 0.7

@dataclass
class ORGOConfig:
    """Configuration for ORGO virtual environment API"""
    api_key: str
    endpoint: str = "https://api.orgo.ai"
    timeout: int = 300
    retry_attempts: int = 3
    screenshot_quality: int = 85

@dataclass
class AgentS2_5Config:
    """Configuration for AgentS2.5 automation agent (latest version)"""
    # Main generation model parameters
    model: str = "gpt-4o-mini"  # Fast and cheap model to avoid rate limits
    model_type: str = "openai"
    model_url: str = ""  # Optional custom API URL
    model_api_key: str = ""  # Optional separate API key
    
    # Grounding model parameters (required for S2.5)
    grounding_model: str = "ui-tars-1.5-7b"  # Official recommendation
    grounding_type: str = "huggingface"
    grounding_url: str = "http://localhost:8080"  # Required for grounding model
    grounding_api_key: str = ""  # Optional grounding API key
    grounding_width: int = 1920  # Output coordinate resolution width
    grounding_height: int = 1080  # Output coordinate resolution height
    
    # Agent behavior parameters
    max_trajectory_length: int = 8  # Official default
    enable_reflection: bool = True  # Official default
    max_steps: int = 15
    step_delay: float = 1.0
    platform: str = "linux"
    
    # Legacy parameters (maintained for compatibility)
    action_space: str = "pyautogui"
    observation_type: str = "screenshot"
    remote: bool = True

@dataclass
class WebSocketConfig:
    """Configuration for real-time WebSocket streaming"""
    host: str = "0.0.0.0"
    port: int = 8000
    cors_allowed_origins: str = "*"
    ping_timeout: int = 60
    ping_interval: int = 25
    max_frame_size: int = 1024 * 1024  # 1MB max frame size

@dataclass
class FlaskConfig:
    """Configuration for Flask web application"""
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    secret_key: str = "postprism-secret-key-change-in-production"
    cors_origins: list = None

class Settings:
    """
    Central configuration management class for PostPrism backend.
    
    This class initializes and validates all configuration parameters from environment
    variables, providing a single source of truth for application settings.
    
    Usage:
        settings = Settings()
        ai_config = settings.ai_model
        orgo_config = settings.orgo
    """
    
    def __init__(self):
        """Initialize all configuration sections with environment variable validation"""
        self._validate_required_env_vars()
        
        # Initialize configuration sections
        self.ai_model = self._init_ai_model_config()
        self.orgo = self._init_orgo_config()
        self.agents2_5 = self._init_agents2_5_config()
        self.websocket = self._init_websocket_config()
        self.flask = self._init_flask_config()
        
        # Setup logging
        self._setup_logging()
    
    def _validate_required_env_vars(self) -> None:
        """Validate that all required environment variables are present"""
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
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
    
    def _init_ai_model_config(self) -> AIModelConfig:
        """Initialize AI model configuration from environment variables"""
        return AIModelConfig(
            anthropic_api_key=os.getenv('ANTHROPIC_API_KEY'),
            openai_api_key=os.getenv('OPENAI_API_KEY'),
            default_model=os.getenv('AGENTS2_MODEL', 'gpt-4o'),
            grounding_model=os.getenv('AGENTS2_GROUNDING_MODEL', 'claude-3-7-sonnet-20250219'),
            max_tokens=int(os.getenv('AI_MAX_TOKENS', '2000')),
            temperature=float(os.getenv('AI_TEMPERATURE', '0.7'))
        )
    
    def _init_orgo_config(self) -> ORGOConfig:
        """Initialize ORGO configuration from environment variables"""
        return ORGOConfig(
            api_key=os.getenv('ORGO_API_KEY'),
            endpoint=os.getenv('ORGO_ENDPOINT', 'https://api.orgo.ai'),
            timeout=int(os.getenv('ORGO_TIMEOUT', '300')),
            retry_attempts=int(os.getenv('ORGO_RETRY_ATTEMPTS', '3')),
            screenshot_quality=int(os.getenv('ORGO_SCREENSHOT_QUALITY', '85'))
        )
    
    def _init_agents2_5_config(self) -> AgentS2_5Config:
        """Initialize AgentS2.5 configuration from environment variables (latest version)"""
        return AgentS2_5Config(
            # Main generation model parameters
            model=os.getenv('AGENTS2_5_MODEL', 'gpt-4o-mini'),
            model_type=os.getenv('AGENTS2_5_MODEL_TYPE', 'openai'),
            model_url=os.getenv('AGENTS2_5_MODEL_URL', ''),
            model_api_key=os.getenv('AGENTS2_5_MODEL_API_KEY', ''),
            
            # Grounding model parameters (required for S2.5)
            grounding_model=os.getenv('AGENTS2_5_GROUNDING_MODEL', 'ui-tars-1.5-7b'),
            grounding_type=os.getenv('AGENTS2_5_GROUNDING_TYPE', 'huggingface'),
            grounding_url=os.getenv('AGENTS2_5_GROUNDING_URL', 'http://localhost:8080'),
            grounding_api_key=os.getenv('AGENTS2_5_GROUNDING_API_KEY', ''),
            grounding_width=int(os.getenv('AGENTS2_5_GROUNDING_WIDTH', '1920')),
            grounding_height=int(os.getenv('AGENTS2_5_GROUNDING_HEIGHT', '1080')),
            
            # Agent behavior parameters
            max_trajectory_length=int(os.getenv('AGENTS2_5_MAX_TRAJECTORY_LENGTH', '8')),
            enable_reflection=os.getenv('AGENTS2_5_ENABLE_REFLECTION', 'true').lower() == 'true',
            max_steps=int(os.getenv('AGENTS2_5_MAX_STEPS', '15')),
            step_delay=float(os.getenv('AGENTS2_5_STEP_DELAY', '1.0')),
            platform=os.getenv('AGENTS2_5_PLATFORM', 'linux'),
            
            # Legacy parameters (maintained for compatibility)
            action_space=os.getenv('AGENTS2_5_ACTION_SPACE', 'pyautogui'),
            observation_type=os.getenv('AGENTS2_5_OBSERVATION_TYPE', 'screenshot'),
            remote=os.getenv('AGENTS2_5_REMOTE', 'true').lower() == 'true'
        )
    
    def _init_websocket_config(self) -> WebSocketConfig:
        """Initialize WebSocket configuration from environment variables"""
        return WebSocketConfig(
            host=os.getenv('WEBSOCKET_HOST', '0.0.0.0'),
            port=int(os.getenv('WEBSOCKET_PORT', '8000')),
            cors_allowed_origins=os.getenv('WEBSOCKET_CORS_ORIGINS', '*'),
            ping_timeout=int(os.getenv('WEBSOCKET_PING_TIMEOUT', '60')),
            ping_interval=int(os.getenv('WEBSOCKET_PING_INTERVAL', '25')),
            max_frame_size=int(os.getenv('WEBSOCKET_MAX_FRAME_SIZE', str(1024 * 1024)))
        )
    
    def _init_flask_config(self) -> FlaskConfig:
        """Initialize Flask configuration from environment variables"""
        cors_origins = os.getenv('FLASK_CORS_ORIGINS')
        return FlaskConfig(
            host=os.getenv('FLASK_HOST', '0.0.0.0'),
            port=int(os.getenv('FLASK_PORT', '8000')),
            debug=os.getenv('FLASK_DEBUG', 'true').lower() == 'true',
            secret_key=os.getenv('FLASK_SECRET_KEY', 'postprism-secret-key-change-in-production'),
            cors_origins=cors_origins.split(',') if cors_origins else ['http://localhost:8080']
        )
    
    def _setup_logging(self) -> None:
        """Setup application logging configuration"""
        log_level = os.getenv('LOG_LEVEL', 'INFO').upper()
        log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        
        logging.basicConfig(
            level=getattr(logging, log_level),
            format=log_format,
            handlers=[
                logging.StreamHandler(),
                logging.FileHandler(os.getenv('LOG_FILE', 'postprism.log'))
            ]
        )
    
    def get_config_dict(self) -> Dict[str, Any]:
        """Return configuration as dictionary for debugging purposes"""
        return {
            'ai_model': {
                'model': self.ai_model.default_model,
                'grounding_model': self.ai_model.grounding_model,
                'max_tokens': self.ai_model.max_tokens,
                'temperature': self.ai_model.temperature
            },
            'orgo': {
                'endpoint': self.orgo.endpoint,
                'timeout': self.orgo.timeout,
                'retry_attempts': self.orgo.retry_attempts,
                'screenshot_quality': self.orgo.screenshot_quality
            },
            'agents2_5': {
                'model': self.agents2_5.model,
                'model_type': self.agents2_5.model_type,
                'grounding_model': self.agents2_5.grounding_model,
                'grounding_type': self.agents2_5.grounding_type,
                'grounding_url': self.agents2_5.grounding_url,
                'grounding_width': self.agents2_5.grounding_width,
                'grounding_height': self.agents2_5.grounding_height,
                'max_trajectory_length': self.agents2_5.max_trajectory_length,
                'enable_reflection': self.agents2_5.enable_reflection,
                'max_steps': self.agents2_5.max_steps,
                'step_delay': self.agents2_5.step_delay,
                'platform': self.agents2_5.platform,
                'remote': self.agents2_5.remote
            },
            'websocket': {
                'host': self.websocket.host,
                'port': self.websocket.port,
                'cors_allowed_origins': self.websocket.cors_allowed_origins
            },
            'flask': {
                'host': self.flask.host,
                'port': self.flask.port,
                'debug': self.flask.debug
            }
        }

# Global settings instance
settings = Settings()