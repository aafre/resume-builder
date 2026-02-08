import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EditorToolbar from '../components/EditorToolbar';

describe('EditorToolbar', () => {
  const defaultProps = {
    onAddSection: vi.fn(),
    onGenerateResume: vi.fn(),
    onExportYAML: vi.fn(),
    onImportYAML: vi.fn(),
    onToggleHelp: vi.fn(),
    onLoadEmptyTemplate: vi.fn(),
    loadingAddSection: false,
    generating: false,
    loadingSave: false,
    loadingLoad: false,
    showAdvancedMenu: false,
    setShowAdvancedMenu: vi.fn(),
    mode: 'floating' as const,
  };

  it('renders accessible buttons', () => {
    render(<EditorToolbar {...defaultProps} />);

    // The "Add New Section" button
    const addSectionButton = screen.getByLabelText(/add new section/i);
    expect(addSectionButton).toBeInTheDocument();
    expect(addSectionButton).toBeEnabled();

    // The "Download My Resume" button
    // It has visible text, but we'll add aria-label for consistency and better a11y
    const downloadButton = screen.getByLabelText(/download resume/i);
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toBeEnabled();

    // The "More Options" button
    const moreOptionsButton = screen.getByLabelText(/more options/i);
    expect(moreOptionsButton).toBeInTheDocument();
  });
});
