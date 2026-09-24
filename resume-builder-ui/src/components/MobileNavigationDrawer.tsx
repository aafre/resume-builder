import React, { useEffect, useRef, useState } from "react";
// lucide, not react-icons/md: this drawer sat beside IconManager's outline
// icons with Material's filled ones, so one surface carried two stroke
// weights. Brand marks (FcGoogle/FaLinkedin in AuthModal) stay polychrome.
import {
  X,
  Plus,
  MoreVertical,
  Download,
  Upload,
  RotateCcw,
  HelpCircle,
  LifeBuoy,
} from "lucide-react";
import { Link } from "react-router-dom";
import useFocusTrap from "../hooks/useFocusTrap";
import useScrollLock from "../hooks/useScrollLock";

interface Section {
  name: string;
  type?: string;
}

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  onSectionClick: (index: number) => void;
  activeSectionIndex?: number;
  onAddSection: () => void;
  onExportYAML: () => void;
  onImportYAML: () => void;
  onStartFresh: () => void;
  onHelp: () => void;
  loadingSave?: boolean;
  loadingLoad?: boolean;
}

/**
 * Mobile navigation drawer — slides in from the left.
 *
 * This is the mobile counterpart of `SectionNavigator`, and it deliberately
 * borrows that rail's vocabulary rather than inventing its own: the same row
 * shape for sections, the same ghost "Add Section" affordance, the same single
 * "More Options" disclosure holding everything else. If the same action looked
 * like two different controls on two breakpoints, one of them would be wrong.
 *
 * Note what is NOT here: a filled accent control. Download is the conversion
 * action and on mobile it lives in the action bar, not behind a drawer the user
 * has to open. Backing a full-width slab in Signal Green here spent the
 * system's one accent on navigation chrome.
 */
