import { useState, useEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ResumeListItem } from '../types';
import { ResumeCard, getThumbnailUrl } from '../components/ResumeCard';
import { GhostCard } from '../components/GhostCard';
import { DeleteResumeModal } from '../components/DeleteResumeModal';
import { DuplicateResumeModal } from '../components/DuplicateResumeModal';
import PreviewModal from '../components/PreviewModal';
import SignInRequiredGate from '../components/SignInRequiredGate';
import { apiClient, ApiError } from '../lib/api-client';
import { toast } from 'react-hot-toast';
import { useThumbnailRefresh } from '../hooks/useThumbnailRefresh';
import { useResumes } from '../hooks/useResumes';
import { useAuth } from '../contexts/AuthContext';
import { usePreview } from '../hooks/usePreview';
import { InContentAd, AD_CONFIG } from '../components/ads';
import { SectionEmptyState } from '../components/shared/SectionEmptyState';
import { trackPdfDownloaded, trackPdfDownloadFailed } from '../lib/analytics';
import { withViewTransition } from '../lib/viewTransition';

export default function MyResumes() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, loading: authLoading, isAnonymous } = useAuth();
  const { data: resumes = [], isLoading, isError, error, refetch } = useResumes();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<ResumeListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDownloadingFromPreview, setIsDownloadingFromPreview] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [resumeToDuplicate, setResumeToDuplicate] = useState<ResumeListItem | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewResumeId, setPreviewResumeId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  /**
   * Id of the card thumbnail currently carrying `view-transition-name:
   * resume-sheet`. Exactly one element in the document may hold that name, so
   * it moves in lockstep with the preview modal opening and closing — the card
   * hands it to the modal's sheet on the way in, and takes it back on the way
   * out.
   */
  const [morphId, setMorphId] = useState<string | null>(null);
  const downloadPromiseRef = useRef<Promise<void> | null>(null);

  // Preview hook - database mode for fetching pre-generated PDFs
  const {
    previewUrl,
    isGenerating: isGeneratingPreview,
    error: previewError,
    generatePreview,
    checkAndRefreshIfStale,
  } = usePreview({
    mode: 'database',
    resumeId: previewResumeId || undefined,
    session,
  });

  // Memoize callback to prevent unnecessary re-renders in useThumbnailRefresh
  const onThumbnailUpdated = useCallback((resumeId: string, pdf_generated_at: string, thumbnail_url: string) => {
    // Update cache optimistically when thumbnail completes
    queryClient.setQueryData<ResumeListItem[]>(
      ['resumes', session?.user?.id],
      (old) => old?.map(r =>
        r.id === resumeId
          ? { ...r, pdf_generated_at, thumbnail_url }
          : r
      ) || []
    );
  }, [queryClient, session?.user?.id]);

  // Thumbnail refresh hook - manages auto-triggering and silent retries
  const {
    triggerRefresh
  } = useThumbnailRefresh({
    session,
    onThumbnailUpdated
  });

  // Force refetch on mount to ensure fresh data for auto-trigger
  // Prevents React Query cache from returning stale timestamps when navigating from editor
  useEffect(() => {
    refetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-trigger thumbnail generation for stale resumes when data loads
  useEffect(() => {
    if (!resumes.length) return;

    const staleResumes = resumes.filter(resume => {
      // Never had thumbnail
      if (!resume.pdf_generated_at) return true;

      // Updated after last thumbnail generation
      const updatedAt = new Date(resume.updated_at);
      const pdfGeneratedAt = new Date(resume.pdf_generated_at);
      return updatedAt > pdfGeneratedAt;
    });

    // Trigger all stale resumes in parallel
    staleResumes.forEach(resume => {
      triggerRefresh(resume.id);
    });
  }, [resumes, triggerRefresh]);

  const handleEdit = (id: string) => {
    setEditingId(id);
    navigate(`/editor/${id}`);
  };

  const handleDelete = (id: string) => {
    const resume = resumes.find(r => r.id === id);
    if (resume) {
      setResumeToDelete(resume);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!resumeToDelete || !session) return;

    try {
      setIsDeleting(true);

      // Use centralized API client (handles auth, 401/403 interceptor)
      await apiClient.delete(`/api/resumes/${resumeToDelete.id}`);

      toast.success('Resume deleted successfully');
      refetch(); // Refetch to update the list

      // Invalidate count cache to update header badge
      queryClient.invalidateQueries({
        queryKey: ['resume-count', session?.user?.id]
      });

      setDeleteModalOpen(false);
      setResumeToDelete(null);
    } catch (err) {
      console.error('Error deleting resume:', err);
      toast.error('Failed to delete resume');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = (id: string) => {
    const resume = resumes.find(r => r.id === id);
    if (resume) {
      setResumeToDuplicate(resume);
      setDuplicateModalOpen(true);
    }
  };

  const confirmDuplicate = async (newTitle: string) => {
    if (!resumeToDuplicate || !session) return;

    try {
      setIsDuplicating(true);

      // Use centralized API client (handles auth, 401/403 interceptor)
      await apiClient.post(`/api/resumes/${resumeToDuplicate.id}/duplicate`, {
        new_title: newTitle
      });

      toast.success('Resume duplicated successfully');
      refetch(); // Refetch to update the list

      // Invalidate count cache to update header badge
      queryClient.invalidateQueries({
        queryKey: ['resume-count', session?.user?.id]
      });

      setDuplicateModalOpen(false);
      setResumeToDuplicate(null);
    } catch (err) {
      console.error('Error duplicating resume:', err);

      // Check for resume limit error
      if (err instanceof ApiError && err.data?.error_code === 'RESUME_LIMIT_REACHED') {
        toast.error('You have reached the 5 resume limit. Delete a resume to continue.');
        return;
      }

      toast.error('Failed to duplicate resume');
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleRename = async (id: string, newTitle: string) => {
    if (!session) return;

    try {
      // Use centralized API client (handles auth, 401/403 interceptor)
      const result = await apiClient.patch(`/api/resumes/${id}`, { title: newTitle });

      // Update query cache with server-returned updated_at for accurate display
      queryClient.setQueryData<ResumeListItem[]>(
        ['resumes', session?.user?.id],
        (old) => old?.map(r =>
          r.id === id
            ? { ...r, title: newTitle, updated_at: result.updated_at || new Date().toISOString() }
            : r
        ) || []
      );

      toast.success('Resume renamed');
    } catch (err) {
      console.error('Error renaming resume:', err);
      toast.error('Failed to rename resume');
      throw err; // Re-throw so ResumeCard can revert
    }
  };

  const handleDownload = async (id: string) => {
    if (!session) return;

    // Deduplicate requests - return existing promise if download in progress
    if (downloadPromiseRef.current) {
      return downloadPromiseRef.current;
    }

    const promise = (async () => {
      try {
        setDownloadingId(id);

        // Download the PDF using apiClient for automatic token refresh
        const blob = await apiClient.postBlob(`/api/resumes/${id}/pdf`, null, { session });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumes.find(r => r.id === id)?.title || 'Resume'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success('Resume downloaded successfully');
        trackPdfDownloaded({
          template_id: resumes.find(r => r.id === id)?.template_id || 'unknown',
          source: 'my_resumes',
        });
      } catch (err) {
        console.error('Error downloading resume:', err);
        trackPdfDownloadFailed({
          template_id: resumes.find(r => r.id === id)?.template_id || 'unknown',
          source: 'my_resumes',
          error_type: err instanceof ApiError && err.data?.missing_icons ? 'missing_icons' : 'unknown',
        });

        // Special handling for missing icons error
        if (err instanceof ApiError && err.data?.missing_icons) {
          toast.error(
            `Cannot generate PDF: Missing ${err.data.missing_icons.length} icon(s)\n\n` +
            `Missing: ${err.data.missing_icons.join(', ')}\n\n` +
            `Please edit this resume to upload the missing icons or remove them.`,
            { duration: 8000 }
          );
          return;
        }

        toast.error('Failed to download resume');
      } finally {
        setDownloadingId(null);
        downloadPromiseRef.current = null;
      }
    })();

    downloadPromiseRef.current = promise;
    return promise;
  };

  const handlePreview = (id: string) => {
    if (!session) return;

    // Name the thumbnail before the snapshot: startViewTransition captures the
    // DOM as it stands when its callback returns, so the outgoing element has
    // to already carry the name.
    flushSync(() => setMorphId(id));

    // Set loading state and resume ID, open modal (effect will handle generation)
    withViewTransition(() => {
      setMorphId(null);
      setPreviewingId(id);
      setPreviewResumeId(id);
      setShowPreviewModal(true);
    });
  };

  // Trigger preview generation when modal opens with a resume ID.
  // Following React best practices, including all dependencies.
  // The deduplication logic in usePreview prevents double generation.
  useEffect(() => {
    if (showPreviewModal && previewResumeId) {
      checkAndRefreshIfStale();
    }
  }, [showPreviewModal, previewResumeId, checkAndRefreshIfStale]);

  // Morph back into the card that opened the sheet, then release the name.
  const handleClosePreview = () => {
    const returningTo = previewResumeId;
    withViewTransition(() => {
      setShowPreviewModal(false);
      setPreviewingId(null);
      setMorphId(returningTo);
    }).then(() => setMorphId(null));
  };

  const handleRefreshPreview = async () => {
    await generatePreview();
  };

  const handleDownloadFromPreview = async () => {
    if (previewResumeId) {
      setIsDownloadingFromPreview(true);
      try {
        await handleDownload(previewResumeId);
      } finally {
        setIsDownloadingFromPreview(false);
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/templates');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-chalk flex items-center justify-center px-4">
        <div className="text-center rounded-2xl border border-black/[0.06] bg-white p-8 shadow-premium">
          <div className="mx-auto mb-4 h-2 w-24 overflow-hidden rounded-full bg-chalk-dark">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
          </div>
          <p className="font-display font-extralight text-ink/60">
            {authLoading ? 'Initializing authentication...' : 'Loading your resumes...'}
          </p>
          {authLoading && (
            <p className="text-ink/60 text-sm mt-2">
              If this takes more than 10 seconds, try refreshing the page
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show gate for anonymous users
  if (!authLoading && isAnonymous) {
    return <SignInRequiredGate />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-chalk flex items-center justify-center px-4">
        <div className="text-center max-w-md rounded-2xl border border-red-100 bg-white p-8 shadow-premium">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-2">Error Loading Resumes</h2>
          <p className="font-display font-extralight text-ink/60 mb-4">{error?.message || 'Failed to load resumes'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="btn-primary px-6"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chalk">
      <div className="container mx-auto px-4 py-8 md:py-10 max-w-[1200px]">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase">
              Dashboard
            </p>
            <h1 className="mt-1 font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
              My Resumes
            </h1>
          </div>
          <p className="text-sm font-medium text-ink/60">
            {resumes.length} of 5 resumes used
          </p>
        </div>

        {/* Resume Grid */}
        {resumes.length === 0 ? (
          <SectionEmptyState
            headline="No resumes yet."
            hint="Pick a template and your first resume starts as a filled-in draft you edit, not a blank page. You can keep up to 5."
            addLabel="Create your first resume"
            onAdd={handleCreateNew}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {/* Ghost Card - Always first */}
            <GhostCard
              isAtLimit={resumes.length >= 5}
              resumeCount={resumes.length}
              onCreateNew={handleCreateNew}
              onUpgrade={() => toast('Pricing coming soon!')}
            />

            {/* Existing resume cards */}
            {resumes.map(resume => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onPreview={handlePreview}
                onDuplicate={handleDuplicate}
                onRename={handleRename}
                isEditButtonLoading={editingId === resume.id}
                isPreviewLoading={previewingId === resume.id && isGeneratingPreview}
                isMorphing={morphId === resume.id}
              />
            ))}
          </div>
        )}

        {/* In-content ad below resume grid */}
        <InContentAd
          adSlot={AD_CONFIG.slots.myresumesIncontent}
          size="standard"
          marginY={32}
        />
      </div>

      {/* Delete Modal */}
      <DeleteResumeModal
        resume={resumeToDelete}
        isOpen={deleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setResumeToDelete(null);
        }}
        isDeleting={isDeleting}
      />

      {/* Duplicate Modal */}
      <DuplicateResumeModal
        resume={resumeToDuplicate}
        isOpen={duplicateModalOpen}
        onConfirm={confirmDuplicate}
        onCancel={() => {
          setDuplicateModalOpen(false);
          setResumeToDuplicate(null);
        }}
        isDuplicating={isDuplicating}
      />

      {/* PDF Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={handleClosePreview}
        previewUrl={previewUrl}
        isGenerating={isGeneratingPreview}
        isDownloading={isDownloadingFromPreview}
        isStale={false}
        error={previewError}
        /* The same URL the card renders, so the morph does not swap images
           mid-flight and the sheet is painted before the PDF arrives. */
        posterUrl={(() => {
          const r = resumes.find(x => x.id === previewResumeId);
          return r ? getThumbnailUrl(r.thumbnail_url, r.pdf_generated_at) : null;
        })()}
        onRefresh={handleRefreshPreview}
        onDownload={handleDownloadFromPreview}
      />

      {/* Loading Overlays - only show for download now */}
      {downloadingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-premium">
            <div className="mx-auto mb-4 h-2 w-24 overflow-hidden rounded-full bg-chalk-dark">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
            </div>
            <p className="text-center font-display font-extralight text-ink/60">
              Generating PDF...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
