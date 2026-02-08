/**
 * Proof Section Component
 * Display social proof, metrics, and trust indicators
 * Single responsibility: Show credibility metrics
 */

import type { MetricConfig } from '../../types/seo';

interface ProofSectionProps {
  metrics: MetricConfig[];
  className?: string;
}

export default function ProofSection({ metrics, className = '' }: ProofSectionProps) {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 ${className}`}
    >
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-100"
        >
          {/* Icon */}
          {metric.icon && (
            <div className="text-3xl mb-2">{metric.icon}</div>
          )}

          {/* Value */}
          <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
            {metric.value}
            {metric.suffix && (
              <span className="text-2xl">{metric.suffix}</span>
            )}
          </div>

          {/* Label */}
          <div className="text-sm text-gray-600 font-medium">
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}
