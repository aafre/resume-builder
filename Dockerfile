# Use the official Python image as a base
FROM python:3.9-slim

# Install wkhtmltopdf and other dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    wkhtmltopdf \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code into the container
COPY . .

# Expose the port that Cloud Run requires
EXPOSE 5000

# Command to run the app with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
