import { render, screen, fireEvent } from '@testing-library/react';
import SectionControls from '../components/SectionControls';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('SectionControls', () => {
  const mockSetSections = vi.fn();
  const mockSections = [
    { id: 1, name: 'Section 1' },
    { id: 2, name: 'Section 2' },
    { id: 3, name: 'Section 3' },
  ];

  it('renders control buttons with accessible labels', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );

    expect(screen.getByLabelText('Move section up')).toBeInTheDocument();
    expect(screen.getByLabelText('Move section down')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete section')).toBeInTheDocument();
  });

  it('calls setSections when move up is clicked', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );
    fireEvent.click(screen.getByLabelText('Move section up'));
    expect(mockSetSections).toHaveBeenCalled();
  });

  it('calls setSections when move down is clicked', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );
    fireEvent.click(screen.getByLabelText('Move section down'));
    expect(mockSetSections).toHaveBeenCalled();
  });

  it('calls setSections when delete is clicked', () => {
    render(
      <SectionControls
        sectionIndex={1}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );
    fireEvent.click(screen.getByLabelText('Delete section'));
    expect(mockSetSections).toHaveBeenCalled();
  });

  it('disables move up button for first section', () => {
    render(
      <SectionControls
        sectionIndex={0}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );
    expect(screen.getByLabelText('Move section up')).toBeDisabled();
  });

  it('disables move down button for last section', () => {
    render(
      <SectionControls
        sectionIndex={2}
        sections={mockSections}
        setSections={mockSetSections}
      />
    );
    expect(screen.getByLabelText('Move section down')).toBeDisabled();
  });
});
