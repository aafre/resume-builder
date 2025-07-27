[![Tests and Coverage](https://github.com/aafre/resume-builder/actions/workflows/test-frontend.yml/badge.svg)](https://github.com/aafre/resume-builder/actions/workflows/test-frontend.yml)
[![Build Status](https://img.shields.io/github/actions/workflow/status/aafre/resume-builder/test-frontend.yml?branch=main)](https://github.com/aafre/resume-builder/actions)
[![License](https://img.shields.io/github/license/aafre/resume-builder.svg)](LICENSE)

# Professional Resume Builder 📝
Effortlessly Create, Update, and Perfect Your ATS-Friendly Resume - Your Content, Always Perfectly Formatted.


**[🔗 Start Building Your Resume →](https://easyfreeresume.com)**

No signup required • Your data stays private 

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
- **Cross-Device**: Start on your phone, finish on your laptop
- **Template Switching**: Change designs without losing data

### 🔒 **Privacy Focused**
- **No Sign-Up**: Start building immediately
- **Local Storage**: Your data stays on your device
- **No Tracking**: We don't collect personal information
- **Export Control**: Download and keep your resume as YAML file

### 📝 **Professional Output**
- **ATS-Compatible**: Optimized for applicant tracking systems
- **Multiple Formats**: Clean, modern designs
- **Customizable Sections**: Add skills, experience, education, and more
- **Icon Support**: Enhance with professional icons

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

**Quick Setup:**
```bash
git clone https://github.com/aafre/resume-builder.git
cd resume-builder

# For the React Frontend: 
cd resume-builder-ui
npm install
npm run dev
```

**Docker for running backend:**
```bash
# API Backend
docker build -t resume-api -f Dockerfile.dev.api .
docker run -p 5000:5000 resume-api

# For direct PDF generation (without API)
python resume_generator.py --template modern --input samples/modern/john_doe.yml --output output/resume.pdf

# Run Flask API 
python app.py 
```

At this point the frontend should work with the backend locally. 


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

**[🚀 Start Building Your Resume Now →](https://easyfreeresume.com)**

*Build professional resumes in minutes.*