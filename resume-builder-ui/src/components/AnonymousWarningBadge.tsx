import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Sparkles } from 'lucide-react';

interface AnonymousWarningBadgeProps {
  onSignInClick: () => void;
}

/**
 * AnonymousWarningBadge - Premium gradient badge for anonymous users
 *
 * Features:
 * - Brand gradient (blue-purple-indigo) with glass morphism
 * - Click to reveal popover with upgrade message + CTA
 * - Responsive: "Local" on mobile, "Local Only" on desktop
 * - Headless UI Popover for accessibility (Escape key, focus management)
 * - Positive, benefit-based messaging (upgrade prompt vs warning)
 */
export default function AnonymousWarningBadge({ onSignInClick }: AnonymousWarningBadgeProps) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          {/* Badge Button */}
          <Popover.Button
            className="
              relative overflow-hidden
              flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700
              text-white font-medium text-xs
              shadow-md shadow-purple-500/20
              hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
            "
            aria-label="Storage information"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sm:hidden">Local</span>
            <span className="hidden sm:inline">Local Only</span>
          </Popover.Button>

          {/* Popover Panel */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className="
                absolute top-full right-0 mt-2 w-72
                bg-white/95 backdrop-blur-xl
                rounded-2xl
                shadow-xl shadow-purple-500/10
                border border-white/50
                p-4
                z-[60]
              "
            >
              {/* Header */}
              <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" aria-hidden="true" />
                Upgrade to Cloud Storage
              </h3>

              {/* Body */}
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Your resume is saved locally on this device. Create a free account to save securely in the cloud and access from anywhere.
              </p>

              {/* CTA Button */}
              <button
                onClick={onSignInClick}
                className="
                  w-full
                  bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700
                  text-white text-sm font-semibold
                  py-2.5 px-4 rounded-lg
                  hover:from-blue-500 hover:via-purple-500 hover:to-indigo-600
                  hover:shadow-md
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                "
              >
                Create Free Account
              </button>

              {/* Footer Text */}
              <p className="text-xs text-gray-500 mt-2 text-center">
                Never lose your work again
              </p>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
