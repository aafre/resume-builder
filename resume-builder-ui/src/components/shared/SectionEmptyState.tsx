import React from 'react';
import { MdAdd } from 'react-icons/md';

export interface SectionEmptyStateProps {
  /** What is missing, stated plainly. "No roles yet." */
  headline: string;
  /** What belongs here and what good looks like — one or two sentences. */
  hint: string;
  /** Label for the add control. Matches the section's normal add button. */
  addLabel: string;
  onAdd: () => void;
}

/**
 * The empty state for a resume section.
 *
 * An empty section used to render as a blank card, which teaches a first-resume
 * writer nothing. This says what belongs in the section and what a good entry
 * looks like, then offers the one action available. It replaces the section's
 * normal add button while empty rather than sitting above it, so there is never
 * more than one "add" on screen.
 *
 * `.btn-ghost-add` is the documented "there could be more here" control; do not
 * open-code another dashed button here.
 */
export const SectionEmptyState: React.FC<SectionEmptyStateProps> = ({
  headline,
  hint,
  addLabel,
  onAdd,
}) => (
  <div className="rounded-xl bg-chalk-dark p-5 text-center">
    <p className="text-sm font-semibold text-ink">{headline}</p>
    <p className="mx-auto mt-1 max-w-prose text-sm text-ink/60">{hint}</p>
    <button type="button" onClick={onAdd} className="btn-ghost-add mt-4">
      <MdAdd className="text-lg" aria-hidden="true" />
      <span>{addLabel}</span>
    </button>
  </div>
);

export default SectionEmptyState;
