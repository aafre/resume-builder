// src/components/JobsPage.tsx
// Full-page job search experience with SEO infrastructure

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Briefcase, MapPin, Search, ExternalLink, ChevronDown, Clock, FileText, BookOpen, Target, Upload, Sparkles, Info } from 'lucide-react';
import { searchJobs, suggestRoles, AdzunaJob } from '../services/jobs';
import type { RoleSuggestion } from '../services/jobs';
import { normalizeJobTitle } from '../utils/jobTitleNormalizer';
import { detectCountryCode, sanitizeLocationForSearch } from '../utils/countryDetector';
import { formatSalary } from '../utils/currencyFormat';
import { getSalaryFloor } from '../utils/salaryFloor';
import { extractSearchParamsFromYAML } from '../utils/resumeDataExtractor';
import type { SeniorityLevel } from '../utils/resumeDataExtractor';
import { useResumeParser } from '../hooks/useResumeParser';
import { useAuth } from '../contexts/AuthContext';
import yaml from 'js-yaml';
import { isExperienceSection } from '../utils/sectionTypeChecker';
import { SEO_PAGES } from '../config/seoPages';
import { usePageSchema } from '../hooks/usePageSchema';
import SEOPageLayout from './shared/SEOPageLayout';
import BreadcrumbsWithSchema from './shared/BreadcrumbsWithSchema';
import FAQSection from './shared/FAQSection';

const jobsConfig = SEO_PAGES.jobs;

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

const POPULAR_SEARCHES = [
  'Software Engineer',
  'Project Manager',
  'Data Analyst',
  'Marketing Manager',
  'Registered Nurse',
  'Accountant',
  'Product Manager',
  'Graphic Designer',
  'Sales Representative',
  'Customer Service',
];

