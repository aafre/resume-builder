import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTimes, FaImage } from "react-icons/fa";
import { getIconSource } from "../utils/icons";

interface IconUploadProps {
  onUpload: (renamedIcon: string, file: File) => void;
  onClear?: () => void;
  existingIcon?: string | null;
  existingIconFile?: File | null;
}

const IconUpload: React.FC<IconUploadProps> = ({
  onUpload,
  onClear,
  existingIcon,
  existingIconFile,
}) => {
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    const { iconSrc } = getIconSource(
      existingIcon ?? null,
      existingIconFile ?? undefined
    );
    setIconPreview(iconSrc);
  }, [existingIcon, existingIconFile]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Generate a random file name
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const renamedFileName = `${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExtension}`;

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setIconPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Notify parent
    onUpload(renamedFileName, file);
  };

  const handleClear = () => {
    setIconPreview(null); // Clear preview
    if (onClear) onClear(); // Notify parent
  };

  return (
    <div className="icon-upload relative w-12 h-12">
      <label className="cursor-pointer relative group">
        <div className="w-12 h-12 flex items-center justify-center border bg-gray-100 rounded-full overflow-hidden relative group">
          {iconPreview ? (
            <img
              src={iconPreview}
              alt="Uploaded Icon"
              className="w-full h-full object-cover"
              onError={() => setIconPreview(null)}
            />
          ) : (
            <div className="text-gray-400 flex items-center justify-center">
              <FaImage className="text-2xl" />
            </div>
          )}
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
