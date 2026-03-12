1. **Target Component:** `resume-builder-ui/src/components/SectionControls.tsx`
2. **Current State:** The component has three buttons: "Up" (↑), "Down" (↓), and "Delete" (🗑) using emojis without accessible names or proper focus styles.
3. **UX Improvement:**
   - Add proper `aria-label` to each button for screen reader support (e.g., "Move section up", "Move section down", "Delete section").
   - Replace emojis with SVG icons using `react-icons/md` (`MdArrowUpward`, `MdArrowDownward`, `MdDelete`) for a more consistent and professional look.
   - Add `title` attributes for tooltips on hover.
   - Improve hover, focus, and disabled states with more descriptive tailwind classes.
4. **Pre-commit Step:** Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
