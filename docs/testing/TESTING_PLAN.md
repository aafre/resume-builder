# Resume Storage & Management - Testing Plan (Database-First Architecture)

## Overview
This document provides a comprehensive testing plan for the database-first resume storage architecture with:
- **JSONB Storage**: Database stores contact_info and sections as JSONB (queryable, type-safe)
- **Hash-Based Diffing**: Only persist to database if JSON hash changed (~80% reduction in writes)
- **RESTful Routing**: Clean URLs (/editor/:resumeId) instead of query params
- **Server-Generated IDs**: All resume IDs created via POST /api/resumes/create
- **YAML on-demand**: Generated only for PDF via json_to_yaml_structure helper

## Prerequisites

### Environment Setup
- [ ] Verify `.env` file contains:
  - `SUPABASE_URL` - Your Supabase project URL
  - `SUPABASE_SERVICE_KEY` - Service role key (for backend)
  - `VITE_SUPABASE_URL` - Your Supabase project URL (for frontend)
  - `VITE_SUPABASE_ANON_KEY` - Anon key (for frontend)

### Database Verification
- [ ] Confirm `resumes` table exists with updated schema:
  - `json_hash` column (VARCHAR 64) for smart diffing
  - `contact_info` and `sections` as JSONB (source of truth)
- [ ] Confirm `user_preferences` table exists:
  - `last_edited_resume_id` for session continuity
- [ ] Confirm `resume_icons` table exists with correct schema
- [ ] Verify RLS policies are enabled on all tables
- [ ] Verify `resume-icons` storage bucket exists and is public

### Dependencies
- [ ] Run `pip install supabase` (backend)
- [ ] Run `cd resume-builder-ui && npm install` (frontend)
- [ ] Verify `@supabase/supabase-js` is in package.json

---

## Phase 1: Backend API Testing

### Test 1.1: Authentication Middleware
**Purpose:** Verify JWT authentication works correctly

**Steps:**
1. Start Flask server: `python app.py`
2. Try to access protected endpoint without token:
   ```bash
   curl -X GET http://localhost:5000/api/resumes
   ```
3. **Expected:** 401 Unauthorized error

4. Sign in via frontend, copy JWT token from browser DevTools (Application > Local Storage > supabase.auth.token)
5. Try again with valid token:
   ```bash
   curl -X GET http://localhost:5000/api/resumes \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```
6. **Expected:** 200 OK with empty resumes array

**Pass Criteria:**
- ✅ Requests without token return 401
- ✅ Requests with invalid token return 401
- ✅ Requests with valid token return 200

---

### Test 1.2: Create Empty Resume (POST /api/resumes/create)
**Purpose:** Verify server-side resume creation before editing

**Steps:**
1. Send POST request to create new resume:
   ```bash
   curl -X POST http://localhost:5000/api/resumes/create \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"template_id": "modern-with-icons"}'
   ```
2. **Expected:** 201 Created with `resume_id` in response

3. Verify in Supabase dashboard:
   - Check `resumes` table has new row with empty contact_info and sections
   - Check `user_preferences` table has `last_edited_resume_id` updated

4. Try to create 6th resume (after creating 5)
5. **Expected:** 403 Forbidden with error_code: "RESUME_LIMIT_REACHED"

**Pass Criteria:**
- ✅ Returns 201 with valid UUID resume_id
- ✅ Empty resume row created in database
- ✅ last_edited_resume_id updated
- ✅ 5-resume limit enforced at creation

---

### Test 1.3: Save Resume with Hash Diffing (POST /api/resumes)
**Purpose:** Verify hash-based smart diffing (saves only when JSON changed)

**Steps:**
1. Use resume_id from Test 1.2 and create test request body:
   ```json
   {
     "id": "RESUME_ID_FROM_TEST_1_2",
     "template_id": "modern-with-icons",
     "contact_info": {
       "name": "John Test",
       "email": "john@test.com",
       "phone": "+1234567890",
       "location": "Test City, USA"
     },
     "sections": [
       {
         "name": "Summary",
         "type": "text",
         "content": "Test summary"
       }
     ],
     "icons": [
       {
         "filename": "test-icon.png",
         "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
       }
     ]
   }
   ```

