/**
 * Free Resume Builder for Nurses
 * URL: /free-resume-builder-for-nurses
 * Target keyword: "free resume builder for nurses"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function ResumeBuilderForNurses() {
  const config = SEO_PAGES.forNurses;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
    breadcrumbs: config.breadcrumbs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {config.features && <FeatureGrid features={config.features} />}

      {/* Nursing resume tips */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            NURSING RESUME TIPS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            What Nurse Hiring Managers Look For
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { title: 'Certifications First', desc: 'Hiring managers scan for BLS, ACLS, PALS, and specialty certifications before reading anything else. Place these prominently — ideally in a dedicated section right after your contact information.' },
              { title: 'Unit Type and Patient Population', desc: 'Specify your exact unit (ICU, ER, Med-Surg, L&D, OR, NICU) and patient population (pediatric, geriatric, trauma, oncology). "ICU nurse" means much more than "hospital nurse."' },
              { title: 'EHR System Proficiency', desc: 'Name every EHR system you have used: Epic, Cerner, MEDITECH, Allscripts. Hospitals invest heavily in specific systems and want nurses who can start without extensive EHR training.' },
              { title: 'Quantify Patient Care', desc: 'Include nurse-to-patient ratios, unit bed counts, and patient outcomes. "Managed 1:4 nurse-to-patient ratio in 30-bed cardiac ICU" immediately communicates your experience level.' },
              { title: 'License Information', desc: 'Include your active RN or LPN/LVN license with the state of licensure and license number. If you hold a compact license or licenses in multiple states, list them all.' },
            ].map((tip, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] border-l-4 border-l-accent">
                <h3 className="font-display text-lg font-bold text-ink mb-2">{tip.title}</h3>
                <p className="text-stone-warm font-extralight leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Related resources */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            Nursing Resume Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/resume-keywords/nursing" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Nursing Resume Keywords</h3>
              <p className="text-stone-warm text-sm">BLS, ACLS, Epic, clinical skills, and more</p>
            </Link>
            <Link to="/templates/ats-friendly" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">ATS-Friendly Templates</h3>
              <p className="text-stone-warm text-sm">Clean templates that pass hospital ATS systems</p>
            </Link>
            <Link to="/blog/resume-no-experience" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">New Graduate Resume Guide</h3>
              <p className="text-stone-warm text-sm">Perfect for new nursing graduates</p>
            </Link>
            <Link to="/resume-keywords" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">All Resume Keywords</h3>
              <p className="text-stone-warm text-sm">Browse keywords across all industries</p>
            </Link>
          </div>
        </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Build Your Nursing Resume Today"
        description="Professional templates with sections for certifications, clinical skills, and EHR experience. 100% free."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
