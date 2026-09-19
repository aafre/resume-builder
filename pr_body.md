💡 What: Added `autoFocus={isDestructive}` to the 'Cancel' button in `ResponsiveConfirmDialog`.
🎯 Why: In destructive confirmation dialogs (e.g., deleting a resume or starting fresh), it prevents users from accidentally triggering the destructive action by pressing 'Enter' immediately after the dialog mounts. By defaulting focus to the safe 'Cancel' action, we adhere to UX accessibility patterns for destructive prompts.
📸 Before/After: Focus previously fell to the first focusable element (or body); it now correctly defaults to 'Cancel' on destructive prompts.
♿ Accessibility: Enhances keyboard navigation by prioritizing safety in destructive confirmations, preventing accidental data loss.
