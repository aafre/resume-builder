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
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function BestFreeResumeBuilderReddit() {
  const config = SEO_PAGES.redditRecommended;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          What Reddit users look for in a free builder
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            We analyzed hundreds of comments from r/resumes, r/jobs, and r/cscareerquestions to
            understand what matters most to job seekers. Here's what Reddit consistently values:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-3 text-xl">1.</span>
              <span><strong>Actually free</strong> – No hidden paywalls, no "free trial" that requires a credit card</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-3 text-xl">2.</span>
              <span><strong>ATS-friendly</strong> – Templates that pass Applicant Tracking Systems</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-3 text-xl">3.</span>
              <span><strong>No watermarks</strong> – Professional downloads without branding</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-3 text-xl">4.</span>
              <span><strong>Privacy-focused</strong> – No account required, no data collection</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-3 text-xl">5.</span>
              <span><strong>No aggressive upselling</strong> – Straightforward tool without constant upgrade prompts</span>
            </li>
          </ul>
        </div>
      </div>

      {config.features && <FeatureGrid features={config.features} columns={3} />}

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Evaluation criteria: how we meet Reddit's standards
        </h2>
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ✓ Reddit Criterion: "No paywall"
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>How we meet it:</strong> Every feature is free forever. No premium tiers,
                no locked templates, no download limits. We monetize through ethical ads only.
              </p>
              <p className="text-sm text-gray-600 italic">
                "Finally, a builder that doesn't ask for my credit card." - Typical Reddit feedback
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ✓ Reddit Criterion: "ATS compatibility"
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>How we meet it:</strong> All templates use standard fonts, clear section
                headers, and simple formatting. Tested with major ATS platforms including Workday,
                Taleo, and Greenhouse.
              </p>
              <p className="text-sm text-gray-600 italic">
                "This passed Workday when others didn't." - r/resumes user
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ✓ Reddit Criterion: "Privacy and no signup"
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>How we meet it:</strong> No account required. Your resume data stays in
                your browser. We don't store, track, or sell your information.
              </p>
              <p className="text-sm text-gray-600 italic">
                "Love that I can use this without creating yet another account." - r/jobs comment
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          When a paid tool makes sense
        </h2>
        <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl p-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            We believe in being honest. Paid resume services can be worth it if you need:
          </p>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li>• Professional resume writing (human expert feedback)</li>
            <li>• Cover letter writing services</li>
            <li>• LinkedIn profile optimization</li>
            <li>• Career coaching or interview prep</li>
          </ul>
          <p className="mt-4 text-gray-700">
            But for <strong>creating and formatting a resume yourself</strong>, free tools like
            ours work just as well as paid options.
          </p>
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="See Why Reddit Recommends Us"
        description="Join thousands of job seekers who trust our actually free resume builder."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
