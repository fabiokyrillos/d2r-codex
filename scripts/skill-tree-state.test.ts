/**
 * The interaction state of the skill-tree section, one rule per check.
 *
 * `lib/skill-tree-state.ts` is where the PRD's interaction promises are
 * decided: a hover previews without touching the confirmed selection
 * (R-TREE-11), a second tap on the selected node never closes the sheet
 * (R-TREE-12), the live region is written on confirmation only and never on
 * focus (R-TREE-14), touch never produces a preview (R-TREE-11's `(hover:
 * hover)` gate). Each is asserted here on the reducer, in isolation, so a
 * browser gate that later sees the behaviour is confirming wiring, not
 * discovering policy. Plan §5.3, C21; mutations M8, M10, M18.
 *
 * Every rule has a control beside it — the thing that must *not* change — so
 * a reducer that returns a plausible new state for the wrong reason is caught.
 *
 * Run with `npm run test:tree-state`.
 */
import { dictionaryFor } from "../lib/i18n";
import { LOCALES } from "../lib/i18n/config";
import { NODE_STATES, type NodeState } from "../lib/skill-tree-data-pure";
import {
  initialState,
  reduce,
  shownSlug,
  type TreeEvent,
  type TreeUiContext,
  type TreeUiState,
} from "../lib/skill-tree-state";

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

const same = (a: TreeUiState, b: TreeUiState) => JSON.stringify(a) === JSON.stringify(b);
const show = (s: TreeUiState) => JSON.stringify(s);

// The real templates, so the announcement is worded the way the dictionary
// words it — a hand-written template here would pass with a reducer that
// ignored the context.
const ctxFor = (locale: (typeof LOCALES)[number], over: Partial<TreeUiContext> = {}): TreeUiContext => {
  const t = dictionaryFor(locale).skills;
  return {
    hoverCapable: true,
    wide: false,
    announceTemplate: t.announceSelected,
    stateLabels: {
      locked: t.stateLocked,
      available: t.stateAvailable,
      invested: t.stateInvested,
      maxed: t.stateMaxed,
    },
    ...over,
  };
};
const desktop = ctxFor("en-us", { hoverCapable: true, wide: true });
const phone = ctxFor("en-us", { hoverCapable: false, wide: false });
const laptop = ctxFor("en-us", { hoverCapable: true, wide: false });

const activate = (slug: string, state: NodeState = "available"): TreeEvent => ({
  type: "activate",
  slug,
  name: slug.replace(/-/g, " "),
  state,
});

// ===========================================================================
console.log("\nInitial state");
// ===========================================================================

{
  const s = initialState("cold-spells");
  check("starts on the given tree with nothing selected, previewed, open or announced",
    same(s, { activeTree: "cold-spells", selected: null, preview: null, sheetOpen: false, announce: null }),
    show(s));
  check("shownSlug is null when nothing is selected or previewed", shownSlug(s) === null);
}

// ===========================================================================
console.log("\nHover previews, and only with (hover: hover)");
// ===========================================================================

{
  const s0 = initialState("cold-spells");
  const s1 = reduce(s0, { type: "hover-in", slug: "ice-blast" }, laptop);
  check("hover-in sets the preview on a hover-capable device", s1.preview === "ice-blast", show(s1));
  check("hover-in does not select (control for M8)", s1.selected === null, show(s1));
  check("hover-in opens nothing and announces nothing", !s1.sheetOpen && s1.announce === null, show(s1));
  check("shownSlug follows the preview", shownSlug(s1) === "ice-blast");

  const s2 = reduce(s1, { type: "hover-out" }, laptop);
  check("hover-out clears the preview", s2.preview === null, show(s2));
  check("hover-out leaves the rest as it was", same(s2, s0), show(s2));

  // Touch: the gate is the context, not the event — the same event must be inert.
  const t1 = reduce(s0, { type: "hover-in", slug: "ice-blast" }, phone);
  check("without hover capability, hover-in changes nothing at all (control for M9)", same(t1, s0), show(t1));
  check("and shownSlug stays null on touch", shownSlug(t1) === null);
}

