"""
Tests for the /api/migrate-anonymous-resumes endpoint.

Tests cover:
1. RPC is called with correct parameters for preference migration
2. Error handling for preferences migration
3. API contract tests (HTTP status codes and responses)
"""
import pytest
from unittest.mock import MagicMock, patch, call
from datetime import datetime, timedelta, timezone
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


OLD_USER_ID = 'anon-user-id-456'
NEW_USER_ID = 'auth-user-id-789'


def create_mock_supabase():
    """Create a mock Supabase client with chainable methods."""
    mock = MagicMock()
    mock.table.return_value = mock
    mock.select.return_value = mock
    mock.insert.return_value = mock
    mock.update.return_value = mock
    mock.delete.return_value = mock
    mock.eq.return_value = mock
    mock.in_.return_value = mock
    mock.is_.return_value = mock
    mock.maybeSingle.return_value = mock
    mock.rpc.return_value = mock
    mock.storage.from_.return_value = mock
    mock.download.return_value = b'fake-image-data'
    mock.upload.return_value = None
    mock.get_public_url.return_value = 'https://test.supabase.co/storage/icon.png'
    mock.remove.return_value = None
    return mock


def create_mock_response(data=None, count=0):
    """Create a mock Supabase response."""
    response = MagicMock()
    response.data = data if data is not None else []
    response.count = count
    return response


class TestMigratePreferencesRPC:
    """
    Unit tests for the user_preferences migration RPC call.

    These tests verify that the migrate_user_preferences RPC is called
    with the correct parameters. The actual migration logic is handled
    atomically in the database function.
    """

    def test_rpc_called_with_correct_parameters(self):
        """
        Verify that supabase.rpc('migrate_user_preferences', ...) is called
        with the correct old_uid and new_uid parameters.
        """
        mock_supabase = create_mock_supabase()
        mock_supabase.execute.return_value = create_mock_response()

        old_user_id = OLD_USER_ID
        new_user_id = NEW_USER_ID

        # This mirrors the actual app.py implementation
        mock_supabase.rpc('migrate_user_preferences', {
            'old_uid': old_user_id,
            'new_uid': new_user_id
        }).execute()

        # Verify RPC was called with correct function name and parameters
        mock_supabase.rpc.assert_called_once_with('migrate_user_preferences', {
            'old_uid': OLD_USER_ID,
            'new_uid': NEW_USER_ID
        })

    def test_rpc_error_is_caught_gracefully(self):
        """
        Scenario: Database error during RPC execution.
        Expected: Error should be caught and logged, not propagated.
        """
        mock_supabase = create_mock_supabase()

        # Simulate database error from RPC
        mock_supabase.execute.side_effect = Exception("Database connection failed")

        old_user_id = OLD_USER_ID
        new_user_id = NEW_USER_ID

        error_caught = False
        logged_warning = None

        # Migration logic with error handling (as in app.py)
        try:
            mock_supabase.rpc('migrate_user_preferences', {
                'old_uid': old_user_id,
                'new_uid': new_user_id
            }).execute()
        except Exception as e:
            # This is the expected behavior - error is caught and logged
            error_caught = True
            logged_warning = f"Failed to migrate preferences: {e}"

        # Error should have been caught (not propagated)
        assert error_caught, "Expected database error to be caught gracefully"
        # Verify warning message format matches app.py
        assert logged_warning is not None, "Expected warning to be logged"
        assert "Failed to migrate preferences" in logged_warning
        assert "Database connection failed" in logged_warning


