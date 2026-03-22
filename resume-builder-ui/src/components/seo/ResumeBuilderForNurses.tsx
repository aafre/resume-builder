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

      {/* Common mistakes section */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-4xl mx-auto">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            AVOID THESE PITFALLS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4 text-center">
            Common Nursing Resume Mistakes That Cost You Interviews
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm leading-relaxed text-center mb-10 max-w-3xl mx-auto">
            Nurse hiring managers scan resumes for specific clinical details. These mistakes make
            your application blend in with hundreds of others — or get filtered out entirely.
          </p>
          <div className="space-y-4">
            {[
              {
                mistake: 'Listing personal qualities instead of clinical skills',
                fix: '"Compassionate" and "hard-working" belong in a cover letter, not your resume skills section. Replace soft-skill filler with concrete clinical competencies: IV insertion, wound VAC management, ventilator care, telemetry monitoring, or medication reconciliation.',
              },
              {
                mistake: 'Not specifying unit types or patient populations',
                fix: '"Hospital nurse" tells a hiring manager nothing. Always specify: "36-bed Medical-Surgical ICU," "Level 1 Trauma ER," or "Outpatient Pediatric Oncology Clinic." Include patient acuity levels and nurse-to-patient ratios to communicate the complexity of your experience.',
              },
              {
                mistake: 'Omitting license details and state of licensure',
                fix: 'Your RN or LPN/LVN license is the single most important credential on your resume. Include the license type, state, license number, and expiration date. If you hold a Nurse Licensure Compact (NLC) multistate license, say so explicitly — it opens doors in 40+ states.',
              },
              {
                mistake: 'Not mentioning EHR systems by name',
                fix: 'Hospitals invest millions in specific EHR platforms. A resume that says "proficient in electronic medical records" wastes space. Name every system: Epic, Cerner Millennium, MEDITECH Expanse, Allscripts, or eClinicalWorks. If you hold Epic certifications, list the specific modules.',
              },
              {
                mistake: 'Writing generic "patient care" without specifics',
                fix: '"Provided patient care" is the most overused line in nursing resumes. Replace it with specifics: "Managed post-operative care for 5-6 cardiac surgery patients per shift, including hemodynamic monitoring, chest tube management, and early ambulation protocols." Details prove competence.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-chalk-dark rounded-xl p-6 border border-black/[0.06]">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">✗</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink mb-1">{item.mistake}</h3>
                    <p className="text-stone-warm font-extralight leading-relaxed">{item.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-lg text-stone-warm font-extralight leading-relaxed mt-8 text-center">
            Want to check that your resume includes the right clinical keywords? Try our{' '}
            <Link to="/resume-keyword-scanner" className="text-accent hover:underline font-medium">resume keyword scanner</Link>{' '}
            to compare your resume against any nursing job description.
          </p>
        </div>
      </RevealSection>

      {/* Related resources */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto cv-auto cv-h-300">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            Nursing Resume Resources
          </h2>
          <p className="text-lg text-stone-warm font-extralight mb-6 leading-relaxed">
            Explore our guides on{' '}
            <Link to="/blog/how-to-list-skills" className="text-accent hover:underline font-medium">listing skills effectively</Link>{' '}
            and{' '}
            <Link to="/blog/resume-keywords-guide" className="text-accent hover:underline font-medium">using resume keywords</Link>{' '}
            to strengthen your nursing application:
          </p>
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
            <Link to="/examples/registered-nurse" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Registered Nurse Resume Example</h3>
              <p className="text-stone-warm text-sm">Full RN resume with clinical experience layout</p>
            </Link>
            <Link to="/examples/medical-assistant" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Medical Assistant Resume Example</h3>
              <p className="text-stone-warm text-sm">Healthcare resume with certifications section</p>
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* Inline FAQ section */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-4xl mx-auto">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            QUICK ANSWERS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-10 text-center">
            Nursing Resume Questions, Answered
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Should I list all my clinical rotations?',
                a: 'If you are a new graduate, yes — your clinical rotations are your primary experience. For each rotation, list the facility, unit type, patient population, and key skills practiced. If you have 3+ years of nursing experience, only include rotations that are directly relevant to the target role or that fill a specialty gap in your work history.',
              },
              {
                q: 'How should I format nursing certifications?',
                a: 'Create a dedicated "Certifications & Licensure" section near the top of your resume. List each certification with the full name, abbreviation, issuing body, and expiration date: "Advanced Cardiac Life Support (ACLS) — American Heart Association — Exp. 09/2027." Group by priority: nursing license first, then BLS/ACLS, then specialty certifications.',
              },
              {
                q: 'Should I include volunteer work on my nursing resume?',
                a: 'Yes, if it demonstrates clinical skills, leadership, or community health experience. Medical mission trips, free clinic volunteering, health fair coordination, and disaster relief nursing are all valuable. For non-clinical volunteering, include it only if it shows leadership or fills a gap in your employment history.',
              },
              {
                q: 'How do I describe float pool experience?',
                a: 'Float pool experience is a strength — it proves adaptability. List it as a single role and use bullet points to highlight the range: "Floated across 8 units including ICU, ER, Med-Surg, and Telemetry, adapting to varying patient acuities and care protocols within each shift." Mention the total number of units and any specialized equipment or procedures unique to each.',
              },
              {
                q: 'Do I need a cover letter for nursing positions?',
                a: 'Most hospital applications have a cover letter upload field, and submitting one signals genuine interest. Keep it to one page. Address the specific unit and manager by name when possible. Highlight one or two clinical experiences that directly match the job description. A strong cover letter can differentiate you from 50 other applicants with similar credentials.',
              },
              {
                q: 'How do I list travel nurse experience?',
                a: 'List each assignment as a separate entry with the staffing agency, facility name, unit type, location, and dates. Use a consistent format: "ABC Staffing — Mercy General Hospital, Sacramento, CA — ICU (13-week contract, Jan-Apr 2025)." Highlight facility types (Level 1 Trauma, Magnet-designated) and any rapid-onboarding achievements to show you can hit the ground running.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06]">
                <h3 className="font-display text-lg font-bold text-ink mb-2">{item.q}</h3>
                <p className="text-stone-warm font-extralight leading-relaxed">{item.a}</p>
              </div>
            ))}
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
