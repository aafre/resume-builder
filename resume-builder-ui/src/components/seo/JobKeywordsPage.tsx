/**
 * Dynamic Job Keywords Page
 * URL Pattern: /resume-keywords/:jobSlug
 * Programmatic SEO pages for job-specific resume keywords
 */

import { useParams, Navigate } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import BreadcrumbsWithSchema from '../shared/BreadcrumbsWithSchema';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import HighlightedText from '../shared/HighlightedText';
import RelatedJobsSection from './RelatedJobsSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { getJobBySlug } from '../../data/jobKeywords';
import { generateJobFAQs, getTotalKeywordCount } from '../../utils/jobKeywordHelpers';
import { generateJobPageTitle, generateJobPageDescription } from '../../utils/seoHelpers';
import type { BreadcrumbConfig, HeroConfig } from '../../types/seo';

export default function JobKeywordsPage() {
  const { jobSlug } = useParams<{ jobSlug: string }>();

  // Get job data from database
  const jobData = jobSlug ? getJobBySlug(jobSlug) : undefined;

  // 404 if job not found
  if (!jobData) {
    return <Navigate to="/404" replace />;
  }

  // Generate FAQs (use custom if provided, otherwise auto-generate)
  const faqs = jobData.customFaqs || generateJobFAQs(jobData);

  // Get before/after example from job data
  const example = jobData.example;

  // Total keyword count
  const totalKeywords = getTotalKeywordCount(jobData);

  // Breadcrumbs
  const breadcrumbs: BreadcrumbConfig[] = [
    { label: 'Home', href: '/' },
    { label: 'Resume Keywords', href: '/resume-keywords' },
    { label: jobData.title, href: `/resume-keywords/${jobData.slug}` },
  ];

  // Hero configuration
  const heroConfig: HeroConfig = {
    h1: jobData.h1 || `${jobData.title} Resume Keywords`,
    subtitle: `${totalKeywords}+ ATS-optimized keywords to help your resume stand out`,
    description: `Complete list of ${jobData.title.toLowerCase()} keywords including core skills, technical tools, certifications, and metrics that pass Applicant Tracking Systems.`,
    primaryCTA: {
      text: 'Build Your Resume',
      href: '/templates',
      variant: 'primary' as const,
    },
    secondaryCTA: {
      text: 'Browse Templates',
      href: '/templates',
      variant: 'outline' as const,
    },
  };

  // Structured data schemas
  const schemas = usePageSchema({
    type: 'creativeWork',
    name: `${jobData.title} Resume Keywords`,
    description: jobData.metaDescription,
    url: `/resume-keywords/${jobData.slug}`,
    faqs,
    breadcrumbs,
  });

  return (
    <SEOPageLayout
      seoConfig={{
        title: generateJobPageTitle(jobData),
        description: generateJobPageDescription(jobData),
        keywords: [
          `${jobData.title.toLowerCase()} resume keywords`,
          `${jobData.title.toLowerCase()} skills`,
          'ATS optimization',
          ...jobData.keywords.core.slice(0, 5),
          ...jobData.keywords.technical.slice(0, 5),
        ],
        canonicalUrl: `/resume-keywords/${jobData.slug}`,
      }}
      schemas={schemas}
    >
      <BreadcrumbsWithSchema breadcrumbs={breadcrumbs} />

      <PageHero config={heroConfig} />

      {/* Role Intro Section */}
      {jobData.roleIntro && (
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">
              What hiring teams look for in {jobData.title.toLowerCase()} keywords
            </h2>
            <p className="text-indigo-800 leading-relaxed">
              {jobData.roleIntro}
            </p>
          </div>
        </div>
      )}

      {/* Hub navigation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12 max-w-4xl mx-auto">
        <h3 className="font-bold text-blue-800 mb-3">🔗 Part of Our Series</h3>
        <p className="text-blue-700">
          This article is part of our Resume Keywords series. For a complete overview, see our{' '}
          <a href="/resume-keywords" className="text-blue-600 hover:text-blue-800 underline font-medium">
            Resume Keywords Hub
          </a>
          .
        </p>
      </div>

      {/* Core Skills Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Core {jobData.title.toLowerCase()} skills (soft skills)
        </h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          These keywords describe essential interpersonal and professional abilities that employers look for
          in {jobData.title.toLowerCase()} roles. Include these throughout your work experience to demonstrate
          your competencies.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-bold text-green-800 mb-4 text-lg">
            🎯 Essential Core Skills
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-green-700">
            {jobData.keywords.core.map((skill, idx) => (
              <div key={idx} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Skills Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Technical skills & tools (hard skills)
        </h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Listing specific technologies and tools you've used is critical for ATS optimization. These keywords
          demonstrate your technical expertise and readiness to contribute immediately.
        </p>

        {jobData.tools ? (
          <div className="space-y-6">
            {jobData.tools.map((toolCategory, idx) => (
              <div key={idx} className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  {toolCategory.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {toolCategory.items.map((tool, toolIdx) => (
                    <span
                      key={toolIdx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-800 mb-4 text-lg">
              💻 Key Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobData.keywords.technical.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Processes Section */}
      {jobData.keywords.processes && jobData.keywords.processes.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Methodologies and processes
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            These keywords show you understand industry-standard workflows and best practices. They demonstrate
            your ability to work within established frameworks and contribute to team efficiency.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-bold text-purple-800 mb-4 text-lg">
              ⚙️ Key Processes & Methodologies
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-purple-700">
              {jobData.keywords.processes.map((process, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{process}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {jobData.keywords.certifications && jobData.keywords.certifications.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Relevant certifications
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Certifications validate your expertise and commitment to professional development. Include these
            prominently on your resume with completion dates to strengthen your application.
          </p>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <h3 className="font-bold text-indigo-800 mb-4 text-lg">
              🎓 Industry Certifications
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-indigo-700">
              {jobData.keywords.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Section */}
      {jobData.keywords.metrics && jobData.keywords.metrics.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Metrics and KPIs
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Quantifying your achievements with specific metrics makes your resume stand out. Use these KPIs
            to demonstrate the measurable impact you've made in previous roles.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="font-bold text-orange-800 mb-4 text-lg">
              📊 Key Performance Indicators
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-orange-700">
              {jobData.keywords.metrics.map((metric, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Example Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          How to use these keywords: examples
        </h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed text-center max-w-3xl mx-auto">
          Compare these two resume bullets to see how incorporating specific keywords transforms a generic
          statement into an ATS-optimized, impactful achievement.
        </p>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-800 mb-4">
              ❌ Generic (Before)
            </h4>
            <p className="text-gray-600 mb-4">
              {example.before}
            </p>
            <h4 className="font-bold text-green-800 mb-4">
              ✅ Optimized (After)
            </h4>
            <HighlightedText
              text={example.after}
              keywords={[
                ...jobData.keywords.technical.slice(0, 5),
                ...(jobData.keywords.processes?.slice(0, 2) || []),
              ]}
              className="text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Keyword Phrases Section */}
      {jobData.phrases && jobData.phrases.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Keyword phrases for {jobData.title.toLowerCase()} resumes
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            ATS systems don't just look for single words—they scan for multi-word phrases that
            indicate specific expertise. Include these 2-5 word combinations naturally in your resume.
          </p>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
            <h3 className="font-bold text-teal-800 mb-4 text-lg">
              🔗 High-Impact Keyword Phrases
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobData.phrases.map((phrase, idx) => (
                <span
                  key={idx}
                  className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {phrase}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Example Bullets Section */}
      {jobData.exampleBullets && jobData.exampleBullets.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Ready-to-adapt resume bullets
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Here are real resume bullets that incorporate keywords naturally while demonstrating
            measurable impact. Adapt these to your own experience.
          </p>

          <div className="space-y-3 max-w-4xl mx-auto">
            {jobData.exampleBullets.map((bullet, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <p className="text-gray-700">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Mistakes Section */}
      {jobData.commonMistakes && jobData.commonMistakes.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Common {jobData.title.toLowerCase()} resume mistakes
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Avoid these pitfalls that can hurt your chances of getting past the ATS or impressing
            hiring managers.
          </p>

          <div className="space-y-4 max-w-4xl mx-auto">
            {jobData.commonMistakes.map((item, idx) => (
              <div
                key={idx}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg"
              >
                <h4 className="font-bold text-gray-900 mb-1">
                  ❌ {item.mistake}
                </h4>
                <p className="text-green-700 text-sm">
                  → {item.fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <FAQSection faqs={faqs} />

      <RelatedJobsSection job={jobData} />

      <DownloadCTA
        title={`Ready to Build Your ${jobData.title} Resume?`}
        description="Use these keywords with our professional ATS-optimized templates to showcase your expertise."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
