from typing import Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.app.models.all_models import (
    Portal,
    Event,
    Notice,
    Project,
    Organization,
    Opportunity,
    Document,
    ChangeEvent,
)
from backend.app.schemas.all_schemas import (
    PulseResponse,
    NoticeSchema,
    EventSchema,
    OpportunitySchema,
    ProjectSchema,
    ChangeEventSchema,
)


class PulseService:
    def __init__(self, db: Session):
        self.db = db

    def get_pulse_data(self) -> PulseResponse:
        now = datetime.utcnow()
        today_start = datetime(now.year, now.month, now.day)
        today_end = datetime(now.year, now.month, now.day, 23, 59, 59)
        next_week = now + timedelta(days=7)

        # 1. New Notices (top 5 active)
        notices = (
            self.db.query(Notice)
            .filter(Notice.verification_status == "VERIFIED", Notice.status == "ACTIVE")
            .order_by(Notice.published_at.desc())
            .limit(5)
            .all()
        )

        # 2. Today's Events
        today_events = (
            self.db.query(Event)
            .filter(
                Event.verification_status == "VERIFIED",
                Event.start_time >= today_start,
                Event.start_time <= today_end,
            )
            .order_by(Event.start_time.asc())
            .all()
        )

        # 3. Upcoming Events (next 7 days, excluding today)
        upcoming_events = (
            self.db.query(Event)
            .filter(
                Event.verification_status == "VERIFIED",
                Event.start_time > today_end,
                Event.start_time <= next_week,
            )
            .order_by(Event.start_time.asc())
            .limit(6)
            .all()
        )

        # 4. Deadlines (next 14 days)
        deadlines = (
            self.db.query(Opportunity)
            .filter(
                Opportunity.verification_status == "VERIFIED",
                Opportunity.status == "ACTIVE",
                Opportunity.deadline >= now,
            )
            .order_by(Opportunity.deadline.asc())
            .limit(5)
            .all()
        )

        # 5. Recent Projects
        recent_projects = (
            self.db.query(Project)
            .filter(Project.verification_status == "VERIFIED")
            .order_by(Project.created_at.desc())
            .limit(4)
            .all()
        )

        # 6. Recent Change Events
        recent_changes = (
            self.db.query(ChangeEvent)
            .order_by(ChangeEvent.created_at.desc())
            .limit(8)
            .all()
        )

        # Summary counts
        counts = {
            "notices": self.db.query(Notice).filter(Notice.verification_status == "VERIFIED").count(),
            "events": self.db.query(Event).filter(Event.verification_status == "VERIFIED").count(),
            "today_events": len(today_events),
            "deadlines": len(deadlines),
            "projects": self.db.query(Project).filter(Project.verification_status == "VERIFIED").count(),
            "portals": self.db.query(Portal).filter(Portal.verification_status == "VERIFIED").count(),
            "organizations": self.db.query(Organization).filter(Organization.verification_status == "VERIFIED").count(),
            "documents": self.db.query(Document).filter(Document.verification_status == "VERIFIED").count(),
        }

        return PulseResponse(
            new_notices=[NoticeSchema.model_validate(n) for n in notices],
            today_events=[EventSchema.model_validate(e) for e in today_events],
            upcoming_events=[EventSchema.model_validate(e) for e in upcoming_events],
            deadlines=[OpportunitySchema.model_validate(o) for o in deadlines],
            recent_projects=[ProjectSchema.model_validate(p) for p in recent_projects],
            recent_changes=[ChangeEventSchema.model_validate(c) for c in recent_changes],
            counts=counts,
        )
