import React from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Section } from '../types';

const SectionControls: React.FC<{
  sectionIndex: number;
  sections: Section[];
  setSections: (sections: Section[]) => void;
}> = ({ sectionIndex, sections, setSections }) => {
  const moveSection = (fromIndex: number, toIndex: number) => {
    const newSections = [...sections];
    const [removedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, removedSection);
    setSections(newSections);
  };

  const deleteSection = () => {
    const newSections = [...sections];
    newSections.splice(sectionIndex, 1);
    setSections(newSections);
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
        disabled={sectionIndex === 0}
        aria-label="Move section up"
        title="Move Up"
        className={`p-2 rounded transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${
          sectionIndex === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-50 hover:bg-blue-100 text-blue-600"
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
        disabled={sectionIndex === sections.length - 1}
        aria-label="Move section down"
        title="Move Down"
        className={`p-2 rounded transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${
          sectionIndex === sections.length - 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-50 hover:bg-blue-100 text-blue-600"
        }`}
      >
        <ArrowDown className="w-4 h-4" />
      </button>
      <button
        onClick={deleteSection}
        aria-label="Delete section"
        title="Delete Section"
        className="p-2 rounded transition-colors bg-red-50 hover:bg-red-100 text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus:outline-none"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SectionControls;
