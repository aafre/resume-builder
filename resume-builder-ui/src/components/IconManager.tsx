import React, { useState, useEffect, useRef } from "react";
import { FaPencilAlt, FaTimes, FaImage } from "react-icons/fa";
import { getIconSource } from "../utils/icons";

interface IconManagerProps {
  // Current icon filename (null if no icon)
  value?: string | null;
  // Callback when icon changes - provides both filename and file object
  onChange: (filename: string | null, file: File | null) => void;
  // Optional callback when icon is cleared
  onClear?: () => void;
  // Icon registry methods
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
  // Optional props
  disabled?: boolean;
  className?: string;
}

/**
 * Centralized icon management component
 * Handles upload, preview, and clearing of icons across all sections
 */
const IconManager: React.FC<IconManagerProps> = ({
  value,
  onChange,
  onClear,
  registerIcon,
  getIconFile,
  removeIcon,
  disabled = false,
  className = "",
}) => {
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value or registry changes
  useEffect(() => {
    if (!value) {
      setIconPreview(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Check if we have the file in registry (uploaded file)
    const registeredFile = getIconFile(value);
    if (registeredFile) {
      const previewUrl = URL.createObjectURL(registeredFile);
      setIconPreview(previewUrl);
    } else {
      // Use server icon path
      const { iconSrc } = getIconSource(value, undefined);
      setIconPreview(iconSrc);
    }
    
    setError(null);
  }, [value, getIconFile]);

  // Validate file before upload
  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, GIF, and SVG files are allowed';
    }

    return null;
  };

  // Handle file selection and upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Register file and get generated filename
      const generatedFilename = registerIcon(file);

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setIconPreview(previewUrl);

      // Notify parent component
      onChange(generatedFilename, file);
    } catch (error) {
      // Display specific error message from validation
      const errorMessage = error instanceof Error ? error.message : "Failed to upload icon. Please try again.";
      setError(errorMessage);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Handle clearing icon
  const handleClear = () => {
    // Clear preview
    setIconPreview(null);
    setError(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Remove from registry if it's a registered file
    if (value && getIconFile(value)) {
      removeIcon(value);
    }

    // Notify parent components
    onChange(null, null);
    
    if (onClear) {
      onClear();
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (iconPreview && iconPreview.startsWith('blob:')) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [iconPreview]);

  return (
    <div className={`icon-manager relative w-12 h-12 ${className}`}>
      <label className={`cursor-pointer relative group ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
        <div className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all duration-200">
          {isUploading ? (
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          ) : iconPreview ? (
            <img
              src={iconPreview}
              alt="Icon preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <FaImage className="text-gray-400 w-4 h-4" />
          )}
          
          {!isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FaPencilAlt className="text-white w-3 h-3" />
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
      </label>

      {/* Clear button */}
      {iconPreview && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg transition-colors duration-200"
          disabled={isUploading}
        >
          <FaTimes />
        </button>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-14 left-0 bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-xs whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default IconManager;