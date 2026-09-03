import type { Skill, SkillTree } from "@/lib/types";

/**
 * The Amazon's three skill trees and thirty skills.
 *
 * Structure — tree membership, unlock levels, prerequisites and every synergy
 * edge — comes from `content/classes/skill-graph.ts`, generated from the game's
 * own tables. Nothing here is a second copy of it: `check:content` compares the
 * authored `prerequisites` against the graph and fails on drift, and rejects a
 * `synergies` entry the graph does not recognise.
 *
 * Two things about this class are worth knowing before reading further.
 *
 * The **Passive and Magic** tree is unlike anything the Paladin or the Sorceress
 * has. Six of its ten skills are pure percentages that are always on, and they
 * benefit every build regardless of weapon. A tree of numbers, with almost no
 * prose to write.
 *
 * The **Javelin and Spear** tree's lightning skills do not all compose their
 * damage the same way, and the difference is one line of engine code. Power
 * Strike, Lightning Bolt, Lightning Fury and Lightning Strike all deliver the
 * weapon's damage; Charged Strike alone does not, because its stage passes the
 * skill's empty `SrcDam` straight to the damage allocator while Lightning
 * Strike's substitutes 0x80 for an empty one. Every one of them still rolls
 * against attack rating, and every one creates its secondary bolts or chain
 * separately from the strike. That is recorded in `damageModel` rather than in
 * prose, so the damage section of each page cannot contradict it.
 *
 * The two stages are `SKILLS_SrvSt06_PowerStrike_ChargedStrike` and
 * `SKILLS_SrvSt10_LightningStrike` in D2MOO's `D2Game/src/SKILLS/SkillAma.cpp`
 * — a community reimplementation of *legacy* Diablo II, not Blizzard's D2R
 * source, cited to explain a column the shipped tables do not describe and
 * reconciled against the pinned 3.3 extraction. `scripts/damage.test.ts`
 * records the provenance in full and asserts the classifications.
 *
 * Names are the game's, in both locales, per ADR 0003. The one place the
 * internal identifier and the public name differ is Decoy, which the game's
 * tables call `Dopplezon`; the generator maps it deliberately and the mapping
 * is tested.
 */

export const amazonTrees: SkillTree[] = [
  {
    slug: "javelin-and-spear",
    name: "Javelin and Spear",
    classSlug: "amazon",
    order: 1,
    summary: "Thrown and melee lightning, plus the class's physical answer to it.",
    theme:
      "Lightning Fury clears packs faster than almost anything in the game and Charged Strike deletes bosses, but neither touches a lightning immune. Jab is on the bar for exactly that reason.",
  },
  {
    slug: "passive-and-magic",
    name: "Passive and Magic",
    classSlug: "amazon",
    order: 2,
    summary: "Always-on percentages that every Amazon build wants.",
    theme:
      "Six of these ten skills are passive percentages, and they apply whether you are holding a bow or a spear. This is the tree that makes the Amazon hard to kill and the reason her two decoys tank as well as they do.",
  },
  {
    slug: "bow-and-crossbow",
    name: "Bow and Crossbow",
    classSlug: "amazon",
    order: 3,
    summary: "Physical archery, and one branch per element.",
    theme:
      "Strafe and Multiple Shot are pure weapon damage; the elemental arrows add an element on top of it. Which branch you take decides what you can farm, because a bow build has no aura to break an immunity with.",
  },
];

