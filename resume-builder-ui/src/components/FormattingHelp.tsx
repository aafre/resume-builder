import React, { useState } from "react";
import { MdHelpOutline, MdExpandMore, MdExpandLess } from "react-icons/md";

/**
 * Collapsible formatting help section
 * Shows once globally instead of repeating in each section
 */
const FormattingHelp: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50/50 backdrop-blur-sm rounded-xl border border-blue-200/60 mb-6 overflow-hidden transition-all duration-200">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-blue-100/50 transition-colors text-left"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse formatting help" : "Expand formatting help"}
      >
        <div className="flex items-center gap-3">
          <MdHelpOutline className="text-blue-600 text-xl flex-shrink-0" aria-hidden="true" />
          <span className="text-blue-900 font-medium text-sm">
            Formatting Help & Tips
          </span>
        </div>
        {isExpanded ? (
          <MdExpandLess className="text-blue-600 text-xl" aria-hidden="true" />
        ) : (
          <MdExpandMore className="text-blue-600 text-xl" aria-hidden="true" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 text-sm space-y-4">
          {/* Quick Start */}
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">🚀 Quick Start</h4>
            <ul className="space-y-1.5 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Format text:</strong> Select any text to see formatting buttons (<strong>B</strong>, <em>I</em>, <u>U</u>, <s>S</s>, 🔗)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Add links:</strong> Select text, click 🔗, enter the URL</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Keyboard shortcuts:</strong> Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline)</span>
              </li>
            </ul>
          </div>

          {/* Markdown Formatting */}
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">✍️ Markdown Shortcuts (Optional)</h4>
            <p className="text-blue-800 mb-2 text-xs">Type these patterns directly for faster formatting:</p>
            <ul className="space-y-1 text-blue-800 font-mono text-xs">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>**bold**</strong> or <strong>__bold__</strong> → <strong>bold text</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>*italic*</strong> or <strong>_italic_</strong> → <em>italic text</em></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>++underline++</strong> → <u>underline text</u></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>~~strikethrough~~</strong> → <s>strikethrough</s></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>[link text](url)</strong> → clickable hyperlink</span>
              </li>
            </ul>
          </div>

          {/* Pro Tips */}
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h4>
            <ul className="space-y-1.5 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Mobile & Desktop:</strong> The formatting menu works on all devices - just select text!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Links in PDF:</strong> All hyperlinks open in new tabs when clicked</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Best practices:</strong> Use bullet points for achievements, keep descriptions concise (3-5 per role)</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormattingHelp;
