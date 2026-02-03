"""
Tests for error handling and retry logic.

Tests cover:
1. retry_on_connection_error decorator
2. Connection error classification
3. Exponential backoff timing
4. require_auth retry on connection errors

Run tests:
    pytest tests/test_error_handling.py -v
"""
import pytest
from unittest.mock import MagicMock, patch, call
import sys
import os
import time
import json

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class TestRetryDecorator:
    """Tests for retry_on_connection_error decorator."""

    def test_retry_decorator_returns_on_success(self, flask_test_client):
        """Verify decorator returns result on first successful call."""
        client, mock_sb, flask_app = flask_test_client

        @flask_app.retry_on_connection_error(max_retries=3, backoff_factor=0.01)
        def successful_func():
            return "success"

        result = successful_func()

        assert result == "success"

    def test_retry_decorator_retries_on_connection_error(self, flask_test_client):
        """Verify decorator retries on connection errors."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        @flask_app.retry_on_connection_error(max_retries=3, backoff_factor=0.01)
        def flaky_func():
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise Exception("Server disconnected")
            return "success"

        result = flaky_func()

        assert result == "success"
        assert call_count == 3

    def test_retry_decorator_retries_on_timeout(self, flask_test_client):
        """Verify decorator retries on timeout errors."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        @flask_app.retry_on_connection_error(max_retries=2, backoff_factor=0.01)
        def timeout_func():
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                raise Exception("Connection timeout")
            return "success"

        result = timeout_func()

        assert result == "success"
        assert call_count == 2

    def test_retry_decorator_does_not_retry_non_connection_error(self, flask_test_client):
        """Verify decorator does not retry non-connection errors."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        @flask_app.retry_on_connection_error(max_retries=3, backoff_factor=0.01)
        def error_func():
            nonlocal call_count
            call_count += 1
            raise ValueError("Invalid data")

        with pytest.raises(ValueError):
            error_func()

        # Should only be called once (no retries)
        assert call_count == 1

    def test_retry_decorator_respects_max_retries(self, flask_test_client):
        """Verify decorator stops after max_retries."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        @flask_app.retry_on_connection_error(max_retries=2, backoff_factor=0.01)
        def always_fails():
            nonlocal call_count
            call_count += 1
            raise Exception("Server disconnected")

        with pytest.raises(Exception) as exc_info:
            always_fails()

        assert "Server disconnected" in str(exc_info.value)
        # Should be called max_retries + 1 times (initial + retries)
        assert call_count == 3

    def test_retry_decorator_uses_exponential_backoff(self, flask_test_client):
        """Verify decorator uses exponential backoff timing."""
        client, mock_sb, flask_app = flask_test_client

        # We can't easily test actual timing without mocking time.sleep
        # But we can verify the decorator is configured correctly

        @flask_app.retry_on_connection_error(max_retries=2, backoff_factor=0.5)
        def test_func():
            raise Exception("Connection error")

        # The backoff times should be: 0.5s, 1s (0.5 * 2^0, 0.5 * 2^1)
        with patch('time.sleep') as mock_sleep:
            with pytest.raises(Exception):
                test_func()

            # Verify sleep was called with exponential backoff
            sleep_calls = mock_sleep.call_args_list
            assert len(sleep_calls) == 2  # Two retries

            # First retry: 0.5 * (2^0) = 0.5
            assert sleep_calls[0] == call(0.5)
            # Second retry: 0.5 * (2^1) = 1.0
            assert sleep_calls[1] == call(1.0)


