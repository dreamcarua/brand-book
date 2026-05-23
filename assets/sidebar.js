// =====================================================================
// DreamCar Brand Book — Universal Sidebar Injector
// =====================================================================
// Один файл правди для sidebar всіх сторінок. Якщо треба додати розділ —
// редагуй ЦЕЙ файл, а не 29 окремих HTML.
//
// Як використовувати у HTML:
//   <aside class="sidebar" id="sb"></aside>
//   <script src="../assets/sidebar.js" defer></script>
//
// На index.html — без префікса "../":
//   <aside class="sidebar" id="sb"></aside>
//   <script src="assets/sidebar.js" defer></script>
// =====================================================================

(function() {
  'use strict';

  // Detect context: index.html vs sections/*.html
  const path = window.location.pathname;
  const isSection = path.includes('/sections/');
  const prefix = isSection ? '' : 'sections/';
  const upPrefix = isSection ? '../' : '';
  const filename = (path.split('/').pop() || 'index.html').toLowerCase();

  const SECTIONS = {
    'На старт': [
      { num: '00', name: 'Quick Start',         file: 'quickstart.html' },
      { num: '26', name: 'Onboarding 10хв',     file: 'onboarding.html' },
      { num: '27', name: '🛠 Brand Tools',       file: 'tools.html' },
      { num: '28', name: '🚀 Post Generator',   file: 'generator.html' },
    ],
    'Стратегія': [
      { num: '01', name: 'Маніфест',            file: 'manifesto.html' },
      { num: '02', name: 'Стратегія',           file: 'strategy.html' },
      { num: '03', name: 'Аудиторія',           file: 'personas.html' },
      { num: '04', name: 'Контекст ринку',      file: 'compete.html' },
    ],
    'Візуальна система': [
      { num: '05', name: 'Логотип',             file: 'logo.html' },
      { num: '06', name: 'Кольори',             file: 'colors.html' },
      { num: '07', name: 'Типографіка',         file: 'typo.html' },
      { num: '08', name: 'Сітка та елементи',   file: 'spacing.html' },
    ],
    'Інтерфейс': [
      { num: '09', name: 'UI-компоненти',       file: 'components.html' },
      { num: '10', name: 'Анімації',            file: 'motion.html' },
      { num: '25', name: 'Mobile-First',        file: 'mobile.html' },
    ],
    'Голос і контент': [
      { num: '11', name: 'Голос і мова',        file: 'voice.html' },
      { num: '12', name: 'Контент',             file: 'content.html' },
      { num: '13', name: 'Кризові комунікації', file: 'crisis.html' },
      { num: '23', name: 'Examples Library',    file: 'examples.html' },
    ],
    'Партнери і довіра': [
      { num: '14', name: 'Партнери',            file: 'partners.html' },
      { num: '15', name: 'Довіра і доступність', file: 'trust.html' },
    ],
    'Техніка': [
      { num: '16', name: 'Дизайн-ресурси',      file: 'tokens.html' },
      { num: '17', name: 'Стиль медіа',         file: 'audio.html' },
      { num: '24', name: 'Photography Brief',   file: 'photography-brief.html' },
    ],
    'Точки контакту': [
      { num: '18', name: 'Точки контакту',      file: 'touchpoints.html' },
      { num: '19', name: 'Мерч',                file: 'merch.html' },
    ],
    'Підсумки': [
      { num: '20', name: 'Метрики · Roadmap',   file: 'metrics.html' },
      { num: '21', name: 'Регламент підтримки', file: 'support.html' },
      { num: '22', name: 'AI-контент',          file: 'ai-content.html' },
    ],
  };

  function renderSidebar() {
    const sb = document.querySelector('aside.sidebar') || document.getElementById('sb');
    if (!sb) return;

    // Skip render if sidebar is already populated (inline fallback)
    if (sb.children.length > 5 && !sb.dataset.injected) {
      // Old inline sidebar still present — clear it and re-render
      // (handles case when user upgrades pages)
    }
    if (sb.dataset.injected === '1') return;
    sb.dataset.injected = '1';

    const groups = Object.entries(SECTIONS).map(([title, items]) => {
      const navItems = items.map(s => {
        const isActive = s.file.toLowerCase() === filename;
        const cls = isActive ? ' class="active"' : '';
        return `<a href="${prefix}${s.file}"${cls}><span class="num">${s.num}</span>${s.name}</a>`;
      }).join('');
      return `<div class="group"><span class="group-title">${title}</span><nav>${navItems}</nav></div>`;
    }).join('');

    sb.innerHTML = `
<a href="${upPrefix}index.html" class="brand-mark">DREAM<span class="red">CAR</span></a>
<span class="brand-tag">BRAND BOOK · v3.9</span>
<div class="sidebar-search"><input type="text" id="sb-search" placeholder="Шукати розділ…" aria-label="Пошук по розділах"></div>
${groups}
<div class="group pdf-group"><span class="group-title">Експорт</span><nav><a href="${upPrefix}print.html">Завантажити повний PDF</a></nav></div>
<div class="foot">vg@dreamcar.ua<br><a href="https://dreamcar.ua">dreamcar.ua</a></div>
    `;

    // Re-bind close-on-click for mobile
    sb.querySelectorAll('nav a').forEach(a => {
      a.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    });

    // Re-bind search
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
          const matches = !q || t.includes(q) || numTxt.includes(q);
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

  // Close sidebar on backdrop click
  document.body.addEventListener('click', (e) => {
    if (e.target === document.body && document.body.classList.contains('sidebar-open')) {
      document.body.classList.remove('sidebar-open');
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSidebar);
  } else {
    renderSidebar();
  }
})();
