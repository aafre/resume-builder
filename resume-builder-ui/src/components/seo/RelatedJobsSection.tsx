/**
 * Related Jobs Section Component
 * Displays 4-6 related job keyword pages for internal linking
 * Helps prevent orphan pages and improves SEO mesh
 */

import { Link } from 'react-router-dom';
import type { JobKeywordsData } from '../../data/jobKeywords/types';
import { getRelatedJobs, getTotalKeywordCount } from '../../utils/jobKeywordHelpers';

interface RelatedJobsSectionProps {
  job: JobKeywordsData;
  limit?: number;
}

export default function RelatedJobsSection({ job, limit = 6 }: RelatedJobsSectionProps) {
  const relatedJobs = getRelatedJobs(job, limit);

  if (relatedJobs.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
        Related Resume Keywords
      </h2>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
        Explore keywords for other roles in your field to discover transferable skills and broaden your job search.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedJobs.map((relatedJob) => {
          const keywordCount = getTotalKeywordCount(relatedJob);

          return (
            <Link
              key={relatedJob.slug}
              to={`/resume-keywords/${relatedJob.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {relatedJob.title}
                </h3>
                <span className="text-sm text-blue-600 font-medium whitespace-nowrap ml-2">
                  →
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {keywordCount}+ ATS-optimized keywords including{' '}
                {relatedJob.keywords.technical.slice(0, 2).join(', ')}
                {relatedJob.keywords.technical.length > 2 ? ', and more' : ''}
              </p>

              <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                View Keywords
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
