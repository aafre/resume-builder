import LegalDocument, { type LegalSection } from './shared/LegalDocument';

const SECTIONS: LegalSection[] = [
  {
    id: 'usage-modes',
    title: 'Two Usage Modes',
    body: (
      <>
        <p>
          <strong>Guest Mode (No Account):</strong> When you use our service without creating an account,
          all resume data is processed locally in your browser. We do not store, access, or have any
          record of your resume content, personal information, or uploaded files. Your data stays entirely
          on your device.
        </p>
        <p>
          <strong>Cloud Account (Optional):</strong> If you choose to create a free account, we store
          your resume data securely in our database (Supabase) so you can access your resumes from any device.
          We collect only: email address (for authentication), resume content you choose to save, and account
          metadata (creation date, last login).
        </p>
      </>
    ),
  },
  {
    id: 'google-user-data',
    title: 'Google User Data',
    body: (
      <>
        <p>
          When you choose to create an account using Google Sign-In, we access and store specific information
          from your Google account to provide authentication and personalization services.
        </p>
        <p>
          <strong>Data Accessed from Google:</strong> We access the following information from your Google account:
        </p>
        <ul>
          <li><strong>Email Address:</strong> Used for account identification and authentication</li>
          <li><strong>Full Name:</strong> Used for personalizing your account experience</li>
          <li><strong>Profile Picture:</strong> Optionally displayed in your account dashboard</li>
        </ul>
        <p>
          <strong>How We Use Google Data:</strong> This information is used strictly for:
        </p>
        <ul>
          <li>Authentication (logging you into your account)</li>
          <li>Account creation (setting up your user profile)</li>
          <li>Personalization (displaying your name and avatar in the dashboard)</li>
        </ul>
        <p>
          <strong>What We Do NOT Do:</strong> We do not use your Google data for advertisements, marketing
          campaigns, or selling to third parties. Your Google information is used solely for the purposes
          stated above.
        </p>
        <p>
          <strong>Google API Services Compliance:</strong> EasyFreeResume's use and transfer to any other app
          of information received from Google APIs will adhere to the{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
      </>
    ),
  },
  {
    id: 'pdf-generation',
    title: 'PDF Generation Processing',
    body: (
      <p>
        When you generate a PDF resume, your data is sent to our server temporarily to create the document.
        For guest users, this data is processed in memory and immediately discarded after the PDF is returned
        to you (typically within seconds). No copies are retained. For account users, the PDF generation
        uses your saved resume data but does not create additional permanent storage.
      </p>
    ),
  },
  {
    id: 'storage-security',
    title: 'Data Storage and Security',
    body: (
      <>
        <p>
          <strong>Guest Users:</strong> Zero server-side storage. Your resume data exists only in your browser's
          local storage until you clear it or close the tab.
        </p>
        <p>
          <strong>Account Users:</strong> Your data is encrypted at rest and in transit. We use Supabase's
          secure infrastructure with industry-standard security practices. You can delete your account and all
          associated data at any time from your account settings.
        </p>
      </>
    ),
  },
  {
    id: 'third-party',
    title: 'Third-Party Services',
    body: (
      <p>
        We use Supabase for authentication and database services (account users only). We use PostHog for
        product analytics to understand how the site is used — page views, which features are used, and
        click and scroll patterns. If you are signed in, this activity is linked to your account identifier,
        so it is pseudonymous rather than anonymous; if you are not signed in, it is tied only to a random
        device identifier. We do <strong>not</strong> record your screen or session, and we never send your
        resume content, file names, or contact details to any analytics provider. Analytics are loaded after
        the page has rendered so they stay off the critical path.
      </p>
    ),
  },
  {
    id: 'sharing-sale',
    title: 'Data Sharing and Sale',
    body: (
      <p>
        We do not sell, rent, or share your personal information or resume content with third parties for
        marketing purposes. We will never monetize your career data. Your information is yours alone.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    body: (
      <p>
        You have the right to: access your data, request data deletion, export your data (YAML format),
        opt out of analytics cookies, and close your account at any time. For guest users, simply clearing
        your browser data removes all traces of your resume.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    body: (
      <p>
        We may update this policy to reflect new features or legal requirements. Significant changes will be
        announced on our homepage. Continued use after changes constitutes acceptance.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Us',
    body: (
      <p>
        If you have questions about this policy, please email us at{' '}
        <a href="mailto:support@easyfreeresume.com">support@easyfreeresume.com</a> or reach out via Github
        by creating an issue{' '}
        <a href="https://github.com/aafre/resume-builder/issues" target="_blank" rel="noopener noreferrer">
          here
        </a>
        .
      </p>
    ),
  },
];

const PrivacyPolicy = () => (
  <LegalDocument
    title="Privacy Policy"
    lastUpdated="4 August 2026"
    intro={
      <p>
        At <strong>EasyFreeResume.com</strong>, your privacy is important to us. This Privacy Policy
        explains how we handle and protect your data.
      </p>
    }
    sections={SECTIONS}
  />
);

export default PrivacyPolicy;
