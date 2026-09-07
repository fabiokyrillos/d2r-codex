import type { ProgressionJourney } from "@/lib/types";

/**
 * The Barbarian's journey: a mace through Normal, one respec at level 40, and
 * whichever weapon actually dropped for the rest of the game.
 *
 * WHY THE RESPEC EXISTS, AND WHY IT IS THE MASTERY RATHER THAN THE ATTACK
 * ----------------------------------------------------------------------
 * Where a journey on this site respecs at all, the reason is that its levelling
 * *damage skill* is not its endgame damage skill — the Sorceress leaves fire,
 * the Assassin leaves fire, the Druid leaves fire. Several never respec: the
 * Necromancer's route says "Never, for this route", the Paladin's "Usually
 * never", and two of the Amazon's three say "Never". So the Barbarian is not
 * unlike every other class; he is unlike the ones that respec, and for a reason
 * none of them share.
 *
 * A mastery is gated on an item type, and there are six of them. From
 * `itemtypes.json` at the pinned commit:
 *
 *   Mace Mastery      `blun`, and the equivalence chain runs blun -> rod, so it
 *                     covers clubs, hammers, maces AND scepters
 *   Blade Mastery     `blde`, "Swords and Knives"
 *   Axe Mastery       `axe`
 *   Polearm Mastery   `pole` — and nothing else; spears are a sibling type
 *   Spear Mastery     `spea`, which also reaches javelins
 *   Throwing Mastery  `thro`
 *
 * Twenty points in the wrong one is worth exactly nothing. And the weapon a
 * level-3 Barbarian can hold is not the weapon a level-40 one holds: at 3 you
 * buy a **scepter** from Akara, at 13 you socket **Steel** into a sword, axe or
 * mace — a scepter cannot hold it — and by Nightmare you are wearing whatever
 * base your first real runeword landed on.
 *
 * So the route commits to Mace Mastery early *because it covers the scepter you
 * can actually buy*, spends the rest on Bash, and undoes the guess once, at the
 * point where the weapon is known.
 *
 * THE ARITHMETIC, WHICH CLOSES
 * ----------------------------
 * A character has `level - 1` points from levelling and 4 more per difficulty
 * from quests — Den of Evil 1, Radament 1, The Fallen Angel 2.
 *
 *   L13  Den of Evil                        12 +  1 = 13
 *   L20  + Radament                         19 +  2 = 21
 *   L30  Normal quests done                 29 +  4 = 33
 *   L40  Nightmare quests done              39 +  8 = 47   <- THE RESPEC
 *   L55                                     54 +  8 = 62
 *   L75  Hell quests done                   74 + 12 = 86
 *   L99                                     98 + 12 = 110
 *
 * The pre-respec ledger is 13 + 8 + 12 + 14 = 47, and 47 is exactly what the
 * Whirlwind opening costs:
 *
 *   Whirlwind 20, the mastery your weapon actually is 6, Battle Orders 11   = 37
 *   Bash, Stun, Concentrate, Leap, Leap Attack — the two prerequisite
 *   chains Whirlwind needs, one point each                                 =  5
 *   Howl, Shout, Battle Command                                            =  3
 *   Increased Stamina, Iron Skin                                           =  2
 *                                                                           ---
 *                                                                            47
 *
 * Nothing is left over and nothing is missing. After it, 47 + 15 + 24 = 86 at
 * level 75, and the last 24 to level 99 belong to the build page.
 *
 * WHY BERSERK CARRIES NIGHTMARE AND WAR CRY DOES NOT
 * --------------------------------------------------
 * The obvious levelling answer for a Barbarian with a bad weapon is War Cry: it
 * carries **no `SrcDam` at all**, so its 30-40 at one point and 198-208 at
 * twenty are the whole of its damage and the weapon is irrelevant. That is real,
 * and it is why the main specialist guide respecs into it at 31.
 *
 * This route does not, for a reason the columns give: War Cry's synergies are
 * Howl, Taunt and Battle Cry at 6% each, and **five of the six published
 * Barbarian builds keep none of them**. Berserk is the other weapon-independent
 * answer — `calc4 = 100` under `EType = mag`, so all of its damage is delivered
 * as magic and a physical immune takes it in full — and Berserk is maxed on
 * three of the six. Its synergies are Howl and Battle Orders at 10% each, and
 * Battle Orders is a skill every one of the six maxes anyway.
 *
 * So Berserk is the levelling answer that survives the destination. A player
 * heading for the Singer should take the War Cry route instead, and the
 * transition stage says so.
 */
