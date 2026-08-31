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
 *   from skills.json      reqlevel, reqskill1, reqskill2, charclass
 *   from skilldesc.json   SkillPage
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
}
interface RawDesc {
  skilldesc: string | number;
  SkillPage?: number;
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
  const pageByDesc = new Map<string, number>();
  for (const d of descs) if (d.SkillPage !== undefined) pageByDesc.set(String(d.skilldesc), d.SkillPage);

  // --- tree slugs, derived from the site's own membership ------------------
  const authoredTree = new Map(allSkills.map((s) => [s.slug, s.tree]));
  const treeByClassPage = new Map<string, string>();
  for (const s of mine) {
    const slug = slugify(s.skill);
    const page = pageByDesc.get(String(s.skilldesc));
    const tree = authoredTree.get(slug);
    if (page === undefined) throw new Error(`no SkillPage for ${slug}`);
    if (!tree) throw new Error(`${slug} is in the game data but not in content/classes`);
    const key = `${classOf[s.charclass as "pal" | "sor"]}:${page}`;
    const seen = treeByClassPage.get(key);
    if (seen && seen !== tree) {
      throw new Error(`page ${key} maps to two authored trees: ${seen} and ${tree}`);
    }
    treeByClassPage.set(key, tree);
  }

  // --- emit ----------------------------------------------------------------
  const rows = mine
    .map((s) => {
      const slug = slugify(s.skill);
      const page = pageByDesc.get(String(s.skilldesc))!;
      const classSlug = classOf[s.charclass as "pal" | "sor"];
      return {
        slug,
        classSlug,
        tree: treeByClassPage.get(`${classSlug}:${page}`)!,
        page,
        requiredLevel: s.reqlevel,
        prerequisites: a.get(slug)!,
      };
    })
    .sort((x, y) =>
      x.classSlug.localeCompare(y.classSlug) || x.page - y.page ||
      x.requiredLevel - y.requiredLevel || x.slug.localeCompare(y.slug),
    );

  const body = rows
    .map(
      (r) =>
        `  "${r.slug}": { classSlug: "${r.classSlug}", tree: "${r.tree}", page: ${r.page}, ` +
        `requiredLevel: ${r.requiredLevel}, prerequisites: [${r.prerequisites.map((p) => `"${p}"`).join(", ")}] },`,
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
 *   Fields      skills.json:    charclass, reqlevel, reqskill1, reqskill2
 *               skilldesc.json: SkillPage
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

export interface SkillGraphNode {
  readonly classSlug: Extract<ClassSlug, "paladin" | "sorceress">;
  /** The site's tree slug, derived from the game's 1-based skill page. */
  readonly tree: Slug;
  /** 1-based skill page, straight from the game data. Independent of \`tree\`. */
  readonly page: 1 | 2 | 3;
  readonly requiredLevel: number;
  /** Skills needing at least one point before this can be allocated. */
  readonly prerequisites: readonly Slug[];
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
  console.log(`  trees:     ${[...treeByClassPage.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
