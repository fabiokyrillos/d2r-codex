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
 *                         EType, HitShift, EMin/EMax and their five level bands,
 *                         ELen/ELevLen (poison only), and the Param columns the
 *                         EFFECTS table names
 *   from skilldesc.json   SkillPage, SkillRow, SkillColumn
 *
 * Deliberately NOT extracted: `str name`, `str long`, `str short` (Blizzard's
 * descriptive prose) and `IconCel` (an index into Blizzard's sprite sheets).
 * No game text and no game artwork enters this repository. Skill names are
 * used only as identifiers to derive slugs, which the site already publishes.
 *
 * NORMALIZATION
 * -------------
 * 1. Filter to the `charclass` codes in `classOf`.
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
 * compares the prerequisite sets of every extracted skill across both and records the
 * result in the generated header. "Independent" here means separately
 * extracted snapshots of two different game versions — agreement across them
 * shows the values are not an artifact of one extraction pass, and that the
 * prerequisite graph did not change between LoD and D2R. It is not two
 * independent *publishers*, and the header says so.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { allSkills } from "../content/classes";
import { SLUG_OVERRIDES } from "./skill-graph-rules";

const SOURCE_REPO = "blizzhackers/d2data";

/**
 * The classes in scope, keyed by the game's `charclass` code.
 *
 * This is the single gate on the whole skills experience. `lib/skills.ts`
 * derives CLASSES_WITH_SKILL_PAGES from whichever classes appear in the graph,
 * so adding a code here and regenerating lights up the individual skill pages,
 * the tree on the class page, the tree on every build page, the sitemap entries
 * and the search index at once -- there is no second list to keep in step.
 */
const classOf = { pal: "paladin", sor: "sorceress", ama: "amazon" } as const;

/**
 * The exact commit the shipped graph was extracted from.
 *
 * Pinned, not `master`. A moving ref means the generator is not a function of
 * anything recorded here: re-running it a month later can rewrite the graph
 * from a source nobody chose, and the provenance header would keep claiming a
 * baseline that no longer produced it. With a SHA, `npm run gen:skill-graph`
 * either reproduces the committed file byte for byte or fails loudly.
 *
 * Updating this is a deliberate act. Bump the SHA, re-run the generator, and
 * read the diff — a changed prerequisite or unlock level is a game change and
 * belongs in its own commit with the patch notes that justify it. Never bump it
 * to "latest" as a side effect of touching this file.
 */
const SOURCE_SHA = "fc469993502d0498809b9fc1af140ee2a9eb8902";
const SOURCE_DATE = "2026-08-21";
const SOURCE_MESSAGE = "Updated for patch 3.3.93847";
/** Verified against the pinned commit on 2026-08-31. */
const VERIFIED = "2026-08-31";
const BASELINE = "D2R Patch 3.3 / Ladder Season 15 extraction";

const RAW = `https://raw.githubusercontent.com/${SOURCE_REPO}/${SOURCE_SHA}/json`;

const PATHS = {
  current: "skills.json",
  base: "base/skills.json",
  descs: "skilldesc.json",
} as const;

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
  ELen?: number; ELevLen1?: number; ELevLen2?: number; ELevLen3?: number;
}
interface RawDesc {
  skilldesc: string | number;
  SkillPage?: number;
  SkillRow?: number;
  SkillColumn?: number;
}

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** The single place a game identifier becomes a published slug. */
const slugFor = (name: string) => SLUG_OVERRIDES[name] ?? slugify(name);