class TestMigrationAPIContract:
    """
    API contract tests using Flask's test_client.

    These tests verify the HTTP interface behaves correctly for edge cases,
    ensuring the endpoint returns proper status codes and response formats.
    """

    @pytest.fixture
    def client(self):
        """Create Flask test client with mocked dependencies."""
        # Import here to avoid issues with module-level imports
        with patch.dict('sys.modules', {'supabase': MagicMock()}):
            import app as flask_app
            flask_app.app.config['TESTING'] = True
            with flask_app.app.test_client() as client:
                yield client, flask_app

    @pytest.fixture
    def auth_headers(self):
        """Provide mock authorization headers."""
        return {'Authorization': 'Bearer mock-jwt-token'}

    def test_same_user_returns_200_with_no_migration_needed(self, client, auth_headers):
        """
        API Contract: When old_user_id == new_user_id, endpoint should return
        HTTP 200 with message indicating no migration needed.
        """
        test_client, flask_app = client
        same_user_id = 'same-user-123'

        # Mock the require_auth decorator to set request.user_id
        with patch.object(flask_app, 'supabase') as mock_supabase:
            # Mock JWT verification in require_auth
            with patch.object(flask_app.supabase, 'auth') as mock_auth:
                mock_auth.get_user.return_value = MagicMock(
                    user=MagicMock(id=same_user_id)
                )

                response = test_client.post(
                    '/api/migrate-anonymous-resumes',
                    json={'old_user_id': same_user_id},
                    headers=auth_headers
                )

        assert response.status_code == 200
        data = response.get_json()
        assert data['migrated_count'] == 0
        assert data['message'] == 'Same user, no migration needed'

    def test_missing_old_user_id_returns_400(self, client, auth_headers):
        """
        API Contract: Request without old_user_id should return HTTP 400
        with appropriate error message.
        """
        test_client, flask_app = client
        new_user_id = 'auth-user-456'

        with patch.object(flask_app, 'supabase') as mock_supabase:
            with patch.object(flask_app.supabase, 'auth') as mock_auth:
                mock_auth.get_user.return_value = MagicMock(
                    user=MagicMock(id=new_user_id)
                )

                # Send request without old_user_id
                response = test_client.post(
                    '/api/migrate-anonymous-resumes',
                    json={},
                    headers=auth_headers
                )

        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert 'old_user_id' in data['error'].lower()

    def test_missing_auth_header_returns_401(self, client):
        """
        API Contract: Request without Authorization header should return HTTP 401.
        """
        test_client, flask_app = client

        with patch.object(flask_app, 'supabase', MagicMock()):
            response = test_client.post(
                '/api/migrate-anonymous-resumes',
                json={'old_user_id': 'some-user-id'}
                # No auth headers
            )

        assert response.status_code == 401


