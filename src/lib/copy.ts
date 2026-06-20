export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export const REDIRECT_HEADLINES = [
  "Taking you somewhere good.",
  "Hold on, portal opening...",
  "Buckle up.",
  "Engaging hyperdrive.",
  "One moment.",
  "Loading the internet...",
  "Almost there.",
  "Don't touch anything.",
  "Teleporting...",
  "Calculating shortest path.",
  "You're being redirected. Probably.",
  "Please do not panic.",
  "This link goes brrr.",
  "Warming up the engines.",
  "Traveling at the speed of HTTP.",
  "No turning back now.",
  "Initiating warp sequence.",
  "Just trust the process.",
  "Getting you out of here.",
  "Off you go.",
];

export const NOT_FOUND_HEADLINES = [
  "Lost in redirect.",
  "Dead end.",
  "This shortcut doesn't exist.",
  "404: link not found.",
  "Where did you even get this URL?",
  "This one got away.",
  "Nothing to see here.",
  "The link has left the building.",
  "You've reached the edge of the map.",
  "This redirect was never meant to be.",
  "Wrong turn.",
  "Even the void doesn't know this path.",
];
