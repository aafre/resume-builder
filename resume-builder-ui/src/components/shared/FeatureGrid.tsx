/**
 * Feature Grid Component
 * Display features in a responsive grid
 * Single responsibility: Feature showcase
 */

import type { FeatureConfig } from '../../types/seo';

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
    <div
      className={`grid grid-cols-1 ${gridCols[columns]} gap-8 mb-16 ${className}`}
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
        >
          {/* Icon */}
          <div className="text-4xl mb-4">{feature.icon}</div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
