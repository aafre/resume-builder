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
import StepByStep from '../shared/StepByStep';
import RevealSection from '../shared/RevealSection';
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

  // Steps for "How to Use" section
  const howToSteps = [
    {
      number: 1,
      title: 'Find Your Job Title',
      description: 'Browse by category or search for your specific role. Each example is tailored to industry standards.',
    },
    {
      number: 2,
      title: 'Copy or Edit',
      description: 'Copy bullet points to your resume, or click "Edit This Template" to open directly in our builder.',
    },
    {
      number: 3,
      title: 'Customize & Download',
      description: 'Personalize with your experience and achievements. Download as PDF when ready.',
    },
  ];

  return (
    <SEOPageLayout seoConfig={seoConfig} schemas={schemas}>
      <PageHero config={heroConfig} />

      {/* Category Filter */}
      <section className="my-8">
        <div className="p-2 bg-white/50 rounded-2xl border border-black/[0.06]">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-accent text-ink'
                  : 'bg-chalk-dark text-stone-warm hover:bg-white hover:shadow-sm'
              }`}
            >
              All Examples ({totalExamples})
            </button>
            {JOB_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-accent text-ink'
                    : 'bg-chalk-dark text-stone-warm hover:bg-white hover:shadow-sm'
                }`}
              >
                {category.icon} {category.title.split(' & ')[0]} ({jobsByCategory[category.id].length})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Examples by Category */}
      <section className="my-12">
        {categoriesToShow.map(category => {
          const jobs = jobsByCategory[category.id];
          if (jobs.length === 0) return null;

          return (
            <RevealSection key={category.id}>
              <div className="mb-12" id={category.id}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
                      {category.title} Resumes
                    </h2>
                    <p className="text-stone-warm font-extralight">{category.description}</p>
                  </div>
                </div>

                {/* Job Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.map(job => (
                    <Link
                      key={job.slug}
                      to={`/examples/${job.slug}`}
                      className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-ink group-hover:text-accent transition-colors">
                          {job.title}
                        </h3>
                        <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                          &rarr;
                        </span>
                      </div>
                      <p className="text-sm text-stone-warm mt-2 line-clamp-2">
                        {job.metaDescription}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-accent/[0.06] text-ink/80 rounded">
                          Free Template
                        </span>
                        <span className="text-xs px-2 py-1 bg-accent/10 text-ink/80 rounded">
                          ATS-Friendly
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </RevealSection>
          );
        })}
      </section>

      {/* How to Use Section */}
      <RevealSection>
        <div className="my-16">
          <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">How It Works</span>
          <StepByStep steps={howToSteps} title="" />
        </div>
      </RevealSection>

      {/* Stats Section */}
      <RevealSection stagger>
        <section className="my-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 text-center card-gradient-border shadow-premium">
              <p className="text-3xl font-extrabold text-accent">{totalExamples}+</p>
              <p className="text-stone-warm">Resume Examples</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center card-gradient-border shadow-premium">
              <p className="text-3xl font-extrabold text-accent">{JOB_CATEGORIES.length}</p>
              <p className="text-stone-warm">Industries Covered</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center card-gradient-border shadow-premium">
              <p className="text-3xl font-extrabold text-accent">100%</p>
              <p className="text-stone-warm">Free to Use</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center card-gradient-border shadow-premium">
              <p className="text-3xl font-extrabold text-accent">ATS</p>
              <p className="text-stone-warm">Optimized</p>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Quick Links by Popular Jobs */}
      <RevealSection>
        <section className="my-16">
          <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">Popular</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-6 text-center">
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
                  className="px-4 py-2 bg-chalk-dark text-ink rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 text-sm"
                >
                  {job.title}
                </Link>
              ))}
          </div>
        </section>
      </RevealSection>

      <FAQSection faqs={FAQS} />

      {/* Related Resources */}
      <RevealSection>
        <section className="my-16">
          <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">Resources</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-6 text-center">
            More Resume Resources
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/templates"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300 text-center"
            >
              <span className="text-ink font-medium">Resume Templates</span>
            </Link>
            <Link
              to="/resume-keywords"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300 text-center"
            >
              <span className="text-ink font-medium">Resume Keywords by Industry</span>
            </Link>
            <Link
              to="/blog/how-to-write-a-resume-guide"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300 text-center"
            >
              <span className="text-ink font-medium">How to Write a Resume</span>
            </Link>
            <Link
              to="/cv-templates"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300 text-center"
            >
              <span className="text-ink font-medium">CV Templates (UK)</span>
            </Link>
          </div>
        </section>
      </RevealSection>

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
