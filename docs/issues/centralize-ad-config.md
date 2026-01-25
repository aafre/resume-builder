# Issue: Centralize Ad Configuration Constants

**Title:** refactor(ads): centralize ad configuration constants

**Labels:** enhancement, tech-debt

---

## Summary

Ad-related constants (client ID, slot IDs) are currently hardcoded across multiple components. This makes maintenance error-prone and updates tedious.

## Current State

The AdSense client ID is hardcoded in:
- `resume-builder-ui/src/components/ads/AdContainer.tsx` (line 192)
- `resume-builder-ui/index.html`

Ad slot IDs are hardcoded in:
| File | Slot ID | Ad Unit Name |
|------|---------|--------------|
| `LandingPage.tsx` | `1232650916` | efr-landing-incontent |
| `FreeResumeBuilderNoSignUp.tsx` | `3994545622` | efr-freepage-incontent |
| `TemplatesHub.tsx` | `6343391269` | efr-templates-incontent |
| `ResumeKeywordsHub.tsx` | `9055300614` | efr-keywords-incontent |
| `BlogIndex.tsx` | `7742218947` | efr-blog-infeed |
| `TemplateCarousel.tsx` | `3806186822` | efr-carousel-infeed |
| `SectionNavigator.tsx` | `3691293294` | efr-editor-sidebar |

## Proposed Solution

Create a centralized ad configuration file:

```typescript
// src/config/ads.ts
export const AD_CONFIG = {
  clientId: 'ca-pub-8976874751886843',
  slots: {
    landingIncontent: '1232650916',
    freepageIncontent: '3994545622',
    templatesIncontent: '6343391269',
    keywordsIncontent: '9055300614',
    blogInfeed: '7742218947',
    carouselInfeed: '3806186822',
    editorSidebar: '3691293294',
  },
} as const;
```

Then update all components to import from this config.

## Benefits

- Single source of truth for all ad IDs
- Easier to update slot IDs across the codebase
- Reduces risk of typos or inconsistencies
- Clearer documentation of which slots are used where

## Origin

This issue was identified during PR #208 code review by @gemini-code-assist.
