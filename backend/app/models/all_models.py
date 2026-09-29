import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    Integer,
    DateTime,
    ForeignKey,
    JSON,
    Index,
)
from sqlalchemy.orm import relationship
from backend.app.database.session import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Source(Base):
    __tablename__ = "sources"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    base_url = Column(String(512), nullable=False, unique=True)
    source_type = Column(String(64), nullable=False, default="OFFICIAL")  # OFFICIAL, DEPARTMENT, ORGANIZATION, STUDENT, COMMUNITY, EXTERNAL
    description = Column(Text, nullable=True)
    crawl_enabled = Column(Boolean, default=True)
    crawl_frequency = Column(String(32), default="DAILY")  # HOURLY, DAILY, WEEKLY, MANUAL
    allowed_paths = Column(JSON, default=list)
    blocked_paths = Column(JSON, default=list)
    verification_status = Column(String(32), default="VERIFIED")  # DISCOVERED, PENDING_REVIEW, VERIFIED, PUBLISHED, REJECTED, ARCHIVED
    last_crawled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    pages = relationship("Page", back_populates="source", cascade="all, delete-orphan")


class Page(Base):
    __tablename__ = "pages"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    source_id = Column(String(64), ForeignKey("sources.id"), nullable=False)
    url = Column(String(1024), nullable=False, index=True)
    canonical_url = Column(String(1024), nullable=True)
    title = Column(String(512), nullable=True)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    content_hash = Column(String(64), nullable=True, index=True)
    content_type = Column(String(64), default="HTML")
    status_code = Column(Integer, default=200)
    last_crawled_at = Column(DateTime, default=datetime.utcnow)
    last_modified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    source = relationship("Source", back_populates="pages")


