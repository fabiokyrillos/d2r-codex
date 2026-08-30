/**
 * The single place the site records which version of the game it documents.
 *
 * Every page that makes a version-sensitive claim reads from here, so a patch
 * bump is one edit rather than a search-and-replace across the content tree.
 * See `docs/research/00-game-state.md` for the sourcing behind these values.
 */
export const GAME_VERSION = {
  patch: "3.3",
  clientBuild: "1.39",
  season: 15,
  seasonStart: "2026-08-21",
  expansion: "Reign of the Warlock",
  verifiedOn: "2026-08-30",
} as const;

/** Classes gated behind a paid expansion, so the UI can warn readers. */
export const DLC_CLASSES = ["warlock"] as const;
