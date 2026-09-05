import type { Build } from "@/lib/types";

/**
 * The Fire Claws Druid — a shapeshifter that spends half its points in a tree
 * it never casts from.
 *
 * Four columns, and each one overturns something a reader arrives believing.
 *
 *   **The fire is added, not converted.** Fire Claws is `weapon-plus-element`:
 *   the weapon's full damage lands *and* the skill's own 464–499 at twenty
 *   points lands with it. So this is a two-damage-type melee attack, and the
 *   two halves are not equal — the fire is twenty points with two maxed
 *   synergies behind it, the physical is whatever weapon you happen to hold.
 *
 *   **Its two synergies are 22% a hard point each, and both are in the
 *   elemental tree.** Firestorm and Molten Boulder are maxed and never cast.
 *   That is not a quirk; it is forty of the build's points.
 *
 *   **+skills does not feed a synergy.** Synergies read `blvl`, the hard-point
 *   level, so a +3 Elemental pelt raises Firestorm's own damage — which you
 *   never use — and adds nothing at all to Fire Claws. The helm this build
 *   wants is +3 **Shape Shifting**, and that is the single most common way to
 *   get this build's gear wrong.
 *
 *   **It works in either form**, which is unusual: Fury is wolf-only, Maul and
 *   Shock Wave are bear-only. The form is therefore a variant here rather than
 *   an identity — and because Werebear's +damage is *enhanced damage*, it
 *   multiplies the weapon half only, while Werewolf's attack speed multiplies
 *   both. That is why the wolf is the default below.
 */
