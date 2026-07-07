#!/usr/bin/env python3
"""
Splits the monolithic index.html into a multi-page brand book.
- Extracts <style> → assets/styles.css (+ adds sidebar/layout css)
- For each <section id="..."> → sections/<id>.html
- Generates new landing index.html with hero + sidebar + TOC
- Each section page shares: <head>, sidebar nav, footer
"""
import re
import os
import sys
from pathlib import Path

ROOT = Path("/sessions/happy-wonderful-einstein/mnt/DreamCar.AI/dreamcar-brand-book")
SRC = ROOT / "index.html"
ASSETS = ROOT / "assets"
SECTIONS = ROOT / "sections"

ASSETS.mkdir(exist_ok=True)
SECTIONS.mkdir(exist_ok=True)

src = SRC.read_text(encoding="utf-8")

# ------------------------------------------------------------------
# 1) Extract <style> block  →  assets/styles.css
# ------------------------------------------------------------------
m = re.search(r"<style>(.*?)</style>", src, flags=re.S)
assert m, "No <style> block found"
css_body = m.group(1).strip()

extra_css = """
/* === MULTI-PAGE LAYOUT (added in v3.0) === */
:root { --sidebar-w: 280px; }
body.has-sidebar { display: flex; min-height: 100vh; }

.sidebar {
  width: var(--sidebar-w);
  flex: 0 0 var(--sidebar-w);
  background: var(--coal);
  border-right: 1px solid var(--line);
  padding: 28px 22px 32px;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  overflow-y: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}
.sidebar .brand-mark {
  font-family: 'Archivo Black', sans-serif;
  font-size: 18px;
  letter-spacing: 0.04em;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 4px;
  display: block;
  text-decoration: none;
}
.sidebar .brand-mark .red { color: var(--red); }
.sidebar .brand-tag { color: var(--ash); font-size: 10px; letter-spacing: 0.2em; margin-bottom: 24px; display: block; }

.sidebar .group { margin-bottom: 18px; }
.sidebar .group-title {
  color: var(--red);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: block;
  font-weight: 700;
}
.sidebar nav { display: flex; flex-direction: column; gap: 2px; }
.sidebar nav a {
  display: block;
  color: var(--bone);
  text-decoration: none;
  padding: 7px 10px;
  border-left: 2px solid transparent;
  letter-spacing: 0.04em;
  line-height: 1.4;
  transition: color 120ms, background 120ms, border-color 120ms;
}
.sidebar nav a:hover {
  color: var(--white);
  background: rgba(227,6,19,0.08);
  border-left-color: var(--red);
}
.sidebar nav a.active {
  color: var(--white);
  background: rgba(227,6,19,0.14);
  border-left-color: var(--red);
  font-weight: 700;
}
.sidebar .num {
  color: var(--ash);
  margin-right: 8px;
  font-weight: 400;
}

.sidebar .foot {
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  color: var(--ash);
  font-size: 10px;
  line-height: 1.6;
  letter-spacing: 0.06em;
}
.sidebar .foot a { color: var(--bone); text-decoration: none; }

.main {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0;
}

.topbar {
  display: none;
  background: var(--coal);
  border-bottom: 1px solid var(--line);
  padding: 14px 20px;
  position: sticky;
  top: 0;
  z-index: 50;
  align-items: center;
  justify-content: space-between;
}
.topbar .brand-mark {
  font-family: 'Archivo Black', sans-serif;
  font-size: 16px;
  letter-spacing: 0.04em;
  color: var(--white);
  text-decoration: none;
}
.topbar .brand-mark .red { color: var(--red); }
.topbar button.menu-toggle {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--white);
  padding: 8px 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.section-bread {
  padding: 24px 32px 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--ash);
}
.section-bread a { color: var(--bone); text-decoration: none; }
.section-bread a:hover { color: var(--white); }

.section-page-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 32px;
  border-top: 1px solid var(--line);
  background: var(--coal);
  margin-top: 64px;
}
.section-page-nav a {
  flex: 1;
  padding: 18px 20px;
  border: 1px solid var(--line);
  text-decoration: none;
  color: var(--bone);
  background: var(--black);
  transition: border-color 120ms, color 120ms;
}
.section-page-nav a:hover { color: var(--white); border-color: var(--red); }
.section-page-nav .nav-label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--red);
  margin-bottom: 6px;
}
.section-page-nav .nav-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  letter-spacing: 0.02em;
  line-height: 1.1;
  color: var(--white);
}
.section-page-nav .next { text-align: right; }
.section-page-nav .prev:only-child { max-width: 50%; }

@media (max-width: 900px) {
  body.has-sidebar { flex-direction: column; }
  .sidebar {
    position: fixed;
    left: 0; top: 0;
    width: 84%;
    max-width: 320px;
    height: 100vh;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 220ms cubic-bezier(0.2,0.9,0.3,1);
    box-shadow: 8px 0 32px rgba(0,0,0,0.6);
  }
  body.sidebar-open .sidebar { transform: translateX(0); }
  body.sidebar-open::after {
    content: '';
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 90;
  }
  .topbar { display: flex; }
  .section-page-nav { flex-direction: column; gap: 12px; }
  .section-page-nav .next { text-align: left; }
}

/* Landing TOC card grid */
.toc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  padding: 32px;
}
.toc-card {
  background: var(--coal);
  border: 1px solid var(--line);
  padding: 22px;
  text-decoration: none;
  color: var(--white);
  display: block;
  transition: border-color 120ms, transform 120ms;
}
.toc-card:hover {
  border-color: var(--red);
  transform: translateY(-2px);
}
.toc-card .num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  color: var(--red);
  display: block;
  margin-bottom: 8px;
}
.toc-card .name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  letter-spacing: 0.02em;
  line-height: 1.1;
  margin-bottom: 8px;
}
.toc-card .desc {
  font-family: 'Manrope', sans-serif;
  font-size: 12px;
  color: var(--bone);
  line-height: 1.5;
}
"""

