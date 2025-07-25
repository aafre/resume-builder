import React from "react";
import IconUpload from "./IconUpload";

interface Certification {
  certification: string;
  issuer: string;
  date: string;
  icon?: string;
  iconFile?: File;
}

interface IconListSectionProps {
  data: Certification[];
  onUpdate: (updatedData: Certification[]) => void;
}

const IconListSection: React.FC<IconListSectionProps> = ({
  data,
  onUpdate,
}) => {
  const handleUpdateItem = (
    index: number,
    field: keyof Certification,
    value: string | File | null
  ) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    onUpdate(updatedData);
  };

  const handleIconUpload = (index: number, renamedIcon: string, file: File) => {
    handleUpdateItem(index, "icon", renamedIcon);
    handleUpdateItem(index, "iconFile", file);
  };

  const handleIconClear = (index: number) => {
    handleUpdateItem(index, "icon", null);
    handleUpdateItem(index, "iconFile", null);
  };

  const handleAddItem = () => {
    const newItem: Certification = {
      certification: "",
      issuer: "",
      date: "",
      icon: "",
      iconFile: undefined,
    };
    onUpdate([...data, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    onUpdate(updatedData);
  };

  return (
    <div className="border p-6 mb-6 bg-white shadow-sm rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Certifications</h2>
      {data.length > 0 ? (
        data.map((item, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              <div className="flex items-start gap-4">
                {/* Icon Upload Component */}
                <div className="flex-shrink-0 pt-6">
                  <IconUpload
                    onUpload={(renamedIcon, file) =>
                      handleIconUpload(index, renamedIcon, file)
                    }
                    onClear={() => handleIconClear(index)}
                    existingIcon={item.icon || null}
                    existingIconFile={item.iconFile || null}
                  />
                </div>
                
                {/* Form Fields */}
                <div className="grid grid-cols-8 gap-2 flex-grow items-center">
                  <div className="col-span-3">
                    <label className="block text-gray-700 font-medium mb-1">
                      Certification
                    </label>
                    <input
                      type="text"
                      value={item.certification}
                      onChange={(e) =>
                        handleUpdateItem(index, "certification", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-gray-700 font-medium mb-1">
                      Issuer
                    </label>
                    <input
                      type="text"
                      value={item.issuer}
                      onChange={(e) =>
                        handleUpdateItem(index, "issuer", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-gray-700 font-medium mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) =>
                        handleUpdateItem(index, "date", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end items-center pt-6">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove Certification"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
        ))
      ) : (
        <p>
          No certifications added yet. Use the button below to add a new one.
        </p>
      )}
      <button
        onClick={handleAddItem}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Add Certification
      </button>
    </div>
  );
};

export default IconListSection;
