import React from "react";

interface SectionTypeModalProps {
  onClose: () => void;
  onSelect: (type: string) => void;
}

const SectionTypeModal: React.FC<SectionTypeModalProps> = ({
  onClose,
  onSelect,
}) => {
  const sectionTypes = [
    {
      type: "text",
      title: "Text Section",
      description: "A simple text block for single-paragraph sections.",
      useFor: "Summary, Objective, About Me, Career Goal, Personal Statement",
    },
    {
      type: "bulleted-list",
      title: "List with Bullets",
      description: "Traditional bulleted list format with clear visual separation.",
      useFor:
        "Technical Skills, Hobbies, Key Achievements, Certifications, Volunteer Work, Strengths",
    },
    {
      type: "inline-list",
      title: "Horizontal List",
      description: "Items displayed in a single row, separated by commas.",
      useFor:
        "Key Skills, Software Proficiencies, Technologies, Languages, Personal Interests",
    },
    {
      type: "dynamic-column-list",
      title: "Smart Table",
      description: "Automatically arranges items in columns for optimal space usage.",
      useFor:
        "Technical Skills, Certifications, Tools, Key Projects, Accomplishments",
    },
    {
      type: "icon-list",
      title: "Bullet List with Icons",
      description: "Traditional bulleted list enhanced with visual icons for each item.",
      useFor:
        "Certifications, Awards, Professional Memberships, Licenses, Achievements",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl max-w-sm sm:max-w-lg lg:max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Select Section Type</h2>
        <div className="space-y-3 sm:space-y-4">
          {sectionTypes.map((section) => (
            <div
              key={section.type}
              className="p-3 sm:p-4 lg:p-5 border border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md cursor-pointer flex flex-col transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/50 touch-manipulation"
              onClick={() => onSelect(section.type)}
            >
              <h3 className="font-semibold text-base sm:text-lg lg:text-xl text-gray-800 mb-2">{section.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed">
                {section.description}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 italic">
                <strong className="text-gray-700">Use for:</strong> {section.useFor}
              </p>
            </div>
          ))}
        </div>
        <button
          className="mt-4 sm:mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl w-full font-semibold text-sm sm:text-base transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg touch-manipulation"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SectionTypeModal;
