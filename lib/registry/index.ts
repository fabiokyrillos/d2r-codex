import type {
  BreakpointTable,
  Build,
  CharacterClass,
  FarmingArea,
  ItemRef,
  MechanicArticle,
  Mercenary,
  ProgressionJourney,
  Rune,
  Runeword,
  Skill,
  SkillTree,
  Slug,
  UniqueItem,
} from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";

import { runes as baseRunes } from "@/content/runes/runes";
import { runewords as baseRunewords } from "@/content/runewords/runewords";
import { uniques as baseUniques } from "@/content/items/uniques";
import { classes as baseClasses } from "@/content/classes/classes";
import { allSkills, allSkillTrees } from "@/content/classes";
import { builds as baseBuilds } from "@/content/builds";
import { farmingAreas as baseAreas } from "@/content/farming/areas";
import { mercenaries as baseMercenaries } from "@/content/mercenaries/mercenaries";
import { journeys as baseJourneys } from "@/content/progression";
import { breakpointTables as baseBreakpoints } from "@/content/breakpoints/breakpoints";
import { mechanics as baseMechanics } from "@/content/mechanics/mechanics";

import { OVERLAYS } from "./overlays";
import { localize } from "./localize";

/**
 * The single data-access layer, now locale-aware.
 *
 * Every getter takes a `Locale`. That is deliberately explicit rather than
 * reading `next/root-params` internally: the registry is also consumed by
 * `app/sitemap.ts` (which lives outside the `[lang]` segment and must emit both
 * languages) and by `scripts/check-content.ts` (a plain Node script with no
 * request context at all).
 *
 * en-US content is colocated with the invariant data, so localisation is the
 * identity for it. Other locales merge a slug-keyed overlay over the top — see
 * `lib/types/copy.ts` for what counts as invariant and what counts as copy.
 *
 * Lookup maps are still built once per module instantiation, per locale, so
 * generating hundreds of routes stays linear.
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

/** Caches the localized collections so repeated calls do not re-merge. */
function memoByLocale<T>(build: (locale: Locale) => T): (locale: Locale) => T {
  const cache = new Map<Locale, T>();
  return (locale: Locale) => {
    let value = cache.get(locale);
    if (value === undefined) {
      value = build(locale);
      cache.set(locale, value);
    }
    return value;
  };
}

// ---------------------------------------------------------------------------
// Localized collections
// ---------------------------------------------------------------------------

const runesFor = memoByLocale((locale) =>
  localize(baseRunes, locale, OVERLAYS.runes),
);

const runewordsFor = memoByLocale((locale) =>
  localize(baseRunewords, locale, OVERLAYS.runewords, (base, copy) => ({
    ...base,
    summary: copy.summary,
    recommendedBases: copy.recommendedBases ?? base.recommendedBases,
    usedBy: copy.usedBy ?? base.usedBy,
    commonMistakes: copy.commonMistakes ?? base.commonMistakes,
    notes: copy.notes ?? base.notes,
    // Stat lines are game strings and stay English; the only exception is the
    // "not yet verified" placeholder on the expansion runewords.
    stats: copy.stats ?? base.stats,
    bases: {
      ...base.bases,
      display: copy.basesDisplay,
      exclusions: copy.basesExclusions ?? base.bases.exclusions,
    },
  })),
);

const uniquesFor = memoByLocale((locale) =>
  localize(baseUniques, locale, OVERLAYS.items, (base, copy) => ({
    ...base,
    summary: copy.summary,
    notes: copy.notes ?? base.notes,
    drop: base.drop
      ? { ...base.drop, summary: copy.dropSummary ?? base.drop.summary }
      : base.drop,
  })),
);

const classesFor = memoByLocale((locale) =>
  localize(baseClasses, locale, OVERLAYS.classes),
);

const skillsFor = memoByLocale((locale) =>
  localize(allSkills, locale, OVERLAYS.skills),
);

const skillTreesFor = memoByLocale((locale) =>
  localize(allSkillTrees, locale, OVERLAYS.skillTrees),
);

