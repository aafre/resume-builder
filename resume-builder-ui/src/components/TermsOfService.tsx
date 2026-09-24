import LegalDocument, { type LegalSection } from './shared/LegalDocument';

const SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    body: (
      <p>
        By accessing or using <strong>EasyFreeResume.com</strong>, you agree to be bound by these Terms of
        Service. If you do not agree to these terms, please do not use our service.
      </p>
    ),
  },
  {
    id: 'service-description',
    title: 'Service Description',
    body: (
      <>
        <p>EasyFreeResume provides a free resume-building platform with two modes:</p>
        <ul>
          <li>
            <strong>Guest Mode:</strong> Build and download resumes without creating an account. All data
            is processed client-side in your browser.
          </li>
          <li>
            <strong>Cloud Account Mode:</strong> Create a free account to save up to 5 resumes and access
            them from any device.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    body: (
      <>
        <p>You agree to use our service only for lawful purposes. You must not:</p>
        <ul>
          <li>Upload malicious files, viruses, or harmful code</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use the service to create fraudulent or misleading resumes</li>
          <li>Scrape, harvest, or collect data from other users</li>
          <li>Violate any applicable laws or regulations</li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-handling',
    title: 'Data Handling and Storage',
    body: (
      <>
        <p>
          <strong>Guest Users:</strong> Your resume data is processed temporarily on our servers during PDF
          generation and immediately discarded. No permanent copies are retained.
        </p>
        <p>
          <strong>Account Users:</strong> Your saved resume data is stored in our secure database (Supabase).
          You retain full ownership of your data and can delete it at any time. We will never sell or misuse
          your information.
        </p>
      </>
    ),
  },
  {
    id: 'free-service-limits',
    title: 'Free Service Limits',
    body: (
      <p>
        Our service is completely free. Account users can save up to 5 resumes. We reserve the right to adjust
        these limits if necessary to maintain service quality, with advance notice to users.
      </p>
    ),
  },
  {
    id: 'no-guarantees',
    title: 'No Guarantees',
    body: (
      <p>
        While we strive to provide high-quality, ATS-friendly resume templates and accurate PDF generation,
        we make no guarantees regarding job placement, interview success, or hiring outcomes. The
        effectiveness of your resume depends on the content you provide and the specific requirements of
        employers. You are solely responsible for ensuring the accuracy, truthfulness, and legality of your
        resume content.
      </p>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    body: (
      <p>
        You retain full ownership of the content you create using our service. EasyFreeResume retains
        ownership of our platform code, templates, and design assets. Our platform is open-source under
        the MIT license (see our GitHub repository for details).
      </p>
    ),
  },
  {
    id: 'availability',
    title: 'Service Availability',
    body: (
      <p>
        We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. We may perform
        maintenance, updates, or experience downtime. We are not liable for any losses resulting from
        service unavailability.
      </p>
    ),
  },
  {
    id: 'termination',
    title: 'Account Termination',
    body: (
      <p>
        We reserve the right to suspend or terminate accounts that violate these Terms of Service, engage
        in abusive behavior, or misuse our platform. You may delete your account at any time from your
        account settings.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    body: (
      <p>
        EasyFreeResume is provided "as is" without warranties of any kind. We are not liable for any
        damages, losses, or consequences resulting from your use of our service, including but not limited
        to data loss, missed job opportunities, or technical issues.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    body: (
      <p>
        We may update these Terms of Service to reflect new features, legal requirements, or operational
        changes. Significant changes will be announced on our homepage. Continued use after changes
        constitutes acceptance of the updated terms.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    body: (
      <p>
        For inquiries, please contact us on Github by creating an issue{' '}
        <a href="https://github.com/aafre/resume-builder/issues" target="_blank" rel="noopener noreferrer">
          here
        </a>
        .
      </p>
    ),
  },
];

const TermsOfService = () => (
  <LegalDocument title="Terms of Service" lastUpdated="1 January 2026" sections={SECTIONS} />
);

export default TermsOfService;
