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

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-200">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={temporaryTitle}
              onChange={(e) => setTemporaryTitle(e.target.value)}
              className="border border-gray-300 rounded-lg sm:rounded-xl p-3 sm:p-4 w-full text-lg sm:text-xl font-semibold bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
          <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold ${
            section.name.startsWith('New ') ? 'text-gray-500 italic' : 'text-gray-800'
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
          className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors touch-manipulation"
          title="Remove Section"
        >
          Remove
        </button>
      </div>

      <div className="mt-4 sm:mt-6">
        {section.type === "text" && (
          <div className="space-y-2 sm:space-y-3">
            <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg">
              Content
            </label>
            <textarea
              value={section.content || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white min-h-[120px] resize-y"
              placeholder="Enter your content here..."
              rows={4}
            ></textarea>
          </div>
        )}
        {/* Bulleted List - Keep original full-width layout */}
        {section.type === "bulleted-list" && (
          <>
            {Array.isArray(section.content) &&
              section.content.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleContentChange(e.target.value, index)}
                    className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                    placeholder="Enter list item..."
                  />
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
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
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 mt-2 sm:mt-4 text-sm sm:text-base touch-manipulation"
            >
              Add Item
            </button>
          </>
        )}

        {/* Inline List - Compact flex wrap layout */}
        {section.type === "inline-list" && (
          <>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg">
                Items (displayed inline)
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {Array.isArray(section.content) &&
                  section.content.map((item: string, index: number) => (
                    <div key={index} className="flex items-center bg-gray-100/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 sm:py-3 gap-2 border border-gray-200 shadow-sm">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleContentChange(e.target.value, index)}
                        className="bg-transparent border-none outline-none min-w-0 w-auto text-sm sm:text-base font-medium"
                        style={{ width: `${Math.max(item.length + 2, 8)}ch` }}
                        placeholder="Add item"
                      />
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0 touch-manipulation"
                        title="Remove Item"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <button
              onClick={() => {
                const updatedContent = [...(section.content || []), ""];
                onUpdate({ ...section, content: updatedContent });
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base touch-manipulation"
            >
              Add Item
            </button>
          </>
        )}

        {/* Dynamic Column List - CSS Grid layout */}
        {section.type === "dynamic-column-list" && (
          <>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg">
                Items (arranged in columns)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {Array.isArray(section.content) &&
                  section.content.map((item: string, index: number) => (
                    <div key={index} className="flex items-center bg-gray-50/80 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 gap-2 sm:gap-3 border border-gray-200 shadow-sm">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleContentChange(e.target.value, index)}
                        className="bg-transparent border-none outline-none text-sm sm:text-base font-medium flex-grow min-w-0 focus:outline-none"
                        placeholder="Add item"
                      />
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0 touch-manipulation"
                        title="Remove Item"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <button
              onClick={() => {
                const updatedContent = [...(section.content || []), ""];
                onUpdate({ ...section, content: updatedContent });
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base touch-manipulation"
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
