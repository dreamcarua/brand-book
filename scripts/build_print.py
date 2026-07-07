#!/usr/bin/env python3
"""
Генерує print.html — усі 30 розділів однією сторінкою для Друк → Зберегти як PDF.
Запуск: python3 scripts/build_print.py (з будь-якої директорії)
"""
import re, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SECTIONS = ROOT / "sections"
VERSION = "4.0"

CATALOG = [
    ("quickstart","00","Quick Start"),("manifesto","01","Маніфест"),("strategy","02","Стратегія"),
    ("personas","03","Аудиторія"),("compete","04","Контекст ринку"),("logo","05","Логотип"),
    ("colors","06","Кольори"),("typo","07","Типографіка"),("spacing","08","Сітка та елементи"),
    ("components","09","UI-компоненти"),("motion","10","Анімації"),("voice","11","Голос і мова"),
    ("legal","11B","Legal-safe лексикон"),("content","12","Контент"),("crisis","13","Кризові комунікації"),
    ("partners","14","Партнери"),("trust","15","Довіра і доступність"),("tokens","16","Дизайн-ресурси"),
    ("audio","17","Стиль медіа"),("touchpoints","18","Точки контакту"),("merch","19","Мерч"),
    ("metrics","20","Метрики · Roadmap"),("support","21","Регламент підтримки"),("ai-content","22","AI-контент"),
    ("examples","23","Examples Library"),("photography-brief","24","Photography Brief"),("mobile","25","Mobile-First"),
    ("onboarding","26","Onboarding Deck"),("tools","27","Brand Tools"),("generator","28","Post Generator"),
]

def extract(sid):
    h = (SECTIONS / f"{sid}.html").read_text(encoding="utf-8")
    m = re.search(r'<main[^>]*>(.*)</main>', h, flags=re.S)
    body = m.group(1) if m else f"<!-- {sid}: main not found -->"
    # секційні <style> з <head> — інлайнимо, щоб print мав ті самі стилі
    head_html = h.split('</head>')[0]
    styles = re.findall(r'<style\b[^>]*>.*?</style>', head_html, flags=re.S)
    if styles:
        body = "\n".join(styles) + "\n" + body
    body = re.sub(r'<div class="section-bread">.*?</div>\n?', '', body, count=1, flags=re.S)
    body = re.sub(r'<nav class="section-page-nav">.*?</nav>', '', body, flags=re.S)
    body = re.sub(r'<script\b.*?</script>', '', body, flags=re.S)
    body = body.replace('href="../assets/','href="assets/').replace('src="../assets/','src="assets/')
    body = body.replace('href="../index.html"','href="index.html"').replace('href="../','href="').replace('src="../','src="')
    body = re.sub(r'href="([a-z0-9-]+\.html)(#[^"]*)?"', r'href="sections/\1\2"', body)
    if f'id="{sid}"' not in body:
        body = body.replace('<section', f'<section id="{sid}"', 1)
    return body.strip()

