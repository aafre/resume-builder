/**
 * Utility functions for handling icons in the resume builder
 */

/**
 * Get the appropriate icon source for display
 * @param icon - Icon filename (e.g., "company_google.png")
 * @param iconFile - Uploaded file object (if any)
 * @returns Object with iconSrc and isUploaded flag
 */
export const getIconSource = (icon: string | null, iconFile?: File) => {
  if (iconFile) {
    // If there's an uploaded file, use it
    return {
      iconSrc: URL.createObjectURL(iconFile),
      isUploaded: true
    };
  } else if (icon) {
    // If there's an icon filename, use the backend endpoint
    return {
      iconSrc: `/icons/${icon}`,
      isUploaded: false
    };
  }
  
  // No icon available
  return {
    iconSrc: null,
    isUploaded: false
  };
};

/**
 * Clean up icon filename by removing /icons/ prefix if present
 * @param icon - Icon path that might include /icons/ prefix
 * @returns Clean icon filename
 */
export const cleanIconPath = (icon: string): string => {
  return icon.startsWith('/icons/') ? icon.replace('/icons/', '') : icon;
};