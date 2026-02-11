/**
 * Free Resume Builder Download Page
 * URL: /free-resume-builder-download
 * Target keyword: "free resume builder download"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import StepByStep from '../shared/StepByStep';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function FreeResumeBuilderDownload() {
  const config = SEO_PAGES.freeDownload;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {config.steps && <StepByStep steps={config.steps} />}

      {/* Objection-busting section */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            What "Free" Actually Means Here
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-12">
            We know you have been burned before. Most resume builders lure you in with "free" then charge $2-$25 to download your resume.
            Here is what free means at EasyFreeResume — no fine print.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'No Payment Ever', desc: 'We never ask for a credit card number. There are no checkout pages, no trial periods, and no surprise charges.' },
              { title: 'No Sign-Up Required', desc: 'No email, no password, no account creation. Open the builder and start working immediately.' },
              { title: 'No Watermarks', desc: 'Your downloaded resume is clean and professional. No branding, no "made with" badges, no small print.' },
              { title: 'PDF & DOCX Downloads', desc: 'Download in PDF for job applications or DOCX for further editing. Both formats are free and unlimited.' },
              { title: 'No Hidden Fees', desc: 'There is no premium tier. Every template, every feature, every format is available to everyone equally.' },
              { title: 'No Credit Card on File', desc: 'We cannot charge you because we never collect payment information in the first place. Zero risk.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-premium border border-black/[0.06]">
                <h3 className="font-display text-lg font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-stone-warm font-extralight leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Internal linking section */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Explore More Free Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link
              to="/free-resume-builder-no-sign-up"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">No Sign-Up Builder</h3>
              <p className="text-stone-warm font-extralight">Learn more about our privacy-first approach.</p>
            </Link>
            <Link
              to="/ats-resume-templates"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">ATS-Friendly Templates</h3>
              <p className="text-stone-warm font-extralight">Browse templates optimized for Applicant Tracking Systems.</p>
            </Link>
            <Link
              to="/free-resume-builder-no-payment"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">No Payment Required</h3>
              <p className="text-stone-warm font-extralight">See how we compare to builders that charge for downloads.</p>
            </Link>
            <Link
              to="/actual-free-resume-builder"
              className="bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
            >
              <h3 className="font-display text-lg font-bold text-ink mb-2">Actually Free Builder</h3>
              <p className="text-stone-warm font-extralight">Why EasyFreeResume is genuinely, completely free.</p>
            </Link>
          </div>
        </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Download Your Free Resume Now"
        description="No payment. No sign-up. No watermarks. Just a professional resume."
        primaryText="Build My Free Resume"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
