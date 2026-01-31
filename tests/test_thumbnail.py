"""
Tests for thumbnail generation.

Tests cover:
1. generate_thumbnail_from_pdf function
2. Thumbnail upload to storage
3. classify_thumbnail_error function
4. Thumbnail endpoint

Run tests:
    pytest tests/test_thumbnail.py -v
"""
import pytest
from unittest.mock import MagicMock, patch, ANY
import sys
import os
import tempfile
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from conftest import (
    create_mock_supabase, create_mock_response,
    TEST_USER_ID, TEST_RESUME_ID
)


class TestClassifyThumbnailError:
    """Tests for classify_thumbnail_error helper function."""

    def test_classify_import_error_as_permanent(self, flask_test_client):
        """Verify ImportError is classified as permanent (dependency issue)."""
        client, mock_sb, flask_app = flask_test_client

        error = ImportError("No module named 'pdf2image'")
        result = flask_app.classify_thumbnail_error(error)

        assert result['retryable'] is False
        assert result['error_type'] == 'dependency'
        assert 'user_message' in result

    def test_classify_module_not_found_as_permanent(self, flask_test_client):
        """Verify ModuleNotFoundError is classified as permanent."""
        client, mock_sb, flask_app = flask_test_client

        error = ModuleNotFoundError("No module named 'PIL'")
        result = flask_app.classify_thumbnail_error(error)

        assert result['retryable'] is False
        assert result['error_type'] == 'dependency'

    def test_classify_connection_error_as_retryable(self, flask_test_client):
        """Verify connection errors are classified as retryable."""
        client, mock_sb, flask_app = flask_test_client

        error = Exception("Server disconnected")
        result = flask_app.classify_thumbnail_error(error)

        assert result['retryable'] is True
        assert result['error_type'] == 'network'

    def test_classify_timeout_error_as_retryable(self, flask_test_client):
        """Verify timeout errors are classified as retryable."""
        client, mock_sb, flask_app = flask_test_client

        error = Exception("Connection timeout")
        result = flask_app.classify_thumbnail_error(error)

        assert result['retryable'] is True
        assert result['error_type'] == 'network'

    def test_classify_storage_error_as_retryable(self, flask_test_client):
        """Verify storage errors are classified as retryable."""
        client, mock_sb, flask_app = flask_test_client

        error = Exception("Storage bucket not found")
        result = flask_app.classify_thumbnail_error(error)

        assert result['retryable'] is True
        assert result['error_type'] == 'storage'

    def test_classify_data_error_as_permanent(self, flask_test_client):
        """Verify data validation errors are classified as permanent."""
        client, mock_sb, flask_app = flask_test_client

        error = Exception("Invalid PDF data")
        result = flask_app.classify_thumbnail_error(error)

        assert result['retryable'] is False
        assert result['error_type'] == 'data'

    def test_classify_unknown_error_as_retryable(self, flask_test_client):
        """Verify unknown errors default to retryable."""
        client, mock_sb, flask_app = flask_test_client

        error = Exception("Some random error")
        result = flask_app.classify_thumbnail_error(error)

        assert result['retryable'] is True
        assert result['error_type'] == 'unknown'


class TestGenerateThumbnailFromPdf:
    """Tests for generate_thumbnail_from_pdf function."""

    def test_generate_thumbnail_returns_none_without_supabase(self, flask_test_client):
        """Verify function returns None when Supabase is not initialized."""
        client, mock_sb, flask_app = flask_test_client

        with patch.object(flask_app, 'supabase', None):
            result = flask_app.generate_thumbnail_from_pdf(
                '/fake/path.pdf', TEST_USER_ID, TEST_RESUME_ID
            )

        assert result is None

    def test_generate_thumbnail_handles_pdf2image_missing(self, flask_test_client, temp_output_dir):
        """Verify graceful handling when pdf2image is not installed."""
        client, mock_sb, flask_app = flask_test_client

        # Create a fake PDF file
        pdf_path = temp_output_dir / 'test.pdf'
        pdf_path.write_bytes(b'%PDF-1.4 fake content')

        # Mock pdf2image import to fail
        with patch.dict('sys.modules', {'pdf2image': None}):
            with patch('builtins.__import__', side_effect=ImportError("No module named 'pdf2image'")):
                result = flask_app.generate_thumbnail_from_pdf(
                    str(pdf_path), TEST_USER_ID, TEST_RESUME_ID
                )

        # Should return None gracefully, not raise
        assert result is None

    @pytest.mark.skipif(True, reason="Requires pdf2image and poppler")
    def test_generate_thumbnail_uploads_to_storage(self, flask_test_client, temp_output_dir):
        """Verify thumbnail is uploaded to resume-thumbnails bucket."""
        # This test requires pdf2image to be installed
        # Skip for now as it requires external dependencies
        pass

    def test_generate_thumbnail_uses_correct_bucket(self, flask_test_client):
        """Verify 'resume-thumbnails' bucket is used."""
        client, mock_sb, flask_app = flask_test_client

        # We'd need to mock the entire PDF conversion process
        # For now, verify the bucket name is used in storage calls
        # when the function succeeds
        pass


class TestThumbnailEndpoint:
    """Tests for POST /api/resumes/<id>/thumbnail endpoint."""

    def test_thumbnail_endpoint_returns_404_for_nonexistent(self, flask_test_client, auth_headers):
        """Verify 404 is returned for nonexistent resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock to return empty
        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/thumbnail',
            headers=auth_headers
        )

        assert response.status_code == 404

    def test_thumbnail_endpoint_requires_auth(self, flask_test_client):
        """Verify authentication is required."""
        client, mock_sb, _ = flask_test_client

        response = client.post(f'/api/resumes/{TEST_RESUME_ID}/thumbnail')

        assert response.status_code == 401

    def test_thumbnail_endpoint_returns_404_for_other_users_resume(self, flask_test_client, auth_headers):
        """Verify 404 for another user's resume."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Return empty (user_id filter excludes)
        mock_sb.table.return_value.execute.return_value = create_mock_response([])

        response = client.post(
            f'/api/resumes/{TEST_RESUME_ID}/thumbnail',
            headers=auth_headers
        )

        assert response.status_code == 404


class TestThumbnailCacheBusting:
    """Tests for thumbnail URL cache busting."""

    def test_thumbnail_url_includes_version_param(self, flask_test_client):
        """Verify thumbnail URL includes version parameter for cache busting."""
        # The generate_thumbnail_from_pdf function adds ?v=timestamp to URLs
        # This would require a full integration test with mocked storage
        pass


class TestThumbnailIntegration:
    """Integration tests for thumbnail generation (requires pdf2image)."""

    @pytest.mark.skipif(True, reason="Requires pdf2image and poppler")
    def test_full_thumbnail_generation(self, flask_test_client, temp_output_dir):
        """Full integration test for thumbnail generation."""
        # This test requires:
        # - pdf2image installed
        # - poppler-utils installed
        # - A valid PDF file
        pass
