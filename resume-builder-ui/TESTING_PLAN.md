# Manual Testing Plan: Drag-and-Drop & Section Positioning

## Phase 1: UX Bug Fix (Item Drag-and-Drop)

### Test 1.1: Item Dragging No Longer Jumps
**Precondition**: Have a resume with at least 3 education or experience items

1. Navigate to the Editor page with an existing resume
2. Find a section with multiple items (Education, Experience, or bulleted list)
3. Hover over an item to reveal the drag handle (6-dot grip icon on the left)
4. Click and hold the drag handle
5. Move the cursor slightly (8-10 pixels)
6. **Expected**: Item should smoothly follow cursor without jumping to bottom
7. Continue dragging up or down
8. **Expected**: Other items should smoothly reorder as you drag
9. Release the item at a new position
10. **Expected**: Item stays at new position, no toast notification (item-level)

### Test 1.2: Drag Activation Distance
**Purpose**: Verify 8px activation distance prevents accidental drags

1. Click and hold an item's drag handle
2. Move cursor less than 8 pixels
3. **Expected**: Drag should NOT start
4. Move cursor more than 8 pixels
5. **Expected**: Drag should start smoothly

### Test 1.3: Touch Device Behavior (Mobile)
**Precondition**: Use mobile device or browser dev tools mobile emulation

1. Tap and hold an item's drag handle for 200ms
2. **Expected**: Drag should activate after delay
3. Drag to reorder
4. **Expected**: Smooth reordering without scroll conflicts

---

## Phase 2: Section Position Selection

### Test 2.1: Add Section at Top
1. Open the Editor with existing sections
2. Click "Add Section" button
3. **Expected**: Modal shows position selector dropdown
4. Verify default selection is "At the top (first section)"
5. Select a section type (e.g., "Text Section")
6. **Expected**: New section appears at the TOP of the section list
7. Verify existing sections shifted down

### Test 2.2: Add Section at Bottom
1. Click "Add Section" button
2. Change position to "At the bottom (last section)"
3. Select a section type
4. **Expected**: New section appears at the BOTTOM of the section list

### Test 2.3: Add Section After Specific Section
1. Have at least 3 sections in the editor
2. Click "Add Section" button
3. Open position dropdown
4. **Expected**: See "After specific section" optgroup with all current sections
5. Select "After: [Section Name]"
6. Select a section type
7. **Expected**: New section appears immediately after the selected section

### Test 2.4: Empty Resume (No Sections)
1. Start with empty resume (no sections)
2. Click "Add Section"
3. **Expected**: Position dropdown shows only "At the top" and "At the bottom"
4. Add a section
5. **Expected**: Section is added successfully

---

## Phase 3: Description Point Reordering (Atomic Level)

### Test 3.1: Reorder Description Points in Experience
1. Create or open an Experience section with multiple description points
2. Hover over a description point to reveal drag handle
3. Drag the description point to a new position
4. **Expected**: Description points reorder smoothly
5. Save/export the resume
6. **Expected**: New order is persisted

### Test 3.2: Add New Description and Reorder
1. Add 3-4 description points to an experience
2. Reorder them using drag-and-drop
3. Add another description point
4. Reorder all including the new one
5. **Expected**: All operations work correctly

### Test 3.3: Single Description Point
1. Have an experience with only 1 description point
2. Attempt to drag it
3. **Expected**: Drag should work but no reorder possible (only 1 item)

### Test 3.4: Delete and Reorder
1. Have 4+ description points
2. Delete one description
3. **Expected**: Remaining descriptions maintain proper order
4. Reorder remaining descriptions
5. **Expected**: Reordering still works correctly

---

## Cross-Cutting Tests

### Test C.1: Section-Level Drag Still Works
1. Drag a section using its drag handle
2. **Expected**: Sections reorder correctly
3. **Expected**: Toast notification shows "Section reordered successfully!"

### Test C.2: Nested Drag Contexts Don't Conflict
1. Start dragging a description point within an experience
2. **Expected**: Should NOT trigger section-level drag
3. Start dragging an experience item
4. **Expected**: Should NOT trigger description-level drag

### Test C.3: Keyboard Accessibility
1. Tab to a drag handle
2. Press Space/Enter to activate
3. Use arrow keys to reorder
4. Press Space/Enter to confirm
5. **Expected**: Keyboard navigation works for all drag contexts

### Test C.4: Undo/Redo (if implemented)
1. Reorder items
2. Trigger undo (Ctrl+Z)
3. **Expected**: Order reverts to previous state

---

## Browser Compatibility
Test the above scenarios in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)
