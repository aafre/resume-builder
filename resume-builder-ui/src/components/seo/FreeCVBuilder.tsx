/**
 * Free CV Builder Page (UK Market)
 * URL: /free-cv-builder-no-sign-up
 * Target keyword: "free cv builder", "cv maker no sign up"
 */

import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import StepByStep from '../shared/StepByStep';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function FreeCVBuilder() {
  const config = SEO_PAGES.cvBuilder;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {config.steps && <StepByStep steps={config.steps} />}

      {/* UK-specific content */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          CV vs Resume: which one do I need?
        </h2>
        <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-4">Use a CV if you're in:</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• United Kingdom</li>
                <li>• Europe (most countries)</li>
                <li>• Australia & New Zealand</li>
                <li>• South Africa</li>
                <li>• Academic/research positions (worldwide)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Use a Resume if you're in:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• United States</li>
                <li>• Canada</li>
                <li>• Corporate roles (US companies)</li>
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                Our templates work for both—the format is the same; only the terminology differs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Build your CV instantly—no sign-up required
        </h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto text-center leading-relaxed mb-8">
          Start building immediately. The editor opens in seconds with no barriers. No email
          verification, no password creation, no waiting. Just click and start creating your
          professional CV right now.
        </p>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      {/* UK employer considerations */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          What UK employers expect in a CV
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              2 pages maximum
            </h3>
            <p className="text-gray-700">
              Unlike academic CVs, a job application CV in the UK should be concise. Stick to 2 pages
              unless you have 15+ years of experience or are in academia.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Personal profile/summary at the top
            </h3>
            <p className="text-gray-700">
              UK CVs typically start with a brief personal statement (3-4 lines) summarizing your
              experience and career goals. This is expected by most UK employers.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No photo (unless requested)
            </h3>
            <p className="text-gray-700">
              Unlike some European countries, UK CVs typically don't include a photo. Only add one
              if specifically requested in the job posting.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Reverse chronological order
            </h3>
            <p className="text-gray-700">
              List your most recent experience first. UK recruiters scan CVs quickly and want to
              see your current/recent role at the top.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Privacy-first: what we store (and don't)
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-4">We DO NOT store:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Your CV content</li>
                <li>• Your personal information</li>
                <li>• Your email address</li>
                <li>• Your browsing history</li>
                <li>• Any identifying data</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-700 mb-4">We only track:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Anonymous page views (for analytics)</li>
                <li>• Error reports (to fix bugs)</li>
                <li>• Nothing that identifies you personally</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Build Your CV Without Signing Up"
        description="No account required. Start creating your professional CV immediately."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
