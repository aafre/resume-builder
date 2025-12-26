import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { CloudOff } from 'lucide-react';

interface AnonymousWarningBadgeProps {
  onSignInClick: () => void;
}

/**
 * AnonymousWarningBadge - Warning status badge for anonymous users
 *
 * Features:
 * - Amber/yellow warning status indicator (not a premium feature)
 * - CloudOff icon to signal unsaved/disconnected state
 * - Click to reveal popover with cloud save upgrade message
 * - Responsive: "Unsaved" on mobile and desktop
 * - Headless UI Popover for accessibility (Escape key, focus management)
 * - Creates psychological tension: "My work is unsaved - I should fix this"
 */
export default function AnonymousWarningBadge({ onSignInClick }: AnonymousWarningBadgeProps) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          {/* Warning Status Badge */}
          <Popover.Button
            className="
              flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-amber-50 border border-amber-300
              text-amber-800 font-medium text-xs
              hover:bg-amber-100 hover:border-amber-400
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
            "
            aria-label="Storage warning - your work is not saved to cloud"
          >
            <CloudOff className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span className="sm:hidden">Unsaved</span>
            <span className="hidden sm:inline">Unsaved</span>
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
                shadow-xl shadow-amber-500/10
                border border-amber-200/50
                p-4
                z-[60]
              "
            >
              {/* Header */}
              <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <CloudOff className="w-4 h-4 text-amber-600" aria-hidden="true" />
                Save to Cloud Storage
              </h3>

              {/* Body */}
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Your resume is only saved on this device. Create a free account to save securely in the cloud and never lose your work.
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
                Access from anywhere, anytime
              </p>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
