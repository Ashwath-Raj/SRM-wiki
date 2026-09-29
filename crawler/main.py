import asyncio
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.database.session import SessionLocal
from backend.app.models.all_models import Source
from crawler.fetcher.fetcher import CrawlerFetcher
from crawler.parsers.html_parser import HTMLParser
from crawler.storage.db_storage import DatabaseStorage

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("crawler.runner")


class CrawlerRunner:
    def __init__(self, db: Optional[Session] = None):
        self.db = db or SessionLocal()
        self.fetcher = CrawlerFetcher()
        self.storage = DatabaseStorage(self.db)
        self.parser = HTMLParser()

    async def crawl_source(self, source: Source, max_pages: int = 5) -> Dict[str, Any]:
        logger.info(f"Starting crawl for source: {source.name} ({source.base_url})")
        queue = [source.base_url]
        visited = set()
        crawled_count = 0
        changed_count = 0

        while queue and crawled_count < max_pages:
            current_url = queue.pop(0)
            if current_url in visited:
                continue
            visited.add(current_url)

            status_code, html_content, content_type = await self.fetcher.fetch(current_url)
            if status_code != 200 or not html_content:
                continue

            parsed = self.parser.parse(html_content, current_url)
            page, is_changed = self.storage.store_page(
                source=source,
                url=current_url,
                title=parsed["title"],
                description=parsed["description"],
                content=parsed["content"],
                status_code=status_code,
            )
            crawled_count += 1
            if is_changed:
                changed_count += 1

            # Follow allowed child links
            for link in parsed["links"]:
                if link not in visited and link.startswith(source.base_url):
                    queue.append(link)

        source.last_crawled_at = datetime.utcnow()
        self.db.commit()

        return {
            "source_id": source.id,
            "source_name": source.name,
            "pages_crawled": crawled_count,
            "pages_changed": changed_count,
            "status": "COMPLETED",
        }

    async def run_all(self, max_pages_per_source: int = 3) -> List[Dict[str, Any]]:
        sources = self.db.query(Source).filter(Source.crawl_enabled.is_(True)).all()
        results = []
        for src in sources:
            try:
                res = await self.crawl_source(src, max_pages=max_pages_per_source)
                results.append(res)
            except Exception as e:
                logger.error(f"Error crawling {src.name}: {e}")
                results.append({
                    "source_id": src.id,
                    "source_name": src.name,
                    "error": str(e),
                    "status": "FAILED",
                })
        return results


async def main():
    runner = CrawlerRunner()
    results = await runner.run_all()
    print(f"Crawl finished. Results: {results}")


if __name__ == "__main__":
    asyncio.run(main())
