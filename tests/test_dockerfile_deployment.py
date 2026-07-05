from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def _dockerfile_copy_sources(dockerfile: str) -> set[str]:
    sources: set[str] = set()

    for line in dockerfile.splitlines():
        parts = line.strip().split()
        if not parts or parts[0] != "COPY":
            continue

        copy_args = [part for part in parts[1:] if not part.startswith("--")]
        if len(copy_args) < 2:
            continue

        sources.update(source.rstrip("/") for source in copy_args[:-1])

    return sources


def test_runtime_image_copies_utils_package_imported_by_app():
    dockerfile = (ROOT / "Dockerfile").read_text(encoding="utf-8")

    assert "utils" in _dockerfile_copy_sources(dockerfile)
