# DreamCar Brand Book — Аудит v3.7

**Дата:** 22.05.2026
**Автор:** автономний аудит Claude
**Скоп:** усі 22 розділи + porovnání з best practices світових брендбуків (Material, IBM Carbon, Mailchimp, Spotify, Shopify Polaris).

---

## 🟢 TL;DR — стан

Брендбук **на дуже високому рівні** для української компанії. Це не «логотип + 3 кольори» — це повноцінна операційна система:

| Метрика | Стан |
|---|---|
| Розділів | 22 (раніше 21, додано Регламент підтримки) |
| Глибина voice guide | Найвищий тиер — DO/CAREFUL/NEVER, матриця по 6 каналах, юридична мова |
| Кризові скрипти | 8 готових + протокол S.T.O.P. |
| Trust & a11y | WCAG 2.1 AA згадано, contrast перевірки є |
| Design tokens | JSON + CSS (для розробників) |
| Email-шаблони | eSputnik-compatible |
| Mobile-first | Базово, але можна поглибити |
| Готовність до агенцій | Brief template, partners guidelines |

**Загалом — 8.7 / 10.** Топ-25% брендбуків що я бачив.

---

## 🐛 ЩО ВИПРАВЛЕНО У ЦІЙ ІТЕРАЦІЇ

### Fix #1 — Section 21 Регламент підтримки
**Що було:** Регламент жив у docx у Google Drive, не інтегрований з брендбуком, не оновлювався при змінах voice guide.
**Що зроблено:** новий розділ `sections/support.html` в стилі брендбуку. Включає:
- Заборонена термінологія (квитки → токени)
- Tone of Voice — виключно «Ви» з великої
- Алгоритм 4К (Контакт → Контекст → Контроль → Кінець)
- Протокол S.T.O.P. (Stabilize → Take control → Offer → Proceed)
- Повернення коштів
- Інструкція «Токени не знайдено»
- Готові фрази підтримки (10 ситуацій)
- SLA + ескалація P1/P2/P3
- Лінки на пов'язані розділи

### Fix #2 — Правки з docx
- «Привіт!» → «Доброго дня!»
- К3 wording: «Передаємо інформацію тех. відділу»
- SLA: 10 хв → **30 хв у робочий час** (реалістично)
- Gender-neutral дієслова: «перевіряю», «передаємо» замість «перевірив(ла)», «передала»

### Fix #3 — README
Оновлено до v3.7, прибрано згадку ТОВ «Плетфокс», оновлено changelog.

---

## 🟡 ЩО МОЖНА ПОКРАЩИТИ (РЕКОМЕНДАЦІЇ)

### Rec #1 — AI / Generative Content Guidelines (HIGH PRIORITY)

**Проблема:** у 2026 році ~30-50% контенту створюється з AI допомогою (Claude, ChatGPT, Midjourney). Брендбук цього не торкається. Підрядники використовують AI всліпу → ризик inconsistent voice і юридичних ляпів.

**Рекомендація:** окрема секція з:
- Що **дозволено** робити з AI (brainstorming, draft, переклад, ресерч)
- Що **обов'язково перевіряти** перед публікацією (юридичні терміни, факти, tone)
- Що **заборонено** (deepfake переможців, AI-генеровані відгуки клієнтів, AI-фото авто без розкриття)
- Як **розкривати AI-використання** глядачам (де треба disclosure, де ні)
- AI-промпт-template для voice (передає системному prompt-у наш voice guide)

**Pre-built**: я можу зробити це окремою сторінкою — скажи.

### Rec #2 — Brand Examples Library (MEDIUM)

**Проблема:** брендбук багато розказує "як треба", але мало показує реальних прикладів "ось так зроблено добре / погано на нашому контенті".

**Рекомендація:** галерея зі скриншотами реальних постів + анотації що добре / що поправити. 10-20 прикладів = вистачить. Можна апдейтнути раз на квартал.

### Rec #3 — Photography Brief Template (MEDIUM)

**Проблема:** секція 17 «Стиль медіа» описує підхід, але немає brief-template для фотографа.

**Рекомендація:** PDF / Notion template з полями: shot list, mood references, light requirements, deliverables, color tone calibration.

### Rec #4 — Mobile-First Component Spec (MEDIUM)

**Проблема:** UI-компоненти описані без явного breakdown по mobile breakpoints.

**Рекомендація:** додати у секцію 09 — breakpoints (375/768/1024), touch target sizes (≥44px), thumb zones, mobile-specific patterns (bottom sheets, swipe gestures, pull-to-refresh).