const areasFor = memoByLocale((locale) =>
  localize(baseAreas, locale, OVERLAYS.areas, (base, copy) => ({
    ...base,
    summary: copy.summary,
    access: copy.access,
    why: copy.why,
    route: copy.route ?? base.route,
    notes: copy.notes ?? base.notes,
    poorlySuitedTo: copy.poorlySuitedTo ?? base.poorlySuitedTo,
    bosses: base.bosses?.map((boss, i) => ({
      ...boss,
      notes: copy.bosses?.[i]?.notes ?? boss.notes,
    })),
  })),
);

const mercenariesFor = memoByLocale((locale) =>
  localize(baseMercenaries, locale, OVERLAYS.mercenaries, (base, copy) => ({
    ...base,
    summary: copy.summary,
    hireAdvice: copy.hireAdvice,
    weaponTypes: copy.weaponTypes,
    strengths: copy.strengths,
    weaknesses: copy.weaknesses,
    bestFor: copy.bestFor,
    survivability: copy.survivability,
    notes: copy.notes ?? base.notes,
    abilities: base.abilities.map((ability, i) => ({
      ...ability,
      name: copy.abilities[i]?.name ?? ability.name,
      description: copy.abilities[i]?.description ?? ability.description,
    })),
    gear: base.gear.map((g, i) => ({
      ...g,
      why: copy.gear[i]?.why ?? g.why,
      label: copy.gear[i]?.label ?? g.label,
    })),
  })),
);

const breakpointsFor = memoByLocale((locale) =>
  localize(baseBreakpoints, locale, OVERLAYS.breakpoints),
);

const mechanicsFor = memoByLocale((locale) =>
  localize(baseMechanics, locale, OVERLAYS.mechanics),
);

const buildsFor = memoByLocale((locale) => {
  const overlay = OVERLAYS.builds[locale];
  if (!overlay) return [...baseBuilds];

  return baseBuilds.map((build) => {
    const copy = overlay[build.slug];
    if (!copy) return build;

    return {
      ...build,
      summary: copy.summary,
      playstyle: copy.playstyle,
      strengths: copy.strengths,
      weaknesses: copy.weaknesses,
      flexPoints: copy.flexPoints ?? build.flexPoints,
      immunityPlan: copy.immunityPlan ?? build.immunityPlan,
      mercenaryNotes: copy.mercenaryNotes ?? build.mercenaryNotes,
      selfFoundNotes: copy.selfFoundNotes ?? build.selfFoundNotes,
      hardcoreNotes: copy.hardcoreNotes ?? build.hardcoreNotes,
      levelingPath: build.levelingPath
        ? { ...build.levelingPath, ...copy.levelingPath }
        : build.levelingPath,
      stats: { ...build.stats, ...copy.statPlan },
      skills: build.skills.map((s) => ({
        ...s,
        note: copy.skillNotes[s.skill] ?? s.note,
      })),
      breakpoints: build.breakpoints.map((b) => ({
        ...b,
        why: copy.breakpointWhy[`${b.stat}-${b.value}`] ?? b.why,
      })),
      farming: build.farming.map((f) => ({
        ...f,
        why: copy.farmingWhy[`${f.area}-${f.difficulty}`] ?? f.why,
      })),
      gearSets: build.gearSets.map((set) => {
        const setCopy = copy.gearSets[set.tier];
        if (!setCopy) return set;
        const pickCopy = (key: string) => setCopy.picks[key];
        const applyPick = <P extends { why: string; label?: string; lookFor?: string[]; sockets?: string; alternatives?: P[] }>(
          pick: P,
          key: string,
        ): P => {
          const c = pickCopy(key);
          return {
            ...pick,
            why: c?.why ?? pick.why,
            label: c?.label ?? pick.label,
            lookFor: c?.lookFor ?? pick.lookFor,
            sockets: c?.sockets ?? pick.sockets,
            alternatives: pick.alternatives?.map((alt, i) =>
              applyPick(alt, `${key}-alt${i}`),
            ),
          };
        };

        return {
          ...set,
          goal: setCopy.goal,
          nextUpgrade: setCopy.nextUpgrade ?? set.nextUpgrade,
          notes: setCopy.notes ?? set.notes,
          slots: set.slots.map((entry) => ({
            ...entry,
            picks: entry.picks.map((p, i) => applyPick(p, `${entry.slot}-${i}`)),
          })),
          charms: set.charms?.map((p, i) => ({
            ...p,
            why: setCopy.charms?.[i]?.why ?? p.why,
            label: setCopy.charms?.[i]?.label ?? p.label,
          })),
          weaponSwap: set.weaponSwap?.map((p, i) => ({
            ...p,
            why: setCopy.weaponSwap?.[i]?.why ?? p.why,
            label: setCopy.weaponSwap?.[i]?.label ?? p.label,
          })),
        };
      }),
    };
  });
});

