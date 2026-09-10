/**
 * CV Templates Hub Page (UK Market)
 * URL: /cv-templates/ats-friendly
 * Target keyword: "ats friendly cv templates", "free cv templates uk"
 */

import { Link } from 'react-router-dom';
import { Check, Minus } from 'lucide-react';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import Band from '../shared/Band';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

const ATS_RULES: [string, string][] = [
  ['Standard fonts', 'like Arial, Calibri, or Times New Roman'],
  ['Clear section headers', '(Personal Profile, Experience, Education, Skills)'],
  ['Simple formatting', 'without complex tables or graphics'],
  ['Standard bullet points', '(avoid special characters)'],
  ['Reverse chronological order', '(most recent experience first)'],
];

const INCLUDE = [
  'Personal profile/summary (3-4 lines)',
  'Contact details (phone, email, location)',
  'Work experience with achievements',
  'Education and qualifications',
  'Relevant skills and competencies',
];

const AVOID = [
  'Photo (unless specifically requested)',
  'Date of birth or age',
  'Marital status',
  'National insurance number',
  '"References available upon request"',
];

export default function CVTemplatesHub() {
  const config = SEO_PAGES.cvTemplatesHub;
  const schemas = usePageSchema({
    type: 'itemList',
    items: [
      {
        name: 'ATS-Friendly CV Template',
        url: '/templates/ats-friendly',
        description: 'Professional CV template optimized for Applicant Tracking Systems',
      },
    ],
    faqs: config.faqs,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'CV Templates', href: '/cv-templates/ats-friendly' },
    ],
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      <RevealSection variant="fade-up">
        <div className="mb-16">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            The rules
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            What makes a CV ATS-friendly
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl font-extralight text-ink/60 mb-10 leading-relaxed">
              Applicant Tracking Systems (ATS) scan CVs for specific formatting and content.
              An ATS-friendly template uses:
            </p>
            <ol className="border-t border-ink/10">
              {ATS_RULES.map(([term, rest], i) => (
                <li
                  key={term}
                  className="flex items-baseline gap-5 py-5 border-b border-ink/10"
                >
                  <span className="font-mono text-xs text-accent-text tabular-nums flex-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-extralight text-ink/60 leading-relaxed">
                    <strong className="font-bold text-ink">{term}</strong> {rest}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </RevealSection>

      {/* UK CV format essentials.
          Include and Avoid are separated by ground and by mark, not by a
          coloured 4px border-left: the red rule was the loudest thing in the
          section and it was decorating a list of ordinary omissions. */}
      <Band tone="chalk-dark" reserve="cv-h-400">
        <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
          UK conventions
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
          UK CV format essentials
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6 md:p-8">
            <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-accent-text mb-5">
              Include
            </h3>
            <ul className="space-y-3">
              {INCLUDE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink/60 font-extralight">
                  <Check
                    className="w-4 h-4 mt-1 flex-none text-accent-text"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6 md:p-8">
            <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-ink/60 mb-5">
              Avoid
            </h3>
            <ul className="space-y-3">
              {AVOID.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink/60 font-extralight">
                  <Minus
                    className="w-4 h-4 mt-1 flex-none text-ink/40"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      {config.features && <FeatureGrid features={config.features} />}

      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-500">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            Ready to use
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            Free ATS-friendly CV templates
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/templates/ats-friendly"
              className="bg-white rounded-2xl p-6 card-gradient-border spot-card shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[8.5/11] rounded-xl mb-4 overflow-clip border border-black/[0.06]">
                <img
                  src="/docs/templates/modern-no-icons.png"
                  alt="ATS-friendly CV template preview"
                  className="w-full h-full object-contain bg-chalk-dark p-2"
                  width={400}
                  height={566}
                  loading="lazy"
                />
              </div>
              <h3 className="font-display text-lg font-bold text-ink mb-2">
                Professional ATS CV Template
              </h3>
              <p className="text-ink/60 text-sm mb-3">
                Clean, modern design that passes all ATS systems. Perfect for UK and international applications.
              </p>
              <div className="text-accent-text font-semibold text-sm">
                View Template <span aria-hidden="true">&rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* CV vs Resume callout. An accent-tinted panel was a large soft green
          surface against a 10% ceiling; it is an ink block instead, which is
          the system's way of saying "read this one". */}
      <Band tone="ink" reserve="cv-h-300">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">
            Terminology
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6">
            CV or Resume? Which term should I use?
          </h2>
          <p className="text-lg font-extralight text-white/60 leading-relaxed mb-4">
            In the <strong className="font-medium text-white">UK, Europe, Australia, and New Zealand</strong>, "CV" (curriculum vitae) is the standard term.
            In the <strong className="font-medium text-white">US and Canada</strong>, "resume" is more common.
          </p>
          <p className="text-lg font-extralight text-white/60 leading-relaxed">
            Our templates work for both—the document format is the same. Use whichever term is standard in your target country.
          </p>
          <Link
            to="/blog/resume-vs-cv-difference"
            className="inline-flex items-center min-h-11 mt-6 text-accent font-semibold hover:text-white transition-colors"
          >
            Learn more: CV vs Resume differences <span aria-hidden="true" className="ml-2">&rarr;</span>
          </Link>
        </div>
      </Band>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Ready to Build Your ATS-Friendly CV?"
        description="Start with our optimized templates and create your professional CV today. No sign up required."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
