import type { Skill, SkillTree } from "@/lib/types";

/**
 * The Barbarian's three skill trees and thirty skills.
 *
 * Positions, unlock levels, prerequisites and every published magnitude come
 * from the pinned extraction the graph is generated from — blizzhackers/d2data
 * at `fc46999`, "Updated for patch 3.3.93847". Nothing here is transcribed from
 * a guide.
 *
 * One of his thirty rows is named one thing in `skills.txt` and another
 * everywhere a player looks: `Pole Arm Mastery` ships as **Polearm Mastery**.
 * `SLUG_OVERRIDES` in `skill-graph-rules.ts` maps it; the identifier stays the
 * join key and reaches no page, URL or sitemap entry. The other twenty-nine are
 * byte-identical to their shipped names — including `Blade Mastery`, which was
 * checked because it looked like a candidate and is not one.
 *
 * FIVE THINGS THAT ARE NOT LIKE THE OTHER CLASSES
 * -----------------------------------------------
 * Each is a case where a rule carried over from another class is wrong here,
 * and each has a control in `barbarian.test.ts`.
 *
 *   **The utility tree feeds the damage tree.** Berserk, Concentrate and Frenzy
 *   — the three skills every serious Barbarian is built on — all take their
 *   largest damage synergy from Warcries. Battle Orders gives Concentrate and
 *   Berserk 10% each per hard point on top of being the party's life buff, and
 *   Taunt gives Frenzy 8%. No other class in scope has its damage tree fed by
 *   its utility tree, and it is why a Barbarian's point plan never stays inside
 *   one page of the window.
 *
 *   **Whirlwind neither gives a synergy nor receives one.** `calc1 = ln12` and
 *   nothing else. Twelve of the thirty have both lists empty and eleven of them
 *   are passives or Grim Ward; Whirlwind is the only *attack* on the class in
 *   that position, so the forty-odd points a Whirlwind build has left over go to
 *   a mastery and to the shouts rather than to anything that raises the spin.
 *
 *   **Berserk's damage is magic, and it lends that to two other skills.**
 *   `calc4 = 100` under `EType = mag`: all of it, not part of it. Concentrate
 *   and Frenzy each read `calc4 = skill('Berserk'.blvl)` and convert 1% of their
 *   own damage to magic per hard point spent there. That relationship is **not**
 *   a synergy — the game does not label the parameter as one, so the graph
 *   correctly draws no edge — and it is the only route by which a Concentrate or
 *   Frenzy Barbarian hurts a physical immune.
 *
 *   **Three skills cannot be interrupted, and they are the three that matter.**
 *   `interrupt` is blank on eleven of the game's hundred and fifty player
 *   skills. Three are Concentrate, Frenzy and Whirlwind; the rest are Smite,
 *   Zeal, Charge, the two Druid forms and the three Assassin kicks. The game's
 *   own text settles the direction: Concentrate is "an attack that is not
 *   interruptible".
 *
 *   **The masteries are wider than their names.** `passiveitype` is an item-type
 *   code and the equivalence chains reach further than the tooltip does. Mace
 *   Mastery's `blun` reaches scepters, staves and wands; Spear Mastery's `spea`
 *   reaches javelins; Blade Mastery's `blde` is the type the game calls "Swords
 *   and Knives". A mastery picked from its name alone is picked wrong.
 *
 * Tree order is the public one — Warcries, Combat Masteries, Combat Skills — and
 * is the reverse of the game's 1-based `SkillPage`, which numbers Combat Skills
 * first. That reversal holds for all seven classes. `order` drives what a reader
 * sees; `page` stays in the graph as the extraction gave it.
 *
 * `barbarian-combat-skills` rather than `combat-skills`: that slug is the
 * Paladin's and tree slugs resolve globally. See `scripts/class-tree-rules.ts`.
 */

