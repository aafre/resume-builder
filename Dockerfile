FROM node:25 AS react-build

# Build-time arguments for Vite (frontend environment variables)
# These get embedded into the JavaScript bundle during build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set as environment variables for Vite build process
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

WORKDIR /app/react
COPY resume-builder-ui/package*.json ./
RUN npm ci
COPY resume-builder-ui/ ./

# Build React app with embedded environment variables
RUN npm run build


# Step 2: Set up Flask with Python 3.13 on Bookworm (LaTeX-friendly)
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS flask

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Install system dependencies for HTML PDF generation and LaTeX support
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        wkhtmltopdf \
        texlive-xetex \
        texlive-fonts-recommended \
        texlive-latex-recommended \
        texlive-plain-generic \
        texlive-fonts-extra \
        fontconfig \
        curl \
        poppler-utils \
        && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

# Copy application files with proper ownership
COPY --chown=appuser:appuser . .

# Remove React source directory and copy built assets with proper ownership
RUN rm -rf /app/resume-builder-ui
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
# Example: docker run -e SUPABASE_URL=https://... -e SUPABASE_SERVICE_KEY=...
# Required variables:
#   - SUPABASE_URL
#   - SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY)
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