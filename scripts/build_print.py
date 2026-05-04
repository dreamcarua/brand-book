#!/usr/bin/env python3
"""
Builds print.html — single page that contains all 29 sections
inline, optimized for browser Print → Save as PDF.
"""
import re
from pathlib import Path

ROOT = Path("/sessions/happy-wonderful-einstein/mnt/DreamCar.AI/dreamcar-brand-book")
SECTIONS = ROOT / "sections"

# Same order as split.py
catalog = [
    ("quickstart", "00", "Quick Start"),
    ("manifesto", "01", "Маніфест"),
    ("strategy", "02", "Стратегія"),
    ("personas", "03", "Аудиторія"),
    ("compete", "04", "Контекст ринку"),
    ("logo", "05", "Логотип"),
    ("avatar-mark", "05B", "Avatar Mark"),
    ("colors", "06", "Кольори"),
    ("typo", "07", "Типографіка"),
    ("spacing", "08", "Відступи і сітка"),
    ("elements", "09", "Візуальні елементи"),
    ("components", "10", "UI-компоненти"),
    ("motion", "11", "Анімації"),
    ("voice", "12", "Тон голосу"),
    ("legal-language", "12B", "Юридична мова"),
    ("content", "13", "Контент"),
    ("crisis", "14", "Кризові комунікації"),
    ("partners", "15", "Партнери"),
    ("trust", "16", "Довіра і доступність"),
    ("tokens", "17", "Design tokens"),
    ("apps", "18", "Asset Library"),
    ("audio", "19", "Аудіо-айдентика"),
    ("email", "20", "Email"),
    ("touchpoints", "21", "Точки контакту"),
    ("photo", "22", "Фото-режисура"),
    ("merch", "23", "Мерч"),
    ("empty", "24", "Empty states"),
    ("metrics", "25", "Метрики"),
    ("roadmap", "26", "Roadmap"),
]

def extract_section(sid):
    """Pull <section>...</section> body from sections/<sid>.html."""
    f = SECTIONS / f"{sid}.html"
    h = f.read_text(encoding="utf-8")
    m = re.search(rf'<section id="{re.escape(sid)}"[^>]*>(?:.*?)</section>', h, flags=re.S)
    if not m:
        m2 = re.search(r'<main[^>]*>(.*?)</main>', h, flags=re.S)
        body = m2.group(1) if m2 else f"<!-- {sid} not found -->"
    else:
        body = m.group(0)
    # Path normalization: section files are in /sections/, print.html is at root
    body = body.replace('href="../assets/', 'href="assets/')
    body = body.replace('src="../assets/', 'src="assets/')
    body = body.replace('href="../', 'href="')
    return body

# Build TOC
toc_items = "\n".join(
    f'<li><a href="#{sid}"><span class="num">{num}</span> {title}</a></li>'
    for sid, num, title in catalog
)

# Concat sections (with anchor IDs preserved)
sections_html = "\n\n<!-- ============================ -->\n\n".join(
    extract_section(sid) for sid, _, _ in catalog
)

