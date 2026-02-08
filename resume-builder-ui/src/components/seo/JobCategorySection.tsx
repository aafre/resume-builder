/**
 * Job Category Section Component
 * Reusable component for rendering a category of job keyword pages
 */

import { Link } from 'react-router-dom';
import type { JobKeywordsData } from '../../data/jobKeywords/types';
import { getTotalKeywordCount } from '../../utils/jobKeywordHelpers';
import RevealSection from '../shared/RevealSection';

interface JobCategorySectionProps {
  title: string;
  jobs: JobKeywordsData[];
  id?: string;
  /** @deprecated No longer used — unified design system */
  colorScheme?: unknown;
}

export default function JobCategorySection({ title, jobs, id }: JobCategorySectionProps) {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="mb-12" id={id}>
      <h3 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-6">{title}</h3>
      <RevealSection stagger>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => {
            const keywordCount = getTotalKeywordCount(job);
            return (
              <Link
                key={job.slug}
                to={`/resume-keywords/${job.slug}`}
                className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
              >
                <h4 className="text-xl font-bold text-ink mb-2">
                  {job.title}
                </h4>
                <p className="text-stone-warm mb-4 text-sm">
                  {keywordCount}+ keywords
                  {job.keywords.technical.length > 0 &&
                    ` including ${job.keywords.technical.slice(0, 2).join(', ')}${job.keywords.technical.length > 2 ? ', and more' : ''}`}
                </p>
                <div className="font-semibold text-sm text-accent">
                  View Keywords →
                </div>
              </Link>
            );
          })}
        </div>
      </RevealSection>
    </div>
  );
}
