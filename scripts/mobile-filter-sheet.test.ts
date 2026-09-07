/**
 * The mobile filter sheet, driven in a real browser.
 *
 * Below `sm` the five filter groups used to expand *inline*, above the results.
 * Three things were wrong with that, and none of them is visible in the markup:
 *
 *   1. **It was not modal, and behaved as if it were.** Five groups pushed the
 *      listing off the screen, so the reader chose filters while the thing they
 *      were filtering scrolled away underneath. Nothing trapped focus, nothing
 *      held the page still, and there was no scrim.
 *   2. **Every tick was a decision.** Each checkbox wrote `pushState`
 *      immediately, so choosing four filters buried the previous page under
 *      four history entries and Back walked out of them one at a time.
 *   3. **The list moved while it was being read.** The results re-rendered under
 *      the panel on every tick, which is exactly the motion a reader is trying
 *      to stop when they open the filters.
 *
 * So the groups now live in a modal bottom sheet whose selections are a
 * *draft*: the count in the primary action follows every tick, the page and the
 * URL do not move until Apply, and Apply writes exactly one history entry.
 * Escape, the close control and the backdrop discard.
 *
 * Every assertion here reads rendered DOM, the live URL, `history.length` or
 * computed style. None of them reads source text — the pure state machine is
 * exercised in `scripts/build-filters.test.ts`, and the point of this file is
 * the half that only a layout engine and a history stack can answer.
 *
 * Requires `npm run build`. Run with `npx tsx scripts/mobile-filter-sheet.test.ts`.
 */
import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { getBuilds } from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor, fmt } from "../lib/i18n";
import { routes } from "../lib/routes";
import { buildRows } from "../lib/builds/rows";
import { EMPTY_FILTER_STATE, filterBuilds } from "../lib/builds/filter";

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

/** A phone, and the desktop the same page has to switch back to. */
const PHONE = 390;
const DESKTOP = 1280;
/** Every width the spec names, for the sheet-open overflow sweep. 320 is 200% zoom on a 640px window. */
const NARROW = [320, 360, 375, 390] as const;

const t = (locale: Locale) => dictionaryFor(locale).builds.filters;

const json = (v: unknown) => JSON.stringify(v);

/** The catalogue, filtered by the same pure rules the page uses. */
const expectedCount = (locale: Locale, over: Partial<typeof EMPTY_FILTER_STATE>) =>
  filterBuilds(buildRows(locale, getBuilds(locale)), { ...EMPTY_FILTER_STATE, ...over }).length;

// ---------------------------------------------------------------------------
// Page-side locators. All of them resolve by role, accessible name or the
// data attributes the controls carry — never by position.
// ---------------------------------------------------------------------------

const TRIGGER = (locale: Locale) =>
  `[...document.querySelectorAll('button[aria-controls]')].find((b) => b.textContent.trim().startsWith(${json(
    t(locale).showFilters,
  )}))`;
const SHEET = `document.querySelector('[role="dialog"][aria-modal="true"]')`;
const SCRIM = `(${SHEET}?.previousElementSibling ?? null)`;
const BOX = (group: string, value: string) =>
  `document.querySelector('input[type="checkbox"][data-group="${group}"][data-value="${value}"]')`;
const IN_SHEET = (group: string, value: string) =>
  `(${SHEET}?.querySelector('input[type="checkbox"][data-group="${group}"][data-value="${value}"]') ?? null)`;
const APPLY = `(${SHEET} ? [...${SHEET}.querySelectorAll('button')].find((b) => b.hasAttribute('data-apply')) : null)`;
const CLEAR = `(${SHEET} ? [...${SHEET}.querySelectorAll('button')].find((b) => b.hasAttribute('data-clear')) : null)`;
const CLOSE = `(${SHEET} ? [...${SHEET}.querySelectorAll('button')].find((b) => b.hasAttribute('data-close')) : null)`;

/** How many distinct build cards the listing is showing right now. */
const SHOWN = (locale: Locale) =>
  `new Set([...document.querySelectorAll('a[href]')]
     .map((a) => a.getAttribute('href'))
     .filter((h) => new RegExp('^/${locale}/builds/[a-z0-9-]+/[a-z0-9-]+$').test(h))).size`;

interface Snapshot {
  url: string;
  history: number;
  shown: number;
  sheet: boolean;
  bodyOverflow: string;
  focus: string;
  badge: string;
  summary: string;
}

