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
        onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
        disabled={sectionIndex === 0}
        aria-label="Move section up"
        title="Move section up"
        className={`px-2 py-1 rounded ${
          sectionIndex === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-accent hover:bg-accent text-ink"
        }`}
      >
        ↑
      </button>
      <button
        onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
        disabled={sectionIndex === sections.length - 1}
        aria-label="Move section down"
        title="Move section down"
        className={`px-2 py-1 rounded ${
          sectionIndex === sections.length - 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-accent hover:bg-accent text-ink"
        }`}
      >
        ↓
      </button>
      <button
        onClick={deleteSection}
        aria-label="Delete section"
        title="Delete section"
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        🗑
      </button>
    </div>
  );
};

export default SectionControls;
