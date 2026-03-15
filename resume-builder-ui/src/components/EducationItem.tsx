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

export interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

interface EducationItemProps {
  item: EducationItemData;
  index: number;
  supportsIcons: boolean;
  iconRegistry?: IconRegistryMethods;
  onUpdateItem: (index: number, key: keyof EducationItemData, value: string | File | null) => void;
  onRemoveItem: (index: number) => void;
  onIconChange: (index: number, filename: string | null, file: File | null) => void;
}

const EducationItem: React.FC<EducationItemProps> = React.memo(({
  item,
  index,
  supportsIcons,
  iconRegistry,
  onUpdateItem,
  onRemoveItem,
  onIconChange,
}) => {

  const handleDelete = useCallback(() => {
    onRemoveItem(index);
  }, [index, onRemoveItem]);

  const handleDegreeChange = useCallback((value: string) => {
    onUpdateItem(index, "degree", value);
  }, [index, onUpdateItem]);

  const handleSchoolChange = useCallback((value: string) => {
    onUpdateItem(index, "school", value);
  }, [index, onUpdateItem]);

  const handleYearChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateItem(index, "year", e.target.value);
  }, [index, onUpdateItem]);

  const handleFieldOfStudyChange = useCallback((value: string) => {
    onUpdateItem(index, "field_of_study", value);
  }, [index, onUpdateItem]);

  const handleIconManagerChange = useCallback((filename: string | null, file: File | null) => {
    onIconChange(index, filename, file);
  }, [index, onIconChange]);

  return (
    <div className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Entry {index + 1}</h3>
        <button
          onClick={handleDelete}
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
              value={item.icon || null}
              onChange={handleIconManagerChange}
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
              value={item.degree}
              onChange={handleDegreeChange}
              placeholder="e.g., Bachelor of Science"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              School
            </label>
            <RichTextInput
              value={item.school}
              onChange={handleSchoolChange}
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
              value={item.year}
              onChange={handleYearChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Field of Study
            </label>
            <RichTextInput
              value={item.field_of_study || ""}
              onChange={handleFieldOfStudyChange}
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
