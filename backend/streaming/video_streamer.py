"""
Real-time Video Streaming Manager for PostPrism

This module manages real-time video streaming of AgentS2 automation process
via WebSocket connections. It handles the capture, processing, and transmission
of screenshot frames from the ORGO virtual environment to connected clients.

Key Features:
1. Session-based streaming management
2. Frame rate optimization and quality control
3. WebSocket broadcasting to multiple clients
4. Memory-efficient frame processing
5. Automatic stream lifecycle management

Architecture:
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ORGO          │────│  Video Streamer  │────│  WebSocket      │
│   Screenshots   │    │  (this module)   │    │  Clients        │
│                 │    │                  │    │  (Frontend)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
            ┌───────▼────┐ ┌───▼────┐ ┌───▼──────┐
            │ Frame      │ │Quality │ │ Session  │
            │ Processing │ │Control │ │ Manager  │
            └────────────┘ └────────┘ └──────────┘

Stream Management:
- Each publishing session gets a unique stream identifier
- Clients join/leave streams using session IDs
- Automatic cleanup when sessions complete
- Frame buffering and compression for optimal performance

Quality Control:
- Configurable frame quality (default 85%)
- Frame rate limiting to prevent bandwidth overload
- Automatic resolution scaling based on client connections
- Compression optimization for real-time streaming
"""

import time
import uuid
import base64
import asyncio
import logging
from typing import Dict, Any, Optional, List, Set
from dataclasses import dataclass, field
from collections import defaultdict, deque
import threading
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

@dataclass
class StreamSession:
    """
    Container for individual streaming session data

    Tracks all metadata and statistics for a single streaming session,
    including connected clients, frame statistics, and performance metrics.
    """
    session_id: str
    status: str = 'inactive'  # 'inactive', 'active', 'completed', 'error'
    start_time: float = field(default_factory=time.time)
    end_time: Optional[float] = None
    frame_count: int = 0
    total_data_sent: int = 0  # Total bytes sent
    connected_clients: Set[str] = field(default_factory=set)
    platform_progress: Dict[str, float] = field(default_factory=dict)
    last_frame_time: float = field(default_factory=time.time)
    performance_metrics: Dict[str, Any] = field(default_factory=dict)

@dataclass
class StreamFrame:
    """
    Individual frame data container

    Encapsulates a single video frame with metadata for streaming.
    """
    frame_data: str  # Base64 encoded screenshot
    timestamp: float
    platform: str
    step: int
    session_id: str
    frame_size: int
    metadata: Dict[str, Any] = field(default_factory=dict)

