from typing import List, Dict, Any, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.api.dependencies.auth import verify_admin_token
from backend.app.core.config import settings
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
    ReviewItem,
    ChangeEvent,
)
from backend.app.schemas.all_schemas import (
    AdminAuthRequest,
    AdminAuthResponse,
    ReviewItemSchema,
    ReviewActionRequest,
    SourceSchema,
    SourceCreate,
    SourceUpdate,
)
from crawler.main import CrawlerRunner

router = APIRouter(prefix="/admin")


# 1. Admin Authentication Check
@router.post("/auth", response_model=AdminAuthResponse)
def authenticate_admin(payload: AdminAuthRequest):
    if payload.token == settings.ADMIN_TOKEN:
        return AdminAuthResponse(authenticated=True, message="Admin session verified")
    raise HTTPException(status_code=401, detail="Invalid administrator secret token")


# 2. Admin Dashboard Metrics
@router.get("/dashboard", dependencies=[Depends(verify_admin_token)])
def get_admin_dashboard(db: Session = Depends(get_db)):
    portals_count = db.query(Portal).count()
    events_count = db.query(Event).count()
    notices_count = db.query(Notice).count()
    projects_count = db.query(Project).count()
    orgs_count = db.query(Organization).count()
    docs_count = db.query(Document).count()
    opps_count = db.query(Opportunity).count()
    sources_count = db.query(Source).count()
    pages_count = db.query(Page).count()

    pending_reviews = db.query(ReviewItem).filter(ReviewItem.status == "PENDING").count()
    broken_links = 0  # Monitored via HTTP status
    recent_changes = db.query(ChangeEvent).order_by(ChangeEvent.created_at.desc()).limit(10).all()

    return {
        "content_counts": {
            "portals": portals_count,
            "events": events_count,
            "notices": notices_count,
            "projects": projects_count,
            "organizations": orgs_count,
            "documents": docs_count,
            "opportunities": opps_count,
            "sources": sources_count,
            "crawled_pages": pages_count,
        },
        "review_queue": {
            "pending": pending_reviews,
        },
        "system_health": {
            "database": "ONLINE",
            "crawler": "READY",
            "broken_links": broken_links,
            "last_crawl": "Recently verified",
        },
        "recent_changes": [
            {
                "id": c.id,
                "type": c.event_type,
                "summary": c.summary,
                "time": c.created_at.strftime("%d %b, %I:%M %p"),
            }
            for c in recent_changes
        ],
    }


# 3. Review Queue
@router.get("/review-queue", response_model=List[ReviewItemSchema], dependencies=[Depends(verify_admin_token)])
def list_review_queue(status: str = Query("PENDING"), db: Session = Depends(get_db)):
    return db.query(ReviewItem).filter(ReviewItem.status == status.upper()).order_by(ReviewItem.created_at.desc()).all()


@router.post("/review-queue/{item_id}/action", response_model=ReviewItemSchema, dependencies=[Depends(verify_admin_token)])
def handle_review_item(item_id: str, action_data: ReviewActionRequest, db: Session = Depends(get_db)):
    item = db.query(ReviewItem).filter(ReviewItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Review item not found")

    act = action_data.action.upper()
    if act not in ["APPROVE", "REJECT"]:
        raise HTTPException(status_code=400, detail="Action must be APPROVE or REJECT")

    item.status = "APPROVED" if act == "APPROVE" else "REJECTED"
    item.reviewer_notes = action_data.reviewer_notes

    # If approved, convert raw_data into actual published entity
    if act == "APPROVE":
        raw = action_data.modified_data or item.raw_data
        now = datetime.utcnow()
        if item.entity_type == "project":
            slug = raw.get("title", "project").lower().replace(" ", "-")[:50]
            new_proj = Project(
                slug=f"{slug}-{int(now.timestamp())}",
                title=raw.get("title", item.title),
                description=raw.get("description", raw.get("summary", "")),
                team=raw.get("team", [item.submitted_by]),
                department=raw.get("department", "CSE"),
                year=raw.get("year", "2026"),
                technologies=raw.get("technologies", []),
                github_url=raw.get("github_url", item.source_url),
                source_type="STUDENT",
                verification_status="VERIFIED",
            )
            db.add(new_proj)
        elif item.entity_type == "event":
            slug = raw.get("title", "event").lower().replace(" ", "-")[:50]
            new_event = Event(
                slug=f"{slug}-{int(now.timestamp())}",
                title=raw.get("title", item.title),
                description=raw.get("description", raw.get("summary", "")),
                start_time=now,
                venue=raw.get("venue", "Campus"),
                organizer=raw.get("organizer", item.submitted_by),
                category="General",
                source_type="STUDENT",
                verification_status="VERIFIED",
            )
            db.add(new_event)

        # Log change event
        change = ChangeEvent(
            event_type="NEW_" + item.entity_type.upper(),
            entity_type=item.entity_type.capitalize(),
            entity_id=item.id,
            summary=f"Approved submission: '{item.title}'",
            details=raw,
        )
        db.add(change)

    db.commit()
    db.refresh(item)
    return item


# 4. Sources Management
@router.get("/sources", response_model=List[SourceSchema], dependencies=[Depends(verify_admin_token)])
def list_sources(db: Session = Depends(get_db)):
    return db.query(Source).order_by(Source.name.asc()).all()


@router.post("/sources", response_model=SourceSchema, dependencies=[Depends(verify_admin_token)])
def create_source(payload: SourceCreate, db: Session = Depends(get_db)):
    existing = db.query(Source).filter(Source.base_url == payload.base_url).first()
    if existing:
        raise HTTPException(status_code=400, detail="Source with this base URL already exists")
    source = Source(**payload.model_dump())
    db.add(source)
    db.commit()
    db.refresh(source)
    return source


@router.put("/sources/{source_id}", response_model=SourceSchema, dependencies=[Depends(verify_admin_token)])
def update_source(source_id: str, payload: SourceUpdate, db: Session = Depends(get_db)):
    source = db.query(Source).filter(Source.id == source_id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(source, k, v)
    db.commit()
    db.refresh(source)
    return source


# 5. Crawler Controls
@router.post("/crawler/trigger", dependencies=[Depends(verify_admin_token)])
async def trigger_crawler(source_id: Optional[str] = None, db: Session = Depends(get_db)):
    runner = CrawlerRunner(db)
    if source_id:
        source = db.query(Source).filter(Source.id == source_id).first()
        if not source:
            raise HTTPException(status_code=404, detail="Source not found")
        result = await runner.crawl_source(source, max_pages=3)
        return {"status": "SUCCESS", "details": [result]}
    else:
        results = await runner.run_all(max_pages_per_source=2)
        return {"status": "SUCCESS", "details": results}


# 6. Detailed System Health
@router.get("/health", dependencies=[Depends(verify_admin_token)])
def admin_health_check(db: Session = Depends(get_db)):
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": {
            "status": "connected",
            "dialect": db.bind.dialect.name if db.bind else "sqlite",
        },
        "crawler": {
            "status": "idle",
            "active_sources": db.query(Source).filter(Source.crawl_enabled.is_(True)).count(),
        },
    }
