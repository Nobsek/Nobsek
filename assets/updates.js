// The Updates page reads this file. To add an update, put a new entry at the TOP of "entries".
// The counters (updates, changes, since) and the LATEST badge are worked out by the page: nothing else to edit.
// "news" is the banner at the top of the site (leave it empty to hide it). "next" is the "Working on next" list.
window.NOBSEK_UPDATES = {
  news: "",
  next: [
    "Roles and VIP for supporters",
    "Share your look code on the site",
    "More scenes and more models"
  ],
  entries: [
    {
      date: "2026-11-22",
      title: "Scenes play on click",
      blurb: "One click on a scene and it plays. No preview window, no setup.",
      new: [
        "Click a scene to play it at once: your bot joins by itself",
        "Bulge is an option in Settings, off by default",
        "Clap sounds on scenes with impact, placed on the real strokes of each animation",
        "A section for the accessories of your Roblox avatar in the Editor: Adjust to move, turn or resize, × to remove"
      ],
      tweaks: [
        "Characters of different sizes line up properly in imported scenes: a Short partner meets the other character in the right place",
        "A worn model only aims for an opening in the scenes made for it, in every matching category",
        "Spacing of Scene 11 is set for everybody"
      ],
      fixes: [
        "Male players get the male voice (it stayed silent after picking M)",
        "Moves of worn models and of the ending effect follow the size of the character",
        "Grab: you can grab your own body again, and the cursor ray goes through your own head and arm so the aim stays steady",
        "Grab: bones come back to their resting pose after a release (a safety check was added)"
      ]
    },
    {
      date: "2026-11-21",
      title: "Your own chat, voices and a cleaner Editor",
      blurb: "A chat in the look of the game, a Silent voice, and an Editor sorted in four tabs.",
      new: [
        "Your own chat at the bottom left, with bubbles over heads (Enter or /)",
        "Silent voice, and a Voices off switch in Settings",
        "Fullness meter with a Release button after the ending effect",
        "Grab tool on the G key: take it out and put it away",
        "Bulge: a moving bump that follows the model and takes its size"
      ],
      tweaks: [
        "Editor in four tabs, Outfit, Body, Face and Voice, with sections you can fold",
        "Scene, category and item names are neutral everywhere",
        "Equipping an item no longer opens its settings"
      ],
      fixes: [
        "Accessory scaling keeps the attach point",
        "Adjusted accessories of your avatar stay adjusted after a respawn",
        "Ending effect, claps and voices scale with the model"
      ]
    },
    {
      date: "2026-11-19",
      title: "The scene library",
      blurb: "308 scenes in 15 categories, with previews, favorites, scenes for three and a second bot.",
      new: [
        "308 imported scenes in 15 categories, shown as pictures of the two characters",
        "Star a scene to keep it first in your list",
        "Scenes for three: a third character, or a second bot",
        "Male characters stand 1 stud behind in imported scenes",
        "Soft bodies react to hands and to movement",
        "Grab tool: raise an arm and hold things with the mouse",
        "Pick the colour of a worn model"
      ],
      tweaks: [
        "Camera movement no longer depends on the frame rate"
      ],
      fixes: [
        "Studio no longer freezes: the scene library does not live in the workspace anymore"
      ]
    }
  ]
};
