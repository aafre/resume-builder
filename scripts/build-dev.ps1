$ErrorActionPreference = "Stop"

# Load environment variables from .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $Matches[1].Trim()
            $val = $Matches[2].Trim()
            # Strip surrounding quotes (bash xargs strips these)
            if (($val.StartsWith('"') -and $val.EndsWith('"')) -or
                ($val.StartsWith("'") -and $val.EndsWith("'"))) {
                $val = $val.Substring(1, $val.Length - 2)
            }
            [Environment]::SetEnvironmentVariable($key, $val, "Process")
        }
    }
} else {
    Write-Error "Error: .env file not found. Run from project root."
    exit 1
}

# Validate required variables
$required = @(
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_URL",
    "SUPABASE_SECRET_KEY"
)
foreach ($var in $required) {
    if (-not [Environment]::GetEnvironmentVariable($var, "Process")) {
        Write-Error "Error: $var is not set in .env"
        exit 1
    }
}

# Defaults
$VITE_SUPABASE_URL = $env:VITE_SUPABASE_URL
$VITE_SUPABASE_PUBLISHABLE_KEY = $env:VITE_SUPABASE_PUBLISHABLE_KEY
$SUPABASE_URL = $env:SUPABASE_URL
$SUPABASE_SECRET_KEY = $env:SUPABASE_SECRET_KEY
$VITE_APP_URL = if ($env:VITE_APP_URL) { $env:VITE_APP_URL } else { "https://dev.easyfreeresume.com" }
$VITE_ENABLE_EXPLICIT_ADS = if ($env:VITE_ENABLE_EXPLICIT_ADS) { $env:VITE_ENABLE_EXPLICIT_ADS } else { "true" }
$VITE_AFFILIATE_JOB_SEARCH_ENABLED = if ($env:VITE_AFFILIATE_JOB_SEARCH_ENABLED) { $env:VITE_AFFILIATE_JOB_SEARCH_ENABLED } else { "false" }
$VITE_AFFILIATE_RESUME_REVIEW_ENABLED = if ($env:VITE_AFFILIATE_RESUME_REVIEW_ENABLED) { $env:VITE_AFFILIATE_RESUME_REVIEW_ENABLED } else { "false" }
$VITE_AFFILIATE_RESUME_REVIEW_URL = if ($env:VITE_AFFILIATE_RESUME_REVIEW_URL) { $env:VITE_AFFILIATE_RESUME_REVIEW_URL } else { "" }
$GIT_HASH = (git rev-parse --short HEAD).Trim()
$VITE_APP_VERSION = if ($env:VITE_APP_VERSION) { $env:VITE_APP_VERSION } else { "dev-$GIT_HASH" }
$VITE_POSTHOG_KEY = if ($env:VITE_POSTHOG_KEY) { $env:VITE_POSTHOG_KEY } else { "" }

# Registry
$REGISTRY = "europe-west2-docker.pkg.dev/uk-vm-00001/resume-builder"
$IMAGE_NAME = "easyfreeresume-app"
$TAG = "dev"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  DEV Build - Environment Variables" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  VITE_APP_URL              : $VITE_APP_URL"
Write-Host "  VITE_APP_VERSION          : $VITE_APP_VERSION"
Write-Host "  VITE_SUPABASE_URL         : $VITE_SUPABASE_URL"
Write-Host "  VITE_SUPABASE_PUBLISHABLE : $($VITE_SUPABASE_PUBLISHABLE_KEY.Substring(0,16))..."
Write-Host "  VITE_ENABLE_EXPLICIT_ADS  : $VITE_ENABLE_EXPLICIT_ADS"
Write-Host "  VITE_AFFILIATE_JOB_SEARCH : $VITE_AFFILIATE_JOB_SEARCH_ENABLED"
Write-Host "  VITE_AFFILIATE_REVIEW     : $VITE_AFFILIATE_RESUME_REVIEW_ENABLED"
if ($VITE_POSTHOG_KEY) {
    Write-Host "  VITE_POSTHOG_KEY          : $($VITE_POSTHOG_KEY.Substring(0,12))..." -ForegroundColor Green
} else {
    Write-Host "  VITE_POSTHOG_KEY          : *** NOT SET - analytics will be disabled ***" -ForegroundColor Red
}
Write-Host "  SUPABASE_URL (backend)    : $SUPABASE_URL"
Write-Host "  SUPABASE_SECRET_KEY       : $($SUPABASE_SECRET_KEY.Substring(0,12))..."
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

