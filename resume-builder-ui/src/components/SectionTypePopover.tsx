import { useEffect, useRef } from 'react';
import { ChangeableSectionType, CHANGEABLE_TYPES } from '../services/sectionService';
import { ALL_SECTION_TYPE_OPTIONS } from './sectionTypeConfig';

interface SectionTypePopoverProps {
  currentType: string;
  onSelect: (type: ChangeableSectionType) => void;
  onClose: () => void;
}

const SectionTypePopover: React.FC<SectionTypePopoverProps> = ({
  currentType,
  onSelect,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay listener to avoid immediate close from the button click that opened this
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Show only changeable types, excluding the current one
  const changeableSet = new Set<string>(CHANGEABLE_TYPES);
  const options = ALL_SECTION_TYPE_OPTIONS.filter(
    o => changeableSet.has(o.type) && o.type !== currentType
  );

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-black/[0.06] z-50 overflow-hidden"
      role="listbox"
      aria-label="Change section type"
    >
      <div className="px-3 py-2 border-b border-gray-100">
        <span className="text-xs font-semibold text-stone-warm uppercase tracking-wide">
          Change Type
        </span>
      </div>
      {options.map(({ type, title, description, Visual }) => (
        <button
          key={type}
          type="button"
          role="option"
          onClick={() => onSelect(type as ChangeableSectionType)}
          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent/[0.06] transition-colors text-left"
        >
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg">
            <Visual className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-ink">{title}</div>
            <div className="text-xs text-stone-warm">{description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SectionTypePopover;
