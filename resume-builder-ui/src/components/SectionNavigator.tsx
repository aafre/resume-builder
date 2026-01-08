import React, { useState, useEffect, useRef } from "react";
import {
  MdAdd,
  MdFileDownload,
  MdFileUpload,
  MdRefresh,
  MdHelpOutline,
  MdPerson,
  MdWork,
  MdSchool,
  MdStar,
  MdList,
  MdMenu,
  MdFormatListBulleted,
  MdViewColumn,
  MdTextFields,
  MdBadge,
  MdCode,
  MdBuild,
  MdLanguage,
  MdVolunteerActivism,
  MdEmojiEvents,
  MdDescription,
  MdVisibility,
  MdSupport,
  MdSwapVert,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdCheck,
  MdClose,
} from "react-icons/md";
import { Link } from "react-router-dom";

interface Section {
  name: string;
  type?: string;
}

interface SectionNavigatorProps {
  sections: Section[];
  onSectionClick: (index: number) => void;
  activeSectionIndex?: number;
  onAddSection: () => void;
  onDownloadResume: () => void;
  onPreviewResume?: () => void;
  onExportYAML: () => void;
  onImportYAML: () => void;
  onStartFresh: () => void;
  onHelp: () => void;
  isGenerating?: boolean;
  isGeneratingPreview?: boolean;
  previewIsStale?: boolean;
  loadingSave?: boolean;
  loadingLoad?: boolean;
  onCollapseChange?: (isCollapsed: boolean) => void;
  isAnonymous?: boolean;
  isAuthenticated?: boolean;
  // Reorder mode props
  isReorderModeActive?: boolean;
  hasUnsavedReorderChanges?: boolean;
  onEnterReorderMode?: () => void;
  onCancelReorderMode?: () => void;
  onCommitReorderMode?: () => void;
  onMoveSectionUp?: (index: number) => void;
  onMoveSectionDown?: (index: number) => void;
  canMoveUp?: (index: number) => boolean;
  canMoveDown?: (index: number, total: number) => boolean;
}

const STORAGE_KEY = "resume-builder-sidebar-collapsed";

/**
 * YouTube-style collapsible sidebar navigator
 * Positioned below the header, full height minus header
 * Expanded: Full labels with icons
 * Collapsed: Icons with short labels (like YouTube sidebar)
 */
