# Step 1: Build the React app
FROM node:22 AS react-build

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app/react
COPY resume-builder-ui/package*.json ./
RUN npm install
COPY resume-builder-ui/ ./
RUN npm run build


# Step 2: Set up the Flask/uv environment
# Use the uv image (Python 3.11 on slim-bookworm) so uv is preinstalled
FROM ghcr.io/astral-sh/uv:0.7.8-python3.11-bookworm-slim AS flask

WORKDIR /app

# Install system deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends wkhtmltopdf && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better layer caching
COPY requirements.txt .

# Use uv to install into the system Python environment
# (--system avoids creating a virtualenv inside the container)
RUN uv pip install --system --no-cache -r requirements.txt

# Copy the rest of your Flask app
COPY . .

# Remove the React source directory (we only need the built assets)
RUN rm -rf /app/resume-builder-ui

# Copy the React build output into Flask’s static folder
COPY --from=react-build /app/react/dist/ /app/static/

# Expose Cloud Run port
EXPOSE 5000

# Start with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
