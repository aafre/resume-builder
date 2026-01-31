"""
Tests for icon storage operations.

Tests cover:
1. upload_icon_to_storage function
2. download_icon_from_storage function
3. Icon handling during resume save

Run tests:
    pytest tests/test_icon_storage.py -v
"""
import pytest
from unittest.mock import MagicMock, patch, call
import sys
import os
import base64
import tempfile
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from conftest import (
    create_mock_supabase, create_mock_response,
    TEST_USER_ID, TEST_RESUME_ID
)


class TestUploadIconToStorage:
    """Tests for upload_icon_to_storage function."""

    def test_upload_icon_generates_correct_path(self, flask_test_client):
        """Verify upload generates path in format {user_id}/{resume_id}/{filename}."""
        client, mock_sb, flask_app = flask_test_client

        filename = 'company_google.png'
        file_data = b'fake-png-data'

        storage_path, storage_url = flask_app.upload_icon_to_storage(
            TEST_USER_ID, TEST_RESUME_ID, filename, file_data
        )

        expected_path = f'{TEST_USER_ID}/{TEST_RESUME_ID}/{filename}'
        assert storage_path == expected_path

        # Verify upload was called with correct path
        mock_sb.storage.from_.return_value.upload.assert_called_once()
        call_args = mock_sb.storage.from_.return_value.upload.call_args
        assert call_args[0][0] == expected_path

    def test_upload_icon_sets_mime_type(self, flask_test_client):
        """Verify upload sets correct MIME type."""
        client, mock_sb, flask_app = flask_test_client

        flask_app.upload_icon_to_storage(
            TEST_USER_ID, TEST_RESUME_ID, 'icon.png', b'data', 'image/png'
        )

        call_args = mock_sb.storage.from_.return_value.upload.call_args
        assert call_args[1]['file_options']['content-type'] == 'image/png'

    def test_upload_icon_upserts_existing(self, flask_test_client):
        """Verify upload uses upsert to replace existing icons."""
        client, mock_sb, flask_app = flask_test_client

        flask_app.upload_icon_to_storage(
            TEST_USER_ID, TEST_RESUME_ID, 'icon.png', b'data'
        )

        call_args = mock_sb.storage.from_.return_value.upload.call_args
        assert call_args[1]['file_options']['upsert'] == 'true'

    def test_upload_icon_uses_resume_icons_bucket(self, flask_test_client):
        """Verify upload uses 'resume-icons' bucket."""
        client, mock_sb, flask_app = flask_test_client

        flask_app.upload_icon_to_storage(
            TEST_USER_ID, TEST_RESUME_ID, 'icon.png', b'data'
        )

        mock_sb.storage.from_.assert_called_with('resume-icons')

    def test_upload_icon_returns_public_url(self, flask_test_client):
        """Verify upload returns storage URL."""
        client, mock_sb, flask_app = flask_test_client

        storage_path, storage_url = flask_app.upload_icon_to_storage(
            TEST_USER_ID, TEST_RESUME_ID, 'icon.png', b'data'
        )

        # URL is dynamically generated based on storage path
        expected_url = f'https://test.supabase.co/storage/{TEST_USER_ID}/{TEST_RESUME_ID}/icon.png'
        assert storage_url == expected_url

    def test_upload_icon_raises_on_failure(self, flask_test_client):
        """Verify upload raises exception on storage failure."""
        client, mock_sb, flask_app = flask_test_client

        mock_sb.storage.from_.return_value.upload.side_effect = Exception("Storage error")

        with pytest.raises(Exception) as exc_info:
            flask_app.upload_icon_to_storage(
                TEST_USER_ID, TEST_RESUME_ID, 'icon.png', b'data'
            )

        assert "Storage error" in str(exc_info.value)

    def test_upload_icon_with_supabase_none_raises(self, flask_test_client):
        """Verify upload raises when Supabase is not initialized."""
        client, mock_sb, flask_app = flask_test_client

        with patch.object(flask_app, 'supabase', None):
            with pytest.raises(Exception) as exc_info:
                flask_app.upload_icon_to_storage(
                    TEST_USER_ID, TEST_RESUME_ID, 'icon.png', b'data'
                )

            assert "not initialized" in str(exc_info.value)


