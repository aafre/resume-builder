# Email Templates for EasyFreeResume

This directory contains branded, reusable email templates for all transactional emails sent by the application.

## Design System

All templates follow the EasyFreeResume design language:

- **Color Scheme**: Blue (#2563eb) → Purple (#9333ea) → Indigo (#4f46e5) gradient
- **Typography**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Border Radius**: 12px for buttons, 8px for boxes
- **Spacing**: Generous padding (40px desktop, 30px mobile)
- **Shadows**: Subtle elevation with box-shadow

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
- Feature highlights box
- 24-hour expiration notice
- Onboarding tone

---

### 3. `reset-password.html`
**Purpose**: Password reset flow

**Supabase Variable**: `{{ .ConfirmationURL }}`

**Used for**: Password recovery

**Key Features**:
- Security-focused messaging
- Clear instructions
- 1-hour expiration
- Warning about phishing

---

### 4. `change-email.html`
**Purpose**: Email address change confirmation

**Supabase Variable**: `{{ .ConfirmationURL }}`

**Used for**: Verifying new email when user changes it

**Key Features**:
- Confirmation focus
- Security notice
- Contact support prompt

---

## How to Use These Templates in Supabase

### Step 1: Access Email Templates
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `mgetvioaymkvafczmhwo`
3. Navigate to **Authentication** → **Email Templates**

### Step 2: Configure Each Template

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

#### Reset Password (Recovery)
1. Select "Reset Password" template
2. Copy content from `email-templates/reset-password.html`
3. Paste into "Message Body (HTML)"
4. **Subject line**: `Reset your EasyFreeResume password`
5. Save changes

#### Change Email
1. Select "Change Email" template
2. Copy content from `email-templates/change-email.html`
3. Paste into "Message Body (HTML)"
4. **Subject line**: `Confirm your new email - EasyFreeResume`
5. Save changes

---

## Supabase Template Variables

**Quick Reference:**

| Variable | Used? | Purpose |
|----------|-------|---------|
| `{{ .ConfirmationURL }}` | ✅ **YES** | Action button/link (all templates) |
| `{{ .Email }}` | ✅ **YES** | User's email (all templates) |
| `{{ .SiteURL }}` | ✅ **YES** | Footer links (all templates) |
| `{{ .Token }}` | ❌ No | Not needed |
| `{{ .TokenHash }}` | ❌ No | Internal use only |
| `{{ .RedirectTo }}` | ❌ No | Future use |
| `{{ .Data }}` | ❌ No | Future use |

**For complete variable documentation, see:** [`VARIABLES.md`](./VARIABLES.md)

**Important**: Always use `{{ .ConfirmationURL }}` for action links. It's pre-built with all necessary parameters.

---

## Creating New Email Templates

When creating a new transactional email, follow this structure:

### 1. Use the Base Template

Start with `base-template.html` as your foundation. It includes:
- Responsive design
- Brand colors and gradients
- Header with logo
- Footer with links
- Mobile optimization

### 2. Template Structure

```html
<!-- Header: Brand gradient -->
<div class="header-gradient">
  <h1 class="logo-text">EasyFreeResume</h1>
</div>

<!-- Content: Main message -->
<div class="content">
  <h2 class="greeting">Heading Here</h2>
  <p class="message">Message text...</p>

  <!-- CTA Button -->
  <div class="button-container">
    <a href="[ACTION_URL]" class="button">Button Text</a>
  </div>

  <!-- Alternative link (optional) -->
  <div class="alt-link">...</div>

  <!-- Security notice (if applicable) -->
  <div class="security-notice">...</div>
</div>

<!-- Footer: Standard -->
<div class="footer">...</div>
```

### 3. CSS Classes Reference

| Class | Purpose | Style |
|-------|---------|-------|
| `.header-gradient` | Top brand bar | Blue-purple-indigo gradient |
| `.logo-text` | Company name | White, bold, 28px |
| `.content` | Main body | Padded container |
| `.greeting` | H2 heading | 24px, bold, dark gray |
| `.message` | Body text | 16px, medium gray |
| `.button` | Primary CTA | Gradient, rounded, shadow |
| `.button-container` | Button wrapper | Centered |
| `.alt-link` | Fallback link | Light gray box |
| `.security-notice` | Warning box | Yellow background, border |
| `.feature-box` | Highlight box | Light gradient background |
| `.footer` | Bottom section | Gray text, links |

### 4. Design Guidelines

**Do:**
- ✅ Use the gradient for headers and primary buttons
- ✅ Keep messaging concise and action-focused
- ✅ Include alternative text link for accessibility
- ✅ Add security notices for sensitive actions
- ✅ Test on mobile (320px width minimum)
- ✅ Use semantic HTML for screen readers

**Don't:**
- ❌ Use external images (inline SVG or data URIs only)
- ❌ Rely on JavaScript (not supported in email)
- ❌ Use complex CSS (many clients strip it)
- ❌ Include forms (link to app instead)
- ❌ Exceed 600px width for main container

### 5. CSS Inlining Strategy

**⚡ Automated Build Process** (Recommended for new/updated templates)

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

**Benefits:**
- ✅ **Single source of truth**: Edit styles once in `<style>` block
- ✅ **Zero manual duplication**: Build script handles inlining
- ✅ **No human error**: Impossible to forget updating inline styles
- ✅ **Version controlled**: Both source and built templates tracked in git
- ✅ **Email client compatible**: Automatic `-webkit-`, `-ms-`, `mso-` prefixes

**Migration Status:**
- ✅ `magic-link.html` - Migrated to build process
- ⏳ `confirm-signup.html` - Manual inline styles (to be migrated)
- ⏳ `reset-password.html` - Manual inline styles (to be migrated)
- ⏳ `change-email.html` - Manual inline styles (to be migrated)
- ⏳ `base-template.html` - Reference template (to be migrated)

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
- **Fallback colors**: Solid `background-color` before `linear-gradient` for clients without gradient support
- **Box-shadow placement**: Applied to `<td>` (not `<a>`) to match `border-radius` container and prevent rectangular shadows on rounded buttons

**Why This Matters**:
- Yahoo Mail has poor CSS support and often doesn't render `display: inline-block` buttons correctly
- Outlook uses Microsoft Word's rendering engine, which doesn't support standard CSS
- Table-based buttons work across all major email clients

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

## Customization for Different Environments

### Development
Update URLs in templates for local testing:
```html
<a href="https://easyfreeresume.com">Home</a>
<!-- Change to: -->
<a href="http://localhost:5173">Home</a>
```

### Staging
Use staging domain:
```html
<a href="https://staging.easyfreeresume.com">Home</a>
```

### Production
Use production domain:
```html
<a href="https://easyfreeresume.com">Home</a>
```

---

## Troubleshooting

### Issue: Links not working
**Solution**: Verify `{{ .ConfirmationURL }}` is used correctly. Check Supabase redirect URLs.

### Issue: Styling broken in Gmail
**Solution**: Gmail strips `<style>` tags in some clients. Use inline styles as fallback.

### Issue: Images not loading
**Solution**: Don't use external images. Use data URIs or inline SVG.

### Issue: Emails going to spam
**Solution**:
1. Configure SPF/DKIM/DMARC records
2. Avoid spam trigger words
3. Maintain proper text-to-HTML ratio
4. Use reputable sending domain

---

## Support

For questions or issues with email templates:
1. Check Supabase [Email Template Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
2. Review [Email on Acid](https://www.emailonacid.com/) for testing
3. Consult team documentation

---

## Version History

- **v1.0** (2025-01-22): Initial branded templates created
  - Magic Link
  - Confirm Signup
  - Reset Password
  - Change Email
