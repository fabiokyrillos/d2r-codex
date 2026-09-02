import type { Build } from "@/lib/types";

/**
 * The Multiple Shot Amazon.
 *
 * Two columns separate this from the Strafe page.
 *
 * **Arrows are `min(2 + level - 1, 24)`** — two at level 1, one more per level,
 * a ceiling of 24 that +skills can actually reach. Where Strafe stops at ten
 * shots at skill level 7, this one keeps widening the whole way, and every
 * arrow is fired into a fixed cone whether or not there is anything in it.
 * That is why pierce carries fifteen points here and one on the Strafe page.
 *
 * **Multiple Shot's row has no ToHit column at all**, where Strafe's carries
 * 30% plus 9% per level. It gets no attack-rating bonus from the skill, so the
 * plan buys the whole thing from Penetrate and from Ignore Target's Defense.
 *
 * One asymmetry worth stating rather than smoothing over: Guided Arrow's row
 * reads Multiple Shot's level under a parameter the game labels "Damage
 * synergy", and Multiple Shot's row reads Guided Arrow's level under one it
 * labels "Damage % per level". The generated graph records only the labelled
 * synergy, so only one direction appears in the tree — and both directions are
 * reasons this plan maxes Guided Arrow.
 */
export const multipleShotAmazon: Build = {
  slug: "multiple-shot-amazon",
  name: "Multiple Shot Amazon",
  classSlug: "amazon",
  summary:
    "A cone of up to twenty-four arrows, each one piercing the row behind it. The widest physical clear in the game.",
  damageTypes: ["physical"],
  primarySkill: "multiple-shot",
  playstyle:
    "You point the Amazon at a crowd and fire a spread of arrows into it — two at level 1 and one more per level, up to twenty-four. The arrows go where you aimed rather than seeking targets, so the skill rewards facing a corridor and punishes shooting at one monster in an open field. Pierce is what turns the cone into a wall: each arrow that passes through a target keeps going and hits the row behind it, and in a dense pack that is the difference between clearing a screen and scratching it. Guided Arrow is the other button, for the single target the cone wastes itself on.",
  strengths: [
    "**Up to twenty-four arrows in one press**, which no other skill in the game approaches",
    "Pierce multiplies the whole cone at once, so a Razortail is worth more here than on any other build",
    "Costs 4 mana at level 1 — the cheapest clearing skill any Amazon has",
    "Available at level 6, so the character is complete far earlier than any javelin build",
    "One damage type and one gear plan, with no immunity to reason about until Hell",
  ],
  weaknesses: [
    "**Physical immunity is a complete wall**, exactly as on the Strafe page and for the same reason",
    "Each arrow carries three quarters of the bow's damage rather than all of it",
    "**Only the two centre arrows apply on-hit effects** — knockback, life steal, Crushing Blow",
    "**No attack-rating bonus of its own**, unlike Strafe, so Penetrate and Ignore Target's Defense are not optional",
    "It fires where you aimed rather than at what is there, so it wastes most of itself on one target",
  ],
  difficulty: "beginner",
  budget: "medium",
  ratings: {
    clearSpeed: 5,
    bossing: 3,
    survivability: 3,
    magicFind: 3,
    terrorZones: 4,
    ubers: 1,
    soloSelfFound: 4,
    players8: 4,
  },

  skills: [
    {
      skill: "multiple-shot",
      points: 20,
      role: "main",
      order: 1,
      note: "**Two arrows at level 1, one more per level, ceiling 24.** Unlike Strafe's ten-shot cap, this one is high enough that +skills keep buying arrows.",
    },
    {
      skill: "guided-arrow",
      points: 20,
      role: "main",
      order: 2,
      note: "The single-target skill, and the one the game's tables tie to Multiple Shot in both directions — a labelled damage synergy one way and a 'Damage % per level' parameter the other.",
    },
    {
      skill: "critical-strike",
      points: 20,
      role: "utility",
      order: 3,
      note: "A chance to double physical damage, applied per arrow. The chance climbs toward the 80% ceiling the columns name; the curve between is in the engine.",
    },
    {
      skill: "penetrate",
      points: 20,
      role: "utility",
      order: 4,
      note: "**35% attack rating plus 10% per level, and Multiple Shot has no bonus of its own.** This is the skill Strafe does not need and this build cannot do without.",
    },
    {
      skill: "pierce",
      points: 15,
      role: "utility",
      order: 5,
      note: "**Fifteen points, which no other build on the site spends here.** A cone of twenty-four arrows piercing one row deeper is twenty-four more hits. Count your Razortail first — gear and skill are one pool.",
    },
    { skill: "magic-arrow", points: 1, role: "prerequisite", note: "Multiple Shot's prerequisite, and a shot that costs no arrows at all." },
    { skill: "cold-arrow", points: 1, role: "prerequisite", note: "Guided Arrow's prerequisite." },
    { skill: "valkyrie", points: 1, role: "utility", note: "Something to hold the front of the cone while you fire into it." },
    { skill: "decoy", points: 5, role: "utility", note: "Hard points raise the Valkyrie's life. A Decoy placed past a pack also pulls it into your cone." },
    { skill: "evade", points: 1, role: "prerequisite", note: "Valkyrie's prerequisite, and avoidance while repositioning." },
    { skill: "avoid", points: 1, role: "prerequisite", note: "Evade's prerequisite." },
    { skill: "dodge", points: 1, role: "prerequisite", note: "Avoid's prerequisite." },
    { skill: "slow-missiles", points: 1, role: "utility", note: "Decoy's prerequisite, and the answer to a ranged pack you are standing still to shoot." },
    { skill: "inner-sight", points: 1, role: "prerequisite", note: "Slow Missiles' prerequisite, and it lowers the defence of a whole pack at once — which pairs with a cone." },
  ],
  flexPoints: [
    "**The plan spends 108 of 110.** Pierce is the block to tune: add a Razortail and 33% arrives for free, so re-count before spending the last five points here.",
    "**Do not take Strafe.** It shares the same weapon and the same passives, and a build that maxes both is two half-builds. If Strafe is what you want to press, that page has a different Penetrate and Pierce split for good reasons.",
    "If the cone is clearing fine and you are dying instead, move Pierce's last points into Dodge, Avoid and Evade.",
  ],
  stats: {
    strength: "Whatever the bow asks. A Balista is 110 Strength and a Ward Bow is 72 — that difference is thirty attribute points.",
    dexterity: "High, and it is never wasted: it pays for the bow, raises attack rating and raises physical damage.",
    vitality: "Everything left. No shield means Vitality and hit recovery are the whole defence.",
    energy: "None. Multiple Shot costs 4 mana at level 1 and rises by 1 per level — the cheapest clear in the game.",
    notes: [
      "**The bow decides the stat plan, so choose it before spending.** A Buriza-Do Kyanon at 110 Strength and 80 Dexterity is a completely different character from a Ward Bow at 72 and 146.",
      "Dexterity raises the bow's own damage as well as attack rating, so on this build it competes with Vitality honestly rather than losing to it automatically.",
      "There is no shield and no block. Every point not spent on requirements belongs in Vitality.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 32,
      frames: 7,
      priority: "required",
      why: "You fire from a standing position with no shield. Getting stunned out of that is how this build dies, and 32% is the affordable answer.",
    },
    {
      stat: "fhr",
      value: 52,
      frames: 6,
      priority: "recommended",
      why: "A Peace armor and boots reach it between them, so it usually costs nothing you were not already buying.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Multiple Shot at level 6, and a bow that can hold three sockets.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "edge" },
              why: "35% attack speed and huge bonus damage to demons and undead, for three Countess runes at level 25.",
              sockets: "Tir, Tal, Amn into a 3-socket bow.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Hit recovery and run speed from level 17 — the two stats a shieldless character misses most." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills, which at this level is another arrow in every cone." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Any gloves with Increased Attack Speed",
              why: "Vendors sell magic gloves with it, and nothing else in the slot matters yet.",
              lookFor: ["20% Increased Attack Speed"],
            },
          ],
        },
      ],
      nextUpgrade: "Level 18 for Guided Arrow, then a Melody at 39.",
      notes:
        "**Multiple Shot is the earliest complete Amazon clear in the game**, available at level 6 for four mana. The whole first difficulty is this skill and Magic Arrow, and neither is thrown away later.",
    },

    {
      tier: "nightmare",
      goal: "A wide cone, a Valkyrie, and the first pierce.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "melody" },
              why: "+3 to the whole Bow and Crossbow tab is three more arrows per cone, plus +3 to Critical Strike.",
              sockets: "Shael, Ko, Nef into a 3-socket bow.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "buriza-do-kyanon" },
                  why: "**100% Piercing Attack for free** at level 41, which is the single largest step this build ever takes — and it lets you leave Pierce at one point until much later.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "peace" }, why: "+2 Amazon skills, +2 Critical Strike and hit recovery, for three cheap runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find while nothing better exists." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce for 20 Strength. On a twenty-four arrow cone this is the best-value item in the game." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "the-cats-eye" }, why: "20% attack speed and 25 Dexterity, both of which are damage on a physical bow." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and up to 250 attack rating, which this build has no other cheap source for." }],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "75% before Hell, on a character with no shield to hide behind." }],
      nextUpgrade: "An elite bow and a Fortitude.",
      notes:
        "**Attack speed matters and there is no Amazon number for it.** A Balista is one of the slowest bases in the game and a Ward Bow one of the fastest, so the same percentage buys very different frames. Take attack speed where it is free, and judge it on the bow you are holding rather than against a table.",
    },

    {
      tier: "early-hell",
      goal: "Attack rating, capped resistances, and pierce near its ceiling.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "buriza-do-kyanon" },
              why: "100% Piercing Attack and 80% attack speed on a slow base. Every arrow in the cone passes through everything it meets.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "eaglehorn" },
                  why: "Ignore Target's Defense and +1 Amazon skills, on a much faster base — the choice if your Pierce points and Razortail already cover the pierce.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage on every one of the twenty-four arrows." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills — two more arrows — plus life and damage reduction at 50 Strength." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves with 20% Increased Attack Speed",
              why: "Attack speed and resistances in one slot.",
              lookFor: ["20% Increased Attack Speed", "Two resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce, and it stacks with the skill toward the same ceiling." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "the-cats-eye" }, why: "Attack speed, Dexterity and the movement a shieldless character needs." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "Life, Dexterity and a raised maximum fire resistance." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "75% in all four, and life on top." }],
      nextUpgrade: "A Faith bow, and an answer to physical immunity.",
      notes:
        "**Count your pierce total before spending more skill points.** A Buriza is already at the ceiling on its own, and a Razortail plus a handful of hard points gets most of the way there without it. This is the one build where reading the Pierce article first saves you fifteen skill points.",
    },

    {
      tier: "budget",
      goal: "Fanaticism, and something that hurts physical immunes.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "faith" },
              why: "A Fanaticism aura in your own hands — attack speed, attack rating and damage together, plus +1-2 all skills for more arrows.",
              sockets: "Ohm, Jah, Lem, Eld into a 4-socket bow.",
              alternatives: [
                { ref: { kind: "unique", slug: "buriza-do-kyanon" }, why: "Keep it if your pierce total falls apart without it. Free pierce is worth a lot of attack speed." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage, multiplied across the whole cone." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "andariels-visage" },
              why: "+2 skills, 20% attack speed and life steal — though **only the two centre arrows steal**, so the leech is smaller than it looks.",
              sockets: "An Um rune for the fire resistance it costs.",
              alternatives: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "No resistance penalty, and the same +2 skills." }],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "atmas-scarab" },
              why: "**Amplify Damage on striking**, which is the answer to physical immunity. Note that the centre arrows are the ones that can apply it.",
              alternatives: [{ ref: { kind: "unique", slug: "the-cats-eye" }, why: "More attack speed and Dexterity, if the mercenary is handling the immunes." }],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves: 20% Increased Attack Speed, resistances",
              why: "The cheapest attack speed left.",
              lookFor: ["20% Increased Attack Speed", "Two resistances at 20+"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills, which is one more arrow." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find on the fastest clearing build the Amazon has." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills — three more arrows per cone." },
        { label: "Bow and Crossbow skill grand charms", why: "Skill levels are arrows here, not just damage." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, on a character with no shield." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "A Wrath for the physical immunes, and the last skill charms.",
    },

    {
      tier: "optimized",
      goal: "A twenty-four arrow cone that pierces everything and hits everything.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "faith" },
              why: "A level 15 Fanaticism roll with +2 all skills — attack speed, attack rating and two more arrows from one item.",
              lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
              alternatives: [
                { ref: { kind: "runeword", slug: "wrath" }, why: "Decrepify on striking for the packs Faith cannot hurt at all. Kept on the swap rather than worn." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage and the defence a shieldless build has no other source for." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills and 20% attack speed, with an Um in the socket." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "atmas-scarab" }, why: "Amplify Damage on striking, the build's only real answer to physical immunity." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves: 20% Increased Attack Speed, resistances, life",
              why: "Attack speed and the resistances Andariel's Visage costs.",
              lookFor: ["20% Increased Attack Speed", "Two resistances at 30+"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find, or Gore Rider if you would rather have Crushing Blow on the centre arrows." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Bow and Crossbow skill grand charms with life", why: "Arrows and life together." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "The last charm rolls, and a Bone Break for the zones Amplify Damage cannot cover.",
    },

    {
      tier: "bis",
      goal: "Nothing left to fix.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "faith" },
              why: "Level 15 Fanaticism and +2 all skills, in whichever 4-socket bow your Dexterity reaches.",
              lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
              alternatives: [{ ref: { kind: "runeword", slug: "wrath" }, why: "On the swap, for physical immunes." }],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills and attack speed, Um in the socket." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "atmas-scarab" }, why: "Amplify Damage on striking." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves: 20% Increased Attack Speed, two resistances, life",
              why: "The best version of the only slot with no unique worth wearing.",
              lookFor: ["20% Increased Attack Speed", "Two resistances at 30+"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { ref: { kind: "unique", slug: "bone-break" }, why: "Carried for the zones where Amplify Damage's five percent a hit is not enough. Its penalty is your own damage reduction, which at bow range is the cheapest of the six." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "wrath" }, why: "Swapped in for a physically immune pack." },
      ],
      notes:
        "**The cone is at twenty-four arrows and every one of them pierces**, so what remains to buy is damage per arrow and hit rate. Attack speed is still a per-bow question and always will be: the same total behaves differently in a Grand Matron Bow, a Ward Bow and a Balista, so test rather than read.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**The Act 2 Desert Mercenary, not the Rogue.** The Strafe page recommends a second Faith on an Act 1 Rogue and it is right to, but this build has a wider gap to cover: with no attack-rating bonus of its own and no elemental damage anywhere, it wants **Might** for the raw damage and a hireling whose weapon can hurt what yours cannot. Give him an **Insight** early for the mana, then a **Pride** or an elemental weapon so he handles physical immunes while you clear everything else. **Holy Freeze** if you would rather nothing reached your firing position at all.",

  farming: [
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "A herd standing in a line is exactly the shape a twenty-four arrow cone wants, and the run is short enough to repeat forever. Physical immunity does appear here, so the amulet and the mercenary are what keep it from stopping you.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and full of short corridors, which is the shape a cone is best in. It holds physical immunes, so this is an Amplify Damage zone rather than a free one.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 and narrow. Almost nothing there resists physical damage, which makes it a better zone for this build than for most.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85, seconds from a waypoint, and full of undead your bow does bonus damage to.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Dense and high level, and the seal packs stand in the corridors a cone is best in. Physical immunity is part of the population, and Iron Maiden is the other hazard — a twenty-four arrow burst reflected is fatal.",
      minTier: "budget",
      rating: 3,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council stand together and are not physically immune. One cone covers all of them.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "The best experience in the game and dense enough for the cone, but physical immunity is common — an Amplify Damage zone rather than a starting one.",
      minTier: "optimized",
      rating: 3,
    },
  ],

  immunityPlan:
    "Identical in kind to the Strafe page's and different in one detail. **All of your damage is physical, so a physical immune takes nothing at all** — no mastery, facet or aura raises physical damage past an immunity. The answers are **Amplify Damage from an Atma's Scarab**, **Decrepify from a Wrath bow on the swap**, **a Bone Break charm**, and **your mercenary's elemental weapon**. The detail that differs: **only the two centre arrows of a Multiple Shot apply on-hit effects**, so a curse proc fires far less often here than it does from a ten-shot Strafe burst where every shot is a separate hit. That makes the mercenary and the Wrath swap relatively more important on this build, and the amulet relatively less.",

  hardcoreNotes:
    "Safer than Strafe for one reason: you are not locked into a long animation, so you can fire and step. Everything else is the same — no shield, no block, and Vitality plus hit recovery as the whole defence. Reach 32% Faster Hit Recovery before Hell, keep **Slow Missiles** on the bar, and place the **Decoy** past a pack rather than in front of you: it pulls them into the cone and takes the arrows meant for you at the same time. Take Holy Freeze on the mercenary.",

  selfFoundNotes:
    "Excellent, and slightly better than the Strafe page's for one reason: **Multiple Shot arrives at level 6** rather than 24, so a fresh character is clearing properly within an hour. Edge, Melody and Peace are all Countess runewords, and Buriza-Do Kyanon — the single largest upgrade this build makes — drops from late Nightmare onward and is one of the most common elite-capable weapons in the game. Faith is the only item genuinely out of reach, and the build is fine without it.",

  levelingPath: {
    summary:
      "**This build is its own leveling plan**, and the earliest one on the site. Multiple Shot at level 6 clears the whole of Normal, Guided Arrow at 18 handles the bosses, and nothing in either has to be unlearned later. Put points in Critical Strike as you go rather than saving them — it is a percentage that works from the first point.",
    respecAt: "Not needed. Keep the tokens.",
  },

  confidence: "verified",
  complete: true,
};
