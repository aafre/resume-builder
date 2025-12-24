import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeListItem } from '../types';
import { ResumeCard } from '../components/ResumeCard';
import { DeleteResumeModal } from '../components/DeleteResumeModal';
import { DuplicateResumeModal } from '../components/DuplicateResumeModal';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function MyResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<ResumeListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [resumeToDuplicate, setResumeToDuplicate] = useState<ResumeListItem | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

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
      setPreviewingId(id);

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
        throw new Error(result.error || 'Failed to generate PDF');
      }

      // Open preview in new tab
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Clean up after a delay
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('Error previewing resume:', err);
      toast.error('Failed to preview resume');
    } finally {
      setPreviewingId(null);
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
              <p className="text-gray-600 mt-1">
                {resumes.length}/5 resumes saved
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              disabled={resumes.length >= 5}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Resume
            </button>
          </div>

          {resumes.length >= 5 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Storage limit reached</p>
                <p className="text-sm text-yellow-700 mt-1">Delete an old resume to create a new one.</p>
              </div>
            </div>
          )}
        </div>

        {/* Resume Grid */}
        {resumes.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No resumes yet</h2>
            <p className="text-gray-600 mb-6">Create your first resume to get started</p>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              />
            ))}
          </div>
        )}
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

      {/* Loading Overlays */}
      {(downloadingId || previewingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-center text-gray-700">
              {downloadingId ? 'Generating PDF...' : 'Opening preview...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
