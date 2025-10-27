/**
 * Step By Step Component
 * Display process steps in sequence
 * Single responsibility: Show sequential process
 */

import type { StepConfig } from '../../types/seo';

interface StepByStepProps {
  steps: StepConfig[];
  title?: string;
  className?: string;
}

export default function StepByStep({
  steps,
  title = 'How It Works',
  className = '',
}: StepByStepProps) {
  return (
    <div className={`mb-16 ${className}`}>
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connector line (not shown on mobile or last item) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform translate-x-12" />
            )}

            {/* Step card */}
            <div className="relative bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Step number */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto shadow-lg">
                {step.number}
              </div>

              {/* Step title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {step.title}
              </h3>

              {/* Step description */}
              <p className="text-gray-600 text-center leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
