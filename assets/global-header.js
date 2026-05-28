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
  const LOGO_SVG   = BRAND_BASE + '/assets/logo/dreamcar-racing-plate.svg';

  const host = window.location.hostname;
  const path = window.location.pathname;
  const isBrand = host.includes('brand.') || host.includes('dreamcarua.github.io/brand-book');
  const isTeam  = host.includes('team.')  || host.includes('dreamcarua.github.io/dreamcar-team');

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
      key: 'hq',
      label: 'HQ · SMM',
      short: 'HQ',
      icon: '🎯',
      url: TEAM_BASE + '/hq/',
      active: isTeam && path.startsWith('/hq'),
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
  ];

  // ---- CSS ----
  const css = `
    :root {
      --dc-header-h: 48px;
      --dc-header-h-mobile: 46px;
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
      height: 24px; width: auto; display: block;
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

    /* Mobile */
    .dc-gh-burger {
      display: none;
      background: transparent; border: 1px solid #2A2A2A;
      color: #fff; padding: 7px 10px; cursor: pointer;
      font-size: 16px; line-height: 1;
      border-radius: 3px;
    }
    .dc-gh-burger:hover { border-color: #E30613; }

    /* ── PAGE NAV DROPDOWN (опціонально, через window.DC_PAGE_NAV) ── */
    .dc-gh-pages {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(227,6,19,0.1);
      border: 1px solid #E30613;
      color: #fff;
      padding: 6px 10px; cursor: pointer;
      font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
      border-radius: 3px;
      font-family: 'JetBrains Mono', monospace;
      max-width: 200px;
      transition: background 120ms;
    }
    .dc-gh-pages:hover { background: rgba(227,6,19,0.18); }
    .dc-gh-pages .dc-gh-pages-label {
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      max-width: 150px;
    }
    .dc-gh-pages .dc-gh-pages-num {
      font-size: 9px; opacity: 0.65;
    }
    .dc-gh-pages .dc-gh-pages-chev {
      font-size: 9px; opacity: 0.85;
      transition: transform 180ms;
    }
    .dc-gh-pages[aria-expanded="true"] .dc-gh-pages-chev { transform: rotate(180deg); }

    /* Pages dropdown — under header, sticky-positioned */
    .dc-gh-pages-menu {
      position: fixed;
      top: var(--dc-header-h);
      right: 12px;
      background: #0A0A0A;
      border: 1px solid #2A2A2A;
      border-radius: 4px;
      min-width: 280px;
      max-width: 360px;
      max-height: calc(100vh - var(--dc-header-h) - 40px);
      overflow-y: auto;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      z-index: calc(var(--dc-z) - 1);
      opacity: 0; pointer-events: none;
      transform: translateY(-8px);
      transition: opacity 140ms, transform 140ms;
    }
    .dc-gh-pages-menu.show {
      opacity: 1; pointer-events: auto; transform: translateY(0);
    }
    .dc-gh-pages-menu a {
      display: flex; align-items: center; gap: 10px;
      padding: 11px 14px;
      color: #BBB; text-decoration: none;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      transition: background 100ms, color 100ms;
    }
    .dc-gh-pages-menu a:last-child { border-bottom: none; }
    .dc-gh-pages-menu a:hover { background: rgba(227,6,19,0.08); color: #fff; }
    .dc-gh-pages-menu a.active {
      background: rgba(227,6,19,0.15); color: #E30613; font-weight: 700;
    }
    .dc-gh-pages-menu a .num {
      font-size: 9px; opacity: 0.6; min-width: 22px;
      font-family: 'JetBrains Mono', monospace;
    }
    .dc-gh-pages-menu a.active .num { opacity: 1; }
    .dc-gh-pages-menu a .label { flex: 1; }

    @media (max-width: 920px) {
      .dc-gh-pages { font-size: 10px; padding: 6px 8px; max-width: 150px; }
      .dc-gh-pages .dc-gh-pages-label { max-width: 95px; }
      .dc-gh-pages-menu {
        top: var(--dc-header-h-mobile);
        right: 6px; left: 6px;
        max-width: none; min-width: 0;
        max-height: calc(100vh - var(--dc-header-h-mobile) - 20px);
      }
    }

    @media (max-width: 920px) {
      .dc-gh { padding: 0 12px; height: var(--dc-header-h-mobile); gap: 10px; }
      .dc-gh-logo img { height: 22px; }
      .dc-gh-nav { display: none; }
      .dc-gh-burger { display: inline-flex; }
    }

    /* Slide-down mobile panel */
    .dc-gh-panel {
      position: fixed;
      top: var(--dc-header-h-mobile);
      left: 0; right: 0;
      background: #0A0A0A;
      border-bottom: 1px solid #2A2A2A;
      transform: translateY(-110%);
      transition: transform 220ms cubic-bezier(0.2, 0.9, 0.3, 1);
      z-index: calc(var(--dc-z) - 1);
      padding: 12px;
      max-height: calc(100vh - var(--dc-header-h-mobile));
      overflow-y: auto;
    }
    .dc-gh-panel.show { transform: translateY(0); }
    .dc-gh-panel a {
      display: flex; align-items: center; gap: 12px;
      color: #DDD; text-decoration: none;
      padding: 14px 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px; letter-spacing: 0.1em;
      border: 1px solid #2A2A2A;
      margin-bottom: 6px;
      border-radius: 3px;
      transition: border-color 120ms, color 120ms;
    }
    .dc-gh-panel a:hover, .dc-gh-panel a.active {
      color: #fff; border-color: #E30613;
      background: rgba(227,6,19,0.08);
    }
    .dc-gh-panel a .icon { font-size: 18px; }

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
        <button class="dc-gh-pages" aria-label="Розділи сторінки" aria-expanded="false" style="display:none">
          <span class="dc-gh-pages-num"></span>
          <span class="dc-gh-pages-label">Розділ</span>
          <span class="dc-gh-pages-chev">▼</span>
        </button>
        <button class="dc-gh-burger" aria-label="Меню" aria-expanded="false">≡</button>
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
    burger.addEventListener('click', () => {
      const open = panel.classList.toggle('show');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.textContent = open ? '×' : '≡';
    });

    // Close panel after link click
    panel.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        panel.classList.remove('show');
        burger.textContent = '≡';
        burger.setAttribute('aria-expanded', 'false');
      })
    );

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('show')) return;
      if (panel.contains(e.target) || header.contains(e.target)) return;
      panel.classList.remove('show');
      burger.textContent = '≡';
      burger.setAttribute('aria-expanded', 'false');
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('show')) {
        panel.classList.remove('show');
        burger.textContent = '≡';
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    // ─────────────────────────────────────────────
    // PAGE NAV DROPDOWN — рендеримо тільки якщо window.DC_PAGE_NAV встановлений
    // ─────────────────────────────────────────────
    const pageBtn = header.querySelector('.dc-gh-pages');
    let pagesMenu = null;

    function renderPageNav() {
      const cfg = window.DC_PAGE_NAV;
      if (!cfg || !cfg.pages || !cfg.pages.length) {
        pageBtn.style.display = 'none';
        return;
      }
      pageBtn.style.display = 'inline-flex';
      const current = cfg.pages.find(p => p.id === cfg.current) || cfg.pages[0];
      const numEl = pageBtn.querySelector('.dc-gh-pages-num');
      const labelEl = pageBtn.querySelector('.dc-gh-pages-label');
      numEl.textContent = current.num || '';
      labelEl.textContent = current.label || '';

      // (re)build dropdown menu
      if (pagesMenu) pagesMenu.remove();
      pagesMenu = document.createElement('div');
      pagesMenu.className = 'dc-gh-pages-menu';
      pagesMenu.setAttribute('role', 'menu');
      pagesMenu.innerHTML = cfg.pages.map(p => {
        const isActive = p.id === cfg.current ? ' active' : '';
        return `<a href="#${p.id}" data-page-id="${p.id}" class="${isActive}"><span class="num">${p.num||''}</span><span class="label">${p.label}</span></a>`;
      }).join('');
      document.body.appendChild(pagesMenu);

      // Click on items
      pagesMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', (e) => {
        e.preventDefault();
        const id = a.dataset.pageId;
        closePagesMenu();
        if (typeof cfg.onSelect === 'function') cfg.onSelect(id);
        else window.location.hash = '#' + id;
        cfg.current = id;
        renderPageNav();
      }));
    }
    function openPagesMenu() {
      if (!pagesMenu) return;
      pagesMenu.classList.add('show');
      pageBtn.setAttribute('aria-expanded', 'true');
    }
    function closePagesMenu() {
      if (!pagesMenu) return;
      pagesMenu.classList.remove('show');
      pageBtn.setAttribute('aria-expanded', 'false');
    }
    pageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (pagesMenu && pagesMenu.classList.contains('show')) closePagesMenu();
      else openPagesMenu();
    });
    document.addEventListener('click', (e) => {
      if (!pagesMenu || !pagesMenu.classList.contains('show')) return;
      if (pagesMenu.contains(e.target) || pageBtn.contains(e.target)) return;
      closePagesMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pagesMenu && pagesMenu.classList.contains('show')) closePagesMenu();
    });

    // Public API для сторінок: оновити поточний вибір
    window.__dcUpdatePageNav = function(id) {
      if (!window.DC_PAGE_NAV) return;
      window.DC_PAGE_NAV.current = id;
      renderPageNav();
    };

    renderPageNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();
