import pytest
from unittest.mock import MagicMock, patch
import io
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from conftest import TEST_USER_ID, TEST_RESUME_ID

class TestThumbnailMemoryOptimization:
    """Tests for in-memory thumbnail generation."""

    def test_generate_thumbnail_uses_bytesio(self, flask_test_client):
        """Verify that thumbnail generation uses BytesIO instead of temp file."""
        client, mock_sb, flask_app = flask_test_client

        # Mock module structure
        mock_pdf2image = MagicMock()
        mock_pil = MagicMock()
        mock_tempfile = MagicMock()

        # Setup mock behavior
        mock_image_instance = MagicMock()
        # Ensure image has dimensions
        mock_image_instance.height = 1000
        mock_image_instance.width = 800

        # Setup convert_from_path return value
        mock_pdf2image.convert_from_path.return_value = [mock_image_instance]

        # Setup resize return value
        mock_resized_image = MagicMock()
        mock_image_instance.resize.return_value = mock_resized_image

        # Make sure PIL.Image is mocked correctly
        mock_pil.Image = MagicMock()
        # Also need Resampling enum
        mock_pil.Image.Resampling = MagicMock()
        mock_pil.Image.Resampling.LANCZOS = 1

        # Patch sys.modules to mock imports inside the function
        with patch.dict('sys.modules', {
            'pdf2image': mock_pdf2image,
            'PIL': mock_pil,
            'tempfile': mock_tempfile
        }):
            # Call the function
            flask_app.generate_thumbnail_from_pdf('dummy.pdf', TEST_USER_ID, TEST_RESUME_ID)

            # 1. Verify resize was called
            mock_image_instance.resize.assert_called_once()

            # 2. Verify save was called on the resized image
            if not mock_resized_image.save.called:
                pytest.fail("Image.save() was not called")

            mock_resized_image.save.assert_called_once()

            # 3. Check what save was called with
            args, kwargs = mock_resized_image.save.call_args
            save_target = args[0]

            # Check for BytesIO
            is_bytesio = isinstance(save_target, io.BytesIO)

            if not is_bytesio:
                # If it's not BytesIO, it's likely a file path (string) or file handle from tempfile
                pytest.fail(f"Expected save target to be BytesIO, got {type(save_target)}. Current implementation uses disk I/O.")
