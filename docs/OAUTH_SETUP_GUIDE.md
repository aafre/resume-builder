# OAuth Setup Guide - Google & LinkedIn

**Version:** 1.0
**Last Updated:** 2025-12-23
**Environment:** Development & Production

This guide provides step-by-step instructions for setting up Google and LinkedIn OAuth authentication for the Resume Builder application.

---

## Prerequisites

- [ ] Supabase project created and configured
- [ ] Access to Google Cloud Console
- [ ] Access to LinkedIn Developer Portal
- [ ] Your application's Site URL configured in Supabase

---

## Part 1: Google OAuth Setup

### 1.1 Create Google OAuth Credentials

#### Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one:
   - Click the project dropdown at the top
   - Click **"New Project"**
   - Name: `Resume Builder` (or your choice)
   - Click **"Create"**

#### Step 2: Enable Google+ API (Required for OAuth)

1. In the left sidebar, go to **APIs & Services → Library**
2. Search for **"Google+ API"**
3. Click on **"Google+ API"**
4. Click **"Enable"** button
5. Wait for the API to be enabled (takes a few seconds)

**Note:** Even though Google+ is deprecated, the API is still required for OAuth user info.

#### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services → OAuth consent screen**
2. Choose **User Type**:
   - **External** (recommended for public apps)
   - Click **"Create"**

3. **App Information** (Page 1):
   - **App name**: `EasyFreeResume`
   - **User support email**: Your email address
   - **App logo** (optional): Upload your app logo (120x120 px minimum)
   - **Application home page**: ⚠️ **MUST be public URL (localhost not allowed)**
     - For dev: Use `https://github.com/yourusername/resume-builder` or `https://easyfreeresume.com`
     - For prod: `https://easyfreeresume.com`
     - Note: This is just for display - doesn't affect OAuth functionality
   - **Application privacy policy link**:
     - For dev: Use placeholder like `https://easyfreeresume.com/privacy` or `https://example.com/privacy`
     - For prod: `https://easyfreeresume.com/privacy`
   - **Application terms of service link**:
     - For dev: Use placeholder like `https://easyfreeresume.com/terms` or `https://example.com/terms`
     - For prod: `https://easyfreeresume.com/terms`
   - **Authorized domains**: Add:
     - `supabase.co` (required for callback)
     - Your production domain if available (e.g., `easyfreeresume.com`)
     - Note: Don't add localhost here - it won't work
   - **Developer contact information**: Your email address
   - Click **"Save and Continue"**

4. **Scopes** (Page 2):
   - Click **"Add or Remove Scopes"**
   - Select these scopes:
     - ✅ `openid`
     - ✅ `https://www.googleapis.com/auth/userinfo.email`
     - ✅ `https://www.googleapis.com/auth/userinfo.profile`
   - Click **"Update"**
   - Click **"Save and Continue"**

5. **Test Users** (Page 3) - Only if app is in "Testing" mode:
   - Click **"Add Users"**
   - Add your email addresses for testing
   - Click **"Save and Continue"**

6. **Summary** (Page 4):
   - Review all settings
   - Click **"Back to Dashboard"**

**Publishing Status:**
- While in "Testing" mode, only test users can sign in
- To allow anyone to sign in, click **"Publish App"** on the OAuth consent screen dashboard
- For public apps, you may need to go through Google's verification process (can take 3-7 days)

#### Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services → Credentials**
2. Click **"+ Create Credentials"** at the top
3. Select **"OAuth client ID"**

4. Configure OAuth client:
   - **Application type**: **Web application**
   - **Name**: `Resume Builder Web Client`

5. **Authorized JavaScript origins** (for local testing):
   - Add: `http://localhost:5173`
   - Add: `https://YOUR-PROJECT-REF.supabase.co`
   - Add: `https://easyfreeresume.com` (production)

