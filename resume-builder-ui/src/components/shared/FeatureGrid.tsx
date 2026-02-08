/**
 * Feature Grid Component
 * Display features in a responsive grid
 * Single responsibility: Feature showcase
 */

import type { FeatureConfig } from '../../types/seo';
import { FeatureIcon } from '../../utils/featureIcons';
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

  return (
    <RevealSection stagger className={`mb-16 ${className}`}>
      <div
        className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-8 card-gradient-border shadow-premium shadow-premium-hover hover:-translate-y-1 motion-reduce:hover:translate-y-0 transition-all duration-300"
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
            <p className="text-stone-warm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </RevealSection>
  );
}