(ASSETS / "styles.css").write_text(css_body + "\n\n" + extra_css, encoding="utf-8")
print(f"✓ Wrote assets/styles.css ({len(css_body) + len(extra_css)} bytes)")

# ------------------------------------------------------------------
# 2) Section catalog
# ------------------------------------------------------------------
# Order matches the original file. (id, num, group, title, summary)
catalog = [
    ("quickstart",      "00",  "start",   "Quick Start", "Шпаргалка для підрядників на 1 екран."),
    ("manifesto",       "01",  "strategy","Маніфест", "Душа бренду. Те, на що звіряємось."),
    ("strategy",        "02",  "strategy","Стратегія", "Місія, бачення, цінності, УТП, архетип."),
    ("personas",        "03",  "strategy","Аудиторія", "4 портрети за тригерами, не за демографією."),
    ("compete",         "04",  "strategy","Контекст ринку", "Чим ми відрізняємось — без гри в конкурентів."),
    ("logo",            "05",  "visual", "Логотип", "Racing Plate і правила використання."),
    ("avatar-mark",     "05B", "visual", "Avatar Mark", "DC-монограма для соцмереж і favicon."),
    ("colors",          "06",  "visual", "Кольори", "Палітра, пропорції, контраст."),
    ("typo",            "07",  "visual", "Типографіка", "4 шрифти, 11-рівнева шкала."),
    ("spacing",         "08",  "visual", "Відступи і сітка", "База 4px, без проміжних значень."),
    ("elements",        "09",  "visual", "Візуальні елементи", "Іконки, патерни, декоративні рішення."),
    ("components",      "10",  "ui",     "UI-компоненти", "Кнопки, форми, поля."),
    ("motion",          "11",  "ui",     "Анімації", "Тривалості, easing, переходи."),
    ("voice",           "12",  "voice",  "Тон голосу", "Як говоримо в кожному каналі."),
    ("legal-language",  "12B", "voice",  "Юридична мова", "DO / CAREFUL / NEVER словник."),
    ("content",         "13",  "voice",  "Контент", "Рубрики, хештеги, FAQ."),
    ("crisis",          "14",  "voice",  "Кризові комунікації", "7 готових скриптів реакції."),
    ("partners",        "15",  "partners","Партнери", "Бриф із 7 питань і правила лого."),
    ("trust",           "16",  "partners","Довіра і доступність", "Trust-сигнали + WCAG 2.1 AA."),
    ("tokens",          "17",  "tech",   "Design tokens", "JSON для Figma + CSS-змінні."),
    ("apps",            "18",  "tech",   "Asset Library", "Де лежать файли."),
    ("audio",           "19",  "tech",   "Аудіо-айдентика", "Інтро, заставка, переходи."),
    ("email",           "20",  "touch",  "Email", "Шаблони листів."),
    ("touchpoints",     "21",  "touch",  "Точки контакту", "Customer journey і UX-критичні моменти."),
    ("photo",           "22",  "touch",  "Фото-режисура", "Як знімаємо переможців і авто."),
    ("merch",           "23",  "touch",  "Мерч", "Що друкуємо і як."),
    ("empty",           "24",  "status", "Empty states", "Сторінки помилок і порожні стани."),
    ("metrics",         "25",  "status", "Метрики", "Що міряємо і як інтерпретуємо."),
    ("roadmap",         "26",  "status", "Roadmap", "Що зроблено, що далі."),
]

