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
            <div key={index} className="bg-white rounded-2xl p-8 border border-black/[0.04] shadow-sm">
              <span className="font-mono text-3xl text-accent/30 mb-4 block">
                {String(step.number).padStart(2, '0')}
              </span>
              <h3 className="font-display text-lg font-extrabold text-ink mb-2">
                {step.title}
              </h3>
              <p className="font-display font-extralight text-stone-warm leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </RevealSection>
    </div>
  );
}
