/**
 * The mobile menu, driven the way a reader drives it.
 *
 * The defect this file was written for: the header's disclosure lives in the
 * persistent root layout, so a client-side navigation keeps the same DOM node.
 * An uncontrolled `<details open>` therefore survives the navigation, and the
 * reader lands on the destination page with the menu still covering it. Every
 * other gate passed on that markup — the HTML was correct, the links resolved,
 * the accessible name was right. It is a fact about a DOM node's lifetime
 * across a soft navigation, so it needs a browser and a real route change.
 *
 * The one assertion that makes the rest meaningful is that the navigation is
 * *soft*. A full page load produces fresh HTML with the menu shut whatever the
 * component does, so a test that let the browser reload would pass against the
 * broken code. Every navigation here plants a marker on `window` first and
 * fails if it did not survive.
 *
 * Requires `npm run build`. Run with `npm run test:mobile-navigation`.
 */
import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";
import { routes } from "../lib/routes";
import { getClasses } from "../lib/registry";
import type { Slug } from "../lib/types";

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

/** A phone, not a tablet: the menu trigger is only rendered below 1400px. */
const WIDTH = 390;

/**
 * Whether the disclosure is open, however it is built.
 *
 * Written to survive the implementation change it was made for: a native
 * `<details>` reports `open`, a button-and-panel reports `aria-expanded`. A
 * test that only knew one of them would have to be rewritten by the change it
 * exists to verify, which is how a gate quietly stops testing anything.
 */
const IS_OPEN = `(() => {
  const d = document.querySelector('header details');
  if (d) return d.open === true;
  const b = document.querySelector('header button[aria-expanded]');
  return !!b && b.getAttribute('aria-expanded') === 'true';
})()`;

/** The trigger, either way. */
const TRIGGER = `(document.querySelector('header summary') || document.querySelector('header button[aria-expanded]'))`;

/** The links inside the panel, either way. */
const ITEMS = `(() => {
  const d = document.querySelector('header details');
  if (d) return [...d.querySelectorAll('a[href]')];
  const b = document.querySelector('header button[aria-expanded]');
  const panel = b && b.getAttribute('aria-controls')
    ? document.getElementById(b.getAttribute('aria-controls'))
    : null;
  return panel ? [...panel.querySelectorAll('a[href]')] : [];
})()`;

/**
 * Whether React has taken the disclosure over.
 *
 * This matters because the element works *before* it does: the served markup is
 * a native `<details>`, so a press opens it whether or not the bundle has
 * arrived. Driving it during that window and then asserting on Escape tests
 * nothing — the listeners are not attached yet — and it fails intermittently,
 * which is worse than failing. That is exactly what happened here: "Escape
 * closes the menu" failed while "Escape returns focus to the trigger" passed,
 * because focus was already on the trigger from the press that opened it.
 *
 * A React-owned DOM node carries `__reactFiber$…`/`__reactProps$…` keys, and
 * this one gets them because it has an `onToggle`. It is an internal, so the
 * probe is asserted per locale rather than only waited on — if React stops
 * marking nodes this way the gate says so instead of quietly going back to
 * racing hydration.
 */
const HYDRATED = `(() => {
  const d = document.querySelector('header details');
  return !!d && Object.keys(d).some((k) => k.startsWith('__react'));
})()`;

/** Centre of an element, in viewport coordinates. */
const centreOf = async (page: Page, expr: string) =>
  page.evaluate<{ x: number; y: number } | null>(
    `(() => { const el = ${expr}; if (!el) return null; const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return null;
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`,
  );

/** Opens the menu with a real pointer press on the trigger, once it is live. */
async function openMenu(page: Page): Promise<boolean> {
  if (!(await page.waitFor(HYDRATED, 10_000))) return false;
  const spot = await centreOf(page, TRIGGER);
  if (!spot) return false;
  await page.click(spot.x, spot.y);
  return page.waitFor(IS_OPEN, 3000);
}

/** Marks the current document so a full reload can be told from a soft one. */
const PLANT = `window.__softNav = 'alive'`;
const SURVIVED = `window.__softNav === 'alive'`;

