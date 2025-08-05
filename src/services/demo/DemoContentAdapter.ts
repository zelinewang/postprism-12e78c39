/**
 * Demo Content Adaptation Service
 * Extracted for better performance and maintainability
 */

export class DemoContentAdapter {
  /**
   * Generate platform-optimized content
   */
  static adaptContentForPlatform(content: string, platform: string): string {
    const adaptations = {
      linkedin: `🚀 ${content}\n\nThis is a revolutionary demo of PostPrism AI! Through the powerful combination of Agent S2.5 + ORGO, we've achieved true multi-platform parallel publishing.\n\n#ArtificialIntelligence #SocialMediaAutomation #PostPrism #TechInnovation`,
      
      twitter: `🤖 ${content}\n\n✨ Just experienced @PostPrism's AI publishing magic:\n→ 3 platforms simultaneously\n→ Watch AI work in real-time\n→ 45 seconds for everything\n\nThis is the future! 🚀\n\n#PostPrism #AIAutomation #ProductivityTool`,
      
      instagram: `🌈 ${content}\n\nJust witnessed PostPrism's magical moment! ✨\n\nAI working simultaneously on LinkedIn, Twitter and Instagram while I watch the entire process like a movie 🎬\n\nThis transparent AI automation experience is unprecedented!\n\n#PostPrism #ArtificialIntelligence #TechAesthetics #Automation #EfficiencyRevolution #FutureTech #Innovation #DigitalTransformation #AITools #SocialMedia`
    };
    
    return adaptations[platform as keyof typeof adaptations] || content;
  }

  /**
   * Generate platform-appropriate hashtags
   */
  static generateDemoHashtags(platform: string): string[] {
    const platformTags = {
      linkedin: ['ArtificialIntelligence', 'PostPrism', 'Automation', 'ProductivityTool', 'TechInnovation'],
      twitter: ['PostPrism', 'AIAutomation', 'ProductivityTool', 'Tech', 'Innovation'],
      instagram: ['PostPrism', 'ArtificialIntelligence', 'TechAesthetics', 'Automation', 'EfficiencyRevolution', 'FutureTech', 'AITools']
    };
    
    return platformTags[platform as keyof typeof platformTags] || ['PostPrism', 'Demo'];
  }
}