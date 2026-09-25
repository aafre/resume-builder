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
const trackJobQuotaExhausted = vi.fn();
vi.mock('../lib/analytics', async (orig) => ({
  ...(await orig<typeof import('../lib/analytics')>()),
  trackJobImpression: (p: unknown) => trackJobImpression(p),
  trackJobClick: (p: unknown) => trackJobClick(p),
  trackJobQuotaExhausted: (p: unknown) => trackJobQuotaExhausted(p),
}));

vi.mock('../config/affiliate', () => ({
  affiliateConfig: {
    resumeReview: { enabled: false, url: '', label: '', description: '' },
    jobSearch: { enabled: true },
  },
  hasAnyAffiliate: () => true,
}));

let jobsAvailable: boolean | null = true;
vi.mock('../hooks/useJobsAvailable', () => ({ useJobsAvailable: () => jobsAvailable }));

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
  trackJobQuotaExhausted.mockReset();
  sessionStorage.clear();
  jobsAvailable = true;
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

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const stale = (jobs: AdzunaJob[]): JobSearchResult => ({ ...result(jobs), status: 'stale', fetchedAt: hoursAgo(5) });
const refreshing: JobSearchResult = {
  count: 0,
  jobs: [],
  status: 'refreshing',
  searchUrl: 'https://www.adzuna.co.uk/search?q=Registered+Nurse&w=Leeds',
};

describe.each([
  ['post_download', renderModal],
  ['jobs_page', () => renderJobsPage()],
] as const)('degraded job results (%s)', (context, renderSurface) => {
  it('labels stale results with their age and reports the quota event', async () => {
    searchJobs.mockResolvedValue(stale([job(1)]));
    renderSurface();

    expect(await screen.findByText('Updated 5h ago')).toBeInTheDocument();
    expect(screen.getByText('Staff Nurse 1')).toBeInTheDocument();
    expect(trackJobQuotaExhausted).toHaveBeenCalledWith({ context, status: 'stale' });
  });

  it('reports the quota event on refreshing', async () => {
    searchJobs.mockResolvedValue(refreshing);
    renderSurface();
    await waitFor(() =>
      expect(trackJobQuotaExhausted).toHaveBeenCalledWith({ context, status: 'refreshing' }),
    );
  });

  it('fresh results carry no age label and no quota event', async () => {
    searchJobs.mockResolvedValue({ ...result([job(1)]), status: 'fresh' });
    renderSurface();
    await screen.findByText('Staff Nurse 1');
    expect(screen.queryByText(/^Updated /)).not.toBeInTheDocument();
    expect(trackJobQuotaExhausted).not.toHaveBeenCalled();
  });
});

it('post-download section renders nothing when refreshing', async () => {
  searchJobs.mockResolvedValue(refreshing);
  renderModal();
  await waitFor(() => expect(trackJobQuotaExhausted).toHaveBeenCalled());
  expect(screen.queryByText(/Jobs matching/)).not.toBeInTheDocument();
  expect(screen.queryByText(/refreshing/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /adzuna/i })).not.toBeInTheDocument();
});

it('/jobs refreshing state offers the outbound search and a way back to the resume', async () => {
  sessionStorage.setItem('jobSearchPrefill', JSON.stringify({ title: 'Registered Nurse', returnTo: '/editor/abc123' }));
  searchJobs.mockResolvedValue(refreshing);
  renderJobsPage('/jobs');

  expect(await screen.findByRole('heading', { name: /fresh listings are refreshing/i })).toBeInTheDocument();
  const outbound = screen.getByRole('link', { name: /search .*adzuna/i });
  expect(outbound).toHaveAttribute('href', refreshing.searchUrl);
  expect(outbound).toHaveAttribute('target', '_blank');
  expect(screen.getByRole('link', { name: /tailor your resume/i })).toHaveAttribute('href', '/editor/abc123');
  expect(screen.queryByText(/no jobs found/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/coming soon|error/i)).not.toBeInTheDocument();
});

it('/jobs refreshing without an editor to return to links to saved resumes', async () => {
  searchJobs.mockResolvedValue(refreshing);
  renderJobsPage();
  expect(await screen.findByRole('link', { name: /tailor your resume/i })).toHaveAttribute('href', '/my-resumes');
});

it('/jobs is noindex, follow', async () => {
  searchJobs.mockResolvedValue(result([]));
  renderJobsPage('/jobs');
  await waitFor(() =>
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow'),
  );
});

describe('country not served by any job feed', () => {
  beforeEach(() => {
    jobsAvailable = false;
    searchJobs.mockResolvedValue(result([job(1)]));
  });

  it('post-download: no job section and no search', async () => {
    renderModal();
    await screen.findByText(/Resume Downloaded Successfully/);
    expect(searchJobs).not.toHaveBeenCalled();
    expect(screen.queryByText(/Jobs matching/)).not.toBeInTheDocument();
    expect(screen.queryByText(/What.s Next/i)).not.toBeInTheDocument();
  });

  it('/jobs: no search, no results, a plain notice instead', async () => {
    renderJobsPage();
    expect(await screen.findByText(/job listings aren.t available in your country yet/i)).toBeInTheDocument();
    expect(searchJobs).not.toHaveBeenCalled();
    expect(screen.queryByRole('textbox', { name: /job title/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/jobs found|no jobs found/i)).not.toBeInTheDocument();
  });
});

it('post-download waits for availability before searching', async () => {
  jobsAvailable = null;
  searchJobs.mockResolvedValue(result([job(1)]));
  const { rerender } = renderModal();
  await screen.findByText(/Resume Downloaded Successfully/);
  expect(searchJobs).not.toHaveBeenCalled();
  jobsAvailable = true;
  rerender(
    <DownloadCelebrationModal isOpen onClose={() => {}} onSignUp={() => {}} isAnonymous={false} contactInfo={null} sections={[]} />,
  );
  expect(await screen.findByText('Staff Nurse 1')).toBeInTheDocument();
});
