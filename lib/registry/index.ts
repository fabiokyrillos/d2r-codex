import type {
  BreakpointTable,
  Build,
  CharacterClass,
  FarmingArea,
  ItemRef,
  Mercenary,
  MechanicArticle,
  ProgressionJourney,
  Rune,
  Runeword,
  Skill,
  SkillTree,
  Slug,
  UniqueItem,
} from "@/lib/types";

import { runes } from "@/content/runes/runes";
import { runewords } from "@/content/runewords/runewords";
import { uniques } from "@/content/items/uniques";
import { classes } from "@/content/classes/classes";
import { allSkills, allSkillTrees } from "@/content/classes";
import { builds } from "@/content/builds";
import { farmingAreas } from "@/content/farming/areas";
import { mercenaries } from "@/content/mercenaries/mercenaries";
import { journeys } from "@/content/progression";
import { breakpointTables } from "@/content/breakpoints/breakpoints";
import { mechanics } from "@/content/mechanics/mechanics";

/**
 * The single data-access layer.
 *
 * Everything in `content/` is plain TypeScript, so all of this is resolved at
 * build time and tree-shaken into the static pages that need it. When a real
 * database or CMS arrives, only this module changes: pages and components talk
 * to these functions, never to the content modules directly.
 *
 * The lookup maps are built once per module instantiation rather than on each
 * call, so page generation over hundreds of routes stays linear.
 */

function indexBy<T extends { slug: Slug }>(items: readonly T[]): Map<Slug, T> {
  const map = new Map<Slug, T>();
  for (const item of items) {
    if (map.has(item.slug)) {
      throw new Error(`Duplicate slug in content: "${item.slug}"`);
    }
    map.set(item.slug, item);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

const runeIndex = indexBy(runes);
const runewordIndex = indexBy(runewords);
const uniqueIndex = indexBy(uniques);
const classIndex = indexBy(classes);
const buildIndex = indexBy(builds);
const areaIndex = indexBy(farmingAreas);
const mercIndex = indexBy(mercenaries);
const skillIndex = indexBy(allSkills);
const treeIndex = indexBy(allSkillTrees);
const breakpointIndex = indexBy(breakpointTables);
const mechanicIndex = indexBy(mechanics);

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export const getRunes = (): Rune[] => [...runes].sort((a, b) => a.number - b.number);
export const getRunewords = (): Runeword[] => [...runewords];
export const getUniques = (): UniqueItem[] => [...uniques];
export const getClasses = (): CharacterClass[] => [...classes];
export const getBuilds = (): Build[] => [...builds];
export const getFarmingAreas = (): FarmingArea[] => [...farmingAreas];
export const getMercenaries = (): Mercenary[] => [...mercenaries];
export const getSkills = (): Skill[] => [...allSkills];
export const getSkillTrees = (): SkillTree[] => [...allSkillTrees];
export const getJourneys = (): ProgressionJourney[] => [...journeys];
export const getBreakpointTables = (): BreakpointTable[] => [...breakpointTables];
export const getMechanics = (): MechanicArticle[] => [...mechanics];

// ---------------------------------------------------------------------------
// Single lookups
// ---------------------------------------------------------------------------

export const getRune = (slug: Slug) => runeIndex.get(slug);
export const getRuneword = (slug: Slug) => runewordIndex.get(slug);
export const getUnique = (slug: Slug) => uniqueIndex.get(slug);
export const getClass = (slug: Slug) => classIndex.get(slug);
export const getBuild = (slug: Slug) => buildIndex.get(slug);
export const getFarmingArea = (slug: Slug) => areaIndex.get(slug);
export const getMercenary = (slug: Slug) => mercIndex.get(slug);
export const getSkill = (slug: Slug) => skillIndex.get(slug);
export const getSkillTree = (slug: Slug) => treeIndex.get(slug);
export const getBreakpointTable = (slug: Slug) => breakpointIndex.get(slug);
export const getMechanic = (slug: Slug) => mechanicIndex.get(slug);

export const getJourney = (classSlug: Slug) =>
  journeys.find((j) => j.classSlug === classSlug);

/**
 * Breakpoint tables that apply to a class — either explicitly tagged with it,
 * or shared tables that name the class in their title.
 */
export const getBreakpointsForClass = (classSlug: Slug, className: string) =>
  breakpointTables.filter(
    (t) => t.classSlug === classSlug || t.name.includes(className),
  );

// ---------------------------------------------------------------------------
// Scoped queries
// ---------------------------------------------------------------------------

export const getBuildsForClass = (classSlug: Slug) =>
  builds.filter((b) => b.classSlug === classSlug);

export const getSkillsForClass = (classSlug: Slug) =>
  allSkills.filter((s) => s.classSlug === classSlug);

export const getTreesForClass = (classSlug: Slug) =>
  allSkillTrees
    .filter((t) => t.classSlug === classSlug)
    .sort((a, b) => a.order - b.order);

export const getSkillsInTree = (treeSlug: Slug) =>
  allSkills
    .filter((s) => s.tree === treeSlug)
    .sort((a, b) => a.requiredLevel - b.requiredLevel || a.name.localeCompare(b.name));

/** Runewords that use a given rune — the reverse index the rune pages need. */
export const getRunewordsUsingRune = (runeSlug: Slug) =>
  runewords.filter((rw) => rw.runes.includes(runeSlug));

// ---------------------------------------------------------------------------
// Reverse cross-references
// ---------------------------------------------------------------------------

function refMatches(ref: ItemRef, kind: ItemRef["kind"], slug: Slug) {
  return ref.kind === kind && ref.slug === slug;
}

/** Every ItemRef mentioned anywhere in a build's gear progression. */
function collectBuildRefs(build: Build): ItemRef[] {
  const refs: ItemRef[] = [];
  const walkPick = (pick: { ref?: ItemRef; alternatives?: unknown[] }) => {
    if (pick.ref) refs.push(pick.ref);
    for (const alt of (pick.alternatives ?? []) as typeof pick[]) walkPick(alt);
  };
  for (const set of build.gearSets) {
    for (const entry of set.slots) entry.picks.forEach(walkPick);
    (set.charms ?? []).forEach(walkPick);
    (set.weaponSwap ?? []).forEach(walkPick);
  }
  return refs;
}

/**
 * Builds that use a given item. This is what makes an item page useful:
 * "who actually wants this?" is the question readers arrive with.
 */
export function getBuildsUsingItem(kind: ItemRef["kind"], slug: Slug): Build[] {
  return builds.filter((build) =>
    collectBuildRefs(build).some((ref) => refMatches(ref, kind, slug)),
  );
}

/** Builds that list a given farming area as a recommended farm. */
export function getBuildsFarmingArea(areaSlug: Slug): Build[] {
  return builds.filter((b) => b.farming.some((f) => f.area === areaSlug));
}

/** Farming areas where a given item is a called-out drop. */
export function getAreasDroppingItem(kind: ItemRef["kind"], slug: Slug): FarmingArea[] {
  return farmingAreas.filter((a) =>
    (a.notableDrops ?? []).some((ref) => refMatches(ref, kind, slug)),
  );
}

export * from "./resolve";
