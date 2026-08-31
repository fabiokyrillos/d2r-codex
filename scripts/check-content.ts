/**
 * Content integrity checks.
 *
 * TypeScript can guarantee that a build's gear pick has a `ref` with
 * `kind: 'runeword'` and a `slug` — but it cannot guarantee that the slug names
 * a runeword that exists. Slugs are strings, and a typo produces a link to a
 * 404 that no compiler will catch.
 *
 * Since internationalisation this script has a second job: verifying that every
 * content slug has a translation overlay in every non-source locale. The UI
 * dictionary's completeness is enforced by `tsc` (pt-BR is typed as the en-US
 * key structure), but content overlays are keyed by string slug, so they need a
 * runtime check. Together those two mechanisms are the "zero missing
 * translation keys" guarantee.
 *
 * Run with `npm run check:content`.
 */
import {
  getBreakpointTables,
  getBuilds,
  getClasses,
  getFarmingAreas,
  getJourneys,
  getMechanics,
  getMercenaries,
  getRune,
  getRunes,
  getRuneword,
  getRunewords,
  getSkill,
  getSkills,
  getSkillTrees,
  getUnique,
  getUniques,
  getFarmingArea,
  getMercenary,
  getBuild,
} from "../lib/registry";
import { OVERLAYS } from "../lib/registry/overlays";
import { missingOverlaySlugs, orphanOverlaySlugs } from "../lib/registry/localize";
import { tierOrder } from "../lib/labels";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";
import type { GearPick, ItemRef } from "../lib/types";
import { SKILL_GRAPH } from "../content/classes/skill-graph";
import { damagePresentation, type DamagePresentation } from "../lib/skills";
import { checkSkillGraph, MAX_HARD_POINTS } from "./skill-graph-rules";
import { exitCodeFor, isUntranslatedProse } from "./content-rules";

const SOURCE: Locale = DEFAULT_LOCALE;
const TRANSLATED = LOCALES.filter((l) => l !== SOURCE);

const problems: string[] = [];
const warnings: string[] = [];

const fail = (where: string, message: string) => problems.push(`${where}: ${message}`);
const warn = (where: string, message: string) => warnings.push(`${where}: ${message}`);

// ---------------------------------------------------------------------------
// Reference resolution
// ---------------------------------------------------------------------------

function checkRef(ref: ItemRef, where: string) {
  switch (ref.kind) {
    case "rune":
      if (!getRune(SOURCE, ref.slug)) fail(where, `unknown rune "${ref.slug}"`);
      break;
    case "runeword":
      if (!getRuneword(SOURCE, ref.slug)) fail(where, `unknown runeword "${ref.slug}"`);
      break;
    case "unique":
    case "set-item":
      if (!getUnique(SOURCE, ref.slug)) fail(where, `unknown item "${ref.slug}"`);
      break;
    default:
      // Categories without dedicated pages render as plain labels, so a
      // missing catalogue entry is expected rather than an error.
      break;
  }
}

function checkPick(pick: GearPick, where: string) {
  if (!pick.ref && !pick.label) {
    fail(where, "gear pick has neither a ref nor a label");
  }
  if (pick.ref) checkRef(pick.ref, where);
  pick.alternatives?.forEach((alt, i) => checkPick(alt, `${where} > alternative ${i}`));
}

// ---------------------------------------------------------------------------
// Runewords
// ---------------------------------------------------------------------------

for (const rw of getRunewords(SOURCE)) {
  const where = `runeword "${rw.slug}"`;

  rw.runes.forEach((slug) => checkRef({ kind: "rune", slug }, where));

  if (rw.runes.length !== rw.sockets) {
    fail(
      where,
      `declares ${rw.sockets} sockets but lists ${rw.runes.length} runes — these must match`,
    );
  }

  // A runeword's level requirement is the highest of its runes', unless the
  // runeword itself sets a higher one. It can never be lower.
  const highestRune = Math.max(
    ...rw.runes.map((slug) => getRune(SOURCE, slug)?.requiredLevel ?? 0),
  );
  if (rw.requiredLevel < highestRune) {
    fail(
      where,
      `required level ${rw.requiredLevel} is below its highest rune's requirement of ${highestRune}`,
    );
  }

  if (rw.stats.length === 0) fail(where, "has no stat lines");
  if (rw.bases.categories.length === 0) fail(where, "has no valid base categories");
}

