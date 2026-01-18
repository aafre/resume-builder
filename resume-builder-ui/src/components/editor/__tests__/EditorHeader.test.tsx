// src/components/editor/__tests__/EditorHeader.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorHeader, EditorHeaderProps } from '../EditorHeader';

describe('EditorHeader', () => {
  const defaultProps: EditorHeaderProps = {
    showIdleTooltip: false,
    onDismissIdleTooltip: vi.fn(),
    saveStatus: 'saved',
    lastSaved: new Date(),
    isAuthenticated: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
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

  describe('Save Status Indicator', () => {
    it('should show save status for authenticated users', () => {
      render(
        <EditorHeader
          {...defaultProps}
          isAuthenticated={true}
          saveStatus="saved"
        />
      );

      // SaveStatusIndicator shows "Saved" text
      expect(screen.getByText(/Saved/)).toBeInTheDocument();
    });

    it('should show saving status', () => {
      render(
        <EditorHeader
          {...defaultProps}
          isAuthenticated={true}
          saveStatus="saving"
        />
      );

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('should show error status', () => {
      render(
        <EditorHeader
          {...defaultProps}
          isAuthenticated={true}
          saveStatus="error"
        />
      );

      expect(screen.getByText('Save failed')).toBeInTheDocument();
    });

    it('should not show save status for unauthenticated users', () => {
      render(
        <EditorHeader
          {...defaultProps}
          isAuthenticated={false}
          saveStatus="saved"
        />
      );

      expect(screen.queryByText(/Saved/)).not.toBeInTheDocument();
    });

    it('should not show save status when status is idle', () => {
      render(
        <EditorHeader
          {...defaultProps}
          isAuthenticated={true}
          saveStatus="idle"
        />
      );

      expect(screen.queryByText(/Saved/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Saving/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Save failed/)).not.toBeInTheDocument();
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

    it('should show both idle tooltip and save status for authenticated users', () => {
      render(
        <EditorHeader
          {...defaultProps}
          showIdleTooltip={true}
          isAuthenticated={true}
          saveStatus="saved"
        />
      );

      expect(
        screen.getByText("Don't forget to save your progress permanently")
      ).toBeInTheDocument();
      expect(screen.getByText(/Saved/)).toBeInTheDocument();
    });
  });
});
