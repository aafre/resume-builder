/**
 * Step By Step Component
 * Display process steps in sequence
 * Single responsibility: Show sequential process
 */

import type { StepConfig } from '../../types/seo';
import RevealSection from './RevealSection';

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
        <RevealSection>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-12 text-center">
            {title}
          </h2>
        </RevealSection>
      )}
      <RevealSection stagger>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line (not shown on mobile or last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-ink transform translate-x-12" />
              )}

              {/* Step card */}
              <div className="relative bg-white rounded-2xl p-6 shadow-md border border-black/[0.06] hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300">
                {/* Step number */}
                <div className="w-16 h-16 bg-ink text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto shadow-lg">
                  {step.number}
                </div>

                {/* Step title */}
                <h3 className="text-xl font-bold text-ink mb-3 text-center">
                  {step.title}
                </h3>

                {/* Step description */}
                <p className="text-stone-warm text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>
    </div>
  );
}
