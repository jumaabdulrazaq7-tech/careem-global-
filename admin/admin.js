/* CAREEM Admin — leads management (Supabase). Vanilla JS, hash routing. */
(function () {
  'use strict';
  var CFG = window.CAREEM_CONFIG || {};
  var app = document.getElementById('app');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- i18n ---------------- */
  var L = {
    sw: {
      dashboard: 'Dashibodi', leads: 'Maombi yote', jobs: 'Ajira', trips: 'Safari', employers: 'Waajiri', contacts: 'Mawasiliano',
      staff: 'Wafanyakazi', account: 'Akaunti yangu', manage: 'Usimamizi', signout: 'Toka', search: 'Tafuta jina, simu au CG-…',
      login: 'Ingia', login_sub: 'Ingia kusimamia maombi ya wateja.', email: 'Email', password: 'Nenosiri', name: 'Jina kamili',
      no_account: 'Huna akaunti? Omba hapa', have_account: 'Una akaunti? Ingia', forgot: 'Umesahau nenosiri?',
      signup: 'Omba akaunti', signup_sub: 'Baada ya kujisajili, admin atakuidhinisha.', send_reset: 'Tuma link ya kubadilisha',
      reset_sub: 'Weka email yako, tutakutumia link.', new_password: 'Nenosiri jipya', save_password: 'Hifadhi nenosiri',
      art_h: 'Simamia ajira na safari za UAE sehemu moja', art_p: 'Kila fomu inayojazwa kwenye website inaingia hapa papo hapo.',
      art_1: 'Maombi ya kazi, safari na waajiri', art_2: 'Fuatilia hali ya kila mteja', art_3: 'Gawa kazi kwa wafanyakazi', art_4: 'Notes, historia na export ya CSV',
      pending_h: 'Akaunti inasubiri idhini', pending_p: 'Admin wa CAREEM akikuidhinisha, utaweza kuona maombi. Jaribu tena baadaye.', refresh: 'Angalia tena',
      setup_h: 'App haijaunganishwa', setup_p: 'Weka supabaseUrl na supabaseKey kwenye assets/config.js.',
      total: 'Maombi yote', new_: 'Mapya', this_week: 'Wiki hii', completed: 'Yamekamilika', last14: 'Maombi siku 14 zilizopita',
      by_type: 'Kwa aina', by_status: 'Kwa hali', recent: 'Maombi ya karibuni', see_all: 'Ona yote', my_open: 'Yangu yanayoendelea',
      st_new: 'Jipya', st_contacted: 'Amewasiliana', st_in_progress: 'Inashughulikiwa', st_completed: 'Imekamilika', st_closed: 'Imefungwa',
      ty_job: 'Kazi', ty_trip: 'Safari', ty_employer: 'Mwajiri', ty_contact: 'Mawasiliano',
      pr_low: 'Chini', pr_normal: 'Kawaida', pr_high: 'Juu', priority: 'Kipaumbele',
      all: 'Zote', all_status: 'Hali zote', anyone: 'Wote', me: 'Yangu', unassigned: 'Hayajagawiwa', any_time: 'Muda wote', d7: 'Siku 7', d30: 'Siku 30',
      ref: 'Namba', client: 'Mteja', type: 'Aina', phone: 'Simu', country: 'Nchi', status: 'Hali', assigned: 'Mhusika', date: 'Tarehe',
      export: 'Export CSV', of: 'kati ya', prev: 'Nyuma', next: 'Mbele', none: 'Hakuna maombi', none_p: 'Maombi kutoka website yataonekana hapa.',
      back: 'Rudi', call: 'Piga', details: 'Maelezo ya fomu', message: 'Ujumbe', service: 'Huduma', language: 'Lugha', source: 'Ukurasa',
      created: 'Imepokelewa', updated: 'Imebadilishwa', assign_to: 'Mpe', activity: 'Historia & notes', add_note: 'Andika note…', save_note: 'Hifadhi note',
      delete_lead: 'Futa ombi', confirm_delete: 'Una uhakika unataka kufuta ombi hili? Haliwezi kurudishwa.',
      a_created: 'Ombi limepokelewa kutoka website', a_status: 'alibadilisha hali', a_assign: 'alimpa', a_unassign: 'aliondoa mhusika', a_priority: 'alibadilisha kipaumbele', a_note: 'aliandika note',
      system: 'Mfumo', to: 'kuwa', saved: 'Imehifadhiwa', err: 'Hitilafu', new_lead: 'Ombi jipya', open: 'Fungua',
      role: 'Nafasi', r_pending: 'Inasubiri', r_staff: 'Mfanyakazi', r_admin: 'Admin', active: 'Hai', staff_p: 'Mtu akijisajili, anaonekana hapa kama "Inasubiri". Mpe nafasi ya Mfanyakazi ili aanze kazi.',
      you: 'wewe', profile: 'Wasifu', save: 'Hifadhi', change_password: 'Badilisha nenosiri', min6: 'Angalau herufi 6',
      check_email: 'Akaunti imeundwa. Thibitisha email yako (kama umetumiwa), kisha subiri admin akuidhinishe.', reset_sent: 'Link imetumwa kwenye email yako.',
      wa_hello: 'Habari {n}, hapa ni CAREEM Global Services kuhusu ombi lako {r}.'
    },
    en: {
      dashboard: 'Dashboard', leads: 'All requests', jobs: 'Jobs', trips: 'Trips', employers: 'Employers', contacts: 'Contact',
      staff: 'Staff', account: 'My account', manage: 'Management', signout: 'Sign out', search: 'Search name, phone or CG-…',
      login: 'Sign in', login_sub: 'Sign in to manage client requests.', email: 'Email', password: 'Password', name: 'Full name',
      no_account: 'No account? Request one', have_account: 'Have an account? Sign in', forgot: 'Forgot password?',
      signup: 'Request account', signup_sub: 'After signing up, an admin will approve you.', send_reset: 'Send reset link',
      reset_sub: 'Enter your email and we will send a link.', new_password: 'New password', save_password: 'Save password',
      art_h: 'Manage UAE jobs and trips in one place', art_p: 'Every form submitted on the website lands here instantly.',
      art_1: 'Job, trip and employer requests', art_2: 'Track every client’s status', art_3: 'Assign work to staff', art_4: 'Notes, history and CSV export',
      pending_h: 'Account awaiting approval', pending_p: 'Once a CAREEM admin approves you, you will see requests. Please check again later.', refresh: 'Check again',
      setup_h: 'App not connected', setup_p: 'Set supabaseUrl and supabaseKey in assets/config.js.',
      total: 'Total requests', new_: 'New', this_week: 'This week', completed: 'Completed', last14: 'Requests, last 14 days',
      by_type: 'By type', by_status: 'By status', recent: 'Recent requests', see_all: 'See all', my_open: 'My open requests',
      st_new: 'New', st_contacted: 'Contacted', st_in_progress: 'In progress', st_completed: 'Completed', st_closed: 'Closed',
      ty_job: 'Job', ty_trip: 'Trip', ty_employer: 'Employer', ty_contact: 'Contact',
      pr_low: 'Low', pr_normal: 'Normal', pr_high: 'High', priority: 'Priority',
      all: 'All', all_status: 'All statuses', anyone: 'Anyone', me: 'Mine', unassigned: 'Unassigned', any_time: 'Any time', d7: '7 days', d30: '30 days',
      ref: 'Ref', client: 'Client', type: 'Type', phone: 'Phone', country: 'Country', status: 'Status', assigned: 'Owner', date: 'Date',
      export: 'Export CSV', of: 'of', prev: 'Previous', next: 'Next', none: 'No requests', none_p: 'Requests from the website will appear here.',
      back: 'Back', call: 'Call', details: 'Form details', message: 'Message', service: 'Service', language: 'Language', source: 'Page',
      created: 'Received', updated: 'Updated', assign_to: 'Assign to', activity: 'History & notes', add_note: 'Write a note…', save_note: 'Save note',
      delete_lead: 'Delete request', confirm_delete: 'Delete this request? This cannot be undone.',
      a_created: 'Request received from the website', a_status: 'changed status', a_assign: 'assigned to', a_unassign: 'removed the owner', a_priority: 'changed priority', a_note: 'added a note',
      system: 'System', to: 'to', saved: 'Saved', err: 'Error', new_lead: 'New request', open: 'Open',
      role: 'Role', r_pending: 'Pending', r_staff: 'Staff', r_admin: 'Admin', active: 'Active', staff_p: 'New sign-ups appear here as "Pending". Give them the Staff role to start.',
      you: 'you', profile: 'Profile', save: 'Save', change_password: 'Change password', min6: 'At least 6 characters',
      check_email: 'Account created. Confirm your email (if asked), then wait for an admin to approve you.', reset_sent: 'A reset link has been sent to your email.',
      wa_hello: 'Hello {n}, this is CAREEM Global Services about your request {r}.'
    }
  };
  var lang = 'sw'; try { lang = localStorage.getItem('careem-admin-lang') || 'sw'; } catch (e) {}
  function t(k) { return (L[lang] && L[lang][k]) || L.sw[k] || k; }
  var STATUSES = ['new', 'contacted', 'in_progress', 'completed', 'closed'];
  var TYPES = ['job', 'trip', 'employer', 'contact'];
  var TYPE_NAV = { job: 'jobs', trip: 'trips', employer: 'employers', contact: 'contacts' };
  var TYPE_COLOR = { job: '#e30613', trip: '#c9973f', employer: '#7c3aed', contact: '#2563eb' };
  var ST_COLOR = { new: '#c00410', contacted: '#1d4ed8', in_progress: '#b45309', completed: '#047857', closed: '#6b7280' };

  /* ---------------- icons ---------------- */
  var P = {
    dash: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
    inbox: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 12h-4a3 3 0 0 1-6 0H5V5h14v10z',
    job: 'M10 4h4a2 2 0 0 1 2 2v1h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1h4V6a2 2 0 0 1 2-2zm0 3h4V6h-4v1z',
    trip: 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
    employer: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z',
    contact: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
    staff: 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 2 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z',
    out: 'M10 17l1.4-1.4L8.8 13H20v-2H8.8l2.6-2.6L10 7l-5 5 5 5zM4 5h8V3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8v-2H4V5z',
    search: 'M15.5 14h-.8l-.3-.3A6.5 6.5 0 1 0 14 15.5l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z',
    bell: 'M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4a1.5 1.5 0 0 0-3 0v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z',
    menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    back: 'M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z',
    phone: 'M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.3 1l-2.2 2.2z',
    mail: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
    wa: 'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88zm8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41z',
    note: 'M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zm17.7-10.2a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    flag: 'M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6z',
    plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    check: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
    swap: 'M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3 5 6.99h3V14h2V6.99h3L9 3z',
    trash: 'M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    dl: 'M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z',
    clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm.5 5H11v6l5.2 3.2.8-1.3-4.5-2.7V7z'
  };
  function ic(n, cls) { return '<svg class="' + (cls || 'ico') + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + P[n] + '"/></svg>'; }

  /* ---------------- utils ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function initials(n) { return esc((String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('') || '?').toUpperCase()); }
  function fmtDate(d, withTime) {
    if (!d) return '';
    var dt = new Date(d), loc = lang === 'en' ? 'en-GB' : 'sw-TZ';
    try { return dt.toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' }) + (withTime ? ' · ' + dt.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' }) : ''); }
    catch (e) { return dt.toISOString().slice(0, 16).replace('T', ' '); }
  }
  function ago(d) {
    var s = (Date.now() - new Date(d).getTime()) / 1000;
    if (s < 60) return lang === 'en' ? 'just now' : 'sasa hivi';
    var m = Math.floor(s / 60), h = Math.floor(m / 60), dd = Math.floor(h / 24);
    if (lang === 'en') return m < 60 ? m + ' min ago' : h < 24 ? h + ' h ago' : dd < 30 ? dd + ' d ago' : fmtDate(d);
    return m < 60 ? 'dakika ' + m + ' zilizopita' : h < 24 ? 'saa ' + h + ' zilizopita' : dd < 30 ? 'siku ' + dd + ' zilizopita' : fmtDate(d);
  }
  function waNumber(p) { var d = String(p || '').replace(/\D/g, ''); if (/^0\d{9}$/.test(d)) d = '255' + d.slice(1); return d; }
  function badgeStatus(s) { return '<span class="badge s-' + esc(s) + '">' + esc(t('st_' + s)) + '</span>'; }
  function badgeType(ty) { return '<span class="badge plain t-' + esc(ty) + '">' + esc(t('ty_' + ty)) + '</span>'; }
  function toast(msg, kind, link) {
    var el = document.createElement('div'); el.className = 'toast ' + (kind || '');
    el.innerHTML = '<span>' + msg + '</span>' + (link ? '<a href="' + link + '">' + esc(t('open')) + '</a>' : '');
    $('#toasts').appendChild(el); setTimeout(function () { el.remove(); }, kind === 'err' ? 7000 : 4500);
  }
  var ERR_SW = { 'Invalid login credentials': 'Email au nenosiri si sahihi.', 'Email not confirmed': 'Thibitisha email yako kwanza (angalia inbox).',
    'User already registered': 'Email hii tayari imesajiliwa. Ingia au badilisha nenosiri.', 'Password should be at least 6 characters.': 'Nenosiri liwe angalau herufi 6.' };
  function errMsg(e) { var m = (e && (e.message || e.error_description)) || String(e); return esc(lang === 'sw' && ERR_SW[m] ? ERR_SW[m] : m); }
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, ''), q = {};
    var parts = h.split('?'), path = parts[0].split('/');
    (parts[1] || '').split('&').forEach(function (kv) { if (!kv) return; var p = kv.split('='); q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
    return { name: path[0] || 'dashboard', id: path[1], q: q };
  }
  function hashFor(name, q) {
    var s = Object.keys(q || {}).filter(function (k) { return q[k]; }).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(q[k]); }).join('&');
    return '#/' + name + (s ? '?' + s : '');
  }

  /* ---------------- setup check ---------------- */
  if (!CFG.supabaseUrl || !CFG.supabaseKey || !window.supabase) {
    app.innerHTML = '<div class="boot"><img src="../assets/careem-logo.png" alt="CAREEM"><div style="text-align:center;max-width:420px;padding:0 20px"><h2>' + t('setup_h') + '</h2><p class="muted">' + t('setup_p') + '</p></div></div>';
    return;
  }
  var sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

  var S = { session: null, profile: null, staff: [], counts: {}, unseen: 0, channel: null, recovery: false, authMode: 'login', authMsg: null };
  function uid() { return S.session && S.session.user.id; }
  function isAdmin() { return S.profile && S.profile.role === 'admin'; }
  function staffName(id) { var p = S.staff.filter(function (x) { return x.id === id; })[0]; return p ? (p.full_name || p.email) : ''; }

  /* ---------------- auth ---------------- */
  function renderAuth() {
    var m = S.recovery ? 'reset' : S.authMode, msg = S.authMsg;
    var title = { login: t('login'), signup: t('signup'), forgot: t('forgot'), reset: t('new_password') }[m];
    var sub = { login: t('login_sub'), signup: t('signup_sub'), forgot: t('reset_sub'), reset: t('min6') }[m];
    var f = '';
    if (m === 'signup') f += '<div class="field"><label class="f" for="a_name">' + t('name') + '</label><input id="a_name" required maxlength="120" autocomplete="name"></div>';
    if (m !== 'reset') f += '<div class="field"><label class="f" for="a_email">' + t('email') + '</label><input id="a_email" type="email" required autocomplete="email"></div>';
    if (m !== 'forgot') f += '<div class="field"><label class="f" for="a_pw">' + (m === 'reset' ? t('new_password') : t('password')) + '</label><input id="a_pw" type="password" required minlength="6" autocomplete="' + (m === 'login' ? 'current-password' : 'new-password') + '"></div>';
    var btn = { login: t('login'), signup: t('signup'), forgot: t('send_reset'), reset: t('save_password') }[m];
    var links = m === 'login' ? '<a href="#" data-mode="signup">' + t('no_account') + '</a><a href="#" data-mode="forgot">' + t('forgot') + '</a>'
      : m === 'reset' ? '' : '<a href="#" data-mode="login">' + t('have_account') + '</a>';
    app.innerHTML = '<div class="auth"><div class="auth-art"><img class="logo" src="../assets/careem-logo.png" alt="CAREEM"><div><h1>' + t('art_h') + '</h1><p>' + t('art_p') + '</p><ul><li>' + t('art_1') + '</li><li>' + t('art_2') + '</li><li>' + t('art_3') + '</li><li>' + t('art_4') + '</li></ul></div><small style="color:#aaa">© CAREEM Global Services Limited</small></div>' +
      '<div class="auth-form"><form class="auth-card" id="authForm"><div class="row" style="justify-content:space-between;margin-bottom:26px"><img src="../assets/careem-logo.png" alt="CAREEM" style="width:96px"> ' + langToggle() + '</div>' +
      '<h2>' + title + '</h2><p class="sub">' + sub + '</p>' + (msg ? '<div class="alert ' + msg[0] + '">' + msg[1] + '</div>' : '') + f +
      '<button class="btn" type="submit">' + btn + '</button><div class="auth-links">' + links + '</div></form></div></div>';
    bindLang();
    $$('[data-mode]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); S.authMode = a.dataset.mode; S.authMsg = null; renderAuth(); }); });
    $('#authForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      var b = $('#authForm button[type=submit]'); b.disabled = true;
      var email = $('#a_email') && $('#a_email').value.trim(), pw = $('#a_pw') && $('#a_pw').value, res;
      var redirect = location.origin + location.pathname;
      try {
        if (m === 'login') res = await sb.auth.signInWithPassword({ email: email, password: pw });
        else if (m === 'signup') {
          res = await sb.auth.signUp({ email: email, password: pw, options: { data: { full_name: $('#a_name').value.trim() }, emailRedirectTo: redirect } });
          if (!res.error) { S.authMode = 'login'; S.authMsg = ['ok', t('check_email')]; }
        } else if (m === 'forgot') {
          res = await sb.auth.resetPasswordForEmail(email, { redirectTo: redirect });
          if (!res.error) S.authMsg = ['ok', t('reset_sent')];
        } else {
          res = await sb.auth.updateUser({ password: pw });
          if (!res.error) { S.recovery = false; location.hash = '#/dashboard'; }
        }
        if (res.error) S.authMsg = ['err', errMsg(res.error)];
      } catch (ex) { S.authMsg = ['err', errMsg(ex)]; }
      b.disabled = false;
      if (m === 'login' && res && !res.error) { S.authMsg = null; return boot(); }
      renderAuth();
    });
  }

  function renderPending() {
    app.innerHTML = '<div class="boot" style="padding:20px"><img src="../assets/careem-logo.png" alt="CAREEM"><div class="card" style="max-width:440px;text-align:center"><div class="bd"><h2 style="margin-top:0">' + t('pending_h') + '</h2><p class="muted">' + t('pending_p') + '</p><p><b>' + esc(S.session.user.email) + '</b></p><div class="row" style="justify-content:center"><button class="btn" id="pRefresh">' + t('refresh') + '</button><button class="btn ghost" id="pOut">' + t('signout') + '</button></div></div></div></div>';
    $('#pRefresh').onclick = boot; $('#pOut').onclick = signOut;
  }
  async function signOut() { if (S.channel) { sb.removeChannel(S.channel); S.channel = null; } await sb.auth.signOut(); S.profile = null; S.session = null; S.authMode = 'login'; S.authMsg = null; location.hash = ''; renderAuth(); }

  function langToggle() { return '<div class="lang"><button type="button" data-l="sw" class="' + (lang === 'sw' ? 'on' : '') + '">SW</button><button type="button" data-l="en" class="' + (lang === 'en' ? 'on' : '') + '">EN</button></div>'; }
  function bindLang() {
    $$('.lang button').forEach(function (b) {
      b.addEventListener('click', function () {
        lang = b.dataset.l; document.documentElement.lang = lang;
        try { localStorage.setItem('careem-admin-lang', lang); } catch (e) {}
        if (S.profile && S.profile.role !== 'pending' && S.profile.active) route(); else if (S.session) renderPending(); else renderAuth();
      });
    });
  }

  /* ---------------- shell ---------------- */
  function navLink(href, icon, label, on, n) {
    return '<a href="' + href + '" class="' + (on ? 'on' : '') + '">' + ic(icon) + '<span>' + label + '</span>' + (n ? '<span class="n">' + n + '</span>' : '') + '</a>';
  }
  function shell(title, active, body, extra) {
    var c = S.counts, me = S.profile;
    app.innerHTML = '<div class="shell"><aside class="side" id="side"><div class="brand"><img src="../assets/careem-logo.png" alt="CAREEM"></div><nav>' +
      navLink('#/dashboard', 'dash', t('dashboard'), active === 'dashboard') +
      navLink('#/leads', 'inbox', t('leads'), active === 'leads', c.all) +
      '<div class="sec">' + (lang === 'en' ? 'By type' : 'Kwa aina') + '</div>' +
      navLink('#/leads?type=job', 'job', t('jobs'), active === 'job', c.job) +
      navLink('#/leads?type=trip', 'trip', t('trips'), active === 'trip', c.trip) +
      navLink('#/leads?type=employer', 'employer', t('employers'), active === 'employer', c.employer) +
      navLink('#/leads?type=contact', 'contact', t('contacts'), active === 'contact', c.contact) +
      '<div class="sec">' + t('manage') + '</div>' +
      navLink('#/staff', 'staff', t('staff'), active === 'staff', isAdmin() ? c.pendingStaff : 0) +
      navLink('#/account', 'user', t('account'), active === 'account') +
      '</nav><div class="me"><div class="avatar">' + initials(me.full_name || me.email) + '</div><div style="flex:1"><b>' + esc(me.full_name || me.email) + '</b><span>' + esc(t('r_' + me.role)) + '</span></div><button class="btn ghost icon sm" id="signOut" title="' + t('signout') + '" style="background:transparent;border-color:#ffffff22;color:#ccc">' + ic('out') + '</button></div></aside>' +
      '<div class="main"><header class="top"><button class="btn ghost icon menu-btn" id="menuBtn" aria-label="Menu">' + ic('menu') + '</button><h1>' + title + '</h1>' +
      '<form class="search" id="gSearch">' + ic('search') + '<input id="gq" placeholder="' + esc(t('search')) + '" value="' + esc(extra && extra.q || '') + '"></form>' + langToggle() +
      '<a class="btn ghost icon bell" href="#/leads?status=new" title="' + esc(t('new_')) + '">' + ic('bell') + (S.unseen ? '<span class="dot">' + S.unseen + '</span>' : '') + '</a></header>' +
      '<div class="content" id="view">' + body + '</div></div></div>';
    bindLang();
    $('#signOut').onclick = signOut;
    $('#menuBtn').onclick = function () { $('#side').classList.toggle('open'); };
    $('#side').addEventListener('click', function (e) { if (e.target === $('#side') || e.target.closest('nav a')) $('#side').classList.remove('open'); });
    $('#gSearch').addEventListener('submit', function (e) { e.preventDefault(); location.hash = hashFor('leads', { q: $('#gq').value.trim() }); });
  }

  async function loadCounts() {
    var r = await sb.from('leads').select('type').eq('status', 'new').limit(5000);
    var c = { all: 0, job: 0, trip: 0, employer: 0, contact: 0 };
    (r.data || []).forEach(function (x) { c.all++; c[x.type]++; });
    c.pendingStaff = S.staff.filter(function (p) { return p.role === 'pending'; }).length;
    S.counts = c;
  }
  async function loadStaff() { var r = await sb.from('profiles').select('id,full_name,email,role,active,created_at').order('created_at'); S.staff = r.data || []; }

  /* ---------------- dashboard ---------------- */
  async function viewDashboard() {
    shell(t('dashboard'), 'dashboard', '<div class="kpis">' + [1, 2, 3, 4].map(function () { return '<div class="card kpi"><div style="flex:1"><div class="skeleton" style="width:50%;height:26px;margin-bottom:8px"></div><div class="skeleton" style="width:70%"></div></div></div>'; }).join('') + '</div>');
    var since = new Date(); since.setHours(0, 0, 0, 0); since = new Date(since.getTime() - 13 * 864e5);
    var res = await Promise.all([
      sb.from('leads').select('type,status,created_at,assigned_to').order('created_at', { ascending: false }).limit(5000),
      sb.from('leads').select('id,ref_code,full_name,phone,type,status,created_at').order('created_at', { ascending: false }).limit(8)
    ]);
    if (res[0].error) return toast(errMsg(res[0].error), 'err');
    var all = res[0].data || [], recent = res[1].data || [], wk = Date.now() - 7 * 864e5;
    var byT = {}, byS = {}, days = {}, mine = 0;
    TYPES.forEach(function (x) { byT[x] = 0; }); STATUSES.forEach(function (x) { byS[x] = 0; });
    for (var i = 0; i < 14; i++) { var d = new Date(since.getTime() + i * 864e5); days[d.toDateString()] = 0; }
    all.forEach(function (x) {
      byT[x.type]++; byS[x.status]++;
      var k = new Date(x.created_at).toDateString(); if (k in days) days[k]++;
      if (x.assigned_to === uid() && (x.status === 'contacted' || x.status === 'in_progress' || x.status === 'new')) mine++;
    });
    var week = all.filter(function (x) { return new Date(x.created_at).getTime() >= wk; }).length;
    var max = Math.max.apply(null, Object.keys(days).map(function (k) { return days[k]; }).concat([1]));
    function kpi(icon, color, v, label, sub) { return '<div class="card kpi"><div class="ic" style="background:' + color + '1a;color:' + color + '">' + ic(icon) + '</div><div><b>' + v + '</b><span>' + label + '</span>' + (sub ? '<small>' + sub + '</small>' : '') + '</div></div>'; }
    var bars = Object.keys(days).map(function (k) {
      var d = new Date(k), v = days[k];
      return '<div class="col"><div class="bar" data-v="' + v + '" style="height:' + Math.round(v / max * 100) + '%"></div><div class="lb">' + d.getDate() + '/' + (d.getMonth() + 1) + '</div></div>';
    }).join('');
    function brk(map, keys, prefix, colors, linkKey) {
      var tot = all.length || 1;
      return '<div class="breakdown">' + keys.map(function (k) {
        return '<a class="brow" href="' + hashFor('leads', linkKey === 'type' ? { type: k } : { status: k }) + '"><div class="t"><span>' + esc(t(prefix + k)) + '</span><b>' + map[k] + '</b></div><div class="track"><i style="width:' + (map[k] / tot * 100) + '%;background:' + colors[k] + '"></i></div></a>';
      }).join('') + '</div>';
    }
    var rows = recent.map(rowHtml).join('');
    $('#view').innerHTML = '<div class="kpis">' +
      kpi('inbox', '#111', all.length, t('total')) + kpi('bell', '#e30613', byS.new, t('new_'), mine ? t('my_open') + ': ' + mine : '') +
      kpi('clock', '#2563eb', week, t('this_week')) + kpi('check', '#047857', byS.completed, t('completed')) + '</div>' +
      '<div class="grid2"><div class="card"><div class="hd"><h3>' + t('last14') + '</h3></div><div class="bd"><div class="chart">' + bars + '</div></div></div>' +
      '<div class="card"><div class="hd"><h3>' + t('by_type') + '</h3></div><div class="bd">' + brk(byT, TYPES, 'ty_', TYPE_COLOR, 'type') + '<div style="height:22px"></div><h3 style="margin:0 0 14px;font-size:16px">' + t('by_status') + '</h3>' + brk(byS, STATUSES, 'st_', ST_COLOR, 'status') + '</div></div></div>' +
      '<div class="card"><div class="hd"><h3>' + t('recent') + '</h3><a class="btn ghost sm" href="#/leads">' + t('see_all') + '</a></div>' +
      (rows ? tableHtml(rows) : emptyHtml()) + '</div>';
    bindRows();
  }

  /* ---------------- leads list ---------------- */
  var PAGE = 25;
  function rowHtml(x) {
    return '<tr data-id="' + x.id + '" class="' + (x.status === 'new' ? 'unread' : '') + '"><td><div class="nm">' + esc(x.full_name) + '</div><div class="sub mono">' + esc(x.ref_code || '') + '</div></td>' +
      '<td>' + badgeType(x.type) + '</td><td class="hide-sm mono">' + esc(x.phone) + '</td><td class="hide-sm">' + esc(x.country || '—') + '</td>' +
      '<td>' + badgeStatus(x.status) + '</td><td class="hide-sm">' + (x.assigned_to ? esc(staffName(x.assigned_to)) : '<span class="muted">—</span>') + '</td>' +
      '<td class="hide-sm muted" title="' + esc(fmtDate(x.created_at, true)) + '">' + esc(ago(x.created_at)) + '</td></tr>';
  }
  function tableHtml(rows) {
    return '<div style="overflow-x:auto"><table class="resp"><thead><tr><th>' + t('client') + '</th><th>' + t('type') + '</th><th class="hide-sm">' + t('phone') + '</th><th class="hide-sm">' + t('country') + '</th><th>' + t('status') + '</th><th class="hide-sm">' + t('assigned') + '</th><th class="hide-sm">' + t('date') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  function emptyHtml() { return '<div class="empty">' + ic('inbox', 'ico') + '<b>' + t('none') + '</b>' + t('none_p') + '</div>'; }
  function bindRows() { $$('tbody tr[data-id]').forEach(function (tr) { tr.addEventListener('click', function () { location.hash = '#/lead/' + tr.dataset.id; }); }); }

  function applyFilters(qb, q) {
    if (q.type) qb = qb.eq('type', q.type);
    if (q.status) qb = qb.eq('status', q.status);
    if (q.owner === 'me') qb = qb.eq('assigned_to', uid()); else if (q.owner === 'none') qb = qb.is('assigned_to', null); else if (q.owner) qb = qb.eq('assigned_to', q.owner);
    if (q.days) qb = qb.gte('created_at', new Date(Date.now() - (+q.days) * 864e5).toISOString());
    if (q.q) { var s = q.q.replace(/[%,()*\\]/g, ' ').trim(); if (s) qb = qb.or('full_name.ilike.%' + s + '%,phone.ilike.%' + s + '%,ref_code.ilike.%' + s + '%,email.ilike.%' + s + '%'); }
    return qb;
  }

  async function viewLeads(q) {
    var page = Math.max(1, +(q.page || 1));
    var title = q.type ? t(TYPE_NAV[q.type]) : t('leads');
    var tabs = '<div class="tabs">' + ['', 'new', 'contacted', 'in_progress', 'completed', 'closed'].map(function (s) {
      var qq = Object.assign({}, q, { status: s, page: '' });
      return '<a href="' + hashFor('leads', qq) + '" class="' + ((q.status || '') === s ? 'on' : '') + '">' + (s ? t('st_' + s) : t('all')) + '</a>';
    }).join('') + '</div>';
    var ownerOpts = '<option value="">' + t('anyone') + '</option><option value="me">' + t('me') + '</option><option value="none">' + t('unassigned') + '</option>' +
      S.staff.filter(function (p) { return p.role !== 'pending'; }).map(function (p) { return '<option value="' + p.id + '">' + esc(p.full_name || p.email) + '</option>'; }).join('');
    var filters = '<form class="filters" id="flt"><input class="grow" id="f_q" placeholder="' + esc(t('search')) + '" value="' + esc(q.q || '') + '">' +
      '<select id="f_type"><option value="">' + t('all') + ' — ' + t('type') + '</option>' + TYPES.map(function (x) { return '<option value="' + x + '"' + (q.type === x ? ' selected' : '') + '>' + t('ty_' + x) + '</option>'; }).join('') + '</select>' +
      '<select id="f_owner">' + ownerOpts + '</select>' +
      '<select id="f_days"><option value="">' + t('any_time') + '</option><option value="7">' + t('d7') + '</option><option value="30">' + t('d30') + '</option></select>' +
      '<button class="btn ghost sm" type="button" id="csv">' + ic('dl') + t('export') + '</button></form>';
    shell(title, q.type || 'leads', tabs + '<div class="card">' + filters + '<div id="tbl"><div class="bd"><div class="skeleton"></div><div class="skeleton" style="margin-top:12px;width:80%"></div></div></div></div>', q);
    $('#f_owner').value = q.owner || ''; $('#f_days').value = q.days || '';
    function go() { location.hash = hashFor('leads', { type: $('#f_type').value, status: q.status, owner: $('#f_owner').value, days: $('#f_days').value, q: $('#f_q').value.trim() }); }
    $('#flt').addEventListener('submit', function (e) { e.preventDefault(); go(); });
    ['f_type', 'f_owner', 'f_days'].forEach(function (id) { $('#' + id).addEventListener('change', go); });
    $('#csv').addEventListener('click', function () { exportCsv(q); });

    var from = (page - 1) * PAGE;
    var r = await applyFilters(sb.from('leads').select('id,ref_code,full_name,phone,country,type,status,assigned_to,created_at', { count: 'exact' }), q)
      .order('created_at', { ascending: false }).range(from, from + PAGE - 1);
    if (r.error) { $('#tbl').innerHTML = '<div class="bd"><div class="alert err">' + errMsg(r.error) + '</div></div>'; return; }
    var total = r.count || 0, rows = (r.data || []).map(rowHtml).join('');
    var pager = total > PAGE ? '<div class="pager"><span>' + (from + 1) + '–' + Math.min(from + PAGE, total) + ' ' + t('of') + ' ' + total + '</span><div class="row">' +
      '<a class="btn ghost sm" ' + (page > 1 ? 'href="' + hashFor('leads', Object.assign({}, q, { page: page - 1 })) + '"' : 'aria-disabled="true" style="opacity:.4;pointer-events:none"') + '>' + t('prev') + '</a>' +
      '<a class="btn ghost sm" ' + (from + PAGE < total ? 'href="' + hashFor('leads', Object.assign({}, q, { page: page + 1 })) + '"' : 'aria-disabled="true" style="opacity:.4;pointer-events:none"') + '>' + t('next') + '</a></div></div>'
      : '<div class="pager"><span>' + total + ' ' + (lang === 'en' ? 'requests' : 'maombi') + '</span></div>';
    $('#tbl').innerHTML = rows ? tableHtml(rows) + pager : emptyHtml();
    bindRows();
  }

  function flatDetails(d) {
    if (!d || !d.sections) return '';
    return d.sections.map(function (s) { return s.fields.map(function (f) { return f.label + ': ' + f.value; }).join(' | '); }).join(' | ');
  }
  async function exportCsv(q) {
    var r = await applyFilters(sb.from('leads').select('ref_code,type,status,priority,full_name,phone,email,country,service,message,assigned_to,lang,source_page,created_at,data'), q)
      .order('created_at', { ascending: false }).limit(5000);
    if (r.error) return toast(errMsg(r.error), 'err');
    var head = ['Ref', 'Type', 'Status', 'Priority', 'Name', 'Phone', 'Email', 'Country', 'Service', 'Message', 'Owner', 'Language', 'Page', 'Received', 'Details'];
    var cell = function (v) { v = v == null ? '' : String(v); if (/^[=+\-@]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
    var lines = [head.map(cell).join(',')].concat((r.data || []).map(function (x) {
      return [x.ref_code, x.type, x.status, x.priority, x.full_name, x.phone, x.email, x.country, x.service, x.message, staffName(x.assigned_to), x.lang, x.source_page, fmtDate(x.created_at, true), flatDetails(x.data)].map(cell).join(',');
    }));
    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'careem-leads-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  /* ---------------- lead detail ---------------- */
  async function viewLead(id) {
    shell('…', 'leads', '<div class="card"><div class="bd"><div class="skeleton" style="width:40%;height:24px"></div><div class="skeleton" style="margin-top:14px"></div></div></div>');
    var res = await Promise.all([
      sb.from('leads').select('*').eq('id', id).maybeSingle(),
      sb.from('lead_activity').select('*').eq('lead_id', id).order('created_at', { ascending: true })
    ]);
    var x = res[0].data;
    if (res[0].error || !x) { $('#view').innerHTML = '<div class="card"><div class="empty"><b>' + (res[0].error ? errMsg(res[0].error) : '404') + '</b><a class="btn ghost" href="#/leads">' + t('back') + '</a></div></div>'; return; }
    var acts = res[1].data || [];
    $('.top h1').textContent = x.full_name;
    var wa = waNumber(x.phone), hello = t('wa_hello').replace('{n}', x.full_name.split(' ')[0]).replace('{r}', x.ref_code || '');
    var data = x.data || {};
    var sections = (data.sections || []).map(function (s) {
      return '<div class="sect"><h4>' + esc(s.title) + '</h4><dl>' + s.fields.map(function (f) { return '<dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd>'; }).join('') + '</dl></div>';
    }).join('');
    var staffOpts = '<option value="">— ' + t('unassigned') + ' —</option>' + S.staff.filter(function (p) { return p.role !== 'pending' && p.active; })
      .map(function (p) { return '<option value="' + p.id + '"' + (x.assigned_to === p.id ? ' selected' : '') + '>' + esc(p.full_name || p.email) + (p.id === uid() ? ' (' + t('you') + ')' : '') + '</option>'; }).join('');
    $('#view').innerHTML = '<a class="back" href="' + (x.type ? hashFor('leads', { type: x.type }) : '#/leads') + '">' + ic('back') + t('back') + '</a>' +
      '<div class="card"><div class="lead-head"><div class="avatar">' + initials(x.full_name) + '</div><div><h2>' + esc(x.full_name) + '</h2><div class="meta"><span class="mono">' + esc(x.ref_code || '') + '</span>' + badgeType(x.type) + '<span>' + esc(t('created')) + ' ' + esc(fmtDate(x.created_at, true)) + '</span></div></div>' +
      '<div class="acts"><a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/' + esc(wa) + '?text=' + encodeURIComponent(hello) + '">' + ic('wa') + 'WhatsApp</a>' +
      '<a class="btn ghost" href="tel:' + esc(x.phone.replace(/[^\d+]/g, '')) + '">' + ic('phone') + t('call') + '</a>' +
      (x.email ? '<a class="btn ghost" href="mailto:' + esc(x.email) + '">' + ic('mail') + 'Email</a>' : '') + '</div></div>' +
      '<div class="pipeline" id="pipe">' + STATUSES.map(function (s) { return '<button type="button" data-s="' + s + '" class="s-' + s + (x.status === s ? ' on' : '') + '">' + t('st_' + s) + '</button>'; }).join('') + '</div></div>' +
      '<div class="detail"><div class="card"><div class="hd"><h3>' + t('details') + '</h3></div><div class="bd"><div class="kv">' +
      kv(t('phone'), '<span class="mono">' + esc(x.phone) + '</span>') + kv('Email', esc(x.email || '—')) + kv(t('country'), esc(x.country || '—')) +
      kv(t('service'), esc(x.service || t('ty_' + x.type))) + kv(t('language'), x.lang === 'en' ? 'English' : 'Kiswahili') + kv(t('source'), esc(x.source_page || '—')) + '</div>' +
      (x.message ? '<div class="sect"><h4>' + t('message') + '</h4><div class="msg">' + esc(x.message) + '</div></div>' : '') + sections + '</div></div>' +
      '<div style="display:grid;gap:18px;align-content:start"><div class="card side-form"><div class="bd">' +
      '<div class="field"><label class="f" for="l_owner">' + t('assign_to') + '</label><select id="l_owner">' + staffOpts + '</select></div>' +
      '<div class="field"><label class="f" for="l_pri">' + t('priority') + '</label><select id="l_pri">' + ['low', 'normal', 'high'].map(function (p) { return '<option value="' + p + '"' + (x.priority === p ? ' selected' : '') + '>' + t('pr_' + p) + '</option>'; }).join('') + '</select></div>' +
      '<div class="muted" style="font-size:13px">' + t('updated') + ': ' + esc(fmtDate(x.updated_at, true)) + '</div>' +
      (isAdmin() ? '<button class="btn ghost sm" id="l_del" style="margin-top:14px;color:#b91c1c">' + ic('trash') + t('delete_lead') + '</button>' : '') + '</div></div>' +
      '<div class="card"><div class="hd"><h3>' + t('activity') + '</h3></div><div class="bd"><form id="noteForm" class="field"><textarea id="noteBody" maxlength="3000" placeholder="' + esc(t('add_note')) + '"></textarea><div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn sm" type="submit">' + ic('note') + t('save_note') + '</button></div></form>' +
      '<ul class="timeline">' + acts.slice().reverse().map(actHtml).join('') + '</ul></div></div></div></div>';

    async function upd(patch) {
      var r = await sb.from('leads').update(patch).eq('id', x.id).select('id').maybeSingle();
      if (r.error || !r.data) { toast(r.error ? errMsg(r.error) : t('err'), 'err'); return false; }
      toast(t('saved'), 'ok'); return true;
    }
    $$('#pipe button').forEach(function (b) { b.addEventListener('click', async function () { if (b.dataset.s === x.status) return; if (await upd({ status: b.dataset.s })) { await loadCounts(); viewLead(x.id); } }); });
    $('#l_owner').addEventListener('change', async function (e) { if (await upd({ assigned_to: e.target.value || null })) viewLead(x.id); });
    $('#l_pri').addEventListener('change', async function (e) { if (await upd({ priority: e.target.value })) viewLead(x.id); });
    $('#noteForm').addEventListener('submit', async function (e) {
      e.preventDefault(); var body = $('#noteBody').value.trim(); if (!body) return;
      var r = await sb.from('lead_activity').insert({ lead_id: x.id, kind: 'note', body: body, author: uid() });
      if (r.error) return toast(errMsg(r.error), 'err');
      viewLead(x.id);
    });
    var del = $('#l_del');
    if (del) del.addEventListener('click', async function () {
      if (!window.confirm(t('confirm_delete'))) return;
      var r = await sb.from('leads').delete().eq('id', x.id).select('id');
      if (r.error || !(r.data || []).length) return toast(r.error ? errMsg(r.error) : t('err'), 'err');
      await loadCounts(); location.hash = '#/leads';
    });
  }
  function kv(k, v) { return '<div><span>' + esc(k) + '</span><b>' + v + '</b></div>'; }
  function actHtml(a) {
    var who = a.author ? esc(staffName(a.author) || '—') : esc(t('system')), m = a.meta || {}, txt = '', icon = 'clock';
    if (a.kind === 'created') { txt = esc(t('a_created')); icon = 'plus'; }
    else if (a.kind === 'status') { txt = '<b>' + who + '</b> ' + t('a_status') + ' ' + badgeStatus(m.from) + ' → ' + badgeStatus(m.to); icon = 'swap'; }
    else if (a.kind === 'assign') { txt = '<b>' + who + '</b> ' + (m.to ? t('a_assign') + ' <b>' + esc(staffName(m.to)) + '</b>' : t('a_unassign')); icon = 'user'; }
    else if (a.kind === 'priority') { txt = '<b>' + who + '</b> ' + t('a_priority') + ' → ' + esc(t('pr_' + m.to)); icon = 'flag'; }
    else if (a.kind === 'note') { txt = '<b>' + who + '</b> ' + t('a_note') + '<div class="note">' + esc(a.body) + '</div>'; icon = 'note'; }
    return '<li><div class="dot">' + ic(icon) + '</div><div style="flex:1">' + txt + '<time title="' + esc(fmtDate(a.created_at, true)) + '">' + esc(ago(a.created_at)) + '</time></div></li>';
  }

  /* ---------------- staff ---------------- */
  async function viewStaff() {
    await loadStaff(); await loadCounts();
    var rows = S.staff.map(function (p) {
      var self = p.id === uid(), dis = !isAdmin() || self ? ' disabled' : '';
      return '<div class="staff-row" data-id="' + p.id + '"><div class="avatar">' + initials(p.full_name || p.email) + '</div><div class="who"><b>' + esc(p.full_name || '—') + (self ? ' <span class="muted">(' + t('you') + ')</span>' : '') + '</b><span>' + esc(p.email || '') + ' · ' + esc(fmtDate(p.created_at)) + '</span></div>' +
        '<select class="s_role"' + dis + '>' + ['pending', 'staff', 'admin'].map(function (r) { return '<option value="' + r + '"' + (p.role === r ? ' selected' : '') + '>' + t('r_' + r) + '</option>'; }).join('') + '</select>' +
        '<label class="switch"><input type="checkbox" class="s_active"' + (p.active ? ' checked' : '') + dis + '> ' + t('active') + '</label></div>';
    }).join('');
    shell(t('staff'), 'staff', '<div class="alert info">' + t('staff_p') + '</div><div class="card">' + (rows || emptyHtml()) + '</div>');
    $$('.staff-row').forEach(function (row) {
      var id = row.dataset.id;
      async function save(patch) {
        var r = await sb.from('profiles').update(patch).eq('id', id).select('id').maybeSingle();
        if (r.error || !r.data) { toast(r.error ? errMsg(r.error) : t('err'), 'err'); } else toast(t('saved'), 'ok');
        viewStaff();
      }
      $('.s_role', row).addEventListener('change', function (e) { save({ role: e.target.value }); });
      $('.s_active', row).addEventListener('change', function (e) { save({ active: e.target.checked }); });
    });
  }

  /* ---------------- account ---------------- */
  function viewAccount() {
    var me = S.profile;
    shell(t('account'), 'account', '<div class="grid2" style="grid-template-columns:1fr 1fr"><form class="card" id="profForm"><div class="hd"><h3>' + t('profile') + '</h3></div><div class="bd">' +
      '<div class="field"><label class="f" for="p_name">' + t('name') + '</label><input id="p_name" maxlength="120" value="' + esc(me.full_name) + '"></div>' +
      '<div class="field"><label class="f">' + t('email') + '</label><input value="' + esc(S.session.user.email) + '" disabled></div>' +
      '<div class="field"><label class="f">' + t('role') + '</label><input value="' + esc(t('r_' + me.role)) + '" disabled></div><button class="btn" type="submit">' + t('save') + '</button></div></form>' +
      '<form class="card" id="pwForm"><div class="hd"><h3>' + t('change_password') + '</h3></div><div class="bd"><div class="field"><label class="f" for="p_pw">' + t('new_password') + '</label><input id="p_pw" type="password" minlength="6" required autocomplete="new-password"><small class="muted">' + t('min6') + '</small></div><button class="btn dark" type="submit">' + t('save_password') + '</button></div></form></div>');
    $('#profForm').addEventListener('submit', async function (e) {
      e.preventDefault(); var n = $('#p_name').value.trim();
      var r = await sb.from('profiles').update({ full_name: n }).eq('id', uid()).select('*').maybeSingle();
      if (r.error) return toast(errMsg(r.error), 'err');
      S.profile = r.data; await loadStaff(); toast(t('saved'), 'ok'); viewAccount();
    });
    $('#pwForm').addEventListener('submit', async function (e) {
      e.preventDefault(); var r = await sb.auth.updateUser({ password: $('#p_pw').value });
      if (r.error) return toast(errMsg(r.error), 'err'); $('#p_pw').value = ''; toast(t('saved'), 'ok');
    });
  }

  /* ---------------- realtime ---------------- */
  function subscribe() {
    if (S.channel) return;
    S.channel = sb.channel('careem-leads').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, async function (payload) {
      var n = payload.new || {}; S.unseen++;
      await loadCounts();
      toast('<b>' + esc(t('new_lead')) + ':</b> ' + esc(n.full_name || '') + ' · ' + esc(t('ty_' + n.type)), '', n.id ? '#/lead/' + n.id : null);
      var r = parseHash(); if (r.name === 'dashboard' || r.name === 'leads') route(); else { var d = $('.bell'); if (d) d.innerHTML = ic('bell') + '<span class="dot">' + S.unseen + '</span>'; }
    }).subscribe();
  }

  /* ---------------- router & boot ---------------- */
  function route() {
    if (!S.session) return renderAuth();
    if (S.recovery) return renderAuth();
    if (!S.profile || S.profile.role === 'pending' || !S.profile.active) return renderPending();
    var r = parseHash();
    if (r.name === 'leads' && r.q.status === 'new') S.unseen = 0;
    if (r.name === 'leads') return viewLeads(r.q);
    if (r.name === 'lead' && r.id) return viewLead(+r.id);
    if (r.name === 'staff') return viewStaff();
    if (r.name === 'account') return viewAccount();
    return viewDashboard();
  }
  var booting = null;
  function boot() { if (!booting) booting = doBoot().finally(function () { booting = null; }); return booting; }
  async function doBoot() {
    var s = await sb.auth.getSession(); S.session = s.data.session;
    if (!S.session) return renderAuth();
    var p = await sb.from('profiles').select('*').eq('id', uid()).maybeSingle();
    S.profile = p.data || { id: uid(), role: 'pending', active: true, full_name: '', email: S.session.user.email };
    if (S.profile.role !== 'pending' && S.profile.active) { await loadStaff(); await loadCounts(); subscribe(); }
    route();
  }
  document.documentElement.lang = lang;
  window.addEventListener('hashchange', route);
  sb.auth.onAuthStateChange(function (ev, session) {
    if (ev === 'PASSWORD_RECOVERY') { S.session = session; S.recovery = true; renderAuth(); return; }
    if (ev === 'SIGNED_OUT') { S.session = null; S.profile = null; }
  });
  boot();
})();
