// Job listings in both places they appear: the post-download modal and /jobs.
// The jobs service and analytics are faked; nothing leaves the process.
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AdzunaJob, JobSearchResult } from '../services/jobs';

const searchJobs = vi.fn<(opts: unknown) => Promise<JobSearchResult>>();
vi.mock('../services/jobs', async (orig) => ({
  ...(await orig<typeof import('../services/jobs')>()),
  searchJobs: (opts: unknown) => searchJobs(opts),
  suggestRoles: vi.fn().mockResolvedValue(null),
}));

const trackJobImpression = vi.fn();
const trackJobClick = vi.fn();
vi.mock('../lib/analytics', async (orig) => ({
  ...(await orig<typeof import('../lib/analytics')>()),
  trackJobImpression: (p: unknown) => trackJobImpression(p),
  trackJobClick: (p: unknown) => trackJobClick(p),
}));

vi.mock('../config/affiliate', () => ({
  affiliateConfig: {
    resumeReview: { enabled: false, url: '', label: '', description: '' },
    jobSearch: { enabled: true },
  },
  hasAnyAffiliate: () => true,
}));

vi.mock('../utils/trustpilot', () => ({ ensureTrustpilotLoaded: () => new Promise(() => {}) }));
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ session: null }) }));
vi.mock('../hooks/useResumeParser', () => ({
  useResumeParser: () => ({ parseResume: vi.fn(), parsing: false, progress: 0, progressMessage: '' }),
}));
vi.mock('../utils/resumeDataExtractor', async (orig) => ({
  ...(await orig<typeof import('../utils/resumeDataExtractor')>()),
  extractJobSearchParams: () => ({
    query: 'registered nurse',
    displayTitle: 'Registered Nurse',
    location: 'Leeds',
    country: 'gb',
    category: null,
    skills: ['triage'],
    seniorityLevel: 'mid',
    yearsExperience: 4,
  }),
}));

import DownloadCelebrationModal from '../components/DownloadCelebrationModal';
import JobsPage from '../components/JobsPage';

const job = (i: number, over: Partial<AdzunaJob> = {}): AdzunaJob => ({
  title: `Staff Nurse ${i}`,
  company: `Trust ${i}`,
  location: 'Leeds',
  salary_min: 30000,
  salary_max: 36000,
  salary_is_predicted: false,
  url: `https://adzuna.example/job/${i}`,
  created: new Date().toISOString(),
  match_score: 90 - i,
  feed: 'adzuna',
  ...over,
});

const result = (jobs: AdzunaJob[]): JobSearchResult => ({ count: jobs.length, jobs });

function renderModal() {
  return render(
    <DownloadCelebrationModal
      isOpen
      onClose={() => {}}
      onSignUp={() => {}}
      isAnonymous={false}
      contactInfo={null}
      sections={[]}
    />,
  );
}

function renderJobsPage(url = '/jobs?q=Registered%20Nurse&c=gb') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[url]}>
        <JobsPage />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

beforeEach(() => {
  searchJobs.mockReset();
  trackJobImpression.mockReset();
  trackJobClick.mockReset();
});

describe.each([
  ['post_download', renderModal],
  ['jobs_page', () => renderJobsPage()],
] as const)('job listings (%s)', (context, renderSurface) => {
  it('labels every card with its feed and opens it in a new tab', async () => {
    searchJobs.mockResolvedValue(result([job(1), job(2)]));
    renderSurface();

    const first = (await screen.findByText('Staff Nurse 1')).closest('a')!;
    expect(first).toHaveAttribute('href', 'https://adzuna.example/job/1');
    expect(first).toHaveAttribute('target', '_blank');
    expect(first.getAttribute('rel')).toContain('noopener');
    expect(first.getAttribute('rel')).toContain('noreferrer');
    expect(screen.getAllByText('via Adzuna')).toHaveLength(2);
  });

  it('fires job_impression once per result set', async () => {
    searchJobs.mockResolvedValue(result([job(1), job(2), job(3)]));
    renderSurface();

    await screen.findByText('Staff Nurse 3');
    await waitFor(() => expect(trackJobImpression).toHaveBeenCalledTimes(1));
    expect(trackJobImpression).toHaveBeenCalledWith({
      context,
      count: 3,
      feed_mix: { adzuna: 3 },
    });
  });

  it('fires job_click with feed, position, score and context', async () => {
    searchJobs.mockResolvedValue(result([job(1), job(2)]));
    renderSurface();

    fireEvent.click(await screen.findByText('Staff Nurse 2'));
    expect(trackJobClick).toHaveBeenCalledWith({
      context,
      feed: 'adzuna',
      position: 2,
      match_score: 88,
    });
  });
});

it('/jobs impression counts only the first page of cards shown', async () => {
  searchJobs.mockResolvedValue(result(Array.from({ length: 14 }, (_, i) => job(i + 1))));
  renderJobsPage();

  await screen.findByText('Staff Nurse 10');
  await waitFor(() => expect(trackJobImpression).toHaveBeenCalledTimes(1));
  expect(trackJobImpression.mock.calls[0][0]).toMatchObject({ count: 10, feed_mix: { adzuna: 10 } });
});
