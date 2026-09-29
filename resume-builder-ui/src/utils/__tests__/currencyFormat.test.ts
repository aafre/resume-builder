import { describe, it, expect } from 'vitest';
import { formatSalary } from '../currencyFormat';

describe('formatSalary', () => {
  it('shows one figure when min and max round to the same value', () => {
    expect(formatSalary(33000, 33000, 'gb')).toBe('£33K');
    expect(formatSalary(31000, 34000, 'gb')).toBe('£31K – £34K');
  });
});
