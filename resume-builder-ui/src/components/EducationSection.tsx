import React from "react";
import IconUpload from "./IconUpload";

interface EducationItem {
  degree: string;
  school: string;
  year: string;
  field_of_study?: string;
  icon?: string;
  iconFile?: File;
}

interface EducationSectionProps {
  education: EducationItem[];
  onUpdate: (updatedEducation: EducationItem[]) => void;
  supportsIcons?: boolean;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  onUpdate,
  supportsIcons = false,
}) => {
  const handleUpdateItem = (
    index: number,
    key: keyof EducationItem,
    value: string | File | null
  ) => {
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [key]: value };
    onUpdate(updatedEducation);
  };

  const handleAddItem = () => {
    const newEducation: EducationItem = {
      degree: "",
      school: "",
      year: "",
      field_of_study: "",
      icon: "",
      iconFile: undefined,
    };
    onUpdate([...education, newEducation]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    onUpdate(updatedEducation);
  };

  const handleIconUpload = (index: number, renamedIcon: string, file: File) => {
    handleUpdateItem(index, "icon", renamedIcon);
    handleUpdateItem(index, "iconFile", file);
  };

  const handleIconClear = (index: number) => {
    handleUpdateItem(index, "icon", null);
    handleUpdateItem(index, "iconFile", null);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Education</h2>
      </div>
      {education.map((item, index) => (
        <div
          key={index}
          className="bg-gray-50/80 backdrop-blur-sm p-4 sm:p-6 mb-4 sm:mb-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-md"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Education #{index + 1}</h3>
            <button
              onClick={() => handleRemoveItem(index)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors touch-manipulation text-sm sm:text-base"
            >
              Remove
            </button>
          </div>
          <div>
            {/* Icon Section */}
            {supportsIcons && (
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                  School Logo
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
            )}
            
            {/* Education Fields - Single Column */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                  Degree
                </label>
                <input
                  type="text"
                  value={item.degree}
                  onChange={(e) =>
                    handleUpdateItem(index, "degree", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                  placeholder="e.g., Bachelor of Science"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                  School/University
                </label>
                <input
                  type="text"
                  value={item.school}
                  onChange={(e) =>
                    handleUpdateItem(index, "school", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                  placeholder="Enter school or university name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={item.year}
                  onChange={(e) =>
                    handleUpdateItem(index, "year", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                  placeholder="e.g., 2023"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                  Field of Study (Optional)
                </label>
                <input
                  type="text"
                  value={item.field_of_study || ""}
                  onChange={(e) =>
                    handleUpdateItem(index, "field_of_study", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddItem}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 mt-4 text-sm sm:text-base touch-manipulation"
      >
        Add Education
      </button>
    </div>
  );
};

export default EducationSection;
