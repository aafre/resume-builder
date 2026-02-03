import { AnnouncementConfig } from '../types/announcement';

/**
 * Announcement bar configuration
 *
 * Add new announcements to this array. The system will automatically:
 * - Filter out dismissed announcements
 * - Check expiration dates
 * - Match against current route
 * - Show the highest priority active announcement
 *
 * To add a new announcement, simply add a new object to the array below.
 */
export const announcements: AnnouncementConfig[] = [
  {
    id: 'cloud-save-v2-2025',
    message: 'New: Create a free account to save your resumes to the cloud.',
    icon: '🚀',
    primaryCta: {
      text: 'Sign In',
      action: 'sign-in',
    },
    secondaryCta: {
      text: 'Why EasyFreeResume is free',
      url: '/blog/how-why-easyfreeresume-completely-free',
    },
    variant: 'feature',
    showOn: 'landing',
    priority: 1,
  },
  // Future announcements can be added here
  // Example:
  // {
  //   id: 'ai-features-v3-2025',
  //   message: 'Coming Soon: AI-powered resume optimization',
  //   icon: '🤖',
  //   primaryCta: {
  //     text: 'Join Waitlist',
  //     action: 'link',
  //     url: '/ai-waitlist',
  //   },
  //   variant: 'info',
  //   showOn: 'all',
  //   priority: 2,
  //   expiresAt: new Date('2025-03-01'),
  // }
];

/**
 * Get the active announcement for the current route
 *
 * Filters announcements by:
 * - Not dismissed by the user
 * - Not expired
 * - Matches the current route
 *
 * Returns the highest priority announcement (lowest priority number)
 *
 * @param pathname - Current route pathname (from useLocation)
 * @param dismissedIds - Array of dismissed announcement IDs from user preferences
 * @returns The active announcement or null if none match
 */
export function getActiveAnnouncement(
  pathname: string,
  dismissedIds: string[]
): AnnouncementConfig | null {
  const now = new Date();

  return announcements
    .filter(a => {
      // Check if dismissed
      if (dismissedIds.includes(a.id)) return false;

      // Check if expired
      if (a.expiresAt && a.expiresAt < now) return false;

      // Check route matching
      if (!a.showOn) return false;
      if (a.showOn === 'all') return true;
      if (a.showOn === 'landing') return pathname === '/';
      if (typeof a.showOn === 'string') {
        // Handle string routes like 'editor', 'dashboard', 'my-resumes'
        return pathname.startsWith(`/${a.showOn}`);
      }
      // Handle array of routes
      return a.showOn.some(route => pathname === route || pathname.startsWith(route));
    })
    .sort((a, b) => (a.priority || 999) - (b.priority || 999))[0] || null;
}
