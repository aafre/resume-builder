/**
 * FAQ Section Component
 * Collapsible FAQ with automatic schema generation
 * Single responsibility: Display FAQs with interaction
 */

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { FAQConfig } from '../../types/seo';

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-8 md:p-12 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
        {title}
      </h2>
      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-blue-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`px-6 overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'max-h-96 py-4' : 'max-h-0'
              }`}
            >
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
