## 2024-05-23 - Accessibility Pattern: Custom Modals
**Learning:** Custom modal implementations (like `DeleteResumeModal`) often lack standard accessibility features (ARIA roles, focus trapping, Escape key handling) which are present in the shared `ResponsiveConfirmDialog`.
**Action:** When working on modals, check if `ResponsiveConfirmDialog` can be used. If not, ensure manual implementation includes `role="dialog"`, `aria-modal="true"`, focus management, and Escape key listener.
