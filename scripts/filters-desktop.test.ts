/**
 * The redesigned build filters, driven in a real browser at desktop widths.
 *
 * Phase 3 replaced a form of twenty-eight checkboxes above the first card with
 * two controls that are always visible — eight class chips and the "where are
 * you" stage picker — and put the four advanced groups behind a non-modal
 * popover. Almost none of that contract is a fact about markup, which is why
 * `build-filters-html.test.ts` cannot hold it and this file has to:
 *
 *   - **A count is conditional.** A chip or an option says how many builds it
 *     would show *given the other groups' selections*, with its own group
 *     ignored, so no enabled control can lead to zero (R-FILT-4). Whether the
 *     number on the page is that number, and whether a zero really is
 *     `disabled` with a visible `0`, exists only after hydration, in the DOM.
 *   - **The stage picker writes a preference and nothing else.** It records
 *     `d2rc.tier`, decorates every card with a stage line and enables one sort
 *     option. It must not touch the URL, the history, the results or a single
 *     count — a preference that filtered would be a second, silent filter the
 *     URL does not carry (R-FILT-2, R-FILT-10). That is the mutation the plan
 *     names M2, and it is invisible to every pure test.
 *   - **Every decision is one history entry.** A chip, a popover tick, a sort
 *     change, an applied chip's ✕: one `pushState` each, so Back undoes one
 *     decision and Forward redoes it, with the controls and the list following
 *     the URL rather than a memo of the first render (M5).
 *   - **The empty state is reachable only by URL**, and offers a way out that
 *     works: the group that zeroed it, up to three near builds of the same
 *     class, and — only after a decision made in this session — the last one.
 *
 * Every expected count, order and name here comes from the catalogue itself
 * through `getBuilds`, `buildRows` and `filterBuilds`, plus a small oracle for
 * the conditional counts and the five sort orders, written against the plan's
 * own definitions (Phase 3 plan §4.5, §5.1, §5.2). Nothing is typed in by
 * hand, so a new build moves the expectations without editing this file.
 *
 * Requires `npm run build`. Run with `npm run test:filters-desktop`.
 */
import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { getBuilds, getBuildsForClass, getClasses, resolveRef } from "../lib/registry";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor, fmt } from "../lib/i18n";
import { routes } from "../lib/routes";
import { buildRows } from "../lib/builds/rows";
import {
  EMPTY_FILTER_STATE,
  RATING_AXES,
  filterBuilds,
  narrowingOptionsFor,
  type BuildRow,
} from "../lib/builds/filter";
import { TIER_KEY } from "../lib/prefs";
import { BUDGET_LEVELS, DIFFICULTY_RATINGS, ELEMENTS, PROGRESSION_TIERS } from "../lib/types/core";
import type { ProgressionTier, Slug } from "../lib/types";

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
 * A laptop, and the tablet width where the popover has the least room. Both
 * are above `sm` (640px), so the trigger opens the popover on both; the sheet
 * below it is `mobile-filter-sheet.test.ts`'s.
 */
const DESKTOP = 1280;
const TABLET = 768;
/** R-A11Y-4: a primary control is 44px on both axes; a row is 24. */
const PRIMARY_TARGET = 44;
const ROW_TARGET = 24;

const json = (v: unknown) => JSON.stringify(v);
const t = (locale: Locale) => dictionaryFor(locale).builds.filters;

// ---------------------------------------------------------------------------
// The oracle: what the page must show, derived from the data it renders
// ---------------------------------------------------------------------------

/** The groups the popover carries, in the order the plan lists them (§5.1). */
const ADVANCED = ["damage", "difficulty", "budget", "goodAt"] as const;
type Group = "class" | (typeof ADVANCED)[number];
/** A partial selection. Spread over `EMPTY_FILTER_STATE` so its shape stays the model's. */
type Over = Partial<Record<Group, string[]>>;

/** The canonical order of each group's options — the same constants the page orders by. */
const ORDER: Record<(typeof ADVANCED)[number], readonly string[]> = {
  damage: ELEMENTS,
  difficulty: DIFFICULTY_RATINGS,
  budget: BUDGET_LEVELS,
  goodAt: RATING_AXES,
};

const SORT_KEYS = ["recommended", "stage", "easiest", "cheapest", "name"] as const;
type SortKey = (typeof SORT_KEYS)[number];

const rowsFor = (locale: Locale, classSlug?: string): BuildRow[] =>
  buildRows(locale, classSlug ? getBuildsForClass(locale, classSlug as Slug) : getBuilds(locale));

/** The rows a selection shows, in catalogue order — the same pure rule the page uses. */
const matching = (rows: readonly BuildRow[], over: Over): BuildRow[] =>
  filterBuilds(rows, { ...EMPTY_FILTER_STATE, ...over });

/**
 * The conditional count of `value` in `group`: rows that satisfy every *other*
 * group's selection and carry the value. AND between groups, OR inside one,
 * the group's own selection ignored — R-FILT-4 as the plan states it. Written
 * as a filter with the group set to the single value, which is that definition
 * exactly, rather than as a reimplementation of `facetCounts`.
 */
const facet = (rows: readonly BuildRow[], over: Over, group: Group, value: string): number => {
  const o: Over = { ...over };
  o[group] = [value];
  return matching(rows, o).length;
};

/** The options a group offers on this listing: the model's inventory minus the inert ones. */
const offered = (rows: readonly BuildRow[], group: (typeof ADVANCED)[number]): string[] =>
  narrowingOptionsFor(rows, group, ORDER[group]).map((o) => o.value);

/**
 * The five orders, from the plan's definitions (§4.5): "recommended" is the
 * catalogue's own order; "stage" without a preference is the same; the three
 * ranked orders are stable, so ties keep the incoming order.
 */
function sortedSlugs(locale: Locale, rows: readonly BuildRow[], over: Over, sort: SortKey, tier: ProgressionTier | null): string[] {
  const shown = matching(rows, over).map((r) => r.slug);
  const builds = new Map(getBuilds(locale).map((b) => [b.slug, b]));
  const of = (slug: string) => {
    const b = builds.get(slug);
    if (!b) throw new Error(`no build "${slug}" in ${locale}`);
    return {
      d: DIFFICULTY_RATINGS.indexOf(b.difficulty),
      b: BUDGET_LEVELS.indexOf(b.budget),
      ssf: b.ratings.soloSelfFound,
      clear: b.ratings.clearSpeed,
      name: b.name,
    };
  };
  const collator = new Intl.Collator(locale, { sensitivity: "base" });
  let cmp: ((a: string, b: string) => number) | null = null;
  if (sort === "easiest") cmp = (a, b) => of(a).d - of(b).d;
  else if (sort === "cheapest") cmp = (a, b) => of(a).b - of(b).b;
  else if (sort === "name") cmp = (a, b) => collator.compare(of(a).name, of(b).name);
  else if (sort === "stage" && tier) {
    if (tier === "starter" || tier === "nightmare" || tier === "early-hell") {
      cmp = (a, b) => of(a).d - of(b).d || of(a).b - of(b).b;
    } else if (tier === "budget") cmp = (a, b) => of(b).ssf - of(a).ssf;
    else cmp = (a, b) => of(b).clear - of(a).clear;
  }
  if (!cmp) return shown;
  const ranked = cmp;
  return shown
    .map((slug, i) => ({ slug, i }))
    .sort((x, y) => ranked(x.slug, y.slug) || x.i - y.i)
    .map((x) => x.slug);
}

/** The names a card's stage line must carry: the first pick of the tier's first three slots. */
function stageNames(locale: Locale, slug: string, tier: ProgressionTier): string[] {
  const build = getBuilds(locale).find((b) => b.slug === slug);
  const set = build?.gearSets.find((g) => g.tier === tier);
  if (!set) return [];
  return set.slots
    .slice(0, 3)
    .map((s) => s.picks[0])
    .map((p) => (p.ref ? resolveRef(locale, p.ref).name : (p.label ?? "")))
    .filter((n) => n.length > 0);
}

/** The first class with no build of some damage type — the empty state, from the data. */
function emptyPair(locale: Locale): { classSlug: string; damage: string } {
  const rows = rowsFor(locale);
  for (const c of getClasses(locale)) {
    for (const d of ELEMENTS) {
      if (matching(rows, { class: [c.slug], damage: [d] }).length === 0) return { classSlug: c.slug, damage: d };
    }
  }
  throw new Error(`${locale}: every class has every damage type, so there is no empty state to reach`);
}

/**
 * A class with a damage type it has one build of, and one it has none of.
 *
 * Reached by URL, `?class=<c>&damage=<zero>,<one>` shows one build while the
 * zero value stays *checked* — the one case where a checked option has a count
 * of 0 — and unticking the contributing value must, by decision 2 of the plan,
 * take the inert sibling with it.
 */
