/**
 * Feature Grid Component
 * Display features in a responsive grid
 * Single responsibility: Feature showcase
 *
 * Sits on a chalk-dark band so the white cards separate from the ground
 * instead of floating on near-identical chalk, which is what made eight
 * consecutive card sections read as one undifferentiated block.
 *
 * The spotlight edge is a hover state and nothing else: one passive listener on
 * the grid writes the pointer position into two custom properties on the card
 * under it, and `.spot-card::after` paints a radial gradient into the card's
 * 1px border ring. No per-frame JS, no rAF loop, no state — the listener does
 * two style writes and returns. It is gated on a fine pointer in CSS and here,
 * so touch devices never register it.
 */

import { useCallback } from 'react';
import type { PointerEvent } from 'react';
import type { FeatureConfig } from '../../types/seo';
import { FeatureIcon } from '../../utils/featureIcons';
import Band from './Band';
import RevealSection from './RevealSection';

interface FeatureGridProps {
  features: FeatureConfig[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function FeatureGrid({
  features,
  columns = 3,
  className = '',
}: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    // Pointer events fire for touch too; the effect only exists under a real
    // cursor, so anything else is dropped before it touches the DOM.
    if (event.pointerType !== 'mouse') return;

    const card = (event.target as HTMLElement).closest<HTMLElement>('.spot-card');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }, []);

  return (
    <Band tone="chalk-dark" reveal={false} className={className}>
      <RevealSection stagger>
        <div
          className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}
          onPointerMove={handlePointerMove}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="spot-card group bg-white rounded-2xl p-8 card-gradient-border shadow-premium shadow-premium-hover hover:-translate-y-1 motion-reduce:hover:translate-y-0 transition-all duration-300"
            >
              {/* Icon */}
              <div className="mb-5">
                <FeatureIcon emoji={feature.icon} index={index} />
              </div>

              {/* Title */}
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-ink/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </RevealSection>
    </Band>
  );
}
