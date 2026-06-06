// =====================================================================
// DreamCar Global Header v1.0
// =====================================================================
// Універсальний sticky-header для:
//   • brand.dreamcar.ua (брендбук, всі розділи)
//   • team.dreamcar.ua (Hub, Tasks, HQ, Onboarding, Orgchart, Survey)
//
// Підключення:
//   <script src="https://brand.dreamcar.ua/assets/global-header.js" defer></script>
//
// Включає:
//   • Логотип Racing Plate (SVG) — клік → дім поточного домена
//   • Cross-domain меню до всіх систем (Brand / HQ / Tasks / Onboarding / Org / Survey)
//   • Mobile hamburger з slide-down панеллю
//   • Active-стан для поточної сторінки
// =====================================================================

(function () {
  'use strict';

  // Не дублюємо якщо вже встановлений
  if (window.__dreamcarGlobalHeader) return;
  window.__dreamcarGlobalHeader = true;

  const BRAND_BASE = 'https://brand.dreamcar.ua';
  const TEAM_BASE  = 'https://team.dreamcar.ua';
  const DASHBOARD_BASE = 'https://dashboard.dreamcar.ua';
  const LOGO_SVG   = BRAND_BASE + '/assets/logo/dreamcar-racing-plate.svg';

  const host = window.location.hostname;
  const path = window.location.pathname;
  const isBrand = host.includes('brand.') || host.includes('dreamcarua.github.io/brand-book');
  const isTeam  = host.includes('team.')  || host.includes('dreamcarua.github.io/dreamcar-team');
  const isDashboard = host.includes('dashboard.');

  // ---- Меню ----
  const LINKS = [
    {
      key: 'brand',
      label: 'BRAND BOOK',
      short: 'BRAND',
      icon: '📘',
      url: BRAND_BASE + '/',
      active: isBrand,
    },
    {
      key: 'smm',
      label: 'SMM',
      short: 'SMM',
      icon: '🎯',
      url: TEAM_BASE + '/hq/',
      active: isTeam && path.startsWith('/hq'),
    },
    {
      key: 'projects',
      label: 'ПРОЄКТИ',
      short: 'PROJECTS',
      icon: '📁',
      url: TEAM_BASE + '/projects/',
      active: isTeam && path.startsWith('/projects'),
    },
    {
      key: 'tasks',
      label: 'TASKS',
      short: 'TASKS',
      icon: '✅',
      url: TEAM_BASE + '/tasks/',
      active: isTeam && path.startsWith('/tasks'),
    },
    {
      key: 'retention',
      label: 'РЕТЕНШН',
      short: 'РЕТЕНШН',
      icon: '📬',
      url: TEAM_BASE + '/retention/',
      active: isTeam && path.startsWith('/retention'),
    },
    {
      key: 'onboard',
      label: 'ONBOARDING',
      short: 'ONBOARD',
      icon: '🚀',
      url: TEAM_BASE + '/onboarding.html',
      active: isTeam && path.includes('onboarding'),
    },
    {
      key: 'org',
      label: 'ORG-CHART',
      short: 'ORG',
      icon: '🌐',
      url: TEAM_BASE + '/orgchart.html',
      active: isTeam && path.includes('orgchart'),
    },
    {
      key: 'survey',
      label: 'SURVEY 2026',
      short: 'SURVEY',
      icon: '📊',
      url: TEAM_BASE + '/survey.html',
      active: isTeam && path.includes('survey'),
    },
    {
      key: 'dashboard',
      label: 'ДАШБОРД РЕЗУЛЬТАТІВ',
      short: 'ДАШБОРД',
      icon: '📊',
      url: DASHBOARD_BASE + '/',
      active: isDashboard,
    },
  ];

  // ---- CSS ----
  const css = `
    :root {
      --dc-header-h: 56px;
      --dc-header-h-mobile: 54px;
      --dc-z: 999;
    }
    body { padding-top: var(--dc-header-h); }
    @media (max-width: 720px) { body { padding-top: var(--dc-header-h-mobile); } }
    .dc-gh {
      position: fixed; top: 0; left: 0; right: 0;
      height: var(--dc-header-h);
      z-index: var(--dc-z);
      background: rgba(10,10,10,0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid #2A2A2A;
      display: flex; align-items: center;
      padding: 0 18px; gap: 14px;
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      color: #fff;
    }
    .dc-gh-logo {
      display: flex; align-items: center; gap: 8px;
      text-decoration: none; flex-shrink: 0;
      height: 100%;
    }
    .dc-gh-logo img {
      height: 36px; width: auto; display: block;
    }
    .dc-gh-logo-fallback {
      font-family: 'Archivo Black', sans-serif;
      font-size: 14px; letter-spacing: 0.04em;
      color: #fff; text-transform: uppercase;
      display: none;
    }
    .dc-gh-logo-fallback .red { color: #E30613; }
    .dc-gh-logo img.broken + .dc-gh-logo-fallback { display: inline; }

    .dc-gh-nav {
      display: flex; align-items: center; gap: 2px;
      flex: 1; justify-content: flex-end;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .dc-gh-nav::-webkit-scrollbar { display: none; }
    .dc-gh-nav a {
      color: #BBB; text-decoration: none;
      padding: 5px 10px; font-size: 10.5px;
      letter-spacing: 0.16em; text-transform: uppercase;
      border: 1px solid transparent;
      transition: color 120ms, border-color 120ms, background 120ms;
      white-space: nowrap;
      border-radius: 3px;
    }
    .dc-gh-nav a:hover {
      color: #fff; border-color: #E30613;
      background: rgba(227,6,19,0.08);
    }
    .dc-gh-nav a.active {
      color: #E30613; border-color: #E30613;
      background: rgba(227,6,19,0.12);
      font-weight: 700;
    }
    .dc-gh-nav a .icon { display: none; }

    .dc-gh-right {
      display: flex; align-items: center; gap: 8px;
      flex-shrink: 0;
    }

    /* Mobile burger з лейблом «ВСІ СИСТЕМИ» — щоб користувач бачив куди тиснути */
    .dc-gh-burger {
      display: none;
      align-items: center; gap: 8px;
      background: transparent; border: 1px solid #2A2A2A;
      color: #fff; padding: 7px 12px; cursor: pointer;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; letter-spacing: 0.18em;
      text-transform: uppercase; font-weight: 600;
      line-height: 1; border-radius: 3px;
      transition: border-color 120ms, background 120ms;
    }
    .dc-gh-burger:hover { border-color: #E30613; background: rgba(227,6,19,0.06); }
    .dc-gh-burger .dc-gh-burger-icon { font-size: 16px; line-height: 1; }
    .dc-gh-burger .dc-gh-burger-label { display: inline; }
    /* На дуже малих екранах ховаємо текст, лишаємо лише іконку */
    @media (max-width: 380px) {
      .dc-gh-burger { padding: 7px 10px; }
      .dc-gh-burger .dc-gh-burger-label { display: none; }
    }

    /* ── GLOBAL SEARCH (🔍 у топбарі, overlay з полем + результатами) ── */
    .dc-gh-search-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: transparent; border: 1px solid #2A2A2A;
      color: #fff; padding: 7px 12px; cursor: pointer;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; letter-spacing: 0.18em;
      text-transform: uppercase; font-weight: 600;
      line-height: 1;
      border-radius: 3px;
      transition: border-color 120ms, background 120ms;
      flex-shrink: 0;
    }
    .dc-gh-search-btn:hover { border-color: #E30613; background: rgba(227,6,19,0.06); }
    .dc-gh-search-btn .dc-gh-search-ico { font-size: 16px; line-height: 1; }
    .dc-gh-search-btn .dc-gh-search-lbl { display: inline; }
    /* На дуже малих екранах ховаємо текст, лишаємо лише іконку */
    @media (max-width: 380px) {
      .dc-gh-search-btn { padding: 7px 10px; }
      .dc-gh-search-btn .dc-gh-search-lbl { display: none; }
    }

    /* Search overlay */
    .dc-gh-search-overlay {
      position: fixed; inset: 0; z-index: calc(var(--dc-z) + 1);
      background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
      display: none; flex-direction: column;
      padding: 0;
    }
    .dc-gh-search-overlay.show { display: flex; }
    .dc-gh-search-overlay-head {
      display: flex; align-items: center; gap: 12px;
      padding: 18px 22px; border-bottom: 1px solid #2A2A2A;
      background: rgba(10,10,10,0.92);
    }
    .dc-gh-search-overlay-head input {
      flex: 1; background: transparent; border: none; outline: none;
      color: #fff; font-family: 'Manrope', sans-serif;
      font-size: 22px; letter-spacing: 0.01em;
      padding: 4px 0;
    }
    .dc-gh-search-overlay-head input::placeholder { color: #555; }
    .dc-gh-search-overlay-head .dc-gh-search-close {
      background: transparent; border: 1px solid #2A2A2A;
      color: #fff; padding: 8px 14px; cursor: pointer;
      font-family: 'JetBrains Mono', monospace; font-size: 11px;
      letter-spacing: 0.2em; border-radius: 3px;
    }
    .dc-gh-search-overlay-head .dc-gh-search-close:hover { border-color: #E30613; }
    .dc-gh-search-overlay-body {
      flex: 1; overflow-y: auto; padding: 22px;
      max-width: 880px; width: 100%; margin: 0 auto;
    }
    .dc-gh-search-section {
      margin-bottom: 24px;
    }
    .dc-gh-search-section-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
      color: #E30613; margin-bottom: 10px; font-weight: 700;
    }
    .dc-gh-search-result {
      display: flex; align-items: center; gap: 14px;
      padding: 12px 14px; margin-bottom: 6px;
      background: #141414; border: 1px solid #2A2A2A; border-radius: 4px;
      cursor: pointer; text-decoration: none; color: #fff;
      transition: border-color 120ms, background 120ms;
    }
    .dc-gh-search-result:hover { border-color: #E30613; background: rgba(227,6,19,0.06); }
    .dc-gh-search-result .dc-gh-result-icon { font-size: 18px; }
    .dc-gh-search-result .dc-gh-result-info { flex: 1; min-width: 0; }
    .dc-gh-search-result .dc-gh-result-title {
      font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 600;
      margin-bottom: 2px; color: #fff;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .dc-gh-search-result .dc-gh-result-meta {
      font-family: 'JetBrains Mono', monospace; font-size: 10px;
      color: #888; letter-spacing: 0.1em; text-transform: uppercase;
    }
    .dc-gh-search-result mark {
      background: #E30613; color: #fff; padding: 0 2px;
    }
    .dc-gh-search-empty {
      text-align: center; color: #555;
      font-family: 'JetBrains Mono', monospace; font-size: 12px;
      padding: 60px 20px; letter-spacing: 0.1em;
    }
    .dc-gh-search-tip {
      color: #555; font-size: 11px;
      font-family: 'JetBrains Mono', monospace; letter-spacing: 0.1em;
      padding: 4px 0;
    }
    .dc-gh-search-tip kbd {
      background: #1f1f1f; border: 1px solid #333;
      padding: 1px 6px; border-radius: 3px;
      font-family: inherit; font-size: 10px;
    }

    @media (max-width: 920px) {
      .dc-gh { padding: 0 8px; height: var(--dc-header-h-mobile); gap: 8px; }
      .dc-gh-logo img { height: 28px; }
      .dc-gh-logo { flex-shrink: 0; }
      .dc-gh-nav { display: none; }
      .dc-gh-burger { display: inline-flex; }
      /* РОЗТЯГУЄМО search + burger на всю доступну ширину справа від лого.
         Повні лейбли «Глобальний пошук» / «Усі системи» — без пустот. */
      .dc-gh-right {
        flex: 1 1 auto !important;
        display: flex !important;
        gap: 6px !important;
        min-width: 0 !important;
        justify-content: stretch !important;
      }
      .dc-gh-search-btn,
      .dc-gh-burger {
        flex: 1 1 0 !important;
        justify-content: center !important;
        padding: 8px 6px !important;
        gap: 6px !important;
        font-size: 10px !important;
        letter-spacing: 0.06em !important;
        min-width: 0 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      .dc-gh-search-btn .dc-gh-search-ico,
      .dc-gh-burger .dc-gh-burger-icon { font-size: 13px !important; flex-shrink: 0 !important; }
      .dc-gh-search-btn .dc-gh-search-lbl,
      .dc-gh-burger .dc-gh-burger-label {
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        min-width: 0 !important;
      }
    }

    /* Slide-down mobile panel — ФОРСУЄМО ВЕРТИКАЛЬНУ КОЛОНКУ через display:flex column.
       Без цього на брендбуку посилання рендеряться горизонтальною сіткою (default a behaviour
       з властивостями що задає брендбук css). */
    .dc-gh-panel {
      position: fixed !important;
      top: var(--dc-header-h-mobile) !important;
      left: 0 !important; right: 0 !important;
      background: #0A0A0A !important;
      border-bottom: 1px solid #2A2A2A !important;
      transform: translateY(-110%);
      transition: transform 220ms cubic-bezier(0.2, 0.9, 0.3, 1);
      z-index: calc(var(--dc-z) - 1) !important;
      padding: 12px !important;
      max-height: calc(100vh - var(--dc-header-h-mobile)) !important;
      overflow-y: auto !important;
      /* CRITICAL: forces вертикальний layout */
      display: flex !important;
      flex-direction: column !important;
      gap: 6px !important;
      width: auto !important;
    }
    .dc-gh-panel.show { transform: translateY(0); }
    .dc-gh-panel a {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      width: 100% !important;
      flex: 0 0 auto !important;
      color: #DDD !important; text-decoration: none !important;
      padding: 14px 16px !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 13px !important; letter-spacing: 0.1em !important;
      border: 1px solid #2A2A2A !important;
      margin: 0 !important;
      border-radius: 3px !important;
      transition: border-color 120ms, color 120ms, background 120ms !important;
      box-sizing: border-box !important;
      text-transform: uppercase !important;
      font-weight: 500 !important;
      background: transparent !important;
    }
    .dc-gh-panel a:hover, .dc-gh-panel a.active {
      color: #fff !important; border-color: #E30613 !important;
      background: rgba(227,6,19,0.08) !important;
    }
    .dc-gh-panel a .icon { font-size: 18px !important; line-height: 1 !important; }
    .dc-gh-panel a .text, .dc-gh-panel a span:not(.icon) { flex: 1 !important; }

    /* Sidebar layout fix on brand-book — sidebar тягнеться під header (без "сходинки"),
       контент відступає всередині через padding-top. */
    body.has-sidebar { padding-top: 0; }
    body.has-sidebar .sidebar {
      top: 0;
      height: 100vh;
      padding-top: calc(var(--dc-header-h) + 28px);
    }
    @media (max-width: 920px) {
      body.has-sidebar .sidebar {
        padding-top: calc(var(--dc-header-h-mobile) + 28px);
      }
    }
    body.has-sidebar .topbar { top: var(--dc-header-h); }
    @media (max-width: 920px) {
      body.has-sidebar .topbar { top: var(--dc-header-h-mobile); }
    }
    /* Main content must also offset down so it's not hidden under header */
    body.has-sidebar .main { padding-top: var(--dc-header-h); }
    @media (max-width: 920px) {
      body.has-sidebar .main { padding-top: var(--dc-header-h-mobile); }
    }

    /* Print: hide header */
    @media print { .dc-gh, .dc-gh-panel { display: none !important; } body { padding-top: 0 !important; } }
  `;

  const style = document.createElement('style');
  style.setAttribute('data-dc-gh', '');
  style.textContent = css;
  document.head.appendChild(style);

  // ---- HTML ----
  function buildNav(linksHtmlList) {
    return LINKS.map((l) => {
      const cls = l.active ? ' active' : '';
      return `<a href="${l.url}" class="${cls}" data-key="${l.key}"><span class="icon">${l.icon}</span><span class="text">${l.short}</span></a>`;
    }).join('');
  }

  function buildPanel() {
    return LINKS.map((l) => {
      const cls = l.active ? ' active' : '';
      return `<a href="${l.url}" class="${cls}" data-key="${l.key}"><span class="icon">${l.icon}</span><span>${l.label}</span></a>`;
    }).join('');
  }

  function injectHeader() {
    // Уникаємо подвійного інжекту
    if (document.querySelector('.dc-gh')) return;

    const homeUrl = isTeam ? TEAM_BASE + '/' : BRAND_BASE + '/';

    const header = document.createElement('header');
    header.className = 'dc-gh';
    header.innerHTML = `
      <a href="${homeUrl}" class="dc-gh-logo" aria-label="DreamCar — головна">
        <img src="${LOGO_SVG}" alt="DreamCar" onerror="this.classList.add('broken')">
        <span class="dc-gh-logo-fallback">DREAM<span class="red">CAR</span></span>
      </a>
      <nav class="dc-gh-nav" aria-label="Основна навігація">
        ${buildNav()}
      </nav>
      <div class="dc-gh-right">
        <button class="dc-gh-search-btn" aria-label="Глобальний пошук" title="Глобальний пошук (⌘K)">
          <span class="dc-gh-search-ico">⌕</span>
          <span class="dc-gh-search-lbl">Глобальний пошук</span>
        </button>
        <button class="dc-gh-burger" aria-label="Усі системи" aria-expanded="false" title="Усі системи DreamCar">
          <span class="dc-gh-burger-icon">≡</span>
          <span class="dc-gh-burger-label">Усі системи</span>
        </button>
      </div>
    `;

    const panel = document.createElement('nav');
    panel.className = 'dc-gh-panel';
    panel.setAttribute('aria-label', 'Мобільна навігація');
    panel.innerHTML = buildPanel();

    document.body.insertBefore(header, document.body.firstChild);
    document.body.insertBefore(panel, document.body.firstChild.nextSibling);

    // Toggle
    const burger = header.querySelector('.dc-gh-burger');
    const burgerIcon = burger.querySelector('.dc-gh-burger-icon');
    const burgerLabel = burger.querySelector('.dc-gh-burger-label');
    // ПОВНІ лейбли завжди — кнопки розширюються щоб заповнити ширину
    function setBurgerState(open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (burgerIcon) burgerIcon.textContent = open ? '×' : '≡';
      if (burgerLabel) burgerLabel.textContent = open ? 'Закрити' : 'Усі системи';
    }
    setBurgerState(false);  // initial state
    burger.addEventListener('click', () => {
      const open = panel.classList.toggle('show');
      setBurgerState(open);
    });

    // Close panel after link click
    panel.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        panel.classList.remove('show');
        setBurgerState(false);
      })
    );

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('show')) return;
      if (panel.contains(e.target) || header.contains(e.target)) return;
      panel.classList.remove('show');
      setBurgerState(false);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('show')) {
        panel.classList.remove('show');
        setBurgerState(false);
      }
    });

    // ─────────────────────────────────────────────
    // GLOBAL SEARCH — overlay з пошуком по всіх системах
    // Джерела:
    //   1. window.DC_PAGE_NAV.pages — поточна сторінка локально
    //   2. brand.dreamcar.ua/assets/search-index.json — повний індекс брендбуку (29 розділів + контент)
    //   3. SYSTEMS (Brand/HQ/Tasks/Onboarding/Org/Survey)
    // ─────────────────────────────────────────────
    const searchBtn = header.querySelector('.dc-gh-search-btn');
    let searchOverlay = null;
    let brandIndex = null;
    let brandIndexLoading = false;

    function loadBrandIndex() {
      if (brandIndex || brandIndexLoading) return Promise.resolve(brandIndex);
      brandIndexLoading = true;
      return fetch(BRAND_BASE + '/assets/search-index.json', { cache: 'force-cache' })
        .then(r => r.ok ? r.json() : null)
        .then(json => { brandIndex = json; return json; })
        .catch(() => null);
    }

    function buildSearchOverlay() {
      if (searchOverlay) return searchOverlay;
      searchOverlay = document.createElement('div');
      searchOverlay.className = 'dc-gh-search-overlay';
      searchOverlay.innerHTML = `
        <div class="dc-gh-search-overlay-head">
          <input type="search" id="dcGhSearchInput" placeholder="Пошук по всіх системах…" autocomplete="off" autocapitalize="off" spellcheck="false" />
          <button class="dc-gh-search-close" aria-label="Закрити">ESC</button>
        </div>
        <div class="dc-gh-search-overlay-body" id="dcGhSearchBody">
          <div class="dc-gh-search-section">
            <div class="dc-gh-search-section-title">🏠 Системи</div>
            <div id="dcGhSearchSystems"></div>
          </div>
          <div class="dc-gh-search-section" id="dcGhSearchLocalSection" style="display:none">
            <div class="dc-gh-search-section-title">📍 На цій сторінці</div>
            <div id="dcGhSearchLocal"></div>
          </div>
          <div class="dc-gh-search-section" id="dcGhSearchBrandSection" style="display:none">
            <div class="dc-gh-search-section-title">📘 Brand Book</div>
            <div id="dcGhSearchBrand"></div>
          </div>
          <div class="dc-gh-search-section" id="dcGhSearchLiveSection" style="display:none">
            <div class="dc-gh-search-section-title">📡 Жива база <span id="dcGhSearchLiveLoading" style="color:#888;font-weight:400;letter-spacing:0;text-transform:none;display:none">завантаження…</span></div>
            <div id="dcGhSearchLive"></div>
          </div>
          <div class="dc-gh-search-tip" style="margin-top: 18px;">
            <kbd>↑↓</kbd> навігація · <kbd>↵</kbd> відкрити · <kbd>Esc</kbd> закрити
          </div>
        </div>
      `;
      document.body.appendChild(searchOverlay);

      const input = searchOverlay.querySelector('#dcGhSearchInput');
      const closeBtn = searchOverlay.querySelector('.dc-gh-search-close');
      closeBtn.addEventListener('click', closeSearch);
      input.addEventListener('input', () => doSearch(input.value));
      searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearch();
      });
      return searchOverlay;
    }

    function highlight(text, q) {
      if (!q || !text) return escapeHtml(text || '');
      const safe = escapeHtml(text);
      const ql = String(q).toLowerCase();
      const lower = safe.toLowerCase();
      const idx = lower.indexOf(ql);
      if (idx < 0) return safe;
      return safe.slice(0, idx) + '<mark>' + safe.slice(idx, idx + q.length) + '</mark>' + safe.slice(idx + q.length);
    }
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
    }

    function renderSystems(q) {
      const container = searchOverlay.querySelector('#dcGhSearchSystems');
      const ql = (q || '').toLowerCase().trim();
      const items = LINKS.filter(l => !ql || l.label.toLowerCase().includes(ql) || l.short.toLowerCase().includes(ql));
      container.innerHTML = items.map(l => `
        <a href="${l.url}" class="dc-gh-search-result">
          <span class="dc-gh-result-icon">${l.icon}</span>
          <div class="dc-gh-result-info">
            <div class="dc-gh-result-title">${highlight(l.label, q)}</div>
            <div class="dc-gh-result-meta">${l.url.replace(/^https?:\/\//, '')}</div>
          </div>
        </a>`).join('') || '<div class="dc-gh-search-empty">— нічого —</div>';
    }

    function renderLocal(q) {
      const section = searchOverlay.querySelector('#dcGhSearchLocalSection');
      const container = searchOverlay.querySelector('#dcGhSearchLocal');
      const cfg = window.DC_PAGE_NAV;
      if (!cfg || !cfg.pages || !cfg.pages.length || !q) {
        section.style.display = 'none';
        return;
      }
      const ql = q.toLowerCase().trim();
      const items = cfg.pages.filter(p => p.label.toLowerCase().includes(ql));
      if (!items.length) { section.style.display = 'none'; return; }
      section.style.display = 'block';
      container.innerHTML = items.map(p => `
        <a href="#${p.id}" data-page-id="${p.id}" class="dc-gh-search-result">
          <span class="dc-gh-result-icon">📄</span>
          <div class="dc-gh-result-info">
            <div class="dc-gh-result-title">${highlight(p.label, q)}</div>
            <div class="dc-gh-result-meta">Розділ · ${p.num || ''}</div>
          </div>
        </a>`).join('');
      // Перехоплюємо click щоб викликати onSelect
      container.querySelectorAll('a').forEach(a => a.addEventListener('click', (e) => {
        e.preventDefault();
        const id = a.dataset.pageId;
        closeSearch();
        if (typeof cfg.onSelect === 'function') cfg.onSelect(id);
        else window.location.hash = '#' + id;
      }));
    }

    function renderBrand(q) {
      const section = searchOverlay.querySelector('#dcGhSearchBrandSection');
      const container = searchOverlay.querySelector('#dcGhSearchBrand');
      if (!q || q.length < 2) { section.style.display = 'none'; return; }
      loadBrandIndex().then(idx => {
        if (!idx || !idx.sections) { section.style.display = 'none'; return; }
        const ql = q.toLowerCase().trim();
        const results = [];
        idx.sections.forEach(s => {
          const title = (s.title || s.page_title || '').toLowerCase();
          const text = (s.text || '').toLowerCase();
          const headings = (s.headings || []).join(' ').toLowerCase();
          if (title.includes(ql) || text.includes(ql) || headings.includes(ql)) {
            results.push(s);
          }
        });
        if (!results.length) { section.style.display = 'none'; return; }
        section.style.display = 'block';
        container.innerHTML = results.slice(0, 12).map(s => {
          const url = BRAND_BASE + '/sections/' + s.file + (s.hash ? '#' + s.hash : '');
          return `<a href="${url}" target="_blank" rel="noopener" class="dc-gh-search-result">
            <span class="dc-gh-result-icon">📘</span>
            <div class="dc-gh-result-info">
              <div class="dc-gh-result-title">${highlight(s.title || s.page_title, q)}</div>
              <div class="dc-gh-result-meta">${escapeHtml(s.page_title || s.file)}</div>
            </div>
          </a>`;
        }).join('');
      });
    }

    // ─── Live deep search (Edge Function `global-search`) ───
    // Шукає по publications / team_tasks / creatives / users / launches у Supabase.
    // Працює ТІЛЬКИ на team.dreamcar.ua (де є SUPABASE auth).
    let liveDebounce = null;
    let liveAbortController = null;
    const liveCache = new Map();

    const TASK_LABELS = { p1:'P1', p2:'P2', p3:'P3', p4:'P4' };
    const PUB_STATUS = {
      draft:'Чернетка', in_work:'В роботі', review:'На погодженні',
      approved:'Погоджено', rework:'Доопрацювання', published:'Опубліковано'
    };

    function renderLive(q) {
      const section = searchOverlay.querySelector('#dcGhSearchLiveSection');
      const container = searchOverlay.querySelector('#dcGhSearchLive');
      const loading = searchOverlay.querySelector('#dcGhSearchLiveLoading');
      if (!isTeam || !q || q.length < 2) {
        section.style.display = 'none';
        return;
      }
      // Cache
      if (liveCache.has(q)) {
        renderLiveData(liveCache.get(q), q, section, container, loading);
        return;
      }
      // Abort попередній запит
      if (liveAbortController) try { liveAbortController.abort(); } catch (_) {}
      if (liveDebounce) clearTimeout(liveDebounce);
      section.style.display = 'block';
      loading.style.display = 'inline';
      container.innerHTML = '';

      liveDebounce = setTimeout(async () => {
        liveAbortController = new AbortController();
        try {
          // Беремо ACCESS_TOKEN з window.supabase (HQ/Tasks) або localStorage
          let token = '';
          try {
            if (window.supabase?.auth) {
              const s = await window.supabase.auth.getSession();
              token = s?.data?.session?.access_token || '';
            }
          } catch (_) {}
          if (!token) {
            // Fallback: пошук Supabase session у localStorage
            try {
              const keys = Object.keys(localStorage).filter(k => k.includes('sb-') && k.includes('-auth-token'));
              if (keys.length) {
                const raw = JSON.parse(localStorage.getItem(keys[0]) || '{}');
                token = raw?.access_token || raw?.currentSession?.access_token || '';
              }
            } catch (_) {}
          }
          if (!token) {
            section.style.display = 'none';
            return;
          }

          const SB_URL = window.HQ_CONFIG?.SUPABASE_URL || 'https://wotghlaehnvxyeacznvv.supabase.co';
          const SB_KEY = window.HQ_CONFIG?.SUPABASE_ANON_KEY || '';
          const url = `${SB_URL}/functions/v1/global-search?q=${encodeURIComponent(q)}&limit=6`;
          const r = await fetch(url, {
            method: 'GET',
            signal: liveAbortController.signal,
            headers: {
              'Authorization': 'Bearer ' + token,
              'apikey': SB_KEY,
              'Content-Type': 'application/json',
            },
          });
          if (!r.ok) {
            container.innerHTML = '<div class="dc-gh-search-empty">— помилка пошуку —</div>';
            loading.style.display = 'none';
            return;
          }
          const data = await r.json();
          liveCache.set(q, data);
          renderLiveData(data, q, section, container, loading);
        } catch (e) {
          if (e.name === 'AbortError') return;
          container.innerHTML = '<div class="dc-gh-search-empty">— помилка —</div>';
          loading.style.display = 'none';
        }
      }, 250);
    }

    function renderLiveData(data, q, section, container, loading) {
      loading.style.display = 'none';
      const r = data?.results || {};
      const TEAM = TEAM_BASE;
      const items = [];

      (r.publications || []).forEach(p => {
        items.push({
          icon: '📝',
          title: p.title || '(без назви)',
          meta: 'Публікація · ' + (PUB_STATUS[p.status] || p.status || ''),
          url: `${TEAM}/hq/#publication/${p.id}`,
        });
      });
      (r.tasks || []).forEach(t => {
        const pri = TASK_LABELS[t.priority] || t.priority || '';
        items.push({
          icon: '✅',
          title: t.title || '(без назви)',
          meta: `Задача · ${pri ? pri + ' · ' : ''}${t.status || ''}`,
          url: `${TEAM}/tasks/#task/${t.id}`,
        });
      });
      (r.creatives || []).forEach(c => {
        items.push({
          icon: c.kind === 'video' ? '🎬' : '🖼',
          title: c.filename || '(без імені)',
          meta: `Креатив · ${c.kind || ''}${c.tags ? ' · ' + c.tags : ''}`,
          url: `${TEAM}/hq/#library`,
        });
      });
      (r.launches || []).forEach(l => {
        items.push({
          icon: '🚀',
          title: l.title || l.slug || '(без назви)',
          meta: `Запуск · ${l.status || ''}`,
          url: `${TEAM}/hq/#launches`,
        });
      });
      (r.users || []).forEach(u => {
        items.push({
          icon: '👤',
          title: u.name || u.email || '(без імені)',
          meta: `Користувач · ${u.role || ''}${u.email ? ' · ' + u.email : ''}`,
          url: `${TEAM}/orgchart.html`,
        });
      });

      if (!items.length) {
        section.style.display = 'none';
        return;
      }
      section.style.display = 'block';
      container.innerHTML = items.map(it => `
        <a href="${it.url}" class="dc-gh-search-result">
          <span class="dc-gh-result-icon">${it.icon}</span>
          <div class="dc-gh-result-info">
            <div class="dc-gh-result-title">${highlight(it.title, q)}</div>
            <div class="dc-gh-result-meta">${escapeHtml(it.meta)}</div>
          </div>
        </a>`).join('');
    }

    function doSearch(q) {
      renderSystems(q);
      renderLocal(q);
      renderBrand(q);
      renderLive(q);
    }

    function openSearch() {
      buildSearchOverlay();
      searchOverlay.classList.add('show');
      const input = searchOverlay.querySelector('#dcGhSearchInput');
      setTimeout(() => input.focus(), 50);
      doSearch('');  // initial render — show systems
    }
    function closeSearch() {
      if (searchOverlay) searchOverlay.classList.remove('show');
    }
    searchBtn.addEventListener('click', openSearch);
    // ⌘K / Ctrl+K shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('show')) closeSearch();
    });

    // Public API
    window.__dcOpenSearch = openSearch;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();
