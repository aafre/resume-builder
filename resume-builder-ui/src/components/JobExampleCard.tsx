/**
 * JobExampleCard Component
 * Displays a job-specific resume example as an image-dominant link card.
 * Card body navigates to /examples/{slug}. If onImageClick is provided,
 * clicking the image area opens a preview modal instead of navigating.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import type { JobExampleInfo } from '../data/jobExamples';

const PREVIEW_BASE_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/template-previews`
  : '';

interface JobExampleCardProps {
  job: JobExampleInfo;
  /** Show an "Example" badge in the top-left corner */
  showBadge?: boolean;
  /** If provided, clicking the image area invokes this instead of navigating */
  onImageClick?: (job: JobExampleInfo) => void;
}

export default function JobExampleCard({ job, showBadge = false, onImageClick }: JobExampleCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleImageClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (!onImageClick) return;
    e.preventDefault();
    e.stopPropagation();
    onImageClick(job);
  };

  const imageInteractiveProps = onImageClick
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onClick: handleImageClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleImageClick(e);
          }
        },
        'aria-label': `Preview ${job.title} example`,
      }
    : {};

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
      <div
        {...imageInteractiveProps}
        className={`relative overflow-hidden rounded-t-3xl bg-chalk-dark ${
          onImageClick ? 'cursor-zoom-in' : ''
        }`}
      >
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

        {onImageClick && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-all duration-300 flex items-center justify-center pointer-events-none">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
              <MagnifyingGlassPlusIcon className="h-5 w-5 text-ink" />
            </div>
          </div>
        )}
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
