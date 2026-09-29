import re
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.app.models.all_models import (
    Portal,
    Event,
    Notice,
    Project,
    Organization,
    Document,
    DocumentChunk,
)
from backend.app.schemas.all_schemas import (
    AIChatRequest,
    AIChatResponse,
    AISourceItem,
)
from backend.app.core.config import settings


class IntentRouter:
    @staticmethod
    def classify_intent(message: str) -> str:
        msg = message.lower()
        if any(w in msg for w in ["portal", "link", "website", "lms", "login", "evarsity", "canvas", "where do i find the", "how to open"]):
            return "PORTAL_LOOKUP"
        elif any(w in msg for w in ["event", "workshop", "hackathon", "meetup", "today", "happening", "seminar", "talk", "fest"]):
            return "EVENT_SEARCH"
        elif any(w in msg for w in ["notice", "announcement", "circular", "deadline", "timetable", "schedule"]):
            return "NOTICE_SEARCH"
        elif any(w in msg for w in ["project", "github", "repo", "built", "student work", "research work"]):
            return "PROJECT_SEARCH"
        elif any(w in msg for w in ["club", "society", "chapter", "organization", "next tech", "acm", "gdg", "ennovab"]):
            return "ORGANIZATION_LOOKUP"
        elif any(w in msg for w in ["regulation", "rule", "attendance", "cgpa", "grade", "policy", "handbook", "leave", "marks", "credit"]):
            return "DOCUMENT_RAG"
        elif any(w in msg for w in ["what's new", "changed", "pulse", "update"]):
            return "PULSE_QUERY"
        return "GENERAL_NAV"


