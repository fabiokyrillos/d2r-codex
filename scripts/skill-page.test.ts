/**
 * What a skill page *says* — checked against the HTML `next build` wrote.
 *
 * The damage section is here because one sentence covering every skill without
 * an elemental table shipped a falsehood: Zeal, Smite, Charge, Sacrifice,
 * Vengeance, Conversion and Static Field all told the reader they dealt no
 * direct damage. Zeal, Smite and Vengeance are the core attacks of three
 * documented builds, so the claim was wrong exactly where it mattered most.
 *
 * The dictionary alone cannot prove this. A correct set of strings wired to the
 * wrong branch reads perfectly in the dictionary and still ships the old
 * sentence, so every assertion below reads the rendered page.
 *
 * Requires `npm run build`. Run with `npm run test:page`.
 */
import { execSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve, sep } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { SLUG_OVERRIDES } from "./skill-graph-rules";

import { dictionaryFor } from "../lib/i18n";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { getSkills } from "../lib/registry";
import { SKILL_GRAPH } from "../content/classes/skill-graph";
import {
  ELEMENTAL_ATTACK_MODELS,
  damagePresentation,
  type DamagePresentation,
} from "../lib/skills";

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

/*
 * `D2R_BUILD_ROOT` points the test at a different tree of prerendered HTML.
 * It exists so a planted control can copy the build, corrupt one page and prove
 * this test fails — without editing a tracked file and without a second
 * `next build`. Unset, it is the build in the working directory.
 */
const root = assertFreshBuild();

/** Visible text only: the RSC payload legitimately carries every source string. */
const visible = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x2014;/g, "—")
    .replace(/\s+/g, " ");

const pageFor = (locale: Locale, classSlug: string, skillSlug: string) =>
  join(root, locale, "classes", classSlug, "skills", `${skillSlug}.html`);

/**
 * A short, distinctive fragment of each message, taken from the dictionary so
 * the test cannot drift from the copy — but long enough that it cannot match by
 * accident. Interpolation placeholders are stripped first.
 */
function marker(template: string): string {
  const plain = template.replace(/\{[a-z]+\}/gi, "").replace(/\s+/g, " ").trim();
  return plain.slice(0, 60);
}

const skills = getSkills("en-us");

// ===========================================================================
console.log("\nEvery skill falls into exactly one damage presentation");
// ===========================================================================
const buckets: Record<DamagePresentation, string[]> = {
  table: [],
  weapon: [],
  "weapon-plus-element": [],
  "weapon-converted-to-element": [],
  "element-only-attack": [],
  shield: [],
  proportional: [],
  "corpse-life": [],
  kick: [],
  none: [],
};
for (const s of skills) {
  const node = SKILL_GRAPH[s.slug];
  if (node) buckets[damagePresentation(s, node)].push(s.slug);
}
for (const kind of Object.keys(buckets) as DamagePresentation[]) {
  // The three elemental-attack models are only reachable once a class that
  // needs them is extracted; an empty one is scope, not a broken rule.
  if ((ELEMENTAL_ATTACK_MODELS as readonly string[]).includes(kind)) continue;
  check(
    `the "${kind}" bucket is not empty`,
    buckets[kind].length > 0,
    `${buckets[kind].length} skills`,
  );
}
/*
 * Every attack must land in one of the five attack models. Derived from the
 * content rather than listed: the previous version named six Paladin and
 * Sorceress slugs, which meant the assertion silently stopped covering the
 * attacks of any class added afterwards.
 */
const attackSlugs = skills
  .filter((s) => s.kind === "attack" && SKILL_GRAPH[s.slug])
  .map((s) => s.slug);
