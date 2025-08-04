"""
PostPrism AgentS2.5 Controller Package

This package manages the integration with AgentS2.5 and the ORGO virtual environment
for automated social media publishing.

It provides different agent manager implementations.
"""

# Expose the core, production-ready agent managers
from .official_agent_manager import OfficialAgentManager
from .optimized_agent_manager import OptimizedAgentManager, OptimizedPublishResult

__all__ = [
    "OfficialAgentManager",
    "OptimizedAgentManager",
    "OptimizedPublishResult"
]
