import React, { useState } from 'react';
import { MdArrowUpward, MdArrowDownward, MdDeleteOutline } from 'react-icons/md';
import ResponsiveConfirmDialog from './ResponsiveConfirmDialog';

const SectionControls: React.FC<{
  sectionIndex: number;
  sections: any[];
  setSections: (sections: any[]) => void;
}> = ({ sectionIndex, sections, setSections }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
    setIsConfirmOpen(false);
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        type="button"
        aria-label="Move section up"
        title="Move section up"
        onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
        disabled={sectionIndex === 0}
        className={`p-2 rounded focus-visible:ring-2 focus-visible:ring-accent ${
          sectionIndex === 0
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-accent hover:bg-accent text-ink"
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
        className={`p-2 rounded focus-visible:ring-2 focus-visible:ring-accent ${
          sectionIndex === sections.length - 1
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-accent hover:bg-accent text-ink"
        }`}
      >
        <MdArrowDownward className="text-lg" />
      </button>
      <button
        type="button"
        aria-label="Delete section"
        title="Delete section"
        onClick={() => setIsConfirmOpen(true)}
        className="p-2 rounded bg-red-500 hover:bg-red-600 text-white focus-visible:ring-2 focus-visible:ring-red-600"
      >
        <MdDeleteOutline className="text-lg" />
      </button>

      <ResponsiveConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={deleteSection}
        title="Delete Section"
        message="Are you sure you want to delete this section? This action cannot be undone."
        confirmText="Delete Section"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default SectionControls;
