# My Resumes Page Improvements - Testing Plan

## Overview
Testing plan for the comprehensive "My Resumes" page improvements including:
- **Auto-Naming Logic**: Smart title generation from resume content
- **Thumbnail Generation**: PDF-to-PNG conversion (piggyback strategy)
- **UI Cleanup**: Removed icon count, added template badge overlay
- **Duplicate Feature**: Modal-based resume duplication with custom title
- **Rename Feature**: Click-to-rename with auto-save on blur

## Prerequisites

### Environment Setup
- [ ] Backend Docker container rebuilt with new dependencies:
  ```bash
  docker build -t resume-api -f Dockerfile.dev.api .
  docker-compose up -d
  ```
- [ ] Frontend dependencies installed:
  ```bash
  cd resume-builder-ui
  npm install  # lucide-react should be installed
  ```
- [ ] `.env` file contains Supabase credentials

### Database Migration
- [ ] Execute SQL migration in Supabase SQL Editor:
  ```sql
  ALTER TABLE resumes
  ADD COLUMN thumbnail_url TEXT NULL;
  ```
- [ ] Verify column exists:
  ```sql
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_name = 'resumes' AND column_name = 'thumbnail_url';
  ```

### Supabase Storage Setup
- [ ] Create new storage bucket: `resume-thumbnails`
- [ ] Set bucket as **public**
- [ ] Verify bucket policies allow:
  - Authenticated users: INSERT, SELECT, UPDATE, DELETE on their own files
  - Public: SELECT (read-only)

### Verify Dependencies
- [ ] Backend: `pip list | grep -E "pdf2image|Pillow"`
  - Expected: pdf2image and Pillow installed
- [ ] Backend Docker: `docker exec resume-api which pdftoppm`
  - Expected: `/usr/bin/pdftoppm` (from poppler-utils)
- [ ] Frontend: `cd resume-builder-ui && npm list lucide-react`
  - Expected: lucide-react@^0.x.x

---

## Phase 1: Backend API Testing

### Test 1.1: Auto-Naming Logic in Save Endpoint
**Purpose:** Verify smart title generation when saving resumes

**Steps:**

1. **Test Priority 1: Job Title from Experience**
   ```bash
   curl -X POST http://localhost:5000/api/resumes \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "id": null,
       "template_id": "modern-with-icons",
       "contact_info": {
         "name": "John Smith",
         "email": "john@test.com",
         "phone": "+1234567890",
         "location": "New York, NY"
       },
       "sections": [
         {
           "name": "Experience",
           "type": "experience",
           "content": [
             {
               "company": "Google",
               "title": "Senior Product Manager",
               "dates": "2020-2023",
               "description": ["Led product team"]
             }
           ]
         }
       ],
       "icons": []
     }'
   ```
   **Expected:** Response includes resume with `title: "Senior Product Manager"`

2. **Test Priority 2: Name + Template**
   ```bash
   # Same request but with no experience section
   curl -X POST http://localhost:5000/api/resumes \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "id": null,
       "template_id": "modern-with-icons",
       "contact_info": {
         "name": "Jane Doe",
         "email": "jane@test.com",
         "phone": "+1234567890",
         "location": "Boston, MA"
       },
       "sections": [],
       "icons": []
     }'
   ```
   **Expected:** Response includes `title: "Jane Doe - Modern With Icons"`

3. **Test Priority 3: Date Fallback**
   ```bash
   # Same request but with no name and no experience
   curl -X POST http://localhost:5000/api/resumes \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "id": null,
       "template_id": "modern-no-icons",
       "contact_info": {
         "name": "",
         "email": "test@test.com",
         "phone": "+1234567890",
         "location": "City, State"
       },
       "sections": [],
       "icons": []
     }'
   ```
   **Expected:** Response includes `title: "Resume - Dec 2025"` (current month/year)

**Pass Criteria:**
- ✅ Priority 1 works (job title extracted correctly)
- ✅ Priority 2 works (name + formatted template name)
- ✅ Priority 3 works (fallback to date)
- ✅ Template name formatted correctly (spaces, title case)

---

### Test 1.2: Thumbnail Generation Function
**Purpose:** Verify PDF-to-PNG conversion and Supabase upload

**Setup:**
1. Create a test resume with PDF generation
2. Generate PDF via `POST /api/resumes/:id/pdf`

**Steps:**

1. **Generate PDF and trigger thumbnail creation:**
   ```bash
   curl -X POST "http://localhost:5000/api/resumes/RESUME_ID/pdf" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     --output test-resume.pdf
   ```

2. **Check backend logs for thumbnail generation:**
   - Expected log: `"Converting PDF to thumbnail: /path/to/pdf"`
   - Expected log: `"Uploading thumbnail to storage: {user_id}/{resume_id}/thumbnail.png"`
   - Expected log: `"Successfully generated and uploaded thumbnail"`

