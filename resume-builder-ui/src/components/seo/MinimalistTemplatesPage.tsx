/**
 * Minimalist Resume Templates Page
 * URL: /templates/minimalist-resume-templates
 * Target keywords: "minimalist resume template", "simple resume template"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Clean, Simple Templates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let your qualifications speak for themselves with our minimalist designs.
            No clutter, no distractions—just professional presentation.
          </p>
        </div>
        <TemplateCarousel />
      </section>

      {/* Benefits of Minimalist Design */}
      <div className="my-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Why Recruiters Love Minimalist Resumes
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ⏱️
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick to Scan</h3>
            <p className="text-gray-600">
              Recruiters spend 6-7 seconds on initial resume screening. Clean layouts
              help them find key information instantly.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🎯
            </div>
            <h3 className="text-xl font-semibold mb-2">Content First</h3>
            <p className="text-gray-600">
              Without design distractions, your experience, skills, and achievements
              become the focal point.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✅
            </div>
            <h3 className="text-xl font-semibold mb-2">ATS Perfect</h3>
            <p className="text-gray-600">
              Simple formatting means ATS systems parse your resume flawlessly
              every single time.
            </p>
          </div>
        </div>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Minimalist vs Complex Comparison */}
      <div className="my-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Minimalist vs. Complex Resume Designs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-xl shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Aspect</th>
                  <th className="px-6 py-4 text-center font-bold text-green-600">Minimalist</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-600">Complex/Graphic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">ATS Compatibility</td>
                  <td className="px-6 py-4 text-center text-green-600">Excellent</td>
                  <td className="px-6 py-4 text-center text-red-600">Often fails</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Readability</td>
                  <td className="px-6 py-4 text-center text-green-600">High</td>
                  <td className="px-6 py-4 text-center text-yellow-600">Variable</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Industry Versatility</td>
                  <td className="px-6 py-4 text-center text-green-600">Universal</td>
                  <td className="px-6 py-4 text-center text-yellow-600">Limited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Printing Quality</td>
                  <td className="px-6 py-4 text-center text-green-600">Consistent</td>
                  <td className="px-6 py-4 text-center text-yellow-600">May vary</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      {/* Related Templates */}
      <div className="my-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Explore Other Template Styles
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/templates/modern-resume-templates"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Modern Templates
          </Link>
          <Link
            to="/templates/resume-templates-for-students"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Student Templates
          </Link>
          <Link
            to="/templates/ats-friendly"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ATS-Friendly Templates
          </Link>
        </div>
      </div>

      <DownloadCTA
        title="Ready for a Clean, Professional Resume?"
        description="Choose a minimalist template and let your qualifications speak for themselves. Free forever."
        primaryText="Browse Templates"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
