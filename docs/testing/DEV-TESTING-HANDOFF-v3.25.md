# v3.25.0 DEV Testing Handoff

## Context

This is a **massive release** (~120 commits, 197 files, +9.5K lines) being deployed to the DEV/staging environment for the first time. The PR is [#463](https://github.com/aafre/resume-builder/pull/463) (stg -> main, draft).

### What changed (summary)

1. **Template System Overhaul** — New SOLID framework (`templates/models.py`, `registry.py`, `renderer.py`) replacing hardcoded maps. 5 new templates: ATS-Optimized, Student, Two-Column, UK CV (HTML engine), Executive (LaTeX engine). 18 bundled fonts, 14 monochrome icons.
2. **Editor Features** — Document Settings panel (accent color, font selector, page numbers), grouped-list section type, section collapse/expand animations, save state micro-animations.
3. **Templates Gallery Redesign** — New TemplateCard, TemplateFilterBar, TemplatePreviewModal, JobExamplesSection components.
4. **PostHog Analytics** — Lazy-loaded via `requestIdleCallback`. Events: pageview, resume_created, pdf_downloaded, signed_in, template_selected. Session replay with `maskAllInputs: true`.
5. **SEO/Prerender Fixes** — Fixed all 26 `/examples/*` pages that were timing out during prerender (blocked external requests). Auto-include blog posts in sitemap from blogPosts.ts.
6. **Performance** — Memoized resumeData, parallelized icon base64, O(N^2)->O(1) keyword matcher, hoisted LaTeX regex.
7. **Accessibility** — Focus-visible rings on 7 components, ARIA roles/labels on modals/dialogs.
8. **UX Polish** — UserMenu redesign, ComparisonTable mobile cards, FAQSection hover effects, landing page updates.

### Prerequisites (should already be done before testing)

- **DB**: `settings` JSONB column added to `resumes` table in DEV Supabase
- **Storage**: 5 new WebP preview images uploaded to DEV Supabase `template-previews` bucket
- **Env**: `VITE_POSTHOG_KEY` set (or empty to skip analytics testing)
- **Build**: Docker image built and deployed to staging URL

---

## DEV URL

**Replace `{{DEV_URL}}` below with the actual staging URL** (e.g., `https://staging.easyfreeresume.com` or whatever Cloud Run assigns).

---

## Testing Strategy

### Agent Architecture

Deploy **6 test agents** organized into 3 pairs. Each pair tests the same area independently for double-coverage. Agents use Chrome DevTools MCP to navigate, interact, screenshot, and verify.

**CRITICAL**: Each agent must work on its **own browser page** (`new_page`). Never share pages between agents. Use `isolation: "worktree"` on agent calls so agents don't interfere with each other or the main session.

### Agent Pairs

| Pair | Area | Agent A | Agent B |
|------|------|---------|---------|
| 1 | **Templates & PDF** | Agent 1A: Test existing templates | Agent 1B: Test new templates |
| 2 | **SEO & Content** | Agent 2A: Prerender & meta tags | Agent 2B: Sitemap & page content |
| 3 | **Editor & UX** | Agent 3A: Editor features & settings | Agent 3B: Gallery, a11y, mobile |

### How to launch

```
Launch ALL 6 agents in a SINGLE message (parallel) using the Agent tool.
Each agent gets the chrome-devtools-mcp skill for browser automation.
Use isolation: "worktree" on each.
```

---

## Agent 1A: Existing Templates & PDF Generation

**Goal**: Verify all pre-existing templates still generate PDFs correctly after the registry refactor.

```
INSTRUCTIONS:

1. Open a new browser page and navigate to {{DEV_URL}}

2. TEST: Template API returns correct data
   - Run: evaluate_script on the page:
     fetch('/api/templates').then(r => r.json())
   - VERIFY: Response contains 9+ templates
   - VERIFY: Each template has id, name, description, image_url
   - VERIFY: image_url values are Supabase CDN WebP URLs (contain "storage/v1/object/public/template-previews")
   - VERIFY: These template IDs exist: modern-with-icons, modern-no-icons, classic-alex-rivera, classic-jane-doe, ats-optimized, student, executive, two-column, uk-cv
   - SCREENSHOT the console output

3. TEST: Template images load
   - For each template in the API response, verify the image_url returns HTTP 200:
     fetch(imageUrl).then(r => r.status)
   - Flag any 404s

4. TEST: Homepage renders correctly
   - Navigate to {{DEV_URL}}/
   - Wait for full load
   - VERIFY: Hero section visible, CTA buttons present
   - VERIFY: No console errors
   - SCREENSHOT

5. TEST: Create resume with modern-with-icons template
   - Navigate to {{DEV_URL}}/templates
   - Find and click the "Modern" template card
   - Click "Use Template" or equivalent CTA
   - VERIFY: Editor opens with the template loaded
   - VERIFY: Resume preview shows modern layout with icon placeholders
   - SCREENSHOT the editor

6. TEST: PDF download works
   - In the editor, click "Download PDF"
   - VERIFY: PDF download initiates (no error toast)
   - VERIFY: No console errors during generation
   - SCREENSHOT after download completes

7. TEST: Version display in UserMenu
   - Click the user avatar/menu in the header
   - VERIFY: Version string appears in the menu footer (e.g., "v3.25.0" or "dev-xxxxx")
   - SCREENSHOT

REPORT: List every check as PASS/FAIL with screenshots.
```

---

## Agent 1B: New Templates & Font Rendering

**Goal**: Verify all 5 new templates render correctly and produce PDFs.

```
INSTRUCTIONS:

1. Open a new browser page and navigate to {{DEV_URL}}/templates

2. TEST: All new templates visible in gallery
   - VERIFY: Cards visible for: ATS-Optimized, Student, Executive, Two-Column, UK CV
   - VERIFY: Each card has a preview image (not broken/404)
   - VERIFY: Filter bar is present with category pills
   - SCREENSHOT the full gallery

3. TEST: ATS-Optimized template
   - Click ATS-Optimized card → Use Template
   - VERIFY: Editor loads, preview shows clean single-column layout
   - Change some text in a section → verify preview updates
   - Click Download PDF → verify PDF downloads without error
   - SCREENSHOT editor + note any issues

4. TEST: Student template
   - Navigate back to /templates, select Student
   - VERIFY: Education-first layout visible in preview
   - VERIFY: Contact section shows icons (black monochrome variants)
   - Download PDF → verify success
   - SCREENSHOT

5. TEST: Executive template (LaTeX)
   - Navigate to /templates, select Executive
   - VERIFY: Editor loads (this uses LaTeX engine)
   - Download PDF → VERIFY: LaTeX compilation succeeds (no error)
   - SCREENSHOT

6. TEST: Two-Column template
   - Select Two-Column template
   - VERIFY: Preview shows two-column layout (sidebar + main)
   - Download PDF → verify success
   - SCREENSHOT

7. TEST: UK CV template
   - Select UK CV template
   - VERIFY: UK formatting conventions visible
   - VERIFY: Contact icons render (black variants)
   - Download PDF → verify success
   - SCREENSHOT

8. TEST: Template preview modal
   - Go to /templates
   - Click a template card image (not the CTA button)
   - VERIFY: Full-screen preview modal opens with cross-fade
   - VERIFY: Can navigate between templates in modal
   - Close modal → verify return to gallery
   - SCREENSHOT the modal

REPORT: List every check as PASS/FAIL with screenshots. Flag any template that fails PDF generation.
```

---

## Agent 2A: Prerender & Meta Tags (SEO)

**Goal**: Verify prerendered HTML is served to bots, meta tags are correct, and example pages are properly prerendered.

```
INSTRUCTIONS:

1. Open a new browser page

2. TEST: Example page prerender (Googlebot)
   - Use evaluate_script to fetch with Googlebot user-agent:
     fetch('{{DEV_URL}}/examples/customer-service-representative', {
       headers: { 'User-Agent': 'Googlebot/2.1' }
     }).then(r => r.text())
   - VERIFY: Response contains "Prerendered:" HTML comment
   - VERIFY: Response contains full resume text (e.g., "Customer Service Representative")
   - VERIFY: Response does NOT contain "animate-pulse" (LoadingSkeleton)
   - VERIFY: Response contains FAQ section content
   - VERIFY: img src/srcSet contain "supabase.co" CDN URLs (NOT "/docs/templates/modern-no-icons.png")
   - VERIFY: No <meta name="robots" content="noindex"> tag

3. TEST: Second example page prerender
   - Same test for: {{DEV_URL}}/examples/software-engineer
   - VERIFY same criteria as above

4. TEST: Blog page prerender
   - Fetch {{DEV_URL}}/blog/claude-resume-prompts with Googlebot UA
   - VERIFY: Prerendered HTML present
   - VERIFY: Page-specific meta description (not generic "EasyFreeResume is a 100% free resume builder")
   - VERIFY: No duplicate meta tags (count occurrences of <meta name="description")
   - VERIFY: No "localhost" in any URL

5. TEST: Keywords page prerender
   - Fetch {{DEV_URL}}/resume-keywords/software-engineer with Googlebot UA
   - VERIFY: Prerendered HTML present
   - VERIFY: Title matches CTR-optimized format (should contain "Resume Keywords" and "ATS")

6. TEST: Homepage meta tags
   - Fetch {{DEV_URL}}/ with Googlebot UA
   - VERIFY: Title starts with "EasyFreeResume"
   - VERIFY: Only ONE <meta name="description"> tag
   - VERIFY: og:image, og:title, twitter:card present

7. TEST: Protected pages render correctly (spot check)
   - Navigate browser to {{DEV_URL}}/blog/claude-resume-prompts
   - VERIFY: Full content loads, no errors
   - Navigate to {{DEV_URL}}/free-resume-builder-no-sign-up
   - VERIFY: Page loads, CTA visible
   - SCREENSHOT both pages

REPORT: For each fetch test, report the exact meta title and description found. Flag any duplicates, localhost URLs, or missing prerender.
```

---

## Agent 2B: Sitemap & Page Content Verification

**Goal**: Verify sitemap correctness and that key pages render properly for real users.

```
INSTRUCTIONS:

1. Open a new browser page

2. TEST: Sitemap XML
   - Fetch {{DEV_URL}}/sitemap-static.xml
   - VERIFY: Valid XML (no parse errors)
   - Count total <url> entries — should be ~120
   - VERIFY: Blog posts present (search for "/blog/claude-resume-prompts")
   - VERIFY: Example pages present (search for "/examples/customer-service-representative")
   - VERIFY: Keyword pages present (search for "/resume-keywords/")
   - VERIFY: NO redirect slugs present:
     - /blog/software-engineer-resume-keywords should NOT be in sitemap
     - /blog/customer-service-resume-keywords should NOT be in sitemap
     - /blog/zety-vs-easy-free-resume should NOT be in sitemap
   - VERIFY: No duplicate URLs

3. TEST: Example page renders for real users
   - Navigate to {{DEV_URL}}/examples/customer-service-representative
   - VERIFY: Page loads with full content (not skeleton)
   - VERIFY: Resume preview image visible
   - VERIFY: Bullet point bank section present
   - VERIFY: FAQ section present and expandable
   - VERIFY: "Edit This Template" button visible
   - VERIFY: Related examples section at bottom
   - VERIFY: No console errors
   - SCREENSHOT

4. TEST: Second example page
   - Navigate to {{DEV_URL}}/examples/internship
   - Same checks as above
   - SCREENSHOT

5. TEST: Keywords page renders
   - Navigate to {{DEV_URL}}/resume-keywords/customer-service
   - VERIFY: Keywords organized in categories
   - VERIFY: Before/after example section present
   - VERIFY: FAQ section present
   - SCREENSHOT

6. TEST: Blog page renders
   - Navigate to {{DEV_URL}}/blog/best-free-resume-builders-2026
   - VERIFY: Full article content loads
   - VERIFY: No broken images or layout issues
   - SCREENSHOT

7. TEST: Templates hub page
   - Navigate to {{DEV_URL}}/templates
   - VERIFY: All template cards visible with images
   - VERIFY: Filter bar present
   - VERIFY: Job examples section present below templates
   - SCREENSHOT

8. TEST: Console error sweep
   - Navigate through these pages and check for console errors at each:
     {{DEV_URL}}/
     {{DEV_URL}}/templates
     {{DEV_URL}}/examples
     {{DEV_URL}}/resume-keywords
     {{DEV_URL}}/blog
   - Report any console errors found

REPORT: List every check as PASS/FAIL with screenshots. Report exact URL count from sitemap.
```

---

## Agent 3A: Editor Features & Document Settings

**Goal**: Test the new editor features: document settings panel, grouped-list section, collapse animations, save flow.

```
INSTRUCTIONS:

1. Open a new browser page and navigate to {{DEV_URL}}

2. TEST: Create a new resume
   - Navigate to {{DEV_URL}}/templates
   - Click "Use Template" on any template (prefer Modern or ATS)
   - VERIFY: Editor opens
   - SCREENSHOT the initial editor state

3. TEST: Document Settings Panel
   - Look for a Settings panel or gear icon in the editor sidebar
   - VERIFY: Panel is present and collapsible
   
   a) Accent Color:
   - Click through 3-4 preset color swatches
   - VERIFY: Preview updates with the new accent color each time
   - Enter a custom hex value (e.g., #FF5733)
   - VERIFY: Preview updates with custom color
   - SCREENSHOT with custom color applied
   
   b) Font Selector:
   - Open the font dropdown
   - VERIFY: 15 fonts visible in 3 groups (Sans Serif, Serif, Classic)
   - Select "Playfair Display" (or any serif font)
   - VERIFY: Preview font changes
   - SCREENSHOT
   
   c) Persistence:
   - Note the current accent color and font
   - Trigger a save (Ctrl+S or auto-save)
   - Reload the page
   - VERIFY: Settings are restored after reload
   - SCREENSHOT

4. TEST: Grouped-List Section
   - Click "Add Section" in the editor
   - Select "Grouped List" from the section type picker
   - VERIFY: Grouped list editor appears
   - Add a group: Label = "Languages", Items = "Python, JavaScript, Go"
   - Add another group: Label = "Tools", Items = "Docker, Git, AWS"
   - VERIFY: Both groups visible in editor
   - VERIFY: Preview shows grouped list formatted correctly
   - SCREENSHOT
   - Delete the second group
   - VERIFY: Only first group remains

5. TEST: Section Collapse/Expand
   - Find an Experience or Education section
   - Click the collapse button/chevron
   - VERIFY: Section collapses with smooth animation (not instant)
   - VERIFY: Content is hidden, header still visible
   - Click to expand
   - VERIFY: Smooth expand animation
   - SCREENSHOT both states

6. TEST: Save & Download
   - Make some content changes (edit a bullet point)
   - VERIFY: Save indicator shows "Saving..." with pulse animation
   - VERIFY: "Saved" confirmation appears with accent flash
   - Click Download PDF
   - VERIFY: PDF generates successfully
   - VERIFY: PDF reflects the accent color and font settings chosen earlier
   - SCREENSHOT after download

7. TEST: Editor sidebar collapsed mode
   - If sidebar has a collapse toggle, click it
   - VERIFY: Collapsed state shows only icons (larger, with tooltips)
   - Hover over an icon → verify tooltip appears
   - SCREENSHOT

REPORT: List every check as PASS/FAIL with screenshots. Flag any settings that don't persist or don't appear in PDF.
```

---

## Agent 3B: Gallery UX, Accessibility, Mobile

**Goal**: Test templates gallery interactions, accessibility attributes, and mobile responsiveness.

```
INSTRUCTIONS:

1. Open a new browser page

2. TEST: Templates gallery filter bar
   - Navigate to {{DEV_URL}}/templates
   - VERIFY: Filter pills visible (category names)
   - Click a filter → VERIFY only matching templates shown
   - Click another filter → VERIFY templates change
   - Clear filter → VERIFY all templates shown again
   - SCREENSHOT with filter active

3. TEST: Template card interactions
   - Hover over a template card
   - VERIFY: Lift effect and shadow change on hover
   - SCREENSHOT the hover state

4. TEST: Job Examples Section on templates page
   - Scroll down on /templates to the job examples area
   - VERIFY: Job example cards visible with preview images
   - VERIFY: Category filtering works for examples
   - Click a job example → VERIFY navigates to /examples/{slug}
   - SCREENSHOT

5. TEST: Accessibility — Modal dialogs
   - Navigate to {{DEV_URL}}/templates
   - Click a template to open preview modal
   - Use evaluate_script to check:
     document.querySelector('[role="dialog"]') !== null
     document.querySelector('[aria-modal="true"]') !== null
   - VERIFY: Both exist
   - Press Escape → VERIFY modal closes
   - SCREENSHOT

6. TEST: Accessibility — Focus rings
   - Navigate to {{DEV_URL}} and create/open a resume in the editor
   - Use evaluate_script to check for focus-visible styles:
     Check elements with class containing "focus-visible" or "focus:"
   - Tab through the editor buttons
   - VERIFY: Focus rings visible on interactive elements
   - SCREENSHOT a focused element

7. TEST: Mobile viewport — Homepage
   - Use emulate tool to set iPhone 14 viewport (390x844)
   - Navigate to {{DEV_URL}}/
   - VERIFY: Hero section responsive, no horizontal overflow
   - VERIFY: Navigation hamburger menu present
   - VERIFY: CTA buttons stack vertically
   - SCREENSHOT

8. TEST: Mobile viewport — Templates gallery
   - Still in mobile viewport
   - Navigate to {{DEV_URL}}/templates
   - VERIFY: Template cards in single column
   - VERIFY: Filter bar scrollable horizontally
   - SCREENSHOT

9. TEST: Mobile viewport — Editor
   - Open a resume in the editor (mobile viewport)
   - VERIFY: Mobile action bar visible at bottom
   - VERIFY: Can access Save and Download functions
   - SCREENSHOT

10. TEST: Mobile viewport — Example page
    - Navigate to {{DEV_URL}}/examples/customer-service-representative
    - VERIFY: Content readable, no overflow
    - VERIFY: FAQ accordion works on touch
    - SCREENSHOT

11. TEST: ComparisonTable mobile
    - Navigate to {{DEV_URL}}/blog/flowcv-vs-easy-free-resume (or any comparison blog)
    - VERIFY: Comparison table shows as stacked cards on mobile (not cramped table)
    - SCREENSHOT

12. TEST: Privacy policy updated
    - Navigate to {{DEV_URL}}/privacy-policy
    - Search for "PostHog" text on page
    - VERIFY: PostHog mentioned in analytics/tracking section
    - SCREENSHOT

REPORT: List every check as PASS/FAIL with screenshots. Flag any a11y missing attributes or mobile layout breaks.
```

---

## Post-Test Checklist

After all 6 agents complete, the orchestrating session should:

1. **Collect all FAIL items** from agent reports into a single list
2. **Categorize by severity**:
   - P0 (blocks release): PDF generation failures, data loss, broken auth
   - P1 (must fix before prod): SEO regressions, broken prerender, missing meta tags
   - P2 (can ship, fix later): Visual polish, minor a11y gaps, mobile edge cases
3. **Cross-reference double-coverage**: Compare Agent A vs Agent B results for each pair. Flag any disagreements.
4. **Create GitHub issues** for any P0/P1 failures
5. **Update PR #463** with test results summary

---

## Analytics Verification (Manual)

If `VITE_POSTHOG_KEY` is set, after running the agents:

1. Open PostHog dashboard → Live Events
2. Verify these events appeared:
   - `$pageview` (multiple, from agent navigation)
   - `template_selected` (from template selection tests)
   - `resume_created` (from resume creation tests)
   - `pdf_downloaded` (from PDF download tests)
3. Check Session Replay — verify recordings exist with masked inputs

---

## Quick Reference: Key URLs to Test

| Page | URL | Why |
|------|-----|-----|
| Homepage | `/` | Protected Tier 1, branded queries |
| Templates gallery | `/templates` | Complete redesign |
| Blog #1 traffic driver | `/blog/claude-resume-prompts` | Protected Tier 1 |
| Comparison blog | `/blog/flowcv-vs-easy-free-resume` | Protected Tier 2, mobile table |
| Free builder landing | `/free-resume-builder-no-sign-up` | Protected Tier 1 |
| Example page | `/examples/customer-service-representative` | Was failing prerender |
| Example page 2 | `/examples/internship` | High impressions (535), pos 55.1 |
| Keyword page | `/resume-keywords/customer-service` | Approaching page 1 |
| Keyword page 2 | `/resume-keywords/software-engineer` | Approaching page 1 |
| Sitemap | `/sitemap-static.xml` | Auto-generated blog posts |
| About | `/about` | Position 1 for brand |
| Privacy | `/privacy-policy` | Updated for PostHog |
