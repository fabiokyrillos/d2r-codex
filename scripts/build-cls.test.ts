/**
 * Layout shift on the build page, on both ways in.
 *
 * R-BUILD-10 puts a number on this — CLS < 0.1 when the page loads with a
 * preference — and it is the one requirement in Phase 1 that no amount of
 * reading markup can answer. The whole design of the enhancement is built
 * around it: the six tiers collapse before the first paint on a hard load,
 * and before paint on a soft one.
 *
 * Two loads, because they use different machinery and only one of them is
 * covered by the inline script:
 *
 *   - **Hard load.** The inline script runs during parse. Nothing has been
 *     painted, so the collapse costs nothing.
 *   - **Soft navigation** from `/builds`, which is how a reader actually
 *     arrives (J1 → J3). The script does not run — Next inserts it through a
 *     DOM update and inserted scripts do not execute — so the collapse falls
 *     to a layout effect. Get that wrong and ~16,000px of expanded gear
 *     paints and then vanishes, and it is invisible to the hard-load test.
 *
 * `buffered: true` is what makes the observer trustworthy here: `layout-shift`
 * is a buffered entry type, so an observer created after load still receives
 * the entries that happened before it existed. Without it this file would
 * measure the quiet part of the page and always pass.
 *
 * Requires `npm run build`. Run with `npm run test:build-cls`.
 */
import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { LOCALES } from "../lib/i18n/config";
import { TIER_KEY } from "../lib/prefs";

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

const BUILD = { classSlug: "sorceress", slug: "blizzard-sorceress" };
const LIMIT = 0.1;

/** Sums every shift the reader did not cause. */
const CLS = `(() => new Promise((resolve) => {
  let total = 0;
  const obs = new PerformanceObserver((list) => {
    for (const e of list.getEntries()) if (!e.hadRecentInput) total += e.value;
  });
  obs.observe({ type: "layout-shift", buffered: true });
  setTimeout(() => { obs.disconnect(); resolve(Math.round(total * 1000) / 1000); }, 1200);
}))()`;

/**
 * Watches for a frame in which more than one tier is expanded.
 *
 * CLS alone would miss the soft-navigation defect when the gear section is
 * below the fold: the shift is real but off-screen, so it scores zero while
 * the reader on a hash-linked page still lands in the wrong place. Counting
 * open tiers every frame catches the paint itself.
 */
const WATCH_OPEN = `(() => {
  window.__maxOpen = 0;
  const tick = () => {
    const n = document.querySelectorAll('#gear details[open]').length;
    if (n > window.__maxOpen) window.__maxOpen = n;
    window.__raf = requestAnimationFrame(tick);
  };
  tick();
  return 1;
})()`;

