import * as levenshtein from "./index.js";

export function distance(a: string, b: string): number {
  return levenshtein.distance(a, b);
}

export function closest(a: string, b: string[]): number {
  return levenshtein.closest(a, b);
}
