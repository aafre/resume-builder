/**
 * SEO-Rich Templates Page
 * URL: /templates
 * Target keywords: "free resume templates", "ats resume templates"
 */

import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import TemplateCarousel from '../TemplateCarousel';
import { InContentAd, AD_CONFIG } from '../ads';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function TemplatesPage() {
  const config = SEO_PAGES.templates;
  const schemas = usePageSchema({
    type: 'itemList',
    faqs: config.faqs,
    items: [
      { name: 'Modern Resume Template', url: '/templates/modern', description: 'Clean, contemporary design perfect for tech and creative industries' },
      { name: 'ATS-Friendly Resume Template', url: '/templates/ats-friendly', description: 'Optimized for Applicant Tracking Systems with clean formatting' },
      { name: 'Professional Resume Template', url: '/templates/professional', description: 'Classic layout ideal for finance, law, and corporate roles' },
    ],
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Template Gallery Section - Embedded TemplateCarousel */}
      <section id="template-gallery" className="py-8 -mx-4 sm:-mx-6 md:-mx-8">
        <TemplateCarousel showHeader={false} />
      </section>

      <InContentAd adSlot={AD_CONFIG.slots.templatesIncontent} marginY={32} />

      {/* Why Our Templates Section */}
      <div className="my-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Why Choose Our Free Resume Templates?
        </h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto text-center leading-relaxed mb-12">
          Unlike other resume builders that charge for premium templates or add watermarks,
          EasyFreeResume offers all templates completely free. Every design has been tested
          for ATS compatibility and created by professional designers.
        </p>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      {/* ATS Compatibility Section */}
      <div className="my-16">
        <div className="max-w-5xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
            ATS-Tested and Approved
          </h3>
          <p className="text-blue-800 leading-relaxed mb-6 text-center">
            Our templates have been tested with major Applicant Tracking Systems to ensure
            your resume gets through automated screening and into human hands.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-blue-900">Workday</p>
              <p className="text-green-600 text-sm">✓ Compatible</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-blue-900">Taleo</p>
              <p className="text-green-600 text-sm">✓ Compatible</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-blue-900">iCIMS</p>
              <p className="text-green-600 text-sm">✓ Compatible</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-blue-900">Greenhouse</p>
              <p className="text-green-600 text-sm">✓ Compatible</p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use Section with implicit HowTo schema */}
      <div className="my-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          How to Create Your Resume
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose a Template</h3>
            <p className="text-gray-600">
              Browse our collection and select the design that fits your industry and style.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Fill In Your Details</h3>
            <p className="text-gray-600">
              Add your experience, education, and skills using our intuitive editor.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Download Instantly</h3>
            <p className="text-gray-600">
              Export your professional resume as PDF. No watermarks, no sign-up required.
            </p>
          </div>
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Ready to Build Your Resume?"
        description="Pick a template above and start building your professional resume in minutes. It's completely free."
        primaryText="Back to Templates"
        primaryHref="#template-gallery"
      />
    </SEOPageLayout>
  );
}
