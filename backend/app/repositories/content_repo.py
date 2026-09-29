from typing import List, Optional, Tuple, Dict, Any
from datetime import datetime, date
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc, func
from backend.app.models.all_models import (
    Source,
    Page,
    Portal,
    Event,
    Notice,
    Project,
    Organization,
    Opportunity,
    Document,
    DocumentChunk,
    ChangeEvent,
    ReviewItem,
)


class ContentRepository:
    def __init__(self, db: Session):
        self.db = db

    # Sources
    def get_sources(self, skip: int = 0, limit: int = 100) -> List[Source]:
        return self.db.query(Source).offset(skip).limit(limit).all()

    def get_source_by_id(self, source_id: str) -> Optional[Source]:
        return self.db.query(Source).filter(Source.id == source_id).first()

    def create_source(self, data: dict) -> Source:
        source = Source(**data)
        self.db.add(source)
        self.db.commit()
        self.db.refresh(source)
        return source

    # Portals
    def get_portals(self, category: Optional[str] = None, quick_only: bool = False) -> List[Portal]:
        query = self.db.query(Portal).filter(Portal.verification_status == "VERIFIED")
        if category and category.lower() != "all":
            query = query.filter(func.lower(Portal.category) == category.lower())
        if quick_only:
            query = query.filter(Portal.is_quick_access.is_(True))
        return query.order_by(Portal.name.asc()).all()

    def get_portal_by_slug(self, slug: str) -> Optional[Portal]:
        return self.db.query(Portal).filter(Portal.slug == slug).first()

    # Events
    def get_events(
        self,
        category: Optional[str] = None,
        status: Optional[str] = None,
        upcoming_only: bool = False,
        today_only: bool = False,
        limit: int = 50,
        skip: int = 0,
    ) -> List[Event]:
        query = self.db.query(Event).filter(Event.verification_status == "VERIFIED")
        now = datetime.utcnow()

        if category and category.lower() != "all":
            query = query.filter(func.lower(Event.category) == category.lower())

        if status:
            query = query.filter(Event.status == status.upper())

        if today_only:
            # Events whose date matches today or currently LIVE NOW
            today_start = datetime(now.year, now.month, now.day)
            today_end = datetime(now.year, now.month, now.day, 23, 59, 59)
            query = query.filter(
                or_(
                    Event.status == "LIVE NOW",
                    Event.status == "ONGOING",
                    (Event.start_time >= today_start) & (Event.start_time <= today_end),
                )
            )
        elif upcoming_only:
            query = query.filter(
                or_(
                    Event.start_time >= now,
                    Event.status == "LIVE NOW",
                    Event.status == "ONGOING",
                )
            )

        return query.order_by(Event.start_time.asc()).offset(skip).limit(limit).all()

    def get_event_by_slug(self, slug: str) -> Optional[Event]:
        return self.db.query(Event).filter(Event.slug == slug).first()

    # Notices
    def get_notices(
        self,
        category: Optional[str] = None,
        priority: Optional[str] = None,
        limit: int = 50,
        skip: int = 0,
    ) -> List[Notice]:
        query = self.db.query(Notice).filter(Notice.verification_status == "VERIFIED", Notice.status == "ACTIVE")
        if category and category.lower() != "all":
            query = query.filter(func.lower(Notice.category) == category.lower())
        if priority and priority.lower() != "all":
            query = query.filter(Notice.priority == priority.upper())
        return query.order_by(desc(Notice.published_at)).offset(skip).limit(limit).all()

    def get_notice_by_slug(self, slug: str) -> Optional[Notice]:
        return self.db.query(Notice).filter(Notice.slug == slug).first()

    # Projects
    def get_projects(
        self,
        department: Optional[str] = None,
        technology: Optional[str] = None,
        limit: int = 50,
        skip: int = 0,
    ) -> List[Project]:
        query = self.db.query(Project).filter(Project.verification_status == "VERIFIED")
        if department and department.lower() != "all":
            query = query.filter(func.lower(Project.department) == department.lower())
        return query.order_by(desc(Project.created_at)).offset(skip).limit(limit).all()

    def get_project_by_slug(self, slug: str) -> Optional[Project]:
        return self.db.query(Project).filter(Project.slug == slug).first()

    # Organizations
    def get_organizations(self, type_filter: Optional[str] = None) -> List[Organization]:
        query = self.db.query(Organization).filter(Organization.verification_status == "VERIFIED")
        if type_filter and type_filter.lower() != "all":
            query = query.filter(func.lower(Organization.type) == type_filter.lower())
        return query.order_by(Organization.name.asc()).all()

    def get_organization_by_slug(self, slug: str) -> Optional[Organization]:
        return self.db.query(Organization).filter(Organization.slug == slug).first()

    # Opportunities
    def get_opportunities(self, type_filter: Optional[str] = None, active_only: bool = True) -> List[Opportunity]:
        query = self.db.query(Opportunity).filter(Opportunity.verification_status == "VERIFIED")
        if active_only:
            query = query.filter(Opportunity.status == "ACTIVE")
        if type_filter and type_filter.lower() != "all":
            query = query.filter(func.lower(Opportunity.type) == type_filter.lower())
        return query.order_by(Opportunity.deadline.asc()).all()

    def get_opportunity_by_slug(self, slug: str) -> Optional[Opportunity]:
        return self.db.query(Opportunity).filter(Opportunity.slug == slug).first()

    # Documents
    def get_documents(self, doc_type: Optional[str] = None) -> List[Document]:
        query = self.db.query(Document).filter(Document.verification_status == "VERIFIED")
        if doc_type and doc_type.lower() != "all":
            query = query.filter(func.lower(Document.document_type) == doc_type.lower())
        return query.order_by(desc(Document.published_at)).all()

    def get_document_by_slug(self, slug: str) -> Optional[Document]:
        return self.db.query(Document).filter(Document.slug == slug).first()

    # Change Events
    def get_recent_changes(self, limit: int = 15) -> List[ChangeEvent]:
        return self.db.query(ChangeEvent).order_by(desc(ChangeEvent.created_at)).limit(limit).all()

    def add_change_event(self, event_type: str, entity_type: str, entity_id: str, summary: str, details: dict = None, source_id: str = None) -> ChangeEvent:
        event = ChangeEvent(
            event_type=event_type,
            entity_type=entity_type,
            entity_id=entity_id,
            summary=summary,
            details=details or {},
            source_id=source_id,
        )
        self.db.add(event)
        self.db.commit()
        return event

    # Review Items
    def get_review_items(self, status: str = "PENDING") -> List[ReviewItem]:
        return self.db.query(ReviewItem).filter(ReviewItem.status == status.upper()).order_by(desc(ReviewItem.created_at)).all()

    def create_review_item(self, entity_type: str, title: str, raw_data: dict, submitted_by: str, source_url: str = None) -> ReviewItem:
        item = ReviewItem(
            entity_type=entity_type,
            title=title,
            raw_data=raw_data,
            status="PENDING",
            submitted_by=submitted_by,
            source_url=source_url,
        )
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
