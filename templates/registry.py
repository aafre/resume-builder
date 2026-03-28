"""Template registry — single source of truth for all template configuration.

Every template available in the application must be registered here.  The
registry is populated at import time via ``_register()`` calls at module level,
so by the time any other module does ``from templates.registry import get`` the
full catalogue is ready.

Public helpers (``get``, ``get_dir``, ``get_engine``, …) provide typed,
validated access.  ``validate_all()`` can be called at startup or in tests to
confirm that every registered template's on-disk assets actually exist.
"""

from __future__ import annotations

from pathlib import Path

from templates.models import PDFOptions, TemplateConfig, TemplateEngine

# ---------------------------------------------------------------------------
# Project root (one level above this file's parent ``templates/`` package)
# ---------------------------------------------------------------------------

PROJECT_ROOT: Path = Path(__file__).parent.parent.resolve()

# ---------------------------------------------------------------------------
# Registry dict — keyed by template id
# ---------------------------------------------------------------------------

TEMPLATES: dict[str, TemplateConfig] = {}

# IDs that are convenience aliases (not shown in the UI template picker)
_ALIAS_IDS: set[str] = {"modern", "classic"}


def _register(config: TemplateConfig) -> None:
    """Register a template configuration.

    Raises ``ValueError`` if a template with the same ``id`` is already
    registered.
    """
    if config.id in TEMPLATES:
        raise ValueError(
            f"Duplicate template id {config.id!r} — "
            f"each template must have a unique id."
        )
    TEMPLATES[config.id] = config


# ---------------------------------------------------------------------------
# User-facing templates
# ---------------------------------------------------------------------------

_register(
    TemplateConfig(
        id="modern-with-icons",
        dir="modern",
        engine=TemplateEngine.html,
        sample="samples/modern/john_doe.yml",
        name="Modern",
        description="Contemporary design enhanced with visual icons and dynamic styling elements.",
        preview="modern-with-icons.png",
        supports_icons=True,
    )
)

_register(
    TemplateConfig(
        id="modern-no-icons",
        dir="modern",
        engine=TemplateEngine.html,
        sample="samples/modern/john_doe_no_icon.yml",
        name="Minimalist",
        description="Clean and simple design focused on content clarity and easy readability.",
        preview="modern-no-icons.png",
    )
)

_register(
    TemplateConfig(
        id="ats-optimized",
        dir="ats-optimized",
        engine=TemplateEngine.html,
        sample="samples/ats-optimized/sample_data.yml",
        name="ATS-Optimized",
        description="Ultra-plain, zero-decoration layout designed for maximum ATS parsability.",
        preview="ats-optimized.png",
    )
)

_register(
    TemplateConfig(
        id="two-column",
        dir="two-column",
        engine=TemplateEngine.html,
        sample="samples/two-column/sample_data.yml",
        name="Two-Column",
        description="Sidebar layout with skills and contact info on the left, experience on the right.",
        preview="two-column.png",
    )
)

_register(
    TemplateConfig(
        id="student",
        dir="student",
        engine=TemplateEngine.html,
        sample="samples/student/sample_data.yml",
        name="Student",
        description="Education-first layout designed for students and first-time job seekers.",
        preview="student.png",
    )
)

_register(
    TemplateConfig(
        id="executive",
        dir="executive",
        engine=TemplateEngine.latex,
        sample="samples/executive/sample_data.yml",
        name="Executive",
        description="Premium typography for senior professionals. Handles multi-page resumes elegantly.",
        preview="executive.png",
    )
)

_register(
    TemplateConfig(
        id="classic-alex-rivera",
        dir="classic",
        engine=TemplateEngine.latex,
        sample="samples/classic/alex_rivera_data.yml",
        name="Professional",
        description="Clean, structured layout with traditional formatting and excellent space utilization.",
        preview="alex_rivera.png",
    )
)

_register(
    TemplateConfig(
        id="classic-jane-doe",
        dir="classic",
        engine=TemplateEngine.latex,
        sample="samples/classic/jane_doe.yml",
        name="Elegant",
        description="Refined design with sophisticated typography and organized section layout.",
        preview="jane_doe.png",
    )
)