class Portal(Base):
    __tablename__ = "portals"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    slug = Column(String(128), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String(1024), nullable=False)
    category = Column(String(64), default="Academic")  # Academic, Examination, Student, Library, Administration, Career, Finance, Other
    icon = Column(String(64), default="external-link")
    is_quick_access = Column(Boolean, default=False)
    source_id = Column(String(64), ForeignKey("sources.id"), nullable=True)
    source_type = Column(String(64), default="OFFICIAL")
    verification_status = Column(String(32), default="VERIFIED")
    last_verified_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Event(Base):
    __tablename__ = "events"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(512), nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime, nullable=False, index=True)
    end_time = Column(DateTime, nullable=True)
    venue = Column(String(255), nullable=True)
    organizer = Column(String(255), nullable=True)
    category = Column(String(64), default="Technical")  # Workshop, Hackathon, Cultural, Technical, Guest Lecture, Sports, Seminar, Other
    registration_url = Column(String(1024), nullable=True)
    source_id = Column(String(64), ForeignKey("sources.id"), nullable=True)
    source_type = Column(String(64), default="OFFICIAL")
    source_url = Column(String(1024), nullable=True)
    verification_status = Column(String(32), default="VERIFIED")
    status = Column(String(32), default="UPCOMING")  # UPCOMING, ONGOING, COMPLETED, CANCELLED, ARCHIVED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Notice(Base):
    __tablename__ = "notices"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(512), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(64), default="General")  # Examination, Academic, Administrative, Hostel, Sports, Placement, Other
    priority = Column(String(32), default="NORMAL")  # NORMAL, IMPORTANT, URGENT
    published_at = Column(DateTime, default=datetime.utcnow, index=True)
    expires_at = Column(DateTime, nullable=True)
    source_id = Column(String(64), ForeignKey("sources.id"), nullable=True)
    source_type = Column(String(64), default="OFFICIAL")
    source_url = Column(String(1024), nullable=True)
    document_id = Column(String(64), nullable=True)
    verification_status = Column(String(32), default="VERIFIED")
    status = Column(String(32), default="ACTIVE")  # ACTIVE, EXPIRED, ARCHIVED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(512), nullable=False)
    description = Column(Text, nullable=True)
    team = Column(JSON, default=list)  # List of names or roles
    department = Column(String(128), default="CSE")
    year = Column(String(32), default="2026")
    technologies = Column(JSON, default=list)  # List of tech strings: ["Python", "FastAPI", "React"]
    github_url = Column(String(1024), nullable=True)
    demo_url = Column(String(1024), nullable=True)
    documentation_url = Column(String(1024), nullable=True)
    organization_id = Column(String(64), nullable=True)
    organization_name = Column(String(255), nullable=True)
    source_id = Column(String(64), ForeignKey("sources.id"), nullable=True)
    source_type = Column(String(64), default="STUDENT")
    verification_status = Column(String(32), default="VERIFIED")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(64), default="CLUB")  # CLUB, LAB, CHAPTER, COMMUNITY, SOCIETY, STUDENT_ORGANIZATION, OTHER
    department = Column(String(128), nullable=True)
    website_url = Column(String(1024), nullable=True)
    social_links = Column(JSON, default=dict)
    contact = Column(String(255), nullable=True)
    logo_url = Column(String(1024), nullable=True)
    source_id = Column(String(64), ForeignKey("sources.id"), nullable=True)
    source_type = Column(String(64), default="ORGANIZATION")
    verification_status = Column(String(32), default="VERIFIED")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(512), nullable=False)
    description = Column(Text, nullable=True)
    company = Column(String(255), nullable=True)
    type = Column(String(64), default="INTERNSHIP")  # INTERNSHIP, HACKATHON, RESEARCH, COMPETITION, SCHOLARSHIP
    deadline = Column(DateTime, nullable=True, index=True)
    eligibility = Column(Text, nullable=True)
    apply_url = Column(String(1024), nullable=True)
    source_id = Column(String(64), ForeignKey("sources.id"), nullable=True)
    source_type = Column(String(64), default="OFFICIAL")
    source_url = Column(String(1024), nullable=True)
    verification_status = Column(String(32), default="VERIFIED")
    status = Column(String(32), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(512), nullable=False)
    description = Column(Text, nullable=True)
    document_type = Column(String(64), default="REGULATION")  # REGULATION, HANDBOOK, CIRCULAR, SYLLABUS, TIMETABLE, FORM, OTHER
    file_url = Column(String(1024), nullable=False)
    source_url = Column(String(1024), nullable=True)
    source_id = Column(String(64), ForeignKey("sources.id"), nullable=True)
    source_type = Column(String(64), default="OFFICIAL")
    published_at = Column(DateTime, default=datetime.utcnow)
    content_hash = Column(String(64), nullable=True)
    page_count = Column(Integer, default=1)
    extracted_text = Column(Text, nullable=True)
    verification_status = Column(String(32), default="VERIFIED")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    document_id = Column(String(64), ForeignKey("documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    section = Column(String(255), nullable=True)
    page_number = Column(Integer, default=1)
    embedding = Column(Text, nullable=True)  # JSON-encoded vector list
    metadata_json = Column(JSON, default=dict)  # source_url, document_title, source_type, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="chunks")


class ChangeEvent(Base):
    __tablename__ = "change_events"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_type = Column(String(64), nullable=False)  # NEW_NOTICE, NEW_EVENT, UPDATED_NOTICE, UPDATED_EVENT, NEW_PROJECT, NEW_DOCUMENT, SOURCE_CHANGED, LINK_BROKEN
    entity_type = Column(String(64), nullable=False)
    entity_id = Column(String(64), nullable=False)
    summary = Column(String(512), nullable=False)
    details = Column(JSON, default=dict)
    source_id = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class ReviewItem(Base):
    __tablename__ = "review_items"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    entity_type = Column(String(64), nullable=False)  # event, notice, project, organization, portal, document
    entity_id = Column(String(64), nullable=True)
    title = Column(String(512), nullable=False)
    raw_data = Column(JSON, default=dict)
    status = Column(String(32), default="PENDING")  # PENDING, APPROVED, REJECTED
    submitted_by = Column(String(255), default="System Crawler")
    reviewer_notes = Column(Text, nullable=True)
    source_url = Column(String(1024), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Indices for fast full text search and filtering
Index("idx_portal_category", Portal.category)
Index("idx_event_category_status", Event.category, Event.status)
Index("idx_notice_priority_status", Notice.priority, Notice.status)
Index("idx_project_department", Project.department)
Index("idx_doc_type", Document.document_type)
