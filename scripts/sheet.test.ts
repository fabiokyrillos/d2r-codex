/**
 * The mobile sheet's modal contract, and the desktop panel's non-modal one.
 *
 * The sheet lays a scrim over the page that swallows every pointer event, and
 * it declared `aria-modal="false"` while doing so. That told assistive
 * technology the page behind was still available when a mouse user could not
 * reach it, and left Tab free to walk into content hidden behind the scrim —
 * two different answers to the same question depending on how you were reading
 * the page.
 *
 * Three layers here, because none of them alone is enough:
 *
 *   1. `trapTarget` exercised directly — the Tab and Shift+Tab decisions,
 *      including the cases a browser session is unlikely to reach.
 *   2. The component source, for the wiring the pure function cannot see:
 *      which element is modal, what receives focus, what happens on close.
 *   3. The built HTML, for what ships when JavaScript has not run.
 *
 * There is no DOM test runner in this project, so the live behaviours — focus
 * actually moving, Escape actually closing — are verified in a browser and
 * recorded in the commit rather than asserted here. That limitation is real and
 * stated rather than papered over.
 *
 * Requires `npm run build`. Run with `npm run test:sheet`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { CLASSES_WITH_SKILL_PAGES } from "../lib/skills";

import { trapTarget } from "../lib/focus-trap";
import { isScrollLocked, lockScroll } from "../lib/scroll-lock";
import { LOCALES } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";

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

// ===========================================================================
console.log("\nTab and Shift+Tab are contained");
// ===========================================================================
// Four focusables: close button, then three links in the panel body.
const N = 4;
check("Tab from the last item wraps to the first", trapTarget(N, N - 1, false) === 0);
check("Shift+Tab from the first item wraps to the last", trapTarget(N, 0, true) === N - 1);
check("Tab in the interior is left to the browser", trapTarget(N, 1, false) === null);
check("Shift+Tab in the interior is left to the browser", trapTarget(N, 2, true) === null);
check("Tab from the first item is left to the browser", trapTarget(N, 0, false) === null);
check("Shift+Tab from the last item is left to the browser", trapTarget(N, N - 1, true) === null);

// Focus that escaped — a click on the scrim, or a browser quirk — is pulled back.
check("Tab with focus outside enters at the first item", trapTarget(N, -1, false) === 0);
check("Shift+Tab with focus outside enters at the last item", trapTarget(N, -1, true) === N - 1);
check("an index past the end is treated as outside", trapTarget(N, N + 5, false) === 0);

// A single focusable traps onto itself rather than escaping.
check("one focusable: Tab stays on it", trapTarget(1, 0, false) === 0);
check("one focusable: Shift+Tab stays on it", trapTarget(1, 0, true) === 0);

// An empty modal must not trap; that would strand the user with nowhere to go.
check("an empty modal does not trap Tab", trapTarget(0, -1, false) === null);
check("an empty modal does not trap Shift+Tab", trapTarget(0, -1, true) === null);
check("a negative count does not trap", trapTarget(-1, 0, false) === null);

// Anti-vacuity: the function must actually be capable of returning a target.
check(
  "control: trapTarget does return targets, so the nulls above mean something",
  [trapTarget(N, N - 1, false), trapTarget(N, 0, true), trapTarget(N, -1, false)].every(
    (t) => t !== null,
  ),
);

// ===========================================================================
console.log("\nThe component wires it up");
// ===========================================================================
/*
 * Comments are stripped first. They explain what the code used to do — this
 * file's own history is written into them — and a rule that matched prose would
 * report the explanation of a fixed defect as the defect.
 */
