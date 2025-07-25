import React from "react";
import IconUpload from "./IconUpload";

interface ExperienceItem {
  company: string;
  title: string;
  dates: string;
  description: string[];
  icon?: string;
  iconFile?: File;
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  onUpdate: (updatedExperiences: ExperienceItem[]) => void;
  supportsIcons?: boolean;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  onUpdate,
  supportsIcons = false,
}) => {
  const handleUpdateField = (
    index: number,
    field: keyof ExperienceItem,
    value: any
  ) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    onUpdate(updatedExperiences);
  };

  const handleIconUpload = (index: number, renamedIcon: string, file: File) => {
    handleUpdateField(index, "icon", renamedIcon);
    handleUpdateField(index, "iconFile", file);
  };

  const handleIconClear = (index: number) => {
    handleUpdateField(index, "icon", null);
    handleUpdateField(index, "iconFile", null);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Experience</h2>
      </div>
      {experiences.map((experience, index) => (
        <div
          key={index}
          className="bg-gray-50/80 backdrop-blur-sm p-4 sm:p-6 mb-4 sm:mb-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-md"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-800">Experience #{index + 1}</h3>
            <button
              onClick={() => {
                const updatedExperiences = [...experiences];
                updatedExperiences.splice(index, 1);
                onUpdate(updatedExperiences);
              }}
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
                  Company Logo
                </label>
                <div className="flex justify-start">
                  <IconUpload
                    onUpload={(renamedIcon, file) =>
                      handleIconUpload(index, renamedIcon, file)
                    }
                    onClear={() => handleIconClear(index)}
                    existingIcon={experience.icon || null}
                    existingIconFile={experience.iconFile || null}
                  />
                </div>
              </div>
            )}
            
            {/* Basic Experience Fields - Single Column */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <div>
                <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                  Company
                </label>
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) =>
                    handleUpdateField(index, "company", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                  Job Title
                </label>
                <input
                  type="text"
                  value={experience.title}
                  onChange={(e) =>
                    handleUpdateField(index, "title", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                  placeholder="Enter job title"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                  Employment Dates
                </label>
                <input
                  type="text"
                  value={experience.dates}
                  onChange={(e) =>
                    handleUpdateField(index, "dates", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white"
                  placeholder="e.g., Jan 2020 - Present"
                />
              </div>
            </div>

            {/* Job Description Section */}
            <div className="w-full">
              <label className="block text-gray-700 font-semibold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                Job Description & Achievements
              </label>
              <div className="space-y-4 sm:space-y-6">
                {experience.description.map((desc, descIndex) => (
                  <div key={descIndex} className="flex items-start gap-3 sm:gap-4">
                    <textarea
                      value={desc}
                      onChange={(e) => {
                        const updatedExperiences = [...experiences];
                        updatedExperiences[index].description[descIndex] =
                          e.target.value;
                        onUpdate(updatedExperiences);
                      }}
                      className="flex-1 border border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-medium bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white min-h-[100px] resize-y"
                      placeholder="Describe your responsibilities, achievements, or key projects..."
                      rows={3}
                    />
                    <button
                      onClick={() => {
                        const updatedExperiences = [...experiences];
                        updatedExperiences[index].description.splice(
                          descIndex,
                          1
                        );
                        onUpdate(updatedExperiences);
                      }}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 touch-manipulation mt-1"
                      title="Remove description point"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const updatedExperiences = [...experiences];
                  updatedExperiences[index].description.push("");
                  onUpdate(updatedExperiences);
                }}
                className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base touch-manipulation"
              >
                + Add Description Point
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          const newExperience: ExperienceItem = {
            company: "",
            title: "",
            dates: "",
            description: [],
          };
          onUpdate([...experiences, newExperience]);
        }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base touch-manipulation"
      >
        Add Experience
      </button>
    </div>
  );
};

export default ExperienceSection;
