import type { ProgressionJourney } from "@/lib/types";

/**
 * The Necromancer levelling journey — the Summoner route, level by level.
 *
 * A fourth shape. The Sorceress journey plans an identity change at 30, the
 * Paladin's needs no respec because Blessed Hammer arrives at 18 already strong,
 * and the Amazon's is a fork at 30 between five endgame skills. **This one has
 * no fork and no respec at all**: the character you play at level 2 is the
 * character you play at 99, and every point spent on the way is a point in the
 * finished plan.
 *
 * TWO LEVELS THE PRECEDING RESEARCH GOT WRONG
 * -------------------------------------------
 * The research that came before this pass put **Decrepify at level 30**. It
 * unlocks at **24** — and Summon Resist unlocks at 24 too, so a route built on
 * 30 tells the reader to wait six levels for a skill they already have while
 * saving quest points they should have spent. **Lower Resist** is the skill
 * that genuinely unlocks at 30, which is exactly how the two get swapped.
 *
 * `checkUnlockLevelClaims` reads every unlock level out of the generated graph
 * and checks it against this prose in both locales, so the correction cannot be
 * un-made by an edit.
 *
 * THE THING EVERY SUMMONER GUIDE GLOSSES
 * --------------------------------------
 * **Raise Skeleton needs a corpse and cannot make one.** At level 1 there is no
 * army, no mercenary and no golem — the first monster in the game has to be
 * killed by you, personally, with a wand. Guides that open with "raise your
 * skeletons" skip the step that actually blocks a new player, and the Act 2
 * mercenary who solves it permanently is not available until the middle of the
 * second act.
 */
