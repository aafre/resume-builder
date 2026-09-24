/**
 * Modern Resume Templates Page
 * URL: /templates/modern-resume-templates
 * Target keywords: "modern resume template", "contemporary resume design"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import Band from '../shared/Band';
import TemplateCarousel from '../TemplateCarousel';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

const INDUSTRIES = [
  { name: 'Technology', note: 'Software, SaaS, IT' },
  { name: 'Startups', note: 'Early-stage companies' },
  { name: 'Marketing', note: 'Digital, content, growth' },
  { name: 'Design', note: 'UX, product, graphic' },
];

export default function ModernTemplatesPage() {
  const config = SEO_PAGES.modernTemplates;
  const schemas = usePageSchema({
    type: 'itemList',
    faqs: config.faqs,
    items: [
      { name: 'Modern Professional Template', url: '/templates', description: 'Clean, contemporary design for modern professionals' },
    ],
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Template Gallery Section */}
      <section className="py-12 -mx-4 sm:-mx-6 md:-mx-8">
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
            The gallery
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4">
            Browse Modern Templates
          </h2>
          <p className="text-lg md:text-xl font-extralight text-ink/60 max-w-2xl mx-auto">
            Select a modern template that matches your professional style.
            All designs are ATS-optimized and completely free.
          </p>
        </div>
        <TemplateCarousel showHeader={false} />
      </section>

      {/* What Makes Modern Templates Different */}
      <RevealSection variant="fade-up" stagger>
        <div className="my-16">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            Four traits
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            What Makes a Modern Resume Stand Out?
          </h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 card-gradient-border spot-card shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-display text-xl font-bold text-ink mb-3">Clean Typography</h3>
              <p className="text-ink/60">
                Modern templates use contemporary sans-serif fonts with clear hierarchy.
                Headers stand out, body text is readable, and the overall effect is polished
                and professional.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 card-gradient-border spot-card shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-display text-xl font-bold text-ink mb-3">Strategic White Space</h3>
              <p className="text-ink/60">
                Generous margins and spacing between sections create visual breathing room.
                This makes your resume easier to scan and more pleasant to read.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 card-gradient-border spot-card shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-display text-xl font-bold text-ink mb-3">Subtle Color Accents</h3>
              <p className="text-ink/60">
                Modern designs often incorporate a single accent color for headers or dividers.
                This adds personality without overwhelming the content.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 card-gradient-border spot-card shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-display text-xl font-bold text-ink mb-3">Flexible Layouts</h3>
              <p className="text-ink/60">
                Whether you have extensive experience or are just starting out, modern
                templates adapt to showcase your unique qualifications effectively.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection variant="fade-up">
        {config.features && <FeatureGrid features={config.features} />}
      </RevealSection>

      {/* Industries. Was a tinted accent panel holding four white cards —
          cards inside a card, and the page's largest green surface spent on a
          list of four industry names. It is a filed index on its own band. */}
      <Band tone="chalk-dark" reserve="cv-h-300">
        <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
          Best fit
        </p>
        <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
          Best Industries for Modern Resume Templates
        </h3>
        <ul className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/10 border border-ink/10 rounded-2xl overflow-clip">
          {INDUSTRIES.map((ind) => (
            <li key={ind.name} className="bg-chalk-dark px-4 py-6 text-center">
              <p className="font-display font-bold text-ink">{ind.name}</p>
              <p className="text-ink/60 text-sm mt-1">{ind.note}</p>
            </li>
          ))}
        </ul>
      </Band>

      <FAQSection faqs={config.faqs} />

      {/* Related Templates */}
      <RevealSection variant="fade-up">
        <div className="my-16 cv-auto cv-h-200">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            Elsewhere
          </p>
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            Explore Other Template Styles
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/templates/minimalist-resume-templates"
              className="btn-secondary py-3 px-6"
            >
              Minimalist Templates
            </Link>
            <Link
              to="/templates/resume-templates-for-students"
              className="btn-secondary py-3 px-6"
            >
              Student Templates
            </Link>
            <Link
              to="/templates/ats-friendly"
              className="btn-secondary py-3 px-6"
            >
              ATS-Friendly Templates
            </Link>
          </div>
        </div>
      </RevealSection>

      <DownloadCTA
        title="Ready to Build Your Modern Resume?"
        description="Choose a template above and start building your professional resume in minutes. Completely free."
        primaryText="Browse Templates"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
