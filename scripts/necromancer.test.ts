/**
 * Proof that the Necromancer's own controls fire.
 *
 * The golem ring is the single place where reading a synergy parameter off the
 * wrong row produces a wrong answer that still looks like a right one: twelve
 * edges, four kinds, four magnitudes, all plausible in either direction. The
 * controls in `necromancer-rules.ts` pin what the game's rows say; these
 * mutations prove each one rejects the alternative.
 *
 * Run with `npm run test:necromancer`.
 */
import { SKILL_GRAPH } from "../content/classes/skill-graph";
import { getClasses, getMechanics, getSkills } from "../lib/registry";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "../lib/i18n/config";
import {
  FRAMES_PER_SECOND,
  damageAtLevel,
  damagePresentation,
  durationAtLevel,
  effectAtLevel,
  roundTo,
  unclassifiedElementalAttacks,
} from "../lib/skills";
import {
  CORROBORATED,
  DIVERGENCES,
  GOLEM_SYNERGY_CONTROLS,
  NEVER_PUBLISHES_MANA,
  checkGolemSynergies,
  checkPublishedNumbers,
  publishedReader,
  type NecromancerProblem,
  type PublishedValues,
} from "./necromancer-rules";

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

const fired = (problems: NecromancerProblem[], rule: NecromancerProblem["rule"]) =>
  problems.filter((p) => p.rule === rule).length;

type Edge = { from: string; kinds: string[]; magnitude?: number };
type Graph = Record<string, { synergies: Edge[] }>;

/** The four golem nodes as the graph ships them, deep-copied so a test can bend one. */
const golemGraph = (): Graph =>
  JSON.parse(
    JSON.stringify(
      Object.fromEntries(
        GOLEM_SYNERGY_CONTROLS.map((c) => [c.source, { synergies: SKILL_GRAPH[c.source].synergies }]),
      ),
    ),
  ) as Graph;

// ===========================================================================
console.log("\nThe golem ring, as shipped");
// ===========================================================================

check(
  "the shipped graph satisfies every golem control",
  checkGolemSynergies(golemGraph(), GOLEM_SYNERGY_CONTROLS).length === 0,
  JSON.stringify(checkGolemSynergies(golemGraph(), GOLEM_SYNERGY_CONTROLS)),
);

check(
  "each golem receives exactly three edges",
  GOLEM_SYNERGY_CONTROLS.every((c) => SKILL_GRAPH[c.source].synergies.length === 3),
  GOLEM_SYNERGY_CONTROLS.map((c) => `${c.source}=${SKILL_GRAPH[c.source].synergies.length}`).join(", "),
);

// ===========================================================================
console.log("\nPlanted mutations");
// ===========================================================================

{
  /*
   * The defect the ownership fix exists for, reconstructed: every edge takes
   * the *receiver's* kind and magnitude. Clay Golem's row says attack rating at
   * 20, so under the old reading every edge into Clay Golem said that.
   */
  const g = golemGraph();
  for (const control of GOLEM_SYNERGY_CONTROLS) {
    g[control.source].synergies = g[control.source].synergies.map((s) => ({
      ...s,
      kinds: [control.kind],
      magnitude: control.magnitude,
    }));
  }
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check(
    "reading the receiver's parameter instead of the donor's is caught",
    fired(found, "golem-kind-wrong") > 0 && fired(found, "golem-magnitude-wrong") > 0,
    JSON.stringify(found.map((p) => p.rule)),
  );
}

{
  // One magnitude swapped for another golem's — 20 where 35 belongs.
  const g = golemGraph();
  const edge = g["clay-golem"].synergies.find((s) => s.from === "iron-golem")!;
  edge.magnitude = 20;
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check(
    "a magnitude taken from the wrong golem is caught",
    fired(found, "golem-magnitude-wrong") === 1,
    JSON.stringify(found),
  );
}

{
  // The kind swapped, magnitude left correct. Armour becomes life.
  const g = golemGraph();
  g["clay-golem"].synergies.find((s) => s.from === "iron-golem")!.kinds = ["hp"];
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check("a swapped kind is caught", fired(found, "golem-kind-wrong") === 1, JSON.stringify(found));
}

