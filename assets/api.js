/* The real server adapter. When config.js has `api: "https://..."`, it replaces the demo data layer
   with calls to the Worker. Same method names as demo-api.js, so no page changes. */
(function () {
  "use strict";
  var cfg = window.NOBSEK || {};
  if (!cfg.api) { return; }
  var base = String(cfg.api).replace(/\/+$/, ""), TOKEN = "nobsek-token";
  function token() { try { return localStorage.getItem(TOKEN); } catch (e) { return null; } }
  function setToken(t) { try { if (t) { localStorage.setItem(TOKEN, t); } else { localStorage.removeItem(TOKEN); } } catch (e) { /* ignore */ } }
  function call(method, path, body) {
    var headers = {}, t = token();
    if (t) { headers.Authorization = "Bearer " + t; }
    if (body !== undefined) { headers["Content-Type"] = "application/json"; }
    return fetch(base + path, { method: method, headers: headers, body: body === undefined ? undefined : JSON.stringify(body) }).then(function (r) {
      return r.json().catch(function () { return { ok: false, error: "Server error." }; }).then(function (j) {
        if (!j.ok) { if (r.status === 401 && t) { setToken(null); } throw new Error(j.error || "Something went wrong."); }
        return j.data;
      });
    }, function () { throw new Error("Cannot reach the server. Try again in a moment."); });
  }
  var enc = encodeURIComponent;
  var demo = window.NobsekAPI || {};
  window.NobsekAPI = {
    demo: false, ROLES: demo.ROLES || ["player", "vip", "mod", "admin", "owner"], SHOP: demo.SHOP || [], ROOMS: demo.ROOMS || [],
    me: function () { return token() ? call("GET", "/api/me") : Promise.resolve(null); },
    register: function (f) { return call("POST", "/api/register", f).then(function (d) { setToken(d.token); return d.user; }); },
    login: function (f) { return call("POST", "/api/login", f).then(function (d) { setToken(d.token); return d.user; }); },
    logout: function () { var p = token() ? call("POST", "/api/logout", {}).catch(function () { return null; }) : Promise.resolve(); return p.then(function () { setToken(null); return true; }); },
    deleteAccount: function (password) { return call("POST", "/api/account/delete", { password: password }).then(function () { setToken(null); return true; }); },
    stats: function () { return call("GET", "/api/stats"); },
    players: function (q) { return call("GET", "/api/players?q=" + enc(q || "")); },
    player: function (name) { return call("GET", "/api/player/" + enc(name)); },
    updateProfile: function (f) { return call("POST", "/api/profile", f); },
    friends: function () { return call("GET", "/api/friends"); },
    addFriend: function (name) { return call("POST", "/api/friends/add", { name: name }); },
    declineFriend: function (name) { return call("POST", "/api/friends/decline", { name: name }); },
    removeFriend: function (name) { return call("POST", "/api/friends/remove", { name: name }); },
    rooms: function () { return Promise.resolve(demo.ROOMS || []); },
    messages: function (room) { return call("GET", "/api/messages?room=" + enc(room)); },
    send: function (room, text) { return call("POST", "/api/messages", { room: room, text: text }); },
    deleteMessage: function (id) { return call("DELETE", "/api/messages/" + enc(id)); },
    wallet: function () { return call("GET", "/api/wallet"); },
    claimDaily: function () { return call("POST", "/api/daily", {}); },
    buy: function (id) { return call("POST", "/api/buy", { id: id }); },
    adminUsers: function () { return call("GET", "/api/admin/users"); },
    report: function (f) { return call("POST", "/api/reports", f); },
    reports: function (status) { return call("GET", "/api/reports?status=" + enc(status || "open")); },
    reportDetail: function (id) { return call("GET", "/api/reports/" + enc(id)); },
    closeReport: function (id, status, note) { return call("POST", "/api/reports/" + enc(id), { status: status, note: note }); },
    deleteUser: function (name) { return call("POST", "/api/admin/delete", { name: name }); },
    setBan: function (name, banned) { return call("POST", "/api/admin/ban", { name: name, banned: banned }); },
    warn: function (name, reason) { return call("POST", "/api/mod/warn", { name: name, reason: reason }); },
    warningSeen: function (id) { return call("POST", "/api/warnings/seen", { id: id }); },
    setRole: function (name, role) { return call("POST", "/api/admin/role", { name: name, role: role }); },
    grantCoins: function (name, amount) { return call("POST", "/api/admin/coins", { name: name, amount: amount }); }
  };
})();