export const fireClawsDruid: Build = {
  slug: "fire-claws-druid",
  name: "Fire Claws Druid",
  classSlug: "druid",
  summary:
    "The only melee attack in the class that lands two damage types at once, powered by forty points in an elemental tree it never casts from.",
  damageTypes: ["fire", "physical"],
  primarySkill: "fire-claws",
  playstyle:
    "You buff, shift into the wolf, and hit things. There is one attack and it does two things at once: the weapon's damage lands in full and a large block of fire lands on top of it, so the same swing that kills a fire immune slowly kills a physical immune quickly. The whole build is about swing count — every hit delivers the fire block whether or not your weapon is any good, so attack speed is worth more than damage per hit, and a fast cheap weapon beats a slow expensive one. Against the packs Hell actually hands you, the pattern is unglamorous: walk in, hold the attack, and let the fire do the work your weapon cannot.",
  strengths: [
    "Two damage types from one attack — a fire immune and a physical immune are both handled by the same button",
    "The fire is a flat block per hit, so it does not care whether your weapon is good",
    "Works in either form, which no other Druid attack does",
    "22% per hard point from each of two synergies — the second-largest pair in the class",
    "Its own prerequisites give it Hunger for a single further point, which no other build gets",
  ],
  weaknesses: [
    "Fire is the most commonly resisted element in Hell, and the build's larger half is the fire",
    "The tightest point plan of the seven Druid builds — its prerequisites run through *both* forms",
    "+skills raises the attack but not the synergies, so gear helps this build less than it helps other Druids",
    "No published attack-speed breakpoints exist for either wereform, so gear cannot be planned to a frame",
    "Forty points sit in skills you never cast, which is a real cost in how the character feels to level",
  ],
  difficulty: "advanced",
  budget: "high",
  ratings: {
    clearSpeed: 3,
    bossing: 4,
    survivability: 4,
    magicFind: 2,
    terrorZones: 3,
    ubers: 2,
    soloSelfFound: 2,
    players8: 3,
  },

  skills: [
    {
      skill: "fire-claws",
      points: 20,
      role: "main",
      order: 1,
      note: "464–499 fire at twenty hard points, added to the weapon's full damage rather than converted from it. Both of its synergies are 22% a point — the second-largest pair in the class, behind Firestorm's 23%.",
    },
    {
      skill: "firestorm",
      points: 20,
      role: "synergy",
      order: 2,
      note: "22% per hard point, and never cast after level 6. It is a level-1 skill, so these points are available long before the attack they feed is.",
    },
    {
      skill: "molten-boulder",
      points: 20,
      role: "synergy",
      order: 3,
      note: "The other 22%. Together the pair is +880% at twenty points each, which is most of what this build's fire actually is.",
    },
    {
      skill: "werewolf",
      points: 20,
      role: "main",
      order: 4,
      note: "**Attack speed is the multiplier on both halves of the damage**, because the fire block lands once per hit. Werebear's +damage is enhanced damage and multiplies the weapon half only — which is the argument for the wolf on this build specifically.",
    },
    {
      skill: "lycanthropy",
      points: 20,
      role: "main",
      order: 5,
      note: "+115% life, and the form duration that stops the character being a chore to play.",
    },
    {
      skill: "feral-rage",
      points: 1,
      role: "prerequisite",
      note: "Required for Fire Claws, along with Maul. This build is the only one that has to pay for prerequisites in both forms.",
    },
    {
      skill: "werebear",
      points: 1,
      role: "prerequisite",
      note: "Required for Maul. One point in a form you may never enter — unless you take the bear variant, in which case this is where twenty of them go.",
    },
    { skill: "maul", points: 1, role: "prerequisite", note: "Required for Fire Claws." },
    {
      skill: "hunger",
      points: 1,
      role: "utility",
      note: "**One point, and only on this build.** Fire Claws is its prerequisite and is already maxed, so Hunger costs a single point here where it costs three or four anywhere else. It steals life and mana at 50% climbing toward 200%, at 75% less damage — an emergency button, not a sustain plan.",
    },
    { skill: "oak-sage", points: 1, role: "utility", note: "+30% life to you, the mercenary and the bear." },
    { skill: "raven", points: 1, role: "prerequisite", note: "Required for the wolves." },
    { skill: "summon-spirit-wolf", points: 1, role: "prerequisite" },
    { skill: "summon-dire-wolf", points: 1, role: "prerequisite" },
    {
      skill: "summon-grizzly",
      points: 1,
      role: "utility",
      note: "One bear, and it taunts. On a build whose damage needs time in melee range, the taunt is what buys the time.",
    },
  ],
  flexPoints: [
    "**One point is spare at level 99, and that is not a rounding error — it is the tightest plan of the seven Druid builds.** Fire Claws requires Feral Rage *and* Maul, so its prerequisites run through the wolf's chain and the bear's chain at once, and four points are gone before the build starts.",
    "The spare point goes to **Heart of Wolverine**, which costs nothing extra because Oak Sage is already down. Its attack rating matters more than its enhanced damage here, since enhanced damage does not touch the fire.",
    "**The Werebear variant** is legitimate and it is a different set of twenty points: max Werebear instead of Werewolf, and accept that the form's +340% multiplies your weapon and not your fire. You gain the uninterruptible attack and a great deal of defence, and you lose swing speed — which is the thing the fire scales with.",
    "**The Armageddon variant** — sometimes called the Werewolf Armageddon — is real and it is expensive. Armageddon can be cast in human form and stays running after you shift, and this build has already maxed two of its four synergies. Reaching it costs Fissure, Volcano and twenty points in Armageddon itself, which has to come out of Werewolf or Lycanthropy. It is a hybrid, not a free addition.",
  ],
  stats: {
    strength: "Enough for your gear. Prefer a fast light weapon over a heavy one — the fire does not care what you are holding.",
    dexterity: "Enough for the weapon.",
    vitality: "Everything else.",
    energy: "None. Fire Claws costs four mana.",
    notes: [
      "**This is the one melee Druid where a cheap weapon is a defensible choice**, because roughly half the damage is a flat block the skill supplies. A fast four-socket base you can afford beats a slow elite one you cannot.",
      "Attack rating still gates the attack — Fire Claws rolls it, like every melee skill in the tree except Shock Wave — so the fire does not land on a swing that missed.",
      "Life is bought the same way as on every shapeshifter: Vitality, multiplied by Lycanthropy's +115%.",
      "Resistances matter more than usual because you are in melee range of things that are on fire. Fire resistance in particular is worth over-capping in the areas this build wants to farm.",
    ],
  },
  breakpoints: [],
  breakpointNotes:
    "**Empty, like the other shapeshifting Druids, and it costs this build more than most.** Attack speed is this build's damage multiplier in a very direct way — the fire block lands once per hit, so a swing you did not make is fire you did not deal — and yet no wereform attack-speed table exists at a source tier this project accepts. Blizzard has never published one; patch 2.4 raised the shapeshift attack-speed cap from +75% to +150% and moved the forms onto the human-form calculation, and both of those facts are citable where a frame table is not. So: buy Increased Attack Speed relentlessly, and treat any page that gives you a wereform threshold as quoting a source this one could not verify.",

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 18 and Fire Claws. Until then you are a Firestorm caster, which is fine and is also why the synergy points arrive early.",
      levelRange: [1, 40],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "leaf" },
              why: "+3 to fire skills in a two-rune staff you can buy from Akara. **This is the one Druid build where Leaf is genuinely correct** — you are casting Firestorm to level, and +3 Firestorm at level 19 is a large fraction of your damage.",
              sockets: "Tir + Ral in any 2-socket staff. Buy the base; do not wait for one.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "steel" },
                  why: "Once Fire Claws exists at 18, the staff stops being a weapon and becomes a liability. Steel's attack speed is the replacement.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "lore" },
              why: "+1 to all skills for Ort + Sol. On a Druid pelt it stacks with the pelt's roll.",
              sockets: "Ort + Sol in a 2-socket Druid pelt.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "Cast rate while you are still a caster, run speed once you are not.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "nagelring" },
              why: "Attack rating, from the moment Fire Claws replaces Firestorm.",
            },
          ],
        },
      ],
      nextUpgrade: "Level 18, and the switch from casting to biting. It is the sharpest identity change of any Druid build.",
      notes:
        "**Level as a fire caster and mean it.** Firestorm and Molten Boulder are maxed by the finished build anyway, so every point you spend on them before level 18 is a point the endgame wanted. This is the rare build where the levelling detour is not a detour.",
    },

    {
      tier: "nightmare",
      goal: "Nightmare cleared with Fire Claws maxed and both synergies well along.",
      levelRange: [40, 65],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "passion" },
              why: "Increased attack speed and a large attack rating bonus at level 43. Attack speed is the fire block's multiplier and attack rating is what stops the swing missing — this weapon is both of this build's problems in one.",
              sockets: "Dol + Ort + Eld + Lem in a fast 4-socket weapon.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +2 Druid skills and +3 to Shape Shifting skills",
              why: "**+3 Shape Shifting, not +3 Elemental.** Synergies read hard points, so a +3 Elemental roll raises Firestorm's own damage — which you never cast — and adds nothing to Fire Claws. This is the most common way to get this build's gear wrong.",
              lookFor: ["+3 to Shape Shifting Skills", "+2 Druid Skills", "Faster hit recovery", "2 sockets"],
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "lore" },
                  why: "+1 to all skills is +1 to Fire Claws too, and it is available now.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "treachery" },
              why: "45% increased attack speed and a Fade that triggers on being struck. Both halves fit: the speed is damage and the Fade is resistances you are standing in.",
              sockets: "Shael + Thul + Lem in any 3-socket body armour.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "duress" },
                  why: "Crushing blow and open wounds instead of the attack speed. Both are physical-half effects, so they are worth less here than on the Fury wolf.",
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
              why: "Every 20% is a straight increase in how much fire you deliver per second.",
              lookFor: ["20% Increased Attack Speed", "Life stolen per hit", "Resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Life stolen per hit and physical damage reduced. Note that leech works from the *physical* half of your damage, so it is worth less to this build than to the Fury wolf — plan for potions as well.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "gore-rider" },
              why: "Crushing blow and open wounds, both of which act on the physical half. Deadly strike does too. This slot is entirely about the weapon's contribution.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen, and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "A rare ring with attack rating and resistances",
              why: "Attack rating first. A swing that misses delivers no fire at all.",
              lookFor: ["+ to attack rating", "All resistances", "Life stolen per hit"],
            },
          ],
        },
      ],
      nextUpgrade:
        "An answer to fire immunity, and it is a mercenary rather than an item. Read the immunity plan before Hell.",
      notes:
        "**Socket for fire, not for resistances, once resistances are capped.** A fire rainbow facet in a helm or shield carries both −% to enemy fire resistance and +% to fire skill damage, and this build is one of very few melee characters that wants either.",
    },

    {
      tier: "early-hell",
      goal: "Hell entered. Resistances capped, and the fire immunity problem named rather than solved.",
      levelRange: [65, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "kingslayer" },
              why: "Crushing blow, open wounds and −25% target defence. All three help the physical half; the attack speed you are giving up against Passion is the cost, and it is a real one.",
              sockets: "Mal + Um + Gul + Fal in the fastest 4-socket base you can wear.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "passion" },
                  why: "Keeping Passion for its attack speed is a defensible choice on this build in a way it would not be on a purely physical one.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +3 Shape Shifting skills and two sockets",
              why: "Three effective levels on Fire Claws, and two sockets for fire facets once resistances are capped elsewhere.",
              lookFor: ["+3 to Shape Shifting Skills", "+2 Druid Skills", "2 sockets"],
              sockets: "Two fire rainbow facets, or two 15% all-resistance jewels while resistances are still short.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "duress" },
              why: "Crushing blow, open wounds and a large enhanced-damage roll — all of which act on the weapon half only.",
              sockets: "Shael + Um + Thul in any 3-socket body armour.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted blood gloves with 20% increased attack speed and life stolen per hit",
              why: "Attack speed, and leech to make the physical half pay for itself.",
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
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills, which here is +1 to Fire Claws." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "the-cats-eye" },
              why: "20% increased attack speed and 30% faster run/walk. Speed on a build whose damage is per-hit, and mobility on a build that has to reach things.",
              alternatives: [
                {
                  label: "A rare amulet with +2 Druid skills and attack rating",
                  why: "Two effective Fire Claws levels. Better once the attack speed is covered elsewhere.",
                },
              ],
            },
          ],
        },
      ],
      charms: [
        {
          ref: { kind: "unique", slug: "flame-rift" },
          why: "**Fire Sunder, and it is the half of the immunity plan you can carry.** It breaks a fire immunity outright; only one Sunder Charm can be held at a time, and fire is the only one this build would choose.",
        },
        {
          label: "Shape Shifting skillers with life",
          why: "+1 effective level to Fire Claws each. A skiller from the elemental tree would raise Firestorm's own damage and add nothing here — the same trap as the pelt.",
        },
      ],
      nextUpgrade: "Infinity on the mercenary. It is the largest single upgrade this build has and it is not an item you wear.",
    },

    {
      tier: "budget",
      goal: "Hell farmed, with Conviction lowering fire resistance and a Sunder Charm covering what it cannot.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "beast" },
              why: "Fanaticism — attack speed, attack rating and enhanced damage. The attack speed is the part that matters most, because it is the only one of the three that raises the fire.",
              sockets: "Ber + Tir + Um + Mal + Lum in a 5-socket Axe, Scepter or Hammer.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "passion" },
                  why: "Far cheaper, and its attack speed is most of what Beast is giving you here. This build needs Beast less than the Fury wolf does.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +3 Shape Shifting skills and two fire rainbow facets",
              why: "Three effective levels and two lots of −% enemy fire resistance and +% fire skill damage.",
              tradeOnly: true,
              alternatives: [
                {
                  ref: { kind: "unique", slug: "vampire-gaze" },
                  why: "Leech and 15–20% physical damage reduction. The cheap answer for a character with no shield.",
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
              why: "+300% enhanced damage and a large defence roll — but be clear about what you are buying: enhanced damage multiplies the weapon half and does nothing to the fire.",
              sockets: "El + Sol + Dol + Lo in any 4-socket body armour.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "treachery" },
                  why: "45% increased attack speed instead, which *does* raise the fire. On this build specifically the cheaper armour is closer to the expensive one than it looks.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted blood gloves with 20% increased attack speed",
              why: "Speed, leech and life.",
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
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Three per-hit effects on the physical half." }],
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
              why: "20% increased attack speed and deadly strike that scales with level.",
              alternatives: [
                { ref: { kind: "unique", slug: "the-cats-eye" }, why: "Attack speed and run speed, cheaper." },
              ],
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "flame-rift" }, why: "Fire Sunder. One charm at a time, and fire is the one." },
        {
          label: "Shape Shifting skillers with life",
          why: "Effective levels on Fire Claws. Elemental skillers do nothing here.",
        },
      ],
      nextUpgrade: "Infinity, if it is not already on the mercenary. Nothing you wear competes with it.",
    },

    {
      tier: "optimized",
      goal: "Conviction running, resistances over-capped, and every socket carrying fire.",
      levelRange: [85, 95],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "beast" },
              why: "Fanaticism, for the attack speed above all. If the mercenary is carrying Infinity it cannot also carry Faith, so this hand is where Fanaticism has to come from.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A +3 Shape Shifting, +2 Druid skills pelt with two fire rainbow facets",
              why: "Five effective levels on Fire Claws, and the only two facet sockets most of this build will ever have.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "fortitude" },
              why: "+300% enhanced damage on the weapon half, and the defence.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "+2 skills and +65 all resistances. Two effective Fire Claws levels and a resistance problem solved — a serious competitor here in a way it is not on a purely physical build.",
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
              why: "Life Tap on striking, which returns a share of the damage dealt — and on this build the damage dealt includes the fire.",
              alternatives: [
                {
                  label: "Crafted blood gloves with 20% increased attack speed",
                  why: "Dracul's carries no attack speed, and attack speed is this build's multiplier. This is a genuine choice rather than a downgrade.",
                },
              ],
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
              why: "Attack speed, deadly strike and +1 to all skills.",
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "flame-rift" }, why: "Fire Sunder, for what Conviction cannot break." },
        {
          label: "Anni, Torch and nine Shape Shifting skillers",
          why: "The Torch's +3 Druid skills is three effective levels on Fire Claws.",
        },
      ],
      weaponSwap: [
        {
          ref: { kind: "runeword", slug: "call-to-arms" },
          why: "Battle Orders before shifting, multiplied by Lycanthropy afterwards.",
        },
      ],
      nextUpgrade: "Better facet rolls and a better pelt. The build is structurally finished here.",
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
              ref: { kind: "runeword", slug: "beast" },
              why: "Fanaticism. There is no weapon that gives this build more than an aura of attack speed does.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "hand-of-justice" },
                  why: "Its Holy Fire aura adds fire damage of its own and it carries a large attack-speed roll. A real alternative when the mercenary is supplying Fanaticism instead.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A +3 Shape Shifting, +2 Druid skills pelt with two fire rainbow facets",
              why: "The hardest item on the page, and the one that matters most.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 skills and +65 all resistances. Two effective Fire Claws levels beat enhanced damage that only touches half your output.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to all skills." }],
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
              why: "Two effective levels and the speed.",
              tradeOnly: true,
              alternatives: [
                { ref: { kind: "unique", slug: "highlords-wrath" }, why: "Never wrong, and far easier to find." },
              ],
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "flame-rift" }, why: "Fire Sunder." },
        {
          label: "Anni, Torch and nine Shape Shifting skillers with life",
          why: "The finished inventory.",
        },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders before shifting." },
      ],
      notes:
        "**This build's ceiling is lower than the other melee Druids' and the reason is not gear.** Fire is the most commonly resisted element in Hell, half its damage is fire, and the two things that reduce enemy fire resistance are a mercenary aura and a charm rather than something you can stack. Past this point there is nothing left to buy that changes that.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**An Act 2 Desert Mercenary, and at the top end this is the most important item on the page: Infinity.** Its Conviction aura lowers fire, cold and lightning resistance, which is the only aura in the game that helps this build's larger half — and unlike a facet, an aura *can* break an immunity. Until Infinity exists, take **Might** in Nightmare for the physical half, and give the mercenary **Fortitude** so it survives long enough to keep the aura up. The two mercenaries this build should not hire are the ones the other melee Druids want: an Act 1 rogue with Faith gives Fanaticism, which is real, but Conviction is worth more here than attack speed the moment fire immunes appear; and an Act 3 Iron Wolf's own fire damage does nothing for yours.",

  farming: [
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "High density, no fire immunity in the population, and a per-hit fire block is at its best when there are many things to hit. The area's one immunity is physical, which costs this build the smaller half of its damage.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Level 85, dense and undead. The skeletons and zombies here are the friendliest thing in Hell to a fire build.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Thirty seconds a run against a single large target that is not fire immune. The crushing blow on your boots does the rest.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are fire immune, and this is the entry that proves the build's design: the weapon half kills them anyway, slowly. Bring the Sunder Charm and it stops being slow.",
      minTier: "budget",
      rating: 3,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Level 85 and the best item density in Act 1. The mixed immunities here are exactly what a two-damage-type melee attack was built for.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "throne-of-destruction",
      difficulty: "hell",
      why: "Level 85 at density five, and its recorded immunities are cold, lightning and poison — not one of which this build deals. Both halves of the damage land on the whole population, which is the cleanest match the area list offers.",
      minTier: "optimized",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "The best experience in the game, and the place where fire immunity is most common. Wants Infinity and the Sunder Charm both.",
      minTier: "optimized",
      rating: 3,
    },
  ],

  immunityPlan:
    "**Two damage types, but not two equal ones — and that asymmetry is the whole plan.** Fire Claws lands the weapon's full damage *and* its own fire, so a fire immune still takes the weapon's physical and a physical immune still takes the fire. The difference from the Wind Druid's version of this trick is that the halves are not the same size: the fire is twenty points with two maxed 22% synergies behind it, and the physical is whatever weapon you are holding. A fire immune is therefore a genuine slowdown rather than an irrelevance, and Hell hands out fire immunity more freely than any other kind. Three things address it and they are not interchangeable. **Conviction**, from an Infinity on the mercenary, is an aura: cut to one fifth against a target that is still immune, and it breaks the immunity anyway where a fifth is enough. **Flame Rift**, the fire Sunder Charm, breaks it outright, and only one Sunder Charm can be held at a time. A **fire rainbow facet** does neither — a −% to Enemy Resistance line is applied after the immunity check, and that step is skipped while the immunity stands, so against a fire immune a facet is absent rather than weak. Once Conviction or the charm has broken it, every facet you own lands on the result at full value, which is exactly why they are worth socketing.",

  hardcoreNotes:
    "Playable but not the Druid you should take into Hardcore first — the Maul bear and the Summoner are both safer, and this build's damage requires standing in melee range for longer than either. Take **Oak Sage** over Heart of Wolverine, keep the Grizzly out, and over-cap fire resistance rather than merely capping it: you spend the fight surrounded by things you have set alight, and Hell's fire-immune packs are usually fire-*dealing* packs as well. The specific killer is a Fanaticism-boosted physical pack while your leech is thin, because leech works from the physical half of your damage only and that half is the smaller one. Carry more potions than a Fury wolf would.",

  selfFoundNotes:
    "The hardest of the Druid builds to run self-found, and the reason is structural rather than bad luck. The build's answer to fire immunity is Infinity — four runes including two Bers — and its second answer is a Sunder Charm from a Terror Zone. Neither is a realistic self-found target, and without either, a fire immune is killed by your weapon alone. What works self-found is the first two thirds: Leaf carries the levelling honestly, Passion is a realistic weapon, and a Charsi-imbued +3 Shape Shifting pelt is the one item worth planning for. Beyond that, expect to walk past packs that another Druid would have killed.",

  levelingPath: {
    summary:
      "There is no respec, and that is unusual for a build with forty points in a tree it never casts from — because it *does* cast from it, for the first eighteen levels. You level on Firestorm and Molten Boulder, which are the two skills the finished build maxes anyway, and at level 18 the same points stop being your attack and become its synergies.",
    respecAt: "None. The fire you cast at level 10 is the fire you bite with at level 90.",
  },

  confidence: "verified",
  complete: true,
};
