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

# Registry
REGISTRY="europe-west2-docker.pkg.dev/uk-vm-00001/resume-builder"
IMAGE_NAME="easyfreeresume-app"
TAG="dev"

echo "Building DEV Docker image..."
echo "  VITE_APP_URL: $VITE_APP_URL"
echo "  VITE_SUPABASE_URL: $VITE_SUPABASE_URL"

docker build \
  --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="$VITE_SUPABASE_PUBLISHABLE_KEY" \
  --build-arg VITE_APP_URL="$VITE_APP_URL" \
  -t "$IMAGE_NAME:$TAG" \
  .

echo "Tagging for registry..."
docker tag "$IMAGE_NAME:$TAG" "$REGISTRY/$IMAGE_NAME:$TAG"

echo ""
echo "Build complete!"
echo "To push: docker push $REGISTRY/$IMAGE_NAME:$TAG"
echo ""
echo "To test locally:"
echo "  docker run -p 5000:5000 \\"
echo "    -e SUPABASE_URL=$SUPABASE_URL \\"
echo "    -e SUPABASE_SECRET_KEY=$SUPABASE_SECRET_KEY \\"
echo "    $IMAGE_NAME:$TAG"
