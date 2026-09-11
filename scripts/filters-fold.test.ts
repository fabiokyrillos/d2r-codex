/**
 * The fold: how far down the page the first card is, in pixels, measured.
 *
 * The whole reason for Phase 3 is a number. Before it, the first build card sat
 * 490/443/772/644px from the top of the document at 320/390/768/1280 — the
 * PRD's own baseline (§12.2), reproduced to the pixel on `a0258b9` before any
 * change was made (Phase 3 plan §3) — because twenty-eight checkboxes stood
 * between the title and the list. Every acceptance criterion the redesign
 * carries is a distance or a size (R-FILT-1, R-FILT-11, R-FILT-15, R-FILT-16,
 * R-A11Y-4), and none of them can be read from markup: they are facts about
 * laid-out boxes after fonts, CSS and hydration have all had their say.
 *
 * So this measures, and it measures the way the report in Phase 2 learned to:
 * after the listing has hydrated, after the fonts are in, and only once the
 * document's height has stopped moving — two identical readings 150ms apart —
 * because a card measured while the page is still growing is a number about a
 * moment nobody sees.
 *
 * Two kinds of assertion live here and they are deliberately not the same:
 *
 *   - **The PRD's own limits**, held as written: chips within 120px of the
 *     title, the grid within 220px of it at 1280, the class page's first card
 *     within 260px of its heading, a card at 390px no taller than 80% of what
 *     it was, chips 44px on both axes.
 *   - **A regression ceiling on the absolute offset**, which the plan (§8)
 *     says is *measured and published* rather than promised: the PRD's targets
 *     are the placeholder, and the coordinator replaces them with what the
 *     integrated build measures, plus five percent, so the next change to the
 *     title block or the controls cannot quietly give the pixels back. The
 *     numbers are printed on every run for exactly that reason.
 *
 * Requires `npm run build`. Run with `npm run test:filters-fold`.
 */
import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { getBuilds, getClasses } from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
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

/** The four widths the PRD measured at, and the plan's table reports. */
const WIDTHS = [320, 390, 768, 1280] as const;
type Width = (typeof WIDTHS)[number];
/** The widths at which the chip rows are expected to scroll rather than wrap. */
const NARROW: readonly Width[] = [320, 390];
/** Where the primary controls are measured as touch targets (R-A11Y-4). */
const TARGET_WIDTHS: readonly Width[] = [320, 390, 1280];

/** R-FILT-1: the class chip row starts within this of the title's bottom edge. */
const CHIPS_BELOW_TITLE = 120;
/** R-FILT-11: at 1280 the grid starts within this of the title's top edge. */
const GRID_BELOW_TITLE_AT_DESKTOP = 220;
/** R-FILT-15: on a class page the first card is within this of "Start here". */
const CLASS_CARD_BELOW_HEADING = 260;
/** R-A11Y-4: a primary control is at least this on both axes. */
const PRIMARY_TARGET = 44;

/**
 * R-FILT-16: a card at 390px is no taller than 80% of what it was.
 *
 * Provenance of the baseline: the first card of the catalogue measured 315px
 * tall in en-US and 386px in pt-BR at 390px on `a0258b9`, before any Phase 3
 * change, in headless Chrome at the default text size (Phase 3 plan §3, column
 * "cartão (1º)"; the same probe reproduced both numbers before this file was
 * written). 80% of those is 252 and 308.8, rounded up to 309.
 */
const CARD_HEIGHT_CEILING: Record<Locale, number> = { "en-us": 252, "pt-br": 309 };

/**
 * PLACEHOLDER — the PRD's own targets for the first card's absolute offset
 * (§12.2 O2), used until the integrated build is measured.
 *
 * The plan's arithmetic (§3) already says 300 cannot be reached at 320 and 390
 * with the current title block, so a red line here at those widths is the
 * report's finding, not a defect in the listing. The coordinator replaces every
 * entry with the integrated build's measured offset × 1.05, rounded up, so this
 * becomes a regression ceiling on what shipped rather than a wish. The measured
 * numbers are printed by every run so that replacement is a copy, not a guess.
 */
