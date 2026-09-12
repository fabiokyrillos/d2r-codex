/**
 * The skill-tree section, driven in a real browser (plan §9: C2, C3, C5, C6,
 * C6b, C7, C8, C10, C11, C12 browser half, C12b browser half, C15, and the
 * CLS row of §8).
 *
 * Everything here is a fact about boxes after CSS ran, about focus after a
 * key was pressed, or about what the island did with a preference — none of
 * it can be read off the prerendered HTML, which is what `skill-tree-a11y`
 * does. The two gates share the selectors of plan §5.5 and nothing else.
 *
 * What is measured, and the number it is held to:
 *
 *   - three grid tracks at 320, 390, 640, 768, 1024 and 1280; eighteen cells
 *     per grid; a node of at least 88 × 74 at 320 and 44 × 44 everywhere; a
 *     tab of at least 44 × 44 below `sm`; a grid no taller than 490 at 320;
 *     the section (class page) or the section-to-trees box (build page) no
 *     taller than 900 at 320 with one tree, printed block by block (§8.1–8.2);
 *   - every connector piece painted, and each edge's pieces together running
 *     from the bottom of the prerequisite to the top of the dependent (or
 *     between the facing sides in a row) within a pixel, through both column
 *     centres, at four widths and at 150 % text (R-TREE-2, decision 3);
 *   - below `sm` one tree visible and the others `hidden` with nothing
 *     focusable inside; from `sm` up three trees and no `tablist`; switching
 *     by click or arrow changes no URL and keeps focus on the tab (R-TREE-8);
 *   - the keyboard policy of `lib/skill-tree-nav.ts` on a real DOM, Enter
 *     opening the panel or the sheet, Escape returning focus (R-TREE-13);
 *   - hover previewing without selecting where `(hover: hover)` holds, and
 *     doing nothing at all under touch emulation, with the media query checked
 *     in the same session first (R-TREE-11, R-TREE-12, review LOW-7);
 *   - the live region silent through four arrow moves and a hover, spoken on
 *     Enter (R-TREE-14); 54 `gridcell` in the accessibility tree;
 *   - "My level": locked nodes counted from the graph, points untouched, the
 *     storage keys, clearing, an invalid value ignored and kept (R-TREE-9);
 *   - the panel's prerequisites, unlocks and synergies as links with the
 *     locale, and the pt-BR note that starts with `**` rendered as `<strong>`
 *     (R-TREE-7, review HIGH-1);
 *   - 200 % text: zero broken words and zero one-or-two-letter fragments over
 *     the names that are painted, `title` and `aria-label` intact, the
 *     name-or-glyph invariant, and at most one `data-glyph` mutation per
 *     change (R-TREE-15, decision 9);
 *   - without scripts: three trees, plain links, a tap navigates; with
 *     scripts at 320 after load: one tree (R-TREE-16, decision 6);
 *   - reduced motion: computed `transitionDuration` of `0s` (R-A11Y-6);
 *   - CLS below 0.1 arriving by `#skills` at 320 and 390 (review MED-7).
 *
 * Every measurement has a control in the same session that proves it can
 * fail: a synthetic broken word is detected by the word measurer, the media
 * query is read before hover is asserted, the desktop hover that must change
 * the panel is the control for the touch hover that must not.
 *
 * Requires `npm run build`. Run with `npm run test:tree-browser`.
 */
import { assertFreshBuild } from "./build-freshness";
import { Page, startSite } from "./headless";
import { dictionaryFor, fmt } from "../lib/i18n";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { LEVEL_KEY, TIER_KEY } from "../lib/prefs";
import { getBuild, getClass, getSkill } from "../lib/registry";
import { routes } from "../lib/routes";
import { CLASSES_WITH_SKILL_PAGES, SKILL_GRAPH } from "../lib/skills";
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
const json = (v: unknown) => JSON.stringify(v);

assertFreshBuild();

// ---------------------------------------------------------------------------
// What is driven
// ---------------------------------------------------------------------------

const CLASSES = ["sorceress", "necromancer", "warlock"] as const;
const BUILDS = [
  ["sorceress", "blizzard-sorceress"],
  ["necromancer", "summoner-necromancer"],
  ["warlock", "abyss-warlock"],
] as const;
/** Width → height. The phone heights are the PRD's viewports (§17.2). */
const VIEWPORTS: Record<number, number> = { 320: 640, 390: 844, 640: 900, 768: 1024, 1024: 768, 1280: 800 };
const WIDTHS = [320, 390, 640, 768, 1024, 1280] as const;
const EDGE_WIDTHS = [320, 390, 640, 1280] as const;
const SM = 640;
const LG = 1024;
const BUDGET = 900;
/** The build box as measured on 2026-09-11 (worst 1044.0, pt-BR Summoner), rounded up — see the check for why. */
const BUILD_BUDGET_PROVISIONAL = 1050;
const CLS_LIMIT = 0.1;

const classUrl = (origin: string, locale: Locale, cls: string, hash = "") => `${origin}${routes(locale).class(cls as Slug)}${hash}`;
const buildUrl = (origin: string, locale: Locale, cls: string, build: string, hash = "") =>
  `${origin}${routes(locale).build(cls as Slug, build as Slug)}${hash}`;

const nameOf = (locale: Locale, slug: string) => getSkill(locale, slug as Slug)?.name ?? slug;
const treesOf = (locale: Locale, cls: string) => getClass(locale, cls as Slug)!.trees as readonly string[];

/** The prerequisite closure of a node, as edge keys "<from>><to>" (decision 15). */
function relatedEdgeKeys(slug: string): Set<string> {
  const keys = new Set<string>();
  const seen = new Set<string>();
  const stack = [slug];
  while (stack.length) {
    const cur = stack.pop()!;
    if (seen.has(cur)) continue;
    seen.add(cur);
    for (const p of SKILL_GRAPH[cur]?.prerequisites ?? []) {
      keys.add(`${p}>${cur}`);
      stack.push(p);
    }
  }
  return keys;
}

// ---------------------------------------------------------------------------
// Page-side locators — plan §5.5, never a class name or a position.
// ---------------------------------------------------------------------------

const ROOT = `document.querySelector('[data-trees]')`;
const READY = `document.querySelector('[data-trees][data-trees-ready]')`;
/** Glyph mode, wherever the section carries it (the island root or a grid wrapper). */
const GLYPH = `!!document.querySelector('section#skills [data-glyph], section#skills[data-glyph]')`;
const NODE = (slug: string) => `document.querySelector('a[data-node=${json(slug)}]')`;
const SHEET = `document.querySelector('[role="dialog"][aria-modal="true"][data-sheet]')`;
const PANEL = `document.querySelector('[data-panel][role="region"]')`;
const LIVE = `document.querySelector('[data-live][role="status"][aria-live="polite"]')`;
const ACTIVE_NODE = `(document.activeElement && document.activeElement.matches && document.activeElement.matches('a[data-node]') ? document.activeElement.getAttribute('data-node') : null)`;
const VISIBLE_TREES = `[...document.querySelectorAll('[data-tree]')].filter((t) => !t.hidden && t.checkVisibility()).map((t) => t.getAttribute('data-tree'))`;
const PANEL_NAME = `(() => { const el = document.querySelector('[data-panel-name]'); return el && el.checkVisibility() ? (el.textContent || '').trim() : null; })()`;
const LIVE_TEXT = `(() => { const el = ${LIVE}; return el ? (el.textContent || '').trim() : null; })()`;
const EXPANDED = `[...document.querySelectorAll('a[data-node][aria-expanded="true"]')].map((a) => a.getAttribute('data-node'))`;
const RELATED = `[...document.querySelectorAll('[data-edge][data-related]')].map((p) => p.getAttribute('data-edge'))`;
const STORAGE_KEYS = `(() => { try { return Object.keys(localStorage).sort(); } catch { return ['<blocked>']; } })()`;

/** Scrolls an element into view without the site's smooth scrolling, and returns its centre. */
const CENTRE = (selector: string) => `(() => {
  const el = ${selector};
  if (!el) return null;
  el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
})()`;

/**
 * The pointer's arrival and departure, as the DOM events a moving mouse
 * produces, in the order it produces them. The harness has no pointer-move
 * primitive (only clicks and keys), so the hover assertions dispatch the
 * sequence themselves; both React's enter/leave synthesis (`over`/`out` at the
 * root) and any native `enter`/`leave` listener see it. That the sequence
 * reaches the island is proved by the desktop half of C6, where it must
 * change the panel — which is what makes the touch half's "nothing changes"
 * a result and not a silence.
 *
 * `relatedTarget` is null — the pointer arriving from outside the window —
 * on purpose. React derives enter/leave from `over`/`out` and ignores an
 * `over` whose `relatedTarget` is a node it renders (it expects the paired
 * `out` on that node instead), and under the App Router `document.body` is
 * such a node: with `relatedTarget: document.body` no `onPointerEnter` ever
 * fired and the desktop half read `null` (2026-09-11).
 */
const HOVER_IN = (selector: string) => `(() => {
  const el = ${selector};
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const init = { bubbles: true, cancelable: true, composed: true, view: window, relatedTarget: null, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, pointerType: 'mouse', isPrimary: true, pointerId: 1 };
  for (const [Ctor, type] of [[PointerEvent, 'pointerover'], [PointerEvent, 'pointerenter'], [MouseEvent, 'mouseover'], [MouseEvent, 'mouseenter'], [PointerEvent, 'pointermove'], [MouseEvent, 'mousemove']]) {
    el.dispatchEvent(new Ctor(type, { ...init, bubbles: !type.endsWith('enter') }));
  }
  return true;
})()`;
const HOVER_OUT = (selector: string) => `(() => {
  const el = ${selector};
  if (!el) return false;
  const init = { bubbles: true, cancelable: true, composed: true, view: window, relatedTarget: null, pointerType: 'mouse', isPrimary: true, pointerId: 1 };
  for (const [Ctor, type] of [[PointerEvent, 'pointerout'], [PointerEvent, 'pointerleave'], [MouseEvent, 'mouseout'], [MouseEvent, 'mouseleave']]) {
    el.dispatchEvent(new Ctor(type, { ...init, bubbles: !type.endsWith('leave') }));
  }
  return true;
})()`;

/**
 * Broken words and short fragments over the names that are painted.
 *
 * A word is broken when its per-word `Range` has non-empty client rects on
 * more than one line; a fragment is a line of that broken word holding one or
 * two characters, counted with a `Range` per character (prototype §11.5). A
 * name that is not painted — a hidden tree, glyph mode — has no rects and is
 * neither. Measured on what is painted, never in the probe state.
 *
 * A hyphenated break (`hyphens: auto`) is a broken word: its rects sit on two
 * lines. That is the rule of R-TREE-15 ("never split a word"), and the same
 * rule `use-name-fit.ts` applies in its probe — so where hyphenation would
 * split a name, glyph mode engages and the name is no longer painted.
 */
const WORDS = (scope: string) => `(() => {
  const scopeEl = ${scope};
  if (!scopeEl) return null;
  const names = [...scopeEl.querySelectorAll('.tree-name')].filter((n) => n.checkVisibility() && n.getClientRects().length > 0);
  let broken = 0, fragments = 0, words = 0, clipped = 0;
  const examples = [];
  const range = document.createRange();
  for (const name of names) {
    if (name.scrollWidth > name.clientWidth + 1) clipped++;
    const walker = document.createTreeWalker(name, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent || '';
      const re = /\\S+/g;
      for (let m = re.exec(text); m; m = re.exec(text)) {
        words++;
        range.setStart(node, m.index); range.setEnd(node, m.index + m[0].length);
        const tops = new Set();
        for (const r of range.getClientRects()) if (r.width > 0 && r.height > 0) tops.add(Math.round(r.top));
        if (tops.size <= 1) continue;
        broken++;
        const perLine = new Map();
        for (let i = 0; i < m[0].length; i++) {
          range.setStart(node, m.index + i); range.setEnd(node, m.index + i + 1);
          const r = [...range.getClientRects()].find((x) => x.width > 0 && x.height > 0);
          if (!r) continue;
          const key = Math.round(r.top);
          perLine.set(key, (perLine.get(key) || 0) + 1);
        }
        const short = [...perLine.values()].filter((n) => n <= 2).length;
        fragments += short;
        if (examples.length < 4) examples.push(m[0] + ' [' + [...perLine.values()].join('/') + ']');
      }
    }
  }
  return { names: names.length, words, broken, fragments, clipped, examples };
})()`;

