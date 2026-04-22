/**
 * JobExampleCard Component
 * Displays a job-specific resume example as an image-dominant link card.
 * Links to /examples/{slug} for full example pages.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { JobExampleInfo } from '../data/jobExamples';

const PREVIEW_BASE_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/template-previews`
  : '';

interface JobExampleCardProps {
  job: JobExampleInfo;
  /** Show a "Example" badge in the top-left corner */
  showBadge?: boolean;
}

export default function JobExampleCard({ job, showBadge = false }: JobExampleCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      to={`/examples/${job.slug}`}
      className="group relative flex flex-col bg-white rounded-3xl shadow-lg
        hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
        overflow-hidden border-2 border-gray-200 hover:border-accent/30"
    >
      {/* Type badge */}
      {showBadge && (
        <span className="absolute top-3 left-3 z-10 rounded-full bg-white/90 backdrop-blur-sm
          px-3 py-1 text-xs font-medium text-stone-warm shadow-sm">
          Example
        </span>
      )}

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
