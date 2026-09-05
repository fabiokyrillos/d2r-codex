import type { ProgressionJourney } from "@/lib/types";

/**
 * The Druid's journey: Fire to level 38, one respec, Wind to the end.
 *
 * The arithmetic below closes exactly, and it has to, because the respec is the
 * whole point of the route. A character has `level - 1` points from levelling
 * and 4 more per difficulty from quests — Den of Evil 1, Radament 1, Izual 2.
 *
 *   level 13, Den of Evil done          12 + 1  = 13   Firestorm 10, Molten
 *                                                      Boulder 1, Fissure 2
 *   level 26, Normal quests done        25 + 4  = 29   Fissure 18
 *   level 38, Nightmare Den + Radament  37 + 6  = 43   Fissure 20, Volcano 12
 *
 * At the respec all 43 come back, and 43 is exactly what the wind opening
 * costs: Arctic Blast 1, Cyclone Armor 1, Twister 1, Tornado 20, Hurricane 20.
 * There is no point left over and none missing, which is the reason the respec
 * is placed at Nightmare Act 3 rather than wherever the fire damage happens to
 * run out.
 *
 *   level 60, + Nightmare Izual, Hell Den + Radament   26 more
 *   level 75, + Hell Izual                             17 more
 *
 * 43 + 26 + 17 = 86, and a level-75 character with every quest done has
 * 74 + 12 = 86. The remaining 24 to level 99 are the build's flex points.
 */
