import React, { useEffect, useRef, useState } from "react";
import {
  MdClose,
  MdDragIndicator,
  MdAdd,
  MdMoreVert,
  MdFileDownload,
  MdFileUpload,
  MdRefresh,
  MdHelpOutline,
  MdSupport
} from "react-icons/md";
import { Link } from "react-router-dom";

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

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const getFocusableElements = (container: HTMLElement | null) => {
  if (!container) return [];

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute("disabled") && !element.hidden
  );
};

/**
 * Mobile navigation drawer - slides in from left
 * Shows all resume sections for quick navigation
 * Touch-optimized with 48px minimum touch targets
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
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const focusableElements = getFocusableElements(drawerRef.current);
    (focusableElements[0] ?? drawerRef.current)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const currentFocusableElements = getFocusableElements(drawerRef.current);

      if (currentFocusableElements.length === 0) {
        event.preventDefault();
        drawerRef.current?.focus();
        return;
      }

      const firstElement = currentFocusableElements[0];
      const lastElement = currentFocusableElements[currentFocusableElements.length - 1];
      const activeElement = document.activeElement;

      // Drawer container itself is focused (tabIndex={-1}, e.g. after a tap on a
      // non-interactive area) — wrap explicitly so Shift+Tab can't escape the trap
      if (activeElement === drawerRef.current) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
        return;
      }

      if (!drawerRef.current?.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] lg:hidden transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — max-w-[75vw] ensures it never fills the screen on phones < 375px */}
      <div
        ref={drawerRef}
        className="fixed top-0 left-0 bottom-0 w-[280px] max-w-[75vw] bg-white z-[9999] lg:hidden shadow-lg
          animate-slide-in-left flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Section navigation"
        tabIndex={-1}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-accent">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MdDragIndicator className="text-white/80" aria-hidden="true" />
            Sections
          </h2>
          <button
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
            aria-label="Close navigation"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Section List */}
        <nav className="flex-1 overflow-y-auto p-2">
          {/* Contact Info - Always first */}
          <button
            onClick={() => handleSectionClick(-1)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all min-h-[48px] flex items-center gap-3
              ${
                activeSectionIndex === -1
                  ? "bg-accent/[0.06] ring-1 ring-accent/20 text-ink font-semibold"
                  : "hover:bg-gray-100 active:bg-gray-200 text-gray-700"
              }`}
          >
            <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
              i
            </span>
            <span className="flex-1">Contact Information</span>
          </button>

          {/* Dynamic Sections */}
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => handleSectionClick(index)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all min-h-[48px] flex items-center gap-3 mt-1
                ${
                  activeSectionIndex === index
                    ? "bg-accent/[0.06] ring-1 ring-accent/20 text-ink font-semibold"
                    : "hover:bg-gray-100 active:bg-gray-200 text-gray-700"
                }`}
            >
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="flex-1 truncate">{section.name}</span>
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 space-y-2">
          {/* Add Section Button */}
          <button
            onClick={() => handleAction(onAddSection)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-ink rounded-lg font-medium shadow-sm hover:shadow-md active:scale-[0.98] transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <MdAdd className="text-xl" />
            <span>Add Section</span>
          </button>

          {/* Advanced Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowAdvancedMenu(!showAdvancedMenu)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 active:bg-gray-100 transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <MdMoreVert className="text-xl" />
              <span>More Options</span>
            </button>

            {/* Advanced Menu Dropdown */}
            {showAdvancedMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Save My Work */}
                <button
                  onClick={() => handleAction(onExportYAML)}
                  disabled={loadingSave}
                  className="w-full min-h-11 text-left px-4 py-3 hover:bg-accent/[0.06] active:bg-accent/10 transition-colors flex items-center gap-3 border-b border-gray-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                >
                  {loadingSave ? (
                    <span className="h-2 w-8 overflow-hidden rounded-full bg-accent/20">
                      <span className="block h-full w-1/2 animate-pulse rounded-full bg-accent" />
                    </span>
                  ) : (
                    <MdFileDownload className="text-accent text-xl" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {loadingSave ? "Preparing..." : "Save My Work"}
                    </div>
                    <div className="text-xs text-gray-500">Download YAML file</div>
                  </div>
                </button>

                {/* Load My Work */}
                <button
                  onClick={() => handleAction(onImportYAML)}
                  disabled={loadingLoad}
                  className="w-full min-h-11 text-left px-4 py-3 hover:bg-green-50 active:bg-green-100 transition-colors flex items-center gap-3 border-b border-gray-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                >
                  {loadingLoad ? (
                    <span className="h-2 w-8 overflow-hidden rounded-full bg-green-100">
                      <span className="block h-full w-1/2 animate-pulse rounded-full bg-green-600" />
                    </span>
                  ) : (
                    <MdFileUpload className="text-green-600 text-xl" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {loadingLoad ? "Loading..." : "Load My Work"}
                    </div>
                    <div className="text-xs text-gray-500">Upload YAML file</div>
                  </div>
                </button>

                {/* Start Fresh */}
                <button
                  onClick={() => handleAction(onStartFresh)}
                  className="w-full min-h-11 text-left px-4 py-3 hover:bg-orange-50 active:bg-orange-100 transition-colors flex items-center gap-3 border-b border-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                >
                  <MdRefresh className="text-orange-600 text-xl" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Start Fresh</div>
                    <div className="text-xs text-gray-500">Clear template</div>
                  </div>
                </button>

                {/* Help */}
                <button
                  onClick={() => handleAction(onHelp)}
                  className="w-full min-h-11 text-left px-4 py-3 hover:bg-accent/[0.06] active:bg-accent/10 transition-colors flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                >
                  <MdHelpOutline className="text-accent text-xl" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Help</div>
                    <div className="text-xs text-gray-500">Usage guide</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Support Link - Separate Section */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <Link
              to="/contact"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg active:scale-95 transition-all min-h-[48px]"
            >
              <MdSupport className="text-xl" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
      `}} />
    </>
  );
};

export default MobileNavigationDrawer;
