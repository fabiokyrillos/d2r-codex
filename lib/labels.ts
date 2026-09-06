import type {
  ActionKind,
  AllocationRole,
  AvailabilityMode,
  AvailabilityStatus,
  BudgetLevel,
  Confidence,
  Difficulty,
  Element,
  GearSlot,
  ItemQuality,
  PlayDifficulty,
  ProgressionTier,
  Release,
  SkillKind,
} from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";
import type { SearchKind } from "@/lib/search";

/**
 * Display labels, derived from the active dictionary.
 *
 * Colours and icons stay module-level constants because they are presentation,
 * not language. Everything a reader can read is a function of the dictionary —
 * which means adding a locale cannot leave a stray English label behind, since
 * there is nowhere left to hard-code one.
 *
 * The `Record<T, string>` return types are exhaustive on purpose: a new member
 * on any of these unions produces a compile error at every label map that has
 * not been updated, in both languages at once.
 */

// ---------------------------------------------------------------------------
// Presentation — not localized
// ---------------------------------------------------------------------------

export const difficultyColors: Record<Difficulty, string> = {
  normal: "text-diff-normal",
  nightmare: "text-diff-nightmare",
  hell: "text-diff-hell",
};

export const qualityColors: Record<ItemQuality | "rune", string> = {
  normal: "text-rarity-normal",
  superior: "text-rarity-normal",
  magic: "text-rarity-magic",
  rare: "text-rarity-rare",
  set: "text-rarity-set",
  unique: "text-rarity-unique",
  crafted: "text-rarity-crafted",
  runeword: "text-rarity-runeword",
  rune: "text-rarity-rune",
};

export const elementColors: Record<Element, string> = {
  physical: "text-el-physical",
  magic: "text-el-magic",
  fire: "text-el-fire",
  cold: "text-el-cold",
  lightning: "text-el-lightning",
  poison: "text-el-poison",
};

export const actionKindStyles: Record<ActionKind, { icon: string; tone: string }> = {
  skill: { icon: "◆", tone: "text-el-magic" },
  stat: { icon: "▲", tone: "text-info" },
  gear: { icon: "▣", tone: "text-rarity-unique" },
  runeword: { icon: "⬢", tone: "text-rarity-rune" },
  quest: { icon: "✦", tone: "text-warning" },
  shop: { icon: "◈", tone: "text-success" },
  gamble: { icon: "◇", tone: "text-success" },
  mercenary: { icon: "⚔", tone: "text-el-physical" },
  respec: { icon: "↻", tone: "text-ember" },
  farm: { icon: "◉", tone: "text-el-cold" },
  transition: { icon: "→", tone: "text-diff-hell" },
  warning: { icon: "!", tone: "text-danger" },
  tip: { icon: "i", tone: "text-ink-muted" },
};

/** Tier order is structural, not editorial, so it stays a plain constant. */
export const tierOrder: ProgressionTier[] = [
  "starter",
  "nightmare",
  "early-hell",
  "budget",
  "optimized",
  "bis",
];

// ---------------------------------------------------------------------------
// Localized
// ---------------------------------------------------------------------------

export const difficultyLabels = (t: Dictionary): Record<Difficulty, string> => ({
  normal: t.difficulty.normal,
  nightmare: t.difficulty.nightmare,
  hell: t.difficulty.hell,
});

export const skillKindLabels = (t: Dictionary): Record<SkillKind, string> => ({
  attack: t.skillKinds.attack,
  spell: t.skillKinds.spell,
  passive: t.skillKinds.passive,
  aura: t.skillKinds.aura,
  summon: t.skillKinds.summon,
  curse: t.skillKinds.curse,
  buff: t.skillKinds.buff,
  shapeshift: t.skillKinds.shapeshift,
});

/**
 * What a synergy improves, as the generated graph records it.
 *
 * Worth naming rather than assuming: Holy Bolt receives a *healing* synergy
 * from Prayer and a *damage* synergy from Fist of the Heavens, and listing both
 * under one silent heading would tell a reader Prayer raises Holy Bolt's damage.
 */