// Hover over a confirmed selection previews the other node and restores on leave.
{
  const sel = reduce(initialState("cold-spells"), activate("blizzard", "maxed"), laptop);
  const consumed = reduce(sel, { type: "announced" }, laptop);
  const hov = reduce(consumed, { type: "hover-in", slug: "ice-blast" }, laptop);
  check("hovering another node while one is selected previews it", shownSlug(hov) === "ice-blast", show(hov));
  check("the selection is untouched by the hover", hov.selected === "blizzard" && hov.sheetOpen === consumed.sheetOpen, show(hov));
  check("a hover writes no announcement", hov.announce === null, show(hov));
  const back = reduce(hov, { type: "hover-out" }, laptop);
  check("leaving restores the confirmed selection in the panel", shownSlug(back) === "blizzard" && same(back, consumed), show(back));
}

// ===========================================================================
console.log("\nFocus previews and never announces");
// ===========================================================================

{
  const s0 = initialState("cold-spells");
  const f1 = reduce(s0, { type: "focus", slug: "frost-nova" }, phone);
  check("focus sets the preview, on any device", f1.preview === "frost-nova", show(f1));
  check("focus does not select, open or announce (control for M10)",
    f1.selected === null && !f1.sheetOpen && f1.announce === null, show(f1));
  const f2 = reduce(f1, { type: "focus", slug: "ice-blast" }, phone);
  check("moving focus moves the preview", f2.preview === "ice-blast" && f2.announce === null, show(f2));
  const b = reduce(f2, { type: "blur" }, phone);
  check("blur clears the preview and nothing else", same(b, s0), show(b));

  // Four arrow moves over a selection: the announcement stays null throughout.
  const sel = reduce(reduce(s0, activate("ice-bolt"), phone), { type: "announced" }, phone);
  const after = ["ice-blast", "glacial-spike", "blizzard", "frozen-orb"].reduce(
    (s, slug) => reduce(s, { type: "focus", slug }, phone),
    sel,
  );
  check("four focus moves after a selection write nothing to announce", after.announce === null, show(after));
  check("and keep the selection", after.selected === "ice-bolt" && after.sheetOpen, show(after));
}

// ===========================================================================
console.log("\nActivate confirms, opens the sheet below lg, and announces");
// ===========================================================================

{
  const s0 = initialState("cold-spells");
  const a = reduce(s0, activate("blizzard", "maxed"), phone);
  check("activate selects the node", a.selected === "blizzard", show(a));
  check("activate clears any preview", a.preview === null, show(a));
  check("activate opens the sheet when the panel is not docked", a.sheetOpen === true, show(a));
  check("activate announces '{skill} selected. {state}.' with both filled",
    a.announce === "blizzard selected. Maxed.", String(a.announce));
  check("shownSlug is the selection once previews are cleared", shownSlug(a) === "blizzard");
  check("activeTree is untouched by activate", a.activeTree === "cold-spells");

  const d = reduce(s0, activate("blizzard", "maxed"), desktop);
  check("from lg up, activate never opens a sheet", d.sheetOpen === false && d.selected === "blizzard", show(d));

  const p = reduce(reduce(s0, { type: "focus", slug: "ice-blast" }, phone), activate("ice-blast", "invested"), phone);
  check("activating the previewed node keeps it shown and drops the preview",
    p.preview === null && shownSlug(p) === "ice-blast", show(p));

  // The four state labels each reach the announcement.
  for (const state of NODE_STATES) {
    const s = reduce(s0, activate("x", state), phone);
    check(`state "${state}" is announced as "${phone.stateLabels[state]}"`,
      s.announce === `x selected. ${phone.stateLabels[state]}.`, String(s.announce));
  }
  for (const locale of LOCALES) {
    const s = reduce(s0, activate("cold-mastery", "available"), ctxFor(locale));
    check(`${locale}: no placeholder survives in the announcement`,
      typeof s.announce === "string" && !/\{[a-z]+\}/i.test(s.announce), String(s.announce));
  }
}

