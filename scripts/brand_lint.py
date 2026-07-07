#!/usr/bin/env python3
"""
DreamCar Brand Book — self-lint.
Рівень BLOCK (exit 1): NEVER-лексика у критичних зонах, [TBD]/lorem,
биті локальні лінки, відсутні h1/sidebar.js, ретироване гасло.
Рівень WARN (exit 0): NEVER-корені у решті тексту — для людського перегляду.
Запуск: python3 scripts/brand_lint.py [--strict]
"""
import re, sys, html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STRICT = '--strict' in sys.argv

# Корені заборонених слів (ловлять відмінки: розіграш/розіграв/розіграємо…)
NEVER_ROOTS = r'(розігра|лотере[яюї]|\bквит(ок|ка|ки|ків|ку|ком)\b|джекпот|казино|\bбілет|халяв|\bвигра(й|ти|є|в|ла|ли|ш|ємо|єте)\b|\bшанс\b|\bазарт|\bфарт\b|\bставк(а|и|у|ою)\b)'
NEVER_RE = re.compile(NEVER_ROOTS, re.IGNORECASE)
# Дозволені заперечення/освітні шаблони поруч зі словом
ALLOW_NEAR = re.compile(r'(не\s+«?(лотерея|казино)|ніколи|заборон|не вживай|NEVER|табу|❌|✕|⛔|стоп-слов|замін|→|поган|bad|не використовуємо|без слів|маркер|ризик|лінтер|linter|перекладаємо|це слово)', re.IGNORECASE)

RETIRED = ['Бери. Дій. Виграй']
PLACEHOLDERS = re.compile(r'(\[TBD\]|lorem ipsum|FIXME|XXX₴)', re.IGNORECASE)

def text_of(html_s):
    s = re.sub(r'<script.*?</script>', '', html_s, flags=re.S)
    s = re.sub(r'<style.*?</style>', '', s, flags=re.S)
    s = re.sub(r'<[^>]+>', ' ', s)
    return html.unescape(s)

def critical_zones(html_s):
    zones = []
    for m in re.finditer(r'<title>(.*?)</title>', html_s, re.S): zones.append(('title', m.group(1)))
    for m in re.finditer(r'<meta[^>]+content="([^"]*)"', html_s): zones.append(('meta', m.group(1)))
    for m in re.finditer(r'<h1[^>]*>(.*?)</h1>', html_s, re.S): zones.append(('h1', text_of(m.group(1))))
    for m in re.finditer(r'<(?:a|button)[^>]*class="[^"]*(?:cta|print-btn|btn)[^"]*"[^>]*>(.*?)</', html_s, re.S):
        zones.append(('cta', text_of(m.group(1))))
    return zones

errors, warns = [], []
pages = sorted((ROOT/'sections').glob('*.html')) + [ROOT/'index.html', ROOT/'404.html']
emails = sorted((ROOT/'email-templates').glob('*.html'))

for f in pages + emails:
    rel = f.relative_to(ROOT)
    s = f.read_text(encoding='utf-8', errors='ignore')

    # 1. Ретироване гасло — блок всюди
    for r_ in RETIRED:
        if r_ in s: errors.append(f"{rel}: ретироване гасло «{r_}» — канон: «Бери. Дій. Володій.»")

    # 2. Плейсхолдери — блок
    for m in PLACEHOLDERS.finditer(s):
        errors.append(f"{rel}: плейсхолдер {m.group(1)!r}")

    # 3. NEVER у критичних зонах — блок (email-шаблони: весь текст = критична зона)
    zones = critical_zones(s)
    if f in emails: zones.append(('email-body', text_of(s)))
    for zname, ztext in zones:
        for m in NEVER_RE.finditer(ztext):
            ctx = ztext[max(0, m.start()-40):m.end()+40].replace('\n', ' ')
            if ALLOW_NEAR.search(ctx): continue
            errors.append(f"{rel} [{zname}]: NEVER-слово «{m.group(0)}» :: …{ctx.strip()}…")

    # 4. NEVER у решті тексту — warn
    body = text_of(s)
    for m in NEVER_RE.finditer(body):
        ctx = body[max(0, m.start()-50):m.end()+50].replace('\n', ' ')
        if ALLOW_NEAR.search(ctx): continue
        warns.append(f"{rel}: «{m.group(0)}» :: …{ctx.strip()[:110]}…")

    # 5. Структура секційних сторінок
    if f.parent.name == 'sections':
        if '<h1' not in s: errors.append(f"{rel}: немає <h1>")
        if 'sidebar.js' not in s: errors.append(f"{rel}: не підключено sidebar.js")

    # 6. Биті локальні лінки
    for m in re.finditer(r'(?:href|src)="([^"#][^"]*)"', s):
        u = m.group(1)
        if u.startswith(('http', 'mailto:', 'tel:', 'data:', '//', '/')): continue
        if '{{' in u or u.startswith('%') or '${' in u: continue  # template-змінні eSputnik/Yespo
        u2 = u.split('#')[0].split('?')[0]
        if u2 and not (f.parent / u2).resolve().exists():
            errors.append(f"{rel}: битий лінк -> {u}")

print(f"── brand_lint: {len(errors)} BLOCK · {len(warns)} WARN ──")
for e in errors: print("✕", e)
if STRICT or not errors:
    for w in warns[:40]: print("⚠", w)
    if len(warns) > 40: print(f"⚠ … і ще {len(warns)-40}")
sys.exit(1 if errors else 0)
