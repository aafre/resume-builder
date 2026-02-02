import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteResumeModal } from '../components/DeleteResumeModal';
import { ResumeListItem } from '../types';
import { vi } from 'vitest';

describe('DeleteResumeModal', () => {
  const mockResume: ResumeListItem = {
    id: '123',
    title: 'My Test Resume',
    updated_at: '2023-01-01T00:00:00Z',
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'user123',
    template_id: 'modern',
    thumbnail_url: null,
    is_base_resume: false
  };

  const defaultProps = {
    resume: mockResume,
    isOpen: true,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    isDeleting: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Basic rendering tests
  it('renders correctly when open', () => {
    render(<DeleteResumeModal {...defaultProps} />);

    expect(screen.getByText('Delete Resume?')).toBeInTheDocument();
    expect(screen.getByText('My Test Resume')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<DeleteResumeModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Delete Resume?')).not.toBeInTheDocument();
  });

  it('calls onConfirm when delete button is clicked', () => {
    render(<DeleteResumeModal {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<DeleteResumeModal {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  // Accessibility Tests
  it('has correct accessibility attributes', () => {
    render(<DeleteResumeModal {...defaultProps} />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(modal).toHaveAttribute('aria-describedby', 'modal-description');

    expect(screen.getByText('Delete Resume?')).toHaveAttribute('id', 'modal-title');
    // The description part might be the whole paragraph or just the warning
    // Adjust selector as needed based on implementation
  });

  it('focuses the Cancel button on open', async () => {
    render(<DeleteResumeModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    });
  });

  it('closes on Escape key press', () => {
    render(<DeleteResumeModal {...defaultProps} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('decorative icon is hidden from screen readers', () => {
    const { container } = render(<DeleteResumeModal {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
