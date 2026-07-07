# Changelog

Усі помітні зміни DreamCar Brand Book документуються тут.
Формат: [Keep a Changelog](https://keepachangelog.com/uk/1.1.0/), SemVer.

## [4.0.0] — 2026-07-07 «ETALON»

### Виправлено (аудит кожного розділу)
- Канонічний CTA-ритм: «Бери. Дій. Володій.» замість «…Виграй.» (6 розділів; «виграй» — NEVER-слово за власним лексиконом)
- metrics: прибрано «розіграш» ×4 з власного тексту брендбука; КУРРЕНТ→ЗАРАЗ
- Розсинхрон цифр: 350К → 500K+ спільнота (trust = hero)
- components: суперечність «Акція #018 завершена → готуйся до #018», вигаданий переможець, [TBD] ₴ ×3 у пакетах
- photography-brief: №18 — це Audi e-tron (був BMW X5)
- trust: «Hetzner UA» → коректне формулювання (у Hetzner немає UA-локації); «17 переможців» → «17 власників» (canon CAREFUL)
- Русизми/хиби: ВЕРОГІДНІСТЬ×8→ЙМОВІРНІСТЬ, «после», «Раздача», «повторювальний», «Лінкований», «Домажорний», «контрасуюча», лат. I/k у кирилиці, «моніторі», «теж саме»
- support: графік 09:00–20:00 тепер за Києвом (був CET/CEST)
- touchpoints: «наростання азарту» → «передчуття» («азарт» — NEVER)
- Навігація: обірваний ланцюг metrics→support, підписи кнопок compete/merch
- Контейнер: 1480px → 1280px (узгоджено spacing ↔ mobile)

### Додано
- 11B Legal-safe лексикон — повноцінний розділ (був сиротою без меню/пошуку/оболонки): бренд-оболонка, sidebar, TOC, sitemap, search-index
- Маніфест ×5: три сильні абзаци + «Компас» (5 принципів) + правило незалежності від бюджету
- Ієрархія правил у Голосі: ЗАКОН → ГОЛОС → ВІЗУАЛ (вирішення конфліктів між розділами)
- print.html перегенеровано: всі 30 розділів (був v3.0 із 21)

### Змінено
- index: title/OG без самовихваляння, hero про бренд (не про фічі), «KILLER FEATURES» → «ІНСТРУМЕНТИ»
- Версії: сайт v4.0, дизайн-токени v4.0, SW cache v16, sitemap lastmod 07.07.2026


## [3.9.2] — 2026-05-26

### Додано
- **Повнотекстовий пошук** по вмісту всіх 29 розділів (`assets/search-index.json` · 214 КБ).
- `sidebar.js` v6 — лінива загрузка індексу, релевантне ранжування (title × 20, headings × 5, text × 1), сніпети з підсвіткою.
- Перехід зі сніпета → одразу скрол до знайденого речення (`?q=…` + Text Fragment `#:~:text=`).
- Підсвітка терміну на сторінці-призначенні (`mark.q-hit` з flash-анімацією).
- `scripts/build_search_index.py` — генератор індексу з HTML-розділів.

### Покращено
- Sidebar пошук тепер шукає одночасно: назви розділів, aliases, ваш контент.
- Service Worker v9 — precache `search-index.json` для офлайн-пошуку.
- UI результатів: червона ліва межа, hover-стан, чіткий заголовок «Знайдено у тексті · N».

## [3.9.1] — 2026-05-25

### Виправлено
- 404.html — версія `V3.0` → `V3.9` + покращене копірайтінг (Ви замість ти)
- `typo.html` — назва шрифту `Bebas Neue` → `Oswald` (фактично завантажується Oswald, Bebas Neue лише fallback)
- `quickstart.html` — `3 шрифти` → `4 шрифти` (додано JetBrains Mono)
- `onboarding.html` — slide 4: `3 ШРИФТИ` → `4 ШРИФТИ`
- `examples.html`, `photography-brief.html`, `mobile.html`, `onboarding.html`, `tools.html`, `generator.html` — inline sidebar → universal `sidebar.js`
- `robots.txt` — sitemap URL виправлено (`github.io` → `brand.dreamcar.ua`)
- `index.html` — перехід на universal `sidebar.js`

### Додано (SEO + Best Practices)
- `sitemap.xml` — 31 URL з пріоритетами
- `humans.txt` — credits команди
- `.well-known/security.txt` — RFC 9116
- `CHANGELOG.md` — цей файл
- `AUDIT_BRAND_BOOK_2026-05-25.md` — повний аудит
- `index.html` — canonical, Open Graph (site_name, url, locale, image dimensions), Twitter Card, Schema.org TechArticle, apple-mobile-web-app-capable, preconnect для Google Fonts

### Покращено
- `assets/sidebar.js` v3 — авто-інжектить canonical + OG + Twitter + Apple meta для всіх 29 сторінок (раніше вони були тільки на index.html)
- `service-worker.js` v6 — bump cache, додано `sitemap.xml`, `robots.txt`, `humans.txt`, `404.html`, `og-image.png` у precache
- `manifest.webmanifest` — `id`, `display_override`, `edge_side_panel` для Edge, `dir: ltr`, screenshots з label

## [3.9.0] — 2026-05-22

### Додано
- Розділ #27 Brand Tools — Voice Linter, Color Contrast Checker, Token Picker, Asset Download Center, AI Prompt
- Розділ #28 Brand Post Generator — IG/TG/Email + SVG export 1080×1080
- Розділ #25 Mobile-First Spec — breakpoints, touch targets, thumb zones
- Розділ #26 Onboarding Deck — 10 слайдів «Brand за 10 хв»
- Розділ #23 Examples Library — 12 кейсів good vs bad
- Розділ #24 Photography Brief — шаблон + shot list
- Розділ #21 Регламент підтримки — 4К, S.T.O.P. протокол
- Розділ #22 AI-контент — DO/VERIFY/NEVER + system prompt

### Інфраструктура
- Universal `assets/sidebar.js` — один файл sidebar для всіх сторінок
- PWA: manifest + service worker v5
- Offline-first архітектура

## [3.7.0] — 2026-04

### Додано
- Базовий брендбук на 20 розділів
- Email шаблони (master, BMW example)
- Print.html — PDF-friendly версія

## [2.1.0] — 2026-03

### Додано
- Розширення: аудіо-айдентика, email-шаблони, touchpoints, фото-напрямок, мерч-правила, empty states, бренд-метрики, roadmap
- Виправлено пропорції круглої аватарки (DREAMCAR піднято і збільшено)

## [2.0.0] — 2026-04

### Змінено
- Повне оновлення. Додано: персони, конкуренти, secondary палітра, accessibility, design tokens, кризові скрипти, партнерські гайдлайни
- Зміна логотипу на Racing Plate

## [1.0.0] — 2026-03

### Додано
- Перша версія. Базовий лого, кольори, типографіка

## [0.5.0] — 2026-01

### Додано
- Чорновик. Маніфест, перші концепції
