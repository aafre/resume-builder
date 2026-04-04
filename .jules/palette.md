## 2024-04-05 - File Input Accessibility
**Learning:** Using `display: none` or Tailwind's `hidden` on custom `<input type="file">` elements removes them from the keyboard tab order and screen readers, making file uploads inaccessible.
**Action:** Always use `sr-only peer` on the `<input type="file">` element (ensuring it is placed *before* its visual wrapper/label in the DOM) and apply `peer-focus-visible` styling (like `peer-focus-visible:ring-2 peer-focus-visible:ring-accent`) on the subsequent sibling element to maintain keyboard accessibility and visual focus states.
