/**
 * SEO-Rich Templates Page
 * URL: /templates
 * Target keywords: "free resume templates", "ats resume templates"
 */

import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
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
      <RevealSection variant="fade-up">
        <div className="my-16 cv-auto cv-h-400 text-center">
          <span className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4 block">
            Every template, free
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            Why Choose Our Free Resume Templates?
          </h2>
          <p className="text-lg md:text-xl font-extralight text-ink/60 max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16">
            Unlike other resume builders that charge for premium templates or add watermarks,
            EasyFreeResume offers all templates completely free. Every design has been tested
            for ATS compatibility and created by professional designers.
          </p>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* ATS Compatibility Section */}
      <RevealSection variant="fade-up" stagger>
        <div className="my-16">
          <div className="max-w-4xl mx-auto rounded-3xl border border-ink/10 bg-white overflow-clip">
            <div className="px-6 md:px-10 pt-10 pb-8 text-center">
              <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-4">
                ATS-Tested and Approved
              </h3>
              <p className="font-extralight text-ink/60 leading-relaxed max-w-2xl mx-auto">
                Our templates have been tested with major Applicant Tracking Systems to ensure
                your resume gets through automated screening and into human hands.
              </p>
            </div>
            {/* gap-px over an ink ground draws the hairlines, so the grid
                reflows from 4 columns to 2 without any border bookkeeping. */}
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/10 border-t border-ink/10">
              {['Workday', 'Taleo', 'iCIMS', 'Greenhouse'].map((ats) => (
                <li
                  key={ats}
                  className="flex flex-col items-center gap-2 px-4 py-6 bg-white"
                >
                  <CheckBadgeIcon className="w-5 h-5 text-accent-text" aria-hidden="true" />
                  <p className="font-semibold text-ink">{ats}</p>
                  <p className="font-mono text-xs tracking-[0.15em] uppercase text-ink/60">
                    Compatible
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </RevealSection>

      {/* How to Use Section with implicit HowTo schema */}
      <RevealSection variant="fade-up">
        <div className="my-16 cv-auto cv-h-400">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            How to Create Your Resume
          </h2>
          {/* The connector is the sequence: one rule behind the three steps,
              drawn left-to-right as the section scrolls into view. */}
          <ol className="relative max-w-4xl mx-auto grid md:grid-cols-3 gap-10 md:gap-8">
            <span
              aria-hidden="true"
              className="steps-rule hidden md:block absolute left-[16.666%] right-[16.666%] top-8 h-px bg-ink/15 origin-left"
            />
            {[
              {
                title: 'Choose a Template',
                body: 'Browse our collection and select the design that fits your industry and style.',
              },
              {
                title: 'Fill In Your Details',
                body: 'Add your experience, education, and skills using our intuitive editor.',
              },
              {
                title: 'Download Instantly',
                body: 'Export your professional resume as PDF. No watermarks, no sign-up required.',
              },
            ].map((step, i) => (
              <li key={step.title} className="relative text-center">
                <span className="relative z-10 w-16 h-16 bg-accent text-ink rounded-full flex items-center justify-center font-mono text-lg font-medium mx-auto mb-6 ring-8 ring-chalk">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-xl font-extrabold tracking-tight text-ink mb-2">
                  {step.title}
                </h3>
                <p className="font-extralight text-ink/60 leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </RevealSection>

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
