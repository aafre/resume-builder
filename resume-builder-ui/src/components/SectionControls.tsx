import React from 'react';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

const SectionControls: React.FC<{
  sectionIndex: number;
  sections: any[];
  setSections: (sections: any[]) => void;
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
        title="Move section up"
        className={`p-1.5 rounded flex items-center justify-center transition-colors ${
          sectionIndex === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200"
        }`}
      >
        <ChevronUp size={16} />
      </button>
      <button
        onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
        disabled={sectionIndex === sections.length - 1}
        aria-label="Move section down"
        title="Move section down"
        className={`p-1.5 rounded flex items-center justify-center transition-colors ${
          sectionIndex === sections.length - 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200"
        }`}
      >
        <ChevronDown size={16} />
      </button>
      <button
        onClick={deleteSection}
        aria-label="Delete section"
        title="Delete section"
        className="p-1.5 rounded flex items-center justify-center transition-colors bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default SectionControls;
