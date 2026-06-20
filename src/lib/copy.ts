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
];

export const NOT_FOUND_HEADLINES = [
  "Lost in redirect.",
  "Dead end.",
  "This shortcut doesn't exist.",
  "404: link not found.",
  "Where did you even get this URL?",
  "This one got away.",
];
