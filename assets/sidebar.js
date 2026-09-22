// =====================================================================
// DreamCar Brand Book — Universal Sidebar Injector v9 (22.09.2026)
// v9: a11y (skip link, labelled navs, drawer focus/aria), robust search
//     (full index, stop-words, stems, keyboard), prev/next from SECTIONS,
//     copy buttons, one VERSION constant.
// =====================================================================
// v8: sidebar — текстовий бренд-знак (Racing Plate тільки у global-header).
//     Уникає дублювання двох лого поряд.
// =====================================================================

(function() {
  'use strict';

  const ORIGIN = 'https://brand.dreamcar.ua';
  const VERSION = 'v4.3';
  window.DC_BRANDBOOK_VERSION = VERSION;
  const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TEAM_ORIGIN = 'https://team.dreamcar.ua';

  // ---- 0. Auto-load global-header.js ----
  // Bump version querystring при кожній зміні global-header.js → CDN/SW беруть свіжу.
  const GH_VERSION = '20260707-1';
  if (!document.querySelector('script[src*="global-header.js"]')) {
    const gh = document.createElement('script');
    const onProd = location.hostname === 'brand.dreamcar.ua';
    const ghBase = onProd ? ORIGIN + '/' : (location.pathname.includes('/sections/') ? '../' : '');
    gh.src = ghBase + 'assets/global-header.js?v=' + GH_VERSION;
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
      { num: '27', name: 'Brand Tools',          file: 'tools.html',              aliases: 'tools інструменти voice linter лінтер contrast checker контраст color picker tokens ai prompt download ассет ассети wcag aa aaa' },
      { num: '28', name: 'Post Generator',       file: 'generator.html',          aliases: 'generator генератор post пост ig instagram tg telegram email імейл хештеги hashtags export svg png' },
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
      { num: '11B', name: 'Legal-safe лексикон', file: 'legal.html',              aliases: 'legal legal-safe юридичний лексикон заборонені слова словник замін краіл krail штраф ризик комплаєнс gambling лотерея розіграш шанс квиток linter' },
      { num: '12', name: 'Контент',             file: 'content.html',            aliases: 'content рубрики контент-план хештеги hashtags faq сторітелінг storytelling переможці winners trust' },
      { num: '13', name: 'Кризові комунікації', file: 'crisis.html',             aliases: 'crisis criza кризи pr скандал блокування sla скрипти scripts реакція платіжна data breach фейк акаунт' },
      { num: '23', name: 'Examples Library',    file: 'examples.html',           aliases: 'examples приклади кейси good bad cases ig email mockup' },
      { num: '30', name: 'Локалізація',         file: 'localization.html',       aliases: 'localization локалізація переклад translation english polski čeština en pl cz мови експансія' },
    ],
    'Партнери і довіра': [
      { num: '14', name: 'Партнери',            file: 'partners.html',           aliases: 'partners партнери блогери агенції бриф brief co-branding workflow approval погодження' },
      { num: '15', name: 'Довіра і доступність', file: 'trust.html',             aliases: 'trust довіра прозорість документи wcag accessibility доступність a11y aria gdpr privacy дані' },
    ],
    'Техніка': [
      { num: '16', name: 'Дизайн-ресурси',      file: 'tokens.html',             aliases: 'design tokens токени дизайн-токени json css змінні variables figma export пакет ассети assets' },
      { num: '17', name: 'Стиль медіа',         file: 'audio.html',              aliases: 'audio аудіо звук sonic logo jingle music музика photo фото lighting освітлення color grading lut' },
      { num: '24', name: 'Photography Brief',   file: 'photography-brief.html',  aliases: 'photo фото фотограф photographer brief бриф shot list зйомка sony canon nikon raw release form' },
      { num: '29', name: 'Відео',               file: 'video.html',              aliases: 'video відео reels tiktok stories shorts ефір титри субтитри lower third монтаж переходи експорт кодек ratio 9:16' },
    ],
    'Точки контакту': [
      { num: '18', name: 'Точки контакту',      file: 'touchpoints.html',        aliases: 'email імейл імейли розсилка mailing customer journey awareness consideration purchase delivery loyalty esputnik yespo mailchimp sendgrid newsletter шаблони шаблон letter лист' },
      { num: '19', name: 'Мерч',                file: 'merch.html',              aliases: 'merch мерч пакет власника коробка футболка hoodie худі кепка наклейки stickers упаковка packaging брелок сертифікат' },
    ],
    'Підсумки': [
      { num: '20', name: 'Метрики · Roadmap',   file: 'metrics.html',            aliases: 'metrics метрики kpi roadmap nps awareness sov share of voice sentiment retention repeat пирамида' },
      { num: '21', name: 'Регламент підтримки', file: 'support.html',            aliases: 'support підтримка клієнт client sla scripts скрипти 4К stop протокол повернення refund tone' },
      { num: '22', name: 'AI-контент',          file: 'ai-content.html',         aliases: 'ai штучний інтелект ШІ claude chatgpt gpt midjourney sora elevenlabs deepfake prompt system prompt eu act copyright' },
    ],
    'Внутрішнє · Team Hub': [
      { name: 'Tasks (Kanban)',                  url: TEAM_ORIGIN + '/tasks/',      external: true, aliases: 'tasks завдання задачі kanban канбан to-do todo task manager' },
      { name: 'HQ · Стіл SMM',                   url: TEAM_ORIGIN + '/hq/',         external: true, aliases: 'hq calendar approvals library smm стіл календар погодження бібліотека' },
      { name: 'Onboarding',                      url: TEAM_ORIGIN + '/onboarding.html', external: true, aliases: 'onboarding онбординг новачки team' },
      { name: 'INFO',                            url: TEAM_ORIGIN + '/info.html',       external: true, aliases: 'info orgchart структура команда команди roles ролі raci новини регламенти audience' },
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

  const STOP = new Set(['на','у','в','і','й','та','для','з','із','зі','по','як','що','до','від','це','а','або','чи','the','a','of','to','and','for','on','in']);
  function queryTerms(q) {
    return q.toLowerCase().split(/[\s,.;:!?«»"()]+/).filter(t => t.length >= 2 && !STOP.has(t))
      .map(t => (t.length >= 6 && /[а-яіїєґ]$/.test(t)) ? t.replace(/(ами|ями|ові|еві|ого|ому|ій|ий|ої|ою|ею|ів|ям|ам|ах|ях|ти|ть|і|и|а|я|у|ю|е|о)$/, '') : t);
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
      const textMatches = Math.min((text.match(re) || []).length, 12);
      score += titleMatches * 20 + headingMatches * 5 + textMatches * 1;
      if (titleMatches + headingMatches + textMatches > 0) hitTerms++;
    });
    if (!hitTerms) return 0;
    // All terms present ranks far above partial matches; partial still shown.
    return hitTerms === terms.length ? score * 3 : score * (hitTerms / terms.length);
  }

  function runContentSearch(query) {
    return loadSearchIndex().then(idx => {
      if (!idx || !idx.sections) return [];
      const terms = queryTerms(query);
      if (!terms.length) return [];
      const results = [];
      idx.sections.forEach(s => {
        const score = scoreSection(s, terms);
        if (score > 0) results.push({ section: s, score, primary: terms[0] });
      });
      results.sort((a, b) => b.score - a.score);
      return results.slice(0, 10);
    }).catch(() => []);
  }

  function renderResults(container, results, query) {
    const terms = queryTerms(query);
    if (!results.length) {
      container.innerHTML = '';
      return;
    }
    const rows = results.map(({ section: s, primary }) => {
      const snippet = buildSnippet(s.text, primary, 160);
      const safe = escapeHtml(snippet);
      const lit = highlight(safe, terms);
      let href = `${prefix}${s.file}?q=${encodeURIComponent(query)}`;
      try {
        const fragRaw = Array.from(buildSnippet(s.text, primary, 60).replace(/^…|…$/g, '').trim()).slice(0, 60).join('');
        if (fragRaw) href += `#:~:text=${encodeURIComponent(fragRaw)}`;
      } catch (_) {}
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
          return `<a href="${s.url}" target="_blank" rel="noopener" data-aliases="${aliases}"><span class="num" aria-hidden="true">↗</span>${s.name}<span class="sr-only"> (нова вкладка)</span></a>`;
        }
        const isActive = s.file && s.file.toLowerCase() === filename;
        const cls = isActive ? ' class="active" aria-current="page"' : '';
        const aliases = s.aliases || '';
        return `<a href="${prefix}${s.file}"${cls} data-aliases="${aliases}"><span class="num">${s.num}</span>${s.name}</a>`;
      }).join('');
      return `<div class="group"><span class="group-title" aria-hidden="true">${title}</span><nav aria-label="${escapeHtml(title)}">${navItems}</nav></div>`;
    }).join('');

    const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    sb.setAttribute('aria-label', 'Розділи брендбуку');
    sb.innerHTML = `
<button type="button" class="sb-close" aria-label="Закрити меню">✕</button>
<a href="${upPrefix}index.html" class="brand-mark" aria-label="DreamCar Brand Book — на головну">DREAM<span class="red">CAR</span></a>
<span class="brand-tag">BRAND BOOK · ${VERSION}</span>
<div class="sidebar-search"><input type="search" id="sb-search" placeholder="${touch ? 'Пошук по брендбуку' : 'Пошук по брендбуку…  ( / )'}" aria-label="Пошук по брендбуку" autocomplete="off" enterkeyhint="search"></div>
<div class="sidebar-search-results" id="sb-results" aria-live="polite"></div>
${groups}
<div class="group pdf-group"><span class="group-title" aria-hidden="true">Друк</span><nav aria-label="Друк"><a href="${upPrefix}print.html">Уся книга однією сторінкою (друк / PDF)</a></nav></div>
<div class="foot"><a href="mailto:vg@dreamcar.ua">vg@dreamcar.ua</a><br><a href="https://dreamcar.ua">dreamcar.ua</a></div>
    `;
    sb.querySelector('.sb-close').addEventListener('click', closeDrawer);

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

    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const first = resultsEl.querySelector('a.sb-res') || sb.querySelector('nav a:not(.is-hidden)');
        if (first && inp.value.trim()) { e.preventDefault(); first.click(); }
      } else if (e.key === 'ArrowDown') {
        const first = resultsEl.querySelector('a.sb-res') || sb.querySelector('nav a:not(.is-hidden)');
        if (first) { e.preventDefault(); first.focus(); }
      }
    });
    resultsEl.addEventListener('keydown', e => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const items = Array.from(resultsEl.querySelectorAll('a.sb-res'));
      const i = items.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      if (e.key === 'ArrowDown' && items[i + 1]) items[i + 1].focus();
      if (e.key === 'ArrowUp') (items[i - 1] || inp).focus();
    });

    document.addEventListener('keydown', e => {
      const ae = document.activeElement;
      const typing = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.tagName === 'SELECT' || ae.isContentEditable);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        openDrawer();
        inp.focus();
      }
      if (e.key === 'Escape' && ae === inp) {
        if (inp.value) { inp.value = ''; inp.dispatchEvent(new Event('input')); }
        else closeDrawer(true);
      }
    });
  }

  // ---- 6. Підсвітка ?q=… на сторінці-призначенні ----
  function highlightQueryOnPage() {
    try {
      const url = new URL(window.location.href);
      const q = url.searchParams.get('q');
      if (!q || q.length < 2) return;
      const terms = queryTerms(q).filter(t => t.length >= 3);
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
          firstMark.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
        }, 80);
      }
    } catch (_) {}
  }

  // ---- Drawer (mobile) ----
  function toggleEl() { return document.querySelector('.menu-toggle'); }
  function syncToggle() {
    const t = toggleEl();
    if (!t) return;
    t.setAttribute('aria-controls', 'sb');
    t.setAttribute('aria-expanded', document.body.classList.contains('sidebar-open') ? 'true' : 'false');
  }
  function openDrawer() { document.body.classList.add('sidebar-open'); syncToggle(); }
  function closeDrawer(returnFocus) {
    const wasOpen = document.body.classList.contains('sidebar-open');
    document.body.classList.remove('sidebar-open');
    syncToggle();
    if (returnFocus && wasOpen && window.matchMedia('(max-width: 900px)').matches) { const t = toggleEl(); if (t) t.focus(); }
  }
  new MutationObserver(syncToggle).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  document.body.addEventListener('click', (e) => {
    if (e.target === document.body && document.body.classList.contains('sidebar-open')) closeDrawer(true);
  });

  // ---- Keyboard: Cmd/Ctrl+K → global search overlay if present, else sidebar search; Esc closes drawer ----
  document.addEventListener('keydown', (e) => {
    const ae = document.activeElement;
    const typing = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      if (window.__dcOpenSearch) return; // global header owns ⌘K
      const inp = document.getElementById('sb-search');
      if (inp) { e.preventDefault(); openDrawer(); inp.focus(); inp.select(); }
    } else if (e.key === 'Escape' && !typing && document.body.classList.contains('sidebar-open')) {
      closeDrawer(true);
    }
  });

  // ---- Skip link ----
  function addSkipLink() {
    const main = document.getElementById('main') || document.querySelector('main');
    if (!main || document.querySelector('.skip-link')) return;
    if (!main.id) main.id = 'main';
    main.setAttribute('tabindex', '-1');
    const a = document.createElement('a');
    a.className = 'skip-link'; a.href = '#' + main.id; a.textContent = 'До змісту';
    document.body.insertBefore(a, document.body.firstChild);
    // global-header.js prepends its bar later; keep the skip link the very first stop
    const keepFirst = () => { if (document.body.firstChild !== a) document.body.insertBefore(a, document.body.firstChild); };
    new MutationObserver(keepFirst).observe(document.body, { childList: true });
  }

  // ---- Prev / next from the one ordered list ----
  function renderPageNav() {
    const order = Object.values(SECTIONS).flat().filter(x => x.file);
    const i = order.findIndex(x => x.file.toLowerCase() === filename);
    const nav = document.querySelector('.section-page-nav');
    if (i < 0 || !nav) return;
    nav.setAttribute('aria-label', 'Попередній і наступний розділ');
    const prev = order[i - 1], next = order[i + 1];
    const link = (x, cls, label) => `<a href="${x.file}" class="${cls}"><span class="nav-label">${label}</span><span class="nav-title">${x.name}</span></a>`;
    nav.innerHTML = (prev ? link(prev, 'prev', `← ${prev.num} ПОПЕРЕДНІЙ`) : `<a href="../index.html" class="prev"><span class="nav-label">↑ ЗМІСТ</span><span class="nav-title">Brand Book</span></a>`)
      + (next ? link(next, 'next', `${next.num} НАСТУПНИЙ →`) : `<a href="../index.html" class="next"><span class="nav-label">↑ ЗМІСТ</span><span class="nav-title">Brand Book</span></a>`);
  }

  // ---- Copy buttons: colour HEX, token blocks, [data-copy] ----
  let statusEl = null;
  function announce(msg) {
    if (!statusEl) { statusEl = document.createElement('div'); statusEl.className = 'sr-only'; statusEl.setAttribute('aria-live', 'polite'); document.body.appendChild(statusEl); }
    statusEl.textContent = msg;
  }
  function copyText(text, btn) {
    const done = ok => {
      if (!btn) return;
      btn.dataset.state = ok ? 'ok' : 'err';
      const lbl = btn.querySelector('.cb-label');
      if (lbl) { lbl.dataset.orig = lbl.dataset.orig || lbl.textContent; lbl.textContent = ok ? 'Скопійовано' : 'Не вдалося'; }
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { delete btn.dataset.state; if (lbl) lbl.textContent = lbl.dataset.orig; }, 1500);
      announce(ok ? 'Скопійовано: ' + text.slice(0, 80) : 'Не вдалося скопіювати');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done(true), () => done(false));
    else done(false);
  }
  function makeCopyBtn(getText, label) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'copy-btn';
    b.innerHTML = '<span class="cb-label">' + (label || 'Копіювати') + '</span>';
    b.addEventListener('click', e => { e.stopPropagation(); copyText(getText(), b); });
    return b;
  }
  function addCopyButtons() {
    document.querySelectorAll('main .color-cell .codes').forEach(c => {
      const m = c.textContent.match(/#[0-9A-F]{6}\b/i);
      if (!m || c.parentNode.querySelector('.copy-btn')) return;
      c.after(makeCopyBtn(() => m[0].toUpperCase(), 'Копіювати ' + m[0].toUpperCase()));
    });
    document.querySelectorAll('main .tokens-code').forEach(block => {
      if (block.previousElementSibling && block.previousElementSibling.classList.contains('copy-row')) return;
      const row = document.createElement('div'); row.className = 'copy-row';
      row.appendChild(makeCopyBtn(() => block.innerText, 'Копіювати код'));
      block.before(row);
    });
    document.querySelectorAll('main [data-copy]').forEach(el => {
      if (el.querySelector(':scope > .copy-btn')) return;
      const txt = el.getAttribute('data-copy') || el.innerText;
      el.appendChild(makeCopyBtn(() => el.getAttribute('data-copy') || txt));
    });
  }

  // ---- Prefetch сусідніх розділів (prev/next) — миттєва навігація ----
  function prefetchNeighbors() {
    try {
      document.querySelectorAll('.section-page-nav a[href]').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (!href || href.startsWith('http')) return;
        const l = document.createElement('link');
        l.rel = 'prefetch'; l.href = a.href;
        document.head.appendChild(l);
      });
    } catch (_) {}
  }
  injectMetaIfMissing();

  function prefillSearch() {
    try {
      const q = new URL(location.href).searchParams.get('search');
      const inp = document.getElementById('sb-search');
      if (q && inp) { inp.value = q; inp.dispatchEvent(new Event('input')); openDrawer(); inp.focus(); }
    } catch (_) {}
  }

  function init() {
    addSkipLink();
    renderSidebar();
    prefillSearch();
    renderPageNav();
    addCopyButtons();
    syncToggle();
    highlightQueryOnPage();
    prefetchNeighbors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
