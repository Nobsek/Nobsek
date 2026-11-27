// Nobsek site settings. Edit this file only.
// A link left empty ("") hides its button everywhere on the site.
window.NOBSEK = {
  links: {
    discord: "",  // your Discord invite, e.g. "https://discord.gg/xxxxxx"
    patreon: ""   // later, for supporters
  },
  api: "https://nobsek-api.nobsek.workers.dev", // the server (Cloudflare Worker) address, e.g. "https://nobsek-api.YOURNAME.workers.dev". Empty = demo mode
  ws: "wss://nobsek-play.nobsek.workers.dev/room", // multiplayer relay
  avatarApi: "https://nobsek-play.nobsek.workers.dev", // avatar proxy
  defaultAvatar: "7990812402", // skin loaded when the game is opened without a handle ("" = none)
  ageGate: true   // false removes the "18+ only" window at the first visit
};