_register(
    TemplateConfig(
        id="uk-cv",
        dir="uk-cv",
        engine=TemplateEngine.html,
        sample="samples/uk-cv/sample_data.yml",
        name="UK CV",
        description="British CV format with Personal Profile. A4 paper, two-page layout, optional references.",
        preview="uk-cv.png",
        pdf_options=PDFOptions(page_size="A4"),
    )
)

# ---------------------------------------------------------------------------
# Convenience aliases (used by job example pages and internal code)
# ---------------------------------------------------------------------------

_register(
    TemplateConfig(
        id="modern",
        dir="modern",
        engine=TemplateEngine.html,
        sample="samples/modern/john_doe.yml",
        name="Modern",
        description="Default modern template.",
        preview="modern-with-icons.png",
    )
)

_register(
    TemplateConfig(
        id="classic",
        dir="classic",
        engine=TemplateEngine.latex,
        sample="samples/classic/alex_rivera_data.yml",
        name="Classic",
        description="Default classic template.",
        preview="alex_rivera.png",
    )
)

# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def get(template_id: str) -> TemplateConfig:
    """Return the ``TemplateConfig`` for *template_id*.

    Raises ``KeyError`` with a helpful message listing available IDs if the
    requested template is not found.
    """
    try:
        return TEMPLATES[template_id]
    except KeyError:
        available = ", ".join(sorted(TEMPLATES))
        raise KeyError(
            f"Unknown template {template_id!r}. "
            f"Available templates: {available}"
        ) from None


def get_dir(template_id: str) -> str:
    """Return the template directory name (relative to ``templates/``)."""
    return get(template_id).dir


def get_engine(template_id: str) -> TemplateEngine:
    """Return the rendering engine for the given template."""
    return get(template_id).engine


def get_sample_path(template_id: str) -> Path:
    """Return the absolute path to the sample YAML file."""
    return PROJECT_ROOT / get(template_id).sample


def get_pdf_options(template_id: str) -> PDFOptions:
    """Return the ``PDFOptions`` for the given template."""
    return get(template_id).pdf_options


def is_valid(template_id: str) -> bool:
    """Return ``True`` if *template_id* is registered."""
    return template_id in TEMPLATES


def all_ids() -> list[str]:
    """Return a sorted list of all registered template IDs."""
    return sorted(TEMPLATES)


def get_display_templates() -> list[TemplateConfig]:
    """Return templates suitable for the UI template picker.

    Excludes internal convenience aliases (``modern``, ``classic``) that are
    not meant to be shown to end users.
    """
    return [t for t in TEMPLATES.values() if t.id not in _ALIAS_IDS]


def validate_all() -> list[str]:
    """Validate that all registered templates have the expected on-disk assets.

    Checks performed per template:
    * The template directory exists under ``templates/``.
    * HTML templates contain ``base.html`` and ``styles.css``.
    * LaTeX templates contain ``resume.tex``.
    * The sample YAML file exists.

    Returns a list of human-readable error strings.  An empty list means
    every template passed validation.
    """
    errors: list[str] = []
    templates_dir = PROJECT_ROOT / "templates"

    for tid, cfg in TEMPLATES.items():
        tpl_dir = templates_dir / cfg.dir
        if not tpl_dir.is_dir():
            errors.append(f"[{tid}] template dir missing: {tpl_dir}")
            continue

        if cfg.engine == TemplateEngine.html:
            for required in ("base.html", "styles.css"):
                if not (tpl_dir / required).is_file():
                    errors.append(
                        f"[{tid}] required HTML asset missing: "
                        f"{tpl_dir / required}"
                    )
        elif cfg.engine == TemplateEngine.latex:
            if not (tpl_dir / "resume.tex").is_file():
                errors.append(
                    f"[{tid}] required LaTeX asset missing: "
                    f"{tpl_dir / 'resume.tex'}"
                )

        sample_path = PROJECT_ROOT / cfg.sample
        if not sample_path.is_file():
            errors.append(f"[{tid}] sample file missing: {sample_path}")

    return errors