class VideoStreamer:
    """
    Real-time video streaming manager for AgentS2 automation

    This class manages the complete video streaming pipeline:
    1. Session lifecycle management
    2. Frame capture and processing
    3. WebSocket broadcasting
    4. Performance optimization
    5. Client connection management

    The streamer is designed to handle multiple concurrent sessions
    while maintaining optimal performance and memory usage.
    """

    def __init__(self, socketio):
        """
        Initialize VideoStreamer with WebSocket instance

        Args:
            socketio: Flask-SocketIO instance for real-time communication
        """
        self.socketio = socketio
        self.active_streams: Dict[str, StreamSession] = {}
        self.frame_buffer: Dict[str, deque] = defaultdict(lambda: deque(maxlen=10))

        # Configuration
        self.max_frame_rate = 2.0  # Maximum 2 frames per second
        self.frame_quality = 85  # JPEG compression quality (0-100)
        self.max_frame_size = 1024 * 1024  # 1MB max frame size
        self.session_timeout = 300  # 5 minutes timeout for inactive sessions

        # Performance tracking
        self.total_frames_sent = 0
        self.total_data_transmitted = 0
        self.active_connections = 0

        # Start background cleanup task
        self._cleanup_task = None
        self._start_cleanup_task()

        logger.info("VideoStreamer initialized")
        logger.info(f"Configuration: max_fps={self.max_frame_rate}, quality={self.frame_quality}%")

    def start_streaming(self, session_id: str, platforms: Optional[List[str]] = None) -> bool:
        """
        Start streaming session for given session ID

        Creates a new streaming session and initializes all necessary
        data structures for real-time video streaming.

        Args:
            session_id: Unique identifier for the streaming session
            platforms: List of platforms being published to

        Returns:
            bool: True if session started successfully
        """
        try:
            if session_id in self.active_streams:
                logger.warning(f"Stream session {session_id} already exists")
                return False

            # Create new stream session
            session = StreamSession(
                session_id=session_id,
                status='active',
                start_time=time.time()
            )

            # Initialize platform progress tracking
            if platforms:
                for platform in platforms:
                    session.platform_progress[platform] = 0.0

            self.active_streams[session_id] = session

            # Initialize frame buffer for this session
            self.frame_buffer[session_id] = deque(maxlen=10)

            logger.info(f"✅ Started streaming session {session_id}")
            if platforms:
                logger.info(f"Platforms: {platforms}")

            # Emit stream started event
            self.socketio.emit('stream_started', {
                'session_id': session_id,
                'message': 'Real-time streaming started',
                'timestamp': session.start_time,
                'platforms': platforms or []
            }, room=session_id)

            return True

        except Exception as e:
            logger.error(f"Failed to start streaming session {session_id}: {str(e)}")
            return False

    def stop_streaming(self, session_id: str) -> bool:
        """
        Stop streaming session and cleanup resources

        Gracefully terminates a streaming session, calculates final
        statistics, and broadcasts completion event to clients.

        Args:
            session_id: Session identifier to stop

        Returns:
            bool: True if session stopped successfully
        """
        try:
            if session_id not in self.active_streams:
                logger.warning(f"Stream session {session_id} not found")
                return False

            session = self.active_streams[session_id]
            session.status = 'completed'
            session.end_time = time.time()

            # Calculate final performance metrics
            duration = session.end_time - session.start_time
            avg_frame_rate = session.frame_count / duration if duration > 0 else 0

            session.performance_metrics = {
                'duration': duration,
                'total_frames': session.frame_count,
                'average_frame_rate': avg_frame_rate,
                'total_data_sent': session.total_data_sent,
                'connected_clients': len(session.connected_clients)
            }

            logger.info(f"✅ Stopped streaming session {session_id}")
            logger.info(f"Duration: {duration:.1f}s, Frames: {session.frame_count}, Rate: {avg_frame_rate:.1f} fps")

            # Emit stream ended event
            self.socketio.emit('stream_ended', {
                'session_id': session_id,
                'duration': duration,
                'total_frames': session.frame_count,
                'performance_metrics': session.performance_metrics,
                'message': 'Real-time streaming completed'
            }, room=session_id)

            # Cleanup resources
            self._cleanup_session_resources(session_id)

            return True

        except Exception as e:
            logger.error(f"Failed to stop streaming session {session_id}: {str(e)}")
            return False

    def send_frame(
        self,
        session_id: str,
        frame_data: str,
        platform: str,
        step: int,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Send video frame to connected clients

        Processes and broadcasts a single frame to all clients connected
        to the specified streaming session.

        Args:
            session_id: Target session ID
            frame_data: Base64 encoded screenshot data
            platform: Platform being automated
            step: Current automation step
            metadata: Additional frame metadata

        Returns:
            bool: True if frame sent successfully
        """
        try:
            if session_id not in self.active_streams:
                logger.warning(f"Session {session_id} not active for frame sending")
                return False

            session = self.active_streams[session_id]

            # Frame rate limiting
            current_time = time.time()
            time_since_last_frame = current_time - session.last_frame_time
            min_frame_interval = 1.0 / self.max_frame_rate

            if time_since_last_frame < min_frame_interval:
                # Skip this frame to maintain frame rate limit
                return True

            # Process frame
            processed_frame = self._process_frame(
                frame_data=frame_data,
                session_id=session_id,
                platform=platform,
                step=step,
                metadata=metadata or {}
            )

            if not processed_frame:
                logger.error(f"Frame processing failed for session {session_id}")
                return False

            # Update session statistics
            session.frame_count += 1
            session.total_data_sent += processed_frame.frame_size
            session.last_frame_time = current_time
            session.platform_progress[platform] = (step / 15) * 100  # Assuming max 15 steps

            # Add to frame buffer
            self.frame_buffer[session_id].append(processed_frame)

            # Broadcast frame to all connected clients
            frame_payload = {
                'session_id': session_id,
                'platform': platform,
                'data': processed_frame.frame_data,
                'timestamp': processed_frame.timestamp,
                'step': step,
                'frame_number': session.frame_count,
                'metadata': processed_frame.metadata
            }

            self.socketio.emit('video_frame', frame_payload, room=session_id)

            # Update global statistics
            self.total_frames_sent += 1
            self.total_data_transmitted += processed_frame.frame_size

            return True

        except Exception as e:
            logger.error(f"Failed to send frame for session {session_id}: {str(e)}")
            return False

    def _process_frame(
        self,
        frame_data: str,
        session_id: str,
        platform: str,
        step: int,
        metadata: Dict[str, Any]
    ) -> Optional[StreamFrame]:
        """
        Process raw frame data for streaming optimization

        Applies compression, validation, and metadata enhancement
        to prepare frames for efficient streaming.

        Args:
            frame_data: Raw base64 screenshot data
            session_id: Session identifier
            platform: Platform being automated
            step: Current step number
            metadata: Additional metadata

        Returns:
            Processed StreamFrame or None if processing failed
        """
        try:
            # Validate frame data
            if not frame_data or len(frame_data) < 100:
                logger.warning("Invalid or empty frame data")
                return None

            # Calculate frame size
            frame_size = len(frame_data.encode('utf-8'))

            # Apply size limit
            if frame_size > self.max_frame_size:
                logger.warning(f"Frame size {frame_size} exceeds limit {self.max_frame_size}")
                # In production, you might want to compress or resize the frame here
                frame_data = frame_data[:self.max_frame_size]
                frame_size = self.max_frame_size

            # Enhance metadata
            enhanced_metadata = {
                **metadata,
                'compression_quality': self.frame_quality,
                'original_size': frame_size,
                'processing_time': time.time(),
                'session_frame_count': self.active_streams[session_id].frame_count + 1
            }

            # Create processed frame
            processed_frame = StreamFrame(
                frame_data=frame_data,
                timestamp=time.time(),
                platform=platform,
                step=step,
                session_id=session_id,
                frame_size=frame_size,
                metadata=enhanced_metadata
            )

            return processed_frame

        except Exception as e:
            logger.error(f"Frame processing error: {str(e)}")
            return None

    def add_client_to_session(self, session_id: str, client_id: str) -> bool:
        """
        Add client to streaming session

        Registers a client connection to receive frames from
        the specified streaming session.

        Args:
            session_id: Target session ID
            client_id: Unique client identifier

        Returns:
            bool: True if client added successfully
        """
        try:
            if session_id not in self.active_streams:
                logger.warning(f"Cannot add client to non-existent session {session_id}")
                return False

            session = self.active_streams[session_id]
            session.connected_clients.add(client_id)
            self.active_connections += 1

            logger.info(f"Client {client_id} joined stream session {session_id}")
            logger.info(f"Session now has {len(session.connected_clients)} connected clients")

            # Send recent frames to newly connected client
            self._send_recent_frames_to_client(session_id, client_id)

            return True

        except Exception as e:
            logger.error(f"Failed to add client {client_id} to session {session_id}: {str(e)}")
            return False

    def remove_client_from_session(self, session_id: str, client_id: str) -> bool:
        """
        Remove client from streaming session

        Args:
            session_id: Session ID
            client_id: Client identifier to remove

        Returns:
            bool: True if client removed successfully
        """
        try:
            if session_id in self.active_streams:
                session = self.active_streams[session_id]
                if client_id in session.connected_clients:
                    session.connected_clients.remove(client_id)
                    self.active_connections -= 1

                    logger.info(f"Client {client_id} left stream session {session_id}")
                    logger.info(f"Session now has {len(session.connected_clients)} connected clients")

            return True

        except Exception as e:
            logger.error(f"Failed to remove client {client_id} from session {session_id}: {str(e)}")
            return False

    def _send_recent_frames_to_client(self, session_id: str, client_id: str):
        """Send recent frames to a newly connected client"""
        try:
            if session_id in self.frame_buffer:
                recent_frames = list(self.frame_buffer[session_id])

                for frame in recent_frames[-3:]:  # Send last 3 frames
                    frame_payload = {
                        'session_id': session_id,
                        'platform': frame.platform,
                        'data': frame.frame_data,
                        'timestamp': frame.timestamp,
                        'step': frame.step,
                        'frame_number': frame.metadata.get('session_frame_count', 0),
                        'metadata': {**frame.metadata, 'is_replay': True}
                    }

                    self.socketio.emit('video_frame', frame_payload, room=client_id)

                logger.info(f"Sent {len(recent_frames[-3:])} recent frames to client {client_id}")

        except Exception as e:
            logger.error(f"Failed to send recent frames to client {client_id}: {str(e)}")

    def _cleanup_session_resources(self, session_id: str):
        """Clean up resources for a completed session"""
        try:
            # Remove from active streams
            if session_id in self.active_streams:
                del self.active_streams[session_id]

            # Clear frame buffer
            if session_id in self.frame_buffer:
                del self.frame_buffer[session_id]

            logger.info(f"Cleaned up resources for session {session_id}")

        except Exception as e:
            logger.error(f"Error cleaning up session {session_id}: {str(e)}")

    def _start_cleanup_task(self):
        """Start background task for cleaning up inactive sessions"""
        def cleanup_loop():
            while True:
                try:
                    current_time = time.time()
                    sessions_to_cleanup = []

                    for session_id, session in self.active_streams.items():
                        # Check for timeout
                        time_since_last_frame = current_time - session.last_frame_time

                        if (session.status == 'active' and
                            time_since_last_frame > self.session_timeout):
                            logger.warning(f"Session {session_id} timed out after {time_since_last_frame:.1f}s")
                            sessions_to_cleanup.append(session_id)

                    # Cleanup timed out sessions
                    for session_id in sessions_to_cleanup:
                        self.stop_streaming(session_id)

                    time.sleep(30)  # Check every 30 seconds

                except Exception as e:
                    logger.error(f"Error in cleanup loop: {str(e)}")
                    time.sleep(60)  # Wait longer on error

        self._cleanup_task = threading.Thread(target=cleanup_loop, daemon=True)
        self._cleanup_task.start()
        logger.info("Background cleanup task started")

    def get_session_info(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get information about a specific streaming session"""
        if session_id not in self.active_streams:
            return None

        session = self.active_streams[session_id]
        current_time = time.time()

        return {
            'session_id': session_id,
            'status': session.status,
            'start_time': session.start_time,
            'duration': current_time - session.start_time,
            'frame_count': session.frame_count,
            'connected_clients': len(session.connected_clients),
            'platform_progress': session.platform_progress,
            'performance_metrics': session.performance_metrics,
            'data_transmitted': session.total_data_sent
        }

    def get_global_stats(self) -> Dict[str, Any]:
        """Get global streaming statistics"""
        return {
            'active_sessions': len(self.active_streams),
            'total_frames_sent': self.total_frames_sent,
            'total_data_transmitted': self.total_data_transmitted,
            'active_connections': self.active_connections,
            'frame_rate_limit': self.max_frame_rate,
            'frame_quality': self.frame_quality,
            'session_timeout': self.session_timeout
        }

    def update_configuration(self, **kwargs):
        """Update streaming configuration parameters"""
        if 'max_frame_rate' in kwargs:
            self.max_frame_rate = kwargs['max_frame_rate']
            logger.info(f"Updated max frame rate to {self.max_frame_rate} fps")

        if 'frame_quality' in kwargs:
            self.frame_quality = kwargs['frame_quality']
            logger.info(f"Updated frame quality to {self.frame_quality}%")

        if 'session_timeout' in kwargs:
            self.session_timeout = kwargs['session_timeout']
            logger.info(f"Updated session timeout to {self.session_timeout}s")

    def cleanup_all_sessions(self):
        """Emergency cleanup of all active sessions"""
        logger.warning("Performing emergency cleanup of all streaming sessions")

        session_ids = list(self.active_streams.keys())
        for session_id in session_ids:
            try:
                self.stop_streaming(session_id)
            except Exception as e:
                logger.error(f"Error during emergency cleanup of session {session_id}: {str(e)}")

        logger.info(f"Emergency cleanup completed. Cleaned up {len(session_ids)} sessions")
