import type { CharacterClass } from "@/lib/types";

/**
 * The eight playable classes as of Patch 3.3 / Season 15.
 *
 * The Warlock is new — added by the paid *Reign of the Warlock* expansion in
 * February 2026, the first new Diablo II class in 25 years. Any guide written
 * from pre-2026 knowledge will list seven. See `docs/research/00-game-state.md`.
 *
 * Attribute values are per *point* and per *level* in player-facing units.
 * Several databases publish these in quarter-units (where 8 means 2 life per
 * point); the conversion is documented in `docs/research/03-attributes.md`.
 */
export const classes: CharacterClass[] = [
  {
    slug: "sorceress",
    name: "Sorceress",
    summary:
      "The elemental caster. Native Teleport makes her the fastest farmer in the game and the standard first character.",
    overview:
      "The Sorceress is built around three elemental skill trees and, uniquely, a movement skill she gets for free. Teleport at level 18 changes what the character is: she does not walk through a dungeon, she jumps to the part of it that has loot. That single skill is why she is the most recommended starting character in every ladder season, and why she remains a top magic-find farmer at the highest gear levels. In exchange she is the most fragile class in the game, with the lowest life per point of Vitality of any character, and she lives entirely on not being hit.",
    release: "classic",
    strengths: [
      "Native Teleport — no Enigma required, from level 18 onward",
      "Highest single-target and area burst of any early character",
      "Cheapest endgame of any class; a Spirit sword and Stealth are enough to farm Hell",
      "The best magic-find farmer in the game",
      "Three independent damage trees, so a respec can completely change her role",
    ],
    weaknesses: [
      "Lowest life pool in the game (2 life per Vitality point)",
      "Elemental immunities in Hell hard-stop a single-element build",
      "No physical damage of her own — cold immunes need an answer",
      "Very punishing to play badly; one bad Teleport can end a Hardcore character",
    ],
    coreMechanics: [
      {
        title: "Masteries do not break immunity",
        body: "Cold, Fire and Lightning Mastery each lower enemy resistance to their element, but against a monster that is *immune* (100%+ resistance) they operate at one fifth effectiveness and cannot break the immunity by themselves. This is the single most important thing to understand before committing to a Sorceress build in Hell.",
      },
      {
        title: "Teleport is the build",
        body: "Teleport costs one skill point and one prerequisite (Telekinesis). Every Sorceress takes it. It is not optional, it is not a luxury, and it is the reason her clear speed beats classes with far more damage.",
      },
      {
        title: "Static Field softens, it does not kill",
        body: "Static Field removes 25% of a monster's **current** life per cast — not maximum life — so its effect falls away quickly with repeated casts. It also has a hard floor: it will not reduce a monster below **33% life in Nightmare** or **50% in Hell**. It is a tool for softening a target so your mercenary can finish it, never a kill condition of its own.",
      },
      {
        title: "Two cast animations",
        body: "Most Sorceress spells use the standard caster animation with breakpoints at 0/9/20/37/63/105/200. Lightning and Chain Lightning use a *different, slower* animation with its own breakpoint table. Planning Faster Cast Rate for a Lightning Sorceress against the standard table is a common and expensive mistake.",
      },
    ],
    attributes: {
      strength: 10,
      dexterity: 25,
      vitality: 10,
      energy: 35,
      hitPoints: 40,
      stamina: 74,
      mana: 35,
      lifePerVitality: 2,
      manaPerEnergy: 2,
      lifePerLevel: 1,
      manaPerLevel: 2,
      staminaPerVitality: 1,
    },
    trees: ["cold-spells", "lightning-spells", "fire-spells"],
    classItems: ["Sorceress Orbs (Eagle Orb, Sacred Globe, Smoked Sphere, Clasped Orb, Jared's Stone)"],
    bestFor:
      "Your first character of a season, and anyone who wants to farm efficiently without a large item budget.",
    beginnerFriendliness: 5,
    confidence: "verified",
  },
  {
    slug: "amazon",
    name: "Amazon",
    summary:
      "Bow and javelin specialist. Home of Lightning Fury, one of the fastest clear-speed skills in the game.",
    overview:
      "The Amazon splits between bows, javelins and spears. The javelin side (Lightning Fury and Charged Strike) produces some of the highest clear speed and single-target damage in the game once geared, while the bow side offers a safer, more forgiving ranged character. Both need substantial gear investment before they come online, which makes her a stronger second character than a first.",
    release: "classic",
    strengths: [
      "Lightning Fury clears packed areas faster than almost anything else",
      "Charged Strike is among the strongest single-target skills in the game",
      "Physical and lightning damage on the same character handles most immunities",
      "Excellent with a shield — real block chance, unlike most casters",
    ],
    weaknesses: [
      "Very gear-dependent; the javelin build is weak until it has -enemy lightning resistance",
      "No movement skill without Enigma",
      "Splits attribute points across Strength, Dexterity and Vitality",
    ],
    coreMechanics: [
      {
        title: "Javelin skills scale off both hard points and gear",
        body: "Lightning Fury and Charged Strike scale steeply with +skills, so Amazon-specific gear (Titan's Revenge, Griffon's Eye, Thunderstroke) is worth far more than raw damage elsewhere.",
      },
    ],
    attributes: {
      strength: 20,
      dexterity: 25,
      vitality: 20,
      energy: 15,
      hitPoints: 50,
      stamina: 84,
      mana: 15,
      lifePerVitality: 3,
      manaPerEnergy: 1.5,
      lifePerLevel: 2,
      manaPerLevel: 1.5,
      staminaPerVitality: 1,
    },
    trees: ["javelin-and-spear", "passive-and-magic", "bow-and-crossbow"],
    classItems: ["Amazon-only bows, javelins and spears"],
    bestFor: "Players who want the highest clear speed and are willing to gear for it.",
    beginnerFriendliness: 2,
    confidence: "verified",
  },
  {
    slug: "assassin",
    name: "Assassin",
    summary:
      "Martial arts and traps. The Trapsin is one of the safest and strongest all-round builds in the game.",
    overview:
      "Added in Lord of Destruction, the Assassin plays either as a trapper — laying Lightning Sentries that kill from off-screen — or as a martial artist charging up and releasing finishing moves. The trap build is exceptionally safe, scales well, handles both Ubers and general farming, and is one of the few builds that is genuinely strong at every gear level.",
    release: "lod",
    strengths: [
      "Traps kill from a safe distance and keep working while you reposition",
      "Excellent Uber Tristram capability",
      "Fade and Burst of Speed are strong self-buffs",
      "Shadow Master is a genuinely useful minion",
    ],
    weaknesses: [
      "Lightning-only damage on the trap build runs into lightning immunes",
      "Martial arts builds are difficult and gear-hungry",
      "No movement skill without Enigma",
    ],
    coreMechanics: [
      {
        title: "Charge-up and finishing moves",
        body: "Martial arts skills build charges that a finishing move consumes. The system is unusual, rewards practice, and is the main reason the melee side of the class is considered advanced.",
      },
    ],
    trees: ["martial-arts", "shadow-disciplines", "traps"],
    classItems: ["Assassin Claws (katars and their upgrades)"],
    bestFor: "Players who want a safe, flexible character that handles endgame bosses well.",
    beginnerFriendliness: 3,
    confidence: "verified",
  },
  {
    slug: "barbarian",
    name: "Barbarian",
    summary:
      "Pure melee, with the largest life pool in the game and the party-defining Battle Orders shout.",
    overview:
      "The Barbarian is the game's melee anchor: the highest life per point of Vitality, weapon mastery passives, and the Warcry tree that every other class eventually borrows through a Call to Arms runeword. He also has Find Item, which lets him re-roll loot from corpses — the basis of the dedicated Travincal gold and item farmer.",
    release: "classic",
    strengths: [
      "Highest life pool in the game (4 life per Vitality point)",
      "Battle Orders is a large life and mana buff for the whole party",
      "Find Item generates extra loot from every corpse",
      "Dual-wield and weapon mastery give real physical damage",
    ],
    weaknesses: [
      "Pure physical damage runs straight into physical immunes",
      "Must be in melee range of everything he kills",
      "No movement skill without Enigma",
    ],
    coreMechanics: [
      {
        title: "Find Item",
        body: "After Find Potion, Find Item lets the Barbarian re-roll a fresh drop from an already-looted corpse. This is the engine behind Travincal running and is unique to the class.",
      },
    ],
    // `barbarian-combat-skills` rather than `combat-skills`: that slug is the
    // Paladin's, and tree slugs resolve globally. Listed unprefixed, this class
    // page rendered the Paladin's Combat Skills card — theme sentence and ten
    // Paladin skills — under the Barbarian's heading.
    trees: ["warcries", "combat-masteries", "barbarian-combat-skills"],
    classItems: ["Barbarian Helms (primal helms and their upgrades)"],
    bestFor: "Players who want to fight in melee and support a party.",
    beginnerFriendliness: 3,
    confidence: "verified",
  },
  {
    slug: "druid",
    name: "Druid",
    summary:
      "Shapeshifting, elemental storms and summons. The most mechanically varied class in the game.",
    overview:
      "The Druid covers three completely different playstyles: a werewolf or werebear melee brawler, an elemental caster throwing Tornadoes and Fissures, and a summoner commanding wolves and a bear. The Wind Druid (Tornado and Hurricane) is the standout, offering physical and cold damage on one character — which handles Hell immunities better than most single-element casters.",
    release: "lod",
    strengths: [
      "Wind Druid deals physical and cold damage, covering most immunities",
      "Oak Sage is a large party-wide life bonus",
      "Shapeshifted forms have their own strong breakpoints and survivability",
      "Cyclone Armor absorbs elemental damage",
    ],
    weaknesses: [
      "Tornado's travel behaviour is erratic and takes practice to aim",
      "Shapeshifting locks out spellcasting",
      "Separate breakpoint tables per form make gear planning fiddly",
    ],
    coreMechanics: [
      {
        title: "Form-specific breakpoints",
        body: "Human, Werewolf and Werebear each use different Faster Cast Rate and Faster Hit Recovery tables. Gear planned for one form is wrong for another.",
      },
    ],
    // `druid-summoning` rather than `summoning`: the Necromancer's Summoning
    // Spells tree is authored and owns that slug, and a tree slug resolves
    // globally. Left unprefixed, this class page would have rendered the
    // Necromancer's tree under the Druid's name. Same rule as the skill slugs —
    // the class that arrives second carries the prefix.
    trees: ["elemental", "shape-shifting", "druid-summoning"],
    classItems: ["Druid Pelts"],
    bestFor: "Players who want variety, or a caster that is not stopped by a single immunity.",
    beginnerFriendliness: 3,
    confidence: "verified",
  },
  {
    slug: "necromancer",
    name: "Necromancer",
    summary:
      "Summons, curses and bone magic. The Summoner is the most forgiving character in the game.",
    overview:
      "The Necromancer fights through an army. A Summoner raises skeletons, a golem and revives, curses everything nearby, and lets the army do the work — which makes him extraordinarily safe and a common Hardcore choice. The Bone side offers magic damage, which almost nothing in the game is immune to, at the cost of much lower raw numbers.",
    release: "classic",
    strengths: [
      "Skeleton army absorbs essentially all incoming damage",
      "Curses (Amplify Damage, Decrepify, Lower Resist) are powerful and help the whole party",
      "Bone Spear and Bone Spirit deal magic damage — almost nothing is immune",
      "Corpse Explosion clears entire screens once the first monster dies",
    ],
    weaknesses: [
      "Summoner damage is low; clears are safe but slow",
      "Minion pathing is frequently frustrating",
      "Needs corpses, so the first kill in a pack is always the slowest",
    ],
    coreMechanics: [
      {
        title: "Corpse Explosion scales off monster life, not skill level",
        body: "Corpse Explosion deals damage based on the exploded corpse's maximum life, so it stays relevant at every difficulty and gear level. Skill points only increase its radius.",
      },
    ],
    trees: ["summoning", "poison-and-bone", "curses"],
    classItems: ["Necromancer Shrunken Heads"],
    bestFor: "Hardcore players, and anyone who wants a very safe first character.",
    beginnerFriendliness: 4,
    confidence: "verified",
  },
  {
    slug: "paladin",
    name: "Paladin",
    summary:
      "Auras and holy damage. The Hammerdin is widely considered the strongest all-round build in the game.",
    overview:
      "The Paladin's defining mechanic is the aura: a permanent party-wide effect chosen from a large list. Blessed Hammer, backed by the Concentration aura, deals magic damage that virtually nothing in the game resists — which is why the Hammerdin has been the reference 'does everything' build for two decades. He also fields the best defensive auras and the highest realistic block chance in the game.",
    release: "classic",
    strengths: [
      "Blessed Hammer deals magic damage that almost nothing is immune to",
      "Auras benefit the entire party permanently",
      "Highest achievable block chance and excellent survivability",
      "Strong at every gear level, from Spirit-and-Stealth to full best-in-slot",
    ],
    weaknesses: [
      "Blessed Hammer's spiral pattern is genuinely hard to aim at first",
      "No movement skill without Enigma — and Enigma is close to mandatory",
      "Hammer damage does not scale with +damage gear, only +skills",
    ],
    coreMechanics: [
      {
        title: "Hammers spiral, they do not fly straight",
        body: "Blessed Hammer travels in an expanding counter-clockwise spiral around the caster. Hitting a target means standing so the spiral passes through it, which is why new Hammerdins report the build feeling weak — they are missing.",
      },
    ],
    attributes: {
      strength: 25,
      dexterity: 20,
      vitality: 25,
      energy: 15,
      hitPoints: 55,
      stamina: 89,
      mana: 15,
      lifePerVitality: 3,
      manaPerEnergy: 1.5,
      lifePerLevel: 2,
      manaPerLevel: 1.5,
      staminaPerVitality: 1,
    },
    trees: ["combat-skills", "offensive-auras", "defensive-auras"],
    classItems: ["Paladin Shields (auric shields, with innate resistances)"],
    bestFor: "Players who want one character that can do absolutely everything.",
    beginnerFriendliness: 4,
    confidence: "verified",
  },
  {
    slug: "warlock",
    name: "Warlock",
    summary:
      "The first new Diablo II class in 25 years. Binds demons, hexes weapons, and is the only class that can wield a two-handed weapon alongside an off-hand.",
    overview:
      "Added by the Reign of the Warlock expansion in February 2026, the Warlock is a dark scholar of forbidden Vizjerei magic. He levitates his weapon rather than holding it, which lets him equip a two-handed weapon in one hand and still use an off-hand Grimoire — a gear rule that applies to no other class and invalidates the usual one-hand-versus-two-hand reasoning. His three trees bind demons as minions, hex weapons with mind magic, or rain hellfire and void damage from range.",
    release: "reign-of-the-warlock",
    requiresDlc: "Reign of the Warlock",
    strengths: [
      "The only class that can wield a two-handed weapon and an off-hand at the same time",
      "Three genuinely distinct playstyles: minions, weapon hexes, ranged elemental",
      "Can bind demons encountered in the world, not just summon fixed minions",
      "Higher life per Vitality point than the Sorceress (3 vs 2)",
    ],
    weaknesses: [
      "Requires a paid expansion — not available to base D2R owners",
      "Far less community knowledge than the 25-year-old classes",
      "Actively being balanced; Bind Demon was nerfed as recently as Patch 3.3",
    ],
    coreMechanics: [
      {
        title: "Levitated weapon",
        body: "The Warlock's class passive levitates the weapon in his right hand. In practice this means a two-handed weapon occupies only the weapon slot, leaving the off-hand free for a Grimoire. No other class can do this.",
      },
      {
        title: "Grimoires",
        body: "The Warlock's off-hand item class. Grimoires roll Warlock staff-mods and a random inherent Fire or Magic weapon damage affix, in the same way a Necromancer Shrunken Head rolls inherent poison damage. Five variants exist per quality tier.",
      },
      {
        title: "Binding versus summoning",
        body: "Where a Necromancer raises skeletons from corpses, a Warlock enslaves living demons — Goatmen, Tainted and Defilers — and can later either bind any demon he meets or consume a bound demon to drain its life force for himself.",
      },
    ],
    attributes: {
      strength: 15,
      dexterity: 20,
      vitality: 25,
      energy: 20,
      hitPoints: 55,
      stamina: 86,
      mana: 20,
      lifePerVitality: 3,
      manaPerEnergy: 2,
      lifePerLevel: 2,
      manaPerLevel: 1.5,
      staminaPerVitality: 1,
    },
    trees: ["demon", "eldritch", "chaos"],
    classItems: [
      "Grimoires (Old Book, Tome, Codex, Compendium, Grimoire — with Exceptional and Elite tiers)",
    ],
    bestFor:
      "Players who own the expansion and want something genuinely new rather than a 25-year-old solved build.",
    beginnerFriendliness: 2,
    confidence: "single",
  },
];
