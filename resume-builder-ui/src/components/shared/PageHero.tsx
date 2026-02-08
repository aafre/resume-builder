/**
 * Page Hero Component
 * Hero section for SEO landing pages
 * Single responsibility: Display page header with CTAs
 */

import { Link } from 'react-router-dom';
import type { HeroConfig } from '../../types/seo';

interface PageHeroProps {
  config: HeroConfig;
  className?: string;
}

export default function PageHero({ config, className = '' }: PageHeroProps) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      {/* H1 - Most important SEO element with gradient text like landing page */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-accent relative">
        <span className="absolute inset-0 text-gray-800 opacity-10">{config.h1}</span>
        {config.h1}
      </h1>

      {/* Subtitle */}
      <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-4xl mx-auto font-medium">
        {config.subtitle}
      </p>

      {/* Optional description */}
      {config.description && (
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {config.description}
        </p>
      )}

      {/* CTAs */}
      {(config.primaryCTA || config.secondaryCTA) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          {config.primaryCTA && (
            <Link
              to={config.primaryCTA.href}
              className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
                config.primaryCTA.variant === 'primary'
                  ? 'bg-accent text-ink hover:bg-accent/90'
                  : config.primaryCTA.variant === 'secondary'
                  ? 'bg-accent text-ink hover:bg-accent/90'
                  : 'bg-white text-accent border-2 border-accent hover:bg-accent/[0.06]'
              }`}
              target={config.primaryCTA.openInNewTab ? '_blank' : undefined}
              rel={config.primaryCTA.openInNewTab ? 'noopener noreferrer' : undefined}
            >
              {config.primaryCTA.text}
            </Link>
          )}
          {config.secondaryCTA && (
            <Link
              to={config.secondaryCTA.href}
              className={`px-8 py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                config.secondaryCTA.variant === 'primary'
                  ? 'bg-accent text-ink hover:bg-accent/90'
                  : config.secondaryCTA.variant === 'secondary'
                  ? 'bg-accent text-ink hover:bg-accent/90'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              target={config.secondaryCTA.openInNewTab ? '_blank' : undefined}
              rel={config.secondaryCTA.openInNewTab ? 'noopener noreferrer' : undefined}
            >
              {config.secondaryCTA.text}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