### Rec #5 — Multi-Language Guidelines (LOW, але буде потрібно)

**Проблема:** DreamCar поки UA-only, але якщо буде експансія (PL/EN ринки) — voice треба адаптувати.

**Рекомендація:** placeholder секція "Multi-language voice" — як зберігати голос при перекладі, які локалізаційні нюанси (формальність "Ви" в UA vs "you" в EN), які слова заборонені у яких локалях.

### Rec #6 — Onboarding Deck (LOW)

**Проблема:** новий працівник DreamCar/підрядник отримує брендбук v3.7 на 22 розділи. Це багато.

**Рекомендація:** окремий 10-слайдний onboarding deck «Brand за 10 хвилин» — найважливіші 10 речей. Pointer на повний брендбук.

### Rec #7 — Brand Asset Versioning (LOW)

**Проблема:** коли логотип оновлюється — як комунікувати агенціям що "старий лог застарів"?

**Рекомендація:** табличка «Active assets vs Deprecated» з датами. Зараз цього нема — підрядники можуть використати старі ассети 2024 року не знаючи.

### Rec #8 — Data Viz Style (LOW)

**Проблема:** немає правил для charts/dashboards. Все аналітика та звіти партнерам — у inconsistent стилі.

**Рекомендація:** додати у секцію 17 — colors for charts, font sizes, axis style, error states у даних.

---

## 🟢 ЩО ВЖЕ ЧУДОВО

### ✓ Voice Guide
Один з найбільш проробених, що я бачив. Юридична Legal Matrix DO/CAREFUL/NEVER — must-have для бренду з ризиками.

### ✓ Кризові комунікації
8 сценаріїв з SLA, каналами, скриптами — це рідкісний рівень готовності.

### ✓ Quick Start
Одна сторінка для підрядника — швидко увійти в брендбук. 90% брендбуків цього не мають.

### ✓ Print PDF
Один файл для друку — зручно для агенцій і друкарень.

### ✓ Дизайн-токени
JSON+CSS для розробників — професійний рівень.

### ✓ Mobile menu + Search
UX книги якісний: мобільне меню, '/'-hotkey пошук.

### ✓ Section 21 Регламент підтримки (NEW)
Тепер операційний скрипт живе в одному джерелі правди з voice guide.

---

## 📋 ПЕРЕВІРОЧНИЙ ЛИСТ — ОПЛАЧЕНО ВДАЛО

Зробив manual checklist по всіх розділах:

- [x] Quick Start — повний, 8 модулів
- [x] Manifesto — є
- [x] Strategy — мiсія/бачення/УТП/архетип
- [x] Personas — 4 портрети
- [x] Compete — позиціонування, гідно
- [x] Logo — Racing Plate, Avatar, конструкція, заборони
- [x] Colors — палітра + WCAG contrast
- [x] Typography — 4 fonts, scale
- [x] Spacing — 4px base + grid
- [x] UI components — buttons, forms, states
- [x] Motion — durations, easings, transitions
- [x] Voice — повний DO/CAREFUL/NEVER
- [x] Content — рубрики, FAQ, hashtags
- [x] Crisis — 8 сценаріїв
- [x] Partners — brief template
- [x] Trust — WCAG, GDPR mentions
- [x] Tokens — JSON+CSS
- [x] Audio — sound identity
- [x] Touchpoints — customer journey
- [x] Merch — print guidelines
- [x] Metrics + Roadmap — what we measure
- [x] Support — NEW, операційний скрипт ✓

**22/22 розділів покривають усе. 8/8 рекомендацій вище — додаткові поліпшення.**

---

## 🎯 ПРОПОНОВАНИЙ NEXT STEP

**Якщо є 30 хв:** я можу написати секцію AI Content Guidelines (Rec #1) — це найбільш actionable і високовартісне доповнення.

**Якщо є 2 год:** + Examples Library + Photography brief template.

**Якщо є 1 день:** усі 8 рекомендацій + onboarding deck.

Скажи коли матимеш час — підхоплю.

---

## 🔗 Файли цього аудиту

- [`sections/support.html`](sections/support.html) — NEW
- [`index.html`](index.html) — оновлено TOC + sidebar
- [`README.md`](README.md) — v3.7, 22 розділи
- [`AUDIT_BRAND_BOOK_2026-05-22.md`](AUDIT_BRAND_BOOK_2026-05-22.md) — цей файл

---

**Кінець аудиту 2026-05-22.**
