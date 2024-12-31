import React from "react";

interface ExperienceItem {
  company: string;
  title: string;
  dates: string;
  description: string[];
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  onUpdate: (updatedExperiences: ExperienceItem[]) => void;
  supportsIcons?: boolean;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  onUpdate,
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

  const handleAddDescription = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index].description.push("");
    onUpdate(updatedExperiences);
  };

  const handleUpdateDescription = (
    expIndex: number,
    descIndex: number,
    value: string
  ) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[expIndex].description[descIndex] = value;
    onUpdate(updatedExperiences);
  };

  const handleRemoveDescription = (expIndex: number, descIndex: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[expIndex].description.splice(descIndex, 1);
    onUpdate(updatedExperiences);
  };

  const handleAddExperience = () => {
    const newExperience: ExperienceItem = {
      company: "",
      title: "",
      dates: "",
      description: [],
    };
    onUpdate([...experiences, newExperience]);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    onUpdate(updatedExperiences);
  };

  return (
    <div className="border p-6 mb-6 bg-white shadow-sm rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Experience</h2>
      {experiences.map((experience, index) => (
        <div
          key={index}
          className="border p-4 mb-4 bg-gray-50 rounded-lg shadow-sm"
        >
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
            <button
              onClick={() => handleRemoveExperience(index)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>

          <div className="mb-4">
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

          <div className="mb-4">
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

          <div className="mb-4">
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

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            {experience.description.map((desc, descIndex) => (
              <div key={descIndex} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={desc}
                  onChange={(e) =>
                    handleUpdateDescription(index, descIndex, e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                <button
                  onClick={() => handleRemoveDescription(index, descIndex)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddDescription(index)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Description
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddExperience}
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
      >
        Add Experience
      </button>
    </div>
  );
};

export default ExperienceSection;
