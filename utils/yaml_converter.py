"""
YAML Converter Utility

Converts resume JSON (from database JSONB) to YAML string format.
Used for PDF generation where the template engine expects YAML input.

This allows us to store data as JSONB in the database (queryable, type-safe)
while still supporting YAML for the PDF generation pipeline.
"""

from typing import Any, Dict

import yaml

try:
    from yaml import CSafeDumper as SafeDumper
    from yaml import CSafeLoader as SafeLoader
except ImportError:
    from yaml import SafeDumper, SafeLoader


def fast_yaml_load(stream):
    """
    A significantly faster alternative to yaml.safe_load.
    Uses C-based CSafeLoader if available (~10x speedup).
    """
    return yaml.load(stream, Loader=SafeLoader)


def fast_yaml_dump(data, stream=None, **kwargs):
    """
    A significantly faster alternative to yaml.dump.
    Uses C-based CSafeDumper if available (~5x speedup).
    """
    if "Dumper" not in kwargs:
        kwargs["Dumper"] = SafeDumper
    return yaml.dump(data, stream, **kwargs)


def json_to_yaml_structure(resume_data: Dict[str, Any]) -> str:
    """
    Convert resume JSON (from database JSONB) to YAML string.
    Used only for PDF generation (template engine expects YAML).

    Args:
        resume_data: Dictionary with keys:
            - template_id (str): Template identifier
            - contact_info (dict): Contact information
            - sections (list): Resume sections array

    Returns:
        str: YAML string compatible with existing resume templates

    Example:
        >>> resume = {
        ...     'template_id': 'modern-with-icons',
        ...     'contact_info': {'name': 'John Doe', 'email': 'john@example.com'},
        ...     'sections': [{'name': 'Experience', 'type': 'experience', 'content': []}]
        ... }
        >>> yaml_str = json_to_yaml_structure(resume)
        >>> print(yaml_str)
        template: modern-with-icons
        contact_info:
          name: John Doe
          email: john@example.com
        sections:
          - name: Experience
            type: experience
            content: []
    """

    # Build YAML structure matching template expectations
    yaml_structure = {
        "template": resume_data.get("template_id", "modern-with-icons"),
        "contact_info": resume_data.get("contact_info", {}),
        "sections": resume_data.get("sections", []),
    }

    # Convert to YAML string
    yaml_string = fast_yaml_dump(
        yaml_structure,
        default_flow_style=False,
        allow_unicode=True,
        sort_keys=False,
        width=int(
            1e9
        ),  # Prevent line wrapping, CSafeDumper doesn't support float('inf')
    )

    return yaml_string


def yaml_to_json_structure(yaml_string: str) -> Dict[str, Any]:
    """
    Convert YAML string back to JSON structure.
    Useful for importing YAML files into the database.

    Args:
        yaml_string: YAML resume data

    Returns:
        dict: JSON structure with template_id, contact_info, sections

    Example:
        >>> yaml_str = '''
        ... template: modern-with-icons
        ... contact_info:
        ...   name: John Doe
        ... sections: []
        ... '''
        >>> data = yaml_to_json_structure(yaml_str)
        >>> data['template_id']
        'modern-with-icons'
    """

    # Parse YAML
    parsed = fast_yaml_load(yaml_string)

    if not parsed:
        raise ValueError("Empty or invalid YAML")

    # Convert to JSON structure
    json_structure = {
        "template_id": parsed.get("template", "modern-with-icons"),
        "contact_info": parsed.get("contact_info", {}),
        "sections": parsed.get("sections", []),
    }

    return json_structure