3. **Verify in Supabase Dashboard:**
   - Navigate to Storage → `resume-thumbnails` bucket
   - Check for file: `{user_id}/{resume_id}/thumbnail.png`
   - File should be ~30-100KB (depending on resume complexity)
   - Download and verify it's a PNG image (400px width)

4. **Verify in Database:**
   ```sql
   SELECT id, title, thumbnail_url, pdf_generated_at
   FROM resumes
   WHERE id = 'RESUME_ID';
   ```
   - Expected: `thumbnail_url` populated with public URL
   - Expected: `pdf_generated_at` updated to current timestamp

5. **Test thumbnail URL accessibility:**
   ```bash
   curl -I "THUMBNAIL_URL_FROM_DATABASE"
   ```
   - Expected: HTTP 200 OK
   - Expected: `Content-Type: image/png`

**Pass Criteria:**
- ✅ PDF generation succeeds
- ✅ Thumbnail generated (400px width PNG)
- ✅ Uploaded to Supabase Storage
- ✅ Public URL returned and accessible
- ✅ Database updated with thumbnail_url
- ✅ Generation adds ~200-500ms to PDF process (acceptable overhead)

---

### Test 1.3: Thumbnail Failure Handling
**Purpose:** Verify graceful degradation when thumbnail fails

**Steps:**

1. **Simulate thumbnail failure** (manually disable pdf2image):
   ```bash
   # SSH into Docker container
   docker exec -it resume-api bash
   # Temporarily rename poppler binary
   mv /usr/bin/pdftoppm /usr/bin/pdftoppm.bak
   ```

2. **Generate PDF:**
   ```bash
   curl -X POST "http://localhost:5000/api/resumes/RESUME_ID/pdf" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     --output test-resume.pdf
   ```

3. **Check backend logs:**
   - Expected warning: `"Thumbnail generation failed for resume {resume_id}, but continuing with PDF"`
   - Expected: PDF still downloads successfully

4. **Verify database:**
   ```sql
   SELECT thumbnail_url FROM resumes WHERE id = 'RESUME_ID';
   ```
   - Expected: `thumbnail_url` is NULL (not updated)

5. **Restore poppler:**
   ```bash
   mv /usr/bin/pdftoppm.bak /usr/bin/pdftoppm
   exit
   ```

**Pass Criteria:**
- ✅ PDF generation does NOT fail when thumbnail fails
- ✅ Warning logged but no error thrown
- ✅ thumbnail_url remains NULL
- ✅ User can still download PDF

---

### Test 1.4: Duplicate Resume Endpoint (POST /api/resumes/:id/duplicate)
**Purpose:** Verify resume duplication with new title

**Steps:**

