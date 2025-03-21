[![Tests and Coverage](https://github.com/aafre/resume-builder/actions/workflows/test-frontend.yml/badge.svg)](https://github.com/aafre/resume-builder/actions/workflows/test-frontend.yml)
[![Build Status](https://img.shields.io/github/actions/workflow/status/aafre/resume-builder/test-frontend.yml?branch=main)](https://github.com/aafre/resume-builder/actions)
[![License](https://img.shields.io/github/license/aafre/resume-builder.svg)](LICENSE)

# Resume/CV Builder 🛠️
**Create Professional Résumés with Ease 🚀**

## Table of Contents
- [Try It Online](#try-it-online)
- [Project Overview](#project-overview)
- [Usage Guide](#usage-guide)
- [YAML Template Guide](#yaml-template-guide)
- [Templates](#templates)
- [Features](#features)
- [Troubleshooting](#troubleshooting)
- [Getting Started](#getting-started)
- [Docker Setup](#docker-setup)
- [Contributing](#contributing)

---

## Try It Online
Generate your resume instantly:
1. **[Download a Sample Template](samples/modern/).**
2. Edit it with your details.
3. Upload it at [easyfreeresume.com](https://easyfreeresume.com).

## React UI (Development)

The React UI for creating, editing, and updating resumes is available at [dev.easyfreeresume.com](http://dev.easyfreeresume.com). Please note that this interface is currently in development and may be unstable. The homepage presently displays dummy data.


---

## Project Overview
Simplify your resume creation process and focus on what matters—your content.
- **Effortless Updates:** Edit one YAML file.
- **Modern Designs:** Choose from sleek, ATS-friendly templates.
- **Custom PDFs:** Instantly generate a polished resume.

---

## Usage Guide
1. **Download a Template:**  
   [Modern Template](samples/modern/)
2. **Edit Your Details:**  
   Open the file in any text editor (Notepad, VS Code, etc.) and update your info.
3. **Generate Your Resume:**  
   Upload your file at [easyfreeresume.com](https://easyfreeresume.com).

For more advanced customization, see the YAML Template Guide.

---

## YAML Template Guide
Your resume is defined in a simple YAML file—no coding required!

**Example:**
```yaml
- name: Skills
  type: dynamic-column-list
  content:
    - Python
    - Data Analysis
    - Team Management
```

**Supported Types:**
- **text:** Single-paragraph content.
- **bulleted-list:** A list of items.
- **inline-list:** Compact, inline list.
- **icon-list:** List with optional icons.
- **dynamic-column-list:** Auto-adjusting columns.
- **experience:** Job history details.
- **education:** Academic qualifications.

Customize any section like so:
```yaml
- name: [Section Name]
  type: [Section Type]
  content:
    - Item 1
    - Item 2
```

---

## Templates
<details>
  <summary>Available Templates</summary>

**Modern (No Icons)**  
YAML: `samples/modern/john_doe_no_icon.yml`  
![Modern No Icons](docs/templates/modern-no-icons.png)

**Modern (With Icons)**  
YAML: `samples/modern/john_doe.yml`  
![Modern With Icons](docs/templates/modern-with-icons.png)
</details>

<details>
  <summary>Upcoming Templates</summary>

**Minimalist (Work in Progress)**  
![Minimalist](docs/templates/classic-no-icon.png)

**Creative (Planned)**  
YAML: `samples/creative_sample.yml` *(Coming Soon)*
</details>

---

## Features
- **Dynamic Templates:** Multiple ATS-friendly designs.
- **Flexible Customization:** Edit your YAML files with ease.
- **Icon & Logo Support:** Personalize your resume.
- **Responsive Layouts:** Modern, clean formatting.
- **PDF Generation:** Download a ready-to-use resume.

---

## Troubleshooting
- **Resume Not Generating?**  
  Verify that all required fields are filled and your file is in `.yaml` format.
- **Custom Icons?**  
  Upload PNG, JPG, or SVG files with your template.
- Need help? Visit our [GitHub Issues](https://github.com/aafre/resume-builder/issues).

---

## Getting Started
Quick setup:
```bash
git clone https://github.com/aafre/resume-builder.git
cd resume-builder
```
- Edit a sample template from the [Templates](#templates) section.
- Generate your resume:
```bash
python resume_generator.py --template modern --input data/sample.yml --output output/resume.pdf
```

---

## Docker Setup
Build and run using Docker:
```bash
docker build -t resume-api -f Dockerfile.dev.api .
docker run -p 5000:5000 resume-api
```
For the frontend:
```bash
cd resume-builder-ui
npm run dev
```

---

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to help improve this project.
