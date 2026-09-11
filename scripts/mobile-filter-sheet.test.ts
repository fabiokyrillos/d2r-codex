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
 * Phase 3 kept the sheet and changed what it holds (R-FILT-12). The class chips
 * and the stage picker are always on the page and never inside it; the sheet
 * carries the four *advanced* groups only, behind "More filters". Its counts
 * are now conditional — each option says how many builds the draft would show
 * with it ticked, other groups considered, its own ignored — and an option the
 * draft has driven to zero is `disabled` with a visible `0`, while a ticked one
 * never is (R-FILT-4). Those are draft facts, so they are asserted here rather
 * than in the desktop gate: the number moves before Apply, and only the sheet
 * can show that.
 *
 * Every assertion here reads rendered DOM, the live URL, `history.length` or
 * computed style. None of them reads source text — the pure state machine is
 * exercised in `scripts/build-filters.test.ts`, and the point of this file is
 * the half that only a layout engine and a history stack can answer.
 *
 * Requires `npm run build`. Run with `npm run test:mobile-filter-sheet`.
 */
import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { getBuilds } from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor, fmt } from "../lib/i18n";
import { routes } from "../lib/routes";
import { buildRows } from "../lib/builds/rows";
import { EMPTY_FILTER_STATE, RATING_AXES, filterBuilds } from "../lib/builds/filter";
import { BUDGET_LEVELS, DIFFICULTY_RATINGS, ELEMENTS } from "../lib/types/core";

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

/**
 * The one trigger. Below `sm` it opens this sheet; from `sm` up the same
 * button opens the non-modal popover `filters-desktop.test.ts` drives, which is
 * why it is found by its marker and not by the word on it.
 */
const TRIGGER = () => `document.querySelector('button[data-more-filters]')`;
const READY = `document.querySelector('[data-filters][data-filters-ready]')`;
const SHEET = `document.querySelector('[role="dialog"][aria-modal="true"]')`;
const POPOVER = `document.querySelector('[role="dialog"][data-popover]')`;
const SCRIM = `(${SHEET}?.previousElementSibling ?? null)`;
const BOX = (group: string, value: string) =>
  `document.querySelector('input[type="checkbox"][data-group="${group}"][data-value="${value}"]')`;
const IN_SHEET = (group: string, value: string) =>
  `(${SHEET}?.querySelector('input[type="checkbox"][data-group="${group}"][data-value="${value}"]') ?? null)`;
const APPLY = `(${SHEET} ? [...${SHEET}.querySelectorAll('button')].find((b) => b.hasAttribute('data-apply')) : null)`;
const CLEAR = `(${SHEET} ? [...${SHEET}.querySelectorAll('button')].find((b) => b.hasAttribute('data-clear')) : null)`;
const CLOSE = `(${SHEET} ? [...${SHEET}.querySelectorAll('button')].find((b) => b.hasAttribute('data-close')) : null)`;
const CHIP = (slug: string) => `document.querySelector('[data-class-chips] button[data-class=${json(slug)}]')`;

/** How many distinct build cards the listing is showing right now. */
const SHOWN = (locale: Locale) =>
  `new Set([...document.querySelectorAll('a[data-card][href]')]
     .map((a) => a.getAttribute('href'))
     .filter((h) => new RegExp('^/${locale}/builds/[a-z0-9-]+/[a-z0-9-]+$').test(h))).size`;

/**
 * An option's row inside the sheet, as the reader sees it: ticked or not,
 * enabled or not, and the number it shows. The count is read as the first
 * integer in `[data-count]`, so a `(0)` and a bare `0` read the same.
 */
const ROW = (group: string, value: string) => `(() => {
  const box = ${IN_SHEET(group, value)};
  if (!box) return null;
  const row = box.closest('label') || box;
  const c = row.querySelector('[data-count]');
  const m = c ? (c.textContent || '').match(/[0-9]+/) : null;
  return { checked: box.checked, disabled: box.disabled, count: m ? Number(m[0]) : null, text: c ? (c.textContent || '').trim() : null };
})()`;

interface Row {
  checked: boolean;
  disabled: boolean;
  count: number | null;
  text: string | null;
}

