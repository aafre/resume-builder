/**
 * UnifiedTemplateSection Component
 *
 * Combines the template carousel and job examples into one filterable section.
 * Uses a ViewSwitcher (All / Design Templates / By Job Title) with contextual
 * sub-filters for each view.
 *
 * Used only on TemplatesPage (/templates). TemplateCarousel remains unchanged
 * for all other pages that embed it.
 */

import React, { useEffect, useState, useMemo, useRef, lazy, Suspense } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchTemplates } from '../services/templates';
import TemplateCard from './TemplateCard';
import JobExampleCard from './JobExampleCard';
import JobExamplePreviewModal from './JobExamplePreviewModal';
import TemplateFilterBar, { FILTER_CATEGORIES } from './TemplateFilterBar';
import TemplatePreviewModal from './TemplatePreviewModal';
import TemplateStartModal from './TemplateStartModal';
import ResumeRecoveryModal from './ResumeRecoveryModal';
import AuthModal from './AuthModal';
import ViewSwitcher, { type ViewMode } from './ViewSwitcher';
import { InFeedAd, AD_CONFIG } from './ads';
import { useTemplateActions } from '../hooks/useTemplateActions';
import {
  JOB_EXAMPLES_DATABASE,
  JOB_CATEGORIES,
  getJobExamplesByCategory,
  getJobCountByCategory,
} from '../data/jobExamples';
import type { JobCategory, JobExampleInfo } from '../data/jobExamples';

