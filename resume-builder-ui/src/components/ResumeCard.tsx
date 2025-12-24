import { ResumeListItem } from '../types';
import { useState } from 'react';
import { Download, Eye, RefreshCw } from 'lucide-react';
import { KebabMenu } from './KebabMenu';

interface ResumeCardProps {
  resume: ResumeListItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  onPreview: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, newTitle: string) => Promise<void>;
  onRefreshThumbnail?: (id: string) => void;
}

export function ResumeCard({
  resume,
  onEdit,
  onDelete,
  onDownload,
  onPreview,
  onDuplicate,
  onRename,
  onRefreshThumbnail
}: ResumeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(resume.title);
  const [isSaving, setIsSaving] = useState(false);

  // Check if thumbnail is stale (updated after last PDF generation)
  const isThumbnailStale = () => {
    if (!resume.pdf_generated_at) {
      // If no PDF was ever generated but resume exists, consider stale
      return true;
    }

    const updatedAt = new Date(resume.updated_at);
    const pdfGeneratedAt = new Date(resume.pdf_generated_at);

    return updatedAt > pdfGeneratedAt;
  };

  const thumbnailStale = isThumbnailStale();

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
    } catch (error) {
      // Revert on error
      setEditedTitle(resume.title);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden group"
    >
      {/* Thumbnail */}
      <div className="relative bg-gray-100 h-48 overflow-hidden cursor-pointer" onClick={() => onPreview(resume.id)}>
        <img
          src={resume.thumbnail_url || getTemplatePreview(resume.template_id)}
          alt={resume.title}
          className={`w-full h-full object-cover object-top transition-all duration-200 ${
            thumbnailStale ? 'blur-sm grayscale' : ''
          }`}
        />

        {/* Stale thumbnail overlay */}
        {thumbnailStale && onRefreshThumbnail && (
          <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 pointer-events-none">
            <div className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-md flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Thumbnail needs update
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefreshThumbnail(resume.id);
              }}
              className="bg-white text-amber-600 px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-amber-50 transition-colors pointer-events-auto"
            >
              Refresh Now
            </button>
          </div>
        )}

        {/* Preview hover overlay (only show if not stale) */}
        {!thumbnailStale && (
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
            className="font-bold text-xl text-gray-900 w-full bg-white border-2 border-blue-500 rounded px-2 py-1 focus:outline-none disabled:opacity-50 mb-2"
          />
        ) : (
          <h3
            className="font-bold text-xl text-gray-900 truncate mb-2 cursor-text hover:bg-gray-50 rounded px-2 py-1 -mx-2 transition"
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
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
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
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Edit Resume
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(resume.id);
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download PDF"
          >
            <Download className="w-5 h-5" />
          </button>

          <KebabMenu
            resumeId={resume.id}
            resumeTitle={resume.title}
            onRename={() => setIsEditing(true)}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