export const synergyKindLabels = (t: Dictionary): Record<string, string> => ({
  damage: t.skills.synergyKindDamage,
  armor: t.skills.synergyKindArmor,
  healing: t.skills.synergyKindHealing,
  duration: t.skills.synergyKindDuration,
  freeze: t.skills.synergyKindFreeze,
  hp: t.skills.synergyKindHp,
  absorb: t.skills.synergyKindAbsorb,
  "attack-rating": t.skills.synergyKindAttackRating,
  physical: t.skills.synergyKindPhysical,
  fire: t.skills.synergyKindFire,
  shots: t.skills.synergyKindShots,
  chance: t.skills.synergyKindChance,
});

/**
 * The kinds this map covers, so a gate can assert it covers every kind the
 * generated graph actually carries.
 *
 * `synergyKinds` falls back to printing the raw kind when it finds no label,
 * which keeps a page from crashing and is exactly the wrong failure mode for a
 * translation: the Necromancer's golem edges would have rendered "attack-rating"
 * in both languages and nothing would have said so.
 */
export const SYNERGY_KINDS_LABELLED: readonly string[] = [
  "damage",
  "armor",
  "healing",
  "duration",
  "freeze",
  "hp",
  "absorb",
  "attack-rating",
  "physical",
  "fire",
  "shots",
  "chance",
];

/**
 * Effect labels, keyed by the `labelKey` the graph carries.
 *
 * The key travels in the data and the words live here, so sixty skills do not
 * become sixty hand-translated strings for a dozen distinct words -- and so a
 * label can never be a game string, which the extraction deliberately never
 * takes.
 */
export const effectLabels = (t: Dictionary): Record<string, string> => ({
  effectChance: t.skills.effectChance,
  effectAttackRating: t.skills.effectAttackRating,
  effectArrows: t.skills.effectArrows,
  effectShots: t.skills.effectShots,
  effectBolts: t.skills.effectBolts,
  effectJumps: t.skills.effectJumps,
  effectConverted: t.skills.effectConverted,
  effectRadius: t.skills.effectRadius,
  effectRadiusHalfSquares: t.skills.effectRadiusHalfSquares,
  effectDuration: t.skills.effectDuration,
  effectFreezeLength: t.skills.effectFreezeLength,
  effectMana: t.skills.effectMana,
  effectMissiles: t.skills.effectMissiles,
  effectAbsorbed: t.skills.effectAbsorbed,
  effectMinions: t.skills.effectMinions,
  effectMinionLife: t.skills.effectMinionLife,
  effectMinionDamage: t.skills.effectMinionDamage,
  effectDamageDealt: t.skills.effectDamageDealt,
  effectDamageReturned: t.skills.effectDamageReturned,
  effectResistReduction: t.skills.effectResistReduction,
  effectWallLife: t.skills.effectWallLife,
  effectWallSegments: t.skills.effectWallSegments,
  effectSlow: t.skills.effectSlow,
  effectGolemLife: t.skills.effectGolemLife,
  effectGolemAttackRating: t.skills.effectGolemAttackRating,
  effectGolemSpeed: t.skills.effectGolemSpeed,
  effectLifeSteal: t.skills.effectLifeSteal,
  effectMinionResist: t.skills.effectMinionResist,
  effectFireAbsorb: t.skills.effectFireAbsorb,
  effectAuraLevel: t.skills.effectAuraLevel,
  effectAttackSpeed: t.skills.effectAttackSpeed,
  effectLifeBonus: t.skills.effectLifeBonus,
  effectDefenseBonus: t.skills.effectDefenseBonus,
  effectMoveSpeed: t.skills.effectMoveSpeed,
  effectCharges: t.skills.effectCharges,
  effectStun: t.skills.effectStun,
  effectHits: t.skills.effectHits,
  effectManaSteal: t.skills.effectManaSteal,
  effectPartyLife: t.skills.effectPartyLife,
  effectSummonHits: t.skills.effectSummonHits,
  effectMinionDamageBonus: t.skills.effectMinionDamageBonus,
});

