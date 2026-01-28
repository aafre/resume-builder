import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteResumeModal } from '../components/DeleteResumeModal';
import { ResumeListItem } from '../types';

const mockResume: ResumeListItem = {
  id: '1',
  title: 'Test Resume',
  template_id: 'template1',
  created_at: '2023-01-01',
  updated_at: '2023-01-02',
  last_accessed_at: '2023-01-03',
};

describe('DeleteResumeModal', () => {
  it('renders correctly when open', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    // This will fail initially because role="dialog" is missing
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete Resume?')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'delete-modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'delete-modal-desc');
  });

  it('focuses cancel button on mount', async () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await waitFor(() => expect(cancelButton).toHaveFocus());
  });

  it('calls onCancel when Escape is pressed', () => {
    const onCancel = vi.fn();
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={false}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
