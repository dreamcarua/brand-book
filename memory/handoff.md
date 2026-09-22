# Handoff — mid-task state

Updated: 23.09.2026

## Task verbatim
«а давай тепер повний аудит - передусім візуальний, UI UX і сприйняття, запамʼятовуваність образу, цілісність … Щоб різні агенти покритикували … спеціальні скіли … СВІТОВОГО рівня … Додай все, чого може не вистачати, а що є - зроби ІДЕАЛЬНИМ! Працюй автономно - крок за кроком, розділ за розділом … 12 годин» — Вадим, 22.09.2026

## Constraints
- `assets/global-header.js` спільний з іншими системами — не чіпати без перевірки двох систем.
- Факти про клуб (21 авто, 500K+) не змінювати без Вадима; 21 vs 22 — відкрите питання.
- Legal-лексикон 11B — зміни формулювань тільки Вадим.
- Деплой: git bundle → Mac (~/DreamCar.AI) → Desktop Commander → push. Після кожного етапу lint + regen print/search + bump SW.

## Plan
1. Скріншоти 32 розділів desktop+mobile → `/tmp/claude-0/shots/`
2. 5 агентів-критиків (візуал/бренд, UX/IA, a11y+фронтенд, контент/прогалини, motion)
3. Синтез → план у цьому файлі
4. Фундамент (styles.css, sidebar, index) → розділи по черзі → нові розділи
5. Повторна критика, деплой, оновити DS-артефакт, звіт

## Done
- v4.2 задеплоєно (7230ef7) — попередня задача.

## Audit synthesis (5 critics, 22.09 23:00)
Reports: visual (afe811), UX (af22a0), a11y (ae0a96), content (aa8844), motion (a421fa). Key: Archivo Black has NO Cyrillic (all CTA/ticker fall back); both linters pass «розіграш» (JS \b ASCII); search hangs on emoji (URI malformed); global nav{} leaks into sidebar; h1→h3 skips; no reduced-motion; 390px overflow on 6 pages; logo drawn two ways (CSS vs SVG); ~350 UI emoji; red overuse; stale facts (19 разів, #018, «за 10 років»); lexicon copies drift (CAREFUL tier, «у paid ads»).
Owner-only (flag, don't change): 11B wording/examples, refunds/taxes/licences policies, /winners slug, names/titles, 500K+, roadmap sub-brands.

## Phases
A foundation: nav leak, sidebar a11y, search fixes+full index, linters+shared lexicon, reduced motion/hover/active, Cyrillic CTA font, LH, headings h2, contrast --red-text, reflow, version constant, prev/next from SECTIONS → deploy
B identity: plate kicker, logo via SVG masters, strip AI tropes/emoji, red discipline, tool cards, index roles block, quickstart quick answers → deploy
C content: contradictions/leaks/typography, IA renumber → deploy
D new pages: Платформа бренду, Церемонія вручення, Соцмережі, Словник і правопис, Як працюємо з брендом → deploy
E motion signature + copy buttons + motion demos; re-critique; DS artifact; report

## Done (local commits, not pushed yet)
- Phase A: legacy nav{} removed; skip link, labelled navs, drawer a11y (visibility, aria-expanded, close btn, Esc→focus, scroll lock); search (stop-words, stems, catch, safe encode, Enter/arrows, main-only index 20k chars); shared assets/lexicon.js (Unicode boundaries) in tools/legal/generator — «розіграш», «Переможці» now caught; Archivo Black → Manrope 800 on all Cyrillic text; LH ≥1.0; h3.s-subtitle→h2 (110); reduced-motion, hover gating, :active; contrast fixes; reflow at 390; th scope; labels; 404 with search; tools tokens from canonical file; AI prompt from lexicon; typo Cyrillic rules block.

- Phase B+D: new IA (37 sections, 8 groups) — SECTIONS in sidebar.js is the one source; scripts/build_nav.py writes landing TOC, titles, breadcrumbs, plate kickers, prev/next; build_print/search import it. New pages: platform, glossary, social, ceremony, governance. Landing rebuilt (roles, brand-in-10s, tool links, master SVG plate). Logo page rebuilt on master SVGs. Plate kicker + red-square h2 marker; EN/UA duplicate headings normalized; inner sub-heroes demoted; nested sections unnested; UI emoji stripped (11 files); decorative gradients flattened; .dont leak fixed.

- Phase C: content fixes committed (d12f382): typos, mixed-script, #018 → #NN placeholders, 25–44, no superlatives, manifesto/trust/voice/support/touchpoints/examples.

- Generator rebuilt (canvas PNG 4:5/1:1/9:16, own photo, Reels/Stories), motion page (lanes + Stamp/Plate/Count), spacing elements, colors intro, README/AGENTS/CHANGELOG/sitemap/SW v23, axe contrast pass 290→demo-only, mobile reflow fixes. Commits up to 'contrast pass'.
- Second critique (23.09): visual (ac5b4a8f) + UX/content (a10f87e5) reports received.

## Next single action
Apply critique batch: stale numbered links via SECTIONS, meta descriptions in build_nav, ти/Ви matrix, typos/apostrophes/ranges/russisms, links styling, text-wrap balance, emoji status marks, legal/examples visual, colors .role leak, generator email strong + mobile form-row, glows in styles.css (.ig-post), grids auto-fit. Owner flags: legal ✅ examples (more tokens=more possibilities, «Отримай авто»), /winners, trust table 20 rows vs 21, support hours vs 20:00 ефір, КРАІЛ fine, @dreamcar_brand.
