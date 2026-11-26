/* The shell shared by every page: news band, header, account menu, dock, footer, 18+ window, toast.
   Also the small helpers the pages use (window.N). */
(function () {
  "use strict";
  var cfg = window.NOBSEK || { links: {}, ageGate: true };
  var upd = window.NOBSEK_UPDATES || { news: "" };
  var api = window.NobsekAPI;
  var page = document.body.getAttribute("data-page") || "";

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) { n.className = cls; } if (text != null) { n.textContent = text; } return n; }
  function remember(k, v) { try { if (v === undefined) { return localStorage.getItem(k); } localStorage.setItem(k, v); } catch (e) { /* ignore */ } return null; }
  function ago(t) {
    var s = Math.max(1, Math.round((Date.now() - t) / 1000));
    if (s < 60) { return "just now"; }
    if (s < 3600) { return Math.round(s / 60) + " min ago"; }
    if (s < 86400) { return Math.round(s / 3600) + " h ago"; }
    return Math.round(s / 86400) + " d ago";
  }
  function fillAvatar(a, u) {
    var initial = (u.username || "?").charAt(0).toUpperCase();
    a.textContent = initial;
    if (u.avatar) {
      var img = document.createElement("img"); img.alt = ""; img.loading = "lazy"; img.referrerPolicy = "no-referrer"; img.src = u.avatar;
      img.onerror = function () { img.remove(); a.textContent = initial; };
      a.textContent = ""; a.appendChild(img);
    }
  }
  function avatar(u, cls) {
    var a = el("span", "avatar" + (cls ? " " + cls : ""));
    a.style.setProperty("--h", u.hue == null ? 260 : u.hue);
    fillAvatar(a, u);
    return a;
  }
  function badges(u) {
    var f = document.createDocumentFragment();
    if (u.role && u.role !== "player") { f.appendChild(el("span", "badge " + u.role, u.role)); }
    else if (u.vip) { f.appendChild(el("span", "badge vip", "VIP")); }
    return f;
  }
  var toastTimer;
  function toast(text) {
    var t = $("#toast");
    if (!t) { t = el("div", "toast"); t.id = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = text; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }
  function go(url) { location.href = url; }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) { return navigator.clipboard.writeText(text).then(function () { toast("Copied"); }, function () { toast("Press Ctrl+C to copy"); }); }
    toast("Press Ctrl+C to copy"); return Promise.resolve();
  }
  window.N = { $: $, $$: $$, el: el, ago: ago, avatar: avatar, fillAvatar: fillAvatar, badges: badges, toast: toast, go: go, copy: copy, cfg: cfg, remember: remember, me: null };

  /* the dock: four places */
  var DOCK = [["index.html", "Home", "home"], ["messages.html", "Messages", "messages"], ["players.html", "Players", "players"], ["vip.html", "VIP", "vip"]];
  var NAV = [["messages.html", "Messages", "messages"], ["players.html", "Players", "players"], ["vip.html", "VIP", "vip"], ["updates.html", "Updates", "updates"], ["faq.html", "FAQ", "faq"]];
  var ICONS = {
    home: '<path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
    messages: '<path d="M4 5h16v11H9l-5 4z"/>',
    players: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6"/><path d="M16 5a3.5 3.5 0 010 7M18 14c2.5.6 3.5 2.6 3.5 6"/>',
    vip: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'
  };

  function build(me) {
    N.me = me;
    var top = document.createDocumentFragment();

    if (upd.news) {
      var news = el("a", "news"); news.href = "updates.html";
      var wrap = el("div", "wrap");
      wrap.appendChild(el("span", "tag", "NEW")); wrap.appendChild(el("span", "", upd.news)); wrap.appendChild(el("span", "more", "What changed ›"));
      news.appendChild(wrap); top.appendChild(news);
    }

    var head = el("header", "top"); var bar = el("div", "wrap bar");
    var brand = el("a", "brand", "Nobsek"); brand.href = "index.html";
    if (api && api.demo) { var demo = el("span", "pill soft demo-tag", "DEMO"); demo.title = "Demo mode: accounts stay in this browser until the server is connected"; brand.appendChild(demo); }
    bar.appendChild(brand);
    var nav = el("nav"); nav.setAttribute("aria-label", "More");
    NAV.forEach(function (n) { var a = el("a", "", n[1]); a.href = n[0]; if (n[2] === page) { a.setAttribute("aria-current", "page"); } nav.appendChild(a); });
    bar.appendChild(nav);

    var acct = el("div", "acct");
    if (me) {
      var btn = el("button", "btn"); btn.type = "button"; btn.setAttribute("aria-haspopup", "true"); btn.setAttribute("aria-expanded", "false");
      btn.appendChild(avatar(me)); btn.appendChild(el("span", "", me.username));
      var menu = el("div", "menu"); menu.hidden = true;
      function item(text, href) { var a = el("a", "", text); a.href = href; menu.appendChild(a); }
      item("My profile", "player.html?name=" + encodeURIComponent(me.username));
      item("Friends", "friends.html");
      item("VIP and coins", "vip.html");
      if (api.reports && (me.role === "mod" || me.role === "admin" || me.role === "owner")) {
        item("Reports", "reports.html"); var rep = menu.lastChild;
        api.reports("open").then(function (r) { if (r.open) { rep.textContent = "Reports (" + r.open + ")"; btn.appendChild(el("span", "count", String(r.open))); } }, function () { /* the page shows the error */ });
      }
      if (me.role === "admin" || me.role === "owner") { item("Admin", "admin.html"); }
      var out = el("button", "", "Sign out"); out.type = "button";
      out.addEventListener("click", function () { api.logout().then(function () { go("index.html"); }); });
      menu.appendChild(out);
      btn.addEventListener("click", function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute("aria-expanded", String(!menu.hidden)); });
      document.addEventListener("click", function () { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") { menu.hidden = true; } });
      acct.appendChild(btn); acct.appendChild(menu);
    } else {
      var login = el("a", "btn primary", "Sign in"); login.href = "auth.html";
      acct.appendChild(login);
    }
    bar.appendChild(acct); head.appendChild(bar); top.appendChild(head);
    document.body.insertBefore(top, document.body.firstChild);

    /* footer */
    var foot = el("footer"); var fw = el("div", "wrap");
    fw.appendChild(el("span", "", "Nobsek · 18+ only"));
    var fn = el("nav");
    [["updates.html", "Updates"], ["faq.html", "FAQ"], ["rules.html", "Rules"], ["terms.html", "Terms"]].forEach(function (l) { var a = el("a", "", l[1]); a.href = l[0]; fn.appendChild(a); });
    if (cfg.links.discord) { var d = el("a", "", "Discord"); d.href = cfg.links.discord; d.target = "_blank"; d.rel = "noopener"; fn.appendChild(d); }
    fw.appendChild(fn); foot.appendChild(fw); document.body.appendChild(foot);

    /* dock */
    var dock = el("nav", "dock"); dock.id = "dock"; dock.setAttribute("aria-label", "Main");
    DOCK.forEach(function (d, i) {
      var a = el("a"); a.href = d[0]; a.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[d[2]] + "</svg>"); a.appendChild(el("span", "", d[1]));
      if (d[2] === page || (d[2] === "players" && (page === "player" || page === "friends"))) { a.className = "on"; a.setAttribute("aria-current", "page"); }
      dock.appendChild(a);
    });
    var handle = el("button", "dock-handle"); handle.type = "button"; handle.setAttribute("aria-label", "Show or hide the dock (H)");
    handle.innerHTML = '<svg viewBox="0 0 18 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2l7 6 7-6"/></svg>';
    function setDock(v) { dock.classList.toggle("off", !v); handle.classList.toggle("up", !v); remember("nobsek-dock", v ? "1" : "0"); }
    handle.addEventListener("click", function () { setDock(dock.classList.contains("off")); });
    document.body.appendChild(dock);

    /* 18+ window */
    if (cfg.ageGate !== false && remember("nobsek-18") !== "1") {
      var gate = el("div", "gate"); gate.id = "gate"; gate.setAttribute("role", "dialog"); gate.setAttribute("aria-modal", "true"); gate.setAttribute("aria-labelledby", "gateTitle");
      gate.innerHTML = '<div class="gate-card"><h2 id="gateTitle">Adults only</h2><p>Nobsek is a game for adults. Are you 18 or older?</p>' +
        '<p class="small-print">By entering you confirm you are of legal age where you live.</p>' +
        '<div class="gate-actions"><button class="btn primary" id="gateYes" type="button">I am 18 or older</button><a class="btn" href="https://www.google.com">Leave</a></div></div>';
      document.body.appendChild(gate); document.documentElement.style.overflow = "hidden";
      $("#gateYes").addEventListener("click", function () { gate.hidden = true; document.documentElement.style.overflow = ""; remember("nobsek-18", "1"); });
      $("#gateYes").focus();
    }

    document.dispatchEvent(new CustomEvent("nobsek-ready", { detail: me }));
  }

  /* the sign-in gate for pages that need an account */
  var NEEDS_ACCOUNT = { messages: 1, friends: 1, admin: 1, reports: 1 };
  /* wait until every script has run: the real server can answer before pages.js is listening */
  var loaded = new Promise(function (done) { if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", done); } else { done(); } });
  Promise.all([api.me().catch(function () { return null; }), loaded]).then(function (r) {
    var me = r[0];
    build(me);
    if (NEEDS_ACCOUNT[page] && !me) { document.dispatchEvent(new CustomEvent("nobsek-signedout")); }
  });
})();
