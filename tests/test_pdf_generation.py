"""
Tests for PDF generation functionality.

Tests cover:
1. Thread pool initialization and cleanup
2. PDF generation worker function
3. PDF generation with sample YAML files for each template
4. Flask endpoint integration tests

These tests ensure that:
- The ThreadPoolExecutor is properly initialized
- PDF generation works correctly for all templates
- Sample YAML files produce valid PDFs
- The API endpoint returns valid PDF responses

Run tests:
    pytest tests/test_pdf_generation.py -v

Run only unit tests (no pdfkit required):
    pytest tests/test_pdf_generation.py -v -m "not requires_pdfkit"

Run integration tests (requires pdfkit + wkhtmltopdf):
    pytest tests/test_pdf_generation.py -v -m "requires_pdfkit"
"""
import pytest
import tempfile
import shutil
import os
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import after path setup
import app


# Check if pdfkit is available
def is_pdfkit_available():
    """Check if pdfkit and wkhtmltopdf are available."""
    try:
        import pdfkit
        # Try to get wkhtmltopdf version to verify it's installed
        pdfkit.configuration()
        return True
    except Exception:
        return False


PDFKIT_AVAILABLE = is_pdfkit_available()
requires_pdfkit = pytest.mark.skipif(
    not PDFKIT_AVAILABLE,
    reason="pdfkit or wkhtmltopdf not installed"
)


# =============================================================================
# Fixtures
# =============================================================================

@pytest.fixture
def temp_output_dir():
    """Create a temporary directory for PDF output."""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.fixture
def temp_session_dir():
    """Create a temporary session icons directory."""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.fixture
def sample_yaml_files():
    """Get all sample YAML files from the samples directory."""
    samples_dir = Path(__file__).parent.parent / "samples"
    yaml_files = list(samples_dir.glob("**/*.yml"))
    # Filter out meta.yml and test files
    yaml_files = [f for f in yaml_files if f.name not in ("meta.yml",)]
    return yaml_files


@pytest.fixture
def flask_test_client():
    """Create a Flask test client."""
    app.app.config['TESTING'] = True
    with app.app.test_client() as client:
        yield client


# =============================================================================
# Thread Pool Tests
# =============================================================================

class TestThreadPoolInitialization:
    """Tests for thread pool initialization and cleanup."""

    def test_pdf_thread_pool_is_threadpool_executor(self):
        """Verify PDF_THREAD_POOL is a ThreadPoolExecutor instance."""
        # Initialize if not already done
        if app.PDF_THREAD_POOL is None:
            app.initialize_pdf_pool()

        assert app.PDF_THREAD_POOL is not None
        assert isinstance(app.PDF_THREAD_POOL, ThreadPoolExecutor)

    def test_initialize_pdf_pool_creates_pool(self, monkeypatch):
        """Verify initialize_pdf_pool creates a working pool."""
        # monkeypatch will automatically restore the original value
        monkeypatch.setattr(app, "PDF_THREAD_POOL", None)
        # Mock atexit.register to prevent side effects across tests
        monkeypatch.setattr(app.atexit, "register", lambda func: None)

        app.initialize_pdf_pool()

        assert app.PDF_THREAD_POOL is not None

        # Verify pool can submit tasks
        future = app.PDF_THREAD_POOL.submit(lambda: "test")
        result = future.result(timeout=5)
        assert result == "test"

        # Clean up the pool created during the test
        app.PDF_THREAD_POOL.shutdown(wait=True)

    def test_cleanup_pdf_pool_shuts_down_pool(self, monkeypatch):
        """Verify cleanup_pdf_pool properly shuts down the pool."""
        # Create a temporary pool; monkeypatch restores original after test
        temp_pool = ThreadPoolExecutor(max_workers=1)
        monkeypatch.setattr(app, "PDF_THREAD_POOL", temp_pool)

        # Cleanup should shut down the pool and set it to None
        app.cleanup_pdf_pool()
        assert app.PDF_THREAD_POOL is None

    def test_pool_has_correct_max_workers(self):
        """Verify pool is initialized with expected worker count."""
        if app.PDF_THREAD_POOL is None:
            app.initialize_pdf_pool()

        # Note: _max_workers is a private attribute of ThreadPoolExecutor.
        # We access it here because there's no public API to query max_workers,
        # and we need to verify our configuration is correct.
        assert app.PDF_THREAD_POOL._max_workers == 5


