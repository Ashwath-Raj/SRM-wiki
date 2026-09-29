from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


# Base model with orm_mode enabled
class ORMBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# Source Schemas
class SourceBase(BaseModel):
    name: str
    base_url: str
    source_type: str = "OFFICIAL"
    description: Optional[str] = None
    crawl_enabled: bool = True
    crawl_frequency: str = "DAILY"
    allowed_paths: List[str] = Field(default_factory=list)
    blocked_paths: List[str] = Field(default_factory=list)
    verification_status: str = "VERIFIED"


class SourceCreate(SourceBase):
    pass


class SourceUpdate(BaseModel):
    name: Optional[str] = None
    base_url: Optional[str] = None
    source_type: Optional[str] = None
    description: Optional[str] = None
    crawl_enabled: Optional[bool] = None
    crawl_frequency: Optional[str] = None
    allowed_paths: Optional[List[str]] = None
    blocked_paths: Optional[List[str]] = None
    verification_status: Optional[str] = None


class SourceSchema(SourceBase, ORMBase):
    id: str
    last_crawled_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


# Portal Schemas
class PortalBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    url: str
    category: str = "Academic"
    icon: str = "external-link"
    is_quick_access: bool = False
    source_id: Optional[str] = None
    source_type: str = "OFFICIAL"
    verification_status: str = "VERIFIED"


class PortalCreate(PortalBase):
    pass


class PortalSchema(PortalBase, ORMBase):
    id: str
    last_verified_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


# Event Schemas
class EventBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    venue: Optional[str] = None
    organizer: Optional[str] = None
    category: str = "Technical"
    registration_url: Optional[str] = None
    source_id: Optional[str] = None
    source_type: str = "OFFICIAL"
    source_url: Optional[str] = None
    verification_status: str = "VERIFIED"
    status: str = "UPCOMING"


class EventCreate(EventBase):
    pass


class EventSchema(EventBase, ORMBase):
    id: str
    created_at: datetime
    updated_at: datetime


# Notice Schemas
class NoticeBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    category: str = "General"
    priority: str = "NORMAL"
    published_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    source_id: Optional[str] = None
    source_type: str = "OFFICIAL"
    source_url: Optional[str] = None
    document_id: Optional[str] = None
    verification_status: str = "VERIFIED"
    status: str = "ACTIVE"


class NoticeCreate(NoticeBase):
    pass


class NoticeSchema(NoticeBase, ORMBase):
    id: str
    created_at: datetime
    updated_at: datetime


# Project Schemas
class ProjectBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    team: List[str] = Field(default_factory=list)
    department: str = "CSE"
    year: str = "2026"
    technologies: List[str] = Field(default_factory=list)
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    documentation_url: Optional[str] = None
    organization_id: Optional[str] = None
    organization_name: Optional[str] = None
    source_id: Optional[str] = None
    source_type: str = "STUDENT"
    verification_status: str = "VERIFIED"


class ProjectCreate(ProjectBase):
    pass


class ProjectSchema(ProjectBase, ORMBase):
    id: str
    created_at: datetime
    updated_at: datetime


# Organization Schemas
class OrganizationBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    type: str = "CLUB"
    department: Optional[str] = None
    website_url: Optional[str] = None
    social_links: Dict[str, Any] = Field(default_factory=dict)
    contact: Optional[str] = None
    logo_url: Optional[str] = None
    source_id: Optional[str] = None
    source_type: str = "ORGANIZATION"
    verification_status: str = "VERIFIED"


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationSchema(OrganizationBase, ORMBase):
    id: str
    created_at: datetime
    updated_at: datetime


# Opportunity Schemas
class OpportunityBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    company: Optional[str] = None
    type: str = "INTERNSHIP"
    deadline: Optional[datetime] = None
    eligibility: Optional[str] = None
    apply_url: Optional[str] = None
    source_id: Optional[str] = None
    source_type: str = "OFFICIAL"
    source_url: Optional[str] = None
    verification_status: str = "VERIFIED"
    status: str = "ACTIVE"


class OpportunityCreate(OpportunityBase):
    pass


class OpportunitySchema(OpportunityBase, ORMBase):
    id: str
    created_at: datetime
    updated_at: datetime


# Document Schemas
class DocumentChunkSchema(ORMBase):
    id: str
    chunk_index: int
    content: str
    section: Optional[str] = None
    page_number: int = 1
    metadata_json: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime


class DocumentBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    document_type: str = "REGULATION"
    file_url: str
    source_url: Optional[str] = None
    source_id: Optional[str] = None
    source_type: str = "OFFICIAL"
    published_at: Optional[datetime] = None
    content_hash: Optional[str] = None
    page_count: int = 1
    extracted_text: Optional[str] = None
    verification_status: str = "VERIFIED"


class DocumentCreate(DocumentBase):
    pass


class DocumentSchema(DocumentBase, ORMBase):
    id: str
    created_at: datetime
    updated_at: datetime
    chunks: Optional[List[DocumentChunkSchema]] = None


# Change Event Schemas
class ChangeEventSchema(ORMBase):
    id: str
    event_type: str
    entity_type: str
    entity_id: str
    summary: str
    details: Dict[str, Any] = Field(default_factory=dict)
    source_id: Optional[str] = None
    created_at: datetime


# Review Schemas
class ReviewItemCreate(BaseModel):
    entity_type: str
    title: str
    raw_data: Dict[str, Any]
    submitted_by: str = "Student Submission"
    source_url: Optional[str] = None


class ReviewItemSchema(ORMBase):
    id: str
    entity_type: str
    entity_id: Optional[str] = None
    title: str
    raw_data: Dict[str, Any]
    status: str = "PENDING"
    submitted_by: str
    reviewer_notes: Optional[str] = None
    source_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ReviewActionRequest(BaseModel):
    action: str  # APPROVE, REJECT
    reviewer_notes: Optional[str] = None
    modified_data: Optional[Dict[str, Any]] = None


# Search Response Schemas
class SearchResultItem(BaseModel):
    id: str
    type: str  # portal, event, notice, project, organization, document, opportunity
    title: str
    description: Optional[str] = None
    url: str  # internal wiki URL or external portal URL
    source_url: Optional[str] = None
    source_type: str = "OFFICIAL"
    category: Optional[str] = None
    date: Optional[str] = None
    match_score: float = 1.0
    status: Optional[str] = None
    badge: Optional[str] = None


class SearchResponse(BaseModel):
    query: str
    total: int
    results: List[SearchResultItem]
    grouped_counts: Dict[str, int]


# Pulse Response Schema
class PulseResponse(BaseModel):
    new_notices: List[NoticeSchema]
    today_events: List[EventSchema]
    upcoming_events: List[EventSchema]
    deadlines: List[OpportunitySchema]
    recent_projects: List[ProjectSchema]
    recent_changes: List[ChangeEventSchema]
    counts: Dict[str, int]


# AI Schemas
class AISourceItem(BaseModel):
    title: str
    url: str
    source_type: str
    snippet: Optional[str] = None
    doc_id: Optional[str] = None


class AIChatMessage(BaseModel):
    role: str  # user, assistant, system
    content: str


class AIChatRequest(BaseModel):
    message: str
    history: List[AIChatMessage] = Field(default_factory=list)


class AIChatResponse(BaseModel):
    answer: str
    intent: str
    sources: List[AISourceItem] = Field(default_factory=list)
    suggested_followups: List[str] = Field(default_factory=list)


# Admin Auth Schemas
class AdminAuthRequest(BaseModel):
    token: str


class AdminAuthResponse(BaseModel):
    authenticated: bool
    message: str