/**
 * Synergies, read out of the game's own formulas.
 *
 * A skill's calc columns are expressions. Where one references another skill's
 * base level, `skill('Vigor'.blvl)`, that contribution is scaled by a `parN`,
 * and the matching `*ParamN Description` says what the parameter is for. The
 * game labels the synergy parameters itself:
 *
 *   Blessed Hammer  EDmgSymPerCalc  "(skill('Vigor'.blvl)+skill('Blessed Aim'.blvl))*par8"
 *                   *Param8 Description  "Damage synergy"
 *
 * So the rule is not a guess and not community consensus: an edge exists when
 * the referenced skill's contribution is governed by a parameter the game calls
 * a synergy.
 *
 * Exclusion is per *reference*, not per skill — a distinction worth stating,
 * because the same pair of skills can appear in two columns meaning two things:
 *
 *   Energy Shield reads Telekinesis in `calc2`, under par5, "Mana consumed per
 *   HP damage (in sixteenths)". That is a mana ratio. No edge, and Energy
 *   Shield receives no synergy anywhere else either.
 *
 *   Hydra reads Fire Bolt and Fire Ball in `sumsk2calc`/`sumsk3calc` with no
 *   parameter at all: those columns choose which missile to summon, and those
 *   two references are dropped. Hydra does still *receive* a damage synergy
 *   from both, because `EDmgSymPerCalc` references them again under par8,
 *   "Damage synergy". Both edges are in the graph. Only the summon columns are
 *   excluded.
 *
 * Concentration is a different case again, and is not excluded at all: it never
 * appears as a `skill()` reference anywhere in the extracted rows. Its boost
 * reaches Blessed Hammer through the aura state, and the only trace of it in
 * Blessed Hammer's row is `*Param1 Description`, "Damage % from Concentration
 * (in 8ths)" — a parameter description with no skill reference for it to
 * govern. There is nothing here for the rule to reject; an aura that does not
 * express itself as a formula reference is simply never a candidate.
 */
const SYNERGY_KINDS: Record<string, string> = {
  damage: "damage",
  armor: "armor",
  healing: "healing",
  "buff duration": "duration",
  "freeze length": "freeze",
  // The Valkyrie's life scales with hard points in Decoy. First non-damage,
  // non-duration synergy in the extraction, and the reason this table throws on
  // an unknown label rather than defaulting: silently calling it "damage" would
  // have put a life bonus in a damage sentence.
  "hp %": "hp",
};

const SKILL_REF = /skill\('([^']+)'\.blvl\)/g;
const PAR_REF = /par(\d+)/g;

function synergiesFor(row: RawSkill & Record<string, unknown>): { from: string; kinds: string[] }[] {
  const me = row.skill;
  const found = new Map<string, Set<string>>();

  // Every string field, not a chosen list: synergies are expressed in
  // EDmgSymPerCalc, ELenSymPerCalc, auralencalc and the numbered calcN columns,
  // and it is the parameter's description — not the column's name — that says
  // whether a reference is a synergy.
  for (const value of Object.values(row)) {
    if (typeof value !== "string" || !value.includes("skill(")) continue;

    const refs = [...value.matchAll(SKILL_REF)].map((m) => m[1]).filter((n) => n !== me);
    if (refs.length === 0) continue;

    // Every parameter this expression uses, and the kinds among them that the
    // game describes as a synergy.
    const kinds: string[] = [];
    for (const m of value.matchAll(PAR_REF)) {
      const described = row[`*Param${m[1]} Description`];
      if (typeof described !== "string" || !/synerg/i.test(described)) continue;
      const label = described.replace(/\s*synergy\s*/i, "").trim().toLowerCase();
      const kind = SYNERGY_KINDS[label];
      if (!kind) {
        throw new Error(
          `${me}: unknown synergy kind "${described}". Add it to SYNERGY_KINDS deliberately ` +
            `— an unrecognised kind must not be silently dropped or mislabelled as damage.`,
        );
      }
      kinds.push(kind);
    }
    if (kinds.length === 0) continue;

    for (const ref of refs) {
      const slug = slugFor(ref);
      if (!found.has(slug)) found.set(slug, new Set());
      for (const k of kinds) found.get(slug)!.add(k);
    }
  }

  return [...found]
    .map(([from, kinds]) => ({ from, kinds: [...kinds].sort() }))
    .sort((x, y) => x.from.localeCompare(y.from));
}

/**
 * The quantities a skill's page publishes, and where in the row they live.
 *
 * The numbers are extracted. The *mapping* is authored, and it has to be: the
 * game's own parameter descriptions are Blizzard's prose and are deliberately
 * never shipped (see LICENSING), and nothing in the table says which of eight
 * parameters a reader actually wants. So the label is ours, the parameter
 * indices are stated once here, and the values come from the row.
 *
 * Three shapes, because the game has three:
 *
 *   linear   base + perLevel x (level - 1), optionally capped
 *   step     base + floor(level / per)
 *   range    a chance that starts at `min` and climbs toward `max`
 *
 * `range` is the honest shape for the Amazon's passives, and the reason this
 * table does not simply interpolate. Critical Strike, Dodge, Avoid, Evade and
 * Pierce carry a minimum and a maximum and **no calc expression at all** -- the
 * curve between them lives in the engine, not in any column extracted here.
 * Publishing a per-level table for them would mean inventing the curve. The
 * page prints what the data supports, which is the level-1 value and the
 * ceiling, and says the rest is not in the extraction.
 */