const SNAPSHOT = (locale: Locale) => `(() => {
  const trigger = ${TRIGGER(locale)} ?? null;
  const sheet = ${SHEET};
  const active = document.activeElement;
  return {
    url: location.search,
    history: history.length,
    shown: ${SHOWN(locale)},
    sheet: sheet !== null,
    bodyOverflow: getComputedStyle(document.body).overflow,
    focus: active === trigger ? "trigger"
      : sheet && sheet.contains(active) ? "in-sheet"
      : active ? active.tagName.toLowerCase() : "none",
    badge: trigger ? trigger.textContent.trim() : "",
    summary: document.querySelector('[aria-live="polite"]')?.textContent.trim() ?? "",
  };
})()`;

const snapshot = (page: Page, locale: Locale) => page.evaluate<Snapshot>(SNAPSHOT(locale));

const clickThat = (page: Page, expr: string) =>
  page.evaluate<boolean>(`(() => { const el = ${expr}; if (!el) return false; el.click(); return true; })()`);

async function openSheet(page: Page, locale: Locale): Promise<boolean> {
  await clickThat(page, TRIGGER(locale));
  return page.waitFor(`${SHEET} !== null`, 4000);
}

async function hydrated(page: Page, url: string): Promise<boolean> {
  await page.goto(url);
  return page.waitFor(`document.querySelector('input[type="search"]') !== null`, 10_000);
}

// ===========================================================================

