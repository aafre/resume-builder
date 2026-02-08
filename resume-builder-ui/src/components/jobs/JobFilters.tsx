import { useState, useCallback } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterState {
  contractType: '' | 'permanent' | 'contract';
  schedule: '' | 'full-time' | 'part-time';
  salaryMin: number;
  salaryMax: number;
  maxDaysOld: number;
  distance: number;
  company: string;
  whatExclude: string;
  sortBy: 'relevance' | 'salary' | 'date';
  sortDir: '' | 'up' | 'down';
}

export const DEFAULT_FILTERS: FilterState = {
  contractType: '',
  schedule: '',
  salaryMin: 0,
  salaryMax: 0,
  maxDaysOld: 0,
  distance: 0,
  company: '',
  whatExclude: '',
  sortBy: 'relevance',
  sortDir: '',
};

const SALARY_PRESETS = [
  { label: '20k+', value: 20000 },
  { label: '30k+', value: 30000 },
  { label: '40k+', value: 40000 },
  { label: '50k+', value: 50000 },
  { label: '60k+', value: 60000 },
  { label: '80k+', value: 80000 },
  { label: '100k+', value: 100000 },
];

const FRESHNESS_OPTIONS = [
  { label: 'Any time', value: 0 },
  { label: 'Today', value: 1 },
  { label: 'Last 3 days', value: 3 },
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 14 days', value: 14 },
  { label: 'Last 30 days', value: 30 },
];

const DISTANCE_OPTIONS = [
  { label: 'Any distance', value: 0 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
];

interface JobFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  hasLocation: boolean;
}

export default function JobFilters({ filters, onChange, hasLocation }: JobFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  }, [filters, onChange]);

  const activeFilterCount = [
    filters.contractType,
    filters.schedule,
    filters.salaryMin,
    filters.maxDaysOld,
    filters.distance,
    filters.company,
    filters.whatExclude,
    filters.sortBy !== 'relevance' ? filters.sortBy : '',
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-4">
      {/* Quick Filters Bar */}
      <div className="p-3 flex items-center gap-2 flex-wrap">
        {/* Contract Type */}
        <QuickSelect
          value={filters.contractType}
          onChange={(v) => updateFilter('contractType', v as FilterState['contractType'])}
          options={[
            { label: 'All types', value: '' },
            { label: 'Permanent', value: 'permanent' },
            { label: 'Contract', value: 'contract' },
          ]}
        />

        {/* Schedule */}
        <QuickSelect
          value={filters.schedule}
          onChange={(v) => updateFilter('schedule', v as FilterState['schedule'])}
          options={[
            { label: 'All schedules', value: '' },
            { label: 'Full-time', value: 'full-time' },
            { label: 'Part-time', value: 'part-time' },
          ]}
        />

        {/* Salary */}
        <QuickSelect
          value={String(filters.salaryMin || '')}
          onChange={(v) => updateFilter('salaryMin', Number(v) || 0)}
          options={[
            { label: 'Any salary', value: '' },
            ...SALARY_PRESETS.map((p) => ({ label: p.label, value: String(p.value) })),
          ]}
        />

        {/* Job Age */}
        <QuickSelect
          value={String(filters.maxDaysOld || '')}
          onChange={(v) => updateFilter('maxDaysOld', Number(v) || 0)}
          options={FRESHNESS_OPTIONS.map((o) => ({ label: o.label, value: String(o.value || '') }))}
        />

        {/* Sort */}
        <QuickSelect
          value={filters.sortBy}
          onChange={(v) => updateFilter('sortBy', v as FilterState['sortBy'])}
          options={[
            { label: 'Relevance', value: 'relevance' },
            { label: 'Salary', value: 'salary' },
            { label: 'Date', value: 'date' },
          ]}
        />

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          More
          {activeFilterCount > 0 && (
            <span className="bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expanded Filters Panel */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Distance (only when location selected) */}
          {hasLocation && (
            <FilterField label="Distance">
              <select
                value={filters.distance}
                onChange={(e) => updateFilter('distance', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {DISTANCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </FilterField>
          )}

          {/* Company */}
          <FilterField label="Company">
            <input
              type="text"
              value={filters.company}
              onChange={(e) => updateFilter('company', e.target.value)}
              placeholder="e.g. Google"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </FilterField>

          {/* Exclude Keywords */}
          <FilterField label="Exclude keywords">
            <input
              type="text"
              value={filters.whatExclude}
              onChange={(e) => updateFilter('whatExclude', e.target.value)}
              placeholder="e.g. senior, manager"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </FilterField>

          {/* Salary Max */}
          <FilterField label="Max salary">
            <select
              value={filters.salaryMax}
              onChange={(e) => updateFilter('salaryMax', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value={0}>No max</option>
              {SALARY_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>{p.label.replace('+', '')}</option>
              ))}
            </select>
          </FilterField>

          {/* Sort direction */}
          {filters.sortBy === 'salary' && (
            <FilterField label="Salary order">
              <select
                value={filters.sortDir}
                onChange={(e) => updateFilter('sortDir', e.target.value as FilterState['sortDir'])}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Default</option>
                <option value="down">Highest first</option>
                <option value="up">Lowest first</option>
              </select>
            </FilterField>
          )}
        </div>
      )}
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

function QuickSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer hover:border-gray-300 transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
