import { render, screen, fireEvent } from '@testing-library/react';
import SectionControls from '../components/SectionControls';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('SectionControls', () => {
  const mockSetSections = vi.fn();
  const sections = ['section1', 'section2', 'section3'];

  it('renders correctly with accessibility attributes', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    // Check for buttons with aria-labels
    expect(screen.getByLabelText('Move section up')).toBeInTheDocument();
    expect(screen.getByLabelText('Move section down')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete section')).toBeInTheDocument();

    // Check for title attributes (tooltips)
    expect(screen.getByTitle('Move section up')).toBeInTheDocument();
    expect(screen.getByTitle('Move section down')).toBeInTheDocument();
    expect(screen.getByTitle('Delete section')).toBeInTheDocument();
  });

  it('handles move up', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByLabelText('Move section up'));
    expect(mockSetSections).toHaveBeenCalled();
    // Logic: moving index 1 to 0. ['section2', 'section1', 'section3']
    const expected = ['section2', 'section1', 'section3'];
    expect(mockSetSections).toHaveBeenCalledWith(expected);
  });

  it('handles move down', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByLabelText('Move section down'));
    expect(mockSetSections).toHaveBeenCalled();
    // Logic: moving index 1 to 2. ['section1', 'section3', 'section2']
    const expected = ['section1', 'section3', 'section2'];
    expect(mockSetSections).toHaveBeenCalledWith(expected);
  });

  it('handles delete', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={sections}
        setSections={mockSetSections}
      />
    );

    fireEvent.click(screen.getByLabelText('Delete section'));
    expect(mockSetSections).toHaveBeenCalled();
    // Logic: removing index 1. ['section1', 'section3']
    const expected = ['section1', 'section3'];
    expect(mockSetSections).toHaveBeenCalledWith(expected);
  });

  it('disables move up at index 0', () => {
    render(
      <SectionControls
        sectionIndex={0}
        sections={sections}
        setSections={mockSetSections}
      />
    );
    expect(screen.getByLabelText('Move section up')).toBeDisabled();
  });

  it('disables move down at last index', () => {
    render(
      <SectionControls
        sectionIndex={2}
        sections={sections}
        setSections={mockSetSections}
      />
    );
    expect(screen.getByLabelText('Move section down')).toBeDisabled();
  });
});
