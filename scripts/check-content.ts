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
  console.log(`\n${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log(`  ! ${w}`));
}

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.error(`  x ${p}`));
  process.exit(1);
}

console.log("\nAll content references resolve. No integrity problems found.");
