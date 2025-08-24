import os
import tempfile
import uuid
import requests
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def download_pdf_to_temp(url: str, timeout: int = 60) -> str:
    tmp_dir = tempfile.mkdtemp(prefix="pdf_")
    dest = Path(tmp_dir) / f"{uuid.uuid4().hex}.pdf"
    with requests.get(url, stream=True, timeout=timeout) as r:
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    f.write(chunk)
    logger.info(f"Downloaded PDF to {dest}")
    return str(dest)  # Return the local path to the PDF


def remove_temp_files(file_path: str):
    """Removes the temporary PDF file."""
    try:
        os.remove(file_path)
        logger.info(f"Removed temp file {file_path}")
    except Exception as e:
        logger.error(f"Error removing temp file {file_path}: {e}")
