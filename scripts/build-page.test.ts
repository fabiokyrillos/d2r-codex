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
 * Scoped to the classes published under the completeness contract — the Amazon,
 * the Necromancer, and since the Druid pass the Druid too. That scoping is the
 * same judgement
 * `amazon-rules.ts` records: a gate that forces edits to already-approved
 * content in order to go green gets argued with rather than obeyed. The
 * structural assertions that are class-agnostic run over every build page on
 * the site, in both locales, and are marked as such below.
 *
 * Requires `npm run build`. Run with `npm run test:build-page`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";

import { dictionaryFor, fmt } from "../lib/i18n";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { getBuilds, getFarmingArea, getJourneys, getSkill, resolveRef } from "../lib/registry";
import type { ItemRef } from "../lib/types";
import { MAX_HARD_POINTS } from "../lib/skills";
import { packageMath } from "../lib/builds/packages";

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

/**
 * The longest stretch of an authored string that renders as one contiguous run.
 *
 * `**bold**` becomes a `<strong>` element, and `visible()` replaces every tag
 * with a space — so a slice taken across a bold boundary picks up whitespace
 * the source does not have and never matches. Taking the longest segment
 * *between* markers gives a fragment that is guaranteed contiguous in the
 * output, which is what an assertion about rendered prose actually needs.
 */
