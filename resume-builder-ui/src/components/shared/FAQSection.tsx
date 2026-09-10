/**
 * FAQ Section Component
 * Uses native <details>/<summary> for crawler-visible answers
 * Google explicitly supports <details> for FAQ rich results
 */

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { FAQConfig } from '../../types/seo';
import Band from './Band';
import RevealSection from './RevealSection';

interface FAQSectionProps {
  faqs: FAQConfig[];
  title?: string;
  className?: string;
}

export default function FAQSection({
  faqs,
  title = 'Frequently Asked Questions',
  className = '',
}: FAQSectionProps) {
  return (
    <Band tone="white" reveal={false} className={className}>
      <RevealSection>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-12 md:mb-16 text-center">
          {title}
        </h2>
      </RevealSection>
      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group border border-black/[0.06] rounded-lg overflow-hidden transition-all duration-200 hover:border-accent/30 open:border-accent/30"
          >
            {/* min-h-11 because a question that wraps to one short line was
                landing under the 44px target floor. The focus ring is the
                system's — ring-accent-text, never ring-accent, which is 1.87:1
                on chalk and cannot carry a focus indicator. */}
            <summary className="px-6 py-4 min-h-11 text-left flex justify-between items-center gap-4 bg-chalk hover:bg-chalk-dark group-open:bg-chalk-dark transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-inset">
              <span className="font-semibold text-ink">{faq.question}</span>
              <ChevronDownIcon
                className="w-5 h-5 text-ink/60 flex-shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <div className="faq-content">
              <div>
                <p className="text-ink/60 font-extralight leading-relaxed px-6 py-4">{faq.answer}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </Band>
  );
}
