import React, { useState } from "react";
import { MdArrowUpward, MdArrowDownward, MdDeleteOutline } from "react-icons/md";
import ResponsiveConfirmDialog from "./ResponsiveConfirmDialog";

const SectionControls: React.FC<{
  sectionIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSections: (sections: any[]) => void;
}> = ({ sectionIndex, sections, setSections }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          type="button"
          onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
          disabled={sectionIndex === 0}
          aria-label="Move section up"
          title="Move section up"
          className={`p-2 rounded transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            sectionIndex === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-50 hover:text-accent border border-gray-200 shadow-sm"
          }`}
        >
          <MdArrowUpward size={20} />
        </button>
        <button
          type="button"
          onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
          disabled={sectionIndex === sections.length - 1}
          aria-label="Move section down"
          title="Move section down"
          className={`p-2 rounded transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            sectionIndex === sections.length - 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-50 hover:text-accent border border-gray-200 shadow-sm"
          }`}
        >
          <MdArrowDownward size={20} />
        </button>
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          aria-label="Delete section"
          title="Delete section"
          className="p-2 rounded bg-white text-red-500 hover:bg-red-50 hover:text-red-600 border border-gray-200 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
        >
          <MdDeleteOutline size={20} />
        </button>
      </div>

      <ResponsiveConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteSection}
        title="Delete Section?"
        message="Are you sure you want to delete this section? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </>
  );
};

export default SectionControls;
