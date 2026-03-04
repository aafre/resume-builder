/**
 * Job Example Page Component
 * Programmatic SEO page for individual job title resume examples
 * URL: /examples/:slug
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import BulletPointBank from '../shared/BulletPointBank';
import BreadcrumbsWithSchema from '../shared/BreadcrumbsWithSchema';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { loadJobExample, convertToEditorFormat } from '../../utils/yamlLoader';
import { getRelatedJobs, JOB_CATEGORIES } from '../../data/jobExamples';
import { useAuth } from '../../contexts/AuthContext';
import { useResumeCreate } from '../../hooks/useResumeCreate';
import ConversionPromptModal from '../ConversionPromptModal';
import AuthModal from '../AuthModal';
import TemplateSelectionModal from '../TemplateSelectionModal';
import type { JobExampleData } from '../../data/jobExamples/types';
import type { FAQConfig } from '../../types/seo';
import type { Section } from '../../types';

// Supabase Storage CDN base URL for pre-generated resume preview images
const PREVIEW_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/template-previews`;

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-chalk">
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="animate-pulse">
        <div className="h-8 bg-chalk-dark rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-chalk-dark rounded w-2/3 mb-4"></div>
        <div className="h-6 bg-chalk-dark rounded w-1/2 mb-8"></div>
        <div className="h-96 bg-chalk-dark rounded mb-8"></div>
        <div className="h-48 bg-chalk-dark rounded"></div>
      </div>
    </div>
  </div>
);

// Not found component
const NotFound = ({ slug }: { slug: string }) => (
  <div className="min-h-screen bg-chalk flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-extrabold text-ink mb-4">Resume Example Not Found</h1>
      <p className="text-stone-warm mb-6">
        We could not find a resume example for "{slug}".
      </p>
      <Link
        to="/examples"
        className="btn-primary py-3 px-8 inline-block"
      >
        Browse All Examples
      </Link>
    </div>
  </div>
);

export default function JobExamplePage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<JobExampleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showConversionPrompt, setShowConversionPrompt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const { isAnonymous, session } = useAuth();
  const { createResume, creating } = useResumeCreate();

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

  // Compute derived values (always computed to maintain hook order)
  const relatedJobs = slug ? getRelatedJobs(slug, 4) : [];
  const categoryInfo = data ? JOB_CATEGORIES.find(c => c.id === data.meta.category) : null;
  const faqs: FAQConfig[] = data?.customFaqs || (data ? generateFAQs(data) : []);

  // Create SEO config (with defaults for loading/error states)
  const seoConfig = data ? {
    title: data.meta.metaTitle,
    description: data.meta.metaDescription,
    keywords: [
      `${data.meta.title.toLowerCase()} resume`,
      `${data.meta.title.toLowerCase()} resume example`,
      `${data.meta.title.toLowerCase()} resume template`,
      `free ${data.meta.title.toLowerCase()} resume`,
    ],
    canonicalUrl: `/examples/${slug}`,
  } : {
    title: 'Resume Example',
    description: 'Professional resume example',
    keywords: [],
    canonicalUrl: `/examples/${slug || ''}`,
  };

  // Create schema (must be called unconditionally to maintain hook order)
  const baseSchemas = usePageSchema({
    type: 'itemList',
    faqs,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Resume Examples', href: '/examples' },
      { label: data?.meta.title || 'Example', href: `/examples/${slug || ''}` },
    ],
  });

  // Add ImageObject schema for Google Images traffic on resume example queries
  const schemas = data ? [
    ...baseSchemas,
    {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: `${PREVIEW_BASE_URL}/${slug}.webp`,
      name: `${data.meta.title} Resume Example`,
      description: data.meta.metaDescription,
      width: 800,
      height: 1131,
      encodingFormat: 'image/webp',
      creator: {
        '@type': 'Organization',
        name: 'EasyFreeResume',
      },
    },
  ] : baseSchemas;

  // Create resume from job example data
  const doCreateResume = async (templateIdOverride?: string) => {
    if (!data || !session) return;

    const editorData = convertToEditorFormat(data.resume);

    // Use override, then selected template, then example's default template
    const templateId = templateIdOverride || selectedTemplateId || data.resume.template || 'modern';

    await createResume({
      templateId,
      title: `${data.meta.title} Resume`,
      contactInfo: {
        name: data.resume.contact.name,
        email: data.resume.contact.email,
        phone: data.resume.contact.phone,
        location: data.resume.contact.location,
        linkedin: data.resume.contact.linkedin || '',
        github: data.resume.contact.github || '',
      },
      sections: (editorData as { sections: Section[] }).sections,
    });
  };

  // Handle "Edit This Template" click - show template selection first
  const handleEditTemplate = () => {
    if (!data || !session) return;

    // Always show template selection modal first
    setShowTemplateModal(true);
  };

  // Handle template selection from modal
  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowTemplateModal(false);

    // Show conversion prompt for anonymous users
    if (isAnonymous) {
      setShowConversionPrompt(true);
      return;
    }

    // Authenticated users - create directly with selected template
    await doCreateResume(templateId);
  };

  // Handle "Sign In" from conversion prompt
  const handleSignIn = () => {
    setShowConversionPrompt(false);
    setShowAuthModal(true);
  };

  // Handle "Continue as Guest" from conversion prompt
  const handleContinueAsGuest = async () => {
    setShowConversionPrompt(false);
    await doCreateResume();
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // User can now click the button again (they're authenticated)
  };

  // Early returns AFTER all hooks
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !data || !slug) {
    return <NotFound slug={slug || 'unknown'} />;
  }

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
      <RevealSection>
        <section className="my-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Resume Preview */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-premium border border-black/[0.06] overflow-hidden">
                <div className="bg-chalk px-6 py-4 border-b border-black/[0.06] flex items-center justify-between">
                  <h2 className="font-bold text-ink">Resume Preview</h2>
                  <span className="text-sm text-mist">
                    Template: {data.resume.template.charAt(0).toUpperCase() + data.resume.template.slice(1)}
                  </span>
                </div>

                {/* Real Template Preview Image */}
                <div className="p-4 lg:p-6 bg-white flex justify-center">
                  <img
                    src={`${PREVIEW_BASE_URL}/${slug}.webp`}
                    srcSet={`${PREVIEW_BASE_URL}/${slug}-sm.webp 400w, ${PREVIEW_BASE_URL}/${slug}.webp 800w`}
                    sizes="(max-width: 768px) 400px, 550px"
                    alt={`${data.meta.title} resume example - professional ATS-friendly template`}
                    className="w-full max-w-[550px] rounded-lg shadow-lg border border-black/[0.06]"
                    width={800}
                    height={1131}
                    loading="eager"
                    fetchPriority="high"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/docs/templates/modern-no-icons.png';
                    }}
                  />
                </div>

                {/* Visible resume text for SEO keyword signals */}
                <div className="px-6 lg:px-8 pb-6 lg:pb-8 bg-white border-t border-black/[0.06] mt-2 pt-4">
                  <p className="text-ink/80 text-sm leading-relaxed mb-4">{data.resume.summary}</p>

                  {data.resume.experience.slice(0, 2).map((exp, index) => (
                    <div key={index} className="mb-3">
                      <p className="text-sm font-semibold text-ink">
                        {exp.title} — {exp.company}
                        <span className="font-normal text-mist ml-2">{exp.dates}</span>
                      </p>
                      <ul className="mt-1 space-y-0.5">
                        {exp.bullets.slice(0, 2).map((bullet, bIndex) => (
                          <li key={bIndex} className="text-ink/70 text-xs pl-3 relative">
                            <span className="absolute left-0 text-mist">&bull;</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="flex items-baseline gap-4 mb-2">
                    {data.resume.education.map((edu, index) => (
                      <p key={index} className="text-xs text-stone-warm">
                        {edu.degree} — {edu.school}
                      </p>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {data.resume.skills.slice(0, 8).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-chalk-dark text-ink text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {data.resume.skills.length > 8 && (
                      <span className="text-mist text-xs py-0.5">
                        +{data.resume.skills.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar with CTA */}
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-premium border border-black/[0.06] p-8 sticky top-24">
                <h3 className="text-xl font-extrabold text-ink mb-4">
                  Use This Template
                </h3>
                <p className="text-stone-warm font-extralight mb-6">
                  Click below to open this resume in our free editor. Customize the content with your own experience.
                </p>

                <button
                  onClick={handleEditTemplate}
                  disabled={creating}
                  className="btn-primary w-full py-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    'Edit This Template'
                  )}
                </button>

                <Link
                  to="/templates"
                  className="btn-secondary w-full py-3 block text-center"
                >
                  Browse All Templates
                </Link>

                <div className="mt-6 pt-6 border-t border-black/[0.06]">
                  <h4 className="font-bold text-ink mb-3">What you get:</h4>
                  <ul className="space-y-2 text-sm text-stone-warm">
                    <li className="flex items-center gap-2">
                      <span className="text-accent">&#10003;</span>
                      ATS-optimized format
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">&#10003;</span>
                      Pre-written bullet points
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">&#10003;</span>
                      Professional layout
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">&#10003;</span>
                      Free PDF download
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Bullet Point Bank */}
      <BulletPointBank
        categories={data.bulletBank}
        jobTitle={data.meta.title}
      />

      {/* FAQs */}
      <FAQSection faqs={faqs} />

      {/* Related Jobs Section */}
      {relatedJobs.length > 0 && (
        <RevealSection stagger>
          <section className="my-16">
            <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">Related Examples</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-6 text-center">
              Related Resume Examples
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedJobs.map((job) => (
                <Link
                  key={job.slug}
                  to={`/examples/${job.slug}`}
                  className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="font-bold text-ink mb-2">{job.title}</h3>
                  <p className="text-sm text-stone-warm line-clamp-2">
                    {job.metaDescription}
                  </p>
                  <span className="inline-block mt-3 text-accent text-sm font-medium">
                    View Example &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </RevealSection>
      )}

      {/* CTA */}
      <DownloadCTA
        title={`Start Your ${data.meta.title} Resume`}
        description="Use our free builder to create a professional resume in minutes. No sign-up required."
        primaryText="Browse All Templates"
        primaryHref="/templates"
      />

      {/* Template Selection Modal */}
      <TemplateSelectionModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelect={handleTemplateSelect}
        initialTemplateId={data.resume.template}
      />

      {/* Conversion Prompt Modal (for anonymous users) */}
      <ConversionPromptModal
        isOpen={showConversionPrompt}
        onClose={() => setShowConversionPrompt(false)}
        onSignIn={handleSignIn}
        onContinueAsGuest={handleContinueAsGuest}
        actionLabel="use this template"
        loading={creating}
      />

      {/* Auth Modal (triggered from conversion prompt) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
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
