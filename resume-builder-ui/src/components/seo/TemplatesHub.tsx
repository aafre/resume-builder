/**
 * Templates Hub Page
 * URL: /templates
 * Target keyword: "ats friendly resume templates"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function TemplatesHub() {
  const config = SEO_PAGES.templatesHub;
  const schemas = usePageSchema({
    type: 'itemList',
    items: [
      {
        name: 'ATS-Friendly Resume Template',
        url: '/templates/ats-friendly',
        description: 'Professional template optimized for Applicant Tracking Systems',
      },
    ],
    faqs: config.faqs,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'ATS Resume Templates', href: '/ats-resume-templates' },
    ],
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          What makes a resume ATS-friendly
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Applicant Tracking Systems (ATS) scan resumes for specific formatting and content.
            An ATS-friendly template uses:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3">✓</span>
              <span><strong>Standard fonts</strong> like Arial, Calibri, or Times New Roman</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3">✓</span>
              <span><strong>Clear section headers</strong> (Experience, Education, Skills)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3">✓</span>
              <span><strong>Simple formatting</strong> without complex tables or graphics</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3">✓</span>
              <span><strong>Standard bullet points</strong> (avoid special characters)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3">✓</span>
              <span><strong>Consistent date formats</strong> (e.g., "January 2024")</span>
            </li>
          </ul>
        </div>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Free ATS-friendly templates
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/templates/ats-friendly"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-blue-200 hover:border-blue-400"
          >
            <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 flex items-center justify-center border border-gray-200">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">📄</div>
                <div className="text-sm font-bold text-gray-700">ATS-Friendly</div>
                <div className="text-xs text-gray-500">Modern Template</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Professional ATS Template
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Clean, modern design that passes all ATS systems. Perfect for any industry.
            </p>
            <div className="text-blue-600 font-semibold text-sm">
              View Template →
            </div>
          </Link>
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Ready to Use an ATS-Friendly Template?"
        description="Start with our optimized templates and create your professional resume today."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
