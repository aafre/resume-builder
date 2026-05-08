## 2025-02-14 - Standardized modal close interactions
**Learning:** Custom interactive components like `ResponsiveConfirmDialog` require explicit keyboard accessibility patterns (e.g., `role="button"`, `tabIndex={0}`, `onKeyDown` supporting Enter/Space) because they lack the semantic behavior of native `<button>` elements, which often leads to poor screen reader and keyboard navigation experiences.
**Action:** When implementing custom interactive UI elements that function as buttons but use non-button HTML tags (like `<div>` or `<span>`), always ensure full keyboard accessibility by explicitly adding ARIA roles, focus outlines, and appropriate keyboard event handlers.

## 2024-05-08 - Added accessible close controls to modals
**Learning:** Modal close buttons implemented with icon-only components (e.g., `MdClose`, `XMarkIcon`) often lack implicit accessible names and visible keyboard focus outlines, leading to poor keyboard navigation and screen reader experiences.
**Action:** Always add explicit `aria-label` attributes and Tailwind `focus-visible` ring utilities (e.g., `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`) to custom modal close controls.