const REGRESSION_CEILING: Record<Width, number> = { 320: 300, 390: 300, 768: 360, 1280: 220 };

const READY = `document.querySelector('[data-filters][data-filters-ready]')`;

/**
 * Loads a page and waits until nothing is still moving.
 *
 * Three things have to be true before a rectangle means anything: the listing
 * has hydrated (the marker), the fonts are in (a fallback face lays out at a
 * different height), and the document has stopped growing — read twice, 150ms
 * apart, and equal. The last one is the lesson of Phase 2 §10.9: quiet is not
 * arrival, so the wait is for the marker first and only then for stillness.
 */
async function settle(page: Page, url: string, ready: string): Promise<boolean> {
  await page.goto(url);
  if (!(await page.waitFor(`${ready} !== null`, 10_000))) return false;
  await page.waitFor("document.fonts.status === 'loaded'", 8000);
  const deadline = Date.now() + 6000;
  let last = -1;
  for (;;) {
    const height = await page.evaluate<number>("document.documentElement.scrollHeight");
    if (height === last) return true;
    last = height;
    if (Date.now() > deadline) return false;
    await new Promise((r) => setTimeout(r, 150));
  }
}

interface Fold {
  h1: { top: number; bottom: number } | null;
  chipsTop: number | null;
  firstCard: { top: number; height: number } | null;
  scrollY: number;
  cards: number;
}

/**
 * Document-relative offsets, the way the PRD measured them: the element's top
 * edge plus the scroll position, so the number does not depend on where the
 * viewport happens to be.
 */
const FOLD = `(() => {
  const doc = (el) => el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
  const h1 = document.querySelector('h1');
  const chips = document.querySelector('[data-class-chips]');
  const card = document.querySelector('a[data-card]');
  return {
    h1: h1 ? { top: doc(h1), bottom: Math.round(h1.getBoundingClientRect().bottom + window.scrollY) } : null,
    chipsTop: doc(chips),
    firstCard: card ? { top: doc(card), height: Math.round(card.getBoundingClientRect().height) } : null,
    scrollY: Math.round(window.scrollY),
    cards: document.querySelectorAll('a[data-card]').length,
  };
})()`;

interface Targets {
  chips: { w: number; h: number }[];
  tiers: { w: number; h: number }[];
  visibleBoxes: number;
  dialogs: number;
}

const TARGETS = `(() => {
  const box = (el) => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; };
  const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  return {
    chips: [...document.querySelectorAll('[data-class-chips] button[data-class]')].map(box),
    tiers: [...document.querySelectorAll('[data-stage-picker] button[data-tier]')].map(box),
    visibleBoxes: [...document.querySelectorAll('input[type="checkbox"]')].filter((b) => visible(b) && !b.closest('[role="dialog"]')).length,
    dialogs: document.querySelectorAll('[role="dialog"]').length,
  };
})()`;

interface Scroller {
  found: boolean;
  which: string;
  scrollWidth: number;
  clientWidth: number;
  overflows: boolean;
  mask: string;
  docScrollWidth: number;
  docClientWidth: number;
}

/**
 * The class chip row as a scroller.
 *
 * `[data-class-chips]` is the row; if the element that actually scrolls is a
 * descendant carrying `overflow-x: auto|scroll`, that one is measured, and its
 * tag is reported so a failure says which box was read. The mask is the
 * 12px edge fade the plan asks for (§7) *only* while the row really overflows —
 * a mask on a row that fits would clip the focus ring for nothing.
 */
