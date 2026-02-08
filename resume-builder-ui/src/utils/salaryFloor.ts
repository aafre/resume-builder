// src/utils/salaryFloor.ts

import type { SeniorityLevel } from './resumeDataExtractor';

/**
 * Conservative annual salary floors per country and seniority level.
 * Used to filter out unrealistically low salary listings in resume-based searches.
 * Values are in local currency (USD, GBP, INR, EUR, etc.).
 */
const SALARY_FLOORS: Record<string, Record<SeniorityLevel, number>> = {
  us: { entry: 35000, mid: 55000, senior: 85000, lead: 110000, executive: 140000 },
  gb: { entry: 22000, mid: 35000, senior: 55000, lead: 70000, executive: 90000 },
  ca: { entry: 40000, mid: 60000, senior: 90000, lead: 115000, executive: 145000 },
  au: { entry: 50000, mid: 75000, senior: 110000, lead: 140000, executive: 180000 },
  in: { entry: 300000, mid: 700000, senior: 1500000, lead: 2500000, executive: 4000000 },
  de: { entry: 30000, mid: 45000, senior: 70000, lead: 90000, executive: 120000 },
  fr: { entry: 25000, mid: 38000, senior: 58000, lead: 75000, executive: 100000 },
  nl: { entry: 28000, mid: 42000, senior: 65000, lead: 85000, executive: 110000 },
  it: { entry: 22000, mid: 32000, senior: 48000, lead: 62000, executive: 80000 },
  es: { entry: 20000, mid: 30000, senior: 45000, lead: 58000, executive: 75000 },
  br: { entry: 30000, mid: 60000, senior: 120000, lead: 180000, executive: 300000 },
  mx: { entry: 150000, mid: 300000, senior: 550000, lead: 800000, executive: 1200000 },
  pl: { entry: 50000, mid: 90000, senior: 160000, lead: 220000, executive: 320000 },
  nz: { entry: 45000, mid: 65000, senior: 100000, lead: 130000, executive: 165000 },
  sg: { entry: 36000, mid: 55000, senior: 90000, lead: 120000, executive: 160000 },
  za: { entry: 180000, mid: 350000, senior: 600000, lead: 850000, executive: 1200000 },
  at: { entry: 28000, mid: 42000, senior: 65000, lead: 85000, executive: 110000 },
  be: { entry: 28000, mid: 42000, senior: 65000, lead: 85000, executive: 110000 },
  ch: { entry: 55000, mid: 80000, senior: 120000, lead: 150000, executive: 200000 },
};

// Fallback uses US floors as a reasonable default
const FALLBACK = SALARY_FLOORS.us;

/**
 * Returns the minimum annual salary floor for a given country and seniority level.
 * Falls back to US floors for unknown countries.
 */
export function getSalaryFloor(country: string, seniority: SeniorityLevel): number {
  const floors = SALARY_FLOORS[country.toLowerCase()] || FALLBACK;
  return floors[seniority];
}
