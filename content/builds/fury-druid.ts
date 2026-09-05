import type { Build } from "@/lib/types";

/**
 * The Fury Druid — the werewolf.
 *
 * Three facts from the extraction decide everything on this page.
 *
 *   **Fury receives no synergy from anything, and gives none.** It is the only
 *   maxed skill on any Druid build with an empty synergy list in both
 *   directions. So there is no cheap multiplier to buy: the twenty points in
 *   Fury raise Fury's own +17% per level and nothing else, and every remaining
 *   point has to justify itself somewhere other than the shape-shifting tree.
 *   That is why this build spends forty points in a tree it never looks at.
 *
 *   **Each of the five hits is a separate attack roll.** Life stolen, crushing
 *   blow, open wounds and every chance-to-cast get five chances where an
 *   ordinary swing gets one. That is the whole reason an unremarkable weapon
 *   kills bosses on this build, and it is why the gear below chases
 *   per-hit effects rather than a bigger damage number.
 *
 *   **No wereform frame table exists at a source tier this project accepts.**
 *   The site publishes werewolf and werebear *cast rate* tables because the
 *   game's own data carries them; nothing equivalent exists for hit recovery or
 *   attack speed. The breakpoints table on this page is therefore empty, and
 *   says so.
 */
export const furyDruid: Build = {
  slug: "fury-druid",
  name: "Fury Druid",
  classSlug: "druid",
  summary:
    "A werewolf that lands five separate attack rolls per swing, which turns crushing blow and life steal into a boss plan rather than a garnish.",
  damageTypes: ["physical"],
  primarySkill: "fury",
  playstyle:
    "You cast your spirit and your bear in human form, shift, and then stop thinking about buttons. Fury is the only attack you press, and it is a burst of up to five hits in the time an ordinary attack takes one. Against a pack you walk in, because the wolf is fast and the Grizzly has already pulled the front rank onto itself; against a boss you stand still and let the hit count do the work. There is no rotation, no cooldown and no resource to manage — Fury costs four mana. What there is instead is a positioning problem: everything you kill, you kill in melee range, and the build's whole defensive plan is that things are looking at the bear instead of you.",
  strengths: [
    "Five separate attack rolls per swing — crushing blow, open wounds and life stolen all roll five times",
    "An enormous life pool: Lycanthropy's +115% multiplies whatever Vitality bought, and Werewolf adds a flat +25% on top of that",
    "Almost free to run — Fury costs 4 mana at every level, so there is no mana problem to solve",
    "Boss damage without a boss weapon; crushing blow is a share of current life, not a share of yours",
    "The Grizzly taunts, which means the build gets a front line it does not have to be",
  ],
  weaknesses: [
    "One damage type, and it is the one Hell hands out immunity to most cheaply in the late acts",
    "No published attack-speed breakpoints exist for either wereform, so gear cannot be planned to a frame",
    "Attack rating is a real problem in Hell and it is solved with points and gear rather than skill",
    "You cannot cast while shifted — every buff, summon and potion decision happens before the fight",
    "No movement skill, and an Enigma's Teleport drops you out of form each time you use it",
  ],
  difficulty: "advanced",
  budget: "medium",
  ratings: {
    clearSpeed: 3,
    bossing: 5,
    survivability: 4,
    magicFind: 2,
    terrorZones: 3,
    ubers: 4,
    soloSelfFound: 3,
    players8: 4,
  },

  skills: [
    {
      skill: "fury",
      points: 20,
      role: "main",
      order: 1,
      note: "Five hits from level 4 onward — every point after the fourth buys the +17% damage per level and nothing else. It receives no synergy from any skill, which is why nothing else in this tree is worth maxing for its sake.",
    },
    {
      skill: "werewolf",
      points: 20,
      role: "main",
      order: 2,
      note: "Attack speed, and attack speed is throughput on a skill whose hit count is already capped. The bonus climbs from 10% toward a ceiling of 80% on a diminishing curve, so the early points are worth far more than the late ones — but there is nowhere better for them.",
    },
    {
      skill: "lycanthropy",
      points: 20,
      role: "main",
      order: 3,
      note: "+115% life at twenty points — only a maxed Oak Sage gives this class more, and that one is a totem that can be killed — plus forty extra seconds of form per two points. It costs no mana and has no cast — it is a passive the game files next to the forms.",
    },
    {
      skill: "heart-of-wolverine",
      points: 20,
      role: "utility",
      order: 4,
      note: "+153% enhanced damage and +158% attack rating at twenty. The enhanced damage multiplies the weapon, and the attack rating is the honest answer to missing things in Hell.",
    },
    {
      skill: "summon-grizzly",
      points: 20,
      role: "utility",
      order: 5,
      note: "One bear, and it taunts. It is the front line, and the reason a melee character with no shield-block plan survives a Hell pack.",
    },
    {
      skill: "feral-rage",
      points: 1,
      role: "prerequisite",
      note: "Required for Rabies. Also the build's travel button: its charges buy movement speed, climbing toward 70%, and the wolf has no other way to move faster.",
    },
    {
      skill: "rabies",
      points: 1,
      role: "prerequisite",
      note: "Required for Fury, and nothing else. One point of poison on a physical build is not a plan; see the Rabies Druid if it appeals.",
    },
    {
      skill: "oak-sage",
      points: 1,
      role: "prerequisite",
      note: "Required for Heart of Wolverine and for the wolves. One point is also a real Hardcore option — see the flexible points.",
    },
    { skill: "raven", points: 1, role: "prerequisite", note: "Required for the wolves. Five birds that blind, for one point." },
    { skill: "summon-spirit-wolf", points: 1, role: "prerequisite" },
    { skill: "summon-dire-wolf", points: 1, role: "prerequisite" },
  ],
  flexPoints: [
    "Four points are genuinely spare at level 99. **Oak Sage** is the usual home for them in Hardcore — but note that it and Heart of Wolverine share one spirit slot, so points in both buy a *switch*, not a stack.",
    "**Werebear instead of Werewolf** is not a flexible point, it is a different build. The bear cannot use Fury at all — Fury is wolf-only.",
    "**Hunger** costs three points to reach from here (Werebear, Maul, Fire Claws) and gives an emergency life-and-mana bite. On a build with life stolen on five hits a swing, it is rarely the better use of three points.",
    "Do not put points in **Rabies** or **Feral Rage** past the one each. Fury replaces both, and neither feeds it.",
  ],
  stats: {
    strength: "Enough for the weapon and the armour you actually intend to wear, counted once and not exceeded.",
    dexterity: "Enough for the weapon, and no more unless you are building for maximum block.",
    vitality: "Everything else, and it is worth more here than on any other class.",
    energy: "None. Fury costs four mana.",
    notes: [
      "The Druid gains 2 life per point of Vitality, and then **Lycanthropy multiplies the result by 2.15 at twenty points** while Werewolf adds a flat 25% on top. A point of Vitality is worth more to a shapeshifter than to anyone else in the game, which is the argument against spending any of them anywhere else.",
      "Attack rating, not damage, is what fails first in Hell. Heart of Wolverine's +158% is the largest single source on the build; after that it is rings, an amulet and the mercenary.",
      "Strength for a shield is a genuine decision and this build does not need one. A two-handed weapon costs nothing but the block you were not going to get to reliably anyway.",
      "There is **no Energy answer to look for**, which is unusual for this site: Fury's cost does not scale with its level.",
    ],
  },
  breakpoints: [],
  breakpointNotes:
    "**This table is empty on purpose.** Werewolf and Werebear do not use the human-form frame tables — the site says so on the Druid cast-rate table, which publishes all three. What exists for cast rate does not exist for hit recovery or attack speed: Blizzard has never published a wereform frame table, and the de-facto community calculator is built against a 2022 PTR build whose own repository carries an open issue about this skill. Printing the human-form numbers here would repeat exactly the mistake the cast-rate table warns about, so nothing is printed. **Increased Attack Speed is still the build's best offensive affix** — the gear below chases it — but it is chased continuously rather than to a threshold, and any page that gives you a wereform attack-speed breakpoint is quoting a source this one could not verify.",

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 30 and Fury. Until then you are levelling on Feral Rage, and everything here is a vendor purchase or a Countess rune.",
      levelRange: [1, 40],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "steel" },
              why: "Attack speed, attack rating and open wounds for two of the cheapest runes in the game, in a base you can buy. Before Fury exists you are hitting once per swing, and open wounds does not care how hard you hit.",
              sockets: "Tir + El in any 2-socket Sword, Axe or Mace. A fast base beats a big one.",
              alternatives: [
                {
                  label: "Any weapon with a socket and a Larzuk quest reward",
                  why: "A rare or magic weapon with Increased Attack Speed is a perfectly good stand-in. This slot gets replaced twice before Hell.",
                  lookFor: ["Increased attack speed", "+% enhanced damage", "+ to attack rating"],
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
              why: "+1 to all skills for Ort + Sol. On a Druid pelt it stacks with the pelt's own roll, and a pelt is the only helm in the game that rolls +to a Druid skill directly.",
              sockets: "Ort + Sol in any 2-socket helm. Buy a white Druid pelt from Akara rather than using a plain cap.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "Faster hit recovery, faster running and +6 Dexterity from level 17 for Tal + Eth. You are running everywhere and getting hit constantly.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              label: "Any boots with faster run/walk and resistances",
              why: "Feral Rage's charges are the wolf's movement skill and they decay after twenty seconds without a hit. Boots cover the gaps between fights.",
              lookFor: ["Faster run/walk", "Fire and lightning resistance"],
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "nagelring" },
              why: "Attack rating and magic find from a ring that drops in Act 1. Attack rating is the stat this build is short of from the first hour to the last.",
            },
          ],
        },
      ],
      nextUpgrade:
        "Level 30 and the first point in Fury. Everything before that is a different character wearing this gear.",
      notes:
        "**Put one point in Werewolf at level 1 and then feed Lycanthropy.** The form's forty-second base duration is the thing that makes low-level shapeshifting tedious, and Lycanthropy adds twenty seconds a point for free — no mana, no cast.",
    },

    {
      tier: "nightmare",
      goal: "Nightmare cleared with Fury maxed and the Grizzly out. This is the tier where the build stops being a novelty.",
      levelRange: [40, 65],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "passion" },
              why: "Increased attack speed and a very large attack rating bonus in a four-socket weapon available at level 43. Attack speed on a skill that swings five times is the cheapest damage on the page.",
              sockets: "Dol + Ort + Eld + Lem in any 4-socket weapon. A fast one-handed base is worth more than a slow two-handed one here.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "kingslayer" },
                  why: "Ten levels later and a rune tier up, but it carries crushing blow and open wounds — and this build rolls both five times a swing.",
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
              why: "Pelts are the only helms that roll a Druid skill directly, and a +3 Shape Shifting roll raises Fury, Werewolf and Lycanthropy at once. Charsi's imbue on a white pelt after level 30 is the deliberate way to get one.",
              lookFor: ["+2 Druid Skills", "+3 to Shape Shifting Skills", "Faster hit recovery", "Life"],
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "lore" },
                  why: "Still fine if nothing has dropped. +1 to all skills is +1 to five skills you have maxed or nearly maxed.",
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
              why: "45% increased attack speed and a Fade that triggers on being struck — which, on a character that is always being struck, is close to permanent resistances and damage reduction.",
              sockets: "Shael + Thul + Lem in any 3-socket body armour.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "duress" },
                  why: "Four levels later: crushing blow and open wounds instead of the attack speed. On a five-hit swing, crushing blow is the better half of that trade against anything large.",
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
              why: "The cheapest attack speed in the game and it appears on ordinary rares and crafts. This slot has no better job on this build.",
              lookFor: ["20% Increased Attack Speed", "Life stolen per hit", "Resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Life stolen per hit and physical damage reduced, which are the two things a character standing in melee range for a living actually wants from a belt.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "gore-rider" },
              why: "Crushing blow, open wounds and deadly strike in one slot — three per-hit effects on a skill that rolls each of them five times.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "raven-frost" },
              why: "Cannot be frozen, and a large flat attack rating bonus. Being frozen is worse for a melee character than for anyone else and this is the only cheap answer.",
            },
          ],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "A rare ring with attack rating and life stolen per hit",
              why: "Attack rating first, leech second, resistances third. A ring is the cheapest place on the character to buy all three.",
              lookFor: ["+ to attack rating", "Life stolen per hit", "All resistances"],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "the-cats-eye" },
              why: "20% increased attack speed, 30% faster run/walk and +25 Dexterity. It is a melee amulet that happens to solve the wolf's movement problem as well.",
              alternatives: [
                {
                  label: "A rare amulet with +2 Druid skills and attack rating",
                  why: "+2 to Druid skills is +2 to Fury, Werewolf, Lycanthropy, Heart of Wolverine and the Grizzly at once. Once resistances are capped it beats the unique.",
                },
              ],
            },
          ],
        },
      ],
      nextUpgrade:
        "A Hell answer to physical immunity. Until Atma's Scarab or a Bone Break exists, a physical immune is a monster you walk away from.",
      notes:
        "**Cast in this order and then shift: Heart of Wolverine, Grizzly, Werewolf.** You cannot cast once you are in form, and re-summoning either of them means dropping out of it. The Grizzly cannot be re-summoned while it lives, so a dead bear costs a full 40-mana cast and a shift.",
    },

    {
      tier: "early-hell",
      goal: "Hell entered. Resistances capped, one answer to physical immunity, and a mercenary that survives.",
      levelRange: [65, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "kingslayer" },
              why: "Crushing blow, open wounds and −25% target defence, all of which are per-hit effects on a five-hit swing. It is the last weapon before the two that end the build.",
              sockets: "Mal + Um + Gul + Fal in a 4-socket Sword or Axe. Pick the fastest base whose Strength you can pay.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "crescent-moon" },
                  why: "Cheaper by a rune tier, and its open wounds and −35% enemy lightning resistance make it a better weapon for a mercenary than for you.",
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
              why: "Two sockets of 15% all-resistance jewels is how a melee Druid caps resistances without giving up a skill slot for them.",
              lookFor: ["+2 Druid Skills", "+3 to Shape Shifting Skills", "2 sockets", "Faster hit recovery"],
              sockets: "Two 15% all-resistance jewels, or two Increased Attack Speed jewels once resistances are capped elsewhere.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "duress" },
              why: "15% crushing blow and 33% open wounds on a body armour, plus a large enhanced-damage roll and cold damage that chills. Every line on it is a line this build multiplies by five.",
              sockets: "Shael + Um + Thul in any 3-socket body armour.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves with 20% increased attack speed and life stolen per hit",
              why: "Attack speed and leech together. A crafted blood glove rolls both and is the standard answer at this tier.",
              lookFor: ["20% Increased Attack Speed", "Life stolen per hit", "All resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Unchanged. Physical damage reduced is worth more in Hell than any other belt line available at this level.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "gore-rider" },
              why: "Unchanged, and it stays to the end of the build. Nothing else in the slot carries three per-hit effects.",
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
              ref: { kind: "unique", slug: "stone-of-jordan" },
              why: "+1 to all skills. On a build with five maxed skills that is five effective levels for one slot.",
              alternatives: [
                {
                  label: "A rare ring with attack rating, leech and resistances",
                  why: "Better than the unique while resistances are still short. Cap first, then optimise.",
                },
              ],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "atmas-scarab" },
              why: "**Amplify Damage on striking, and this is the build's immunity plan.** It is a curse, so it is cut to one fifth against a physical immune and still breaks the immunity where a fifth is enough. Against everything else it is simply a very large damage multiplier.",
            },
          ],
        },
      ],
      charms: [
        {
          label: "Shape Shifting skillers with life",
          why: "+1 effective level to Fury, Werewolf and Lycanthropy each. Nothing else fills an inventory better on this build; a Summoning skiller only raises two of the five maxed skills.",
        },
      ],
      nextUpgrade:
        "Beast, and the Fanaticism aura it brings. It is the single largest upgrade on this page and it changes what the mercenary should be carrying.",
      notes:
        "**Atma's Scarab is not a magic-find amulet on this build, it is the immunity answer.** Read the immunity plan before deciding to replace it with a +2 skills rare.",
    },

    {
      tier: "budget",
      goal: "Hell farmed comfortably. Fanaticism from your own weapon, and a mercenary carrying an aura you do not already have.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "beast" },
              why: "**Fanaticism, from your own hand.** It is attack speed, attack rating and enhanced damage in one aura, on a build whose three problems are exactly those. Its +3 to Werebear is wasted on a wolf and it is still the best weapon here.",
              sockets: "Ber + Tir + Um + Mal + Lum in a 5-socket Axe, Scepter or Hammer. A Berserker Axe is the usual base.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "grief" },
                  why: "More raw damage per hit and −25% target defence, but no aura. If you take Grief, the mercenary has to carry Fanaticism instead — see the mercenary note.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +3 Shape Shifting skills, +2 Druid skills and two sockets",
              why: "Five effective levels on Fury from one slot, and two sockets left over for resistances or attack speed.",
              lookFor: ["+3 to Shape Shifting Skills", "+2 Druid Skills", "2 sockets", "Life"],
              tradeOnly: true,
              alternatives: [
                {
                  ref: { kind: "unique", slug: "vampire-gaze" },
                  why: "Life and mana stolen per hit and 15–20% physical damage reduced. On a character with no shield it is the cheapest damage reduction in the game.",
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
              why: "+300% enhanced damage and a very large defence bonus. Enhanced damage multiplies the weapon, so it stacks with Heart of Wolverine and Fanaticism rather than competing with them.",
              sockets: "El + Sol + Dol + Lo in any 4-socket body armour.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "duress" },
                  why: "Keep it if the Lo rune is not there. Crushing blow times five hits is worth more than it looks against Hell's larger monsters.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted blood gloves with 20% increased attack speed and life stolen per hit",
              why: "Attack speed, leech and life on one item. The craft is cheap and repeatable and beats every unique in this slot until Dracul's Grasp.",
              lookFor: ["20% Increased Attack Speed", "Life stolen per hit", "+ to life"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Still the best physical damage reduction available in the slot.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "thundergods-vigor" },
                  why: "If lightning is what keeps killing you: absorb, a large Vitality roll and lightning resistance over the cap.",
                },
              ],
            },
          ],
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
              ref: { kind: "unique", slug: "atmas-scarab" },
              why: "Amplify Damage on striking. It stays until a Bone Break replaces the job it is doing.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "highlords-wrath" },
                  why: "Deadly strike that scales with character level, and 20% increased attack speed. Take it once a Sunder Charm is carrying the immunity plan instead.",
                },
              ],
            },
          ],
        },
      ],
      charms: [
        {
          ref: { kind: "unique", slug: "bone-break" },
          why: "Physical Sunder, and the reason the amulet slot can go back to being an amulet slot. Only one Sunder Charm can be held at a time, and physical is the only immunity this build has.",
        },
        {
          label: "Shape Shifting skillers with life, and small charms with attack rating",
          why: "Attack rating on small charms is the least glamorous stat on this page and one of the two that actually gates Hell damage.",
        },
      ],
      nextUpgrade: "Dracul's Grasp, and a second aura on the mercenary.",
    },

    {
      tier: "optimized",
      goal: "Everything in Hell, at any player count, without changing gear between runs.",
      levelRange: [85, 95],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "beast" },
              why: "Fanaticism is worth more than any raw damage line the slot could carry instead, because it multiplies the weapon *and* raises attack speed *and* raises attack rating.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A +3 Shape Shifting, +2 Druid skills pelt with two 15% all-resistance jewels",
              why: "Five effective levels and thirty resistances from one slot.",
              tradeOnly: true,
              alternatives: [
                {
                  ref: { kind: "unique", slug: "crown-of-ages" },
                  why: "+1 to all skills, 30% damage reduction and two sockets. The Hardcore answer, and it costs two effective Fury levels.",
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
              why: "+300% enhanced damage. Nothing else in the slot competes on a physical build.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "+2 skills, +65 all resistances and 8% damage reduction. The trade is damage for the ability to stop thinking about resistances.",
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
              why: "**Life Tap on striking, rolled five times a swing.** Life Tap returns a share of the damage dealt as life, which on a build that hits this often is a larger sustain source than any leech roll — and it is the reason this build does not need a healing skill.",
              alternatives: [
                {
                  label: "Crafted blood gloves with 20% increased attack speed",
                  why: "Dracul's carries no attack speed. If your swing feels slow, the craft is the honest alternative rather than an upgrade to be endured.",
                },
              ],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Physical damage reduced, and leech to cover the gap when Life Tap is not up.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Three per-hit effects; nothing replaces it." }],
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
              why: "Deadly strike scaling with character level, 20% increased attack speed and +1 to all skills. Correct once Bone Break is carrying the immunity plan.",
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "bone-break" }, why: "Physical Sunder. The build's only immunity, answered." },
        {
          label: "Anni, Torch and Shape Shifting skillers",
          why: "The Torch's +3 Druid skills is three effective levels on five maxed skills at once.",
        },
      ],
      weaponSwap: [
        {
          ref: { kind: "runeword", slug: "call-to-arms" },
          why: "Battle Orders before you shift. The life it adds is multiplied by Lycanthropy and Werewolf on top, which is why it is worth more to this build than to almost any other.",
        },
      ],
      nextUpgrade: "Last Wish, if the Jah runes exist. Nothing else is left.",
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
              ref: { kind: "runeword", slug: "last-wish" },
              why: "Might, 60–70% chance of crushing blow, and Life Tap on striking — three of this page's recurring themes in one weapon. It replaces Beast only because your mercenary can carry Fanaticism instead; if it cannot, keep Beast.",
              sockets: "Jah + Mal + Jah + Sur + Jah + Ber in a 6-socket Sword, Hammer or Axe.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "beast" },
                  why: "Still correct, and it is not a downgrade in any measurable way if the mercenary has no Faith. Fanaticism from one source or the other is not optional.",
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
              why: "The single hardest item on the page to find and the largest one still missing.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% enhanced damage, and nothing else." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking, five rolls a swing." }],
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
              why: "Two effective levels on five maxed skills, and the attack speed the Dracul's slot gave up.",
              tradeOnly: true,
              alternatives: [
                { ref: { kind: "unique", slug: "highlords-wrath" }, why: "Never wrong, and far easier to find." },
              ],
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "bone-break" }, why: "Physical Sunder." },
        {
          label: "Anni, Torch and nine Shape Shifting skillers with life",
          why: "The standard endgame inventory for a shapeshifter.",
        },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders before shifting, every time." },
      ],
      notes:
        "**Fanaticism must come from somewhere and it only has two homes: Beast in your hand or Faith on an Act 1 mercenary.** Two copies of the same aura do not stack — the higher level wins — so owning both is a waste of one of them. The endgame decision is which hand carries it, and the answer decides the whole mercenary section.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**The mercenary's job is the aura you are not already carrying.** With Beast in your hand you already have Fanaticism, so take an Act 2 Desert Mercenary and give it Might in Nightmare — its enhanced-damage aura stacks with Fanaticism, Heart of Wolverine and Fortitude, all of which are enhanced damage from different sources and all of which multiply the weapon. At the top end that mercenary carries **Pride** and its Concentration aura instead, which is the largest physical-damage aura in the game. If you would rather use **Grief** than Beast, the aura has to move: hire an **Act 1 Rogue Scout** with **Faith** for its Fanaticism, and take the cold arrows in Nightmare so the pack is slowed before it reaches you. **Infinity is close to worthless here** — Conviction lowers fire, cold and lightning resistance, and every point of damage on this build is physical.",

  farming: [
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "A thirty-second run against a single large target, which is the exact shape a five-hit swing with crushing blow is best at. The standard first Hell target for a melee Druid.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Absurd density, and five leech rolls a swing. The catch is that physical is the one immunity this area carries and it is the one immunity this build has, so Bone Break or Atma's Scarab comes before the run becomes a habit.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Dense, level 85, reachable early, and full of the undead that open wounds and crushing blow handle without any help.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Level 85 and the best item density in Act 1 — but the mixed packs here are where a physical-only build first meets a physical immune, so bring the answer.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are large, melee, and not immune to physical. Crushing blow is a share of their current life, which is exactly the case where it is worth most.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "The densest packs in the game and the best experience. Wants capped resistances and a Sunder Charm before it is comfortable.",
      minTier: "optimized",
      rating: 4,
    },
    {
      area: "uber-tristram",
      difficulty: "hell",
      why: "Five attack rolls a swing is five crushing-blow rolls, and crushing blow is the only mechanic that meaningfully hurts the three Ubers. The build's ceiling is here rather than in any farming run.",
      minTier: "bis",
      rating: 4,
    },
  ],

  immunityPlan:
    "**Everything this build deals is physical, so physical immunity is the only immunity that exists for it — and it has two answers rather than one.** The first is **Amplify Damage** from Atma's Scarab. It is a curse, so it is cut to one fifth against a target that is still immune, and it breaks the immunity anyway wherever a fifth is enough — which covers most of what Hell puts in front of you. The second is **Bone Break**, the physical Sunder Charm, which breaks the immunity outright; only one Sunder Charm can be carried at a time and physical is the only one this build would ever want. What does **not** help is a −% to Enemy Resistance line: item pierce is applied after the immunity check and that step is skipped while the immunity stands, so against a physical immune it is absent rather than weak. Once a curse or the charm has broken the immunity, everything else you own lands on the result at full value.",

  hardcoreNotes:
    "A viable but demanding Hardcore build, and the demands are specific. **You cannot drink from the belt as freely in form and you cannot cast anything**, so the fight you are in is the fight you prepared for. Take **Oak Sage** rather than Heart of Wolverine — the life bonus applies to you, the mercenary and the bear, and this build's whole margin is life. Keep the Grizzly alive: it is the taunt that decides whether the pack is looking at the bear or at you, and it cannot be re-summoned while it lives, so a dead one means dropping form in the middle of a fight. The specific killers are Iron Maiden from an Oblivion Knight — five attack rolls a swing means five returns of your own damage — and Fanaticism-boosted ranged packs that the bear cannot reach. Physical damage reduction is worth more than any offensive line: String of Ears, Vampire Gaze and a Crown of Ages are a Hardcore gear plan on their own.",

  selfFoundNotes:
    "Workable but slower than the elemental Druids, for one reason: this build's damage lives in its weapon and its attack rating, and both come from items rather than from points. Steel, Lore and Stealth carry it through Normal, Treachery and a Charsi-imbued pelt carry it through Nightmare, and Gore Rider and String of Ears both drop readily. Kingslayer at level 53 is a realistic self-found weapon; Beast is not, and until one exists the mercenary is where Fanaticism has to come from — which means Faith, which is not self-found either. A self-found Fury Druid should plan for **Might on an Act 2 mercenary** and accept that the aura problem stays unsolved.",

  levelingPath: {
    summary:
      "Fury does not exist until level 30 and Werewolf does at level 1, so the first thirty levels are spent on Feral Rage with a point in Lycanthropy every level. Nothing is respecced: every point spent on the way — Werewolf, Lycanthropy, Feral Rage, Rabies — is either maxed later or is a prerequisite the final build needs anyway.",
    respecAt: "No respec required. This is one of the few builds on the site where the levelling character is the finished character.",
  },

  confidence: "verified",
  complete: true,
};
