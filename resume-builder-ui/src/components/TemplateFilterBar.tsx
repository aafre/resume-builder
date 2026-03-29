/**
 * TemplateFilterBar Component
 * Horizontal filter bar with pill/chip buttons for template gallery filtering.
 * Maps template tags to user-friendly filter categories.
 *
 * - Mobile: horizontally scrollable with fade-out edges, no scrollbar
 * - Desktop: centered, wraps if needed
 * - Touch-optimized with 44px min tap targets
 */

import { useRef, useCallback } from 'react';

export const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Templates', tags: [] },
  { id: 'ats', label: 'ATS-Friendly', tags: ['ats-friendly', 'single-column', 'recruiter-approved'] },
  { id: 'professional', label: 'Professional', tags: ['professional', 'traditional', 'structured', 'versatile'] },
  { id: 'creative', label: 'Creative', tags: ['icons', 'visual', 'sophisticated'] },
  { id: 'student', label: 'Student', tags: ['entry-level', 'education-first', 'new-graduate'] },
  { id: 'executive', label: 'Executive', tags: ['premium', 'executive', 'senior'] },
] as const;

export type FilterCategoryId = (typeof FILTER_CATEGORIES)[number]['id'];

interface TemplateFilterBarProps {
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  templateCounts?: Record<string, number>;
}

export default function TemplateFilterBar({
  activeFilter,
  onFilterChange,
  templateCounts,
}: TemplateFilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFilterClick = useCallback(
    (filterId: string) => {
      onFilterChange(filterId);
    },
    [onFilterChange]
  );

  return (
    <div className="relative w-full">
      {/* Fade edges on mobile */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-chalk to-transparent sm:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-chalk to-transparent sm:hidden"
        aria-hidden="true"
      />

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        role="toolbar"
        aria-label="Filter templates by category"
        className="flex gap-2.5 overflow-x-auto px-2 py-1 sm:flex-wrap sm:justify-center sm:overflow-x-visible sm:px-0 scrollbar-hide"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {FILTER_CATEGORIES.map((category) => {
          const isActive = activeFilter === category.id;
          const count = templateCounts?.[category.id];

          return (
            <button
              key={category.id}
              type="button"
              role="button"
              aria-pressed={isActive}
              onClick={() => handleFilterClick(category.id)}
              className={`
                flex-shrink-0 min-h-[44px] px-5 py-2.5
                rounded-full font-display text-sm font-medium
                transition-all duration-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                active:scale-95
                select-none whitespace-nowrap
                ${
                  isActive
                    ? 'bg-accent text-ink shadow-sm'
                    : 'bg-white text-stone-warm border border-gray-200 hover:border-gray-300 hover:text-ink hover:shadow-sm'
                }
              `.trim().replace(/\s+/g, ' ')}
            >
              {category.label}
              {count != null && (
                <span
                  className={`ml-1.5 text-xs ${
                    isActive ? 'text-ink/60' : 'text-stone-warm/60'
                  }`}
                >
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Hide scrollbar via inline style as fallback */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