const NotFound = lazy(() => import('./NotFound'));
const ErrorPage = lazy(() => import('./ErrorPage'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
  </div>
);

interface Template {
  id: string;
  name: string;
  description: string;
  image_url: string;
  tags?: string[];
  supports_icons?: boolean;
}

export default function UnifiedTemplateSection() {
  // URL state
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = (searchParams.get('view') as ViewMode) || 'templates';
  const initialFilter = searchParams.get('filter') || 'all';
  const initialCategory = (searchParams.get('category') as JobCategory | 'all') || 'all';

  // View state — defaults to 'templates' to match the /templates URL intent
  const [activeView, setActiveView] = useState<ViewMode>(
    ['all', 'templates', 'examples'].includes(initialView) ? initialView : 'templates'
  );
  const [activeTemplateFilter, setActiveTemplateFilter] = useState(initialFilter);
  const [activeJobCategory, setActiveJobCategory] = useState<JobCategory | 'all'>(initialCategory);

  // Template data (async from API)
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Job example preview modal state
  const [showExampleModal, setShowExampleModal] = useState(false);
  const [exampleModalIndex, setExampleModalIndex] = useState(0);

  // Refs
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Job examples data (static)
  const jobsByCategory = useMemo(() => getJobExamplesByCategory(), []);
  const jobCategoryCounts = useMemo(() => getJobCountByCategory(), []);
  const totalJobCount = JOB_EXAMPLES_DATABASE.length;

  // Fetch templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const data = await fetchTemplates();
        setTemplates(data);
      } catch (err) {
        setError('Failed to load templates. Please try again later.');
        console.error('Error fetching templates:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (activeTemplateFilter === 'all') return templates;
    const category = FILTER_CATEGORIES.find(c => c.id === activeTemplateFilter);
    if (!category || category.tags.length === 0) return templates;
    return templates.filter(t =>
      t.tags?.some(tag => (category.tags as readonly string[]).includes(tag))
    );
  }, [templates, activeTemplateFilter]);

  const templateCounts = useMemo(() => {
    const counts: Record<string, number> = { all: templates.length };
    for (const cat of FILTER_CATEGORIES) {
      if (cat.id === 'all') continue;
      counts[cat.id] = templates.filter(t =>
        t.tags?.some(tag => (cat.tags as readonly string[]).includes(tag))
      ).length;
    }
    return counts;
  }, [templates]);

  // Filter job examples
  const filteredJobs = useMemo(() => {
    if (activeJobCategory === 'all') return JOB_EXAMPLES_DATABASE;
    return jobsByCategory[activeJobCategory] || [];
  }, [activeJobCategory, jobsByCategory]);

  // Template actions (modals, auth, recovery)
  const actions = useTemplateActions(templates, filteredTemplates);

  // URL sync
  useEffect(() => {
    const params = new URLSearchParams();
    // 'templates' is the default view — omit from URL to keep /templates canonical
    if (activeView !== 'templates') params.set('view', activeView);
    if (activeView === 'templates' && activeTemplateFilter !== 'all') params.set('filter', activeTemplateFilter);
    if (activeView === 'examples' && activeJobCategory !== 'all') params.set('category', activeJobCategory);

    const newSearch = params.toString();
    const currentSearch = searchParams.toString();
    if (newSearch !== currentSearch) {
      setSearchParams(params, { replace: true });
    }
  }, [activeView, activeTemplateFilter, activeJobCategory, searchParams, setSearchParams]);

  // Open the example preview modal at the clicked job's index
  const handleExampleImageClick = (job: JobExampleInfo) => {
    const index = filteredJobs.findIndex((j) => j.slug === job.slug);
    setExampleModalIndex(index >= 0 ? index : 0);
    setShowExampleModal(true);
  };

  // View change handler — reset sub-filters and scroll into view
  const handleViewChange = (view: ViewMode) => {
    setActiveView(view);
    if (view !== 'templates') setActiveTemplateFilter('all');
    if (view !== 'examples') setActiveJobCategory('all');

    // Smooth scroll to grid if it's below viewport
    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      if (rect.top < 0 || rect.top > window.innerHeight * 0.5) {
        gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Recovery redirect states
  if (actions.processingRecoveryRedirect || (actions.anonMigrationInProgress && localStorage.getItem('resume-recovery-intent'))) {
    return (
      <div className="min-h-[400px] bg-chalk flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-xl text-stone-warm">Redirecting to your resume...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[400px] bg-chalk flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-xl text-stone-warm">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ErrorPage />
      </Suspense>
    );
  }

  if (templates.length === 0) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    );
  }

  const showTemplates = activeView === 'all' || activeView === 'templates';
  const showExamples = activeView === 'all' || activeView === 'examples';

  return (
    <div className="container mx-auto max-w-7xl px-4 pb-12">
      {/* View Switcher */}
      <div className="flex justify-center mb-8">
        <ViewSwitcher
          activeView={activeView}
          onViewChange={handleViewChange}
          templateCount={templates.length}
          exampleCount={totalJobCount}
        />
      </div>

      {/* Contextual Sub-filters */}
      {activeView === 'templates' && (
        <div className="mb-8 md:mb-10">
          <TemplateFilterBar
            activeFilter={activeTemplateFilter}
            onFilterChange={setActiveTemplateFilter}
            templateCounts={templateCounts}
          />
        </div>
      )}

      {activeView === 'examples' && (
        <div className="relative w-full mb-8 md:mb-10">
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
              aria-pressed={activeJobCategory === 'all'}
              onClick={() => setActiveJobCategory('all')}
              className={`
                flex-shrink-0 min-h-[44px] px-5 py-2.5
                rounded-full font-display text-sm font-medium
                transition-all duration-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                active:scale-95 select-none whitespace-nowrap
                ${
                  activeJobCategory === 'all'
                    ? 'bg-accent text-ink shadow-sm'
                    : 'bg-white text-stone-warm border border-gray-200 hover:border-gray-300 hover:text-ink hover:shadow-sm'
                }
              `.trim().replace(/\s+/g, ' ')}
            >
              All
              <span className={`ml-1.5 text-xs ${activeJobCategory === 'all' ? 'text-ink/60' : 'text-stone-warm/60'}`}>
                ({totalJobCount})
              </span>
            </button>

            {/* Category pills */}
            {JOB_CATEGORIES.map((category) => {
              const isActive = activeJobCategory === category.id;
              const count = jobCategoryCounts[category.id];
              const shortTitle = category.title.split(' & ')[0];

              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveJobCategory(category.id)}
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
      )}

      {/* Unified Card Grid */}
      <div ref={gridRef}>
        {/* Template Cards */}
        {showTemplates && (
          <>
            {activeView === 'all' && (
              <div className="mb-6">
                <span className="block font-mono text-xs tracking-[0.15em] text-accent uppercase mb-1">
                  Design Templates
                </span>
                <p className="text-sm text-stone-warm">
                  Professional layouts — pick one and start building
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredTemplates.map((template, index) => {
                const isSelected = actions.selectedTemplate?.id === template.id;
                const isActionLoading = isSelected && (actions.creating || actions.checkingExistingResume);
                const loadingText = actions.checkingExistingResume ? 'Checking...' : actions.creating ? 'Creating...' : undefined;

                return (
                  <React.Fragment key={template.id}>
                    <TemplateCard
                      template={template}
                      isSelected={isSelected}
                      onSelect={actions.handleSelectTemplate}
                      onUseTemplate={actions.handleUseTemplate}
                      onPreview={actions.handlePreview}
                      isLoading={isActionLoading}
                      loadingText={loadingText}
                      eagerLoadImage={index < 3}
                    />
                    {(index + 1) % 6 === 0 && index >= 5 && (
                      <div className="col-span-full">
                        <InFeedAd
                          adSlot={AD_CONFIG.slots.carouselInfeed}
                          layout="row"
                          className="rounded-3xl"
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Empty template filter state */}
            {filteredTemplates.length === 0 && templates.length > 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-stone-warm mb-4">No templates match this filter.</p>
                <button
                  onClick={() => setActiveTemplateFilter('all')}
                  className="btn-secondary px-6 py-2.5"
                >
                  Show All Templates
                </button>
              </div>
            )}

            {/* Ad after templates if 4-5 templates shown */}
            {filteredTemplates.length >= 4 && filteredTemplates.length < 6 && (
              <div className="mt-8 lg:mt-12">
                <InFeedAd
                  adSlot={AD_CONFIG.slots.carouselInfeed}
                  layout="row"
                  className="rounded-3xl"
                />
              </div>
            )}
          </>
        )}

        {/* Divider between templates and examples in "All" view */}
        {activeView === 'all' && (
          <div className="my-12 md:my-16 border-t border-gray-200" />
        )}

        {/* Job Example Cards */}
        {showExamples && (
          <>
            <div className="mb-6">
              <span className="block font-mono text-xs tracking-[0.15em] text-accent uppercase mb-1">
                Resume Examples
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-ink mb-2">
                Resume Examples by Job Title
              </h2>
              <p className="text-sm md:text-base text-stone-warm max-w-3xl leading-relaxed">
                Browse professional resume examples for your specific role. Each includes
                pre-written content you can customize.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredJobs.map((job) => (
                <JobExampleCard
                  key={job.slug}
                  job={job}
                  showBadge={activeView === 'all'}
                  onImageClick={handleExampleImageClick}
                />
              ))}
            </div>

            {/* View All CTA */}
            <div className="text-center mt-10">
              <Link to="/examples" className="btn-secondary py-3 px-8 inline-block">
                View All Resume Examples
              </Link>
            </div>
          </>
        )}

        {/* SEO fallback: compact links when examples are hidden */}
        {activeView === 'templates' && (
          <div className="mt-12 md:mt-16 pt-8 border-t border-gray-200">
            <h2 className="font-display text-xl md:text-2xl font-extrabold tracking-tight text-ink mb-3">
              Resume Examples by Job Title
            </h2>
            <p className="text-sm text-stone-warm mb-4">
              Browse real resume examples for your specific role:
            </p>
            <div className="flex flex-wrap gap-2">
              {JOB_EXAMPLES_DATABASE.map((job) => (
                <Link
                  key={job.slug}
                  to={`/examples/${job.slug}`}
                  className="text-sm text-stone-warm hover:text-accent transition-colors
                    border border-gray-200 rounded-lg px-3 py-1.5 hover:border-accent/30"
                >
                  {job.title}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/examples" className="text-sm font-medium text-accent hover:underline">
                View all resume examples &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <TemplatePreviewModal
        isOpen={actions.showPreviewModal}
        onClose={() => actions.setShowPreviewModal(false)}
        templates={filteredTemplates}
        initialTemplateIndex={actions.previewTemplateIndex}
        onUseTemplate={actions.handleUseTemplate}
        isLoading={actions.creating || actions.checkingExistingResume}
      />

      <TemplateStartModal
        isOpen={actions.showStartModal}
        onClose={() => actions.setShowStartModal(false)}
        onSelectEmpty={actions.handleModalSelectEmpty}
        onSelectExample={actions.handleModalSelectExample}
        onSelectImport={actions.handleModalSelectImport}
        templateName={actions.selectedTemplateModalName}
      />

      <ResumeRecoveryModal
        isOpen={actions.showRecoveryModal}
        onClose={() => actions.setShowRecoveryModal(false)}
        resumeId={actions.existingResumeId || ''}
        resumeTitle={actions.existingResumeTitle}
        templateName={actions.selectedTemplateModalName}
        isAnonymous={actions.isAnonymous}
        onContinueAsGuest={actions.handleContinueAsGuest}
        onSignInToContinue={actions.handleSignInToContinue}
        onCreateNew={actions.handleCreateNewFromRecovery}
      />

      <AuthModal
        isOpen={actions.showAuthModal}
        onClose={() => actions.setShowAuthModal(false)}
        onSuccess={actions.handleAuthSuccess}
      />

      <JobExamplePreviewModal
        isOpen={showExampleModal}
        onClose={() => setShowExampleModal(false)}
        jobs={filteredJobs}
        initialIndex={exampleModalIndex}
      />
    </div>
  );
}
