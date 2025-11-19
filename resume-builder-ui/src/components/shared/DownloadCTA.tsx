/**
 * Download CTA Component
 * Call-to-action for downloads (DOCX, PDF, Google Docs)
 * Single responsibility: Download action buttons
 */

import { Link } from 'react-router-dom';

interface DownloadCTAProps {
  title?: string;
  description?: string;
  primaryText?: string;
  primaryHref?: string;
  className?: string;
}

export default function DownloadCTA({
  title = 'Ready to Create Your Resume?',
  description = 'Get started now with our free resume builder. No sign-up required.',
  primaryText = 'Start Building',
  primaryHref = '/editor',
  className = '',
}: DownloadCTAProps) {
  return (
    <div
      className={`my-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8 md:p-12 text-center ${className}`}
    >
      <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
      <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">{description}</p>
      <Link
        to={primaryHref}
        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
      >
        {primaryText}
      </Link>
    </div>
  );
}