2. Send POST request (first save)
3. **Expected:** 200 OK, resume saved, `json_hash` populated in database

4. Send EXACT SAME request again (no changes)
5. **Expected:** 200 OK with `skipped: true` in response (hash matched, no DB write)

6. Modify contact_info.name to "Jane Test" and send again
7. **Expected:** 200 OK with `skipped: false`, database updated, new hash calculated

8. Verify in Supabase dashboard:
   - `json_hash` column updated after change
   - `updated_at` only changes when data actually changed

**Pass Criteria:**
- ✅ First save persists data and calculates hash
- ✅ Identical save skipped (returns skipped: true)
- ✅ Changed data triggers update with new hash
- ✅ Icons uploaded to storage
- ✅ Database writes reduced (~80% for typical editing)

---

### Test 1.4: PDF Generation with YAML Conversion
**Purpose:** Verify JSONB to YAML conversion for PDF templates

**Steps:**
1. Save a resume with JSONB data (POST /api/resumes)
2. Generate PDF (POST /api/resumes/:id/pdf)
3. **Expected:**
   - Backend reads JSONB from database
   - `json_to_yaml_structure()` converts to YAML
   - YAML passed to template engine
   - PDF generated successfully

4. Open PDF and verify correct data rendering

**Pass Criteria:**
- ✅ PDF generation succeeds
- ✅ JSONB → YAML conversion works
- ✅ Template receives valid YAML structure
- ✅ PDF contains correct contact_info and sections

---

### Test 1.5: List User Resumes (GET /api/resumes)
**Purpose:** Verify resume listing with pagination

**Steps:**
1. With 5 resumes in database, send GET request:
   ```bash
   curl -X GET "http://localhost:5000/api/resumes?limit=3&offset=0" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
2. **Expected:** 200 OK with 3 resumes, total_count=5

3. Request next page:
   ```bash
   curl -X GET "http://localhost:5000/api/resumes?limit=3&offset=3" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
4. **Expected:** 200 OK with 2 resumes

**Pass Criteria:**
- ✅ Returns correct number of resumes
- ✅ Pagination works (limit/offset)
- ✅ Resumes ordered by updated_at DESC
- ✅ total_count accurate
- ✅ icon_count included for each resume

---

### Test 1.6: Load Specific Resume (GET /api/resumes/:id)
**Purpose:** Verify resume loading with icons

**Steps:**
1. Send GET request for specific resume_id
2. **Expected:** 200 OK with full resume data including:
   - contact_info
   - sections
   - icons array with storage_url for each icon

3. Try to load resume that doesn't exist:
   ```bash
   curl -X GET "http://localhost:5000/api/resumes/invalid-uuid" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
4. **Expected:** 404 Not Found

**Pass Criteria:**
- ✅ Returns full resume data
- ✅ Icons include storage_url
- ✅ last_accessed_at updated
- ✅ Invalid ID returns 404
- ✅ Other user's resume returns 404

---

### Test 1.7: Delete Resume (DELETE /api/resumes/:id)
**Purpose:** Verify soft delete functionality

**Steps:**
1. Delete one of the test resumes:
   ```bash
   curl -X DELETE "http://localhost:5000/api/resumes/RESUME_ID" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
2. **Expected:** 200 OK with success message

3. Verify in database:
   - `deleted_at` timestamp is set (soft delete)
   - Resume no longer appears in GET /api/resumes list

