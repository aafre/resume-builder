import React, { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTemplates } from "../services/templates";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import TemplateStartModal from "./TemplateStartModal";
import ResumeRecoveryModal from "./ResumeRecoveryModal";
import AuthModal from "./AuthModal";

// Lazy-loaded error components
const NotFound = lazy(() => import("./NotFound"));
const ErrorPage = lazy(() => import("./ErrorPage"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

interface Template {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const TemplateCarousel: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<string | null>(null);
  const [checkingExistingResume, setCheckingExistingResume] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [existingResumeId, setExistingResumeId] = useState<string | null>(null);
  const [existingResumeTitle, setExistingResumeTitle] = useState<string>('');
  const [processingRecoveryRedirect, setProcessingRecoveryRedirect] = useState(false);
  const navigate = useNavigate();
  const { session, isAnonymous, isAuthenticated, anonMigrationInProgress } = useAuth();

  // Fetch templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const data = await fetchTemplates();
        setTemplates(data);
        setSelectedTemplate(data[0] || null); // Select the first template by default
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
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  // Show modal when user clicks "Use Template"
  const handleUseTemplate = async (templateId: string) => {
    if (!session) {
      toast.error("Please sign in to create a resume");
      return;
    }

    try {
      setCheckingExistingResume(true);

      // Fetch user's resumes to check if they already have one for this template
      const response = await fetch('/api/resumes?limit=50', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }

      const data = await response.json();
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
        setShowRecoveryModal(true);
      } else {
        // No existing resume - show template start modal
        setSelectedTemplateForModal(templateId);
        setShowStartModal(true);
      }
    } catch (error) {
      console.error('Error checking existing resumes:', error);
      // Fallback to template start modal on error
      setSelectedTemplateForModal(templateId);
      setShowStartModal(true);
    } finally {
      setCheckingExistingResume(false);
    }
  };

  // Handle "Empty Structure" selection
  const handleModalSelectEmpty = async () => {
    if (!selectedTemplateForModal || !session) return;

    try {
      setCreating(true);
      setShowStartModal(false);

      // Create resume with empty structure (template sections but no content)
      const response = await fetch("/api/resumes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          template_id: selectedTemplateForModal,
          load_example: false  // Empty structure
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error_code === "RESUME_LIMIT_REACHED") {
          toast.error("Resume limit reached (5/5). Please delete a resume to create a new one.");
          navigate("/my-resumes");
          return;
        }
        throw new Error(data.error || "Failed to create resume");
      }

      // Navigate to editor
      toast.success("Resume created! Starting editor...");
      navigate(`/editor/${data.resume_id}`);
    } catch (err) {
      console.error("Error creating resume:", err);
      toast.error("Failed to create resume. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // Handle "Example Data" selection
  const handleModalSelectExample = async () => {
    if (!selectedTemplateForModal || !session) return;

    try {
      setCreating(true);
      setShowStartModal(false);

      // Create resume with example data from template
      const response = await fetch("/api/resumes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          template_id: selectedTemplateForModal,
          load_example: true  // Load example data
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error_code === "RESUME_LIMIT_REACHED") {
          toast.error("Resume limit reached (5/5). Please delete a resume to create a new one.");
          navigate("/my-resumes");
          return;
        }
        throw new Error(data.error || "Failed to create resume");
      }

      // Navigate to editor
      toast.success("Resume created! Starting editor...");
      navigate(`/editor/${data.resume_id}`);
    } catch (err) {
      console.error("Error creating resume:", err);
      toast.error("Failed to create resume. Please try again.");
    } finally {
      setCreating(false);
    }
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
    // Store resume_id in localStorage for post-auth navigation
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
    // Post-auth navigation is handled by useEffect below
  };

  // Handle "Create New Resume" from recovery modal (authenticated users only)
  const handleCreateNewFromRecovery = () => {
    setShowRecoveryModal(false);
    // Show TemplateStartModal to let them choose empty/example
    setShowStartModal(true);
  };

  // Check for recovery intent early on mount to prevent template page flash
  useEffect(() => {
    const recoveryIntent = localStorage.getItem('resume-recovery-intent');
    if (recoveryIntent) {
      try {
        const { timestamp } = JSON.parse(recoveryIntent);
        const isRecent = Date.now() - timestamp < 10 * 60 * 1000;

        // If recovery intent is fresh and user is authenticated/migrating, show loader
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
    // Only proceed if authenticated AND migration is complete
    if (isAuthenticated && !isAnonymous && !anonMigrationInProgress) {
      const recoveryIntent = localStorage.getItem('resume-recovery-intent');
      if (recoveryIntent) {
        try {
          const { resumeId, action, timestamp } = JSON.parse(recoveryIntent);

          // Check if intent is fresh (within 10 minutes)
          const isRecent = Date.now() - timestamp < 10 * 60 * 1000;

          if (action === 'continue' && resumeId && isRecent) {
            localStorage.removeItem('resume-recovery-intent');
            setProcessingRecoveryRedirect(true); // Keep loader visible during navigation

            // SAFE: resume_id stays the same during migration
            // Backend only updates user_id field (app.py:2479-2483)
            navigate(`/editor/${resumeId}`);
          } else {
            // Intent is stale or invalid, clear loader flag
            setProcessingRecoveryRedirect(false);
          }
        } catch (error) {
          console.error('Failed to parse recovery intent:', error);
          setProcessingRecoveryRedirect(false); // Clear loader on error
        }
      } else {
        // No recovery intent found, clear loader flag
        setProcessingRecoveryRedirect(false);
      }
    }
  }, [isAuthenticated, isAnonymous, anonMigrationInProgress, navigate]);

  // Show loader if processing recovery redirect (prevents template page flash after sign-in)
  if (processingRecoveryRedirect || (anonMigrationInProgress && localStorage.getItem('resume-recovery-intent'))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">
            Redirecting to your resume...
          </p>
        </div>
      </div>
    );
  }

  // Loading state for template fetch
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">
            Loading beautiful templates...
          </p>
        </div>
      </div>
    );
  }

  // Error state - use proper ErrorPage component
  if (error) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ErrorPage />
      </Suspense>
    );
  }

  // Empty state - use proper NotFound component for 404-style experience
  if (templates.length === 0) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 mb-6">
          Choose Your Perfect Template
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select a professional template that matches your style and industry
        </p>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {templates.map((template) => {
            const isSelected = selectedTemplate?.id === template.id;
            return (
              <div
                key={template.id}
                className={`group cursor-pointer transition-all duration-300 ${
                  isSelected ? "scale-[1.02]" : "hover:scale-[1.02]"
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <div
                  className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                    isSelected
                      ? "border-blue-500 ring-4 ring-blue-200/50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {/* Template Preview - Larger Image */}
                  <div className="relative overflow-hidden bg-gray-50">
                    <img
                      src={template.image_url}
                      alt={template.name}
                      className="w-full h-96 sm:h-[500px] object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    {isSelected && (
                      <div className="absolute top-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-xl">
                        <CheckCircleIcon className="w-7 h-7" />
                      </div>
                    )}

                    {/* Overlay with quick info on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end">
                      <div className="w-full p-6 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-medium">
                          Click to preview details
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Template Info - Compact but informative */}
                  <div className="p-6 lg:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {isSelected ? (
                        <>
                          <button
                            className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUseTemplate(template.id);
                            }}
                            disabled={creating || checkingExistingResume}
                          >
                            {checkingExistingResume ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Checking...
                              </>
                            ) : creating ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating...
                              </>
                            ) : (
                              <>
                                Start Building Resume
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <button className="btn-primary w-full py-4 px-6">
                          <span className="relative z-10">Select This Template</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Template Start Modal */}
      <TemplateStartModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        onSelectEmpty={handleModalSelectEmpty}
        onSelectExample={handleModalSelectExample}
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