const attackModelled = [
  ...buckets.weapon,
  ...buckets.shield,
  // The Assassin's three kicks. Their damage is the boots', which is neither the
  // weapon nor an element, so without this the partition drops them and they
  // land on their own pages saying they deal no damage.
  ...buckets.kick,
  ...ELEMENTAL_ATTACK_MODELS.flatMap((m) => buckets[m]),
];
check(
  "the attack models cover exactly the attack skills",
  new Set(attackModelled).size === new Set(attackSlugs).size &&
    attackSlugs.every((s) => attackModelled.includes(s)),
  `modelled=[${attackModelled.join(", ")}] attacks=[${attackSlugs.join(", ")}]`,
);
check(
  "no attack resolves to two models",
  attackModelled.length === new Set(attackModelled).size,
);
check(
  "Smite is the only shield attack",
  buckets.shield.length === 1 && buckets.shield[0] === "smite",
  buckets.shield.join(", "),
);
check(
  "Static Field is the proportional skill",
  buckets.proportional.length === 1 && buckets.proportional[0] === "static-field",
  buckets.proportional.join(", "),
);
/*
 * Corpse Explosion is the only skill whose damage comes from what it explodes
 * rather than from itself. It is its own model because reusing `proportional`
 * would print Static Field's sentence — current life, difficulty floors — where
 * every clause of it is false, and falling through to `none` announced that the
 * skill dealt no direct damage at all.
 */
check(
  "Corpse Explosion is the only corpse-life skill",
  buckets["corpse-life"].length === 1 && buckets["corpse-life"][0] === "corpse-explosion",
  buckets["corpse-life"].join(", "),
);

// ===========================================================================
console.log("\nA synergy the game keeps on a missile is published as one");
// ===========================================================================
/*
 * The graph carries `missileSynergies` for three skills, and a field nothing
 * renders is a field that quietly rots. The FoHdin's twenty points in Holy Bolt
 * are the reason it exists: they raise the magic waves at fifteen percent each,
 * the Fist of the Heavens skill row says nothing about it, and before this
 * section the build page called those points a synergy while the skill page it
 * links to listed only Holy Shock.
 *
 * Read off the rendered HTML rather than the graph, because a correct field
 * wired to no JSX renders nothing and passes every data check.
 */
{
  const withMissileSynergies = Object.entries(SKILL_GRAPH).filter(
    ([, node]) => (node.missileSynergies ?? []).length > 0,
  );
  check(
    "the graph carries missile synergies to publish",
    withMissileSynergies.length >= 3,
    `${withMissileSynergies.length} skills`,
  );

  for (const locale of LOCALES) {
    const t = dictionaryFor(locale);
    const foh = visible(readFileSync(pageFor(locale, "paladin", "fist-of-the-heavens"), "utf8"));
    const bolt = visible(readFileSync(pageFor(locale, "paladin", "holy-bolt"), "utf8"));

    check(
      `${locale}: Fist of the Heavens publishes the synergy its missile carries`,
      foh.includes(marker(t.skills.missileSynergiesTitle)),
    );
    check(
      `${locale}: and names the rate and the element, which is not the skill's own`,
      foh.includes("15%") && foh.includes(t.elements.magic),
      foh.slice(foh.indexOf(marker(t.skills.missileSynergiesTitle)), foh.indexOf(marker(t.skills.missileSynergiesTitle)) + 160),
    );
    check(
      `${locale}: and says it is one component rather than the whole skill`,
      foh.includes(marker(t.skills.missileSynergiesNote)),
    );
    check(
      `${locale}: Holy Bolt publishes the same edge read the other way`,
      bolt.includes(marker(t.skills.missileFeedsTitle)) && bolt.includes("15%"),
    );
    check(
      `${locale}: and the ordinary synergy section still says what it said`,
      foh.includes(marker(t.skills.synergiesTitle)) && foh.includes(marker(t.skills.feedsTitle)),
    );

    /*
     * The negative control. A skill with no missile synergy must not grow the
     * section, or the check above is satisfied by a heading that always renders.
     */
    const blizzard = visible(readFileSync(pageFor(locale, "sorceress", "blizzard"), "utf8"));
    check(
      `${locale}: a skill whose missiles carry none does not print the section`,
      !blizzard.includes(marker(t.skills.missileSynergiesTitle)),
    );
  }
}

