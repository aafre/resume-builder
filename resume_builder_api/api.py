import importlib.metadata

import uvicorn
from fastapi import FastAPI

from resume_builder_api.routes import templates

try:
    # Get version from the installed package metadata
    version = importlib.metadata.version("resume-builder-api")
except importlib.metadata.PackageNotFoundError:
    # Fallback version if the package isn't installed yet
    version = "UNDEFINED"

app = FastAPI(
    title="Resume Builder API",
    description="API for Resume Builder",
    version=version,
    docs_url="/",
    redoc_url=None,
)

app.include_router(templates.router, prefix="/api", tags=["Templates"])


def main():
    uvicorn.run("resume_builder_api.api:app", host="0.0.0.0", port=5000, reload=True)


if __name__ == "__main__":
    main()
