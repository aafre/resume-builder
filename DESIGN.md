---
name: EasyFreeResume
description: Light-dominant, type-led resume builder where green means "live" and nothing is hidden behind glass.
colors:
  ink: "#0c0c0c"
  ink-light: "#1a1a1a"
  chalk: "#fafaf8"
  chalk-dark: "#f0efe9"
  stone-warm: "#8a8680"
  mist: "#a8a4a0"
  accent: "#00d47e"
  accent-text: "#007a48"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Bricolage Fallback, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bricolage Grotesque, Bricolage Fallback, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bricolage Grotesque, Bricolage Fallback, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Bricolage Grotesque, Bricolage Fallback, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 2vw, 1.25rem)"
    fontWeight: 200
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.15em"
rounded:
  control: "8px"
  surface: "12px"
  card: "16px"
  feature: "24px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px 32px"
    height: "44px"
  button-secondary:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px 32px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "#374151"
    rounded: "{rounded.control}"
    padding: "8px 12px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "rgba(0,0,0,0.05)"
    textColor: "{colors.ink}"
  input-field:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px"
  card-app:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "16px"
  card-feature:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "32px"
  card-resource:
    backgroundColor: "{colors.chalk-dark}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "20px"
  cta-dark:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.feature}"
    padding: "80px 24px"
---

# Design System: EasyFreeResume

## Overview

**Creative North Star: "The Honest Workshop"**

A well-lit workbench, not a showroom. The surfaces are paper-white and slightly warm, the tools sit out in the open where you can see them, and nothing is hidden behind glass or held back for a fee. This is the visual argument the product has to make before it makes any other one: a visitor arrives here having been burned by a builder that let them do the work and then asked for money at the download button. Every design decision either supports the claim that there is nothing behind the curtain, or it undermines it.

The system gets its force from typography, not decoration. Headings are set at weight 800 and body text at weight 200 — a gap wide enough that the page has an obvious spine and nothing else has to compete for attention. Backgrounds stay in a narrow band of warm off-whites, so the eye reads structure from type size and spacing rather than from boxes and rules. Green appears rarely, and when it does it means something is live, passing, or actionable. Depth is earned: surfaces sit flat until you touch them.

Components feel **tactile and confident**. Targets are generous (44px minimum, everywhere, including the dense editor), presses respond visibly, and states are unambiguous. The audience includes people writing their first resume at 11pm and unsure whether they are doing it right, so the interface must feel forgiving to touch rather than delicate and expensive.

**Key Characteristics:**
- Light-dominant: warm off-white grounds (`#fafaf8`, `#f0efe9`), near-black ink, no dark mode
- Extreme type contrast: weight 800 against weight 200, with nothing decorative in between
- One accent, used as a signal rather than as a brand wash
- Flat at rest; shadow is a response to state, not a property of cards
- Generous, unambiguous touch targets — confidence through hand-feel, not ornament
- Two typefaces only: Bricolage Grotesque (variable, 200–800) and JetBrains Mono for labels

## Colors

A near-monochrome warm-grey system carrying a single high-chroma green that is spent sparingly.

### Primary
- **Signal Green** (`#00d47e`): Primary CTA fills, focus rings, live/passing status, badge dots, active drag indicators, and the accent sweep on the hero headline. It is the only saturated color in the system and its scarcity is what makes it readable as a signal.
- **Deep Signal** (`#007a48`): The text-safe sibling. Identical intent, darker so it survives contrast requirements on light grounds. Used for accent-colored text — mono eyebrows, inline links, small accent labels.

### Neutral
- **Ink** (`#0c0c0c`): All primary text and headings, and the fill for the dark CTA blocks that close marketing pages.
- **Ink Light** (`#1a1a1a`): Dark chrome surfaces — the demo/mockup shell on the landing page. Distinguishes a device frame from a true ink block.
- **Chalk** (`#fafaf8`): The default page ground and the resting state of most sections. Warm enough to read as paper rather than as a UI grey.
- **Chalk Dark** (`#f0efe9`): The alternate surface — resource cards, the footer, and every other section when sections alternate. Provides depth by tone rather than by shadow.
- **Stone Warm** (`#8a8680`): Body copy, subtitles, and supporting text. The workhorse secondary text color. **Measures 3.46:1 on Chalk — large-text AA only.** See the measured-contrast table below; this is a live compliance gap, not a licence.
- **Mist** (`#a8a4a0`): Tertiary and muted text only — timestamps, counts, disabled labels. Never for anything the user has to read to complete a task. **Measures 2.37:1 on Chalk and passes nothing.**

