/* What each page shows. The page is picked by <body data-page="...">; the content goes into <main id="app">. */
(function () {
  "use strict";
  var api = window.NobsekAPI, cfg = window.NOBSEK, upd = window.NOBSEK_UPDATES || { entries: [], next: [] };
  var page = document.body.getAttribute("data-page");
  var app = document.getElementById("app");
  var $, $$, el;
  function qs(name) { return new URLSearchParams(location.search).get(name); }
  function section(cls) { var s = el("section", "page " + (cls || "")); var w = el("div", "wrap"); s.appendChild(w); app.appendChild(s); return w; }
  function head(w, eyebrow, title, sub) {
    if (eyebrow) { w.appendChild(el("p", "eyebrow", eyebrow)); }
    w.appendChild(el("h2", "", title));
    if (sub) { w.appendChild(el("p", "sub", sub)); }
  }
  function html(node, h) { node.innerHTML = h; return node; }
  function err(box, e) { box.textContent = e.message || String(e); box.hidden = false; }
  function signedOutNotice(w, text) {
    var n = el("div", "notice"); n.appendChild(el("h3", "", "Sign in first")); n.appendChild(el("p", "", text || "You need an account for this page."));
    var a = el("a", "btn primary", "Sign in or register"); a.href = "auth.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search); n.appendChild(a); w.appendChild(n);
  }
  function personCard(u, extra) {
    var card = el(extra ? "div" : "a", "person"); if (!extra) { card.href = "player.html?name=" + encodeURIComponent(u.username); }
    var av = N.avatar(u); if (u.online != null || u.last) { var dot = el("span", "dot" + (Date.now() - u.last < 900000 ? " on" : "")); av.appendChild(dot); }
    card.appendChild(av);
    var body = el("div"); var nm = el("div", "nm"); var link = el(extra ? "a" : "span", "", u.username); if (extra) { link.href = "player.html?name=" + encodeURIComponent(u.username); link.style.textDecoration = "none"; }
    nm.appendChild(link); nm.appendChild(N.badges(u)); if (u.seed) { nm.appendChild(el("span", "badge example", "example")); } body.appendChild(nm);
    if (u.bio) { body.appendChild(el("p", "", u.bio)); }
    if (extra) { body.appendChild(extra); }
    card.appendChild(body); return card;
  }

  var P = {};

  /* HOME */
  P.index = function (me) {
    var s = el("section", "home"); var w = el("div", "wrap"); s.appendChild(w); app.appendChild(s);
    w.appendChild(el("h1", "", "Nobsek"));
    w.appendChild(el("p", "lead", "Build a character, pick a scene, play it with friends. A game for adults."));
    var live = el("div", "live"); w.appendChild(live);
    api.stats().then(function (st) {
      [[st.players, "players"], [st.online, "online now"], [st.vips, "VIP"]].forEach(function (x) { var d = el("div"); d.appendChild(el("b", "", String(x[0]))); d.appendChild(el("span", "", x[1])); live.appendChild(d); });
    });
    var cta = el("div", "cta"); w.appendChild(cta);
    if (me) { var p = el("a", "btn primary big", "Get the game link"); p.href = "play.html"; cta.appendChild(p); }
    else { var r = el("a", "btn primary big", "Create an account"); r.href = "auth.html?mode=register"; cta.appendChild(r); var l = el("a", "btn big", "Sign in"); l.href = "auth.html"; cta.appendChild(l); }
    var how = el("section", "how"); var hw = el("div", "wrap"); how.appendChild(hw); s.parentNode.insertBefore(how, s.nextSibling);
    hw.appendChild(el("h2", "", "How it works"));
    var st = el("div", "steps3"); hw.appendChild(st);
    [["Create a free account", "Pick a username and confirm you are 18 or older. It takes a minute."], ["Get your game link", "Your private link opens Nobsek in Roblox. It is on the Play page, always."], ["Play and meet people", "Build your character, pick a scene, and chat with the community here."]].forEach(function (x) {
      var c = el("div", "step"); c.appendChild(el("h3", "", x[0])); c.appendChild(el("p", "", x[1])); st.appendChild(c);
    });
    var doors = el("div", "doors"); hw.appendChild(doors);
    var ICON = {
      play: '<path d="M8 5l11 7-11 7z"/>', chat: '<path d="M4 5h16v11H9l-5 4z"/>', people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6"/><path d="M16 5a3.5 3.5 0 010 7M18 14c2.5.6 3.5 2.6 3.5 6"/>',
      star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', news: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>', help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17h.01"/>'
    };
    [["play.html", "play", "Play", "Get your private link to the game"], ["messages.html", "chat", "Messages", "Chat rooms with other players"], ["players.html", "people", "Players", "Find people and add friends"],
      ["vip.html", "star", "VIP and coins", "Daily coins, shop, supporter perks"], ["updates.html", "news", "Updates", "Everything that changed"], ["faq.html", "help", "FAQ", "Quick answers"]].forEach(function (d) {
      var a = el("a", "door"); a.href = d[0]; var ic = el("span", "ico"); ic.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[d[1]] + "</svg>"; a.appendChild(ic);
      var t = el("span"); t.appendChild(el("strong", "", d[2])); t.appendChild(el("small", "", d[3])); a.appendChild(t); doors.appendChild(a);
    });
    var about = el("details", "about-box"); about.appendChild(el("summary", "", "What is Nobsek?"));
    about.appendChild(el("p", "", "Nobsek is a Roblox experience with a character editor, a library of 300+ scenes, soft-body physics and a grab tool. This site is where you register to get the game link, chat, find friends and manage your VIP perks."));
    hw.appendChild(about);
    var links = el("div", "links"); hw.appendChild(links);
    if (cfg.links.discord) { var dl = el("a", "", "Discord"); dl.href = cfg.links.discord; dl.target = "_blank"; dl.rel = "noopener"; links.appendChild(dl); }
    [["rules.html", "Rules"], ["terms.html", "Terms"]].forEach(function (x) { var a = el("a", "", x[1]); a.href = x[0]; links.appendChild(a); });
  };

  /* SIGN IN / REGISTER */
  P.auth = function (me) {
    var w = el("div", "wrap"); var s = el("section", "center-page"); s.appendChild(w); app.appendChild(s);
    if (me) { var next = qs("next"); if (next && !/^https?:|^\/\//.test(next)) { N.go(next); return; } N.go("play.html"); return; }
    var card = el("div", "panel card-auth"); w.appendChild(card);
    var mode = qs("mode") === "register" ? "register" : "login";
    var seg = el("div", "seg"); seg.setAttribute("role", "tablist");
    var tl = el("button", "", "Sign in"), tr = el("button", "", "Register"); [tl, tr].forEach(function (b) { b.type = "button"; b.setAttribute("role", "tab"); seg.appendChild(b); }); card.appendChild(seg);
    var form = el("form"); form.noValidate = true; card.appendChild(form);
    function field(label, name, type, auto, hint) {
      var d = el("div", "field"); var l = el("label", "label", label); l.htmlFor = "f-" + name; var i = el("input", "input"); i.id = "f-" + name; i.name = name; i.type = type; i.autocomplete = auto; d.appendChild(l); d.appendChild(i);
      if (hint) { d.appendChild(el("p", "hint", hint)); } form.appendChild(d); return d;
    }
    var fUser = field("Username", "username", "text", "username");
    var fMail = field("Email (optional)", "email", "email", "email", "Optional. Only used to recover your account.");
    var fPass = field("Password", "password", "password", "current-password");
    var chk = el("label", "check"); var cb = el("input"); cb.type = "checkbox"; cb.name = "age"; chk.appendChild(cb);
    var ct = el("span"); ct.appendChild(document.createTextNode("I am 18 or older and I accept the "));
    [["rules.html", "rules"], ["terms.html", "terms"]].forEach(function (x, i) { var a = el("a", "", x[1]); a.href = x[0]; a.target = "_blank"; if (i) { ct.appendChild(document.createTextNode(" and the ")); } ct.appendChild(a); });
    chk.appendChild(ct); form.appendChild(chk);
    var box = el("div", "error"); box.hidden = true; box.setAttribute("role", "alert"); form.appendChild(box);
    var go = el("button", "btn primary big", ""); go.type = "submit"; form.appendChild(go);
    var forgot = el("p", "forgot"); card.appendChild(forgot);
    function setMode(m) {
      mode = m; box.hidden = true; tl.setAttribute("aria-selected", String(m === "login")); tr.setAttribute("aria-selected", String(m === "register"));
      fMail.hidden = chk.hidden = m === "login"; go.textContent = m === "login" ? "Sign in" : "Create account"; $("#f-password").autocomplete = m === "login" ? "current-password" : "new-password";
      forgot.textContent = m === "login" ? "Forgot your password? Password reset arrives with the server." : "After you register you get the game link.";
    }
    tl.addEventListener("click", function () { setMode("login"); }); tr.addEventListener("click", function () { setMode("register"); });
    setMode(mode);
    form.addEventListener("submit", function (e) {
      e.preventDefault(); box.hidden = true;
      var f = { username: $("#f-username").value.trim(), email: $("#f-email").value.trim(), password: $("#f-password").value };
      if (mode === "register" && !cb.checked) { err(box, new Error("Please confirm you are 18 or older and accept the rules.")); return; }
      go.disabled = true;
      (mode === "login" ? api.login(f) : api.register(f)).then(function () { var next = qs("next"); N.go(next && !/^https?:|^\/\//.test(next) ? next : "play.html"); }, function (x) { go.disabled = false; err(box, x); });
    });
  };

  /* PLAY: the game link */
  P.play = function (me) {
    var w = section("narrow");
    if (!me) { head(w, "Play", "Get the game link"); signedOutNotice(w, "Register for free to get your private link to the game."); return; }
    head(w, "Play", "Your game link", "This link is yours. It opens Nobsek in Roblox. Do not share it.");
    var card = el("div", "panel"); w.appendChild(card);
    var row = el("div", "link-box"); var inp = el("input", "input"); inp.readOnly = true; inp.value = "Loading..."; inp.setAttribute("aria-label", "Your game link"); row.appendChild(inp);
    var cp = el("button", "btn", "Copy"); cp.type = "button"; row.appendChild(cp); card.appendChild(row);
    var open = el("a", "btn primary big", "Open the game"); open.style.marginTop = "16px"; open.target = "_blank"; open.rel = "noopener"; card.appendChild(open);
    api.gameLink().then(function (url) { inp.value = url; open.href = url; cp.addEventListener("click", function () { N.copy(url); }); });
    var steps = el("ol", "steps"); html(steps, "<li><b>Click Open the game.</b> Roblox opens on its own.</li><li><b>Sign in to Roblox</b> if it asks.</li><li><b>Press Play.</b> Your character editor is waiting.</li>"); card.appendChild(steps);
    var note = el("div", "notice"); note.style.marginTop = "14px"; note.appendChild(el("p", "", "Demo mode: this link is only an example. The real one appears when the server is connected."));
    if (api.demo) { w.appendChild(note); return; }

    /* link your Roblox account so the game knows you are registered */
    var rb = el("div", "panel"); rb.style.marginTop = "14px"; w.appendChild(rb);
    rb.appendChild(el("h3", "", "Link your Roblox account"));
    var rbBody = el("div"); rb.appendChild(rbBody);
    function drawRoblox() {
      api.robloxStatus().then(function (s) {
        rbBody.textContent = "";
        if (s.linked) { rbBody.appendChild(el("p", "ok", "Linked to " + s.robloxName + ". You are ready to play.")); rbBody.firstChild.style.marginTop = "12px"; return; }
        rbBody.appendChild(el("p", "muted", "The game only lets in registered members. Link your Roblox account once: it takes a minute."));
        var start = el("button", "btn primary", s.code ? "Get a new code" : "Start"); start.type = "button"; start.style.marginTop = "12px"; rbBody.appendChild(start);
        start.addEventListener("click", function () { api.robloxStart().then(drawRoblox, function (x) { N.toast(x.message); }); });
        if (!s.code) { return; }
        var ol = el("ol", "steps"); html(ol, "<li>Copy this code: <b></b></li><li>Paste it anywhere in the <b>About</b> text of your Roblox profile and save.</li><li>Type your Roblox username below and press Verify. You can remove the code afterwards.</li>");
        ol.querySelector("b").textContent = s.code; rbBody.appendChild(ol);
        var row = el("div", "link-box"); var name = el("input", "input"); name.placeholder = "Your Roblox username"; name.setAttribute("aria-label", "Roblox username"); row.appendChild(name);
        var ver = el("button", "btn primary", "Verify"); ver.type = "button"; row.appendChild(ver); rbBody.appendChild(row);
        ver.addEventListener("click", function () { ver.disabled = true; api.robloxVerify(name.value).then(function () { N.toast("Linked"); drawRoblox(); }, function (x) { ver.disabled = false; N.toast(x.message); }); });
      }, function () { rbBody.textContent = "Could not load."; });
    }
    drawRoblox();
  };

  /* MESSAGES */
  P.messages = function (me) {
    var w = section();
    head(w, "Messages", "Chat rooms", "Talk with other players. Be kind: the rules apply here too.");
    if (!me) { signedOutNotice(w, "Sign in to read and write messages."); return; }
    var chat = el("div", "chat"); w.appendChild(chat);
    var rooms = el("div", "rooms"); var pane = el("div", "pane"); chat.appendChild(rooms); chat.appendChild(pane);
    var ph = el("div", "pane-head"); var title = el("span", "", ""); ph.appendChild(title); pane.appendChild(ph);
    var log = el("div", "log"); log.setAttribute("aria-live", "polite"); pane.appendChild(log);
    var form = el("form", "compose"); var inp = el("input", "input"); inp.placeholder = "Write a message"; inp.maxLength = 500; inp.setAttribute("aria-label", "Message"); form.appendChild(inp);
    var send = el("button", "btn primary", "Send"); send.type = "submit"; form.appendChild(send); pane.appendChild(form);
    var room = qs("room") || "general", list = [];
    function mark() { $$(".room", rooms).forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-id") === room); }); }
    function draw(msgs) {
      log.textContent = ""; if (!msgs.length) { log.appendChild(el("div", "empty", "Nobody has written here yet.")); return; }
      msgs.forEach(function (m) {
        var row = el("div", "msg"); row.appendChild(N.avatar(m)); var b = el("div"); var who = el("div", "who");
        var a = el("a", "", m.user); a.href = "player.html?name=" + encodeURIComponent(m.user); if (m.vip) { a.style.color = "#ffd666"; } who.appendChild(a); who.appendChild(N.badges(m)); who.appendChild(el("time", "", N.ago(m.at)));
        if (m.user === me.username || me.role === "mod" || me.role === "admin" || me.role === "owner") { var x = el("button", "more", "Delete"); x.type = "button"; x.addEventListener("click", function () { api.deleteMessage(m.id).then(load); }); who.appendChild(x); }
        b.appendChild(who); b.appendChild(el("p", "body", m.text)); row.appendChild(b); log.appendChild(row);
      });
      log.scrollTop = log.scrollHeight;
    }
    function load() { return api.messages(room).then(function (m) { draw(m); form.hidden = false; }, function (e) { log.textContent = ""; var n = el("div", "empty"); n.textContent = e.message; if (/VIP/.test(e.message)) { var l = el("a", "btn small", "See VIP"); l.href = "vip.html"; n.appendChild(document.createElement("br")); n.appendChild(l); } log.appendChild(n); form.hidden = true; }); }
    function pick(id) { room = id; var r = list.filter(function (x) { return x.id === id; })[0]; title.textContent = r ? r.name + " · " + r.about : ""; mark(); load(); }
    api.rooms().then(function (rs) { list = rs; rs.forEach(function (r) { var b = el("button", "room", r.name); b.type = "button"; b.setAttribute("data-id", r.id); b.appendChild(el("small", "", r.about)); b.addEventListener("click", function () { pick(r.id); }); rooms.appendChild(b); }); pick(room); });
    form.addEventListener("submit", function (e) { e.preventDefault(); var t = inp.value; if (!t.trim()) { return; } api.send(room, t).then(function () { inp.value = ""; load(); }, function (x) { N.toast(x.message); }); });
    setInterval(function () { if (!document.hidden && !form.hidden) { load(); } }, 8000);
  };

  /* FRIENDS */
  P.friends = function (me) {
    var w = section(); head(w, "Friends", "Your friends");
    if (!me) { signedOutNotice(w, "Sign in to see your friends."); return; }
    var box = el("div"); w.appendChild(box);
    function draw() {
      api.friends().then(function (r) {
        box.textContent = "";
        if (r.requests.length) {
          box.appendChild(el("h3", "", "Requests")); var g = el("div", "people");
          r.requests.forEach(function (u) { var row = el("div", "row"); var y = el("button", "btn small primary", "Accept"), n = el("button", "btn small", "Decline"); y.type = n.type = "button";
            y.addEventListener("click", function () { api.addFriend(u.username).then(draw); }); n.addEventListener("click", function () { api.declineFriend(u.username).then(draw); }); row.appendChild(y); row.appendChild(n); g.appendChild(personCard(u, row)); });
          box.appendChild(g); box.appendChild(document.createElement("br"));
        }
        box.appendChild(el("h3", "", "Friends (" + r.friends.length + ")"));
        if (!r.friends.length) { var e = el("div", "notice"); e.style.marginTop = "12px"; e.appendChild(el("p", "", "No friends yet. Find people on the Players page.")); var a = el("a", "btn primary", "Find players"); a.href = "players.html"; e.appendChild(a); box.appendChild(e); return; }
        var g2 = el("div", "people"); r.friends.forEach(function (u) { var row = el("div", "row"); var m = el("a", "btn small", "Message"); m.href = "messages.html"; var rm = el("button", "btn small", "Remove"); rm.type = "button"; rm.addEventListener("click", function () { api.removeFriend(u.username).then(draw); }); row.appendChild(rm); g2.appendChild(personCard(u, row)); });
        box.appendChild(g2);
      });
    }
    draw();
  };

  /* PLAYERS */
  P.players = function () {
    var w = section(); head(w, "Players", "Find players", "Everyone who registered on Nobsek.");
    var tools = el("div", "tools"); var inp = el("input", "input"); inp.type = "search"; inp.placeholder = "Search by username"; inp.setAttribute("aria-label", "Search players"); tools.appendChild(inp); w.appendChild(tools);
    var grid = el("div", "people"); w.appendChild(grid);
    function draw() { api.players(inp.value).then(function (us) { grid.textContent = ""; if (!us.length) { grid.appendChild(el("p", "muted", "No player with that name.")); } us.forEach(function (u) { grid.appendChild(personCard(u)); }); }); }
    inp.addEventListener("input", draw); draw();
  };

  /* ONE PLAYER */
  P.player = function (me) {
    var w = section("narrow"); var name = qs("name");
    if (!name) { head(w, "Players", "Pick a player"); var a = el("a", "btn", "See all players"); a.href = "players.html"; w.appendChild(a); return; }
    api.player(name).then(function (u) {
      var card = el("div", "panel profile"); w.appendChild(card);
      var ban = el("div", "banner"); if (u.perks && u.perks.banner) { ban.style.background = "linear-gradient(120deg, hsl(" + u.hue + " 55% 45%), hsl(" + ((u.hue + 60) % 360) + " 55% 30%))"; } card.appendChild(ban);
      var tr = el("div", "top-row"); tr.appendChild(N.avatar(u, "big")); var t = el("div"); var h = el("h2", "", u.username); if (u.vip) { h.style.color = "#ffd666"; } t.appendChild(h);
      var line = el("div"); line.appendChild(N.badges(u)); if (u.seed) { line.appendChild(el("span", "badge example", "example")); } t.appendChild(line); tr.appendChild(t); card.appendChild(tr);
      card.appendChild(el("p", "bio", u.bio || "No bio yet."));
      var kv = el("dl", "kv"); [["Joined", new Date(u.joined).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })], ["Last seen", u.online ? "Online now" : N.ago(u.last)]].forEach(function (x) { kv.appendChild(el("dt", "", x[0])); kv.appendChild(el("dd", "", x[1])); }); card.appendChild(kv);
      var act = el("div", "actions-row"); card.appendChild(act);
      if (u.self) {
        var form = el("form"); form.style.marginTop = "22px"; form.appendChild(el("label", "label", "Your bio")); var ta = el("textarea", "textarea"); ta.value = u.bio || ""; ta.maxLength = 280; form.appendChild(ta);
        form.appendChild(el("p", "label", "Profile picture")); form.lastChild.style.marginTop = "18px";
        var pic = el("div", "pic-row"); var who = el("input", "input"); who.placeholder = "Roblox username or user id"; who.setAttribute("aria-label", "Roblox username or user id"); pic.appendChild(who);
        var use = el("button", "btn", "Use this picture"); use.type = "button"; pic.appendChild(use);
        var rm = el("button", "btn", "Remove picture"); rm.type = "button"; rm.hidden = !u.avatar; pic.appendChild(rm); form.appendChild(pic);
        form.appendChild(el("p", "hint", "We take the Roblox avatar picture of that account. You can change or remove it any time."));
        function applyAvatar(name) {
          use.disabled = rm.disabled = true;
          api.setAvatar(name).then(function (res) { u.avatar = res.avatar; N.fillAvatar($(".profile .avatar.big"), u); rm.hidden = !res.avatar; who.value = ""; N.toast(res.avatar ? "Picture updated" : "Picture removed"); }, function (x) { N.toast(x.message); }).then(function () { use.disabled = rm.disabled = false; });
        }
        use.addEventListener("click", function () { if (!who.value.trim()) { N.toast("Type a Roblox username or id first"); return; } applyAvatar(who.value); });
        rm.addEventListener("click", function () { applyAvatar(""); });
        var hue = u.hue;
        if (me.vip || (u.perks && u.perks.color)) { form.appendChild(el("p", "label", "Avatar colour")); form.lastChild.style.marginTop = "14px"; var sw = el("div", "swatches"); [10, 45, 130, 190, 262, 320].forEach(function (hh) { var b = el("button", "swatch"); b.type = "button"; b.style.background = "hsl(" + hh + " 55% 80%)"; b.setAttribute("aria-label", "Colour " + hh); b.setAttribute("aria-pressed", String(hh === hue)); b.addEventListener("click", function () { hue = hh; $$(".swatch", sw).forEach(function (o) { o.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); }); sw.appendChild(b); }); form.appendChild(sw); }
        else { form.appendChild(el("p", "hint", "Avatar colour: buy it in the VIP shop.")); }
        var save = el("button", "btn primary", "Save"); save.type = "submit"; save.style.marginTop = "14px"; form.appendChild(save); card.appendChild(form);
        form.addEventListener("submit", function (e) { e.preventDefault(); api.updateProfile({ bio: ta.value, hue: hue }).then(function () { N.toast("Saved"); }, function (x) { N.toast(x.message); }); });
      } else if (me) {
        var fb = el("button", "btn primary", u.friend ? "Friends ✓" : u.pending ? "Request sent" : "Add friend"); fb.type = "button"; fb.disabled = u.friend || u.pending;
        fb.addEventListener("click", function () { api.addFriend(u.username).then(function (r) { fb.textContent = r === "accepted" ? "Friends ✓" : "Request sent"; fb.disabled = true; }, function (x) { N.toast(x.message); }); }); act.appendChild(fb);
      } else { var si = el("a", "btn primary", "Sign in to add friend"); si.href = "auth.html?next=" + encodeURIComponent("player.html?name=" + u.username); act.appendChild(si); }
    }, function (e) { head(w, "Players", "Not found", e.message); var a = el("a", "btn", "See all players"); a.href = "players.html"; a.style.marginTop = "16px"; w.appendChild(a); });
  };

  /* VIP + COINS */
  P.vip = function (me) {
    var w = section(); head(w, "VIP and coins", "Coins and perks", "Earn coins every day and spend them on perks. Supporters get VIP through Patreon.");
    if (!me) { signedOutNotice(w, "Sign in to see your coins and the shop."); return; }
    var bal = el("div", "balance"); w.appendChild(bal);
    var shop = el("div", "shop"); var two = el("div", "two"); var ledger = el("ul", "ledger");
    function draw() {
      api.wallet().then(function (s) {
        bal.textContent = ""; var b = el("div"); b.appendChild(el("b", "", String(s.coins))); b.appendChild(el("p", "muted", "coins")); b.lastChild.style.margin = "0"; bal.appendChild(b);
        var claim = el("button", "btn primary", s.canClaim ? "Claim 25 daily coins" : "Come back tomorrow"); claim.type = "button"; claim.disabled = !s.canClaim; claim.addEventListener("click", function () { api.claimDaily().then(function () { N.toast("+25 coins"); draw(); }, function (x) { N.toast(x.message); }); }); bal.appendChild(claim);
        if (s.vip) { var v = el("span", "badge vip", s.role !== "player" ? s.role : "VIP until " + new Date(s.vipUntil).toLocaleDateString("en-US", { month: "short", day: "numeric" })); bal.appendChild(v); }
        ledger.textContent = ""; if (!s.ledger.length) { ledger.appendChild(el("li", "", "Nothing yet")); }
        s.ledger.slice(0, 10).forEach(function (l) { var li = el("li"); li.appendChild(el("span", "", l.text + " · " + N.ago(l.at))); li.appendChild(el("span", l.amount >= 0 ? "plus" : "minus", (l.amount >= 0 ? "+" : "") + l.amount)); ledger.appendChild(li); });
        shop.textContent = "";
        api.SHOP.forEach(function (it) {
          var c = el("div", "shop-item"); c.appendChild(el("h3", "", it.name)); c.appendChild(el("p", "", it.text)); c.appendChild(el("div", "price", it.price + " coins"));
          var owned = it.perk && s.perks[it.perk]; var buy = el("button", "btn" + (owned ? "" : " primary"), owned ? "Owned" : "Buy"); buy.type = "button"; buy.disabled = !!owned || s.coins < it.price;
          buy.addEventListener("click", function () { api.buy(it.id).then(function () { N.toast("Bought " + it.name); draw(); }, function (x) { N.toast(x.message); }); }); c.appendChild(buy); shop.appendChild(c);
        });
      });
    }
    w.appendChild(el("h3", "", "Shop")); w.lastChild.style.marginTop = "28px"; w.appendChild(shop);
    var sup = el("div", "panel"); sup.appendChild(el("h3", "", "Support Nobsek")); sup.appendChild(el("p", "muted", "Supporters on Patreon get VIP for as long as they support, plus the VIP lounge in Messages."));
    var pb = el(cfg.links.patreon ? "a" : "button", "btn primary", "Become a supporter"); if (cfg.links.patreon) { pb.href = cfg.links.patreon; pb.target = "_blank"; pb.rel = "noopener"; } else { pb.type = "button"; pb.disabled = true; pb.title = "Coming with the server"; } sup.appendChild(pb);
    var hist = el("div", "panel"); hist.appendChild(el("h3", "", "Recent activity")); hist.appendChild(ledger); two.appendChild(sup); two.appendChild(hist); w.appendChild(two);
    draw();
  };

  /* UPDATES */
  function pdate(t) { var p = String(t).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  P.updates = function () {
    var w = section(); head(w, "Updates", "What changed", "Every update to Nobsek, newest first.");
    var entries = (upd.entries || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }), changes = 0;
    var G = [["new", "NEW"], ["tweaks", "TWEAKS"], ["fixes", "FIXES"]];
    entries.forEach(function (e) { G.forEach(function (g) { changes += (e[g[0]] || []).length; }); });
    var cs = el("div", "counters"); w.appendChild(cs);
    [[String(entries.length), "updates"], [String(changes), "changes"], [entries.length ? pdate(entries[entries.length - 1].date).toLocaleDateString("en-US", { month: "long", day: "numeric" }) : "-", "since"]].forEach(function (x) { var c = el("div", "counter"); c.appendChild(el("b", "", x[0])); c.appendChild(el("span", "", x[1])); cs.appendChild(c); });
    if ((upd.next || []).length) { var nx = el("div", "next"); nx.appendChild(el("p", "heading", "Working on next")); var ul = el("ul"); upd.next.forEach(function (l) { ul.appendChild(el("li", "", l)); }); nx.appendChild(ul); w.appendChild(nx); }
    var list = el("div", "entries"); w.appendChild(list);
    entries.forEach(function (e, i) {
      var a = el("article", "entry"); var d = el("div", "entry-date"); d.appendChild(el("span", "", pdate(e.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))); if (!i) { d.appendChild(el("span", "pill", "LATEST")); } a.appendChild(d);
      a.appendChild(el("h3", "", e.title)); if (e.blurb) { a.appendChild(el("p", "blurb", e.blurb)); }
      G.forEach(function (g) { var l = e[g[0]] || []; if (!l.length) { return; } var gr = el("div", "grp " + g[0]); gr.appendChild(el("h4", "", g[1])); var u = el("ul"); l.forEach(function (t) { u.appendChild(el("li", "", t)); }); gr.appendChild(u); a.appendChild(gr); });
      list.appendChild(a);
    });
  };

  /* ADMIN */
  P.admin = function (me) {
    var w = section(); head(w, "Admin", "Players and roles");
    if (!me) { signedOutNotice(w); return; }
    if (me.role !== "admin" && me.role !== "owner") {
      var n = el("div", "notice"); n.appendChild(el("p", "", "This page is for admins."));
      if (api.demo) { var b = el("button", "btn", "Demo: make me admin"); b.type = "button"; b.addEventListener("click", function () { api.makeMeAdmin().then(function () { location.reload(); }); }); n.appendChild(b); }
      w.appendChild(n); return;
    }
    var box = el("div", "scroll-x"); w.appendChild(box);
    function draw() {
      api.adminUsers().then(function (us) {
        box.textContent = ""; var t = el("table", "table"); var th = el("thead"); var hr = el("tr"); ["Player", "Role", "Coins", "Give coins", ""].forEach(function (h) { hr.appendChild(el("th", "", h)); }); th.appendChild(hr); t.appendChild(th);
        var tb = el("tbody"); us.forEach(function (u) {
          var tr = el("tr"); var c1 = el("td"); var a = el("a", "", u.username); a.href = "player.html?name=" + encodeURIComponent(u.username); c1.appendChild(a); if (u.seed) { c1.appendChild(document.createTextNode(" ")); c1.appendChild(el("span", "badge example", "example")); } tr.appendChild(c1);
          var c2 = el("td"); var sel = el("select", "select"); sel.setAttribute("aria-label", "Role of " + u.username); api.ROLES.forEach(function (r) { var o = el("option", "", r); o.value = r; if (r === u.role) { o.selected = true; } sel.appendChild(o); });
          sel.addEventListener("change", function () { api.setRole(u.username, sel.value).then(function () { N.toast("Role saved"); draw(); }, function (x) { N.toast(x.message); draw(); }); }); c2.appendChild(sel); tr.appendChild(c2);
          tr.appendChild(el("td", "", String(u.coins)));
          var c4 = el("td"); var amt = el("input", "input"); amt.type = "number"; amt.placeholder = "+/-"; amt.style.width = "90px"; amt.style.minHeight = "34px"; amt.setAttribute("aria-label", "Coins for " + u.username); c4.appendChild(amt); tr.appendChild(c4);
          var c5 = el("td"); var gb = el("button", "btn small", "Apply"); gb.type = "button"; gb.addEventListener("click", function () { api.grantCoins(u.username, amt.value).then(function () { N.toast("Coins updated"); draw(); }, function (x) { N.toast(x.message); }); }); c5.appendChild(gb); tr.appendChild(c5);
          tb.appendChild(tr);
        });
        t.appendChild(tb); box.appendChild(t);
      }, function (e) { box.textContent = e.message; });
    }
    draw();
    if (api.demo) { var r = el("button", "btn small", "Reset the demo data"); r.type = "button"; r.style.marginTop = "18px"; r.addEventListener("click", function () { if (confirm("Delete all demo accounts and messages in this browser?")) { api.resetDemo().then(function () { N.go("index.html"); }); } }); w.appendChild(r); }
  };

  /* TEXT PAGES */
  var FAQ = [
    ["Do I need an account to play?", "Yes, but only to get the game link. Register here, then open the link: the game itself runs in Roblox, not in the browser."],
    ["Is it free?", "Yes. VIP is optional and only adds cosmetic perks."],
    ["Who can play?", "Adults only (18+). The game and this site are not for minors."],
    ["How do I get VIP?", "Support Nobsek on Patreon, or buy a VIP pass with coins in the VIP shop."],
    ["How do I earn coins?", "Claim your daily coins on the VIP page."],
    ["I lost my game link.", "Open the Play page again: your link is always there."],
    ["Which keys does the game use?", ["G takes out the grab tool. Number keys 1 to 5 jump between pages on this site, and H hides the dock."]],
    ["How do I report someone?", "Tell a moderator in Messages or on Discord. See the rules."]
  ];
  P.faq = function () {
    var w = section(); head(w, "FAQ", "Quick answers"); var f = el("div", "faq"); w.appendChild(f);
    FAQ.forEach(function (q) { var d = el("details"); d.appendChild(el("summary", "", q[0])); d.appendChild(el("p", "", Array.isArray(q[1]) ? q[1][0] : q[1])); f.appendChild(d); });
  };
  P.rules = function () {
    var w = section(); head(w, "Rules", "House rules", "Short and simple. Staff can remove anyone who breaks them.");
    html(w.appendChild(el("div", "prose")), "<ol><li><strong>Adults only.</strong> You must be 18 or older. Anyone who seems younger is removed.</li><li><strong>Consent.</strong> Only use characters, looks and avatars with their owner's agreement.</li><li><strong>Be kind.</strong> No harassment, hate or threats.</li><li><strong>No real people.</strong> Do not copy a real person's identity or photos.</li><li><strong>Keep your link private.</strong> Do not share your game link. Sharing it can get your account closed.</li><li><strong>No cheating the shop.</strong> Do not abuse bugs to gain coins or VIP.</li></ol>");
  };
  P.terms = function () {
    var w = section(); head(w, "Terms", "Terms of use", "Last updated 2026-11-22.");
    html(w.appendChild(el("div", "prose")), "<h3>Using the site</h3><p>By creating an account you confirm you are at least 18 years old and accept these terms and the rules. You are responsible for what you do with your account.</p><h3>Your data</h3><p>We keep your username, email and activity on the site so it can work. We do not sell it. You can ask for your account to be deleted at any time.</p><h3>Perks and coins</h3><p>Coins and VIP have no cash value and cannot be exchanged. Perks can change or end if the rules are broken.</p><h3>Changes</h3><p>These terms can change. Continuing to use the site means you accept the new version.</p><p class=\"muted\">Draft text: have it reviewed before the site goes public.</p>");
  };

  document.addEventListener("nobsek-ready", function (e) {
    $ = N.$; $$ = N.$$; el = N.el;
    if (P[page]) { P[page](e.detail); }
  });
  document.addEventListener("nobsek-signedout", function () { /* each page already shows its own sign-in notice */ });
})();
