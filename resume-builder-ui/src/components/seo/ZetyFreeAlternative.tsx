/**
 * Zety Free Alternative Page
 * URL: /zety-free-alternative
 * Target keyword: "zety free alternative"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import StepByStep from '../shared/StepByStep';
import FeatureGrid from '../shared/FeatureGrid';
import ComparisonTable from '../shared/ComparisonTable';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function ZetyFreeAlternative() {
  const config = SEO_PAGES.zetyAlternative;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Switch in 3 minutes */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Switch from Zety in 3 Minutes
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-10">
            Already spent time building a resume on Zety? Do not pay their download fee. Here is how to switch:
          </p>
          {config.steps && <StepByStep steps={config.steps} />}
        </div>
      </RevealSection>

      {/* Comparison Table */}
      {config.comparison && (
        <RevealSection variant="fade-up">
          <ComparisonTable
            items={config.comparison}
            headers={[
              'Price',
              'PDF Download',
              'Sign-Up Required',
              'Credit Card Required',
              'All Templates Free',
              'No Watermarks',
              'Auto-Subscription',
              'ATS-Optimized',
            ]}
            title="EasyFreeResume vs Zety — Feature Comparison"
          />
        </RevealSection>
      )}

      {/* Everything Zety charges for */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Everything Zety Charges For — Free Here
          </h2>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
            <ul className="space-y-4">
              {[
                { zety: 'PDF Download: $2.70-$24.70', efr: 'Free PDF download, always' },
                { zety: 'Premium Templates: Paid plan only', efr: 'All templates free, no locks' },
                { zety: 'Watermark-Free: Paid plan only', efr: 'No watermarks on any download' },
                { zety: 'Multiple Resumes: Limited on free', efr: 'Unlimited resumes and downloads' },
                { zety: 'Cover Letter Builder: Paid plan', efr: 'Focus on resume quality, free' },
                { zety: 'Account Required: Yes, email + password', efr: 'No account, no sign-up needed' },
              ].map((item) => (
                <li key={item.zety} className="grid md:grid-cols-2 gap-3 py-3 border-b border-black/[0.04] last:border-0">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 font-bold mt-0.5">✗</span>
                    <span className="text-stone-warm font-extralight text-sm">{item.zety}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent font-bold mt-0.5">✓</span>
                    <span className="text-stone-warm font-extralight text-sm">{item.efr}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* What Zety users say */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            What Zety Users Say
          </h2>
          <p className="text-lg font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-8">
            These are common frustrations from Zety users that led them to seek alternatives:
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              '"I spent 45 minutes making my resume perfect, then found out I had to pay $24.70 to download it."',
              '"The $2.70 trial auto-renewed and I was charged $24.70. Took weeks to get a refund."',
              '"They let you do everything for free EXCEPT download. It feels like a bait-and-switch."',
              '"I just needed a simple PDF. Should not have to pay monthly for that."',
            ].map((quote) => (
              <div key={quote} className="bg-chalk-dark rounded-2xl p-6 border border-black/[0.04]">
                <p className="text-stone-warm font-extralight italic leading-relaxed">{quote}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-stone-warm font-extralight">
            Read our detailed{' '}
            <Link to="/blog/zety-vs-easy-free-resume" className="text-accent hover:underline">
              Zety vs EasyFreeResume comparison
            </Link>{' '}
            for a thorough, factual breakdown.
          </p>
        </div>
      </RevealSection>

      {/* Internal links */}
      <RevealSection variant="fade-up">
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            Related Resources
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Free Download', href: '/free-resume-builder-download' },
              { label: 'No Payment Builder', href: '/free-resume-builder-no-payment' },
              { label: 'ATS Templates', href: '/templates/ats-friendly' },
              { label: 'Resume Keywords', href: '/resume-keywords' },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="btn-ghost px-5 py-2.5 text-sm rounded-xl border border-black/[0.06]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Done with Zety? Build Your Resume Free"
        description="No payment. No sign-up. No subscription trap. Just a professional resume."
        primaryText="Switch to Free"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
