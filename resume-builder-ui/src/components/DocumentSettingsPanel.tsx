import React, { useState } from "react";
import { MdTune, MdKeyboardArrowDown, MdKeyboardArrowUp, MdUnfoldMore, MdCheck } from "react-icons/md";
import { DocumentSettings } from "../types";

export interface DocumentSettingsPanelProps {
  settings: DocumentSettings;
  onSettingsChange: (settings: DocumentSettings) => void;
  onOpenFontModal?: () => void;
}

export const COLOR_PRESETS = [
  { name: "Graphite", value: "#2D3436" },
  { name: "Midnight Ink", value: "#0A2647" },
  { name: "Racing Green", value: "#1B4332" },
  { name: "Oxblood", value: "#4A0E0E" },
  { name: "Dark Petrol", value: "#2C3639" },
  { name: "Aubergine", value: "#3C1874" },
  { name: "Juniper", value: "#1A3636" },
  { name: "Espresso", value: "#4A3728" },
  { name: "Steel Blue", value: "#1B2838" },
  { name: "True Black", value: "#000000" },
] as const;

export const FONT_GROUPS = [
  {
    label: "Sans Serif",
    fonts: [
      "Source Sans 3",
      "IBM Plex Sans",
      "DM Sans",
      "Plus Jakarta Sans",
    ],
  },
  {
    label: "Serif",
    fonts: [
      "EB Garamond",
      "Source Serif 4",
      "Crimson Pro",
      "Newsreader",
      "Playfair Display",
    ],
  },
  {
    label: "Classic",
    fonts: [
      "Arial",
      "Calibri",
      "Cambria",
      "Georgia",
      "Tahoma",
      "Times New Roman",
    ],
  },
] as const;

export const DocumentSettingsPanel: React.FC<DocumentSettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onOpenFontModal,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCustomColor, setShowCustomColor] = useState(false);

  const accentColor = settings.accent_color ?? "#000000";
  const fontFamily = settings.font_family ?? "Source Sans 3";
  const updateSetting = <K extends keyof DocumentSettings>(
    key: K,
    value: DocumentSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const isPresetSelected = COLOR_PRESETS.some(
    (p) => p.value.toLowerCase() === accentColor.toLowerCase()
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-sm">
      {/* Header — always visible, acts as toggle */}
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50/80 transition-colors"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-1.5">
          <MdTune className="text-base text-gray-400" />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Document Settings
          </span>
        </div>
        {isCollapsed ? (
          <MdKeyboardArrowDown className="text-lg text-gray-400" />
        ) : (
          <MdKeyboardArrowUp className="text-lg text-gray-400" />
        )}
      </button>

      {/* Body — compact settings strip */}
      {!isCollapsed && (
        <div className="px-4 pb-4 pt-1 space-y-3">
          {/* Row 1: Colour + Font + Page Numbers — horizontal on desktop, stacked on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Accent Colour */}
            <div className="flex-1 min-w-0">
              <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block mb-1.5">
                Accent Colour
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PRESETS.map((preset) => {
                  const selected =
                    preset.value.toLowerCase() === accentColor.toLowerCase();
                  return (
                    <div key={preset.value} className="relative group">
                      <button
                        type="button"
                        aria-label={`${preset.name} accent colour`}
                        onClick={() => {
                          updateSetting("accent_color", preset.value);
                          setShowCustomColor(false);
                        }}
                        className={`w-7 h-7 rounded-full transition-all duration-150 flex-shrink-0 flex items-center justify-center ${
                          selected
                            ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                            : "hover:scale-110 opacity-85 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: preset.value }}
                      >
                        {selected && (
                          <MdCheck className="text-white text-xs drop-shadow-sm" />
                        )}
                      </button>
                      {/* Tooltip */}
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-10">
                        {preset.name}
                      </span>
                    </div>
                  );
                })}
                {/* Custom colour toggle */}
                <div className="relative group">
                  <button
                    type="button"
                    aria-label="Custom hex colour"
                    onClick={() => setShowCustomColor((prev) => !prev)}
                    className={`w-7 h-7 rounded-full flex-shrink-0 border-2 border-dashed transition-all duration-150 flex items-center justify-center ${
                      !isPresetSelected
                        ? "border-gray-400 ring-2 ring-offset-2 ring-gray-400 scale-110"
                        : "border-gray-300 opacity-60 hover:opacity-100 hover:scale-110"
                    }`}
                    style={
                      !isPresetSelected
                        ? { backgroundColor: accentColor }
                        : undefined
                    }
                  >
                    {isPresetSelected ? (
                      <span className="text-[9px] text-gray-400 font-bold">
                        #
                      </span>
                    ) : (
                      <MdCheck className="text-white text-xs drop-shadow-sm" />
                    )}
                  </button>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-10">
                    Custom
                  </span>
                </div>
              </div>
              {/* Custom colour picker — slides in */}
              {showCustomColor && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => updateSetting("accent_color", e.target.value)}
                    className="w-7 h-7 rounded-md border border-gray-200 cursor-pointer p-0.5 bg-white"
                    aria-label="Pick custom colour"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => updateSetting("accent_color", e.target.value)}
                    placeholder="#000000"
                    maxLength={7}
                    className="w-20 px-2 py-1 text-xs border border-gray-200 rounded-lg font-mono text-gray-600 focus:outline-none focus:ring-1 focus:ring-accent focus:border-transparent"
                    aria-label="Custom hex colour"
                  />
                </div>
              )}
            </div>

            {/* Font + Page Numbers — grouped right */}
            <div className="flex items-end gap-4 sm:gap-3 flex-shrink-0">
              {/* Font */}
              <div>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block mb-1.5">
                  Font
                </span>
                <button
                  type="button"
                  onClick={onOpenFontModal}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-accent/50 hover:shadow-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-transparent cursor-pointer transition-all duration-150 group"
                  aria-label={`Font: ${fontFamily}. Click to change.`}
                >
                  <span
                    className="text-xs font-medium truncate max-w-[120px]"
                    style={{ fontFamily }}
                  >
                    {fontFamily}
                  </span>
                  <MdUnfoldMore className="text-sm text-gray-400 group-hover:text-accent transition-colors flex-shrink-0" />
                </button>
              </div>

              {/* Page Numbers — disabled pending wkhtmltopdf footer fix */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSettingsPanel;