const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  onClose,
  sections,
  onSectionClick,
  activeSectionIndex,
  onAddSection,
  onExportYAML,
  onImportYAML,
  onStartFresh,
  onHelp,
  loadingSave = false,
  loadingLoad = false,
}) => {
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useFocusTrap(isOpen, drawerRef, onClose);

  // aria-modal="true" is a promise that the rest of the page is inert. Measured
  // at 390x844 with the drawer open, the page still scrolled behind it
  // (scrollY 600 -> 1400), so the promise was not being kept.
  useScrollLock(isOpen);

  // The drawer is `lg:hidden`, so widening past the breakpoint hides it without
  // closing it — leaving the focus trap swallowing Tab and the scroll lock held
  // against a panel nobody can see. Close on the breakpoint, not on CSS.
  useEffect(() => {
    if (!isOpen) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (desktop.matches) {
      onCloseRef.current();
      return;
    }
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) onCloseRef.current();
    };
    desktop.addEventListener("change", handleChange);
    return () => desktop.removeEventListener("change", handleChange);
  }, [isOpen]);

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dx < -60 && Math.abs(dx) > Math.abs(dy) * 1.5) onClose();
  };

  if (!isOpen) return null;

  const handleSectionClick = (index: number) => {
    onSectionClick(index);
    onClose();
  };

  const handleAction = (action: () => void) => {
    action();
    setShowAdvancedMenu(false);
    onClose();
  };

  const rowBase =
    "w-full min-h-11 flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-inset";

  const rowState = (isActive: boolean) =>
    isActive
      ? "bg-accent/[0.06] ring-1 ring-accent/20 text-ink font-medium"
      : "text-ink/80 hover:bg-black/5 hover:text-ink";

  const chipState = (isActive: boolean) =>
    isActive ? "bg-accent/10 text-accent-text" : "bg-chalk-dark text-ink/60";

  const optionRow =
    "w-full min-h-11 flex flex-row items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors duration-150 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-inset";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — max-w-[75vw] ensures it never fills the screen on phones < 375px */}
      <div
        ref={drawerRef}
        className="fixed top-0 left-0 bottom-0 w-[280px] max-w-[75vw] bg-white z-[9999] lg:hidden shadow-xl
          animate-slide-in-left flex flex-col"
        style={{ animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Section navigation"
        tabIndex={-1}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header.
            The 6-dot drag grip that used to sit beside this title promised a
            draggable sheet. This is a left slide-over with no drag gesture at
            all, so the affordance was writing a cheque the component could not
            cash. Removed rather than faked. */}
        <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-3 border-b border-gray-200/60 bg-chalk">
          <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-ink/60">
            Sections
          </h2>
          <button
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center p-2 text-ink/60 hover:text-ink hover:bg-white rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
            aria-label="Close navigation"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Section list — Contact Information is item 1, not an unnumbered "i"
            sitting above a 1-6 list. It is a section of the document like any
            other; numbering it apart made one list read as two. */}
        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-clip p-3">
          <button
            onClick={() => handleSectionClick(-1)}
            className={`${rowBase} ${rowState(activeSectionIndex === -1)}`}
          >
            <span
              className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-xs font-semibold ${chipState(
                activeSectionIndex === -1
              )}`}
              aria-hidden="true"
            >
              1
            </span>
            <span className="flex-1 text-[13px]">Contact Information</span>
          </button>

          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => handleSectionClick(index)}
              title={section.name}
              aria-label={section.name}
              className={`${rowBase} mt-0.5 ${rowState(activeSectionIndex === index)}`}
            >
              <span
                className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-xs font-semibold ${chipState(
                  activeSectionIndex === index
                )}`}
                aria-hidden="true"
              >
                {index + 2}
              </span>
              <span className="flex-1 text-[13px] truncate">{section.name}</span>
            </button>
          ))}
        </nav>

        {/* Actions — the same tiers the rail uses: the ghost Add affordance,
            then one disclosure holding everything else. */}
        <div className="shrink-0 p-3 border-t border-gray-200/60 bg-white safe-area-inset-bottom">
          <button
            onClick={() => handleAction(onAddSection)}
            title="Add a new section"
            className="btn-ghost-add"
          >
            <Plus size={16} aria-hidden="true" />
            <span className="text-[13px]">Add Section</span>
          </button>

          <div className="relative mt-2">
            <button
              onClick={() => setShowAdvancedMenu(!showAdvancedMenu)}
              aria-expanded={showAdvancedMenu}
              aria-haspopup="menu"
              className="w-full min-h-11 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-ink/80 transition-colors duration-150 hover:bg-black/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
            >
              <MoreVertical size={16} aria-hidden="true" />
              <span>More Options</span>
            </button>

            {/* Every row here is neutral chrome. They used to render in four
                unrelated hues — accent, stone, orange, accent — with nothing
                semantic behind the difference. The one exception stays
                semantic: Start Fresh discards the user's work, so it turns red
                on hover. */}
            {showAdvancedMenu && (
              <div
                role="menu"
                className="absolute bottom-full left-0 right-0 z-10 mb-2 rounded-xl border border-gray-200 bg-white p-1 shadow-xl"
              >
                <button
                  role="menuitem"
                  onClick={() => handleAction(onExportYAML)}
                  disabled={loadingSave}
                  className={`${optionRow} text-ink hover:bg-black/5`}
                >
                  {loadingSave ? (
                    <span className="h-2 w-10 shrink-0 overflow-clip rounded-full bg-ink/15">
                      <span className="block h-full w-1/2 animate-pulse rounded-full bg-ink/60" />
                    </span>
                  ) : (
                    <Download size={16} className="text-ink/60 shrink-0" aria-hidden="true" />
                  )}
                  <span className="flex flex-col items-start">
                    <span className="text-[13px]">
                      {loadingSave ? "Saving..." : "Save My Work"}
                    </span>
                    <span className="text-[11px] leading-tight text-ink/60">
                      Download YAML file
                    </span>
                  </span>
                </button>

                <button
                  role="menuitem"
                  onClick={() => handleAction(onImportYAML)}
                  disabled={loadingLoad}
                  className={`${optionRow} text-ink hover:bg-black/5`}
                >
                  {loadingLoad ? (
                    <span className="h-2 w-10 shrink-0 overflow-clip rounded-full bg-ink/15">
                      <span className="block h-full w-1/2 animate-pulse rounded-full bg-ink/60" />
                    </span>
                  ) : (
                    <Upload size={16} className="text-ink/60 shrink-0" aria-hidden="true" />
                  )}
                  <span className="flex flex-col items-start">
                    <span className="text-[13px]">
                      {loadingLoad ? "Loading..." : "Load My Work"}
                    </span>
                    <span className="text-[11px] leading-tight text-ink/60">
                      Upload YAML file
                    </span>
                  </span>
                </button>

                <button
                  role="menuitem"
                  onClick={() => handleAction(onStartFresh)}
                  className={`${optionRow} text-ink hover:bg-red-50 hover:text-red-800`}
                >
                  <RotateCcw size={16} className="text-ink/60 shrink-0" aria-hidden="true" />
                  <span className="flex flex-col items-start">
                    <span className="text-[13px]">Start Fresh</span>
                    <span className="text-[11px] leading-tight text-ink/60">
                      Clear and start over
                    </span>
                  </span>
                </button>

                <button
                  role="menuitem"
                  onClick={() => handleAction(onHelp)}
                  className={`${optionRow} text-ink hover:bg-black/5`}
                >
                  <HelpCircle size={16} className="text-ink/60 shrink-0" aria-hidden="true" />
                  <span className="flex flex-col items-start">
                    <span className="text-[13px]">Help &amp; Tips</span>
                    <span className="text-[11px] leading-tight text-ink/60">Usage guide</span>
                  </span>
                </button>

                {/* Contact Support lives inside the disclosure, as it does on
                    the rail. As a standalone full-width button it read as a peer
                    of Add Section, which it is not. */}
                <Link
                  role="menuitem"
                  to="/contact"
                  onClick={onClose}
                  className={`${optionRow} text-ink hover:bg-black/5`}
                >
                  <LifeBuoy size={16} className="text-ink/60 shrink-0" aria-hidden="true" />
                  <span className="flex flex-col items-start">
                    <span className="text-[13px]">Contact Support</span>
                    <span className="text-[11px] leading-tight text-ink/60">Ask a question</span>
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigationDrawer;
