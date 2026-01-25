# Changelog

All notable changes to this project will be documented in this file.

## [3.11.2] - 2026-01-25

### 🐛 Bug Fixes

- **test:** Simplify max_workers test to check actual pool value

### 🚜 Refactor

- **test:** Address PR review comments
- **test:** Mock atexit.register to prevent side effects
- **app:** Extract template mapping to module-level constant

### ⚡ Performance

- **pdf:** Replace ProcessPoolExecutor with ThreadPoolExecutor

### 🧪 Testing

- **pdf:** Add comprehensive PDF generation tests

### ⚙️ Miscellaneous Tasks

- Add tests/ and pyproject.toml to paths filter
- **version:** Update tests python version to 3.13 match docker container in prod

## [3.11.1] - 2026-01-25

### 🐛 Bug Fixes

- **blog:** Make year references dynamic in BlogIndex titles

## [3.11.0] - 2026-01-25

### 🚀 Features

- **seo:** Make year references dynamic using CURRENT_YEAR constant

### ⚙️ Miscellaneous Tasks

- **blog:** Update publish dates from 2025 to January 2026

## [3.10.0] - 2026-01-25

### 🚀 Features

- **footer:** Add links

### 🚜 Refactor

- **footer:** Use semantic HTML and reduce code duplication

### 📚 Documentation

- **blog:** Refresh 21 blog posts for 2026

### ⚙️ Miscellaneous Tasks

- **sitemap:** Update lastmod dates for refreshed blog posts

## [3.9.0] - 2026-01-25

### 🚀 Features

- **ads:** Add useWordCount hook for blog ad word-gating
- **ads:** Add ad infrastructure components with CLS prevention
- **ads:** Add in-content ads to SEO landing pages
- **ads:** Add ads to blog pages
- **ads:** Add in-feed ads to template gallery
- **ads:** Add optional desktop-only editor sidebar ad
- **ads:** Add feature flag and real AdSense slot IDs
- Parallelize resume icon duplication
- **auth:** Add proactive JWT token refresh before expiry
- **ui:** Add loading animations to Edit Resume and Preview buttons
- **ui:** Add loading animation to Preview button on editor page
- **seo:** Add AI crawler directives and schema generators
- **seo:** Add SEO-rich templates page
- **blog:** Add AI resume writing guides and prompts
- **blog:** Add competitor comparison pages
- **seo:** Add template style landing pages
- **seo:** Add CV templates page and job examples pSEO
- **ui:** Add showHeader prop to TemplateCarousel
- **seo:** Expand footer with comprehensive internal linking
- **seo:** Expand footer with comprehensive internal linking
- **editor:** Improve Edit This Template flow
- **blog:** Add copy button to AI prompt boxes
- **ui:** Improve TemplateSelectionModal UX with larger previews
- **seo:** Integrate TemplateSelectionModal into job example pages
- **seo:** Add 15 missing job example YAML files
- **seo:** Add hreflang tags to sitemap for CV/resume pages
- **types:** Add github field to resume contact types

### 🐛 Bug Fixes

- **ads:** Address PR review feedback
- **ads:** Address PR review feedback
- **ads:** Correct useWordCount test for content change recalculation
- **duplicate:** Address PR review feedback for icon parallelization
- **api:** Migrate user_preferences on anon-to-auth conversion
- **api:** Add exc_info to logging and improve test coverage
- **api:** Use atomic RPC for preference migration
- **ui:** Address PR review feedback for loading animations
- **blog:** Use Link component for internal navigation in ZetyVsEasyFreeResume
- **seo:** Address PR review comments for CTA buttons and caching
- **seo:** Remove duplicate header and fix CTA on TemplatesPage
- **seo:** Remove duplicate headers from template style pages
- **seo:** Remove redundant hero CTAs from template style pages
- **ads:** Check feature flag in wrapper components, not just AdContainer
- **editor:** Use correct field name in convertToEditorFormat
- **ui:** Add explicit type="button" to ConversionPromptModal buttons
- **editor:** Return description as array in convertToEditorFormat
- **editor:** Return description as array in convertToEditorFormat
- **docs:** Correct Quick Start anchor link for emoji header
- **docs:** Use non-destructive db push for migrations
- **ui:** Handle block-level elements in CopyablePrompt text extraction
- **build:** Resolve err
- **docker:** Ensure templates available in docker
- **examples:** Address PR review feedback for job examples
- **yamlLoader:** Use title field for project name instead of company
- **blog:** Center star ratings in Quick Verdict section

### 🚜 Refactor

- **auth:** Improve type safety with Session type
- **blog:** Use Helmet for schema injection in comparison pages
- **e2e:** Address PR review feedback for sitemap tests
- **e2e:** Parallelize sitemap tests and pre-compute URLs
- **ads:** Extract duplicate feature flag logic into shared utility
- **ui:** Extract template loading into useCallback
- **seo:** Deduplicate resume creation in JobExamplePage
- **sitemap:** Address PR review feedback

### 📚 Documentation

- **ads:** Add enablement guide and refactoring issue
- Fix license reference in README
- Revamp README with product hero and 60-second local run
- Expand Quick Start with prerequisites and Supabase setup
- Rename project title to EasyFreeResume in README

### ⚡ Performance

- **ads:** Optimize AdSense script loading
- **docker:** Optimize build with cache mounts and selective COPY
- **docker:** Optimize build with cache mounts and selective COPY

### 🧪 Testing

- **api:** Convert edge case tests to API contract tests
- **ui:** Use data-testid for more robust test selectors
- **e2e:** Add sitemap 404 validation test

### ⚙️ Miscellaneous Tasks

- **seo:** Add routes and update sitemap for all new pages
- Remove job example generator scripts from this branch

## [3.8.0] - 2026-01-21

### 🚀 Features

- **seo:** Update Zety comparison article for 2026
- **seo:** Enhance no-experience resume guide with career-switcher example
- **seo:** Enhance Reddit recommendations page for 2026
- **seo:** Strengthen actual-free page with competitor comparison
- **seo:** Enhance JobKeywordsPage template with new sections
- **seo:** Enhance software engineer keywords with rich content
- **seo:** Enhance data-analyst and product-manager keywords with rich content
- **seo:** Add UK CV market pages
- **seo:** Add www to apex host canonicalization

### 🐛 Bug Fixes

