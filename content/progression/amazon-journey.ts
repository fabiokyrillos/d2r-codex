import type { ProgressionJourney } from "@/lib/types";

/**
 * The Amazon leveling journey.
 *
 * A third shape again. The Sorceress journey is organised around a planned
 * identity change at 30; the Paladin's has no respec at all because Blessed
 * Hammer arrives at 18 and is immediately strong. The Amazon's problem is
 * neither: **her two best endgame skills unlock at level 30**, and everything
 * before them is genuinely good.
 *
 * So this route is not "level as something else and swap". It is "level as the
 * bow tree, because Multiple Shot at 6 and Guided Arrow at 18 are complete
 * skills, and then decide at 30 whether the character you have is the character
 * you want". Five of the eight Amazon builds on this site need no respec at
 * all; three do, and the plan says which and why.
 *
 * `targetBuild` is the Lightning Fury Amazon because it is the build most
 * readers arrive looking for and the one whose route needs the most warning —
 * not because it is the one this journey recommends for a first character.
 */
export const amazonJourney: ProgressionJourney = {
  classSlug: "amazon",
  targetBuild: "lightning-fury-amazon",
  summary:
    "Level with the bow, because Multiple Shot works at level 6. Decide at 30 — that is where Lightning Fury, Freezing Arrow and Valkyrie all unlock at once.",
  overview: [
    "**The Amazon's whole leveling problem is level 30.** Lightning Fury, Lightning Strike, Freezing Arrow, Valkyrie and Pierce all unlock there, and every one of them is somebody's endgame skill. Before 30 you are playing something else, and the question is what.",
    "The answer this journey gives is **the bow tree**, for a reason that has nothing to do with taste: Multiple Shot is available at level 6, costs four mana, and fires a spread of arrows that clears the whole of Normal. Guided Arrow at 18 kills anything that survives it. Nothing else the class has arrives that early or works that well unmodified.",
    "**Whether you respec at 30 depends entirely on which build you are going to.** The three bow builds and the two physical spear ones need no respec at all — you have been playing them since level 6. The javelin builds do, and the poison one is somewhere in between. The respec plan below says which, and the Den of Evil quest gives one free token per difficulty, so none of it costs anything.",
    "Resistances matter as much for this class as for any other. Nightmare applies −40 to all of them and Hell applies −100. The Amazon can carry a shield, which makes the fix cheaper for her than for a Sorceress — an Ancient's Pledge is three Countess runes.",
  ],
  respecPlan: [
    {
      at: "Never, if you are going to a bow build",
      why: "Multiple Shot, Guided Arrow, Strafe, Freezing Arrow and Exploding Arrow are all reachable without unlearning anything. You have been levelling the finished character since level 6.",
    },
    {
      at: "Never, if you are going to Jab and Fend",
      why: "Jab is available at level 1 and Fend at 24. This build has no synergies to arrange and nothing to undo.",
    },
    {
      at: "Level 30, if you are going to a javelin build",
      why: "Lightning Fury and Lightning Strike both unlock at 30 and both want four maxed skills underneath them. Points spent on the bow tree while you waited are not part of that plan, so this is the respec the Den of Evil token in Normal exists for.",
    },
    {
      at: "Keep at least one token permanently",
      why: "The Amazon has more genuinely different endgame builds than any class on this site, and they share a great deal of gear. A spare token is what lets you try the other one on the character you already have.",
    },
  ],
  stages: [
    {
      slug: "ama-act-1-normal",
      name: "Bow from the first hour",
      classSlug: "amazon",
      summary: "Levels 1-11. Multiple Shot at 6 is the whole early game, and it costs four mana.",
      levels: [1, 11],
      difficulty: "normal",
      location: "Act 1 — Rogue Encampment through the Monastery",
      goal: "Clear the Den of Evil, reach level 12, and kill Andariel.",
      killingWith: "Magic Arrow until level 6, then Multiple Shot at everything.",
      order: 1,
      skillPoints: [
        "Level 1: **Magic Arrow**. It creates its own arrow, so it never empties a quiver — which matters when arrows cost gold you do not have.",
        "Level 6: **Multiple Shot**. Two arrows plus one per level, four mana, and it clears the rest of Normal on its own.",
        "Spend spares on **Critical Strike**. It is a percentage that works from the first point and no build here ever regrets it.",
        "**Do not put points in Jab or Power Strike unless you know you are going javelin.** They are fine skills; they are just not the ones carrying you to 30.",
      ],
      statPoints: [
        "**Dexterity** to hold the best bow you can find, then **Vitality**.",
        "Some Strength for armor, and no more than the armor needs.",
        "No Energy. Multiple Shot is four mana.",
      ],
      actions: [
        {
          kind: "quest",
          text: "Clear the **Den of Evil** completely. Akara gives **+1 skill point** and a **free full respec**.",
        },
        {
          kind: "tip",
          text: "Save the respec token. If you end up going javelin at 30, this is the one you will spend.",
        },
        {
          kind: "shop",
          text: "Shop **Charsi** and **Akara** for bows. A magic bow with +2 or +3 to a Bow and Crossbow skill is worth more than any drop you will see before Act 3.",
        },
        {
          kind: "quest",
          text: "Kill **Blood Raven** for a free Rogue Scout. Take the Cold variant — the chill is real defence at this level, and she is the mercenary two of the eight Amazon builds keep permanently.",
          optional: true,
        },
        {
          kind: "gear",
          text: "Keep any 2-socket body armor for a **Stealth** at level 17.",
          refs: [{ kind: "runeword", slug: "stealth" }],
        },
        {
          kind: "tip",
          text: "Pick up every javelin and spear you find, whatever you intend to play. They stack, they sell, and a magic one with +Javelin and Spear Skills is the whole starter weapon for three of the eight builds.",
        },
      ],
      exitCriteria: "Andariel dead, level 12+, and a bow you are not embarrassed by.",
    },

    {
      slug: "ama-act-2-normal",
      name: "The elemental fork",
      classSlug: "amazon",
      summary: "Levels 12-17. Exploding Arrow at 12 is the first real choice, and Stealth arrives at 17.",
      levels: [12, 17],
      difficulty: "normal",
      location: "Act 2 — Lut Gholein, the deserts and the tombs",
      goal: "Reach level 18 and kill Duriel.",
      killingWith: "Multiple Shot, and Exploding Arrow from 12 if you took it.",
      order: 2,
      skillPoints: [
        "Level 12: **Exploding Arrow** if you are heading for the fire build, or **Impale** if you are heading for the spear one — 300% weapon damage for a single point is the best rate the class has.",
        "Otherwise keep feeding **Multiple Shot** and **Critical Strike**.",
        "**Cold Arrow** is worth a point regardless. It chills, which is defence you have no other source for, and it is Guided Arrow's prerequisite.",
      ],
      statPoints: [
        "Dexterity for the bow, Vitality for everything else.",
        "**Decide now whether you want a shield.** If you do, Strength and Dexterity both matter more from here, and an Ancient's Pledge at level 21 is three Countess runes.",
      ],
      actions: [
        {
          kind: "gear",
          text: "Make a **Stealth** the moment you hit 17. Faster hit recovery and run speed are what an Amazon lacks and what keeps her alive.",
          refs: [{ kind: "runeword", slug: "stealth" }],
        },
        {
          kind: "quest",
          text: "**Radament** gives a free skill point. Do not skip him.",
        },
        {
          kind: "mercenary",
          text: "If you would rather have an Act 2 Desert Mercenary, this is where you hire one. **Might** for damage, **Holy Freeze** for safety. The aura is fixed by the difficulty you hire in and never changes.",
        },
        {
          kind: "gear",
          text: "Farm the **Countess** for runes. Every Amazon runeword on this site — Edge, Peace, Melody, Ancient's Pledge, Spirit, Insight — is made from what she drops.",
          refs: [{ kind: "rune", slug: "amn" }, { kind: "rune", slug: "shael" }],
        },
      ],
      exitCriteria: "Duriel dead, level 18, and a Stealth on your back.",
    },

    {
      slug: "ama-act-3-4-normal",
      name: "Guided Arrow and the Valkyrie chain",
      classSlug: "amazon",
      summary:
        "Levels 18-24. Guided Arrow cannot miss, and the seven points toward Valkyrie start paying immediately.",
      levels: [18, 24],
      difficulty: "normal",
      location: "Act 3 and Act 4 — Kurast to the River of Flame",
      goal: "Kill Diablo and reach level 24.",
      killingWith: "Multiple Shot for packs, Guided Arrow for anything that survives it.",
      order: 3,
      skillPoints: [
        "Level 18: **Guided Arrow**. It seeks its target and cannot miss, which is what makes Act 3's ranged packs and Act 4's bosses manageable.",
        // Two branches, not one list. Valkyrie's prerequisites are Decoy AND
        // Evade; naming four of the seven skills read as though Avoid were the
        // last step, which would leave a reader at 30 with Valkyrie still
        // locked. The summary above already counted seven.
        "**Start the Valkyrie chain now.** It is seven points in two branches that meet at 30: Inner Sight (1) → Slow Missiles (12) → **Decoy** (24), and Dodge (6) → Avoid (12) → **Evade** (24). Valkyrie needs Decoy *and* Evade, so both branches have to be finished — and every point along the way is worth having on its own.",
        "**Slow Missiles is the most underrated point in the class.** One point, and Act 3's dart-throwing packs stop being dangerous.",
      ],
      statPoints: [
        "Dexterity and Vitality. If you are running a shield, enough Dexterity for the block chance to be worth having.",
      ],
      actions: [
        {
          kind: "quest",
          text: "**The Golden Bird** gives a permanent +20 life. **Lam Esen's Tome** gives +5 stat points, not a skill point. Both are quick.",
        },
        {
          kind: "gear",
          text: "Make an **Edge** if you find a 3-socket bow at 25 — Tir, Tal, Amn, and it carries you to the Melody at 39.",
          refs: [{ kind: "runeword", slug: "edge" }],
        },
        {
          kind: "gear",
          text: "A **Peace** at 29 is +2 Amazon skills for three cheap runes, and it is the best body armor most Amazons will wear before Hell.",
          refs: [{ kind: "runeword", slug: "peace" }],
        },
        {
          kind: "warning",
          text: "**Do not spend the Den of Evil respec yet.** If you are going javelin, level 30 is where you will want it, and the Normal token is the cheapest of the three.",
        },
        {
          kind: "quest",
          text: "The **Hellforge** in Act 4 gives a rune. In Normal it is a low one; take it and move on.",
        },
      ],
      exitCriteria: "Diablo dead, level 24, and Decoy available.",
    },

    {
      slug: "ama-act-5-normal",
      name: "Level 30, and the decision",
      classSlug: "amazon",
      summary:
        "Levels 24-32. Fend, Strafe and Immolation Arrow at 24; Lightning Fury, Lightning Strike, Freezing Arrow, Valkyrie and Pierce all at 30.",
      levels: [24, 32],
      difficulty: "normal",
      location: "Act 5 — Harrogath to the Worldstone Chamber",
      goal: "Kill Baal, reach level 30, and choose the build you are actually playing.",
      killingWith: "Multiple Shot and Guided Arrow, or Strafe from 24 if that is where you are going.",
      order: 4,
      skillPoints: [
        "Level 24: **Strafe**, **Fend** or **Immolation Arrow**, depending on the build. Strafe's shots cap at ten at skill level 7, so do not pour points into it expecting more.",
        "**Level 30 is the fork.** Lightning Fury, Lightning Strike, Freezing Arrow, Valkyrie and Pierce all unlock here.",
        "**If you are going javelin, spend the Den of Evil respec now** and rebuild into Power Strike, Lightning Bolt, Charged Strike and the skill you are naming the character after.",
        "**If you are going bow or spear, spend nothing.** Take Valkyrie, take Pierce if your build wants it, and carry on.",
      ],
      statPoints: [
        "Enough Strength and Dexterity for the endgame weapon you have chosen — a Hydra Bow is 134 and 167, a Ward Bow is 72 and 146, and a javelin is neither.",
        "Everything else into Vitality. Nightmare is next and it applies −40 to every resistance you have.",
      ],
      actions: [
        {
          kind: "quest",
          text: "**Rescue on Mount Arreat** gives a skill point. **Prison of Ice** gives a free full respec — a second token, and the reason you can afford to experiment at 30.",
        },
        {
          kind: "respec",
          text: "**Javelin builds respec here.** Everything you spent on the bow tree comes back, and Power Strike, Lightning Bolt and Charged Strike are what it goes into.",
        },
        {
          kind: "gear",
          text: "Ancients' Pledge if you are carrying a shield. Three runes, and it is what makes Nightmare's −40 survivable.",
          refs: [{ kind: "runeword", slug: "ancients-pledge" }],
        },
        {
          kind: "warning",
          text: "**Nightmare applies −40 to all resistances the moment you enter.** Fix them in Normal, not in Act 2 of Nightmare when things start killing you.",
        },
        {
          kind: "tip",
          text: "Run **Baal** at the end of Normal for the levels. Getting to 30 before Nightmare makes the whole difficulty easier.",
        },
      ],
      exitCriteria: "Baal dead, level 30+, resistances heading for 75%, and the build decided.",
    },

    {
      slug: "ama-nightmare",
      name: "Nightmare, and the first real gear",
      classSlug: "amazon",
      summary:
        "Levels 32-60. Titan's Revenge, Melody and a Valkyrie who survives. Resistances are the whole difficulty.",
      levels: [32, 60],
      difficulty: "nightmare",
      location: "Nightmare, Act 1 through Act 5",
      goal: "Reach level 60 with 75% resistances and the build's core skills maxed.",
      killingWith: "Whichever main skill you chose at 30, with its first synergy climbing.",
      order: 5,
      skillPoints: [
        "**Max the main skill first, then its synergy.** Which synergy that is depends on the build, and every build page names it in the maxing order — Cold Arrow for Freezing Arrow, Fire Arrow for Exploding Arrow, Lightning Bolt for the javelins, Guided Arrow for Strafe.",
        "**One point in Valkyrie is enough** at this stage; the +skills from gear raise her. Points in Decoy raise her life, which is the reason to spend more than one.",
        "Keep feeding **Critical Strike** if your damage is physical, and **Penetrate** if you are missing.",
      ],
      statPoints: [
        "Enough Strength for the shield or the belt you are heading toward — a Thundergod's Vigor is 110 and a Stormshield is 156.",
        "Dexterity for maximum block if you carry a shield. The Amazon shares the Paladin's block table, so it is cheaper for her than for anyone but him.",
        "Everything else into Vitality.",
      ],
      actions: [
        {
          kind: "gear",
          text: "**Titan's Revenge** is the javelin the two javelin builds and the poison one all want. It refills itself, which is what makes a throwing build playable.",
          refs: [{ kind: "unique", slug: "titans-revenge" }],
        },
        {
          kind: "gear",
          text: "**Melody** at level 39 is +3 to the whole Bow and Crossbow tab plus +3 each to Critical Strike, Dodge and Slow Missiles, for three low runes. Twelve skill levels.",
          refs: [{ kind: "runeword", slug: "melody" }],
        },
        {
          kind: "gear",
          text: "**Razortail** is 33% Piercing Attack for 20 Strength — and it is worth nothing at all to Charged Strike, Lightning Strike, Jab or Fend, which never fire a projectile.",
          refs: [{ kind: "unique", slug: "razortail" }],
        },
        {
          kind: "gear",
          text: "An **Insight** on the mercenary. Freezing Arrow costs 36 mana and rises; every other Amazon skill is cheaper, but none of them is free.",
          refs: [{ kind: "runeword", slug: "insight" }],
        },
        {
          kind: "farm",
          text: "**Countess** and **Andariel** on Nightmare. The runes make everything above and Andariel is the shortest boss run in the game.",
        },
        {
          kind: "warning",
          text: "**Hell applies −100 to every resistance.** Sitting at exactly 75% in Nightmare means −25% in Hell. Over-cap before you cross.",
        },
      ],
      gearTargets: [
        { ref: { kind: "runeword", slug: "peace" }, why: "+2 Amazon skills for three cheap runes, and 20% Faster Hit Recovery." },
        { ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, attack rating and Dexterity — three things every Amazon build wants." },
        { ref: { kind: "unique", slug: "razortail" }, why: "33% pierce, for the builds that fire a projectile." },
      ],
      exitCriteria: "Level 60, main skill and first synergy maxed, resistances over 75% in Nightmare.",
    },

    {
      slug: "ama-hell",
      name: "Hell, and the immunity you have to answer",
      classSlug: "amazon",
      summary:
        "Levels 60-85. Every Amazon build meets a wall in Hell, and each one answers it differently.",
      levels: [60, 85],
      difficulty: "hell",
      location: "Hell, Act 1 through Act 5",
      goal: "Farm Hell reliably, and buy the one thing your build cannot do without.",
      killingWith: "The finished build, plus whatever it carries for the things it cannot hurt.",
      order: 6,
      skillPoints: [
        // Amazon only. Other classes on this site range from 67 to 107, so the
        // site-wide version of this sentence was false for most of them.
        "Finish the maxing order on your build's page. Every Amazon plan on this site spends 108 or 109 of the 110 hard points a level 99 character has, so the last few are the flexible ones.",
        "**The passives are where a struggling character finds survivability.** Dodge, Avoid and Evade all have diminishing curves, so the first extra points in them are worth far more than the last.",
      ],
      statPoints: [
        "Whatever the endgame weapon and shield require, and Vitality with the rest.",
        "**Stop adding Dexterity once maximum block is reached.** Past that it buys attack rating and weapon damage, which is real but far cheaper elsewhere.",
      ],
      actions: [
        {
          kind: "warning",
          text: "**Each Amazon build has exactly one wall.** Lightning builds have no mastery, so they need Griffon's Eye, Thunderstroke or an Infinity. Physical builds need Amplify Damage, Decrepify or a Bone Break. Fire builds are the most resisted of all and lean on Guided Arrow.",
        },
        {
          kind: "gear",
          text: "**Fortitude** is the largest single upgrade for every physical build and for Lightning Strike, whose weapon half spends Enhanced Damage. It does nothing at all for Lightning Fury's bolts.",
          refs: [{ kind: "runeword", slug: "fortitude" }],
        },
        {
          kind: "gear",
          text: "**Dracul's Grasp** for anything in melee range, and **Atma's Scarab** for anything physical. Both are cheap and both change what the build can fight.",
          refs: [
            { kind: "unique", slug: "draculs-grasp" },
            { kind: "unique", slug: "atmas-scarab" },
          ],
        },
        {
          kind: "farm",
          text: "**The Pit, the Ancient Tunnels and the Mausoleum** are the three area level 85 zones an Amazon can reach early. Which suits you depends on your damage type — the immunity list on each area's page is the thing to read.",
        },
        {
          kind: "gear",
          text: "A **Sunder Charm** is the direct answer to your build's immunity, and every one of them costs you something. Read the charm's own page before picking one up.",
          refs: [{ kind: "unique", slug: "bone-break" }],
        },
        {
          kind: "tip",
          text: "**A second Amazon build is cheaper than a second character.** Titan's Revenge, Raven Frost, Fortitude and a Peace cover half the gear of six of the eight builds, and a spare respec token covers the rest.",
        },
      ],
      gearTargets: [
        { ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage for every build whose damage is the weapon's." },
        { ref: { kind: "unique", slug: "griffons-eye" }, why: "−15-20% enemy lightning resistance, applied only to targets that are not immune." },
        { ref: { kind: "runeword", slug: "faith" }, why: "A Fanaticism aura in a bow — attack speed, attack rating and damage at once." },
      ],
      exitCriteria:
        "Farming a Hell area level 85 zone reliably, resistances at 75%, and an answer in hand for the one immunity your build cannot get past.",
    },
  ],

  confidence: "verified",
};
