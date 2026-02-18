import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SectionControls from '../components/SectionControls';

describe('SectionControls', () => {
  const mockSetSections = vi.fn();
  const sections = ['section1', 'section2', 'section3'];

  it('renders control buttons with correct accessibility labels', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    expect(screen.getByLabelText('Move section up')).toBeInTheDocument();
    expect(screen.getByLabelText('Move section down')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete section')).toBeInTheDocument();
  });

  it('disables "Move section up" when section is first', () => {
    render(
      <SectionControls
        sectionIndex={0}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    expect(screen.getByLabelText('Move section up')).toBeDisabled();
    expect(screen.getByLabelText('Move section down')).not.toBeDisabled();
  });

  it('disables "Move section down" when section is last', () => {
    render(
      <SectionControls
        sectionIndex={2}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    expect(screen.getByLabelText('Move section down')).toBeDisabled();
    expect(screen.getByLabelText('Move section up')).not.toBeDisabled();
  });

  it('calls setSections with updated array when moving up', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByLabelText('Move section up'));

    // Expect section1 and section2 to be swapped: ['section2', 'section1', 'section3']
    const expectedSections = ['section2', 'section1', 'section3'];
    expect(mockSetSections).toHaveBeenCalledWith(expectedSections);
  });

  it('calls setSections with updated array when moving down', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByLabelText('Move section down'));

    // Expect section2 and section3 to be swapped: ['section1', 'section3', 'section2']
    const expectedSections = ['section1', 'section3', 'section2'];
    expect(mockSetSections).toHaveBeenCalledWith(expectedSections);
  });

  it('calls setSections with updated array when deleting', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByLabelText('Delete section'));

    // Expect section2 to be removed: ['section1', 'section3']
    const expectedSections = ['section1', 'section3'];
    expect(mockSetSections).toHaveBeenCalledWith(expectedSections);
  });
});
