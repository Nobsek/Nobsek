/* DEMO MODE. Everything below lives in this browser only (localStorage); nothing is sent anywhere.
   It exposes the same async methods the real server will, so the pages never change when the server arrives:
   replace this file with one that calls your Worker (fetch) and keep the method names. */
(function () {
  "use strict";
  var KEY = "nobsek-demo-db", SESSION = "nobsek-demo-session";
  var ROLES = ["player", "vip", "mod", "admin", "owner"];
  var SHOP = [
    { id: "vip7", name: "VIP, 7 days", price: 300, text: "A VIP badge and a gold name for a week.", days: 7 },
    { id: "vip30", name: "VIP, 30 days", price: 1000, text: "A VIP badge and a gold name for a month.", days: 30 },
    { id: "color", name: "Name colour", price: 150, text: "Pick the colour of your name on the site.", perk: "color" },
    { id: "banner", name: "Profile banner", price: 200, text: "A banner on your profile page.", perk: "banner" }
  ];
  var ROOMS = [
    { id: "general", name: "General", about: "Say hello" },
    { id: "vip", name: "VIP lounge", about: "Supporters only", vip: true }
  ];
  function now() { return Date.now(); }
  function load() { try { var d = JSON.parse(localStorage.getItem(KEY)); if (d && d.users) { return d; } } catch (e) { /* fresh */ } return seed(); }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* ignore */ } }
  function seed() {
    var t = now(), h = 3600000;
    function u(name, role, hue, bio, coins, ago) { return { id: "seed-" + name.toLowerCase(), username: name, email: "", role: role, hue: hue, bio: bio, coins: coins, joined: t - ago * 86400000, last: t - Math.floor(Math.random() * 40) * 60000, seed: true, friends: [], requests: [], ledger: [], perks: {}, hash: "" }; }
    var d = {
      users: [
        u("Nobsek", "owner", 262, "Made the game. Ask me anything.", 9999, 40),
        u("Aria", "admin", 330, "Keeps the place tidy.", 1200, 33),
        u("Milo", "mod", 160, "Moderator. Be kind.", 640, 30),
        u("Kestrel", "vip", 45, "Look codes, mostly.", 410, 21),
        u("Juno", "player", 200, "New here!", 60, 7),
        u("Pip", "player", 20, "", 20, 3)
      ],
      msgs: []
    };
    var lines = [["Nobsek", "general", "Welcome! This is the demo of the site: accounts here stay in your browser."], ["Aria", "general", "Say hello in General."], ["Kestrel", "vip", "Thanks for the support, everyone."]];
    lines.forEach(function (l, i) { d.msgs.push({ id: "m" + i, room: l[1], user: l[0], text: l[2], at: t - (lines.length - i) * h }); });
    save(d); return d;
  }
  function wait(v) { return new Promise(function (ok) { setTimeout(function () { ok(v); }, 60); }); }
  function clean(u) { var o = {}; ["id", "username", "role", "hue", "bio", "avatar", "coins", "joined", "last", "perks", "seed"].forEach(function (k) { o[k] = u[k]; }); o.vip = isVip(u); return o; }
  function isVip(u) { return u.role !== "player" || !!(u.perks && u.perks.vipUntil > now()); }
  function hash(text) {
    if (window.crypto && crypto.subtle) {
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode("nobsek-demo:" + text)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); });
    }
    return Promise.resolve("p:" + btoa(unescape(encodeURIComponent(text))));
  }
  function current(d) { var id = null; try { id = localStorage.getItem(SESSION); } catch (e) { /* ignore */ } return d.users.filter(function (u) { return u.id === id; })[0] || null; }
  function byName(d, n) { n = String(n || "").toLowerCase(); return d.users.filter(function (u) { return u.username.toLowerCase() === n; })[0] || null; }
  function need(d) { var m = current(d); if (!m) { throw new Error("Sign in first."); } return m; }
  function staff(m) { return m.role === "mod" || m.role === "admin" || m.role === "owner"; }
  function boss(m) { return m.role === "admin" || m.role === "owner"; }
  function guard(fn) { return new Promise(function (ok, no) { setTimeout(function () { try { Promise.resolve(fn()).then(ok, no); } catch (e) { no(e); } }, 60); }); }
  function note(u, text, amount) { u.ledger.unshift({ at: now(), text: text, amount: amount }); u.ledger = u.ledger.slice(0, 40); }

  var api = {
    demo: true, ROLES: ROLES, SHOP: SHOP, ROOMS: ROOMS,
    me: function () { return guard(function () { var m = current(load()); return m ? clean(m) : null; }); },
    register: function (f) {
      return guard(function () {
        var d = load(), name = String(f.username || "").trim();
        if (!/^[A-Za-z0-9_]{3,20}$/.test(name)) { throw new Error("Username: 3 to 20 letters, numbers or _."); }
        if (byName(d, name)) { throw new Error("That username is taken."); }
        if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) { throw new Error("That email does not look right. Leave it empty if you prefer."); }
        if (String(f.password || "").length < 8) { throw new Error("Password: at least 8 characters."); }
        return hash(f.password).then(function (hs) {
          var u = { id: "u" + now().toString(36), username: name, email: f.email || "", role: "player", hue: Math.floor(Math.random() * 360), bio: "", coins: 100, joined: now(), last: now(), friends: [], requests: [], ledger: [], perks: {}, hash: hs };
          note(u, "Welcome gift", 100);
          d.users.push(u); save(d); localStorage.setItem(SESSION, u.id); return clean(u);
        });
      });
    },
    login: function (f) {
      return guard(function () {
        var d = load(), u = byName(d, f.username);
        if (!u || u.seed) { throw new Error("Wrong username or password."); }
        return hash(f.password).then(function (hs) {
          if (hs !== u.hash) { throw new Error("Wrong username or password."); }
          u.last = now(); save(d); localStorage.setItem(SESSION, u.id); return clean(u);
        });
      });
    },
    logout: function () { try { localStorage.removeItem(SESSION); } catch (e) { /* ignore */ } return wait(true); },
    stats: function () { var d = load(); return wait({ players: d.users.length, online: d.users.filter(function (u) { return now() - u.last < 15 * 60000; }).length, vips: d.users.filter(isVip).length }); },
    players: function (q) { var d = load(); q = String(q || "").toLowerCase(); return wait(d.users.filter(function (u) { return !q || u.username.toLowerCase().indexOf(q) >= 0; }).sort(function (a, b) { return b.last - a.last; }).map(clean)); },
    player: function (name) { return guard(function () { var d = load(), u = byName(d, name); if (!u) { throw new Error("No such player."); } var m = current(d), o = clean(u); o.online = now() - u.last < 15 * 60000; o.friend = !!(m && m.friends.indexOf(u.id) >= 0); o.pending = !!(m && u.requests.indexOf(m.id) >= 0); o.self = !!(m && m.id === u.id); return o; }); },
    updateProfile: function (f) { return guard(function () { var d = load(), m = need(d); m.bio = String(f.bio || "").slice(0, 280); if (f.hue != null && (m.perks.color || m.role !== "player")) { m.hue = f.hue; } save(d); return clean(m); }); },
    friends: function () { return guard(function () { var d = load(), m = need(d); function pick(ids) { return ids.map(function (id) { return d.users.filter(function (u) { return u.id === id; })[0]; }).filter(Boolean).map(clean); } return { friends: pick(m.friends), requests: pick(m.requests) }; }); },
    addFriend: function (name) {
      return guard(function () {
        var d = load(), m = need(d), u = byName(d, name);
        if (!u || u.id === m.id) { throw new Error("You cannot add that player."); }
        if (m.requests.indexOf(u.id) >= 0) { m.requests.splice(m.requests.indexOf(u.id), 1); m.friends.push(u.id); u.friends.push(m.id); save(d); return "accepted"; }
        if (m.friends.indexOf(u.id) >= 0) { return "already"; }
        if (u.seed) { m.friends.push(u.id); u.friends.push(m.id); save(d); return "accepted"; }
        if (u.requests.indexOf(m.id) < 0) { u.requests.push(m.id); }
        save(d); return "sent";
      });
    },
    declineFriend: function (name) { return guard(function () { var d = load(), m = need(d), u = byName(d, name); if (u) { m.requests = m.requests.filter(function (i) { return i !== u.id; }); save(d); } return true; }); },
    removeFriend: function (name) { return guard(function () { var d = load(), m = need(d), u = byName(d, name); if (u) { m.friends = m.friends.filter(function (i) { return i !== u.id; }); u.friends = u.friends.filter(function (i) { return i !== m.id; }); save(d); } return true; }); },
    rooms: function () { return wait(ROOMS); },
    messages: function (room) { return guard(function () { var d = load(), m = current(d), r = ROOMS.filter(function (x) { return x.id === room; })[0]; if (!r) { throw new Error("No such room."); } if (r.vip && !(m && isVip(m))) { throw new Error("The VIP lounge is for VIP members."); } return d.msgs.filter(function (x) { return x.room === room; }).slice(-80).map(function (x) { var u = byName(d, x.user) || { username: x.user, hue: 260, role: "player", perks: {} }; return { id: x.id, user: u.username, hue: u.hue, avatar: u.avatar || null, role: u.role, vip: isVip(u), text: x.text, at: x.at }; }); }); },
    send: function (room, text) { return guard(function () { var d = load(), m = need(d), r = ROOMS.filter(function (x) { return x.id === room; })[0]; text = String(text || "").trim().slice(0, 500); if (!text) { throw new Error("Write something first."); } if (!r || (r.vip && !isVip(m))) { throw new Error("You cannot write here."); } d.msgs.push({ id: "m" + now().toString(36) + Math.random().toString(36).slice(2, 5), room: room, user: m.username, text: text, at: now() }); m.last = now(); save(d); return true; }); },
    deleteMessage: function (id) { return guard(function () { var d = load(), m = need(d); var msg = d.msgs.filter(function (x) { return x.id === id; })[0]; if (!msg) { return true; } if (!staff(m) && msg.user !== m.username) { throw new Error("Not allowed."); } d.msgs = d.msgs.filter(function (x) { return x.id !== id; }); save(d); return true; }); },
    wallet: function () { return guard(function () { var m = need(load()), day = 86400000, last = (m.perks && m.perks.daily) || 0; return { coins: m.coins, ledger: m.ledger, vipUntil: (m.perks && m.perks.vipUntil) || 0, perks: m.perks || {}, canClaim: now() - last > day, vip: isVip(m), role: m.role }; }); },
    claimDaily: function () { return guard(function () { var d = load(), m = need(d); if (now() - (m.perks.daily || 0) <= 86400000) { throw new Error("Already claimed today."); } m.perks.daily = now(); m.coins += 25; note(m, "Daily coins", 25); save(d); return m.coins; }); },
    buy: function (id) {
      return guard(function () {
        var d = load(), m = need(d), it = SHOP.filter(function (s) { return s.id === id; })[0];
        if (!it) { throw new Error("Unknown item."); }
        if (m.coins < it.price) { throw new Error("Not enough coins."); }
        m.coins -= it.price; note(m, "Bought " + it.name, -it.price);
        if (it.days) { m.perks.vipUntil = Math.max(now(), m.perks.vipUntil || 0) + it.days * 86400000; } else { m.perks[it.perk] = true; }
        save(d); return clean(m);
      });
    },
    adminUsers: function () { return guard(function () { var d = load(), m = need(d); if (!boss(m)) { throw new Error("Admins only."); } return d.users.map(function (u) { var o = clean(u); o.email = u.email; return o; }); }); },
    setRole: function (name, role) { return guard(function () { var d = load(), m = need(d), u = byName(d, name); if (!boss(m)) { throw new Error("Admins only."); } if (ROLES.indexOf(role) < 0 || !u) { throw new Error("Bad request."); } if (role === "owner" && m.role !== "owner") { throw new Error("Only the owner can name an owner."); } u.role = role; save(d); return true; }); },
    grantCoins: function (name, amount) { return guard(function () { var d = load(), m = need(d), u = byName(d, name); if (!boss(m)) { throw new Error("Admins only."); } amount = Math.round(Number(amount)); if (!u || !amount) { throw new Error("Bad request."); } u.coins = Math.max(0, u.coins + amount); note(u, "Staff adjustment", amount); save(d); return true; }); },
    resetDemo: function () { try { localStorage.removeItem(KEY); localStorage.removeItem(SESSION); } catch (e) { /* ignore */ } return wait(true); },
    makeMeAdmin: function () { return guard(function () { var d = load(), m = need(d); m.role = "admin"; save(d); return true; }); }
  };
  window.NobsekAPI = api;
})();
