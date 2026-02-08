import { FaFilePdf, FaPlus } from "react-icons/fa";
import {
  MdFileDownload,
  MdFileUpload,
  MdHelpOutline,
  MdMoreVert,
  MdRefresh,
} from "react-icons/md";

interface EditorToolbarProps {
  // Button handlers
  onAddSection: () => void;
  onGenerateResume: () => void;
  onExportYAML: () => void;
  onImportYAML: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleHelp: () => void;
  onLoadEmptyTemplate: () => void;

  // Loading states
  loadingAddSection: boolean;
  generating: boolean;
  loadingSave: boolean;
  loadingLoad: boolean;

  // Menu state
  showAdvancedMenu: boolean;
  setShowAdvancedMenu: (show: boolean) => void;

  // Layout mode
  mode: "floating" | "integrated";
}

export default function EditorToolbar({
  onAddSection,
  onGenerateResume,
  onExportYAML,
  onImportYAML,
  onToggleHelp,
  onLoadEmptyTemplate,
  loadingAddSection,
  generating,
  loadingSave,
  loadingLoad,
  showAdvancedMenu,
  setShowAdvancedMenu,
  mode = "floating",
}: EditorToolbarProps) {
  const baseButtonClasses = "transform transition-all duration-300";
  const floatingButtonClasses = `${baseButtonClasses} hover:-translate-y-0.5 hover:scale-105 shadow-lg hover:shadow-xl`;
  const integratedButtonClasses = `${baseButtonClasses} hover:scale-105`;

  const buttonClasses =
    mode === "floating" ? floatingButtonClasses : integratedButtonClasses;

  return (
    <div
      className={`flex items-center justify-center gap-2 sm:gap-4 ${
        mode === "integrated" ? "w-full lg:w-auto" : ""
      }`}
    >
      {/* Add New Section */}
      <div className="relative group">
        <button
          onClick={onAddSection}
          disabled={loadingAddSection}
          aria-label="Add new section"
          className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 sm:p-4 rounded-full border border-blue-500/20 hover:border-blue-400/40 ${buttonClasses} ${
            loadingAddSection ? "scale-95 opacity-80" : ""
          }`}
        >
          {loadingAddSection ? (
            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
          ) : (
            <FaPlus className="text-lg sm:text-xl" />
          )}
        </button>
        {mode === "floating" && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-0 lg:transform-none mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Add New Section
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-4 lg:transform-none border-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>

      {/* Download Resume - Primary Action */}
      <button
        onClick={onGenerateResume}
        aria-label="Download resume"
        className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-full border border-green-500/20 hover:border-green-400/40 font-semibold text-sm sm:text-lg flex items-center gap-2 sm:gap-3 ${buttonClasses} ${
          generating ? "opacity-75 cursor-not-allowed scale-95" : ""
        }`}
        disabled={generating}
      >
        {generating ? (
          <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
        ) : (
          <FaFilePdf className="text-lg sm:text-xl" />
        )}
        <span className="hidden sm:inline">
          {generating ? "Creating Your Resume..." : "Download My Resume"}
        </span>
        <span className="sm:hidden">
          {generating ? "Creating..." : "Download"}
        </span>
      </button>

      {/* More Options Menu */}
      <div className="relative group advanced-menu-container">
        <button
          onClick={() => setShowAdvancedMenu(!showAdvancedMenu)}
          aria-label="More options"
          className={`bg-gradient-to-r from-gray-600 to-gray-700 text-white p-3 sm:p-4 rounded-full border border-gray-500/20 hover:border-gray-400/40 ${buttonClasses}`}
        >
          <MdMoreVert className="text-lg sm:text-xl" />
        </button>

        {mode === "floating" && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-0 lg:transform-none mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Save/Load Work
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-4 lg:transform-none border-4 border-transparent border-t-gray-800"></div>
          </div>
        )}

        {/* Dropdown Menu */}
        {showAdvancedMenu && (
          <div
            className={`absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-0 lg:transform-none w-48 sm:w-56 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 z-[9999] max-w-[90vw]`}
          >
            <div className="p-2">
              <button
                onClick={() => {
                  onExportYAML();
                  setShowAdvancedMenu(false);
                }}
                disabled={loadingSave}
                className={`w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                  loadingSave
                    ? "bg-blue-50 cursor-not-allowed animate-pulse"
                    : ""
                }`}
              >
                {loadingSave ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                ) : (
                  <MdFileDownload className="text-blue-600" />
                )}
                <div>
                  <div className="font-medium">
                    {loadingSave ? "Preparing File..." : "Save My Work"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {loadingSave
                      ? "This will start downloading shortly"
                      : "Download to continue later"}
                  </div>
                </div>
              </button>
              <label
                className={`w-full text-left px-3 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                  loadingLoad
                    ? "bg-green-50 cursor-not-allowed animate-pulse"
                    : "cursor-pointer"
                }`}
              >
                {loadingLoad ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-600 border-t-transparent"></div>
                ) : (
                  <MdFileUpload className="text-green-600" />
                )}
                <div>
                  <div className="font-medium">
                    {loadingLoad ? "Processing File..." : "Load Previous Work"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {loadingLoad
                      ? "Reading and validating your resume"
                      : "Upload your saved resume"}
                  </div>
                </div>
                <input
                  type="file"
                  accept=".yaml,.yml"
                  className="hidden"
                  disabled={loadingLoad}
                  onChange={(e) => {
                    onImportYAML(e);
                    setShowAdvancedMenu(false);
                  }}
                />
              </label>
              <button
                onClick={() => {
                  onToggleHelp();
                  setShowAdvancedMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3"
              >
                <MdHelpOutline className="text-purple-600" />
                <div>
                  <div className="font-medium">Help & Tips</div>
                  <div className="text-xs text-gray-500">
                    How to save your work
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  onLoadEmptyTemplate();
                  setShowAdvancedMenu(false);
                }}
                disabled={loadingSave}
                className={`w-full text-left px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                  loadingSave
                    ? "bg-orange-50 cursor-not-allowed animate-pulse"
                    : ""
                }`}
              >
                {loadingSave ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-600 border-t-transparent"></div>
                ) : (
                  <MdRefresh className="text-orange-600" />
                )}
                <div>
                  <div className="font-medium">Clear Template</div>
                  <div className="text-xs text-gray-500">
                    Start with empty sections
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
