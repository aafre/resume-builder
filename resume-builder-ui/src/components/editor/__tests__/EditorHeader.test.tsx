// src/components/editor/__tests__/EditorHeader.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorHeader, EditorHeaderProps } from '../EditorHeader';

describe('EditorHeader', () => {
  const defaultProps: EditorHeaderProps = {
    showIdleTooltip: false,
    onDismissIdleTooltip: vi.fn(),
    isAuthenticated: true,
    contactInfo: null,
    sections: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Create portal target for job badge
    const slot = document.createElement('div');
    slot.id = 'header-job-badge-slot';
    document.body.appendChild(slot);
  });

  afterEach(() => {
    const slot = document.getElementById('header-job-badge-slot');
    if (slot) slot.remove();
  });

  describe('Idle Tooltip', () => {
    it('should not render idle tooltip when showIdleTooltip is false', () => {
      render(<EditorHeader {...defaultProps} showIdleTooltip={false} />);

      expect(
        screen.queryByText("Don't forget to save your progress permanently")
      ).not.toBeInTheDocument();
    });

    it('should render idle tooltip when showIdleTooltip is true', () => {
      render(<EditorHeader {...defaultProps} showIdleTooltip={true} />);

      expect(
        screen.getByText("Don't forget to save your progress permanently")
      ).toBeInTheDocument();
    });

    it('should call onDismissIdleTooltip when dismiss button is clicked', () => {
      const onDismiss = vi.fn();
      render(
        <EditorHeader
          {...defaultProps}
          showIdleTooltip={true}
          onDismissIdleTooltip={onDismiss}
        />
      );

      const dismissButton = screen.getByLabelText('Dismiss reminder');
      fireEvent.click(dismissButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should have proper accessibility attributes on tooltip', () => {
      render(<EditorHeader {...defaultProps} showIdleTooltip={true} />);

      const tooltip = screen.getByRole('alert');
      expect(tooltip).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Combined states', () => {
    it('should show idle tooltip for unauthenticated users', () => {
      render(
        <EditorHeader
          {...defaultProps}
          showIdleTooltip={true}
          isAuthenticated={false}
        />
      );

      expect(
        screen.getByText("Don't forget to save your progress permanently")
      ).toBeInTheDocument();
    });
  });
});
