import React, { useState, useEffect, useRef } from "react";
import { MdEditNote, MdPreview, MdCheckCircle, MdClose } from "react-icons/md";

interface TemplateStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmpty: () => void;
  onSelectExample: () => void;
  templateName: string;
}

export const TemplateStartModal: React.FC<TemplateStartModalProps> = ({
  isOpen,
  onClose,
  onSelectEmpty,
  onSelectExample,
  templateName,
}) => {
  const [selectedOption, setSelectedOption] = useState<'empty' | 'example' | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset selection when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedOption(null);
    }
  }, [isOpen]);

  // Auto-focus modal on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (selectedOption === 'empty') {
      onSelectEmpty();
    } else if (selectedOption === 'example') {
      onSelectExample();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter" && selectedOption) {
      handleContinue();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      // Toggle between options with arrow keys
      setSelectedOption(current => {
        if (current === 'empty') return 'example';
        if (current === 'example') return 'empty';
        return 'empty'; // Default to first option
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        className="bg-white p-6 sm:p-8 rounded-lg max-w-3xl w-full shadow-2xl"
        tabIndex={-1}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
          How would you like to start?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Choose how to initialize your <span className="font-semibold">{templateName}</span> resume
        </p>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Option A: Empty Structure (Recommended) */}
          <button
            onClick={onSelectEmpty}
            className="group relative p-5 sm:p-6 border-2 border-green-300 rounded-xl hover:border-green-500 hover:shadow-lg transition-all duration-200 text-left bg-gradient-to-br from-green-50 to-white hover:scale-[1.02]"
          >
            {/* Recommended Badge */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-500 text-white text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1">
              <MdCheckCircle className="text-xs" />
              Recommended
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <MdEditNote className="text-3xl text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">
                  Start with Empty Structure
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Clean template with placeholders. Start from scratch with your own content.
                </p>
                <p className="text-xs text-gray-500 italic">
                  Perfect for building your resume step-by-step.
                </p>
              </div>
            </div>
          </button>

          {/* Option B: Example Data */}
          <button
            onClick={onSelectExample}
            className="group relative p-5 sm:p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <MdPreview className="text-3xl text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">
                  Load Example Data
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  See the template filled with sample content. Great for understanding formatting.
                </p>
                <p className="text-xs text-gray-500 italic">
                  Explore how the template looks with real data.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Cancel Button */}
        <button
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-3 rounded-lg transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TemplateStartModal;
