# OAuth Quick Start Guide

**Time to complete:** 15-20 minutes
**Environment:** Development

This is a streamlined guide to get Google and LinkedIn OAuth working quickly. For full details, see `OAUTH_SETUP_GUIDE.md`.

---

## Prerequisites

Before you start, get your Supabase callback URL:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Go to **Authentication → Providers**
4. Your callback URL is at the top of any provider settings
5. **Copy this URL** - format: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`

**Example:** `https://mgetvioaymkvafczmhwo.supabase.co/auth/v1/callback`

---

## Part 1: Google OAuth (10 minutes)

### Step 1: Google Cloud Console Setup

1. **Create Project:**
   - Go to [console.cloud.google.com](https://console.cloud.google.com/)
   - Click project dropdown → "New Project"
   - Name: `Resume Builder`
   - Click "Create"

2. **Enable Google+ API:**
   - Go to APIs & Services → Library
   - Search "Google+ API"
   - Click "Enable"

3. **OAuth Consent Screen:**
   - Go to APIs & Services → OAuth consent screen
   - User Type: **External** → Create
   - **App Information:**
     - App name: `EasyFreeResume`
     - User support email: (your email)
     - App home page: `https://easyfreeresume.com` ⚠️ (localhost not allowed - use placeholder)
     - Privacy policy: `https://easyfreeresume.com/privacy` (placeholder OK)
     - Terms of service: `https://easyfreeresume.com/terms` (placeholder OK)
     - Developer contact: (your email)
   - Save and Continue
   - **Scopes:** Click "Add or Remove Scopes"
     - Select: `openid`, `userinfo.email`, `userinfo.profile`
     - Update → Save and Continue
   - **Test users:** Add your email → Save and Continue
   - Back to Dashboard

4. **Create OAuth Client:**
   - Go to APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: **Web application**
   - Name: `Resume Builder Web`
   - Authorized redirect URIs: **Add your Supabase callback URL**
     - Example: `https://mgetvioaymkvafczmhwo.supabase.co/auth/v1/callback`
   - Click "Create"
   - **Copy Client ID and Client Secret** (save them!)

### Step 2: Configure in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **Authentication → Providers**
3. Find **Google** → Click to expand
4. **Enable Sign in with Google**: Toggle ON
5. **Client ID**: Paste from Google Cloud Console
6. **Client Secret**: Paste from Google Cloud Console
7. Click **Save**

### Step 3: Test Google OAuth

1. In Supabase, go to **Authentication → URL Configuration**
2. Set **Site URL**: `http://localhost:5173`
3. Add redirect URL: `http://localhost:5173/*`
4. Save

5. Start your dev server:
   ```bash
   cd resume-builder-ui
   npm run dev
   ```

6. Open `http://localhost:5173`
7. Click "Sign In" → "Continue with Google"
8. Sign in with your Google account
9. You should be redirected to `/editor`

**Troubleshooting:**
- If you get "access_denied": Make sure you added yourself as a test user in step 1.3
- If redirect fails: Double-check callback URL matches exactly

---

## Part 2: LinkedIn OAuth (10 minutes)

### Step 1: LinkedIn Developer Portal Setup

1. **Create LinkedIn Page** (if you don't have one):
   - Go to [linkedin.com/company/setup](https://www.linkedin.com/company/setup/new/)
   - Create a company page (can be minimal for testing)

2. **Create App:**
   - Go to [developers.linkedin.com/apps](https://www.linkedin.com/developers/apps)
   - Click "Create app"
   - App name: `EasyFreeResume`
   - LinkedIn Page: Select the page you created
   - App logo: Upload any logo (300x300 px)
   - Agree to terms → Create app

3. **Configure App:**
   - Go to **Settings** tab
   - Privacy policy URL: `https://easyfreeresume.com/privacy` (placeholder OK for dev)
   - Click "Update"

4. **Add Redirect URL:**
   - Go to **Auth** tab
   - Find "OAuth 2.0 settings"
   - Redirect URLs: Click "Add redirect URL"
   - **Add your Supabase callback URL**
     - Example: `https://mgetvioaymkvafczmhwo.supabase.co/auth/v1/callback`
   - Click "Update"

5. **Request Product Access:**
   - Go to **Products** tab
   - Find "Sign In with LinkedIn using OpenID Connect"
   - Click "Request access"
   - Fill form (simple explanation about auth)
   - Submit
   - **Wait for approval** (usually instant, check for green checkmark)

6. **Get Credentials:**
   - Go back to **Auth** tab
   - Under "Application credentials":
   - **Client ID**: Copy this
   - **Client Secret**: Click "Show" → Copy this

### Step 2: Configure in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **Authentication → Providers**
3. Find **LinkedIn (OIDC)** → Click to expand
4. **Enable Sign in with LinkedIn**: Toggle ON
5. **Client ID**: Paste from LinkedIn
6. **Client Secret**: Paste from LinkedIn
7. Click **Save**

### Step 3: Test LinkedIn OAuth

1. Site URL should already be set to `http://localhost:5173` (from Google setup)
2. Start dev server if not running:
   ```bash
   cd resume-builder-ui
   npm run dev
   ```

3. Open `http://localhost:5173`
4. Click "Sign In" → "Continue with LinkedIn"
5. Authorize the app
6. You should be redirected to `/editor`

**Troubleshooting:**
- If you get "Product not approved": Wait a few minutes and try again
- If redirect fails: Verify callback URL in LinkedIn Auth tab

---

## Part 3: Verification

### Check Users in Supabase

1. Go to **Authentication → Users**
2. You should see:
   - User with provider: `google`
   - User with provider: `linkedin_oidc`
   - Both should show your email

### Test Full Flow

1. **Sign out** in the app
2. Sign in with Google → Should work
3. **Sign out** again
4. Sign in with LinkedIn → Should work
5. **Sign out** again
6. Sign in with Magic Link → Should work

All three methods should create/use the same user account if they use the same email address.

---

## Next Steps

### For Development:
- ✅ You're all set! OAuth is working locally
- Continue building features

### For Production:
When ready to deploy, you'll need to:

1. **Google:**
   - Add production domain to OAuth consent screen
   - Update Site URL in Supabase to production domain
   - Optionally: Publish app or submit for verification

2. **LinkedIn:**
   - Add production privacy policy URL
   - Update Site URL in Supabase to production domain

3. **Both:**
   - Callback URL stays the same (Supabase URL doesn't change)
   - See `OAUTH_SETUP_GUIDE.md` Part 3 for full production deployment

---

## Quick Reference Card

**Copy this for easy access:**

```
Supabase Callback URL:
https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback

Google Cloud Console:
https://console.cloud.google.com/apis/credentials

LinkedIn Developer Portal:
https://www.linkedin.com/developers/apps

Supabase Auth Providers:
https://supabase.com/dashboard → Authentication → Providers
```

**Where to add callback URL:**
- Google: Credentials → OAuth Client → Authorized redirect URIs
- LinkedIn: App → Auth → Redirect URLs

**Required for testing:**
- Google: Add yourself as test user, OR publish app
- LinkedIn: "Sign In with LinkedIn" product must be approved

---

## Support

**Issues?**
- Full troubleshooting: See `OAUTH_SETUP_GUIDE.md` Part 6
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- Google OAuth Help: [support.google.com/cloud](https://support.google.com/cloud/answer/6158849)
- LinkedIn Support: [LinkedIn OAuth Docs](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)

---

**Last Updated:** 2025-12-23
