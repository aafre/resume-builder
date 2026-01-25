/**
 * Job Examples Hub Page
 * Main hub page for all resume examples organized by industry/category
 * URL: /examples
 *
 * This page prevents the "orphan page" trap by providing hierarchical navigation
 * to all job example pages, organized by industry categories.
 */

import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import { usePageSchema } from '../../hooks/usePageSchema';
import {
  getJobExamplesByCategory,
  JOB_CATEGORIES,
  JOB_EXAMPLES_DATABASE,
} from '../../data/jobExamples';
import type { JobCategory } from '../../data/jobExamples/types';

export default function JobExamplesHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') as JobCategory | null;
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | 'all'>(
    initialCategory || 'all'
  );

  const jobsByCategory = getJobExamplesByCategory();
  const totalExamples = JOB_EXAMPLES_DATABASE.length;

  // SEO config
  const seoConfig = {
    title: 'Free Resume Examples by Job Title (2026) | 50+ Professional Templates',
    description:
      'Browse free resume examples for every job title. Customer service, software engineer, nurse, teacher, and more. Edit instantly in our free builder.',
    keywords: [
      'resume examples',
      'resume examples by job title',
      'free resume examples',
      'professional resume examples',
      'resume samples',
      'job resume examples',
    ],
    canonicalUrl: '/examples',
  };

  // Hero config
  const heroConfig = {
    h1: 'Free Resume Examples',
    subtitle: `${totalExamples}+ professional resume examples by job title`,
    description:
      'Find the perfect resume example for your job search. Each example includes pre-written bullet points, ATS-optimized formatting, and can be edited instantly in our free builder.',
    primaryCTA: {
      text: 'Start Building',
      href: '/templates',
      variant: 'primary' as const,
    },
  };

  // Schema
  const schemas = usePageSchema({
    type: 'itemList',
    items: JOB_EXAMPLES_DATABASE.slice(0, 10).map(job => ({
      name: `${job.title} Resume Example`,
      url: `/examples/${job.slug}`,
      description: job.metaDescription,
    })),
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Resume Examples', href: '/examples' },
    ],
    faqs: FAQS,
  });

  // Handle category selection
  const handleCategoryClick = (category: JobCategory | 'all') => {
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Filter categories to show
  const categoriesToShow = selectedCategory === 'all'
    ? JOB_CATEGORIES
    : JOB_CATEGORIES.filter(c => c.id === selectedCategory);

  return (
    <SEOPageLayout seoConfig={seoConfig} schemas={schemas}>
      <PageHero config={heroConfig} />

      {/* Category Filter */}
      <section className="my-8">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Examples ({totalExamples})
          </button>
          {JOB_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.title.split(' & ')[0]} ({jobsByCategory[category.id].length})
            </button>
          ))}
        </div>
      </section>

      {/* Job Examples by Category */}
      <section className="my-12">
        {categoriesToShow.map(category => {
          const jobs = jobsByCategory[category.id];
          if (jobs.length === 0) return null;

          return (
            <div key={category.id} className="mb-12" id={category.id}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {category.title} Resumes
                  </h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>

              {/* Job Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map(job => (
                  <Link
                    key={job.slug}
                    to={`/examples/${job.slug}`}
                    className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        &rarr;
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {job.metaDescription}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        Free Template
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        ATS-Friendly
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* How to Use Section */}
      <section className="my-16 bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How to Use These Resume Examples
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Find Your Job Title</h3>
            <p className="text-gray-600 text-sm">
              Browse by category or search for your specific role. Each example is tailored to industry standards.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Copy or Edit</h3>
            <p className="text-gray-600 text-sm">
              Copy bullet points to your resume, or click "Edit This Template" to open directly in our builder.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Customize & Download</h3>
            <p className="text-gray-600 text-sm">
              Personalize with your experience and achievements. Download as PDF when ready.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="my-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{totalExamples}+</p>
            <p className="text-gray-700">Resume Examples</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{JOB_CATEGORIES.length}</p>
            <p className="text-gray-700">Industries Covered</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-purple-600">100%</p>
            <p className="text-gray-700">Free to Use</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-orange-600">ATS</p>
            <p className="text-gray-700">Optimized</p>
          </div>
        </div>
      </section>

      {/* Quick Links by Popular Jobs */}
      <section className="my-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Most Popular Resume Examples
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {JOB_EXAMPLES_DATABASE
            .filter(job => job.priority >= 0.8)
            .slice(0, 12)
            .map(job => (
              <Link
                key={job.slug}
                to={`/examples/${job.slug}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm"
              >
                {job.title}
              </Link>
            ))}
        </div>
      </section>

      <FAQSection faqs={FAQS} />

      {/* Related Resources */}
      <section className="my-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          More Resume Resources
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/templates"
            className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Resume Templates
          </Link>
          <Link
            to="/resume-keywords"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Resume Keywords by Industry
          </Link>
          <Link
            to="/blog/how-to-write-a-resume-guide"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            How to Write a Resume
          </Link>
          <Link
            to="/cv-templates"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            CV Templates (UK)
          </Link>
        </div>
      </section>

      <DownloadCTA
        title="Ready to Build Your Resume?"
        description="Choose an example above or start from scratch with our free resume builder."
        primaryText="Start Building"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}

/**
 * FAQs for the hub page
 */
const FAQS = [
  {
    question: 'How do I use these resume examples?',
    answer:
      'Browse examples by job title or industry, then either copy bullet points directly to your existing resume or click "Edit This Template" to open the example in our free builder. Customize the content with your own experience and download as PDF.',
  },
  {
    question: 'Are these resume examples free?',
    answer:
      'Yes, all resume examples are 100% free to view, copy, and edit. You can download your customized resume as PDF without payment, sign-up, or watermarks.',
  },
  {
    question: 'Are the resume examples ATS-friendly?',
    answer:
      'Yes. Every example uses clean formatting, standard fonts, and proper section headers that Applicant Tracking Systems can parse correctly. This helps ensure your resume gets seen by human recruiters.',
  },
  {
    question: 'Can I edit the resume examples directly?',
    answer:
      'Yes! Click "Edit This Template" on any example to open it in our free builder. You can customize all content, change fonts and colors, add or remove sections, and download when ready.',
  },
  {
    question: 'How do I choose the right resume example?',
    answer:
      'Find an example matching your target job title or a similar role in your industry. Look for examples with similar experience levels and skill sets. You can also browse by industry category to find related positions.',
  },
  {
    question: 'Should I copy the bullet points exactly?',
    answer:
      'Use the bullet points as templates, but customize them with your own achievements, metrics, and specific details. Replace generic numbers with your actual results and tailor the language to match the job description you are applying for.',
  },
];
