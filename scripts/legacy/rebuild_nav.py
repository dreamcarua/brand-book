#!/usr/bin/env python3
"""
Перебудовує sidebar у всіх parent-section файлах і landing index.html
з новим catalog'ом 21 розділ (8 об'єднань).
"""
import re
from pathlib import Path

ROOT = Path("/sessions/happy-wonderful-einstein/mnt/DreamCar.AI/dreamcar-brand-book")
SECTIONS = ROOT / "sections"

# (id, num, group, title)
catalog = [
    ("quickstart",   "00",  "start",    "Quick Start"),
    ("manifesto",    "01",  "strategy", "Маніфест"),
    ("strategy",     "02",  "strategy", "Стратегія"),
    ("personas",     "03",  "strategy", "Аудиторія"),
    ("compete",      "04",  "strategy", "Контекст ринку"),
    ("logo",         "05",  "visual",   "Логотип"),
    ("colors",       "06",  "visual",   "Кольори"),
    ("typo",         "07",  "visual",   "Типографіка"),
    ("spacing",      "08",  "visual",   "Сітка та елементи"),
    ("components",   "09",  "ui",       "UI-компоненти"),
    ("motion",       "10",  "ui",       "Анімації"),
    ("voice",        "11",  "voice",    "Голос і мова"),
    ("content",      "12",  "voice",    "Контент"),
    ("crisis",       "13",  "voice",    "Кризові комунікації"),
    ("partners",     "14",  "partners", "Партнери"),
    ("trust",        "15",  "partners", "Довіра і доступність"),
    ("tokens",       "16",  "tech",     "Дизайн-ресурси"),
    ("audio",        "17",  "tech",     "Стиль медіа"),
    ("touchpoints",  "18",  "touch",    "Точки контакту"),
    ("merch",        "19",  "touch",    "Мерч"),
    ("metrics",      "20",  "status",   "Стан і roadmap"),
]

groups = {
    "start":    "На старт",
    "strategy": "Стратегія",
    "visual":   "Візуальна система",
    "ui":       "Інтерфейс",
    "voice":    "Голос і контент",
    "partners": "Партнери і довіра",
    "tech":     "Техніка",
    "touch":    "Точки контакту",
    "status":   "Стан і roadmap",
}

# build sidebar fragment (link prefix передається — для parent у sections/ це "", для landing — "sections/")
def sidebar_inner(active_id, link_prefix, root_prefix):
    rows = []
    rows.append(f'<a href="{root_prefix}index.html" class="brand-mark">DREAM<span class="red">CAR</span></a>')
    rows.append('<span class="brand-tag">BRAND BOOK · v3.7</span>')
    rows.append('<div class="sidebar-search"><input type="text" id="sb-search" placeholder="Шукати розділ…" aria-label="Пошук по розділах"></div>')

    by_group = {}
    for sid, num, grp, title in catalog:
        by_group.setdefault(grp, []).append((sid, num, title))

    for gkey, gtitle in groups.items():
        if gkey not in by_group:
            continue
        rows.append('<div class="group">')
        rows.append(f'<span class="group-title">{gtitle}</span>')
        rows.append('<nav>')
        for sid, num, title in by_group[gkey]:
            cls = ' class="active"' if sid == active_id else ''
            rows.append(f'<a href="{link_prefix}{sid}.html"{cls}><span class="num">{num}</span>{title}</a>')
        rows.append('</nav>')
        rows.append('</div>')

    rows.append('<div class="group pdf-group"><span class="group-title">Експорт</span>')
    rows.append('<nav>')
    rows.append(f'<a href="{root_prefix}print.html">Завантажити повний PDF</a>')
    rows.append('</nav>')
    rows.append('</div>')

    rows.append('<div class="foot">vg@dreamcar.ua<br><a href="https://dreamcar.ua">dreamcar.ua</a></div>')
    return "\n".join(rows)

ASIDE_RE = re.compile(r'<aside class="sidebar">.*?</aside>', flags=re.S)

