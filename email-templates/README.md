# DreamCar Email Templates

Брендовані email-шаблони для імпорту в eSputnik, MailChimp, Sendgrid, Yespo та інші ESP.

## Файли

| Файл | Призначення | Розмір |
|------|-------------|--------|
| [`dreamcar-master-launch.html`](dreamcar-master-launch.html) | **Майстер-шаблон** з placeholder-змінними `{{PROJECT_NUM}}`, `{{HERO_TITLE_LINE_1}}` тощо. База для всіх типів. | ~15 KB |
| [`example-bmw-x5.html`](example-bmw-x5.html) | **Готовий приклад** — анонс BMW X5 Hybrid. Заповнений реальними даними з проекту #17. | ~15 KB |

## Технічні характеристики

- **Ширина:** 600 px (responsive до 320 px)
- **Структура:** table-based, безпечно для всіх ESP та email-клієнтів (Gmail, Outlook 2007-2019, Apple Mail, iOS, Android)
- **CSS:** усі стилі inline (крім media queries для mobile)
- **Шрифти:** Google Fonts (Oswald + Archivo Black + Manrope + JetBrains Mono) з system-font fallback (Impact, Arial Black, Helvetica)
- **Темна тема:** автоматичний підтримуваний `color-scheme`
- **Outlook MSO:** окремі fixes для CTA-кнопок і шрифтів
- **Зображення:** використовуй абсолютні URL (CDN/dreamcar.ua hosted)

## Placeholder-змінні (master-шаблон)

| Placeholder | Опис | Приклад |
|-------------|------|---------|
| `{{SUBJECT}}` | Тема листа | "BMW X5 Hybrid — старт акції" |
| `{{PREHEADER_TEXT}}` | Прихований preview text у inbox | "Тарифи від 249 ₴ · 19.04 о 20:00" |
| `{{PROJECT_NUM}}` | Номер проекту | "17" |
| `{{HERO_KICKER}}` | Pre-title над заголовком | "СТАРТ НОВОЇ АКЦІЇ" |
| `{{HERO_TITLE_LINE_1}}` | Перший рядок заголовка | "ТВОЄ АВТО МРІЇ —" |
| `{{HERO_TITLE_LINE_2}}` | Другий рядок (буде з градієнтом) | "BMW X5 HYBRID" |
| `{{HERO_SUBTITLE}}` | Підзаголовок | "Преміум-кросовер з гібридом..." |
| `{{LIVE_DATE}}` | Дата ефіру | "19.04 · 20:00" |
| `{{PRICE_FROM}}` | Мінімальна ціна | "249" |
| `{{CTA_PRIMARY_LABEL}}` | Текст кнопки | "ВЗЯТИ УЧАСТЬ" |
| `{{CTA_PRIMARY_URL}}` | URL кнопки | "https://dreamcar.ua/x5" |
| `{{HERO_IMAGE_URL}}` | URL фото героя | "https://dreamcar.ua/assets/email/x5.jpg" |
| `{{HERO_IMAGE_ALT}}` | Alt-text для accessibility | "BMW X5 Hybrid · DreamCar" |
| `{{BODY_HEADLINE_1}}` | Body title (чорний) | "16 АВТО ВЖЕ ЗНАЙШЛИ" |
| `{{BODY_HEADLINE_2}}` | Body title (червоний акцент) | "СВОЇХ ВЛАСНИКІВ" |
| `{{BODY_PARAGRAPH_1}}` | Перший параграф | "З 2019 року DreamCar розіграв..." |
| `{{BODY_PARAGRAPH_2}}` | Другий параграф | "Долучайся, бо це твій шанс..." |
| `{{STEP_1_TITLE}}` / `{{STEP_1_DESC}}` | Перший крок "Як це працює" | "КУПУЄШ ТОКЕНИ" / "Від 249 ₴..." |
| `{{STEP_2_TITLE}}` / `{{STEP_2_DESC}}` | Другий крок | "ОТРИМУЄШ ДОСТУП ДО ШІ" / "..." |
| `{{STEP_3_TITLE}}` / `{{STEP_3_DESC}}` | Третій крок | "19.04 — ПРЯМИЙ ЕФІР" / "..." |
| `{{STATS_NUMBER}}` | Big stat | "35 000+" |
| `{{STATS_LABEL}}` | Підпис до stat | "УЧАСНИКІВ З 2019" |
| `{{CTA_SECONDARY_LABEL}}` | Текст secondary link | "Подивитись усіх переможців" |
| `{{CTA_SECONDARY_URL}}` | URL secondary | "https://dreamcar.ua/winners" |
| `{{SITE_URL}}` | URL сайту у footer | "https://dreamcar.ua" |
| `{{INSTAGRAM_URL}}` / `{{TELEGRAM_URL}}` / `{{TIKTOK_URL}}` / `{{YOUTUBE_URL}}` | Соцмережі | "https://instagram.com/dreamcar.ua" |
| `{{TERMS_URL}}` | Правила сервісу | "https://dreamcar.ua/terms" |
| `{{UNSUBSCRIBE_URL}}` | Список розсилки | _Auto-injected ESP-ом_ |
| `{{PREFERENCES_URL}}` | Налаштування підписки | "https://dreamcar.ua/preferences" |

