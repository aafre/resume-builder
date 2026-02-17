import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";

export default function ResumeKeywordsByIndustry() {
  return (
    <BlogLayout
      title="Resume Keywords by Industry: Complete 2026 List"
      description="The definitive list of resume keywords organized by industry: tech, healthcare, finance, marketing, education, and more. ATS-optimized with real examples."
      publishDate="2026-02-17"
      readTime="16 min"
      keywords={[
        "resume keywords by industry",
        "resume keywords list by industry",
        "industry specific resume keywords",
        "resume keywords for different jobs",
        "ats keywords by industry",
        "resume keywords list",
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          Every industry has its own vocabulary. Using the wrong keywords — or generic terms instead of industry-specific ones — means your resume won't match what ATS systems and recruiters are scanning for. This guide organizes the most important resume keywords by industry so you can jump straight to your field.
        </p>

        {/* Table of Contents */}
        <nav className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-4 text-lg">Jump to Your Industry</h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-ink/80">
            <div className="space-y-2">
              <p><a href="#technology" className="text-accent hover:underline">Technology / Software Engineering</a></p>
              <p><a href="#healthcare" className="text-accent hover:underline">Healthcare / Nursing</a></p>
              <p><a href="#finance" className="text-accent hover:underline">Finance / Banking / Accounting</a></p>
              <p><a href="#marketing" className="text-accent hover:underline">Marketing / Digital Marketing</a></p>
              <p><a href="#sales" className="text-accent hover:underline">Sales / Business Development</a></p>
            </div>
            <div className="space-y-2">
              <p><a href="#education" className="text-accent hover:underline">Education / Teaching</a></p>
              <p><a href="#manufacturing" className="text-accent hover:underline">Manufacturing / Engineering</a></p>
              <p><a href="#customer-service" className="text-accent hover:underline">Customer Service / Retail</a></p>
              <p><a href="#hr" className="text-accent hover:underline">Human Resources</a></p>
              <p><a href="#project-management" className="text-accent hover:underline">Project Management</a></p>
            </div>
          </div>
        </nav>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">How to Use This Guide</h3>
          <ol className="list-decimal pl-6 space-y-2 text-ink/80">
            <li>Find your industry section below</li>
            <li>Compare the keywords against the specific job posting you're targeting</li>
            <li>Include matching keywords naturally in your experience bullets and skills section</li>
            <li>Use our <Link to="/resume-keyword-scanner" className="text-accent hover:underline font-medium">free ATS keyword scanner</Link> to verify your match rate</li>
          </ol>
        </div>

        {/* Technology */}
        <h2 id="technology" className="text-3xl font-bold text-ink mt-12 mb-6">
          Technology / Software Engineering
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Tech resumes live and die by specific tool and language names. Generic terms like "programming" won't match — you need exact platform names.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Technical Keywords</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Python, JavaScript, TypeScript, Java, C++, Go, Rust</li>
              <li>React, Angular, Vue.js, Next.js, Node.js</li>
              <li>AWS, Azure, Google Cloud Platform (GCP)</li>
              <li>Docker, Kubernetes, CI/CD, Jenkins</li>
              <li>PostgreSQL, MongoDB, Redis, Elasticsearch</li>
              <li>REST APIs, GraphQL, Microservices</li>
              <li>Machine Learning, LLMs, TensorFlow, PyTorch</li>
              <li>Git, GitHub Actions, Terraform, Infrastructure as Code</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Process & Methodology</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Agile, Scrum, Kanban, Sprint Planning</li>
              <li>Test-Driven Development (TDD)</li>
              <li>Code Review, Pair Programming</li>
              <li>System Design, Architecture</li>
              <li>DevOps, Site Reliability Engineering (SRE)</li>
              <li>SDLC (Software Development Life Cycle)</li>
              <li>Performance Optimization, Scalability</li>
              <li>Security (OWASP, SOC 2, GDPR)</li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-stone-warm mt-3">
          For a deep dive, see our <Link to="/blog/software-engineer-resume-keywords" className="text-accent hover:underline">75+ software engineer resume keywords guide</Link>.
        </p>

        {/* Healthcare */}
        <h2 id="healthcare" className="text-3xl font-bold text-ink mt-12 mb-6">
          Healthcare / Nursing
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Healthcare resumes require precise clinical terminology and certification names. Abbreviations matter — include both the abbreviation and the full term.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Clinical & Technical</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Patient assessment / triage</li>
              <li>Electronic Health Records (EHR) — Epic, Cerner, Meditech</li>
              <li>HIPAA compliance</li>
              <li>Medication administration</li>
              <li>Vital signs monitoring</li>
              <li>Wound care / IV therapy</li>
              <li>Clinical documentation</li>
              <li>Infection control / sterile technique</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Certifications & Soft Skills</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>BLS, ACLS, PALS certification</li>
              <li>RN, LPN, CNA, NP licensure</li>
              <li>Patient advocacy / patient education</li>
              <li>Interdisciplinary collaboration</li>
              <li>Care coordination / discharge planning</li>
              <li>Evidence-based practice</li>
              <li>Cultural competency</li>
              <li>Patient satisfaction (HCAHPS scores)</li>
            </ul>
          </div>
        </div>

        {/* Finance */}
        <h2 id="finance" className="text-3xl font-bold text-ink mt-12 mb-6">
          Finance / Banking / Accounting
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Finance roles demand precision in both technical skills and regulatory knowledge. Certifications carry significant weight.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Technical & Analytical</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Financial modeling / forecasting</li>
              <li>Excel (VLOOKUP, pivot tables, macros)</li>
              <li>Bloomberg Terminal / Reuters</li>
              <li>QuickBooks, SAP, Oracle Financials</li>
              <li>GAAP / IFRS compliance</li>
              <li>Budgeting and variance analysis</li>
              <li>Risk assessment / management</li>
              <li>Portfolio management</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Regulatory & Certifications</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>CPA, CFA, CFP, Series 7/63</li>
              <li>SOX compliance (Sarbanes-Oxley)</li>
              <li>AML (Anti-Money Laundering)</li>
              <li>KYC (Know Your Customer)</li>
              <li>Audit preparation / internal audit</li>
              <li>Tax preparation / tax planning</li>
              <li>Accounts payable / receivable</li>
              <li>Financial reporting / SEC filings</li>
            </ul>
          </div>
        </div>

        {/* Marketing */}
        <h2 id="marketing" className="text-3xl font-bold text-ink mt-12 mb-6">
          Marketing / Digital Marketing
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Marketing is one of the fastest-evolving fields. Keywords shift with platform changes and new tools. Here's what's relevant in 2026.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Digital Marketing Skills</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>SEO / SEM / PPC (Google Ads, Meta Ads)</li>
              <li>Content marketing / content strategy</li>
              <li>Email marketing (Mailchimp, HubSpot, Klaviyo)</li>
              <li>Social media management (Hootsuite, Sprout Social)</li>
              <li>Marketing automation (HubSpot, Marketo, Pardot)</li>
              <li>Google Analytics 4 / Google Tag Manager</li>
              <li>A/B testing / conversion rate optimization (CRO)</li>
              <li>Influencer marketing / brand partnerships</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Metrics & Strategy</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>ROI / ROAS (Return on Ad Spend)</li>
              <li>CAC (Customer Acquisition Cost)</li>
              <li>LTV (Lifetime Value)</li>
              <li>Lead generation / demand generation</li>
              <li>Brand positioning / brand awareness</li>
              <li>Go-to-market (GTM) strategy</li>
              <li>Customer segmentation / persona development</li>
              <li>Attribution modeling</li>
            </ul>
          </div>
        </div>

        {/* Sales */}
        <h2 id="sales" className="text-3xl font-bold text-ink mt-12 mb-6">
          Sales / Business Development
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Sales Skills & Tools</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Salesforce / HubSpot CRM / Pipedrive</li>
              <li>Pipeline management / forecasting</li>
              <li>Cold calling / outbound prospecting</li>
              <li>Solution selling / consultative selling</li>
              <li>SaaS sales / B2B sales / B2C sales</li>
              <li>Account management / key accounts</li>
              <li>Territory management</li>
              <li>Contract negotiation / closing</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Metrics & Results</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Quota attainment (% of target)</li>
              <li>Revenue growth / YoY growth</li>
              <li>Deal size / average contract value (ACV)</li>
              <li>Win rate / conversion rate</li>
              <li>Customer retention / churn reduction</li>
              <li>Upselling / cross-selling</li>
              <li>Lead qualification (BANT, MEDDIC)</li>
              <li>New business development</li>
            </ul>
          </div>
        </div>

        {/* Education */}
        <h2 id="education" className="text-3xl font-bold text-ink mt-12 mb-6">
          Education / Teaching
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Teaching & Curriculum</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Lesson planning / curriculum development</li>
              <li>Differentiated instruction</li>
              <li>Classroom management</li>
              <li>Student assessment / formative assessment</li>
              <li>IEP (Individualized Education Program)</li>
              <li>STEM education / project-based learning</li>
              <li>Blended learning / hybrid instruction</li>
              <li>State standards alignment (Common Core)</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Technology & Development</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Google Classroom / Canvas / Blackboard</li>
              <li>Educational technology (EdTech)</li>
              <li>Parent communication / conferences</li>
              <li>Professional development</li>
              <li>Mentoring / coaching</li>
              <li>Special education / ESL/ELL</li>
              <li>Student engagement strategies</li>
              <li>Data-driven instruction</li>
            </ul>
          </div>
        </div>

        {/* Manufacturing */}
        <h2 id="manufacturing" className="text-3xl font-bold text-ink mt-12 mb-6">
          Manufacturing / Engineering
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Technical & Process</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Lean Manufacturing / Six Sigma (Green Belt, Black Belt)</li>
              <li>Kaizen / continuous improvement</li>
              <li>CAD/CAM (AutoCAD, SolidWorks, CATIA)</li>
              <li>Quality control / quality assurance (QA/QC)</li>
              <li>ISO 9001 / ISO 14001 certification</li>
              <li>Supply chain management</li>
              <li>Bill of Materials (BOM)</li>
              <li>Root cause analysis (5 Whys, Fishbone)</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Safety & Compliance</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>OSHA compliance / safety regulations</li>
              <li>GMP (Good Manufacturing Practices)</li>
              <li>ERP systems (SAP, Oracle)</li>
              <li>Process optimization / cycle time reduction</li>
              <li>Production scheduling / capacity planning</li>
              <li>Inventory management / JIT</li>
              <li>Preventive maintenance</li>
              <li>Cross-functional team leadership</li>
            </ul>
          </div>
        </div>

        {/* Customer Service */}
        <h2 id="customer-service" className="text-3xl font-bold text-ink mt-12 mb-6">
          Customer Service / Retail
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Service Skills</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>CRM platforms (Zendesk, Salesforce, HubSpot)</li>
              <li>Conflict resolution / de-escalation</li>
              <li>First call resolution (FCR)</li>
              <li>Customer satisfaction (CSAT / NPS)</li>
              <li>Multi-channel support (phone, email, chat)</li>
              <li>Ticket management / SLA compliance</li>
              <li>Upselling / cross-selling</li>
              <li>Customer retention</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Retail Specific</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>POS systems / cash handling</li>
              <li>Visual merchandising</li>
              <li>Inventory management / stock replenishment</li>
              <li>Loss prevention</li>
              <li>Store operations</li>
              <li>Customer loyalty programs</li>
              <li>Sales floor management</li>
              <li>Product knowledge / consultative selling</li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-stone-warm mt-3">
          For a comprehensive breakdown, see our <Link to="/blog/customer-service-resume-keywords-guide" className="text-accent hover:underline">customer service resume keywords guide</Link>.
        </p>

        {/* HR */}
        <h2 id="hr" className="text-3xl font-bold text-ink mt-12 mb-6">
          Human Resources
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Core HR Skills</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>Talent acquisition / recruitment</li>
              <li>HRIS (Workday, BambooHR, ADP)</li>
              <li>Employee onboarding / offboarding</li>
              <li>Performance management</li>
              <li>Compensation and benefits administration</li>
              <li>Employee relations / labor relations</li>
              <li>Diversity, Equity & Inclusion (DEI)</li>
              <li>Succession planning</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Compliance & Strategy</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>FMLA, ADA, EEO, FLSA compliance</li>
              <li>Payroll processing (ADP, Paychex)</li>
              <li>Training and development / L&D</li>
              <li>Organizational development</li>
              <li>Employee engagement surveys</li>
              <li>Workforce planning / headcount management</li>
              <li>SHRM-CP / PHR certification</li>
              <li>Change management</li>
            </ul>
          </div>
        </div>

        {/* Project Management */}
        <h2 id="project-management" className="text-3xl font-bold text-ink mt-12 mb-6">
          Project Management
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Methodologies & Tools</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>PMP / CAPM / Scrum Master certification</li>
              <li>Agile / Scrum / Waterfall / Hybrid</li>
              <li>Jira, Asana, Monday.com, Microsoft Project</li>
              <li>Risk management / mitigation</li>
              <li>Scope management / change control</li>
              <li>Resource allocation / capacity planning</li>
              <li>Gantt charts / WBS (Work Breakdown Structure)</li>
              <li>Stakeholder management</li>
            </ul>
          </div>
          <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-ink mb-3">Delivery & Results</h3>
            <ul className="list-disc pl-5 text-ink/80 text-sm space-y-1">
              <li>On-time / on-budget delivery</li>
              <li>Cross-functional team leadership</li>
              <li>Vendor management / procurement</li>
              <li>Budget tracking / cost optimization</li>
              <li>Status reporting / executive communication</li>
              <li>Process improvement / efficiency gains</li>
              <li>Sprint velocity / burndown tracking</li>
              <li>Post-mortem / lessons learned</li>
            </ul>
          </div>
        </div>

        {/* Universal Keywords */}
        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Universal Keywords (Every Industry)
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Regardless of your industry, these keywords appear in almost every job description. Include the ones relevant to your experience:
        </p>

        <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-6">
          <div className="grid md:grid-cols-3 gap-6 text-stone-warm">
            <div>
              <h4 className="font-bold text-ink mb-3">Leadership:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Team leadership / management</li>
                <li>Mentoring / coaching</li>
                <li>Cross-functional collaboration</li>
                <li>Strategic planning</li>
                <li>Decision making</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-3">Communication:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Stakeholder management</li>
                <li>Presentation skills</li>
                <li>Written / verbal communication</li>
                <li>Client relationship management</li>
                <li>Executive reporting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-3">Results:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Process improvement</li>
                <li>Cost reduction / optimization</li>
                <li>Revenue growth</li>
                <li>Data-driven decision making</li>
                <li>KPI achievement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Find Keywords */}
        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          How to Find the Right Keywords for Your Specific Job
        </h2>

        <div className="space-y-4">
          {[
            { num: 1, title: "Read 3-5 job postings for your target role", desc: "Collect recurring terms, skills, and qualifications. The keywords that appear in multiple postings are the ones ATS systems are programmed to match." },
            { num: 2, title: "Match exact phrasing", desc: "If a job says \"project management,\" don't write \"managed projects.\" ATS systems often match on exact phrases, not synonyms." },
            { num: 3, title: "Include both hard and soft skills", desc: "Most ATS systems scan for both. A balanced resume with technical skills AND interpersonal keywords scores higher than one focused on only one category." },
            { num: 4, title: "Put keywords in your experience section", desc: "Keywords in experience bullets carry more weight than keywords in a standalone skills list. The best approach is to include them in both places." },
            { num: 5, title: "Verify with an ATS scanner", desc: "Before submitting, paste your resume and the job description into our free ATS keyword scanner. Aim for a 70%+ keyword match rate." },
          ].map((step) => (
            <div key={step.num} className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step.num}
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">{step.title}</h3>
                <p className="text-stone-warm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="my-12 bg-ink text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Check Your Resume Keywords Now
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Paste your resume and a job description to see your keyword match rate instantly — free, no sign-up.
          </p>
          <Link
            to="/resume-keyword-scanner"
            className="inline-block bg-white text-accent px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Open Keyword Scanner
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Related Resources
        </h2>

        <ul className="list-disc list-inside space-y-2 text-lg text-stone-warm">
          <li>
            <Link to="/blog/how-to-use-resume-keywords" className="text-accent hover:underline">
              How to Use Resume Keywords to Beat the ATS
            </Link>
          </li>
          <li>
            <Link to="/blog/software-engineer-resume-keywords" className="text-accent hover:underline">
              75+ Software Engineer Resume Keywords
            </Link>
          </li>
          <li>
            <Link to="/blog/customer-service-resume-keywords-guide" className="text-accent hover:underline">
              Customer Service Resume Keywords Guide
            </Link>
          </li>
          <li>
            <Link to="/resume-keyword-scanner" className="text-accent hover:underline">
              Free ATS Keyword Scanner
            </Link>
          </li>
          <li>
            <Link to="/blog/how-to-list-skills" className="text-accent hover:underline">
              How to List Skills on a Resume
            </Link>
          </li>
        </ul>
      </div>
    </BlogLayout>
  );
}
