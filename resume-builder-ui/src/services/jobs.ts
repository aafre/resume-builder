// src/services/jobs.ts

const API_BASE_URL = '/api';

export interface AdzunaJob {
  title: string;
  company: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_is_predicted: boolean;
  url: string;
  created: string;
}

export interface JobSearchResult {
  count: number;
  jobs: AdzunaJob[];
}

export interface JobSearchOptions {
  query: string;
  location: string;
  country: string;
  category?: string | null;
  page?: number;
  skills?: string[];
  titleOnly?: boolean;
  maxDaysOld?: number;
  salaryMin?: number;
  fullTime?: boolean;
  permanent?: boolean;
  sortBy?: 'relevance' | 'salary' | 'date';
}

/**
 * Search for jobs via the backend Adzuna proxy.
 * Throws on non-200 responses or network errors.
 */
export async function searchJobs(opts: JobSearchOptions): Promise<JobSearchResult> {
  const params = new URLSearchParams({ query: opts.query, country: opts.country });
  if (opts.location) params.set('location', opts.location);
  if (opts.category) params.set('category', opts.category);
  if (opts.page && opts.page > 1) params.set('page', String(opts.page));
  if (opts.skills && opts.skills.length > 0) params.set('what_or', opts.skills.join(' '));
  if (opts.titleOnly) params.set('title_only', '1');
  if (opts.maxDaysOld) params.set('max_days_old', String(opts.maxDaysOld));
  if (opts.salaryMin) params.set('salary_min', String(opts.salaryMin));
  if (opts.fullTime) params.set('full_time', '1');
  if (opts.permanent) params.set('permanent', '1');
  if (opts.sortBy && opts.sortBy !== 'relevance') params.set('sort_by', opts.sortBy);

  const response = await fetch(`${API_BASE_URL}/jobs/search?${params}`);
  if (!response.ok) {
    throw new Error('Job search request failed');
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Job search failed');
  }

  return data.data;
}
