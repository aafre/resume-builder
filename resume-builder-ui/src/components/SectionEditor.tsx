import React, { useState } from "react";
import SectionControls from "./SectionControls";

interface Section {
  name: string;
  type: string;
  content: any;
}

const SectionEditor: React.FC<{
  section: Section;
  sectionIndex: number;
  sections: Section[];
  setSections: (sections: Section[]) => void;
}> = ({ section, sectionIndex, sections, setSections }) => {
  const fixedSections = ["Contact Information", "Education", "Experience"];
  const isFixedSection = fixedSections.includes(section.name);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(section.name);

  const handleSaveName = () => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].name = newName;
    setSections(updatedSections);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setNewName(section.name);
    setIsEditingName(false);
  };

  return (
    <div className="border p-6 mb-6 bg-white shadow-sm rounded-lg relative">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          {isEditingName && !isFixedSection ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-xl font-semibold border border-gray-300 rounded-lg p-2"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="ml-2 text-green-500 hover:text-green-600"
                title="Save Section Name"
              >
                💾
              </button>
              <button
                onClick={handleCancelEdit}
                className="ml-2 text-red-500 hover:text-red-600"
                title="Cancel Edit"
              >
                ❌
              </button>
            </>
          ) : (
            <h2 className="text-xl font-semibold">
              Section: {section.name}
              {!isFixedSection && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="ml-2 text-blue-500 hover:text-blue-600"
                  aria-label="Edit Section Name"
                >
                  ✏️
                </button>
              )}
            </h2>
          )}
        </div>
      </div>

      {/* Section Controls */}
      {!isFixedSection && (
        <SectionControls
          sectionIndex={sectionIndex}
          sections={sections}
          setSections={setSections}
        />
      )}

      {/* Section Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Type</label>
        <select
          value={section.type}
          onChange={(e) => {
            if (isFixedSection) return;
            const updatedSections = [...sections];
            updatedSections[sectionIndex].type = e.target.value;
            setSections(updatedSections);
          }}
          disabled={isFixedSection}
          className={`w-full border border-gray-300 rounded-lg p-2 ${
            isFixedSection ? "bg-gray-200 cursor-not-allowed" : ""
          }`}
        >
          {[
            "text",
            "bulleted-list",
            "inline-list",
            "icon-list",
            "dynamic-column-list",
            "experience",
            "education",
          ].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Section Content */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Content</label>
        {Array.isArray(section.content) ? (
          section.content.map((item: any, itemIndex: number) => (
            <div key={itemIndex} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item.icon || ""}
                onChange={(e) => {
                  const updatedSections = [...sections];
                  updatedSections[sectionIndex].content[itemIndex].icon =
                    e.target.value;
                  setSections(updatedSections);
                }}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter icon name"
              />
              <input
                type="text"
                value={item.text || ""}
                onChange={(e) => {
                  const updatedSections = [...sections];
                  updatedSections[sectionIndex].content[itemIndex].text =
                    e.target.value;
                  setSections(updatedSections);
                }}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter item text"
              />
              <button
                onClick={() => {
                  const updatedSections = [...sections];
                  updatedSections[sectionIndex].content.splice(itemIndex, 1);
                  setSections(updatedSections);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <textarea
            value={section.content || ""}
            onChange={(e) => {
              const updatedSections = [...sections];
              updatedSections[sectionIndex].content = e.target.value;
              setSections(updatedSections);
            }}
            className="w-full border border-gray-300 rounded-lg p-2"
          ></textarea>
        )}
        {Array.isArray(section.content) && (
          <button
            onClick={() => {
              const updatedSections = [...sections];
              updatedSections[sectionIndex].content.push({
                icon: "",
                text: "",
              });
              setSections(updatedSections);
            }}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        )}
      </div>
    </div>
  );
};

export default SectionEditor;
