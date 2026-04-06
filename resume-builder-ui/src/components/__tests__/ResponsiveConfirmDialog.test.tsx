import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResponsiveConfirmDialog from '../ResponsiveConfirmDialog';

describe('ResponsiveConfirmDialog', () => {
  it('renders correctly and buttons are accessible', () => {
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();

    render(
      <ResponsiveConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('buttons have focus-visible styles', () => {
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();

    render(
      <ResponsiveConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    );

    const closeBtn = screen.getByRole('button', { name: 'Close dialog' });
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });

    // Ensure buttons have focus-visible classes
    expect(closeBtn.className).toMatch(/focus-visible:ring/);
    expect(cancelBtn.className).toMatch(/focus-visible:ring/);
    expect(confirmBtn.className).toMatch(/focus-visible:ring/);
  });
});
