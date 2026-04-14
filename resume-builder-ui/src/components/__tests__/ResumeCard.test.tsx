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

function createResume(overrides: Partial<ResumeListItem> = {}): ResumeListItem {
  return {
    id: 'test-id-123',
    title: 'My Test Resume',
    template_id: 'modern-with-icons',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_accessed_at: new Date().toISOString(),
    pdf_url: null,
    pdf_generated_at: null,
    thumbnail_url: null,
    ...overrides,
  };
}

function defaultProps(resume?: ResumeListItem) {
  return {
    resume: resume || createResume(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onDownload: vi.fn(),
    onPreview: vi.fn(),
    onDuplicate: vi.fn(),
    onRename: vi.fn().mockResolvedValue(undefined),
  };
}

describe('ResumeCard', () => {
  it('Edit Resume button has focus-visible:ring classes', () => {
    render(<ResumeCard {...defaultProps()} />);
    const editBtn = screen.getByRole('button', { name: 'Edit Resume' });
    expect(editBtn.className).toMatch(/focus-visible:ring/);
  });

  it('Download PDF button has focus-visible:ring classes', () => {
    render(<ResumeCard {...defaultProps()} />);
    const downloadBtn = screen.getByRole('button', { name: 'Download PDF' });
    expect(downloadBtn.className).toMatch(/focus-visible:ring/);
  });

  it('Download PDF button has aria-label="Download PDF"', () => {
    render(<ResumeCard {...defaultProps()} />);
    const downloadBtn = screen.getByRole('button', { name: 'Download PDF' });
    expect(downloadBtn).toHaveAttribute('aria-label', 'Download PDF');
  });
});

describe('ResumeCard relative time display', () => {
  it('shows "Just now" for updates less than 60 seconds ago', () => {
    const resume = createResume({ updated_at: new Date().toISOString() });
    render(<ResumeCard {...defaultProps(resume)} />);
    expect(screen.getByText(/Just now/)).toBeTruthy();
  });

  it('shows minutes ago for updates 1-59 minutes old', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const resume = createResume({ updated_at: fiveMinutesAgo });
    render(<ResumeCard {...defaultProps(resume)} />);
    expect(screen.getByText(/5m ago/)).toBeTruthy();
  });

  it('shows hours ago for updates 1-23 hours old', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
    const resume = createResume({ updated_at: threeHoursAgo });
    render(<ResumeCard {...defaultProps(resume)} />);
    expect(screen.getByText(/3h ago/)).toBeTruthy();
  });

  it('shows days ago for updates 1-6 days old', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400 * 1000).toISOString();
    const resume = createResume({ updated_at: twoDaysAgo });
    render(<ResumeCard {...defaultProps(resume)} />);
    expect(screen.getByText(/2d ago/)).toBeTruthy();
  });

  it('shows absolute date for updates older than 7 days', () => {
    const resume = createResume({ updated_at: '2025-01-10T10:00:00Z' });
    render(<ResumeCard {...defaultProps(resume)} />);
    expect(screen.getByText(/Jan 10, 2025/)).toBeTruthy();
  });

  it('shows correct time for an old resume, not "Just now"', () => {
    // This is the core regression test for the timestamp corruption bug.
    // An old resume should NOT show "Just now" — it should show a meaningful time.
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400 * 1000).toISOString();
    const resume = createResume({ updated_at: thirtyDaysAgo });
    render(<ResumeCard {...defaultProps(resume)} />);
    // Should show an absolute date, NOT "Just now"
    expect(screen.queryByText(/Just now/)).toBeNull();
  });
});
