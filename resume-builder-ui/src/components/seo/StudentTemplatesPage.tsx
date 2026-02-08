/**
 * Student Resume Templates Page
 * URL: /templates/resume-templates-for-students
 * Target keywords: "student resume template", "entry level resume template"
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Templates Built for Students
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our templates are designed to highlight education, projects, and skills—
            perfect when you're building your career from the ground up.
          </p>
        </div>
        <TemplateCarousel showHeader={false} />
      </section>

      {/* What to Include Section */}
      <div className="my-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          What to Include on Your Student Resume
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">Do Include</h3>
            <ul className="space-y-3 text-green-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Education:</strong> Degree, major, expected graduation, GPA (if 3.0+)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Projects:</strong> Academic, personal, or capstone projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Skills:</strong> Technical and soft skills relevant to your field</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Activities:</strong> Clubs, organizations, leadership roles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Internships:</strong> Any relevant work experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Volunteer Work:</strong> Shows initiative and values</span>
              </li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">Skip These</h3>
            <ul className="space-y-3 text-red-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">×</span>
                <span><strong>High School:</strong> Once in college, drop high school details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">×</span>
                <span><strong>Irrelevant Jobs:</strong> Focus on transferable skills only</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">×</span>
                <span><strong>Objective Statement:</strong> Use a summary or skip it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">×</span>
                <span><strong>References:</strong> Save space, provide when asked</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">×</span>
                <span><strong>Personal Info:</strong> No age, photo, or marital status</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Section-Specific Tips */}
      <div className="my-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          How to Write Each Section
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Education Section</h3>
            <p className="text-gray-700 mb-3">
              As a student, this is your most valuable section. Include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Full degree name and major/minor</li>
              <li>University name and location</li>
              <li>Expected graduation date (or graduation date)</li>
              <li>GPA if 3.0 or higher (can include major GPA separately)</li>
              <li>Relevant coursework for your target role</li>
              <li>Academic honors, Dean's List, scholarships</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Projects Section</h3>
            <p className="text-gray-700 mb-3">
              Projects demonstrate practical skills when you lack work experience:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Class projects with real-world applications</li>
              <li>Personal projects or side hustles</li>
              <li>Hackathon projects with outcomes</li>
              <li>Research projects or published papers</li>
              <li>Include technologies used and results achieved</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Activities & Leadership</h3>
            <p className="text-gray-700 mb-3">
              Extracurriculars show soft skills employers value:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Leadership roles in clubs or organizations</li>
              <li>Sports teams (especially captain/leadership)</li>
              <li>Volunteer work and community service</li>
              <li>Fraternities/sororities (focus on leadership)</li>
              <li>Quantify when possible (e.g., "Managed budget of $5,000")</li>
            </ul>
          </div>
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      {/* Related Resources */}
      <div className="my-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Helpful Resources for Students
        </h3>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
          <Link
            to="/blog/resume-no-experience"
            className="block p-4 bg-accent/[0.06] border border-accent/20 rounded-xl hover:bg-accent/10 transition-colors"
          >
            <p className="font-semibold text-ink">Writing a Resume With No Experience</p>
            <p className="text-accent text-sm">Complete guide for first-time job seekers</p>
          </Link>
          <Link
            to="/blog/resume-action-verbs"
            className="block p-4 bg-accent/[0.06] border border-accent/20 rounded-xl hover:bg-accent/10 transition-colors"
          >
            <p className="font-semibold text-ink">200+ Action Verbs for Resumes</p>
            <p className="text-accent text-sm">Powerful words to describe your achievements</p>
          </Link>
          <Link
            to="/blog/how-to-list-skills"
            className="block p-4 bg-accent/[0.06] border border-accent/20 rounded-xl hover:bg-accent/10 transition-colors"
          >
            <p className="font-semibold text-ink">How to List Skills on Your Resume</p>
            <p className="text-accent text-sm">Showcase your abilities effectively</p>
          </Link>
          <Link
            to="/blog/job-interview-guide"
            className="block p-4 bg-accent/[0.06] border border-accent/20 rounded-xl hover:bg-accent/10 transition-colors"
          >
            <p className="font-semibold text-ink">Job Interview Guide</p>
            <p className="text-accent text-sm">Nail your first professional interview</p>
          </Link>
        </div>
      </div>

      {/* Related Templates */}
      <div className="my-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Explore Other Template Styles
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/templates/modern-resume-templates"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Modern Templates
          </Link>
          <Link
            to="/templates/minimalist-resume-templates"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Minimalist Templates
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
        title="Ready to Land Your First Job?"
        description="Build a professional resume that showcases your potential. Free for students, always."
        primaryText="Start Building"
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