export const barbarianTrees: SkillTree[] = [
  {
    slug: "warcries",
    name: "Warcries",
    classSlug: "barbarian",
    order: 1,
    summary: "Shouts that buff a party, debuffs that break a room, and the class's two loot skills.",
    theme:
      "The tree every other class eventually borrows through a Call to Arms. Battle Orders is the largest life buff in the game and Battle Command adds a skill level to everyone, but the tree is also where the Barbarian's damage comes from: Berserk, Concentrate and Frenzy all take their biggest synergy from here.",
  },
  {
    slug: "combat-masteries",
    name: "Combat Masteries",
    classSlug: "barbarian",
    order: 2,
    summary: "Six weapon passives and four that keep you alive, all always-on.",
    theme:
      "One mastery per weapon family, and picking the wrong one is the most expensive mistake on the class — a mastery is worth nothing at all with the wrong thing in your hands. The other four are pure percentages: defence, resistances, stamina and run speed.",
  },
  {
    slug: "barbarian-combat-skills",
    name: "Combat Skills",
    classSlug: "barbarian",
    order: 3,
    summary: "Every attack the class has, from a level-1 knockback to the spin.",
    theme:
      "Two chains that never meet. One runs Bash to Stun to Concentrate to Berserk and ends in a single enormous hit; the other runs Double Swing to Double Throw to Frenzy and ends in the fastest attack in the game. Whirlwind sits at the bottom of both and belongs to neither.",
  },
];

