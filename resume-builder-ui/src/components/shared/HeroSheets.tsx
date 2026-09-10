/**
 * HeroSheets — three real rendered resumes, dealt on a loop.
 *
 * The same artifact as the landing page hero, and deliberately the same one: a
 * visitor who arrives cold on /free-resume-builder-no-sign-up is being asked to
 * believe the download is genuinely free, and the fastest way to make that
 * argument is to show the finished thing before asking for anything. Until now
 * these twenty pages opened on a headline over empty chalk — the first viewport
 * contained no evidence at all.
 *
 * Two things differ from the landing page's copy of this:
 *
 *  1. Every sheet loads lazily at low priority. On the landing page the face-up
 *     sheet is the LCP candidate and is fetched eagerly; here the H1 is the LCP
 *     element on a prerendered document, and keeping it that way was expensive
 *     to win. Nothing in this column may compete for it.
 *  2. The column reserves its height in CSS (`.hero-showcase`) rather than
 *     deriving it from the images, so the sheets arriving late shifts nothing.
 *
 * The deal animation, the resting fan, the reduced-motion state and the
 * offscreen pause all come from `.hero-stack` / `.hero-sheet` in styles.css and
 * are shared verbatim.
 */

import { useScrollReveal } from '../../hooks/useScrollReveal';

const HERO_SHEETS = ['alex_rivera', 'jane_doe', 'modern-with-icons'] as const;

export default function HeroSheets() {
  // `once: false` keeps the observer alive so the infinite deal can be paused
  // while the hero is off screen. These pages scroll several thousand pixels;
  // an unpaused loop would cost paint for the whole session.
  const ref = useScrollReveal<HTMLDivElement>({ once: false });

  return (
    <div
      ref={ref}
      className="hero-frame hero-seq hero-showcase flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="hero-card-in">
        <div className="hero-stack">
          {HERO_SHEETS.map((sheet, i) => (
            <img
              key={sheet}
              data-i={i}
              className="hero-sheet"
              src={`/hero/${sheet}.webp`}
              alt=""
              width={640}
              height={828}
              decoding="async"
              loading="lazy"
              // React 18.3's runtime drops the camelCase `fetchPriority` prop
              // with a warning instead of mapping it to an attribute, so the
              // hint never reaches the fetch. Lowercase passes straight through.
              {...({ fetchpriority: 'low' } as unknown as React.ImgHTMLAttributes<HTMLImageElement>)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
