import { toast } from 'react-hot-toast';

/**
 * The editor has no history stack and no Ctrl+Z. This 5-second
 * "<thing> removed · Undo" toast is the whole of undo, so it is called from the
 * two places deletes actually happen — `useSectionManagement` (sections and
 * entries) and `ExperienceItem.handleDescRemove` (bullets) — never from the
 * individual delete buttons. A new sibling caller that routes through either of
 * those gets undo for free.
 *
 * Accessibility: react-hot-toast's default renderer spreads `ariaProps`
 * (`role="status"`, `aria-live="polite"`) onto the message container, so the
 * copy is announced. The Undo control is a real `<button>` in the document, so
 * it is tab-reachable; it is deliberately NOT auto-focused, because stealing
 * focus out of a text field mid-sentence is worse than the mis-tap it fixes.
 *
 * ponytail: each caller passes the restore closure it already holds — no
 * snapshotting, no command objects. Multi-step undo is the upgrade path if
 * anyone ever asks for it.
 */
export const UNDO_TOAST_MS = 5000;

export function toastUndo(message: string, onUndo: () => void): string {
  return toast(
    (t) => (
      <span className="flex items-center gap-3">
        <span>{message}</span>
        <button
          type="button"
          onClick={() => {
            onUndo();
            toast.dismiss(t.id);
          }}
          aria-label={`Undo: ${message}`}
          className="-my-2 inline-flex min-h-11 flex-shrink-0 items-center rounded-lg border border-white/30 px-3 font-semibold text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Undo
        </button>
      </span>
    ),
    { duration: UNDO_TOAST_MS }
  );
}