Standard Tailwind `gray-{200,300,600,700}` remains acceptable for borders, form strokes, and interactive chrome inside app surfaces. It is **not** acceptable for text or backgrounds on any migrated page; that is what the tokens above are for.

### Named Rules

**The 10% Rule.** Signal Green covers no more than roughly a tenth of any screen. It fills primary CTAs, focus rings, and status indicators. It never backs a section, never tints a large surface, and never appears decoratively. The moment green becomes ambient, "this passed" and "click this" stop meaning anything.

**The Deep Signal Rule.** `#00d47e` on a light ground fails WCAG contrast for text (1.87:1 on Chalk). Any accent-colored text below 24px uses `#007a48` (`text-accent-text`) instead — 5.18:1, which clears AA comfortably. `#00d47e` is for fills only, where the surrounding text carries the contrast (Ink on Signal Green measures 9.98:1, well clear). Reaching for `text-accent` on body-sized copy is the single most likely accessibility regression in this system.

**The One Accent Rule.** There is no secondary or tertiary brand color. Semantic reds, ambers, and blues exist only inside status affordances (toasts, validation, warning banners) and are never promoted into the brand palette.

### Measured Contrast

Computed against Chalk (`#fafaf8`), the default page ground. WCAG 2.2 AA requires 4.5:1 for text under 24px (or under 19px bold), 3:1 for large text, and 3:1 for focus indicators and non-text UI boundaries.

| Pairing | Ratio | Verdict |
|---|---|---|
| Ink on Chalk | 18.72:1 | Passes everything |
| Ink on Signal Green (primary button label) | 9.98:1 | Passes everything |
| Deep Signal on Chalk | 5.18:1 | Passes AA text |
| **Stone Warm on Chalk** | **3.46:1** | **Large text only — fails AA for body copy** |
| **Mist on Chalk** | **2.37:1** | **Fails all thresholds** |
| **Signal Green on Chalk** | **1.87:1** | **Fails the 3:1 focus-indicator threshold** |

Three known gaps, recorded here so no future work assumes this palette is already compliant:

1. **Stone Warm is the system's body-copy color and does not clear AA at body sizes.** It is used for nearly every paragraph and subtitle on the marketing and content surfaces. Fixing it means darkening the token (roughly `#6f6b65` reaches 4.5:1) rather than avoiding it, because avoiding it is not realistic at its current usage volume.
2. **Mist fails at every size.** It is only defensible on genuinely decorative text that duplicates information available elsewhere. Any Mist text carrying unique meaning is a defect.
3. **The accent focus ring does not meet the 3:1 focus-appearance requirement on light grounds.** `ring-offset-white` separates the ring from the control but does not raise the ring's own contrast against the page. The ring is applied via `.btn-primary:focus-visible` and repeated across the header and cards, so this is a system-wide finding rather than a page-level one.

These are stated, not resolved. Resolving them is an `/impeccable audit` pass with its own PR, because changing `stone-warm` repaints most of the site and deserves to be reviewed as a deliberate change.

## Typography

**Display Font:** Bricolage Grotesque (variable, weights 200–800), self-hosted, with a metric-matched `Bricolage Fallback` built from local system faces
**Body Font:** Bricolage Grotesque — the same family, separated by weight rather than by family
**Label/Mono Font:** JetBrains Mono (400), self-hosted, Latin subset only

**Character:** A single quirky variable grotesque doing all the work, split so far apart by weight that it reads as two voices. The 800 is dense and slightly eccentric — it has personality without being a novelty face. The 200 is nearly hairline and gives long-form copy an airy, unhurried quality that offsets the urgency of the subject matter. JetBrains Mono appears only in small tracked-out capitals, where it functions as a machine-set filing label.

