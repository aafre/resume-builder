/**
 * Customer Service Keywords Page
 * URL: /resume-keywords/customer-service
 * Target keyword: "customer service resume keywords"
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import BreadcrumbsWithSchema from '../shared/BreadcrumbsWithSchema';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';

export default function CustomerServiceKeywords() {
  const config = SEO_PAGES.customerServiceKeywords;
  const schemas = usePageSchema({
    type: 'creativeWork',
    name: 'Customer Service Resume Keywords',
    description: 'Complete list of customer service keywords for ATS-optimized resumes',
    url: '/resume-keywords/customer-service',
    faqs: config.faqs,
    breadcrumbs: config.breadcrumbs,
  });

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      {config.breadcrumbs && <BreadcrumbsWithSchema breadcrumbs={config.breadcrumbs} />}

      <PageHero config={config.hero} />

      {/* Hub navigation */}
      <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 mb-12 max-w-4xl mx-auto">
        <h3 className="font-bold text-ink mb-3">🔗 Part of Our Series</h3>
        <p className="text-ink/80">
          This article is part of our Resume Keywords series. For a complete overview, see our{' '}
          <Link to="/resume-keywords" className="text-accent hover:text-ink underline font-medium">
            Resume Keywords Hub
          </Link>.
        </p>
      </div>

      {/* Customer Service Resume Keywords List — target query heading */}
      <RevealSection>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8">
            Customer Service Resume Keywords List
          </h2>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06] mb-8">
            <p className="text-lg text-stone-warm font-extralight leading-relaxed">
              Below you will find 150+ customer service resume keywords organized by role, industry,
              and skill type. Each keyword has been selected based on what ATS systems and hiring
              managers look for in 2026. Use this list alongside your target job description to build a
              resume that gets past the filters and into human hands. For a working example, see
              our{' '}
              <Link
                to="/examples/customer-service-representative"
                className="text-accent hover:text-ink underline font-medium"
              >
                customer service resume example
              </Link>.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Introductory Guidance Section */}
      <RevealSection>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8">
            How to choose the right customer service keywords for your resume
          </h2>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-premium border border-black/[0.06]">
            <p className="text-lg text-stone-warm font-extralight mb-6 leading-relaxed">
              "Customer service" is broad — a call center agent, a retail associate, and a customer success manager
              all fall under this umbrella, but hiring managers search for very different skills. The keywords
              you choose need to match the <em>specific</em> role you're applying for, not just generic service terms.
            </p>
            <p className="text-lg text-stone-warm font-extralight mb-6 leading-relaxed">
              Start with the job description. Highlight every skill, tool, and metric mentioned — those
              are your target keywords. Then cross-reference them with the lists below. If a keyword appears
              in both the job posting and our list, it belongs on your resume.
            </p>
            <p className="text-lg text-stone-warm font-extralight leading-relaxed">
              Don't stuff your resume with every keyword on this page. A focused set of 15–20 relevant
              keywords woven naturally into your experience bullets will outperform a resume that lists
              50 generic terms in a skills section. ATS systems look for keywords <em>in context</em>,
              and recruiters can spot keyword stuffing immediately.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Keywords by Customer Service Role */}
      <RevealSection>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8">
            Keywords by customer service role
          </h2>
          <p className="text-lg text-stone-warm font-extralight mb-8 leading-relaxed">
            Different customer service roles require different keywords. Find your target role below
            and prioritize these terms on your resume.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-3 text-lg">
                Retail Customer Service Representative
              </h3>
              <p className="text-stone-warm text-sm mb-3">
                Focus on sales floor interactions, product knowledge, and point-of-sale systems.
              </p>
              <ul className="space-y-1 text-ink/80 text-sm list-disc list-inside">
                <li><strong>POS Systems</strong> — registers, Square, Shopify POS</li>
                <li><strong>Upselling / Cross-selling</strong> — revenue-driving skills</li>
                <li><strong>Product Knowledge</strong> — inventory and merchandising</li>
                <li><strong>Cash Handling</strong> — transactions and drawer reconciliation</li>
                <li><strong>Loss Prevention</strong> — shrinkage reduction</li>
                <li><strong>Visual Merchandising</strong> — displays and store presentation</li>
              </ul>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-3 text-lg">
                Call Center Agent / Phone Support
              </h3>
              <p className="text-stone-warm text-sm mb-3">
                Emphasize call volume, metrics, and telephone-specific skills.
              </p>
              <ul className="space-y-1 text-ink/80 text-sm list-disc list-inside">
                <li><strong>Average Handle Time (AHT)</strong> — call efficiency metric</li>
                <li><strong>Call Volume</strong> — e.g., "80+ calls/day"</li>
                <li><strong>First Call Resolution (FCR)</strong> — one-touch fixes</li>
                <li><strong>IVR Systems</strong> — interactive voice response navigation</li>
                <li><strong>Script Adherence</strong> — compliance and quality standards</li>
                <li><strong>De-escalation</strong> — calming upset callers</li>
              </ul>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-3 text-lg">
                Technical Support Specialist
              </h3>
              <p className="text-stone-warm text-sm mb-3">
                Highlight diagnostic abilities, technical tools, and knowledge base contributions.
              </p>
              <ul className="space-y-1 text-ink/80 text-sm list-disc list-inside">
                <li><strong>Troubleshooting</strong> — systematic diagnosis of issues</li>
                <li><strong>Remote Desktop Support</strong> — TeamViewer, AnyDesk</li>
                <li><strong>Tier 1 / Tier 2 / Tier 3 Support</strong> — escalation level</li>
                <li><strong>Knowledge Base</strong> — documentation and article creation</li>
                <li><strong>Root Cause Analysis</strong> — identifying underlying issues</li>
                <li><strong>SLA Compliance</strong> — meeting service-level commitments</li>
              </ul>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-3 text-lg">
                Customer Success Manager
              </h3>
              <p className="text-stone-warm text-sm mb-3">
                Focus on retention, account growth, and strategic relationship management.
              </p>
              <ul className="space-y-1 text-ink/80 text-sm list-disc list-inside">
                <li><strong>Customer Retention</strong> — churn reduction strategies</li>
                <li><strong>Net Promoter Score (NPS)</strong> — loyalty measurement</li>
                <li><strong>Account Management</strong> — portfolio oversight</li>
                <li><strong>Onboarding</strong> — new customer implementation</li>
                <li><strong>Upsell / Expansion Revenue</strong> — account growth</li>
                <li><strong>QBRs</strong> — quarterly business reviews</li>
              </ul>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm md:col-span-2">
              <h3 className="font-bold text-ink mb-3 text-lg">
                Help Desk / IT Support
              </h3>
              <p className="text-stone-warm text-sm mb-3">
                Combine customer service soft skills with IT-specific tools and processes.
              </p>
              <ul className="grid md:grid-cols-2 gap-x-6 gap-y-1 text-ink/80 text-sm list-disc list-inside">
                <li><strong>ITIL Framework</strong> — IT service management methodology</li>
                <li><strong>Active Directory</strong> — user account management</li>
                <li><strong>Ticketing Systems</strong> — Jira, ServiceNow, Freshservice</li>
                <li><strong>Password Resets / Access Management</strong> — common ticket types</li>
                <li><strong>Hardware Troubleshooting</strong> — physical device support</li>
                <li><strong>VPN / Network Connectivity</strong> — remote access support</li>
              </ul>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Industry-Specific Customer Service Keywords */}
      <RevealSection>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8">
            Industry-specific customer service keywords
          </h2>
          <p className="text-lg text-stone-warm font-extralight mb-8 leading-relaxed">
            Customer service looks different in every industry. The keywords below are tailored to
            specific sectors — use them to show employers you understand their world, not just generic
            support principles.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-3 text-lg">
                Retail
              </h3>
              <ul className="space-y-1 text-ink/80 text-sm list-disc list-inside">
                <li><strong>POS Systems</strong> — Square, Shopify POS, Clover</li>
                <li><strong>Inventory Management</strong> — stock tracking and replenishment</li>
                <li><strong>Cash Handling</strong> — drawer reconciliation, deposits</li>
                <li><strong>Upselling</strong> — suggestive selling and add-on revenue</li>
                <li><strong>Visual Merchandising</strong> — planograms and displays</li>
                <li><strong>Loss Prevention</strong> — shrinkage control, LP audits</li>
                <li><strong>Clienteling</strong> — personalized customer engagement</li>
              </ul>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-3 text-lg">
                SaaS / Tech Support
              </h3>
              <ul className="space-y-1 text-ink/80 text-sm list-disc list-inside">
                <li><strong>Ticketing Systems</strong> — Zendesk, Jira Service Desk, Freshdesk</li>
                <li><strong>Knowledge Base</strong> — documentation and self-service content</li>
                <li><strong>Screen Sharing</strong> — Zoom, TeamViewer, remote demos</li>
                <li><strong>Remote Troubleshooting</strong> — diagnosing issues over the wire</li>
                <li><strong>Bug Reporting</strong> — reproducing and escalating defects</li>
                <li><strong>SLA Management</strong> — meeting service-level targets</li>
                <li><strong>Tier 1 / 2 / 3 Support</strong> — escalation tiers and ownership</li>
              </ul>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-3 text-lg">
                Healthcare
              </h3>
              <ul className="space-y-1 text-ink/80 text-sm list-disc list-inside">
                <li><strong>HIPAA Compliance</strong> — patient privacy regulations</li>
                <li><strong>Patient Scheduling</strong> — appointment coordination</li>
                <li><strong>EMR / EHR Systems</strong> — Epic, Cerner, Meditech</li>
                <li><strong>Insurance Verification</strong> — eligibility and prior authorizations</li>
                <li><strong>Medical Terminology</strong> — clinical vocabulary fluency</li>
                <li><strong>Patient Advocacy</strong> — navigating care on behalf of patients</li>
              </ul>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-3 text-lg">
                Banking / Finance
              </h3>
              <ul className="space-y-1 text-ink/80 text-sm list-disc list-inside">
                <li><strong>KYC Compliance</strong> — Know Your Customer procedures</li>
                <li><strong>Loan Processing</strong> — applications and underwriting support</li>
                <li><strong>Account Management</strong> — client portfolio oversight</li>
                <li><strong>Fraud Detection</strong> — suspicious activity monitoring</li>
                <li><strong>Regulatory Compliance</strong> — FINRA, FDIC, SOX awareness</li>
                <li><strong>Financial Products</strong> — mortgages, credit cards, investments</li>
              </ul>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 shadow-sm md:col-span-2">
              <h3 className="font-bold text-ink mb-3 text-lg">
                Hospitality
              </h3>
              <ul className="grid md:grid-cols-2 gap-x-6 gap-y-1 text-ink/80 text-sm list-disc list-inside">
                <li><strong>Reservation Systems</strong> — Opera, ALICE, Cloudbeds</li>
                <li><strong>Guest Relations</strong> — complaint handling and VIP services</li>
                <li><strong>Concierge Services</strong> — local recommendations and bookings</li>
                <li><strong>Loyalty Programs</strong> — rewards enrollment and management</li>
                <li><strong>RevPAR</strong> — revenue per available room tracking</li>
                <li><strong>Occupancy Management</strong> — room allocation and overbooking</li>
              </ul>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Core Skills Section */}
      <RevealSection>
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase">Core Skills</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8 mt-2">
            Core customer service skills (soft skills)
          </h2>
          <p className="text-lg text-stone-warm font-extralight mb-8 leading-relaxed">
            These keywords describe the essential interpersonal abilities needed for any customer
            service role. They demonstrate your ability to work with people effectively.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 card-gradient-border shadow-premium">
              <h3 className="font-bold text-ink mb-4 text-lg">
                🤝 Communication Skills
              </h3>
              <ul className="space-y-2 text-ink/80 list-disc list-inside">
                <li>Customer Support</li>
                <li>Client Relations</li>
                <li>Active Listening</li>
                <li>Communication Skills</li>
                <li>Interpersonal Skills</li>
                <li>Verbal Communication</li>
                <li>Written Communication</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 card-gradient-border shadow-premium">
              <h3 className="font-bold text-ink mb-4 text-lg">
                🎯 Problem-Solving
              </h3>
              <ul className="space-y-2 text-ink/80 list-disc list-inside">
                <li>Conflict Resolution</li>
                <li>Problem-Solving</li>
                <li>Critical Thinking</li>
                <li>Decision Making</li>
                <li>Troubleshooting</li>
                <li>Issue Resolution</li>
                <li>Solution-Oriented</li>
              </ul>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Technical Skills Section */}
      <RevealSection>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8">
            Technical skills & software (hard skills)
          </h2>
          <p className="text-lg text-stone-warm font-extralight mb-8 leading-relaxed">
            Listing specific tools you've used is critical. It shows you can jump into a new role
            with minimal training and demonstrates your technical competency.
          </p>

          <div className="space-y-6">
            <div className="bg-accent/[0.06] border border-accent/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-ink mb-4">
                CRM & Customer Management Software
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-ink/80">
                <div>
                  <h4 className="font-medium mb-2">Major CRM Platforms:</h4>
                  <p className="text-sm">Salesforce, HubSpot CRM, Zoho CRM, Pipedrive, Microsoft Dynamics, SugarCRM</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Customer Support Tools:</h4>
                  <p className="text-sm">Zendesk, Freshdesk, ServiceNow, Kayako, Help Scout, Intercom</p>
                </div>
              </div>
            </div>

            <div className="bg-accent/[0.06] border border-accent/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-ink mb-4">
                Communication & Collaboration Tools
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-ink/80">
                <div>
                  <h4 className="font-medium mb-2">Communication Platforms:</h4>
                  <p className="text-sm">Slack, Microsoft Teams, Zoom, Google Workspace, Skype for Business, Discord</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Help Desk & Ticketing:</h4>
                  <p className="text-sm">Jira Service Desk, ServiceDesk Plus, BMC Remedy, Freshservice, Spiceworks, osTicket</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Metrics Section */}
      <RevealSection>
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase">Metrics</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8 mt-2">
            Processes and metrics
          </h2>
          <p className="text-lg text-stone-warm font-extralight mb-8 leading-relaxed">
            These keywords show you understand the business side of customer service and can work
            with performance metrics that matter to employers.
          </p>

          <div className="bg-white rounded-2xl p-6 card-gradient-border shadow-premium">
            <h3 className="font-bold text-ink mb-4 text-lg">
              📊 Customer Service Metrics & KPIs
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-ink/80">
              <div>
                <h4 className="font-medium mb-2">Performance Metrics:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Customer Satisfaction (CSAT)</li>
                  <li>Net Promoter Score (NPS)</li>
                  <li>First Contact Resolution (FCR)</li>
                  <li>Average Handle Time (AHT)</li>
                  <li>Customer Effort Score (CES)</li>
                  <li>Response Time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Process Keywords:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Quality Assurance (QA)</li>
                  <li>Service Level Agreements (SLAs)</li>
                  <li>Escalation Procedures</li>
                  <li>Inbound and Outbound Calls</li>
                  <li>Ticketing System</li>
                  <li>Knowledge Base Management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Keywords to Avoid */}
      <RevealSection>
        <div className="mb-16">
          <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase">Common Mistakes</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8 mt-2">
            Customer service keywords to avoid
          </h2>
          <p className="text-lg text-stone-warm font-extralight mb-8 leading-relaxed">
            Some phrases are so overused they have lost all meaning. Recruiters skim past them, and ATS
            systems do not weight them highly. Replace these with specific, measurable alternatives.
          </p>

          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-black/[0.06] border-l-4 border-l-ink/20 shadow-sm">
              <h3 className="font-bold text-ink mb-2">
                "Team player"
              </h3>
              <p className="text-stone-warm text-sm mb-3">
                Too vague — every applicant says this. It tells the employer nothing concrete.
              </p>
              <p className="text-ink/80 text-sm">
                <strong>Instead, write:</strong> "Collaborated with a 12-person support team to reduce
                average ticket resolution time by 18% through shared troubleshooting protocols."
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-black/[0.06] border-l-4 border-l-ink/20 shadow-sm">
              <h3 className="font-bold text-ink mb-2">
                "Hard worker"
              </h3>
              <p className="text-stone-warm text-sm mb-3">
                Show impact instead of declaring effort. Metrics speak louder than adjectives.
              </p>
              <p className="text-ink/80 text-sm">
                <strong>Instead, write:</strong> "Consistently exceeded daily call quota by 15%,
                handling 95+ inbound calls while maintaining a 92% CSAT score."
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-black/[0.06] border-l-4 border-l-ink/20 shadow-sm">
              <h3 className="font-bold text-ink mb-2">
                "People person"
              </h3>
              <p className="text-stone-warm text-sm mb-3">
                Demonstrate it with numbers instead of claiming it as a trait.
              </p>
              <p className="text-ink/80 text-sm">
                <strong>Instead, write:</strong> "Built rapport with 200+ weekly customers, earning a
                4.9/5 customer feedback rating and a 40% repeat-visit rate."
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-black/[0.06] border-l-4 border-l-ink/20 shadow-sm">
              <h3 className="font-bold text-ink mb-2">
                "Good communicator"
              </h3>
              <p className="text-stone-warm text-sm mb-3">
                Prove it with achievements, not self-assessment.
              </p>
              <p className="text-ink/80 text-sm">
                <strong>Instead, write:</strong> "Drafted and delivered weekly client status reports to
                C-suite stakeholders, resulting in a 25% reduction in escalation requests."
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-black/[0.06] border-l-4 border-l-ink/20 shadow-sm">
              <h3 className="font-bold text-ink mb-2">
                "Detail-oriented"
              </h3>
              <p className="text-stone-warm text-sm mb-3">
                Show accuracy metrics rather than using a buzzword.
              </p>
              <p className="text-ink/80 text-sm">
                <strong>Instead, write:</strong> "Maintained 99.5% data entry accuracy across 500+
                customer records in Salesforce, reducing billing errors by 30%."
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Example Section */}
      <RevealSection>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8 text-center">
            How to use these keywords: before/after examples
          </h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Example 1: General Support */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-premium p-6">
              <h3 className="font-mono text-xs tracking-[0.15em] text-ink uppercase mb-3">
                General Customer Support
              </h3>
              <h4 className="font-bold text-ink mb-4">
                ❌ Generic (Before)
              </h4>
              <p className="text-stone-warm mb-4">
                "Answered customer emails and helped solve problems."
              </p>
              <h4 className="font-bold text-accent mb-4">
                ✅ Optimized (After)
              </h4>
              <p className="text-ink/80">
                "Managed high-volume support tickets through <strong>Zendesk</strong>, consistently
                exceeding <strong>SLA</strong> targets for response time and achieving a 95%{' '}
                <strong>Customer Satisfaction (CSAT)</strong> score through effective{' '}
                <strong>conflict resolution</strong> and <strong>active listening</strong>."
              </p>
            </div>

            {/* Example 2: Call Center */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-premium p-6">
              <h3 className="font-mono text-xs tracking-[0.15em] text-ink uppercase mb-3">
                Call Center Agent
              </h3>
              <h4 className="font-bold text-ink mb-4">
                ❌ Generic (Before)
              </h4>
              <p className="text-stone-warm mb-4">
                "Took phone calls from customers and resolved their issues."
              </p>
              <h4 className="font-bold text-accent mb-4">
                ✅ Optimized (After)
              </h4>
              <p className="text-ink/80">
                "Handled 80+ <strong>inbound calls</strong> daily, maintaining a{' '}
                <strong>First Call Resolution (FCR)</strong> rate of 88% and an{' '}
                <strong>Average Handle Time (AHT)</strong> of 4.2 minutes. Used{' '}
                <strong>de-escalation</strong> techniques to convert frustrated callers into satisfied
                customers, earning a 4.8/5 <strong>quality assurance</strong> score."
              </p>
            </div>

            {/* Example 3: Customer Success Manager */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-premium p-6">
              <h3 className="font-mono text-xs tracking-[0.15em] text-ink uppercase mb-3">
                Customer Success Manager
              </h3>
              <h4 className="font-bold text-ink mb-4">
                ❌ Generic (Before)
              </h4>
              <p className="text-stone-warm mb-4">
                "Managed customer accounts and helped with renewals."
              </p>
              <h4 className="font-bold text-accent mb-4">
                ✅ Optimized (After)
              </h4>
              <p className="text-ink/80">
                "Managed a portfolio of 45 enterprise accounts ($2.8M ARR), driving 96%{' '}
                <strong>customer retention</strong> through proactive <strong>QBRs</strong> and{' '}
                <strong>onboarding</strong> optimization. Improved <strong>NPS</strong> from 32 to 58
                and generated $420K in <strong>expansion revenue</strong> via strategic{' '}
                <strong>upselling</strong> during <strong>account management</strong> reviews."
              </p>
            </div>

            {/* Example 4: Technical Support */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-premium p-6">
              <h3 className="font-mono text-xs tracking-[0.15em] text-ink uppercase mb-3">
                Technical Support Specialist
              </h3>
              <h4 className="font-bold text-ink mb-4">
                ❌ Generic (Before)
              </h4>
              <p className="text-stone-warm mb-4">
                "Helped customers with computer problems and fixed technical issues."
              </p>
              <h4 className="font-bold text-accent mb-4">
                ✅ Optimized (After)
              </h4>
              <p className="text-ink/80">
                "Resolved 200+ <strong>Tier 2</strong> support tickets monthly via{' '}
                <strong>ServiceNow</strong>, performing <strong>root cause analysis</strong> and{' '}
                <strong>remote desktop</strong> diagnostics. Authored 35{' '}
                <strong>knowledge base</strong> articles that reduced repeat tickets by 22%, maintaining
                99.2% <strong>SLA compliance</strong> across all priority levels."
              </p>
            </div>

            {/* Example 5: Call Center Agent — AHT/FCR focused */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-premium p-6">
              <h3 className="font-mono text-xs tracking-[0.15em] text-ink uppercase mb-3">
                Call Center Agent — Outbound Sales Support
              </h3>
              <h4 className="font-bold text-ink mb-4">
                ❌ Generic (Before)
              </h4>
              <p className="text-stone-warm mb-4">
                "Made outbound calls to customers and sold products."
              </p>
              <h4 className="font-bold text-accent mb-4">
                ✅ Optimized (After)
              </h4>
              <p className="text-ink/80">
                "Executed 60+ <strong>outbound calls</strong> daily with a 22% conversion rate,
                maintaining an <strong>AHT</strong> of 3.8 minutes. Leveraged <strong>CRM</strong>{' '}
                data in <strong>Salesforce</strong> to personalize pitches, contributing $85K in
                quarterly <strong>upsell revenue</strong> while sustaining a 91%{' '}
                <strong>FCR</strong> rate on service-related inquiries."
              </p>
            </div>

            {/* Example 6: Customer Success Manager — NRR/Retention focused */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-premium p-6">
              <h3 className="font-mono text-xs tracking-[0.15em] text-ink uppercase mb-3">
                Customer Success Manager — Enterprise Accounts
              </h3>
              <h4 className="font-bold text-ink mb-4">
                ❌ Generic (Before)
              </h4>
              <p className="text-stone-warm mb-4">
                "Worked with enterprise clients to ensure satisfaction and renew contracts."
              </p>
              <h4 className="font-bold text-accent mb-4">
                ✅ Optimized (After)
              </h4>
              <p className="text-ink/80">
                "Owned a $4.2M book of business across 30 enterprise accounts, achieving 115%{' '}
                <strong>Net Revenue Retention (NRR)</strong> and reducing <strong>churn</strong> by 35%
                YoY. Designed a scalable <strong>onboarding</strong> playbook that cut time-to-value
                from 45 to 18 days, directly improving <strong>customer retention</strong> and{' '}
                <strong>NPS</strong> by 20 points."
              </p>
            </div>

            {/* Example 7: Technical Support — Resolution Rate focused */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-premium p-6">
              <h3 className="font-mono text-xs tracking-[0.15em] text-ink uppercase mb-3">
                Technical Support — SaaS Product
              </h3>
              <h4 className="font-bold text-ink mb-4">
                ❌ Generic (Before)
              </h4>
              <p className="text-stone-warm mb-4">
                "Answered technical questions from customers about the software."
              </p>
              <h4 className="font-bold text-accent mb-4">
                ✅ Optimized (After)
              </h4>
              <p className="text-ink/80">
                "Achieved a 94% <strong>first-contact resolution</strong> rate across 150+ weekly{' '}
                <strong>Tier 1/Tier 2</strong> tickets in <strong>Zendesk</strong>. Led{' '}
                <strong>screen-sharing</strong> diagnostic sessions for complex integrations,
                contributing to a 28% drop in <strong>escalation</strong> volume. Maintained 98.5%{' '}
                <strong>SLA compliance</strong> with an average <strong>response time</strong> of
                under 15 minutes."
              </p>
            </div>

            <p className="text-center text-stone-warm mt-6">
              Want to see a full resume using these keywords?{' '}
              <Link
                to="/examples/customer-service-representative"
                className="text-accent hover:text-ink underline font-medium"
              >
                View our customer service resume example
              </Link>.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* How to Find Your Personal Keywords */}
      <RevealSection>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8">
            How to find your personal customer service keywords
          </h2>
          <p className="text-lg text-stone-warm font-extralight mb-8 leading-relaxed">
            The most effective keywords aren't just pulled from a list — they're the overlap between
            what the employer wants and what you actually know. Here's how to find yours:
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] border-l-4 border-l-accent">
              <h3 className="text-lg font-bold text-ink mb-3">
                Step 1: Collect 3–5 job descriptions for your target role
              </h3>
              <p className="text-stone-warm">
                Search for your exact target title (e.g., "Customer Success Manager" not just "customer
                service"). Copy the requirements and qualifications sections into a document.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] border-l-4 border-l-accent">
              <h3 className="text-lg font-bold text-ink mb-3">
                Step 2: Highlight repeated skills and tools
              </h3>
              <p className="text-stone-warm">
                If "Salesforce" or "Zendesk" appears in 4 out of 5 job descriptions, it's a must-have
                keyword. If "ITIL" appears once, it's nice-to-have. Focus on the skills that appear most
                frequently — those are the ones the ATS is configured to scan for.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] border-l-4 border-l-accent">
              <h3 className="text-lg font-bold text-ink mb-3">
                Step 3: Match them to your real experience
              </h3>
              <p className="text-stone-warm">
                Only include keywords for skills you genuinely have. For each keyword, you should be able
                to describe a specific situation where you used that skill. If you list "Salesforce" but
                can't discuss it in an interview, it will backfire.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] border-l-4 border-l-accent">
              <h3 className="text-lg font-bold text-ink mb-3">
                Step 4: Weave keywords into your experience bullets
              </h3>
              <p className="text-stone-warm">
                Don't just list keywords in a skills section — embed them in your experience bullets with
                context and metrics. "Managed 120+ tickets/week in <strong>Zendesk</strong>" is far
                stronger than listing "Zendesk" in a skills table. See the before/after examples above.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* How to Tailor These Keywords to Your Resume */}
      <RevealSection>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8">
            How to tailor these keywords to your resume
          </h2>
          <p className="text-lg text-stone-warm font-extralight mb-8 leading-relaxed">
            Having a keyword list is only half the battle. Follow these five steps to integrate them
            effectively. For a deeper dive, read our{' '}
            <Link
              to="/blog/how-to-use-resume-keywords"
              className="text-accent hover:text-ink underline font-medium"
            >
              complete guide to using resume keywords
            </Link>.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] border-l-4 border-l-accent">
              <h3 className="text-lg font-bold text-ink mb-3">
                Step 1: Copy the job posting into a text editor
              </h3>
              <p className="text-stone-warm">
                Paste the full job description into a plain-text editor. Strip out formatting so you
                can focus purely on the words the employer chose. This is your keyword source document.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] border-l-4 border-l-accent">
              <h3 className="text-lg font-bold text-ink mb-3">
                Step 2: Highlight customer service keywords that match your experience
              </h3>
              <p className="text-stone-warm">
                Go through the posting line by line. Bold or highlight every skill, tool, metric, and
                qualification you genuinely possess. Cross-reference with the keyword lists on this
                page — if a term appears in both the job posting and our list, it is a high-priority
                keyword for your resume.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] border-l-4 border-l-accent">
              <h3 className="text-lg font-bold text-ink mb-3">
                Step 3: Integrate keywords naturally into your bullet points
              </h3>
              <p className="text-stone-warm">
                Avoid dumping keywords into a standalone skills block. Instead, weave them into your
                experience bullet points with action verbs and context. For example: "Resolved
                customer complaints using <strong>Zendesk</strong> and <strong>active
                listening</strong>, achieving 94% <strong>CSAT</strong>."
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] border-l-4 border-l-accent">
              <h3 className="text-lg font-bold text-ink mb-3">
                Step 4: Quantify everything with metrics
              </h3>
              <p className="text-stone-warm">
                Wherever possible, attach a number to your keywords: CSAT scores, tickets resolved per
                week, response time averages, retention rates, NPS improvements. Metrics turn keywords
                from buzzwords into evidence. See our before/after examples above for inspiration.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.06] border-l-4 border-l-accent">
              <h3 className="text-lg font-bold text-ink mb-3">
                Step 5: Run your resume through an ATS checker
              </h3>
              <p className="text-stone-warm">
                Before submitting, test your resume against the job description using an ATS
                compatibility tool. This will show you which keywords are present, which are missing,
                and where you need to adjust. Learn more in our{' '}
                <Link
                  to="/blog/ats-resume-optimization"
                  className="text-accent hover:text-ink underline font-medium"
                >
                  ATS resume optimization guide
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Ready to Build Your Customer Service Resume?"
        description="Use these keywords with our professional templates to showcase your expertise."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
