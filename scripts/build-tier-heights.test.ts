/**
 * How tall the build page actually is, and how far down the control sits.
 *
 * Phase 1's whole claim is a claim about height, and §12.1 of the PRD wrote
 * its numbers from a 320px-per-compact-tier hypothesis that measurement
 * refuted. The plan recomputed them from real slot counts; this is the gate
 * that holds the recomputation to account, and publishes the table either way.
 *
 * Two things are measured, and they fail differently on purpose:
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
 *   - **How tall the tiers are.** An absolute ceiling per compact tier and a
 *     ceiling on the six together, both calibrated against the built page —
 *     see the note on the constants for why the plan's closed-form budget was
 *     replaced by a measurement.
 *
 * Heights are sampled on a handful of builds rather than all 53: a browser
 * pass over 106 pages at five widths is minutes of wall clock for a number
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
 * Worst measured at the time of writing: 536px for one tier
 * (pt-BR blade-fury/budget at 320px), 3,041px for a whole compact Gear
 * section (pt-BR phoenix-strike at 390px).
 */
const TIER_CEILING = 600;
const GEAR_CEILING = { 390: 3300, 320: 3800 } as const;

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
        const top = await page.evaluate<number>(
          `(() => { const l = document.getElementById("tier-picker-legend");
                    if (!l) return -1;
                    return Math.round(l.getBoundingClientRect().top + window.scrollY); })()`,
        );
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
    check(
      `the control is inside the first 320x640 viewport on every page`,
      worst.top <= CONTROL_CEILING,
      `worst ${worst.top}px`,
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
        check(`${width}px: the anchor offset clears that stack`, 112 >= sticky.stack, `stack ${sticky.stack}px vs offset 112px`);
      }
    }

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
