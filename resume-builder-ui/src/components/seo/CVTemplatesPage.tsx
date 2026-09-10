/**
 * CV Templates Main Page (UK/EU/AU/NZ Market)
 * URL: /cv-templates
 * Target keywords: "cv templates", "free cv templates uk", "professional cv template"
 *
 * This page targets users searching with "CV" terminology (UK, Europe, Australia, NZ)
 * while /templates targets "resume" terminology (US, Canada)
 */

import { Link } from 'react-router-dom';
import { Check, Minus } from 'lucide-react';
import SEOPageLayout from '../shared/SEOPageLayout';
import RevealSection from '../shared/RevealSection';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import Band from '../shared/Band';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import TemplateCarousel from '../TemplateCarousel';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';
import type { SEOConfig } from '../../types/seo';

const CV_COUNTRIES = [
  'United Kingdom',
  'Ireland',
  'Europe (most countries)',
  'Australia',
  'New Zealand',
  'South Africa',
];

const RESUME_COUNTRIES = ['United States', 'Canada'];

const DO_INCLUDE: [string, string][] = [
  ['Personal profile', '(3-4 lines summarising your experience)'],
  ['Contact details', '(phone, email, city/region)'],
  ['Work experience', 'with quantified achievements'],
  ['Education', 'and relevant qualifications'],
  ['Key skills', 'relevant to the role'],
];

const DO_NOT_INCLUDE: [string, string][] = [
  ['Photo', '(unless specifically requested)'],
  ['Date of birth', 'or age'],
  ['Marital status', ''],
  ['National insurance number', ''],
  ['"References available upon request"', ''],
];

const DATE_FORMATS = [
  '"January 2024 - Present"',
  '"Jan 2025 - Dec 2026"',
  '"2022 - 2024" (year only)',
];

const RELATED = [
  { to: '/cv-templates/ats-friendly', label: 'ATS-Friendly CV Templates' },
  { to: '/free-cv-builder-no-sign-up', label: 'Free CV Builder' },
  { to: '/blog/resume-vs-cv-difference', label: 'CV vs Resume: Full Guide' },
  { to: '/resume-keywords', label: 'CV Keywords by Industry' },
];

