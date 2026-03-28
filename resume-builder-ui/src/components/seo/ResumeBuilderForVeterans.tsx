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
import ResourceCard from '../shared/ResourceCard';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

const VETERAN_FAQS = [
  {
    question: 'How do I translate military experience to a civilian resume?',
    answer:
      'Replace military jargon with civilian equivalents that describe the same responsibility. "Platoon Leader" becomes "Operations Manager (40+ personnel)," and "conducted AARs" becomes "led post-project analysis sessions." Focus on outcomes any employer can understand: budgets managed, people supervised, processes improved, and deadlines met. Our military-to-civilian translation table above covers the most common terms.',
  },
  {
    question: 'Should I list my security clearance on a resume?',
    answer:
      'Yes, always list an active security clearance — it is one of the most valuable assets you bring to the civilian job market. Place it near the top of your resume, right after your summary. Include the clearance level (Secret, Top Secret, TS/SCI), status (Active or Inactive), and the date of your most recent investigation. Even an inactive clearance is worth mentioning because reinstatement is faster than a new investigation.',
  },
  {
    question: 'How far back should I go with military service on my resume?',
    answer:
      'Focus on the most recent 10-15 years of service. Earlier assignments can be summarized in a single line, such as "Additional military assignments (2008-2014) available upon request." Prioritize roles that are most relevant to your target civilian career. If you served 20+ years, a two-page resume is acceptable — but only if every entry adds value.',
  },
  {
    question: 'Do I need a different resume format as a veteran?',
    answer:
      'Use a standard civilian chronological or combination (hybrid) format. Avoid military-style performance report layouts. Most corporate applicant tracking systems expect a clear structure: contact info, summary, experience (reverse chronological), education, and skills. Our ATS-friendly templates are designed to work with these systems out of the box.',
  },
  {
    question: 'How do I explain deployment gaps on my resume?',
    answer:
      'Deployments are not employment gaps — they are active service. List your military role with the full date range, including deployment periods. In your bullet points, you can reference deployment context when it adds value: "Managed logistics operations across three forward operating bases during 12-month deployment." Civilian employers generally view military deployments favorably, so there is no need to apologize or hide them. For more strategies, see our guide on handling resume employment gaps.',
  },
  {
    question: 'Should I list every duty station and assignment?',
    answer:
      'No. Consolidate similar roles under one entry if you held the same job title at multiple locations. For example, instead of listing three separate "Infantry Squad Leader" entries at three posts, combine them: "Infantry Squad Leader — Fort Bragg, Fort Campbell, JBLM (2018-2023)." Then use bullet points that draw from the best accomplishments across all assignments.',
  },
];

export default function ResumeBuilderForVeterans() {
  const config = SEO_PAGES.forVeterans;

  const allFaqs = [...config.faqs, ...VETERAN_FAQS];

  const schemas = usePageSchema({
    type: 'software',
    faqs: allFaqs,
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
            your experience into language that resonates with hiring managers. For a deeper
            dive into reframing your career narrative, read our{' '}
            <Link to="/blog/career-change-resume-guide" className="text-accent hover:underline">
              career change resume guide
            </Link>.
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

      {/* Common mistakes section */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            AVOID THESE
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            5 Common Veteran Resume Mistakes
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-10">
            Transitioning service members make these errors repeatedly. Fixing them
            can be the difference between an interview call and a rejection email.
          </p>
          <div className="max-w-4xl mx-auto space-y-5">
            {[
              {
                mistake: 'Using Military Jargon and Acronyms',
                fix: 'Acronyms like NCOER, BDE, CONOP, and MDMP mean nothing to a civilian recruiter. Translate every term into plain language. "Conducted BN-level MDMP" becomes "Led operational planning sessions for a 600-person organization." If you are unsure whether a term is jargon, it probably is.',
              },
              {
                mistake: 'Listing Every Deployment and PCS Move',
                fix: 'Deployment history reads like a travel log, not a qualifications summary. Instead, highlight what you accomplished during deployments: budgets managed, teams led, problems solved. Consolidate multiple similar assignments into one entry with combined results.',
              },
              {
                mistake: 'Not Translating MOS Codes to Civilian Job Titles',
                fix: 'Your MOS code is meaningless outside the military. Always lead with the civilian equivalent: "IT Systems Administrator (MOS 25B)" or "Emergency Medical Technician (MOS 68W)." The military code can go in parentheses for veterans-friendly employers, but the civilian title must come first.',
              },
              {
                mistake: 'Over-Detailing Classified or Sensitive Work',
                fix: 'You cannot — and should not — describe classified operations on a resume. Focus on the transferable skills: "Managed time-sensitive intelligence analysis for senior leadership" communicates value without compromising security. When in doubt, describe the skill, not the mission.',
              },
              {
                mistake: 'Missing Civilian Keywords Entirely',
                fix: 'Corporate ATS systems scan for industry-specific keywords that military resumes rarely contain. Run your resume through our resume keyword scanner to identify gaps, and weave civilian terms like "project management," "stakeholder communication," and "cross-functional collaboration" into your bullet points.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06]">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink mb-2">{item.mistake}</h3>
                    <p className="text-stone-warm font-extralight leading-relaxed">{item.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Security clearance section */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto cv-auto cv-h-300">
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
        <div className="mb-16 max-w-4xl mx-auto cv-auto cv-h-200">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            Veteran Resume Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ResourceCard to="/resume-keywords" title="Resume Keywords by Industry" description="Find civilian keywords for your target role" />
            <ResourceCard to="/templates/ats-friendly" title="ATS-Friendly Templates" description="Clean templates that pass corporate ATS systems" />
            <ResourceCard to="/examples/project-manager" title="Project Manager Resume Example" description="Great for veterans transitioning to PM roles" />
            <ResourceCard to="/examples/administrative-assistant" title="Administrative Assistant Resume Example" description="Leverage your organizational and logistics skills" />
            <ResourceCard to="/blog/career-change-resume-guide" title="Career Change Resume Guide" description="Reframe your experience for a new industry" />
            <ResourceCard to="/blog/resume-employment-gaps" title="Handling Employment Gaps" description="Address transition periods with confidence" />
            <ResourceCard to="/resume-keyword-scanner" title="ATS Keyword Scanner" description="Check if your resume matches the job description" />
          </div>
        </div>
      </RevealSection>

      {/* Inline FAQ section with veteran-specific questions */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-4xl mx-auto">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            VETERAN FAQ
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            Frequently Asked Questions for Veterans
          </h2>
          <div className="space-y-4">
            {VETERAN_FAQS.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 font-display font-bold text-ink hover:bg-chalk-dark/50 transition-colors duration-200">
                  <span className="pr-4">{faq.question}</span>
                  <span className="text-accent text-xl flex-shrink-0 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-stone-warm font-extralight leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}

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
