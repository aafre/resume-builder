import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';

interface KebabMenuProps {
  resumeId: string;
  resumeTitle: string;
  onRename: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function KebabMenu({
  resumeId,
  resumeTitle,
  onRename,
  onDuplicate,
  onDelete
}: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRename(resumeId);
    setIsOpen(false);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(resumeId);
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(resumeId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="More options"
        aria-label="More options"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white/95 backdrop-blur-xl rounded-lg shadow-xl border border-gray-200 py-1 z-50">
          <button
            onClick={handleRename}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Rename</span>
          </button>

          <button
            onClick={handleDuplicate}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Duplicate</span>
          </button>

          <div className="border-t border-gray-100 my-1" />

          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
