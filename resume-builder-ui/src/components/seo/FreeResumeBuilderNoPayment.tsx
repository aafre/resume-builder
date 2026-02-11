/**
 * Free Resume Builder No Payment Page
 * URL: /free-resume-builder-no-payment
 * Target keyword: "free resume builder no payment"
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

export default function FreeResumeBuilderNoPayment() {
  const config = SEO_PAGES.noPayment;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Comparison Table */}
      {config.comparison && (
        <RevealSection variant="fade-up">
          <ComparisonTable
            items={config.comparison}
            headers={[
              'Truly Free',
              'No Sign-Up',
              'No Credit Card',
              'PDF Download',
              'All Templates Free',
              'No Watermarks',
              'ATS-Optimized',
            ]}
            title="EasyFreeResume vs Typical &quot;Free&quot; Builders"
          />
        </RevealSection>
      )}

      {/* Why others charge */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Why Other Builders Are Not Really Free
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl font-extralight text-stone-warm leading-relaxed mb-8 text-center">
              Most resume builders use a tactic called "freemium bait." They let you spend 30+ minutes building your resume for free,
              then reveal the paywall when you click "Download." By that point, most people pay rather than start over elsewhere.
              Here is how the typical pricing works:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'Zety', price: '$2.70 trial → $24.70/mo', issue: 'Auto-subscribes, hard to cancel' },
                { name: 'Resume.io', price: '$2.95/week', issue: 'Weekly billing, adds up fast' },
                { name: 'Resume Genius', price: '$2.95 trial → $7.95/mo', issue: 'Trial auto-renews to subscription' },
                { name: 'Canva', price: 'Free basic, $12.99/mo Pro', issue: 'Best templates require Pro subscription' },
              ].map((builder) => (
                <div key={builder.name} className="bg-white rounded-2xl p-6 shadow-premium border border-black/[0.06]">
                  <h3 className="font-display text-lg font-bold text-ink mb-1">{builder.name}</h3>
                  <p className="text-accent font-bold text-sm mb-2">{builder.price}</p>
                  <p className="text-stone-warm font-extralight text-sm">{builder.issue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      {config.steps && <StepByStep steps={config.steps} />}

      {/* How we stay free */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            How We Stay Free — Honestly
          </h2>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
            <p className="text-lg font-extralight text-stone-warm leading-relaxed mb-6">
              EasyFreeResume is sustained through non-intrusive advertising. When you visit our site, you may see ads —
              that revenue covers our hosting, development, and maintenance costs. This model means:
            </p>
            <ul className="space-y-4">
              {[
                'You never pay a cent for any feature',
                'We never collect payment information',
                'We never sell your resume data',
                'Every template and format stays free forever',
                'There is no "premium" tier to upsell you into',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-accent font-bold mt-0.5">✓</span>
                  <span className="text-stone-warm font-extralight">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-extralight text-stone-warm leading-relaxed mt-6">
              We believe a resume builder should help you get a job, not drain your savings before you even start.
              Read more about our philosophy in our{' '}
              <Link to="/blog/how-why-easyfreeresume-completely-free" className="text-accent hover:underline">
                transparency post
              </Link>.
            </p>
          </div>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Internal links */}
      <RevealSection variant="fade-up">
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            More Free Resume Resources
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Free Download', href: '/free-resume-builder-download' },
              { label: 'No Sign-Up Builder', href: '/free-resume-builder-no-sign-up' },
              { label: 'Zety Alternative', href: '/zety-free-alternative' },
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
        title="Build Your Resume — Zero Cost, Zero Catch"
        description="No payment. No sign-up. No subscription. Just a professional resume."
        primaryText="Start Building Free"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