export const necromancerJourney: ProgressionJourney = {
  classSlug: "necromancer",
  targetBuild: "summoner-necromancer",
  summary:
    "One route, no respec, no fork. Raise Skeleton at level 1, Corpse Explosion by 8, and the same character at 99 — the only thing you have to decide is what to do with the spare points.",
  overview: [
    "**This is the only class journey on the site with no decision in it.** The Summoner's core is Raise Skeleton, Skeleton Mastery and Corpse Explosion. All three are in your hands by the eighth level-up, and all three are still what you are maxing at 99. There is no level at which you stop being what you were.",
    "**The first corpse is the one problem the route has.** Raise Skeleton needs a body and cannot produce one, so at level 1 you kill the first monster yourself with a wand. From there the army feeds itself: skeletons kill, bodies drop, Corpse Explosion turns bodies into more bodies. An Act 2 mercenary hired in the middle of the second act removes the problem for good, and until then you are the one who opens each fight.",
    "**Decrepify unlocks at level 24, not 30.** So does Summon Resist. By the time you reach 24 you will have four quest skill points banked from the Den of Evil, Radament and Izual, so taking both in the same session is realistic rather than a plan for later. Lower Resist is the skill that arrives at 30, and this route does not take it.",
    "**Summons do not take the difficulty resistance penalty.** You lose 40 resistance in Nightmare and 100 in Hell; your mercenary loses the same; the army loses nothing at all. That changes what you gear for at every transition — the resistance charms are for you and for him, and the army only ever needs to be re-raised.",
    "If you want to try the Poison Nova or Bone Spear builds later, the Den of Evil gives one free respec token per difficulty and you will not have used any of them. **Read the Iron Golem warning in the respec plan before you spend one.**",
  ],
  respecPlan: [
    {
      at: "Never, for this route",
      why: "Every point in the plan below is a point in the finished Summoner. There is no wasted level and no transition — which is why this is the class most often recommended to a first-time player.",
    },
    {
      at: "Once, if you are going to Poison Nova",
      why: "Poison Nova unlocks at level 30 and its two synergies are forty points on their own, so there is no way to level into it. Play this route, then spend the Normal token at 30 or later. The Poison Nova build page starts from exactly that position.",
    },
    {
      at: "Optional, if you are going to Bone Spear",
      why: "Bone Spear is levellable as itself — Teeth is a real attack in Normal and a synergy afterwards — so this is a preference rather than a requirement. Many players still level as a Summoner because an army is faster through Normal than a partly-synergised spear, and respec afterwards.",
    },
    {
      at: "Before any of those: unsummon your Iron Golem",
      why: "**A respec that removes your point in Iron Golem destroys the golem and the item it was made from.** The item is not returned. If you built one at any point in this route, dismiss it deliberately — summon a Clay Golem over it — before you spend a token. This is the one irreversible mistake the journey can make.",
    },
  ],
  stages: [
    {
      slug: "nec-act-1-normal",
      name: "The first corpse is yours",
      classSlug: "necromancer",
      summary: "Levels 1-11. You kill the first monster personally, and then never have to again.",
      levels: [1, 11],
      difficulty: "normal",
      location: "Act 1 — Rogue Encampment through the Monastery",
      goal: "Clear the Den of Evil, get Corpse Explosion working, and kill Andariel.",
      killingWith: "Your wand for exactly one monster, then eight skeletons and an explosion.",
      order: 1,
      skillPoints: [
        "Level 1: **Raise Skeleton**. It needs a corpse, and there is not one yet — kill the first Fallen with your wand, then raise it.",
        "Level 2: **Skeleton Mastery**. Every point is +8 life and +2 damage to every skeleton you raise afterwards.",
        "Level 3: **Amplify Damage**. One point, and it is the largest physical damage multiplier in the game — it doubles what the whole army deals.",
        "Levels 4-5: back into **Raise Skeleton** and **Skeleton Mastery**. More bodies, and each one worth more.",
        "**The Den of Evil point goes into Teeth**, which you will cast for about four levels and then never again. It is Corpse Explosion's only prerequisite.",
        "Level 6: **Clay Golem**. He slows what he hits and he is the front line while the skeletons catch up.",
        "Level 7 or so: **Corpse Explosion**, as soon as Teeth is spent and you have reached level 6. This is the moment the class starts working.",
        "Levels 8-11: **Raise Skeleton**, **Skeleton Mastery**, and one point into **Weaken** around level 10 — it is a real curse against a melee pack and it is the first link toward Decrepify.",
      ],
      statPoints: [
        "**Vitality first, and mostly Vitality.** You are behind an army, but Normal is where a stray Fallen Shaman finds you.",
        "Enough **Strength** for the armor you are wearing, and nothing else.",
        "No Energy. Raising an army costs mana, and the answer is potions now and a mercenary with Insight later.",
      ],
      actions: [
        {
          kind: "tip",
          text: "**Kill the first monster yourself.** Raise Skeleton requires a corpse and cannot create one — at level 1 you have no army, no golem and no mercenary, so the wand in your hand is the whole of your damage for about thirty seconds.",
        },
        {
          kind: "quest",
          text: "Clear the **Den of Evil** completely. Akara gives **+1 skill point** and a **free full respec**. Put the skill point into **Teeth** so Corpse Explosion opens at level 6.",
        },
        {
          kind: "tip",
          text: "Save the respec token. This route never needs it, and it is what lets you try Poison Nova or Bone Spear on the same character later.",
        },
        {
          kind: "shop",
          text: "Shop **Charsi** and **Akara** for wands. A magic wand with +2 or +3 to Raise Skeleton or Skeleton Mastery is worth more than any drop before Act 3 — the count and the mastery both read the effective level, so gear raises them exactly as points do.",
        },
        {
          kind: "warning",
          text: "**Re-raise the army after every level-up and every wand change.** A minion's life and damage are written when it is created and never recalculated, so eight skeletons raised before a new wand are eight skeletons at the old wand's values.",
        },
        {
          kind: "quest",
          text: "Kill **Blood Raven** for a free Rogue Scout. She is a second body that produces corpses, which at this level is exactly what you need.",
          optional: true,
        },
        {
          kind: "gear",
          text: "Keep any 2-socket body armor for a **Stealth** at level 17, and any 2-socket Bone Wand or Grim Wand for a **White** at 35.",
          refs: [
            { kind: "runeword", slug: "stealth" },
            { kind: "runeword", slug: "white" },
          ],
        },
        {
          kind: "tip",
          text: "**Andariel dies to the army with Amplify Damage on her.** Raise a full set of skeletons in the room before, walk in, curse her, and detonate her minions as they fall. She is poison-heavy, so an antidote potion matters more than anything about your build.",
        },
      ],
      exitCriteria: "Andariel dead, level 12+, eight skeletons standing, and Corpse Explosion chaining.",
    },

    {
      slug: "nec-act-2-normal",
      name: "The mercenary who opens the fight",
      classSlug: "necromancer",
      summary: "Levels 12-17. Golem Mastery at 12, and an Act 2 mercenary who solves the first-corpse problem permanently.",
      levels: [12, 17],
      difficulty: "normal",
      location: "Act 2 — Lut Gholein, the deserts and the tombs",
      goal: "Hire an Act 2 mercenary, reach level 18, and kill Duriel.",
      killingWith: "The army, Amplify Damage, and Corpse Explosion chains through the tomb corridors.",
      order: 2,
      skillPoints: [
        "Level 12: **Golem Mastery**. +20% golem life and +25 attack rating per level, and it is Summon Resist's prerequisite.",
        "**Raise Skeletal Mage** is available at level 12 and is worth exactly one point here. The mages have their own cap, separate from the skeletons, so they are additional bodies rather than a choice — but this route does not make them a focus.",
        "Everything else goes into **Raise Skeleton**, **Skeleton Mastery** and **Corpse Explosion**, in that order of preference.",
        "**The Radament quest point goes into Corpse Explosion.** Radius is the whole of what points buy there, and radius is what turns one explosion into a chain.",
      ],
      statPoints: [
        "**Vitality**, with just enough Strength for your armor.",
        "Still no Energy. The mercenary's Insight is coming.",
      ],
      actions: [
        {
          kind: "mercenary",
          text: "**Hire an Act 2 Desert Mercenary from Greiz after the Radament quest, and take Might.** This is the single most important hire in the route: he produces the first corpse in every new room, and his Might aura raises the army's physical damage as well as his own.",
        },
        {
          kind: "tip",
          text: "Until now *you* were the one opening every fight. From here he is, and your job becomes cursing and detonating rather than attacking.",
        },
        {
          kind: "quest",
          text: "**Radament** gives +1 skill point. Spend it on Corpse Explosion.",
        },
        {
          kind: "gear",
          text: "Make a **Stealth** at level 17. Faster cast rate matters here more than it looks — raising sixteen minions is sixteen casts.",
          refs: [{ kind: "runeword", slug: "stealth" }],
        },
        {
          kind: "shop",
          text: "**Fara** and **Drognan** sell wands. Keep upgrading: two more skill levels is two more skeletons and eight more life on each of them.",
        },
        {
          kind: "warning",
          text: "**Walk into Duriel with the army already raised.** There are no corpses in his room and nothing to raise from once the door closes — whatever you brought is what you fight with. Raise a full set in the corridor outside, put Amplify Damage on him, and let the mercenary and the skeletons work.",
        },
        {
          kind: "tip",
          text: "**Decrepify would be the better curse for Duriel and you do not have it yet** — it halves his movement and attack speed, and it unlocks at level 24. Amplify Damage is the answer at this level, and re-casting **Clay Golem** on top of him is a genuine distraction: the new golem appears where you aim it and buys the army a few seconds. It costs mana you may want for re-raising, so it is a tool rather than a plan.",
        },
      ],
      exitCriteria: "Duriel dead, level 18+, an Act 2 mercenary with Might, and a Stealth.",
    },

    {
      slug: "nec-act-3-4-normal",
      name: "Jungle, and the first real curse decision",
      classSlug: "necromancer",
      summary: "Levels 18-23. Terror opens the path to Decrepify, and Izual pays for two more points.",
      levels: [18, 23],
      difficulty: "normal",
      location: "Act 3 and Act 4 — Kurast through the Chaos Sanctuary",
      goal: "Reach level 24 and kill Diablo.",
      killingWith: "The army, with Corpse Explosion doing most of the actual clearing.",
      order: 3,
      skillPoints: [
        "One point into **Terror** once you are past level 12. It is Decrepify's prerequisite and you want it spent before 24 rather than at 24.",
        "**Blood Golem is available at level 18, and this route only takes it as a prerequisite.** He shares life with you in both directions, which is a liability rather than a benefit — do not summon him deliberately. Take the point only if you intend to build an Iron Golem later.",
        "Everything else: **Raise Skeleton**, **Skeleton Mastery**, **Corpse Explosion**.",
        "**The two Izual points go into Skeleton Mastery.** It is the skill that decides whether the army survives Nightmare, and it reaches revives and mages as well as skeletons.",
      ],
      statPoints: [
        "**Vitality.** Act 3 is where a Necromancer discovers that Flesh Beasts do not care about the army.",
        "Strength only for what you are wearing.",
      ],
      actions: [
        {
          kind: "quest",
          text: "**Izual** gives +2 skill points. Skeleton Mastery.",
        },
        {
          kind: "gear",
          text: "Give the mercenary an **Insight** as soon as a Ral, Tir, Tal and Sol are together. Meditation ends your mana problem permanently, and rebuilding an army is the most expensive thing you do.",
          refs: [{ kind: "runeword", slug: "insight" }],
        },
        {
          kind: "tip",
          text: "**Corpse Explosion is doing most of the clearing by now, and it is worth understanding why it is not scaling the way you expect.** Its damage is 70-120% of the exploded monster type's base life, so it grows when you fight tougher things and when you change difficulty — never because you put another point in it. The points buy radius.",
        },
        {
          kind: "warning",
          text: "**Mephisto's moat is not this build's trick.** The army has to reach him, and standing across water while skeletons refuse to swim is a wasted trip. Walk in, curse, and fight him in the room.",
        },
        {
          kind: "tip",
          text: "The Chaos Sanctuary is the densest place you have been and the first time Corpse Explosion chains across a whole room. It is also full of Doom Knights, which are exactly the sort of corpse worth exploding.",
        },
      ],
      exitCriteria: "Diablo dead, level 24+, Terror spent, and an Insight on the mercenary.",
    },

    {
      slug: "nec-act-5-normal",
      name: "Twenty-four, and both skills at once",
      classSlug: "necromancer",
      summary: "Levels 24-29. Summon Resist and Decrepify both unlock here, and you will have quest points banked for both.",
      levels: [24, 29],
      difficulty: "normal",
      location: "Act 5 — Harrogath to the Worldstone Chamber",
      goal: "Finish Normal, and enter Nightmare with the curse tree open.",
      killingWith: "The army, Decrepify on anything dangerous, and Corpse Explosion on everything else.",
      order: 4,
      skillPoints: [
        "Level 24: **Summon Resist**. One point, and one point is most of the skill — the curve runs from 20% toward a 75% ceiling and flattens immediately. It raises fire, lightning, cold and poison resistance on skeletons, mages and golems, and reaches neither physical nor magic.",
        "Level 24 also opens **Decrepify**, and by now you have four quest skill points from the Den of Evil, Radament and Izual — so take both rather than choosing. Decrepify is −50% movement, attack speed, damage dealt and physical resistance, all at once.",
        "**Iron Golem is available at level 24 and is optional.** Read the warning below before spending the point.",
        "Everything else: **Raise Skeleton**, **Skeleton Mastery**, **Corpse Explosion**.",
      ],
      statPoints: [
        "**Vitality**, and start thinking about the Strength for a Heirophant Trophy — 58 — if a Homunculus is in your future.",
      ],
      actions: [
        {
          kind: "tip",
          text: "**Summon Resist is not compensating for a penalty.** Summons do not take the −40 and −100 resistance losses that you and your mercenary take in Nightmare and Hell — every minion's resistance columns carry the same value in all three difficulties. So this point is a straight addition rather than a repair, which is exactly why one is enough and twenty is not a plan.",
        },
        {
          kind: "tip",
          text: "**Decrepify is now your boss curse and Amplify Damage stays your clearing curse.** Only one curse can be on a monster at a time, so casting one replaces the other — the question is never which is stronger but which you are giving up.",
        },
        {
          kind: "warning",
          text: "**If you build an Iron Golem, use something you would not mind losing.** He is the only minion that survives leaving a game, and he is destroyed by dying, by your character dying, by any other golem you summon, and by a respec that removes the skill. The item is consumed at the moment you cast and is never returned. A spare rare or a cheap runeword — never a Pride, an Insight, a Beast or an Infinity.",
        },
        {
          kind: "quest",
          text: "**Larzuk sockets an item for free.** A 2-socket wand for a White at level 35 is the best use of it on this route.",
        },
        {
          kind: "warning",
          text: "**Do not rush the Ancients.** They hit hard enough to delete an army, there are no corpses in the arena, and you cannot leave to fetch more. Bring a full set, curse with Decrepify rather than Amplify Damage, and be ready to re-raise from the first one that dies.",
        },
        {
          kind: "tip",
          text: "Baal's throne room is the best place in Normal to practise the rhythm you will use for the rest of the game: raise before the wave, curse the wave, detonate the first body.",
        },
      ],
      exitCriteria: "Baal dead, level 30+, Summon Resist and Decrepify both spent.",
    },

    {
      slug: "nec-nightmare",
      name: "Nightmare, and the army that does not notice",
      classSlug: "necromancer",
      summary: "Levels 30-50. Your resistances drop 40 and the army's drop nothing. Arm of King Leoric at 36 changes everything.",
      levels: [30, 50],
      difficulty: "nightmare",
      location: "Nightmare, Act 1 through Act 5",
      goal: "Reach level 50, cap your own resistances, and pick up the wand that carries the rest of Nightmare.",
      killingWith: "A larger army, Corpse Explosion with real radius, and Decrepify on anything with a name.",
      order: 5,
      skillPoints: [
        "**Raise Skeleton and Skeleton Mastery to twenty, in that order**, then Corpse Explosion to twenty. That is the whole of the plan from here to about level 75.",
        "**Revive is available at level 30 and this route treats it as optional.** It costs three points you would not otherwise spend — Raise Skeletal Mage, Blood Golem and Iron Golem — on top of the Raise Skeleton and Clay Golem the core plan already has. Each revive lasts three minutes flat, cannot be refreshed, and does not get Summon Resist. It is a burst of bodies for a hard room, not an army.",
        "Do not take **Lower Resist**, which unlocks at level 30. What it lowers is elemental resistance; what this army deals is physical damage, and the only elemental damage in the plan is half of one skill. Six curse points to improve that half is the worst trade in the tree for this build.",
      ],
      statPoints: [
        "**Vitality**, and the Strength for whatever you are actually wearing.",
        "The Heirophant Trophy a Homunculus sits on needs 58 Strength, and it arrives at level 42.",
      ],
      actions: [
        {
          kind: "warning",
          text: "**You lose 40 to every resistance here. Your army loses nothing.** The resistance charms and the gear are for you and for the mercenary — a minion's resistances are the same number in Nightmare as they were in Normal, and there is no such thing as gearing the pets for it.",
        },
        {
          kind: "gear",
          text: "**Arm of King Leoric at level 36 is the largest single upgrade in the route.** +2 to Summoning and +2 to Poison and Bone, plus +3 to Raise Skeleton and +3 to Skeleton Mastery — both halves of the build from one wand that drops here and costs nothing.",
          refs: [{ kind: "unique", slug: "arm-of-king-leoric" }],
          atLevel: 36,
        },
        {
          kind: "runeword",
          text: "A **White** at level 35 is the alternative and it is worth keeping both. +3 to Poison and Bone and +4 to Skeleton Mastery — more explosion radius and stronger skeletons, and nothing for the count.",
          refs: [{ kind: "runeword", slug: "white" }],
          atLevel: 35,
        },
        {
          kind: "gear",
          text: "**Homunculus at level 42.** +2 Necromancer skills, +2 to Curses, All Resistances +40 and +40% block, which is most of a resistance plan in one slot.",
          refs: [{ kind: "unique", slug: "homunculus" }],
          atLevel: 42,
        },
        {
          kind: "runeword",
          text: "A **Bone** at level 47 for +2 Necromancer skills and +100-150 mana, or a **Splendor** in a 2-socket shrunken head at 37 if two Um runes are not happening.",
          refs: [
            { kind: "runeword", slug: "bone" },
            { kind: "runeword", slug: "splendor" },
          ],
          atLevel: 47,
        },
        {
          kind: "warning",
          text: "**Re-raise after each of these.** A new wand improves the next skeleton and none of the eight already standing — this is the single most common mistake a levelling Summoner makes, and it costs a third of the army's strength for as long as it goes unnoticed.",
        },
        {
          kind: "tip",
          text: "**Physical immunes start appearing here, and Amplify Damage is the answer.** It cuts 100 points of physical damage resistance, and against a monster sitting at exactly 100% the immunity rule leaves −20 — which still breaks it. Decrepify's −50 becomes −10 against the same monster and does not. That is the one situation where the two curses are not interchangeable.",
        },
      ],
      exitCriteria: "Nightmare Baal dead, level 50+, resistances capped, and a wand from this stage in hand.",
    },

    {
      slug: "nec-hell",
      name: "Hell, with the same army",
      classSlug: "necromancer",
      summary: "Levels 50-99. Minus 100 to your resistances and none to theirs, and the second half of Corpse Explosion starts earning its points.",
      levels: [50, 99],
      difficulty: "hell",
      location: "Hell, Act 1 onward",
      goal: "Finish the core plan, and pick the farming route on the Summoner build page.",
      killingWith: "Sixteen minions, a golem, Amplify Damage, and Corpse Explosion chains.",
      order: 6,
      skillPoints: [
        "Finish **Raise Skeleton**, **Skeleton Mastery** and **Corpse Explosion** at twenty each. With the prerequisites and the Decrepify chain that is 68 points, and it is the whole mandatory plan.",
        "**The remaining points are genuinely open**, and the Summoner build page lists the destinations rather than choosing one: Raise Skeletal Mage for a second army, Golem Mastery if the golem keeps dying, **Bone Wall** to make Bone Armor a real shield, or Amplify Damage's radius. **Bone Prison is the one that costs more than it looks**: it needs Bone Spear as well as Bone Wall and Bone Armor, though the Teeth and Corpse Explosion underneath it are in the core plan already.",
      ],
      statPoints: [
        "**Vitality**, and enough Strength for the endgame armor you are aiming at.",
        "With Battle Orders from a Call to Arms, 1000-1500 life is a comfortable Hell figure for a character who is rarely the target.",
      ],
      actions: [
        {
          kind: "warning",
          text: "**Minus 100 to all your resistances, and still nothing to the army's.** Cap yours before you take Hell seriously, gear the mercenary for his — he takes the full penalty exactly as you do — and stop thinking about the minions' resistances entirely. Summon Resist's one point is all they will ever get and all they need.",
        },
        {
          kind: "tip",
          text: "**Physical immunity is the problem and you have two answers to it.** Amplify Damage breaks it outright for the skeletons; Corpse Explosion's fire half lands on a physical immune regardless of any curse. Decrepify does not break physical immunity — its cut is halved to begin with and reduced to a fifth against an immune — so it stays the survival curse rather than becoming the immunity answer.",
        },
        {
          kind: "tip",
          text: "**Skeletal mages are the third answer** and the cheapest flex points you can spend. Their damage is elemental and rolled from the skill rather than from the monster row, so they keep working where the skeletons have stopped.",
        },
        {
          kind: "warning",
          text: "**Act bosses hurt the army far more than anything leading up to them.** Andariel, Duriel, Mephisto, Diablo and Baal all carry a Prime Evil flag that raises the damage they deal to pets specifically. Expect to re-raise mid-fight, and bring corpses into the room where you can.",
        },
        {
          kind: "gear",
          text: "**Skin of the Vipermagi or Chains of Honor** for your own resistances, a **Harlequin Crest**, and eventually an **Enigma** — Teleport recalls the entire army instantly, which is the only item that changes how this build is played.",
          refs: [
            { kind: "unique", slug: "skin-of-the-vipermagi" },
            { kind: "unique", slug: "harlequin-crest" },
            { kind: "runeword", slug: "enigma" },
          ],
        },
        {
          kind: "farm",
          text: "**The Mausoleum is the best first Hell farm for this build**: area level 85, dense, undead, and its recorded immunities are poison and cold rather than anything you deal.",
        },
        {
          kind: "transition",
          text: "From here the **Summoner Necromancer** build page takes over — gear tiers, farming routes and the flex points. Nothing about the character changes.",
        },
        {
          kind: "respec",
          text: "**If you are switching to Poison Nova or Bone Spear, unsummon any Iron Golem first.** A respec removes the skill and destroys the golem and the item inside it. Summon a Clay Golem over it, then spend the token.",
        },
      ],
      exitCriteria: "68 core points spent, Hell resistances capped, and a farming route chosen.",
    },
  ],
  confidence: "verified",
};
