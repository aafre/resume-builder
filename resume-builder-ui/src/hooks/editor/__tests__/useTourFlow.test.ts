// src/hooks/editor/__tests__/useTourFlow.test.ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTourFlow, UseTourFlowProps } from '../useTourFlow';
import { Session } from '@supabase/supabase-js';

// Mock setTimeout and clearTimeout for timer tests
vi.useFakeTimers();

/**
 * Helper to create mock props with defaults
 */
const createMockProps = (overrides?: Partial<UseTourFlowProps>): UseTourFlowProps => ({
  session: { user: { id: 'test-user' } } as Session,
  isAnonymous: false,
  anonMigrationInProgress: false,
  authLoading: false,
  tourCompleted: false,
  prefsLoading: false,
  setPreference: vi.fn(),
  hasShownIdleNudge: false,
  markIdleNudgeShown: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('useTourFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  // ==================== INITIALIZATION ====================

  describe('Initialization', () => {
    it('should initialize with correct default state', () => {
      const props = createMockProps();
      const { result } = renderHook(() => useTourFlow(props));

      expect(result.current.showWelcomeTour).toBe(false);
      expect(result.current.showIdleTooltip).toBe(false);
      expect(result.current.isSigningInFromTour).toBe(false);
    });

    it('should return all required methods', () => {
      const props = createMockProps();
      const { result } = renderHook(() => useTourFlow(props));

      expect(typeof result.current.setShowWelcomeTour).toBe('function');
      expect(typeof result.current.handleTourComplete).toBe('function');
      expect(typeof result.current.dismissIdleTooltip).toBe('function');
      expect(typeof result.current.handleSignInFromTour).toBe('function');
      expect(typeof result.current.handleSignInSuccess).toBe('function');
    });
  });

  // ==================== INITIAL TOUR LAUNCH ====================

  describe('Initial Tour Launch', () => {
    it('should show tour after 1.5s delay for new users', () => {
      const props = createMockProps({
        tourCompleted: false,
        prefsLoading: false,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Initially hidden
      expect(result.current.showWelcomeTour).toBe(false);

      // Fast-forward time by 1.5s
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Should now be visible
      expect(result.current.showWelcomeTour).toBe(true);
    });

    it('should not show tour if already completed', () => {
      const props = createMockProps({
        tourCompleted: true,
        prefsLoading: false,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Tour should remain hidden
      expect(result.current.showWelcomeTour).toBe(false);
    });

    it('should not show tour if preferences are still loading', () => {
      const props = createMockProps({
        tourCompleted: false,
        prefsLoading: true,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Tour should remain hidden
      expect(result.current.showWelcomeTour).toBe(false);
    });

    it('should cancel timer on unmount', () => {
      const props = createMockProps({
        tourCompleted: false,
        prefsLoading: false,
      });

      const { unmount } = renderHook(() => useTourFlow(props));

      // Spy on clearTimeout
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      unmount();

      // clearTimeout should be called
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  // ==================== TOUR RE-LAUNCH AFTER SIGN-IN ====================

  describe('Tour Re-launch After Sign-in', () => {
    it('should re-launch tour after migration completes', () => {
      // Start with anonymous user (tour will show after 1.5s)
      const baseProps = createMockProps({
        tourCompleted: false,
        isAnonymous: true,
        session: null,
        anonMigrationInProgress: false,
        authLoading: false,
        prefsLoading: false,
      });

      const { result, rerender } = renderHook(
        (props) => useTourFlow(props),
        { initialProps: baseProps }
      );

      // Fast-forward to show initial tour
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      expect(result.current.showWelcomeTour).toBe(true);

      // User clicks "Sign In" from tour - close tour and set flag
      act(() => {
        result.current.setShowWelcomeTour(false); // Tour closes
        result.current.handleSignInFromTour(); // Set internal refs
      });
      expect(result.current.showWelcomeTour).toBe(false);

      // Simulate OAuth redirect - migration in progress
      const migrationProps = createMockProps({
        tourCompleted: false,
        isAnonymous: false,
        session: { user: { id: 'test-user' } } as Session,
        anonMigrationInProgress: true, // Migration in progress
        authLoading: false,
        prefsLoading: false,
      });
      rerender(migrationProps);

      // Now simulate migration completing
      const completedProps = createMockProps({
        tourCompleted: false,
        isAnonymous: false,
        session: { user: { id: 'test-user' } } as Session,
        anonMigrationInProgress: false, // Migration complete
        authLoading: false,
        prefsLoading: false,
      });
      rerender(completedProps);

      // Fast-forward the 150ms delay for re-launch
      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Tour should now be re-launched
      expect(result.current.showWelcomeTour).toBe(true);

      // Flags should be reset
      expect(result.current.isSigningInFromTour).toBe(false);
    });

    it('should not re-launch tour if already completed', () => {
      const props = createMockProps({
        tourCompleted: true,
        isAnonymous: false,
        session: { user: { id: 'test-user' } } as Session,
        anonMigrationInProgress: false,
        authLoading: false,
        prefsLoading: false,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Simulate sign-in from tour
      act(() => {
        result.current.handleSignInFromTour();
      });

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Tour should not show (completed)
      expect(result.current.showWelcomeTour).toBe(false);
    });

    it('should not re-launch if migration still in progress', () => {
      const props = createMockProps({
        tourCompleted: true, // Set to true to prevent initial tour launch
        isAnonymous: false,
        session: { user: { id: 'test-user' } } as Session,
        anonMigrationInProgress: true, // Migration in progress
        authLoading: false,
        prefsLoading: false,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Simulate sign-in from tour
      act(() => {
        result.current.handleSignInFromTour();
      });

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Tour should not show (migration not complete)
      expect(result.current.showWelcomeTour).toBe(false);
    });

    it('should not re-launch if user is still anonymous', () => {
      const props = createMockProps({
        tourCompleted: true, // Set to true to prevent initial tour launch
        isAnonymous: true, // Still anonymous
        session: null,
        anonMigrationInProgress: false,
        authLoading: false,
        prefsLoading: false,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Simulate sign-in from tour
      act(() => {
        result.current.handleSignInFromTour();
      });

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Tour should not show (still anonymous)
      expect(result.current.showWelcomeTour).toBe(false);
    });

    it('should re-launch tour after migration completes', () => {
      // Start with anonymous user
      const baseProps = createMockProps({
        tourCompleted: false,
        isAnonymous: true,
        session: null,
        anonMigrationInProgress: false,
        authLoading: false,
        prefsLoading: false,
      });

      const { result, rerender } = renderHook(
        (props) => useTourFlow(props),
        { initialProps: baseProps }
      );

      // Fast-forward to show initial tour
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // User signs in from tour
      act(() => {
        result.current.setShowWelcomeTour(false);
        result.current.handleSignInFromTour();
      });

      // Migration in progress
      const migrationProps = createMockProps({
        tourCompleted: false,
        isAnonymous: false,
        session: { user: { id: 'test-user' } } as Session,
        anonMigrationInProgress: true,
        authLoading: false,
        prefsLoading: false,
      });
      rerender(migrationProps);

      // Migration completes
      const completedProps = createMockProps({
        tourCompleted: false,
        isAnonymous: false,
        session: { user: { id: 'test-user' } } as Session,
        anonMigrationInProgress: false,
        authLoading: false,
        prefsLoading: false,
      });
      rerender(completedProps);

      // Advance re-launch delay
      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Tour should be re-launched after migration
      expect(result.current.showWelcomeTour).toBe(true);
    });
  });

  // ==================== IDLE NUDGE ====================

  describe('Idle Nudge', () => {
    it('should show idle tooltip after 5 minutes for anonymous users', () => {
      const mockMarkIdleNudgeShown = vi.fn().mockResolvedValue(undefined);
      const props = createMockProps({
        isAnonymous: true,
        hasShownIdleNudge: false,
        authLoading: false,
        markIdleNudgeShown: mockMarkIdleNudgeShown,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Initially hidden
      expect(result.current.showIdleTooltip).toBe(false);

      // Fast-forward 5 minutes
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
      });

      // Tooltip should be visible
      expect(result.current.showIdleTooltip).toBe(true);

      // Should mark as shown
      expect(mockMarkIdleNudgeShown).toHaveBeenCalledOnce();
    });

    it('should auto-dismiss idle tooltip after 10 seconds', () => {
      const props = createMockProps({
        isAnonymous: true,
        hasShownIdleNudge: false,
        authLoading: false,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Fast-forward 5 minutes to show tooltip
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
      });

      // Tooltip should be visible
      expect(result.current.showIdleTooltip).toBe(true);

      // Fast-forward 10 seconds
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Tooltip should be hidden
      expect(result.current.showIdleTooltip).toBe(false);
    });

    it('should not show idle tooltip if already shown', () => {
      const props = createMockProps({
        isAnonymous: true,
        hasShownIdleNudge: true, // Already shown
        authLoading: false,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Fast-forward 5 minutes
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
      });

      // Tooltip should not show
      expect(result.current.showIdleTooltip).toBe(false);
    });

    it('should not show idle tooltip if user is authenticated', () => {
      const props = createMockProps({
        isAnonymous: false, // Authenticated
        hasShownIdleNudge: false,
        authLoading: false,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Fast-forward 5 minutes
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
      });

      // Tooltip should not show
      expect(result.current.showIdleTooltip).toBe(false);
    });

    it('should not show idle tooltip if auth is still loading', () => {
      const props = createMockProps({
        isAnonymous: true,
        hasShownIdleNudge: false,
        authLoading: true, // Still loading
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Fast-forward 5 minutes
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
      });

      // Tooltip should not show
      expect(result.current.showIdleTooltip).toBe(false);
    });

    it('should clean up timer on unmount', () => {
      const props = createMockProps({
        isAnonymous: true,
        hasShownIdleNudge: false,
        authLoading: false,
      });

      const { unmount } = renderHook(() => useTourFlow(props));

      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      unmount();

      // clearTimeout should be called
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  // ==================== HANDLERS ====================

  describe('Handler Methods', () => {
    it('handleTourComplete should close tour and mark as complete', async () => {
      const mockSetPreference = vi.fn();
      const props = createMockProps({
        setPreference: mockSetPreference,
        tourCompleted: false,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Show tour first
      act(() => {
        result.current.setShowWelcomeTour(true);
      });
      expect(result.current.showWelcomeTour).toBe(true);

      // Complete tour
      await act(async () => {
        await result.current.handleTourComplete();
      });

      // Tour should be hidden
      expect(result.current.showWelcomeTour).toBe(false);

      // Should persist completion
      expect(mockSetPreference).toHaveBeenCalledWith('tour_completed', true);
    });

    it('dismissIdleTooltip should hide the tooltip', () => {
      const props = createMockProps({
        isAnonymous: true,
        hasShownIdleNudge: false,
        authLoading: false,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Fast-forward to show tooltip
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
      });

      // Tooltip should be visible
      expect(result.current.showIdleTooltip).toBe(true);

      // Dismiss tooltip
      act(() => {
        result.current.dismissIdleTooltip();
      });

      // Tooltip should be hidden
      expect(result.current.showIdleTooltip).toBe(false);
    });

    it('handleSignInFromTour should set flags correctly', () => {
      const props = createMockProps();
      const { result } = renderHook(() => useTourFlow(props));

      expect(result.current.isSigningInFromTour).toBe(false);

      act(() => {
        result.current.handleSignInFromTour();
      });

      expect(result.current.isSigningInFromTour).toBe(true);
    });

    it('handleSignInSuccess should not throw errors', () => {
      const props = createMockProps();
      const { result } = renderHook(() => useTourFlow(props));

      expect(() => {
        act(() => {
          result.current.handleSignInSuccess();
        });
      }).not.toThrow();
    });

    it('setShowWelcomeTour should update state', () => {
      const props = createMockProps();
      const { result } = renderHook(() => useTourFlow(props));

      expect(result.current.showWelcomeTour).toBe(false);

      act(() => {
        result.current.setShowWelcomeTour(true);
      });

      expect(result.current.showWelcomeTour).toBe(true);

      act(() => {
        result.current.setShowWelcomeTour(false);
      });

      expect(result.current.showWelcomeTour).toBe(false);
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle rapid prop changes gracefully', () => {
      const props = createMockProps({
        tourCompleted: false,
        prefsLoading: true,
      });

      const { result, rerender } = renderHook(
        ({ tourCompleted, prefsLoading }) =>
          useTourFlow({ ...props, tourCompleted, prefsLoading }),
        { initialProps: { tourCompleted: false, prefsLoading: true } }
      );

      // Change props multiple times
      rerender({ tourCompleted: false, prefsLoading: false });
      rerender({ tourCompleted: true, prefsLoading: false });
      rerender({ tourCompleted: false, prefsLoading: false });

      // Should not crash
      expect(result.current).toBeDefined();
    });

    it('should handle missing session gracefully', () => {
      const props = createMockProps({
        session: null,
        isAnonymous: true,
      });

      const { result } = renderHook(() => useTourFlow(props));

      // Should not crash
      expect(result.current).toBeDefined();
    });

    it('should handle multiple timer cleanup calls', () => {
      const props = createMockProps({
        tourCompleted: false,
        prefsLoading: false,
        isAnonymous: true,
        hasShownIdleNudge: false,
        authLoading: false,
      });

      const { unmount, rerender } = renderHook(() => useTourFlow(props));

      // Trigger both timers
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      rerender();
      unmount();

      // Should not crash
      expect(true).toBe(true);
    });
  });
});
