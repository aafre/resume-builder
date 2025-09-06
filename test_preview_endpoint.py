#!/usr/bin/env python3
"""
Test script for the preview endpoint.
This script tests the /api/preview/img endpoint to ensure it works correctly.
"""

import requests
import tempfile
import os
from pathlib import Path

def test_preview_endpoint():
    """Test the preview endpoint with a sample YAML file."""
    
    # Sample YAML content for testing
    sample_yaml = """
name: John Doe
title: Software Engineer
contact_info:
  email: john.doe@example.com
  phone: +1-555-0123
  location: San Francisco, CA
  linkedin: linkedin.com/in/johndoe
sections:
  - name: Summary
    type: text
    content: Experienced software engineer with expertise in Python, React, and cloud technologies.
  
  - name: Skills
    type: dynamic-column-list
    content:
      - Python
      - JavaScript
      - React
      - Node.js
      - AWS
      - Docker
  
  - name: Experience
    type: experience
    content:
      - company: Tech Corp
        position: Senior Software Engineer
        duration: 2020 - Present
        description: Led development of microservices architecture and mentored junior developers.
      
      - company: Startup Inc
        position: Full Stack Developer
        duration: 2018 - 2020
        description: Built and maintained web applications using modern technologies.
  
  - name: Education
    type: education
    content:
      - degree: Bachelor of Science in Computer Science
        institution: University of Technology
        year: 2018
"""
    
    # Create a temporary YAML file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.yml', delete=False) as f:
        f.write(sample_yaml)
        yaml_path = f.name
    
    try:
        # Prepare the request
        url = "http://10.122.235.117:5000/api/preview/img"
        
        # Create form data - properly handle file opening and closing
        yaml_file = open(yaml_path, 'rb')
        try:
            files = {
                'yaml_file': ('test_resume.yml', yaml_file, 'application/x-yaml')
            }
            
            data = {
                'template': 'modern-with-icons',
                'session_id': 'test_session_123'
            }
            
            print("Testing preview endpoint...")
            print(f"URL: {url}")
            print(f"Template: {data['template']}")
            print(f"Session ID: {data['session_id']}")
            
            # Make the request
            response = requests.post(url, files=files, data=data)
            
            # Check the response
            print(f"\nResponse Status: {response.status_code}")
            print(f"Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                # Save the preview image
                preview_path = "test_preview.png"
                with open(preview_path, 'wb') as f:
                    f.write(response.content)
                print(f"\n✅ Preview generated successfully!")
                print(f"Preview saved to: {preview_path}")
                print(f"File size: {len(response.content)} bytes")
            else:
                print(f"\n❌ Preview generation failed!")
                print(f"Error: {response.text}")
                
        finally:
            yaml_file.close()
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure the Flask server is running on http://10.122.235.117:5000")
        print("Run: python app.py")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        # Clean up
        try:
            if os.path.exists(yaml_path):
                os.unlink(yaml_path)
        except Exception as cleanup_error:
            print(f"Warning: Could not clean up temporary file: {cleanup_error}")
        print("\nTest completed.")

if __name__ == "__main__":
    test_preview_endpoint()
