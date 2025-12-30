# Docker Deployment Guide

This guide explains how to build and deploy the Resume Builder application with Docker, including proper environment variable configuration.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose (included with Docker Desktop)
- Supabase account and project

## Environment Variables

The application requires different environment variables for the frontend (React/Vite) and backend (Flask).

### 1. Setup Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:

```bash
# Backend (Flask) - Runtime variables
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Frontend (Vite) - Build-time variables (embedded into JS bundle)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

# Optional
DEBUG_LOGGING=false
```

### 2. Build the Docker Image

#### Option A: Using Docker Compose (Recommended)

```bash
docker-compose build
```

This automatically reads variables from `.env` file and passes them correctly to both build stages.

#### Option B: Using Docker Build Directly

You must explicitly pass frontend variables as build arguments:

```bash
docker build \
  --build-arg VITE_SUPABASE_URL="https://your-project.supabase.co" \
  --build-arg VITE_SUPABASE_ANON_KEY="your-anon-key-here" \
  -t easyfreeresume-app:latest \
  .
```

**⚠️ Security Note:** Build args for VITE_* variables will be embedded into the JavaScript bundle and visible in the browser. Only use the anon/public key, never the service role key!

## Running the Application

### Option A: Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This automatically:
- Loads environment variables from `.env`
- Passes build-time args for React
- Passes runtime env vars for Flask
- Starts the container with proper configuration

Stop the application:
```bash
docker-compose down
```

### Option B: Using Docker Run

```bash
docker run -d \
  -p 5000:5000 \
  -e SUPABASE_URL="https://your-project.supabase.co" \
  -e SUPABASE_SERVICE_KEY="your-service-key-here" \
  -e DEBUG_LOGGING="false" \
  --name resume-builder \
  easyfreeresume-app:latest
```

Or load from `.env` file:

```bash
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name resume-builder \
  easyfreeresume-app:latest
```

## Accessing the Application

Open your browser to:
```
http://localhost:5000
```

## Environment Variable Reference

### Frontend Variables (Build-time)

These are embedded into the React build during `docker build`:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key (safe for browser) |

**How they work:**
- Passed via `--build-arg` during Docker build
- Embedded into JavaScript bundle by Vite
- Visible in browser - only use public/anon keys!

### Backend Variables (Runtime)

These are provided when starting the container:

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Yes | Service role key (bypasses RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Alias for service key |
| `DEBUG_LOGGING` | No | Enable debug logs (default: false) |
| `SUPABASE_DB_PASSWORD` | No | Direct database password |

**How they work:**
- Passed via `-e` flag or `--env-file` with `docker run`
- Or via `environment:` in `docker-compose.yml`
- Only available to Flask backend, never exposed to browser

## Production Deployment

### Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use secrets management** - For production, use:
   - Docker Swarm secrets
   - Kubernetes secrets
   - AWS Secrets Manager / Azure Key Vault
3. **Rotate keys regularly** - Especially service role keys
4. **Use HTTPS** - Always use SSL/TLS in production
5. **Limit service key usage** - Only use where RLS bypass is needed

### Production Build Example

```bash
# Build with production values
docker build \
  --build-arg VITE_SUPABASE_URL="${PROD_SUPABASE_URL}" \
  --build-arg VITE_SUPABASE_ANON_KEY="${PROD_ANON_KEY}" \
  -t easyfreeresume-app:v1.0.0 \
  .

# Run with production runtime vars
docker run -d \
  -p 80:5000 \
  -e SUPABASE_URL="${PROD_SUPABASE_URL}" \
  -e SUPABASE_SERVICE_KEY="${PROD_SERVICE_KEY}" \
  -e DEBUG_LOGGING="false" \
  --restart unless-stopped \
  --name resume-builder-prod \
  easyfreeresume-app:v1.0.0
```

### Health Checks

The application includes a health check endpoint:

```bash
curl http://localhost:5000/health
```

Docker Compose automatically configures health checks. For manual setup:

```bash
docker run -d \
  --health-cmd="curl -f http://localhost:5000/health || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  # ... other flags
```

## Troubleshooting

### Frontend shows "undefined" for Supabase URL

**Cause:** Build args not passed during build
**Fix:** Rebuild with `--build-arg` flags or use docker-compose

### Backend fails with "No SUPABASE_SERVICE_KEY"

**Cause:** Runtime environment variables not provided
**Fix:** Add `-e` flags or `--env-file .env` to `docker run`

### Changes to .env not reflected

**Cause:** Frontend vars are baked into build
**Fix:**
- For frontend vars: Rebuild image
- For backend vars: Just restart container

### Check what variables are set

```bash
# Check build args (won't show runtime env vars)
docker history easyfreeresume-app:latest

# Check runtime env vars in running container
docker exec resume-builder env | grep SUPABASE
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Build Docker image
  run: |
    docker build \
      --build-arg VITE_SUPABASE_URL="${{ secrets.VITE_SUPABASE_URL }}" \
      --build-arg VITE_SUPABASE_ANON_KEY="${{ secrets.VITE_SUPABASE_ANON_KEY }}" \
      -t myregistry/resume-builder:${{ github.sha }} \
      .
```

### Environment-specific Builds

Create separate `.env.dev`, `.env.staging`, `.env.prod`:

```bash
# Development
docker-compose --env-file .env.dev up

# Staging
docker-compose --env-file .env.staging up

# Production
docker-compose --env-file .env.prod up
```

## Logs and Debugging

```bash
# View logs
docker-compose logs -f

# Or with docker run
docker logs -f resume-builder

# Enter container for debugging
docker exec -it resume-builder /bin/bash
```

## Resource Management

Adjust resources in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
    reservations:
      cpus: '1'
      memory: 1G
```

## Further Reading

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Docker Build Args vs ENV](https://docs.docker.com/engine/reference/builder/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/security)
