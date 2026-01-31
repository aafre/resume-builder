/**
 * Free Resume Builder No Sign Up Page
 * URL: /free-resume-builder-no-sign-up
 * Target keyword: "free resume builder no sign up"
 */

import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import StepByStep from '../shared/StepByStep';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import { InContentAd, AD_CONFIG } from '../ads';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function FreeResumeBuilderNoSignUp() {
  const config = SEO_PAGES.noSignUp;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* In-content Ad - Below hero */}
      <InContentAd adSlot={AD_CONFIG.slots.freepageIncontent} marginY={32} />

      {config.steps && <StepByStep steps={config.steps} />}

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Edit instantly: open the builder
        </h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto text-center leading-relaxed mb-8">
          Start building immediately. The editor opens in seconds with no barriers. No email
          verification, no password creation, no waiting. Just click and start creating your
          professional resume right now.
        </p>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Privacy-first mode: what is and isn't logged
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-4">✓ We DO NOT store:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Your resume content</li>
                <li>• Your personal information</li>
                <li>• Your email address</li>
                <li>• Your browsing history</li>
                <li>• Any identifying data</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-700 mb-4">✓ We only track:</h3>
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
        title="Build Your Resume Without Signing Up"
        description="No account required. Start creating your resume immediately."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
