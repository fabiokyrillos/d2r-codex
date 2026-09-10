/**
 * No page scrolls sideways, and every filter row is big enough to hit.
 *
 * Both of these were true only by accident, and one of them stopped being true
 * without anything failing.
 *
 * **The sideways scroll.** The header packs three fixed clusters into one row
 * that never wraps and whose items cannot shrink — `min-width: auto` on a row
 * of short unwrappable labels resolves to the width they are already drawn at.
 * At 320px the row measured 319.8px against the 280px the shell container
 * leaves inside its padding, so it ran past its container and the document ran
 * 20px past the viewport. On every page, in both languages, because it is the
 * header. Nothing caught it: the HTML was correct, the links all resolved, the
 * markup validated. It is a fact about laid-out boxes, so it needs a layout
 * engine, which is what `headless.ts` is for.
 *
 * **The filter rows.** A 14×14 checkbox next to a label is a 20px-tall target.
 * That passes WCAG 2.5.8 only through the spacing exception, which is a thing
 * you can fall out of by changing a gap. The row is now the label, 28px tall,
 * so it clears the 24×24 minimum on its own terms — and this measures the
 * *effective* target, the box that actually toggles the control, rather than
 * the square the browser draws.
 *
 * The pages are derived from the registry rather than listed, so a new class or
 * build is covered without editing this file. The states are the ones a reader
 * puts the page into: menu shut, menu open, a filtered listing, and a query
 * that matches nothing.
 *
 * Requires `npm run build`. Run with `npm run test:viewport`.
 */
import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import {
  getBuilds,
  getClasses,
  getFarmingAreas,
  getMechanics,
  getRunes,
  getRunewords,
  getSkillsForClass,
  getUniques,
} from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";
import { routes } from "../lib/routes";
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

/**
 * The widths that matter, and why each one is here.
 *
 * 320 is the floor the site claims to support and the width a 640px window
 * reports at 200% zoom. 640 itself is the `sm:` boundary, and the one width
 * where three things change together: the tier chips stop scrolling and
 * wrap, the gear nav becomes sticky, and the anchor offset flips. 360, 375 and 390 are the phones people actually hold.
 * 768 is where the tablet layout starts, 1280 is a laptop, and 1440 is the
 * width at which the third nav tier appears — the last time this row overflowed
 * it did so at the top of the range, not the bottom.
 *
 * 900 and 960 were added with R-NAV-4, and 900 is the tightest width the header
 * has. It is the step where the primary nav appears (`min-[900px]:flex` in
 * `components/layout/site-header.tsx`) while the shell container is still
 * narrow, so four more links land in a row that has nothing left to give:
 * measured in Chrome, the row has 42px of slack there in en-US and 58px in
 * pt-BR, against 369/370px one pixel below it. 960 is the next step up (102 and
 * 118px) and is here because it is the fallback the header's own comment names
 * if the 900px label ever stops fitting. Neither width was covered before, and
 * the menu trigger's label now changes across exactly this boundary.
 */
const WIDTHS = [320, 360, 375, 390, 640, 768, 900, 960, 1280, 1440] as const;

/** The minimum effective target, in CSS pixels. WCAG 2.2 SC 2.5.8. */
const MIN_TARGET = 24;

interface Surface {
  name: string;
  path: (locale: Locale) => string;
  /** Something that proves the interactive part has hydrated. */
  ready?: (locale: Locale) => string;
  /** Run after load — opens a menu, ticks a box. */
  after?: (page: Page, locale: Locale) => Promise<void>;
}

const firstBuild = (locale: Locale) => getBuilds(locale)[0];
const firstClass = (locale: Locale) => getClasses(locale)[0];
const firstSkill = (locale: Locale) =>
  getSkillsForClass(locale, firstClass(locale).slug as Slug)[0];

const openMenu = async (page: Page) => {
  const opened = await page.evaluate<boolean>(
    `(() => { const d = document.querySelector('header details'); if (!d) return false; d.open = true; return true; })()`,
  );
  if (!opened) throw new Error("no header disclosure to open");
  await page.waitFor(`document.querySelector('header details')?.open === true`);
};

