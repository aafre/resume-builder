import { FaShieldAlt, FaLock, FaUsers } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6 border-t w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Privacy and Terms Links */}
        <div className="flex gap-4 mb-4 md:mb-0">
          <a href="/privacy-policy" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="text-blue-500 hover:underline">
            Terms of Service
          </a>
        </div>

        {/* Copyright Text */}
        <div className="flex gap-4 justify-center md:justify-start">
          <p className="text-sm">
            © {new Date().getFullYear()} EasyFreeResume.com - Build professional
            resumes effortlessly.
          </p>
        </div>

        {/* Icons and Features */}
        <div className="flex gap-6 items-center mt-4 md:mt-0">
          <div className="flex items-center gap-2 text-sm">
            <FaShieldAlt className="text-green-500" />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaLock className="text-blue-500" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaUsers className="text-yellow-500" />
            <span>Trusted by 50K+ Users</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