- **seo:** Add 301 redirect for software engineer keywords page
- **a11y:** Use semantic ul elements for bulleted lists
- **seo:** Correct broken internal link to ATS optimization guide
- **seo:** Add missing UK CV pages to sitemap
- **seo:** Add assertion to prevent CANONICAL_HOST misconfiguration
- **a11y:** Hide decorative emojis from screen readers
- **seo:** Use exact-match for www host canonicalization

### 🚜 Refactor

- **blog:** Extract date formatting options constant

## [3.7.0] - 2026-01-18

### 🚀 Features

- **editor:** Improve drag-and-drop UX with full-width headers and position selection
- **editor:** Improve drag-and-drop UX with full-width headers and position selection
- **editor:** Unify drag-and-drop with single DndContext and improved visual feedback
- **editor:** Implement intent-based drag-and-drop UX
- **editor:** Add SVG wireframe components for section types
- **editor:** Upgrade SectionTypeModal to visual grid layout
- **editor:** Upgrade insert position to segmented control
- **editor:** Upgrade insert position to segmented control
- **shared:** Add ActionIcon, GhostButton, InlineTextEditor components
- **editor:** Add confirm button to SectionTypeModal
- **help:** Upgrade help content with visual cards and device-specific tips

### 🐛 Bug Fixes

- **editor:** Address PR review comments for drag-and-drop
- **editor:** Scroll to correct position after adding section
- **editor:** Address PR review feedback
- **editor:** Address PR review feedback for SectionHeader
- **editor:** Save section title on blur by passing value directly
- **editor:** Validate section title before saving
- **editor:** Show drag handles on touch devices
- **editor:** Remove redundant sign-in button and fix save status overlap
- **editor:** Remove obsolete tablet floating toolbar
- **editor:** Enable touch drag by adding touch-action and tuning sensor

### 🚜 Refactor

- **editor:** Extract GripDots and DragTooltip shared components
- **editor:** Extract liftedPreviewClasses constant for DragOverlay
- **editor:** Enhance section wireframes with realistic layouts
- **editor:** Modernize SectionHeader with InlineTextEditor
- **editor:** Replace Add Entry buttons with GhostButton
- **editor:** Update GenericSection and IconListSection to use SectionHeader
- **editor:** Remove inline delete confirmation from SectionHeader
- **shared:** Remove redundant setEditValue calls in InlineTextEditor
- **editor:** Use Tailwind touch-none class instead of inline style
- **help:** Address PR review feedback

### 🧪 Testing

- **editor:** Wrap section tests in DndContext for drag-and-drop support
- **editor:** Update SectionTypeModal tests for grid layout
- **editor:** Remove EditorToolbar tests from EditorContent
- **editor:** Add test for idle save status in EditorHeader

## [3.6.0] - 2026-01-08

### 🚀 Features

- **editor:** Add useItemDragDrop hook for item-level reordering
- **editor:** Add SortableItem component for item-level drag handles
- **editor:** Add ItemDndContext wrapper for item DnD setup
- **editor:** Add handleReorderEntry to useSectionManagement
- **editor:** Update EditorContent with section IDs and reorder handler
- **ExperienceSection:** Add item-level drag-and-drop reordering
- **EducationSection:** Add item-level drag-and-drop reordering
- **IconListSection:** Add item-level drag-and-drop reordering
- **GenericSection:** Add item-level drag-and-drop for list types

### 🐛 Bug Fixes

- **editor:** Resolve TypeScript errors in item DnD integration

### 🚜 Refactor

- **editor:** Update useSectionDragDrop to filter item-level drags

### 🧪 Testing

- **EditorContent:** Update test for new section-X ID format

## [3.5.0] - 2026-01-07

### 🚀 Features

- **editor:** Create centralized type definitions (TASK-001)
- **services:** Create section service with comprehensive tests (TASK-002, TASK-003)
- **services:** Add validation service with 98.61% coverage
- **services:** Add YAML service with comprehensive tests
- **yamlService:** Add YAML structure validation on import
- **hooks:** Create useModalManager hook with 15 modal states
- **hooks:** Create useEditorState hook with comprehensive tests
- **hooks:** Create useContactForm hook with comprehensive tests
- **hooks:** Create useSectionDragDrop hook with comprehensive tests
- **hooks:** Create useSectionNavigation hook with comprehensive tests
- **hooks:** Create useResumeLoader hook with comprehensive tests
- **hooks:** Create useTourFlow hook with comprehensive tests
- **hooks:** Create useSectionManagement hook for section CRUD
- **hooks:** Create useFileOperations hook for YAML import/export
- **hooks:** Create useEditorActions hook for download/preview/start-fresh
- **editor:** Create EditorHeader component
- **editor:** Create EditorModals component
- **editor:** Create EditorContent component
- **editor:** Create useSaveIntegration hook
- **editor:** Create useEditorEffects hook
- **auth:** Add dedicated /auth/callback route for OAuth handling
- **auth:** Add dedicated /auth/callback route for OAuth handling
- **Auth:** Add proactive token refresh and suspend beforeunload during OAuth

### 🐛 Bug Fixes

- **validation:** Improve LinkedIn URL regex accuracy
- **validation:** Add robust type checking for YAML structure
- **tests:** Correct DeleteTarget structure in useModalManager tests
- **useContactForm:** Prevent stale closure on contactInfo.name
- **useContactForm:** Remap indices when removing social links
- **useContactForm:** Implement index remapping on social link removal
- **import:** Update
- **useSectionNavigation:** Add null check for sectionRefs.current
- **useResumeLoader:** Add YAML structure validation before type assertion
- **useResumeLoader:** Add API resume data validation before use
- **useTourFlow:** Prevent memory leak in idle tooltip auto-dismiss
- **tourFlow:** Remove log
- **test:** Fix useTourFlow tests for Promise mock and removed log
- **hooks:** Expose setTemporaryTitle for controlled input handling
- **useFileOperations:** Use React.Dispatch types for state setters
- **toast:** Improve readability
- **Editor:** Correct hook dependency order for useCloudSave
- **Editor:** Resolve stale closure and no-op setter bugs
- **validation:** Allow null for optional AI import fields
- **useResumeLoader:** Prevent multiple concurrent cloud load calls
- **EditorModals:** Handle undefined section name in delete message
- **EditorContent:** Use type guards in DragOverlay
- **type:** Add specific drag events
- **EditorContent:** Add aria-label to close button for accessibility
- Correct merge artifacts in useEditorActions and test expectations
- **useSaveIntegration:** Use proper default values instead of unsafe type assertion
- **useSaveIntegration:** Improve type safety and dependency arrays
- Resolve multiple issues from merge and type errors
- **useEditorActions:** Improve type safety in icon location search
- **types:** Resolve TypeScript build errors across editor components
- **useSaveIntegration:** Use value-based dependency for iconsForCloudSave memo
- **Auth:** Enhance backend auth error logging with context
- **Auth:** Enhance backend auth error logging with context

