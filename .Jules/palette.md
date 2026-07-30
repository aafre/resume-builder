## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.
## 2025-02-14 - Accessible Destruction Confirmations
**Learning:** Destructive actions (like deleting entire sections in `SectionControls`) lacked accessible confirmations. `ResponsiveConfirmDialog` is our standard for this, preventing accidental data loss and providing a mobile-friendly bottom sheet pattern.
**Action:** Always implement `ResponsiveConfirmDialog` (or similar standard accessible dialogs) for destructive actions rather than immediate unconfirmed execution, ensuring users are warned effectively.
