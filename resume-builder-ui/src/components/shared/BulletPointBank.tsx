/**
 * Bullet Point Bank Component
 * Displays categorized bullet points that users can copy to their clipboard
 * Used on job example pages for "copy-paste" resume building
 */

import { useState } from 'react';
import type { BulletCategory } from '../../data/jobExamples/types';

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
    <section className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {jobTitle} Bullet Point Bank
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Click any bullet point to copy it to your clipboard. Use these achievement-focused
          statements as inspiration for your own resume.
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((category, categoryIndex) => (
          <div
            key={category.category}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.category)}
              className="w-full px-6 py-4 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getCategoryIcon(category.category)}
                </span>
                <span className="font-semibold text-gray-900">
                  {category.category}
                </span>
                <span className="text-sm text-gray-500">
                  ({category.bullets.length} bullets)
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
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
                          : 'bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-200'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-gray-400 mt-0.5" aria-hidden="true">
                          &bull;
                        </span>
                        <p className="text-gray-700 flex-1 pr-12">
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
                          <span className="flex items-center gap-1 text-gray-400 group-hover:text-blue-600 text-sm">
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
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Tips for Using These Bullet Points
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1" aria-hidden="true">&#10003;</span>
            <span><strong>Customize the numbers</strong> - Replace percentages and metrics with your actual achievements</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1" aria-hidden="true">&#10003;</span>
            <span><strong>Adapt to your experience</strong> - Modify the scope and scale to match your role</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1" aria-hidden="true">&#10003;</span>
            <span><strong>Match job descriptions</strong> - Use keywords from the job posting you are applying to</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1" aria-hidden="true">&#10003;</span>
            <span><strong>Quantify results</strong> - Always include numbers, percentages, or time frames when possible</span>
          </li>
        </ul>
      </div>
    </section>
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
