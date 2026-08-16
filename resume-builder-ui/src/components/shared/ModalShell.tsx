import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import useFocusTrap from "../../hooks/useFocusTrap";
import useScrollLock from "../../hooks/useScrollLock";

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** id of the element naming this dialog — usually its heading. */
  labelledBy?: string;
  /** Accessible name, when there is no visible heading to point at. */
  label?: string;
  /** id of the element describing this dialog — usually its body copy. */
  describedBy?: string;
  /** Classes for the dialog panel itself. */
  panelClassName?: string;
  /** Classes for the full-screen overlay. Override to change alignment. */
  overlayClassName?: string;
  /** Clicking the overlay closes. Turn off for destructive confirmations. */
  closeOnBackdrop?: boolean;
  /** data-testid for the overlay, for suites that target the backdrop. */
  overlayTestId?: string;
  /** data-testid for the dialog panel. */
  panelTestId?: string;
  /** Focus this on open instead of the first focusable (e.g. a primary CTA). */
  initialFocusRef?: { current: HTMLElement | null };
}

const DEFAULT_OVERLAY =
  "fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50";

/**
 * The shared shell every overlay in the app should sit inside.
 *
 * Owns the five things that were missing or inconsistent across all 15 of this
 * app's overlays, and that are easy to forget one at a time:
 *
 * 1. **Portal to `document.body`.** Non-negotiable, not cosmetic. A
 *    `backdrop-filter` / `filter` / `transform` / `contain: paint` ancestor
 *    becomes the containing block for `position: fixed` descendants *and*
 *    creates a stacking context `z-index` cannot escape. `Header` carries
 *    `backdrop-blur-xl`, and that clamped the nav drawer to a 64px sliver in
 *    an 844px viewport before it was portalled out.
 * 2. **Focus trap** — focus in on open, Tab/Shift+Tab cycling, focus restored
 *    to the opener on close.
 * 3. **Escape to close** (via the same hook).
 * 4. **Body scroll lock**, so `aria-modal` is not a lie.
 * 5. **`role="dialog"` + `aria-modal` + an accessible name.**
 *
 * Panel visuals stay with the caller — this owns behaviour, not looks.
 */
export default function ModalShell({
  isOpen,
  onClose,
  children,
  labelledBy,
  label,
  describedBy,
  panelClassName = "",
  overlayClassName = DEFAULT_OVERLAY,
  closeOnBackdrop = true,
  overlayTestId,
  panelTestId,
  initialFocusRef,
}: ModalShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isOpen, panelRef, onClose, initialFocusRef);
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={overlayClassName}
      data-testid={overlayTestId}
      // mousedown, not click: a drag that starts inside the panel and releases
      // over the overlay should not count as a click-outside.
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={panelClassName}
        data-testid={panelTestId}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
