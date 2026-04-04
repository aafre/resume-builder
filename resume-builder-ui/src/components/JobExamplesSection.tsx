/**
 * JobExamplesSection Component
 * Displays job-specific resume examples in an image-dominant card grid
 * with category filter pills. Used on the /templates page for SEO
 * internal linking to /examples/{slug} pages.
 */

import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import RevealSection from './shared/RevealSection';
import {
  JOB_EXAMPLES_DATABASE,
  JOB_CATEGORIES,
  getJobExamplesByCategory,
  getJobCountByCategory,
} from '../data/jobExamples';
import type { JobCategory, JobExampleInfo } from '../data/jobExamples';

const PREVIEW_BASE_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/template-previews`
  : '';

function JobExampleCard({ job }: { job: JobExampleInfo }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      to={`/examples/${job.slug}`}
      className="group relative flex flex-col bg-white rounded-3xl shadow-lg
        hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
        overflow-hidden border-2 border-gray-200 hover:border-accent/30"
    >
      {/* Image area */}
      <div className="relative overflow-hidden rounded-t-3xl bg-chalk-dark">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img
          src={`${PREVIEW_BASE_URL}/${job.slug}.webp`}
          srcSet={`${PREVIEW_BASE_URL}/${job.slug}-sm.webp 400w, ${PREVIEW_BASE_URL}/${job.slug}.webp 800w`}
          sizes="(max-width: 768px) 400px, 380px"
          alt={`${job.title} resume example`}
          loading="lazy"
          decoding="async"
          width={400}
          height={566}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.onerror = null;
            img.src = '/docs/templates/modern-no-icons.png';
          }}
          className={`w-full object-contain h-60 md:h-72 p-2
            group-hover:scale-[1.02] transition-all duration-500
            ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {/* Footer */}
      <div className="p-4">
        <h3 className="font-display text-lg font-bold text-ink leading-tight group-hover:text-accent transition-colors">
          {job.title}
        </h3>
        <p className="text-sm text-stone-warm mt-1 line-clamp-2">
          {job.metaDescription}
        </p>
        <span
          className="mt-3 w-full inline-flex items-center justify-center gap-2
            rounded-xl px-5 py-2.5 text-sm font-bold
            bg-accent text-ink shadow-md group-hover:brightness-110 group-hover:shadow-lg
            transition-all duration-300"
        >
          Use This Example
        </span>
      </div>
    </Link>
  );
}

export default function JobExamplesSection() {
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | 'all'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const jobsByCategory = useMemo(() => getJobExamplesByCategory(), []);
  const categoryCounts = useMemo(() => getJobCountByCategory(), []);
  const totalCount = JOB_EXAMPLES_DATABASE.length;

  const filteredJobs = useMemo(() => {
    if (selectedCategory === 'all') return JOB_EXAMPLES_DATABASE;
    return jobsByCategory[selectedCategory] || [];
  }, [selectedCategory, jobsByCategory]);

  return (
    <RevealSection variant="fade-up">
      <section className="my-16 cv-auto cv-h-600">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="block font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">
            Resume Examples
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4">
            Resume Examples by Job Title
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-3xl mx-auto leading-relaxed">
            Browse professional resume examples for your specific role. Each example includes
            pre-written content you can customize in our free builder.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="relative w-full mb-10">
          {/* Fade edges on mobile */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-chalk to-transparent sm:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-chalk to-transparent sm:hidden"
            aria-hidden="true"
          />

          <div
            ref={scrollRef}
            role="toolbar"
            aria-label="Filter resume examples by job category"
            className="flex gap-2.5 overflow-x-auto px-2 py-1 sm:flex-wrap sm:justify-center sm:overflow-x-visible sm:px-0 scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* "All" pill */}
            <button
              type="button"
              aria-pressed={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              className={`
                flex-shrink-0 min-h-[44px] px-5 py-2.5
                rounded-full font-display text-sm font-medium
                transition-all duration-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                active:scale-95 select-none whitespace-nowrap
                ${
                  selectedCategory === 'all'
                    ? 'bg-accent text-ink shadow-sm'
                    : 'bg-white text-stone-warm border border-gray-200 hover:border-gray-300 hover:text-ink hover:shadow-sm'
                }
              `.trim().replace(/\s+/g, ' ')}
            >
              All
              <span className={`ml-1.5 text-xs ${selectedCategory === 'all' ? 'text-ink/60' : 'text-stone-warm/60'}`}>
                ({totalCount})
              </span>
            </button>

            {/* Category pills */}
            {JOB_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category.id;
              const count = categoryCounts[category.id];
              const shortTitle = category.title.split(' & ')[0];

              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex-shrink-0 min-h-[44px] px-5 py-2.5
                    rounded-full font-display text-sm font-medium
                    transition-all duration-300
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                    active:scale-95 select-none whitespace-nowrap
                    ${
                      isActive
                        ? 'bg-accent text-ink shadow-sm'
                        : 'bg-white text-stone-warm border border-gray-200 hover:border-gray-300 hover:text-ink hover:shadow-sm'
                    }
                  `.trim().replace(/\s+/g, ' ')}
                >
                  <span className="mr-1.5" aria-hidden="true">{category.icon}</span>
                  {shortTitle}
                  <span className={`ml-1.5 text-xs ${isActive ? 'text-ink/60' : 'text-stone-warm/60'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </div>

        {/* Card Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {filteredJobs.map((job) => (
            <JobExampleCard key={job.slug} job={job} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link to="/examples" className="btn-secondary py-3 px-8 inline-block">
            View All Resume Examples
          </Link>
        </div>
      </section>
    </RevealSection>
  );
}
