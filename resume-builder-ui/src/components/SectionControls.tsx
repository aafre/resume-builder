import React, { useState } from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import ResponsiveConfirmDialog from "./ResponsiveConfirmDialog";

const SectionControls: React.FC<{
  sectionIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSections: (sections: any[]) => void;
}> = ({ sectionIndex, sections, setSections }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
    setIsDeleteOpen(false);
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          type="button"
          onClick={() => moveSection(sectionIndex, sectionIndex - 1)}
          disabled={sectionIndex === 0}
          className={`p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
            sectionIndex === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          }`}
          aria-label="Move section up"
          title="Move section up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => moveSection(sectionIndex, sectionIndex + 1)}
          disabled={sectionIndex === sections.length - 1}
          className={`p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
            sectionIndex === sections.length - 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          }`}
          aria-label="Move section down"
          title="Move section down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          aria-label="Delete section"
          title="Delete section"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <ResponsiveConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={deleteSection}
        title="Delete Section?"
        message="Are you sure you want to delete this section? This action cannot be undone."
        confirmText="Delete Section"
        isDestructive
      />
    </>
  );
};

export default SectionControls;