// ===========================================================================
console.log("\nNo overridden game identifier reaches any built artifact");
// ===========================================================================
/*
 * Read from the same table the generator uses, so this cannot drift out of
 * step with it. The per-page checks below cover the skill pages; this sweeps
 * everything else the build writes — the sitemap, both search indexes, every
 * class and build page, and the RSC payloads — because a URL is assembled in
 * more places than one.
 */
{
  /*
   * Two of the Druid's identifiers are ordinary English, and the sweep is a
   * case-insensitive substring search, so both match text that has nothing to
   * do with a skill slug.
   *
   *   "Vines"           the game's identifier for Solar Creeper. It also
   *                     matches the word "vines", which the Poison Creeper page
   *                     uses to say that all three of them share one slot.
   *   "Shape Shifting"  the game's identifier for Lycanthropy, and also the
   *                     real, published name of the tree the skill sits in.
   *                     Every build page that draws the Druid's trees prints it.
   *
   * Neither is the failure this rule exists to catch, which is a *URL or a
   * skill name* built from an identifier no player has seen. So they are
   * checked the narrow way instead: the slug must never appear in a path, and
   * the identifier must never be published as the skill's name. The broad
   * sweep still runs for every other identifier, where a substring hit can only
   * be the real thing.
   *
   * Exempting is deliberate and costs coverage, so it is an entry and a reason
   * each rather than a rule about capital letters.
   *
   * The Warlock added a third, and it is the strongest case of the three:
   *
   *   "Levitate"        the game's identifier for Levitation Mastery, and also
   *                     an ordinary English verb describing the one thing this
   *                     class is built around. The class page says "He levitates
   *                     his weapon" and heads a core mechanic "Levitated
   *                     weapon"; Blade Warp's summary says "the levitated melee
   *                     weapon". None of them names a skill, and asking the
   *                     prose to avoid the word would be asking a class page not
   *                     to describe its own passive.
   *
   * A word-boundary match would in fact separate "Levitate" from "levitated",
   * and it is used for exactly that on the search index in
   * `necromancer.test.ts`. It is not the answer here, because it does nothing
   * for `Vines` -- the plain English word is the same word -- and one matching
   * rule for the sweep is worth more than two.
   */
  const AMBIGUOUS: Record<string, string> = {
    Vines: 'also the plain English word, used on the Poison Creeper page',
    "Shape Shifting": "also the published name of the Druid's second tree",
    Levitate: "also an ordinary English verb, and the Warlock's whole class passive",
  };

  const identifiers = Object.keys(SLUG_OVERRIDES).filter((i) => !(i in AMBIGUOUS));
  check("there is an override table to enforce", identifiers.length > 0);
  check(
    "the ambiguous identifiers are still overridden",
    Object.keys(AMBIGUOUS).every((i) => i in SLUG_OVERRIDES),
    Object.keys(AMBIGUOUS).filter((i) => !(i in SLUG_OVERRIDES)).join(", "),
  );
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
    );
  const artifacts = walk(root).filter((f) =>
    /\.(html|json|rsc|xml|meta|segments|body)$/.test(f),
  );
  check("there are built artifacts to sweep", artifacts.length > 100, `${artifacts.length}`);
  for (const identifier of identifiers) {
    const needle = identifier.toLowerCase();
    const hits = artifacts.filter((f) => readFileSync(f, "utf8").toLowerCase().includes(needle));
    check(
      `"${identifier}" appears in no built artifact`,
      hits.length === 0,
      hits.slice(0, 3).map((h) => h.slice(root.length + 1)).join(", "),
    );
  }

  /*
   * The narrow check for the two exempted above. An identifier that is also
   * ordinary prose can still fail in the way that matters -- by reaching a file
   * path, which is what a published URL is -- and that is checkable without the
   * substring sweep.
   */
  for (const identifier of Object.keys(AMBIGUOUS)) {
    const slugged = identifier.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const inPath = artifacts.filter((f) => f.toLowerCase().includes(`skills\u005c${slugged}.`) || f.toLowerCase().includes(`skills/${slugged}.`));
    check(
      `"${identifier}" is not a published URL`,
      inPath.length === 0,
      inPath.slice(0, 3).map((h) => h.slice(root.length + 1)).join(", "),
    );
    check(
      `"${identifier}" is not published as a skill name`,
      skills.every((skill) => skill.name !== identifier),
    );
  }
}

