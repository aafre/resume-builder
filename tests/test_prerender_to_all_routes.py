def test_prerender_to_all_allowlist_serves_non_bot_users(flask_test_client, monkeypatch, tmp_path):
    client, _, flask_app = flask_test_client

    static_dir = tmp_path / "static"
    prerender_dir = static_dir / "prerendered"
    allowlisted_route = "free-resume-builder-no-sign-up"

    static_dir.mkdir()
    (static_dir / "index.html").write_text(
        '<html><body><div id="root">SPA shell</div></body></html>',
        encoding="utf-8",
    )

    allowlisted_dir = prerender_dir / allowlisted_route
    allowlisted_dir.mkdir(parents=True)
    (allowlisted_dir / "index.html").write_text(
        (
            "<html><body>"
            '<main data-prerendered="true">'
            "<h1>Free Resume Builder No Sign Up</h1>"
            "</main>"
            "</body></html>"
        ),
        encoding="utf-8",
    )

    templates_dir = prerender_dir / "templates"
    templates_dir.mkdir(parents=True)
    (templates_dir / "index.html").write_text(
        '<html><body><main data-prerendered="true">Templates</main></body></html>',
        encoding="utf-8",
    )

    monkeypatch.setattr(flask_app.app, "static_folder", str(static_dir))
    monkeypatch.setattr(flask_app, "PRERENDER_DIR", str(prerender_dir))

    non_bot_headers = {"User-Agent": "Mozilla/5.0 PonytailTest"}

    allowlisted_response = client.get(f"/{allowlisted_route}", headers=non_bot_headers)
    assert allowlisted_response.status_code == 200
    assert b'data-prerendered="true"' in allowlisted_response.data

    shell_response = client.get("/templates", headers=non_bot_headers)
    assert shell_response.status_code == 200
    assert b"data-prerendered" not in shell_response.data
