/**
 * Customer Service Keywords Page
 * URL: /resume-keywords/customer-service
 * Target keyword: "customer service resume keywords"
 */

import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import BreadcrumbsWithSchema from '../shared/BreadcrumbsWithSchema';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
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
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12 max-w-4xl mx-auto">
        <h3 className="font-bold text-blue-800 mb-3">🔗 Part of Our Series</h3>
        <p className="text-blue-700">
          This article is part of our Resume Keywords series. For a complete overview, see our{' '}
          <a href="/resume-keywords" className="text-blue-600 hover:text-blue-800 underline font-medium">
            Resume Keywords Hub
          </a>.
        </p>
      </div>

      {/* Introductory Guidance Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          How to choose the right customer service keywords for your resume
        </h2>
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            "Customer service" is broad — a call center agent, a retail associate, and a customer success manager
            all fall under this umbrella, but hiring managers search for very different skills. The keywords
            you choose need to match the <em>specific</em> role you're applying for, not just generic service terms.
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Start with the job description. Highlight every skill, tool, and metric mentioned — those
            are your target keywords. Then cross-reference them with the lists below. If a keyword appears
            in both the job posting and our list, it belongs on your resume.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Don't stuff your resume with every keyword on this page. A focused set of 15–20 relevant
            keywords woven naturally into your experience bullets will outperform a resume that lists
            50 generic terms in a skills section. ATS systems look for keywords <em>in context</em>,
            and recruiters can spot keyword stuffing immediately.
          </p>
        </div>
      </div>

      {/* Keywords by Customer Service Role */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Keywords by customer service role
        </h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Different customer service roles require different keywords. Find your target role below
          and prioritize these terms on your resume.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">
              Retail Customer Service Representative
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Focus on sales floor interactions, product knowledge, and point-of-sale systems.
            </p>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• <strong>POS Systems</strong> — registers, Square, Shopify POS</li>
              <li>• <strong>Upselling / Cross-selling</strong> — revenue-driving skills</li>
              <li>• <strong>Product Knowledge</strong> — inventory and merchandising</li>
              <li>• <strong>Cash Handling</strong> — transactions and drawer reconciliation</li>
              <li>• <strong>Loss Prevention</strong> — shrinkage reduction</li>
              <li>• <strong>Visual Merchandising</strong> — displays and store presentation</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">
              Call Center Agent / Phone Support
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Emphasize call volume, metrics, and telephone-specific skills.
            </p>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• <strong>Average Handle Time (AHT)</strong> — call efficiency metric</li>
              <li>• <strong>Call Volume</strong> — e.g., "80+ calls/day"</li>
              <li>• <strong>First Call Resolution (FCR)</strong> — one-touch fixes</li>
              <li>• <strong>IVR Systems</strong> — interactive voice response navigation</li>
              <li>• <strong>Script Adherence</strong> — compliance and quality standards</li>
              <li>• <strong>De-escalation</strong> — calming upset callers</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">
              Technical Support Specialist
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Highlight diagnostic abilities, technical tools, and knowledge base contributions.
            </p>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• <strong>Troubleshooting</strong> — systematic diagnosis of issues</li>
              <li>• <strong>Remote Desktop Support</strong> — TeamViewer, AnyDesk</li>
              <li>• <strong>Tier 1 / Tier 2 / Tier 3 Support</strong> — escalation level</li>
              <li>• <strong>Knowledge Base</strong> — documentation and article creation</li>
              <li>• <strong>Root Cause Analysis</strong> — identifying underlying issues</li>
              <li>• <strong>SLA Compliance</strong> — meeting service-level commitments</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">
              Customer Success Manager
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Focus on retention, account growth, and strategic relationship management.
            </p>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li>• <strong>Customer Retention</strong> — churn reduction strategies</li>
              <li>• <strong>Net Promoter Score (NPS)</strong> — loyalty measurement</li>
              <li>• <strong>Account Management</strong> — portfolio oversight</li>
              <li>• <strong>Onboarding</strong> — new customer implementation</li>
              <li>• <strong>Upsell / Expansion Revenue</strong> — account growth</li>
              <li>• <strong>QBRs</strong> — quarterly business reviews</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm md:col-span-2">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">
              Help Desk / IT Support
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Combine customer service soft skills with IT-specific tools and processes.
            </p>
            <ul className="grid md:grid-cols-2 gap-x-6 gap-y-1 text-gray-700 text-sm">
              <li>• <strong>ITIL Framework</strong> — IT service management methodology</li>
              <li>• <strong>Active Directory</strong> — user account management</li>
              <li>• <strong>Ticketing Systems</strong> — Jira, ServiceNow, Freshservice</li>
              <li>• <strong>Password Resets / Access Management</strong> — common ticket types</li>
              <li>• <strong>Hardware Troubleshooting</strong> — physical device support</li>
              <li>• <strong>VPN / Network Connectivity</strong> — remote access support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Core Skills Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Core customer service skills (soft skills)
        </h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          These keywords describe the essential interpersonal abilities needed for any customer
          service role. They demonstrate your ability to work with people effectively.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-800 mb-4 text-lg">
              🤝 Communication Skills
            </h3>
            <ul className="space-y-2 text-green-700">
              <li>• Customer Support</li>
              <li>• Client Relations</li>
              <li>• Active Listening</li>
              <li>• Communication Skills</li>
              <li>• Interpersonal Skills</li>
              <li>• Verbal Communication</li>
              <li>• Written Communication</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-bold text-purple-800 mb-4 text-lg">
              🎯 Problem-Solving
            </h3>
            <ul className="space-y-2 text-purple-700">
              <li>• Conflict Resolution</li>
              <li>• Problem-Solving</li>
              <li>• Critical Thinking</li>
              <li>• Decision Making</li>
              <li>• Troubleshooting</li>
              <li>• Issue Resolution</li>
              <li>• Solution-Oriented</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Skills Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Technical skills & software (hard skills)
        </h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Listing specific tools you've used is critical. It shows you can jump into a new role
          with minimal training and demonstrates your technical competency.
        </p>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              CRM & Customer Management Software
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-blue-700">
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

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">
              Communication & Collaboration Tools
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-indigo-700">
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

      {/* Metrics Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Processes and metrics
        </h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          These keywords show you understand the business side of customer service and can work
          with performance metrics that matter to employers.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="font-bold text-orange-800 mb-4 text-lg">
            📊 Customer Service Metrics & KPIs
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-orange-700">
            <div>
              <h4 className="font-medium mb-2">Performance Metrics:</h4>
              <ul className="text-sm space-y-1">
                <li>• Customer Satisfaction (CSAT)</li>
                <li>• Net Promoter Score (NPS)</li>
                <li>• First Contact Resolution (FCR)</li>
                <li>• Average Handle Time (AHT)</li>
                <li>• Customer Effort Score (CES)</li>
                <li>• Response Time</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Process Keywords:</h4>
              <ul className="text-sm space-y-1">
                <li>• Quality Assurance (QA)</li>
                <li>• Service Level Agreements (SLAs)</li>
                <li>• Escalation Procedures</li>
                <li>• Inbound and Outbound Calls</li>
                <li>• Ticketing System</li>
                <li>• Knowledge Base Management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Example Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          How to use these keywords: before/after examples
        </h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Example 1: General Support */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
              General Customer Support
            </h3>
            <h4 className="font-bold text-gray-800 mb-4">
              ❌ Generic (Before)
            </h4>
            <p className="text-gray-600 mb-4">
              "Answered customer emails and helped solve problems."
            </p>
            <h4 className="font-bold text-green-800 mb-4">
              ✅ Optimized (After)
            </h4>
            <p className="text-gray-700">
              "Managed high-volume support tickets through <strong>Zendesk</strong>, consistently
              exceeding <strong>SLA</strong> targets for response time and achieving a 95%{' '}
              <strong>Customer Satisfaction (CSAT)</strong> score through effective{' '}
              <strong>conflict resolution</strong> and <strong>active listening</strong>."
            </p>
          </div>

          {/* Example 2: Call Center */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
              Call Center Agent
            </h3>
            <h4 className="font-bold text-gray-800 mb-4">
              ❌ Generic (Before)
            </h4>
            <p className="text-gray-600 mb-4">
              "Took phone calls from customers and resolved their issues."
            </p>
            <h4 className="font-bold text-green-800 mb-4">
              ✅ Optimized (After)
            </h4>
            <p className="text-gray-700">
              "Handled 80+ <strong>inbound calls</strong> daily, maintaining a{' '}
              <strong>First Call Resolution (FCR)</strong> rate of 88% and an{' '}
              <strong>Average Handle Time (AHT)</strong> of 4.2 minutes. Used{' '}
              <strong>de-escalation</strong> techniques to convert frustrated callers into satisfied
              customers, earning a 4.8/5 <strong>quality assurance</strong> score."
            </p>
          </div>

          {/* Example 3: Customer Success Manager */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
              Customer Success Manager
            </h3>
            <h4 className="font-bold text-gray-800 mb-4">
              ❌ Generic (Before)
            </h4>
            <p className="text-gray-600 mb-4">
              "Managed customer accounts and helped with renewals."
            </p>
            <h4 className="font-bold text-green-800 mb-4">
              ✅ Optimized (After)
            </h4>
            <p className="text-gray-700">
              "Managed a portfolio of 45 enterprise accounts ($2.8M ARR), driving 96%{' '}
              <strong>customer retention</strong> through proactive <strong>QBRs</strong> and{' '}
              <strong>onboarding</strong> optimization. Improved <strong>NPS</strong> from 32 to 58
              and generated $420K in <strong>expansion revenue</strong> via strategic{' '}
              <strong>upselling</strong> during <strong>account management</strong> reviews."
            </p>
          </div>

          {/* Example 4: Technical Support */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
              Technical Support Specialist
            </h3>
            <h4 className="font-bold text-gray-800 mb-4">
              ❌ Generic (Before)
            </h4>
            <p className="text-gray-600 mb-4">
              "Helped customers with computer problems and fixed technical issues."
            </p>
            <h4 className="font-bold text-green-800 mb-4">
              ✅ Optimized (After)
            </h4>
            <p className="text-gray-700">
              "Resolved 200+ <strong>Tier 2</strong> support tickets monthly via{' '}
              <strong>ServiceNow</strong>, performing <strong>root cause analysis</strong> and{' '}
              <strong>remote desktop</strong> diagnostics. Authored 35{' '}
              <strong>knowledge base</strong> articles that reduced repeat tickets by 22%, maintaining
              99.2% <strong>SLA compliance</strong> across all priority levels."
            </p>
          </div>
        </div>
      </div>

      {/* How to Find Your Personal Keywords */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          How to find your personal customer service keywords
        </h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          The most effective keywords aren't just pulled from a list — they're the overlap between
          what the employer wants and what you actually know. Here's how to find yours:
        </p>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Step 1: Collect 3–5 job descriptions for your target role
            </h3>
            <p className="text-gray-700">
              Search for your exact target title (e.g., "Customer Success Manager" not just "customer
              service"). Copy the requirements and qualifications sections into a document.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Step 2: Highlight repeated skills and tools
            </h3>
            <p className="text-gray-700">
              If "Salesforce" or "Zendesk" appears in 4 out of 5 job descriptions, it's a must-have
              keyword. If "ITIL" appears once, it's nice-to-have. Focus on the skills that appear most
              frequently — those are the ones the ATS is configured to scan for.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Step 3: Match them to your real experience
            </h3>
            <p className="text-gray-700">
              Only include keywords for skills you genuinely have. For each keyword, you should be able
              to describe a specific situation where you used that skill. If you list "Salesforce" but
              can't discuss it in an interview, it will backfire.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Step 4: Weave keywords into your experience bullets
            </h3>
            <p className="text-gray-700">
              Don't just list keywords in a skills section — embed them in your experience bullets with
              context and metrics. "Managed 120+ tickets/week in <strong>Zendesk</strong>" is far
              stronger than listing "Zendesk" in a skills table. See the before/after examples above.
            </p>
          </div>
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Ready to Build Your Customer Service Resume?"
        description="Use these keywords with our professional templates to showcase your expertise."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
