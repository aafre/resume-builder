# Local Supabase Setup for E2E Tests

This guide sets up local Supabase to avoid rate limiting during E2E tests and CI/CD.

## Prerequisites

- Docker Desktop (running)
- Node.js 18+
- Supabase CLI

## Step 1: Install Supabase CLI

### Windows (Scoop)
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### macOS/Linux (NPM)
```bash
npm install -g supabase
```

### Verify Installation
```bash
supabase --version
```

## Step 2: Initialize and Start Local Supabase

```bash
# Already initialized - just start the services
supabase start
```

This will:
- Pull Docker images (first time only, ~2GB)
- Start Postgres, Auth, Storage, Realtime, etc.
- Apply all migrations from `supabase/migrations/` in order
- Take ~2-3 minutes first time

**Expected Output:**
```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhb...
service_role key: eyJhb...
```

## Step 3: Copy Credentials to .env.test

Update `.env.test` with the output from `supabase start`:

```bash
# Local Supabase (from `supabase start` output)
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<paste anon key here>
SUPABASE_SERVICE_ROLE_KEY=<paste service_role key here>

# Test user (will be created by global setup)
TEST_USER_EMAIL=e2e-test@easyfreeresume.com
TEST_USER_PASSWORD=E2ETest@2025!

# Frontend URL
PLAYWRIGHT_BASE_URL=http://localhost:5173

# Mock API keys (not used in local tests)
OPENAI_API_KEY=mock
```

## Step 4: Verify Migrations Applied

Visit **Supabase Studio**: http://localhost:54323

Check:
- Tables: `resumes`, `resume_icons`, `user_preferences`, `parsed_resumes`
- Columns: `resumes.json_hash`, `user_preferences.announcement_dismissals`
- Storage Buckets: `resume-pdfs` (private), `resume-icons` (public)
- RLS Policies: Should see optimized policies with `(SELECT auth.uid())`

## Step 5: Run E2E Tests

```bash
# Make sure frontend is running
npm run dev

# In another terminal
cd e2e
npx playwright test
```

## Migration Order (Auto-Applied)

1. **20250101000000_init_schema.sql** - Base tables, RLS, storage
2. **20250102000000_add_hash_and_preferences.sql** - json_hash + user_preferences
3. **20250103000000_add_announcement_dismissals.sql** - announcement_dismissals column
4. **20250104000000_fix_rls_performance.sql** - Optimize RLS policies (10-100x faster)
5. **20251228000000_create_parsed_resumes.sql** - AI resume parsing table

## Commands Reference

```bash
# Start local Supabase (applies migrations automatically)
supabase start

# Stop local Supabase
supabase stop

# Reset database (WARNING: Deletes all data)
supabase db reset

# Check status
supabase status

# View logs
supabase logs

# Access Postgres directly
psql postgresql://postgres:postgres@localhost:54322/postgres
```

## CI/CD Integration (GitHub Actions)

Local Supabase works perfectly in CI:

```yaml
# .github/workflows/e2e-tests.yml
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1

      - name: Start local Supabase
        run: supabase start

      - name: Run E2E tests
        run: npx playwright test
        env:
          VITE_SUPABASE_URL: http://localhost:54321
          # Credentials set via supabase start
```

## Troubleshooting

### Migration Errors
```bash
# Check migration status
supabase migration list

# Re-apply migrations
supabase db reset
```

### Port Conflicts
```bash
# If ports 54321-54324 are in use, stop conflicting services
netstat -ano | findstr :54321
```

### Docker Issues
```bash
# Restart Docker Desktop
# Then run:
supabase stop
supabase start
```

### Rate Limiting Still Happening?
- Verify `.env.test` uses `http://localhost:54321` (NOT your DEV URL)
- Restart frontend: `npm run dev`
- Clear browser data: Ctrl+Shift+Delete

## Benefits

✅ **No rate limits** - Unlimited requests
✅ **Fast** - Local network, no internet latency
✅ **Isolated** - No interference with DEV/PROD data
✅ **Reproducible** - Same schema across all machines
✅ **CI/CD friendly** - Free, works in GitHub Actions
✅ **Offline** - Works without internet

## Schema Sync

To pull latest schema from DEV (if needed):
```bash
# Login to Supabase
supabase login

# Link to DEV project
supabase link --project-ref <your-dev-project-ref>

# Pull schema
supabase db pull
```

This creates a new migration file - review and commit it.