const SURFACES: Surface[] = [
  { name: "homepage", path: (l) => routes(l).home() },
  {
    name: "homepage, menu open",
    path: (l) => routes(l).home(),
    after: (page) => openMenu(page),
  },
  { name: "builds catalogue", path: (l) => routes(l).builds() },
  {
    name: "builds catalogue, menu open",
    path: (l) => routes(l).builds(),
    after: (page) => openMenu(page),
  },
  {
    name: "builds catalogue, filtered",
    path: (l) => `${routes(l).builds()}?class=${firstBuild(l).classSlug}`,
    ready: () => `document.querySelector('input[type="search"]') !== null`,
  },
  {
    name: "builds catalogue, no results",
    path: (l) => `${routes(l).builds()}?q=zzqqxx`,
    ready: (l) =>
      `document.body.textContent.includes(${JSON.stringify(dictionaryFor(l).builds.filters.emptyTitle)})`,
  },
  {
    /*
     * Below `sm` this now opens a modal sheet rather than an inline panel, and
     * the surface is still worth measuring for the same reason: an open sheet
     * puts `overflow: hidden` on the body, and a clipped document could have
     * made `scrollWidth <= clientWidth` true for free. It does not — measured
     * at 320px with the dialog open and a deliberately over-wide element
     * planted, `scrollWidth` reported 620 against a `clientWidth` of 320, so
     * the rule still has teeth. From `sm` up the trigger is `display: none`,
     * the click is a no-op, and the inline desktop panel supplies the boxes.
     *
     * The raise matters: the click used to be allowed to find nothing and carry
     * on to a `waitFor` that timed out and reported "the checkboxes render:
     * FAIL" without saying why.
     */
    name: "builds catalogue, filter sheet open",
    path: (l) => routes(l).builds(),
    ready: () => `document.querySelector('button[aria-controls]') !== null`,
    after: async (page) => {
      const clicked = await page.evaluate<boolean>(
        `(() => { const b = [...document.querySelectorAll('button[aria-controls]')].find(x => x.getAttribute('aria-expanded') === 'false'); if (!b) return false; b.click(); return true; })()`,
      );
      if (!clicked) throw new Error("no filter trigger to activate");
      await page.waitFor(`document.querySelector('input[type="checkbox"]') !== null`);
    },
  },
  { name: "class page", path: (l) => routes(l).class(firstClass(l).slug as Slug) },
  {
    name: "build page",
    path: (l) => routes(l).build(firstBuild(l).classSlug as Slug, firstBuild(l).slug as Slug),
  },
  {
    name: "skill page",
    path: (l) => routes(l).skill(firstClass(l).slug as Slug, firstSkill(l).slug as Slug),
  },
  { name: "leveling page", path: (l) => routes(l).leveling() },

  /*
   * Every remaining route type.
   *
   * These were the blind spot, and it cost a defect: the farming index laid a
   * `shrink-0` badge cluster beside a heading that also would not shrink, so
   * the row was as wide as its parts and ran 22px (en-US) and 27px (pt-BR)
   * past a 320px viewport — on every visit, in both languages. Nothing caught
   * it, because the list above held the homepage, the catalogue, a class, a
   * build, a skill and levelling, and the site has fourteen other page types.
   *
   * A type is listed once, at its first instance. The instances of one type
   * share a template, so the second one measures the same boxes as the first;
   * what a type *not* being here measures is nothing at all.
   */
  { name: "classes index", path: (l) => routes(l).classes() },
  { name: "farming index", path: (l) => routes(l).farming() },
  {
    name: "farming area",
    path: (l) => routes(l).farmingArea(getFarmingAreas(l)[0].slug as Slug),
  },
  { name: "leveling class", path: (l) => routes(l).levelingFor(firstClass(l).slug as Slug) },
  { name: "items index", path: (l) => routes(l).items() },
  { name: "item page", path: (l) => routes(l).item(getUniques(l)[0].slug as Slug) },
  { name: "runes index", path: (l) => routes(l).runes() },
  { name: "rune page", path: (l) => routes(l).rune(getRunes(l)[0].slug as Slug) },
  { name: "runewords index", path: (l) => routes(l).runewords() },
  { name: "runeword page", path: (l) => routes(l).runeword(getRunewords(l)[0].slug as Slug) },
  { name: "breakpoints", path: (l) => routes(l).breakpoints() },
  { name: "mercenaries", path: (l) => routes(l).mercenaries() },
  { name: "mechanics index", path: (l) => routes(l).mechanics() },
  { name: "mechanic page", path: (l) => routes(l).mechanic(getMechanics(l)[0].slug as Slug) },
  { name: "sources", path: (l) => routes(l).sources() },
];

