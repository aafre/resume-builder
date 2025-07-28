import subprocess
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
import re
import logging  # For clean, thoughtful logging

# Set up logging for this module
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def _escape_latex(text):
    """
    Escapes special LaTeX characters in a string to prevent compilation errors.
    This function handles common LaTeX control characters.

    Args:
        text (str): The input string to be escaped.

    Returns:
        str: The string with LaTeX special characters escaped.
    """
    if not isinstance(text, str):
        # Return non-string types (like numbers, booleans) as is,
        # as they don't need LaTeX escaping.
        return text

    # Define a mapping for LaTeX special characters
    # Order matters for some replacements (e.g., '\' before '&')
    latex_special_chars = {
        "\\": r"\textbackslash{}",  # Backslash must be escaped first
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
        "<": r"\textless{}",
        ">": r"\textgreater{}",
        "|": r"\textbar{}",
        # Hyphen/dash handling: default hyphen is good, but for en/em dashes use text-specific commands
        "-": r"{-}",  # Protect hyphens that might be misinterpreted as math operators
    }

    # Use a regular expression to find and replace all special characters
    # This approach ensures each character is handled once
    pattern = re.compile("|".join(re.escape(key) for key in latex_special_chars.keys()))
    escaped_text = pattern.sub(lambda match: latex_special_chars[match.group(0)], text)

    return escaped_text


def _get_social_media_handle(url):
    """
    Extracts the social media handle from a given URL.

    Args:
        url (str): The social media URL (e.g., "https://linkedin.com/in/JohnDoe").

    Returns:
        str: The extracted social media handle (e.g., "JohnDoe"), or an empty string if not found.
    """
    if url:
        # Remove any trailing slashes to ensure split always gets the handle
        url = url.rstrip("/")
        return url.split("/")[-1]
    return ""


def _prepare_latex_data(data):
    """
    Recursively applies LaTeX escaping to all string values in the data dictionary
    and derives special fields like linkedin_handle.

    Args:
        data (dict): The resume data loaded from YAML.

    Returns:
        dict: The data with strings escaped for LaTeX and derived fields added.
    """
    logger.info(
        "Preparing data for LaTeX rendering, applying escaping and deriving fields."
    )

    # Deep copy the data to avoid modifying the original dictionary passed in
    import copy

    prepared_data = copy.deepcopy(data)

    # Apply LaTeX escaping recursively, but preserve section types for logic
    def apply_escaping_recursive(item, current_key=None):
        if isinstance(item, str):
            # Don't escape section types as they're used for template logic
            if current_key == "type":
                return item
            return _escape_latex(item)
        elif isinstance(item, dict):
            return {k: apply_escaping_recursive(v, k) for k, v in item.items()}
        elif isinstance(item, list):
            return [apply_escaping_recursive(elem) for elem in item]
        else:
            return item

    prepared_data = apply_escaping_recursive(prepared_data)

    # Derive linkedin_handle and ensure LinkedIn URL has protocol
    contact_info = prepared_data.get("contact_info", {})
    if contact_info:
        linkedin_url = contact_info.get("linkedin", "")
        if (
            linkedin_url
            and not linkedin_url.startswith("http://")
            and not linkedin_url.startswith("https://")
        ):
            contact_info["linkedin"] = (
                "https://" + linkedin_url
            )  # Prepend https if missing
            logger.debug(
                f"Prepended https:// to LinkedIn URL: {contact_info['linkedin']}"
            )

        contact_info["linkedin_handle"] = _get_social_media_handle(
            contact_info.get("linkedin", "")
        )
        logger.debug(f"Derived LinkedIn handle: {contact_info['linkedin_handle']}")

    prepared_data["contact_info"] = contact_info  # Update contact_info in prepared_data

    return prepared_data