// ---------------------------------------------------------------------------
// Runes
// ---------------------------------------------------------------------------

const runes = getRunes(SOURCE);
if (runes.length !== 33) fail("runes", `expected 33 runes, found ${runes.length}`);
runes.forEach((rune, i) => {
  if (rune.number !== i + 1) {
    fail(`rune "${rune.slug}"`, `number ${rune.number} is out of sequence at index ${i}`);
  }
});

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

for (const item of getUniques(SOURCE)) {
  const where = `item "${item.slug}"`;
  if (item.stats.length === 0) fail(where, "has no stat lines");
  item.alternatives?.forEach((ref) => checkRef(ref, `${where} > alternatives`));
  item.drop?.areas?.forEach((slug) => {
    if (!getFarmingArea(SOURCE, slug)) fail(where, `drop references unknown area "${slug}"`);
  });
  if (!item.stats.some((s) => s.notable)) {
    warn(where, "no stat line is marked notable — nothing will be highlighted");
  }
}

// ---------------------------------------------------------------------------
// Builds
// ---------------------------------------------------------------------------

for (const build of getBuilds(SOURCE)) {
  const where = `build "${build.slug}"`;

  if (!getClasses(SOURCE).some((c) => c.slug === build.classSlug)) {
    fail(where, `unknown class "${build.classSlug}"`);
  }
  if (!getSkill(SOURCE, build.primarySkill)) {
    fail(where, `primary skill "${build.primarySkill}" is not in the skill data`);
  }

  for (const alloc of build.skills) {
    if (!getSkill(SOURCE, alloc.skill)) {
      fail(where, `skill allocation references unknown skill "${alloc.skill}"`);
    }
    if (alloc.points < 1 || alloc.points > 20) {
      fail(where, `skill "${alloc.skill}" allocates ${alloc.points} points (must be 1-20)`);
    }
  }

  const seenTiers = new Set<string>();
  let lastIndex = -1;
  for (const set of build.gearSets) {
    const setWhere = `${where} > ${set.tier}`;
    if (seenTiers.has(set.tier)) fail(where, `duplicate gear tier "${set.tier}"`);
    seenTiers.add(set.tier);

    const index = tierOrder.indexOf(set.tier);
    if (index < lastIndex) {
      fail(where, `gear tier "${set.tier}" appears out of progression order`);
    }
    lastIndex = index;

    if (set.slots.length === 0) fail(setWhere, "has no gear slots");

    for (const entry of set.slots) {
      if (entry.picks.length === 0) fail(`${setWhere} > ${entry.slot}`, "has no picks");
      entry.picks.forEach((p) => checkPick(p, `${setWhere} > ${entry.slot}`));
    }
    set.charms?.forEach((p) => checkPick(p, `${setWhere} > charms`));
    set.weaponSwap?.forEach((p) => checkPick(p, `${setWhere} > weapon swap`));
  }

  for (const entry of build.farming) {
    if (!getFarmingArea(SOURCE, entry.area)) {
      fail(where, `farming entry references unknown area "${entry.area}"`);
    }
  }

  if (build.mercenary && !getMercenary(SOURCE, build.mercenary)) {
    fail(where, `references unknown mercenary "${build.mercenary}"`);
  }

  if (build.levelingPath?.viaBuild && !getBuild(SOURCE, build.levelingPath.viaBuild)) {
    fail(where, `leveling path references unknown build "${build.levelingPath.viaBuild}"`);
  }

  if (build.complete && build.gearSets.length < tierOrder.length) {
    warn(
      where,
      `marked complete but has ${build.gearSets.length} of ${tierOrder.length} gear tiers`,
    );
  }
}

// ---------------------------------------------------------------------------
// Farming areas
// ---------------------------------------------------------------------------

