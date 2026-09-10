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
 * puts the page into: menu shut, menu open, a filtered listing, a query that
 * matches nothing, and a build page with its table of contents in front of them
 * — which below 640px is a modal sheet and above it a row of links, two layouts
 * behind one name and neither of them measured while the disclosure is shut.
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

/**
 * The build page's summary is hydrated *and* has settled into a regime.
 *
 * Six hydrated tier buttons say the client bundle ran; the `data-sheet`
 * attribute says this particular island's layout effect ran, because
 * `page-sections.tsx` writes it on every mount below 640px and removes it at or
 * above. So the second half is asserted only where it is written — checking for
 * it at 1280px would wait ten seconds for something that is correctly absent,
 * and checking only the first half would let a `<summary>` be pressed before the
 * island could turn the panel into a sheet, which is a different surface with
 * the same name.
 */
const SECTIONS_READY = `(() => {
  if (document.querySelectorAll('button[data-tier]').length !== 6) return false;
  const details = document.querySelector('[data-sections]');
  if (!details) return false;
  return window.matchMedia('(min-width: 40rem)').matches || details.hasAttribute('data-sheet');
})()`;

/** Which of the summary's two regimes a width is in. */
type SectionsRegime = "sheet" | "row";

/**
 * Puts the summary in front of the reader, by the route the reader has.
 *
 * Below 640px that is a press on the `<summary>` — a real mouse press at the
 * element's own coordinates, not `details.open = true`, because the sheet's
 * modal half is driven by the element's `toggle` event and by the island's
 * pointer handlers, and setting the property from outside would skip neither of
 * them but would skip the question of whether the control can be *reached*. The
 * trigger sits some 600-780px down a build page (`build-tier-heights.test.ts`
 * publishes the sweep), so it is scrolled into view first — instantly, because
 * the site sets `scroll-behavior: smooth` and a click dispatched mid-animation
 * lands on whatever is passing.
 *
 * From 640px there is nothing to press: `app/globals.css` withdraws the trigger
 * with `display: none` and reveals `::details-content` on a disclosure that
 * stays closed forever, so the panel is already open in the only sense a reader
 * cares about. Returning the regime rather than a boolean is what stops the
 * caller quietly treating the two as the same thing.
 */
const openSections = async (page: Page): Promise<SectionsRegime> => {
  const found = await page.evaluate<{ regime: SectionsRegime; x: number; y: number } | null>(
    `(() => {
       const details = document.querySelector('[data-sections]');
       if (!details) return null;
       const summary = details.querySelector('summary');
       if (!summary) return null;
       if (window.matchMedia('(min-width: 40rem)').matches) return { regime: 'row', x: -1, y: -1 };
       summary.scrollIntoView({ block: 'center', behavior: 'instant' });
       const r = summary.getBoundingClientRect();
       return { regime: 'sheet', x: r.left + r.width / 2, y: r.top + r.height / 2 };
     })()`,
  );
  if (!found) throw new Error("no [data-sections] disclosure with a <summary> on the page");
  if (found.regime === "row") return "row";
  await page.click(found.x, found.y);
  /*
   * Waited on the *sheet*, not on `open`. `open` flips inside the press and the
   * `toggle` that carries the modal half is queued behind it, so a probe that
   * waits for the property reads a half-open sheet: measured here before this
   * line existed, five of the eight sheet cells came back `role null` with the
   * body unlocked, and which five moved between runs. That is the same queued
   * `toggle` `page-sections.tsx` and `mobile-navigation.tsx` both document, and
   * the state a reader gets is the one after it has run.
   */
  const open = await page.waitFor(
    `document.querySelector('[data-sections]').open === true &&
     document.querySelector('[data-sections-panel]').getAttribute('role') === 'dialog'`,
    4000,
  );
  if (!open) {
    throw new Error(
      `pressing the summary at (${Math.round(found.x)}, ${Math.round(found.y)}) did not raise the sheet`,
    );
  }
  return "sheet";
};

