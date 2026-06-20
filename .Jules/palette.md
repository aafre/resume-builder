## 2025-02-14 - ResponsiveConfirmDialog for Destructive Actions
**Learning:** Destructive actions (like Delete) implemented with custom hardcoded modals lack standard accessibility attributes (`role="dialog"`, `aria-modal`, etc.) and mobile responsiveness (like bottom sheets). This app has a `ResponsiveConfirmDialog` component designed specifically for this purpose, but it was not being utilized uniformly.
**Action:** Always use `ResponsiveConfirmDialog` for destructive confirmation prompts (such as `DeleteResumeModal`) to ensure a consistent, accessible, and mobile-friendly UX that prevents accidental data loss.

## 2025-02-14 - Button type and Screen Reader Hiding
**Learning:** React buttons inside forms will default to `type="submit"`, causing unintended form submissions and page reloads when clicked. Also, raw emoji or text characters used as icons (like ✕ or ✅) are read aloud by screen readers confusingly (e.g., "heavy check mark" or "multiplication x"), even if the button has an `aria-label`.
**Action:** Always explicitly set `type="button"` on interactive controls that do not submit forms. Wrap decorative text characters/emojis acting as icons inside `<span aria-hidden="true">` to hide them from screen readers while relying on `aria-label` or `title` for the accessible name.
