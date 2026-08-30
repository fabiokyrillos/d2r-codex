import type { ProgressionJourney } from "@/lib/types";

/**
 * The Sorceress leveling journey, level 1 to Hell farming.
 *
 * Stages, not levels. 99 individual pages would be unreadable, and the
 * decisions that actually matter cluster tightly: skill unlocks at 1/6/12/18/
 * 24/30, quest rewards, runeword level requirements, and difficulty
 * transitions. Every stage boundary here sits on one of those.
 *
 * Quest rewards verified: Den of Evil +1 skill point, Radament's Lair +1 skill
 * point, The Fallen Angel (Izual) +2 skill points, Lam Esen's Tome +5 stat
 * points, Anya's Scroll of Resistance +10 all resistances, the Golden Bird
 * Potion of Life +20 maximum life. Each is repeatable once per difficulty.
 */
export const sorceressJourney: ProgressionJourney = {
  classSlug: "sorceress",
  targetBuild: "blizzard-sorceress",
  summary:
    "Level with Fire, respec to Blizzard around level 30, and be farming Hell Mephisto by level 70 on gear you found yourself.",
  overview: [
    "The single most important thing to understand: **you do not level as a Blizzard Sorceress**. Blizzard does not unlock until level 24, and it stays weak until its three synergies are maxed — roughly sixty more skill points. Trying to play it from 24 is the most common reason new players think the build is bad.",
    "Instead, level with Fire. Fire Bolt carries you to 12, Fire Ball carries you to Nightmare, and both are available immediately. Then respec into Blizzard once you have enough points to make it work. The Den of Evil quest gives you a free respec in every difficulty, so this costs nothing.",
    "The other thing to internalise early: **resistances, not damage, are what stop you**. Nightmare applies -40% to all your resistances and Hell applies -100%. A character with 75% fire resistance in Normal walks into Hell at -25%. Plan for that before you arrive, not after.",
    "Everything in this journey is achievable solo and self-found. No item below is something you need to trade for.",
  ],
  respecPlan: [
    {
      at: "Level 24-30, Normal",
      why: "The main respec, from your leveling build into Blizzard. Use the Den of Evil token from Normal. By 30 you have enough points for Blizzard plus a meaningful chunk of one synergy.",
    },
    {
      at: "Optional — early Nightmare",
      why: "If the level 30 respec left you awkwardly split, the Nightmare Den of Evil token gives you a clean second attempt. Keep the Hell token in reserve.",
    },
    {
      at: "Keep at least one token permanently",
      why: "A spare respec is genuinely valuable. It lets you experiment with Frozen Orb, Energy Shield or a magic-find variant without consequence.",
    },
  ],
  stages: [
    {
      slug: "act-1-normal-start",
      name: "The first hour",
      classSlug: "sorceress",
      summary: "Levels 1-5. Den of Evil, your first skill points, and the free respec that makes everything else possible.",
      levels: [1, 5],
      difficulty: "normal",
      location: "Act 1 — Rogue Encampment, Blood Moor, Cold Plains",
      goal: "Clear the Den of Evil and reach level 5 without dying.",
      killingWith: "Fire Bolt. It is the only real damage you have, and it is enough.",
      order: 1,
      skillPoints: [
        "Level 1: **Fire Bolt**. This is your attack for the next eleven levels.",
        "Level 2: **Warmth**. Mana regeneration from the very start — it costs one point and pays for itself immediately.",
        "Levels 3-5: more points into **Fire Bolt**.",
      ],
      statPoints: [
        "Everything into **Vitality**.",
        "Do not touch Energy. Warmth and mana potions handle it. Energy points are life you will wish you had in Nightmare.",
        "Do not touch Strength or Dexterity yet — you have no gear that needs them.",
      ],
      actions: [
        {
          kind: "quest",
          text: "Clear the **Den of Evil** completely — every monster, including champions and uniques. Akara rewards **+1 skill point**.",
        },
        {
          kind: "respec",
          text: "Completing the Den of Evil also grants a **free full respec**. This is what lets you level as Fire and switch to Blizzard later. Do not spend it now.",
        },
        {
          kind: "tip",
          text: "Talk to Akara after finishing the Den. The skill point is not automatic.",
        },
        {
          kind: "shop",
          text: "Buy a staff from Akara with any bonus to Fire Bolt or Warmth. Vendor staves refresh their stock every time you re-enter town, so check often — it is free damage.",
        },
        {
          kind: "quest",
          text: "Kill **Blood Raven** in the Burial Grounds. Kashya then offers you a free Rogue Scout mercenary.",
          optional: true,
        },
        {
          kind: "mercenary",
          text: "Take the Rogue Scout. A free body that shoots things is worth having, even though you will replace her with an Act 2 mercenary later.",
        },
      ],
      gearTargets: [
        {
          label: "Any staff with +Fire Bolt",
          why: "Vendor staves are the cheapest damage upgrade in the game at this level. Check Akara's stock every time you return to town.",
        },
        {
          label: "A belt with more than 8 potion slots",
          why: "The starting Sash holds 8. A Belt holds 16. This matters more than any stat right now.",
        },
      ],
      exitCriteria: "Den of Evil cleared, level 5, and you have a staff with a Fire Bolt bonus.",
    },
    {
      slug: "act-1-normal-tristram",
      name: "Finding your footing",
      classSlug: "sorceress",
      summary: "Levels 6-11. Static Field arrives, the Countess starts giving you runes, and your first runeword is in reach.",
      levels: [6, 11],
      difficulty: "normal",
      location: "Act 1 — Stony Field, Tristram, the Monastery",
      goal: "Reach level 12 and clear Act 1.",
      killingWith: "Fire Bolt, with Static Field to soften anything tough.",
      order: 2,
      skillPoints: [
        "Level 6: **Static Field**. It reduces enemy current life by a percentage and completely ignores resistances — it is your answer to anything you cannot hurt.",
        "Level 6: **Charged Bolt** (1 point) as the Static Field prerequisite. It is also genuinely good at point-blank range.",
        "Everything else into **Fire Bolt**.",
      ],
      statPoints: ["All **Vitality**. Still no Energy."],
      actions: [
        {
          kind: "farm",
          text: "Run **The Countess** (Black Marsh waypoint → Forgotten Tower → five Tower Cellar levels). She has a dedicated rune drop table and is the source of every early runeword.",
          refs: [{ kind: "rune", slug: "tal" }, { kind: "rune", slug: "eth" }],
        },
        {
          kind: "runeword",
          text: "Collect **Tal** and **Eth** for a Stealth armor. You cannot wear it until level 17, but start hunting a 2-socket body armor now.",
          refs: [{ kind: "runeword", slug: "stealth" }],
        },
        {
          kind: "gear",
          text: "Keep any 2-socket body armor that drops. A Breast Plate is the ideal Stealth base — light enough to keep you at Fast run speed, only 30 Strength.",
        },
        {
          kind: "quest",
          text: "Do the **Cain** rescue (Tristram). Free item identification for the rest of the game is genuinely worth the detour.",
        },
        {
          kind: "quest",
          text: "The **Forgotten Tower** quest and the **Tools of the Trade** (Horadric Malus) quest both give permanent value — the Malus lets Charsi imbue an item into a rare with high-tier affixes.",
        },
        {
          kind: "tip",
          text: "Save the Charsi imbue. Do not spend it on a level 11 item. Most players hold it for a circlet or an amulet in the 60s.",
        },
      ],
      exitCriteria: "Andariel dead, level 12+, and Tal + Eth in your stash.",
    },
    {
      slug: "act-2-normal-fireball",
      name: "Fire Ball changes everything",
      classSlug: "sorceress",
      summary: "Levels 12-17. Your first real area damage, your first runeword, and the Act 2 mercenary.",
      levels: [12, 17],
      difficulty: "normal",
      location: "Act 2 — Lut Gholein, the deserts, the tombs",
      goal: "Reach level 18 and clear Act 2.",
      killingWith: "Fire Ball. It is a genuine step change from Fire Bolt.",
      order: 3,
      skillPoints: [
        "Level 12: **Fire Ball**. Put every point here from now until level 18.",
        "Fire Bolt is a Fire Ball synergy, so the points you already spent are not wasted.",
      ],
      statPoints: [
        "Mostly **Vitality**.",
        "Add just enough **Strength** to wear whatever armor you actually have. Do not pre-invest.",
      ],
      actions: [
        {
          kind: "quest",
          text: "Kill **Radament** in the Sewers. He drops a **Book of Skills** — **+1 skill point**. Easy to miss because the Sewers are optional.",
          atLevel: 14,
        },
        {
          kind: "runeword",
          text: "At level 17, make **Stealth** in a 2-socket body armor. 25% Faster Cast Rate, 25% Faster Run/Walk and 25% Faster Hit Recovery for two of the most common runes in the game.",
          refs: [{ kind: "runeword", slug: "stealth" }],
          atLevel: 17,
        },
        {
          kind: "mercenary",
          text: "After the **Radament** quest, hire an **Act 2 mercenary** from Greiz. Take one with an offensive aura for now — you will re-hire in Nightmare for the aura that actually matters.",
        },
        {
          kind: "gear",
          text: "Start hunting a **4-socket Crystal Sword** for a Spirit at level 25. Charsi and Fara sell them, and gambling produces them cheaply. It needs exactly 4 sockets.",
          refs: [{ kind: "runeword", slug: "spirit" }],
        },
        {
          kind: "shop",
          text: "Buy from **Drognan** and **Fara** regularly. Drognan sells staves and orbs, and a staff with +3 to a skill you use is worth more than most drops.",
        },
        {
          kind: "warning",
          text: "**Duriel** at the end of Act 2 is a genuine difficulty spike, and there is no waypoint next to him. Bring full potions and consider levelling to 20 before attempting him.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "stealth" },
          why: "Your first runeword, and it stays relevant for another twenty levels.",
        },
        {
          ref: { kind: "unique", slug: "magefist" },
          why: "20% Faster Cast Rate at level 23. Worth gambling gloves for.",
        },
      ],
      exitCriteria: "Duriel dead, Stealth made, level 18.",
    },
    {
      slug: "act-3-normal-teleport",
      name: "Teleport",
      classSlug: "sorceress",
      summary:
        "Levels 18-23. The single most important skill point you will ever spend, and Spirit at 25.",
      levels: [18, 23],
      difficulty: "normal",
      location: "Act 3 — Kurast, the temples, Travincal",
      goal: "Get Teleport, get Spirit, reach level 24.",
      killingWith: "Fire Ball, and now you choose your fights.",
      order: 4,
      skillPoints: [
        "Level 18: **Telekinesis** (1 point) then **Teleport** (1 point). Both, immediately.",
        "**One point in Teleport is all you ever need.** Extra points only reduce its mana cost.",
        "Everything else into **Fire Ball**.",
      ],
      statPoints: [
        "**Vitality**, plus enough **Strength** for your armor.",
        "If you are aiming at a Spirit *shield* later, note now that a Monarch needs 156 Strength. Most players postpone that decision — see the build page.",
      ],
      actions: [
        {
          kind: "skill",
          text: "**Take Teleport the moment you hit 18.** It is the reason the Sorceress is the fastest farming class in the game. Every other class needs an Enigma runeword to do this.",
          atLevel: 18,
        },
        {
          kind: "quest",
          text: "**Lam Esen's Tome** (the Ruined Temple in Kurast Bazaar) rewards **+5 stat points**. Very commonly skipped, and it is free Vitality.",
        },
        {
          kind: "quest",
          text: "**The Golden Bird** rewards a **Potion of Life** — a permanent **+20 maximum life**. Also easy to miss.",
        },
        {
          kind: "runeword",
          text: "At level 25, make **Spirit** in a 4-socket Crystal Sword: **Tal, Thul, Ort, Amn**, in that order. +2 skills and up to 35% Faster Cast Rate. This is the largest single power spike available to a fresh character.",
          refs: [{ kind: "runeword", slug: "spirit" }],
          atLevel: 25,
        },
        {
          kind: "runeword",
          text: "Also collect **Ral, Tir, Tal, Sol** and a **4-socket polearm** for an Insight on your mercenary. Meditation ends your mana problems permanently.",
          refs: [{ kind: "runeword", slug: "insight" }],
        },
        {
          kind: "warning",
          text: "Insight goes in a **polearm**, not a spear. They are different item classes and this is the most common Insight mistake there is.",
        },
        {
          kind: "tip",
          text: "Teleport has a mana cost that feels high at level 18. It drops as your mana pool grows. Do not put points into Energy to fix it.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "spirit" },
          why: "+2 skills and 35% Faster Cast Rate at level 25, from four Normal-difficulty runes.",
        },
        {
          ref: { kind: "runeword", slug: "insight" },
          why: "Meditation on your mercenary. You will never drink a mana potion again.",
        },
      ],
      exitCriteria: "Teleport learned, Mephisto dead, Spirit sword equipped, level 24+.",
    },
    {
      slug: "act-4-normal-respec",
      name: "The respec",
      classSlug: "sorceress",
      summary:
        "Levels 24-30. Blizzard unlocks, Izual gives two skill points, and you commit to the endgame build.",
      levels: [24, 30],
      difficulty: "normal",
      location: "Act 4 — the Pandemonium Fortress, River of Flame, Chaos Sanctuary",
      goal: "Reach level 30, respec into Blizzard, and kill Diablo.",
      killingWith: "Fire Ball until the respec, then Blizzard and Glacial Spike.",
      order: 5,
      skillPoints: [
        "**Do the respec at 30, not at 24.** At 24 you can put one point in Blizzard and it will be weak. At 30, with the quest points, you have enough to make it function.",
        "After respec: **Blizzard** first, then **Glacial Spike**, then **Ice Blast**, then **Ice Bolt**.",
        "One point each: Teleport, Telekinesis, Charged Bolt, Static Field, Frozen Armor, Warmth, Frost Nova, Ice Bolt prerequisites.",
        "**One point in Cold Mastery** at 30. It is a huge multiplier even at level 1.",
      ],
      statPoints: ["**Vitality**, plus Strength for gear. Nothing else."],
      actions: [
        {
          kind: "quest",
          text: "Kill **Izual** in the Plains of Despair. He rewards **+2 skill points** — the largest single quest reward in the game.",
        },
        {
          kind: "respec",
          text: "Talk to **Akara** and use your **Den of Evil respec** to convert from Fire to Blizzard. Do this at level 30, once Cold Mastery is available.",
          atLevel: 30,
        },
        {
          kind: "quest",
          text: "**Hellforge**: Hephasto drops the Hellforge Hammer, and smashing Mephisto's Soulstone on the anvil drops runes and gems. In Normal expect low runes; the Nightmare and Hell versions are far more valuable.",
        },
        {
          kind: "warning",
          text: "Do not skip the Hellforge. It is once per difficulty per character and the Hell one can drop a genuinely high rune.",
        },
        {
          kind: "gear",
          text: "Make **Lore** (Ort + Sol) in a 2-socket helm at 27 for +1 to All Skills, and **Ancient's Pledge** (Ral + Ort + Tal) in a 3-socket shield for near-max resistances.",
          refs: [
            { kind: "runeword", slug: "lore" },
            { kind: "runeword", slug: "ancients-pledge" },
          ],
        },
        {
          kind: "tip",
          text: "Blizzard has a cooldown that nothing reduces. Cast Glacial Spike during it — that is the intended rhythm of the build, not a workaround.",
        },
      ],
      gearTargets: [
        { ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills for two common runes." },
        {
          ref: { kind: "runeword", slug: "ancients-pledge" },
          why: "Near-max resistances for three Countess runes. This is what gets you through the Nightmare penalty.",
        },
      ],
      exitCriteria: "Diablo dead, respecced into Blizzard, level 30+.",
    },
    {
      slug: "act-5-normal-to-nightmare",
      name: "Act 5 and the jump to Nightmare",
      classSlug: "sorceress",
      summary:
        "Levels 30-40. Finish Normal, get Anya's resistance scroll, and understand the penalty waiting for you.",
      levels: [30, 40],
      difficulty: "normal",
      location: "Act 5 — Harrogath, the highlands, Worldstone Keep",
      goal: "Kill Baal, then enter Nightmare at a sensible level.",
      killingWith: "Blizzard, with Glacial Spike covering the cooldown.",
      order: 6,
      skillPoints: ["Continue maxing **Blizzard**, then **Glacial Spike**."],
      statPoints: ["**Vitality**. Strength only for gear you actually own."],
      actions: [
        {
          kind: "quest",
          text: "Rescue **Anya** (Frozen River). She gives a **Scroll of Resistance**: a permanent **+10 to all resistances**. Repeatable once per difficulty, so that is +30 across a character's life.",
        },
        {
          kind: "quest",
          text: "Killing **Nihlathak** unlocks the red portal to his temple in Harrogath — this is what makes Pindleskin runs possible later.",
        },
        {
          kind: "quest",
          text: "**The Ancients** must be beaten to reach Baal. They cannot be Teleported past and they are a real fight. Level to 30+ before attempting them.",
        },
        {
          kind: "transition",
          text: "**Enter Nightmare at level 38-42.** Going earlier is possible but unpleasant; going much later is wasted time — Nightmare experience is far better than Normal's.",
          atLevel: 40,
        },
        {
          kind: "warning",
          text: "Nightmare applies **-40% to all your resistances**. If you finish Normal at 75% fire resistance, you begin Nightmare at 35%. Fix this before Act 2, not after you start dying.",
        },
        {
          kind: "farm",
          text: "If Nightmare Act 1 feels dangerous, run **Normal Baal** or **Normal Countess** for a few levels rather than pushing through and dying repeatedly.",
        },
      ],
      exitCriteria: "Normal Baal dead, level 38+, and a plan for resistances.",
    },
    {
      slug: "nightmare",
      name: "Nightmare",
      classSlug: "sorceress",
      summary:
        "Levels 40-60. The build comes together: synergies fill in, resistances get fixed, and Hell starts to look possible.",
      levels: [40, 60],
      difficulty: "nightmare",
      location: "Nightmare — Acts 1 through 5",
      goal: "Clear Nightmare and arrive at Hell with 75% resistances and a working Blizzard.",
      killingWith: "Blizzard, now with real synergy investment behind it.",
      order: 7,
      skillPoints: [
        "Finish **Blizzard** (20), then **Glacial Spike** (20), then start **Ice Blast**.",
        "Keep **Cold Mastery** at 1 point for now — the synergies are worth more per point at this stage.",
      ],
      statPoints: [
        "**Vitality**, and enough **Strength** for a Spirit Monarch if you have committed to that plan.",
      ],
      actions: [
        {
          kind: "quest",
          text: "Repeat every permanent-bonus quest: **Den of Evil** (+1 skill), **Radament** (+1 skill), **Izual** (+2 skills), **Lam Esen's Tome** (+5 stats), **Golden Bird** (+20 life), **Anya** (+10 all resistances).",
        },
        {
          kind: "mercenary",
          text: "**Re-hire your Act 2 mercenary in Nightmare** and take **Might**. The aura you get is fixed by the difficulty you hire in, and Might is what kills the cold immunes you cannot touch.",
        },
        {
          kind: "runeword",
          text: "Make **Insight** for the mercenary if you have not already. Meditation is the largest quality-of-life change in the whole journey.",
          refs: [{ kind: "runeword", slug: "insight" }],
        },
        {
          kind: "gear",
          text: "**Skin of the Vipermagi** (level 29) is a large upgrade over Stealth: +1 skills, 30% Faster Cast Rate and up to +35 all resistances at only 43 Strength.",
          refs: [{ kind: "unique", slug: "skin-of-the-vipermagi" }],
        },
        {
          kind: "runeword",
          text: "Make a **second Spirit** in a 4-socket Monarch when you can afford the 156 Strength. +4 skills across both slots is enormous.",
          refs: [{ kind: "runeword", slug: "spirit" }],
        },
        {
          kind: "farm",
          text: "**Nightmare Mephisto** is the standard farm here — a twenty-second route, and he is not cold immune.",
          refs: [],
        },
        {
          kind: "farm",
          text: "**Nightmare Countess** for the runes for Insight, a second Spirit and Lore.",
        },
        {
          kind: "transition",
          text: "**Enter Hell at level 60-65**, not before. Below 60 the monster level gap makes your damage and your defence both fall off a cliff.",
          atLevel: 62,
        },
        {
          kind: "warning",
          text: "**Get all four resistances to 75% before entering Hell.** Hell applies -100%. Arriving at 40% fire resistance means you are actually at -60% and will die to things that should be harmless.",
        },
        {
          kind: "tip",
          text: "If you are short on resistances, Ancient's Pledge, Rhyme and Smoke are all cheap fixes. So is a row of resistance small charms.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
          why: "The best budget caster armor in the game, and reliably found in this difficulty.",
        },
        {
          ref: { kind: "runeword", slug: "spirit" },
          why: "A second Spirit in a Monarch shield.",
        },
        {
          ref: { kind: "runeword", slug: "insight" },
          why: "On the mercenary. Non-negotiable.",
        },
      ],
      exitCriteria:
        "Nightmare Baal dead, level 60+, all four resistances at 75%, Blizzard and Glacial Spike maxed, Insight on the mercenary.",
    },
    {
      slug: "hell-progression",
      name: "Hell",
      classSlug: "sorceress",
      summary:
        "Levels 60-80. Push carefully, respect immunities, and switch from progressing to farming as soon as it makes sense.",
      levels: [60, 80],
      difficulty: "hell",
      location: "Hell — Acts 1 through 5",
      goal: "Reach Hell Act 3 and start farming Mephisto. Everything after that is optimisation.",
      killingWith:
        "Blizzard, with Static Field and a Might mercenary handling anything cold immune.",
      order: 8,
      skillPoints: [
        "Finish **Ice Blast** (20), then **Ice Bolt** (20).",
        "Every point after that goes into **Cold Mastery**.",
      ],
      statPoints: ["**Vitality**. Strength only for a specific item you own."],
      actions: [
        {
          kind: "warning",
          text: "**You do not need to clear Hell.** The goal is to reach the Act 3 waypoint and start running Mephisto. Progressing further is optional and often slower than farming.",
        },
        {
          kind: "tip",
          text: "**Skipping is a strategy, not a failure.** Teleport past cold-immune packs. You are not obliged to kill anything that is inconvenient.",
        },
        {
          kind: "quest",
          text: "Repeat the permanent-bonus quests one final time: **+4 skill points**, **+5 stat points**, **+10 all resistances**, **+20 life**.",
        },
        {
          kind: "quest",
          text: "The **Hell Hellforge** is worth doing properly — it drops from a high rune tier and can seed a serious runeword.",
        },
        {
          kind: "farm",
          text: "**Hell Mephisto** is the target. Durance of Hate Level 2 waypoint, find the stairs, use the moat trick. He is monster level 87 and not cold immune.",
        },
        {
          kind: "farm",
          text: "**Ancient Tunnels** once you can handle it — area level 85 with essentially no cold immunes. This is where the build is happiest.",
        },
        {
          kind: "farm",
          text: "**Lower Kurast** chest runs need no gear and no damage. A completely legitimate way to bootstrap a character that cannot yet fight in Hell.",
        },
        {
          kind: "gear",
          text: "Hunt a **Harlequin Crest** (Shako) and **The Oculus**. Both are commonly found and both are large upgrades.",
          refs: [
            { kind: "unique", slug: "harlequin-crest" },
            { kind: "unique", slug: "the-oculus" },
          ],
        },
        {
          kind: "gear",
          text: "Aim for the **105% Faster Cast Rate** breakpoint. It governs Teleport speed as much as cast speed, so it is the difference between farming and trudging.",
        },
        {
          kind: "gear",
          text: "A **Cold Rupture** sunder charm removes the build's only real weakness by setting cold-immune monsters to 95% cold resistance. Patch 3.3 raised its minimum drop level to 75 and restricted magic-find drops to Hell difficulty.",
        },
        {
          kind: "mercenary",
          text: "Keep the mercenary alive: **Treachery** armor for the Fade proc, **Vampire Gaze** for life steal and damage reduction. Both are cheap.",
          refs: [
            { kind: "runeword", slug: "treachery" },
            { kind: "unique", slug: "vampire-gaze" },
          ],
        },
      ],
      gearTargets: [
        { ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, 50% magic find, 10% damage reduction." },
        { ref: { kind: "unique", slug: "the-oculus" }, why: "+3 Sorceress skills, 30% FCR, +20 all resistances, 50% magic find." },
        { ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster Hit Recovery and the Strength to afford a Monarch." },
      ],
      exitCriteria:
        "Farming Hell Mephisto or Ancient Tunnels reliably, 105% Faster Cast Rate, 75% resistances. At this point you have finished the journey and started the game.",
    },
  ],
  confidence: "verified",
};