/**
 * An option in another group that ticking `damage/cold` drives to zero, and
 * one it leaves alive — both from the data, so the assertion about a `0`
 * appearing inside the draft is about a real option rather than a named one.
 */
function driftUnderCold(locale: Locale): { zeroed: { group: string; value: string; before: number } | null; alive: { group: string; value: string; after: number } | null } {
  const rows = buildRows(locale, getBuilds(locale));
  const count = (over: Partial<typeof EMPTY_FILTER_STATE>) => filterBuilds(rows, { ...EMPTY_FILTER_STATE, ...over }).length;
  const groups: [string, readonly string[]][] = [
    ["difficulty", DIFFICULTY_RATINGS],
    ["budget", BUDGET_LEVELS],
    ["goodAt", RATING_AXES],
  ];
  let zeroed: { group: string; value: string; before: number } | null = null;
  let alive: { group: string; value: string; after: number } | null = null;
  for (const [group, values] of groups) {
    for (const value of values) {
      const before = count({ [group]: [value] } as Partial<typeof EMPTY_FILTER_STATE>);
      const after = count({ damage: ["cold"], [group]: [value] } as Partial<typeof EMPTY_FILTER_STATE>);
      if (before > 0 && after === 0 && !zeroed) zeroed = { group, value, before };
      if (before > 0 && after > 0 && !alive) alive = { group, value, after };
    }
  }
  return { zeroed, alive };
}

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

/**
 * `badge` is the trigger's `[data-badge]` — the count of *advanced* filters
 * applied — or the empty string when the trigger shows none. The class chips
 * are not advanced, so a `?class=` alone leaves it empty, and that is asserted.
 */
const SNAPSHOT = (locale: Locale) => `(() => {
  const trigger = ${TRIGGER()} ?? null;
  const sheet = ${SHEET};
  const active = document.activeElement;
  const badge = trigger ? trigger.querySelector('[data-badge]') : null;
  return {
    url: location.search,
    history: history.length,
    shown: ${SHOWN(locale)},
    sheet: sheet !== null,
    bodyOverflow: getComputedStyle(document.body).overflow,
    focus: active === trigger ? "trigger"
      : sheet && sheet.contains(active) ? "in-sheet"
      : active ? active.tagName.toLowerCase() : "none",
    badge: badge ? (badge.textContent || '').trim() : "",
    summary: document.querySelector('[data-results][aria-live="polite"]')?.textContent.trim() ?? "",
  };
})()`;

const snapshot = (page: Page, locale: Locale) => page.evaluate<Snapshot>(SNAPSHOT(locale));

const clickThat = (page: Page, expr: string) =>
  page.evaluate<boolean>(`(() => { const el = ${expr}; if (!el) return false; el.click(); return true; })()`);

async function openSheet(page: Page): Promise<boolean> {
  await clickThat(page, TRIGGER());
  return page.waitFor(`${SHEET} !== null`, 4000);
}

/**
 * Loads a listing and waits for it to hydrate.
 *
 * By `location.replace` rather than a fresh navigation once a document is
 * open. Chrome keeps at most fifty entries of session history per tab, and
 * this file's "exactly one history entry" assertions compare `history.length`
 * before and after — which stop meaning anything the moment the cap is hit.
 * Replacing keeps the history to the decisions the page itself makes; the
 * stamp tells the new document from the old one when the two share a URL, and
 * the try covers the moment between them when there is no context to ask.
 */