for (const locale of LOCALES) {
  const t = dictionaryFor(locale).skills;
  const WEAPON = marker(t.noProgressionWeapon);
  const SHIELD = marker(t.noProgressionShield);
  const PROPORTIONAL = marker(t.noProgressionProportional);
  const CORPSE = marker(t.noProgressionCorpse);
  const NONE = marker(t.noProgressionNone);

  /*
   * Every authored synergy magnitude on this site reads "per level", and every
   * one of them means "per hard point". That is not a drafting habit: a synergy
   * reads `blvl`, and `scripts/skill-graph-rules.ts` **stops the generator** on
   * an expression governed by a synergy parameter that references anything
   * else. The four skills that behave otherwise - Revive and three summons -
   * are excluded from the graph entirely rather than emitted with a different
   * kind. So there is no mixed population, and no row for which "per level" is
   * literally right.
   *
   * Fifteen skill pages across four classes say both things in one sentence:
   * the row reads "+10% damage per level" above prose reading "10% per hard
   * point of Howl". The reader is owed the distinction, because gear that adds
   * skill levels raises the values in the section above and does *not* feed a
   * synergy.
   *
   * The heading carries it, which is the move the two sibling sections on the
   * same page already make - `effectsBody` and `progressionBody` both open
   * "Hard points only". This asserts the clause survives, so it cannot be
   * softened back into a sentence that leaves 192 rows reading as a
   * contradiction.
   */
  check(
    `${locale}: the synergy heading says hard points only`,
    /hard point|ponto fixo/i.test(t.synergiesBody),
    t.synergiesBody,
  );
  check(
    `${locale}: and says gear does not feed one`,
    /does not feed|nao alimenta|não alimenta/i.test(t.synergiesBody),
    t.synergiesBody,
  );

  // =========================================================================
  console.log(`\n${locale}: the damage section says the right thing`);
  // =========================================================================

  check(
    `${locale}: the five messages are distinct`,
    new Set([WEAPON, SHIELD, PROPORTIONAL, CORPSE, NONE]).size === 5,
  );

  const read = (slug: string): string | null => {
    const skill = skills.find((s) => s.slug === slug)!;
    const path = pageFor(locale, skill.classSlug, slug);
    return existsSync(path) ? visible(readFileSync(path, "utf8")) : null;
  };

  // =========================================================================
  // Poison publishes a total over a window, never a per-frame zero
  // =========================================================================
  /*
   * The columns for these two are damage per frame in 256ths. Read like any
   * other element they floor to nothing, and the page announces that a skill
   * dealing thousands is harmless. This asserts the rendered page, not the
   * function -- damage.test.ts covers the arithmetic; what can still go wrong
   * here is the table being wired to the wrong call.
   */
  for (const slug of [
    "poison-javelin",
    "plague-javelin",
    // The Necromancer's three, which is where the model is exercised hardest:
    // one duration that grows, one that grows on a weapon attack, and one the
    // columns fix at two seconds with no ELevLen at all.
    "poison-dagger",
    "poison-explosion",
    "poison-nova",
  ]) {
    const text = read(slug);
    if (text === null) {
      check(`${locale} ${slug}: page exists`, false, "not built");
      continue;
    }
    check(`${locale} ${slug}: no 0-0 damage row`, !/\b0[–-]0\b/.test(text), "prints 0–0");
    /*
     * The level 1 and level 20 figures, so a silently halved or squared table
     * cannot pass by merely being non-zero. Plague Javelin's level 20 total
     * follows from its duration being fixed at 75 frames by D2R 2.4; the
     * arithmetic is checked in damage.test.ts, and this checks that the page
     * prints what the arithmetic produced.
     */
    /*
     * Level 1 and level 20, so a silently halved or squared table cannot pass by
     * merely being non-zero. The three Necromancer figures agree with the 1.11
     * documentation for Poison Dagger and are pinned against it in
     * `necromancer-rules.ts`; Poison Explosion and Poison Nova are the recorded
     * divergences, and these are the Tier 1 values the site publishes.
     */
    const expected = {
      "poison-javelin": ["25–37", "2659–2946"],
      "plague-javelin": ["28–42", "703–717"],
      "poison-dagger": ["7–15", "540–581"],
      "poison-explosion": ["25–75", "1170–1410"],
      "poison-nova": ["50–90", "400–440"],
    }[slug]!;
    for (const range of expected) {
      check(`${locale} ${slug}: publishes ${range}`, text.includes(range));
    }
    check(
      `${locale} ${slug}: says the damage is spread over time`,
      text.includes(marker(t.damageOverTime)),
    );
    check(`${locale} ${slug}: shows a duration`, /\d+(\.\d+)?s/.test(text));

    if (slug === "plague-javelin") {
      // Both rows must read 3.0s, and the figure the residual column produced
      // must be gone from the page entirely.
      const seconds = [...text.matchAll(/(\d+(?:\.\d+)?)s/g)].map((m) => m[1]);
      check(
        `${locale} plague-javelin: every duration on the page is 3`,
        seconds.length >= 2 && seconds.every((v) => v === "3"),
        seconds.join(", "),
      );
      check(`${locale} plague-javelin: no 6.8s anywhere`, !text.includes("6.8"));
      check(`${locale} plague-javelin: no 1593–1625 anywhere`, !text.includes("1593"));
    }
  }

  // =========================================================================
  // No game-internal identifier reaches a reader
  // =========================================================================
  /*
   * The Amazon's decoy is `Dopplezon` in the game's tables. The generator maps
   * it to `decoy` at the one point an identifier becomes a slug; this proves
   * the mapping held all the way to the page, the URL and the canonical tag.
   * A single missed call site would put an unrecognisable word in a URL.
   */
  {
    const decoyPath = pageFor(locale, "amazon", "decoy");
    check(`${locale}: the decoy page is at /skills/decoy`, existsSync(decoyPath));
    check(
      `${locale}: no page is at /skills/dopplezon`,
      !existsSync(pageFor(locale, "amazon", "dopplezon")),
    );
    if (existsSync(decoyPath)) {
      // The raw HTML, not the visible text: canonical, hreflang and every href
      // live in attributes.
      const raw = readFileSync(decoyPath, "utf8");
      check(`${locale}: the decoy page mentions no game identifier`, !/dopplezon/i.test(raw));
    }
  }

  // --- weapon attacks ------------------------------------------------------
  let weaponOk = 0;
  let weaponClaimsNoDamage = 0;
  let weaponCarriesShield = 0;
  for (const slug of buckets.weapon) {
    const text = read(slug);
    if (text === null) {
      check(`${locale}: ${slug} page exists`, false);
      continue;
    }
    if (text.includes(WEAPON)) weaponOk++;
    if (text.includes(NONE) || text.includes(PROPORTIONAL)) weaponClaimsNoDamage++;
    if (text.includes(SHIELD)) weaponCarriesShield++;
  }
  check(
    `${locale}: all ${buckets.weapon.length} weapon attacks carry the weapon message`,
    weaponOk === buckets.weapon.length,
    `${weaponOk}/${buckets.weapon.length}`,
  );
  check(
    `${locale}: no weapon attack carries the no-damage or proportional message`,
    weaponClaimsNoDamage === 0,
    `${weaponClaimsNoDamage} pages`,
  );
  check(
    `${locale}: no other attack carries the shield message`,
    weaponCarriesShield === 0,
    `${weaponCarriesShield} pages`,
  );

  // --- the claim that must never appear on an attack page ------------------
  // Independent of which branch rendered: an `attack` skill may not tell the
  // reader it deals no damage, however that sentence is worded.
  // Both the sentence that shipped ("deals no direct damage") and the one that
  // replaced it ("has no direct damage table"). Either is wrong on an attack
  // page, and matching both means the guard survives a rewording of the copy.
  const forbidden: Record<Locale, RegExp> = {
    "en-us": /deals no direct damage|no direct damage table/i,
    "pt-br": /não causa dano direto|não tem tabela de dano direto/i,
  };
  const offenders: string[] = [];
  for (const slug of [...buckets.weapon, ...buckets.shield]) {
    const text = read(slug);
    if (text && forbidden[locale].test(text)) offenders.push(slug);
  }
  check(
    `${locale}: no kind:"attack" page claims the skill deals no damage`,
    offenders.length === 0,
    offenders.join(", "),
  );

  // Anti-vacuity: the forbidden pattern must be capable of matching something,
  // or the check above passes for the wrong reason.
  const noneSample = read(buckets.none[0]);
  check(
    `${locale}: the forbidden pattern does match a genuine no-damage page`,
    Boolean(noneSample && forbidden[locale].test(noneSample)),
    buckets.none[0],
  );

  // --- Smite ---------------------------------------------------------------
  /*
   * The page used to say two things at once. "How it works" carried "Damage
   * comes from the shield, not the weapon" and "it does not roll against attack
   * rating at all", while "Damage by level" — reading the weapon branch off
   * `kind` — said the damage came from the weapon and that attack rating decided
   * the number. Both halves are on one page, so the reader met the contradiction
   * without leaving it.
   *
   * These assert the wording, not just the branch: a correct bucket wired to the
   * wrong string would still ship the old sentence.
   */
  const WEAPON_ORIGIN: Record<Locale, RegExp> = {
    "en-us": /comes from your weapon/i,
    "pt-br": /vem da sua arma/i,
  };
  /*
   * Deliberately narrow. Smite's own mechanics bullet *mentions* attack rating
   * in order to deny it — "it does not roll against attack rating at all" — so a
   * blanket ban on the phrase would fail on the correct copy. What must not
   * appear is the claim that attack rating decides anything.
   */
  const AR_DEPENDENCY: Record<Locale, RegExp> = {
    "en-us": /attack rating[^.]*\bdecide/i,
    "pt-br": /attack rating[^.]*\bdecidem/i,
  };
  /** The mechanics bullet the damage section has to agree with. */
  const SHIELD_ORIGIN: Record<Locale, RegExp> = {
    "en-us": /damage comes from the shield, not the weapon/i,
    "pt-br": /o dano vem do escudo, não da arma/i,
  };

  const smite = read("smite");
  check(`${locale}: Smite page exists`, smite !== null);
  check(
    `${locale}: Smite carries the shield message`,
    Boolean(smite && smite.includes(SHIELD)),
  );
  check(
    `${locale}: Smite carries none of the other three messages`,
    Boolean(
      smite &&
        !smite.includes(WEAPON) &&
        !smite.includes(PROPORTIONAL) &&
        !smite.includes(NONE),
    ),
  );
  check(
    `${locale}: Smite never says the damage comes from the weapon`,
    Boolean(smite && !WEAPON_ORIGIN[locale].test(smite)),
  );
  check(
    `${locale}: Smite never claims attack rating decides the outcome`,
    Boolean(smite && !AR_DEPENDENCY[locale].test(smite)),
  );
  check(
    `${locale}: Smite still states where the damage does come from`,
    Boolean(smite && SHIELD_ORIGIN[locale].test(smite)),
  );
  check(
    `${locale}: "How it works" and "Damage by level" agree on Smite`,
    Boolean(
      smite &&
        SHIELD_ORIGIN[locale].test(smite) &&
        smite.includes(SHIELD) &&
        !WEAPON_ORIGIN[locale].test(smite),
    ),
  );
  check(
    `${locale}: Smite points at its mechanics rather than inventing a formula`,
    Boolean(smite && smite.includes(dictionaryFor(locale).skills.mechanicsTitle)),
  );

  /*
   * Anti-vacuity, in both directions. The two patterns above are only worth
   * anything if they can match: `WEAPON_ORIGIN` must fire on a genuine weapon
   * attack, and `AR_DEPENDENCY` must fire on the sentence those pages carry.
   * Otherwise "Smite does not match them" is true of any string at all.
   */
  const weaponSample = read(buckets.weapon[0]);
  check(
    `${locale}: the weapon-origin pattern does match a genuine weapon attack`,
    Boolean(weaponSample && WEAPON_ORIGIN[locale].test(weaponSample)),
    buckets.weapon[0],
  );
  check(
    `${locale}: the attack-rating pattern does match a genuine weapon attack`,
    Boolean(weaponSample && AR_DEPENDENCY[locale].test(weaponSample)),
    buckets.weapon[0],
  );

  // --- Static Field --------------------------------------------------------
  const staticField = read("static-field");
  check(`${locale}: Static Field page exists`, staticField !== null);
  check(
    `${locale}: Static Field carries the proportional message`,
    Boolean(staticField && staticField.includes(PROPORTIONAL)),
  );
  check(
    `${locale}: Static Field carries none of the other three messages`,
    Boolean(
      staticField &&
        !staticField.includes(WEAPON) &&
        !staticField.includes(SHIELD) &&
        !staticField.includes(NONE),
    ),
  );
  check(
    `${locale}: Static Field still points at its verified mechanics`,
    Boolean(staticField && staticField.includes(dictionaryFor(locale).skills.mechanicsTitle)),
  );

  /*
   * Corpse Explosion. Its damage is real, is not the skill's, and has no table
   * — so the page must carry its own sentence rather than the weapon one, the
   * proportional one, or the "no direct damage" one it used to carry.
   */
  {
    const text = read("corpse-explosion");
    check(`${locale} corpse-explosion: page exists`, text !== null, "not built");
    if (text !== null) {
      check(`${locale} corpse-explosion: carries the corpse-life message`, text.includes(CORPSE));
      check(
        `${locale} corpse-explosion: carries none of the other four`,
        !text.includes(WEAPON) &&
          !text.includes(SHIELD) &&
          !text.includes(PROPORTIONAL) &&
          !text.includes(NONE),
      );
      // The radius is published in the game's own unit and the mana with it.
      check(
        `${locale} corpse-explosion: publishes its radius parameter and mana`,
        text.includes("8") && text.includes("27") && text.includes("34"),
      );
    }
  }

  // --- auras, buffs, passives ---------------------------------------------
  let noneOk = 0;
  for (const slug of buckets.none) {
    const text = read(slug);
    if (text && text.includes(NONE)) noneOk++;
  }
  check(
    `${locale}: all ${buckets.none.length} no-damage skills carry the no-damage message`,
    noneOk === buckets.none.length,
    `${noneOk}/${buckets.none.length}`,
  );
  check(
    `${locale}: at least one aura or passive carries it`,
    buckets.none.some((slug) => {
      const s = skills.find((x) => x.slug === slug)!;
      return s.kind === "aura" || s.kind === "passive";
    }) && noneOk > 0,
  );

  // --- skills that do have a table ----------------------------------------
  let tableOk = 0;
  for (const slug of buckets.table) {
    const text = read(slug);
    if (
      text &&
      !text.includes(WEAPON) &&
      !text.includes(SHIELD) &&
      !text.includes(PROPORTIONAL) &&
      !text.includes(NONE)
    )
      tableOk++;
  }
  check(
    `${locale}: no skill with a real damage table carries any absence message`,
    tableOk === buckets.table.length,
    `${tableOk}/${buckets.table.length}`,
  );
}

