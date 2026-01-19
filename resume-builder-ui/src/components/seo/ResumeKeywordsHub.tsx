/**
 * Resume Keywords Hub Page
 * URL: /resume-keywords
 * Target keyword: "resume keywords"
 */

import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import JobCategorySection from './JobCategorySection';
import { InContentAd } from '../ads';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';
import { JOBS_DATABASE, getJobsByCategory } from '../../data/jobKeywords';

export default function ResumeKeywordsHub() {
  const config = SEO_PAGES.keywordsHub;

  // Group jobs by category
  const technologyJobs = getJobsByCategory('technology');
  const creativeJobs = getJobsByCategory('creative');
  const businessJobs = getJobsByCategory('business');

  // Define category configurations
  const categories = [
    {
      title: '💻 Technology',
      jobs: technologyJobs,
      colorScheme: {
        border: 'border-blue-200',
        hoverBorder: 'hover:border-blue-400',
        text: 'text-blue-600',
      },
    },
    {
      title: '🎨 Design',
      jobs: creativeJobs,
      colorScheme: {
        border: 'border-purple-200',
        hoverBorder: 'hover:border-purple-400',
        text: 'text-purple-600',
      },
    },
    {
      title: '📊 Business & Management',
      jobs: businessJobs,
      colorScheme: {
        border: 'border-green-200',
        hoverBorder: 'hover:border-green-400',
        text: 'text-green-600',
      },
    },
  ];

  // Generate schema items from all jobs
  const schemaItems = JOBS_DATABASE.map(job => ({
    name: `${job.title} Resume Keywords`,
    url: `/resume-keywords/${job.slug}`,
    description: `Essential keywords for ${job.title.toLowerCase()} roles`,
  }));

  const schemas = usePageSchema({
    type: 'itemList',
    items: schemaItems,
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* In-content Ad - Below hero */}
      <InContentAd adSlot="1234567893" marginY={32} />

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Why resume keywords matter in 2025
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Over 98% of Fortune 500 companies use Applicant Tracking Systems (ATS) to filter
            resumes before human recruiters see them. These systems scan for specific keywords
            that match the job description.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Without the right keywords, your resume may never reach a human recruiter - no matter
            how qualified you are. Using industry-specific keywords naturally throughout your
            resume is critical to passing ATS filters and landing interviews.
          </p>
        </div>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          Browse keywords by industry
        </h2>

        {categories.map(category => (
          <JobCategorySection
            key={category.title}
            title={category.title}
            jobs={category.jobs}
            colorScheme={category.colorScheme}
          />
        ))}
      </div>

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          How to find keywords for your resume
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-4">1️⃣</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Collect job postings
              </h3>
              <p className="text-gray-700">
                Find 3-5 job ads for your target role. Look at both required and preferred qualifications.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-4">2️⃣</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Identify patterns
              </h3>
              <p className="text-gray-700">
                Highlight repeated skills, tools, certifications, and phrases. These are your target keywords.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-4">3️⃣</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Place strategically
              </h3>
              <p className="text-gray-700">
                Add keywords naturally to your summary, experience bullets, and skills section.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Ready to Optimize Your Resume?"
        description="Use these keywords with our ATS-friendly templates for maximum impact."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
