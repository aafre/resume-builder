/**
 * Comparison Table Component
 * Compare features across items (e.g., resume builders)
 * Single responsibility: Feature comparison display
 */

import type { ComparisonItem } from '../../types/seo';

interface ComparisonTableProps {
  items: ComparisonItem[];
  headers: string[];
  title?: string;
  className?: string;
}

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="text-accent text-xl">✓</span>
    ) : (
      <span className="text-red-500 text-xl">✗</span>
    );
  }
  return <span className="text-stone-warm">{value}</span>;
}

export default function ComparisonTable({
  items,
  headers,
  title = 'Feature Comparison',
  className = '',
}: ComparisonTableProps) {
  return (
    <div className={`mb-16 ${className}`}>
      {title && (
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          {title}
        </h2>
      )}

      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl p-4 shadow-sm border ${
              item.highlight ? 'border-accent/30' : 'border-gray-100'
            } mb-3`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold text-ink">
                {item.name}
              </h3>
              {item.highlight && (
                <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {headers.map((header, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-sm font-medium text-ink">{header}</span>
                  <FeatureValue value={item.features[header]} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-premium overflow-hidden border border-black/[0.06]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent text-ink">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Feature</th>
                {items.map((item, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-center font-bold ${
                      item.highlight ? 'bg-accent' : ''
                    }`}
                  >
                    {item.name}
                    {item.highlight && (
                      <div className="text-xs font-normal mt-1 text-white/60">
                        Recommended
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {headers.map((header, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? 'bg-chalk-dark' : 'bg-white'}
                >
                  <td className="px-6 py-4 font-medium text-ink">
                    {header}
                  </td>
                  {items.map((item, colIndex) => {
                    const value = item.features[header];
                    return (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 text-center ${
                          item.highlight ? 'bg-accent/[0.06]' : ''
                        }`}
                      >
                        <FeatureValue value={value} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
