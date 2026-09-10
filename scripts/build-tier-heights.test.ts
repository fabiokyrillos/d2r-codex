/**
 * How tall the build page actually is, and how far down the control sits.
 *
 * Phase 1's whole claim is a claim about height, and §12.1 of the PRD wrote
 * its numbers from a 320px-per-compact-tier hypothesis that measurement
 * refuted. The plan recomputed them from real slot counts; this is the gate
 * that holds the recomputation to account, and publishes the table either way.
 *
 * Three things are measured, and they fail differently on purpose:
 *
 *   - **Where the control is.** R-BUILD-1 wants it inside the first 320x640
 *     viewport. The owner set two levels: 560px is the target, 640px is a
 *     hard ceiling. Between them the gate stays green and the pages are
 *     *published* as exceeding the target, because the alternative — a
 *     permanent exception list — turns a measurement into paperwork nobody
 *     rereads. Above 640px the gate goes red and the phase stops.
 *     All 53 builds in both languages, because the failure this exists to
 *     catch is "it fitted on the build I happened to open".
 *
 *   - **Where the summary's trigger is.** The same sweep, one element lower.
 *     The control sits inside the first screen on every page and the trigger
 *     below it does not, which is a fact C14's own number cannot express — see
 *     `SECTIONS_TRIGGER_CEILING` for the distribution and for why the fold is
 *     published while a regression ceiling is asserted.
 *
 *   - **How tall the tiers are.** An absolute ceiling per compact tier and a
 *     ceiling on the six together, both calibrated against the built page —
 *     see the note on the constants for why the plan's closed-form budget was
 *     replaced by a measurement.
 *
 * Heights are sampled on a handful of builds rather than all 53: a browser
 * pass over every build page at five widths is minutes of wall clock for a number
 * that varies with slot count, and the slot counts are already swept by the
 * file-reading gate. The control position is not sampled, because that
 * varies with the title, which is per build.
 *
 * Requires `npm run build`. Run with `npm run test:build-tier-heights`.
 */
import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { getBuilds } from "../lib/registry";
import { LOCALES } from "../lib/i18n/config";
import { tierOrder } from "../lib/labels";

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

assertFreshBuild();

/** R-BUILD-1's target, and the owner's hard ceiling. */
const CONTROL_TARGET = 560;
const CONTROL_CEILING = 640;

/**
 * The summary's trigger, which is C14's second row — and the number the owner
 * asked for.
 *
 * C14 above measures the *tier control's* top, and §3.7 of the Phase 2 plan
 * forbids inserting anything above that control below 640px because the control
 * has nothing left to give: a 44px block there costs its own height plus the
 * `space-y-12` gap, which takes the worst page from 575px to 667px and straight
 * through C14's hard 640 ceiling. The summary therefore ships as a sibling
 * *below* the control — and that is precisely the position C14 cannot see. The
 * control can be at 457px on the same page whose trigger is at 777px, and a
 * reader holding a phone meets the second number, not the first.
 *
 * So it is measured here, on the same 53 builds x 2 locales x 320x640 pass, for
 * the same reason C14 sweeps every build page rather than sampling: the failure
 * worth catching is "it fitted on the build I happened to open". It is read on
 * the served, settled element — `page-sections.tsx` ships the disclosure closed and
 * no script ever writes `open`, so hydration cannot move this number, and it
 * does not: `hydrated()` has already resolved when it is taken.
 *
 * **Measured over all 53 builds in both languages: min 593px, median 659px, max
 * 777px, and 84 of them start past the 640px fold** — 593/659/748 and 40 past it
 * in en-US, 593/681/777 and 44 past it in pt-BR. The two worst are pt-BR
 * `assassin/lightning-trapsin` and `assassin/whirlwind-assassin`, both at 777px:
 * the same two pages and the same number the seven-page sample in §3.7 reported,
 * which is the sweep saying the sample was not lucky.
 *
 * **What that means on a phone.** On a 320x640 screen the first thing a reader
 * sees is the build's own opening; the tier control lands inside that first
 * screen on every build page (C14), and on 84 of them the "where am I" summary
 * does not — it is one short scroll away, at worst 137px past the fold, about a
 * fifth of a screen. Twenty-two do show it without scrolling. That is the
 * deliberate half of §3.7's trade, not an accident: the only way to put the
 * trigger on the first screen is to put it above the tier control, and the table
 * in §3.7 shows what that does to the control.
 *
 * **Why the fold is published and 850 is asserted.** 640 is a fact about the
 * reader, not a regression signal — asserting it would turn this gate red on 84
 * pages today with nothing behind it, and the two-level shape C14 already uses
 * (`CONTROL_TARGET` published, `CONTROL_CEILING` asserted) exists for exactly
 * this shape of number. The ceiling is the worst measured value plus the same
 * headroom every other constant in this file documents: 777 x 1.1 is ~855,
 * rounded down to the next ten, which is 9.4% — against `TIER_CEILING`'s 9.5%
 * and `TIER_CEILING_WITH_NEXT`'s 9.2%. Same policy, new measurement, no new
 * rule. What 850 catches is a change that pushes the trigger a further screen
 * down the page; what it deliberately does not catch is the fold, which is the
 * owner's call and is printed for them every run.
 *
 * *(§3.7 named a contingency — if the trigger exceeds 640px on any build page
 * the summary becomes a line inside the control block rather than a
 * sibling below it. It exceeds it on 84. That is a design decision, so this gate
 * publishes the number and holds the position against regression rather than
 * making the decision by going red.)*
 */