export default function CVTemplatesPage() {
  const config = SEO_PAGES.cvTemplates;

  // Add hreflang tags for international SEO
  const seoConfigWithHreflang: SEOConfig = {
    ...config.seo,
    hreflangLinks: [
      { hreflang: 'en-GB', href: 'https://easyfreeresume.com/cv-templates' },
      { hreflang: 'en-AU', href: 'https://easyfreeresume.com/cv-templates' },
      { hreflang: 'en-NZ', href: 'https://easyfreeresume.com/cv-templates' },
      { hreflang: 'en-US', href: 'https://easyfreeresume.com/templates' },
      { hreflang: 'x-default', href: 'https://easyfreeresume.com/templates' },
    ],
    ogLocale: 'en_GB',
  };

  const schemas = usePageSchema({
    type: 'itemList',
    faqs: config.faqs,
    items: [
      {
        name: 'Professional CV Template',
        url: '/templates',
        description: 'ATS-optimised CV template for UK and international applications',
      },
      {
        name: 'Modern CV Template',
        url: '/templates/modern-resume-templates',
        description: 'Contemporary CV design for modern professionals',
      },
    ],
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'CV Templates', href: '/cv-templates' },
    ],
  });

  return (
    <SEOPageLayout seoConfig={seoConfigWithHreflang} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Template Gallery Section */}
      <section id="template-gallery" className="py-12 -mx-4 sm:-mx-6 md:-mx-8">
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
            The gallery
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4">
            Browse CV Templates
          </h2>
          <p className="text-lg md:text-xl font-extralight text-ink/60 max-w-2xl mx-auto">
            Select a professional CV template that suits your industry.
            All designs are ATS-compatible and completely free.
          </p>
        </div>
        <TemplateCarousel showHeader={false} />
      </section>

      {/* CV vs Resume. The tinted accent panel this replaced was the largest
          soft-green surface on the page, spending the accent on a paragraph
          rather than on an action. Ink says "read this one" and spends none of
          the 10%. */}
      <Band tone="ink" reserve="cv-h-400">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">
              Terminology
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              CV or Resume? Which Term Should You Use?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-accent mb-5">
                Use "CV" (Curriculum Vitae)
              </h3>
              <ul className="border-t border-white/10">
                {CV_COUNTRIES.map((c) => (
                  <li
                    key={c}
                    className="py-2.5 border-b border-white/10 font-extralight text-white/60"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-accent mb-5">
                Use "Resume"
              </h3>
              <ul className="border-t border-white/10">
                {RESUME_COUNTRIES.map((c) => (
                  <li
                    key={c}
                    className="py-2.5 border-b border-white/10 font-extralight text-white/60"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-white/60 mt-5">
                Looking for US-style resumes?{' '}
                <Link
                  to="/templates"
                  className="text-accent font-medium underline underline-offset-4 decoration-accent/40 hover:decoration-accent"
                >
                  View Resume Templates
                </Link>
              </p>
            </div>
          </div>
          <p className="text-white/60 font-extralight mt-10 max-w-2xl leading-relaxed">
            The document format is essentially the same. Use whichever term is standard in your target country.
            Our templates work for both.
          </p>
        </div>
      </Band>

      {/* UK CV Format Guide */}
      <RevealSection variant="fade-up">
        <div className="my-16 cv-auto cv-h-500">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            UK conventions
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            UK CV Format Essentials
          </h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-black/[0.06] p-6 md:p-8">
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-accent-text mb-5">
                Do Include
              </h3>
              <ul className="space-y-3">
                {DO_INCLUDE.map(([term, rest]) => (
                  <li key={term} className="flex items-start gap-3 text-ink/60 font-extralight">
                    <Check
                      className="w-4 h-4 mt-1 flex-none text-accent-text"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-bold text-ink">{term}</strong> {rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-black/[0.06] p-6 md:p-8">
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-ink/60 mb-5">
                Do Not Include
              </h3>
              <ul className="space-y-3">
                {DO_NOT_INCLUDE.map(([term, rest]) => (
                  <li key={term} className="flex items-start gap-3 text-ink/60 font-extralight">
                    <Minus
                      className="w-4 h-4 mt-1 flex-none text-ink/40"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-bold text-ink">{term}</strong> {rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-center text-ink/60 font-extralight mt-8 max-w-2xl mx-auto leading-relaxed">
            UK equality laws discourage personal information that could lead to discrimination.
            Focus on your skills and experience instead.
          </p>
        </div>
      </RevealSection>

      {/* Length. One real measurement, so it is set as one: the numeral at
          display scale with a mono unit label, rather than boxed as a stat
          tile inside a lifted card. */}
      <RevealSection variant="fade-up">
        <div className="my-16 cv-auto cv-h-300">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-[auto_1fr] gap-8 sm:gap-12 items-center">
            <div className="text-center sm:text-left">
              <div className="font-display text-[6rem] leading-none font-extrabold tracking-tight text-ink tabular-nums">
                2
              </div>
              <div className="font-mono text-xs tracking-[0.15em] uppercase text-accent-text mt-2">
                Pages maximum
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-4">
                How Long Should a UK CV Be?
              </h2>
              <p className="text-ink/60 font-extralight leading-relaxed mb-2">
                <strong className="font-bold text-ink">Standard UK CV:</strong> 2 pages is the accepted length for most professional roles.
              </p>
              <p className="text-sm text-ink/60 font-extralight leading-relaxed">
                Exceptions: Academic CVs can be longer. Entry-level CVs may be 1 page.
                Senior executives with 15+ years experience may extend to 3 pages if needed.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Date format. Was an amber-50 panel with amber-900 headings — a fourth
          colour family introduced for one advisory block on a system that has
          one accent. Tone carries it instead. */}
      <Band tone="chalk-dark" reserve="cv-h-300">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
            Formatting
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-ink mb-10">
            UK Date Format for CVs
          </h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-ink/60 mb-4">
                Recommended Formats
              </h3>
              <ul className="border-t border-ink/10">
                {DATE_FORMATS.map((d) => (
                  <li key={d} className="py-2.5 border-b border-ink/10 font-mono text-sm text-ink">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-ink/60 mb-4">
                Important
              </h3>
              <p className="text-ink/60 font-extralight leading-relaxed">
                Be consistent throughout your CV. If you use abbreviated months in one place,
                use them everywhere. Our editor helps maintain consistency automatically.
              </p>
            </div>
          </div>
        </div>
      </Band>

      <FAQSection faqs={config.faqs} />

      {/* Related Pages */}
      <RevealSection variant="fade-up">
        <div className="my-16 cv-auto cv-h-200">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            Elsewhere
          </p>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            Explore More CV Resources
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {RELATED.map((r) => (
              <Link key={r.to} to={r.to} className="btn-secondary py-3 px-6">
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      <DownloadCTA
        title="Ready to Build Your Professional CV?"
        description="Choose a template above and create your CV in minutes. 100% free, no sign-up required."
        primaryText="Browse CV Templates"
        primaryHref="#template-gallery"
      />
    </SEOPageLayout>
  );
}