/** One measurement of the whole section at the current viewport. */
const SWEEP = `(() => {
  const root = ${ROOT};
  const section = document.querySelector('section#skills');
  const vis = (el) => el.checkVisibility();
  const box = (el) => { const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
  const trees = [...document.querySelectorAll('[data-tree]')].map((t) => {
    const g = t.querySelector('[role="grid"]');
    return {
      slug: t.getAttribute('data-tree'), id: t.id, hidden: t.hidden, visible: vis(t), role: t.getAttribute('role'), labelledby: t.getAttribute('aria-labelledby'),
      height: t.getBoundingClientRect().height,
      focusablesInHidden: t.hidden ? [...t.querySelectorAll('a, button, input, [tabindex]')].filter(vis).length : 0,
      tabStops: t.hidden ? 0 : t.querySelectorAll('a[data-node][tabindex="0"]').length,
      grid: g ? { tracks: getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length, cells: g.querySelectorAll('[role="gridcell"]').length, rows: g.querySelectorAll('[role="row"]').length, height: g.getBoundingClientRect().height, overlayFirst: !!(g.firstElementChild && g.firstElementChild.hasAttribute('data-tree-overlay') && g.firstElementChild.getAttribute('aria-hidden') === 'true') } : null,
      nodes: [...t.querySelectorAll('a[data-node]')].map((a) => ({ slug: a.getAttribute('data-node'), visible: vis(a), role: a.getAttribute('role'), tabindex: a.getAttribute('tabindex'), ...box(a) })),
    };
  });
  const nav = document.querySelector('nav[data-tree-tabs]');
  const legend = document.querySelector('details[data-legend]');
  const level = document.querySelector('form[data-level]');
  return JSON.stringify({
    ready: !!(root && root.hasAttribute('data-trees-ready')), glyph: ${GLYPH},
    tablist: !!document.querySelector('[role="tablist"]'), tabRoles: document.querySelectorAll('[role="tab"]').length, tabpanels: document.querySelectorAll('[role="tabpanel"]').length,
    tabs: [...document.querySelectorAll('nav[data-tree-tabs] a')].map((a) => ({ href: a.getAttribute('href'), role: a.getAttribute('role'), selected: a.getAttribute('aria-selected'), controls: a.getAttribute('aria-controls'), visible: vis(a), ...box(a) })),
    trees,
    section: section ? { ...box(section), scrollWidth: section.scrollWidth, clientWidth: section.clientWidth } : null,
    treesRoot: root ? box(root) : null,
    nav: nav ? { visible: vis(nav), ...box(nav) } : null,
    legend: legend ? { open: legend.open, ...box(legend) } : null,
    level: level ? box(level) : null,
    panel: (() => { const p = ${PANEL}; return p ? { visible: vis(p), name: p.getAttribute('aria-label') || (p.getAttribute('aria-labelledby') ? (document.getElementById(p.getAttribute('aria-labelledby')) || {}).textContent : null) } : null; })(),
    legendCount: document.querySelectorAll('details[data-legend]').length,
    bar: (() => { const b = document.querySelector('[data-tree]:not([hidden]) [data-namebar]'); return !!b && vis(b); })(),
    // Mutation M5 (a rigid row): content taller or wider than its node box.
    nodeOverflow: [...document.querySelectorAll('a[data-node]')].filter(vis).filter((a) => a.scrollHeight > a.clientHeight + 1 || a.scrollWidth > a.clientWidth + 1).length,
    docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    innerWidth: innerWidth,
  });
})()`;

interface Box { left: number; top: number; right: number; bottom: number; width: number; height: number }
interface NodeBox extends Box { slug: string; visible: boolean; role: string | null; tabindex: string | null }
interface TreeMeasure {
  slug: string; id: string; hidden: boolean; visible: boolean; role: string | null; labelledby: string | null; height: number;
  focusablesInHidden: number; tabStops: number;
  grid: { tracks: number; cells: number; rows: number; height: number; overlayFirst: boolean } | null;
  nodes: NodeBox[];
}
interface Sweep {
  ready: boolean; glyph: boolean; tablist: boolean; tabRoles: number; tabpanels: number;
  tabs: (Box & { href: string | null; role: string | null; selected: string | null; controls: string | null; visible: boolean })[];
  trees: TreeMeasure[];
  section: (Box & { scrollWidth: number; clientWidth: number }) | null;
  treesRoot: Box | null;
  nav: (Box & { visible: boolean }) | null;
  legend: (Box & { open: boolean }) | null;
  level: Box | null;
  panel: { visible: boolean; name: string | null } | null;
  legendCount: number;
  /** The visible tree's name bar is painted (glyph mode). */
  bar: boolean;
  /** Visible nodes whose content overflows their box — a rigid row cutting a name (M5). */
  nodeOverflow: number;
  docOverflow: number;
  innerWidth: number;
}

/** The connector pieces of every visible tree, joined per edge, beside the node boxes. */
const EDGES = `(() => {
  const out = [];
  const box = (el) => { const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
  for (const t of document.querySelectorAll('[data-tree]')) {
    if (t.hidden || !t.checkVisibility()) continue;
    const nodes = {};
    for (const a of t.querySelectorAll('a[data-node]')) nodes[a.getAttribute('data-node')] = box(a);
    const edges = {};
    for (const p of t.querySelectorAll('[data-edge]')) {
      const k = p.getAttribute('data-edge');
      const r = box(p);
      const e = edges[k] || (edges[k] = { pieces: 0, unpainted: 0, svg: 0, union: null });
      e.pieces++;
      if (p.getClientRects().length === 0 || r.width === 0 || r.height === 0) e.unpainted++;
      if (p.querySelector('svg line')) e.svg++;
      e.union = e.union ? { left: Math.min(e.union.left, r.left), top: Math.min(e.union.top, r.top), right: Math.max(e.union.right, r.right), bottom: Math.max(e.union.bottom, r.bottom) } : { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    }
    out.push({ tree: t.getAttribute('data-tree'), nodes, edges });
  }
  return JSON.stringify(out);
})()`;
interface EdgeMeasure {
  tree: string;
  nodes: Record<string, Box>;
  edges: Record<string, { pieces: number; unpainted: number; svg: number; union: { left: number; top: number; right: number; bottom: number } | null }>;
}

// ---------------------------------------------------------------------------
// Harness helpers
// ---------------------------------------------------------------------------

/** Key, code and Windows virtual key code, as `Page.press` wants them. */
const KEYS: Record<string, [string, string, number]> = {
  ArrowDown: ["ArrowDown", "ArrowDown", 40],
  ArrowUp: ["ArrowUp", "ArrowUp", 38],
  ArrowLeft: ["ArrowLeft", "ArrowLeft", 37],
  ArrowRight: ["ArrowRight", "ArrowRight", 39],
  Home: ["Home", "Home", 36],
  End: ["End", "End", 35],
  Escape: ["Escape", "Escape", 27],
  Tab: ["Tab", "Tab", 9],
};
const press = (page: Page, key: keyof typeof KEYS) => {
  const [k, code, vk] = KEYS[key];
  return page.press(k, code, vk);
};
const pressEnter = (page: Page) => page.press("Enter", "Enter", 13, "\r");
const pressSpace = (page: Page) => page.press(" ", "Space", 32, " ");
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Waits until scroll position and document height stop changing. */
async function quiet(page: Page, budgetMs = 4000): Promise<void> {
  const started = Date.now();
  let last = "";
  let still = 0;
  while (Date.now() - started < budgetMs) {
    const now = await page.evaluate<string>(`Math.round(scrollY) + ':' + document.documentElement.scrollHeight`);
    still = now === last ? still + 1 : 0;
    last = now;
    if (still >= 4) return;
    await pause(80);
  }
}

/** Loads a page and waits for the island, the fonts and a settled layout. */
async function load(page: Page, url: string): Promise<boolean> {
  await page.goto(url);
  // No island root at all (the old tree): nothing will ever become ready.
  const ready = (await page.evaluate<boolean>(`!!${ROOT}`)) ? await page.waitFor(READY, 15_000) : false;
  await page.evaluate(`document.fonts ? document.fonts.ready.then(() => true) : true`);
  await quiet(page);
  return ready;
}

/** The console must be empty after every page: a hydration mismatch shows up nowhere else. */
function clean(page: Page, label: string): void {
  const problems = page.drainConsole();
  check(`${label}: no console error, warning or exception`, problems.length === 0, problems.slice(0, 2).join(" | "));
}

async function sweep(page: Page): Promise<Sweep> {
  return JSON.parse(await page.evaluate<string>(SWEEP)) as Sweep;
}
async function edges(page: Page): Promise<EdgeMeasure[]> {
  return JSON.parse(await page.evaluate<string>(EDGES)) as EdgeMeasure[];
}

async function focusNode(page: Page, slug: string): Promise<boolean> {
  return page.evaluate<boolean>(`(() => { const el = ${NODE(slug)}; if (!el) return false; el.scrollIntoView({ block: 'center', behavior: 'instant' }); el.focus(); return document.activeElement === el; })()`);
}
const activeNode = (page: Page) => page.evaluate<string | null>(ACTIVE_NODE);

async function clickAt(page: Page, selector: string): Promise<boolean> {
  const c = await page.evaluate<{ x: number; y: number } | null>(CENTRE(selector));
  if (!c) return false;
  await page.click(c.x, c.y);
  await pause(120);
  return true;
}

// ---------------------------------------------------------------------------
// Edge geometry, judged per edge
// ---------------------------------------------------------------------------

function judgeEdges(where: string, measured: EdgeMeasure[]): void {
  for (const tree of measured) {
    const keysSeen = Object.keys(tree.edges);
    // Every prerequisite edge of this tree must be drawn.
    const expected = Object.entries(SKILL_GRAPH)
      .filter(([, n]) => n.tree === tree.tree)
      .flatMap(([slug, n]) => n.prerequisites.filter((p) => SKILL_GRAPH[p]?.tree === tree.tree).map((p) => `${p}>${slug}`));
    check(`${where} ${tree.tree}: every prerequisite edge has pieces (${expected.length})`,
      expected.length > 0 && expected.every((k) => keysSeen.includes(k)), expected.filter((k) => !keysSeen.includes(k)).join(", "));
    let painted = 0;
    let touching = 0;
    const off: string[] = [];
    for (const [key, e] of Object.entries(tree.edges)) {
      const [from, to] = key.split(">");
      const a = tree.nodes[from];
      const b = tree.nodes[to];
      if (e.unpainted === 0 && e.svg === e.pieces) painted++;
      if (!a || !b || !e.union) {
        off.push(`${key}: node or union missing`);
        continue;
      }
      const u = e.union;
      const cxA = (a.left + a.right) / 2;
      const cxB = (b.left + b.right) / 2;
      const within = (x: number) => u.left <= x + 1 && u.right >= x - 1;
      let ok: boolean;
      let why: string;
      if (Math.abs(a.top - b.top) < 1) {
        // Same row: from the facing side of the left node to the facing side of the right one.
        const leftNode = a.left < b.left ? a : b;
        const rightNode = a.left < b.left ? b : a;
        ok = Math.abs(u.left - leftNode.right) <= 1 && Math.abs(u.right - rightNode.left) <= 1 && u.top >= Math.min(a.top, b.top) - 1 && u.bottom <= Math.max(a.bottom, b.bottom) + 1;
        why = `row edge left ${u.left.toFixed(1)} vs ${leftNode.right.toFixed(1)}, right ${u.right.toFixed(1)} vs ${rightNode.left.toFixed(1)}`;
      } else {
        const top = a.top < b.top ? a : b;
        const bottom = a.top < b.top ? b : a;
        ok = Math.abs(u.top - top.bottom) <= 1 && Math.abs(u.bottom - bottom.top) <= 1 && within(cxA) && within(cxB);
        why = `top ${u.top.toFixed(1)} vs ${top.bottom.toFixed(1)}, bottom ${u.bottom.toFixed(1)} vs ${bottom.top.toFixed(1)}, span ${u.left.toFixed(1)}–${u.right.toFixed(1)} vs centres ${cxA.toFixed(1)}/${cxB.toFixed(1)}`;
      }
      if (ok) touching++;
      else off.push(`${key}: ${why}`);
    }
    const n = keysSeen.length;
    check(`${where} ${tree.tree}: all ${n} edges painted as <svg><line> pieces`, n > 0 && painted === n, `${painted}/${n}`);
    check(`${where} ${tree.tree}: all ${n} edges run from the prerequisite to the dependent within 1px`, n > 0 && touching === n, off.slice(0, 2).join(" | "));
  }
}

