/**
 * Related Jobs Section Component
 * Displays 4-6 related job keyword pages for internal linking
 * Helps prevent orphan pages and improves SEO mesh
 */

import { Link } from 'react-router-dom';
import type { JobKeywordsData } from '../../data/jobKeywords/types';
import { getRelatedJobs, getTotalKeywordCount } from '../../utils/jobKeywordHelpers';
import RevealSection from '../shared/RevealSection';

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
    <RevealSection stagger>
      <div className="mb-16">
        <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">Related Keywords</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4 text-center">
          Related Resume Keywords
        </h2>
        <p className="text-lg text-stone-warm font-extralight mb-8 text-center max-w-3xl mx-auto">
          Explore keywords for other roles in your field to discover transferable skills and broaden your job search.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedJobs.map((relatedJob) => {
            const keywordCount = getTotalKeywordCount(relatedJob);

            return (
              <Link
                key={relatedJob.slug}
                to={`/resume-keywords/${relatedJob.slug}`}
                className="block bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group"
              >
                <h3 className="text-xl font-bold text-ink group-hover:text-accent transition-colors mb-3">
                  {relatedJob.title}
                </h3>

                <p className="text-sm text-stone-warm mb-4">
                  {keywordCount}+ ATS-optimized keywords
                  {relatedJob.keywords.technical.length > 0 &&
                    ` including ${relatedJob.keywords.technical.slice(0, 2).join(', ')}${relatedJob.keywords.technical.length > 2 ? ', and more' : ''}`}
                </p>

                <div className="flex items-center text-accent font-medium text-sm group-hover:text-ink/80">
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
    </RevealSection>
  );
}