Both faces load with `font-display: optional` against a metric-matched fallback, which means **the fonts may never paint at all on a cold visit**. This is deliberate — it buys zero CLS on a search-traffic-dependent site. Any design that only works once the webfont has loaded is a design that breaks for a first-time visitor.

### Hierarchy
- **Display** (800, `clamp(2.5rem, 5.5vw, 4.5rem)`, 1.08, tracking-tight): Page H1 only. One per page.
- **Headline** (800, `text-3xl md:text-4xl`, tracking-tight): Section H2s. Always preceded by a mono eyebrow.
- **Title** (700, `1.25rem`): Card and panel H3s.
- **Body** (200, `text-lg md:text-xl`, `leading-relaxed`): Paragraphs, subtitles, descriptions. Constrain to `max-w-3xl` / `max-w-4xl` so the extralight weight never has to hold a long measure.
- **Label** (400 mono, `0.75rem`, `0.15em` tracking, uppercase, Deep Signal): Section eyebrows, category markers, the "Advertisement" tag.
- **Meta** (400, `0.875rem`, Stone Warm): Timestamps, counts, secondary controls.

### Named Rules

**The Two-Weight Rule.** Editorial type uses 800 or 200. Nothing in between. The intermediate weights (500/600/700) exist only for interface chrome — buttons, nav links, form labels, card titles — where they signal "this is a control, not prose". A 600-weight paragraph is off-system.

**The Eyebrow Rule.** Every section heading block runs mono eyebrow → H2 → subtitle paragraph, then a `mb-12 md:mb-16` gap before content. The eyebrow is what makes a section feel filed rather than merely stacked, and it is set in Deep Signal, never Signal Green.

## Layout

Centered single-column measures on a warm ground; the system has no visible grid and no vertical rules.

Sections use `py-12 md:py-20 px-4 sm:px-6 lg:px-8` on marketing and content surfaces, widening to `py-20`–`py-24` on the landing page. Inner containers step down by content type: `max-w-6xl` for wide grids, `max-w-4xl` for standard sections, `max-w-3xl` for text-focused reading. App surfaces (editor, my-resumes) run wider — the header container reaches `max-w-[1800px]` — because they are workbenches, not documents.

Grids are `grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12`. Alternating sections swap Chalk and Chalk Dark rather than introducing borders.

Fixed chrome heights are exposed as CSS custom properties and consumed as Tailwind spacing (`--header-height-mobile: 64px`, `--header-height-desktop: 72px`, `--footer-height: 200px`, `--mobile-action-bar-height: 110px`, `--tablet-toolbar-height: 80px`). Anything that needs to offset against chrome reads these rather than hardcoding a number.

Below-fold sections carry `content-visibility: auto` with a paired `.cv-h-*` intrinsic-size hint. Adding a new below-fold section without an intrinsic-size estimate reintroduces layout shift on a site whose traffic depends on Core Web Vitals.

### Named Rules

**The Reserved Space Rule.** Anything that arrives late — ads, images, async status, revealed sections — reserves its final height before it arrives. The scroll-reveal system animates opacity and transform only, never height or width, for exactly this reason. Ad slots carry explicit min-heights. This rule is not negotiable on a site funded by search traffic.

## Elevation & Depth

**Flat at rest; depth is a response.** Surfaces sit flush against their ground by default and gain shadow only when something is happening to them — hover, focus, drag, or genuine floating above the page. Where a resting surface needs to separate from its ground, it does so tonally (Chalk against Chalk Dark against white), not with a shadow.

The one sanctioned exception is marketing feature cards, which may carry `.shadow-premium` at rest. That is a deliberate register shift: a landing page is a printed brochure and is allowed physical presence, while a workbench is not.

