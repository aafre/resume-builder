FROM node:25-slim AS react-build

WORKDIR /app/react
COPY resume-builder-ui/package*.json ./

# Dependencies — cached unless package.json changes
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

# Playwright browser — cached unless @playwright/test version changes.
# No cache mount here: the binary must persist in the layer for later RUN steps.
RUN npx playwright install --with-deps chromium

# Build args declared AFTER dependency layers so changing them
# (e.g. VITE_APP_VERSION with git hash) doesn't bust npm/playwright cache.
# COPY below uses content hashing — any source file change triggers a rebuild.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_APP_URL
ARG VITE_ENABLE_EXPLICIT_ADS
ARG VITE_AFFILIATE_JOB_SEARCH_ENABLED
ARG VITE_AFFILIATE_RESUME_REVIEW_ENABLED
ARG VITE_AFFILIATE_RESUME_REVIEW_URL
ARG VITE_APP_VERSION
ARG VITE_POSTHOG_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_ENABLE_EXPLICIT_ADS=$VITE_ENABLE_EXPLICIT_ADS
ENV VITE_AFFILIATE_JOB_SEARCH_ENABLED=$VITE_AFFILIATE_JOB_SEARCH_ENABLED
ENV VITE_AFFILIATE_RESUME_REVIEW_ENABLED=$VITE_AFFILIATE_RESUME_REVIEW_ENABLED
ENV VITE_AFFILIATE_RESUME_REVIEW_URL=$VITE_AFFILIATE_RESUME_REVIEW_URL
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_POSTHOG_KEY=$VITE_POSTHOG_KEY

# Source code — content-hashed, rebuilds on ANY file change
COPY resume-builder-ui/ ./

# Build React app with embedded environment variables and prerender
# SEO-critical routes to static HTML for bot user-agents (Googlebot, etc.)
# .build-version is read by build scripts to verify freshness after build
RUN npm run build:prerender && echo "$VITE_APP_VERSION" > dist/.build-version


# Step 2: Set up Flask with Python 3.13 on Bookworm (LaTeX-friendly)
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS flask

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Install system dependencies for HTML PDF generation and LaTeX support
# Use cache mount to speed up apt operations
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        wkhtmltopdf \
        texlive-xetex \
        texlive-fonts-recommended \
        texlive-latex-recommended \
        texlive-plain-generic \
        texlive-fonts-extra \
        fontconfig \
        fonts-liberation \
        curl \
        poppler-utils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
# Use cache mount for uv/pip to speed up subsequent builds
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/uv \
    uv pip install --system -r requirements.txt

# Copy only necessary application files (excludes resume-builder-ui via .dockerignore patterns)
# Copy Python files
COPY --chown=appuser:appuser app.py resume_generator*.py job_engine.py jobs_pseo.py jobs_content.py generate_jobs_matrix.py ./
COPY --chown=appuser:appuser jobs_matrix.json ./

# Copy directories needed for the application
COPY --chown=appuser:appuser templates/ ./templates/
COPY --chown=appuser:appuser samples/ ./samples/
COPY --chown=appuser:appuser icons/ ./icons/
COPY --chown=appuser:appuser fonts/bundled/*.ttf /usr/share/fonts/
# Symlink texlive OpenType fonts (fontawesome5, etc.) so xdvipdfmx can find them
RUN ln -sf /usr/share/texlive/texmf-dist/fonts/opentype /usr/share/fonts/opentype-texlive
RUN fc-cache -f
COPY --chown=appuser:appuser docs/templates/ ./docs/templates/

# Copy built React assets from build stage
COPY --from=react-build --chown=appuser:appuser /app/react/dist/ /app/static/

# Create HOME directory for appuser and set proper permissions
RUN mkdir -p /home/appuser && \
    chown -R appuser:appuser /home/appuser && \
    chown -R appuser:appuser /app

# Set environment variables for cache directories and HOME
ENV HOME=/home/appuser
ENV XDG_CACHE_HOME=/tmp/.cache
ENV FONTCONFIG_CACHE=/tmp/.cache/fontconfig

# Security: Set production environment variables
ENV FLASK_ENV=production
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Backend runtime environment variables (set via docker run -e or docker-compose)
# These are NOT set here - provide them at container runtime
# Example: docker run -e SUPABASE_URL=https://... -e SUPABASE_SECRET_KEY=sb_secret_...
# Required variables:
#   - SUPABASE_URL
#   - SUPABASE_SECRET_KEY (format: sb_secret_...)
# Optional variables:
#   - DEBUG_LOGGING
#   - SUPABASE_DB_PASSWORD
#   - ADZUNA_APP_ID (required for Jobs feature)
#   - ADZUNA_APP_KEY (required for Jobs feature)

# Add security labels
LABEL security.non-root=true
LABEL version="2.0"
LABEL description="EasyFreeResume - A free, open-source resume builder"

# Switch to non-root user
USER appuser

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--timeout", "120", "app:app"]