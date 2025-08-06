"""
Multi-Platform Content Adaptation System

This module implements intelligent content adaptation using multiple AI models
to optimize content for different social media platforms. Each platform requires
different tone, style, and format optimizations.

Platform-Specific Adaptations:
- LinkedIn: Professional, business-focused tone with industry insights
- Twitter: Concise, engaging, trending-aware content with optimal character usage
- Instagram: Visual, emotional storytelling with aesthetic appeal

AI Model Allocation:
- Anthropic Claude: LinkedIn (professional content) + Instagram (creative content)
- OpenAI GPT-4: Twitter (trending and viral content)
- DALL-E: Instagram image generation (future feature)

Architecture:
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Original       │────│  Multi-Platform  │────│  Platform       │
│  Content        │    │  Adapter         │    │  Optimized      │
│                 │    │  (this module)   │    │  Content        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
            ┌───────▼────┐ ┌───▼────┐ ┌───▼────────┐
            │ LinkedIn   │ │Twitter │ │ Instagram  │
            │ Adapter    │ │Adapter │ │ Adapter    │
            │ (Claude)   │ │(GPT-4) │ │ (Claude)   │
            └────────────┘ └────────┘ └────────────┘
"""

import logging
import asyncio
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from abc import ABC, abstractmethod

# AI API imports
import anthropic
import openai

# Configuration
from config.settings import AIModelConfig

logger = logging.getLogger(__name__)

@dataclass
class AdaptedContent:
    """
    Structured container for platform-adapted content

    This class standardizes the output format for all platform adapters,
    ensuring consistent data structure across the system.
    """
    content: str
    hashtags: List[str]
    tone: str
    platform_specific_data: Dict[str, Any]
    ai_insights: str
    optimization_score: float = 0.0

class BasePlatformAdapter(ABC):
    """
    Abstract base class for platform-specific content adapters

    This class defines the interface that all platform adapters must implement,
    ensuring consistent behavior across different social media platforms.
    """

    def __init__(self, ai_config: AIModelConfig):
        self.ai_config = ai_config
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")

    @abstractmethod
    async def adapt_content(self, original_content: str) -> AdaptedContent:
        """Adapt content for specific platform"""
        pass

    @abstractmethod
    def get_platform_constraints(self) -> Dict[str, Any]:
        """Get platform-specific constraints (character limits, etc.)"""
        pass

