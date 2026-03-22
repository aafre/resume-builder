/**
 * Free Resume Builder for Students
 * URL: /free-resume-builder-for-students
 * Target keyword: "free resume builder for students"
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

const STUDENT_FAQS = [
  {
    question: 'Should I include my GPA on a student resume?',
    answer:
      'Include your GPA if it is 3.0 or higher. If your major GPA is significantly stronger than your cumulative GPA, list the major GPA instead. Once you have two or more years of professional experience, remove GPA entirely — employers care more about work results at that point.',
  },
  {
    question: 'How do I list volunteer work on my resume?',
    answer:
      'Treat volunteer roles like paid positions. Use a "Volunteer Experience" or "Community Involvement" section with the organization name, your role title, dates, and 2-3 bullet points that highlight measurable outcomes. For example: "Organized campus food drive that collected 1,200 lbs of donations, a 40% increase over the previous year."',
  },
  {
    question: 'Is a one-page resume required for students?',
    answer:
      'Yes, one page is the standard for students and recent graduates. Recruiters spend about 7 seconds scanning a resume, and a concise single page forces you to prioritize your most relevant experiences. If you are struggling to fill an entire page, add academic projects, relevant coursework, or certifications.',
  },
  {
    question: 'Should I include high school on my college resume?',
    answer:
      'Remove high school once you have completed your first year of college. The only exceptions are if you earned a notable distinction (valedictorian, state championship) directly relevant to the role, or if the employer is in your high school\'s local area and you want to show community ties.',
  },
  {
    question: 'How should I list academic projects on my resume?',
    answer:
      'Create a "Projects" section and format each entry like work experience: project name, course or context, date, and 2-3 bullet points describing what you built, the tools you used, and the outcome. Quantify where possible — "Built a Python web scraper that collected 10,000+ data points for a market analysis project."',
  },
  {
    question: 'What if I have no internships or work experience?',
    answer:
      'Many students land great jobs without formal internships. Focus on academic projects, leadership roles in clubs or student organizations, volunteer work, freelance projects, and relevant coursework. Our guide on writing a resume with no experience walks you through structuring these sections to impress recruiters.',
  },
];

export default function ResumeBuilderForStudents() {
  const config = SEO_PAGES.forStudents;

  const allFaqs = [...config.faqs, ...STUDENT_FAQS];

  const schemas = usePageSchema({
    type: 'software',
    faqs: allFaqs,
    breadcrumbs: config.breadcrumbs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {config.features && <FeatureGrid features={config.features} />}

      {/* Student-specific tips */}
      <RevealSection variant="fade-up">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            STUDENT TIPS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            5 Tips for Writing a Student Resume
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { title: 'Lead with Education', desc: 'As a student, your education is your strongest asset. Place it before work experience. Include relevant coursework, academic honors, and your GPA if it is 3.5 or above.' },
              { title: 'Showcase Projects Over Job History', desc: 'Academic projects, capstone work, hackathons, and personal projects demonstrate real skills. Format them like work experience with tools used and outcomes achieved.' },
              { title: 'Highlight Transferable Skills', desc: 'Part-time jobs, volunteer work, and club leadership all build skills employers value: communication, teamwork, time management, and problem-solving.' },
              { title: 'Use Industry Keywords', desc: 'Mirror the language from the job posting. If they ask for "data analysis," use that exact phrase — not just "worked with numbers." Browse our resume keywords guides for your target industry.' },
              { title: 'Keep It to One Page', desc: 'Employers expect student resumes to be concise. One page forces you to prioritize your most relevant experiences and skills.' },
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
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            AVOID THESE
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6 text-center">
            5 Common Student Resume Mistakes
          </h2>
          <p className="text-lg md:text-xl font-extralight text-stone-warm max-w-4xl mx-auto text-center leading-relaxed mb-10">
            Career centers see these errors on nearly every first draft. Fixing them will
            immediately set your resume apart from other applicants.
          </p>
          <div className="max-w-4xl mx-auto space-y-5">
            {[
              {
                mistake: 'Listing Irrelevant High School Activities',
                fix: 'Once you are in college, drop high school clubs, sports, and awards unless they are directly relevant to the job. Replace them with college involvement, projects, or part-time work that demonstrates professional growth.',
              },
              {
                mistake: 'Using an Objective Statement Instead of a Summary',
                fix: 'Objectives like "Seeking an entry-level position to gain experience" tell the employer nothing useful. Write a 2-3 sentence professional summary that highlights your strongest skills, relevant coursework, and what you bring to the role.',
              },
              {
                mistake: 'No Quantification on Bullet Points',
                fix: 'Vague bullets like "Helped with social media" get ignored. Add numbers: "Managed Instagram account, growing followers from 800 to 2,400 in one semester." Even estimates are better than no numbers at all. See our guide on how to quantify resume accomplishments.',
              },
              {
                mistake: 'Listing Generic Skills Without Context',
                fix: 'Skills like "Microsoft Office" or "teamwork" without evidence are meaningless. Instead, weave skills into experience bullets: "Collaborated with a 5-person team to deliver a React web app on a 3-week deadline." Use our resume keyword scanner to find the exact skills employers are searching for.',
              },
              {
                mistake: 'Making the Resume Too Long for Your Experience Level',
                fix: 'A two-page resume with thin content signals poor editing, not deep experience. Stick to one page. If you cannot fill it, that is a sign you need to add projects, certifications, or volunteer work — not pad existing entries.',
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

      {/* Related resources */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto cv-auto cv-h-300">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-6">
            Student Resume Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/blog/resume-no-experience" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Resume With No Experience Guide</h3>
              <p className="text-stone-warm text-sm">Step-by-step guide with copy-paste examples</p>
            </Link>
            <Link to="/templates/resume-templates-for-students" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Student Resume Templates</h3>
              <p className="text-stone-warm text-sm">Templates that highlight education and projects</p>
            </Link>
            <Link to="/resume-keywords" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Resume Keywords by Industry</h3>
              <p className="text-stone-warm text-sm">Find the right keywords for your target role</p>
            </Link>
            <Link to="/blog/professional-summary-examples" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Professional Summary Examples</h3>
              <p className="text-stone-warm text-sm">Entry-level summary templates you can adapt</p>
            </Link>
            <Link to="/examples/college-student" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">College Student Resume Example</h3>
              <p className="text-stone-warm text-sm">Full resume example with education-first layout</p>
            </Link>
            <Link to="/examples/internship" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Internship Resume Example</h3>
              <p className="text-stone-warm text-sm">Tailored for internship applications</p>
            </Link>
            <Link to="/examples/entry-level-marketing" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">Entry-Level Resume Example</h3>
              <p className="text-stone-warm text-sm">How to stand out with limited experience</p>
            </Link>
            <Link to="/blog/how-to-list-skills" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">How to List Skills on a Resume</h3>
              <p className="text-stone-warm text-sm">Structure your skills section for maximum impact</p>
            </Link>
            <Link to="/resume-keyword-scanner" className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]">
              <h3 className="font-bold text-ink mb-1">ATS Keyword Scanner</h3>
              <p className="text-stone-warm text-sm">Check if your resume matches the job description</p>
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* Inline FAQ section with student-specific questions */}
      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-4xl mx-auto">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
            STUDENT FAQ
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-8 text-center">
            Frequently Asked Questions for Students
          </h2>
          <div className="space-y-4">
            {STUDENT_FAQS.map((faq, i) => (
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
        title="Build Your Student Resume Today"
        description="Professional, ATS-friendly templates designed for students. 100% free, no sign-up required."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
