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
import {
  getBuilds,
  getFarmingArea,
  getJourneys,
  getMercenary,
  getSkill,
  resolveRef,
} from "../lib/registry";
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

/**
 * The `<section id="mercenary">` block of a build page, or nothing.
 *
 * Sliced out with a depth counter rather than a lazy regex: `</section>` from a
 * nested section would close the match early and the assertions below would
 * then be reading whatever followed.
 */
function mercenarySection(html: string): string | undefined {
  const opener = /<section[^>]*\bid="mercenary"[^>]*>/.exec(html);
  if (!opener) return undefined;
  const from = opener.index + opener[0].length;
  const tag = /<section\b[^>]*>|<\/section>/g;
  tag.lastIndex = from;
  let depth = 0;
  let match: RegExpExecArray | null;
  while ((match = tag.exec(html)) !== null) {
    if (match[0].startsWith("</")) {
      if (depth === 0) return html.slice(from, match.index);
      depth--;
    } else depth++;
  }
  return undefined;
}

/**
 * Name elements whose entire text is lower case — a slug wearing spaces.
 *
 * Scoped to elements whose class *begins* with `font-medium`, which is how both
 * `ItemRefLink` and the plain-label fallback render a reference name. A badge
 * also carries `font-medium`, in the middle of a long utility list, and its
 * text ("budget", "endgame") is legitimately lower case — matching on the class
 * position is what keeps those out without an exception list.
 *
 * An item name is title case and a label is a sentence, so a match here is a
 * slug and nothing else.
 */
function slugLookingLabels(section: string): string[] {
  const found: string[] = [];
  for (const m of section.matchAll(/<\w+[^>]*class="font-medium[^"]*"[^>]*>([^<]*)</g)) {
    const text = m[1].trim();
    if (/^[a-z]+(?: [a-z]+)*$/.test(text)) found.push(text);
  }
  return found;
}

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

  /*
   * The sweep has to have read something, or every assertion above passes by
   * never running. This used to pin the census as two literals — 18 and 54 —
   * which held until a class shipped builds with packages and then failed on
   * arithmetic rather than on a defect.
   *
   * So the expectation is counted from the registry instead, in its own pass.
   * That is not a constant compared with itself: the loop increments only for
   * a build whose page was actually prerendered and read, while this counts
   * every build that *should* have one. A page that fails to render still
   * fails the check, which is the property the two literals were there for.
   */
  let expectedPages = 0;
  let expectedPackages = 0;
  for (const locale of LOCALES) {
    for (const build of getBuilds(locale)) {
      const groups = build.skillPackages ?? [];
      if (groups.length === 0) continue;
      expectedPages++;
      for (const group of groups) expectedPackages += group.packages.length;
    }
  }
  check(
    "the sweep read every page that publishes packages, in both locales",
    expectedPages > 0 &&
      pagesWithPackages === expectedPages &&
      routesChecked === expectedPackages,
    `${pagesWithPackages}/${expectedPages} pages, ${routesChecked}/${expectedPackages} packages`,
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
  `\nThe mercenary's gear is a reference, not a slug (all ${getBuilds("en-us").length} builds, both locales)`,
);
// ---------------------------------------------------------------------------
/*
 * The build page printed `g.ref.slug.replace(/-/g, " ")` — "the reapers toll",
 * lower case, unlinked — and dropped `g.why` entirely, while `/mercenaries`
 * rendered the same data through `<ItemRefLink>` with the reasoning under it.
 * It was the only cross-reference on the site that did not resolve.
 *
 * Checked on every build page rather than on the contracted three: the defect
 * is structural, so scoping it would leave fifty pages unguarded.
 */
{
  let rows = 0;
  const problems: string[] = [];
  const slugs: string[] = [];
  for (const locale of LOCALES) {
    const t = dictionaryFor(locale);
    for (const build of getBuilds(locale)) {
      if (!build.mercenary) continue;
      const merc = getMercenary(locale, build.mercenary);
      if (!merc) {
        problems.push(`${locale}/${build.slug}: mercenary ${build.mercenary} does not resolve`);
        continue;
      }
      const section = mercenarySection(readFileSync(pageFor(locale, build.classSlug, build.slug), "utf8"));
      if (section === undefined) {
        problems.push(`${locale}/${build.slug}: no mercenary section in the HTML`);
        continue;
      }
      const text = visible(section);
      const where = `${locale}/${build.slug}`;

      for (const g of merc.gear) {
        rows++;
        if (g.ref) {
          const resolved = resolveRef(locale, g.ref);
          if (!text.includes(resolved.name)) problems.push(`${where}: ${resolved.name} not rendered`);
          if (resolved.href && !section.includes(`href="${resolved.href}"`)) {
            problems.push(`${where}: no link to ${resolved.href}`);
          }
        } else if (g.label && !text.includes(g.label)) {
          problems.push(`${where}: label "${g.label}" not rendered`);
        }
        if (!text.includes(longestPlainRun(g.why))) {
          problems.push(`${where}: why for ${g.slot} missing — "${longestPlainRun(g.why)}"`);
        }
      }

      /*
       * The shape of the defect, taken straight from the acceptance criterion:
       * a `.font-medium` element whose whole text is lower-case words is a slug
       * that had its hyphens swapped for spaces.
       */
      for (const raw of slugLookingLabels(section)) {
        slugs.push(`${where}: “${raw}”`);
      }
      // And the section really is the mercenary one.
      if (!text.includes(t.builds.mercGear)) problems.push(`${where}: no gear heading in the section`);
    }
  }
  check(`all ${rows} mercenary gear rows resolve, link and explain`, problems.length === 0, problems.slice(0, 6).join("; "));
  check("no name in a mercenary section reads as a slug", slugs.length === 0, `${slugs.length}: ${slugs.slice(0, 6).join("; ")}`);
  check("there were gear rows to check", rows > 300, `${rows}`);
}

/*
 * Anti-vacuity for both scanners, against the markup the page used to emit and
 * the markup it emits now.
 */
{
  const badge =
    '<span class="inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium">budget</span>';
  const old =
    `<section id="mercenary"><h4>Gear</h4><ul><li><span class="w-16">Weapon</span>${badge}` +
    '<span class="font-medium text-ink">the reapers toll</span></li>' +
    `<li><span class="w-16">Body Armor</span>${badge}<span class="font-medium text-ink">treachery</span></li></ul></section>`;
  check(
    "control: the slug scanner fires on the retired markup, one and many words",
    slugLookingLabels(old).join("|") === "the reapers toll|treachery",
    slugLookingLabels(old).join("|"),
  );
  const fixed =
    `<section id="mercenary"><h4>Gear</h4><ul><li><span class="w-16">Weapon</span>${badge}` +
    '<a class="font-medium text-rarity-unique underline" href="/en-us/items/reapers-toll">The Reaper&#x27;s Toll</a></li></ul></section>';
  check("control: the slug scanner ignores a resolved name and a tier badge", slugLookingLabels(fixed).length === 0);
  check("control: the section extractor finds the mercenary section", mercenarySection(old) !== undefined);
  check("control: the section extractor returns nothing when there is none", mercenarySection("<p>x</p>") === undefined);
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
