
## 2024-10-24 - Sub-item Visual Hierarchy & Keyboard Focus
**Learning:** Using heavy accent buttons for inline sub-item additions breaks visual hierarchy and creates a noisy interface. Additionally, custom padded inline icon buttons often lose browser default focus rings.
**Action:** Always use the `GhostButton` pattern for adding repeatable sub-items to maintain a "Quiet by Default" interface, and explicitly apply `focus-visible:ring-2 focus-visible:ring-offset-1` with appropriate contextual colors (e.g., `ring-red-500` for destructive actions) to icon-only buttons.
