(function () {
  var WA = '255773490719';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* mobile menu */
  var menu = $('.menu'), nav = $('#nav');
  if (menu) menu.addEventListener('click', function () { var o = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(o)); });
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* image fallback */
  $$('.card .ph img').forEach(function (img) {
    function fb() { img.style.display = 'none'; img.parentNode.style.background = 'linear-gradient(135deg,#c9973f,#e30613)'; }
    img.addEventListener('error', fb);
    if (img.complete && img.naturalWidth === 0 && img.loading !== 'lazy') fb();
  });

  /* language */
  var PH = { sw: { fullname: 'Jina lako', phone: '+255 7xx xxx xxx', message: 'Andika ujumbe wako hapa...' },
             en: { fullname: 'Your name', phone: '+255 7xx xxx xxx', message: 'Write your message here...' } };
  var HELLO = { sw: 'Habari CAREEM, naomba maelezo zaidi.', en: 'Hello CAREEM, I would like to make an inquiry.' };
  function lang() { return document.body.classList.contains('en') ? 'en' : 'sw'; }
  function setLang(l) {
    document.body.classList.toggle('en', l === 'en'); document.documentElement.lang = l;
    $$('.lang button').forEach(function (b) { b.classList.toggle('on', b.dataset.lang === l); });
    $$('option[data-' + l + ']').forEach(function (o) { o.textContent = o.getAttribute('data-' + l); });
    $$('[data-ph-' + l + ']').forEach(function (i) { i.placeholder = i.getAttribute('data-ph-' + l); });
    Object.keys(PH[l]).forEach(function (id) { var el = document.getElementById(id); if (el) el.placeholder = PH[l][id]; });
    var c = $('#cta-wa'); if (c) c.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(HELLO[l]);
    try { localStorage.setItem('careem-lang', l); } catch (e) {}
  }
  var saved = 'sw'; try { saved = localStorage.getItem('careem-lang') || 'sw'; } catch (e) {}
  setLang(saved === 'en' ? 'en' : 'sw');
  $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });

  /* prefill from URL (?service=..., ?tour=...) */
  var qs = new URLSearchParams(location.search);
  var svc = $('#service'); if (svc && qs.get('service')) svc.value = qs.get('service');
  if (qs.get('tour')) $$('input[name="t_tours"]').forEach(function (c) { if (c.value === qs.get('tour')) c.checked = true; });

  function openWA(text) {
    var a = document.createElement('a');
    a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
    a.target = '_blank'; a.rel = 'noopener noreferrer';
    document.body.appendChild(a); a.click(); a.remove();
  }
  function vis(node) { var s = node.querySelector('.' + lang()); return (s || node).textContent.replace(/\s+/g, ' ').trim(); }

  /* simple contact form */
  var inq = $('#inquiry');
  if (inq) inq.addEventListener('submit', function (e) {
    e.preventDefault();
    var g = function (id) { return document.getElementById(id).value.trim(); };
    var s = $('#service'), c = $('#country');
    if (!g('fullname') || !g('phone') || !s.value || !g('message')) { inq.reportValidity(); return; }
    var L = lang() === 'en' ? ['Hello CAREEM,', 'Name', 'Phone', 'Country', 'Service', 'Message'] : ['Habari CAREEM,', 'Jina', 'Simu', 'Nchi', 'Huduma', 'Ujumbe'];
    openWA(L[0] + '\n' + L[1] + ': ' + g('fullname') + '\n' + L[2] + ': ' + g('phone') + '\n' + L[3] + ': ' + c.options[c.selectedIndex].textContent.replace(/^\S+\s/, '') +
      '\n' + L[4] + ': ' + s.options[s.selectedIndex].textContent + '\n' + L[5] + ': ' + g('message'));
  });

  /* big WhatsApp forms (job registration, trip planner) */
  $$('form.wa-form').forEach(function (form) {
    $$('input,select,textarea', form).forEach(function (el) {
      el.addEventListener('change', function () { var q = el.closest('.q'); if (q) q.classList.remove('bad'); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      $$('.q[data-req-group]', form).forEach(function (q) {
        var ok = $$('input:checked', q).length > 0; q.classList.toggle('bad', !ok); if (!ok && !firstBad) firstBad = q;
      });
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (firstBad) { firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

      var l = lang(), out = ['*' + form.getAttribute('data-title-' + l) + '*', ''];
      $$('fieldset', form).forEach(function (fs) {
        var lines = [];
        $$('.q', fs).forEach(function (q) {
          if (q.hasAttribute('data-skip')) return;
          var label = vis(q.querySelector('.qlabel')).replace(/\s*\*$/, ''), v = '';
          var checks = $$('input[type=checkbox],input[type=radio]', q);
          if (checks.length) v = checks.filter(function (c) { return c.checked; }).map(function (c) { return vis(c.closest('label')); }).join(', ');
          else {
            var el = $('input,select,textarea', q);
            v = el.tagName === 'SELECT' ? (el.value ? el.options[el.selectedIndex].textContent : '') : el.value.trim();
          }
          if (v) lines.push('• ' + label + ': ' + v);
        });
        if (lines.length) out.push('_' + vis(fs.querySelector('legend')) + '_', lines.join('\n'), '');
      });
      openWA(out.join('\n').trim());
    });
  });
})();
