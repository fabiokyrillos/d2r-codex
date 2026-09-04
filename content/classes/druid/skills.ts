import type { Skill, SkillTree } from "@/lib/types";

/**
 * The Druid's three skill trees and thirty skills.
 *
 * Every unlock level, prerequisite edge and tree coordinate here is checked
 * against `content/classes/skill-graph.ts`, which is generated from the game's
 * own `skills.json`. Nothing structural in this file is authored — the fields
 * that exist are prose, plus the two things the columns cannot say on their own:
 * which `SkillKind` a reader should see, and how an attack's damage relates to
 * the weapon.
 *
 * Numbers in the prose come from the same pinned extraction. Four things are
 * worth stating once, because each is a place where the obvious reading is
 * wrong.
 *
 *   **Half the elemental tree deals physical damage, and the elemental columns
 *   do not show it.** Tornado and Twister carry no `EType` and no `EMin` at
 *   all: their damage lives in `MinDam`/`MaxDam`, the columns every other class
 *   in scope leaves empty. Molten Boulder, Volcano and Armageddon carry both at
 *   once and are synergised separately — Armageddon takes its physical from
 *   Volcano and its fire from Molten Boulder and Firestorm. This is why the
 *   graph gained a `physical` table, and why the Wind Druid is a physical build
 *   sitting on a tree called Elemental.
 *
 *   **The two ultimates do not get longer as you level them.** Hurricane and
 *   Armageddon both read `Param2 = 0` for duration; ten seconds is ten seconds
 *   at hard level 1 and at hard level 20. What lengthens them is a *synergy* —
 *   fifty frames per hard point in Cyclone Armor and Fissure respectively — so
 *   the skill that keeps the storm up is never the storm.
 *
 *   **The wolves and the bear buff each other through soft levels, not
 *   synergies.** Summon Dire Wolf raises the spirit wolves' life, the Grizzly
 *   raises both wolves' damage, and every one of those expressions reads `lvl`
 *   rather than `blvl` — the effective level, which +skills gear raises. That is
 *   the opposite of a synergy, and it is why a Ravenlore is worth more to this
 *   tree than the hard points it replaces. The graph deliberately draws no edge
 *   for them; see `SOFT_LEVEL_SYNERGIES`.
 *
 *   **Shock Wave is not a weapon attack.** It carries no `ToHit` and no
 *   `LevToHit`, where Maul, Fury, Feral Rage, Rabies, Fire Claws and Hunger all
 *   carry both. It rolls no attack rating, cannot miss, and its damage is
 *   entirely its own — which is exactly why it works on a bear wearing no
 *   attack-rating gear at all.
 *
 * Tree order is the public one — Elemental, Shape Shifting, Summoning — and is
 * independent of the game's 1-based `SkillPage`, which numbers them the other
 * way round. `order` drives what a reader sees; `page` stays in the graph as the
 * extraction gave it.
 */

export const druidTrees: SkillTree[] = [
  {
    slug: "elemental",
    name: "Elemental Skills",
    classSlug: "druid",
    order: 1,
    summary: "Fire on one side, wind and cold on the other, and no overlap between them.",
    theme:
      "Two damage schools that share a tree and nothing else. The fire half — Firestorm, Molten Boulder, Fissure, Volcano, Armageddon — is ground-based and synergises into itself. The wind half — Twister, Tornado, Hurricane — is mostly physical damage with a cold storm on top, which is the single reason the Druid handles Hell immunities better than any other caster. Cyclone Armor sits between them and belongs to both.",
  },
  {
    slug: "shape-shifting",
    name: "Shape Shifting Skills",
    classSlug: "druid",
    order: 2,
    summary: "Two forms, and the trade each one makes.",
    theme:
      "Werewolf buys attack speed and Werebear buys damage, defence and the right not to be interrupted. Everything above them is a melee attack that only works in one form or the other, and Lycanthropy — the cheapest skill in the class — feeds both. The cost is that transforming locks you out of casting, which is why a shapeshifter's answer to an immunity has to be on the weapon.",
  },
  {
    slug: "druid-summoning",
    name: "Summoning Skills",
    classSlug: "druid",
    order: 3,
    summary: "Five ravens, five wolves, a bear, two vines and a totem — but only some at once.",
    theme:
      "Three groups that do not share a cap: birds, wolves, and one of each of the rest. The totems are the reason the tree appears on builds that summon nothing — Oak Sage is a flat life bonus for the whole party and Heart of Wolverine a flat damage bonus, and both cost one point plus a prerequisite.",
  },
];