6. **Authorized redirect URIs** (CRITICAL):
   - Add: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
   - Replace `YOUR-PROJECT-REF` with your actual Supabase project reference

   **Example:** If your Supabase URL is `https://mgetvioaymkvafczmhwo.supabase.co`, then use:
   ```
   https://mgetvioaymkvafczmhwo.supabase.co/auth/v1/callback
   ```

7. Click **"Create"**

8. **Save Your Credentials**:
   - A popup will appear with your credentials
   - **Client ID**: `1234567890-abcdefg.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-abcdefg1234567890`
   - Click **"Download JSON"** (optional, for backup)
   - Copy both values - you'll need them in the next step

**Security Note:** Keep your Client Secret private. Never commit it to version control.

### 1.2 Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication → Providers**
4. Find **Google** in the list
5. Click to expand Google settings

6. **Configuration**:
   - **Enable Sign in with Google**: Toggle **ON** (should turn green)
   - **Client ID (Google OAuth)**: Paste your Client ID from Google Cloud Console
   - **Client Secret (Google OAuth)**: Paste your Client Secret
   - **Authorized Client IDs**: Leave empty (only needed for mobile apps)
   - **Skip nonce check**: Leave **OFF** (recommended for security)

7. Click **"Save"**

8. **Verify Callback URL**:
   - Supabase will show you the callback URL at the top
   - It should match what you entered in Google Cloud Console
   - Example: `https://mgetvioaymkvafczmhwo.supabase.co/auth/v1/callback`

### 1.3 Test Google OAuth (Development)

1. **Update Site URL** in Supabase:
   - Go to **Authentication → URL Configuration**
   - **Site URL**: `http://localhost:5173`
   - **Redirect URLs**: Add `http://localhost:5173/*`
   - Click **"Save"**

2. **Start your development server**:
   ```bash
   cd resume-builder-ui
   npm run dev
   ```

3. **Test the flow**:
   - Open `http://localhost:5173`
   - Click "Sign In" or "Create Account"
   - Click "Continue with Google"
   - You should be redirected to Google sign-in
   - After signing in, you should be redirected back to `/editor`

4. **Verify in Supabase**:
   - Go to **Authentication → Users**
   - You should see a new user with:
     - Email from Google
     - Provider: `google`
     - Status: `Active`

**Troubleshooting:**
- **"redirect_uri_mismatch" error**: Check that the callback URL in Google Cloud Console exactly matches Supabase's callback URL
- **"Access blocked" error**: Make sure you added yourself as a test user in OAuth consent screen
- **Popup blocked**: Allow popups for localhost in your browser

---

## Part 2: LinkedIn OAuth Setup

### 2.1 Create LinkedIn OAuth App

#### Step 1: Access LinkedIn Developer Portal

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Sign in with your LinkedIn account
3. Click **"Create app"** button

#### Step 2: Create Your App

1. **App name**: `EasyFreeResume`
2. **LinkedIn Page**:
   - You need to create or link a LinkedIn Page (company page)
   - If you don't have one, click "Create a new LinkedIn Page"
   - Fill in company details (can be minimal for testing)
3. **App logo**: Upload your app logo (300x300 px minimum)
4. **Legal agreement**:
   - Check the box to agree to LinkedIn API Terms of Use
   - Click **"Create app"**

#### Step 3: Configure App Settings

1. You'll be taken to the app dashboard
2. Go to the **Settings** tab
3. **App settings**:
   - **Privacy policy URL**: `https://easyfreeresume.com/privacy`
   - **Application terms of service URL**: `https://easyfreeresume.com/terms`
   - Click **"Update"**

#### Step 4: Add OAuth Redirect URLs

1. Go to the **Auth** tab
2. Scroll to **OAuth 2.0 settings**
3. **Redirect URLs**:
   - Click **"+ Add redirect URL"**
   - Add: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
   - Replace `YOUR-PROJECT-REF` with your Supabase project reference

   **Example:** If your Supabase URL is `https://mgetvioaymkvafczmhwo.supabase.co`, then use:
   ```
   https://mgetvioaymkvafczmhwo.supabase.co/auth/v1/callback
   ```

