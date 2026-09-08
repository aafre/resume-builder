/**
 * Tour Steps Configuration
 *
 * The onboarding tour's content, branched by auth state.
 *
 * Voice: reassurance first. An anonymous visitor arrived here because a
 * competitor let them do the work and then asked for money, so the tour never
 * opens or closes on sign-in pressure. The account is offered as the additive
 * thing it is (see `AnonymousStorageBadge`, which sets the register), and the
 * finish line named at the end is the download, not the login.
 *
 * `anonymous` is optional on both `title` and `content`: omit it and the
 * authenticated copy is used for everyone.
 */

import { ArrowUpDown, Check, Cloud, Download, Library, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TourStepContent {
  icon: LucideIcon;
  description: string;
}

export interface TourStep {
  id: string;
  /** Controls step visibility based on auth state. Defaults to 'all'. */
  visibleFor?: 'all' | 'authenticated' | 'anonymous';
  title: {
    authenticated: string;
    anonymous?: string;
  };
  content: {
    authenticated: TourStepContent;
    anonymous?: TourStepContent;
  };
  ctaButton?: {
    text: string;
    action: 'sign-in';
    showForAnonymousOnly: boolean;
  };
}

export const TOUR_STEPS: TourStep[] = [
  // Step 1: Where the work lives. States that it IS saved; offers the account.
  {
    id: 'status-safety',
    visibleFor: 'all',
    title: {
      authenticated: 'Cloud Saving Active',
      anonymous: 'Your resume is saved',
    },
    content: {
      authenticated: {
        icon: Cloud,
        description:
          'Your resume automatically saves to the cloud as you work. Access your resume from the My Resumes page anytime.',
      },
      anonymous: {
        icon: Check,
        description:
          'Your resume is saved on this device as you type, and stays there — you can close this tab and pick up where you left off. A free account also keeps it in the cloud, so you can open it on another device.',
      },
    },
    ctaButton: {
      text: 'Sign In to sync across devices',
      action: 'sign-in',
      showForAnonymousOnly: true,
    },
  },

  // Step 2: My Resumes Dashboard - Authenticated users only
  {
    id: 'my-resumes',
    visibleFor: 'authenticated',
    title: {
      authenticated: 'Your Dashboard',
    },
    content: {
      authenticated: {
        icon: Library,
        description:
          'Access all your resume versions here. Create tailored resumes for different jobs - we save up to 5 versions.',
      },
    },
  },

  // Step 3: Navigation - Section organization and reordering
  {
    id: 'navigation',
    visibleFor: 'all',
    title: {
      authenticated: 'Organize & Reorder',
    },
    content: {
      authenticated: {
        icon: ArrowUpDown,
        description:
          'Add and reorder sections, entries, and bullet points.\n\nOn desktop, hover an item to reveal the ••• handle, then drag.\nOn mobile, press and hold an item, then drag to reorder.',
      },
    },
  },

  // Step 4: Formatting - Bubble menu for text formatting
  {
    id: 'formatting',
    visibleFor: 'all',
    title: {
      authenticated: 'Quick Formatting',
    },
    content: {
      authenticated: {
        icon: Sparkles,
        description:
          'Select any text to reveal formatting options. Make text bold, italic, underlined, or add hyperlinks anywhere.',
      },
    },
  },

  // Step 5: Export - the finish line. Anonymous copy names the differentiator.
  {
    id: 'export',
    visibleFor: 'all',
    title: {
      authenticated: 'Download PDF',
    },
    content: {
      authenticated: {
        icon: Download,
        description:
          'Ready to apply? Click Download Resume to export a professional PDF. Your formatting and styling transfer perfectly.',
      },
      anonymous: {
        icon: Download,
        description:
          'Ready to apply? Click Download Resume to export a professional PDF — no payment, and no account needed to download it. Signing in is optional: it keeps up to 5 resumes in your account so you can come back and edit them.',
      },
    },
  },
];
