const TermsOfService = () => {
  return (
    <div className="container mx-auto my-10 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-bold text-center mb-6">Terms of Service</h1>
      <p className="text-center text-gray-500 mb-6">
        Last Updated: 1 January 2026
      </p>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h4 className="font-semibold">1. Acceptance of Terms</h4>
        <p>
          By accessing or using <strong>EasyFreeResume.com</strong>, you agree to be bound by these Terms of
          Service. If you do not agree to these terms, please do not use our service.
        </p>

        <h4 className="font-semibold mt-4">2. Service Description</h4>
        <p>
          EasyFreeResume provides a free resume-building platform with two modes:
          <ul className="list-disc ml-6 mt-2">
            <li><strong>Guest Mode:</strong> Build and download resumes without creating an account. All data
            is processed client-side in your browser.</li>
            <li><strong>Cloud Account Mode:</strong> Create a free account to save up to 5 resumes and access them
            from any device.</li>
          </ul>
        </p>

        <h4 className="font-semibold mt-4">3. Acceptable Use</h4>
        <p>
          You agree to use our service only for lawful purposes. You must not:
          <ul className="list-disc ml-6 mt-2">
            <li>Upload malicious files, viruses, or harmful code</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the service to create fraudulent or misleading resumes</li>
            <li>Scrape, harvest, or collect data from other users</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </p>

        <h4 className="font-semibold mt-4">4. Data Handling and Storage</h4>
        <p>
          <strong>Guest Users:</strong> Your resume data is processed temporarily on our servers during PDF
          generation and immediately discarded. No permanent copies are retained.
        </p>
        <p className="mt-2">
          <strong>Account Users:</strong> Your saved resume data is stored in our secure database (Supabase).
          You retain full ownership of your data and can delete it at any time. We will never sell or misuse
          your information.
        </p>

        <h4 className="font-semibold mt-4">5. Free Service Limits</h4>
        <p>
          Our service is completely free. Account users can save up to 5 resumes. We reserve the right to adjust
          these limits if necessary to maintain service quality, with advance notice to users.
        </p>

        <h4 className="font-semibold mt-4">6. No Guarantees</h4>
        <p>
          While we strive to provide high-quality, ATS-friendly resume templates and accurate PDF generation,
          we make no guarantees regarding job placement, interview success, or hiring outcomes. The
          effectiveness of your resume depends on the content you provide and the specific requirements of
          employers. You are solely responsible for ensuring the accuracy, truthfulness, and legality of your
          resume content.
        </p>

        <h4 className="font-semibold mt-4">7. Intellectual Property</h4>
        <p>
          You retain full ownership of the content you create using our service. EasyFreeResume retains
          ownership of our platform code, templates, and design assets. Our platform is open-source under
          the MIT license (see our GitHub repository for details).
        </p>

        <h4 className="font-semibold mt-4">8. Service Availability</h4>
        <p>
          We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. We may perform
          maintenance, updates, or experience downtime. We are not liable for any losses resulting from
          service unavailability.
        </p>

        <h4 className="font-semibold mt-4">9. Account Termination</h4>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms of Service, engage
          in abusive behavior, or misuse our platform. You may delete your account at any time from your
          account settings.
        </p>

        <h4 className="font-semibold mt-4">10. Limitation of Liability</h4>
        <p>
          EasyFreeResume is provided "as is" without warranties of any kind. We are not liable for any
          damages, losses, or consequences resulting from your use of our service, including but not limited
          to data loss, missed job opportunities, or technical issues.
        </p>

        <h4 className="font-semibold mt-4">11. Changes to Terms</h4>
        <p>
          We may update these Terms of Service to reflect new features, legal requirements, or operational
          changes. Significant changes will be announced on our homepage. Continued use after changes
          constitutes acceptance of the updated terms.
        </p>

        <h4 className="font-semibold mt-4">12. Contact Us</h4>
        <p>
          For inquiries, please contact us on Github by creating an issue{" "}
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

export default TermsOfService;
