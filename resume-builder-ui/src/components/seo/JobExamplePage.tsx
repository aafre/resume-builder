/**
 * Job Example Page Component
 * Programmatic SEO page for individual job title resume examples
 * URL: /examples/:slug
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import BulletPointBank from '../shared/BulletPointBank';
import BreadcrumbsWithSchema from '../shared/BreadcrumbsWithSchema';
import { usePageSchema } from '../../hooks/usePageSchema';
import { loadJobExample, convertToEditorFormat } from '../../utils/yamlLoader';
import { getRelatedJobs, JOB_CATEGORIES } from '../../data/jobExamples';
import type { JobExampleData } from '../../data/jobExamples/types';
import type { FAQConfig } from '../../types/seo';

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40">
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="h-96 bg-gray-200 rounded mb-8"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Not found component
const NotFound = ({ slug }: { slug: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Example Not Found</h1>
      <p className="text-gray-600 mb-6">
        We could not find a resume example for "{slug}".
      </p>
      <Link
        to="/examples"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Browse All Examples
      </Link>
    </div>
  </div>
);

export default function JobExamplePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<JobExampleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Load YAML data
  useEffect(() => {
    if (!slug) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    loadJobExample(slug)
      .then((result) => {
        if (result) {
          setData(result);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // Handle "Edit This Template" click
  const handleEditTemplate = () => {
    if (!data) return;

    // Convert YAML resume to editor format and store in sessionStorage
    const editorData = convertToEditorFormat(data.resume);
    sessionStorage.setItem('loadedResumeData', JSON.stringify(editorData));

    // Navigate to editor
    navigate('/editor');
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !data || !slug) {
    return <NotFound slug={slug || 'unknown'} />;
  }

  // Get related jobs
  const relatedJobs = getRelatedJobs(slug, 4);

  // Get category info
  const categoryInfo = JOB_CATEGORIES.find(c => c.id === data.meta.category);

  // Generate FAQs (use custom FAQs if provided, otherwise generate)
  const faqs: FAQConfig[] = data.customFaqs || generateFAQs(data);

  // Create SEO config
  const seoConfig = {
    title: data.meta.metaTitle,
    description: data.meta.metaDescription,
    keywords: [
      `${data.meta.title.toLowerCase()} resume`,
      `${data.meta.title.toLowerCase()} resume example`,
      `${data.meta.title.toLowerCase()} resume template`,
      `free ${data.meta.title.toLowerCase()} resume`,
    ],
    canonicalUrl: `/examples/${slug}`,
  };

  // Create schema
  const schemas = usePageSchema({
    type: 'itemList',
    faqs,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Resume Examples', href: '/examples' },
      { label: data.meta.title, href: `/examples/${slug}` },
    ],
  });

  // Hero config - no CTA here since sidebar has the working "Edit This Template" button
  const heroConfig = {
    h1: `Free ${data.meta.title} Resume Example`,
    subtitle: `ATS-optimized template with ${data.bulletBank.reduce((acc, cat) => acc + cat.bullets.length, 0)}+ bullet points`,
    description: `Professional ${data.meta.title.toLowerCase()} resume example ready to customize. Edit directly in our free builder or copy bullet points to your existing resume.`,
  };

  return (
    <SEOPageLayout seoConfig={seoConfig} schemas={schemas}>
      {/* Breadcrumbs */}
      <BreadcrumbsWithSchema
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Resume Examples', href: '/examples' },
          { label: categoryInfo?.title || 'Examples', href: `/examples?category=${data.meta.category}` },
          { label: data.meta.title, href: `/examples/${slug}` },
        ]}
      />

      {/* Hero Section */}
      <PageHero config={heroConfig} />

      {/* Resume Preview Section */}
      <section className="my-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Resume Preview */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Resume Preview</h2>
                <span className="text-sm text-gray-500">
                  Template: {data.resume.template.charAt(0).toUpperCase() + data.resume.template.slice(1)}
                </span>
              </div>

              {/* Simplified Resume Display */}
              <div className="p-6 lg:p-8 bg-white">
                {/* Contact Header */}
                <div className="text-center border-b border-gray-200 pb-6 mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{data.resume.contact.name}</h3>
                  <p className="text-lg text-blue-600 mt-1">{data.resume.contact.title}</p>
                  <p className="text-gray-600 mt-2 text-sm">
                    {data.resume.contact.email} | {data.resume.contact.phone} | {data.resume.contact.location}
                  </p>
                </div>

                {/* Summary */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                    Professional Summary
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{data.resume.summary}</p>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                    Work Experience
                  </h4>
                  {data.resume.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="font-semibold text-gray-900">{exp.title}</p>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <p className="text-gray-500 text-sm">{exp.dates}</p>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {exp.bullets.slice(0, 3).map((bullet, bIndex) => (
                          <li key={bIndex} className="text-gray-700 text-sm pl-4 relative">
                            <span className="absolute left-0 text-gray-400">&bull;</span>
                            {bullet}
                          </li>
                        ))}
                        {exp.bullets.length > 3 && (
                          <li className="text-gray-500 text-sm pl-4 italic">
                            +{exp.bullets.length - 3} more bullet points...
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                    Education
                  </h4>
                  {data.resume.education.map((edu, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{edu.degree}</p>
                        <p className="text-gray-600">{edu.school}</p>
                      </div>
                      <p className="text-gray-500 text-sm">{edu.year}</p>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.resume.skills.slice(0, 8).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {data.resume.skills.length > 8 && (
                      <span className="px-2 py-1 text-gray-500 text-sm">
                        +{data.resume.skills.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with CTA */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Use This Template
              </h3>
              <p className="text-gray-600 mb-6">
                Click below to open this resume in our free editor. Customize the content with your own experience.
              </p>

              <button
                onClick={handleEditTemplate}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
              >
                Edit This Template
              </button>

              <Link
                to="/templates"
                className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors"
              >
                Browse All Templates
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">What you get:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span>
                    ATS-optimized format
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span>
                    Pre-written bullet points
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span>
                    Professional layout
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span>
                    Free PDF download
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bullet Point Bank */}
      <BulletPointBank
        categories={data.bulletBank}
        jobTitle={data.meta.title}
      />

      {/* FAQs */}
      <FAQSection faqs={faqs} />

      {/* Related Jobs Section */}
      {relatedJobs.length > 0 && (
        <section className="my-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Related Resume Examples
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedJobs.map((job) => (
              <Link
                key={job.slug}
                to={`/examples/${job.slug}`}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {job.metaDescription}
                </p>
                <span className="inline-block mt-3 text-blue-600 text-sm font-medium">
                  View Example &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <DownloadCTA
        title={`Start Your ${data.meta.title} Resume`}
        description="Use our free builder to create a professional resume in minutes. No sign-up required."
        primaryText="Browse All Templates"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}

/**
 * Generate default FAQs for a job example
 */
function generateFAQs(data: JobExampleData): FAQConfig[] {
  return [
    {
      question: `What skills should I include on a ${data.meta.title.toLowerCase()} resume?`,
      answer: `Key skills for a ${data.meta.title.toLowerCase()} resume include: ${data.resume.skills.slice(0, 5).join(', ')}. Focus on skills mentioned in the job description and quantify your achievements where possible.`,
    },
    {
      question: `How do I write a ${data.meta.title.toLowerCase()} resume with no experience?`,
      answer: `Focus on transferable skills, relevant coursework, volunteer work, and any projects that demonstrate your abilities. Use our bullet point bank above for inspiration on how to frame your experience effectively.`,
    },
    {
      question: `What should I put in my ${data.meta.title.toLowerCase()} resume summary?`,
      answer: `Your summary should highlight your years of experience (if applicable), key skills, and notable achievements. Keep it to 2-3 sentences. Example: "${data.resume.summary.slice(0, 150)}..."`,
    },
    {
      question: `Is this ${data.meta.title.toLowerCase()} resume template ATS-friendly?`,
      answer: `Yes, this template uses clean formatting, standard fonts, and proper section headers that Applicant Tracking Systems can easily parse. Avoid adding graphics or unusual formatting to maintain ATS compatibility.`,
    },
    {
      question: `How long should my ${data.meta.title.toLowerCase()} resume be?`,
      answer: `For most ${data.meta.title.toLowerCase()} positions, keep your resume to 1-2 pages. If you have less than 10 years of experience, aim for one page. Senior roles with extensive experience may warrant two pages.`,
    },
    {
      question: `Can I edit this ${data.meta.title.toLowerCase()} resume template?`,
      answer: `Yes! Click "Edit This Template" to open this resume in our free builder. You can customize all content, change the template style, and download as PDF - all without creating an account.`,
    },
  ];
}
