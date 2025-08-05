import React, { useState, useEffect } from "react";

interface Section {
  name: string;
  type?: string;
  content: any;
}

interface GenericSectionProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
  onEditTitle: () => void;
  onSaveTitle: () => void;
  onCancelTitle: () => void;
  onDelete: () => void;
  isEditing: boolean;
  temporaryTitle: string;
  setTemporaryTitle: (title: string) => void;
}

const GenericSection: React.FC<GenericSectionProps> = ({
  section,
  onUpdate,
  onEditTitle,
  onSaveTitle,
  onCancelTitle,
  onDelete,
  isEditing,
  temporaryTitle,
  setTemporaryTitle,
}) => {
  const [showHint, setShowHint] = useState(true);
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [bulkInputText, setBulkInputText] = useState("");
  const [bulkDelimiter, setBulkDelimiter] = useState(",");
  const [bulkMode, setBulkMode] = useState<"add" | "replace">("add");
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSuccess, setBulkSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (section.name.startsWith('New ')) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5000); // Hide hint after 5 seconds
      
      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [section.name]);
  const handleContentChange = (value: string | string[], index?: number) => {
    if (Array.isArray(section.content)) {
      const updatedContent = [...section.content];
      if (index !== undefined) {
        updatedContent[index] = value as string;
      } else {
        updatedContent.push(value as string);
      }
      onUpdate({ ...section, content: updatedContent });
    } else {
      onUpdate({ ...section, content: value });
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedContent = section.content.filter(
      (_: string, i: number) => i !== index
    );
    onUpdate({ ...section, content: updatedContent });
  };

  const parseBulkInput = (text: string, delimiter: string): string[] => {
    if (!text.trim()) return [];
    
    return text
      .split(delimiter)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const handleBulkInputApply = () => {
    setBulkError(null);
    setBulkSuccess(null);

    if (!bulkInputText.trim()) {
      setBulkError("Please enter some items to add.");
      return;
    }

    const parsedItems = parseBulkInput(bulkInputText, bulkDelimiter);
    
    if (parsedItems.length === 0) {
      // Check if user might be using wrong delimiter
      const hasCommas = bulkInputText.includes(',');
      const hasSemicolons = bulkInputText.includes(';');
      const hasNewlines = bulkInputText.includes('\n');
      const hasPipes = bulkInputText.includes('|');
      
      let suggestedDelimiter = '';
      if (bulkDelimiter === ',' && (hasSemicolons || hasNewlines || hasPipes)) {
        suggestedDelimiter = hasSemicolons ? 'semicolon' : hasNewlines ? 'newline' : 'pipe';
      } else if (bulkDelimiter === ';' && (hasCommas || hasNewlines || hasPipes)) {
        suggestedDelimiter = hasCommas ? 'comma' : hasNewlines ? 'newline' : 'pipe';
      } else if (bulkDelimiter === '\n' && (hasCommas || hasSemicolons || hasPipes)) {
        suggestedDelimiter = hasCommas ? 'comma' : hasSemicolons ? 'semicolon' : 'pipe';
      } else if (bulkDelimiter === '|' && (hasCommas || hasSemicolons || hasNewlines)) {
        suggestedDelimiter = hasCommas ? 'comma' : hasSemicolons ? 'semicolon' : 'newline';
      }
      
      if (suggestedDelimiter) {
        setBulkError(`No items found with ${bulkDelimiter === '\n' ? 'newline' : bulkDelimiter} delimiter. Try switching to ${suggestedDelimiter} delimiter.`);
      } else {
        setBulkError(`No valid items found. Please check your input and delimiter.`);
      }
      return;
    }

    let updatedContent: string[];
    if (bulkMode === "replace") {
      updatedContent = parsedItems;
    } else {
      updatedContent = [...(section.content || []), ...parsedItems];
    }

    onUpdate({ ...section, content: updatedContent });
    
    // Show success message
    setBulkSuccess(`Successfully ${bulkMode === "replace" ? "updated with" : "added"} ${parsedItems.length} item${parsedItems.length === 1 ? '' : 's'}!`);
    
    // Clear input and close panel after a delay
    setTimeout(() => {
      setBulkInputText("");
      setBulkSuccess(null);
      setShowBulkInput(false);
    }, 2000);
  };

  const handleBulkInputCancel = () => {
    setBulkInputText("");
    setBulkError(null);
    setBulkSuccess(null);
    setShowBulkInput(false);
  };

  const populateExistingItems = () => {
    if (Array.isArray(section.content)) {
      const existingText = section.content.join(bulkDelimiter + " ");
      setBulkInputText(existingText);
    }
  };

  const handleBulkInputToggle = () => {
    setBulkError(null);
    setBulkSuccess(null);
    if (!showBulkInput && bulkMode === "replace") {
      populateExistingItems();
    }
    setShowBulkInput(!showBulkInput);
  };

  React.useEffect(() => {
    if (showBulkInput && bulkMode === "replace") {
      populateExistingItems();
    } else if (showBulkInput && bulkMode === "add") {
      setBulkInputText("");
    }
  }, [bulkMode, showBulkInput, bulkDelimiter]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={temporaryTitle}
              onChange={(e) => setTemporaryTitle(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full text-xl font-semibold"
              autoFocus
            />
            <button
              onClick={onSaveTitle}
              className="text-green-600 hover:text-green-800"
              title="Save Title"
            >
              ✅
            </button>
            <button
              onClick={onCancelTitle}
              className="text-red-600 hover:text-red-800"
              title="Cancel"
            >
              ✕
            </button>
          </div>
        ) : (
          <h2 className={`text-xl font-semibold ${
            section.name.startsWith('New ') ? 'text-gray-500 italic' : ''
          }`}>
            {section.name}
            <button
              onClick={onEditTitle}
              className="ml-2 text-gray-500 hover:text-gray-700"
              title="Edit Title"
            >
              ✏️
            </button>
            {section.name.startsWith('New ') && showHint && (
              <span className="ml-2 text-sm text-blue-500 font-normal">
                (Click ✏️ to rename)
              </span>
            )}
          </h2>
        )}
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded-lg"
          title="Remove Section"
        >
          Remove
        </button>
      </div>

      <div className="mt-4">
        {section.type === "text" && (
          <textarea
            value={section.content || ""}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          ></textarea>
        )}
        {/* Bulleted List - Keep original full-width layout */}
        {section.type === "bulleted-list" && (
          <>
            {Array.isArray(section.content) &&
              section.content.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleContentChange(e.target.value, index)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove Item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            <button
              onClick={() => {
                const updatedContent = [...(section.content || []), ""];
                onUpdate({ ...section, content: updatedContent });
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 mt-2"
            >
              Add Item
            </button>
          </>
        )}

        {/* Inline List - Compact flex wrap layout */}
        {section.type === "inline-list" && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.isArray(section.content) &&
                section.content.map((item: string, index: number) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContentChange(e.target.value, index)}
                      className="bg-transparent border-none outline-none text-sm min-w-0 w-auto"
                      style={{ width: `${Math.max(item.length + 2, 8)}ch` }}
                      placeholder="Add skill"
                    />
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Remove Item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const updatedContent = [...(section.content || []), ""];
                  onUpdate({ ...section, content: updatedContent });
                }}
                disabled={showBulkInput}
                className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm ${
                  showBulkInput ? 'opacity-50 cursor-not-allowed transform-none hover:shadow-lg' : ''
                }`}
              >
                Add Item
              </button>
              <button
                onClick={handleBulkInputToggle}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1"
                title="Bulk Edit"
              >
                📝 Bulk
              </button>
            </div>
            {showBulkInput && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-4 mt-3">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="add-mode"
                      name="bulk-mode"
                      checked={bulkMode === "add"}
                      onChange={() => setBulkMode("add")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="add-mode" className="text-sm text-gray-700">Add New Items</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="replace-mode"
                      name="bulk-mode"
                      checked={bulkMode === "replace"}
                      onChange={() => setBulkMode("replace")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="replace-mode" className="text-sm text-gray-700">Edit All Items</label>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <label className="text-sm text-gray-700">Delimiter:</label>
                    <select
                      value={bulkDelimiter}
                      onChange={(e) => setBulkDelimiter(e.target.value)}
                      className="border border-gray-300 rounded-lg p-1 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\n">Newline</option>
                      <option value="|">Pipe (|)</option>
                    </select>
                  </div>
                </div>
                <textarea
                  value={bulkInputText}
                  onChange={(e) => {
                    setBulkInputText(e.target.value);
                    if (bulkError) setBulkError(null);
                    if (bulkSuccess) setBulkSuccess(null);
                  }}
                  placeholder={`Enter items separated by ${bulkDelimiter === '\n' ? 'newlines' : bulkDelimiter}...\nExample: ${bulkDelimiter === '\n' ? 'JavaScript\nReact\nNode.js' : `JavaScript${bulkDelimiter} React${bulkDelimiter} Node.js`}`}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  rows={4}
                />
                {/* Error and Success Messages */}
                {bulkError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">⚠️</span>
                      <span className="text-red-700 text-sm">{bulkError}</span>
                    </div>
                  </div>
                )}
                {bulkSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span className="text-green-700 text-sm">{bulkSuccess}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3 justify-between">
                  <div className="text-xs text-gray-500">
                    {bulkInputText.trim() && !bulkError && !bulkSuccess && (
                      <span>Will {bulkMode === "add" ? "add" : "replace with"} {parseBulkInput(bulkInputText, bulkDelimiter).length} item(s)</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkInputCancel}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkInputApply}
                      disabled={!bulkInputText.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Apply Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Dynamic Column List - CSS Grid layout */}
        {section.type === "dynamic-column-list" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
              {Array.isArray(section.content) &&
                section.content.map((item: string, index: number) => (
                  <div key={index} className="flex items-center bg-gray-50 rounded-lg px-3 py-2 gap-2 border">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContentChange(e.target.value, index)}
                      className="bg-transparent border-none outline-none text-sm flex-grow min-w-0"
                      placeholder="Add item"
                    />
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 text-sm flex-shrink-0"
                      title="Remove Item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const updatedContent = [...(section.content || []), ""];
                  onUpdate({ ...section, content: updatedContent });
                }}
                disabled={showBulkInput}
                className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm ${
                  showBulkInput ? 'opacity-50 cursor-not-allowed transform-none hover:shadow-lg' : ''
                }`}
              >
                Add Item
              </button>
              <button
                onClick={handleBulkInputToggle}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1"
                title="Bulk Edit"
              >
                📝 Bulk
              </button>
            </div>
            {showBulkInput && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-4 mt-3">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="add-mode-dynamic"
                      name="bulk-mode-dynamic"
                      checked={bulkMode === "add"}
                      onChange={() => setBulkMode("add")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="add-mode-dynamic" className="text-sm text-gray-700">Add New Items</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="replace-mode-dynamic"
                      name="bulk-mode-dynamic"
                      checked={bulkMode === "replace"}
                      onChange={() => setBulkMode("replace")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="replace-mode-dynamic" className="text-sm text-gray-700">Edit All Items</label>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <label className="text-sm text-gray-700">Delimiter:</label>
                    <select
                      value={bulkDelimiter}
                      onChange={(e) => setBulkDelimiter(e.target.value)}
                      className="border border-gray-300 rounded-lg p-1 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\n">Newline</option>
                      <option value="|">Pipe (|)</option>
                    </select>
                  </div>
                </div>
                <textarea
                  value={bulkInputText}
                  onChange={(e) => {
                    setBulkInputText(e.target.value);
                    if (bulkError) setBulkError(null);
                    if (bulkSuccess) setBulkSuccess(null);
                  }}
                  placeholder={`Enter items separated by ${bulkDelimiter === '\n' ? 'newlines' : bulkDelimiter}...\nExample: ${bulkDelimiter === '\n' ? 'Python\nMachine Learning\nData Analysis' : `Python${bulkDelimiter} Machine Learning${bulkDelimiter} Data Analysis`}`}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  rows={4}
                />
                {/* Error and Success Messages */}
                {bulkError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">⚠️</span>
                      <span className="text-red-700 text-sm">{bulkError}</span>
                    </div>
                  </div>
                )}
                {bulkSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span className="text-green-700 text-sm">{bulkSuccess}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3 justify-between">
                  <div className="text-xs text-gray-500">
                    {bulkInputText.trim() && !bulkError && !bulkSuccess && (
                      <span>Will {bulkMode === "add" ? "add" : "replace with"} {parseBulkInput(bulkInputText, bulkDelimiter).length} item(s)</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkInputCancel}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkInputApply}
                      disabled={!bulkInputText.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Apply Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GenericSection;
