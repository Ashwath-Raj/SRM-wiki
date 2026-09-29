import os
import yaml
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.app.database.session import Base, engine, SessionLocal
from backend.app.models.all_models import (
    Source,
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


def seed_database():
    print("Creating all tables in database...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    # Check if already seeded
    if db.query(Source).count() > 0:
        print("Database already has sources. Skipping duplicate seeding.")
        db.close()
        return

    print("Seeding sources from data/seeds/sources.yaml...")
    sources_path = os.path.join(os.path.dirname(__file__), "..", "data", "seeds", "sources.yaml")
    if os.path.exists(sources_path):
        with open(sources_path, "r", encoding="utf-8") as f:
            sources_data = yaml.safe_load(f)
            for s in sources_data.get("sources", []):
                src = Source(
                    id=s["id"],
                    name=s["name"],
                    base_url=s["base_url"],
                    source_type=s["source_type"],
                    description=s.get("description", ""),
                    crawl_enabled=s.get("crawl_enabled", True),
                    crawl_frequency=s.get("crawl_frequency", "DAILY"),
                    allowed_paths=s.get("allowed_paths", []),
                    blocked_paths=s.get("blocked_paths", []),
                    verification_status=s.get("verification_status", "VERIFIED"),
                    last_crawled_at=datetime.utcnow(),
                )
                db.add(src)
        db.commit()

    print("Seeding Portals...")
    portals = [
        Portal(
            id="portal-exam",
            slug="examination",
            name="Examination Portal",
            description="Official examination results, grade cards, hall ticket downloads, and re-evaluation circulars.",
            url="https://srmap.edu.in/examination",
            category="Examination",
            icon="award",
            is_quick_access=True,
            source_id="src-official-exam",
            source_type="OFFICIAL",
            verification_status="VERIFIED",
        ),
        Portal(
            id="portal-lms",
            slug="lms",
            name="Canvas LMS Portal",
            description="Institutional Learning Management System for course syllabi, lecture slides, assignments, and quizzes.",
            url="https://srmap.instructure.com",
            category="Academic",
            icon="book-open",
            is_quick_access=True,
            source_id="src-official-lms",
            source_type="OFFICIAL",
            verification_status="VERIFIED",
        ),
        Portal(
            id="portal-library",
            slug="library",
            name="Central Library OPAC",
            description="Central library catalog, digital repository (IEEE Xplore, ScienceDirect, ACM Digital Library), and thesis archive.",
            url="https://srmap.edu.in/library",
            category="Library",
            icon="library",
            is_quick_access=True,
            source_id="src-official-library",
            source_type="OFFICIAL",
            verification_status="VERIFIED",
        ),
        Portal(
            id="portal-calendar",
            slug="academic-calendar",
            name="Academic Calendar",
            description="Academic year schedule of classes, holidays, mid-term examinations, and semester breaks.",
            url="https://srmap.edu.in/academic-calendar",
            category="Academic",
            icon="calendar",
            is_quick_access=True,
            source_id="src-official-main",
            source_type="OFFICIAL",
            verification_status="VERIFIED",
        ),
        Portal(
            id="portal-hostel",
            slug="hostel",
            name="Hostel Management Portal",
            description="Hostel room allocation, mess menu, leave applications, and residential regulations.",
            url="https://srmap.edu.in/student-affairs/hostels",
            category="Student",
            icon="home",
            is_quick_access=True,
            source_id="src-official-dsa",
            source_type="OFFICIAL",
            verification_status="VERIFIED",
        ),
        Portal(
            id="portal-fees",
            slug="fees",
            name="Fee Payment Portal",
            description="Tuition fees, examination fees, hostel charges payment, and receipts generation.",
            url="https://srmap.edu.in/fees",
            category="Finance",
            icon="credit-card",
            is_quick_access=True,
            source_id="src-official-main",
            source_type="OFFICIAL",
            verification_status="VERIFIED",
        ),
        Portal(
            id="portal-cdc",
            slug="career-centre",
            name="Career Development Centre (CDC)",
            description="Campus placement schedules, training workshops, internship registrations, and recruiter drives.",
            url="https://srmap.edu.in/cdc",
            category="Career",
            icon="briefcase",
            is_quick_access=True,
            source_id="src-official-cdc",
            source_type="OFFICIAL",
            verification_status="VERIFIED",
        ),
        Portal(
            id="portal-grievance",
            slug="grievance",
            name="Student Grievance Redressal",
            description="Official grievance submission for academic, hostel, and administrative matters.",
            url="https://srmap.edu.in/grievance",
            category="Administration",
            icon="shield-alert",
            is_quick_access=False,
            source_id="src-official-main",
            source_type="OFFICIAL",
            verification_status="VERIFIED",
        ),
        Portal(
            id="portal-wifi",
            slug="it-wifi",
            name="Campus IT & Wi-Fi Access",
            description="Campus high-speed Wi-Fi login, network credentials, and laptop configuration assistance.",
            url="https://srmap.edu.in/it-services",
            category="Student",
            icon="wifi",
            is_quick_access=False,
            source_id="src-official-main",
            source_type="OFFICIAL",
            verification_status="VERIFIED",
        ),
    ]
    db.add_all(portals)
    db.commit()

    now = datetime.utcnow()

    print("Seeding Events...")
    events = [
        Event(
            id="ev-ai-workshop",
            slug="deepseek-agentic-systems-workshop",
            title="Hands-on Workshop: Building Agentic Systems with DeepSeek & Gemini",
            description="Intensive masterclass on multi-agent architectures, function calling, tool use, and local model orchestration.",
            start_time=datetime(now.year, now.month, now.day, 10, 0, 0),
            end_time=datetime(now.year, now.month, now.day, 13, 0, 0),
            venue="ALC Seminar Hall, Block A",
            organizer="Next Tech Lab & ACM Student Chapter",
            category="Workshop",
            registration_url="https://srmap.acm.org/events/agentic-workshop",
            source_id="src-org-acm",
            source_type="ORGANIZATION",
            source_url="https://srmap.acm.org/events/agentic-workshop",
            verification_status="VERIFIED",
            status="ONGOING",
        ),
        Event(
            id="ev-quantum-lecture",
            slug="quantum-machine-learning-lecture",
            title="Guest Lecture: Quantum Machine Learning in Industry",
            description="Distinguished lecture by leading IBM Quantum researcher exploring tensor networks and NISQ quantum algorithms.",
            start_time=datetime(now.year, now.month, now.day, 14, 30, 0),
            end_time=datetime(now.year, now.month, now.day, 16, 30, 0),
            venue="Auditorium, Admin Block",
            organizer="Department of CSE",
            category="Guest Lecture",
            registration_url="https://srmap.edu.in/seas/cse/events/quantum-ml",
            source_id="src-dept-cse",
            source_type="DEPARTMENT",
            source_url="https://srmap.edu.in/seas/cse/events/quantum-ml",
            verification_status="VERIFIED",
            status="UPCOMING",
        ),
        Event(
            id="ev-hack-srm",
            slug="hack-srm-5",
            title="Hack SRM 5.0 — 36-Hour National Flagship Hackathon",
            description="Southern India's premier student hackathon with tracks in AI/ML, Web3, FinTech, Healthcare, and Open Innovation. Over ₹5,00,000 in prizes.",
            start_time=now + timedelta(days=3, hours=9),
            end_time=now + timedelta(days=4, hours=21),
            venue="University Indoor Sports Complex",
            organizer="SRM AP Student Council & Developer Clubs",
            category="Hackathon",
            registration_url="https://hacksrm5.devpost.com",
            source_id="src-official-dsa",
            source_type="OFFICIAL",
            source_url="https://srmap.edu.in/events/hacksrm5",
            verification_status="VERIFIED",
            status="UPCOMING",
        ),
        Event(
            id="ev-infinitus",
            slug="infinitus-2026",
            title="Infinitus 2026 — Annual University Cultural Fest",
            description="Three days of music concerts, dance battles, dramatics, fashion shows, and art exhibitions welcoming 8,000+ attendees.",
            start_time=now + timedelta(days=12, hours=17),
            end_time=now + timedelta(days=15, hours=23),
            venue="University Grounds & Open Air Theatre",
            organizer="Directorate of Student Affairs",
            category="Cultural",
            registration_url="https://infinitus.srmap.edu.in",
            source_id="src-official-dsa",
            source_type="OFFICIAL",
            source_url="https://srmap.edu.in/student-affairs/infinitus",
            verification_status="VERIFIED",
            status="UPCOMING",
        ),
        Event(
            id="ev-robotics-symposium",
            slug="robotics-autonomous-systems-symposium",
            title="Industry Connect: Robotics & Autonomous Systems Symposium",
            description="Exhibition of student drone designs, quadruped rovers, and computer vision sensors with guest judges from aerospace firms.",
            start_time=now + timedelta(days=6, hours=11),
            end_time=now + timedelta(days=6, hours=16),
            venue="Mini Hall 2, Block B",
            organizer="Department of ECE & Tesla Lab",
            category="Technical",
            registration_url="https://srmap.edu.in/seas/ece/symposium-2026",
            source_id="src-dept-ece",
            source_type="DEPARTMENT",
            source_url="https://srmap.edu.in/seas/ece/symposium-2026",
            verification_status="VERIFIED",
            status="UPCOMING",
        ),
    ]
    db.add_all(events)
    db.commit()

    print("Seeding Notices...")
    notices = [
        Notice(
            id="not-exam-timetable",
            slug="end-semester-exam-timetable-even-2026",
            title="End-Semester Examination Schedule for Even Semester 2026 Released",
            description="The Controller of Examinations has officially released the detailed timetable for Even Semester 2025-26 end-semester examinations across all B.Tech, M.Tech, and PhD programs. Students can download hall tickets starting 5th October 2026.",
            category="Examination",
            priority="URGENT",
            published_at=now - timedelta(hours=3),
            expires_at=now + timedelta(days=30),
            source_id="src-official-exam",
            source_type="OFFICIAL",
            source_url="https://srmap.edu.in/examination/schedules/even-sem-2026",
            verification_status="VERIFIED",
            status="ACTIVE",
        ),
        Notice(
            id="not-hostel-rooms",
            slug="hostel-room-allocation-mess-selection",
            title="Hostel Room Allocation & Mess Choice Selection for Spring 2026",
            description="All resident students must submit their hostel room preferences and meal plans through the hostel portal on or before 10th October 2026. Rooms are allotted on a first-come, first-served basis according to CGPA brackets.",
            category="Hostel",
            priority="IMPORTANT",
            published_at=now - timedelta(days=1),
            expires_at=now + timedelta(days=10),
            source_id="src-official-dsa",
            source_type="OFFICIAL",
            source_url="https://srmap.edu.in/student-affairs/hostels/allocation-notice",
            verification_status="VERIFIED",
            status="ACTIVE",
        ),
        Notice(
            id="not-placement-prep",
            slug="pre-placement-training-mock-assessments",
            title="Pre-Placement Training & Mock Coding Assessments for 3rd Year Students",
            description="Mandatory coding assessments on Data Structures, Algorithms, and System Design will be conducted this Saturday via the CDC portal. Attendance is required for all students registered for campus placements.",
            category="Placement",
            priority="IMPORTANT",
            published_at=now - timedelta(days=2),
            expires_at=now + timedelta(days=7),
            source_id="src-official-cdc",
            source_type="OFFICIAL",
            source_url="https://srmap.edu.in/cdc/notices/mock-assessment-2026",
            verification_status="VERIFIED",
            status="ACTIVE",
        ),
        Notice(
            id="not-library-amnesty",
            slug="library-book-returns-amnesty-week",
            title="Library Book Returns & Renewal Amnesty Week",
            description="Central Library announces a complete waiver of overdue fines during Amnesty Week from 1st to 7th October 2026. All borrowed physical volumes may be returned without penalty.",
            category="Library",
            priority="NORMAL",
            published_at=now - timedelta(days=3),
            expires_at=now + timedelta(days=6),
            source_id="src-official-library",
            source_type="OFFICIAL",
            source_url="https://srmap.edu.in/library/notices/amnesty-2026",
            verification_status="VERIFIED",
            status="ACTIVE",
        ),
        Notice(
            id="not-sports-meet",
            slug="annual-sports-meet-agon-2026",
            title="Annual Sports Meet 'Agon 2026' Registrations Open",
            description="Directorate of Physical Education invites registrations for inter-departmental athletic events, football, basketball, cricket, and badminton. Register via the DSA portal.",
            category="Sports",
            priority="NORMAL",
            published_at=now - timedelta(days=4),
            expires_at=now + timedelta(days=14),
            source_id="src-official-dsa",
            source_type="OFFICIAL",
            source_url="https://srmap.edu.in/student-affairs/agon-2026",
            verification_status="VERIFIED",
            status="ACTIVE",
        ),
    ]
    db.add_all(notices)
    db.commit()

    print("Seeding Projects...")
    projects = [
        Project(
            id="proj-ar-nav",
            slug="srm-campus-navigation-ar",
            title="SRM Campus Navigation AR",
            description="Augmented reality spatial navigation application for SRM AP campus. Guides freshmen and visitors with 3D directional arrows to classrooms, laboratories, auditoriums, and cafeterias.",
            team=["Aditya Sharma", "Kavya Reddy", "Rohan Verma"],
            department="CSE",
            year="2026",
            technologies=["React Native", "Three.js", "WebXR", "FastAPI"],
            github_url="https://github.com/srmap-innovation/campus-ar-nav",
            demo_url="https://nav.srmap.dev",
            organization_name="Next Tech Lab",
            source_type="STUDENT",
            verification_status="VERIFIED",
        ),
        Project(
            id="proj-rover",
            slug="autonomous-field-rover",
            title="Autonomous Rover for Precision Agriculture",
            description="Solar-powered autonomous field rover equipped with multispectral computer vision cameras for automated weed detection, soil moisture telemetry, and crop yield forecasting.",
            team=["Nikhil Kumar", "Sneha Patel"],
            department="ECE",
            year="2026",
            technologies=["ROS2", "PyTorch", "Raspberry Pi", "OpenCV"],
            github_url="https://github.com/srmap-innovation/agri-rover-ros",
            demo_url="https://rover.srmap.dev",
            organization_name="Tesla Lab",
            source_type="STUDENT",
            verification_status="VERIFIED",
        ),
        Project(
            id="proj-medchain",
            slug="medchain-decentralized-ehr",
            title="MedChain: Decentralized Health Records",
            description="Zero-knowledge privacy-preserving Electronic Health Record exchange allowing patients to grant granular cryptographic consent to doctors and hospitals without leaking diagnostic records.",
            team=["Sai Teja", "Ananya Rao"],
            department="CSE",
            year="2026",
            technologies=["Solidity", "Go", "Next.js", "IPFS"],
            github_url="https://github.com/srmap-innovation/medchain-zk",
            demo_url="https://medchain.srmap.dev",
            organization_name="Satoshi Lab",
            source_type="STUDENT",
            verification_status="VERIFIED",
        ),
        Project(
            id="proj-uav",
            slug="aeroglide-biomimetic-uav",
            title="AeroGlide: Biomimetic Tilt-Rotor UAV",
            description="High-efficiency hybrid tilt-rotor unmanned aerial vehicle designed for rapid long-range coastal surveillance and emergency medical delivery.",
            team=["Goutham Krishna", "Pooja V"],
            department="ECE",
            year="2026",
            technologies=["C++", "PX4 Autopilot", "Aerodynamics Modeling"],
            github_url="https://github.com/srmap-innovation/aeroglide-uav",
            demo_url="https://aeroglide.srmap.dev",
            organization_name="Tesla Lab",
            source_type="STUDENT",
            verification_status="VERIFIED",
        ),
    ]
    db.add_all(projects)
    db.commit()

    print("Seeding Organizations...")
    orgs = [
        Organization(
            id="org-nexttech",
            slug="next-tech-lab",
            name="Next Tech Lab",
            description="Student-run multidisciplinary innovation and research lab established in 2016. Recipient of QS Reimagine Education awards. Comprises Pausch (AR/VR/HCI), Turing (AI/Deep Learning), Satoshi (Blockchain/Cryptography), and Tesla (Hardware/IoT) labs.",
            type="LAB",
            department="Multidisciplinary",
            website_url="https://nexttechlab.io",
            social_links={"github": "https://github.com/NextTechLab", "x": "https://x.com/nexttechlab"},
            contact="team@nexttechlab.io",
            source_id="src-org-nexttech",
            source_type="ORGANIZATION",
            verification_status="VERIFIED",
        ),
        Organization(
            id="org-acm",
            slug="srm-ap-acm-chapter",
            name="SRM AP ACM Student Chapter",
            description="Official ACM student branch fostering algorithmic problem solving, competitive programming, systems research, and technical talk series. Regularly hosts hackathons and open-source sprints.",
            type="CHAPTER",
            department="CSE",
            website_url="https://srmap.acm.org",
            social_links={"github": "https://github.com/srmapacm", "linkedin": "https://linkedin.com/company/srmapacm"},
            contact="acm@srmap.edu.in",
            source_id="src-org-acm",
            source_type="ORGANIZATION",
            verification_status="VERIFIED",
        ),
        Organization(
            id="org-gdg",
            slug="gdg-on-campus-srm-ap",
            name="GDG on Campus SRM AP",
            description="Google Developer Groups student community organizing hands-on study jams in Android development, Google Cloud Platform, TensorFlow, and Flutter.",
            type="COMMUNITY",
            department="CSE & ECE",
            website_url="https://gdg.community.dev/gdg-on-campus-srm-university-ap",
            social_links={"linkedin": "https://linkedin.com/company/gdgsrmap"},
            contact="gdg@srmap.edu.in",
            source_id="src-org-gdg",
            source_type="ORGANIZATION",
            verification_status="VERIFIED",
        ),
        Organization(
            id="org-ennovab",
            slug="ennovab-e-cell",
            name="Ennovab — E-Cell SRM AP",
            description="Student entrepreneurship development cell organizing venture pitch competitions, angel investor summits, and founder incubation cohorts.",
            type="STUDENT_ORGANIZATION",
            department="Management & Technology",
            website_url="https://srmap.edu.in/ennovab",
            social_links={"instagram": "https://instagram.com/ennovab_srmap"},
            contact="ennovab@srmap.edu.in",
            source_id="src-official-main",
            source_type="ORGANIZATION",
            verification_status="VERIFIED",
        ),
    ]
    db.add_all(orgs)
    db.commit()

    print("Seeding Opportunities...")
    opps = [
        Opportunity(
            id="opp-fellowship",
            slug="ai-research-fellowship-2026",
            title="Undergraduate Research Fellowship in Machine Learning",
            description="Fully funded 6-month undergraduate research appointment with SRM AP AI Centre working on LLM parameter-efficient fine-tuning and retrieval-augmented generation.",
            company="SRM AP AI Centre",
            type="RESEARCH",
            deadline=now + timedelta(days=5),
            eligibility="2nd and 3rd year B.Tech students with proficiency in Python, PyTorch, and linear algebra.",
            apply_url="https://srmap.edu.in/research/ai-fellowship-apply",
            source_type="OFFICIAL",
            source_url="https://srmap.edu.in/research/ai-fellowship",
            verification_status="VERIFIED",
            status="ACTIVE",
        ),
        Opportunity(
            id="opp-cisco-intern",
            slug="cisco-software-internship-2026",
            title="Software Engineering Summer Internship 2026 — Cisco Systems",
            description="Cisco Systems campus placement drive for summer internships with pre-placement interview (PPI) opportunity. Focus on cloud networking and cybersecurity.",
            company="Cisco Systems",
            type="INTERNSHIP",
            deadline=now + timedelta(days=10),
            eligibility="3rd Year B.Tech CSE / ECE students with CGPA >= 8.0.",
            apply_url="https://srmap.edu.in/cdc/cisco-internship-2026",
            source_type="OFFICIAL",
            source_url="https://srmap.edu.in/cdc/cisco-internship-2026",
            verification_status="VERIFIED",
            status="ACTIVE",
        ),
        Opportunity(
            id="opp-sih-2026",
            slug="smart-india-hackathon-internal-screening",
            title="Smart India Hackathon (SIH 2026) Internal Campus Screening",
            description="University internal qualifier to nominate top 35 student teams for the national Smart India Hackathon organized by the Ministry of Education.",
            company="Ministry of Education / SRM AP",
            type="HACKATHON",
            deadline=now + timedelta(days=7),
            eligibility="All SRM AP students. Teams of 6 members including at least 1 female team member.",
            apply_url="https://srmap.edu.in/sih-2026-nominations",
            source_type="OFFICIAL",
            source_url="https://srmap.edu.in/sih-2026",
            verification_status="VERIFIED",
            status="ACTIVE",
        ),
    ]
    db.add_all(opps)
    db.commit()

    print("Seeding Documents and RAG Chunks...")
    docs = [
        Document(
            id="doc-regulations",
            slug="academic-regulations-btech-2026",
            title="Academic Regulations for B.Tech Degree Programs (2026-27)",
            description="Official statutory regulations governing curriculum structure, minimum 75% attendance criteria, grading policy on a 10-point scale, detention rules, and degree requirements.",
            document_type="REGULATION",
            file_url="https://srmap.edu.in/downloads/academic-regulations-btech-2026.pdf",
            source_url="https://srmap.edu.in/academics/regulations",
            source_id="src-official-main",
            source_type="OFFICIAL",
            published_at=now - timedelta(days=30),
            page_count=48,
            extracted_text="Section 4. Attendance Requirements: A student must maintain a minimum of 75% attendance in aggregate across all registered courses. Condonation up to 10% is permissible on medical grounds. Section 6: Grading scale uses 10-point GPA.",
            verification_status="VERIFIED",
        ),
        Document(
            id="doc-handbook",
            slug="student-handbook-code-of-conduct-2026",
            title="Student Handbook & Code of Conduct 2026",
            description="Comprehensive guide covering residential hostel rules, disciplinary norms, anti-ragging regulations, laboratory protocols, and campus facilities.",
            document_type="HANDBOOK",
            file_url="https://srmap.edu.in/downloads/student-handbook-2026.pdf",
            source_url="https://srmap.edu.in/student-affairs/handbook",
            source_id="src-official-dsa",
            source_type="OFFICIAL",
            published_at=now - timedelta(days=60),
            page_count=32,
            extracted_text="Campus discipline: Zero tolerance policy towards ragging in any form. Hostel curfew timings 9:30 PM on weekdays.",
            verification_status="VERIFIED",
        ),
    ]
    db.add_all(docs)
    db.commit()

    # RAG Chunks
    chunks = [
        DocumentChunk(
            id="chunk-att-1",
            document_id="doc-regulations",
            chunk_index=1,
            section="Section 4.1: Attendance Criteria",
            page_number=12,
            content="Every student is required to maintain a minimum of 75% attendance in aggregate across all registered courses in a semester. Failure to meet this requirement leads to detention from end-semester examinations ('I' grade).",
            metadata_json={"source_url": "https://srmap.edu.in/academics/regulations", "document_title": "Academic Regulations B.Tech 2026", "source_type": "OFFICIAL"},
        ),
        DocumentChunk(
            id="chunk-att-2",
            document_id="doc-regulations",
            chunk_index=2,
            section="Section 4.2: Condonation of Attendance",
            page_number=13,
            content="Condonation of shortage of attendance between 65% and 74% may be granted on medical grounds or official university representations, subject to recommendation by HoD and approval by Dean of Academic Affairs within 3 working days.",
            metadata_json={"source_url": "https://srmap.edu.in/academics/regulations", "document_title": "Academic Regulations B.Tech 2026", "source_type": "OFFICIAL"},
        ),
        DocumentChunk(
            id="chunk-grade-1",
            document_id="doc-regulations",
            chunk_index=3,
            section="Section 6.1: Grading System and CGPA",
            page_number=18,
            content="Performance is evaluated using letter grades on a 10-point scale: Outstanding O (10), Excellent A+ (9), Very Good A (8), Good B+ (7), Above Average B (6), Average C (5), Pass P (4), Fail F (0). Minimum passing mark in aggregate is 45%.",
            metadata_json={"source_url": "https://srmap.edu.in/academics/regulations", "document_title": "Academic Regulations B.Tech 2026", "source_type": "OFFICIAL"},
        ),
    ]
    db.add_all(chunks)
    db.commit()

    print("Seeding Initial Change Events...")
    changes = [
        ChangeEvent(
            id="chg-1",
            event_type="NEW_NOTICE",
            entity_type="Notice",
            entity_id="not-exam-timetable",
            summary="New urgent notice: End-Semester Examination Schedule Even 2026 released",
            details={"priority": "URGENT", "source": "Examination Branch"},
            source_id="src-official-exam",
            created_at=now - timedelta(hours=3),
        ),
        ChangeEvent(
            id="chg-2",
            event_type="NEW_EVENT",
            entity_type="Event",
            entity_id="ev-ai-workshop",
            summary="New event today: Building Agentic Systems Workshop",
            details={"venue": "ALC Seminar Hall", "organizer": "Next Tech Lab"},
            source_id="src-org-acm",
            created_at=now - timedelta(hours=6),
        ),
        ChangeEvent(
            id="chg-3",
            event_type="NEW_PROJECT",
            entity_type="Project",
            entity_id="proj-ar-nav",
            summary="New verified student project: SRM Campus Navigation AR",
            details={"department": "CSE", "team": "Aditya Sharma & team"},
            source_id="src-org-nexttech",
            created_at=now - timedelta(days=1),
        ),
    ]
    db.add_all(changes)
    db.commit()

    print("Seeding Sample Review Queue Items...")
    reviews = [
        ReviewItem(
            id="rev-1",
            entity_type="event",
            title="SRM AP Tech Summit 2026",
            raw_data={
                "title": "SRM AP Tech Summit 2026",
                "organizer": "Student Tech Committee",
                "proposed_date": "2026-10-25",
                "venue": "University Grounds",
                "summary": "Annual showcase of student innovations and enterprise pitches",
            },
            status="PENDING",
            submitted_by="Student Submission (Tarun K.)",
            source_url="https://techsummit2026.srmap.edu.in",
        ),
        ReviewItem(
            id="rev-2",
            entity_type="project",
            title="SRM Mess Food Quality Telemetry",
            raw_data={
                "title": "SRM Mess Food Quality Telemetry",
                "department": "Mechanical & CSE",
                "technologies": ["IoT", "Python", "MQTT"],
                "summary": "Real-time kitchen temperature & food freshness monitoring sensor network",
            },
            status="PENDING",
            submitted_by="Student Submission (Team SensorTech)",
            source_url="https://github.com/sensortech/mess-telemetry",
        ),
    ]
    db.add_all(reviews)
    db.commit()

    db.close()
    print("Database seeding completed successfully!")


if __name__ == "__main__":
    seed_database()
