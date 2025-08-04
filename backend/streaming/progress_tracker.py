"""
Progress Tracking System for PostPrism Publishing

This module provides comprehensive progress tracking for multi-platform
publishing operations. It tracks individual platform progress, overall
session progress, and provides real-time updates via WebSocket.

Key Features:
1. Platform-specific progress tracking
2. Overall session progress calculation
3. Real-time progress updates
4. Performance metrics collection
5. Error tracking and reporting
6. Time estimation and ETA calculation

Architecture:
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Publishing    │────│  Progress        │────│  WebSocket      │
│   Operations    │    │  Tracker         │    │  Updates        │
│                 │    │  (this module)   │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
            ┌───────▼────┐ ┌───▼────┐ ┌───▼──────┐
            │ Platform   │ │ Session│ │ Time     │
            │ Progress   │ │Progress│ │Estimation│
            └────────────┘ └────────┘ └──────────┘

Progress Calculation:
- Each platform operation is tracked through defined stages
- Overall progress is weighted average of all platform progress
- ETA calculated based on historical performance data
- Error tracking affects progress calculation and reporting
"""

import time
import uuid
import logging
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
from collections import defaultdict, deque
import threading
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class PlatformStatus(Enum):
    """Status enumeration for platform publishing operations"""
    PENDING = "pending"
    STARTING = "starting"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    TIMEOUT = "timeout"
    RETRYING = "retrying"

class ProgressStage(Enum):
    """Stages of the publishing process for detailed progress tracking"""
    INITIALIZATION = "initialization"
    BROWSER_OPENING = "browser_opening"
    NAVIGATION = "navigation"
    LOGIN_CHECK = "login_check"
    COMPOSE_INTERFACE = "compose_interface"
    CONTENT_INPUT = "content_input"
    HASHTAG_ADDITION = "hashtag_addition"
    MEDIA_UPLOAD = "media_upload"
    FINAL_REVIEW = "final_review"
    PUBLISHING = "publishing"
    CONFIRMATION = "confirmation"
    COMPLETED = "completed"

@dataclass
class PlatformProgress:
    """
    Progress tracking data for individual platform
    
    Tracks detailed progress information for a single platform
    publishing operation, including current stage, completion
    percentage, timing data, and error information.
    """
    platform: str
    status: PlatformStatus = PlatformStatus.PENDING
    current_stage: ProgressStage = ProgressStage.INITIALIZATION
    completion_percentage: float = 0.0
    start_time: Optional[float] = None
    end_time: Optional[float] = None
    steps_completed: int = 0
    total_steps: int = 12  # Based on ProgressStage enum
    error_count: int = 0
    error_messages: List[str] = field(default_factory=list)
    stage_timings: Dict[str, float] = field(default_factory=dict)
    estimated_completion_time: Optional[float] = None

@dataclass
class SessionProgress:
    """
    Overall session progress tracking
    
    Aggregates progress from all platforms in a publishing session
    and provides overall metrics and estimates.
    """
    session_id: str
    platforms: List[str]
    start_time: float
    end_time: Optional[float] = None
    overall_percentage: float = 0.0
    platform_progress: Dict[str, PlatformProgress] = field(default_factory=dict)
    total_platforms: int = 0
    completed_platforms: int = 0
    failed_platforms: int = 0
    estimated_total_time: Optional[float] = None
    actual_total_time: Optional[float] = None

