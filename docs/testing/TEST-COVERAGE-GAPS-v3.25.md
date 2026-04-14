# v3.25.0 Automated Test Coverage Gaps

Audit of all test coverage gaps for new/changed code on the `stg` branch. Organized by priority for a dedicated agent session to implement.

---

## Executive Summary

| Area | Coverage | Gaps |
|------|----------|------|
| Template framework (Python models/registry/renderer) | **Excellent** | Minor: margin field tests in renderer |
| HTML/LaTeX rendering | **Excellent** | None |
| Sitemap generation | **Good** | File I/O untested |
| Prerender route building | **Good** | `cleanPrerenderedHtml()` and network blocking untested |
| app.py integration layer | **Partial** | Settings propagation, `_copy_black_icons()`, CLI args |
| New frontend components (9 of 10) | **Missing** | Only DocumentSettingsPanel has tests |
| Editor hooks (settings threading) | **Partial** | 3 hooks have tests but zero documentSettings coverage |
| Analytics (PostHog) | **Zero** | Entire module untested |
| SEO helpers | **Zero** | Title/description generators untested |
| Cross-link helpers | **Zero** | All 4 functions untested |

---

## Priority 1: CRITICAL — Could cause runtime failures

### 1.1 `useSaveIntegration.ts` — NO TESTS AT ALL
- **File**: `src/hooks/editor/useSaveIntegration.ts` (172 lines)
- **Why critical**: Handles cloud save with documentSettings, save-before-action pattern, storage limit detection
- **Tests needed**:
  - Save includes documentSettings in payload
  - Settings change triggers save (hash-based change detection)
  - Storage limit modal shown when limit reached
  - Save-before-download pattern works

### 1.2 `useResumeCreate.ts` — NO TESTS AT ALL
- **File**: `src/hooks/useResumeCreate.ts` (149 lines)
- **Why critical**: Creates resumes via API, enforces 5-resume limit, navigates to editor
- **Tests needed**:
  - Successful creation navigates to `/editor/{id}`
  - 5-resume limit shows error toast and navigates to `/my-resumes`
  - Double-click prevention (creating flag)
  - Import with contactInfo/sections uses `/api/resumes` endpoint
  - Standard create uses `/api/resumes/create` endpoint

### 1.3 `_copy_black_icons()` in app.py — NO TESTS
- **File**: `app.py:914-923`
- **Why critical**: ATS, Student, UK CV templates need black icon variants; if missing, PDFs have broken images
- **Tests needed**:
  - Creates `icons/black` directory in session dir
  - Copies all base contact icon PNG files
  - Handles missing source directory gracefully