async function main(): Promise<void> {
  const site = await startSite();
  const page = await Page.launch();

  try {
    for (const l of LOCALES) {
      const locale = l as Locale;
      const r = routes(locale);
      const t = dictionaryFor(locale);
      console.log(`\n— ${locale} —`);

      // ---------------------------------------------------------------------
      // 1. The defect: the menu survives a client-side navigation
      // ---------------------------------------------------------------------
      await page.setViewport(WIDTH);
      await page.goto(site.origin + r.home());
      check(`${locale}: the trigger exists`, (await centreOf(page, TRIGGER)) !== null);
      check(`${locale}: it starts closed`, (await page.evaluate<boolean>(IS_OPEN)) === false);
      check(
        `${locale}: the disclosure is hydrated, so the probe still works`,
        await page.waitFor(HYDRATED, 10_000),
      );
      check(`${locale}: it opens on a real press`, await openMenu(page));

      await page.evaluate(PLANT);
      const target = await page.evaluate<string | null>(
        `(() => { const a = ${ITEMS}.find(a => a.getAttribute('href') !== ${JSON.stringify(r.home())});
          return a ? a.getAttribute('href') : null; })()`,
      );
      check(`${locale}: the open menu offers a destination`, target !== null, String(target));
      if (target) {
        const spot = await centreOf(
          page,
          `${ITEMS}.find(a => a.getAttribute('href') === ${JSON.stringify(target)})`,
        );
        check(`${locale}: that destination is hittable`, spot !== null);
        if (spot) {
          await page.click(spot.x, spot.y);
          const arrived = await page.waitFor(
            `location.pathname === ${JSON.stringify(target)}`,
            8000,
          );
          check(`${locale}: following it reaches ${target}`, arrived);
          check(
            `${locale}: and it was a soft navigation, not a reload`,
            await page.evaluate<boolean>(SURVIVED),
          );
          // The whole point.
          check(
            `${locale}: the menu is shut on the destination page`,
            (await page.evaluate<boolean>(IS_OPEN)) === false,
          );
        }
      }

      // ---------------------------------------------------------------------
      // 2. Activating a link to the page you are already on also closes it
      // ---------------------------------------------------------------------
      {
        await page.goto(site.origin + r.builds());
        await openMenu(page);
        const spot = await centreOf(
          page,
          `${ITEMS}.find(a => a.getAttribute('href') === ${JSON.stringify(r.builds())})`,
        );
        check(`${locale}: the current section is in the menu`, spot !== null);
        if (spot) {
          await page.click(spot.x, spot.y);
          check(
            `${locale}: re-selecting the current page still closes the menu`,
            await page.waitFor(`!(${IS_OPEN})`, 4000),
          );
        }
      }

      // ---------------------------------------------------------------------
      // 3. Escape closes it and gives the trigger its focus back
      // ---------------------------------------------------------------------
      {
        await page.goto(site.origin + r.home());
        await openMenu(page);
        await page.press("Escape", "Escape", 27);
        check(`${locale}: Escape closes the menu`, await page.waitFor(`!(${IS_OPEN})`, 3000));
        check(
          `${locale}: Escape returns focus to the trigger`,
          await page.evaluate<boolean>(`document.activeElement === ${TRIGGER}`),
        );
      }

      // ---------------------------------------------------------------------
      // 4. A pointer press outside closes it, and does not steal focus
      // ---------------------------------------------------------------------
      {
        await page.goto(site.origin + r.home());
        await openMenu(page);
        // Bottom-left of the viewport: page content, never the panel, which is
        // pinned to the top right.
        await page.click(12, 700);
        check(
          `${locale}: a press outside closes the menu`,
          await page.waitFor(`!(${IS_OPEN})`, 3000),
        );
        /*
         * "Does not steal focus" is a claim about this component, not about the
         * browser: where a press lands is the browser's business, and asserting
         * on that measures the test's own choice of coordinates. What the spec
         * forbids is the *restoration* Escape performs — a reader who pressed
         * somewhere else is not asking to be put back on the trigger.
         */
        const onTrigger = await page.evaluate<boolean>(
          `document.activeElement === ${TRIGGER}`,
        );
        check(
          `${locale}: dismissing by pointer does not pull focus back to the trigger`,
          !onTrigger,
        );
      }

      // ---------------------------------------------------------------------
      // 5. The trigger closes it again
      // ---------------------------------------------------------------------
      {
        await page.goto(site.origin + r.home());
        await openMenu(page);
        const spot = await centreOf(page, TRIGGER);
        if (spot) await page.click(spot.x, spot.y);
        check(
          `${locale}: pressing the trigger again closes it`,
          await page.waitFor(`!(${IS_OPEN})`, 3000),
        );
      }

      // ---------------------------------------------------------------------
      // 6. Keyboard: the trigger takes focus and Enter operates it
      // ---------------------------------------------------------------------
      {
        await page.goto(site.origin + r.home());
        await page.evaluate(`${TRIGGER}.focus()`);
        check(
          `${locale}: the trigger takes keyboard focus`,
          await page.evaluate<boolean>(`document.activeElement === ${TRIGGER}`),
        );
        await page.press("Enter", "Enter", 13, "\r");
        check(`${locale}: Enter opens the menu`, await page.waitFor(IS_OPEN, 3000));
        check(
          `${locale}: the trigger keeps its accessible name`,
          await page.evaluate<boolean>(
            `${TRIGGER}.textContent.includes(${JSON.stringify(t.nav.menu)}) || ${TRIGGER}.getAttribute('aria-label') === ${JSON.stringify(t.nav.menu)}`,
          ),
        );
      }

      // ---------------------------------------------------------------------
      // 7. No focus trap — this disclosure is not modal
      // ---------------------------------------------------------------------
      {
        await page.goto(site.origin + r.home());
        await openMenu(page);
        const escaped = await page.evaluate<boolean>(
          `(() => {
            const items = ${ITEMS};
            if (items.length === 0) return false;
            const last = items[items.length - 1];
            last.focus();
            if (document.activeElement !== last) return false;
            // Everything focusable in the document, in order.
            const all = [...document.querySelectorAll('a[href],button:not([disabled]),summary,input,select,textarea,[tabindex]:not([tabindex="-1"])')]
              .filter(el => el.offsetParent !== null || el === document.activeElement);
            const i = all.indexOf(last);
            // A trap would make the last item the end of the world. It is not:
            // there is document after it.
            return i >= 0 && i < all.length - 1;
          })()`,
        );
        check(`${locale}: the menu does not trap Tab`, escaped);
        const scrolls = await page.evaluate<boolean>(
          `getComputedStyle(document.body).overflow !== 'hidden'`,
        );
        check(`${locale}: and does not lock the page's scroll`, scrolls);
      }

      // ---------------------------------------------------------------------
      // 8. The active section is marked, for the exact path and below it
      // ---------------------------------------------------------------------
      {
        const cls = getClasses(locale)[0];
        for (const [name, url, expected] of [
          ["the section itself", r.classes(), r.classes()],
          ["a page inside it", r.class(cls.slug as Slug), r.classes()],
          ["a page below that", r.classSkills(cls.slug as Slug).split("#")[0], r.classes()],
        ] as const) {
          await page.goto(site.origin + url);
          await openMenu(page);
          const current = await page.evaluate<string[]>(
            `${ITEMS}.filter(a => a.getAttribute('aria-current') === 'page').map(a => a.getAttribute('href'))`,
          );
          check(
            `${locale}: on ${name}, exactly one item is aria-current`,
            current.length === 1,
            JSON.stringify(current),
          );
          check(
            `${locale}: and it is ${expected}`,
            current[0] === expected,
            JSON.stringify(current),
          );
        }
        // A sibling whose href is a string prefix must not light up.
        await page.goto(site.origin + r.runewords());
        await openMenu(page);
        const onRunewords = await page.evaluate<string[]>(
          `${ITEMS}.filter(a => a.getAttribute('aria-current') === 'page').map(a => a.getAttribute('href'))`,
        );
        check(
          `${locale}: /runewords does not also mark /runes`,
          onRunewords.length === 1 && onRunewords[0] === r.runewords(),
          JSON.stringify(onRunewords),
        );
      }

      // ---------------------------------------------------------------------
      // 9. Changing language closes it
      // ---------------------------------------------------------------------
      {
        const other = LOCALES.find((x) => x !== locale)! as Locale;
        await page.goto(site.origin + r.builds());
        await openMenu(page);
        await page.evaluate(PLANT);
        const spot = await centreOf(
          page,
          `[...document.querySelectorAll('header a[href]')].find(a => a.getAttribute('href') === ${JSON.stringify(routes(other).builds())})`,
        );
        check(`${locale}: the language switcher is reachable`, spot !== null);
        if (spot) {
          await page.click(spot.x, spot.y);
          const arrived = await page.waitFor(
            `location.pathname === ${JSON.stringify(routes(other).builds())}`,
            8000,
          );
          check(`${locale}: switching language reaches ${other}`, arrived);
          if (arrived && (await page.evaluate<boolean>(SURVIVED))) {
            check(
              `${locale}: and the menu is shut in the new language`,
              (await page.evaluate<boolean>(IS_OPEN)) === false,
            );
          } else {
            // A hard navigation is a legitimate way to change language; the
            // menu is then shut because the document is new. Say which it was
            // rather than claiming a soft-navigation result.
            check(`${locale}: (language change reloaded the document)`, true);
          }
        }
      }

      // ---------------------------------------------------------------------
      // 10. Nothing is remembered: a fresh page starts shut
      // ---------------------------------------------------------------------
      {
        await page.goto(site.origin + r.home());
        await openMenu(page);
        await page.goto(site.origin + r.builds());
        check(
          `${locale}: a fresh load starts with the menu shut`,
          (await page.evaluate<boolean>(IS_OPEN)) === false,
        );
        const stored = await page.evaluate<number>(
          `(() => { try { return localStorage.length + sessionStorage.length; } catch { return -1; } })()`,
        );
        check(`${locale}: and nothing was written to storage`, stored === 0, String(stored));
      }
    }

    // -----------------------------------------------------------------------
    // 11. Without JavaScript the menu still opens and still navigates
    // -----------------------------------------------------------------------
    console.log("\n— no JavaScript —");
    await page.setScriptsEnabled(false);
    for (const l of LOCALES) {
      const locale = l as Locale;
      const r = routes(locale);
      await page.setViewport(WIDTH);
      await page.goto(site.origin + r.home());

      // Scripting is off, so this is read from the served markup by the
      // *harness*, which needs scripting to evaluate. Re-enable only to read.
      await page.setScriptsEnabled(true);
      const shape = await page.evaluate<{ details: number; items: number; open: boolean }>(
        `(() => { const d = document.querySelector('header details');
          return { details: d ? 1 : 0, items: d ? d.querySelectorAll('a[href]').length : 0, open: !!d && d.open };
        })()`,
      );
      await page.setScriptsEnabled(false);

      check(
        `no-JS ${locale}: the served markup is a native disclosure`,
        shape.details === 1,
        JSON.stringify(shape),
      );
      check(
        `no-JS ${locale}: it holds every destination`,
        shape.items === 10,
        JSON.stringify(shape),
      );
      check(`no-JS ${locale}: and it is shut`, shape.open === false, JSON.stringify(shape));

      // Open it with a real press, with scripting still disabled.
      const spot = await page.evaluate<{ x: number; y: number } | null>(
        `(() => { const s = document.querySelector('header summary'); if (!s) return null;
          const r = s.getBoundingClientRect(); return { x: r.left + r.width/2, y: r.top + r.height/2 }; })()`,
      ).catch(() => null);
      if (spot) {
        await page.click(spot.x, spot.y);
        await page.setScriptsEnabled(true);
        const opened = await page.evaluate<boolean>(
          `document.querySelector('header details').open === true`,
        );
        await page.setScriptsEnabled(false);
        check(`no-JS ${locale}: pressing the trigger opens it natively`, opened);
      }
    }
    await page.setScriptsEnabled(true);
  } finally {
    page.close();
    site.stop();
  }

  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (failures.length > 0) {
    for (const f of failures) console.error(`  FAIL ${f}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`  the gate could not run: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
