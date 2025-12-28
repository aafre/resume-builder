/**
 * Type definitions for the announcement bar system
 *
 * The announcement bar is a reusable notification system for communicating
 * new features, updates, and important information to users.
 */

export type AnnouncementVariant = 'info' | 'feature' | 'success' | 'warning';

export type AnnouncementRoute =
  | 'all'
  | 'landing'
  | 'editor'
  | 'dashboard'
  | 'my-resumes'
  | string[];

export interface AnnouncementConfig {
  /** Unique identifier for this announcement (e.g., 'cloud-save-v2-2025') */
  id: string;

  /** Main announcement text to display */
  message: string;

  /** Optional emoji or icon to display before the message */
  icon?: string;

  /** Primary call-to-action button configuration */
  primaryCta?: {
    /** Button text (e.g., 'Sign In', 'Get Started') */
    text: string;
    /** Action type: 'sign-in' triggers auth modal, 'link' navigates to URL */
    action: 'sign-in' | 'link';
    /** URL to navigate to (required if action is 'link') */
    url?: string;
  };

  /** Secondary call-to-action link configuration */
  secondaryCta?: {
    /** Link text (e.g., 'Learn More') */
    text: string;
    /** URL to navigate to */
    url: string;
  };

  /** Visual style variant (determines color scheme) */
  variant?: AnnouncementVariant;

  /** Pages/routes where this announcement should appear */
  showOn?: AnnouncementRoute;

  /** Optional expiration date - announcement won't show after this date */
  expiresAt?: Date;

  /** Priority for sorting when multiple announcements are active (lower = higher priority) */
  priority?: number;
}
