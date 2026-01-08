import { useState } from 'react';
import { SectionType } from '../services/sectionService';

// Position types for section insertion
export type InsertPosition = 'top' | 'bottom' | number;

interface Section {
  name: string;
  type?: string;
}

interface SectionTypeModalProps {
  onClose: () => void;
  onSelect: (type: SectionType, position: InsertPosition) => void;
  supportsIcons?: boolean;
  sections?: Section[];
}

interface SectionTypeOption {
  type: SectionType;
  title: string;
  description: string;
  useFor: string;
}

const SectionTypeModal: React.FC<SectionTypeModalProps> = ({
  onClose,
  onSelect,
  supportsIcons = true,
  sections = [],
}) => {
  const [selectedPosition, setSelectedPosition] = useState<InsertPosition>('top');

  const allSectionTypes: SectionTypeOption[] = [
    {
      type: "experience",
      title: "Experience Section",
      description:
        "Structured format for work experience, projects, or any timeline-based entries with company, title, dates, and achievements.",
      useFor:
        "Work Experience, Independent Projects, Volunteer Work, Research Experience, Teaching Experience, Consulting Projects",
    },
    {
      type: "education",
      title: "Education Section",
      description:
        "Structured format for academic qualifications with degree, institution, year, and field of study.",
      useFor:
        "Education, Certifications, Professional Training, Online Courses, Academic Background, Qualifications",
    },
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

  // Filter out icon-list if template doesn't support icons
  const sectionTypes = supportsIcons
    ? allSectionTypes
    : allSectionTypes.filter(section => section.type !== "icon-list");

  const handlePositionChange = (value: string) => {
    if (value === 'top' || value === 'bottom') {
      setSelectedPosition(value);
    } else {
      // Parse index for "after section X" positions
      const index = parseInt(value, 10);
      if (!isNaN(index)) {
        setSelectedPosition(index);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm sm:max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Select Section Type
        </h2>

        {/* Position Selection */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <label className="block text-sm font-semibold text-blue-800 mb-2">
            Insert Position
          </label>
          <select
            value={typeof selectedPosition === 'number' ? selectedPosition.toString() : selectedPosition}
            onChange={(e) => handlePositionChange(e.target.value)}
            className="w-full border border-blue-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="top">At the top (first section)</option>
            <option value="bottom">At the bottom (last section)</option>
            {sections.length > 0 && (
              <optgroup label="After specific section">
                {sections.map((section, index) => (
                  <option key={index} value={index + 1}>
                    After: {section.name || `Section ${index + 1}`}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {sectionTypes.map((section) => (
            <div
              key={section.type}
              className="p-3 sm:p-4 border rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer flex flex-col transition-all duration-200"
              onClick={() => onSelect(section.type, selectedPosition)}
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
          className="mt-4 sm:mt-6 bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SectionTypeModal;