# print-CSS та тулбар збережені з попередньої версії
head = '''<!DOCTYPE html>
<html lang="uk" style="background:#0A0A0A;color-scheme:dark;">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0A0A0A">
<title>DreamCar Brand Book v''' + VERSION + ''' · Версія для друку</title>
<meta name="description" content="DreamCar Brand Book v''' + VERSION + ''' — повна друкована версія всіх 30 розділів.">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Archivo+Black&family=Manrope:wght@400;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/styles.css">
<style>
.print-toolbar { position: sticky; top: 0; z-index: 100; background: var(--black); border-bottom: 1px solid var(--line); padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.print-toolbar .info { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em; color: var(--bone); }
.print-toolbar .actions { display: flex; gap: 12px; flex-wrap: wrap; }
.print-toolbar .btn-link { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.16em; padding: 8px 16px; border: 1px solid var(--line); color: var(--bone); background: transparent; text-decoration: none; cursor: pointer; }
.print-toolbar .btn-link.primary { background: var(--red); color: var(--white); border-color: var(--red); }
.print-toolbar .btn-link:hover { border-color: var(--red); color: var(--white); }
.print-cover { padding: 96px 32px; text-align: center; border-bottom: 1px solid var(--line); }
.print-cover .ver { font-family: 'JetBrains Mono', monospace; color: var(--red); font-size: 12px; letter-spacing: 0.3em; margin-bottom: 24px; }
.print-cover h1 { font-family: 'Oswald', 'Bebas Neue', sans-serif; font-weight: 700; font-size: 84px; line-height: 0.9; letter-spacing: 0.02em; color: var(--white); margin-bottom: 16px; }
.print-cover h1 .red { color: var(--red); }
.print-cover .sub { font-size: 14px; color: var(--bone); margin-top: 12px; max-width: 540px; margin-left: auto; margin-right: auto; line-height: 1.6; }
.print-cover .meta { margin-top: 48px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.2em; color: var(--ash); }
.print-toc { padding: 32px; border-bottom: 1px solid var(--line); }
.print-toc h2 { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 32px; letter-spacing: 0.02em; color: var(--white); margin-bottom: 16px; }
.print-toc ol { list-style: none; padding: 0; column-count: 2; column-gap: 32px; }
.print-toc li { break-inside: avoid; margin-bottom: 6px; }
.print-toc li a { color: var(--bone); text-decoration: none; font-size: 14px; line-height: 1.7; }
.print-toc li a:hover { color: var(--white); }
.print-toc .num { color: var(--red); font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-right: 10px; letter-spacing: 0.16em; }
@media (max-width: 700px) { .print-toc ol { column-count: 1; } .print-cover h1 { font-size: 56px; } }
@media print {
  .print-toolbar { display: none !important; }
  .print-cover { background: var(--white) !important; color: var(--black) !important; min-height: 100vh; }
  .print-cover h1 { color: var(--black) !important; }
  .print-cover h1 .red { color: var(--red) !important; }
  .print-toc { background: var(--white) !important; color: var(--black) !important; }
  .print-toc h2 { color: var(--black) !important; }
  .print-toc li a { color: var(--black) !important; }
  section + section { page-break-before: always; break-before: page; }
}
</style>
</head>
<body style="background:#0A0A0A;color:#FFFFFF;">

<div class="print-toolbar">
  <span class="info">DREAMCAR · BRAND BOOK · V''' + VERSION + ''' · ВЕРСІЯ ДЛЯ ДРУКУ</span>
  <div class="actions">
    <a href="index.html" class="btn-link">← НАЗАД У ВЕБ-ВЕРСІЮ</a>
    <button class="btn-link primary" type="button" onclick="window.print()">ЗБЕРЕГТИ PDF / ДРУКУВАТИ</button>
  </div>
</div>

<div class="print-cover">
  <div class="ver">/// BRAND BOOK · V''' + VERSION + ''' · 07.2026</div>
  <h1>DREAM<span class="red">CAR</span></h1>
  <div class="sub"><strong>МРІЯ. ЗА ЦІНОЮ ЧАШКИ КАВИ.</strong><br>Операційна система бренду — всі 30 розділів у друкованому форматі: стратегія, голос, візуальна система, юридично безпечна мова.</div>
  <div class="meta">DREAMCAR · UA · EST. 2016 · 17 АВТО ВРУЧЕНО · 500K+ СПІЛЬНОТА</div>
</div>

<div class="print-toc">
  <h2>ЗМІСТ</h2>
  <ol>
'''
toc = "".join(f'    <li><a href="#{sid}"><span class="num">{num}</span>{title}</a></li>\n' for sid,num,title in CATALOG)
tail_open = '''  </ol>
</div>

<main class="main" style="margin-left:0;">
'''
parts = []
for sid, num, title in CATALOG:
    parts.append(f'<!-- ========== {num} · {title} ========== -->')
    parts.append(extract(sid))
footer = f'''
</main>

<footer style="padding: 32px; border-top: 1px solid var(--line); text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ash); letter-spacing: 0.18em; line-height: 1.8;">
  DREAMCAR · BRAND BOOK · V{VERSION} · ЗГЕНЕРОВАНО {datetime.date.today().strftime('%d.%m.%Y')}<br>
  BRAND.DREAMCAR.UA
</footer>

</body>
</html>
'''
out = head + toc + tail_open + "\n\n".join(parts) + footer
(ROOT/'print.html').write_text(out, encoding='utf-8')
print(f"print.html: {len(out)//1024} KB, {out.count(chr(10))} рядків, {len(CATALOG)} розділів")
