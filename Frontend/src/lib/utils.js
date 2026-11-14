import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Stable, slightly-off rotation for a paper card, derived from its id/title.
export function tiltFor(seed = "") {
  let h = 0;
  for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const tilt = ((Math.abs(h) % 7) - 3) * 0.6; // -1.8deg .. 1.8deg
  const tape = ((Math.abs(h >> 3) % 9) - 4) * 1.1; // -4.4deg .. 4.4deg
  return { "--tilt": `${tilt}deg`, "--tape": `${tape}deg` };
}

const PAPERS = ["yellow", "blue", "green", "pink", "orange", "purple", "red"];
// Same note, same paper colour, every visit.
export function colorFor(seed = "") {
  let h = 7;
  for (const ch of String(seed)) h = (h * 33 + ch.charCodeAt(0)) | 0;
  return PAPERS[Math.abs(h) % PAPERS.length];
}
