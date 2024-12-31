const TermsOfService = () => {
  return (
    <div className="container mx-auto my-10 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-bold text-center mb-6">Terms of Service</h1>
      <p className="text-center text-gray-500 mb-6">
        Last Updated: 31 December 2024
      </p>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h4 className="font-semibold">1. Use of Service</h4>
        <p>
          <strong>EasyFreeResume.com</strong> provides a transient
          resume-building service. By using our service, you agree to:
          <ul className="list-disc ml-6 mt-2">
            <li>Use it only for personal purposes.</li>
            <li>Refrain from uploading malicious files.</li>
          </ul>
        </p>
        <h4 className="font-semibold mt-4">2. Data Handling</h4>
        <p>
          Your uploaded data is processed temporarily to create your resume.
          Once the resume is generated and sent to you, all associated data is
          deleted immediately from our servers.
        </p>
        <h4 className="font-semibold mt-4">3. No Guarantees</h4>
        <p>
          While we strive to provide accurate and professional resumes, the
          quality and effectiveness of your resume ultimately depend on the
          content you provide. Users are solely responsible for ensuring that
          the details they input are accurate, relevant, and complete.
        </p>
        <h4 className="font-semibold mt-4">4. Contact Us</h4>
        <p>
          For inquiries, please contact us on Github by creating an issue{" "}
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

export default TermsOfService;
