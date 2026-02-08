/**
 * FAQ Section Component
 * Uses native <details>/<summary> for crawler-visible answers
 * Google explicitly supports <details> for FAQ rich results
 */

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { FAQConfig } from '../../types/seo';
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
    <div className={`bg-white rounded-2xl shadow-lg p-8 md:p-12 ${className}`}>
      <RevealSection>
        <h2 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-8 text-center">
          {title}
        </h2>
      </RevealSection>
      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group border border-black/[0.06] rounded-lg overflow-hidden transition-all duration-200 hover:border-accent/30"
          >
            <summary className="px-6 py-4 text-left flex justify-between items-center bg-chalk hover:bg-chalk-dark transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="font-semibold text-ink pr-4">{faq.question}</span>
              <ChevronDownIcon
                className="w-5 h-5 text-mist flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <div className="faq-content">
              <div>
                <p className="text-stone-warm leading-relaxed px-6 py-4">{faq.answer}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