for (const area of getFarmingAreas(SOURCE)) {
  const where = `area "${area.slug}"`;

  // hellLevel85 is a derived fact stored explicitly for query speed. If it
  // ever disagrees with the level data, the level data wins.
  const shouldBe85 = area.levels.hell >= 85;
  if (area.hellLevel85 !== shouldBe85) {
    fail(
      where,
      `hellLevel85 is ${area.hellLevel85} but the Hell area level is ${area.levels.hell}`,
    );
  }

  if (area.levels.normal > area.levels.nightmare || area.levels.nightmare > area.levels.hell) {
    fail(where, "area levels are not monotonically increasing across difficulties");
  }

  area.notableDrops?.forEach((ref) => checkRef(ref, `${where} > notable drops`));
  area.suitedTo?.forEach((slug) => {
    if (!getClasses(SOURCE).some((c) => c.slug === slug)) {
      fail(where, `suitedTo references unknown class "${slug}"`);
    }
  });
}

// ---------------------------------------------------------------------------
// Mercenaries
// ---------------------------------------------------------------------------

for (const merc of getMercenaries(SOURCE)) {
  merc.gear.forEach((g, i) => {
    const where = `mercenary "${merc.slug}" > gear ${i}`;
    if (!g.ref && !g.label) fail(where, "has neither a ref nor a label");
    if (g.ref) checkRef(g.ref, where);
  });
}

// ---------------------------------------------------------------------------
// Progression journeys
// ---------------------------------------------------------------------------

for (const journey of getJourneys(SOURCE)) {
  const where = `journey "${journey.classSlug}"`;

  if (!getClasses(SOURCE).some((c) => c.slug === journey.classSlug)) {
    fail(where, `unknown class "${journey.classSlug}"`);
  }
  if (journey.targetBuild && !getBuild(SOURCE, journey.targetBuild)) {
    fail(where, `targetBuild "${journey.targetBuild}" does not exist`);
  }

  const ordered = [...journey.stages].sort((a, b) => a.order - b.order);
  ordered.forEach((stage, i) => {
    const stageWhere = `${where} > stage "${stage.slug}"`;
    if (stage.levels[0] > stage.levels[1]) {
      fail(stageWhere, `level range ${stage.levels[0]}-${stage.levels[1]} is inverted`);
    }
    const prev = ordered[i - 1];
    if (prev && stage.levels[0] > prev.levels[1] + 1) {
      warn(
        stageWhere,
        `starts at level ${stage.levels[0]} but the previous stage ended at ${prev.levels[1]} — gap in coverage`,
      );
    }
    stage.actions.forEach((action) =>
      action.refs?.forEach((ref) => checkRef(ref, `${stageWhere} > action`)),
    );
    stage.gearTargets?.forEach((p) => checkPick(p, `${stageWhere} > gear targets`));
  });
}

// ---------------------------------------------------------------------------
// Classes, breakpoints, mechanics
// ---------------------------------------------------------------------------

for (const cls of getClasses(SOURCE)) {
  if (cls.trees.length === 0) fail(`class "${cls.slug}"`, "has no skill trees");
}

for (const table of getBreakpointTables(SOURCE)) {
  const where = `breakpoint table "${table.slug}"`;
  if (table.rows.length === 0) fail(where, "has no rows");

  // Higher percentage must mean fewer frames, always.
  for (let i = 1; i < table.rows.length; i++) {
    const prev = table.rows[i - 1];
    const row = table.rows[i];
    if (row.value <= prev.value) {
      fail(where, `row ${i} value ${row.value}% is not greater than the previous ${prev.value}%`);
    }
    if (row.frames >= prev.frames) {
      fail(where, `row ${i} frames ${row.frames} is not fewer than the previous ${prev.frames}`);
    }
  }
}