/**
 * The measurement, in the page.
 *
 * `scrollWidth <= clientWidth` on the documentElement is the whole rule. The
 * offenders come back with it so a failure names the element rather than the
 * number, because the last time this broke the visible symptom was at the right
 * edge of an element 260px away from the one causing it.
 */
const MEASURE = `(() => {
  const de = document.documentElement;
  const limit = de.clientWidth;
  const offenders = [];
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > limit + 0.5) {
      offenders.push(el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 2).join(".") : "") + " right=" + Math.round(r.right));
    }
  }
  return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, offenders: offenders.slice(0, 4) };
})()`;

interface Measurement {
  scrollWidth: number;
  clientWidth: number;
  offenders: string[];
}

async function main(): Promise<void> {
  const site = await startSite();
  const page = await Page.launch();

  try {
    // -------------------------------------------------------------------------
    // 1. Nothing scrolls sideways
    // -------------------------------------------------------------------------
    for (const locale of LOCALES) {
      console.log(`\nno horizontal overflow — ${locale}`);
      for (const surface of SURFACES) {
        const url = site.origin + surface.path(locale as Locale);
        for (const width of WIDTHS) {
          await page.setViewport(width);
          await page.goto(url);
          if (surface.ready) {
            const ready = await page.waitFor(surface.ready(locale as Locale));
            if (!ready) {
              check(`${surface.name} @${width}`, false, "never became interactive");
              continue;
            }
          }
          if (surface.after) await surface.after(page, locale as Locale);

          const m = await page.evaluate<Measurement>(MEASURE);
          check(
            `${surface.name} @${width}`,
            m.scrollWidth <= m.clientWidth,
            `scrollWidth ${m.scrollWidth} > clientWidth ${m.clientWidth}; ${m.offenders.join(" | ")}`,
          );
        }
      }
    }

    // -------------------------------------------------------------------------
    // 2. The menu is reachable, and inside the viewport
    // -------------------------------------------------------------------------
    console.log("\nthe mobile menu");
    for (const locale of LOCALES) {
      await page.setViewport(320);
      await page.goto(site.origin + routes(locale as Locale).home());

      const summary = await page.evaluate<{ w: number; h: number; name: string } | null>(
        `(() => { const s = document.querySelector('header summary'); if (!s) return null; const r = s.getBoundingClientRect(); return { w: r.width, h: r.height, name: s.textContent.trim() }; })()`,
      );
      check(`${locale}: the menu trigger is a ${MIN_TARGET}px target`, !!summary && summary.w >= MIN_TARGET && summary.h >= MIN_TARGET, JSON.stringify(summary));
      check(
        `${locale}: the trigger keeps its name when the word is not drawn`,
        !!summary && summary.name.includes(dictionaryFor(locale as Locale).nav.menu),
        JSON.stringify(summary?.name),
      );

      await openMenu(page);
      const items = await page.evaluate<{ count: number; outside: number; widest: number }>(
        `(() => {
          const links = [...document.querySelectorAll('header details nav a')];
          const vw = document.documentElement.clientWidth;
          return {
            count: links.length,
            outside: links.filter((a) => { const r = a.getBoundingClientRect(); return r.left < -0.5 || r.right > vw + 0.5; }).length,
            widest: Math.max(0, ...links.map((a) => Math.round(a.getBoundingClientRect().width))),
          };
        })()`,
      );
      check(`${locale}: every menu item is inside the viewport`, items.outside === 0, JSON.stringify(items));
      check(`${locale}: the menu holds every destination`, items.count === 10, String(items.count));
      check(`${locale}: no menu item is wider than the viewport`, items.widest <= 320, String(items.widest));

      // Keyboard: the disclosure toggles from the keyboard and its links are tabbable.
      await page.goto(site.origin + routes(locale as Locale).home());
      await page.evaluate(`document.querySelector('header summary').focus()`);
      check(
        `${locale}: the trigger takes keyboard focus`,
        await page.evaluate<boolean>(
          `document.activeElement === document.querySelector('header summary')`,
        ),
      );
      await page.press("Enter", "Enter", 13, "\r");
      check(
        `${locale}: Enter on the trigger opens the menu`,
        await page.waitFor(`document.querySelector('header details').open === true`, 2000),
      );
      check(
        `${locale}: the first item is reachable from the trigger`,
        await page.evaluate<boolean>(
          `(() => { const a = document.querySelector('header details nav a'); if (!a) return false; a.focus(); return document.activeElement === a; })()`,
        ),
      );
      await page.evaluate(`document.querySelector('header summary').focus()`);
      await page.press("Enter", "Enter", 13, "\r");
      check(
        `${locale}: Enter closes it again`,
        await page.waitFor(`document.querySelector('header details').open === false`, 2000),
      );
    }

    // -------------------------------------------------------------------------
    // 3. Filter rows are targets you can hit
    // -------------------------------------------------------------------------
    console.log("\nfilter targets");
    for (const locale of LOCALES) {
      for (const width of [320, 390, 1280] as const) {
        await page.setViewport(width);
        await page.goto(site.origin + routes(locale as Locale).builds());
        const hydrated = await page.waitFor(`document.querySelector('input[type="search"]') !== null`);
        if (!hydrated) {
          check(`${locale} @${width}: the filters hydrate`, false);
          continue;
        }
        if (width < 640) {
          await page.evaluate(
            `(() => { const b = [...document.querySelectorAll('button[aria-controls]')].find(x => x.getAttribute('aria-expanded') === 'false'); b && b.click(); })()`,
          );
        }
        const ok = await page.waitFor(`document.querySelectorAll('input[type="checkbox"]').length > 0`);
        if (!ok) {
          check(`${locale} @${width}: the checkboxes render`, false);
          continue;
        }

        /*
         * The effective target is the box that toggles the control — the label —
         * not the square the browser paints. Both are reported so a failure says
         * which one moved.
         */
        const targets = await page.evaluate<{
          total: number;
          small: string[];
          drawn: string;
          smallest: string;
          overflowing: number;
        }>(`(() => {
          const boxes = [...document.querySelectorAll('input[type="checkbox"]')];
          const small = [];
          let minW = Infinity, minH = Infinity;
          for (const cb of boxes) {
            const label = cb.closest('label') || document.querySelector('label[for="' + CSS.escape(cb.id) + '"]');
            const r = (label || cb).getBoundingClientRect();
            minW = Math.min(minW, r.width);
            minH = Math.min(minH, r.height);
            if (r.width < ${MIN_TARGET} - 0.5 || r.height < ${MIN_TARGET} - 0.5) {
              small.push((cb.id || '?') + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
            }
          }
          const first = boxes[0].getBoundingClientRect();
          const groups = [...document.querySelectorAll('fieldset')];
          const vw = document.documentElement.clientWidth;
          return {
            total: boxes.length,
            small: small.slice(0, 5),
            drawn: Math.round(first.width) + 'x' + Math.round(first.height),
            smallest: Math.round(minW) + 'x' + Math.round(minH),
            overflowing: groups.filter((g) => g.scrollWidth > g.clientWidth + 0.5 || g.getBoundingClientRect().right > vw + 0.5).length,
          };
        })()`);

        check(
          `${locale} @${width}: every filter row is at least ${MIN_TARGET}×${MIN_TARGET} (smallest ${targets.smallest}, box drawn ${targets.drawn})`,
          targets.small.length === 0,
          targets.small.join(", "),
        );
        check(`${locale} @${width}: no filter group overflows`, targets.overflowing === 0);
      }
    }

    // -------------------------------------------------------------------------
    // 4. Hitting the row toggles the box exactly once
    // -------------------------------------------------------------------------
    console.log("\none tap, one toggle");
    {
      await page.setViewport(1280);
      await page.goto(site.origin + routes("en-us").builds());
      await page.waitFor(`document.querySelectorAll('input[type="checkbox"]').length > 0`);

      const spot = await page.evaluate<{ x: number; y: number; id: string; before: boolean } | null>(
        `(() => {
          const cb = document.querySelector('input[type="checkbox"]');
          const label = cb.closest('label');
          if (!label) return null;
          const r = label.getBoundingClientRect();
          // The far end of the text, well away from the drawn box.
          return { x: r.right - 6, y: r.top + r.height / 2, id: cb.id, before: cb.checked };
        })()`,
      );
      check("the row is a label wrapping its control", spot !== null);
      if (spot) {
        await page.click(spot.x, spot.y);
        const after = await page.evaluate<{ checked: boolean; focused: boolean; url: string }>(
          `(() => { const cb = document.getElementById(${JSON.stringify(spot.id)}); return { checked: cb.checked, focused: document.activeElement === cb, url: location.search }; })()`,
        );
        check("tapping the text toggles the box once", after.checked === !spot.before, JSON.stringify(after));
        check("focus lands on the control itself", after.focused, JSON.stringify(after));
        check("and the filter reached the URL", after.url.length > 0, after.url);

        // The gap between the box and the text is inside the row, and live.
        const gap = await page.evaluate<{ x: number; y: number } | null>(
          `(() => {
            const cb = document.getElementById(${JSON.stringify(spot.id)});
            const label = cb.closest('label');
            const b = cb.getBoundingClientRect(), l = label.getBoundingClientRect();
            return { x: b.right + 2, y: l.top + l.height / 2 };
          })()`,
        );
        if (gap) {
          await page.click(gap.x, gap.y);
          const back = await page.evaluate<boolean>(
            `document.getElementById(${JSON.stringify(spot.id)}).checked`,
          );
          check("the gap between box and text toggles too", back === spot.before, String(back));
        }
      }
    }

    /*
     * 5. Native controls, in the themes the site and the OS actually have
     *
     * The site ships one palette; the OS ships two. Because nothing declares
     * `color-scheme`, the UA paints form controls with its light styling
     * whatever the OS is set to — so the checkbox is a white square with a
     * dark tick on a near-black page, at high contrast, and identical for
     * every reader.
     *
     * That is checked here rather than fixed, because declaring
     * `color-scheme: dark` to "match the site" would make the control dark
     * grey on near-black and take contrast *away*. The assertion is what stops
     * that being proposed again as an obvious improvement: if a future change
     * makes the two OS themes diverge, this fails and the divergence has to be
     * argued for.
     */
    console.log("\nnative controls under both OS schemes");
    {
      const seen: string[] = [];
      for (const scheme of ["light", "dark"] as const) {
        await page.setColorScheme(scheme);
        await page.setViewport(1280);
        await page.goto(site.origin + routes("en-us").builds());
        await page.waitFor(`document.querySelectorAll('input[type="checkbox"]').length > 0`);
        const styles = await page.evaluate<string>(
          `(() => {
            const cb = document.querySelector('input[type="checkbox"]');
            const cs = getComputedStyle(cb);
            return [cs.accentColor, cs.colorScheme, getComputedStyle(document.documentElement).colorScheme].join("|");
          })()`,
        );
        seen.push(styles);
      }
      check(
        "the checkbox renders identically whichever theme the OS is in",
        seen[0] === seen[1],
        seen.join(" vs "),
      );
      check("and takes the site's accent colour", seen[0].startsWith("rgb(212, 113, 61)"), seen[0]);
      await page.setColorScheme("light");
    }
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
