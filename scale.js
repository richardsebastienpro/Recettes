// Recalcule les quantités d'ingrédients selon le nombre de personnes choisi.
(function () {
  function formatFraction(v) {
    var whole = Math.floor(v + 1e-6);
    var frac = v - whole;
    var fracStr = '';
    if (Math.abs(frac - 0.25) < 0.05) fracStr = '1/4';
    else if (Math.abs(frac - 1 / 3) < 0.05) fracStr = '1/3';
    else if (Math.abs(frac - 0.5) < 0.05) fracStr = '1/2';
    else if (Math.abs(frac - 2 / 3) < 0.05) fracStr = '2/3';
    else if (Math.abs(frac - 0.75) < 0.05) fracStr = '3/4';

    if (whole === 0 && fracStr) return fracStr;
    if (whole > 0 && fracStr) return whole + ' ' + fracStr;
    if (whole === 0 && !fracStr) return (Math.round(v * 4) / 4).toString().replace('.', ',');
    return String(whole);
  }

  function formatNumber(v, step) {
    if (step) {
      v = Math.round(v / step) * step;
    } else {
      v = Math.round(v * 10) / 10;
    }
    v = Math.round(v * 100) / 100;
    var s = v.toString().replace('.', ',');
    return s;
  }

  function render(basePeople, currentPeople) {
    var ratio = currentPeople / basePeople;
    var spans = document.querySelectorAll('.qty[data-qty]');
    spans.forEach(function (span) {
      var fmt = span.getAttribute('data-fmt');
      if (fmt === 'fixed') return;
      var base = parseFloat(span.getAttribute('data-qty'));
      var unit = span.getAttribute('data-unit') || '';
      var value = base * ratio;
      var out;
      if (fmt === 'int') {
        out = Math.max(1, Math.round(value)).toString();
      } else if (fmt === 'frac') {
        out = formatFraction(Math.max(0.25, value));
      } else {
        var step = span.getAttribute('data-round');
        out = formatNumber(value, step ? parseFloat(step) : null);
      }
      span.textContent = unit ? out + ' ' + unit : out;
      if (currentPeople !== basePeople) {
        span.classList.add('is-scaled');
      } else {
        span.classList.remove('is-scaled');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var box = document.querySelector('.people-box');
    if (!box) return;
    var basePeople = parseInt(box.getAttribute('data-base-people'), 10);
    var current = basePeople;
    var valueEl = box.querySelector('.people-value');
    var decBtn = box.querySelector('[data-action="dec"]');
    var incBtn = box.querySelector('[data-action="inc"]');

    function update() {
      valueEl.textContent = current;
      render(basePeople, current);
    }

    decBtn.addEventListener('click', function () {
      if (current > 1) {
        current -= 1;
        update();
      }
    });
    incBtn.addEventListener('click', function () {
      if (current < 24) {
        current += 1;
        update();
      }
    });
  });
})();
