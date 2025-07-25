import React, { useState, useEffect } from "react";
import IconUpload from "./IconUpload";

interface Certification {
  certification: string;
  issuer: string;
  date: string;
  icon?: string;
  iconFile?: File;
}

interface IconListSectionProps {
  data: Certification[];
  onUpdate: (updatedData: Certification[]) => void;
  onDelete?: () => void;
  sectionName?: string;
  onEditTitle?: () => void;
  onSaveTitle?: () => void;
  onCancelTitle?: () => void;
  isEditing?: boolean;
  temporaryTitle?: string;
  setTemporaryTitle?: (title: string) => void;
}

const IconListSection: React.FC<IconListSectionProps> = ({
  data,
  onUpdate,
  onDelete,
  sectionName = "Certifications",
  onEditTitle,
  onSaveTitle,
  onCancelTitle,
  isEditing = false,
  temporaryTitle = "",
  setTemporaryTitle,
}) => {
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (sectionName.startsWith('New ')) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5000); // Hide hint after 5 seconds
      
      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [sectionName]);
  const handleUpdateItem = (
    index: number,
    field: keyof Certification,
    value: string | File | null
  ) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    onUpdate(updatedData);
  };

  const handleIconUpload = (index: number, renamedIcon: string, file: File) => {
    handleUpdateItem(index, "icon", renamedIcon);
    handleUpdateItem(index, "iconFile", file);
  };

  const handleIconClear = (index: number) => {
    handleUpdateItem(index, "icon", null);
    handleUpdateItem(index, "iconFile", null);
  };

  const handleAddItem = () => {
    const newItem: Certification = {
      certification: "",
      issuer: "",
      date: "",
      icon: "",
      iconFile: undefined,
    };
    onUpdate([...data, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    onUpdate(updatedData);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-200">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={temporaryTitle}
              onChange={(e) => setTemporaryTitle?.(e.target.value)}
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
            sectionName.startsWith('New ') ? 'text-gray-500 italic' : 'text-gray-800'
          }`}>
            {sectionName}
            {onEditTitle && (
              <button
                onClick={onEditTitle}
                className="ml-2 text-gray-500 hover:text-gray-700"
                title="Edit Title"
              >
                ✏️
              </button>
            )}
            {sectionName.startsWith('New ') && showHint && (
              <span className="ml-2 text-sm text-blue-500 font-normal">
                (Click ✏️ to rename)
              </span>
            )}
          </h2>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors touch-manipulation text-sm sm:text-base"
          >
            Remove
          </button>
        )}
      </div>
      {data.length > 0 ? (
        data.map((item, index) => (
            <div key={index} className="bg-gray-50/80 backdrop-blur-sm p-4 sm:p-6 mb-4 sm:mb-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-md">
              <div className="space-y-4 sm:space-y-6">
                {/* Icon Upload Component */}
                <div>
                  <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                    Icon
                  </label>
                  <div className="flex justify-start">
                    <IconUpload
                      onUpload={(renamedIcon, file) =>
                        handleIconUpload(index, renamedIcon, file)
                      }
                      onClear={() => handleIconClear(index)}
                      existingIcon={item.icon || null}
                      existingIconFile={item.iconFile || null}
                    />
                  </div>
                </div>
                
                {/* Form Fields - Single Column Layout */}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                      Certification/Award Name
                    </label>
                    <input
                      type="text"
                      value={item.certification}
                      onChange={(e) =>
                        handleUpdateItem(index, "certification", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                      placeholder="Enter certification or award name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                      Issuing Organization
                    </label>
                    <input
                      type="text"
                      value={item.issuer}
                      onChange={(e) =>
                        handleUpdateItem(index, "issuer", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                      placeholder="Enter issuing organization"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                      Date Received
                    </label>
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) =>
                        handleUpdateItem(index, "date", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                      placeholder="e.g., March 2023"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                      title="Remove Item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
        ))
      ) : null}
      <button
        onClick={handleAddItem}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base touch-manipulation"
      >
        Add Item
      </button>
    </div>
  );
};

export default IconListSection;
