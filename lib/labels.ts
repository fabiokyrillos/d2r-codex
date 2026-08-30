import type {
  ActionKind,
  BudgetLevel,
  Confidence,
  Difficulty,
  Element,
  ItemQuality,
  PlayDifficulty,
  ProgressionTier,
  Release,
} from "@/lib/types";

/**
 * Display labels and presentation metadata for the string-literal unions.
 *
 * Keeping these out of the components means a union can gain a member and the
 * compiler will point at every map that needs updating (the `Record<T, …>`
 * types below are exhaustive on purpose).
 */

export const difficultyLabels: Record<Difficulty, string> = {
  normal: "Normal",
  nightmare: "Nightmare",
  hell: "Hell",
};

export const difficultyColors: Record<Difficulty, string> = {
  normal: "text-diff-normal",
  nightmare: "text-diff-nightmare",
  hell: "text-diff-hell",
};

/**
 * Progression tiers, with the framing each one needs.
 *
 * `question` is the reader's actual question at that point — it drives the
 * gear-progression UI, which is built around "what do I do next" rather than
 * "here is the finished character".
 */
export const progressionTiers: Record<
  ProgressionTier,
  { label: string; short: string; question: string; context: string }
> = {
  starter: {
    label: "Starter",
    short: "Start",
    question: "I just made this character. What do I wear?",
    context: "Normal difficulty, levels 1-30. Everything here is free or nearly free.",
  },
  nightmare: {
    label: "Nightmare",
    short: "NM",
    question: "I'm in Nightmare and things are getting harder.",
    context: "Levels 30-60. Resistances start to matter more than damage.",
  },
  "early-hell": {
    label: "Early Hell",
    short: "Hell",
    question: "I've reached Hell and I'm dying. What now?",
    context: "Levels 60-75. The hardest transition in the game.",
    },
  budget: {
    label: "Budget",
    short: "Budget",
    question: "I can farm Hell. What's my next real upgrade?",
    context: "Levels 75-85. A complete, self-found setup that works everywhere.",
  },
  optimized: {
    label: "Optimized",
    short: "Optimized",
    question: "I have good gear. How do I make it great?",
    context: "Levels 85+. Strong items, mostly obtainable solo with patience.",
  },
  bis: {
    label: "Best in Slot",
    short: "BiS",
    question: "What does the finished character look like?",
    context: "The ceiling. Expect trading, perfect rolls, and high runes.",
  },
};

export const tierOrder: ProgressionTier[] = [
  "starter",
  "nightmare",
  "early-hell",
  "budget",
  "optimized",
  "bis",
];

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

export const elementLabels: Record<Element, string> = {
  physical: "Physical",
  magic: "Magic",
  fire: "Fire",
  cold: "Cold",
  lightning: "Lightning",
  poison: "Poison",
};

export const budgetLabels: Record<BudgetLevel, string> = {
  low: "Low budget",
  medium: "Medium budget",
  high: "High budget",
  extreme: "Extreme budget",
};

export const playDifficultyLabels: Record<PlayDifficulty, string> = {
  beginner: "Beginner friendly",
  moderate: "Moderate",
  advanced: "Advanced",
  expert: "Expert",
};

export const releaseLabels: Record<Release, string> = {
  classic: "Diablo II",
  lod: "Lord of Destruction",
  d2r: "Resurrected",
  "reign-of-the-warlock": "Reign of the Warlock",
};

/**
 * Confidence labels. `verified` is deliberately not surfaced in the UI — the
 * baseline expectation is that content is verified, so only the exceptions are
 * worth a reader's attention.
 */
export const confidenceLabels: Record<Confidence, string | null> = {
  verified: null,
  single: "Single source",
  community: "Community consensus",
  unverified: "Unverified",
};

export const actionKindMeta: Record<
  ActionKind,
  { label: string; icon: string; tone: string }
> = {
  skill: { label: "Skill", icon: "◆", tone: "text-el-magic" },
  stat: { label: "Stats", icon: "▲", tone: "text-info" },
  gear: { label: "Gear", icon: "▣", tone: "text-rarity-unique" },
  runeword: { label: "Runeword", icon: "⬢", tone: "text-rarity-rune" },
  quest: { label: "Quest", icon: "✦", tone: "text-warning" },
  shop: { label: "Shop", icon: "◈", tone: "text-success" },
  gamble: { label: "Gamble", icon: "◇", tone: "text-success" },
  mercenary: { label: "Mercenary", icon: "⚔", tone: "text-el-physical" },
  respec: { label: "Respec", icon: "↻", tone: "text-ember" },
  farm: { label: "Farm", icon: "◉", tone: "text-el-cold" },
  transition: { label: "Difficulty", icon: "→", tone: "text-diff-hell" },
  warning: { label: "Warning", icon: "!", tone: "text-danger" },
  tip: { label: "Tip", icon: "i", tone: "text-ink-muted" },
};

export const ratingLabels = ["", "Poor", "Weak", "Average", "Good", "Excellent"] as const;
