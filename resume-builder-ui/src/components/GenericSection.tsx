import React from "react";

interface Section {
  name: string;
  type?: string;
  content: any;
}

interface GenericSectionProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
  onEditTitle: () => void;
  onSaveTitle: () => void;
  onCancelTitle: () => void;
  onDelete: () => void;
  isEditing: boolean;
  temporaryTitle: string;
  setTemporaryTitle: (title: string) => void;
}

const GenericSection: React.FC<GenericSectionProps> = ({
  section,
  onUpdate,
  onEditTitle,
  onSaveTitle,
  onCancelTitle,
  onDelete,
  isEditing,
  temporaryTitle,
  setTemporaryTitle,
}) => {
  const handleContentChange = (value: string | string[], index?: number) => {
    if (Array.isArray(section.content)) {
      const updatedContent = [...section.content];
      if (index !== undefined) {
        updatedContent[index] = value as string;
      } else {
        updatedContent.push(value as string);
      }
      onUpdate({ ...section, content: updatedContent });
    } else {
      onUpdate({ ...section, content: value });
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedContent = section.content.filter(
      (_: string, i: number) => i !== index
    );
    onUpdate({ ...section, content: updatedContent });
  };

  return (
    <div className="border p-6 mb-8 bg-white shadow-sm rounded-lg">
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={temporaryTitle}
              onChange={(e) => setTemporaryTitle(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
              autoFocus
            />
            <button
              onClick={onSaveTitle}
              className="text-green-600 hover:text-green-800"
              title="Save Title"
            >
              ✅
            </button>
            <button
              onClick={onCancelTitle}
              className="text-red-600 hover:text-red-800"
              title="Cancel"
            >
              ✕
            </button>
          </div>
        ) : (
          <h2 className="text-xl font-semibold">
            {section.name}
            <button
              onClick={onEditTitle}
              className="ml-2 text-gray-500 hover:text-gray-700"
              title="Edit Title"
            >
              ✏️
            </button>
          </h2>
        )}
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded-lg"
          title="Remove Section"
        >
          Remove
        </button>
      </div>
      <div className="mt-4">
        {section.type === "text" && (
          <textarea
            value={section.content || ""}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          ></textarea>
        )}
        {["bulleted-list"].includes(
          section.type || ""
        ) && (
          <>
              {Array.isArray(section.content) &&
                section.content.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 mb-4 mr-4">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContentChange(e.target.value, index)}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove Item"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
            <button
              onClick={() => {
                const updatedContent = [...(section.content || []), ""];
                onUpdate({ ...section, content: updatedContent });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
            >
              Add Item
            </button>
          </>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {section.type === "text" && (
          <textarea
            value={section.content || ""}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          ></textarea>
        )}
        {["inline-list", "dynamic-column-list"].includes(
          section.type || ""
        ) && (
          <>
          <div className="flex flex-wrap justify-start gap-4">
            {Array.isArray(section.content) &&
              section.content.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-4 mr-4">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleContentChange(e.target.value, index)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-ellipsis" 
                  />
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove Item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const updatedContent = [...(section.content || []), ""];
                onUpdate({ ...section, content: updatedContent });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 w-fit"
            >
              Add Item
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GenericSection;
