import type { Build } from "@/lib/types";

/**
 * The Maul Druid — the werebear.
 *
 * Where the Fury wolf is a burst that is full strength on its first swing, the
 * bear is a ramp. Three columns say why, and the third is the one that decides
 * the point plan.
 *
 *   **Maul builds charges: three, plus one for every two hard points.** They
 *   add damage and attack speed, they decay twenty seconds after the last hit,
 *   and the per-charge figures are *not* published on this site — how the state
 *   stacks them is in the engine and in none of the extracted columns. A row
 *   headed "damage dealt" reading 600% would be either a sixth of the truth or
 *   six times it. So this page publishes the charge count and describes the
 *   rest, and the playstyle section is where the ramp actually gets explained.
 *
 *   **The bear cannot be interrupted.** Its row grants a flat 100% chance of
 *   it. A werewolf that gets hit stops swinging; a werebear does not, and that
 *   single column is why the two forms end up at similar damage per second by
 *   completely different routes.
 *
 *   **Maul is Shock Wave's only synergy, at 10% a hard point — and it is the
 *   only synergy between two shape-shifting skills anywhere in the class.**
 *   Fire Claws takes its two from the elemental tree and Rabies takes its one
 *   from the summoning tree. That single edge is the whole argument for maxing
 *   Shock Wave on a build that already maxed Maul: the points are spent twice.
 */
