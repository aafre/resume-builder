## 2024-05-22 - Unicode Button Pattern
**Learning:** Found a pattern of using unicode characters (↑, ↓, 🗑) for buttons without `aria-label` or `title` attributes. This makes controls invisible to screen readers and confusing for users who might not understand the icon's meaning without a tooltip.
**Action:** When auditing components, look for unicode strings in JSX and replace them with semantic icons (lucide-react) wrapped in buttons with explicit `aria-label` and `title` attributes.
