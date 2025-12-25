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
        className="bg-white p-6 sm:p-8 rounded-lg max-w-3xl w-full shadow-2xl relative"
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <MdClose className="text-2xl" />
        </button>

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
            onClick={() => setSelectedOption('empty')}
            className={`group relative p-5 sm:p-6 border-2 rounded-xl transition-all duration-200 text-left bg-gradient-to-br from-green-50 to-white ${
              selectedOption === 'empty'
                ? 'border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-[1.02]'
                : 'border-green-300 hover:border-green-500 hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {/* Recommended Badge */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-500 text-white text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1">
              <MdCheckCircle className="text-xs" />
              Recommended
            </div>

            {/* Selection Indicator */}
            {selectedOption === 'empty' && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-600 text-white p-1.5 rounded-full shadow-md">
                <MdCheckCircle className="text-xl" />
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <MdEditNote className="text-3xl text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">
                  Start from Scratch
                </h3>
                <p className="text-sm text-gray-600">
                  • Clean slate • Full control
                </p>
              </div>
            </div>
          </button>

          {/* Option B: Example Data */}
          <button
            onClick={() => setSelectedOption('example')}
            className={`group relative p-5 sm:p-6 border-2 rounded-xl transition-all duration-200 text-left bg-white ${
              selectedOption === 'example'
                ? 'border-blue-400 shadow-lg scale-[1.02]'
                : 'border-gray-200 hover:border-blue-400 hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {/* Selection Indicator */}
            {selectedOption === 'example' && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-600 text-white p-1.5 rounded-full shadow-md">
                <MdCheckCircle className="text-xl" />
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <MdPreview className="text-3xl text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">
                  Use Example Content
                </h3>
                <p className="text-sm text-gray-600">
                  • Pre-written text • Layout preview
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <button
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
          onClick={handleContinue}
          disabled={!selectedOption}
        >
          {selectedOption ? 'Start Building' : 'Select an option to continue'}
        </button>
      </div>
    </div>
  );
};

export default TemplateStartModal;
