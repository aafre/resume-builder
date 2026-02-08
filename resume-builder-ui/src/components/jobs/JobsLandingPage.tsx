/**
 * React hydration component for pSEO job landing pages.
 *
 * On SSR pages: reads __PSEO_DATA__ script tag (skips initial fetch).
 * On SPA navigation: fetches data from /api/jobs/page/<path>.
 */
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { fetchPseoPageData } from '../../services/jobsPseo';
import { formatSalary } from '../../utils/currencyFormat';
import BreadcrumbsWithSchema from '../shared/BreadcrumbsWithSchema';
import FAQSection from '../shared/FAQSection';
import type { PseoPageData, PseoJob } from '../../types/jobs';

function readPseoData(): PseoPageData | null {
  try {
    const el = document.getElementById('__PSEO_DATA__');
    if (el?.textContent) {
      return JSON.parse(el.textContent) as PseoPageData;
    }
  } catch {
    // Not a server-rendered page
  }
  return null;
}

export default function JobsLandingPage() {
  const params = useParams<{
    roleSlug?: string;
    locationSlug?: string;
    modifier?: string;
    seniority?: string;
  }>();

  const [data, setData] = useState<PseoPageData | null>(readPseoData);
  const [loading, setLoading] = useState(!data);
  const [page, setPage] = useState(data?.page_num ?? 1);

  // Build the API path from route params
  const apiPath = buildApiPath(params);

  // Fetch data on SPA navigation (no __PSEO_DATA__ available)
  useEffect(() => {
    if (data) return; // Already hydrated
    if (!apiPath) return;

    setLoading(true);
    fetchPseoPageData(apiPath)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiPath, data]);

  const loadMore = useCallback(() => {
    if (!apiPath || !data) return;
    const nextPage = page + 1;
    setLoading(true);

    fetchPseoPageData(apiPath, nextPage)
      .then((result) => {
        if (result?.jobs.length) {
          setData((prev) =>
            prev
              ? { ...prev, jobs: [...prev.jobs, ...result.jobs], page_num: nextPage }
              : result,
          );
          setPage(nextPage);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiPath, data, page]);

  if (loading && !data) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">No job data available for this page.</p>
        <Link to="/jobs" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const hasMore = data.total_count > data.jobs.length;

  return (
    <div className="max-w-5xl mx-auto px-4 pb-8">
      <Helmet>
        <title>{data.title}</title>
        <meta name="description" content={data.meta_description} />
        <link rel="canonical" href={data.canonical_url} />
        {data.noindex && <meta name="robots" content="noindex, follow" />}
        {data.prev_url && <link rel="prev" href={data.prev_url} />}
        {data.next_url && <link rel="next" href={data.next_url} />}
      </Helmet>

      {/* Breadcrumbs */}
      {data.breadcrumbs?.length > 0 && (
        <BreadcrumbsWithSchema
          breadcrumbs={data.breadcrumbs.map((b) => ({
            label: b.name,
            href: b.url ?? '',
          }))}
          className="pt-4 mb-2"
        />
      )}

      {/* Header */}
      <header className="py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {data.seniority && `${capitalize(data.seniority)} `}
          {data.modifier_label &&
            !['posted-today', 'posted-this-week'].includes(data.modifier ?? '') &&
            `${data.modifier_label} `}
          {data.role_display} Jobs
          {data.location_display && ` in ${data.location_display}`}
          {data.modifier === 'posted-today' && ' — Posted Today'}
          {data.modifier === 'posted-this-week' && ' — This Week'}
        </h1>

        {data.intro_copy && (
          <p className="text-gray-600 text-base leading-relaxed mb-4">{data.intro_copy}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-indigo-700 font-medium">{data.total_count}+ jobs found</span>
          {data.salary_stats?.median > 0 && (
            <span className="text-gray-600">
              Median salary: {data.salary_stats.currency}
              {data.salary_stats.median.toLocaleString()}
              {data.salary_stats.source === 'estimated' && ' (est.)'}
            </span>
          )}
          {data.top_skills?.length > 0 && (
            <span className="text-gray-600">Top skills: {data.top_skills.slice(0, 5).join(', ')}</span>
          )}
        </div>
      </header>

      {/* Job Listings */}
      <div className="space-y-3">
        {data.jobs.map((job, i) => (
          <JobCard key={`${job.url}-${i}`} job={job} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Jobs'}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Related Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.related_roles?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Roles</h3>
            <ul className="space-y-1">
              {data.related_roles.slice(0, 6).map((role) => (
                <li key={role.slug}>
                  <Link to={role.url} className="text-indigo-600 hover:text-indigo-800 text-sm">
                    {role.name} jobs
                    {data.location_display && ` in ${data.location_display}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.related_locations?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Other Locations</h3>
            <ul className="space-y-1">
              {data.related_locations.slice(0, 6).map((loc) => (
                <li key={loc.slug}>
                  <Link to={loc.url} className="text-indigo-600 hover:text-indigo-800 text-sm">
                    {data.role_display} jobs in {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Internal Navigation */}
      {data.internal_links && (
        <nav className="mt-6">
          {data.internal_links.parent && (
            <Link
              to={data.internal_links.parent.url}
              className="text-sm text-indigo-600 hover:underline mr-4"
            >
              &larr; {data.internal_links.parent.label}
            </Link>
          )}
          {data.internal_links.siblings && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.internal_links.siblings.map((sib) => (
                <Link key={sib.url} to={sib.url} className="text-sm text-indigo-600 hover:underline">
                  {sib.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      )}

      {/* FAQs */}
      {data.faqs?.length > 0 && (
        <FAQSection
          faqs={data.faqs.map((f) => ({ question: f.question, answer: f.answer }))}
          title="Frequently Asked Questions"
          className="mt-10"
        />
      )}

      {/* CTA */}
      {data.internal_links?.cta && (
        <div className="mt-8 text-center">
          <Link
            to={data.internal_links.cta.url}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {data.internal_links.cta.label}
          </Link>
        </div>
      )}
    </div>
  );
}

function JobCard({ job }: { job: PseoJob }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 p-4 hover:border-indigo-200 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-gray-900 text-base">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:text-indigo-600 inline-flex items-center gap-1"
            >
              {job.title}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">{job.company}</p>
          <p className="text-sm text-gray-500 mt-0.5">{job.location}</p>
          {job.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{job.description}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          {job.salary_min && job.salary_max && !job.salary_is_predicted && (
            <p className="text-sm font-medium text-green-700">
              {formatSalary(job.salary_min, job.salary_max, 'gb')}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-8" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/2 mb-1" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildApiPath(params: Record<string, string | undefined>): string {
  const parts: string[] = [];

  if (params.seniority) parts.push(params.seniority);
  if (params.roleSlug) parts.push(params.roleSlug);
  if (params.locationSlug) parts.push(params.locationSlug);
  if (params.modifier) parts.push(params.modifier);

  return parts.join('/');
}
