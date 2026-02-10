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

export default function ResumeBuilderForStudents() {
  const config = SEO_PAGES.forStudents;
  const schemas = usePageSchema({
    type: 'software',
    faqs: config.faqs,
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

      {/* Related resources */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto">
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
