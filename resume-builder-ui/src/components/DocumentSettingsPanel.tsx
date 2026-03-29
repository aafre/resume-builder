import React, { useState } from "react";
import { MdSettings, MdExpandMore, MdExpandLess } from "react-icons/md";
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

const FONT_OPTIONS = [
  "Arial",
  "Calibri",
  "Cambria",
  "Garamond",
  "Georgia",
  "Tahoma",
  "Times New Roman",
] as const;

export const DocumentSettingsPanel: React.FC<DocumentSettingsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const accentColor = settings.accent_color ?? "#000000";
  const fontFamily = settings.font_family ?? "Arial";
  const showPageNumbers = settings.show_page_numbers ?? false;

  const updateSetting = <K extends keyof DocumentSettings>(
    key: K,
    value: DocumentSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const isPresetSelected = COLOR_PRESETS.some((p) => p.value.toLowerCase() === accentColor.toLowerCase());

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-2">
          <MdSettings className="text-lg text-gray-500" />
          <span className="text-sm font-semibold text-gray-900">
            Document Settings
          </span>
        </div>
        {isCollapsed ? (
          <MdExpandMore className="text-2xl text-gray-500" />
        ) : (
          <MdExpandLess className="text-2xl text-gray-500" />
        )}
      </button>

      {/* Body */}
      {!isCollapsed && (
        <div className="px-5 pb-5 space-y-5 border-t border-gray-100">
          {/* Accent Colour */}
          <div className="pt-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Accent Colour
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((preset) => {
                const selected =
                  preset.value.toLowerCase() === accentColor.toLowerCase();
                return (
                  <button
                    key={preset.value}
                    type="button"
                    title={preset.name}
                    aria-label={`${preset.name} accent colour`}
                    onClick={() => updateSetting("accent_color", preset.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-150 flex-shrink-0 ${
                      selected
                        ? "ring-2 ring-offset-2 ring-gray-400 border-white"
                        : "border-gray-200 hover:scale-110"
                    }`}
                    style={{ backgroundColor: preset.value }}
                  />
                );
              })}
            </div>
            {/* Custom hex input */}
            <div className="flex items-center gap-2 mt-2.5">
              <div
                className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow typing — update on every keystroke
                  updateSetting("accent_color", val);
                }}
                placeholder="#000000"
                maxLength={7}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                aria-label="Custom hex colour"
              />
              {!isPresetSelected && (
                <span className="text-xs text-gray-400">Custom</span>
              )}
            </div>
          </div>

          {/* Font */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="doc-font-select"
              className="text-sm font-medium text-gray-700"
            >
              Font
            </label>
            <select
              id="doc-font-select"
              value={fontFamily}
              onChange={(e) => updateSetting("font_family", e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              style={{ fontFamily }}
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Page Numbers */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="doc-page-numbers"
              className="text-sm font-medium text-gray-700"
            >
              Show Page Numbers
            </label>
            <button
              id="doc-page-numbers"
              type="button"
              role="switch"
              aria-checked={showPageNumbers}
              onClick={() => updateSetting("show_page_numbers", !showPageNumbers)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                showPageNumbers ? "bg-accent" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                  showPageNumbers ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSettingsPanel;
