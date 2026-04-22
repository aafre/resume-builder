/**
 * ViewSwitcher Component
 * Segmented control for toggling between All / Design Templates / By Job Title views.
 * Responsive labels: compact on mobile, full on desktop.
 */

export type ViewMode = 'all' | 'templates' | 'examples';

interface ViewOption {
  id: ViewMode;
  shortLabel: string;
  fullLabel: string;
}

interface ViewSwitcherProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  templateCount: number;
  exampleCount: number;
}

export default function ViewSwitcher({
  activeView,
  onViewChange,
  templateCount,
  exampleCount,
}: ViewSwitcherProps) {
  const totalCount = templateCount + exampleCount;

  const options: ViewOption[] = [
    { id: 'all', shortLabel: `All (${totalCount})`, fullLabel: `All (${totalCount})` },
    { id: 'templates', shortLabel: `Templates (${templateCount})`, fullLabel: `Design Templates (${templateCount})` },
    { id: 'examples', shortLabel: `Examples (${exampleCount})`, fullLabel: `By Job Title (${exampleCount})` },
  ];

  return (
    <div
      role="tablist"
      aria-label="Browse by content type"
      className="inline-flex w-full sm:w-auto rounded-full bg-chalk-dark p-1 shadow-inner"
    >
      {options.map((option) => {
        const isActive = activeView === option.id;

        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onViewChange(option.id)}
            className={`
              flex-1 sm:flex-initial min-h-[40px] px-4 sm:px-6 py-2
              rounded-full font-display text-sm font-medium
              transition-all duration-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
              select-none whitespace-nowrap
              ${
                isActive
                  ? 'bg-accent text-ink shadow-sm'
                  : 'text-stone-warm hover:text-ink'
              }
            `.trim().replace(/\s+/g, ' ')}
          >
            {/* Short label on mobile, full label on desktop */}
            <span className="sm:hidden">{option.shortLabel}</span>
            <span className="hidden sm:inline">{option.fullLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