export const barbarianJourney: ProgressionJourney = {
  classSlug: "barbarian",
  targetBuild: "whirlwind-barbarian",
  summary:
    "Level on Bash with a scepter and Mace Mastery, pick up the shouts as they unlock, and respec once at level 40 into whatever weapon actually dropped. The respec is about the mastery, not the attack.",
  overview: [
    "**The Barbarian's levelling problem is not damage, it is committing twenty points to a guess.** A mastery only works on one family of weapon, there are six of them, and the weapon you can buy at level 3 is not the weapon you will be holding in Nightmare. Where another class on this site respecs, it is because its levelling skill is not its endgame skill — and several never respec at all. This one respecs for a reason no other route has: its levelling *weapon* is not its endgame weapon.",
    "So the early points go where they cannot be wasted. **Bash is the levelling skill you spend on and Double Swing is the one you press** — Double Swing has no damage of its own at all, its entire damage bonus is 10% per hard point of Bash, so points in Double Swing itself buy nothing.",
    "The mastery you take at level 3 is **Mace Mastery**, and that is not a preference. Akara sells scepters from the first town visit, and the item type Mace Mastery is gated on is the one the game calls Blunt — whose equivalence chain reaches clubs, hammers and maces, and through `rod` reaches **scepters, staves and wands** as well. Blade Mastery on a scepter does nothing.",
    "**Battle Orders at 24 is the biggest single purchase in the game.** +35% maximum life at one point and 3% more per level, on you, your mercenary and your party. Cast it before you heal, never after: it raises your maximum and does not scale the life you are already carrying up with it.",
    "The other thing to internalise: **resistances, not damage, are what stop you.** Nightmare applies −40% to all of yours and Hell −100%. Natural Resistance is the Barbarian's answer and it is added before the cap, which is why he can wear damage gear where another melee character wears resistance — but it unlocks at 30 and needs Iron Skin first.",
    "Everything below is reachable solo and self-found. Not one item here is something you need to trade for.",
  ],
  respecPlan: [
    {
      at: "Nightmare Act 4, level 40 — after The Fallen Angel, using the Nightmare Den of Evil token",
      why: "The one respec the route needs, and the level is arithmetic rather than feel. 47 points come back and the Whirlwind opening costs exactly 47: Whirlwind 20, six in the mastery your weapon actually is, Battle Orders 11, and ten single points of prerequisite and utility. Respec earlier and Whirlwind is not maxed; respec later and you have spent levels raising a mastery you are about to abandon.",
    },
    {
      at: "Keep the Normal token unspent",
      why: "Nothing in this route needs it. A spare respec is worth more than anything you could do with it at level 20, and it is the safety net if you find a weapon in Normal that changes the mastery answer early.",
    },
    {
      at: "Optional — Hell Act 1, and this is the one that picks your build",
      why: "The Hell Den of Evil token is where a Whirlwind character becomes a Frenzy, Berserk, Double Throw or Leap Attack one instead. By level 75 you know which weapons you actually have, and four of the six builds are a token away from each other.",
    },
  ],
  stages: [
    {
      slug: "bar-act-1-normal",
      name: "A scepter, and the one mastery that fits it",
      classSlug: "barbarian",
      summary: "Levels 1-13. Bash, a bought scepter, and the mastery whose item type covers it.",
      levels: [1, 13],
      difficulty: "normal",
      location: "Act 1 — Blood Moor through the Catacombs",
      goal: "Clear the Den of Evil, reach Bash 8, and keep the respec token.",
      killingWith: "Bash, and normal attacks against anything that does not need it.",
      skillPoints: [
        "**Bash 8.** It is +50% damage and 5% more per level plus a flat point per level, and it knocks things backwards, which on a character with no escape is defence as well as damage.",
        "**Mace Mastery 3.** +28% damage and 5% per level, +40% attack rating and 8% per level, and a critical strike chance climbing toward 35%. Attack rating is what actually fails in Act 1, not damage.",
        "**Double Swing, one point** at level 6, and never a second one. Its damage bonus is Bash's level times ten and nothing else — a point spent here raises it by zero.",
        "**Leap, one point** at level 6. It goes over walls and knocks back everything where it lands, and it is the only prerequisite Leap Attack has.",
        "That is 13 points: 12 from levels 2-13, and 1 from the Den of Evil.",
      ],
      statPoints: [
        "Everything into **Vitality**. The Barbarian starts with 30 Strength, 20 Dexterity, 25 Vitality and 10 Energy, and he gets **4 life per Vitality point** — the highest in the game.",
        "**No Energy, ever.** Bash costs 2 mana and Double Swing costs 1 and falls to nothing by level 9. Mana is not this class's problem in Normal and it is not this class's problem in Hell.",
        "Strength only when a specific piece of armour asks for it, and then exactly enough and no more.",
      ],
      actions: [
        {
          kind: "quest",
          text: "Clear the **Den of Evil** completely for the skill point and the free respec token. Talk to Akara afterwards — the point is not automatic.",
        },
        {
          kind: "shop",
          text: "**Buy a scepter from Akara** as soon as you can afford one, and re-check her stock every few levels. A scepter is a Blunt-class weapon, which is what Mace Mastery is gated on, and it is the only decent weapon on sale this early.",
        },
        {
          kind: "warning",
          text: "**Do not take Blade Mastery for a scepter.** Blade Mastery covers the item type the game calls Swords and Knives; a scepter is not in it, and the twenty points would do nothing at all. The masteries are gated on item types rather than on what the weapon looks like.",
        },
        {
          kind: "tip",
          text: "**Double Swing needs two weapons to do what it says** — it swings both, hitting two targets if two are there and one target twice if not. With a scepter and a shield it still works and still gets the +50% attack speed, but half of it is idle.",
        },
        {
          kind: "mercenary",
          text: "Hire the **Act 1 Rogue Scout** after Blood Raven and keep her fed with a bow. She is the only ranged damage this character has for the next twenty levels.",
          optional: true,
        },
      ],
      exitCriteria: "Andariel is dead, Bash is at 8, and the Normal respec token is still unspent.",
      order: 1,
    },
    {
      slug: "bar-act-2-normal",
      name: "Two Steels",
      classSlug: "barbarian",
      summary: "Levels 14-20. The first runewords, dual wield for real, and the shouts begin.",
      levels: [14, 20],
      difficulty: "normal",
      location: "Act 2 — Lut Gholein through the Tal Rasha's Tomb",
      goal: "Get two Steel weapons in your hands and Shout on your bar.",
      killingWith: "Double Swing with two Steel maces, and Bash on anything that survives it.",
      skillPoints: [
        "**Bash to 12.** Still the only thing raising Double Swing.",
        "**Mace Mastery to 5.**",
        "**Howl, one point.** It is a level-1 skill and it is here because it is Shout's only prerequisite — and because it will turn out to be Berserk's largest synergy at 10% per hard point.",
        "**Shout, one point** at level 6. +100% defence for you and your party, and its real value is that it extends Battle Orders by 5 seconds per hard point later.",
        "That is 21 points: 19 from levels, and 2 from the Den of Evil and Radament.",
      ],
      statPoints: [
        "**Vitality**, with just enough Strength for the armour you are actually wearing.",
        "Dexterity only if you are holding a shield and want the block chance. A dual-wielding Barbarian has no block at all, so on this route Dexterity is only ever a weapon requirement.",
      ],
      actions: [
        {
          kind: "quest",
          text: "**Radament** in the Halls of the Dead gives a skill point. He is easy to miss — the entrance is in the sewers under Lut Gholein.",
        },
        {
          kind: "runeword",
          text: "**Make two Steel weapons**, one for each hand. Tir + El in any 2-socket sword, axe or mace: +25% attack speed, +20% enhanced damage, +50 attack rating and 50% Open Wounds. It is available from level 13, so if you reached this act with the runes you can make both immediately — and two of them is the whole of this stage's damage.",
          refs: [{ kind: "runeword", slug: "steel" }],
        },
        {
          kind: "warning",
          text: "**Steel cannot go in a scepter.** Its bases are swords, axes and maces, and the entry excludes hammers and scepters explicitly. Put it in a flail or a similar Blunt-class mace and Mace Mastery still applies to both hands — that is the whole reason the mastery was chosen at level 3.",
          refs: [{ kind: "runeword", slug: "steel" }],
        },
        {
          kind: "runeword",
          text: "**Stealth at level 17** in any 2-socket body armour. Tal + Eth, and +25% faster run/walk on a class with no movement skill is worth more here than any defence number.",
          refs: [{ kind: "runeword", slug: "stealth" }],
          atLevel: 17,
        },
        {
          kind: "mercenary",
          text: "**Swap to the Act 2 Desert Mercenary** at the end of the act and take a **Might** one. His aura raises your physical damage, which is all of your damage, and he will hold Insight later.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "steel" },
          why: "Two of them. Available at 13, and the attack speed matters more than the damage on a skill that swings both hands.",
        },
        {
          ref: { kind: "runeword", slug: "stealth" },
          why: "Run speed and hit recovery from level 17, for two runes the Countess drops.",
        },
      ],
      exitCriteria: "Duriel is dead, two Steels are equipped, and Shout is on the bar.",
      order: 2,
    },
    {
      slug: "bar-acts-3-5-normal",
      name: "The shouts, and the chain to thirty",
      classSlug: "barbarian",
      summary: "Levels 21-30. Battle Orders arrives, and both prerequisite chains Whirlwind needs get their single points.",
      levels: [21, 30],
      difficulty: "normal",
      location: "Acts 3, 4 and 5 — Kurast to the Ancients",
      goal: "Battle Orders on the bar, both Whirlwind chains opened, and level 30 reached.",
      killingWith: "Double Swing, with Battle Orders up before every fight.",
      skillPoints: [
        "**Battle Orders 6** at level 24. This is the largest single upgrade the character ever gets: +35% maximum life at one point and 3% more per level, on you and the mercenary.",
        "**Stun, one point** at level 12, and **Concentrate, one point** at level 18. Neither is pressed. They are the chain Whirlwind needs, and Concentrate is also the answer to anything that resists magic later.",
        "**Leap Attack, one point** at level 18 — the other half of Whirlwind's prerequisites, and a gap-closer worth having on the bar for its own sake.",
        "**Increased Stamina, one point** at level 12 and **Iron Skin, one point** at level 18. Both are gates: Increased Stamina opens Increased Speed and Iron Skin opens Natural Resistance, and those are the two passives that matter in Hell.",
        "**Mace Mastery to 6.**",
        "That is 33 points: 29 from levels, and 4 from all three Normal quests.",
      ],
      statPoints: [
        "**Vitality**, still. A Barbarian's life is his damage mitigation.",
        "Enough Strength for the body armour you intend to wear in Nightmare, worked out now rather than discovered later.",
      ],
      actions: [
        {
          kind: "quest",
          text: "**The Fallen Angel** — killing Izual in Act 4 — gives two skill points, and it is the only quest in the game that gives more than one.",
        },
        {
          kind: "tip",
          text: "**Cast Battle Orders before you drink, not after.** It raises your maximum life by a percentage and does not scale the life you are currently carrying up with it, so shouting at full health and shouting at half health leave you in very different places.",
        },
        {
          kind: "runeword",
          text: "**Spirit at level 25** in a 4-socket sword is +2 to all skills, and a Crystal Sword is cheap. The catch is that it is a sword and your mastery is Mace — so it is a swap-weapon for the buff rather than something to fight with, until the respec decides otherwise.",
          refs: [{ kind: "runeword", slug: "spirit" }],
          atLevel: 25,
        },
        {
          kind: "runeword",
          text: "**Insight at level 27** for the mercenary, in a 4-socket polearm. Its Meditation aura is what stops you drinking mana potions for the rest of the game. **Not a spear** — polearms and spears are different item classes and this is the most common Insight mistake there is.",
          refs: [{ kind: "runeword", slug: "insight" }],
          atLevel: 27,
        },
        {
          kind: "runeword",
          text: "**Lore at level 27** in any 2-socket helm, including a Barbarian helm. Ort + Sol for +1 to all skills.",
          refs: [{ kind: "runeword", slug: "lore" }],
          atLevel: 27,
        },
        {
          kind: "warning",
          text: "**Do not put points in Whirlwind yet**, even though it unlocks at 30. It has no synergies in either direction — nothing raises it and it raises nothing — so a half-funded Whirlwind is just a slow attack, and the respec at 40 is where all twenty go at once.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "insight" },
          why: "On the mercenary. It ends the mana problem permanently and it costs four common runes.",
        },
        {
          ref: { kind: "runeword", slug: "lore" },
          why: "+1 to all skills in a helm you have probably already found.",
        },
        {
          ref: { kind: "runeword", slug: "ancients-pledge" },
          why: "If you are holding a shield: +43-48% to every resistance at level 21, which is most of the Nightmare penalty answered for three runes.",
        },
      ],
      exitCriteria: "Baal is dead, Battle Orders is at 6, and Stun, Concentrate, Leap and Leap Attack each have a point.",
      order: 3,
    },
    {
      slug: "bar-nightmare-1-4",
      name: "Berserk carries Nightmare",
      classSlug: "barbarian",
      summary: "Levels 31-40. The weapon-independent answer, and the respec at the end of it.",
      levels: [31, 40],
      difficulty: "nightmare",
      location: "Nightmare Acts 1 to 4 — the Den of Evil through Izual",
      goal: "Reach level 40 with all eight Nightmare and Normal quest points, then respec.",
      killingWith: "Berserk, which does not care what weapon you are holding or what is immune to physical.",
      skillPoints: [
        "**Berserk 10** at level 30. All of its damage is delivered as magic rather than part of it, so a physical immune takes it in full — and its synergies are Howl and Battle Orders at 10% per hard point each, both of which you already have points in.",
        "**Battle Command, one point** at level 30. +1 to all skills for you and the party, and it does not scale — the twentieth point grants exactly what the first does. Cast it before Battle Orders, so the shout that follows is a level higher.",
        "**Battle Orders to 9.**",
        "That is 47 points at level 40: 39 from levels, and 8 from every Normal and Nightmare quest.",
        "**Then respec.** The whole 47 comes back and the Whirlwind opening costs 47 exactly.",
      ],
      statPoints: [
        "**Vitality**, minus whatever the Nightmare gear you are actually wearing demands in Strength.",
        "This is the stage where a Strength requirement you did not plan for becomes twenty points you cannot get back — the respec token returns skill points, not attributes.",
      ],
      actions: [
        {
          kind: "warning",
          text: "**Your defence is zero while Berserk is swinging.** The state lasts about 2.7 seconds at one point and *shrinks* as the skill levels, down to about 1.3 at twenty — so more points mean less time exposed, not more. Use Concentrate instead when something is hitting hard and cannot be killed quickly; it doubles your defence and cannot be interrupted.",
        },
        {
          kind: "quest",
          text: "Clear the Nightmare **Den of Evil** for the skill point and, more importantly, the second respec token. **Radament** and **The Fallen Angel** give the other three.",
        },
        {
          kind: "respec",
          text: "**At level 40, after Izual, respec.** Whirlwind 20, six points in the mastery matching the weapon you now actually own, Battle Orders 11, then one point each into Bash, Stun, Concentrate, Leap, Leap Attack, Howl, Shout, Battle Command, Increased Stamina and Iron Skin. That is 37 + 5 + 3 + 2 = 47, and 47 is what you have.",
          atLevel: 40,
        },
        {
          kind: "gear",
          text: "**Decide the mastery from the weapon, not the other way round.** If your best weapon is a sword, take Blade Mastery; an axe, Axe Mastery; a mace, hammer, club or scepter, Mace Mastery. Polearms and spears are separate masteries and neither covers the other.",
        },
        {
          kind: "farm",
          text: "Farm **the Countess** in Nightmare for the runes the next twenty levels need. She is the only reliable source of Ral, Ort, Tal, Thul and Amn at this point, and everything below is built from them.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "smoke" },
          why: "+50 to all resistances at level 37 in a 2-socket body armour, which is the Nightmare penalty cancelled for two runes.",
        },
        {
          ref: { kind: "runeword", slug: "rhyme" },
          why: "If you are holding a shield: cannot be frozen, +25 all resistances, and 25% magic find at level 29.",
        },
      ],
      exitCriteria: "Level 40, Izual dead, and the respec spent — Whirlwind at 20 with a mastery that matches the weapon in your hands.",
      order: 4,
    },
    {
      slug: "bar-nightmare-5",
      name: "The mastery you actually have",
      classSlug: "barbarian",
      summary: "Levels 41-55. Whirlwind is on the bar and the two twenty-point purchases get finished.",
      levels: [41, 55],
      difficulty: "nightmare",
      location: "Nightmare Act 5 — the Bloody Foothills to Baal",
      goal: "Battle Orders maxed, the mastery at twelve, and Hell open.",
      killingWith: "Whirlwind, held through a pack rather than aimed at one thing.",
      skillPoints: [
        "**Battle Orders to 20.** +92% maximum life at twenty hard points, and it is the last thing you should still be raising while your life total is what decides whether Hell is survivable.",
        "**The mastery to 12.**",
        "That is 62 points at level 55: 54 from levels, and 8 from quests.",
      ],
      statPoints: [
        "**Vitality**, and enough Strength for the body armour you are aiming at rather than the one you are wearing.",
        "Faster Hit Recovery starts to matter more than raw life here. The Barbarian shares a hit-recovery table with the Paladin and the Assassin, and this site publishes it.",
      ],
      actions: [
        {
          kind: "tip",
          text: "**Whirlwind cannot be interrupted and cannot be steered.** The path is fixed when you press it, and being hit does not stop it — which is why it is held across a pack rather than clicked at a monster.",
        },
        {
          kind: "tip",
          text: "**It costs 12.5 mana, not 25.** The mana column is shifted, and the cost climbs to 22 by the twentieth point. With Insight on the mercenary you will never notice either number.",
        },
        {
          kind: "runeword",
          text: "**Lionheart at level 41** in a 3-socket body armour: +25 Strength, +20 Vitality, +50 life and +30 to all resistances. The Strength alone often pays for the next weapon's requirement.",
          refs: [{ kind: "runeword", slug: "lionheart" }],
          atLevel: 41,
        },
        {
          kind: "runeword",
          text: "**Treachery at level 43** if you would rather have +45% increased attack speed than the resistances. On Whirlwind that is a real amount of extra damage, because the spin's damage comes from how many times it hits.",
          refs: [{ kind: "runeword", slug: "treachery" }],
          atLevel: 43,
          optional: true,
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "lionheart" },
          why: "The best all-round body armour a levelling Barbarian can make, and its Strength bonus buys weapon requirements.",
        },
        {
          ref: { kind: "runeword", slug: "passion" },
          why: "A level-43 weapon runeword with +1 to Berserk and +25% attack speed, and it goes in any 4-socket weapon — so it fits whichever mastery you settled on.",
        },
      ],
      exitCriteria: "Nightmare Baal is dead, Battle Orders is at 20, and you have made a plan for Hell resistances.",
      order: 5,
    },
    {
      slug: "bar-hell",
      name: "Resistances, and the six doors",
      classSlug: "barbarian",
      summary: "Levels 56-75. Natural Resistance, Berserk for the immunes, and the transition into whichever of the six builds you are actually going to play.",
      levels: [56, 75],
      difficulty: "hell",
      location: "Hell — Act 1 through the Throne of Destruction",
      goal: "A finished level-75 character with 86 points spent and a build chosen.",
      killingWith: "Whirlwind, with Berserk on the second mouse button for anything immune to physical.",
      skillPoints: [
        "**The mastery to 20.** The last eight points of it are the largest remaining damage purchase you have.",
        "**Berserk 9.** This is the immunity plan. Its damage is entirely magic, so a physical immune is a slower fight rather than an impossible one.",
        "**Natural Resistance, one point** at level 30. It gives all four resistances at once and it is added before the cap, which is what makes it the answer to Hell's −100 rather than a partial one. Its curve is steep at the start: the first point is worth several of the last.",
        "**Increased Speed, one point** at level 24, and single points into **Taunt** at 6, **Battle Cry** at 18, **Grim Ward** at 24, **Find Potion** and **Find Item** at 12.",
        "That is 86 points at level 75: 74 from levels, and all 12 from quests.",
        "The remaining 24 to level 99 belong to the build page you are heading for, not to this route.",
      ],
      statPoints: [
        "**Vitality with everything that is not a requirement**, and the requirements are now known rather than guessed.",
        "Enough Dexterity for maximum block if and only if you hold a shield. A dual-wielding Barbarian never blocks and every point there is wasted.",
        "Still no Energy.",
      ],
      actions: [
        {
          kind: "warning",
          text: "**Hell applies −100% to every resistance.** Natural Resistance, a Lionheart or Smoke, and a resistance shield are the three cheap answers, and you want them before Act 1 rather than after Act 2 has taught you why.",
        },
        {
          kind: "tip",
          text: "**Battle Cry halves a monster's defence**, which is worth more to a Barbarian than any attack-rating item — attack rating is checked against the target's defence rather than against a threshold. One point is −50% and it grows by 2% a level.",
        },
        {
          kind: "tip",
          text: "**Grim Ward is much better than its reputation.** It makes everything inside it take +20% more damage, and 5% more per hard point of Find Potion on top — so the single point here becomes a real debuff the moment the build page tells you to raise Find Potion.",
        },
        {
          kind: "farm",
          text: "**Farm the Pit and Pindleskin** at this level rather than Act bosses. The Pit is area level 85 in Hell and Pindleskin is 83 — not the same thing, and this site publishes both numbers. Either way they are short, and a Barbarian with Find Item takes a second roll off every corpse in them.",
        },
        {
          kind: "transition",
          text: "**Whirlwind needs no respec, because this route *is* its plan.** At level 75 you are holding that build page's 77-point core exactly — the same twenty skills at the same values — plus nine points in Berserk. 110 − 86 = 24, and either of the page's two packages costs precisely 24 from here. The nine Berserk points are not stranded either: both packages carry Berserk, at twenty and at fourteen.",
        },
        {
          kind: "transition",
          text: "**Frenzy and Double Throw need the Hell Den of Evil token**, and it is worth being clear why, because their prerequisite chain really is the one you levelled through. The respec at level 40 bought that chain back: the plan you have run since holds no Double Swing and no Double Throw at all, so at 75 both sit at zero. If you already know you are heading for one of those two, **skip the level-40 respec entirely** — their pages level into themselves without one, and this route's mastery detour is the only thing you would be giving up.",
        },
        {
          kind: "transition",
          text: "**Berserk and Leap Attack need the token too.** Berserk wants Howl and Find Potion maxed and has no use at all for the twenty points sitting in Whirlwind — though the nine already in Berserk are the one part that carries straight over. Leap Attack wants Leap maxed, its only synergy, and this route only ever gave it one point.",
        },
        {
          kind: "transition",
          text: "**War Cry is the one destination this route does not serve at all.** Its synergies are Howl, Taunt and Battle Cry at 6% a point each, and it needs no weapon and therefore no mastery — so the entire design of this route, which exists to get the mastery right, is wasted on it. A player heading there should respec in Nightmare rather than follow the mastery plan above.",
        },
      ],
      gearTargets: [
        {
          ref: { kind: "runeword", slug: "insight" },
          why: "Still on the mercenary, and still the reason you are not drinking mana potions.",
        },
        {
          ref: { kind: "unique", slug: "string-of-ears" },
          why: "Physical damage reduction and life steal in a belt, and it is a common drop.",
        },
        {
          ref: { kind: "unique", slug: "gore-rider" },
          why: "Crushing Blow, Deadly Strike and Open Wounds on boots. Crushing Blow is a share of the target's current life, which is what makes a Barbarian able to kill things far above his listed damage.",
        },
        {
          ref: { kind: "runeword", slug: "wealth" },
          why: "Only if you intend the gold-find route on the Berserk page: 300% extra gold in a 3-socket body armour at level 43.",
        },
      ],
      exitCriteria: "Level 75, 86 points spent, Hell Baal dead, and a build page open in the other tab.",
      order: 6,
    },
  ],
  confidence: "verified",
};
