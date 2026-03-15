import React from 'react';
import { MdExpandLess, MdExpandMore, MdDeleteOutline } from 'react-icons/md';

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
        aria-label="Move section up"
        title="Move section up"
        onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
        disabled={sectionIndex === 0}
        className={`px-2 py-1 rounded flex items-center justify-center ${
          sectionIndex === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-accent hover:bg-accent/90 text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        }`}
      >
        <MdExpandLess className="text-xl" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Move section down"
        title="Move section down"
        onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
        disabled={sectionIndex === sections.length - 1}
        className={`px-2 py-1 rounded flex items-center justify-center ${
          sectionIndex === sections.length - 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-accent hover:bg-accent/90 text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        }`}
      >
        <MdExpandMore className="text-xl" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Delete section"
        title="Delete section"
        onClick={deleteSection}
        className="px-2 py-1 rounded flex items-center justify-center bg-red-500 hover:bg-red-600 text-white focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-colors"
      >
        <MdDeleteOutline className="text-xl" aria-hidden="true" />
      </button>
    </div>
  );
};

export default SectionControls;
