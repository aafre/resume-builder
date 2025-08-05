import IconManager from "./IconManager";

interface ExperienceItem {
  company: string;
  title: string;
  dates: string;
  description: string[];
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

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  onUpdate: (updatedExperiences: ExperienceItem[]) => void;
  supportsIcons?: boolean;
  iconRegistry?: IconRegistryMethods;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  onUpdate,
  supportsIcons = false,
  iconRegistry,
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

  // Handle icon changes from IconManager
  const handleIconChange = (index: number, filename: string | null, file: File | null) => {
    // Single atomic update - IconManager handles file storage
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      icon: filename,
      iconFile: file, // Keep for transition compatibility
      iconBase64: null, // Clear any old base64 data
    };
    onUpdate(updatedExperiences);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
      </div>
      {experiences.map((experience, index) => (
        <div
          key={index}
          className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md"
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

          <div className="mt-4">
            {/* Icon Manager Section */}
            {supportsIcons && iconRegistry && (
              <div className="mb-4">
                <IconManager
                  value={experience.icon || null}
                  onChange={(filename, file) => handleIconChange(index, filename, file)}
                  registerIcon={iconRegistry.registerIcon}
                  getIconFile={iconRegistry.getIconFile}
                  removeIcon={iconRegistry.removeIcon}
                />
              </div>
            )}

            {/* Basic Experience Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter company name"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter job title"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="e.g., Jan 2020 - Present"
                />
              </div>
            </div>

            {/* Full Width Description Section */}
            <div className="w-full">
              <label className="block text-gray-700 font-medium mb-3">
                Job Description & Achievements
              </label>
              <div className="space-y-3">
                {experience.description.map((desc, descIndex) => (
                  <div key={descIndex} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={desc}
                      onChange={(e) => {
                        const updatedExperiences = [...experiences];
                        updatedExperiences[index].description[descIndex] =
                          e.target.value;
                        onUpdate(updatedExperiences);
                      }}
                      className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Describe your responsibilities, achievements, or key projects..."
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
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
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
                className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
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
            icon: null,
            iconFile: null,
            iconBase64: null,
          };
          onUpdate([...experiences, newExperience]);
        }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
      >
        Add Experience
      </button>
    </div>
  );
};

export default ExperienceSection;
