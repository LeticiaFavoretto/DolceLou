#!/usr/bin/env python3
"""Check relative and root-relative asset paths referenced by the static HTML."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

STATIC = Path(__file__).resolve().parents[1] / "src/main/resources/static"

class AssetParser(HTMLParser):
    def __init__(self, html_file):
        super().__init__()
        self.html_file = html_file
        self.errors = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        asset = None
        if tag in {"script", "img", "source"}:
            asset = attrs.get("src")
        elif tag == "link" and "stylesheet" in attrs.get("rel", "").lower().split():
            asset = attrs.get("href")
        if not asset or asset.startswith(("//", "data:", "blob:")):
            return
        parsed = urlsplit(asset)
        if parsed.scheme or parsed.netloc or not parsed.path:
            return
        path = unquote(parsed.path)
        expected = (STATIC / path.lstrip("/")) if path.startswith("/") else (self.html_file.parent / path)
        if not expected.is_file():
            self.errors.append(f"{self.html_file.relative_to(STATIC)}: missing {asset}")

def main():
    html_files = sorted(STATIC.glob("*.html"))
    if not html_files:
        print("ERROR: no HTML pages found", file=sys.stderr)
        return 1
    errors = []
    for html_file in html_files:
        parser = AssetParser(html_file)
        parser.feed(html_file.read_text(encoding="utf-8"))
        errors.extend(parser.errors)
    for error in errors:
        print("ERROR:", error, file=sys.stderr)
    print(f"Checked {len(html_files)} HTML files; missing local assets: {len(errors)}")
    return int(bool(errors))

if __name__ == "__main__":
    raise SystemExit(main())