print_html = f"""<!DOCTYPE html>
<html lang="uk" style="background:#0A0A0A;color-scheme:dark;">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0A0A0A">
<title>DreamCar Brand Book v3.0 · Версія для друку</title>
<meta name="description" content="DreamCar Brand Book v3.0 — повна друкована версія всіх 29 розділів.">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Archivo+Black&family=Manrope:wght@400;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/styles.css">
<style>
/* Print-page specific */
.print-toolbar {{
  position: sticky; top: 0; z-index: 100;
  background: var(--black);
  border-bottom: 1px solid var(--line);
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}}
.print-toolbar .info {{
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--bone);
}}
.print-toolbar .actions {{ display: flex; gap: 12px; flex-wrap: wrap; }}
.print-toolbar .btn-link {{
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  padding: 8px 16px;
  border: 1px solid var(--line);
  color: var(--bone);
  background: transparent;
  text-decoration: none;
  cursor: pointer;
}}
.print-toolbar .btn-link.primary {{ background: var(--red); color: var(--white); border-color: var(--red); }}
.print-toolbar .btn-link:hover {{ border-color: var(--red); color: var(--white); }}

.print-cover {{
  padding: 96px 32px;
  text-align: center;
  border-bottom: 1px solid var(--line);
}}
.print-cover .ver {{ font-family: 'JetBrains Mono', monospace; color: var(--red); font-size: 12px; letter-spacing: 0.3em; margin-bottom: 24px; }}
.print-cover h1 {{ font-family: 'Bebas Neue', sans-serif; font-size: 84px; line-height: 0.9; letter-spacing: 0.02em; color: var(--white); margin-bottom: 16px; }}
.print-cover h1 .red {{ color: var(--red); }}
.print-cover .sub {{ font-size: 14px; color: var(--bone); margin-top: 12px; max-width: 540px; margin-left: auto; margin-right: auto; line-height: 1.6; }}
.print-cover .meta {{ margin-top: 48px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.2em; color: var(--ash); }}

.print-toc {{
  padding: 32px;
  border-bottom: 1px solid var(--line);
}}
.print-toc h2 {{ font-family: 'Bebas Neue', sans-serif; font-size: 32px; letter-spacing: 0.02em; color: var(--white); margin-bottom: 16px; }}
.print-toc ol {{ list-style: none; padding: 0; column-count: 2; column-gap: 32px; }}
.print-toc li {{ break-inside: avoid; margin-bottom: 6px; }}
.print-toc li a {{ color: var(--bone); text-decoration: none; font-size: 14px; line-height: 1.7; }}
.print-toc li a:hover {{ color: var(--white); }}
.print-toc .num {{ color: var(--red); font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-right: 10px; letter-spacing: 0.16em; }}

@media (max-width: 700px) {{
  .print-toc ol {{ column-count: 1; }}
  .print-cover h1 {{ font-size: 56px; }}
}}

@media print {{
  .print-toolbar {{ display: none !important; }}
  .print-cover {{ background: var(--white) !important; color: var(--black) !important; min-height: 100vh; }}
  .print-cover h1 {{ color: var(--black) !important; }}
  .print-cover h1 .red {{ color: var(--red) !important; }}
  .print-toc {{ background: var(--white) !important; color: var(--black) !important; }}
  .print-toc h2 {{ color: var(--black) !important; }}
  .print-toc li a {{ color: var(--black) !important; }}
  section + section {{ page-break-before: always; break-before: page; }}
}}
</style>
</head>
<body style="background:#0A0A0A;color:#FFFFFF;">

<div class="print-toolbar">
  <span class="info">DREAMCAR · BRAND BOOK · V3.0 · ВЕРСІЯ ДЛЯ ДРУКУ</span>
  <div class="actions">
    <a href="index.html" class="btn-link">← НАЗАД У ВЕБ-ВЕРСІЮ</a>
    <button class="btn-link primary" type="button" onclick="window.print()">ЗБЕРЕГТИ PDF / ДРУКУВАТИ</button>
  </div>
</div>

<div class="print-cover">
  <div class="ver">DREAMCAR · BRAND BOOK · V3.0</div>
  <h1>МРІЯ.<br>ЗА ЦІНОЮ<br><span class="red">ЧАШКИ КАВИ.</span></h1>
  <p class="sub">Повне керівництво з бренду DreamCar. Усі 29 розділів в одному документі для друку або експорту в PDF.</p>
  <div class="meta">
    ТОВ «ПЛЕТФОКС» · ЄДРПОУ 44236899<br>
    vg@dreamcar.ua · dreamcar.ua<br>
    05.2026
  </div>
</div>

<div class="print-toc">
  <h2>ЗМІСТ</h2>
  <ol>{toc_items}</ol>
</div>

{sections_html}

<footer style="padding: 32px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ash); letter-spacing: 0.18em; border-top: 1px solid var(--line);">
  DREAMCAR · BRAND BOOK · V3.0 · 05.2026<br>
  ТОВ «ПЛЕТФОКС» · ЄДРПОУ 44236899 · vg@dreamcar.ua
</footer>

</body>
</html>
"""

(ROOT / "print.html").write_text(print_html, encoding="utf-8")
print(f"✓ Wrote print.html ({len(print_html)} bytes)")
