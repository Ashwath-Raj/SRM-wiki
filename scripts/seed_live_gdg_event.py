import sys
from datetime import datetime, timedelta
from backend.app.database.session import SessionLocal
from backend.app.models.all_models import Event, Organization, ChangeEvent

def seed_live_gdg():
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        # Today 29 Sep 2026
        today_9am = datetime(now.year, now.month, now.day, 9, 0, 0)
        today_4pm = datetime(now.year, now.month, now.day, 16, 0, 0)

        # 1. Ensure GDG Organization exists
        gdg_org = db.query(Organization).filter(Organization.slug == "gdg-srmap").first()
        if not gdg_org:
            gdg_org = Organization(
                id="org-gdg-srmap",
                slug="gdg-srmap",
                name="GDG on Campus – SRM University-AP",
                description="Google Developer Groups (GDG) on Campus SRM University-AP is a dynamic student community focused on Google developer technologies, mobile development, cloud computing, and AI hackathons.",
                type="Technical Club",
                department="Department of Computer Science & Engineering",
                contact="Faculty Mentor: Dr. Naga Sravanthi Puppala | Student Lead Team (gdg@srmap.edu.in)",
                website_url="https://gdg.community.dev/gdg-on-campus-srm-university-ap-amaravati-india/",
                social_links={
                    "x": "https://x.com/SRMUAP",
                    "instagram": "https://www.instagram.com/srmuap/",
                    "community": "https://gdg.community.dev/events/details/google-gdg-on-campus-srm-university-ap-amaravati-india-presents-google-solution-hunt-challenge-2026/"
                },
                source_id=None,
                source_type="ORGANIZATION",
                verification_status="VERIFIED",
            )
            db.add(gdg_org)
            print("Added GDG on Campus organization.")
        else:
            gdg_org.description = "Google Developer Groups (GDG) on Campus SRM University-AP is a dynamic student community focused on Google developer technologies, mobile development, cloud computing, and AI hackathons."
            gdg_org.department = "Department of Computer Science & Engineering"
            gdg_org.contact = "Faculty Mentor: Dr. Naga Sravanthi Puppala | Student Lead Team (gdg@srmap.edu.in)"
            print("Updated GDG on Campus organization.")

        # 2. Add / Update Google Solution Hunt Challenge 2026 Hackathon
        hackathon = db.query(Event).filter(Event.slug == "google-solution-hunt-challenge-2026").first()
        if not hackathon:
            hackathon = Event(
                id="ev-gdg-solution-hunt-2026",
                slug="google-solution-hunt-challenge-2026",
                title="Google Solution Hunt Challenge 2026 — GDG Campus Hackathon",
                description=(
                    "Live hands-on 1-day technology sprint & hackathon organized by GDG on Campus – SRM University-AP. "
                    "Shortlisted teams of 3 compete to solve real-world campus and societal challenges by building functional prototypes "
                    "using Flutter, Firebase, Google Cloud, and Android. Guided by faculty mentor Dr. Naga Sravanthi Puppala (Department of CSE)."
                ),
                start_time=today_9am,
                end_time=today_4pm,
                venue="X-Lab Auditorium, SRM University-AP Campus",
                organizer="GDG on Campus – SRM University-AP",
                category="Hackathon",
                registration_url="https://gdg.community.dev/events/details/google-gdg-on-campus-srm-university-ap-amaravati-india-presents-google-solution-hunt-challenge-2026/",
                source_id="src-org-gdg",
                source_type="ORGANIZATION",
                source_url="https://x.com/SRMUAP/status/2104180085259694287",
                verification_status="VERIFIED",
                status="LIVE NOW",
            )
            db.add(hackathon)
            print("Added Google Solution Hunt Challenge 2026 Event.")
        else:
            hackathon.title = "Google Solution Hunt Challenge 2026 — GDG Campus Hackathon"
            hackathon.description = (
                "Live hands-on 1-day technology sprint & hackathon organized by GDG on Campus – SRM University-AP. "
                "Shortlisted teams of 3 compete to solve real-world campus and societal challenges by building functional prototypes "
                "using Flutter, Firebase, Google Cloud, and Android. Guided by faculty mentor Dr. Naga Sravanthi Puppala (Department of CSE)."
            )
            hackathon.start_time = today_9am
            hackathon.end_time = today_4pm
            hackathon.venue = "X-Lab Auditorium, SRM University-AP Campus"
            hackathon.organizer = "GDG on Campus – SRM University-AP"
            hackathon.category = "Hackathon"
            hackathon.registration_url = "https://gdg.community.dev/events/details/google-gdg-on-campus-srm-university-ap-amaravati-india-presents-google-solution-hunt-challenge-2026/"
            hackathon.source_url = "https://x.com/SRMUAP/status/2104180085259694287"
            hackathon.status = "LIVE NOW"
            print("Updated Google Solution Hunt Challenge 2026 Event.")

        # 3. Add Change Event record to pulse
        change_ev = ChangeEvent(
            event_type="NEW_EVENT",
            entity_type="EVENT",
            entity_id="ev-gdg-solution-hunt-2026",
            summary="GDG Solution Hunt Challenge 2026 is LIVE NOW in X-Lab Auditorium (9:00 AM - 4:00 PM IST).",
            details={
                "venue": "X-Lab Auditorium, SRM University-AP",
                "organizer": "GDG on Campus – SRM University-AP",
                "mentor": "Dr. Naga Sravanthi Puppala",
                "category": "Hackathon",
                "source_url": "https://x.com/SRMUAP/status/2104180085259694287"
            },
        )
        db.add(change_ev)

        db.commit()
        print("Database successfully committed with live GDG Hackathon data!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding live GDG event: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_live_gdg()
