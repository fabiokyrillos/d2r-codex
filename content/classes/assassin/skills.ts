import type { Skill, SkillTree } from "@/lib/types";

/**
 * The Assassin's three skill trees and thirty skills.
 *
 * Positions, unlock levels, prerequisites and every published magnitude come
 * from the pinned extraction the graph is generated from — blizzhackers/d2data
 * at `fc46999`, "Updated for patch 3.3.93847". Nothing here is transcribed from
 * a guide.
 *
 * Six of her thirty rows are named one thing in `skills.txt` and another
 * everywhere a player looks. `SLUG_OVERRIDES` in `skill-graph-rules.ts` maps
 * them and pins each by its own row; the identifiers are the join key and reach
 * no page, URL or sitemap entry.
 *
 * FIVE THINGS THAT ARE NOT LIKE THE OTHER CLASSES
 * -----------------------------------------------
 * Each is a case where a rule carried over from another class is wrong here,
 * and each has a control in `assassin.test.ts`.
 *
 *   **Charge-ups are not finishers.** Six martial arts skills carry
 *   `progressive = 1`: they build charges and do not spend them. Four carry
 *   `finishing = 1` with `prgchargesconsumed = 1`: they spend charges and build
 *   none. The two sets do not overlap, and a charge-up is not "the attack" — it
 *   is what makes the next attack worth landing. Every charge-up's
 *   `auralencalc` is `par3 = 375`, so charges stand for **15 seconds** and not
 *   the 14 some guides state.
 *
 *   **The kicks do not use the weapon.** Dragon Talon, Dragon Tail and Dragon
 *   Flight carry `Kick = 1` and no `SrcDam` at all. Their damage is the boots',
 *   which is why a Kicksin chases boots rather than claws and why the claws in
 *   her hands contribute nothing to the kick but their +skills. Dragon Claw is
 *   the exception in the same row of the tree: `SrcDam = 128` and no `Kick`, so
 *   it is a weapon attack like any other.
 *
 *   **The blades take three quarters of the weapon.** Blade Sentinel, Blade
 *   Fury and Blade Shield all carry `SrcDam = 96`, and 96/128 is 75%. They are
 *   the only skills on the class that scale off a normal weapon rather than a
 *   claw, which is the whole reason the Blade build holds one.
 *
 *   **Traps are summons, and there are five of them.** Every sentry carries
 *   `pettype = assassintrap` and `petmax = 5`. That five is a ceiling on traps
 *   *in total* rather than per skill, so a bar with Lightning Sentry and Death
 *   Sentry on it is dividing the same five between them.
 *
 *   **Venom is not ordinary poison.** Its `aurastat3` is
 *   `skill_poison_override_length` and its `ELen` is 10 — ten frames, four
 *   tenths of a second. The whole poison lands in that window instead of over
 *   the usual seconds, which is what makes it enormous on a fast attack and why
 *   it overwrites rather than stacks.
 *
 * Tree order is the public one — Martial Arts, Shadow Disciplines, Traps — and
 * is independent of the game's 1-based `SkillPage`, which numbers them the
 * other way round. `order` drives what a reader sees; `page` stays in the graph
 * as the extraction gave it.
 */

export const assassinTrees: SkillTree[] = [
  {
    slug: "martial-arts",
    name: "Martial Arts",
    classSlug: "assassin",
    order: 1,
    summary: "Charge-up attacks that store power, and finishing moves that spend it.",
    theme:
      "Two halves that only work together. Six skills build charges and four spend them, and neither side is a build on its own — the charge-ups carry no payoff you can press and the finishers hit for a fraction of what a charged one does.",
  },
  {
    slug: "shadow-disciplines",
    name: "Shadow Disciplines",
    classSlug: "assassin",
    order: 2,
    summary: "Self-buffs, two shadow minions, and the best crowd control the class has.",
    theme:
      "The tree every Assassin spends points in whatever she kills with. Fade and Burst of Speed are the class's two defining buffs, Mind Blast stuns a screen, and Shadow Master is a minion that casts your own skills back at the room.",
  },
  {
    slug: "traps",
    name: "Traps",
    classSlug: "assassin",
    order: 3,
    summary: "Laid sentries that fire on their own, plus the three blade skills.",
    theme:
      "Damage you place rather than aim. Five sentries stand at once and keep firing while you move, which is why the trap Assassin is one of the safest characters in the game — and the three blade skills share the tree without sharing anything else.",
  },
];

