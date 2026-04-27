#!/bin/bash
# DreamCar Brand Book — Setup & Deploy Script
# Usage: ./setup.sh [github-username] [repo-name]

set -e  # Exit on any error

# === КОНФІГУРАЦІЯ ===
GITHUB_USER="${1:-$(gh api user -q .login 2>/dev/null || echo '')}"
REPO_NAME="${2:-brand-book}"
COMMIT_MSG="Initial commit: DreamCar Brand Book v2.1"

# === КОЛЬОРИ ===
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${RED}"
echo "╔══════════════════════════════════════════╗"
echo "║   DREAMCAR BRAND BOOK — DEPLOY SCRIPT    ║"
echo "║              v2.1 · 04.2026              ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# === ПЕРЕВІРКИ ===
echo -e "${BLUE}[1/7]${NC} Перевірка залежностей..."

if ! command -v git &> /dev/null; then
    echo -e "${RED}✕ Git не встановлено. Встанови: https://git-scm.com${NC}"
    exit 1
fi

if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠ GitHub CLI (gh) не знайдено${NC}"
    echo "  Без нього треба буде створити репозиторій вручну на github.com"
    echo "  Встанови: https://cli.github.com"
    USE_GH=false
else
    USE_GH=true
    if ! gh auth status &> /dev/null; then
        echo -e "${YELLOW}⚠ Не залогінений у GitHub CLI. Запусти: gh auth login${NC}"
        USE_GH=false
    fi
fi

# === GITHUB USERNAME ===
if [ -z "$GITHUB_USER" ]; then
    read -p "Введи твій GitHub username: " GITHUB_USER
fi

if [ -z "$GITHUB_USER" ]; then
    echo -e "${RED}✕ GitHub username обов'язковий${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} User: $GITHUB_USER"
echo -e "${GREEN}✓${NC} Repo: $REPO_NAME"

# === ІНІЦІАЛІЗАЦІЯ GIT ===
echo -e "\n${BLUE}[2/7]${NC} Ініціалізація Git..."

if [ ! -d .git ]; then
    git init
    echo -e "${GREEN}✓${NC} Git репозиторій ініціалізовано"
else
    echo -e "${YELLOW}⚠${NC} Git репозиторій вже існує"
fi

# === BRANCH ===
echo -e "\n${BLUE}[3/7]${NC} Налаштування основної гілки..."
git branch -M main 2>/dev/null || true
echo -e "${GREEN}✓${NC} Гілка main"

# === ADD + COMMIT ===
echo -e "\n${BLUE}[4/7]${NC} Додавання файлів..."
git add .
echo -e "${GREEN}✓${NC} Файли додано"

if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠${NC} Немає змін для коміту"
else
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}✓${NC} Зміни закомічено"
fi

# === STORE REMOTE URL ===
REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

# === СТВОРЕННЯ РЕПО НА GITHUB ===
echo -e "\n${BLUE}[5/7]${NC} Створення репозиторію на GitHub..."

if [ "$USE_GH" = true ]; then
    if gh repo view "${GITHUB_USER}/${REPO_NAME}" &> /dev/null; then
        echo -e "${YELLOW}⚠${NC} Репозиторій ${GITHUB_USER}/${REPO_NAME} вже існує"
    else
        gh repo create "${GITHUB_USER}/${REPO_NAME}" --public --description "DreamCar Brand Book v2.1" --homepage "https://${GITHUB_USER}.github.io/${REPO_NAME}/" 2>/dev/null || {
            echo -e "${RED}✕ Не вдалося створити репозиторій${NC}"
            echo "  Створи вручну: https://github.com/new"
            echo "  Name: ${REPO_NAME}"
            echo "  Visibility: Public"
        }
        echo -e "${GREEN}✓${NC} Репозиторій створено"
    fi
else
    echo -e "${YELLOW}⚠${NC} Створи вручну: https://github.com/new"
    echo "  Name: ${REPO_NAME}"
    echo "  Visibility: Public"
    read -p "Натисни Enter коли репозиторій створено..."
fi

# === REMOTE + PUSH ===
echo -e "\n${BLUE}[6/7]${NC} Push на GitHub..."

if git remote get-url origin &> /dev/null; then
    git remote set-url origin "$REMOTE_URL"
else
    git remote add origin "$REMOTE_URL"
fi

git push -u origin main

echo -e "${GREEN}✓${NC} Код на GitHub"

# === GITHUB PAGES ===
echo -e "\n${BLUE}[7/7]${NC} Налаштування GitHub Pages..."

if [ "$USE_GH" = true ]; then
    gh api -X POST "repos/${GITHUB_USER}/${REPO_NAME}/pages" \
      -f "source[branch]=main" \
      -f "source[path]=/" 2>/dev/null && \
      echo -e "${GREEN}✓${NC} GitHub Pages увімкнено" || \
      echo -e "${YELLOW}⚠${NC} Увімкни Pages вручну: https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages"
else
    echo -e "${YELLOW}⚠${NC} Увімкни Pages вручну:"
    echo "  https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages"
    echo "  Source: Deploy from a branch → main → / (root)"
fi

# === ФІНАЛ ===
echo -e "\n${RED}╔══════════════════════════════════════════╗${NC}"
echo -e "${RED}║              ✓ ГОТОВО!                   ║${NC}"
echo -e "${RED}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "📦 Репозиторій: ${BLUE}https://github.com/${GITHUB_USER}/${REPO_NAME}${NC}"
echo -e "🌐 Сайт (через ~1-2 хв): ${BLUE}https://${GITHUB_USER}.github.io/${REPO_NAME}/${NC}"
echo ""
echo "Наступні кроки:"
echo "  1. Зачекай 1-2 хвилини щоб Pages зібрав сайт"
echo "  2. Відкрий лінк вище"
echo "  3. (Опціонально) Додай custom domain — див. README.md"
echo ""
