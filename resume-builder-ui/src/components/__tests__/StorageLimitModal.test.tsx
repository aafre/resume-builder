import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StorageLimitModal } from '../StorageLimitModal';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('StorageLimitModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <StorageLimitModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('has role="dialog" and aria-modal="true"', () => {
    render(<StorageLimitModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-labelledby pointing to the title element', () => {
    render(<StorageLimitModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'storage-modal-title');
  });

  it('renders title "Storage Full" with correct id', () => {
    render(<StorageLimitModal {...defaultProps} />);
    const title = screen.getByText('Storage Full');
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute('id', 'storage-modal-title');
  });

  it('Manage Resumes button has focus-visible:ring classes', () => {
    render(<StorageLimitModal {...defaultProps} />);
    const manageBtn = screen.getByRole('button', { name: 'Manage Resumes' });
    expect(manageBtn.className).toMatch(/focus-visible:ring/);
  });

  it('Cancel button has focus-visible:ring classes', () => {
    render(<StorageLimitModal {...defaultProps} />);
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelBtn.className).toMatch(/focus-visible:ring/);
  });
});