const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  sections,
  onSectionClick,
  activeSectionIndex,
  onAddSection,
  onDownloadResume,
  onPreviewResume,
  onExportYAML,
  onImportYAML,
  onStartFresh,
  onHelp,
  isGenerating,
  isGeneratingPreview,
  previewIsStale,
  loadingSave,
  loadingLoad,
  onCollapseChange,
  isAnonymous = false,
  isAuthenticated = false,
  // Reorder mode props
  isReorderModeActive = false,
  hasUnsavedReorderChanges = false,
  onEnterReorderMode,
  onCancelReorderMode,
  onCommitReorderMode,
  onMoveSectionUp,
  onMoveSectionDown,
  canMoveUp,
  canMoveDown,
}) => {
  // Load initial state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "true";
  });

  // Track header and footer heights dynamically
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const sidebarRef = useRef<HTMLElement>(null);

  // Calculate header and footer heights on mount and resize
  useEffect(() => {
    const calculateHeights = () => {
      // Find the header element
      const header = document.querySelector("header");
      const devBanner = document.querySelector('[class*="bg-red-600"]');
      const footer = document.querySelector("footer.fixed");

      let totalHeaderHeight = 0;

      if (devBanner && devBanner instanceof HTMLElement) {
        totalHeaderHeight += devBanner.offsetHeight;
      }

      if (header && header instanceof HTMLElement) {
        totalHeaderHeight += header.offsetHeight;
      }

      // Get footer height (only when visible/at bottom)
      let footerH = 0;
      if (footer && footer instanceof HTMLElement) {
        footerH = footer.offsetHeight;
      }

      // Fallback to reasonable defaults if elements not found
      setHeaderHeight(totalHeaderHeight || 72);
      setFooterHeight(footerH || 60); // Default footer height
    };

    calculateHeights();

    // Recalculate on resize
    window.addEventListener("resize", calculateHeights);

    // Also observe for DOM changes (e.g., banner visibility, footer visibility)
    const observer = new MutationObserver(calculateHeights);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener("resize", calculateHeights);
      observer.disconnect();
    };
  }, []);

  // Notify parent of initial state
  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, []);

  // Persist preference to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  // Keyboard shortcut: Ctrl+\ to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "\\") {
        e.preventDefault();
        handleToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCollapsed]);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState);
  };

  // Handle Start Fresh - confirmation dialog is handled by parent (Editor.tsx)
  const handleStartFresh = () => {
    onStartFresh();
  };

  // Get icon for section based on type or name
  const getSectionIcon = (section: Section) => {
    const type = section.type?.toLowerCase() || "";
    const name = section.name.toLowerCase();

    // First check by section type (most accurate)
    if (type === "experience") {
      return <MdWork className="text-base" />;
    }
    if (type === "education") {
      return <MdSchool className="text-base" />;
    }
    if (type === "bulleted-list") {
      return <MdFormatListBulleted className="text-base" />;
    }
    if (type === "inline-list") {
      return <MdList className="text-base" />;
    }
    if (type === "dynamic-column-list") {
      return <MdViewColumn className="text-base" />;
    }
    if (type === "icon-list") {
      return <MdBadge className="text-base" />;
    }
    if (type === "text") {
      return <MdTextFields className="text-base" />;
    }

    // Then check by section name for additional context
    if (name.includes("experience") || name.includes("work") || name.includes("employment")) {
      return <MdWork className="text-base" />;
    }
    if (name.includes("education") || name.includes("school") || name.includes("academic")) {
      return <MdSchool className="text-base" />;
    }
    if (name.includes("certification") || name.includes("certificate")) {
      return <MdBadge className="text-base" />;
    }
    if (name.includes("award") || name.includes("honor") || name.includes("achievement")) {
      return <MdEmojiEvents className="text-base" />;
    }
    if (name.includes("skill") || name.includes("technical") || name.includes("competenc")) {
      return <MdBuild className="text-base" />;
    }
    if (name.includes("project") || name.includes("portfolio")) {
      return <MdCode className="text-base" />;
    }
    if (name.includes("language")) {
      return <MdLanguage className="text-base" />;
    }
    if (name.includes("volunteer") || name.includes("community")) {
      return <MdVolunteerActivism className="text-base" />;
    }
    if (name.includes("summary") || name.includes("objective") || name.includes("profile") || name.includes("statement")) {
      return <MdDescription className="text-base" />;
    }
    if (name.includes("personal") || name.includes("interest") || name.includes("hobby")) {
      return <MdStar className="text-base" />;
    }

    // Default fallback
    return <MdList className="text-base" />;
  };

  // Get short label for collapsed state
  const getShortLabel = (section: Section): string => {
    const name = section.name.toLowerCase();

    // Check more specific patterns first, then broader ones
    if (name.includes("contact")) return "Contact";
    if (name.includes("professional summary") || name.includes("summary") || name.includes("objective")) return "Summary";
    if (name.includes("professional qual") || name.includes("qualification")) return "Quals";
    if (name.includes("key skill") || name.includes("skill") || name.includes("technical")) return "Skills";
    if (name.includes("experience") || name.includes("work") || name.includes("employment")) return "Work";
    if (name.includes("education") || name.includes("school") || name.includes("academic")) return "Edu";
    if (name.includes("certification") || name.includes("certificate")) return "Certs";
    if (name.includes("personal") || name.includes("interest") || name.includes("hobby")) return "Personal";
    if (name.includes("project") || name.includes("portfolio")) return "Projects";
    if (name.includes("award") || name.includes("honor")) return "Awards";
    if (name.includes("language")) return "Lang";
    if (name.includes("volunteer")) return "Volunteer";

    // Truncate to first word or first 8 chars
    const firstWord = section.name.split(" ")[0];
    return firstWord.length > 8 ? firstWord.substring(0, 7) + "." : firstWord;
  };

  return (
    <nav
      ref={sidebarRef}
      className={`hidden lg:flex flex-col fixed right-0 bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden z-[45] transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-[280px]"
      } ${
        isReorderModeActive
          ? "border-l-4 border-blue-500 ring-2 ring-blue-500/20"
          : "border-l border-gray-200/80"
      }`}
      style={{
        top: `${headerHeight}px`,
        bottom: `${footerHeight}px`
      }}
      aria-label="Section navigation and actions"
    >
      {/* Toggle Button - Top of sidebar with subtle border */}
      <div className={`flex items-center justify-between px-3 py-3 border-b border-gray-200/60 ${
        isReorderModeActive ? "bg-blue-50/80" : "bg-gray-50/50"
      }`}>
        {!isCollapsed && (
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            isReorderModeActive ? "text-blue-700" : "text-gray-600"
          }`}>
            {isReorderModeActive ? "Reorder Mode" : "Navigator"}
          </span>
        )}
        <button
          onClick={handleToggle}
          className={`p-2 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-gray-800 hover:shadow-sm ${
            isCollapsed ? "mx-auto" : ""
          }`}
          aria-label={isCollapsed ? "Expand sidebar (Ctrl+\\)" : "Collapse sidebar (Ctrl+\\)"}
          title={isCollapsed ? "Expand (Ctrl+\\)" : "Collapse (Ctrl+\\)"}
        >
          <MdMenu className="text-lg" />
        </button>
      </div>

      {/* Sections Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className={`${isCollapsed ? "py-3 px-1.5" : "p-3"}`} id="tour-section-navigator">
          {!isCollapsed && (
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Sections
            </h2>
          )}

          {/* Contact Info */}
          <button
            onClick={() => onSectionClick(-1)}
            className={`w-full flex items-center transition-all rounded-lg group ${
              isCollapsed
                ? "flex-col gap-1.5 py-2.5 px-1.5 hover:bg-blue-50/80"
                : "flex-row gap-3 px-3 py-2.5 hover:bg-gray-100/80"
            } ${
              activeSectionIndex === -1
                ? isCollapsed
                  ? "bg-blue-50 text-blue-700"
                  : "bg-blue-50/80 border-l-[3px] border-blue-600 text-blue-800 font-medium"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <div
              className={`flex items-center justify-center ${
                isCollapsed ? "w-7 h-7" : "w-6 h-6"
              } rounded-md ${
                activeSectionIndex === -1
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100/80 text-gray-500 group-hover:bg-gray-200/80 group-hover:text-gray-700"
              }`}
            >
              <MdPerson className="text-base" />
            </div>
            <span
              className={`${
                isCollapsed
                  ? "text-[11px] font-medium text-center leading-tight"
                  : "text-[13px] flex-1 text-left"
              }`}
            >
              {isCollapsed ? "Contact" : "Contact Information"}
            </span>
          </button>

          {/* Dynamic Sections */}
          {sections.map((section, index) => (
            <div
              key={index}
              className={`flex items-center ${isCollapsed ? "flex-col mt-1" : "mt-0.5"}`}
            >
              {/* Reorder mode: Up button (expanded only) */}
              {isReorderModeActive && !isCollapsed && onMoveSectionUp && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSectionUp(index);
                  }}
                  disabled={canMoveUp ? !canMoveUp(index) : index === 0}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label={`Move ${section.name} up`}
                  title="Move up"
                >
                  <MdKeyboardArrowUp className="text-lg" />
                </button>
              )}

              <button
                onClick={() => !isReorderModeActive && onSectionClick(index)}
                className={`flex-1 flex items-center transition-all rounded-lg group ${
                  isCollapsed
                    ? "flex-col gap-1.5 py-2.5 px-1.5 hover:bg-blue-50/80"
                    : "flex-row gap-3 px-3 py-2.5 hover:bg-gray-100/80"
                } ${
                  activeSectionIndex === index
                    ? isCollapsed
                      ? "bg-blue-50 text-blue-700"
                      : "bg-blue-50/80 border-l-[3px] border-blue-600 text-blue-800 font-medium"
                    : "text-gray-700 hover:text-gray-900"
                } ${isReorderModeActive ? "cursor-default" : "cursor-pointer"}`}
              >
                <div
                  className={`flex items-center justify-center ${
                    isCollapsed ? "w-7 h-7" : "w-6 h-6"
                  } rounded-md ${
                    activeSectionIndex === index
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100/80 text-gray-500 group-hover:bg-gray-200/80 group-hover:text-gray-700"
                  }`}
                >
                  {getSectionIcon(section)}
                </div>
                <span
                  className={`${
                    isCollapsed
                      ? "text-[11px] font-medium text-center leading-tight"
                      : "text-[13px] flex-1 truncate text-left"
                  }`}
                  title={section.name}
                >
                  {isCollapsed ? getShortLabel(section) : section.name}
                </span>
              </button>

              {/* Reorder mode: Down button (expanded only) */}
              {isReorderModeActive && !isCollapsed && onMoveSectionDown && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSectionDown(index);
                  }}
                  disabled={canMoveDown ? !canMoveDown(index, sections.length) : index === sections.length - 1}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label={`Move ${section.name} down`}
                  title="Move down"
                >
                  <MdKeyboardArrowDown className="text-lg" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions Section - Fixed at bottom */}
      <div className={`border-t bg-gradient-to-t from-gray-50/80 to-white ${
        isReorderModeActive ? "border-blue-200" : "border-gray-200/60"
      }`}>
        <div className={`${isCollapsed ? "py-3 px-2" : "p-4"}`}>
          {!isCollapsed && (
            <h3 className={`text-[11px] font-semibold uppercase tracking-wider mb-3 px-1 ${
              isReorderModeActive ? "text-blue-600" : "text-gray-500"
            }`}>
              {isReorderModeActive ? "Reorder Actions" : "Actions"}
            </h3>
          )}

          {/* Reorder Mode: Done + Cancel buttons */}
          {isReorderModeActive ? (
            <>
              {/* Done button (commits reorder) */}
              {onCommitReorderMode && (
                <button
                  onClick={onCommitReorderMode}
                  className={`w-full flex items-center justify-center bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-emerald-500 hover:to-green-500 transition-all active:scale-[0.98] ${
                    isCollapsed
                      ? "flex-col gap-1 py-2.5 px-1 mb-2"
                      : "flex-row gap-2 px-4 py-2.5 mb-2.5"
                  }`}
                >
                  <MdCheck className={isCollapsed ? "text-lg" : "text-base"} />
                  <span className={isCollapsed ? "text-[10px] leading-tight font-medium" : "text-[13px]"}>
                    {isCollapsed ? "Done" : hasUnsavedReorderChanges ? "Save Order" : "Done"}
                  </span>
                </button>
              )}

              {/* Cancel button (reverts reorder) */}
              {onCancelReorderMode && (
                <button
                  onClick={onCancelReorderMode}
                  className={`w-full flex items-center justify-center bg-gray-100 text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md hover:bg-gray-200 transition-all active:scale-[0.98] ${
                    isCollapsed
                      ? "flex-col gap-1 py-2 px-1"
                      : "flex-row gap-2 px-4 py-2"
                  }`}
                >
                  <MdClose className={isCollapsed ? "text-base" : "text-base"} />
                  <span className={isCollapsed ? "text-[10px] leading-tight font-medium" : "text-[13px]"}>
                    Cancel
                  </span>
                </button>
              )}

              {/* Tip text in expanded mode */}
              {!isCollapsed && (
                <p className="text-xs text-gray-500 mt-3 px-1 text-center">
                  Use ▲/▼ buttons to reorder sections
                </p>
              )}
            </>
          ) : (
            <>
              {/* Primary Action: Preview PDF */}
              {onPreviewResume && (
                <button
                  id="tour-preview-button"
                  onClick={onPreviewResume}
                  disabled={isGeneratingPreview}
                  className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] relative ${
                    isCollapsed
                      ? "flex-col gap-1 py-2.5 px-1 mb-2"
                      : "flex-row gap-2 px-4 py-2.5 mb-2.5"
                  }`}
                >
                  {/* Staleness indicator badge */}
                  {previewIsStale && !isGeneratingPreview && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                  <MdVisibility className={isCollapsed ? "text-lg" : "text-base"} />
                  <span className={isCollapsed ? "text-[10px] leading-tight font-medium" : "text-[13px]"}>
                    {isGeneratingPreview
                      ? isCollapsed
                        ? "..."
                        : "Loading..."
                      : isCollapsed
                      ? "Preview"
                      : previewIsStale
                      ? "Refresh Preview"
                      : "Preview PDF"}
                  </span>
                </button>
              )}

              {/* Primary Action: Download Resume */}
              <button
                id="tour-download-button"
                onClick={onDownloadResume}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-emerald-500 hover:to-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${
                  isCollapsed
                    ? "flex-col gap-1 py-2.5 px-1"
                    : "flex-row gap-2 px-4 py-2.5 mb-2.5"
                }`}
              >
                <MdFileDownload className={isCollapsed ? "text-lg" : "text-base"} />
                <span className={isCollapsed ? "text-[10px] leading-tight font-medium" : "text-[13px]"}>
                  {isGenerating
                    ? isCollapsed
                      ? "..."
                      : "Generating..."
                    : isCollapsed
                    ? "Download"
                    : "Download Resume"}
                </span>
              </button>

              {/* Secondary Action: Add Section */}
              <button
                onClick={onAddSection}
                className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.98] ${
                  isCollapsed
                    ? "flex-col gap-1 py-2 px-1 mt-2"
                    : "flex-row gap-2 px-4 py-2 mb-3"
                }`}
              >
                <MdAdd className={isCollapsed ? "text-base" : "text-base"} />
                <span className={isCollapsed ? "text-[10px] leading-tight font-medium" : "text-[13px]"}>
                  {isCollapsed ? "Add" : "Add Section"}
                </span>
              </button>
            </>
          )}

          {/* Utility Actions - hidden in reorder mode */}
          {!isReorderModeActive && (
          <div className={`${isCollapsed ? "space-y-0.5 mt-2" : "space-y-0.5"}`}>
            {/* Backup to File */}
            <button
              id="tour-backup-button"
              onClick={onExportYAML}
              disabled={loadingSave}
              className={`w-full flex items-center transition-all rounded-md disabled:opacity-50 ${
                isCollapsed
                  ? "flex-col gap-1 py-2 px-1 hover:bg-blue-50/80"
                  : "flex-row gap-3 px-3 py-2 hover:bg-blue-50/80 text-gray-700 hover:text-blue-700"
              }`}
            >
              <MdFileDownload
                className={`text-blue-600 ${isCollapsed ? "text-base" : "text-base"}`}
              />
              <div className={`flex flex-col ${isCollapsed ? "items-center" : "items-start flex-1"}`}>
                <span
                  className={`${
                    isCollapsed
                      ? "text-[10px] text-gray-600 leading-tight font-medium"
                      : "text-[13px]"
                  }`}
                >
                  {loadingSave
                    ? isCollapsed
                      ? "..."
                      : "Saving..."
                    : isCollapsed
                    ? (isAuthenticated ? "Backup" : "Save")
                    : (isAuthenticated ? "Backup to File" : "Save My Work")}
                </span>
                {isAnonymous && !isCollapsed && (
                  <span className="text-xs text-amber-600 leading-tight">
                    Your only local save
                  </span>
                )}
              </div>
            </button>

            {/* Import from File (authenticated) / Load My Work (anonymous) */}
            <button
              onClick={onImportYAML}
              disabled={loadingLoad}
              className={`w-full flex items-center transition-all rounded-md disabled:opacity-50 ${
                isCollapsed
                  ? "flex-col gap-1 py-2 px-1 hover:bg-green-50/80"
                  : "flex-row gap-3 px-3 py-2 hover:bg-green-50/80 text-gray-700 hover:text-green-700"
              }`}
            >
              <MdFileUpload
                className={`text-green-600 ${isCollapsed ? "text-base" : "text-base"}`}
              />
              <span
                className={`${
                  isCollapsed
                    ? "text-[10px] text-gray-600 leading-tight font-medium"
                    : "text-[13px]"
                }`}
              >
                {loadingLoad
                  ? isCollapsed
                    ? "..."
                    : "Loading..."
                  : isCollapsed
                  ? "Load"
                  : (isAuthenticated ? "Import from File" : "Load My Work")}
              </span>
            </button>

            {/* Start Fresh - KEEP LABEL AS-IS (not renamed) */}
            <button
              onClick={handleStartFresh}
              className={`w-full flex items-center transition-all rounded-md ${
                isCollapsed
                  ? "flex-col gap-1 py-2 px-1 hover:bg-orange-50/80"
                  : "flex-row gap-3 px-3 py-2 hover:bg-orange-50/80 text-gray-700 hover:text-orange-700"
              }`}
            >
              <MdRefresh
                className={`text-orange-600 ${isCollapsed ? "text-base" : "text-base"}`}
              />
              <span
                className={`${
                  isCollapsed
                    ? "text-[10px] text-gray-600 leading-tight font-medium"
                    : "text-[13px]"
                }`}
              >
                {isCollapsed ? "Clear" : "Start Fresh"}
              </span>
            </button>

            {/* Help */}
            <button
              onClick={onHelp}
              className={`w-full flex items-center transition-all rounded-md ${
                isCollapsed
                  ? "flex-col gap-1 py-2 px-1 hover:bg-purple-50/80"
                  : "flex-row gap-3 px-3 py-2 hover:bg-purple-50/80 text-gray-700 hover:text-purple-700"
              }`}
            >
              <MdHelpOutline
                className={`text-purple-600 ${isCollapsed ? "text-base" : "text-base"}`}
              />
              <span
                className={`${
                  isCollapsed
                    ? "text-[10px] text-gray-600 leading-tight font-medium"
                    : "text-[13px]"
                }`}
              >
                {isCollapsed ? "Help" : "Help & Tips"}
              </span>
            </button>

            {/* Reorder Sections button */}
            {onEnterReorderMode && sections.length > 1 && (
              <button
                onClick={onEnterReorderMode}
                className={`w-full flex items-center transition-all rounded-md ${
                  isCollapsed
                    ? "flex-col gap-1 py-2 px-1 hover:bg-blue-50/80"
                    : "flex-row gap-3 px-3 py-2 hover:bg-blue-50/80 text-gray-700 hover:text-blue-700"
                }`}
              >
                <MdSwapVert
                  className={`text-blue-600 ${isCollapsed ? "text-base" : "text-base"}`}
                />
                <span
                  className={`${
                    isCollapsed
                      ? "text-[10px] text-gray-600 leading-tight font-medium"
                      : "text-[13px]"
                  }`}
                >
                  {isCollapsed ? "Reorder" : "Reorder Sections"}
                </span>
              </button>
            )}
          </div>
          )}

          {/* Support Section - Separate from other actions, hidden in reorder mode */}
          {!isReorderModeActive && (
          <div className={`border-t border-gray-200/60 ${isCollapsed ? "pt-2 px-2" : "pt-3 px-4"}`}>
            <Link
              to="/contact"
              className={`w-full flex items-center transition-all rounded-md ${
                isCollapsed
                  ? "flex-col gap-1 py-2 px-1 hover:bg-teal-50/80"
                  : "flex-row gap-3 px-3 py-2 hover:bg-teal-50/80 text-gray-700 hover:text-teal-700"
              }`}
            >
              <MdSupport
                className={`text-teal-600 ${isCollapsed ? "text-base" : "text-base"}`}
              />
              <span
                className={`${
                  isCollapsed
                    ? "text-[10px] text-gray-600 leading-tight font-medium"
                    : "text-[13px]"
                }`}
              >
                {isCollapsed ? "Support" : "Contact Support"}
              </span>
            </Link>
          </div>
          )}
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      {!isCollapsed && (
        <div className="px-4 py-2.5 bg-gray-100/50 border-t border-gray-200/40">
          <p className="text-[10px] text-gray-500 text-center">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-white rounded text-[9px] font-mono border border-gray-300 shadow-sm">
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="px-1.5 py-0.5 bg-white rounded text-[9px] font-mono border border-gray-300 shadow-sm">
              \
            </kbd>{" "}
            to toggle
          </p>
        </div>
      )}
    </nav>
  );
};

export default SectionNavigator;