// ===========================================================================
async function main() {
  const site = await startSite();
  let page = await Page.launch();
  const t = (locale: Locale) => dictionaryFor(locale).skills;

  try {
    // -----------------------------------------------------------------------
    console.log("\nControls: the measurers can fail");
    // -----------------------------------------------------------------------
    await page.setViewport(390, 844, true);
    await page.goto(`${site.origin}/en-us`);
    {
      const synthetic = await page.evaluate<{ broken: number; fragments: number; names: number } | null>(
        `(() => {
          const host = document.createElement('div');
          host.innerHTML = '<span class="tree-name" style="display:inline-block;width:1px;word-break:break-all;font-size:16px;line-height:1">Skeleton</span><span class="tree-name" style="display:inline-block;width:400px;font-size:16px">Cold Mastery</span>';
          document.body.appendChild(host);
          const r = (${WORDS("host")});
          host.remove();
          return r;
        })()`,
      );
      check("a word forced onto one character per line is counted broken, with fragments", !!synthetic && synthetic.broken === 1 && synthetic.fragments >= 4, json(synthetic));
      check("two words that fit are counted as neither", !!synthetic && synthetic.names === 2 && synthetic.broken === 1, json(synthetic));
      const invisible = await page.evaluate<{ names: number } | null>(
        `(() => {
          const host = document.createElement('div');
          host.hidden = true;
          host.innerHTML = '<span class="tree-name" style="display:inline-block;width:1px;word-break:break-all">Skeleton</span>';
          document.body.appendChild(host);
          const r = (${WORDS("host")});
          host.remove();
          return r;
        })()`,
      );
      check("a name that is not painted is not measured at all", !!invisible && invisible.names === 0, json(invisible));
      // On about:blank, as build-cls.test.ts does: on a site page React would
      // hydrate under the replaced body and the measurement would be of that.
      await page.goto("about:blank");
      const shift = await page.evaluate<number>(`(() => new Promise((resolve) => {
        document.body.style.margin = '0';
        document.body.innerHTML = '<div id="a" style="height:40px"></div><div id="b" style="height:900px;background:#111">shift me</div>';
        let total = 0;
        const obs = new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) total += e.value; });
        obs.observe({ type: 'layout-shift', buffered: true });
        // Not before a second, and again if nothing arrives: Chrome reports
        // no layout shift in a document's first ~500ms, and under load a
        // 500ms timer scored 0 over a correct observer (build-cls.test.ts).
        const go = (tries) => {
          const a = document.getElementById('a');
          a.style.height = (parseFloat(a.style.height) + 660) + 'px';
          setTimeout(() => {
            if (total > 0 || tries >= 3) { obs.disconnect(); resolve(Math.round(total * 1000) / 1000); }
            else go(tries + 1);
          }, 700);
        };
        setTimeout(() => go(1), 1000);
      }))()`);
      check(`a deliberately shifting page scores above ${CLS_LIMIT}`, shift >= CLS_LIMIT, `scored ${shift}`);
    }
    page.drainConsole();

    // -----------------------------------------------------------------------
    console.log("\nC2 / C3 · geometry at six widths, both locales");
    // -----------------------------------------------------------------------
    const budgetTable: string[] = [];
    for (const locale of LOCALES) {
      const pages: { label: string; url: string; cls: string; build: string | null }[] = [
        ...CLASSES.map((cls) => ({ label: `${locale} ${cls}`, url: classUrl(site.origin, locale, cls), cls, build: null })),
        ...BUILDS.map(([cls, build]) => ({ label: `${locale} ${build}`, url: buildUrl(site.origin, locale, cls, build), cls, build })),
      ];
      for (const p of pages) {
        for (const width of WIDTHS) {
          await page.setViewport(width, VIEWPORTS[width]);
          const ready = await load(page, p.url);
          const where = `${p.label} @${width}`;
          check(`${where}: the island mounted ([data-trees-ready])`, ready);
          const s = await sweep(page);
          const visibleTrees = s.trees.filter((tr) => !tr.hidden && tr.visible);
          const nodes = visibleTrees.flatMap((tr) => tr.nodes).filter((n) => n.visible);

          check(`${where}: 3 grid tracks on every tree`, s.trees.length === 3 && s.trees.filter((tr) => !tr.hidden).every((tr) => tr.grid?.tracks === 3), s.trees.map((tr) => tr.grid?.tracks).join("/"));
          check(`${where}: 18 gridcells and 6 rows per grid`, s.trees.every((tr) => tr.grid?.cells === 18 && tr.grid.rows === 6));
          check(`${where}: the overlay is the first child of every grid`, s.trees.every((tr) => tr.grid?.overlayFirst === true));
          check(`${where}: 10 nodes per visible tree, all ≥ 44 × 44`,
            nodes.length === visibleTrees.length * 10 && nodes.every((n) => n.width >= 44 && n.height >= 44),
            `${nodes.length} nodes; smallest ${Math.min(...nodes.map((n) => n.width)).toFixed(1)} × ${Math.min(...nodes.map((n) => n.height)).toFixed(1)}`);
          if (width === 320) {
            check(`${where}: every node ≥ 88 × 74 (±0.5)`, nodes.length > 0 && nodes.every((n) => n.width >= 87.5 && n.height >= 73.5),
              `smallest ${Math.min(...nodes.map((n) => n.width)).toFixed(1)} × ${Math.min(...nodes.map((n) => n.height)).toFixed(1)}`);
            // 484 (6 × 74 + 5 × 8) plus what one elastic row adds (R-TREE-3: a
            // floor, never a fixed height): "Raise Skeletal Mage" is three lines
            // at 12px and grows its row by 9–11px. Measured 493/495 on the
            // Necromancer, 484 elsewhere.
            check(`${where}: the visible grid is ≤ 500 tall (484 + one elastic row)`, visibleTrees.length === 1 && (visibleTrees[0].grid?.height ?? Infinity) <= 500, `${visibleTrees[0]?.grid?.height.toFixed(1)}`);
          }
          check(`${where}: the section does not overflow`, !!s.section && s.section.scrollWidth <= s.section.clientWidth, s.section ? `${s.section.scrollWidth} > ${s.section.clientWidth}` : "no section");
          check(`${where}: the document does not overflow`, s.docOverflow <= 0, `${s.docOverflow}px`);
          check(`${where}: one legend in the section`, s.legendCount === 1, `${s.legendCount}`);
          check(`${where}: the legend is served closed`, s.legend?.open === false);
          check(`${where}: "My level" exists, is one line (≤ 60px) and is the last block of the section`,
            !!s.level && s.level.height <= 60 && !!s.legend && s.level.top >= s.legend.bottom - 1 && !!s.section && s.level.bottom <= s.section.bottom + 1,
            s.level ? `level ${s.level.height.toFixed(1)} tall at ${s.level.top.toFixed(0)}; legend bottom ${s.legend?.bottom.toFixed(0)}; section bottom ${s.section?.bottom.toFixed(0)}` : "absent");
          check(`${where}: hydrated nodes carry role="button" and a roving tabindex`,
            nodes.length > 0 && nodes.every((n) => n.role === "button" && (n.tabindex === "0" || n.tabindex === "-1")));

          if (width < SM) {
            check(`${where}: 3 role="tab" and one tablist below sm`, s.tabRoles === 3 && s.tablist && s.tabs.length === 3, `${s.tabRoles} tabs, tablist ${s.tablist}`);
            check(`${where}: every tab ≥ 44 × 44 and visible`, s.tabs.length === 3 && s.tabs.every((tb) => tb.visible && tb.width >= 44 && tb.height >= 44),
              s.tabs.map((tb) => `${tb.width.toFixed(0)}×${tb.height.toFixed(0)}`).join(" "));
            check(`${where}: tabs point at their trees (aria-controls = tree id, href = #id)`,
              s.tabs.every((tb, i) => tb.controls === treesOf(locale, p.cls)[i] && tb.href === `#${treesOf(locale, p.cls)[i]}`));
            check(`${where}: exactly one tree visible, the others hidden`, visibleTrees.length === 1 && s.trees.filter((tr) => tr.hidden).length === 2, s.trees.map((tr) => `${tr.slug}:${tr.hidden ? "hidden" : "shown"}`).join(" "));
            check(`${where}: the visible tree is a tabpanel labelled by its tab`, visibleTrees.every((tr) => tr.role === "tabpanel" && !!tr.labelledby), visibleTrees.map((tr) => `${tr.role}/${tr.labelledby}`).join(" "));
            check(`${where}: the selected tab is the visible tree's`, s.tabs.find((tb) => tb.selected === "true")?.controls === visibleTrees[0]?.slug);
            check(`${where}: zero focusables inside hidden trees`, s.trees.every((tr) => tr.focusablesInHidden === 0), s.trees.map((tr) => tr.focusablesInHidden).join("/"));
            check(`${where}: exactly one tabindex="0" in the visible tree`, visibleTrees.every((tr) => tr.tabStops === 1), visibleTrees.map((tr) => tr.tabStops).join("/"));
          } else {
            check(`${where}: 3 trees visible from sm up`, visibleTrees.length === 3 && s.trees.every((tr) => !tr.hidden), s.trees.map((tr) => tr.hidden ? "hidden" : "shown").join(" "));
            check(`${where}: no tablist, no tab, no tabpanel from sm up`, !s.tablist && s.tabRoles === 0 && s.tabpanels === 0, `${s.tabRoles} tabs, ${s.tabpanels} panels`);
            check(`${where}: the tab control is hidden from sm up`, !s.nav?.visible && s.tabs.every((tb) => !tb.visible));
            check(`${where}: one tabindex="0" per tree — three Tab stops`, s.trees.every((tr) => tr.tabStops === 1), s.trees.map((tr) => tr.tabStops).join("/"));
          }
          if (width >= LG) {
            check(`${where}: the docked panel is a named region`, !!s.panel && s.panel.visible && !!s.panel.name && s.panel.name.trim().length > 0, json(s.panel));
          } else {
            check(`${where}: no docked panel is painted below lg`, !s.panel || !s.panel.visible);
          }

          // The budget box (§8.1): the section on a class page, section-top to trees-bottom on a build.
          if (width === 320 && s.section && s.treesRoot) {
            const box = p.build ? s.treesRoot.bottom - s.section.top : s.section.height;
            const blocks = [
              `header ${(s.treesRoot.top - s.section.top).toFixed(0)}`,
              `tabs ${s.nav?.visible ? s.nav.height.toFixed(0) : "0"}`,
              ...s.trees.map((tr) => `${tr.slug} ${tr.hidden ? "0" : tr.height.toFixed(0)}`),
              `legend ${s.legend?.height.toFixed(0) ?? "-"}`,
              `level ${s.level?.height.toFixed(0) ?? "-"}`,
            ];
            budgetTable.push(`${p.label}: ${box.toFixed(1)} px (${blocks.join(", ")})`);
            if (!p.build) {
              check(`${where}: the §8.1 box with one tree is ≤ ${BUDGET}px`, box <= BUDGET, `${box.toFixed(1)}px — ${blocks.join(", ")}`);
            } else {
              /*
               * The build box carries what a class page does not: the section
               * header with `skillsDescription` and the total line (150–193px),
               * tabs with points (65–100px) and the per-tree points line. Measured
               * 918–1044px on the six build combinations against the plan's
               * ≈ 880–895 estimate, with every class page inside 900. Plan §8.2's
               * stop rule says the number goes to the owner, not that anything
               * is tightened here — so this holds the build box at what was
               * measured (a ratchet against growth) until that decision lands.
               */
              check(`${where}: the §8.1 build box is ≤ ${BUILD_BUDGET_PROVISIONAL}px (provisional — owner decision pending, plan §8.2)`, box <= BUILD_BUDGET_PROVISIONAL, `${box.toFixed(1)}px — ${blocks.join(", ")}`);
            }
          }

          // Connectors at the four widths, and again at 150 % text (R-TREE-2).
          if ((EDGE_WIDTHS as readonly number[]).includes(width)) {
            judgeEdges(`${where}`, await edges(page));
            await page.setTextScale(150);
            await pause(400);
            await quiet(page);
            const at150 = await sweep(page);
            // The mode is the measurement's (R-TREE-15: capability, not a
            // breakpoint): at 320 a 9-letter word at 18px no longer fits 78px,
            // so glyph mode is right there and wrong at 390. What must hold
            // either way: nothing broken, nothing clipped, nothing overflowing,
            // and a name visible in the node or in the bar.
            const words150 = await page.evaluate<{ broken: number; fragments: number; clipped: number; names: number } | null>(WORDS(ROOT));
            check(`${where} @150% text: zero broken words, fragments or clipped names (${at150.glyph ? "glyph" : "names"} mode)`, !!words150 && words150.broken === 0 && words150.fragments === 0 && words150.clipped === 0, json(words150));
            check(`${where} @150% text: names in the nodes, or glyph mode with a name bar`, at150.glyph ? !!at150.bar : (words150?.names ?? 0) >= 10, json({ glyph: at150.glyph, bar: at150.bar, names: words150?.names }));
            check(`${where} @150% text: no node content overflows its box (M5)`, at150.nodeOverflow === 0, `${at150.nodeOverflow} overflowing`);
            check(`${where} @150% text: the section does not overflow`, !!at150.section && at150.section.scrollWidth <= at150.section.clientWidth);
            judgeEdges(`${where} @150% text`, await edges(page));
            await page.setTextScale(100);
            await pause(200);
          }
          clean(page, where);
        }
      }
    }
    console.log("\n  §8.2 — the box at 320 px, block by block:");
    for (const row of budgetTable) console.log(`    ${row}`);

    // -----------------------------------------------------------------------
    console.log("\nC2a · every class at 320 px and 100 % text: names in the nodes, nothing broken");
    // -----------------------------------------------------------------------
    /*
     * C2 measures three classes. The graph carries "Concentration" (Paladin),
     * "Concentrate" (Barbarian), "Lycanthropy" (Druid) and ten more 10-letter
     * words; a class page shipping in glyph mode at the reader's default text
     * size would be the tree becoming a list of marks with no gate red
     * (review G6). So: every class, both locales, at 320 and 100 %.
     */
    for (const locale of LOCALES) {
      for (const cls of CLASSES_WITH_SKILL_PAGES) {
        await page.setViewport(320, VIEWPORTS[320]);
        const ready = await load(page, classUrl(site.origin, locale, cls));
        const where = `${locale} ${cls} @320 100%`;
        const s = await sweep(page);
        const words = await page.evaluate<{ names: number; broken: number; fragments: number; clipped: number; examples: string[] } | null>(WORDS(ROOT));
        check(`${where}: mounted, 3 tracks, names in the nodes (no glyph mode)`, ready && s.trees.filter((tr) => !tr.hidden).every((tr) => tr.grid?.tracks === 3) && !s.glyph, json({ ready, glyph: s.glyph }));
        check(`${where}: 10 names painted, zero broken, zero fragments, zero clipped`, !!words && words.names === 10 && words.broken === 0 && words.fragments === 0 && words.clipped === 0, json(words));
        check(`${where}: no node content overflows its box`, s.nodeOverflow === 0, `${s.nodeOverflow}`);
        check(`${where}: the section does not overflow`, !!s.section && s.section.scrollWidth <= s.section.clientWidth);
        clean(page, where);
      }
    }

    // -----------------------------------------------------------------------
    console.log("\nC2b · the section is as tall before hydration as after it");
    // -----------------------------------------------------------------------
    /*
     * The level control is client-only (R-PREF-4) and last in the section. If
     * it appeared *after* hydration, everything below the section would move:
     * a reader arriving at `#gear-budget` on a build page landed 56px past it
     * (the locale-switch gate caught it, 2026-09-11 — the tier fragment
     * cases). So the server render reserves the control's box under
     * `(scripting: enabled)`, and this compares the served layout with the
     * hydrated one. "Served with scripts allowed" is the chunks blocked at the
     * network: the media query stays true, nothing ever mounts.
     */
    for (const locale of LOCALES) {
      const pages = [
        ["class", classUrl(site.origin, locale, "sorceress")],
        ["build", buildUrl(site.origin, locale, "sorceress", "blizzard-sorceress")],
      ] as const;
      for (const [label, url] of pages) {
        // 320 also at 200 % text (review G9): the control wraps to two lines
        // there and the slot has to have grown with it.
        for (const [width, scale] of [[320, 100], [390, 100], [1280, 100], [320, 200]] as const) {
          const where = `${locale} ${label} @${width}${scale !== 100 ? ` ${scale}%` : ""}`;
          await page.setViewport(width, VIEWPORTS[width]);
          await page.setTextScale(scale);
          const send = (method: string, params?: object) => (page as unknown as { send(m: string, p?: object): Promise<unknown> }).send(method, params);
          await send("Network.enable");
          await send("Network.setBlockedURLs", { urls: ["*/_next/static/chunks/*.js"] });
          await page.goto(url);
          await pause(300);
          const served = await page.evaluate<{ ready: boolean; scripting: boolean; height: number; slot: number; control: number }>(`(() => {
            const s = document.querySelector('section#skills');
            const slot = document.querySelector('[data-level-slot]');
            return {
              ready: !!${READY},
              scripting: matchMedia('(scripting: enabled)').matches,
              height: s ? Math.round(s.getBoundingClientRect().height * 10) / 10 : -1,
              slot: slot ? Math.round(slot.getBoundingClientRect().height) : -1,
              control: document.querySelectorAll('form[data-level]').length,
            };
          })()`);
          await send("Network.setBlockedURLs", { urls: [] });
          await send("Network.disable");
          page.drainConsole();
          const ready = await load(page, url);
          const hydrated = await page.evaluate<{ height: number; control: number; inSlot: boolean }>(`(() => {
            const s = document.querySelector('section#skills');
            const f = document.querySelector('form[data-level]');
            return {
              height: s ? Math.round(s.getBoundingClientRect().height * 10) / 10 : -1,
              control: f ? Math.round(f.getBoundingClientRect().height) : -1,
              inSlot: !!f && !!f.closest('[data-level-slot]'),
            };
          })()`);
          check(`${where}: with the chunks blocked nothing mounted, no control, and (scripting: enabled) still holds (control)`, !served.ready && served.control === 0 && served.scripting);
          check(`${where}: the served render reserves the level control's box (${served.slot}px ≥ 44)`, served.slot >= 44);
          check(`${where}: after hydration the control is the skeleton's size (${hydrated.control}px in ${served.slot}px)`, ready && hydrated.inSlot && hydrated.control >= 44 && Math.abs(hydrated.control - served.slot) <= 1);
          check(`${where}: the section is as tall before hydration as after (${served.height} → ${hydrated.height})`, ready && served.height > 0 && Math.abs(served.height - hydrated.height) <= 1);
          clean(page, where);
          await page.setTextScale(100);
        }
      }
    }

    // -----------------------------------------------------------------------
    console.log("\nC3 · switching trees below sm: no navigation, focus stays on the tab");
    // -----------------------------------------------------------------------
    for (const locale of LOCALES) {
      await page.setViewport(390, 844, true);
      const url = classUrl(site.origin, locale, "sorceress");
      await load(page, url);
      const trees = treesOf(locale, "sorceress");
      const before = await page.evaluate<string>(`location.href`);
      const clicked = await clickAt(page, `document.querySelectorAll('nav[data-tree-tabs] a')[1]`);
      await pause(150);
      const afterClick = await page.evaluate<{ href: string; visible: string[]; activeIsTab: boolean; activeControls: string | null; stops: number }>(
        `({ href: location.href, visible: ${VISIBLE_TREES}, activeIsTab: !!(document.activeElement && document.activeElement.getAttribute('role') === 'tab'), activeControls: document.activeElement ? document.activeElement.getAttribute('aria-controls') : null, stops: [...document.querySelectorAll('[data-tree]')].filter((t) => !t.hidden).reduce((n, t) => n + t.querySelectorAll('a[data-node][tabindex="0"]').length, 0) })`,
      );
      check(`${locale}: clicking the second tab shows the second tree`, clicked && afterClick.visible.join() === trees[1], afterClick.visible.join());
      check(`${locale}: the click changed neither path nor hash`, afterClick.href === before, `${before} → ${afterClick.href}`);
      check(`${locale}: focus is on the tab that was clicked`, afterClick.activeIsTab && afterClick.activeControls === trees[1], `${afterClick.activeControls}`);
      check(`${locale}: the visible tree has exactly one Tab stop`, afterClick.stops === 1, `${afterClick.stops}`);
      const firstOfTree = (tree: string) => {
        const inTree = Object.entries(SKILL_GRAPH).filter(([, n]) => n.tree === tree).sort((a, b) => a[1].row - b[1].row || a[1].column - b[1].column);
        return inTree[0][0];
      };
      const stop = await page.evaluate<string | null>(`(() => { const t = document.querySelector('[data-tree=${json(trees[1])}]'); const a = t && t.querySelector('a[data-node][tabindex="0"]'); return a ? a.getAttribute('data-node') : null; })()`);
      check(`${locale}: the Tab stop of the active tree is its first occupied cell (${firstOfTree(trees[1])})`, stop === firstOfTree(trees[1]), `${stop}`);

      await press(page, "ArrowRight");
      await pause(150);
      const afterKey = await page.evaluate<{ href: string; visible: string[]; activeIsTab: boolean; activeControls: string | null; selected: string | null }>(
        `({ href: location.href, visible: ${VISIBLE_TREES}, activeIsTab: !!(document.activeElement && document.activeElement.getAttribute('role') === 'tab'), activeControls: document.activeElement ? document.activeElement.getAttribute('aria-controls') : null, selected: (document.querySelector('[role="tab"][aria-selected="true"]') || {}).getAttribute ? document.querySelector('[role="tab"][aria-selected="true"]').getAttribute('aria-controls') : null })`,
      );
      check(`${locale}: ArrowRight on the tablist activates the third tree`, afterKey.visible.join() === trees[2] && afterKey.selected === trees[2], `${afterKey.visible.join()} / selected ${afterKey.selected}`);
      check(`${locale}: the arrow changed neither path nor hash`, afterKey.href === before, afterKey.href);
      check(`${locale}: focus moved with the selection and stayed on a tab`, afterKey.activeIsTab && afterKey.activeControls === trees[2], `${afterKey.activeControls}`);

      // Arriving by the published tree URL selects that tree (decision 6, review MED-3).
      await load(page, classUrl(site.origin, locale, "sorceress", `#${trees[1]}`));
      const byHash = await page.evaluate<{ visible: string[]; selected: string | null }>(
        `({ visible: ${VISIBLE_TREES}, selected: (() => { const a = document.querySelector('[role="tab"][aria-selected="true"]'); return a ? a.getAttribute('aria-controls') : null; })() })`,
      );
      check(`${locale}: loading #${trees[1]} at 390 shows that tree, tab selected`, byHash.visible.join() === trees[1] && byHash.selected === trees[1], json(byHash));
      clean(page, `${locale} tabs`);
    }

    // -----------------------------------------------------------------------
    console.log("\nC5 / C7 · keyboard on a real DOM, desktop and phone");
    // -----------------------------------------------------------------------
    for (const locale of LOCALES) {
      for (const [width, mobile] of [[1280, false], [390, true]] as const) {
        await page.setViewport(width, VIEWPORTS[width], mobile);
        await load(page, classUrl(site.origin, locale, "sorceress"));
        const where = `${locale} @${width}`;
        const trees = treesOf(locale, "sorceress");

        // Tab reaches the tree: one stop per visible tree, then out.
        const walk = await page.evaluate<string[]>(`(() => {
          const root = ${ROOT};
          if (!root || !root.parentNode) return ['no island'];
          const probe = document.createElement('button');
          probe.textContent = 'probe';
          probe.setAttribute('data-probe', '');
          root.parentNode.insertBefore(probe, root);
          probe.focus();
          return [document.activeElement === probe ? 'probe' : 'lost'];
        })()`);
        check(`${where}: a focus probe sits before the island`, walk[0] === "probe");
        const stops: string[] = [];
        const expectedStops = width < SM ? 1 : 3;
        // Below `sm` two stops precede the grid: the tab control and the theme's
        // `<details>` summary (decision 10); from `sm` the theme is a paragraph.
        const before = width < SM ? 2 : 0;
        for (let i = 0; i < before + expectedStops + 1; i++) {
          await press(page, "Tab");
          stops.push((await page.evaluate<string>(`(() => { const a = document.activeElement; if (!a) return 'none'; if (a.matches('a[data-node]')) return 'node:' + a.getAttribute('data-node') + '@' + a.closest('[data-tree]').getAttribute('data-tree'); if (a.getAttribute('role') === 'tab') return 'tab'; return (a.tagName || '').toLowerCase() + (a.hasAttribute('data-probe') ? '#probe' : ''); })()`)));
        }
        await page.evaluate(`(() => { const p = document.querySelector('[data-probe]'); if (p) p.remove(); return 1; })()`);
        const nodeStops = stops.filter((s) => s.startsWith("node:"));
        const firstTabStop = width < SM ? 1 : 0; // below sm the tab control sits between the probe and the tree
        check(`${where}: Tab reaches one node per visible tree (${expectedStops}) and then leaves the grid`,
          nodeStops.length === expectedStops && !stops[stops.length - 1].startsWith("node:") && (width >= SM || (stops[0] === "tab" && stops[1] === "summary")),
          stops.join(" → "));
        check(`${where}: the stops are the first cell of each visible tree, in tree order`,
          nodeStops.every((s, i) => s.endsWith(`@${trees[i + (width < SM ? 0 : 0)]}`)) && (firstTabStop === 0 || stops[0] === "tab"),
          nodeStops.join(" → "));

        // Arrows follow the contract of lib/skill-tree-nav.ts.
        const liveBefore = await page.evaluate<string | null>(LIVE_TEXT);
        check(`${where}: the live region exists and is empty before any selection`, liveBefore === "", `${liveBefore}`);
        check(`${where}: Ice Blast can take focus`, await focusNode(page, "ice-blast"));
        await press(page, "ArrowDown");
        check(`${where}: ArrowDown from Ice Blast focuses Glacial Spike`, (await activeNode(page)) === "glacial-spike", `${await activeNode(page)}`);
        await focusNode(page, "ice-blast");
        await press(page, "ArrowRight");
        check(`${where}: ArrowRight from Ice Blast focuses Shiver Armor (documented fallback)`, (await activeNode(page)) === "shiver-armor", `${await activeNode(page)}`);
        await press(page, "ArrowUp");
        check(`${where}: ArrowUp from Shiver Armor focuses Frozen Armor (same column)`, (await activeNode(page)) === "frozen-armor", `${await activeNode(page)}`);
        await press(page, "ArrowLeft");
        check(`${where}: ArrowLeft from Frozen Armor focuses Ice Bolt`, (await activeNode(page)) === "ice-bolt", `${await activeNode(page)}`);
        await press(page, "End");
        check(`${where}: End focuses Cold Mastery`, (await activeNode(page)) === "cold-mastery", `${await activeNode(page)}`);
        await press(page, "Home");
        check(`${where}: Home focuses Ice Bolt`, (await activeNode(page)) === "ice-bolt", `${await activeNode(page)}`);
        const rove = await page.evaluate<{ zero: string[]; total: number }>(`({ zero: [...document.querySelectorAll('[data-tree=${json(trees[0])}] a[data-node][tabindex="0"]')].map((a) => a.getAttribute('data-node')), total: document.querySelectorAll('[data-tree=${json(trees[0])}] a[data-node][tabindex]').length })`);
        check(`${where}: the roving tabindex follows focus (one tabindex="0", on the focused node)`, rove.zero.join() === "ice-bolt" && rove.total === 10, json(rove));
        const liveAfterArrows = await page.evaluate<string | null>(LIVE_TEXT);
        check(`${where}: four arrow moves left the live region unchanged`, liveAfterArrows === liveBefore, `${liveAfterArrows}`);
        check(`${where}: no node is aria-expanded after arrow moves`, (await page.evaluate<string[]>(EXPANDED)).length === 0);
        check(`${where}: no sheet opened on focus`, !(await page.evaluate<boolean>(`!!${SHEET}`)));
        const previewed = await page.evaluate<string | null>(PANEL_NAME);
        if (width >= LG) check(`${where}: focus previews the node in the docked panel`, previewed === nameOf(locale, "ice-bolt"), `${previewed}`);

        // Enter confirms: panel from lg, sheet below; the live region speaks.
        await press(page, "End");
        await pressEnter(page);
        await pause(200);
        const expectedAnnounce = fmt(t(locale).announceSelected, { skill: nameOf(locale, "cold-mastery"), state: t(locale).stateAvailable });
        const after = await page.evaluate<{ live: string | null; expanded: string[]; sheet: boolean; sheetFocusClose: boolean; panelName: string | null; active: string | null; href: string }>(
          `({ live: ${LIVE_TEXT}, expanded: ${EXPANDED}, sheet: !!${SHEET}, sheetFocusClose: !!(${SHEET} && document.activeElement && document.activeElement.matches('button[data-close-sheet]') && ${SHEET}.contains(document.activeElement)), panelName: ${PANEL_NAME}, active: ${ACTIVE_NODE}, href: location.href })`,
        );
        check(`${where}: Enter did not follow the link`, after.href === classUrl(site.origin, locale, "sorceress") || after.href === `${classUrl(site.origin, locale, "sorceress")}#`, after.href);
        check(`${where}: Enter announces "${expectedAnnounce}"`, after.live === expectedAnnounce, `${after.live}`);
        check(`${where}: Enter marks only Cold Mastery aria-expanded="true"`, after.expanded.join() === "cold-mastery", after.expanded.join());
        if (width >= LG) {
          check(`${where}: the docked panel shows Cold Mastery, no sheet`, after.panelName === nameOf(locale, "cold-mastery") && !after.sheet, `${after.panelName}, sheet ${after.sheet}`);
          check(`${where}: focus stays on the node from lg up`, after.active === "cold-mastery", `${after.active}`);
        } else {
          check(`${where}: the sheet opened, modal, with focus on its close control`, after.sheet && after.sheetFocusClose, json({ sheet: after.sheet, close: after.sheetFocusClose }));
          const sheetName = await page.evaluate<string | null>(`(() => { const s = ${SHEET}; const n = s && s.querySelector('[data-panel-name]'); return n ? (n.textContent || '').trim() : null; })()`);
          check(`${where}: the sheet shows Cold Mastery`, sheetName === nameOf(locale, "cold-mastery"), `${sheetName}`);
          const locked = await page.evaluate<string>(`getComputedStyle(document.body).overflow + '/' + getComputedStyle(document.body).position`);
          check(`${where}: body scroll is locked while the sheet is open`, /hidden|fixed/.test(locked), locked);
        }
        await press(page, "Escape");
        await pause(200);
        const closed = await page.evaluate<{ sheet: boolean; active: string | null; expanded: string[]; panelName: string | null }>(
          `({ sheet: !!${SHEET}, active: ${ACTIVE_NODE}, expanded: ${EXPANDED}, panelName: ${PANEL_NAME} })`,
        );
        check(`${where}: Escape closes and returns focus to Cold Mastery`, !closed.sheet && closed.active === "cold-mastery", json(closed));
        check(`${where}: Escape clears the selection (no aria-expanded)`, closed.expanded.length === 0, closed.expanded.join());

        // Space opens too (R-TREE-13; the D7 keydown on an <a role="button">).
        await focusNode(page, "ice-blast");
        await pressSpace(page);
        await pause(200);
        const bySpace = await page.evaluate<{ expanded: string[]; href: string; scrolled: number }>(`({ expanded: ${EXPANDED}, href: location.href, scrolled: 0 })`);
        check(`${where}: Space selects Ice Blast without following the link`, bySpace.expanded.join() === "ice-blast" && bySpace.href.startsWith(classUrl(site.origin, locale, "sorceress")), json(bySpace));
        await press(page, "Escape");
        await pause(100);

        // Tab from the last stop leaves the grid.
        await focusNode(page, "cold-mastery");
        await press(page, "Tab");
        const left = await page.evaluate<string>(`(() => { const a = document.activeElement; return a && a.matches('a[data-node]') ? 'node:' + a.getAttribute('data-node') : (a ? a.tagName.toLowerCase() : 'none'); })()`);
        check(`${where}: Tab from Cold Mastery leaves the grid`, !left.startsWith("node:") || (width >= SM && left.startsWith("node:") && !left.includes("cold-mastery")), left);

        if (width >= LG) {
          const ax = await page.axNodes();
          const roles = (r: string) => ax.filter((n) => n.role === r).length;
          // Rows: the page's tables are rows too, so the grid's are told by their
          // tier name (`rowLabel`), which nothing else on the page carries.
          const tierRows = ax.filter((n) => n.role === "row" && [1, 6, 12, 18, 24, 30].some((lv) => n.name === t(locale).rowLabel.replace("{level}", String(lv)))).length;
          check(`${where}: the accessibility tree holds 54 gridcells, 18 tier rows, 3 grids`, roles("gridcell") === 54 && tierRows === 18 && roles("grid") === 3, `${roles("gridcell")}/${tierRows}/${roles("grid")}`);
          check(`${where}: 24 of them are the empty cells, named "${t(locale).emptyCell}"`, ax.filter((n) => n.role === "gridcell" && n.name === t(locale).emptyCell).length === 24);
          check(`${where}: the panel region is named in the accessibility tree`, ax.some((n) => n.role === "region" && n.name.trim().length > 0));
        }
        clean(page, where);
      }
    }

    // -----------------------------------------------------------------------
    console.log("\nC6 / C6b · hover with (hover: hover), and nothing under touch");
    // -----------------------------------------------------------------------
    for (const locale of LOCALES) {
      // Desktop: the media query must be true before anything is asserted.
      await page.setViewport(1280, 800, false);
      await page.setHoverCapable(true);
      await load(page, classUrl(site.origin, locale, "sorceress"));
      const hoverCapable = await page.evaluate<boolean>(`matchMedia('(hover: hover)').matches`);
      check(`${locale} desktop: (hover: hover) matches (control)`, hoverCapable);
      const liveBefore = await page.evaluate<string | null>(LIVE_TEXT);
      const emptyPanel = await page.evaluate<string | null>(PANEL_NAME);
      check(`${locale} desktop: hover-in reaches Blizzard`, await page.evaluate<boolean>(HOVER_IN(NODE("blizzard"))));
      await pause(150);
      const hovered = await page.evaluate<{ name: string | null; related: string[]; expanded: string[]; live: string | null }>(
        `({ name: ${PANEL_NAME}, related: ${RELATED}, expanded: ${EXPANDED}, live: ${LIVE_TEXT} })`,
      );
      const want = relatedEdgeKeys("blizzard");
      check(`${locale} desktop: hover previews Blizzard in the panel (control for the touch half)`, hovered.name === nameOf(locale, "blizzard"), `${hovered.name} (was ${emptyPanel})`);
      check(`${locale} desktop: the whole prerequisite chain lights up (${[...want].join(", ")})`,
        want.size > 1 && [...want].every((k) => hovered.related.includes(k)) && hovered.related.every((k) => want.has(k)),
        hovered.related.join(", "));
      check(`${locale} desktop: hover sets no aria-expanded`, hovered.expanded.length === 0, hovered.expanded.join());
      check(`${locale} desktop: hover writes nothing to the live region`, hovered.live === liveBefore, `${hovered.live}`);
      check(`${locale} desktop: hover-out reaches Blizzard`, await page.evaluate<boolean>(HOVER_OUT(NODE("blizzard"))));
      await pause(150);
      const away = await page.evaluate<{ name: string | null; related: string[] }>(`({ name: ${PANEL_NAME}, related: ${RELATED} })`);
      check(`${locale} desktop: leaving restores the empty panel and unlights the chain`, away.name === emptyPanel && away.related.length === 0, json(away));

      // With a confirmed selection, the preview never touches it.
      await focusNode(page, "ice-blast");
      await pressEnter(page);
      await pause(150);
      await page.evaluate(HOVER_IN(NODE("blizzard")));
      await pause(150);
      const over = await page.evaluate<{ name: string | null; expanded: string[] }>(`({ name: ${PANEL_NAME}, expanded: ${EXPANDED} })`);
      check(`${locale} desktop: hovering Blizzard over a selected Ice Blast previews Blizzard`, over.name === nameOf(locale, "blizzard"), `${over.name}`);
      check(`${locale} desktop: and the selection (aria-expanded) stays on Ice Blast`, over.expanded.join() === "ice-blast", over.expanded.join());
      await page.evaluate(HOVER_OUT(NODE("blizzard")));
      await pause(150);
      const restored = await page.evaluate<string | null>(PANEL_NAME);
      check(`${locale} desktop: moving away restores the confirmed selection`, restored === nameOf(locale, "ice-blast"), `${restored}`);
      clean(page, `${locale} desktop hover`);

      // Touch: the same events, the opposite result — and the media query says why.
      await page.setViewport(390, 844, true);
      await page.setHoverCapable(false);
      await load(page, classUrl(site.origin, locale, "sorceress"));
      const touchHover = await page.evaluate<boolean>(`matchMedia('(hover: hover)').matches`);
      check(`${locale} touch: (hover: hover) does not match (control)`, !touchHover);
      const stateBefore = await page.evaluate<string>(`JSON.stringify({ related: ${RELATED}, expanded: ${EXPANDED}, sheet: !!${SHEET}, live: ${LIVE_TEXT}, name: ${PANEL_NAME} })`);
      await page.evaluate(HOVER_IN(NODE("blizzard")));
      await pause(150);
      const stateAfter = await page.evaluate<string>(`JSON.stringify({ related: ${RELATED}, expanded: ${EXPANDED}, sheet: !!${SHEET}, live: ${LIVE_TEXT}, name: ${PANEL_NAME} })`);
      check(`${locale} touch: a pointer move over Blizzard changes nothing`, stateAfter === stateBefore, `${stateBefore} → ${stateAfter}`);
      await page.evaluate(HOVER_OUT(NODE("blizzard")));

      // A tap selects and opens the sheet; a second tap keeps it open.
      const tapped = await clickAt(page, NODE("blizzard"));
      await pause(250);
      const opened = await page.evaluate<{ sheet: boolean; expanded: string[]; name: string | null; href: string; focusClose: boolean }>(
        `({ sheet: !!${SHEET}, expanded: ${EXPANDED}, name: (() => { const s = ${SHEET}; const n = s && s.querySelector('[data-panel-name]'); return n ? (n.textContent || '').trim() : null; })(), href: location.href, focusClose: !!(document.activeElement && document.activeElement.matches('button[data-close-sheet]')) })`,
      );
      check(`${locale} touch: a tap selects Blizzard and opens the sheet on it`, tapped && opened.sheet && opened.expanded.join() === "blizzard" && opened.name === nameOf(locale, "blizzard"), json(opened));
      check(`${locale} touch: the tap did not follow the link`, opened.href.startsWith(classUrl(site.origin, locale, "sorceress")), opened.href);
      check(`${locale} touch: focus moved to the sheet's close control`, opened.focusClose);
      // The sheet covers the grid, so the second tap is the node's own click.
      const secondTap = await page.evaluate<boolean>(`(() => { const el = ${NODE("blizzard")}; if (!el) return false; el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, view: window })); return true; })()`);
      await pause(200);
      const second = await page.evaluate<{ sheet: boolean; expanded: string[] }>(`({ sheet: !!${SHEET}, expanded: ${EXPANDED} })`);
      check(`${locale} touch: a second tap on the selected node keeps the sheet open (no toggle)`, secondTap && second.sheet && second.expanded.join() === "blizzard", json(second));

      // Three ways out, each returning focus to the node.
      const closeVia: [string, () => Promise<unknown>][] = [
        ["the close button", () => clickAt(page, `${SHEET}?.querySelector('button[data-close-sheet]')`)],
        ["Escape", () => press(page, "Escape")],
        ["the scrim", async () => {
          const spot = await page.evaluate<{ x: number; y: number } | null>(`(() => {
            const scrim = document.querySelector('[data-scrim]');
            const sheet = ${SHEET};
            if (!scrim || !sheet) return null;
            const s = scrim.getBoundingClientRect();
            const d = sheet.getBoundingClientRect();
            for (const [x, y] of [[s.left + 8, s.top + 8], [s.right - 8, s.top + 8], [s.left + 8, d.top - 8]]) {
              const hit = document.elementFromPoint(x, y);
              if (hit && (hit === scrim || scrim.contains(hit)) && !sheet.contains(hit)) return { x, y };
            }
            return null;
          })()`);
          if (!spot) return false;
          await page.click(spot.x, spot.y);
          return true;
        }],
      ];
      for (const [how, act] of closeVia) {
        const isOpen = await page.evaluate<boolean>(`!!${SHEET}`);
        if (!isOpen) {
          await clickAt(page, NODE("blizzard"));
          await pause(250);
        }
        const opened = await page.evaluate<boolean>(`!!${SHEET}`);
        check(`${locale} touch: the sheet is open before closing via ${how}`, opened);
        const acted = await act();
        await pause(250);
        const out = await page.evaluate<{ sheet: boolean; active: string | null; scrim: boolean }>(`({ sheet: !!${SHEET}, active: ${ACTIVE_NODE}, scrim: !!document.querySelector('[data-scrim]') })`);
        check(`${locale} touch: ${how} closes the sheet and returns focus to Blizzard`, acted !== false && !out.sheet && out.active === "blizzard", json(out));
      }
      clean(page, `${locale} touch`);
      await page.setHoverCapable(null);
    }

    // -----------------------------------------------------------------------
    console.log("\nC8 · \"My level\": locked nodes from the graph, nothing else changes");
    // -----------------------------------------------------------------------
    for (const locale of LOCALES) {
      const [cls, build] = BUILDS[0];
      await page.setViewport(1280, 800, false);
      await load(page, buildUrl(site.origin, locale, cls, build));
      const where = `${locale} ${build}`;
      const lockedAbove = (level: number) => Object.values(SKILL_GRAPH).filter((n) => n.classSlug === cls && n.requiredLevel > level).length;
      const read = () => page.evaluate<{ locked: number; points: string; keys: string[]; level: string | null; input: string | null; states: Record<string, number> }>(
        `({ locked: document.querySelectorAll('a[data-node][data-locked]').length, points: [...document.querySelectorAll('a[data-node] [data-points]')].map((p) => p.closest('a').getAttribute('data-node') + '=' + (p.textContent || '').trim()).join(','), keys: ${STORAGE_KEYS}, level: (() => { try { return localStorage.getItem(${json(LEVEL_KEY)}); } catch { return '<blocked>'; } })(), input: (() => { const i = document.querySelector('form[data-level] input'); return i ? i.value : null; })(), states: [...document.querySelectorAll('a[data-node]')].reduce((m, a) => { const s = a.getAttribute('data-state'); m[s] = (m[s] || 0) + 1; return m; }, {}) })`,
      );
      const initial = await read();
      check(`${where}: no [data-locked] without a preference`, initial.locked === 0, `${initial.locked}`);
      check(`${where}: the level control is a number input 1–99 after the legend`, await page.evaluate<boolean>(`(() => { const f = document.querySelector('form[data-level]'); const i = f && f.querySelector('input[type="number"][min="1"][max="99"]'); const l = document.querySelector('details[data-legend]'); return !!(i && l && (l.compareDocumentPosition(f) & Node.DOCUMENT_POSITION_FOLLOWING)); })()`));
      check(`${where}: storage holds nothing of ours yet`, !initial.keys.includes(LEVEL_KEY), initial.keys.join(","));
      check(`${where}: 30 counters to compare against`, initial.points.split(",").length === 30, `${initial.points.split(",").length}`);

      const type = (value: string) => page.evaluate<boolean>(`(() => {
        const input = document.querySelector('form[data-level] input');
        if (!input) return false;
        const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        set.call(input, ${json(value)});
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      })()`);
      check(`${where}: typing 18 reaches the input`, await type("18"));
      await pause(250);
      const at18 = await read();
      check(`${where}: level 18 locks exactly the ${lockedAbove(18)} nodes above it`, at18.locked === lockedAbove(18), `${at18.locked}`);
      check(`${where}: locked nodes carry data-state="locked" and the rest keep their state`, (at18.states.locked ?? 0) === lockedAbove(18), json(at18.states));
      check(`${where}: every [data-points] is unchanged (the preference changes no data)`, at18.points === initial.points);
      check(`${where}: storage gained only ${LEVEL_KEY} = "18"`, at18.level === "18" && at18.keys.every((k) => k === TIER_KEY || k === LEVEL_KEY), `${at18.keys.join(",")} / ${at18.level}`);
      const beforeLocked = await page.evaluate<string[]>(`[...document.querySelectorAll('a[data-node][data-locked]')].map((a) => a.getAttribute('aria-label'))`);
      check(`${where}: a locked node announces "${t(locale).stateLocked}"`, beforeLocked.length > 0 && beforeLocked.every((l) => l.includes(t(locale).stateLocked)), beforeLocked[0]);

      await type("30");
      await pause(250);
      const at30 = await read();
      check(`${where}: changing to 30 recounts without a reload (${lockedAbove(30)})`, at30.locked === lockedAbove(30) && at30.level === "30", `${at30.locked} / ${at30.level}`);
      check(`${where}: counters still unchanged`, at30.points === initial.points);

      check(`${where}: "Clear" is a button`, await clickAt(page, `document.querySelector('form[data-level] button[data-clear-level]')`));
      await pause(250);
      const cleared = await read();
      check(`${where}: clearing unlocks everything and removes the key`, cleared.locked === 0 && cleared.level === null && !cleared.keys.includes(LEVEL_KEY) && (cleared.input === "" || cleared.input === null), json({ locked: cleared.locked, level: cleared.level, input: cleared.input }));

      // An out-of-range value is rejected and nothing is written.
      await type("100");
      await pause(250);
      const bad = await read();
      check(`${where}: 100 is rejected — nothing locked, nothing written`, bad.locked === 0 && bad.level === null, json({ locked: bad.locked, level: bad.level }));
      clean(page, where);
    }
    // An invalid value already in storage is ignored and never deleted (R-PREF-1's protected read).
    {
      page.close();
      page = await Page.launch();
      await page.addInitScript(`try { localStorage.setItem(${json(LEVEL_KEY)}, "abc"); } catch {}`);
      await page.setViewport(1280, 800, false);
      await load(page, buildUrl(site.origin, "en-us", BUILDS[0][0], BUILDS[0][1]));
      const planted = await page.evaluate<{ locked: number; level: string | null; input: string | null }>(
        `({ locked: document.querySelectorAll('a[data-node][data-locked]').length, level: localStorage.getItem(${json(LEVEL_KEY)}), input: (() => { const i = document.querySelector('form[data-level] input'); return i ? i.value : null; })() })`,
      );
      check("a planted invalid level locks nothing and is left in storage", planted.locked === 0 && planted.level === "abc" && (planted.input === "" || planted.input === null), json(planted));
      clean(page, "planted level");
      page.close();
      page = await Page.launch();
    }

    // -----------------------------------------------------------------------
    console.log("\nC10 / C12b · the panel: links with the locale, RichText in the note");
    // -----------------------------------------------------------------------
    const dependents = (slug: string) => Object.entries(SKILL_GRAPH).filter(([, n]) => n.prerequisites.includes(slug)).map(([s]) => s);
    const synergiesIn = (slug: string) => [...new Set((SKILL_GRAPH[slug].synergies ?? []).map((s) => s.from))];
    const synergiesOut = (slug: string) => Object.entries(SKILL_GRAPH).filter(([, n]) => (n.synergies ?? []).some((s) => s.from === slug)).map(([s]) => s);
    for (const locale of LOCALES) {
      for (const [cls, slug] of [["sorceress", "blizzard"], ["necromancer", "raise-skeletal-mage"]] as const) {
        await page.setViewport(1280, 800, false);
        await load(page, classUrl(site.origin, locale, cls));
        const where = `${locale} ${slug}`;
        await focusNode(page, slug);
        await pressEnter(page);
        await pause(200);
        const panel = await page.evaluate<{ name: string | null; full: string | null; lists: Record<string, { href: string; text: string }[]>; level: string | null }>(`(() => {
          const p = ${PANEL};
          const links = (sel) => p ? [...p.querySelectorAll(sel + ' a[href]')].map((a) => ({ href: a.getAttribute('href'), text: (a.textContent || '').trim() })) : [];
          return {
            name: ${PANEL_NAME},
            full: (() => { const a = p && p.querySelector('a[data-panel-full][href]'); return a ? a.getAttribute('href') : null; })(),
            level: (() => { const l = p && p.querySelector('[data-panel-level]'); return l ? (l.textContent || '').trim() : null; })(),
            lists: { prereqs: links('[data-panel-prereqs]'), unlocks: links('[data-panel-unlocks]'), synergiesIn: links('[data-panel-synergies-in]'), synergiesOut: links('[data-panel-synergies-out]') },
          };
        })()`);
        check(`${where}: the panel shows ${nameOf(locale, slug)}`, panel.name === nameOf(locale, slug), `${panel.name}`);
        check(`${where}: the full-page link is the skill page with the locale`, panel.full === routes(locale).skill(cls as Slug, slug as Slug), `${panel.full}`);
        check(`${where}: the panel states the level ${SKILL_GRAPH[slug].requiredLevel}`, !!panel.level && panel.level.includes(String(SKILL_GRAPH[slug].requiredLevel)), `${panel.level}`);
        const slugOf = (href: string) => href.split("/").pop() ?? "";
        const expect: [string, readonly string[]][] = [
          ["prereqs", SKILL_GRAPH[slug].prerequisites],
          ["unlocks", dependents(slug)],
          ["synergiesIn", synergiesIn(slug)],
          ["synergiesOut", synergiesOut(slug)],
        ];
        for (const [list, slugs] of expect) {
          const got = panel.lists[list];
          if (slugs.length === 0) {
            // Nothing in the graph: the list must be empty, not invented (R-TREE-7).
            check(`${where}: [data-panel-${list}] lists no links, as the graph has none`, got.length === 0, got.map((g) => slugOf(g.href)).join(", "));
            continue;
          }
          check(`${where}: [data-panel-${list}] lists ${slugs.length} links (${slugs.join(", ")})`,
            slugs.every((s) => got.some((g) => slugOf(g.href) === s)),
            got.map((g) => slugOf(g.href)).join(", "));
          check(`${where}: every ${list} link starts with /${locale}/classes/ and reads the graph's name`,
            got.length > 0 && got.every((g) => g.href.startsWith(`/${locale}/classes/`) && g.text === nameOf(locale, slugOf(g.href))),
            got.filter((g) => !g.href.startsWith(`/${locale}/classes/`) || g.text !== nameOf(locale, slugOf(g.href))).map((g) => `${g.text}→${g.href}`).join(" | "));
        }
        clean(page, where);
      }
    }
    {
      // The pt-BR Hammerdin's Resist Lightning note starts with `**` (review HIGH-1).
      const locale: Locale = "pt-br";
      const build = getBuild(locale, "hammerdin" as Slug);
      const note = build?.skills.find((a) => a.skill === "resist-lightning")?.note ?? "";
      check("pt-br hammerdin: the Resist Lightning note begins with ** in content", note.startsWith("**"), note.slice(0, 30));
      await page.setViewport(1280, 800, false);
      await load(page, buildUrl(site.origin, locale, "paladin", "hammerdin"));
      await focusNode(page, "resist-lightning");
      await pressEnter(page);
      await pause(200);
      const rendered = await page.evaluate<{ html: string | null; text: string | null; role: string | null }>(`(() => { const n = document.querySelector('[data-panel-note]'); const r = document.querySelector('[data-panel-role]'); return { html: n ? n.innerHTML : null, text: n ? n.textContent : null, role: r ? (r.textContent || '').trim() : null }; })()`);
      check("pt-br hammerdin: the note renders <strong> and no literal **", !!rendered.html && rendered.html.includes("<strong") && !(rendered.text ?? "").includes("**"), (rendered.text ?? "absent").slice(0, 60));
      check("pt-br hammerdin: the panel shows the editorial role on a build", !!rendered.role && rendered.role.length > 0, `${rendered.role}`);
      clean(page, "pt-br hammerdin note");
    }

    // -----------------------------------------------------------------------
    console.log("\nC11 · text at 200 %: nothing broken, name or glyph, the observer converges");
    // -----------------------------------------------------------------------
    {
      page.close();
      page = await Page.launch();
      // The convergence control counts flips per element: the island mirrors
      // `data-glyph` on its root and each grid wrapper, so one decision is
      // several attribute mutations, while an oscillating observer would flip
      // the same element more than once (mutation M27).
      await page.addInitScript(`
        window.__glyphFlips = 0;
        let counts = new WeakMap();
        window.__resetGlyphFlips = () => { counts = new WeakMap(); window.__glyphFlips = 0; };
        new MutationObserver((records) => {
          for (const r of records) {
            if (r.attributeName !== 'data-glyph') continue;
            const n = (counts.get(r.target) || 0) + 1;
            counts.set(r.target, n);
            if (n > window.__glyphFlips) window.__glyphFlips = n;
          }
        }).observe(document, { attributes: true, subtree: true, attributeFilter: ['data-glyph'] });
      `);
      for (const locale of LOCALES) {
        for (const [cls, build] of [["sorceress", null], ["necromancer", null], ["necromancer", "summoner-necromancer"]] as const) {
          for (const width of [320, 390] as const) {
            await page.setViewport(width, VIEWPORTS[width], true);
            await page.setTextScale(200);
            const url = build ? buildUrl(site.origin, locale, cls, build) : classUrl(site.origin, locale, cls);
            await load(page, url);
            await pause(300);
            const where = `${locale} ${build ?? cls} @${width} 200%`;
            const m = await page.evaluate<{ words: { names: number; words: number; broken: number; fragments: number; clipped: number; examples: string[] } | null; glyph: boolean; mutations: number; overflow: boolean; visible: number; namesVisible: number; titled: number; bar: boolean; scale: number; nodeOverflow: number; overflowers: string[] }>(`(() => {
              const root = ${ROOT};
              const section = document.querySelector('section#skills');
              const nodes = [...document.querySelectorAll('a[data-node]')].filter((a) => a.checkVisibility());
              return {
                words: ${WORDS("root")},
                glyph: ${GLYPH},
                mutations: window.__glyphFlips,
                overflow: !!section && section.scrollWidth > section.clientWidth,
                visible: nodes.length,
                namesVisible: nodes.filter((a) => { const n = a.querySelector('.tree-name'); return n && n.checkVisibility() && n.getClientRects().length > 0 && n.scrollWidth <= n.clientWidth + 1; }).length,
                titled: nodes.filter((a) => { const name = a.getAttribute('title'); return name && a.getAttribute('aria-label') && a.getAttribute('aria-label').startsWith(name); }).length,
                bar: !!document.querySelector('[data-namebar][aria-hidden="true"]'),
                scale: parseFloat(getComputedStyle(document.documentElement).fontSize),
                nodeOverflow: nodes.filter((a) => a.scrollHeight > a.clientHeight + 1 || a.scrollWidth > a.clientWidth + 1).length,
                // What sticks out of the section, for the failure message: the widest descendants past its right edge.
                overflowers: !section ? [] : [...section.querySelectorAll('*')].filter((el) => el.checkVisibility() && el.getBoundingClientRect().right > section.getBoundingClientRect().right + 1).slice(0, 4).map((el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') + ' ' + Math.round(el.getBoundingClientRect().right - section.getBoundingClientRect().right) + 'px'),
              };
            })()`);
            check(`${where}: the root font is 32px (text scale, not zoom)`, Math.round(m.scale) === 32, `${m.scale}`);
            check(`${where}: zero broken words over the painted names`, !!m.words && m.words.broken === 0, json(m.words));
            check(`${where}: zero one-or-two-letter fragments`, !!m.words && m.words.fragments === 0, json(m.words));
            check(`${where}: no painted name is clipped`, !!m.words && m.words.clipped === 0, json(m.words));
            check(`${where}: title and aria-label keep the name on every visible node (${m.visible})`, m.visible === 10 && m.titled === m.visible, `${m.titled}/${m.visible}`);
            check(`${where}: the section does not overflow`, !m.overflow, m.overflowers.join(" | "));
            check(`${where}: no node content overflows its box (M5)`, m.nodeOverflow === 0, `${m.nodeOverflow} overflowing`);
            check(`${where}: every visible node shows its name, or the section is in glyph mode with a name bar`,
              m.visible === 10 && (m.namesVisible === m.visible || (m.glyph && m.bar)), json({ names: m.namesVisible, of: m.visible, glyph: m.glyph, bar: m.bar }));
            check(`${where}: no element flipped data-glyph more than once on load (the observer converged)`, m.mutations <= 1, `${m.mutations}`);
            if (m.glyph) {
              const firstVisible = await page.evaluate<string | null>(`(() => { const a = [...document.querySelectorAll('a[data-node]')].find((x) => x.checkVisibility()); return a ? a.getAttribute('data-node') : null; })()`);
              if (firstVisible) await focusNode(page, firstVisible);
              await pause(100);
              const bar = await page.evaluate<string | null>(`(() => { const b = document.querySelector('[data-tree]:not([hidden]) [data-namebar]'); return b && b.checkVisibility() ? (b.textContent || '').trim() : null; })()`);
              // The bar is "Name · Level N · State[ · points]" (§5.5): the name leads.
              check(`${where}: in glyph mode focusing a node puts its name in the name bar`, !!firstVisible && !!bar && bar.startsWith(nameOf(locale, firstVisible)), `${bar}`);
            }
            // Back to 100%: the names return, with at most one flip per element.
            await page.evaluate(`(window.__resetGlyphFlips(), 1)`);
            await page.setTextScale(100);
            await pause(400);
            await quiet(page);
            const back = await page.evaluate<{ glyph: boolean; mutations: number; namesVisible: number; visible: number }>(`(() => {
              const nodes = [...document.querySelectorAll('a[data-node]')].filter((a) => a.checkVisibility());
              return { glyph: ${GLYPH}, mutations: window.__glyphFlips, visible: nodes.length, namesVisible: nodes.filter((a) => { const n = a.querySelector('.tree-name'); return n && n.checkVisibility() && n.getClientRects().length > 0; }).length };
            })()`);
            check(`${where} → 100%: names are back in every node`, back.visible === 10 && !back.glyph && back.namesVisible === back.visible, json(back));
            check(`${where} → 100%: no element flipped data-glyph more than once for the change`, back.mutations <= 1, `${back.mutations}`);
            clean(page, where);
          }
        }
      }
      // 150 %: the names stay in the nodes (prototype §11.4: the break is between 150 and 175).
      await page.setViewport(320, 640, true);
      await page.setTextScale(150);
      await load(page, classUrl(site.origin, "pt-br", "necromancer"));
      const at150 = await page.evaluate<{ glyph: boolean; bar: boolean; broken: number | null; namesVisible: number; visible: number }>(`(() => {
        const root = ${ROOT};
        const w = ${WORDS("root")};
        const nodes = [...document.querySelectorAll('a[data-node]')].filter((a) => a.checkVisibility());
        const bar = document.querySelector('[data-tree]:not([hidden]) [data-namebar]');
        return { glyph: ${GLYPH}, bar: !!bar && bar.checkVisibility(), broken: w ? w.broken : null, visible: nodes.length, namesVisible: nodes.filter((a) => { const n = a.querySelector('.tree-name'); return n && n.checkVisibility() && n.getClientRects().length > 0; }).length };
      })()`);
      // At 320 a 150 % Necromancer is in glyph mode (see C2: "Skeleton" at
      // 18px is 80px in a 78px box); what holds is that nothing is broken and
      // every visible node either shows its name or the bar does.
      check("pt-br necromancer @320 150%: none broken; names in the nodes or glyph mode with the bar", at150.broken === 0 && at150.visible === 10 && (at150.namesVisible === at150.visible || (at150.glyph && at150.bar)), json(at150));
      await page.setTextScale(100);
      clean(page, "150%");

      // Without scripts at 320 and 200 %: the CSS floor hides the names, so none is broken.
      await page.setScriptsEnabled(false);
      await page.setTextScale(200);
      await page.goto(classUrl(site.origin, "pt-br", "necromancer"));
      await pause(300);
      const noJs200 = await page.evaluate<{ scripting: boolean; words: { broken: number; fragments: number; names: number } | null; overflow: boolean }>(`(() => {
        const root = ${ROOT};
        const section = document.querySelector('section#skills');
        return { scripting: matchMedia('(scripting: enabled)').matches, words: ${WORDS("root")}, overflow: !!section && section.scrollWidth > section.clientWidth };
      })()`);
      check("no-JS pt-br necromancer @320 200%: scripting is off in the page", !noJs200.scripting);
      check("no-JS pt-br necromancer @320 200%: zero broken words and fragments (CSS floor)", !!noJs200.words && noJs200.words.broken === 0 && noJs200.words.fragments === 0, json(noJs200.words));
      check("no-JS pt-br necromancer @320 200%: the section does not overflow", !noJs200.overflow);
      await page.setTextScale(100);
      await page.setScriptsEnabled(true);
      page.drainConsole();
    }

    // -----------------------------------------------------------------------
    console.log("\nC12 · without JavaScript, and the pre-hydration render with it");
    // -----------------------------------------------------------------------
    for (const locale of LOCALES) {
      page.close();
      page = await Page.launch();
      await page.setViewport(320, 640, true);
      await page.setScriptsEnabled(false);
      await page.goto(classUrl(site.origin, locale, "sorceress"));
      await pause(300);
      const noJs = await page.evaluate<{ scripting: boolean; ready: boolean; visible: string[]; tabs: { role: string | null; href: string | null }[]; level: number; tabRoles: number; tracks: number[]; overflow: boolean; nodes: number }>(`({
        scripting: matchMedia('(scripting: enabled)').matches,
        ready: !!${READY},
        visible: ${VISIBLE_TREES},
        tabs: [...document.querySelectorAll('nav[data-tree-tabs] a')].map((a) => ({ role: a.getAttribute('role'), href: a.getAttribute('href') })),
        level: document.querySelectorAll('form[data-level]').length,
        tabRoles: document.querySelectorAll('[role="tab"], [role="tablist"]').length,
        tracks: [...document.querySelectorAll('[role="grid"]')].map((g) => getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length),
        overflow: (() => { const s = document.querySelector('section#skills'); return !!s && s.scrollWidth > s.clientWidth; })(),
        nodes: document.querySelectorAll('a[data-node][href]').length,
      })`);
      check(`${locale} no-JS @320: (scripting: enabled) is false`, !noJs.scripting);
      check(`${locale} no-JS @320: the island never mounted`, !noJs.ready);
      check(`${locale} no-JS @320: all three trees are visible, stacked`, noJs.visible.length === 3, noJs.visible.join());
      check(`${locale} no-JS @320: the tab control is three plain links`, noJs.tabs.length === 3 && noJs.tabs.every((tb) => tb.role === null && !!tb.href?.startsWith("#")) && noJs.tabRoles === 0, json(noJs.tabs));
      check(`${locale} no-JS @320: no level control`, noJs.level === 0);
      check(`${locale} no-JS @320: three columns and no overflow, 30 links`, noJs.tracks.every((n) => n === 3) && !noJs.overflow && noJs.nodes === 30, json({ tracks: noJs.tracks, overflow: noJs.overflow, nodes: noJs.nodes }));
      const target = routes(locale).skill("sorceress" as Slug, "ice-bolt" as Slug);
      await clickAt(page, NODE("ice-bolt"));
      const navigated = await page.waitFor(`location.pathname === ${json(target)}`, 10_000);
      check(`${locale} no-JS @320: clicking a node navigates to the skill page`, navigated, await page.evaluate<string>(`location.pathname`));
      await page.setScriptsEnabled(true);
      page.drainConsole();

      // With scripts, after load: the island is up and one tree is visible.
      await load(page, classUrl(site.origin, locale, "sorceress"));
      const withJs = await page.evaluate<{ ready: boolean; visible: string[]; scripting: boolean }>(`({ ready: !!${READY}, visible: ${VISIBLE_TREES}, scripting: matchMedia('(scripting: enabled)').matches })`);
      check(`${locale} JS @320: (scripting: enabled) is true and the island mounted`, withJs.scripting && withJs.ready);
      check(`${locale} JS @320: exactly one tree visible after load`, withJs.visible.length === 1, withJs.visible.join());
      clean(page, `${locale} no-JS/JS`);
    }

    // -----------------------------------------------------------------------
    console.log("\nC15 · reduced motion");
    // -----------------------------------------------------------------------
    {
      await page.setViewport(1280, 800, false);
      await page.setReducedMotion(false);
      await load(page, classUrl(site.origin, "en-us", "sorceress"));
      const durations = `(() => { const n = ${NODE("ice-bolt")}; const p = document.querySelector('[data-edge]'); return { reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, node: n ? getComputedStyle(n).transitionDuration : null, piece: p ? getComputedStyle(p).transitionDuration : null, line: p && p.querySelector('line') ? getComputedStyle(p.querySelector('line')).transitionDuration : null }; })()`;
      const normal = await page.evaluate<{ reduced: boolean; node: string | null; piece: string | null; line: string | null }>(durations);
      check("without the preference the node has a colour transition (control)", !normal.reduced && !!normal.node && normal.node !== "0s", json(normal));
      await page.setReducedMotion(true);
      await pause(100);
      const reduced = await page.evaluate<{ reduced: boolean; node: string | null; piece: string | null; line: string | null }>(durations);
      check("with reduce: the node's transitionDuration is 0s", reduced.reduced && reduced.node === "0s", json(reduced));
      check("with reduce: the connector piece's transitionDuration is 0s", reduced.piece === "0s" && (reduced.line === null || reduced.line === "0s"), json(reduced));
      await page.setReducedMotion(false);
      clean(page, "reduced motion");
    }

    // -----------------------------------------------------------------------
    console.log("\nCLS · arriving by #skills at 320 and 390");
    // -----------------------------------------------------------------------
    {
      page.close();
      page = await Page.launch();
      await page.addInitScript(`
        window.__cls = 0;
        new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
          .observe({ type: 'layout-shift', buffered: true });
      `);
      for (const locale of LOCALES) {
        for (const [label, url] of [
          ["sorceress class", classUrl(site.origin, locale, "sorceress", "#skills")],
          ["blizzard build", buildUrl(site.origin, locale, "sorceress", "blizzard-sorceress", "#skills")],
        ] as const) {
          for (const width of [320, 390] as const) {
            await page.setViewport(width, VIEWPORTS[width], true);
            await page.goto("about:blank");
            const ready = await load(page, url);
            // The fragment scroll is smooth (~1.6s on a page this long) and
            // starts on its own schedule: the first loads of a fresh browser
            // once read the section at its unscrolled top after 600ms while
            // the same URL a moment later read 104px. So wait for the scroll
            // to have moved and then to hold still — three equal readings,
            // as the locale-switch gate does — before reading anything.
            let settled = [0, 0, 0];
            for (let i = 0; i < 30; i++) {
              await pause(150);
              const y = await page.evaluate<number>(`Math.round(window.scrollY)`);
              settled = [settled[1], settled[2], y];
              if (y > 0 && settled[0] === settled[1] && settled[1] === settled[2]) break;
            }
            await pause(300);
            const cls = await page.evaluate<number>(`Math.round(window.__cls * 1000) / 1000`);
            const landed = await page.evaluate<number>(`(() => { const s = document.querySelector('section#skills'); return s ? Math.round(s.getBoundingClientRect().top) : -1; })()`);
            check(`${locale} ${label} @${width}: island ready and #skills near the top (${landed}px)`, ready && landed >= -2 && landed <= 120, `${landed}`);
            check(`${locale} ${label} @${width}: CLS ${cls} < ${CLS_LIMIT}`, cls < CLS_LIMIT, `scored ${cls}`);
            clean(page, `${locale} ${label} @${width} CLS`);
          }
        }
      }
    }
  } finally {
    page.close();
    site.stop();
  }

  console.log(
    failures.length === 0
      ? `\n${passed} checks passed.`
      : `\n${failures.length} FAILED of ${passed + failures.length}:`,
  );
  if (failures.length > 0) {
    failures.forEach((f) => console.error(`  x ${f}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
