// Social media platform constants and validation

export interface PlatformConfig {
  id: string;
  label: string;
  icon: string;
  placeholder: string;
  urlPattern: RegExp;
  errorMessage: string;
}

export const SOCIAL_PLATFORMS: Record<string, PlatformConfig> = {
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: 'linkedin.png',
    placeholder: 'linkedin.com/in/yourname',
    urlPattern: /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/(in|pub|public-profile\/(in|pub))\/[\w\-]+\/?$/i,
    errorMessage: 'Please enter a valid LinkedIn profile URL'
  },
  github: {
    id: 'github',
    label: 'GitHub',
    icon: 'github.png',
    placeholder: 'github.com/username',
    urlPattern: /^(https?:\/\/)?(www\.)?github\.com\/[\w\-]+\/?$/i,
    errorMessage: 'Please enter a valid GitHub profile URL (e.g., github.com/username)'
  },
  twitter: {
    id: 'twitter',
    label: 'Twitter/X',
    icon: 'twitter.png',
    placeholder: 'twitter.com/username or x.com/username',
    urlPattern: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[\w]+\/?$/i,
    errorMessage: 'Please enter a valid Twitter/X profile URL'
  },
  website: {
    id: 'website',
    label: 'Personal Website',
    icon: 'website.png',
    placeholder: 'yourwebsite.com',
    urlPattern: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
    errorMessage: 'Please enter a valid website URL'
  },
  pinterest: {
    id: 'pinterest',
    label: 'Pinterest',
    icon: 'pinterest.png',
    placeholder: 'pinterest.com/username',
    urlPattern: /^(https?:\/\/)?(www\.)?pinterest\.com\/[\w\-]+\/?$/i,
    errorMessage: 'Please enter a valid Pinterest profile URL'
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    icon: 'medium.png',
    placeholder: 'medium.com/@username',
    urlPattern: /^(https?:\/\/)?(www\.)?medium\.com\/@?[\w\-]+\/?$/i,
    errorMessage: 'Please enter a valid Medium profile URL'
  },
  youtube: {
    id: 'youtube',
    label: 'YouTube',
    icon: 'youtube.png',
    placeholder: 'youtube.com/@channelname or youtube.com/c/channelname',
    urlPattern: /^(https?:\/\/)?(www\.)?youtube\.com\/([@c]\/)?[\w\-]+\/?$/i,
    errorMessage: 'Please enter a valid YouTube channel URL'
  },
  stackoverflow: {
    id: 'stackoverflow',
    label: 'Stack Overflow',
    icon: 'stackoverflow.png',
    placeholder: 'stackoverflow.com/users/123456/username',
    urlPattern: /^(https?:\/\/)?(www\.)?stackoverflow\.com\/users\/\d+\/[\w\-]+\/?$/i,
    errorMessage: 'Please enter a valid Stack Overflow profile URL'
  },
  behance: {
    id: 'behance',
    label: 'Behance',
    icon: 'behance.png',
    placeholder: 'behance.net/username',
    urlPattern: /^(https?:\/\/)?(www\.)?behance\.net\/[\w\-]+\/?$/i,
    errorMessage: 'Please enter a valid Behance profile URL'
  },
  dribbble: {
    id: 'dribbble',
    label: 'Dribbble',
    icon: 'dribbble.png',
    placeholder: 'dribbble.com/username',
    urlPattern: /^(https?:\/\/)?(www\.)?dribbble\.com\/[\w\-]+\/?$/i,
    errorMessage: 'Please enter a valid Dribbble profile URL'
  }
};

// Get ordered list of platforms for dropdown
export const PLATFORM_OPTIONS = Object.values(SOCIAL_PLATFORMS).map(p => ({
  value: p.id,
  label: p.label
}));

// Validate URL for a specific platform
export function validatePlatformUrl(platform: string, url: string): { valid: boolean; error?: string } {
  if (!url.trim()) {
    return { valid: true }; // Empty is valid (optional field)
  }

  const platformConfig = SOCIAL_PLATFORMS[platform];
  if (!platformConfig) {
    return { valid: false, error: 'Unknown platform' };
  }

  const urlLower = url.toLowerCase().trim();
  if (!platformConfig.urlPattern.test(urlLower)) {
    return { valid: false, error: platformConfig.errorMessage };
  }

  return { valid: true };
}

// Extract handle/username from social media URL
export function extractSocialHandle(platform: string, url: string): string {
  if (!url) return '';

  const cleanUrl = url.trim().replace(/\/+$/, ''); // Remove trailing slashes

  switch (platform) {
    case 'stackoverflow':
      // Extract username from stackoverflow.com/users/123456/username
      const soMatch = cleanUrl.match(/\/users\/\d+\/([\w\-]+)/i);
      return soMatch ? soMatch[1] : cleanUrl.split('/').pop() || '';

    case 'medium':
      // Extract @username from medium.com/@username
      const mediumHandle = cleanUrl.split('/').pop() || '';
      return mediumHandle.startsWith('@') ? mediumHandle : `@${mediumHandle}`;

    case 'twitter':
      // Extract @username from twitter.com/username or x.com/username
      const twitterHandle = cleanUrl.split('/').pop() || '';
      return `@${twitterHandle}`;

    case 'youtube':
      // Extract channel name from youtube.com/@channelname or youtube.com/c/channelname
      const ytParts = cleanUrl.split('/');
      return ytParts[ytParts.length - 1] || '';

    default:
      // For most platforms, just get the last part of the URL
      return cleanUrl.split('/').pop() || '';
  }
}

// Generate smart display text for social links
export function generateDisplayText(platform: string, url: string, contactName?: string): string {
  const handle = extractSocialHandle(platform, url);

  switch (platform) {
    case 'linkedin':
      // Use existing LinkedIn logic - could be enhanced later
      return contactName || handle || 'LinkedIn Profile';

    case 'github':
      return handle || 'GitHub';

    case 'twitter':
      return handle || 'Twitter';

    case 'website':
      // Extract domain from URL
      try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        return urlObj.hostname.replace('www.', '');
      } catch {
        return 'Website';
      }

    case 'medium':
      return handle || 'Medium';

    case 'youtube':
      return handle || 'YouTube';

    case 'stackoverflow':
      return handle || 'Stack Overflow';

    case 'behance':
      return handle || 'Behance';

    case 'dribbble':
      return handle || 'Dribbble';

    case 'pinterest':
      return handle || 'Pinterest';

    default:
      return handle || platform;
  }
}
