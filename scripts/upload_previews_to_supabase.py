#!/usr/bin/env python3
"""
Upload generated preview images to Supabase Storage.

Uploads all WebP files from docs/templates/examples/ to the
'template-previews' Supabase storage bucket with CDN caching headers.

Usage:
    python scripts/upload_previews_to_supabase.py
    python scripts/upload_previews_to_supabase.py --slug software-engineer  # single file

Requires SUPABASE_URL and SUPABASE_SECRET_KEY environment variables.
"""

import argparse
import logging
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

PROJECT_ROOT = Path(__file__).parent.parent.resolve()
IMAGES_DIR = PROJECT_ROOT / "docs" / "templates" / "examples"
BUCKET_NAME = "template-previews"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


def upload_file(supabase, file_path: Path) -> str | None:
    """Upload a single WebP file to Supabase Storage. Returns public URL."""
    storage_path = file_path.name  # e.g. "software-engineer.webp"

    with open(file_path, "rb") as f:
        file_data = f.read()

    size_kb = len(file_data) / 1024
    log.info(f"  Uploading {storage_path} ({size_kb:.1f} KB)")

    supabase.storage.from_(BUCKET_NAME).upload(
        storage_path,
        file_data,
        file_options={
            "content-type": "image/webp",
            "upsert": "true",
            "cacheControl": "public, max-age=31536000, immutable",
        },
    )

    public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(storage_path)
    return public_url


def main():
    load_dotenv(PROJECT_ROOT / ".env")

    parser = argparse.ArgumentParser(description="Upload preview images to Supabase")
    parser.add_argument("--slug", help="Upload only this slug (e.g., 'software-engineer')")
    args = parser.parse_args()

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")

    if not supabase_url or not supabase_key:
        log.error("SUPABASE_URL and SUPABASE_SECRET_KEY must be set")
        sys.exit(1)

    supabase = create_client(supabase_url, supabase_key)

    # Ensure bucket exists (create if not)
    try:
        supabase.storage.get_bucket(BUCKET_NAME)
        log.info(f"Bucket '{BUCKET_NAME}' exists")
    except Exception:
        log.info(f"Creating public bucket '{BUCKET_NAME}'")
        supabase.storage.create_bucket(
            BUCKET_NAME,
            options={"public": True, "allowed_mime_types": ["image/webp"]},
        )

    if args.slug:
        files = [
            IMAGES_DIR / f"{args.slug}.webp",
            IMAGES_DIR / f"{args.slug}-sm.webp",
        ]
        files = [f for f in files if f.exists()]
        if not files:
            log.error(f"No WebP files found for slug: {args.slug}")
            sys.exit(1)
    else:
        files = sorted(IMAGES_DIR.glob("*.webp"))

    log.info(f"Found {len(files)} WebP files to upload")

    succeeded, failed = 0, 0
    for file_path in files:
        try:
            url = upload_file(supabase, file_path)
            log.info(f"  → {url}")
            succeeded += 1
        except Exception as e:
            log.error(f"  Failed: {e}")
            failed += 1

    log.info(f"Done: {succeeded} uploaded, {failed} failed")
    if failed:
        sys.exit(1)

    # Print the base URL for frontend config
    if succeeded > 0:
        sample_url = supabase.storage.from_(BUCKET_NAME).get_public_url("software-engineer.webp")
        base_url = sample_url.rsplit("/", 1)[0]
        log.info(f"\nBase URL for frontend: {base_url}")


if __name__ == "__main__":
    main()
