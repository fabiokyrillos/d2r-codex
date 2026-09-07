/**
 * Regenerates `content/classes/skill-param-bounds.ts` from the game's own tables.
 *
 * Run with `npx tsx scripts/skill-param-bounds.ts`. Requires network access; it
 * is a manual tool, not part of the build. Pass `--check` to regenerate into
 * memory and fail if the committed artifact no longer matches.
 *
 * WHY THIS EXISTS
 * ---------------
 * Six sentences shipped that stated a diminishing skill's **Max** parameter as
 * a figure the character has: "Weapon Block at twenty gives a 65% block chance",
 * "a 25% chance of a critical hit". Every gate in `npm run check` stayed green,
 * because 65 and 25 *are* the numbers on those rows — `Param2` on Weapon Block
 * and `Param6` on Claw Mastery. What was wrong was the grammar around them.
 *
 * The game distinguishes the two families in the calculation column itself:
 *
 *   `ln<a><b>`   linear. `Param<a>` at level one, `Param<b>` more per level.
 *                Twenty points is `a + b * 19`, and a page may say so.
 *   `dm<a><b>`   diminishing. `Param<a>` is the floor and `Param<b>` is the
 *                ceiling the curve climbs toward. Twenty hard points is a long
 *                way below it, and the game labels the pair "… Min" / "… Max"
 *                on most of the rows that use it.
 *
 * So the families are extracted, and the prose rule in
 * `scripts/diminishing-claims.ts` reads them. See
 * `docs/proposals/assassin-8-diminishing-params-stated-as-achieved.md`.
 *
 * WHAT IS EXTRACTED
 * -----------------
 * Only mechanical facts, which are not copyrightable: the calculation token,
 * the two `Param` values it names, the two `*Param<N> Description` column labels
 * that identify them, and `maxlvl`. No game text and no game artwork enters this
 * repository — the parameter descriptions are the tables' own column labels for
 * developers ("Block % chance Max"), the same ones the skill-graph generator
 * already reads to decide which references are synergies.
 *
 * WHY THIS IS NOT IN THE SKILL GRAPH
 * ----------------------------------
 * Deliberately a separate file. `scripts/graph-drift.ts` proves the published
 * skill-graph node bodies are byte-identical against a pinned baseline, and it
 * parses `content/classes/skill-graph.ts` and nothing else. Adding four hundred
 * bound records to those node bodies would change every one of them and force
 * the baseline forward for a reason that has nothing to do with the graph. A
 * sibling file leaves that proof intact.
 *
 * WHAT IS DELIBERATELY LEFT OUT
 * -----------------------------
 * **The curve.** The engine's interpolation between Min and Max is not in these
 * tables, so no value at a level is published for a `dm` column. The site does
 * not publish a derived figure it cannot validate against an accepted source;
 * the ceiling the column states is what the pages may say, and the rule exists
 * to make them say it that way.
 *
 * **Parameter pairs that cannot be resolved.** Two shapes, both listed in
 * `SKILL_PARAM_BOUNDS_UNRESOLVED` rather than guessed at:
 *
 *   non-consecutive   The index is one digit wide, so `dm91` cannot be told
 *                     apart from a reference to `Param10`. Every one of the
 *                     eight is a pair the labels show is not really `Param9`
 *                     and `Param1` — Throwing Mastery's is "% chance for No
 *                     Consume Min" against "Attack Rating % baseline".
 *   absent            The export omits empty cells, so a token can name a
 *                     parameter the row does not carry at all.
 *
 * **The opaque calls.** `macr`, `madm`, `math`, `manc`, `mapi` and the rest are
 * engine functions whose parameter indices are not written down anywhere in
 * these tables. Claw Mastery's description row uses them; its *skill* row spells
 * the same three values out as `ln12`, `ln34` and `dm56`, which is why that
 * skill is covered. A skill whose bounds exist only behind an opaque call is not
 * covered, and no amount of inference here would make it so.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { SKILL_GRAPH } from "../content/classes/skill-graph";
import { slugFor } from "./skill-graph-rules";

const SOURCE_REPO = "blizzhackers/d2data";

/**
 * The exact commit the shipped bounds were extracted from.
 *
 * The same pin the skill graph uses, and checked against it below rather than
 * merely copied: two generated files reading two different snapshots of the
 * same tables would disagree without either of them being wrong, and nothing
 * would say so. Re-pinning means re-pinning both, in one commit, with the diff
 * read.
 */
