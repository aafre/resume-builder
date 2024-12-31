const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto my-10 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
      <p className="text-center text-gray-500 mb-6">
        Last Updated: 20 December 2024
      </p>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p>
          At <strong>EasyFreeResume.com</strong>, your privacy is important to
          us. This Privacy Policy explains how we handle and protect your data.
        </p>
        <h4 className="font-semibold mt-4">1. Information We Handle</h4>
        <p>
          We do not store any personal or uploaded information permanently. All
          data (e.g., YAML files, icons, and resumes) is processed transiently
          and deleted immediately after the resume is generated.
        </p>
        <h4 className="font-semibold mt-4">2. Transient Data Processing</h4>
        <p>
          Once you upload your details and click "Generate Resume," the data is
          used temporarily to create the resume. After the response is sent, all
          information is removed from our systems automatically.
        </p>
        <h4 className="font-semibold mt-4">3. No Tracking or Sharing</h4>
        <p>
          We do not use cookies or trackers, nor do we sell, share, or store
          your data with third parties. Your interaction with our service is
          private and secure.
        </p>
        <h4 className="font-semibold mt-4">4. Contact Us</h4>
        <p>
          If you have questions about this policy, please reach out to us via
          Github by creating an issue{" "}
          <a
            href="https://github.com/aafre/resume-builder/issues"
            className="text-blue-500 underline"
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