function contributingPair(locale: Locale): { classSlug: string; zero: string; one: string } | null {
  const rows = rowsFor(locale);
  for (const c of getClasses(locale)) {
    const counts = ELEMENTS.map((d) => ({ d, n: matching(rows, { class: [c.slug], damage: [d] }).length }));
    const zero = counts.find((x) => x.n === 0);
    const one = counts.find((x) => x.n === 1);
    if (zero && one) return { classSlug: c.slug, zero: zero.d, one: one.d };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Page-side locators and probes. Roles, data attributes and accessible names —
// never position, never a class name.
// ---------------------------------------------------------------------------

const READY = `document.querySelector('[data-filters][data-filters-ready]')`;
const CHIP = (slug: string) => `document.querySelector('[data-class-chips] button[data-class=${json(slug)}]')`;
const TIER = (tier: string) => `document.querySelector('[data-stage-picker] button[data-tier=${json(tier)}]')`;
const CLEAR_TIER = `document.querySelector('[data-filters] button[data-clear-tier], #builds button[data-clear-tier]')`;
const MORE = `document.querySelector('button[data-more-filters]')`;
const POPOVER = `document.querySelector('[role="dialog"][data-popover]')`;
const SHEET = `document.querySelector('[role="dialog"][aria-modal="true"]')`;
const OPTION = (group: string, value: string) =>
  `(${POPOVER} ? ${POPOVER}.querySelector('input[type="checkbox"][data-group=${json(group)}][data-value=${json(value)}]') : null)`;
const SORT = `document.querySelector('select[data-sort]')`;
const SORT_HELP = `document.querySelector('button[data-sort-help]')`;
const APPLIED = (group: string, value: string) =>
  `document.querySelector('[data-applied] button[data-group=${json(group)}][data-value=${json(value)}]')`;
const CLEAR_ALL = `document.querySelector('button[data-clear-all]')`;
const REMOVE_GROUP = (group: string) => `document.querySelector('[data-empty] button[data-remove-group][data-group=${json(group)}]')`;
const REMOVE_LAST = `document.querySelector('button[data-remove-last]')`;

/** Shared helpers, inlined into every probe so each is one round trip. */
const HELPERS = `
  const countOf = (el) => {
    const c = el ? el.querySelector('[data-count]') : null;
    if (!c) return null;
    const m = (c.textContent || '').match(/[0-9]+/);
    return m ? Number(m[0]) : null;
  };
  const visible = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const box = (el) => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; };
  const params = () => { const o = {}; for (const [k, v] of new URLSearchParams(location.search)) o[k] = v; return o; };
`;

interface Chip {
  slug: string;
  pressed: string | null;
  disabled: boolean;
  count: number | null;
  countText: string | null;
  w: number;
  h: number;
}
interface Card {
  href: string;
  slug: string;
  cls: string;
  axes: number;
  stage: string | null;
  stageLines: number;
}
interface Snapshot {
  url: string;
  params: Record<string, string>;
  history: number;
  ready: boolean;
  search: number;
  visibleBoxes: number;
  chipsRow: boolean;
  chipLinks: number;
  chips: Chip[];
  picker: boolean;
  tiers: { tier: string; pressed: string | null; w: number; h: number }[];
  clearTier: boolean;
  legend: string;
  more: { present: boolean; expanded: string | null; controls: string | null; badge: string | null; visible: boolean };
  popover: boolean;
  sheet: boolean;
  sort: { present: boolean; value: string; options: { value: string; disabled: boolean }[] };
  help: { present: boolean; expanded: string | null; noteVisible: boolean };
  results: string;
  cards: Card[];
  applied: string[];
  clearAll: boolean;
  empty: boolean;
  emptyText: string;
  removeGroup: string[];
  removeLast: boolean;
  near: string[];
  counts: string[];
  storage: string[];
  tier: string | null;
  focus: string;
  bodyOverflow: string;
  scrollBehavior: string;
}

/**
 * The whole listing, read in one round trip.
 *
 * `scope` is `document` on the catalogue and the `#builds` section on a class
 * page, so the same probe measures both without ever picking up the class
 * page's other sections.
 */
const SNAPSHOT = (scope = "document") => `(() => {
  ${HELPERS}
  const root = ${scope};
  if (!root) return null;
  const more = ${MORE};
  const popover = ${POPOVER};
  const active = document.activeElement;
  const sort = ${SORT};
  const help = ${SORT_HELP};
  const legend = document.getElementById('stage-legend');
  const results = root.querySelector('[data-results][aria-live="polite"]');
  const cards = [...root.querySelectorAll('a[data-card][href]')].map((a) => {
    const href = a.getAttribute('href') || '';
    const parts = href.split('/').filter(Boolean);
    const line = a.querySelector('[data-stage-line]');
    return {
      href,
      slug: parts[parts.length - 1] || '',
      cls: parts[parts.length - 2] || '',
      axes: a.querySelectorAll('[data-rating-axis]').length,
      stage: line ? (line.textContent || '').replace(/[ \\t\\r\\n]+/g, ' ').trim() : null,
      stageLines: a.querySelectorAll('[data-stage-line]').length,
    };
  });
  let focus = 'none';
  if (active === more) focus = 'more';
  else if (popover && popover.contains(active)) focus = 'in-popover';
  else if (active && active.matches('[data-class-chips] button[data-class]')) focus = 'chip:' + active.dataset.class;
  else if (active) focus = active.tagName.toLowerCase();
  return {
    url: location.search,
    params: params(),
    history: history.length,
    ready: !!root.querySelector('[data-filters][data-filters-ready]'),
    search: document.querySelectorAll('input[type="search"]').length,
    visibleBoxes: [...document.querySelectorAll('input[type="checkbox"]')].filter((b) => visible(b) && !b.closest('[role="dialog"]')).length,
    chipsRow: !!root.querySelector('[data-class-chips]'),
    chipLinks: root.querySelectorAll('[data-class-chips] a[data-class]').length,
    chips: [...root.querySelectorAll('[data-class-chips] button[data-class]')].map((b) => ({
      slug: b.dataset.class,
      pressed: b.getAttribute('aria-pressed'),
      disabled: b.disabled,
      count: countOf(b),
      countText: b.querySelector('[data-count]') ? (b.querySelector('[data-count]').textContent || '').trim() : null,
      ...box(b),
    })),
    picker: !!root.querySelector('[data-stage-picker]'),
    tiers: [...root.querySelectorAll('[data-stage-picker] button[data-tier]')].map((b) => ({
      tier: b.dataset.tier, pressed: b.getAttribute('aria-pressed'), ...box(b),
    })),
    clearTier: !!root.querySelector('button[data-clear-tier]'),
    legend: legend ? (legend.textContent || '').replace(/[ \\t\\r\\n]+/g, ' ').trim() : '',
    more: {
      present: !!more,
      expanded: more ? more.getAttribute('aria-expanded') : null,
      controls: more ? more.getAttribute('aria-controls') : null,
      badge: more && more.querySelector('[data-badge]') ? (more.querySelector('[data-badge]').textContent || '').trim() : null,
      visible: visible(more),
    },
    popover: !!popover,
    sheet: !!${SHEET},
    sort: {
      present: !!sort,
      value: sort ? sort.value : '',
      options: sort ? [...sort.options].map((o) => ({ value: o.value, disabled: o.disabled })) : [],
    },
    help: {
      present: !!help,
      expanded: help ? help.getAttribute('aria-expanded') : null,
      noteVisible: visible(document.querySelector('[data-sort-note]')),
    },
    results: results ? (results.textContent || '').replace(/[ \\t\\r\\n]+/g, ' ').trim() : '',
    cards,
    applied: [...root.querySelectorAll('[data-applied] button[data-group][data-value]')].map((b) => b.dataset.group + '=' + b.dataset.value),
    clearAll: !!root.querySelector('button[data-clear-all]'),
    empty: !!root.querySelector('[data-empty]'),
    emptyText: root.querySelector('[data-empty]') ? (root.querySelector('[data-empty]').textContent || '').replace(/[ \\t\\r\\n]+/g, ' ').trim() : '',
    removeGroup: [...root.querySelectorAll('[data-empty] button[data-remove-group]')].map((b) => b.dataset.group || ''),
    removeLast: !!root.querySelector('button[data-remove-last]'),
    near: [...root.querySelectorAll('[data-near] a[href]')].map((a) => a.getAttribute('href') || ''),
    counts: [...root.querySelectorAll('[data-count]')].map((c) => (c.textContent || '').trim()),
    storage: (() => { try { return Object.keys(localStorage).sort(); } catch { return ['<blocked>']; } })(),
    tier: (() => { try { return localStorage.getItem(${json(TIER_KEY)}); } catch { return '<blocked>'; } })(),
    focus,
    bodyOverflow: getComputedStyle(document.body).overflow,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
  };
})()`;

interface Option {
  group: string;
  value: string;
  checked: boolean;
  disabled: boolean;
  count: number | null;
  countText: string | null;
  inLabel: boolean;
  rowH: number;
  rowW: number;
}
interface PopoverState {
  modal: string | null;
  labelled: boolean;
  focusInside: boolean;
  groups: { group: string; open: boolean }[];
  options: Option[];
  left: number;
  right: number;
  motion: string;
}

/** The open popover: its groups, every option with its count, and where it sits. */
const POPOVER_STATE = `(() => {
  ${HELPERS}
  const p = ${POPOVER};
  if (!p) return null;
  const r = p.getBoundingClientRect();
  const cs = getComputedStyle(p);
  return {
    modal: p.getAttribute('aria-modal'),
    labelled: !!(p.getAttribute('aria-label') || p.getAttribute('aria-labelledby')),
    focusInside: p.contains(document.activeElement),
    groups: [...p.querySelectorAll('details[data-group]')].map((d) => ({ group: d.dataset.group, open: d.open })),
    options: [...p.querySelectorAll('input[type="checkbox"][data-group][data-value]')].map((i) => {
      const label = i.closest('label');
      const row = label || i;
      const count = row.querySelector('[data-count]');
      return {
        group: i.dataset.group,
        value: i.dataset.value,
        checked: i.checked,
        disabled: i.disabled,
        count: countOf(row),
        countText: count ? (count.textContent || '').trim() : null,
        inLabel: !!label,
        rowH: Math.round(row.getBoundingClientRect().height),
        rowW: Math.round(row.getBoundingClientRect().width),
      };
    }),
    left: Math.round(r.left),
    right: Math.round(r.right),
    motion: cs.animationName + ' / ' + cs.transitionDuration,
  };
})()`;

const snapshot = (page: Page, scope?: string) => page.evaluate<Snapshot | null>(SNAPSHOT(scope));
const popoverState = (page: Page) => page.evaluate<PopoverState | null>(POPOVER_STATE);

/** `el.click()` on whatever `expr` resolves to. False when it resolves to nothing. */
const clickThat = (page: Page, expr: string) =>
  page.evaluate<boolean>(`(() => { const el = ${expr}; if (!el) return false; el.click(); return true; })()`);

/**
 * A real mouse press at the element's centre, after bringing it into view.
 *
 * Two round trips on purpose: the site scrolls smoothly, so a rectangle read in
 * the same expression as the scroll is where the element *was*. `instant`
 * sidesteps the animation and the second read is the settled position.
 */
async function tap(page: Page, expr: string): Promise<boolean> {
  await page.evaluate(`(() => { const el = ${expr}; if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' }); return 1; })()`);
  const spot = await page.evaluate<{ x: number; y: number } | null>(`(() => {
    const el = ${expr};
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return null;
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const hit = document.elementFromPoint(x, y);
    if (!hit || (hit !== el && !el.contains(hit))) return null;
    return { x, y };
  })()`);
  if (!spot) return false;
  await page.click(spot.x, spot.y);
  return true;
}

/** Selects a sort key the way a change event delivers it, and reports whether the option exists. */
const chooseSort = (page: Page, key: string) =>
  page.evaluate<boolean>(`(() => {
    const s = ${SORT};
    if (!s || ![...s.options].some((o) => o.value === ${json(key)})) return false;
    s.value = ${json(key)};
    s.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);

/**
 * Storage, set *before* the next document boots.
 *
 * Every page here is same-origin, so writing to the document that is currently
 * open is writing to what the next `goto` will read. The first call of a run
 * lands on `about:blank`, where the access throws; the try is for that.
 */
const prepareStorage = (page: Page, tier: string | null) =>
  page.evaluate(
    `(() => { try { localStorage.clear(); ${tier ? `localStorage.setItem(${json(TIER_KEY)}, ${json(tier)});` : ""} } catch {} return 1; })()`,
  );

/**
 * Navigates by replacing the current entry rather than adding one.
 *
 * Chrome keeps at most fifty entries of session history per tab, and every
 * `Page.navigate` adds one. This file makes some fifty navigations and
 * decisions per locale, and "one decision is one entry" is asserted by
 * comparing `history.length` before and after — which stops being true the
 * moment the cap is reached, quietly, at whatever assertion happens to be
 * running. Replacing keeps the history to the decisions the page itself makes.
 * The stamp is how the poll tells the new document from the old one, since the
 * two can share a URL; the try is for the moment between them, when there is
 * no execution context to ask.
 */
async function navigate(page: Page, url: string): Promise<boolean> {
  const current = await page.evaluate<string>("location.href");
  if (!current.startsWith("http")) {
    await page.goto(url);
    return true;
  }
  await page.evaluate(`(() => { window.__gateStamp = true; location.replace(${json(url)}); return 1; })()`);
  const deadline = Date.now() + 15_000;
  for (;;) {
    try {
      if (await page.evaluate<boolean>(`!window.__gateStamp && document.readyState !== 'loading'`)) return true;
    } catch {
      // The old context is gone and the new one is not up yet.
    }
    if (Date.now() > deadline) return false;
    await new Promise((r) => setTimeout(r, 80));
  }
}

/**
 * Storage as asked, then the page, then the hydration marker — and then the
 * counts, which may land a render after the marker does. Not asserted here:
 * a chip that never gets a count fails the count assertion by name, with the
 * text it had, rather than a wait.
 */
async function load(page: Page, url: string, tier: string | null = null, ready = READY): Promise<boolean> {
  await prepareStorage(page, tier);
  if (!(await navigate(page, url))) return false;
  if (!(await page.waitFor(`${ready} !== null`, 10_000))) return false;
  await page.waitFor(
    `(() => { const chips = document.querySelectorAll('[data-class-chips] button[data-class]');
       return chips.length === 0 || document.querySelectorAll('[data-class-chips] button[data-class] [data-count]').length === chips.length; })()`,
    4000,
  );
  return true;
}

/** The cards, once the list has caught up with the URL. */
const cardsAre = (page: Page, n: number) =>
  page.waitFor(`document.querySelectorAll('a[data-card]').length === ${n}`, 4000);

/** Opens the popover through its trigger and waits for the dialog. */
async function openPopover(page: Page, how: "click" | "enter" = "click"): Promise<boolean> {
  if (how === "click") {
    if (!(await clickThat(page, MORE))) return false;
  } else {
    await page.evaluate(`(() => { const b = ${MORE}; if (b) b.focus(); return 1; })()`);
    await page.press("Enter", "Enter", 13, "\r");
  }
  if (!(await page.waitFor(`${POPOVER} !== null`, 4000))) return false;
  // The groups' rows, and their counts, once the dialog has rendered them.
  await page.waitFor(`${POPOVER}.querySelectorAll('input[type="checkbox"][data-group][data-value]').length > 0`, 4000);
  return true;
}

/** Waits until the URL carries exactly these parameters (decoded, order-insensitive). */
const urlIs = (page: Page, expected: Record<string, string>) =>
  page.waitFor(
    `(() => { const o = {}; for (const [k, v] of new URLSearchParams(location.search)) o[k] = v;
       return JSON.stringify(Object.entries(o).sort()) === ${json(JSON.stringify(Object.entries(expected).sort()))}; })()`,
    4000,
  );

const sameSet = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && [...a].sort().join(",") === [...b].sort().join(",");

// ===========================================================================

async function main(): Promise<void> {
  const site = await startSite();
  const page = await Page.launch();

  try {
    for (const locale of LOCALES as readonly Locale[]) {
      const dict = t(locale);
      const r = routes(locale);
      const catalogue = site.origin + r.builds();
      const rows = rowsFor(locale);
      const total = rows.length;
      const classes = getClasses(locale).map((c) => c.slug);
      const resultsText = (n: number) => fmt(n === 1 ? dict.resultsOne : dict.resultsMany, { count: n });
      const tiers = dictionaryFor(locale).tiers as Record<string, string>;
      const chipCounts = (over: Over, chips: Chip[]) => chips.map((c) => facet(rows, over, "class", c.slug));

      // A class with builds of some damage type but not all, for the "other
      // counts update" and "zero is disabled" assertions. Derived, not named.
      const coldLike = ELEMENTS.map((d) => ({
        d,
        zero: classes.filter((c) => facet(rows, { damage: [d] }, "class", c) === 0),
      })).find((x) => x.zero.length > 0 && x.zero.length < classes.length);
      if (!coldLike) throw new Error(`${locale}: no damage type leaves some class at zero — the data cannot exercise R-FILT-4`);
      const dmg = coldLike.d;
      const dmgTotal = matching(rows, { damage: [dmg] }).length;
      // A class that has builds of `dmg`, for the sections that press a class chip
      // and then tick `dmg`: with `classes[0]` the tick could land on an option the
      // page rightly disables, and a disabled option pushes nothing.
      const withDmg = classes.find((c) => !coldLike.zero.includes(c));
      if (!withDmg) throw new Error(`${locale}: every class is at zero for ${dmg}`);
      const pair = emptyPair(locale);
      const emptyUrl = `${catalogue}?class=${pair.classSlug}&damage=${pair.damage}`;

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: the hydrated listing at ${DESKTOP}px`);
      // ---------------------------------------------------------------------
      await page.setViewport(DESKTOP, 900);
      if (!(await load(page, catalogue))) {
        check(`${locale}: the catalogue hydrates with [data-filters][data-filters-ready]`, false, "the marker never appeared");
        continue;
      }
      page.drainConsole();
      const s0 = (await snapshot(page))!;
      check(`${locale}: the catalogue hydrates with [data-filters][data-filters-ready]`, s0.ready);
      check(`${locale}: there is no inline search box — the global search is the one search (R-FILT-8)`, s0.search === 0, `${s0.search}`);
      check(`${locale}: no checkbox is laid out outside a dialog by default (R-FILT-3)`, s0.visibleBoxes === 0, `${s0.visibleBoxes}`);
      check(`${locale}: the eight class chips are buttons after hydration, and the links are gone`, s0.chips.length === classes.length && s0.chipLinks === 0, `${s0.chips.length} buttons, ${s0.chipLinks} links`);
      check(`${locale}: the chips are the eight classes, each exactly once`, sameSet(s0.chips.map((c) => c.slug), classes), s0.chips.map((c) => c.slug).join(","));
      check(`${locale}: every chip is unpressed and enabled with nothing selected`, s0.chips.every((c) => c.pressed === "false" && !c.disabled), json(s0.chips.map((c) => [c.slug, c.pressed, c.disabled])));
      check(
        `${locale}: every chip's count is the class's own total`,
        s0.chips.every((c) => c.count === facet(rows, {}, "class", c.slug)),
        json(s0.chips.map((c) => `${c.slug}:${c.countText}`)),
      );
      check(`${locale}: every chip is a ${PRIMARY_TARGET}px target on both axes`, s0.chips.every((c) => c.w >= PRIMARY_TARGET && c.h >= PRIMARY_TARGET), json(s0.chips.map((c) => `${c.w}x${c.h}`)));
      check(`${locale}: the stage picker offers the six tiers, none pressed`, s0.picker && s0.tiers.length === 6 && sameSet(s0.tiers.map((x) => x.tier), PROGRESSION_TIERS) && s0.tiers.every((x) => x.pressed === "false"), json(s0.tiers));
      check(`${locale}: …each a ${PRIMARY_TARGET}px target`, s0.tiers.every((x) => x.w >= PRIMARY_TARGET && x.h >= PRIMARY_TARGET), json(s0.tiers.map((x) => `${x.w}x${x.h}`)));
      check(`${locale}: …with a legend and no clear control yet`, s0.legend.length > 0 && !s0.clearTier, json(s0.legend));
      check(`${locale}: the More-filters trigger is collapsed and names what it controls`, s0.more.present && s0.more.expanded === "false" && !!s0.more.controls, json(s0.more));
      check(`${locale}: …and no dialog exists before it is asked for`, !s0.popover && !s0.sheet);
      check(
        `${locale}: the sort control offers the five keys in the plan's order, recommended selected`,
        s0.sort.present && s0.sort.value === "recommended" && s0.sort.options.map((o) => o.value).join(",") === SORT_KEYS.join(","),
        json(s0.sort),
      );
      check(`${locale}: "for my stage" is disabled without a preference`, s0.sort.options.some((o) => o.value === "stage" && o.disabled), json(s0.sort.options));
      check(`${locale}: the sort help is a collapsed disclosure`, s0.help.present && s0.help.expanded === "false" && !s0.help.noteVisible, json(s0.help));
      check(`${locale}: the results counter is live and counts the whole catalogue`, s0.results === resultsText(total), json(s0.results));
      check(`${locale}: every build is a card, in catalogue order`, s0.cards.map((c) => c.slug).join(",") === rows.map((x) => x.slug).join(","), `${s0.cards.length} cards`);
      check(`${locale}: each card shows two rating axes and no stage line`, s0.cards.every((c) => c.axes === 2 && c.stageLines === 0), json(s0.cards.slice(0, 3).map((c) => [c.axes, c.stageLines])));
      check(`${locale}: nothing is applied, nothing is empty`, s0.applied.length === 0 && !s0.clearAll && !s0.empty && !s0.removeLast);
      check(`${locale}: loading the listing wrote nothing to storage`, s0.storage.length === 0, s0.storage.join(","));

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: one chip is one decision`);
      // ---------------------------------------------------------------------
      {
        const first = classes[0];
        const before = (await snapshot(page))!;
        check(`${locale}: the ${first} chip is on screen to press`, await tap(page, CHIP(first)));
        check(`${locale}: pressing it writes ?class=${first}`, await urlIs(page, { class: first }));
        const shown = matching(rows, { class: [first] });
        await page.waitFor(`${CHIP(first)}?.getAttribute('aria-pressed') === 'true'`, 4000);
        await cardsAre(page, shown.length);
        const after = (await snapshot(page))!;
        check(`${locale}: …the chip reports itself pressed`, after.chips.find((c) => c.slug === first)?.pressed === "true");
        check(`${locale}: …in exactly one history entry`, after.history === before.history + 1, `${before.history} → ${after.history}`);
        check(`${locale}: …the list is that class's builds, in catalogue order`, after.cards.map((c) => c.slug).join(",") === shown.map((x) => x.slug).join(","), `${after.cards.length} of ${shown.length}`);
        check(`${locale}: …the counter follows`, after.results === resultsText(shown.length), json(after.results));
        check(`${locale}: …the applied row shows the one chip and no Clear all (fewer than two active)`, after.applied.join() === `class=${first}` && !after.clearAll, json(after.applied));
        /*
         * The class group's own selection is ignored by every class count, so
         * selecting one class leaves the eight chips exactly where they were.
         * That is the definition, not an accident, and it is the control for
         * the "other counts update" assertion below: the numbers that must not
         * move here are the ones that must move there.
         */
        check(`${locale}: …and no class count moves — a group ignores its own selection`, after.chips.map((c) => c.count).join() === before.chips.map((c) => c.count).join(), json(after.chips.map((c) => c.countText)));
        check(`${locale}: …nothing was written to storage`, after.storage.length === 0, after.storage.join(","));
      }

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: multi-select, in canonical URL order`);
      // ---------------------------------------------------------------------
      {
        const [a, b] = [classes[0], classes[1]];
        // From ?class=a (the page is there already), add b.
        const pre = (await snapshot(page))!;
        const shown = matching(rows, { class: [a, b] });
        /** The class parameter carries exactly these slugs, whatever their order. */
        const classIs = (slugs: string[]) =>
          page.waitFor(
            `(new URLSearchParams(location.search).get('class') || '').split(',').sort().join() === ${json([...slugs].sort().join())}`,
            4000,
          );
        await clickThat(page, CHIP(b));
        check(`${locale}: a second chip joins the first in the URL`, await classIs([a, b]));
        await cardsAre(page, shown.length);
        const both = (await snapshot(page))!;
        check(`${locale}: …OR inside the group: both classes are listed`, both.cards.map((c) => c.slug).join(",") === shown.map((x) => x.slug).join(","), `${both.cards.length} of ${shown.length}`);
        check(`${locale}: …one more history entry`, both.history === pre.history + 1, `${pre.history} → ${both.history}`);
        check(`${locale}: …two active, so Clear all appears`, both.applied.length === 2 && both.clearAll, json(both.applied));
        const urlAB = both.url;

        /*
         * The same two, chosen the other way round, must serialise identically:
         * a shared link is the same link whichever chip was pressed first. The
         * order inside the parameter is the model's canonical one and is not
         * asserted here beyond that — `build-filters.test.ts` owns the parser.
         */
        await load(page, catalogue);
        await clickThat(page, CHIP(b));
        await classIs([b]);
        await clickThat(page, CHIP(a));
        check(`${locale}: …the reverse order reaches the same selection`, await classIs([a, b]));
        const urlBA = await page.evaluate<string>("location.search");
        check(`${locale}: the URL is canonical — the same selection serialises the same whichever chip came first`, urlBA === urlAB, `${urlAB} vs ${urlBA}`);

        // Deselecting one leaves the other.
        await clickThat(page, CHIP(a));
        check(`${locale}: pressing a pressed chip removes it`, await urlIs(page, { class: b }));
        check(`${locale}: …and it reports itself unpressed`, await page.waitFor(`${CHIP(a)}?.getAttribute('aria-pressed') === 'false'`, 4000));
      }

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: a chip that would show nothing is disabled, and says 0`);
      // ---------------------------------------------------------------------
      if (await load(page, `${catalogue}?damage=${dmg}`)) {
        const s = (await snapshot(page))!;
        const want = chipCounts({ damage: [dmg] }, s.chips);
        check(`${locale}: with ?damage=${dmg} every chip carries its conditional count`, s.chips.map((c) => c.count).join() === want.join(), json(s.chips.map((c) => `${c.slug}:${c.countText}`)) + ` want ${want.join(",")}`);
        const zeros = s.chips.filter((c) => c.count === 0);
        check(`${locale}: the data leaves ${coldLike.zero.length} classes at zero, and the page shows them`, sameSet(zeros.map((c) => c.slug), coldLike.zero), zeros.map((c) => c.slug).join(","));
        check(`${locale}: every zero chip is disabled, unpressed, and still shows a visible 0`, zeros.length > 0 && zeros.every((c) => c.disabled && c.pressed === "false" && c.countText !== null && /(^|[^0-9])0([^0-9]|$)/.test(c.countText)), json(zeros.map((c) => [c.slug, c.disabled, c.countText])));
        check(`${locale}: control — every chip with builds left is enabled`, s.chips.filter((c) => (c.count ?? 0) > 0).every((c) => !c.disabled));
        check(`${locale}: the results are the ${dmg} builds`, s.results === resultsText(dmgTotal) && s.cards.length === dmgTotal, json(s.results));
        check(`${locale}: the badge counts the one advanced filter`, s.more.badge === "1", json(s.more.badge));
        // A disabled chip must be inert: no URL, no history, nothing.
        const zero = zeros[0];
        if (zero) {
          await clickThat(page, CHIP(zero.slug));
          await page.evaluate("new Promise((r) => setTimeout(() => r(1), 200))");
          const after = (await snapshot(page))!;
          check(`${locale}: pressing the disabled ${zero.slug} chip changes nothing`, after.url === s.url && after.history === s.history && after.cards.length === s.cards.length, `${s.url} → ${after.url}`);
        }
      } else check(`${locale}: ?damage=${dmg} hydrates`, false);

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: the popover — non-modal, focus managed, live`);
      // ---------------------------------------------------------------------
      if (await load(page, catalogue)) {
        const before = (await snapshot(page))!;
        check(`${locale}: the trigger opens the popover`, await openPopover(page));
        const p = await popoverState(page);
        const s = (await snapshot(page))!;
        check(`${locale}: it is a dialog without aria-modal, and the page behind is not locked`, !!p && p.modal === null && s.bodyOverflow !== "hidden", json({ modal: p?.modal, overflow: s.bodyOverflow }));
        check(`${locale}: it has an accessible name`, !!p && p.labelled);
        check(`${locale}: the trigger reports itself expanded`, s.more.expanded === "true", json(s.more));
        check(`${locale}: focus moved inside`, !!p && p.focusInside, s.focus);
        check(`${locale}: it carries the four advanced groups as disclosures, the first one open`, !!p && p.groups.map((g) => g.group).join(",") === ADVANCED.join(",") && p.groups[0]?.open === true && p.groups.slice(1).every((g) => !g.open), json(p?.groups));
        check(`${locale}: …and no class chips or stage picker inside it`, await page.evaluate<boolean>(`${POPOVER} !== null && ${POPOVER}.querySelectorAll('[data-class], [data-stage-picker]').length === 0`));
        for (const group of ADVANCED) {
          const got = (p?.options ?? []).filter((o) => o.group === group).map((o) => o.value);
          check(`${locale}: the ${group} group offers exactly the model's narrowing options`, sameSet(got, offered(rows, group)), `got ${got.join(",")} want ${offered(rows, group).join(",")}`);
        }
        check(`${locale}: every option is a checkbox inside a label, with a count`, !!p && p.options.length > 0 && p.options.every((o) => o.inLabel && o.count !== null), json(p?.options.filter((o) => !o.inLabel || o.count === null).slice(0, 3)));
        check(`${locale}: every count is the conditional one (nothing selected: the inventory)`, !!p && p.options.every((o) => o.count === facet(rows, {}, o.group as Group, o.value)), json(p?.options.filter((o) => o.count !== facet(rows, {}, o.group as Group, o.value)).slice(0, 3)));
        check(`${locale}: nothing is disabled while every option has builds`, !!p && p.options.every((o) => !o.disabled), json(p?.options.filter((o) => o.disabled).map((o) => o.value)));

        // Rows are targets: open every group so each row has a box, then measure.
        await page.evaluate(`(() => { for (const d of ${POPOVER}.querySelectorAll('details[data-group]')) d.open = true; return 1; })()`);
        const rowsOpen = await popoverState(page);
        check(`${locale}: every option row is at least ${ROW_TARGET}px tall`, !!rowsOpen && rowsOpen.options.every((o) => o.rowH >= ROW_TARGET - 0.5), json(rowsOpen?.options.filter((o) => o.rowH < ROW_TARGET - 0.5).map((o) => `${o.value} ${o.rowW}x${o.rowH}`)));
        check(`${locale}: the popover sits inside the viewport horizontally`, !!rowsOpen && rowsOpen.left >= 0 && rowsOpen.right <= DESKTOP, json({ left: rowsOpen?.left, right: rowsOpen?.right }));

        // Live: one tick, one entry, the popover stays.
        await clickThat(page, OPTION("damage", dmg));
        check(`${locale}: a tick writes the URL immediately`, await urlIs(page, { damage: dmg }));
        await page.waitFor(`document.querySelectorAll('a[data-card]').length === ${dmgTotal}`, 4000);
        const ticked = (await snapshot(page))!;
        const pTicked = await popoverState(page);
        check(`${locale}: …in one history entry`, ticked.history === before.history + 1, `${before.history} → ${ticked.history}`);
        check(`${locale}: …the popover stays open`, ticked.popover && !!pTicked);
        check(`${locale}: …the list and the counter follow at once`, ticked.cards.length === dmgTotal && ticked.results === resultsText(dmgTotal), `${ticked.cards.length}, ${json(ticked.results)}`);
        check(`${locale}: …the badge reads 1`, ticked.more.badge === "1", json(ticked.more.badge));
        check(`${locale}: …the chips' counts move to the conditional ones`, ticked.chips.map((c) => c.count).join() === chipCounts({ damage: [dmg] }, ticked.chips).join(), json(ticked.chips.map((c) => `${c.slug}:${c.countText}`)));
        check(`${locale}: …and the zero chips are disabled`, ticked.chips.filter((c) => c.count === 0).every((c) => c.disabled) && ticked.chips.some((c) => c.count === 0));
        /*
         * Inside the popover the *other* groups' counts move too, and some go
         * to zero: those become disabled with a visible 0, while the ticked
         * group's own siblings keep their unconditional counts (own group
         * ignored). Both halves come from the oracle, not from a named option.
         */
        check(
          `${locale}: …every option's count is now conditional on damage=${dmg}`,
          !!pTicked && pTicked.options.every((o) => o.count === facet(rows, { damage: [dmg] }, o.group as Group, o.value)),
          json(pTicked?.options.filter((o) => o.count !== facet(rows, { damage: [dmg] }, o.group as Group, o.value)).slice(0, 4)),
        );
        const zeroOptions = (pTicked?.options ?? []).filter((o) => o.count === 0);
        check(`${locale}: …the data puts some option at zero, and every one of them is disabled with a visible 0`, zeroOptions.length > 0 && zeroOptions.every((o) => o.disabled && !o.checked && /(^|[^0-9])0([^0-9]|$)/.test(o.countText ?? "")), json(zeroOptions.map((o) => [o.group, o.value, o.disabled, o.countText])));
        check(`${locale}: …and the ticked option is checked and enabled`, !!pTicked && pTicked.options.some((o) => o.group === "damage" && o.value === dmg && o.checked && !o.disabled));

        // A second tick is a second entry; the badge counts two.
        const second = (pTicked?.options ?? []).find((o) => o.group !== "damage" && !o.disabled && (o.count ?? 0) > 0);
        check(`${locale}: another enabled option exists to tick`, !!second, "every other option is disabled");
        if (second) {
          await clickThat(page, OPTION(second.group, second.value));
          check(`${locale}: the second tick joins the first in the URL`, await urlIs(page, { damage: dmg, [second.group]: second.value }));
          const twoCount = facet(rows, { damage: [dmg] }, second.group as Group, second.value);
          await cardsAre(page, twoCount);
          const two = (await snapshot(page))!;
          check(`${locale}: …one more history entry, badge 2, and the count the option promised`, two.history === ticked.history + 1 && two.more.badge === "2" && two.cards.length === twoCount, `${ticked.history} → ${two.history}, badge ${two.more.badge}, ${two.cards.length} vs ${twoCount}`);
          check(`${locale}: …an enabled option never led to zero`, two.cards.length > 0);
        }

        // Escape closes and hands focus back.
        const beforeEscape = (await snapshot(page))!;
        await page.press("Escape", "Escape", 27);
        check(`${locale}: Escape closes the popover`, await page.waitFor(`${POPOVER} === null`, 4000));
        const closed = (await snapshot(page))!;
        check(`${locale}: …and returns focus to the trigger, collapsed`, closed.focus === "more" && closed.more.expanded === "false", json({ focus: closed.focus, expanded: closed.more.expanded }));
        check(
          `${locale}: …leaving the URL, the history and the list as they were — closing is not a decision`,
          closed.url === beforeEscape.url && closed.history === beforeEscape.history && closed.cards.length === beforeEscape.cards.length && closed.cards.length > 0,
          `${beforeEscape.url} → ${closed.url}`,
        );

        // A click outside closes too.
        check(`${locale}: it reopens`, await openPopover(page));
        check(`${locale}: the page heading is a real target outside the popover`, await tap(page, "document.querySelector('h1')"));
        check(`${locale}: a click outside closes it`, await page.waitFor(`${POPOVER} === null`, 4000));
        const outside = (await snapshot(page))!;
        check(`${locale}: …without changing the URL or the history`, outside.url === closed.url && outside.history === closed.history, `${closed.url} → ${outside.url}`);
      } else check(`${locale}: the catalogue hydrates for the popover`, false);

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: the popover at ${TABLET}px`);
      // ---------------------------------------------------------------------
      await page.setViewport(TABLET, 1024);
      if (await load(page, catalogue)) {
        check(`${locale} @${TABLET}: the trigger opens a popover, not the sheet`, (await openPopover(page)) && !(await page.evaluate<boolean>(`${SHEET} !== null`)));
        const p = await popoverState(page);
        check(`${locale} @${TABLET}: it is non-modal and inside the viewport`, !!p && p.modal === null && p.left >= 0 && p.right <= TABLET, json({ modal: p?.modal, left: p?.left, right: p?.right }));
        await page.press("Escape", "Escape", 27);
        check(`${locale} @${TABLET}: Escape closes it`, await page.waitFor(`${POPOVER} === null`, 4000));
      } else check(`${locale} @${TABLET}: the catalogue hydrates`, false);
      await page.setViewport(DESKTOP, 900);

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: the stage picker writes a preference and nothing else (M2)`);
      // ---------------------------------------------------------------------
      if (await load(page, catalogue)) {
        // Every count on the page, chips and popover alike, before the press.
        await openPopover(page);
        const popBefore = await popoverState(page);
        await page.press("Escape", "Escape", 27);
        await page.waitFor(`${POPOVER} === null`, 4000);
        const before = (await snapshot(page))!;
        const tier: ProgressionTier = "budget";

        check(`${locale}: the ${tier} control is on screen to press`, await tap(page, TIER(tier)));
        check(`${locale}: it reports itself pressed`, await page.waitFor(`${TIER(tier)}?.getAttribute('aria-pressed') === 'true'`, 4000));
        await page.waitFor(`document.querySelectorAll('a[data-card] [data-stage-line]').length > 0`, 4000);
        const after = (await snapshot(page))!;
        check(`${locale}: exactly one key was written, with the canonical value`, after.storage.join() === TIER_KEY && after.tier === tier, `${after.storage.join(",")} = ${after.tier}`);
        check(`${locale}: only that tier is pressed`, after.tiers.filter((x) => x.pressed === "true").map((x) => x.tier).join() === tier, json(after.tiers));
        check(`${locale}: the URL did not move`, after.url === before.url && after.url === "", after.url);
        check(`${locale}: the history did not move — a preference is not a decision the URL records`, after.history === before.history, `${before.history} → ${after.history}`);
        check(`${locale}: the results did not move`, after.results === before.results && after.cards.map((c) => c.slug).join() === before.cards.map((c) => c.slug).join(), json(after.results));
        check(`${locale}: not one count moved, chips included`, after.counts.join("|") === before.counts.join("|"), `${before.counts.length} counts before, ${after.counts.length} after`);
        await openPopover(page);
        const popAfter = await popoverState(page);
        await page.press("Escape", "Escape", 27);
        await page.waitFor(`${POPOVER} === null`, 4000);
        check(
          `${locale}: …nor any count inside the popover`,
          !!popBefore && !!popAfter && popAfter.options.map((o) => `${o.group}=${o.value}:${o.count}:${o.disabled}`).join() === popBefore.options.map((o) => `${o.group}=${o.value}:${o.count}:${o.disabled}`).join(),
          `${popBefore?.options.length} options before, ${popAfter?.options.length} after`,
        );
        check(
          `${locale}: the legend now names the tier`,
          after.legend !== before.legend && (after.legend.includes(tiers.budgetLabel) || after.legend.includes(tiers.budgetShort)),
          json(after.legend),
        );
        check(`${locale}: a clear control appeared`, after.clearTier);
        check(`${locale}: every visible card gained exactly one stage line`, after.cards.length > 0 && after.cards.every((c) => c.stageLines === 1 && (c.stage ?? "").length > 0), json(after.cards.filter((c) => c.stageLines !== 1).slice(0, 3)));
        check(`${locale}: …of at most three names`, after.cards.every((c) => (c.stage ?? "").split("·").length <= 3), json(after.cards.map((c) => c.stage).slice(0, 2)));
        const firstNames = stageNames(locale, after.cards[0]?.slug ?? "", tier);
        check(`${locale}: …and the first card's names are the tier's first three picks, resolved`, firstNames.length > 0 && firstNames.every((n) => (after.cards[0]?.stage ?? "").includes(n)), `want ${firstNames.join(" · ")}, got ${json(after.cards[0]?.stage)}`);
        check(`${locale}: "for my stage" became available`, after.sort.options.some((o) => o.value === "stage" && !o.disabled), json(after.sort.options));

        // Clearing undoes all of it, and only it.
        check(`${locale}: the clear control is on screen`, await tap(page, CLEAR_TIER));
        check(`${locale}: clearing removes the key`, await page.waitFor(`(() => { try { return localStorage.getItem(${json(TIER_KEY)}) === null; } catch { return false; } })()`, 4000));
        await page.waitFor(`document.querySelectorAll('a[data-card] [data-stage-line]').length === 0`, 4000);
        const cleared = (await snapshot(page))!;
        check(`${locale}: …nothing is pressed, the lines are gone, the legend asks again`, cleared.tiers.every((x) => x.pressed === "false") && cleared.cards.every((c) => c.stageLines === 0) && cleared.legend === before.legend && !cleared.clearTier, json({ legend: cleared.legend, clear: cleared.clearTier }));
        check(`${locale}: …"for my stage" is disabled again`, cleared.sort.options.some((o) => o.value === "stage" && o.disabled));
        check(`${locale}: …and the URL, history and results still never moved`, cleared.url === "" && cleared.history === before.history && cleared.results === before.results, `${cleared.url} ${before.history} → ${cleared.history}`);
      } else check(`${locale}: the catalogue hydrates for the stage picker`, false);

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: sorting is a decision in the URL, and the orders are the plan's`);
      // ---------------------------------------------------------------------
      if (await load(page, catalogue)) {
        const start = (await snapshot(page))!;
        let entries = start.history;
        for (const key of ["easiest", "cheapest", "name"] as const) {
          check(`${locale}: the ${key} option can be chosen`, await chooseSort(page, key));
          check(`${locale}: …it writes ?sort=${key}`, await urlIs(page, { sort: key }));
          const want = sortedSlugs(locale, rows, {}, key, null);
          const settled = await page.waitFor(`[...document.querySelectorAll('a[data-card][href]')].map((a) => a.getAttribute('href').split('/').pop()).join(',') === ${json(want.join(","))}`, 4000);
          const s = (await snapshot(page))!;
          check(`${locale}: …the cards are in ${key} order`, settled, `got ${s.cards.slice(0, 4).map((c) => c.slug).join(",")}… want ${want.slice(0, 4).join(",")}…`);
          check(`${locale}: …in one history entry`, s.history === entries + 1, `${entries} → ${s.history}`);
          check(`${locale}: …and the select reads it back`, s.sort.value === key, s.sort.value);
          entries = s.history;
        }
        // Recommended is the default: it leaves the URL bare.
        await chooseSort(page, "recommended");
        check(`${locale}: recommended is omitted from the URL`, await page.waitFor(`location.search === ''`, 4000), await page.evaluate<string>("location.search"));
        const rec = (await snapshot(page))!;
        check(`${locale}: …and the catalogue order is back`, rec.cards.map((c) => c.slug).join() === rows.map((x) => x.slug).join());
        // Control: the three orders really differ from the catalogue's, or the assertions above measured nothing.
        check(
          `${locale}: control — every ranked order differs from the recommended one somewhere`,
          (["easiest", "cheapest", "name"] as const).every((k) => sortedSlugs(locale, rows, {}, k, null).join() !== rows.map((x) => x.slug).join()),
        );
        // A sort composes with a filter: the ranked order of one class.
        const first = classes[0];
        if (await load(page, `${catalogue}?class=${first}&sort=easiest`)) {
          const want = sortedSlugs(locale, rows, { class: [first] }, "easiest", null);
          const s = (await snapshot(page))!;
          check(`${locale}: ?class=${first}&sort=easiest ranks that class's builds`, s.cards.map((c) => c.slug).join() === want.join() && s.sort.value === "easiest", `got ${s.cards.slice(0, 3).map((c) => c.slug).join(",")} want ${want.slice(0, 3).join(",")}`);
        }
        // The help discloses the note.
        if (await load(page, catalogue)) {
          const quiet = (await snapshot(page))!;
          await clickThat(page, SORT_HELP);
          check(`${locale}: the sort help expands and reveals its note`, await page.waitFor(`${SORT_HELP}?.getAttribute('aria-expanded') === 'true' && document.querySelector('[data-sort-note]') && document.querySelector('[data-sort-note]').getBoundingClientRect().height > 0`, 4000));
          const helped = (await snapshot(page))!;
          check(`${locale}: …without touching the URL or the history`, helped.url === "" && helped.history === quiet.history, `${quiet.history} → ${helped.history}`);
        }
      } else check(`${locale}: the catalogue hydrates for sorting`, false);

      // "For my stage", per tier family, against the oracle.
      for (const tier of ["early-hell", "budget", "bis"] as const) {
        if (!(await load(page, catalogue, tier))) {
          check(`${locale}: the catalogue hydrates with ${tier} stored`, false);
          continue;
        }
        const s0b = (await snapshot(page))!;
        check(`${locale} (${tier} stored): recommended is still the default and the order is the catalogue's`, s0b.sort.value === "recommended" && s0b.cards.map((c) => c.slug).join() === rows.map((x) => x.slug).join(), `${s0b.sort.value}`);
        check(`${locale} (${tier} stored): the ${tier} control is pressed on load`, s0b.tiers.find((x) => x.tier === tier)?.pressed === "true");
        check(`${locale} (${tier} stored): "for my stage" can be chosen`, await chooseSort(page, "stage"));
        check(`${locale} (${tier} stored): …it writes ?sort=stage`, await urlIs(page, { sort: "stage" }));
        const want = sortedSlugs(locale, rows, {}, "stage", tier);
        const settled = await page.waitFor(`[...document.querySelectorAll('a[data-card][href]')].map((a) => a.getAttribute('href').split('/').pop()).join(',') === ${json(want.join(","))}`, 4000);
        const s = (await snapshot(page))!;
        check(`${locale} (${tier} stored): …the cards follow the ${tier} rule`, settled, `got ${s.cards.slice(0, 4).map((c) => c.slug).join(",")}… want ${want.slice(0, 4).join(",")}…`);
        check(`${locale} (${tier} stored): …the preference is still the only key`, s.storage.join() === TIER_KEY && s.tier === tier, s.storage.join(","));
      }
      check(
        `${locale}: control — at least one stage rule differs from the recommended order`,
        (["early-hell", "budget", "bis"] as const).some((tier) => sortedSlugs(locale, rows, {}, "stage", tier).join() !== rows.map((x) => x.slug).join()),
      );
      // ?sort=stage with nothing stored degrades to recommended.
      if (await load(page, `${catalogue}?sort=stage`)) {
        const s = (await snapshot(page))!;
        check(`${locale}: ?sort=stage without a preference shows recommended, in the recommended order`, s.sort.value === "recommended" && s.cards.map((c) => c.slug).join() === rows.map((x) => x.slug).join() && s.cards.length === total, `${s.sort.value}, ${s.cards.length} cards`);
        check(`${locale}: …and did not store anything to make it true`, s.storage.length === 0, s.storage.join(","));
      }

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: Back and Forward restore the URL, the controls and the list (M5)`);
      // ---------------------------------------------------------------------
      if (await load(page, catalogue)) {
        const first = withDmg;
        const base = (await snapshot(page))!;
        await clickThat(page, CHIP(first));
        await urlIs(page, { class: first });
        await openPopover(page);
        await clickThat(page, OPTION("damage", dmg));
        await urlIs(page, { class: first, damage: dmg });
        await page.press("Escape", "Escape", 27);
        await page.waitFor(`${POPOVER} === null`, 4000);
        const two = (await snapshot(page))!;
        const bothCount = matching(rows, { class: [first], damage: [dmg] }).length;
        check(`${locale}: two decisions are two entries`, two.history === base.history + 2 && two.cards.length === bothCount, `${base.history} → ${two.history}, ${two.cards.length} vs ${bothCount}`);

        await page.evaluate("history.back()");
        check(`${locale}: Back undoes the tick alone`, await urlIs(page, { class: first }));
        const oneCount = matching(rows, { class: [first] }).length;
        check(`${locale}: …and the list, the chip, the badge and the counter follow the URL`, await page.waitFor(`document.querySelectorAll('a[data-card]').length === ${oneCount} && ${CHIP(first)}?.getAttribute('aria-pressed') === 'true'`, 4000));
        const b1 = (await snapshot(page))!;
        check(`${locale}: …badge empty, counter ${oneCount}, one applied chip`, (b1.more.badge === null || b1.more.badge === "" || b1.more.badge === "0") && b1.results === resultsText(oneCount) && b1.applied.join() === `class=${first}`, json({ badge: b1.more.badge, results: b1.results, applied: b1.applied }));

        await page.evaluate("history.back()");
        check(`${locale}: Back again undoes the chip`, await page.waitFor(`location.search === ''`, 4000));
        check(`${locale}: …and the whole catalogue is back, nothing pressed`, await page.waitFor(`document.querySelectorAll('a[data-card]').length === ${total} && document.querySelectorAll('[data-class-chips] button[aria-pressed="true"]').length === 0`, 4000));

        await page.evaluate("history.forward()");
        await page.waitFor(`new URLSearchParams(location.search).get('class') === ${json(first)}`, 4000);
        await page.evaluate("history.forward()");
        check(`${locale}: Forward twice redoes both`, await urlIs(page, { class: first, damage: dmg }));
        check(`${locale}: …with the list, the chip and the badge restored`, await page.waitFor(`document.querySelectorAll('a[data-card]').length === ${bothCount} && ${CHIP(first)}?.getAttribute('aria-pressed') === 'true' && (${MORE}?.querySelector('[data-badge]')?.textContent || '').trim() === '1'`, 4000));
      } else check(`${locale}: the catalogue hydrates for Back/Forward`, false);

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: applied chips remove one filter each; Clear all needs two`);
      // ---------------------------------------------------------------------
      {
        const first = withDmg;
        if (await load(page, `${catalogue}?class=${first}&damage=${dmg}`)) {
          const s = (await snapshot(page))!;
          check(`${locale}: two applied chips, Clear all offered, badge 1 (the class is not an advanced filter)`, sameSet(s.applied, [`class=${first}`, `damage=${dmg}`]) && s.clearAll && s.more.badge === "1", json({ applied: s.applied, clearAll: s.clearAll, badge: s.more.badge }));
          await clickThat(page, APPLIED("damage", dmg));
          check(`${locale}: the damage chip's ✕ removes just that filter`, await urlIs(page, { class: first }));
          await cardsAre(page, matching(rows, { class: [first] }).length);
          const one = (await snapshot(page))!;
          check(`${locale}: …in one entry, leaving one chip and no Clear all`, one.history === s.history + 1 && one.applied.join() === `class=${first}` && !one.clearAll, json({ history: [s.history, one.history], applied: one.applied, clearAll: one.clearAll }));
          check(`${locale}: …and the class chip is still pressed`, one.chips.find((c) => c.slug === first)?.pressed === "true");
        }
        if (await load(page, `${catalogue}?class=${first}&damage=${dmg}`)) {
          const s = (await snapshot(page))!;
          await clickThat(page, CLEAR_ALL);
          check(`${locale}: Clear all empties the URL`, await page.waitFor(`location.search === ''`, 4000));
          check(`${locale}: …and the whole catalogue is back in one entry`, await page.waitFor(`document.querySelectorAll('a[data-card]').length === ${total} && history.length === ${s.history + 1}`, 4000));
        }
      }

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: the empty state, reached by URL only`);
      // ---------------------------------------------------------------------
      if (await load(page, emptyUrl)) {
        const s = (await snapshot(page))!;
        check(`${locale}: ?class=${pair.classSlug}&damage=${pair.damage} shows the empty state with the emptyTitle`, s.empty && s.emptyText.includes(dict.emptyTitle) && s.cards.length === 0, json(s.emptyText.slice(0, 60)));
        check(`${locale}: …the counter says 0`, s.results === resultsText(0), json(s.results));
        check(`${locale}: …it names the group that zeroed it — damage — as removable`, s.removeGroup.includes("damage") && !s.removeGroup.includes("class"), json(s.removeGroup));
        check(`${locale}: …and offers up to three near builds, all of the selected class`, s.near.length >= 1 && s.near.length <= 3 && s.near.every((h) => h.startsWith(`${r.builds()}/${pair.classSlug}/`)), json(s.near));
        check(`${locale}: …but no "remove last": nothing was decided in this session`, !s.removeLast);
        check(`${locale}: …the checked zero option is not disabled — a checked option never is`, (await openPopover(page)) && (await popoverState(page))!.options.some((o) => o.group === "damage" && o.value === pair.damage && o.checked && !o.disabled && o.count === 0));
        await page.press("Escape", "Escape", 27);
        await page.waitFor(`${POPOVER} === null`, 4000);
        await clickThat(page, REMOVE_GROUP("damage"));
        check(`${locale}: removing the group leaves the class`, await urlIs(page, { class: pair.classSlug }));
        const back = matching(rows, { class: [pair.classSlug] }).length;
        check(`${locale}: …and results come back, in one entry`, await page.waitFor(`document.querySelectorAll('a[data-card]').length === ${back} && !document.querySelector('[data-empty]') && history.length === ${s.history + 1}`, 4000));
      } else check(`${locale}: the empty URL hydrates`, false);

      /*
       * "Remove last filter" is defined as undoing the last decision *this
       * component* recorded in this session, and it is offered only when the
       * top of that record produced the current URL. Adding a filter can never
       * reach zero — only options with builds are enabled — so the one route
       * from an empty state to another empty state is an untick: an old link
       * with three filters, one of them taken off, is still empty, and that is
       * where the control has to exist and has to go back.
       */
      {
        const budget = BUDGET_LEVELS[0];
        const threeUrl = `${emptyUrl}&budget=${budget}`;
        if (await load(page, threeUrl)) {
          const s = (await snapshot(page))!;
          check(`${locale}: an old three-filter link is empty too, and offers no "remove last" on arrival`, s.empty && !s.removeLast && s.params.budget === budget, json(s.params));
          check(`${locale}: the popover opens from the empty state`, await openPopover(page));
          check(`${locale}: the applied ${budget} budget is checked and enabled there`, (await popoverState(page))!.options.some((o) => o.group === "budget" && o.value === budget && o.checked && !o.disabled));
          await clickThat(page, OPTION("budget", budget));
          check(`${locale}: unticking it writes a URL that is still empty`, await urlIs(page, { class: pair.classSlug, damage: pair.damage }));
          await page.press("Escape", "Escape", 27);
          await page.waitFor(`${POPOVER} === null`, 4000);
          const lastOffered = await page.waitFor(`${REMOVE_LAST} !== null`, 4000);
          const decided = (await snapshot(page))!;
          check(`${locale}: …still the empty state, one entry later`, decided.empty && decided.history === s.history + 1, `${s.history} → ${decided.history}`);
          check(`${locale}: …and now "remove last" is offered`, lastOffered && decided.removeLast);
          await clickThat(page, REMOVE_LAST);
          check(`${locale}: it goes back to the URL before the decision`, await urlIs(page, { class: pair.classSlug, damage: pair.damage, budget }));
          check(`${locale}: …and, the record no longer matching the URL, withdraws itself`, await page.waitFor(`${REMOVE_LAST} === null && document.querySelector('[data-empty]') !== null`, 4000));
        } else check(`${locale}: the three-filter empty URL hydrates`, false);
      }

      // A checked option with a count of zero, and what unticking its sibling does.
      {
        const cp = contributingPair(locale);
        if (cp && (await load(page, `${catalogue}?class=${cp.classSlug}&damage=${cp.zero},${cp.one}`))) {
          const shown = matching(rows, { class: [cp.classSlug], damage: [cp.zero, cp.one] }).length;
          const s = (await snapshot(page))!;
          check(`${locale}: ?class=${cp.classSlug}&damage=${cp.zero},${cp.one} shows ${shown} build(s)`, s.cards.length === shown && shown > 0, `${s.cards.length}`);
          check(`${locale}: the popover opens`, await openPopover(page));
          const p = (await popoverState(page))!;
          const zero = p.options.find((o) => o.group === "damage" && o.value === cp.zero);
          const one = p.options.find((o) => o.group === "damage" && o.value === cp.one);
          check(`${locale}: ${cp.zero} is checked with a count of 0 and is not disabled`, !!zero && zero.checked && zero.count === 0 && !zero.disabled, json(zero));
          check(`${locale}: ${cp.one} is checked with its own count`, !!one && one.checked && one.count === 1 && !one.disabled, json(one));
          await clickThat(page, OPTION("damage", cp.one));
          check(`${locale}: unticking the contributing value takes the inert sibling with it (plan §4.2)`, await urlIs(page, { class: cp.classSlug }));
          const all = matching(rows, { class: [cp.classSlug] }).length;
          await cardsAre(page, all);
          const after = (await snapshot(page))!;
          // Not `history.length + 1` here: this section runs after a `history.back()`,
          // so the page carries a forward entry that the untick's push truncates, and
          // the length stays put. One entry per decision is the M5 section's claim,
          // made on a history with nothing ahead of it.
          check(`${locale}: …and the class's whole list is back, never zero`, after.cards.length === all && all > 0, `${after.cards.length} vs ${all}`);
          await page.press("Escape", "Escape", 27);
          await page.waitFor(`${POPOVER} === null`, 4000);
        } else if (!cp) {
          check(`${locale}: the data has a class with one build of one damage type and none of another`, false, "cannot exercise the checked-zero rule");
        }
      }

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: the keyboard`);
      // ---------------------------------------------------------------------
      if (await load(page, catalogue)) {
        const [first, second] = classes;
        await page.evaluate(`(() => { const b = ${CHIP(first)}; if (b) b.focus(); return 1; })()`);
        check(`${locale}: a chip takes focus`, (await snapshot(page))!.focus === `chip:${first}`);
        await page.press("Tab", "Tab", 9);
        const tabbed = (await snapshot(page))!;
        check(`${locale}: Tab moves to the next chip — they are in the tab order, not a roving widget`, tabbed.focus === `chip:${second}`, tabbed.focus);
        const before = tabbed.history;
        await page.press("Enter", "Enter", 13, "\r");
        check(`${locale}: Enter presses the focused chip`, await urlIs(page, { class: second }));
        check(`${locale}: …aria-pressed follows`, await page.waitFor(`${CHIP(second)}?.getAttribute('aria-pressed') === 'true'`, 4000));
        await page.press(" ", "Space", 32, " ");
        check(`${locale}: Space presses it again`, await page.waitFor(`location.search === ''`, 4000), await page.evaluate<string>("location.search"));
        const after = (await snapshot(page))!;
        check(`${locale}: …two key presses, two entries`, after.history === before + 2, `${before} → ${after.history}`);
        check(`${locale}: …and focus never left the chip`, after.focus === `chip:${second}`, after.focus);

        check(`${locale}: Enter on the trigger opens the popover with focus inside`, (await openPopover(page, "enter")) && (await popoverState(page))!.focusInside);
        await page.press("Escape", "Escape", 27);
        check(`${locale}: Escape from inside returns focus to the trigger`, (await page.waitFor(`${POPOVER} === null`, 4000)) && (await snapshot(page))!.focus === "more");
      } else check(`${locale}: the catalogue hydrates for the keyboard`, false);

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: enlarged text and reduced motion`);
      // ---------------------------------------------------------------------
      /*
       * 200% text at 1280px. The header row already runs past the viewport at
       * this size — 1562px against 1280 on the build before this phase, and
       * the Phase 2 report (§10.10) records it as pre-existing and out of that
       * phase's scope — so "the document does not scroll sideways" would be red
       * for a reason with nothing to do with filters. The rule here is the one
       * this phase can be held to: with the header taken out of the layout for
       * the length of one reading, the document is no wider than the viewport
       * — the same `scrollWidth` rule `viewport.test.ts` holds every page to,
       * which is what makes a chip row that scrolls inside its own clipped box
       * pass and a control that pushes the page sideways fail. The chips stay
       * 44px targets and the popover stays on screen. The header's own number
       * is printed, not asserted.
       */
      await page.setTextScale(200);
      if (await load(page, catalogue)) {
        await page.waitFor("document.fonts.status === 'loaded'", 8000);
        const wide = await page.evaluate<{ clientWidth: number; scrollWidth: number; withoutHeader: number; restored: boolean; chips: string[] }>(`(() => {
          const de = document.documentElement;
          const header = document.querySelector('header');
          const scrollWidth = de.scrollWidth;
          if (header) header.style.setProperty('display', 'none', 'important');
          const withoutHeader = de.scrollWidth;
          if (header) header.style.removeProperty('display');
          const chips = [...document.querySelectorAll('[data-class-chips] button[data-class], [data-stage-picker] button[data-tier]')]
            .map((b) => { const r = b.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height); });
          return { clientWidth: de.clientWidth, scrollWidth, withoutHeader, restored: de.scrollWidth === scrollWidth, chips };
        })()`);
        console.log(`  ${locale} @${DESKTOP} 200% text: document ${wide.scrollWidth} wide against ${wide.clientWidth} (${wide.withoutHeader} with the header out of the layout)`);
        check(`${locale} @200% text: the listing and its controls add no sideways scroll — the document fits once the header is out of the layout`, wide.withoutHeader <= wide.clientWidth && wide.restored, `${wide.withoutHeader} vs ${wide.clientWidth}, restored ${wide.restored}`);
        check(`${locale} @200% text: every chip is still a ${PRIMARY_TARGET}px target`, wide.chips.length > 0 && wide.chips.every((c) => c.split("x").every((n) => Number(n) >= PRIMARY_TARGET)), wide.chips.join(","));
        check(`${locale} @200% text: the popover opens`, await openPopover(page));
        const p = await popoverState(page);
        check(`${locale} @200% text: …and stays inside the viewport horizontally`, !!p && p.left >= 0 && p.right <= wide.clientWidth, json({ left: p?.left, right: p?.right, clientWidth: wide.clientWidth }));
        await page.press("Escape", "Escape", 27);
        await page.waitFor(`${POPOVER} === null`, 4000);
      } else check(`${locale} @200% text: the catalogue hydrates`, false);
      await page.setTextScale(100);

      await page.setReducedMotion(true);
      if (await load(page, catalogue)) {
        const reduced = await page.evaluate<{ matches: boolean; behavior: string }>(
          `({ matches: matchMedia('(prefers-reduced-motion: reduce)').matches, behavior: getComputedStyle(document.documentElement).scrollBehavior })`,
        );
        check(`${locale}: control — the browser reports reduced motion once emulated`, reduced.matches);
        check(`${locale}: under reduced motion the page arrives without the journey — scroll-behavior is auto`, reduced.behavior === "auto", reduced.behavior);
      }
      await page.setReducedMotion(false);
      if (await load(page, catalogue)) {
        const normal = await page.evaluate<string>("getComputedStyle(document.documentElement).scrollBehavior");
        check(`${locale}: control — and smooth again without it, so the rule above discriminates`, normal === "smooth", normal);
      }

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: the class page shares the listing, minus the class chips`);
      // ---------------------------------------------------------------------
      {
        const cls = classes[0];
        const classRows = rowsFor(locale, cls);
        const classUrl = site.origin + r.class(cls as Slug);
        await prepareStorage(page, null);
        await page.goto(classUrl);
        const ready = await page.waitFor(`document.querySelector('#builds [data-filters][data-filters-ready]')`, 10_000);
        check(`${locale}: /classes/${cls} hydrates its #builds listing`, ready);
        if (ready) {
          const scope = "document.querySelector('#builds')";
          const s = (await snapshot(page, scope))!;
          check(`${locale}: #builds has no class chips`, !s.chipsRow && s.chips.length === 0);
          check(`${locale}: …and no class control of any kind`, await page.evaluate<number>(`document.querySelectorAll('#builds [data-class]').length`) === 0);
          check(`${locale}: …but does have the stage picker`, s.picker && s.tiers.length === 6);
          check(`${locale}: …and lists every ${cls} build as a card`, sameSet(s.cards.map((c) => c.slug), classRows.map((x) => x.slug)), `${s.cards.length} of ${classRows.length}`);
          check(
            `${locale}: the leading levelling card is not a build card`,
            await page.evaluate<boolean>(`(() => {
              const li = document.querySelector('#builds ul > li');
              return !!li && !li.querySelector('a[data-card]') && !!li.querySelector('a[href*="/leveling/"]');
            })()`),
          );
          check(`${locale}: no inline search here either`, s.search === 0);
          check(`${locale}: the trigger opens the popover on the class page`, await openPopover(page));
          const p = await popoverState(page);
          check(`${locale}: …non-modal, with the model's options for this class`, !!p && p.modal === null && p.options.length > 0 && ADVANCED.every((g) => sameSet(p.options.filter((o) => o.group === g).map((o) => o.value), offered(classRows, g))), json(p?.groups));
          const opt = (p?.options ?? []).find((o) => !o.disabled && (o.count ?? 0) > 0 && (o.count ?? 0) < classRows.length);
          check(`${locale}: an option that narrows this class exists`, !!opt);
          if (opt) {
            const before = (await snapshot(page, scope))!;
            await clickThat(page, OPTION(opt.group, opt.value));
            check(`${locale}: a tick writes the URL on the class page`, await urlIs(page, { [opt.group]: opt.value }));
            const want = facet(classRows, {}, opt.group as Group, opt.value);
            check(`${locale}: …and narrows the cards to the count the option promised`, await page.waitFor(`document.querySelectorAll('#builds a[data-card]').length === ${want}`, 4000), `want ${want}`);
            const after = (await snapshot(page, scope))!;
            check(`${locale}: …one entry, the counter following`, after.history === before.history + 1 && after.results === resultsText(want), json({ history: [before.history, after.history], results: after.results }));
          }
          await page.press("Escape", "Escape", 27);
          check(`${locale}: Escape closes it and returns focus to the trigger`, (await page.waitFor(`${POPOVER} === null`, 4000)) && (await snapshot(page, scope))!.focus === "more");
        }
      }

      // ---------------------------------------------------------------------
      console.log(`\n${locale}: what the session left behind`);
      // ---------------------------------------------------------------------
      const keys = await page.evaluate<string[]>(`(() => { try { return Object.keys(localStorage); } catch { return ['<blocked>']; } })()`);
      check(`${locale}: after all of that, storage holds nothing but the tier key (R-FILT-10)`, keys.every((k) => k === TIER_KEY), keys.join(","));
      const noise = page.drainConsole().filter((m) => !/favicon|404/i.test(m));
      check(`${locale}: the browser reported nothing wrong — no hydration warning, no error`, noise.length === 0, noise.slice(0, 3).join(" | "));
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
