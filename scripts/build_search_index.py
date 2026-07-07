#!/usr/bin/env python3
"""
Build search-index.json for sidebar.js full-text search.

For each section in sections/*.html extracts clean text from
headings, paragraphs, list items and table cells, normalizes
whitespace, and writes a compact JSON index to assets/search-index.json.
"""
import json
import os
import re
import sys
from datetime import datetime, timezone
from html.parser import HTMLParser

SECTION_TITLES = {
    'quickstart.html':        'Quick Start',
    'onboarding.html':        'Onboarding 10хв',
    'tools.html':             'Brand Tools',
    'generator.html':         'Post Generator',
    'manifesto.html':         'Маніфест',
    'strategy.html':          'Стратегія',
    'personas.html':          'Аудиторія',
    'compete.html':           'Контекст ринку',
    'logo.html':              'Логотип',
    'colors.html':            'Кольори',
    'typo.html':              'Типографіка',
    'spacing.html':           'Сітка та елементи',
    'components.html':        'UI-компоненти',
    'motion.html':            'Анімації',
    'mobile.html':            'Mobile-First',
    'voice.html':             'Голос і мова',
    'legal.html':             'Legal-safe лексикон',
    'content.html':           'Контент',
    'crisis.html':            'Кризові комунікації',
    'examples.html':          'Examples Library',
    'partners.html':          'Партнери',
    'trust.html':             'Довіра і доступність',
    'tokens.html':            'Дизайн-ресурси',
    'audio.html':             'Стиль медіа',
    'photography-brief.html': 'Photography Brief',
    'touchpoints.html':       'Точки контакту',
    'merch.html':             'Мерч',
    'metrics.html':           'Метрики · Roadmap',
    'support.html':           'Регламент підтримки',
    'ai-content.html':        'AI-контент',
}

HEADING_TAGS = {'h1', 'h2', 'h3', 'h4'}
SKIP_TAGS = {'script', 'style', 'noscript', 'svg', 'template'}


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.in_heading = []
        self.heading_buf = []
        self.text_parts = []
        self.headings = []

    def handle_starttag(self, tag, attrs):
        if tag in SKIP_TAGS:
            self.skip_depth += 1
        if tag in HEADING_TAGS:
            self.in_heading.append(tag)
            self.heading_buf.append('')

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS and self.skip_depth > 0:
            self.skip_depth -= 1
        if tag in HEADING_TAGS and self.in_heading:
            txt = self.heading_buf.pop().strip()
            self.in_heading.pop()
            if txt:
                self.headings.append(txt)
                self.text_parts.append(txt)

    def handle_data(self, data):
        if self.skip_depth > 0:
            return
        if not data.strip():
            return
        if self.in_heading:
            self.heading_buf[-1] += data
        self.text_parts.append(data)


def clean(s: str) -> str:
    s = re.sub(r'\s+', ' ', s)
    return s.strip()


def extract(path: str):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    title_match = re.search(r'<title[^>]*>([^<]*)</title>', html, re.I)
    title = clean(title_match.group(1)) if title_match else ''
    parser = TextExtractor()
    try:
        parser.feed(html)
    except Exception:
        pass
    headings = [clean(h) for h in parser.headings if clean(h)]
    text = clean(' '.join(parser.text_parts))
    if len(text) > 4000:
        text = text[:4000]
    return title, headings, text


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sections_dir = os.path.join(root, 'sections')
    out_path = os.path.join(root, 'assets', 'search-index.json')

    entries = []
    for fname, default_title in SECTION_TITLES.items():
        fpath = os.path.join(sections_dir, fname)
        if not os.path.isfile(fpath):
            print(f'  ! missing: {fname}', file=sys.stderr)
            continue
        title, headings, text = extract(fpath)
        entries.append({
            'file': fname,
            'title': default_title,
            'page_title': title,
            'headings': headings[:40],
            'text': text,
        })
        print(f'  + {fname:<26} {len(text):>5} chars · {len(headings):>2} headings')

    index = {
        'version': '1',
        'generated': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        'sections': entries,
    }
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, separators=(',', ':'))
    size_kb = os.path.getsize(out_path) / 1024
    print(f'\nWrote {out_path}  ({size_kb:.1f} KB, {len(entries)} sections)')


if __name__ == '__main__':
    main()
