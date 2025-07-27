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
      description:
        "Traditional bulleted list format with clear visual separation.",
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
      description:
        "Automatically arranges items in columns for optimal space usage.",
      useFor:
        "Technical Skills, Certifications, Tools, Key Projects, Accomplishments",
    },
    {
      type: "icon-list",
      title: "Bullet List with Icons",
      description:
        "Traditional bulleted list enhanced with visual icons for each item.",
      useFor:
        "Certifications, Awards, Professional Memberships, Licenses, Achievements",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm sm:max-w-xl w-full">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Select Section Type
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {sectionTypes.map((section) => (
            <div
              key={section.type}
              className="p-3 sm:p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer flex flex-col"
              onClick={() => onSelect(section.type)}
            >
              <h3 className="font-semibold text-base sm:text-lg">
                {section.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                {section.description}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 italic">
                <strong>Use for:</strong> {section.useFor}
              </p>
            </div>
          ))}
        </div>
        <button
          className="mt-4 sm:mt-6 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SectionTypeModal;