const journeysFor = memoByLocale((locale) => {
  const overlay = OVERLAYS.journeys[locale];
  if (!overlay) return [...baseJourneys];

  return baseJourneys.map((journey) => {
    const copy = overlay[journey.classSlug];
    if (!copy) return journey;

    return {
      ...journey,
      summary: copy.summary,
      overview: copy.overview,
      respecPlan: copy.respecPlan ?? journey.respecPlan,
      stages: journey.stages.map((stage) => {
        const s = copy.stages[stage.slug];
        if (!s) return stage;
        return {
          ...stage,
          name: s.name,
          summary: s.summary,
          location: s.location,
          goal: s.goal,
          killingWith: s.killingWith,
          skillPoints: s.skillPoints,
          statPoints: s.statPoints,
          exitCriteria: s.exitCriteria ?? stage.exitCriteria,
          actions: stage.actions.map((a, i) => ({
            ...a,
            text: s.actions[i] ?? a.text,
          })),
          gearTargets: stage.gearTargets?.map((g, i) => ({
            ...g,
            why: s.gearTargets?.[i]?.why ?? g.why,
            label: s.gearTargets?.[i]?.label ?? g.label,
          })),
        };
      }),
    };
  });
});

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export const getRunes = (locale: Locale): Rune[] =>
  [...runesFor(locale)].sort((a, b) => a.number - b.number);
export const getRunewords = (locale: Locale): Runeword[] => runewordsFor(locale);
export const getUniques = (locale: Locale): UniqueItem[] => uniquesFor(locale);
export const getClasses = (locale: Locale): CharacterClass[] => classesFor(locale);
export const getBuilds = (locale: Locale): Build[] => buildsFor(locale);
export const getFarmingAreas = (locale: Locale): FarmingArea[] => areasFor(locale);
export const getMercenaries = (locale: Locale): Mercenary[] => mercenariesFor(locale);
export const getSkills = (locale: Locale): Skill[] => skillsFor(locale);
export const getSkillTrees = (locale: Locale): SkillTree[] => skillTreesFor(locale);
export const getJourneys = (locale: Locale): ProgressionJourney[] => journeysFor(locale);
export const getBreakpointTables = (locale: Locale): BreakpointTable[] =>
  breakpointsFor(locale);
export const getMechanics = (locale: Locale): MechanicArticle[] => mechanicsFor(locale);

// ---------------------------------------------------------------------------
// Single lookups
// ---------------------------------------------------------------------------

export const getRune = (locale: Locale, slug: Slug) =>
  indexBy(runesFor(locale)).get(slug);
export const getRuneword = (locale: Locale, slug: Slug) =>
  indexBy(runewordsFor(locale)).get(slug);
export const getUnique = (locale: Locale, slug: Slug) =>
  indexBy(uniquesFor(locale)).get(slug);
export const getClass = (locale: Locale, slug: Slug) =>
  indexBy(classesFor(locale)).get(slug);
export const getBuild = (locale: Locale, slug: Slug) =>
  indexBy(buildsFor(locale)).get(slug);
export const getFarmingArea = (locale: Locale, slug: Slug) =>
  indexBy(areasFor(locale)).get(slug);
export const getMercenary = (locale: Locale, slug: Slug) =>
  indexBy(mercenariesFor(locale)).get(slug);