4. Try to load deleted resume:
   ```bash
   curl -X GET "http://localhost:5000/api/resumes/DELETED_RESUME_ID" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
5. **Expected:** 404 Not Found

**Pass Criteria:**
- ✅ Returns 200 on successful delete
- ✅ Resume has deleted_at timestamp
- ✅ Deleted resume doesn't appear in list
- ✅ Deleted resume returns 404 on load
- ✅ Can now create new resume (count < 5)

---

### Test 1.8: Generate PDF for Saved Resume (POST /api/resumes/:id/pdf)
**Purpose:** Verify on-demand PDF generation

**Steps:**
1. Send POST request to generate PDF:
   ```bash
   curl -X POST "http://localhost:5000/api/resumes/RESUME_ID/pdf" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     --output test-resume.pdf
   ```
2. **Expected:** PDF file downloaded successfully

3. Open PDF and verify:
   - Contains correct contact info
   - Contains correct sections
   - Icons are displayed (if template supports them)
   - Template styling applied

**Pass Criteria:**
- ✅ PDF file generated successfully
- ✅ PDF contains correct data
- ✅ Icons downloaded from storage and embedded
- ✅ Template matches resume template_id
- ✅ Invalid resume_id returns 404

---

## Phase 2: Frontend Testing

### Test 2.1: My Resumes Page - Empty State
**Purpose:** Verify empty state UI

**Steps:**
1. Sign in with a new user account (no resumes)
2. Navigate to `/my-resumes`
3. **Expected:**
   - Empty state message displayed
   - "Create Resume" button visible
   - Shows "0/5 resumes saved"

**Pass Criteria:**
- ✅ Empty state renders correctly
- ✅ Create button works (navigates to `/`)

---

### Test 2.2: My Resumes Page - Resume List
**Purpose:** Verify resume grid display

**Steps:**
1. Create 3 test resumes via backend
2. Navigate to `/my-resumes`
3. **Expected:**
   - Grid displays 3 resume cards
   - Each card shows:
     - Resume title
     - Template preview thumbnail
     - Last updated time
     - Icon count
     - Edit and Delete buttons

4. Hover over a card
5. **Expected:** Preview and Download buttons appear

**Pass Criteria:**
- ✅ All resumes displayed in grid
- ✅ Card data accurate
- ✅ Hover effects work
- ✅ Shows "3/5 resumes saved"

---

### Test 2.3: Resume Actions - Edit
**Purpose:** Verify editing flow with RESTful routing

**Steps:**
1. Click "Edit" on a resume card
2. **Expected:** Redirects to `/editor/RESUME_ID` (RESTful URL, not query param)
3. Editor loads resume via `GET /api/resumes/:id`
4. **Expected:** Resume data populated (contact_info, sections, icons from storage)
5. Make a change and wait 5 seconds
6. **Expected:**
   - SaveStatusIndicator shows "Saving..."
   - POST /api/resumes sent with JSON (not YAML)
   - Backend calculates hash and compares
   - If hash differs → save, else skip
   - SaveStatusIndicator shows "Saved X ago"

**Pass Criteria:**
- ✅ Edit button navigates to `/editor/:resumeId` (clean RESTful URL)
- ✅ Resume data loads from database (JSONB)
- ✅ Changes auto-save after 5 seconds (debounced)
- ✅ Hash diffing reduces unnecessary database writes

---

### Test 2.4: Resume Actions - Delete
**Purpose:** Verify delete confirmation flow

**Steps:**
1. Click "Delete" on a resume card
2. **Expected:** Delete confirmation modal appears
3. Click "Cancel"
4. **Expected:** Modal closes, resume still in list

5. Click "Delete" again
6. Click "Delete" button in modal
7. **Expected:**
   - Modal shows "Deleting..." state
   - Resume removed from list
   - Success toast notification
   - Count updates (e.g., "2/5 resumes saved")

**Pass Criteria:**
- ✅ Confirmation modal works
- ✅ Cancel preserves resume
- ✅ Delete removes resume
- ✅ UI updates immediately
- ✅ Toast notification shown

---

### Test 2.5: Resume Actions - Download
**Purpose:** Verify PDF download

**Steps:**
1. Click "Download" button (appears on hover)
2. **Expected:**
   - Loading overlay appears
   - PDF generates
   - File downloads automatically
   - Success toast shown

3. Open downloaded PDF
4. **Expected:** PDF matches resume data

**Pass Criteria:**
- ✅ Loading indicator shows
- ✅ PDF downloads successfully
- ✅ File named correctly (resume title)
- ✅ PDF content accurate

---

### Test 2.6: Resume Actions - Preview
**Purpose:** Verify preview in new tab

**Steps:**
1. Click "Preview" button (appears on hover)
2. **Expected:**
   - Loading overlay appears
   - New browser tab opens with PDF
   - Success (or no error toast)

**Pass Criteria:**
- ✅ Preview opens in new tab
- ✅ PDF displays correctly
- ✅ No console errors

---

### Test 2.7: Storage Limit Modal
**Purpose:** Verify 5-resume limit UI

**Steps:**
1. Create 5 resumes
2. Try to create 6th resume (via editor auto-save or manual save)
3. **Expected:**
   - StorageLimitModal appears
   - Shows "Storage Full" message
   - "Manage Resumes" button visible

4. Click "Manage Resumes"
5. **Expected:** Navigates to `/my-resumes`

6. Delete a resume
7. Try to save again
8. **Expected:** Save succeeds (limit not reached)

**Pass Criteria:**
- ✅ Modal appears when limit reached
- ✅ Navigation works
- ✅ Can save after deleting

---

### Test 2.8: Database-First Auto-Save (useCloudSave Always Enabled)
**Purpose:** Verify debounced auto-save with hash diffing

**Steps:**
1. Navigate to `/templates`, select a template
2. **Expected:** POST /api/resumes/create called → returns resume_id
3. Navigate to `/editor/:resumeId`
4. Make a change (e.g., edit name)
5. **Expected:**
   - SaveStatusIndicator shows "Saving..." after ~5 seconds
   - POST /api/resumes sent with JSON data
   - Backend calculates SHA-256 hash of JSON
   - First save → hash differs → saves to database
   - Shows "Saved X ago"

6. Make no change, wait 5 seconds
7. **Expected:** No save request (debounce prevents spam)

8. Make same change again (type "A", delete "A")
9. **Expected:**
   - Auto-save triggers
   - Backend: hash matches → returns `skipped: true`
   - No database write (smart diffing)

10. Switch browser tabs (triggers blur save)
11. **Expected:** Immediate save attempt

**Pass Criteria:**
- ✅ useCloudSave ALWAYS enabled (database-first for all users)
- ✅ Auto-save triggers after 5 seconds (debounced)
- ✅ Blur save triggers immediately
- ✅ Hash diffing skips unchanged data
- ✅ Database writes reduced significantly
- ✅ No localStorage used (database is source of truth)

---

### Test 2.9: Resume Loading in Editor (RESTful URLs)
**Purpose:** Verify loading saved resume with clean URLs

**Steps:**
1. Navigate to `/editor/EXISTING_RESUME_ID` (RESTful URL path parameter)
2. **Expected:**
   - Editor extracts resumeId from `useParams()` (not query params)
   - GET /api/resumes/:id loads resume data (JSONB from database)
   - Contact info populated
   - Sections populated
   - Icons loaded from storage URLs and registered
   - Template ID from database

3. Make a change and auto-save
4. **Expected:**
   - Updates existing resume (POST /api/resumes with id set)
   - Hash calculated and compared
   - If changed → database updated
   - Doesn't create new resume

**Pass Criteria:**
- ✅ Clean RESTful URL (/editor/:resumeId, not /?resumeId=)
- ✅ useParams() extracts resumeId correctly
- ✅ All fields populated from JSONB
- ✅ Icons display correctly
- ✅ Subsequent saves update existing resume

---

### Test 2.10: Anonymous to Authenticated Flow (Database-First)
**Purpose:** Verify Supabase anonymous auth linking

**Steps:**
1. Open editor in incognito/private browsing (no auth)
2. **Expected:**
   - Supabase automatically creates anonymous session
   - Anonymous user_id assigned (UUID)

3. Select template, create resume
4. **Expected:**
   - POST /api/resumes/create with anonymous user_id
   - Resume row created in database (linked to anonymous user)
   - Auto-save works (database-first, no localStorage)

5. Sign up with Google/LinkedIn/Email OAuth
6. **Expected:**
   - Supabase automatically links anonymous session to authenticated account
   - user_id REMAINS THE SAME (Supabase handles linking)
   - Resume row user_id automatically updated by Supabase
   - No migration needed (already in database)

7. Navigate to `/my-resumes`
8. **Expected:** Resume appears in list (already linked to account)

**Pass Criteria:**
- ✅ Anonymous session auto-created
- ✅ Resume saves to database (not localStorage)
- ✅ Supabase links anonymous → authenticated seamlessly
- ✅ No data migration required (database-first from start)
- ✅ Resume immediately available in account

---

### Test 2.11: Smart Landing Page Redirect
**Purpose:** Verify intelligent routing for returning users

**Steps:**
1. Sign in as new user (0 resumes)
2. Navigate to `/` (landing page)
3. **Expected:**
   - Landing page displays (first-time user experience)
   - CTA buttons to create resume

4. Create a resume via `/templates`
5. Navigate back to `/`
6. **Expected:**
   - Automatic redirect to `/my-resumes` (returning user)
   - No landing page shown (already has resumes)

7. Test legacy URL migration:
   - Navigate to `/?resumeId=SOME_ID`
   - **Expected:** Redirect to `/editor/SOME_ID`
   - Navigate to `/?template=modern`
   - **Expected:** Redirect to `/templates`

**Pass Criteria:**
- ✅ First-time users see landing page
- ✅ Returning users redirect to /my-resumes
- ✅ Legacy URLs migrate to RESTful format
- ✅ No broken bookmarks

---

## Phase 3: Integration Testing

### Test 3.1: Full User Journey - New User
**Purpose:** End-to-end test for new user

**Steps:**
1. Sign up with Google OAuth
2. Create first resume in editor
3. Wait for auto-save (5 seconds)
4. Navigate to "My Resumes"
5. Edit resume
6. Download PDF
7. Create second resume
8. Delete first resume
9. Navigate back to "My Resumes"

**Expected Results:**
- ✅ All operations complete successfully
- ✅ UI updates correctly
- ✅ Data persists across page navigations
- ✅ No console errors
- ✅ Database reflects all changes

---

### Test 3.2: Cross-Device Sync
**Purpose:** Verify data syncs across devices

**Steps:**
1. Create resume on Device A (e.g., desktop)
2. Sign in on Device B (e.g., mobile/tablet) with same account
3. Navigate to `/my-resumes`
4. **Expected:** Resume appears on Device B

5. Edit resume on Device B
6. Refresh `/my-resumes` on Device A
7. **Expected:** Changes reflected

**Pass Criteria:**
- ✅ Resumes sync across devices
- ✅ Changes propagate
- ✅ Icons load correctly on both devices

---

### Test 3.3: Concurrent Edit Detection (Future Enhancement)
**Purpose:** Verify conflict handling

**Steps:**
1. Open same resume on two browser tabs
2. Edit in Tab 1, auto-save
3. Edit in Tab 2
4. **Current Behavior:** Last save wins (no conflict detection)
5. **Future:** Show warning about concurrent edits

**Note:** This is a known limitation for MVP. Future enhancement should detect `updated_at` mismatches.

---

## Phase 4: Error Handling & Edge Cases

### Test 4.1: Network Failure During Save
**Purpose:** Verify graceful error handling

**Steps:**
1. Open DevTools Network tab
2. Throttle to "Offline"
3. Make edit in editor
4. **Expected:**
   - Auto-save attempt fails
   - SaveStatusIndicator shows "Save failed" or error status
   - Data remains in memory (React state)
   - No data loss

5. Go back online
6. Wait for next auto-save trigger (debounce or blur)
7. **Expected:**
   - Save succeeds
   - Data persists to database
   - Status indicator updates to "Saved"

**Pass Criteria:**
- ✅ Error state shown clearly
- ✅ Data preserved in component state
- ✅ Retry succeeds when online
- ✅ User notified of save failure
- ✅ No silent data loss

---

### Test 4.2: Invalid JWT Token
**Purpose:** Verify token expiry handling

**Steps:**
1. Sign in and wait for JWT to expire (~1 hour)
2. Try to access `/my-resumes`
3. **Expected:**
   - 401 error from backend
   - Frontend refreshes token automatically (Supabase client)
   - Request retries successfully

**Pass Criteria:**
- ✅ Token refresh automatic
- ✅ User not logged out
- ✅ Request completes

---

### Test 4.3: Large Resume Data
**Purpose:** Verify handling of large resumes

**Steps:**
1. Create resume with:
   - 50+ work experience entries
   - 20+ sections
   - 10+ icons (near 50KB limit)

2. Save and reload
3. **Expected:** All data persists correctly

4. Generate PDF
5. **Expected:** PDF generation succeeds (may take longer)

**Pass Criteria:**
- ✅ Large data saves successfully
- ✅ Loading performant
- ✅ PDF generation works
- ✅ No data truncation

---

### Test 4.4: Icon Upload Failure
**Purpose:** Verify icon error handling

**Steps:**
1. Create resume with invalid icon (> 50KB)
2. **Expected:**
   - Backend returns error (413 or validation error)
   - Frontend shows error toast
   - Resume saves without that icon

**Pass Criteria:**
- ✅ Error message clear
- ✅ Other icons still upload
- ✅ Resume still saves

---

## Phase 5: Performance Testing

### Test 5.1: Page Load Performance
**Purpose:** Verify page load times

**Tools:** Lighthouse, Chrome DevTools Performance tab

**Metrics:**
- My Resumes page load: < 2 seconds
- First Contentful Paint: < 1 second
- Time to Interactive: < 3 seconds

**Steps:**
1. Run Lighthouse audit on `/my-resumes` (with 5 resumes)
2. Check Performance score
3. **Expected:** Score > 80

**Pass Criteria:**
- ✅ Acceptable load times
- ✅ No layout shifts
- ✅ Lazy loading works for images

---

### Test 5.2: Auto-Save Performance
**Purpose:** Ensure auto-save doesn't block UI

**Steps:**
1. Make rapid changes in editor (type continuously)
2. **Expected:**
   - UI remains responsive
   - Debounce prevents excessive API calls
   - Only 1 save request per 5 seconds

3. Check Network tab
4. **Expected:** Debounced requests (not one per keystroke)

**Pass Criteria:**
- ✅ UI responsive
- ✅ Debounce working
- ✅ No API spam

---

### Test 5.3: PDF Generation Performance
**Purpose:** Benchmark PDF generation time

**Steps:**
1. Generate PDF for simple resume (1 page)
2. Time the operation
3. **Expected:** < 5 seconds

4. Generate PDF for complex resume (2-3 pages, many icons)
5. **Expected:** < 15 seconds

**Pass Criteria:**
- ✅ Reasonable generation times
- ✅ Timeout doesn't occur (60s limit)
- ✅ User gets feedback (loading indicator)

---

## Phase 6: Security Testing

### Test 6.1: Authorization Enforcement
**Purpose:** Verify users can only access their own data

**Steps:**
1. Sign in as User A, create resume
2. Note resume_id from database
3. Sign in as User B
4. Try to access User A's resume:
   ```bash
   curl -X GET "http://localhost:5000/api/resumes/USER_A_RESUME_ID" \
     -H "Authorization: Bearer USER_B_TOKEN"
   ```
5. **Expected:** 404 Not Found (RLS prevents access)

**Pass Criteria:**
- ✅ User B cannot access User A's resume
- ✅ User B cannot delete User A's resume
- ✅ User B cannot update User A's resume

---

### Test 6.2: SQL Injection Prevention
**Purpose:** Verify input sanitization

**Steps:**
1. Try to inject SQL in title field:
   ```json
   {
     "title": "Test'; DROP TABLE resumes;--",
     ...
   }
   ```
2. **Expected:** Title saved as-is, no SQL execution

**Pass Criteria:**
- ✅ No SQL injection possible
- ✅ Special characters handled safely

---

### Test 6.3: XSS Prevention
**Purpose:** Verify output escaping

**Steps:**
1. Create resume with XSS payload in title:
   ```json
   {
     "title": "<script>alert('XSS')</script>",
     ...
   }
   ```
2. View resume in My Resumes page
3. **Expected:** Script tag rendered as text, not executed

**Pass Criteria:**
- ✅ No JavaScript execution
- ✅ HTML escaped in UI

---

## Phase 7: Regression Testing

### Test 7.1: Existing Features Still Work
**Purpose:** Ensure new code doesn't break existing functionality

**Tests:**
- ✅ Anonymous resume creation (database via Supabase anonymous auth)
- ✅ Template selection (redirects to /templates)
- ✅ YAML export (for backward compatibility, downloads YAML file)
- ✅ YAML import (converts to JSONB in database)
- ✅ PDF generation (JSONB → YAML conversion via helper)
- ✅ Icon uploads (to Supabase storage)
- ✅ Section management (add/edit/delete/reorder)
- ✅ Contact info editing
- ✅ Preview modal
- ✅ Auto-save to database (useCloudSave always enabled)
- ✅ Hash-based diffing (reduces unnecessary saves)
- ✅ RESTful URLs (/editor/:resumeId)

---

## Success Criteria Summary

### Must-Have (P0)
- [x] All backend endpoints functional
- [x] Resume CRUD operations work
- [x] 5-resume limit enforced
- [x] My Resumes page displays list
- [x] Edit, delete, download work
- [x] Auto-save functional
- [x] PDF generation on-demand

### Should-Have (P1)
- [ ] Icon upload to storage
- [ ] Anonymous migration
- [ ] Error handling comprehensive
- [ ] Performance acceptable
- [ ] Security tests pass

### Nice-to-Have (P2)
- [ ] Conflict detection
- [ ] Offline mode improvements
- [ ] Advanced search/filters on My Resumes
- [ ] Bulk operations

---

## Bug Tracking Template

When bugs are found, document using this template:

**Bug ID:** RESUME-XXX
**Severity:** Critical / High / Medium / Low
**Component:** Backend API / Frontend UI / Database / Integration
**Description:** [Detailed description]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected:** [What should happen]
**Actual:** [What actually happens]
**Screenshots/Logs:** [Attach if applicable]
**Assigned To:** [Developer name]
**Status:** Open / In Progress / Fixed / Closed

---

## Test Execution Checklist

**Before Starting:**
- [ ] Environment variables configured
- [ ] Database schema migrated
- [ ] Dependencies installed (backend + frontend)
- [ ] Backend server running
- [ ] Frontend dev server running

**During Testing:**
- [ ] Record all test results (Pass/Fail)
- [ ] Screenshot failed tests
- [ ] Save console logs for errors
- [ ] Note performance metrics
- [ ] Document workarounds

**After Testing:**
- [ ] Compile bug report
- [ ] Prioritize fixes
- [ ] Update implementation if needed
- [ ] Re-test failed cases
- [ ] Update documentation

---

## Next Steps After Testing

1. **Fix Critical Bugs** - Address P0 issues blocking release
2. **Complete Remaining Integration** - Finish Editor integration + migration logic
3. **User Acceptance Testing (UAT)** - Get real user feedback
4. **Performance Optimization** - Address any performance bottlenecks
5. **Documentation Update** - Update user-facing docs with new features
6. **Deployment** - Deploy to staging, then production

---

**Testing Started:** [Date]
**Testing Completed:** [Date]
**Test Lead:** [Name]
**Status:** ⏳ In Progress | ✅ Complete | ❌ Failed
