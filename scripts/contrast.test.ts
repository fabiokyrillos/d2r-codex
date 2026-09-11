/**
 * Contrast on the skill tree (R-A11Y-5, plan §5.8, C14).
 *
 * Text ≥ 4.5:1, frames, connectors and pills ≥ 3:1 — and the states never
 * distinguished by colour alone, which is why the frame of every state is
 * measured against the surface it sits on and not only against each other.
 *
 * Everything is computed from the tokens in `app/globals.css` and from the
 * class strings the node component actually wears, rather than from numbers
 * copied into the test, so changing a token or a class fails this rather than
 * silently invalidating it. The component is read only if it exists
 * (review LOW-1): a renamed or missing file is a red check here, not a crash
 * before the first line of output.
 *
 * The rest of the site legitimately uses `ink-subtle` on non-text; the tree's
 * text may not, and the served nodes are read to prove the page agrees with
 * the maths.
 *
 * Run with `npm run test:contrast`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { LOCALES } from "../lib/i18n/config";
import { CLASSES_WITH_SKILL_PAGES } from "../lib/skills";
import { NODE_STATES, type NodeState } from "../lib/skill-tree-data-pure";

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

/** Read a source file for a check, never at module top: absent is a red line. */
function source(rel: string): string {
  const path = join(process.cwd(), rel);
  const present = existsSync(path);
  check(`${rel} exists`, present, path);
  return present ? readFileSync(path, "utf8") : "";
}

// --- tokens, read from the stylesheet --------------------------------------
const css = source("app/globals.css");
const TOKENS: Record<string, string> = {};
for (const m of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) TOKENS[m[1]] = m[2];
check("tokens were parsed from globals.css", Object.keys(TOKENS).length > 8, `${Object.keys(TOKENS).length}`);
const token = (name: string): string => {
  if (!TOKENS[name]) {
    check(`token ${name} exists`, false);
    return "#000000";
  }
  return TOKENS[name];
};

type RGB = [number, number, number];
const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const luminance = (c: RGB) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const contrast = (a: RGB, b: RGB) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** Alpha compositing: what the eye actually receives through `opacity` or a `/NN` tint. */
const over = (fg: RGB, bg: RGB, alpha: number): RGB =>
  [0, 1, 2].map((i) => Math.round(fg[i] * alpha + bg[i] * (1 - alpha))) as RGB;
const ratio = (fg: string, bg: string) => contrast(hex(fg), hex(bg));

const AA = 4.5;
const NON_TEXT = 3;