const SOURCE_SHA = "fc469993502d0498809b9fc1af140ee2a9eb8902";
const SOURCE_DATE = "2026-08-21";
const SOURCE_MESSAGE = "Updated for patch 3.3.93847";
/** Verified against the pinned commit on 2026-09-07. */
const VERIFIED = "2026-09-07";
const BASELINE = "D2R Patch 3.3 / Ladder Season 15 extraction";

const RAW = `https://raw.githubusercontent.com/${SOURCE_REPO}/${SOURCE_SHA}/json`;

const PATHS = { skills: "skills.json", descs: "skilldesc.json" } as const;

const TARGET = join("content", "classes", "skill-param-bounds.ts");
const GRAPH = join("content", "classes", "skill-graph.ts");

/** A bare `dm<a><b>` or `ln<a><b>` cell, and nothing else. */
const TOKEN = /^(dm|ln)([1-9])([1-9])$/;

type Row = Record<string, unknown> & { skill?: string; skilldesc?: string | number };

const asArray = <T,>(j: unknown): T[] => (Array.isArray(j) ? j : Object.values(j as object)) as T[];

/**
 * Fetches one pinned file and refuses anything that is not the shape we parse.
 *
 * Same contract as the skill-graph generator's: a deleted repo, a rewritten
 * history or a restructured file must stop this with a message naming the
 * assumption that broke, rather than yielding an empty array that quietly
 * regenerates an artifact with every bound missing.
 */
async function getJson(path: string, requiredFields: readonly string[]): Promise<Row[]> {
  let res: Response;
  try {
    res = await fetch(`${RAW}/${path}`);
  } catch (cause) {
    throw new Error(
      `${path}: could not be fetched from ${SOURCE_REPO}@${SOURCE_SHA.slice(0, 12)}. ` +
        `The pinned commit may be gone, or the network is unavailable.`,
      { cause },
    );
  }
  if (!res.ok) {
    throw new Error(
      `${path}: HTTP ${res.status} from ${SOURCE_REPO}@${SOURCE_SHA.slice(0, 12)}. ` +
        `If this is a 404, the pinned commit or the file layout has changed; ` +
        `re-pin SOURCE_SHA deliberately and review the resulting diff.`,
    );
  }
  const rows = asArray<Row>(await res.json());
  if (rows.length === 0) throw new Error(`${path}: parsed to zero rows at the pinned commit`);

  // Checked against the union of keys across every row rather than against the
  // first one: the export omits empty cells, so absence on one row is
  // sparseness. A column present on *no* row is the real signal.
  const present = new Set<string>();
  for (const row of rows) for (const key of Object.keys(row)) present.add(key);
  const missing = requiredFields.filter((f) => !present.has(f));
  if (missing.length > 0) {
    throw new Error(
      `${path}: the pinned source no longer carries [${missing.join(", ")}]. ` +
        `The upstream format changed; update the parser before re-pinning.`,
    );
  }
  return rows;
}

/** The SHA the committed skill graph records, so the two artifacts cannot drift apart. */
function graphSha(): string {
  const header = readFileSync(join(process.cwd(), GRAPH), "utf8").slice(0, 4000);
  const match = /^ \* {3}Commit {6}([0-9a-f]{40})$/m.exec(header.replace(/\r\n/g, "\n"));
  if (!match) {
    throw new Error(
      `${GRAPH}: no 40-character Commit line in the provenance header. This generator ` +
        `pins itself to the same extraction the graph was built from and cannot verify that ` +
        `any more. Fix the header, or the graph generator that writes it.`,
    );
  }
  return match[1];
}

interface Bound {
  key: string;
  classSlug: string;
  skillSlug: string;
  source: string;
  column: string;
  token: string;
  family: "linear" | "diminishing";
  parameters: [number, number];
  labels: [string, string];
  maxLevel: number;
  /** Diminishing only. */
  minimum?: number;
  maximum?: number;
  /** Linear only. */
  base?: number;
  perLevel?: number;
}