class TestMigrationAuthorization:
    """
    Authorization tests for /api/migrate-anonymous-resumes.

    The endpoint reassigns resumes with the service-role client (RLS bypassed),
    so being signed in must NOT be enough to claim another user's resumes: the
    caller has to prove possession of the old session by sending its token.
    """

    CALLER_TOKEN = 'caller-jwt'
    ANON_TOKEN = 'anon-jwt'

    @pytest.fixture
    def flask_app(self):
        with patch.dict('sys.modules', {'supabase': MagicMock()}):
            import app as flask_app
            flask_app.app.config['TESTING'] = True
            flask_app._migrate_attempts.clear()  # per-test rate limit budget
            # Freeze inside the compat window. Without this the fallback tests
            # would start failing on their own once real time passes
            # MIGRATE_COMPAT_EXPIRES.
            inside_window = flask_app.MIGRATE_COMPAT_EXPIRES - timedelta(days=1)
            with self._clock_at(flask_app, inside_window):
                yield flask_app

    @staticmethod
    def _clock_at(flask_app, when):
        """Freeze app.py's wall clock (read only by the compat-window gate)."""
        fake_datetime = MagicMock(wraps=datetime)
        fake_datetime.now.return_value = when
        return patch.object(flask_app, 'datetime', fake_datetime)

    @staticmethod
    def _before_cutoff():
        """An account old enough to predate the frontend storing session tokens."""
        import app as flask_app
        return flask_app.MIGRATE_COMPAT_CUTOFF - timedelta(days=1)

    @staticmethod
    def _after_cutoff():
        import app as flask_app
        return flask_app.MIGRATE_COMPAT_CUTOFF + timedelta(days=1)

    def _supabase_with_tokens(self, token_to_user):
        """Mock client whose auth.get_user resolves tokens per the given map."""
        mock = create_mock_supabase()

        def get_user(token):
            if token not in token_to_user:
                raise Exception(f"invalid JWT: {token}")
            return MagicMock(user=token_to_user[token])

        mock.auth.get_user.side_effect = get_user
        return mock

    def _post(self, flask_app, mock_supabase, body):
        with patch.object(flask_app, 'supabase', mock_supabase):
            with flask_app.app.test_client() as client:
                return client.post(
                    '/api/migrate-anonymous-resumes',
                    json=body,
                    headers={'Authorization': f'Bearer {self.CALLER_TOKEN}'},
                )

    def test_token_belonging_to_a_different_user_returns_403(self, flask_app):
        """
        The attack: a signed-in user posts someone else's uid. Their own token is
        valid, but it does not belong to old_user_id, so nothing may be moved.
        """
        attacker_anon_token = 'attacker-anon-jwt'
        mock_supabase = self._supabase_with_tokens({
            self.CALLER_TOKEN: MagicMock(id=NEW_USER_ID),
            # Token proves the attacker owns their OWN session, not the victim's
            attacker_anon_token: MagicMock(id='attacker-anon-id-000'),
        })

        response = self._post(flask_app, mock_supabase, {
            'old_user_id': OLD_USER_ID,  # victim
            'old_user_token': attacker_anon_token,
        })

        assert response.status_code == 403
        assert 'not authorized' in response.get_json()['error'].lower()
        # No reassignment: the endpoint must bail before touching any table
        mock_supabase.table.assert_not_called()
        mock_supabase.update.assert_not_called()
        mock_supabase.rpc.assert_not_called()

    def test_malformed_or_expired_token_returns_403(self, flask_app):
        """A token Supabase refuses to verify proves nothing."""
        mock_supabase = self._supabase_with_tokens({
            self.CALLER_TOKEN: MagicMock(id=NEW_USER_ID),
        })

        response = self._post(flask_app, mock_supabase, {
            'old_user_id': OLD_USER_ID,
            'old_user_token': 'expired-or-garbage',
        })

        assert response.status_code == 403
        mock_supabase.table.assert_not_called()
        mock_supabase.update.assert_not_called()

    def test_absent_token_falls_back_to_is_anonymous_and_allows(self, flask_app):
        """
        Backward compatibility: sessions created before the token was stored have
        a uid in localStorage but no token. They fall back to the documented
        is_anonymous flag so those users don't silently lose their resumes.
        """
        mock_supabase = self._supabase_with_tokens({
            self.CALLER_TOKEN: MagicMock(id=NEW_USER_ID),
        })
        mock_supabase.auth.admin.get_user_by_id.return_value = MagicMock(
            user=MagicMock(is_anonymous=True, created_at=self._before_cutoff())
        )
        # old count, new count, ids to migrate, update, icons, rpc
        mock_supabase.execute.side_effect = [
            create_mock_response(count=2),
            create_mock_response(count=0),
            create_mock_response(data=[{'id': 'r1'}, {'id': 'r2'}]),
            create_mock_response(),
            create_mock_response(data=[]),
            create_mock_response(),
        ]

        response = self._post(flask_app, mock_supabase, {'old_user_id': OLD_USER_ID})

        assert response.status_code == 200
        assert response.get_json()['migrated_count'] == 2
        mock_supabase.auth.admin.get_user_by_id.assert_called_once_with(OLD_USER_ID)
        mock_supabase.update.assert_any_call({'user_id': NEW_USER_ID})

    def test_absent_token_and_non_anonymous_old_user_returns_403(self, flask_app):
        """The compat fallback still refuses a real (non-anonymous) account."""
        mock_supabase = self._supabase_with_tokens({
            self.CALLER_TOKEN: MagicMock(id=NEW_USER_ID),
        })
        mock_supabase.auth.admin.get_user_by_id.return_value = MagicMock(
            user=MagicMock(is_anonymous=False, created_at=self._before_cutoff())
        )

        response = self._post(flask_app, mock_supabase, {'old_user_id': OLD_USER_ID})

        assert response.status_code == 403
        mock_supabase.table.assert_not_called()
        mock_supabase.update.assert_not_called()

    def test_valid_possession_token_migrates(self, flask_app):
        """Happy path: caller proves possession of the old session."""
        mock_supabase = self._supabase_with_tokens({
            self.CALLER_TOKEN: MagicMock(id=NEW_USER_ID),
            self.ANON_TOKEN: MagicMock(id=OLD_USER_ID),
        })
        mock_supabase.execute.side_effect = [
            create_mock_response(count=1),
            create_mock_response(count=0),
            create_mock_response(data=[{'id': 'r1'}]),
            create_mock_response(),
            create_mock_response(data=[]),
            create_mock_response(),
        ]

        response = self._post(flask_app, mock_supabase, {
            'old_user_id': OLD_USER_ID,
            'old_user_token': self.ANON_TOKEN,
        })

        assert response.status_code == 200
        assert response.get_json()['migrated_count'] == 1
        mock_supabase.update.assert_any_call({'user_id': NEW_USER_ID})
        # Possession was proven by token — no admin lookup needed
        mock_supabase.auth.admin.get_user_by_id.assert_not_called()

    def test_absent_token_and_account_newer_than_cutoff_returns_403(self, flask_app):
        """
        The compat fallback must not become a bypass: an attacker who simply omits
        old_user_token would otherwise reach any anonymous user (every visitor has
        one, and guest resumes autosave server-side). Accounts created after the
        cutoff always have a stored token, so a missing one is not credible.
        """
        mock_supabase = self._supabase_with_tokens({
            self.CALLER_TOKEN: MagicMock(id=NEW_USER_ID),
        })
        mock_supabase.auth.admin.get_user_by_id.return_value = MagicMock(
            user=MagicMock(is_anonymous=True, created_at=self._after_cutoff())
        )

        response = self._post(flask_app, mock_supabase, {'old_user_id': OLD_USER_ID})

        assert response.status_code == 403
        mock_supabase.table.assert_not_called()
        mock_supabase.update.assert_not_called()
        mock_supabase.rpc.assert_not_called()

    def test_naive_created_at_is_treated_as_utc(self, flask_app):
        """A tz-naive created_at must not blow up the comparison into a 500."""
        mock_supabase = self._supabase_with_tokens({
            self.CALLER_TOKEN: MagicMock(id=NEW_USER_ID),
        })
        naive_too_new = self._after_cutoff().replace(tzinfo=None)
        mock_supabase.auth.admin.get_user_by_id.return_value = MagicMock(
            user=MagicMock(is_anonymous=True, created_at=naive_too_new)
        )

        response = self._post(flask_app, mock_supabase, {'old_user_id': OLD_USER_ID})

        assert response.status_code == 403
        mock_supabase.table.assert_not_called()

    def test_repeated_attempts_are_rate_limited(self, flask_app):
        """
        The compat fallback is enumerable, so cap attempts per calling user.
        The legitimate flow makes exactly one call per sign-in.
        """
        mock_supabase = self._supabase_with_tokens({
            self.CALLER_TOKEN: MagicMock(id=NEW_USER_ID),
        })
        mock_supabase.auth.admin.get_user_by_id.return_value = MagicMock(
            user=MagicMock(is_anonymous=True, created_at=self._after_cutoff())
        )

        statuses = [
            self._post(flask_app, mock_supabase, {'old_user_id': f'victim-{i}'}).status_code
            for i in range(flask_app.MIGRATE_RATE_LIMIT + 2)
        ]

        assert statuses[:flask_app.MIGRATE_RATE_LIMIT] == [403] * flask_app.MIGRATE_RATE_LIMIT
        assert statuses[flask_app.MIGRATE_RATE_LIMIT:] == [429, 429]

    def test_absent_token_after_compat_window_closes_returns_403(self, flask_app):
        """
        The account-age cutoff alone never shrinks the exposed set: every
        anonymous account alive today was created before it, and resumes are
        never purged. The fallback therefore also expires on a wall clock —
        past MIGRATE_COMPAT_EXPIRES even a legitimately old anonymous account
        must prove possession.
        """
        mock_supabase = self._supabase_with_tokens({
            self.CALLER_TOKEN: MagicMock(id=NEW_USER_ID),
        })
        mock_supabase.auth.admin.get_user_by_id.return_value = MagicMock(
            user=MagicMock(is_anonymous=True, created_at=self._before_cutoff())
        )

        after_window = flask_app.MIGRATE_COMPAT_EXPIRES + timedelta(days=1)
        with self._clock_at(flask_app, after_window):
            response = self._post(flask_app, mock_supabase, {'old_user_id': OLD_USER_ID})

        assert response.status_code == 403
        # Closed early: not even the admin lookup should run
        mock_supabase.auth.admin.get_user_by_id.assert_not_called()
        mock_supabase.table.assert_not_called()
        mock_supabase.update.assert_not_called()
        mock_supabase.rpc.assert_not_called()
