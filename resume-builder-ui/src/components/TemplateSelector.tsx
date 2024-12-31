import React from "react";

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  return (
    <div className="container mx-auto my-10">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Select a Resume Template to Get Started
      </h2>
      <div className="flex justify-center gap-6 mt-6">
        <button
          className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={() => onSelect("modern-no-icons")}
        >
          Modern (No Icons)
        </button>
        <button
          className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition"
          onClick={() => onSelect("modern-with-icons")}
        >
          Modern (With Icons)
        </button>
      </div>
    </div>
  );
};

export default TemplateSelector;
