import React, { useState, useEffect, useRef, useCallback } from "react";
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
  MdMoreVert,
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
} from "react-icons/md";
import { PanelRightClose, PanelRightOpen, ShieldCheck, ChevronRight, ExternalLink } from "lucide-react";
import { JobSparkleIcon } from "./icons/JobSparkleIcon";
import { Link } from "react-router-dom";
import { affiliateConfig, hasAnyAffiliate } from "../config/affiliate";
import { extractJobSearchParams } from "../utils/resumeDataExtractor";
import type { ContactInfo, Section as ResumeSection } from "../types";
import DocumentSpine from "./editor/DocumentSpine";
import { useResumeLength } from "../hooks/editor/useResumeLength";
import { PhaseLabel, WorkingRail } from "./shared/GenerationPhase";

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
  /** What the PDF build is doing right now; null when idle */
  generatingPhase?: string | null;
  /** Whether the preview button is being clicked (saving, validating) */
  isOpeningPreview?: boolean;
  /** Whether the preview is being generated */
  isGeneratingPreview?: boolean;
  previewIsStale?: boolean;
  loadingSave?: boolean;
  loadingLoad?: boolean;
  onCollapseChange?: (isCollapsed: boolean) => void;
  isAnonymous?: boolean;
  isAuthenticated?: boolean;
  contactInfo?: ContactInfo | null;
  resumeSections?: ResumeSection[];
  /** Last generated preview PDF; calibrates the length estimate against truth. */
  previewUrl?: string | null;
}

const STORAGE_KEY = "resume-builder-sidebar-collapsed";