interface EffectSpec {
  readonly labelKey: string;
  readonly unit: "percent" | "count";
  readonly shape:
    | { readonly kind: "linear"; readonly base: number; readonly perLevel: number; readonly cap?: number }
    | { readonly kind: "step"; readonly base: number; readonly per: number }
    | { readonly kind: "range"; readonly min: number; readonly max: number };
}

const par = (s: RawSkill & Record<string, unknown>, n: number): number => {
  const v = s[`Param${n}`];
  if (typeof v !== "number") {
    throw new Error(`${s.skill}: Param${n} is missing; the effect table names a parameter the row does not have`);
  }
  return v;
};

const EFFECTS: Record<string, (s: RawSkill & Record<string, unknown>) => EffectSpec[]> = {
  // Param1 Min %, Param2 Max %. No calc column; see the note above.
  "critical-strike": (s) => [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } }],
  dodge: (s) => [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } }],
  avoid: (s) => [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } }],
  evade: (s) => [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } }],
  pierce: (s) => [{ labelKey: "effectChance", unit: "percent", shape: { kind: "range", min: par(s, 1), max: par(s, 2) } }],
  // Param1 baseline, Param2 per level. Passes 100%, which is correct for an
  // attack-rating bonus and would be a bug to clamp.
  penetrate: (s) => [{ labelKey: "effectAttackRating", unit: "percent", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } }],
  // calc1: min(ln12, 24)
  "multiple-shot": (s) => [{ labelKey: "effectArrows", unit: "count", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2), cap: 24 } }],
  // calc1: min(par3 + lvl - 1, par4)
  strafe: (s) => [{ labelKey: "effectShots", unit: "count", shape: { kind: "linear", base: par(s, 3), perLevel: 1, cap: par(s, 4) } }],
  // calc1: par1 + lvl/par2 -- integer division, so a step rather than a slope.
  "charged-strike": (s) => [{ labelKey: "effectBolts", unit: "count", shape: { kind: "step", base: par(s, 1), per: par(s, 2) } }],
  // calc1: ln12
  "lightning-fury": (s) => [{ labelKey: "effectBolts", unit: "count", shape: { kind: "linear", base: par(s, 1), perLevel: par(s, 2) } }],
  // calc2: ln34
  "lightning-strike": (s) => [{ labelKey: "effectJumps", unit: "count", shape: { kind: "linear", base: par(s, 3), perLevel: par(s, 4) } }],
};

const asArray = <T,>(j: unknown): T[] => (Array.isArray(j) ? j : Object.values(j as object)) as T[];

/**
 * Fetches one pinned file and refuses anything that is not the shape we parse.
 *
 * A pin is only worth having if its disappearance is loud. A deleted repo, a
 * rewritten history or a restructured file must stop the generator with a
 * message that says which assumption broke — not yield an empty array that
 * quietly regenerates a graph with sixty skills missing.
 */
async function getJson<T>(path: string, requiredFields: readonly string[]): Promise<T[]> {
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

  let parsed: unknown;
  try {
    parsed = await res.json();
  } catch (cause) {
    throw new Error(`${path}: not valid JSON at the pinned commit`, { cause });
  }

  const rows = asArray<T>(parsed);
  if (rows.length === 0) {
    throw new Error(`${path}: parsed to zero rows at the pinned commit`);
  }
  // The columns this script reads, checked against the union of keys across
  // every row rather than against the first one. The export omits empty cells,
  // so row 0 ("Attack", a skill belonging to no class) legitimately has no
  // `charclass` — absence there is sparseness, not a schema change. A column
  // that appears on *no* row is the real signal that the format moved.
  const present = new Set<string>();
  for (const row of rows) for (const key of Object.keys(row as object)) present.add(key);
  const missing = requiredFields.filter((f) => !present.has(f));
  if (missing.length > 0) {
    throw new Error(
      `${path}: the pinned source no longer carries [${missing.join(", ")}]. ` +
        `The upstream format changed; update the parser before re-pinning.`,
    );
  }
  return rows;
}

