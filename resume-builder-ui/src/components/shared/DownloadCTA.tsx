/**
 * Download CTA Component
 * Call-to-action for downloads (DOCX, PDF, Google Docs)
 * Single responsibility: Download action buttons
 */

import { Link } from 'react-router-dom';
import RevealSection from './RevealSection';

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
  primaryHref = '/templates',
  className = '',
}: DownloadCTAProps) {
  // Use native anchor for hash links (same-page scroll), Link for routes
  const isHashLink = primaryHref.startsWith('#');

  return (
    <RevealSection variant="scale-in">
      <div
        className={`my-16 bg-ink text-white rounded-3xl py-20 px-6 md:px-12 text-center relative overflow-hidden ${className}`}
      >
        {/* Radial accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/[0.07] blur-3xl pointer-events-none" />

        <div className="relative">
          <h3 className="font-display text-2xl md:text-3xl font-extrabold mb-4">{title}</h3>
          <p className="text-lg md:text-xl font-extralight text-white/70 mb-8 max-w-2xl mx-auto">{description}</p>
          {isHashLink ? (
            <a href={primaryHref} className="btn-primary py-4 px-10">
              {primaryText}
            </a>
          ) : (
            <Link to={primaryHref} className="btn-primary py-4 px-10">
              {primaryText}
            </Link>
          )}
        </div>
      </div>
    </RevealSection>
  );
}
