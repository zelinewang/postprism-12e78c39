"""
PostPrism Backend - Fixed Implementation with Official Agent S2.5

This version fixes all the identified issues:
1. Uses official Agent S2.5 patterns
2. Simple, natural instructions
3. Proper async handling
4. Clean architecture without redundancy
5. Better error handling and logging

Key improvements:
- Replaced complex agent manager with official patterns
- Simplified instruction design
- Removed architectural redundancy
- Better UI state detection
- Proper waiting mechanisms
"""

import os
import sys
import time
import uuid
import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

# Flask and WebSocket imports
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room

# Internal imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from config.settings import settings
from content_adapters.multi_platform_adapter import MultiPlatformAdapter
from agent_s2_controller.optimized_agent_manager import OptimizedAgentManager, OptimizedPublishResult
from streaming.video_streamer import VideoStreamer
from streaming.progress_tracker import ProgressTracker

# Setup logging
logger = logging.getLogger(__name__)

class PostPrismApp:
    """
    Fixed PostPrism Flask application with official Agent S2.5 integration
    
    Key improvements:
    1. Simplified architecture
    2. Official Agent S2.5 patterns
    3. Better error handling
    4. Cleaner WebSocket integration
    5. Proper async handling
    """
    
    def __init__(self):
        """Initialize the fixed PostPrism application"""
        self.app = self._create_flask_app()
        self.socketio = self._setup_websocket()
        
        # Initialize core components with OPTIMIZED agent manager
        self.content_adapter = MultiPlatformAdapter(settings.ai_model)
        self.optimized_agent_manager = OptimizedAgentManager(settings)  # OPTIMIZED: Simple, efficient, proven agent manager
        self.video_streamer = VideoStreamer(self.socketio)
        self.progress_tracker = ProgressTracker()
        
        # Register routes and event handlers
        self._register_routes()
        self._register_websocket_events()
        
        logger.info("✅ PostPrism backend initialized with official Agent S2.5")
    
    def _create_flask_app(self) -> Flask:
        """Create and configure Flask application"""
        app = Flask(__name__)
        app.config['SECRET_KEY'] = settings.flask.secret_key
        app.config['DEBUG'] = settings.flask.debug
        
        # Setup CORS for frontend communication
        CORS(app, origins=settings.flask.cors_origins)
        
        logger.info(f"Flask app created with debug={settings.flask.debug}")
        return app
    
    def _setup_websocket(self) -> SocketIO:
        """Setup WebSocket server for real-time communication"""
        socketio = SocketIO(
            self.app,
            cors_allowed_origins="*",
            async_mode='threading',
            logger=False,
            engineio_logger=False,
            # Minimal config to avoid connection issues
            ping_timeout=30,
            ping_interval=10,
            max_http_buffer_size=100000,
            # Force polling to avoid WebSocket upgrade issues
            transports=['polling']
        )
        
        logger.info("WebSocket server configured (polling-only)")
        return socketio
    
    def _register_routes(self) -> None:
        """Register all Flask HTTP routes"""
        
        @self.app.route('/health', methods=['GET'])
        def health_check():
            """Health check endpoint with parallel execution support"""
            # Check platform configurations
            platform_status = {}
            for platform, project_id in self.optimized_agent_manager.platform_projects.items():
                platform_status[platform] = 'configured' if project_id else 'missing_project_id'
            
            return jsonify({
                'status': 'healthy',
                'timestamp': datetime.utcnow().isoformat(),
                'version': '7.0.0-optimized',
                'agent_system': 'optimized-agent-s2.5',
                'features': [
                    'Optimized Agent S2.5 (Based on official cli_app.py patterns)',
                    'Rate limiting mitigation with intelligent spacing',
                    'Precise completion detection',
                    'Smart publish detection and anti-perfectionism',
                    'True parallel execution with resource isolation',
                    'Optimized execution timing and performance'
                ],
                'components': {
                    'ai_adapter': 'ready',
                    'optimized_agent_manager': 'ready',
                    'video_streamer': 'ready',
                    'parallel_execution': 'resource_isolation',
                    'rate_limiting': 'intelligent_mitigation',
                    'completion_detection': 'optimized_patterns'
                },
                'platform_support': platform_status
            })
        
        @self.app.route('/api/config', methods=['GET'])
        def get_config():
            """Get current system configuration"""
            return jsonify(settings.get_config_dict())
        
        @self.app.route('/api/preview-content', methods=['POST'])
        def preview_content():
            """Preview AI-adapted content without publishing"""
            try:
                data = request.get_json()
                content = data.get('content', '').strip()
                platforms = data.get('platforms', ['linkedin', 'twitter', 'instagram'])
                
                if not content:
                    return jsonify({
                        'success': False,
                        'error': 'Content cannot be empty'
                    }), 400
                
                logger.info(f"Previewing content for platforms: {platforms}")
                
                # Use AI adapter to generate previews
                adapted_content = self.content_adapter.adapt_for_platforms(content, platforms)
                
                return jsonify({
                    'success': True,
                    'data': {
                        'original': content,
                        'adaptations': adapted_content,
                        'preview_mode': True
                    }
                })
                
            except Exception as e:
                logger.error(f"Error in preview_content: {str(e)}")
                return jsonify({
                    'success': False,
                    'error': f'Preview failed: {str(e)}'
                }), 500
        
        @self.app.route('/api/publish-content', methods=['POST'])
        def publish_content():
            """
            FIXED: Core publishing endpoint with official Agent S2.5
            
            Key improvements:
            1. Uses official Agent S2.5 patterns
            2. Simple, natural instructions
            3. Better error handling
            4. Cleaner async execution
            5. Proper WebSocket streaming
            """
            try:
                data = request.get_json()
                content = data.get('content', '').strip()
                platforms = data.get('platforms', ['linkedin', 'twitter', 'instagram'])
                session_id = data.get('session_id', str(uuid.uuid4()))  # 使用前端传递的session_id
                
                # Input validation
                if not content:
                    return jsonify({
                        'success': False,
                        'error': 'Content cannot be empty'
                    }), 400
                
                if not platforms:
                    return jsonify({
                        'success': False,
                        'error': 'At least one platform must be selected'
                    }), 400
                
                logger.info(f"🚀 Starting FIXED publish process for session {session_id}")
                logger.info(f"Content: {content[:100]}... | Platforms: {platforms}")
                
                # Start real-time streaming session
                self.video_streamer.start_streaming(session_id)
                
                # Initialize progress tracking
                self.progress_tracker.initialize_session(session_id, platforms)
                
                # Emit publishing started event 
                self.socketio.emit('publish_started', {
                    'session_id': session_id,
                    'total_platforms': len(platforms),
                    'platforms': platforms,
                    'message': 'Starting AI content adaptation...',
                    'system': 'official-agent-s2.5'
                }, room=session_id)
                
                start_time = time.time()
                
                # Step 1: AI Content Adaptation
                logger.info("Step 1: AI content adaptation")
                adapted_content = self.content_adapter.adapt_for_platforms(content, platforms)
                
                # Emit adaptation complete
                self.socketio.emit('adaptation_complete', {
                    'session_id': session_id,
                    'adapted_content': adapted_content,
                    'message': 'AI adaptation complete. Starting official Agent S2.5 automation...'
                }, room=session_id)
                
                # Step 2: FIXED - Official Agent S2.5 Automation
                logger.info("Step 2: Official Agent S2.5 automation with live streaming")
                
                # Run official Agent S2.5 automation
                publish_results = asyncio.run(
                    self._execute_official_publishing(
                        adapted_content, platforms, session_id
                    )
                )
                
                # Calculate total execution time
                total_time = time.time() - start_time
                
                # FIXED: Emit final completion with consistent data format
                # This ensures frontend receives the event before connection closes
                self.socketio.emit('all_platforms_completed', {
                    'session_id': session_id,
                    'results': {'platforms': publish_results},  # Consistent nested format
                    'total_time': f"{total_time:.1f} seconds",
                    'message': 'Publishing completed with enhanced Agent S2.5!',
                    'system': 'enhanced-agent-s2.5'
                }, room=session_id)
                
                # Give frontend time to process completion event before stopping streaming
                time.sleep(2.0)
                
                # Now stop streaming
                self.video_streamer.stop_streaming(session_id)
                
                logger.info(f"✅ Publish process completed for session {session_id} in {total_time:.1f}s")
                
                return jsonify({
                    'success': True,
                    'data': {
                        'original': content,
                        'publish_results': publish_results,
                        'total_time': f"{total_time:.1f} seconds",
                        'stream_session_id': session_id,
                        'system': 'official-agent-s2.5',
                        'agent_performance': self._calculate_performance_metrics(publish_results)
                    }
                })
                
            except Exception as e:
                logger.error(f"❌ Error in publish_content: {str(e)}")
                
                # Stop streaming on error
                if 'session_id' in locals():
                    self.video_streamer.stop_streaming(session_id)
                    self.socketio.emit('error_occurred', {
                        'session_id': session_id,
                        'error': str(e),
                        'message': 'Publishing failed - using fixed official Agent S2.5'
                    }, room=session_id)
                
                return jsonify({
                    'success': False,
                    'error': f'Publishing failed: {str(e)}'
                }), 500
        
        @self.app.route('/api/test-official-agent', methods=['POST'])
        def test_official_agent():
            """Test endpoint for official Agent S2.5 - single platform"""
            try:
                data = request.get_json()
                platform = data.get('platform', 'linkedin')
                content = data.get('content', 'Testing PostPrism with official Agent S2.5 patterns!')
                
                logger.info(f"🧪 Testing official Agent S2.5 for {platform}")
                
                session_id = str(uuid.uuid4())
                
                # Run single platform test with optimized manager
                result = asyncio.run(
                    self.optimized_agent_manager.publish_content_optimized(
                        platform=platform,
                        content=content,
                        hashtags=['testing', 'postprism', 'optimized'],
                        session_id=session_id,
                        socketio=self.socketio
                    )
                )
                
                return jsonify({
                    'success': result.success,
                    'platform': platform,
                    'result': {
                        'success': result.success,
                        'content': result.content,
                        'execution_time': result.execution_time,
                        'api_calls_made': result.api_calls_made,
                        'rate_limit_hits': result.rate_limit_hits,
                        'post_url': result.post_url,
                        'error_message': result.error_message,
                        'completion_reason': result.completion_reason
                    },
                    'session_id': session_id,
                    'system': 'optimized-agent-s2.5'
                })
                
            except Exception as e:
                logger.error(f"❌ Official Agent S2.5 test failed: {e}")
                return jsonify({
                    'success': False,
                    'error': str(e)
                }), 500
        
        @self.app.route('/api/test-parallel-execution', methods=['POST'])
        def test_parallel_execution():
            """
            NEW: Test endpoint for parallel multi-platform execution
            
            This endpoint tests the new parallel execution system with
            multiple platforms running simultaneously for maximum efficiency.
            """
            try:
                data = request.get_json()
                platforms = data.get('platforms', ['linkedin', 'twitter'])  # Default test with 2 platforms
                content = data.get('content', 'Testing PostPrism PARALLEL execution with Agent S2.5! 🚀⚡')
                
                # Validate platforms
                available_platforms = [p for p, pid in self.optimized_agent_manager.platform_projects.items() if pid]
                test_platforms = [p for p in platforms if p in available_platforms]
                
                if not test_platforms:
                    return jsonify({
                        'success': False,
                        'error': 'No configured platforms available for testing',
                        'available_platforms': available_platforms,
                        'requested_platforms': platforms
                    }), 400
                
                logger.info(f"🧪 Testing PARALLEL execution for platforms: {test_platforms}")
                
                session_id = str(uuid.uuid4())
                
                # Create adapted content for testing
                adapted_content = {}
                for platform in test_platforms:
                    adapted_content[platform] = {
                        'content': f"{content} (via {platform})",
                        'hashtags': ['PostPrismTest', 'ParallelExecution', 'AgentS25', f'{platform.title()}Test']
                    }
                
                # Start video streaming for test
                self.video_streamer.start_streaming(session_id)
                
                start_time = time.time()
                
                # Run parallel execution test
                results = asyncio.run(
                    self._execute_official_publishing(
                        adapted_content=adapted_content,
                        platforms=test_platforms,
                        session_id=session_id
                    )
                )
                
                total_time = time.time() - start_time
                
                # Stop streaming
                self.video_streamer.stop_streaming(session_id)
                
                return jsonify({
                    'success': results['overall_success'],
                    'test_type': 'parallel_execution',
                    'platforms_tested': test_platforms,
                    'results': results,
                    'total_test_time': f"{total_time:.1f}s",
                    'session_id': session_id,
                    'system': 'official-agent-s2.5-parallel',
                    'performance_summary': {
                        'successful_platforms': results['successful_platforms'],
                        'success_rate': results['success_rate'],
                        'parallel_execution_time': results.get('parallel_execution_time', 0),
                        'efficiency_improvement': results.get('efficiency_improvement', 'N/A')
                    }
                })
                
            except Exception as e:
                logger.error(f"❌ Parallel execution test failed: {e}")
                return jsonify({
                    'success': False,
                    'error': str(e),
                    'test_type': 'parallel_execution'
                }), 500
    
    async def _execute_official_publishing(
        self,
        adapted_content: Dict[str, Any],
        platforms: List[str],
        session_id: str
    ) -> Dict[str, Any]:
        """
        Execute publishing using official Agent S2.5 patterns - PARALLEL EXECUTION
        
        Key improvements:
        1. Parallel execution using asyncio.gather() for efficiency
        2. Proper WebSocket streaming for concurrent operations  
        3. Enhanced error handling for parallel scenarios
        4. Real-time progress tracking for multiple platforms
        
        Args:
            adapted_content: AI-adapted content for each platform
            platforms: List of platforms to publish to
            session_id: Session ID for WebSocket streaming
            
        Returns:
            Dict containing publish results for all platforms
        """
        logger.info(f"🚀 Starting PARALLEL official Agent S2.5 publishing for {len(platforms)} platforms")
        logger.info(f"📱 Platforms: {platforms}")
        
        # Emit standard publishing start event (frontend compatibility)
        self.socketio.emit('publish_started', {
            'session_id': session_id,
            'total_platforms': len(platforms),
            'platforms': platforms,
            'message': 'Starting parallel Agent S2.5 automation for maximum efficiency...',
            'system': 'official-agent-s2.5-parallel'
        }, room=session_id)
        
        # Also emit the new parallel event for enhanced clients
        self.socketio.emit('parallel_publishing_started', {
            'session_id': session_id,
            'total_platforms': len(platforms),
            'platforms': platforms,
            'message': 'Starting parallel Agent S2.5 automation for maximum efficiency...',
            'system': 'official-agent-s2.5-parallel'
        }, room=session_id)
        
        # Create tasks for parallel execution
        publishing_tasks = []
        
        for platform in platforms:
            platform_content = adapted_content.get(platform, {})
            content = platform_content.get('content', '')
            hashtags = platform_content.get('hashtags', [])
            
            # Create individual publishing task
            task = self._publish_single_platform_parallel(
                platform=platform,
                content=content,
                hashtags=hashtags,
                session_id=session_id
            )
            publishing_tasks.append(task)
            
            logger.info(f"📋 Created task for {platform}")
        
        # Execute all platforms in parallel
        logger.info(f"⚡ Executing {len(publishing_tasks)} platforms in parallel...")
        start_time = time.time()
        
        try:
            # Run all tasks concurrently with proper error handling
            platform_results = await asyncio.gather(*publishing_tasks, return_exceptions=True)
            
            parallel_execution_time = time.time() - start_time
            logger.info(f"⚡ Parallel execution completed in {parallel_execution_time:.1f}s")
            
        except Exception as e:
            logger.error(f"❌ Parallel execution failed: {e}")
            platform_results = [Exception(f"Parallel execution failed: {e}") for _ in platforms]
        
        # Process results from parallel execution 
        results = {}
        successful_platforms = 0
        
        for i, (platform, result) in enumerate(zip(platforms, platform_results)):
            try:
                if isinstance(result, Exception):
                    # Handle exceptions from parallel execution
                    logger.error(f"❌ {platform} failed with exception: {result}")
                    results[platform] = {
                        'success': False,
                        'error_message': str(result),
                        'system': 'official-agent-s2.5-parallel'
                    }
                else:
                    # Process successful result
                    results[platform] = {
                        'success': result.success,
                        'content': result.content,
                        'execution_time': result.execution_time,
                        'steps_taken': result.steps_taken,
                        'post_url': result.post_url,
                        'error_message': result.error_message,
                        'system': 'official-agent-s2.5-parallel'
                    }
                    
                    if result.success:
                        successful_platforms += 1
                
                # Emit individual platform completion
                self.socketio.emit('platform_completed', {
                    'session_id': session_id,
                    'platform': platform,
                    'success': results[platform]['success'],
                    'execution_time': results[platform].get('execution_time', 0),
                    'post_url': results[platform].get('post_url'),
                    'system': 'official-agent-s2.5-parallel'
                }, room=session_id)
                
                logger.info(f"{'✅' if results[platform]['success'] else '❌'} {platform} result processed")
                
            except Exception as e:
                logger.error(f"❌ Error processing {platform} result: {e}")
                results[platform] = {
                    'success': False,
                    'error_message': f"Result processing failed: {str(e)}",
                    'system': 'official-agent-s2.5-parallel'
                }
        
        # Calculate performance metrics
        success_rate = (successful_platforms / len(platforms)) * 100 if platforms else 0
        efficiency_improvement = self._calculate_efficiency_improvement(platforms, parallel_execution_time)
        
        logger.info(f"🎉 PARALLEL publishing completed: {successful_platforms}/{len(platforms)} platforms successful ({success_rate:.1f}%)")
        logger.info(f"⚡ Efficiency improvement: {efficiency_improvement}")
        
        # FIXED: Emit standard completion event with consistent data format
        self.socketio.emit('all_platforms_completed', {
            'session_id': session_id,
            'results': {'platforms': results},  # Consistent nested format
            'successful_platforms': successful_platforms,
            'total_platforms': len(platforms),
            'success_rate': success_rate,
            'total_time': f"{parallel_execution_time:.1f} seconds",  # Added for consistency
            'message': f'🎉 Enhanced parallel publishing completed: {successful_platforms}/{len(platforms)} platforms successful',
            'system': 'enhanced-agent-s2.5-parallel'
        }, room=session_id)
        
        # Also emit enhanced parallel completion event  
        self.socketio.emit('parallel_publishing_completed', {
            'session_id': session_id,
            'successful_platforms': successful_platforms,
            'total_platforms': len(platforms),
            'success_rate': success_rate,
            'parallel_execution_time': parallel_execution_time,
            'efficiency_improvement': efficiency_improvement,
            'system': 'official-agent-s2.5-parallel'
        }, room=session_id)
        
        return {
            'platforms': results,
            'overall_success': successful_platforms > 0,
            'success_rate': success_rate,
            'successful_platforms': successful_platforms,
            'total_platforms': len(platforms),
            'parallel_execution_time': parallel_execution_time,
            'efficiency_improvement': efficiency_improvement,
            'system': 'official-agent-s2.5-parallel'
        }
    
    async def _publish_single_platform_parallel(
        self,
        platform: str,
        content: str,
        hashtags: List[str],
        session_id: str
    ) -> Any:
        """
        Publish content to a single platform - designed for parallel execution
        
        This method wraps the official agent manager call with proper error handling
        and WebSocket notifications for parallel execution scenarios.
        
        Args:
            platform: Target platform (linkedin, twitter, instagram)
            content: Content to publish
            hashtags: List of hashtags
            session_id: Session ID for WebSocket streaming
            
        Returns:
            PublishResult: Result from official agent manager
        """
        try:
            logger.info(f"🚀 [PARALLEL] Starting {platform} publishing...")
            
            # Emit platform start for this specific platform
            self.socketio.emit('platform_started', {
                'session_id': session_id,
                'platform': platform,
                'content_preview': content[:100] + "..." if len(content) > 100 else content,
                'execution_mode': 'parallel',
                'system': 'official-agent-s2.5-parallel'
            }, room=session_id)
            
            # Use Optimized Agent S2.5 manager with efficient execution
            # Keep the same session_id for frontend compatibility - WebSocket events go to main room
            result = await self.optimized_agent_manager.publish_content_optimized(
                platform=platform,
                content=content,
                hashtags=hashtags,
                session_id=session_id,  # Use MAIN session_id for frontend compatibility
                socketio=self.socketio
            )
            
            logger.info(f"{'✅' if result.success else '❌'} [PARALLEL] {platform} completed: {result.success}")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ [PARALLEL] {platform} publishing failed: {e}")
            # Return a mock OptimizedPublishResult for consistency
            return OptimizedPublishResult(
                platform=platform,
                success=False,
                content=content,
                error_message=str(e),
                execution_time=0.0,
                api_calls_made=0,
                rate_limit_hits=0,
                completion_reason="exception_occurred"
            )
    
    def _calculate_efficiency_improvement(self, platforms: List[str], parallel_time: float) -> str:
        """
        Calculate efficiency improvement from parallel execution
        
        Args:
            platforms: List of platforms processed
            parallel_time: Time taken for parallel execution
            
        Returns:
            str: Human-readable efficiency improvement description
        """
        # Estimate sequential time (average 45-60 seconds per platform based on LinkedIn performance)
        estimated_sequential_time_per_platform = 52.5  # seconds (average)
        estimated_sequential_total = len(platforms) * estimated_sequential_time_per_platform
        
        if parallel_time > 0:
            time_saved = estimated_sequential_total - parallel_time
            efficiency_ratio = estimated_sequential_total / parallel_time
            
            if time_saved > 0:
                return f"{time_saved:.1f}s saved ({efficiency_ratio:.1f}x faster than sequential)"
            else:
                return f"Parallel execution completed in {parallel_time:.1f}s"
        else:
            return "Efficiency calculation unavailable"
    
    def _calculate_performance_metrics(self, publish_results: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate performance metrics from publish results"""
        platforms = publish_results.get('platforms', {})
        
        total_time = sum(
            platform.get('execution_time', 0) 
            for platform in platforms.values()
        )
        
        total_steps = sum(
            platform.get('steps_taken', 0) 
            for platform in platforms.values()
        )
        
        return {
            'total_execution_time': total_time,
            'total_steps_taken': total_steps,
            'average_steps_per_platform': total_steps / len(platforms) if platforms else 0,
            'average_time_per_platform': total_time / len(platforms) if platforms else 0,
            'system': 'official-agent-s2.5'
        }
    
    def _register_websocket_events(self) -> None:
        """Register WebSocket event handlers"""
        
        @self.socketio.on('connect')
        def handle_connect():
            """Handle new WebSocket connections with parallel execution support"""
            logger.info(f"🔌 New WebSocket connection: {request.sid}")
            
            # Check available platforms
            available_platforms = [
                p for p, pid in self.optimized_agent_manager.platform_projects.items() if pid
            ]
            
            emit('connected', {
                                    'message': 'Connected to PostPrism with Optimized Agent S2.5 execution (proven efficiency)',
                'timestamp': datetime.utcnow().isoformat(),
                'connection_id': request.sid,
                'version': '7.0.0-optimized',
                'system': 'optimized-agent-s2.5',
                'available_platforms': available_platforms,
                'features': [
                    'Optimized Agent S2.5 (based on official cli_app.py patterns)',
                    'Rate limiting mitigation with intelligent spacing',
                    'Precise completion detection',
                    'Smart publish detection and anti-perfectionism',
                    'True parallel execution with resource isolation',
                    'Optimized execution timing and performance'
                ],
                'performance_benefits': [
                    'Simple, natural Agent instructions for reliability',
                    'Rate limiting mitigation prevents API bottlenecks',
                    'Resource isolation enables true parallel platform execution',
                    'Optimized timing reduces execution delays',
                    'Smart completion detection prevents premature termination',
                    'Anti-perfectionism measures prevent endless editing cycles'
                ]
            })
        
        @self.socketio.on('disconnect')
        def handle_disconnect():
            """Handle WebSocket disconnections"""
            logger.info(f"🔌 WebSocket disconnected: {request.sid}")
        
        @self.socketio.on('join_stream')
        def handle_join_stream(data):
            """Handle client joining a streaming session with parallel execution support"""
            session_id = data.get('session_id')
            if session_id:
                join_room(session_id)
                logger.info(f"👥 Client {request.sid} joined PARALLEL stream session {session_id}")
                
                # Get current platform status
                available_platforms = [
                    p for p, pid in self.optimized_agent_manager.platform_projects.items() if pid
                ]
                
                emit('joined_stream', {
                    'session_id': session_id,
                    'message': f'Joined Optimized streaming session {session_id}',
                    'timestamp': datetime.utcnow().isoformat(),
                    'version': '7.0.0-optimized',
                    'system': 'optimized-agent-s2.5',
                    'available_platforms': available_platforms,
                    'capabilities': [
                        'Optimized Agent S2.5 execution (cli_app.py patterns)',
                        'PARALLEL multi-platform execution (efficient)',
                        'Real-time streaming with optimized updates',
                        'LinkedIn + Twitter + Instagram support',
                        'Rate limiting mitigation',
                        'Smart completion detection',
                        'Reliable WebSocket updates'
                    ],
                    'stream_features': [
                        'Natural Agent S2.5 decision making',
                        'Real-time screenshot streaming',
                        'Parallel platform progress tracking',
                        'Performance metrics and API call tracking',
                        'Optimized execution timing',
                        'Smart error detection and recovery'
                    ]
                })
            else:
                emit('error', {'message': 'session_id is required to join stream'})
        
        @self.socketio.on('leave_stream')
        def handle_leave_stream(data):
            """Handle client leaving a streaming session"""
            session_id = data.get('session_id')
            if session_id:
                leave_room(session_id)
                logger.info(f"👋 Client {request.sid} left stream session {session_id}")
                emit('left_stream', {
                    'session_id': session_id,
                    'message': f'Left streaming session {session_id}'
                })
    
    def run(self, host: Optional[str] = None, port: Optional[int] = None, debug: Optional[bool] = None):
        """Run the fixed PostPrism backend application"""
        host = host or settings.flask.host
        port = port or settings.flask.port
        debug = debug if debug is not None else settings.flask.debug
        
        # Check platform availability for startup log
        available_platforms = [
            p for p, pid in self.optimized_agent_manager.platform_projects.items() if pid
        ]
        
        logger.info(f"🚀 Starting PostPrism OPTIMIZED backend v7.0.0 on {host}:{port} (debug={debug})")
        logger.info("🎉 OPTIMIZED: EFFICIENT AGENT S2.5 - Proven, Simple, Reliable")
        logger.info("Optimized system - based on official cli_app.py patterns:")
        logger.info(f"  ✅ Optimized Agent S2.5 (following official patterns exactly)")
        logger.info(f"  ✅ Rate limiting mitigation with intelligent spacing")
        logger.info(f"  ✅ Precise completion detection")
        logger.info(f"  ✅ Smart publish detection and anti-perfectionism")
        logger.info(f"  ✅ True parallel execution with resource isolation")
        logger.info(f"  ✅ Simple, natural instructions (trust Agent intelligence)")
        logger.info(f"  ✅ Optimized timing and performance")
        logger.info(f"📱 Available platforms: {available_platforms}")
        logger.info(f"⚡ Performance: Optimized = Simple + Efficient + Reliable")
        logger.info(f"🧠 Intelligence: Natural Agent S2.5 decision making")
        logger.info(f"📡 Streaming: Real-time progress with optimized WebSocket events")
        
        # Disable reloading for stable parallel execution
        self.socketio.run(
            self.app,
            host=host,
            port=port,
            debug=False,  # FIXED: Disable debug to prevent hot reloading interruption
            use_reloader=False,  # FIXED: Explicitly disable reloader
            allow_unsafe_werkzeug=True
        )

# Create global app instance
postprism_app_fixed = PostPrismApp()

# For direct script execution
if __name__ == '__main__':
    try:
        postprism_app_fixed.run()
    except KeyboardInterrupt:
        logger.info("👋 Fixed PostPrism backend shutdown requested")
    except Exception as e:
        logger.error(f"❌ Fixed PostPrism backend startup failed: {str(e)}")
        raise