/* walkn.app visitor analytics (GA4 web stream G-3H8PEMCW98, property 542442106) behind a consent banner.
   Approved 2026-10-13 (docs/design/site-consent/, option A: the bottom bar).

   Who is asked: a browser whose time zone is in Europe sees the bar and nothing loads until it answers ACCEPT.
   Everyone else is counted without a bar. The time zone is only a guess at the country, so Google's own
   IP-based region default is the authority behind it: for an EEA / UK / Swiss visitor analytics_storage stays
   DENIED unless they accepted here. A wrong guess therefore errs safe in both directions (a European with a
   non-European zone sets no cookies; anyone else with a European zone just sees the bar).
   A "Cookie settings" link (any element with data-cookie-settings) reopens the bar for anyone, so it is also the
   opt-out for visitors who were never asked. DECLINE is remembered and loads nothing on later visits.
   No animation and no per-frame script here (the site's per-frame rule: walkn-ads-consent-analytics). */
(function () {
  var ID = 'G-3H8PEMCW98', KEY = 'walkn_site_consent';
  var REGION = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
    'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'];
  var loaded = false, bar = null;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function inEurope() {
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return true; }
    if (!tz) return true;
    return /^Europe\//.test(tz) || /^(Atlantic\/(Canary|Madeira|Azores|Reykjavik|Faroe)|Arctic\/Longyearbyen|Asia\/(Nicosia|Famagusta))$/.test(tz);
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function load(accepted) {
    if (loaded) { if (accepted) gtag('consent', 'update', { analytics_storage: 'granted' }); return; }
    loaded = true;
    // the site serves no ads: every ad signal stays denied for everyone
    var base = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' };
    gtag('consent', 'default', base);
    if (!accepted) gtag('consent', 'default', { analytics_storage: 'denied', region: REGION });
    gtag('js', new Date());
    gtag('config', ID);
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
  }

  function clearCookies() {
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^_ga/.test(name)) return;
      ['', '; domain=' + location.hostname, '; domain=.' + location.hostname.replace(/^www\./, '')].forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }

  function decline() {
    write('denied');
    if (loaded) { gtag('consent', 'update', { analytics_storage: 'denied' }); clearCookies(); }
    hide();
  }
  function accept() { write('granted'); load(true); hide(); }
  function hide() { if (bar) bar.hidden = true; }

  function show() {
    if (!bar) {
      var css = document.createElement('style');
      css.textContent =
        '.wk-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;align-items:center;gap:24px;' +
        'padding:16px max(24px,calc((100vw - 1160px)/2)) calc(16px + env(safe-area-inset-bottom,0px));' +
        'background:linear-gradient(180deg,var(--panel-hi,#1c2333),var(--panel-lo,#0e1219));border-top:1px solid var(--seam,#3a4354);' +
        'box-shadow:0 -10px 30px rgba(0,0,0,.55);color:var(--ink,#e8ecf3);font:14px/1.45 var(--body,"Inter",-apple-system,"Segoe UI",Roboto,sans-serif)}' +
        '.wk-consent[hidden]{display:none}' +
        '.wk-consent p{flex:1;min-width:0;margin:0;color:var(--ink-2,#b7bfcd)}' +
        '.wk-consent a{color:var(--ink,#e8ecf3);text-underline-offset:3px}' +
        '.wk-consent .wk-k{display:flex;gap:10px}' +
        '.wk-consent button{font:700 16px/1 var(--display,"Barlow Condensed","Arial Narrow",sans-serif);letter-spacing:.08em;text-transform:uppercase;' +
        'min-width:120px;height:42px;border-radius:10px;cursor:pointer;border:1px solid var(--seam,#3a4354);color:var(--ink,#e8ecf3);' +
        'background:linear-gradient(180deg,#2a3243,#161b26)}' +
        '.wk-consent button.wk-y{background:linear-gradient(180deg,#ff3a42,#c8121a);border-color:#ff5058;color:#fff}' +
        '.wk-consent button:focus-visible,.wk-consent a:focus-visible{outline:2px solid var(--gold,#ffd700);outline-offset:2px}' +
        '@media (max-width:640px){.wk-consent{flex-direction:column;align-items:stretch;gap:12px;padding:14px 16px calc(14px + env(safe-area-inset-bottom,0px))}' +
        '.wk-consent button{flex:1;min-width:0}}';
      document.head.appendChild(css);
      bar = document.createElement('div');
      bar.className = 'wk-consent';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Cookie choice');
      bar.innerHTML = '<p>We use Google Analytics cookies to count visitors and see which countries they come from. ' +
        'Nothing is sold, and the app isn’t affected. <a href="privacy.html#your-privacy-choices">Privacy policy</a></p>' +
        '<div class="wk-k"><button type="button" class="wk-n">Decline</button><button type="button" class="wk-y">Accept</button></div>';
      bar.querySelector('.wk-n').addEventListener('click', decline);
      bar.querySelector('.wk-y').addEventListener('click', accept);
      document.body.appendChild(bar);
    }
    bar.hidden = false;
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('[data-cookie-settings]');
    if (t) { e.preventDefault(); show(); }
  });

  var choice = read();
  if (choice === 'granted') load(true);
  else if (choice === 'denied') return;
  else if (inEurope()) show();
  else load(false);
})();
