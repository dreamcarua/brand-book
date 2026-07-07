# DreamCar Brand Book v4.0 «Etalon»

> Мрія за ціною чашки кави.

Операційна система бренду DreamCar — українського авто-клубу з 10-річною історією (17 авто вручено, 500K+ спільнота).

🌐 **Live:** https://brand.dreamcar.ua/

---

## 📚 Що всередині — 30 розділів

| Блок | Розділи |
|---|---|
| **На старт** | 00 Quick Start · 26 Onboarding 10хв · 27 Brand Tools · 28 Post Generator |
| **Стратегія** | 01 Маніфест · 02 Стратегія · 03 Аудиторія · 04 Контекст ринку |
| **Візуальна система** | 05 Логотип · 06 Кольори · 07 Типографіка · 08 Сітка та елементи |
| **Інтерфейс** | 09 UI-компоненти · 10 Анімації · 25 Mobile-First |
| **Голос і контент** | 11 Голос і мова · **11B Legal-safe лексикон** · 12 Контент · 13 Кризові комунікації · 23 Examples Library |
| **Партнери і довіра** | 14 Партнери · 15 Довіра і доступність (WCAG 2.1 AA) |
| **Техніка** | 16 Дизайн-ресурси · 17 Стиль медіа · 24 Photography Brief |
| **Точки контакту** | 18 Touchpoints · 19 Мерч |
| **Підсумки** | 20 Метрики · Roadmap · 21 Регламент підтримки · 22 AI-контент |

## 🛠 Живі інструменти

- **Voice Linter** — миттєва перевірка тексту на NEVER-слова + автофікс
- **Post Generator** — параметри акції → готовий пост IG/TG/Email + PNG
- **Color Contrast Checker** — WCAG 2.1 AA/AAA
- **Design Tokens** — JSON + CSS, клік = скопійовано
- **PWA** — працює offline, встановлюється як додаток

## ⚖ Ієрархія правил

При конфлікті правил: **ЗАКОН (11B) → ГОЛОС (11) → ВІЗУАЛ**. Legal-safe лексикон не перекриває ніщо.
Канонічний CTA-ритм: **«Бери. Дій. Володій.»**

## 🔧 Регенерація артефактів

```bash
python3 scripts/build_search_index.py   # assets/search-index.json
python3 scripts/build_print.py          # print.html (усі 30 розділів)
```

## 📦 Структура

```
index.html            — лендінг + TOC
sections/*.html       — 30 розділів (кожен самодостатній)
print.html            — версія для друку/PDF (генерується)
assets/styles.css     — єдина дизайн-система
assets/sidebar.js     — сайдбар + пошук + SEO-мета + global-header
assets/search-index.json — повнотекстовий пошук (генерується)
service-worker.js     — offline-кеш (PWA)
```

---

DREAMCAR · UA · EST. 2016 · [vg@dreamcar.ua](mailto:vg@dreamcar.ua)