const SECTIONS_TRIGGER_FOLD = 640;
const SECTIONS_TRIGGER_CEILING = 850;

/**
 * Compact-tier ceilings, calibrated against the built page.
 *
 * The plan carried a closed-form budget, `f(N, G) = 118.5 + 22N + 19.25(G-2)`,
 * derived from the type scale. Measured against the real render it is
 * consistently 4-12% low, and at 320px it is wrong in kind rather than in
 * degree: the preview's own slot lines wrap there, which no function of slot
 * count and goal lines can see. §3.1 of the plan said the budget would be
 * fixed "após a medição da implementação real, não do piso", and this is that
 * measurement.
 *
 * So the gate is an absolute ceiling per tier plus a ceiling on the six
 * together, both set above the worst measured value with headroom. That is
 * what the gate is actually for: catching a regression that makes compact
 * tiers balloon, not validating an arithmetic model. The real numbers are
 * printed either way, and the phase publishes them.
 *
 * Worst measured after the summary was brought back to the type scale §5.4
 * specifies: 420px for one tier and 2,349px for six of them, both pt-BR
 * phoenix-strike at 320px. The ceilings sit about 10% above those, which is
 * tight enough to catch a regression and loose enough to survive an editor
 * lengthening one `goal`.
 */
const TIER_CEILING = 460;
const GEAR_CEILING = { 390: 2300, 320: 2550 } as const;

/**
 * The ceiling for the one compact tier that carries R-BUILD-7's "Next:" line.
 *
 * `TIER_CEILING` above is deliberately **not** raised. It still guards the
 * other five tiers, and a gate that gets looser to admit a feature has stopped
 * being a gate. This constant applies to exactly one tier per page — the
 * compact tier immediately after the expanded one, which is the only place the
 * line is ever drawn — so the suite gets *more* specific, not slacker. The
 * attribution is R-BUILD-7, via §3.8.2 of the Phase 2 plan.
 *
 * Measured by the commit-2 prototype over the seven subjects below x 2 locales
 * x {390, 320}, with each tier's real `nextUpgrade` at `line-clamp-2` in the
 * preview's `text-sm`: the line costs **+46 to +47px**, uniformly across all
 * 140 cells, and the worst tier carrying it is **467px** — pt-BR
 * `blade-fury/budget` at 320px, the eleven-slot tier. Tiers without the line do
 * not move at all, which is why none of the other six constants above changes.
 *
 * 510, not 470. The plan's first rule was "measured, rounded up to the next
 * ten", which leaves **3px** over 467 — a gate that goes red on a font metric
 * or on an editor lengthening one `goal`, with no regression behind it. The
 * policy this file already documents two paragraphs up is a different one, and
 * it is the one applied here: *the ceilings sit about 10% above the worst
 * measured value*, which is what 460 over 420 is (9.5%). 467 x 1.1 is ~514, so
 * 510 — 9.2%. Same policy, new measurement, no new rule.
 */
const TIER_CEILING_WITH_NEXT = 510;

/**
 * The tier C13b expands, chosen so the tier *after* it is the worst cell.
 *
 * `early-hell` open puts the line on `budget`, and pt-BR `blade-fury/budget` at
 * 320px is the 467px measurement `TIER_CEILING_WITH_NEXT` is calibrated on.
 * Expanding anything else would exercise the constant somewhere with more room.
 */
const WITH_NEXT_EXPANDED = "early-hell";

/**
 * The nine acceptance rows of the plan's §3.4, as measured.
 *
 * The plan projected these from a per-tier formula. The formula was 4-12%
 * low at 390px and wrong in kind at 320px, where the preview's own slot
 * lines wrap, so these are the numbers the built page actually produces plus
 * roughly 3% of headroom — and they are *asserted*, not printed. A published
 * number is not an acceptance criterion; the whole point of §14's "aritmética
 * recalculada a partir das medições reais" is that the recalculation is held
 * to account by something that can fail.
 *
 * The deltas against the PRD's original §12.1 figures are published in the
 * phase report rather than hidden here: Gear compact 1,920 -> 2,034 (+114),
 * page compact ~17,500 -> 18,344 (+844), page with one tier open 21,000 ->
 * 21,582 (+582), all on the reference build in en-US at 390px.
 */
