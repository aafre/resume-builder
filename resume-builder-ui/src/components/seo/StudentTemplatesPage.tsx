/**
 * Student Resume Templates Page
 * URL: /templates/resume-templates-for-students
 * Target keywords: "student resume template", "entry level resume template"
 */

import { Link } from 'react-router-dom';
import { Check, Minus } from 'lucide-react';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import Band from '../shared/Band';
import TemplateCarousel from '../TemplateCarousel';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

const STUDENT_RESOURCES = [
  {
    to: '/blog/resume-no-experience',
    title: 'Writing a Resume With No Experience',
    note: 'Complete guide for first-time job seekers',
  },
  {
    to: '/blog/resume-action-verbs',
    title: '200+ Action Verbs for Resumes',
    note: 'Powerful words to describe your achievements',
  },
  {
    to: '/blog/how-to-list-skills',
    title: 'How to List Skills on Your Resume',
    note: 'Showcase your abilities effectively',
  },
  {
    to: '/blog/job-interview-guide',
    title: 'Job Interview Guide',
    note: 'Nail your first professional interview',
  },
];

export default function StudentTemplatesPage() {
  const config = SEO_PAGES.studentTemplates;
  const schemas = usePageSchema({
    type: 'itemList',
    faqs: config.faqs,
    items: [
      { name: 'Student Resume Template', url: '/templates', description: 'Optimized for students and recent graduates' },
    ],
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Template Gallery Section */}
      <section className="py-12 -mx-4 sm:-mx-6 md:-mx-8">
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
            The gallery
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4">
            Templates Built for Students
          </h2>
          <p className="text-lg md:text-xl font-extralight text-ink/60 max-w-2xl mx-auto">
            Our templates are designed to highlight education, projects, and skills—
            perfect when you're building your career from the ground up.
          </p>
        </div>
        <TemplateCarousel showHeader={false} />
      </section>

      {/* What to Include. Do/Skip are separated by mark and by heading colour,
          not by a 4px coloured border-left — the red rule was the loudest thing
          in a section addressed to someone writing their first resume. */}
      <Band tone="chalk-dark" reserve="cv-h-600">
        <div className="my-0">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            The shortlist
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            What to Include on Your Student Resume
          </h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-black/[0.06] p-6 md:p-8">
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-accent-text mb-5">Do Include</h3>
              <ul className="space-y-3 text-ink/60 font-extralight">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-1 flex-none text-accent-text" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong className="font-bold text-ink">Education:</strong> Degree, major, expected graduation, GPA (if 3.0+)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-1 flex-none text-accent-text" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong className="font-bold text-ink">Projects:</strong> Academic, personal, or capstone projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-1 flex-none text-accent-text" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong className="font-bold text-ink">Skills:</strong> Technical and soft skills relevant to your field</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-1 flex-none text-accent-text" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong className="font-bold text-ink">Activities:</strong> Clubs, organizations, leadership roles</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-1 flex-none text-accent-text" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong className="font-bold text-ink">Internships:</strong> Any relevant work experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-1 flex-none text-accent-text" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong className="font-bold text-ink">Volunteer Work:</strong> Shows initiative and values</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-black/[0.06] p-6 md:p-8">
              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-ink/60 mb-5">Skip These</h3>
              <ul className="space-y-3 text-ink/60 font-extralight">
                <li className="flex items-start gap-2">
                  <Minus className="w-4 h-4 mt-1 flex-none text-ink/40" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong className="font-bold text-ink">High School:</strong> Once in college, drop high school details</span>
                </li>
                <li className="flex items-start gap-2">
                  <Minus className="w-4 h-4 mt-1 flex-none text-ink/40" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong className="font-bold text-ink">Irrelevant Jobs:</strong> Focus on transferable skills only</span>
                </li>
                <li className="flex items-start gap-2">
                  <Minus className="w-4 h-4 mt-1 flex-none text-ink/40" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong className="font-bold text-ink">Objective Statement:</strong> Use a summary or skip it</span>
                </li>
                <li className="flex items-start gap-2">
                  <Minus className="w-4 h-4 mt-1 flex-none text-ink/40" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong className="font-bold text-ink">References:</strong> Save space, provide when asked</span>
                </li>
                <li className="flex items-start gap-2">
                  <Minus className="w-4 h-4 mt-1 flex-none text-ink/40" strokeWidth={2.5} aria-hidden="true" />
                  <span><strong className="font-bold text-ink">Personal Info:</strong> No age, photo, or marital status</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Band>

      <RevealSection variant="fade-up">
        {config.features && <FeatureGrid features={config.features} />}
      </RevealSection>

      {/* Section-Specific Tips */}
      <RevealSection variant="fade-up">
        <div className="my-16 cv-auto cv-h-700">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            Section by section
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            How to Write Each Section
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-8 card-gradient-border spot-card shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-display text-xl font-bold text-ink mb-3">Education Section</h3>
              <p className="text-ink/60 mb-3">
                As a student, this is your most valuable section. Include:
              </p>
              <ul className="list-disc list-inside text-ink/60 space-y-1">
                <li>Full degree name and major/minor</li>
                <li>University name and location</li>
                <li>Expected graduation date (or graduation date)</li>
                <li>GPA if 3.0 or higher (can include major GPA separately)</li>
                <li>Relevant coursework for your target role</li>
                <li>Academic honors, Dean's List, scholarships</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 card-gradient-border spot-card shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-display text-xl font-bold text-ink mb-3">Projects Section</h3>
              <p className="text-ink/60 mb-3">
                Projects demonstrate practical skills when you lack work experience:
              </p>
              <ul className="list-disc list-inside text-ink/60 space-y-1">
                <li>Class projects with real-world applications</li>
                <li>Personal projects or side hustles</li>
                <li>Hackathon projects with outcomes</li>
                <li>Research projects or published papers</li>
                <li>Include technologies used and results achieved</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 card-gradient-border spot-card shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-display text-xl font-bold text-ink mb-3">Activities & Leadership</h3>
              <p className="text-ink/60 mb-3">
                Extracurriculars show soft skills employers value:
              </p>
              <ul className="list-disc list-inside text-ink/60 space-y-1">
                <li>Leadership roles in clubs or organizations</li>
                <li>Sports teams (especially captain/leadership)</li>
                <li>Volunteer work and community service</li>
                <li>Fraternities/sororities (focus on leadership)</li>
                <li>Quantify when possible (e.g., "Managed budget of $5,000")</li>
              </ul>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection variant="fade-up">
        <div className="cv-auto cv-h-500">
          <FAQSection faqs={config.faqs} />
        </div>
      </RevealSection>

      {/* Related Resources */}
      <RevealSection variant="fade-up">
        <div className="my-16 cv-auto cv-h-300">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            Keep going
          </p>
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            Helpful Resources for Students
          </h3>
          {/* Four green-tinted panels in a row was the page's largest accent
              surface, spent on links. Resource cards instead — the ground
              brightens toward the pointer rather than glowing at rest. */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
            {STUDENT_RESOURCES.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="block bg-chalk-dark rounded-xl p-5 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
              >
                <p className="font-bold text-ink mb-1">{r.title}</p>
                <p className="text-ink/60 text-sm">{r.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Related Templates */}
      <RevealSection variant="fade-up">
        <div className="my-16 cv-auto cv-h-200">
          <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase text-center mb-4">
            Elsewhere
          </p>
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-12 md:mb-16 text-center">
            Explore Other Template Styles
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/templates/modern-resume-templates"
              className="btn-secondary py-3 px-6"
            >
              Modern Templates
            </Link>
            <Link
              to="/templates/minimalist-resume-templates"
              className="btn-secondary py-3 px-6"
            >
              Minimalist Templates
            </Link>
            <Link
              to="/templates/ats-friendly"
              className="btn-secondary py-3 px-6"
            >
              ATS-Friendly Templates
            </Link>
          </div>
        </div>
      </RevealSection>

      <RevealSection variant="fade-up">
        <div className="cv-auto cv-h-300">
          <DownloadCTA
            title="Ready to Land Your First Job?"
            description="Build a professional resume that showcases your potential. Free for students, always."
            primaryText="Start Building"
            primaryHref="/templates"
          />
        </div>
      </RevealSection>
    </SEOPageLayout>
  );
}
