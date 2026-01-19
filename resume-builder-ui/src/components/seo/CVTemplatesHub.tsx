/**
 * CV Templates Hub Page (UK Market)
 * URL: /cv-templates/ats-friendly
 * Target keyword: "ats friendly cv templates", "free cv templates uk"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

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

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          What makes a CV ATS-friendly
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Applicant Tracking Systems (ATS) scan CVs for specific formatting and content.
            An ATS-friendly template uses:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3" aria-hidden="true">&#10003;</span>
              <span><strong>Standard fonts</strong> like Arial, Calibri, or Times New Roman</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3" aria-hidden="true">&#10003;</span>
              <span><strong>Clear section headers</strong> (Personal Profile, Experience, Education, Skills)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3" aria-hidden="true">&#10003;</span>
              <span><strong>Simple formatting</strong> without complex tables or graphics</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3" aria-hidden="true">&#10003;</span>
              <span><strong>Standard bullet points</strong> (avoid special characters)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3" aria-hidden="true">&#10003;</span>
              <span><strong>Reverse chronological order</strong> (most recent experience first)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* UK CV Format Guide */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          UK CV format essentials
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">Include</h3>
            <ul className="space-y-2 text-green-700 list-disc pl-5">
              <li>Personal profile/summary (3-4 lines)</li>
              <li>Contact details (phone, email, location)</li>
              <li>Work experience with achievements</li>
              <li>Education and qualifications</li>
              <li>Relevant skills and competencies</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">Avoid</h3>
            <ul className="space-y-2 text-red-700 list-disc pl-5">
              <li>Photo (unless specifically requested)</li>
              <li>Date of birth or age</li>
              <li>Marital status</li>
              <li>National insurance number</li>
              <li>"References available upon request"</li>
            </ul>
          </div>
        </div>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Free ATS-friendly CV templates
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/templates/ats-friendly"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-blue-200 hover:border-blue-400"
          >
            <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 flex items-center justify-center border border-gray-200">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">&#128196;</div>
                <div className="text-sm font-bold text-gray-700">ATS-Friendly</div>
                <div className="text-xs text-gray-500">Professional CV</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Professional ATS CV Template
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Clean, modern design that passes all ATS systems. Perfect for UK and international applications.
            </p>
            <div className="text-blue-600 font-semibold text-sm">
              View Template &#8594;
            </div>
          </Link>
        </div>
      </div>

      {/* CV vs Resume Callout */}
      <div className="mb-16">
        <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            CV or Resume? Which term should I use?
          </h2>
          <p className="text-blue-800 mb-4">
            In the <strong>UK, Europe, Australia, and New Zealand</strong>, "CV" (curriculum vitae) is the standard term.
            In the <strong>US and Canada</strong>, "resume" is more common.
          </p>
          <p className="text-blue-700">
            Our templates work for both—the document format is the same. Use whichever term is standard in your target country.
          </p>
          <Link
            to="/blog/resume-vs-cv-difference"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold"
          >
            Learn more: CV vs Resume differences &#8594;
          </Link>
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Ready to Build Your ATS-Friendly CV?"
        description="Start with our optimized templates and create your professional CV today. No sign up required."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
