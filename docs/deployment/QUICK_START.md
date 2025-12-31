# Quick Start Guide

## Prerequisites

- Docker Desktop installed
- Supabase account with a project created

## Setup in 3 Steps

### 1. Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your Supabase credentials
# Get these from: Supabase Dashboard → Settings → API
```

Required values in `.env`:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-service-role-key-here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

### 2. Build and Run

```bash
# Build and start with docker-compose
docker-compose up -d
```

That's it! 🎉

### 3. Access Application

Open browser to: **http://localhost:5000**

## Quick Commands

```bash
# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Rebuild after code changes
docker-compose build
docker-compose up -d

# Check if running
docker-compose ps
```

## Troubleshooting

**Frontend shows "undefined" for Supabase:**
- Rebuild: `docker-compose build` (frontend vars are baked into build)

**Backend fails with "No SUPABASE_SECRET_KEY":**
- Check `.env` file exists and has correct values
- Restart: `docker-compose restart`

**Port 5000 already in use:**
```bash
# Edit docker-compose.yml, change ports to:
ports:
  - "3000:5000"  # Use port 3000 instead
```

## Security ✅

- `.env` is in `.gitignore` - your secrets are safe
- Only public keys (VITE_*) are embedded in frontend JavaScript
- Service keys are only in backend runtime environment
- No secrets exposed to browser

See [SECURITY_ENV_VARS.md](SECURITY_ENV_VARS.md) for full security analysis.

## Full Documentation

- [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) - Complete deployment guide
- [SECURITY_ENV_VARS.md](SECURITY_ENV_VARS.md) - Security analysis
- [CLAUDE.md](CLAUDE.md) - Development guide
