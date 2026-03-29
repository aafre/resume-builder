import React, { useState } from "react";
import { MdTune, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { DocumentSettings } from "../types";

export interface DocumentSettingsPanelProps {
  settings: DocumentSettings;
  onSettingsChange: (settings: DocumentSettings) => void;
}

const COLOR_PRESETS = [
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

const FONT_GROUPS = [
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
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCustomColor, setShowCustomColor] = useState(false);

  const accentColor = settings.accent_color ?? "#000000";
  const fontFamily = settings.font_family ?? "Source Sans 3";
  const showPageNumbers = settings.show_page_numbers ?? false;

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
              <div className="flex items-center gap-1.5 flex-wrap">
                {COLOR_PRESETS.map((preset) => {
                  const selected =
                    preset.value.toLowerCase() === accentColor.toLowerCase();
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      title={preset.name}
                      aria-label={`${preset.name} accent colour`}
                      onClick={() => {
                        updateSetting("accent_color", preset.value);
                        setShowCustomColor(false);
                      }}
                      className={`w-5 h-5 rounded-full transition-all duration-150 flex-shrink-0 ${
                        selected
                          ? "ring-[1.5px] ring-offset-1 ring-gray-400 scale-110"
                          : "hover:scale-110 opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: preset.value }}
                    />
                  );
                })}
                {/* Custom colour toggle */}
                <button
                  type="button"
                  title="Custom colour"
                  aria-label="Custom hex colour"
                  onClick={() => setShowCustomColor((prev) => !prev)}
                  className={`w-5 h-5 rounded-full flex-shrink-0 border border-dashed transition-all duration-150 flex items-center justify-center ${
                    !isPresetSelected
                      ? "border-gray-400 ring-[1.5px] ring-offset-1 ring-gray-400 scale-110"
                      : "border-gray-300 opacity-60 hover:opacity-100 hover:scale-110"
                  }`}
                  style={
                    !isPresetSelected
                      ? { backgroundColor: accentColor }
                      : undefined
                  }
                >
                  {isPresetSelected && (
                    <span className="text-[8px] text-gray-400 font-bold">
                      #
                    </span>
                  )}
                </button>
              </div>
              {/* Custom hex input — slides in */}
              {showCustomColor && (
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: accentColor }}
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
                <label
                  htmlFor="doc-font-select"
                  className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block mb-1.5"
                >
                  Font
                </label>
                <select
                  id="doc-font-select"
                  value={fontFamily}
                  onChange={(e) => updateSetting("font_family", e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-accent focus:border-transparent cursor-pointer"
                  style={{ fontFamily }}
                >
                  {FONT_GROUPS.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.fonts.map((font) => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Page Numbers */}
              <div title="Add page numbers to the footer of your PDF">
                <label
                  htmlFor="doc-page-numbers"
                  className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block mb-1.5"
                >
                  Page #
                </label>
                <button
                  id="doc-page-numbers"
                  type="button"
                  role="switch"
                  aria-checked={showPageNumbers}
                  onClick={() =>
                    updateSetting("show_page_numbers", !showPageNumbers)
                  }
                  className={`relative inline-flex h-[26px] w-10 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-accent focus:ring-offset-1 ${
                    showPageNumbers ? "bg-accent" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                      showPageNumbers ? "translate-x-[18px]" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSettingsPanel;
