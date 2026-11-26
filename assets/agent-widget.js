/* CAREEM AI customer care widget (Jotform AI Agent).
   Floating chat bubble above the WhatsApp button; opens a small card that sends
   the visitor to the agent on WhatsApp. Text follows the site's SW/EN toggle
   (body.en hides .sw and shows .en via style.css). */
(function () {
  var AGENT_URL = 'https://agent.jotform.com/01a2189961f8700088d89469a8f655b8a97e/whatsapp';
  var AVATAR = 'https://cdn.jotfor.ms/assets/agent-avatars/avatar_icon_1584.png';
  if (document.getElementById('careem-agent')) return;

  var css = '' +
    '#careem-agent{position:fixed;right:20px;bottom:92px;z-index:22;display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:inherit}' +
    '#careem-agent-card{width:min(340px,calc(100vw - 40px));background:#fff;border:1px solid #E3E5F5;border-radius:14px;box-shadow:0 10px 30px #0003;overflow:hidden;' +
      'opacity:0;visibility:hidden;transform:translateY(12px);transition:transform .3s,opacity .3s,visibility .3s}' +
    '#careem-agent.open #careem-agent-card{opacity:1;visibility:visible;transform:none}' +
    '#careem-agent-head{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid #E3E5F5;position:relative}' +
    '#careem-agent-head img{width:44px;height:44px;border-radius:50%;background:#f8fafc}' +
    '#careem-agent-head strong{display:block;color:#334155;font-size:15px}' +
    '#careem-agent-head small{color:#16a34a;font-size:13px}' +
    '#careem-agent-x{position:absolute;top:6px;right:8px;border:0;background:transparent;color:#334155;font-size:20px;line-height:1;cursor:pointer;padding:4px 8px}' +
    '#careem-agent-body{padding:14px 16px 4px}' +
    '#careem-agent-body p{margin:0 0 12px;background:#fafafa;border-radius:8px;padding:10px 12px;color:#334155;font-size:14.5px;line-height:1.45}' +
    '#careem-agent-go{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 16px 16px;padding:12px 14px;border-radius:999px;background:#25d366;color:#fff;font-weight:600;font-size:15px;text-decoration:none}' +
    '#careem-agent-go .ico{width:22px;height:22px}' +
    '#careem-agent-btn{width:52px;height:52px;border-radius:50%;border:1px solid #E3E5F5;background:#fff;color:#334155;cursor:pointer;display:grid;place-items:center;box-shadow:0 6px 20px #0003;padding:0}' +
    '#careem-agent-btn img{width:42px;height:42px;border-radius:50%}' +
    '#careem-agent.open #careem-agent-btn{display:none}';

  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.id = 'careem-agent';
  root.innerHTML = '' +
    '<div id="careem-agent-card" role="dialog" aria-label="CAREEM Assistant">' +
      '<div id="careem-agent-head">' +
        '<img src="' + AVATAR + '" alt="" width="44" height="44">' +
        '<div><strong>CAREEM Assistant</strong><small><span class="sw">Mtandaoni</span><span class="en">Online</span></small></div>' +
        '<button type="button" id="careem-agent-x" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div id="careem-agent-body"><p>' +
        '<span class="sw">Karibu CAREEM! 🌟 Tukusaidieje kuhusu ajira UAE, safari au visa?</span>' +
        '<span class="en">Welcome to CAREEM! 🌟 How can we help with UAE jobs, trips or visas?</span>' +
      '</p></div>' +
      '<a id="careem-agent-go" href="' + AGENT_URL + '" target="_blank" rel="noopener">' +
        '<svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg>' +
        '<span class="sw">Ongea nasi WhatsApp</span><span class="en">Message us on WhatsApp</span>' +
      '</a>' +
    '</div>' +
    '<button type="button" id="careem-agent-btn" aria-label="Chat with CAREEM Assistant"><img src="' + AVATAR + '" alt="" width="42" height="42"></button>';
  document.body.appendChild(root);

  /* If the avatar cannot load (blocked CDN, offline), show a simple chat icon instead of a broken image. */
  var FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#e30613"/>' +
    '<path fill="#fff" d="M14 15h20a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H25l-6 5v-5h-5a3 3 0 0 1-3-3V18a3 3 0 0 1 3-3z"/></svg>');
  Array.prototype.forEach.call(root.querySelectorAll('img'), function (img) {
    img.addEventListener('error', function () { if (img.src !== FALLBACK) img.src = FALLBACK; });
  });

  document.getElementById('careem-agent-btn').addEventListener('click', function () { root.classList.add('open'); });
  document.getElementById('careem-agent-x').addEventListener('click', function () { root.classList.remove('open'); });
})();
