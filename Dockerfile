# Step 1: Build the React app
FROM node:22 AS react-build

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app/react
COPY resume-builder-ui/package*.json ./
RUN npm install
COPY resume-builder-ui/ ./
RUN npm run build

# Step 2: Set up the Python (Flask) environment
FROM python:3.11-slim-bullseye AS flask 
WORKDIR /app

# Install wkhtmltopdf and other dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    wkhtmltopdf \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Step 3: Copy the Flask app
COPY . .

# Remove React code 
RUN rm -rf /app/resume-builder-ui

# Copy React build output to Flask's static folder
COPY --from=react-build /app/react/dist/ /app/static/

# Expose the port that Cloud Run requires
EXPOSE 5000

# Command to run the app with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