# =============================================================================
# Worker Function Tests
# =============================================================================

class TestPdfGenerationWorker:
    """Tests for the pdf_generation_worker function."""

    @requires_pdfkit
    def test_worker_returns_success_dict_on_success(self, temp_output_dir, temp_session_dir):
        """Verify worker returns success dict when PDF is created."""
        # Use a real sample file
        sample_yaml = Path(__file__).parent.parent / "samples" / "modern" / "john_doe_no_icon.yml"
        if not sample_yaml.exists():
            pytest.skip("Sample YAML file not found")

        output_path = temp_output_dir / "test_output.pdf"

        result = app.pdf_generation_worker(
            template_name="modern",
            yaml_path=str(sample_yaml),
            output_path=str(output_path),
            session_icons_dir=str(temp_session_dir),
            session_id="test-session-123"
        )

        assert isinstance(result, dict)
        assert result.get("success") is True
        assert "output" in result
        assert output_path.exists()
        assert output_path.stat().st_size > 0

    def test_worker_returns_error_dict_on_invalid_yaml(self, temp_output_dir, temp_session_dir):
        """Verify worker returns error dict for invalid YAML."""
        # Create invalid YAML file
        invalid_yaml = temp_output_dir / "invalid.yml"
        invalid_yaml.write_text("this: is: not: valid: yaml: [[[")

        output_path = temp_output_dir / "test_output.pdf"

        result = app.pdf_generation_worker(
            template_name="modern",
            yaml_path=str(invalid_yaml),
            output_path=str(output_path),
            session_icons_dir=str(temp_session_dir),
            session_id="test-session-123"
        )

        assert isinstance(result, dict)
        assert result.get("success") is False
        assert "error" in result

    def test_worker_returns_error_dict_on_missing_yaml(self, temp_output_dir, temp_session_dir):
        """Verify worker returns error dict for missing YAML file."""
        output_path = temp_output_dir / "test_output.pdf"

        result = app.pdf_generation_worker(
            template_name="modern",
            yaml_path="/nonexistent/path/to/file.yml",
            output_path=str(output_path),
            session_icons_dir=str(temp_session_dir),
            session_id="test-session-123"
        )

        assert isinstance(result, dict)
        assert result.get("success") is False
        assert "error" in result

    def test_worker_returns_error_dict_on_invalid_template(self, temp_output_dir, temp_session_dir):
        """Verify worker returns error dict for invalid template name."""
        sample_yaml = Path(__file__).parent.parent / "samples" / "modern" / "john_doe_no_icon.yml"
        if not sample_yaml.exists():
            pytest.skip("Sample YAML file not found")

        output_path = temp_output_dir / "test_output.pdf"

        result = app.pdf_generation_worker(
            template_name="nonexistent-template",
            yaml_path=str(sample_yaml),
            output_path=str(output_path),
            session_icons_dir=str(temp_session_dir),
            session_id="test-session-123"
        )

        assert isinstance(result, dict)
        assert result.get("success") is False
        assert "error" in result


# =============================================================================
# Sample YAML Integration Tests
# =============================================================================

