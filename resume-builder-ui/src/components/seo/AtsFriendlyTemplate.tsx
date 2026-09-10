/**
 * ATS-Friendly Template Page
 * URL: /templates/ats-friendly
 * Target keyword: "ats friendly resume template"
 */

import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import BreadcrumbsWithSchema from '../shared/BreadcrumbsWithSchema';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import Band from '../shared/Band';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

/* A spec sheet is a table of values, so it is set as one. The previous version
   ran six rows of a Unicode ✓ against a bold label — a tick repeated six times
   carries no information, and the glyph rendered in whatever font caught it. */
const SPECS: [string, string][] = [
  ['Font', 'Calibri 11pt (easily parseable)'],
  ['Layout', 'Single-column design'],
  ['Margins', '1-inch on all sides'],
  ['Size', 'US Letter (8.5" x 11")'],
  ['Sections', 'Summary, Experience, Education, Skills'],
  ['Formats', 'DOCX, PDF available'],
];

const STEPS: [string, string][] = [
  ['Click "Use This Template"', 'to open the editor with this template pre-loaded.'],
  ['Fill in your information', 'in each section. Use the provided examples as guidance.'],
  ['Customize as needed', '- adjust sections, reorder items, but maintain the clean formatting.'],
  ['Download as DOCX or PDF', 'when complete. DOCX is recommended for ATS compatibility.'],
];

export default function AtsFriendlyTemplate() {
  const config = SEO_PAGES.atsFriendly;
  const schemas = usePageSchema({
    type: 'creativeWork',
    name: 'Free ATS-Friendly Resume Template',
    description: 'Professional resume template optimized for Applicant Tracking Systems',
    url: '/templates/ats-friendly',
    faqs: config.faqs,
    breadcrumbs: config.breadcrumbs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      {config.breadcrumbs && <BreadcrumbsWithSchema breadcrumbs={config.breadcrumbs} />}

      <PageHero config={config.hero} />

      {/* The template itself, given the room a single artifact deserves: the
          sheet is the argument on this page, so it is not boxed inside a card
          alongside its own spec list. */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            The template
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            Download the free ATS-friendly template
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="aspect-[8.5/11] rounded-2xl bg-white border border-black/[0.06] shadow-premium overflow-clip">
              <img
                src="/docs/templates/modern-no-icons.png"
                alt="ATS-friendly resume template preview - clean professional format"
                className="w-full h-full object-contain p-3"
                width={400}
                height={566}
                loading="eager"
              />
            </div>

            <div>
              <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-6">
                Template Specifications
              </h3>
              <dl className="border-t border-ink/10">
                {SPECS.map(([term, value]) => (
                  <div
                    key={term}
                    className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5 border-b border-ink/10"
                  >
                    <dt className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink/60 pt-1">
                      {term}
                    </dt>
                    <dd className="text-ink font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      <Band tone="chalk-dark" reserve="cv-h-400">
        <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
          Four steps
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
          How to use this template
        </h2>
        <ol className="max-w-3xl mx-auto border-t border-ink/10">
          {STEPS.map(([lead, rest], i) => (
            <li
              key={lead}
              className="grid grid-cols-[auto_1fr] gap-5 sm:gap-8 py-5 border-b border-ink/10"
            >
              <span className="font-mono text-sm text-accent-text tabular-nums pt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="font-extralight text-ink/60 leading-relaxed">
                <strong className="font-bold text-ink">{lead}</strong> {rest}
              </p>
            </li>
          ))}
        </ol>
      </Band>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Get the ATS-Friendly Template"
        description="Start using our most popular template to create your professional resume."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