interface Gap {
  classSlug: string;
  skillSlug: string;
  source: string;
  column: string;
  token: string;
  reason: string;
}

const q = (s: string) => JSON.stringify(s);

async function main() {
  const check = process.argv.includes("--check");

  const committedSha = graphSha();
  if (committedSha !== SOURCE_SHA) {
    throw new Error(
      `the skill graph was extracted from ${committedSha.slice(0, 12)} and this generator is ` +
        `pinned to ${SOURCE_SHA.slice(0, 12)}. Two generated files reading two snapshots of the ` +
        `same tables disagree without either being wrong. Re-pin both in one commit.`,
    );
  }

  const [skills, descs] = await Promise.all([
    getJson(PATHS.skills, ["skill", "charclass", "skilldesc", "maxlvl"]),
    getJson(PATHS.descs, ["skilldesc"]),
  ]);

  const descByKey = new Map<string, Row>();
  for (const d of descs) descByKey.set(String(d.skilldesc), d);

  const bounds: Bound[] = [];
  const gaps: Gap[] = [];

  for (const s of skills) {
    if (typeof s.skill !== "string") continue;
    /*
     * Scope comes from the published graph rather than from a second copy of the
     * class list. A skill the graph does not carry has no page, no tree and no
     * prose to check, and a bound for it would be a record nothing reads.
     */
    const skillSlug = slugFor(s.skill);
    const node = SKILL_GRAPH[skillSlug];
    if (!node) continue;

    const maxLevel = typeof s.maxlvl === "number" ? s.maxlvl : 0;
    const param = (i: number) => s[`Param${i}`];
    const label = (i: number) => {
      const l = s[`*Param${i} Description`];
      return typeof l === "string" ? l : "";
    };

    for (const [source, row] of [
      [PATHS.skills, s],
      [PATHS.descs, descByKey.get(String(s.skilldesc))],
    ] as const) {
      if (!row) continue;
      for (const [column, raw] of Object.entries(row)) {
        if (typeof raw !== "string") continue;
        const m = TOKEN.exec(raw.trim());
        if (!m) continue;
        const [, prefix, aDigit, bDigit] = m;
        const token = raw.trim();
        const a = Number(aDigit);
        const b = Number(bDigit);
        const at = { classSlug: node.classSlug, skillSlug, source, column, token };

        if (b !== a + 1) {
          gaps.push({
            ...at,
            reason:
              `the parameter indices are not consecutive, and the index is one digit wide — ` +
              `${token} cannot be told apart from a reference to Param1${bDigit}. ` +
              `The labels are ${q(label(a))} and ${q(label(b))}.`,
          });
          continue;
        }
        const va = param(a);
        const vb = param(b);
        if (typeof va !== "number" || typeof vb !== "number") {
          gaps.push({
            ...at,
            reason: `Param${a} or Param${b} is absent from the row, which the export does when the cell is empty.`,
          });
          continue;
        }

        const common = {
          key: `${node.classSlug}/${skillSlug}/${source}/${column}/${token}`,
          ...at,
          parameters: [a, b] as [number, number],
          labels: [label(a), label(b)] as [string, string],
          maxLevel,
        };
        bounds.push(
          prefix === "dm"
            ? { ...common, family: "diminishing", minimum: va, maximum: vb }
            : { ...common, family: "linear", base: va, perLevel: vb },
        );
      }
    }
  }

  bounds.sort((x, y) => (x.key < y.key ? -1 : x.key > y.key ? 1 : 0));
  gaps.sort((x, y) => {
    const kx = `${x.classSlug}/${x.skillSlug}/${x.source}/${x.column}/${x.token}`;
    const ky = `${y.classSlug}/${y.skillSlug}/${y.source}/${y.column}/${y.token}`;
    return kx < ky ? -1 : kx > ky ? 1 : 0;
  });

  const duplicate = bounds.find((r, i) => i > 0 && bounds[i - 1].key === r.key);
  if (duplicate) {
    throw new Error(
      `${duplicate.key}: two records share one key. The key is meant to be the record's own ` +
        `coordinate; if the tables can now carry the same token twice in one column, the key needs ` +
        `another component rather than a silent overwrite.`,
    );
  }

  const diminishing = bounds.filter((r) => r.family === "diminishing").length;
  const classes = [...new Set(bounds.map((r) => r.classSlug))].sort();

  const header = `/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with \`npx tsx scripts/skill-param-bounds.ts\` (see that script).
 *
 * Which of a skill's published numbers are values a character reaches and which
 * are ceilings a curve climbs toward, read out of the calculation column the
 * game itself uses to tell them apart.
 *
 *   \`ln<a><b>\`   linear. \`Param<a>\` at level one, \`Param<b>\` more per level.
 *                Twenty points is \`a + b * 19\`, and a page may say so.
 *   \`dm<a><b>\`   diminishing. \`Param<a>\` is the floor and \`Param<b>\` the
 *                ceiling. The engine's interpolation between them is not in
 *                these tables, so no figure at a level is published here — the
 *                ceiling is what the prose may state, and
 *                \`scripts/diminishing-claims.ts\` refuses prose that states it
 *                as an achieved figure instead.
 *
 * PROVENANCE
 *   Repository  ${SOURCE_REPO}
 *   Commit      ${SOURCE_SHA}
 *               ${SOURCE_DATE} — "${SOURCE_MESSAGE}"
 *   Verified    ${VERIFIED}
 *   Paths       json/${PATHS.skills}, json/${PATHS.descs}
 *   Baseline    ${BASELINE}
 *   Regenerate  npx tsx scripts/skill-param-bounds.ts
 *   Fields      skills.json:    every string column holding a bare dm/ln token,
 *                               plus the Param values and *Param<N> Description
 *                               labels those tokens name, and maxlvl
 *               skilldesc.json: the same, joined on the skilldesc key
 *   Extracted   ${bounds.length} bounds (${diminishing} diminishing, ${bounds.length - diminishing} linear)
 *               across ${new Set(bounds.map((r) => r.skillSlug)).size} skills in ${classes.length} classes
 *               ${SKILL_PARAM_BOUNDS_UNRESOLVED_NOTE(gaps.length)}
 *
 *   Scope is the published skill graph: a row whose slug is not a node in
 *   \`skill-graph.ts\` has no page and no prose, so it carries no bound here. The
 *   pin is checked against that file's own provenance header at generation time,
 *   so the two artifacts cannot come from two different snapshots.
 *
 *   This file is deliberately not part of the skill graph.
 *   \`scripts/graph-drift.ts\` proves the graph's node bodies are byte-identical
 *   against a pinned baseline and parses that file alone; folding these records
 *   into it would move every node body for a reason that has nothing to do with
 *   the graph.
 *
 *   The commit is pinned, not \`master\`. Re-running the generator reproduces
 *   this file exactly, or fails; it never silently follows the source forward.
 */

/** The source data coordinate a bound was read from. */
export type SkillParamSource = ${[...new Set(Object.values(PATHS))].map(q).join(" | ")};

/**
 * One calculation column, resolved.
 *
 * \`parameters\` are the indices the token named; \`labels\` are the game's own
 * \`*Param<N> Description\` column labels for them, kept because they are the
 * evidence a reader needs to judge a violation — most diminishing pairs are
 * labelled "… Min" and "… Max" by the tables themselves.
 */
export type SkillParamBound = {
  readonly classSlug: string;
  readonly skillSlug: string;
  readonly source: SkillParamSource;
  readonly column: string;
  readonly token: string;
  readonly parameters: readonly [number, number];
  readonly labels: readonly [string, string];
  readonly maxLevel: number;
} & (
  | {
      /** \`Param<a>\` is a floor and \`Param<b>\` a ceiling the curve climbs toward. */
      readonly family: "diminishing";
      readonly minimum: number;
      readonly maximum: number;
    }
  | {
      /** \`Param<a>\` at level one, \`Param<b>\` more for each level after it. */
      readonly family: "linear";
      readonly base: number;
      readonly perLevel: number;
    }
);

/** A token the extraction refused to resolve, and why. */
export interface SkillParamBoundGap {
  readonly classSlug: string;
  readonly skillSlug: string;
  readonly source: SkillParamSource;
  readonly column: string;
  readonly token: string;
  readonly reason: string;
}

/** Keyed by \`<class>/<skill>/<source file>/<column>/<token>\`, in sorted order. */
export const SKILL_PARAM_BOUNDS: Record<string, SkillParamBound> = {
`;

  const body = bounds
    .map((r) => {
      const shape =
        r.family === "diminishing"
          ? `family: "diminishing", minimum: ${r.minimum}, maximum: ${r.maximum}`
          : `family: "linear", base: ${r.base}, perLevel: ${r.perLevel}`;
      return (
        `  ${q(r.key)}: { classSlug: ${q(r.classSlug)}, skillSlug: ${q(r.skillSlug)}, ` +
        `source: ${q(r.source)}, column: ${q(r.column)}, token: ${q(r.token)}, ${shape}, ` +
        `parameters: [${r.parameters[0]}, ${r.parameters[1]}], ` +
        `labels: [${q(r.labels[0])}, ${q(r.labels[1])}], maxLevel: ${r.maxLevel} },`
      );
    })
    .join("\n");

  const gapBody = gaps
    .map(
      (g) =>
        `  { classSlug: ${q(g.classSlug)}, skillSlug: ${q(g.skillSlug)}, source: ${q(g.source)}, ` +
        `column: ${q(g.column)}, token: ${q(g.token)},\n    reason: ${q(g.reason)} },`,
    )
    .join("\n");

  const out =
    `${header}${body}\n};\n\n` +
    `/**\n` +
    ` * Tokens this extraction will not guess at.\n` +
    ` *\n` +
    ` * Listed rather than dropped, so the gap is something a reader can see and\n` +
    ` * argue with. A rule that silently covers less than it appears to is worse\n` +
    ` * than one whose blind spots are written down.\n` +
    ` */\n` +
    `export const SKILL_PARAM_BOUNDS_UNRESOLVED: readonly SkillParamBoundGap[] = [\n` +
    `${gapBody}\n];\n`;

  const target = join(process.cwd(), TARGET);

  if (check) {
    let committed: string;
    try {
      committed = readFileSync(target, "utf8");
    } catch {
      console.error(
        `${TARGET} is missing. Regenerate it with \`npx tsx scripts/skill-param-bounds.ts\`.`,
      );
      process.exit(1);
    }
    // Line endings are normalised on both sides: the repository stores LF and a
    // Windows checkout with `core.autocrlf` writes CRLF, and this check is about
    // the records rather than about what the platform wrote.
    const norm = (s: string) => s.replace(/\r\n/g, "\n");
    if (norm(committed) !== norm(out)) {
      console.error(
        `${TARGET} does not match what the pinned tables produce.\n` +
          `  committed  ${norm(committed).split("\n").length} lines\n` +
          `  regenerated ${norm(out).split("\n").length} lines\n` +
          `Re-run \`npx tsx scripts/skill-param-bounds.ts\` and read the diff. If the diff is real, ` +
          `it is a game change or a rule change and belongs in its own commit.`,
      );
      process.exit(1);
    }
    console.log(`${TARGET} reproduces byte for byte from ${SOURCE_REPO}@${SOURCE_SHA.slice(0, 7)}.`);
    console.log(`  bounds:      ${bounds.length} (${diminishing} diminishing)`);
    console.log(`  unresolved:  ${gaps.length}`);
    return;
  }

  writeFileSync(target, out, "utf8");
  console.log(`wrote ${target}`);
  console.log(`  bounds:      ${bounds.length}`);
  console.log(`  diminishing: ${diminishing}`);
  console.log(`  linear:      ${bounds.length - diminishing}`);
  console.log(`  skills:      ${new Set(bounds.map((r) => r.skillSlug)).size} across ${classes.length} classes`);
  console.log(`  unresolved:  ${gaps.length}`);
  for (const g of gaps) console.log(`    - ${g.classSlug}/${g.skillSlug} ${g.source}.${g.column} ${g.token}`);
}

/** Wording for the header's unresolved line, kept beside the list it describes. */
function SKILL_PARAM_BOUNDS_UNRESOLVED_NOTE(n: number): string {
  return n === 0
    ? "Every token in scope resolved."
    : `${n} tokens are listed in SKILL_PARAM_BOUNDS_UNRESOLVED rather than guessed at`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
