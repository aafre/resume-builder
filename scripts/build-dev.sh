#!/bin/bash
set -e

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep -v '^$' | xargs)
else
  echo "Error: .env file not found. Run from project root."
  exit 1
fi

# Validate required variables
: "${VITE_SUPABASE_URL:?Error: VITE_SUPABASE_URL is not set in .env}"
: "${VITE_SUPABASE_PUBLISHABLE_KEY:?Error: VITE_SUPABASE_PUBLISHABLE_KEY is not set in .env}"
: "${SUPABASE_URL:?Error: SUPABASE_URL is not set in .env}"
: "${SUPABASE_SECRET_KEY:?Error: SUPABASE_SECRET_KEY is not set in .env}"

VITE_APP_URL="${VITE_APP_URL:-https://dev.easyfreeresume.com}"
VITE_ENABLE_EXPLICIT_ADS="${VITE_ENABLE_EXPLICIT_ADS:-true}"
VITE_AFFILIATE_JOB_SEARCH_ENABLED="${VITE_AFFILIATE_JOB_SEARCH_ENABLED:-false}"
VITE_AFFILIATE_RESUME_REVIEW_ENABLED="${VITE_AFFILIATE_RESUME_REVIEW_ENABLED:-false}"
VITE_AFFILIATE_RESUME_REVIEW_URL="${VITE_AFFILIATE_RESUME_REVIEW_URL:-}"
VITE_APP_VERSION="${VITE_APP_VERSION:-dev-$(git rev-parse --short HEAD)}"

# Registry
REGISTRY="europe-west2-docker.pkg.dev/uk-vm-00001/resume-builder"
IMAGE_NAME="easyfreeresume-app"
TAG="dev"

echo ""
echo "========================================="
echo "  DEV Build — Environment Variables"
echo "========================================="
echo "  VITE_APP_URL              : $VITE_APP_URL"
echo "  VITE_APP_VERSION          : $VITE_APP_VERSION"
echo "  VITE_SUPABASE_URL         : $VITE_SUPABASE_URL"
echo "  VITE_SUPABASE_PUBLISHABLE : ${VITE_SUPABASE_PUBLISHABLE_KEY:0:16}..."
echo "  VITE_ENABLE_EXPLICIT_ADS  : $VITE_ENABLE_EXPLICIT_ADS"
echo "  VITE_AFFILIATE_JOB_SEARCH : $VITE_AFFILIATE_JOB_SEARCH_ENABLED"
echo "  VITE_AFFILIATE_REVIEW     : $VITE_AFFILIATE_RESUME_REVIEW_ENABLED"
if [ -n "$VITE_POSTHOG_KEY" ]; then
  echo "  VITE_POSTHOG_KEY          : ${VITE_POSTHOG_KEY:0:12}..."
else
  echo "  VITE_POSTHOG_KEY          : *** NOT SET — analytics will be disabled ***"
fi
echo "  SUPABASE_URL (backend)    : $SUPABASE_URL"
echo "  SUPABASE_SECRET_KEY       : ${SUPABASE_SECRET_KEY:0:12}..."
echo "========================================="
echo ""

docker build \
  --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="$VITE_SUPABASE_PUBLISHABLE_KEY" \
  --build-arg VITE_APP_URL="$VITE_APP_URL" \
  --build-arg VITE_ENABLE_EXPLICIT_ADS="$VITE_ENABLE_EXPLICIT_ADS" \
  --build-arg VITE_AFFILIATE_JOB_SEARCH_ENABLED="$VITE_AFFILIATE_JOB_SEARCH_ENABLED" \
  --build-arg VITE_AFFILIATE_RESUME_REVIEW_ENABLED="$VITE_AFFILIATE_RESUME_REVIEW_ENABLED" \
  --build-arg VITE_AFFILIATE_RESUME_REVIEW_URL="$VITE_AFFILIATE_RESUME_REVIEW_URL" \
  --build-arg VITE_APP_VERSION="$VITE_APP_VERSION" \
  --build-arg VITE_POSTHOG_KEY="$VITE_POSTHOG_KEY" \
  -t "$IMAGE_NAME:$TAG" \
  .

echo "Tagging for registry..."
docker tag "$IMAGE_NAME:$TAG" "$REGISTRY/$IMAGE_NAME:$TAG"

echo ""
echo "Build complete!"
echo ""

# Verify build freshness — confirms code changes were picked up
echo "Verifying build freshness..."
BAKED=$(docker run --rm "$IMAGE_NAME:$TAG" cat /app/static/.build-version)
echo "  Baked version : $BAKED"
echo "  Expected      : $VITE_APP_VERSION"
if [ "$BAKED" != "$VITE_APP_VERSION" ]; then
  echo "WARNING: Version mismatch — build may have used stale cache. Re-run with: docker build --no-cache ..."
fi

# Verify PostHog was baked into the JS bundle
echo "Verifying PostHog in bundle..."
if docker run --rm "$IMAGE_NAME:$TAG" grep -rl "posthog" /app/static/assets/*.js > /dev/null 2>&1; then
  echo "  PostHog: FOUND in JS bundle"
else
  echo "  PostHog: NOT FOUND in JS bundle — analytics will not work!"
  if [ -z "$VITE_POSTHOG_KEY" ]; then
    echo "  Cause: VITE_POSTHOG_KEY was empty at build time (check .env)"
  fi
fi
echo ""
echo "To push: docker push $REGISTRY/$IMAGE_NAME:$TAG"
echo ""
echo "To test locally:"
echo "  docker run -p 5000:5000 \\"
echo "    -e SUPABASE_URL=$SUPABASE_URL \\"
echo "    -e SUPABASE_SECRET_KEY=$SUPABASE_SECRET_KEY \\"
echo "    -e ADZUNA_APP_ID=\$ADZUNA_APP_ID \\"
echo "    -e ADZUNA_APP_KEY=\$ADZUNA_APP_KEY \\"
echo "    $IMAGE_NAME:$TAG"
echo ""
echo "If cache seems stale, re-run with: docker build --no-cache ..."
echo "To clear all build cache: docker builder prune"
