/**
 * Step By Step Component
 * Display process steps in sequence
 * Single responsibility: Show sequential process
 *
 * This is the one authored moment on an SEO landing page, and it earns that by
 * position: it sits directly under the hero, it is the first thing a cold
 * visitor reads after the promise, and it is the section that answers "what do
 * I actually have to do". So it gets the page's only mid-document tonal change
 * — a full-bleed ink band — and a rail that draws itself from the scroll
 * position, pulling the eye through the sequence instead of handing over three
 * finished boxes.
 *
 * Polarity flips inside the band: copy is `text-white` / `text-white/60` and the
 * numeral is `text-accent`, which measures 9.98:1 on ink and is the one ground
 * in this system where Signal Green can carry text. `text-ink/60` here would be
 * 1.00:1 — invisible, not merely low.
 */

import type { StepConfig } from '../../types/seo';
import Band from './Band';
import RevealSection from './RevealSection';

interface StepByStepProps {
  steps: StepConfig[];
  title?: string;
  /** Mono label above the title. Callers that previously set one outside the
   *  component pass it here instead — an eyebrow left on chalk above a
   *  full-bleed ink band reads as an orphan. */
  eyebrow?: string;
  /** Lead paragraph between the title and the steps, same reason. */
  intro?: string;
  className?: string;
}

export default function StepByStep({
  steps,
  title = 'How It Works',
  eyebrow,
  intro,
  className = '',
}: StepByStepProps) {
  return (
    <Band tone="ink" reveal={false} className={className}>
      {(title || eyebrow || intro) && (
        <RevealSection className="text-center mb-12 md:mb-16">
          {eyebrow && (
            <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {title}
            </h2>
          )}
          {intro && (
            <p className="text-lg md:text-xl font-extralight text-white/60 max-w-3xl mx-auto leading-relaxed mt-5">
              {intro}
            </p>
          )}
        </RevealSection>
      )}
      <RevealSection stagger>
        {/* The rail lives on this element's ::before, behind the cards, and is
            pinned to the numerals' centreline. See `.step-rail` in styles.css:
            one line per axis, vertical when the steps stack. */}
        <div className="step-rail grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex items-start gap-5 md:block md:text-center"
            >
              {/* Step number. Ringed rather than filled: a solid disc on ink
                  needs a light fill to be seen, and a row of white discs would
                  out-shout the rail they sit on. */}
              <div className="step-num relative z-10 flex-none w-14 h-14 md:w-16 md:h-16 rounded-full bg-ink flex items-center justify-center font-mono text-xl md:text-2xl text-accent md:mx-auto md:mb-6">
                {step.number}
              </div>

              <div className="pt-1 md:pt-0">
                <h3 className="font-display text-xl font-bold text-white mb-2 md:mb-3">
                  {step.title}
                </h3>
                <p className="text-white/60 font-extralight leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>
    </Band>
  );
}
