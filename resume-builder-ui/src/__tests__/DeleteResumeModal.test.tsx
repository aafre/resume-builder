import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteResumeModal } from '../components/DeleteResumeModal';
import { vi } from 'vitest';
import { ResumeListItem } from '../types';

describe('DeleteResumeModal', () => {
  const mockResume: ResumeListItem = {
    id: '123',
    title: 'My Resume',
    slug: 'my-resume',
    template_id: 'modern',
    user_id: 'user123',
    is_public: false,
    thumbnail_url: null,
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
    pdf_generated_at: null,
  };

  const defaultProps = {
    resume: mockResume,
    isOpen: true,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<DeleteResumeModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete Resume?')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    expect(screen.getByText('My Resume')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<DeleteResumeModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Resume?')).not.toBeInTheDocument();
  });

  it('calls onConfirm when delete button is clicked', () => {
    render(<DeleteResumeModal {...defaultProps} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<DeleteResumeModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('focuses the cancel button on mount for accessibility', () => {
    render(<DeleteResumeModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    expect(document.activeElement).toBe(cancelButton);
  });

  it('calls onCancel when Escape key is pressed', () => {
    render(<DeleteResumeModal {...defaultProps} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    render(<DeleteResumeModal {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'delete-modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'delete-modal-desc');

    expect(screen.getByText('Delete Resume?')).toHaveAttribute('id', 'delete-modal-title');
    // Using a more specific selector for the description paragraph since it contains the resume title in a strong tag
    const description = screen.getByText(/Are you sure you want to delete/).closest('p');
    expect(description).toHaveAttribute('id', 'delete-modal-desc');
  });
});
