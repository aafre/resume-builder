// src/components/JobsPage.tsx
// Full-page job search experience

import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Briefcase, MapPin, Search, ExternalLink, ChevronDown } from 'lucide-react';
import { searchJobs, AdzunaJob } from '../services/jobs';
import { normalizeJobTitle } from '../utils/jobTitleNormalizer';
import { detectCountryCode, sanitizeLocationForSearch } from '../utils/countryDetector';

const ADZUNA_COUNTRIES: { code: string; label: string }[] = [
  { code: 'us', label: 'United States' },
  { code: 'gb', label: 'United Kingdom' },
  { code: 'ca', label: 'Canada' },
  { code: 'au', label: 'Australia' },
  { code: 'in', label: 'India' },
  { code: 'de', label: 'Germany' },
  { code: 'fr', label: 'France' },
  { code: 'nl', label: 'Netherlands' },
  { code: 'it', label: 'Italy' },
  { code: 'es', label: 'Spain' },
  { code: 'br', label: 'Brazil' },
  { code: 'mx', label: 'Mexico' },
  { code: 'pl', label: 'Poland' },
  { code: 'nz', label: 'New Zealand' },
  { code: 'sg', label: 'Singapore' },
  { code: 'za', label: 'South Africa' },
  { code: 'at', label: 'Austria' },
  { code: 'be', label: 'Belgium' },
  { code: 'ch', label: 'Switzerland' },
];

const formatSalary = (min: number | null, max: number | null): string | null => {
  if (!min && !max) return null;
  const fmt = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
};

export default function JobsPage() {
  const [titleInput, setTitleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [country, setCountry] = useState('us');
  const [jobs, setJobs] = useState<AdzunaJob[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const shouldAutoSearch = useRef(false);

  // Try to pre-fill from sessionStorage (set by editor badge click)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('jobSearchPrefill');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.title) setTitleInput(data.title);
        if (data.location) setLocationInput(data.location);
        if (data.country) setCountry(data.country);
        sessionStorage.removeItem('jobSearchPrefill');
        if (data.title) shouldAutoSearch.current = true;
      }
    } catch { /* ignore */ }
  }, []);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!titleInput.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const { query, category } = normalizeJobTitle(titleInput.trim());
      const searchLocation = sanitizeLocationForSearch(locationInput.trim());
      const searchCountry = locationInput.trim()
        ? detectCountryCode(locationInput.trim())
        : country;

      const result = await searchJobs(
        query || titleInput.trim(),
        searchLocation,
        searchCountry,
        category,
      );
      setJobs(result.jobs);
      setTotalCount(result.count);
    } catch {
      setError('Unable to fetch jobs. Please try again.');
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [titleInput, locationInput, country]);

  // Auto-search when pre-filled from editor
  useEffect(() => {
    if (shouldAutoSearch.current && titleInput) {
      shouldAutoSearch.current = false;
      handleSearch();
    }
  }, [titleInput, handleSearch]);

  return (
    <>
      <Helmet>
        <title>Job Search | EasyFreeResume</title>
        <meta name="description" content="Search for jobs that match your resume. Find open positions near you with salary information." />
      </Helmet>

      <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            <span>Job Search</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Find Jobs That Match Your Resume
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Search thousands of open positions. Get salary info and apply directly.
          </p>
        </div>

        {/* Search Form */}
        <form
          ref={formRef}
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Job Title */}
            <div className="flex-1 relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Job title (e.g. Software Engineer)"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="City or region (optional)"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Country */}
            <div className="relative sm:w-44">
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {ADZUNA_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading || !titleInput.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Results Count */}
        {hasSearched && !loading && !error && (
          <p className="text-sm text-gray-500 mb-4">
            {totalCount > 0
              ? `Found ${totalCount.toLocaleString()} matching jobs`
              : 'No jobs found. Try different keywords or location.'}
          </p>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && jobs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, i) => {
              const salary = formatSalary(job.salary_min, job.salary_max);
              return (
                <a
                  key={i}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={() => console.log('[affiliate] click: job-search', { title: job.title, company: job.company })}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    {[job.company, job.location].filter(Boolean).join(' · ')}
                  </p>
                  {salary && (
                    <p className="text-xs font-medium text-emerald-600 mt-auto pt-1">
                      {salary}
                    </p>
                  )}
                </a>
              );
            })}
          </div>
        )}

        {/* Empty State (before searching) */}
        {!hasSearched && !loading && (
          <div className="text-center py-12 text-gray-400">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium text-gray-500">Enter a job title to search</p>
            <p className="text-sm">We'll find relevant openings from thousands of employers</p>
          </div>
        )}

        {/* Powered by */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            Job listings powered by Adzuna
          </p>
        </div>
      </div>
    </>
  );
}