### 🚜 Refactor

- **yamlService:** Make icon-list processing generic
- **yamlService:** Improve type safety for item processing
- **yamlService:** Type contactInfo in YAMLImportResult
- **useModalManager:** Rename showModal to showSectionTypeModal
- **useEditorState:** Improve updateSection with functional updates and bounds checking
- **useEditorState:** Extract OriginalTemplateData type
- **useContactForm:** Fix stale state and consolidate updates
- **useContactForm:** Eliminate stale reads and extract validation
- **tests:** Add helper functions to reduce boilerplate in drag-drop tests
- **types:** Improve editor.ts type safety (TASK-001 enhancement)
- **sectionService:** Fix icon type mismatch and improve control flow
- **useModalManager:** Optimize useMemo dependencies
- **validationService:** Use improved LinkedIn validator in validatePlatformUrl
- **validationService:** Improve type safety in validateYAMLStructure
- **yamlService:** Consolidate icon processing for icon-list, experience, and education sections
- **tests:** Remove duplicate test and fix misleading test name
- **useSectionNavigation:** Extract scroll offset to named constant
- **useResumeLoader:** Use backend supportsIcons flag instead of hardcoding
- **useResumeLoader:** Improve error messages with context IDs
- **types:** Update UseSectionManagementReturn to include title editing
- **types:** Use proper React.Dispatch type for setTemporaryTitle
- **useEditorActions:** Improve code style
- **Editor:** Integrate all 10 extracted hooks
- **useModalManager:** Improve import confirm API clarity
- **SectionNavigator:** Remove duplicated status/sign-in UI
- **EditorHeader:** Remove unused default export
- **Editor:** Integrate EditorModals component
- **Editor:** Integrate EditorContent component
- **Editor:** Finalize refactor using extracted hooks
- **sectionService:** Use typed SectionType instead of string
- **useContactForm:** Use functional updaters to fix stale closure
- **useEditorActions:** Use type guards for section type checking
- **useEditorActions:** Remove duplicate validateLinkedInUrl function
- **AuthCallback:** Use config object for error messages

### ⚡ Performance

- **services:** Optimize getUniqueDefaultName with Set lookup
- **Editor:** Memoize onSectionAdded callback with useCallback

### 🧪 Testing

- **hooks:** Add comprehensive tests for useSectionManagement
- **hooks:** Add comprehensive tests for useFileOperations
- **EditorModals:** Add comprehensive tests
- **EditorContent:** Add comprehensive tests
- **EditorContent:** Add integration and accessibility tests
- **auth:** Add unit tests for OAuth redirect logic
- **auth:** Add unit tests for OAuth redirect logic

### Merge

- Resolve conflict with editor-refactor branch

## [3.4.0] - 2026-01-05

### 🚀 Features

- **api:** Add blob/text response type support to apiClient

### 🐛 Bug Fixes

- **api:** Add type assertion for null return in handleResponse

### 🚜 Refactor

- **thumbnails:** Migrate thumbnail generation to use apiClient
- **download:** Migrate PDF download to use apiClient.postBlob
- **preview:** Migrate database mode preview to use apiClient.postBlob
- **api:** Improve blob error handling to preserve server messages

## [3.3.3] - 2026-01-04

### 🐛 Bug Fixes

- **auth:** Replace raw fetch() with apiClient in migration functions
- **auth:** Prevent duplicate anonymous migration calls in StrictMode

### 🚜 Refactor

- **auth:** Use type-safe error handling with instanceof checks

## [3.3.2] - 2026-01-04

### 🐛 Bug Fixes

- **auth:** Release Web Lock immediately to unblock multi-tab initialization

### 🚜 Refactor

- **auth:** Eliminate stale tokens by passing session from AuthContext
- **api:** Use apiClient in TemplateCarousel for automatic token refresh

## [3.3.1] - 2026-01-04

### 🐛 Bug Fixes

- **preview:** Render mobile PDF at device pixel ratio for crisp display

## [3.3.0] - 2026-01-04

### 🚀 Features

- **preview:** Add PDF.js for mobile preview rendering
- **utils:** Add mobile device detection utility
- **preview:** Add ?preview=true to PDF fetch requests
- **preview:** Create PDF.js mobile viewer component
- **preview:** Integrate PDF.js for mobile preview
- **preview:** Add download loading state and request deduplication
- **preview:** Add resume ID tracking ref for change detection
- **preview:** Detect and track resume ID changes in database mode

### 🐛 Bug Fixes

- **backend:** Support inline PDF display for mobile preview
- **preview:** Wrap callbacks in useCallback for stability
- **preview:** Convert blob URL to ArrayBuffer for PDF.js
- **preview:** Clear state when resumeId changes without revoking blob URL
- **editor:** Remove unused generating state
- **preview:** Calc container width outside for loop

### 🚜 Refactor

- **backend:** Extract preview request check to helper
- **config:** Move PDF.js worker config to main.tsx
- **preview:** Replace magic number with named constant
- **config:** Use Vite-native worker path resolution
- **preview:** Convert DOM manipulation to React state pattern
- **preview:** Remove eager cleanup effect to fix blob URL race condition
- **preview:** Simplify PDF loading message
- **preview:** Remove unused resumeIdChanged variable

### 📚 Documentation

- **preview:** Update cleanup comments to explain lazy cleanup strategy

### ⚙️ Miscellaneous Tasks

- **build:** Configure code splitting for PDF.js

### Ui

- **toast:** Remove old toast msg

## [3.2.0] - 2026-01-04

### 🚀 Features

- **preview:** Add abort signal support to generatePreviewPdf
- **preview:** Enhance usePreview hook with dedup, validation, and modes

### 🐛 Bug Fixes

