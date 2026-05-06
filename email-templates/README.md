# Email Templates for EasyFreeResume

This directory contains branded, reusable email templates for all transactional emails sent by the application.

## Design System

All templates follow the EasyFreeResume 2026 design language:

- **Header**: 4px accent bar (#00d47e) + solid ink (#0c0c0c) header with white logo
- **CTA Button**: Solid accent green (#00d47e) with dark text (#0c0c0c), 12px radius
- **Page Background**: Chalk (#fafaf8), warm off-white
- **Typography**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Spacing**: Generous padding (40px desktop, 28px mobile)
- **Shadows**: Subtle accent glow on CTA buttons

## Available Templates

### 1. `magic-link.html`
**Purpose**: Passwordless authentication (Magic Link sign-in)

**Supabase Variable**: `{{ .ConfirmationURL }}`

**Used for**: Email-based passwordless login

**Key Features**:
- Clear CTA button
- 1-hour expiration notice
- Security warning
- Alternative link option

---

### 2. `confirm-signup.html`
**Purpose**: Email confirmation after account creation

**Supabase Variable**: `{{ .ConfirmationURL }}`

**Used for**: New user email verification

**Key Features**:
- Welcome message
- Feature highlights box (chalk-dark background)
- 24-hour expiration notice
- Onboarding tone

---

### 3. `change-email.html`
**Purpose**: Confirm email address change

**Supabase Variable**: `{{ .ConfirmationURL }}`

**Used for**: Email change verification

**Key Features**:
- Clear explanation of the change
- Security notice with contact-support guidance
- Alternative link option

---

### 4. `trustpilot-review.html`
**Purpose**: Request Trustpilot review after PDF download

**Custom Variables**: `{{ .ReviewURL }}`, `{{ .UnsubscribeURL }}`, `{{ .SiteURL }}`

**Used for**: Post-download review solicitation (sent via edge function, NOT Supabase Auth)

**Key Features**:
- Warm, non-pushy tone
- Unicode star rating visual (email-safe, no images)
- Social proof callout
- Unsubscribe link

---

## How to Use These Templates in Supabase

### Step 1: Access Email Templates
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**

### Step 2: Configure Each Auth Template

#### Magic Link (Email OTP)
1. Select "Magic Link" template
2. Copy content from `email-templates/magic-link.html`
3. Paste into "Message Body (HTML)"
4. **Subject line**: `Sign in to EasyFreeResume`
5. Save changes

#### Confirm Signup
1. Select "Confirm Signup" template
2. Copy content from `email-templates/confirm-signup.html`
3. Paste into "Message Body (HTML)"
4. **Subject line**: `Welcome to EasyFreeResume - Confirm your email`
5. Save changes

#### Change Email
1. Select "Change Email" template
2. Copy content from `email-templates/change-email.html`
3. Paste into "Message Body (HTML)"
4. **Subject line**: `Confirm your new email - EasyFreeResume`
5. Save changes

> **Note**: `trustpilot-review.html` is not a Supabase Auth template. It is sent via a backend edge function after PDF download.

---

## Supabase Template Variables

**Quick Reference:**

| Variable | Used? | Purpose |
|----------|-------|---------|
| `{{ .ConfirmationURL }}` | Yes | Action button/link (auth templates) |
| `{{ .Email }}` | Yes | User's email (auth templates) |
| `{{ .SiteURL }}` | Yes | Footer links (all templates) |
| `{{ .Token }}` | No | Not needed |
| `{{ .TokenHash }}` | No | Internal use only |
| `{{ .RedirectTo }}` | No | Future use |
| `{{ .Data }}` | No | Future use |

**For complete variable documentation, see:** [`VARIABLES.md`](./VARIABLES.md)

**Important**: Always use `{{ .ConfirmationURL }}` for action links. It's pre-built with all necessary parameters.

---

## Creating New Email Templates

When creating a new transactional email, follow this structure:

### 1. Use the Base Template

Start with `base-template.html` as your foundation. It includes:
- Responsive design
- Brand colors (ink header, accent CTA)
- 4px green accent bar
- Footer with links
- Mobile optimization

### 2. Template Structure

```html
<!-- Accent bar -->
<tr>
  <td class="accent-bar">&nbsp;</td>
</tr>

<!-- Header: Ink background -->
<tr>
  <td class="header">
    <h1 class="logo-text">EasyFreeResume</h1>
  </td>
</tr>

<!-- Content: Main message -->
<tr>
  <td class="content">
    <h2 class="greeting">Heading Here</h2>
    <p class="message">Message text...</p>

    <!-- CTA Button -->
    <div class="button-container">
      <!-- MSO/VML fallback for Outlook -->
      <!-- Standard table-based button -->
    </div>

    <!-- Alternative link (optional) -->
    <div class="alt-link">...</div>

    <!-- Security notice (if applicable) -->
    <div class="security-notice">...</div>
  </td>
</tr>

<!-- Footer: Standard -->
<tr>
  <td class="footer">...</td>
</tr>
```

### 3. CSS Classes Reference

| Class | Purpose | Style |
|-------|---------|-------|
| `.accent-bar` | Brand accent strip | 4px tall, accent green (#00d47e) |
| `.header` | Brand header | Solid ink (#0c0c0c) background |
| `.logo-text` | Company name | White, bold, 26px |
| `.content` | Main body | Padded container |
| `.greeting` | H2 heading | 24px, 700 weight, ink (#0c0c0c) |
| `.message` | Body text | 16px, #4b5563 |
| `.button-td` | CTA button cell | Accent green, 12px radius, shadow |
| `.button-link` | CTA button text | 700 weight, ink (#0c0c0c) |
| `.button-container` | Button wrapper | Centered |
| `.alt-link` | Fallback link | Chalk-dark (#f0efe9) box |
| `.security-notice` | Warning box | Amber background, left border |
| `.feature-box` | Highlight box | Chalk-dark (#f0efe9) background |
| `.footer` | Bottom section | Mist (#a8a4a0) text, links |

### 4. Design Guidelines

**Do:**
- Use ink (#0c0c0c) for the header background
- Use accent green (#00d47e) for CTA buttons only
- Keep messaging concise and action-focused
- Include alternative text link for accessibility
- Add security notices for sensitive actions
- Test on mobile (320px width minimum)
- Use semantic HTML for screen readers

**Don't:**
- Use external images (inline SVG or data URIs only)
- Rely on JavaScript (not supported in email)
- Use complex CSS (many clients strip it)
- Include forms (link to app instead)
- Exceed 600px width for main container
- Use accent green for large surfaces or backgrounds

### 5. CSS Inlining Strategy

**Automated Build Process** (All templates use this)

We use an automated CSS inliner to eliminate manual style duplication:

```bash
cd email-templates
npm install        # Install dependencies (juice, fs-extra)
npm run build      # Build templates with inlined CSS
```

**How It Works:**

1. **Source Templates** (`src/`): Clean HTML with styles only in `<style>` blocks
   - Easy to maintain - edit styles in ONE place
   - No manual inline style duplication
   - Example: `src/magic-link.html`

2. **Build Process**: Automated CSS inlining with [juice](https://github.com/Automattic/juice)
   - Reads source templates from `src/`
   - Automatically inlines all CSS into `style=""` attributes
   - Preserves `<style>` block for modern email clients
   - Adds email client compatibility styles (-webkit, -ms, mso)
   - Writes production-ready templates to root directory

3. **Built Templates** (root directory): Production-ready with inlined CSS
   - These are what you copy-paste into Supabase
   - Fully compatible with all email clients
   - Committed to version control

**Development Workflow:**

```bash
# 1. Edit source template (no inline styles needed!)
vim src/magic-link.html

# 2. Build to generate production template
npm run build

# 3. Copy built template from root directory
cat magic-link.html  # This has inlined CSS

# 4. Paste into Supabase Email Templates dashboard
```

**Build Status:**
- `magic-link.html` - Automated build
- `confirm-signup.html` - Automated build
- `change-email.html` - Automated build
- `trustpilot-review.html` - Automated build

### 6. Testing Checklist

Before deploying a new template:

- [ ] Test in Gmail (Desktop & Mobile)
- [ ] Test in Outlook (Desktop)
- [ ] Test in Apple Mail (iOS & macOS)
- [ ] Test in Yahoo Mail
- [ ] Verify all links work
- [ ] Check responsive design (320px to 600px)
- [ ] Validate HTML (no unclosed tags)
- [ ] Test with long text content
- [ ] Verify Supabase variables render correctly
- [ ] Check dark mode appearance
- [ ] Verify inline styles match `<style>` block definitions

---

## Technical Implementation Notes

### Button Rendering
Our email buttons use the **"bulletproof button"** pattern for maximum compatibility:

- **Table-based structure**: Uses nested `<table>` with `<td>` instead of `<a>` with background
- **VML for Outlook**: MSO conditional comments provide Vector Markup Language (VML) fallback for Outlook
- **Solid background-color**: No gradients (Gmail strips them); solid accent green is universally supported
- **Box-shadow placement**: Applied to `<td>` (not `<a>`) to match `border-radius` container

**Why This Matters**:
- Yahoo Mail has poor CSS support and often doesn't render `display: inline-block` buttons correctly
- Outlook uses Microsoft Word's rendering engine, which doesn't support standard CSS
- Table-based buttons work across all major email clients

### Dark Mode Handling
All templates include `<meta name="color-scheme" content="light">` and `<meta name="supported-color-schemes" content="light">` to opt out of automatic dark mode color inversion, which can break the ink header and accent colors.

### Outlook DPI
All templates include MSO `OfficeDocumentSettings` with `PixelsPerInch: 96` to prevent Outlook from applying DPI scaling that distorts the layout.

---

## Email Best Practices

### Subject Lines
- Keep under 50 characters
- Front-load important words
- Use action verbs
- Include brand name for recognition
- Avoid spam trigger words (FREE, URGENT, ACT NOW)

### Content
- Lead with the action (don't bury the CTA)
- Use short paragraphs (2-3 sentences max)
- One primary action per email
- Include preview text (first 50-100 characters)
- Make security notices prominent

### Accessibility
- Use semantic HTML (`<h2>`, `<p>`, `<a>`)
- Include alt text for all images
- Maintain color contrast (WCAG AA minimum)
- Don't rely solely on color to convey information
- Use descriptive link text (not "click here")

### Deliverability
- Authenticate your domain (SPF, DKIM, DMARC)
- Keep HTML under 102KB
- Maintain text-to-image ratio (60:40)
- Include plain text version (Supabase auto-generates)
- Test spam score before sending

---

## Troubleshooting

### Issue: Links not working
**Solution**: Verify `{{ .ConfirmationURL }}` is used correctly. Check Supabase redirect URLs.

### Issue: Styling broken in Gmail
**Solution**: Gmail strips `<style>` tags in some clients. All templates use automated CSS inlining via `npm run build` to guarantee inline styles on every element.

### Issue: Images not loading
**Solution**: Don't use external images. Use data URIs, inline SVG, or Unicode characters.

### Issue: Emails going to spam
**Solution**:
1. Configure SPF/DKIM/DMARC records
2. Avoid spam trigger words
3. Maintain proper text-to-HTML ratio
4. Use reputable sending domain

---

## Version History

- **v2.0** (2026-04-13): Design system rebrand (purple → green)
  - Updated all templates to 2026 green design system
  - Ink (#0c0c0c) header + 4px accent (#00d47e) bar
  - Solid green CTA buttons (no gradient)
  - All 4 templates now use automated CSS inlining build
  - Added change-email to build pipeline (was manual)
  - Added dark mode opt-out meta tags
  - Added MSO DPI settings to all templates
  - New: Trustpilot review request template
  - Removed: reset-password template (app uses magic link / SSO only)
- **v1.0** (2025-01-22): Initial branded templates created
  - Magic Link
  - Confirm Signup
  - Reset Password
  - Change Email
