# Resume Builder 


## Project Goal

This tool helps simplify the process of building professional, ATS-compliant, and visually appealing resumes using structured user-provided data. By separating content from design, this project empowers users to:
- Quickly update your resume without worrying about formatting.
- Maintain a consistent and polished appearance.
- Generate PDF resumes that:
    - Include icons, hyperlinks, and logos where appropriate.
    - Are ATS-compatible to ensure resumes are parsed correctly by job application systems.
    - Present information in a clean, modern layout with multiple template options.
- Highly flexible YAML file to design your resume. Use one of our preexisting templates from the `templates/` folder. 


## Templates

### Modern (No Icons)

A clean, single-column layout with no custom icons.

**YAML Sample:**  
`template_path: samples/modern_sample.yml`

**Screenshot:**  
![Modern Resume (No Icons)](docs/templates/modern-no-icons.png)

---

<details>
  <summary>View Upcoming Templates</summary>


### Modern (With Icons)

A clean, single-column layout with decorative icons for sections like contact information and certifications.

**YAML Sample:**  
`template_path: samples/modern_with_icons.yml`

*(Screenshot coming soon)*


### Minimalist (Work in Progress)

A streamlined, no-frills layout focused purely on content with minimal design elements.

**YAML Sample:**  
`template_path: samples/minimalist_sample.yml`

*(Screenshot coming soon)*


### Creative (Planned)

A visually striking layout featuring color highlights and unique typography for a bold statement.

**YAML Sample:**  
`template_path: samples/creative_sample.yml`

*(Screenshot and YAML file coming soon)*

</details>


## Features

### Core Features

- **Dynamic Templates**: Choose from multiple styles with distinct layouts and formatting.
- **ATS Compatibility**: Ensures resumes are parsed correctly by Applicant Tracking Systems.
- **Structured Data**: Use YAML to input resume data for flexibility and ease of use.
- **Customizable Icons and Logos**: Add company icons, skill logos, or section-specific icons (optional).
- **Custom fonts**: Supports Google fonts.
- **Multi-column Support**: Dynamic adjustment for skill lists and other sections to optimize space.
- **PDF Generation**: Output resumes in a polished PDF format.


## Getting Started

### Quick Start Guide: 

1. **Clone the repository**:

```bash
git clone https://github.com/aafre/resume-builder.git
```

2. **Navigate to the project directory**: 

```bash
cd resume-builder
```

3. **Prepare your input**: 
    - Explore the Resume [Templates](#Templates) section below to preview available resume styles and choose the one that best suits your needs.
    - Edit the `.yaml` file from the `samples/` folder with your details.
        - **First time use**: Start with the sample template by simply updating the content with your details. Then, proceed to the [execution](#execution) step.
        - **Advanced Use**: Refer to the [Supported Section Types](#supported-section-types) section to customize your resume format with additional or modified sections.


### Execution


#### Option 1: Simplest Approach – Executable (Work in Progress)

- This feature is currently under development.
- Once available, this option will allow you to generate resumes without any setup by running a pre-built executable file.


#### Option 2: Run Using Python

1. **Create a virtual environment and Install dependencies**: 

```bash
pip install -r requirements.txt
```


2. **Generate your resume**:
Run the script using the command below. Replace <template> with the desired template name, <input> with the path to your `.yaml` file, and <output> with the desired output file location.

```bash 
python resume_generator.py --template modern --input data/sample.yml --output output/resume.pdf
```

Flag Details:
- `--template`: Specify the template name (modern, etc.).
- `--input`: Path to the .yaml file containing resume data.
- `--output`: Path to save the generated PDF.


#### Option 2: Run Using Python

1. **Build the Docker Image**:

```bash 
docker build -t resume-builder .
```

2. **Run the container**: 

```bash 
docker run -it --rm -v "${pwd}:/app/" --entrypoint /bin/bash resume-builder
```

For windows users, replace `${pwd}` with `%cd%`.

3. **Generate Your Resume**:

```bash
python resume_generator.py --template modern --input data/sample.yml --output output/resume.pdf
```