/** Prerequisite sets keyed by slug, for one extraction. */
function prereqSets(skills: RawSkill[]): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const s of skills) {
    if (!(s.charclass !== undefined && s.charclass in classOf)) continue;
    out.set(
      slugFor(s.skill),
      [s.reqskill1, s.reqskill2].filter((x): x is string => Boolean(x)).map(slugFor).sort(),
    );
  }
  return out;
}

async function main() {
  const [current, base, descs] = await Promise.all([
    getJson<RawSkill>(PATHS.current, ["skill", "charclass", "reqlevel", "maxlvl", "skilldesc"]),
    getJson<RawSkill>(PATHS.base, ["skill", "charclass", "reqlevel"]),
    getJson<RawDesc>(PATHS.descs, ["skilldesc", "SkillPage", "SkillRow", "SkillColumn"]),
  ]);

  const mine = current.filter((s) => s.charclass !== undefined && s.charclass in classOf);
  const expected = Object.keys(classOf).length * 30;
  if (mine.length !== expected) {
    throw new Error(`expected ${expected} skills across ${Object.keys(classOf).length} classes, got ${mine.length}`);
  }

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
    const slug = slugFor(s.skill);
    const cell = cellByDesc.get(String(s.skilldesc));
    const page = cell?.page;
    const tree = authoredTree.get(slug);
    if (page === undefined) throw new Error(`no SkillPage/Row/Column for ${slug}`);
    if (!tree) throw new Error(`${slug} is in the game data but not in content/classes`);
    const key = `${classOf[s.charclass as keyof typeof classOf]}:${page}`;
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

  /*
   * Elemental duration, taken only where it decides the damage.
   *
   * `ELen` means two different things depending on the element. For poison it
   * is the window the damage is spread across, and the published number is
   * meaningless without it -- Poison Javelin's columns are damage per frame and
   * floor to zero on their own. For cold it is a freeze or chill length, and the
   * damage lands at once; multiplying by it would invent a number the game
   * never produces. So poison gets a duration and nothing else does.
   *
   * `ELevLen1..3` are three per-level bands whose boundaries this script has
   * not verified. Every poison skill in the game happens to repeat one value
   * across all three, which makes the duration plainly linear and the
   * boundaries irrelevant. That is luck, not a guarantee, so a poison skill
   * with non-uniform bands stops the generator rather than being flattened into
   * a linear scale that would be wrong from level 9 on.
   */
  const duration = (s: RawSkill) => {
    if (s.EType !== "pois") return undefined;
    const base = s.ELen ?? 0;
    if (base === 0) {
      throw new Error(
        `${s.skill}: poison damage with no ELen. Poison columns are per-frame, so ` +
          `without a duration the published damage would be zero.`,
      );
    }
    const perLevel = [s.ELevLen1 ?? 0, s.ELevLen2 ?? 0, s.ELevLen3 ?? 0];
    if (new Set(perLevel).size > 1) {
      throw new Error(
        `${s.skill}: poison duration grows in uneven bands [${perLevel.join(", ")}]. ` +
          `The band boundaries are unverified, so this cannot be emitted as a linear ` +
          `scale. Establish them deliberately before re-pinning.`,
      );
    }
    return { base, perLevel: perLevel[0] };
  };

  const rows = mine
    .map((s) => {
      const slug = slugFor(s.skill);
      const cell = cellByDesc.get(String(s.skilldesc))!;
      const classSlug = classOf[s.charclass as keyof typeof classOf];
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
        synergies: synergiesFor(s as RawSkill & Record<string, unknown>),
        effects: EFFECTS[slug]?.(s as RawSkill & Record<string, unknown>) ?? [],
        damage: hasDamage
          ? {
              element: s.EType!,
              hitShift: s.HitShift ?? 8,
              min: { base: s.EMin ?? 0, bands: bands(s, "EMin") },
              max: { base: s.EMax ?? s.EMin ?? 0, bands: bands(s, s.EMax === undefined ? "EMin" : "EMax") },
              duration: duration(s),
            }
          : undefined,
      };
    })
    .sort((x, y) =>
      x.classSlug.localeCompare(y.classSlug) || x.page - y.page ||
      x.row - y.row || x.column - y.column,
    );

  /*
   * Every extracted synergy must point at a skill of the same class that we
   * actually publish. A cross-class or unknown target means the slugifier and
   * the game's naming have diverged, and shipping it would render a dead name.
   */
  {
    const byslug = new Map(rows.map((r) => [r.slug, r]));
    for (const r of rows) {
      for (const syn of r.synergies) {
        const target = byslug.get(syn.from);
        if (!target) {
          throw new Error(`${r.slug}: synergy source "${syn.from}" is not an extracted skill`);
        }
        if (target.classSlug !== r.classSlug) {
          throw new Error(
            `${r.slug} (${r.classSlug}) takes a synergy from ${syn.from} (${target.classSlug})`,
          );
        }
      }
    }
    if (rows.every((r) => r.synergies.length === 0)) {
      throw new Error("no synergies were extracted at all; the calc columns must have moved");
    }
  }

  const eff = (list: (typeof rows)[number]["effects"]) =>
    list.length === 0
      ? ""
      : `
    effects: [` +
        list
          .map((e) => {
            const sh = e.shape;
            const body =
              sh.kind === "linear"
                ? `kind: "linear", base: ${sh.base}, perLevel: ${sh.perLevel}${sh.cap === undefined ? "" : `, cap: ${sh.cap}`}`
                : sh.kind === "step"
                  ? `kind: "step", base: ${sh.base}, per: ${sh.per}`
                  : `kind: "range", min: ${sh.min}, max: ${sh.max}`;
            return `{ labelKey: "${e.labelKey}", unit: "${e.unit}", shape: { ${body} } }`;
          })
          .join(", ") +
        `],`;

  const dmg = (d: (typeof rows)[number]["damage"]) =>
    d
      ? `, damage: { element: "${d.element}", hitShift: ${d.hitShift}, ` +
        `min: { base: ${d.min.base}, bands: [${d.min.bands.join(", ")}] }, ` +
        `max: { base: ${d.max.base}, bands: [${d.max.bands.join(", ")}] }` +
        (d.duration
          ? `, duration: { base: ${d.duration.base}, perLevel: ${d.duration.perLevel} }, overTime: true`
          : "") +
        ` }`
      : "";

  const body = rows
    .map(
      (r) =>
        `  "${r.slug}": {\n` +
        `    classSlug: "${r.classSlug}", tree: "${r.tree}", page: ${r.page}, row: ${r.row}, column: ${r.column},\n` +
        `    requiredLevel: ${r.requiredLevel}, maxLevel: ${r.maxLevel},\n` +
        `    prerequisites: [${r.prerequisites.map((p) => `"${p}"`).join(", ")}],\n` +
        `    synergies: [${r.synergies
          .map((s) => `{ from: "${s.from}", kinds: [${s.kinds.map((k) => `"${k}"`).join(", ")}] }`)
          .join(", ")}]${dmg(r.damage)},${eff(r.effects)}\n` +
        `  },`,
    )
    .join("\n");

  const disagreeNote = disagree.length ? ` (differs: ${disagree.join(", ")})` : "";

  const header = `/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with \`npm run gen:skill-graph\` (see scripts/generate-skill-graph.ts).
 *
 * The canonical skill graph for every class in scope: which tree a skill
 * belongs to, what character level unlocks it, and which skills the game
 * requires before it can be allocated.
 *
 * PROVENANCE
 *   Repository  ${SOURCE_REPO}
 *   Commit      ${SOURCE_SHA}
 *               ${SOURCE_DATE} — "${SOURCE_MESSAGE}"
 *   Verified    ${VERIFIED}
 *   Paths       json/${PATHS.current}, json/${PATHS.descs}, json/${PATHS.base}
 *   Baseline    ${BASELINE}
 *   Regenerate  npm run gen:skill-graph
 *   Fields      skills.json:    charclass, reqlevel, reqskill1, reqskill2,
 *                               maxlvl, EType, HitShift, EMin/EMax + bands,
 *                               and the calc/Param columns that carry synergies
 *               skilldesc.json: SkillPage, SkillRow, SkillColumn
 *
 * SYNERGIES
 *   Extracted, not authored. An edge exists where a skill's calc expression
 *   references another skill's base level and that contribution is scaled by a
 *   parameter the game itself describes as a synergy — for example Blessed
 *   Hammer's \`(skill('Vigor'.blvl)+skill('Blessed Aim'.blvl))*par8\` with
 *   \`*Param8 Description\` reading "Damage synergy".
 *
 *   Exclusion is per reference, not per skill. Energy Shield reads Telekinesis
 *   under a parameter that sets its mana ratio, and Hydra reads Fire Bolt and
 *   Fire Ball in its summon columns to choose which missile to cast; those
 *   references carry no synergy parameter and produce no edge. Hydra does still
 *   receive a damage synergy from both, declared separately in
 *   \`EDmgSymPerCalc\` — the exclusion covers the summon columns only.
 *
 *   Concentration is not excluded: it never appears as a \`skill()\` reference
 *   at all. Its boost to Blessed Hammer arrives through the aura state, leaving
 *   only a parameter description behind, so there is no reference for the rule
 *   to weigh.
 *
 *   Two Amazon cases follow the same rule to the same conclusion. Multiple Shot
 *   reads Guided Arrow under a parameter the game calls "Damage % per level"
 *   rather than a synergy, and the Valkyrie reads Dodge, Avoid, Evade and
 *   Critical Strike under no parameter at all -- those columns set the summon's
 *   own skill levels. Neither produces an edge. The Valkyrie's one real synergy
 *   is Decoy, under a parameter the game itself labels "HP % synergy".
 *   Extracted   ${rows.length} skills (${Object.values(classOf)
    .map((c) => `${rows.filter((r) => r.classSlug === c).length} ${c}`)
    .join(", ")})
 *
 *   The commit is pinned, not \`master\`. Re-running the generator reproduces
 *   this file exactly, or fails; it never silently follows the source forward.
 *   Moving to a newer extraction means bumping SOURCE_SHA on purpose and
 *   reading the diff as a game change.
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
  readonly classSlug: Extract<ClassSlug, "paladin" | "sorceress" | "amazon">;
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
   * Skills this one *receives* a synergy bonus from — the only authored
   * direction. \`synergyReceivers\` in lib/skills.ts derives the reverse.
   *
   * \`kinds\` is what the bonus improves, as the game's own parameter labels
   * name it: damage, armor, healing, duration, freeze. A skill can receive two
   * kinds from one source, which is why this is a list.
   */
  readonly synergies: readonly { readonly from: Slug; readonly kinds: readonly string[] }[];
  /**
   * Base elemental damage before synergies. Absent for skills that deal none.
   * Final value = (base + banded per-level total) x 2^(hitShift - 8).
   */
  readonly damage?: {
    readonly element: string;
    readonly hitShift: number;
    readonly min: BandedScale;
    readonly max: BandedScale;
    /**
     * Poison only, and load-bearing.
     *
     * Poison's EMin/EMax are damage **per frame**, and the columns are tiny:
     * Poison Javelin's 32 at HitShift 0 is 32/256 of a point per frame. Read as
     * an instant range the way every other element is, it floors to zero and
     * the page publishes "0-0" for a skill that deals thousands.
     *
     * The real number is per-frame damage times the duration, so the duration
     * has to travel with the damage rather than be reconstructed later.
     * \`frames\` is in D2's 25-per-second frames.
     */
    readonly duration?: {
      readonly base: number;
      readonly perLevel: number;
    };
    /**
     * True when \`duration\` is the window the damage is spread across rather
     * than a status length. Poison spreads; cold's ELen is a freeze length and
     * its damage lands at once, so multiplying it would be a fabrication.
     */
    readonly overTime?: boolean;
  };
  /**
   * Published quantities other than damage: a chance, a projectile count, an
   * attack-rating bonus. Empty for most skills.
   *
   * \`labelKey\` names a UI dictionary entry rather than carrying text, so sixty
   * skills do not turn into sixty hand-translated strings for a dozen distinct
   * words. \`range\` is a chance whose minimum and maximum the game states and
   * whose curve between them it does not: the Amazon's five passives carry no
   * calc column at all, so anything printed per level would be invented.
   */
  readonly effects?: readonly {
    readonly labelKey: string;
    readonly unit: "percent" | "count";
    readonly shape:
      | { readonly kind: "linear"; readonly base: number; readonly perLevel: number; readonly cap?: number }
      | { readonly kind: "step"; readonly base: number; readonly per: number }
      | { readonly kind: "range"; readonly min: number; readonly max: number };
  }[];
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
  const edges = rows.reduce((n, r) => n + r.synergies.length, 0);
  console.log(
    `  synergies: ${edges} edges across ${rows.filter((r) => r.synergies.length).length} receivers`,
  );
  console.log(`  trees:     ${[...treeByClassPage.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
