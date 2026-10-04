"""Input validation tests for /api/generate (session id, icon filenames)."""
import io
import uuid
from pathlib import Path
from unittest.mock import patch

import pytest

import app as app_module


@pytest.fixture
def flask_test_client():
    app_module.app.config["TESTING"] = True
    with app_module.app.test_client() as c:
        yield c

YAML = b"contact_info:\n  name: A\nsections: []\n"


def _post(client, session_id, icons=()):
    data = {
        "yaml_file": (io.BytesIO(YAML), "r.yml"),
        "template": "modern-with-icons",
        "session_id": session_id,
    }
    if icons:
        data["icons"] = list(icons)
    return client.post("/api/generate", data=data, content_type="multipart/form-data")


def _fake_send_file(*args, **kwargs):
    return "ok", 200


def _fake_dispatch(template, yaml_path, output_path, icons_dir, session_id):
    Path(output_path).write_bytes(b"%PDF-1.4 test")


def test_non_uuid_session_id_rejected_and_nothing_removed(flask_test_client, tmp_path):
    marker = tmp_path / "keep.txt"
    marker.write_text("x")
    with patch.object(app_module.shutil, "rmtree") as rm:
        resp = _post(flask_test_client, "../../" + str(tmp_path).replace("\\", "/"))
    assert resp.status_code == 400
    assert resp.get_json()["success"] is False
    assert not any("sessions" in str(c.args[0]) for c in rm.call_args_list)
    assert marker.exists()


def test_uuid_session_id_accepted(flask_test_client):
    with patch.object(app_module, "_dispatch_html_pdf_generation", _fake_dispatch),          patch.object(app_module, "send_file", _fake_send_file):
        resp = _post(flask_test_client, str(uuid.uuid4()))
    assert resp.status_code == 200


def test_legacy_session_id_format_accepted(flask_test_client):
    with patch.object(app_module, "_dispatch_html_pdf_generation", _fake_dispatch),          patch.object(app_module, "send_file", _fake_send_file):
        resp = _post(flask_test_client, "session-1728000000000-abc123xyz")
    assert resp.status_code == 200


def test_icon_with_parent_ref_is_skipped(flask_test_client):
    seen = []

    def dispatch(template, yaml_path, output_path, icons_dir, session_id):
        seen.append(sorted(p.name for p in Path(icons_dir).iterdir()))
        _fake_dispatch(template, yaml_path, output_path, icons_dir, session_id)

    icon = (io.BytesIO(b"png"), "../x.png")
    with patch.object(app_module, "_dispatch_html_pdf_generation", dispatch),          patch.object(app_module, "send_file", _fake_send_file):
        resp = _post(flask_test_client, str(uuid.uuid4()), icons=[icon])
    assert resp.status_code == 200
    assert "x.png" not in seen[0] and len(seen) == 1


def test_icon_keeps_exact_name(flask_test_client):
    seen = []

    def dispatch(template, yaml_path, output_path, icons_dir, session_id):
        seen.append(sorted(p.name for p in Path(icons_dir).iterdir()))
        _fake_dispatch(template, yaml_path, output_path, icons_dir, session_id)

    icon = (io.BytesIO(b"png"), "my icon é.png")
    with patch.object(app_module, "_dispatch_html_pdf_generation", dispatch),          patch.object(app_module, "send_file", _fake_send_file):
        resp = _post(flask_test_client, str(uuid.uuid4()), icons=[icon])
    assert resp.status_code == 200
    assert "my icon é.png" in seen[0]


def test_path_within_cases(tmp_path):
    assert app_module._path_within(tmp_path, "a.png") == tmp_path / "a.png"
    assert app_module._path_within(tmp_path, "a b.png") == tmp_path / "a b.png"
    for bad in ("../x", "/etc/x", "", "."):
        assert app_module._path_within(tmp_path, bad) is None