const src = readFileSync(
  join(process.cwd(), "components", "game", "skill-tree-interactive.tsx"),
  "utf8",
)
  .replace(/\/\*[\s\S]*?\*\//g, " ")
  .replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");

const sheetBlock = src.slice(src.indexOf('role="dialog"'), src.indexOf('role="dialog"') + 700);
check("the sheet declares itself modal", /aria-modal="true"/.test(sheetBlock));
check("no element still declares aria-modal=\"false\"", !src.includes('aria-modal="false"'));
check("the sheet is only rendered while open", /\{sheetOpen && selected && \(/.test(src));
check("the sheet carries an accessible name", /aria-label=\{strings\.panelHeading\}/.test(sheetBlock));
check("the sheet takes focus when it opens", /focusablesIn\(sheet\)\[0\]/.test(src));
check("Tab is routed through trapTarget", /trapTarget\(/.test(src));
check("the trap listens in the capture phase", /addEventListener\("keydown", onKey, true\)/.test(src));
check("the trap is removed when the sheet closes", /removeEventListener\("keydown", onKey, true\)/.test(src));
check("Escape closes and returns focus", /e\.key === "Escape"[\s\S]{0,120}close\(true\)/.test(src));
check("the scrim closes and returns focus", /onClick=\{\(\) => close\(true\)\}/.test(src));
check("closing restores focus to the tile", /lastTrigger\.current\.focus\(\)/.test(src));

// The desktop panel must NOT become modal in the process.
const asideBlock = src.slice(src.indexOf("<aside"), src.indexOf("</aside>"));
check("the desktop panel is a region, not a dialog", /role="region"/.test(asideBlock));
check("the desktop panel is not modal", !/aria-modal/.test(asideBlock));
check("the desktop panel has no scrim", !/inset-0/.test(asideBlock));
check(
  "the trap declines to run while the sheet is not laid out",
  /getClientRects\(\)\.length === 0/.test(src),
);
check("the sheet and its scrim are both hidden above lg", (sheetBlock.match(/lg:hidden/g) ?? []).length >= 1);

// ===========================================================================
console.log("\nThe page is held still while the sheet is open");
// ===========================================================================
{
  // -- the bookkeeping, exercised directly --------------------------------
  const target = () => ({ style: { overflow: "" } });

  {
    const el = target();
    const release = lockScroll(el);
    check("opening locks the document", el.style.overflow === "hidden");
    check("and the lock is recorded", isScrollLocked(el));
    release();
    check("releasing restores the previous value", el.style.overflow === "");
    check("and the lock is gone", !isScrollLocked(el));
  }

  // The requirement that makes this a restore rather than a reset: whatever was
  // there before comes back, not a hardcoded default.
  {
    const el = { style: { overflow: "clip" } };
    const release = lockScroll(el);
    check("an existing inline overflow is replaced while locked", el.style.overflow === "hidden");
    release();
    check("and the exact previous inline value is put back", el.style.overflow === "clip");
  }

  // Release is what runs on close, on Escape, and on unmount alike — it is one
  // cleanup — so the interesting case is running it more than once.
  {
    const el = target();
    const release = lockScroll(el);
    release();
    el.style.overflow = "scroll"; // something else takes over
    release();
    check("a second release is a no-op and does not clobber", el.style.overflow === "scroll");
  }

  // Two locks on one target: the leak this counter exists to prevent.
  {
    const el = target();
    const first = lockScroll(el);
    const second = lockScroll(el);
    first();
    check("one release of two leaves the page locked", el.style.overflow === "hidden");
    second();
    check("the last release restores it", el.style.overflow === "");
    check("and nothing is still held", !isScrollLocked(el));
  }

  // Releasing out of order must not strand the page either.
  {
    const el = target();
    const first = lockScroll(el);
    const second = lockScroll(el);
    second();
    first();
    check("releasing out of order still restores", el.style.overflow === "");
  }

  // A negative control: without the lock the value never changes, so the
  // assertions above are reading something this file actually does.
  {
    const el = target();
    check("an untouched target keeps its overflow", el.style.overflow === "" && !isScrollLocked(el));
  }

  // -- the component wiring the pure function cannot see -------------------
  check("the sheet effect locks the document body", /lockScroll\(document\.body\)/.test(src));
  check("and releases it in the same cleanup", /return \(\) => \{[\s\S]{0,200}unlock\(\);/.test(src));

  /*
   * The desktop guard has to come first, or the docked panel locks the page it
   * does not cover. Compared by index rather than trusted: this is the one
   * ordering in the effect that is load-bearing.
   */
  const guardAt = src.indexOf("getClientRects().length === 0");
  const lockAt = src.indexOf("lockScroll(document.body)");
  check(
    "the lock is taken after the desktop guard, so the panel never locks",
    guardAt !== -1 && lockAt !== -1 && guardAt < lockAt,
    `guard at ${guardAt}, lock at ${lockAt}`,
  );
  check(
    "the lock lives in the sheet effect, not the Escape effect",
    /if \(!sheetOpen \|\| !selected\) return;[\s\S]{0,900}lockScroll\(document\.body\)/.test(src),
  );
  check("the desktop panel never locks anything", !/lockScroll/.test(asideBlock));
}

// ===========================================================================
console.log("\nWhat ships before JavaScript runs");
// ===========================================================================
const root = assertFreshBuild();

for (const locale of LOCALES) {
  const t = dictionaryFor(locale).skills;
  /*
   * Class pages come from the graph, so a class added later cannot ship without
   * this gate having read it. The build page stays named: it is the sheet on a
   * page that carries a plan, and any one build proves that.
   */
  const targets: [string, string][] = [
    ...CLASSES_WITH_SKILL_PAGES.map(
      (cls) => [`${cls} class page`, join(root, locale, "classes", `${cls}.html`)] as [string, string],
    ),
    ["build page", join(root, locale, "builds", "paladin", "hammerdin.html")],
  ];
  for (const [label, file] of targets) {
    if (!existsSync(file)) {
      check(`${locale} ${label} exists`, false, file);
      continue;
    }
    const html = readFileSync(file, "utf8");
    // A closed sheet must leave nothing for a screen reader to find.
    check(`${locale} ${label}: no dialog in the initial HTML`, !html.includes('role="dialog"'));
    check(`${locale} ${label}: no aria-modal in the initial HTML`, !html.includes("aria-modal"));
    // The docked panel is present and is a region.
    check(`${locale} ${label}: the docked panel ships as a region`, html.includes('role="region"'));
    // The close control and the call to action are real, translated strings.
    check(`${locale} ${label}: the close label is translated`, t.closePanel.length > 0);
    check(`${locale} ${label}: the panel's call to action is present`, html.includes(t.fullPage.replace(" →", "")));
  }
}

check(
  "the two locales word the close control differently",
  dictionaryFor("en-us").skills.closePanel !== dictionaryFor("pt-br").skills.closePanel,
);

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
