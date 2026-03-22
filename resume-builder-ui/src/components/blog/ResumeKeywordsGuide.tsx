import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";

export default function ResumeKeywordsGuide() {
  return (
    <BlogLayout
      title="Resume Keywords by Industry: The Complete 2026 Guide"
      description="The definitive guide to resume keywords recruiters and ATS systems are scanning for in 2026. Learn exactly where to place keywords for maximum impact."
      publishDate="2026-01-15"
      lastUpdated="2026-03-22"
      readTime="14–17 min"
      keywords={[
        "resume keywords",
        "industry keywords",
        "ATS resume tips",
        "resume optimization 2026",
        "career keywords",
        "resume phrases",
        "resume keyword scanner",
        "ats keywords by industry",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Your resume isn't just read by people anymore.{" "}
          <strong>
            Over 98% of Fortune 500 companies use applicant tracking systems
            (ATS)
          </strong>{" "}
          to filter applications before a human recruiter even looks at them. If
          your resume doesn't include the right keywords, you might be rejected
          before you ever get a chance to interview. This guide covers
          everything: what resume keywords are, how to find them, where to place
          them, and which keywords matter most in every major industry.
        </p>

        {/* Table of Contents */}
        <nav className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-4 text-lg">
            Table of Contents
          </h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#what-are-resume-keywords" className="text-accent hover:underline">What Are Resume Keywords?</a></li>
            <li><a href="#how-to-identify" className="text-accent hover:underline">How to Identify the Right Resume Keywords</a></li>
            <li><a href="#extract-from-job-posting" className="text-accent hover:underline">How to Extract Keywords from a Job Posting</a></li>
            <li><a href="#industry-keywords" className="text-accent hover:underline">Top Resume Keywords by Industry (2026)</a></li>
            <li><a href="#where-to-place" className="text-accent hover:underline">Where to Place Keywords in Your Resume</a></li>
            <li><a href="#hard-vs-soft" className="text-accent hover:underline">Hard Skills vs. Soft Skills Keywords</a></li>
            <li><a href="#final-tips" className="text-accent hover:underline">Final Tips for Resume Keyword Optimization</a></li>
            <li><a href="#faq" className="text-accent hover:underline">Frequently Asked Questions</a></li>
          </ol>
        </nav>

        {/* Keyword Scanner CTA */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-ink mb-3">
            This guide will show you:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-ink/80">
            <li>What resume keywords are and why they matter in 2026</li>
            <li>
              How to find the right keywords for <em>your</em> career
            </li>
            <li>
              Industry-specific resume keywords (IT, Finance, Marketing,
              Healthcare, and more)
            </li>
            <li>Exactly where to place keywords for maximum impact</li>
            <li>The difference between hard skill and soft skill keywords</li>
          </ul>
        </div>

        {/* Free Tool Callout */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-green-800 mb-2">
            Free Tool: Resume Keyword Scanner
          </h4>
          <p className="text-green-700 mb-3">
            Want to check if your resume has the right keywords before applying?
            Our{" "}
            <Link to="/resume-keyword-scanner" className="text-accent hover:underline font-medium">
              free Resume Keyword Scanner
            </Link>{" "}
            compares your resume against any job description and shows you
            exactly which keywords you're missing — no sign-up required.
          </p>
        </div>

        <h2 id="what-are-resume-keywords" className="text-3xl font-bold text-ink mt-12 mb-6">
          What Are Resume Keywords?
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          <strong>Resume keywords</strong> are the skills, job titles, tools,
          certifications, and industry terms hiring managers (and ATS software)
          look for in resumes. They often match the language used directly in
          job descriptions. When an ATS scans your resume, it compares your
          content against a list of required and preferred keywords — and ranks
          you accordingly. For a deeper dive into how ATS systems work, see our{" "}
          <Link to="/blog/ats-resume-optimization" className="text-accent hover:underline">
            ATS resume optimization guide
          </Link>.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-green-800 mb-3">
            Example keyword categories:
          </h4>
          <ul className="list-disc pl-6 space-y-2 text-green-700">
            <li>
              <strong>Job Titles:</strong>{" "}
              <em>Project Manager, Data Analyst, UX Designer</em>
            </li>
            <li>
              <strong>Hard Skills:</strong>{" "}
              <em>Python, SQL, Digital Marketing, GAAP</em>
            </li>
            <li>
              <strong>Certifications:</strong>{" "}
              <em>PMP, CPA, AWS Certified Solutions Architect</em>
            </li>
            <li>
              <strong>Soft Skills:</strong>{" "}
              <em>Leadership, Collaboration, Problem-solving</em>
            </li>
            <li>
              <strong>Industry Jargon:</strong>{" "}
              <em>Scrum, HIPAA, KPI, Cloud Computing</em>
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
          <p className="text-yellow-800">
            <strong>Using the right keywords isn't about "stuffing."</strong>{" "}
            It's about mirroring the terms employers already value. Learn{" "}
            <Link to="/blog/how-to-use-resume-keywords" className="text-accent hover:underline">
              how to use resume keywords naturally
            </Link>{" "}
            without sounding robotic.
          </p>
        </div>

        <h2 id="how-to-identify" className="text-3xl font-bold text-ink mt-12 mb-6">
          How to Identify the Right Resume Keywords
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          The most powerful keywords are{" "}
          <strong>already in the job postings you're applying to</strong>.
          Here's the fastest way to find them:
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-6">
          <h4 className="font-bold text-ink mb-3">
            3 Steps to Find Them:
          </h4>
          <ol className="list-decimal pl-6 space-y-2 text-ink/80">
            <li>
              Collect <strong>3-5 job ads</strong> for your target role.
            </li>
            <li>
              Highlight repeated terms in responsibilities and requirements.
            </li>
            <li>
              Add those phrases into your{" "}
              <strong>summary, work history, and skills</strong> naturally.
            </li>
          </ol>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h4 className="font-bold text-green-800 mb-3">
            Tools to speed up keyword research:
          </h4>
          <ul className="list-disc pl-6 space-y-2 text-green-700">
            <li>
              <strong>
                <Link to="/resume-keyword-scanner" className="text-accent hover:underline">
                  EasyFreeResume Keyword Scanner
                </Link>
              </strong>{" "}
              (free ATS keyword match checker — paste your resume and a job posting)
            </li>
            <li>
              <strong>LinkedIn Job Search</strong> (scan multiple postings
              quickly)
            </li>
            <li>
              <strong>Indeed & Glassdoor</strong> (look for repeated terms in
              job listings)
            </li>
            <li>
              <strong>Google Trends</strong> (track rising industry phrases)
            </li>
          </ul>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm mt-6">
          For a complete walkthrough, read our{" "}
          <Link to="/blog/how-to-use-resume-keywords" className="text-accent hover:underline">
            step-by-step guide to using resume keywords
          </Link>. It covers matching strategies, density guidelines, and common
          mistakes to avoid.
        </p>

        {/* NEW: How to Extract Keywords from a Job Posting */}
        <h2 id="extract-from-job-posting" className="text-3xl font-bold text-ink mt-12 mb-6">
          How to Extract Keywords from a Job Posting
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Job postings are keyword goldmines — but most candidates skim them
          instead of mining them systematically. Follow these five steps to
          extract exactly what the ATS (and the hiring manager) wants to see.
        </p>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink mb-2">Copy the Full Job Posting</h3>
              <p className="text-lg leading-relaxed text-stone-warm">
                Paste the entire posting into a document or our{" "}
                <Link to="/resume-keyword-scanner" className="text-accent hover:underline">
                  keyword scanner tool
                </Link>. Include the responsibilities, requirements, preferred qualifications,
                and even the company description — keywords appear in all of these sections.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink mb-2">Highlight Hard Skills and Tools</h3>
              <p className="text-lg leading-relaxed text-stone-warm">
                Look for specific technologies, certifications, software, and technical
                skills. These are your <strong>primary keywords</strong> — they carry the most
                weight in ATS scoring. Examples: "Salesforce," "SQL," "PMP certification,"
                "HIPAA compliance."
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink mb-2">Identify Soft Skills and Action Verbs</h3>
              <p className="text-lg leading-relaxed text-stone-warm">
                Phrases like "cross-functional collaboration," "stakeholder management,"
                or "team leadership" are <strong>secondary keywords</strong>. They matter
                for human reviewers and increasingly for AI-powered ATS systems.
                See our{" "}
                <Link to="/blog/how-to-list-skills" className="text-accent hover:underline">
                  skills section guide
                </Link>{" "}
                for how to organize these effectively.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
              4
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink mb-2">Count Frequency</h3>
              <p className="text-lg leading-relaxed text-stone-warm">
                Keywords that appear <strong>multiple times</strong> in a posting are
                high-priority. If "data analysis" appears three times and "Excel" appears
                once, prioritize "data analysis" in your resume. ATS systems weight
                frequently mentioned terms more heavily.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
              5
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink mb-2">Cross-Reference with Industry Standards</h3>
              <p className="text-lg leading-relaxed text-stone-warm">
                Some job postings miss common keywords that ATS databases still
                expect. Cross-reference the posting with our{" "}
                <Link to="/blog/resume-keywords-by-industry" className="text-accent hover:underline">
                  resume keywords by industry breakdown
                </Link>{" "}
                or browse the{" "}
                <Link to="/resume-keywords" className="text-accent hover:underline">
                  resume keywords hub
                </Link>{" "}
                for your specific role. For example, a software engineering posting might
                not mention "version control," but every{" "}
                <Link to="/resume-keywords/software-engineer" className="text-accent hover:underline">
                  software engineer resume
                </Link>{" "}
                should include it.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">Quick Keyword Extraction Example</h3>
          <p className="text-ink/80 mb-4">
            For a "Senior Customer Service Manager" posting, you'd extract keywords like:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-ink mb-2">Hard Skills:</p>
              <p className="text-stone-warm text-sm">
                CRM, Zendesk, Salesforce, KPI tracking, workforce management,
                quality assurance, SLA compliance
              </p>
            </div>
            <div>
              <p className="font-medium text-ink mb-2">Soft Skills:</p>
              <p className="text-stone-warm text-sm">
                Team leadership, conflict resolution, customer retention,
                cross-functional collaboration, coaching and development
              </p>
            </div>
          </div>
          <p className="text-ink/80 mt-4 text-sm">
            See our full{" "}
            <Link to="/blog/customer-service-resume-keywords-guide" className="text-accent hover:underline">
              customer service resume keywords guide
            </Link>{" "}
            for 100+ keywords organized by category.
          </p>
        </div>

        <h2 id="industry-keywords" className="text-3xl font-bold text-ink mt-12 mb-6">
          Top Resume Keywords by Industry (2026 Edition)
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-4">
          Below are the <strong>must-have keywords</strong> for major industries
          in 2026. Use these as a starting point, then tailor based on your
          target job posting. For comprehensive lists organized by role, visit our{" "}
          <Link to="/resume-keywords" className="text-accent hover:underline">
            resume keywords hub
          </Link>{" "}
          which covers 25+ job titles.
        </p>

        <p className="text-lg leading-relaxed text-stone-warm mb-8">
          Need deeper industry breakdowns? Our{" "}
          <Link to="/blog/resume-keywords-by-industry" className="text-accent hover:underline">
            resume keywords by industry guide
          </Link>{" "}
          has expanded lists for each sector below.
        </p>

        <div className="space-y-8">
          {/* Technology & Software Development */}
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-4">
              Technology & Software Development
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left py-2 font-semibold text-ink">
                      Category
                    </th>
                    <th className="text-left py-2 font-semibold text-ink">
                      Keywords
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-warm">
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Programming</td>
                    <td className="py-2">
                      Python, JavaScript, React, Node.js, SQL, TypeScript
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Cloud</td>
                    <td className="py-2">
                      AWS, Azure, Google Cloud, Kubernetes, Docker
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Methodologies</td>
                    <td className="py-2">
                      Agile, Scrum, CI/CD, DevOps, Microservices
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Tools</td>
                    <td className="py-2">
                      Git, Jira, Terraform, Jenkins, REST APIs
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">AI/ML (2026)</td>
                    <td className="py-2">
                      Machine Learning, LLM, RAG, Prompt Engineering, MLOps
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-stone-warm mt-3">
              Full list:{" "}
              <Link to="/resume-keywords/software-engineer" className="text-accent hover:underline">
                Software Engineer Resume Keywords
              </Link>
            </p>
          </div>

          {/* Finance & Accounting */}
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-4">
              Finance & Accounting
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left py-2 font-semibold text-ink">
                      Category
                    </th>
                    <th className="text-left py-2 font-semibold text-ink">
                      Keywords
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-warm">
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Core Skills</td>
                    <td className="py-2">
                      Financial Analysis, Forecasting, Variance Reporting
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Standards</td>
                    <td className="py-2">GAAP, IFRS, SOX Compliance</td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Tools</td>
                    <td className="py-2">
                      SAP, Oracle, QuickBooks, Excel Advanced Functions
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Processes</td>
                    <td className="py-2">
                      Budgeting, Tax Preparation, Accounts Payable/Receivable
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Marketing & Sales */}
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-4">
              Marketing & Sales
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left py-2 font-semibold text-ink">
                      Category
                    </th>
                    <th className="text-left py-2 font-semibold text-ink">
                      Keywords
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-warm">
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Digital</td>
                    <td className="py-2">
                      SEO, SEM, Google Analytics, Paid Social Advertising
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">CRM</td>
                    <td className="py-2">
                      Salesforce, HubSpot, Customer Segmentation
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Campaigns</td>
                    <td className="py-2">
                      Lead Generation, Conversion Rate Optimization, Email
                      Campaigns
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Metrics</td>
                    <td className="py-2">
                      ROI, Engagement Rate, CTR, A/B Testing
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Healthcare & Life Sciences */}
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-4">
              Healthcare & Life Sciences
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left py-2 font-semibold text-ink">
                      Category
                    </th>
                    <th className="text-left py-2 font-semibold text-ink">
                      Keywords
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-warm">
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Clinical</td>
                    <td className="py-2">
                      Patient Care, Medication Administration, Vital Signs
                      Monitoring
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Compliance</td>
                    <td className="py-2">
                      HIPAA, Infection Control, Quality Assurance
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Systems</td>
                    <td className="py-2">
                      Electronic Health Records (EHR), Epic, Cerner
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Skills</td>
                    <td className="py-2">
                      Care Coordination, Patient Education, Interdisciplinary
                      Teamwork
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Operations & Project Management */}
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-4">
              Operations & Project Management
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left py-2 font-semibold text-ink">
                      Category
                    </th>
                    <th className="text-left py-2 font-semibold text-ink">
                      Keywords
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-warm">
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Methods</td>
                    <td className="py-2">
                      Agile Project Management, Waterfall, Lean Six Sigma
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Tools</td>
                    <td className="py-2">MS Project, Trello, Asana, Jira</td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Skills</td>
                    <td className="py-2">
                      Risk Management, Stakeholder Engagement, Resource
                      Allocation
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Certifications</td>
                    <td className="py-2">PMP, PRINCE2, CAPM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Service */}
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-4">
              Customer Service & Support
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left py-2 font-semibold text-ink">
                      Category
                    </th>
                    <th className="text-left py-2 font-semibold text-ink">
                      Keywords
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-warm">
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Platforms</td>
                    <td className="py-2">
                      Zendesk, Salesforce Service Cloud, Intercom, Freshdesk
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Metrics</td>
                    <td className="py-2">
                      CSAT, NPS, First Response Time, Resolution Rate
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Skills</td>
                    <td className="py-2">
                      Conflict Resolution, De-escalation, Active Listening
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Processes</td>
                    <td className="py-2">
                      SLA Compliance, Quality Assurance, Workforce Management
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-stone-warm mt-3">
              Full list:{" "}
              <Link to="/resume-keywords/customer-service" className="text-accent hover:underline">
                Customer Service Resume Keywords
              </Link>{" "}
              and{" "}
              <Link to="/blog/customer-service-resume-keywords-guide" className="text-accent hover:underline">
                Customer Service Keywords Guide
              </Link>
            </p>
          </div>

          {/* Education & Training */}
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-4">
              Education & Training
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="text-left py-2 font-semibold text-ink">
                      Category
                    </th>
                    <th className="text-left py-2 font-semibold text-ink">
                      Keywords
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-warm">
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Teaching</td>
                    <td className="py-2">
                      Curriculum Development, Differentiated Instruction, Assessment Design
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Technology</td>
                    <td className="py-2">
                      LMS (Canvas, Blackboard), Google Classroom, EdTech
                    </td>
                  </tr>
                  <tr className="border-b border-black/[0.06]">
                    <td className="py-2 font-medium">Compliance</td>
                    <td className="py-2">
                      IEP, 504 Plans, State Standards, FERPA
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Skills</td>
                    <td className="py-2">
                      Classroom Management, Student Engagement, Data-Driven Instruction
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2 id="where-to-place" className="text-3xl font-bold text-ink mt-12 mb-6">
          Where to Place Keywords in Your Resume
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          It's not enough to <em>have</em> the right keywords — placement
          matters. ATS systems scan specific sections more heavily. Here's
          the priority order:
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
          <h4 className="font-bold text-ink mb-3">
            Placement Strategy (by priority):
          </h4>
          <ul className="list-disc pl-6 space-y-3 text-ink/80">
            <li>
              <strong>Professional Summary:</strong> Use 3-5 primary keywords
              here. This is the first section most ATS systems parse.
            </li>
            <li>
              <strong>Work Experience Bullets:</strong> Mirror job ad phrasing (
              <em>"collaborated cross-functionally"</em>). Pair keywords with
              quantified results — not just "SEO," but "Improved SEO rankings,
              boosting organic traffic 45%."
            </li>
            <li>
              <strong>Skills Section:</strong> List technical tools,
              certifications, and software. This section acts as a keyword
              safety net for terms that don't fit naturally in your bullets.
              See our{" "}
              <Link to="/blog/how-to-list-skills" className="text-accent hover:underline">
                guide to listing skills on your resume
              </Link>{" "}
              for formatting tips.
            </li>
            <li>
              <strong>Job Titles:</strong> Use industry-standard phrasing (
              <em>"Software Engineer" not "Code Ninja"</em>).
            </li>
            <li>
              <strong>Certifications:</strong> Always spell out acronyms once
              (e.g., <em>Project Management Professional (PMP)</em>) so ATS can
              catch both forms.
            </li>
          </ul>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm mt-6">
          Using an{" "}
          <Link to="/templates/ats-friendly" className="text-accent hover:underline">
            ATS-friendly resume template
          </Link>{" "}
          ensures your keywords land in sections that ATS systems can actually
          parse. Fancy designs with columns, text boxes, or images can cause
          parsing failures — even if your keywords are perfect.
        </p>

        {/* Hard Skills vs. Soft Skills */}
        <h2 id="hard-vs-soft" className="text-3xl font-bold text-ink mt-12 mb-6">
          Hard Skills vs. Soft Skills Keywords
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Not all keywords carry equal weight. Understanding the difference
          between hard skill and soft skill keywords helps you prioritize what
          to include — and where.
        </p>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-6 py-4 text-left font-bold text-ink">Aspect</th>
                <th className="px-6 py-4 text-left font-bold text-ink">Hard Skill Keywords</th>
                <th className="px-6 py-4 text-left font-bold text-ink">Soft Skill Keywords</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Definition</td>
                <td className="px-6 py-4 text-ink">Specific, teachable abilities — tools, technologies, certifications</td>
                <td className="px-6 py-4 text-ink">Interpersonal traits and behaviors — communication, leadership</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">ATS Weight</td>
                <td className="px-6 py-4 text-ink">High — ATS filters primarily on hard skills</td>
                <td className="px-6 py-4 text-ink">Medium — increasingly tracked by modern ATS</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Examples</td>
                <td className="px-6 py-4 text-ink">Python, Salesforce, GAAP, AWS, Kubernetes</td>
                <td className="px-6 py-4 text-ink">Leadership, Problem-Solving, Collaboration</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Best Placement</td>
                <td className="px-6 py-4 text-ink">Skills section + experience bullets with metrics</td>
                <td className="px-6 py-4 text-ink">Professional summary + experience bullets with context</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-ink font-medium">Pro Tip</td>
                <td className="px-6 py-4 text-ink">Include both acronym and full term (e.g., "SEO" + "Search Engine Optimization")</td>
                <td className="px-6 py-4 text-ink">Show, don't tell — "Led 12-person team" beats "Leadership skills"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
          <p className="text-yellow-800">
            <strong>Rule of thumb:</strong> Your resume should be roughly 70%
            hard skill keywords and 30% soft skill keywords. Hard skills get
            you past the ATS; soft skills convince the hiring manager you're a
            culture fit.
          </p>
        </div>

        <h2 id="final-tips" className="text-3xl font-bold text-ink mt-12 mb-6">
          Final Tips for Resume Keyword Optimization
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-lg text-stone-warm">
          <li>
            <strong>Keep a "master resume"</strong> with all possible
            keywords; tailor it for each job.
          </li>
          <li>
            <strong>Study competitor LinkedIn profiles</strong> to see
            trending skills in your field.
          </li>
          <li>
            <strong>Pair keywords with achievements</strong>: not just "SEO,"
            but "Improved SEO rankings, boosting traffic +45%."
          </li>
          <li>
            <strong>Update quarterly</strong> to reflect new tools, methods,
            and certifications.
          </li>
          <li>
            <strong>Run your resume through a scanner</strong> before
            submitting. Our{" "}
            <Link to="/resume-keyword-scanner" className="text-accent hover:underline">
              free keyword scanner
            </Link>{" "}
            shows your match rate in seconds.
          </li>
        </ul>

        <div className="bg-ink text-white rounded-xl p-8 my-12">
          <h3 className="text-2xl font-bold mb-4">
            Action Plan: How to Get Started Today
          </h3>
          <ol className="list-decimal pl-6 space-y-3 text-lg">
            <li>Pick 3-5 job postings for your target role.</li>
            <li>Extract repeated keywords using the steps above (or use our{" "}
              <Link to="/resume-keyword-scanner" className="text-white underline hover:text-accent">
                keyword scanner
              </Link>).
            </li>
            <li>Place them naturally into your resume's summary, bullets, and skills.</li>
            <li>
              Use an{" "}
              <Link to="/templates/ats-friendly" className="text-white underline hover:text-accent">
                ATS-friendly template
              </Link>{" "}
              to ensure proper parsing.
            </li>
            <li>Fine-tune and repeat for each application.</li>
          </ol>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          The Bottom Line
        </h2>
        <p className="text-lg leading-relaxed text-stone-warm">
          <strong>
            Resume keywords are the bridge between your experience and what
            employers are searching for.
          </strong>{" "}
          Done right, they help you pass ATS filters <em>and</em> show hiring
          managers you're the perfect fit. The candidates who get interviews
          aren't always the most qualified — they're the ones whose resumes
          speak the same language as the job posting.
        </p>

        <p className="text-lg leading-relaxed text-stone-warm mt-4">
          Don't guess which words to use — let the job description guide you.
          And if you want to verify your keyword coverage before hitting submit,{" "}
          <Link to="/resume-keyword-scanner" className="text-accent hover:underline">
            scan your resume for free here
          </Link>.
        </p>

        {/* FAQ Section */}
        <h2 id="faq" className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: 'What are resume keywords?',
              a: 'Resume keywords are specific words and phrases that describe the skills, qualifications, tools, and experience employers are looking for. They include hard skills (Python, Salesforce), soft skills (leadership, collaboration), job titles (Project Manager), certifications (PMP, CPA), and industry terminology (HIPAA, Agile). ATS software scans for these keywords to rank and filter applicants.',
            },
            {
              q: 'How do I find the right keywords for my resume?',
              a: 'The best source is the job posting itself. Collect 3-5 postings for your target role, highlight repeated terms in the requirements and responsibilities sections, and incorporate those exact phrases into your resume. You can also use our free Resume Keyword Scanner to compare your resume against a job posting and see which keywords you\'re missing.',
            },
            {
              q: 'How many keywords should a resume have?',
              a: 'Aim for 15-25 unique keywords distributed naturally across your professional summary, experience bullets, and skills section. Focus on the keywords that appear most frequently in the job posting — those carry the most weight with ATS systems. Quality and natural placement matter more than raw count.',
            },
            {
              q: 'Where should I put keywords on my resume?',
              a: 'Prioritize your professional summary (3-5 primary keywords), work experience bullets (keywords paired with quantified achievements), and skills section (technical tools and certifications). Also use industry-standard job titles and spell out acronyms at least once. An ATS-friendly template ensures these sections parse correctly.',
            },
            {
              q: 'Can too many keywords hurt my resume?',
              a: 'Yes. "Keyword stuffing" — cramming in keywords unnaturally — is penalized by modern ATS systems like Greenhouse, Lever, and Workday. More importantly, once your resume passes the ATS, a human recruiter reads it. A stuffed resume looks unprofessional and gets rejected. Use keywords in context with real achievements.',
            },
            {
              q: 'How do ATS systems scan for keywords?',
              a: 'ATS software parses your resume text, extracts keywords from each section, and compares them against the job posting\'s required and preferred qualifications. Most systems use a weighted scoring model — exact matches score highest, and keywords in the summary and skills sections carry more weight than those buried in body text. Some modern ATS also recognize synonyms and related terms.',
            },
            {
              q: "What's the difference between hard and soft skill keywords?",
              a: 'Hard skill keywords are specific, measurable abilities like "Python," "Financial Analysis," or "AWS." Soft skill keywords are interpersonal traits like "Leadership," "Problem-Solving," or "Cross-Functional Collaboration." ATS systems primarily filter on hard skills, but modern systems increasingly track soft skills too. Your resume should be roughly 70% hard skills and 30% soft skills.',
            },
            {
              q: 'Should I use the exact wording from the job description?',
              a: 'Yes, wherever possible. ATS systems often do literal string matching. If the job says "Project Management," include that exact phrase — not just "managed projects." Include both the full term and abbreviation (e.g., "Search Engine Optimization (SEO)") to catch both forms. This also signals to human readers that you speak their industry\'s language.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-chalk-dark rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">{faq.q}</h3>
              <p className="text-stone-warm">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Related Guides */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 mt-12">
          <h3 className="font-bold text-ink mb-3">Related Keyword Guides</h3>
          <p className="text-ink/80 mb-4">
            This is the pillar guide for resume keywords. Explore our full cluster:
          </p>
          <ul className="space-y-2 text-ink/80">
            <li>
              <Link to="/blog/how-to-use-resume-keywords" className="text-accent hover:underline">
                How to Use Resume Keywords
              </Link>{' '}
              &mdash; detailed step-by-step with matching strategies
            </li>
            <li>
              <Link to="/blog/resume-keywords-by-industry" className="text-accent hover:underline">
                Resume Keywords by Industry
              </Link>{' '}
              &mdash; expanded keyword lists for 10+ sectors
            </li>
            <li>
              <Link to="/blog/customer-service-resume-keywords-guide" className="text-accent hover:underline">
                Customer Service Resume Keywords Guide
              </Link>{' '}
              &mdash; 100+ keywords organized by category
            </li>
            <li>
              <Link to="/blog/ats-resume-optimization" className="text-accent hover:underline">
                ATS Resume Optimization
              </Link>{' '}
              &mdash; how ATS systems work and how to beat them
            </li>
            <li>
              <Link to="/blog/how-to-list-skills" className="text-accent hover:underline">
                How to List Skills on a Resume
              </Link>{' '}
              &mdash; formatting and organization best practices
            </li>
            <li>
              <Link to="/resume-keywords" className="text-accent hover:underline">
                Resume Keywords Hub
              </Link>{' '}
              &mdash; browse keywords for 25+ job titles
            </li>
            <li>
              <Link to="/resume-keyword-scanner" className="text-accent hover:underline">
                Free Resume Keyword Scanner
              </Link>{' '}
              &mdash; check your resume against any job posting
            </li>
          </ul>
        </div>

      </div>
    </BlogLayout>
  );
}
