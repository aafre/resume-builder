# Changelog

All notable changes to this project will be documented in this file.

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
