import { useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

/* ------------------------------------------------------------------ */
/*  Static metadata maps                                               */
/* ------------------------------------------------------------------ */

export const TEMPLATE_BADGES: Record<
  string,
  { label: string; variant: 'popular' | 'ats' | 'new' | 'entry' }
> = {
  'modern-with-icons': { label: 'Most Popular', variant: 'popular' },
  'ats-optimized': { label: 'ATS Optimized', variant: 'ats' },
  student: { label: 'Entry Level', variant: 'entry' },
};

export const TEMPLATE_BEST_FOR: Record<string, string> = {
  'modern-with-icons': 'Best for tech, startups & creative roles',
  'modern-no-icons': 'Best for any industry — clean and versatile',
  'ats-optimized': 'Best for large employers with ATS screening',
  student: 'Best for students & first-time job seekers',
  executive: 'Best for senior leaders & C-suite',
  'classic-alex-rivera': 'Best for corporate, finance & law',
  'classic-jane-doe': 'Best for creative professionals',
  'two-column': 'Best for tech roles with many skills',
};

const BADGE_STYLES: Record<string, string> = {
  popular: 'bg-accent text-ink',
  ats: 'bg-blue-100 text-blue-800',
  new: 'bg-purple-100 text-purple-800',
  entry: 'bg-amber-100 text-amber-800',
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    tags?: string[];
    supports_icons?: boolean;
  };
  isSelected: boolean;
  onSelect: (template: TemplateCardProps['template']) => void;
  onUseTemplate: (templateId: string) => void;
  onPreview: (template: TemplateCardProps['template']) => void;
  isLoading?: boolean;
  loadingText?: string;
  eagerLoadImage?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TemplateCard({
  template,
  isSelected,
  onSelect,
  onUseTemplate,
  onPreview,
  isLoading = false,
  loadingText = 'Loading…',
  eagerLoadImage = false,
}: TemplateCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const badge = TEMPLATE_BADGES[template.id];
  const bestFor = TEMPLATE_BEST_FOR[template.id];
  const displayTags = template.tags?.slice(0, 3);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(template)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(template); } }}
      className={`
        group relative flex flex-col bg-white rounded-3xl shadow-lg
        hover:shadow-2xl hover:-translate-y-1
        active:scale-[0.98]
        transition-all duration-300 text-left w-full cursor-pointer
        border-2 outline-none
        focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
        ${
          isSelected
            ? 'border-accent ring-4 ring-accent/20'
            : 'border-gray-200 hover:border-accent/30'
        }
      `}
      aria-pressed={isSelected}
    >
      {/* ---- Selected indicator ---- */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-20">
          <CheckCircleIcon className="h-7 w-7 text-accent drop-shadow" />
        </div>
      )}

      {/* ---- Image area ---- */}
      <div className="relative overflow-hidden rounded-t-3xl bg-chalk-dark">
        {/* Skeleton shimmer while image loads */}
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}

        <img
          src={template.image_url}
          alt={`${template.name} resume template preview`}
          loading={eagerLoadImage ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={`
            w-full object-contain
            h-52 md:h-72 lg:h-80
            transition-opacity duration-300
            ${imgLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Badge overlay */}
        {badge && (
          <span
            className={`
              absolute top-3 left-3 z-10
              font-mono text-xs tracking-widest uppercase
              px-2.5 py-1 rounded-lg font-semibold
              ${BADGE_STYLES[badge.variant]}
            `}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* ---- Content ---- */}
      <div className="flex flex-col flex-1 p-4 md:p-5 gap-2">
        {/* Template name */}
        <h3 className="font-display text-xl font-bold text-ink leading-tight">
          {template.name}
        </h3>

        {/* Best-for tagline */}
        {bestFor && (
          <p className="text-sm text-accent font-medium">{bestFor}</p>
        )}

        {/* Tag pills */}
        {displayTags && displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-chalk-dark text-xs text-stone-warm px-2.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Spacer to push CTAs to bottom */}
        <div className="flex-1" />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            className="
              inline-flex items-center justify-center gap-1.5
              rounded-lg px-3.5 py-2 text-sm font-medium
              text-stone-warm hover:text-ink hover:bg-black/5
              transition-all duration-300
              active:scale-[0.98]
              sm:flex-none
            "
            aria-label={`Preview ${template.name}`}
          >
            <EyeIcon className="h-4 w-4" />
            Preview
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              onUseTemplate(template.id);
            }}
            className={`
              inline-flex items-center justify-center gap-2
              rounded-xl px-5 py-2.5 text-sm font-bold
              transition-all duration-300
              active:scale-[0.98]
              w-full sm:flex-1
              ${
                isLoading
                  ? 'bg-accent/60 text-ink/60 cursor-not-allowed'
                  : 'bg-accent text-ink hover:brightness-110 shadow-md hover:shadow-lg'
              }
            `}
            aria-label={
              isLoading ? loadingText : `Use ${template.name} template`
            }
          >
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                {loadingText}
              </>
            ) : (
              'Use Template'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