class ProgressTracker:
    """
    Comprehensive progress tracking system for publishing operations
    
    This class manages progress tracking across multiple platforms and sessions:
    1. Tracks individual platform progress through defined stages
    2. Calculates overall session progress
    3. Provides time estimates based on historical data
    4. Handles error tracking and reporting
    5. Emits real-time progress updates via WebSocket
    
    The tracker uses historical performance data to improve time estimates
    and provides detailed stage-by-stage progress information.
    """
    
    def __init__(self):
        """Initialize the progress tracking system"""
        self.active_sessions: Dict[str, SessionProgress] = {}
        self.historical_data: Dict[str, deque] = defaultdict(lambda: deque(maxlen=50))
        
        # Stage weight mappings for progress calculation
        self.stage_weights = {
            ProgressStage.INITIALIZATION: 5,
            ProgressStage.BROWSER_OPENING: 8,
            ProgressStage.NAVIGATION: 10,
            ProgressStage.LOGIN_CHECK: 5,
            ProgressStage.COMPOSE_INTERFACE: 12,
            ProgressStage.CONTENT_INPUT: 15,
            ProgressStage.HASHTAG_ADDITION: 8,
            ProgressStage.MEDIA_UPLOAD: 10,
            ProgressStage.FINAL_REVIEW: 7,
            ProgressStage.PUBLISHING: 15,
            ProgressStage.CONFIRMATION: 5,
            ProgressStage.COMPLETED: 0
        }
        
        # Average time per stage (in seconds) based on historical data
        self.average_stage_times = {
            ProgressStage.INITIALIZATION: 2.0,
            ProgressStage.BROWSER_OPENING: 3.0,
            ProgressStage.NAVIGATION: 4.0,
            ProgressStage.LOGIN_CHECK: 2.0,
            ProgressStage.COMPOSE_INTERFACE: 5.0,
            ProgressStage.CONTENT_INPUT: 8.0,
            ProgressStage.HASHTAG_ADDITION: 3.0,
            ProgressStage.MEDIA_UPLOAD: 6.0,
            ProgressStage.FINAL_REVIEW: 3.0,
            ProgressStage.PUBLISHING: 4.0,
            ProgressStage.CONFIRMATION: 2.0,
            ProgressStage.COMPLETED: 0.0
        }
        
        # Platform-specific time multipliers
        self.platform_multipliers = {
            'linkedin': 1.0,      # Baseline
            'twitter': 0.8,       # Faster due to simpler interface
            'instagram': 1.3      # Slower due to visual-first interface
        }
        
        logger.info("ProgressTracker initialized with historical performance data")
    
    def initialize_session(self, session_id: str, platforms: List[str]) -> bool:
        """
        Initialize progress tracking for a new publishing session
        
        Args:
            session_id: Unique session identifier
            platforms: List of platforms to be published to
        
        Returns:
            bool: True if session initialized successfully
        """
        try:
            if session_id in self.active_sessions:
                logger.warning(f"Session {session_id} already exists")
                return False
            
            # Create session progress object
            session = SessionProgress(
                session_id=session_id,
                platforms=platforms,
                start_time=time.time(),
                total_platforms=len(platforms)
            )
            
            # Initialize platform progress for each platform
            for platform in platforms:
                platform_progress = PlatformProgress(
                    platform=platform,
                    total_steps=len(ProgressStage)
                )
                session.platform_progress[platform] = platform_progress
            
            # Calculate estimated total time
            session.estimated_total_time = self._calculate_estimated_session_time(platforms)
            
            self.active_sessions[session_id] = session
            
            logger.info(f"✅ Initialized progress tracking for session {session_id}")
            logger.info(f"Platforms: {platforms}")
            logger.info(f"Estimated total time: {session.estimated_total_time:.1f}s")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize session {session_id}: {str(e)}")
            return False
    
    def start_platform(self, session_id: str, platform: str) -> bool:
        """
        Mark platform as started and update progress
        
        Args:
            session_id: Session identifier
            platform: Platform name
        
        Returns:
            bool: True if platform started successfully
        """
        try:
            if session_id not in self.active_sessions:
                logger.error(f"Session {session_id} not found")
                return False
            
            session = self.active_sessions[session_id]
            if platform not in session.platform_progress:
                logger.error(f"Platform {platform} not found in session {session_id}")
                return False
            
            platform_progress = session.platform_progress[platform]
            platform_progress.status = PlatformStatus.STARTING
            platform_progress.start_time = time.time()
            platform_progress.current_stage = ProgressStage.INITIALIZATION
            
            # Calculate estimated completion time for this platform
            platform_progress.estimated_completion_time = self._calculate_platform_estimated_time(platform)
            
            logger.info(f"🚀 Started {platform} publishing for session {session_id}")
            logger.info(f"Estimated platform time: {platform_progress.estimated_completion_time:.1f}s")
            
            # Update overall session progress
            self._update_session_progress(session_id)
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to start platform {platform} for session {session_id}: {str(e)}")
            return False
    
    def update_platform_progress(
        self,
        session_id: str,
        platform: str,
        steps_completed: int,
        total_steps: Optional[int] = None,
        current_stage: Optional[ProgressStage] = None
    ) -> bool:
        """
        Update platform progress with current step information
        
        Args:
            session_id: Session identifier
            platform: Platform name
            steps_completed: Number of steps completed
            total_steps: Total number of steps (optional)
            current_stage: Current progress stage (optional)
        
        Returns:
            bool: True if progress updated successfully
        """
        try:
            if session_id not in self.active_sessions:
                return False
            
            session = self.active_sessions[session_id]
            if platform not in session.platform_progress:
                return False
            
            platform_progress = session.platform_progress[platform]
            
            # Update step information
            platform_progress.steps_completed = steps_completed
            if total_steps:
                platform_progress.total_steps = total_steps
            
            # Update current stage if provided
            if current_stage:
                old_stage = platform_progress.current_stage
                platform_progress.current_stage = current_stage
                platform_progress.stage_timings[old_stage.value] = time.time()
            
            # Calculate completion percentage
            platform_progress.completion_percentage = self._calculate_platform_percentage(platform_progress)
            
            # Update status
            if platform_progress.completion_percentage >= 100.0:
                platform_progress.status = PlatformStatus.COMPLETED
            elif platform_progress.completion_percentage > 0:
                platform_progress.status = PlatformStatus.IN_PROGRESS
            
            # Update session overall progress
            self._update_session_progress(session_id)
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to update progress for {platform} in session {session_id}: {str(e)}")
            return False
    
    def update_platform_stage(
        self,
        session_id: str,
        platform: str,
        stage: ProgressStage,
        stage_info: Optional[str] = None
    ) -> bool:
        """
        Update platform to a specific progress stage
        
        Args:
            session_id: Session identifier
            platform: Platform name
            stage: Progress stage to update to
            stage_info: Additional information about the stage
        
        Returns:
            bool: True if stage updated successfully
        """
        try:
            if session_id not in self.active_sessions:
                return False
            
            session = self.active_sessions[session_id]
            if platform not in session.platform_progress:
                return False
            
            platform_progress = session.platform_progress[platform]
            
            # Record timing for previous stage
            if platform_progress.current_stage != stage:
                current_time = time.time()
                platform_progress.stage_timings[platform_progress.current_stage.value] = current_time
            
            # Update to new stage
            platform_progress.current_stage = stage
            platform_progress.completion_percentage = self._calculate_platform_percentage(platform_progress)
            
            # Update status based on stage
            if stage == ProgressStage.COMPLETED:
                platform_progress.status = PlatformStatus.COMPLETED
                platform_progress.end_time = time.time()
            elif stage == ProgressStage.INITIALIZATION:
                platform_progress.status = PlatformStatus.STARTING
            else:
                platform_progress.status = PlatformStatus.IN_PROGRESS
            
            logger.info(f"📊 {platform} progress: {stage.value} ({platform_progress.completion_percentage:.1f}%)")
            if stage_info:
                logger.info(f"Stage info: {stage_info}")
            
            # Update session progress
            self._update_session_progress(session_id)
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to update stage for {platform} in session {session_id}: {str(e)}")
            return False
    
    def complete_platform(self, session_id: str, platform: str, success: bool) -> bool:
        """
        Mark platform as completed (successfully or with failure)
        
        Args:
            session_id: Session identifier
            platform: Platform name
            success: Whether the platform completed successfully
        
        Returns:
            bool: True if platform marked as completed
        """
        try:
            if session_id not in self.active_sessions:
                return False
            
            session = self.active_sessions[session_id]
            if platform not in session.platform_progress:
                return False
            
            platform_progress = session.platform_progress[platform]
            platform_progress.end_time = time.time()
            platform_progress.completion_percentage = 100.0
            platform_progress.current_stage = ProgressStage.COMPLETED
            
            if success:
                platform_progress.status = PlatformStatus.COMPLETED
                session.completed_platforms += 1
                logger.info(f"✅ {platform} completed successfully")
            else:
                platform_progress.status = PlatformStatus.FAILED
                session.failed_platforms += 1
                logger.info(f"❌ {platform} failed")
            
            # Record performance data for future estimates
            if platform_progress.start_time:
                execution_time = platform_progress.end_time - platform_progress.start_time
                self.historical_data[platform].append(execution_time)
                logger.info(f"📈 {platform} execution time: {execution_time:.1f}s")
            
            # Update session progress
            self._update_session_progress(session_id)
            
            # Check if session is complete
            total_completed = session.completed_platforms + session.failed_platforms
            if total_completed >= session.total_platforms:
                self._complete_session(session_id)
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to complete platform {platform} for session {session_id}: {str(e)}")
            return False
    
    def add_platform_error(self, session_id: str, platform: str, error_message: str) -> bool:
        """
        Add error information to platform progress
        
        Args:
            session_id: Session identifier
            platform: Platform name
            error_message: Error description
        
        Returns:
            bool: True if error added successfully
        """
        try:
            if session_id not in self.active_sessions:
                return False
            
            session = self.active_sessions[session_id]
            if platform not in session.platform_progress:
                return False
            
            platform_progress = session.platform_progress[platform]
            platform_progress.error_count += 1
            platform_progress.error_messages.append(error_message)
            
            logger.warning(f"⚠️ {platform} error #{platform_progress.error_count}: {error_message}")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to add error for {platform} in session {session_id}: {str(e)}")
            return False
    
    def _calculate_platform_percentage(self, platform_progress: PlatformProgress) -> float:
        """Calculate completion percentage for a platform based on current stage"""
        try:
            # Get cumulative weight up to current stage
            total_weight = sum(self.stage_weights.values())
            completed_weight = 0
            
            for stage in ProgressStage:
                if stage.value == platform_progress.current_stage.value:
                    break
                completed_weight += self.stage_weights[stage]
            
            # Add partial weight for current stage based on steps
            if platform_progress.total_steps > 0:
                current_stage_weight = self.stage_weights[platform_progress.current_stage]
                stage_progress = platform_progress.steps_completed / platform_progress.total_steps
                completed_weight += current_stage_weight * stage_progress
            
            percentage = (completed_weight / total_weight) * 100
            return min(100.0, max(0.0, percentage))
            
        except Exception as e:
            logger.error(f"Error calculating platform percentage: {str(e)}")
            return 0.0
    
    def _update_session_progress(self, session_id: str):
        """Update overall session progress based on platform progress"""
        try:
            session = self.active_sessions[session_id]
            
            # Calculate weighted average of platform progress
            total_progress = 0.0
            for platform_progress in session.platform_progress.values():
                total_progress += platform_progress.completion_percentage
            
            if session.total_platforms > 0:
                session.overall_percentage = total_progress / session.total_platforms
            
            # Update estimated completion time
            if session.overall_percentage > 0:
                elapsed_time = time.time() - session.start_time
                estimated_total = elapsed_time / (session.overall_percentage / 100)
                session.estimated_total_time = estimated_total
            
        except Exception as e:
            logger.error(f"Error updating session progress for {session_id}: {str(e)}")
    
    def _calculate_estimated_session_time(self, platforms: List[str]) -> float:
        """Calculate estimated total time for session based on platforms"""
        total_time = 0.0
        
        for platform in platforms:
            platform_time = self._calculate_platform_estimated_time(platform)
            total_time += platform_time
        
        # Add buffer time for session overhead
        total_time += 10.0  # 10 seconds overhead
        
        return total_time
    
    def _calculate_platform_estimated_time(self, platform: str) -> float:
        """Calculate estimated time for individual platform"""
        # Base time from average stage times
        base_time = sum(self.average_stage_times.values())
        
        # Apply platform multiplier
        multiplier = self.platform_multipliers.get(platform, 1.0)
        estimated_time = base_time * multiplier
        
        # Adjust based on historical data if available
        if platform in self.historical_data and self.historical_data[platform]:
            historical_avg = sum(self.historical_data[platform]) / len(self.historical_data[platform])
            # Weight historical data more heavily
            estimated_time = (estimated_time * 0.3) + (historical_avg * 0.7)
        
        return estimated_time
    
    def _complete_session(self, session_id: str):
        """Mark session as completed and calculate final metrics"""
        try:
            session = self.active_sessions[session_id]
            session.end_time = time.time()
            session.actual_total_time = session.end_time - session.start_time
            session.overall_percentage = 100.0
            
            logger.info(f"🎉 Session {session_id} completed")
            logger.info(f"Total time: {session.actual_total_time:.1f}s")
            logger.info(f"Success rate: {session.completed_platforms}/{session.total_platforms}")
            
        except Exception as e:
            logger.error(f"Error completing session {session_id}: {str(e)}")
    
    def get_session_progress(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get current progress information for a session"""
        if session_id not in self.active_sessions:
            return None
        
        session = self.active_sessions[session_id]
        
        # Build platform progress summary
        platform_summaries = {}
        for platform, progress in session.platform_progress.items():
            platform_summaries[platform] = {
                'status': progress.status.value,
                'current_stage': progress.current_stage.value,
                'completion_percentage': progress.completion_percentage,
                'steps_completed': progress.steps_completed,
                'total_steps': progress.total_steps,
                'error_count': progress.error_count,
                'estimated_completion_time': progress.estimated_completion_time
            }
        
        return {
            'session_id': session_id,
            'overall_percentage': session.overall_percentage,
            'completed_platforms': session.completed_platforms,
            'failed_platforms': session.failed_platforms,
            'total_platforms': session.total_platforms,
            'estimated_total_time': session.estimated_total_time,
            'actual_total_time': session.actual_total_time,
            'platform_progress': platform_summaries
        }
    
    def get_current_platform_progress(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get progress for currently active platform"""
        if session_id not in self.active_sessions:
            return None
        
        session = self.active_sessions[session_id]
        
        # Find currently active platform
        for platform, progress in session.platform_progress.items():
            if progress.status == PlatformStatus.IN_PROGRESS:
                return {
                    'platform': platform,
                    'status': progress.status.value,
                    'current_stage': progress.current_stage.value,
                    'completion_percentage': progress.completion_percentage,
                    'steps_completed': progress.steps_completed,
                    'total_steps': progress.total_steps
                }
        
        return None
    
    def cleanup_session(self, session_id: str) -> bool:
        """Clean up completed session data"""
        try:
            if session_id in self.active_sessions:
                del self.active_sessions[session_id]
                logger.info(f"Cleaned up session {session_id}")
                return True
            return False
            
        except Exception as e:
            logger.error(f"Error cleaning up session {session_id}: {str(e)}")
            return False
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get overall performance statistics"""
        total_sessions = len(self.active_sessions)
        
        # Calculate average execution times by platform
        platform_averages = {}
        for platform, times in self.historical_data.items():
            if times:
                platform_averages[platform] = sum(times) / len(times)
        
        return {
            'active_sessions': total_sessions,
            'historical_data_points': {platform: len(times) for platform, times in self.historical_data.items()},
            'average_platform_times': platform_averages,
            'stage_weights': {stage.value: weight for stage, weight in self.stage_weights.items()},
            'platform_multipliers': self.platform_multipliers
        }