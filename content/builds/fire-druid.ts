import type { Build } from "@/lib/types";

/**
 * The Fire Druid — Fissure, Volcano and Armageddon.
 *
 * The other half of the elemental tree, and it shares not one synergy with the
 * wind half. That is the fact the whole build is organised around: a Fire Druid
 * and a Wind Druid are two characters that happen to open the same tab, and
 * moving between them is a respec rather than a re-spend.
 *
 * Three extracted numbers matter more than the rest.
 *
 *   Fissure takes 12% per hard point from Firestorm *and* from Volcano, and
 *   from nothing else. Those two skills are the build, whatever else is on the
 *   bar.
 *
 *   Armageddon lasts 250 frames and `Param2` is zero — its own level buys no
 *   duration at all. Fifty frames per hard point in **Fissure** does, so the
 *   skill that keeps the storm overhead is the skill that was already maxed.
 *
 *   Every ground skill on this side deals **physical as well as fire**: Molten
 *   Boulder, Volcano and Armageddon all carry a `MinDam` table, and the two
 *   damages are synergised separately. It is why a fire immune slows this build
 *   down rather than stopping it, and why Volcano's 18% physical contribution
 *   to Armageddon is the largest physical-damage synergy in the class. It is not
 *   the largest of any kind: Firestorm receives a 23% pair, and Fire Claws a
 *   22% one. `superlative-claims.ts` derives that ranking now.
 */
