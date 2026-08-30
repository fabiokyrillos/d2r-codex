/**
 * Search types and the scoring function.
 *
 * This module is deliberately **dependency-free**. It is the only part of the
 * search system the client bundle is allowed to see: the index itself is built
 * on the server (`./index.ts`, which pulls in the whole content tree) and
 * fetched as JSON at runtime.
 *
 * Keeping the split explicit matters — the first version imported the registry
 * transitively into the client component and the build refused it, correctly.
 */

export const SEARCH_KINDS = [
  "class",
  "build",
  "leveling",
  "runeword",
  "rune",
  "item",
  "area",
  "skill",
  "mechanic",
  "mercenary",
  "breakpoints",
  "page",
] as const;
export type SearchKind = (typeof SEARCH_KINDS)[number];

export interface SearchEntry {
  /** Display name. */
  n: string;
  /** Href, already locale-prefixed. */
  h: string;
  /** Kind, for the result badge and grouping. */
  k: SearchKind;
  /** One-line description. */
  d: string;
  /** Extra searchable terms, space-joined and lowercased. */
  t: string;
}

/**
 * Folds case and strips diacritics before comparison.
 *
 * Brazilian players routinely type without accents — "tuneis" for "Túneis",
 * "experiencia" for "experiência" — and an accent-sensitive search would simply
 * return nothing for them. Folding both sides makes accents optional rather
 * than required.
 */
export function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/**
 * Scoring search.
 *
 * Deliberately simple and dependency-free. Ranking priority:
 * exact name match > name prefix > name substring > keyword hit > description
 * hit. Multi-word queries require every term to match somewhere.
 */
export function searchEntries(
  query: string,
  index: SearchEntry[],
  limit = 30,
): SearchEntry[] {
  const q = fold(query.trim());
  if (q.length < 2) return [];

  const terms = q.split(/\s+/).filter(Boolean);
  const scored: { entry: SearchEntry; score: number }[] = [];

  for (const entry of index) {
    const name = fold(entry.n);
    const desc = fold(entry.d);
    const keywords = fold(entry.t);
    let total = 0;
    let allMatched = true;

    for (const term of terms) {
      let best = 0;
      if (name === term) best = 1000;
      else if (name.startsWith(term)) best = 500;
      else if (name.includes(term)) best = 250;
      else if (keywords.includes(term)) best = 120;
      else if (desc.includes(term)) best = 40;

      if (best === 0) {
        allMatched = false;
        break;
      }
      total += best;
    }

    if (!allMatched) continue;

    // Prefer shorter names on equal footing.
    total -= Math.min(name.length, 40);
    scored.push({ entry, score: total });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}
