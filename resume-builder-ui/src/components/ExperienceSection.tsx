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
    <div className="border p-6 mb-6 bg-white shadow-sm rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Experience</h2>
      {experiences.map((experience, index) => (
        <div
          key={index}
          className="border p-4 mb-4 bg-gray-50 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
            <button
              onClick={() => {
                const updatedExperiences = [...experiences];
                updatedExperiences.splice(index, 1);
                onUpdate(updatedExperiences);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>

          <div className="flex gap-6 mt-4">
            {/* Icon Upload Section */}
            {supportsIcons && (
              <div className="flex-shrink-0">
                <IconUpload
                  onUpload={(renamedIcon, file) =>
                    handleIconUpload(index, renamedIcon, file)
                  }
                  onClear={() => handleIconClear(index)}
                  existingIcon={experience.icon || ""}
                />
              </div>
            )}
            {/* Experience Fields */}
            <div className="flex-grow grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) =>
                    handleUpdateField(index, "company", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={experience.title}
                  onChange={(e) =>
                    handleUpdateField(index, "title", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Dates
                </label>
                <input
                  type="text"
                  value={experience.dates}
                  onChange={(e) =>
                    handleUpdateField(index, "dates", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Description
                </label>
                {experience.description.map((desc, descIndex) => (
                  <div key={descIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={desc}
                      onChange={(e) => {
                        const updatedExperiences = [...experiences];
                        updatedExperiences[index].description[descIndex] =
                          e.target.value;
                        onUpdate(updatedExperiences);
                      }}
                      className="w-full border border-gray-300 rounded-lg p-2"
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
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const updatedExperiences = [...experiences];
                    updatedExperiences[index].description.push("");
                    onUpdate(updatedExperiences);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Description
                </button>
              </div>
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
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
      >
        Add Experience
      </button>
    </div>
  );
};

export default ExperienceSection;
