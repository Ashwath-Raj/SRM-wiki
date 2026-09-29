import pytest
from crawler.normalizers.url_normalizer import normalize_url
from crawler.deduplication.hasher import compute_content_hash
from crawler.parsers.html_parser import HTMLParser
from crawler.fetcher.fetcher import CrawlerFetcher


def test_url_normalization():
    # Remove fragments and tracking params
    raw = "HTTPS://SRMAP.EDU.IN/examination/schedule?utm_source=twitter&ref=share#timetable"
    normalized = normalize_url(raw)
    assert normalized == "https://srmap.edu.in/examination/schedule"

    # Resolves relative URL
    base = "https://srmap.edu.in/student-affairs"
    rel = "/student-affairs/clubs"
    assert normalize_url(rel, base_url=base) == "https://srmap.edu.in/student-affairs/clubs"


def test_content_hashing():
    content_a = "  SRM University-AP Exam schedule 2026.  "
    content_b = "srm university-ap exam schedule 2026."
    content_c = "Different content entirely."

    hash_a = compute_content_hash(content_a)
    hash_b = compute_content_hash(content_b)
    hash_c = compute_content_hash(content_c)

    assert hash_a == hash_b
    assert hash_a != hash_c


def test_html_parsing():
    html = """
    <!DOCTYPE html>
    <html>
      <head>
        <title>Mid-Sem Examination Circular</title>
        <meta name="description" content="Official schedule for 2026 mid-sem evaluations">
      </head>
      <body>
        <nav><a href="/home">Home</a></nav>
        <h1>Mid-Sem Examination Circular</h1>
        <p>The examinations will commence from 15th October 2026.</p>
        <a href="/downloads/schedule.pdf">Download Schedule</a>
        <script>console.log("ignore me");</script>
      </body>
    </html>
    """
    parsed = HTMLParser.parse(html, "https://srmap.edu.in/examination")
    assert parsed["title"] == "Mid-Sem Examination Circular"
    assert "Official schedule" in parsed["description"]
    assert "15th October 2026" in parsed["content"]
    assert "console.log" not in parsed["content"]
    assert "https://srmap.edu.in/downloads/schedule.pdf" in parsed["links"]


def test_allowlist_domain_filtering():
    fetcher = CrawlerFetcher()
    assert fetcher.is_url_allowed("https://srmap.edu.in/examination") is True
    assert fetcher.is_url_allowed("https://nexttechlab.io/projects") is True
    assert fetcher.is_url_allowed("https://srmap.acm.org") is True
    assert fetcher.is_url_allowed("https://unrelated-domain-random.com/phishing") is False