export const getSkill = (locale: Locale, slug: Slug) =>
  indexBy(skillsFor(locale)).get(slug);
export const getSkillTree = (locale: Locale, slug: Slug) =>
  indexBy(skillTreesFor(locale)).get(slug);
export const getBreakpointTable = (locale: Locale, slug: Slug) =>
  indexBy(breakpointsFor(locale)).get(slug);
export const getMechanic = (locale: Locale, slug: Slug) =>
  indexBy(mechanicsFor(locale)).get(slug);

export const getJourney = (locale: Locale, classSlug: Slug) =>
  journeysFor(locale).find((j) => j.classSlug === classSlug);

// ---------------------------------------------------------------------------
// Scoped queries
// ---------------------------------------------------------------------------

export const getBuildsForClass = (locale: Locale, classSlug: Slug) =>
  buildsFor(locale).filter((b) => b.classSlug === classSlug);

export const getSkillsForClass = (locale: Locale, classSlug: Slug) =>
  skillsFor(locale).filter((s) => s.classSlug === classSlug);

export const getTreesForClass = (locale: Locale, classSlug: Slug) =>
  skillTreesFor(locale)
    .filter((t) => t.classSlug === classSlug)
    .sort((a, b) => a.order - b.order);

export const getSkillsInTree = (locale: Locale, treeSlug: Slug) =>
  skillsFor(locale)
    .filter((s) => s.tree === treeSlug)
    .sort((a, b) => a.requiredLevel - b.requiredLevel || a.name.localeCompare(b.name));

export const getRunewordsUsingRune = (locale: Locale, runeSlug: Slug) =>
  runewordsFor(locale).filter((rw) => rw.runes.includes(runeSlug));

/**
 * Breakpoint tables that apply to a class. Matching on the class slug is
 * locale-safe; matching on the display name is not, because the shared tables
 * carry translated titles — so the invariant `baseBreakpoints` is used to
 * decide membership and the localized table is returned.
 */
export const getBreakpointsForClass = (
  locale: Locale,
  classSlug: Slug,
  englishClassName: string,
) => {
  const wanted = new Set(
    baseBreakpoints
      .filter((t) => t.classSlug === classSlug || t.name.includes(englishClassName))
      .map((t) => t.slug),
  );
  return breakpointsFor(locale).filter((t) => wanted.has(t.slug));
};

// ---------------------------------------------------------------------------
// Reverse cross-references
// ---------------------------------------------------------------------------

function refMatches(ref: ItemRef, kind: ItemRef["kind"], slug: Slug) {
  return ref.kind === kind && ref.slug === slug;
}

function collectBuildRefs(build: Build): ItemRef[] {
  const refs: ItemRef[] = [];
  const walkPick = (pick: { ref?: ItemRef; alternatives?: unknown[] }) => {
    if (pick.ref) refs.push(pick.ref);
    for (const alt of (pick.alternatives ?? []) as (typeof pick)[]) walkPick(alt);
  };
  for (const set of build.gearSets) {
    for (const entry of set.slots) entry.picks.forEach(walkPick);
    (set.charms ?? []).forEach(walkPick);
    (set.weaponSwap ?? []).forEach(walkPick);
  }
  return refs;
}

export function getBuildsUsingItem(
  locale: Locale,
  kind: ItemRef["kind"],
  slug: Slug,
): Build[] {
  return buildsFor(locale).filter((build) =>
    collectBuildRefs(build).some((ref) => refMatches(ref, kind, slug)),
  );
}

export function getBuildsFarmingArea(locale: Locale, areaSlug: Slug): Build[] {
  return buildsFor(locale).filter((b) => b.farming.some((f) => f.area === areaSlug));
}

export function getAreasDroppingItem(
  locale: Locale,
  kind: ItemRef["kind"],
  slug: Slug,
): FarmingArea[] {
  return areasFor(locale).filter((a) =>
    (a.notableDrops ?? []).some((ref) => refMatches(ref, kind, slug)),
  );
}

export * from "./resolve";