export const druidSkills: Skill[] = [
  // -------------------------------------------------------------------------
  // Elemental Skills
  // -------------------------------------------------------------------------
  {
    slug: "firestorm",
    name: "Firestorm",
    classSlug: "druid",
    tree: "elemental",
    kind: "spell",
    element: "fire",
    requiredLevel: 1,
    summary: "Three waves of fire that crawl along the ground away from you.",
    synergies: [
      { skill: "molten-boulder", bonus: "+23% fire damage per level" },
      { skill: "fissure", bonus: "+23% fire damage per level" },
    ],
    mechanics: [
      "It creates **three** waves and that count never changes — the parameter behind it has no per-level term, so a maxed Firestorm throws exactly as many as a one-point one.",
      "The waves track along the floor and spread apart as they travel, which makes it strong in a corridor and poor against a single target standing still at range.",
      "It is the class's only level-1 damage skill with a synergy pair that pays off later, and it is what a Fire Druid levels on before Molten Boulder arrives at 6.",
    ],
    confidence: "verified",
  },
  {
    slug: "molten-boulder",
    name: "Molten Boulder",
    classSlug: "druid",
    tree: "elemental",
    kind: "spell",
    element: "fire",
    requiredLevel: 6,
    prerequisites: ["firestorm"],
    summary: "A rolling boulder that knocks enemies back and bursts into fire when it stops.",
    synergies: [
      { skill: "volcano", bonus: "+12% physical damage per level" },
      { skill: "firestorm", bonus: "+8% fire damage per level" },
    ],
    mechanics: [
      "It deals **physical and fire damage separately**, and the game synergises them separately — Volcano raises the physical, Firestorm the fire. Reading it as one number is how a point ends up in the wrong skill.",
      "The boulder **knocks back** everything it rolls through. That is most of its value while levelling: it buys a fragile character the distance to keep casting.",
      "It explodes with a radius of **7** when it stops or hits something solid.",
    ],
    confidence: "verified",
  },
  {
    slug: "arctic-blast",
    name: "Arctic Blast",
    classSlug: "druid",
    tree: "elemental",
    kind: "spell",
    element: "cold",
    requiredLevel: 6,
    summary: "A channelled cone of frost that freezes what it touches.",
    synergies: [{ skill: "cyclone-armor", bonus: "+15% damage per level" }],
    mechanics: [
      "It is **channelled**, and its cost is charged per frame rather than per cast — a fraction of a mana point twenty-five times a second, which works out near nine mana a second and is why the site does not print it in the same column as Hurricane's thirty.",
      "The stream **freezes**, and freezing is what a level-6 character actually wants from it. Its damage never becomes competitive.",
      "One point in it is a real consideration on a Wind Druid for an unrelated reason: it adds **2 frames of stun to Twister** per hard point, which is a synergy the graph draws.",
    ],
    confidence: "verified",
  },
  {
    slug: "fissure",
    name: "Fissure",
    classSlug: "druid",
    tree: "elemental",
    kind: "spell",
    element: "fire",
    requiredLevel: 12,
    prerequisites: ["molten-boulder"],
    summary: "Cracks the ground open in a radius, venting fire from each opening in turn.",
    synergies: [
      { skill: "firestorm", bonus: "+12% damage per level" },
      { skill: "volcano", bonus: "+12% damage per level" },
    ],
    mechanics: [
      "Vents open across a radius of **7** and fire from them on a delay rather than all at once, so the damage arrives over a second or two and a monster walking through catches several openings.",
      "It is the Fire Druid's clear skill from level 12 to the end of the game, and the reason the build works at all in a corridor.",
      "It is also **Armageddon's duration synergy** — fifty frames of storm per hard point — which is why a Fire Druid maxes it even after Volcano arrives.",
    ],
    confidence: "verified",
  },
  {
    slug: "cyclone-armor",
    name: "Cyclone Armor",
    classSlug: "druid",
    tree: "elemental",
    kind: "buff",
    requiredLevel: 12,
    prerequisites: ["arctic-blast"],
    summary: "A shell of wind that absorbs a fixed pool of fire, cold and lightning damage.",
    synergies: [
      { skill: "twister", bonus: "+7% absorbed per level" },
      { skill: "tornado", bonus: "+7% absorbed per level" },
      { skill: "hurricane", bonus: "+7% absorbed per level" },
    ],
    mechanics: [
      "It absorbs a **pool**, not a percentage: **40 points at level 1 and 12 more per level**, refilled over time. Against a single large elemental hit it is worth little; against a Hell mob throwing constant small ones it is worth a great deal.",
      "It absorbs fire, cold and lightning only. **Poison, physical and magic pass straight through it.**",
      "It is the one skill every Druid build has a reason to own, and a Wind Druid maxes it twice over — once for the shell, once because it is **Hurricane's duration synergy**.",
    ],
    confidence: "verified",
  },
  {
    slug: "twister",
    name: "Twister",
    classSlug: "druid",
    tree: "elemental",
    kind: "spell",
    element: "physical",
    requiredLevel: 18,
    prerequisites: ["cyclone-armor"],
    summary: "Three small funnels that stun what they pass through.",
    synergies: [
      { skill: "tornado", bonus: "+10% damage per level" },
      { skill: "hurricane", bonus: "+10% damage per level" },
      { skill: "arctic-blast", bonus: "+2 frames of stun per level" },
    ],
    mechanics: [
      "Its damage is **physical** and it carries none of your weapon's — the whole of it is in the table, and its `HitShift` of 7 halves the raw column, which is why level 1 reads 6-8 rather than 12-16.",
      "Three funnels leave on every cast and travel independently, so a doorway takes all three and an open field usually takes one.",
      "The **stun** is the point rather than the damage. Its base is 10 frames flat and grows only through Arctic Blast; a Wind Druid taking one point here on the way to Tornado gets a real crowd-control skill for it.",
    ],
    confidence: "verified",
  },
  {
    slug: "volcano",
    name: "Volcano",
    classSlug: "druid",
    tree: "elemental",
    kind: "spell",
    element: "fire",
    requiredLevel: 24,
    prerequisites: ["fissure"],
    summary: "Raises a volcano that erupts on the spot for as long as it stands.",
    synergies: [
      { skill: "molten-boulder", bonus: "+16% physical damage per level" },
      { skill: "fissure", bonus: "+12% fire damage per level" },
      { skill: "armageddon", bonus: "+12% fire damage per level" },
    ],
    mechanics: [
      "Like Molten Boulder it deals **physical and fire together**, and the two take their synergies from different skills.",
      "It is stationary. Everything about playing it well is about where you put it — in a doorway, on a boss's feet, on the spot a pack has to cross.",
      "It is **Armageddon's physical synergy** at 18% per hard point, the largest single synergy coefficient in the class.",
    ],
    confidence: "verified",
  },
  {
    slug: "tornado",
    name: "Tornado",
    classSlug: "druid",
    tree: "elemental",
    kind: "spell",
    element: "physical",
    requiredLevel: 24,
    prerequisites: ["twister"],
    summary: "A single funnel of pure physical damage. The best clear skill the class has.",
    synergies: [
      { skill: "cyclone-armor", bonus: "+9% damage per level" },
      { skill: "twister", bonus: "+9% damage per level" },
      { skill: "hurricane", bonus: "+9% damage per level" },
    ],
    mechanics: [
      "**All of its damage is physical.** No monster in the game is immune to physical *and* cold at once often enough to matter, which is why Tornado plus Hurricane covers Hell with no Sunder Charm and no mercenary aura.",
      "It damages a radius of **3** as it travels, and it damages the same target again only after a **15-frame** interval, so standing a target inside the funnel is worth more than crossing it.",
      "Its flight path is famously erratic. This is not a bug you can gear around — it is why the skill wants Faster Cast Rate and volume rather than precision, and why 99% FCR is the Wind Druid's headline breakpoint.",
      "Three synergies of 9% each, one of which — Cyclone Armor — is a defensive buff you wanted anyway. That overlap is what makes the build cheap.",
    ],
    confidence: "verified",
  },
  {
    slug: "armageddon",
    name: "Armageddon",
    classSlug: "druid",
    tree: "elemental",
    kind: "spell",
    element: "fire",
    requiredLevel: 30,
    prerequisites: ["volcano"],
    summary: "Meteors rain around you for ten seconds. The Fire Druid's finisher.",
    synergies: [
      { skill: "volcano", bonus: "+18% physical damage per level" },
      { skill: "molten-boulder", bonus: "+14% fire damage per level" },
      { skill: "firestorm", bonus: "+14% fire damage per level" },
      { skill: "fissure", bonus: "+50 frames of duration per level" },
    ],
    mechanics: [
      "It lasts **250 frames — ten seconds — and that does not change with its own level**. Every extra second comes from Fissure, at fifty frames a hard point, so twenty points there take it to fifty seconds.",
      "The meteors fall around **you**, in a radius of 8, on a six-frame interval. It is a skill you walk with, not one you aim.",
      "Each meteor deals **physical and fire**, and the physical share is why an Armageddon Druid is not stopped by a fire immune the way a Fissure-only one is.",
      "It can be maintained in **Werewolf form**, which is the whole basis of the Fury/Armageddon hybrid: the storm keeps falling while you attack.",
    ],
    confidence: "verified",
  },
  {
    slug: "hurricane",
    name: "Hurricane",
    classSlug: "druid",
    tree: "elemental",
    kind: "spell",
    element: "cold",
    requiredLevel: 30,
    prerequisites: ["tornado"],
    summary: "A ten-second storm centred on you that chills and damages everything nearby.",
    synergies: [
      { skill: "twister", bonus: "+9% damage per level" },
      { skill: "tornado", bonus: "+9% damage per level" },
      { skill: "cyclone-armor", bonus: "+50 frames of duration per level" },
    ],
    mechanics: [
      "Like Armageddon it lasts **250 frames — ten seconds — regardless of its own level**, and every extra second comes from **Cyclone Armor** at fifty frames a hard point. A Wind Druid who maxes Cyclone Armor holds it for fifty seconds.",
      "It covers a radius of **9** around you and re-damages the same target every 20 frames.",
      "Its damage is **cold**, and it chills. Paired with Tornado's physical it gives one character two damage types with no gear and no mercenary aura behind either.",
      "It runs while you cast other things and while you walk, which is why the Wind Druid's rotation is *cast it, then forget it for forty seconds*.",
    ],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Shape Shifting Skills
  // -------------------------------------------------------------------------
  {
    slug: "werewolf",
    name: "Werewolf",
    classSlug: "druid",
    tree: "shape-shifting",
    kind: "shapeshift",
    requiredLevel: 1,
    summary: "Turns you into a wolf: much faster attacks, more life, no casting.",
    mechanics: [
      "Attack speed climbs from **10% to a ceiling of 80%** on a diminishing curve, so the first few points are worth far more than the last few.",
      "It adds a flat **25% life** of its own, on top of whatever Lycanthropy is giving.",
      "The form lasts **1000 frames — forty seconds — plus twenty more per hard point in Lycanthropy**, and re-casting it refreshes rather than cancels.",
      "While shifted you cannot cast, drink from the belt with the same freedom, or use most non-form skills. What you *can* keep running is anything already active, which is what makes the Armageddon hybrid legal.",
    ],
    confidence: "verified",
  },
  {
    slug: "lycanthropy",
    name: "Lycanthropy",
    classSlug: "druid",
    tree: "shape-shifting",
    kind: "passive",
    requiredLevel: 1,
    prerequisites: ["werewolf"],
    summary: "Lengthens both forms and adds life to both. Costs nothing to use.",
    mechanics: [
      "**+20% life at level 1 and 5% more per level**, applied in whichever form you are in. At twenty points that is +115% life, which is the largest single life bonus available to any class.",
      "It also adds **twenty seconds of form duration per hard point** on top of the base forty.",
      "It has no mana cost and no activation — the row carries zeroes for all three mana columns. It is a passive that the game happens to file next to the two forms.",
      "Every shapeshifting build maxes it, and it is the first thing a levelling shapeshifter puts points into after one in Werewolf.",
    ],
    confidence: "verified",
  },
  {
    slug: "werebear",
    name: "Werebear",
    classSlug: "druid",
    tree: "shape-shifting",
    kind: "shapeshift",
    requiredLevel: 6,
    summary: "Turns you into a bear: far more damage, defence and life, and slower.",
    mechanics: [
      "**+55% damage and 15% more per level**, **+40% defence and 10% more per level**, and a flat **+75% life** before Lycanthropy.",
      "Its attacks **cannot be interrupted** — the row grants a 100% chance of it — which is the real reason to pick the bear. A werewolf getting hit stops swinging; a werebear does not.",
      "It is slower than the wolf and does not get the wolf's attack-speed bonus, so the two forms end up at similar damage per second by different routes: the wolf hits often, the bear hits hard and never flinches.",
      "It has **no prerequisite** — it does not require Werewolf, despite sitting behind it in the tree.",
    ],
    confidence: "verified",
  },
  {
    slug: "feral-rage",
    name: "Feral Rage",
    classSlug: "druid",
    tree: "shape-shifting",
    kind: "attack",
    requiredLevel: 12,
    prerequisites: ["werewolf"],
    summary: "A wolf attack that builds charges: faster movement and life stolen with each one.",
    mechanics: [
      "Each hit adds a charge, up to **3 plus one for every two hard points** — integer division, so a level-2 Feral Rage still holds three and a level-3 holds four.",
      "Charges add **movement speed**, climbing from 10% toward a ceiling of 70%, and **life stolen per charge**. The site does not publish the per-charge steal because how the state stacks charges is in the engine and in none of the extracted columns.",
      "The attack's own damage bonus is **+50%, and 5% more per level** — modest, and not why anyone takes it.",
      "Charges decay after twenty seconds without a hit, so it is a skill for moving through a level rather than for standing on a boss.",
    ],
    confidence: "verified",
  },
  {
    slug: "maul",
    name: "Maul",
    classSlug: "druid",
    tree: "shape-shifting",
    kind: "attack",
    requiredLevel: 12,
    prerequisites: ["werebear"],
    summary: "A bear attack that builds charges and stuns what it hits.",
    mechanics: [
      "Each hit adds a charge, up to **3 plus one for every two hard points**, exactly as Feral Rage does. Charges add damage and attack speed; as with Feral Rage the per-charge figures are not published here, because the stacking is in the engine.",
      "The **stun** climbs from 10 toward a ceiling of 100 on a diminishing curve, and a stunned monster is a monster that is not hitting your bear.",
      "It is **Shock Wave's only synergy**, at 10% per hard point, so a bear that stuns for a living puts points here twice.",
      "Charges last twenty seconds.",
    ],
    confidence: "verified",
  },
  {
    slug: "rabies",
    name: "Rabies",
    classSlug: "druid",
    tree: "shape-shifting",
    kind: "attack",
    element: "poison",
    damageModel: "weapon-plus-element",
    requiredLevel: 18,
    prerequisites: ["feral-rage"],
    summary: "A bite that poisons, and whose poison spreads from the bitten to everything near it.",
    synergies: [{ skill: "poison-creeper", bonus: "+20% damage per level" }],
    mechanics: [
      "The weapon's full damage lands **and** the poison lands with it — the row adds no elemental conversion, so nothing is taken away from the hit to pay for it.",
      "The poison **spreads**. One bitten monster infects the pack around it, which is what turns a single-target melee attack into a clear skill and is the entire argument for the build.",
      "It runs for **100 frames — four seconds — plus ten more frames per hard point**, and poison damage is dealt across that window rather than on the hit.",
      "**Poison Creeper is its only synergy**, at 20% a point, which is why a Rabies build spends ten to twenty points in the summoning tree it otherwise ignores.",
      "Poison is the one element with no mastery anywhere in the game to raise it, so the ceiling here is lower than a fire or cold build's and it is reached earlier.",
    ],
    confidence: "verified",
  },
  {
    slug: "fire-claws",
    name: "Fire Claws",
    classSlug: "druid",
    tree: "shape-shifting",
    kind: "attack",
    element: "fire",
    damageModel: "weapon-plus-element",
    requiredLevel: 18,
    prerequisites: ["feral-rage", "maul"],
    summary: "A melee attack that adds a large block of fire damage to the weapon's own.",
    synergies: [
      { skill: "firestorm", bonus: "+22% damage per level" },
      { skill: "molten-boulder", bonus: "+22% damage per level" },
    ],
    mechanics: [
      "The weapon's damage lands in full and the fire lands on top of it. It is the only shapeshifting attack that gives the class an elemental answer without leaving melee.",
      "Its two synergies are both **22% per hard point**, the highest pair on the class, and both sit in the elemental tree — so the build is a shapeshifter that spends half its points somewhere else.",
      "It works in **either form**, which is unusual: Fury is wolf-only and Maul and Shock Wave are bear-only.",
      "Fire is the most commonly resisted element in Hell, so the build lives or dies on -enemy fire resistance from gear rather than on more points.",
    ],
    confidence: "verified",
  },
  {
    slug: "hunger",
    name: "Hunger",
    classSlug: "druid",
    tree: "shape-shifting",
    kind: "attack",
    requiredLevel: 24,
    prerequisites: ["fire-claws"],
    summary: "A weak bite that steals a great deal of life and mana.",
    mechanics: [
      "It deals **75% less damage** than a normal attack, and steals life and mana at rates climbing from 50% toward a ceiling of 200%.",
      "The steal ignores the usual reduction that applies to life stolen per hit in the higher difficulties less generously than players expect, so it is an emergency button rather than a sustain plan.",
      "One point is the normal investment, on a build that already has the prerequisites. It is the answer to a mana-burn pack or a bad moment in Hardcore.",
      "It works in **either form**.",
    ],
    confidence: "verified",
  },
  {
    slug: "shock-wave",
    name: "Shock Wave",
    classSlug: "druid",
    tree: "shape-shifting",
    kind: "spell",
    element: "physical",
    requiredLevel: 24,
    prerequisites: ["maul"],
    summary: "The bear slams the ground, stunning everything in a cone in front of it.",
    synergies: [{ skill: "maul", bonus: "+10% damage per level" }],
    mechanics: [
      "**It rolls no attack rating and cannot miss.** Its row carries neither `ToHit` nor `LevToHit`, where every melee attack in the tree carries both — so unlike Maul or Fury it works perfectly on a bear wearing no attack-rating gear.",
      "Five waves go out in a cone. Its damage is **physical and entirely its own**; your weapon contributes nothing to it.",
      "The stun runs **40 frames at level 1 and 15 frames longer per level** — 1.6 seconds up to about 13 seconds at twenty points, which is longer than most fights.",
      "It is the strongest crowd control the class has and the reason a Maul bear can hold a Hell pack in place while it works.",
    ],
    confidence: "verified",
  },
  {
    slug: "fury",
    name: "Fury",
    classSlug: "druid",
    tree: "shape-shifting",
    kind: "attack",
    requiredLevel: 30,
    prerequisites: ["rabies"],
    summary: "The wolf's finisher: a burst of up to five hits in a single attack.",
    mechanics: [
      "**Two hits at level 1, one more per level, capped at five from level 4 onward.** Points past the fourth buy damage, not hits.",
      "**+100% attack damage, and 17% more per level** — the largest damage multiplier on any Druid attack.",
      "The animation rolls back 70% of a frame per hit, which is why the burst is so much faster than five separate swings and why the build lives on Increased Attack Speed.",
      "Each hit is a separate attack roll, so life stolen, crushing blow and open wounds all get five chances rather than one. That is what makes the werewolf a viable boss killer with an ordinary weapon.",
    ],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Summoning Skills
  // -------------------------------------------------------------------------
  {
    slug: "raven",
    name: "Raven",
    classSlug: "druid",
    tree: "druid-summoning",
    kind: "summon",
    requiredLevel: 1,
    summary: "Birds that peck for small damage and blind what they hit.",
    synergies: [
      { skill: "summon-spirit-wolf", bonus: "+12% damage per level" },
      { skill: "summon-dire-wolf", bonus: "+12% damage per level" },
      { skill: "summon-grizzly", bonus: "+12% damage per level" },
    ],
    mechanics: [
      "**One raven per hard point up to five.** They cannot be killed by monsters — each leaves on its own after **12 hits plus one more per level**.",
      "The blind they apply is the reason to own them: a blinded monster loses track of you, and five birds keep a lot of things blinded.",
      "They inherit the player's **physical-immunity piercing** — the row reads the character's accumulated pierce stat, which is how a Sunder Charm reaches a minion at all.",
      "One point is the usual investment on any Druid, summoner or not. It is the cheapest crowd control in the class.",
    ],
    confidence: "verified",
  },
  {
    slug: "poison-creeper",
    name: "Poison Creeper",
    classSlug: "druid",
    tree: "druid-summoning",
    kind: "summon",
    element: "poison",
    requiredLevel: 1,
    summary: "A vine that burrows and poisons whatever stands over it.",
    synergies: [{ skill: "rabies", bonus: "+10% damage per level" }],
    mechanics: [
      "**One vine at a time**, and all three vines share that single slot — summoning a Carrion Vine replaces this one.",
      "Its poison runs for **100 frames — four seconds** — and the damage is spread across that window rather than dealt on contact.",
      "It is **Rabies' only synergy**, at 20% a hard point, which is why a Rabies werewolf spends twenty points on a vine it never watches.",
      "On any other build it is a one-point convenience at best.",
    ],
    confidence: "verified",
  },
  {
    slug: "oak-sage",
    name: "Oak Sage",
    classSlug: "druid",
    tree: "druid-summoning",
    kind: "summon",
    requiredLevel: 6,
    summary: "A totem that adds life to you and everyone near you.",
    mechanics: [
      "**+30% maximum life at level 1 and 5% more per level**, to the Druid, the mercenary, every minion and every party member inside a radius of **30, growing by 2 per level**.",
      "**One spirit at a time.** Oak Sage, Heart of Wolverine and Spirit of Barbs share a slot, so the choice between them is permanent for as long as the fight lasts.",
      "It is a totem and it can be killed. Losing it in the middle of a fight takes the life bonus with it, which in Hardcore is the specific way this skill gets people killed.",
      "It is the standard pick for a Hardcore Druid and for any build whose problem is staying alive rather than killing faster.",
    ],
    confidence: "verified",
  },
  {
    slug: "summon-spirit-wolf",
    name: "Summon Spirit Wolf",
    classSlug: "druid",
    tree: "druid-summoning",
    kind: "summon",
    requiredLevel: 6,
    prerequisites: ["raven"],
    element: "cold",
    summary: "Up to five ghostly wolves that bite for cold damage.",
    mechanics: [
      "**One wolf per hard point up to five.** They are the numerous half of the summoning tree; the dire wolves are the durable half, and the two do not share a cap.",
      "Each carries **elemental resistance of 5% per level, capped at 85%**, which is far more than any Necromancer skeleton ever gets and is why a Druid's army survives Hell.",
      "They are raised by the rest of the tree through **effective** level, not hard points: Summon Dire Wolf adds life to them and Summon Grizzly adds damage, and both read the level your gear gives you. A +3 Summoning pelt raises those bonuses; a synergy would not.",
      "Their cold damage chills, which slows a pack down for whatever is killing it.",
    ],
    confidence: "verified",
  },
  {
    slug: "carrion-vine",
    name: "Carrion Vine",
    classSlug: "druid",
    tree: "druid-summoning",
    kind: "summon",
    requiredLevel: 12,
    prerequisites: ["poison-creeper"],
    summary: "A vine that eats corpses and gives you life for each one.",
    mechanics: [
      "It heals you for **4% of the corpse at level 1, 1% more per level**, every time it consumes one.",
      "**One vine at a time**, shared with Poison Creeper and Solar Creeper.",
      "Eating corpses has a second effect nobody plans for and everybody notices: it removes the corpses a Necromancer in your party wanted to explode.",
      "One point is the whole investment. It is the most reliable passive healing in the class and costs nothing to maintain.",
    ],
    confidence: "verified",
  },
  {
    slug: "heart-of-wolverine",
    name: "Heart of Wolverine",
    classSlug: "druid",
    tree: "druid-summoning",
    kind: "summon",
    requiredLevel: 18,
    prerequisites: ["oak-sage"],
    summary: "A totem that adds damage and attack rating to you and everyone near you.",
    mechanics: [
      "**+20% damage and 7% more per level**, plus **+25% attack rating and 7% more per level**, inside a radius of **30 growing by 2 per level**.",
      "The bonus is enhanced damage, so it multiplies what the weapon already has — which makes it worth much more to a physical build than to a caster.",
      "**One spirit at a time**, shared with Oak Sage and Spirit of Barbs. Softcore physical builds take this; Hardcore builds usually take Oak Sage instead.",
      "It carries a `Bonus Level` of 3, so the totem is summoned three levels above the skill's own — a detail that matters only for how long it survives.",
    ],
    confidence: "verified",
  },
  {
    slug: "summon-dire-wolf",
    name: "Summon Dire Wolf",
    classSlug: "druid",
    tree: "druid-summoning",
    kind: "summon",
    requiredLevel: 18,
    prerequisites: ["oak-sage", "summon-spirit-wolf"],
    summary: "Up to three large wolves that are far tougher than the spirit wolves.",
    mechanics: [
      "**One wolf per hard point up to three**, on a cap of their own — the five spirit wolves stand alongside them.",
      "They carry **+50% life and 15% more per level**, and that bonus is given to the **spirit wolves as well**, through effective level rather than hard points.",
      "Like the spirit wolves they gain **5% elemental resistance per level up to 85%**, and they inherit the player's physical-immunity piercing.",
      "They also **howl**, which sends monsters fleeing — useful and occasionally infuriating, because a fleeing monster is a monster your bear has to chase.",
    ],
    confidence: "verified",
  },
  {
    slug: "solar-creeper",
    name: "Solar Creeper",
    classSlug: "druid",
    tree: "druid-summoning",
    kind: "summon",
    requiredLevel: 24,
    prerequisites: ["carrion-vine"],
    summary: "A vine that eats corpses and gives you mana for each one.",
    mechanics: [
      "It restores **4% of the corpse as mana at level 1, 1% more per level**. The same shape as Carrion Vine, on the other resource.",
      "**One vine at a time**, shared with the other two creepers, so taking this means giving up the healing.",
      "It is the better choice on a build whose limit is mana rather than life — a Wind Druid casting Tornado continuously is the obvious one — and the worse choice on almost everything else.",
    ],
    confidence: "verified",
  },
  {
    slug: "spirit-of-barbs",
    name: "Spirit of Barbs",
    classSlug: "druid",
    tree: "druid-summoning",
    kind: "summon",
    requiredLevel: 30,
    prerequisites: ["heart-of-wolverine"],
    summary: "A totem that returns a share of melee damage to whatever dealt it.",
    mechanics: [
      "It returns **32% of melee damage at level 1**, rising steeply in bands to **347% at level 20** — the site reads those bands from the same columns a damage table comes from.",
      "The damage returned is **physical**, so it does nothing against a physical immune and everything against a Hell mob of melee attackers.",
      "**One spirit at a time**, shared with Oak Sage and Heart of Wolverine, and it is the least-taken of the three: giving up a life or damage bonus for reflected damage is rarely the better trade.",
      "Its main use is a party where somebody else is tanking, and Uber runs where the attackers are melee and numerous.",
    ],
    confidence: "verified",
  },
  {
    slug: "summon-grizzly",
    name: "Summon Grizzly",
    classSlug: "druid",
    tree: "druid-summoning",
    kind: "summon",
    requiredLevel: 30,
    prerequisites: ["summon-dire-wolf"],
    summary: "One large bear that hits harder than anything else the class can summon.",
    mechanics: [
      "**One bear**, and it is the tree's damage. Its own damage bonus is **+25% and 10% more per level**, and that same bonus is given to **both kinds of wolf** through effective level rather than hard points — which is why a Summoner maxes it even though it summons a single minion.",
      "It gains **5% elemental resistance per level up to 85%** and inherits the player's physical-immunity piercing.",
      "It taunts. The bear pulls monsters onto itself, which is the whole defensive plan of a Summon Druid and the reason the build reads as safe.",
      "It cannot be re-summoned while it lives, so losing it mid-fight costs a full cast at 40 mana rather than a top-up.",
    ],
    confidence: "verified",
  },
];
