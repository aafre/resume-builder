import React, { useCallback } from "react";
import { MdDelete } from "react-icons/md";
import { RichTextInput } from "./RichTextInput";
import IconManager from "./IconManager";

export interface EducationItemData {
  degree: string;
  school: string;
  year: string;
  field_of_study?: string;
  icon?: string | null;
  iconFile?: File | null;
  iconBase64?: string | null;
}

interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

interface EducationItemProps {
  educationItem: EducationItemData;
  index: number;
  onUpdate: (index: number, updatedEducation: EducationItemData) => void;
  onDelete: (index: number) => void;
  supportsIcons?: boolean;
  iconRegistry?: IconRegistryMethods;
}

const EducationItem: React.FC<EducationItemProps> = React.memo(({
  educationItem,
  index,
  onUpdate,
  onDelete,
  supportsIcons,
  iconRegistry,
}) => {
  const handleUpdateField = useCallback((field: keyof EducationItemData, value: string) => {
    onUpdate(index, { ...educationItem, [field]: value });
  }, [educationItem, index, onUpdate]);

  const handleIconChange = useCallback((filename: string | null, file: File | null) => {
    onUpdate(index, {
      ...educationItem,
      icon: filename,
      iconFile: file,
      iconBase64: null,
    });
  }, [educationItem, index, onUpdate]);

  return (
    <div className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Entry {index + 1}</h3>
        <button
          onClick={() => onDelete(index)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete education entry"
          title="Delete this entry"
          type="button"
        >
          <MdDelete className="text-xl" />
        </button>
      </div>
      <div className="mt-4">
        {supportsIcons && iconRegistry && (
          <div className="mb-4">
            <IconManager
              value={educationItem.icon || null}
              onChange={handleIconChange}
              registerIcon={iconRegistry.registerIcon}
              getIconFile={iconRegistry.getIconFile}
              removeIcon={iconRegistry.removeIcon}
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Degree
            </label>
            <RichTextInput
              value={educationItem.degree}
              onChange={(value) => handleUpdateField("degree", value)}
              placeholder="e.g., Bachelor of Science"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              School
            </label>
            <RichTextInput
              value={educationItem.school}
              onChange={(value) => handleUpdateField("school", value)}
              placeholder="e.g., University Name"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Year
            </label>
            <input
              type="text"
              value={educationItem.year}
              onChange={(e) => handleUpdateField("year", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Field of Study
            </label>
            <RichTextInput
              value={educationItem.field_of_study || ""}
              onChange={(value) => handleUpdateField("field_of_study", value)}
              placeholder="e.g., Computer Science"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default EducationItem;
