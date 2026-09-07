import type { Build } from "@/lib/types";

/**
 * The Abyss Warlock — the Chaos tree's void half.
 *
 * The argument for this build is one number from this site's own area data:
 * **magic immunity is recorded in one of the twenty catalogued areas**, the
 * Arcane Sanctuary, against thirteen for fire. The Bone Spear Necromancer page
 * makes the same case and it is the strongest case in the game.
 *
 * What is new is the half of that page which the expansion has since falsified.
 * It says there is "no +% Magic Skill Damage on any item" and nothing that
 * lowers magic resistance. Both now exist, and all of it belongs to this class:
 *
 *   Void (Thul Zod Ist)      +10-15% to Magic Skill Damage, and it grants Abyss
 *   Entropy Locket            +5-10% to Magic Skill Damage
 *   Ars Dul'Mephistos         −10-20% to Enemy Magic Resistance
 *   Gheed's Wager             −3-7% to Enemy Magic Resistance
 *   Sling                     −3-5% to Enemy Magic Resistance
 *
 * So the Warlock is the first character in the game with a magic-damage gear
 * plan. What still does not exist is a magic sunder charm, which is why the
 * immunity section below ends where it does.
 *
 * The other extracted fact worth leading on: Enhanced Entropy gives Abyss
 * **+2% damage and 3% more per level** — the steepest line in the passive, and
 * steeper than what it gives the miasma skills it is named for.
 */
