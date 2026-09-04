# DreamCar Brand Book — інструменти, доступи, звіти

Читати перед використанням будь-якого інструмента, MCP, воркфлоу чи облікового запису цього проєкту. Значень секретів тут не буває — тільки де вони лежать.

## Як публікується сайт

| Що | Значення |
|---|---|
| Хостинг | GitHub Pages, `build_type: legacy` (без збірки) |
| Джерело | гілка `main`, шлях `/` — **корінь репозиторію** |
| Домен | `brand.dreamcar.ua` (файл `CNAME` у корені) |
| HTTPS | `https_enforced: false` станом на 03.09.2026 — це відкрита задача 🔴 у `tasks.md` |
| DNS | запис CNAME `brand` у зоні `dreamcar.ua` → сторінки GitHub. Зону веде власник |
| Jekyll | вимкнено файлом `.nojekyll` |
| Затримка | коміт → сайт оновлений приблизно за хвилину, далі ще service worker (див. `traps.md`) |

Кроки первинного налаштування Pages і DNS збережені дослівно в `memory/archive/COWORK-INSTRUCTIONS.md.03.09.2026.md` — це архів історичної інструкції, повторювати її для вже піднятого сайту не треба.

Наслідок, який визначає решту правил: **усе, що потрапило в коміт, стає публічним URL**.

## Воркфлоу

| Файл | Коли спрацьовує | Що робить | Секрети |
|---|---|---|---|
| `.github/workflows/brand-lint.yml` | push у `main` і кожен pull request | ставить Python 3.12 і запускає `python3 scripts/brand_lint.py` — «Лінт бренд-канону (NEVER-лексика, плейсхолдери, биті лінки, структура)». BLOCK (exit 1): NEVER-лексика в критичних зонах, `[TBD]`/lorem/FIXME, биті локальні лінки, відсутні `<h1>` чи `sidebar.js`, ретироване гасло. WARN (exit 0): NEVER-корені в решті тексту | жодного |

Бейдж лінта стоїть у `README.md` — червоний бейдж бачать усі, хто відкриє репозиторій.

## Генератори артефактів — запускати вручну

| Команда | Що перезаписує |
|---|---|
| `python3 scripts/build_search_index.py` | `assets/search-index.json` — повнотекстовий пошук по всіх розділах |
| `python3 scripts/build_print.py` | `print.html` — версія для друку/PDF з усіх 30 розділів |
| `python3 scripts/build_logos.py` | набори логотипів і `assets/dreamcar-logos.zip` |

Правити ці три результати руками не можна — наступна генерація затре.

## Інструменти і конектори

| Інструмент | Для чого | Як зайти | Особливості |
|---|---|---|---|
| GitHub MCP / `gh` | читання й запис `dreamcarua/*` з будь-якого чату | вже авторизовано на Mac власника | запис одним `push_files` на одну логічну зміну; видаляти файли GitHub MCP не вміє |
| Desktop Commander | локальні файли, shell, запуск лінта і генераторів | тека має бути підключена в Cowork | кожен виклик — новий shell |
| Supabase MCP | Edge Function глобального пошуку по системах DreamCar | проєкт `wotghlaehnvxyeacznvv` (той самий, що в `dreamcar-dashboard`) | міграції через `apply_migration`, не сирий DDL |
| Google Fonts | `Oswald`, `Archivo Black`, `JetBrains Mono` | `preconnect` + `display=swap` в `index.html` | `Bebas Neue` лишився лише як fallback і фактично не рендериться |

## Ідентифікатори (не секрети)

| Що | Значення | Де вживається |
|---|---|---|
| Домен | `brand.dreamcar.ua` | CNAME, robots, sitemap, canonical, OG |
| Supabase project ref | `wotghlaehnvxyeacznvv` | глобальний пошук, Edge Function |
| Версія кешу SW | `dreamcar-brand-v19` | `service-worker.js`, bump при кожній правці ассетів |
| Бренд-червоний | `#E30613` | токени, лінк-акценти |
| Пошта бренду | `vg@dreamcar.ua` | `humans.txt`, `.well-known/security.txt`, футери |

## Секрети — де лежать, ніколи не значення

| Секрет | Де лежить | Хто ротує |
|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | GitHub repo secrets цього репо (єдиний секрет тут) | власник |

Джерело правди щодо назв — завжди дві команди, а не `.env`:
```
grep -h 'secrets\.' .github/workflows/*.yml | sort -u
gh secret list -R dreamcarua/brand-book
```
Ставити секрет тільки з `--body`, інакше запишеться порожнє значення.

