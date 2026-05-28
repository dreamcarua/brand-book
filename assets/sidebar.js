// =====================================================================
// DreamCar Brand Book — Universal Sidebar Injector v8
// =====================================================================
// v8: sidebar — текстовий бренд-знак (Racing Plate тільки у global-header).
//     Уникає дублювання двох лого поряд.
// =====================================================================

(function() {
  'use strict';

  const ORIGIN = 'https://brand.dreamcar.ua';
  const TEAM_ORIGIN = 'https://team.dreamcar.ua';

  // ---- 0. Auto-load global-header.js ----
  // Bump version querystring при кожній зміні global-header.js → CDN/SW беруть свіжу.
  const GH_VERSION = '20260528-5';
  if (!document.querySelector('script[src*="global-header.js"]')) {
    const gh = document.createElement('script');
    gh.src = ORIGIN + '/assets/global-header.js?v=' + GH_VERSION;
    gh.defer = true;
    document.head.appendChild(gh);
  }

  // ---- 1. Service Worker auto-register ----
  if ('serviceWorker' in navigator) {
    const swPath = window.location.pathname.includes('/sections/')
      ? '../service-worker.js'
      : 'service-worker.js';
    navigator.serviceWorker.register(swPath).catch(() => {});
  }

  // ---- 2. Detect context ----
  const path = window.location.pathname;
  const isSection = path.includes('/sections/');
  const prefix = isSection ? '' : 'sections/';
  const upPrefix = isSection ? '../' : '';
  const filename = (path.split('/').pop() || 'index.html').toLowerCase();

  // ---- 3. Auto-inject SEO meta ----
  function injectMetaIfMissing() {
    const head = document.head;
    if (!head) return;
    const has = (selector) => !!head.querySelector(selector);
    const add = (tag, attrs) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      head.appendChild(el);
    };
    const fullUrl = ORIGIN + path;
    const pageTitle = (document.title || 'DreamCar Brand Book').trim();
    const pageDesc = (head.querySelector('meta[name="description"]')?.getAttribute('content')) || 'DreamCar Brand Book — операційна система бренду.';

    if (!has('link[rel="canonical"]')) add('link', { rel: 'canonical', href: fullUrl });
    if (!has('meta[property="og:type"]')) add('meta', { property: 'og:type', content: 'article' });
    if (!has('meta[property="og:site_name"]')) add('meta', { property: 'og:site_name', content: 'DreamCar Brand Book' });
    if (!has('meta[property="og:url"]')) add('meta', { property: 'og:url', content: fullUrl });
    if (!has('meta[property="og:title"]')) add('meta', { property: 'og:title', content: pageTitle });
    if (!has('meta[property="og:description"]')) add('meta', { property: 'og:description', content: pageDesc });
    if (!has('meta[property="og:image"]')) add('meta', { property: 'og:image', content: ORIGIN + '/og-image.png' });
    if (!has('meta[property="og:locale"]')) add('meta', { property: 'og:locale', content: 'uk_UA' });
    if (!has('meta[name="twitter:card"]')) add('meta', { name: 'twitter:card', content: 'summary_large_image' });
    if (!has('meta[name="twitter:title"]')) add('meta', { name: 'twitter:title', content: pageTitle });
    if (!has('meta[name="twitter:description"]')) add('meta', { name: 'twitter:description', content: pageDesc });
    if (!has('meta[name="twitter:image"]')) add('meta', { name: 'twitter:image', content: ORIGIN + '/og-image.png' });
    if (!has('meta[name="apple-mobile-web-app-capable"]')) add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
    if (!has('meta[name="apple-mobile-web-app-status-bar-style"]')) add('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' });
    if (!has('meta[name="mobile-web-app-capable"]')) add('meta', { name: 'mobile-web-app-capable', content: 'yes' });
    if (!has('link[rel="manifest"]')) add('link', { rel: 'manifest', href: upPrefix + 'manifest.webmanifest' });
    if (!has('link[rel="author"]')) add('link', { rel: 'author', href: ORIGIN + '/humans.txt', type: 'text/plain' });
  }

  // ---- 4. Sidebar data + ALIASES + EXTERNAL ----
  const SECTIONS = {
    'На старт': [
      { num: '00', name: 'Quick Start',         file: 'quickstart.html',         aliases: 'старт швидко шпаргалка cheatsheet' },
      { num: '26', name: 'Onboarding 10хв',     file: 'onboarding.html',         aliases: 'onboarding введення нові працівники підрядники агенції training brand 10 хв слайди презентація' },
      { num: '27', name: '🛠 Brand Tools',       file: 'tools.html',              aliases: 'tools інструменти voice linter лінтер contrast checker контраст color picker tokens ai prompt download ассет ассети wcag aa aaa' },
      { num: '28', name: '🚀 Post Generator',   file: 'generator.html',          aliases: 'generator генератор post пост ig instagram tg telegram email імейл хештеги hashtags export svg png' },
    ],
    'Стратегія': [
      { num: '01', name: 'Маніфест',            file: 'manifesto.html',          aliases: 'manifesto душа бренду цінності філософія' },
      { num: '02', name: 'Стратегія',           file: 'strategy.html',           aliases: 'strategy місія mission vision бачення архетип архетипи утп usp tagline гасло челенджер пірамід' },
      { num: '03', name: 'Аудиторія',           file: 'personas.html',           aliases: 'personas audience портрети сегменти Іван Микола Ольга Дмитро опитування survey демографія психографія тригери' },
      { num: '04', name: 'Контекст ринку',      file: 'compete.html',            aliases: 'compete конкуренти ринок market лотерея блогер позиціонування differentiation' },
    ],
    'Візуальна система': [
      { num: '05', name: 'Логотип',             file: 'logo.html',               aliases: 'logo логотип лого racing plate avatar circle dc monogram бренд-знак svg png завантажити download' },
      { num: '06', name: 'Кольори',             file: 'colors.html',             aliases: 'colors кольори palette палітра hex rgb cmyk red червоний black чорний white білий e30613 0a0a0a контраст wcag' },
      { num: '07', name: 'Типографіка',         file: 'typo.html',               aliases: 'fonts шрифти typography типографіка oswald archivo black manrope jetbrains mono bebas display heading body розміри scale' },
      { num: '08', name: 'Сітка та елементи',   file: 'spacing.html',            aliases: 'spacing сітка grid 12 колонок radius breakpoints іконки icons lucide патерни patterns 4px база' },
    ],
    'Інтерфейс': [
      { num: '09', name: 'UI-компоненти',       file: 'components.html',         aliases: 'ui компоненти buttons кнопки cta forms форми inputs поля select empty states 404 500' },
      { num: '10', name: 'Анімації',            file: 'motion.html',             aliases: 'motion анімації animation transitions переходи easing duration тривалість reduced-motion' },
      { num: '25', name: 'Mobile-First',        file: 'mobile.html',             aliases: 'mobile мобільний telefon ios android iphone breakpoints touch targets thumb zones safe area pwa offline' },
    ],
    'Голос і контент': [
      { num: '11', name: 'Голос і мова',        file: 'voice.html',              aliases: 'voice голос tone тон ти ви vy ty do dont never careful словник мова канали ig tg tt email звертання' },
      { num: '12', name: 'Контент',             file: 'content.html',            aliases: 'content рубрики контент-план хештеги hashtags faq сторітелінг storytelling переможці winners trust' },
      { num: '13', name: 'Кризові комунікації', file: 'crisis.html',             aliases: 'crisis criza кризи pr скандал блокування sla скрипти scripts реакція платіжна data breach фейк акаунт' },
      { num: '23', name: 'Examples Library',    file: 'examples.html',           aliases: 'examples приклади кейси good bad cases ig email mockup' },
    ],
    'Партнери і довіра': [
      { num: '14', name: 'Партнери',            file: 'partners.html',           aliases: 'partners партнери блогери агенції бриф brief co-branding workflow approval погодження' },
      { num: '15', name: 'Довіра і доступність', file: 'trust.html',             aliases: 'trust довіра прозорість документи wcag accessibility доступність a11y aria gdpr privacy дані' },
    ],
    'Техніка': [
      { num: '16', name: 'Дизайн-ресурси',      file: 'tokens.html',             aliases: 'design tokens токени дизайн-токени json css змінні variables figma export пакет ассети assets' },
      { num: '17', name: 'Стиль медіа',         file: 'audio.html',              aliases: 'audio аудіо звук sonic logo jingle music музика photo фото lighting освітлення color grading lut' },
      { num: '24', name: 'Photography Brief',   file: 'photography-brief.html',  aliases: 'photo фото фотограф photographer brief бриф shot list зйомка sony canon nikon raw release form' },
    ],
    'Точки контакту': [
      { num: '18', name: 'Точки контакту',      file: 'touchpoints.html',        aliases: 'email імейл імейли розсилка mailing customer journey awareness consideration purchase delivery loyalty esputnik yespo mailchimp sendgrid newsletter шаблони шаблон letter лист' },
      { num: '19', name: 'Мерч',                file: 'merch.html',              aliases: 'merch мерч пакет переможця коробка футболка hoodie худі кепка наклейки stickers упаковка packaging брелок сертифікат' },
    ],
    'Підсумки': [
      { num: '20', name: 'Метрики · Roadmap',   file: 'metrics.html',            aliases: 'metrics метрики kpi roadmap nps awareness sov share of voice sentiment retention repeat пирамида' },
      { num: '21', name: 'Регламент підтримки', file: 'support.html',            aliases: 'support підтримка клієнт client sla scripts скрипти 4К stop протокол повернення refund tone' },
      { num: '22', name: 'AI-контент',          file: 'ai-content.html',         aliases: 'ai штучний інтелект ШІ claude chatgpt gpt midjourney sora elevenlabs deepfake prompt system prompt eu act copyright' },
    ],
    '🔒 Team Hub': [
      { name: 'Tasks (Kanban)',                  url: TEAM_ORIGIN + '/tasks/',      external: true, aliases: 'tasks завдання задачі kanban канбан to-do todo task manager' },
      { name: 'HQ · Стіл SMM',                   url: TEAM_ORIGIN + '/hq/',         external: true, aliases: 'hq calendar approvals library smm стіл календар погодження бібліотека' },
      { name: 'Onboarding',                      url: TEAM_ORIGIN + '/onboarding.html', external: true, aliases: 'onboarding онбординг новачки team' },
      { name: 'Orgchart',                        url: TEAM_ORIGIN + '/orgchart.html',   external: true, aliases: 'orgchart структура команда команди roles ролі raci' },
      { name: 'Survey 2026',                     url: TEAM_ORIGIN + '/survey.html',     external: true, aliases: 'survey опитування дашборд analytics 1302' },
      { name: 'Team Hub →',                      url: TEAM_ORIGIN + '/',                external: true, aliases: 'team hub home всі ресурси' },
    ],
  };

  // ---- 5. Утиліти для повнотекстового пошуку ----
  let _indexCache = null;
  let _indexPromise = null;
  function loadSearchIndex() {
    if (_indexCache) return Promise.resolve(_indexCache);
    if (_indexPromise) return _indexPromise;
    const url = upPrefix + 'assets/search-index.json';
    _indexPromise = fetch(url, { cache: 'force-cache' })
      .then(r => r.ok ? r.json() : null)
      .then(json => { _indexCache = json; return json; })
      .catch(() => null);
    return _indexPromise;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function highlight(html, terms) {
    let out = html;
    terms.forEach(t => {
      if (!t || t.length < 2) return;
      try {
        const re = new RegExp('(' + escapeRe(t) + ')', 'gi');
        out = out.replace(re, '<mark>$1</mark>');
      } catch (_) {}
    });
    return out;
  }

  function buildSnippet(text, term, len) {
    if (!text) return '';
    len = len || 160;
    const low = text.toLowerCase();
    let idx = low.indexOf(term.toLowerCase());
    if (idx < 0) idx = 0;
    const start = Math.max(0, idx - 50);
    const end = Math.min(text.length, start + len);
    let s = text.slice(start, end).trim();
    if (start > 0) s = '…' + s;
    if (end < text.length) s = s + '…';
    return s;
  }

  function scoreSection(section, terms) {
    const title = (section.title + ' ' + (section.page_title || '')).toLowerCase();
    const headings = (section.headings || []).join(' ').toLowerCase();
    const text = (section.text || '').toLowerCase();
    let score = 0;
    let hitTerms = 0;
    terms.forEach(t => {
      if (!t) return;
      const re = new RegExp(escapeRe(t), 'g');
      const titleMatches = (title.match(re) || []).length;
      const headingMatches = (headings.match(re) || []).length;
      const textMatches = (text.match(re) || []).length;
      score += titleMatches * 20 + headingMatches * 5 + textMatches * 1;
      if (titleMatches + headingMatches + textMatches > 0) hitTerms++;
    });
    if (hitTerms < terms.length) return 0;
    return score;
  }

  function runContentSearch(query) {
    return loadSearchIndex().then(idx => {
      if (!idx || !idx.sections) return [];
      const terms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
      if (!terms.length) return [];
      const results = [];
      idx.sections.forEach(s => {
        const score = scoreSection(s, terms);
        if (score > 0) results.push({ section: s, score, primary: terms[0] });
      });
      results.sort((a, b) => b.score - a.score);
      return results.slice(0, 10);
    });
  }

  function renderResults(container, results, query) {
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
    if (!results.length) {
      container.innerHTML = '';
      return;
    }
    const rows = results.map(({ section: s, primary }) => {
      const snippet = buildSnippet(s.text, primary, 160);
      const safe = escapeHtml(snippet);
      const lit = highlight(safe, terms);
      const fragRaw = buildSnippet(s.text, primary, 60).replace(/^…|…$/g, '').trim();
      const frag = encodeURIComponent(fragRaw.slice(0, 60));
      const href = `${prefix}${s.file}?q=${encodeURIComponent(query)}#:~:text=${frag}`;
      return `<a class="sb-res" href="${href}">
        <span class="sb-res-title">${escapeHtml(s.title)}</span>
        <span class="sb-res-snip">${lit}</span>
      </a>`;
    }).join('');
    container.innerHTML = `<div class="sb-res-head">Знайдено у тексті · ${results.length}</div>${rows}`;
  }

  function renderSidebar() {
    const sb = document.querySelector('aside.sidebar') || document.getElementById('sb');
    if (!sb) return;

    const groups = Object.entries(SECTIONS).map(([title, items]) => {
      const navItems = items.map(s => {
        if (s.external && s.url) {
          const aliases = s.aliases || '';
          return `<a href="${s.url}" target="_blank" rel="noopener" data-aliases="${aliases}"><span class="num" style="color:#888;">↗</span>${s.name}</a>`;
        }
        const isActive = s.file && s.file.toLowerCase() === filename;
        const cls = isActive ? ' class="active"' : '';
        const aliases = s.aliases || '';
        return `<a href="${prefix}${s.file}"${cls} data-aliases="${aliases}"><span class="num">${s.num}</span>${s.name}</a>`;
      }).join('');
      return `<div class="group"><span class="group-title">${title}</span><nav>${navItems}</nav></div>`;
    }).join('');

    sb.innerHTML = `
<a href="${upPrefix}index.html" class="brand-mark">DREAM<span class="red">CAR</span></a>
<span class="brand-tag">BRAND BOOK · v3.9.2</span>
<div class="sidebar-search"><input type="text" id="sb-search" placeholder="Шукати по всьому брендбуку…" aria-label="Повнотекстовий пошук" autocomplete="off"></div>
<div class="sidebar-search-results" id="sb-results" aria-live="polite"></div>
${groups}
<div class="group pdf-group"><span class="group-title">Експорт</span><nav><a href="${upPrefix}print.html">Завантажити повний PDF</a></nav></div>
<div class="foot">vg@dreamcar.ua<br><a href="https://dreamcar.ua">dreamcar.ua</a></div>
    `;

    sb.querySelectorAll('nav a').forEach(a => {
      a.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    });

    const inp = document.getElementById('sb-search');
    const resultsEl = document.getElementById('sb-results');
    if (!inp || !resultsEl) return;

    const links = sb.querySelectorAll('nav a');
    const allGroups = sb.querySelectorAll('.group');
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'sidebar-search-empty';
    emptyMsg.textContent = 'Нічого не знайдено';
    inp.closest('.sidebar-search').after(emptyMsg);

    function normalize(s) { return s.toLowerCase().replace(/[\s‐\-―·_/]+/g, ''); }

    let contentTimer = null;

    function applyStaticFilter(q) {
      const qn = normalize(q);
      let anyVisible = false;
      links.forEach(a => {
        const t = normalize(a.textContent);
        const numEl = a.querySelector('.num');
        const numTxt = numEl ? normalize(numEl.textContent) : '';
        const aliasesAttr = a.getAttribute('data-aliases') || '';
        const aliasesNorm = normalize(aliasesAttr);
        const matches = !qn || t.includes(qn) || numTxt.includes(qn) || aliasesNorm.includes(qn);
        a.classList.toggle('is-hidden', !matches);
        if (matches) anyVisible = true;
      });
      allGroups.forEach(g => {
        const visibleLinks = g.querySelectorAll('nav a:not(.is-hidden)');
        g.classList.toggle('is-empty', visibleLinks.length === 0);
      });
      return anyVisible;
    }

    inp.addEventListener('input', () => {
      const q = inp.value.trim();
      const anyStaticVisible = applyStaticFilter(q);

      clearTimeout(contentTimer);
      if (q.length < 2) {
        resultsEl.innerHTML = '';
        emptyMsg.classList.toggle('show', false);
        return;
      }
      resultsEl.innerHTML = '<div class="sb-res-head sb-res-loading">Шукаю…</div>';
      contentTimer = setTimeout(() => {
        runContentSearch(q).then(results => {
          if (inp.value.trim() !== q) return;
          renderResults(resultsEl, results, q);
          const anyContent = results.length > 0;
          emptyMsg.classList.toggle('show', !anyStaticVisible && !anyContent);
        });
      }, 120);
    });

    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inp.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inp) {
        inp.value = '';
        inp.dispatchEvent(new Event('input'));
        inp.blur();
      }
    });
  }

  // ---- 6. Підсвітка ?q=… на сторінці-призначенні ----
  function highlightQueryOnPage() {
    try {
      const url = new URL(window.location.href);
      const q = url.searchParams.get('q');
      if (!q || q.length < 2) return;
      const terms = q.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
      if (!terms.length) return;
      const root = document.querySelector('main') || document.body;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: node => {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const p = node.parentNode;
          if (!p) return NodeFilter.FILTER_REJECT;
          const tag = p.nodeName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'MARK') return NodeFilter.FILTER_REJECT;
          if (p.closest && p.closest('.sidebar')) return NodeFilter.FILTER_REJECT;
          const low = node.nodeValue.toLowerCase();
          for (const t of terms) { if (low.includes(t)) return NodeFilter.FILTER_ACCEPT; }
          return NodeFilter.FILTER_REJECT;
        }
      });
      const matches = [];
      let n;
      while ((n = walker.nextNode())) matches.push(n);
      let firstMark = null;
      matches.forEach(node => {
        const parent = node.parentNode;
        if (!parent) return;
        let html = escapeHtml(node.nodeValue);
        terms.forEach(t => {
          const re = new RegExp('(' + escapeRe(t) + ')', 'gi');
          html = html.replace(re, '<mark class="q-hit">$1</mark>');
        });
        const span = document.createElement('span');
        span.innerHTML = html;
        parent.replaceChild(span, node);
        if (!firstMark) firstMark = span.querySelector('mark.q-hit');
      });
      if (firstMark) {
        setTimeout(() => {
          firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);
      }
    } catch (_) {}
  }

  document.body.addEventListener('click', (e) => {
    if (e.target === document.body && document.body.classList.contains('sidebar-open')) {
      document.body.classList.remove('sidebar-open');
    }
  });

  injectMetaIfMissing();

  function init() {
    renderSidebar();
    highlightQueryOnPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
