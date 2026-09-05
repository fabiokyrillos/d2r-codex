import type { ProgressionJourney } from "@/lib/types";

/**
 * The Assassin's journey: fire to level 45, one respec, lightning to the end.
 *
 * WHY THE ROUTE IS FIRE, AND WHY THE RESPEC IS WHERE IT IS
 * -------------------------------------------------------
 * Every lightning trap this class owns has a **minimum damage of 1 at every
 * level**. Computed from the graph with the site's own `damageAtLevel`, at
 * twenty-four points — a level-23 character with the Den of Evil and Radament
 * rewards — the two candidate routes are:
 *
 *   Wake of Fire 13, Fire Blast 11 feeding it       71-81 per wave
 *   Charged Bolt Sentry 11, Fire Blast 1 feeding it  1-43 per bolt
 *
 * and at the far end, Lightning Sentry with both synergies maxed is 8-2574.
 * That is the whole argument. Lightning is a lottery ticket that only pays once
 * about sixty points are in it; fire is a wage from level 12. So the character
 * levels on fire and changes once.
 *
 * THE ARITHMETIC, WHICH CLOSES
 * ----------------------------
 * A character has `level - 1` points from levelling and 4 more per difficulty
 * from quests — Den of Evil 1, Radament 1, Izual 2.
 *
 *   L13  Den of Evil                       12 +  1 = 13
 *   L26  + Radament, Izual (Normal done)   25 +  4 = 29
 *   L40  + Nightmare Den, Radament         39 +  6 = 45
 *   L45  + Nightmare Izual                 44 +  8 = 52   <- THE RESPEC
 *   L70  + Hell Den, Radament              69 + 10 = 79
 *   L85  + Hell Izual (all twelve)         84 + 12 = 96
 *   L99                                    98 + 12 = 110
 *
 * And 52 is exactly what the lightning opening costs:
 *
 *   Fire Blast 1, Shock Web 1, Charged Bolt Sentry 20, Lightning Sentry 20,
 *   Death Sentry 1                                                      = 43
 *   Claw Mastery, Burst of Speed, Fade, Weapon Block, Psychic Hammer,
 *   Cloak of Shadows, Shadow Warrior, Mind Blast, Shadow Master, 1 each  =  9
 *                                                                        ---
 *                                                                         52
 *
 * There is no point left over and none missing, which is why the respec is
 * placed at Nightmare Act 4 rather than wherever the fire damage runs out.
 * Every prerequisite is satisfied at level 45: Death Sentry needs 30, Shadow
 * Master needs 30, Mind Blast needs 24, and the whole trap chain is one point
 * per rung.
 *
 * WHY DEATH SENTRY IS MAXED LAST
 * ------------------------------
 * Its corpse explosion is **40-80% of the monster type's base life and does not
 * scale with skill level** — `mon death sentry` Param1 and Param2, flat, the
 * same shape the site already publishes for the Necromancer's Corpse Explosion
 * at 70-120%. One point buys the entire chain reaction. Levels there buy the
 * radius (5 yards, +0.5 per level) and the lightning bolts, both of which are
 * worth less than the 18% per point that Shock Web and Charged Bolt Sentry add
 * to Lightning Sentry.
 */
