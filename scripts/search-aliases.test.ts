/**
 * The search index is the only place the alias decision is visible to a reader.
 *
 * There is no page called Javazon, Bowazon, Spearazon or Strafezon, and there
 * is none called Charged Strike, Guided Arrow or Plague Javelin either — the
 * first four are family names, the last three are components of builds. That is
 * a deliberate editorial position and it is worth exactly nothing if a player
 * types "javazon" and gets no build back. So this asserts both halves:
 *
 *   1. Every alias finds its canonical build, in BOTH locales, through the real
 *      index and the real scorer rather than by inspecting the nickname map.
 *   2. No alias has quietly become a page — `check:content` owns that rule and
 *      this file proves the rule is wired to the thing readers actually use.
 *
 * The second half matters more than it looks. An alias that becomes a page does
 * not break anything: the site builds, the links resolve, and the same
 * character is published twice with its gear advice split between the copies.
 * Nothing but a check notices that.
 *
 * Needs no build and no network. Run with `npm run test:search`.
 */
import { NICKNAMES, buildSearchIndex } from "../lib/search";
import { searchEntries, type SearchEntry } from "../lib/search/scoring";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { getBuilds } from "../lib/registry";
import { ALIAS_ONLY_NAMES, checkAliasesAreNotPages } from "./amazon-rules";