const SCROLLER = `(() => {
  const row = document.querySelector('[data-class-chips]');
  if (!row) return { found: false, which: '', scrollWidth: 0, clientWidth: 0, overflows: false, mask: '', docScrollWidth: 0, docClientWidth: 0 };
  const scrolls = (el) => /(auto|scroll)/.test(getComputedStyle(el).overflowX);
  let el = row;
  if (!scrolls(row)) {
    const inner = [...row.querySelectorAll('*')].find(scrolls);
    if (inner) el = inner;
  }
  const cs = getComputedStyle(el);
  const mask = cs.maskImage || cs.webkitMaskImage || 'none';
  return {
    found: true,
    which: el.tagName.toLowerCase() + (el === row ? '[data-class-chips]' : ' inside [data-class-chips]'),
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
    overflows: el.scrollWidth > el.clientWidth + 0.5,
    mask,
    docScrollWidth: document.documentElement.scrollWidth,
    docClientWidth: document.documentElement.clientWidth,
  };
})()`;

async function main(): Promise<void> {
  const site = await startSite();
  const page = await Page.launch();
  const measured: string[] = [];

  try {
    for (const locale of LOCALES as readonly Locale[]) {
      const r = routes(locale);
      const catalogue = site.origin + r.builds();
      const total = getBuilds(locale).length;

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: the catalogue's fold`);
      // ---------------------------------------------------------------------
      for (const width of WIDTHS) {
        await page.setViewport(width, width < 768 ? 844 : 900);
        const where = `${locale} @${width}`;
        if (!(await settle(page, catalogue, READY))) {
          check(`${where}: the catalogue hydrates and settles`, false, "no [data-filters-ready], or the height never stopped moving");
          continue;
        }
        const f = await page.evaluate<Fold>(FOLD);
        check(`${where}: the page has a title, a chip row and a first card to measure`, !!f.h1 && f.chipsTop !== null && !!f.firstCard && f.scrollY === 0, JSON.stringify(f));
        if (!f.h1 || f.chipsTop === null || !f.firstCard) continue;
        check(`${where}: control — every build is on the page, so the first card is the catalogue's`, f.cards === total, `${f.cards} of ${total}`);

        const chipsBelow = f.chipsTop - f.h1.bottom;
        check(`${where}: the class chips start within ${CHIPS_BELOW_TITLE}px of the title (R-FILT-1) — ${chipsBelow}px`, chipsBelow <= CHIPS_BELOW_TITLE, `${chipsBelow}px`);
        if (width === 1280) {
          const gridBelow = f.firstCard.top - f.h1.top;
          check(`${where}: the grid starts within ${GRID_BELOW_TITLE_AT_DESKTOP}px of the title's top (R-FILT-11) — ${gridBelow}px`, gridBelow <= GRID_BELOW_TITLE_AT_DESKTOP, `${gridBelow}px`);
        }
        if (width === 390) {
          check(`${where}: the first card is no taller than ${CARD_HEIGHT_CEILING[locale]}px — 80% of its 315/386 baseline (R-FILT-16) — ${f.firstCard.height}px`, f.firstCard.height <= CARD_HEIGHT_CEILING[locale], `${f.firstCard.height}px`);
        }
        measured.push(`${where}: first card at ${f.firstCard.top}px (title top ${f.h1.top}, bottom ${f.h1.bottom}; chips at ${f.chipsTop}; card ${f.firstCard.height}px tall)`);
        check(`${where}: the first card sits at ${f.firstCard.top}px, under the ceiling of ${REGRESSION_CEILING[width]}`, f.firstCard.top <= REGRESSION_CEILING[width], `${f.firstCard.top}px — see REGRESSION_CEILING`);

        // Targets, controls and the chip rows, at this width.
        const tg = await page.evaluate<Targets>(TARGETS);
        check(`${where}: no checkbox is visible outside an open dialog`, tg.visibleBoxes === 0 && tg.dialogs === 0, `${tg.visibleBoxes} visible, ${tg.dialogs} dialogs`);
        if (TARGET_WIDTHS.includes(width)) {
          const small = [...tg.chips, ...tg.tiers].filter((b) => b.w < PRIMARY_TARGET || b.h < PRIMARY_TARGET);
          check(`${where}: every class chip and stage control is at least ${PRIMARY_TARGET}×${PRIMARY_TARGET} (${tg.chips.length} chips, ${tg.tiers.length} tiers)`, tg.chips.length > 0 && tg.tiers.length > 0 && small.length === 0, small.map((b) => `${b.w}x${b.h}`).join(", "));
        }
        const sc = await page.evaluate<Scroller>(SCROLLER);
        check(`${where}: the chip row is on the page`, sc.found);
        if (sc.found) {
          check(`${where}: the document itself does not scroll sideways`, sc.docScrollWidth <= sc.docClientWidth, `${sc.docScrollWidth} > ${sc.docClientWidth}`);
          if (NARROW.includes(width)) {
            check(`${where}: the chip row scrolls horizontally instead (${sc.which}: ${sc.scrollWidth} in ${sc.clientWidth})`, sc.overflows, `${sc.scrollWidth} vs ${sc.clientWidth}`);
          }
          if (width === 1280) {
            check(`${where}: at a laptop width the row fits`, !sc.overflows, `${sc.scrollWidth} vs ${sc.clientWidth}`);
          }
          check(
            `${where}: the edge fade is on exactly when the row overflows (overflows ${sc.overflows}, mask ${sc.mask === "none" ? "none" : "set"})`,
            sc.overflows === (sc.mask !== "none"),
            `mask-image: ${sc.mask.slice(0, 60)}`,
          );
        }
      }

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: the class page's fold`);
      // ---------------------------------------------------------------------
      /*
       * `/classes/sorceress`, the page the PRD and the plan both measured, and
       * every width: R-FILT-15 names no width, and the plan's table (§3) shows
       * the baseline furthest from the target at 1280 in pt-BR (476px), not on
       * a phone. The first *build* card, not the first cell — the leading cell
       * is the levelling card, which is not a build and is not `[data-card]`.
       */
      const cls = getClasses(locale).find((c) => c.slug === "sorceress") ?? getClasses(locale)[0];
      const classUrl = site.origin + r.class(cls.slug as Slug);
      for (const width of WIDTHS) {
        await page.setViewport(width, width < 768 ? 844 : 900);
        const where = `${locale} /classes/${cls.slug} @${width}`;
        if (!(await settle(page, classUrl, `document.querySelector('#builds [data-filters][data-filters-ready]')`))) {
          check(`${where}: the class listing hydrates and settles`, false, "no #builds [data-filters-ready], or the height never stopped moving");
          continue;
        }
        const m = await page.evaluate<{ heading: number | null; card: number | null; leadingIsBuild: boolean | null; chips: number }>(`(() => {
          const doc = (el) => el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
          const section = document.querySelector('#builds');
          const heading = section ? section.querySelector('h2') : null;
          const card = section ? section.querySelector('a[data-card]') : null;
          const li = section ? section.querySelector('ul > li') : null;
          return {
            heading: doc(heading),
            card: doc(card),
            leadingIsBuild: li ? !!li.querySelector('a[data-card]') : null,
            chips: section ? section.querySelectorAll('[data-class-chips]').length : -1,
          };
        })()`);
        check(`${where}: #builds has a heading and a first build card`, m.heading !== null && m.card !== null, JSON.stringify(m));
        if (m.heading === null || m.card === null) continue;
        const below = m.card - m.heading;
        check(`${where}: the first build card is within ${CLASS_CARD_BELOW_HEADING}px of "Start here" (R-FILT-15) — ${below}px`, below <= CLASS_CARD_BELOW_HEADING, `${below}px`);
        check(`${where}: the leading levelling card is not counted as a build card`, m.leadingIsBuild === false, String(m.leadingIsBuild));
        check(`${where}: the class page offers no class chips`, m.chips === 0, `${m.chips}`);
        measured.push(`${where}: first build card ${below}px below the heading`);
      }
    }
  } finally {
    page.close();
    site.stop();
  }

  console.log("\nmeasured — the numbers REGRESSION_CEILING is replaced from:");
  for (const line of measured) console.log(`  ${line}`);

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
