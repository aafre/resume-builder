import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollReveal } from '../useScrollReveal';

// Mock IntersectionObserver
let observerCallback: IntersectionObserverCallback;
let observerOptions: IntersectionObserverInit | undefined;
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    observerCallback = callback;
    observerOptions = options;
  }
  observe = mockObserve;
  unobserve = mockUnobserve;
  disconnect = mockDisconnect;
}

// Mock matchMedia
const mockMatchMedia = vi.fn();

describe('useScrollReveal', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    mockMatchMedia.mockReturnValue({ matches: false });
    vi.stubGlobal('matchMedia', mockMatchMedia);
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a ref object', () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull();
  });

  it('creates IntersectionObserver with default options', () => {
    const div = document.createElement('div');
    const { result } = renderHook(() => useScrollReveal());

    // Manually assign the ref since we can't use JSX in a .ts test
    Object.defineProperty(result.current, 'current', {
      value: div,
      writable: true,
    });

    // Re-render to trigger the effect with the ref set
    const { unmount } = renderHook(() => {
      const ref = useScrollReveal();
      Object.defineProperty(ref, 'current', { value: div, writable: true });
      return ref;
    });

    expect(observerOptions?.threshold).toBe(0);
    expect(observerOptions?.rootMargin).toBe('0px 0px -60px 0px');
    expect(mockObserve).toHaveBeenCalledWith(div);

    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('adds "revealed" class when element intersects', () => {
    const div = document.createElement('div');

    renderHook(() => {
      const ref = useScrollReveal();
      Object.defineProperty(ref, 'current', { value: div, writable: true });
      return ref;
    });

    // Simulate intersection
    observerCallback(
      [{ isIntersecting: true, target: div } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(div.classList.contains('revealed')).toBe(true);
  });

  it('unobserves after reveal when once=true (default)', () => {
    const div = document.createElement('div');

    renderHook(() => {
      const ref = useScrollReveal({ once: true });
      Object.defineProperty(ref, 'current', { value: div, writable: true });
      return ref;
    });

    observerCallback(
      [{ isIntersecting: true, target: div } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(mockUnobserve).toHaveBeenCalledWith(div);
  });

  it('does not unobserve when once=false', () => {
    const div = document.createElement('div');

    renderHook(() => {
      const ref = useScrollReveal({ once: false });
      Object.defineProperty(ref, 'current', { value: div, writable: true });
      return ref;
    });

    observerCallback(
      [{ isIntersecting: true, target: div } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it('instantly reveals when prefers-reduced-motion is set', () => {
    mockMatchMedia.mockReturnValue({ matches: true });

    const div = document.createElement('div');

    renderHook(() => {
      const ref = useScrollReveal();
      Object.defineProperty(ref, 'current', { value: div, writable: true });
      return ref;
    });

    expect(div.classList.contains('revealed')).toBe(true);
    // Should NOT create observer when reduced motion is preferred
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('does not add class when element is not intersecting', () => {
    const div = document.createElement('div');

    renderHook(() => {
      const ref = useScrollReveal();
      Object.defineProperty(ref, 'current', { value: div, writable: true });
      return ref;
    });

    observerCallback(
      [{ isIntersecting: false, target: div } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(div.classList.contains('revealed')).toBe(false);
  });
});
