import React, { useState } from "react";
import {
  MdClose,
  MdDragIndicator,
  MdAdd,
  MdMoreVert,
  MdFileDownload,
  MdFileUpload,
  MdRefresh,
  MdHelpOutline,
  MdSupport,
  MdSwapVert,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdCheck
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
  // Reorder mode props
  isReorderModeActive?: boolean;
  onEnterReorderMode?: () => void;
  onCommitReorderMode?: () => void;
  onCancelReorderMode?: () => void;
  onMoveSectionUp?: (index: number) => void;
  onMoveSectionDown?: (index: number) => void;
  canMoveUp?: (index: number) => boolean;
  canMoveDown?: (index: number, total: number) => boolean;
}

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
  // Reorder mode props
  isReorderModeActive = false,
  onEnterReorderMode,
  onCommitReorderMode,
  onCancelReorderMode,
  onMoveSectionUp,
  onMoveSectionDown,
  canMoveUp,
  canMoveDown,
}) => {
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);

  if (!isOpen) return null;

  const handleSectionClick = (index: number) => {
    // In reorder mode, just navigate to section without closing
    if (isReorderModeActive) {
      onSectionClick(index);
      return;
    }
    onSectionClick(index);
    onClose();
  };

  const handleAction = (action: () => void) => {
    action();
    setShowAdvancedMenu(false);
    onClose();
  };

  const handleEnterReorderMode = () => {
    onEnterReorderMode?.();
    setShowAdvancedMenu(false);
  };

  const handleCommitReorder = () => {
    onCommitReorderMode?.();
    onClose();
  };

  const handleCancelReorder = () => {
    onCancelReorderMode?.();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] lg:hidden transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 bottom-0 w-[280px] max-w-[80vw] bg-white z-[9999] lg:hidden shadow-2xl
          animate-slide-in-left flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Section navigation"
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-200 ${
          isReorderModeActive
            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {isReorderModeActive ? (
              <>
                <MdSwapVert className="text-white/80" aria-hidden="true" />
                Reorder Sections
              </>
            ) : (
              <>
                <MdDragIndicator className="text-white/80" aria-hidden="true" />
                Sections
              </>
            )}
          </h2>
          {!isReorderModeActive && (
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close navigation"
            >
              <MdClose className="text-2xl" />
            </button>
          )}
        </div>

        {/* Section List */}
        <nav className="flex-1 overflow-y-auto p-2">
          {/* Contact Info - Always first, not reorderable */}
          {!isReorderModeActive && (
            <button
              onClick={() => handleSectionClick(-1)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all min-h-[48px] flex items-center gap-3
                ${
                  activeSectionIndex === -1
                    ? "bg-blue-50 border-l-4 border-blue-600 text-blue-900 font-semibold"
                    : "hover:bg-gray-100 active:bg-gray-200 text-gray-700"
                }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                i
              </span>
              <span className="flex-1">Contact Information</span>
            </button>
          )}

          {/* Dynamic Sections */}
          {sections.map((section, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 mt-1 ${
                isReorderModeActive && activeSectionIndex === index
                  ? 'bg-amber-50 rounded-lg ring-2 ring-amber-300'
                  : ''
              }`}
            >
              {/* Move buttons - only in reorder mode */}
              {isReorderModeActive && (
                <div className="flex flex-col">
                  <button
                    onClick={() => onMoveSectionUp?.(index)}
                    disabled={!canMoveUp?.(index)}
                    className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Move ${section.name} up`}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <MdKeyboardArrowUp className="text-xl" />
                  </button>
                  <button
                    onClick={() => onMoveSectionDown?.(index)}
                    disabled={!canMoveDown?.(index, sections.length)}
                    className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Move ${section.name} down`}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <MdKeyboardArrowDown className="text-xl" />
                  </button>
                </div>
              )}

              {/* Section button */}
              <button
                onClick={() => handleSectionClick(index)}
                className={`flex-1 text-left px-4 py-3 rounded-lg transition-all min-h-[48px] flex items-center gap-3
                  ${
                    !isReorderModeActive && activeSectionIndex === index
                      ? "bg-blue-50 border-l-4 border-blue-600 text-blue-900 font-semibold"
                      : isReorderModeActive && activeSectionIndex === index
                      ? "text-amber-900 font-semibold"
                      : "hover:bg-gray-100 active:bg-gray-200 text-gray-700"
                  }`}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isReorderModeActive && activeSectionIndex === index
                    ? 'bg-amber-200 text-amber-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}
                </span>
                <span className="flex-1 truncate">{section.name}</span>
              </button>
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 space-y-2">
          {isReorderModeActive ? (
            /* Reorder Mode Footer - Done/Cancel buttons */
            <div className="flex gap-2">
              <button
                onClick={handleCancelReorder}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 active:bg-gray-100 transition-all min-h-[48px]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <MdClose className="text-xl" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleCommitReorder}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg active:scale-95 transition-all min-h-[48px]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <MdCheck className="text-xl" />
                <span>Done</span>
              </button>
            </div>
          ) : (
            /* Normal Mode Footer */
            <>
              {/* Add Section Button */}
              <button
                onClick={() => handleAction(onAddSection)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg active:scale-95 transition-all min-h-[48px]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <MdAdd className="text-xl" />
                <span>Add Section</span>
              </button>

              {/* Advanced Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowAdvancedMenu(!showAdvancedMenu)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 active:bg-gray-100 transition-all min-h-[48px]"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <MdMoreVert className="text-xl" />
                  <span>More Options</span>
                </button>

                {/* Advanced Menu Dropdown */}
                {showAdvancedMenu && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                    {/* Save My Work */}
                    <button
                      onClick={() => handleAction(onExportYAML)}
                      disabled={loadingSave}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 active:bg-blue-100 transition-colors flex items-center gap-3 border-b border-gray-100 disabled:opacity-50"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      {loadingSave ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                      ) : (
                        <MdFileDownload className="text-blue-600 text-xl" />
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
                      className="w-full text-left px-4 py-3 hover:bg-green-50 active:bg-green-100 transition-colors flex items-center gap-3 border-b border-gray-100 disabled:opacity-50"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      {loadingLoad ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-600 border-t-transparent"></div>
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

                    {/* Reorder Sections */}
                    <button
                      onClick={handleEnterReorderMode}
                      disabled={sections.length < 2}
                      className="w-full text-left px-4 py-3 hover:bg-amber-50 active:bg-amber-100 transition-colors flex items-center gap-3 border-b border-gray-100 disabled:opacity-50"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <MdSwapVert className="text-amber-600 text-xl" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Reorder Sections</div>
                        <div className="text-xs text-gray-500">Change section order</div>
                      </div>
                    </button>

                    {/* Start Fresh */}
                    <button
                      onClick={() => handleAction(onStartFresh)}
                      className="w-full text-left px-4 py-3 hover:bg-orange-50 active:bg-orange-100 transition-colors flex items-center gap-3 border-b border-gray-100"
                      style={{ WebkitTapHighlightColor: "transparent" }}
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
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 active:bg-purple-100 transition-colors flex items-center gap-3"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <MdHelpOutline className="text-purple-600 text-xl" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Help</div>
                        <div className="text-xs text-gray-500">Usage guide</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Support Link - Separate Section (hidden in reorder mode) */}
          {!isReorderModeActive && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <Link
                to="/contact"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg active:scale-95 transition-all min-h-[48px]"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <MdSupport className="text-xl" />
                <span>Contact Support</span>
              </Link>
            </div>
          )}
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
