# Supabase API Key Migration Guide

## ⚠️ Breaking Change Notice

This project has migrated from legacy Supabase JWT-based API keys to the new Publishable/Secret API key system.

**Action Required**: You must update your environment variables and get new API keys from Supabase Dashboard.

---

## TL;DR - What Changed

### Variable Names

| Old Variable (Deprecated) | New Variable (Required) |
|---------------------------|-------------------------|
| `SUPABASE_SERVICE_ROLE_KEY` | `SUPABASE_SECRET_KEY` |
| `SUPABASE_SERVICE_KEY` | `SUPABASE_SECRET_KEY` |
| `VITE_SUPABASE_ANON_KEY` | `VITE_SUPABASE_PUBLISHABLE_KEY` |

### Key Format

- **Old Format** (NOT supported): Long JWT starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **New Format** (REQUIRED):
  - Secret keys: `sb_secret_ABC123...`
  - Publishable keys: `sb_publishable_XYZ789...`

---

## Why This Change?

1. **Better Security**: New keys can be rotated independently without downtime
2. **Shorter Keys**: Easier to copy/paste and manage
3. **Industry Standard**: Aligns with modern API key best practices
4. **Future-Proof**: Supabase is phasing out legacy JWT keys

---

## Migration Steps

### Step 1: Get New API Keys

#### For Local Development (Local Supabase)

```bash
# 1. Start local Supabase
supabase start

# 2. Get keys from output
supabase status

# Look for:
#   anon key: sb_publishable_...
#   service_role key: sb_secret_...
```

**Note**: Local Supabase automatically provides new-format keys.

#### For Cloud Supabase (Production/Staging)

1. Go to **Supabase Dashboard → Settings → API**
2. Look for these sections:
   - **"Publishable API Key"** (starts with `sb_publishable_`)
   - **"Secret API Key"** (starts with `sb_secret_`)
3. Copy both keys

**Important**: If you don't see these sections in your dashboard, your Supabase project may not have the new keys yet. Contact Supabase support or wait for the rollout.

---

### Step 2: Update Environment Variables

#### Local Development

**File**: `.env.local`

```bash
# Frontend
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Backend
SUPABASE_SECRET_KEY=sb_secret_...
```

#### Production/Cloud Deployment

**File**: `.env`

```bash
# Frontend (build-time)
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Backend (runtime)
SUPABASE_SECRET_KEY=sb_secret_...
```

#### Docker Deployment

Update your `.env` file, then rebuild:

```bash
# Update .env with new variable names and keys

# Rebuild (required for frontend changes)
docker-compose build

# Restart services
docker-compose up -d
```

#### E2E Tests

**File**: `.env.test`

```bash
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

---

### Step 3: Update Edge Function Secrets

**Good News**: Supabase Edge Functions automatically have access to `SUPABASE_SERVICE_ROLE_KEY`! ✨

You only need to set **custom** secrets (those NOT auto-provided by Supabase):

```bash
# Set custom secrets (e.g., OpenAI API key)
supabase secrets set OPENAI_API_KEY=sk-your-key-here

# Verify
supabase secrets list
```

**Auto-Injected Variables** (no need to set):
- `SUPABASE_URL` - Your project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key (bypasses RLS)
- `SUPABASE_ANON_KEY` - Public key (respects RLS)
- `SUPABASE_DB_URL` - Direct database connection

These are automatically available in **all** Edge Functions based on your project's API keys in Settings → API.

**After Updating Code**: Redeploy the function:
```bash
supabase functions deploy parse-resume
```

---

### Step 4: Update CI/CD Secrets

#### GitHub Actions

1. Go to **Repository Settings → Secrets and variables → Actions**
2. Add new secrets:
   - `SUPABASE_SECRET_KEY` = `sb_secret_...`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_...`
3. Update workflow files to use new secret names

#### Other Platforms (Cloud Run, Heroku, etc.)

Update environment variables in your platform's console using the new variable names.

---

### Step 5: Disable Old Keys (Recommended)

