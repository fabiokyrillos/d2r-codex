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
import { dictionaryFor, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";

/** Classes whose skills have individual pages. Mirrors the skill route. */
const CLASSES_WITH_SKILL_PAGES = new Set(["paladin"]);
import type { SearchEntry } from "./scoring";

export * from "./scoring";

/**
 * Builds the search index for one locale.
 *
 * Names, descriptions and hrefs all come from the active locale, so searching
 * in Portuguese returns Portuguese results pointing at Portuguese pages. The
 * result is emitted as a static JSON file per locale
 * (`/pt-br/search-index.json`) and fetched lazily the first time the dialog
 * opens, so pages carry none of its weight.
 *
 * This module pulls in the entire content tree and must never be imported by a
 * Client Component — `./scoring` exists for that.
 */

/**
 * Common abbreviations and nicknames — what players actually type, none of
 * which appears in the item's own name. Deliberately *not* translated: Brazilian
 * players use the same English shorthand, so the pt-BR entries are a superset
 * rather than a replacement.
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
  hammerdin: "hdin blessed hammer paladin martelo",
  "chaos-sanctuary": "chaos cs diablo santuario",
  "worldstone-keep": "wsk baal throne trono",
  travincal: "trav council conselho",
  "lower-kurast": "lk chests superchest baus",
  "ancient-tunnels": "at tuneis",
  pindleskin: "pindle",
  mephisto: "meph moat fosso",
  countess: "tower cellar condessa torre",
  pit: "the pit tamoe",
  "secret-cow-level": "cow vacas vaca moo",
  "kurast-temples": "templos temples",
  nihlathak: "nihl",
  "river-of-flame": "rio de fogo hellforge",
};

/** Locale-specific extra terms for the static section pages. */
const PAGE_KEYWORDS: Record<Locale, Record<string, string>> = {
  "en-us": {
    classes: "roster warlock",
    leveling: "quest rewards resistance penalty",
    farming: "magic find runs",
    runes: "upgrade recipe",
    items: "uniques",
    breakpoints: "fcr fhr fbr frames",
    mercenaries: "merc hireling act 2",
    sources: "accuracy verification",
  },
  "pt-br": {
    classes: "elenco classes warlock roster",
    leveling: "evolucao subir nivel recompensas quest penalidade resistencia leveling",
    farming: "magic find runs farmar farm",
    runes: "receita upgrade cubo runas",
    items: "uniques itens unicos",
    breakpoints: "fcr fhr fbr frames breakpoint",
    mercenaries: "merc mercenario ato 2 contratado",
    sources: "precisao verificacao fontes",
  },
};

export function buildSearchIndex(locale: Locale): SearchEntry[] {
  const t = dictionaryFor(locale);
  const r = routes(locale);
  const kw = PAGE_KEYWORDS[locale];
  const entries: SearchEntry[] = [];

  for (const c of getClasses(locale)) {
    entries.push({
      n: c.name,
      h: r.class(c.slug),
      k: "class",
      d: c.summary,
      t: `${c.slug} ${c.bestFor} ${c.requiresDlc ?? ""}`.toLowerCase(),
    });
  }

  for (const b of getBuilds(locale)) {
    entries.push({
      n: b.name,
      h: r.build(b.classSlug, b.slug),
      k: "build",
      d: b.summary,
      t: `${b.slug} ${b.classSlug} ${b.damageTypes.join(" ")} ${NICKNAMES[b.slug] ?? ""}`.toLowerCase(),
    });
  }

  for (const j of getJourneys(locale)) {
    const cls = getClasses(locale).find((c) => c.slug === j.classSlug);
    entries.push({
      n: `${cls?.name ?? j.classSlug} — ${t.nav.leveling}`,
      h: r.levelingFor(j.classSlug),
      k: "leveling",
      d: j.summary,
      t: `${j.classSlug} ${kw.leveling}`,
    });
  }

  for (const rw of getRunewords(locale)) {
    entries.push({
      n: rw.name,
      h: r.runeword(rw.slug),
      k: "runeword",
      d: rw.summary,
      t: `${rw.runes.join(" ")} ${rw.sockets} socket ${rw.bases.display} ${NICKNAMES[rw.slug] ?? ""}`.toLowerCase(),
    });
  }

  for (const rune of getRunes(locale)) {
    entries.push({
      n: `${rune.name} ${t.searchKinds.rune}`,
      h: r.rune(rune.slug),
      k: "rune",
      d: rune.summary,
      t: `rune runa ${rune.number} ${rune.weaponMod} ${rune.armorMod} ${rune.shieldMod}`.toLowerCase(),
    });
  }

  for (const i of getUniques(locale)) {
    entries.push({
      n: i.name,
      h: r.item(i.slug),
      k: "item",
      d: i.summary,
      t: `${i.base} ${i.category} ${i.quality} ${NICKNAMES[i.slug] ?? ""} ${i.stats
        .filter((s) => s.notable)
        .map((s) => s.text)
        .join(" ")}`.toLowerCase(),
    });
  }

  for (const a of getFarmingAreas(locale)) {
    entries.push({
      n: a.name,
      h: r.farmingArea(a.slug),
      k: "area",
      d: a.summary,
      t: `act ato ${a.act} ${a.targets.join(" ")} ${
        a.hellLevel85 ? "alvl 85 area level 85 nivel de area 85" : ""
      } ${NICKNAMES[a.slug] ?? ""}`.toLowerCase(),
    });
  }

  // Skills with their own page link to it; the rest still point at their
  // class page's tree section, which is where they are documented.
  for (const s of getSkills(locale)) {
    entries.push({
      n: s.name,
      h: CLASSES_WITH_SKILL_PAGES.has(s.classSlug)
        ? r.skill(s.classSlug, s.slug)
        : r.classSkills(s.classSlug),
      k: "skill",
      d: s.summary,
      t: `${s.classSlug} ${s.tree} ${s.kind} level nivel ${s.requiredLevel} ${s.element ?? ""}`.toLowerCase(),
    });
  }

  for (const m of getMechanics(locale)) {
    // Headings, list items and callout titles carry the terms readers actually
    // search for without inflating the index the way full article bodies would.
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
      h: r.mechanic(m.slug),
      k: "mechanic",
      d: m.summary,
      t: `${m.category} ${m.keyFacts.join(" ")} ${structural}`.toLowerCase(),
    });
  }

  for (const m of getMercenaries(locale)) {
    entries.push({
      n: m.name,
      h: r.mercenary(m.slug),
      k: "mercenary",
      d: m.summary,
      t: `act ato ${m.act} merc mercenario ${m.abilities.map((a) => a.name).join(" ")}`.toLowerCase(),
    });
  }

  for (const table of getBreakpointTables(locale)) {
    entries.push({
      n: table.name,
      h: r.breakpointStat(table.stat),
      k: "breakpoints",
      d: table.summary,
      t: `${table.stat} ${table.classSlug ?? ""} ${table.variant ?? ""} ${kw.breakpoints}`.toLowerCase(),
    });
  }

  const staticPages: [string, string, string, string][] = [
    [t.nav.classes, r.classes(), t.classes.indexDescription, kw.classes],
    [t.nav.builds, r.builds(), t.builds.indexDescription, ""],
    [t.nav.leveling, r.leveling(), t.leveling.indexDescription, kw.leveling],
    [t.nav.farming, r.farming(), t.farming.indexDescription, kw.farming],
    [t.nav.runewords, r.runewords(), t.runewords.indexDescription, ""],
    [t.nav.runes, r.runes(), t.runes.indexDescription, kw.runes],
    [t.nav.items, r.items(), t.items.indexDescription, kw.items],
    [t.nav.breakpoints, r.breakpoints(), t.breakpoints.description, kw.breakpoints],
    [t.nav.mercenaries, r.mercenaries(), t.mercenaries.description, kw.mercenaries],
    [t.footer.mechanicsLink, r.mechanics(), t.mechanics.indexDescription, ""],
    [t.nav.sources, r.sources(), t.sources.description, kw.sources],
  ];
  for (const [n, h, d, extra] of staticPages) {
    entries.push({ n, h, k: "page", d, t: extra });
  }

  return entries;
}
