"""
/api/jobs/suggest-roles endpoint (#836): must send the x-internal-key header
to the suggest-roles Supabase Edge Function, and degrade gracefully (no
invoke call) when INTERNAL_FN_KEY is unset.
"""
import json
import os
from unittest.mock import patch

import pytest


@pytest.fixture(autouse=True)
def _internal_key_env():
    import app as flask_app
    flask_app._suggestion_cache.clear()
    with patch.dict(os.environ, {"INTERNAL_FN_KEY": "test-internal-key"}):
        yield
    flask_app._suggestion_cache.clear()


def post_suggest(client, **body):
    return client.post("/api/jobs/suggest-roles", json=body)


def test_sends_internal_key_header(flask_test_client):
    client, mock_sb, _ = flask_test_client
    mock_sb.functions.invoke.return_value = json.dumps({
        "success": True,
        "primary_role": "Software Engineer",
        "alternative_roles": ["Backend Developer"],
        "confidence": 80,
    }).encode("utf-8")

    resp = post_suggest(client, title="Software Engineer")

    assert resp.status_code == 200
    body = resp.get_json()
    assert body["primary_role"] == "Software Engineer"
    _, kwargs = mock_sb.functions.invoke.call_args
    assert kwargs["invoke_options"]["headers"] == {"x-internal-key": "test-internal-key"}


def test_degrades_gracefully_when_key_unset(flask_test_client):
    client, mock_sb, _ = flask_test_client
    with patch.dict(os.environ, {}, clear=False):
        os.environ.pop("INTERNAL_FN_KEY", None)
        resp = post_suggest(client, title="Software Engineer")

    assert resp.status_code == 200
    body = resp.get_json()
    assert body == {
        "success": True,
        "primary_role": "Software Engineer",
        "alternative_roles": [],
        "confidence": 0,
    }
    mock_sb.functions.invoke.assert_not_called()