{
  // The magnitude dropped entirely, which is what a regression to the
  // receiver-owned rule would produce for these edges.
  const g = golemGraph();
  delete g["fire-golem"].synergies.find((s) => s.from === "blood-golem")!.magnitude;
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check(
    "an edge losing its magnitude is caught",
    fired(found, "golem-magnitude-absent") === 1,
    JSON.stringify(found),
  );
}

{
  // An edge removed.
  const g = golemGraph();
  g["iron-golem"].synergies = g["iron-golem"].synergies.filter((s) => s.from !== "clay-golem");
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check("a missing edge is caught", fired(found, "golem-edge-missing") === 1, JSON.stringify(found));
}

{
  /*
   * The rule the brief names directly: Skeleton Mastery, Golem Mastery and
   * Summon Resist must not become synergy edges. They reach their minions
   * through the effective level, which +skills raise, and the graph models hard
   * points. An extraction that widened its idea of a synergy would add exactly
   * this edge.
   */
  const g = golemGraph();
  g["clay-golem"].synergies.push({ from: "golem-mastery", kinds: ["hp"], magnitude: 20 });
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check(
    "a Golem Mastery edge is caught as unaccounted",
    fired(found, "golem-edge-unaccounted") === 1,
    JSON.stringify(found),
  );
}

{
  // A self-edge, which `checkSynergies` also rejects but which this control
  // states in its own terms.
  const g = golemGraph();
  g["blood-golem"].synergies.push({ from: "blood-golem", kinds: ["hp"], magnitude: 5 });
  const found = checkGolemSynergies(g, GOLEM_SYNERGY_CONTROLS);
  check("a golem feeding itself is caught", fired(found, "golem-self-edge") === 1, JSON.stringify(found));
}

{
  // The whole ring absent, which is what dropping the Necromancer from the
  // extraction would look like.
  const found = checkGolemSynergies({}, GOLEM_SYNERGY_CONTROLS);
  check(
    "an empty graph is caught rather than passing vacuously",
    fired(found, "golem-edge-missing") === GOLEM_SYNERGY_CONTROLS.length,
    JSON.stringify(found.map((p) => p.rule)),
  );
}

// ===========================================================================
console.log("\nPublished numbers, against the 1.11 documentation");
// ===========================================================================

const read = publishedReader(
  SKILL_GRAPH,
  damageAtLevel as never,
  durationAtLevel as never,
  effectAtLevel as never,
);

check(
  "every corroborated value is what the site publishes",
  checkPublishedNumbers(read, CORROBORATED, DIVERGENCES, NEVER_PUBLISHES_MANA).length === 0,
  JSON.stringify(checkPublishedNumbers(read, CORROBORATED, DIVERGENCES, NEVER_PUBLISHES_MANA)),
);

check(
  "there is something to corroborate",
  CORROBORATED.length > 30 && DIVERGENCES.length > 5,
  `${CORROBORATED.length} / ${DIVERGENCES.length}`,
);

/** A reader that answers from a fixture instead of the graph. */
const fake = (values: Record<string, PublishedValues>) => (slug: string) => values[slug];

{
  /*
   * The failure the poison model exists to prevent. Poison's columns are damage
   * per frame; published without multiplying by the duration they floor to
   * nothing, and Poison Dagger's page reads "0-0" for a skill that deals 540.
   */
  const found = checkPublishedNumbers(
    fake({ "poison-dagger": { damage: { min: 0, max: 0 }, durationSeconds: 2, effects: {} } }),
    CORROBORATED.filter((c) => c.slug === "poison-dagger" && c.level === 1 && c.damage),
    [],
    [],
  );
  check(
    "poison published per frame, flooring to 0-0, is caught",
    found.length === 1 && found[0].rule === "published-value-wrong",
    JSON.stringify(found),
  );
}

{
  // The duration dropped entirely, which is what treating poison like cold
  // would do: the damage lands at once and the window disappears.
  const found = checkPublishedNumbers(
    fake({ "poison-nova": { damage: { min: 50, max: 90 }, effects: {} } }),
    CORROBORATED.filter((c) => c.slug === "poison-nova" && c.durationSeconds !== undefined),
    [],
    [],
  );
  check(
    "poison losing its duration is caught",
    found.length === 2 && found.every((p) => p.rule === "published-missing"),
    JSON.stringify(found.map((p) => p.rule)),
  );
}