for (const article of getMechanics(SOURCE)) {
  const where = `mechanic "${article.slug}"`;
  if (article.body.length === 0) fail(where, "has no body content");
  if (article.keyFacts.length === 0) fail(where, "has no key facts");
  article.related?.forEach((slug) => {
    if (!getMechanics(SOURCE).some((a) => a.slug === slug)) {
      fail(where, `related references unknown article "${slug}"`);
    }
  });
  for (const block of article.body) {
    if (block.type === "table") {
      const bad = block.rows.find((row) => row.length !== block.headers.length);
      if (bad) {
        fail(
          where,
          `a table row has ${bad.length} cells but the header has ${block.headers.length}`,
        );
      }
    }
    if (block.type === "refs") block.refs.forEach((ref) => checkRef(ref, where));
  }
}

// ---------------------------------------------------------------------------
// Translation coverage
// ---------------------------------------------------------------------------

interface DomainSpec {
  name: string;
  slugs: { slug: string }[];
  overlays: Partial<Record<Locale, Record<string, unknown>>>;
}

const domains: DomainSpec[] = [
  { name: "runes", slugs: getRunes(SOURCE), overlays: OVERLAYS.runes },
  { name: "runewords", slugs: getRunewords(SOURCE), overlays: OVERLAYS.runewords },
  { name: "items", slugs: getUniques(SOURCE), overlays: OVERLAYS.items },
  { name: "classes", slugs: getClasses(SOURCE), overlays: OVERLAYS.classes },
  { name: "skills", slugs: getSkills(SOURCE), overlays: OVERLAYS.skills },
  { name: "skillTrees", slugs: getSkillTrees(SOURCE), overlays: OVERLAYS.skillTrees },
  { name: "areas", slugs: getFarmingAreas(SOURCE), overlays: OVERLAYS.areas },
  { name: "mercenaries", slugs: getMercenaries(SOURCE), overlays: OVERLAYS.mercenaries },
  { name: "breakpoints", slugs: getBreakpointTables(SOURCE), overlays: OVERLAYS.breakpoints },
  { name: "mechanics", slugs: getMechanics(SOURCE), overlays: OVERLAYS.mechanics },
  { name: "builds", slugs: getBuilds(SOURCE), overlays: OVERLAYS.builds },
  {
    // Journeys are keyed by class slug, not by a `slug` field.
    name: "journeys",
    slugs: getJourneys(SOURCE).map((j) => ({ slug: j.classSlug })),
    overlays: OVERLAYS.journeys,
  },
];

const coverage: { locale: Locale; domain: string; done: number; total: number }[] = [];