groups = {
    "start":    ("00", "На старт"),
    "strategy": ("01", "Стратегія"),
    "visual":   ("02", "Візуальна система"),
    "ui":       ("03", "Інтерфейс"),
    "voice":    ("04", "Голос і контент"),
    "partners": ("05", "Партнери і довіра"),
    "tech":     ("06", "Техніка"),
    "touch":    ("07", "Точки контакту"),
    "status":   ("08", "Стан і метрики"),
}

# ------------------------------------------------------------------
# 3) Extract each <section> body
# ------------------------------------------------------------------
section_bodies = {}
for i, (sid, num, grp, title, _) in enumerate(catalog):
    # Match <section id="sid" ...> ... </section>
    pattern = rf'<section id="{re.escape(sid)}"[^>]*>(.*?)</section>'
    sm = re.search(pattern, src, flags=re.S)
    if not sm:
        print(f"⚠ Section '{sid}' NOT FOUND")
        section_bodies[sid] = "<!-- section not found -->"
    else:
        section_bodies[sid] = sm.group(0)  # full <section>…</section>
print(f"✓ Extracted {sum(1 for v in section_bodies.values() if 'not found' not in v)} sections")

# ------------------------------------------------------------------
# 4) Sidebar HTML fragment generator
# ------------------------------------------------------------------
def sidebar_html(active_id=None):
    rows = ['<aside class="sidebar">']
    rows.append('<a href="index.html" class="brand-mark">DREAM<span class="red">CAR</span></a>')
    rows.append('<span class="brand-tag">BRAND BOOK · v3.0</span>')

    # Group sections
    by_group = {}
    for sid, num, grp, title, _ in catalog:
        by_group.setdefault(grp, []).append((sid, num, title))

    for gkey, (gnum, gtitle) in groups.items():
        if gkey not in by_group:
            continue
        rows.append('<div class="group">')
        rows.append(f'<span class="group-title">{gtitle}</span>')
        rows.append('<nav>')
        for sid, num, title in by_group[gkey]:
            cls = ' class="active"' if sid == active_id else ''
            rows.append(f'<a href="sections/{sid}.html"{cls}><span class="num">{num}</span>{title}</a>')
        rows.append('</nav>')
        rows.append('</div>')

    rows.append('<div class="foot">vg@dreamcar.ua<br>ТОВ «ПЛЕТФОКС» · 44236899<br>'
                '<a href="https://dreamcar.ua">dreamcar.ua</a></div>')
    rows.append('</aside>')
    return "\n".join(rows)

# Sidebar that links from /sections/ pages → relative path is ../
def sidebar_html_for_section(active_id):
    html = sidebar_html(active_id)
    # adjust href="sections/.." → href="../sections/.." → href="other.html" (same dir)
    html = html.replace('href="sections/', 'href="')
    html = html.replace('href="index.html"', 'href="../index.html"')
    return html

