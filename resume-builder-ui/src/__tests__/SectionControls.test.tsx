import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SectionControls from '../components/SectionControls';

// Mock ResponsiveConfirmDialog since we want to test interaction with it
// But actually testing with the real component is better for integration testing
// However, since it uses portals or global styles, mocking might be safer.
// Let's try testing with the real component first.

describe('SectionControls', () => {
  const mockSetSections = vi.fn();
  const sections = [
    { name: 'Section 1', content: [] },
    { name: 'Section 2', content: [] },
    { name: 'Section 3', content: [] },
  ];

  beforeEach(() => {
    mockSetSections.mockClear();
  });

  it('renders accessible control buttons', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    expect(screen.getByRole('button', { name: /move section up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /move section down/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete section/i })).toBeInTheDocument();
  });

  it('calls setSections when move up is clicked', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /move section up/i }));
    expect(mockSetSections).toHaveBeenCalled();
  });

  it('calls setSections when move down is clicked', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /move section down/i }));
    expect(mockSetSections).toHaveBeenCalled();
  });

  it('shows confirmation dialog when delete is clicked', async () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    // Initial click should open modal, not call delete immediately
    fireEvent.click(screen.getByRole('button', { name: /delete section/i }));
    expect(mockSetSections).not.toHaveBeenCalled();

    // Check if modal is open
    // Note: ResponsiveConfirmDialog uses role="dialog"
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Find confirm button within dialog
    // We need to know what text the confirm button has. I'll use "Delete" in my implementation.
    const confirmButton = screen.getByRole('button', { name: /^delete$/i });
    fireEvent.click(confirmButton);

    expect(mockSetSections).toHaveBeenCalled();
  });
});
