## 2024-05-24 - [Destructive Action Consistency]
**Learning:** Using unicode characters (✕) for destructive actions lacks semantic meaning and accessibility compared to standard icons (TrashIcon), especially when other parts of the UI use icons.
**Action:** Always replace unicode "icons" with proper SVG icons from the design system, ensuring `aria-label` and `type="button"` are present.