## Імпорт у eSputnik

1. **Завантаж** файл `dreamcar-master-launch.html` (raw) з GitHub.
2. У eSputnik → **Шаблони → Створити шаблон → Імпорт HTML**.
3. **Замінити placeholder-и** на eSputnik-синтаксис:
   - `{{NAME}}` → `${contact.firstName}` (або `${contact.firstName!"друже"}` з fallback)
   - `{{TOKEN_ID}}` → `${contact.last_token_id}`
   - `{{UNSUBSCRIBE_URL}}` → залишити порожнім або `%UNSUBSCRIBE_URL%` (eSputnik сам підставить)
4. **Hero-зображення** залий у Media Library eSputnik → встав URL у `{{HERO_IMAGE_URL}}`.
5. **Тестова розсилка** на 2-3 свої email-и (Gmail, Outlook, Apple Mail) — перевір рендер.

## Імпорт у Yespo (раніше eSputnik)

Той самий процес. Yespo підтримує `${variable}` синтаксис.

## Імпорт у MailChimp

Замінити `{{VARIABLE}}` на `*|MERGE_TAG|*` синтаксис MailChimp:
- `{{NAME}}` → `*|FNAME|*`
- `{{UNSUBSCRIBE_URL}}` → `*|UNSUB|*`

## Тестування у Litmus / Email on Acid

Шаблон тестовано візуально на:
- ✅ Gmail (web + iOS + Android)
- ✅ Apple Mail (macOS + iOS)
- ✅ Outlook 2016 + 365 web
- ⚠️ Outlook 2010-2013 (старі): градієнт у CTA не показується — fallback на solid `#E30613`

## Брендові правила (важливо!)

- **Не змінювати** `#0A0A0A` (чорний) та `#E30613` (червоний) — ключові кольори.
- **Можна** використовувати `#FF6A1F` (оранжевий-accent) для CTA та highlights.
- **Заголовки** — `Oswald`/`Bebas Neue`/`Impact` (sans-serif). Не використовувати serif!
- **CTA** — `Archivo Black`/`Arial Black`. Завжди UPPERCASE. Завжди з стрілкою `→`.
- **Тон голосу:** прямий, на "ти", без вибачень. Без "будь ласка", "якщо вам зручно".

## Як зробити нову варіацію

Для **transactional** (підтвердження оплати), **reminder** (за 24 год до ефіру), **victory** (переможець) або **newsletter** (місячний дайджест):

1. Скопіюй `dreamcar-master-launch.html` як `dreamcar-<тип>.html`
2. Заміни:
   - Hero section (інша картинка, інший headline)
   - Body content (інший зміст)
   - CTA (інша дія)
3. Footer і header — лишити як є (брендова консистентність).
4. Запропонуй pull request у цей repo.

## Контакт

Питання — `vg@dreamcar.ua` або у TG `@dreamcar_ua`.
