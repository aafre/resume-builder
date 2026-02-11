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
import TemplateCarousel from '../TemplateCarousel';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

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
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4">
            Clean, Simple Templates
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-2xl mx-auto">
            Let your qualifications speak for themselves with our minimalist designs.
            No clutter, no distractions—just professional presentation.
          </p>
        </div>
        <TemplateCarousel showHeader={false} />
      </section>

      {/* Benefits of Minimalist Design */}
      <RevealSection variant="fade-up">
      <div className="my-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Why Recruiters Love Minimalist Resumes
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-chalk-dark rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ⏱️
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick to Scan</h3>
            <p className="text-stone-warm">
              Recruiters spend 6-7 seconds on initial resume screening. Clean layouts
              help them find key information instantly.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-chalk-dark rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🎯
            </div>
            <h3 className="text-xl font-semibold mb-2">Content First</h3>
            <p className="text-stone-warm">
              Without design distractions, your experience, skills, and achievements
              become the focal point.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-chalk-dark rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✅
            </div>
            <h3 className="text-xl font-semibold mb-2">ATS Perfect</h3>
            <p className="text-stone-warm">
              Simple formatting means ATS systems parse your resume flawlessly
              every single time.
            </p>
          </div>
        </div>
      </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Minimalist vs Complex Comparison */}
      <RevealSection variant="fade-up">
      <div className="my-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-display text-2xl font-bold text-ink mb-6 text-center">
            Minimalist vs. Complex Resume Designs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-premium border border-black/[0.06]">
              <thead>
                <tr className="bg-chalk-dark">
                  <th className="px-6 py-4 text-left font-bold text-ink">Aspect</th>
                  <th className="px-6 py-4 text-center font-bold text-accent">Minimalist</th>
                  <th className="px-6 py-4 text-center font-bold text-stone-warm">Complex/Graphic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                <tr>
                  <td className="px-6 py-4 font-medium text-ink">ATS Compatibility</td>
                  <td className="px-6 py-4 text-center text-accent">Excellent</td>
                  <td className="px-6 py-4 text-center text-red-600">Often fails</td>
                </tr>
                <tr className="bg-chalk-dark">
                  <td className="px-6 py-4 font-medium text-ink">Readability</td>
                  <td className="px-6 py-4 text-center text-accent">High</td>
                  <td className="px-6 py-4 text-center text-yellow-600">Variable</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-ink">Industry Versatility</td>
                  <td className="px-6 py-4 text-center text-accent">Universal</td>
                  <td className="px-6 py-4 text-center text-yellow-600">Limited</td>
                </tr>
                <tr className="bg-chalk-dark">
                  <td className="px-6 py-4 font-medium text-ink">Printing Quality</td>
                  <td className="px-6 py-4 text-center text-accent">Consistent</td>
                  <td className="px-6 py-4 text-center text-yellow-600">May vary</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      {/* Related Templates */}
      <RevealSection variant="fade-up">
      <div className="my-16">
        <h3 className="font-display text-2xl font-bold text-ink mb-6 text-center">
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