for (const locale of TRANSLATED) {
  for (const domain of domains) {
    const overlay = domain.overlays[locale];
    const missing = missingOverlaySlugs(domain.slugs, overlay);
    const orphans = orphanOverlaySlugs(domain.slugs, overlay);

    coverage.push({
      locale,
      domain: domain.name,
      done: domain.slugs.length - missing.length,
      total: domain.slugs.length,
    });

    if (missing.length > 0) {
      // A missing overlay entry is a warning, not an error: the page still
      // renders, in the source language. It is reported loudly so the gap is
      // visible, and the summary below makes the real coverage unmissable.
      warn(
        `${locale} > ${domain.name}`,
        `${missing.length} of ${domain.slugs.length} untranslated: ${missing.slice(0, 6).join(", ")}${missing.length > 6 ? ", …" : ""}`,
      );
    }

    // An orphan IS an error: it means a slug was renamed or removed and the
    // translation was left behind, which silently does nothing.
    if (orphans.length > 0) {
      fail(
        `${locale} > ${domain.name}`,
        `overlay has entries for slugs that no longer exist: ${orphans.join(", ")}`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const counts = {
  runes: getRunes(SOURCE).length,
  runewords: getRunewords(SOURCE).length,
  items: getUniques(SOURCE).length,
  classes: getClasses(SOURCE).length,
  skills: getSkills(SOURCE).length,
  builds: getBuilds(SOURCE).length,
  areas: getFarmingAreas(SOURCE).length,
  mercenaries: getMercenaries(SOURCE).length,
  journeys: getJourneys(SOURCE).length,
  breakpointTables: getBreakpointTables(SOURCE).length,
  mechanics: getMechanics(SOURCE).length,
};

console.log("Content inventory:");
for (const [key, value] of Object.entries(counts)) {
  console.log(`  ${key.padEnd(18)} ${value}`);
}

console.log("\nTranslation coverage:");
for (const locale of TRANSLATED) {
  const rows = coverage.filter((c) => c.locale === locale);
  const done = rows.reduce((sum, row) => sum + row.done, 0);
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const pct = total === 0 ? 100 : Math.round((done / total) * 100);
  console.log(`  ${locale}  ${done}/${total} entries (${pct}%)`);
  for (const row of rows) {
    const mark = row.done === row.total ? "ok " : "   ";
    console.log(`    ${mark}${row.domain.padEnd(16)} ${row.done}/${row.total}`);
  }
}

// ---------------------------------------------------------------------------
// Gear pick affix length
// ---------------------------------------------------------------------------

/*
 * `lookFor` entries render as `Badge`, which is `whitespace-nowrap` by design —
 * a badge is a short affix chip, not a sentence. An over-long entry used to
 * stretch its grid track and widen the whole page at mobile widths, which
 * happened twice before this check existed.
 *
 * The longest legitimate affix found in content is 37 characters
 * ("-20% de resistência a raio do inimigo"), so the limit sits just above it.
 * Prose belongs in `why`.
 */
const MAX_AFFIX_LENGTH = 40;

console.log("\nGear pick affixes:");
for (const locale of LOCALES) {
  let affixes = 0;
  let tooLong = 0;
  for (const build of getBuilds(locale)) {
    for (const set of build.gearSets) {
      const picks = [
        ...set.slots.flatMap((entry) =>
          entry.picks.flatMap((pick) => [pick, ...(pick.alternatives ?? [])]),
        ),
        ...(set.charms ?? []),
        ...(set.weaponSwap ?? []),
      ];
      for (const pick of picks) {
        for (const affix of pick.lookFor ?? []) {
          affixes++;
          if (affix.length <= MAX_AFFIX_LENGTH) continue;
          tooLong++;
          problems.push(
            `${locale} > ${build.slug} > ${set.tier}: lookFor entry is ` +
              `${affix.length} characters (limit ${MAX_AFFIX_LENGTH}). It renders as a ` +
              `nowrap badge and will overflow on mobile — move the prose to \`why\`. ` +
              `"${affix.slice(0, 50)}…"`,
          );
        }
      }
    }
  }
  console.log(`  ${locale}  ${affixes - tooLong}/${affixes} affixes within the badge length limit`);
}

// ---------------------------------------------------------------------------
// The skill graph
// ---------------------------------------------------------------------------

/*
 * Everything here validates against `content/classes/skill-graph.ts`, which is
 * GENERATED FROM THE GAME'S OWN TABLES — never against the authored
 * `Skill.prerequisites` field.
 *
 * That distinction is the entire point of this section. The previous version
 * of this check compared each build against the authored table, and 29 of
 * those 60 authored prerequisite sets were wrong. A build written from a wrong
 * table, checked against the same wrong table, passes. It reported 289/289
 * while fourteen of eighteen builds published plans that could not be spent in
 * game. A validator that shares its ground truth with the thing it validates
 * cannot fail, and this one did not.
 *
 * So: the graph is the authority, the authored table is one of the things
 * under test, and `checkSkillGraph` is exercised by planted-mutation tests in
 * `scripts/check-content.test.ts` that prove each rule actually fires.
 */

console.log("\nSkill graph (validated against the generated game-data graph):");
{
  const graphProblems = checkSkillGraph(SKILL_GRAPH, getSkills(SOURCE), getBuilds(SOURCE));
  const counts = new Map<string, number>();
  for (const problem of graphProblems) {
    counts.set(problem.rule, (counts.get(problem.rule) ?? 0) + 1);
    problems.push(problem.message);
  }
  const rules = [
    "authored-drift",
    "missing-prerequisite",
    "cross-tree-edge",
    "cycle",
    "unknown-skill",
    "over-budget",
    "row-level-mismatch",
  ] as const;
  for (const rule of rules) {
    const n = counts.get(rule) ?? 0;
    console.log(`  ${n === 0 ? "ok" : " x"} ${rule.padEnd(22)} ${n}`);
  }

  // The mandatory budget of every build, printed whether or not it passes —
  // this is the number the hotfix exists to keep honest.
  const graphBuilds = getBuilds(SOURCE).filter((b) => b.skills.some((a) => SKILL_GRAPH[a.skill]));
  console.log(`\n  mandatory hard points (flex excluded, cap ${MAX_HARD_POINTS}):`);
  for (const build of [...graphBuilds].sort((a, b) => a.slug.localeCompare(b.slug))) {
    const core = build.skills.filter((a) => a.points > 0 && a.role !== "flex" && SKILL_GRAPH[a.skill]);
    const spent = core.reduce((sum, a) => sum + a.points, 0);
    const flex = build.skills
      .filter((a) => a.role === "flex")
      .reduce((sum, a) => sum + a.points, 0);
    console.log(
      `    ${build.slug.padEnd(28)} ${String(spent).padStart(3)}/${MAX_HARD_POINTS}` +
        `${flex ? `  (+${flex} flex)` : ""}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Build prose array parity
// ---------------------------------------------------------------------------

/*
 * `strengths`, `weaknesses` and `flexPoints` are positional arrays, and a
 * locale overlay replaces the whole array rather than merging into it. Add an
 * entry to the source and the translation silently renders one fewer bullet,
 * with the slug still counted as fully covered.
 *
 * Same defect as the mechanics-body drift this file already checks. It nearly
 * shipped again during the skill-graph hotfix: one build's `flexPoints` went
 * from one entry to two, and nothing but this check would have noticed the
 * pt-BR side staying at one.
 */
console.log("\nBuild prose arrays:");
for (const locale of TRANSLATED) {
  const source = getBuilds(DEFAULT_LOCALE);
  const translated = getBuilds(locale);
  let mismatches = 0;
  let compared = 0;
  for (const build of source) {
    const other = translated.find((b) => b.slug === build.slug);
    if (!other) continue;
    const fields = [
      ["strengths", build.strengths, other.strengths],
      ["weaknesses", build.weaknesses, other.weaknesses],
      ["flexPoints", build.flexPoints, other.flexPoints],
    ] as const;
    for (const [name, a, b] of fields) {
      if (!a && !b) continue;
      compared++;
      if ((a?.length ?? 0) !== (b?.length ?? 0)) {
        mismatches++;
        problems.push(
          `${build.slug}: ${locale} ${name} has ${b?.length ?? 0} entries, source has ${a?.length ?? 0}`,
        );
      }
    }
  }
  console.log(
    `  ${locale}  ${compared - mismatches}/${compared} build prose arrays match the source length`,
  );
}

// ---------------------------------------------------------------------------
// Untranslated gear-pick reasons
// ---------------------------------------------------------------------------

/*
 * Gear picks are keyed by position inside their slot, so a pick the overlay
 * never mentions falls back to English and renders inside an otherwise
 * Portuguese page. Slug coverage cannot see this: the build is fully covered,
 * and one line inside it is still in the wrong language.
 *
 * Found by reading a rendered page rather than by any check, which is why it
 * is a check now.
 *
 * A warning rather than a failure, because a match is not always a defect: a
 * reason that is nothing but verbatim game stat names — "Crushing Blow, Deadly
 * Strike, Open Wounds" — is correctly identical in both locales under ADR
 * 0003. The three that remain are exactly that, and should stay as they are.
 */
console.log("\nGear pick translation:");
for (const locale of TRANSLATED) {
  const source = getBuilds(DEFAULT_LOCALE);
  const translated = getBuilds(locale);
  let compared = 0;
  const untranslated: string[] = [];
  for (const build of source) {
    const other = translated.find((b) => b.slug === build.slug);
    if (!other) continue;
    build.gearSets.forEach((set, gi) => {
      set.slots.forEach((slot, si) => {
        slot.picks.forEach((pick, pi) => {
          const twin = other.gearSets[gi]?.slots[si]?.picks[pi];
          const pairs: [string | undefined, string | undefined, string][] = [
            [pick.why, twin?.why, `${slot.slot}#${pi}`],
            ...(pick.alternatives ?? []).map(
              (alt, ai): [string | undefined, string | undefined, string] => [
                alt.why,
                twin?.alternatives?.[ai]?.why,
                `${slot.slot}#${pi} alt${ai}`,
              ],
            ),
          ];
          for (const [a, b, where] of pairs) {
            if (!a) continue;
            compared++;
            if (isUntranslatedProse(a, b)) {
              untranslated.push(`${build.slug} ${set.tier} ${where}`);
            }
          }
        });
      });
    });
  }
  console.log(
    `  ${locale}  ${compared - untranslated.length}/${compared} gear pick reasons differ from the source`,
  );
  for (const entry of untranslated) {
    warnings.push(`${entry}: gear pick reason is identical to ${DEFAULT_LOCALE}, so it renders in English`);
  }
}