async function hydrated(page: Page, url: string): Promise<boolean> {
  const current = await page.evaluate<string>("location.href");
  if (!current.startsWith("http")) {
    await page.goto(url);
  } else {
    await page.evaluate(`(() => { window.__gateStamp = true; location.replace(${json(url)}); return 1; })()`);
    const deadline = Date.now() + 15_000;
    for (;;) {
      try {
        if (await page.evaluate<boolean>(`!window.__gateStamp && document.readyState !== 'loading'`)) break;
      } catch {
        // The old context is gone and the new one is not up yet.
      }
      if (Date.now() > deadline) return false;
      await new Promise((r) => setTimeout(r, 80));
    }
  }
  return page.waitFor(`${READY} !== null`, 10_000);
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
      check(`${locale}: hydrated mobile renders the More-filters trigger, badge empty`, await page.evaluate<boolean>(`${TRIGGER()} !== null`) && s.badge === "", json(s.badge));
      check(`${locale}: nothing modal exists before it is asked for`, !s.sheet);
      check(`${locale}: the page scrolls normally while the sheet is shut`, s.bodyOverflow !== "hidden", s.bodyOverflow);
      check(`${locale}: the whole catalogue is listed`, s.shown === total, `${s.shown} of ${total}`);
      check(
        `${locale}: the results counter stays in the page, and there is no inline search box (R-FILT-8)`,
        await page.evaluate<boolean>(
          `document.querySelector('input[type="search"]') === null && document.querySelector('[data-results][aria-live="polite"]') !== null`,
        ),
      );
      check(
        `${locale}: the class chips and the stage picker are on the page, outside any sheet`,
        await page.evaluate<boolean>(
          `document.querySelectorAll('[data-class-chips] button[data-class]').length === 8 && document.querySelector('[data-stage-picker]') !== null && ${SHEET} === null`,
        ),
      );
      check(
        `${locale}: no filter checkbox is laid out below sm until the sheet is opened`,
        await page.evaluate<number>(
          `[...document.querySelectorAll('input[type="checkbox"]')].filter((b) => b.getClientRects().length > 0).length`,
        ) === 0,
      );
      check(
        `${locale}: the trigger is collapsed and names what it controls`,
        await page.evaluate<string>(
          `(() => { const b = ${TRIGGER()}; return b ? [b.getAttribute("aria-expanded"), b.getAttribute("aria-controls") ? "controls" : "no-controls"].join("|") : "missing"; })()`,
        ) === "false|controls",
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
      await clickThat(page, TRIGGER());
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
      const sheetOpened = await openSheet(page);
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
          expanded: ${TRIGGER()}?.getAttribute("aria-expanded") ?? "missing",
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
      /*
       * What the sheet holds, and what it must not. The four advanced groups
       * are disclosures with the first one open; the class chips and the stage
       * picker are the page's, never the sheet's — a class chip inside a draft
       * would be the one control whose tick is not a decision, and a picker
       * inside a modal would hide a preference behind Apply.
       */
      const contents = await page.evaluate<{ groups: string[]; open: boolean[]; classChips: number; picker: number; counts: number; boxes: number }>(`(() => {
        const sheet = ${SHEET};
        const groups = [...sheet.querySelectorAll('details[data-group]')];
        const boxes = [...sheet.querySelectorAll('input[type="checkbox"][data-group][data-value]')];
        return {
          groups: groups.map((d) => d.dataset.group),
          open: groups.map((d) => d.open),
          classChips: sheet.querySelectorAll('[data-class]').length,
          picker: sheet.querySelectorAll('[data-stage-picker]').length,
          counts: boxes.filter((b) => !!(b.closest('label') || b.parentElement).querySelector('[data-count]')).length,
          boxes: boxes.length,
        };
      })()`);
      check(
        `${locale}: the sheet holds the four advanced groups as disclosures, the first one open`,
        contents.groups.join(",") === "damage,difficulty,budget,goodAt" && contents.open[0] === true && contents.open.slice(1).every((o) => !o),
        json(contents),
      );
      check(`${locale}: …and no class chip or stage picker inside it`, contents.classChips === 0 && contents.picker === 0, json(contents));
      check(`${locale}: …and every option row carries a count`, contents.boxes > 0 && contents.counts === contents.boxes, `${contents.counts} counts for ${contents.boxes} boxes`);

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
      /*
       * The counts inside the sheet follow the draft too (R-FILT-4, "também
       * dentro da sheet"). With cold ticked, an option in another group that
       * no cold build carries reads `0` and is disabled; one that cold builds
       * do carry reads its conditional number; and cold itself — ticked — is
       * never disabled whatever its count. Which options those are comes from
       * the data above, so the assertion is about a real `0`, not a named one.
       */
      const drift = driftUnderCold(locale);
      check(`${locale}: the data has an option cold drives to zero, and one it leaves alive`, !!drift.zeroed && !!drift.alive, json(drift));
      if (drift.zeroed && drift.alive) {
        const z = drift.zeroed;
        const a = drift.alive;
        const zeroRow = await page.evaluate<Row | null>(ROW(z.group, z.value));
        const aliveRow = await page.evaluate<Row | null>(ROW(a.group, a.value));
        const coldRow = await page.evaluate<Row | null>(ROW("damage", "cold"));
        check(`${locale}: ${z.group}/${z.value} reads 0 in the draft and is disabled, unticked`, !!zeroRow && zeroRow.count === 0 && zeroRow.disabled && !zeroRow.checked, json(zeroRow));
        check(`${locale}: …with the 0 visible, not hidden`, !!zeroRow && zeroRow.text !== null && /(^|[^0-9])0([^0-9]|$)/.test(zeroRow.text), json(zeroRow?.text));
        check(`${locale}: ${a.group}/${a.value} reads its conditional count, ${a.after}, and stays enabled`, !!aliveRow && aliveRow.count === a.after && !aliveRow.disabled, json(aliveRow));
        check(`${locale}: cold, ticked, is enabled and counts its own group unconditionally`, !!coldRow && coldRow.checked && !coldRow.disabled && coldRow.count === cold, json(coldRow));
        // A disabled row is inert inside the draft as well.
        await clickThat(page, IN_SHEET(z.group, z.value));
        check(
          `${locale}: pressing the disabled row changes neither the draft nor the count`,
          (await page.evaluate<Row | null>(ROW(z.group, z.value)))?.checked === false &&
            (await page.evaluate<string>(`${APPLY}?.textContent.trim() ?? "missing"`)) === showText(cold),
        );
        // Unticking cold restores the option's full count and its enablement.
        await clickThat(page, IN_SHEET("damage", "cold"));
        const restored = await page.evaluate<Row | null>(ROW(z.group, z.value));
        check(`${locale}: unticking cold gives ${z.group}/${z.value} its ${z.before} back and re-enables it`, !!restored && restored.count === z.before && !restored.disabled, json(restored));
        await clickThat(page, IN_SHEET("damage", "cold"));
      }

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
      check(`${locale}: the trigger's badge counts the applied advanced filters`, after.badge === "1", json(after.badge));

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
      check(`${locale}: it reopens`, await openSheet(page));
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
        if (!(await page.evaluate<boolean>(`${SHEET} !== null`))) await openSheet(page);
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
        check(`${locale}: reopening after ${how} starts from the applied state`, await openSheet(page));
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
      await openSheet(page);
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

      await openSheet(page);
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
        check(`${locale}: …and the badge reads 1 on arrival`, linked.badge === "1", json(linked.badge));
        /*
         * The chip's accessible name is the element's translated name, which
         * this file deliberately does not hardcode — the chip is found by the
         * group and value it removes, which is what the reader is removing.
         */
        check(
          `${locale}: the applied filter has a removable chip outside the sheet`,
          await clickThat(page, `document.querySelector('[data-applied] button[data-group="damage"][data-value="cold"]')`),
        );
        check(
          `${locale}: removing an applied chip updates the URL and the list at once`,
          await page.waitFor(`location.search === "" && ${SHOWN(locale)} === ${total}`, 4000),
        );

        // Clear-all lives in the same row as the chips, and is immediate too.
        await hydrated(page, `${catalogue}?damage=cold&budget=low`);
        const preClearAll = await snapshot(page, locale);
        check(`${locale}: two applied filters render together`, preClearAll.shown === coldLow, `${preClearAll.shown} of ${coldLow}`);
        check(`${locale}: …so Clear all is offered`, await page.evaluate<boolean>(`document.querySelector('button[data-clear-all]') !== null`));
        await clickThat(page, `document.querySelector('button[data-clear-all]')`);
        check(
          `${locale}: Clear all outside the sheet empties the URL and the list at once`,
          await page.waitFor(`location.search === "" && ${SHOWN(locale)} === ${total}`, 4000),
        );
        const postClearAll = await snapshot(page, locale);
        check(
          `${locale}: …in one history entry, with no sheet involved`,
          postClearAll.history === preClearAll.history + 1 && !postClearAll.sheet,
          `${preClearAll.history} → ${postClearAll.history}`,
        );
      }

      /*
       * The class chips are outside the sheet, so on a phone a chip is still
       * one immediate decision — pressed, in the URL, one entry, no dialog —
       * exactly as it is on the desktop. A chip routed through the draft would
       * be the one control whose tick is not a decision.
       */
      if (await hydrated(page, catalogue)) {
        const firstClass = getBuilds(locale)[0].classSlug;
        const ofClass = expectedCount(locale, { class: [firstClass] });
        const preChip = await snapshot(page, locale);
        check(`${locale}: the ${firstClass} chip is on the phone's page`, await clickThat(page, CHIP(firstClass)));
        check(
          `${locale}: a class chip on the phone writes the URL and narrows the list at once`,
          await page.waitFor(`new URLSearchParams(location.search).get("class") === ${json(firstClass)} && ${SHOWN(locale)} === ${ofClass}`, 4000),
        );
        const postChip = await snapshot(page, locale);
        check(`${locale}: …in one history entry, with no sheet involved`, postChip.history === preChip.history + 1 && !postChip.sheet, `${preChip.history} → ${postChip.history}`);
        check(`${locale}: …the chip reports itself pressed`, await page.evaluate<boolean>(`${CHIP(firstClass)}?.getAttribute('aria-pressed') === 'true'`));
        check(`${locale}: …and the badge stays empty — a class is not an advanced filter`, postChip.badge === "", json(postChip.badge));
      } else check(`${locale}: the catalogue hydrates for the chip`, false);

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: unknown query values stay non-fatal`);
      // ---------------------------------------------------------------------
      await hydrated(page, `${catalogue}?damage=cold,not-an-element&nope=1&goodAt=`);
      const messy = await snapshot(page, locale);
      check(`${locale}: a hand-edited link still renders`, messy.shown === cold, `${messy.shown} of ${cold}`);
      /*
       * `q` left with the inline search (R-FILT-8, plan §4.1). A link that
       * still carries one is an unknown parameter now: ignored, without
       * dropping the valid parameters beside it.
       */
      await hydrated(page, `${catalogue}?q=zzqqxx&damage=cold`);
      const stale = await snapshot(page, locale);
      check(`${locale}: an old ?q= is ignored and the valid filter beside it is kept`, stale.shown === cold && stale.badge === "1", `${stale.shown} of ${cold}, badge ${json(stale.badge)}`);
      check(`${locale}: …and it did not resurrect a search box`, await page.evaluate<number>(`document.querySelectorAll('input[type="search"]').length`) === 0);
      await hydrated(page, `${catalogue}?damage=cold,not-an-element&nope=1&goodAt=`);
      await openSheet(page);
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
      console.log(`\n${locale}: desktop keeps the immediate filters — in a popover, not a sheet`);
      // ---------------------------------------------------------------------
      /*
       * From `sm` up the same trigger opens a *non-modal* popover whose ticks
       * apply live, one entry each. The full popover contract is
       * `filters-desktop.test.ts`'s; what this file holds is the boundary: the
       * sheet's modal half — `aria-modal`, the scroll lock, the draft — must
       * not leak across it.
       */
      await page.setViewport(DESKTOP);
      if (!(await hydrated(page, catalogue))) {
        check(`${locale}: the catalogue hydrates at ${DESKTOP}px`, false);
      } else {
        check(
          `${locale}: no checkbox is laid out until the trigger is pressed`,
          await page.evaluate<number>(
            `[...document.querySelectorAll('input[type="checkbox"]')].filter((b) => b.getClientRects().length > 0).length`,
          ) === 0,
        );
        check(
          `${locale}: the trigger is drawn on desktop too`,
          await page.evaluate<boolean>(`(${TRIGGER()})?.getClientRects().length > 0`),
        );
        await clickThat(page, TRIGGER());
        check(`${locale}: it opens a popover, not the sheet`, await page.waitFor(`${POPOVER} !== null && ${SHEET} === null`, 4000));
        const deskBefore = await snapshot(page, locale);
        await clickThat(page, BOX("damage", "cold"));
        check(
          `${locale}: a desktop tick writes the URL immediately`,
          await page.waitFor(`location.search.includes("damage=cold")`, 4000),
        );
        const deskAfter = await snapshot(page, locale);
        check(`${locale}: …and no modal dialog was created`, !deskAfter.sheet);
        check(`${locale}: …and the list follows at once`, await page.waitFor(`${SHOWN(locale)} === ${cold}`, 4000), `${deskAfter.shown} of ${cold}`);
        check(
          `${locale}: …in one history entry, as it always did`,
          deskAfter.history === deskBefore.history + 1,
          `${deskBefore.history} → ${deskAfter.history}`,
        );
        check(`${locale}: the page is never scroll-locked on desktop`, deskAfter.bodyOverflow !== "hidden", deskAfter.bodyOverflow);
        await page.press("Escape", "Escape", 27);
        check(`${locale}: Escape closes the popover`, await page.waitFor(`${POPOVER} === null`, 4000));
      }

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: resizing out of mobile leaves nothing behind`);
      // ---------------------------------------------------------------------
      await page.setViewport(PHONE);
      await hydrated(page, `${catalogue}?damage=cold`);
      await openSheet(page);
      await clickThat(page, IN_SHEET("budget", "low"));
      await page.setViewport(DESKTOP);
      const resized = await page.waitFor(`${SHEET} === null`, 4000);
      check(`${locale}: growing past sm closes the modal`, resized);
      const grown = await snapshot(page, locale);
      check(`${locale}: …restores background scrolling`, grown.bodyOverflow !== "hidden", grown.bodyOverflow);
      check(`${locale}: …and keeps the applied URL, not the abandoned draft`, grown.url === "?damage=cold", grown.url);
      check(`${locale}: …and the desktop list is the applied one`, grown.shown === cold, `${grown.shown} of ${cold}`);
      check(
        `${locale}: …with the trigger collapsed and badged for the applied filter`,
        await page.evaluate<string>(`(() => { const b = ${TRIGGER()}; return b ? b.getAttribute('aria-expanded') : 'missing'; })()`) === "false" && grown.badge === "1",
        json(grown.badge),
      );
      await clickThat(page, TRIGGER());
      check(`${locale}: …and the popover it now opens shows the applied state, not the draft`, await page.waitFor(`${POPOVER} !== null`, 4000));
      check(
        `${locale}: …cold ticked, low not`,
        await page.evaluate<string>(
          `[${BOX("damage", "cold")}?.checked, ${BOX("budget", "low")}?.checked].join("|")`,
        ) === "true|false",
      );
      await page.press("Escape", "Escape", 27);
      await page.waitFor(`${POPOVER} === null`, 4000);

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: nothing runs sideways with the sheet open`);
      // ---------------------------------------------------------------------
      for (const width of NARROW) {
        await page.setViewport(width);
        if (!(await hydrated(page, catalogue))) {
          check(`${locale} @${width}: hydrates`, false);
          continue;
        }
        if (!(await openSheet(page))) {
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
          // A chip inside one of the two horizontal scrollers is *meant* to sit
          // past the edge — that row scrolling instead of the page is what the
          // fold gate requires at 320 and 390 — so a scroller's descendants are
          // judged by the scroller's own box, which is in the sweep like any other.
          const scrolls = (el) => { const o = getComputedStyle(el).overflowX; return o === "auto" || o === "scroll"; };
          for (const el of document.querySelectorAll("*")) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            let inScroller = false;
            for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { if (scrolls(a)) { inScroller = true; break; } }
            if (inScroller) continue;
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

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: a ticked option is never disabled, even at zero`);
      // ---------------------------------------------------------------------
      /*
       * The one state where a ticked option has a count of 0 is reachable by
       * URL only: a class that has one build of one damage type and none of
       * another, with both selected. The zero one must stay enabled — a
       * disabled tick is a filter the reader cannot take off — and, by the
       * plan's decision 2, unticking the value that contributes takes the inert
       * sibling with it, so the draft's count goes to the class's whole list
       * rather than to zero.
       */
      {
        const rows = buildRows(locale, getBuilds(locale));
        const classSlugs = [...new Set(rows.map((r) => r.classSlug))];
        const count = (over: Partial<typeof EMPTY_FILTER_STATE>) => filterBuilds(rows, { ...EMPTY_FILTER_STATE, ...over }).length;
        let pair: { classSlug: string; zero: string; one: string } | null = null;
        for (const c of classSlugs) {
          const zero = ELEMENTS.find((d) => count({ class: [c], damage: [d] }) === 0);
          const one = ELEMENTS.find((d) => count({ class: [c], damage: [d] }) === 1);
          if (zero && one) {
            pair = { classSlug: c, zero, one };
            break;
          }
        }
        check(`${locale}: the data has a class with one build of one damage type and none of another`, pair !== null);
        if (pair) {
          await page.setViewport(PHONE);
          if (await hydrated(page, `${catalogue}?class=${pair.classSlug}&damage=${pair.zero},${pair.one}`)) {
            const whole = count({ class: [pair.classSlug] });
            const s = await snapshot(page, locale);
            check(`${locale}: ?class=${pair.classSlug}&damage=${pair.zero},${pair.one} shows the one build`, s.shown === 1, `${s.shown}`);
            check(`${locale}: the sheet opens on it`, await openSheet(page));
            const zeroRow = await page.evaluate<Row | null>(ROW("damage", pair.zero));
            const oneRow = await page.evaluate<Row | null>(ROW("damage", pair.one));
            check(`${locale}: ${pair.zero} is ticked, reads 0, and is not disabled`, !!zeroRow && zeroRow.checked && zeroRow.count === 0 && !zeroRow.disabled, json(zeroRow));
            check(`${locale}: ${pair.one} is ticked and reads 1`, !!oneRow && oneRow.checked && oneRow.count === 1 && !oneRow.disabled, json(oneRow));
            await clickThat(page, IN_SHEET("damage", pair.one));
            check(
              `${locale}: unticking ${pair.one} takes ${pair.zero} with it, and the draft counts the whole class (${whole})`,
              (await page.evaluate<Row | null>(ROW("damage", pair.zero)))?.checked === false &&
                (await page.evaluate<string>(`${APPLY}?.textContent.trim() ?? "missing"`)) === showText(whole),
              await page.evaluate<string>(`${APPLY}?.textContent.trim() ?? "missing"`),
            );
            await page.press("Escape", "Escape", 27);
            await page.waitFor(`${SHEET} === null`, 4000);
          } else check(`${locale}: the two-damage link hydrates`, false);
        }
      }

      const noise = page.drainConsole().filter((m) => !/favicon|404/i.test(m));
      check(`${locale}: the browser reported nothing wrong through all of that`, noise.length === 0, noise.slice(0, 3).join(" | "));
    }

    // -----------------------------------------------------------------------
    console.log("\nWithout JavaScript there is nothing modal to find");
    // -----------------------------------------------------------------------
    /*
     * Scripts off *before* the navigation and left off through the probe: a
     * page that had its bundle re-enabled between `goto` and `evaluate` would
     * hydrate under the probe and report the enhanced page as the plain one.
     */
    await page.setScriptsEnabled(false);
    for (const locale of LOCALES as readonly Locale[]) {
      await page.setViewport(PHONE);
      await page.goto(site.origin + routes(locale).builds());
      const plain = await page.evaluate<{ shown: number; dialogs: number; boxes: number; triggers: number; links: number; pickers: number; search: number }>(
        `(() => ({
          shown: ${SHOWN(locale)},
          dialogs: document.querySelectorAll('[role="dialog"]').length,
          boxes: document.querySelectorAll('input[type="checkbox"]').length,
          triggers: document.querySelectorAll('button[data-more-filters]').length,
          links: document.querySelectorAll('[data-class-chips] a[data-class][href]').length,
          pickers: document.querySelectorAll('[data-stage-picker]').length,
          search: document.querySelectorAll('input[type="search"]').length,
        }))()`,
      );
      check(`${locale}: the complete catalogue is there without JavaScript`, plain.shown === getBuilds(locale).length, `${plain.shown}`);
      check(`${locale}: …with no dialog`, plain.dialogs === 0, String(plain.dialogs));
      check(`${locale}: …no checkbox`, plain.boxes === 0, String(plain.boxes));
      check(`${locale}: …no More-filters trigger, no stage picker, no search box`, plain.triggers === 0 && plain.pickers === 0 && plain.search === 0, `${plain.triggers}/${plain.pickers}/${plain.search}`);
      check(`${locale}: …and the eight class chips as links (R-FILT-14)`, plain.links === 8, String(plain.links));
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