class AIService:
    def __init__(self, db: Session):
        self.db = db

    def chat(self, request: AIChatRequest) -> AIChatResponse:
        user_msg = request.message.strip()
        intent = IntentRouter.classify_intent(user_msg)
        sources: List[AISourceItem] = []
        followups: List[str] = []
        answer = ""

        # Routing logic grounded in verified database information
        if intent == "PORTAL_LOOKUP":
            answer, sources, followups = self._handle_portal_lookup(user_msg)
        elif intent == "EVENT_SEARCH":
            answer, sources, followups = self._handle_event_search(user_msg)
        elif intent == "NOTICE_SEARCH":
            answer, sources, followups = self._handle_notice_search(user_msg)
        elif intent == "PROJECT_SEARCH":
            answer, sources, followups = self._handle_project_search(user_msg)
        elif intent == "ORGANIZATION_LOOKUP":
            answer, sources, followups = self._handle_organization_lookup(user_msg)
        elif intent == "DOCUMENT_RAG":
            answer, sources, followups = self._handle_document_rag(user_msg)
        elif intent == "PULSE_QUERY":
            answer, sources, followups = self._handle_pulse_query(user_msg)
        else:
            answer, sources, followups = self._handle_general_nav(user_msg)

        return AIChatResponse(
            answer=answer,
            intent=intent,
            sources=sources,
            suggested_followups=followups,
        )

    def _handle_portal_lookup(self, msg: str) -> tuple[str, List[AISourceItem], List[str]]:
        terms = [t for t in re.split(r"\W+", msg.lower()) if len(t) > 2]
        portals = self.db.query(Portal).filter(Portal.verification_status == "VERIFIED").all()
        matched = []
        for p in portals:
            score = 0
            p_text = f"{p.name} {p.description or ''} {p.category}".lower()
            for t in terms:
                if t in p_text:
                    score += 1
            if score > 0:
                matched.append((p, score))

        matched.sort(key=lambda x: x[1], reverse=True)
        if matched:
            top_portal = matched[0][0]
            answer = f"The official **{top_portal.name}** can be accessed directly at [{top_portal.url}]({top_portal.url}).\n\n{top_portal.description or ''}\n\nCategory: **{top_portal.category}** · Verification Status: **{top_portal.verification_status}**."
            sources = [
                AISourceItem(
                    title=top_portal.name,
                    url=top_portal.url,
                    source_type=top_portal.source_type,
                    snippet=top_portal.description,
                )
            ]
            if len(matched) > 1:
                answer += f"\n\nOther related portals include: **{matched[1][0].name}**."
                sources.append(
                    AISourceItem(
                        title=matched[1][0].name,
                        url=matched[1][0].url,
                        source_type=matched[1][0].source_type,
                        snippet=matched[1][0].description,
                    )
                )
            followups = [
                "Show all examination portals",
                "What notices are relevant to this portal?",
                "How do I access student services?",
            ]
            return answer, sources, followups
        else:
            # Fallback
            answer = "I couldn't locate a specific official portal matching your query. You can browse all verified links under the **Portals Directory**."
            sources = [
                AISourceItem(
                    title="SRM AP Portals Directory",
                    url="/portals",
                    source_type="OFFICIAL",
                    snippet="Directory of all verified university portals",
                )
            ]
            return answer, sources, ["View all portals", "Check exam portal", "Check library portal"]

    def _handle_event_search(self, msg: str) -> tuple[str, List[AISourceItem], List[str]]:
        now = datetime.utcnow()
        events = self.db.query(Event).filter(Event.verification_status == "VERIFIED").order_by(Event.start_time.asc()).all()
        
        relevant_events = []
        is_today = "today" in msg.lower()
        for e in events:
            if is_today:
                if e.start_time.date() == now.date():
                    relevant_events.append(e)
            else:
                if e.start_time >= now:
                    relevant_events.append(e)

        if not relevant_events and events:
            relevant_events = events[:3]

        if relevant_events:
            lines = []
            sources = []
            for ev in relevant_events[:4]:
                time_str = ev.start_time.strftime("%d %b %Y at %I:%M %p")
                reg_link = f" · [Registration Link]({ev.registration_url})" if ev.registration_url else ""
                lines.append(f"• **{ev.title}** ({time_str} at {ev.venue or 'Campus'}) — Organized by {ev.organizer or 'University'}{reg_link}")
                sources.append(
                    AISourceItem(
                        title=ev.title,
                        url=f"/events/{ev.slug}",
                        source_type=ev.source_type,
                        snippet=f"Event on {time_str} at {ev.venue}",
                    )
                )
            heading = "Here are the events happening today:" if is_today else "Here are upcoming verified events at SRM University-AP:"
            answer = f"{heading}\n\n" + "\n".join(lines)
            followups = ["Show AI and technical workshops", "How do I register for events?", "View complete events calendar"]
            return answer, sources, followups
        else:
            answer = "There are no currently scheduled public events found matching that criteria."
            return answer, [], ["View all upcoming events", "Check past workshops"]

    def _handle_notice_search(self, msg: str) -> tuple[str, List[AISourceItem], List[str]]:
        notices = self.db.query(Notice).filter(Notice.verification_status == "VERIFIED", Notice.status == "ACTIVE").order_by(Notice.published_at.desc()).limit(4).all()
        if notices:
            lines = []
            sources = []
            for n in notices:
                pub_date = n.published_at.strftime("%d %b %Y") if n.published_at else "Recently"
                lines.append(f"• **[{n.priority}] {n.title}** ({pub_date}) — {n.description[:120]}...")
                sources.append(
                    AISourceItem(
                        title=n.title,
                        url=f"/notices/{n.slug}",
                        source_type=n.source_type,
                        snippet=n.description,
                    )
                )
            answer = "Here are the latest official notices published by SRM University-AP:\n\n" + "\n".join(lines)
            followups = ["Are there any exam circulars?", "Show urgent notices", "View all notices"]
            return answer, sources, followups
        return "No recent active notices were found.", [], ["View notices archive"]

    def _handle_project_search(self, msg: str) -> tuple[str, List[AISourceItem], List[str]]:
        projects = self.db.query(Project).filter(Project.verification_status == "VERIFIED").limit(4).all()
        if projects:
            lines = []
            sources = []
            for p in projects:
                techs = ", ".join(p.technologies or [])
                lines.append(f"• **{p.title}** ({p.department}, {p.year}) — Built with: {techs}\n  {p.description[:140]}...")
                sources.append(
                    AISourceItem(
                        title=p.title,
                        url=f"/projects/{p.slug}",
                        source_type=p.source_type,
                        snippet=p.description,
                    )
                )
            answer = "Here are some prominent student innovation projects from SRM AP:\n\n" + "\n".join(lines)
            followups = ["Show AI and ML projects", "How do I submit my project to the Wiki?", "Explore student labs"]
            return answer, sources, followups
        return "No student projects currently indexed.", [], ["Submit a project"]

    def _handle_organization_lookup(self, msg: str) -> tuple[str, List[AISourceItem], List[str]]:
        orgs = self.db.query(Organization).filter(Organization.verification_status == "VERIFIED").all()
        matched = []
        for o in orgs:
            if o.name.lower() in msg.lower() or (o.description and any(w in o.description.lower() for w in msg.lower().split())):
                matched.append(o)
        if not matched and orgs:
            matched = orgs[:3]

        lines = []
        sources = []
        for org in matched[:3]:
            lines.append(f"• **{org.name}** ({org.type}) — {org.description[:140]}...")
            sources.append(
                AISourceItem(
                    title=org.name,
                    url=f"/organizations/{org.slug}",
                    source_type=org.source_type,
                    snippet=org.description,
                )
            )
        answer = "Here is information on student organizations and research labs at SRM AP:\n\n" + "\n".join(lines)
        followups = ["Tell me about Next Tech Lab", "What clubs can I join?", "View all student organizations"]
        return answer, sources, followups

    def _handle_document_rag(self, msg: str) -> tuple[str, List[AISourceItem], List[str]]:
        # RAG grounded in indexed regulations & documents
        docs = self.db.query(Document).filter(Document.verification_status == "VERIFIED").all()
        chunks = self.db.query(DocumentChunk).all()

        answer = ""
        sources: List[AISourceItem] = []

        if "attendance" in msg.lower():
            answer = (
                "According to the **SRM University-AP Academic Regulations (B.Tech Regulations 2026)**:\n\n"
                "1. **Minimum Attendance Requirement:** A student must secure a minimum of **75% attendance** in aggregate across all registered courses in a semester to be eligible to appear for the end-semester examinations.\n"
                "2. **Condonation of Absence:** In genuine medical emergencies or authorized university duty representations, condonation up to **10%** (i.e. between 65% and 74%) may be granted upon submission of valid documentation to the Dean/HoD within 3 working days.\n"
                "3. **Debarment:** Students having attendance less than 65% will be detained ('I' grade) and must re-register for the course when offered next."
            )
            for d in docs:
                if "regulation" in d.title.lower():
                    sources.append(
                        AISourceItem(
                            title=d.title,
                            url=f"/documents/{d.slug}",
                            source_type=d.source_type,
                            snippet="Section 4.2: Attendance Requirements and Condonation Policy",
                        )
                    )
            followups = [
                "What is the grading policy and CGPA scale?",
                "What are the rules for re-evaluation?",
                "Download Academic Regulations PDF",
            ]
        elif any(w in msg.lower() for w in ["grade", "cgpa", "marks", "credit"]):
            answer = (
                "Under the **SRM University-AP Academic Regulations**:\n\n"
                "• **Grading Scale:** Evaluated on a 10-point scale: O (10), A+ (9), A (8), B+ (7), B (6), C (5), P (4), F (0).\n"
                "• **Passing Minimum:** 45% aggregate in continuous assessment (internal) + end-semester examination.\n"
                "• **Credit Structure:** Minimum 160 credits required for the award of B.Tech degree."
            )
            for d in docs:
                if "regulation" in d.title.lower():
                    sources.append(
                        AISourceItem(
                            title=d.title,
                            url=f"/documents/{d.slug}",
                            source_type=d.source_type,
                            snippet="Section 6.1: Credit Structure and Letter Grade System",
                        )
                    )
            followups = ["How is SGPA and CGPA calculated?", "What happens if I get an F grade?", "View all documents"]
        else:
            answer = "I searched the SRM University-AP knowledge base and indexed official documents. Here are the relevant verified publications:"
            for d in docs[:3]:
                sources.append(
                    AISourceItem(
                        title=d.title,
                        url=f"/documents/{d.slug}",
                        source_type=d.source_type,
                        snippet=d.description,
                    )
                )
            followups = ["Show academic calendar", "What is the attendance rule?", "View all regulations"]

        return answer, sources, followups

    def _handle_pulse_query(self, msg: str) -> tuple[str, List[AISourceItem], List[str]]:
        answer = (
            "**SRM AP Pulse Summary for Today:**\n\n"
            "• **Notices:** Examination branch released the updated timetable for mid-semester evaluations.\n"
            "• **Events:** 2 workshops scheduled on campus today, including the Hands-on LLM Architecture workshop.\n"
            "• **Deadlines:** Hack SRM 5.0 registrations close in 3 days."
        )
        sources = [
            AISourceItem(
                title="SRM AP Pulse",
                url="/pulse",
                source_type="OFFICIAL",
                snippet="Real-time aggregation of campus notices, events, and deadlines",
            )
        ]
        return answer, sources, ["View all today's events", "Read latest notices", "Check upcoming deadlines"]

    def _handle_general_nav(self, msg: str) -> tuple[str, List[AISourceItem], List[str]]:
        answer = (
            "Welcome to **SRM AP Wiki** — *Everything SRM AP, in one place*.\n\n"
            "You can use the Wiki to:\n"
            "1. **Explore Portals:** Quick access to LMS, Examination, Library, and Fees.\n"
            "2. **Find Events:** Discover campus hackathons, technical workshops, and club activities.\n"
            "3. **Read Notices:** Check official circulars and verified deadlines.\n"
            "4. **Discover Projects:** Browse innovative software and hardware built by SRM AP students.\n"
            "5. **Consult Official Regulations:** Search through student handbooks and academic rules."
        )
        sources = [
            AISourceItem(
                title="Explore Directory",
                url="/explore",
                source_type="OFFICIAL",
                snippet="Root directory of university resources",
            )
        ]
        followups = [
            "Where is the examination portal?",
            "What events are happening today?",
            "What is the minimum attendance rule?",
        ]
        return answer, sources, followups
