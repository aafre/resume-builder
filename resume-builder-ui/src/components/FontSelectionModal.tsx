import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MdClose, MdCheck } from 'react-icons/md';

// Font groups matching DocumentSettingsPanel categories
const FONT_GROUPS = [
  {
    key: 'professional',
    label: 'Professional',
    sublabel: 'Sans Serif',
    fonts: ['Source Sans 3', 'IBM Plex Sans', 'DM Sans', 'Plus Jakarta Sans'],
  },
  {
    key: 'modern',
    label: 'Modern',
    sublabel: 'Serif',
    fonts: ['EB Garamond', 'Source Serif 4', 'Crimson Pro', 'Newsreader', 'Playfair Display'],
  },
  {
    key: 'classic',
    label: 'Classic',
    sublabel: 'System',
    fonts: ['Arial', 'Calibri', 'Cambria', 'Georgia', 'Tahoma', 'Times New Roman'],
  },
] as const;

// Google Fonts that need to be loaded (classic/system fonts don't need loading)
const GOOGLE_FONTS = [
  'Source+Sans+3:wght@400;700',
  'IBM+Plex+Sans:wght@400;700',
  'DM+Sans:wght@400;700',
  'Plus+Jakarta+Sans:wght@400;700',
  'EB+Garamond:wght@400;700',
  'Source+Serif+4:wght@400;700',
  'Crimson+Pro:wght@400;700',
  'Newsreader:wght@400;700',
  'Playfair+Display:wght@400;700',
];

const GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map(f => `family=${f}`).join('&')}&display=swap`;
const LINK_ID = 'font-modal-google-fonts';

interface FontSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFont: string;
  onFontSelect: (font: string) => void;
}

const SAMPLE_HEADING = 'Professional Experience';
const SAMPLE_BODY = 'Developed and maintained scalable web applications serving 50,000+ users daily.';

const FontSelectionModal: React.FC<FontSelectionModalProps> = ({
  isOpen,
  onClose,
  currentFont,
  onFontSelect,
}) => {
  // Find which tab the current font belongs to
  const getInitialTab = () => {
    for (const group of FONT_GROUPS) {
      if ((group.fonts as readonly string[]).includes(currentFont)) {
        return group.key;
      }
    }
    return 'professional';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Load Google Fonts on first open
  useEffect(() => {
    if (!isOpen) return;

    // Check if already injected
    if (document.getElementById(LINK_ID)) {
      setFontsLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.id = LINK_ID;
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);

    // Wait for fonts to load
    link.onload = () => {
      document.fonts.ready.then(() => setFontsLoaded(true));
    };

    // Fallback: set loaded after 3s even if fonts fail
    const fallbackTimer = setTimeout(() => setFontsLoaded(true), 3000);

    return () => clearTimeout(fallbackTimer);
  }, [isOpen]);

  // Reset tab when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab(getInitialTab());
    }
  }, [isOpen, currentFont]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus the dialog after a tick so animation can start
      requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSelect = useCallback((font: string) => {
    onFontSelect(font);
    onClose();
  }, [onFontSelect, onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  const activeGroup = FONT_GROUPS.find(g => g.key === activeTab) || FONT_GROUPS[0];
  const isClassicTab = activeTab === 'classic';

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end lg:items-center justify-center z-[9999] p-0 lg:p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="font-modal-title"
        className="bg-white w-full lg:max-w-2xl lg:rounded-2xl rounded-t-2xl max-h-[85vh] lg:max-h-[80vh] flex flex-col shadow-2xl animate-[slideUp_0.3s_ease-out] lg:animate-[fadeScale_0.2s_ease-out] outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/80 flex-shrink-0">
          <div>
            <h2 id="font-modal-title" className="text-lg font-bold text-ink">
              Choose a Font
            </h2>
            <p className="text-xs text-stone-warm mt-0.5">
              Select a typeface for your resume
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-800"
            aria-label="Close font picker"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-5 pt-4 pb-2 flex-shrink-0">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {FONT_GROUPS.map((group) => (
              <button
                key={group.key}
                type="button"
                onClick={() => setActiveTab(group.key)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  activeTab === group.key
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <span className="block">{group.label}</span>
                <span className="block text-[10px] font-normal text-gray-400 mt-0.5">
                  {group.sublabel}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Grid */}
        <div className="flex-1 overflow-y-auto px-5 py-3 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeGroup.fonts.map((font) => {
              const isSelected = font === currentFont;
              const showSkeleton = !isClassicTab && !fontsLoaded;

              return (
                <button
                  key={font}
                  type="button"
                  onClick={() => handleSelect(font)}
                  className={`group relative text-left rounded-xl border-2 overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 ${
                    isSelected
                      ? 'border-accent ring-2 ring-accent/20 bg-accent/[0.04]'
                      : 'border-gray-200 hover:border-accent/50 hover:shadow-md hover:bg-gray-50/50'
                  }`}
                >
                  {/* Selected badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                      <MdCheck className="text-white text-sm" />
                    </div>
                  )}

                  <div className="p-4">
                    {/* Font name */}
                    <div className="mb-3">
                      {showSkeleton ? (
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <h3
                          className="text-base font-bold text-ink truncate pr-8"
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </h3>
                      )}
                      <span className="text-[10px] text-mist uppercase tracking-wider mt-1 block">
                        {activeGroup.sublabel}
                      </span>
                    </div>

                    {/* Sample text */}
                    <div className="space-y-1.5 border-t border-gray-100 pt-3">
                      {showSkeleton ? (
                        <>
                          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                          <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                          <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                        </>
                      ) : (
                        <>
                          <p
                            className="text-sm font-bold text-ink/80 leading-snug"
                            style={{ fontFamily: font }}
                          >
                            {SAMPLE_HEADING}
                          </p>
                          <p
                            className="text-xs text-stone-warm leading-relaxed line-clamp-2"
                            style={{ fontFamily: font }}
                          >
                            {SAMPLE_BODY}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200/80 flex-shrink-0 bg-gray-50/50">
          <p className="text-xs text-center text-mist">
            Currently using: <span className="font-medium text-ink/70" style={{ fontFamily: currentFont }}>{currentFont}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontSelectionModal;
