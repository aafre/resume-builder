import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResumeCard } from '../ResumeCard';
import type { ResumeListItem } from '../../types';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Download: (props: any) => <svg data-testid="download-icon" {...props} />,
  Eye: (props: any) => <svg data-testid="eye-icon" {...props} />,
}));

// Mock KebabMenu since we only test ResumeCard's own a11y
vi.mock('../KebabMenu', () => ({
  KebabMenu: () => <div data-testid="kebab-menu" />,
}));

describe('ResumeCard', () => {
  const mockResume: ResumeListItem = {
    id: 'test-id-123',
    title: 'My Test Resume',
    template_id: 'modern-with-icons',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_accessed_at: new Date().toISOString(),
    pdf_url: null,
    pdf_generated_at: null,
    thumbnail_url: null,
  };

  const defaultProps = {
    resume: mockResume,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onDownload: vi.fn(),
    onPreview: vi.fn(),
    onDuplicate: vi.fn(),
    onRename: vi.fn().mockResolvedValue(undefined),
  };

  it('Edit Resume button has focus-visible:ring classes', () => {
    render(<ResumeCard {...defaultProps} />);
    const editBtn = screen.getByRole('button', { name: 'Edit Resume' });
    expect(editBtn.className).toMatch(/focus-visible:ring/);
  });

  it('Download PDF button has focus-visible:ring classes', () => {
    render(<ResumeCard {...defaultProps} />);
    const downloadBtn = screen.getByRole('button', { name: 'Download PDF' });
    expect(downloadBtn.className).toMatch(/focus-visible:ring/);
  });

  it('Download PDF button has aria-label="Download PDF"', () => {
    render(<ResumeCard {...defaultProps} />);
    const downloadBtn = screen.getByRole('button', { name: 'Download PDF' });
    expect(downloadBtn).toHaveAttribute('aria-label', 'Download PDF');
  });
});
