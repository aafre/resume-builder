import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Odometer } from '../Odometer';

describe('Odometer tick', () => {
  it('remounts and rolls only the changed digits', () => {
    const { container, rerender } = render(<Odometer value="150,519+" />);
    const before = [...container.querySelectorAll('.odo-d')];
    rerender(<Odometer value="150,520+" from="150,519+" />);
    const after = [...container.querySelectorAll('.odo-d')] as HTMLElement[];
    before.slice(0, 4).forEach((n, i) => expect(after[i]).toBe(n));
    expect(after[4]).not.toBe(before[4]);
    expect(after[5]).not.toBe(before[5]);
    expect(after[4].style.getPropertyValue('--p')).toBe('1');
    expect(after[5].style.getPropertyValue('--p')).toBe('9');
    expect(after[5].style.getPropertyValue('--t')).toBe('1');
  });
});
