import React from "react";

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
        className={`px-2 py-1 rounded ${
          sectionIndex === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        ↑
      </button>
      <button
        onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
        disabled={sectionIndex === sections.length - 1}
        className={`px-2 py-1 rounded ${
          sectionIndex === sections.length - 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        ↓
      </button>
      <button
        onClick={deleteSection}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        🗑
      </button>
    </div>
  );
};

export default SectionControls;
