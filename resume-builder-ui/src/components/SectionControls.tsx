import React from "react";
import { MdArrowUpward, MdArrowDownward, MdDelete } from "react-icons/md";

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
        type="button"
        aria-label="Move section up"
        title="Move section up"
        onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
        disabled={sectionIndex === 0}
        className={`px-2 py-1 rounded focus-visible:ring-2 focus-visible:ring-accent focus:outline-none transition-colors duration-150 ${
          sectionIndex === 0
            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        }`}
      >
        <MdArrowUpward className="text-lg" />
      </button>
      <button
        type="button"
        aria-label="Move section down"
        title="Move section down"
        onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
        disabled={sectionIndex === sections.length - 1}
        className={`px-2 py-1 rounded focus-visible:ring-2 focus-visible:ring-accent focus:outline-none transition-colors duration-150 ${
          sectionIndex === sections.length - 1
            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        }`}
      >
        <MdArrowDownward className="text-lg" />
      </button>
      <button
        type="button"
        aria-label="Delete section"
        title="Delete section"
        onClick={deleteSection}
        className="px-2 py-1 rounded text-red-600 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-accent focus:outline-none transition-colors duration-150"
      >
        <MdDelete className="text-lg" />
      </button>
    </div>
  );
};

export default SectionControls;
