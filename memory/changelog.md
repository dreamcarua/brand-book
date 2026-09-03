# DreamCar Brand Book — зміни поза git

Лише те, чого не показує git: правки в зовнішніх сервісах, DNS, налаштування GitHub Pages, ручні запуски, тимчасові зміни. Останній стовпець обовʼязковий. Раз на квартал переносити в `memory/archive/<рік>-Q<n>.md`.

Публічні зміни самого сайту документуються не тут, а в `CHANGELOG.md` у корені (Keep a Changelog + SemVer).

| Дата | Що змінилось | Як (скрипт / команда / UI) | Резервна копія / як відкотити |
|---|---|---|---|
| 03.09.2026 | Встановлено систему памʼяті агента v8 у гілку `memory-v8`: `AGENTS.md`, `CLAUDE.md`, `memory/`. Дослівна копія наявного `COWORK-INSTRUCTIONS.md` збережена в `memory/archive/COWORK-INSTRUCTIONS.md.03.09.2026.md`; оригінал у корені не змінювався і не видалявся. Код і вміст сайту не змінювались | git, гілка `memory-v8` | видалити гілку `memory-v8` |
| — | GitHub Pages: `https_enforced: false` — зафіксовано як стан, не як зміна | `gh api repos/dreamcarua/brand-book/pages` | — |
