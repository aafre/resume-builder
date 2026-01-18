import { useState } from 'react';
import { MdVerticalAlignTop, MdVerticalAlignBottom } from 'react-icons/md';
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
  const [selectedPosition, setSelectedPosition] = useState<InsertPosition>('bottom');
  const [showAfterSection, setShowAfterSection] = useState(false);

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

  const handleTopBottomSelect = (position: 'top' | 'bottom') => {
    setSelectedPosition(position);
    setShowAfterSection(false);
  };

  const handleAfterSectionSelect = (index: number) => {
    setSelectedPosition(index);
  };

  const isTopOrBottom = selectedPosition === 'top' || selectedPosition === 'bottom';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Select Section Type
        </h2>

        {/* Position Selection - Segmented Control */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <label className="block text-sm font-semibold text-indigo-900 mb-3">
            Where should it go?
          </label>

          {/* Segmented Control */}
          <div className="flex gap-2 p-1 bg-white rounded-lg border border-indigo-200 shadow-sm">
            <button
              type="button"
              onClick={() => handleTopBottomSelect('top')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200
                ${selectedPosition === 'top'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
            >
              <MdVerticalAlignTop className="w-5 h-5" />
              <span>Top of Resume</span>
            </button>
            <button
              type="button"
              onClick={() => handleTopBottomSelect('bottom')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200
                ${selectedPosition === 'bottom'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
            >
              <MdVerticalAlignBottom className="w-5 h-5" />
              <span>Bottom of Resume</span>
            </button>
          </div>

          {/* After Specific Section - Only show if sections exist */}
          {sections.length > 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowAfterSection(!showAfterSection)}
                className={`text-xs font-medium transition-colors ${
                  showAfterSection || !isTopOrBottom
                    ? 'text-indigo-700'
                    : 'text-indigo-500 hover:text-indigo-700'
                }`}
              >
                {showAfterSection ? '− Hide options' : '+ Insert after a specific section'}
              </button>

              {(showAfterSection || !isTopOrBottom) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {sections.map((section, index) => (
                    <button
                      key={`${section.name}-${index}`}
                      type="button"
                      onClick={() => handleAfterSectionSelect(index + 1)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200
                        ${selectedPosition === index + 1
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-700'
                        }`}
                    >
                      After: {section.name || `Section ${index + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
