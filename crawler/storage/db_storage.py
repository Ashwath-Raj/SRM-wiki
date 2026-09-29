import logging
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.models.all_models import (
    Page,
    Source,
    ChangeEvent,
    ReviewItem,
    Notice,
    Event,
)
from crawler.deduplication.hasher import compute_content_hash
from crawler.extractors.entity_extractor import EntityExtractor

logger = logging.getLogger("crawler.storage")


class DatabaseStorage:
    def __init__(self, db: Session):
        self.db = db

    def store_page(
        self,
        source: Source,
        url: str,
        title: str,
        description: str,
        content: str,
        status_code: int = 200,
    ) -> tuple[Page, bool]:
        """
        Stores or updates page content. Returns (page_record, is_changed).
        """
        content_hash = compute_content_hash(content)
        existing = self.db.query(Page).filter(Page.url == url).first()

        now = datetime.utcnow()
        if existing:
            # Change detection
            if existing.content_hash == content_hash:
                existing.last_crawled_at = now
                self.db.commit()
                return existing, False

            # Content has changed!
            existing.title = title
            existing.description = description
            existing.content = content
            existing.content_hash = content_hash
            existing.last_crawled_at = now
            existing.last_modified_at = now
            existing.status_code = status_code
            self.db.commit()

            # Record change event
            change = ChangeEvent(
                event_type="SOURCE_CHANGED",
                entity_type="Page",
                entity_id=existing.id,
                summary=f"Content updated on {source.name}: '{title or url}'",
                details={"url": url, "source_id": source.id},
                source_id=source.id,
            )
            self.db.add(change)
            self.db.commit()
            return existing, True
        else:
            # New page discovered
            page = Page(
                source_id=source.id,
                url=url,
                title=title,
                description=description,
                content=content,
                content_hash=content_hash,
                status_code=status_code,
                last_crawled_at=now,
                last_modified_at=now,
            )
            self.db.add(page)
            self.db.commit()
            self.db.refresh(page)

            # Classify page
            ptype = EntityExtractor.classify_page_type(url, title, content)
            if ptype in ["NOTICE", "EVENT"]:
                # Add to review queue for verification
                review = ReviewItem(
                    entity_type=ptype.lower(),
                    entity_id=page.id,
                    title=title or url,
                    raw_data={
                        "url": url,
                        "source_name": source.name,
                        "extracted_snippet": content[:300],
                        "source_type": source.source_type,
                    },
                    status="PENDING",
                    submitted_by=f"Crawler ({source.name})",
                    source_url=url,
                )
                self.db.add(review)

            # Record change event
            change = ChangeEvent(
                event_type="NEW_NOTICE" if ptype == "NOTICE" else ("NEW_EVENT" if ptype == "EVENT" else "SOURCE_CHANGED"),
                entity_type="Page",
                entity_id=page.id,
                summary=f"Discovered new {ptype.lower()}: '{title or url}' from {source.name}",
                details={"url": url, "source_id": source.id},
                source_id=source.id,
            )
            self.db.add(change)
            self.db.commit()

            return page, True
