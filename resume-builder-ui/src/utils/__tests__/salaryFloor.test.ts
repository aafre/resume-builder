import { describe, it, expect } from 'vitest';
import { getSalaryFloor } from '../salaryFloor';

describe('getSalaryFloor', () => {
  it('returns correct US entry-level floor', () => {
    expect(getSalaryFloor('us', 'entry')).toBe(35000);
  });

  it('returns correct US senior floor', () => {
    expect(getSalaryFloor('us', 'senior')).toBe(85000);
  });

  it('returns correct US executive floor', () => {
    expect(getSalaryFloor('us', 'executive')).toBe(140000);
  });

  it('returns correct GB mid floor', () => {
    expect(getSalaryFloor('gb', 'mid')).toBe(35000);
  });

  it('returns correct IN senior floor (INR)', () => {
    expect(getSalaryFloor('in', 'senior')).toBe(1500000);
  });

  it('returns correct DE lead floor', () => {
    expect(getSalaryFloor('de', 'lead')).toBe(90000);
  });

  it('returns correct CH mid floor', () => {
    expect(getSalaryFloor('ch', 'mid')).toBe(80000);
  });

  it('falls back to US floors for unknown country', () => {
    expect(getSalaryFloor('xx', 'mid')).toBe(55000);
    expect(getSalaryFloor('zz', 'entry')).toBe(35000);
  });

  it('is case-insensitive for country code', () => {
    expect(getSalaryFloor('US', 'senior')).toBe(85000);
    expect(getSalaryFloor('Gb', 'entry')).toBe(22000);
  });
});
