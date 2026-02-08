// src/components/JobsPage.tsx
// Full-page job search experience with SEO infrastructure

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Briefcase, MapPin, Search, ExternalLink, ChevronDown, Clock, FileText, BookOpen, Target, Upload, Sparkles, Info, X } from 'lucide-react';
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
import RevealSection from './shared/RevealSection';
import JobFilters, { FilterState, DEFAULT_FILTERS } from './jobs/JobFilters';
import FilterChips from './jobs/FilterChips';
import type { ActiveFilter } from './jobs/FilterChips';

interface ResumeContext {
  fileName: string;
  displayTitle: string;
  skills: string[];
  seniorityLevel: SeniorityLevel;
  yearsExperience: number;
}

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [titleInput, setTitleInput] = useState(searchParams.get('q') || '');
  const [locationInput, setLocationInput] = useState(searchParams.get('l') || '');
  const [country, setCountry] = useState(searchParams.get('c') || 'us');
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
  // Advanced filters — synced to URL params
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    contractType: (searchParams.get('type') as FilterState['contractType']) || '',
    schedule: (searchParams.get('schedule') as FilterState['schedule']) || '',
    salaryMin: Number(searchParams.get('salary')) || 0,
    salaryMax: Number(searchParams.get('salary_max')) || 0,
    maxDaysOld: Number(searchParams.get('days')) || 0,
    distance: Number(searchParams.get('radius')) || 0,
    company: searchParams.get('co') || '',
    whatExclude: searchParams.get('excl') || '',
    sortBy: (searchParams.get('sort') as FilterState['sortBy']) || 'relevance',
    sortDir: (searchParams.get('dir') as FilterState['sortDir']) || '',
  }));
  // Persistent resume context — survives across manual searches and drives UI visibility
  const [resumeContext, setResumeContext] = useState<ResumeContext | null>(null);
  const { session } = useAuth();
  const { parseResume, parsing: parserBusy, progress: parserProgress, progressMessage } = useResumeParser();

  const schemas = usePageSchema({
    type: 'website',
    faqs: jobsConfig.faqs,
    breadcrumbs: jobsConfig.breadcrumbs,
  });

  // Restore search state from URL params or sessionStorage on mount
  useEffect(() => {
    // URL params take priority (page reload / shared link)
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      shouldAutoSearch.current = true;
      return;
    }

    // Fallback: pre-fill from sessionStorage (set by editor badge click)
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
        // Restore resume context for UI display
        if (Array.isArray(data.skills) && data.skills.length > 0) {
          setResumeContext({
            fileName: 'Current resume',
            displayTitle: data.title || '',
            skills: data.skills,
            seniorityLevel: data.seniorityLevel || 'mid',
            yearsExperience: data.yearsExperience || 0,
          });
        }
        sessionStorage.removeItem('jobSearchPrefill');
        if (data.title) shouldAutoSearch.current = true;
      }
    } catch { /* ignore */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        prefillSkillsRef.current = [];
        prefillSeniorityRef.current = null;
        prefillYearsExpRef.current = 0;
      } else {
        // Manual search — use persisted resume context if available
        skills = resumeContext?.skills ?? [];
        seniority = resumeContext?.seniorityLevel ?? null;
        yearsExp = resumeContext?.yearsExperience ?? 0;
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
        maxDaysOld: filters.maxDaysOld || 30,
        salaryMin: filters.salaryMin || (seniority ? getSalaryFloor(searchCountry, seniority) : undefined),
        // Advanced filters
        permanent: filters.contractType === 'permanent' || undefined,
        contract: filters.contractType === 'contract' || undefined,
        fullTime: filters.schedule === 'full-time' || undefined,
        partTime: filters.schedule === 'part-time' || undefined,
        salaryMax: filters.salaryMax || undefined,
        distance: filters.distance || undefined,
        company: filters.company || undefined,
        whatExclude: filters.whatExclude || undefined,
        sortBy: filters.sortBy || undefined,
        sortDir: filters.sortDir || undefined,
      });
      setJobs(result.jobs);
      setTotalCount(result.count);
      setSearchedCountry(searchCountry);
      setAiTermsUsed(result.ai_terms_used || []);

      // Sync search state to URL params (survives reload)
      const params: Record<string, string> = { q: titleInput.trim() };
      if (locationInput.trim()) params.l = locationInput.trim();
      if (searchCountry !== 'us') params.c = searchCountry;
      if (filters.contractType) params.type = filters.contractType;
      if (filters.schedule) params.schedule = filters.schedule;
      if (filters.salaryMin) params.salary = String(filters.salaryMin);
      if (filters.salaryMax) params.salary_max = String(filters.salaryMax);
      if (filters.maxDaysOld) params.days = String(filters.maxDaysOld);
      if (filters.distance) params.radius = String(filters.distance);
      if (filters.company) params.co = filters.company;
      if (filters.whatExclude) params.excl = filters.whatExclude;
      if (filters.sortBy !== 'relevance') params.sort = filters.sortBy;
      if (filters.sortDir) params.dir = filters.sortDir;
      setSearchParams(params, { replace: true });
    } catch {
      setError('Unable to fetch jobs. Please try again.');
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [titleInput, locationInput, country, resumeContext, filters, setSearchParams]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + 10);
  }, []);

  const handleClearResume = useCallback(() => {
    setResumeContext(null);
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    // Auto-trigger search if user already searched
    if (hasSearched && titleInput.trim()) {
      // Defer so state update settles
      setTimeout(() => formRef.current?.requestSubmit(), 0);
    }
  }, [hasSearched, titleInput]);

  const handleClearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    if (hasSearched && titleInput.trim()) {
      setTimeout(() => formRef.current?.requestSubmit(), 0);
    }
  }, [hasSearched, titleInput]);

  const handleRemoveFilter = useCallback((key: string) => {
    const reset = { ...filters };
    switch (key) {
      case 'contractType': reset.contractType = ''; break;
      case 'schedule': reset.schedule = ''; break;
      case 'salaryMin': reset.salaryMin = 0; break;
      case 'salaryMax': reset.salaryMax = 0; break;
      case 'maxDaysOld': reset.maxDaysOld = 0; break;
      case 'distance': reset.distance = 0; break;
      case 'company': reset.company = ''; break;
      case 'whatExclude': reset.whatExclude = ''; break;
      case 'sortBy': reset.sortBy = 'relevance'; reset.sortDir = ''; break;
    }
    handleFilterChange(reset);
  }, [filters, handleFilterChange]);

  // Compute active filter chips for display
  const activeFilters: ActiveFilter[] = [];
  if (filters.contractType) activeFilters.push({ key: 'contractType', label: filters.contractType === 'permanent' ? 'Permanent' : 'Contract' });
  if (filters.schedule) activeFilters.push({ key: 'schedule', label: filters.schedule === 'full-time' ? 'Full-time' : 'Part-time' });
  if (filters.salaryMin) activeFilters.push({ key: 'salaryMin', label: `${Math.round(filters.salaryMin / 1000)}k+` });
  if (filters.salaryMax) activeFilters.push({ key: 'salaryMax', label: `Up to ${Math.round(filters.salaryMax / 1000)}k` });
  if (filters.maxDaysOld && filters.maxDaysOld !== 30) activeFilters.push({ key: 'maxDaysOld', label: filters.maxDaysOld === 1 ? 'Today' : `Last ${filters.maxDaysOld} days` });
  if (filters.distance) activeFilters.push({ key: 'distance', label: `${filters.distance} km` });
  if (filters.company) activeFilters.push({ key: 'company', label: filters.company });
  if (filters.whatExclude) activeFilters.push({ key: 'whatExclude', label: `Excl: ${filters.whatExclude}` });
  if (filters.sortBy !== 'relevance') activeFilters.push({ key: 'sortBy', label: `Sort: ${filters.sortBy}` });

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

      // Set resume context for UI display (match badges, context banner)
      setResumeContext({
        fileName: file.name,
        displayTitle: params.displayTitle,
        skills: params.skills,
        seniorityLevel: params.seniorityLevel,
        yearsExperience: params.yearsExperience,
      });

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
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 inline-block">
            Job Search
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink mb-2">
            {jobsConfig.hero.h1}
          </h1>
          <p className="text-lg font-extralight text-stone-warm max-w-2xl mx-auto">
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
          className="bg-white rounded-2xl shadow-premium card-gradient-border p-4 sm:p-6 mb-8 relative"
        >
          {/* Drag overlay */}
          {dragActive && (
            <div className="absolute inset-0 bg-accent/10 border-2 border-dashed border-accent rounded-2xl z-10 flex flex-col items-center justify-center gap-2 pointer-events-none">
              <Upload className="w-8 h-8 text-accent" />
              <p className="text-ink font-semibold text-sm">Drop your resume here (PDF or DOCX)</p>
            </div>
          )}

          {/* Parsing progress */}
          {(resumeParsing || parserBusy) ? (
            <div className="py-6 flex flex-col items-center gap-3">
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${parserProgress}%` }}
                />
              </div>
              <p className="text-sm text-stone-warm">{progressMessage || 'Analyzing your resume...'}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Job Title */}
                <div className="flex-1 relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="Job title (e.g. Software Engineer)"
                    className="w-full pl-10 pr-4 py-3 border border-black/[0.06] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="City or region (optional)"
                    className="w-full pl-10 pr-4 py-3 border border-black/[0.06] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                {/* Country */}
                <div className="relative sm:w-44">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist pointer-events-none" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 border border-black/[0.06] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
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
                  className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p className="text-xs text-mist text-center mt-2 flex items-center justify-center gap-1">
                <Upload className="w-3 h-3" />
                Or drag &amp; drop your resume (PDF/DOCX) for an instant personalized search
              </p>
            </>
          )}
        </form>

        {/* Filters */}
        {hasSearched && !loading && (
          <JobFilters
            filters={filters}
            onChange={handleFilterChange}
            hasLocation={!!locationInput.trim()}
          />
        )}

        {/* Active Filter Chips */}
        <FilterChips
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {/* Error */}
        {error && (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Role Suggestions */}
        {suggestions && suggestions.alternative_roles.length > 0 && !loading && (
          <div className="mb-6 bg-chalk-dark border border-black/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-display font-bold text-ink">Consider these related roles</h3>
            </div>
            <p className="text-xs text-mist mb-3">Based on your resume skills and experience</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.alternative_roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handlePillClick(role)}
                  className="px-3 py-1.5 bg-white border border-black/[0.06] text-ink text-sm font-medium rounded-full hover:text-accent hover:border-accent/30 transition-all shadow-sm"
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
            <h2 className="text-lg font-display font-bold text-ink">
              {totalCount.toLocaleString()} jobs found
            </h2>
            <span className="text-sm text-stone-warm">
              for &ldquo;{titleInput}&rdquo;{locationInput ? ` in ${locationInput}` : ''}
            </span>
          </div>
        )}

        {/* Tier 3 AI Transparency */}
        {hasSearched && !loading && aiTermsUsed.length > 0 && (
          <div className="flex items-center gap-2 mb-6 text-xs text-mist">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Also searched for:</span>
            {aiTermsUsed.map((term) => (
              <span key={term} className="px-2 py-0.5 bg-accent/10 text-accent rounded-full font-medium">
                {term}
              </span>
            ))}
          </div>
        )}

        {/* Resume Context Banner */}
        {hasSearched && !loading && jobs.length > 0 && resumeContext && (
          <div className="mb-6 bg-accent/5 border border-accent/20 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-sm font-medium text-ink truncate">
                  Matching against: {resumeContext.fileName}
                </span>
              </div>
              <button
                onClick={handleClearResume}
                className="p-1 rounded-lg hover:bg-black/5 text-mist hover:text-ink transition-colors flex-shrink-0"
                aria-label="Clear resume context"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-stone-warm flex-wrap">
              {resumeContext.displayTitle && (
                <span className="font-medium">{resumeContext.displayTitle}</span>
              )}
              {resumeContext.displayTitle && resumeContext.skills.length > 0 && (
                <span className="text-mist">|</span>
              )}
              {resumeContext.skills.length > 0 && (
                <span className="flex items-center gap-1 flex-wrap">
                  {resumeContext.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                      {skill}
                    </span>
                  ))}
                  {resumeContext.skills.length > 3 && (
                    <span className="text-mist">+{resumeContext.skills.length - 3}</span>
                  )}
                </span>
              )}
              {resumeContext.yearsExperience > 0 && (
                <>
                  <span className="text-mist">|</span>
                  <span>{resumeContext.yearsExperience}yr exp</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Nudge Banner — when no resume */}
        {hasSearched && !loading && jobs.length > 0 && !resumeContext && (
          <div className="flex items-center gap-2 mb-6 text-xs text-mist">
            <Upload className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span>Drop your resume on the search box for personalized match scores</span>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden animate-pulse"
              >
                <div className="p-5">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-9 bg-gray-200 rounded-xl" />
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
                return (
                  <a
                    key={i}
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    onClick={() => console.log('[affiliate] click: job-search', { title: job.title, company: job.company })}
                    className="bg-white rounded-2xl card-gradient-border shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col"
                  >
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-chalk-dark flex items-center justify-center flex-shrink-0">
                          <span className="text-ink text-sm font-bold">{initial}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-display font-bold text-ink group-hover:text-accent transition-colors line-clamp-2">
                            {job.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-stone-warm mb-2">
                        {[job.company, job.location].filter(Boolean).join(' · ')}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {job.match_score != null && resumeContext && (
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            job.match_score >= 70
                              ? 'bg-accent/10 text-accent'
                              : job.match_score >= 40
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-gray-100 text-mist'
                          }`}>
                            {Math.round(job.match_score)}% match
                          </span>
                        )}
                        {salary && (
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            job.salary_is_predicted
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-accent/10 text-accent'
                          }`}>
                            {salary}{job.salary_is_predicted ? ' est.' : ''}
                          </span>
                        )}
                        {posted && (
                          <span className="text-xs text-mist flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {posted}
                          </span>
                        )}
                      </div>
                      <div className="mt-auto pt-2">
                        <span className="flex items-center justify-center gap-2 w-full py-2.5 bg-chalk-dark text-ink rounded-xl text-sm font-semibold group-hover:bg-accent group-hover:text-white transition-colors">
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
                  className="btn-secondary inline-flex items-center gap-2"
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
          <div className="text-center py-12 bg-white rounded-2xl card-gradient-border shadow-premium">
            <Search className="w-12 h-12 mx-auto mb-3 text-mist" />
            <h3 className="text-lg font-display font-bold text-ink mb-2">No jobs found</h3>
            <p className="text-sm text-stone-warm mb-6">Try different keywords or a broader location</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {POPULAR_SEARCHES.slice(0, 6).map((title) => (
                <button
                  key={title}
                  onClick={() => handlePillClick(title)}
                  className="px-3 py-1.5 bg-chalk-dark text-ink text-xs font-medium rounded-full hover:text-accent hover:bg-accent/10 transition-colors"
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
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-mist" />
            <p className="text-lg font-display font-bold text-ink mb-1">Search for your next opportunity</p>
            <p className="text-sm text-mist mb-6">Or try one of these popular searches</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {POPULAR_SEARCHES.map((title) => (
                <button
                  key={title}
                  onClick={() => handlePillClick(title)}
                  className="px-4 py-2 bg-white border border-black/[0.06] text-ink text-sm font-medium rounded-full hover:text-accent hover:border-accent/30 transition-all shadow-sm"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Powered by */}
        <div className="text-center mt-8 mb-12">
          <p className="text-xs text-mist">
            Job listings powered by Adzuna
          </p>
        </div>

        {/* ===== Static SEO Content ===== */}

        {/* How It Works */}
        <RevealSection variant="fade-up">
          <div className="bg-white rounded-2xl shadow-premium card-gradient-border p-8 md:p-12 mb-8">
            <div className="text-center mb-8">
              <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase">How It Works</span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-ink mt-2">
                From Resume to Interview
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-chalk-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-accent" />
                </div>
                <div className="text-sm font-bold text-accent mb-1">Step 1</div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">Build Your Resume</h3>
                <p className="text-sm font-extralight text-stone-warm">
                  Create a professional, ATS-friendly resume using our free builder with proven templates.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-chalk-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-accent" />
                </div>
                <div className="text-sm font-bold text-accent mb-1">Step 2</div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">Search Jobs</h3>
                <p className="text-sm font-extralight text-stone-warm">
                  Find matching openings across 19 countries with salary information and direct apply links.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-chalk-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-7 h-7 text-accent" />
                </div>
                <div className="text-sm font-bold text-accent mb-1">Step 3</div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">Apply Directly</h3>
                <p className="text-sm font-extralight text-stone-warm">
                  Click through to apply on the employer's site with your polished resume ready to upload.
                </p>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Internal Links */}
        <RevealSection variant="fade-up">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Link
              to="/templates"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-bold text-ink group-hover:text-accent transition-colors">
                  Resume Templates
                </h3>
              </div>
              <p className="text-sm font-extralight text-stone-warm">
                Build an ATS-friendly resume with our free professional templates.
              </p>
            </Link>
            <Link
              to="/resume-keywords"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-bold text-ink group-hover:text-accent transition-colors">
                  Resume Keywords
                </h3>
              </div>
              <p className="text-sm font-extralight text-stone-warm">
                Industry-specific keywords to pass ATS filters and impress recruiters.
              </p>
            </Link>
            <Link
              to="/blog/job-interview-guide"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-bold text-ink group-hover:text-accent transition-colors">
                  Interview Guide
                </h3>
              </div>
              <p className="text-sm font-extralight text-stone-warm">
                Prepare for your interview with our comprehensive guide and tips.
              </p>
            </Link>
          </div>
        </RevealSection>

        {/* FAQ Section */}
        <FAQSection faqs={jobsConfig.faqs!} />
      </div>
    </SEOPageLayout>
  );
}