### Shadow Vocabulary
- **Resting app surface** (`shadow-sm`): The baseline for cards inside the application. Barely present; establishes edge, not lift.
- **Responsive lift** (`shadow-md`): The hover answer to `shadow-sm`. Paired with `transition-shadow duration-200`.
- **Premium ambient** (`.shadow-premium`, four stacked layers from `0 1px 2px` to `0 24px 48px` at 4–6% black): Marketing feature cards only.
- **Premium response** (`.shadow-premium-hover`): Deepens the stack and adds a `0 40px 80px rgba(0,212,126,0.06)` accent bloom. The only place green is allowed to become atmospheric, and only because it is at 6% opacity behind a card.
- **Floating** (`shadow-xl` / `shadow-2xl`): Genuinely detached elements — modals, toasts, drag overlays, the glass header.

### Named Rules

**The Flat-At-Rest Rule.** If a surface is not being interacted with and is not floating above the page, it has no shadow. A resting card that carries lift is claiming an importance it has not earned.

**The Glass Restraint Rule.** `backdrop-blur` is reserved for elements that genuinely overlay content: the sticky header, toasts, modal scrims. Glass on a static in-flow card is decoration, and it costs paint performance on the editor's long lists.

## Shapes

Softly rounded throughout, with radius carrying meaning: the smaller the radius, the more the element behaves like a control.

- **8px** (`rounded-lg`) — buttons, inputs, nav links, icon buttons. Everything you operate.
- **12px** (`rounded-xl`) — the default surface radius and by far the most-used value in the codebase. Panels, app cards, containers.
- **16px** (`rounded-2xl`) — marketing feature cards and larger composed blocks.
- **24px** (`rounded-3xl`) — reserved for full-width statement blocks: the dark closing CTA, hero mockup frames.
- **Full** (`rounded-full`) — badges, status dots, avatars, pills.

Borders are near-invisible: `border-black/[0.06]` on marketing surfaces, `border-gray-200`/`border-slate-200` on app chrome. Where a border must read as a container edge rather than a line, the system prefers `.card-gradient-border` — a 1px accent gradient applied via mask-composite so the edge glows faintly rather than drawing.

Sharp corners do not appear anywhere in this system.

### Named Rules

**The 12px Default Rule.** When unsure, use `rounded-xl`. Radius steps down to 8px for things you press and up to 16px/24px for things you look at.

## Components

### Buttons

Three variants, all sharing a 44px minimum height and a `active:scale-[0.98]` press response — the physical confirmation that makes the system feel tactile.

- **Shape:** Control radius (8px), `inline-flex`, centered content.
- **Primary:** Signal Green fill, Ink text, weight 700, `shadow-sm` resting → `shadow-md` hover. Sizes: `py-3.5 px-8` default, `py-4 px-10` hero, `py-2.5 px-5` compact/header.
- **Secondary:** White fill, `border-gray-200` → `border-gray-300` on hover, Ink text, weight 600, same shadow behavior.
- **Ghost:** No fill, `text-gray-700` → Ink, `hover:bg-black/5`, weight 500, `px-3 py-2`. Tertiary and nav use.
- **Focus:** All three share `ring-2 ring-accent ring-offset-2 ring-offset-white` on `:focus-visible`. Never remove this without an equivalent replacement.
- **Deliberately absent:** the primary button's shimmer sweep. `.btn-primary::before { content: none }` is an intentional removal, not dead code.

### Inputs / Fields

- **Style:** White fill, `border-gray-300`, control radius (8px), `p-2` to `p-3` internal padding.
- **Focus:** `focus-within:ring-2 ring-accent` plus `focus-within:border-accent`, over `transition-all duration-200`. The ring is on the wrapper (`focus-within`) rather than the input, because several fields wrap rich-text editors rather than bare inputs.
- **Mobile:** Font size is forced to 16px below 768px to prevent iOS Safari's zoom-on-focus. This override is load-bearing; a `text-sm` utility on a mobile input will be defeated by it on purpose.

### Cards / Containers

- **App card:** White, 12px radius, `border-slate-200`, `shadow-sm` → `shadow-md` on hover, `p-4`.
- **Marketing feature card:** White, 16px radius, `p-8`, `.card-gradient-border`, `.shadow-premium` + `.shadow-premium-hover`, `hover:-translate-y-1`, `transition-all duration-300`.
- **Resource card:** Chalk Dark fill, 12px radius, `p-5`, transparent border that resolves to `border-black/[0.04]` and a white fill on hover — the surface brightens toward the user rather than lifting.

