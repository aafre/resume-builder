# Use the official Python image as a base
FROM python:3.9-slim

# Install wkhtmltopdf, xvfb, and other dependencies
RUN apt-get update && \
    apt-get install -y \
    wkhtmltopdf \
    && apt-get clean

# Set the working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the application code into the container
COPY . .

# Command to run the Python script through xvfb
CMD ["python", "resume_generator.py"]