def generate_latex_pdf(template_name: str, data: dict, output_file: Path):
    """
    Generates a PDF resume from structured YAML data using a LaTeX template.

    This function performs the following steps:
    1. Locates the specified LaTeX template directory.
    2. Configures the Jinja2 environment to correctly parse LaTeX templates (changing delimiters).
    3. Prepares the input data by escaping LaTeX special characters and deriving fields.
    4. Renders the LaTeX template with the prepared data.
    5. Writes the rendered LaTeX content to a temporary .tex file.
    6. Compiles the .tex file into a PDF using xelatex (preferred for modern fonts).
       (Runs xelatex twice to ensure all references and layouts are correct).
    7. Moves the final PDF to the specified output path.
    8. Cleans up all temporary LaTeX compilation files.

    Args:
        template_name (str): The name of the LaTeX template directory (e.g., 'classic').
                             This directory is expected to be under 'templates/'.
        data (dict): The resume data loaded from the YAML file.
        output_file (Path): The full path to the desired output PDF file.

    Raises:
        ValueError: If the specified template directory does not exist.
        RuntimeError: If the LaTeX template cannot be loaded, rendering fails,
                      xelatex is not found, or xelatex compilation fails.
    """
    logger.info(
        f"Attempting to generate LaTeX PDF for template '{template_name}' to '{output_file}'"
    )

    project_root = Path(__file__).parent.resolve()
    templates_base_dir = project_root / "templates"

    # Ensure output directory exists before writing any temporary files
    output_dir = output_file.parent
    output_dir.mkdir(parents=True, exist_ok=True)
    logger.debug(f"Ensured output directory exists: {output_dir}")

    template_path = templates_base_dir / template_name
    if not template_path.exists():
        logger.error(
            f"LaTeX template directory '{template_name}' not found at {template_path}"
        )
        raise ValueError(
            f"LaTeX template directory '{template_name}' not found at {template_path}"
        )

    # Configure Jinja2 environment with custom delimiters to avoid LaTeX conflicts
    # This is crucial for seamless integration of Jinja2 and LaTeX syntax
    env = Environment(
        loader=FileSystemLoader(str(template_path)),  # where your .tex template is
        block_start_string="\\BLOCK{",
        block_end_string="}",
        variable_start_string="\\VAR{",
        variable_end_string="}",
        comment_start_string="\\#{",
        comment_end_string="}",
        line_statement_prefix="%%",
        autoescape=False,
    )
    logger.debug("Jinja2 environment configured with LaTeX-compatible delimiters.")

    # Load the main LaTeX template file
    try:
        # Assuming the main LaTeX file is named 'resume.tex' within the template directory
        template = env.get_template("resume.tex")
        logger.info(
            f"Successfully loaded LaTeX template 'resume.tex' from '{template_path}'."
        )
    except Exception as e:
        logger.exception(f"Could not load resume.tex from template '{template_name}'.")
        raise RuntimeError(
            f"Could not load resume.tex from template '{template_name}': {e}"
        )

    # Prepare and escape data for LaTeX
    prepared_data = _prepare_latex_data(data)

    # Render LaTeX template with data
    logger.info("Rendering LaTeX template with processed data...")
    try:
        # Pass the prepared data to the template
        latex_content = template.render(
            contact_info=prepared_data.get("contact_info", {}),
            sections=prepared_data.get("sections", []),
            font=prepared_data.get(
                "font", "Helvetica"
            ),  # Default font if not specified in YAML
        )
        # logger.info(f"LaTeX content rendered successfully: {latex_content}")
    except Exception as e:
        logger.exception("Error rendering LaTeX template.")
        raise RuntimeError(f"Error rendering LaTeX template: {e}")

    # Define temporary .tex file path in the output directory
    # Using the stem of the output_file for the temporary .tex file name
    temp_tex_file_name = f"{output_file.stem}.tex"
    temp_tex_file_path = output_dir / temp_tex_file_name

    # Write LaTeX content to the temporary .tex file
    with open(temp_tex_file_path, "w", encoding="utf-8") as f:
        f.write(latex_content)
    logger.info(f"LaTeX content written to temporary file: {temp_tex_file_path}")

    # Compile LaTeX to PDF using xelatex
    # xelatex is chosen for better support of modern fonts (via fontspec)
    # and direct UTF-8 handling, which aligns with common web fonts like Source Sans Pro.
    logger.info("Compiling LaTeX to PDF using 'xelatex'...")
    try:
        # Run xelatex twice to resolve cross-references, table of contents, etc., if any.
        # -output-directory: Puts all generated auxiliary files (log, aux, pdf) into the specified directory.
        # -interaction=nonstopmode: Prevents xelatex from pausing on errors, making it suitable for automation.

        # First pass of compilation
        result1 = subprocess.run(
            [
                "xelatex",
                "-output-directory",
                str(output_dir),
                "-interaction=nonstopmode",
                str(temp_tex_file_path),
            ],
            capture_output=True,
            check=True,  # Will raise CalledProcessError if xelatex returns a non-zero exit status
            text=True,  # Decode stdout/stderr as text
        )
        logger.debug(f"First xelatex pass STDOUT:\n{result1.stdout}")
        logger.debug(f"First xelatex pass STDERR:\n{result1.stderr}")

        # Second pass of compilation (important for correct layout and references)
        result2 = subprocess.run(
            [
                "xelatex",
                "-output-directory",
                str(output_dir),
                "-interaction=nonstopmode",
                str(temp_tex_file_path),
            ],
            capture_output=True,
            check=True,
            text=True,
        )
        logger.debug(f"Second xelatex pass STDOUT:\n{result2.stdout}")
        logger.debug(f"Second xelatex pass STDERR:\n{result2.stderr}")

        logger.info("PDF generated successfully by xelatex.")

        # The PDF is generated in the output_dir with the same stem as the temp .tex file.
        generated_pdf_path = output_dir / f"{output_file.stem}.pdf"

        # If the target output_file path is different from the generated path (e.g., different name or subfolder)
        if generated_pdf_path != output_file:
            # Rename/move the generated PDF to the final desired output_file path
            generated_pdf_path.rename(output_file)
            logger.info(
                f"Moved generated PDF from '{generated_pdf_path}' to final path: '{output_file}'"
            )

        logger.info(f"Final PDF available at: {output_file}")

    except FileNotFoundError:
        logger.exception("xelatex command not found.")
        raise RuntimeError(
            "xelatex command not found. Please ensure a LaTeX distribution "
            "(e.g., TeX Live, MiKTeX) is installed and 'xelatex' is in your system's PATH."
        )
    except subprocess.CalledProcessError as e:
        logger.error(
            f"xelatex compilation failed with exit code {e.returncode} for file {temp_tex_file_path}."
        )
        logger.error(f"xelatex STDOUT:\n{e.stdout}")
        logger.error(f"xelatex STDERR:\n{e.stderr}")

        # Attempt to read and print the .log file for more detailed errors
        log_file = output_dir / f"{output_file.stem}.log"
        if log_file.exists():
            try:
                with open(log_file, "r", encoding="utf-8", errors="ignore") as f:
                    logger.error(f"\n--- XELATEX LOG FILE ({log_file}) ---\n{f.read()}")
            except Exception as log_e:
                logger.warning(f"Could not read xelatex log file {log_file}: {log_e}")

        raise RuntimeError(
            f"LaTeX compilation failed for {temp_tex_file_path}. See logs for details."
        ) from e
    except Exception as e:
        logger.exception(
            f"An unexpected error occurred during PDF generation for {output_file}."
        )
        raise RuntimeError(f"An unexpected error occurred during PDF generation: {e}")

    finally:
        # Clean up temporary LaTeX files to keep the output directory tidy.
        # These are generated by xelatex during compilation.
        temp_base_name = (
            output_file.stem
        )  # Use the stem of the final output file for temp files
        auxiliary_extensions = [
            ".aux",
            ".log",
            ".out",
            ".toc",
            ".lof",
            ".lot",
            ".fls",
            ".synctex.gz",
            ".gz",
            ".xdv",
        ]

        for ext in auxiliary_extensions:
            temp_file = output_dir / f"{temp_base_name}{ext}"
            if temp_file.exists():
                try:
                    temp_file.unlink()
                    logger.debug(f"Cleaned up temporary file: {temp_file}")
                except OSError as e:
                    logger.warning(f"Could not remove temporary file {temp_file}: {e}")

        # Finally, remove the temporary .tex file itself
        if temp_tex_file_path.exists():
            try:
                temp_tex_file_path.unlink()
                logger.debug(f"Cleaned up temporary .tex file: {temp_tex_file_path}")
            except OSError as e:
                logger.warning(
                    f"Could not remove temporary .tex file {temp_tex_file_path}: {e}"
                )
        logger.info("Temporary LaTeX files cleaned up.")


