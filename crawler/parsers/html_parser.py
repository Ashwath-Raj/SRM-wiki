from bs4 import BeautifulSoup
from typing import List, Dict, Optional
from crawler.normalizers.url_normalizer import normalize_url


class HTMLParser:
    @staticmethod
    def parse(html_content: str, current_url: str) -> Dict[str, any]:
        soup = BeautifulSoup(html_content, "html.parser")

        # Title
        title = ""
        if soup.title and soup.title.string:
            title = soup.title.string.strip()
        elif soup.find("h1"):
            title = soup.find("h1").get_text(strip=True)

        # Meta description
        description = ""
        meta_desc = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
        if meta_desc and meta_desc.get("content"):
            description = meta_desc["content"].strip()

        # Remove scripts, styles, nav, footer for cleaner content
        for tag in soup(["script", "style", "nav", "footer", "noscript", "svg"]):
            tag.decompose()

        # Clean text
        text_content = " ".join(soup.stripped_strings)

        # Extract links
        links: List[str] = []
        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"].strip()
            if href and not href.startswith(("javascript:", "mailto:", "tel:", "#")):
                normalized = normalize_url(href, base_url=current_url)
                if normalized not in links:
                    links.append(normalized)

        return {
            "title": title,
            "description": description,
            "content": text_content,
            "links": links,
        }