### 1.4 `cleanPrerenderedHtml()` — NO TESTS
- **File**: `scripts/prerender.ts:186-222`
- **Why critical**: Strips duplicate meta tags from prerendered HTML. If broken, Googlebot sees wrong descriptions (Mistake #7 repeat)
- **Tests needed**:
  - Removes non-data-rh meta tag when data-rh equivalent exists
  - Keeps original meta tag when NO data-rh equivalent exists
  - Strips HTML comment blocks (SEO Meta Tags, Open Graph, Twitter)
  - Replaces localhost URLs with production origin
  - Handles edge cases: no meta tags, all data-rh, mixed

### 1.5 Settings propagation in app.py — UNTESTED
- **Files**: `app.py` lines 2008, 2214-2255, 2326, 3353, 3473
- **Why critical**: Document settings (accent color, font, page numbers) are threaded through create/save/generate but never verified end-to-end
- **Tests needed**:
  - `create_resume()` persists settings from template YAML
  - `save_resume()` persists modified settings
  - Settings change alone triggers save (hash includes settings)
  - `generate_pdf_for_saved_resume()` reads settings from DB and passes to renderer
  - `generate_thumbnail_for_resume()` reads settings from DB

---

## Priority 2: HIGH — Feature completeness

### 2.1 New Frontend Components — 9 UNTESTED

| Component | File | Lines | Key behaviors to test |
|-----------|------|-------|----------------------|
| **GroupedListSection** | `src/components/GroupedListSection.tsx` | 144 | Group CRUD (add/delete/edit label/items), mobile collapse, resize handler |
| **TemplateCard** | `src/components/TemplateCard.tsx` | 175+ | Selection state, preview trigger, loading/error states, keyboard nav |
| **TemplateFilterBar** | `src/components/TemplateFilterBar.tsx` | 95+ | Filter pills, active state, count display, clear filter |
| **TemplatePreviewModal** | `src/components/TemplatePreviewModal.tsx` | 300+ | Carousel nav, keyboard shortcuts (arrows/Escape), swipe, image cross-fade |
| **JobExamplesSection** | `src/components/JobExamplesSection.tsx` | 200+ | Category filtering, card grid, responsive layout |
| **JobExampleCard** | `src/components/JobExampleCard.tsx` | — | Image loading with fallback, responsive dimensions |
| **ViewSwitcher** | `src/components/ViewSwitcher.tsx` | 74 | View toggle (All/Templates/Examples), responsive labels, counts |
| **analytics.ts** | `src/lib/analytics.ts` | 152 | Lazy loading, queue system, requestIdleCallback, graceful no-op when key unset |
| **GroupedListVisual** | `src/components/sectionVisuals/GroupedListVisual.tsx` | 20 | Low priority — purely presentational SVG |

### 2.2 Existing Hook Tests Missing documentSettings Coverage

| Hook test file | What's missing |
|---------------|----------------|
| `useEditorActions.test.ts` | Zero mentions of documentSettings — need tests that PDF generation includes settings |
| `useFileOperations.test.ts` | Zero mentions of documentSettings — need tests that YAML export includes settings |
| `useResumeLoader.test.ts` | Zero mentions of documentSettings — need tests that cloud resume load restores settings |

### 2.3 SEO Helpers — ZERO TESTS
- **File**: `src/utils/seoHelpers.ts`
- **Functions untested**:
  - `generateJobPageTitle()` — CTR-optimized title formula with year interpolation
  - `generateJobPageDescription()` — description with top skills extraction and keyword count

### 2.4 Cross-Link Helpers — ZERO TESTS
- **File**: `src/utils/crossLinkHelpers.ts`
- **Functions untested**:
  - `getMatchingExampleSlug()` — manual override + direct slug matching
  - `getMatchingKeywordSlug()` — same pattern
  - `getKeywordJobTitle()` — slug lookup
  - `getExampleJobTitle()` — slug lookup

### 2.5 resume_generator.py CLI args — UNTESTED
- **File**: `resume_generator.py:541-566`
- **What's missing**: `--pdf-options` JSON argument parsing and application to pdfkit options

### 2.6 Renderer Settings Merge — PARTIAL
- **File**: `tests/test_template_renderer.py`
- **What's missing**: Tests for margin overrides (margin_top/bottom/left/right), footer_font_name, footer_font_size in `_merge_user_settings()`

---

## Priority 3: MEDIUM — Nice-to-have improvements

### 3.1 sectionService grouped-list factory
- `createDefaultSection('grouped-list')` not tested in `sectionService.test.ts`
- Should verify default content structure `[{ label: "", items: [] }]`

### 3.2 yamlLoader.ts
- `convertToEditorFormat()` with grouped-list type mapping untested
- `loadJobExample()` caching and TTL logic untested

### 3.3 blogPosts.ts
- `getActiveBlogPosts()` — tested indirectly via sitemap/prerender tests, but no dedicated unit test

### 3.4 Prerender network blocking
- `context.route()` interception logic (transparent PNG for images, abort for non-images)
- Hard to unit test (Playwright-specific), but could have integration test

### 3.5 Sitemap file I/O
- `writeSitemap()` directory creation and file writing
- Error handling paths

---

## Test File Inventory

### Files WITH tests (existing)

**Frontend:**
- `src/__tests__/DocumentSettingsPanel.test.tsx` (343 lines) — comprehensive
- `src/__tests__/TemplateCarousel.test.tsx` — image loading
- `src/__tests__/templatesService.test.ts` (80 lines) — fetch templates
- `src/__tests__/usePreview.test.ts` — preview hook
- `src/__tests__/prerenderRoutes.test.ts` — route building
- `src/__tests__/generateSitemap.test.ts` — XML generation
- `src/__tests__/sitemap.test.ts` — deduplication, hreflang
- `src/components/__tests__/` — 6 a11y test files (IconManager, dialogs, modals)
- `src/hooks/editor/__tests__/` — 10 hook test files

**Backend:**
- `tests/test_template_models.py` (205 lines) — comprehensive
- `tests/test_template_registry.py` (241 lines) — comprehensive
- `tests/test_template_renderer.py` (186 lines) — good, minor gaps
- `tests/test_template_html_rendering.py` (416 lines) — comprehensive
- `tests/test_resume_crud.py` (91 lines) — partial settings coverage
- `tests/test_latex_escaping.py` — comprehensive

### Files MISSING tests (need creation)

**Frontend (new files):**
- `src/components/__tests__/GroupedListSection.test.tsx`
- `src/components/__tests__/TemplateCard.test.tsx`
- `src/components/__tests__/TemplateFilterBar.test.tsx`
- `src/components/__tests__/TemplatePreviewModal.test.tsx`
- `src/components/__tests__/JobExamplesSection.test.tsx`
- `src/components/__tests__/ViewSwitcher.test.tsx`
- `src/lib/__tests__/analytics.test.ts`
- `src/hooks/__tests__/useResumeCreate.test.ts`
- `src/hooks/editor/__tests__/useSaveIntegration.test.ts`
- `src/utils/__tests__/seoHelpers.test.ts`
- `src/utils/__tests__/crossLinkHelpers.test.ts`
- `src/utils/__tests__/yamlLoader.test.ts`
- `scripts/__tests__/cleanPrerenderedHtml.test.ts` (extract function for testability)

**Backend (new files):**
- `tests/test_copy_black_icons.py`
- `tests/test_settings_integration.py` (E2E settings pipeline)
- `tests/test_resume_generator_cli.py` (CLI argument tests)

---

## Handoff Notes for Implementation Agent

1. **Framework**: Frontend uses Vitest + React Testing Library. Backend uses pytest.
2. **Pattern**: Follow existing test patterns — check `DocumentSettingsPanel.test.tsx` for component test style, `useEditorActions.test.ts` for hook test style.
3. **Mocking**: Most hook tests mock `apiClient`, `useAuth`, `useNavigate`. See existing tests for patterns.
4. **Running tests**: `cd resume-builder-ui && npx vitest run` for frontend, `python -m pytest tests/` for backend.
5. **Don't over-test**: Skip purely presentational components (GroupedListVisual). Focus on logic and integration points.
6. **Estimated effort**: Priority 1 items = ~500-700 lines of test code. Priority 2 items = ~800-1000 lines. Full coverage = ~2 days of focused work.
