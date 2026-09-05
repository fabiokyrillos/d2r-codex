import type { Build } from "@/lib/types";

/**
 * The Summon Druid — the third tree, and the only Druid build that is not
 * about the Druid.
 *
 * Three columns shape it, and all three are unusual.
 *
 *   **The tree buffs itself through *effective* level, not hard points.**
 *   Summon Dire Wolf adds life to the spirit wolves and Summon Grizzly adds
 *   damage to both kinds, and both read the level your gear gives you rather
 *   than the points you spent. A +3 Summoning pelt therefore raises those
 *   bonuses, which is exactly what a synergy does not do. It is why this build
 *   chases +skills harder than any other Druid and why its skill plan has no
 *   synergy section worth the name.
 *
 *   **One spirit at a time, and one vine at a time.** Oak Sage, Heart of
 *   Wolverine and Spirit of Barbs share a single slot; the three creepers share
 *   another. Half the tree is mutually exclusive with the other half, and the
 *   page below is mostly about which half to have out.
 *
 *   **Raven is the one skill here that receives real synergies** — 12% per hard
 *   point from each of the three animal summons, which a finished Summoner has
 *   already bought three times over. That is the one place spare points have a
 *   multiplier waiting for them.
 */
export const summonDruid: Build = {
  slug: "summon-druid",
  name: "Summon Druid",
  classSlug: "druid",
  summary:
    "A bear that taunts, eight wolves that do not die, and a Druid who stands behind them. The class's answer to playing Hell without being hit.",
  damageTypes: ["physical", "cold"],
  primarySkill: "summon-grizzly",
  playstyle:
    "You summon a bear, three dire wolves, five spirit wolves and five ravens, put a spirit down, and then walk forward. The Grizzly taunts, so the pack goes to it; the dire wolves howl, which scatters what the bear has not taken; the spirit wolves chill everything they bite. Your own job is positioning and re-summoning — you decide where the fight happens by choosing where to stand, and you spend the fight watching a health bar that is not yours. It is the least twitchy build on the site and the most patient. Nothing dies quickly, and almost nothing kills you.",
  strengths: [
    "The safest build the Druid has, and one of the safest in the game — the bear is between you and everything",
    "Minions carry up to 85% elemental resistance, which no Necromancer skeleton ever gets",
    "Every summon inherits your physical-immunity piercing, so one Sunder Charm arms the whole army",
    "Two damage types without trying: the wolves and bear are physical, the spirit wolves add cold",
    "Scales with +skills rather than with points, so a single pelt upgrade is worth more than a level",
  ],
  weaknesses: [
    "Slow. Nothing about eight minions chewing through a Hell pack is fast",
    "You have almost no personal damage — losing the army mid-fight means running away",
    "The Grizzly cannot be re-summoned while it lives, so a dying bear cannot be topped up",
    "Half the tree is mutually exclusive with the other half; a spirit and two vines sit unused",
    "Minion pathing is the real difficulty setting, and narrow corridors are where it shows",
  ],
  difficulty: "beginner",
  budget: "low",
  ratings: {
    clearSpeed: 2,
    bossing: 3,
    survivability: 5,
    magicFind: 4,
    terrorZones: 3,
    ubers: 2,
    soloSelfFound: 5,
    players8: 3,
  },

  skills: [
    {
      skill: "summon-grizzly",
      points: 20,
      role: "main",
      order: 1,
      note: "One bear, and it is the tree's damage. Its +25% and 10% per level is given to **both kinds of wolf as well**, through effective level — which is why a skill that summons a single minion is the first thing maxed.",
    },
    {
      skill: "summon-dire-wolf",
      points: 20,
      role: "main",
      order: 2,
      note: "Three wolves on a cap of their own, and +50% life and 15% per level handed to the spirit wolves too. Maxing it makes eight minions tougher, not three.",
    },
    {
      skill: "summon-spirit-wolf",
      points: 20,
      role: "main",
      order: 3,
      note: "Five wolves with cold damage that chills, and 5% elemental resistance per level to a cap of 85%. The resistance is why this army survives Hell where a skeleton army does not.",
    },
    {
      skill: "heart-of-wolverine",
      points: 20,
      role: "utility",
      order: 4,
      note: "+153% enhanced damage and +158% attack rating to every minion at twenty. It is the army's damage, and it is the reason this is maxed before the second spirit.",
    },
    {
      skill: "oak-sage",
      points: 20,
      role: "utility",
      order: 5,
      note: "+125% maximum life to you, the mercenary and every minion. **Only one spirit can be out at a time**, so these twenty points buy a switch rather than a stack — see the flexible points before spending them.",
    },
    {
      skill: "raven",
      points: 1,
      role: "prerequisite",
      note: "Five birds that blind and cannot be killed by monsters; each leaves after 12 hits plus one per level. The only skill in this tree that receives synergies — 12% a point from each of the three animal summons.",
    },
    {
      skill: "poison-creeper",
      points: 1,
      role: "prerequisite",
      note: "The first of the three vines, and the way to reach the two that matter.",
    },
    {
      skill: "carrion-vine",
      points: 1,
      role: "utility",
      note: "Heals you for 4% of each corpse it eats, plus 1% per level. This is the vine that is normally out: on a build with no leech and no healing skill, free life from corpses is the whole sustain plan.",
    },
    {
      skill: "solar-creeper",
      points: 1,
      role: "flex",
      note: "The mana version of the same vine, and worse here — a Summoner's limit is not mana. One point so the choice exists.",
    },
    {
      skill: "spirit-of-barbs",
      points: 1,
      role: "flex",
      note: "Returns 32% of melee damage at level 1. The third spirit, and the one you almost never have out; it earns its point in a party where somebody else is tanking.",
    },
  ],
  flexPoints: [
    "Five points are spare at level 99, and **Raven is where they earn the most**. It is the only skill in this tree that takes real synergies, and a finished Summoner has already maxed all three sources — so a point in Raven arrives on top of 36% per level of synergy that is already paid for.",
    "**If you would rather not spend twenty points on a spirit you are not using**, leave Oak Sage at one and put those twenty into Raven instead. That is a coherent, cheaper build, and it trades a large life bonus for birds that blind.",
    "**Spirit of Barbs is not a third option, it is a party option.** With one spirit slot, taking it means giving up either the life or the damage, and neither trade is worth it solo.",
    "Do not spend points on your own attack. A half-invested Firestorm or Tornado is not a plan on 110 points that already have five homes.",
  ],
  stats: {
    strength: "Enough for your gear. This build wears the lightest armour of any Druid because nothing hits it.",
    dexterity: "Base. There is no attack to land and no block worth buying.",
    vitality: "Everything else, and Oak Sage multiplies it.",
    energy: "None. Re-summoning is occasional, not continuous.",
    notes: [
      "This is the one Druid build whose stat page is genuinely boring, and that is a feature: with no weapon requirement and no cast-rate target, Strength and Dexterity stop at whatever the armour asks for.",
      "**Skill levels are the stat that matters, and they are bought with items.** The mutual bonuses inside this tree read effective level, so +3 to Summoning on a pelt raises the Grizzly's damage bonus, the dire wolves' life bonus and the minion resistances all at once — three separate numbers from one affix.",
      "Life still matters, because a Druid whose bear has died is a Druid in melee range with no melee skills. Oak Sage's +125% applies to the character as well as the army.",
      "Faster Cast Rate is worth a little and only a little: it is the speed at which you rebuild the army after a bad fight, not a number you fight at.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 68,
      frames: 12,
      why: "The re-summoning breakpoint. It is not a damage number — it is how long you spend standing still after the bear dies, which on this build is the most dangerous moment of any fight.",
      priority: "recommended",
    },
    {
      stat: "fcr",
      value: 30,
      frames: 14,
      why: "A realistic waypoint while levelling. A Stealth alone is 25% and any cast-rate ring finishes it.",
      priority: "recommended",
    },
    {
      stat: "fhr",
      value: 56,
      frames: 7,
      why: "The usual target on the Necromancer/Druid table. You are not supposed to be hit, and hit recovery is what covers the times you are.",
      priority: "recommended",
    },
  ],
  breakpointNotes:
    "Both tables here are the **human-form** ones, which is correct for this build and would not be for the shapeshifting Druids: this character never shifts. There is no attack-speed row because you never attack.",

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 30 and the Grizzly. Everything before that is three wolves and a lot of patience.",
      levelRange: [1, 40],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "leaf" },
              why: "Two runes in a staff for +3 to fire skills — worthless here. Mentioned only so you do not make it: this build wants +Summoning, and a shopped staff with +Summoning skills beats any two-rune word before level 25.",
              alternatives: [
                {
                  label: "A shopped staff or wand with +3 to a Summoning skill",
                  why: "Akara and Drognan stock these. +3 Summon Spirit Wolf at level 12 is three wolves you would not otherwise have for another six levels.",
                  lookFor: ["+3 to Summon Spirit Wolf", "+3 to Summon Dire Wolf", "+2 Druid Skills"],
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
              why: "+1 to all skills for Ort + Sol, and on a Druid pelt it stacks with the pelt's own roll. On this build a skill level is worth more than on any other Druid, because three of the tree's bonuses read effective level.",
              sockets: "Ort + Sol in a 2-socket Druid pelt.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "Cast rate, hit recovery and run speed from level 17 for two common runes. The run speed is the one that matters: you spend the game walking to where the army is winning.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              label: "Any boots with faster run/walk and resistances",
              why: "Nothing exotic, and nothing this build will miss when it replaces them.",
              lookFor: ["Faster run/walk", "Fire and lightning resistance"],
            },
          ],
        },
      ],
      nextUpgrade:
        "Level 30. The Grizzly is the moment this stops being a slow character and becomes a safe one.",
      notes:
        "**Spend the first thirty levels going down the middle column and do not be tempted sideways.** Raven at 1, Spirit Wolf at 6, Oak Sage at 6, Dire Wolf at 18, Grizzly at 30 — every one of those is a prerequisite for the next, so there is no wasted point on the way and no respec at the end.",
    },

    {
      tier: "nightmare",
      goal: "Nightmare cleared with the whole army out and a mercenary who is not dying.",
      levelRange: [40, 65],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 to all skills, 35% cast rate and a large mana pool for four Countess runes. +2 to all skills is +2 to five maxed summoning skills at once, which is the single biggest jump this build gets before Hell.",
              sockets: "Tal + Thul + Ort + Amn in a 4-socket Crystal Sword or Broad Sword.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "+50% to all resistances for three Countess runes. This build has no damage problem it can solve with a shield, so the shield's job is resistances.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "spirit" },
                  why: "A second Spirit in a Monarch is +4 to all skills across the pair. The 156 Strength is real and this build has fewer competing demands for attributes than any other Druid.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +2 Druid skills and +3 to Summoning skills",
              why: "The most valuable item on this page. A +3 Summoning roll raises the Grizzly's damage bonus, the dire wolves' life bonus and every minion resistance at the same time, because all three read effective level.",
              lookFor: ["+2 Druid Skills", "+3 to Summoning Skills", "+3 to Summon Grizzly", "Life"],
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "lore" },
                  why: "Until one drops. Charsi's imbue on a white Druid pelt after level 30 is the deliberate way to get one rather than hoping.",
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
              why: "+1 to all skills, cast rate and up to 35 all resistances in one common unique. It is close to best-in-slot for a long time on a build that wants exactly those three lines.",
              sockets: "One socket: a perfect diamond, or an Um.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "nightsmoke" },
              why: "Resistances and 50% of damage taken from mana. On a build with a Spirit's mana pool and nothing to spend it on, that is a genuine defensive line.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "waterwalk" },
              why: "+65 life and 15 Dexterity. Life is what keeps you alive in the seconds after the bear dies.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "stone-of-jordan" },
              why: "+1 to all skills and mana. One skill level on this build is five bonuses at once.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "A rare or crafted amulet with +2 Druid skills",
              why: "+2 Druid skills is worth more here than +2 to a single tree elsewhere, because every one of this build's five maxed skills is in the same tree.",
              lookFor: ["+2 Druid Skills", "+3 to Summoning Skills", "All resistances", "Life"],
            },
          ],
        },
      ],
      nextUpgrade:
        "A physical Sunder Charm, and the pelt. Those two together are most of the distance between Nightmare and comfortable Hell.",
      notes:
        "**Summon in this order: Ravens, spirit wolves, dire wolves, Grizzly, spirit, vine.** The Grizzly cannot be re-summoned while it lives, so it goes last — if you cast it first and then lose a wolf, you rebuild around a bear that is already damaged.",
    },

    {
      tier: "early-hell",
      goal: "Hell entered. Minion resistances are already capped by the skills; yours are not, and that is the job here.",
      levelRange: [65, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Unchanged. There is no weapon upgrade for a character who never attacks until Heart of the Oak, and that one is a luxury rather than a step.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "The second Spirit. +4 to all skills across the pair is four effective levels on every bonus in the tree.",
              sockets: "The same four runes in a 4-socket Monarch. A smaller 4-socket base is a legitimate compromise if the Strength is not there.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +3 Summoning skills and two sockets",
              why: "Two 15% all-resistance jewels is how this build caps its own resistances without giving up the skill roll.",
              lookFor: ["+2 Druid Skills", "+3 to Summoning Skills", "2 sockets"],
              sockets: "Two 15% all-resistance jewels.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "Still correct, and still cheap. Replace it only when a Chains of Honor or an Enigma exists.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Any gloves with +2 Summoning skills",
              why: "Druid gloves do not roll class skills, so this is a rare or magic glove with the generic roll — worth hunting precisely because it is one of the few slots left that can carry one.",
              lookFor: ["+2 to Summoning Skills", "All resistances", "Life"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Physical damage reduced, for the moments when something has walked past the bear.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "war-traveler" },
              why: "Magic find and Strength. This build farms rather than kills quickly, and magic find is the point of farming.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              ref: { kind: "unique", slug: "raven-frost" },
              why: "Cannot be frozen. A frozen Summoner is a Summoner who cannot re-cast the bear.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 skills and +20 all resistances, which is both of this tier's jobs in one slot.",
            },
          ],
        },
      ],
      charms: [
        {
          ref: { kind: "unique", slug: "bone-break" },
          why: "**Physical Sunder, and it arms the whole army.** Every summon reads the character's accumulated pierce, so one charm in your inventory is what lets eight minions hurt a physical immune. Only one Sunder Charm can be held at a time.",
        },
        {
          label: "Summoning skillers with life",
          why: "+1 effective level to five maxed skills each. No other class has an inventory affix this efficient.",
        },
      ],
      nextUpgrade: "The last skill levels: a Torch, an Anni, and a pelt that rolled well.",
    },

    {
      tier: "budget",
      goal: "Hell farmed on repeat. The army holds, and you are chasing magic find rather than survival.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Two Spirits are +4 to all skills for eight common runes, and this build converts skill levels into three separate bonuses.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "The pair, in a Monarch.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "lidless-wall" },
                  why: "+1 to all skills and mana, on a shield with no Strength requirement worth mentioning. A real alternative when the Monarch is out of reach.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +3 Summoning skills, +2 Druid skills and two sockets",
              why: "Five effective levels on every skill in the army, from one slot.",
              tradeOnly: true,
              alternatives: [
                {
                  ref: { kind: "unique", slug: "harlequin-crest" },
                  why: "+2 to all skills, +life, +mana and 50% magic find. On a build that farms, it is a serious competitor to a pelt and it is far easier to find.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 to all skills, +65 all resistances and 8% damage reduction. It is the body armour this build wants above every other, because two of its three lines are things the build cannot buy elsewhere.",
              sockets: "Dol + Um + Ber + Ist in any 4-socket body armour.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
                  why: "Still fine. The Ber is the expensive part of Chains of Honor and this build survives without it.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare gloves with +2 Summoning skills and resistances",
              why: "Two more effective levels. Keep hunting this slot; it is the cheapest +skills left.",
              lookFor: ["+2 to Summoning Skills", "All resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduced." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find, and Strength you can spend." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "A rare amulet with +2 Druid skills and two resistances",
              why: "Beats Mara once resistances are capped, because the class roll is worth more than the generic one.",
              alternatives: [
                { ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "Never wrong." },
              ],
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "bone-break" }, why: "Physical Sunder, inherited by every minion." },
        {
          label: "Anni, Torch and Summoning skillers",
          why: "The Torch's +3 Druid skills is three effective levels on all five maxed skills at once.",
        },
      ],
      nextUpgrade: "Enigma, and the ability to put the army where you want it rather than where it walked.",
    },

    {
      tier: "optimized",
      goal: "The army is finished. What is left is moving it faster and finding more.",
      levelRange: [85, 95],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "+3 to all skills, 40% cast rate and +30–40 all resistances. Three skill levels beats two, and the resistances free the helm to be a pelt again.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "spirit" },
                  why: "One skill level cheaper by an enormous margin. This is a luxury upgrade, not a required one.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills and cast rate, in a Monarch." }],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A +3 Summoning, +2 Druid skills pelt with two 15% all-resistance jewels",
              why: "The largest single upgrade left, and the hardest to find.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport. On a build whose real cost is walking to the fight, it is the largest quality-of-life change available — and the army follows you when you teleport.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "+2 skills and +65 resistances instead. Strictly more powerful and strictly slower.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare gloves with +2 Summoning skills",
              why: "Two effective levels; nothing catalogued competes.",
              lookFor: ["+2 to Summoning Skills", "All resistances", "Life"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to all skills, and cast rate." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find on a farming build." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "A rare amulet with +2 Druid skills, cast rate and two resistances",
              why: "The best amulet in the game for this build.",
              tradeOnly: true,
              alternatives: [
                { ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +20 resistances." },
              ],
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "bone-break" }, why: "Physical Sunder, inherited by every minion." },
        {
          label: "Anni, Torch and nine Summoning skillers with life",
          why: "Twelve effective levels across the army from the inventory alone.",
        },
      ],
      weaponSwap: [
        {
          ref: { kind: "runeword", slug: "call-to-arms" },
          why: "Battle Orders raises your life and the mercenary's. It does **not** reach the minions — their life comes from the skills and from Oak Sage.",
        },
      ],
      nextUpgrade: "Nothing structural. From here it is better rolls on the same items.",
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
              why: "+3 to all skills and cast rate, in the lowest-requirement base available.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "In a Monarch, rolled high." }],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A +3 Summoning, +2 Druid skills pelt with two 15% all-resistance jewels",
              why: "Five effective levels and thirty resistances. There is no unique helm that competes on this build.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, and the army comes with you." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare gloves with +2 Summoning skills and 20 all resistances",
              why: "Two effective levels and a resistance slot.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "A second one. Nothing else in the slot gives a skill level." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "A rare amulet with +2 Druid skills, 10% cast rate and two resistances",
              why: "The last item on the list, and the hardest one.",
              tradeOnly: true,
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "bone-break" }, why: "Physical Sunder." },
        {
          label: "Anni, Torch and nine Summoning skillers with life",
          why: "The finished inventory.",
        },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders for you and the mercenary." },
      ],
      notes:
        "**Two Stone of Jordans is not a mistake.** Raven Frost's cannot-be-frozen is real value, but on a build whose every number is a function of skill level, two rings that each give one are worth more than one ring that gives one and a freeze immunity you can buy on a charm.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "An **Act 2 Desert Mercenary with Might**, because a mercenary aura reaches the minions and Might's enhanced damage is the one aura that raises what eight physical attackers already do. It stacks with Heart of Wolverine — they are separate sources of enhanced damage, and the army takes both. **Insight is the alternative and it is a worse fit here than almost anywhere else**: this build does not cast continuously and does not run out of mana. At the top end the mercenary carries **Pride**, whose Concentration aura is a larger enhanced-damage number than Might. Give it **Fortitude** and let it live; a dead mercenary is an aura the whole army stops receiving.",

  farming: [
    {
      area: "countess",
      difficulty: "nightmare",
      why: "The runes for two Spirits, on a short run that an army of eight walks through without you needing to be good at anything yet.",
      minTier: "starter",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Level 85, dense and undead — exactly the kind of pack a taunting bear turns into a queue. The first Hell area this build should own.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Level 85 with the best item density in Act 1, and the mixed packs there are where minion resistances of 85% stop being a statistic.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Level 85 with no cold immunes, which means the spirit wolves' chill lands on everything and the pack arrives at the bear slowed.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Nothing is immune to physical and the density is absurd. The one caution is the density itself: a herd that surrounds the bear will reach you.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "lower-kurast",
      difficulty: "hell",
      why: "Chests rather than monsters, which suits a build that farms slowly. The army handles the little that fights back.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "The best experience in the game, and safe here in a way it is not for most builds. Slow — this is where the build's clear speed is felt.",
      minTier: "budget",
      rating: 3,
    },
  ],

  immunityPlan:
    "**The army deals physical, so physical immunity is the question — and the answer reaches the minions, which is unusual.** Every Druid summon reads the character's accumulated immunity-piercing stat, so a **Bone Break** in *your* inventory is what lets *their* attacks land on a physical immune. That is the whole plan, and it is one charm. The spirit wolves' cold damage covers a little more ground on its own, and a monster immune to both physical and cold is one to walk past rather than to gear against. What does not help is a −% to Enemy Resistance line on your own gear: item pierce is applied after the immunity check, and that step is skipped while the immunity stands, so against an immune it is absent rather than weak. Once the Sunder Charm has broken the immunity, everything else lands on the result at full value.",

  hardcoreNotes:
    "The standard Hardcore Druid, and arguably the standard Hardcore character. You are never in melee range, the bear taunts what would reach you, and the minions carry more elemental resistance than you do. Take **Oak Sage** as the spirit rather than Heart of Wolverine — the +125% life applies to you as well as the army, and this build has damage to spare and no margin. The two real risks are both about the army being gone: a Grizzly that dies mid-fight cannot be re-summoned until it does, and an Iron Maiden from an Oblivion Knight kills your own minions with their own damage. Keep a town portal open and treat a dead bear as a reason to leave rather than a reason to re-cast.",

  selfFoundNotes:
    "The best solo self-found build the Druid has, and one of the two or three best in the game. Nothing in the skill plan needs an item to function: eight minions with capped elemental resistance exist at level 30 with zero gear. Everything in the first three gear tiers is a Countess rune, a vendor purchase or a common unique, and the one item worth planning for — a Druid pelt with +3 Summoning — comes from Charsi's imbue on a white pelt after level 30 rather than from luck. The single genuine gap is the Sunder Charm: without one, a physical immune is a pack you leave, and Terror Zones are where you will find one.",

  levelingPath: {
    summary:
      "There is no respec and no detour. Raven at 1, Spirit Wolf at 6, Oak Sage at 6, Dire Wolf at 18, Heart of Wolverine at 18 and Grizzly at 30 form one straight line in which every skill is the prerequisite of the next — so the character you level is the character you finish with, and points spent at level 6 are still working at level 99.",
    respecAt: "None. This is the only Druid build on the site that never needs one.",
  },

  confidence: "verified",
  complete: true,
};