export const druidJourney: ProgressionJourney = {
  classSlug: "druid",
  targetBuild: "wind-druid",
  summary:
    "Level on fire, respec once at Nightmare Act 3, and finish on wind. The two halves of the elemental tree share no synergy, so this is a real change of character rather than a re-spend.",
  overview: [
    "**You do not level as a Wind Druid.** Tornado unlocks at 24 and Hurricane at 30, and neither is worth anything until Cyclone Armor and Twister are behind them — sixty points later. Trying to play the wind tree from level 24 is the most common reason a new Druid concludes the class is weak.",
    "Level on fire instead. Firestorm works from level 1, Molten Boulder at 6, and Fissure at 12 carries the character to the middle of Nightmare with no gear beyond a two-rune staff. Then respec, once, into the wind tree — the Den of Evil gives a free token in every difficulty, so it costs nothing.",
    "**The respec is at Nightmare Act 3, before Mephisto, at roughly level 38.** That is not a feel: 43 points is exactly what the wind opening costs, and 43 is exactly what a level-38 character with the Nightmare Den of Evil and Radament rewards has. Respec earlier and Hurricane is not maxed; respec later and you have spent levels on a tree you are about to abandon.",
    "If you would rather stay fire, that is a real choice and this site documents it as a build. It costs a Flame Rift Sunder Charm or an Infinity, because fire is the most resisted element in Hell. The wind route costs neither, which is why it is the default here.",
    "The other thing to internalise early: **resistances, not damage, are what stop you**. Nightmare applies -40% to all of yours and Hell -100%. Plan for that before Act 5 of Nightmare, not after.",
  ],
  respecPlan: [
    {
      at: "Nightmare Act 3, roughly level 38 — the Den of Evil token",
      why: "The one respec the route needs. Fire out, wind in, and the point total lands exactly on Tornado 20 plus Hurricane 20 plus three prerequisites.",
    },
    {
      at: "Optional — Hell Act 1",
      why: "Keep the Hell Den of Evil token in reserve. If the level-38 respec left you awkwardly split, this is a clean second try, and you still have the Normal token untouched.",
    },
  ],
  stages: [
    {
      slug: "druid-act-1-normal",
      name: "Three waves of fire",
      classSlug: "druid",
      summary: "Levels 1-13. Firestorm from the first point, and Fissure by the end of the act.",
      levels: [1, 13],
      difficulty: "normal",
      location: "Act 1 — Blood Moor through the Catacombs",
      goal: "Clear the Den of Evil, buy a Leaf staff, and reach Fissure at 12.",
      killingWith: "Firestorm, cast down a corridor and left to crawl.",
      skillPoints: [
        "**Firestorm to 10** — one point per level from 2 to 11, plus the Den of Evil reward.",
        "**Molten Boulder 1** at level 6. One point only. It is a prerequisite and a knockback, not damage.",
        "**Fissure 2** at levels 12 and 13. Everything from here goes into it.",
        "That is 13 points: 12 from levels 2-13, and 1 from the Den of Evil.",
      ],
      statPoints: [
        "Everything into **Vitality** until something you want to wear says otherwise.",
        "No Energy. The Druid has no Warmth and mana potions are free.",
      ],
      actions: [
        {
          kind: "quest",
          text: "Clear the **Den of Evil** for the skill point and the free respec token. Keep the token.",
        },
        {
          kind: "shop",
          text: "Buy a 2-socket staff from Akara and make **Leaf** in it: +3 to Fire Skills for two common runes. On this build that is +3 Fissure, +3 Firestorm and +3 Molten Boulder at once. Make it the moment the runes drop, but note you cannot wield it until level 19.",
          refs: [{ kind: "runeword", slug: "leaf" }],
          atLevel: 12,
        },
        {
          kind: "farm",
          text: "Run **the Countess** for Tal, Eth, Ith, Ral, Ort and Sol. They build Leaf, Stealth, Lore and eventually Ancients' Pledge.",
          refs: [{ kind: "runeword", slug: "stealth" }, { kind: "runeword", slug: "lore" }],
        },
        {
          kind: "tip",
          text: "Molten Boulder's knockback is worth more than its damage at this level. Use it to buy the distance to keep casting.",
        },
        {
          kind: "warning",
          text: "Do not spend a point on Werewolf or Werebear \"just in case\". A single point in a form you are not building is a point Fissure needed.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "leaf" },
          why: "The most efficient item this character ever equips, and it is available at level 19 in a staff you buy.",
        },
        {
          ref: { kind: "runeword", slug: "stealth" },
          why: "Faster cast rate, faster hit recovery and run speed from level 17, for two Countess runes.",
        },
      ],
      exitCriteria: "Andariel is dead and Fissure is on the bar.",
      order: 1,
    },

    {
      slug: "druid-acts-2-5-normal",
      name: "The ground does the work",
      classSlug: "druid",
      summary: "Levels 13-26. Fissure to 18, and Normal finished on it.",
      levels: [13, 26],
      difficulty: "normal",
      location: "Acts 2 to 5 — Lut Gholein through the Worldstone Keep",
      goal: "Max Fissure as far as the level allows, and hire the mercenary you will keep.",
      killingWith: "Fissure in every doorway, and Firestorm on whatever survives it.",
      skillPoints: [
        "**Everything into Fissure**, from 2 to 18.",
        "That is 16 points: 13 from levels 14-26, plus Radament and Izual.",
        "Nothing goes into Volcano yet — it unlocks at 24, and Fissure is still the better point until it is maxed.",
      ],
      statPoints: [
        "**Vitality**, with just enough Strength for the armour you are actually wearing.",
        "Dexterity stays at base.",
      ],
      actions: [
        {
          kind: "mercenary",
          text: "Hire the **Act 2 Desert Mercenary** with the Defiance aura in Normal. He is the one you keep for the rest of the game.",
          refs: [],
        },
        {
          kind: "quest",
          text: "**Radament** in Act 2 and **Izual** in Act 4 are three more skill points. Do not skip them.",
        },
        {
          kind: "quest",
          text: "**Lam Esen's Tome** in Act 3 is five stat points, in every difficulty.",
        },
        {
          kind: "runeword",
          text: "Make **Lore** in a 2-socket helm as soon as an Ort and a Sol exist. On a Druid pelt it stacks with the pelt's own +skills.",
          refs: [{ kind: "runeword", slug: "lore" }],
        },
        {
          kind: "tip",
          text: "Fissure opens vents across a radius of 7 and they fire on a delay. Place it where a pack has to walk, not where the pack is standing.",
        },
      ],
      exitCriteria: "Baal is dead and Fissure is at 18.",
      order: 2,
    },

    {
      slug: "druid-nightmare-early",
      name: "Volcano, and the last of the fire",
      classSlug: "druid",
      summary: "Levels 26-38. Fissure maxed, Volcano to 12, and the respec waiting at the end.",
      levels: [26, 38],
      difficulty: "nightmare",
      location: "Nightmare Acts 1 to 3 — up to the gates of Travincal",
      goal: "Reach level 38 with resistances holding, and stop before Mephisto.",
      killingWith: "Fissure, with Volcano under anything that stands still.",
      skillPoints: [
        "**Fissure 18 to 20** — two points.",
        "**Volcano to 12** with the remaining twelve.",
        "That is 14 points: 12 from levels 27-38, plus the Nightmare Den of Evil and Radament.",
        "It does not matter much where these land, because all 43 come back in the next stage. Volcano is simply the strongest thing to be holding when they do.",
      ],
      statPoints: [
        "**Vitality**, and enough Strength for a Monarch if you intend to run two Spirits after the respec — 156 is a large bill and it is cheaper to start paying it now.",
      ],
      actions: [
        {
          kind: "warning",
          text: "**Nightmare applies -40% to all your resistances.** Fix this in Act 1, not in Act 5. Ancients' Pledge in a shield is +50% all resistances for three Countess runes.",
          refs: [{ kind: "runeword", slug: "ancients-pledge" }],
        },
        {
          kind: "runeword",
          text: "Make **Spirit** in a 4-socket sword the moment Tal, Thul, Ort and Amn exist. 35% faster cast rate and +2 to all skills is the item the whole second half of this journey is built on.",
          refs: [{ kind: "runeword", slug: "spirit" }],
          atLevel: 25,
        },
        {
          kind: "gear",
          text: "After level 30, use **Charsi's Imbue on a white Druid pelt**. It is the most reliable +2 Druid skills helm a self-found character will ever see.",
          atLevel: 30,
        },
        {
          kind: "quest",
          text: "Take the **Nightmare Den of Evil** reward but keep the respec token — you are about to need it.",
        },
        {
          kind: "tip",
          text: "Do not fight Mephisto yet. The next stage is a different character.",
        },
      ],
      exitCriteria:
        "Level 38, standing in Kurast, with the Nightmare Den of Evil respec token unspent.",
      order: 3,
    },

    {
      slug: "druid-the-respec",
      name: "The respec",
      classSlug: "druid",
      summary: "Level 38. Forty-three points out of the fire tree and into the wind.",
      levels: [38, 38],
      difficulty: "nightmare",
      location: "Nightmare Act 3 — the Kurast Docks, before Mephisto",
      goal: "Spend all 43 points on the wind opening, exactly.",
      killingWith: "Tornado, from the first cast.",
      skillPoints: [
        "**Arctic Blast 1** — the prerequisite for Cyclone Armor, and 2 frames of Twister stun.",
        "**Cyclone Armor 1** — the prerequisite for Twister.",
        "**Twister 1** — the prerequisite for Tornado.",
        "**Tornado 20** — all of the build's physical damage.",
        "**Hurricane 20** — its cold damage, and a 9%-per-point synergy to Tornado.",
        "1 + 1 + 1 + 20 + 20 = **43**, which is exactly what a level-38 character with the Normal quests and the Nightmare Den of Evil and Radament rewards holds. Nothing is left over.",
      ],
      statPoints: [
        "Nothing changes. Stats are not refunded by a respec token and did not need to be.",
      ],
      actions: [
        {
          kind: "respec",
          text: "Use the **Nightmare Den of Evil token**. The Normal one stays in the stash, and so does the Hell one when you get it.",
        },
        {
          kind: "warning",
          text: "Do not spread the 43 points. Hurricane at 20 and Tornado at 20 is the whole plan; a Wind Druid with 10 in each kills nothing.",
        },
        {
          kind: "tip",
          text: "Hurricane lasts ten seconds at hard level 20 and at hard level 1 alike — its own level buys no duration. Until Cyclone Armor is maxed you will be re-casting it constantly, and that is correct.",
        },
        {
          kind: "tip",
          text: "Kill Mephisto now. He is cold-immune in Hell but not in Nightmare, and Tornado's physical damage does not care either way.",
        },
      ],
      exitCriteria: "Mephisto down, and the character killing faster than it did an hour ago.",
      order: 4,
    },

    {
      slug: "druid-nightmare-late-hell-early",
      name: "Cyclone Armor pays for the storm",
      classSlug: "druid",
      summary: "Levels 38-60. Cyclone Armor maxed, which is what makes Hurricane a buff rather than a chore.",
      levels: [38, 60],
      difficulty: "hell",
      location: "Nightmare Acts 4 and 5, then Hell Acts 1 and 2",
      goal: "Max Cyclone Armor, cap resistances, and enter Hell.",
      killingWith: "Tornado, with Hurricane held up for forty seconds at a time.",
      skillPoints: [
        "**Cyclone Armor 1 to 20** — nineteen points, and the single most valuable stretch of the journey. Each one is fifty more frames of Hurricane and 9% more Tornado damage.",
        "**Oak Sage 1** and **Raven 1** — two points of utility that never need more.",
        "**Twister 1 to 6** with the last five.",
        "That is 26 points: 22 from levels 39-60, plus Nightmare Izual and the Hell Den of Evil and Radament.",
      ],
      statPoints: [
        "**Vitality** with everything that is not paying for a Monarch.",
        "Aim for 1000 life or more before Hell Act 3.",
      ],
      actions: [
        {
          kind: "warning",
          text: "**Hell applies -100% to all your resistances.** Cap fire, cold and lightning before Act 3, not during it.",
        },
        {
          kind: "runeword",
          text: "A second **Spirit** in a 4-socket Monarch. The pair is 60% faster cast rate and +4 to all skills.",
          refs: [{ kind: "runeword", slug: "spirit" }],
        },
        {
          kind: "gear",
          text: "**Skin of the Vipermagi** if one drops: +1 skills, 30% faster cast rate and up to 35 all resistances is close to best-in-slot until an Enigma.",
          refs: [{ kind: "unique", slug: "skin-of-the-vipermagi" }],
        },
        {
          kind: "runeword",
          text: "**Insight** for the mercenary. Tornado is cast continuously and the Druid has no Warmth; Meditation is the difference between casting and drinking.",
          refs: [{ kind: "runeword", slug: "insight" }],
        },
        {
          kind: "quest",
          text: "Anya's reward in Act 5 is +10 to all resistances per difficulty. Take all three.",
        },
      ],
      exitCriteria: "Hell Act 2 cleared, resistances at 75, and Hurricane holding for forty seconds.",
      order: 5,
    },

    {
      slug: "druid-hell-late",
      name: "Twister, and a bear to stand behind",
      classSlug: "druid",
      summary: "Levels 60-75. The last synergy maxed, and the summon line taken for one point each.",
      levels: [60, 75],
      difficulty: "hell",
      location: "Hell Acts 3 to 5",
      goal: "Finish the four maxed skills and reach level 75.",
      killingWith: "Tornado into packs, with a Grizzly holding the doorway.",
      skillPoints: [
        "**Twister 6 to 20** — fourteen points, the last 9% synergy to Tornado.",
        "**Summon Spirit Wolf 1**, **Summon Dire Wolf 1**, **Summon Grizzly 1** — three points for a bear that taunts.",
        "That is 17 points: 15 from levels 61-75, plus Hell Izual.",
        "At level 75 you have spent 86 of the 110 a level-99 character will hold, and the four skills that matter are all at 20.",
      ],
      statPoints: [
        "**Vitality**, all of it. 1400 life with Battle Orders is the number to aim at.",
      ],
      actions: [
        {
          kind: "gear",
          text: "**Arachnid Mesh** takes cast rate over the 99% breakpoint. Until it exists, two 10% rings and a Magefist get close.",
          refs: [
            { kind: "unique", slug: "arachnid-mesh" },
            { kind: "unique", slug: "magefist" },
          ],
        },
        {
          kind: "gear",
          text: "**Raven Frost** for cannot-be-frozen. On a build that stands still and casts, this is a survival line rather than a convenience.",
          refs: [{ kind: "unique", slug: "raven-frost" }],
        },
        {
          kind: "farm",
          text: "Run **the Pit** and **the Mausoleum** in Hell. Both are area level 85, both are dense, and neither has an immunity that stops physical and cold together.",
          refs: [],
        },
        {
          kind: "tip",
          text: "The Grizzly cannot be re-summoned while it lives. Losing it mid-fight costs a full 40-mana cast, so summon it before the door rather than after.",
        },
      ],
      exitCriteria: "Level 75, Baal dead in Hell, and every Act 85 area farmable.",
      order: 6,
    },

    {
      slug: "druid-endgame",
      name: "Twenty-four points and a Sunder Charm",
      classSlug: "druid",
      summary: "Levels 75-99. The build is finished; what remains is gear and the last flex points.",
      levels: [75, 99],
      difficulty: "hell",
      location: "Terror Zones, the Pit, Chaos Sanctuary and the Worldstone Keep",
      goal: "Reach the 99% cast-rate breakpoint, then spend the remaining points.",
      killingWith: "Tornado and Hurricane, and eventually Teleport between packs.",
      skillPoints: [
        "**Heart of Wolverine 1** if you are Softcore — +20% damage to the mercenary and the bear.",
        "**Everything else into Oak Sage.** Its party life bonus keeps scaling and the build has nothing else left to buy.",
        "That is the last 24 points: 110 total at level 99, of which 86 were spent by level 75.",
      ],
      statPoints: [
        "**Vitality**, minus whatever a Monarch and an Enigma's requirements still want.",
      ],
      actions: [
        {
          kind: "runeword",
          text: "**Heart of the Oak** replaces the weapon Spirit: +3 skills, 40% cast rate and 40 all resistances in one hand.",
          refs: [{ kind: "runeword", slug: "heart-of-the-oak" }],
        },
        {
          kind: "runeword",
          text: "**Enigma** is the largest change the character ever makes. The Druid has no movement skill, and Teleport roughly doubles clear speed.",
          refs: [{ kind: "runeword", slug: "enigma" }],
        },
        {
          kind: "gear",
          text: "**Bone Break** is the optional finish: a physical Sunder Charm for the rare pack that Hurricane alone would take too long to chill to death.",
          refs: [{ kind: "unique", slug: "bone-break" }],
          optional: true,
        },
        {
          kind: "runeword",
          text: "**Call to Arms** on a weapon swap. Battle Orders is a third more life on a class with 2 life per Vitality.",
          refs: [{ kind: "runeword", slug: "call-to-arms" }],
        },
        {
          kind: "transition",
          text: "The character is now the Wind Druid build in full. Nothing further in this journey changes the skill plan.",
        },
      ],
      exitCriteria: "99% faster cast rate, capped resistances, and Terror Zones at players 8.",
      order: 7,
    },
  ],
  confidence: "verified",
};
