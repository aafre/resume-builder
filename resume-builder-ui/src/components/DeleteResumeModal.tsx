import { ResumeListItem } from '../types';
import ResponsiveConfirmDialog from './ResponsiveConfirmDialog';

interface DeleteResumeModalProps {
  resume: ResumeListItem | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteResumeModal({
  resume,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting = false
}: DeleteResumeModalProps) {
  if (!isOpen || !resume) return null;

  return (
    <ResponsiveConfirmDialog
      isOpen={isOpen}
      onClose={onCancel}
      onConfirm={onConfirm}
      title="Delete Resume?"
      message={`Are you sure you want to delete "${resume.title}"?\nThis will permanently remove the resume and all its data.`}
      confirmText="Delete"
      cancelText="Cancel"
      isDestructive={true}
      isLoading={isDeleting}
    />
  );
}
