/**
 * Tour Steps Configuration
 *
 * Defines the 5-step onboarding tour with auth-aware content branching.
 * Each step has separate content for authenticated and anonymous users.
 */

export interface TourStepItem {
  icon: string;
  heading: string;
  description: string;
}

export interface TourStepContent {
  items: TourStepItem[];
}

export interface TourStepBadge {
  text: string;
  type: 'info' | 'warning' | 'success';
  showForAnonymousOnly?: boolean;
}

export interface TourStep {
  id: string;
  targetElementId: string | null; // DOM ID to highlight, null = center modal
  title: {
    authenticated: string;
    anonymous: string;
  };
  content: {
    authenticated: TourStepContent;
    anonymous: TourStepContent;
  };
  badge?: TourStepBadge;
  ctaButton?: {
    text: string;
    action: 'sign-in';
    showForAnonymousOnly: boolean;
  };
}

export const TOUR_STEPS: TourStep[] = [
  // Step 1: Welcome & Value Prop
  {
    id: 'welcome',
    targetElementId: null, // Center modal, no specific target
    title: {
      authenticated: 'Welcome to Your Professional Workspace',
      anonymous: 'Welcome to Your Professional Workspace'
    },
    content: {
      authenticated: {
        items: [
          {
            icon: '☁️',
            heading: 'Cloud Auto-Save',
            description: 'Your work is automatically saved to the cloud every few seconds. Access it from any device.'
          },
          {
            icon: '🎯',
            heading: 'ATS-Optimized Templates',
            description: 'Our templates are designed to pass Applicant Tracking Systems used by top companies.'
          },
          {
            icon: '⚡',
            heading: 'Fast & Professional',
            description: 'Create a polished resume in minutes. We handle the formatting, you handle the content.'
          }
        ]
      },
      anonymous: {
        items: [
          {
            icon: '🎯',
            heading: 'Build Professional Resumes',
            description: 'Create ATS-optimized resumes with our modern templates in just minutes.'
          },
          {
            icon: '⚡',
            heading: 'Fast & Easy',
            description: 'We handle the formatting and styling. You focus on showcasing your experience.'
          },
          {
            icon: '📄',
            heading: 'Export as PDF',
            description: 'Download your resume as a professional PDF ready to send to employers.'
          }
        ]
      }
    },
    badge: {
      text: 'Pro Tip: Sign up to save your progress permanently',
      type: 'info',
      showForAnonymousOnly: true
    }
  },

  // Step 2: Navigation & Sections
  {
    id: 'navigation',
    targetElementId: 'tour-section-navigator',
    title: {
      authenticated: 'Navigate with Ease',
      anonymous: 'Navigate with Ease'
    },
    content: {
      authenticated: {
        items: [
          {
            icon: '🧭',
            heading: 'Quick Section Jumping',
            description: 'Click any section in the sidebar to jump directly to it. Perfect for long resumes.'
          },
          {
            icon: '🔄',
            heading: 'Drag to Reorder',
            description: 'Reorder sections by dragging and dropping. Customize your resume structure.'
          },
          {
            icon: '⌨️',
            heading: 'Keyboard Shortcut',
            description: 'Press Ctrl+\\ to quickly toggle the sidebar on desktop.'
          }
        ]
      },
      anonymous: {
        items: [
          {
            icon: '🧭',
            heading: 'Quick Section Jumping',
            description: 'Use the sidebar (desktop) or bottom navigation (mobile) to jump between sections.'
          },
          {
            icon: '🔄',
            heading: 'Drag to Reorder',
            description: 'Reorder sections by dragging and dropping them to customize your resume structure.'
          },
          {
            icon: '📱',
            heading: 'Mobile Friendly',
            description: 'The editor works great on tablets and phones with touch-optimized controls.'
          }
        ]
      }
    }
  },

  // Step 3: Formatting Magic
  {
    id: 'formatting',
    targetElementId: 'tour-bubble-menu', // Only visible when text selected
    title: {
      authenticated: 'Format Like a Pro',
      anonymous: 'Format Like a Pro'
    },
    content: {
      authenticated: {
        items: [
          {
            icon: '✨',
            heading: 'Bubble Menu',
            description: 'Select any text to see the formatting menu. Make text bold, italic, underlined, or add links.'
          },
          {
            icon: '🔗',
            heading: 'Add Hyperlinks',
            description: 'Link to your portfolio, GitHub, LinkedIn, or any other relevant URL.'
          },
          {
            icon: '💾',
            heading: 'Auto-Saved',
            description: 'All formatting changes are automatically saved to the cloud. No need to click save!'
          }
        ]
      },
      anonymous: {
        items: [
          {
            icon: '✨',
            heading: 'Bubble Menu',
            description: 'Select any text to reveal the formatting toolbar. Make text bold, italic, or underlined.'
          },
          {
            icon: '🔗',
            heading: 'Add Hyperlinks',
            description: 'Link to your portfolio, GitHub, LinkedIn, or any other professional URL.'
          },
          {
            icon: '🎨',
            heading: 'Professional Styling',
            description: 'Formatting is preserved when you export to PDF. What you see is what you get.'
          }
        ]
      }
    }
  },

  // Step 4: Saving & Security (CRITICAL - Auth-Aware)
  {
    id: 'saving',
    targetElementId: null, // Center modal for important message
    title: {
      authenticated: 'Auto-Saved to Cloud',
      anonymous: 'Don\'t Lose Your Work'
    },
    content: {
      authenticated: {
        items: [
          {
            icon: '✅',
            heading: 'Saved Every Few Seconds',
            description: 'Your resume is automatically backed up to the cloud as you type. Never lose progress.'
          },
          {
            icon: '🔒',
            heading: 'Bank-Level Encryption',
            description: 'Your data is encrypted with AES-256 and stored securely via Supabase.'
          },
          {
            icon: '🌐',
            heading: 'Access Anywhere',
            description: 'Edit your resume from any device. Your work syncs across desktop, tablet, and mobile.'
          }
        ]
      },
      anonymous: {
        items: [
          {
            icon: '⚠️',
            heading: 'Local Storage Only',
            description: 'Your work is currently saved in your browser cache. Clearing your browser data will delete it.'
          },
          {
            icon: '📁',
            heading: 'Manual Backup Required',
            description: 'Click "Backup to File" in the sidebar to download a copy to your computer.'
          },
          {
            icon: '🔐',
            heading: 'Recommended: Create Account',
            description: 'Sign up for free to save your resume securely in the cloud with automatic backups.'
          }
        ]
      }
    },
    badge: {
      text: 'Your data is safe and private',
      type: 'success',
      showForAnonymousOnly: false
    },
    ctaButton: {
      text: 'Save to Cloud (Free Account)',
      action: 'sign-in',
      showForAnonymousOnly: true
    }
  },

  // Step 5: Export & My Resumes
  {
    id: 'export',
    targetElementId: 'tour-my-resumes-link',
    title: {
      authenticated: 'Export & Manage Resumes',
      anonymous: 'Export Your Resume'
    },
    content: {
      authenticated: {
        items: [
          {
            icon: '📥',
            heading: 'Download as PDF',
            description: 'Export your resume as a professional PDF ready to send to employers.'
          },
          {
            icon: '📚',
            heading: 'My Resumes Dashboard',
            description: 'Manage up to 5 resumes in your dashboard. Create variations for different roles.'
          },
          {
            icon: '🖼️',
            heading: 'Live Preview',
            description: 'Click "Preview PDF" to see exactly how your resume will look before downloading.'
          }
        ]
      },
      anonymous: {
        items: [
          {
            icon: '📥',
            heading: 'Download as PDF',
            description: 'When you\'re ready, click "Download Resume" to export a professional PDF.'
          },
          {
            icon: '🔑',
            heading: 'Unlock My Resumes',
            description: 'Sign up for free to save multiple resume versions and access them from any device.'
          },
          {
            icon: '🖼️',
            heading: 'Live Preview',
            description: 'Click "Preview PDF" anytime to see how your resume will look before downloading.'
          }
        ]
      }
    }
  }
];