export const assassinSkills: Skill[] = [
  // -- Martial Arts --------------------------------------------------------
  {
    slug: "tiger-strike",
    name: "Tiger Strike",
    classSlug: "assassin",
    tree: "martial-arts",
    kind: "attack",
    requiredLevel: 1,
    summary:
      "A charge-up that multiplies the damage of the finisher that spends it. The largest single multiplier in the tree.",
    mechanics: [
      "**A charge-up, not an attack you finish a fight with.** It stores up to three charges and each one adds its damage bonus to the *finisher* you release them with. Hitting with Tiger Strike alone is a normal weapon swing.",
      "Charges last **15 seconds** — `375` frames — and each one also carries +50% attack rating, which is most of why a martial artist hits at all.",
      "The bonus is a percentage of weapon damage and it is enormous: 100% at one point and 20% more per level, applied per charge.",
    ],
    confidence: "verified",
  },
  {
    slug: "dragon-talon",
    name: "Dragon Talon",
    classSlug: "assassin",
    tree: "martial-arts",
    kind: "attack",
    requiredLevel: 1,
    damageModel: "kick",
    summary:
      "A rapid series of kicks that spends charges. The kicks take their damage from your boots, not your weapon.",
    mechanics: [
      "**Kick damage comes from the boots.** The row carries `Kick = 1` and no weapon-damage share at all, so the claws in your hands add their +skills and nothing else. This is why a Kicksin hunts for boots and upgrades them.",
      "The number of kicks is `level / 6 + 1`: one at level 1, two at 6, three at 12, four at 18 and five at 24 and beyond.",
      "**A finisher.** It spends whatever charges are standing, and while it is spending them it cannot miss — the row's Param8 enables Always Hit only when charges are consumed.",
      "Each kick rolls Crushing Blow separately, which is why the build kills bosses far above its listed damage.",
    ],
    confidence: "verified",
  },
  {
    slug: "fists-of-fire",
    name: "Fists of Fire",
    classSlug: "assassin",
    tree: "martial-arts",
    kind: "attack",
    element: "fire",
    requiredLevel: 6,
    damageModel: "weapon-plus-element",
    summary: "A charge-up that adds fire damage and leaves burning ground where it lands.",
    synergies: [{ skill: "phoenix-strike", bonus: "+12% damage per level" }],
    mechanics: [
      "**A charge-up.** The weapon's full damage lands and the tabulated fire lands with it; the charges are spent by a finisher, not by this.",
      "The third charge creates a wall of ground fire rather than a larger hit, so the skill's value is area denial as much as damage.",
      "Charges stand for 15 seconds and each carries +50% attack rating.",
    ],
    confidence: "verified",
  },
  {
    slug: "dragon-claw",
    name: "Dragon Claw",
    classSlug: "assassin",
    tree: "martial-arts",
    kind: "attack",
    requiredLevel: 6,
    prerequisites: ["dragon-talon"],
    summary:
      "A two-claw strike that spends charges. The one finisher that uses the weapon rather than the boots.",
    synergies: [{ skill: "claw-mastery", bonus: "+4% damage per level" }],
    mechanics: [
      "**The exception among the finishers.** It carries the weapon's full damage and no `Kick` flag, so unlike Dragon Talon, Tail and Flight it scales with the claws you are holding.",
      "It strikes with both claws, so it needs two of them equipped to do what it says.",
      "Claw Mastery raises its damage directly — 4% per hard point, read off Claw Mastery's base level.",
      "**A finisher.** It spends standing charges and cannot miss while doing so.",
    ],
    confidence: "verified",
  },
  {
    slug: "cobra-strike",
    name: "Cobra Strike",
    classSlug: "assassin",
    tree: "martial-arts",
    kind: "attack",
    requiredLevel: 12,
    prerequisites: ["tiger-strike"],
    summary: "A charge-up that turns the finisher into life and mana steal rather than damage.",
    mechanics: [
      "**Steal, not damage.** Its charges give the finisher life and mana stolen per hit — 40% at one point and 5% more per level — and add nothing to the hit itself.",
      "This is how a martial artist survives without a life-steal weapon, and it is why one point is worth taking even on a build that finishes with Tiger Strike charges.",
      "Charges stand for 15 seconds, and like every charge-up each carries +50% attack rating.",
    ],
    confidence: "verified",
  },
  {
    slug: "claws-of-thunder",
    name: "Claws of Thunder",
    classSlug: "assassin",
    tree: "martial-arts",
    kind: "attack",
    element: "lightning",
    requiredLevel: 18,
    prerequisites: ["fists-of-fire"],
    damageModel: "weapon-plus-element",
    summary: "A charge-up that adds lightning, releasing a nova and chained bolts at full charge.",
    synergies: [{ skill: "phoenix-strike", bonus: "+8% damage per level" }],
    mechanics: [
      "**A charge-up.** The weapon's damage lands in full and the lightning lands with it.",
      "The second charge fires a nova and the third releases charged bolts, so the skill goes from single-target to crowd control as it fills.",
      "Charges stand for 15 seconds and each carries +50% attack rating.",
    ],
    confidence: "verified",
  },
  {
    slug: "dragon-tail",
    name: "Dragon Tail",
    classSlug: "assassin",
    tree: "martial-arts",
    kind: "attack",
    element: "fire",
    requiredLevel: 18,
    prerequisites: ["dragon-claw"],
    damageModel: "kick",
    summary: "A kick that detonates in a fire explosion around the target. The Martial Arts answer to a crowd.",
    mechanics: [
      "**Kick damage, so the boots decide it** — and the fire explosion is a share of that kick rather than a number of its own, which is why the graph tabulates no fire range for it.",
      "The explosion has a radius of 6 and hits everything in it, making this the one finisher that clears rather than kills one thing.",
      "**It is slower than it looks.** The row carries a −40% attack speed penalty, so a Dragon Tail bar does not reach the breakpoints a Dragon Talon bar does.",
      "**A finisher.** It spends standing charges and cannot miss while doing so.",
    ],
    confidence: "verified",
  },
  {
    slug: "blades-of-ice",
    name: "Blades of Ice",
    classSlug: "assassin",
    tree: "martial-arts",
    kind: "attack",
    element: "cold",
    requiredLevel: 24,
    prerequisites: ["claws-of-thunder"],
    damageModel: "weapon-plus-element",
    summary: "A charge-up that adds cold damage and freezes what it hits.",
    synergies: [{ skill: "phoenix-strike", bonus: "+8% damage per level" }],
    mechanics: [
      "**A charge-up.** The weapon's damage lands in full and the cold lands with it.",
      "It chills and freezes, which on a melee character is defence as much as damage — the thing you are standing next to stops swinging.",
      "Charges stand for 15 seconds and each carries +50% attack rating.",
    ],
    confidence: "verified",
  },
  {
    slug: "dragon-flight",
    name: "Dragon Flight",
    classSlug: "assassin",
    tree: "martial-arts",
    kind: "attack",
    requiredLevel: 24,
    prerequisites: ["dragon-tail"],
    damageModel: "kick",
    summary: "Teleports to a target and kicks it. The class's only movement skill without Enigma.",
    mechanics: [
      "**It is a teleport that needs a target.** Range 38, and it puts you next to whatever you clicked — which is movement, escape and engage in one button, and the only one the class has natively.",
      "Kick damage, so the boots decide it. The damage bonus is large — 100% at one point and 35% per level — but it is a share of a kick.",
      "**A finisher.** It spends standing charges, which makes it a way to deliver a full Tiger Strike stack to something across the room.",
      "It costs 15 mana and does not care about the weapon in your hands.",
    ],
    confidence: "verified",
  },
  {
    slug: "phoenix-strike",
    name: "Phoenix Strike",
    classSlug: "assassin",
    tree: "martial-arts",
    kind: "attack",
    requiredLevel: 30,
    prerequisites: ["cobra-strike", "blades-of-ice"],
    summary:
      "A charge-up whose three charges are three different elements. The reason a Martial Arts Assassin almost never meets an immunity wall.",
    mechanics: [
      "**Three charges, three elements.** The first releases a meteor, the second chain lightning and the third a burst of ice — fire, lightning and cold from one skill, so stopping all of it takes three immunities at once. **Exactly one row in the extraction has them**: a Hell-level-84 `megademon` carrying 145 to fire, cold and lightning. It displays as *Pit Lord*, and two other rows display that same name and are fire-immune only — so the wall exists, it is one monster, and its name does not tell you which one you are looking at.",
      "**It is a charge-up, not a finisher.** The elements release when a *finisher* spends the charges. Pressing Phoenix Strike alone builds them and swings the weapon.",
      "It feeds Fists of Fire, Claws of Thunder and Blades of Ice rather than the other way round, so points here raise three other skills as well.",
      "Charges stand for 15 seconds and each carries +25% attack rating — half what the other charge-ups give.",
    ],
    confidence: "verified",
  },

  // -- Shadow Disciplines --------------------------------------------------
  {
    slug: "claw-mastery",
    name: "Claw Mastery",
    classSlug: "assassin",
    tree: "shadow-disciplines",
    kind: "passive",
    requiredLevel: 1,
    summary: "Raises damage, attack rating and critical chance with claws. Every melee Assassin's first point.",
    mechanics: [
      "It applies only to claws — the row is gated on the `h2h` item type — so a Blade Assassin holding a normal weapon gets nothing from it.",
      "Attack rating 30% at one point and 10% more per level; damage 35% and 4% per level; critical hit chance climbing toward 25%.",
      "Dragon Claw reads its **hard-point** level for a further 4% damage per point, so gear that adds skills does not buy that part.",
    ],
    confidence: "verified",
  },
  {
    slug: "psychic-hammer",
    name: "Psychic Hammer",
    classSlug: "assassin",
    tree: "shadow-disciplines",
    kind: "spell",
    element: "magic",
    requiredLevel: 1,
    summary: "A magic hammer that knocks a target backwards. A one-point prerequisite for the tree's real skills.",
    mechanics: [
      "Its knockback is certain against a normal monster, and a diminishing chance against a unique or a boss — 50% to 100% and 25% to 99% respectively.",
      "The damage is small and stays small. Its reason for existing on the bar is that it is the gate to Cloak of Shadows and Mind Blast.",
    ],
    confidence: "verified",
  },
  {
    slug: "burst-of-speed",
    name: "Burst of Speed",
    classSlug: "assassin",
    tree: "shadow-disciplines",
    kind: "buff",
    requiredLevel: 6,
    prerequisites: ["claw-mastery"],
    summary: "A self-buff granting run speed and attack speed. It cannot be up at the same time as Fade.",
    mechanics: [
      "**Burst of Speed and Fade are mutually exclusive.** Both write the same kind of self-state and casting one drops the other, so the choice is permanent per fight rather than a pair of buffs you keep up together.",
      "Run speed from 15% to 70% and attack speed from 15% to 60%, both on a diminishing curve — the first points are worth far more than the last.",
      "It lasts 3000 frames at one point and 300 more per level: two minutes at one point, and long enough to forget about by level 20.",
      "It raises how fast traps are laid, because laying a trap is an attack and attack speed governs it.",
    ],
    confidence: "verified",
  },
  {
    slug: "weapon-block",
    name: "Weapon Block",
    classSlug: "assassin",
    tree: "shadow-disciplines",
    kind: "passive",
    requiredLevel: 12,
    prerequisites: ["claw-mastery"],
    summary: "Lets claws block like a shield. Not the same mechanic as shield block, and it does not need one.",
    mechanics: [
      "**This is not shield block.** It is its own passive, gated on holding claws, and it works with no shield equipped at all — which is what lets a two-claw Assassin have a block chance in the first place.",
      "The chance runs from 20% to 65% on a diminishing curve and is capped at 65% rather than the 75% a shield reaches.",
      "It applies only with claws. A Blade Assassin holding a normal weapon blocks nothing.",
    ],
    confidence: "verified",
  },
  {
    slug: "cloak-of-shadows",
    name: "Cloak of Shadows",
    classSlug: "assassin",
    tree: "shadow-disciplines",
    kind: "spell",
    requiredLevel: 12,
    prerequisites: ["psychic-hammer"],
    summary:
      "Blinds every monster on screen and strips their defence. The class's panic button and its best single utility skill.",
    mechanics: [
      "Radius 30 — effectively the whole screen — and it holds for 200 frames at one point plus 25 per level.",
      "It cuts monster defence by 15% at one point and 3% more per level, capped at 95%, while raising your own by 10% and 3% per level.",
      "Blinded monsters lose track of you, which is why one point turns a dangerous room into a room you can leave.",
    ],
    confidence: "verified",
  },
  {
    slug: "fade",
    name: "Fade",
    classSlug: "assassin",
    tree: "shadow-disciplines",
    kind: "buff",
    requiredLevel: 18,
    prerequisites: ["burst-of-speed"],
    summary:
      "A self-buff granting resistances, curse-length reduction and physical damage reduction. The Hardcore Assassin's answer to everything.",
    mechanics: [
      "**Fade and Burst of Speed are mutually exclusive.** Casting one drops the other. Fade is what a trapper runs; Burst of Speed is what a kicker runs.",
      "All four resistances from 10% to 75% on a diminishing curve, curse length cut by 40% to 90%, and physical damage reduction of 1% per level on top.",
      "It lasts 3000 frames at one point and 300 more per level, same as Burst of Speed.",
      "Its resistances stack over the cap in the sense that they are added before it, which is what makes it the standard answer to Hell's −100 penalty.",
    ],
    confidence: "verified",
  },
  {
    slug: "shadow-warrior",
    name: "Shadow Warrior",
    classSlug: "assassin",
    tree: "shadow-disciplines",
    kind: "summon",
    requiredLevel: 18,
    prerequisites: ["cloak-of-shadows", "weapon-block"],
    summary: "A shadow copy that repeats the skills you use. One at a time, and it competes with Shadow Master.",
    mechanics: [
      "**One shadow, and only one.** Shadow Warrior and Shadow Master share a pet type with a ceiling of one, so casting either replaces the other.",
      "It mirrors the skills on your own bar rather than choosing its own, which makes it predictable and, on a trapper, another source of sentries.",
      "It gains 15% life, 40% attack rating and 12% defence per level, and its resistances climb 4% per level to a cap of 75%.",
    ],
    confidence: "verified",
  },
  {
    slug: "mind-blast",
    name: "Mind Blast",
    classSlug: "assassin",
    tree: "shadow-disciplines",
    kind: "spell",
    requiredLevel: 24,
    prerequisites: ["cloak-of-shadows"],
    summary:
      "Stuns everything in a radius and converts some of it to fight for you. The best crowd control on the class.",
    mechanics: [
      "The stun runs 50 frames at one point and 5 more per level, and it is what makes a trapper safe while the sentries do the work.",
      "It converts a share of what it hits — 15% to 40% on a diminishing curve — for 150 frames plus a random bonus.",
      "Radius 4, cast at range, and cheap enough at 15 mana to press constantly.",
    ],
    confidence: "verified",
  },
  {
    slug: "venom",
    name: "Venom",
    classSlug: "assassin",
    tree: "shadow-disciplines",
    kind: "buff",
    element: "poison",
    requiredLevel: 30,
    prerequisites: ["fade"],
    summary:
      "Adds poison damage to every attack, delivered in four tenths of a second rather than over seconds.",
    mechanics: [
      "**It is not ordinary poison.** The row overrides poison length outright and sets it to 10 frames — four tenths of a second — so the entire poison amount lands almost at once instead of ticking away over several seconds.",
      "That is why it is enormous on a fast attack and why the usual poison intuition is wrong here: the number is not damage over time in any useful sense, it is damage.",
      "Because it *overrides* length rather than adding to it, it does not stack with other poison sources — it replaces their timing.",
      "It lasts 3000 frames at one point and 300 more per level.",
    ],
    confidence: "verified",
  },
  {
    slug: "shadow-master",
    name: "Shadow Master",
    classSlug: "assassin",
    tree: "shadow-disciplines",
    kind: "summon",
    requiredLevel: 30,
    prerequisites: ["shadow-warrior"],
    summary:
      "A shadow that chooses its own skills and cannot be killed easily. The stronger of the two shadows, and it replaces the other.",
    mechanics: [
      "**One shadow, and only one.** It shares Shadow Warrior's pet type and ceiling of one, so the two never stand together.",
      "Its resistances run from 5% to 90% on a diminishing curve — above the player cap, which is most of why it survives Hell.",
      "It uses any Assassin skill rather than mirroring yours, so it is less predictable than Shadow Warrior and generally more useful.",
      "It gains 15% life and 40% attack rating per level.",
    ],
    confidence: "verified",
  },

  // -- Traps ---------------------------------------------------------------
  {
    slug: "fire-blast",
    name: "Fire Blast",
    classSlug: "assassin",
    tree: "traps",
    kind: "spell",
    element: "fire",
    requiredLevel: 1,
    summary:
      "A thrown bomb that explodes on impact. The only trap skill you aim, and the one every other trap feeds.",
    synergies: [
      { skill: "shock-web", bonus: "+11% damage per level" },
      { skill: "charged-bolt-sentry", bonus: "+11% damage per level" },
      { skill: "wake-of-fire", bonus: "+11% damage per level" },
      { skill: "lightning-sentry", bonus: "+11% damage per level" },
      { skill: "wake-of-inferno", bonus: "+11% damage per level" },
    ],
    mechanics: [
      "**Thrown, not laid.** It is an arcing missile you target rather than a sentry you place, which makes it the one trap skill whose damage arrives where and when you choose.",
      "Every one of the other five trap skills raises its damage — 11% per hard point each — so it stays relevant on a bar that never presses it.",
      "Explosion radius 5, and it costs 24 mana at one point.",
    ],
    confidence: "verified",
  },
  {
    slug: "shock-web",
    name: "Shock Web",
    classSlug: "assassin",
    tree: "traps",
    kind: "spell",
    element: "lightning",
    requiredLevel: 6,
    prerequisites: ["fire-blast"],
    summary: "A spray of lightning missiles across the ground. A levelling skill that stops scaling.",
    synergies: [
      { skill: "charged-bolt-sentry", bonus: "+17% damage per level" },
      { skill: "lightning-sentry", bonus: "+17% damage per level" },
    ],
    mechanics: [
      "It creates 6 missiles at one point, one more every 4 levels, and one more for every 3 hard points of Fire Blast.",
      "The missiles travel along the ground and hit what stands in them, so it wants a corridor rather than an open room.",
      "It is cheap at 6 mana and carries the build to Charged Bolt Sentry, after which it is kept for the synergy rather than the button.",
    ],
    confidence: "verified",
  },
  {
    slug: "blade-sentinel",
    name: "Blade Sentinel",
    classSlug: "assassin",
    tree: "traps",
    kind: "summon",
    element: "physical",
    requiredLevel: 6,
    summary: "A spinning blade that patrols back and forth. Physical damage from a tree that has almost none.",
    synergies: [
      { skill: "blade-fury", bonus: "+10% damage per level" },
      { skill: "blade-shield", bonus: "+10% damage per level" },
    ],
    mechanics: [
      "**It takes three quarters of your weapon's damage**, which is what makes the Blade skills the one place on the class where a normal weapon beats a claw.",
      "It travels a fixed path and returns, so it is placed across a choke point rather than aimed at a monster.",
      "It lasts 100 frames at one point and 12 more per level, and counts against the five-trap ceiling like any sentry.",
    ],
    confidence: "verified",
  },
  {
    slug: "charged-bolt-sentry",
    name: "Charged Bolt Sentry",
    classSlug: "assassin",
    tree: "traps",
    kind: "summon",
    element: "lightning",
    requiredLevel: 12,
    prerequisites: ["shock-web"],
    summary: "A sentry firing charged bolts. The trapper's main damage until Lightning Sentry opens at 24.",
    synergies: [
      { skill: "fire-blast", bonus: "+9% damage per level" },
      { skill: "lightning-sentry", bonus: "+9% damage per level, and one extra shot per 4 levels" },
    ],
    mechanics: [
      "Five shots at one point, and one more for every 4 hard points of Lightning Sentry — so the level-24 skill improves this one after you have moved on from it.",
      "Bolts spread as they travel, which makes it good against a group in front of you and poor against one thing.",
      "Counts against the five-trap ceiling shared with every other sentry.",
    ],
    confidence: "verified",
  },
  {
    slug: "wake-of-fire",
    name: "Wake of Fire",
    classSlug: "assassin",
    tree: "traps",
    kind: "summon",
    element: "fire",
    requiredLevel: 12,
    prerequisites: ["fire-blast"],
    summary:
      "A sentry that sends waves of fire along the ground. The levelling trapper's main skill through Nightmare.",
    synergies: [
      { skill: "fire-blast", bonus: "+10% damage per level" },
      { skill: "wake-of-inferno", bonus: "+10% damage per level" },
    ],
    mechanics: [
      "Five shots at one point, each a wave that travels outward and hits everything in its line.",
      "**Two of these cannot both damage the same target**, so they are spread across a room rather than stacked on a point — which is the opposite of how Lightning Sentry is used.",
      "Counts against the five-trap ceiling shared with every other sentry.",
    ],
    confidence: "verified",
  },
  {
    slug: "blade-fury",
    name: "Blade Fury",
    classSlug: "assassin",
    tree: "traps",
    kind: "attack",
    element: "physical",
    requiredLevel: 18,
    prerequisites: ["blade-sentinel", "wake-of-fire"],
    damageModel: "weapon-plus-element",
    summary: "Throws spinning blades at range that carry three quarters of your weapon's damage.",
    synergies: [
      { skill: "blade-sentinel", bonus: "+10% damage per level" },
      { skill: "blade-shield", bonus: "+10% damage per level" },
    ],
    mechanics: [
      "**Three quarters of the weapon, not all of it.** The row's weapon share is 96 of 128 — and only if the weapon is one-handed. The blade missile carries `Half2HSrc`, which halves the transferred share on a two-handed weapon to 37.5%, so a claw is never penalised and a two-hander always is.",
      "It applies weapon effects at range — a thrown blade still steals life and still triggers what the weapon triggers.",
      "It fires a blade every 5 frames while held, and costs mana per blade rather than per press.",
    ],
    confidence: "verified",
  },
  {
    slug: "lightning-sentry",
    name: "Lightning Sentry",
    classSlug: "assassin",
    tree: "traps",
    kind: "summon",
    element: "lightning",
    requiredLevel: 24,
    prerequisites: ["charged-bolt-sentry"],
    summary: "The trap Assassin's main damage. Ten bolts of lightning per sentry, and five sentries at once.",
    synergies: [
      { skill: "shock-web", bonus: "+18% damage per level" },
      { skill: "charged-bolt-sentry", bonus: "+18% damage per level" },
    ],
    mechanics: [
      "Ten shots per sentry, and the bolts pierce — which is why these are stacked on one spot rather than spread, and why a corridor kills faster than a room.",
      "**Five sentries at once, shared with every other trap.** A bar running Lightning and Death Sentry together is dividing the same five.",
      "Its damage is lightning only, so a lightning-immune pack is a wall rather than a slow fight. This is the build's one real weakness.",
    ],
    confidence: "verified",
  },
  {
    slug: "wake-of-inferno",
    name: "Wake of Inferno",
    classSlug: "assassin",
    tree: "traps",
    kind: "summon",
    element: "fire",
    requiredLevel: 24,
    prerequisites: ["wake-of-fire"],
    summary: "A sentry that breathes a continuous jet of fire. Single-target damage rather than area.",
    synergies: [
      { skill: "fire-blast", bonus: "+18% damage per level" },
      { skill: "wake-of-fire", bonus: "+18% damage per level" },
    ],
    mechanics: [
      "It streams fire at one target in front of it instead of covering ground, which makes it the fire tree's answer to a boss rather than to a crowd.",
      "Ten shots per sentry, and it counts against the same five-trap ceiling.",
      "Its damage is tabulated at a finer scale than the other traps — the row shifts by 4 rather than 8 — so the published range is the per-tick figure and it ticks quickly.",
    ],
    confidence: "verified",
  },
  {
    slug: "death-sentry",
    name: "Death Sentry",
    classSlug: "assassin",
    tree: "traps",
    kind: "summon",
    element: "lightning",
    requiredLevel: 30,
    prerequisites: ["lightning-sentry"],
    summary:
      "A sentry that explodes corpses and fires lightning. One point turns a cleared pack into a cleared room.",
    synergies: [{ skill: "lightning-sentry", bonus: "+12% damage per level" }],
    mechanics: [
      "**Two components, not one.** The row summons a corpse-exploding sentry *and* a lightning one, so it keeps working after the corpses run out.",
      "The corpse explosion is a share of the dead monster's own life, which is why it scales with what you killed rather than with points spent here.",
      "It is the reason a trapper clears a room from one kill, and one point is enough for the chain — further points buy the lightning component.",
      "Counts against the five-trap ceiling shared with every other sentry.",
    ],
    confidence: "verified",
  },
  {
    slug: "blade-shield",
    name: "Blade Shield",
    classSlug: "assassin",
    tree: "traps",
    kind: "buff",
    element: "physical",
    requiredLevel: 30,
    prerequisites: ["blade-fury"],
    summary: "Blades orbit you and cut what comes close, taking three quarters of your weapon's damage.",
    synergies: [
      { skill: "blade-sentinel", bonus: "+10% damage per level" },
      { skill: "blade-fury", bonus: "+10% damage per level" },
    ],
    mechanics: [
      "**It consumes weapon durability while it runs.** On an ethereal weapon that is a way to destroy a runeword, and it is the one hazard on this skill worth knowing before pressing it.",
      "Three quarters of the weapon's damage, dealt every 25 frames to everything within radius 6.",
      "It lasts 3000 frames at one point and 300 more per level.",
    ],
    confidence: "verified",
  },
];