/** "damage", or "buff duration and damage" — never an untranslated slug. */
export const synergyKinds = (kinds: readonly string[], t: Dictionary): string => {
  const labels = synergyKindLabels(t);
  const named = kinds.map((k) => labels[k] ?? k);
  if (named.length <= 1) return named[0] ?? "";
  return `${named.slice(0, -1).join(", ")} ${t.skills.synergyKindJoin} ${named.at(-1)}`;
};

export const elementLabels = (t: Dictionary): Record<Element, string> => ({
  physical: t.elements.physical,
  magic: t.elements.magic,
  fire: t.elements.fire,
  cold: t.elements.cold,
  lightning: t.elements.lightning,
  poison: t.elements.poison,
});

export const budgetLabels = (t: Dictionary): Record<BudgetLevel, string> => ({
  low: t.budget.low,
  medium: t.budget.medium,
  high: t.budget.high,
  extreme: t.budget.extreme,
});

/**
 * What a build page calls each kind of skill allocation.
 *
 * Lived on the build page as a local helper until the package cards needed the
 * same five words. Two copies of a label set is how "Synergy" and "Sinergia"
 * drift apart, so it moved here rather than being duplicated.
 */
export const allocationRoleLabels = (
  t: Dictionary,
): Record<AllocationRole, string> => ({
  main: t.builds.roleMain,
  synergy: t.builds.roleSynergy,
  utility: t.builds.roleUtility,
  prerequisite: t.builds.rolePrerequisite,
  flex: t.builds.roleFlex,
});

export const playDifficultyLabels = (
  t: Dictionary,
): Record<PlayDifficulty, string> => ({
  beginner: t.playDifficulty.beginner,
  moderate: t.playDifficulty.moderate,
  advanced: t.playDifficulty.advanced,
  expert: t.playDifficulty.expert,
});

export const releaseLabels = (t: Dictionary): Record<Release, string> => ({
  classic: t.release.classic,
  lod: t.release.lod,
  d2r: t.release.d2r,
  "reign-of-the-warlock": t.release.reignOfTheWarlock,
});

/**
 * `verified` maps to null and is never rendered: the baseline expectation is
 * that content is verified, so badging every verified claim would train readers
 * to ignore the badge entirely.
 */
export const confidenceLabels = (
  t: Dictionary,
): Record<Confidence, string | null> => ({
  verified: null,
  single: t.confidence.single,
  community: t.confidence.community,
  unverified: t.confidence.unverified,
});

export const availabilityModeLabels = (
  t: Dictionary,
): Record<AvailabilityMode, string> => ({
  ladder: t.availability.modeLadder,
  "non-ladder-online": t.availability.modeNonLadderOnline,
  offline: t.availability.modeOffline,
});

export const availabilityStatusLabels = (
  t: Dictionary,
): Record<AvailabilityStatus, string> => ({
  craftable: t.availability.statusCraftable,
  usable: t.availability.statusUsable,
  unobtainable: t.availability.statusUnobtainable,
  disabled: t.availability.statusDisabled,
  unknown: t.availability.statusUnknown,
});

/**
 * Tone per status, module-level because it is presentation.
 *
 * `usable` is deliberately not the same tone as `craftable`. "You may wear one"
 * and "you may make one" look alike in a table and are the whole distinction
 * this feature exists to draw, so they must not be the same colour.
 *
 * `unobtainable` sits with `disabled` on the red end rather than with `usable`
 * on the amber one. A reader skims the colour before the words, and the
 * practical answer to "can I have this here" is no — the fact that it would
 * still function is a nuance the row's own sentence carries, not a reason to
 * paint the cell like a permission.
 */
export const availabilityStatusStyles: Record<
  AvailabilityStatus,
  { tone: string }
