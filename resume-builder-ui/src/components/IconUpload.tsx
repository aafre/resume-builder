import React, { useState } from "react";
import { FaPencilAlt, FaTimes, FaImage } from "react-icons/fa";

interface IconUploadProps {
  onUpload: (renamedIcon: string, file: File) => void; // Callback with the renamed file and file object
  onClear?: () => void; // Optional, for clearing the uploaded icon
}

const IconUpload: React.FC<IconUploadProps> = ({ onUpload, onClear }) => {
  const [iconPreview, setIconPreview] = useState<string | null>(null); // Default to null

  const generateRandomId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Generate a random file name
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const renamedFileName = `${generateRandomId()}.${fileExtension}`;

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setIconPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Notify parent with renamed file and file object
    onUpload(renamedFileName, file);
  };

  const handleClear = () => {
    setIconPreview(null); // Clear preview
    if (onClear) {
      onClear(); // Notify parent to clear the icon
    }
  };

  return (
    <div className="icon-upload relative w-12 h-12">
      <label className="cursor-pointer relative group">
        {/* Icon Preview or Placeholder */}
        <div className="w-12 h-12 flex items-center justify-center border bg-gray-100 rounded-full overflow-hidden relative group">
          {iconPreview ? (
            <img
              src={iconPreview}
              alt="Uploaded Icon"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 flex items-center justify-center">
              <FaImage className="text-2xl" /> {/* Placeholder icon */}
            </div>
          )}
          {/* Pencil Icon on Hover */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FaPencilAlt className="text-white" />
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleIconChange}
        />
      </label>
      {/* Clear Icon */}
      {iconPreview && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default IconUpload;