// ---------------------------------------------------------------------------
// Skill mechanics array parity
// ---------------------------------------------------------------------------

/*
 * How every skill's damage is presented.
 *
 * `damagePresentation` derives "weapon" from `kind === "attack"`. That is only
 * sound while the two sets coincide: an attack skill that gained an elemental
 * table, or a non-attack skill that lost one, would silently move into the
 * wrong sentence. So the derivation is asserted rather than assumed, and every
 * bucket is required to be non-empty — a rule that classifies nothing proves
 * nothing.
 */
console.log("\nDamage presentation:");
{
  const buckets: Record<DamagePresentation, string[]> = {
    table: [],
    weapon: [],
    proportional: [],
    none: [],
  };
  for (const skill of getSkills(DEFAULT_LOCALE)) {
    const node = SKILL_GRAPH[skill.slug];
    if (!node) continue;
    buckets[damagePresentation(skill, node)].push(skill.slug);
  }
  for (const [kind, slugs] of Object.entries(buckets)) {
    console.log(`  ${kind.padEnd(13)} ${String(slugs.length).padStart(2)}`);
    if (slugs.length === 0) {
      fail("damage-presentation", `no skill resolves to "${kind}"; the rule classifies nothing`);
    }
  }
  // The derivation, stated as the invariant it depends on.
  const attacks = getSkills(DEFAULT_LOCALE).filter((s) => s.kind === "attack");
  const attacksWithTable = attacks.filter((s) => SKILL_GRAPH[s.slug]?.damage);
  if (attacksWithTable.length > 0) {
    fail(
      "damage-presentation",
      `attack skills now carry an elemental table, so "weapon" no longer follows from kind: ${attacksWithTable.map((s) => s.slug).join(", ")}`,
    );
  }
  const weaponSet = new Set(buckets.weapon);
  const attackSet = new Set(attacks.map((s) => s.slug));
  if (weaponSet.size !== attackSet.size || [...attackSet].some((s) => !weaponSet.has(s))) {
    fail("damage-presentation", `the weapon bucket and the attack skills have diverged`);
  }
  console.log(`  ok  weapon bucket == the ${attacks.length} attack skills`);
}