let passed = 0;
const failures: string[] = [];
const check = (name: string, ok: boolean, detail = "") => {
  if (ok) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

/**
 * What a player types, and the page they must land on.
 *
 * Family names and shorthand only. Skill names are deliberately absent: typing
 * "charged strike" should return the *skill page* first, because that is an
 * exact name match and that page exists — the build is expected further down
 * the same list, which the second block below asserts separately.
 */
const ALIASES: Record<string, string> = {
  javazon: "lightning-fury-amazon",
  "lightning fury": "lightning-fury-amazon",
  bowazon: "strafe-amazon",
  strafezon: "strafe-amazon",
  multishot: "multiple-shot-amazon",
  spearazon: "jab-fend-amazon",
  fendazon: "jab-fend-amazon",
  poisonzon: "poison-javelin-amazon",
  freezezon: "freezing-arrow-amazon",
  mavinas: "freezing-arrow-amazon",

  // Necromancer. Five names for the Summoner, and "fishymancer" is the one
  // most players actually type — there is no page anywhere by that name.
  fishymancer: "summoner-necromancer",
  summonmancer: "summoner-necromancer",
  skeletonmancer: "summoner-necromancer",
  skelemancer: "summoner-necromancer",
  "skeleton summoner": "summoner-necromancer",
  "summon necro": "summoner-necromancer",
  "necro invocador": "summoner-necromancer",
  poisonmancer: "poison-nova-necromancer",
  novamancer: "poison-nova-necromancer",
  pnova: "poison-nova-necromancer",
  // Trang-Oul's is an equipment variant of the Poison Nova build, not a build.
  trangs: "poison-nova-necromancer",
  "trang oul": "poison-nova-necromancer",
  bonemancer: "bone-spear-necromancer",
  bonespirit: "bone-spear-necromancer",
};

/**
 * Component names. Each of these is a skill with its own page, so the skill
 * page is expected to rank first — what matters is that **every build that
 * maxes it** is also in the results, because the alternative to that is one
 * page per skill and this site has decided against it.
 */
const COMPONENT_ALIASES: Record<string, string[]> = {
  "charged strike": ["lightning-fury-amazon", "lightning-strike-amazon"],
  "guided arrow": [
    "strafe-amazon",
    "multiple-shot-amazon",
    "freezing-arrow-amazon",
    "exploding-arrow-amazon",
  ],
  "plague javelin": ["poison-javelin-amazon"],

  /*
   * Necromancer components. Each of these is a skill with a page, so the skill
   * page ranks first and that is correct — what matters is that the build which
   * maxes it is also in the results.
   *
   * "Bone Spirit" is the clearest case on the site: it is a twenty-point skill
   * in the Bone Spear plan and one of the two attacks that page is about, and
   * every guide that gives it a page of its own publishes the same hundred
   * points twice. "Teeth" is the same argument at the other end — a synergy
   * nobody casts past level 10.
   */
  "bone spirit": ["bone-spear-necromancer"],
  teeth: ["bone-spear-necromancer"],
  "poison nova": ["poison-nova-necromancer"],
  // The two that max it. The Bone Spear page takes one point and says why, so
  // it is not on this list — this rule is about builds a search for the skill
  // must surface, not about every page that mentions it.
  "corpse explosion": ["summoner-necromancer", "poison-nova-necromancer"],
};

const indexes = new Map<Locale, SearchEntry[]>(
  LOCALES.map((locale) => [locale, buildSearchIndex(locale)] as const),
);

const buildsIn = (results: SearchEntry[]) => results.filter((r) => r.k === "build");

// ---------------------------------------------------------------------------
console.log("\nAliases resolve to their canonical build, in both locales");
// ---------------------------------------------------------------------------
for (const locale of LOCALES) {
  const index = indexes.get(locale)!;
  const hrefFor = (slug: string) => {
    const build = getBuilds(locale).find((b) => b.slug === slug);
    if (!build) throw new Error(`no build "${slug}"`);
    return `/${locale}/builds/${build.classSlug}/${build.slug}`;
  };

  for (const [alias, slug] of Object.entries(ALIASES)) {
    const results = searchEntries(alias, index);
    const builds = buildsIn(results);
    check(
      `${locale}: "${alias}" -> ${slug}`,
      builds.length > 0 && builds[0].h === hrefFor(slug),
      builds.length === 0
        ? "no build in the results at all"
        : `first build was ${builds[0].h}`,
    );
  }

  for (const [alias, slugs] of Object.entries(COMPONENT_ALIASES)) {
    const results = searchEntries(alias, index);
    const missing = slugs.filter((slug) => !results.some((r) => r.h === hrefFor(slug)));
    check(
      `${locale}: "${alias}" reaches all ${slugs.length} build(s) that max it`,
      missing.length === 0,
      `missing ${missing.join(", ")} — got ${results
        .slice(0, 8)
        .map((r) => r.k + ":" + r.n)
        .join(", ")}`,
    );
  }
}

// ---------------------------------------------------------------------------
console.log("\nEvery build is reachable by its own name");
// ---------------------------------------------------------------------------
/*
 * Widened from "every Amazon build" by the Necromancer pass. The narrower
 * version was the class-scoped shape the Amazon pass used for its completeness
 * contract, and it made sense there — but this assertion costs nothing to run
 * over the whole catalogue and there is no version of it that should fail.
 */
for (const locale of LOCALES) {
  const index = indexes.get(locale)!;
  for (const build of getBuilds(locale)) {
    const results = searchEntries(build.name, index);
    check(
      `${locale}: "${build.name}" is found`,
      results.some((r) => r.h.endsWith(`/builds/${build.classSlug}/${build.slug}`)),
      results.slice(0, 3).map((r) => r.n).join(", "),
    );
  }
}

// ---------------------------------------------------------------------------
console.log("\nA negative control: the scorer is capable of returning nothing");
// ---------------------------------------------------------------------------
{
  const index = indexes.get("en-us")!;
  // If this returned results, every assertion above would be vacuous.
  check(
    "a nonsense query returns no results",
    searchEntries("qzxwvnonsenseqzxwv", index).length === 0,
  );
  check(
    "a one-character query is rejected before scoring",
    searchEntries("j", index).length === 0,
  );
  // And a control in the other direction: an alias that is NOT in the map does
  // not accidentally resolve, which is what proves the map is doing the work.
  check(
    'an unregistered nickname ("hammerzon") finds no build',
    buildsIn(searchEntries("hammerzon", index)).length === 0,
    buildsIn(searchEntries("hammerzon", index)).map((r) => r.n).join(", "),
  );
}

// ---------------------------------------------------------------------------
console.log("\nThe words deliberately left out of the nickname map");
// ---------------------------------------------------------------------------

/*
 * A nickname earns a place in the map by identifying ONE canonical page. These
 * five were considered for the Necromancer builds and rejected because each
 * names a family rather than a build.
 *
 * "ce" is the worst of them: two letters, and a substring of enough names that
 * it would attach a build to queries with nothing to do with Corpse Explosion.
 * "osso", "veneno" and "esqueletos" each describe a tree or a minion type
 * rather than one page.
 *
 * **This checks the map, not the scorer, and the distinction is the point.** A
 * Portuguese reader typing "veneno" does and should get the Poison Nova build
 * somewhere in the results — its own summary contains the word, and a
 * description hit scores 40 against a name match's 1000. What must not happen
 * is that word being *registered as an alias*, which would rank it as though
 * it named that page. The first draft of this control asserted the search
 * result instead and failed on exactly that legitimate description hit.
 */
{
  const rejected = ["ce", "osso", "veneno", "exercito", "esqueletos"];
  const necromancerBuilds = getBuilds("en-us")
    .filter((b) => b.classSlug === "necromancer")
    .map((b) => b.slug);

  for (const slug of necromancerBuilds) {
    const terms = (NICKNAMES[slug] ?? "").split(/\s+/).filter(Boolean);
    const collisions = rejected.filter((word) => terms.includes(word));
    check(
      `${slug}: no over-broad word is registered as an alias`,
      collisions.length === 0,
      collisions.join(", "),
    );
  }

  // Anti-vacuity, in both directions: the probe reads a real map, and it would
  // catch one of these words if a later author added it.
  check(
    "control: the map really does carry the aliases this file asserts",
    (NICKNAMES["summoner-necromancer"] ?? "").split(/\s+/).includes("fishymancer"),
  );
  check(
    "control: adding an over-broad word would be caught",
    rejected.filter((w) => `${NICKNAMES["bone-spear-necromancer"]} osso`.split(/\s+/).includes(w))
      .length === 1,
  );
}

// ---------------------------------------------------------------------------
console.log("\nNo alias has become a page");
// ---------------------------------------------------------------------------
{
  const builds = getBuilds("en-us");
  check(
    "the shipped build list contains no alias-named build",
    checkAliasesAreNotPages(builds, ALIAS_ONLY_NAMES).length === 0,
    JSON.stringify(checkAliasesAreNotPages(builds, ALIAS_ONLY_NAMES).map((p) => p.message)),
  );
  // Planted: the exact regression this whole arrangement exists to prevent.
  for (const planted of [
    { slug: "javazon", name: "Javazon" },
    { slug: "bowazon-amazon", name: "Bowazon" },
    { slug: "charged-strike-amazon", name: "Charged Strike Amazon" },
    { slug: "plague-javelin-amazon", name: "Plague Javelin Amazon" },
  ]) {
    const found = checkAliasesAreNotPages([...builds, planted], ALIAS_ONLY_NAMES);
    check(
      `publishing "${planted.name}" as a build is caught`,
      found.length === 1 && found[0].rule === "alias-became-a-page",
      JSON.stringify(found),
    );
  }
}

// ---------------------------------------------------------------------------
console.log(
  failures.length === 0
    ? `\n${passed} checks passed across ${LOCALES.length} locales.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
