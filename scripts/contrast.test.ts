/**
 * Text contrast on the skill tree.
 *
 * The state and type line on every tile rendered in `ink-subtle`, which is
 * 3.99:1 on `surface` and 3.75:1 on `surface-raised` — below the 4.5:1 that
 * WCAG 1.4.3 asks of normal-size text, and the line is 11px, nowhere near the
 * large-text exemption. It is the text that carries a tile's state, so it is
 * also the text that keeps the tree from depending on border colour alone.
 *
 * Everything here is computed from the tokens in `app/globals.css` rather than
 * from numbers copied into the test, so changing a token's value fails this
 * rather than silently invalidating it.
 *
 * Run with `npm run test:contrast`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";
import { CLASSES_WITH_SKILL_PAGES } from "../lib/skills";

import { LOCALES } from "../lib/i18n/config";
import { TILE_STATES, type TileState } from "../lib/skills";

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

// --- tokens, read from the stylesheet --------------------------------------
const css = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");
const TOKENS: Record<string, string> = {};
for (const m of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) TOKENS[m[1]] = m[2];

check("tokens were parsed from globals.css", Object.keys(TOKENS).length > 8,
  `${Object.keys(TOKENS).length}`);

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
/** Alpha compositing: what the eye actually receives through `opacity`. */
const over = (fg: RGB, bg: RGB, alpha: number): RGB =>
  [0, 1, 2].map((i) => Math.round(fg[i] * alpha + bg[i] * (1 - alpha))) as RGB;

// --- the state styles, read from the component -----------------------------
const treeSrc = readFileSync(join(process.cwd(), "components", "game", "skill-tree.tsx"), "utf8");
const stateBlock = treeSrc.slice(
  treeSrc.indexOf("const stateStyle"),
  treeSrc.indexOf("};", treeSrc.indexOf("const stateStyle")),
);
const styleFor: Partial<Record<TileState, string>> = {};
for (const m of stateBlock.matchAll(/["']?([a-z-]+)["']?:\s*"([^"]*)"/g)) {
  styleFor[m[1] as TileState] = m[2];
}
check("a style was found for all eight states",
  TILE_STATES.every((s) => styleFor[s] !== undefined),
  TILE_STATES.filter((s) => styleFor[s] === undefined).join(", "));

/** `opacity-55` -> 0.55. Anything the tile body inherits changes the maths. */
const opacityOf = (cls: string) => {
  const m = cls.match(/\bopacity-(\d{1,3})\b/);
  return m ? Number(m[1]) / 100 : 1;
};

// ===========================================================================
console.log("\nTile text on every state and every background");
// ===========================================================================
/*
 * `surface` is a resting tile, `surface-raised` is the selected one — the two
 * backgrounds `skill-tree-interactive.tsx` actually sets on the button. Hover
 * changes only the border, and focus adds an outline outside the tile, so
 * neither alters the colour behind the text.
 */
const BACKGROUNDS: [string, string][] = [
  ["surface (resting, and hover)", TOKENS["surface"]],
  ["surface-raised (selected)", TOKENS["surface-raised"]],
];

/** The two text colours a tile prints: the skill name, and the state/type line. */
const TILE_TEXT: [string, string][] = [
  ["skill name (ink)", TOKENS["ink"]],
  ["state and type (ink-muted)", TOKENS["ink-muted"]],
];

const AA = 4.5;
for (const state of TILE_STATES) {
  const alpha = opacityOf(styleFor[state] ?? "");
  for (const [bgLabel, bg] of BACKGROUNDS) {
    for (const [textLabel, fg] of TILE_TEXT) {
      const effective = over(hex(fg), hex(bg), alpha);
      const r = contrast(effective, hex(bg));
      check(
        `${state} / ${bgLabel} / ${textLabel}${alpha < 1 ? ` @${alpha}` : ""}`,
        r >= AA,
        `${r.toFixed(2)}:1`,
      );
    }
  }
}

// ===========================================================================
console.log("\nThe panel, the sheet and the focus ring");
// ===========================================================================
for (const [label, fg, bg] of [
  ["panel body on surface-raised", TOKENS["ink-muted"], TOKENS["surface-raised"]],
  ["panel heading on surface-raised", TOKENS["ink-muted"], TOKENS["surface-raised"]],
  ["bottom sheet text on surface-raised", TOKENS["ink-muted"], TOKENS["surface-raised"]],
  ["tree hint on abyss", TOKENS["ink-muted"], TOKENS["abyss"]],
  ["panel call to action (ember)", TOKENS["ember"], TOKENS["surface-raised"]],
] as [string, string, string][]) {
  const r = contrast(hex(fg), hex(bg));
  check(`${label} reaches 4.5:1`, r >= AA, `${r.toFixed(2)}:1`);
}

// Non-text: the focus ring must be distinguishable from what it sits on.
for (const bg of ["surface", "surface-raised", "abyss"]) {
  const r = contrast(hex(TOKENS["ember"]), hex(TOKENS[bg]));
  check(`focus ring (ember) on ${bg} reaches 3:1`, r >= 3, `${r.toFixed(2)}:1`);
}

// ===========================================================================
console.log("\nThe failing token is gone from the tree");
// ===========================================================================
const TREE_FILES = [
  "components/game/skill-tree.tsx",
  "components/game/skill-tree-interactive.tsx",
  "components/game/skill-sigil.tsx",
];
for (const f of TREE_FILES) {
  const src = readFileSync(join(process.cwd(), f), "utf8");
  check(`${f} does not use text-ink-subtle`, !src.includes("text-ink-subtle"));
}
// Control: ink-subtle really would fail, so the rule above is not decorative.
{
  const r = contrast(hex(TOKENS["ink-subtle"]), hex(TOKENS["surface"]));
  check("control: ink-subtle would have failed on surface", r < AA, `${r.toFixed(2)}:1`);
}

// ===========================================================================
console.log("\nAs rendered, in both locales");
// ===========================================================================
const root = assertFreshBuild();
for (const locale of LOCALES) {
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
    /*
     * Scoped to the tile buttons. The rest of the page legitimately uses
     * `ink-subtle` — that is a site-wide pattern this change does not touch,
     * and asserting over the whole document would report it as a regression
     * here rather than as the separate backlog item it is.
     */
    const tiles = [...html.matchAll(/<button[^>]*data-slug="[a-z0-9-]+"[^>]*>([\s\S]*?)<\/button>/g)]
      .map((m) => m[0])
      .join("");
    check(`${locale} ${label}: tiles were found`, tiles.length > 0);
    check(`${locale} ${label}: no tile text uses ink-subtle`, !tiles.includes("text-ink-subtle"));
    check(`${locale} ${label}: tile text uses ink-muted`, tiles.includes("text-ink-muted"));
    // The backgrounds the maths assumed are the ones the page sets.
    check(`${locale} ${label}: resting tiles are bg-surface`, tiles.includes("bg-surface"));
    check(
      `${locale} ${label}: the unused state carries the opacity this test modelled`,
      tiles.includes(`opacity-${Math.round(opacityOf(styleFor.unused ?? "") * 100)}`),
    );
  }
}

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