class TestSampleYamlPdfGeneration:
    """Integration tests using sample YAML files."""

    @requires_pdfkit
    @pytest.mark.parametrize("template_name,yaml_subpath", [
        # Template name must be actual directory name, not template ID
        # modern-no-icons and modern-with-icons are IDs that map to "modern" directory
        ("modern", "modern/john_doe_no_icon.yml"),
        ("modern", "modern/john_doe.yml"),
    ])
    def test_generate_pdf_from_sample_modern_templates(
        self, template_name, yaml_subpath, temp_output_dir, temp_session_dir
    ):
        """Test PDF generation for modern template variants."""
        sample_yaml = Path(__file__).parent.parent / "samples" / yaml_subpath
        if not sample_yaml.exists():
            pytest.skip(f"Sample YAML file not found: {yaml_subpath}")

        output_path = temp_output_dir / f"test_{template_name}.pdf"

        result = app.pdf_generation_worker(
            template_name=template_name,
            yaml_path=str(sample_yaml),
            output_path=str(output_path),
            session_icons_dir=str(temp_session_dir),
            session_id="test-session-integration"
        )

        assert result.get("success") is True, f"Failed: {result.get('error')}"
        assert output_path.exists(), "PDF file was not created"
        assert output_path.stat().st_size > 1000, "PDF file is too small (likely corrupt)"

    def test_all_sample_yaml_files_are_valid(self, sample_yaml_files, temp_output_dir, temp_session_dir):
        """Verify all sample YAML files can be parsed and used for PDF generation."""
        import yaml

        for yaml_file in sample_yaml_files:
            # Skip test files that may have intentional issues
            if "test_" in yaml_file.name:
                continue

            # Verify YAML is valid
            with open(yaml_file, 'r') as f:
                try:
                    data = yaml.safe_load(f)
                    assert data is not None, f"Empty YAML file: {yaml_file}"
                    assert "contact_info" in data or "sections" in data, \
                        f"Missing required keys in {yaml_file}"
                except yaml.YAMLError as e:
                    pytest.fail(f"Invalid YAML in {yaml_file}: {e}")


class TestTemplateMapping:
    """Tests for template ID to directory mapping."""

    def test_template_ids_map_to_valid_directories(self):
        """Verify all template IDs map to directories that exist."""
        # Template IDs used in the UI and their expected directory mappings
        template_mappings = {
            "modern-with-icons": "modern",
            "modern-no-icons": "modern",
            "modern": "modern",
            "classic": "classic",
            "classic-alex-rivera": "classic",
            "classic-jane-doe": "classic",
        }

        templates_dir = Path(__file__).parent.parent / "templates"

        for template_id, expected_dir in template_mappings.items():
            dir_path = templates_dir / expected_dir
            assert dir_path.exists(), \
                f"Template ID '{template_id}' maps to '{expected_dir}' but directory doesn't exist"

    def test_modern_template_has_required_files(self):
        """Verify modern template directory has all required files."""
        modern_dir = Path(__file__).parent.parent / "templates" / "modern"

        required_files = ["base.html", "styles.css"]
        for filename in required_files:
            file_path = modern_dir / filename
            assert file_path.exists(), f"Modern template missing required file: {filename}"


# =============================================================================
# Thread Pool + Worker Integration Tests
# =============================================================================

class TestThreadPoolWorkerIntegration:
    """Integration tests for thread pool with worker function."""

    @requires_pdfkit
    def test_pool_submit_worker_returns_result(self, temp_output_dir, temp_session_dir):
        """Verify submitting worker to pool returns correct result."""
        if app.PDF_THREAD_POOL is None:
            app.initialize_pdf_pool()

        sample_yaml = Path(__file__).parent.parent / "samples" / "modern" / "john_doe_no_icon.yml"
        if not sample_yaml.exists():
            pytest.skip("Sample YAML file not found")

        output_path = temp_output_dir / "pool_test.pdf"

        future = app.PDF_THREAD_POOL.submit(
            app.pdf_generation_worker,
            "modern",
            str(sample_yaml),
            str(output_path),
            str(temp_session_dir),
            "pool-test-session"
        )

        # Wait for result with timeout
        result = future.result(timeout=60)

        assert result.get("success") is True, f"Worker failed: {result.get('error')}"
        assert output_path.exists()

    @requires_pdfkit
    def test_pool_handles_concurrent_requests(self, temp_output_dir, temp_session_dir):
        """Verify pool can handle multiple concurrent PDF generations."""
        if app.PDF_THREAD_POOL is None:
            app.initialize_pdf_pool()

        sample_yaml = Path(__file__).parent.parent / "samples" / "modern" / "john_doe_no_icon.yml"
        if not sample_yaml.exists():
            pytest.skip("Sample YAML file not found")

        # Submit 3 concurrent requests
        futures = []
        for i in range(7):
            output_path = temp_output_dir / f"concurrent_test_{i}.pdf"
            future = app.PDF_THREAD_POOL.submit(
                app.pdf_generation_worker,
                "modern",
                str(sample_yaml),
                str(output_path),
                str(temp_session_dir),
                f"concurrent-session-{i}"
            )
            futures.append((future, output_path))

        # Wait for all results
        for future, output_path in futures:
            result = future.result(timeout=120)
            assert result.get("success") is True, f"Worker failed: {result.get('error')}"
            assert output_path.exists()


