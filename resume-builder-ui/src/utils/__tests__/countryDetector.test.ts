import { describe, it, expect } from 'vitest';
import { detectCountryCode } from '../countryDetector';

describe('detectCountryCode', () => {
  it('returns "us" for "New York, NY"', () => {
    expect(detectCountryCode('New York, NY')).toBe('us');
  });

  it('returns "gb" for "London, UK"', () => {
    expect(detectCountryCode('London, UK')).toBe('gb');
  });

  it('returns "in" for "Mumbai, India"', () => {
    expect(detectCountryCode('Mumbai, India')).toBe('in');
  });

  it('returns "ca" for "Toronto, ON, Canada"', () => {
    expect(detectCountryCode('Toronto, ON, Canada')).toBe('ca');
  });

  it('returns "au" for "Sydney, Australia"', () => {
    expect(detectCountryCode('Sydney, Australia')).toBe('au');
  });

  it('returns "de" for "Berlin, Germany"', () => {
    expect(detectCountryCode('Berlin, Germany')).toBe('de');
  });

  it('returns "fr" for "Paris"', () => {
    expect(detectCountryCode('Paris')).toBe('fr');
  });

  it('returns "us" for empty string', () => {
    expect(detectCountryCode('')).toBe('us');
  });

  it('returns "us" for "Some Unknown Place"', () => {
    expect(detectCountryCode('Some Unknown Place')).toBe('us');
  });

  it('returns "us" for US state abbreviation "San Francisco, CA"', () => {
    expect(detectCountryCode('San Francisco, CA')).toBe('us');
  });

  it('returns "gb" for "London" (city detection)', () => {
    expect(detectCountryCode('London')).toBe('gb');
  });

  it('returns "nl" for "Amsterdam"', () => {
    expect(detectCountryCode('Amsterdam')).toBe('nl');
  });

  it('returns "us" for "USA"', () => {
    expect(detectCountryCode('USA')).toBe('us');
  });

  it('returns "gb" for "United Kingdom"', () => {
    expect(detectCountryCode('United Kingdom')).toBe('gb');
  });

  it('returns "in" for "Bangalore, India"', () => {
    expect(detectCountryCode('Bangalore, India')).toBe('in');
  });
});