export const abyssWarlock: Build = {
  slug: "abyss-warlock",
  name: "Abyss Warlock",
  classSlug: "warlock",
  summary:
    "Magic damage, which one of the twenty catalogued areas resists — and the first build in the game with gear that raises magic damage and lowers magic resistance.",
  damageTypes: ["magic"],
  primarySkill: "abyss",
  playstyle:
    "Miasma Chain is what you hold down: it spawns three bolts at base and up to twelve, each of them magic, at the range of a bow. Abyss is the answer to anything the chain has not killed — a collapse in a radius of 6 that leaves fire burning on the ground behind it. Sigil: Death goes under a pack once and executes anything that drops below a tenth of its life, which on a build whose damage arrives in many small pieces is most of the pack. The rhythm is slower than the fire page's and there is far less to think about: almost nothing resists you, so almost nothing needs a decision.",
  strengths: [
    "Magic is the least resisted damage type in the game — one catalogued area records an immunity to it",
    "The only build on this site with access to +% Magic Skill Damage and −% to Enemy Magic Resistance",
    "Miasma Chain reaches 50 units, the longest range in the class",
    "A closed synergy triangle: every point in the branch raises the other two skills in it",
    "No sunder charm needed and no resistance shopping list, which makes it the cheapest of the four to finish",
  ],
  weaknesses: [
    "No magic sunder charm exists, so the one area that does resist you cannot be opened at any price",
    "Abyss is 20-40 at level 1 against Apocalypse's 80-100 — the damage arrives in pieces rather than in one hit",
    "Eighty of 110 points go into four maxed skills, so the character is not finished until the late eighties",
    "Miasma Chain runs on the attack animation rather than the cast animation, and what that means for a cast-rate breakpoint is not established",
    "No movement skill without an Enigma",
  ],
  difficulty: "beginner",
  budget: "medium",
  ratings: {
    clearSpeed: 4,
    bossing: 3,
    survivability: 3,
    magicFind: 3,
    terrorZones: 5,
    ubers: 2,
    soloSelfFound: 4,
    players8: 4,
  },

  skills: [
    {
      skill: "abyss",
      points: 20,
      role: "main",
      order: 1,
      note: "20-40 magic in a radius of 6, and the mana is charged when it resolves rather than when it starts.",
    },
    {
      skill: "miasma-chain",
      points: 20,
      role: "synergy",
      order: 2,
      note: "+10% Abyss damage per level, and the skill you actually hold down: three bolts rising toward a cap of twelve.",
    },
    {
      skill: "miasma-bolt",
      points: 20,
      role: "synergy",
      order: 3,
      note: "+10% Abyss damage per level. Nobody casts it past the first act, and it is maxed anyway.",
    },
    {
      skill: "enhanced-entropy",
      points: 20,
      role: "utility",
      order: 4,
      note: "A passive rather than a synergy — the graph draws no edge from it, because the game does not label its parameters as one. It gives Abyss +2% damage with 3% more per level, which is the steepest line in the skill, plus miasma damage, range and duration.",
    },
    {
      skill: "sigil-death",
      points: 1,
      role: "utility",
      note: "The best single point in the class. A flat 13% of life for a normal monster and 10% for a champion, unique or superunique, neither of which rises with level.",
    },
    { skill: "sigil-rancor", points: 1, role: "prerequisite" },
    {
      skill: "sigil-lethargy",
      points: 1,
      role: "utility",
      note: "Also a flat effect: −50% movement and −50% attack rate inside it, from one point. Points buy radius and nothing else.",
    },
  ],

  skillPackages: [
    {
      id: "the-last-27",
      name: "The last twenty-seven",
      choose: "one",
      intro:
        "The core is 83 points and closes the void branch entirely. What is left is a choice between covering the one thing that resists you and surviving the things that do not.",
      packages: [
        {
          id: "fire-answer",
          name: "The fire answer",
          when: "You want to run the Arcane Sanctuary, or you would rather never think about immunity again. Ring of Fire needs no prerequisite, unlocks at level 6, and doubles its own missile count at the tenth hard point.",
          tradeoff:
            "Twenty points into a skill with no synergies behind it. Ring of Fire at 20 with nothing feeding it is a modest spell, and this package buys coverage rather than damage.",
          skills: [
            {
              skill: "abyss",
              points: 20,
              role: "main",
              order: 1,
              note: "Unchanged from the core. This branch does not change what you cast — it changes what you are allowed to cast it at.",
            },
            {
              skill: "miasma-chain",
              points: 20,
              role: "synergy",
              order: 2,
              note: "Unchanged, and still the skill you hold down. The Arcane Sanctuary is the one place it stops working, which is exactly what the twenty points below are for.",
            },
            {
              skill: "miasma-bolt",
              points: 20,
              role: "synergy",
              order: 3,
              note: "Unchanged. It is a synergy rather than a spell and both branches spend the same twenty here.",
            },
            {
              skill: "enhanced-entropy",
              points: 20,
              role: "utility",
              order: 4,
              note: "Unchanged — and worth reading twice on this branch, because it does nothing at all for Ring of Fire. The coverage you are buying is coverage no passive of yours raises.",
            },
            {
              skill: "sigil-death",
              points: 1,
              role: "utility",
              note: "One point, and it is the other half of this branch's answer: chip a magic-immune monster to a tenth with fire and the sigil finishes it for free.",
            },
            {
              skill: "sigil-rancor",
              points: 1,
              role: "prerequisite",
              note: "A prerequisite. Its 75% confuse costs nothing extra because the chain below it was already paid for.",
            },
            {
              skill: "sigil-lethargy",
              points: 1,
              role: "utility",
              note: "One point and no more. On a branch that spent its spare twenty on offence, halving a pack's movement and attack rate is the whole of the defence.",
            },
            {
              skill: "ring-of-fire",
              points: 20,
              role: "main",
              order: 5,
              note: "Sixteen missiles below ten hard points and thirty-two at ten and above. That single threshold is most of the skill.",
            },
          ],
          rotationNote:
            "Nothing changes until something resists you. Ring of Fire is a second key, not a second rotation.",
          contentNote:
            "The Arcane Sanctuary is the only catalogued area that records magic immunity. This package is what makes it farmable.",
          remainderNote:
            "The core is 83 of 110 and this package adds twenty, so the finished plan spends 103 and leaves seven. Every synergy is already maxed and both remaining sigils step at ten and twenty hard points, which seven does not reach from one — so they go into Sigil: Death and the ring widens three levels later.",
        },
        {
          id: "the-ward",
          name: "The ward",
          when: "You are playing Hardcore, or in eight-player games where things reach you. Psychic Ward absorbs 15 damage plus 10 per level and stuns whatever hits you in melee while it holds.",
          tradeoff:
            "The Arcane Sanctuary stays closed and nothing else does. That is a smaller cost than it sounds — one area of twenty — but it is the only area where this build has no answer at all.",
          skills: [
            {
              skill: "abyss",
              points: 20,
              role: "main",
              order: 1,
              note: "Unchanged from the core. The ward adds no damage — it buys the seconds in which this gets cast.",
            },
            {
              skill: "miasma-chain",
              points: 20,
              role: "synergy",
              order: 2,
              note: "Unchanged, and it is the reason the ward is worth twenty-two points: this is a held rhythm, and a stun on whatever reached you is what protects the rhythm.",
            },
            {
              skill: "miasma-bolt",
              points: 20,
              role: "synergy",
              order: 3,
              note: "Unchanged. It is a synergy rather than a spell and both branches spend the same twenty here.",
            },
            {
              skill: "enhanced-entropy",
              points: 20,
              role: "utility",
              order: 4,
              note: "Unchanged. Its Abyss line is the steepest in the passive, which is what lets this branch spend twenty-two points on defence without touching the damage.",
            },
            {
              skill: "sigil-death",
              points: 1,
              role: "utility",
              note: "One point, and on this branch it stays there. The Arcane Sanctuary is the zone you have decided not to solve.",
            },
            {
              skill: "sigil-rancor",
              points: 1,
              role: "prerequisite",
              note: "A prerequisite, and it pairs with the ward rather than duplicating it: a confused monster is one that is not spending your absorb pool.",
            },
            {
              skill: "sigil-lethargy",
              points: 1,
              role: "utility",
              note: "One point. Halving a pack's attack rate and absorbing what still lands are the same plan approached from two directions.",
            },
            {
              skill: "levitation-mastery",
              points: 1,
              role: "prerequisite",
              note: "Bought for the ward rather than for the mastery. Its damage and attack rating are dead on a caster; the 15 absorb per hard point is not.",
            },
            {
              skill: "cleave",
              points: 1,
              role: "prerequisite",
              note: "The same trade, and it is Psychic Ward's prerequisite as well — one point that unlocks the skill and raises it in the same breath.",
            },
            {
              skill: "psychic-ward",
              points: 20,
              role: "utility",
              order: 5,
              note: "The pool is 15 plus 10 per level, and 15 more for each hard point of Levitation Mastery and Cleave — so the two prerequisite points are worth 30 absorb on top of unlocking it.",
            },
          ],
          gearNote:
            "Levitation Mastery pays only while exactly one weapon is equipped, which a Warlock always has. Its damage and attack rating are dead here; the one point is bought for the ward and the prerequisite.",
          rotationNote: "Re-cast the ward before a pack rather than during one. It stuns melee attackers while it holds, which buys the recast.",
          remainderNote: "The core is 83 of 110 and this package adds twenty-two, so the finished plan spends 105 and leaves five. Sigil: Lethargy takes them toward its ten-point radius step.",
        },
      ],
    },
  ],

  stats: {
    strength: "Enough for the off-hand you have chosen, and no more. See the note.",
    dexterity: "Base.",
    vitality: "Everything else.",
    energy: "None.",
    notes: [
      "**The off-hand sets the Strength number and the range is enormous.** An Occult Tome asks 82 Strength and a Blasphemous Grimoire asks 106, against a class base of 15. This build's best off-hand is the Occult Tome, so 82 is the number — and a Burnt Text at 38 is the answer until then.",
      "Nothing else on the character reads Strength. Void is a dagger and daggers ask almost nothing.",
      "**Levitation Mastery cuts item requirements by 2% per level to a −50% floor.** Whether that reaches armour or only weapons is not established, and the ward package's single point in it is not budgeted as a discount.",
      "Energy stays at base on every Warlock build on this site. Insight on the mercenary is a larger mana pool than any number of points here, and the points are worth more as life.",
    ],
  },

  breakpoints: [
    { stat: "fcr", value: 75, frames: 10, why: "The standard target on the Paladin/Necromancer/Warlock table, and Void alone carries 40% of it.", priority: "required" },
    { stat: "fcr", value: 125, frames: 9, why: "Reachable on this build more easily than on most, because Void is a 40% weapon and Ars Dul'Mephistos is a 20-30% off-hand.", priority: "recommended" },
    { stat: "fhr", value: 56, frames: 7, why: "The usual target. Miasma Chain is interrupted like anything else.", priority: "recommended" },
  ],
  breakpointNotes:
    "One caution the fire page does not need. **Miasma Chain is the one Chaos skill that runs on the attack animation rather than the cast animation** — its row sets `UseAttackRate` and no other skill in the tree does. What that means for a Faster Cast Rate breakpoint on that one skill is not established, and no attack-speed table is published for any class on this site, so nothing is claimed in either direction. The cast-rate targets above are for Abyss, which is an ordinary cast.",

  gearSets: [
    {
      tier: "starter",
      goal: "Miasma Bolt from level 1 and Miasma Chain from 12. Nothing else matters yet.",
      levelRange: [1, 30],
      slots: [
        { slot: "weapon", picks: [{ label: "Any wand, staff or dagger with +to Warlock skills", why: "A two-handed staff is free on this class — the Warlock levitates it and the off-hand stays open. Take the biggest +skills stick you find." , lookFor: ["+1-3 to Warlock Skills", "Faster Cast Rate"] }] },
        { slot: "offhand", picks: [{ label: "Any Grimoire with +to Warlock skills", why: "Normal-tier Grimoires ask 12 to 25 Strength, so any of them is free.", lookFor: ["+2 to Warlock Skills", "+2 to Chaos Skills"] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Two Countess runes for cast rate, hit recovery and run speed." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills for two runes." }] },
        { slot: "boots", picks: [{ label: "Any boots with Faster Run/Walk", why: "There is no movement skill on this build until an Enigma." }] },
      ],
      nextUpgrade: "Spirit, the moment four Countess runes line up.",
    },
    {
      tier: "nightmare",
      goal: "75% Faster Cast Rate and resistances that hold through the Nightmare penalty.",
      levelRange: [30, 50],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 to All Skills and 25-35% Faster Cast Rate in a four-socket sword. Held until Void.", sockets: "Tal Thul Ort Amn." }] },
        { slot: "offhand", picks: [{ label: "Any Grimoire with +2 Warlock skills and a Chaos tab", why: "The Chaos tab is index 23. Two levels of Abyss before you can cast it.", lookFor: ["+2 to Warlock Skills", "+2 to Chaos Skills"], alternatives: [{ ref: { kind: "runeword", slug: "rhyme" }, why: "Two runes, all resistances, cannot be frozen — and two runes is the only count a Grimoire's sockets allow." }] }] },
        { slot: "body", picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 skills, 30% Faster Cast Rate, 20-35% all resistance." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 to All Skills and magic find." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana while the belt slot is a placeholder." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "Life and stamina for a build that walks." }] },
        { slot: "amulet", picks: [{ label: "Any amulet with +2 Warlock skills", why: "Two levels of everything, gambled for rather than farmed." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Magic find in a slot that has nothing better in it yet." }] },
      ],
      nextUpgrade: "Coven in a three-socket circlet.",
    },
    {
      tier: "early-hell",
      goal: "Abyss cast, resistances back at maximum, and the first item that raises magic damage.",
      levelRange: [50, 70],
      slots: [
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "coven" }, why: "+1 to All Skills, 20% Faster Cast Rate, and 26-40% magic find once Ist's helm modifier is counted.", sockets: "Ist Ral Io in a three-socket circlet." }] },
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Held until a Zod. Void is a level 69 runeword and a Zod is not an early-Hell rune." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "measured-wrath" }, why: "A Burnt Text at level 52 with +1 to Warlock skills, 25% Faster Cast Rate and +20-30 all resistance. It asks 38 Strength, which is the reason to use it rather than the Occult Tome yet.", alternatives: [{ ref: { kind: "runeword", slug: "vigilance" }, why: "Dol and Gul in a Grimoire — resistances, life, mana and defence, for two runes that drop constantly." }] }] },
        { slot: "body", picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "Unchanged." }] },
        { slot: "amulet", picks: [{ label: "Entropy Locket", why: "**+5-10% to Magic Skill Damage** and 4-19% chance to cast Miasma Chains on striking. The first item in the game that multiplies magic damage, and it is a level 54 amulet.", lookFor: ["+10% to Magic Skill Damage", "+40 Lightning Resist"] }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "frostburn" }, why: "The mana pool, which is the only thing gloves offer this build — nothing in the catalogue carries +Magic Skills." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Nightsmoke, and it stays. **The belt this build actually wants is a level 80 item** — Arachnid Mesh's +1 skills and 20% Faster Cast Rate are two tiers away, and nothing between here and there replaces it. Fifty percent of damage taken to mana and free resistances is what the slot does for thirty levels." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and the Strength that helps pay for the off-hand." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to All Skills and the mana to keep casting." }] },
        { slot: "ring2", picks: [{ label: "Sling", why: "**−3-5% to Enemy Magic Resistance**, 10% Faster Cast Rate, and an oskill Town Portal. A level 50 ring and the cheapest magic pierce in the game." }] },
      ],
      nextUpgrade: "A Zod rune, and then Void.",
    },
    {
      tier: "budget",
      goal: "Everything except Void, and every area but one open.",
      levelRange: [70, 85],
      slots: [
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 to All Skills, life and mana per level and 10% damage reduction." }, { ref: { kind: "runeword", slug: "coven" }, why: "Kept instead if the 125% cast-rate breakpoint is closer with it." }] },
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Still +2 skills and 35% cast rate. Void replaces it and nothing else does." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "ars-dul-mephistos" }, why: "An Occult Tome at level 78: **+2 to Warlock skills, 20-30% Faster Cast Rate and −10-20% to Enemy Magic Resistance**. The largest magic pierce on any item in the game, in the slot only this class has.", lookFor: ["+2 Warlock Skills", "−20% to Enemy Magic Resistance", "30% Faster Cast Rate"] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "authority" }, why: "Hel Shael Ral: +2 to Warlock skills and a chance to cast Miasma Chains when struck, which on this build is your own damage type coming back at whatever hit you." }] },
        { slot: "amulet", picks: [{ label: "Entropy Locket", why: "Unchanged. Nothing else in the game carries +% Magic Skill Damage in this slot." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "frostburn" }, why: "Unchanged." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "Unchanged." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Unchanged." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ label: "Sling", why: "Unchanged, and now stacking with the off-hand's pierce." }] },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders. A Warlock gets 3 life per point of Vitality, so the percentage lands on a bigger number than it would on a Sorceress." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The other half." },
      ],
      nextUpgrade: "Void, which is the single largest upgrade on the character.",
    },
    {
      tier: "optimized",
      goal: "Void in hand, the full magic-pierce stack, and 125% Faster Cast Rate.",
      levelRange: [85, 99],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "void" }, why: "Thul Zod Ist in a three-socket dagger: **+2 to All Skills, 40% Faster Cast Rate, +10-15% to Magic Skill Damage, +8-12 to all attributes**, and it grants Abyss 1-3 on top of the twenty you already have. The expansion built this runeword for this build.", sockets: "Thul Zod Ist. The Zod is the whole cost and there is no substitute." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "ars-dul-mephistos" }, why: "Unchanged, and now the second half of a pierce stack rather than the only half.", lookFor: ["−20% to Enemy Magic Resistance"] }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "Unchanged." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, which this build has no other route to." }, { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "If a Jah is out of reach — +2 skills and +65 all resistances." }] },
        { slot: "amulet", picks: [{ label: "Entropy Locket", why: "Unchanged." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "frostburn" }, why: "Unchanged." }] },
        { slot: "belt", picks: [{ label: "Gheed's Wager", why: "A Troll Belt at level 71: **−3-7% to Enemy Magic Resistance**, 10-20% Faster Cast Rate, 10-20% Faster Run/Walk and 44-75% gold find. The third piece of the pierce stack.", alternatives: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills against the pierce. The skill level is usually worth more until the pierce stack is complete." }] }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Unchanged." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ label: "Sling", why: "Unchanged." }] },
      ],
      charms: [{ label: "Grand charms with +1 to Chaos Skills", why: "The Chaos tab is index 23. Nine charms is nine levels across Abyss and both miasma skills at once." }],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Unchanged." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Unchanged." },
      ],
      nextUpgrade: "Better rolls, and a decision about whether Arachnid Mesh's skill beats Gheed's Wager's pierce.",
    },
    {
      tier: "bis",
      goal: "Up to 32 points of enemy magic resistance removed, and 25% more magic damage than the skills alone give.",
      levelRange: [90, 99],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "void" }, why: "At +15% Magic Skill Damage." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "ars-dul-mephistos" }, why: "At −20% to Enemy Magic Resistance." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "Socketed with a Rainbow Facet — there is no magic facet, so take a defensive jewel or a perfect gem." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Unchanged." }] },
        { slot: "amulet", picks: [{ label: "Entropy Locket", why: "At +10% Magic Skill Damage." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "frostburn" }, why: "Unchanged." }] },
        { slot: "belt", picks: [{ label: "Gheed's Wager", why: "At −7% to Enemy Magic Resistance." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Unchanged." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ label: "Sling", why: "At −5% to Enemy Magic Resistance." }] },
      ],
      charms: [{ label: "Nine grand charms with +1 to Chaos Skills and life", why: "Unchanged." }],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Unchanged." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Unchanged." },
      ],
      notes:
        "Three items and up to 32 points of enemy magic resistance removed, plus 25% more magic damage between Void and the Locket. No other character in the game can assemble either stack, because until the expansion neither existed.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Act 2, Nightmare, Holy Freeze. Insight in the polearm is the mana plan — Abyss costs 23 mana at base plus 1 per level and charges it when it resolves rather than when it starts, so an interrupted cast costs nothing. Might is the alternative if the mercenary is expected to kill the one thing you cannot.",

  farming: [
    { area: "mausoleum", difficulty: "hell", why: "Area level 85 with poison and cold immunity recorded, neither of which is magic. A short walk from the Cold Plains waypoint and one of the few places a fresh Hell character can farm safely.", minTier: "early-hell", rating: 5 },
    { area: "chaos-sanctuary", difficulty: "hell", why: "Fire, lightning and physical immunity are all recorded here and none of them is magic. The densest zone in the game, run by a build that needs no charm to be there.", minTier: "early-hell", rating: 5 },
    { area: "travincal", difficulty: "hell", why: "Fire and lightning immunity recorded, the Council in a heap, and high rune drops. Nothing here resists magic.", minTier: "early-hell", rating: 5 },
    { area: "worldstone-keep", difficulty: "hell", why: "Physical, fire, lightning and cold immunity are all recorded — four of the five elements, and not the one this build deals. The clearest case on the site for building on magic.", minTier: "budget", rating: 5 },
    { area: "pit", difficulty: "hell", why: "Area level 85 with physical, cold and lightning immunity recorded. Magic passes through all of it.", minTier: "early-hell", rating: 4 },
    { area: "lower-kurast", difficulty: "hell", why: "Fire and poison immunity recorded, and the chests do not care what element you deal. A short run for runes.", minTier: "nightmare", rating: 3 },
  ],

  immunityPlan:
    "**One area in twenty resists this build, and that is the whole plan.** The Arcane Sanctuary records lightning and magic immunity; the other nineteen catalogued areas record neither. Thirteen of them record fire, ten poison, eight lightning and eight physical. Building on magic is the single largest immunity decision available in this game and it is why this page exists next to the fire one.\n\n**The gear now helps, which it did not before this expansion.** Ars Dul'Mephistos removes 10-20% of enemy magic resistance, Gheed's Wager another 3-7% and Sling another 3-5% — up to 32 points between them — and Void and the Entropy Locket add up to 25% Magic Skill Damage on top. No other character in the game can assemble either stack.\n\n**None of that breaks an immunity.** A −% to Enemy Magic Resistance line is skipped entirely while an immunity stands rather than being reduced to a fraction of itself; it is what makes a resistant monster soft, not what makes an immune one killable. And there is **no magic sunder charm** — the five that exist cover fire, cold, lightning, poison and physical, and magic is the one element with no equivalent.\n\nSo against a genuinely magic-immune monster the options are the fire package, the mercenary, or walking past. In the Arcane Sanctuary specifically, walking past is usually right: the zone is not area level 85 and there is nothing in it worth the argument.",

  hardcoreNotes:
    "The best of the four Warlock builds for Hardcore and it is not close. The damage type is the one nothing resists, the range is the longest in the class, and Sigil: Lethargy halves the movement and attack speed of everything standing in it from a single hard point. Take the ward package: 15 absorb plus 10 per level, and melee attackers are stunned while it holds. The one thing to respect is that Abyss charges its mana when it resolves, so a cast interrupted at the wrong moment leaves you with neither the spell nor the escape.",

  selfFoundNotes:
    "The cheapest of the four to bring to Hell. Spirit is four Countess runes, Coven needs one Ist, and Vigilance is Dol and Gul — none of that is a trade. What you cannot find is Void, which needs a Zod; until then Spirit is only 15% cast rate behind it and none of the magic-damage gear is required for the build to function. Entropy Locket at level 54 and Sling at level 50 are both realistic self-found drops and both are more valuable here than on any other character.",

  levelingPath: {
    summary:
      "Miasma Bolt is on the bar from level 1 and Miasma Chain replaces it at 12. Abyss arrives at 30 and nothing before it is wasted — every point spent on the way up is a synergy the finished build wants maxed. This is the only Warlock build with no awkward stretch in it.",
  },

  release: "reign-of-the-warlock",
  confidence: "single",
  complete: true,
};
