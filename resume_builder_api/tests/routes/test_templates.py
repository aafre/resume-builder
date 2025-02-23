from fastapi.testclient import TestClient


def test_get_templates(client: TestClient):
    """
    Test GET /api/templates returns a list of templates with the expected fields.
    """
    response = client.get("/api/templates")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    templates = data["templates"]
    assert isinstance(templates, list)
    # Expecting two templates as defined in our meta.yml
    assert len(templates) == 2
    ids = [tmpl["id"] for tmpl in templates]
    assert "modern-with-icons" in ids
    assert "modern-no-icons" in ids


def test_get_template_data_valid(client: TestClient):
    """
    Test GET /api/template/{template_id} returns the YAML content and metadata for a valid template.
    """
    response = client.get("/api/template/modern-with-icons")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "yaml" in data
    assert data["template_id"] == "modern-with-icons"
    assert "supportsIcons" in data


def test_get_template_data_not_found(client: TestClient):
    """
    Test GET /api/template/{template_id} returns a 404 for a non-existent template.
    """
    response = client.get("/api/template/non-existent")
    assert response.status_code == 404
    data = response.json()
    # FastAPI returns error details under "detail"
    assert data["detail"] == "Template not found"


def test_download_template_valid(client: TestClient):
    """
    Test GET /api/template/{template_id}/download returns the YAML file for a valid template.
    """
    response = client.get("/api/template/modern-no-icons/download")
    assert response.status_code == 200
    # Check the content type and disposition header
    assert response.headers["content-type"] == "application/x-yaml"
    assert "attachment" in response.headers.get("content-disposition", "")


def test_download_template_not_found(client: TestClient):
    """
    Test GET /api/template/{template_id}/download returns a 404 for a non-existent template.
    """
    response = client.get("/api/template/non-existent/download")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Template not found"


def test_get_template_image_valid(client: TestClient):
    """
    Test GET /api/template/{template_id}/image returns the image for a valid template.
    """
    response = client.get("/api/template/modern-with-icons/image")
    assert response.status_code == 200
    # Check that the response is an image; content-type should include "image"
    assert "image" in response.headers["content-type"]


def test_get_template_image_not_found(client: TestClient):
    """
    Test GET /api/template/{template_id}/image returns 404 for a non-existent template.
    """
    response = client.get("/api/template/non-existent/image")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Template not found"