const ACCEPTANCE: Record<string, { compactGear: number; compactPage: number; openGear: number; openPage: number }> = {
  "en-us": { compactGear: 2100, compactPage: 18500, openGear: 5530, openPage: 21970 },
  "pt-br": { compactGear: 2220, compactPage: 19300, openGear: 5880, openPage: 23020 },
};

/*
 * Phase 2 moved two of these eight numbers, and left six alone. Which six is
 * the point.
 *
 * R-BUILD-6's markers and R-BUILD-7's "Next:" line both land inside a tier that
 * is *open*, so they cost nothing at all on a first visit. Measured on the
 * reference build after Phase 2:
 *
 *              Phase 1    Phase 2    cap      what moved
 *   compactGear  2034       2034     2100     nothing
 *   compactPage 18344      18430    18500     the summary's 38px trigger
 *   openGear     5272       5397     5530  <- markers + majority + the line
 *   openPage    21582      21793    21970  <- the same, on the whole page
 *
 * `compactGear` is *identical* to the pixel, which is the design of section
 * 3.8.1 doing its job: the "Next:" line is drawn only on the compact tier after
 * the expanded one, so with no preference stored there is no expanded tier and
 * no line anywhere. That is what keeps `MIN_GEAR_REDUCTION` — Phase 1's
 * published 87.6% claim, which is a product statement and not a calibration —
 * untouched and unnegotiated.
 *
 * The two that moved are raised by exactly the measured growth, preserving the
 * headroom each already carried (en: +128 on openGear, +168 on openPage; pt:
 * +144 and +199), rounded up to the next ten. `openGear` is raised even though
 * it was still passing: 5397 against 5400 is three pixels, and a three-pixel
 * gate is not a gate — one font metric or one longer `goal` turns it red with
 * no regression behind it. That is the same reasoning that set
 * TIER_CEILING_WITH_NEXT, and it is the reasoning the constants above already
 * document for themselves.
 */

/** The baseline this phase reduces, measured on the same build at 2873b61. */
const BASELINE = { gear: 16458, page: 32574 };
const MIN_GEAR_REDUCTION = 0.87;
const MIN_PAGE_REDUCTION = 0.43;

const HEIGHT_SUBJECTS = [
  "blizzard-sorceress",
  "blade-fury",
  "phoenix-strike",
  "fire-trapsin",
  "whirlwind-assassin",
  "tesladin",
  "leap-attack-barbarian",
];

const hydrated = (page: Page) =>
  page.waitFor(`document.querySelectorAll("button[data-tier]").length === 6`, 15_000);

