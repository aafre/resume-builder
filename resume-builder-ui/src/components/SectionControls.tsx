import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

interface SectionControlsProps<T> {
  sectionIndex: number;
  sections: T[];
  setSections: (sections: T[]) => void;
}

const SectionControls = <T,>({ sectionIndex, sections, setSections }: SectionControlsProps<T>) => {
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
        className={`p-1.5 rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus:outline-none focus-visible:ring-blue-500 transition-colors ${
          sectionIndex === 0
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        <ArrowUp size={16} />
      </button>
      <button
        onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
        disabled={sectionIndex === sections.length - 1}
        aria-label="Move section down"
        title="Move section down"
        className={`p-1.5 rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus:outline-none focus-visible:ring-blue-500 transition-colors ${
          sectionIndex === sections.length - 1
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        <ArrowDown size={16} />
      </button>
      <button
        onClick={deleteSection}
        aria-label="Delete section"
        title="Delete section"
        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus:outline-none focus-visible:ring-red-500 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default SectionControls;
