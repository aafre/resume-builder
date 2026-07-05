import { ResumeListItem } from '../types';
import { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { KebabMenu } from './KebabMenu';

/**
 * Adds cache-busting query parameter to thumbnail URL
 * Uses pdf_generated_at timestamp to ensure unique URLs for each version
 */
const getThumbnailUrl = (
  thumbnail_url: string | null | undefined,
  pdf_generated_at: string | null | undefined
): string | null => {
  if (!thumbnail_url) return null;

  // If URL already has version param (from backend), use as-is
  if (thumbnail_url.includes('?v=')) return thumbnail_url;

  // Add pdf_generated_at as cache buster for backwards compatibility
  if (pdf_generated_at) {
    const date = new Date(pdf_generated_at);
    if (!isNaN(date.getTime())) {
      const timestamp = date.getTime();
      const url = new URL(thumbnail_url);
      url.searchParams.set('v', timestamp.toString());
      return url.toString();
    }
  }

  return thumbnail_url;
};

interface ResumeCardProps {
  resume: ResumeListItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  onPreview: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, newTitle: string) => Promise<void>;
  isEditButtonLoading?: boolean;
  isPreviewLoading?: boolean;
}

export function ResumeCard({
  resume,
  onEdit,
  onDelete,
  onDownload,
  onPreview,
  onDuplicate,
  onRename,
  isEditButtonLoading = false,
  isPreviewLoading = false
}: ResumeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(resume.title);
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTemplatePreview = (templateId: string) => {
    const templateImages: Record<string, string> = {
      'modern-with-icons': '/docs/templates/modern-with-icons.png',
      'modern-no-icons': '/docs/templates/modern-no-icons.png',
      'classic-alex-rivera': '/docs/templates/alex_rivera.png',
      'classic-jane-doe': '/docs/templates/jane_doe.png'
    };

    return templateImages[templateId] || '/docs/templates/modern-with-icons.png';
  };

  const getTemplateName = (templateId: string) => {
    return templateId
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const handleRename = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === resume.title || !trimmedTitle) {
      setIsEditing(false);
      setEditedTitle(resume.title);
      return;
    }

    setIsSaving(true);
    try {
      await onRename(resume.id, trimmedTitle);
      setIsEditing(false);
    } catch {
      // Revert on error
      setEditedTitle(resume.title);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 group"
    >
      {/* Thumbnail */}
      <div
        data-testid="thumbnail-container"
        role="button"
        tabIndex={!isPreviewLoading ? 0 : -1}
        aria-label={`Preview ${resume.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
        className={`relative bg-slate-100 h-48 overflow-hidden rounded-t-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
          isPreviewLoading ? 'cursor-wait' : 'cursor-pointer'
        }`}
        onClick={() => !isPreviewLoading && onPreview(resume.id)}
      >
        {/* Always show thumbnail - never hide it */}
        <img
          key={`${resume.id}-${resume.pdf_generated_at || 'default'}`}
          src={getThumbnailUrl(resume.thumbnail_url, resume.pdf_generated_at) || getTemplatePreview(resume.template_id)}
          alt={resume.title}
          className={`w-full h-full object-cover object-top transition-all duration-200 ${
            isPreviewLoading ? 'scale-105 blur-[2px]' : ''
          }`}
          width="300"
          height="192"
        />

        {/* Preview Loading Overlay */}
        {isPreviewLoading && (
          <div data-testid="preview-loading-overlay" className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
            <div data-testid="preview-loading-spinner" className="h-2 w-20 overflow-hidden rounded-full bg-white/30">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-white" />
            </div>
            <span className="text-white font-medium text-sm">Opening preview...</span>
          </div>
        )}

        {/* Preview Hover - Hide while loading */}
        {!isPreviewLoading && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <Eye className="w-8 h-8 text-white" />
            <span className="text-white font-medium text-lg">Preview</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title - editable */}
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            aria-label="Rename resume"
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setEditedTitle(resume.title);
                setIsEditing(false);
              }
            }}
            autoFocus
            disabled={isSaving}
            maxLength={200}
            className="font-bold text-xl text-gray-900 w-full bg-white border border-slate-300 rounded-lg px-2 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 mb-2"
          />
        ) : (
          <h3
            className="font-bold text-xl text-gray-900 truncate mb-2 cursor-text hover:bg-gray-50 rounded-lg px-2 py-2 -mx-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            role="button"
            tabIndex={0}
            aria-label={`Rename ${resume.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.currentTarget.click();
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            title="Click to rename"
          >
            {resume.title}
          </h3>
        )}

        {/* Metadata row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
            {getTemplateName(resume.template_id)}
          </span>
          <span className="text-xs text-gray-500">
            • Updated {formatDate(resume.updated_at)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(resume.id);
            }}
            disabled={isEditButtonLoading}
            className={`flex-1 min-h-11 bg-accent text-ink py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
              isEditButtonLoading
                ? 'opacity-75 cursor-not-allowed'
                : 'hover:bg-accent/90 active:scale-[0.98]'
            }`}
          >
            {isEditButtonLoading ? (
              <>
                <span data-testid="edit-loading-indicator" className="h-2 w-10 overflow-hidden rounded-full bg-ink/15">
                  <span className="block h-full w-1/2 animate-pulse rounded-full bg-ink/60" />
                </span>
                <span>Opening...</span>
              </>
            ) : (
              'Edit Resume'
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(resume.id);
            }}
            className="inline-flex min-h-11 min-w-11 items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            title="Download PDF"
            aria-label="Download PDF"
          >
            <Download className="w-5 h-5" />
          </button>

          <KebabMenu
            resumeId={resume.id}
            onRename={() => setIsEditing(true)}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
