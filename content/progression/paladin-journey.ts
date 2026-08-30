import type { ProgressionJourney } from "@/lib/types";

/**
 * The Paladin leveling journey.
 *
 * A useful contrast with the Sorceress: this journey has **no mandatory
 * respec**. Blessed Hammer unlocks at 18 and is immediately usable, so the
 * character you level is the character you finish with. That single difference
 * reshapes the whole route — the Sorceress journey is organised around a
 * planned identity change at 30, and this one is not.
 *
 * The other structural difference is Dexterity. The Sorceress guide says
 * "never touch it"; here it is a running decision from level 30 onward, and
 * getting it wrong wastes fifty stat points.
 */
export const paladinJourney: ProgressionJourney = {
  classSlug: "paladin",
  targetBuild: "hammerdin",
  summary:
    "Level with Blessed Hammer from 18 — no respec needed — and be farming Hell Chaos Sanctuary by level 75.",
  overview: [
    "The Paladin's advantage over most classes is that **you never have to change build**. Blessed Hammer unlocks at 18 and is immediately strong; from that point you are simply pouring points into the character you already have. Compare the Sorceress, who must level as Fire and respec at 30.",
    "Before 18, the class is a melee character. Zeal with any decent weapon and a Might aura carries the first two acts comfortably, and Holy Fire adds damage that does not depend on your weapon at all.",
    "The one thing this journey asks you to think about carefully is **Dexterity**. Maximum block is the Hammerdin's survivability, and Holy Shield provides a large chunk of the block chance — so the amount of Dexterity you need depends on a skill you have not levelled yet. Over-invest early and you waste fifty points you can never get back without a respec.",
    "Resistances still matter as much as they do for any class. Nightmare applies −40 to all of them and Hell applies −100. Plan for the destination before you arrive.",
  ],
  respecPlan: [
    {
      at: "Usually never",
      why: "Unlike most builds, the Hammerdin levels as itself. Keep your three Den of Evil tokens in reserve.",
    },
    {
      at: "If you over-invested in Dexterity",
      why: "The most common Paladin mistake is stacking Dexterity before Holy Shield is levelled, then discovering you are twenty points past maximum block. A respec recovers those points as Vitality.",
    },
    {
      at: "If you want to try a Smiter for Ubers",
      why: "A Smiter uses completely different gear and skills. A spare token lets you test it on the same character rather than levelling a second Paladin.",
    },
  ],
  stages: [
    {
      slug: "pal-act-1-normal",
      name: "Melee opening",
      classSlug: "paladin",
      summary: "Levels 1-11. You are a melee character for now. Might and a weapon do the work.",
      levels: [1, 11],
      difficulty: "normal",
      location: "Act 1 — Rogue Encampment through the Monastery",
      goal: "Clear the Den of Evil, reach level 12, and kill Andariel.",
      killingWith: "Normal attacks with a Might aura running. Sacrifice if you want more damage and can afford the self-damage.",
      order: 1,
      skillPoints: [
        "Level 1: **Might**. It increases your damage immediately and it is a Blessed Aim prerequisite later.",
        "Levels 2-5: **Sacrifice**, or spread into **Holy Fire** if you would rather not take the self-damage.",
        "Level 6: **Holy Fire** is a genuinely strong early aura — it adds damage that does not depend on your weapon.",
        "Do not invest heavily anywhere. These points are effectively temporary and you have plenty coming.",
      ],
      statPoints: [
        "**Strength** to hold a decent weapon and shield, then **Vitality**.",
        "**Do not touch Dexterity yet.** You need some eventually, but how much depends on Holy Shield, which is twenty-four levels away.",
        "No Energy.",
      ],
      actions: [
        {
          kind: "quest",
          text: "Clear the **Den of Evil** completely. Akara gives **+1 skill point** and a **free full respec**.",
        },
        {
          kind: "tip",
          text: "Save the respec. You almost certainly will not need it, but it is the cheapest insurance in the game.",
        },
        {
          kind: "shop",
          text: "Shop **Charsi** and **Akara** for scepters. Paladin scepters roll +skills to Combat Skills — a scepter with +3 to a skill you use is worth more than most drops at this level.",
        },
        {
          kind: "quest",
          text: "Kill **Blood Raven** for a free Rogue Scout mercenary. Take her — she is free and she shoots things.",
          optional: true,
        },
        {
          kind: "gear",
          text: "Keep any 2-socket body armor for a **Stealth** at level 17.",
          refs: [{ kind: "runeword", slug: "stealth" }],
        },
        {
          kind: "quest",
          text: "**Tools of the Trade** gives the Charsi imbue. Save it — most players hold all three until they have a good circlet or amulet in the 60s.",
        },
      ],
      exitCriteria: "Andariel dead, level 12+, Tal and Eth in your stash.",
    },
    {
      slug: "pal-act-2-normal",
      name: "Zeal and the road to 18",
      classSlug: "paladin",
      summary:
        "Levels 12-17. Zeal makes clearing fast, Stealth arrives at 17, and Blessed Hammer is close.",
      levels: [12, 17],
      difficulty: "normal",
      location: "Act 2 — Lut Gholein, the deserts and tombs",
      goal: "Reach level 18 and kill Duriel.",
      killingWith: "Zeal with Might, or Holy Fire if your weapon is poor.",
      order: 2,
      skillPoints: [
        "Level 12: **Zeal**. A chain of fast attacks — a large step up from single attacks.",
        "Keep a few points going into **Might** or **Holy Fire**.",
        "**Do not over-invest.** Everything here is temporary; from 18 onward every point goes into the Hammerdin core.",
      ],
      statPoints: ["**Strength** for gear, everything else **Vitality**. Still no Dexterity."],
      actions: [
        {
          kind: "quest",
          text: "Kill **Radament** in the Sewers for a **Book of Skills** — **+1 skill point**. Easy to miss because the Sewers are optional.",
        },
        {
          kind: "runeword",
          text: "At level 17, make **Stealth** in a 2-socket body armor. Tal then Eth.",
          refs: [{ kind: "runeword", slug: "stealth" }],
          atLevel: 17,
        },
        {
          kind: "mercenary",
          text: "Hire an **Act 2 mercenary** from Greiz after the Radament quest. Any aura is fine for now — you will re-hire in Nightmare for the one that matters.",
        },
        {
          kind: "gear",
          text: "Start collecting **Tal, Thul, Ort, Amn** and a **4-socket Crystal Sword** for a Spirit at 25.",
          refs: [{ kind: "runeword", slug: "spirit" }],
        },
        {
          kind: "warning",
          text: "**Duriel** is a real difficulty spike with no waypoint next to him. Bring full potions and consider reaching level 20 first.",
        },
      ],
      exitCriteria: "Duriel dead, Stealth made, level 18.",
    },
    {
      slug: "pal-blessed-hammer",
      name: "Blessed Hammer",
      classSlug: "paladin",
      summary:
        "Levels 18-30. The build arrives, and you spend a while learning to aim it.",
      levels: [18, 30],
      difficulty: "normal",
      location: "Act 3 and Act 4 — Kurast, Travincal, the Pandemonium Fortress",
      goal: "Get Blessed Hammer and Concentration online, and kill Diablo.",
      killingWith: "Blessed Hammer with Concentration running.",
      order: 3,
      skillPoints: [
        "Level 18: **Blessed Hammer**. Put every point here from now on.",
        "Level 18: **Concentration** as soon as you have the prerequisites. It multiplies hammer damage directly and must be your **active** aura.",
        "Then **Vigor**, then **Blessed Aim** — both are +14% magic damage per level.",
        "One point in **Holy Shield** at 24. Your +skills gear pushes it well beyond that.",
      ],
      statPoints: [
        "**Strength** for gear, rest **Vitality**.",
        "Still hold off on **Dexterity**. Once Holy Shield is active and you know your endgame shield, work out the exact requirement then.",
      ],
      actions: [
        {
          kind: "warning",
          text: "**Blessed Hammer spirals, it does not fly straight.** Hammers travel in an expanding clockwise spiral starting around your 9 o'clock. If the build feels weak, you are missing — stand so the spiral passes through the pack rather than aiming at it.",
          atLevel: 18,
        },
        {
          kind: "skill",
          text: "**Concentration must be the active aura.** It is a live multiplier, not a synergy — running Might instead costs you most of your damage.",
        },
        {
          kind: "quest",
          text: "**Lam Esen's Tome** (Ruined Temple, Kurast Bazaar) rewards **+5 stat points**. Commonly skipped.",
        },
        {
          kind: "quest",
          text: "**The Golden Bird** rewards a **Potion of Life** — permanent **+20 maximum life**.",
        },
        {
          kind: "quest",
          text: "Kill **Izual** in the Plains of Despair for **+2 skill points**, the largest single quest reward in the game.",
        },
        {
          kind: "runeword",
          text: "At 25, make **Spirit** in a 4-socket Crystal Sword. At 27, make **Lore** (Ort + Sol) in a 2-socket helm.",
          refs: [
            { kind: "runeword", slug: "spirit" },
            { kind: "runeword", slug: "lore" },
          ],
          atLevel: 25,
        },
        {
          kind: "runeword",
          text: "Make **Insight** (Ral + Tir + Tal + Sol) in a 4-socket **polearm** for your mercenary. Hammers cost mana and you have no Energy — Meditation solves that permanently.",
          refs: [{ kind: "runeword", slug: "insight" }],
        },
        {
          kind: "warning",
          text: "Insight goes in a **polearm**, not a spear. Different item classes, and the single most common Insight mistake.",
        },
        {
          kind: "quest",
          text: "Do the **Hellforge** — once per difficulty, and the Hell version can drop a genuinely high rune.",
        },
      ],
      gearTargets: [
        { ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills and up to 35% Faster Cast Rate at level 25." },
        { ref: { kind: "runeword", slug: "insight" }, why: "Meditation on your mercenary. Ends mana problems for good." },
      ],
      exitCriteria: "Diablo dead, level 30+, Blessed Hammer and Concentration both invested, Insight on the mercenary.",
    },
    {
      slug: "pal-act-5-to-nightmare",
      name: "Act 5 and into Nightmare",
      classSlug: "paladin",
      summary:
        "Levels 30-42. Finish Normal, take Anya's resistance scroll, and start planning Dexterity.",
      levels: [30, 42],
      difficulty: "normal",
      location: "Act 5 — Harrogath through the Worldstone Keep",
      goal: "Kill Baal and enter Nightmare at a sensible level.",
      killingWith: "Blessed Hammer, now with real synergy investment.",
      order: 4,
      skillPoints: ["Continue maxing **Blessed Hammer**, then **Vigor**, then **Concentration**."],
      statPoints: [
        "**Strength** for the shield you actually intend to use. Decide now: a Spirit in a Sacred Targe needs far less than a Monarch.",
        "Start adding **Dexterity** toward maximum block **with Holy Shield active**. Check the character screen with the buff up, not down.",
        "Everything else **Vitality**.",
      ],
      actions: [
        {
          kind: "stat",
          text: "**Check your block percentage with Holy Shield running.** Holy Shield contributes a large share of it, and people routinely over-invest fifty points in Dexterity because they checked with the buff down.",
        },
        {
          kind: "quest",
          text: "Rescue **Anya** for a **Scroll of Resistance** — permanent **+10 to all resistances**, once per difficulty.",
        },
        {
          kind: "quest",
          text: "Killing **Nihlathak** unlocks the red portal in Harrogath, which is what makes Pindleskin runs possible later.",
        },
        {
          kind: "warning",
          text: "**The Ancients** cannot be skipped or teleported past. They are a real fight — be level 30+ before attempting them.",
        },
        {
          kind: "transition",
          text: "**Enter Nightmare at level 38-42.** Nightmare experience is far better than Normal's, so lingering past 45 wastes time.",
          atLevel: 40,
        },
        {
          kind: "warning",
          text: "Nightmare applies **−40% to all resistances**. Fix this before Act 2, not after you start dying.",
        },
      ],
      exitCriteria: "Normal Baal dead, level 38+, block chance planned, resistances considered.",
    },
    {
      slug: "pal-nightmare",
      name: "Nightmare",
      classSlug: "paladin",
      summary:
        "Levels 42-62. The core skills finish, 75% Faster Cast Rate comes into reach, and you start saving for Enigma.",
      levels: [42, 62],
      difficulty: "nightmare",
      location: "Nightmare — Acts 1 through 5",
      goal: "Clear Nightmare and arrive in Hell at 75% resistances with 75% Faster Cast Rate.",
      killingWith: "Blessed Hammer with Concentration. By the end of this stage it kills almost everything instantly.",
      order: 5,
      skillPoints: [
        "Finish **Blessed Hammer**, **Vigor**, **Concentration**, then **Blessed Aim**.",
        "One point in **Redemption** once prerequisites allow — it refills life and mana from corpses and replaces most potion use.",
      ],
      statPoints: [
        "**Dexterity** to maximum block with Holy Shield active, **Strength** for your shield, rest **Vitality**.",
      ],
      actions: [
        {
          kind: "quest",
          text: "Repeat every permanent-bonus quest: **Den of Evil** (+1 skill), **Radament** (+1 skill), **Izual** (+2 skills), **Lam Esen's Tome** (+5 stats), **Golden Bird** (+20 life), **Anya** (+10 all resistances).",
        },
        {
          kind: "mercenary",
          text: "**Re-hire your Act 2 mercenary in Nightmare** and take **Holy Freeze**. Your damage does not need help — slowing everything makes hammer positioning far easier.",
        },
        {
          kind: "runeword",
          text: "Make a **second Spirit** in a shield. Two Spirits plus Magefist is 90% Faster Cast Rate, well past the 75% breakpoint.",
          refs: [{ kind: "runeword", slug: "spirit" }],
        },
        {
          kind: "gear",
          text: "A **Herald of Zakarum** is a large upgrade: +2 Paladin and +2 Combat skills, +50 all resistances, +20 Strength and 30% increased blocking. It has no Faster Cast Rate, so check your breakpoint before swapping.",
          refs: [{ kind: "unique", slug: "herald-of-zakarum" }],
        },
        {
          kind: "gear",
          text: "**Skin of the Vipermagi** at 43 Strength gives +1 skills, 30% Faster Cast Rate and up to +35 all resistances.",
          refs: [{ kind: "unique", slug: "skin-of-the-vipermagi" }],
        },
        {
          kind: "farm",
          text: "**Nightmare Countess** for runes, and **Nightmare Mephisto** or **Travincal** once you can handle them.",
        },
        {
          kind: "transition",
          text: "**Enter Hell at level 60-65.** Below 60 the monster level gap hurts both damage and defence.",
          atLevel: 62,
        },
        {
          kind: "warning",
          text: "**All four resistances at 75% before Hell.** Hell applies −100%.",
        },
        {
          kind: "tip",
          text: "Start saving for **Enigma** now. Jah, Ith and Ber is a long project, and Teleport is the single largest upgrade this build ever gets.",
          refs: [{ kind: "runeword", slug: "enigma" }],
        },
      ],
      gearTargets: [
        { ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "+4 effective skills, +50 all resistances and huge block in one slot." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "A second Spirit for the Faster Cast Rate breakpoint." },
      ],
      exitCriteria:
        "Nightmare Baal dead, level 60+, 75% resistances, 75% Faster Cast Rate, maximum block with Holy Shield.",
    },
    {
      slug: "pal-hell",
      name: "Hell",
      classSlug: "paladin",
      summary:
        "Levels 62-85. Magic damage means almost nothing stops you. Get to Chaos Sanctuary and start farming.",
      levels: [62, 85],
      difficulty: "hell",
      location: "Hell — Acts 1 through 5",
      goal: "Reach Hell Act 4 and farm Chaos Sanctuary. Everything after that is optimisation.",
      killingWith: "Blessed Hammer. Only a handful of monsters in the whole game resist magic damage.",
      order: 6,
      skillPoints: [
        "Finish **Blessed Aim**, then max **Resist Lightning** for the maximum lightning resistance.",
        "Spare points go into **Holy Shield** for more block and defence.",
      ],
      statPoints: ["**Vitality**, once Strength and Dexterity requirements are met exactly."],
      actions: [
        {
          kind: "tip",
          text: "**This is where the class pays off.** Magic damage means no immunity wall, no Sunder Charm to hunt, no Infinity to save for. The handful of magic-immune monsters in Acts 2 and 3 are your mercenary's problem.",
        },
        {
          kind: "quest",
          text: "Repeat the permanent-bonus quests a final time: **+4 skill points**, **+5 stat points**, **+10 all resistances**, **+20 life**.",
        },
        {
          kind: "farm",
          text: "**Chaos Sanctuary** is the destination. Area level 85, very dense, and the 150% bonus to Undead and Demons applies to nearly everything in it.",
        },
        {
          kind: "farm",
          text: "**Travincal** — the Council are fire and lightning immune, which stops most casters and not you. Tight packing suits the hammer spiral perfectly.",
        },
        {
          kind: "warning",
          text: "**Iron Maiden from Oblivion Knights in Chaos Sanctuary** reflects physical damage. Your hammers are magic and unaffected, but your mercenary's attacks are not — this is how Hardcore Paladins lose mercenaries, and occasionally themselves.",
        },
        {
          kind: "gear",
          text: "**Enigma** is the goal. Teleport changes clear speed more than any damage item could, and its +0.75 Strength per level pays for your shield.",
          refs: [{ kind: "runeword", slug: "enigma" }],
        },
        {
          kind: "gear",
          text: "**Heart of the Oak** in a Flail: +3 skills, 40% Faster Cast Rate and up to +40 all resistances. The definitive endgame weapon.",
          refs: [{ kind: "runeword", slug: "heart-of-the-oak" }],
        },
        {
          kind: "gear",
          text: "Aim for the **125% Faster Cast Rate** breakpoint once Heart of the Oak is in hand.",
        },
      ],
      gearTargets: [
        { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport. The largest upgrade the build ever receives." },
        { ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, magic find and damage reduction." },
        { ref: { kind: "runeword", slug: "heart-of-the-oak" }, why: "+3 skills, 40% FCR and up to +40 all resistances." },
      ],
      exitCriteria:
        "Farming Chaos Sanctuary or Travincal reliably, 125% Faster Cast Rate, 75% resistances, maximum block. The journey is over and the game has started.",
    },
  ],
  confidence: "verified",
};
