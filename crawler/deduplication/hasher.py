import hashlib


def compute_content_hash(content: str) -> str:
    """
    Computes a deterministic SHA-256 hash of normalized text content.
    """
    if not content:
        return ""
    # Normalize whitespace before hashing
    normalized = " ".join(content.split()).strip().lower()
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()
