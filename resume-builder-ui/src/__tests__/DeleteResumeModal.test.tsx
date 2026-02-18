import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteResumeModal } from '../components/DeleteResumeModal';
import { ResumeListItem } from '../types';

// Mock the ResumeListItem
const mockResume: ResumeListItem = {
  id: '123',
  title: 'My Resume',
  template_id: 'classic',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  last_accessed_at: '2023-01-01T00:00:00Z',
};

describe('DeleteResumeModal', () => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    // Assert role="dialog" is present (will fail until implemented)
    // We expect the dialog role to be on the content container
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Check for correct labels
    expect(dialog).toHaveAttribute('aria-labelledby', 'delete-resume-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'delete-resume-desc');

    // Check title and description
    expect(screen.getByText('Delete Resume?')).toHaveAttribute('id', 'delete-resume-title');
    expect(screen.getByText(/Are you sure you want to delete/)).toHaveAttribute('id', 'delete-resume-desc');
    expect(screen.getByText('My Resume')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={false}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Resume?')).not.toBeInTheDocument();
  });

  it('calls onConfirm when delete button is clicked', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('focuses the cancel button on mount', async () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await waitFor(() => {
      expect(document.activeElement).toBe(cancelButton);
    });
  });

  it('closes when Escape key is pressed', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('closes when backdrop is clicked', () => {
    // We'll need to rely on the implementation detail that the backdrop is the parent of the dialog
    // OR we can find the element that has the backdrop class
    const { container } = render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    // The first div in the component is the backdrop
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does NOT close when modal content is clicked', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('disables buttons when deleting', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
        isDeleting={true}
      />
    );

    expect(screen.getByText('Deleting...')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });
});
