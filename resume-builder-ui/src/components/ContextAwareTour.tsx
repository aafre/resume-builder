import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { TOUR_STEPS } from '../constants/tourSteps';

interface ContextAwareTourProps {
  isOpen: boolean;
  onClose: () => void;
  isAnonymous: boolean;
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onTourComplete: () => void;
}

/**
 * ContextAwareTour - 5-step onboarding tour with auth-aware content
 *
 * Features:
 * - Step content branches based on isAnonymous flag
 * - Step 4 is critical: completely different for auth vs anonymous
 * - Highlights target elements (via DOM IDs) when specified
 * - CTA button in Step 4 (anonymous only) triggers sign-in
 * - Z-index 9999 to sit above all other elements
 */
export default function ContextAwareTour({
  isOpen,
  onClose,
  isAnonymous,
  isAuthenticated,
  onSignInClick,
  onTourComplete
}: ContextAwareTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset to first step when tour opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  // Get auth-specific content
  const title = isAnonymous ? step.title.anonymous : step.title.authenticated;
  const content = isAnonymous ? step.content.anonymous : step.content.authenticated;
  const showBadge = step.badge && (!step.badge.showForAnonymousOnly || isAnonymous);
  const showCTA = step.ctaButton?.showForAnonymousOnly && isAnonymous;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onTourComplete();
    onClose();
  };

  const handleComplete = () => {
    onTourComplete();
    onClose();
  };

  const handleCTAClick = () => {
    onSignInClick();
    // Don't close tour - let user complete sign-in then continue if needed
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
        onClick={handleSkip}
      />

      {/* Tour modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 relative pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium z-10"
          >
            Skip Tour
          </button>

          <div className="p-8 pt-10">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {title}
            </h2>

            {/* Badge (if applicable) */}
            {showBadge && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${
                step.badge!.type === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                step.badge!.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-green-50 text-green-700 border border-green-200'
              }`}>
                <span>
                  {step.badge!.type === 'info' && '💡'}
                  {step.badge!.type === 'warning' && '⚠️'}
                  {step.badge!.type === 'success' && '✓'}
                </span>
                <span>{step.badge!.text}</span>
              </div>
            )}

            {/* Content Items */}
            <div className="space-y-5 mb-6 mt-6">
              {content.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="text-2xl flex-shrink-0">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {item.heading}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button (Step 4 anonymous only) */}
            {showCTA && (
              <button
                onClick={handleCTAClick}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md hover:shadow-lg mb-4"
              >
                {step.ctaButton!.text}
              </button>
            )}

            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {TOUR_STEPS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`transition-all rounded-full ${
                    index === currentStep
                      ? 'bg-blue-600 w-8 h-2'
                      : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              {/* Previous Button */}
              <button
                onClick={handlePrevious}
                disabled={isFirstStep}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  isFirstStep
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Previous
              </button>

              {/* Next/Get Started Button */}
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-all shadow-sm hover:shadow-md"
              >
                {isLastStep ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