4. Click **"Update"**

#### Step 5: Request Access to Sign In with LinkedIn

LinkedIn requires you to request access to use their OAuth product.

1. Go to the **Products** tab
2. Find **"Sign In with LinkedIn using OpenID Connect"**
3. Click **"Request access"** button
4. Fill out the request form:
   - **Why do you need this product?**:
     ```
     We need this product to allow users to sign in to our resume builder
     application using their LinkedIn credentials. This provides a seamless
     authentication experience for our professional user base.
     ```
   - **How will you use the data?**:
     ```
     We will only use the user's basic profile information (name, email)
     for authentication purposes and to personalize their experience.
     ```
5. Click **"Request access"**

**Approval Timeline:**
- For most apps, approval is **instant** (green checkmark appears immediately)
- In rare cases, it may take 24-48 hours
- You'll receive an email when approved

#### Step 6: Save Your Credentials

1. Go back to the **Auth** tab
2. Under **Application credentials**, you'll see:
   - **Client ID**: `78xxxxxxxxxxxxx`
   - **Client Secret**: Click **"Show"** to reveal it
3. **Copy both values** - you'll need them in the next step

**Security Note:** Keep your Client Secret private. Never commit it to version control.

### 2.2 Configure LinkedIn OAuth in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication → Providers**
4. Find **LinkedIn (OIDC)** in the list
5. Click to expand LinkedIn settings

6. **Configuration**:
   - **Enable Sign in with LinkedIn**: Toggle **ON** (should turn green)
   - **Client ID (LinkedIn OAuth)**: Paste your Client ID from LinkedIn
   - **Client Secret (LinkedIn OAuth)**: Paste your Client Secret
   - **Skip nonce check**: Leave **OFF** (recommended for security)

7. Click **"Save"**

8. **Verify Callback URL**:
   - Supabase will show you the callback URL at the top
   - It should match what you entered in LinkedIn Developer Portal
   - Example: `https://mgetvioaymkvafczmhwo.supabase.co/auth/v1/callback`

### 2.3 Test LinkedIn OAuth (Development)

1. **Ensure Site URL is configured** in Supabase:
   - Go to **Authentication → URL Configuration**
   - **Site URL**: `http://localhost:5173`
   - **Redirect URLs**: Add `http://localhost:5173/*`

2. **Start your development server**:
   ```bash
   cd resume-builder-ui
   npm run dev
   ```

3. **Test the flow**:
   - Open `http://localhost:5173`
   - Click "Sign In" or "Create Account"
   - Click "Continue with LinkedIn"
   - You should be redirected to LinkedIn authorization page
   - After authorizing, you should be redirected back to `/editor`

4. **Verify in Supabase**:
   - Go to **Authentication → Users**
   - You should see a new user with:
     - Email from LinkedIn
     - Provider: `linkedin_oidc`
     - Status: `Active`

**Troubleshooting:**
- **"Product not approved" error**: Wait for LinkedIn to approve "Sign In with LinkedIn using OpenID Connect" product
- **"redirect_uri_mismatch" error**: Check that the redirect URL in LinkedIn exactly matches Supabase's callback URL
- **"App in development mode" warning**: This is normal - you can still test with your own account

---

## Part 3: Production Deployment

### 3.1 Update Google OAuth for Production

1. **Add Production Domain to Google Cloud Console**:
   - Go to **OAuth consent screen**
   - Add your production domain to **Authorized domains**
   - Example: `easyfreeresume.com`

