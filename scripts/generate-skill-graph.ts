/**
 * Regenerates `content/classes/skill-graph.ts` from the game's own tables.
 *
 * Run with `npm run gen:skill-graph`. Requires network access; it is a manual
 * tool, not part of the build.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site's skill prerequisites were authored by hand and 29 of 60 were
 * wrong — see `docs/spec/0001-skills-experience.md` §0. Hand-authoring a graph
 * that the reader can *see drawn* is how that happened: a plausible-looking
 * edge is indistinguishable from a correct one until something checks it.
 *
 * So the graph is no longer authored. It is extracted, and the validator
 * checks both the authored content and every build's skill plan against this
 * file rather than against the authored table that produced the error.
 *
 * WHAT IS EXTRACTED
 * -----------------
 * Only mechanical facts, which are not copyrightable:
 *
 *   from skills.json      charclass, reqlevel, reqskill1, reqskill2, maxlvl,
 *                         EType, HitShift, EMin/EMax and their five level bands
 *   from skilldesc.json   SkillPage, SkillRow, SkillColumn
 *
 * Deliberately NOT extracted: `str name`, `str long`, `str short` (Blizzard's
 * descriptive prose) and `IconCel` (an index into Blizzard's sprite sheets).
 * No game text and no game artwork enters this repository. Skill names are
 * used only as identifiers to derive slugs, which the site already publishes.
 *
 * NORMALIZATION
 * -------------
 * 1. Filter to `charclass` of `pal` or `sor`.
 * 2. Slugify the skill's identifier: lowercase, non-alphanumerics to `-`.
 *    "Fist of the Heavens" -> "fist-of-the-heavens".
 * 3. Prerequisites are `reqskill1` and `reqskill2`, slugified, empties
 *    dropped, sorted for stable output.
 * 4. `SkillPage` is joined from skilldesc.json on the `skilldesc` key.
 * 5. Tree slugs are derived by membership: every skill the site already
 *    assigns to a tree must agree on which game page that tree is. The script
 *    fails if a page maps to more than one authored tree.
 *
 * AGREEMENT CHECK
 * ---------------
 * The repository ships two independent extractions: the current D2R tables and
 * the pre-D2R Lord of Destruction tables under `json/base/`. This script
 * compares the prerequisite sets of all 60 skills across both and records the
 * result in the generated header. "Independent" here means separately
 * extracted snapshots of two different game versions — agreement across them
 * shows the values are not an artifact of one extraction pass, and that the
 * prerequisite graph did not change between LoD and D2R. It is not two
 * independent *publishers*, and the header says so.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { allSkills } from "../content/classes";

const RAW = "https://raw.githubusercontent.com/blizzhackers/d2data/master/json";
const SOURCE_REPO = "blizzhackers/d2data";
const BASELINE = "D2R Patch 3.3 / Ladder Season 15 extraction";

interface RawSkill {
  skill: string;
  charclass?: string;
  skilldesc?: string | number;
  reqlevel: number;
  reqskill1?: string;
  reqskill2?: string;
  maxlvl?: number;
  EType?: string;
  HitShift?: number;
  EMin?: number; EMinLev1?: number; EMinLev2?: number; EMinLev3?: number; EMinLev4?: number; EMinLev5?: number;
  EMax?: number; EMaxLev1?: number; EMaxLev2?: number; EMaxLev3?: number; EMaxLev4?: number; EMaxLev5?: number;
}
interface RawDesc {
  skilldesc: string | number;
  SkillPage?: number;
  SkillRow?: number;
  SkillColumn?: number;
}

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const asArray = <T,>(j: unknown): T[] => (Array.isArray(j) ? j : Object.values(j as object)) as T[];

async function getJson<T>(path: string): Promise<T[]> {
  const res = await fetch(`${RAW}/${path}`);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return asArray<T>(await res.json());
}

/** Prerequisite sets keyed by slug, for one extraction. */
function prereqSets(skills: RawSkill[]): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const s of skills) {
    if (s.charclass !== "pal" && s.charclass !== "sor") continue;
    out.set(
      slugify(s.skill),
      [s.reqskill1, s.reqskill2].filter((x): x is string => Boolean(x)).map(slugify).sort(),
    );
  }
  return out;
}