{
  // Poison Nova's two seconds turned into a scaling duration, which is what
  // copying Poison Explosion's ELevLen across would produce.
  const found = checkPublishedNumbers(
    fake({ "poison-nova": { damage: { min: 50, max: 90 }, durationSeconds: 9.6, effects: {} } }),
    CORROBORATED.filter((c) => c.slug === "poison-nova" && c.level === 20 && c.durationSeconds),
    [],
    [],
  );
  check(
    "Poison Nova gaining a scaling duration is caught",
    found.length === 1 && found[0].rule === "published-value-wrong",
    JSON.stringify(found),
  );
}

{
  /*
   * The quiet one. A future author reads the 1.11 documentation, decides the
   * site's Bone Armor is wrong, and "fixes" 305 to 210. This is the rule that
   * says no.
   */
  const found = checkPublishedNumbers(
    fake({ "bone-armor": { effects: { effectAbsorbed: 210 } } }),
    [],
    DIVERGENCES.filter((d) => d.slug === "bone-armor"),
    [],
  );
  check(
    "a value moved to agree with the older source is caught",
    found.length === 1 && found[0].rule === "published-matches-stale-source",
    JSON.stringify(found),
  );
}

{
  // Drifting away from both sources at once.
  const found = checkPublishedNumbers(
    fake({ "poison-nova": { damage: { min: 999, max: 999 }, effects: {} } }),
    [],
    DIVERGENCES.filter((d) => d.slug === "poison-nova" && d.level === 1),
    [],
  );
  check(
    "a value that matches neither source is caught",
    found.length === 1 && found[0].rule === "published-value-wrong",
    JSON.stringify(found),
  );
}

{
  // Corpse Explosion's radius converted to the 1.11 yard figure.
  const found = checkPublishedNumbers(
    fake({ "corpse-explosion": { effects: { effectRadiusHalfSquares: 9 } } }),
    [],
    DIVERGENCES.filter((d) => d.slug === "corpse-explosion"),
    [],
  );
  check(
    "the radius converted to the other source's unit is caught",
    found.length === 1 && found[0].rule === "published-matches-stale-source",
    JSON.stringify(found),
  );
}

{
  // A passive priced as though it were cast.
  const found = checkPublishedNumbers(
    fake({ "summon-resist": { effects: { effectMana: 44 } } }),
    [],
    [],
    ["summon-resist"],
  );
  check(
    "a mana cost on a passive is caught",
    found.length === 1 && found[0].rule === "mana-on-passive",
    JSON.stringify(found),
  );
}

// ===========================================================================
console.log("\nDamage models");
// ===========================================================================

{
  const skills = getSkills(DEFAULT_LOCALE);
  const bySlug = new Map(skills.map((s) => [s.slug, s]));

  /*
   * Poison Dagger is a weapon attack that adds poison. Without the model its
   * page prints the poison range and says nothing about the dagger swinging
   * with it, which is the defect `unclassifiedElementalAttacks` exists to catch.
   */
  check(
    "Poison Dagger keeps its weapon component",
    damagePresentation(bySlug.get("poison-dagger")!, SKILL_GRAPH["poison-dagger"]) ===
      "weapon-plus-element",
  );
  check(
    "stripping the model leaves Poison Dagger unclassified",
    unclassifiedElementalAttacks(
      [{ slug: "poison-dagger", kind: "attack", damageModel: undefined }],
      SKILL_GRAPH,
    ).join() === "poison-dagger",
  );
  check(
    "Corpse Explosion is presented as corpse-life, not as no damage",
    damagePresentation(bySlug.get("corpse-explosion")!, SKILL_GRAPH["corpse-explosion"]) ===
      "corpse-life",
  );
  check(
    "dropping that model would announce it deals no damage",
    damagePresentation(
      { kind: "spell", damageModel: undefined },
      SKILL_GRAPH["corpse-explosion"],
    ) === "none",
  );
}

