import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeListItem } from '../types';
import { ResumeCard } from '../components/ResumeCard';
import { GhostCard } from '../components/GhostCard';
import { DeleteResumeModal } from '../components/DeleteResumeModal';
import { DuplicateResumeModal } from '../components/DuplicateResumeModal';
import PreviewModal from '../components/PreviewModal';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useThumbnailRefresh } from '../hooks/useThumbnailRefresh';

export default function MyResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<ResumeListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [resumeToDuplicate, setResumeToDuplicate] = useState<ResumeListItem | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewResumeId, setPreviewResumeId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // Thumbnail refresh hook - manages auto-triggering and polling
  const {
    generatingIds,
    failedIds,
    triggerRefresh,
    retryFailed
  } = useThumbnailRefresh({
    onThumbnailUpdated: (resumeId, pdf_generated_at, thumbnail_url) => {
      // Update specific resume in state when thumbnail completes
      setResumes(prev => prev.map(r =>
        r.id === resumeId
          ? { ...r, pdf_generated_at, thumbnail_url }
          : r
      ));
    }
  });

  useEffect(() => {
    fetchResumes();
  }, []);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        setError('Supabase not configured');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch('/api/resumes?limit=50', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch resumes');
      }

      setResumes(result.resumes || []);

      // Auto-trigger thumbnail generation for stale resumes
      const staleResumes = (result.resumes || []).filter(resume => {
        // Skip if already generating or failed
        if (generatingIds.has(resume.id) || failedIds.has(resume.id)) {
          return false;
        }

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

    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load resumes');
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
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
    if (!resumeToDelete) return;

    try {
      setIsDeleting(true);

      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/resumes/${resumeToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete resume');
      }

      toast.success('Resume deleted successfully');
      setResumes(resumes.filter(r => r.id !== resumeToDelete.id));
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
    if (!resumeToDuplicate) return;

    try {
      setIsDuplicating(true);

      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/resumes/${resumeToDuplicate.id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ new_title: newTitle })
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error_code === 'RESUME_LIMIT_REACHED') {
          toast.error('You have reached the 5 resume limit. Delete a resume to continue.');
          return;
        }
        throw new Error(result.error || 'Failed to duplicate resume');
      }

      toast.success('Resume duplicated successfully');
      fetchResumes(); // Refresh list
      setDuplicateModalOpen(false);
      setResumeToDuplicate(null);
    } catch (err) {
      console.error('Error duplicating resume:', err);
      toast.error('Failed to duplicate resume');
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleRename = async (id: string, newTitle: string) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/resumes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ title: newTitle })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to rename resume');
      }

      // Optimistic update
      setResumes(resumes.map(r =>
        r.id === id ? { ...r, title: newTitle } : r
      ));

      toast.success('Resume renamed');
    } catch (err) {
      console.error('Error renaming resume:', err);
      toast.error('Failed to rename resume');
      throw err; // Re-throw so ResumeCard can revert
    }
  };

  const handleRefreshThumbnail = async (id: string) => {
    // Simple retry - hook handles all the logic
    await retryFailed(id);
  };

  const handleDownload = async (id: string) => {
    try {
      setDownloadingId(id);

      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/resumes/${id}/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const result = await response.json();

        // Special handling for missing icons error
        if (result.missing_icons && result.missing_icons.length > 0) {
          toast.error(
            `Cannot generate PDF: Missing ${result.missing_icons.length} icon(s)\n\n` +
            `Missing: ${result.missing_icons.join(', ')}\n\n` +
            `Please edit this resume to upload the missing icons or remove them.`,
            { duration: 8000 }
          );
          return;
        }

        throw new Error(result.error || 'Failed to generate PDF');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumes.find(r => r.id === id)?.title || 'Resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Resume downloaded successfully');
    } catch (err) {
      console.error('Error downloading resume:', err);
      toast.error('Failed to download resume');
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreview = async (id: string) => {
    try {
      setPreviewResumeId(id);
      setIsGeneratingPreview(true);
      setPreviewError(null);
      setShowPreviewModal(true); // Open modal immediately to show loading

      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/resumes/${id}/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const result = await response.json();

        // Special handling for missing icons error
        if (result.missing_icons && result.missing_icons.length > 0) {
          const errorMsg =
            `Cannot generate PDF: Missing ${result.missing_icons.length} icon(s)\n\n` +
            `Missing: ${result.missing_icons.join(', ')}\n\n` +
            `Please edit this resume to upload the missing icons or remove them.`;
          setPreviewError(errorMsg);
          toast.error(errorMsg, { duration: 8000 });
          return;
        }

        throw new Error(result.error || 'Failed to generate PDF');
      }

      // Create blob URL for modal instead of opening new tab
      const blob = await response.blob();

      // Clean up previous preview URL if exists
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }

      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      console.error('Error previewing resume:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to preview resume';
      setPreviewError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
  };

  const handleRefreshPreview = async () => {
    if (previewResumeId) {
      setPreviewError(null);
      await handlePreview(previewResumeId);
    }
  };

  const handleDownloadFromPreview = async () => {
    if (previewResumeId) {
      await handleDownload(previewResumeId);
    }
  };

  const handleCreateNew = () => {
    navigate('/templates');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Resumes</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchResumes}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        {/* Resume Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              onRefreshThumbnail={handleRefreshThumbnail}
              isGenerating={generatingIds.has(resume.id)}
              hasFailed={failedIds.has(resume.id)}
            />
          ))}
        </div>
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
        isStale={false}
        error={previewError}
        onRefresh={handleRefreshPreview}
        onDownload={handleDownloadFromPreview}
      />

      {/* Loading Overlays - only show for download now */}
      {downloadingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-center text-gray-700">
              Generating PDF...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