- **api:** Add automatic token refresh retry on 401 errors
- **api:** Add non-null assertion for supabase in refreshSession
- **preview:** Address PR #155 review comments
- **typescript:** Resolve compilation errors in preview system
- **preview:** Address new PR review comments - cleanup and formatting
- **preview:** Resolve infinite loop and desktop sizing issues
- **preview:** Resolve modal height collapse and visual flashing
- **preview:** Stop infinite generation loop in MyResumes
- **preview:** Auto-generate preview on first open in Editor
- **preview:** Eliminate double generation on modal open
- **preview:** Add 30-second timeout to prevent hanging requests
- **preview:** Clear preview when switching between resumes in MyResumes
- **preview:** Clear stale preview to show loader in Editor
- **preview:** Add previewUrl to loading state dependency array
- **sitemap:** Remove /editor as the new route is /editor/{uuid}

### 🚜 Refactor

- **api:** Address PR review comments - reduce duplication
- **preview:** Redesign PreviewModal with mobile-first UX
- **editor:** Integrate enhanced usePreview hook features
- **myresumes:** Use usePreview hook in database mode
- **preview:** Include all dependencies per React best practices

### 📚 Documentation

- **preview:** Add comprehensive documentation for dependency omissions

### 🧪 Testing

- **preview:** Update tests for redesigned PreviewModal and usePreview
- **preview:** Use data-testid instead of brittle CSS selectors

## [3.1.0] - 2026-01-02

### 🚀 Features

- **styles:** Add CSS variables for component heights
- **tailwind:** Add spacing utilities for CSS variables
- **editor:** Update content padding to use CSS variables
- **editor:** Fix tablet toolbar positioning with CSS variable
- **pages:** Add bottom padding to prevent footer overlap

### 🐛 Bug Fixes

- **ui:** Remove unused import
- **editor:** Remove footer height from padding calculations
- **pages:** Remove unnecessary bottom padding
- **editor:** Correct tablet bottom padding for MobileActionBar

### 🚜 Refactor

- **context:** Remove isAtBottom state from EditorContext
- **editor:** Remove scroll detection logic
- **editor:** Remove separator bars
- **app:** Simplify footer to static positioning
- **footer:** Remove unused props interface

## [3.0.0] - 2026-01-02

### 🚀 Features

- **preview:** Create thumbnail bucket
- **seo:** Update ATS-Friendly template title and description for better CTR
- **seo:** Add centralized SEO title and description generators
- **seo:** Add getRelatedJobs() for internal linking mesh
- **seo:** Create RelatedJobsSection component for internal linking
- **seo:** Add Popular Resumes section to footer for site-wide linking
- **seo:** Display all 10 job pages on Resume Keywords Hub
- **seo:** Integrate dynamic titles and Related Jobs section

### 🐛 Bug Fixes

- **resume-create:** Apply social links migration in create endpoint
- **resume-load:** Apply social links migration in load endpoint
- **thumbnails:** Add cache-busting to prevent stale thumbnail display
- **thumbnails:** Add cache-busting to prevent stale thumbnail display
- **thumbnails:** Resolve merge conflicts - finalize cache-busting implementation
- **thumbnails:** Use consistent timestamp to fix auto-refresh polling
- **thumbnails:** Validate date before using for cache-busting timestamp
- **thumbnail-refresh:** Force refetch on MyResumes mount to fix stale cache
- **ui:** Center-align footer content on mobile for better visual appeal
- **ui:** Optimize footer layout for mobile space utilization
- **seo:** Address Gemini Code Assist review feedback
- **auth:** Add session to useCloudSave dependency array to prevent stale token usage
- **auth:** Clear debounce timer on AuthError to prevent retry loop
- **auth:** Clear cached session on 401/403 errors to prevent token reuse
- **auth:** Add cross-tab storage event listener for session sync
- **auth:** Fix sessionRef race condition with synchronous ref update
- **auth:** Add auth guard in Editor to prevent zombie UI state
- **auth:** Prevent infinite refresh loop in cross-tab storage listener
- **auth:** Fix sessionRef race condition with synchronous ref update
- **auth:** Add auth guard in Editor to prevent zombie UI state
- **auth:** Move initializeAuth after listener subscription and remove redundant session dep
- **auth:** Prioritize auth callback URL detection over session restoration
- **auth:** Eliminate race conditions with event-driven initialization
- **auth:** Remove unused util
- **ai-parser:** Sanitize education year field to prevent PDF render failures

### 🚜 Refactor

- **templates:** Migrate john_doe_no_icon.yml to use social_links
- **templates:** Migrate alex_rivera_data.yml to use social_links
- **seo:** Extract JobCategorySection component to follow DRY principle
- **cache-busting:** Use proper URL parsing for query params
- **auth:** Simplify initialization to trust Supabase completely [**BREAKING**]
- **validator:** Fix sanitizeEducationYear edge cases

### 📚 Documentation

- **seo:** Fix JSDoc comments to match implementation

### ⚡ Performance

- **thumbnails:** Use immutable cache directive for versioned assets

### 🧪 Testing

- Fix JobKeywordsPage tests by adding JOBS_DATABASE to mock
- Fix mock hoisting issue by moving objects into factory function

### ◀️ Revert

- **auth:** Remove Editor auth guard that blocked resume loading

## [2.0.1] - 2026-01-01

### 🚜 Refactor

- **test:** Consolidate Google User Data section tests

### 📚 Documentation

- **privacy:** Add Google OAuth data handling disclosures
- **privacy:** Add support email to contact section

### 🧪 Testing

- **privacy:** Add tests for Google OAuth compliance section

## [2.0.0] - 2026-01-01

### 🚀 Features

- **seo:** Optimize No Sign Up page title for instant PDF CTR
- **seo:** Optimize Zety comparison page for pricing queries
- **pseo:** Add TypeScript interfaces for job keywords data
- **pseo:** Add initial 10 tech jobs database with keywords
- **pseo:** Add helper functions for job data access
- **pseo:** Add FAQ generator and helper utilities for job pages
- **pseo:** Add dynamic JobKeywordsPage component for job-specific keywords
- **pseo:** Add dynamic route for job keywords pages
- **pseo:** Add automated sitemap generator for job pages
- **sitemap:** Use VITE_APP_URL environment variable for configurable base URL

### 🐛 Bug Fixes

- **legal:** Update Privacy Policy, Terms, and About for cloud accounts
- **seo:** Resolve customer service keywords cannibalization with 301 redirect
- **tests:** Update PrivacyPolicy test date and remove dead code
- **tests:** Update PrivacyPolicy test to match updated date
- **build:** Remove unused CustomerServiceResumeKeywords import
- **pseo:** Add XML escaping to sitemap generation to prevent malformed XML
- **seo:** Change DownloadCTA default href from /editor to /templates
- **seo:** Change JobKeywordsPage hero CTA from /editor to /templates
- **build:** Write sitemap to both public/ and dist/ directories
- **resume-count:** Change color to amber from red
- Default to prod for sitemap base url