export const amazonSkills: Skill[] = [
  // -------------------------------------------------------------------------
  // Javelin and Spear
  // -------------------------------------------------------------------------
  {
    slug: "jab",
    name: "Jab",
    classSlug: "amazon",
    tree: "javelin-and-spear",
    kind: "attack",
    element: "physical",
    requiredLevel: 1,
    summary:
      "Three rapid thrusts with a spear or javelin. The javelin Amazon's answer to lightning immunity.",
    mechanics: [
      "The animation runs to completion — you are committed to all three thrusts once it starts.",
      "Every javelin build keeps a point here as the answer to a lightning immune, since the javelin tree's damage is almost all lightning.",
    ],
    confidence: "verified",
  },
  {
    slug: "power-strike",
    name: "Power Strike",
    classSlug: "amazon",
    tree: "javelin-and-spear",
    kind: "attack",
    element: "lightning",
    requiredLevel: 6,
    prerequisites: ["jab"],
    damageModel: "weapon-plus-element",
    summary: "A melee strike that adds lightning damage to the weapon's own.",
    synergies: [
      { skill: "charged-strike", bonus: "+14% damage per level" },
      { skill: "lightning-bolt", bonus: "+14% damage per level" },
      { skill: "lightning-strike", bonus: "+14% damage per level" },
    ],
    mechanics: [
      "Rarely used as an attack past the early levels. It is maxed because it feeds all four of the other lightning javelin skills.",
    ],
    confidence: "verified",
  },
  {
    slug: "poison-javelin",
    name: "Poison Javelin",
    classSlug: "amazon",
    tree: "javelin-and-spear",
    kind: "attack",
    element: "poison",
    requiredLevel: 6,
    damageModel: "weapon-plus-element",
    summary:
      "A thrown javelin that trails a line of poison. Damage lands over its duration, not on impact.",
    synergies: [{ skill: "plague-javelin", bonus: "+12% damage per level" }],
    mechanics: [
      "The cloud follows the javelin's path, so it is thrown across a group rather than at one target.",
      "Poison stops a monster regenerating for as long as it is applied — which at high levels is most of a minute.",
    ],
    confidence: "verified",
  },
  {
    slug: "impale",
    name: "Impale",
    classSlug: "amazon",
    tree: "javelin-and-spear",
    kind: "attack",
    element: "physical",
    requiredLevel: 12,
    prerequisites: ["jab"],
    summary: "A slow, uninterruptible thrust with a large damage bonus and a slow on the target.",
    mechanics: [
      "Costs weapon durability on a hit, which is why it is used on single targets rather than spammed.",
      "Cannot be interrupted once started, so it is a reliable opener against a boss.",
    ],
    confidence: "verified",
  },
  {
    slug: "lightning-bolt",
    name: "Lightning Bolt",
    classSlug: "amazon",
    tree: "javelin-and-spear",
    kind: "attack",
    element: "lightning",
    requiredLevel: 12,
    prerequisites: ["poison-javelin"],
    damageModel: "weapon-converted-to-element",
    summary:
      "Throws a javelin whose physical damage is converted entirely to lightning, plus lightning of its own.",
    synergies: [
      { skill: "charged-strike", bonus: "+3% damage per level" },
      { skill: "lightning-fury", bonus: "+3% damage per level" },
      { skill: "lightning-strike", bonus: "+3% damage per level" },
      { skill: "power-strike", bonus: "+3% damage per level" },
    ],
    mechanics: [
      "The bolt pierces, so it lines up well against a column of monsters.",
    ],
    confidence: "verified",
  },
  {
    slug: "charged-strike",
    name: "Charged Strike",
    classSlug: "amazon",
    tree: "javelin-and-spear",
    kind: "attack",
    element: "lightning",
    requiredLevel: 18,
    prerequisites: ["lightning-bolt", "power-strike"],
    damageModel: "element-only-attack",
    summary:
      "Releases charged bolts from the spear tip. The strongest single-target skill the Amazon has.",
    synergies: [
      { skill: "lightning-bolt", bonus: "+14% damage per level" },
      { skill: "lightning-strike", bonus: "+14% damage per level" },
      { skill: "power-strike", bonus: "+14% damage per level" },
    ],
    mechanics: [
      "The strike rolls against attack rating like any attack, and on a hit it delivers the skill's lightning damage. The bolts are created separately, which is why the count matters more than the swing.",
      "The bolt count rises with skill level, and all of them can land on one target at point-blank range. That is where the boss damage comes from.",
      "Unlike Power Strike, the skill contributes none of the weapon's base physical damage — its own damage is entirely lightning.",
    ],
    confidence: "verified",
  },
  {
    slug: "plague-javelin",
    name: "Plague Javelin",
    classSlug: "amazon",
    tree: "javelin-and-spear",
    kind: "attack",
    element: "poison",
    requiredLevel: 18,
    prerequisites: ["lightning-bolt"],
    damageModel: "weapon-plus-element",
    summary:
      "A thrown javelin that leaves poison along its path and bursts into a cloud where it stops.",
    synergies: [{ skill: "poison-javelin", bonus: "+14% damage per level" }],
    mechanics: [
      "Shorter duration than Poison Javelin but far more damage packed into it.",
      "**Its three seconds do not grow with skill level.** Diablo II: Resurrected patch 2.4 fixed the duration in code; the column that used to lengthen it was never edited, so a database reading the table still reports nearly seven seconds at level 20.",
      "Its area is what makes it a Cow Level skill — the cloud covers more ground than any other javelin attack.",
    ],
    confidence: "verified",
  },
  {
    slug: "fend",
    name: "Fend",
    classSlug: "amazon",
    tree: "javelin-and-spear",
    kind: "attack",
    element: "physical",
    requiredLevel: 24,
    prerequisites: ["impale"],
    summary: "Attacks every adjacent enemy in one sequence, one extra target per skill level.",
    mechanics: [
      "The whole sequence is one animation. Being hit part-way through can strand you in it, which is the build's main risk.",
    ],
    confidence: "verified",
  },
  {
    slug: "lightning-strike",
    name: "Lightning Strike",
    classSlug: "amazon",
    tree: "javelin-and-spear",
    kind: "attack",
    element: "lightning",
    requiredLevel: 30,
    prerequisites: ["charged-strike"],
    damageModel: "weapon-plus-element",
    summary:
      "A melee strike that starts a lightning chain, jumping between nearby enemies.",
    synergies: [
      { skill: "charged-strike", bonus: "+11% damage per level" },
      { skill: "lightning-bolt", bonus: "+11% damage per level" },
      { skill: "power-strike", bonus: "+11% damage per level" },
    ],
    mechanics: [
      "The strike itself rolls against attack rating and lands the weapon's full damage plus the skill's lightning; the chain is created separately from the target it hit.",
      "The chain can double back onto a target it already struck, which is why it out-damages Lightning Fury on spread-out packs.",
    ],
    confidence: "verified",
  },
  {
    slug: "lightning-fury",
    name: "Lightning Fury",
    classSlug: "amazon",
    tree: "javelin-and-spear",
    kind: "attack",
    element: "lightning",
    requiredLevel: 30,
    prerequisites: ["plague-javelin"],
    damageModel: "weapon-plus-element",
    summary:
      "A thrown javelin that splits into lightning bolts seeking every enemy nearby. The class's signature.",
    synergies: [
      { skill: "charged-strike", bonus: "+1% damage per level" },
      { skill: "lightning-bolt", bonus: "+1% damage per level" },
      { skill: "lightning-strike", bonus: "+1% damage per level" },
      { skill: "power-strike", bonus: "+1% damage per level" },
    ],
    mechanics: [
      "The javelin itself pierces, and every target it passes through releases another burst of bolts. Pierce is what turns this from good to absurd.",
      "The bolt count rises with skill level, so this scales with +skills harder than almost anything else in the game.",
    ],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Passive and Magic
  // -------------------------------------------------------------------------
  {
    slug: "inner-sight",
    name: "Inner Sight",
    classSlug: "amazon",
    tree: "passive-and-magic",
    kind: "curse",
    element: "magic",
    requiredLevel: 1,
    summary: "Lights up nearby enemies and lowers their defence.",
    mechanics: [
      "Mostly taken as the one point that opens Slow Missiles, and through it Decoy and Valkyrie.",
    ],
    confidence: "verified",
  },
  {
    slug: "critical-strike",
    name: "Critical Strike",
    classSlug: "amazon",
    tree: "passive-and-magic",
    kind: "passive",
    requiredLevel: 1,
    summary: "A chance to double physical damage. Always on, with any weapon.",
    mechanics: [
      "Stacks with Deadly Strike from gear as two separate rolls rather than one larger chance.",
      // Charged Strike alone. Lightning Strike lands the weapon's full damage,
      // so this doubles that half of it — which is why its build page calls
      // Critical Strike the best points on any Amazon.
      "Worth nothing to Charged Strike, whose damage is entirely lightning and carries none of the weapon's physical.",
    ],
    confidence: "verified",
  },
  {
    slug: "dodge",
    name: "Dodge",
    classSlug: "amazon",
    tree: "passive-and-magic",
    kind: "passive",
    requiredLevel: 6,
    summary: "A chance to avoid a melee attack entirely while standing still or attacking.",
    mechanics: [
      "Avoiding an attack negates it completely — this is not damage reduction.",
      "Dodge, Avoid and Evade cover three different situations and do not overlap.",
    ],
    confidence: "verified",
  },
  {
    slug: "slow-missiles",
    name: "Slow Missiles",
    classSlug: "amazon",
    tree: "passive-and-magic",
    kind: "curse",
    element: "magic",
    requiredLevel: 12,
    prerequisites: ["inner-sight"],
    summary: "Slows enemy projectiles, making ranged packs far less dangerous.",
    mechanics: [
      "One of the strongest defensive buttons in the game against Hell's ranged attackers, and it costs one point.",
    ],
    confidence: "verified",
  },
  {
    slug: "avoid",
    name: "Avoid",
    classSlug: "amazon",
    tree: "passive-and-magic",
    kind: "passive",
    requiredLevel: 12,
    prerequisites: ["dodge"],
    summary: "A chance to avoid a ranged or magical attack while standing still or attacking.",
    confidence: "verified",
  },
  {
    slug: "penetrate",
    name: "Penetrate",
    classSlug: "amazon",
    tree: "passive-and-magic",
    kind: "passive",
    requiredLevel: 18,
    prerequisites: ["critical-strike"],
    summary: "Raises attack rating. Always on, and it also raises the Valkyrie's.",
    mechanics: [
      "Hard points here feed the Valkyrie's own attack rating, which is a real reason to put more than one in.",
    ],
    confidence: "verified",
  },
  {
    slug: "decoy",
    name: "Decoy",
    classSlug: "amazon",
    tree: "passive-and-magic",
    kind: "summon",
    requiredLevel: 24,
    prerequisites: ["slow-missiles"],
    summary:
      "Places a copy of the Amazon that enemies attack instead of you. Also feeds the Valkyrie's life.",
    mechanics: [
      "It does not move or attack. Its whole job is to be shot at somewhere you are not.",
      "Hard points here raise the Valkyrie's life, so it is never a wasted point on a build that summons her.",
    ],
    confidence: "verified",
  },
  {
    slug: "evade",
    name: "Evade",
    classSlug: "amazon",
    tree: "passive-and-magic",
    kind: "passive",
    requiredLevel: 24,
    prerequisites: ["avoid"],
    summary: "A chance to avoid any attack while walking or running.",
    mechanics: [
      "The one that covers you while moving, which is where Dodge and Avoid do nothing.",
    ],
    confidence: "verified",
  },
  {
    slug: "valkyrie",
    name: "Valkyrie",
    classSlug: "amazon",
    tree: "passive-and-magic",
    kind: "summon",
    requiredLevel: 30,
    prerequisites: ["decoy", "evade"],
    summary: "Summons a warrior who fights beside you and takes hits meant for you.",
    synergies: [{ skill: "decoy", bonus: "+20% life per level" }],
    mechanics: [
      "She inherits your Dodge, Avoid, Evade and Critical Strike levels, and Penetrate raises her attack rating.",
      "Re-summon her when she dies; there is no cooldown worth planning around.",
    ],
    confidence: "verified",
  },
  {
    slug: "pierce",
    name: "Pierce",
    classSlug: "amazon",
    tree: "passive-and-magic",
    kind: "passive",
    requiredLevel: 30,
    prerequisites: ["penetrate"],
    summary:
      "A chance for projectiles to pass through a target and carry on. The multiplier behind Lightning Fury.",
    mechanics: [
      "Every enemy a Lightning Fury javelin pierces releases another burst of bolts, so this multiplies the skill rather than adding to it.",
      "Pierce from gear stacks with the skill, which is why builds state a chance to reach rather than a number of points to spend.",
    ],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Bow and Crossbow
  // -------------------------------------------------------------------------
  {
    slug: "magic-arrow",
    name: "Magic Arrow",
    classSlug: "amazon",
    tree: "bow-and-crossbow",
    kind: "attack",
    element: "magic",
    requiredLevel: 1,
    damageModel: "weapon-converted-to-element",
    summary:
      "Converts part of the arrow's physical damage to magic, and costs no arrows to fire.",
    mechanics: [
      "Magic damage is resisted by almost nothing, so this stays useful long after its damage stops scaling.",
      "It creates its own arrow, which is why it never depletes a quiver.",
    ],
    confidence: "verified",
  },
  {
    slug: "fire-arrow",
    name: "Fire Arrow",
    classSlug: "amazon",
    tree: "bow-and-crossbow",
    kind: "attack",
    element: "fire",
    requiredLevel: 1,
    damageModel: "weapon-converted-to-element",
    summary: "Adds fire damage to the shot and converts part of its physical damage to fire.",
    synergies: [{ skill: "exploding-arrow", bonus: "+12% damage per level" }],
    confidence: "verified",
  },
  {
    slug: "cold-arrow",
    name: "Cold Arrow",
    classSlug: "amazon",
    tree: "bow-and-crossbow",
    kind: "attack",
    element: "cold",
    requiredLevel: 6,
    damageModel: "weapon-converted-to-element",
    summary: "Adds cold damage and a chill, and converts part of the shot's physical damage to cold.",
    synergies: [{ skill: "ice-arrow", bonus: "+12% damage per level" }],
    confidence: "verified",
  },
  {
    slug: "multiple-shot",
    name: "Multiple Shot",
    classSlug: "amazon",
    tree: "bow-and-crossbow",
    kind: "attack",
    element: "physical",
    requiredLevel: 6,
    prerequisites: ["magic-arrow"],
    summary: "Fires a spread of arrows in a cone. The Amazon's widest physical clear.",
    mechanics: [
      "Each arrow carries three-quarters of the bow's damage rather than all of it.",
      "Only the two centre arrows apply on-hit effects such as knockback or life steal.",
    ],
    confidence: "verified",
  },
  {
    slug: "exploding-arrow",
    name: "Exploding Arrow",
    classSlug: "amazon",
    tree: "bow-and-crossbow",
    kind: "attack",
    element: "fire",
    requiredLevel: 12,
    prerequisites: ["fire-arrow", "multiple-shot"],
    damageModel: "weapon-plus-element",
    summary: "An arrow that explodes on impact, damaging everything around the target.",
    synergies: [{ skill: "fire-arrow", bonus: "+14% damage per level" }],
    mechanics: [
      "Combined with Pierce, one shot through a packed group sets off a chain of explosions.",
      "Flat fire damage from gear raises the explosion, not just the arrow.",
    ],
    confidence: "verified",
  },
  {
    slug: "ice-arrow",
    name: "Ice Arrow",
    classSlug: "amazon",
    tree: "bow-and-crossbow",
    kind: "attack",
    element: "cold",
    requiredLevel: 18,
    prerequisites: ["cold-arrow"],
    damageModel: "weapon-plus-element",
    summary: "Adds cold damage and freezes the target solid rather than merely chilling it.",
    synergies: [
      { skill: "cold-arrow", bonus: "+8% damage per level" },
      { skill: "freezing-arrow", bonus: "+5% freeze length per level" },
    ],
    confidence: "verified",
  },
  {
    slug: "guided-arrow",
    name: "Guided Arrow",
    classSlug: "amazon",
    tree: "bow-and-crossbow",
    kind: "attack",
    element: "physical",
    requiredLevel: 18,
    prerequisites: ["cold-arrow", "multiple-shot"],
    summary: "An arrow that tracks its target and cannot miss. The bow Amazon's single-target answer.",
    synergies: [{ skill: "multiple-shot", bonus: "+12% damage per level" }],
    mechanics: [
      "It seeks, so it hits around corners and through a crowd — which is what makes it a boss skill.",
    ],
    confidence: "verified",
  },
  {
    slug: "strafe",
    name: "Strafe",
    classSlug: "amazon",
    tree: "bow-and-crossbow",
    kind: "attack",
    element: "physical",
    requiredLevel: 24,
    prerequisites: ["guided-arrow"],
    summary: "Fires at several targets in one burst, one more shot per skill level up to a cap.",
    synergies: [
      { skill: "guided-arrow", bonus: "+10% damage per level" },
      { skill: "multiple-shot", bonus: "+5% damage per level" },
    ],
    mechanics: [
      "Targets are picked at random within range, so it is strongest when everything is already in front of you.",
      "You are locked in the animation for its duration.",
    ],
    confidence: "verified",
  },
  {
    slug: "immolation-arrow",
    name: "Immolation Arrow",
    classSlug: "amazon",
    tree: "bow-and-crossbow",
    kind: "attack",
    element: "fire",
    requiredLevel: 24,
    prerequisites: ["exploding-arrow"],
    damageModel: "weapon-plus-element",
    summary: "An arrow that explodes and leaves a patch of fire burning on the ground.",
    synergies: [{ skill: "exploding-arrow", bonus: "+10% damage per level" }],
    mechanics: [
      "The ground fire is the point — it turns a corridor into a place monsters cannot cross.",
    ],
    confidence: "verified",
  },
  {
    slug: "freezing-arrow",
    name: "Freezing Arrow",
    classSlug: "amazon",
    tree: "bow-and-crossbow",
    kind: "attack",
    element: "cold",
    requiredLevel: 30,
    prerequisites: ["ice-arrow"],
    damageModel: "weapon-plus-element",
    summary: "An arrow that bursts into an area of cold, freezing everything it catches.",
    synergies: [
      { skill: "cold-arrow", bonus: "+12% damage per level" },
      { skill: "ice-arrow", bonus: "+5% freeze length per level" },
    ],
    mechanics: [
      "Freezing a pack is as good as killing it for as long as it lasts, which is why this build reads as safe.",
      "Its freeze length does not grow with its own level — only Ice Arrow extends it.",
    ],
    confidence: "verified",
  },
];
