/** API client for pSEO job page data. */
import type { PseoPageData } from '../types/jobs';

const API_BASE = '/api/jobs/page';

export async function fetchPseoPageData(
  path: string,
  page?: number,
): Promise<PseoPageData | null> {
  const cleanPath = path.replace(/^\/jobs\/?/, '').replace(/^\/+|\/+$/g, '');
  if (!cleanPath) return null;

  const url = new URL(`${API_BASE}/${cleanPath}`, window.location.origin);
  if (page && page > 1) {
    url.searchParams.set('page', String(page));
  }

  const resp = await fetch(url.toString());
  if (!resp.ok) return null;

  const json = await resp.json();
  if (!json.success) return null;

  return json.data as PseoPageData;
}