/**
 * The same thing, for the two blocks that drive it directly rather than through
 * a surface.
 *
 * A surface's `after` is allowed to throw — that is how the filter sheet reports
 * a trigger it cannot find, and `main`'s catch turns it into a red gate. But the
 * blocks below run twenty widths in a loop, and a throw at the first one would
 * hide the other nineteen. The mutation that proved the modal assertion below
 * takes `aria-modal` off the island's `enter`, and the press still lands; one
 * that took `role` off instead would abort at the first sheet width and carry
 * off every later assertion with it, including the ones with nothing to do with
 * the defect. So here a summary that will not open is a datum, not an exit.
 */
const openedSections = async (
  page: Page,
): Promise<{ regime: SectionsRegime; error?: undefined } | { regime?: undefined; error: string }> => {
  try {
    return { regime: await openSections(page) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
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
    /*
     * The same page with its table of contents actually in front of the reader,
     * which is two different layouts wearing one name.
     *
     * From 640px it is close to the document the surface above already measures:
     * the CSS reveals `::details-content` on a disclosure that never opens, so
     * the eleven-entry row is laid out whether or not anyone asks for it, and
     * what this surface adds there is that the regime is *checked* rather than
     * assumed — measured, an eleven-item row that stops wrapping and stops
     * shrinking overflows at 640 and 768 and both surfaces go red together.
     *
     * Below 640px it is a document no other surface here ever reaches: a fixed
     * bottom sheet, a scrim, and `overflow: hidden` on the body. The block
     * further down says exactly what that state can and cannot catch, because
     * both halves of the answer were surprising and both were measured.
     *
     * `openSections` handles the two regimes explicitly and returns which one it
     * found, so a press that stops landing cannot come back as a quiet second
     * copy of "build page".
     */
    name: "build page, sections open",
    path: (l) => routes(l).build(firstBuild(l).classSlug as Slug, firstBuild(l).slug as Slug),
    ready: () => SECTIONS_READY,
    after: async (page) => {
      await openSections(page);
    },
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

    /*
     * 6. The build page's summary is on screen from 640px — computed, not implied
     *
     * This is B2's assertion, and B2 is the reason it has to be this one.
     *
     * The desktop summary rendered *invisible on every build page* while every
     * gate stayed green, because each gate was asking a question the defect
     * answers correctly: the eleven links are in the served HTML, so an HTML
     * gate reads eleven links; a closed `<details>` still lays a panel out, so a
     * height gate reads a box. Neither of those is "a reader can see it". A
     * `display` on a child cannot override a `content-visibility` on an
     * ancestor, and nothing here measured the ancestor.
     *
     * `checkVisibility()` is the browser's own answer to the question the reader
     * is asking, and it is the only one of the three that changes when the panel
     * goes dark. Measured against the defect expressed two different ways: the
     * stylesheet reverted to `display: block` over a closed disclosure, and
     * `hidden` put on `[data-sections-panel]` with the stylesheet untouched. The
     * second is invisible to `build-toc-html.test.ts` — which reads
     * `app/globals.css` as text — and to `page-structure.test.ts`, and both
     * shipped green over it.
     *
     * Here rather than in `build-toc-html.test.ts` because that file reads files
     * and says so: "no browser gate drives `[data-sections]`". This one already
     * drives a browser at these widths, and the claim is about laid-out boxes in
     * a layout engine, which is what `headless.ts` exists for.
     *
     * The three widths are 640 — the breakpoint itself, where the reveal starts
     * — 768 and 1280. Below 640 the panel is *supposed* to be shut, and that is
     * the control: the same probe, on the same element, one width down.
     */
    console.log("\nthe build page's summary is visible from 640px");
    {
      interface PanelVisibility {
        found: boolean;
        supported: boolean;
        open: boolean;
        panelVisible: boolean;
        links: number;
        invisible: string[];
        zero: string[];
        contentVisibility: string;
        plantedVisible: boolean;
      }

      /*
       * One probe, run at every width and at the control width, so the failure
       * and the control cannot drift apart. The planted node is the anti-vacuity
       * half and it travels with the measurement: a `display: none` div, created
       * inside the panel, asked the same question, and removed — if the probe
       * ever starts answering "visible" to everything, that fails here.
       */
      const PROBE = `(() => {
        const details = document.querySelector("[data-sections]");
        const panel = document.querySelector("[data-sections-panel]");
        const blank = { found: false, supported: false, open: false, panelVisible: false, links: 0, invisible: [], zero: [], contentVisibility: "", plantedVisible: false };
        if (!details || !panel) return blank;
        if (typeof panel.checkVisibility !== "function") return { ...blank, found: true };
        const opts = { contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true };
        const links = [...panel.querySelectorAll('a[href^="#"]')];
        let contentVisibility = "";
        try { contentVisibility = getComputedStyle(details, "::details-content").contentVisibility || ""; } catch (e) { contentVisibility = "?"; }
        const planted = document.createElement("div");
        planted.textContent = "control";
        planted.style.display = "none";
        panel.appendChild(planted);
        const plantedVisible = planted.checkVisibility(opts);
        planted.remove();
        return {
          found: true,
          supported: true,
          open: details.open === true,
          panelVisible: panel.checkVisibility(opts),
          links: links.length,
          invisible: links.filter((a) => !a.checkVisibility(opts)).map((a) => a.getAttribute("href")).slice(0, 4),
          zero: links.filter((a) => { const r = a.getBoundingClientRect(); return r.width < 1 || r.height < 1; }).map((a) => a.getAttribute("href")).slice(0, 4),
          contentVisibility,
          plantedVisible,
        };
      })()`;

      for (const locale of LOCALES) {
        const build = firstBuild(locale as Locale);
        const url =
          site.origin + routes(locale as Locale).build(build.classSlug as Slug, build.slug as Slug);

        for (const width of [640, 768, 1280] as const) {
          await page.setViewport(width);
          await page.goto(url);
          const v = await page.evaluate<PanelVisibility>(PROBE);
          const where = `${locale} @${width}`;
          const detail =
            `details.open ${v.open} · ::details-content content-visibility "${v.contentVisibility}" · ` +
            `${v.links} links · invisible [${v.invisible.join(", ")}]`;

          check(`${where}: the build page renders a summary panel`, v.found, "[data-sections-panel] is not in the document");
          if (!v.found) continue;
          check(`${where}: checkVisibility() exists, so the answer below means something`, v.supported);
          if (!v.supported) continue;

          check(`${where}: the summary panel is actually visible`, v.panelVisible, detail);
          check(
            `${where}: every summary link is actually visible, not merely in the markup`,
            v.links > 0 && v.invisible.length === 0,
            detail,
          );
          check(`${where}: …and each of them has a box to hit`, v.zero.length === 0, v.zero.join(", "));
          check(
            `${where}: …and ::details-content is not withdrawing them`,
            v.contentVisibility !== "hidden",
            v.contentVisibility,
          );
          check(
            `${where}: control — the same probe reports false for a deliberately hidden node`,
            v.plantedVisible === false,
            "checkVisibility() answered `true` for a display:none div, so nothing above is a claim",
          );
        }

        /*
         * The control, on the real element rather than a synthetic one: one
         * width below the breakpoint the panel is behind a closed disclosure, so
         * the probe must say so — *while its links are still in the markup*.
         * That last clause is the whole of B2 in one assertion: presence is not
         * visibility, and a gate that reads the links reads eleven of them here
         * too.
         */
        await page.setViewport(390);
        await page.goto(url);
        const shut = await page.evaluate<PanelVisibility>(PROBE);
        check(
          `${locale} @390: control — the same panel reports invisible while shut, with its links still in the markup`,
          shut.found && shut.supported && !shut.panelVisible && shut.links > 0,
          `panelVisible ${shut.panelVisible} · ${shut.links} links · content-visibility "${shut.contentVisibility}"`,
        );
        check(
          `${locale} @390: control — and ::details-content reads back as hidden there`,
          shut.contentVisibility === "hidden",
          `"${shut.contentVisibility}" — the pseudo-element read is not discriminating, so the rule above is vacuous`,
        );
      }
    }

    /*
     * 7. The "sections open" surface is in the state its name claims
     *
     * A surface whose `after` quietly does nothing is the same surface twice
     * under two names, and it reports green with the confidence of a real
     * measurement — which is exactly the shape of the defect B2 was. So the same
     * `openSections` the surface uses is driven again here at every one of the
     * ten widths, and what it produced is read back off the document.
     *
     * The two regimes are asserted apart rather than together, because "the
     * summary is open" means different things on either side of 640px and only
     * one of them involves a press:
     *
     *   - below 640 the press has to have landed: the disclosure is `open`, the
     *     island's `data-sheet` chrome is on it, the panel passes
     *     `checkVisibility()`, and the three attributes that make it modal —
     *     `role`, `aria-modal`, and `overflow: hidden` on the body — are the
     *     ones `page-sections.tsx` writes on `enter`;
     *   - at 640 and above there is nothing to press and pressing would be the
     *     bug: the trigger is `display: none`, the disclosure is *still closed*,
     *     and the panel is visible anyway because the CSS revealed
     *     `::details-content`. A `role="dialog"` here would be a dialog nobody
     *     can leave, so its absence is asserted rather than assumed.
     */
    console.log("\nthe sections summary, opened the way a reader opens it");
    {
      interface SectionsState {
        found: boolean;
        open: boolean;
        sheet: boolean;
        triggerDisplay: string;
        panelVisible: boolean;
        role: string | null;
        ariaModal: string | null;
        bodyOverflow: string;
        links: number;
      }

      const STATE = `(() => {
        const details = document.querySelector('[data-sections]');
        const panel = document.querySelector('[data-sections-panel]');
        const summary = details ? details.querySelector('summary') : null;
        if (!details || !panel || !summary) {
          return { found: false, open: false, sheet: false, triggerDisplay: '', panelVisible: false, role: null, ariaModal: null, bodyOverflow: '', links: 0 };
        }
        return {
          found: true,
          open: details.open === true,
          sheet: details.hasAttribute('data-sheet'),
          triggerDisplay: getComputedStyle(summary).display,
          panelVisible: panel.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true }),
          role: panel.getAttribute('role'),
          ariaModal: panel.getAttribute('aria-modal'),
          bodyOverflow: getComputedStyle(document.body).overflow,
          links: panel.querySelectorAll('a[href^="#"]').length,
        };
      })()`;

      for (const locale of LOCALES) {
        const build = firstBuild(locale as Locale);
        const url =
          site.origin + routes(locale as Locale).build(build.classSlug as Slug, build.slug as Slug);

        for (const width of WIDTHS) {
          await page.setViewport(width);
          await page.goto(url);
          const ready = await page.waitFor(SECTIONS_READY);
          const where = `${locale} @${width}`;
          if (!ready) {
            check(`${where}: the summary reaches its regime`, false, "never hydrated");
            continue;
          }
          const opened = await openedSections(page);
          if (opened.error) {
            check(`${where}: the summary opens the way a reader opens it`, false, opened.error);
            continue;
          }
          const regime = opened.regime;
          const s = await page.evaluate<SectionsState>(STATE);
          const detail =
            `regime ${regime} · open ${s.open} · data-sheet ${s.sheet} · trigger ${s.triggerDisplay} · ` +
            `visible ${s.panelVisible} · role ${s.role} · body overflow "${s.bodyOverflow}" · ${s.links} links`;

          check(`${where}: the summary is on the page at all`, s.found, "[data-sections-panel] is missing");
          if (!s.found) continue;

          if (width < 640) {
            check(`${where}: the press opened the sheet`, regime === "sheet" && s.open && s.sheet, detail);
            check(`${where}: …and the panel is really on screen, not merely in the markup`, s.panelVisible && s.links > 0, detail);
            check(
              `${where}: …wearing the modal half the island writes`,
              s.role === "dialog" && s.ariaModal === "true" && s.bodyOverflow === "hidden",
              detail,
            );
          } else {
            check(`${where}: there is nothing to press — the trigger is withdrawn`, regime === "row" && s.triggerDisplay === "none", detail);
            check(`${where}: …the disclosure is still shut, and the panel visible anyway`, s.open === false && s.panelVisible && s.links > 0, detail);
            check(
              `${where}: …and a plain row of links is not pretending to be a dialog`,
              s.role === null && s.ariaModal === null && s.bodyOverflow !== "hidden",
              detail,
            );
          }
        }
      }

      /*
       * Anti-vacuity for the surface itself: with the summary open, can the
       * overflow rule still go red?
       *
       * A fair question and not a rhetorical one. Below 640px the sheet is
       * `position: fixed` over a body the island has put `overflow: hidden` on,
       * and both of those are ways a document can stop reporting overflow it
       * really has — which would leave "build page, sections open" measuring
       * nothing at four of its ten widths while printing eight green lines. So
       * the same `MEASURE` the surface uses is run on the open page with a node
       * twice the viewport's width planted in three different places, and again
       * after every one of them is removed.
       *
       * Measured at 320px, sheet up, `clientWidth` 320: clean **320**; the node
       * inside the fixed panel **320**; the same node in the page behind the
       * sheet **640**; the same node inside the panel with `data-sheet` taken
       * off **660**. At 1280px, panel in flow: **1280 / 2720 / 2560 / 2720**.
       *
       * Three things follow, and the assertions below are each of them:
       *
       *   - the body lock does *not* blind the rule. `overflow: hidden` on the
       *     body was the reason to doubt this whole surface, and 640 against 320
       *     settles it — which is the same answer the filter sheet's comment
       *     above reports, now measured on this sheet too.
       *   - a `position: fixed` box cannot enlarge the document's scroll area,
       *     so the sheet's own contents are not what this surface catches below
       *     640px, and the sheet is insulated twice over: its `<nav>` carries
       *     `overflow-y-auto`, which computes `overflow-x` to `auto` as well and
       *     clips sideways too. Both halves were measured by mutation — an
       *     unshrinkable non-wrapping list inside the sheet reddened 640 and 768
       *     and nothing below, and it stayed green below even with both
       *     `group-data-[sheet]:fixed` and the list's `group-data-[sheet]:block`
       *     taken off, which is the nav's own clip doing it. So what this surface
       *     guards under 640 is the page *behind* the sheet, and the day the
       *     panel lands in flow with a list that can overflow — which is not
       *     hypothetical: `data-sheet` is the island's own attribute, and
       *     without it the panel is in normal flow, which is the no-JavaScript
       *     shape `page-sections.tsx` documents and the shape it has at 1280px.
       *   - so the panel plant is done twice, and it is the *flow* one that has
       *     to bite. Removing the attribute for the length of one measurement
       *     and putting it back is asserted too, because a control that leaves
       *     the page altered has moved the thing it was measuring.
       */
      for (const width of [320, 1280] as const) {
        const build = firstBuild("en-us");
        await page.setViewport(width);
        await page.goto(site.origin + routes("en-us").build(build.classSlug as Slug, build.slug as Slug));
        const ready = await page.waitFor(SECTIONS_READY);
        if (!ready) {
          check(`control @${width}: the summary reaches its regime`, false, "never hydrated");
          continue;
        }
        const raised = await openedSections(page);
        if (raised.error) {
          check(`control @${width}: the summary opens the way a reader opens it`, false, raised.error);
          continue;
        }
        const probe = await page.evaluate<{
          before: Measurement;
          inFixedPanel: Measurement;
          behindTheSheet: Measurement;
          inFlowPanel: Measurement;
          back: Measurement;
          restored: boolean;
          bodyOverflow: string;
        }>(`(() => {
          const de = document.documentElement;
          const details = document.querySelector('[data-sections]');
          const panel = document.querySelector('[data-sections-panel]');
          const behind = document.querySelector('main') || document.body;
          const sheet = details.hasAttribute('data-sheet');
          const wide = document.createElement('div');
          wide.style.height = '8px';
          wide.style.width = (de.clientWidth * 2) + 'px';
          const at = (host) => { host.appendChild(wide); const m = ${MEASURE}; wide.remove(); return m; };
          const before = ${MEASURE};
          const bodyOverflow = getComputedStyle(document.body).overflow;
          const inFixedPanel = at(panel);
          const behindTheSheet = at(behind);
          if (sheet) details.removeAttribute('data-sheet');
          const inFlowPanel = at(panel);
          if (sheet) details.setAttribute('data-sheet', '');
          return { before, inFixedPanel, behindTheSheet, inFlowPanel, back: ${MEASURE},
                   restored: details.hasAttribute('data-sheet') === sheet, bodyOverflow };
        })()`);
        const shape =
          `clean ${probe.before.scrollWidth} · in the fixed panel ${probe.inFixedPanel.scrollWidth} · ` +
          `behind the sheet ${probe.behindTheSheet.scrollWidth} · in the panel in flow ${probe.inFlowPanel.scrollWidth} · ` +
          `back ${probe.back.scrollWidth} · against a clientWidth of ${probe.before.clientWidth}, ` +
          `body overflow "${probe.bodyOverflow}"`;
        console.log(`  @${width}: ${shape}`);

        check(
          `control @${width}: the open page is clean before anything is planted`,
          probe.before.scrollWidth <= probe.before.clientWidth,
          shape,
        );
        check(
          `control @${width}: an over-wide node in the page behind the summary is caught`,
          probe.behindTheSheet.scrollWidth > probe.behindTheSheet.clientWidth,
          `${shape} — the body lock is swallowing the overflow, so this surface's green lines mean nothing`,
        );
        check(
          `control @${width}: …and one inside the panel is caught wherever the panel is in flow`,
          probe.inFlowPanel.scrollWidth > probe.inFlowPanel.clientWidth,
          shape,
        );
        check(
          `control @${width}: …and the page reads back clean, with data-sheet as it was found`,
          probe.back.scrollWidth === probe.before.scrollWidth && probe.restored,
          `${shape} · restored ${probe.restored}`,
        );
      }
    }

    /*
     * 8. Every summary link is a target you can hit — WCAG 2.5.8, not R-A11Y-4
     *
     * §7.4 and §11 of the Phase 2 plan put these links under the 24×24 minimum
     * and deliberately *not* under the 44px one: they are not the page's primary
     * control, the tier picker is, and `build-tier-heights.test.ts` holds that
     * one to 44. Asserting 44 here would be inventing a contract nobody wrote;
     * asserting nothing would leave the sheet's `min-h-11` and the row's
     * `min-h-6` free to become whatever a later utility makes them.
     *
     * Both regimes, because they draw different boxes from the same markup: at
     * 320 and 390 the entries are stacked rows in a fixed sheet, at 1280 they
     * are inline items in a wrapping row, and only the first has a class saying
     * anything about height. The width axis matters as much as the height one —
     * a one-word section label in a `flex-wrap` row is as narrow as its text,
     * and it is the axis with the least room: measured over the eleven entries,
     * the smallest box is **33×44** in the sheet and **33×28** in the row in
     * en-US, **34×44** and **34×28** in pt-BR. The height comes from a utility
     * and has 20px and 4px of slack; the width comes from a word, and its 9px
     * is the number that would go first.
     */
    console.log("\nsummary links clear the 24px minimum");
    for (const locale of LOCALES) {
      const build = firstBuild(locale as Locale);
      const url =
        site.origin + routes(locale as Locale).build(build.classSlug as Slug, build.slug as Slug);

      for (const width of [320, 390, 1280] as const) {
        await page.setViewport(width);
        await page.goto(url);
        const ready = await page.waitFor(SECTIONS_READY);
        const where = `${locale} @${width}`;
        if (!ready) {
          check(`${where}: the summary reaches its regime`, false, "never hydrated");
          continue;
        }
        const opened = await openedSections(page);
        if (opened.error) {
          check(`${where}: the summary opens the way a reader opens it`, false, opened.error);
          continue;
        }
        const want: SectionsRegime = width < 640 ? "sheet" : "row";
        check(`${where}: measured in the ${want} regime`, opened.regime === want, `found ${opened.regime}`);

        /*
         * The planted link is the anti-vacuity half and it travels with the
         * measurement, the way the `display: none` div does in section 6: a
         * 10×10 `<a href="#...">` is appended to the same list, asked the same
         * question by the same probe, and removed. If the selector ever stops
         * matching, or the comparison stops discriminating, the eleven real
         * links go quiet and this does not.
         */
        const t = await page.evaluate<{
          found: boolean;
          total: number;
          smallCount: number;
          small: string[];
          smallest: string;
          plantedSeen: number;
          plantedSmall: number;
          plantedIsSmall: boolean;
          restored: number;
        } | null>(`(() => {
          const panel = document.querySelector('[data-sections-panel]');
          const list = panel ? panel.querySelector('ol') : null;
          if (!panel || !list) return { found: false, total: 0, smallCount: 0, small: [], smallest: '', plantedSeen: 0, plantedSmall: 0, plantedIsSmall: false, restored: 0 };
          const read = () => [...panel.querySelectorAll('a[href^="#"]')].map((a) => {
            const r = a.getBoundingClientRect();
            return { href: a.getAttribute('href'), w: r.width, h: r.height };
          });
          const under = (rows) => rows.filter((l) => l.w < ${MIN_TARGET} - 0.5 || l.h < ${MIN_TARGET} - 0.5);
          const links = read();
          let minW = Infinity, minH = Infinity;
          for (const l of links) { minW = Math.min(minW, l.w); minH = Math.min(minH, l.h); }
          const planted = document.createElement('a');
          planted.setAttribute('href', '#sections-target-control');
          planted.textContent = '.';
          planted.style.cssText = 'display:inline-block;width:10px;height:10px;min-height:0;padding:0;line-height:10px;overflow:hidden';
          list.appendChild(planted);
          const withPlanted = read();
          const flagged = under(withPlanted);
          planted.remove();
          return {
            found: true,
            total: links.length,
            smallCount: under(links).length,
            small: under(links).map((l) => l.href + ' ' + Math.round(l.w) + 'x' + Math.round(l.h)).slice(0, 5),
            smallest: links.length ? Math.round(minW) + 'x' + Math.round(minH) : 'none',
            plantedSeen: withPlanted.length,
            plantedSmall: flagged.length,
            plantedIsSmall: flagged.some((l) => l.href === '#sections-target-control'),
            restored: read().length,
          };
        })()`);

        check(`${where}: the summary has links to measure`, !!t && t.found && t.total > 0, JSON.stringify(t));
        if (!t || !t.found || t.total === 0) continue;

        check(
          `${where}: all ${t.total} summary links are at least ${MIN_TARGET}×${MIN_TARGET} (smallest ${t.smallest})`,
          t.smallCount === 0,
          `${t.smallCount} under it: ${t.small.join(", ")}`,
        );
        /*
         * Asserted as a delta and by name, not as "exactly one link is
         * undersized". Measured: with the entries' `min-h-6`/`min-h-11` and
         * their padding taken off in the source, every real link came back
         * 20px tall, the assertion above went red as it should — and the earlier
         * form of this control went red beside it, because twelve undersized
         * links is not one. A control that fails whenever the thing it controls
         * fails has stopped being evidence.
         */
        check(
          `${where}: control — a 10×10 link planted in the same list is caught`,
          t.plantedSeen === t.total + 1 && t.plantedIsSmall && t.plantedSmall === t.smallCount + 1,
          `${t.plantedSeen} links seen with it planted, ${t.plantedSmall} reported undersized, ` +
            `the planted one among them: ${t.plantedIsSmall}`,
        );
        check(
          `${where}: control — …and the list is put back the way it was found`,
          t.restored === t.total,
          `${t.restored} links after removal, ${t.total} before`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // 8. The R-NAV-4 word, measured against the header it replaced
    // -------------------------------------------------------------------------
    /*
     * Phase 2 gave the menu trigger a second name: `nav.menu` below 900px and
     * `nav.reference` from 900 up. Every width in `WIDTHS` above is measured at
     * the browser's default text size, and at that size the word fits — 12px of
     * slack in en-US at 900px, 25 in pt-BR. This section is about the reader who
     * has enlarged the text, which is a setting and not a zoom: `rem` lengths
     * grow, `px` ones do not, and `rem` media queries move.
     *
     * Measured across both SHAs, on the home and on a class page, at 320, 390,
     * 900, 960, 1280 at 100/150/200% text, the word costs nothing at 320 and 390
     * — the wrapper is `sr-only` below `sm`, and `sm` is `40rem`, so it is 640px
     * at default text, 960px at 150% and 1280px at 200%. The page's sideways
     * overflow there (415px against 320 at 150%, 552 at 200%) is the same to the
     * pixel before and after Phase 2.
     *
     * It cost width in exactly two of the thirty combinations, both of them
     * pages that already overflowed: +45px (en) / +50 (pt) at 960px and 150%,
     * and +61 / +66 at 1280px and 200%. Both are the same fact — `min-[900px]`
     * is a *pixel* query, so it kept promoting the longer word at widths where
     * the enlarged row no longer had room for it.
     *
     * So the rule is not "the page never scrolls sideways at 200% text" — it
     * does, and that is the header row, older than this phase and not this
     * phase's to fix. The rule is that R-NAV-4 costs *nothing*: the document is
     * exactly as wide as it would be with the header this replaced.
     */
    const TEXT_SCALES = [100, 150, 200] as const;
    const LABEL_WIDTHS = [320, 390, 900, 960, 1280, 1440] as const;

    /**
     * The document's width as it is, and as `0b5a2bc` would have drawn it.
     *
     * The counterfactual is the old header exactly: one visible word, `nav.menu`,
     * at every width. Forcing the *long* word instead would re-create the defect
     * on a fixed build and fail forever, which is the trap in writing this the
     * obvious way round.
     */
    const WORD_COST = `(() => {
      const de = document.documentElement;
      const summary = document.querySelector('header details summary');
      const wrapper = summary ? summary.querySelector('span.sr-only, span.not-sr-only') : null;
      const words = wrapper ? Array.prototype.slice.call(wrapper.querySelectorAll('span')) : [];
      if (words.length !== 2) return JSON.stringify({ words: words.length });
      const trigger = () => Math.round(summary.getBoundingClientRect().width);
      const natural = { sw: de.scrollWidth, trigger: trigger() };
      words[0].style.setProperty('display', 'inline', 'important');
      words[1].style.setProperty('display', 'none', 'important');
      const asBefore = { sw: de.scrollWidth, trigger: trigger() };
      words[0].style.removeProperty('display');
      words[1].style.removeProperty('display');
      return JSON.stringify({
        words: words.length,
        vw: de.clientWidth,
        root: getComputedStyle(de).fontSize,
        drawn: (words.map((w) => getComputedStyle(w).display === 'none' ? null : w.textContent.trim())
          .filter(Boolean)[0]) || null,
        natural: natural,
        asBefore: asBefore,
        restored: de.scrollWidth,
      });
    })()`;

    interface WordCost {
      words: number;
      vw: number;
      root: string;
      drawn: string | null;
      natural: { sw: number; trigger: number };
      asBefore: { sw: number; trigger: number };
      restored: number;
    }

    let triggerDiffered = 0;
    for (const locale of LOCALES) {
      console.log(`\nwhat the R-NAV-4 word costs, by text size — ${locale}`);
      const url = site.origin + routes(locale as Locale).home();
      for (const scale of TEXT_SCALES) {
        await page.setTextScale(scale);
        for (const width of LABEL_WIDTHS) {
          await page.setViewport(width);
          await page.goto(url);
          await page.waitFor("document.fonts.status === 'loaded'", 8000);
          const m = JSON.parse(await page.evaluate<string>(WORD_COST)) as WordCost;
          const where = `${locale} @${width} ${scale}% text`;
          check(`${where}: the trigger still carries both words`, m.words === 2, JSON.stringify(m));
          if (m.words !== 2) continue;
          check(
            `${where}: the word costs no document width (${m.natural.sw} vs ${m.asBefore.sw})`,
            m.natural.sw === m.asBefore.sw,
            `drawn “${m.drawn}”, root ${m.root}, ${m.natural.sw - m.asBefore.sw}px more than before it`,
          );
          check(`${where}: the probe put the header back`, m.restored === m.natural.sw, JSON.stringify(m));
          if (m.natural.trigger !== m.asBefore.trigger) triggerDiffered += 1;
        }
      }
    }
    await page.setTextScale(100);

    /*
     * The control the rule above needs. It is an equality over a counterfactual,
     * and an equality is worth nothing if the counterfactual is the same page:
     * somewhere in the sweep, swapping the long word for the short one has to
     * change the trigger's own width. It does, wherever the word is drawn at
     * all — which is also the proof that the word has not quietly been dropped.
     */
    check(
      "control: swapping the word does change the trigger somewhere in the sweep",
      triggerDiffered > 0,
      `${triggerDiffered} of ${LOCALES.length * TEXT_SCALES.length * LABEL_WIDTHS.length}`,
    );
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
