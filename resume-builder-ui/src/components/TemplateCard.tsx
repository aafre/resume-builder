import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

/* ------------------------------------------------------------------ */
/*  Static metadata maps                                               */
/* ------------------------------------------------------------------ */

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

  const bestFor = TEMPLATE_BEST_FOR[template.id];

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

      {/* ---- Image area (click to preview) ---- */}
      <div
        className="relative overflow-hidden rounded-t-3xl bg-chalk-dark cursor-zoom-in"
        onClick={(e) => {
          e.stopPropagation();
          onPreview(template);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onPreview(template); } }}
        aria-label={`Preview ${template.name}`}
      >
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
            h-80 md:h-96 lg:h-[28rem]
            p-2
            group-hover:scale-[1.02] transition-all duration-500
            ${imgLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Hover overlay — preview hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
            <MagnifyingGlassPlusIcon className="h-5 w-5 text-ink" />
          </div>
        </div>
      </div>

      {/* ---- Compact footer ---- */}
      <div className="p-4">
        {/* Template name */}
        <h3 className="font-display text-lg font-bold text-ink leading-tight">
          {template.name}
        </h3>

        {/* Best-for tagline */}
        {bestFor && (
          <p className="text-sm text-stone-warm mt-1">
            <span className="text-accent">→</span> {bestFor}
          </p>
        )}

        {/* CTA */}
        <button
          type="button"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            onUseTemplate(template.id);
          }}
          className={`
            mt-3 w-full inline-flex items-center justify-center gap-2
            rounded-xl px-5 py-2.5 text-sm font-bold
            transition-all duration-300
            active:scale-[0.98]
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
  );
}
