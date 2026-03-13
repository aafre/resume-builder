import React from 'react';
import { MdArrowUpward, MdArrowDownward, MdDelete } from 'react-icons/md';

const SectionControls: React.FC<{
  sectionIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        type="button"
        onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
        disabled={sectionIndex === 0}
        aria-label="Move section up"
        title="Move section up"
        className={`p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          sectionIndex === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-accent hover:bg-accent/90 text-ink"
        }`}
      >
        <MdArrowUpward className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
        disabled={sectionIndex === sections.length - 1}
        aria-label="Move section down"
        title="Move section down"
        className={`p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          sectionIndex === sections.length - 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-accent hover:bg-accent/90 text-ink"
        }`}
      >
        <MdArrowDownward className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={deleteSection}
        aria-label="Delete section"
        title="Delete section"
        className="p-1.5 text-red-600 hover:bg-red-50 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
      >
        <MdDelete className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
};

export default SectionControls;
