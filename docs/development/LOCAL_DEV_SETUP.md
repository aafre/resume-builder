# Local Development Setup Guide

## Quick Start

```bash
# 1. Start local Supabase
supabase start

# 2. Get your local keys
supabase status

# 3. Copy .env.local template
cp .env.local.example .env.local

# 4. Update .env.local with keys from step 2
# - VITE_SUPABASE_ANON_KEY (from "anon key" in status)
# - SUPABASE_SERVICE_ROLE_KEY (from "service_role key" in status)

# 5. Start frontend (picks up .env.local automatically)
npm run dev

# 6. Start backend (picks up .env.local automatically)
docker-compose up
```

## Environment File Structure

### Files and Load Order

```
FRONTEND (Vite):
  .env.local (gitignored)    ← Local Supabase (highest priority)
  .env.development (tracked) ← DEV Supabase
  .env (tracked)             ← DEV Supabase baseline

BACKEND (Docker):
  .env.local (gitignored)    ← Local Supabase (highest priority)
  .env (tracked)             ← DEV Supabase baseline

E2E TESTS (Playwright):
  .env.test (tracked)        ← Test-specific config
```

### When to Use Each File

| Scenario | Frontend | Backend | Action |
|----------|----------|---------|--------|
| **Local Dev + E2E** | .env.local | .env.local | Use localhost Supabase |
| **DEV Testing** | .env | .env | Remove/rename .env.local |
| **Production** | Platform env vars | Platform env vars | N/A |

## Key Differences: Frontend vs Backend

### Frontend (Vite) - Browser Context
```bash
# Browser can access localhost directly
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### Backend (Flask in Docker) - Container Context
```bash
# Docker container uses host.docker.internal to reach host machine
SUPABASE_URL=http://host.docker.internal:54321
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SUPABASE_SERVICE_KEY=sb_secret_...  # Alias for compatibility
```

**Why the difference?**
- `localhost` inside Docker refers to the **container**, not your machine
- `host.docker.internal` is Docker's special hostname for the **host machine**
- Frontend runs in your browser (can use `localhost`)
- Backend runs in Docker (needs `host.docker.internal`)

## Running E2E Tests

### Prerequisites
```bash
# 1. Local Supabase running
supabase status
# Should show: supabase local development setup is running.

# 2. .env.local configured (see Quick Start above)

# 3. Frontend dev server running
npm run dev
# Should be accessible at: http://localhost:5173
```

### Run Tests
```bash
# All tests
npx playwright test

# Single test file
npx playwright test e2e/tests/editor.spec.ts

# Single test by name
npx playwright test --grep "should show save status"

# With UI (visual test runner)
npx playwright test --ui

# Headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug
```

### Test Environment
Tests use `.env.test` which is configured for:
- `VITE_SUPABASE_URL=http://localhost:54321` (local Supabase)
- `PLAYWRIGHT_BASE_URL=http://localhost:5173` (local frontend)
- `FLASK_API_URL=http://localhost:5000` (local backend)

**IMPORTANT**: All URLs must use `localhost` (not `127.0.0.1`) to avoid cookie/localStorage origin mismatches.

## Troubleshooting

### Test fails with "sb-localhost-auth-token not found"

**Error:**
```
Expected key: sb-localhost-auth-token
Available keys: sb-mgetvioaymkvafczmhwo-auth-token
```

**Cause:** Frontend Vite server connected to DEV Supabase instead of local.

**Fix:**
```bash
# 1. Ensure .env.local exists and has correct URLs
cat .env.local

# 2. Restart Vite dev server (picks up .env.local)
# Stop: Ctrl+C
npm run dev
```

### Flask backend can't connect to Supabase

**Error:** Connection refused / timeout

**Cause:** Backend using `localhost` instead of `host.docker.internal`

**Fix:**
```bash
# 1. Check .env.local has correct backend URL
grep SUPABASE_URL .env.local
# Should show: SUPABASE_URL=http://host.docker.internal:54321

# 2. Restart Docker
docker-compose down
docker-compose up
```

### Supabase not running

**Error:** Connection refused on port 54321

**Fix:**
```bash
supabase start
```

### Want to test against DEV Supabase instead of local

**Temporary switch:**
```bash
# Rename .env.local (stops overriding .env)
mv .env.local .env.local.bak

# Restart services (now use .env = DEV Supabase)
npm run dev
docker-compose up

# Switch back
mv .env.local.bak .env.local
```

## File Reference

### .env.local (Your Local Config - Not Tracked)
```bash
# Frontend
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH

# Backend (Docker)
SUPABASE_URL=http://host.docker.internal:54321
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
SUPABASE_SERVICE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

### .env (DEV Baseline - Tracked)
```bash
# Frontend
VITE_SUPABASE_URL=https://mgetvioaymkvafczmhwo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Backend
SUPABASE_URL=https://mgetvioaymkvafczmhwo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### .env.test (E2E Tests - Tracked)
```bash
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz

PLAYWRIGHT_BASE_URL=http://localhost:5173
FLASK_API_URL=http://localhost:5000
TEST_USER_EMAIL=e2e-test@example.com
```

## Common Workflows

### Daily Local Development
```bash
supabase start       # Once per session
npm run dev          # Keep running
docker-compose up    # If testing backend features
```

### Running E2E Tests
```bash
supabase start       # Ensure local Supabase running
npm run dev          # Ensure frontend running
npx playwright test  # Run tests
```

### Switch to DEV Testing
```bash
mv .env.local .env.local.bak
npm run dev          # Restart to pick up .env
docker-compose up    # Restart to pick up .env
```

### Back to Local
```bash
mv .env.local.bak .env.local
npm run dev          # Restart to pick up .env.local
docker-compose up    # Restart to pick up .env.local
```
