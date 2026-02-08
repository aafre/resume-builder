import { X } from 'lucide-react';

export interface ActiveFilter {
  key: string;
  label: string;
}

interface FilterChipsProps {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

export default function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {filters.map((f) => (
        <button
          type="button"
          key={f.key}
          onClick={() => onRemove(f.key)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full hover:bg-accent/20 transition-colors"
        >
          {f.label}
          <X className="w-3 h-3" />
        </button>
      ))}
      {filters.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-mist hover:text-ink underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