async function main() {
  const site = await startSite();
  const page = await Page.launch();

  const overTarget: { page: string; top: number }[] = [];
  const overCeiling: { page: string; top: number }[] = [];
  let worst = { page: "", top: 0 };
  const triggers: { page: string; top: number }[] = [];
  const triggerMissing: string[] = [];

  try {
    // -----------------------------------------------------------------------
    // C14 — where the control sits, on all 53 builds in both languages
    // -----------------------------------------------------------------------
    console.log("\nC14 · the control's position at 320x640, all 53 builds x 2 locales\n");
    await page.setViewport(320, 640);
    await page.goto(`${site.origin}/en-us`);
    await page.evaluate(`(() => { try { localStorage.clear(); } catch {} return 1; })()`);

    for (const locale of LOCALES) {
      for (const build of getBuilds(locale)) {
        const path = `/${locale}/builds/${build.classSlug}/${build.slug}`;
        await page.goto(`${site.origin}${path}`);
        await hydrated(page);
        const seen = await page.evaluate<{ control: number; trigger: number }>(
          `(() => {
             const top = (n) => (n ? Math.round(n.getBoundingClientRect().top + window.scrollY) : -1);
             const d = document.querySelector("[data-sections]");
             return { control: top(document.getElementById("tier-picker-legend")),
                      trigger: top(d ? d.querySelector("summary") : null) };
           })()`,
        );
        if (seen.trigger < 0) triggerMissing.push(path);
        else triggers.push({ page: path, top: seen.trigger });
        const top = seen.control;
        if (top < 0) {
          overCeiling.push({ page: path, top: -1 });
          continue;
        }
        if (top > worst.top) worst = { page: path, top };
        if (top > CONTROL_CEILING) overCeiling.push({ page: path, top });
        else if (top > CONTROL_TARGET) overTarget.push({ page: path, top });
      }
    }

    const total = LOCALES.length * getBuilds("en-us").length;
    const withinTarget = total - overTarget.length - overCeiling.length;
    console.log(`  measured ${total} pages`);
    console.log(`  within the ${CONTROL_TARGET}px target : ${withinTarget}`);
    console.log(`  between ${CONTROL_TARGET + 1} and ${CONTROL_CEILING}px  : ${overTarget.length}`);
    console.log(`  above the ${CONTROL_CEILING}px ceiling  : ${overCeiling.length}`);
    console.log(`  worst observed                : ${worst.top}px on ${worst.page}`);
    if (overTarget.length) {
      console.log(`\n  exceeding the target (published, not a failure):`);
      for (const r of overTarget.sort((a, b) => b.top - a.top)) console.log(`    ${r.top}px  ${r.page}`);
    }

    check(
      `no page's control is past the ${CONTROL_CEILING}px ceiling`,
      overCeiling.length === 0,
      overCeiling.map((r) => `${r.page} @${r.top}`).slice(0, 5).join(" | "),
    );
    check("the control is present on every build page", worst.top > 0);

    // -----------------------------------------------------------------------
    // C14b — and where the summary's trigger sits, on the same sweep
    // -----------------------------------------------------------------------
    const spread = (rows: { top: number }[]) => {
      const s = rows.map((r) => r.top).sort((a, b) => a - b);
      if (s.length === 0) return "no rows";
      return `${s[0]} / ${s[Math.floor((s.length - 1) / 2)]} / ${s[s.length - 1]}`;
    };
    const pastFold = triggers.filter((t) => t.top > SECTIONS_TRIGGER_FOLD);
    const worstTrigger = triggers.reduce((a, b) => (b.top > a.top ? b : a), { page: "", top: -1 });
    const overTriggerCeiling = triggers.filter((t) => t.top > SECTIONS_TRIGGER_CEILING);

    console.log(`\n  the summary's trigger, the same ${triggers.length} pages at the same 320x640\n`);
    console.log(`  min / median / max            : ${spread(triggers)}px`);
    for (const locale of LOCALES) {
      const rows = triggers.filter((t) => t.page.startsWith(`/${locale}/`));
      const past = rows.filter((t) => t.top > SECTIONS_TRIGGER_FOLD).length;
      console.log(`    ${locale} (${rows.length} pages)         : ${spread(rows)}px, ${past} past the fold`);
    }
    console.log(`  within the ${SECTIONS_TRIGGER_FOLD}px fold          : ${triggers.length - pastFold.length}`);
    console.log(`  past it (published, not a failure) : ${pastFold.length}`);
    console.log(`  headroom to the ${SECTIONS_TRIGGER_CEILING}px ceiling  : ${SECTIONS_TRIGGER_CEILING - worstTrigger.top}px`);
    console.log(`\n  the five furthest down:`);
    for (const r of [...triggers].sort((a, b) => b.top - a.top).slice(0, 5)) {
      console.log(`    ${r.top}px  ${r.page}  (+${r.top - SECTIONS_TRIGGER_FOLD} past the fold)`);
    }

    check(
      "the summary trigger is present on every build page",
      triggerMissing.length === 0,
      triggerMissing.slice(0, 5).join(" | "),
    );
    check(
      `no page's summary trigger is past the ${SECTIONS_TRIGGER_CEILING}px ceiling`,
      triggers.length > 0 && overTriggerCeiling.length === 0,
      overTriggerCeiling.map((r) => `${r.page} @${r.top}`).slice(0, 5).join(" | "),
    );

    /*
     * Anti-vacuity, on the worst real page rather than a synthetic one.
     *
     * The assertion above is a comparison against a number nothing on the site
     * currently approaches, which is the shape of assertion that quietly stops
     * measuring anything — a selector that goes stale reports `-1`, a probe that
     * loses `scrollY` reports a viewport-relative number, and both are under 850
     * forever. So the same probe is run three times on the same element: as
     * served, with a block planted above the disclosure that is tall enough to
     * push it past the ceiling, and after that block is removed again.
     *
     * The planted height is the ceiling itself, so this control cannot go quiet
     * if the ceiling is ever raised, and the third read proves the DOM was put
     * back the way it was found.
     *
     * It asserts a *delta* rather than "the page starts under the ceiling",
     * which is deliberate and was learned from running it: with a 128px block
     * planted between the control and the summary in the page source, the worst
     * page went 777 -> 953px, the assertion above went red as it should, and the
     * earlier form of this control went red beside it for the second-order
     * reason that its premise had stopped holding. A control that fails when the
     * thing it is controlling fails reports nothing.
     */
    await page.goto(`${site.origin}${worstTrigger.page}`);
    await hydrated(page);
    const plantedTop = await page.evaluate<{ before: number; planted: number; back: number }>(
      `(() => {
         const d = document.querySelector("[data-sections]");
         const s = d && d.querySelector("summary");
         if (!s) return { before: -1, planted: -1, back: -1 };
         const top = () => Math.round(s.getBoundingClientRect().top + window.scrollY);
         const before = top();
         const spacer = document.createElement("div");
         spacer.style.height = "${SECTIONS_TRIGGER_CEILING}px";
         d.parentElement.insertBefore(spacer, d);
         const planted = top();
         spacer.remove();
         return { before, planted, back: top() };
       })()`,
    );
    check(
      `control: on ${worstTrigger.page}, a planted block pushes the trigger past ${SECTIONS_TRIGGER_CEILING}px`,
      plantedTop.before === worstTrigger.top &&
        plantedTop.planted >= plantedTop.before + SECTIONS_TRIGGER_CEILING &&
        plantedTop.planted > SECTIONS_TRIGGER_CEILING,
      `${plantedTop.before}px as served (the sweep read ${worstTrigger.top}px) -> ${plantedTop.planted}px planted`,
    );
    check(
      "control: …and removing it reads the original number back",
      plantedTop.back === plantedTop.before,
      `${plantedTop.back}px vs ${plantedTop.before}px`,
    );

    // -----------------------------------------------------------------------
    // C13 — tier heights against the plan's formula
    // -----------------------------------------------------------------------
    console.log("\nC13 · compact tier heights against f(N, G)\n");
    for (const width of [390, 320]) {
      await page.setViewport(width, width === 320 ? 640 : 844);
      for (const locale of LOCALES) {
        const builds = getBuilds(locale).filter((b) => HEIGHT_SUBJECTS.includes(String(b.slug)));
        for (const build of builds) {
          await page.goto(`${site.origin}/${locale}/builds/${build.classSlug}/${build.slug}`);
          await hydrated(page);
          const measured = await page.evaluate<{ tier: string; h: number; lines: number }[]>(
            `(() => ${JSON.stringify(tierOrder)}.map((t) => {
               const d = document.getElementById("gear-" + t);
               const sec = d ? d.parentElement : null;
               const goal = d ? d.querySelector("summary > span:last-child") : null;
               const lh = goal ? parseFloat(getComputedStyle(goal).lineHeight) || 26 : 26;
               return {
                 tier: t,
                 h: sec ? Math.round(sec.getBoundingClientRect().height) : -1,
                 lines: goal ? Math.max(1, Math.round(goal.getBoundingClientRect().height / lh)) : 2,
               };
             }))()`,
          );
          const over = measured
            .filter((m) => m.h > TIER_CEILING)
            .map((m) => `${m.tier} ${m.h}px`);
          const total = measured.reduce((a, m) => a + Math.max(0, m.h), 0);
          const cap = GEAR_CEILING[width as 390 | 320];
          const shape = measured
            .map((m) => {
              const set = build.gearSets.find((g) => g.tier === m.tier);
              return `${m.tier}:${m.h}px/${set ? set.slots.length : "?"}slots`;
            })
            .join(" ");
          console.log(`       ${locale}/${build.slug} @${width}  six=${total}px  ${shape}`);
          check(
            `${locale}/${build.slug} @${width}: no compact tier over ${TIER_CEILING}px`,
            over.length === 0,
            over.join(" | "),
          );
          check(
            `${locale}/${build.slug} @${width}: the six together are under ${cap}px`,
            total <= cap,
            `${total}px`,
          );
        }
      }
    }

    // -----------------------------------------------------------------------
    // C13b — the one compact tier that carries the "Next:" line (R-BUILD-7)
    // -----------------------------------------------------------------------
    /*
     * C13 above runs with no preference, so all six tiers are compact and no
     * line is drawn anywhere — which is the whole reason the first visit stays
     * at the height Phase 1 published. That also means C13 can never exercise
     * `TIER_CEILING_WITH_NEXT`, and a constant no assertion reaches is
     * decoration. This block seeds a preference and measures the state a reader
     * with one actually gets.
     *
     * Three things are asserted here and nowhere else:
     *
     *   - **exactly one** line is displayed on the page. "Show it on every
     *     compact tier" is the M12b mutation, it costs ~230px, and it breaks
     *     six of the seven constants — but only if something counts.
     *   - it is on the tier **immediately after** the expanded one, which is
     *     the difference between a bridge and a repetition.
     *   - the tier carrying it clears `TIER_CEILING_WITH_NEXT`, and every other
     *     compact tier still clears the unchanged `TIER_CEILING`.
     *
     * Displayed, not present: the line is served on all five eligible tiers and
     * revealed by CSS, so `getComputedStyle` is the only thing that can tell
     * the two apart. Reading the markup would count five every time.
     */
    console.log(`\nC13b · with ${WITH_NEXT_EXPANDED} expanded, one compact tier carries the "Next:" line\n`);
    let worstWithLine = { page: "", tier: "", h: 0 };
    for (const width of [390, 320]) {
      await page.setViewport(width, width === 320 ? 640 : 844);
      for (const locale of LOCALES) {
        const builds = getBuilds(locale).filter((b) => HEIGHT_SUBJECTS.includes(String(b.slug)));
        for (const build of builds) {
          await page.goto(`${site.origin}/en-us`);
          await page.evaluate(
            `(() => { try { localStorage.setItem("d2rc.tier", ${JSON.stringify(WITH_NEXT_EXPANDED)}); } catch {} return 1; })()`,
          );
          await page.goto(`${site.origin}/${locale}/builds/${build.classSlug}/${build.slug}`);
          await hydrated(page);
          const measured = await page.evaluate<{ tier: string; h: number; open: boolean; line: boolean }[]>(
            `(() => ${JSON.stringify(tierOrder)}.map((t) => {
               const d = document.getElementById("gear-" + t);
               const sec = d ? d.parentElement : null;
               const p = sec ? sec.querySelector("[data-tier-next]") : null;
               return {
                 tier: t,
                 h: sec ? Math.round(sec.getBoundingClientRect().height) : -1,
                 open: !!(d && d.open),
                 line: !!(p && getComputedStyle(p).display !== "none"),
               };
             }))()`,
          );
          const where = `${locale}/${build.slug} @${width}`;
          const open = measured.filter((m) => m.open).map((m) => m.tier);
          const shown = measured.filter((m) => m.line);
          const expected = tierOrder[tierOrder.indexOf(WITH_NEXT_EXPANDED) + 1];
          const carrier = measured.find((m) => m.tier === expected);
          const others = measured.filter((m) => !m.open && m.tier !== expected);
          const over = others.filter((m) => m.h > TIER_CEILING).map((m) => `${m.tier} ${m.h}px`);
          if (carrier && carrier.h > worstWithLine.h) {
            worstWithLine = { page: `${locale}/${build.slug} @${width}`, tier: carrier.tier, h: carrier.h };
          }
          console.log(
            `       ${where}  open=[${open}]  line on ${shown.map((m) => m.tier).join(",") || "nothing"}  ` +
              `${expected}=${carrier ? carrier.h : "?"}px`,
          );
          check(`${where}: exactly one tier displays the line`, shown.length === 1, `[${shown.map((m) => m.tier)}]`);
          check(
            `${where}: it is the tier right after the expanded one`,
            shown.length === 1 && shown[0].tier === expected,
            `${shown[0]?.tier ?? "none"} instead of ${expected}`,
          );
          check(
            `${where}: the tier carrying the line is under ${TIER_CEILING_WITH_NEXT}px`,
            !!carrier && carrier.h <= TIER_CEILING_WITH_NEXT,
            `${carrier ? carrier.h : "?"}px`,
          );
          check(
            `${where}: every tier without the line is still under ${TIER_CEILING}px`,
            over.length === 0,
            over.join(" | "),
          );
        }
      }
    }
    console.log(
      `\n  worst tier carrying the line: ${worstWithLine.h}px (${worstWithLine.tier}, ${worstWithLine.page}) ` +
        `against a ceiling of ${TIER_CEILING_WITH_NEXT}\n`,
    );
    await page.goto(`${site.origin}/en-us`);
    await page.evaluate(`(() => { try { localStorage.clear(); } catch {} return 1; })()`);

    // -----------------------------------------------------------------------
    // The page and section numbers the phase publishes
    // -----------------------------------------------------------------------
    console.log("\npublished measurements (390px, no preference and one tier expanded)\n");
    await page.setViewport(390, 844);
    for (const locale of LOCALES) {
      for (const slug of HEIGHT_SUBJECTS) {
        const build = getBuilds(locale).find((b) => String(b.slug) === slug);
        if (!build) continue;
        await page.goto(`${site.origin}/en-us`);
        await page.evaluate(`(() => { try { localStorage.clear(); } catch {} return 1; })()`);
        await page.goto(`${site.origin}/${locale}/builds/${build.classSlug}/${build.slug}`);
        await hydrated(page);
        const compact = await page.evaluate<{ doc: number; gear: number }>(
          `(() => ({ doc: Math.round(document.documentElement.scrollHeight),
                     gear: Math.round(document.getElementById("gear").getBoundingClientRect().height) }))()`,
        );
        await page.goto(`${site.origin}/en-us`);
        await page.evaluate(`(() => { try { localStorage.setItem("d2rc.tier", "optimized"); } catch {} return 1; })()`);
        await page.goto(`${site.origin}/${locale}/builds/${build.classSlug}/${build.slug}`);
        await hydrated(page);
        const opened = await page.evaluate<{ doc: number; gear: number }>(
          `(() => ({ doc: Math.round(document.documentElement.scrollHeight),
                     gear: Math.round(document.getElementById("gear").getBoundingClientRect().height) }))()`,
        );
        console.log(
          `  ${locale}/${slug}: compact page ${compact.doc} gear ${compact.gear} | ` +
            `one open page ${opened.doc} gear ${opened.gear}`,
        );

        /*
         * Asserted on the reference build only — §12 of the PRD names
         * `/en-us/builds/sorceress/blizzard-sorceress` as the baseline, and
         * the other six vary by non-Gear content that this phase does not
         * touch. Their numbers are published above either way, including
         * `leap-attack-barbarian`, the catalogue's tallest page.
         */
        if (slug === "blizzard-sorceress") {
          const a = ACCEPTANCE[locale];
          check(`${locale}: Gear with six compact tiers <= ${a.compactGear}px`, compact.gear <= a.compactGear, `${compact.gear}px`);
          check(`${locale}: the page with six compact tiers <= ${a.compactPage}px`, compact.doc <= a.compactPage, `${compact.doc}px`);
          check(`${locale}: Gear with the worst tier open <= ${a.openGear}px`, opened.gear <= a.openGear, `${opened.gear}px`);
          check(`${locale}: the page with the worst tier open <= ${a.openPage}px`, opened.doc <= a.openPage, `${opened.doc}px`);
          if (locale === "en-us") {
            const gearCut = 1 - compact.gear / BASELINE.gear;
            const pageCut = 1 - compact.doc / BASELINE.page;
            check(
              `Gear is at least ${Math.round(MIN_GEAR_REDUCTION * 100)}% shorter than the ${BASELINE.gear}px baseline`,
              gearCut >= MIN_GEAR_REDUCTION,
              `${(gearCut * 100).toFixed(1)}%`,
            );
            check(
              `the first visit is at least ${Math.round(MIN_PAGE_REDUCTION * 100)}% shorter than the ${BASELINE.page}px baseline`,
              pageCut >= MIN_PAGE_REDUCTION,
              `${(pageCut * 100).toFixed(1)}%`,
            );
            console.log(`       reduction: Gear ${(gearCut * 100).toFixed(1)}%  page ${(pageCut * 100).toFixed(1)}%`);
          }
        }
      }
    }

    // -----------------------------------------------------------------------
    // C17 — nothing but the header is sticky below 640px
    // -----------------------------------------------------------------------
    console.log("\nC17 · sticky budget\n");
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewport(width, width === 320 ? 640 : 844);
      await page.goto(`${site.origin}/en-us/builds/sorceress/blizzard-sorceress`);
      await hydrated(page);
      /*
       * Scoped to the gear nav, not to every sticky element on the page.
       *
       * From 1024px the skill-tree panel is also sticky, in a different
       * section entirely. Summing it with the gear nav reported a 137px stack
       * that never exists: the two are never pinned above the same content.
       * What R-A11Y-8 budgets is what sits above an anchored tier, which is
       * the header plus this one bar.
       */
      const sticky = await page.evaluate<{ other: string[]; stack: number }>(
        `(() => {
           const all = [...document.querySelectorAll("*")].filter((n) => getComputedStyle(n).position === "sticky");
           const other = all.filter((n) => !n.closest("header"));
           const h = document.querySelector("header");
           const nav = document.querySelector("#gear nav");
           const stack = Math.round((h ? h.getBoundingClientRect().height : 0) +
             (nav && getComputedStyle(nav).position === "sticky" ? nav.getBoundingClientRect().height : 0));
           return { other: other.map((n) => n.tagName + "." + String(n.className).slice(0, 30)), stack };
         })()`,
      );
      if (width < 640) {
        check(`${width}px: the header is the only sticky element in the gear section`,
          !sticky.other.some((n) => n.includes("gear") || n.includes("NAV")), sticky.other.join(" | "));
        check(`${width}px: the gear nav is not pinned`, sticky.stack === 57, `${sticky.stack}px`);
      } else {
        check(`${width}px: header + the gear nav stack to <= 112px`, sticky.stack <= 112, `${sticky.stack}px`);
      }
    }

    // -----------------------------------------------------------------------
    // Where an anchor actually lands
    // -----------------------------------------------------------------------

    /*
     * Measured, not summed.
     *
     * `scroll-padding-top` and `scroll-margin-top` are two halves of one
     * number, and asserting either alone says nothing about where the reader
     * ends up. Both halves were individually correct while `scroll-mt-16`
     * sat on a wrapper that is never the fragment's target, so every tier
     * landed 8px from the top with 49px of itself behind the header — and
     * two green assertions covered it.
     *
     * With scripting disabled, because that is the path R-BUILD-12 promises
     * and the one where nothing can correct the landing afterwards.
     */
    console.log("\nanchor landing, scripting disabled\n");
    for (const width of [390, 1280]) {
      await page.setViewport(width, width === 390 ? 844 : 900);
      await page.setScriptsEnabled(false);
      await page.goto(`${site.origin}/en-us/builds/sorceress/blizzard-sorceress#gear-budget`);
      await page.setScriptsEnabled(true);
      const seen = await page.evaluate<{ top: number; headerBottom: number; margin: string }>(
        `(() => { const t = document.getElementById("gear-budget");
                  const h = document.querySelector("header");
                  return { top: Math.round(t.getBoundingClientRect().top),
                           headerBottom: Math.round(h.getBoundingClientRect().bottom),
                           margin: getComputedStyle(t).scrollMarginTop }; })()`,
      );
      await page.setScriptsEnabled(false);
      const want = width >= 640 ? 112 : 72;
      check(
        `${width}px: the fragment target carries the scroll margin`,
        seen.margin === "64px",
        `${seen.margin} on #gear-budget itself`,
      );
      check(
        `${width}px: an anchored tier lands at ${want}px, not under the header`,
        Math.abs(seen.top - want) <= 4,
        `landed at ${seen.top}px, header ends at ${seen.headerBottom}px`,
      );
      check(
        `${width}px: …and clear of the header`,
        seen.top >= seen.headerBottom - 1,
        `top ${seen.top} vs header bottom ${seen.headerBottom}`,
      );
    }
    await page.setScriptsEnabled(true);

    // -----------------------------------------------------------------------
    // C15 — touch targets
    // -----------------------------------------------------------------------
    console.log("\nC15 · touch targets\n");
    for (const width of [320, 390]) {
      await page.setViewport(width, 640);
      await page.goto(`${site.origin}/pt-br/builds/sorceress/blizzard-sorceress`);
      await hydrated(page);
      const targets = await page.evaluate<{ main: number[]; mirror: number[] }>(
        `(() => {
           const box = (n) => { const r = n.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
           return {
             main: [...document.querySelectorAll("[data-tier]")].flatMap(box),
             mirror: [...document.querySelectorAll("[data-tier-mirror]")].flatMap(box),
           };
         })()`,
      );
      check(`${width}px: the primary control is at least 44px on both axes`, Math.min(...targets.main) >= 44, `min ${Math.min(...targets.main)}`);
      check(`${width}px: the mirror clears the 24px minimum`, Math.min(...targets.mirror) >= 24, `min ${Math.min(...targets.mirror)}`);
    }

    // -----------------------------------------------------------------------
    // Reduced motion, and the anchor offset the CSS and the module share
    // -----------------------------------------------------------------------
    console.log("\nreduced motion and anchor offset\n");
    {
      await page.setViewport(390, 844);
      await page.goto(`${site.origin}/en-us/builds/sorceress/blizzard-sorceress`);
      const normal = await page.evaluate<string>(`getComputedStyle(document.documentElement).scrollBehavior`);
      const padNarrow = await page.evaluate<string>(`getComputedStyle(document.documentElement).scrollPaddingTop`);
      await page.setViewport(1280, 900);
      await page.goto(`${site.origin}/en-us/builds/sorceress/blizzard-sorceress`);
      const padWide = await page.evaluate<string>(`getComputedStyle(document.documentElement).scrollPaddingTop`);
      check("scrolling is smooth by default", normal === "smooth", normal);
      check("below 640px the anchor offset leaves no room for a bar that is not there", padNarrow === "8px", padNarrow);
      check("from 640px it clears the sticky mirror", padWide === "48px", padWide);

      const reduced = await Page.launch();
      try {
        await reduced.addInitScript(`
          const mm = window.matchMedia.bind(window);
          window.matchMedia = (q) => q.includes("prefers-reduced-motion") ? { matches: true, media: q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){}, onchange: null, dispatchEvent(){ return false; } } : mm(q);
        `);
        await reduced.setViewport(390, 844);
        await reduced.setColorScheme("dark");
        await reduced.goto(`${site.origin}/en-us/builds/sorceress/blizzard-sorceress`);
        const emulated = await reduced.evaluate<string>(
          `(() => { const s = document.createElement("style");
                    s.textContent = "@media (prefers-reduced-motion: reduce){html{--probe:1}}";
                    document.head.appendChild(s);
                    return getComputedStyle(document.documentElement).scrollBehavior; })()`,
        );
        // The emulation above cannot move a CSS media query, so this asserts the
        // rule exists in the sheet rather than that the browser is honouring it.
        const hasRule = await reduced.evaluate<boolean>(
          `[...document.styleSheets].some((sh) => { try {
             return [...sh.cssRules].some((r) => String(r.cssText).includes("prefers-reduced-motion") && String(r.cssText).includes("scroll-behavior"));
           } catch { return false; } })`,
        );
        check("a reduced-motion rule for scroll-behavior is in the stylesheet", hasRule, `computed stayed ${emulated}`);
      } finally {
        reduced.close();
      }
    }
  } finally {
    page.close();
    site.stop();
  }

  console.log(`\n${passed} checks passed.`);
  if (failures.length) {
    console.error(`\n${failures.length} FAILED:`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