/*
 * `Skill.mechanics` is another positional array replaced wholesale by a locale
 * overlay. Correcting the Resist auras' maximum-resistance rule added two
 * bullets to three skills; without this, a pt-BR overlay left at one bullet
 * would have rendered the old, wrong explanation with nothing complaining.
 */
console.log("\nSkill mechanics arrays:");
for (const locale of TRANSLATED) {
  const source = getSkills(DEFAULT_LOCALE);
  const translated = getSkills(locale);
  let mismatches = 0;
  for (const skill of source) {
    const other = translated.find((s) => s.slug === skill.slug);
    if (!other) continue;
    const a = skill.mechanics?.length ?? 0;
    const b = other.mechanics?.length ?? 0;
    if (a !== b) {
      mismatches++;
      problems.push(
        `${skill.slug}: ${locale} has ${b} mechanics bullets, source has ${a}`,
      );
    }
  }
  console.log(
    `  ${locale}  ${source.length - mismatches}/${source.length} skills match the source bullet count`,
  );
}

// ---------------------------------------------------------------------------
// Mechanics article structure parity
// ---------------------------------------------------------------------------

/*
 * Mechanics bodies are typed `ContentBlock[]`, and a locale overlay replaces
 * the whole array rather than merging into it. That means adding a block to
 * the source article silently leaves every translation a block short — the
 * page still renders, the slug is still "covered", and nothing complains.
 *
 * This check caught exactly that: four blocks were added to the resistances
 * article and the pt-BR version kept rendering the old thirteen.
 *
 * Compared by block *type* as well as count, so a reordered body is caught too.
 */
