/**
 * React hydration component for role hub pages (/jobs/{role}).
 * Shows a grid of location cards with links to role×location pages.
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchPseoPageData } from '../../services/jobsPseo';
import BreadcrumbsWithSchema from '../shared/BreadcrumbsWithSchema';
import FAQSection from '../shared/FAQSection';
import type { PseoPageData } from '../../types/jobs';

function readPseoData(): PseoPageData | null {
  try {
    const el = document.getElementById('__PSEO_DATA__');
    if (el?.textContent) {
      return JSON.parse(el.textContent) as PseoPageData;
    }
  } catch {
    // Not SSR
  }
  return null;
}

export default function JobsRoleHub() {
  const { roleSlug } = useParams<{ roleSlug: string }>();
  const [data, setData] = useState<PseoPageData | null>(readPseoData);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data || !roleSlug) return;
    setLoading(true);
    fetchPseoPageData(roleSlug)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [roleSlug, data]);

  if (loading && !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">No data available.</p>
        <Link to="/jobs" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-8">
      <Helmet>
        <title>{data.title}</title>
        <meta name="description" content={data.meta_description} />
        <link rel="canonical" href={data.canonical_url} />
      </Helmet>

      {data.breadcrumbs?.length > 0 && (
        <BreadcrumbsWithSchema
          breadcrumbs={data.breadcrumbs.map((b) => ({
            label: b.name,
            href: b.url ?? '',
          }))}
          className="pt-4 mb-2"
        />
      )}

      <header className="py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.role_display} Jobs</h1>
        {data.intro_copy && (
          <p className="text-gray-600 text-base leading-relaxed mb-4">{data.intro_copy}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-indigo-700 font-medium">{data.total_count}+ jobs across the UK</span>
          {data.salary_stats?.median > 0 && (
            <span className="text-gray-600">
              Median salary: {data.salary_stats.currency}
              {data.salary_stats.median.toLocaleString()}
            </span>
          )}
        </div>
      </header>

      {/* Location Grid */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Location</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {data.related_locations?.map((loc) => (
          <Link
            key={loc.slug}
            to={loc.url}
            className="bg-white rounded-lg border border-gray-200 p-3 hover:border-indigo-300 hover:shadow-sm transition-all text-center"
          >
            <span className="block text-sm font-medium text-gray-900">{loc.name}</span>
            <span className="block text-xs text-gray-500 mt-0.5">View jobs &rarr;</span>
          </Link>
        ))}
      </div>

      {/* Top Skills */}
      {data.top_skills?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.top_skills.map((skill) => (
              <span
                key={skill}
                className="inline-block px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Related Roles */}
      {data.related_roles?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Related Roles</h2>
          <div className="flex flex-wrap gap-2">
            {data.related_roles.slice(0, 8).map((role) => (
              <Link
                key={role.slug}
                to={role.url}
                className="inline-block px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {role.name}
              </Link>
            ))}
          </div>
        </section>
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
      <div className="mt-8 text-center">
        <Link
          to="/templates"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Build your resume
        </Link>
      </div>
    </div>
  );
}
