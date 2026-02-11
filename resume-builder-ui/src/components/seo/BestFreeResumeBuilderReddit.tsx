/**
 * Best Free Resume Builder Reddit Page
 * URL: /best-free-resume-builder-reddit
 * Target keyword: "best free resume builder reddit"
 */

import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';
import CompareBuildersCrossLinks from '../blog/CompareBuildersCrossLinks';

export default function BestFreeResumeBuilderReddit() {
  const config = SEO_PAGES.redditRecommended;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            What Reddit users look for in a free builder
          </h2>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
            <p className="text-lg md:text-xl font-extralight text-stone-warm mb-6 leading-relaxed">
              We analyzed hundreds of comments from r/resumes, r/jobs, and r/cscareerquestions to
              understand what matters most to job seekers. Here's what Reddit consistently values:
            </p>
            <ul className="space-y-3 text-stone-warm">
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3 text-xl">1.</span>
                <span><strong>Actually free</strong> – No hidden paywalls, no "free trial" that requires a credit card</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3 text-xl">2.</span>
                <span><strong>ATS-friendly</strong> – Templates that pass Applicant Tracking Systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3 text-xl">3.</span>
                <span><strong>No watermarks</strong> – Professional downloads without branding</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3 text-xl">4.</span>
                <span><strong>Privacy-focused</strong> – No account required, no data collection</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3 text-xl">5.</span>
                <span><strong>No aggressive upselling</strong> – Straightforward tool without constant upgrade prompts</span>
              </li>
            </ul>
          </div>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} columns={3} />}

      {/* What Reddit Complains About section */}
      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          What Reddit users complain about (avoid these red flags)
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
            <h3 className="font-display text-xl font-bold text-ink mb-4">
              <span aria-hidden="true">🚫</span> Paywall Bait-and-Switch
            </h3>
            <p className="text-stone-warm text-sm italic mb-3">
              "Built my entire resume only to find out I need to pay $20 to download it."
            </p>
            <p className="text-stone-warm text-sm">
              Many builders let you create for free but charge to export. Always test the download before investing time.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
            <h3 className="font-display text-xl font-bold text-ink mb-4">
              <span aria-hidden="true">🚫</span> Watermarks on "Free" Plans
            </h3>
            <p className="text-stone-warm text-sm italic mb-3">
              "The free version had their logo on every page. Looked unprofessional."
            </p>
            <p className="text-stone-warm text-sm">
              Some builders add branding unless you pay. Check your downloaded file before applying anywhere.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
            <h3 className="font-display text-xl font-bold text-ink mb-4">
              <span aria-hidden="true">🚫</span> Mandatory Account Creation
            </h3>
            <p className="text-stone-warm text-sm italic mb-3">
              "Had to give them my email and phone number just to try the builder."
            </p>
            <p className="text-stone-warm text-sm">
              Many services require signup to collect your data. Look for builders that work without accounts.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
            <h3 className="font-display text-xl font-bold text-ink mb-4">
              <span aria-hidden="true">🚫</span> Aggressive Upselling
            </h3>
            <p className="text-stone-warm text-sm italic mb-3">
              "Every click showed a popup asking me to upgrade to premium."
            </p>
            <p className="text-stone-warm text-sm">
              Dark patterns pressure you into paying. Choose tools that respect your time and don't manipulate.
            </p>
          </div>
        </div>
      </div>
      </RevealSection>

      {/* Verification Checklist */}
      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          How to verify a builder is actually free
        </h2>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-premium border-l-4 border-l-accent p-8">
          <p className="text-lg text-ink font-medium mb-6">
            Before investing time in any resume builder, check these boxes:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>Download works without payment</strong> – Test with dummy content first</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>No watermark on exported file</strong> – Open the PDF and check every page</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>No credit card required</strong> – Free means free, not "free trial"</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>All templates accessible</strong> – Not just 1-2 basic options</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>PDF and DOCX both available</strong> – Some lock DOCX behind paywall</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-3 text-xl">☑</span>
              <span className="text-stone-warm"><strong>Works without signup</strong> – Or at least doesn't require payment info</span>
            </li>
          </ul>
          <div className="mt-6 p-4 bg-white rounded-lg">
            <p className="text-sm text-stone-warm">
              <strong>EasyFreeResume passes all six checks.</strong> We're funded by ethical ads,
              not by tricking users into subscriptions.
            </p>
          </div>
        </div>
      </div>
      </RevealSection>

      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Evaluation criteria: how we meet Reddit's standards
        </h2>
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                ✓ Reddit Criterion: "No paywall"
              </h3>
              <p className="text-stone-warm mb-2">
                <strong>How we meet it:</strong> Every feature is free forever. No premium tiers,
                no locked templates, no download limits. We monetize through ethical ads only.
              </p>
              <p className="text-sm text-mist italic">
                "Finally, a builder that doesn't ask for my credit card." - Typical Reddit feedback
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                ✓ Reddit Criterion: "ATS compatibility"
              </h3>
              <p className="text-stone-warm mb-2">
                <strong>How we meet it:</strong> All templates use standard fonts, clear section
                headers, and simple formatting. Tested with major ATS platforms including Workday,
                Taleo, and Greenhouse.
              </p>
              <p className="text-sm text-mist italic">
                "This passed Workday when others didn't." - r/resumes user
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-premium border-l-4 border-accent">
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                ✓ Reddit Criterion: "Privacy and no signup"
              </h3>
              <p className="text-stone-warm mb-2">
                <strong>How we meet it:</strong> No account required. Your resume data stays in
                your browser. We don't store, track, or sell your information.
              </p>
              <p className="text-sm text-mist italic">
                "Love that I can use this without creating yet another account." - r/jobs comment
              </p>
            </div>
          </div>
        </div>
      </div>
      </RevealSection>

      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          When a paid tool makes sense
        </h2>
        <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl p-8">
          <p className="text-lg text-stone-warm leading-relaxed">
            We believe in being honest. Paid resume services can be worth it if you need:
          </p>
          <ul className="mt-4 space-y-2 text-stone-warm">
            <li>• Professional resume writing (human expert feedback)</li>
            <li>• Cover letter writing services</li>
            <li>• LinkedIn profile optimization</li>
            <li>• Career coaching or interview prep</li>
          </ul>
          <p className="mt-4 text-stone-warm">
            But for <strong>creating and formatting a resume yourself</strong>, free tools like
            ours work just as well as paid options.
          </p>
        </div>
      </div>
      </RevealSection>

      {/* See How Specific Builders Compare */}
      <RevealSection variant="fade-up">
      <div className="mb-16 max-w-4xl mx-auto">
        <CompareBuildersCrossLinks
          title="See How Specific Builders Compare"
          description="Want a detailed breakdown of a specific resume builder? We've analyzed pricing, features, and hidden costs:"
          bgColor="bg-accent/[0.06]"
        />
      </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="See Why Reddit Recommends Us"
        description="Join thousands of job seekers who trust our actually free resume builder."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
