// =====================================================================
// DreamCar — legal-safe lexicon, one source for every checker on the site
// Canon: sections/legal.html (11B). Replacements follow the 11B table;
// білет / джекпот / казино / халява come from AGENTS.md and brand_lint.py.
// Matching is Unicode-aware: JS \b does not see Cyrillic letters, so every
// pattern uses (?<![\p{L}\p{N}]) … (?![\p{L}\p{N}]) boundaries.
// Used by: sections/tools.html (Voice Linter), sections/legal.html,
// sections/generator.html. Keep in sync with scripts/brand_lint.py NEVER_ROOTS.
// =====================================================================
(function () {
  'use strict';
  var B = '(?<![\\p{L}\\p{N}])', E = '(?![\\p{L}\\p{N}])';
  // level: never = не вживати ніколи; careful = попередження, заміни в маркетингу
  var RULES = [
    { level: 'never', re: 'розіг\\p{L}*',                       word: 'розіграш',   replace: 'промоакція', why: 'Маркер лотерейної діяльності' },
    { level: 'never', re: 'лотере\\p{L}*|лотерейк\\p{L}*',      word: 'лотерея',    replace: 'промо / акція', why: 'Юридичний термін, потребує ліцензії' },
    { level: 'never', re: 'вигра\\p{L}*|виграв\\p{L}*',         word: 'виграти',    replace: 'отримати / стати власником', why: '«Виграти» — лотерейна семантика' },
    { level: 'never', re: 'перемож(?:е|и)?ц\\p{L}*|переможниц\\p{L}*', word: 'переможець', replace: 'власник', why: 'Перемога — азартний контекст' },
    { level: 'never', re: 'шанс\\p{L}*',                        word: 'шанс',       replace: 'можливість', why: '«Шанс виграти» — лотерейний текст' },
    { level: 'never', re: 'квит(?:ок|ка|ки|ків|ку|ком|ках|кам|очок)', word: 'квиток', replace: 'токен ШІ-сервісу / номер участі', why: 'Квиток — ставка' },
    { level: 'never', re: 'білет\\p{L}*',                       word: 'білет',      replace: 'токен ШІ-сервісу', why: 'Те саме, що квиток' },
    { level: 'never', re: 'джекпот\\p{L}*',                     word: 'джекпот',    replace: 'не вживати', why: 'Азартна гра' },
    { level: 'never', re: 'казино',                             word: 'казино',     replace: 'не вживати', why: 'Азартна гра' },
    { level: 'never', re: 'азарт\\p{L}*',                       word: 'азарт',      replace: 'мрія / рішучість / передчуття', why: 'Gambling-маркер' },
    { level: 'never', re: 'ставк(?:а|и|у|ою|ам|ами|ах)',        word: 'ставка',     replace: 'внесок / доступ', why: 'Ставка — азарт' },
    { level: 'never', re: 'фарт\\p{L}*',                        word: 'фарт',       replace: 'крок', why: 'DreamCar — про дію, не випадок' },
    { level: 'never', re: 'удач(?:а|і|у|ею|ливий|лива)',        word: 'удача',      replace: 'дія', why: 'DreamCar — про дію, не випадок' },
    { level: 'never', re: 'халяв\\p{L}*',                       word: 'халява',     replace: 'без оплати (з поясненням умов)', why: 'Знецінює продукт' },
    { level: 'never', re: 'draw|raffle|lottery|lotto|jackpot|casino|gambl\\p{L}*|winners?|winning', word: 'draw / winner (EN)', replace: 'promotion / owner', why: 'Англійські відповідники заборонених слів' },
    { level: 'careful', re: 'гр(?:а|и|у|ою|ати|аємо|ає|али|ай)', word: 'гра', replace: 'участь / промоакція', why: 'Азартний контекст; перевір значення' },
    { level: 'careful', re: 'приз(?:у|и|ів|ом|ами|ове|овий|ова)?', word: 'приз', replace: 'авто проєкту / подарунок', why: 'Призова рамка тягне лотерейну' },
    { level: 'careful', re: 'ticket\\p{L}*|win|bet', word: 'ticket / win (EN)', replace: 'token / get', why: 'Англійські відповідники' }
  ];
  var COMPILED = RULES.map(function (r) {
    return Object.assign({}, r, { rx: new RegExp(B + '(?:' + r.re + ')' + E, 'giu') });
  });

  function scan(text) {
    var out = [];
    COMPILED.forEach(function (r) {
      r.rx.lastIndex = 0;
      var m;
      while ((m = r.rx.exec(text))) {
        out.push({ level: r.level, match: m[0], index: m.index, word: r.word, replace: r.replace, why: r.why });
        if (m.index === r.rx.lastIndex) r.rx.lastIndex++;
      }
    });
    return out.sort(function (a, b) { return a.index - b.index; });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  // Returns escaped HTML with <mark> around every hit
  function highlight(text) {
    var hits = scan(text), html = '', pos = 0;
    hits.forEach(function (h) {
      if (h.index < pos) return;
      html += escapeHtml(text.slice(pos, h.index)) + '<mark class="lx-' + h.level + '">' + escapeHtml(h.match) + '</mark>';
      pos = h.index + h.match.length;
    });
    return html + escapeHtml(text.slice(pos));
  }

  window.DC_LEXICON = { rules: RULES, scan: scan, highlight: highlight, escapeHtml: escapeHtml };
})();
