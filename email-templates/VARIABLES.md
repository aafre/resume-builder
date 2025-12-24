# Supabase Email Template Variables - Usage Guide

## Quick Reference Table

| Variable | Used? | Where | Purpose |
|----------|-------|-------|---------|
| `{{ .ConfirmationURL }}` | ✅ **YES** | All 4 templates | Action button/link |
| `{{ .Email }}` | ✅ **YES** | All 4 templates | Personalization & security |
| `{{ .SiteURL }}` | ✅ **YES** | All 4 templates | Footer links |
| `{{ .Token }}` | ❌ No | - | Not needed (URL includes it) |
| `{{ .TokenHash }}` | ❌ No | - | Internal use only |
| `{{ .RedirectTo }}` | ❌ No | - | Future use case |
| `{{ .Data }}` | ❌ No | - | Future use case |

---

## Variable Details

### 1. `{{ .ConfirmationURL }}` ✅ ESSENTIAL

**What it is:**
Complete, pre-built URL with all security tokens and parameters.

**Example output:**
```
https://easyfreeresume.com/auth/confirm?token=pkce_xyz123...&type=signup&redirect_to=/editor
```

**Where we use it:**
- ✅ `magic-link.html` - Line 56 (Sign in button)
- ✅ `confirm-signup.html` - Line 55 (Confirm email button)
- ✅ `reset-password.html` - Line 53 (Reset password button)
- ✅ `change-email.html` - Line 53 (Confirm new email button)

**Why we use it:**
- It's the complete action link - no manual URL construction needed
- Includes PKCE tokens for security
- Handles redirect logic automatically
- Works across dev/staging/prod environments

**Usage pattern:**
```html
<a href="{{ .ConfirmationURL }}" class="button">
  Your Action Text
</a>
```

---

### 2. `{{ .Email }}` ✅ RECOMMENDED

**What it is:**
The user's email address.

**Example output:**
```
user@example.com
```

**Where we use it:**
- ✅ `magic-link.html` - Line 49 (Shows which account is signing in)
- ✅ `confirm-signup.html` - Line 51 (Confirms account email)
- ✅ `reset-password.html` - Line 49 (Security confirmation)
- ✅ `change-email.html` - Line 49 (Shows NEW email being confirmed)

**Why we use it:**
- **Security**: Users see which email is affected
- **Clarity**: Confirms the right account in multi-account scenarios
- **Trust**: Professional, transparent communication
- **Phishing prevention**: Users can verify if email is legitimate

**Usage pattern:**
```html
<p class="message">
  We sent this to <strong>{{ .Email }}</strong>.
</p>
```

**Security benefit example:**
```
❌ Without {{ .Email }}:
"Reset your password"
(Which account? User might ignore if they have multiple)

✅ With {{ .Email }}:
"Reset password for user@work.com"
(User immediately knows which account - acts faster)
```

---

### 3. `{{ .SiteURL }}` ✅ RECOMMENDED

**What it is:**
Your application's base URL (without trailing slash).

**Example output:**
- Development: `http://localhost:5173`
- Staging: `https://staging.easyfreeresume.com`
- Production: `https://easyfreeresume.com`

**Where we use it:**
- ✅ All 4 templates - Footer links (Home, About, Contact, Privacy)

**Why we use it:**
- **Environment-aware**: Same template works in dev/staging/prod
- **No hardcoding**: Update once in Supabase settings, not in 4 templates
- **Consistency**: All links automatically match your environment

**Usage pattern:**
```html
<div class="footer-links">
  <a href="{{ .SiteURL }}">Home</a>
  <a href="{{ .SiteURL }}/about">About</a>
  <a href="{{ .SiteURL }}/contact">Contact</a>
  <a href="{{ .SiteURL }}/privacy">Privacy</a>
</div>
```

**Before vs After:**
```html
<!-- ❌ BEFORE: Hardcoded (bad for dev/staging) -->
<a href="https://easyfreeresume.com">Home</a>

<!-- ✅ AFTER: Environment-aware (works everywhere) -->
<a href="{{ .SiteURL }}">Home</a>
```

---

## Variables We DON'T Use

### 4. `{{ .Token }}` ❌ NOT NEEDED

**What it is:**
Raw token string (e.g., `pkce_xyz123abc...`)

**Why we don't use it:**
- `{{ .ConfirmationURL }}` already includes the token
- Manual URL construction is error-prone
- Security risk if used incorrectly

**When you WOULD use it:**
Only if you need to build custom URLs or show token for debugging (never in production).

---

### 5. `{{ .TokenHash }}` ❌ NOT NEEDED

**What it is:**
Hashed version of the token (used internally by Supabase)

**Why we don't use it:**
- Internal implementation detail
- Not meant for email templates
- No user-facing use case

---

### 6. `{{ .RedirectTo }}` ❌ NOT USED (Yet)

**What it is:**
Custom redirect path after confirmation (e.g., `/editor`, `/dashboard`)

**Example output:**
```
/my-resumes
```

**Why we don't use it YET:**
- Not needed for our current flow
- Could be useful in future for dynamic messaging

**Future use case example:**
```html
<p class="message">
  After confirming, you'll be redirected to {{ .RedirectTo }}.
</p>
```

**When to use:**
- If you want to show users where they'll land after confirmation
- For dynamic messaging based on redirect destination
- Advanced onboarding flows

---

### 7. `{{ .Data }}` ❌ NOT USED (Yet)

**What it is:**
Custom metadata passed during signup/signin.

**Example (if you pass data in code):**
```javascript
// Frontend code
await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      first_name: 'John',
      plan: 'premium'
    }
  }
})
```