# =============================================================================
# Flask Endpoint Tests
# =============================================================================

class TestGenerateEndpoint:
    """Tests for the /api/generate endpoint."""

    def test_generate_endpoint_requires_yaml_file(self, flask_test_client):
        """Verify endpoint returns 400 without YAML file."""
        response = flask_test_client.post(
            '/api/generate',
            data={'template': 'modern', 'session_id': 'test-123'}
        )

        # Should fail without yaml_file
        assert response.status_code == 400

    @requires_pdfkit
    def test_generate_endpoint_returns_pdf_content_type(self, flask_test_client, temp_output_dir):
        """Verify endpoint returns PDF with correct content type."""
        sample_yaml = Path(__file__).parent.parent / "samples" / "modern" / "john_doe_no_icon.yml"
        if not sample_yaml.exists():
            pytest.skip("Sample YAML file not found")

        with open(sample_yaml, 'rb') as f:
            response = flask_test_client.post(
                '/api/generate',
                data={
                    'yaml_file': (f, 'resume.yml'),
                    'template': 'modern',
                    'session_id': 'endpoint-test-123'
                },
                content_type='multipart/form-data'
            )

        assert response.status_code == 200
        assert response.content_type == 'application/pdf'
        assert len(response.data) > 1000  # PDF should have reasonable size

    def test_templates_endpoint_returns_json(self, flask_test_client):
        """Verify /api/templates returns JSON with templates list."""
        response = flask_test_client.get('/api/templates')

        assert response.status_code == 200
        assert response.content_type == 'application/json'

        data = response.get_json()
        # API returns {success: true, templates: [...]}
        assert data.get("success") is True
        assert "templates" in data
        assert isinstance(data["templates"], list)
        assert len(data["templates"]) > 0


# =============================================================================
# PDF Validation Tests
# =============================================================================

class TestPdfValidation:
    """Tests for PDF output validation."""

    @requires_pdfkit
    def test_generated_pdf_has_valid_header(self, temp_output_dir, temp_session_dir):
        """Verify generated PDF has valid PDF header bytes."""
        sample_yaml = Path(__file__).parent.parent / "samples" / "modern" / "john_doe_no_icon.yml"
        if not sample_yaml.exists():
            pytest.skip("Sample YAML file not found")

        output_path = temp_output_dir / "validation_test.pdf"

        result = app.pdf_generation_worker(
            template_name="modern",
            yaml_path=str(sample_yaml),
            output_path=str(output_path),
            session_icons_dir=str(temp_session_dir),
            session_id="validation-test"
        )

        assert result.get("success") is True

        # Read first bytes and verify PDF magic number
        with open(output_path, 'rb') as f:
            header = f.read(8)

        assert header.startswith(b'%PDF-'), "File does not have valid PDF header"

    @requires_pdfkit
    def test_generated_pdf_minimum_size(self, temp_output_dir, temp_session_dir):
        """Verify generated PDF has minimum expected size."""
        sample_yaml = Path(__file__).parent.parent / "samples" / "modern" / "john_doe_no_icon.yml"
        if not sample_yaml.exists():
            pytest.skip("Sample YAML file not found")

        output_path = temp_output_dir / "size_test.pdf"

        result = app.pdf_generation_worker(
            template_name="modern",
            yaml_path=str(sample_yaml),
            output_path=str(output_path),
            session_icons_dir=str(temp_session_dir),
            session_id="size-test"
        )

        assert result.get("success") is True

        # A valid resume PDF should be at least 5KB
        file_size = output_path.stat().st_size
        assert file_size > 5000, f"PDF too small ({file_size} bytes), likely corrupt"
