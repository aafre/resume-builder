/**
 * Job Example Page Component
 * Programmatic SEO page for individual job title resume examples
 * URL: /examples/:slug
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import BulletPointBank from '../shared/BulletPointBank';
import BreadcrumbsWithSchema from '../shared/BreadcrumbsWithSchema';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { loadJobExample, convertToEditorFormat } from '../../utils/yamlLoader';
import { getPrerenderPayload } from '../../utils/prerenderPayload';
import { getRelatedJobs, getJobExampleBySlug, JOB_CATEGORIES } from '../../data/jobExamples';
import { getMatchingKeywordSlug, getKeywordJobTitle } from '../../utils/crossLinkHelpers';
import { useAuth } from '../../contexts/AuthContext';
import { useResumeCreate } from '../../hooks/useResumeCreate';
import ConversionPromptModal from '../ConversionPromptModal';
import AuthModal from '../AuthModal';
import TemplateSelectionModal from '../TemplateSelectionModal';
import type { JobExampleData } from '../../data/jobExamples/types';
import type { FAQConfig } from '../../types/seo';
import type { Section } from '../../types';

// Supabase Storage CDN base URL for pre-generated resume preview images
const PREVIEW_BASE_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/template-previews`
  : '';

/**
 * Hydration payload.
 *
 * The page's whole body comes from `fetch('/examples/<slug>.yml')`, which cannot
 * resolve before the first client render. These routes are prerendered, so the
 * resume is already painted in the HTML — and without a synchronous seed React's
 * first client render is the loading skeleton, which wipes that painted resume
 * until the fetch lands (~1s of blank on the cluster carrying the site's third
 * highest impression count).
 *
 * So the page emits its own resolved data as a JSON script tag. The prerenderer
 * captures it like any other DOM, and the entry bundle snapshots it before React
 * hydrates — it cannot be read from here, because this route is `lazy()` and its
 * Suspense fallback has already replaced #root (tag included) by the time this
 * component first renders. See utils/prerenderPayload.ts.
 *
 * On a client-side navigation there is no snapshot for the slug and the fetch
 * path runs as before.
 */
const PAYLOAD_ID = 'job-example-data';

function readHydrationPayload(slug: string | undefined): JobExampleData | null {
  if (!slug) return null;
  const parsed = getPrerenderPayload<JobExampleData>(PAYLOAD_ID);
  // The snapshot is whichever example was prerendered into this document; a
  // client-side navigation to a different slug must not read it.
  return parsed?.meta?.slug === slug ? parsed : null;
}

// `</script>` inside the JSON would close the tag early. The data is our own, but
// an unescaped `<` in any resume field is still a script-injection shape.
const serializePayload = (data: JobExampleData) =>
  JSON.stringify(data).replace(/</g, '\\u003c');

/**
 * A section of the resume document: a mono label, then a hairline that spends
 * the remaining width. Heading level stays h4, matching what this page shipped
 * before, so the document does not start competing with the page's own H2s.
 */
