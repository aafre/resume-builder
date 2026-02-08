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
      {/* Eyebrow */}
      {config.eyebrow && (
        <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">
          {config.eyebrow}
        </p>
      )}

      {/* H1 - Most important SEO element */}
      <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[1.08] tracking-tight text-ink mb-6">
        {config.h1}
      </h1>

      {/* Subtitle */}
      <p className="text-xl md:text-2xl text-stone-warm mb-4 max-w-4xl mx-auto font-extralight">
        {config.subtitle}
      </p>

      {/* Optional description */}
      {config.description && (
        <p className="text-lg md:text-xl text-stone-warm mb-8 max-w-3xl mx-auto leading-relaxed font-extralight">
          {config.description}
        </p>
      )}

      {/* CTAs */}
      {(config.primaryCTA || config.secondaryCTA) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          {config.primaryCTA && (
            <Link
              to={config.primaryCTA.href}
              className={`${
                config.primaryCTA.variant === 'outline'
                  ? 'btn-secondary py-4 px-10'
                  : 'btn-primary py-4 px-10'
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
              className={`${
                config.secondaryCTA.variant === 'primary' || config.secondaryCTA.variant === 'secondary'
                  ? 'btn-primary py-4 px-10'
                  : 'btn-secondary py-4 px-10'
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
