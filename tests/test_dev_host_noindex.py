import pytest


@pytest.mark.parametrize(
    "host,expected",
    [
        ("dev.easyfreeresume.com", "noindex, nofollow"),
        ("resume-api-abc123.a.run.app", "noindex, nofollow"),
        ("easyfreeresume.com", None),
    ],
)
def test_x_robots_tag_by_host(flask_test_client, host, expected):
    client, _, _ = flask_test_client
    resp = client.get("/api/templates", base_url=f"https://{host}")
    assert resp.headers.get("X-Robots-Tag") == expected


def test_dev_host_overrides_route_noindex_follow(flask_test_client):
    client, _, _ = flask_test_client
    resp = client.get("/jobs", base_url="https://dev.easyfreeresume.com")
    assert resp.headers.get("X-Robots-Tag") == "noindex, nofollow"
