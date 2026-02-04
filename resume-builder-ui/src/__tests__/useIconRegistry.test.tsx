import { renderHook } from '@testing-library/react';
import { useIconRegistry } from '../hooks/useIconRegistry';
import { describe, it, expect } from 'vitest';

describe('useIconRegistry Performance', () => {
  it('should return a stable object reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useIconRegistry());

    const firstResult = result.current;

    // Force a re-render
    rerender();

    const secondResult = result.current;

    // Check if the object reference is the same
    // This expects strict equality (referential equality)
    expect(secondResult).toBe(firstResult);
  });
});
