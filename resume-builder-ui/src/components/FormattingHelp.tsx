import React, { useState, useMemo } from "react";
import {
  MdHelpOutline,
  MdExpandMore,
  MdExpandLess,
  MdMoreHoriz,
  MdEdit,
  MdCloudDone,
  MdSaveAlt,
  MdTouchApp,
  MdMouse,
} from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";

/**
 * TipCard - Visual card for displaying a help tip
 */
interface TipCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  primaryTip: React.ReactNode;
  secondaryTips: string[];
}

const TipCard: React.FC<TipCardProps> = ({
  icon: Icon,
  title,
  primaryTip,
  secondaryTips,
}) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="w-12 h-12 rounded-xl bg-chalk flex items-center justify-center mb-3">
      <Icon className="text-accent text-2xl" aria-hidden="true" />
    </div>
    <h4 className="text-base font-semibold text-gray-900 mb-2">{title}</h4>
    <div className="mb-2">{primaryTip}</div>
    <ul className="space-y-1">
      {secondaryTips.map((tip) => (
        <li key={tip} className="text-xs text-gray-500 flex items-start gap-1.5">
          <span className="text-accent/80 mt-0.5">•</span>
          <span>{tip}</span>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * Collapsible formatting help section
 * Shows once globally instead of repeating in each section
 */
const FormattingHelp: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isAnonymous } = useAuth();

  // Detect touch devices for device-specific tips
  const isTouchDevice = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  return (
    <div className="bg-accent/[0.06] backdrop-blur-sm rounded-xl border border-accent/20 mb-6 overflow-hidden transition-all duration-200">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/10/50 transition-colors text-left"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse help guide" : "Expand help guide"}
      >
        <div className="flex items-center gap-3">
          <MdHelpOutline
            className="text-accent text-xl flex-shrink-0"
            aria-hidden="true"
          />
          <span className="text-ink font-medium text-sm">
            Quick Start Guide
          </span>
        </div>
        {isExpanded ? (
          <MdExpandLess className="text-accent text-xl" aria-hidden="true" />
        ) : (
          <MdExpandMore className="text-accent text-xl" aria-hidden="true" />
        )}
      </button>

      {/* Expandable Content - 3-Column Grid */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Drag & Organize */}
            <TipCard
              icon={MdMoreHoriz}
              title="Drag & Organize"
              primaryTip={
                <div className="bg-accent/[0.06]/80 rounded-lg px-3 py-2 flex items-center gap-2">
                  {isTouchDevice ? (
                    <>
                      <MdTouchApp
                        className="text-accent flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-ink">
                        Press & hold, then drag
                      </span>
                    </>
                  ) : (
                    <>
                      <MdMouse
                        className="text-accent flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-ink">
                        Hover to reveal the ••• handle
                      </span>
                    </>
                  )}
                </div>
              }
              secondaryTips={[
                "Reorder sections, entries, and bullet points",
                "Look for ••• at the top of each item",
              ]}
            />

            {/* Card 2: Edit & Format */}
            <TipCard
              icon={MdEdit}
              title="Edit & Format"
              primaryTip={
                <p className="text-sm text-gray-700">
                  Select text to see formatting options
                </p>
              }
              secondaryTips={[
                "Bold, Italic, Underline, Strikethrough, Links",
                "Click section titles to edit inline",
                "Ctrl+B, Ctrl+I, Ctrl+U shortcuts",
              ]}
            />

            {/* Card 3: Save Status - Dynamic based on auth */}
            {isAnonymous ? (
              <TipCard
                icon={MdSaveAlt}
                title="Local Auto-Save Active"
                primaryTip={
                  <p className="text-sm text-gray-700">
                    Changes save to this browser only
                  </p>
                }
                secondaryTips={[
                  "⚠️ Clearing browser data will delete your work",
                  "Sign in to secure your resume to the cloud",
                ]}
              />
            ) : (
              <TipCard
                icon={MdCloudDone}
                title="Cloud Sync Active"
                primaryTip={
                  <p className="text-sm text-gray-700">
                    Your work is securely backed up
                  </p>
                }
                secondaryTips={[
                  "Access your resume from any device",
                  "Create and manage up to 5 resume versions",
                ]}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormattingHelp;