async function main() {
  const site = await startSite();
  let page = await Page.launch();

  try {
    // -----------------------------------------------------------------------
    // Control — the observer can see a shift, so a zero means something
    // -----------------------------------------------------------------------
    console.log("\ncontrol · the observer reports a real shift");
    {
      await page.setViewport(390, 844);
      /*
       * On a blank document, not on the site.
       *
       * Rewriting `document.body` under a live React root is a fight — the
       * first attempt at this control hung the evaluate — and the control
       * does not need the site: it is a claim about the observer, not about
       * the page.
       *
       * The shift also has to move content the browser has already painted.
       * Inserting the nodes and resizing them in the same frame reports
       * nothing, because the first paint of new content is not a shift. That
       * is how this control scored 0 on its first run, and it would have
       * certified every measurement below as meaningful when it was not.
       *
       * And not too early: Chrome reports no layout shift in a document's
       * first ~500ms (measured 2026-09-11: a resize at 450ms scores 0, at
       * 500ms 0.229 — an animation frame or two after the insert scores 0
       * as well), and at the tail of a full `check:built`, with a dozen
       * browser gates behind it, a 500ms timer scored 0 twice over a correct
       * observer. So the first resize waits a full second, and if no entry
       * arrives it resizes again — up to three 660px shifts, until one is
       * seen. The 700ms after each resize stay: the entry is delivered
       * asynchronously.
       */
      await page.goto("about:blank");
      const shifted = await page.evaluate<number>(`(() => new Promise((resolve) => {
        document.body.style.margin = "0";
        document.body.innerHTML = '<div id="a" style="height:40px"></div><div id="b" style="height:900px;background:#111">shift me</div>';
        let total = 0;
        const obs = new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) total += e.value; });
        obs.observe({ type: "layout-shift", buffered: true });
        const go = (tries) => {
          const a = document.getElementById("a");
          a.style.height = (parseFloat(a.style.height) + 660) + "px";
          setTimeout(() => {
            if (total > 0 || tries >= 3) { obs.disconnect(); resolve(Math.round(total * 1000) / 1000); }
            else go(tries + 1);
          }, 700);
        };
        setTimeout(() => go(1), 1000);
      }))()`);
      check("a deliberately shifting page scores above the limit", shifted > LIMIT, `scored ${shifted}`);
    }

    // -----------------------------------------------------------------------
    // C12 — hard load, with and without a preference
    // -----------------------------------------------------------------------
    console.log("\nC12 · hard load");
    for (const locale of LOCALES) {
      for (const pref of [null, "budget"] as (string | null)[]) {
        page.close();
        page = await Page.launch();
        await page.setViewport(390, 844);
        await page.goto(`${site.origin}/en-us`);
        if (pref) {
          await page.evaluate(
            `(() => { try { localStorage.setItem(${JSON.stringify(TIER_KEY)}, ${JSON.stringify(pref)}); } catch {} return 1; })()`,
          );
        }
        await page.goto(`${site.origin}/${locale}/builds/${BUILD.classSlug}/${BUILD.slug}`);
        const cls = await page.evaluate<number>(CLS);
        const label = `${locale}, ${pref ? `preference=${pref}` : "no preference"}`;
        check(`${label}: CLS ${cls} < ${LIMIT}`, cls < LIMIT, `scored ${cls}`);
      }
    }

    // -----------------------------------------------------------------------
    // C12b — soft navigation, which the inline script cannot reach
    // -----------------------------------------------------------------------
    console.log("\nC12b · soft navigation from /builds");
    for (const locale of LOCALES) {
      page.close();
      page = await Page.launch();
      await page.setViewport(390, 844);
      await page.goto(`${site.origin}/en-us`);
      await page.evaluate(
        `(() => { try { localStorage.setItem(${JSON.stringify(TIER_KEY)}, "budget"); } catch {} return 1; })()`,
      );
      await page.goto(`${site.origin}/${locale}/builds`);
      await page.evaluate(WATCH_OPEN);

      const href = `/${locale}/builds/${BUILD.classSlug}/${BUILD.slug}`;
      const clicked = await page.evaluate<boolean>(
        `(() => { const a = document.querySelector('a[href="${href}"]'); if (!a) return false; a.click(); return true; })()`,
      );
      check(`${locale}: the listing links to the build`, clicked, `no a[href="${href}"]`);
      if (!clicked) continue;

      const arrived = await page.waitFor(`location.pathname === "${href}"`, 15_000);
      check(`${locale}: the soft navigation completed`, arrived);
      if (!arrived) continue;

      const cls = await page.evaluate<number>(CLS);
      const maxOpen = await page.evaluate<number>(
        `(() => { cancelAnimationFrame(window.__raf); return window.__maxOpen; })()`,
      );
      const open = await page.evaluate<string[]>(
        `[...document.querySelectorAll('#gear details[open]')].map(d => d.id)`,
      );
      check(`${locale}: CLS ${cls} < ${LIMIT} on the soft path`, cls < LIMIT, `scored ${cls}`);
      check(
        `${locale}: no frame ever painted more than one tier open`,
        maxOpen <= 1,
        `peaked at ${maxOpen} — the collapse ran after paint`,
      );
      check(`${locale}: and the preferred tier is the one open`, open.join() === "gear-budget", `[${open}]`);
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
