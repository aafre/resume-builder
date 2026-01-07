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
    isAnonymous: false,
    isAuthenticated: true,
    onSignInClick: vi.fn(),
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
          isAnonymous={false}
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
          isAnonymous={false}
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
          isAnonymous={false}
          isAuthenticated={true}
          saveStatus="error"
        />
      );

      expect(screen.getByText('Save failed')).toBeInTheDocument();
    });

    it('should not show save status for anonymous users', () => {
      render(
        <EditorHeader
          {...defaultProps}
          isAnonymous={true}
          isAuthenticated={false}
          saveStatus="saved"
        />
      );

      expect(screen.queryByText(/Saved/)).not.toBeInTheDocument();
    });
  });

  describe('Sign-in CTA', () => {
    it('should show sign-in button for anonymous users', () => {
      render(
        <EditorHeader
          {...defaultProps}
          isAnonymous={true}
          isAuthenticated={false}
        />
      );

      expect(screen.getByText('Sign in to save')).toBeInTheDocument();
    });

    it('should not show sign-in button for authenticated users', () => {
      render(
        <EditorHeader
          {...defaultProps}
          isAnonymous={false}
          isAuthenticated={true}
        />
      );

      expect(screen.queryByText('Sign in to save')).not.toBeInTheDocument();
    });

    it('should call onSignInClick when sign-in button is clicked', () => {
      const onSignIn = vi.fn();
      render(
        <EditorHeader
          {...defaultProps}
          isAnonymous={true}
          isAuthenticated={false}
          onSignInClick={onSignIn}
        />
      );

      const signInButton = screen.getByText('Sign in to save');
      fireEvent.click(signInButton);

      expect(onSignIn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Combined states', () => {
    it('should show both idle tooltip and sign-in CTA for anonymous users', () => {
      render(
        <EditorHeader
          {...defaultProps}
          showIdleTooltip={true}
          isAnonymous={true}
          isAuthenticated={false}
        />
      );

      expect(
        screen.getByText("Don't forget to save your progress permanently")
      ).toBeInTheDocument();
      expect(screen.getByText('Sign in to save')).toBeInTheDocument();
    });

    it('should show both idle tooltip and save status for authenticated users', () => {
      render(
        <EditorHeader
          {...defaultProps}
          showIdleTooltip={true}
          isAnonymous={false}
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