**Then in email template:**
```html
<p>Welcome, {{ .Data.first_name }}!</p>
<p>You selected the {{ .Data.plan }} plan.</p>
```

**Why we don't use it:**
- We use anonymous auth (no signup form with custom data)
- Current flow doesn't pass metadata
- Could be useful for future personalization

**Future use case:**
- Personalized welcome emails
- Plan-specific onboarding
- A/B testing different email copy

---

## Template-by-Template Breakdown

### Magic Link (`magic-link.html`)

**Variables used:**
1. `{{ .ConfirmationURL }}` - Sign-in button
2. `{{ .Email }}` - Shows which email is signing in
3. `{{ .SiteURL }}` - Footer links

**Content structure:**
```
Subject: Sign in to EasyFreeResume

Body:
- "We received a request to sign in using {{ .Email }}"
- [Button: {{ .ConfirmationURL }}]
- Alt link: {{ .ConfirmationURL }}
- Security notice
- Footer: {{ .SiteURL }} links
```

---

### Confirm Signup (`confirm-signup.html`)

**Variables used:**
1. `{{ .ConfirmationURL }}` - Confirmation button
2. `{{ .Email }}` - Shows account email
3. `{{ .SiteURL }}` - Footer links

**Content structure:**
```
Subject: Welcome to EasyFreeResume - Confirm your email

Body:
- "Thanks for creating account with {{ .Email }}"
- [Button: {{ .ConfirmationURL }}]
- Feature highlights box
- Alt link: {{ .ConfirmationURL }}
- Security notice
- Footer: {{ .SiteURL }} links
```

---

### Reset Password (`reset-password.html`)

**Variables used:**
1. `{{ .ConfirmationURL }}` - Reset button
2. `{{ .Email }}` - Security confirmation
3. `{{ .SiteURL }}` - Footer links

**Content structure:**
```
Subject: Reset your EasyFreeResume password

Body:
- "Reset password for {{ .Email }}"
- [Button: {{ .ConfirmationURL }}]
- Alt link: {{ .ConfirmationURL }}
- Strong security warning
- Footer: {{ .SiteURL }} links
```

---

### Change Email (`change-email.html`)

**Variables used:**
1. `{{ .ConfirmationURL }}` - Confirmation button
2. `{{ .Email }}` - Shows NEW email
3. `{{ .SiteURL }}` - Footer links

**Content structure:**
```
Subject: Confirm your new email - EasyFreeResume

Body:
- "Change email to {{ .Email }}"
- [Button: {{ .ConfirmationURL }}]
- Alt link: {{ .ConfirmationURL }}
- Security notice
- Footer: {{ .SiteURL }} links
```

---

## Configuration in Supabase

### Where variables come from:

1. **`{{ .ConfirmationURL }}`** - Auto-generated by Supabase
2. **`{{ .Email }}`** - From user's email address
3. **`{{ .SiteURL }}`** - Set in: **Authentication → URL Configuration → Site URL**
4. **`{{ .RedirectTo }}`** - Passed in auth call: `redirectTo: '/editor'`
5. **`{{ .Data }}`** - Passed in signup: `data: { key: value }`

### Set your Site URL:

1. Go to Supabase Dashboard
2. **Authentication → URL Configuration**
3. Set **Site URL**:
   - Dev: `http://localhost:5173`
   - Prod: `https://easyfreeresume.com`
4. This automatically populates `{{ .SiteURL }}` in all emails

---

## Testing Variables

### Test in Supabase Dashboard:

1. Go to **Authentication → Email Templates**
2. Select any template
3. Click **"Send test email"**
4. Enter your email
5. Check inbox and verify:
   - ✅ `{{ .Email }}` shows your test email
   - ✅ `{{ .ConfirmationURL }}` is a working link
   - ✅ `{{ .SiteURL }}` footer links work
   - ✅ No raw `{{ }}` variables visible

### Variables in test email:

```
{{ .Email }} → test@example.com
{{ .ConfirmationURL }} → https://your-project.supabase.co/auth/v1/verify?token=xyz...
{{ .SiteURL }} → https://easyfreeresume.com
```

---

## Common Mistakes

### ❌ Wrong variable syntax:

```html
<!-- WRONG: No dot -->
{{ Email }}

<!-- WRONG: Wrong case -->
{{ .email }}

<!-- WRONG: Quotes -->
"{{ .Email }}"

<!-- ✅ CORRECT -->
{{ .Email }}
```

### ❌ Building URLs manually:

```html
<!-- WRONG: Don't build URLs manually -->
<a href="{{ .SiteURL }}/auth/confirm?token={{ .Token }}">

<!-- ✅ CORRECT: Use ConfirmationURL -->
<a href="{{ .ConfirmationURL }}">
```

### ❌ Missing SiteURL configuration:

If you see this in your email:
```
Home: /
```

**Problem**: `{{ .SiteURL }}` is empty

**Solution**:
1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to your domain
3. Re-send test email

---

## Summary

**Use these 3 variables in ALL templates:**
1. ✅ `{{ .ConfirmationURL }}` - For all action buttons/links
2. ✅ `{{ .Email }}` - For personalization and security
3. ✅ `{{ .SiteURL }}` - For footer links

**Ignore these variables (for now):**
- ❌ `{{ .Token }}` - Already in ConfirmationURL
- ❌ `{{ .TokenHash }}` - Internal use
- ❌ `{{ .RedirectTo }}` - Future enhancement
- ❌ `{{ .Data }}` - Future enhancement

**Result:**
- Professional, personalized emails
- Works in dev/staging/prod without changes
- Secure and user-friendly
- Easy to maintain

---

**Questions?** Check [Supabase Email Template Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
