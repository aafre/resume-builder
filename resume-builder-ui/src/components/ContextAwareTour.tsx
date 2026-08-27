import { useState, useEffect, useMemo, useId } from 'react';
import ModalShell from './shared/ModalShell';
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
 * ContextAwareTour - 4-5 step onboarding tour with auth-aware content
 *
 * - Step content branches on `isAnonymous`; steps may be filtered out entirely
 *   by `visibleFor` (anonymous users see 4 steps, authenticated users see 5).
 * - The account CTA on step 1 is a text link, not a primary button. This is the
 *   first thing a new visitor meets and Principle 1 ("the download is never held
 *   hostage") means it must not open on sign-in pressure.
 * - Dialog semantics — role, focus trap, Escape, scroll lock, portal — come from
 *   `ModalShell`, like every other overlay in the app.
 *
 * There is deliberately no element highlighting. See the report / git history:
 * the scrim blurs the page behind it, so a ring around a blurred element points
 * at nothing, and two of the targets (`tour-bubble-menu`, and the whole
 * `SectionNavigator` on mobile) are not in the DOM when their step renders.
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
  // A backdrop click or Escape closes the tour for now, but must NOT mark it
  // completed — a misclick should not cost a first-time user their onboarding
  // forever. The parent currently wires `onClose` to the same handler that
  // persists `tour_completed`, so the non-persisting exit is held locally.
  // ponytail: local flag; delete it once the parent passes a plain close handler.
  const [dismissed, setDismissed] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  // Filter steps based on auth state
  const filteredSteps = useMemo(() => {
    return TOUR_STEPS.filter(step => {
      if (!step.visibleFor || step.visibleFor === 'all') return true;
      if (step.visibleFor === 'authenticated') return isAuthenticated;
      if (step.visibleFor === 'anonymous') return isAnonymous;
      return true;
    });
  }, [isAuthenticated, isAnonymous]);

  // Reset to first step when tour opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setDismissed(false);
    }
  }, [isOpen]);

  const step = filteredSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === filteredSteps.length - 1;

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

  /** Backdrop / Escape: close, do not record the tour as done. */
  const handleDismiss = () => setDismissed(true);

  const handleComplete = () => {
    onTourComplete();
    onClose();
  };

  const handleCTAClick = () => {
    onSignInClick();
    onClose(); // Close tour to give auth modal full focus
  };

  if (!step) return null;

  // Auth-specific content, falling back to the authenticated copy when a step
  // does not need to say anything different to anonymous users.
  const title = (isAnonymous && step.title.anonymous) || step.title.authenticated;
  const content = (isAnonymous && step.content.anonymous) || step.content.authenticated;
  const Icon = content.icon;
  const showCTA = Boolean(step.ctaButton?.showForAnonymousOnly && isAnonymous);

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2';

  return (
    <ModalShell
      isOpen={isOpen && !dismissed}
      onClose={handleDismiss}
      labelledBy={titleId}
      describedBy={descriptionId}
      overlayClassName="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      panelClassName="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 relative"
    >
      {/* Skip — explicit, so it does record completion */}
      <button
        type="button"
        onClick={handleComplete}
        className={`absolute top-3 right-3 inline-flex min-h-11 items-center px-3 rounded-lg text-sm font-medium text-stone-warm hover:text-ink hover:bg-black/5 transition-colors duration-150 z-10 ${focusRing}`}
      >
        Skip Tour
      </button>

      <div className="p-8 pt-16">
        <h2 id={titleId} className="text-2xl font-bold text-ink mb-6">
          {title}
        </h2>

        <div className="flex gap-4 mb-6">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent/[0.08] flex items-center justify-center">
            <Icon className="w-5 h-5 text-accent-text" aria-hidden="true" />
          </div>
          <p
            id={descriptionId}
            className="flex-1 text-stone-warm text-base leading-relaxed whitespace-pre-line"
          >
            {content.description}
          </p>
        </div>

        {/* Account offer — available, not prominent */}
        {showCTA && (
          <button
            type="button"
            onClick={handleCTAClick}
            className={`inline-flex min-h-11 items-center rounded-lg text-sm font-medium text-accent-text underline underline-offset-4 hover:text-ink transition-colors duration-150 ${focusRing}`}
          >
            {step.ctaButton!.text}
          </button>
        )}

        {/* Step indicators — 8px dots inside 44px targets */}
        <div className="flex items-center justify-center mb-2 mt-4">
          {filteredSteps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentStep(index)}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg ${focusRing}`}
              aria-label={`Go to step ${index + 1} of ${filteredSteps.length}`}
              aria-current={index === currentStep ? 'step' : undefined}
            >
              <span
                aria-hidden="true"
                className={`block h-2 rounded-full transition-[width,background-color] duration-200 ${
                  index === currentStep ? 'bg-accent w-8' : 'bg-gray-300 w-2'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`inline-flex min-h-11 items-center px-6 rounded-lg font-medium transition-colors duration-150 ${focusRing} ${
              isFirstStep
                ? 'text-stone-warm/40 cursor-not-allowed'
                : 'text-ink hover:bg-black/5'
            }`}
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            className={`inline-flex min-h-11 items-center px-6 rounded-lg bg-accent text-ink font-semibold shadow-sm hover:shadow-md active:scale-[0.98] transition-[box-shadow,transform] duration-150 ${focusRing}`}
          >
            {isLastStep ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
