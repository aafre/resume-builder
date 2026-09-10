/**
 * Comparison Table Component
 * Compare features across items (e.g., resume builders)
 * Single responsibility: Feature comparison display
 *
 * Three things were wrong with the previous version and are fixed here:
 *
 *  1. The header row was a solid `bg-accent` slab spanning the full table —
 *     the largest single area of Signal Green anywhere on the site, against a
 *     10% ceiling. Green is the signal for "this one passes"; once it backs the
 *     whole header it stops meaning anything, and the winning column has
 *     nothing left to be marked with. The header is now ink, and the accent is
 *     spent on the one cell that is making the argument.
 *  2. The "Recommended" chip was `text-white/60` on `#00d47e` — roughly 1.2:1,
 *     illegible. On the new ink header it is `text-accent` at 9.98:1.
 *  3. The pass/fail marks were the Unicode glyphs ✓ and ✗, which render in
 *     whatever the fallback font happens to be and match nothing else on the
 *     page. They are Lucide icons now, the same set the feature grid uses.
 *
 * The marks are deliberately NOT valenced. Several rows are phrased as
 * negatives ("Sign-Up Required", "Auto-Subscription"), so a green tick means
 * "yes, this is true" on those rows, not "yes, this is good" — colouring the
 * tick green and the cross red, as the old version did, told the reader the
 * competitor won every one of them. Yes/no is read from the mark; who is
 * winning is read from the tinted column and its label, which is the only
 * place in the table that can say it without being wrong half the time.
 */

import { Check, X } from 'lucide-react';
import type { ComparisonItem } from '../../types/seo';
import Band from './Band';
import RevealSection from './RevealSection';

interface ComparisonTableProps {
  items: ComparisonItem[];
  headers: string[];
  title?: string;
  className?: string;
}

export default function ComparisonTable({
  items,
  headers,
  title = 'Feature Comparison',
  className = '',
}: ComparisonTableProps) {
  return (
    <Band tone="white" reveal={false} className={className}>
      {title && (
        <RevealSection>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            {title}
          </h2>
        </RevealSection>
      )}
      <RevealSection>
        <div className="rounded-2xl shadow-premium overflow-hidden border border-black/[0.06]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ink text-white">
                <tr>
                  <th className="px-6 py-5 text-left font-display font-bold">Feature</th>
                  {items.map((item, index) => (
                    <th
                      key={index}
                      className={`px-6 py-5 text-center font-display font-bold ${
                        item.highlight ? 'text-accent' : 'text-white'
                      }`}
                    >
                      {item.name}
                      {item.highlight && (
                        <div className="font-mono text-[0.625rem] tracking-[0.15em] uppercase font-normal mt-1.5 text-white/60">
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
                    <td className="px-6 py-4 font-medium text-ink">{header}</td>
                    {items.map((item, colIndex) => {
                      const value = item.features[header];
                      return (
                        <td
                          key={colIndex}
                          className={`px-6 py-4 text-center ${
                            item.highlight ? 'bg-accent/[0.06]' : ''
                          }`}
                        >
                          {typeof value === 'boolean' ? (
                            <>
                              {value ? (
                                <Check
                                  className="w-5 h-5 mx-auto text-ink"
                                  strokeWidth={2.5}
                                  aria-hidden="true"
                                />
                              ) : (
                                <X
                                  className="w-5 h-5 mx-auto text-ink/30"
                                  strokeWidth={2.5}
                                  aria-hidden="true"
                                />
                              )}
                              {/* The icon is decorative; the cell still has to
                                  say what it means to a screen reader. */}
                              <span className="sr-only">
                                {value ? 'Yes' : 'No'}
                              </span>
                            </>
                          ) : (
                            <span className="text-ink/60">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </RevealSection>
    </Band>
  );
}