# Update parent section files (in sections/)
parent_ids = {sid for sid, *_ in catalog if sid != "quickstart" or True}
parent_ids = {sid for sid, *_ in catalog}  # all 21 parents
updated = 0
for sid, num, grp, title in catalog:
    f = SECTIONS / f"{sid}.html"
    if not f.exists():
        print(f"  ⚠ {sid}.html відсутній")
        continue
    h = f.read_text(encoding="utf-8")
    new_aside = '<aside class="sidebar">\n' + sidebar_inner(sid, "", "../") + '\n</aside>'
    h2 = ASIDE_RE.sub(new_aside, h, count=1)
    # Update breadcrumb title
    h2 = re.sub(
        r'(<span style="color:var\(--white\);">)\d+[A-Z]?\s*·\s*[^<]*(</span>)',
        rf'\g<1>{num} · {title}\g<2>',
        h2, count=1
    )
    if h2 != h:
        f.write_text(h2, encoding="utf-8")
        updated += 1
print(f"✓ Sidebar оновлено у {updated} parent-сторінках")

# Update landing index.html
landing = ROOT / "index.html"
h = landing.read_text(encoding="utf-8")
new_aside = '<aside class="sidebar">\n' + sidebar_inner(None, "sections/", "") + '\n</aside>'
h2 = ASIDE_RE.sub(new_aside, h, count=1)

# Rebuild TOC grid
summaries = {
    "quickstart":   "Шпаргалка для підрядників на 1 екран.",
    "manifesto":    "Душа бренду. Те, на що звіряємось.",
    "strategy":     "Місія, бачення, цінності, УТП, архетип.",
    "personas":     "4 портрети за тригерами, не за демографією.",
    "compete":      "Чим ми відрізняємось — без гри в конкурентів.",
    "logo":         "Racing Plate, Avatar Circle і DC Monogram.",
    "colors":       "Палітра, пропорції, контраст.",
    "typo":         "4 шрифти, 11-рівнева шкала.",
    "spacing":      "База 4px + іконки, патерни, декоративні рішення.",
    "components":   "Кнопки, форми, поля, empty states.",
    "motion":       "Тривалості, easing, переходи.",
    "voice":        "Тон, канали + словник DO/CAREFUL/NEVER.",
    "content":      "Рубрики, хештеги, FAQ.",
    "crisis":       "8 готових скриптів реакції.",
    "partners":     "Бриф із 7 питань і правила лого.",
    "trust":        "Trust-сигнали + WCAG 2.1 AA.",
    "tokens":       "Design tokens (JSON+CSS) + Asset Library.",
    "audio":        "Аудіо-айдентика і фото-режисура.",
    "touchpoints":  "Customer journey + Email шаблони.",
    "merch":        "Що друкуємо і як.",
    "metrics":      "Що міряємо + куди йдемо далі.",
}

toc_cards = []
for sid, num, grp, title in catalog:
    desc = summaries.get(sid, "")
    toc_cards.append(
        f'<a href="sections/{sid}.html" class="toc-card">'
        f'<span class="num">/// {num}</span>'
        f'<div class="name">{title.upper()}</div>'
        f'<div class="desc">{desc}</div></a>'
    )
toc_grid_html = ('<section style="padding: 0 0 32px;">'
                 '<div class="s-num" style="padding: 24px 32px 0;">/// ЗМІСТ</div>'
                 f'<h2 class="s-title" style="padding: 0 32px 8px;">{len(catalog)} РОЗДІЛІВ <span class="red">ОДНИМ КЛАЦАННЯМ</span></h2>'
                 f'<div class="toc-grid">{"".join(toc_cards)}</div></section>')

# Replace existing toc grid section
h2 = re.sub(
    r'<section style="padding: 0 0 32px;"><div class="s-num"[^>]*>/// ЗМІСТ.*?</section>',
    toc_grid_html,
    h2, count=1, flags=re.S
)

# Update hero subtitle: "29 розділів" → "21 розділ"
h2 = re.sub(r'29 розділ\w+', f'{len(catalog)} розділів', h2)

landing.write_text(h2, encoding="utf-8")
print("✓ landing index.html оновлено (sidebar + TOC grid)")

# Update split.py and build_print.py catalog so future rebuilds match
split_py = ROOT / "scripts/split.py"
print(f"  (scripts/split.py і build_print.py треба оновити вручну для майбутніх rebuild'ів)")
