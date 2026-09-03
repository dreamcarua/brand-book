# 🤖 ІНСТРУКЦІЯ ДЛЯ COWORK

Скопіюй текст нижче і дай Cowork-у на твоєму комп'ютері:

---

## 📋 ТЕКСТ ДЛЯ COWORK (скопіюй все нижче)

```
Привіт! Мені треба задеплоїти DreamCar Brand Book на GitHub Pages.

КРОКИ:

1. У мене в Downloads (або в папці куди скачано) є архів dreamcar-brand-book-repo.zip
2. Розпакуй його на робочий стіл у папку dreamcar-brand-book
3. Відкрий термінал у цій папці
4. Запусти команду: bash setup.sh
5. Якщо запитає GitHub username — введи мій (я скажу окремо)
6. Скрипт автоматично:
   - Створить git репозиторій
   - Запушить файли на GitHub
   - Створить публічний репо `brand-book`
   - Увімкне GitHub Pages
7. Дай мені фінальний URL виду https://[мій-username].github.io/brand-book/

ЯКЩО ЩОСЬ ПІДЕ НЕ ТАК:
- Якщо немає GitHub CLI (gh) — встанови через `brew install gh` (Mac) і `gh auth login`
- Якщо немає git — `brew install git` (Mac)
- Якщо помилка прав — спробуй `sudo bash setup.sh`

ПЕРЕВІРКА УСПІХУ:
- Відкрий URL у браузері
- Має з'явитися чорна сторінка з логотипом DreamCar і брендбук
- Якщо 404 — почекай 1-2 хвилини і онови

Після успіху скажи мені URL і скріншот головної сторінки.
```

---

## 🔧 ЯКЩО COWORK НЕ СПРАЦЮВАВ — РУЧНИЙ ВАРІАНТ

Якщо щось пішло не так, ось ручні кроки які можеш виконати сам:

### 1. Створи репозиторій на GitHub
Перейди на https://github.com/new
- **Repository name:** `brand-book`
- **Visibility:** Public
- **Don't initialize with README** (бо в нас вже є)
- Натисни **Create repository**

### 2. У терміналі (у папці з розпакованим архівом)

```bash
cd ~/Desktop/dreamcar-brand-book

# Ініціалізація
git init
git branch -M main

# Додавання файлів
git add .
git commit -m "Initial commit: DreamCar Brand Book v2.1"

# Підключення до GitHub
git remote add origin https://github.com/ТВІЙ_USERNAME/brand-book.git
git push -u origin main
```

### 3. Увімкни GitHub Pages

1. Перейди в **Settings** репозиторію
2. Зліва вибери **Pages**
3. **Source:** Deploy from a branch
4. **Branch:** `main` / `(root)`
5. Натисни **Save**
6. Через 1-2 хвилини сайт з'явиться на:
   `https://ТВІЙ_USERNAME.github.io/brand-book/`

### 4. (Опціонально) Кастомний домен

Якщо хочеш `brand.dreamcar.ua`:

1. Створи файл `CNAME` у репозиторії з вмістом:
   ```
   brand.dreamcar.ua
   ```

2. У DNS провайдера домену `dreamcar.ua` додай CNAME запис:
   ```
   Name: brand
   Type: CNAME
   Value: ТВІЙ_USERNAME.github.io
   TTL: 3600
   ```

3. У Settings → Pages вкажи Custom domain `brand.dreamcar.ua`
4. Постав галочку **Enforce HTTPS**

---

## 📁 ЩО В АРХІВІ

```
dreamcar-brand-book-repo/
├── index.html          # Сам брендбук (270KB, 5000+ рядків)
├── 404.html            # Стилізована сторінка помилки
├── favicon.svg         # Favicon з DC-монограмою
├── og-image.svg        # Preview-картинка для соцмереж (1200×630)
├── robots.txt          # SEO
├── .nojekyll           # Disable Jekyll на GitHub Pages
├── .gitignore          # Виключення з Git
├── README.md           # Опис репо
├── setup.sh            # Автоматичний deploy скрипт
└── COWORK-INSTRUCTIONS.md  # Цей файл
```

---

## ✅ ПЕРЕВІРКА ПІСЛЯ ДЕПЛОЮ

Відкрий сайт і перевір:
- [ ] Головна завантажується
- [ ] Логотип видно правильно
- [ ] Темна тема (не біла)
- [ ] Мобільна версія норм (відкрий на телефоні)
- [ ] Favicon з'явився у вкладці браузера
- [ ] Кинь лінк у Telegram/Slack — preview має бути красивий (з OG-image)
- [ ] Спробуй неіснуючий URL типу `/test` — має з'явитись 404 сторінка

---

## 🆘 ЯКЩО ПИТАННЯ

Email: vg@dreamcar.ua
