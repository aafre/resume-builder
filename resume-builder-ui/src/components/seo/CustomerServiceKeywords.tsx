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
          How to use these keywords: examples
        </h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
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
        </div>
      </div>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Ready to Build Your Customer Service Resume?"
        description="Use these keywords with our professional templates to showcase your expertise."
      />
    </SEOPageLayout>
  );
}
