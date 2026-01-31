import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteResumeModal } from '../components/DeleteResumeModal';
import { describe, it, expect, vi } from 'vitest';
import { ResumeListItem } from '../types';

describe('DeleteResumeModal', () => {
  const mockResume: ResumeListItem = {
    id: '123',
    title: 'Test Resume',
    template_id: 'modern',
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
    last_accessed_at: '2023-01-01',
    pdf_url: null,
    pdf_generated_at: null,
    thumbnail_url: null
  };

  it('renders with correct accessibility attributes', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'delete-modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'delete-modal-description');

    expect(screen.getByText('Delete Resume?')).toHaveAttribute('id', 'delete-modal-title');
    expect(screen.getByText(/Are you sure you want to delete/)).toHaveAttribute('id', 'delete-modal-description');

    // Check icon is hidden
    const icon = screen.getByRole('dialog').querySelector('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
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

    // Wait for timeout in useEffect
    await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        expect(document.activeElement).toBe(cancelButton);
    });
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
});