# ------------------------------------------------------------------
# 5) Page template
# ------------------------------------------------------------------
HEAD_TEMPLATE = """<!DOCTYPE html>
<html lang="uk" style="background:#0A0A0A;color-scheme:dark;">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0A0A0A">
<meta name="supported-color-schemes" content="dark">
<title>{title} · DreamCar Brand Book</title>
<meta name="description" content="DreamCar Brand Book — {title}.">
<link rel="icon" href="{root}favicon.svg" type="image/svg+xml">
<link rel="icon" sizes="32x32" href="{root}favicon-32.png">
<link rel="apple-touch-icon" href="{root}apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo+Black&family=Manrope:wght@400;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{root}assets/styles.css">
</head>
<body class="has-sidebar" style="background:#0A0A0A;color:#FFFFFF;">

<header class="topbar">
  <a href="{root}index.html" class="brand-mark">DREAM<span class="red">CAR</span> · BRAND BOOK</a>
  <button class="menu-toggle" type="button" onclick="document.body.classList.toggle('sidebar-open')">МЕНЮ</button>
</header>

{sidebar}

<main class="main" id="main">
{breadcrumbs}
{body}
{pagenav}
</main>

<script>
// Close mobile sidebar when clicking a link
document.querySelectorAll('.sidebar nav a').forEach(a => {{
  a.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
}});
// Close on backdrop click
document.body.addEventListener('click', (e) => {{
  if (e.target === document.body && document.body.classList.contains('sidebar-open')) {{
    document.body.classList.remove('sidebar-open');
  }}
}});
</script>
</body>
</html>
"""

def page_nav(idx):
    """Prev/Next nav at bottom of section page."""
    parts = ['<nav class="section-page-nav">']
    if idx > 0:
        psid, pnum, _, ptitle, _ = catalog[idx-1]
        parts.append(
            f'<a href="{psid}.html" class="prev">'
            f'<span class="nav-label">← {pnum} ПОПЕРЕДНІЙ</span>'
            f'<span class="nav-title">{ptitle}</span></a>'
        )
    if idx < len(catalog) - 1:
        nsid, nnum, _, ntitle, _ = catalog[idx+1]
        parts.append(
            f'<a href="{nsid}.html" class="next">'
            f'<span class="nav-label">{nnum} НАСТУПНИЙ →</span>'
            f'<span class="nav-title">{ntitle}</span></a>'
        )
    parts.append('</nav>')
    return "\n".join(parts)

def breadcrumb(num, title, root):
    return (f'<div class="section-bread">'
            f'<a href="{root}index.html">DREAMCAR BRAND BOOK</a> &nbsp;/&nbsp; '
            f'<span style="color:var(--white);">{num} · {title}</span>'
            f'</div>')

# ------------------------------------------------------------------
# 6) Write each section page
# ------------------------------------------------------------------
for i, (sid, num, grp, title, _summary) in enumerate(catalog):
    body = section_bodies[sid]
    page_html = HEAD_TEMPLATE.format(
        title=f"{num} {title}",
        root="../",
        sidebar=sidebar_html_for_section(sid),
        breadcrumbs=breadcrumb(num, title, "../"),
        body=body,
        pagenav=page_nav(i),
    )
    (SECTIONS / f"{sid}.html").write_text(page_html, encoding="utf-8")
print(f"✓ Wrote {len(catalog)} section pages")

# ------------------------------------------------------------------
# 7) Generate new landing index.html
# ------------------------------------------------------------------
# Use the existing hero (top of body before <section id="quickstart">) as landing intro
body_match = re.search(r'<body[^>]*>(.*?)<section id="quickstart"', src, flags=re.S)
hero_block = body_match.group(1).strip() if body_match else ""

# Replace inline color attrs to keep dark (already set on body class)
# Build TOC grid
toc_cards = []
for sid, num, grp, title, summary in catalog:
    toc_cards.append(
        f'<a href="sections/{sid}.html" class="toc-card">'
        f'<span class="num">/// {num}</span>'
        f'<div class="name">{title.upper()}</div>'
        f'<div class="desc">{summary}</div></a>'
    )
toc_grid = '<section style="padding: 0 0 32px;"><div class="s-num" style="padding: 24px 32px 0;">/// ЗМІСТ</div>' \
           '<h2 class="s-title" style="padding: 0 32px 8px;">29 РОЗДІЛІВ <span class="red">ОДНИМ КЛАЦАННЯМ</span></h2>' \
           f'<div class="toc-grid">{"".join(toc_cards)}</div></section>'

landing_body = hero_block + toc_grid

landing_html = HEAD_TEMPLATE.format(
    title="DreamCar Brand Book",
    root="",
    sidebar=sidebar_html(active_id=None),
    breadcrumbs='',
    body=landing_body,
    pagenav='',
)
(ROOT / "index.html").write_text(landing_html, encoding="utf-8")
print(f"✓ Wrote new index.html (landing, {len(landing_html)} bytes)")
print("\nDONE.")