// ===========================================================================
// Planted control: put the weapon sentence back on Smite, and prove this suite
// stops it.
// ===========================================================================
/*
 * The assertions above are only worth their runtime if they can fail. This is
 * the regression they exist for — Smite reading the weapon branch off `kind` —
 * reintroduced into a *copy* of the build and run through this same file as a
 * whole process, which must exit non-zero and name the reason.
 *
 * `D2R_BUILD_ROOT` is what makes it possible without a second `next build` and
 * without touching a tracked file: the corrupted pages live in a temporary
 * directory outside the repository, and the repository is only ever read.
 *
 * `D2R_CONTROL` stops the child from re-entering this block, which would
 * recurse without bound.
 */
if (process.env.D2R_CONTROL !== "1") {
  console.log("\nControl: reintroducing the weapon copy on Smite must fail");

  const repoRoot = resolve(__dirname, "..");
  const gitStatus = () =>
    execSync("git status --porcelain", { cwd: repoRoot, encoding: "utf8" }).trim();
  // Snapshot rather than assert-clean: the claim is "this control changed
  // nothing", which has to hold whether or not the tree was already dirty.
  const before = gitStatus();

  const tmpRoot = realpathSync(tmpdir());
  const dir = mkdtempSync(join(tmpRoot, "d2r-smite-control-"));

  try {
    // Copy every page this suite reads, then corrupt exactly one per locale.
    for (const locale of LOCALES) {
      for (const s of skills) {
        if (!SKILL_GRAPH[s.slug]) continue;
        const from = pageFor(locale, s.classSlug, s.slug);
        if (!existsSync(from)) continue;
        const to = join(dir, locale, "classes", s.classSlug, "skills", `${s.slug}.html`);
        mkdirSync(dirname(to), { recursive: true });
        copyFileSync(from, to);
      }
      // The mutation: the weapon sentence, appended to Smite's page. `visible()`
      // strips tags and decodes entities, so the dictionary string written raw
      // is what the assertions will read back.
      const smitePage = join(dir, locale, "classes", "paladin", "skills", "smite.html");
      const weaponCopy = dictionaryFor(locale).skills.noProgressionWeapon;
      const html = readFileSync(smitePage, "utf8");
      writeFileSync(smitePage, `${html}<p>${weaponCopy}</p>`, "utf8");
    }

    const run = () => {
      try {
        execSync(`npx tsx ${JSON.stringify(__filename)}`, {
          cwd: repoRoot,
          stdio: "pipe",
          env: { ...process.env, D2R_CONTROL: "1", D2R_BUILD_ROOT: dir },
        });
        return { code: 0, out: "" };
      } catch (e) {
        const err = e as { status?: number; stdout?: Buffer; stderr?: Buffer };
        return {
          code: err.status ?? 1,
          out: `${err.stdout?.toString() ?? ""}${err.stderr?.toString() ?? ""}`,
        };
      }
    };

    const planted = run();
    check("the suite exits non-zero with the weapon copy back on Smite", planted.code !== 0);
    // Exit code alone proves nothing — a broken import is also non-zero.
    check(
      "...and it failed on the weapon-origin claim, not on a crash",
      planted.out.includes("Smite never says the damage comes from the weapon"),
      planted.out.split("\n").find((l) => l.includes("FAIL"))?.slice(0, 110) ?? "no FAIL line",
    );
    check(
      "...and on the two sections contradicting each other",
      planted.out.includes('"How it works" and "Damage by level" agree on Smite'),
    );
    check(
      "...in both locales",
      LOCALES.every((l) => planted.out.includes(`${l}: Smite never says the damage comes`)),
    );
  } finally {
    // Only ever remove the directory this control created, and only after
    // confirming it still resolves inside the OS temp root.
    const resolved = realpathSync(dir);
    const inTemp = resolved.startsWith(tmpRoot + sep);
    const isOurs = basename(resolved).startsWith("d2r-smite-control-");
    if (inTemp && isOurs) rmSync(resolved, { recursive: true, force: true });
    check("the temporary directory was inside the OS temp root", inTemp, resolved);
    check("the temporary directory was one this control created", isOurs, basename(resolved));
    check("the temporary directory is gone", !existsSync(dir));
    check("the control left the repository untouched", gitStatus() === before);
  }
}

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