class TestDownloadIconFromStorage:
    """Tests for download_icon_from_storage function."""

    def test_download_icon_writes_to_destination(self, flask_test_client, temp_output_dir):
        """Verify download writes file to destination path."""
        client, mock_sb, flask_app = flask_test_client

        expected_data = b'fake-image-data'
        mock_sb.storage.from_.return_value.download.return_value = expected_data

        dest_path = temp_output_dir / 'downloaded_icon.png'
        storage_path = f'{TEST_USER_ID}/{TEST_RESUME_ID}/icon.png'

        success = flask_app.download_icon_from_storage(storage_path, str(dest_path))

        assert success is True
        assert dest_path.exists()
        assert dest_path.read_bytes() == expected_data

    def test_download_icon_retries_on_transient_error(self, flask_test_client, temp_output_dir):
        """Verify download retries on transient errors."""
        client, mock_sb, flask_app = flask_test_client

        # First call fails, second succeeds
        mock_sb.storage.from_.return_value.download.side_effect = [
            Exception("Connection reset"),
            b'fake-image-data'
        ]

        dest_path = temp_output_dir / 'downloaded_icon.png'
        storage_path = f'{TEST_USER_ID}/{TEST_RESUME_ID}/icon.png'

        success = flask_app.download_icon_from_storage(storage_path, str(dest_path), max_retries=2)

        assert success is True
        assert mock_sb.storage.from_.return_value.download.call_count == 2

    def test_download_icon_returns_false_after_max_retries(self, flask_test_client, temp_output_dir):
        """Verify download returns False after exhausting retries."""
        client, mock_sb, flask_app = flask_test_client

        # All calls fail
        mock_sb.storage.from_.return_value.download.side_effect = Exception("Persistent error")

        dest_path = temp_output_dir / 'downloaded_icon.png'
        storage_path = f'{TEST_USER_ID}/{TEST_RESUME_ID}/icon.png'

        success = flask_app.download_icon_from_storage(storage_path, str(dest_path), max_retries=2)

        assert success is False
        # Should have tried max_retries + 1 times
        assert mock_sb.storage.from_.return_value.download.call_count == 3

    def test_download_icon_with_supabase_none_returns_false(self, flask_test_client, temp_output_dir):
        """Verify download returns False when Supabase is not initialized."""
        client, mock_sb, flask_app = flask_test_client

        dest_path = temp_output_dir / 'downloaded_icon.png'

        with patch.object(flask_app, 'supabase', None):
            success = flask_app.download_icon_from_storage(
                'some/path/icon.png', str(dest_path)
            )

        assert success is False


class TestSaveResumeWithIcons:
    """Tests for icon handling during resume save."""

    def test_save_resume_uploads_new_icons(self, flask_test_client, auth_headers):
        """Verify new icons are uploaded during save."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Create base64 encoded icon data
        icon_data = base64.b64encode(b'fake-png-data').decode('utf-8')

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID, 'json_hash': 'old-hash'}]),  # verify ownership
            create_mock_response([]),  # get existing icons (none)
            create_mock_response([]),  # upsert resume
            create_mock_response([]),  # delete old icons
            create_mock_response([]),  # insert new icons
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes',
            json={
                'id': TEST_RESUME_ID,
                'title': 'Test Resume',
                'template_id': 'modern-with-icons',
                'contact_info': {'name': 'John'},
                'sections': [],
                'icons': [
                    {'filename': 'new_icon.png', 'data': icon_data}
                ]
            },
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify storage upload was called
        mock_sb.storage.from_.return_value.upload.assert_called()

    def test_save_resume_preserves_unchanged_icons(self, flask_test_client, auth_headers, sample_icon_data):
        """Verify unchanged icons are preserved (not re-uploaded)."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Create icon data with same size as existing
        icon_content = b'x' * sample_icon_data['file_size']  # Same size
        icon_data = base64.b64encode(icon_content).decode('utf-8')

        # Configure mock responses
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID, 'json_hash': 'old-hash'}]),  # verify ownership
            create_mock_response([sample_icon_data]),  # get existing icons
            create_mock_response([]),  # upsert resume
            create_mock_response([]),  # delete old icons
            create_mock_response([]),  # insert icons
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes',
            json={
                'id': TEST_RESUME_ID,
                'title': 'Test Resume',
                'template_id': 'modern-with-icons',
                'contact_info': {'name': 'John'},
                'sections': [],
                'icons': [
                    {'filename': sample_icon_data['filename'], 'data': icon_data}
                ]
            },
            headers=auth_headers
        )

        assert response.status_code == 200

        # Storage upload should NOT be called for unchanged icon
        # (icon with same filename and size)
        mock_sb.storage.from_.return_value.upload.assert_not_called()

    def test_save_resume_deletes_removed_icons(self, flask_test_client, auth_headers, sample_icon_data):
        """Verify icons removed from resume are deleted."""
        client, mock_sb, _ = flask_test_client

        # Configure mock auth
        mock_user = MagicMock()
        mock_user.id = TEST_USER_ID
        mock_sb.auth.get_user.return_value = MagicMock(user=mock_user)

        # Configure mock responses - existing icon, but not in new save
        mock_sb.table.return_value.execute.side_effect = [
            create_mock_response([{'id': TEST_RESUME_ID, 'json_hash': 'old-hash'}]),  # verify ownership
            create_mock_response([sample_icon_data]),  # get existing icons
            create_mock_response([]),  # upsert resume
            create_mock_response([]),  # delete removed icons
            create_mock_response([]),  # delete all icons (cleanup)
            create_mock_response([]),  # upsert prefs
        ]

        response = client.post(
            '/api/resumes',
            json={
                'id': TEST_RESUME_ID,
                'title': 'Test Resume',
                'template_id': 'modern-with-icons',
                'contact_info': {'name': 'John'},
                'sections': [],
                'icons': []  # No icons - existing should be deleted
            },
            headers=auth_headers
        )

        assert response.status_code == 200

        # Verify delete was called for the old icons
        delete_calls = mock_sb.table.return_value.delete.call_args_list
        assert len(delete_calls) > 0
