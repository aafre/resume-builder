import { describe, it, expect } from 'vitest';
import { detectCountryCode, sanitizeLocationForSearch } from '../countryDetector';

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

  it('returns "gb" for "Brighton, BN1 9JA" (UK postcode)', () => {
    expect(detectCountryCode('Brighton, BN1 9JA')).toBe('gb');
  });

  it('returns "gb" for "London, SW1A 1AA" (UK postcode)', () => {
    expect(detectCountryCode('London, SW1A 1AA')).toBe('gb');
  });

  it('returns "gb" for "Leeds" (city detection)', () => {
    expect(detectCountryCode('Leeds')).toBe('gb');
  });

  it('returns "gb" for "EC2R 8AH" (postcode only)', () => {
    expect(detectCountryCode('EC2R 8AH')).toBe('gb');
  });
});

describe('sanitizeLocationForSearch', () => {
  it('strips ", UK" from "London, UK"', () => {
    expect(sanitizeLocationForSearch('London, UK')).toBe('London');
  });

  it('strips ", USA" from "New York, NY, USA"', () => {
    expect(sanitizeLocationForSearch('New York, NY, USA')).toBe('New York, NY');
  });

  it('strips ", India" from "Mumbai, India"', () => {
    expect(sanitizeLocationForSearch('Mumbai, India')).toBe('Mumbai');
  });

  it('strips ", United Kingdom" from location', () => {
    expect(sanitizeLocationForSearch('Manchester, United Kingdom')).toBe('Manchester');
  });

  it('preserves location with no country suffix', () => {
    expect(sanitizeLocationForSearch('Brighton, BN1 9JA')).toBe('Brighton, BN1 9JA');
  });

  it('preserves "San Francisco, CA" (state, not country)', () => {
    expect(sanitizeLocationForSearch('San Francisco, CA')).toBe('San Francisco, CA');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeLocationForSearch('')).toBe('');
  });
});
