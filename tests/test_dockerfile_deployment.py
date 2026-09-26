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


def test_runtime_image_copies_every_local_module_app_imports():
    import ast
    import fnmatch

    dockerfile = (ROOT / "Dockerfile").read_text(encoding="utf-8")
    sources = _dockerfile_copy_sources(dockerfile)
    local = {p.stem for p in ROOT.glob("*.py")}
    tree = ast.parse((ROOT / "app.py").read_text(encoding="utf-8"))
    imported = {
        (n.module if isinstance(n, ast.ImportFrom) else a.name).split(".")[0]
        for n in ast.walk(tree)
        if isinstance(n, (ast.Import, ast.ImportFrom)) and (not isinstance(n, ast.ImportFrom) or n.module)
        for a in (n.names if isinstance(n, ast.Import) else [n])
    }
    for module in sorted(imported & local):
        assert any(fnmatch.fnmatch(f"{module}.py", s) for s in sources), f"{module}.py not copied into the image"
