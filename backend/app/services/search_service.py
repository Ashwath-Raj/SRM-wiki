from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from backend.app.models.all_models import (
    Portal,
    Event,
    Notice,
    Project,
    Organization,
    Opportunity,
    Document,
)
from backend.app.schemas.all_schemas import SearchResponse, SearchResultItem


class SearchService:
    def __init__(self, db: Session):
        self.db = db

    def search(
        self,
        query: str = "",
        category: Optional[str] = None,
        source_type: Optional[str] = None,
        department: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> SearchResponse:
        results: List[SearchResultItem] = []
        q = (query or "").strip().lower()
        terms = q.split() if q else []

        grouped_counts: Dict[str, int] = {
            "all": 0,
            "portals": 0,
            "events": 0,
            "notices": 0,
            "projects": 0,
            "organizations": 0,
            "documents": 0,
            "opportunities": 0,
        }

        # Helper to compute relevance score
        def calc_score(title: str, desc: str, stype: str) -> float:
            score = 1.0
            t_lower = (title or "").lower()
            d_lower = (desc or "").lower()

            if not q:
                return score

            # Exact phrase match
            if q == t_lower:
                score += 150.0
            elif q in t_lower:
                score += 80.0
            elif any(term in t_lower for term in terms):
                score += 30.0

            if q in d_lower:
                score += 25.0
            elif any(term in d_lower for term in terms):
                score += 10.0

            # Source trust weight
            trust_multipliers = {
                "OFFICIAL": 1.3,
                "DEPARTMENT": 1.2,
                "ORGANIZATION": 1.1,
                "STUDENT": 1.0,
                "COMMUNITY": 0.95,
                "EXTERNAL": 0.9,
            }
            score *= trust_multipliers.get(stype, 1.0)
            return score

        # 1. Portals
        if not category or category.lower() in ["all", "portal", "portals"]:
            portals = self.db.query(Portal).filter(Portal.verification_status == "VERIFIED").all()
            for p in portals:
                if source_type and p.source_type.upper() != source_type.upper():
                    continue
                score = calc_score(p.name, p.description or "", p.source_type)
                if not q or score > 1.0:
                    results.append(
                        SearchResultItem(
                            id=p.id,
                            type="portal",
                            title=p.name,
                            description=p.description,
                            url=p.url,
                            source_url=p.url,
                            source_type=p.source_type,
                            category=p.category,
                            match_score=score,
                            badge="Portal",
                        )
                    )
                    grouped_counts["portals"] += 1

        # 2. Events
        if not category or category.lower() in ["all", "event", "events"]:
            events = self.db.query(Event).filter(Event.verification_status == "VERIFIED").all()
            for e in events:
                if source_type and e.source_type.upper() != source_type.upper():
                    continue
                combined_text = f"{e.description or ''} {e.organizer or ''} {e.venue or ''} {e.category or ''}"
                score = calc_score(e.title, combined_text, e.source_type)
                if e.status == "LIVE NOW" or e.status == "ONGOING":
                    score += 25.0
                if not q or score > 1.0:
                    badge_name = "🔴 Live Event" if e.status == "LIVE NOW" else "Event"
                    results.append(
                        SearchResultItem(
                            id=e.id,
                            type="event",
                            title=e.title,
                            description=f"[{e.organizer or 'Campus'}] {e.description}",
                            url=f"/events/{e.slug}",
                            source_url=e.source_url or e.registration_url,
                            source_type=e.source_type,
                            category=e.category,
                            date=e.start_time.strftime("%d %b %Y, %I:%M %p"),
                            status=e.status,
                            match_score=score,
                            badge=badge_name,
                        )
                    )
                    grouped_counts["events"] += 1

        # 3. Notices
        if not category or category.lower() in ["all", "notice", "notices"]:
            notices = self.db.query(Notice).filter(Notice.verification_status == "VERIFIED").all()
            for n in notices:
                if source_type and n.source_type.upper() != source_type.upper():
                    continue
                score = calc_score(n.title, n.description or "", n.source_type)
                if n.priority == "URGENT":
                    score += 15.0
                elif n.priority == "IMPORTANT":
                    score += 8.0

                if not q or score > 1.0:
                    results.append(
                        SearchResultItem(
                            id=n.id,
                            type="notice",
                            title=n.title,
                            description=n.description,
                            url=f"/notices/{n.slug}",
                            source_url=n.source_url,
                            source_type=n.source_type,
                            category=n.category,
                            date=n.published_at.strftime("%d %b %Y") if n.published_at else None,
                            status=n.priority,
                            match_score=score,
                            badge=f"Notice ({n.priority})",
                        )
                    )
                    grouped_counts["notices"] += 1

        # 4. Projects
        if not category or category.lower() in ["all", "project", "projects"]:
            projects = self.db.query(Project).filter(Project.verification_status == "VERIFIED").all()
            for pr in projects:
                if department and pr.department.lower() != department.lower():
                    continue
                score = calc_score(pr.title, (pr.description or "") + " " + " ".join(pr.technologies or []), pr.source_type)
                if not q or score > 1.0:
                    results.append(
                        SearchResultItem(
                            id=pr.id,
                            type="project",
                            title=pr.title,
                            description=pr.description,
                            url=f"/projects/{pr.slug}",
                            source_url=pr.github_url or pr.demo_url,
                            source_type=pr.source_type,
                            category=pr.department,
                            date=pr.year,
                            match_score=score,
                            badge="Student Project",
                        )
                    )
                    grouped_counts["projects"] += 1

        # 5. Organizations
        if not category or category.lower() in ["all", "organization", "organizations"]:
            orgs = self.db.query(Organization).filter(Organization.verification_status == "VERIFIED").all()
            for o in orgs:
                score = calc_score(o.name, o.description or "", o.source_type)
                if not q or score > 1.0:
                    results.append(
                        SearchResultItem(
                            id=o.id,
                            type="organization",
                            title=o.name,
                            description=o.description,
                            url=f"/organizations/{o.slug}",
                            source_url=o.website_url,
                            source_type=o.source_type,
                            category=o.type,
                            match_score=score,
                            badge="Organization",
                        )
                    )
                    grouped_counts["organizations"] += 1

        # 6. Documents
        if not category or category.lower() in ["all", "document", "documents"]:
            docs = self.db.query(Document).filter(Document.verification_status == "VERIFIED").all()
            for d in docs:
                score = calc_score(d.title, (d.description or "") + " " + (d.extracted_text or "")[:500], d.source_type)
                if not q or score > 1.0:
                    results.append(
                        SearchResultItem(
                            id=d.id,
                            type="document",
                            title=d.title,
                            description=d.description,
                            url=f"/documents/{d.slug}",
                            source_url=d.file_url or d.source_url,
                            source_type=d.source_type,
                            category=d.document_type,
                            date=d.published_at.strftime("%d %b %Y") if d.published_at else None,
                            match_score=score,
                            badge="Document",
                        )
                    )
                    grouped_counts["documents"] += 1

        # 7. Opportunities
        if not category or category.lower() in ["all", "opportunity", "opportunities"]:
            opps = self.db.query(Opportunity).filter(Opportunity.verification_status == "VERIFIED").all()
            for op in opps:
                score = calc_score(op.title, (op.description or "") + " " + (op.company or ""), op.source_type)
                if not q or score > 1.0:
                    results.append(
                        SearchResultItem(
                            id=op.id,
                            type="opportunity",
                            title=op.title,
                            description=f"{op.company} — {op.description}",
                            url=op.apply_url or f"/opportunities/{op.slug}",
                            source_url=op.source_url,
                            source_type=op.source_type,
                            category=op.type,
                            date=op.deadline.strftime("%d %b %Y") if op.deadline else None,
                            status=op.status,
                            match_score=score,
                            badge="Opportunity",
                        )
                    )
                    grouped_counts["opportunities"] += 1

        # Sort descending by match_score
        results.sort(key=lambda x: x.match_score, reverse=True)
        grouped_counts["all"] = len(results)

        # Pagination
        start = (page - 1) * limit
        end = start + limit
        paginated_results = results[start:end]

        return SearchResponse(
            query=query,
            total=len(results),
            results=paginated_results,
            grouped_counts=grouped_counts,
        )