### 🚜 Refactor

- **pseo:** Modularize job keywords data for scalability
- **pseo:** Replace generic example generator with custom job-specific examples [**BREAKING**]
- **pseo:** Address PR review comments - improve sitemap and security
- **pseo:** Extract formatList helper to improve code readability
- **seo:** Make all DownloadCTA primaryHref explicit
- **sitemap:** Address PR review comments
- **sitemap:** Remove .js extension from TypeScript import
- **sitemap:** Use Map for URL deduplication and cleaner code

### 🧪 Testing

- **pseo:** Add comprehensive unit tests for pSEO implementation
- **seo:** Update JobKeywordsPage test for new CTA route

### ⚙️ Miscellaneous Tasks

- **build:** Remove generated sitemap.xml from version control

## [1.3.1] - 2026-01-01

### 🐛 Bug Fixes

- **editor:** Handle nested HTML tags in htmlToMarkdown conversion
- **editor:** Move br tag conversion before nested tag processing
- **latex:** Don't escape markdown syntax characters before filter
- **latex:** Use raw string for docstring with LaTeX backslashes

### 🧪 Testing

- **editor:** Add comprehensive unit tests for markdown conversion
- **editor:** Fix malformed HTML assertion in bidirectional test

## [1.3.0] - 2026-01-01

### 🚀 Features

- **email-templates:** Add automated CSS inlining build process
- **email-templates:** Complete migration to automated build process

### 🐛 Bug Fixes

- **email-templates:** Improve button responsiveness and update copyright
- **email-templates:** Correct box-shadow placement on buttons

### 🚜 Refactor

- **email-templates:** Remove unused .button class styles

## [1.2.0] - 2026-01-01

### 🚀 Features

- **hooks:** Set staleTime to 0 in useResumes for instant data refresh
- **hooks:** Set staleTime to 0 in useResumeCount
- **templates:** Add cache invalidation after resume creation

### 🚜 Refactor

- **templates:** Extract cache invalidation to helper function

## [1.1.0] - 2025-12-31

### 🚀 Features

- **header:** Add FileText icon and useResumes hook imports
- **header:** Add resume count calculation from useResumes hook
- **header:** Add mobile icon navigation with resume count badge
- **header:** Make Sign In button responsive with text link on mobile
- **api:** Add lightweight /api/resumes/count endpoint
- **hooks:** Add useResumeCount hook for lightweight count queries
- **cache:** Add count cache invalidation to MyResumes operations
- **header:** Add resume count badge to desktop navigation

### 🐛 Bug Fixes

- **header:** Hide logo text on small screens to prevent overflow

### ⚡ Performance

- **header:** Use useResumeCount instead of useResumes
- **landing:** Use useResumeCount instead of useResumes

## [1.0.3] - 2025-12-31

### 🐛 Bug Fixes

- **ui:** Responsive sign in button shows on smaller screens
- **resume-parser:** Replace strict data validation with data sanitization & disable icon-list section in ai response

### Ui

- **preview:** Fix mobile scrolling

## [1.0.2] - 2025-12-31

### 🐛 Bug Fixes

- **auth:** Restore original OAuth redirect behavior

## [1.0.1] - 2025-12-31

### 📚 Documentation

- **landing:** Add FAQs about PDF/DOCX import feature

## [1.0.0] - 2025-12-31

### 🚀 Features

- V2 release with OAuth, cloud storage, and resume import [**BREAKING**]

## [0.6.0] - 2025-12-31

### 🚀 Features

