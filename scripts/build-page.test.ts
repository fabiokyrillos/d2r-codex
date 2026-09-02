/**
 * What a build page *says*, checked against the HTML `next build` wrote.
 *
 * The site had a gate for skill pages and none for build pages, which is the
 * wrong way round: a build page is the deepest structure on the site — a skill
 * plan, six gear tiers, a mercenary, a farming list and four prose sections —
 * and it is the page a reader arrives on. Everything below reads the rendered
 * page rather than the data, because a correct data model wired to the wrong
 * prop renders an empty section and passes every content check.
 *
 * Scoped to the Amazon by default, for the same reason `amazon-rules.ts` is:
 * this is the completeness contract for the class published in this pass. The
 * structural assertions that are class-agnostic run over every build page on
 * the site, in both locales, and are marked as such below.
 *
 * Requires `npm run build`. Run with `npm run test:build-page`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";

import { dictionaryFor } from "../lib/i18n";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { getBuilds, getFarmingArea, getSkill, resolveRef } from "../lib/registry";
import type { ItemRef } from "../lib/types";
import { MAX_HARD_POINTS } from "../lib/skills";

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

const root = assertFreshBuild();

/** Visible text only: the RSC payload legitimately carries source strings. */
const visible = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&middot;/g, "·")
    .replace(/&#x2011;/g, "-")
    .replace(/\s+/g, " ");

const pageFor = (locale: Locale, classSlug: string, slug: string) =>
  join(root, locale, "builds", classSlug, `${slug}.html`);

const AMAZON = getBuilds("en-us").filter((b) => b.classSlug === "amazon");

// ---------------------------------------------------------------------------
console.log(`\nEvery build page was prerendered (${LOCALES.length} locales)`);
// ---------------------------------------------------------------------------
{
  let missing = 0;
  let total = 0;
  for (const locale of LOCALES) {
    for (const build of getBuilds("en-us")) {
      total++;
      if (!existsSync(pageFor(locale, build.classSlug, build.slug))) {
        missing++;
        console.log(`       missing ${locale}/${build.classSlug}/${build.slug}`);
      }
    }
  }
  check(`all ${total} build pages exist`, missing === 0, `${missing} missing`);
  // A control: the assertion above is worth nothing if the path shape is wrong.
  check(
    "the path shape is right (a page this test built a path for really is there)",
    existsSync(pageFor("en-us", "amazon", "lightning-fury-amazon")),
  );
}

// ---------------------------------------------------------------------------
console.log("\nThe eight Amazon pages say what the data says, in both locales");
// ---------------------------------------------------------------------------
for (const locale of LOCALES) {
  const t = dictionaryFor(locale);
  const localised = getBuilds(locale);

  for (const source of AMAZON) {
    const build = localised.find((b) => b.slug === source.slug)!;
    const html = readFileSync(pageFor(locale, build.classSlug, build.slug), "utf8");
    const text = visible(html);
    const where = `${locale}/${build.slug}`;

    // -- the localized name and summary reached the page ---------------------
    check(`${where}: renders its own name`, text.includes(build.name));
    check(
      `${where}: renders its summary`,
      text.includes(build.summary.slice(0, 60)),
      build.summary.slice(0, 60),
    );

    // -- the skill plan, and the number the budget rule is about -------------
    const mandatory = build.skills
      .filter((s) => s.role !== "flex" && s.points > 0)
      .reduce((sum, s) => sum + s.points, 0);
    check(
      `${where}: prints its mandatory point total (${mandatory}/${MAX_HARD_POINTS})`,
      text.includes(String(mandatory)) && text.includes(String(MAX_HARD_POINTS)),
    );
    const namesMissing = build.skills
      .map((a) => getSkill(locale, a.skill)?.name ?? a.skill)
      .filter((name) => !text.includes(name));
    check(
      `${where}: every allocated skill is named on the page`,
      namesMissing.length === 0,
      namesMissing.join(", "),
    );

    // -- six gear tiers ------------------------------------------------------
    const tiersMissing = build.gearSets
      .map((g) => g.goal)
      .filter((goal) => !text.includes(goal.slice(0, 40)));
    check(
      `${where}: all ${build.gearSets.length} gear tiers render their goal`,
      tiersMissing.length === 0,
      tiersMissing.join(" | "),
    );

    // -- the sections the completeness rule requires -------------------------
    check(`${where}: renders the immunity section`, text.includes(t.builds.immunities));
    check(`${where}: renders the mercenary section`, text.includes(t.builds.mercenary));
    check(`${where}: renders the hardcore notes`, text.includes(t.builds.hardcore));
    check(`${where}: renders the self-found notes`, text.includes(t.builds.selfFound));

    // -- every farming area is named and linked ------------------------------
    const areaProblems: string[] = [];
    for (const entry of build.farming) {
      const area = getFarmingArea(locale, entry.area);
      if (!area) {
        areaProblems.push(`${entry.area} does not resolve`);
        continue;
      }
      if (!text.includes(area.name)) areaProblems.push(`${area.name} not on the page`);
      if (!html.includes(`/${locale}/farming/${entry.area}"`)) {
        areaProblems.push(`no link to /${locale}/farming/${entry.area}`);
      }
    }
    check(
      `${where}: all ${build.farming.length} farming areas are named and linked`,
      areaProblems.length === 0,
      areaProblems.join("; "),
    );

    // -- no breakpoint table row claims an IAS target ------------------------
    check(
      `${where}: publishes no IAS breakpoint row`,
      !/\bIAS\b/i.test(text) || build.breakpoints.some((b) => b.stat === "ias"),
    );
  }
}

// ---------------------------------------------------------------------------
console.log("\nThe two locales are structurally equivalent, not merely both present");
// ---------------------------------------------------------------------------
for (const source of AMAZON) {
  const [en, pt] = LOCALES.map((locale) =>
    visible(readFileSync(pageFor(locale, source.classSlug, source.slug), "utf8")),
  );
  const build = getBuilds("en-us").find((b) => b.slug === source.slug)!;

  /*
   * Section headings and tier labels are translated, so structure is compared
   * through the things ADR 0003 keeps invariant: skill names and item names.
   * Every one of them must appear on both pages, which is what proves the
   * pt-BR page carries the same gear plan rather than a shorter one.
   */
  const itemNames = new Set<string>();
  const walk = (pick: { ref?: ItemRef; alternatives?: unknown[] }) => {
    if (pick.ref) itemNames.add(resolveRef("en-us", pick.ref).name);
    for (const alt of (pick.alternatives ?? []) as (typeof pick)[]) walk(alt);
  };
  for (const set of build.gearSets) {
    for (const entry of set.slots) entry.picks.forEach(walk);
    (set.charms ?? []).forEach(walk);
    (set.weaponSwap ?? []).forEach(walk);
  }
  const invariants = [
    ...build.skills.map((a) => getSkill("en-us", a.skill)!.name),
    ...itemNames,
  ];
  const enMissing = invariants.filter((v) => !en.includes(v));
  const ptMissing = invariants.filter((v) => !pt.includes(v));
  check(
    `${source.slug}: both locales carry the same ${invariants.length} invariants`,
    enMissing.length === 0 && ptMissing.length === 0,
    `en missing [${enMissing}] pt missing [${ptMissing}]`,
  );

  // And the pt-BR page must not simply be the en-US one: if the prose were
  // untranslated, the two would share long runs of text.
  const sentence = build.playstyle.slice(0, 80);
  check(
    `${source.slug}: the pt-BR page does not reuse the en-US playstyle`,
    en.includes(sentence) && !pt.includes(sentence),
  );
}

// ---------------------------------------------------------------------------
console.log("\nA negative control: these assertions can fail");
// ---------------------------------------------------------------------------
{
  const html = readFileSync(pageFor("en-us", "amazon", "lightning-fury-amazon"), "utf8");
  const text = visible(html);
  check(
    "a string that is not on the page is reported as absent",
    !text.includes("Zzyzx Amazon of the Nonexistent Tree"),
  );
  check(
    "the visible-text filter really does remove the RSC payload",
    html.includes("<script") && !text.includes("<script"),
  );
  check(
    "and it keeps rendered prose",
    text.includes("The fastest clear in the game in dense areas"),
  );
}

// ---------------------------------------------------------------------------
console.log(
  failures.length === 0
    ? `\n${passed} checks passed across ${AMAZON.length} Amazon pages in ${LOCALES.length} locales.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
