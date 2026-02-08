/**
 * Modern Resume Templates Page
 * URL: /templates/modern-resume-templates
 * Target keywords: "modern resume template", "contemporary resume design"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import TemplateCarousel from '../TemplateCarousel';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function ModernTemplatesPage() {
  const config = SEO_PAGES.modernTemplates;
  const schemas = usePageSchema({
    type: 'itemList',
    faqs: config.faqs,
    items: [
      { name: 'Modern Professional Template', url: '/templates', description: 'Clean, contemporary design for modern professionals' },
    ],
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Template Gallery Section */}
      <section className="py-12 -mx-4 sm:-mx-6 md:-mx-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse Modern Templates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a modern template that matches your professional style.
            All designs are ATS-optimized and completely free.
          </p>
        </div>
        <TemplateCarousel showHeader={false} />
      </section>

      {/* What Makes Modern Templates Different */}
      <div className="my-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          What Makes a Modern Resume Stand Out?
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Clean Typography</h3>
            <p className="text-gray-700">
              Modern templates use contemporary sans-serif fonts with clear hierarchy.
              Headers stand out, body text is readable, and the overall effect is polished
              and professional.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Strategic White Space</h3>
            <p className="text-gray-700">
              Generous margins and spacing between sections create visual breathing room.
              This makes your resume easier to scan and more pleasant to read.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Subtle Color Accents</h3>
            <p className="text-gray-700">
              Modern designs often incorporate a single accent color for headers or dividers.
              This adds personality without overwhelming the content.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Layouts</h3>
            <p className="text-gray-700">
              Whether you have extensive experience or are just starting out, modern
              templates adapt to showcase your unique qualifications effectively.
            </p>
          </div>
        </div>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Industries Section */}
      <div className="my-16">
        <div className="max-w-5xl mx-auto bg-accent/[0.06] border border-accent/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-ink mb-4 text-center">
            Best Industries for Modern Resume Templates
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-ink">Technology</p>
              <p className="text-gray-600 text-sm">Software, SaaS, IT</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-ink">Startups</p>
              <p className="text-gray-600 text-sm">Early-stage companies</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-ink">Marketing</p>
              <p className="text-gray-600 text-sm">Digital, content, growth</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-ink">Design</p>
              <p className="text-gray-600 text-sm">UX, product, graphic</p>
            </div>
          </div>
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      {/* Related Templates */}
      <div className="my-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Explore Other Template Styles
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/templates/minimalist-resume-templates"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Minimalist Templates
          </Link>
          <Link
            to="/templates/resume-templates-for-students"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Student Templates
          </Link>
          <Link
            to="/templates/ats-friendly"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ATS-Friendly Templates
          </Link>
        </div>
      </div>

      <DownloadCTA
        title="Ready to Build Your Modern Resume?"
        description="Choose a template above and start building your professional resume in minutes. Completely free."
        primaryText="Browse Templates"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
