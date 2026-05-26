// =====================================================================
// DreamCar Brand Book — Universal Sidebar Injector v4
// =====================================================================
// + Універсальний sidebar для всіх 29 сторінок (рендериться на льоту).
// + Авто-реєструє Service Worker.
// + Авто-додає canonical URL + Open Graph meta для SEO/соцмереж.
// + Пошук по aliases — знаходить email, шрифти, кольори, AI, voice тощо.
// =====================================================================

(function() {
  'use strict';

  const ORIGIN = 'https://brand.dreamcar.ua';

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

  // ---- 3. Auto-inject SEO meta (canonical, OG basics, humans link) ----
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

  // ---- 4. Sidebar data + ALIASES для пошуку ----
  const SECTIONS = {
    'На старт': [
      { num: '00', name: 'Quick Start',         file: 'quickstart.html',         aliases: 'старт швидко швидкий шпаргалка cheatsheet' },
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
      { num: '13', name: 'Кризові комунікації', file: 'crisis.html',             aliases: 'crisis криза кризи pr скандал блокування sla скрипти scripts реакція платіжна data breach фейк акаунт' },
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
  };

  function renderSidebar() {
    const sb = document.querySelector('aside.sidebar') || document.getElementById('sb');
    if (!sb) return;

    const groups = Object.entries(SECTIONS).map(([title, items]) => {
      const navItems = items.map(s => {
        const isActive = s.file.toLowerCase() === filename;
        const cls = isActive ? ' class="active"' : '';
        const aliases = s.aliases || '';
        return `<a href="${prefix}${s.file}"${cls} data-aliases="${aliases}"><span class="num">${s.num}</span>${s.name}</a>`;
      }).join('');
      return `<div class="group"><span class="group-title">${title}</span><nav>${navItems}</nav></div>`;
    }).join('');

    sb.innerHTML = `
<a href="${upPrefix}index.html" class="brand-mark">DREAM<span class="red">CAR</span></a>
<span class="brand-tag">BRAND BOOK · v3.9.1</span>
<div class="sidebar-search"><input type="text" id="sb-search" placeholder="Шукати: email, шрифти, AI…" aria-label="Пошук по розділах і змісту"></div>
${groups}
<div class="group pdf-group"><span class="group-title">Експорт</span><nav><a href="${upPrefix}print.html">Завантажити повний PDF</a></nav></div>
<div class="foot">vg@dreamcar.ua<br><a href="https://dreamcar.ua">dreamcar.ua</a></div>
    `;

    // Mobile menu link click closes sidebar
    sb.querySelectorAll('nav a').forEach(a => {
      a.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    });

    // Search bind — шукає по name + num + aliases
    const inp = document.getElementById('sb-search');
    if (inp) {
      const links = sb.querySelectorAll('nav a');
      const allGroups = sb.querySelectorAll('.group');
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'sidebar-search-empty';
      emptyMsg.textContent = 'Нічого не знайдено';
      inp.closest('.sidebar-search').after(emptyMsg);

      function normalize(s) { return s.toLowerCase().replace(/[\s‐\-―·_/]+/g, ''); }

      inp.addEventListener('input', () => {
        const q = normalize(inp.value.trim());
        let anyVisible = false;
        links.forEach(a => {
          const t = normalize(a.textContent);
          const numEl = a.querySelector('.num');
          const numTxt = numEl ? normalize(numEl.textContent) : '';
          const aliasesAttr = a.getAttribute('data-aliases') || '';
          const aliasesNorm = normalize(aliasesAttr);
          const matches = !q || t.includes(q) || numTxt.includes(q) || aliasesNorm.includes(q);
          a.classList.toggle('is-hidden', !matches);
          if (matches) anyVisible = true;
        });
        allGroups.forEach(g => {
          const visibleLinks = g.querySelectorAll('nav a:not(.is-hidden)');
          g.classList.toggle('is-empty', visibleLinks.length === 0);
        });
        emptyMsg.classList.toggle('show', !anyVisible && !!q);
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
  }

  // Backdrop click closes mobile sidebar
  document.body.addEventListener('click', (e) => {
    if (e.target === document.body && document.body.classList.contains('sidebar-open')) {
      document.body.classList.remove('sidebar-open');
    }
  });

  // ---- 5. Run ----
  injectMetaIfMissing();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSidebar);
  } else {
    renderSidebar();
  }
})();