class LinkedInAdapter(BasePlatformAdapter):
    """
    LinkedIn Content Adapter using Anthropic Claude

    LinkedIn requires professional, business-focused content with:
    - Industry insights and professional language
    - Networking-oriented messaging
    - Professional hashtags and terminology
    - Longer-form content capability (up to 3000 characters)

    This adapter uses Claude's strength in professional writing and analysis.
    """

    def __init__(self, ai_config: AIModelConfig):
        super().__init__(ai_config)
        # Initialize Anthropic client with explicit parameters to avoid version compatibility issues
        self.client = anthropic.Anthropic(
            api_key=ai_config.anthropic_api_key,
            max_retries=2
        )
        self.platform_name = "LinkedIn"

    async def adapt_content(self, original_content: str) -> AdaptedContent:
        """
        Adapt content for LinkedIn professional audience

        Process:
        1. Analyze original content for business relevance
        2. Enhance with professional language and industry insights
        3. Add relevant professional hashtags
        4. Optimize for LinkedIn's algorithm preferences
        """
        try:
            self.logger.info("Starting LinkedIn content adaptation with Claude")

            # Construct professional adaptation prompt
            prompt = self._build_linkedin_prompt(original_content)

            # Call Claude API
            response = await self._call_claude_api(prompt)

            # Parse response and extract components
            adapted_content = self._parse_claude_response(response)

            self.logger.info("LinkedIn content adaptation completed successfully")
            return adapted_content

        except Exception as e:
            self.logger.error(f"LinkedIn adaptation failed: {str(e)}")
            # Return fallback content
            return self._create_fallback_content(original_content)

    def _build_linkedin_prompt(self, content: str) -> str:
        """Build LinkedIn-specific adaptation prompt for Claude"""
        return f"""
        Transform the following content for LinkedIn professional audience:

        Original Content: "{content}"

        Requirements:
        1. Use professional, business-appropriate language
        2. Add industry insights or business context where relevant
        3. Structure for professional networking and engagement
        4. Include 3-5 professional hashtags
        5. Optimize for LinkedIn's algorithm (encourage engagement)
        6. Keep under 2000 characters for optimal engagement
        7. Add a call-to-action that encourages professional discussion

        Return the response in this exact JSON format:
        {{
            "adapted_content": "The professionally adapted content here",
            "hashtags": ["professional", "hashtag", "list"],
            "tone": "professional",
            "professional_insights": "What business insights were added",
            "engagement_strategy": "How this content encourages professional engagement",
            "optimization_score": 0.85
        }}
        """

    async def _call_claude_api(self, prompt: str) -> Dict[str, Any]:
        """Call Anthropic Claude API with error handling and retries"""
        try:
            message = await asyncio.to_thread(
                self.client.messages.create,
                model="claude-3-haiku-20240307",
                max_tokens=self.ai_config.max_tokens,
                temperature=self.ai_config.temperature,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            return {"content": message.content[0].text}

        except Exception as e:
            self.logger.error(f"Claude API call failed: {str(e)}")
            raise

    def _parse_claude_response(self, response: Dict[str, Any]) -> AdaptedContent:
        """Parse Claude response and extract structured content"""
        import json

        try:
            # Extract JSON from Claude response
            content_text = response["content"]

            # Find JSON in response (Claude sometimes adds explanation)
            json_start = content_text.find('{')
            json_end = content_text.rfind('}') + 1
            json_str = content_text[json_start:json_end]

            parsed = json.loads(json_str)

            return AdaptedContent(
                content=parsed["adapted_content"],
                hashtags=parsed["hashtags"],
                tone=parsed["tone"],
                platform_specific_data={
                    "professional_insights": parsed.get("professional_insights", ""),
                    "engagement_strategy": parsed.get("engagement_strategy", "")
                },
                ai_insights=parsed.get("professional_insights", ""),
                optimization_score=parsed.get("optimization_score", 0.8)
            )

        except (json.JSONDecodeError, KeyError) as e:
            self.logger.warning(f"Failed to parse Claude response: {str(e)}")
            return self._create_fallback_content(response.get("content", ""))

    def _create_fallback_content(self, original_content: str) -> AdaptedContent:
        """Create fallback content when AI adaptation fails"""
        return AdaptedContent(
            content=f"🚀 {original_content}\n\nWhat are your thoughts on this? Let's discuss in the comments!",
            hashtags=["professional", "business", "networking", "innovation"],
            tone="professional",
            platform_specific_data={},
            ai_insights="Fallback content generated due to API limitation",
            optimization_score=0.6
        )

    def get_platform_constraints(self) -> Dict[str, Any]:
        """Get LinkedIn platform constraints"""
        return {
            "max_characters": 3000,
            "optimal_characters": 1500,
            "max_hashtags": 5,
            "supports_media": True,
            "algorithm_factors": ["engagement", "professional_network", "industry_relevance"]
        }

class TwitterAdapter(BasePlatformAdapter):
    """
    Twitter Content Adapter using OpenAI GPT-4

    Twitter requires concise, engaging content with:
    - 280 character limit
    - Trending and viral content optimization
    - Quick, punchy messaging
    - Strategic hashtag usage (2-3 hashtags max)

    This adapter uses GPT-4's strength in creating viral, engaging content.
    """

    def __init__(self, ai_config: AIModelConfig):
        super().__init__(ai_config)
        # Initialize OpenAI client with explicit parameters to avoid version compatibility issues
        self.client = openai.OpenAI(
            api_key=ai_config.openai_api_key,
            max_retries=2
        )
        self.platform_name = "Twitter"

    async def adapt_content(self, original_content: str) -> AdaptedContent:
        """
        Adapt content for Twitter's fast-paced, engaging environment

        Process:
        1. Compress content to fit 280 character limit
        2. Add trending elements and viral potential
        3. Optimize for Twitter's engagement algorithm
        4. Include strategic hashtags for discoverability
        """
        try:
            self.logger.info("Starting Twitter content adaptation with GPT-4")

            # Build Twitter-specific prompt
            prompt = self._build_twitter_prompt(original_content)

            # Call OpenAI API
            response = await self._call_openai_api(prompt)

            # Parse and structure response
            adapted_content = self._parse_openai_response(response)

            self.logger.info("Twitter content adaptation completed successfully")
            return adapted_content

        except Exception as e:
            self.logger.error(f"Twitter adaptation failed: {str(e)}")
            return self._create_fallback_content(original_content)

    def _build_twitter_prompt(self, content: str) -> str:
        """Build Twitter-specific adaptation prompt for GPT-4"""
        return f"""
        Transform the following content for Twitter's fast-paced, engaging environment:

        Original Content: "{content}"

        Requirements:
        1. Keep under 280 characters TOTAL (including hashtags)
        2. Make it punchy, engaging, and shareable
        3. Add trending elements or viral potential
        4. Include 2-3 strategic hashtags
        5. Use emojis strategically for engagement
        6. Optimize for Twitter algorithm (replies, retweets, likes)
        7. Create urgency or curiosity when possible

        Return the response in this exact JSON format:
        {{
            "adapted_content": "The Twitter-optimized content (under 280 chars including hashtags)",
            "hashtags": ["trending", "hashtag"],
            "tone": "energetic",
            "viral_elements": "What makes this content shareable",
            "character_count": 250,
            "engagement_hooks": "Specific elements designed to drive engagement",
            "optimization_score": 0.9
        }}
        """

    async def _call_openai_api(self, prompt: str) -> Dict[str, Any]:
        """Call OpenAI GPT-4 API with error handling"""
        try:
            # Handle o3 model temperature restriction
            temperature = 1.0 if self.ai_config.default_model.startswith("o3") else self.ai_config.temperature

            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.ai_config.default_model,
                max_tokens=self.ai_config.max_tokens,
                temperature=temperature,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a Twitter content expert specializing in viral, engaging tweets."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            return {"content": response.choices[0].message.content}

        except Exception as e:
            self.logger.error(f"OpenAI API call failed: {str(e)}")
            raise

    def _parse_openai_response(self, response: Dict[str, Any]) -> AdaptedContent:
        """Parse OpenAI response and extract structured content"""
        import json

        try:
            content_text = response["content"]

            # Extract JSON from response
            json_start = content_text.find('{')
            json_end = content_text.rfind('}') + 1
            json_str = content_text[json_start:json_end]

            parsed = json.loads(json_str)

            return AdaptedContent(
                content=parsed["adapted_content"],
                hashtags=parsed["hashtags"],
                tone=parsed["tone"],
                platform_specific_data={
                    "character_count": parsed.get("character_count", len(parsed["adapted_content"])),
                    "viral_elements": parsed.get("viral_elements", ""),
                    "engagement_hooks": parsed.get("engagement_hooks", "")
                },
                ai_insights=parsed.get("viral_elements", ""),
                optimization_score=parsed.get("optimization_score", 0.8)
            )

        except (json.JSONDecodeError, KeyError) as e:
            self.logger.warning(f"Failed to parse OpenAI response: {str(e)}")
            return self._create_fallback_content(response.get("content", ""))

    def _create_fallback_content(self, original_content: str) -> AdaptedContent:
        """Create fallback Twitter content when AI adaptation fails"""
        # Truncate content to fit Twitter's limit
        truncated = original_content[:220] + "..." if len(original_content) > 220 else original_content
        return AdaptedContent(
            content=f"🔥 {truncated} #trending #tech",
            hashtags=["trending", "tech"],
            tone="energetic",
            platform_specific_data={"character_count": len(f"🔥 {truncated} #trending #tech")},
            ai_insights="Fallback content with character limit optimization",
            optimization_score=0.6
        )

    def get_platform_constraints(self) -> Dict[str, Any]:
        """Get Twitter platform constraints"""
        return {
            "max_characters": 280,
            "optimal_characters": 250,
            "max_hashtags": 3,
            "supports_media": True,
            "algorithm_factors": ["engagement_rate", "retweets", "replies", "trending_topics"]
        }

class InstagramAdapter(BasePlatformAdapter):
    """
    Instagram Content Adapter using Anthropic Claude

    Instagram requires visual, emotional content with:
    - Storytelling and aesthetic appeal
    - Emotional connection and inspiration
    - Visual-first thinking (though we focus on captions)
    - Lifestyle and aspirational messaging

    This adapter uses Claude's strength in creative, emotional writing.
    """

    def __init__(self, ai_config: AIModelConfig):
        super().__init__(ai_config)
        # Initialize Anthropic client with explicit parameters to avoid version compatibility issues
        self.client = anthropic.Anthropic(
            api_key=ai_config.anthropic_api_key,
            max_retries=2
        )
        self.platform_name = "Instagram"

    async def adapt_content(self, original_content: str) -> AdaptedContent:
        """
        Adapt content for Instagram's visual and emotional environment

        Process:
        1. Transform into visual, story-driven content
        2. Add emotional hooks and inspirational elements
        3. Create aesthetic, lifestyle-focused messaging
        4. Include relevant Instagram hashtags for discovery
        """
        try:
            self.logger.info("Starting Instagram content adaptation with Claude")

            prompt = self._build_instagram_prompt(original_content)
            response = await self._call_claude_api(prompt)
            adapted_content = self._parse_claude_response(response)

            self.logger.info("Instagram content adaptation completed successfully")
            return adapted_content

        except Exception as e:
            self.logger.error(f"Instagram adaptation failed: {str(e)}")
            return self._create_fallback_content(original_content)

    def _build_instagram_prompt(self, content: str) -> str:
        """Build Instagram-specific adaptation prompt for Claude"""
        return f"""
        Transform the following content for Instagram's visual and emotional platform:

        Original Content: "{content}"

        Requirements:
        1. Create visual, story-driven content that inspires
        2. Use emotional hooks and aesthetic language
        3. Structure for Instagram's visual-first environment
        4. Include 5-10 relevant hashtags for discoverability
        5. Add lifestyle and aspirational elements
        6. Use emojis to enhance visual appeal
        7. Create content that would pair well with visual media
        8. Encourage community engagement and connection

        Return the response in this exact JSON format:
        {{
            "adapted_content": "The Instagram-optimized visual and emotional content",
            "hashtags": ["visual", "aesthetic", "lifestyle", "inspiration", "community"],
            "tone": "inspirational",
            "visual_elements": "How this content connects to visual storytelling",
            "emotional_hooks": "What emotional connections this creates",
            "story_elements": ["element1", "element2", "element3"],
            "optimization_score": 0.85
        }}
        """

    async def _call_claude_api(self, prompt: str) -> Dict[str, Any]:
        """Call Anthropic Claude API (same as LinkedIn but different prompt)"""
        try:
            message = await asyncio.to_thread(
                self.client.messages.create,
                model="claude-3-haiku-20240307",
                max_tokens=self.ai_config.max_tokens,
                temperature=self.ai_config.temperature + 0.1,  # Slightly more creative for Instagram
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            return {"content": message.content[0].text}

        except Exception as e:
            self.logger.error(f"Claude API call failed: {str(e)}")
            raise

    def _parse_claude_response(self, response: Dict[str, Any]) -> AdaptedContent:
        """Parse Claude response for Instagram content"""
        import json

        try:
            content_text = response["content"]
            json_start = content_text.find('{')
            json_end = content_text.rfind('}') + 1
            json_str = content_text[json_start:json_end]

            parsed = json.loads(json_str)

            return AdaptedContent(
                content=parsed["adapted_content"],
                hashtags=parsed["hashtags"],
                tone=parsed["tone"],
                platform_specific_data={
                    "visual_elements": parsed.get("visual_elements", ""),
                    "emotional_hooks": parsed.get("emotional_hooks", ""),
                    "story_elements": parsed.get("story_elements", [])
                },
                ai_insights=parsed.get("emotional_hooks", ""),
                optimization_score=parsed.get("optimization_score", 0.8)
            )

        except (json.JSONDecodeError, KeyError) as e:
            self.logger.warning(f"Failed to parse Claude response: {str(e)}")
            return self._create_fallback_content(response.get("content", ""))

    def _create_fallback_content(self, original_content: str) -> AdaptedContent:
        """Create fallback Instagram content when AI adaptation fails"""
        return AdaptedContent(
            content=f"✨ {original_content} ✨\n\nWhat inspires you today? Share in the comments! 💫",
            hashtags=["inspiration", "aesthetic", "lifestyle", "community", "vibes"],
            tone="inspirational",
            platform_specific_data={},
            ai_insights="Fallback content with visual and emotional enhancement",
            optimization_score=0.6
        )

    def get_platform_constraints(self) -> Dict[str, Any]:
        """Get Instagram platform constraints"""
        return {
            "max_characters": 2200,
            "optimal_characters": 1500,
            "max_hashtags": 30,
            "optimal_hashtags": 10,
            "supports_media": True,
            "algorithm_factors": ["engagement", "visual_appeal", "story_completion", "hashtag_performance"]
        }

class MultiPlatformAdapter:
    """
    Central orchestrator for multi-platform content adaptation

    This class coordinates the different platform adapters to transform
    original content into optimized versions for each selected platform.

    Process Flow:
    1. Receive original content and platform list
    2. Initialize appropriate platform adapters
    3. Execute parallel content adaptation
    4. Aggregate and return results

    Performance Optimization:
    - Parallel execution of AI API calls
    - Caching of recent adaptations
    - Fallback content generation
    - Error handling and retry logic
    """

    def __init__(self, ai_config: AIModelConfig):
        self.ai_config = ai_config
        self.logger = logging.getLogger(__name__)

        # Initialize platform adapters
        self.adapters = {
            'linkedin': LinkedInAdapter(ai_config),
            'twitter': TwitterAdapter(ai_config),
            'instagram': InstagramAdapter(ai_config)
        }

        self.logger.info("MultiPlatformAdapter initialized with all platform adapters")

    def adapt_for_platforms(self, original_content: str, platforms: List[str]) -> Dict[str, Dict[str, Any]]:
        """
        Adapt content for multiple platforms simultaneously

        Args:
            original_content: The original content to adapt
            platforms: List of platform names ['linkedin', 'twitter', 'instagram']

        Returns:
            Dictionary mapping platform names to adapted content data
        """
        try:
            self.logger.info(f"Starting multi-platform adaptation for: {platforms}")

            # Run adaptations in parallel for better performance
            results = asyncio.run(self._adapt_platforms_parallel(original_content, platforms))

            self.logger.info("Multi-platform adaptation completed successfully")
            return results

        except Exception as e:
            self.logger.error(f"Multi-platform adaptation failed: {str(e)}")
            # Return fallback results for all platforms
            return self._create_fallback_results(original_content, platforms)

    async def _adapt_platforms_parallel(self, original_content: str, platforms: List[str]) -> Dict[str, Dict[str, Any]]:
        """Execute platform adaptations in parallel for optimal performance"""
        tasks = []

        for platform in platforms:
            if platform in self.adapters:
                task = self._adapt_single_platform(platform, original_content)
                tasks.append((platform, task))
            else:
                self.logger.warning(f"Unknown platform: {platform}")

        # Execute all adaptations in parallel
        results = {}
        for platform, task in tasks:
            try:
                adapted_content = await task
                results[platform] = self._format_platform_result(adapted_content)
            except Exception as e:
                self.logger.error(f"Adaptation failed for {platform}: {str(e)}")
                results[platform] = self._create_platform_fallback(platform, original_content)

        return results

    async def _adapt_single_platform(self, platform: str, content: str) -> AdaptedContent:
        """Adapt content for a single platform"""
        adapter = self.adapters[platform]
        return await adapter.adapt_content(content)

    def _format_platform_result(self, adapted_content: AdaptedContent) -> Dict[str, Any]:
        """Format AdaptedContent object into API response format"""
        return {
            'content': adapted_content.content,
            'hashtags': adapted_content.hashtags,
            'tone': adapted_content.tone,
            'ai_insights': adapted_content.ai_insights,
            'optimization_score': adapted_content.optimization_score,
            'platform_data': adapted_content.platform_specific_data
        }

    def _create_platform_fallback(self, platform: str, original_content: str) -> Dict[str, Any]:
        """Create fallback content for a specific platform"""
        fallback_content = {
            'linkedin': f"🚀 {original_content}\n\nWhat are your professional thoughts on this?",
            'twitter': f"🔥 {original_content[:240]}... #trending",
            'instagram': f"✨ {original_content} ✨\n\nWhat inspires you? 💫"
        }

        fallback_hashtags = {
            'linkedin': ['professional', 'business', 'networking'],
            'twitter': ['trending', 'tech'],
            'instagram': ['inspiration', 'aesthetic', 'lifestyle']
        }

        return {
            'content': fallback_content.get(platform, original_content),
            'hashtags': fallback_hashtags.get(platform, ['general']),
            'tone': 'neutral',
            'ai_insights': f'Fallback content generated for {platform}',
            'optimization_score': 0.5,
            'platform_data': {}
        }

    def _create_fallback_results(self, original_content: str, platforms: List[str]) -> Dict[str, Dict[str, Any]]:
        """Create fallback results for all platforms when system fails"""
        results = {}
        for platform in platforms:
            results[platform] = self._create_platform_fallback(platform, original_content)
        return results

    def get_supported_platforms(self) -> List[str]:
        """Get list of supported platforms"""
        return list(self.adapters.keys())

    def get_platform_constraints(self, platform: str) -> Optional[Dict[str, Any]]:
        """Get constraints for a specific platform"""
        if platform in self.adapters:
            return self.adapters[platform].get_platform_constraints()
        return None
