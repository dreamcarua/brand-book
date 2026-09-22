#!/usr/bin/env python3
"""
One source of navigation: the SECTIONS block in assets/sidebar.js.

Reads it and rewrites, idempotently:
  - index.html      landing table of contents (between <!-- TOC:START --> and <!-- TOC:END -->)
  - sections/*.html <title>, breadcrumb, the page kicker (plate) and the static prev/next nav
Other scripts import `sections()` from here (build_print.py, build_search_index.py).

Run: python3 scripts/build_nav.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SIDEBAR = ROOT / "assets" / "sidebar.js"
VERSION = "4.3"


def groups():
    src = SIDEBAR.read_text(encoding="utf-8")
    block = re.search(r"const SECTIONS = \{(.*?)\n  \};", src, re.S).group(1)
    out, cur = [], None
    for line in block.splitlines():
        g = re.match(r"\s*'([^']+)': \[", line)
        if g:
            cur = {"title": g.group(1), "items": []}
            out.append(cur)
            continue
        m = re.search(r"num: '([^']+)', name: '([^']+)', file: '([^']+)', desc: '([^']*)'", line)
        if m and cur is not None:
            cur["items"].append({"num": m.group(1), "name": m.group(2), "file": m.group(3), "desc": m.group(4)})
    return [g for g in out if g["items"]]


def sections():
    return [dict(it, group=g["title"]) for g in groups() for it in g["items"]]


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_toc():
    parts = ['<!-- TOC:START -->\n<section class="lp-block" id="toc" aria-labelledby="toc-title">\n'
             '  <div class="plate-k"><span class="pk-num">04</span><span class="pk-name">Зміст</span></div>\n'
             f'  <h2 class="lp-title" id="toc-title">{len(sections())} розділів книги</h2>\n']
    for g in groups():
        parts.append(f'  <h3 class="toc-group">{esc(g["title"])}</h3>\n  <div class="toc-grid">\n')
        for it in g["items"]:
            parts.append(f'    <a href="sections/{it["file"]}" class="toc-card"><span class="num">{it["num"]}</span>'
                         f'<span class="name">{esc(it["name"])}</span><span class="desc">{esc(it["desc"])}</span></a>\n')
        parts.append('  </div>\n')
    parts.append('</section>\n<!-- TOC:END -->')
    return "".join(parts)


def update_index():
    p = ROOT / "index.html"
    s = p.read_text(encoding="utf-8")
    toc = build_toc()
    if "<!-- TOC:START -->" in s:
        s = re.sub(r"<!-- TOC:START -->.*?<!-- TOC:END -->", lambda m: toc, s, flags=re.S)
    else:
        s = re.sub(r"<!-- TOC -->.*?(?=\n\n<footer)", lambda m: toc, s, count=1, flags=re.S)
    p.write_text(s, encoding="utf-8")


def plate(num, name):
    return f'<div class="s-num plate-k"><span class="pk-num">{num}</span><span class="pk-name">{esc(name)}</span></div>'


def update_sections():
    items = sections()
    for i, it in enumerate(items):
        p = ROOT / "sections" / it["file"]
        if not p.exists():
            print("  ! missing", it["file"])
            continue
        s = p.read_text(encoding="utf-8")
        label = f'{it["num"]} {it["name"]}'
        s = re.sub(r"<title>.*?</title>", f"<title>{esc(label)} · DreamCar Brand Book</title>", s, count=1, flags=re.S)
        # breadcrumb current item
        s = re.sub(r'(<div class="section-bread">.*?<span style="color:var\(--white\);">)(.*?)(</span>)',
                   lambda m: m.group(1) + f'{it["num"]} · {esc(it["name"])}' + m.group(3), s, count=1, flags=re.S)
        # page kicker: first s-num inside <main>
        main_at = s.find("<main")
        head, body = s[:main_at], s[main_at:]
        body = re.sub(r'<div class="s-num[^"]*"[^>]*>.*?</div>', plate(it["num"], it["name"]), body, count=1, flags=re.S)
        s = head + body
        # static prev/next (sidebar.js re-renders the same at runtime)
        prev_it = items[i - 1] if i > 0 else None
        next_it = items[i + 1] if i + 1 < len(items) else None
        def link(x, cls, lbl):
            return f'<a href="{x["file"]}" class="{cls}"><span class="nav-label">{lbl}</span><span class="nav-title">{esc(x["name"])}</span></a>'
        home = lambda cls: f'<a href="../index.html" class="{cls}"><span class="nav-label">↑ ЗМІСТ</span><span class="nav-title">Brand Book</span></a>'
        nav = ('<nav class="section-page-nav" aria-label="Попередній і наступний розділ">\n'
               + (link(prev_it, "prev", f'← {prev_it["num"]} ПОПЕРЕДНІЙ') if prev_it else home("prev")) + "\n"
               + (link(next_it, "next", f'{next_it["num"]} НАСТУПНИЙ →') if next_it else home("next")) + "\n</nav>")
        s = re.sub(r'<nav class="section-page-nav"[^>]*>.*?</nav>', nav, s, count=1, flags=re.S)
        p.write_text(s, encoding="utf-8")


if __name__ == "__main__":
    update_index()
    update_sections()
    print(f"nav: {len(sections())} sections in {len(groups())} groups")