# Example usage if this script were run standalone (for testing purposes)
if __name__ == "__main__":
    # This block is for direct testing of resume_generator_latex.py
    # In your main scenario, resume_generator.py will import and call generate_latex_pdf

    # Dummy YAML data for testing
    test_data = {
        "font": "Source Sans Pro",
        "contact_info": {
            "name": "Jane Doe",
            "location": "London, UK",
            "email": "jane.doe@example.com",
            "phone": "+44 7123456789",
            "linkedin": "https://linkedin.com/in/janedoe_profile",
        },
        "sections": [
            {
                "name": "Summary",
                "type": "text",
                "content": "A highly motivated and results-driven professional seeking challenging opportunities to apply expertise in software development and project management. Proven ability to lead successful teams and deliver high-quality solutions.",
            },
            {
                "name": "Professional Experience",
                "content": [
                    {
                        "company": "Tech Solutions Ltd",
                        "title": "Senior Software Engineer",
                        "dates": "Jan 2022 – Present",
                        "description": [
                            "Led development of scalable microservices in Python, improving system performance by 25%.",
                            "Implemented CI/CD pipelines using GitLab CI, reducing deployment time by 40%.",
                            "Mentored junior engineers, fostering a collaborative and productive team environment.",
                        ],
                    },
                    {
                        "company": "Innovate Corp",
                        "title": "Software Developer",
                        "dates": "Jun 2018 – Dec 2021",
                        "description": [
                            "Developed user interfaces for web applications using React and JavaScript.",
                            "Collaborated with UX/UI designers to translate wireframes into functional code.",
                            "Contributed to database design and optimization for PostgreSQL.",
                        ],
                    },
                ],
            },
            {
                "name": "Education",
                "content": [
                    {
                        "degree": "MSc in Computer Science",
                        "school": "University of London",
                        "year": "2018",
                        "field_of_study": "Specialization in AI",
                    },
                    {
                        "degree": "BSc in Software Engineering",
                        "school": "University of Manchester",
                        "year": "2015",
                    },
                ],
            },
            {
                "name": "Key Skills",
                "type": "inline-list",
                "content": [
                    "Python",
                    "JavaScript",
                    "React",
                    "SQL",
                    "Docker",
                    "Kubernetes",
                    "AWS",
                    "Agile",
                    "Git",
                ],
            },
            {
                "name": "Certifications",
                "type": "bulleted-list",
                "content": [
                    "AWS Certified Solutions Architect – Associate (2023)",
                    "Certified Kubernetes Application Developer (CKAD) (2022)",
                ],
            },
        ],
    }

    # Example setup for paths
    script_dir = Path(__file__).parent.resolve()
    # Assuming 'templates/classic/' is where 'resume.tex' will be
    latex_template_name = "classic"
    output_pdf_path = script_dir.parent / "output" / "test_resume_latex.pdf"

    try:
        # Create dummy template dir for testing if it doesn't exist
        test_template_dir = script_dir.parent / "templates" / latex_template_name
        test_template_dir.mkdir(parents=True, exist_ok=True)
        # Create a dummy resume.tex for testing if it doesn't exist
        test_resume_tex_path = test_template_dir / "resume.tex"
        if not test_resume_tex_path.exists():
            with open(test_resume_tex_path, "w", encoding="utf-8") as f:
                f.write(
                    r"""% LaTeX Template (Simplified for testing)
\documentclass[10pt, letterpaper]{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\geometry{left=0.75in, right=0.75in, top=0.75in, bottom=0.75in}
\usepackage{fontspec}
\defaultfontfeatures{Ligatures=TeX}
\setmainfont{\VAR{font}}[Extension=.ttf]
\usepackage{titlesec}
\titleformat{\section}{\Large\bfseries\scshape}{}{0em}{}[\rule{\linewidth}{0.8pt}]
\titlespacing*{\section}{0pt}{*1}{*0}
\usepackage{enumitem}
\setlist{nosep}
\usepackage{hyperref}
\hypersetup{colorlinks=true,urlcolor=blue,linkcolor=black}
\usepackage{fontawesome5} % Assuming it's installed or provided

% Custom commands for resume elements
\newcommand{\rsubtitle}[2]{% Title, Date
    \vspace{0.2em}\normalsize{\textbf{#1}} \hfill \normalsize{#2}\vspace{-0.4em}
}
\newcommand{\rcompany}[1]{% Company
    \normalsize{\textit{#1}}\vspace{-0.1em}
}
\newcommand{\rbullet}[1]{% Bullet point item
    \item \small{#1}
}
\newcommand{\rinlineitem}[1]{% Inline list item
    \small{#1}
}
\newcommand{\rinlinelists}[1]{% Creates an inline list
    \begin{itemize}[label={},wide=0pt,leftmargin=\parindent,topsep=0pt,itemsep=0pt,parsep=0pt]
        \item \small{#1}
    \end{itemize}\vspace{-0.8em}
}

\begin{document}
\begin{center}
    \textbf{\Huge{\VAR{contact_info.name}}} \\
    \vspace{0.1em}
    \normalsize{%
        \faMapMarker \hspace{2pt} \VAR{contact_info.location} \textbullet\ 
        \faPhone \hspace{2pt} \VAR{contact_info.phone} \textbullet\ 
        \faEnvelope \hspace{2pt} \href{mailto:\VAR{contact_info.email}}{\VAR{contact_info.email}} \textbullet\ 
        \faLinkedin \hspace{2pt} \href{\VAR{contact_info.linkedin}}{\VAR{contact_info.linkedin_handle}}%
    }
\end{center}
\vspace{0.2em}

\BLOCK{for section in sections}
    \section*{\VAR{section.name}}
    
    \BLOCK{if section.type == "text"}
        \small{\VAR{section.content}}\vspace{0.5em}

    \BLOCK{elif section.type == "bulleted-list"}
        \begin{itemize}[leftmargin=1.5em,label=\textbullet,itemsep=0.1em,parsep=0pt]
            \BLOCK{for item in section.content}
                \rbullet{\VAR{item}}
            \BLOCK{endfor}
        \end{itemize}\vspace{0.5em}

    \BLOCK{elif section.type == "inline-list"}
        \rinlinelists{\VAR{", ".join(section.content)}}

    \BLOCK{elif section.type == "icon-list"}
        \begin{itemize}[leftmargin=1.5em,label=\textbullet,itemsep=0.1em,parsep=0pt]
            \BLOCK{for item in section.content}
                \rbullet{\VAR{item}}
            \BLOCK{endfor}
        \end{itemize}\vspace{0.5em}

    \BLOCK{elif section.type == "dynamic-column-list"}
        \rinlinelists{\VAR{", ".join(section.content)}}

    \BLOCK{elif section.name == "Professional Experience"}
        \BLOCK{for job in section.content}
            \rsubtitle{\VAR{job.title}}{\VAR{job.dates}}
            \rcompany{\VAR{job.company}}
            \begin{itemize}[leftmargin=1.5em,label=\textbullet,itemsep=0.1em,parsep=0pt]
                \BLOCK{for bullet in job.description}
                    \rbullet{\VAR{bullet}}
                \BLOCK{endfor}
            \end{itemize}\vspace{0.4em}
        \BLOCK{endfor}

    \BLOCK{elif section.name == "Education"}
        \BLOCK{for edu in section.content}
            \rsubtitle{\VAR{edu.degree}}{\VAR{edu.year}}
            \rcompany{\VAR{edu.school}}
            \BLOCK{if edu.field_of_study}
                \small{\VAR{edu.field_of_study}}\vspace{0.1em}
            \BLOCK{endif}
            \vspace{0.4em}
        \BLOCK{endfor}

    \BLOCK{elif section.name == "Certifications"}
        \begin{itemize}[leftmargin=1.5em,label=\textbullet,itemsep=0.1em,parsep=0pt]
            \BLOCK{for item in section.content}
                \rbullet{\VAR{item}}
            \BLOCK{endfor}
        \end{itemize}\vspace{0.5em}
    \BLOCK{endif}
\BLOCK{endfor}

\end{document}
"""
                )

        # Also create a dummy font file for testing if it doesn't exist
        # This will allow xelatex to find 'Source Sans Pro' if it's set in YAML
        # For actual use, you'd place your downloaded fonts here or in a system-wide font directory.
        dummy_font_path = test_template_dir / "SourceSansPro-Regular.ttf"
        if not dummy_font_path.exists():
            logging.warning(
                f"Dummy font file '{dummy_font_path}' not found. LaTeX may not use specified font."
            )
            # Create a very small, empty file as a placeholder to avoid FileNotFoundError during xelatex run
            # In a real scenario, you'd download the actual font files.
            try:
                with open(dummy_font_path, "w") as f:
                    f.write("")
                logging.warning(
                    f"Created empty placeholder for '{dummy_font_path}'. Real font needed for proper rendering."
                )
            except Exception as e:
                logging.error(f"Failed to create dummy font file: {e}")

        generate_latex_pdf(latex_template_name, test_data, output_pdf_path)
        print(f"Test LaTeX PDF generated successfully at: {output_pdf_path}")
    except Exception as e:
        print(f"Error during standalone LaTeX PDF generation test: {e}")