After verifying the migration works:

1. Go to **Supabase Dashboard → Settings → API**
2. Find the legacy JWT keys section
3. Click **"Disable"** or **"Rotate"** to prevent old keys from being used

**⚠️ Warning**: Only do this after confirming all services are using the new keys!

---

## Environment-Specific Instructions

### Local Supabase (Docker)

```bash
# 1. Start local Supabase
supabase start

# 2. Update .env.local
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...  # From supabase status
SUPABASE_SECRET_KEY=sb_secret_...                 # From supabase status

# 3. Restart your development servers
# Frontend: Ctrl+C, then npm run dev
# Backend: docker-compose restart
```

### Cloud Supabase (Production)

```bash
# 1. Get new keys from Supabase Dashboard
# Dashboard → Settings → API → Publishable/Secret API Keys

# 2. Update .env file
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...

# 3. Rebuild Docker image (frontend changes require rebuild)
docker-compose build

# 4. Deploy
docker-compose up -d

# 5. Verify application works
curl http://localhost:5000/health

# 6. Disable old keys in Supabase Dashboard
```

---

## Troubleshooting

### "Supabase credentials not found" Error

**Cause**: Environment variables are not set or have wrong names.

**Solution**:
1. Check `.env` file has new variable names
2. For Docker: Rebuild image (`docker-compose build`)
3. Verify variable names match exactly (case-sensitive)

### "401 Unauthorized" from Supabase

**Cause**: Using old JWT keys or keys are invalid.

**Solution**:
1. Get fresh keys from Supabase Dashboard
2. Ensure keys start with `sb_secret_` or `sb_publishable_`
3. Check keys are not truncated/corrupted when copying

### Frontend Build Fails

**Cause**: Vite can't find `VITE_SUPABASE_PUBLISHABLE_KEY`.

**Solution**:
```bash
# 1. Check .env file has VITE_ prefix
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# 2. Rebuild
npm run build
```

### E2E Tests Fail

**Cause**: `.env.test` still uses old variable names.

**Solution**:
```bash
# Update .env.test
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...

# Run tests
npm run test:e2e
```

### Edge Function Errors

**Cause**: Edge function may be using outdated code or missing custom secrets.

**Solution**:
```bash
# 1. Ensure custom secrets are set (e.g., OpenAI API key)
supabase secrets list

# 2. Set any missing custom secrets
supabase secrets set OPENAI_API_KEY=sk-your-key-here

# 3. Redeploy the function
supabase functions deploy parse-resume

# 4. Check logs for errors
supabase functions logs parse-resume --tail
```

**Note**: `SUPABASE_SERVICE_ROLE_KEY` is auto-injected and doesn't need to be set manually.

---

## Verification Checklist

After migration, verify:

- [ ] **Local development works**
  - Frontend loads without errors
  - Authentication works (sign in/out)
  - Database operations work (create/read/update/delete resumes)

- [ ] **Docker build succeeds**
  ```bash
  docker-compose build
  ```

- [ ] **E2E tests pass**
  ```bash
  npm run test:e2e
  ```

- [ ] **Edge function works**
  - AI resume parser processes files
  - No authentication errors in logs

- [ ] **Production deployment works**
  - Application runs without Supabase errors
  - Check logs for any credential warnings

- [ ] **Old keys disabled** (optional but recommended)
  - Go to Supabase Dashboard → Settings → API
  - Disable legacy JWT keys

---

## Need Help?

- **Local Setup Issues**: See [LOCAL_DEV_SETUP.md](development/LOCAL_DEV_SETUP.md)
- **Docker Issues**: See [DOCKER_DEPLOYMENT.md](deployment/DOCKER_DEPLOYMENT.md)
- **Supabase Configuration**: See [SUPABASE_SETUP_RUNBOOK.md](development/SUPABASE_SETUP_RUNBOOK.md)
- **Security Questions**: See [SECURITY_ENV_VARS.md](security/SECURITY_ENV_VARS.md)

If you encounter issues not covered here, please open a GitHub issue.
