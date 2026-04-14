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
import { ArrowRightIcon } from '@heroicons/react/24/solid';
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
      <section className="py-8">
        <div className="p-3 bg-white/60 rounded-2xl border border-black/[0.04] shadow-sm backdrop-blur-sm">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-5 py-2.5 rounded-xl text-sm font-display font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-accent text-ink shadow-sm'
                  : 'bg-chalk-dark text-stone-warm hover:bg-white hover:shadow-sm'
              }`}
            >
              All Examples ({totalExamples})
            </button>
            {JOB_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-display font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-accent text-ink shadow-sm'
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
      <section className="py-12">
        {categoriesToShow.map(category => {
          const jobs = jobsByCategory[category.id];
          if (jobs.length === 0) return null;

          return (
            <RevealSection key={category.id}>
              <div className="mb-12 cv-auto cv-h-500" id={category.id}>
                {/* Category Header */}
                <div className="mb-12">
                  <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-3 block">
                    {category.icon} {category.id.replace(/-/g, ' ')}
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-2">
                    {category.title} Resumes
                  </h2>
                  <p className="font-display font-extralight text-stone-warm text-sm">
                    {category.description}
                  </p>
                </div>

                {/* Job Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.map(job => (
                    <Link
                      key={job.slug}
                      to={`/examples/${job.slug}`}
                      className="group bg-white rounded-2xl p-6 border border-black/[0.04] shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display text-lg font-extrabold text-ink group-hover:text-accent transition-colors">
                          {job.title}
                        </h3>
                        <ArrowRightIcon className="w-4 h-4 text-stone-warm group-hover:text-accent group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1" />
                      </div>
                      <p className="font-display font-extralight text-stone-warm text-sm line-clamp-2 mb-3">
                        {job.metaDescription}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2.5 py-1 bg-accent/[0.06] text-ink/70 rounded-md">
                          Free Template
                        </span>
                        <span className="text-xs font-mono px-2.5 py-1 bg-accent/[0.06] text-ink/70 rounded-md">
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
      <section className="py-20 cv-auto cv-h-300">
        <div className="bg-chalk-dark rounded-3xl py-16 px-6 md:px-12">
          <RevealSection>
            <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">How It Works</span>
            <StepByStep steps={howToSteps} title="" />
          </RevealSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 cv-auto cv-h-200">
        <RevealSection stagger>
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 sm:divide-x sm:divide-ink/10">
            {[
              { value: `${totalExamples}+`, label: 'Resume Examples' },
              { value: String(JOB_CATEGORIES.length), label: 'Industries Covered' },
              { value: '100%', label: 'Free to Use' },
              { value: 'ATS', label: 'Optimized' },
            ].map((stat, i) => (
              <div key={i} className="group relative text-center sm:px-12 cursor-default">
                <p className="font-mono text-3xl md:text-4xl font-normal text-ink mb-1 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </p>
                <p className="relative font-display text-sm font-extralight text-stone-warm tracking-wide after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 group-hover:after:w-full after:h-0.5 after:bg-accent after:transition-all after:duration-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* Quick Links by Popular Jobs */}
      <section className="py-20 cv-auto cv-h-300">
        <div className="bg-chalk-dark rounded-3xl py-16 px-6 md:px-12">
          <RevealSection>
            <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">Popular</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4 text-center">
              Most Popular Resume Examples
            </h2>
            <p className="font-display text-lg font-extralight text-stone-warm mb-12 text-center max-w-2xl mx-auto">
              The most-viewed resume examples across all industries
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {JOB_EXAMPLES_DATABASE
                .filter(job => job.priority >= 0.8)
                .slice(0, 12)
                .map(job => (
                  <Link
                    key={job.slug}
                    to={`/examples/${job.slug}`}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white text-ink rounded-xl border border-transparent border-l-2 border-l-accent/30 hover:border-l-accent hover:shadow-md transition-all duration-300 text-sm font-display font-medium"
                  >
                    {job.title}
                    <ArrowRightIcon className="w-3 h-3 text-stone-warm opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                  </Link>
                ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <FAQSection faqs={FAQS} />

      {/* Related Resources */}
      <RevealSection>
        <section className="py-16 cv-auto cv-h-300">
          <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">Resources</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-12 text-center">
            More Resume Resources
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { to: '/templates', title: 'Resume Templates', desc: 'Browse professional resume templates designed for every industry.' },
              { to: '/resume-keywords', title: 'Resume Keywords by Industry', desc: 'Find the right keywords to get past ATS filters for your target role.' },
              { to: '/blog/how-to-write-a-resume-guide', title: 'How to Write a Resume', desc: 'Step-by-step guide to writing a resume that gets interviews.' },
              { to: '/cv-templates', title: 'CV Templates (UK)', desc: 'Professional CV templates formatted for UK and international job markets.' },
            ].map((resource) => (
              <Link
                key={resource.to}
                to={resource.to}
                className="group bg-chalk-dark rounded-2xl p-6 border border-transparent border-l-4 border-l-accent/30 hover:border-l-accent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
              >
                <h3 className="font-display text-lg font-extrabold text-ink mb-2 flex items-center justify-between">
                  {resource.title}
                  <ArrowRightIcon className="w-4 h-4 text-stone-warm group-hover:text-accent group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                </h3>
                <p className="font-display font-extralight text-stone-warm text-sm leading-relaxed">
                  {resource.desc}
                </p>
              </Link>
            ))}
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
