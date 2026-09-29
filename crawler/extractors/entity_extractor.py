import re
from typing import Optional, Dict, Any
from datetime import datetime


class EntityExtractor:
    @staticmethod
    def classify_page_type(url: str, title: str, content: str) -> str:
        url_lower = url.lower()
        title_lower = title.lower()
        content_lower = content[:1000].lower()

        if any(w in url_lower for w in ["/event", "/workshop", "/hackathon"]) or "workshop" in title_lower or "hackathon" in title_lower:
            return "EVENT"
        elif any(w in url_lower for w in ["/notice", "/circular", "/announcement"]) or "notice" in title_lower or "circular" in title_lower:
            return "NOTICE"
        elif any(w in url_lower for w in ["/portal", "/examination", "/library", "/lms"]) or "portal" in title_lower:
            return "PORTAL"
        elif any(w in url_lower for w in [".pdf", "/regulation", "/handbook", "/document"]):
            return "DOCUMENT"
        return "GENERAL"

    @staticmethod
    def extract_priority(title: str, content: str) -> str:
        text = (title + " " + content[:500]).upper()
        if "URGENT" in text or "IMMEDIATE" in text:
            return "URGENT"
        elif "IMPORTANT" in text or "ATTENTION" in text or "DEADLINE" in text:
            return "IMPORTANT"
        return "NORMAL"
