import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UploadResumeModal } from '../UploadResumeModal';

// Mock createPortal to render children inline instead of into document.body
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

// Mock useResumeParser hook
vi.mock('../../hooks/useResumeParser', () => ({
  useResumeParser: () => ({
    parseResume: vi.fn(),
    parsing: false,
    progress: 0,
    error: null,
  }),
}));

// Mock heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  CloudArrowUpIcon: (props: any) => <svg data-testid="cloud-icon" {...props} />,
  XMarkIcon: (props: any) => <svg data-testid="x-icon" {...props} />,
  CheckCircleIcon: (props: any) => <svg data-testid="check-icon" {...props} />,
  ExclamationTriangleIcon: (props: any) => <svg data-testid="exclamation-icon" {...props} />,
}));

vi.mock('@heroicons/react/24/solid', () => ({
  DocumentArrowUpIcon: (props: any) => <svg data-testid="doc-icon" {...props} />,
}));

describe('UploadResumeModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <UploadResumeModal isOpen={false} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('has role="dialog" and aria-modal="true"', () => {
    render(<UploadResumeModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-labelledby="upload-modal-title"', () => {
    render(<UploadResumeModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'upload-modal-title');
  });

  it('title "Upload Resume" has id="upload-modal-title"', () => {
    render(<UploadResumeModal {...defaultProps} />);
    const title = screen.getByText('Upload Resume');
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute('id', 'upload-modal-title');
  });

  it('close button has aria-label="Close upload modal"', () => {
    render(<UploadResumeModal {...defaultProps} />);
    const closeBtn = screen.getByRole('button', { name: 'Close upload modal' });
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn).toHaveAttribute('aria-label', 'Close upload modal');
  });

  it('close button has focus-visible:ring classes', () => {
    render(<UploadResumeModal {...defaultProps} />);
    const closeBtn = screen.getByRole('button', { name: 'Close upload modal' });
    expect(closeBtn.className).toMatch(/focus-visible:ring/);
  });

  it('file input has className with "sr-only" and "peer"', () => {
    render(<UploadResumeModal {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();
    expect(fileInput.className).toContain('sr-only');
    expect(fileInput.className).toContain('peer');
  });
});
