import type { Build } from "@/lib/types";

/**
 * The Strafe Amazon.
 *
 * Three columns from the game's own tables decide how this page is written.
 *
 * **Shots are `min(4 + level - 1, 10)`.** Four at level 1, one more per level,
 * and a hard ceiling of ten reached at skill level 7. Every hard point past the
 * seventh buys damage — 5% baseline plus 5% per level — and not one extra
 * arrow. That is the single most useful thing to know about the skill and it is
 * almost never stated.
 *
 * **Strafe carries its own attack-rating bonus**, 30% baseline plus 9% per
 * level. Multiple Shot's row has no such column at all, which is why these two
 * otherwise similar builds put very different amounts into Penetrate.
 *
 * **Its two synergies are Guided Arrow at 10% per level and Multiple Shot at
 * 5%.** Both are skills you would want anyway — Guided Arrow as the
 * single-target answer, Multiple Shot as the wide clear — so the plan has no
 * dead points in it.
 */
export const strafeAmazon: Build = {
  slug: "strafe-amazon",
  name: "Strafe Amazon",
  classSlug: "amazon",
  summary:
    "Up to ten arrows a burst, each one the bow's full damage. The purest physical archer in the game, and the one that never misses.",
  damageTypes: ["physical"],
  primarySkill: "strafe",
  playstyle:
    "You hold the button and the Amazon fires at everything in range in one burst — up to ten shots, each picking its own target, each carrying the bow's full damage. You are locked in the animation while it plays, which is the whole trade: enormous output in exchange for standing still. Guided Arrow is the other half of the bar, an arrow that tracks its target and cannot miss, for the boss the burst cannot finish. There is no elemental damage anywhere in this build, which makes it the simplest Amazon to gear and the one with the sharpest single weakness.",
  strengths: [
    "**Ten shots a burst, each at the bow's full damage** — the highest sustained physical output in the game",
    "Strafe carries its own attack-rating bonus, so it connects where other physical builds miss",
    "Guided Arrow cannot miss, which makes bosses a matter of time rather than of gear",
    "One damage type means one gear plan: attack speed, damage, and Deadly Strike",
    "Cheap to start — a Melody runeword is three low runes and +3 to the whole tree",
  ],
  weaknesses: [
    "**Physical immunity is the only wall, and it is a complete one** without Amplify Damage or Decrepify",
    "You are rooted in the animation for the whole burst, which is where the deaths come from",
    "**Shots cap at ten at skill level 7** — points past that buy damage only, and many guides imply otherwise",
    "Knockback fights the skill: a target pushed away is a shot that finds nothing",
    "**Attack speed is a per-bow question**, not an Amazon number — a Hydra Bow and a Ward Bow do not behave the same at the same percentage",
  ],
  difficulty: "beginner",
  budget: "medium",
  ratings: {
    clearSpeed: 4,
    bossing: 4,
    survivability: 3,
    magicFind: 3,
    terrorZones: 4,
    ubers: 2,
    soloSelfFound: 4,
    players8: 3,
  },

  skills: [
    {
      skill: "strafe",
      points: 20,
      role: "main",
      order: 1,
      note: "**Ten shots at skill level 7, and no more ever.** Points past that are 5% damage each, which is still the best place for them.",
    },
    {
      skill: "guided-arrow",
      points: 20,
      role: "main",
      order: 2,
      note: "A 10% per level synergy for Strafe **and** the single-target skill. It seeks, so it cannot miss — bosses and fleeing monsters both.",
    },
    {
      skill: "multiple-shot",
      points: 20,
      role: "synergy",
      order: 3,
      note: "A 5% per level synergy, and a wide cone for the moments a burst would waste shots on one target.",
    },
    {
      skill: "critical-strike",
      points: 20,
      role: "utility",
      order: 4,
      note: "**A chance to double physical damage, and all your damage is physical.** The chance climbs toward the 80% ceiling the game's own columns name; the curve between is in the engine, not in any table.",
    },
    {
      skill: "penetrate",
      points: 10,
      role: "utility",
      order: 5,
      note: "**Less than a Multiple Shot plan needs**, because Strafe already carries 30% attack rating plus 9% per level of its own. Ten points and Ignore Target's Defense on the bow covers it.",
    },
    {
      skill: "dodge",
      points: 5,
      role: "utility",
      note: "**The passive that matters most on this build.** Strafe roots you in place, and Dodge is the chance to avoid a melee attack while standing still or attacking.",
    },
    { skill: "pierce", points: 1, role: "utility", note: "One point. Strafe's shots already pick separate targets, so pierce adds less here than on the cone build — read the Pierce article." },
    { skill: "magic-arrow", points: 1, role: "prerequisite", note: "Multiple Shot's prerequisite, and a mana-free attack that never depletes a quiver." },
    { skill: "cold-arrow", points: 1, role: "prerequisite", note: "Guided Arrow's prerequisite. The chill it adds is a genuine defensive line early on." },
    { skill: "valkyrie", points: 1, role: "utility", note: "Something in front of you while you are locked in an animation. Not optional on this build." },
    { skill: "decoy", points: 5, role: "utility", note: "Hard points raise the Valkyrie's life, and a Decoy is what ranged packs shoot instead of you." },
    { skill: "evade", points: 1, role: "prerequisite", note: "Valkyrie's prerequisite, and avoidance while moving." },
    { skill: "avoid", points: 1, role: "prerequisite", note: "Evade's prerequisite, and avoidance of ranged attacks while you are firing." },
    { skill: "slow-missiles", points: 1, role: "utility", note: "Decoy's prerequisite, and the answer to the ranged packs that punish a rooted character." },
    { skill: "inner-sight", points: 1, role: "prerequisite", note: "Slow Missiles' prerequisite, and it lowers the defence of everything you are shooting." },
  ],
  flexPoints: [
    "**The plan spends 108 of 110.** Penetrate and Dodge are the adjustable blocks; move points between them according to whether you are missing or dying.",
    "**Do not push Strafe past twenty expecting more shots.** The cap is ten and it arrives at skill level 7. Beyond that the skill buys 5% damage per level, and +skills from gear buy nothing but that too.",
    "Avoid and Evade deserve more than one point each on a hardcore character. They come out of Penetrate.",
  ],
  stats: {
    strength: "Whatever the bow asks, and bows ask a lot — a Hydra Bow is 134, a Crusader Bow 97, a Ward Bow only 72. Choose the bow before spending.",
    dexterity: "**More than any other build on the site.** Bows have the highest Dexterity requirements in the game, Dexterity raises attack rating, and on a physical build it raises damage too.",
    vitality: "Everything left. You are at range but rooted, and rooted at range is not safe.",
    energy: "None. Strafe costs 11 mana flat and Guided Arrow's cost falls as it levels.",
    notes: [
      "**This is the one Amazon where Dexterity is a damage stat.** It raises attack rating and it raises the bow's damage, so points there are never dead the way they are on a caster.",
      "Bow requirements are the real constraint on the whole stat plan. A Ward Bow at 72 Strength and 146 Dexterity, and a Hydra Bow at 134 and 167, ask for completely different characters.",
      "No shield means no block, so Vitality and hit recovery are all the defence you have besides the Valkyrie and the passives.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 32,
      frames: 7,
      priority: "required",
      why: "A character who is rooted in an attack animation and then stunned out of it is a character taking a full pack's attention. This is the one number to reach before Hell.",
    },
    {
      stat: "fhr",
      value: 52,
      frames: 6,
      priority: "recommended",
      why: "Cheap on this build — a Peace armor is 20% and boots supply the rest.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 24 for Strafe, with a bow that does not embarrass you.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "edge" },
              why: "35% attack speed, Thorns, and enormous bonus damage to demons and undead for three Countess runes at level 25.",
              sockets: "Tir, Tal, Amn into a 3-socket bow.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "melody" },
                  why: "+3 to the entire Bow and Crossbow tab plus +3 each to Critical Strike, Dodge and Slow Missiles, at level 39. Twelve skill levels for three low runes.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Hit recovery and run speed at level 17, which is what a rooted character needs most." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills for two common runes." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Any gloves with Increased Attack Speed",
              why: "Attack speed is the only stat that matters this early, and vendors sell magic gloves that carry it.",
              lookFor: ["20% Increased Attack Speed"],
            },
          ],
        },
      ],
      nextUpgrade: "Level 24 for Strafe, then a Melody at 39 and a real bow after that.",
      notes:
        "Magic Arrow from level 1 costs no arrows at all, which matters more than it sounds when quivers cost gold you do not have. Multiple Shot at 6 is the clear button until Strafe exists at 24.",
    },

    {
      tier: "nightmare",
      goal: "Strafe online, attack speed climbing, and a Valkyrie in front of you.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "melody" },
              why: "+3 to the whole bow tab and +3 to Critical Strike. Nothing else at this level comes close for the price.",
              sockets: "Shael, Ko, Nef into a 3-socket bow.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "harmony" },
                  why: "A Vigor aura and a Valkyrie any class can summon, if you would rather have movement and elemental damage than skill levels.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "peace" }, why: "+2 Amazon skills, +2 Critical Strike and 20% Faster Hit Recovery for three cheap runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find while nothing better exists." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% Piercing Attack for 20 Strength — every arrow that pierces hits the row behind the one you aimed at." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "the-cats-eye" }, why: "20% attack speed, 25 Dexterity and 30% run speed. On a physical bow build every line of that is damage or survival." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and up to 250 attack rating. Being chilled while rooted is the worst combination this build has." }],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "75% in all four before Hell." }],
      nextUpgrade: "An elite bow and a Fortitude. Both are large steps and neither is expensive.",
      notes:
        "**Attack speed is now the stat you are shopping for, and there is no single number to aim at.** The frames a bow gives you depend on its own base speed and on the skill you are using, and this site does not publish a table that would be wrong for most setups. Take attack speed wherever it is free and judge it on the bow in your hands.",
    },

    {
      tier: "early-hell",
      goal: "An elite bow, capped resistances, and the attack rating to use both.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "widowmaker" },
              why: "**Ignore Target's Defense and 33% Deadly Strike** at only 72 Strength — the cheapest way to stop missing and start doubling.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "eaglehorn" },
                  why: "+1 Amazon skills, Ignore Target's Defense, and damage that grows with your level. Six sockets, which is the reason to prefer it later.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage. On a build whose damage is entirely the bow's, this is the single largest upgrade available." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life per level and 10% damage reduction at 50 Strength." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves with 20% Increased Attack Speed",
              why: "Attack speed and resistances in the slot with no unique worth taking.",
              lookFor: ["20% Increased Attack Speed", "Two resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce, and it is doing more for your damage than any belt with resistances would." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "the-cats-eye" }, why: "Attack speed, Dexterity and movement." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "Life, Dexterity and a raised maximum fire resistance, on a character with no shield." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "Hold 75% and add the life a shieldless character needs." }],
      nextUpgrade: "A Faith bow, or a Wrath for the physical immunes.",
      notes:
        "**Physical immunity starts here and it is absolute.** No amount of damage helps; every point of it is physical. The answers are Amplify Damage from an Atma's Scarab, Decrepify from a Wrath bow, a Bone Break charm, or your mercenary — and the farming list below is ordered with that in mind.",
    },

    {
      tier: "budget",
      goal: "A Fanaticism aura, and an answer to physical immunity.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "faith" },
              why: "**A Fanaticism aura in your own bow**: attack speed, attack rating and damage together, plus +1-2 all skills. The single best Strafe weapon in the game.",
              sockets: "Ohm, Jah, Lem, Eld into a 4-socket bow.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "wrath" },
                  why: "Decrepify on striking, which halves physical resistance and breaks most physical immunity. Kept on the swap for the packs Faith cannot hurt.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage and the defence a shieldless character has no other source for." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "andariels-visage" },
              why: "+2 skills, 20% attack speed and life steal. Its −30% fire resistance has to be paid for first.",
              sockets: "An Um rune returns most of the fire resistance.",
              alternatives: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "Safer, cheaper, and no resistance penalty to plan around." }],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "atmas-scarab" },
              why: "**Amplify Damage on striking**, which halves physical resistance and often breaks physical immunity outright. Ten arrows a burst applies it constantly.",
              alternatives: [{ ref: { kind: "unique", slug: "the-cats-eye" }, why: "More attack speed and Dexterity, if the mercenary is handling the immunes." }],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves: 20% Increased Attack Speed, resistances",
              why: "The cheapest attack speed left on the character.",
              lookFor: ["20% Increased Attack Speed", "Two resistances at 20+"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce, still the best damage in the slot." }],
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
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and damage while you farm." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Bow and Crossbow skill grand charms", why: "Damage on Strafe and Guided Arrow together." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, on a character with no shield." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "A Windforce, or a better Faith roll. Then the charms.",
    },

    {
      tier: "optimized",
      goal: "The highest sustained physical damage the game allows.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "faith" },
              why: "A level 15 Fanaticism roll with +2 all skills. Attack speed, attack rating and damage from one item, on a build that needs all three.",
              lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
              alternatives: [
                {
                  ref: { kind: "unique", slug: "windforce" },
                  why: "More raw damage than anything else in the game — and **Knockback, which pushes targets out of a Strafe burst.** A real trade, not a strict upgrade.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage, and everything you have is Enhanced Damage's to multiply." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills, 20% attack speed and life steal, with an Um in the socket." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "atmas-scarab" }, why: "Amplify Damage on striking — the build's answer to physical immunity, applied ten times a burst." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves: 20% Increased Attack Speed, resistances, life",
              why: "The last attack speed, and the resistances Andariel's Visage costs.",
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
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike and Open Wounds — all three multiply physical damage, which is all you have." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Bow and Crossbow skill grand charms with life", why: "Damage and the life a shieldless build needs." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "A Wrath on the swap, and the last charm rolls.",
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
              why: "A level 15 Fanaticism and +2 all skills roll, in a Grand Matron Bow if the Dexterity is there.",
              lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
              alternatives: [
                { ref: { kind: "runeword", slug: "wrath" }, why: "The physical-immunity bow, on the swap. Decrepify at 30% a hit and 20% Crushing Blow." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage and 200% enhanced defence." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills, attack speed and life steal, Um in the socket." }],
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
              why: "The one slot where a craft beats every unique.",
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
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike, Open Wounds." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { ref: { kind: "unique", slug: "bone-break" }, why: "The direct answer to physical immunity, and the one whose penalty is your own damage reduction rather than a resistance. Carried for the zone, not worn always." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "wrath" }, why: "Swapped in for a physical immune pack rather than carried in the belt." },
      ],
      notes:
        "The build ends with three separate answers to its one weakness — Amplify Damage from the amulet, Decrepify from a Wrath on the swap, and a Bone Break charm — and it needs all three only in the worst zones. **Everything else left to buy is attack speed and skill levels, and attack speed is still a per-bow question**: a Grand Matron Bow, a Ward Bow and a Hydra Bow reach their frames at different totals.",
    },
  ],

  mercenary: "act-1-rogue-scout",
  mercenaryNotes:
    "**The Act 1 Rogue is the unusual choice and the right one here.** She is the only mercenary who benefits from a bow runeword, and Faith's Fanaticism aura applies to you as well as to her — so a second Faith on the Rogue is a party-wide attack speed and damage buff that no other hireling can provide. Hire the Cold variant for the chill, give her an **Insight** if you would rather have mana, and a **Fortitude** with a **Vampire Gaze** to keep her upright. **If physical immunity is what is stopping you, take the Act 2 Desert Mercenary instead** and give him an elemental weapon: his damage is the fallback yours cannot be.",

  farming: [
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, short, and no boss to fight — the default Strafe zone. It does hold physical immunes, so this is where an Atma's Scarab starts earning its slot rather than where you can ignore the problem.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85, reachable in seconds, and full of the undead your bow does bonus damage to.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 with almost nothing physically immune — its recorded immunities are fire and poison. Short, self-contained, and the zone this build clears fastest.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Dense and high level, and Guided Arrow handles Diablo without a gear change. Physical immunity is part of the regular population here, so bring the Amplify Damage. **Iron Maiden from the Oblivion Knights reflects a ten-shot burst back at you** — watch for the curse.",
      minTier: "budget",
      rating: 3,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Ten seconds, monster level 86, and a single target Guided Arrow cannot miss.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "The best experience in the game, and physical immunity is common enough that this is an Amplify Damage zone rather than a starting one.",
      minTier: "optimized",
      rating: 3,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are not physically immune and they stand in one place. A short, extremely profitable run for a physical bow.",
      minTier: "budget",
      rating: 4,
    },
  ],

  immunityPlan:
    "**Every point of damage this build deals is physical, so physical immunity is a complete wall rather than a slow-down.** There is no mastery, no facet and no aura that raises physical damage past an immunity. The four honest answers, in the order most players reach them: **Amplify Damage from an Atma's Scarab**, which halves the target's physical resistance and usually breaks the immunity outright — five percent a hit is constant on a skill that fires ten arrows a burst; **Decrepify from a Wrath bow**, which does the same at 30% a hit and is worth keeping on the weapon swap; **a Bone Break charm**, the direct fix, whose penalty is 10 to 20 points of your own physical damage reduction rather than a resistance — a cheaper trade at bow range than in melee; and **your mercenary**, if you take the Act 2 Desert Mercenary with an elemental weapon instead of a second Faith. Choosing zones works too, and the farming list above is ordered by how much physical immunity you will meet.",

  hardcoreNotes:
    "The rooting is the danger. Strafe locks you in its animation for the whole burst, so a pack that reaches you while it plays gets several free hits — which is why Dodge carries five points here rather than one, why the 32% hit-recovery target is marked required, and why the Valkyrie is not optional. Keep **Slow Missiles** on the bar; against Hell's ranged packs it is the strongest one-point defensive skill in the game. Avoid **Windforce** in hardcore for a non-obvious reason: knockback scatters a pack rather than killing it, and a scattered pack surrounds you. Take the Act 2 mercenary with Holy Freeze rather than a second Faith.",

  selfFoundNotes:
    "**The best self-found Amazon on the site.** Edge, Melody, Peace and Harmony are all low-rune runewords, and Melody alone is twelve skill levels for three runes the Countess drops constantly. Widowmaker, Eaglehorn, Razortail, The Cat's Eye, Raven Frost and Gore Rider are all realistic Hell finds. The build works at every stage of that progression because it has no threshold to cross — no mastery to reach, no −resistance to stack, no aura to buy. What self-found cannot supply is Faith, and the honest consequence is a slower character rather than a stuck one.",

  levelingPath: {
    summary:
      "**This one genuinely levels as itself**, which almost no Amazon does. Magic Arrow from level 1 costs no arrows, Multiple Shot at 6 clears, Guided Arrow at 18 kills bosses and Strafe arrives at 24 — every one of them is a skill the finished build still uses. Nothing needs to be unlearned and no respec is planned.",
    respecAt: "Not needed. Keep all three Den of Evil tokens.",
  },

  confidence: "verified",
  complete: true,
};
