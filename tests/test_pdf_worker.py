import sys
import os
from unittest.mock import MagicMock, patch
import pytest
from pathlib import Path

# Add root directory to sys.path
sys.path.append(os.getcwd())

def test_pdf_generation_worker_success():
    # Setup mocks
    mock_rg = MagicMock()

    # We need to patch sys.modules so when the function imports resume_generator, it gets our mock
    with patch.dict(sys.modules, {'resume_generator': mock_rg}):
        import app

        # Test data
        template_name = "modern"
        yaml_path = Path("dummy/path.yml")
        output_path = Path("dummy/output.pdf")
        session_icons_dir = Path("dummy/icons")
        session_id = "test_session"

        # Mock file existence checks
        with patch("pathlib.Path") as MockPath:
            mock_path_instance = MockPath.return_value
            mock_path_instance.exists.return_value = True
            mock_path_instance.stat.return_value.st_size = 100

            # Run worker
            result = app.pdf_generation_worker(
                template_name,
                yaml_path,
                output_path,
                session_icons_dir,
                session_id
            )

            # Assertions
            assert result["success"] is True
            assert result["output"] == str(output_path)

            mock_rg.load_resume_data.assert_called_with(str(yaml_path))
            mock_rg.normalize_sections.assert_called()
            mock_rg.generate_pdf.assert_called_with(
                template_name,
                mock_rg.normalize_sections.return_value,
                str(output_path),
                session_icons_dir=str(session_icons_dir),
                session_id=session_id
            )

def test_pdf_generation_worker_failure():
    # Setup mocks
    mock_rg = MagicMock()
    mock_rg.generate_pdf.side_effect = Exception("Generation failed")

    with patch.dict(sys.modules, {'resume_generator': mock_rg}):
        import app

        # Test data
        template_name = "modern"
        yaml_path = Path("dummy/path.yml")
        output_path = Path("dummy/output.pdf")
        session_icons_dir = Path("dummy/icons")
        session_id = "test_session"

        # Run worker
        result = app.pdf_generation_worker(
            template_name,
            yaml_path,
            output_path,
            session_icons_dir,
            session_id
        )

        # Assertions
        assert result["success"] is False
        assert "Generation failed" in result["error"]
