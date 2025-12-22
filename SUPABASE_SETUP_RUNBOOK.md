# Supabase Setup Runbook - Resume Builder
**Version:** 1.0
**Last Updated:** 2025-12-22
**Supabase Version:** Latest (2025)

## 📋 Prerequisites

- [ ] Supabase account created at [supabase.com](https://supabase.com)
- [ ] Access to project repository
- [ ] Admin access to deployment environment (Cloud Run, etc.)

---

## 🚀 Part 1: Create Supabase Project

### 1.1 Create New Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in details:
   - **Name**: `resume-builder-prod` (or your choice)
   - **Database Password**: Generate strong password (save to password manager!)
   - **Region**: Choose closest to your users (e.g., `eu-west-1` for Europe)
   - **Pricing Plan**: Start with Free tier, upgrade as needed
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to provision

### 1.2 Save Database Credentials

Once project is ready, go to **Project Settings → Database**

**Save these securely** (you won't need them for app, but useful for direct DB access):
- Host: `db.xxx.supabase.co`
- Database name: `postgres`
- Port: `5432` (or `6543` for connection pooling)
- User: `postgres`
- Password: (the one you set in step 1.1)

---

## 🔐 Part 2: Get API Keys & Connection Strings

### 2.1 Get API Keys

Go to **Project Settings → API**

**Copy and save these values:**

```bash
# Project URL (same for frontend and backend)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# anon/public key (safe to expose in frontend)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk...

# service_role key (NEVER expose in frontend, backend only!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2OT...
```

⚠️ **SECURITY WARNING:**
- `SUPABASE_ANON_KEY` = Safe to use in frontend (Row-Level Security protects data)
- `SUPABASE_SERVICE_ROLE_KEY` = **NEVER** expose in frontend, server-side only!

### 2.2 Create Environment Files

**For Backend** (Flask) - Create `.env` in project root:

```bash
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Use service_role key here
DEBUG_LOGGING=false

# Database direct connection (optional, for migrations)
SUPABASE_DB_PASSWORD=your-db-password-from-step-1.1
```

**For Frontend** (React/Vite) - Create `.env.local` in `resume-builder-ui/`:

```bash
# Supabase Configuration (Frontend)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  # Use anon key here (NOT service_role!)
```

**Update `.gitignore`** to ensure secrets aren't committed:

```bash
# Environment files (should already be there)
.env
.env.local
.env.production
.env.development
```

---

## 🗄️ Part 3: Database Setup

### 3.1 Run Database Migration

1. Open **SQL Editor** in Supabase Dashboard
2. Click **"New Query"**
3. Copy entire contents of `sqls/init.md` from the repository
4. Paste into SQL Editor
5. Click **"Run"** (or press `Cmd/Ctrl + Enter`)

**Expected Output:**
```
Success. No rows returned
Success. No rows returned
... (multiple success messages)
```

**Verify Tables Created:**
1. Go to **Table Editor** in Supabase Dashboard
2. You should see:
   - ✅ `resumes` table
   - ✅ `resume_icons` table

### 3.2 Verify RLS (Row-Level Security) is Enabled

1. Go to **Authentication → Policies**
2. Select **`resumes`** table - should show 4 policies:
   - ✅ Users can view own resumes
   - ✅ Users can create resumes
   - ✅ Users can update own resumes
   - ✅ Users can delete own resumes

3. Select **`resume_icons`** table - should show 3 policies:
   - ✅ Users can view own icons
   - ✅ Users can insert own icons
   - ✅ Users can delete own icons

**If policies are missing**, re-run the SQL migration script.

---

## 🔒 Part 4: Authentication Configuration

### 4.1 Enable Anonymous Sign-Ins (CRITICAL!)

**This is the foundation of our architecture** - allows users to use the app without creating an account.

1. Go to **Authentication → Providers**
2. Scroll down to **"Anonymous sign-ins"** section
3. **Toggle to ON** (should show as enabled/green)

**Verification:**
- Refresh the page
- Anonymous section should show "Enabled" status

### 4.2 Configure Site URL and Redirect URLs

1. Go to **Authentication → URL Configuration**

2. Set **Site URL**:
   - **Development**: `http://localhost:5173`
   - **Production**: `https://your-production-domain.com`

3. Add **Redirect URLs** (click "+ Add URL" for each):

   **For Development:**
   ```
   http://localhost:5173/*
   http://localhost:5000/*
   ```

   **For Production:**
   ```
   https://your-production-domain.com/*
   https://your-production-domain.com/editor
   https://your-production-domain.com/my-resumes
   ```

### 4.3 Enable Email Provider (Magic Link)

1. Go to **Authentication → Providers**
2. Click on **Email**
3. Ensure these settings:
   - ✅ **Enable Email provider**: ON
   - ✅ **Confirm email**: OFF (for magic link to work)
   - ✅ **Secure email change**: ON (recommended)
   - ✅ **Enable email OTP**: OFF (we use magic links, not OTPs)

4. **Customize Email Templates** (optional but recommended):
   - Go to **Authentication → Email Templates**
   - Customize "Magic Link" template with your branding

### 4.4 Enable OAuth Providers (Optional)

#### Google OAuth

**Reference:** [Supabase Google OAuth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)

1. **Create Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable **Google+ API**
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - **Authorized redirect URIs**: Add `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
   - Save and copy **Client ID** and **Client Secret**

2. **Configure in Supabase:**
   - Go to **Authentication → Providers**
   - Click **Google**
   - Toggle **Enable Sign in with Google**: ON
   - Paste **Client ID** (Google OAuth)
   - Paste **Client Secret** (Google OAuth)
   - **Authorized Client IDs**: Leave empty unless using mobile
   - Click **Save**

#### LinkedIn OAuth

**Reference:** [Supabase LinkedIn OAuth Docs](https://supabase.com/docs/guides/auth/social-login/auth-linkedin)

1. **Create LinkedIn App:**
   - Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
   - Click **"Create app"**
   - Fill in app details (name, logo, privacy policy URL)
   - Under **Auth** tab:
     - **Authorized redirect URLs**: Add `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
   - Under **Products** tab:
     - Request access to **"Sign In with LinkedIn using OpenID Connect"**
   - Copy **Client ID** and **Client Secret** from **Auth** tab

2. **Configure in Supabase:**
   - Go to **Authentication → Providers**
   - Click **LinkedIn (OIDC)**
   - Toggle **Enable Sign in with LinkedIn**: ON
   - Paste **Client ID** (LinkedIn OAuth)
   - Paste **Client Secret** (LinkedIn OAuth)
   - Click **Save**

---

## 📦 Part 5: Storage Buckets Setup

### 5.1 Verify Buckets Created

The SQL script should have created buckets automatically. Verify:

1. Go to **Storage** in Supabase Dashboard
2. You should see:
   - ✅ `resume-pdfs` (Private bucket)
   - ✅ `resume-icons` (Public bucket)

**If buckets are missing**, create them manually:

#### Create `resume-pdfs` bucket:
1. Click **"New bucket"**
2. Name: `resume-pdfs`
3. **Public bucket**: OFF (unchecked)
4. **File size limit**: 10 MB (or adjust as needed)
5. **Allowed MIME types**: `application/pdf`
6. Click **"Create bucket"**

#### Create `resume-icons` bucket:
1. Click **"New bucket"**
2. Name: `resume-icons`
3. **Public bucket**: ON (checked) - for fast CDN access
4. **File size limit**: 50 KB
5. **Allowed MIME types**: `image/png, image/jpeg, image/jpg, image/svg+xml`
6. Click **"Create bucket"**

### 5.2 Verify Storage Policies

1. Go to **Storage → Policies**
2. Select `resume-pdfs` bucket:
   - Should show policy: **"Users manage own PDFs"**

3. Select `resume-icons` bucket:
   - Should show policies:
     - **"Public View Icons"** (SELECT)
     - **"Users manage own icons"** (INSERT)
     - **"Users update own icons"** (UPDATE)
     - **"Users delete own icons"** (DELETE)

**If policies are missing**, re-run the SQL migration script sections 5B and 5C.

---

## 🔐 Part 6: Security Configuration

### 6.1 Review JWT Settings

1. Go to **Project Settings → API**
2. Scroll to **JWT Settings**
3. Verify:
   - **JWT expiry**: 3600 seconds (1 hour) - default is good
   - **JWT secret**: Auto-generated, never share this

### 6.2 Configure Rate Limiting (Recommended for Production)

1. Go to **Project Settings → API**
2. Scroll to **Rate Limiting**
3. Set limits:
   - **Anonymous users**: 100 requests/hour (adjust based on traffic)
   - **Authenticated users**: 1000 requests/hour

### 6.3 Enable Realtime (Optional)

Only if you plan to add real-time features later:

1. Go to **Project Settings → API**
2. Scroll to **Realtime**
3. Enable for tables that need real-time updates (none required for MVP)

### 6.4 Review CORS Settings

Supabase handles CORS automatically, but verify:

1. Go to **Project Settings → API**
2. **Additional Allowed Origins**: Should show `*` by default
3. For production, restrict to your domains:
   ```
   https://your-production-domain.com
   https://www.your-production-domain.com
   ```

---

## ✅ Part 7: Verification & Testing

### 7.1 Test Anonymous Auth

**Using Supabase Dashboard:**

1. Go to **Authentication → Users**
2. Click **"Add user" → "Create anonymous user"**
3. A new anonymous user should appear with:
   - Email: (none)
   - Provider: `anonymous`
   - Status: `Active`

**Cleanup:** Delete test user after verification

### 7.2 Test Database Policies (RLS)

**Using SQL Editor:**

```sql
-- This should FAIL (trying to access another user's data)
SELECT * FROM public.resumes WHERE user_id = 'some-other-user-id';

-- This should WORK (your own data)
SELECT * FROM public.resumes WHERE user_id = auth.uid();
```

### 7.3 Test Storage Access

**Using Storage UI:**

1. Go to **Storage → resume-icons**
2. Create a test folder: `test-user-id`
3. Try uploading an image
4. Verify you can access it via public URL

**Cleanup:** Delete test folder after verification

### 7.4 Test Email Templates

1. Go to **Authentication → Email Templates**
2. Click **"Magic Link"** template
3. Click **"Send test email"**
4. Enter your email
5. Check inbox for magic link email

---

## 🚀 Part 8: Deploy to Production

### 8.1 Set Environment Variables in Cloud Run

**For Backend Service:**

```bash
gcloud run services update resume-builder-api \
  --set-env-vars="SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co" \
  --set-env-vars="SUPABASE_SERVICE_ROLE_KEY=eyJhbGc..." \
  --set-env-vars="DEBUG_LOGGING=false"
```

**For Frontend (build-time variables):**

In your CI/CD pipeline (GitHub Actions, etc.):

```yaml
- name: Build Frontend
  env:
    VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  run: |
    cd resume-builder-ui
    npm run build
```

### 8.2 Update CORS and Redirect URLs

Once deployed, update Supabase:

1. **Authentication → URL Configuration**:
   - Site URL: `https://your-production-domain.com`
   - Redirect URLs: Add production URLs

2. **Project Settings → API → CORS**:
   - Remove `*` wildcard
   - Add specific production domains

### 8.3 Enable Database Backups

1. Go to **Project Settings → Database → Backups**
2. Verify daily backups are enabled (free tier includes 7-day retention)
3. For production, consider upgrading for longer retention

### 8.4 Set Up Monitoring

1. Go to **Project Settings → Integrations**
2. Connect to monitoring tools:
   - Vercel (if using)
   - GitHub Actions (for CI/CD status)
   - Sentry (for error tracking)

---

## 📊 Part 9: Monitoring & Maintenance

### 9.1 Monitor Usage

**Dashboard to check daily:**

1. **Database → Usage**:
   - Database size (Free tier: 500 MB)
   - Number of connections

2. **Storage → Usage**:
   - Storage size (Free tier: 1 GB)
   - Bandwidth (Free tier: 2 GB/month)

3. **Authentication → Users**:
   - Total users
   - Monthly Active Users (MAU)

### 9.2 Database Maintenance

**Weekly checks:**

```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check for soft-deleted resumes (cleanup if needed)
SELECT COUNT(*) FROM public.resumes WHERE deleted_at IS NOT NULL;

-- Cleanup old soft-deleted resumes (older than 30 days)
DELETE FROM public.resumes
WHERE deleted_at < NOW() - INTERVAL '30 days';
```

### 9.3 Backup Strategy

**Automated (Supabase handles this):**
- Daily backups (last 7 days on free tier)
- Point-in-time recovery (Pro tier+)

**Manual backups (recommended monthly):**

```bash
# Export database using pg_dump
pg_dump "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" \
  --schema=public \
  --format=custom \
  --file=backup-$(date +%Y%m%d).dump

# Export just the resumes table
pg_dump "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" \
  --schema=public \
  --table=resumes \
  --format=custom \
  --file=resumes-backup-$(date +%Y%m%d).dump
```

---

## 🔧 Troubleshooting

### Issue: "Anonymous sign-ins not working"

**Check:**
1. Anonymous provider is enabled: **Authentication → Providers → Anonymous**
2. Site URL is set correctly
3. Frontend is using correct `SUPABASE_ANON_KEY`

**Test in browser console:**
```javascript
const { data, error } = await supabase.auth.signInAnonymously()
console.log('Anonymous user:', data.user)
```

### Issue: "RLS policy denying access"

**Check:**
1. User is authenticated: `SELECT auth.uid();` should return a UUID
2. Policy matches user_id: `WHERE auth.uid() = user_id`

**Debug query:**
```sql
-- See current user
SELECT auth.uid();

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- List all policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### Issue: "Storage upload failing"

**Check:**
1. Bucket exists
2. File size under limit (50 KB for icons, 10 MB for PDFs)
3. MIME type is allowed
4. Storage policy allows upload for this user_id

**Debug:**
```javascript
const { data, error } = await supabase.storage
  .from('resume-icons')
  .upload('test-user-id/test.png', file)
console.log('Upload result:', data, error)
```

### Issue: "OAuth redirect not working"

**Check:**
1. Redirect URL is added to **Authentication → URL Configuration**
2. Google/LinkedIn app has same redirect URL configured
3. Site URL matches production domain

---

## 📚 Useful Resources

- **Official Docs**: https://supabase.com/docs
- **Auth Guide**: https://supabase.com/docs/guides/auth
- **Storage Guide**: https://supabase.com/docs/guides/storage
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **CLI Reference**: https://supabase.com/docs/reference/cli
- **Status Page**: https://status.supabase.com/

---

## 📋 Deployment Checklist

Use this before going live:

- [ ] SQL migration script executed successfully
- [ ] Anonymous auth enabled
- [ ] Email provider configured
- [ ] OAuth providers configured (if using)
- [ ] Site URL set to production domain
- [ ] Redirect URLs include production URLs
- [ ] Storage buckets created with policies
- [ ] RLS policies verified
- [ ] Environment variables set in Cloud Run
- [ ] CORS restricted to production domains
- [ ] Rate limiting configured
- [ ] Database backups enabled
- [ ] Monitoring/alerting set up
- [ ] Test anonymous sign-in works
- [ ] Test resume creation works
- [ ] Test file upload works
- [ ] Test PDF generation works

---

**Last Updated:** 2025-12-22
**Maintained By:** Engineering Team
**Questions?** Check Supabase Discord or GitHub Issues