// --- the four states, read from the node component ---------------------------
const GRID = "components/game/skill-tree-grid.tsx";
const gridSrc = source(GRID);
const start = gridSrc.indexOf("const stateStyle");
const stateBlock = start >= 0 ? gridSrc.slice(start, gridSrc.indexOf("};", start)) : "";
const styleFor: Partial<Record<NodeState, string>> = {};
for (const m of stateBlock.matchAll(/["']?([a-z-]+)["']?:\s*"([^"]*)"/g)) styleFor[m[1] as NodeState] = m[2];
check(`${GRID} styles all four NodeStates`, NODE_STATES.every((s) => styleFor[s] !== undefined), NODE_STATES.filter((s) => styleFor[s] === undefined).join(", "));

/** `opacity-55` → 0.55. Anything the node body inherits changes the maths. */
const opacityOf = (cls: string) => {
  const m = cls.match(/\bopacity-(\d{1,3})\b/);
  return m ? Number(m[1]) / 100 : 1;
};
const bgOf = (cls: string) => cls.match(/\bbg-(surface(?:-raised)?|abyss)\b/)?.[1] ?? null;
const frameOf = (cls: string) => cls.match(/\bborder-(ink-subtle|ink-muted|ink|ember(?:-bright|-dim)?|border(?:-strong)?)\b/)?.[1] ?? null;

// ===========================================================================
console.log("\nThe node, state by state (plan §5.8)");
// ===========================================================================
/*
 * The name is `ink` on every state but locked, where it is `ink-muted`; the
 * frame is `ink-subtle` when available or locked and `ember` when invested or
 * maxed; the background is opaque `surface` in every state. Each pair is
 * measured against the background the class string names, so a state that
 * moved to `surface-raised` or gained an opacity would be re-judged here.
 */
for (const state of NODE_STATES) {
  const cls = styleFor[state] ?? "";
  const bg = bgOf(cls);
  check(`${state}: the node names an opaque background`, bg !== null, cls);
  const frame = frameOf(cls);
  check(`${state}: the node names a frame token`, frame !== null, cls);
  if (!bg || !frame) continue;
  const alpha = opacityOf(cls);
  const name = state === "locked" ? "ink-muted" : "ink";
  const nameRatio = contrast(over(hex(token(name)), hex(token(bg)), alpha), hex(token(bg)));
  check(`${state}: name (${name}) on ${bg} ≥ ${AA}:1`, nameRatio >= AA, `${nameRatio.toFixed(2)}:1`);
  const frameRatio = contrast(over(hex(token(frame)), hex(token(bg)), alpha), hex(token(bg)));
  check(`${state}: frame (${frame}) on ${bg} ≥ ${NON_TEXT}:1`, frameRatio >= NON_TEXT, `${frameRatio.toFixed(2)}:1`);
  check(`${state}: the frame is the token §5.8 names`,
    state === "available" || state === "locked" ? frame === "ink-subtle" : frame === "ember", frame);
}

// ===========================================================================
console.log("\nCounter, connectors, rail, tabs, legend, level control");
// ===========================================================================
for (const [label, fg, bg, floor] of [
  ["counter pill: abyss on ember", token("abyss"), token("ember"), AA],
  ["counter pill (maxed, chamfered): abyss on ember", token("abyss"), token("ember"), AA],
  ["connector: ink-subtle on abyss", token("ink-subtle"), token("abyss"), NON_TEXT],
  ["related connector: ember on abyss", token("ember"), token("abyss"), NON_TEXT],
  ["rail level: ink-muted on abyss", token("ink-muted"), token("abyss"), AA],
  ["tree hint / theme: ink-muted on abyss", token("ink-muted"), token("abyss"), AA],
  ["tab name (resting): ink on surface", token("ink"), token("surface"), AA],
  ["legend title: ink on surface-raised", token("ink"), token("surface-raised"), AA],
  ["legend body: ink-muted on surface-raised", token("ink-muted"), token("surface-raised"), AA],
  ["level control label: ink-muted on abyss", token("ink-muted"), token("abyss"), AA],
  ["name bar (glyph mode): ink-muted on abyss", token("ink-muted"), token("abyss"), AA],
] as [string, string, string, number][]) {
  const r = ratio(fg, bg);
  check(`${label} ≥ ${floor}:1`, r >= floor, `${r.toFixed(2)}:1`);
}
// The pressed tab: ember-bright over a 10 % ember-dim tint of the surface.
{
  const tint = over(hex(token("ember-dim")), hex(token("surface")), 0.1);
  const r = contrast(hex(token("ember-bright")), tint);
  check(`tab name (pressed): ember-bright on ember-dim/10 over surface ≥ ${AA}:1`, r >= AA, `${r.toFixed(2)}:1`);
  const frame = contrast(hex(token("ember")), tint);
  check(`tab frame (pressed): ember on the tinted surface ≥ ${NON_TEXT}:1`, frame >= NON_TEXT, `${frame.toFixed(2)}:1`);
}
// The locked sigil at 45 % is not text; the padlock is drawn in the name's ink.
{
  const r = contrast(over(hex(token("ink-muted")), hex(token("surface")), 1), hex(token("surface")));
  check(`padlock (ink-muted) on surface ≥ ${NON_TEXT}:1`, r >= NON_TEXT, `${r.toFixed(2)}:1`);
}

// ===========================================================================
console.log("\nThe panel, the sheet and the focus ring");
// ===========================================================================
for (const [label, fg, bg] of [
  ["panel body on surface-raised", token("ink-muted"), token("surface-raised")],
  ["panel heading on surface-raised", token("ink-muted"), token("surface-raised")],
  ["panel name on surface-raised", token("ink"), token("surface-raised")],
  ["bottom sheet text on surface-raised", token("ink-muted"), token("surface-raised")],
  ["panel call to action (ember)", token("ember"), token("surface-raised")],
  ["panel link (ember-bright)", token("ember-bright"), token("surface-raised")],
] as [string, string, string][]) {
  const r = ratio(fg, bg);
  check(`${label} reaches ${AA}:1`, r >= AA, `${r.toFixed(2)}:1`);
}
// Non-text: the focus ring must be distinguishable from what it sits on.
for (const bg of ["surface", "surface-raised", "abyss"]) {
  const r = ratio(token("ember"), token(bg));
  check(`focus ring (ember) on ${bg} reaches ${NON_TEXT}:1`, r >= NON_TEXT, `${r.toFixed(2)}:1`);
}

// ===========================================================================
console.log("\nThe failing token stays off the tree's text");
// ===========================================================================
/*
 * `ink-subtle` is 3.99:1 on `surface`: a frame, a connector, never text. The
 * node and the legend print no text in it; the tab's short points line
 * ("47/200", `font-mono text-xs`) is text and is held to the same floor.
 */
for (const f of ["components/game/skill-tree-grid.tsx", "components/game/skill-tree-legend.tsx", "components/game/skill-tree-panel.tsx", "components/game/skill-sigil.tsx"]) {
  const src = source(f);
  check(`${f} does not use text-ink-subtle`, src.length > 0 && !src.includes("text-ink-subtle"));
}
{
  const tabs = source("components/game/skill-tree-tabs.tsx");
  const pointsClass = tabs.match(/data-tab-points=""[^>]*className="([^"]*)"/)?.[1] ?? "";
  const tokenName = pointsClass.match(/\btext-(ink(?:-muted|-subtle)?|ember(?:-bright)?)\b/)?.[1] ?? null;
  check("the tab's points line names a text token", tokenName !== null, pointsClass);
  if (tokenName) {
    const r = ratio(token(tokenName), token("surface"));
    check(`tab points (${tokenName}) on surface ≥ ${AA}:1 — text-xs is normal-size text`, r >= AA, `${r.toFixed(2)}:1`);
  }
}
// Control: ink-subtle really would fail as text, and really does pass as a frame.
{
  const r = ratio(token("ink-subtle"), token("surface"));
  check("control: ink-subtle as text would fail on surface", r < AA, `${r.toFixed(2)}:1`);
  check("control: ink-subtle as a frame passes on surface", r >= NON_TEXT, `${r.toFixed(2)}:1`);
}

// ===========================================================================
console.log("\nAs rendered, in both locales");
// ===========================================================================
const root = assertFreshBuild();
const textTokenOf = (cls: string) => cls.match(/\btext-(ink(?:-muted|-subtle)?|ember(?:-bright|-dim)?)\b/)?.[1] ?? null;
for (const locale of LOCALES) {
  const targets: [string, string][] = [
    ...CLASSES_WITH_SKILL_PAGES.map((cls) => [`${cls} class page`, join(root, locale, "classes", `${cls}.html`)] as [string, string]),
    ["build page", join(root, locale, "builds", "paladin", "hammerdin.html")],
  ];
  for (const [label, file] of targets) {
    if (!existsSync(file)) {
      check(`${locale} ${label} exists`, false, file);
      continue;
    }
    const html = readFileSync(file, "utf8");
    // Scoped to the nodes: the rest of the page legitimately uses `ink-subtle`.
    const nodes = [...html.matchAll(/<a[^>]*data-node="[a-z0-9-]+"[^>]*>[\s\S]*?<\/a>/g)].map((m) => m[0]);
    check(`${locale} ${label}: 30 nodes were found`, nodes.length === 30, `${nodes.length}`);
    check(`${locale} ${label}: no node text uses ink-subtle`, nodes.length > 0 && nodes.every((n) => !n.includes("text-ink-subtle")));
    const names = nodes.map((n) => n.match(/class="([^"]*\btree-name\b[^"]*)"/)?.[1] ?? "");
    check(`${locale} ${label}: every node's name is printed in ink`, names.length === 30 && names.every((c) => textTokenOf(c) === "ink"), [...new Set(names.map(textTokenOf))].join(", "));
    // The backgrounds and frames the maths assumed are the ones the page sets.
    const available = styleFor.available ?? "";
    check(`${locale} ${label}: an available node wears the class string the maths read (${available})`,
      available.length > 0 && nodes.some((n) => available.split(/\s+/).every((c) => (n.match(/<a[^>]*class="([^"]*)"/)?.[1] ?? "").split(/\s+/).includes(c))));
    if (label === "build page") {
      const pill = html.match(/data-points=""[^>]*class="([^"]*)"/)?.[1] ?? "";
      check(`${locale} ${label}: the counter is printed in a token the maths covered`, /\b(text-abyss|text-ink-muted|text-ink)\b/.test(pill), pill);
      const tabPoints = [...html.matchAll(/data-tab-points=""[^>]*class="([^"]*)"/g)].map((m) => textTokenOf(m[1]));
      check(`${locale} ${label}: the three tab point lines name a text token`, tabPoints.length === 3 && tabPoints.every((tk) => tk !== null), tabPoints.join(", "));
      for (const tk of new Set(tabPoints)) {
        if (!tk) continue;
        const r = ratio(token(tk), token("surface"));
        check(`${locale} ${label}: tab points as served (${tk}) on surface ≥ ${AA}:1`, r >= AA, `${r.toFixed(2)}:1`);
      }
    }
  }
}

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
