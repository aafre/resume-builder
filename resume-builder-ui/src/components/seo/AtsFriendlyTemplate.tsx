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
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

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

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Download the free ATS-friendly template
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Template preview placeholder */}
            <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📄</div>
                <div className="text-xl font-bold text-gray-700">ATS-Friendly Template</div>
                <div className="text-sm text-gray-500 mt-2">Preview</div>
              </div>
            </div>

            {/* Template info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Template Specifications</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span><strong>Font:</strong> Calibri 11pt (easily parseable)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span><strong>Layout:</strong> Single-column design</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span><strong>Margins:</strong> 1-inch on all sides</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span><strong>Size:</strong> US Letter (8.5" x 11")</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span><strong>Sections:</strong> Summary, Experience, Education, Skills</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span><strong>Formats:</strong> DOCX, PDF available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          How to use this template
        </h2>
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
          <ol className="space-y-4 text-gray-800">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">1</span>
              <div>
                <strong>Click "Use This Template"</strong> to open the editor with this template pre-loaded.
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">2</span>
              <div>
                <strong>Fill in your information</strong> in each section. Use the provided examples as guidance.
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">3</span>
              <div>
                <strong>Customize as needed</strong> - adjust sections, reorder items, but maintain the clean formatting.
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">4</span>
              <div>
                <strong>Download as DOCX or PDF</strong> when complete. DOCX is recommended for ATS compatibility.
              </div>
            </li>
          </ol>
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Get the ATS-Friendly Template"
        description="Start using our most popular template to create your professional resume."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