export const fireDruid: Build = {
  slug: "fire-druid",
  name: "Fire Druid",
  classSlug: "druid",
  summary:
    "Ground fire that covers a room and does not have to be aimed, with a physical component underneath it that fire immunes cannot turn off.",
  damageTypes: ["fire", "physical"],
  primarySkill: "fissure",
  playstyle:
    "You place damage on the floor and let things walk into it. Fissure opens vents across a radius and they fire on a delay, so a pack crossing it takes several; Volcano goes under whatever is standing still; Armageddon rains around you the whole time and needs no target at all. There is no aiming and there is no channelling — the skill is choosing the doorway. Against a boss you stack all three on the same square and step back. It is the least twitchy build in the class and the one that punishes standing in the open the most, because none of your damage follows you.",
  strengths: [
    "Enormous area damage that costs no accuracy — the ground does the work",
    "Armageddon needs no target and keeps running while you cast, walk or fight",
    "Every ground skill carries physical damage as well as fire, so a fire immune is slowed rather than stopped",
    "Fissure is online at level 12 and carries the character through Normal and most of Nightmare",
    "The best pure clear-speed the class has once Infinity or a Flame Rift is in the picture",
  ],
  weaknesses: [
    "Fire is the most commonly resisted element in Hell; without an answer, whole areas are closed",
    "Every skill is stationary — damage does not follow a monster that walks away",
    "Needs five maxed skills before it is finished, which is a level-90 plan rather than a level-75 one",
    "No movement skill without an Enigma",
    "Armageddon's duration comes from Fissure, so the two cannot be traded off against each other",
  ],
  difficulty: "moderate",
  budget: "medium",
  ratings: {
    clearSpeed: 5,
    bossing: 3,
    survivability: 3,
    magicFind: 3,
    terrorZones: 5,
    ubers: 1,
    soloSelfFound: 4,
    players8: 4,
  },

  skills: [
    {
      skill: "fissure",
      points: 20,
      role: "main",
      order: 1,
      note: "The clear skill from level 12 onward, and Armageddon's duration synergy at fifty frames a point. Nothing else competes for the first twenty.",
    },
    {
      skill: "volcano",
      points: 20,
      role: "synergy",
      order: 2,
      note: "A 12% fire synergy to Fissure, a damage skill in its own right, and — at 18% of Armageddon's physical per point — the source of the class's largest physical-damage synergy.",
    },
    {
      skill: "firestorm",
      points: 20,
      role: "synergy",
      order: 3,
      note: "Fissure's other 12%, and 14% of Armageddon's fire. A level-1 skill that stays relevant to the end.",
    },
    {
      skill: "armageddon",
      points: 20,
      role: "main",
      order: 4,
      note: "Maxed before Molten Boulder because it is damage rather than a synergy. Its duration is already fifty seconds from the twenty points in Fissure.",
    },
    {
      skill: "molten-boulder",
      points: 20,
      role: "synergy",
      order: 5,
      note: "The last twenty. It gives Armageddon 14% fire a point and Volcano 16% physical a point, and gives Fissure nothing at all — which is why it is fifth and not fourth.",
    },
    {
      skill: "arctic-blast",
      points: 1,
      role: "prerequisite",
      note: "One point, only to reach Cyclone Armor.",
    },
    {
      skill: "cyclone-armor",
      points: 1,
      role: "utility",
      note: "40 points of fire, cold and lightning absorbed, refilling over time. One point is worth having on a build that stands near its own damage.",
    },
    {
      skill: "oak-sage",
      points: 1,
      role: "utility",
      note: "+30% life to you, the mercenary and anything you summon.",
    },
    {
      skill: "raven",
      points: 1,
      role: "utility",
      note: "Five blinding birds for one point, and the entrance to the summon line if you want the bear.",
    },
  ],
  flexPoints: [
    "Six points remain at level 99. The usual home is the **summon line** — Spirit Wolf, Dire Wolf and Grizzly, one point each — for a bear that holds the doorway your Fissure is covering.",
    "**Cyclone Armor** is the alternative: every point is 12 more absorbed, and this build stands closer to danger than a Wind Druid does.",
    "Do not spend them on Hurricane or Tornado. Neither takes a synergy from anything you have maxed, and neither gives one.",
  ],
  stats: {
    strength: "Enough for your gear. A Monarch for a Spirit shield is the only large demand.",
    dexterity: "Base.",
    vitality: "Everything else.",
    energy: "None.",
    notes: [
      "This build stands closer to its own kills than a Wind Druid does — Fissure has a radius of 7 and you are usually inside it — so Vitality is doing more work here than the ratings suggest.",
      "Mana is less of a problem than on the wind side: Fissure costs 15 and is cast every few seconds, not continuously. An Insight mercenary still covers it entirely.",
      "Fire resistance on your own gear matters more than usual, because the areas that suit this build are the hot ones.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 99,
      frames: 11,
      why: "The standard Druid caster target. It matters less here than on a Wind Druid — Fissure is placed rather than spammed — but the difference between 12 and 11 frames is still felt when re-placing under a moving pack.",
      priority: "recommended",
    },
    {
      stat: "fcr",
      value: 68,
      frames: 12,
      why: "The practical target for most of the game. Two Spirits and a Magefist clear it without planning.",
      priority: "recommended",
    },
    {
      stat: "fhr",
      value: 56,
      frames: 7,
      why: "You place your damage and stand in it. Being stun-locked next to your own Volcano is how this build dies in Hell.",
      priority: "required",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Level 12 for Fissure, and then Normal cleared on it.",
      levelRange: [1, 35],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "leaf" },
              why: "+3 to Fire Skills on a two-rune staff you can buy from Akara. On this build that is +3 Fissure, +3 Firestorm and +3 Molten Boulder at once, at a level where you have five hard points in total.",
              sockets: "Tir + Ral in any 2-socket staff. Buy the base; do not wait for one to drop.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "lore" },
              why: "+1 to all skills and lightning resistance for Ort + Sol.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "Faster cast rate, faster hit recovery and run speed from level 17, for Tal + Eth.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              label: "Any boots with faster run/walk and fire resistance",
              why: "You walk everywhere and you spend the whole game near fire. Both lines are worth more than they look.",
              lookFor: ["Faster run/walk", "Fire resistance"],
            },
          ],
        },
      ],
      nextUpgrade:
        "Level 24 for Volcano, which is the first time the build's damage stops being a levelling curiosity.",
      notes:
        "**Leaf is the single most efficient item this build ever equips.** Two common runes for three levels on three skills, at the exact point in the game where three levels is a doubling.",
    },

    {
      tier: "nightmare",
      goal: "Nightmare cleared, with Volcano maxed and Armageddon unlocked at 30.",
      levelRange: [35, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "35% Faster Cast Rate, +2 to all skills and a large mana pool. It replaces Leaf once +2 to everything beats +3 to one tree, which happens as soon as Armageddon and Cyclone Armor are on the bar.",
              sockets: "Tal + Thul + Ort + Amn in a 4-socket Crystal Sword.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "leaf" },
                  why: "Keep it until the Spirit exists. +3 to Fire Skills is still more Fissure damage than +2 to all skills is.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "+50% to all resistances for three Countess runes. Nightmare's fire damage is what kills a character standing in their own Fissure.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "spirit" },
                  why: "If the Strength for a Monarch is available: 35% more cast rate and +2 more skills.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +2 Druid skills and +3 to a fire skill",
              why: "Pelts roll +to a Druid skill directly. A +3 Fissure pelt at this stage is worth three hard points you have not earned yet.",
              lookFor: ["+2 Druid Skills", "+3 to Fissure", "+3 to Volcano", "Faster hit recovery"],
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "lore" },
                  why: "Until a pelt exists. Charsi's imbue on a white pelt after level 30 is the deliberate fix.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "+1 to all skills, 30% Faster Cast Rate and up to 35 all resistances. The resistance line is doing as much work as the skill line on this build.",
              sockets: "A perfect diamond, or an Um once one exists.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "magefist" },
              why: "20% Faster Cast Rate and +1 to Fire Skills — the only common unique in the game that gives this build both of the things it wants.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "nightsmoke" },
              why: "Resistances and damage taken from mana. Cheap and immediately useful.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "waterwalk" },
              why: "+65 life, and life is the stat this build is shortest of.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "Any amulet with +2 Druid skills",
              why: "Two levels across five maxed skills. Nothing else in the slot is close.",
              lookFor: ["+2 Druid Skills", "10% Faster Cast Rate", "Fire resistance"],
            },
          ],
        },
      ],
      nextUpgrade:
        "An answer to fire immunity. Until one exists, Hell is half-closed — see the immunity plan.",
      notes:
        "**Level 30 is the milestone, not level 24.** Armageddon changes what the build is: damage that follows you, on a class whose every other fire skill stays where you put it.",
    },

    {
      tier: "early-hell",
      goal: "Hell entered, resistances capped, and a first answer to fire immunes.",
      levelRange: [60, 80],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Cast rate and skills. The next weapon is Heart of the Oak and there is nothing worth the runes in between.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "The pair is +4 skills and 70% cast rate, which on five maxed skills is a large flat damage increase.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "splendor" },
                  why: "+1 to all skills and 20% cast rate on any base, when the Monarch's 156 Strength is not affordable.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "+2 skills, life, mana and magic find. The life is what keeps you standing next to your own Volcano.",
              sockets: "A perfect ruby for life, or an Um.",
              alternatives: [
                {
                  label: "Jalal's Mane",
                  why: "The Druid pelt unique. Equal to a Shako here and better when its Shape Shifting tab roll is irrelevant to you anyway.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "Unchanged. Resistances and cast rate in one common unique.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "magefist" },
              why: "+1 Fire Skills and 20% cast rate. Still unmatched for this build specifically.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "arachnid-mesh" },
              why: "+1 to all skills and 20% Faster Cast Rate. The piece that takes cast rate over the line.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "sandstorm-trek" },
              why: "Strength, Vitality and faster hit recovery — and the hit recovery target is required on this build.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "stone-of-jordan" },
              why: "+1 to all skills and mana.",
              alternatives: [
                {
                  label: "A rare ring with 10% Faster Cast Rate and fire resistance",
                  why: "Cheaper, and fire resistance is the one this build is always short of.",
                },
              ],
            },
          ],
        },
        {
          slot: "ring2",
          picks: [
            {
              ref: { kind: "unique", slug: "raven-frost" },
              why: "Cannot be frozen. A frozen caster standing in a Fissure is a dead caster.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 skills and +20 all resistances.",
            },
          ],
        },
      ],
      charms: [
        {
          ref: { kind: "unique", slug: "flame-rift" },
          why: "The fire Sunder Charm, and the single most important item this build will ever hold. It sets a fire immunity to 95% resistance instead, which turns roughly a third of Hell from closed to open. Only one Sunder Charm can be carried at a time.",
        },
      ],
      nextUpgrade:
        "An Infinity for the mercenary, which does the same job as the Sunder Charm without occupying the charm slot — and does it to lightning and cold immunes too.",
    },

    {
      tier: "budget",
      goal: "Every Hell area open, with fire immunity answered twice over.",
      levelRange: [80, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "+3 skills, 40% cast rate and +30-40 all resistances. Three skill levels across five maxed skills is the largest flat damage upgrade left.",
              sockets: "Ko + Vex + Pul + Thul in a 4-socket Flail.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "The shield Spirit stays; +2 skills and 35% cast rate for four common runes is not beaten at this budget.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "+2 skills, life and magic find.",
              alternatives: [
                {
                  label: "A Druid pelt with +3 Fissure and +2 Druid skills",
                  why: "Five effective levels on the build's main skill. Better than a Shako when it exists.",
                  tradeOnly: true,
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport. On a build whose damage is stationary, being able to reposition instantly is worth more than it is to almost anyone else.",
              sockets: "Jah + Ith + Ber in a light 3-socket body.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "+2 skills, +65 all resistances and 8% damage reduction, for a cheaper rune set. The right answer if a second character carries the Teleport.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            { ref: { kind: "unique", slug: "magefist" }, why: "+1 Fire Skills and 20% cast rate." },
          ],
        },
        {
          slot: "belt",
          picks: [
            { ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skill, 20% cast rate." },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "sandstorm-trek" },
              why: "Hit recovery and Vitality.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "war-traveler" },
                  why: "When the run is for items rather than for clearing.",
                },
              ],
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skill and mana." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 skills and the resistances that keep you standing in your own damage.",
            },
          ],
        },
      ],
      charms: [
        {
          ref: { kind: "unique", slug: "flame-rift" },
          why: "Fire Sunder. Carried until an Infinity exists, and often afterwards too.",
        },
        {
          label: "Elemental skillers with life",
          why: "+1 to the Elemental tree is +1 to five maxed skills at once. This build has more maxed skills in one tree than anything else on the site, so a skiller is worth more here than anywhere.",
          lookFor: ["+1 Elemental Skills", "+life", "+fire resistance on small charms"],
        },
      ],
      weaponSwap: [
        {
          ref: { kind: "runeword", slug: "call-to-arms" },
          why: "Battle Orders. The class's life per Vitality is 2; a third more of it is not optional in Hell.",
        },
      ],
      nextUpgrade:
        "Infinity on the mercenary. It replaces the Sunder Charm, frees the charm slot, and lowers the resistance of everything rather than only the immune.",
    },

    {
      tier: "optimized",
      goal: "Terror Zones at players 8 with fire immunity solved by the mercenary rather than by a charm.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "Unchanged. Skills, cast rate and resistances in one hand.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "In a Monarch, rolled high on cast rate.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +3 Fissure, +2 Druid skills and 2 sockets",
              why: "Five effective levels on the main skill plus two resistance jewels. The largest single upgrade the build has left.",
              tradeOnly: true,
              alternatives: [
                { ref: { kind: "unique", slug: "harlequin-crest" }, why: "Never a mistake." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport, on a build that has to reposition to re-place its damage.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 Fire Skills, 20% cast rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skill, 20% cast rate." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Hit recovery and Vitality." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skill and mana." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "A rare amulet with +2 Druid skills, 10% Faster Cast Rate and two resistances",
              why: "The class-specific roll beats Mara once resistances are capped elsewhere.",
              tradeOnly: true,
              alternatives: [
                { ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "The safe answer." },
              ],
            },
          ],
        },
      ],
      charms: [
        {
          label: "Anni, Torch and nine Elemental skillers",
          why: "With Infinity on the mercenary, the Sunder Charm comes out and this is what replaces it. The Torch's +3 Druid skills is three levels on five maxed skills.",
        },
        {
          ref: { kind: "unique", slug: "flame-rift" },
          why: "Kept in the stash rather than the inventory. Infinity covers immunity while the mercenary is alive; the charm covers it when he is not.",
        },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders before every run." },
      ],
      nextUpgrade: "Nothing structural. The remaining upgrades are rolls, not items.",
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
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "In the lightest 4-socket base available.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "In a Monarch at 35% cast rate.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "stormshield" },
                  why: "The Hardcore trade: 35% damage reduction and maximum block, for every offensive line on the Spirit.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A +3 Fissure, +2 Druid skills pelt with two 15% all-resistance jewels",
              why: "Five effective levels and thirty resistances in one slot.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "+65 all resistances and 8% damage reduction, when a party carries the movement.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 Fire Skills, 20% cast rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skill, 20% cast rate." }],
        },
        {
          slot: "boots",
          picks: [
            { ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Hit recovery, Vitality, poison length." },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skill and mana." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "A rare +2 Druid skills, 10% Faster Cast Rate amulet with two resistances",
              why: "The hardest item on the list to find and the last one to arrive.",
              tradeOnly: true,
            },
          ],
        },
      ],
      charms: [
        {
          label: "Anni, Torch and nine Elemental skillers with life",
          why: "Twelve effective skill levels across five maxed skills, plus the life the build is short of.",
        },
      ],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
      notes:
        "**The last upgrade is the mercenary's, not yours.** An Infinity is worth more to this build than any remaining change to your own gear, because it lowers the resistance of everything rather than raising the damage against what was already dying.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Act 2 Desert Mercenary, Insight while levelling and **Infinity** as the endgame goal. Conviction lowers enemy fire resistance by a large amount and, crucially, applies at one fifth strength to a monster whose immunity has been broken — so an Infinity plus a Flame Rift is far more than either alone. Might is the alternative aura in Nightmare and does nothing for your fire damage; take it only if the mercenary's own kills matter to you. A Holy Freeze mercenary is the Hardcore choice, and slowing a pack that is walking into a Fissure is worth more here than on most builds.",

  farming: [
    {
      area: "countess",
      difficulty: "nightmare",
      why: "The runes that build Leaf, Lore, Stealth, Ancients' Pledge and eventually Spirit. A Fissure in the tower corridor kills everything before it reaches you.",
      minTier: "starter",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Level 85, dense, and reachable early. The skeletons and zombies here are not fire immune, which makes it the natural first Hell area for this build.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Level 85 and the best item density in Act 1. Fissure covers the whole room; the fire immunes in it are the reason a Flame Rift is on the charm list.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "One monster type, no fire immunity, and density that no other area matches. It is the purest expression of what this build does.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "The best experience in the game, and three floors of packed corridors that ground damage was made for. Wants a Sunder Charm or an Infinity first.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Fire immunity is thickest here, so this is the area that measures whether the immunity plan is real. With Infinity it is one of the fastest runs the build has.",
      minTier: "optimized",
      rating: 4,
    },
  ],

  immunityPlan:
    "**Fire immunity is the build's defining problem and it has three answers, in this order.** First, the physical damage underneath: Molten Boulder, Volcano and Armageddon each carry a physical table as well as a fire one, so a fire immune is slowed rather than stopped — this build is never *unable* to kill, only slow. Second, a **Flame Rift** Sunder Charm, which sets a fire immunity to 95% resistance instead and is the cheapest complete answer. Third, **Infinity** on the mercenary, which lowers the resistance of everything rather than only the immune, applies at one fifth strength on top of a broken immunity, and frees the charm slot. Cold, lightning and poison immunes are irrelevant to this character.",

  hardcoreNotes:
    "Playable but less forgiving than the Wind Druid, for one structural reason: your damage does not move and you have to be near it. Cyclone Armor is worth more than its one point suggests, Oak Sage is not optional, and a Holy Freeze mercenary buys the distance that a Wind Druid gets from Hurricane's chill. Do not clear Chaos Sanctuary until fire immunity has a real answer — a slow kill in a room full of Oblivion Knights is how this build dies.",

  selfFoundNotes:
    "Strong, because the two items that matter most are a two-rune staff and a Countess runeword. Leaf carries the character through Normal, Ancients' Pledge through Nightmare, and Fissure needs nothing at all to function. The wall is Hell fire immunity: without a Flame Rift or an Infinity, a self-found Fire Druid has areas it should simply not run. That is the honest reason this build is rated below the Wind Druid for solo self-found despite clearing faster.",

  levelingPath: {
    summary:
      "This *is* the leveling build for the class. Firestorm from level 1, Molten Boulder at 6, Fissure at 12, and that carries a Druid to Nightmare Act 3 with no gear beyond a Leaf staff. Most players then respec into the wind tree; staying fire is a legitimate choice that costs a Sunder Charm.",
    respecAt:
      "Optional. If you are staying fire, none — the leveling points are the build's points. If you are moving to the wind tree, Nightmare Act 3 at roughly level 38.",
  },

  confidence: "verified",
  complete: true,
};