/**
 * Collapsible editor rail.
 *
 * Three tiers, not eight equals: Download (the conversion event) alone at the
 * top of a pinned footer, Preview + Add Section as secondary, everything else
 * behind a "More Options" disclosure. The footer sits OUTSIDE the scroll
 * container so Download can never be pushed below the fold by a long section
 * list or by collapsing the rail.
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
  generatingPhase,
  isOpeningPreview = false,
  isGeneratingPreview,
  previewIsStale,
  loadingSave,
  loadingLoad,
  onCollapseChange,
  isAnonymous = false,
  isAuthenticated = false,
  contactInfo,
  resumeSections,
  previewUrl,
}) => {
  // Show loading on button when either opening (save/validate) or generating
  const isPreviewLoading = isOpeningPreview || isGeneratingPreview;

  // Live page-length estimate, corrected against the real PDF whenever one exists.
  const resumeLength = useResumeLength(
    contactInfo ?? null,
    resumeSections ?? [],
    previewUrl
  );
  const previewStale = Boolean(previewIsStale) && !isPreviewLoading;
  // Load initial state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "true";
  });
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Track header height and dynamic footer offset
  const [headerHeight, setHeaderHeight] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);
  const sidebarRef = useRef<HTMLElement>(null);
  const onCollapseChangeRef = useRef(onCollapseChange);

  // Calculate header height on mount and resize
  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.querySelector("header");
      const devBanner = document.querySelector('[class*="bg-red-600"]');

      let totalHeaderHeight = 0;

      if (devBanner && devBanner instanceof HTMLElement) {
        totalHeaderHeight += devBanner.offsetHeight;
      }

      if (header && header instanceof HTMLElement) {
        totalHeaderHeight += header.offsetHeight;
      }

      setHeaderHeight(totalHeaderHeight || 72);
    };

    calculateHeaderHeight();

    window.addEventListener("resize", calculateHeaderHeight);

    const observer = new MutationObserver(calculateHeaderHeight);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener("resize", calculateHeaderHeight);
      observer.disconnect();
    };
  }, []);

  // Track how much of the footer is visible in the viewport via scroll
  useEffect(() => {
    let rafId = 0;

    const updateBottomOffset = () => {
      const footer = document.querySelector("#app-footer");
      if (footer && footer instanceof HTMLElement) {
        const footerTop = footer.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        setBottomOffset(Math.max(0, viewportHeight - footerTop));
      } else {
        setBottomOffset(0);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateBottomOffset);
    };

    // Initial calculation
    updateBottomOffset();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    onCollapseChangeRef.current = onCollapseChange;
  }, [onCollapseChange]);

  // Notify parent when collapsed state changes
  useEffect(() => {
    onCollapseChangeRef.current?.(isCollapsed);
  }, [isCollapsed]);

  // Persist preference to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  const handleToggle = useCallback(() => {
    setShowMoreOptions(false);
    setIsCollapsed((current) => !current);
  }, []);

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
  }, [handleToggle]);

  // Handle Start Fresh - confirmation dialog is handled by parent (Editor.tsx)
  const handleStartFresh = () => {
    onStartFresh();
  };

  const runOption = (action: () => void) => {
    setShowMoreOptions(false);
    action();
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

  /**
   * Collapsed-rail label. Truncates the user's own section name — it never
   * substitutes a different word for it. A rename the user made has to survive
   * into the navigator, or the navigator stops describing their document.
   * The full name is always on `title` and `aria-label`.
   */
  const getShortLabel = (section: Section): string => {
    const firstWord = section.name.trim().split(/\s+/)[0] || section.name;
    return firstWord.length > 9 ? `${firstWord.slice(0, 8)}…` : firstWord;
  };

  const controlBase =
    "w-full min-h-11 flex items-center justify-center rounded-lg font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2";

  const optionRowBase = `w-full min-h-11 flex items-center transition-colors duration-150 rounded-lg disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-inset ${
    isCollapsed ? "flex-col gap-1 py-2 px-1" : "flex-row gap-3 px-3 py-2 text-left"
  }`;

  const showAffiliates = hasAnyAffiliate();

  return (
    <nav
      ref={sidebarRef}
      className={`hidden lg:flex flex-col fixed right-0 bg-white/95 backdrop-blur-sm border-l border-gray-200/80 shadow-sm overflow-clip z-[45] transition-[width] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCollapsed ? "w-[72px]" : "w-[280px]"
      }`}
      style={{
        top: `${headerHeight}px`,
        bottom: `${bottomOffset}px`
      }}
      aria-label="Section navigation and actions"
    >
      {/* Toggle Button - Top of sidebar with subtle border */}
      <div className="shrink-0 flex items-center justify-between px-3 py-3 border-b border-gray-200/60 bg-chalk">
        {!isCollapsed && (
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Navigator
          </span>
        )}
        <button
          onClick={handleToggle}
          className={`inline-flex min-h-11 min-w-11 items-center justify-center p-2 hover:bg-white rounded-lg transition-colors duration-150 text-ink/60 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 ${
            isCollapsed ? "mx-auto" : ""
          }`}
          aria-label={isCollapsed ? "Expand sidebar (Ctrl+\\)" : "Collapse sidebar (Ctrl+\\)"}
          title={isCollapsed ? "Expand (Ctrl+\\)" : "Collapse (Ctrl+\\)"}
        >
          {isCollapsed ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
        </button>
      </div>

      {/* Sections Navigation - the only scrolling region of the rail */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-clip scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className={`${isCollapsed ? "py-3 px-1.5" : "p-3"}`} id="tour-section-navigator">
          {!isCollapsed && (
            <h2 className="text-[11px] font-semibold text-ink/60 uppercase tracking-wider mb-3 px-2">
              Sections
            </h2>
          )}

          {/* Contact Info */}
          <button
            onClick={() => onSectionClick(-1)}
            title="Contact Information"
            className={`w-full flex items-center transition-colors duration-150 rounded-lg group ${
              isCollapsed
                ? "flex-col gap-1.5 py-2.5 px-1.5 hover:bg-accent/[0.06]"
                : "flex-row gap-3 px-3 py-2.5 hover:bg-black/5"
            } ${
              activeSectionIndex === -1
                ? isCollapsed
                  ? "bg-accent/[0.06] text-ink"
                  : "bg-accent/[0.06] ring-1 ring-accent/20 text-ink font-medium"
                : "text-ink/80 hover:text-ink"
            }`}
          >
            <div
              className={`flex items-center justify-center ${
                isCollapsed ? "w-7 h-7" : "w-6 h-6"
              } rounded-lg ${
                activeSectionIndex === -1
                  ? "bg-accent/10 text-accent-text"
                  : "bg-chalk-dark text-ink/60 group-hover:text-ink"
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
            <button
              key={index}
              onClick={() => onSectionClick(index)}
              title={section.name}
              aria-label={section.name}
              className={`w-full flex items-center transition-colors duration-150 rounded-lg group ${
                isCollapsed
                  ? "flex-col gap-1.5 py-2.5 px-1.5 hover:bg-accent/[0.06] mt-1"
                  : "flex-row gap-3 px-3 py-2.5 hover:bg-black/5 mt-0.5"
              } ${
                activeSectionIndex === index
                  ? isCollapsed
                    ? "bg-accent/[0.06] text-ink"
                    : "bg-accent/[0.06] ring-1 ring-accent/20 text-ink font-medium"
                  : "text-ink/80 hover:text-ink"
              }`}
            >
              <div
                className={`flex items-center justify-center ${
                  isCollapsed ? "w-7 h-7" : "w-6 h-6"
                } rounded-lg ${
                  activeSectionIndex === index
                    ? "bg-accent/10 text-accent-text"
                    : "bg-chalk-dark text-ink/60 group-hover:text-ink"
                }`}
              >
                {getSectionIcon(section)}
              </div>
              <span
                className={`${
                  isCollapsed
                    ? "text-[11px] font-medium text-center leading-tight w-full truncate"
                    : "text-[13px] flex-1 truncate text-left"
                }`}
              >
                {isCollapsed ? getShortLabel(section) : section.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Length — the document the user is actually making ──
          Sits directly above Actions because "does it still fit on one page?"
          is the question that decides whether they hit Download or keep
          editing. */}
      <div className="shrink-0 border-t border-gray-200/60 bg-white">
        <DocumentSpine estimate={resumeLength} isCollapsed={isCollapsed} />
      </div>

      {/* ── Actions — pinned below the scroll region so Download is always reachable ── */}
      <div className="shrink-0 border-t border-gray-200/60 bg-white">
        <div className={`${isCollapsed ? "py-3 px-2" : "p-4"}`}>
          {!isCollapsed && (
            <h3 className="text-[11px] font-semibold text-ink/60 uppercase tracking-wider mb-3 px-1">
              Actions
            </h3>
          )}

          {/* Tier 1 — the conversion action. The only filled accent control here. */}
          <button
            id="tour-download-button"
            onClick={onDownloadResume}
            disabled={isGenerating}
            title="Download your resume as a PDF"
            className={`${controlBase} bg-accent text-ink shadow-sm hover:bg-accent/90 hover:shadow-md ${
              isCollapsed ? "flex-col gap-1 py-2.5 px-1" : "flex-row gap-2 px-4 py-2.5"
            }`}
          >
            {isGenerating && !isCollapsed ? (
              <WorkingRail className="h-[3px] w-4 shrink-0" />
            ) : (
              <MdFileDownload className={isCollapsed ? "text-lg" : "text-base"} />
            )}
            {isGenerating && !isCollapsed ? (
              <PhaseLabel
                phase={generatingPhase}
                fallback="Building your PDF"
                className="text-[13px] truncate"
              />
            ) : (
              <span className={isCollapsed ? "text-[10px] leading-tight font-medium" : "text-[13px]"}>
                {isGenerating ? "..." : isCollapsed ? "PDF" : "Download Resume"}
              </span>
            )}
          </button>

          {/* Tier 2 — secondary work controls */}
          {onPreviewResume && (
            <button
              id="tour-preview-button"
              onClick={onPreviewResume}
              disabled={isPreviewLoading}
              title={
                previewStale
                  ? "Preview is out of date — refresh it to match your latest edits"
                  : "Open the PDF preview"
              }
              aria-label={
                previewStale
                  ? "Refresh preview — the preview is out of date and does not include your latest edits"
                  : "Preview PDF"
              }
              className={`${controlBase} border mt-2 ${
                previewStale
                  ? "border-amber-600 bg-amber-50 text-amber-900 hover:bg-amber-100"
                  : "border-gray-200 bg-white text-ink hover:bg-chalk-dark hover:border-gray-300"
              } ${isCollapsed ? "flex-col gap-1 py-2.5 px-1" : "flex-row gap-2 px-4 py-2.5"}`}
            >
              {isPreviewLoading ? (
                <span className={`h-2 ${isCollapsed ? "w-8" : "w-10"} overflow-clip rounded-full bg-ink/15`}>
                  <span className="block h-full w-1/2 animate-pulse rounded-full bg-ink/60" />
                </span>
              ) : previewStale ? (
                <MdRefresh className={isCollapsed ? "text-lg" : "text-base"} aria-hidden="true" />
              ) : (
                <MdVisibility className={isCollapsed ? "text-lg" : "text-base"} aria-hidden="true" />
              )}
              <span className={isCollapsed ? "text-[10px] leading-tight font-medium" : "text-[13px]"}>
                {isPreviewLoading
                  ? isCollapsed
                    ? "..."
                    : "Loading..."
                  : previewStale
                  ? isCollapsed
                    ? "Refresh"
                    : "Refresh Preview"
                  : isCollapsed
                  ? "Preview"
                  : "Preview PDF"}
              </span>
            </button>
          )}

          {previewStale && !isCollapsed && (
            <p className="mt-1.5 px-1 text-[11px] leading-snug text-amber-900">
              Preview is behind your edits.
            </p>
          )}

          {/* Ghost Add — the system's "there could be more here" affordance */}
          <button
            onClick={onAddSection}
            title="Add a new section"
            className={`btn-ghost-add mt-2 ${isCollapsed ? "flex-col gap-1 py-2 px-1" : ""}`}
          >
            <MdAdd className="text-base" aria-hidden="true" />
            <span className={isCollapsed ? "text-[10px] leading-tight" : "text-[13px]"}>
              {isCollapsed ? "Add" : "Add Section"}
            </span>
          </button>

          {/* Tier 3 — everything else, behind one disclosure */}
          <div className="relative mt-2">
            <button
              onClick={() => {
                // Collapsed rail is 68px of usable width; expand it rather than
                // rendering an unreadable menu inside it.
                if (isCollapsed) setIsCollapsed(false);
                setShowMoreOptions((open) => (isCollapsed ? true : !open));
              }}
              aria-expanded={showMoreOptions}
              aria-haspopup="menu"
              className={`w-full min-h-11 flex items-center justify-center gap-2 rounded-lg text-[13px] font-medium text-ink/80 transition-colors duration-150 hover:bg-black/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 ${
                isCollapsed ? "flex-col gap-1 py-2 px-1" : "px-4 py-2"
              }`}
            >
              <MdMoreVert className="text-base" aria-hidden="true" />
              <span className={isCollapsed ? "text-[10px] leading-tight" : ""}>
                {isCollapsed ? "More" : "More Options"}
              </span>
            </button>

            {showMoreOptions && !isCollapsed && (
              <div
                role="menu"
                className="absolute bottom-full left-0 right-0 z-10 mb-2 rounded-xl border border-gray-200 bg-white p-1 shadow-xl"
              >
                <button
                  id="tour-backup-button"
                  role="menuitem"
                  onClick={() => runOption(onExportYAML)}
                  disabled={loadingSave}
                  className={`${optionRowBase} text-ink hover:bg-black/5`}
                >
                  <MdFileDownload className="text-base text-ink/60 shrink-0" aria-hidden="true" />
                  <span className="flex flex-col items-start">
                    <span className="text-[13px]">
                      {loadingSave
                        ? "Saving..."
                        : isAuthenticated
                        ? "Backup to File"
                        : "Save My Work"}
                    </span>
                    <span className={`text-[11px] leading-tight ${isAnonymous ? "text-amber-700" : "text-ink/60"}`}>
                      {isAnonymous ? "Your only local save" : "Download YAML file"}
                    </span>
                  </span>
                </button>

                <button
                  role="menuitem"
                  onClick={() => runOption(onImportYAML)}
                  disabled={loadingLoad}
                  className={`${optionRowBase} text-ink hover:bg-black/5`}
                >
                  <MdFileUpload className="text-base text-ink/60 shrink-0" aria-hidden="true" />
                  <span className="flex flex-col items-start">
                    <span className="text-[13px]">
                      {loadingLoad
                        ? "Loading..."
                        : isAuthenticated
                        ? "Import from File"
                        : "Load My Work"}
                    </span>
                    <span className="text-[11px] leading-tight text-ink/60">Upload YAML file</span>
                  </span>
                </button>

                {/* Semantic red is a status colour, not a brand colour: this one
                    discards the user's work. */}
                <button
                  role="menuitem"
                  onClick={() => runOption(handleStartFresh)}
                  className={`${optionRowBase} text-ink hover:bg-red-50 hover:text-red-800`}
                >
                  <MdRefresh className="text-base text-ink/60 shrink-0" aria-hidden="true" />
                  <span className="flex flex-col items-start">
                    <span className="text-[13px]">Start Fresh</span>
                    <span className="text-[11px] leading-tight text-ink/60">Clear and start over</span>
                  </span>
                </button>

                <button
                  role="menuitem"
                  onClick={() => runOption(onHelp)}
                  className={`${optionRowBase} text-ink hover:bg-black/5`}
                >
                  <MdHelpOutline className="text-base text-ink/60 shrink-0" aria-hidden="true" />
                  <span className="flex flex-col items-start">
                    <span className="text-[13px]">Help &amp; Tips</span>
                    <span className="text-[11px] leading-tight text-ink/60">Guided tour</span>
                  </span>
                </button>

                <Link
                  role="menuitem"
                  to="/contact"
                  onClick={() => setShowMoreOptions(false)}
                  className={`${optionRowBase} text-ink hover:bg-black/5`}
                >
                  <MdSupport className="text-base text-ink/60 shrink-0" aria-hidden="true" />
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

      {/* ── Sponsored — outbound partner links, kept out of the Sections list ── */}
      {showAffiliates && (
        <div className={`shrink-0 border-t border-gray-200/60 bg-chalk ${isCollapsed ? "py-2 px-1.5" : "px-2 py-2"}`}>
          {!isCollapsed && (
            <h3 className="mb-2 px-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/60">
              Sponsored
            </h3>
          )}

          {/* ATS Health Check — outbound affiliate link */}
          {affiliateConfig.resumeReview.enabled && affiliateConfig.resumeReview.url && (
            isCollapsed ? (
              <a
                href={affiliateConfig.resumeReview.url}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="w-full flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg hover:bg-black/5 transition-colors duration-150 text-ink/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
                title="Sponsored: ATS compatibility check (opens in a new tab)"
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-medium text-center leading-tight">ATS</span>
              </a>
            ) : (
              <a
                href={affiliateConfig.resumeReview.url}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="w-full min-h-11 flex items-center gap-2.5 rounded-lg px-2 transition-colors duration-150 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-ink/60" aria-hidden="true" />
                <span className="flex-1 min-w-0 flex flex-col items-start">
                  <span className="text-[13px] text-ink leading-tight">ATS Compatibility</span>
                  <span className="text-[11px] text-ink/60 leading-tight truncate w-full">
                    Will your resume pass the filter?
                  </span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-ink/60 shrink-0" aria-hidden="true" />
                <span className="sr-only">Sponsored link, opens in a new tab</span>
              </a>
            )
          )}

          {/* Find Matching Jobs — partner-powered job search */}
          {affiliateConfig.jobSearch.enabled && (
            isCollapsed ? (
              <Link
                to="/jobs"
                onClick={() => {
                  const params = extractJobSearchParams(contactInfo ?? null, resumeSections ?? []);
                  if (params) {
                    try {
                      sessionStorage.setItem('jobSearchPrefill', JSON.stringify({
                        title: params.displayTitle,
                        location: params.location,
                        country: params.country,
                        skills: params.skills,
                        seniorityLevel: params.seniorityLevel,
                        yearsExperience: params.yearsExperience,
                      }));
                    } catch { /* ignore */ }
                  }
                }}
                className="w-full flex flex-col items-center gap-1.5 py-2 px-1 mt-1 rounded-lg hover:bg-black/5 transition-colors duration-150 text-ink/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
                title="Sponsored: job matches"
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200">
                  <JobSparkleIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-medium text-center leading-tight">Jobs</span>
              </Link>
            ) : (
              <Link
                to="/jobs"
                onClick={() => {
                  const params = extractJobSearchParams(contactInfo ?? null, resumeSections ?? []);
                  if (params) {
                    try {
                      sessionStorage.setItem('jobSearchPrefill', JSON.stringify({
                        title: params.displayTitle,
                        location: params.location,
                        country: params.country,
                        skills: params.skills,
                        seniorityLevel: params.seniorityLevel,
                        yearsExperience: params.yearsExperience,
                      }));
                    } catch { /* ignore */ }
                  }
                }}
                className="w-full min-h-11 flex items-center gap-2.5 rounded-lg px-2 transition-colors duration-150 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2"
              >
                <JobSparkleIcon className="w-4 h-4 shrink-0 text-ink/60" />
                <span className="flex-1 min-w-0 flex flex-col items-start">
                  <span className="text-[13px] text-ink leading-tight">Job Matches</span>
                  <span className="text-[11px] text-ink/60 leading-tight truncate w-full">
                    Matched to your resume skills
                  </span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-ink/60 shrink-0" aria-hidden="true" />
              </Link>
            )
          )}
        </div>
      )}

      {/* Keyboard shortcut hint */}
      {!isCollapsed && (
        <div className="shrink-0 px-4 py-2.5 bg-chalk border-t border-gray-200/40">
          <p className="text-[10px] text-ink/60 text-center">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-white rounded text-[9px] font-mono border border-gray-300">
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="px-1.5 py-0.5 bg-white rounded text-[9px] font-mono border border-gray-300">
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
