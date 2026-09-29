from urllib.parse import urlparse, urlunparse, urljoin
import re


def normalize_url(url: str, base_url: str = "") -> str:
    """
    Normalizes a URL:
    - Resolves relative links against base_url
    - Converts scheme and domain to lowercase
    - Removes fragments (#section)
    - Strips trailing slash if path != '/'
    - Strips common tracking parameters (utm_*, ref, etc.)
    """
    if base_url and not url.startswith(("http://", "https://")):
        url = urljoin(base_url, url)

    parsed = urlparse(url)
    scheme = parsed.scheme.lower()
    netloc = parsed.netloc.lower()
    path = parsed.path or "/"

    # Normalize path: remove multiple slashes
    path = re.sub(r"/+", "/", path)
    if len(path) > 1 and path.endswith("/"):
        path = path[:-1]

    # Clean query params: remove tracking params
    query = parsed.query
    if query:
        params = [p for p in query.split("&") if not p.lower().startswith(("utm_", "fbclid", "gclid", "ref="))]
        query = "&".join(params)

    return urlunparse((scheme, netloc, path, parsed.params, query, ""))