console.log("\nMechanics article structure:");
for (const locale of TRANSLATED) {
  const source = getMechanics(DEFAULT_LOCALE);
  const translated = getMechanics(locale);
  let mismatches = 0;
  for (const article of source) {
    const other = translated.find((a) => a.slug === article.slug);
    if (!other) continue; // already reported as missing coverage above
    const sameLength = article.body.length === other.body.length;
    const sameShape =
      sameLength && article.body.every((b, i) => b.type === other.body[i].type);
    if (!sameShape) {
      mismatches++;
      problems.push(
        `${locale} > mechanics > ${article.slug}: body structure differs from ` +
          `${DEFAULT_LOCALE} (${article.body.length} blocks vs ${other.body.length}). ` +
          `A locale overlay replaces the whole body, so it must mirror the source block for block.`,
      );
    }
  }
  console.log(
    `  ${locale}  ${source.length - mismatches}/${source.length} articles match the source structure`,
  );
}

// ---------------------------------------------------------------------------
// UI dictionary divergence
// ---------------------------------------------------------------------------

/*
 * Missing dictionary keys cannot happen — `Dictionary` is the widened type of
 * the en-US object, so `tsc` rejects a translation that omits or renames one.
 * What the type system cannot see is a key that was *copied* rather than
 * translated.
 *
 * So this reports how many strings are byte-identical across locales. It is a
 * statistic, not a failure: a large share of them legitimately match — quest
 * names, difficulty names, stat lines, and the community loanwords that ADR
 * 0003 keeps in English. A sudden jump when adding a locale is the signal
 * worth chasing.
 */
function countStrings(
  a: unknown,
  b: unknown,
  acc: { total: number; identical: number },
): void {
  if (typeof a === "string") {
    acc.total++;
    if (a === b) acc.identical++;
    return;
  }
  if (Array.isArray(a)) {
    a.forEach((v, i) => countStrings(v, (b as unknown[])?.[i], acc));
    return;
  }
  if (a && typeof a === "object") {
    for (const key of Object.keys(a as object)) {
      countStrings(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)?.[key],
        acc,
      );
    }
  }
}

console.log("\nUI dictionary:");
for (const locale of TRANSLATED) {
  const acc = { total: 0, identical: 0 };
  countStrings(dictionaryFor(DEFAULT_LOCALE), dictionaryFor(locale), acc);
  const translated = acc.total - acc.identical;
  const pct = Math.round((translated / acc.total) * 100);
  console.log(
    `  ${locale}  ${acc.total} keys, ${translated} differ from ${DEFAULT_LOCALE} (${pct}%), ` +
      `${acc.identical} identical (proper nouns and loanwords)`,
  );
}

if (warnings.length > 0) {
  console.error(`\n${warnings.length} warning(s):`);
  warnings.forEach((w) => console.error(`  ! ${w}`));
}

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.error(`  x ${p}`));
}

// Warnings fail too. A warning that prints and exits 0 is a defect the gate
// has agreed to keep shipping — which is how an English gear reason survived
// a green board for two slices.
const code = exitCodeFor(problems, warnings);
if (code !== 0) process.exit(code);

console.log("\nAll content references resolve. No integrity problems found.");
