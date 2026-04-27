# DreamCar Brand Book v2.1

> Мрія за ціною чашки кави.

Повне керівництво з фірмового стилю DreamCar — українського сервісу чесних авто-розіграшів.

🌐 **Live:** https://dreamcar.github.io/brand-book/

---

## 📚 Що всередині

29 розділів, які покривають усе:

- **Стратегія** — маніфест, місія, бачення, цінності, персони
- **Конкурентний ландшафт** — позиціонування, UVP
- **Логотип** — Racing Plate, Avatar Mark для соцмереж, конструкція, заборони
- **Кольори** — primary палітра, UI-стани, accessibility (WCAG 2.1 AA)
- **Типографіка** — Bebas Neue · Archivo Black · Manrope · JetBrains Mono
- **Spacing & Grid** — 10-рівнева шкала, 12-колонковий грід
- **UI компоненти** — кнопки, форми, motion система
- **Голос бренду** — DO/DON'T, ToV по 6 каналах
- **Юридична мова** — Legal Language Matrix (DO / CAREFUL / NEVER)
- **Контент** — 8 рубрик, хештег-стратегія, FAQ, сторітелінг
- **Кризові комунікації** — 7 готових скриптів реакції
- **Партнери** — brief-template, гайдлайни, co-branding
- **Trust & Compliance** — trust-сигнали, GDPR
- **Design Tokens** — JSON + CSS для розробників
- **+ 8 додаткових розділів**: audio, email шаблони, touchpoints, фото-напрямок, мерч, empty states, метрики, roadmap

## 🎯 Quick Start

Якщо у тебе 5 хвилин і одне завдання — читай розділ **Quick Start** на початку. Все необхідне на одній сторінці.

## 📁 Структура

```
brand-book/
├── index.html          # Сам брендбук (single-file)
├── 404.html            # Сторінка помилки
├── favicon.svg         # Favicon в бренд-стилі
├── apple-touch-icon.png # Apple touch icon
├── og-image.svg        # Open Graph preview
├── robots.txt          # SEO
├── .nojekyll           # Disable Jekyll processing
└── README.md           # Цей файл
```

## 🚀 Запуск локально

```bash
# Просто відкрий index.html у браузері
open index.html

# Або підніми локальний сервер
python3 -m http.server 8000
# Відкрий http://localhost:8000
```

## 🌐 Деплой на GitHub Pages

```bash
# 1. Закомітити зміни
git add .
git commit -m "Update brand book"
git push origin main

# 2. У Settings → Pages → Source: main / (root)
# 3. Сторінка з'явиться на https://[username].github.io/brand-book/
```

### Кастомний домен

Створи файл `CNAME` з твоїм доменом:
```
brand.dreamcar.ua
```

У DNS налаштуваннях твого домену додай CNAME запис:
```
brand → [username].github.io
```

## 🔄 Версіонування

| Версія | Дата | Зміни |
|--------|------|-------|
| v2.1 | 04.2026 | Manrope замість Inter, Quick Start, Legal Matrix, mobile фікси |
| v2.0 | 04.2026 | Розширення: персони, конкуренти, secondary палітра, accessibility, design tokens, кризові скрипти |
| v1.0 | 03.2026 | Перша версія: базовий лого, кольори, типографіка |

## 📞 Контакт

Усі питання щодо бренду:
- **Email:** vg@dreamcar.ua
- **Telegram:** @dreamcar_brand

## 📜 Юридично

ТОВ «Плетфокс» · ЄДРПОУ 44236899 · м. Дніпро · EST. 2016

---

**© 2026 DreamCar. All rights reserved.**
