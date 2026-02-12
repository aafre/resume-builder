import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SectionControls from '../components/SectionControls';

describe('SectionControls', () => {
  const mockSetSections = vi.fn();
  const mockSections = [
    { id: '1', name: 'Section 1' },
    { id: '2', name: 'Section 2' },
    { id: '3', name: 'Section 3' },
  ];

  it('renders control buttons with accessible labels', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    // These should exist and be accessible
    expect(screen.getByLabelText('Move section up')).toBeInTheDocument();
    expect(screen.getByLabelText('Move section down')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete section')).toBeInTheDocument();
  });

  it('disables "Move up" button when section is first', () => {
    render(
      <SectionControls
        sectionIndex={0}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    const moveUpButton = screen.getByLabelText('Move section up');
    expect(moveUpButton).toBeDisabled();
  });

  it('disables "Move down" button when section is last', () => {
    render(
      <SectionControls
        sectionIndex={2}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    const moveDownButton = screen.getByLabelText('Move section down');
    expect(moveDownButton).toBeDisabled();
  });

  it('calls delete handler when delete button is clicked', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    const deleteButton = screen.getByLabelText('Delete section');
    fireEvent.click(deleteButton);

    // The component modifies the sections array and calls setSections
    expect(mockSetSections).toHaveBeenCalled();
  });
});
