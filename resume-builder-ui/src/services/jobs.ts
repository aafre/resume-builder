// src/services/jobs.ts

const API_BASE_URL = '/api';

export interface AdzunaJob {
  title: string;
  company: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  url: string;
  created: string;
}

export interface JobSearchResult {
  count: number;
  jobs: AdzunaJob[];
}

/**
 * Search for jobs via the backend Adzuna proxy.
 * Throws on non-200 responses or network errors.
 */
export async function searchJobs(
  query: string,
  location: string,
  country: string,
  category?: string | null,
  page?: number,
): Promise<JobSearchResult> {
  const params = new URLSearchParams({ query, country });
  if (location) params.set('location', location);
  if (category) params.set('category', category);
  if (page && page > 1) params.set('page', String(page));

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
