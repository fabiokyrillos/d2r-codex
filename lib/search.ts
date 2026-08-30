import {
  getBreakpointTables,
  getBuilds,
  getClasses,
  getFarmingAreas,
  getJourneys,
  getMechanics,
  getMercenaries,
  getRunes,
  getRunewords,
  getSkills,
  getUniques,
} from "@/lib/registry";

/**
 * The search index.
 *
 * Built once at module load from the registry, serialised into the page, and
 * searched entirely on the client. With a few hundred entities this is a few
 * tens of kilobytes — far cheaper than a search API, and it works offline.
 *
 * `keywords` carries the terms people actually type that do not appear in the
 * name: "shako" for Harlequin Crest, "hoto" for Heart of the Oak, "alvl 85"
 * for a top-tier farming area.
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
  /** Href. */
  h: string;
  /** Kind, for the result badge and grouping. */
  k: SearchKind;
  /** One-line description. */
  d: string;
  /** Extra searchable terms, space-joined and lowercased. */
  t: string;
}

export const searchKindLabels: Record<SearchKind, string> = {
  class: "Class",
  build: "Build",
  leveling: "Leveling",
  runeword: "Runeword",
  rune: "Rune",
  item: "Item",
  area: "Farming",
  skill: "Skill",
  mechanic: "Mechanic",
  mercenary: "Mercenary",
  breakpoints: "Breakpoints",
  page: "Page",
};

/**
 * Common abbreviations and nicknames. These are what players actually type,
 * and none of them appear in the item's own name.
 */
