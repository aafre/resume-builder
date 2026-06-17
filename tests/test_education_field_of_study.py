"""
Regression tests for Education field_of_study rendering in production templates.
"""

import os
import sys
from pathlib import Path

from jinja2 import Environment, FileSystemLoader

# Add parent directory to path, matching existing pytest module conventions.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import app
import resume_generator

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def render_modern_education(section):
    env = Environment(loader=FileSystemLoader(PROJECT_ROOT / "templates" / "modern"))
    env.filters["markdown_links"] = resume_generator.convert_markdown_links_to_html
    env.filters["markdown_formatting"] = (
        resume_generator.convert_markdown_formatting_to_html
    )

    template = env.get_template("education.html")
    return template.render(section=section, icon_path="/icons")


def render_classic_resume(section):
    env = Environment(
        loader=FileSystemLoader(PROJECT_ROOT / "templates" / "classic"),
        block_start_string="\\BLOCK{",
        block_end_string="}",
        variable_start_string="\\VAR{",
        variable_end_string="}",
        comment_start_string="\\#{",
        comment_end_string="}",
        line_statement_prefix="%%",
        line_comment_prefix="%#",
        trim_blocks=True,
        autoescape=False,
    )
    env.filters["markdown_links"] = app.convert_markdown_links_to_latex
    env.filters["markdown_formatting"] = app.convert_markdown_formatting_to_latex

    template = env.get_template("resume.tex")
    return template.render(
        contact_info={
            "name": "Test User",
            "location": "London, UK",
            "phone": "555-0100",
            "email": "test@example.com",
            "social_links": [],
        },
        sections=[section],
    )


def education_section(content):
    return {
        "name": "Education",
        "type": "education",
        "content": content,
    }


def test_modern_template_renders_field_of_study():
    html = render_modern_education(
        education_section(
            [
                {
                    "degree": "MSc in Computer Science",
                    "school": "Example University",
                    "year": "2024",
                    "field_of_study": "Artificial Intelligence",
                }
            ]
        )
    )

    assert "Artificial Intelligence" in html
    assert "font-style: italic" in html


def test_modern_template_omits_field_of_study_when_empty():
    html = render_modern_education(
        education_section(
            [
                {
                    "degree": "BSc in Computer Science",
                    "school": "Example University",
                    "year": "2022",
                }
            ]
        )
    )

    assert "font-style: italic" not in html


def test_classic_latex_renders_field_of_study():
    latex = render_classic_resume(
        education_section(
            [
                {
                    "degree": "MSc in Computer Science",
                    "school": "Example University",
                    "year": "2024",
                    "field_of_study": "Artificial Intelligence",
                }
            ]
        )
    )

    assert "Artificial Intelligence" in latex
    assert "\\textit{Artificial Intelligence}" in latex


def test_classic_latex_omits_field_of_study_when_empty():
    latex = render_classic_resume(
        education_section(
            [
                {
                    "degree": "BSc in Computer Science",
                    "school": "Example University",
                    "year": "2022",
                }
            ]
        )
    )

    assert "{\\small \\noindent\\textit{" not in latex
