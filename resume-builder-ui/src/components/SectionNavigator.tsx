import React, { useState } from "react";
import { MdDragIndicator, MdAdd, MdFileDownload, MdFileUpload, MdRefresh, MdHelpOutline, MdChevronLeft, MdChevronRight, MdCircle } from "react-icons/md";

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
  onExportYAML: () => void;
  onImportYAML: () => void;
  onStartFresh: () => void;
  onHelp: () => void;
  isGenerating?: boolean;
  loadingSave?: boolean;
  loadingLoad?: boolean;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

/**
 * Desktop sidebar navigator - smart collapsible panel on the right
 * Expanded: Full text + icons
 * Collapsed: Icon-only with tooltips
 */
const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  sections,
  onSectionClick,
  activeSectionIndex,
  onAddSection,
  onDownloadResume,
  onExportYAML,
  onImportYAML,
  onStartFresh,
  onHelp,
  isGenerating,
  loadingSave,
  loadingLoad,
  onCollapseChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState);
  };

  return (
    <>
      {/* Smart Collapsible Sidebar - Clear of header (top-20) and footer (bottom-20) */}
      <nav
        className={`hidden lg:flex flex-col fixed right-0 top-20 bottom-20 bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 shadow-2xl overflow-x-hidden overflow-y-auto z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-72'
        }`}
        aria-label="Section navigation and actions"
      >
        {/* Sections Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {isCollapsed ? (
            // COLLAPSED: Dots with tooltips
            <div className="py-6 space-y-3 px-2">
              {/* Contact Info Dot */}
              <div className="group relative flex justify-center">
                <button
                  onClick={() => onSectionClick(-1)}
                  className={`p-2 rounded-full transition-all ${
                    activeSectionIndex === -1
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  aria-label="Contact Information"
                >
                  <MdCircle className="text-xs" />
                </button>
                {/* Tooltip - positioned to the left */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all whitespace-nowrap shadow-xl z-[100]">
                  Contact Information
                  {/* Arrow */}
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
                </div>
              </div>

              {/* Section Dots */}
              {sections.map((section, index) => (
                <div key={index} className="group relative flex justify-center">
                  <button
                    onClick={() => onSectionClick(index)}
                    className={`p-2 rounded-full transition-all ${
                      activeSectionIndex === index
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    aria-label={section.name}
                  >
                    <MdCircle className="text-xs" />
                  </button>
                  {/* Tooltip - positioned to the left */}
                  <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all whitespace-nowrap shadow-xl z-[100]">
                    {section.name}
                    {/* Arrow */}
                    <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // EXPANDED: Full section list
            <div className="p-2">
              {/* Header */}
              <div className="px-2 py-3 border-b border-gray-200 mb-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <MdDragIndicator className="text-gray-400" />
                  Sections
                </h2>
              </div>

              {/* Contact Info */}
              <button
                onClick={() => onSectionClick(-1)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 group ${
                  activeSectionIndex === -1
                    ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-900 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeSectionIndex === -1
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}
                >
                  i
                </span>
                <span className="flex-1 text-sm">Contact Information</span>
              </button>

              {/* Dynamic Sections */}
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => onSectionClick(index)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 mt-1 group ${
                    activeSectionIndex === index
                      ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-900 font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activeSectionIndex === index
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm truncate" title={section.name}>
                    {section.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions Section - Fixed at bottom */}
        <div className="border-t border-gray-200 bg-white">
          {isCollapsed ? (
            // COLLAPSED: Icon-only buttons
            <div className="py-3 space-y-2">
              {/* Add Section */}
              <div className="group relative flex justify-center">
                <button
                  onClick={onAddSection}
                  className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  aria-label="Add Section"
                >
                  <MdAdd className="text-2xl" />
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all whitespace-nowrap shadow-xl z-[100]">
                  Add Section
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
                </div>
              </div>

              {/* Save My Work */}
              <div className="group relative flex justify-center">
                <button
                  onClick={onExportYAML}
                  disabled={loadingSave}
                  className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50"
                  aria-label="Save My Work"
                >
                  <MdFileDownload className="text-xl" />
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all whitespace-nowrap shadow-xl z-[100]">
                  {loadingSave ? 'Saving...' : 'Save My Work'}
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
                </div>
              </div>

              {/* Load My Work */}
              <div className="group relative flex justify-center">
                <button
                  onClick={onImportYAML}
                  disabled={loadingLoad}
                  className="p-3 text-green-600 hover:bg-green-50 rounded-lg transition-all disabled:opacity-50"
                  aria-label="Load My Work"
                >
                  <MdFileUpload className="text-xl" />
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all whitespace-nowrap shadow-xl z-[100]">
                  {loadingLoad ? 'Loading...' : 'Load My Work'}
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
                </div>
              </div>

              {/* Start Fresh */}
              <div className="group relative flex justify-center">
                <button
                  onClick={onStartFresh}
                  className="p-3 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                  aria-label="Start Fresh"
                >
                  <MdRefresh className="text-xl" />
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all whitespace-nowrap shadow-xl z-[100]">
                  Start Fresh
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
                </div>
              </div>

              {/* Help */}
              <div className="group relative flex justify-center">
                <button
                  onClick={onHelp}
                  className="p-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                  aria-label="Help & Tips"
                >
                  <MdHelpOutline className="text-xl" />
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all whitespace-nowrap shadow-xl z-[100]">
                  Help & Tips
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
                </div>
              </div>

              {/* Download Resume - Bottom */}
              <div className="pt-2 border-t border-gray-200 mt-2 group relative flex justify-center">
                <button
                  onClick={onDownloadResume}
                  disabled={isGenerating}
                  className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  aria-label="Download Resume"
                >
                  <MdFileDownload className="text-2xl" />
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all whitespace-nowrap shadow-xl z-[100]">
                  {isGenerating ? 'Generating...' : 'Download Resume'}
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
                </div>
              </div>
            </div>
          ) : (
            // EXPANDED: Full action buttons
            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                Actions
              </h3>

              {/* Download Resume Button - Primary */}
              <button
                onClick={onDownloadResume}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdFileDownload className="text-xl" />
                {isGenerating ? 'Generating...' : 'Download Resume'}
              </button>

              {/* Add Section */}
              <button
                onClick={onAddSection}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-3"
              >
                <MdAdd className="text-xl" />
                Add Section
              </button>

              {/* Quick Actions */}
              <div className="space-y-1">
                <button
                  onClick={onExportYAML}
                  disabled={loadingSave}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-all flex items-center gap-3 text-sm disabled:opacity-50"
                >
                  <MdFileDownload className="text-lg text-blue-600" />
                  {loadingSave ? 'Saving...' : 'Save My Work'}
                </button>

                <button
                  onClick={onImportYAML}
                  disabled={loadingLoad}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700 transition-all flex items-center gap-3 text-sm disabled:opacity-50"
                >
                  <MdFileUpload className="text-lg text-green-600" />
                  {loadingLoad ? 'Loading...' : 'Load My Work'}
                </button>

                <button
                  onClick={onStartFresh}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-700 transition-all flex items-center gap-3 text-sm"
                >
                  <MdRefresh className="text-lg text-orange-600" />
                  Start Fresh
                </button>

                <button
                  onClick={onHelp}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-all flex items-center gap-3 text-sm"
                >
                  <MdHelpOutline className="text-lg text-purple-600" />
                  Help & Tips
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Toggle Button - Integrated into sidebar */}
      <button
        onClick={handleToggle}
        className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-[60] bg-white hover:bg-blue-50 border border-gray-300 text-gray-600 hover:text-blue-600 p-2 shadow-lg hover:shadow-xl transition-all items-center justify-center group ${
          isCollapsed ? 'right-16 rounded-l-lg' : 'right-72 rounded-l-lg'
        }`}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <MdChevronLeft className="text-xl transition-transform group-hover:scale-110" />
        ) : (
          <MdChevronRight className="text-xl transition-transform group-hover:scale-110" />
        )}
      </button>
    </>
  );
};

export default SectionNavigator;
