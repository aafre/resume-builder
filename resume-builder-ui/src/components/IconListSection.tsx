import React, { useState, useEffect } from "react";
import IconManager from "./IconManager";

interface Certification {
  certification: string;
  issuer: string;
  date: string;
  icon?: string | null;
  iconFile?: File | null;
  iconBase64?: string | null;
}

// Icon registry methods passed from parent Editor component
interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
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
  iconRegistry?: IconRegistryMethods;
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
  iconRegistry,
}) => {
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (sectionName.startsWith("New ")) {
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

  // Handle icon changes from IconManager
  const handleIconChange = (index: number, filename: string | null, file: File | null) => {
    // Single atomic update - IconManager handles file storage
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      icon: filename,
      iconFile: file, // Keep for transition compatibility
      iconBase64: null, // Clear any old base64 data
    };
    onUpdate(updatedData);
  };

  const handleAddItem = () => {
    const newItem: Certification = {
      certification: "",
      issuer: "",
      date: "",
      icon: null,
      iconFile: null,
      iconBase64: null,
    };
    onUpdate([...data, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    onUpdate(updatedData);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={temporaryTitle}
              onChange={(e) => setTemporaryTitle?.(e.target.value)}
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
              sectionName.startsWith("New ") ? "text-gray-500 italic" : ""
            }`}
          >
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
            {sectionName.startsWith("New ") && showHint && (
              <span className="ml-2 text-sm text-blue-500 font-normal">
                (Click ✏️ to rename)
              </span>
            )}
          </h2>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Remove
          </button>
        )}
      </div>
      {data.length > 0
        ? data.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md"
            >
              <div>
                {/* Icon Manager Component */}
                {iconRegistry && (
                  <div className="mb-4">
                    <IconManager
                      value={item.icon || null}
                      onChange={(filename, file) => handleIconChange(index, filename, file)}
                      registerIcon={iconRegistry.registerIcon}
                      getIconFile={iconRegistry.getIconFile}
                      removeIcon={iconRegistry.removeIcon}
                    />
                  </div>
                )}

                {/* Form Fields */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Certification
                      </label>
                      <input
                        type="text"
                        value={item.certification}
                        onChange={(e) =>
                          handleUpdateItem(
                            index,
                            "certification",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Issuer
                      </label>
                      <input
                        type="text"
                        value={item.issuer}
                        onChange={(e) =>
                          handleUpdateItem(index, "issuer", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">
                        Date
                      </label>
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) =>
                          handleUpdateItem(index, "date", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800 text-lg"
                      title="Remove Certification"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        : null}
      <button
        onClick={handleAddItem}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
      >
        Add Item
      </button>
    </div>
  );
};

export default IconListSection;
