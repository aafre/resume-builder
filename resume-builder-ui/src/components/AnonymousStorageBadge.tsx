import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Check } from 'lucide-react';

interface AnonymousStorageBadgeProps {
  onSignInClick: () => void;
}

/**
 * AnonymousStorageBadge - where an anonymous user's work currently lives
 *
 * The work IS saved — locally — so this states that rather than claiming the
 * opposite. It is a neutral status affordance, not a warning: no amber, no
 * alert iconography, no error semantics. The cloud account is offered in the
 * popover as an upgrade the user can take or leave.
 *
 * Features:
 * - Neutral chrome colours, matching the header's resting palette
 * - Responsive label: "Saved" below sm, "Saved on device" from sm up
 * - Headless UI Popover for accessibility (Escape key, focus management)
 */
export default function AnonymousStorageBadge({ onSignInClick }: AnonymousStorageBadgeProps) {
  return (
    <Popover className="relative">
      <Popover.Button
        className="
          flex min-h-11 items-center gap-2 px-3 py-1.5 rounded-full
          bg-white border border-gray-200
          text-stone-warm font-medium text-xs
          hover:bg-black/5 hover:text-ink
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2
        "
        aria-label="Storage details — this resume is saved on this device"
      >
        <Check className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="sm:hidden">Saved</span>
        <span className="hidden sm:inline">Saved on device</span>
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
            rounded-xl
            shadow-xl
            border border-gray-200
            p-4
            z-[60]
          "
        >
          <h3 className="text-sm font-semibold text-ink mb-2">
            Save to the cloud too
          </h3>

          <p className="text-xs text-stone-warm mb-3 leading-relaxed">
            Your resume is saved on this device and stays there. A free account also keeps it
            in the cloud, so you can pick it up on another device.
          </p>

          <button
            onClick={onSignInClick}
            className="
              w-full min-h-11
              bg-accent
              text-ink text-sm font-semibold
              py-2.5 px-4 rounded-lg
              hover:shadow-md
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2
            "
          >
            Create Free Account
          </button>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
