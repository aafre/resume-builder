FROM node:25-slim AS react-build

# Build-time arguments for Vite (frontend environment variables)
# These get embedded into the JavaScript bundle during build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_APP_URL

# Set as environment variables for Vite build process
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_APP_URL=$VITE_APP_URL

WORKDIR /app/react
COPY resume-builder-ui/package*.json ./

# Use cache mount for npm to speed up subsequent builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

COPY resume-builder-ui/ ./

# Build React app with embedded environment variables
RUN npm run build


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
        curl \
        poppler-utils

# Copy requirements and install Python dependencies
# Use cache mount for uv/pip to speed up subsequent builds
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/uv \
    uv pip install --system -r requirements.txt

# Copy only necessary application files (excludes resume-builder-ui via .dockerignore patterns)
# Copy Python files
COPY --chown=appuser:appuser app.py resume_generator*.py ./

# Copy directories needed for the application
COPY --chown=appuser:appuser templates/ ./templates/
COPY --chown=appuser:appuser samples/ ./samples/
COPY --chown=appuser:appuser icons/ ./icons/

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

# Add security labels
LABEL security.non-root=true
LABEL version="2.0"
LABEL description="EasyFreeResume - A free, open-source resume builder"

# Switch to non-root user
USER appuser

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--timeout", "120", "app:app"]