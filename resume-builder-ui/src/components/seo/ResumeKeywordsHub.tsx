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

  // Define category configurations
  const categories = [
    {
      id: 'technology',
      title: '💻 Technology',
      jobs: technologyJobs,
      colorScheme: {
        border: 'border-blue-200',
        hoverBorder: 'hover:border-blue-400',
        text: 'text-blue-600',
      },
    },
    {
      id: 'design',
      title: '🎨 Design',
      jobs: creativeJobs,
      colorScheme: {
        border: 'border-purple-200',
        hoverBorder: 'hover:border-purple-400',
        text: 'text-purple-600',
      },
    },
    {
      id: 'business',
      title: '📊 Business & Management',
      jobs: businessJobs,
      colorScheme: {
        border: 'border-green-200',
        hoverBorder: 'hover:border-green-400',
        text: 'text-green-600',
      },
    },
    {
      id: 'healthcare',
      title: '🏥 Healthcare',
      jobs: healthcareJobs,
      colorScheme: {
        border: 'border-red-200',
        hoverBorder: 'hover:border-red-400',
        text: 'text-red-600',
      },
    },
    {
      id: 'trades',
      title: '🔧 Trades & Skilled Labor',
      jobs: tradesJobs,
      colorScheme: {
        border: 'border-amber-200',
        hoverBorder: 'hover:border-amber-400',
        text: 'text-amber-600',
      },
    },
    {
      id: 'education',
      title: '📚 Education',
      jobs: educationJobs,
      colorScheme: {
        border: 'border-teal-200',
        hoverBorder: 'hover:border-teal-400',
        text: 'text-teal-600',
      },
    },
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

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* In-content Ad - Below hero */}
      <InContentAd adSlot={AD_CONFIG.slots.keywordsIncontent} marginY={32} />

      {/* Long-form intro for SEO ranking */}
      <div className="mb-16 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-8 md:p-10 shadow-md">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What Are Resume Keywords?
          </h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Resume keywords are specific words and phrases that hiring managers and Applicant
            Tracking Systems (ATS) use to identify qualified candidates. They include hard skills
            (like &ldquo;Python&rdquo; or &ldquo;SQL&rdquo;), soft skills (like &ldquo;cross-functional collaboration&rdquo;),
            job titles, certifications, industry tools, and action verbs that describe your
            accomplishments.
          </p>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Over 98% of Fortune 500 companies use ATS software to filter resumes before a
            human recruiter ever sees them. These systems scan your resume for keywords that
            match the job description and rank candidates accordingly. A resume without the
            right keywords will be filtered out regardless of qualifications.
          </p>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Keywords generally fall into five categories. <strong>Hard skills</strong> are
            teachable abilities such as programming languages, accounting methods, or design
            software. <strong>Soft skills</strong> are interpersonal qualities like leadership,
            communication, or problem-solving. <strong>Technical tools</strong> are specific
            platforms and software you have used, from Salesforce and Jira to Tableau and AWS.{' '}
            <strong>Certifications</strong> include industry credentials such as PMP, CPA,
            AWS Solutions Architect, or Google Analytics. Finally, <strong>action verbs</strong>{' '}
            are the words that open your bullet points &mdash; managed, developed, implemented,
            optimized &mdash; and signal to both ATS and recruiters that you have hands-on
            experience.
          </p>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            The most common mistake job seekers make is writing a single resume and sending it
            to every opening. Each job posting uses slightly different language, and ATS software
            matches your resume against that exact language. If a posting asks for &ldquo;project
            coordination&rdquo; and your resume says &ldquo;project management,&rdquo; some
            systems will not count that as a match. That is why tailoring your keywords to each
            application matters so much.
          </p>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Our approach is simple: start with a master keyword list for your industry and
            role, then customize for every application. The guides below cover 17+ industries
            and 50+ roles, each with curated keyword lists, technical tools, certifications,
            and real before-and-after bullet examples showing how to weave keywords into your
            resume naturally without keyword stuffing.
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Whether you are a software engineer looking for the right technical stack keywords,
            a marketing manager who needs to match demand-generation terminology, or a customer
            service professional listing CRM tools and satisfaction metrics, the right keywords
            can mean the difference between being screened out and landing an interview. Scroll
            down to find keyword guides organized by industry and role, or jump to the
            quick-reference lists below.
          </p>

          {/* Table of contents */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">On this page</h3>
            <ul className="space-y-2 text-blue-600">
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

        <div className="bg-white rounded-xl p-8 md:p-10 shadow-md mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Resume Keywords Matter in 2026
          </h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            ATS technology has become more sophisticated but also more widespread. In 2026,
            even mid-size companies and startups use automated screening. The systems compare
            your resume against the job posting and assign a match score. Resumes below the
            threshold are never reviewed by a human.
          </p>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            This means keyword optimization is no longer optional &mdash; it is a prerequisite
            for getting interviews. The good news is that using the right keywords also makes
            your resume more compelling to human readers, because it demonstrates you speak
            the language of your industry.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            The most effective approach is to start with a strong base resume, then tailor
            the keywords for each application by mirroring the language from the specific job
            posting. Our industry guides below give you that strong foundation.
          </p>
        </div>
      </div>

      {/* Most Popular Keywords Across All Industries */}
      <div className="mb-16 max-w-4xl mx-auto" id="popular-keywords">
        <div className="bg-white rounded-xl p-8 md:p-10 shadow-md">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Most Popular Keywords Across All Industries
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Regardless of your field, certain keywords appear in job postings across every
            industry. Adding these universal terms to your resume increases ATS match rates
            for almost any role.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-3">Action Verbs</h3>
              <ul className="space-y-1 text-blue-800 text-sm">
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
            <div className="bg-green-50 rounded-lg p-5 border border-green-100">
              <h3 className="font-bold text-green-900 mb-3">Soft Skills</h3>
              <ul className="space-y-1 text-green-800 text-sm">
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
            <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
              <h3 className="font-bold text-purple-900 mb-3">Business Terms</h3>
              <ul className="space-y-1 text-purple-800 text-sm">
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

      {/* Quick-Reference Lists by Job Title */}
      <div className="mb-16 max-w-4xl mx-auto" id="quick-reference">
        <div className="bg-white rounded-xl p-8 md:p-10 shadow-md">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quick-Reference: Top 10 Keywords by Job Title
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Need keywords fast? Here are the top 10 most impactful resume keywords for
            the five most popular job categories. Click the role name to view the full
            keyword guide.
          </p>

          <div className="space-y-8">
            {/* Software Engineer */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <Link to="/resume-keywords/software-engineer" className="text-blue-600 hover:underline">
                  Software Engineer
                </Link>
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'JavaScript', 'React', 'AWS', 'CI/CD', 'Microservices', 'REST APIs', 'Agile / Scrum', 'Git', 'System Design'].map(kw => (
                  <span key={kw} className="bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded-full border border-blue-200">{kw}</span>
                ))}
              </div>
            </div>

            {/* Product Manager */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <Link to="/resume-keywords/product-manager" className="text-blue-600 hover:underline">
                  Product Manager
                </Link>
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Product Roadmap', 'User Research', 'A/B Testing', 'Agile / Scrum', 'Stakeholder Management', 'OKRs', 'Go-to-Market', 'Jira', 'Data-Driven', 'Cross-Functional'].map(kw => (
                  <span key={kw} className="bg-green-50 text-green-800 text-sm px-3 py-1 rounded-full border border-green-200">{kw}</span>
                ))}
              </div>
            </div>

            {/* Data Analyst */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <Link to="/resume-keywords/data-analyst" className="text-blue-600 hover:underline">
                  Data Analyst
                </Link>
              </h3>
              <div className="flex flex-wrap gap-2">
                {['SQL', 'Python', 'Tableau', 'Excel', 'Data Visualization', 'ETL', 'Statistical Analysis', 'Power BI', 'A/B Testing', 'Data Modeling'].map(kw => (
                  <span key={kw} className="bg-amber-50 text-amber-800 text-sm px-3 py-1 rounded-full border border-amber-200">{kw}</span>
                ))}
              </div>
            </div>

            {/* Customer Service */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <Link to="/resume-keywords/customer-service" className="text-blue-600 hover:underline">
                  Customer Service
                </Link>
              </h3>
              <div className="flex flex-wrap gap-2">
                {['CRM (Salesforce / Zendesk)', 'Customer Satisfaction (CSAT)', 'Conflict Resolution', 'First Call Resolution', 'Upselling', 'NPS', 'Ticket Management', 'SLA Compliance', 'Active Listening', 'De-escalation'].map(kw => (
                  <span key={kw} className="bg-red-50 text-red-800 text-sm px-3 py-1 rounded-full border border-red-200">{kw}</span>
                ))}
              </div>
            </div>

            {/* Marketing Manager */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <Link to="/resume-keywords/marketing-manager" className="text-blue-600 hover:underline">
                  Marketing Manager
                </Link>
              </h3>
              <div className="flex flex-wrap gap-2">
                {['SEO / SEM', 'Google Analytics', 'Content Strategy', 'Marketing Automation', 'HubSpot', 'Demand Generation', 'Brand Management', 'Campaign ROI', 'Social Media Marketing', 'Lead Nurturing'].map(kw => (
                  <span key={kw} className="bg-purple-50 text-purple-800 text-sm px-3 py-1 rounded-full border border-purple-200">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {config.features && <FeatureGrid features={config.features} />}

      {/* Featured: Customer Service Keywords */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Most popular keyword guide
        </h2>
        <Link
          to="/resume-keywords/customer-service"
          className="block max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-8 shadow-md hover:shadow-xl transition-all"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
                FEATURED
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Customer Service Resume Keywords
              </h3>
              <p className="text-gray-600">
                100+ keywords including CRM software (Salesforce, Zendesk), soft skills, CSAT/NPS metrics,
                and before/after resume examples for 5 different customer service roles.
              </p>
            </div>
            <div className="text-blue-600 font-semibold whitespace-nowrap text-lg">
              View Guide →
            </div>
          </div>
        </Link>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          Browse keywords by industry
        </h2>

        {categories.map(category => (
          <JobCategorySection
            key={category.title}
            id={category.id}
            title={category.title}
            jobs={category.jobs}
            colorScheme={category.colorScheme}
          />
        ))}
      </div>

      <div className="mb-16" id="how-to-find">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          How to find keywords for your resume
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-4">1️⃣</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Collect job postings
              </h3>
              <p className="text-gray-700">
                Find 3-5 job ads for your target role. Look at both required and preferred qualifications.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-4">2️⃣</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Identify patterns
              </h3>
              <p className="text-gray-700">
                Highlight repeated skills, tools, certifications, and phrases. These are your target keywords.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-4">3️⃣</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Place strategically
              </h3>
              <p className="text-gray-700">
                Add keywords naturally to your summary, experience bullets, and skills section.
              </p>
            </div>
          </div>
        </div>
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
