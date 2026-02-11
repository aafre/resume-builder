/**
 * Free Resume Builder No Sign Up Page
 * URL: /free-resume-builder-no-sign-up
 * Target keyword: "free resume builder no sign up"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import StepByStep from '../shared/StepByStep';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
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

      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Edit instantly: open the builder
        </h2>
        <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-8">
          Start building immediately. The editor opens in seconds with no barriers. No email
          verification, no password creation, no waiting. Just click and start creating your
          professional resume right now.
        </p>
      </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      <RevealSection variant="fade-up">
      <div className="mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          Privacy-first mode: what is and isn't logged
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-xl font-bold text-accent mb-4">✓ We DO NOT store:</h3>
              <ul className="space-y-2 text-stone-warm">
                <li>• Your resume content</li>
                <li>• Your personal information</li>
                <li>• Your email address</li>
                <li>• Your browsing history</li>
                <li>• Any identifying data</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink/80 mb-4">✓ We only track:</h3>
              <ul className="space-y-2 text-stone-warm">
                <li>• Anonymous page views (for analytics)</li>
                <li>• Error reports (to fix bugs)</li>
                <li>• Nothing that identifies you personally</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </RevealSection>

      {/* Audience links */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Built for Every Career Stage
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/free-resume-builder-for-students" className="bg-chalk-dark rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] text-center">
              <h3 className="font-bold text-ink mb-1">Students</h3>
              <p className="text-stone-warm text-xs">No experience? No problem.</p>
            </Link>
            <Link to="/free-resume-builder-for-veterans" className="bg-chalk-dark rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] text-center">
              <h3 className="font-bold text-ink mb-1">Veterans</h3>
              <p className="text-stone-warm text-xs">Military-to-civilian translation.</p>
            </Link>
            <Link to="/free-resume-builder-for-it-professionals" className="bg-chalk-dark rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] text-center">
              <h3 className="font-bold text-ink mb-1">IT Professionals</h3>
              <p className="text-stone-warm text-xs">Tech stack, scale, impact.</p>
            </Link>
            <Link to="/free-resume-builder-for-nurses" className="bg-chalk-dark rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04] text-center">
              <h3 className="font-bold text-ink mb-1">Nurses</h3>
              <p className="text-stone-warm text-xs">Certifications, EHR, clinical skills.</p>
            </Link>
          </div>
        </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Build Your Resume Without Signing Up"
        description="No account required. Start creating your resume immediately."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
