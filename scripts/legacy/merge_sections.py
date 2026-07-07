#!/usr/bin/env python3
"""
1) Об'єднує парні секції: child <section> вшивається у parent.
2) Дитячі файли перетворює у redirect-stub (meta refresh + посилання).
3) Запускає split-rebuild sidebar з новим catalog.
"""
import re
from pathlib import Path

ROOT = Path("/sessions/happy-wonderful-einstein/mnt/DreamCar.AI/dreamcar-brand-book")
SECTIONS = ROOT / "sections"

MERGES = [
    ("logo",         "avatar-mark"),
    ("voice",        "legal-language"),
    ("tokens",       "apps"),
    ("metrics",      "roadmap"),
    ("components",   "empty"),
    ("spacing",      "elements"),
    ("audio",        "photo"),
    ("touchpoints",  "email"),
]

def extract_section_block(html, sid):
    m = re.search(rf'(<section id="{re.escape(sid)}"[^>]*>.*?</section>)', html, flags=re.S)
    return m.group(1) if m else None

def has_merged_marker(html, child_sid):
    return f"merged from {child_sid}" in html

merged = 0
for parent_sid, child_sid in MERGES:
    parent_file = SECTIONS / f"{parent_sid}.html"
    child_file = SECTIONS / f"{child_sid}.html"
    if not parent_file.exists():
        print(f"  ⚠ parent {parent_sid} відсутній")
        continue
    if not child_file.exists():
        print(f"  → {child_sid} вже видалений / редіректнутий")
        continue

    parent_html = parent_file.read_text(encoding="utf-8")
    child_html = child_file.read_text(encoding="utf-8")

    if not has_merged_marker(parent_html, child_sid):
        child_section = extract_section_block(child_html, child_sid)
        if child_section is None:
            print(f"  ⚠ {child_sid}: <section> блок не знайдено")
            continue

        m = re.search(
            rf'(<section id="{re.escape(parent_sid)}"[^>]*>)(.*?)(</section>)',
            parent_html, flags=re.S
        )
        if not m:
            print(f"  ⚠ parent {parent_sid}: <section> блок не знайдено")
            continue

        open_tag, body, close_tag = m.groups()
        new_body = body + f"\n\n  <!-- merged from {child_sid} -->\n  " + child_section + "\n"
        new_section = open_tag + new_body + close_tag
        new_parent = parent_html[:m.start()] + new_section + parent_html[m.end():]
        parent_file.write_text(new_parent, encoding="utf-8")
        print(f"  ✓ {parent_sid} ← {child_sid} (merged)")
    else:
        print(f"  ✓ {parent_sid} ← {child_sid} (already merged)")

    # Перетворюємо child файл у redirect-stub
    redirect = f'''<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url={parent_sid}.html#{child_sid}">
<link rel="canonical" href="{parent_sid}.html">
<title>Розділ переїхав · DreamCar Brand Book</title>
</head>
<body style="background:#0A0A0A;color:#fff;font-family:sans-serif;text-align:center;padding:80px 20px;">
<p>Розділ об'єднано з «{parent_sid}». <a href="{parent_sid}.html#{child_sid}" style="color:#E30613;">Перейти →</a></p>
</body>
</html>
'''
    try:
        child_file.write_text(redirect, encoding="utf-8")
        print(f"     {child_sid}.html → redirect stub")
        merged += 1
    except Exception as e:
        print(f"     ⚠ stub помилка: {e}")

print(f"\n✓ Завершено. Об'єднано: {merged}")
