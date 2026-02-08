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
import RevealSection from '../shared/RevealSection';
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

      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          What "actual free" means: no paywall, no watermark, no trials
        </h2>
        <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-12">
          Unlike other resume builders that advertise as "free" but lock features behind paywalls,
          EasyFreeResume is completely free forever. No trial periods, no credit card required,
          no watermarks on your downloads. Every feature is accessible to everyone, always.
        </p>
      </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Competitor Comparison Table */}
      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          "Free" resume builders: what they actually charge for
        </h2>
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full bg-white shadow-premium rounded-2xl overflow-hidden">
            <thead className="bg-ink text-white">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">Feature</th>
                <th className="px-4 py-4 text-center font-semibold text-accent">
                  EasyFreeResume
                </th>
                <th className="px-4 py-4 text-center font-semibold">
                  Typical "Free" Builders
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-4 py-4 font-medium text-ink">
                  PDF Download
                </td>
                <td className="px-4 py-4 text-center text-accent font-bold">
                  ✓ Free
                </td>
                <td className="px-4 py-4 text-center text-red-600">
                  $5-25 per download
                </td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">
                  DOCX Download
                </td>
                <td className="px-4 py-4 text-center text-accent font-bold">
                  ✓ Free
                </td>
                <td className="px-4 py-4 text-center text-red-600">
                  Premium only ($6-24/mo)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-ink">
                  No Watermark
                </td>
                <td className="px-4 py-4 text-center text-accent font-bold">
                  ✓ Always
                </td>
                <td className="px-4 py-4 text-center text-red-600">
                  Premium only
                </td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">
                  All Templates
                </td>
                <td className="px-4 py-4 text-center text-accent font-bold">
                  ✓ Access all
                </td>
                <td className="px-4 py-4 text-center text-red-600">
                  1-2 basic only
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-ink">
                  No Account Required
                </td>
                <td className="px-4 py-4 text-center text-accent font-bold">
                  ✓ Optional
                </td>
                <td className="px-4 py-4 text-center text-red-600">
                  Mandatory signup
                </td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">
                  Unlimited Downloads
                </td>
                <td className="px-4 py-4 text-center text-accent font-bold">
                  ✓ Yes
                </td>
                <td className="px-4 py-4 text-center text-red-600">
                  1-3 then pay
                </td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm text-mist mt-4 text-center">
            Comparison based on publicly available pricing from popular resume builders (Jan 2026)
          </p>
        </div>
      </div>
      </RevealSection>

      {/* Truth Page Positioning */}
      <RevealSection variant="fade-up">
      <div className="mb-16">
        <div className="max-w-4xl mx-auto bg-accent/[0.06] border border-accent/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-ink mb-4 text-center">
            Why we're transparent about being free
          </h3>
          <p className="text-ink leading-relaxed mb-4">
            We built EasyFreeResume because we were frustrated by "free" resume builders that weren't
            actually free. The dark patterns, the bait-and-switch, the surprise charges after you've
            spent 30 minutes building your resume—it's not right.
          </p>
          <p className="text-ink leading-relaxed mb-4">
            Our model is simple: we're funded by ethical advertising, not by tricking users into
            subscriptions. You get a professional resume, we get ad revenue. Everyone wins.
          </p>
          <p className="text-ink leading-relaxed font-medium">
            No hidden costs. No premium tiers. No "upgrade to unlock" buttons. Just a resume builder
            that does what it says.
          </p>
        </div>
      </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Start Building Your Free Resume"
        description="No credit card, no watermark, no catch. Just a professional resume in minutes."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
