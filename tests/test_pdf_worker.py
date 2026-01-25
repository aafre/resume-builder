"""
Tests for pdf_generation_worker function.

Unit tests verify the worker function behavior with mocks.
Integration tests generate actual PDFs from sample YAML files.
"""
import sys
import os
import shutil
from unittest.mock import MagicMock, patch
from pathlib import Path

import pytest

# Add root directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Check if wkhtmltopdf is available for integration tests
WKHTMLTOPDF_AVAILABLE = shutil.which("wkhtmltopdf") is not None


# =============================================================================
# Unit Tests (mocked - no wkhtmltopdf required)
# =============================================================================

class TestPdfGenerationWorkerUnit:
    """Unit tests for pdf_generation_worker with mocked dependencies."""

    def test_worker_success(self, tmp_path):
        """Test successful PDF generation returns success result."""
        fake_pdf = tmp_path / "output.pdf"
        fake_pdf.write_bytes(b"%PDF-1.4 fake pdf content")

        mock_rg = MagicMock()
        mock_rg.load_resume_data.return_value = {"contact_info": {"name": "Test"}}
        mock_rg.normalize_sections.return_value = {"contact_info": {"name": "Test"}}

        with patch.dict(sys.modules, {'resume_generator': mock_rg}):
            if 'app' in sys.modules:
                del sys.modules['app']
            import app

            result = app.pdf_generation_worker(
                template_name="modern",
                yaml_path=str(tmp_path / "input.yml"),
                output_path=str(fake_pdf),
                session_icons_dir=str(tmp_path / "icons"),
                session_id="test_session"
            )

            assert result["success"] is True
            assert result["output"] == str(fake_pdf)
            mock_rg.load_resume_data.assert_called_once()
            mock_rg.normalize_sections.assert_called_once()
            mock_rg.generate_pdf.assert_called_once()

    def test_worker_generation_failure(self, tmp_path):
        """Test that generation errors are caught and returned."""
        mock_rg = MagicMock()
        mock_rg.load_resume_data.return_value = {"contact_info": {"name": "Test"}}
        mock_rg.normalize_sections.return_value = {"contact_info": {"name": "Test"}}
        mock_rg.generate_pdf.side_effect = Exception("Template not found")

        with patch.dict(sys.modules, {'resume_generator': mock_rg}):
            if 'app' in sys.modules:
                del sys.modules['app']
            import app

            result = app.pdf_generation_worker(
                template_name="nonexistent",
                yaml_path=str(tmp_path / "input.yml"),
                output_path=str(tmp_path / "output.pdf"),
                session_icons_dir=str(tmp_path / "icons"),
                session_id="test_session"
            )

            assert result["success"] is False
            assert "Template not found" in result["error"]

    def test_worker_yaml_load_failure(self, tmp_path):
        """Test that YAML loading errors are caught and returned."""
        mock_rg = MagicMock()
        mock_rg.load_resume_data.side_effect = FileNotFoundError("YAML file not found")

        with patch.dict(sys.modules, {'resume_generator': mock_rg}):
            if 'app' in sys.modules:
                del sys.modules['app']
            import app

            result = app.pdf_generation_worker(
                template_name="modern",
                yaml_path="/nonexistent/path.yml",
                output_path=str(tmp_path / "output.pdf"),
                session_icons_dir=str(tmp_path / "icons"),
                session_id="test_session"
            )

            assert result["success"] is False
            assert "YAML file not found" in result["error"]

    def test_worker_empty_pdf_failure(self, tmp_path):
        """Test that empty PDF file is detected as failure."""
        empty_pdf = tmp_path / "output.pdf"
        empty_pdf.write_bytes(b"")

        mock_rg = MagicMock()
        mock_rg.load_resume_data.return_value = {"contact_info": {"name": "Test"}}
        mock_rg.normalize_sections.return_value = {"contact_info": {"name": "Test"}}

        with patch.dict(sys.modules, {'resume_generator': mock_rg}):
            if 'app' in sys.modules:
                del sys.modules['app']
            import app

            result = app.pdf_generation_worker(
                template_name="modern",
                yaml_path=str(tmp_path / "input.yml"),
                output_path=str(empty_pdf),
                session_icons_dir=str(tmp_path / "icons"),
                session_id="test_session"
            )

            assert result["success"] is False
            assert "not created" in result["error"]


# =============================================================================
# Integration Tests (require wkhtmltopdf)
# =============================================================================

def get_sample_yaml_files():
    """Collect sample YAML files for integration testing.

    Only includes complete resume files with proper contact_info structure.
    Excludes:
    - meta.yml files
    - test_* files (may have incomplete data)
    - public/examples/* (different nested structure for blog)
    """
    project_root = Path(__file__).parent.parent
    yaml_files = []

    # Sample resume files from samples/modern and samples/classic
    samples_dir = project_root / "samples"
    if samples_dir.exists():
        for yml_file in samples_dir.rglob("*.yml"):
            # Skip meta files
            if yml_file.name == "meta.yml":
                continue
            # Skip test files (may have incomplete/test data)
            if yml_file.name.startswith("test_"):
                continue
            yaml_files.append(yml_file)

    return yaml_files


SAMPLE_YAML_FILES = get_sample_yaml_files()


@pytest.mark.skipif(
    not WKHTMLTOPDF_AVAILABLE,
    reason="wkhtmltopdf not installed - skipping integration tests"
)
class TestPdfGenerationIntegration:
    """Integration tests that generate actual PDFs."""

    @pytest.fixture
    def output_dir(self, tmp_path):
        """Create a temporary output directory for PDFs."""
        output = tmp_path / "pdf_output"
        output.mkdir()
        return output

    @pytest.mark.parametrize("yaml_file", SAMPLE_YAML_FILES, ids=lambda f: f.name)
    def test_generate_pdf_from_sample(self, yaml_file, output_dir):
        """
        Integration test: Generate PDF from each sample YAML file.
        """
        import resume_generator

        data = resume_generator.load_resume_data(str(yaml_file))
        data = resume_generator.normalize_sections(data)

        output_pdf = output_dir / f"{yaml_file.stem}.pdf"
        resume_generator.generate_pdf(
            template_name="modern",
            data=data,
            output_file=str(output_pdf),
            session_icons_dir=None,
            session_id=None
        )

        assert output_pdf.exists(), f"PDF not created for {yaml_file.name}"
        assert output_pdf.stat().st_size > 0, f"PDF is empty for {yaml_file.name}"

        with open(output_pdf, "rb") as f:
            header = f.read(5)
            assert header == b"%PDF-", f"Invalid PDF header for {yaml_file.name}"

    def test_worker_integration_with_real_yaml(self, output_dir):
        """
        Integration test: Test pdf_generation_worker with a real YAML file.
        """
        if not SAMPLE_YAML_FILES:
            pytest.skip("No sample YAML files found")

        yaml_file = SAMPLE_YAML_FILES[0]
        output_pdf = output_dir / "worker_test.pdf"

        from app import pdf_generation_worker

        result = pdf_generation_worker(
            template_name="modern",
            yaml_path=str(yaml_file),
            output_path=str(output_pdf),
            session_icons_dir=str(Path(__file__).parent.parent / "icons"),
            session_id="integration_test"
        )

        assert result["success"] is True, f"Worker failed: {result.get('error')}"
        assert output_pdf.exists()
        assert output_pdf.stat().st_size > 0
