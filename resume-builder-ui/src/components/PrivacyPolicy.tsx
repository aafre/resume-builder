const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto my-10 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
      <p className="text-center text-gray-500 mb-6">
        Last Updated: 1 January 2026
      </p>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p>
          At <strong>EasyFreeResume.com</strong>, your privacy is important to
          us. This Privacy Policy explains how we handle and protect your data.
        </p>

        <h4 className="font-semibold mt-4">1. Two Usage Modes</h4>
        <p>
          <strong>Guest Mode (No Account):</strong> When you use our service without creating an account,
          all resume data is processed locally in your browser. We do not store, access, or have any
          record of your resume content, personal information, or uploaded files. Your data stays entirely
          on your device.
        </p>
        <p className="mt-2">
          <strong>Cloud Account (Optional):</strong> If you choose to create a free account, we store
          your resume data securely in our database (Supabase) so you can access your resumes from any device.
          We collect only: email address (for authentication), resume content you choose to save, and account
          metadata (creation date, last login).
        </p>

        <h4 className="font-semibold mt-4">2. Google User Data</h4>
        <p>
          When you choose to create an account using Google Sign-In, we access and store specific information
          from your Google account to provide authentication and personalization services.
        </p>
        <p className="mt-2">
          <strong>Data Accessed from Google:</strong> We access the following information from your Google account:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li><strong>Email Address:</strong> Used for account identification and authentication</li>
          <li><strong>Full Name:</strong> Used for personalizing your account experience</li>
          <li><strong>Profile Picture:</strong> Optionally displayed in your account dashboard</li>
        </ul>
        <p className="mt-2">
          <strong>How We Use Google Data:</strong> This information is used strictly for:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Authentication (logging you into your account)</li>
          <li>Account creation (setting up your user profile)</li>
          <li>Personalization (displaying your name and avatar in the dashboard)</li>
        </ul>
        <p className="mt-2">
          <strong>What We Do NOT Do:</strong> We do not use your Google data for advertisements, marketing
          campaigns, or selling to third parties. Your Google information is used solely for the purposes
          stated above.
        </p>
        <p className="mt-2">
          <strong>Google API Services Compliance:</strong> EasyFreeResume's use and transfer to any other app
          of information received from Google APIs will adhere to the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            className="text-accent underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>

        <h4 className="font-semibold mt-4">3. PDF Generation Processing</h4>
        <p>
          When you generate a PDF resume, your data is sent to our server temporarily to create the document.
          For guest users, this data is processed in memory and immediately discarded after the PDF is returned
          to you (typically within seconds). No copies are retained. For account users, the PDF generation
          uses your saved resume data but does not create additional permanent storage.
        </p>

        <h4 className="font-semibold mt-4">4. Data Storage and Security</h4>
        <p>
          <strong>Guest Users:</strong> Zero server-side storage. Your resume data exists only in your browser's
          local storage until you clear it or close the tab.
        </p>
        <p className="mt-2">
          <strong>Account Users:</strong> Your data is encrypted at rest and in transit. We use Supabase's
          secure infrastructure with industry-standard security practices. You can delete your account and all
          associated data at any time from your account settings.
        </p>

        <h4 className="font-semibold mt-4">5. Third-Party Services</h4>
        <p>
          We use Supabase for authentication and database services (account users only). We use analytics tools
          to understand aggregate usage patterns (page views, feature usage) but do not track individual resume
          content or personally identifiable information beyond what's required for account functionality.
        </p>

        <h4 className="font-semibold mt-4">6. Data Sharing and Sale</h4>
        <p>
          We do not sell, rent, or share your personal information or resume content with third parties for
          marketing purposes. We will never monetize your career data. Your information is yours alone.
        </p>

        <h4 className="font-semibold mt-4">7. Your Rights</h4>
        <p>
          You have the right to: access your data, request data deletion, export your data (YAML format),
          opt out of analytics cookies, and close your account at any time. For guest users, simply clearing
          your browser data removes all traces of your resume.
        </p>

        <h4 className="font-semibold mt-4">8. Changes to This Policy</h4>
        <p>
          We may update this policy to reflect new features or legal requirements. Significant changes will be
          announced on our homepage. Continued use after changes constitutes acceptance.
        </p>

        <h4 className="font-semibold mt-4">9. Contact Us</h4>
        <p>
          If you have questions about this policy, please email us at{" "}
          <a
            href="mailto:support@easyfreeresume.com"
            className="text-accent underline"
          >
            support@easyfreeresume.com
          </a>{" "}
          or reach out via Github by creating an issue{" "}
          <a
            href="https://github.com/aafre/resume-builder/issues"
            className="text-accent underline"
          >
            here
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
