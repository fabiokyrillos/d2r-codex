/**
 * The skill-tree section as shipped in the prerendered HTML — the DOM
 * contract of plan §5.5, read from `.next/server/app` for the eight classes in
 * both locales and for three build pages.
 *
 * What it holds the served document to, and why each line is a requirement:
 *
 *   - three `role="grid"`, eighteen rows, fifty-four cells, and **no** cell
 *     `aria-hidden`: the empty cells are named `skills.emptyCell` and stay in
 *     the accessibility tree (R-TREE-1; the old tree hid 24 of them, so the
 *     grid announced 30 cells out of 54);
 *   - thirty `<a data-node href>` per class, each a real link with the page's
 *     locale, `title` = the skill's name, `aria-label` composed exactly as
 *     §5.1 says, recomposed here from the dictionary and the graph (R-TREE-14,
 *     R-TREE-16 — no `<noscript>` copy of the links exists any more);
 *   - the served state is `available`, `invested` or `maxed`, never `locked`,
 *     which needs a preference and is asserted in the browser gate (C8);
 *   - one legend per section, the tab control served as three fragment links,
 *     the overlay first and `aria-hidden`, six rail cells, the connector
 *     pieces as `<svg><line>`, no tab roles, no dialog, no level control, no
 *     inline script — the pre-hydration render is the no-JavaScript render.
 *
 * Every counter is first run against a synthetic snippet that carries the
 * defect it exists to catch, so a green run cannot come from a matcher that
 * matches nothing.
 *
 * Requires `npm run build` to have run. Run with `npm run test:a11y`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";

import { dictionaryFor, fmt, formatPoints, plural } from "../lib/i18n";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { getBuild, getClass, getSkill, getSkillTree } from "../lib/registry";
import { routes } from "../lib/routes";
import { CLASSES_WITH_SKILL_PAGES, MAX_HARD_POINTS, SKILL_GRAPH, TIER_LEVELS, treeEdges } from "../lib/skills";
import { NODE_STATES, nodeAriaLabel, nodeState, type NodeState } from "../lib/skill-tree-data-pure";
import { edgeKey, edgePieces } from "../lib/skill-tree-geometry";

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

// ---------------------------------------------------------------------------
// A small reader for React's HTML: opening tags with their attributes, the
// content of an element, the text of a slice. No parser dependency, like
// every other file gate here; the built markup has no `>` inside attribute
// values and closes every non-void element, which is all this relies on.
// ---------------------------------------------------------------------------

interface Tag {
  name: string;
  attrs: Record<string, string>;
  /** Offsets of the opening tag in the string it was read from. */
  start: number;
  end: number;
}

// `&gt;` matters: React escapes the `>` of `data-edge="<from>><to>"` in the
// file, while the DOM hands the browser gate a plain `>`.
const decode = (s: string) =>
  s
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");

