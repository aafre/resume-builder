# Palette's UX Journal

This journal documents critical UX and accessibility learnings.

## 2025-05-23 - [Destructive Action Safety]
**Learning:** Users often click "Delete" accidentally on list items when controls are close together. Icon-only buttons without clear labels or confirmation steps are a major accessibility and usability risk.
**Action:** Always wrap destructive actions in a confirmation dialog (like `ResponsiveConfirmDialog`) and ensure all icon-only buttons have explicit `aria-label` and `title` attributes for clarity and screen reader support.
