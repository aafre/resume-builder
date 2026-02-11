/**
 * Bullet Point Bank Component
 * Displays categorized bullet points that users can copy to their clipboard
 * Used on job example pages for "copy-paste" resume building
 */

import { useState } from 'react';
import type { BulletCategory } from '../../data/jobExamples/types';
import RevealSection from './RevealSection';

interface BulletPointBankProps {
  categories: BulletCategory[];
  jobTitle: string;
}

export default function BulletPointBank({ categories, jobTitle }: BulletPointBankProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.slice(0, 2).map(c => c.category))
  );

  const handleCopy = async (bullet: string, index: string) => {
    try {
      await navigator.clipboard.writeText(bullet);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <RevealSection>
      <section className="my-12">
        <div className="text-center mb-8">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase">Bullet Bank</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4 mt-2">
            {jobTitle} Bullet Point Bank
          </h2>
          <p className="text-lg text-stone-warm font-extralight max-w-2xl mx-auto">
            Click any bullet point to copy it to your clipboard. Use these achievement-focused
            statements as inspiration for your own resume.
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((category, categoryIndex) => (
            <div
              key={category.category}
              className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full px-6 py-4 flex items-center justify-between text-left bg-chalk hover:bg-chalk-dark transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {getCategoryIcon(category.category)}
                  </span>
                  <span className="font-semibold text-ink">
                    {category.category}
                  </span>
                  <span className="text-sm text-mist">
                    ({category.bullets.length} bullets)
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-mist transition-transform ${
                    expandedCategories.has(category.category) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Bullet Points */}
              {expandedCategories.has(category.category) && (
                <div className="p-4 space-y-2">
                  {category.bullets.map((bullet, bulletIndex) => {
                    const bulletId = `${categoryIndex}-${bulletIndex}`;
                    const isCopied = copiedIndex === bulletId;

                    return (
                      <div
                        key={bulletId}
                        onClick={() => handleCopy(bullet, bulletId)}
                        className={`
                          group relative p-4 rounded-lg cursor-pointer transition-all
                          ${isCopied
                            ? 'bg-green-50 border border-green-300'
                            : 'bg-chalk border border-black/[0.06] hover:bg-accent/[0.06] hover:border-accent/20'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-mist mt-0.5" aria-hidden="true">
                            &bull;
                          </span>
                          <p className="text-ink/80 flex-1 pr-12">
                            {bullet}
                          </p>
                        </div>

                        {/* Copy Button / Status */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {isCopied ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Copied!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-mist group-hover:text-accent text-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span className="hidden group-hover:inline">Copy</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-ink mb-3">
            Tips for Using These Bullet Points
          </h3>
          <ul className="space-y-2 text-ink">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1" aria-hidden="true">&#10003;</span>
              <span><strong>Customize the numbers</strong> - Replace percentages and metrics with your actual achievements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1" aria-hidden="true">&#10003;</span>
              <span><strong>Adapt to your experience</strong> - Modify the scope and scale to match your role</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1" aria-hidden="true">&#10003;</span>
              <span><strong>Match job descriptions</strong> - Use keywords from the job posting you are applying to</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1" aria-hidden="true">&#10003;</span>
              <span><strong>Quantify results</strong> - Always include numbers, percentages, or time frames when possible</span>
            </li>
          </ul>
        </div>
      </section>
    </RevealSection>
  );
}

/**
 * Get an icon for a bullet category
 */
function getCategoryIcon(category: string): string {
  const categoryLower = category.toLowerCase();

  if (categoryLower.includes('customer') || categoryLower.includes('client')) return '🤝';
  if (categoryLower.includes('process') || categoryLower.includes('improvement')) return '📈';
  if (categoryLower.includes('team') || categoryLower.includes('leadership')) return '👥';
  if (categoryLower.includes('technical') || categoryLower.includes('system')) return '💻';
  if (categoryLower.includes('sales') || categoryLower.includes('revenue')) return '💰';
  if (categoryLower.includes('communication')) return '💬';
  if (categoryLower.includes('project')) return '📋';
  if (categoryLower.includes('data') || categoryLower.includes('analysis')) return '📊';
  if (categoryLower.includes('achievement') || categoryLower.includes('result')) return '🏆';
  if (categoryLower.includes('education') || categoryLower.includes('training')) return '📚';

  return '💼';
}