1. **Create source resume with icons:**
   ```bash
   curl -X POST http://localhost:5000/api/resumes \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "id": null,
       "template_id": "modern-with-icons",
       "contact_info": {"name": "Source Resume", "email": "test@test.com", "phone": "", "location": ""},
       "sections": [{"name": "Summary", "type": "text", "content": "Test summary"}],
       "icons": [
         {
           "filename": "google.png",
           "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
         }
       ]
     }'
   ```
   Note the returned `resume_id` (let's call it SOURCE_ID)

2. **Duplicate the resume:**
   ```bash
   curl -X POST "http://localhost:5000/api/resumes/SOURCE_ID/duplicate" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"new_title": "Copy of Source Resume"}'
   ```

   **Expected:** 200 OK with `{"success": true, "resume_id": "NEW_UUID", "message": "Resume duplicated successfully"}`

3. **Verify in database:**
   ```sql
   -- Check new resume exists
   SELECT id, title, template_id, contact_info, sections
   FROM resumes
   WHERE title = 'Copy of Source Resume';

   -- Verify independent copy (different ID)
   SELECT COUNT(*) FROM resumes WHERE id IN ('SOURCE_ID', 'NEW_UUID');
   -- Expected: 2 rows
   ```

4. **Verify icons copied:**
   ```sql
   -- Check source resume icons
   SELECT resume_id, filename, storage_path
   FROM resume_icons
   WHERE resume_id = 'SOURCE_ID';

   -- Check duplicated resume icons
   SELECT resume_id, filename, storage_path
   FROM resume_icons
   WHERE resume_id = 'NEW_UUID';
   ```

   **Expected:**
   - Both have 1 icon record
   - `filename` matches: "google.png"
   - `storage_path` different: `{user_id}/SOURCE_ID/google.png` vs `{user_id}/NEW_UUID/google.png`

5. **Verify icon files in storage:**
   - Navigate to Supabase Storage → `resume-icons` bucket
   - Check both paths exist and contain identical image data

**Pass Criteria:**
- ✅ Returns 200 with new resume_id
- ✅ New resume created with different UUID
- ✅ All data copied (contact_info, sections)
- ✅ Title set to provided new_title
- ✅ Icons copied to new storage paths
- ✅ resume_icons records created for duplicate
- ✅ Source resume unchanged

---

### Test 1.5: Duplicate at Limit
**Purpose:** Verify 5-resume limit enforced on duplicate

**Steps:**

1. **Create 5 resumes** (if not already at limit)

2. **Try to duplicate:**
   ```bash
   curl -X POST "http://localhost:5000/api/resumes/EXISTING_RESUME_ID/duplicate" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"new_title": "This Should Fail"}'
   ```

3. **Expected:** 400 Bad Request
   ```json
   {
     "success": false,
     "error": "You have reached the maximum limit of 5 resumes",
     "error_code": "RESUME_LIMIT_REACHED"
   }
   ```

4. **Verify in database:**
   ```sql
   SELECT COUNT(*) FROM resumes WHERE user_id = 'USER_ID' AND deleted_at IS NULL;
   ```
   **Expected:** Still 5 resumes (no duplicate created)

**Pass Criteria:**
- ✅ Returns 400 with RESUME_LIMIT_REACHED error code
- ✅ No duplicate created
- ✅ User can identify the error clearly

---

### Test 1.6: Rename Endpoint (PATCH /api/resumes/:id)
**Purpose:** Verify partial update (title only)

**Steps:**

1. **Rename a resume:**
   ```bash
   curl -X PATCH "http://localhost:5000/api/resumes/RESUME_ID" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"title": "My New Resume Title"}'
   ```

2. **Expected:** 200 OK
   ```json
   {
     "success": true,
     "title": "My New Resume Title"
   }
   ```

3. **Verify in database:**
   ```sql
   SELECT id, title, updated_at
   FROM resumes
   WHERE id = 'RESUME_ID';
   ```
   **Expected:**
   - `title` = "My New Resume Title"
   - `updated_at` updated to current timestamp

4. **Test validation - empty title:**
   ```bash
   curl -X PATCH "http://localhost:5000/api/resumes/RESUME_ID" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"title": ""}'
   ```
   **Expected:** 400 Bad Request with error "Title cannot be empty"

5. **Test validation - title too long:**
   ```bash
   curl -X PATCH "http://localhost:5000/api/resumes/RESUME_ID" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"title": "'$(python -c 'print("A"*201)')"}'
   ```
   **Expected:** 400 Bad Request with error "Title too long (max 200 characters)"

6. **Test unauthorized access:**
   ```bash
   # Sign in as different user (User B)
   curl -X PATCH "http://localhost:5000/api/resumes/USER_A_RESUME_ID" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer USER_B_TOKEN" \
     -d '{"title": "Hacked Title"}'
   ```
   **Expected:** 404 Not Found (RLS prevents access)

**Pass Criteria:**
- ✅ Returns 200 with new title
- ✅ Database updated
- ✅ updated_at timestamp refreshed
- ✅ Empty title rejected
- ✅ Too long title rejected (> 200 chars)
- ✅ Cross-user access blocked

---

### Test 1.7: GET Endpoints Return thumbnail_url
**Purpose:** Verify thumbnail_url included in responses

**Steps:**

1. **Generate PDF with thumbnail** (from Test 1.2)

2. **List resumes:**
   ```bash
   curl -X GET "http://localhost:5000/api/resumes" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

   **Expected response structure:**
   ```json
   {
     "success": true,
     "resumes": [
       {
         "id": "uuid",
         "title": "Senior Product Manager",
         "template_id": "modern-with-icons",
         "thumbnail_url": "https://your-project.supabase.co/storage/v1/object/public/resume-thumbnails/...",
         "created_at": "...",
         "updated_at": "...",
         "icon_count": 1
       }
     ],
     "total_count": 1
   }
   ```

3. **Get specific resume:**
   ```bash
   curl -X GET "http://localhost:5000/api/resumes/RESUME_ID" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

   **Expected:** Response includes `thumbnail_url` field

**Pass Criteria:**
- ✅ thumbnail_url returned in list endpoint
- ✅ thumbnail_url returned in get endpoint
- ✅ URL is accessible (public)
- ✅ NULL thumbnail_url handled gracefully (for resumes without PDF generated yet)

---

## Phase 2: Frontend Testing

### Test 2.1: Auto-Naming in Editor
**Purpose:** Verify smart title generation when saving from editor

**Steps:**

1. **Create new resume from template:**
   - Navigate to `/templates`
   - Select "Modern with Icons"
   - Click "Start Editing"

2. **Fill in contact info:**
   - Name: "Alice Johnson"
   - Email: "alice@example.com"
   - Phone: "+1234567890"
   - Location: "San Francisco, CA"

3. **Add Experience section:**
   - Company: "Microsoft"
   - Title: "Lead Software Engineer"
   - Dates: "2021-Present"
   - Description: "Leading backend team"

4. **Wait for auto-save** (5 seconds)

5. **Navigate to My Resumes page**

6. **Expected:**
   - Resume card displays title: **"Lead Software Engineer"** (not "Untitled Resume")

7. **Test Priority 2 - Create resume without experience:**
   - Create new resume
   - Only fill Name: "Bob Smith"
   - Select template: "Classic Alex Rivera"
   - Wait for auto-save
   - Navigate to My Resumes

8. **Expected:**
   - Resume title: **"Bob Smith - Classic Alex Rivera"**

9. **Test Priority 3 - Create resume with no name:**
   - Create new resume
   - Leave name empty
   - Template: "Modern No Icons"
   - Wait for auto-save
   - Navigate to My Resumes

10. **Expected:**
    - Resume title: **"Resume - Dec 2025"** (current month/year)

**Pass Criteria:**
- ✅ Job title auto-naming works (Priority 1)
- ✅ Name + Template auto-naming works (Priority 2)
- ✅ Date fallback works (Priority 3)
- ✅ No "Untitled Resume" appears in My Resumes list
- ✅ Save indicator shows "Saved" after auto-save

---

### Test 2.2: Thumbnail Display in My Resumes
**Purpose:** Verify thumbnails appear instead of static previews

**Steps:**

1. **Create resume and generate PDF:**
   - Navigate to editor
   - Create/edit resume
   - Click "Download" or "Preview" button to trigger PDF generation

2. **Wait for PDF generation to complete**
   - Watch for success toast notification

3. **Navigate to My Resumes page**

4. **Expected:**
   - Resume card shows **actual thumbnail** of the PDF (not generic template image)
   - Thumbnail displays first page of resume
   - Thumbnail is crisp and readable (400px width)

5. **Hover over card:**
   - Thumbnail should remain visible
   - Preview/Download buttons overlay on top

6. **Test fallback behavior - New resume without PDF:**
   - Create new resume (don't generate PDF)
   - Navigate to My Resumes

7. **Expected:**
   - Card shows **static template preview** (fallback)
   - No broken image or missing thumbnail

**Pass Criteria:**
- ✅ Thumbnails display when available
- ✅ Fallback to template preview when thumbnail not generated
- ✅ No broken images
- ✅ Thumbnails load quickly (cached by browser)
- ✅ High quality rendering (no blurriness)

---

### Test 2.3: Template Badge Display
**Purpose:** Verify template badge overlay

**Steps:**

1. **Navigate to My Resumes page with multiple resumes**
   - Ensure you have resumes with different templates

2. **Inspect each resume card:**
   - Modern With Icons → Badge: "Modern With Icons"
   - Modern No Icons → Badge: "Modern No Icons"
   - Classic Alex Rivera → Badge: "Classic Alex Rivera"
   - Classic Jane Doe → Badge: "Classic Jane Doe"

3. **Check badge styling:**
   - Position: Top-right corner of thumbnail
   - Background: Black with 60% opacity + backdrop blur
   - Text: White, small (text-xs)
   - Padding: Compact (px-2 py-1)

4. **Verify badge doesn't interfere with thumbnail:**
   - Badge should be readable
   - Doesn't cover important parts of resume preview
   - Doesn't disappear on hover

**Pass Criteria:**
- ✅ Badge displays on all cards
- ✅ Template name formatted correctly (title case, spaces)
- ✅ Badge positioned correctly (top-right)
- ✅ Readable against any thumbnail background
- ✅ Consistent styling across all cards

---

### Test 2.4: UI Cleanup - Icon Count Removed
**Purpose:** Verify icon count no longer displayed

**Steps:**

1. **Navigate to My Resumes page**

2. **Inspect resume cards:**
   - Check for any text mentioning "icons"
   - Look for icon SVG with count

3. **Expected:**
   - **No "0 icons" or "3 icons" text anywhere on card**
   - Cleaner metadata section (only "Updated X ago")

4. **Compare with old design** (if screenshots available):
   - Old: Had icon count with SVG icon
   - New: Removed completely

**Pass Criteria:**
- ✅ Icon count text removed from all cards
- ✅ Icon count SVG removed
- ✅ Metadata section simplified
- ✅ No visual clutter from removed element

---

### Test 2.5: Duplicate Feature - UI Flow
**Purpose:** Verify duplicate modal and functionality

**Steps:**

1. **Navigate to My Resumes page**

2. **Hover over resume card:**
   - Locate "Duplicate" icon button (Copy icon from lucide-react)

3. **Click Duplicate button:**
   - **Expected:** Modal appears with title "Duplicate Resume"
   - Modal shows input pre-filled: "Copy of [Original Title]"
   - Original resume title displayed below input
   - "Duplicate" and "Cancel" buttons visible

4. **Test modal interactions:**
   - Edit title to "My Google Resume"
   - Click "Duplicate" button
   - **Expected:**
     - Button shows "Duplicating..." (disabled)
     - Modal stays open during operation
     - Success toast: "Resume duplicated successfully"
     - Modal closes
     - Page refreshes resume list
     - **New card appears** with title "My Google Resume"

5. **Verify duplicate:**
   - New card has same template badge as original
   - New card shows same thumbnail (or fallback if no thumbnail yet)
   - Original card unchanged
   - Resume count increases (e.g., "4/5 resumes saved")

6. **Test Cancel button:**
   - Click Duplicate on another resume
   - Click "Cancel" in modal
   - **Expected:** Modal closes, no duplicate created

7. **Test duplicate at limit:**
   - Create resumes until you have 5
   - Try to duplicate
   - **Expected:**
     - Error toast: "You have reached the 5 resume limit. Delete a resume to continue."
     - No modal appears (or modal closes with error)
     - No duplicate created

8. **Test empty title validation:**
   - Click Duplicate
   - Clear the title input completely
   - **Expected:** "Duplicate" button disabled (can't submit empty title)

**Pass Criteria:**
- ✅ Duplicate button visible (Copy icon)
- ✅ Modal opens with pre-filled title
- ✅ Can edit title before duplicating
- ✅ Duplicate creates independent copy
- ✅ Success notification shown
- ✅ Resume list refreshes automatically
- ✅ Cancel works without creating duplicate
- ✅ Limit enforced (error toast shown)
- ✅ Empty title prevented

---

### Test 2.6: Click-to-Rename Feature
**Purpose:** Verify inline title editing with auto-save

**Steps:**

1. **Navigate to My Resumes page**

2. **Locate resume title on card** (default: auto-generated title)

3. **Click on the title:**
   - **Expected:**
     - Title transforms into editable input field
     - Input has blue border (border-blue-500)
     - Text auto-selected (ready to edit)
     - Cursor appears in input

4. **Edit the title:**
   - Type new title: "My Updated Resume"
   - Press Enter key

5. **Expected:**
   - Input reverts to plain text
   - Title shows: "My Updated Resume"
   - Success toast: "Resume renamed"
   - Save happens immediately (no 5-second delay)

6. **Verify persistence:**
   - Refresh page (F5)
   - **Expected:** Title still shows "My Updated Resume"

7. **Test blur auto-save:**
   - Click title again
   - Type: "Another Title"
   - **Click away** (don't press Enter, just click elsewhere on page)
   - **Expected:**
     - Auto-save triggers on blur
     - Title updates to "Another Title"
     - Success toast shown

8. **Test Escape key:**
   - Click title
   - Type: "This Will Be Cancelled"
   - Press Escape key
   - **Expected:**
     - Input reverts to original title (before edit)
     - No save attempt made
     - No toast shown

9. **Test empty title validation:**
   - Click title
   - Delete all text (empty input)
   - Click away
   - **Expected:**
     - Title reverts to original (no save)
     - No error toast (silent revert)

10. **Test unchanged title:**
    - Click title
    - Type exact same title
    - Click away
    - **Expected:**
      - No save request (optimization)
      - No toast shown

11. **Test network failure handling:**
    - Open DevTools → Network tab
    - Throttle to "Offline"
    - Click title and rename
    - Click away
    - **Expected:**
      - Error toast: "Failed to rename resume"
      - Title reverts to original
      - No data loss

12. **Test very long title:**
    - Click title
    - Paste 250+ character string
    - Click away
    - **Expected:**
      - Input maxLength=200 prevents typing beyond 200 chars
      - Save succeeds with truncated title

**Pass Criteria:**
- ✅ Click activates edit mode
- ✅ Enter saves and exits
- ✅ Blur saves and exits
- ✅ Escape cancels without saving
- ✅ Empty title reverts (no save)
- ✅ Unchanged title doesn't trigger save
- ✅ Network errors revert title
- ✅ Success toast shown on save
- ✅ maxLength enforced (200 chars)
- ✅ Visual feedback during edit (blue border)

---

### Test 2.7: Icon Buttons Layout
**Purpose:** Verify new action button design

**Steps:**

1. **Navigate to My Resumes page**

2. **Inspect resume card action buttons:**
   - **Expected layout (left to right):**
     1. **Edit** button (full width, blue, primary)
     2. **Download** icon (Download from lucide-react)
     3. **Duplicate** icon (Copy from lucide-react)
     4. **Delete** icon (Trash2 from lucide-react)

3. **Check button styling:**
   - Edit button:
     - Background: Blue (bg-blue-600)
     - Text: White
     - Flex: Takes remaining space (flex-1)
     - Hover: Darker blue (hover:bg-blue-700)

   - Icon buttons (Download, Duplicate, Delete):
     - Size: Compact (p-2)
     - Background: None (transparent)
     - Icon color: Gray (Download, Duplicate), Red (Delete)
     - Hover: Light background (hover:bg-gray-100, hover:bg-red-50)
     - Icon size: 20px (w-5 h-5)

4. **Test button interactions:**
   - Click Edit → Navigates to editor
   - Click Download → Downloads PDF
   - Click Duplicate → Opens modal
   - Click Delete → Opens delete confirmation

5. **Test responsive layout:**
   - Resize browser window
   - **Expected:**
     - Buttons remain in single row
     - Edit button shrinks/grows appropriately
     - Icon buttons maintain fixed size
     - No wrapping or overflow

6. **Test hover tooltips:**
   - Hover over Download icon
   - **Expected:** Browser tooltip shows "Download PDF"
   - Hover over Duplicate icon
   - **Expected:** Tooltip shows "Duplicate"
   - Hover over Delete icon
   - **Expected:** Tooltip shows "Delete"

**Pass Criteria:**
- ✅ All 4 buttons visible and functional
- ✅ Layout clean and compact
- ✅ Icons render correctly (lucide-react)
- ✅ Hover states work
- ✅ Tooltips informative
- ✅ No layout shift on hover
- ✅ Consistent spacing (gap-2)

---

### Test 2.8: Hover Effects and Interactions
**Purpose:** Verify card hover behavior with new UI

**Steps:**

1. **Navigate to My Resumes page**

2. **Hover over resume card:**
   - **Expected:**
     - Card shadow increases (shadow-md → shadow-xl)
     - Transition smooth (200ms)
     - Thumbnail dims (bg-black bg-opacity-50 overlay)
     - "Preview" and "Download" buttons appear over thumbnail

3. **Test thumbnail click:**
   - Click on thumbnail area
   - **Expected:** Navigates to editor (same as Edit button)

4. **Test title hover (not editing):**
   - Hover over title text
   - **Expected:**
     - Background changes to light gray (hover:bg-gray-50)
     - Cursor changes to text cursor (cursor-text)
     - Visual hint that title is clickable

5. **Test button click prevention:**
   - Click icon button (e.g., Duplicate)
   - **Expected:**
     - Event doesn't bubble to card
     - Card doesn't navigate to editor
     - Modal opens correctly

6. **Test card in grid layout:**
   - View page with 3+ resumes
   - **Expected:**
     - Cards in responsive grid
     - Mobile (< md): 1 column
     - Tablet (md-lg): 2 columns
     - Desktop (>= lg): 3 columns

**Pass Criteria:**
- ✅ Hover shadow transition smooth
- ✅ Overlay buttons appear on hover
- ✅ Title hover indicates editability
- ✅ Click events properly handled
- ✅ Grid responsive at all breakpoints
- ✅ No layout shift issues

---

## Phase 3: Integration Testing

### Test 3.1: Full User Journey - Improved Flow
**Purpose:** End-to-end test with all new features

**Steps:**

1. **Sign in and create resume:**
   - Navigate to `/templates`
   - Select template
   - Fill in:
     - Name: "Sarah Chen"
     - Email: "sarah@example.com"
     - Experience: Company "Amazon", Title "Senior Data Scientist"
   - Wait for auto-save

2. **Verify auto-naming:**
   - Navigate to `/my-resumes`
   - **Expected:** Title shows "Senior Data Scientist" (auto-named)

3. **Generate thumbnail:**
   - Hover over card
   - Click "Download" to generate PDF
   - Wait for download complete

4. **Refresh page:**
   - **Expected:**
     - Thumbnail now shows actual resume preview (not template image)
     - Template badge shows "Modern With Icons"

5. **Rename resume:**
   - Click title "Senior Data Scientist"
   - Type "Amazon Data Science Resume"
   - Press Enter
   - **Expected:** Success toast, title updated

6. **Duplicate resume:**
   - Click Duplicate icon
   - Modal opens with "Copy of Amazon Data Science Resume"
   - Change to "Meta Data Science Resume"
   - Click Duplicate
   - **Expected:**
     - New card appears
     - Title: "Meta Data Science Resume"
     - Same thumbnail (copied from original)
     - Count shows "2/5 resumes saved"

7. **Edit duplicate:**
   - Click Edit on "Meta Data Science Resume"
   - Change company to "Meta"
   - Wait for auto-save
   - Go back to My Resumes
   - **Expected:**
     - Title still "Meta Data Science Resume" (manual title preserved)
     - Original resume unchanged

8. **Delete original:**
   - Click Delete on "Amazon Data Science Resume"
   - Confirm deletion
   - **Expected:**
     - Card removed
     - Count shows "1/5 resumes saved"
     - "Meta" resume still there

**Pass Criteria:**
- ✅ Auto-naming works throughout flow
- ✅ Thumbnails generate and display correctly
- ✅ Rename persists across sessions
- ✅ Duplicate creates independent copy
- ✅ All UI elements work together seamlessly
- ✅ No console errors at any step

---

### Test 3.2: Multi-Device Thumbnail Sync
**Purpose:** Verify thumbnails sync across devices

**Steps:**

1. **Device A (Desktop):**
   - Create resume
   - Generate PDF (triggers thumbnail creation)

2. **Device B (Mobile/Tablet):**
   - Sign in with same account
   - Navigate to `/my-resumes`
   - **Expected:**
     - Same resume appears
     - **Thumbnail displays** (synced from Device A)
     - Not falling back to template preview

3. **Device B:**
   - Rename resume via click-to-rename
   - Wait for save

4. **Device A:**
   - Refresh `/my-resumes`
   - **Expected:** New title appears (synced)

**Pass Criteria:**
- ✅ Thumbnails sync across devices
- ✅ Renames sync immediately
- ✅ No data inconsistency
- ✅ All features work on mobile

---

### Test 3.3: Bulk Operations
**Purpose:** Test creating/duplicating multiple resumes

**Steps:**

1. **Create 5 resumes sequentially:**
   - Different templates
   - Different content
   - All auto-named differently

2. **Navigate to My Resumes:**
   - **Expected:**
     - All 5 cards display
     - Each has unique auto-generated title
     - Some have thumbnails (if PDF generated)
     - Some fallback to template previews
     - Shows "5/5 resumes saved"

3. **Try to duplicate:**
   - Click Duplicate on any resume
   - **Expected:** Error toast about limit reached

4. **Delete one resume**

5. **Now duplicate:**
   - Click Duplicate on another resume
   - Change title to "Duplicate at Limit Edge Case"
   - **Expected:**
     - Succeeds (count was 4, now 5)
     - New card appears

**Pass Criteria:**
- ✅ Can create up to 5 resumes
- ✅ Limit enforced correctly
- ✅ Duplicate respects limit
- ✅ Can duplicate after deletion
- ✅ All cards render correctly

---

## Phase 4: Error Handling & Edge Cases

### Test 4.1: Thumbnail Generation Timeout
**Purpose:** Verify handling of slow/large PDFs

**Setup:** Create resume with:
- 10+ work experience entries
- 5+ sections
- 10 icons

**Steps:**

1. **Generate PDF:**
   - Click Download/Preview
   - **Expected:**
     - PDF generation takes longer (5-10 seconds)
     - Loading indicator shown
     - Thumbnail generation adds ~500ms-1s
     - No timeout error (60s limit)

2. **Check backend logs:**
   - Should show successful thumbnail generation
   - No errors

**Pass Criteria:**
- ✅ Large PDFs generate successfully
- ✅ Thumbnails generated even for large files
- ✅ No timeout errors
- ✅ User gets feedback (loading spinner)

---

### Test 4.2: Rename Network Failure
**Purpose:** Verify optimistic update rollback

**Steps:**

1. **Open DevTools → Network → Throttle to "Offline"**

2. **Click title and rename:**
   - Type "New Title"
   - Click away (blur)

3. **Expected:**
   - Title updates immediately (optimistic)
   - PATCH request fails
   - Error toast shown
   - **Title reverts to original** (rollback)

4. **Go back online**

5. **Rename again:**
   - **Expected:** Succeeds, title persists

**Pass Criteria:**
- ✅ Optimistic update happens
- ✅ Network error detected
- ✅ Rollback to original title
- ✅ Error toast shown
- ✅ Retry succeeds when online

---

### Test 4.3: Duplicate with Large Icons
**Purpose:** Verify icon copying doesn't fail

**Steps:**

1. **Create resume with multiple large icons** (40-50KB each)

2. **Duplicate the resume:**
   - Click Duplicate
   - Enter new title
   - Submit

3. **Expected:**
   - Backend copies all icons to new storage paths
   - Duplication completes successfully
   - All icons accessible in duplicate

4. **Verify in Supabase Storage:**
   - Both source and duplicate paths exist
   - File sizes match

**Pass Criteria:**
- ✅ Large icon files copied successfully
- ✅ No timeout during copy
- ✅ All icons accessible
- ✅ No storage errors

---

### Test 4.4: Concurrent Rename Detection
**Purpose:** Test concurrent edits (edge case)

**Steps:**

1. **Open same resume on two tabs (Tab A, Tab B)**

2. **Tab A:** Rename to "Version A"
3. **Tab B:** Rename to "Version B" (quickly after A)

4. **Expected behavior (current):**
   - Both saves succeed
   - Last save wins (Version B)
   - Tab A doesn't know about conflict

5. **Refresh both tabs:**
   - **Expected:** Both show "Version B"

**Note:** This is acceptable for MVP. Future enhancement: detect `updated_at` mismatch and warn user.

**Pass Criteria:**
- ✅ No crashes or errors
- ✅ Eventually consistent (last write wins)
- ✅ Data not corrupted

---

## Phase 5: Performance Testing

### Test 5.1: My Resumes Page Load Performance
**Purpose:** Benchmark page load with thumbnails

**Tools:** Chrome DevTools Lighthouse

**Steps:**

1. **Create 5 resumes with thumbnails generated**

2. **Run Lighthouse audit on `/my-resumes`:**
   ```bash
   # In Chrome DevTools → Lighthouse
   # Run audit for Performance
   ```

3. **Expected metrics:**
   - Performance Score: > 80
   - First Contentful Paint: < 1.5s
   - Largest Contentful Paint: < 2.5s
   - Total Blocking Time: < 300ms

4. **Check Network tab:**
   - Thumbnails should load in parallel
   - Cached on subsequent visits
   - Total page size: < 2MB (with 5 thumbnails)

**Pass Criteria:**
- ✅ Performance score acceptable
- ✅ Thumbnails don't block rendering
- ✅ Lazy loading works (if implemented)
- ✅ No layout shift from image loading

---

### Test 5.2: Rename Response Time
**Purpose:** Ensure rename is instant (perceived)

**Steps:**

1. **Click title and rename**

2. **Measure time:**
   - From blur event to title update
   - **Expected:** < 500ms (feels instant)

3. **Check Network tab:**
   - PATCH request should complete quickly
   - Optimistic update makes it feel instant

**Pass Criteria:**
- ✅ Rename feels immediate (< 500ms perceived)
- ✅ No janky UI updates
- ✅ API response time acceptable (< 200ms)

---

### Test 5.3: Duplicate Performance
**Purpose:** Verify duplication doesn't timeout

**Steps:**

1. **Duplicate resume with 10 icons**

2. **Measure duration:**
   - From modal submit to completion
   - **Expected:** < 5 seconds

3. **Check backend logs:**
   - Icon copy operations logged
   - No errors or timeouts

**Pass Criteria:**
- ✅ Duplication completes < 5 seconds
- ✅ UI shows loading state
- ✅ No timeout errors

---

## Phase 6: Browser Compatibility

### Test 6.1: Cross-Browser Testing
**Purpose:** Verify features work across browsers

**Browsers to test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Features to verify:**
- ✅ Thumbnails display correctly
- ✅ Click-to-rename works
- ✅ Icon buttons render (lucide-react)
- ✅ Modals function properly
- ✅ Hover effects smooth
- ✅ Template badge readable

**Known issues to watch:**
- Safari: Backdrop-filter support
- Firefox: Image rendering quality
- Edge: Flexbox quirks

---

## Success Criteria Summary

### Backend (P0 - Must Have)
- [x] Thumbnail generation function works
- [x] Thumbnails upload to Supabase Storage
- [x] PDF generation triggers thumbnail creation
- [x] Thumbnail failure doesn't break PDF generation
- [x] Duplicate endpoint creates independent copy
- [x] Duplicate respects 5-resume limit
- [x] PATCH endpoint updates title only
- [x] Rename validates input (empty, length)
- [x] Auto-naming logic in save endpoint

### Frontend (P0 - Must Have)
- [x] Thumbnails display when available
- [x] Fallback to template preview when no thumbnail
- [x] Template badge displays correctly
- [x] Icon count removed from UI
- [x] Duplicate modal opens and functions
- [x] Click-to-rename activates on click
- [x] Rename auto-saves on blur
- [x] Icon buttons render with lucide-react
- [x] All buttons functional
- [x] Auto-naming displays in My Resumes

### Integration (P1 - Should Have)
- [ ] Full user journey succeeds
- [ ] Cross-device thumbnail sync works
- [ ] Bulk operations handled correctly
- [ ] Error handling comprehensive
- [ ] Performance acceptable

### Polish (P2 - Nice to Have)
- [ ] Animations smooth
- [ ] Loading states clear
- [ ] Error messages helpful
- [ ] Responsive design perfect
- [ ] Accessibility compliant

---

## Test Execution Checklist

**Before Starting:**
- [ ] Docker container rebuilt
- [ ] Database migration executed
- [ ] Supabase storage bucket created
- [ ] Frontend dependencies installed
- [ ] Backend server running
- [ ] Frontend dev server running

**During Testing:**
- [ ] Record all test results (Pass/Fail)
- [ ] Screenshot failed tests
- [ ] Save backend logs
- [ ] Note performance metrics
- [ ] Document edge cases

**After Testing:**
- [ ] Compile bug report
- [ ] Prioritize fixes (P0, P1, P2)
- [ ] Re-test failed cases after fixes
- [ ] Update this document with actual results
- [ ] Sign off on release readiness

---

## Test Results Template

| Test ID | Test Name | Status | Notes | Screenshot |
|---------|-----------|--------|-------|------------|
| 1.1 | Auto-Naming Priority 1 | ⏳ | | |
| 1.2 | Thumbnail Generation | ⏳ | | |
| 1.3 | Thumbnail Failure Handling | ⏳ | | |
| 1.4 | Duplicate Endpoint | ⏳ | | |
| 1.5 | Duplicate at Limit | ⏳ | | |
| 1.6 | Rename Endpoint | ⏳ | | |
| 1.7 | thumbnail_url in Responses | ⏳ | | |
| 2.1 | Auto-Naming UI | ⏳ | | |
| 2.2 | Thumbnail Display | ⏳ | | |
| 2.3 | Template Badge | ⏳ | | |
| 2.4 | Icon Count Removed | ⏳ | | |
| 2.5 | Duplicate Modal | ⏳ | | |
| 2.6 | Click-to-Rename | ⏳ | | |
| 2.7 | Icon Buttons Layout | ⏳ | | |
| 3.1 | Full User Journey | ⏳ | | |
| 4.1 | Thumbnail Timeout | ⏳ | | |
| 4.2 | Rename Network Failure | ⏳ | | |
| 5.1 | Page Load Performance | ⏳ | | |

**Legend:** ⏳ Pending | ✅ Pass | ❌ Fail | ⚠️ Partial

---

**Testing Started:** [Date]
**Testing Completed:** [Date]
**Test Lead:** [Name]
**Overall Status:** ⏳ In Progress
