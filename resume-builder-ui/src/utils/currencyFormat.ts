// src/utils/currencyFormat.ts
// Currency formatting for Adzuna job salaries by country code

const CURRENCY_SYMBOLS: Record<string, string> = {
  us: '$',
  gb: '£',
  ca: 'C$',
  au: 'A$',
  in: '₹',
  de: '€',
  fr: '€',
  nl: '€',
  it: '€',
  es: '€',
  at: '€',
  be: '€',
  br: 'R$',
  mx: 'MX$',
  pl: 'zł',
  nz: 'NZ$',
  sg: 'S$',
  za: 'R',
  ch: 'CHF ',
};

function getCurrencySymbol(country: string): string {
  return CURRENCY_SYMBOLS[country] || '$';
}

export function formatSalary(
  min: number | null,
  max: number | null,
  country = 'us',
): string | null {
  if (!min && !max) return null;
  const sym = getCurrencySymbol(country);
  const fmt = (n: number) =>
    n >= 1000 ? `${sym}${Math.round(n / 1000)}K` : `${sym}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}
