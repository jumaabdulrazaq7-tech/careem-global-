(function () {
  var WA = '971581242603';
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
  /* save submission to the CAREEM admin app (Supabase). Fire-and-forget so WhatsApp still opens instantly. */
  function saveLead(payload) {
    var c = window.CAREEM_CONFIG || {};
    if (!c.supabaseUrl || !c.supabaseKey) return;
    var h = { 'apikey': c.supabaseKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' };
    if (/^eyJ/.test(c.supabaseKey)) h.Authorization = 'Bearer ' + c.supabaseKey;
    payload.lang = lang();
    payload.source_page = location.pathname.split('/').pop() || 'index.html';
    try {
      fetch(c.supabaseUrl.replace(/\/$/, '') + '/rest/v1/leads', { method: 'POST', keepalive: true, headers: h, body: JSON.stringify(payload) })
        .catch(function () {});
    } catch (e) {}
  }
  function isBot(form) { var hp = form.querySelector('input[name="website"]'); return hp && hp.value; }
  function thanks(form) {
    var n = form.querySelector('.thanks');
    if (!n) { n = document.createElement('div'); n.className = 'thanks'; n.setAttribute('role', 'status'); form.appendChild(n); }
    n.innerHTML = lang() === 'en'
      ? '<b>Thank you!</b> Your request has been received. Please press <b>Send</b> in WhatsApp — our team will contact you soon.'
      : '<b>Asante!</b> Ombi lako limepokelewa. Tafadhali bonyeza <b>Send</b> ndani ya WhatsApp — timu yetu itawasiliana nawe hivi karibuni.';
    n.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function optText(sel) { return sel && sel.value ? sel.options[sel.selectedIndex].textContent.replace(/^\S+\s(?=\S)/, function (m) { return /[A-Za-z]/.test(m) ? m : ''; }).trim() : ''; }

  function vis(node) { var s = node.querySelector('.' + lang()); return (s || node).textContent.replace(/\s+/g, ' ').trim(); }

  /* simple contact form */
  var inq = $('#inquiry');
  if (inq) inq.addEventListener('submit', function (e) {
    e.preventDefault();
    var g = function (id) { return document.getElementById(id).value.trim(); };
    var s = $('#service'), c = $('#country');
    if (!g('fullname') || !g('phone') || !s.value || !g('message')) { inq.reportValidity(); return; }
    if (!isBot(inq)) saveLead({
      type: s.value === 'employer' ? 'employer' : 'contact',
      full_name: g('fullname'), phone: g('phone'), country: optText(c),
      service: s.options[s.selectedIndex].textContent, message: g('message'),
      data: { form: 'contact', service_key: s.value }
    });
    var L = lang() === 'en' ? ['Hello CAREEM,', 'Name', 'Phone', 'Country', 'Service', 'Message'] : ['Habari CAREEM,', 'Jina', 'Simu', 'Nchi', 'Huduma', 'Ujumbe'];
    openWA(L[0] + '\n' + L[1] + ': ' + g('fullname') + '\n' + L[2] + ': ' + g('phone') + '\n' + L[3] + ': ' + c.options[c.selectedIndex].textContent.replace(/^\S+\s/, '') +
      '\n' + L[4] + ': ' + s.options[s.selectedIndex].textContent + '\n' + L[5] + ': ' + g('message'));
    thanks(inq);
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

      var l = lang(), out = ['*' + form.getAttribute('data-title-' + l) + '*', ''], sections = [];
      $$('fieldset', form).forEach(function (fs) {
        var lines = [], fields = [];
        $$('.q', fs).forEach(function (q) {
          if (q.hasAttribute('data-skip')) return;
          var label = vis(q.querySelector('.qlabel')).replace(/\s*\*$/, ''), v = '';
          var checks = $$('input[type=checkbox],input[type=radio]', q);
          if (checks.length) v = checks.filter(function (c) { return c.checked; }).map(function (c) { return vis(c.closest('label')); }).join(', ');
          else {
            var el = $('input,select,textarea', q);
            v = el.tagName === 'SELECT' ? (el.value ? el.options[el.selectedIndex].textContent : '') : el.value.trim();
          }
          if (v) { lines.push('• ' + label + ': ' + v); fields.push({ key: (q.querySelector('[id]') || q.querySelector('input') || {}).id || (q.querySelector('input') || {}).name || '', label: label, value: v }); }
        });
        if (lines.length) { out.push('_' + vis(fs.querySelector('legend')) + '_', lines.join('\n'), ''); sections.push({ title: vis(fs.querySelector('legend')), fields: fields }); }
      });
      var t = form.getAttribute('data-type'), m = t === 'trip'
        ? { n: 't_name', p: 't_phone', e: 't_email', c: 't_country' } : { n: 'r_name', p: 'r_phone', e: 'r_email', c: 'r_nat' };
      var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      if (t && !isBot(form)) saveLead({
        type: t, full_name: val(m.n), phone: val(m.p), email: val(m.e) || null,
        country: optText(document.getElementById(m.c)) || null, data: { form: t, sections: sections }
      });
      openWA(out.join('\n').trim());
      thanks(form);
    });
  });
})();
