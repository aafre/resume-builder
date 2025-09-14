FROM node:24 AS react-build

WORKDIR /app/react
COPY resume-builder-ui/package*.json ./
RUN npm ci
COPY resume-builder-ui/ ./
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
        texlive-fonts-extra \
        fontconfig \
        curl \
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

# Add security labels
LABEL security.non-root=true
LABEL version="1.0"
LABEL description="EasyFreeResume - A free, open-source resume builder"

# Switch to non-root user
USER appuser

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--timeout", "120", "app:app"]