async function main(): Promise<void> {
  const site = await startSite();
  const page = await Page.launch();

  try {
    for (const locale of LOCALES as readonly Locale[]) {
      const dict = t(locale);
      const catalogue = site.origin + routes(locale).builds();
      const total = getBuilds(locale).length;
      const cold = expectedCount(locale, { damage: ["cold"] });
      const coldLow = expectedCount(locale, { damage: ["cold"], budget: ["low"] });
      const showText = (n: number) =>
        fmt(n === 1 ? dict.showResultsOne : dict.showResultsMany, { count: n });

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: the closed state, and what hydration adds`);
      // ---------------------------------------------------------------------
      await page.setViewport(PHONE);
      if (!(await hydrated(page, catalogue))) {
        check(`${locale}: the catalogue hydrates at ${PHONE}px`, false);
        continue;
      }
      page.drainConsole();

      const s = await snapshot(page, locale);
      check(`${locale}: hydrated mobile renders the Filters trigger`, s.badge.startsWith(dict.showFilters), json(s.badge));
      check(`${locale}: nothing modal exists before it is asked for`, !s.sheet);
      check(`${locale}: the page scrolls normally while the sheet is shut`, s.bodyOverflow !== "hidden", s.bodyOverflow);
      check(`${locale}: the whole catalogue is listed`, s.shown === total, `${s.shown} of ${total}`);
      check(
        `${locale}: the search box and the summary stay in the page, not in a sheet`,
        await page.evaluate<boolean>(
          `document.querySelector('input[type="search"]') !== null && document.querySelector('[aria-live="polite"]') !== null`,
        ),
      );
      check(
        `${locale}: no filter checkbox is laid out below sm until the sheet is opened`,
        await page.evaluate<number>(
          `[...document.querySelectorAll('input[type="checkbox"]')].filter((b) => b.getClientRects().length > 0).length`,
        ) === 0,
      );
      check(
        `${locale}: the trigger announces the dialog it opens`,
        await page.evaluate<string>(
          `(() => { const b = ${TRIGGER(locale)}; return b ? [b.getAttribute("aria-expanded"), b.getAttribute("aria-haspopup")].join("|") : "missing"; })()`,
        ) === "false|dialog",
      );

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: the three defects, stated without naming a control`);
      // ---------------------------------------------------------------------
      /*
       * Written against nothing but "the trigger" and "the first filter
       * checkbox the reader can see", so it says the same thing about the panel
       * that used to expand inline and about the sheet that replaced it. These
       * are the four assertions that were red before the sheet existed: no
       * dialog, no scroll lock, and a tick that moved the URL and the history
       * stack on its own.
       */
      await clickThat(page, TRIGGER(locale));
      const opened = await page.waitFor(
        `[...document.querySelectorAll('input[type="checkbox"]')].some((b) => b.getClientRects().length > 0)`,
        4000,
      );
      check(`${locale}: the trigger reveals the filter boxes`, opened);
      const revealed = await page.evaluate<{ dialog: boolean; overflow: string; url: string; history: number }>(
        `(() => ({ dialog: ${SHEET} !== null, overflow: getComputedStyle(document.body).overflow, url: location.search, history: history.length }))()`,
      );
      check(`${locale}: what it reveals is a modal dialog`, revealed.dialog);
      check(`${locale}: opening it holds the page behind still`, revealed.overflow === "hidden", revealed.overflow);
      await page.evaluate(
        `(() => { const b = [...document.querySelectorAll('input[type="checkbox"]')].find((x) => x.getClientRects().length > 0); if (b) b.click(); })()`,
      );
      const ticked = await page.evaluate<{ url: string; history: number }>(
        `({ url: location.search, history: history.length })`,
      );
      check(
        `${locale}: one tick does not write the URL`,
        ticked.url === revealed.url,
        `${json(revealed.url)} → ${json(ticked.url)}`,
      );
      check(
        `${locale}: one tick does not write a history entry`,
        ticked.history === revealed.history,
        `${revealed.history} → ${ticked.history}`,
      );
      // Leave the page in a known state whichever way the panel closed.
      await page.press("Escape", "Escape", 27);
      await hydrated(page, catalogue);

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: opening it is genuinely modal`);
      // ---------------------------------------------------------------------
      const sheetOpened = await openSheet(page, locale);
      check(`${locale}: the trigger opens a dialog`, sheetOpened);
      if (!sheetOpened) {
        check(`${locale}: the rest of the sheet contract can be exercised`, false, "no dialog to drive");
        continue;
      }

      const modal = await page.evaluate<{
        name: string;
        expanded: string;
        focusIsClose: boolean;
        overflow: string;
        scrimCovers: boolean;
        motionless: boolean;
        motion: string;
      }>(`(() => {
        const sheet = ${SHEET};
        const close = ${CLOSE};
        const scrim = ${SCRIM};
        const cs = getComputedStyle(sheet);
        const probe = document.elementFromPoint(Math.round(innerWidth / 2), 80);
        return {
          name: sheet.getAttribute("aria-label") ?? sheet.getAttribute("aria-labelledby") ?? "",
          expanded: ${TRIGGER(locale)}?.getAttribute("aria-expanded") ?? "missing",
          focusIsClose: document.activeElement === close,
          overflow: getComputedStyle(document.body).overflow,
          scrimCovers: probe === scrim || sheet.contains(probe),
          motionless:
            cs.animationName === "none" &&
            cs.transitionDuration.split(",").every((d) => parseFloat(d) === 0),
          motion: cs.animationName + " / " + cs.transitionDuration,
        };
      })()`);

      check(`${locale}: the sheet carries the sheet title as its accessible name`, modal.name.length > 0, modal.name);
      check(`${locale}: the trigger now reports itself expanded`, modal.expanded === "true", modal.expanded);
      check(`${locale}: focus moves to the close control`, modal.focusIsClose);
      check(`${locale}: the page behind is held still`, modal.overflow === "hidden", modal.overflow);
      check(`${locale}: the scrim swallows a pointer aimed at the page behind`, modal.scrimCovers);
      /*
       * The site ships no animation anywhere, so the sheet does not move. That
       * is measured rather than assumed: a slide-up added later would be the
       * one piece of motion a `prefers-reduced-motion` reader has to opt out
       * of, and this fails until it is guarded.
       */
      check(
        `${locale}: the sheet has no nonessential movement to disable under reduced motion`,
        modal.motionless,
        modal.motion,
      );
      check(
        `${locale}: Tab is contained — every step lands back inside the sheet`,
        await (async () => {
          for (let i = 0; i < 14; i++) {
            await page.press("Tab", "Tab", 9);
            const inside = await page.evaluate<boolean>(`${SHEET}?.contains(document.activeElement) === true`);
            if (!inside) return false;
          }
          return true;
        })(),
      );
      check(
        `${locale}: Shift+Tab is contained too`,
        await (async () => {
          for (let i = 0; i < 6; i++) {
            await page.evaluate(
              `(() => { const items = [...${SHEET}.querySelectorAll('a[href],button,input')]; items[0].focus(); })()`,
            );
            await page.press("Tab", "Tab", 9);
            const inside = await page.evaluate<boolean>(`${SHEET}?.contains(document.activeElement) === true`);
            if (!inside) return false;
          }
          return true;
        })(),
      );
      check(
        `${locale}: the groups and their counts are inside the sheet`,
        await page.evaluate<number>(`${SHEET}.querySelectorAll('fieldset').length`) >= 4,
      );

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: a selection is a draft, not a decision`);
      // ---------------------------------------------------------------------
      const before = await snapshot(page, locale);
      check(`${locale}: the sheet offers the damage/cold box`, await page.evaluate<boolean>(`${IN_SHEET("damage", "cold")} !== null`));
      await clickThat(page, IN_SHEET("damage", "cold"));

      const drafted = await snapshot(page, locale);
      check(`${locale}: ticking a box does not touch the URL`, drafted.url === before.url, `${before.url} → ${drafted.url}`);
      check(
        `${locale}: …and writes no history entry`,
        drafted.history === before.history,
        `${before.history} → ${drafted.history}`,
      );
      check(`${locale}: …and the list underneath does not move`, drafted.shown === before.shown, `${before.shown} → ${drafted.shown}`);
      check(`${locale}: …and the results summary is still the applied one`, drafted.summary === before.summary);
      check(
        `${locale}: the primary action counts the draft, not the page`,
        await page.evaluate<string>(`${APPLY}?.textContent.trim() ?? "missing"`) === showText(cold),
        `expected ${json(showText(cold))}`,
      );
      await clickThat(page, IN_SHEET("budget", "low"));
      check(
        `${locale}: a second tick updates the count immediately`,
        await page.evaluate<string>(`${APPLY}?.textContent.trim() ?? "missing"`) === showText(coldLow),
        `expected ${json(showText(coldLow))}`,
      );
      await clickThat(page, IN_SHEET("budget", "low"));
      check(
        `${locale}: untickng it puts the count back`,
        await page.evaluate<string>(`${APPLY}?.textContent.trim() ?? "missing"`) === showText(cold),
      );

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: Apply commits once`);
      // ---------------------------------------------------------------------
      await clickThat(page, APPLY);
      const applied = await page.waitFor(`location.search.includes("damage=cold")`, 4000);
      check(`${locale}: Apply writes the filter to the URL`, applied);
      const after = await snapshot(page, locale);
      check(`${locale}: Apply closes the sheet`, !after.sheet);
      check(`${locale}: …restores background scrolling`, after.bodyOverflow !== "hidden", after.bodyOverflow);
      check(`${locale}: …returns focus to the Filters trigger`, after.focus === "trigger", after.focus);
      check(`${locale}: …filters the list`, after.shown === cold, `${after.shown} of ${cold}`);
      check(
        `${locale}: …and writes exactly one history entry`,
        after.history === before.history + 1,
        `${before.history} → ${after.history}`,
      );
      check(`${locale}: the trigger's badge counts the applied filters`, after.badge === `${dict.showFilters}1`, json(after.badge));

      await page.evaluate(`history.back()`);
      const back = await page.waitFor(`location.search === ""`, 4000);
      check(`${locale}: Back undoes the whole Apply in one step`, back);
      check(
        `${locale}: …and the unfiltered catalogue comes back`,
        await page.waitFor(`${SHOWN(locale)} === ${total}`, 4000),
      );
      await page.evaluate(`history.forward()`);
      check(
        `${locale}: Forward redoes it`,
        await page.waitFor(`location.search.includes("damage=cold") && ${SHOWN(locale)} === ${cold}`, 4000),
      );

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: reopening starts from what is applied`);
      // ---------------------------------------------------------------------
      check(`${locale}: it reopens`, await openSheet(page, locale));
      check(
        `${locale}: the applied filter is ticked when the sheet reopens`,
        await page.evaluate<boolean>(`${IN_SHEET("damage", "cold")}?.checked === true`),
      );
      check(
        `${locale}: and nothing else is`,
        await page.evaluate<number>(
          `[...${SHEET}.querySelectorAll('input[type="checkbox"]')].filter((b) => b.checked).length`,
        ) === 1,
      );

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: Escape, the close control and the backdrop all discard`);
      // ---------------------------------------------------------------------
      const cancels: [string, () => Promise<unknown>][] = [
        ["Escape", () => page.press("Escape", "Escape", 27)],
        ["the close control", () => clickThat(page, CLOSE)],
        ["the backdrop", () => clickThat(page, SCRIM)],
      ];
      for (const [how, act] of cancels) {
        if (!(await page.evaluate<boolean>(`${SHEET} !== null`))) await openSheet(page, locale);
        const pre = await snapshot(page, locale);
        await clickThat(page, IN_SHEET("budget", "low"));
        check(
          `${locale}: the draft moved before cancelling with ${how}`,
          await page.evaluate<boolean>(`${IN_SHEET("budget", "low")}?.checked === true`),
        );
        await act();
        const closed = await page.waitFor(`${SHEET} === null`, 4000);
        check(`${locale}: ${how} closes the sheet`, closed);
        const post = await snapshot(page, locale);
        check(`${locale}: ${how} leaves the URL alone`, post.url === pre.url, `${pre.url} → ${post.url}`);
        check(`${locale}: ${how} writes no history entry`, post.history === pre.history, `${pre.history} → ${post.history}`);
        check(`${locale}: ${how} leaves the list alone`, post.shown === pre.shown);
        check(`${locale}: ${how} restores background scrolling`, post.bodyOverflow !== "hidden", post.bodyOverflow);
        check(
          `${locale}: ${how} returns focus to the Filters trigger`,
          post.focus === "trigger",
          post.focus,
        );
        check(`${locale}: reopening after ${how} starts from the applied state`, await openSheet(page, locale));
        check(
          `${locale}: …so the discarded tick is gone`,
          await page.evaluate<boolean>(`${IN_SHEET("budget", "low")}?.checked === false`),
        );
        check(
          `${locale}: …and the applied one survived`,
          await page.evaluate<boolean>(`${IN_SHEET("damage", "cold")}?.checked === true`),
        );
        await page.press("Escape", "Escape", 27);
        await page.waitFor(`${SHEET} === null`, 4000);
      }

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: Clear inside the sheet is a draft too`);
      // ---------------------------------------------------------------------
      await openSheet(page, locale);
      const preClear = await snapshot(page, locale);
      await clickThat(page, CLEAR);
      check(
        `${locale}: Clear unticks every box in the sheet`,
        await page.evaluate<number>(
          `[...${SHEET}.querySelectorAll('input[type="checkbox"]')].filter((b) => b.checked).length`,
        ) === 0,
      );
      check(
        `${locale}: …and the primary action offers the whole catalogue again`,
        await page.evaluate<string>(`${APPLY}?.textContent.trim() ?? "missing"`) === showText(total),
        `expected ${json(showText(total))}`,
      );
      const midClear = await snapshot(page, locale);
      check(`${locale}: …while the URL still carries the applied filter`, midClear.url === preClear.url, midClear.url);
      check(`${locale}: …and the list is still the filtered one`, midClear.shown === preClear.shown);
      await page.press("Escape", "Escape", 27);
      await page.waitFor(`${SHEET} === null`, 4000);
      const afterClearCancel = await snapshot(page, locale);
      check(
        `${locale}: cancelling after Clear keeps the applied filter`,
        afterClearCancel.url === preClear.url && afterClearCancel.shown === preClear.shown,
        afterClearCancel.url,
      );

      await openSheet(page, locale);
      const preApplyClear = await snapshot(page, locale);
      await clickThat(page, CLEAR);
      await clickThat(page, APPLY);
      check(
        `${locale}: applying a cleared draft empties the query string`,
        await page.waitFor(`location.search === "" && ${SHOWN(locale)} === ${total}`, 4000),
      );
      const afterClearApply = await snapshot(page, locale);
      check(
        `${locale}: …in exactly one history entry`,
        afterClearApply.history === preApplyClear.history + 1,
        `${preApplyClear.history} → ${afterClearApply.history}`,
      );

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: what stays outside the sheet stays immediate`);
      // ---------------------------------------------------------------------
      await page.setViewport(PHONE);
      if (!(await hydrated(page, `${catalogue}?damage=cold`))) {
        check(`${locale}: a filtered link hydrates`, false);
      } else {
        const linked = await snapshot(page, locale);
        check(`${locale}: a pasted filtered link renders filtered`, linked.shown === cold, `${linked.shown} of ${cold}`);
        check(`${locale}: …with no sheet in the way`, !linked.sheet);
        /*
         * The chip's own label is the element's translated name, which this
         * file deliberately does not hardcode — it is resolved from the
         * accessible name the page actually rendered.
         */
        check(
          `${locale}: the applied filter has a removable chip outside the sheet`,
          await clickThat(
            page,
            `[...document.querySelectorAll('button[aria-label]')].find((b) => (b.getAttribute('aria-label') ?? '').startsWith(${json(
              dict.removeOne.split("{")[0],
            )}))`,
          ),
        );
        check(
          `${locale}: removing an applied chip updates the URL and the list at once`,
          await page.waitFor(`location.search === "" && ${SHOWN(locale)} === ${total}`, 4000),
        );
      }

      // Search stays immediate, on the same trailing edge it always had.
      await page.evaluate(
        `(() => { const i = document.querySelector('input[type="search"]');
           const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
           setter.call(i, 'zzqqxx');
           i.dispatchEvent(new Event('input', { bubbles: true })); })()`,
      );
      check(
        `${locale}: typing still reaches the URL on its own trailing edge`,
        await page.waitFor(`location.search.includes("q=zzqqxx")`, 4000),
      );
      check(
        `${locale}: …and the sheet was never involved`,
        await page.evaluate<boolean>(`${SHEET} === null`),
      );

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: unknown query values stay non-fatal`);
      // ---------------------------------------------------------------------
      await hydrated(page, `${catalogue}?damage=cold,not-an-element&nope=1&goodAt=`);
      const messy = await snapshot(page, locale);
      check(`${locale}: a hand-edited link still renders`, messy.shown === cold, `${messy.shown} of ${cold}`);
      await openSheet(page, locale);
      check(
        `${locale}: the sheet ignores the value the page does not offer`,
        await page.evaluate<number>(
          `[...${SHEET}.querySelectorAll('input[type="checkbox"]')].filter((b) => b.checked).length`,
        ) === 1,
      );
      await clickThat(page, APPLY);
      check(
        `${locale}: applying from a messy link writes the sanitised query`,
        await page.waitFor(`location.search === "?damage=cold"`, 4000),
        await page.evaluate<string>(`location.search`),
      );

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: desktop keeps the inline, immediate filters`);
      // ---------------------------------------------------------------------
      await page.setViewport(DESKTOP);
      if (!(await hydrated(page, catalogue))) {
        check(`${locale}: the catalogue hydrates at ${DESKTOP}px`, false);
      } else {
        check(
          `${locale}: the filter groups are laid out inline from sm up`,
          await page.evaluate<number>(
            `[...document.querySelectorAll('input[type="checkbox"]')].filter((b) => b.getClientRects().length > 0).length`,
          ) > 0,
        );
        check(
          `${locale}: the Filters trigger is not drawn on desktop`,
          await page.evaluate<boolean>(`(${TRIGGER(locale)})?.getClientRects().length === 0`),
        );
        const deskBefore = await snapshot(page, locale);
        await clickThat(page, BOX("damage", "cold"));
        check(
          `${locale}: a desktop tick writes the URL immediately`,
          await page.waitFor(`location.search.includes("damage=cold")`, 4000),
        );
        const deskAfter = await snapshot(page, locale);
        check(`${locale}: …and no dialog was created`, !deskAfter.sheet);
        check(`${locale}: …and the list follows at once`, deskAfter.shown === cold, `${deskAfter.shown} of ${cold}`);
        check(
          `${locale}: …in one history entry, as it always did`,
          deskAfter.history === deskBefore.history + 1,
          `${deskBefore.history} → ${deskAfter.history}`,
        );
        check(`${locale}: the page is never scroll-locked on desktop`, deskAfter.bodyOverflow !== "hidden", deskAfter.bodyOverflow);
      }

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: resizing out of mobile leaves nothing behind`);
      // ---------------------------------------------------------------------
      await page.setViewport(PHONE);
      await hydrated(page, `${catalogue}?damage=cold`);
      await openSheet(page, locale);
      await clickThat(page, IN_SHEET("budget", "low"));
      await page.setViewport(DESKTOP);
      const resized = await page.waitFor(`${SHEET} === null`, 4000);
      check(`${locale}: growing past sm closes the modal`, resized);
      const grown = await snapshot(page, locale);
      check(`${locale}: …restores background scrolling`, grown.bodyOverflow !== "hidden", grown.bodyOverflow);
      check(`${locale}: …and keeps the applied URL, not the abandoned draft`, grown.url === "?damage=cold", grown.url);
      check(`${locale}: …and the desktop list is the applied one`, grown.shown === cold, `${grown.shown} of ${cold}`);
      check(
        `${locale}: …with the inline groups showing the applied state`,
        await page.evaluate<string>(
          `[${BOX("damage", "cold")}?.checked, ${BOX("budget", "low")}?.checked].join("|")`,
        ) === "true|false",
      );

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: nothing runs sideways with the sheet open`);
      // ---------------------------------------------------------------------
      for (const width of NARROW) {
        await page.setViewport(width);
        if (!(await hydrated(page, catalogue))) {
          check(`${locale} @${width}: hydrates`, false);
          continue;
        }
        if (!(await openSheet(page, locale))) {
          check(`${locale} @${width}: the sheet opens`, false);
          continue;
        }
        /*
         * Per element, not `scrollWidth`. An open sheet holds `overflow:
         * hidden` on the body, which clips the very thing `scrollWidth` is
         * there to report — so the document-level measurement that
         * `viewport.test.ts` uses on an unlocked page would pass here whatever
         * ran past the edge. The right-hand rule is the same one, applied to
         * boxes: the left edge is deliberately not policed, because `sr-only`
         * parks the skip link a pixel off-screen on every page in the site.
         */
        const overflow = await page.evaluate<{ worst: number; limit: number; who: string[] }>(`(() => {
          const limit = document.documentElement.clientWidth;
          let worst = 0;
          const who = [];
          for (const el of document.querySelectorAll("*")) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            if (r.right > worst) worst = r.right;
            if (r.right > limit + 0.5) {
              who.push(el.tagName.toLowerCase() + " " + Math.round(r.left) + ".." + Math.round(r.right));
            }
          }
          return { worst: Math.round(worst), limit, who: who.slice(0, 4) };
        })()`);
        check(
          `${locale} @${width}: nothing reaches past the viewport with the sheet open`,
          overflow.who.length === 0,
          `worst right ${overflow.worst} vs ${overflow.limit}; ${overflow.who.join(" | ")}`,
        );
        const targets = await page.evaluate<string[]>(`(() => {
          const small = [];
          for (const cb of ${SHEET}.querySelectorAll('input[type="checkbox"]')) {
            const label = cb.closest('label');
            const r = (label ?? cb).getBoundingClientRect();
            if (r.width < 23.5 || r.height < 23.5) small.push(Math.round(r.width) + "x" + Math.round(r.height));
          }
          return small.slice(0, 4);
        })()`);
        check(`${locale} @${width}: every row in the sheet is still a 24px target`, targets.length === 0, targets.join(", "));
        await page.press("Escape", "Escape", 27);
      }

      const noise = page.drainConsole().filter((m) => !/favicon|404/i.test(m));
      check(`${locale}: the browser reported nothing wrong through all of that`, noise.length === 0, noise.slice(0, 3).join(" | "));
    }

    // -----------------------------------------------------------------------
    console.log("\nWithout JavaScript there is nothing modal to find");
    // -----------------------------------------------------------------------
    await page.setScriptsEnabled(false);
    for (const locale of LOCALES as readonly Locale[]) {
      await page.setViewport(PHONE);
      await page.goto(site.origin + routes(locale).builds());
      const plain = await page.evaluate<{ shown: number; dialogs: number; boxes: number; triggers: number }>(
        `(() => ({
          shown: ${SHOWN(locale)},
          dialogs: document.querySelectorAll('[role="dialog"]').length,
          boxes: document.querySelectorAll('input[type="checkbox"]').length,
          triggers: [...document.querySelectorAll('button')].filter((b) => b.textContent.trim().startsWith(${json(
            t(locale).showFilters,
          )})).length,
        }))()`,
      );
      check(`${locale}: the complete catalogue is there without JavaScript`, plain.shown === getBuilds(locale).length, `${plain.shown}`);
      check(`${locale}: …with no dialog`, plain.dialogs === 0, String(plain.dialogs));
      check(`${locale}: …no checkbox`, plain.boxes === 0, String(plain.boxes));
      check(`${locale}: …and no Filters trigger`, plain.triggers === 0, String(plain.triggers));
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
