/**
 * Free Resume Builder No Payment Page
 * URL: /free-resume-builder-no-payment
 * Target keyword: "free resume builder no payment"
 * Content angle: hidden fee comparison, pricing transparency, freemium vs truly free
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

      {/* Hidden fees other builders charge */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-600">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase text-center mb-4">
            Price Breakdown
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Hidden Fees Other Resume Builders Charge
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-12">
            Most "free" resume builders advertise zero cost upfront, but the charges appear the moment you try
            to download, export, or use premium features. Here is exactly what they charge — and what
            EasyFreeResume gives you for free. For a deeper comparison, see our{' '}
            <Link to="/blog/best-free-resume-builders-2026" className="text-accent hover:underline">
              best free resume builders guide
            </Link>.
          </p>
          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-chalk-dark">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-ink">Builder</th>
                  <th className="px-6 py-4 text-left font-bold text-ink">Advertised as</th>
                  <th className="px-6 py-4 text-left font-bold text-ink">Actual Cost</th>
                  <th className="px-6 py-4 text-left font-bold text-ink">Hidden Catch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {[
                  {
                    name: 'Zety',
                    advertised: '"Free" builder',
                    cost: '$2.70 trial, then $24.70/mo',
                    catch: 'Builds resume for free, charges to download. Trial auto-renews to monthly subscription.',
                  },
                  {
                    name: 'Resume.io',
                    advertised: '"Try for free"',
                    cost: '$2.95/week ($12.80/mo)',
                    catch: 'Weekly billing obscures the real monthly price. Must cancel within 7 days or keep paying.',
                  },
                  {
                    name: 'Resume Genius',
                    advertised: '"Free resume maker"',
                    cost: '$2.95 trial, then $7.95/mo',
                    catch: 'Low trial price hooks you in. Subscription activates automatically after trial.',
                  },
                  {
                    name: 'Canva',
                    advertised: '"Free" templates',
                    cost: 'Free basic / $12.99/mo Pro',
                    catch: 'Best templates and design elements require Pro. Free exports add Canva branding.',
                  },
                  {
                    name: 'Novoresume',
                    advertised: '"Free" plan',
                    cost: 'Free (1 page) / $19.99/mo premium',
                    catch: 'Free tier limited to 1-page resumes. Multi-page, colors, and templates locked behind premium.',
                  },
                  {
                    name: 'EasyFreeResume',
                    advertised: 'Free',
                    cost: '$0 — always',
                    catch: 'No catch. All templates, all formats, unlimited downloads. Ad-supported.',
                    highlight: true,
                  },
                ].map((builder) => (
                  <tr
                    key={builder.name}
                    className={builder.highlight ? 'bg-accent/[0.04]' : ''}
                  >
                    <td className="px-6 py-4 font-bold text-ink">
                      {builder.highlight ? (
                        <span className="text-accent">{builder.name}</span>
                      ) : (
                        builder.name
                      )}
                    </td>
                    <td className="px-6 py-4 text-stone-warm text-sm">{builder.advertised}</td>
                    <td className="px-6 py-4 text-sm">
                      {builder.highlight ? (
                        <span className="text-accent font-bold">{builder.cost}</span>
                      ) : (
                        <span className="text-red-600 font-medium">{builder.cost}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-stone-warm text-sm">{builder.catch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-mist mt-4 text-center">
              Pricing data collected from publicly available information (March 2026). Prices may vary by region.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* What "free" actually means — freemium vs truly free */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-600">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase text-center mb-4">
            Transparency
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            What "Free" Actually Means: Freemium vs. Truly Free
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-12">
            The word "free" is used loosely in the resume builder industry. Understanding the difference
            can save you money and frustration.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <h3 className="font-display text-xl font-bold text-ink mb-4">
                Freemium Model
              </h3>
              <p className="text-stone-warm font-extralight leading-relaxed mb-4">
                The builder is free to use, but the output costs money. You invest time creating your resume, then
                face a paywall at the download step.
              </p>
              <ul className="space-y-3">
                {[
                  'Free to build, paid to download',
                  'Best templates behind paywall',
                  'Watermarks on free downloads',
                  'Auto-renewing subscriptions',
                  'Credit card required for "trials"',
                  'Designed to make you feel invested before charging',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-warm">
                    <span className="text-red-500 font-bold mt-0.5 flex-shrink-0">&#10007;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
              <h3 className="font-display text-xl font-bold text-ink mb-4">
                Truly Free Model (EasyFreeResume)
              </h3>
              <p className="text-stone-warm font-extralight leading-relaxed mb-4">
                Everything is free — building, downloading, and using your resume. Sustained through
                non-intrusive advertising instead of user payments.
              </p>
              <ul className="space-y-3">
                {[
                  'Free to build AND download',
                  'Every template included',
                  'No watermarks ever',
                  'No subscriptions or renewals',
                  'No credit card collected',
                  'Transparent ad-supported business model',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-warm">
                    <span className="text-accent font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </RevealSection>

      {config.steps && <StepByStep steps={config.steps} />}

      {/* Social proof / testimonial-style section */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-500">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase text-center mb-4">
            User Experiences
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Why Job Seekers Choose the No-Payment Option
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-12">
            Thousands of job seekers have used EasyFreeResume to create professional resumes without
            spending a dime. Here is what the no-payment experience looks like in practice.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                scenario: 'Recent Graduate',
                quote: 'I was about to pay $25 on Zety just to download my resume. Found EasyFreeResume and got the same result for free. No tricks.',
                detail: 'Built a resume using ATS-friendly templates, downloaded as PDF, and applied to 15 jobs the same day.',
              },
              {
                scenario: 'Career Changer',
                quote: 'After getting burned by Resume.io\'s weekly billing, I needed something genuinely free. This is it.',
                detail: 'Created multiple resume versions tailored to different industries — all without paying or creating an account.',
              },
              {
                scenario: 'Job Fair Prep',
                quote: 'I needed to print 10 copies for a career fair tomorrow. Downloading was instant and the PDF printed perfectly.',
                detail: 'No sign-up friction meant going from first visit to printed resumes in under 20 minutes.',
              },
            ].map((item) => (
              <div key={item.scenario} className="bg-white rounded-2xl p-6 shadow-premium border border-black/[0.06]">
                <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-3">
                  {item.scenario}
                </p>
                <p className="text-ink font-medium leading-relaxed mb-4 italic">
                  "{item.quote}"
                </p>
                <p className="text-stone-warm font-extralight text-sm leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-mist mt-6 text-center">
            Scenarios based on common user patterns. Want to see how free resume builders compare?
            Read our{' '}
            <Link to="/blog/best-free-resume-builders-2026" className="text-accent hover:underline">
              detailed comparison
            </Link>.
          </p>
        </div>
      </RevealSection>

      {/* How we stay free */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-400">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase text-center mb-4">
            Our Model
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            How EasyFreeResume Stays Free Without Charging You
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
                'We never sell your resume data to third parties',
                'Every template and format stays free forever',
                'There is no "premium" tier to upsell you into',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-accent font-bold mt-0.5">&#10003;</span>
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

      <FAQSection faqs={config.faqs} />

      {/* Related Resources */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-400">
          <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase text-center mb-4">
            Related Resources
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Free Tools and Guides for Your Job Search
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link
              to="/templates/ats-friendly"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">ATS-Friendly Templates</h3>
              <p className="text-stone-warm font-extralight text-sm">
                Templates optimized for applicant tracking systems — all free, no premium locks.
              </p>
            </Link>
            <Link
              to="/blog/how-to-write-a-resume-guide"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">How to Write a Resume</h3>
              <p className="text-stone-warm font-extralight text-sm">
                Complete guide from blank page to polished resume, with examples for every section.
              </p>
            </Link>
            <Link
              to="/resume-keywords"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">Resume Keywords</h3>
              <p className="text-stone-warm font-extralight text-sm">
                Industry-specific keywords that help your resume pass ATS screening.
              </p>
            </Link>
            <Link
              to="/examples"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">Resume Examples</h3>
              <p className="text-stone-warm font-extralight text-sm">
                Real resume examples for 25+ job titles to inspire your own.
              </p>
            </Link>
            <Link
              to="/blog/ats-resume-optimization"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">ATS Optimization Guide</h3>
              <p className="text-stone-warm font-extralight text-sm">
                Detailed strategies to format your resume for automated screening tools.
              </p>
            </Link>
            <Link
              to="/free-resume-builder-download"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">Free Download Guide</h3>
              <p className="text-stone-warm font-extralight text-sm">
                Everything about downloading resumes in PDF and DOCX — formats, printing tips, and ATS advice.
              </p>
            </Link>
          </div>
        </div>
      </RevealSection>

      <DownloadCTA
        title="Build Your Resume — Zero Cost, Zero Catch"
        description="No payment. No sign-up. No subscription. No hidden fees. Just a professional resume."
        primaryText="Start Building Free"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
