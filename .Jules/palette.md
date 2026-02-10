## 2025-02-17 - Legacy Unicode Buttons
**Learning:** Many legacy components (like SectionControls) use raw unicode characters (e.g., ↑, ↓, 🗑) for interactive elements, which poses accessibility and consistency issues.
**Action:** systematically replace these with `lucide-react` icons and ensure explicit `aria-label` attributes are added.