- **db:** Add resume storage schema with JSONB and hash-based diffing
- **api:** Add Supabase integration with auth and resume management
- **auth:** Add authentication context with Supabase integration
- **auth:** Add authentication modal and user menu components
- **editor:** Add cloud save system replacing local storage
- **resumes:** Add My Resumes page with management features
- **templates:** Update template selection for cloud storage
- **email:** Add branded email templates for Supabase Auth
- **utils:** Add YAML converter utility for PDF generation
- **templates:** Add template preview images for fallback display
- **components:** Create KebabMenu dropdown component
- **components:** Create GhostCard for create new/upgrade prompt
- **my-resumes:** Integrate ghost card and update container width
- **api:** Add dedicated thumbnail generation endpoint
- **ui:** Add generateThumbnail service function
- **editor:** Trigger thumbnail generation on navigation away
- **ui:** Add stale thumbnail visual indicator to ResumeCard
- **my-resumes:** Integrate thumbnail refresh handler
- **hooks:** Add useThumbnailRefresh hook for background thumbnail updates
- **my-resumes:** Integrate silent background thumbnail refresh
- **templates:** Add auth headers and structured response to generateThumbnail
- **api:** Add icon validation to /api/resumes/{id}/pdf endpoint
- **frontend:** Enhance error handling for missing icons in MyResumes
- **api:** Add anonymous resume migration endpoint
- **frontend:** Add anonymous resume migration on sign-in
- **frontend:** Add soft limit UI for over-limit resume count
- **frontend:** Add modal infrastructure for MyResumes preview
- **frontend:** Implement modal preview handlers for MyResumes
- **frontend:** Integrate PreviewModal into MyResumes page
- **frontend:** Add optimistic UI feedback for auto-save
- **backend:** Add retry logic and error classification for thumbnail generation
- **frontend:** Add useUserAvatar hook with error handling and cache-busting
- **frontend:** Implement silent retry and remove all error UI for thumbnails
- **frontend:** Add TanStack Query dependencies
- **frontend:** Setup TanStack Query provider in App
- **frontend:** Create useResumes hook with TanStack Query
- **frontend:** Add signingOut state to AuthContext
- **frontend:** Add desktop navigation buttons to header for authenticated users
- **frontend:** Add mobile navigation to UserMenu dropdown
- **frontend:** Make landing page CTAs conditional based on auth state
- **frontend:** Make landing page CTAs conditional based on resume count
- **frontend:** Add timeout and localStorage cleanup helpers for auth initialization
- **frontend:** Improve auth initialization loading message
- **frontend:** Add listenerHandledInitRef to track listener-based init
- **frontend:** Add SignInRequiredGate component
- **frontend:** Gate /my-resumes page for anonymous users
- **frontend:** Add useTourPersistence hook with hybrid storage
- **frontend:** Add ConversionContext for nudge management
- **frontend:** Add tour steps configuration
- **frontend:** Add ContextAwareTour component
- **frontend:** Add TabbedHelpModal with auth-aware content
- **frontend:** Add AnonymousWarningBadge component
- **frontend:** Add DOM IDs for tour targeting
- **frontend:** Wrap App with ConversionProvider
- **frontend:** Integrate ContextAwareTour and TabbedHelpModal into Editor
- **frontend:** Add conditional actions to SectionNavigator with auth-aware UI
- **frontend:** Wire SectionNavigator with auth-aware props in Editor
- **frontend:** Add AnonymousWarningBadge to Header for editor page
- **frontend:** Add download toast conversion nudge for anonymous users
- **frontend:** Add idle nudge tooltip for anonymous users
- **ui:** Add two-step selection state to TemplateStartModal
- **ui:** Improve TemplateStartModal icons for better clarity
- **ui:** Add close button and selection indicators to TemplateStartModal
- **ui:** Add visual selection states with glow effect to TemplateStartModal
- **ui:** Improve copy with concise bullet-point descriptions in TemplateStartModal
- **ui:** Replace Cancel with Continue button in TemplateStartModal
- **ui:** Enhance TemplateStartModal accessibility with ARIA and keyboard navigation
- **frontend:** Add DownloadCelebrationModal component
- **frontend:** Integrate celebration modal and fix AuthModal bug
- **frontend:** Add confirmation dialog for YAML import
- **types:** Add UserPreferencesRow type definition
- **hooks:** Create usePreferencePersistence hook
- **app:** Wire up user preferences to ConversionProvider
- **tour:** Add conditional step filtering and simple content rendering
- **tour:** Add tour target IDs to Header and FormattingBubbleMenu
- **migration:** Add findAllLegacyResumes to search all localStorage keys
- **migration:** Add migrateAllLegacyResumes with validation
- **migration:** Add migration state to AuthContext interface
- **migration:** Add migration state variables to AuthProvider
- **migration:** Add post-migration redirect to /my-resumes
- **migration:** Expose migration state in AuthContext
- **api:** Add centralized API client with 401/403 handling
- **ui:** Auto-relaunch tour after successful sign-in
- **auth:** Track anonymous resume migration state
- **config:** Add .env.example files for proper environment setup
- **docker:** Add environment variable support for Supabase
- **docker:** Add docker-compose.yml with environment configuration
- **ui:** Add ResumeRecoveryModal component for resume recovery and conversion
- **ui:** Add resume recovery flow to template selection
- **ui:** Add announcement bar type definitions
- **ui:** Add announcement bar configuration system
- **ui:** Extend usePreferencePersistence for announcement dismissals
- **ui:** Add showAuthModal to AuthContext for global auth modal control
- **ui:** Create AnnouncementBar component with multi-variant support
- **ui:** Integrate AnnouncementBar into App layout
- **db:** Add migration for announcement_dismissals column
- **ui:** Add mobile-responsive announcement bar layout
- **ui:** Add news ticker animation for mobile announcement bar
- **resume-parser:** Allow users to import their existing resumes (pdf / docx) ([#130](https://github.com/aafre/resume-builder/pull/130))
- **auth:** Configure OAuth to use custom domain for authentication
- V2 release with OAuth, cloud storage, and resume import [**BREAKING**]

### 🐛 Bug Fixes

- **api:** Determine empty content type by section type
- **api:** Resolve "Server disconnected" error on /api/resumes with limit=50
- **editor:** Resolve stale closure bug in unmount save
- **editor:** Ensure saveBeforeAction always saves current data
- **api:** Add missing timezone import for thumbnail endpoint
- **hooks:** Add auth headers to polling requests in useThumbnailRefresh
- **resume-card:** Prevent overflow clipping of kebab menu
- **frontend:** Update DEFAULT_ICONS to include all 27 icons
- **frontend:** Preserve icon filenames when loading from storage
- **frontend:** Use toast instead of toast.info in MyResumes
- **frontend:** Handle 403 errors silently in anonymous resume migration
- **frontend:** Add validation and cleanup for anonymous user migration
- **frontend:** Prevent duplicate anonymous resume migration calls
- **frontend:** Improve icon change detection with size metadata
- **frontend:** Remove premature optimistic UI causing stuck 'Saving...' status
- **api:** Handle Supabase anonymous user linking in migration
- **frontend:** Integrate useUserAvatar hook in UserMenu for robust avatar handling
- **auth:** Refresh user metadata after OAuth sign-in to ensure complete avatar data
- **tests:** Use different user IDs in useUserAvatar tests for proper state reset
- **tests:** Export AuthContext for testing and fix dynamic import in test
- **hooks:** Break dependency loop in useThumbnailRefresh
- **frontend:** Memoize onThumbnailUpdated callback in MyResumes
- **hooks:** Add cleanup on unmount in useThumbnailRefresh
- **hooks:** Remove generatingIds from checkThumbnailUpdates dependencies
- **hooks:** Add dependency array to onThumbnailUpdated ref effect
- **hooks:** Update ref during render instead of in effect
- **frontend:** Resolve infinite render loop in thumbnail system
- **frontend:** Resolve 'fetchResumes' before initialization error
- **frontend:** Stop infinite render loop by using empty useEffect deps
- **frontend:** CRITICAL - ensure setLoading(false) always called in fetchResumes
- **frontend:** Refactor MyResumes with TanStack Query
- **frontend:** Use AuthContext session in all action handlers
- **frontend:** Refactor signOut with error handling and toast notifications
- **frontend:** Add query cache invalidation and loading state to sign out button
- **frontend:** Resolve Editor race condition by using AuthContext session
- **frontend:** Remove unused imports from Header.tsx
- **frontend:** Resolve hanging signOut by not awaiting Supabase call
- **backend:** Always copy base contact icons for /api/resumes/{id}/pdf endpoint
- **backend:** Always copy base contact icons for thumbnail generation
- **frontend:** Add timeout protection to auth initialization
- **frontend:** Fix critical auth initialization race conditions
- **frontend:** Let auth listener immediately unblock UI during initialization
- **ui:** Add top margin to prevent recommended badge overlap
- **frontend:** Add missing showAuthModal state and import DownloadCelebrationModal
- **frontend:** Remove explicit any type casts in DownloadCelebrationModal
- **frontend:** Improve Start Fresh confirmation dialog clarity
- **frontend:** Remove browser alert from YAML import flow
- **frontend:** Remove duplicate browser alert and simplify confirmation messages
- **frontend:** Simplify Start Fresh confirmation message
- **frontend:** Remove false storage limit modal on all errors
- **frontend:** Fix editor page detection for anonymous badge
- **frontend:** Use proper warning status pattern for AnonymousWarningBadge
- **editor:** Fix idle nudge arrow direction and add testing timer
- **migration:** Trigger localStorage migration for all users on app load
- **migration:** Extract icon data from correct localStorage structure
- **auth:** Prevent session loss on hard refresh (Ctrl+F5)
- **security:** Restrict CORS to whitelisted origins
- **security:** Prevent path traversal attacks in file serving
- **auth:** Implement session caching in apiClient to eliminate 30s hang on hard refresh
- **build:** Resolve TypeScript errors and standardize toast API usage
- **flask:** Prevent static route conflict with API routes in development mode
- **ui:** Correct resume limit messaging and ignore static/ build output
- **ui:** Improve resume limit card icon and remove misleading upgrade action
- **ui:** Prevent duplicate 'Resume loaded successfully' toast on editor load
- **flask:** Prevent static route conflict with API routes in development mode
- **ui:** Increase AuthModal z-index to appear above tour guide
- **ui:** Close tour when sign-in button is clicked
- **ui:** Prevent resume load race condition during migration
- **ui:** Prevent infinite tour loop after sign-in
- **ui:** Add anonMigrationInProgress to resume load dependencies
- **ui:** Prevent tour from showing on every editor load
- **test:** Add ConversionProvider and fix UserMenu test
- **test:** Add query parameter support to Editor for template initialization
- **routing:** Add /editor route for query-based template loading
- **test:** Add async handling for PDF generation failure test
- **ui:** Remove unused import
- **build:** Exclude test-utils.tsx from production build
- **test:** Update QueryClient to use gcTime instead of cacheTime
- **docker:** Improve .dockerignore with precise exclusions
- **preferences:** Use maybeSingle() to prevent 406 error on missing rows
- **editor:** Suppress false "Resume not found" toast when Editor can recover
- **ui:** Set toast z-index above auth modal backdrop
- **ui:** Add rounded top corners to auth modal header
- **ui:** Add layout containment to FAQ accordion to prevent CLS
- **ui:** Add fixed height and image dimensions to CompanyMarquee
- **ui:** Prevent horizontal shift in CountUp stats animation
- **ui:** Smooth header height transitions and add logo dimensions
- **ui:** Add font-display swap to FontAwesome icons
- **ui:** Fix AdSense configuration race condition
- **ui:** Prevent template page flash during post-auth redirect
- **ui:** Clear loader flag when recovery intent is missing or invalid
- **templates:** Add explicit type fields to Experience and Education sections
- **ui:** Set originalTemplateData when loading resume from cloud
- **ui:** Include social_links in Start Fresh contact info reset
- **ui:** Remove font-mono from landing page stats for consistency
- **db:** Optimize RLS policies and secure function search_path
- **ui:** Improve announcement bar visibility and styling
- **ui:** Finalize slim announcement bar with inline styles
- **ui:** Remove unused useEffect import from AnnouncementBar
- **ui:** Add undefined check for showOn property in announcements filter
- **ui:** Open announcement bar Learn More link in new tab
- **ui:** Fix failing tests on auth-sso branch
- **ui:** Remove unused variables causing TypeScript build errors
- **ui:** Center 'Save to Cloud' button text and improve subtext
- **ui:** Soften Unsaved Work modal header to match app theme
- **ui:** Increase modal corner radius for consistent polished look
- **edge-function:** Revert to use auto-injected SUPABASE_SERVICE_ROLE_KEY
- **edge-function:** Correct SUPABASE_SERVICE_ROLE_KEY variable name
- **db:** Update migration and docker compose
- **release:** Configure git-cliff to detect breaking changes for major version bumps

### 🚜 Refactor

- **editor:** Integrate cloud save and Supabase storage
- **ui:** Update components for authentication and cloud save
- **app:** Add AuthProvider and My Resumes routing
- **editor:** Remove unused SaveStatusIndicator import
- **resume-card:** Make thumbnail clickable for preview
- **resume-card:** Restructure content with title-first hierarchy
- **resume-card:** Integrate kebab menu for hidden actions
- **my-resumes:** Simplify page header
- **header:** Remove redundant navigation links
- **my-resumes:** Move page title to header
- **resume-card:** Replace stale UI with subtle spinner and error badge
- **api:** Extract icon extraction function to module level
- **frontend:** Remove auto-redirect logic from landing page
- **frontend:** Accept session parameter in useCloudSave hook
- **frontend:** Remove redundant setLoading from auth state listener
- **frontend:** Update initializeAuth to respect listener flag
- **frontend:** Replace download toast with celebration modal trigger
- **frontend:** Redesign AnonymousWarningBadge with premium gradient
- **context:** Update ConversionContext to accept idle nudge from parent
- **editor:** Use usePreferencePersistence hook for tour state
- **hooks:** Remove obsolete useTourPersistence hook
- **editor:** Finalize idle nudge - revert to 5min, remove arrow
- **tour:** Add TypeScript interfaces for conditional visibility and simplified content
- **tour:** Rewrite tour steps with simplified content and new order
- **api:** Use apiClient in useCloudSave hook
- **api:** Use apiClient in useResumes hook
- **api:** Use apiClient in Editor component
- **api:** Use apiClient in MyResumes page
- **ui:** Standardize toast library to react-hot-toast
- **ui:** Improve tour sign-in button text clarity
- **auth:** Suppress redundant migration success toast
- **ui:** Suppress resume load toast during tour sign-in
- **ui:** Remove redundant tour re-launch toast
- **ui:** Use AuthContext modal state in Header component
- **ui:** Remove 'Recommended' badge from manual template options
- **ci:** Remove env_vars from deploy workflow

### 📚 Documentation

- Add OAuth authentication setup guides
- **supabase:** Add comprehensive OAuth and email template guides
- **testing:** Add comprehensive testing plans
- **claude:** Add git workflow and commit message format guide
- Add resume limit race condition fix guide
- Add comprehensive Docker deployment and security guides
- Add quick start guide for Docker deployment
- **ui:** Update landing page FAQ with cloud storage features
- **seo:** Update actualFree page FAQ with cloud storage info
- **seo:** Update noSignUp page FAQ with cloud migration info
- **seo:** Update redditRecommended page FAQ with multi-resume features
- **security:** Add leaked password protection setup guide

### ⚡ Performance

- **frontend:** Reduce auto-save debounce from 5s to 800ms
- **frontend:** Parallelize icon base64 conversions
- **backend:** Implement smart icon diffing for 80-95% network savings
- **frontend:** Remove unnecessary favicon preload directives
- **frontend:** Skip anonymous session creation when listener handles init

### 🎨 Styling

- **ui:** Center-align announcement bar content on desktop

### 🧪 Testing

- **frontend:** Add comprehensive UserMenu integration tests
- **ui:** Add test-utils with renderWithProviders helper
- **ui:** Update UserMenu tests to use renderWithProviders
- **ui:** Update Editor and Integration tests to use renderWithProviders

### ⚙️ Miscellaneous Tasks

- Update .gitignore for development files
- **docker:** Add poppler-utils for PDF thumbnail generation
- **config:** Add MCP server configuration for Supabase
- **gitignore:** Exclude development files and personal resumes
- Remove debug logging after fixing infinite loop
- **frontend:** Add @headlessui/react dependency
- **db:** Add tour_completed and idle_nudge_shown columns
- **tourGuide:** Update messaging
- **ui:** Update package
- **test:** Remove obsolete useAutoSave test file
- Trigger v1.0.0 release with fixed git-cliff configuration

### Debug

- Disable retry scheduler and add console logging
- Add detailed logging throughout fetchResumes
- Add granular logging for each step in fetchResumes
- Add logging to useThumbnailRefresh to track re-renders
- Add comprehensive logging to diagnose loading stuck issue
- **editor:** Add console logging for idle nudge conditions
- Add temporary logging to diagnose key format

## [0.5.4] - 2025-11-20

### 🐛 Bug Fixes

- Add tex plain generic dependency for latex templates ([#127](https://github.com/aafre/resume-builder/pull/127))

## [0.5.3] - 2025-11-20

### 🐛 Bug Fixes

- Add tex extra package ([#126](https://github.com/aafre/resume-builder/pull/126))

## [0.5.2] - 2025-11-19

### 🐛 Bug Fixes

- Auto-save not honouring  ([#125](https://github.com/aafre/resume-builder/pull/125))

## [0.5.1] - 2025-11-19

### 🐛 Bug Fixes

- Preview for small screens and add tour guide, minor polish to ui ux for mobile ([#124](https://github.com/aafre/resume-builder/pull/124))

## [0.5.0] - 2025-11-19

### 🚀 Features

- Add rich text formatting on ui, resume preview, updated UI/UX on Editor  ([#122](https://github.com/aafre/resume-builder/pull/122))

## [0.4.0] - 2025-09-27

### 🚀 Features

- Implement clear template feature to reset content but retain structure ([#117](https://github.com/aafre/resume-builder/pull/117))

## [0.3.5] - 2025-09-18

### 🐛 Bug Fixes

- Make linkedin optional ([#115](https://github.com/aafre/resume-builder/pull/115))

## [0.3.4] - 2025-09-17

### 🐛 Bug Fixes

- Make linkedin optional ([#114](https://github.com/aafre/resume-builder/pull/114))

## [0.3.3] - 2025-09-14

### 🐛 Bug Fixes

- Font cache issue & empty list in tex - also add debug logging for modern template errors  ([#112](https://github.com/aafre/resume-builder/pull/112))

## [0.3.2] - 2025-09-13

### 🐛 Bug Fixes

- Blog readTimes, broken urls, content and styling ([#111](https://github.com/aafre/resume-builder/pull/111))

## [0.3.1] - 2025-09-13

### 🐛 Bug Fixes

- Blog readTimes, broken urls and content ([#110](https://github.com/aafre/resume-builder/pull/110))

## [0.3.0] - 2025-09-12

### 🚀 Features

- Add blogs, update styling and disable console log using terser ([#109](https://github.com/aafre/resume-builder/pull/109))

## [0.2.8] - 2025-08-05

### 🐛 Bug Fixes

- Streamline icon handling and loading from saved yaml ([#103](https://github.com/aafre/resume-builder/pull/103))

## [0.2.7] - 2025-08-02

### ⚙️ Miscellaneous Tasks

- Update and simplify ([#99](https://github.com/aafre/resume-builder/pull/99))
- Fix build and tag ([#101](https://github.com/aafre/resume-builder/pull/101))
- Fix build and tag ([#102](https://github.com/aafre/resume-builder/pull/102))

## [0.2.6] - 2025-08-02

### 📚 Documentation

- Update readme ([#97](https://github.com/aafre/resume-builder/pull/97))

### ⚙️ Miscellaneous Tasks

- Fix git ref

## [0.2.5] - 2025-08-02

### ⚙️ Miscellaneous Tasks

- Implement lazy loading, improve logo loading and seo ([#96](https://github.com/aafre/resume-builder/pull/96))

## [0.2.4] - 2025-07-31

### ⚙️ Miscellaneous Tasks

- Ads setup ([#85](https://github.com/aafre/resume-builder/pull/85))

## [0.2.3] - 2025-07-31

### ⚙️ Miscellaneous Tasks

- Google ads script ([#84](https://github.com/aafre/resume-builder/pull/84))

## [0.2.2] - 2025-07-31

### 🐛 Bug Fixes

- Implement process pool for html to pdf  ([#76](https://github.com/aafre/resume-builder/pull/76))
- Git-cliff install in ci  ([#79](https://github.com/aafre/resume-builder/pull/79))

## [0.2.1] - 2025-07-31

### 🐛 Bug Fixes

- Ci ([#75](https://github.com/aafre/resume-builder/pull/75))

## [0.2.0] - 2025-07-31

### 🚀 Features

- Disable lint for frontend
- Implement automated release management with git-cliff
- Implement automated release management with git-cliff

### 🐛 Bug Fixes

- Update CI pipeline with reusable workflows ([#74](https://github.com/aafre/resume-builder/pull/74))

## [0.1.0] - 2025-07-29

### 🚀 Features

- **ci:** Release after testing
- Implement automated release management with git-cliff and enforce conventional commits

### 🐛 Bug Fixes

- Fixes text wrap on screen size
- Update Terms of Service link and unstage package-lock.json

### Fix

- Scroll to top when clicking on footer links to navigate pages

<!-- generated by git-cliff -->
