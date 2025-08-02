[![Tests and Build](https://github.com/aafre/resume-builder/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/aafre/resume-builder/actions/workflows/pr-validation.yml)
[![Tests and Build](https://img.shields.io/github/actions/workflow/status/aafre/resume-builder/pr-validation.yml?branch=main)](https://github.com/aafre/resume-builder/actions)
[![License](https://img.shields.io/github/license/aafre/resume-builder.svg)](LICENSE)

# Professional Resume Builder 📝
Create Professional, ATS-Friendly Resumes. Private, Free, and No Sign-Up Required.

**[🔗 Start Building Your Resume →](https://easyfreeresume.com)**

✨ Intuitive User Interface • 🔒 Privacy-first • ⚡ Instant PDF download 

## How It Works

1. **[Visit the App](https://easyfreeresume.com)** - Open in any browser
2. **Choose a Template** - Select from professional designs
3. **Fill Your Info** - Easy visual editor with auto-save
4. **Download PDF** - Get your polished resume instantly

That's it! No account creation, no email verification, no complicated setup.

---

## Key Features

### 🎯 **Smart Resume Builder**
- **Visual Editor**: No coding or YAML editing required
- **Auto-Save**: Your work is automatically saved as you type

### 🔒 **Privacy Focused**
- **No Sign-Up**: Start building immediately
- **Local Storage**: Your data saved on your device
- **No Tracking**: No personal information saved, ever. 
- **Export Control**: Download and keep your resume as YAML file.

### 📝 **Professional Output**
- **ATS-Compatible**: Optimized text formatting ensures your resume passes automated screening systems
- **Multiple Templates**: Clean, modern designs that stand out to hiring managers
- **Customizable Sections**: Rearrange, add, or remove resume sections to perfectly tailor your resume for any job
- **Icon Support**: Upload custom icons to personalize your resume and highlight key information 

---

## Templates

Choose from professionally designed templates that showcase your experience effectively. All templates are ATS-optimized and customizable to match your personal style.

<details>
  <summary><strong>Available Templates (4)</strong></summary>

### Professional
Clean, structured layout with traditional formatting and excellent space utilization
- **Sample YAML:** `samples/classic/alex_rivera_data.yml`
- **Template ID:** `classic-alex-rivera`
- **Best for:** Data professionals, traditional industries, structured presentations

![Professional Template](docs/templates/alex_rivera.png)

### Elegant  
Refined design with sophisticated typography and organized section layout
- **Sample YAML:** `samples/classic/jane_doe.yml`
- **Template ID:** `classic-jane-doe`
- **Best for:** Marketing, consulting, professional services

![Elegant Template](docs/templates/jane_doe.png)

### Minimalist
Clean, professional design focusing on content clarity
- **Sample YAML:** `samples/modern/john_doe_no_icon.yml`
- **Template ID:** `modern-no-icons`
- **Best for:** Traditional industries, conservative companies

![Minimalist Template](docs/templates/modern-no-icons.png)

### Modern
Contemporary design enhanced with visual icons and dynamic styling elements
- **Sample YAML:** `samples/modern/john_doe.yml`  
- **Template ID:** `modern-with-icons`
- **Best for:** Tech, creative, and modern industries

![Modern Template](docs/templates/modern-with-icons.png)
</details>

<details>
  <summary><strong>Future Templates</strong></summary>

### Creative (Planned)
Bold, visual-first design for creative professionals
- **Status:** Design phase - accepting feedback and suggestions
- **Expected:** Future release

*Have a template idea? [Open an issue](https://github.com/aafre/resume-builder/issues) to suggest new designs!*
</details>

---

## Advanced Usage

### For Developers: YAML Templates

If you prefer working with code, you can create resumes using YAML files:

**Example YAML Structure:**
```yaml
- name: Skills
  type: dynamic-column-list
  content:
    - Python
    - Data Analysis
    - Team Management
```

**Supported Section Types:**
- **text:** Single-paragraph content
- **bulleted-list:** Traditional bullet points
- **inline-list:** Horizontal, comma-separated list
- **icon-list:** List with optional icons
- **dynamic-column-list:** Auto-adjusting columns
- **experience:** Job history with details
- **education:** Academic qualifications

### Local Development

#### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+
- **Docker** (optional, for containerized backend)

#### Frontend Setup
```bash
git clone https://github.com/aafre/resume-builder.git
cd resume-builder/resume-builder-ui

npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`

#### Backend Setup

**Option 1: Docker (Recommended)**
```bash
# From project root
docker build -t resume-api -f Dockerfile.dev.api .
docker run -p 5000:5000 resume-api
```

**Option 2: Direct Python**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Flask API server
python app.py
```
API will be available at `http://localhost:5000`

**Direct PDF Generation (No API)**
```bash
python resume_generator.py --template modern --input samples/modern/john_doe.yml --output output/resume.pdf
``` 


---

## Technologies Used

### Frontend
- **React 18** - Modern UI framework with hooks and context
- **TypeScript** - Type-safe JavaScript for better development experience  
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Router** - Client-side routing for single-page application

### Backend  
- **Flask** - Lightweight Python web framework
- **Jinja2** - Template engine for dynamic HTML generation
- **pdfkit** - PDF generation from HTML/CSS
- **Python 3.8+** - Core backend language

### Development & Testing
- **Vitest** - Fast unit testing framework
- **ESLint** - Code linting and style enforcement
- **Docker** - Containerization for consistent environments
- **GitHub Actions** - Automated testing and deployment

---

## Support & Contributing

### Getting Help
- 📋 [Open an Issue](https://github.com/aafre/resume-builder/issues) for bugs or feature requests
- 💡 Check existing issues before creating new ones
- 📖 Review this README for common questions

### Contributing
We welcome contributions! Whether it's:
- 🐛 Bug fixes
- ✨ New features  
- 🎨 Template designs
- 📝 Documentation improvements

Please submit a pull request or open an issue to discuss your ideas.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

*Ready to build your professional resume? [Get started at easyfreeresume.com →](https://easyfreeresume.com)*