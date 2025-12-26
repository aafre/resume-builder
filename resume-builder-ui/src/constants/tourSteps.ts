/**
 * Tour Steps Configuration
 *
 * Defines the 5-step onboarding tour with auth-aware content branching.
 * Each step has separate content for authenticated and anonymous users.
 * Now supports conditional visibility and simplified single-message format.
 */

export interface TourStepSimpleContent {
  icon: string;
  description: string;
}

export interface TourStepItem {
  icon: string;
  heading: string;
  description: string;
}

export interface TourStepContent {
  items?: TourStepItem[];           // Legacy multi-item format (optional)
  simpleContent?: TourStepSimpleContent;  // Simple single-message format
}

export interface TourStepBadge {
  text: string;
  type: 'info' | 'warning' | 'success';
  showForAnonymousOnly?: boolean;
}

export interface TourStep {
  id: string;
  targetElementId: string | null; // DOM ID to highlight, null = center modal
  visibleFor?: 'all' | 'authenticated' | 'anonymous';  // Controls step visibility based on auth state
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
  // Step 1: Status & Safety - Warn/reassure users about data persistence
  {
    id: 'status-safety',
    targetElementId: 'header-auth-status',
    visibleFor: 'all',
    title: {
      authenticated: 'Cloud Saving Active',
      anonymous: 'Your Work is Unsaved'
    },
    content: {
      authenticated: {
        simpleContent: {
          icon: '☁️',
          description: 'Your resume automatically saves to the cloud every few seconds. Access your resume from the My Resumes dashboard anytime.'
        }
      },
      anonymous: {
        simpleContent: {
          icon: '⚠️',
          description: 'Your work is not saved. Clear your cache or use a different device and it\'s gone. Sign In for free to keep your resume safe.'
        }
      },
    },
    badge: {
      text: 'Free cloud backup available',
      type: 'warning',
      showForAnonymousOnly: true
    },
    ctaButton: {
      text: 'Enable Free Cloud Saving',
      action: 'sign-in',
      showForAnonymousOnly: true
    }
  },

  // Step 2: My Resumes Dashboard - Authenticated users only
  {
    id: 'my-resumes',
    targetElementId: 'tour-my-resumes-link',
    visibleFor: 'authenticated',
    title: {
      authenticated: 'Your Dashboard',
      anonymous: 'Your Dashboard'
    },
    content: {
      authenticated: {
        simpleContent: {
          icon: '📚',
          description: 'Access all your resume versions here. Create tailored resumes for different jobs - we save up to 5 versions.'
        }
      },
      anonymous: {
        simpleContent: {
          icon: '📚',
          description: 'N/A'
        }
      }
    }
  },

  // Step 3: Navigation - Section sidebar usage
  {
    id: 'navigation',
    targetElementId: 'tour-section-navigator',
    visibleFor: 'all',
    title: {
      authenticated: 'Build Your Sections',
      anonymous: 'Build Your Sections'
    },
    content: {
      authenticated: {
        simpleContent: {
          icon: '🧭',
          description: 'Use the Menu to add new sections, view and jump between sections. Reorder them by dragging on the Editor page.'
        }
      },
      anonymous: {
        simpleContent: {
          icon: '🧭',
          description: 'Use the Menu to add new sections, view and jump between sections. Reorder them by dragging on the Editor page.'
        }
      }
    }
  },

  // Step 4: Formatting - Bubble menu for text formatting
  {
    id: 'formatting',
    targetElementId: 'tour-bubble-menu',
    visibleFor: 'all',
    title: {
      authenticated: 'Quick Formatting',
      anonymous: 'Quick Formatting'
    },
    content: {
      authenticated: {
        simpleContent: {
          icon: '✨',
          description: 'Select any text to reveal formatting options. Make text bold, italic, underlined, or add hyperlinks anywhere.'
        }
      },
      anonymous: {
        simpleContent: {
          icon: '✨',
          description: 'Select any text to reveal formatting options. Make text bold, italic, underlined, or add hyperlinks anywhere.'
        }
      }
    }
  },

  // Step 5: Export - Download PDF
  {
    id: 'export',
    targetElementId: 'tour-download-button',
    visibleFor: 'all',
    title: {
      authenticated: 'Download PDF',
      anonymous: 'Download PDF'
    },
    content: {
      authenticated: {
        simpleContent: {
          icon: '📥',
          description: 'Ready to apply? Click Download Resume to export a professional PDF. Your formatting and styling transfer perfectly.'
        }
      },
      anonymous: {
        simpleContent: {
          icon: '📥',
          description: 'Ready to apply? Click Download Resume to export a professional PDF. Please Login to save your resume for future edits.'
        }
      }
    }
  }
];