const longestPlainRun = (authored: string, cap = 45) =>
  authored
    .split(/\*\*|`/)
    .map((run) => run.trim())
    .sort((a, b) => b.length - a.length)[0]
    .slice(0, cap);

/** The classes whose pages this file holds to the full contract. */
const CONTRACTED_CLASSES = ["amazon", "necromancer", "druid"] as const;
const CONTRACTED = getBuilds("en-us").filter((b) =>
  (CONTRACTED_CLASSES as readonly string[]).includes(b.classSlug),
);

/** Every mandatory total the eight pages printed, collected as they are checked. */
const totalsSeen = new Set<number>();

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
console.log(
  `\nThe ${CONTRACTED.length} contracted pages say what the data says, in both locales`,
);
// ---------------------------------------------------------------------------
for (const locale of LOCALES) {
  const t = dictionaryFor(locale);
  const localised = getBuilds(locale);

  for (const source of CONTRACTED) {
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
    /*
     * The whole legend phrase, not the two numbers in it.
     *
     * This assertion used to be `text.includes("109") && text.includes("110")`,
     * and on the Lightning Fury page it could be satisfied without the legend
     * rendering at all: Titan's Revenge asks 109 Dexterity, and 110 is
     * Thundergod's Vigor's Strength requirement. Two gear numbers, on a page
     * whose budget could then say anything. The block after this loop proves
     * that, rather than asserting it.
     */
    const legend = fmt(t.skills.legendMandatory, {
      points: mandatory,
      cap: MAX_HARD_POINTS,
    });
    check(`${where}: prints "${legend}"`, text.includes(legend));
    // And prints exactly one total: a neighbouring value in the same phrase is
    // what a drifting plan would render.
    for (const wrong of [mandatory - 1, mandatory + 1]) {
      check(
        `${where}: does not also claim ${wrong} of ${MAX_HARD_POINTS}`,
        !text.includes(fmt(t.skills.legendMandatory, { points: wrong, cap: MAX_HARD_POINTS })),
      );
    }
    totalsSeen.add(mandatory);
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
for (const source of CONTRACTED) {
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
console.log("\nThe budget assertion is co-located, and the old one was not");
// ---------------------------------------------------------------------------
{
  // Both totals the eight plans actually spend must have been exercised, or the
  // loop above could have checked one shape of legend eight times.
  check(
    "both 108 and 109 of 110 were asserted across the eight pages",
    totalsSeen.has(108) && totalsSeen.has(109),
    [...totalsSeen].sort().join(", "),
  );

  /*
   * The proof, on the real page rather than on a fixture. Delete the legend
   * phrase from the rendered text and the old assertion still passes, because
   * both of its numbers are gear requirements elsewhere on the same page. The
   * new one fails, which is the entire point of the change.
   */
  for (const locale of LOCALES) {
    const t = dictionaryFor(locale);
    const build = getBuilds(locale).find((b) => b.slug === "lightning-fury-amazon")!;
    const mandatory = build.skills
      .filter((s) => s.role !== "flex" && s.points > 0)
      .reduce((sum, s) => sum + s.points, 0);
    const legend = fmt(t.skills.legendMandatory, { points: mandatory, cap: MAX_HARD_POINTS });
    const text = visible(readFileSync(pageFor(locale, "amazon", build.slug), "utf8"));
    const withoutLegend = text.split(legend).join(" ");

    check(
      `${locale}: removing the legend really removes it`,
      text.includes(legend) && !withoutLegend.includes(legend),
    );
    check(
      `${locale}: the old bare-number check passes on a page with no budget legend`,
      withoutLegend.includes(String(mandatory)) && withoutLegend.includes(String(MAX_HARD_POINTS)),
      `${mandatory} and ${MAX_HARD_POINTS} both still present as gear requirements`,
    );
    check(
      `${locale}: and both numbers appear outside the legend, so that is not a fluke`,
      new RegExp(`\\b${mandatory}\\b`).test(withoutLegend) &&
        new RegExp(`\\b${MAX_HARD_POINTS}\\b`).test(withoutLegend),
    );
  }
}

// ---------------------------------------------------------------------------
console.log("\nOptional packages survive rendering, in both locales and with no JavaScript");
// ---------------------------------------------------------------------------
{
  /*
   * A package is arithmetic that a reader spends real points on, and every
   * number of it is derived at render time. Which means the failure mode is not
   * a wrong number in the data — the allocation tests cover that — it is a
   * correct model wired to a prop that does not render, or rendered only once
   * the client bundle arrives.
   *
   * So this reads the prerendered HTML with every `<script>` stripped: what is
   * left is what a reader with no JavaScript, or a crawler, or a screen reader
   * on a slow connection actually receives.
   */
  let pagesWithPackages = 0;
  let routesChecked = 0;

  for (const locale of LOCALES) {
    const t = dictionaryFor(locale);
    for (const build of getBuilds(locale)) {
      const groups = build.skillPackages ?? [];
      if (groups.length === 0) continue;
      const file = pageFor(locale, build.classSlug, build.slug);
      if (!existsSync(file)) {
        check(`${locale}/${build.slug}: the page was prerendered`, false, file);
        continue;
      }
      pagesWithPackages++;
      const text = visible(readFileSync(file, "utf8"));
      const label = `${locale}/${build.slug}`;

      for (const group of groups) {
        check(`${label}: the group is on the page`, text.includes(group.name), group.name);

        // The exclusivity has to be *stated*, not implied by layout. Without it
        // three alternatives read as three things to buy, which is the exact
        // failure the model exists to stop.
        const exclusivity =
          group.choose === "one"
            ? fmt(t.builds.packageChooseOne, { total: group.packages.length })
            : fmt(t.builds.packageChooseAny, { total: group.packages.length });
        check(`${label}: and says in words that it is a choice`, text.includes(exclusivity), exclusivity);

        for (const pkg of group.packages) {
          routesChecked++;
          const math = packageMath(build, pkg);
          const sums = fmt(t.builds.packageArithmetic, {
            core: math.core,
            cost: math.cost,
            total: math.total,
            cap: MAX_HARD_POINTS,
          });

          check(`${label}/${pkg.id}: the route is named`, text.includes(pkg.name), pkg.name);
          // The visible total is the model's total, character for character.
          // A page that prints its own arithmetic and a model that computes a
          // different one is the divergence nothing else here would see.
          check(`${label}/${pkg.id}: and prints the arithmetic the model derives`, text.includes(sums), sums);
          check(
            `${label}/${pkg.id}: and says how much is left, including when it is none`,
            text.includes(fmt(t.builds.packageFree, { points: math.free })),
            `${math.free}`,
          );
          // Through `longestPlainRun`, because `**bold**` renders as a
          // `<strong>` and `visible()` turns every tag into a space — a slice
          // taken across a marker never matches its own source.
          check(
            `${label}/${pkg.id}: and gives the case for it and the case against`,
            text.includes(longestPlainRun(pkg.when)) &&
              text.includes(longestPlainRun(pkg.tradeoff)),
          );

          // Every allocation, with the points a reader will see on their own
          // skill screen and the cost they pay to get there.
          for (const delta of math.deltas) {
            const skill = getSkill(locale, delta.skill);
            check(
              `${label}/${pkg.id}: ${delta.skill} shows ${delta.from} to ${delta.to}`,
              text.includes(skill?.name ?? delta.skill) &&
                text.includes(fmt(t.builds.packageFromTo, { from: delta.from, to: delta.to })),
            );
          }
        }
      }

      /*
       * The core tree keeps its own meaning. Every package skill drawn onto it
       * at package strength would be the "max everything" tree in a different
       * shape, so the legend must still report the core, and only the core.
       */
      const core = build.skills.reduce((sum, a) => sum + a.points, 0);
      check(
        `${label}: the tree legend still reports the core alone`,
        text.includes(fmt(t.skills.legendMandatory, { points: core, cap: MAX_HARD_POINTS })),
        `${core}`,
      );
      const anyTotal = groups
        .flatMap((g) => g.packages)
        .map((p) => packageMath(build, p).total);
      check(
        `${label}: and never as though a package were mandatory`,
        anyTotal.every(
          (total) =>
            total === core ||
            !text.includes(fmt(t.skills.legendMandatory, { points: total, cap: MAX_HARD_POINTS })),
        ),
      );
    }
  }

  check(
    "the sweep read the pages that publish packages, in both locales",
    pagesWithPackages === 16 && routesChecked === 48,
    `${pagesWithPackages} pages, ${routesChecked} routes`,
  );

  /*
   * The control. Everything above reads text with `<script>` removed, so it
   * would pass identically on a page that shipped the packages only in the RSC
   * payload — unless the stripping is real and the section is genuinely in the
   * server-rendered markup.
   */
  const html = readFileSync(pageFor("en-us", "sorceress", "nova-sorceress"), "utf8");
  const scriptless = html.replace(/<script[\s\S]*?<\/script>/g, " ");
  check(
    "and they are in the markup with every script element removed",
    scriptless.includes("The Hydra hybrid") && scriptless.includes("Choose exactly 1 of 3"),
  );
  check(
    "which is a claim about the page, because removing the scripts removed most of it",
    scriptless.length < html.length * 0.6,
    `${Math.round((scriptless.length / html.length) * 100)}% left`,
  );
  check(
    "a package name that does not exist is reported as absent",
    !visible(html).includes("The Zzyzx Route"),
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
console.log("\nEvery journey page was prerendered, and carries its own stages");
// ---------------------------------------------------------------------------

/*
 * Journeys had no built-page gate at all. The build pages got one because a
 * build page is the deepest structure on the site — but a journey is the second
 * deepest, it is where a new player starts, and its stages are the one place
 * where a wrong unlock level costs a reader six levels of waiting.
 *
 * The Necromancer journey is the reason this exists now: its whole point is two
 * corrected levels, and nothing was reading the rendered page to confirm they
 * survived translation and rendering.
 */
for (const locale of LOCALES) {
  for (const journey of getJourneys(locale)) {
    const file = join(root, locale, "leveling", `${journey.classSlug}.html`);
    const where = `${locale}/leveling/${journey.classSlug}`;
    if (!existsSync(file)) {
      check(`${where}: prerendered`, false, "file missing");
      continue;
    }
    const text = visible(readFileSync(file, "utf8"));
    check(`${where}: prerendered`, true);
    check(`${where}: renders its summary`, text.includes(journey.summary.slice(0, 50)));

    const stagesMissing = journey.stages.filter((s) => !text.includes(s.name));
    check(
      `${where}: all ${journey.stages.length} stages render their name`,
      stagesMissing.length === 0,
      stagesMissing.map((s) => s.slug).join(", "),
    );
    const goalsMissing = journey.stages.filter((s) => !text.includes(s.goal.slice(0, 35)));
    check(
      `${where}: every stage renders its goal`,
      goalsMissing.length === 0,
      goalsMissing.map((s) => s.slug).join(", "),
    );
    if (journey.respecPlan) {
      const respecMissing = journey.respecPlan.filter((r) => !text.includes(r.at));
      check(
        `${where}: all ${journey.respecPlan.length} respec entries render`,
        respecMissing.length === 0,
        respecMissing.map((r) => r.at).join(" | "),
      );
    }
  }
}

// ---------------------------------------------------------------------------
console.log("\nThe Necromancer's corrected claims survived rendering, in both locales");
// ---------------------------------------------------------------------------

/*
 * The rules in `necromancer-claims.ts` run over the data. These run over the
 * HTML, because the failure this pass actually hit was a rendering one: build
 * pages printed `respecAt` without RichText, so `**A respec that removes your
 * point in Iron Golem…**` reached a shipped page with its asterisks intact.
 * Every gate over the data was green while that was true.
 *
 * Each assertion below is a claim the summons research changed, checked as a
 * reader would see it.
 */
{
  const NECROMANCER = getBuilds("en-us").filter((b) => b.classSlug === "necromancer");
  check("three Necromancer builds are published", NECROMANCER.length === 3, `${NECROMANCER.length}`);

  for (const locale of LOCALES) {
    const pages: { where: string; text: string }[] = NECROMANCER.map((b) => ({
      where: `${locale}/${b.slug}`,
      text: visible(readFileSync(pageFor(locale, b.classSlug, b.slug), "utf8")),
    }));
    pages.push({
      where: `${locale}/leveling/necromancer`,
      text: visible(readFileSync(join(root, locale, "leveling", "necromancer.html"), "utf8")),
    });

    for (const { where, text } of pages) {
      // The retired claim, as rendered. A page may say summons do NOT take it.
      const claimsPenalty = /(?:summons?|minions?|skeletons?|invoca[çc]|lacaios?|esqueletos?)[^.]{0,80}(?:takes?|suffers?|sofre[m]?|perde[m]?)[^.]{0,40}(?:−40|−100)/i.test(
        text,
      );
      const refutes = /(?:do not|does not|n[ãa]o)[^.]{0,60}(?:−40|−100)/i.test(text);
      check(
        `${where}: does not claim summons take the difficulty penalty`,
        !claimsPenalty || refutes,
      );

      // No expensive item is offered to the golem, in rendered text.
      const feeds = /Iron Golem[^.]{0,120}\b(?:Pride|Infinity|Beast|Insight|Fortitude|Enigma)\b/i.test(
        text,
      );
      const refusesFeeding = /(?:never|not|n[ãa]o|nunca)[^.]{0,140}\b(?:Pride|Infinity|Beast|Insight)\b/i.test(
        text,
      );
      check(`${where}: offers the Iron Golem no expensive item`, !feeds || refusesFeeding);
    }

    /*
     * Decrepify's level, on the three pages whose plans turn on it.
     *
     * Asserted through the authored note rather than by pattern-matching the
     * flattened page. The first draft looked for "Decrepify … level 30" and
     * fired on all four pages — because the rendered skill tree lists tier rows
     * as "Level 24 … Decrepify … Level 30 Lower Resist", which is the tree being
     * *correct*. Reading the note the build actually authors keeps the check on
     * the claim rather than on the layout, and `checkUnlockLevelClaims` already
     * owns the negative half at the data layer, precisely.
     */
    for (const build of getBuilds(locale).filter((b) => b.classSlug === "necromancer")) {
      const note = build.skills.find((a) => a.skill === "decrepify")?.note;
      if (!note) continue;
      const text = visible(readFileSync(pageFor(locale, "necromancer", build.slug), "utf8"));
      check(
        `${locale}/${build.slug}: renders its Decrepify note, which states level 24`,
        text.includes(longestPlainRun(note)) && /\b24\b/.test(note),
        `looked for "${longestPlainRun(note)}"`,
      );
    }
  }

  // A control: the penalty detector is capable of firing.
  check(
    "control: the penalty detector fires on the retired sentence",
    /(?:summons?|minions?|skeletons?)[^.]{0,80}(?:takes?|suffers?)[^.]{0,40}(?:−40|−100)/i.test(
      "Your skeletons take the −100 resistance penalty in Hell.",
    ),
  );
  // And a control that the golem detector is capable of firing.
  check(
    "control: the golem detector fires on a real recommendation",
    /Iron Golem[^.]{0,120}\b(?:Pride|Infinity|Beast|Insight|Fortitude|Enigma)\b/i.test(
      "Feed the Iron Golem a spare Pride for its Concentration aura.",
    ),
  );
}

// ---------------------------------------------------------------------------
console.log(
  failures.length === 0
    ? `\n${passed} checks passed across ${CONTRACTED.length} contracted build pages, ` +
        `${getJourneys("en-us").length} journeys and ${LOCALES.length} locales.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