export const assassinJourney: ProgressionJourney = {
  classSlug: "assassin",
  summary:
    "Level on fire from the first point, respec once at Nightmare Act 4 around level 45, and finish on lightning traps. The two halves of the trap tree share no synergy, so this is a real change of character rather than a re-spend.",
  overview: [
    "**You do not level as a Lightning Trapsin.** Lightning Sentry unlocks at 24 and Death Sentry at 30, and both are close to worthless until Shock Web and Charged Bolt Sentry are behind them — forty points later. Every lightning trap has a minimum damage of 1 at every level, so a half-funded one does not deal half damage; it deals a number between 1 and something, mostly closer to 1.",
    "Level on fire instead. Fire Blast works from level 1 and is the prerequisite for both branches anyway, so the first eleven points are forced rather than chosen. Wake of Fire arrives at 12 and **Fire Blast feeds it at 10% per hard point**, which means nothing you have already spent is wasted the moment you switch to it.",
    "**The respec is at Nightmare Act 4, after Izual, at level 45.** That is not a feel. Fifty-two points is exactly what the lightning opening costs, and fifty-two is exactly what a level-45 character with every Normal and Nightmare quest reward has. Respec earlier and Charged Bolt Sentry is not maxed; respec later and you have spent levels on a tree you are about to abandon.",
    "The one thing to internalise about the finished character: **five traps, total, shared between every sentry skill you own.** It is not five of each. A bar running Lightning Sentry and Death Sentry together is dividing the same five, which is why the endgame rotation is four and one rather than five and five.",
    "The other thing: **resistances, not damage, are what stop you.** Nightmare applies -40% to all of yours and Hell -100%. Fade is the Assassin's answer and it is one point in this plan for most of the game — but Fade and Burst of Speed cannot both be up, so from the moment you take Fade you are choosing one per fight.",
  ],
  respecPlan: [
    {
      at: "Nightmare Act 4, level 45 — after Izual, using the Nightmare Den of Evil token",
      why: "The one respec the route needs, and the arithmetic is the reason for the level. 52 points come back and the lightning opening costs exactly 52: Charged Bolt Sentry 20, Lightning Sentry 20, three points of chain, and the nine-point Shadow suite.",
    },
    {
      at: "Keep the Normal token unspent",
      why: "Nothing in this route needs it, and a spare respec is worth more than anything you could do with it at level 20. It is also the safety net if you take the fire route further than planned and want to correct at Hell rather than Nightmare.",
    },
    {
      at: "Optional — Hell Act 1",
      why: "The Hell Den of Evil token is the second try if the level-45 respec left you awkwardly split. By then you know whether you want Fade, Shadow Master or Fire Blast for the last twenty points, and this is where you can change that answer for free.",
    },
  ],
  stages: [
    {
      slug: "ass-act-1-normal",
      name: "A bomb in each hand",
      classSlug: "assassin",
      summary: "Levels 1-13. Fire Blast from the first point, and the two Shadow prerequisites that everything later hangs off.",
      levels: [1, 13],
      difficulty: "normal",
      location: "Act 1 — Blood Moor through the Catacombs",
      goal: "Clear the Den of Evil, reach Fire Blast 11, and keep the respec token.",
      killingWith: "Fire Blast, thrown into the middle of a group.",
      skillPoints: [
        "**Fire Blast to 11** — one point at level 1, one per level to 11, plus the Den of Evil reward.",
        "**Claw Mastery 1** and **Burst of Speed 1** at levels 6 and 7. Two points, and they are not optional: Claw Mastery is the gate on everything in the Shadow tree you will ever want, and Burst of Speed is the prerequisite for Fade — which replaces it, because casting either one drops the other.",
        "That is 13 points: 12 from levels 2-13, and 1 from the Den of Evil.",
        "**Do not put a point in Shock Web at 6.** It is on the lightning branch, and the respec at 45 is where that branch starts.",
      ],
      statPoints: [
        "Everything into **Vitality**. The Assassin starts with 20 in each of Strength, Dexterity and Vitality and 25 Energy, and 3 life per Vitality point.",
        "No Energy. Fire Blast costs almost nothing and mana potions are free.",
        "Strength only when a specific piece of armour asks for it, and then only exactly enough.",
      ],
      actions: [
        {
          kind: "quest",
          text: "Clear the **Den of Evil** completely for the skill point and the free respec token. Talk to Akara afterwards — the point is not automatic.",
        },
        {
          kind: "tip",
          text: "**Fire Blast is thrown, not laid.** It arcs to where you aim it and explodes in a radius of 5, so it is a grenade rather than a trap. Throw it into the middle of a group rather than at the nearest thing.",
        },
        {
          kind: "tip",
          text: "**Burst of Speed makes you throw faster, not just run faster.** Fire Blast uses the attack rate, and Burst of Speed adds 15% to it at one point. That is why one early point in it is worth more than it looks.",
        },
        {
          kind: "gear",
          text: "Any claw with **+ to Traps** or **+ to Fire Blast** beats any claw with better damage. Charsi and Gheed restock every time you re-enter town, and a magic claw with +2 Traps is a common early roll.",
        },
        {
          kind: "farm",
          text: "Run **the Countess** for Tal, Eth, Ral and Ort. They build Stealth and Leaf, which are the two items that carry this character through Normal.",
          refs: [
            { kind: "runeword", slug: "stealth" },
            { kind: "runeword", slug: "leaf" },
          ],
        },
        {
          kind: "mercenary",
          text: "Kill **Blood Raven** and take Kashya's free Rogue Scout. A ranged body that shoots things is worth having even though the Act 2 mercenary replaces her later.",
        },
        {
          kind: "warning",
          text: "Do not spend a point on Tiger Strike, Dragon Talon or anything else in the Martial Arts tree \"just in case\". Nothing in this route ever uses it, and the respec at 45 is priced to the point.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "stealth" },
          why: "25% faster run, cast and hit recovery from level 17, for two Countess runes. The hit recovery is the half that keeps you alive.",
        },
        {
          ref: { kind: "runeword", slug: "leaf" },
          why: "**+3 to Fire Skills** in a two-socket staff at level 19 — that is +3 Fire Blast and, from level 12, +3 Wake of Fire, for a Tir and a Ral.",
        },
      ],
      exitCriteria: "Andariel is dead, Fire Blast is at 11, and you are holding an unspent respec token.",
      order: 1,
    },

    {
      slug: "ass-acts-2-5-normal",
      name: "The floor catches fire",
      classSlug: "assassin",
      summary: "Levels 13-26. Wake of Fire from 12, and Normal finished on it.",
      levels: [13, 26],
      difficulty: "normal",
      location: "Acts 2 to 5 — Lut Gholein through the Worldstone Keep",
      goal: "Get Wake of Fire to 16, hire the mercenary you will keep, and finish Normal.",
      killingWith: "Wake of Fire laid in doorways, and Fire Blast on whatever walks around it.",
      skillPoints: [
        "**Everything into Wake of Fire**, from 1 at level 12 to 16 by level 26.",
        "That is 29 points spent in total: 25 from levels, plus Den of Evil, Radament and Izual. Fire Blast 11, Claw Mastery 1, Burst of Speed 1, Wake of Fire 16.",
        "**Fire Blast stays at 11 for now.** It feeds Wake of Fire at 10% per hard point and Wake of Fire feeds it back at the same rate, so the two rise together later — but Wake of Fire is the one that fights for you, and it is a trap.",
      ],
      statPoints: [
        "**Vitality**, still. The one exception is enough Strength for a body armour you actually want to wear.",
        "**Lam Esen's Tome in Act 3 gives 5 stat points** and it is easy to miss. Take the detour.",
        "No Dexterity. Weapon Block does not read it, and nothing in this plan needs to hit anything with a weapon.",
      ],
      actions: [
        {
          kind: "skill",
          text: "**Wake of Fire is a trap, and Fire Blast is not.** From here your damage is laid on the ground in advance and triggered by whatever walks over it, which is a completely different way of playing from the first twelve levels. Lay first, then pull.",
        },
        {
          kind: "tip",
          text: "**Five traps at once, shared across every sentry skill.** At this stage that means five Wake of Fires and nothing else, which is exactly what you want: they stack, so five in one doorway is five times the fire.",
        },
        {
          kind: "mercenary",
          text: "Hire an **Act 2 Desert Mercenary** on Nightmare difficulty when you get there, or the Normal one now if you would rather. Take the **Defiance** aura variant — a trapper's mercenary is a wall, not a damage source.",
        },
        {
          kind: "quest",
          text: "Do **Radament** in Act 2 and **Izual** in Act 4. That is three of the four skill points this difficulty owes you, and the route's arithmetic assumes all four.",
        },
        {
          kind: "runeword",
          text: "Make **Leaf** in a two-socket staff as soon as you have a Tir and a Ral. +3 to Fire Skills is +3 Wake of Fire and +3 Fire Blast at once, and it is the largest single upgrade this character gets before Nightmare.",
          refs: [{ kind: "runeword", slug: "leaf" }],
          atLevel: 19,
        },
        {
          kind: "warning",
          text: "A staff costs you **Weapon Block**, which needs a claw in each hand. On this route that is the right trade — you are not in melee and +3 Fire Skills is worth more than a block chance you will not use — but it is a trade, not free.",
        },
        {
          kind: "gear",
          text: "**Ancients' Pledge** in a three-socket shield if you would rather have resistances than the staff's skills. An Assassin can use a shield; she simply cannot block with claws while doing it.",
          refs: [{ kind: "runeword", slug: "ancients-pledge" }],
          optional: true,
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "lore" },
          why: "+1 to All Skills in a two-socket helm for an Ort and a Sol. Cheap, and it never stops being worth wearing until a Shako.",
        },
        {
          ref: { kind: "runeword", slug: "spirit" },
          why: "**+2 to All Skills and up to 35% faster cast** in a four-socket shield at level 25. The cast rate is for Mind Blast and Fade later, not for laying traps.",
        },
      ],
      exitCriteria: "Baal is dead, Wake of Fire is at 16, and all four Normal quest points are spent.",
      order: 2,
    },

    {
      slug: "ass-nightmare-early",
      name: "Both halves of the fire",
      classSlug: "assassin",
      summary: "Levels 26-40. Fire Blast and Wake of Fire both to 20, and the last three Shadow prerequisites.",
      levels: [26, 40],
      difficulty: "nightmare",
      location: "Nightmare Acts 1 to 3 — Rogue Encampment to Travincal",
      goal: "Max the fire pair, take the three Shadow points the respec will need anyway, and get resistances up before Act 4.",
      killingWith: "Five Wake of Fires stacked on a doorway, with Fire Blast for anything that will not walk into them.",
      skillPoints: [
        "**Wake of Fire 16 → 20** (+4), then **Fire Blast 11 → 20** (+9). Thirteen points, and they multiply each other: each feeds the other at 10% per hard point, so the pair maxed is worth far more than either maxed alone.",
        "**Psychic Hammer 1, Cloak of Shadows 1, Weapon Block 1** — three points. Every one of them is a prerequisite the post-respec plan pays for anyway, so taking them now costs the route nothing.",
        "That is 45 points at level 40: 39 from levels, plus 4 Normal quest points and the Nightmare Den of Evil and Radament.",
        "**Do not spend the Nightmare Den of Evil respec token here.** It is the one the plan uses at 45.",
      ],
      statPoints: [
        "**Vitality**, and now it matters. Nightmare applies -40% to every resistance you have.",
        "Enough Strength for a **Treachery** base if you are heading for one — a three-socket body armour, and Treachery arrives at level 43.",
        "Lam Esen's Tome again in Nightmare Act 3: another 5 stat points.",
      ],
      actions: [
        {
          kind: "skill",
          text: "**Cloak of Shadows blinds a whole screen and cuts its defence.** One point, and it is the button that makes Nightmare Act 3 survivable for a character with no life leech and no block.",
        },
        {
          kind: "warning",
          text: "**-40% to all resistances the moment you enter Nightmare.** A character sitting at 75% fire resist in Normal walks in at 35%. Fix this with charms and an Ancients' Pledge before Act 3, not after.",
        },
        {
          kind: "runeword",
          text: "Make **Treachery** in a three-socket body armour when you have Shael, Thul and Lem. **+2 to Assassin Skill Levels**, 45% attack speed, and a 5% chance to cast level 15 Fade when struck — which is Fade you did not have to press.",
          refs: [{ kind: "runeword", slug: "treachery" }],
          atLevel: 43,
        },
        {
          kind: "farm",
          text: "**Countess in Nightmare** for the mid runes, and **Lower Kurast** once you can clear it. Both are cheap runs for a character whose damage is laid rather than aimed.",
        },
        {
          kind: "tip",
          text: "Wake of Fire lays a **line** of fire waves travelling away from the trap, not a puddle. Face it down the corridor a pack will come from; a trap laid facing a wall does nothing.",
        },
        {
          kind: "mercenary",
          text: "Put **Insight** on the Act 2 mercenary if you have not. Meditation solves the Assassin's mana entirely, and it is four low runes in a four-socket polearm.",
          refs: [{ kind: "runeword", slug: "insight" }],
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "treachery" },
          why: "+2 Assassin Skill Levels for three mid runes, and a free Fade proc. The best value armour this class ever wears, and it arrives two levels before the respec.",
        },
        {
          ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
          why: "+1 skills, 30% faster cast and up to +35 all resistances if Treachery's runes are not there yet.",
        },
      ],
      exitCriteria: "Fire Blast and Wake of Fire are both at 20, Travincal is clear, and the Nightmare Den token is unspent.",
      order: 3,
    },

    {
      slug: "ass-the-respec",
      name: "Fifty-two points, exactly",
      classSlug: "assassin",
      summary: "Level 45, Nightmare Act 4. Fire out, lightning in, and the total lands on the nose.",
      levels: [40, 45],
      difficulty: "nightmare",
      location: "Nightmare Act 4 — the Outer Steppes to the Chaos Sanctuary",
      goal: "Kill Izual, take the two skill points, and respec at exactly 52.",
      killingWith: "Fire, right up to the moment you talk to Akara. Then five Charged Bolt Sentries.",
      skillPoints: [
        "**Kill Izual first.** He gives 2 skill points and the plan needs them: 44 from levels plus 8 from quests is 52, and 52 is what the opening costs.",
        "**Respec with the Nightmare Den of Evil token.** All 52 come back.",
        "Spend them: **Charged Bolt Sentry 20, Lightning Sentry 20**, then **Fire Blast 1, Shock Web 1, Death Sentry 1** — that is the chain, one point per rung, 43 in total.",
        "Then the Shadow suite, one point each: **Claw Mastery, Burst of Speed, Fade, Weapon Block, Psychic Hammer, Cloak of Shadows, Shadow Warrior, Mind Blast, Shadow Master**. Nine points. 43 + 9 = 52. Burst of Speed is bought as Fade's prerequisite rather than to run — casting either one drops the other.",
        "**Charged Bolt Sentry before Shock Web**, even though both feed Lightning Sentry at 18% per point. Charged Bolt Sentry is a trap that fires by itself while you are laying Lightning Sentries; Shock Web only does anything if you press it.",
      ],
      statPoints: [
        "Unchanged — a respec token returns skill points and attribute points together, so you can re-spend both. Put them back into Vitality and whatever Strength your armour asks for.",
        "If you took Strength for a heavy base you no longer want, this is the moment to take it back.",
      ],
      actions: [
        {
          kind: "respec",
          text: "**Talk to Akara in Nightmare Act 1** after clearing the Den of Evil there. The token is hers, and it works from anywhere in the difficulty once the quest is done.",
        },
        {
          kind: "transition",
          text: "**The character you are now playing is not the one you were.** Fire Blast was a grenade you aimed; Lightning Sentry is a turret you place and walk away from. The first hour after the respec feels worse than the hour before it, and that is expected.",
        },
        {
          kind: "skill",
          text: "**Mind Blast is the button that makes this work.** It stuns everything in a radius of 4 for 50 frames at one point, which is exactly long enough to lay five traps into a pack that cannot move.",
        },
        {
          kind: "warning",
          text: "**Fade and Burst of Speed cannot both be up.** From here Fade is what you run — resistances, curse length reduction and 1% physical damage reduction per level. Burst of Speed is for the kick builds, not this one.",
        },
        {
          kind: "tip",
          text: "**Charged Bolt Sentry is twenty points you will eventually stop casting.** Right now it is real damage; by the end of Hell the five-trap ceiling belongs to Lightning and Death Sentry and it becomes a pure synergy. That is not waste — 20 points of Charged Bolt Sentry is +360% Lightning Sentry damage — but it is worth knowing before it happens.",
        },
        {
          kind: "gear",
          text: "Swap the Leaf staff for **claws**. From here nothing you cast is fire, the +3 does nothing, and a claw with **+3 Lightning Sentry** or **+2 Traps** is the item to hunt.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "spirit" },
          why: "In a four-socket shield: +2 all skills and up to 35% cast rate. The cast rate is for Mind Blast and Fade — trap laying runs on attack speed, not cast rate.",
        },
        {
          label: "Magic or rare claw: +3 Lightning Sentry, +2 Traps",
          why: "Claw skill affixes are the largest source of Lightning Sentry levels in the game and they are cheap. A +3 Lightning Sentry / +3 Death Sentry claw is worth more than any unique the tier has.",
          lookFor: ["+3 to Lightning Sentry", "+3 to Death Sentry", "+2 to Traps"],
        },
      ],
      exitCriteria: "The skill screen reads 52 spent, 0 unspent, Lightning Sentry 20, and you have laid five of them on something.",
      order: 4,
    },

    {
      slug: "ass-nightmare-late-hell-early",
      name: "The second synergy, and the corpses",
      classSlug: "assassin",
      summary: "Levels 45-70. Shock Web to 20, Death Sentry to 9, and Hell to Travincal.",
      levels: [45, 70],
      difficulty: "hell",
      location: "Nightmare Act 5 through Hell Act 3",
      goal: "Finish the second Lightning Sentry synergy, get Death Sentry running, and reach 75% resistances.",
      killingWith: "Four Lightning Sentries and one Death Sentry, with Mind Blast to hold the pack still.",
      skillPoints: [
        "**Shock Web 1 → 20** (+19). The second 18%-per-point synergy. With both maxed Lightning Sentry is at +720%, which is the difference between 4-1500 per bolt and 8-2574.",
        "**Death Sentry 1 → 9** (+8). Twenty-seven points in total, and 52 + 27 = 79 — which is what a level-70 character with the Hell Den of Evil and Radament has.",
        "**Death Sentry's corpse explosion was already at full strength on one point.** It deals 40-80% of the monster type's base life and does not scale with the skill. What these eight points buy is radius and the lightning half.",
      ],
      statPoints: [
        "**Vitality with everything** the gear does not demand.",
        "Hell applies **-100%** to all resistances. The Lam Esen's Tome in Hell Act 3 is another 5 stat points and the third and last one.",
        "Enough Strength for a **Chains of Honor** base if that is where you are heading; nothing else on this route needs it.",
      ],
      actions: [
        {
          kind: "transition",
          text: "**Hell applies -100% to every resistance.** A character capped at 75% in Nightmare enters Hell at -25%. This is the single most common reason a trapper dies in Act 1 of Hell, and Fade at one point is only worth 10%.",
        },
        {
          kind: "skill",
          text: "**Lightning Sentry's bolts pierce.** That is why five sentries go on one spot rather than spread across a room, and why a corridor kills faster than an open cavern.",
        },
        {
          kind: "skill",
          text: "**One Death Sentry, not five.** Its corpse explosion chains through a whole room from one kill, and the other four slots are worth more as Lightning Sentries. This is the rotation the rest of the game uses.",
        },
        {
          kind: "warning",
          text: "**Lightning immunes are a wall, not a slow fight.** There is no lightning mastery on this class and Death Sentry's bolts are lightning too. Until you own an answer, the honest response in Hell is to walk past them — and the corpse explosion half of Death Sentry still works, because that is fire and physical.",
        },
        {
          kind: "farm",
          text: "**Countess, Lower Kurast and Travincal** in Hell. Travincal is a trapper's area: dense, enclosed, and everything walks into a doorway.",
        },
        {
          kind: "mercenary",
          text: "Keep **Insight** on the Act 2 mercenary and add a **Treachery** or **Fortitude** body when you can. His job is to hold a corridor while the traps do the work.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "unique", slug: "harlequin-crest" },
          why: "+2 all skills, life, mana and damage reduction. The best helm this build ever wears until a Griffon's, and it drops from Mephisto and the Pit.",
        },
        {
          label: "Small charms: lightning damage and resistances",
          why: "The cheapest route to 75% in Hell, and the lightning ones raise the trap damage directly.",
        },
      ],
      exitCriteria: "Shock Web is at 20, Death Sentry at 9, resistances are at 75%, and Travincal in Hell is a routine run.",
      order: 5,
    },

    {
      slug: "ass-hell-late",
      name: "Ninety points, and a decision",
      classSlug: "assassin",
      summary: "Levels 70-85. Death Sentry to 20, the core closed, and the first six points of the package that finishes the character.",
      levels: [70, 85],
      difficulty: "hell",
      location: "Hell Act 4 to the Worldstone Keep",
      goal: "Close the ninety-point core and start on the twenty that are left.",
      killingWith: "Four Lightning Sentries, one Death Sentry, Mind Blast between casts, and Fade running the whole time.",
      skillPoints: [
        "**Death Sentry 9 → 20** (+11). That closes the core: Fire Blast 1, Shock Web 20, Charged Bolt Sentry 20, Lightning Sentry 20, Death Sentry 20, plus nine Shadow points. **Ninety.**",
        "**Kill Izual in Hell** for the last 2 quest points. A level-85 character with all twelve has 96, so six of the twenty spare are already in hand.",
        "**Twenty points are left and they are a real decision.** Three routes are worth the whole budget and none is worth half of it: **Fade to 20** for resistances, curse length and 1% physical damage reduction per level; **Fire Blast to 20** for a second damage type that answers lightning immunes; **Shadow Master to 20** for a body that fights in front of you with resistances above the player cap. Nineteen points each, and one left over.",
      ],
      statPoints: [
        "Vitality, still. There is no dexterity breakpoint on this build and no block worth funding.",
        "The only Strength worth adding now is whatever a **Chains of Honor** or **Enigma** base asks for.",
      ],
      actions: [
        {
          kind: "skill",
          text: "**Fade's physical damage reduction is 1% per level**, on top of resistances that climb toward 75% and curse length cut by up to 90%. Nineteen more points in it is the reason Hardcore trappers reach level 95.",
          optional: true,
        },
        {
          kind: "skill",
          text: "**Fire Blast to 20 is the lightning-immunity answer.** It receives 11% per hard point from all five traps and this build maxes three of them, so nineteen points there buys a thrown bomb dealing 646-859 — a second damage type for no new prerequisites and no gear change.",
          optional: true,
        },
        {
          kind: "farm",
          text: "**The Pit, the Chaos Sanctuary and the Worldstone Keep.** All three are enclosed enough for stacked sentries, and all three drop what the build still wants.",
        },
        {
          kind: "warning",
          text: "**Do not spread the twenty points across all three.** Each of the three routes is worth taking whole; a character with seven points in each has none of them.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "chains-of-honor" },
          why: "+2 all skills and +65 all resistances. On a build whose only real weakness is dying to what it cannot kill, this is the armour.",
        },
        {
          ref: { kind: "runeword", slug: "enigma" },
          why: "Teleport, which turns a trapper from a build that walks to doorways into one that arrives at them.",
        },
      ],
      exitCriteria: "Ninety points of core are spent, the package is chosen, and Baal in Hell is a routine kill.",
      order: 6,
    },

    {
      slug: "ass-endgame",
      name: "One hundred and ten",
      classSlug: "assassin",
      summary: "Levels 85-99. The package finished, and the character closed at exactly 110.",
      levels: [85, 99],
      difficulty: "hell",
      location: "Terror Zones, the Pit, the Chaos Sanctuary, the Throne of Destruction",
      goal: "Finish the twenty, and stop.",
      killingWith: "The finished rotation. Nothing about it changes from here.",
      skillPoints: [
        "**Nineteen points into the package you chose**, and one left over. 90 + 19 + 1 = 110, which is what a level-99 character with every quest reward has.",
        "**The last point goes somewhere different in each route.** On the Fade route it is a second point of Shadow Master, which is worth more than a twenty-first point of anything. On the Fire Blast route it is Wake of Fire, which feeds Fire Blast another 10%. On the Shadow Master route it is Fade, because that route has bought a bodyguard and not a resistance.",
        "**There is nothing after 110.** Levels past 99 do not exist and the plan does not pretend otherwise; everything from here is gear.",
      ],
      statPoints: [
        "Vitality. There is no attribute breakpoint left to reach.",
        "If an Enigma is in the plan, its +0.75 Strength per character level pays for a heavier base than your own points ever would.",
      ],
      actions: [
        {
          kind: "gear",
          text: "**A claw with +3 Lightning Sentry, +3 Death Sentry and +2 Traps** is still the single largest damage item in the game for this build, and it is a magic or rare item rather than a runeword.",
        },
        {
          kind: "gear",
          text: "**Griffon's Eye** and lightning facets are the enemy-resistance stack. Facets in the helm and shield, and the -20% enemy lightning resistance on the Griffon's, compound with everything else.",
          refs: [{ kind: "unique", slug: "griffons-eye" }],
        },
        {
          kind: "farm",
          text: "**Terror Zones and the Throne of Destruction.** The build's clear speed in enclosed terrain is what it is for.",
        },
        {
          kind: "tip",
          text: "The five-trap ceiling never changes. If a run feels slow, the answer is almost always that you are laying traps where things will not walk, not that you need more points.",
        },
      ],
      exitCriteria: "110 of 110, with the package finished rather than split three ways.",
      order: 7,
    },
  ],
  confidence: "verified",
};