### Navigation

Sticky header on `bg-white/95` with `backdrop-blur-xl` and a `border-slate-200/80` underline. Nav links are 8px-radius ghost buttons at `text-sm` weight 500 with a 44px minimum height. Active state is carried by weight and Ink color, not by an underline or a pill. Counts and unread state attach as Signal Green dots with a white ring, positioned absolutely at the target's top-right. The primary CTA ("Create Free Resume") stays visible at every breakpoint, contracting its label rather than disappearing.

### Ghost Add Button

Full-width dashed `border-2 border-gray-300` at control radius, muted grey label with a leading plus icon. On hover it resolves to `border-accent/70`, accent text, and a `bg-accent/[0.06]` wash. It is the system's signature "there could be more here" affordance and appears throughout the editor for adding sections and items. It is the one place a dashed border is permitted.

### Ad Surface

A documented, deliberately styled component rather than an afterthought — ads fund the product's central promise, so they get real design. `.ad-surface` renders a 1px `rgba(15,23,42,0.08)` border at 8px radius over a two-layer background (a vertical white gradient plus a 135° hairline repeating stripe), with an inset top highlight. A `::before` pseudo-element sets the word "Advertisement" in 10px 700-weight tracked capitals at the top-left, and an `:empty::after` fills the body with a soft placeholder so an unfilled slot reads as reserved space instead of a broken box.

Ad slots must never be restyled to blend into content, and must never be removed to make a layout tidier.

## Do's and Don'ts

### Do:
- **Do** use `text-accent-text` (`#007a48`) for any accent-colored text under 24px. `text-accent` is for fills, rings, and strokes.
- **Do** keep every interactive control at `min-h-11` (44px), including in the editor's densest rows.
- **Do** pair `.cv-auto` with a `.cv-h-*` intrinsic-size class on every new below-fold section.
- **Do** reserve explicit height for anything that loads late — ads, images, async status.
- **Do** wrap below-fold *marketing* sections in `<RevealSection>`; the reveal system animates opacity and transform only, never geometry.
- **Do** lead every section with the mono eyebrow → H2 → subtitle block.
- **Do** use `overflow: clip` rather than `overflow: hidden` on layout containers — `hidden` silently creates a scroll container and has broken this app's flex layout before.
- **Do** verify a design still works with the webfont unloaded; `font-display: optional` means it will be, for some visitors.
- **Do** check any new text color against the measured-contrast table before using it. Three of this palette's own tokens currently fail AA at body size.

### Don't:
- **Don't** use `gray-*` or `slate-*` for text or backgrounds on a migrated page. Use `ink`, `stone-warm`, `mist`, `chalk`, `chalk-dark`. (`ResumeCard.tsx` currently uses `slate-200`, `gray-900`, and `gray-500` — it is un-migrated, not a precedent.)
- **Don't** let Signal Green back a large surface, tint a section, or appear decoratively. Ten percent is the ceiling.
- **Don't** apply scroll reveals, hover lifts, or `.shadow-premium` to the editor or my-resumes. Motion on a workbench is feedback; anything else is friction on a surface people use for forty minutes.
- **Don't** introduce a third typeface, or reach for a weight between 200 and 800 for editorial text.
- **Don't** reinstate the `.btn-primary` shimmer sweep. Its removal was deliberate.
- **Don't** put a resting shadow on an app card.
- **Don't** restyle, shrink, or remove ad surfaces for visual tidiness.
- **Don't** introduce a dark mode. This system has one light world and every token, shadow, and contrast decision assumes it.
- **Don't** put unique or task-critical information in Mist. At 2.37:1 it fails every threshold; if the user must read it to finish a job, it is the wrong color.
- **Don't** assume the accent focus ring is accessible. It is not, on light grounds — treat any new focus treatment as needing its own contrast check rather than copying the existing one.

<!--
Anti-reference: the owner has not yet confirmed a full visual don't-list. The only
rejection recorded above is the one the codebase itself proves — the upsell-dense
competitor register (Zety / Resume.io), which seven comparison pages are written
against. Revisit this section when the owner has a firmer view.
-->
