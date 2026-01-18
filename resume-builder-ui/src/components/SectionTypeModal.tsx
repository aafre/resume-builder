import { useState } from 'react';
import { SectionType } from '../services/sectionService';
import {
  ExperienceVisual,
  EducationVisual,
  TextVisual,
  BulletedListVisual,
  InlineListVisual,
  SmartTableVisual,
  CertificationVisual,
} from './sectionVisuals';

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
  Visual: React.FC<{ className?: string }>;
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
      title: "Experience",
      description: "Work history with company, title, dates, and achievements.",
      Visual: ExperienceVisual,
    },
    {
      type: "education",
      title: "Education",
      description: "Academic qualifications with degree, school, and year.",
      Visual: EducationVisual,
    },
    {
      type: "text",
      title: "Text Block",
      description: "Simple paragraph for summaries or statements.",
      Visual: TextVisual,
    },
    {
      type: "bulleted-list",
      title: "Bulleted List",
      description: "Traditional vertical list with bullet points.",
      Visual: BulletedListVisual,
    },
    {
      type: "inline-list",
      title: "Inline List",
      description: "Items displayed horizontally, flowing like tags.",
      Visual: InlineListVisual,
    },
    {
      type: "dynamic-column-list",
      title: "Smart Table",
      description: "Auto-arranges items in columns for space efficiency.",
      Visual: SmartTableVisual,
    },
    {
      type: "icon-list",
      title: "Certifications",
      description: "Professional certifications with issuer and dates.",
      Visual: CertificationVisual,
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
      <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sectionTypes.map((section) => (
            <button
              key={section.type}
              onClick={() => onSelect(section.type, selectedPosition)}
              className="group flex flex-col text-left bg-white rounded-xl border border-gray-200
                         overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400
                         hover:ring-2 hover:ring-blue-100 transition-all duration-200"
            >
              {/* Visual Area */}
              <div className="h-28 sm:h-32 bg-gray-50 p-4 flex items-center justify-center
                              group-hover:bg-blue-50/30 transition-colors">
                <section.Visual className="w-full h-full" />
              </div>

              {/* Content Area */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                  {section.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{section.description}</p>
              </div>
            </button>
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