docker build `
    --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" `
    --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="$VITE_SUPABASE_PUBLISHABLE_KEY" `
    --build-arg VITE_APP_URL="$VITE_APP_URL" `
    --build-arg VITE_ENABLE_EXPLICIT_ADS="$VITE_ENABLE_EXPLICIT_ADS" `
    --build-arg VITE_AFFILIATE_JOB_SEARCH_ENABLED="$VITE_AFFILIATE_JOB_SEARCH_ENABLED" `
    --build-arg VITE_AFFILIATE_RESUME_REVIEW_ENABLED="$VITE_AFFILIATE_RESUME_REVIEW_ENABLED" `
    --build-arg VITE_AFFILIATE_RESUME_REVIEW_URL="$VITE_AFFILIATE_RESUME_REVIEW_URL" `
    --build-arg VITE_APP_VERSION="$VITE_APP_VERSION" `
    --build-arg VITE_POSTHOG_KEY="$VITE_POSTHOG_KEY" `
    -t "${IMAGE_NAME}:${TAG}" `
    .

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Tagging for registry..."
docker tag "${IMAGE_NAME}:${TAG}" "${REGISTRY}/${IMAGE_NAME}:${TAG}"

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Build complete!"
Write-Host ""

# Verify build freshness -- confirms code changes were picked up
Write-Host "Verifying build freshness..."
$baked = docker run --rm "${IMAGE_NAME}:${TAG}" cat /app/static/.build-version
Write-Host "  Baked version : $baked"
Write-Host "  Expected      : $VITE_APP_VERSION"
if (-not $baked -or $baked.Trim() -ne $VITE_APP_VERSION) {
    Write-Warning "Version mismatch -- build may have used stale cache. Re-run with: docker build --no-cache ..."
}

# Verify PostHog was baked into the JS bundle
Write-Host "Verifying PostHog in bundle..."
$phCheck = docker run --rm "${IMAGE_NAME}:${TAG}" grep -rl "posthog" /app/static/assets/ 2>$null
if ($phCheck) {
    Write-Host "  PostHog: FOUND in JS bundle" -ForegroundColor Green
} else {
    Write-Host "  PostHog: NOT FOUND in JS bundle - analytics will not work!" -ForegroundColor Red
    if (-not $VITE_POSTHOG_KEY) {
        Write-Host "  Cause: VITE_POSTHOG_KEY was empty at build time (check .env)" -ForegroundColor Yellow
    }
}
Write-Host ""
Write-Host "To push: docker push ${REGISTRY}/${IMAGE_NAME}:${TAG}"
Write-Host ""
Write-Host "To test locally:"
Write-Host "  docker run -p 5000:5000 ``"
Write-Host "    -e SUPABASE_URL=$SUPABASE_URL ``"
Write-Host "    -e SUPABASE_SECRET_KEY=$SUPABASE_SECRET_KEY ``"
Write-Host "    -e ADZUNA_APP_ID=`$ADZUNA_APP_ID ``"
Write-Host "    -e ADZUNA_APP_KEY=`$ADZUNA_APP_KEY ``"
Write-Host "    ${IMAGE_NAME}:${TAG}"
Write-Host ""
Write-Host "If cache seems stale, re-run with: docker build --no-cache ..."
Write-Host "To clear all build cache: docker builder prune"