export const barbarianSkills: Skill[] = [
  // -- Warcries ------------------------------------------------------------
  {
    slug: "howl",
    name: "Howl",
    classSlug: "barbarian",
    tree: "warcries",
    kind: "spell",
    requiredLevel: 1,
    summary:
      "Sends nearby monsters running. A one-point panic button that turns out to be Berserk's synergy.",
    mechanics: [
      "Monsters flee for 3 seconds at one point and a second more per level, running 24 units and 5 more per level before they stop.",
      "**It is worth points for a reason that has nothing to do with fear.** Howl gives Berserk +10% damage per hard point and War Cry +6%, so a Berserker maxes a level-1 utility skill and never presses it.",
      "It costs 4 mana and clears a room without killing anything, which on a melee character with no escape is sometimes the whole plan.",
    ],
    confidence: "verified",
  },
  {
    slug: "find-potion",
    name: "Find Potion",
    classSlug: "barbarian",
    tree: "warcries",
    kind: "spell",
    requiredLevel: 1,
    summary:
      "Rolls a potion out of a corpse. The gate to Find Item, and quietly the scaling behind Grim Ward.",
    mechanics: [
      "The chance runs from 0% to 100% on a diminishing curve. Of what it finds, 30% is a mana potion and 10% a rejuvenation; the rest is healing.",
      "**It is the only synergy Find Item has** — +1% find chance per hard point — which is why a horking build does not stop at one point here.",
      "**And it scales Grim Ward's debuff**, +5% enemy damage taken per hard point on top of the base 20%. That relationship is real and is not drawn as a synergy: the game does not label the parameter as one, so no edge exists for the graph to carry.",
      "It targets a corpse, so it is pressed after the fight rather than during it.",
    ],
    confidence: "verified",
  },
  {
    slug: "taunt",
    name: "Taunt",
    classSlug: "barbarian",
    tree: "warcries",
    kind: "curse",
    requiredLevel: 6,
    prerequisites: ["howl"],
    summary:
      "Pulls one monster onto you and weakens it. The Frenzy Barbarian's synergy, and a ranged puller for everyone else.",
    mechanics: [
      "It cuts the target's attack rating by 5% and 2% more per level, and its damage by the same, then makes it drop what it was doing and come to you.",
      "**It gives Frenzy +8% damage per hard point**, which is the reason a Frenzy bar carries a skill that pulls one monster at a time.",
      "Pulling a single monster out of a pack is how a melee character fights a pack it could not survive standing in, and it works on anything that is not a boss.",
      "3 mana, cast at range.",
    ],
    confidence: "verified",
  },
  {
    slug: "shout",
    name: "Shout",
    classSlug: "barbarian",
    tree: "warcries",
    kind: "buff",
    requiredLevel: 6,
    prerequisites: ["howl"],
    summary:
      "A party-wide defence buff whose real job is to make Battle Orders last. One of three shouts that extend each other.",
    synergies: [
      { skill: "battle-orders", bonus: "+5 seconds of duration per level" },
      { skill: "battle-command", bonus: "+5 seconds of duration per level" },
    ],
    mechanics: [
      "+100% defence and 10% more per level, for the whole party inside radius 19.",
      "**Its duration is the reason it is maxed, not its defence.** Shout, Battle Orders and Battle Command each add 5 seconds per hard point to the other two, so points here are what stop a Barbarian re-buffing every thirty seconds.",
      "30 seconds at one point and 10 more per level, before that mutual bonus.",
      "6 mana, and defence is the stat that matters least in Hell — which is why the shout is kept for the duration and the party.",
    ],
    confidence: "verified",
  },
  {
    slug: "find-item",
    name: "Find Item",
    classSlug: "barbarian",
    tree: "warcries",
    kind: "spell",
    requiredLevel: 12,
    prerequisites: ["find-potion"],
    summary:
      "Rolls a second drop out of an already-looted corpse. The only skill of its kind in the game.",
    synergies: [{ skill: "find-potion", bonus: "+1% find chance per level" }],
    mechanics: [
      "**It generates loot that did not exist.** The corpse has already dropped what it was going to; this rolls the table again, and that is the entire basis of the Travincal runner.",
      "The chance runs from 5% to 60% on a diminishing curve, plus 1% per hard point of Find Potion — the only skill that feeds it.",
      "Of what it finds, 30% is high quality and 5% is magic or better.",
      "It needs a corpse, so it does not work on anything that leaves none, and it costs 7 mana per attempt.",
    ],
    confidence: "verified",
  },
  {
    slug: "battle-cry",
    name: "Battle Cry",
    classSlug: "barbarian",
    tree: "warcries",
    kind: "curse",
    requiredLevel: 18,
    prerequisites: ["taunt"],
    summary:
      "Strips enemy defence and damage in a radius. The Barbarian's Amplify Damage, and War Cry's synergy.",
    mechanics: [
      "Enemy defence falls by 50% and 2% more per level; enemy damage by 25% and 1% more per level. Both land on everything within radius 5.",
      "Halving a monster's defence is worth more to a Barbarian than any attack-rating gear, because attack rating is checked against defence rather than against a threshold.",
      "It lasts 12 seconds at one point and 2.4 more per level.",
      "It gives War Cry +6% damage per hard point, alongside Howl and Taunt.",
      "5 mana, and the defence cut is the half that matters — the damage cut is a bonus.",
    ],
    confidence: "verified",
  },
  {
    slug: "battle-orders",
    name: "Battle Orders",
    classSlug: "barbarian",
    tree: "warcries",
    kind: "buff",
    requiredLevel: 24,
    prerequisites: ["shout"],
    summary:
      "Raises maximum life, mana and stamina for the whole party. The single most valuable buff in the game.",
    synergies: [
      { skill: "shout", bonus: "+5 seconds of duration per level" },
      { skill: "battle-command", bonus: "+5 seconds of duration per level" },
    ],
    mechanics: [
      "**+35% maximum life at one point and 3% more per level**, and the identical figure applies to mana and to stamina. At twenty hard points that is +92% life on everyone within radius 19.",
      "It is why every class eventually carries a Call to Arms: the runeword grants this skill, and a Sorceress with it has half again the life she was built with.",
      "**Cast it before the other buffs, always.** It raises maximum life by a percentage, and the life you have when it lands is not scaled up with the maximum — so a Barbarian shouts, then heals, then fights.",
      "30 seconds at one point and 10 more per level, extended a further 5 seconds per hard point of Shout and of Battle Command.",
      "It gives Concentrate and Berserk +10% damage each per hard point, which makes it a damage skill on two builds that press neither shout for the life.",
      "7 mana.",
    ],
    confidence: "verified",
  },
  {
    slug: "grim-ward",
    name: "Grim Ward",
    classSlug: "barbarian",
    tree: "warcries",
    kind: "spell",
    requiredLevel: 24,
    prerequisites: ["find-item"],
    summary:
      "Plants a totem in a corpse that terrifies, slows and softens everything near it. Far stronger than its reputation.",
    mechanics: [
      "**It makes enemies take more damage** — +20% at one point and 5% more per hard point of *Find Potion*, so a maxed Find Potion doubles the damage everything in the field takes.",
      "It also slows what it frightens, 0% to 75% on a diminishing curve, applied to movement, attack speed and animation rate at once.",
      "The ward stands for 40 seconds and that number does not move with a point; the radius is 6 and grows by 1 per level.",
      "**The Find Potion relationship is not a synergy** and the page draws no edge for it: the game labels that parameter as a per-level damage-taken figure rather than a synergy, so the graph correctly carries nothing. The number is real anyway.",
      "It needs a corpse and costs 4 mana.",
    ],
    confidence: "verified",
  },
  {
    slug: "war-cry",
    name: "War Cry",
    classSlug: "barbarian",
    tree: "warcries",
    kind: "spell",
    element: "physical",
    requiredLevel: 30,
    prerequisites: ["battle-cry", "battle-orders"],
    summary:
      "Damages and stuns everything around you. The only skill on the class that kills without a weapon.",
    synergies: [
      { skill: "howl", bonus: "+6% damage per level" },
      { skill: "taunt", bonus: "+6% damage per level" },
      { skill: "battle-cry", bonus: "+6% damage per level" },
    ],
    mechanics: [
      "**It carries no weapon damage at all.** The published range is the whole of it — 30-40 at one point, 198-208 at twenty — which makes it the one Barbarian skill whose damage does not care what is in your hands.",
      "It stuns for 25 frames at one point and 5 more per level, inside radius 7, which is what makes the Singer safe rather than what makes it kill.",
      "Howl, Taunt and Battle Cry each add 6% per hard point, so the build's damage is spread across three skills nobody would otherwise max.",
      "**It costs 10 mana, not 40.** The row is shifted by 6, and the cost climbs to about 24 at level 20.",
      "Its damage is physical, so the Singer meets exactly the wall every other Barbarian meets.",
    ],
    confidence: "verified",
  },
  {
    slug: "battle-command",
    name: "Battle Command",
    classSlug: "barbarian",
    tree: "warcries",
    kind: "buff",
    requiredLevel: 30,
    prerequisites: ["battle-orders"],
    summary:
      "Grants +1 to all skills to you and your party. One point, and never more than one for the bonus.",
    synergies: [
      { skill: "shout", bonus: "+5 seconds of duration per level" },
      { skill: "battle-orders", bonus: "+5 seconds of duration per level" },
    ],
    mechanics: [
      "**The +1 does not scale.** The row reads it straight off a parameter that is 1 at every level, so the twentieth hard point grants exactly what the first did.",
      "Points here buy duration and nothing else — 30 seconds at one point, 10 more per level, plus 5 seconds per hard point of Shout and of Battle Orders.",
      "**Cast it before Battle Orders.** The extra skill level raises Battle Orders' own level, so the life buff that follows is larger; done the other way round it is not.",
      "11 mana, radius 19, and it reaches the whole party.",
    ],
    confidence: "verified",
  },

  // -- Combat Masteries ----------------------------------------------------
  {
    slug: "blade-mastery",
    name: "Blade Mastery",
    classSlug: "barbarian",
    tree: "combat-masteries",
    kind: "passive",
    requiredLevel: 1,
    summary:
      "Raises damage, attack rating and critical chance with swords and daggers. The mastery most builds end up on.",
    mechanics: [
      "**It is not only swords.** The row is gated on the item type the game calls \"Swords and Knives\", so daggers count and so, by the same chain, do throwing knives.",
      "+28% damage and 5% more per level; +40% attack rating and 8% more per level; critical strike climbing from 0% toward 35%.",
      "Critical strike doubles physical damage, and 35% is ten points above what the Assassin's Claw Mastery reaches.",
      "It applies to whatever is in your hands at the time, so a Barbarian who swaps weapon families has bought nothing.",
    ],
    confidence: "verified",
  },
  {
    slug: "axe-mastery",
    name: "Axe Mastery",
    classSlug: "barbarian",
    tree: "combat-masteries",
    kind: "passive",
    requiredLevel: 1,
    summary: "The same passive, for axes — and it reaches throwing axes as well.",
    mechanics: [
      "+28% damage and 5% more per level; +40% attack rating and 8% more per level; critical strike climbing from 0% toward 35%.",
      "The item-type chain reaches throwing axes, which is worth knowing before a throwing build picks its mastery: the two masteries grant different stats, and only Throwing Mastery grants the ones written for a thrown swing.",
      "Axes carry the largest one-handed damage in the game, which is what this mastery is usually taken for.",
    ],
    confidence: "verified",
  },
  {
    slug: "mace-mastery",
    name: "Mace Mastery",
    classSlug: "barbarian",
    tree: "combat-masteries",
    kind: "passive",
    requiredLevel: 1,
    summary:
      "The same passive, for maces — and its item type quietly covers scepters, staves and wands.",
    mechanics: [
      "+28% damage and 5% more per level; +40% attack rating and 8% more per level; critical strike climbing from 0% toward 35%.",
      "**The type it is gated on is \"Blunt\", not \"Mace\"**, and the equivalence chain runs through clubs and hammers to scepters, staves and wands. That is a wider net than the name suggests.",
      "Maces and hammers carry the game's Crushing Blow bases, which is what makes this the boss-killing mastery.",
    ],
    confidence: "verified",
  },
  {
    slug: "polearm-mastery",
    name: "Polearm Mastery",
    classSlug: "barbarian",
    tree: "combat-masteries",
    kind: "passive",
    requiredLevel: 6,
    summary: "The same passive, for polearms only. The narrowest of the six.",
    mechanics: [
      "+28% damage and 5% more per level; +44% attack rating and 8% more per level; critical strike climbing from 0% toward 35%.",
      "**Polearms and spears are two different masteries.** The item types are siblings rather than parent and child, so neither mastery covers the other's weapons.",
      "Its attack-rating baseline is 44% rather than the 40% Blade, Axe and Mace start at — the three level-6 masteries all carry the higher figure.",
      "Polearms are two-handed, which rules out this mastery for any build that wants to dual-wield or hold a shield.",
    ],
    confidence: "verified",
  },
  {
    slug: "throwing-mastery",
    name: "Throwing Mastery",
    classSlug: "barbarian",
    tree: "combat-masteries",
    kind: "passive",
    requiredLevel: 6,
    summary:
      "The only mastery that solves a problem instead of raising a number. It is what makes throwing playable.",
    mechanics: [
      "**Two thirds of your throws consume nothing.** The row carries a no-consume chance climbing from 0% toward 66%, and a separate flag that replenishes a thrown weapon on a critical hit. Ammunition stops being the reason the build fails.",
      "It also grants pierce, 0% climbing toward 55% — the throw passes through what it hits and keeps going.",
      "The ordinary mastery numbers are there too: +28% damage and 5% more per level, +44% attack rating and 8% more per level, critical strike toward 35%.",
      "It is the only mastery with more than three passive stats, and the three extra ones are why guides written before this baseline call throwing unplayable past Normal.",
      "Its item type covers throwing axes, throwing knives, javelins and missile potions.",
    ],
    confidence: "verified",
  },
  {
    slug: "spear-mastery",
    name: "Spear Mastery",
    classSlug: "barbarian",
    tree: "combat-masteries",
    kind: "passive",
    requiredLevel: 6,
    summary: "The same passive, for spears — and its item type reaches javelins.",
    mechanics: [
      "+28% damage and 5% more per level; +44% attack rating and 8% more per level; critical strike climbing from 0% toward 35%.",
      "**Javelins are spears as far as this row is concerned**, and they are thrown weapons as far as Throwing Mastery is concerned. Both cover them and the stats each grants are written for different kinds of swing.",
      "Spears are two-handed and long, which trades the shield for reach.",
      "It is the least-taken mastery on the class, because the weapons it covers are the Amazon's.",
    ],
    confidence: "verified",
  },
  {
    slug: "increased-stamina",
    name: "Increased Stamina",
    classSlug: "barbarian",
    tree: "combat-masteries",
    kind: "passive",
    requiredLevel: 12,
    summary:
      "More stamina, and — for one build — more Frenzy. A prerequisite that turns out to matter.",
    mechanics: [
      "+30% stamina and 15% more per level, which stops mattering the moment you can afford a Vitality point or a stamina potion.",
      "**It extends Frenzy by 10 frames per hard point.** Frenzy's own duration is 6 seconds; twenty points here take it past 14, which is the difference between a buff you maintain and one you chase.",
      "That relationship is real and is not drawn as a synergy: Frenzy's row scales it with a bare number rather than a synergy-labelled parameter, so the graph carries no edge.",
      "It is also the only way into Increased Speed.",
    ],
    confidence: "verified",
  },
  {
    slug: "iron-skin",
    name: "Iron Skin",
    classSlug: "barbarian",
    tree: "combat-masteries",
    kind: "passive",
    requiredLevel: 18,
    summary: "A flat defence percentage. Mostly the gate to Natural Resistance.",
    mechanics: [
      "+30% defence and 10% more per level, always on.",
      "Defence is the weakest defensive stat in Hell — monster attack ratings are large enough that halving your chance to be hit takes far more of it than any Barbarian has — so this is rarely maxed for its own sake.",
      "It is the only prerequisite for Natural Resistance, which is the reason most builds put a point here.",
    ],
    confidence: "verified",
  },
  {
    slug: "increased-speed",
    name: "Increased Speed",
    classSlug: "barbarian",
    tree: "combat-masteries",
    kind: "passive",
    requiredLevel: 24,
    prerequisites: ["increased-stamina"],
    summary:
      "Permanent run and walk speed. The class's answer to having no movement skill.",
    mechanics: [
      "Run and walk speed from 7% to 50% on a diminishing curve — the first points are worth several times the last.",
      "**It is always on**, which no other class's movement bonus is: Burst of Speed and Vigor both have to be running.",
      "It stacks with Faster Run/Walk on gear, and a Barbarian with no Enigma is walking everywhere he goes.",
      "One point is a large fraction of the total; the curve makes twenty a poor purchase unless nothing else wants them.",
    ],
    confidence: "verified",
  },
  {
    slug: "natural-resistance",
    name: "Natural Resistance",
    classSlug: "barbarian",
    tree: "combat-masteries",
    kind: "passive",
    requiredLevel: 30,
    prerequisites: ["iron-skin"],
    summary:
      "All four resistances, permanently, without a buff to keep up. The best defensive passive on the class.",
    mechanics: [
      "Fire, cold, lightning and poison resistance together, from 0% climbing toward 80% on a diminishing curve.",
      "**It is added before the cap, not after**, so it is exactly the answer to Hell's −100 penalty, and it is free of the upkeep every other class pays for the same thing.",
      "The curve means the early points are the valuable ones: a handful gets a Barbarian most of the way and the last few are worth a fraction each.",
      "It is the reason a Barbarian can wear damage gear where another melee character wears resistances.",
    ],
    confidence: "verified",
  },

  // -- Combat Skills -------------------------------------------------------
  {
    slug: "bash",
    name: "Bash",
    classSlug: "barbarian",
    tree: "barbarian-combat-skills",
    kind: "attack",
    requiredLevel: 1,
    summary:
      "A knockback swing that hits harder than a normal one. Every Barbarian's first point, and a synergy for three skills.",
    synergies: [
      { skill: "stun", bonus: "+5% damage per level" },
      { skill: "concentrate", bonus: "+5% attack rating per level" },
    ],
    mechanics: [
      "+50% damage and 5% more per level, plus a flat point of damage per level, and it knocks the target backwards.",
      "**It is kept for what it gives, not for what it does.** Bash feeds Double Swing at 10% per hard point, Stun at 8% and Concentrate at 5%, so it stays on a maxed bar it is never pressed on.",
      "Its attack rating is unusual: 15% and 5% per level, *plus* 5% per hard point of Concentrate. **Concentrate is the only attack-rating synergy in the game outside the Necromancer's golems** — five such edges exist in the whole extraction, and the other three all come from Clay Golem.",
      "2 mana, and the knockback is a real defensive tool at level 1.",
    ],
    confidence: "verified",
  },
  {
    slug: "leap",
    name: "Leap",
    classSlug: "barbarian",
    tree: "barbarian-combat-skills",
    kind: "spell",
    requiredLevel: 6,
    summary:
      "Jumps a gap and knocks everything back on landing. Movement, escape, and Leap Attack's only synergy.",
    mechanics: [
      "**It rolls no attack rating and deals no damage.** The row carries neither, which is why it is modelled as a spell rather than an attack — the knockback is the whole effect.",
      "Knockback radius 4 and 1 more per level; the jump itself covers between 8 and 30 units depending on how far you clicked.",
      "It goes over walls and over a pack, which makes it the closest thing the class has to an escape before Enigma.",
      "It gives Leap Attack +10% damage per hard point, its only synergy.",
      "2 mana.",
    ],
    confidence: "verified",
  },
  {
    slug: "double-swing",
    name: "Double Swing",
    classSlug: "barbarian",
    tree: "barbarian-combat-skills",
    kind: "attack",
    requiredLevel: 6,
    prerequisites: ["bash"],
    summary:
      "One press, both weapons. It has no damage of its own — every point of it is Bash's.",
    synergies: [{ skill: "bash", bonus: "+10% damage per level" }],
    mechanics: [
      "**Its damage bonus is entirely Bash's.** The row's damage expression is Bash's level times 10 and nothing else, so a point spent here raises the skill by zero — only Bash raises it.",
      "It swings both weapons in one attack, hitting two targets if two are there and one target twice if not. Two weapons are required for it to do that.",
      "+50% attack speed while it swings, which is why it is the levelling attack of choice for a dual-wield Barbarian.",
      "**It becomes free.** The cost starts at 1 mana and falls with level; from level 9 the arithmetic reaches zero and stays there.",
      "It gives Double Throw and Frenzy +8% damage each per hard point.",
    ],
    confidence: "verified",
  },
  {
    slug: "stun",
    name: "Stun",
    classSlug: "barbarian",
    tree: "barbarian-combat-skills",
    kind: "attack",
    requiredLevel: 12,
    prerequisites: ["bash"],
    summary:
      "A swing that stops what it hits. Crowd control on a class that otherwise has none in melee.",
    synergies: [
      { skill: "bash", bonus: "+8% damage per level" },
      { skill: "concentrate", bonus: "+5% attack rating per level" },
      { skill: "war-cry", bonus: "+5 frames of stun length per level" },
    ],
    mechanics: [
      "The stun lasts 30 frames at one point and grows with level, extended a further 5 frames per hard point of War Cry. The game's own display caps at 10 seconds.",
      "**A stunned monster is not attacking**, which on a character standing inside the pack is worth more than the damage — and the damage here is Bash's rather than its own.",
      "Its attack rating carries the same Concentrate bonus Bash does, 5% per hard point.",
      "It gives Bash +5% damage per hard point and is the only route to Concentrate.",
      "2 mana.",
    ],
    confidence: "verified",
  },
  {
    slug: "double-throw",
    name: "Double Throw",
    classSlug: "barbarian",
    tree: "barbarian-combat-skills",
    kind: "attack",
    requiredLevel: 12,
    prerequisites: ["double-swing"],
    summary:
      "Throws both weapons at once. The class's only ranged attack, and the reason Throwing Mastery exists.",
    synergies: [{ skill: "double-swing", bonus: "+8% damage per level" }],
    mechanics: [
      "+16% damage and 8% more per level — the steepest per-level damage slope in the tree.",
      "**It requires two throwing weapons**, one in each hand, and they need not be the same weapon.",
      "Ammunition is the build's whole problem and Throwing Mastery is its whole answer: two thirds of throws consume nothing and a critical hit replenishes one.",
      "1 mana, and it hits at range, which is the only time a Barbarian is not standing in what he is killing.",
      "It is Frenzy's prerequisite, which is why a Frenzy Barbarian passes through the throwing tree without ever throwing anything.",
    ],
    confidence: "verified",
  },
  {
    slug: "leap-attack",
    name: "Leap Attack",
    classSlug: "barbarian",
    tree: "barbarian-combat-skills",
    kind: "attack",
    element: "physical",
    requiredLevel: 18,
    prerequisites: ["leap"],
    damageModel: "weapon-plus-element",
    summary:
      "Jumps onto a target and lands on it. The largest damage multiplier on the class, and its only gap-closer.",
    synergies: [{ skill: "leap", bonus: "+10% damage per level" }],
    mechanics: [
      "**+200% damage and 30% more per level** — 770% at twenty, the largest weapon multiplier the Barbarian has and roughly six times what Whirlwind's per-hit bonus reaches.",
      "The weapon's full damage lands, and the published physical range lands on top of it: 10-20 at one point, 150-300 at twenty.",
      "It damages everything within radius 7 of where it lands, and its attack rating bonus is +100% and 20% more per level, so it hits things a normal swing would miss.",
      "It travels over walls and over the pack between you and the target, which makes it a gap-closer as well as an attack.",
      "It is slow, and it is one press per landing, which is why it is a mobility skill on most bars and a main attack on few.",
      "10 mana.",
    ],
    confidence: "verified",
  },
  {
    slug: "concentrate",
    name: "Concentrate",
    classSlug: "barbarian",
    tree: "barbarian-combat-skills",
    kind: "attack",
    requiredLevel: 18,
    prerequisites: ["stun"],
    summary:
      "An attack that cannot be interrupted and doubles your defence while it swings. The Hardcore Barbarian's answer.",
    synergies: [
      { skill: "bash", bonus: "+5% damage per level" },
      { skill: "battle-orders", bonus: "+10% damage per level" },
    ],
    mechanics: [
      "**It cannot be interrupted.** The game's own text says so, and the extraction agrees — `interrupt` is blank on eleven player skills in the whole game and this is one of them. Being hit does not stop the swing.",
      "+100% defence and 10% more per level *while it is attacking*, which is the opposite of what Berserk does and is why the two ends of this chain suit opposite players.",
      "+70% damage and 5% more per level, plus 5% per hard point of Bash and **10% per hard point of Battle Orders** — its largest synergy sits in another tree.",
      "**Berserk turns part of it magic.** Each hard point in Berserk converts 1% of Concentrate's damage to magic, which is the only way this build touches a physical immune. Berserk gives no synergy edge for it; the row reads Berserk's level directly.",
      "2 mana.",
    ],
    confidence: "verified",
  },
  {
    slug: "frenzy",
    name: "Frenzy",
    classSlug: "barbarian",
    tree: "barbarian-combat-skills",
    kind: "attack",
    requiredLevel: 24,
    prerequisites: ["double-throw"],
    summary:
      "Every hit makes the next one faster. The fastest attack in the game, and it needs two weapons to run.",
    synergies: [
      { skill: "double-swing", bonus: "+8% damage per level" },
      { skill: "taunt", bonus: "+8% damage per level" },
    ],
    mechanics: [
      "**It builds on itself.** Landing hits stacks run and walk speed from 20% toward 200% and attack speed from 0% toward 50%, and the stack falls off if you stop hitting things.",
      "The buff lasts 6 seconds, **extended by 10 frames per hard point of Increased Stamina** — twenty points there take it past 14 seconds, which is the difference between maintaining the stack and chasing it. That is not a synergy and the page draws no edge for it; the row scales it with a bare number.",
      "+90% damage and 5% more per level, plus 8% per hard point of Double Swing and 8% per hard point of **Taunt**, which is in another tree.",
      "It requires two weapons — the game's own description says so — and it swings both.",
      "It cannot be interrupted, and its run speed makes it the fastest way a Barbarian crosses a map without Enigma.",
      "Berserk converts 1% of its damage to magic per hard point, the same as it does for Concentrate.",
      "1.5 mana.",
    ],
    confidence: "verified",
  },
  {
    slug: "whirlwind",
    name: "Whirlwind",
    classSlug: "barbarian",
    tree: "barbarian-combat-skills",
    kind: "attack",
    requiredLevel: 30,
    prerequisites: ["leap-attack", "concentrate"],
    summary:
      "Spins through a pack hitting everything on the way. The signature skill of the class, and the only one that feeds nothing.",
    mechanics: [
      "**It has no synergies in either direction.** Nothing raises it and it raises nothing — the only attack on the class with both lists empty, where the other eleven skills in that position are passives and Grim Ward. It is why a Whirlwind build's spare forty points go to a mastery and the shouts.",
      "+30% damage and 5% more per level, which is a small multiplier; the skill's damage comes from the number of hits and from the weapon, not from the bonus.",
      "**It has a weapon-selection mode of its own**, shared with no other skill in the game. Double Swing, Double Throw and Frenzy share a different one, and the difference is real even though the extraction does not name what either mode does.",
      "It cannot be interrupted, and you are not steerable once it starts — the path is fixed when you press it.",
      "**It costs 12.5 mana, not 25.** The row is shifted by 7, and the cost climbs to 22 by level 20.",
      "Its attack rating bonus is +50% and 5% more per level, the smallest of any Barbarian attack, which is why attack rating is the build's real constraint.",
    ],
    confidence: "verified",
  },
  {
    slug: "berserk",
    name: "Berserk",
    classSlug: "barbarian",
    tree: "barbarian-combat-skills",
    kind: "attack",
    element: "magic",
    requiredLevel: 30,
    prerequisites: ["concentrate"],
    damageModel: "weapon-converted-to-element",
    summary:
      "Converts the whole swing to magic damage and drops your defence to zero. The class's answer to physical immunity.",
    synergies: [
      { skill: "howl", bonus: "+10% damage per level" },
      { skill: "battle-orders", bonus: "+10% damage per level" },
    ],
    mechanics: [
      "**All of the damage becomes magic, not part of it.** The row converts 100%, which means the weapon's physical damage is carried and delivered as magic — so a physical immune takes it in full and only a magic-resistant monster resists it.",
      "+150% damage and 15% more per level, plus 10% per hard point of **Howl** and 10% per hard point of **Battle Orders**. Both synergies are in the Warcries tree, so a Berserker maxes two shouts he never presses.",
      "**Your defence becomes zero** while the state is up, and the state's length *shrinks* as the skill levels — roughly 2.7 seconds at one point falling toward 1.3 at twenty. More points mean less time spent defenceless.",
      "Its attack rating bonus is +100% and 15% more per level, the largest on the class after Leap Attack.",
      "**It grants no damage reduction.** The row has a damage-resist stat and the parameter feeding it is zero at every level, so any guide crediting Berserk with damage reduction is describing a different version.",
      "4 mana, and one point of it on any Barbarian bar is the cheapest immunity answer in the game.",
    ],
    confidence: "verified",
  },
];
