import React from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

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
        onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
        disabled={sectionIndex === 0}
        aria-label="Move section up"
        title="Move section up"
        className={`p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          sectionIndex === 0
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-accent hover:opacity-90 text-ink"
        }`}
      >
        <ArrowUp size={16} />
      </button>
      <button
        type="button"
        onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
        disabled={sectionIndex === sections.length - 1}
        aria-label="Move section down"
        title="Move section down"
        className={`p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          sectionIndex === sections.length - 1
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-accent hover:opacity-90 text-ink"
        }`}
      >
        <ArrowDown size={16} />
      </button>
      <button
        type="button"
        onClick={deleteSection}
        aria-label="Delete section"
        title="Delete section"
        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default SectionControls;
