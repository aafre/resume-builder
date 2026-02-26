import React, { useState } from "react";
import { MdArrowUpward, MdArrowDownward, MdDelete } from "react-icons/md";
import ResponsiveConfirmDialog from "./ResponsiveConfirmDialog";

const SectionControls: React.FC<{
  sectionIndex: number;
  sections: any[];
  setSections: (sections: any[]) => void;
}> = ({ sectionIndex, sections, setSections }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    <>
      <div className="absolute top-4 right-4 flex gap-1 bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-gray-100 shadow-sm">
        <button
          type="button"
          onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
          disabled={sectionIndex === 0}
          aria-label="Move section up"
          title="Move section up"
          className={`p-1.5 rounded transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            sectionIndex === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 active:bg-gray-200 hover:text-gray-900"
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
          className={`p-1.5 rounded transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            sectionIndex === sections.length - 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 active:bg-gray-200 hover:text-gray-900"
          }`}
        >
          <MdArrowDownward size={20} />
        </button>
        <div className="w-px bg-gray-200 mx-0.5 my-1" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setIsDeleteDialogOpen(true)}
          aria-label="Delete section"
          title="Delete section"
          className="p-1.5 rounded transition-all focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none text-red-500 hover:bg-red-50 hover:text-red-700 active:bg-red-100"
        >
          <MdDelete size={20} />
        </button>
      </div>

      <ResponsiveConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={deleteSection}
        title="Delete Section"
        message="Are you sure you want to delete this section? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </>
  );
};

export default SectionControls;
