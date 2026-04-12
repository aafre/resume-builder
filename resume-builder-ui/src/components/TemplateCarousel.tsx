import React, { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTemplates } from "../services/templates";
import { apiClient } from "../lib/api-client";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import yaml from "js-yaml";
import TemplateStartModal from "./TemplateStartModal";
import ResumeRecoveryModal from "./ResumeRecoveryModal";
import AuthModal from "./AuthModal";
import TemplateCard from "./TemplateCard";
import TemplateFilterBar, { FILTER_CATEGORIES } from "./TemplateFilterBar";
import TemplatePreviewModal from "./TemplatePreviewModal";
import { InFeedAd, AD_CONFIG } from "./ads";
import { useResumeCreate } from "../hooks/useResumeCreate";
import { trackTemplateSelected } from "../lib/analytics";

// Lazy-loaded error components
const NotFound = lazy(() => import("./NotFound"));
const ErrorPage = lazy(() => import("./ErrorPage"));

// Loading component for Suspense fallback
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

interface TemplateCarouselProps {
  /** Hide the header section when embedded in another page (e.g., TemplatesPage) */
  showHeader?: boolean;
}

const TemplateCarousel: React.FC<TemplateCarouselProps> = ({ showHeader = true }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<string | null>(null);
  const [checkingExistingResume, setCheckingExistingResume] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplateIndex, setPreviewTemplateIndex] = useState(0);
  const [existingResumeId, setExistingResumeId] = useState<string | null>(null);
  const [existingResumeTitle, setExistingResumeTitle] = useState<string>('');
  const [processingRecoveryRedirect, setProcessingRecoveryRedirect] = useState(false);
  const navigate = useNavigate();
  const { session, isAnonymous, isAuthenticated, anonMigrationInProgress } = useAuth();
  const { createResume, creating } = useResumeCreate();

  // Filter templates based on active category
  const filteredTemplates = useMemo(() => {
    if (activeFilter === 'all') return templates;
    const category = FILTER_CATEGORIES.find(c => c.id === activeFilter);
    if (!category || category.tags.length === 0) return templates;
    return templates.filter(t =>
      t.tags?.some(tag => (category.tags as readonly string[]).includes(tag))
    );
  }, [templates, activeFilter]);

  // Count templates per filter category
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

  // Fetch templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const data = await fetchTemplates();
        setTemplates(data);
        setSelectedTemplate(data[0] || null);
      } catch (err) {
        setError("Failed to load templates. Please try again later.");
        console.error("Error fetching templates:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Handle template selection
  const handleSelectTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
  }, []);

  // Handle preview
  const handlePreview = useCallback((template: Template) => {
    const index = filteredTemplates.findIndex(t => t.id === template.id);
    setPreviewTemplateIndex(index >= 0 ? index : 0);
    setShowPreviewModal(true);
  }, [filteredTemplates]);

  // Show modal when user clicks "Use Template"
  const handleUseTemplate = async (templateId: string) => {
    trackTemplateSelected({ template_id: templateId });
    if (!session) {
      toast.error("Please sign in to create a resume");
      return;
    }

    try {
      setCheckingExistingResume(true);

      // Fetch user's resumes to check if they already have one for this template
      const data = await apiClient.get('/api/resumes?limit=50', { session });
      const resumes = data.resumes || [];

      // Filter by template_id to find matching resumes
      const matchingResumes = resumes.filter(
        (resume: any) => resume.template_id === templateId
      );

      if (matchingResumes.length > 0) {
        // Get most recent resume (sort by updated_at DESC)
        const mostRecent = matchingResumes.sort(
          (a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0];

        setExistingResumeId(mostRecent.id);
        setExistingResumeTitle(mostRecent.title);
        setSelectedTemplateForModal(templateId);
        setShowPreviewModal(false);
        setShowRecoveryModal(true);
      } else {
        // No existing resume - show template start modal
        setSelectedTemplateForModal(templateId);
        setShowPreviewModal(false);
        setShowStartModal(true);
      }
    } catch (error) {
      console.error('Error checking existing resumes:', error);
      setSelectedTemplateForModal(templateId);
      setShowPreviewModal(false);
      setShowStartModal(true);
    } finally {
      setCheckingExistingResume(false);
    }
  };

  // Handle "Empty Structure" selection
  const handleModalSelectEmpty = async () => {
    if (!selectedTemplateForModal) return;

    setShowStartModal(false);
    await createResume({
      templateId: selectedTemplateForModal,
      loadExample: false,
    });
  };

  // Handle "Example Data" selection
  const handleModalSelectExample = async () => {
    if (!selectedTemplateForModal) return;

    setShowStartModal(false);
    await createResume({
      templateId: selectedTemplateForModal,
      loadExample: true,
    });
  };

  // Handle "Continue as Guest" / "Continue Editing" from recovery modal
  const handleContinueAsGuest = () => {
    setShowRecoveryModal(false);
    if (existingResumeId) {
      navigate(`/editor/${existingResumeId}`);
    }
  };

  // Handle "Sign In to Secure & Continue" from recovery modal
  const handleSignInToContinue = () => {
    if (existingResumeId) {
      localStorage.setItem('resume-recovery-intent', JSON.stringify({
        resumeId: existingResumeId,
        action: 'continue',
        timestamp: Date.now()
      }));
    }

    setShowRecoveryModal(false);
    setShowAuthModal(true);
  };

  // Handle successful authentication from AuthModal
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  // Handle "Create New Resume" from recovery modal (authenticated users only)
  const handleCreateNewFromRecovery = () => {
    setShowRecoveryModal(false);
    setShowStartModal(true);
  };

  // Handle AI resume import from TemplateStartModal
  const handleModalSelectImport = async (yamlString: string, confidence: number, warnings: string[]) => {
    setShowStartModal(false);

    const parsedYaml = yaml.load(yamlString) as {
      contact_info: any;
      sections: any[];
      __icons__?: Record<string, string>;
    };

    const iconsArray: { filename: string; data: string }[] = [];
    if (parsedYaml.__icons__) {
      for (const [filename, data] of Object.entries(parsedYaml.__icons__)) {
        iconsArray.push({ filename, data });
      }
    }

    const generateTitle = (): string => {
      const experienceSection = parsedYaml.sections.find(
        s => s.type === 'experience'
      );
      if (experienceSection && Array.isArray(experienceSection.content) &&
          experienceSection.content.length > 0) {
        const firstJob = experienceSection.content[0];
        if (typeof firstJob === 'object' && firstJob !== null && 'title' in firstJob && firstJob.title) {
          return firstJob.title;
        }
      }

      if (parsedYaml.contact_info?.name) {
        const templateName = (selectedTemplateForModal || 'modern')
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        return `${parsedYaml.contact_info.name} - ${templateName}`;
      }

      return 'Imported Resume';
    };

    await createResume({
      templateId: selectedTemplateForModal || 'modern',
      title: generateTitle(),
      contactInfo: parsedYaml.contact_info,
      sections: parsedYaml.sections,
      icons: iconsArray,
      aiImportConfidence: confidence,
      aiImportWarnings: warnings,
    });
  };

  // Check for recovery intent early on mount to prevent template page flash
  useEffect(() => {
    const recoveryIntent = localStorage.getItem('resume-recovery-intent');
    if (recoveryIntent) {
      try {
        const { timestamp } = JSON.parse(recoveryIntent);
        const isRecent = Date.now() - timestamp < 10 * 60 * 1000;

        if (isRecent && (isAuthenticated || anonMigrationInProgress)) {
          setProcessingRecoveryRedirect(true);
        }
      } catch (error) {
        console.error('Failed to parse recovery intent:', error);
      }
    }
  }, [isAuthenticated, anonMigrationInProgress]);

  // Handle post-auth navigation to resume from recovery intent
  useEffect(() => {
    if (isAuthenticated && !isAnonymous && !anonMigrationInProgress) {
      const recoveryIntent = localStorage.getItem('resume-recovery-intent');
      if (recoveryIntent) {
        try {
          const { resumeId, action, timestamp } = JSON.parse(recoveryIntent);
          const isRecent = Date.now() - timestamp < 10 * 60 * 1000;

          if (action === 'continue' && resumeId && isRecent) {
            localStorage.removeItem('resume-recovery-intent');
            setProcessingRecoveryRedirect(true);
            navigate(`/editor/${resumeId}`);
          } else {
            setProcessingRecoveryRedirect(false);
          }
        } catch (error) {
          console.error('Failed to parse recovery intent:', error);
          setProcessingRecoveryRedirect(false);
        }
      } else {
        setProcessingRecoveryRedirect(false);
      }
    }
  }, [isAuthenticated, isAnonymous, anonMigrationInProgress, navigate]);

  // Show loader if processing recovery redirect
  if (processingRecoveryRedirect || (anonMigrationInProgress && localStorage.getItem('resume-recovery-intent'))) {
    return (
      <div className="min-h-screen bg-chalk flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-xl text-stone-warm">
            Redirecting to your resume...
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-chalk flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-xl text-stone-warm">
            Loading beautiful templates...
          </p>
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

  return (
    <div className={showHeader ? "min-h-screen bg-chalk" : ""}>
      {/* Header Section - only shown when used standalone */}
      {showHeader && (
        <div className="text-center py-16 px-4">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink mb-6">
            Free Resume Templates
          </h1>
          <p className="text-xl font-extralight text-stone-warm max-w-2xl mx-auto leading-relaxed">
            Professional, ATS-friendly designs that get you interviews. Choose a template and start building in minutes.
          </p>
        </div>
      )}

      {/* Templates Gallery */}
      <div className="container mx-auto max-w-7xl px-4 pb-20">
        {/* Filter Bar */}
        <div className="mb-8 md:mb-10">
          <TemplateFilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            templateCounts={templateCounts}
          />
        </div>

        {/* Template Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredTemplates.map((template, index) => {
            const isSelected = selectedTemplate?.id === template.id;
            const isActionLoading = isSelected && (creating || checkingExistingResume);
            const loadingText = checkingExistingResume ? 'Checking...' : creating ? 'Creating...' : undefined;

            return (
              <React.Fragment key={template.id}>
                <TemplateCard
                  template={template}
                  isSelected={isSelected}
                  onSelect={handleSelectTemplate}
                  onUseTemplate={handleUseTemplate}
                  onPreview={handlePreview}
                  isLoading={isActionLoading}
                  loadingText={loadingText}
                  eagerLoadImage={index < 3}
                />
                {/* Insert in-feed ad after every 6 templates, starting after position 5 (0-indexed) */}
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

        {/* Empty filter state */}
        {filteredTemplates.length === 0 && templates.length > 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-stone-warm mb-4">No templates match this filter.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="btn-secondary px-6 py-2.5"
            >
              Show All Templates
            </button>
          </div>
        )}

        {/* Show ad after all templates if there are 4+ templates but less than 6 */}
        {filteredTemplates.length >= 4 && filteredTemplates.length < 6 && (
          <div className="mt-8 lg:mt-12">
            <InFeedAd
              adSlot={AD_CONFIG.slots.carouselInfeed}
              layout="row"
              className="rounded-3xl"
            />
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        templates={filteredTemplates}
        initialTemplateIndex={previewTemplateIndex}
        onUseTemplate={handleUseTemplate}
        isLoading={creating || checkingExistingResume}
      />

      {/* Template Start Modal */}
      <TemplateStartModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        onSelectEmpty={handleModalSelectEmpty}
        onSelectExample={handleModalSelectExample}
        onSelectImport={handleModalSelectImport}
        templateName={
          selectedTemplateForModal
            ? templates.find(t => t.id === selectedTemplateForModal)?.name || ''
            : ''
        }
      />

      {/* Resume Recovery Modal */}
      <ResumeRecoveryModal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
        resumeId={existingResumeId || ''}
        resumeTitle={existingResumeTitle}
        templateName={
          selectedTemplateForModal
            ? templates.find(t => t.id === selectedTemplateForModal)?.name || ''
            : ''
        }
        isAnonymous={isAnonymous}
        onContinueAsGuest={handleContinueAsGuest}
        onSignInToContinue={handleSignInToContinue}
        onCreateNew={handleCreateNewFromRecovery}
      />

      {/* Auth Modal (triggered from recovery modal) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default TemplateCarousel;
