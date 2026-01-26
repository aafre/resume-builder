import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteResumeModal } from '../components/DeleteResumeModal';
import { ResumeListItem } from '../types';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import React from 'react';

const mockResume: ResumeListItem = {
  id: '1',
  title: 'My Resume',
  template_id: 'modern',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  last_accessed_at: '2024-01-01',
  thumbnail_url: null
};

describe('DeleteResumeModal', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correct accessible attributes', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'delete-modal-title');
    expect(modal).toHaveAttribute('aria-describedby', 'delete-modal-desc');
  });

  it('should focus cancel button on open', async () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        expect(cancelButton).toHaveFocus();
    });
  });

  it('should close on escape key', () => {
    render(
      <DeleteResumeModal
        resume={mockResume}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