const DocSection = ({
  label,
  className = '',
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <section className={className}>
    <div className="flex items-center gap-3 mb-3">
      <h4 className="font-mono text-[0.6875rem] tracking-[0.15em] uppercase text-ink whitespace-nowrap">
        {label}
      </h4>
      <span className="ex-rule flex-1" aria-hidden="true" />
    </div>
    {children}
  </section>
);

// A drawn mark rather than the ✓ character, which renders as a different glyph
// on every platform and carries no stroke weight of its own.
const CheckMark = () => (
  <svg
    viewBox="0 0 16 16"
    className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-accent-text"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 8.5 6.2 11.7 13 5" />
  </svg>
);

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
      <p className="text-ink/60 mb-6">
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
  // Seed from the prerendered payload so the first client render matches the
  // server HTML instead of replacing it with the skeleton. See PAYLOAD_ID above.
  const [data, setData] = useState<JobExampleData | null>(() => readHydrationPayload(slug));
  const [loading, setLoading] = useState(() => readHydrationPayload(slug) === null);
  const [error, setError] = useState(false);
  // Slug the initial render was already seeded for. Held in a ref rather than
  // re-read from the DOM in the effect: by the time effects run React owns that
  // script tag, so a second lookup is a race we do not need to be in.
  const seededSlug = useRef<string | null>(data ? slug ?? null : null);
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

    // Already seeded from the prerendered payload — the round trip would fetch
    // data we are currently rendering.
    if (seededSlug.current === slug) {
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
  const dbEntry = slug ? getJobExampleBySlug(slug) : undefined;
  const categoryInfo = data ? JOB_CATEGORIES.find(c => c.id === data.meta.category) : null;
  const faqs: FAQConfig[] = data?.customFaqs || (data ? generateFAQs(data) : []);
  const matchingKeywordSlug = slug ? getMatchingKeywordSlug(slug) : null;
  const matchingKeywordTitle = matchingKeywordSlug ? getKeywordJobTitle(matchingKeywordSlug) : null;

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
      '@type': 'ImageObject' as const,
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
      {/* Captured by the prerenderer; read back synchronously on hydration so the
          painted resume is never replaced by the skeleton. See PAYLOAD_ID above. */}
      <script
        type="application/json"
        id={PAYLOAD_ID}
        data-prerender-payload=""
        dangerouslySetInnerHTML={{ __html: serializePayload(data) }}
      />

      {/* Breadcrumbs */}
      <BreadcrumbsWithSchema
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Resume Examples', href: '/examples' },
          { label: categoryInfo?.title || 'Examples', href: `/examples?category=${data.meta.category}` },
          { label: data.meta.title, href: `/examples/${slug}` },
        ]}
      />

      {/* Masthead. Left-aligned and tightened so the sheet — the thing the
          visitor actually came for — clears the fold instead of sitting below
          a centred 72px headline and three stacked paragraphs. Every word of
          the old hero copy is still here. */}
      <header className="mb-10 md:mb-14">
        <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
          Resume Example{categoryInfo ? ` · ${categoryInfo.title}` : ''}
        </p>
        <h1 className="font-display text-[clamp(2rem,4.2vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-ink max-w-4xl">
          {heroConfig.h1}
        </h1>
        <p className="mt-5 text-lg md:text-xl font-extralight text-ink/60 leading-relaxed max-w-3xl">
          {heroConfig.subtitle}
        </p>
        <p className="mt-3 text-base font-extralight text-ink/60 leading-relaxed max-w-3xl">
          {heroConfig.description}
        </p>
        {(dbEntry?.careerOutlook || data.meta.careerOutlook) && (
          <p className="mt-3 text-base font-extralight text-ink/60 leading-relaxed max-w-3xl">
            {dbEntry?.careerOutlook || data.meta.careerOutlook}
          </p>
        )}
      </header>

      {/* The sheet and its action rail */}
      <RevealSection>
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* One document: the print, then the same resume readable and
              selectable, under a single paper edge. */}
          <article className="ex-sheet flex-1 min-w-0 w-full bg-white rounded-2xl shadow-premium border border-black/[0.06] overflow-clip">
            {/* How this resume actually comes out of the builder. The caption
                names the relationship between this and the text below it —
                without it the two read as the same thing shown twice. */}
            <figure className="bg-chalk-dark px-4 py-6 sm:px-8 sm:py-10">
              <img
                src={`${PREVIEW_BASE_URL}/${slug}.webp`}
                srcSet={`${PREVIEW_BASE_URL}/${slug}-sm.webp 400w, ${PREVIEW_BASE_URL}/${slug}.webp 800w`}
                sizes="(max-width: 768px) 400px, 550px"
                alt={`${data.meta.title} resume example - professional ATS-friendly template`}
                className="mx-auto w-full max-w-[560px] rounded-md shadow-lg border border-black/[0.06]"
                width={800}
                height={1131}
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.onerror = null;
                  img.src = '/docs/templates/modern-no-icons.png';
                }}
              />
              <figcaption className="mt-5 text-center font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-ink/60">
                As it prints &mdash; {data.resume.template.charAt(0).toUpperCase() + data.resume.template.slice(1)} template
              </figcaption>
            </figure>

            {/* The document itself — the full resume, every entry and every
                bullet, set as a document rather than as UI chrome. */}
            <div className="ex-doc px-6 sm:px-10 lg:px-14 py-10 lg:py-12">
              <header className="text-center pb-7 mb-7 border-b border-black/[0.06]">
                <h3 className="font-display text-[1.75rem] font-extrabold tracking-tight text-ink">
                  {data.resume.contact.name}
                </h3>
                <p className="mt-1 text-base text-accent-text">{data.resume.contact.title}</p>
                <p className="mt-3 font-mono text-[0.6875rem] tracking-[0.08em] text-ink/60">
                  {data.resume.contact.email} &middot; {data.resume.contact.phone} &middot; {data.resume.contact.location}
                </p>
              </header>

              <DocSection label="Professional Summary" className="mb-7">
                <p className="text-[0.9375rem] leading-relaxed text-ink/75 max-w-[68ch]">
                  {data.resume.summary}
                </p>
              </DocSection>

              <DocSection label="Work Experience" className="mb-7">
                <div className="space-y-5">
                  {data.resume.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <div>
                          <p className="font-semibold text-ink text-[0.9375rem]">{exp.title}</p>
                          <p className="text-sm text-ink/60">{exp.company}</p>
                        </div>
                        <p className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink/60">
                          {exp.dates}
                        </p>
                      </div>
                      <ul className="ex-doc__bullets mt-2.5 list-disc pl-5 space-y-1.5">
                        {exp.bullets.map((bullet, bIndex) => (
                          <li key={bIndex} className="text-[0.875rem] leading-relaxed text-ink/75 max-w-[68ch]">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </DocSection>

              <DocSection label="Education" className="mb-7">
                <div className="space-y-3">
                  {data.resume.education.map((edu, index) => (
                    <div key={index} className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <div>
                        <p className="font-semibold text-ink text-[0.9375rem]">{edu.degree}</p>
                        <p className="text-sm text-ink/60">{edu.school}</p>
                      </div>
                      <p className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink/60">
                        {edu.year}
                      </p>
                    </div>
                  ))}
                </div>
              </DocSection>

              {/* An inline list, not pill chips: a resume lists its skills, it
                  does not tag them. */}
              <DocSection
                label="Skills"
                className={data.resume.certifications?.length ? 'mb-7' : ''}
              >
                <p className="text-[0.9375rem] leading-relaxed text-ink/75">
                  {data.resume.skills.join(' · ')}
                </p>
              </DocSection>

              {data.resume.certifications && data.resume.certifications.length > 0 && (
                <DocSection label="Certifications">
                  <ul className="ex-doc__bullets list-disc pl-5 space-y-1.5">
                    {data.resume.certifications.map((cert, index) => (
                      <li key={index} className="text-[0.875rem] leading-relaxed text-ink/75">
                        {cert}
                      </li>
                    ))}
                  </ul>
                </DocSection>
              )}
            </div>
          </article>

          {/* Action rail */}
          <aside className="w-full lg:w-[19rem] lg:flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-premium border border-black/[0.06] p-7 lg:sticky lg:top-24">
              <h3 className="font-display text-xl font-extrabold text-ink">
                Use This Template
              </h3>
              <p className="mt-3 text-sm font-extralight text-ink/60 leading-relaxed">
                Click below to open this resume in our free editor. Customize the content with your own experience.
              </p>

              <button
                onClick={handleEditTemplate}
                disabled={creating}
                className="btn-primary w-full py-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ink"></div>
                    Creating...
                  </>
                ) : (
                  'Edit This Template'
                )}
              </button>

              <Link
                to="/templates"
                className="btn-secondary w-full py-3 mt-3 block text-center"
              >
                Browse All Templates
              </Link>

              <div className="mt-7 pt-6 border-t border-black/[0.06]">
                <h4 className="text-sm font-bold text-ink mb-3">What you get:</h4>
                <ul className="space-y-2.5 text-sm text-ink/60">
                  {[
                    'ATS-optimized format',
                    'Pre-written bullet points',
                    'Professional layout',
                    'Free PDF download',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckMark />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </section>
      </RevealSection>

      {/* Bullet Point Bank */}
      <BulletPointBank
        categories={data.bulletBank}
        jobTitle={data.meta.title}
      />

      {/* FAQs */}
      <FAQSection faqs={faqs} />

      {/* Cross-link to Keywords Page */}
      {matchingKeywordSlug && matchingKeywordTitle && (
        <RevealSection>
          <div className="bg-accent/[0.04] border border-accent/20 rounded-2xl p-6 my-12 max-w-4xl mx-auto cv-auto cv-h-200">
            <h2 className="text-xl font-bold text-ink mb-2">
              Optimize Your Resume With the Right Keywords
            </h2>
            <p className="text-ink/60 font-extralight mb-4">
              Pair this resume example with our curated list of ATS-optimized keywords for {matchingKeywordTitle.toLowerCase()} roles to maximize your interview chances.
            </p>
            <Link
              to={`/resume-keywords/${matchingKeywordSlug}`}
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              View {matchingKeywordTitle} Keywords &rarr;
            </Link>
          </div>
        </RevealSection>
      )}

      {/* Related Jobs Section */}
      {relatedJobs.length > 0 && (
        <RevealSection stagger>
          <section className="my-16 cv-auto cv-h-400">
            <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">Related Examples</span>
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
                  <p className="text-sm text-ink/60 line-clamp-2">
                    {job.metaDescription}
                  </p>
                  <span className="inline-block mt-3 text-accent-text text-sm font-medium">
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
