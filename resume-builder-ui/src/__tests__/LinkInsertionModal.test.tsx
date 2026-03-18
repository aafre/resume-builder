import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LinkInsertionModal } from '../components/LinkInsertionModal';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('LinkInsertionModal', () => {
  const mockOnClose = vi.fn();
  const mockOnInsert = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <LinkInsertionModal
        isOpen={true}
        onClose={mockOnClose}
        onInsert={mockOnInsert}
      />
    );

    expect(screen.getByRole('heading', { name: /Insert Link/i })).toBeInTheDocument();
  });

  it('should have accessible labels for inputs', () => {
    render(
      <LinkInsertionModal
        isOpen={true}
        onClose={mockOnClose}
        onInsert={mockOnInsert}
      />
    );

    // These will fail if labels are not associated with inputs
    expect(screen.getByLabelText(/Link Text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL/i)).toBeInTheDocument();
  });

  it('should have proper role and aria attributes', () => {
    render(
      <LinkInsertionModal
        isOpen={true}
        onClose={mockOnClose}
        onInsert={mockOnInsert}
      />
    );

    // This will fail if role="dialog" is missing
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('should validate URL and show error message with aria-invalid', () => {
    render(
      <LinkInsertionModal
        isOpen={true}
        onClose={mockOnClose}
        onInsert={mockOnInsert}
      />
    );

    const insertButton = screen.getByRole('button', { name: 'Insert Link' });
    fireEvent.click(insertButton);

    expect(mockOnInsert).not.toHaveBeenCalled();
    const urlInput = screen.getByLabelText(/URL/i);
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
    const errorMessage = screen.getByText('URL is required');
    expect(errorMessage).toBeInTheDocument();
    expect(urlInput).toHaveAttribute('aria-describedby', 'url-error');
  });

  it('should handle keyboard navigation (Escape)', () => {
    render(
      <LinkInsertionModal
        isOpen={true}
        onClose={mockOnClose}
        onInsert={mockOnInsert}
      />
    );

    // Simulate escape key on the dialog
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