// ===========================================================================
console.log("\nA second activate on the selected node keeps the sheet open");
// ===========================================================================

{
  const first = reduce(initialState("summoning"), activate("clay-golem", "invested"), phone);
  const consumed = reduce(first, { type: "announced" }, phone);
  check("the announcement is consumed once written", consumed.announce === null && consumed.selected === "clay-golem", show(consumed));
  const second = reduce(consumed, activate("clay-golem", "invested"), phone);
  check("the second tap keeps the sheet open (control for M18: no toggle)", second.sheetOpen === true, show(second));
  check("the second tap keeps the selection", second.selected === "clay-golem", show(second));
  check("the second tap announces again — the reader confirmed again",
    second.announce === first.announce && second.announce !== null, show(second));
  check("apart from the announcement, the second tap changes nothing",
    same({ ...second, announce: null }, consumed), show(second));

  // Selecting a different node while the sheet is open swaps the content.
  const other = reduce(consumed, activate("blood-golem", "available"), phone);
  check("activating another node while open keeps the sheet open on the new node",
    other.sheetOpen && other.selected === "blood-golem", show(other));
}

// ===========================================================================
console.log("\nEscape and close");
// ===========================================================================

for (const type of ["escape", "close"] as const) {
  const open = reduce(reduce(initialState("chaos"), activate("apocalypse", "maxed"), phone), { type: "hover-in", slug: "abyss" }, laptop);
  const closed = reduce(open, { type }, phone);
  check(`${type} clears the selection`, closed.selected === null, show(closed));
  check(`${type} clears the preview`, closed.preview === null, show(closed));
  check(`${type} closes the sheet`, closed.sheetOpen === false, show(closed));
  check(`${type} drops any pending announcement`, closed.announce === null, show(closed));
  check(`${type} keeps the active tree (control)`, closed.activeTree === "chaos", show(closed));
  check(`${type} on a clean state is a no-op`, same(reduce(initialState("chaos"), { type }, phone), initialState("chaos")));
}

// ===========================================================================
console.log("\nSwitching trees and consuming the announcement");
// ===========================================================================

{
  const open = reduce(initialState("cold-spells"), activate("blizzard", "maxed"), phone);
  const switched = reduce(open, { type: "switch-tree", tree: "lightning-spells" }, phone);
  check("switch-tree changes the active tree", switched.activeTree === "lightning-spells", show(switched));
  check("switch-tree changes nothing else", same({ ...switched, activeTree: open.activeTree }, open), show(switched));

  const consumed = reduce(open, { type: "announced" }, phone);
  check("announced clears the announcement", consumed.announce === null, show(consumed));
  check("announced changes nothing else", same({ ...consumed, announce: open.announce }, open), show(consumed));
}

// ===========================================================================
console.log("\nPurity");
// ===========================================================================

{
  const s0 = Object.freeze(initialState("cold-spells"));
  const events: TreeEvent[] = [
    { type: "hover-in", slug: "a" }, { type: "hover-out" }, { type: "focus", slug: "a" }, { type: "blur" },
    activate("a"), { type: "escape" }, { type: "close" }, { type: "switch-tree", tree: "t" }, { type: "announced" },
  ];
  let threw = false;
  try {
    for (const e of events) reduce(s0, e, laptop);
  } catch {
    threw = true;
  }
  check("reduce never mutates the state it is given", !threw && same(s0, initialState("cold-spells")));
  check("every event type is covered above", events.length === 9);
}

// ===========================================================================
console.log(
  failures.length === 0
    ? `\n${passed} checks passed.`
    : `\n${failures.length} FAILED of ${passed + failures.length}:`,
);
if (failures.length > 0) {
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
