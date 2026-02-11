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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

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

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus first item when opening
      requestAnimationFrame(() => {
        menuItemsRef.current[0]?.focus();
      });
    }
  }, [isOpen]);

  const handleRename = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    onRename(resumeId);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleDuplicate = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    onDuplicate(resumeId);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleDelete = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    onDelete(resumeId);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = menuItemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
      const nextIndex = (currentIndex + 1) % menuItemsRef.current.length;
      menuItemsRef.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = menuItemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
      const prevIndex = (currentIndex - 1 + menuItemsRef.current.length) % menuItemsRef.current.length;
      menuItemsRef.current[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      menuItemsRef.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      menuItemsRef.current[menuItemsRef.current.length - 1]?.focus();
    }
  };

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        title={`More options for ${resumeTitle}`}
        aria-label={`More options for ${resumeTitle}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 w-48 bg-white/95 backdrop-blur-xl rounded-lg shadow-xl border border-gray-200 py-1 z-50"
          role="menu"
        >
          <button
            ref={el => { menuItemsRef.current[0] = el; }}
            onClick={handleRename}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors focus:bg-gray-50 focus:outline-none"
            role="menuitem"
          >
            <Edit2 className="w-4 h-4" />
            <span>Rename</span>
          </button>

          <button
            ref={el => { menuItemsRef.current[1] = el; }}
            onClick={handleDuplicate}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors focus:bg-gray-50 focus:outline-none"
            role="menuitem"
          >
            <Copy className="w-4 h-4" />
            <span>Duplicate</span>
          </button>

          <div className="border-t border-gray-100 my-1" />

          <button
            ref={el => { menuItemsRef.current[2] = el; }}
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors focus:bg-red-50 focus:outline-none"
            role="menuitem"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
