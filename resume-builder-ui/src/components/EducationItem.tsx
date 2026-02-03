import { memo } from "react";
import { MdDelete } from "react-icons/md";
import { RichTextInput } from "./RichTextInput";
import IconManager from "./IconManager";

interface EducationItemType {
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
  item: EducationItemType;
  index: number;
  onUpdate: (index: number, key: keyof EducationItemType, value: string | File | null) => void;
  onRemove: (index: number) => void;
  onIconChange: (index: number, filename: string | null, file: File | null) => void;
  supportsIcons?: boolean;
  iconRegistry?: IconRegistryMethods;
}

const EducationItem = memo(({
  item,
  index,
  onUpdate,
  onRemove,
  onIconChange,
  supportsIcons,
  iconRegistry
}: EducationItemProps) => {
  return (
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
              value={item.icon || null}
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
              value={item.degree}
              onChange={(value) => onUpdate(index, "degree", value)}
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
              onChange={(value) => onUpdate(index, "school", value)}
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
              onChange={(e) =>
                onUpdate(index, "year", e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Field of Study
            </label>
            <RichTextInput
              value={item.field_of_study || ""}
              onChange={(value) => onUpdate(index, "field_of_study", value)}
              placeholder="e.g., Computer Science"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

EducationItem.displayName = "EducationItem";

export default EducationItem;
