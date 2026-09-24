/**
 * Minimalist Resume Templates Page
 * URL: /templates/minimalist-resume-templates
 * Target keywords: "minimalist resume template", "simple resume template"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import RevealSection from '../shared/RevealSection';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import Band from '../shared/Band';
import TemplateCarousel from '../TemplateCarousel';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

const COMPARISON: [string, string, string][] = [
  ['ATS Compatibility', 'Excellent', 'Often fails'],
  ['Readability', 'High', 'Variable'],
  ['Industry Versatility', 'Universal', 'Limited'],
  ['Printing Quality', 'Consistent', 'May vary'],
];

export default function MinimalistTemplatesPage() {
  const config = SEO_PAGES.minimalistTemplates;
  const schemas = usePageSchema({
    type: 'itemList',
    faqs: config.faqs,
    items: [
      { name: 'Minimalist Professional Template', url: '/templates', description: 'Clean, simple design that puts content first' },
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
            Clean, Simple Templates
          </h2>
          <p className="text-lg md:text-xl font-extralight text-ink/60 max-w-2xl mx-auto">
            Let your qualifications speak for themselves with our minimalist designs.
            No clutter, no distractions—just professional presentation.
          </p>
        </div>
        <TemplateCarousel showHeader={false} />
      </section>

      {/* Benefits of Minimalist Design */}
      {/* Three reasons, set the way the page argues: a hairline between each
          and nothing else. The three emoji-in-a-disc badges this replaced were
          decoration on a page whose entire claim is that decoration costs you
          the interview — and emoji are not an icon system in any case. */}
      <RevealSection variant="fade-up">
        <div className="my-16">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            Three reasons
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            Why Recruiters Love Minimalist Resumes
          </h2>
          <ol className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 md:gap-8 md:divide-x md:divide-ink/10">
            {[
              {
                title: 'Quick to Scan',
                body: 'Recruiters spend 6-7 seconds on initial resume screening. Clean layouts help them find key information instantly.',
              },
              {
                title: 'Content First',
                body: 'Without design distractions, your experience, skills, and achievements become the focal point.',
              },
              {
                title: 'ATS Perfect',
                body: 'Simple formatting means ATS systems parse your resume flawlessly every single time.',
              },
            ].map((item, i) => (
              <li key={item.title} className={i > 0 ? 'md:pl-8' : ''}>
                <span className="font-mono text-xs tracking-[0.15em] text-accent-text tabular-nums block mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-xl font-extrabold tracking-tight text-ink mb-2">
                  {item.title}
                </h3>
                <p className="font-extralight text-ink/60 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Minimalist vs Complex Comparison */}
      {/* The comparison adopts the ink header the shared ComparisonTable now
          uses. The complex column's values were red and amber-600 — two more
          colour families, on a system with one accent, to colour words that
          already say "often fails". The tinted winning column carries the
          recommendation and the values are left unvalenced. */}
      <Band tone="chalk-dark" reserve="cv-h-500">
        <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
          Side by side
        </p>
        <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
          Minimalist vs. Complex Resume Designs
        </h3>
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full bg-white rounded-2xl border border-black/[0.06] overflow-clip">
            <thead className="bg-ink text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Aspect</th>
                <th className="px-6 py-4 text-center font-bold">Minimalist</th>
                <th className="px-6 py-4 text-center font-bold text-white/60">Complex/Graphic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {COMPARISON.map(([aspect, minimal, complex]) => (
                <tr key={aspect}>
                  <td className="px-6 py-4 font-medium text-ink">{aspect}</td>
                  <td className="px-6 py-4 text-center font-semibold text-ink bg-accent/[0.06]">
                    {minimal}
                  </td>
                  <td className="px-6 py-4 text-center text-ink/60">{complex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            to="/templates/modern-resume-templates"
            className="btn-secondary py-3 px-6"
          >
            Modern Templates
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
        title="Ready for a Clean, Professional Resume?"
        description="Choose a minimalist template and let your qualifications speak for themselves. Free forever."
        primaryText="Browse Templates"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
