from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.repositories.content_repo import ContentRepository
from backend.app.services.search_service import SearchService
from backend.app.services.pulse_service import PulseService
from backend.app.services.ai_service import AIService
from backend.app.schemas.all_schemas import (
    PortalSchema,
    EventSchema,
    NoticeSchema,
    ProjectSchema,
    OrganizationSchema,
    OpportunitySchema,
    DocumentSchema,
    PulseResponse,
    SearchResponse,
    AIChatRequest,
    AIChatResponse,
    ReviewItemCreate,
    ReviewItemSchema,
)

router = APIRouter()


# 1. Global Search
@router.get("/search", response_model=SearchResponse)
def search_knowledge_base(
    q: str = Query("", description="Search keywords"),
    category: Optional[str] = Query(None, description="Category filter (portals, events, notices, projects, organizations, documents, opportunities)"),
    source_type: Optional[str] = Query(None, description="Source type (OFFICIAL, DEPARTMENT, ORGANIZATION, STUDENT, COMMUNITY)"),
    department: Optional[str] = Query(None, description="Department filter"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    service = SearchService(db)
    return service.search(
        query=q,
        category=category,
        source_type=source_type,
        department=department,
        page=page,
        limit=limit,
    )


# 2. SRM AP Pulse
@router.get("/pulse", response_model=PulseResponse)
def get_pulse_feed(db: Session = Depends(get_db)):
    service = PulseService(db)
    return service.get_pulse_data()


# 3. AI Assistant
@router.post("/ai/chat", response_model=AIChatResponse)
def chat_with_ai(request: AIChatRequest, db: Session = Depends(get_db)):
    service = AIService(db)
    return service.chat(request)


# 4. Portals
@router.get("/portals", response_model=List[PortalSchema])
def list_portals(
    category: Optional[str] = Query(None),
    quick_only: bool = Query(False),
    db: Session = Depends(get_db),
):
    repo = ContentRepository(db)
    return repo.get_portals(category=category, quick_only=quick_only)


@router.get("/portals/{slug}", response_model=PortalSchema)
def get_portal(slug: str, db: Session = Depends(get_db)):
    repo = ContentRepository(db)
    portal = repo.get_portal_by_slug(slug)
    if not portal:
        raise HTTPException(status_code=404, detail="Portal not found")
    return portal


# 5. Events
@router.get("/events", response_model=List[EventSchema])
def list_events(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    upcoming_only: bool = Query(False),
    today_only: bool = Query(False),
    limit: int = Query(50, le=100),
    skip: int = Query(0),
    db: Session = Depends(get_db),
):
    repo = ContentRepository(db)
    return repo.get_events(
        category=category,
        status=status,
        upcoming_only=upcoming_only,
        today_only=today_only,
        limit=limit,
        skip=skip,
    )


@router.get("/events/{slug}", response_model=EventSchema)
def get_event(slug: str, db: Session = Depends(get_db)):
    repo = ContentRepository(db)
    event = repo.get_event_by_slug(slug)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


# 6. Notices
@router.get("/notices", response_model=List[NoticeSchema])
def list_notices(
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    skip: int = Query(0),
    db: Session = Depends(get_db),
):
    repo = ContentRepository(db)
    return repo.get_notices(category=category, priority=priority, limit=limit, skip=skip)


@router.get("/notices/{slug}", response_model=NoticeSchema)
def get_notice(slug: str, db: Session = Depends(get_db)):
    repo = ContentRepository(db)
    notice = repo.get_notice_by_slug(slug)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    return notice


# 7. Projects
@router.get("/projects", response_model=List[ProjectSchema])
def list_projects(
    department: Optional[str] = Query(None),
    technology: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    skip: int = Query(0),
    db: Session = Depends(get_db),
):
    repo = ContentRepository(db)
    return repo.get_projects(department=department, technology=technology, limit=limit, skip=skip)


@router.get("/projects/{slug}", response_model=ProjectSchema)
def get_project(slug: str, db: Session = Depends(get_db)):
    repo = ContentRepository(db)
    project = repo.get_project_by_slug(slug)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# 8. Organizations
@router.get("/organizations", response_model=List[OrganizationSchema])
def list_organizations(
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    repo = ContentRepository(db)
    return repo.get_organizations(type_filter=type)


@router.get("/organizations/{slug}", response_model=OrganizationSchema)
def get_organization(slug: str, db: Session = Depends(get_db)):
    repo = ContentRepository(db)
    org = repo.get_organization_by_slug(slug)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


# 9. Opportunities
@router.get("/opportunities", response_model=List[OpportunitySchema])
def list_opportunities(
    type: Optional[str] = Query(None),
    active_only: bool = Query(True),
    db: Session = Depends(get_db),
):
    repo = ContentRepository(db)
    return repo.get_opportunities(type_filter=type, active_only=active_only)


@router.get("/opportunities/{slug}", response_model=OpportunitySchema)
def get_opportunity(slug: str, db: Session = Depends(get_db)):
    repo = ContentRepository(db)
    opp = repo.get_opportunity_by_slug(slug)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opp


# 10. Documents
@router.get("/documents", response_model=List[DocumentSchema])
def list_documents(
    doc_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    repo = ContentRepository(db)
    return repo.get_documents(doc_type=doc_type)


@router.get("/documents/{slug}", response_model=DocumentSchema)
def get_document(slug: str, db: Session = Depends(get_db)):
    repo = ContentRepository(db)
    doc = repo.get_document_by_slug(slug)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


# 11. User Submissions (Sent to Review Queue)
@router.post("/submit", response_model=ReviewItemSchema, status_code=status.HTTP_201_CREATED)
def submit_item(payload: ReviewItemCreate, db: Session = Depends(get_db)):
    repo = ContentRepository(db)
    item = repo.create_review_item(
        entity_type=payload.entity_type,
        title=payload.title,
        raw_data=payload.raw_data,
        submitted_by=payload.submitted_by,
        source_url=payload.source_url,
    )
    return item