async function main() {
  const [current, base, descs] = await Promise.all([
    getJson<RawSkill>("skills.json"),
    getJson<RawSkill>("base/skills.json"),
    getJson<RawDesc>("skilldesc.json"),
  ]);

  const classOf = { pal: "paladin", sor: "sorceress" } as const;
  const mine = current.filter((s) => s.charclass === "pal" || s.charclass === "sor");
  if (mine.length !== 60) throw new Error(`expected 60 skills, got ${mine.length}`);

  // --- agreement check across the two extractions --------------------------
  const a = prereqSets(current);
  const b = prereqSets(base);
  let agree = 0;
  const disagree: string[] = [];
  for (const [slug, pre] of a) {
    const other = b.get(slug);
    if (other && JSON.stringify(pre) === JSON.stringify(other)) agree++;
    else disagree.push(slug);
  }

  // --- page join -----------------------------------------------------------
  const cellByDesc = new Map<string, { page: number; row: number; column: number }>();
  for (const d of descs) {
    if (d.SkillPage === undefined || d.SkillRow === undefined || d.SkillColumn === undefined) continue;
    cellByDesc.set(String(d.skilldesc), { page: d.SkillPage, row: d.SkillRow, column: d.SkillColumn });
  }

  // --- tree slugs, derived from the site's own membership ------------------
  const authoredTree = new Map(allSkills.map((s) => [s.slug, s.tree]));
  const treeByClassPage = new Map<string, string>();
  for (const s of mine) {
    const slug = slugify(s.skill);
    const cell = cellByDesc.get(String(s.skilldesc));
    const page = cell?.page;
    const tree = authoredTree.get(slug);
    if (page === undefined) throw new Error(`no SkillPage/Row/Column for ${slug}`);
    if (!tree) throw new Error(`${slug} is in the game data but not in content/classes`);
    const key = `${classOf[s.charclass as "pal" | "sor"]}:${page}`;
    const seen = treeByClassPage.get(key);
    if (seen && seen !== tree) {
      throw new Error(`page ${key} maps to two authored trees: ${seen} and ${tree}`);
    }
    treeByClassPage.set(key, tree);
  }

  // --- emit ----------------------------------------------------------------
  /** D2 adds a different amount per level inside five bands. */
  const bands = (s: RawSkill, k: "EMin" | "EMax") =>
    [1, 2, 3, 4, 5].map((i) => (s[`${k}Lev${i}` as keyof RawSkill] as number | undefined) ?? 0);

  const rows = mine
    .map((s) => {
      const slug = slugify(s.skill);
      const cell = cellByDesc.get(String(s.skilldesc))!;
      const classSlug = classOf[s.charclass as "pal" | "sor"];
      const hasDamage = s.EType !== undefined && s.EType !== "" && s.EMin !== undefined;
      return {
        slug,
        classSlug,
        tree: treeByClassPage.get(`${classSlug}:${cell.page}`)!,
        page: cell.page,
        row: cell.row,
        column: cell.column,
        requiredLevel: s.reqlevel,
        maxLevel: s.maxlvl ?? 20,
        prerequisites: a.get(slug)!,
        damage: hasDamage
          ? {
              element: s.EType!,
              hitShift: s.HitShift ?? 8,
              min: { base: s.EMin ?? 0, bands: bands(s, "EMin") },
              max: { base: s.EMax ?? s.EMin ?? 0, bands: bands(s, s.EMax === undefined ? "EMin" : "EMax") },
            }
          : undefined,
      };
    })
    .sort((x, y) =>
      x.classSlug.localeCompare(y.classSlug) || x.page - y.page ||
      x.row - y.row || x.column - y.column,
    );

  const dmg = (d: (typeof rows)[number]["damage"]) =>
    d
      ? `, damage: { element: "${d.element}", hitShift: ${d.hitShift}, ` +
        `min: { base: ${d.min.base}, bands: [${d.min.bands.join(", ")}] }, ` +
        `max: { base: ${d.max.base}, bands: [${d.max.bands.join(", ")}] } }`
      : "";

  const body = rows
    .map(
      (r) =>
        `  "${r.slug}": {\n` +
        `    classSlug: "${r.classSlug}", tree: "${r.tree}", page: ${r.page}, row: ${r.row}, column: ${r.column},\n` +
        `    requiredLevel: ${r.requiredLevel}, maxLevel: ${r.maxLevel},\n` +
        `    prerequisites: [${r.prerequisites.map((p) => `"${p}"`).join(", ")}]${dmg(r.damage)},\n` +
        `  },`,
    )
    .join("\n");

  const disagreeNote = disagree.length ? ` (differs: ${disagree.join(", ")})` : "";

  const header = `/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with \`npm run gen:skill-graph\` (see scripts/generate-skill-graph.ts).
 *
 * The canonical skill graph for the Paladin and the Sorceress: which tree a
 * skill belongs to, what character level unlocks it, and which skills the game
 * requires before it can be allocated.
 *
 * PROVENANCE
 *   Source      ${SOURCE_REPO}, \`json/skills.json\` and \`json/skilldesc.json\`
 *   Baseline    ${BASELINE}
 *   Fields      skills.json:    charclass, reqlevel, reqskill1, reqskill2,
 *                               maxlvl, EType, HitShift, EMin/EMax + bands
 *               skilldesc.json: SkillPage, SkillRow, SkillColumn
 *   Extracted   ${rows.length} skills (${rows.filter((r) => r.classSlug === "paladin").length} Paladin, ${rows.filter((r) => r.classSlug === "sorceress").length} Sorceress)
 *
 * AGREEMENT
 *   Prerequisite sets identical across the repository's two extractions —
 *   the current D2R tables and the pre-D2R Lord of Destruction tables under
 *   \`json/base/\` — for ${agree} of ${a.size} skills${disagreeNote}.
 *
 *   These are two snapshots of different game versions from one extraction
 *   project, not two independent publishers. Their agreement shows the values
 *   are not an artifact of a single extraction pass and that the prerequisite
 *   graph did not change between LoD and D2R. It is not corroboration by an
 *   unrelated party, and it is not evidence about patches after the baseline.
 *
 * LICENSING
 *   The repository is MIT licensed, but its contents are extracted from
 *   Blizzard's game files and Blizzard owns the underlying data. Only
 *   mechanical facts are taken here — unlock levels, prerequisite edges, tree
 *   membership — which are not copyrightable. No game text and no game
 *   artwork is extracted: \`str name\`/\`str long\` (Blizzard's prose) and
 *   \`IconCel\` (sprite-sheet indices) are deliberately excluded. See
 *   docs/sources/README.md.
 */

import type { ClassSlug, Slug } from "@/lib/types";

/**
 * Damage that scales in five level bands rather than linearly: a different
 * amount is added per level within levels 2-8, 9-16, 17-22, 23-28 and 29+.
 * Modelling this as linear is the easiest way to publish a wrong number.
 */
export interface BandedScale {
  readonly base: number;
  readonly bands: readonly number[];
}

export interface SkillGraphNode {
  readonly classSlug: Extract<ClassSlug, "paladin" | "sorceress">;
  /** The site's tree slug, derived from the game's 1-based skill page. */
  readonly tree: Slug;
  /** 1-based skill page, straight from the game data. Independent of \`tree\`. */
  readonly page: 1 | 2 | 3;
  /** 1-based row. INVARIANT: TIER_LEVELS[row - 1] === requiredLevel. */
  readonly row: 1 | 2 | 3 | 4 | 5 | 6;
  /** 1-based column, left to right. */
  readonly column: 1 | 2 | 3;
  readonly requiredLevel: number;
  /** Hard-point cap. 20 for every Paladin and Sorceress skill. */
  readonly maxLevel: number;
  /** Skills needing at least one point before this can be allocated. */
  readonly prerequisites: readonly Slug[];
  /**
   * Base elemental damage before synergies. Absent for skills that deal none.
   * Final value = (base + banded per-level total) x 2^(hitShift - 8).
   */
  readonly damage?: {
    readonly element: string;
    readonly hitShift: number;
    readonly min: BandedScale;
    readonly max: BandedScale;
  };
}

/** Keyed by skill slug. */
export const SKILL_GRAPH: Record<Slug, SkillGraphNode> = {
`;

  const out = `${header}${body}\n};\n\n/** Character level thresholds, indexed by tree row. */\nexport const TIER_LEVELS = [1, 6, 12, 18, 24, 30] as const;\n\n/** Hard skill points at level 99: 98 level-ups plus 12 from quests. */\nexport const MAX_HARD_POINTS = 110;\n`;

  const target = join(process.cwd(), "content", "classes", "skill-graph.ts");
  writeFileSync(target, out, "utf8");

  console.log(`wrote ${target}`);
  console.log(`  skills:    ${rows.length}`);
  console.log(`  agreement: ${agree}/${a.size} across the two extractions`);
  console.log(`  damage:    ${rows.filter((r) => r.damage).length} skills carry base damage`);
  console.log(`  trees:     ${[...treeByClassPage.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