const NICKNAMES: Record<string, string> = {
  "harlequin-crest": "shako harly",
  "heart-of-the-oak": "hoto",
  "chains-of-honor": "coh",
  "call-to-arms": "cta battle orders bo",
  "stone-of-jordan": "soj",
  "maras-kaleidoscope": "mara",
  "skin-of-the-vipermagi": "viper vipermagi",
  "arachnid-mesh": "arach spider",
  "herald-of-zakarum": "hoz zak",
  "ancients-pledge": "ap",
  "deaths-fathom": "df fathom",
  "nightwings-veil": "nightwing spired",
  "the-oculus": "occy ocy",
  "war-traveler": "wt travs",
  "sandstorm-trek": "trek treks",
  "blizzard-sorceress": "blizz sorc blizzsorc mf",
  hammerdin: "hdin blessed hammer paladin",
  "chaos-sanctuary": "chaos cs diablo",
  "worldstone-keep": "wsk baal throne",
  travincal: "trav council",
  "lower-kurast": "lk chests superchest",
  "ancient-tunnels": "at",
  pindleskin: "pindle",
  mephisto: "meph moat",
  countess: "tower cellar",
  pit: "the pit tamoe",
};

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const c of getClasses()) {
    entries.push({
      n: c.name,
      h: `/classes/${c.slug}`,
      k: "class",
      d: c.summary,
      t: `${c.slug} ${c.bestFor} ${c.requiresDlc ?? ""}`.toLowerCase(),
    });
  }

  for (const b of getBuilds()) {
    entries.push({
      n: b.name,
      h: `/builds/${b.classSlug}/${b.slug}`,
      k: "build",
      d: b.summary,
      t: `${b.slug} ${b.classSlug} ${b.damageTypes.join(" ")} ${NICKNAMES[b.slug] ?? ""}`.toLowerCase(),
    });
  }

  for (const j of getJourneys()) {
    const cls = getClasses().find((c) => c.slug === j.classSlug);
    entries.push({
      n: `${cls?.name ?? j.classSlug} leveling guide`,
      h: `/leveling/${j.classSlug}`,
      k: "leveling",
      d: j.summary,
      t: `${j.classSlug} walkthrough level 1 progression respec`,
    });
  }

  for (const rw of getRunewords()) {
    entries.push({
      n: rw.name,
      h: `/runewords/${rw.slug}`,
      k: "runeword",
      d: rw.summary,
      t: `${rw.runes.join(" ")} ${rw.sockets} socket ${rw.bases.display} ${NICKNAMES[rw.slug] ?? ""}`.toLowerCase(),
    });
  }

  for (const r of getRunes()) {
    entries.push({
      n: `${r.name} Rune`,
      h: `/runes/${r.slug}`,
      k: "rune",
      d: r.summary,
      t: `rune ${r.number} ${r.weaponMod} ${r.armorMod} ${r.shieldMod}`.toLowerCase(),
    });
  }

  for (const i of getUniques()) {
    entries.push({
      n: i.name,
      h: `/items/${i.slug}`,
      k: "item",
      d: i.summary,
      t: `${i.base} ${i.category} ${i.quality} ${NICKNAMES[i.slug] ?? ""} ${i.stats
        .filter((s) => s.notable)
        .map((s) => s.text)
        .join(" ")}`.toLowerCase(),
    });
  }

  for (const a of getFarmingAreas()) {
    entries.push({
      n: a.name,
      h: `/farming/${a.slug}`,
      k: "area",
      d: a.summary,
      t: `act ${a.act} ${a.targets.join(" ")} ${a.hellLevel85 ? "alvl 85 area level 85" : ""} ${NICKNAMES[a.slug] ?? ""}`.toLowerCase(),
    });
  }

  // Skills link to their class page rather than getting their own route —
  // the class page renders each tree with its skills inline.
  for (const s of getSkills()) {
    entries.push({
      n: s.name,
      h: `/classes/${s.classSlug}#skills`,
      k: "skill",
      d: s.summary,
      t: `${s.classSlug} ${s.tree} ${s.kind} level ${s.requiredLevel} ${s.element ?? ""}`.toLowerCase(),
    });
  }

  for (const m of getMechanics()) {
    // Headings and callout titles carry the terms readers actually search for
    // ("sunder charm", "diminishing returns") without inflating the index the
    // way indexing full article bodies would.
    const structural = m.body
      .map((b) =>
        b.type === "heading"
          ? b.text
          : b.type === "callout"
            ? (b.title ?? "")
            : b.type === "list"
              ? b.items.join(" ")
              : "",
      )
      .join(" ");
    entries.push({
      n: m.name,
      h: `/mechanics/${m.slug}`,
      k: "mechanic",
      d: m.summary,
      t: `${m.category} ${m.keyFacts.join(" ")} ${structural}`.toLowerCase(),
    });
  }

  for (const m of getMercenaries()) {
    entries.push({
      n: m.name,
      h: `/mercenaries#${m.slug}`,
      k: "mercenary",
      d: m.summary,
      t: `act ${m.act} merc hireling ${m.abilities.map((a) => a.name).join(" ")}`.toLowerCase(),
    });
  }

  for (const t of getBreakpointTables()) {
    entries.push({
      n: t.name,
      h: `/breakpoints#${t.stat}`,
      k: "breakpoints",
      d: t.summary,
      t: `${t.stat} breakpoint frames ${t.classSlug ?? ""} ${t.variant ?? ""} faster cast rate hit recovery block`.toLowerCase(),
    });
  }

  const staticPages: [string, string, string, string][] = [
    ["Classes", "/classes", "All eight playable classes.", "roster warlock"],
    ["Builds", "/builds", "Build guides with six-tier gear progression.", ""],
    ["Leveling", "/leveling", "Level 1 to Hell walkthroughs and difficulty transitions.", "quest rewards resistance penalty"],
    ["Farming", "/farming", "Where to farm, with area levels from the game data.", "magic find runs"],
    ["Runewords", "/runewords", "Every runeword with socket counts and base rules.", ""],
    ["Runes", "/runes", "All 33 runes and their cube recipes.", "upgrade recipe"],
    ["Items", "/items", "Unique items with verified roll ranges.", "uniques"],
    ["Breakpoints", "/breakpoints", "FCR, FHR and FBR tables for every class.", "fcr fhr fbr frames"],
    ["Mercenaries", "/mercenaries", "Which mercenary to hire and what to give them.", "merc hireling act 2"],
    ["Game mechanics", "/mechanics", "Verified explanations of the systems underneath.", ""],
    ["Sources & research", "/about/sources", "Where the numbers come from and what is unverified.", "accuracy verification"],
  ];
  for (const [n, h, d, t] of staticPages) {
    entries.push({ n, h, k: "page", d, t });
  }

  return entries;
}

export const searchIndex: SearchEntry[] = buildIndex();

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
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const scored: { entry: SearchEntry; score: number }[] = [];

  for (const entry of index) {
    const name = entry.n.toLowerCase();
    const desc = entry.d.toLowerCase();
    let total = 0;
    let allMatched = true;

    for (const term of terms) {
      let best = 0;
      if (name === term) best = 1000;
      else if (name.startsWith(term)) best = 500;
      else if (name.includes(term)) best = 250;
      else if (entry.t.includes(term)) best = 120;
      else if (desc.includes(term)) best = 40;

      if (best === 0) {
        allMatched = false;
        break;
      }
      total += best;
    }

    if (!allMatched) continue;

    // Prefer shorter names on equal footing — "Lore" should beat
    // "Lore of the Something" for the query "lore".
    total -= Math.min(name.length, 40);
    scored.push({ entry, score: total });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}