const timeAgo = (dateStr: string): string => {
  if (!dateStr) return '';
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  if (diffMs < 0) return '';

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 5) return `${diffWeeks} weeks ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  return `${diffMonths} months ago`;
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
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchedCountry, setSearchedCountry] = useState('us');
  const [dragActive, setDragActive] = useState(false);
  const [suggestions, setSuggestions] = useState<RoleSuggestion | null>(null);
  const [resumeParsing, setResumeParsing] = useState(false);
  const [aiTermsUsed, setAiTermsUsed] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const shouldAutoSearch = useRef(false);
  const prefillSkillsRef = useRef<string[]>([]);
  const prefillSeniorityRef = useRef<SeniorityLevel | null>(null);
  const prefillYearsExpRef = useRef<number>(0);
  // Persistent resume context — survives across manual searches
  const resumeSkillsRef = useRef<string[]>([]);
  const resumeSeniorityRef = useRef<SeniorityLevel | null>(null);
  const resumeYearsExpRef = useRef<number>(0);
  const { session } = useAuth();
  const { parseResume, parsing: parserBusy, progress: parserProgress, progressMessage } = useResumeParser();

  const schemas = usePageSchema({
    type: 'website',
    faqs: jobsConfig.faqs,
    breadcrumbs: jobsConfig.breadcrumbs,
  });

  // Try to pre-fill from sessionStorage (set by editor badge click)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('jobSearchPrefill');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.title) setTitleInput(data.title);
        if (data.location) setLocationInput(data.location);
        if (data.country) setCountry(data.country);
        if (Array.isArray(data.skills)) prefillSkillsRef.current = data.skills;
        if (data.seniorityLevel) prefillSeniorityRef.current = data.seniorityLevel;
        if (data.yearsExperience) prefillYearsExpRef.current = data.yearsExperience;
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
    setVisibleCount(10);
    // Clear suggestions on manual search (keep for auto/resume-triggered)
    if (e) setSuggestions(null);

    try {
      const { query, category } = normalizeJobTitle(titleInput.trim());
      const searchLocation = sanitizeLocationForSearch(locationInput.trim());
      const searchCountry = locationInput.trim()
        ? detectCountryCode(locationInput.trim())
        : country;

      const searchQuery = query || titleInput.trim();
      // Use prefilled skills on first auto-search, then persist for manual searches
      const isPrefilled = !e;
      let skills: string[];
      let seniority: SeniorityLevel | null;
      let yearsExp: number;

      if (isPrefilled && prefillSkillsRef.current.length > 0) {
        // Auto-search right after resume upload / editor prefill
        skills = prefillSkillsRef.current;
        seniority = prefillSeniorityRef.current;
        yearsExp = prefillYearsExpRef.current;
        // Persist for future manual searches
        resumeSkillsRef.current = skills;
        resumeSeniorityRef.current = seniority;
        resumeYearsExpRef.current = yearsExp;
        prefillSkillsRef.current = [];
        prefillSeniorityRef.current = null;
        prefillYearsExpRef.current = 0;
      } else {
        // Manual search — use persisted resume context if available
        skills = resumeSkillsRef.current;
        seniority = resumeSeniorityRef.current;
        yearsExp = resumeYearsExpRef.current;
      }

      const result = await searchJobs({
        query: searchQuery,
        location: searchLocation,
        country: searchCountry,
        category,
        skills: skills.length > 0 ? skills : undefined,
        seniorityLevel: seniority || undefined,
        yearsExperience: yearsExp || undefined,
        titleOnly: true,
        maxDaysOld: 30,
        salaryMin: seniority ? getSalaryFloor(searchCountry, seniority) : undefined,
      });
      setJobs(result.jobs);
      setTotalCount(result.count);
      setSearchedCountry(searchCountry);
      setAiTermsUsed(result.ai_terms_used || []);
    } catch {
      setError('Unable to fetch jobs. Please try again.');
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [titleInput, locationInput, country]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + 10);
  }, []);

  // Auto-search when pre-filled from editor
  useEffect(() => {
    if (shouldAutoSearch.current && titleInput) {
      shouldAutoSearch.current = false;
      handleSearch();
    }
  }, [titleInput, handleSearch]);

  const handlePillClick = (title: string) => {
    setTitleInput(title);
    setSuggestions(null);
    // Trigger search on next tick after state update
    setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 0);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only deactivate if leaving the form (not entering a child)
    const rect = formRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX: x, clientY: y } = e;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setDragActive(false);
      }
    }
  }, []);

  const handleResumeDrop = useCallback(async (file: File) => {
    setDragActive(false);
    setSuggestions(null);
    setError(null);

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      setError('Please drop a PDF or DOCX file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB).');
      return;
    }

    if (!session) {
      setError('Please sign in to upload a resume.');
      return;
    }

    setResumeParsing(true);
    try {
      const result = await parseResume(file);
      const params = extractSearchParamsFromYAML(result.yaml);
      if (!params) {
        setError('Could not extract job details from your resume. Try searching manually.');
        return;
      }

      // Populate form fields
      setTitleInput(params.displayTitle || params.query);
      if (params.location) setLocationInput(params.location);
      if (params.country) setCountry(params.country);

      // Store skills/seniority for the auto-search
      prefillSkillsRef.current = params.skills;
      prefillSeniorityRef.current = params.seniorityLevel;
      prefillYearsExpRef.current = params.yearsExperience;
      shouldAutoSearch.current = true;

      // Extract experience titles for role suggestions (in background)
      try {
        const parsed = yaml.load(result.yaml) as { sections?: Array<{ type?: string; content?: Array<{ title?: string }> }> };
        const expSection = parsed?.sections?.find((s) => isExperienceSection(s as never));
        const expTitles = (expSection?.content || [])
          .map((item) => item.title?.trim())
          .filter(Boolean) as string[];

        suggestRoles(params.query, params.skills, expTitles).then((s) => {
          if (s && s.alternative_roles.length > 0) setSuggestions(s);
        });
      } catch {
        // Non-critical — suggestions are optional
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse resume.');
    } finally {
      setResumeParsing(false);
    }
  }, [session, parseResume]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleResumeDrop(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [handleResumeDrop]);

  const dynamicTitle = hasSearched && titleInput.trim()
    ? `${titleInput.trim()} Jobs${locationInput.trim() ? ` in ${locationInput.trim()}` : ''} | EasyFreeResume`
    : null;

  return (
    <SEOPageLayout seoConfig={jobsConfig.seo} schemas={schemas}>
      {dynamicTitle && (
        <Helmet>
          <title>{dynamicTitle}</title>
        </Helmet>
      )}
      <BreadcrumbsWithSchema breadcrumbs={jobsConfig.breadcrumbs!} />

      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            <span>Job Search</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {jobsConfig.hero.h1}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {jobsConfig.hero.subtitle}
          </p>
        </div>

        {/* Search Form */}
        <form
          ref={formRef}
          onSubmit={handleSearch}
          onDragEnter={handleDragIn}
          onDragOver={handleDrag}
          onDragLeave={handleDragOut}
          onDrop={handleDrop}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-8 relative"
        >
          {/* Drag overlay */}
          {dragActive && (
            <div className="absolute inset-0 bg-indigo-50/90 border-2 border-dashed border-indigo-400 rounded-2xl z-10 flex flex-col items-center justify-center gap-2 pointer-events-none">
              <Upload className="w-8 h-8 text-indigo-500" />
              <p className="text-indigo-700 font-semibold text-sm">Drop your resume here (PDF or DOCX)</p>
            </div>
          )}

          {/* Parsing progress */}
          {(resumeParsing || parserBusy) ? (
            <div className="py-6 flex flex-col items-center gap-3">
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${parserProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{progressMessage || 'Analyzing your resume...'}</p>
            </div>
          ) : (
            <>
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

              {/* Drop hint */}
              <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                <Upload className="w-3 h-3" />
                Or drag &amp; drop your resume (PDF/DOCX) for an instant personalized search
              </p>
            </>
          )}
        </form>

        {/* Error */}
        {error && (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Role Suggestions */}
        {suggestions && suggestions.alternative_roles.length > 0 && !loading && (
          <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-gray-900">Consider these related roles</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">Based on your resume skills and experience</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.alternative_roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handlePillClick(role)}
                  className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-sm font-medium rounded-full hover:bg-indigo-100 hover:border-indigo-300 transition-colors shadow-sm"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        {hasSearched && !loading && !error && jobs.length > 0 && (
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {totalCount.toLocaleString()} jobs found
            </h2>
            <span className="text-sm text-gray-500">
              for &ldquo;{titleInput}&rdquo;{locationInput ? ` in ${locationInput}` : ''}
            </span>
          </div>
        )}

        {/* Tier 3 AI Transparency */}
        {hasSearched && !loading && aiTermsUsed.length > 0 && (
          <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Also searched for:</span>
            {aiTermsUsed.map((term) => (
              <span key={term} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                {term}
              </span>
            ))}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-10 bg-gray-200" />
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-9 bg-gray-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && jobs.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.slice(0, visibleCount).map((job, i) => {
                const salary = formatSalary(job.salary_min, job.salary_max, searchedCountry);
                const posted = timeAgo(job.created);
                const initial = (job.company || job.title || '?')[0].toUpperCase();
                const gradients = [
                  'from-blue-500 to-indigo-600',
                  'from-purple-500 to-pink-600',
                  'from-emerald-500 to-teal-600',
                  'from-amber-500 to-orange-600',
                  'from-rose-500 to-red-600',
                  'from-cyan-500 to-blue-600',
                ];
                const gradientIndex = initial.charCodeAt(0) % gradients.length;
                return (
                  <a
                    key={i}
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    onClick={() => console.log('[affiliate] click: job-search', { title: job.title, company: job.company })}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden group flex flex-col"
                  >
                    <div className={`h-10 bg-gradient-to-r ${gradients[gradientIndex]} flex items-center px-4`}>
                      <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{initial}</span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {[job.company, job.location].filter(Boolean).join(' · ')}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {job.match_score != null && (
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            job.match_score >= 70
                              ? 'bg-emerald-50 text-emerald-700'
                              : job.match_score >= 40
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-gray-100 text-gray-500'
                          }`}>
                            {Math.round(job.match_score)}% match
                          </span>
                        )}
                        {salary && (
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            job.salary_is_predicted
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {salary}{job.salary_is_predicted ? ' est.' : ''}
                          </span>
                        )}
                        {posted && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {posted}
                          </span>
                        )}
                      </div>
                      <div className="mt-auto pt-2">
                        <span className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          Apply Now
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Load More */}
            {visibleCount < jobs.length && (
              <div className="text-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <Search className="w-4 h-4" />
                  Load more jobs ({jobs.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results State */}
        {hasSearched && !loading && !error && jobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs found</h3>
            <p className="text-sm text-gray-500 mb-6">Try different keywords or a broader location</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {POPULAR_SEARCHES.slice(0, 6).map((title) => (
                <button
                  key={title}
                  onClick={() => handlePillClick(title)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State (before searching) — Popular searches */}
        {!hasSearched && !loading && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium text-gray-500 mb-1">Search for your next opportunity</p>
            <p className="text-sm text-gray-400 mb-6">Or try one of these popular searches</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {POPULAR_SEARCHES.map((title) => (
                <button
                  key={title}
                  onClick={() => handlePillClick(title)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors shadow-sm"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Powered by */}
        <div className="text-center mt-8 mb-12">
          <p className="text-xs text-gray-400">
            Job listings powered by Adzuna
          </p>
        </div>

        {/* ===== Static SEO Content ===== */}

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-indigo-600" />
              </div>
              <div className="text-sm font-bold text-indigo-600 mb-1">Step 1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Resume</h3>
              <p className="text-sm text-gray-600">
                Create a professional, ATS-friendly resume using our free builder with proven templates.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-purple-600" />
              </div>
              <div className="text-sm font-bold text-purple-600 mb-1">Step 2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Jobs</h3>
              <p className="text-sm text-gray-600">
                Find matching openings across 19 countries with salary information and direct apply links.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="text-sm font-bold text-emerald-600 mb-1">Step 3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply Directly</h3>
              <p className="text-sm text-gray-600">
                Click through to apply on the employer's site with your polished resume ready to upload.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/templates"
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Resume Templates
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Build an ATS-friendly resume with our free professional templates.
            </p>
          </Link>
          <Link
            to="/resume-keywords"
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Resume Keywords
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Industry-specific keywords to pass ATS filters and impress recruiters.
            </p>
          </Link>
          <Link
            to="/blog/job-interview-guide"
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Interview Guide
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Prepare for your interview with our comprehensive guide and tips.
            </p>
          </Link>
        </div>

        {/* FAQ Section */}
        <FAQSection faqs={jobsConfig.faqs!} />
      </div>
    </SEOPageLayout>
  );
}