2. **Update OAuth Credentials**:
   - Go to **Credentials**
   - Edit your OAuth 2.0 Client
   - **Authorized JavaScript origins**: Add `https://easyfreeresume.com`
   - **Authorized redirect URIs**: Already configured (Supabase callback URL doesn't change)
   - Click **"Save"**

3. **Publish OAuth Consent Screen** (if not already published):
   - Go to **OAuth consent screen**
   - Click **"Publish app"**
   - For unverified apps, users will see a warning (can proceed anyway)
   - For verified apps, submit for Google verification (3-7 days process)

### 3.2 Update LinkedIn OAuth for Production

1. **Add Production Privacy Policy & Terms**:
   - Go to LinkedIn Developer Portal → Your App → **Settings**
   - Update **Privacy policy URL**: `https://easyfreeresume.com/privacy`
   - Update **Terms of service URL**: `https://easyfreeresume.com/terms`
   - Click **"Update"**

2. **Verify Redirect URLs**:
   - Go to **Auth** tab
   - Ensure callback URL is still configured correctly
   - No changes needed (Supabase callback URL is the same)

### 3.3 Update Supabase for Production

1. **Update Site URL**:
   - Go to **Authentication → URL Configuration**
   - **Site URL**: `https://easyfreeresume.com`
   - Click **"Save"**

2. **Update Redirect URLs**:
   - Add production redirect URLs:
     ```
     https://easyfreeresume.com/*
     https://easyfreeresume.com/editor
     https://easyfreeresume.com/my-resumes
     ```
   - Click **"Save"**

3. **Update CORS** (optional but recommended):
   - Go to **Project Settings → API**
   - Scroll to **Additional Allowed Origins**
   - Remove `*` wildcard
   - Add specific domains:
     ```
     https://easyfreeresume.com
     https://www.easyfreeresume.com
     ```

### 3.4 Frontend Environment Variables

**For Production Build**:

Create `.env.production` in `resume-builder-ui/`:

```bash
# Supabase Configuration (Frontend - Production)
VITE_SUPABASE_URL=https://mgetvioaymkvafczmhwo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  # Same as development
```

**In CI/CD Pipeline** (e.g., GitHub Actions):

```yaml
- name: Build Frontend
  env:
    VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  run: |
    cd resume-builder-ui
    npm run build
```

---

## Part 4: Testing Checklist

### Development Testing

- [ ] Magic link email authentication works
- [ ] Google OAuth redirects correctly
- [ ] Google OAuth returns user to `/editor` after sign-in
- [ ] LinkedIn OAuth redirects correctly
- [ ] LinkedIn OAuth returns user to `/editor` after sign-in
- [ ] User profile shows correct name and email from OAuth providers
- [ ] Sign out works correctly
- [ ] Auth state persists on page refresh

### Production Testing

- [ ] All development tests pass on production domain
- [ ] OAuth consent screens show correct app name and logo
- [ ] Privacy policy and terms links work correctly
- [ ] Users can sign in with Google without "unverified app" warnings (if verified)
- [ ] Users can sign in with LinkedIn
- [ ] CORS is properly configured (no console errors)
- [ ] Auth redirects work on production domain

---

## Part 5: Security Best Practices

### Credential Management

✅ **DO:**
- Store Client IDs and Secrets in environment variables
- Use different OAuth apps for development and production (recommended)
- Rotate secrets periodically (every 6-12 months)
- Monitor OAuth usage in provider dashboards

❌ **DON'T:**
- Commit OAuth secrets to version control
- Share OAuth secrets in Slack/email
- Use production OAuth credentials in development
- Expose Client Secrets in frontend code

### OAuth Configuration

✅ **DO:**
- Use specific redirect URLs (not wildcards)
- Enable HTTPS for all production OAuth flows
- Restrict CORS to specific domains in production
- Monitor failed authentication attempts

❌ **DON'T:**
- Use `http://` in production redirect URLs
- Allow `*` in CORS origins for production
- Skip OAuth consent screens
- Disable security features for convenience

### User Data

✅ **DO:**
- Only request necessary OAuth scopes
- Clearly communicate data usage in privacy policy
- Comply with GDPR/CCPA requirements
- Provide user data deletion functionality

❌ **DON'T:**
- Request more scopes than needed
- Share user data with third parties without consent
- Store unnecessary user information
- Ignore data privacy regulations

---

## Part 6: Troubleshooting

### Common Google OAuth Errors

#### Error: `redirect_uri_mismatch`

**Cause:** Redirect URI in your request doesn't match Google Cloud Console configuration.

**Fix:**
1. Check Supabase callback URL: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
2. Go to Google Cloud Console → Credentials
3. Ensure exact match (case-sensitive, include `/auth/v1/callback`)

#### Error: `access_denied` or `Error 403: access_blocked`

**Cause:** App is in testing mode and user is not added as test user.

**Fix:**
- **Option 1**: Add user as test user in OAuth consent screen
- **Option 2**: Publish the app (removes testing restrictions)

#### Error: `invalid_client`

**Cause:** Client ID or Client Secret is incorrect.

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Verify Client ID and Secret
3. Re-copy and paste into Supabase (check for extra spaces)

### Common LinkedIn OAuth Errors

#### Error: `Product not approved`

**Cause:** "Sign In with LinkedIn using OpenID Connect" product not approved.

**Fix:**
1. Go to LinkedIn Developer Portal → Products
2. Request access if not already done
3. Wait for approval (usually instant, max 48 hours)

#### Error: `redirect_uri_mismatch`

**Cause:** Redirect URI doesn't match LinkedIn app configuration.

**Fix:**
1. Check Supabase callback URL
2. Go to LinkedIn Developer Portal → Auth tab
3. Ensure exact match in Redirect URLs

#### Error: `unauthorized_client`

**Cause:** Client Secret is incorrect or app is not properly configured.

**Fix:**
1. Verify Client ID and Secret in LinkedIn Developer Portal → Auth tab
2. Re-copy and paste into Supabase
3. Ensure "Sign In with LinkedIn" product is approved

### General OAuth Troubleshooting

#### Users see "This app is not verified" warning (Google)

**Expected behavior for unverified apps.**

**Fix:**
- Users can click "Advanced" → "Go to [App Name]" to proceed
- For production, submit app for Google verification (takes 3-7 days)

#### OAuth popup gets blocked

**Cause:** Browser popup blocker.

**Fix:**
- Instruct users to allow popups for your domain
- Alternatively, use redirect flow instead of popup (already implemented)

#### Session not persisting after OAuth redirect

**Cause:** Cookie/session storage issues.

**Fix:**
1. Check browser console for errors
2. Verify cookies are enabled
3. Check if third-party cookies are blocked (Safari)
4. Ensure HTTPS in production (required for secure cookies)

---

## Part 7: Monitoring & Analytics

### Google Cloud Console

Monitor OAuth usage:
1. Go to **APIs & Services → Credentials**
2. Click on your OAuth client
3. View metrics:
   - Number of sign-ins
   - Error rates
   - Geographic distribution

### LinkedIn Developer Portal

Monitor OAuth usage:
1. Go to your app → **Analytics** tab
2. View metrics:
   - API calls
   - Authentication success rate
   - Active users

### Supabase Dashboard

Monitor authentication:
1. Go to **Authentication → Users**
2. Filter by provider: `google`, `linkedin_oidc`, `email`
3. Check **Logs** for authentication events

---

## Quick Reference

### Callback URLs

**Format:** `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`

**Example:** `https://mgetvioaymkvafczmhwo.supabase.co/auth/v1/callback`

**Where to add:**
- **Google**: OAuth Client → Authorized redirect URIs
- **LinkedIn**: App → Auth → Redirect URLs
- **Supabase**: Auto-configured (just verify it matches)

### Required Scopes

**Google:**
- `openid`
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`

**LinkedIn:**
- `openid`
- `email`
- `profile`

(Configured automatically by LinkedIn when using OpenID Connect)

### Support Links

- **Google OAuth Help**: https://support.google.com/cloud/answer/6158849
- **LinkedIn OAuth Docs**: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication
- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth/social-login
- **Supabase Discord**: https://discord.supabase.com/

---

**Document Version:** 1.0
**Last Updated:** 2025-12-23
**Next Review:** 2026-01-23
