import { describe, it, expect } from 'vitest';
import { formatSalary } from '../currencyFormat';

describe('formatSalary', () => {
  describe('null handling', () => {
    it('returns null when both min and max are null', () => {
      expect(formatSalary(null, null)).toBeNull();
      expect(formatSalary(null, null, 'in')).toBeNull();
    });
  });

  describe('USD (default)', () => {
    it('formats min–max range', () => {
      expect(formatSalary(80000, 120000, 'us')).toBe('$80K – $120K');
    });

    it('formats min-only', () => {
      expect(formatSalary(50000, null, 'us')).toBe('From $50K');
    });

    it('formats max-only', () => {
      expect(formatSalary(null, 100000, 'us')).toBe('Up to $100K');
    });

    it('defaults to USD when no country provided', () => {
      expect(formatSalary(60000, 90000)).toBe('$60K – $90K');
    });
  });

  describe('GBP', () => {
    it('formats GBP range', () => {
      expect(formatSalary(50000, 100000, 'gb')).toBe('£50K – £100K');
    });
  });

  describe('INR — Lakh/Crore notation', () => {
    it('formats Lakh range', () => {
      expect(formatSalary(300000, 1500000, 'in')).toBe('₹3L – ₹15L');
    });

    it('formats large Lakh values', () => {
      expect(formatSalary(5000000, 8000000, 'in')).toBe('₹50L – ₹80L');
    });

    it('formats Crore values', () => {
      expect(formatSalary(15000000, null, 'in')).toBe('From ₹1.5Cr');
    });

    it('formats whole Crore values without decimal', () => {
      expect(formatSalary(10000000, 20000000, 'in')).toBe('₹1Cr – ₹2Cr');
    });

    it('formats small INR values in K', () => {
      expect(formatSalary(50000, null, 'in')).toBe('From ₹50K');
    });

    it('formats fractional Lakh values', () => {
      expect(formatSalary(350000, null, 'in')).toBe('From ₹3.5L');
    });

    it('formats max-only in Lakhs', () => {
      expect(formatSalary(null, 2000000, 'in')).toBe('Up to ₹20L');
    });
  });

  describe('EUR', () => {
    it('formats EUR range for Germany', () => {
      expect(formatSalary(40000, 70000, 'de')).toBe('€40K – €70K');
    });
  });
});
