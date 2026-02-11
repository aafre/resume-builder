/**
 * Resume Keywords Hub Page
 * URL: /resume-keywords
 * Target keyword: "resume keywords"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FeatureGrid from '../shared/FeatureGrid';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import StepByStep from '../shared/StepByStep';
import RevealSection from '../shared/RevealSection';
import JobCategorySection from './JobCategorySection';
import { InContentAd, AD_CONFIG } from '../ads';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';
import { JOBS_DATABASE, getJobsByCategory } from '../../data/jobKeywords';

export default function ResumeKeywordsHub() {
  const config = SEO_PAGES.keywordsHub;

  // Group jobs by category
  const technologyJobs = getJobsByCategory('technology');
  const creativeJobs = getJobsByCategory('creative');
  const businessJobs = getJobsByCategory('business');
  const healthcareJobs = getJobsByCategory('healthcare');
  const tradesJobs = getJobsByCategory('trades');
  const educationJobs = getJobsByCategory('education');

  // Define category configurations (unified color scheme)
  const categories = [
    { id: 'technology', title: '💻 Technology', jobs: technologyJobs },
    { id: 'design', title: '🎨 Design', jobs: creativeJobs },
    { id: 'business', title: '📊 Business & Management', jobs: businessJobs },
    { id: 'healthcare', title: '🏥 Healthcare', jobs: healthcareJobs },
    { id: 'trades', title: '🔧 Trades & Skilled Labor', jobs: tradesJobs },
    { id: 'education', title: '📚 Education', jobs: educationJobs },
  ];

  // Generate schema items from all jobs
  const schemaItems = JOBS_DATABASE.map(job => ({
    name: `${job.title} Resume Keywords`,
    url: `/resume-keywords/${job.slug}`,
    description: `Essential keywords for ${job.title.toLowerCase()} roles`,
  }));

  const schemas = usePageSchema({
    type: 'itemList',
    items: schemaItems,
    faqs: config.faqs,
  });

  // Steps for "How to Find Keywords" section
  const howToSteps = [
    {
      number: 1,
      title: 'Collect Job Postings',
      description: 'Find 3-5 job ads for your target role. Look at both required and preferred qualifications.',
    },
    {
      number: 2,
      title: 'Identify Patterns',
      description: 'Highlight repeated skills, tools, certifications, and phrases. These are your target keywords.',
    },
    {
      number: 3,
      title: 'Place Strategically',
      description: 'Add keywords naturally to your summary, experience bullets, and skills section.',
    },
  ];

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* In-content Ad - Below hero */}
      <InContentAd adSlot={AD_CONFIG.slots.keywordsIncontent} marginY={32} />

      {/* Long-form intro for SEO ranking */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-premium border border-black/[0.06]">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-6">
              What Are Resume Keywords?
            </h2>
            <p className="text-lg text-stone-warm font-extralight mb-4 leading-relaxed">
              Resume keywords are specific words and phrases that hiring managers and Applicant
              Tracking Systems (ATS) use to identify qualified candidates. They include hard skills
              (like &ldquo;Python&rdquo; or &ldquo;SQL&rdquo;), soft skills (like &ldquo;cross-functional collaboration&rdquo;),
              job titles, certifications, industry tools, and action verbs that describe your
              accomplishments.
            </p>
            <p className="text-lg text-stone-warm font-extralight mb-4 leading-relaxed">
              Over 98% of Fortune 500 companies use ATS software to filter resumes before a
              human recruiter ever sees them. These systems scan your resume for keywords that
              match the job description and rank candidates accordingly. A resume without the
              right keywords will be filtered out regardless of qualifications.
            </p>
            <p className="text-lg text-stone-warm font-extralight mb-4 leading-relaxed">
              Keywords generally fall into five categories. <strong className="font-semibold text-ink">Hard skills</strong> are
              teachable abilities such as programming languages, accounting methods, or design
              software. <strong className="font-semibold text-ink">Soft skills</strong> are interpersonal qualities like leadership,
              communication, or problem-solving. <strong className="font-semibold text-ink">Technical tools</strong> are specific
              platforms and software you have used, from Salesforce and Jira to Tableau and AWS.{' '}
              <strong className="font-semibold text-ink">Certifications</strong> include industry credentials such as PMP, CPA,
              AWS Solutions Architect, or Google Analytics. Finally, <strong className="font-semibold text-ink">action verbs</strong>{' '}
              are the words that open your bullet points &mdash; managed, developed, implemented,
              optimized &mdash; and signal to both ATS and recruiters that you have hands-on
              experience.
            </p>
            <p className="text-lg text-stone-warm font-extralight mb-4 leading-relaxed">
              The most common mistake job seekers make is writing a single resume and sending it
              to every opening. Each job posting uses slightly different language, and ATS software
              matches your resume against that exact language. If a posting asks for &ldquo;project
              coordination&rdquo; and your resume says &ldquo;project management,&rdquo; some
              systems will not count that as a match. That is why tailoring your keywords to each
              application matters so much.
            </p>
            <p className="text-lg text-stone-warm font-extralight mb-4 leading-relaxed">
              Our approach is simple: start with a master keyword list for your industry and
              role, then customize for every application. The guides below cover 17+ industries
              and 50+ roles, each with curated keyword lists, technical tools, certifications,
              and real before-and-after bullet examples showing how to weave keywords into your
              resume naturally without keyword stuffing.
            </p>
            <p className="text-lg text-stone-warm font-extralight mb-6 leading-relaxed">
              Whether you are a software engineer looking for the right technical stack keywords,
              a marketing manager who needs to match demand-generation terminology, or a customer
              service professional listing CRM tools and satisfaction metrics, the right keywords
              can mean the difference between being screened out and landing an interview. Scroll
              down to find keyword guides organized by industry and role, or jump to the
              quick-reference lists below.
            </p>

            {/* Table of contents */}
            <div className="bg-chalk rounded-lg p-6 border border-black/[0.06]">
              <h3 className="font-bold text-ink mb-3">On this page</h3>
              <ul className="space-y-2 text-accent">
                <li><a href="#popular-keywords" className="hover:underline">Most Popular Keywords Across All Industries</a></li>
                <li><a href="#quick-reference" className="hover:underline">Quick-Reference Lists by Job Title</a></li>
                <li><a href="#technology" className="hover:underline">Technology &amp; Engineering Keywords</a></li>
                <li><a href="#design" className="hover:underline">Design &amp; Creative Keywords</a></li>
                <li><a href="#business" className="hover:underline">Business &amp; Management Keywords</a></li>
                <li><a href="#healthcare" className="hover:underline">Healthcare Keywords</a></li>
                <li><a href="#trades" className="hover:underline">Trades &amp; Skilled Labor Keywords</a></li>
                <li><a href="#education" className="hover:underline">Education Keywords</a></li>
                <li><a href="#how-to-find" className="hover:underline">How to Find Keywords for Your Resume</a></li>
                <li><a href="#faq" className="hover:underline">Frequently Asked Questions</a></li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-premium border border-black/[0.06] mt-8">
            <h2 className="text-2xl font-extrabold text-ink tracking-tight mb-4">
              Why Resume Keywords Matter in 2026
            </h2>
            <p className="text-lg text-stone-warm font-extralight mb-4 leading-relaxed">
              ATS technology has become more sophisticated but also more widespread. In 2026,
              even mid-size companies and startups use automated screening. The systems compare
              your resume against the job posting and assign a match score. Resumes below the
              threshold are never reviewed by a human.
            </p>
            <p className="text-lg text-stone-warm font-extralight mb-4 leading-relaxed">
              This means keyword optimization is no longer optional &mdash; it is a prerequisite
              for getting interviews. The good news is that using the right keywords also makes
              your resume more compelling to human readers, because it demonstrates you speak
              the language of your industry.
            </p>
            <p className="text-lg text-stone-warm font-extralight leading-relaxed">
              The most effective approach is to start with a strong base resume, then tailor
              the keywords for each application by mirroring the language from the specific job
              posting. Our industry guides below give you that strong foundation.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Most Popular Keywords Across All Industries */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto" id="popular-keywords">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-premium border border-black/[0.06]">
            <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase">Universal Keywords</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-6 mt-2">
              Most Popular Keywords Across All Industries
            </h2>
            <p className="text-lg text-stone-warm font-extralight mb-6 leading-relaxed">
              Regardless of your field, certain keywords appear in job postings across every
              industry. Adding these universal terms to your resume increases ATS match rates
              for almost any role.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-5 card-gradient-border shadow-premium">
                <h3 className="font-extrabold text-ink mb-3">Action Verbs</h3>
                <ul className="space-y-1 text-ink/80 text-sm">
                  <li>Managed</li>
                  <li>Developed</li>
                  <li>Implemented</li>
                  <li>Optimized</li>
                  <li>Collaborated</li>
                  <li>Analyzed</li>
                  <li>Led</li>
                  <li>Delivered</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-5 card-gradient-border shadow-premium">
                <h3 className="font-extrabold text-ink mb-3">Soft Skills</h3>
                <ul className="space-y-1 text-ink/80 text-sm">
                  <li>Cross-functional collaboration</li>
                  <li>Problem-solving</li>
                  <li>Communication</li>
                  <li>Time management</li>
                  <li>Leadership</li>
                  <li>Critical thinking</li>
                  <li>Adaptability</li>
                  <li>Attention to detail</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-5 card-gradient-border shadow-premium">
                <h3 className="font-extrabold text-ink mb-3">Business Terms</h3>
                <ul className="space-y-1 text-ink/80 text-sm">
                  <li>KPIs / Metrics</li>
                  <li>ROI</li>
                  <li>Stakeholder management</li>
                  <li>Process improvement</li>
                  <li>Budget management</li>
                  <li>Strategic planning</li>
                  <li>Data-driven decisions</li>
                  <li>Continuous improvement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Quick-Reference Lists by Job Title */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto" id="quick-reference">
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-premium border border-black/[0.06]">
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4">
              Quick-Reference: Top 10 Keywords by Job Title
            </h2>
            <p className="text-lg text-stone-warm font-extralight mb-8 leading-relaxed">
              Need keywords fast? Here are the top 10 most impactful resume keywords for
              the five most popular job categories. Click the role name to view the full
              keyword guide.
            </p>

            <div className="space-y-8">
              {/* Software Engineer */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm">
                <h3 className="text-xl font-bold text-ink mb-3">
                  <Link to="/resume-keywords/software-engineer" className="text-accent hover:underline">
                    Software Engineer
                  </Link>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'JavaScript', 'React', 'AWS', 'CI/CD', 'Microservices', 'REST APIs', 'Agile / Scrum', 'Git', 'System Design'].map(kw => (
                    <span key={kw} className="bg-accent/[0.06] text-ink text-sm px-3 py-1 rounded-full border border-accent/20">{kw}</span>
                  ))}
                </div>
              </div>

              {/* Product Manager */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm">
                <h3 className="text-xl font-bold text-ink mb-3">
                  <Link to="/resume-keywords/product-manager" className="text-accent hover:underline">
                    Product Manager
                  </Link>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Product Roadmap', 'User Research', 'A/B Testing', 'Agile / Scrum', 'Stakeholder Management', 'OKRs', 'Go-to-Market', 'Jira', 'Data-Driven', 'Cross-Functional'].map(kw => (
                    <span key={kw} className="bg-accent/[0.06] text-ink text-sm px-3 py-1 rounded-full border border-accent/20">{kw}</span>
                  ))}
                </div>
              </div>

              {/* Data Analyst */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm">
                <h3 className="text-xl font-bold text-ink mb-3">
                  <Link to="/resume-keywords/data-analyst" className="text-accent hover:underline">
                    Data Analyst
                  </Link>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['SQL', 'Python', 'Tableau', 'Excel', 'Data Visualization', 'ETL', 'Statistical Analysis', 'Power BI', 'A/B Testing', 'Data Modeling'].map(kw => (
                    <span key={kw} className="bg-accent/[0.06] text-ink text-sm px-3 py-1 rounded-full border border-accent/20">{kw}</span>
                  ))}
                </div>
              </div>

              {/* Customer Service */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm">
                <h3 className="text-xl font-bold text-ink mb-3">
                  <Link to="/resume-keywords/customer-service" className="text-accent hover:underline">
                    Customer Service
                  </Link>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['CRM (Salesforce / Zendesk)', 'Customer Satisfaction (CSAT)', 'Conflict Resolution', 'First Call Resolution', 'Upselling', 'NPS', 'Ticket Management', 'SLA Compliance', 'Active Listening', 'De-escalation'].map(kw => (
                    <span key={kw} className="bg-accent/[0.06] text-ink text-sm px-3 py-1 rounded-full border border-accent/20">{kw}</span>
                  ))}
                </div>
              </div>

              {/* Marketing Manager */}
              <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-sm">
                <h3 className="text-xl font-bold text-ink mb-3">
                  <Link to="/resume-keywords/marketing-manager" className="text-accent hover:underline">
                    Marketing Manager
                  </Link>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['SEO / SEM', 'Google Analytics', 'Content Strategy', 'Marketing Automation', 'HubSpot', 'Demand Generation', 'Brand Management', 'Campaign ROI', 'Social Media Marketing', 'Lead Nurturing'].map(kw => (
                    <span key={kw} className="bg-accent/[0.06] text-ink text-sm px-3 py-1 rounded-full border border-accent/20">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Featured: Customer Service Keywords */}
      <RevealSection>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8 text-center">
            Most popular keyword guide
          </h2>
          <Link
            to="/resume-keywords/customer-service"
            className="block max-w-4xl mx-auto bg-accent/[0.04] border-2 border-accent/20 hover:border-accent/70 rounded-2xl p-8 shadow-premium hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="inline-block bg-accent/10 text-ink text-xs font-bold px-3 py-1 rounded-full mb-3">
                  FEATURED
                </span>
                <h3 className="text-2xl font-bold text-ink mb-2">
                  Customer Service Resume Keywords
                </h3>
                <p className="text-stone-warm">
                  100+ keywords including CRM software (Salesforce, Zendesk), soft skills, CSAT/NPS metrics,
                  and before/after resume examples for 5 different customer service roles.
                </p>
              </div>
              <div className="text-accent font-semibold whitespace-nowrap text-lg">
                View Guide →
              </div>
            </div>
          </Link>
        </div>
      </RevealSection>

      <RevealSection>
        <div className="mb-16">
          <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">By Industry</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-12 text-center">
            Browse keywords by industry
          </h2>

          {categories.map(category => (
            <JobCategorySection
              key={category.title}
              id={category.id}
              title={category.title}
              jobs={category.jobs}
            />
          ))}
        </div>
      </RevealSection>

      {/* Keyword Scanner CTA */}
      <RevealSection>
        <div className="mb-16 max-w-4xl mx-auto">
          <Link
            to="/resume-keyword-scanner"
            className="block bg-ink rounded-2xl p-8 text-center relative overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-accent/[0.07] blur-3xl pointer-events-none" />
            <div className="relative">
              <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-3 block">FREE TOOL</span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-3">
                ATS Resume Keyword Scanner
              </h2>
              <p className="text-white/70 font-extralight max-w-xl mx-auto mb-4 leading-relaxed">
                Paste your resume and a job description to instantly see your keyword match score, missing keywords,
                and exactly where to add them.
              </p>
              <span className="inline-block btn-primary px-6 py-3">
                Scan Your Resume →
              </span>
            </div>
          </Link>
        </div>
      </RevealSection>

      <div className="mb-16" id="how-to-find">
        <span className="block text-center font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">The Process</span>
        <StepByStep steps={howToSteps} title="How to find keywords for your resume" />
      </div>

      <div id="faq">
        <FAQSection faqs={config.faqs} />
      </div>

      <DownloadCTA
        title="Ready to Optimize Your Resume?"
        description="Use these keywords with our ATS-friendly templates for maximum impact."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
