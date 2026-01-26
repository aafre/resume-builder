"""
Shared pytest fixtures for backend tests.

Provides:
- Flask test client
- Mock Supabase client with chainable methods
- Mock authentication fixtures
- Common test data helpers
"""
import pytest
from unittest.mock import MagicMock, patch
import sys
import os
import tempfile
import shutil
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# =============================================================================
# Test Constants
# =============================================================================

TEST_USER_ID = 'test-user-id-123'
OTHER_USER_ID = 'other-user-id-456'
TEST_RESUME_ID = 'test-resume-id-789'


# =============================================================================
# Mock Supabase Helpers
# =============================================================================

def create_mock_response(data=None, count=None):
    """Create a mock Supabase response object."""
    response = MagicMock()
    response.data = data if data is not None else []
    response.count = count if count is not None else len(response.data)
    return response


def create_mock_supabase():
    """
    Create a mock Supabase client with chainable methods.

    Supports chaining like:
        supabase.table('resumes').select('*').eq('id', 'x').execute()
    """
    mock = MagicMock()

    # Make table() return a chainable mock
    mock_table = MagicMock()
    mock.table.return_value = mock_table

    # Chain all common methods to return themselves
    chainable_methods = [
        'select', 'insert', 'update', 'upsert', 'delete',
        'eq', 'neq', 'gt', 'lt', 'gte', 'lte',
        'in_', 'is_', 'not_', 'or_',
        'order', 'limit', 'offset', 'range',
        'maybeSingle', 'single'
    ]

    for method in chainable_methods:
        getattr(mock_table, method).return_value = mock_table

    # Default execute returns empty data
    mock_table.execute.return_value = create_mock_response([])

    # RPC support
    mock.rpc.return_value = mock_table

    # Storage support
    mock_bucket = MagicMock()
    mock.storage.from_.return_value = mock_bucket
    mock_bucket.download.return_value = b'fake-image-data'
    mock_bucket.upload.return_value = None
    mock_bucket.get_public_url.return_value = 'https://test.supabase.co/storage/icon.png'
    mock_bucket.remove.return_value = None

    # Auth support
    mock.auth = MagicMock()
    mock_user = MagicMock()
    mock_user.id = TEST_USER_ID
    mock.auth.get_user.return_value = MagicMock(user=mock_user)

    return mock


# =============================================================================
# Flask Test Client Fixtures
# =============================================================================

@pytest.fixture
def mock_supabase():
    """Create a mock Supabase client."""
    return create_mock_supabase()


@pytest.fixture
def flask_test_client(mock_supabase):
    """
    Create a Flask test client with mocked Supabase.

    Usage:
        def test_something(flask_test_client):
            client, mock_sb = flask_test_client
            response = client.get('/api/templates')
    """
    import app as flask_app

    # Patch the supabase client in the app module
    with patch.object(flask_app, 'supabase', mock_supabase):
        flask_app.app.config['TESTING'] = True
        with flask_app.app.test_client() as client:
            yield client, mock_supabase, flask_app


@pytest.fixture
def auth_headers():
    """Provide mock authorization headers."""
    return {'Authorization': 'Bearer test-jwt-token'}


# =============================================================================
# Temp Directory Fixtures
# =============================================================================

@pytest.fixture
def temp_output_dir():
    """Create a temporary directory for test outputs."""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.fixture
def temp_session_dir():
    """Create a temporary session icons directory."""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    shutil.rmtree(temp_dir, ignore_errors=True)


# =============================================================================
# Test Data Fixtures
# =============================================================================

@pytest.fixture
def sample_resume_data():
    """Provide sample resume data for testing."""
    return {
        'id': TEST_RESUME_ID,
        'user_id': TEST_USER_ID,
        'title': 'Test Resume',
        'template_id': 'modern-with-icons',
        'contact_info': {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone': '555-1234',
            'location': 'San Francisco, CA',
            'social_links': [
                {
                    'platform': 'linkedin',
                    'url': 'https://linkedin.com/in/johndoe',
                    'display_text': 'John Doe'
                }
            ]
        },
        'sections': [
            {
                'name': 'Summary',
                'type': 'text',
                'content': 'Experienced software engineer...'
            },
            {
                'name': 'Experience',
                'type': 'experience',
                'content': [
                    {
                        'company': 'Tech Corp',
                        'title': 'Software Engineer',
                        'dates': '2020-Present',
                        'description': 'Built awesome stuff'
                    }
                ]
            }
        ],
        'json_hash': 'abc123',
        'created_at': '2025-01-15T10:00:00Z',
        'updated_at': '2025-01-20T14:00:00Z'
    }


@pytest.fixture
def sample_icon_data():
    """Provide sample icon data for testing."""
    return {
        'id': 'icon-id-123',
        'resume_id': TEST_RESUME_ID,
        'user_id': TEST_USER_ID,
        'filename': 'company_google.png',
        'storage_path': f'{TEST_USER_ID}/{TEST_RESUME_ID}/company_google.png',
        'storage_url': 'https://test.supabase.co/storage/company_google.png',
        'mime_type': 'image/png',
        'file_size': 1024,
        'created_at': '2025-01-15T10:00:00Z'
    }


@pytest.fixture
def sample_yaml_content():
    """Provide sample YAML content for testing."""
    return """
contact_info:
  name: John Doe
  email: john@example.com
  phone: 555-1234
  location: San Francisco, CA
  social_links:
    - platform: linkedin
      url: https://linkedin.com/in/johndoe
      display_text: John Doe

sections:
  - name: Summary
    type: text
    content: Experienced software engineer with 10 years of experience.

  - name: Experience
    type: experience
    content:
      - company: Tech Corp
        title: Software Engineer
        dates: 2020-Present
        description: Built awesome stuff
        icon: company_tech.png
"""


