/**
 * Actual Free Resume Builder Page
 * URL: /actual-free-resume-builder
 * Target keyword: "actual free resume builder"
 */

import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import ProofSection from '../shared/ProofSection';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function ActualFreeResumeBuilder() {
  const config = SEO_PAGES.actualFree;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {config.metrics && <ProofSection metrics={config.metrics} />}

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          What "actual free" means: no paywall, no watermark, no trials
        </h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto text-center leading-relaxed mb-12">
          Unlike other resume builders that advertise as "free" but lock features behind paywalls,
          EasyFreeResume is completely free forever. No trial periods, no credit card required,
          no watermarks on your downloads. Every feature is accessible to everyone, always.
        </p>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Start Building Your Free Resume"
        description="No credit card, no watermark, no catch. Just a professional resume in minutes."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
