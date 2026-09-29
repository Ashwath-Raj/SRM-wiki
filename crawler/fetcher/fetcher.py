import httpx
import logging
from urllib.parse import urlparse
from typing import Optional, Tuple
from backend.app.core.config import settings

logger = logging.getLogger("crawler.fetcher")

# SRM AP Allowlisted Domains
ALLOWLISTED_DOMAINS = [
    "srmap.edu.in",
    "www.srmap.edu.in",
    "nexttechlab.io",
    "srmap.acm.org",
    "gdg.community.dev",
]


class CrawlerFetcher:
    def __init__(self, user_agent: Optional[str] = None, timeout: float = 10.0):
        self.user_agent = user_agent or settings.CRAWLER_USER_AGENT
        self.timeout = timeout
        self.headers = {
            "User-Agent": self.user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        }

    def is_url_allowed(self, url: str) -> bool:
        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
            if not domain:
                return False
            # Check against allowlist
            for allowed in ALLOWLISTED_DOMAINS:
                if domain == allowed or domain.endswith("." + allowed):
                    return True
            return False
        except Exception:
            return False

    async def fetch(self, url: str) -> Tuple[int, Optional[str], Optional[str]]:
        """
        Fetches the URL and returns (status_code, content_text, content_type)
        """
        if not self.is_url_allowed(url):
            logger.warning(f"URL domain not in allowlist: {url}")
            return 403, None, None

        try:
            async with httpx.AsyncClient(headers=self.headers, follow_redirects=True, timeout=self.timeout) as client:
                response = await client.get(url)
                content_type = response.headers.get("content-type", "")
                return response.status_code, response.text, content_type
        except Exception as e:
            logger.error(f"Error fetching URL {url}: {e}")
            return 500, None, None
