import React, { memo } from "react";
import IconManager from "./IconManager";
import { RichTextInput } from "./RichTextInput";
import { MdDelete } from "react-icons/md";
import SortableItem from "./SortableItem";

export interface EducationItemData {
  degree: string;
  school: string;
  year: string;
  field_of_study?: string;
  icon?: string | null;
  iconFile?: File | null;
  iconBase64?: string | null;
}

export type EducationItemValue = string | File | null | undefined;

export interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

interface EducationItemProps {
  id: string;
  index: number;
  data: EducationItemData;
  onChange: (index: number, key: keyof EducationItemData, value: EducationItemValue) => void;
  onIconChange: (index: number, filename: string | null, file: File | null) => void;
  onRemove: (index: number) => void;
  supportsIcons?: boolean;
  iconRegistry?: IconRegistryMethods;
}

const EducationItem: React.FC<EducationItemProps> = memo(({
  id,
  index,
  data,
  onChange,
  onIconChange,
  onRemove,
  supportsIcons,
  iconRegistry,
}) => {
  return (
    <SortableItem id={id}>
      <div className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Entry {index + 1}</h3>
          <button
            onClick={() => onRemove(index)}
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
                value={data.icon || null}
                onChange={(filename, file) => onIconChange(index, filename, file)}
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
                value={data.degree}
                onChange={(value) => onChange(index, "degree", value)}
                placeholder="e.g., Bachelor of Science"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                School
              </label>
              <RichTextInput
                value={data.school}
                onChange={(value) => onChange(index, "school", value)}
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
                value={data.year}
                onChange={(e) =>
                  onChange(index, "year", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Field of Study
              </label>
              <RichTextInput
                value={data.field_of_study || ""}
                onChange={(value) => onChange(index, "field_of_study", value)}
                placeholder="e.g., Computer Science"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      </div>
    </SortableItem>
  );
});

export default EducationItem;
