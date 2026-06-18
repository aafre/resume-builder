## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - Modal Keyboard Accessibility and Escape Key
**Learning:** Custom modals like `AuthModal.tsx` initially lacked basic modal behavior traits, such as listening for the `Escape` key and standard ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`). Additionally, the `MdClose` icon buttons in such modals frequently missed keyboard focus styles.
**Action:** When implementing or updating custom modals, always attach a `keydown` event listener via `useEffect` to handle the `Escape` key for closure. Add `role="dialog"`, `aria-modal="true"`, and link titles using `aria-labelledby`. Ensure all icon-only action buttons use `focus:outline-none focus-visible:ring-2` to provide clear feedback to keyboard users.
