// Favicon服务 - 支持多种fallback方案
export class FaviconService {
  private static cache = new Map<string, string>();
  
  // 多种favicon服务URL
  private static readonly SERVICES = [
    // Google Favicon Service (最稳定)
    (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
    // DuckDuckGo Favicon Service
    (domain: string) => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    // GitHub Favicon Service
    (domain: string) => `https://favicons.githubusercontent.com/${domain}`,
    // 备用服务
    (domain: string) => `https://${domain}/favicon.ico`,
  ];

  // 获取favicon URL
  static getFaviconUrl(domain: string, serviceIndex: number = 0): string {
    const cacheKey = `${domain}-${serviceIndex}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const service = this.SERVICES[serviceIndex];
    if (!service) {
      return this.getFallbackEmoji(domain);
    }

    const url = service(domain);
    this.cache.set(cacheKey, url);
    return url;
  }

  // 获取所有可用的favicon URL
  static getAllFaviconUrls(domain: string): string[] {
    return this.SERVICES.map(service => service(domain));
  }

  // 获取fallback emoji
  static getFallbackEmoji(domain: string): string {
    const emojiMap: Record<string, string> = {
      'remove.bg': '🎯',
      'clipdrop.co': '⚡',
      'replicate.com': '🤖',
      'huggingface.co': '🤗',
    };
    
    return emojiMap[domain] || '🔧';
  }

  // 预加载favicon
  static async preloadFavicon(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  // 批量预加载
  static async preloadAllFavicons(domains: string[]): Promise<void> {
    const promises = domains.flatMap(domain => 
      this.getAllFaviconUrls(domain).map(url => this.preloadFavicon(url))
    );
    
    await Promise.allSettled(promises);
  }
}

// API提供商域名映射
export const PROVIDER_DOMAINS: Record<string, string> = {
  'removebg': 'remove.bg',
  'clipdrop': 'clipdrop.co',
  'replicate': 'replicate.com',
  'huggingface': 'huggingface.co',
};
