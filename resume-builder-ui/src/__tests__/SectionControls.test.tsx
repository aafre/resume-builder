import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SectionControls from '../components/SectionControls';
import React from 'react';

describe('SectionControls', () => {
  const mockSetSections = vi.fn();
  const sections = [
    { id: '1', name: 'Section 1' },
    { id: '2', name: 'Section 2' },
    { id: '3', name: 'Section 3' },
  ];

  beforeEach(() => {
    mockSetSections.mockClear();
  });

  it('renders accessible buttons', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    // These should exist with aria-labels
    const upButton = screen.getByRole('button', { name: /move section up/i });
    const downButton = screen.getByRole('button', { name: /move section down/i });
    const deleteButton = screen.getByRole('button', { name: /delete section/i });

    expect(upButton).toBeInTheDocument();
    expect(downButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    expect(upButton).toHaveAttribute('type', 'button');
    expect(downButton).toHaveAttribute('type', 'button');
    expect(deleteButton).toHaveAttribute('type', 'button');
  });

  it('handles delete confirmation', async () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    const deleteButton = screen.getByRole('button', { name: 'Delete section' });
    fireEvent.click(deleteButton);

    // Should show confirmation dialog
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Verify message
    expect(within(dialog).getByText(/Are you sure you want to delete this section\?/i)).toBeInTheDocument();

    // Find confirmation button inside dialog
    // The dialog button text is "Delete"
    const confirmButton = within(dialog).getByRole('button', { name: 'Delete' });

    fireEvent.click(confirmButton);

    expect(mockSetSections).toHaveBeenCalledTimes(1);
  });

  it('moves section up', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    const upButton = screen.getByRole('button', { name: /move section up/i });
    fireEvent.click(upButton);

    expect(mockSetSections).toHaveBeenCalled();
    const newSections = mockSetSections.mock.calls[0][0];
    expect(newSections[0].id).toBe('2');
    expect(newSections[1].id).toBe('1');
  });

  it('moves section down', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    const downButton = screen.getByRole('button', { name: /move section down/i });
    fireEvent.click(downButton);

    expect(mockSetSections).toHaveBeenCalled();
    const newSections = mockSetSections.mock.calls[0][0];
    // Original: [1, 2, 3]. Index 1 is 2. Move down -> [1, 3, 2].
    expect(newSections[1].id).toBe('3');
    expect(newSections[2].id).toBe('2');
  });
});
