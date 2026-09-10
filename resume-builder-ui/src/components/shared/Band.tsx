/**
 * Band — full-bleed tonal section
 *
 * The SEO pages sit inside SEOPageLayout's max-w-6xl column, which means every
 * section before this one was the same width on the same chalk ground. A Band
 * escapes that column (see `.band-bleed` in styles.css), tints the full
 * viewport row, and re-insets its own content, so a page can change tone
 * without any of its sections knowing they moved.
 *
 * Tone is the whole API. `chalk` is the page's own ground, so it is not a tone
 * here — a section that wants it simply is not a Band.
 *
 * On `ink` the text polarity flips: inside this component's children, muted
 * copy is `text-white/60` and the eyebrow is `text-accent`. `text-ink/60`
 * measures 1.00:1 on ink and disappears entirely, so a section is converted
 * into an ink band deliberately, never by wrapping it and hoping.
 */

import type { ReactNode } from 'react';
import RevealSection from './RevealSection';

type BandTone = 'ink' | 'chalk-dark' | 'white';

interface BandProps {
  tone: BandTone;
  children: ReactNode;
  /** Intrinsic-size hint for below-fold bands, e.g. "cv-h-500". */
  reserve?: string;
  /** Set false where the caller wraps its own RevealSection (e.g. staggered grids). */
  reveal?: boolean;
  className?: string;
}

const toneClass: Record<BandTone, string> = {
  ink: 'band-ink',
  'chalk-dark': 'band-chalk-dark',
  white: 'band-white',
};

export default function Band({
  tone,
  children,
  reserve,
  reveal = true,
  className = '',
}: BandProps) {
  const inner = <div className="max-w-6xl mx-auto">{children}</div>;

  return (
    <section
      className={[
        'band band-bleed py-16 md:py-24',
        toneClass[tone],
        reserve ? `cv-auto ${reserve}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Above the ink bloom, which paints on the section's own ::before. */}
      <div className="relative">
        {reveal ? <RevealSection variant="fade-up">{inner}</RevealSection> : inner}
      </div>
    </section>
  );
}