export const maulDruid: Build = {
  slug: "maul-druid",
  name: "Maul Druid",
  classSlug: "druid",
  summary:
    "A werebear that cannot be interrupted, stunning a Hell pack in place with a skill that rolls no attack rating and cannot miss.",
  damageTypes: ["physical"],
  primarySkill: "maul",
  playstyle:
    "You open with Shock Wave, because it stuns a cone of monsters for longer than the fight will last and it cannot miss. Then you walk in and Maul, and the first swing is the weakest one you will make — each hit adds a charge, the charges add damage and attack speed, and by the fourth or fifth swing the bear is hitting at a completely different rate than it started at. Nothing you are fighting can interrupt that, which is the point: you are not dodging, blocking or repositioning, you are standing in the middle of it and out-lasting it. The rhythm is Shock Wave to freeze the room, Maul until it is empty, Shock Wave again when something new walks in.",
  strengths: [
    "Cannot be interrupted — the bear keeps swinging through damage that stops every other melee character",
    "Shock Wave rolls no attack rating and cannot miss, so the crowd control works with no gear behind it",
    "+340% damage and +230% defence from the form alone at twenty points, before a single item",
    "Maxing Maul is also maxing Shock Wave's only synergy — the same points bought twice",
    "The largest effective health pool in the game: +75% from the bear, +115% from Lycanthropy, and defence on top",
  ],
  weaknesses: [
    "Slow, and monsters that flee or shoot are a genuine problem the build has to solve with gear",
    "The first swing of every fight is the weakest one, because the charges have not been built yet",
    "No published attack-speed breakpoints exist for either wereform, so gear cannot be planned to a frame",
    "One damage type, and Shock Wave's is physical too — nothing here answers a physical immune by itself",
    "You cannot cast while shifted, so the spirit and the bear are decisions made before the fight starts",
  ],
  difficulty: "moderate",
  budget: "medium",
  ratings: {
    clearSpeed: 3,
    bossing: 4,
    survivability: 5,
    magicFind: 2,
    terrorZones: 4,
    ubers: 3,
    soloSelfFound: 3,
    players8: 4,
  },

  skills: [
    {
      skill: "maul",
      points: 20,
      role: "main",
      order: 1,
      note: "Thirteen charges at twenty points — three plus one for every two, by integer division, so a level-2 Maul still holds three. The charges add damage and attack speed; the per-charge figures are in the engine and in no extracted column, so this site does not print them.",
    },
    {
      skill: "werebear",
      points: 20,
      role: "main",
      order: 2,
      note: "+340% damage, +230% defence and a flat +75% life at twenty. It has no prerequisite at all, despite sitting behind Werewolf in the tree.",
    },
    {
      skill: "shock-wave",
      points: 20,
      role: "main",
      order: 3,
      note: "The stun runs 40 frames at level 1 and 15 frames longer per level — 1.6 seconds up to about 13, which is longer than most fights. Maul is its only synergy at 10% a point, so this is the second thing the Maul points bought.",
    },
    {
      skill: "lycanthropy",
      points: 20,
      role: "main",
      order: 4,
      note: "+115% life, applied in whichever form you are in, on top of the bear's own +75%. It costs no mana and has no cast.",
    },
    {
      skill: "heart-of-wolverine",
      points: 20,
      role: "utility",
      order: 5,
      note: "+153% enhanced damage and +158% attack rating. Maul rolls attack rating and misses without it; Shock Wave does not roll any and does not care.",
    },
    {
      skill: "werewolf",
      points: 1,
      role: "prerequisite",
      note: "Required for Lycanthropy, and nothing else. You will never use the form.",
    },
    {
      skill: "oak-sage",
      points: 1,
      role: "prerequisite",
      note: "Required for Heart of Wolverine and for the wolves, and the Hardcore alternative to it.",
    },
    { skill: "raven", points: 1, role: "prerequisite", note: "Five birds that blind. Required for the wolves." },
    { skill: "summon-spirit-wolf", points: 1, role: "prerequisite" },
    { skill: "summon-dire-wolf", points: 1, role: "prerequisite", note: "Three wolves that howl — which is useful and occasionally infuriating, because a fleeing monster is a monster your bear has to chase." },
    {
      skill: "summon-grizzly",
      points: 1,
      role: "utility",
      note: "A second bear, and it taunts. On this build it is not the front line — you are — so its job is holding the monsters you have not reached yet.",
    },
  ],
  flexPoints: [
    "Four points are spare at level 99. **Hunger costs three of them** — Feral Rage, Fire Claws, then Hunger — and buys an emergency bite that steals life and mana at 50% climbing toward 200%, in either form. On a build that plans to be surrounded, it is the best three points available.",
    "**Feral Rage is not worth more than the one point Hunger needs.** It is a wolf attack and this character is a bear.",
    "**Oak Sage over Heart of Wolverine** is the Hardcore swap, not an addition: one spirit at a time.",
    "Do not put points in **Fire Claws** unless you intend to build around it. Its two synergies are in the elemental tree and buying them is a different build — see the Fire Claws Druid.",
  ],
  stats: {
    strength: "Enough for a heavy two-handed weapon, and this is the one Druid build where that is a real number.",
    dexterity: "Enough for the weapon. There is no block plan worth funding on a character that cannot be interrupted anyway.",
    vitality: "Everything else.",
    energy: "None. Maul costs three mana and Shock Wave seven.",
    notes: [
      "**Defence is worth buying on this build and on almost no other**, because the form multiplies it: +230% at twenty points turns an ordinary armour into a real one. Every other Druid treats defence as a rounding error.",
      "Life compounds twice — the bear's flat +75% and Lycanthropy's +115% both apply — so Vitality is worth more per point here than anywhere except the Fury wolf.",
      "The bear is slow and does not get the wolf's attack-speed bonus, so Strength for a big two-handed weapon is a legitimate trade rather than a trap. A slow heavy swing on an uninterruptible character is a different proposition than on an interruptible one.",
      "Attack rating gates Maul and not Shock Wave. If you are missing constantly, the fix is Heart of Wolverine, a Fanaticism aura and rings — not more points in Maul.",
    ],
  },
  breakpoints: [],
  breakpointNotes:
    "**Empty, and for the same reason as the other shapeshifting Druids.** Werebear does not use the human-form frame tables — the site publishes a separate werebear cast-rate table and says so — and no wereform hit-recovery or attack-speed table exists at a source tier this project accepts. There is a second reason it matters less here than it would elsewhere: **the bear cannot be interrupted**, so hit recovery, the stat those tables usually govern, is not a thing that happens to it. Attack speed still matters and the gear below chases it, but continuously rather than to a threshold.",

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 12 and Maul, then level 24 and Shock Wave. Nothing here costs more than two Countess runes.",
      levelRange: [1, 40],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "steel" },
              why: "Attack speed, attack rating and open wounds for Tir + El. Before the charges exist the bear swings slowly and hits once, so a bleed that does not care about your damage is the right kind of cheap.",
              sockets: "Tir + El in any 2-socket Mace or Axe.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "lore" },
              why: "+1 to all skills for Ort + Sol, on a Druid pelt so it stacks with the pelt's own roll.",
              sockets: "Ort + Sol in a 2-socket Druid pelt.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "Faster run/walk, and the hit recovery is wasted on a bear — which is worth knowing, because it means this armour is a placeholder here in a way it is not on other builds.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "nagelring" },
              why: "Attack rating from a ring that drops in Act 1. Maul misses a great deal before Heart of Wolverine exists.",
            },
          ],
        },
      ],
      nextUpgrade: "Level 24 and Shock Wave. Until then the bear has no crowd control and it shows.",
      notes:
        "**Werebear has no prerequisite, so it is available at level 6 with no points spent above it.** Take it, put a point in Werewolf and feed Lycanthropy, and start Maul at 12. The one point in Werewolf is the only one this build ever spends on the wolf.",
    },

    {
      tier: "nightmare",
      goal: "Nightmare cleared with Maul and Shock Wave both maxed and the form doing the heavy lifting.",
      levelRange: [40, 65],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "passion" },
              why: "Increased attack speed and a very large attack rating bonus at level 43. Attack speed matters more to a bear than to most melee characters precisely because the form gives it none.",
              sockets: "Dol + Ort + Eld + Lem in any 4-socket weapon.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "crescent-moon" },
                  why: "Open wounds and −35% enemy lightning resistance in a 3-socket axe. The lightning line does nothing for you; the open wounds and the socket count do.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +2 Druid skills and +3 to Shape Shifting skills",
              why: "A +3 Shape Shifting roll raises Werebear, Maul and Shock Wave together — three of the four maxed skills from one affix.",
              lookFor: ["+2 Druid Skills", "+3 to Shape Shifting Skills", "Life", "Defence"],
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "lore" },
                  why: "Until a pelt drops or Charsi imbues one after level 30.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "duress" },
              why: "15% crushing blow, 33% open wounds and a large enhanced-damage roll — and the enhanced damage is multiplied by the form's own +340%.",
              sockets: "Shael + Um + Thul in any 3-socket body armour.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "lionheart" },
                  why: "Six levels earlier and much cheaper: +20 to every attribute, which pays for the two-handed weapon this build wants.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Any gloves with 20% increased attack speed",
              why: "The cheapest attack speed in the game, on the form that has none of its own.",
              lookFor: ["20% Increased Attack Speed", "Life stolen per hit", "Resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Life stolen per hit and physical damage reduced. A bear standing in a pack takes more hits than any other character on this site, on purpose.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "gore-rider" },
              why: "Crushing blow, open wounds and deadly strike. Crushing blow is a share of the target's current life, which is what makes a slow build viable against large monsters.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "raven-frost" },
              why: "Cannot be frozen, and attack rating. A frozen bear is a bear that has stopped, which is the one thing this form is supposed to be immune to.",
            },
          ],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "A rare ring with attack rating and life stolen per hit",
              why: "Attack rating gates Maul. Buy it wherever it is cheap.",
              lookFor: ["+ to attack rating", "Life stolen per hit", "All resistances"],
            },
          ],
        },
      ],
      nextUpgrade:
        "A way to keep monsters within reach. The bear's real weakness is not damage taken, it is monsters that leave.",
      notes:
        "**Shock Wave first, every fight.** It cannot miss and it does not care what your attack rating is, so it works perfectly at this tier while Maul is still missing. Opening with it also means the charges start building against a target that cannot hit back.",
    },

    {
      tier: "early-hell",
      goal: "Hell entered. Resistances capped, one answer to physical immunity, and a mercenary that slows the room.",
      levelRange: [65, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "kingslayer" },
              why: "Crushing blow, open wounds and −25% target defence in a 4-socket sword or axe. It is the last weapon before the two that actually change the build.",
              sockets: "Mal + Um + Gul + Fal. A two-handed base is fine here; the bear cannot be interrupted anyway.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +3 Shape Shifting skills and two sockets",
              why: "Three maxed skills from one roll, and two sockets for the resistances the rest of the build has no room for.",
              lookFor: ["+2 Druid Skills", "+3 to Shape Shifting Skills", "2 sockets"],
              sockets: "Two 15% all-resistance jewels.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "duress" },
              why: "Crushing blow and open wounds, and the cold damage chills — which on this build is a small piece of the answer to monsters walking away.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves with 20% increased attack speed and life stolen per hit",
              why: "A crafted blood glove rolls both and is the standard answer at this tier.",
              lookFor: ["20% Increased Attack Speed", "Life stolen per hit", "All resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduced, and leech." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing blow, open wounds, deadly strike." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen, and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              ref: { kind: "unique", slug: "stone-of-jordan" },
              why: "+1 to all skills — one effective level on four maxed skills.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "atmas-scarab" },
              why: "**Amplify Damage on striking, and this is the build's immunity plan.** It is a curse: cut to one fifth against a physical immune, and it still breaks the immunity where a fifth is enough.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "the-cats-eye" },
                  why: "Attack speed and run speed instead, once a Sunder Charm is carrying the immunity plan. Run speed is not a small thing on a build that has to close the distance.",
                },
              ],
            },
          ],
        },
      ],
      charms: [
        {
          label: "Shape Shifting skillers with life",
          why: "+1 effective level to Werebear, Maul and Shock Wave each. The best inventory affix this build can hold.",
        },
      ],
      nextUpgrade: "Beast, and the +3 to Werebear that comes with the aura.",
    },

    {
      tier: "budget",
      goal: "Hell farmed comfortably, with Fanaticism from your own hand and a bear three levels above its point total.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "beast" },
              why: "**Fanaticism and +3 to Werebear from the same weapon.** The aura is attack speed, attack rating and enhanced damage — the bear's three shortages — and the +3 is three more levels of the form's +15% damage and +10% defence per level. The only other build on this site that takes both halves of the same runeword is the Fire Claws Druid's Werebear variant, which takes them from this same Beast.",
              sockets: "Ber + Tir + Um + Mal + Lum in a 5-socket Axe, Scepter or Hammer.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +3 Shape Shifting skills, +2 Druid skills and two sockets",
              why: "Five effective levels on three maxed skills.",
              tradeOnly: true,
              alternatives: [
                {
                  ref: { kind: "unique", slug: "vampire-gaze" },
                  why: "Life and mana stolen per hit and 15–20% physical damage reduced. The cheap answer for a character with no shield.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "fortitude" },
              why: "+300% enhanced damage and a very large defence bonus — and this is the one Druid build where the defence half is worth as much as the damage half, because the form multiplies it by 230%.",
              sockets: "El + Sol + Dol + Lo in any 4-socket body armour.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted blood gloves with 20% increased attack speed and life stolen per hit",
              why: "Attack speed and leech on one item, repeatable and cheap.",
              lookFor: ["20% Increased Attack Speed", "Life stolen per hit", "+ to life"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduced." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Three per-hit effects." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "highlords-wrath" },
              why: "Deadly strike that scales with character level, and 20% increased attack speed.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "atmas-scarab" },
                  why: "Keep it until Bone Break exists. Amplify Damage is the immunity plan and Highlord's is not.",
                },
              ],
            },
          ],
        },
      ],
      charms: [
        {
          ref: { kind: "unique", slug: "bone-break" },
          why: "Physical Sunder. Maul and Shock Wave are both physical, so this is the only Sunder Charm this build would ever carry — and only one can be held at a time.",
        },
        {
          label: "Shape Shifting skillers with life, and small charms with attack rating",
          why: "Attack rating gates Maul and not Shock Wave, which is why the small charms matter less here than on the Fury wolf.",
        },
      ],
      nextUpgrade: "Doom, and the aura that finally keeps monsters where the bear can reach them.",
    },

    {
      tier: "optimized",
      goal: "Two auras at once: Holy Freeze from your hand, Fanaticism from the mercenary.",
      levelRange: [85, 95],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "doom" },
              why: "**Holy Freeze, and it is the answer to this build's actual problem.** The bear does not die and does not get interrupted; what it does is fail to reach things. An aura that slows every monster in range turns fleeing packs and kiting shooters into targets. Take it only when the mercenary can carry Fanaticism — its −40–60% enemy cold resistance does nothing for a physical build, and that is fine.",
              sockets: "Hel + Ohm + Um + Lo + Cham in a 5-socket Axe, Polearm or Hammer.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "beast" },
                  why: "If the mercenary has no Faith, keep Beast. Fanaticism from somewhere is not optional, and two copies of the same aura do not stack.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A +3 Shape Shifting, +2 Druid skills pelt with two 15% all-resistance jewels",
              why: "Five effective levels and thirty resistances.",
              tradeOnly: true,
              alternatives: [
                {
                  ref: { kind: "unique", slug: "crown-of-ages" },
                  why: "+1 to all skills, 30% damage reduction and two sockets. The Hardcore answer.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "fortitude" },
              why: "+300% enhanced damage and the defence the form multiplies.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "+2 skills and +65 all resistances. Two effective levels on four maxed skills is closer to Fortitude than it looks.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "draculs-grasp" },
              why: "Life Tap on striking. On a build that swings continuously into a stunned pack, it is a larger sustain source than any leech roll.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduced." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing blow, open wounds, deadly strike." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen, and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "highlords-wrath" },
              why: "Deadly strike, attack speed and +1 to all skills.",
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "bone-break" }, why: "Physical Sunder." },
        {
          label: "Anni, Torch and Shape Shifting skillers",
          why: "The Torch's +3 Druid skills is three effective levels on Werebear, Maul and Shock Wave at once.",
        },
      ],
      weaponSwap: [
        {
          ref: { kind: "runeword", slug: "call-to-arms" },
          why: "Battle Orders before shifting. The bear multiplies the result by 75% and Lycanthropy by 115% on top.",
        },
      ],
      nextUpgrade: "Better rolls, and the pelt. There is no structural upgrade left.",
    },

    {
      tier: "bis",
      goal: "Nothing left to buy.",
      levelRange: [90, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "doom" },
              why: "Holy Freeze, with Fanaticism on the mercenary. Two auras is the endgame configuration and the reason the mercenary section on this page is not a formality.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "last-wish" },
                  why: "Might, 60–70% crushing blow and Life Tap on striking. More damage, no slow — a legitimate different answer if you would rather chase what runs than stop it.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A +3 Shape Shifting, +2 Druid skills pelt with two 15% all-resistance jewels",
              why: "The hardest item on the page.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% enhanced damage, and the defence." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduced." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Three per-hit effects." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "A rare amulet with +2 Druid skills, 20% increased attack speed and two resistances",
              why: "Two effective levels and the attack speed the form does not give.",
              tradeOnly: true,
              alternatives: [
                { ref: { kind: "unique", slug: "highlords-wrath" }, why: "Never wrong." },
              ],
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "bone-break" }, why: "Physical Sunder." },
        {
          label: "Anni, Torch and nine Shape Shifting skillers with life",
          why: "The finished shapeshifter inventory.",
        },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders before shifting, every time." },
      ],
      notes:
        "**The endgame question on this build is which two auras you run, not which weapon you hold.** Holy Freeze stops the room and Fanaticism speeds you up; one comes from a weapon and the other from a mercenary bow, and neither stacks with a second copy of itself. Doom plus a Faith rogue is the configuration; Beast plus a Might mercenary is the one you build first.",
    },
  ],

  mercenary: "act-1-rogue-scout",
  mercenaryNotes:
    "**An Act 1 Rogue Scout, and the reason is the cold arrows before it is the runeword.** This build's failure mode is not dying, it is monsters leaving — the dire wolves' howl scatters them, ranged packs kite, and a bear that cannot reach anything does no damage at all. A Cold Arrow rogue slows everything she hits, which keeps the pack in front of the bear. Give her **Faith** when the Ohm and Jah exist: its Fanaticism is attack speed, attack rating and enhanced damage for you, and it is what frees your own hand to carry **Doom** and its Holy Freeze. Before Faith, any bow does — the arrows are the point. **The Act 2 Desert Mercenary with Might is the alternative and it is the right one while you are still holding Beast**, because Beast already supplies Fanaticism and a second copy would be wasted. **Infinity is worthless here**: Conviction lowers fire, cold and lightning resistance, and every point of this build's damage is physical.",

  farming: [
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Level 85, dense, undead and enclosed. A cone stun in a corridor is worth more than it is anywhere open, and nothing here outruns the bear.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "One large target thirty seconds from a portal, and crushing blow is a share of his current life. The bear's charges have time to build because the fight lasts long enough.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are melee, large and not immune to physical, and they come to you — which removes the one problem this build actually has.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Everything walks into melee range and Shock Wave holds a herd in place better than it holds anything else. Physical is the area's only immunity and also this build's only gap, so the charm is not optional here.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Level 85 and the best density in Act 1, but the open ground and the ranged packs are where a slow build feels slow. Bring the Holy Freeze.",
      minTier: "budget",
      rating: 3,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Dense, enclosed and the best experience in the game. Wants capped resistances and a Sunder Charm before it is comfortable.",
      minTier: "optimized",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "The seal bosses stand still and fight, which suits a ramp. The Oblivion Knights do not, and their Iron Maiden is the specific thing that kills a bear.",
      minTier: "optimized",
      rating: 3,
    },
  ],

  immunityPlan:
    "**Both of this build's damage sources are physical — Maul's is the weapon's and Shock Wave's is its own — so physical immunity is the only question, and Shock Wave being unable to miss does not help with it.** The two answers are the same pair every physical build has, and they are not interchangeable. **Amplify Damage** from Atma's Scarab is a curse: against a target that is still immune it is cut to one fifth, and at a fifth it still breaks the immunity wherever a fifth is enough. **Bone Break**, the physical Sunder Charm, breaks it outright, and only one Sunder Charm can be carried at a time. A −% to Enemy Resistance line does neither: item pierce is applied after the immunity check and that step is skipped while the immunity stands, so against a physical immune it is absent rather than weak. Once the curse or the charm has broken it, everything else lands on the result at full value. Note also what Doom does **not** do here — its −40–60% enemy cold resistance is real and this build deals no cold at all.",

  hardcoreNotes:
    "The safest melee character in the game, and the reason is a single column: **the bear's attacks cannot be interrupted**, so the death spiral that kills every other melee build — hit, stagger, hit again, never swing — does not start. Take **Oak Sage** rather than Heart of Wolverine and accept the lower damage; buy defence, which is the one build where the form makes it worth buying; and keep the Grizzly out as a second body. The two things that genuinely kill a Maul bear are **Iron Maiden** from an Oblivion Knight, which returns your own damage to you while you are unable to stop swinging, and mana burn, which takes Shock Wave away at the worst moment. Both are answered by leaving rather than by gear: open a portal before the Chaos Sanctuary, and read the room before the second swing.",

  selfFoundNotes:
    "Reasonable, and better than the Fury wolf, because more of this build's damage comes from the form than from the weapon: +340% at twenty points in Werebear is paid for with skill points rather than runes. Steel, Lore and Stealth carry Normal; Duress and a Charsi-imbued pelt carry Nightmare; Gore Rider and String of Ears both drop readily. The gap is the same one every melee Druid has — Fanaticism has only two homes, Beast and Faith, and neither is realistically self-found. Plan for **Might on an Act 2 mercenary**, or accept that the aura slot stays empty and lean harder on Shock Wave, which needs no attack rating and therefore no gear.",

  levelingPath: {
    summary:
      "Werebear has no prerequisite and unlocks at 6, Maul at 12 and Shock Wave at 24, so the build assembles itself in order with no detour and no wasted point. The single point in Werewolf that Lycanthropy requires is the only one this character ever spends on the wolf.",
    respecAt: "None. The levelling character is the finished character.",
  },

  confidence: "verified",
  complete: true,
};
