/**
 * Shared bits for the PDF build wait.
 *
 * The download is this product's conversion event, and it is a real
 * multi-second server round-trip. Rather than a spinner over the word
 * "Generating...", the button says what the workshop is actually doing right
 * now — a value set only at true boundaries in `useEditorActions`, never on a
 * timer, so the label never claims work that isn't happening.
 */

interface PhaseLabelProps {
  /** Current phase text, or null when idle */
  phase: string | null | undefined;
  /** Shown when there is no phase yet (e.g. a resumed in-flight download) */
  fallback: string;
  className?: string;
}

/**
 * The phase text, crossfading into place each time it changes. Keyed on the
 * text so React remounts the inner span and the entrance replays.
 */
export const PhaseLabel: React.FC<PhaseLabelProps> = ({
  phase,
  fallback,
  className = "",
}) => (
  <span className={className} aria-live="polite">
    <span key={phase ?? "idle"} className="phase-in inline-block">
      {phase ?? fallback}
    </span>
  </span>
);

/**
 * A hairline that sweeps while the build runs. Deliberately indeterminate — we
 * cannot see inside the server render, so nothing here implies a percentage.
 * Hidden outright under reduced motion; the label carries the state on its own.
 */
export const WorkingRail: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <span
    className={`phase-rail block overflow-clip rounded-full bg-ink/15 ${className}`}
    aria-hidden="true"
  >
    <span className="phase-sweep block h-full w-1/3 rounded-full bg-ink/50" />
  </span>
);
