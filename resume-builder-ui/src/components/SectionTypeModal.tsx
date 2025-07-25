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
      title: "Bulleted List",
      description: "A bulleted list format for multiple items.",
      useFor:
        "Technical Skills, Hobbies, Key Achievements, Certifications, Volunteer Work, Strengths",
    },
    {
      type: "inline-list",
      title: "Inline List",
      description: "A compact, single-line list without bullets.",
      useFor:
        "Key Skills, Software Proficiencies, Technologies, Languages, Personal Interests",
    },
    {
      type: "dynamic-column-list",
      title: "Dynamic Column List",
      description: "Automatically adjusts columns for space efficiency.",
      useFor:
        "Technical Skills, Certifications, Tools, Key Projects, Accomplishments",
    },
    {
      type: "icon-list",
      title: "Icon List",
      description: "A list of items with optional icons for visual enhancement.",
      useFor:
        "Certifications, Awards, Professional Memberships, Licenses, Achievements",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-6">Select Section Type</h2>
        <div className="space-y-4">
          {sectionTypes.map((section) => (
            <div
              key={section.type}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer flex flex-col"
              onClick={() => onSelect(section.type)}
            >
              <h3 className="font-semibold text-lg">{section.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {section.description}
              </p>
              <p className="text-sm text-gray-500 italic">
                <strong>Use for:</strong> {section.useFor}
              </p>
            </div>
          ))}
        </div>
        <button
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SectionTypeModal;
