/**
 * Job Category Section Component
 * Reusable component for rendering a category of job keyword pages
 */

import { Link } from 'react-router-dom';
import type { JobKeywordsData } from '../../data/jobKeywords/types';
import { getTotalKeywordCount } from '../../utils/jobKeywordHelpers';

interface ColorScheme {
  border: string;
  hoverBorder: string;
  text: string;
}

interface JobCategorySectionProps {
  title: string;
  jobs: JobKeywordsData[];
  colorScheme: ColorScheme;
}

export default function JobCategorySection({ title, jobs, colorScheme }: JobCategorySectionProps) {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => {
          const keywordCount = getTotalKeywordCount(job);
          return (
            <Link
              key={job.slug}
              to={`/resume-keywords/${job.slug}`}
              className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border-2 ${colorScheme.border} ${colorScheme.hoverBorder}`}
            >
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {job.title}
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                {keywordCount}+ keywords
                {job.keywords.technical.length > 0 &&
                  ` including ${job.keywords.technical.slice(0, 2).join(', ')}${job.keywords.technical.length > 2 ? ', and more' : ''}`}
              </p>
              <div className={`font-semibold text-sm ${colorScheme.text}`}>
                View Keywords →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
