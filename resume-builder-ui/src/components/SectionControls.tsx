import React from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

interface SectionControlsProps {
  sectionIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSections: (sections: any[]) => void;
}

const SectionControls: React.FC<SectionControlsProps> = ({ sectionIndex, sections, setSections }) => {
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
        type="button"
        onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
        disabled={sectionIndex === 0}
        aria-label="Move section up"
        title="Move section up"
        className={`p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          sectionIndex === 0
            ? "text-gray-300 cursor-not-allowed bg-gray-50"
            : "text-gray-600 hover:text-accent hover:bg-accent/10"
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
        disabled={sectionIndex === sections.length - 1}
        aria-label="Move section down"
        title="Move section down"
        className={`p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          sectionIndex === sections.length - 1
            ? "text-gray-300 cursor-not-allowed bg-gray-50"
            : "text-gray-600 hover:text-accent hover:bg-accent/10"
        }`}
      >
        <ArrowDown className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={deleteSection}
        aria-label="Delete section"
        title="Delete section"
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SectionControls;
