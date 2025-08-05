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
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState("");

  useEffect(() => {
    if (section.name.startsWith("New ")) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5000);
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

  const handleAddItems = () => {
    if (bulkMode) {
      const items = bulkText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const updatedContent = [...(section.content || []), ...items];
      onUpdate({ ...section, content: updatedContent });
      setBulkText("");
    } else {
      const updatedContent = [...(section.content || []), ""];
      onUpdate({ ...section, content: updatedContent });
    }
  };

  const BulkControls = () => (
    <>
      <div className="mb-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={bulkMode}
            onChange={() => setBulkMode(!bulkMode)}
          />
          Bulk Add Mode
        </label>
      </div>
      {bulkMode && (
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder="Enter items separated by commas"
          className="w-full border border-gray-300 rounded-lg p-2 mb-2"
        />
      )}
    </>
  );

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
          <h2
            className={`text-xl font-semibold ${
              section.name.startsWith("New ") ? "text-gray-500 italic" : ""
            }`}
          >
            {section.name}
            <button
              onClick={onEditTitle}
              className="ml-2 text-gray-500 hover:text-gray-700"
              title="Edit Title"
            >
              ✏️
            </button>
            {section.name.startsWith("New ") && showHint && (
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

        {section.type === "bulleted-list" && (
          <>
            {Array.isArray(section.content) &&
              section.content.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleContentChange(e.target.value, index)
                    }
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
            <BulkControls />
            <button
              onClick={handleAddItems}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 mt-2"
            >
              Add Item
            </button>
          </>
        )}

        {section.type === "inline-list" && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.isArray(section.content) &&
                section.content.map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-2"
                  >
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleContentChange(e.target.value, index)
                      }
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
            <BulkControls />
            <button
              onClick={handleAddItems}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              Add Item
            </button>
          </>
        )}

        {section.type === "dynamic-column-list" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
              {Array.isArray(section.content) &&
                section.content.map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-50 rounded-lg px-3 py-2 gap-2 border"
                  >
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleContentChange(e.target.value, index)
                      }
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
            <BulkControls />
            <button
              onClick={handleAddItems}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              Add Item
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GenericSection;
