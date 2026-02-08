/**
 * CV Templates Main Page (UK/EU/AU/NZ Market)
 * URL: /cv-templates
 * Target keywords: "cv templates", "free cv templates uk", "professional cv template"
 *
 * This page targets users searching with "CV" terminology (UK, Europe, Australia, NZ)
 * while /templates targets "resume" terminology (US, Canada)
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import RevealSection from '../shared/RevealSection';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import TemplateCarousel from '../TemplateCarousel';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';
import type { SEOConfig } from '../../types/seo';

export default function CVTemplatesPage() {
  const config = SEO_PAGES.cvTemplates;

  // Add hreflang tags for international SEO
  const seoConfigWithHreflang: SEOConfig = {
    ...config.seo,
    hreflangLinks: [
      { hreflang: 'en-GB', href: 'https://easyfreeresume.com/cv-templates' },
      { hreflang: 'en-AU', href: 'https://easyfreeresume.com/cv-templates' },
      { hreflang: 'en-NZ', href: 'https://easyfreeresume.com/cv-templates' },
      { hreflang: 'en-US', href: 'https://easyfreeresume.com/templates' },
      { hreflang: 'x-default', href: 'https://easyfreeresume.com/templates' },
    ],
    ogLocale: 'en_GB',
  };

  const schemas = usePageSchema({
    type: 'itemList',
    faqs: config.faqs,
    items: [
      {
        name: 'Professional CV Template',
        url: '/templates',
        description: 'ATS-optimised CV template for UK and international applications',
      },
      {
        name: 'Modern CV Template',
        url: '/templates/modern-resume-templates',
        description: 'Contemporary CV design for modern professionals',
      },
    ],
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'CV Templates', href: '/cv-templates' },
    ],
  });

  return (
    <SEOPageLayout seoConfig={seoConfigWithHreflang} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Template Gallery Section */}
      <section id="template-gallery" className="py-12 -mx-4 sm:-mx-6 md:-mx-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4">
            Browse CV Templates
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-2xl mx-auto">
            Select a professional CV template that suits your industry.
            All designs are ATS-compatible and completely free.
          </p>
        </div>
        <TemplateCarousel showHeader={false} />
      </section>

      {/* CV vs Resume Explanation */}
      <RevealSection variant="fade-up">
      <div className="my-16">
        <div className="max-w-4xl mx-auto bg-accent/[0.06] border border-accent/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-ink mb-4">
            CV or Resume? Which Term Should You Use?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-ink mb-2">Use "CV" (Curriculum Vitae)</h3>
              <ul className="text-ink/80 space-y-1 list-disc pl-5">
                <li>United Kingdom</li>
                <li>Ireland</li>
                <li>Europe (most countries)</li>
                <li>Australia</li>
                <li>New Zealand</li>
                <li>South Africa</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-2">Use "Resume"</h3>
              <ul className="text-ink/80 space-y-1 list-disc pl-5">
                <li>United States</li>
                <li>Canada</li>
              </ul>
              <p className="text-accent text-sm mt-3">
                Looking for US-style resumes?{' '}
                <Link to="/templates" className="underline hover:text-ink">
                  View Resume Templates
                </Link>
              </p>
            </div>
          </div>
          <p className="text-ink/80 mt-4 text-sm">
            The document format is essentially the same. Use whichever term is standard in your target country.
            Our templates work for both.
          </p>
        </div>
      </div>
      </RevealSection>

      {/* UK CV Format Guide */}
      <RevealSection variant="fade-up">
      <div className="my-16">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
          UK CV Format Essentials
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-accent p-6">
            <h3 className="font-display text-xl font-bold text-ink mb-4">Do Include</h3>
            <ul className="space-y-2 text-stone-warm">
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3" aria-hidden="true">&#10003;</span>
                <span><strong>Personal profile</strong> (3-4 lines summarising your experience)</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3" aria-hidden="true">&#10003;</span>
                <span><strong>Contact details</strong> (phone, email, city/region)</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3" aria-hidden="true">&#10003;</span>
                <span><strong>Work experience</strong> with quantified achievements</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3" aria-hidden="true">&#10003;</span>
                <span><strong>Education</strong> and relevant qualifications</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent font-bold mr-3" aria-hidden="true">&#10003;</span>
                <span><strong>Key skills</strong> relevant to the role</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-premium border-l-4 border-l-red-400 p-6">
            <h3 className="font-display text-xl font-bold text-ink mb-4">Do Not Include</h3>
            <ul className="space-y-2 text-stone-warm">
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3" aria-hidden="true">&#10007;</span>
                <span><strong>Photo</strong> (unless specifically requested)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3" aria-hidden="true">&#10007;</span>
                <span><strong>Date of birth</strong> or age</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3" aria-hidden="true">&#10007;</span>
                <span><strong>Marital status</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3" aria-hidden="true">&#10007;</span>
                <span><strong>National insurance number</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3" aria-hidden="true">&#10007;</span>
                <span><strong>"References available upon request"</strong></span>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center text-stone-warm mt-6 max-w-2xl mx-auto">
          UK equality laws discourage personal information that could lead to discrimination.
          Focus on your skills and experience instead.
        </p>
      </div>
      </RevealSection>

      {/* Length Guidelines */}
      <RevealSection variant="fade-up">
      <div className="my-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
          <h2 className="font-display text-2xl font-bold text-ink mb-4 text-center">
            How Long Should a UK CV Be?
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-accent">2</div>
              <div className="text-stone-warm">Pages Maximum</div>
            </div>
            <div className="text-stone-warm max-w-md">
              <p className="mb-2">
                <strong>Standard UK CV:</strong> 2 pages is the accepted length for most professional roles.
              </p>
              <p className="text-sm text-mist">
                Exceptions: Academic CVs can be longer. Entry-level CVs may be 1 page.
                Senior executives with 15+ years experience may extend to 3 pages if needed.
              </p>
            </div>
          </div>
        </div>
      </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Date Format Section */}
      <RevealSection variant="fade-up">
      <div className="my-16">
        <div className="max-w-4xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-amber-900 mb-4">
            UK Date Format for CVs
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-amber-800 mb-2">Recommended Formats</h4>
              <ul className="text-amber-700 space-y-1">
                <li>"January 2024 - Present"</li>
                <li>"Jan 2025 - Dec 2026"</li>
                <li>"2022 - 2024" (year only)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-800 mb-2">Important</h4>
              <p className="text-amber-700">
                Be consistent throughout your CV. If you use abbreviated months in one place,
                use them everywhere. Our editor helps maintain consistency automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      {/* Related Pages */}
      <RevealSection variant="fade-up">
      <div className="my-16">
        <h3 className="font-display text-2xl font-bold text-ink mb-6 text-center">
          Explore More CV Resources
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/cv-templates/ats-friendly"
            className="px-6 py-3 bg-accent/10 text-ink/80 rounded-lg hover:bg-accent/20 transition-colors"
          >
            ATS-Friendly CV Templates
          </Link>
          <Link
            to="/free-cv-builder-no-sign-up"
            className="px-6 py-3 bg-accent/10 text-ink/80 rounded-lg hover:bg-accent/20 transition-colors"
          >
            Free CV Builder
          </Link>
          <Link
            to="/blog/resume-vs-cv-difference"
            className="btn-secondary py-3 px-6"
          >
            CV vs Resume: Full Guide
          </Link>
          <Link
            to="/resume-keywords"
            className="btn-secondary py-3 px-6"
          >
            CV Keywords by Industry
          </Link>
        </div>
      </div>
      </RevealSection>

      <DownloadCTA
        title="Ready to Build Your Professional CV?"
        description="Choose a template above and create your CV in minutes. 100% free, no sign-up required."
        primaryText="Browse CV Templates"
        primaryHref="#template-gallery"
      />
    </SEOPageLayout>
  );
}
