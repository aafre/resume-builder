# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resume Builder is a full-stack application with Flask backend and React frontend. The app generates professional PDF resumes from YAML templates using HTML/CSS templates and pdfkit.

**Architecture:**
- **Frontend**: React + TypeScript + Vite (resume-builder-ui/)
- **Backend**: Flask app (app.py) - serves React app and handles API requests
- **PDF Generation**: Python script (resume_generator.py) using Jinja2 templates + pdfkit
- **Templates**: HTML/CSS templates in templates/ directory (currently "modern" theme)

## Development Commands

### Frontend (resume-builder-ui/)
```bash
cd resume-builder-ui
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm test             # Run Vitest tests
npm run test:watch   # Run tests in watch mode
npm run coverage     # Generate test coverage
```

### Backend - Flask
```bash
python app.py        # Start Flask development server on port 5000
```

### PDF Generation
```bash
python resume_generator.py --template modern --input samples/modern/john_doe.yml --output output/resume.pdf
```

### Testing
```bash
# Frontend tests
cd resume-builder-ui && npm test
```

### Docker
```bash
# API container
docker build -t resume-api -f Dockerfile.dev.api .
docker run -p 5000:5000 resume-api

# Script container
docker build -t resume-script -f Dockerfile.dev.script .
```

## Key Architecture Details

### Data Flow
1. User uploads YAML file + optional icons via React frontend
2. Flask backend receives files, validates YAML structure
3. resume_generator.py processes YAML using Jinja2 templates
4. HTML is rendered with custom CSS styling
5. pdfkit converts HTML to PDF and returns to user

### Template System
- Templates are in templates/{template_name}/ directories
- Each template has base.html, styles.css, and component HTML files
- YAML structure defined by TypeScript interfaces in resume-builder-ui/src/types.ts
- Sample YAML files in samples/ directory show expected structure

### Section Types
The YAML resume format supports these section types:
- `text`: Single paragraph content
- `bulleted-list`: List with bullet points  
- `inline-list`: Comma-separated inline list
- `icon-list`: List items with optional icons (certifications)
- `dynamic-column-list`: Auto-adjusting column layout
- `experience`: Job history with company, title, dates, description
- `education`: Academic qualifications with degree, school, year

### Icon System
- Icons stored in icons/ directory
- Supported formats: PNG, JPG, SVG
- Icons referenced by filename in YAML (e.g., `icon: "company_google.png"`)
- Frontend allows icon upload during resume creation

### API Endpoints
- `GET /api/templates` - List available templates
- `GET /api/template/{id}` - Get template YAML data
- `POST /api/generate` - Generate PDF from YAML + icons
- `GET /api/template/{id}/download` - Download template YAML

### File Structure Notes
- app.py is the Flask app that serves the React frontend and handles API requests
- Templates use Jinja2 with custom functions like calculate_columns() for dynamic layouts