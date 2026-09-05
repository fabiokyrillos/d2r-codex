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

import { hasSkillPages } from "@/lib/skills";
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
 *
 * For the Amazon this map does a second job, and it is the reason there are
 * eight Amazon builds on this site rather than fifteen. "Javazon", "Bowazon",
 * "Spearazon" and "Strafezon" are not builds — they are what players call
 * families of builds, and a page per name would have published the same
 * character several times over with its gear advice split between the copies.
 * The same applies to skills that are components rather than builds: Charged
 * Strike is the single-target half of two javelin builds, Guided Arrow is the
 * single-target half of four bow builds, and Plague Javelin is one of two
 * skills on the poison page. Each of those names is an alias here and resolves
 * to the canonical build; none of them is a route.
 *
 * `scripts/search-aliases.test.ts` asserts both halves of that: every alias
 * below finds its build in both locales, and no alias has become a page.
 */
export const NICKNAMES: Record<string, string> = {
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

  // --- Amazon builds, and the family names that are not builds -------------
  "lightning-fury-amazon":
    "javazon jav zon lightning fury lf charged strike cs javelin lanceira raio zonzon",
  "lightning-strike-amazon":
    "charged strike cs lightning strike ls melee javazon spearazon javelin lanceira corpo a corpo",
  "strafe-amazon":
    "strafezon bowazon strafe zon guided arrow ga arqueira arco fisica physical",
  "multiple-shot-amazon":
    "bowazon multishot multiple shot ms guided arrow ga zon arqueira cone",
  "freezing-arrow-amazon":
    "bowazon freezezon freezing arrow fa guided arrow ga mavina mavinas ice bow arqueira frio gelo",
  "exploding-arrow-amazon":
    "bowazon exploding arrow ea immolation arrow ia guided arrow ga fire bow arqueira fogo",
  "poison-javelin-amazon":
    "plague javelin poisonzon poison javelin pj javazon veneno peste",
  "jab-fend-amazon":
    "spearazon fendazon jabazon jab fend impale spear lanceira lanca",

  /*
   * --- Druid builds, and the names that are not builds ---------------------
   *
   * The Druid's seven builds are each known by more names than any other
   * class's, because the community names them after the skill, the tree, the
   * animal and the weather in roughly equal measure. "Windy Druid" and "Tornado
   * Druid" are the same character; so are "Fissure Druid", "Fire Druid" and the
   * Armageddon-first point order that some guides give its own name; so are
   * "Flamebear", "Fire Claws Werewolf" and "Werewolf Armageddon", which are one
   * page with a form variant and a hybrid note rather than three builds.
   *
   * Deliberately absent:
   *   "wind"      one syllable that matches Windforce, Widowmaker and
   *               Windhammer before it matches a build
   *   "fogo"      "fire" in Portuguese, which collides with the fire tree, the
   *               Fire Golem, Flame Rift and half the runeword list
   *   "elemental" the tree, not a build, and both of these live in it
   */
  "wind-druid":
    "windy druid tornado druid windmaster wind elemental tornado hurricane furacao vento tempestade",
  "fire-druid":
    "fissure druid fire elemental volcanic elementalist armageddon druid fissure volcano fissura vulcao",
  "fury-druid":
    "werewolf druid fury werewolf wolf druid lobisomem lobo furia licantropia shapeshifter shifter",
  "summon-druid":
    "summoner druid beastmaster grizzly bear wolves ravens invocador urso lobos corvos convocacao",
  "maul-druid":
    "werebear druid maul werebear bear druid shockwave shock wave urso ursao pancada onda de choque",
  "fire-claws-druid":
    "flamebear fire claws werebear fire claws werewolf werewolf armageddon garras de fogo garras flamejantes",
  "rabies-druid":
    "rabies wolf raiva lobo raivoso veneno contagio contagious poison werewolf poison druid",

  /*
   * --- Assassin builds ------------------------------------------------------
   *
   * "trapsin" and "trapper" both resolve here rather than to the fire build,
   * because they are what players type when they mean this one — the fire
   * version is always qualified in practice. "ls" and "ds" are deliberately
   * absent: two-letter tokens match half the item list.
   */
  "lightning-trapsin":
    "trapsin trapper lightsin lightning sentry death sentry trap assassin armadilha armadilheira raio sentinela",

  /*
   * --- Necromancer builds, and the names that are not builds ---------------
   *
   * Same job as the Amazon block above, and a heavier one: the Necromancer has
   * more community nicknames per build than any class on this site. Fishymancer
   * alone would justify the mechanism — it is what most players type, it names
   * the Summoner, and there is no page by that name anywhere.
   *
   * Deliberately absent, because they collide rather than resolve:
   *   "ce"         Corpse Explosion, but also a two-letter substring of dozens
   *                of item and area names
   *   "osso"       "bone" in Portuguese, which would match Bone, Bone Spear,
   *                Bone Spirit, Bone Armor and the runeword at once
   *   "veneno"     the same problem for poison, across two builds and a tree
   *   "exercito"   what a reader calls the army, not what they call the build
   *   "esqueletos" ditto
   * A nickname earns a place here by identifying ONE canonical page. A word
   * that describes a family belongs in the article prose, where a search hit
   * lands on something that explains the difference.
   */
  "summoner-necromancer":
    "fishymancer summonmancer skeletonmancer skelemancer skeleton summoner summon necro necro invocador raise skeleton skeleton mastery",
  "poison-nova-necromancer":
    "poisonmancer novamancer pnova poison nova trangs trang oul trang ouls",
  "bone-spear-necromancer":
    "bonemancer bone spirit bonespirit teeth bone spear magic damage dano magico",

  // --- Necromancer items and runewords -------------------------------------
  homunculus: "homun necro head shrunken head",
  "deaths-web": "deaths web dweb poison wand",
  "arm-of-king-leoric": "leoric arm akl summon wand",
  white: "white wand runeword bone necro",
  splendor: "splendor shield escudo runeword",
  bone: "bone armor runeword necro",

  // --- Amazon items --------------------------------------------------------
  "titans-revenge": "titans titan javelin",
  thunderstroke: "tstroke stroke javelin",
  windforce: "wf bow",
  "buriza-do-kyanon": "buriza burizza crossbow pierce",
  widowmaker: "widow bow",
  eaglehorn: "eagle bow",
  razortail: "razor pierce belt cinto",
  "thundergods-vigor": "tgods thundergod belt cinto",
  "andariels-visage": "andys andariels visage helm elmo",
  "the-cats-eye": "cats eye cat amulet amuleto",
  "atmas-scarab": "atmas atma amp damage amplify amulet amuleto",
  waterwalk: "ww boots botas",
  "bone-break": "sunder physical fisico charm",
  "crack-of-the-heavens": "coth sunder lightning raio charm",
  "cold-rupture": "sunder cold frio charm",
  "flame-rift": "sunder fire fogo charm",
  "rotting-fissure": "sunder poison veneno charm",
  harmony: "vigor bow runeword",
  ice: "ice bow runeword frio",
  wrath: "wrath bow runeword decrepify",
  melody: "melody bow runeword",
  edge: "edge bow runeword thorns",
  peace: "peace armor runeword valkyrie",
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
      h: hasSkillPages(s.classSlug)
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