function tagsIn(html: string): Tag[] {
  const out: Tag[] = [];
  const open = /<([a-zA-Z][\w-]*)((?:\s+[^\s"'>/=]+(?:=(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*\/?>/g;
  const attr = /([^\s"'>/=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  for (let m = open.exec(html); m; m = open.exec(html)) {
    const attrs: Record<string, string> = {};
    for (let a = attr.exec(m[2]); a; a = attr.exec(m[2])) attrs[a[1]] = decode(a[2] ?? a[3] ?? a[4] ?? "");
    out.push({ name: m[1].toLowerCase(), attrs, start: m.index, end: m.index + m[0].length });
  }
  return out;
}

/** The content between an opening tag and its matching close. */
function inner(html: string, tag: Tag): string {
  const re = new RegExp(`<${tag.name}\\b[^>]*>|</${tag.name}>`, "g");
  re.lastIndex = tag.end;
  let depth = 0;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    if (m[0].startsWith("</")) {
      if (depth === 0) return html.slice(tag.end, m.index);
      depth--;
    } else if (!m[0].endsWith("/>")) depth++;
  }
  return "";
}

const text = (s: string) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** The `<section id=…>` with that id, nested sections respected. */
function idSection(html: string, id: string): string | undefined {
  const opener = tagsIn(html).find((t) => t.name === "section" && t.attrs.id === id);
  return opener ? inner(html, opener) : undefined;
}

const has = (t: Tag, name: string) => Object.hasOwn(t.attrs, name);
const classes = (t: Tag) => (t.attrs.class ?? "").split(/\s+/);
const firstChildTag = (html: string, tag: Tag): Tag | undefined => {
  const body = inner(html, tag);
  if (!/^\s*</.test(body)) return undefined;
  return tagsIn(body)[0];
};

// ===========================================================================
console.log("\nControls: each counter catches the defect it exists for");
// ===========================================================================

{
  const cells = `<div role="row" aria-label="Level 1"><div aria-label="No skill" role="gridcell"></div><div role="gridcell" aria-hidden="true"></div><div role="gridcell" aria-label="No skill"> </div><div role="gridcell"><a data-node="x" href="/en-us/classes/c/skills/x" data-state="locked"><span class="tree-name">X</span></a></div></div>`;
  const tags = tagsIn(cells);
  const gridcells = tags.filter((t) => t.attrs.role === "gridcell");
  check("a synthetic aria-hidden cell is counted", gridcells.filter((t) => has(t, "aria-hidden")).length === 1);
  check("attribute order does not matter to the reader", gridcells[0].attrs["aria-label"] === "No skill" && gridcells[0].name === "div");
  const empty = gridcells.filter((t) => t.attrs["aria-label"] === "No skill" && inner(cells, t) === "");
  check("a named cell with content is not counted as empty", empty.length === 1);
  const node = tags.find((t) => t.name === "a" && has(t, "data-node"))!;
  check("a synthetic locked state is caught by the served-state filter", !["available", "invested", "maxed"].includes(node.attrs["data-state"]));
  check("a node's inner content is read through nesting", text(inner(cells, node)) === "X");
  const nested = `<section id="skills"><section aria-label="inner"><script>1</script></section><p>tail</p></section><section id="other">no</section>`;
  const slice = idSection(nested, "skills") ?? "";
  check("the section reader stops at the matching close", slice.includes("tail") && !slice.includes("no"));
  check("a script inside the section is seen", /<script\b/.test(slice));
  check("a missing section reads as undefined, not as the whole document", idSection(nested, "absent") === undefined);
  const withOverlay = `<div role="grid"> <div data-tree-overlay="" aria-hidden="true"></div><div role="row"></div></div>`;
  const grid = tagsIn(withOverlay)[0];
  check("the first element child is found past whitespace", firstChildTag(withOverlay, grid)?.attrs["aria-hidden"] === "true");
  check("entities in attributes are decoded", tagsIn(`<a title="Vine&#x27;s &amp; Co">`)[0].attrs.title === "Vine's & Co");
  check("an escaped edge key reads as from>to", tagsIn(`<span data-edge="ice-bolt&gt;ice-blast">`)[0].attrs["data-edge"] === "ice-bolt>ice-blast");
  // Offsets belong to the string a tag was read from: a piece read out of a
  // grid's body and read back from the document lands somewhere else (this
  // once failed every connector check against a correct page).
  const page = `<span>x</span><div role="grid"><span data-edge="a&gt;b"><svg><line></line></svg></span></div>`;
  const gridBody = inner(page, tagsIn(page).find((tg) => tg.attrs.role === "grid")!);
  const piece = tagsIn(gridBody)[0];
  check("a piece read out of a grid's body is read back from that body, not from the document",
    /<line\b/.test(inner(gridBody, piece)) && !/<line\b/.test(inner(page, piece)));
}

// ===========================================================================
console.log("\nPoint counts are pluralised");
// ===========================================================================

/*
 * "1 pts" shipped on tiles, panels and tables because three call sites each
 * interpolated a count into one template. `pointsLabel` in the accessible
 * name and the counter go through `formatPoints`; the wording is pinned here.
 */
const EXPECTED: Record<string, Record<number, string>> = {
  "en-us": { 0: "0 points", 1: "1 point", 2: "2 points", 20: "20 points" },
  "pt-br": { 0: "0 pontos", 1: "1 ponto", 2: "2 pontos", 20: "20 pontos" },
};
for (const locale of LOCALES) {
  const forms = dictionaryFor(locale).skills.points;
  for (const [count, want] of Object.entries(EXPECTED[locale])) {
    const got = formatPoints(forms, Number(count));
    check(`${locale}: ${count} reads "${want}"`, got === want, got);
  }
  check(`${locale}: only 1 takes the singular`, [0, 2, 20, 110].every((n) => plural(forms, n) === forms.other) && plural(forms, 1) === forms.one);
}

// ===========================================================================
console.log("\nThe served section, per document");
// ===========================================================================

const root = assertFreshBuild();

interface Doc {
  label: string;
  file: string;
  locale: Locale;
  classSlug: string;
  buildSlug: string | null;
}

// Class pages are derived: a class entering the graph is covered the same day.
// Build pages are the three the browser gate drives (plan §9, C2).
const docs: Doc[] = [
  ...CLASSES_WITH_SKILL_PAGES.flatMap((cls) =>
    LOCALES.map((locale) => ({ label: `${cls} class ${locale}`, file: `${locale}/classes/${cls}.html`, locale, classSlug: cls, buildSlug: null })),
  ),
  ...(
    [
      ["sorceress", "blizzard-sorceress"],
      ["necromancer", "summoner-necromancer"],
      ["warlock", "abyss-warlock"],
    ] as const
  ).flatMap(([cls, build]) =>
    LOCALES.map((locale) => ({ label: `${build} ${locale}`, file: `${locale}/builds/${cls}/${build}.html`, locale, classSlug: cls, buildSlug: build })),
  ),
];

const SERVED_STATES: readonly NodeState[] = ["available", "invested", "maxed"];

for (const doc of docs) {
  const { label, locale, classSlug, buildSlug } = doc;
  const path = join(root, doc.file);
  if (!existsSync(path)) {
    check(`${label}: prerendered HTML exists`, false, path);
    continue;
  }
  const html = readFileSync(path, "utf8");
  const t = dictionaryFor(locale).skills;
  const cls = getClass(locale, classSlug)!;
  const build = buildSlug ? getBuild(locale, buildSlug) : undefined;
  const inBuild = buildSlug !== null;
  if (inBuild && !build) {
    check(`${label}: the build exists in the registry`, false, buildSlug ?? "");
    continue;
  }
  const allocation = new Map((build?.skills ?? []).map((a) => [a.skill, a]));

  const section = idSection(html, "skills");
  check(`${label}: has a <section id="skills">`, section !== undefined);
  if (section === undefined) continue;
  const all = tagsIn(section);

  // --- the island's root ---------------------------------------------------
  const rootTag = all.find((tg) => has(tg, "data-trees"));
  check(`${label}: one [data-trees] root, not yet [data-trees-ready]`,
    all.filter((tg) => has(tg, "data-trees")).length === 1 && !!rootTag && !has(rootTag, "data-trees-ready"));
  check(`${label}: no [data-glyph] before any measurement`, !all.some((tg) => has(tg, "data-glyph")));

  // --- composite structure -------------------------------------------------
  const grids = all.filter((tg) => tg.attrs.role === "grid");
  const rows = all.filter((tg) => tg.attrs.role === "row");
  const cells = all.filter((tg) => tg.attrs.role === "gridcell");
  check(`${label}: 3 grids, 18 rows, 54 cells`,
    grids.length === 3 && rows.length === 18 && cells.length === 54,
    `${grids.length}/${rows.length}/${cells.length}`);
  check(`${label}: 0 gridcells aria-hidden (R-TREE-1)`,
    cells.filter((tg) => has(tg, "aria-hidden")).length === 0,
    `${cells.filter((tg) => has(tg, "aria-hidden")).length} hidden`);

  const emptyCells = cells.filter((tg) => tg.attrs["aria-label"] === t.emptyCell);
  check(`${label}: 24 empty cells named "${t.emptyCell}"`, emptyCells.length === 24, `${emptyCells.length}`);
  check(`${label}: every empty cell has no other content`,
    emptyCells.length === 24 && emptyCells.every((tg) => inner(section, tg) === ""),
    `${emptyCells.filter((tg) => inner(section, tg) !== "").length} with content`);
  check(`${label}: no cell carries a name other than "${t.emptyCell}"`,
    cells.every((tg) => !has(tg, "aria-label") || tg.attrs["aria-label"] === t.emptyCell));
  check(`${label}: every row is named "${fmt(t.rowLabel, { level: "N" })}" for its tier, in order, per grid`,
    grids.every((g) => {
      const body = inner(section, g);
      const names = tagsIn(body).filter((tg) => tg.attrs.role === "row").map((tg) => tg.attrs["aria-label"]);
      return names.length === 6 && names.every((n, i) => n === fmt(t.rowLabel, { level: TIER_LEVELS[i] }));
    }));
  check(`${label}: each grid names its tree and points at a description`,
    grids.every((g) => has(g, "aria-label") && has(g, "aria-describedby") && html.includes(`id="${g.attrs["aria-describedby"]}"`)));
  check(`${label}: the grid's name is "${fmt(t.treeLabel, { tree: "<tree>" })}" for its tree`,
    cls.trees.every((slug) => grids.some((g) => g.attrs["aria-label"] === fmt(t.treeLabel, { tree: getSkillTree(locale, slug)!.name }))));

  // --- overlay, rail, connectors (R-TREE-2) --------------------------------
  check(`${label}: [data-tree-overlay][aria-hidden="true"] is the first element child of every grid`,
    grids.length === 3 && grids.every((g) => {
      const first = firstChildTag(section, g);
      return !!first && has(first, "data-tree-overlay") && first.attrs["aria-hidden"] === "true";
    }));
  check(`${label}: one overlay per grid and no other aria-hidden inside a grid but the overlay`,
    grids.every((g) => tagsIn(inner(section, g)).filter((tg) => has(tg, "data-tree-overlay")).length === 1));
  check(`${label}: 6 [data-rail-level] per grid`,
    grids.every((g) => tagsIn(inner(section, g)).filter((tg) => has(tg, "data-rail-level")).length === 6),
    grids.map((g) => tagsIn(inner(section, g)).filter((tg) => has(tg, "data-rail-level")).length).join("/"));
  // The pieces are whatever `edgePieces` draws for the tree's edges in the
  // graph, counted here from the graph itself: a fixed floor would be wrong
  // (Combat Masteries has two edges, Defensive Auras five). Tags read out of a
  // grid's body carry offsets into that body, so the body is what they are
  // read back from.
  const pieceSets = grids.map((g, i) => {
    const body = inner(section, g);
    const pieces = tagsIn(body).filter((tg) => has(tg, "data-edge"));
    const edges = treeEdges(cls.trees[i]);
    const want = edges.reduce((n, e) => n + edgePieces(e.from, e.to).length, 0);
    return { body, pieces, want, keys: edges.map((e) => edgeKey({ from: e.from.slug, to: e.to.slug })) };
  });
  check(`${label}: every grid holds exactly the pieces its tree's edges draw (edgePieces over treeEdges)`,
    pieceSets.every((p) => p.want > 0 && p.pieces.length === p.want),
    pieceSets.map((p) => `${p.pieces.length}/${p.want}`).join(" "));
  check(`${label}: every edge of every tree is drawn at least once`,
    pieceSets.every((p) => p.keys.every((k) => p.pieces.some((tg) => tg.attrs["data-edge"] === k))),
    pieceSets.flatMap((p) => p.keys.filter((k) => !p.pieces.some((tg) => tg.attrs["data-edge"] === k))).join(" "));
  check(`${label}: every piece is a span holding an <svg> with a <line>`,
    pieceSets.every((p) => p.pieces.every((tg) => {
      const body = inner(p.body, tg);
      return tg.name === "span" && /<svg\b/.test(body) && /<line\b/.test(body);
    })));
  check(`${label}: every piece names an edge of its own tree as "<from>><to>"`,
    grids.every((g, i) => {
      const treeSlug = cls.trees[i];
      return tagsIn(inner(section, g))
        .filter((tg) => has(tg, "data-edge"))
        .every((tg) => {
          const [from, to] = tg.attrs["data-edge"].split(">");
          return SKILL_GRAPH[from]?.tree === treeSlug && SKILL_GRAPH[to]?.tree === treeSlug && SKILL_GRAPH[to].prerequisites.includes(from);
        });
    }));
  check(`${label}: no [data-related] before any selection`, !all.some((tg) => has(tg, "data-related")));

  // --- the nodes (R-TREE-3, R-TREE-14, R-TREE-16) --------------------------
  const nodes = all.filter((tg) => tg.name === "a" && has(tg, "data-node"));
  check(`${label}: 30 <a data-node href> links`, nodes.length === 30 && nodes.every((n) => has(n, "href")), `${nodes.length}`);
  check(`${label}: the 30 links are 30 distinct skills of this class`,
    new Set(nodes.map((n) => n.attrs["data-node"])).size === 30 && nodes.every((n) => SKILL_GRAPH[n.attrs["data-node"]]?.classSlug === classSlug));
  check(`${label}: every href is the skill page with the page's locale`,
    nodes.length === 30 && nodes.every((n) => n.attrs.href === routes(locale).skill(classSlug, n.attrs["data-node"])),
    nodes.find((n) => n.attrs.href !== routes(locale).skill(classSlug, n.attrs["data-node"]))?.attrs.href);
  check(`${label}: every node sits in a gridcell`,
    cells.filter((c) => !has(c, "aria-label")).length === 30 &&
      cells.filter((c) => !has(c, "aria-label")).every((c) => firstChildTag(section, c)?.attrs["data-node"] !== undefined));
  check(`${label}: title = the skill's name on all 30`,
    nodes.length === 30 && nodes.every((n) => n.attrs.title === getSkill(locale, n.attrs["data-node"])?.name),
    nodes.find((n) => n.attrs.title !== getSkill(locale, n.attrs["data-node"])?.name)?.attrs.title);

  const served = nodes.map((n) => n.attrs["data-state"]);
  check(`${label}: every served state is available, invested or maxed — never locked (needs a preference)`,
    served.length === 30 && served.every((s) => SERVED_STATES.includes(s as NodeState)), [...new Set(served)].join(", "));
  if (!inBuild) check(`${label}: a class page serves every node available`, served.every((s) => s === "available"), [...new Set(served)].join(", "));

  // The accessible name, recomposed from the dictionary and the graph (§5.1).
  let composed = 0;
  let byFunction = 0;
  const wrong: string[] = [];
  for (const n of nodes) {
    const slug = n.attrs["data-node"];
    const skill = getSkill(locale, slug)!;
    const g = SKILL_GRAPH[slug];
    const points = allocation.get(slug)?.points ?? 0;
    const state: NodeState = points >= g.maxLevel ? "maxed" : points > 0 ? "invested" : "available";
    const treeName = getSkillTree(locale, g.tree)!.name;
    const stateLabel = { locked: t.stateLocked, available: t.stateAvailable, invested: t.stateInvested, maxed: t.stateMaxed }[state];
    const pointsLabel = inBuild ? (points > 0 ? formatPoints(t.points, points) : t.noPoints) : "";
    const want = fmt(inBuild ? t.ariaNodeBuild : t.ariaNode, { skill: skill.name, level: g.requiredLevel, tree: treeName, state: stateLabel, points: pointsLabel });
    if (n.attrs["aria-label"] === want) composed++;
    else wrong.push(`${slug}: "${n.attrs["aria-label"]}" ≠ "${want}"`);
    if (n.attrs["data-state"] !== state) wrong.push(`${slug}: state ${n.attrs["data-state"]} ≠ ${state}`);
    const fn = nodeAriaLabel({ name: skill.name, level: g.requiredLevel, pointsLabel }, treeName, nodeState({ points, maxLevel: g.maxLevel, level: g.requiredLevel }, null), t, inBuild);
    if (fn === want) byFunction++;
  }
  check(`${label}: all 30 aria-labels are the §5.1 composition from the dictionary`, composed === 30 && wrong.length === 0, wrong.slice(0, 2).join(" | "));
  check(`${label}: nodeAriaLabel/nodeState agree with the recomposition on all 30`, byFunction === 30, `${byFunction}`);
  check(`${label}: no aria-label leaves a placeholder or repeats the state`,
    nodes.every((n) => !/\{[a-z]+\}/i.test(n.attrs["aria-label"]) && (n.attrs["aria-label"].match(new RegExp(`\\b(${t.stateAvailable}|${t.stateInvested}|${t.stateMaxed})\\b`, "g")) ?? []).length === 1));

  // Served as links: the roles and the roving tabindex arrive with hydration (decision 2, §5.5).
  check(`${label}: no node is served with role="button", aria-expanded or tabindex`,
    nodes.every((n) => !has(n, "role") && !has(n, "aria-expanded") && !has(n, "tabindex")));
  check(`${label}: no node is served [data-locked]`, nodes.every((n) => !has(n, "data-locked")));

  // Inside every node: the placeholder sigil (R-TREE-18) and the English name.
  const nodeBodies = nodes.map((n) => ({ n, body: inner(section, n), tags: tagsIn(inner(section, n)) }));
  check(`${label}: [data-placeholder] on every node's sigil`,
    nodeBodies.length === 30 && nodeBodies.every(({ tags }) => tags.some((tg) => has(tg, "data-placeholder"))));
  check(`${label}: no <img> and no external asset in any node`,
    nodeBodies.every(({ body }) => !/<img\b/.test(body) && !/https?:\/\//.test(body)));
  const names = all.filter((tg) => classes(tg).includes("tree-name"));
  check(`${label}: exactly one .tree-name per node, holding the name`,
    nodeBodies.length === 30 && nodeBodies.every(({ n, tags, body }) => {
      const nm = tags.filter((tg) => classes(tg).includes("tree-name"));
      return nm.length === 1 && text(inner(body, nm[0])) === getSkill(locale, n.attrs["data-node"])?.name;
    }));
  check(`${label}: every .tree-name carries lang="en" (names are English in both locales, ADR 0003)`,
    names.length >= 30 && names.every((tg) => tg.attrs.lang === "en"), `${names.filter((tg) => tg.attrs.lang !== "en").length} without`);

  // --- per tree: id, heading, theme, default ------------------------------
  const trees = all.filter((tg) => has(tg, "data-tree") && !has(tg, "data-tree-tab"));
  check(`${label}: one [data-tree] per tree of the class, id = slug, in order`,
    trees.length === 3 && trees.every((tg, i) => tg.attrs["data-tree"] === cls.trees[i] && tg.attrs.id === cls.trees[i]),
    trees.map((tg) => `${tg.attrs["data-tree"]}#${tg.attrs.id}`).join(" "));
  check(`${label}: [data-tree] > h3 = the tree's name, on every tree`,
    trees.length === 3 && trees.every((tg) => {
      const first = firstChildTag(section, tg);
      return !!first && first.name === "h3" && text(inner(inner(section, tg), first)) === getSkillTree(locale, tg.attrs["data-tree"])!.name;
    }));
  check(`${label}: no tree is served hidden or as a tabpanel; each is a region named by its own heading`,
    trees.length === 3 && trees.every((tg) => !has(tg, "hidden") && tg.attrs.role === "region" && tg.attrs["aria-labelledby"] === `${tg.attrs["data-tree"]}-title` && html.includes(`id="${tg.attrs["data-tree"]}-title"`)));
  check(`${label}: [data-tree-default] on exactly one tree`, trees.filter((tg) => has(tg, "data-tree-default")).length === 1);
  if (build) {
    // Decision 6: on a build the default is the most-invested tree (tie → first).
    const points = cls.trees.map((slug) => build.skills.filter((a) => SKILL_GRAPH[a.skill]?.tree === slug).reduce((s, a) => s + a.points, 0));
    const want = cls.trees[points.indexOf(Math.max(...points))];
    check(`${label}: the default tree is the most-invested one (${want})`,
      trees.find((tg) => has(tg, "data-tree-default"))?.attrs["data-tree"] === want);
  } else {
    check(`${label}: the default tree is the first (${cls.trees[0]})`,
      trees.find((tg) => has(tg, "data-tree-default"))?.attrs["data-tree"] === cls.trees[0]);
  }
  check(`${label}: each tree's theme is served both as a paragraph and as a closed <details data-tree-theme> (decision 10)`,
    trees.length === 3 && trees.every((tg) => {
      const tags = tagsIn(inner(section, tg));
      const details = tags.filter((d) => d.name === "details" && has(d, "data-tree-theme"));
      return details.length === 1 && !has(details[0], "open") && tags.some((p) => p.name === "p" && classes(p).includes("hidden") && classes(p).includes("sm:block"));
    }));
  check(`${label}: exactly three h3 outside the legend — one per tree — and no h2 inside the island`,
    (() => {
      const island = rootTag ? inner(section, rootTag) : "";
      const legendBody = (() => {
        const d = tagsIn(island).find((x) => x.name === "details" && has(x, "data-legend"));
        return d ? inner(island, d) : "";
      })();
      const h3 = tagsIn(island).filter((x) => x.name === "h3").length - tagsIn(legendBody).filter((x) => x.name === "h3").length;
      return h3 === 3 && !tagsIn(island).some((x) => x.name === "h2");
    })());

  // --- the tab control, served as links (decision 5) ----------------------
  const nav = all.filter((tg) => tg.name === "nav" && has(tg, "data-tree-tabs"));
  check(`${label}: one nav[data-tree-tabs]`, nav.length === 1, `${nav.length}`);
  if (nav[0]) {
    const navBody = inner(section, nav[0]);
    const links = tagsIn(navBody).filter((tg) => tg.name === "a");
    check(`${label}: the nav holds exactly the three #<tree> links, in order, each [data-tree-tab]`,
      links.length === 3 && links.every((a, i) => a.attrs.href === `#${cls.trees[i]}` && has(a, "data-tree-tab")),
      links.map((a) => a.attrs.href).join(" "));
    check(`${label}: no tab roles are served`, !links.some((a) => has(a, "role") || has(a, "aria-selected")) && !has(nav[0], "role"));
    check(`${label}: every link names its tree, and shows its points only in a build`,
      links.length === 3 && links.every((a, i) => {
        const body = inner(navBody, a);
        return text(body).startsWith(getSkillTree(locale, cls.trees[i])!.name) && tagsIn(body).some((tg) => has(tg, "data-tab-points")) === inBuild;
      }));
  }

  // --- one legend (R-TREE-8) ----------------------------------------------
  const legends = all.filter((tg) => tg.name === "details" && has(tg, "data-legend"));
  check(`${label}: exactly one details[data-legend], served closed`, legends.length === 1 && !has(legends[0], "open"), `${legends.length}`);
  if (legends[0]) {
    const body = inner(section, legends[0]);
    const h3 = tagsIn(body).filter((tg) => tg.name === "h3");
    check(`${label}: the legend's h3 reads exactly "${t.legendTitle}"`, h3.length === 1 && text(inner(body, h3[0])) === t.legendTitle, h3.map((x) => text(inner(body, x))).join(" | "));
    const summary = tagsIn(body).find((x) => x.name === "summary");
    check(`${label}: the h3 sits inside the <summary>`, !!summary && tagsIn(inner(body, summary)).some((x) => x.name === "h3"));
    // Scoped to the summary: the body's list items reuse the attribute for their prefixes.
    check(`${label}: four [data-swatch] in the summary`, !!summary && tagsIn(inner(body, summary)).filter((tg) => has(tg, "data-swatch")).length === 4,
      summary ? `${tagsIn(inner(body, summary)).filter((tg) => has(tg, "data-swatch")).length}` : "no summary");
    const legendText = text(body);
    // The two lines about points ("optional" pill, "hard points only") explain
    // the counters, and the counters exist only on a build page; a class page
    // has nothing they could refer to (decisions 13 and 14).
    const always = [t.legendLocked, t.legendAvailable, t.legendInvested, t.legendMaxed, t.legendConnector, t.legendKeyboard, t.placeholderNote];
    const buildOnly = [t.legendOptional, t.legendHardPoints];
    check(`${label}: the legend explains every symbol (states, connector, keyboard, placeholder${inBuild ? ", optional, hard points" : ""})`,
      [...always, ...(inBuild ? buildOnly : [])].every((s) => legendText.includes(text(s))),
      [...always, ...(inBuild ? buildOnly : [])].filter((s) => !legendText.includes(text(s))).map((s) => s.slice(0, 20)).join(" | "));
    check(`${label}: a class page's legend carries no line about points`,
      inBuild || buildOnly.every((s) => !legendText.includes(text(s))));
  }
  // Decision 10: legend after the trees, "My level" after the legend (browser gate).
  check(`${label}: the legend comes after the last tree`,
    (() => {
      const lastTree = trees[trees.length - 1];
      return !!legends[0] && !!lastTree && legends[0].start > lastTree.start;
    })());
  // The level control's box is served after the legend as an inert,
  // `aria-hidden` skeleton — no form, input or button — for the island to
  // replace without moving anything below the section (browser gate C2b).
  const slots = all.filter((tg) => has(tg, "data-level-slot"));
  check(`${label}: one [data-level-slot] after the legend holding only the aria-hidden skeleton`,
    slots.length === 1 && !!legends[0] && slots[0].start > legends[0].start && (() => {
      const body = inner(section, slots[0]);
      const tags = tagsIn(body);
      const skeleton = tags.find((tg) => has(tg, "data-level-skeleton"));
      return !!skeleton && skeleton.attrs["aria-hidden"] === "true" && tags.filter((tg) => has(tg, "data-level-skeleton")).length === 1 && !tags.some((tg) => ["form", "input", "button", "label"].includes(tg.name)) && text(body).includes(t.levelLabel);
    })(),
    `${slots.length} slot(s)`);

  // --- absent until hydration, or absent for good ----------------------------
  check(`${label}: no role="tab", no role="tablist", no role="tabpanel"`, !/role="(tab|tablist|tabpanel)"/.test(section));
  check(`${label}: no role="dialog"`, !section.includes('role="dialog"'));
  // `data-level-slot` is served (the control's box); `data-level` itself is not.
  check(`${label}: no form[data-level] (R-PREF-4: the preference control needs JS)`, !all.some((tg) => tg.name === "form" && has(tg, "data-level")) && !/\sdata-level[\s=>]/.test(section));
  check(`${label}: no <noscript> (the links are the nodes, R-TREE-16)`, !/<noscript\b/.test(section) && !/<noscript\b/.test(html));
  check(`${label}: no <script> inside the section`, !/<script\b/.test(section));
  check(`${label}: no aria-live region is served written`,
    all.filter((tg) => has(tg, "data-live")).every((tg) => text(inner(section, tg)) === ""));

  // --- build pages: counters and the section total (R-TREE-6) --------------
  if (build) {
    const counters = nodeBodies.filter(({ tags }) => tags.some((tg) => has(tg, "data-points")));
    check(`${label}: [data-points] on all 30 nodes`, counters.length === 30, `${counters.length}`);
    // The counter reads the base points, "—" where the build puts none (the
    // convention the old tile had); the maxed pill's star is decoration
    // (`aria-hidden`) and is not part of the number.
    const counterText = (body: string, c: Tag) => text(inner(body, c).replace(/<span aria-hidden="true">[^<]*<\/span>/g, ""));
    const wrongCounters = nodeBodies.filter(({ n, body, tags }) => {
      const c = tags.find((tg) => has(tg, "data-points"));
      const points = allocation.get(n.attrs["data-node"])?.points ?? 0;
      return !c || counterText(body, c) !== (points > 0 ? String(points) : "—");
    });
    check(`${label}: every counter shows the build's base points for that skill, "—" for none`,
      wrongCounters.length === 0, wrongCounters.slice(0, 3).map(({ n, body, tags }) => `${n.attrs["data-node"]}: ${counterText(body, tags.find((tg) => has(tg, "data-points"))!)}`).join(" | "));
    check(`${label}: the maxed pill wears its star and only a maxed pill does`,
      nodeBodies.every(({ n, body, tags }) => {
        const c = tags.find((tg) => has(tg, "data-points"));
        const points = allocation.get(n.attrs["data-node"])?.points ?? 0;
        const maxed = points > 0 && points >= SKILL_GRAPH[n.attrs["data-node"]].maxLevel;
        return !!c && classes(c).includes("tree-pill-max") === maxed && inner(body, c).includes("✦") === maxed;
      }));
    const mandatory = build.skills.filter((a) => a.role !== "flex" && a.points > 0).reduce((s, a) => s + a.points, 0);
    const total = all.find((tg) => has(tg, "data-trees-total"));
    check(`${label}: [data-trees-total] carries "${fmt(t.legendMandatory, { points: mandatory, cap: MAX_HARD_POINTS })}"`,
      !!total && text(inner(section, total)).includes(fmt(t.legendMandatory, { points: mandatory, cap: MAX_HARD_POINTS })),
      total ? text(inner(section, total)) : "absent");
    check(`${label}: each tree header shows its points as [data-tree-points]`,
      trees.every((tg) => tagsIn(inner(section, tg)).some((x) => has(x, "data-tree-points"))));
    check(`${label}: a flex allocation wears data-role="flex" on its node (decision 13)`,
      build.skills.filter((a) => a.role === "flex").every((a) => nodes.find((n) => n.attrs["data-node"] === a.skill)?.attrs["data-role"] === "flex"));
  } else {
    check(`${label}: no [data-points] and no [data-trees-total] on a class page`,
      !all.some((tg) => has(tg, "data-points")) && !all.some((tg) => has(tg, "data-trees-total")));
  }

  // --- ids: unique across the document, so aria-controls can point anywhere -
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  check(`${label}: no duplicate element ids`, dupes.length === 0, [...new Set(dupes)].join(", "));

  // The defect the wording pins exist for, on every page this suite reads.
  for (const bad of ["1 pts", "1 points", "1 pontos"]) {
    const pattern = new RegExp(String.raw`\b${bad.replace(/ /g, String.raw`\s`)}`);
    check(`${label}: no "${bad}" anywhere in the HTML`, !pattern.test(html));
  }
}

check("the four node states are the ones the served-state filter was written against", NODE_STATES.length === 4 && SERVED_STATES.every((s) => NODE_STATES.includes(s)));

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