class TestConnectionErrorClassification:
    """Tests for connection error detection in retry decorator."""

    def test_server_disconnected_is_retryable(self, flask_test_client):
        """Verify 'Server disconnected' errors trigger retry."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        @flask_app.retry_on_connection_error(max_retries=1, backoff_factor=0.01)
        def func():
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                raise Exception("Server disconnected without sending any data")
            return "ok"

        result = func()
        assert result == "ok"
        assert call_count == 2

    def test_connection_reset_is_retryable(self, flask_test_client):
        """Verify 'connection reset' errors trigger retry."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        @flask_app.retry_on_connection_error(max_retries=1, backoff_factor=0.01)
        def func():
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                raise Exception("Connection reset by peer")
            return "ok"

        result = func()
        assert result == "ok"
        assert call_count == 2

    def test_timeout_is_retryable(self, flask_test_client):
        """Verify 'timeout' errors trigger retry."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        @flask_app.retry_on_connection_error(max_retries=1, backoff_factor=0.01)
        def func():
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                raise Exception("Request timeout exceeded")
            return "ok"

        result = func()
        assert result == "ok"
        assert call_count == 2

    def test_validation_error_not_retryable(self, flask_test_client):
        """Verify validation errors do not trigger retry."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        @flask_app.retry_on_connection_error(max_retries=3, backoff_factor=0.01)
        def func():
            nonlocal call_count
            call_count += 1
            raise ValueError("Invalid email format")

        with pytest.raises(ValueError):
            func()

        # Should not retry
        assert call_count == 1

    def test_key_error_not_retryable(self, flask_test_client):
        """Verify key errors do not trigger retry."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        @flask_app.retry_on_connection_error(max_retries=3, backoff_factor=0.01)
        def func():
            nonlocal call_count
            call_count += 1
            raise KeyError("missing_key")

        with pytest.raises(KeyError):
            func()

        assert call_count == 1


class TestRetryDecoratorPreservesFunction:
    """Tests to verify decorator preserves function metadata."""

    def test_preserves_function_name(self, flask_test_client):
        """Verify decorated function keeps its original name."""
        client, mock_sb, flask_app = flask_test_client

        @flask_app.retry_on_connection_error()
        def my_function():
            pass

        assert my_function.__name__ == "my_function"

    def test_preserves_function_docstring(self, flask_test_client):
        """Verify decorated function keeps its docstring."""
        client, mock_sb, flask_app = flask_test_client

        @flask_app.retry_on_connection_error()
        def my_function():
            """This is my docstring."""
            pass

        assert my_function.__doc__ == "This is my docstring."


class TestRetryDecoratorEdgeCases:
    """Tests for edge cases in retry decorator."""

    def test_zero_max_retries(self, flask_test_client):
        """Verify decorator works with max_retries=0 (no retries)."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        @flask_app.retry_on_connection_error(max_retries=0, backoff_factor=0.01)
        def func():
            nonlocal call_count
            call_count += 1
            raise Exception("Connection error")

        with pytest.raises(Exception):
            func()

        # Should only be called once
        assert call_count == 1

    def test_function_with_arguments(self, flask_test_client):
        """Verify decorator works with functions that take arguments."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        @flask_app.retry_on_connection_error(max_retries=1, backoff_factor=0.01)
        def func_with_args(a, b, c=None):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                raise Exception("Connection error")
            return f"{a}-{b}-{c}"

        result = func_with_args("x", "y", c="z")

        assert result == "x-y-z"
        assert call_count == 2

    def test_function_with_kwargs(self, flask_test_client):
        """Verify decorator works with keyword arguments."""
        client, mock_sb, flask_app = flask_test_client

        @flask_app.retry_on_connection_error(max_retries=0, backoff_factor=0.01)
        def func(**kwargs):
            return kwargs

        result = func(a=1, b=2)

        assert result == {'a': 1, 'b': 2}


class TestClassifyThumbnailErrorRetryability:
    """Additional tests for error classification related to retryability."""

    def test_network_errors_marked_retryable(self, flask_test_client):
        """Verify network-related errors are marked as retryable."""
        client, mock_sb, flask_app = flask_test_client

        network_errors = [
            "Server disconnected",
            "Connection refused",
            "Connection timeout",
            "Connection reset by peer",
            "Network unreachable"
        ]

        for error_msg in network_errors:
            error = Exception(error_msg)
            result = flask_app.classify_thumbnail_error(error)
            assert result['retryable'] is True, f"Expected '{error_msg}' to be retryable"

    def test_dependency_errors_not_retryable(self, flask_test_client):
        """Verify dependency errors are not retryable."""
        client, mock_sb, flask_app = flask_test_client

        error = ImportError("No module named 'pdf2image'")
        result = flask_app.classify_thumbnail_error(error)

        assert result['retryable'] is False
        assert result['error_type'] == 'dependency'
        assert 'user_message' in result

    def test_data_errors_not_retryable(self, flask_test_client):
        """Verify data/validation errors are not retryable."""
        client, mock_sb, flask_app = flask_test_client

        data_errors = [
            "Invalid PDF format",
            "Corrupted file data",
            "Missing required field"
        ]

        for error_msg in data_errors:
            error = Exception(error_msg)
            result = flask_app.classify_thumbnail_error(error)
            assert result['retryable'] is False, f"Expected '{error_msg}' to NOT be retryable"


class TestRequireAuthRetry:
    """Tests for require_auth retry on transient connection errors."""

    def test_retries_on_connection_error_then_succeeds(self, flask_test_client, auth_headers):
        """Verify require_auth retries get_user on connection error and succeeds on second attempt."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0
        mock_user = MagicMock()
        mock_user.id = 'test-user-id-123'

        def get_user_side_effect(token):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                raise Exception("Server disconnected without sending any data")
            return MagicMock(user=mock_user)

        mock_sb.auth.get_user.side_effect = get_user_side_effect

        with patch('time.sleep'):
            response = client.get('/api/user/preferences', headers=auth_headers)

        assert response.status_code == 200
        assert call_count == 2

    def test_does_not_retry_on_expired_token(self, flask_test_client, auth_headers):
        """Verify require_auth does NOT retry when token is expired."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        def get_user_side_effect(token):
            nonlocal call_count
            call_count += 1
            raise Exception("Token expired")

        mock_sb.auth.get_user.side_effect = get_user_side_effect

        response = client.get('/api/user/preferences', headers=auth_headers)

        assert response.status_code == 401
        assert call_count == 1

    def test_does_not_retry_on_invalid_token(self, flask_test_client, auth_headers):
        """Verify require_auth does NOT retry when token is invalid."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        def get_user_side_effect(token):
            nonlocal call_count
            call_count += 1
            raise Exception("Invalid JWT: signature verification failed")

        mock_sb.auth.get_user.side_effect = get_user_side_effect

        response = client.get('/api/user/preferences', headers=auth_headers)

        assert response.status_code == 401
        assert call_count == 1

    def test_returns_401_when_retry_also_fails(self, flask_test_client, auth_headers):
        """Verify require_auth returns 401 when both attempts raise connection errors."""
        client, mock_sb, flask_app = flask_test_client

        call_count = 0

        def get_user_side_effect(token):
            nonlocal call_count
            call_count += 1
            raise Exception("Connection reset by peer")

        mock_sb.auth.get_user.side_effect = get_user_side_effect

        with patch('time.sleep'):
            response = client.get('/api/user/preferences', headers=auth_headers)

        assert response.status_code == 401
        data = json.loads(response.data)
        assert data['success'] is False
        assert call_count == 2
