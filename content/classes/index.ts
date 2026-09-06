import type { Skill, SkillTree } from "@/lib/types";

import { sorceressSkills, sorceressTrees } from "./sorceress/skills";
import { paladinSkills, paladinTrees } from "./paladin/skills";
import { amazonSkills, amazonTrees } from "./amazon/skills";
import { necromancerSkills, necromancerTrees } from "./necromancer/skills";
import { druidSkills, druidTrees } from "./druid/skills";
import { assassinSkills, assassinTrees } from "./assassin/skills";
import { barbarianSkills, barbarianTrees } from "./barbarian/skills";

/**
 * Skill registry across all classes.
 *
 * Each class contributes one module exporting `<class>Skills` and
 * `<class>Trees`. Adding a class means one import and two array entries here —
 * `lib/registry` and every page that consumes skills stay untouched.
 *
 * Skill slugs must be globally unique, not just unique within a class. Several
 * skill names genuinely collide across classes (Teleport exists on the Sorceress
 * tree and as an Enigma grant; Fire Ball is both a Sorceress and a Warlock
 * concept), so class-specific slugs are prefixed where a collision exists. The
 * duplicate-slug guard in `lib/registry` enforces this at module load.
 */
export const allSkills: Skill[] = [
  ...sorceressSkills,
  ...paladinSkills,
  ...amazonSkills,
  ...necromancerSkills,
  ...druidSkills,
  ...assassinSkills,
  ...barbarianSkills,
];

export const allSkillTrees: SkillTree[] = [
  ...sorceressTrees,
  ...paladinTrees,
  ...amazonTrees,
  ...necromancerTrees,
  ...druidTrees,
  ...assassinTrees,
  ...barbarianTrees,
];
