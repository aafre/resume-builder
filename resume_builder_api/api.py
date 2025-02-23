import logging
import time
import importlib.metadata

import uvicorn
from fastapi import FastAPI, Request

from resume_builder_api.constants import MAX_REQUEST_SIZE
from resume_builder_api.routes import resume_generator, templates
from fastapi.middleware.cors import CORSMiddleware

try:
    # Get version from the installed package metadata
    version = importlib.metadata.version("resume-builder-api")
except importlib.metadata.PackageNotFoundError:
    # Fallback version if the package isn't installed yet
    version = "UNDEFINED"

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Resume Builder API",
    description="API for Resume Builder",
    version=version,
    docs_url="/",
    redoc_url=None,
    max_body_size=MAX_REQUEST_SIZE,
)

logger.info("Starting FastAPI app")

app.include_router(templates.router, prefix="/api", tags=["Templates"])
app.include_router(resume_generator.router, prefix="/api", tags=["Resume Generator"])


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter_ns()
    response = await call_next(request)
    process_time = time.perf_counter_ns() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


def main():
    uvicorn.run("resume_builder_api.api:app", host="0.0.0.0", port=5000, reload=True)


if __name__ == "__main__":
    main()