## Патерни входу — як тут реально роблять повторювану дію

| Дія | Кроки | Запасний шлях |
|---|---|---|
| Внести правку в розділ | правити `sections/<розділ>.html` → `python3 scripts/brand_lint.py` → перегенерувати `search-index.json` і `print.html`, якщо змінився текст → bump `CACHE` у `service-worker.js`, якщо змінився ассет → коміт у `main` | якщо лінт червоний — дивитись, чи не спрацював `ALLOW_NEAR` (`traps.md`) |
| Перевірити лінт | `python3 scripts/brand_lint.py` локально; `--strict` показує ще й WARN | `gh run list -R dreamcarua/brand-book -w brand-lint.yml`, далі `gh run view <id> --log-failed` |
| Додати новий розділ | `sections/<новий>.html` з `<h1>` і `sidebar.js` → TOC в `index.html` → `assets/sidebar.js` → `sitemap.xml` → обидва генератори → bump SW | пропущене місце знайде лінт лише частково — перевіряти всі шість |
| Оновити og-image | правити `og-image.svg` → експорт у `og-image.png` 1200×630 → перевірити абсолютний URL у мета `index.html` → bump SW (файл у precache) → перевірити прев'ю шарінгом у Telegram | питання WebP-версії відкрите (`tasks.md`) |
| Перевірити стан Pages | `gh api repos/dreamcarua/brand-book/pages` | Settings → Pages |
| Правити спільний хедер | `assets/global-header.js` → `node --check assets/global-header.js` → перевірити щонайменше дві системи DreamCar | див. пастку про спільний хедер |

## Звіти

**Канал не підключений.** У репозиторії немає воркфлоу звітів, а `gh secret list -R dreamcarua/brand-book` (03.09.2026) показує лише `SUPABASE_ACCESS_TOKEN` — ані `TG_BOT_TOKEN`, ані `TG_CHAT_ID` немає. Поки канал не підключено, звіт за Exit віддається користувачеві прямо у відповіді: два-три речення про те, що змінилось для власника, і посилання або скріншот.

Щоб підключити стандартний канал: поставити обидва секрети командами з `memory/tasks.md`, додати `.github/workflows/report-to-telegram.yml` (шаблон A.8 набору памʼяті, назви секретів `TG_BOT_TOKEN` / `TG_CHAT_ID`) і `reports/README.md`. Перший звіт — про саму інсталяцію, він же перевірка каналу.

## Межі доступу — чого агент свідомо не робить

| Дія | Хто робить | Чому не агент |
|---|---|---|
| Публікація нового факту про клуб (кількість авто, розмір спільноти, імʼя власника авто) | власник | це публічна заява бренду, за неї відповідають юридично |
| Зміна формулювань у розділі 11B | власник | це юридична позиція, а не стиль |
| Зміна видимості репозиторію | власник | наслідки для безпеки, необоротно |
| Ротація будь-якого ключа | власник | агент не бачить наслідків для інших систем |
| Будь-який платіж | власник | завжди |

## Деплой і верифікація (внесено 04.09.2026)

- **Деплой:** `git bundle` із пісочниці → на Mac свіжий клон → `git fetch <bundle>` → `merge --ff-only` → push. Прямий пуш із пісочниці неможливий; tar-копіювання губить renames/deletes.
- **Верифікація проду:** тільки `curl` з Mac із `?v=N`. WebFetch таймаутить, браузерні MCP не конектяться. Cache-control на проді max-age=600, перед сайтом Cloudflare, HSTS є, CSP/X-Frame немає (Pages не вміє; можливо через CF).
- **CI:** `.github/workflows/brand-lint.yml` → `scripts/brand_lint.py`; статуси доступні публічно через `api.github.com/repos/dreamcarua/brand-book/actions/runs` без токена.
- **og-image:** рендер cairosvg + TTF з google/fonts у `~/.fonts` (variable Oswald коректно віддає вагу 700).
- **`global-header.js`** інжектиться через `assets/sidebar.js` з квері-версією: бампати GH_VERSION лише при зміні самого хедера, а SW CACHE — при будь-якій зміні контенту.
- **`email-templates/`** — живі робочі шаблони (eSputnik/Yespo), їх копіюють у розсилки.
- **Хто ще змінює репо:** інші Cowork-сесії Вадима.