> = {
  craftable: { tone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" },
  usable: { tone: "border-amber-500/40 bg-amber-500/10 text-amber-200" },
  unobtainable: { tone: "border-rose-500/40 bg-rose-500/10 text-rose-200" },
  disabled: { tone: "border-rose-500/40 bg-rose-500/10 text-rose-200" },
  unknown: { tone: "border-slate-500/40 bg-slate-500/10 text-slate-300" },
};

export const gearSlotLabels = (t: Dictionary): Record<GearSlot, string> => ({
  helm: t.gearSlots.helm,
  amulet: t.gearSlots.amulet,
  weapon: t.gearSlots.weapon,
  offhand: t.gearSlots.offhand,
  body: t.gearSlots.body,
  gloves: t.gearSlots.gloves,
  belt: t.gearSlots.belt,
  boots: t.gearSlots.boots,
  ring1: t.gearSlots.ring1,
  ring2: t.gearSlots.ring2,
});

export const actionKindLabels = (t: Dictionary): Record<ActionKind, string> => ({
  skill: t.actionKinds.skill,
  stat: t.actionKinds.stat,
  gear: t.actionKinds.gear,
  runeword: t.actionKinds.runeword,
  quest: t.actionKinds.quest,
  shop: t.actionKinds.shop,
  gamble: t.actionKinds.gamble,
  mercenary: t.actionKinds.mercenary,
  respec: t.actionKinds.respec,
  farm: t.actionKinds.farm,
  transition: t.actionKinds.transition,
  warning: t.actionKinds.warning,
  tip: t.actionKinds.tip,
});

export const searchKindLabels = (t: Dictionary): Record<SearchKind, string> => ({
  class: t.searchKinds.class,
  build: t.searchKinds.build,
  leveling: t.searchKinds.leveling,
  runeword: t.searchKinds.runeword,
  rune: t.searchKinds.rune,
  item: t.searchKinds.item,
  area: t.searchKinds.area,
  skill: t.searchKinds.skill,
  mechanic: t.searchKinds.mechanic,
  mercenary: t.searchKinds.mercenary,
  breakpoints: t.searchKinds.breakpoints,
  page: t.searchKinds.page,
});

export const ratingLabels = (t: Dictionary): readonly string[] => [
  "",
  t.ratings.poor,
  t.ratings.weak,
  t.ratings.average,
  t.ratings.good,
  t.ratings.excellent,
];

/**
 * Progression tiers, with the framing each one needs.
 *
 * `question` is the reader's actual question at that point — it drives the
 * gear-progression UI, which is built around "what do I do next" rather than
 * "here is the finished character".
 */
export const progressionTiers = (
  t: Dictionary,
): Record<
  ProgressionTier,
  { label: string; short: string; question: string; context: string }
> => ({
  starter: {
    label: t.tiers.starterLabel,
    short: t.tiers.starterShort,
    question: t.tiers.starterQuestion,
    context: t.tiers.starterContext,
  },
  nightmare: {
    label: t.tiers.nightmareLabel,
    short: t.tiers.nightmareShort,
    question: t.tiers.nightmareQuestion,
    context: t.tiers.nightmareContext,
  },
  "early-hell": {
    label: t.tiers.earlyHellLabel,
    short: t.tiers.earlyHellShort,
    question: t.tiers.earlyHellQuestion,
    context: t.tiers.earlyHellContext,
  },
  budget: {
    label: t.tiers.budgetLabel,
    short: t.tiers.budgetShort,
    question: t.tiers.budgetQuestion,
    context: t.tiers.budgetContext,
  },
  optimized: {
    label: t.tiers.optimizedLabel,
    short: t.tiers.optimizedShort,
    question: t.tiers.optimizedQuestion,
    context: t.tiers.optimizedContext,
  },
  bis: {
    label: t.tiers.bisLabel,
    short: t.tiers.bisShort,
    question: t.tiers.bisQuestion,
    context: t.tiers.bisContext,
  },
});
