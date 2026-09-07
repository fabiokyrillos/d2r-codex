import type { Locale } from "@/lib/i18n/config";
import type {
  BreakpointTableCopy,
  BuildCopy,
  ClassCopy,
  FarmingAreaCopy,
  JourneyCopy,
  MechanicCopy,
  MercenaryCopy,
  Overlay,
  RuneCopy,
  RunewordCopy,
  SkillCopy,
  SkillTreeCopy,
  UniqueItemCopy,
} from "@/lib/types/copy";

import { runesPtBr } from "@/content/runes/pt-br";
import { runewordsPtBr } from "@/content/runewords/pt-br";
import { uniquesPtBr } from "@/content/items/pt-br";
import { classesPtBr } from "@/content/classes/pt-br";
import { skillsPtBr, skillTreesPtBr } from "@/content/classes/skills-pt-br";
import { areasPtBr } from "@/content/farming/pt-br";
import { mercenariesPtBr } from "@/content/mercenaries/pt-br";
import { breakpointsPtBr } from "@/content/breakpoints/pt-br";
import { mechanicsPtBr } from "@/content/mechanics/pt-br";
import { buildsPtBr } from "@/content/builds/pt-br";
import { assassinBuildsPtBr } from "@/content/builds/pt-br-assassin";
import { barbarianBuildsPtBr } from "@/content/builds/pt-br-barbarian";

import { warlockBuildsPtBr } from "@/content/builds/pt-br-warlock";
import { journeysPtBr } from "@/content/progression/pt-br";

/**
 * The overlay registry: every locale that is not the editorial source, and the
 * copy it supplies for each content domain.
 *
 * en-US is deliberately absent. Its copy lives with the invariant data, so
 * `localize` short-circuits to the identity for it — no overlay to keep in
 * sync, and no chance of the source language drifting from itself.
 *
 * Adding a third locale means adding one key per domain here and one copy file
 * per domain. `npm run check:content` then reports every slug still missing.
 */
export const OVERLAYS = {
  runes: { "pt-br": runesPtBr } as Partial<Record<Locale, Overlay<RuneCopy>>>,
  runewords: { "pt-br": runewordsPtBr } as Partial<Record<Locale, Overlay<RunewordCopy>>>,
  items: { "pt-br": uniquesPtBr } as Partial<Record<Locale, Overlay<UniqueItemCopy>>>,
  classes: { "pt-br": classesPtBr } as Partial<Record<Locale, Overlay<ClassCopy>>>,
  skills: { "pt-br": skillsPtBr } as Partial<Record<Locale, Overlay<SkillCopy>>>,
  skillTrees: { "pt-br": skillTreesPtBr } as Partial<
    Record<Locale, Overlay<SkillTreeCopy>>
  >,
  areas: { "pt-br": areasPtBr } as Partial<Record<Locale, Overlay<FarmingAreaCopy>>>,
  mercenaries: { "pt-br": mercenariesPtBr } as Partial<
    Record<Locale, Overlay<MercenaryCopy>>
  >,
  breakpoints: { "pt-br": breakpointsPtBr } as Partial<
    Record<Locale, Overlay<BreakpointTableCopy>>
  >,
  mechanics: { "pt-br": mechanicsPtBr } as Partial<Record<Locale, Overlay<MechanicCopy>>>,

  builds: { "pt-br": { ...buildsPtBr, ...assassinBuildsPtBr, ...barbarianBuildsPtBr, ...warlockBuildsPtBr } } as Partial<
    Record<Locale, Overlay<BuildCopy>>
  >,
  journeys: { "pt-br": journeysPtBr } as Partial<Record<Locale, Overlay<JourneyCopy>>>,
} as const;
