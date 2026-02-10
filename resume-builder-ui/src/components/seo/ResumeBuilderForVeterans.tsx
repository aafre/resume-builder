/**
 * Free Resume Builder for Veterans
 * URL: /free-resume-builder-for-veterans
 * Target keyword: "free resume builder for veterans"
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

export default function ResumeBuilderForVeterans() {
  const config = SEO_PAGES.forVeterans;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
    breadcrumbs: config.breadcrumbs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {config.features && <FeatureGrid features={config.features} />}

      {/* Military-to-civilian translation section */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            TRANSLATION GUIDE
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            Military-to-Civilian Language Translation
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-10">
            Civilian recruiters do not understand military terminology. Here is how to translate
            your experience into language that resonates with hiring managers.
          </p>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
              <thead>
                <tr className="bg-chalk-dark">
                  <th className="px-6 py-4 text-left font-bold text-ink">Military Term</th>
                  <th className="px-6 py-4 text-left font-bold text-accent">Civilian Translation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {[
                  ['Platoon Leader', 'Team Leader / Operations Manager (40+ personnel)'],
                  ['Squad Leader', 'First-Line Supervisor (8-12 personnel)'],
                  ['Logistics NCO', 'Supply Chain Coordinator'],
                  ['S3 Operations', 'Operations Planning & Coordination Manager'],
                  ['NCOER / OER', 'Performance Evaluation / Annual Review'],
                  ['MOS 68W (Combat Medic)', 'Emergency Medical Technician (EMT)'],
                  ['MOS 25B (IT Specialist)', 'IT Systems Administrator'],
                  ['DD-214', 'Honorable Discharge / Service Record'],
                  ['PCS / TDY', 'Relocation / Business Travel'],
                  ['AAR (After Action Review)', 'Post-Project Analysis / Lessons Learned'],
                ].map(([mil, civ]) => (
                  <tr key={mil}>
                    <td className="px-6 py-3 text-stone-warm text-sm">{mil}</td>
                    <td className="px-6 py-3 text-ink text-sm font-medium">{civ}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </RevealSection>

      {/* Security clearance section */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            How to List Security Clearances
          </h2>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-2xl p-6">
            <p className="text-lg text-stone-warm font-extralight leading-relaxed mb-4">
              An active security clearance is one of your most valuable career assets. Defense
              contractors and government agencies actively seek cleared candidates because the
              investigation process takes months and costs thousands of dollars.
            </p>
            <div className="bg-white rounded-xl p-4 border border-black/[0.06]">
              <p className="font-mono text-sm text-ink mb-1"><strong>Security Clearance</strong></p>
              <p className="text-stone-warm text-sm">Top Secret / SCI — Active (Investigation: March 2024)</p>
            </div>
            <p className="text-stone-warm text-sm mt-4">
              Place this section near the top of your resume, immediately after your contact information
              and summary. Include the clearance level, status, and most recent investigation date.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Related resources */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            Veteran Resume Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/resume-keywords" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Resume Keywords by Industry</h3>
              <p className="text-stone-warm text-sm">Find civilian keywords for your target role</p>
            </Link>
            <Link to="/templates/ats-friendly" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">ATS-Friendly Templates</h3>
              <p className="text-stone-warm text-sm">Clean templates that pass corporate ATS systems</p>
            </Link>
          </div>
        </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Build Your Veteran Resume Today"
        description="Translate your military experience into a professional civilian resume. 100% free."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
