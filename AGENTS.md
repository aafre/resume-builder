# AGENTS.md

Project guide: see `CLAUDE.md` (architecture, SEO governance) and `DESIGN.md` (design system).

## Code Review Rules

Flag only issues that cause wrong behavior, data exposure, or silent prod regressions.
Skip style, lint, and formatting — CI (`pr-validation.yml`) handles those.

### Backend (Flask, `app.py`, `resume_generator*.py`)

- The Supabase client is created with the SECRET key, so RLS is bypassed. Every
  resume / icon / thumbnail / preference query and storage path must be scoped to
  `request.user_id` set by `@require_auth`. Flag any read, write, or delete keyed only
  by a resume id or by a client-supplied user id.
- New endpoints touching user data must use `@require_auth`. Public endpoints must never
  return another user's data.
- The HTML Jinja environment has autoescape OFF and wkhtmltopdf renders the result
  (it can fetch `file://` and network URLs). Flag new paths that put untrusted input into
  HTML unescaped. LaTeX output must go through `_escape_remaining_latex_chars`.
- Uploads (YAML, icons): flag `yaml.load` without `SafeLoader`, filenames used in paths
  without sanitising (traversal), and missing size/type checks.
- The Dockerfile COPYs an explicit list of root `.py` files and directories. A new
  top-level module or data dir that isn't added there crashes prod on import (this has
  happened). Flag it.

### Frontend (React + TS, `resume-builder-ui/`)

- Tailwind silently drops unknown classes — no build or test catches it. Flag classes
  not defined in `tailwind.config.js` (e.g. `text-mist`, `stone-warm`).
- `text-accent` on light grounds fails contrast (1.87:1); small text there must use
  `text-accent-text`. Inside `bg-ink` blocks `text-accent` is correct — don't flag it.
- `overflow-hidden` on flex layout containers creates a scroll container and has broken
  layout before; use `overflow-clip`.
- Flag stale closures: effects/callbacks reading state or props missing from their
  dependency arrays.
- SEO: flag any new or changed `noindex`, canonical, `<title>`, H1, route, or redirect —
  these need owner sign-off. Title tags must start with "EasyFreeResume".
