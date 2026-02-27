import React, { useCallback } from "react";
import IconManager from "./IconManager";
import { RichTextInput } from "./RichTextInput";
import { MdDelete } from "react-icons/md";

export interface EducationItemData {
  degree: string;
  school: string;
  year: string;
  field_of_study?: string;
  icon?: string | null;
  iconFile?: File | null;
  iconBase64?: string | null;
}

export type EditableEducationField = 'degree' | 'school' | 'year' | 'field_of_study';

interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

interface EducationItemProps {
  education: EducationItemData;
  index: number;
  supportsIcons?: boolean;
  iconRegistry?: IconRegistryMethods;
  onUpdate: (index: number, updatedEducation: EducationItemData) => void;
  onDeleteEntry?: (index: number) => void;
  onDirectDelete: (index: number) => void;
}

const EducationItem: React.FC<EducationItemProps> = React.memo(({
  education,
  index,
  supportsIcons,
  iconRegistry,
  onUpdate,
  onDeleteEntry,
  onDirectDelete,
}) => {
  const handleFieldChange = useCallback((field: EditableEducationField, value: string) => {
    onUpdate(index, { ...education, [field]: value });
  }, [education, index, onUpdate]);

  const handleIconChange = useCallback((filename: string | null, file: File | null) => {
    onUpdate(index, {
      ...education,
      icon: filename,
      iconFile: file,
      iconBase64: null,
    });
  }, [education, index, onUpdate]);

  return (
    <div className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Entry {index + 1}</h3>
        <button
          onClick={() => {
            if (onDeleteEntry) {
              onDeleteEntry(index);
            } else {
              onDirectDelete(index);
            }
          }}
          type="button"
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete education entry"
          title="Delete this entry"
        >
          <MdDelete className="text-xl" />
        </button>
      </div>
      <div className="mt-4">
        {supportsIcons && iconRegistry && (
          <div className="mb-4">
            <IconManager
              value={education.icon || null}
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
              value={education.degree}
              onChange={(value) => handleFieldChange("degree", value)}
              placeholder="e.g., Bachelor of Science"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              School
            </label>
            <RichTextInput
              value={education.school}
              onChange={(value) => handleFieldChange("school", value)}
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
              value={education.year}
              onChange={(e) => handleFieldChange("year", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Field of Study
            </label>
            <RichTextInput
              value={education.field_of_study || ""}
              onChange={(value) => handleFieldChange("field_of_study", value)}
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
