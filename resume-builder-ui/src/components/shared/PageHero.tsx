/**
 * Page Hero Component
 * Hero section for SEO landing pages
 * Single responsibility: Display page header with CTAs
 *
 * Two compositions, chosen by `showcase`:
 *
 *  - Default (centred): unchanged. Template and hub pages put their own
 *    artifact directly below the hero, so a second one here would compete.
 *  - Showcase (asymmetric): type left, three real resumes right, on the
 *    landing page's grid. Every one of these pages is a cold search entry for
 *    someone who has been burned by a builder that paywalled the download.
 *    Opening on a headline over empty chalk asks them to take the claim on
 *    faith; opening on the finished document does not.
 *
 * The showcase collapses to a single centred column below lg, with the sheets
 * following the CTAs so the promise, the button and the evidence all land in
 * the first viewport on a phone.
 */

import { Link } from 'react-router-dom';
import type { HeroConfig } from '../../types/seo';
import HeroSheets from './HeroSheets';

interface PageHeroProps {
  config: HeroConfig;
  /** Pair the headline with the resume stack in an asymmetric two-column hero. */
  showcase?: boolean;
  className?: string;
}

export default function PageHero({ config, showcase = false, className = '' }: PageHeroProps) {
  const align = showcase ? 'lg:text-left' : '';

  const copy = (
    <>
      {/* Eyebrow */}
      {config.eyebrow && (
        <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
          {config.eyebrow}
        </p>
      )}

      {/* H1 - Most important SEO element.
          Two clamps, because the measure differs by a factor of two between the
          compositions. The centred hero keeps the full display scale across the
          whole column; in showcase mode the same clamp set a 72px headline in a
          600px column, which ran these long keyword H1s to five lines and
          pushed the CTA to the fold. [text-wrap:balance] stops the last line
          orphaning a word at either size. */}
      <h1
        className={`font-display font-extrabold leading-[1.08] tracking-tight text-ink mb-6 [text-wrap:balance] ${
          showcase
            ? 'text-[clamp(2.25rem,4.2vw,3.5rem)]'
            : 'text-[clamp(2.5rem,5.5vw,4.5rem)]'
        }`}
      >
        {config.h1}
      </h1>

      {/* Subtitle */}
      <p
        className={`text-xl md:text-2xl text-ink/60 mb-4 font-extralight ${
          showcase ? 'max-w-xl mx-auto lg:mx-0' : 'max-w-4xl mx-auto'
        }`}
      >
        {config.subtitle}
      </p>

      {/* Optional description */}
      {config.description && (
        <p
          className={`text-lg md:text-xl text-ink/60 mb-8 leading-relaxed font-extralight ${
            showcase ? 'max-w-xl mx-auto lg:mx-0' : 'max-w-3xl mx-auto'
          }`}
        >
          {config.description}
        </p>
      )}

      {/* CTAs */}
      {(config.primaryCTA || config.secondaryCTA) && (
        <div
          className={`flex flex-col sm:flex-row gap-4 items-center mt-8 justify-center ${
            showcase ? 'lg:justify-start' : ''
          }`}
        >
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
    </>
  );

  if (!showcase) {
    return <div className={`text-center mb-16 ${className}`}>{copy}</div>;
  }

  return (
    <div
      className={`grid lg:grid-cols-2 gap-y-12 gap-x-12 lg:gap-x-16 items-center text-center mb-16 ${align} ${className}`}
    >
      <div>{copy}</div>
      <HeroSheets />
    </div>
  );
}