// ===========================================================================
console.log("\nWhat the pages say about Corpse Explosion");
// ===========================================================================

/*
 * A claim-level gate, in the shape `ancient-tunnels-why.test.ts` established.
 *
 * The class page said "Corpse Explosion deals damage based on the exploded
 * corpse's maximum life". That is the sentence every guide uses, it is close
 * enough to be useful, and it is wrong in the three ways that decide how the
 * skill is played: the number comes from the monster *type's* table life, so a
 * Champion explodes for what the trash beside it does and a full game changes
 * nothing.
 *
 * Both locales, because prose is translated and a corrected English sentence
 * with a stale Portuguese twin is the failure mode the overlay invites.
 */
{
  /** Every piece of prose on the site that mentions the skill, per locale. */
  const proseFor = (locale: Locale): string[] => {
    const out: string[] = [];
    const cls = getClasses(locale).find((c) => c.slug === "necromancer")!;
    out.push(cls.overview, cls.summary, ...cls.strengths, ...cls.weaknesses);
    for (const m of cls.coreMechanics) out.push(m.title, m.body);
    const skill = getSkills(locale).find((s) => s.slug === "corpse-explosion")!;
    out.push(skill.summary, ...(skill.mechanics ?? []));
    const article = getMechanics(locale).find((a) => a.slug === "corpse-explosion");
    if (article) {
      out.push(article.summary, ...article.keyFacts);
      for (const block of article.body) {
        if (block.type === "paragraph" || block.type === "heading") out.push(block.text);
        if (block.type === "callout") out.push(block.text, block.title ?? "");
        if (block.type === "list") out.push(...block.items);
        if (block.type === "table") out.push(...block.rows.flat(), ...block.headers);
      }
    }
    return out;
  };

  for (const locale of LOCALES) {
    const prose = proseFor(locale);
    const anywhere = (pattern: RegExp) => prose.some((line) => pattern.test(line));

    check(`${locale}: there is an article about Corpse Explosion`, prose.length > 30, `${prose.length}`);

    /*
     * The retracted claim, in both languages.
     *
     * A mention is allowed only where the same passage refutes it — the article
     * opens by quoting the sentence everyone uses in order to take it apart, and
     * a rule that forbade the words outright would forbid saying why they are
     * wrong. The refutation has to sit in the same block, so a bare restatement
     * elsewhere still fails; the control below proves it.
     */
    const claimsMaxLife = (line: string) =>
      /corpse'?s?\s+(own\s+)?maximum life|vida máxima do cadáver/i.test(line) &&
      !/wrong|does not read the corpse|errado|não lê o cadáver/i.test(line);
    check(
      `${locale}: nothing says the damage comes from the corpse's maximum life`,
      !prose.some(claimsMaxLife),
      prose.filter(claimsMaxLife).join(" | "),
    );
    check(
      `${locale}: control — a bare restatement of that claim would fail`,
      claimsMaxLife("Corpse Explosion deals damage based on the exploded corpse's maximum life.") &&
        claimsMaxLife("Causa dano baseado na vida máxima do cadáver explodido."),
    );
    // The correction, stated rather than merely not-contradicted.
    check(
      `${locale}: the damage is attributed to the monster type's base life`,
      anywhere(/type'?s?\*{0,2}\s+base life/i) || anywhere(/tipo\*{0,2} de monstro/i),
    );
    check(
      `${locale}: the 70-120% band is published`,
      anywhere(/70[–-]120\s?%/),
    );
    check(
      `${locale}: the physical and fire split is stated`,
      anywhere(/half.*physical.*half.*fire/i) || anywhere(/[Mm]etade do dano é físico e metade é fogo/),
    );
    check(
      `${locale}: player count and rarity are excluded explicitly`,
      (anywhere(/[Pp]layer count/) && anywhere(/Champion/)) ||
        (anywhere(/[Qq]uantidade de jogadores/) && anywhere(/Champion/)),
    );
    check(
      `${locale}: points are said to buy radius rather than damage`,
      anywhere(/points?\b.*\bradius/i) || anywhere(/[Pp]ontos compram raio/),
    );

    /*
     * The claim this pass deliberately does not make. Whether the fire half
     * picks up fire-skill modifiers is decided in the damage pipeline, which was
     * not traced end to end — so an assertion either way must not appear, and the
     * page must say so rather than being quietly silent.
     */
    const asserts = prose.filter(
      (line) =>
        /\+\s?Fire Skills|Fire Mastery|\+% Fire Skill Damage/i.test(line) &&
        !/not asserted|deliberadamente|does not claim|não afirma/i.test(line),
    );
    check(
      `${locale}: no unverified claim about fire-skill modifiers`,
      asserts.length === 0,
      asserts.join(" | "),
    );
    check(
      `${locale}: the gap is named rather than left silent`,
      anywhere(/Fire Mastery/i),
    );
  }
}

// ===========================================================================
console.log("\nThe curse table, against the graph it describes");
// ===========================================================================

/*
 * A hand-written table of thirty numbers is a hand-written table of thirty
 * numbers, in two languages, and nothing about being inside a prose article
 * makes it self-checking. This reads the rows back out of the article and
 * compares each one against the graph the skill pages render from, so the
 * article cannot drift away from its own class.
 *
 * Radius is the number the game states and the engine uses as it stands — it is
 * deliberately not converted, and Corpse Explosion's half-square parameter is
 * deliberately not converted the same way. Duration is frames over 25.
 */
{
  const CURSES = [
    ["Amplify Damage", "amplify-damage"],
    ["Dim Vision", "dim-vision"],
    ["Weaken", "weaken"],
    ["Iron Maiden", "iron-maiden"],
    ["Terror", "terror"],
    ["Confuse", "confuse"],
    ["Life Tap", "life-tap"],
    ["Attract", "attract"],
    ["Decrepify", "decrepify"],
    ["Lower Resist", "lower-resist"],
  ] as const;

  /** "3 → 22" or "7" or "8s → 65s" or "59,6s" -> [first, last] */
  const pair = (cell: string): [number, number] => {
    const parts = cell.split("→").map((p) => Number(p.replace(/[s\s]/g, "").replace(",", ".")));
    return [parts[0], parts.length > 1 ? parts[1] : parts[0]];
  };

  const valueAt = (slug: string, labelKey: string, level: number) => {
    const effect = (SKILL_GRAPH[slug].effects ?? []).find((e) => e.labelKey === labelKey);
    return effect ? effectAtLevel(effect, level) : undefined;
  };

  for (const locale of LOCALES) {
    const article = getMechanics(locale).find((a) => a.slug === "curses");
    check(`${locale}: the curses article exists`, article !== undefined);
    if (!article) continue;

    const tables = article.body.filter((b) => b.type === "table");
    const table = tables.find((t) => t.rows.length === CURSES.length);
    check(
      `${locale}: the article carries a row per curse`,
      table !== undefined,
      tables.map((t) => t.rows.length).join(", "),
    );
    if (!table) continue;

    for (const [index, [name, slug]] of CURSES.entries()) {
      const row = table.rows[index];
      check(`${locale}: row ${index + 1} is ${name}`, row[0] === name, row[0]);

      const [radiusOne, radiusTwenty] = pair(row[1]);
      check(
        `${locale}: ${name} radius ${row[1]} matches the graph`,
        radiusOne === valueAt(slug, "effectRadius", 1) &&
          radiusTwenty === valueAt(slug, "effectRadius", 20),
        `${valueAt(slug, "effectRadius", 1)} / ${valueAt(slug, "effectRadius", 20)}`,
      );

      const [secondsOne, secondsTwenty] = pair(row[2]);
      const framesToSeconds = (level: number) => {
        const frames = valueAt(slug, "effectDuration", level);
        return frames === undefined ? undefined : roundTo(frames / FRAMES_PER_SECOND, 1);
      };
      check(
        `${locale}: ${name} duration ${row[2]} matches the graph`,
        secondsOne === framesToSeconds(1) && secondsTwenty === framesToSeconds(20),
        `${framesToSeconds(1)} / ${framesToSeconds(20)}`,
      );
    }
  }

  // Anti-vacuity: the parser must actually be able to reject something.
  check(
    "control: the cell parser reads both shapes",
    pair("3 → 22").join() === "3,22" && pair("7").join() === "7,7" && pair("59,6s").join() === "59.6,59.6",
    JSON.stringify([pair("3 → 22"), pair("7"), pair("59,6s")]),
  );
}

// ===========================================================================
console.log("\nWhat the pages say about minions");
// ===========================================================================

{
  /** Every string in one mechanics article, flattened. */
  const articleProse = (locale: Locale, slug: string): string[] => {
    const article = getMechanics(locale).find((a) => a.slug === slug);
    if (!article) return [];
    const out = [article.summary, article.name, ...article.keyFacts];
    for (const block of article.body) {
      if (block.type === "paragraph" || block.type === "heading") out.push(block.text);
      if (block.type === "callout") out.push(block.text, block.title ?? "");
      if (block.type === "list") out.push(...block.items);
      if (block.type === "table") out.push(...block.headers, ...block.rows.flat());
    }
    return out;
  };

  for (const locale of LOCALES) {
    const prose = articleProse(locale, "minions");
    const anywhere = (pattern: RegExp) => prose.some((line) => pattern.test(line));
    check(`${locale}: there is a minions article`, prose.length > 30, `${prose.length}`);

    /*
     * The counts in the table are the ones the graph publishes, so a
     * hand-written article cannot claim a different army size from the skill
     * page next to it.
     */
    const minionsAt20 = (slug: string) => {
      const effect = (SKILL_GRAPH[slug].effects ?? []).find((e) => e.labelKey === "effectMinions");
      return effect ? effectAtLevel(effect, 20) : undefined;
    };
    check(
      `${locale}: the skeleton and mage caps in the article are the graph's eight`,
      minionsAt20("raise-skeleton") === 8 &&
        minionsAt20("raise-skeletal-mage") === 8 &&
        prose.filter((l) => l === "8").length === 2,
      `${minionsAt20("raise-skeleton")} / ${minionsAt20("raise-skeletal-mage")}`,
    );
    check(
      `${locale}: the revive count in the article is the graph's twenty`,
      minionsAt20("revive") === 20 && prose.includes("20"),
      `${minionsAt20("revive")}`,
    );

    /*
     * The rule the brief names outright. Building an Iron Golem from an
     * expensive runeword is standard advice and it rests on two things this
     * pass could not establish — when one survives a new game, and what makes
     * one vanish. Until both are settled the site must not recommend it.
     */
    const recommends = prose.filter(
      (line) =>
        /Iron Golem/i.test(line) &&
        /(sacrifice|feed|build one from|use a .*runeword|vale a pena (usar|sacrificar)|sacrifique|entregue)/i.test(line) &&
        !/does not tell you|não manda|could not establish|não conseguiu estabelecer|safe reading|leitura segura/i.test(line),
    );
    check(
      `${locale}: nothing recommends feeding an item to the Iron Golem`,
      recommends.length === 0,
      recommends.join(" | "),
    );
    check(
      `${locale}: the risk is stated rather than left out`,
      anywhere(/consumed when the golem was made|consumido quando o golem foi criado/i) ||
        anywhere(/treating the item as spent|tratar o item como gasto/i),
    );
    check(
      `${locale}: the unresolved questions are listed rather than answered`,
      anywhere(/could not settle|não conseguiu resolver/i) &&
        anywhere(/Skill Shrine/i) &&
        anywhere(/Uber/i),
    );
    check(
      `${locale}: the reference implementation is named as the legacy engine`,
      anywhere(/legacy engine|motor antigo/i),
    );
  }

  // Control: the recommendation detector must be able to reject something.
  check(
    "control: an actual recommendation would be caught",
    /Iron Golem/i.test("Sacrifice a spare Iron runeword to the Iron Golem.") &&
      /(sacrifice|feed|build one from)/i.test("Sacrifice a spare Iron runeword to the Iron Golem."),
  );
}

// ===========================================================================
console.log(
  failures.length === 0
    ? `\n${passed} checks passed. Magnitudes, poison, mana, damage models and the published claims are pinned.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
