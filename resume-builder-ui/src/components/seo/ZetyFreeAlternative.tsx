/**
 * Zety Free Alternative Page
 * URL: /zety-free-alternative
 * Target keyword: "zety free alternative"
 */

import { useMemo } from 'react';
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
import type { FAQConfig } from '../../types/seo';

const EXTRA_FAQS: FAQConfig[] = [
  {
    question: 'Is Zety really free?',
    answer:
      'Zety lets you build a resume for free, but downloading it requires payment. You can type your content, choose a template, and preview the result at no cost. The moment you click "Download" you are prompted to start a $2.70 seven-day trial that auto-renews at $24.70 per month. Many users describe this as a bait-and-switch because the paywall only appears after you have invested time creating your resume.',
  },
  {
    question: 'How much does Zety cost?',
    answer:
      'Zety offers a 7-day trial for $2.70 that automatically renews into a monthly subscription at $24.70 per month. If you do not cancel within the trial window, you will be charged the full monthly rate. Some users also report difficulty cancelling and unexpected charges. EasyFreeResume has no pricing tiers at all — every feature, template, and download is free.',
  },
  {
    question: 'What does Zety charge for that EasyFreeResume does not?',
    answer:
      'Zety charges for PDF downloads, access to premium templates, watermark-free exports, and their AI writing assistant. EasyFreeResume provides all of these features at no cost: free PDF downloads, all templates unlocked, no watermarks, and you can use any free AI (ChatGPT, Claude, Gemini) to write your content before pasting it into our builder.',
  },
  {
    question: 'Can I cancel my Zety subscription?',
    answer:
      'Yes, but you need to cancel before the 7-day trial ends to avoid being charged $24.70. To cancel, log into your Zety account, go to Account Settings, and look for subscription management. Some users report the cancellation process is not straightforward. If you have not signed up yet, consider using EasyFreeResume instead — there is nothing to cancel because there is no subscription.',
  },
];

export default function ZetyFreeAlternative() {
  const config = SEO_PAGES.zetyAlternative;

  const allFaqs = useMemo(
    () => [...config.faqs, ...EXTRA_FAQS],
    [config.faqs],
  );

  const schemas = usePageSchema({
    type: 'software',
    faqs: allFaqs,
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
        <div className="mb-16 cv-auto cv-h-400">
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
          <p className="text-center mt-6 text-stone-warm font-extralight">
            See the full breakdown in our{' '}
            <Link to="/easyfreeresume-vs-zety" className="text-accent hover:underline font-medium">
              detailed EasyFreeResume vs Zety comparison
            </Link>.
          </p>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* What Zety users say */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-500">
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
            <Link to="/easyfreeresume-vs-zety" className="text-accent hover:underline">
              Zety vs EasyFreeResume comparison
            </Link>{' '}
            for a thorough, factual breakdown.
          </p>
        </div>
      </RevealSection>

      {/* Internal links */}
      <RevealSection variant="fade-up">
        <div className="mb-16 text-center cv-auto cv-h-200">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            Related Resources
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Free Download', href: '/free-resume-builder-download' },
              { label: 'No Payment Builder', href: '/free-resume-builder-no-payment' },
              { label: 'ATS Templates', href: '/templates/ats-friendly' },
              { label: 'Resume Keywords', href: '/resume-keywords' },
              { label: 'Resume Examples', href: '/examples' },
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

      <FAQSection faqs={allFaqs} />

      {/* Compare More Builders */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-400">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4 text-center">
            Compare More Resume Builders
          </h2>
          <p className="text-lg font-extralight text-stone-warm max-w-3xl mx-auto text-center leading-relaxed mb-10">
            Zety is not the only paid builder. See how EasyFreeResume compares to other popular options.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'EasyFreeResume vs Zety (Full Review)',
                desc: 'In-depth comparison of pricing, templates, features, and ATS compatibility between EasyFreeResume and Zety.',
                href: '/easyfreeresume-vs-zety',
              },
              {
                title: 'Best Free Resume Builders 2026',
                desc: 'Our honest roundup of the best free resume builders available right now, ranked by features and value.',
                href: '/blog/best-free-resume-builders-2026',
              },
              {
                title: 'FlowCV vs EasyFreeResume',
                desc: 'How FlowCV compares on pricing, template quality, and free-tier limitations.',
                href: '/blog/flowcv-vs-easy-free-resume',
              },
              {
                title: 'Resume.io vs EasyFreeResume',
                desc: 'Side-by-side comparison with Resume.io on cost, templates, and download options.',
                href: '/blog/resume-io-vs-easy-free-resume',
              },
              {
                title: 'Resume Genius vs EasyFreeResume',
                desc: 'Feature comparison with Resume Genius covering pricing, ATS optimization, and ease of use.',
                href: '/blog/resume-genius-vs-easy-free-resume',
              },
              {
                title: 'ATS-Friendly Templates',
                desc: 'Browse our collection of free, ATS-optimized resume templates designed to pass automated screening.',
                href: '/templates/ats-friendly',
              },
            ].map((guide) => (
              <Link
                key={guide.href}
                to={guide.href}
                className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300 hover:-translate-y-1 block"
              >
                <h3 className="font-display text-lg font-bold text-ink mb-2">{guide.title}</h3>
                <p className="text-stone-warm font-extralight text-sm leading-relaxed">{guide.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      <DownloadCTA
        title="Done with Zety? Build Your Resume Free"
        description="No payment. No sign-up. No subscription trap. Just a professional resume."
        primaryText="Switch to Free"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
