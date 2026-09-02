import type { Build } from "@/lib/types";

/**
 * The Jab and Fend Amazon — the spear tree's physical branch.
 *
 * **This plan contains no synergies at all**, and that is a fact about the tree
 * rather than a choice: the graph gives Jab, Impale and Fend empty synergy
 * lists. Every point either buys a skill's own scaling or buys a passive, which
 * is why it looks unlike every other build on this site.
 *
 * The three skills' own columns are what the page is written from:
 *
 *   Jab      -15% damage baseline, +3% per level, three thrusts per attack
 *   Impale   300% damage baseline, +25% per level, up to 75% slow, durability
 *   Fend     70% damage baseline, +10% per level, one extra target per level
 *
 * That makes Impale worth a single point (300% weapon damage for one point is
 * the best rate in the class), Fend the crowd skill, and Jab the boss skill —
 * because Crushing Blow is percentage-based and applies per hit, and Jab lands
 * three hits per attack.
 *
 * It also makes physical immunity a complete wall, which is why this page could
 * not be written before Bone Break was catalogued with its real cost: the only
 * Sunder Charm whose penalty is physical damage reduction rather than a
 * resistance, on the only Amazon standing in melee range while carrying it.
 */
export const jabFendAmazon: Build = {
  slug: "jab-fend-amazon",
  name: "Jab Fend Amazon",
  classSlug: "amazon",
  summary:
    "A spear, a shield and three physical attacks with no synergies between them. The Amazon who fights where the Barbarian does.",
  damageTypes: ["physical"],
  primarySkill: "fend",
  playstyle:
    "You walk in with a shield up and a spear out. Fend attacks every adjacent enemy in one sequence — one more target per skill level — which is how you clear. Jab is three fast thrusts at a single target, and it is the boss skill for a reason that is not obvious: Crushing Blow takes a percentage of current life per *hit*, and Jab lands three of them per attack. Impale is the opener, one enormous thrust that cannot be interrupted and slows what it hits. There is no elemental damage anywhere and no synergy between any of it — the tree simply does not offer one — so the whole build is the weapon, the passives, and what you can put on hit.",
  strengths: [
    "**One point in Impale is 300% weapon damage** — the best single point in the class",
    "Jab lands three hits per attack, so Crushing Blow, life steal and Amplify Damage all fire three times",
    "Fend hits one more adjacent target per skill level, with no cap in its column",
    "A shield, a Valkyrie, a Decoy and the deepest avoidance investment on the site",
    "Cheap: 5 and 8 mana, and nothing in the plan needs a rune above Amn to get started",
  ],
  weaknesses: [
    "**No synergies at all.** Nothing in this plan multiplies anything else, so the damage ceiling is the weapon's",
    "**Physical immunity is total** — and unlike the bow builds, you are standing next to it while it is not dying",
    "Fend is one long animation. Being hit part-way through can strand you in it, which is the build's main killer",
    "Impale costs weapon durability on every hit, so it is an opener rather than a rotation",
    "**Attack speed is a per-weapon question** — a javelin, a Ceremonial Pike and a Matriarchal Pike behave differently at the same total",
  ],
  difficulty: "advanced",
  budget: "medium",
  ratings: {
    clearSpeed: 3,
    bossing: 4,
    survivability: 4,
    magicFind: 2,
    terrorZones: 3,
    ubers: 2,
    soloSelfFound: 4,
    players8: 3,
  },

  skills: [
    {
      skill: "fend",
      points: 20,
      role: "main",
      order: 1,
      note: "**70% weapon damage baseline and +10% per level, plus one extra adjacent target per level.** The clearing skill, and the one that locks you in place while it plays.",
    },
    {
      skill: "jab",
      points: 20,
      role: "main",
      order: 2,
      note: "**Three thrusts in one attack**, at −15% damage baseline rising 3% per level. The three hits are the point: Crushing Blow, life steal and any on-hit curse all fire per hit.",
    },
    {
      skill: "critical-strike",
      points: 20,
      role: "utility",
      order: 3,
      note: "A chance to double physical damage, and every point of your damage is physical. The chance climbs toward the 80% ceiling the game's columns name.",
    },
    {
      skill: "penetrate",
      points: 20,
      role: "utility",
      order: 4,
      note: "**35% attack rating plus 10% per level.** Fend carries 40% plus 10% of its own and Jab only 10% plus 9%, so this is what makes the boss skill connect.",
    },
    {
      skill: "dodge",
      points: 10,
      role: "utility",
      order: 5,
      note: "**A chance to avoid a melee attack entirely while standing still or attacking** — which describes everything this build does. Ten points, more than any other page here spends.",
    },
    { skill: "avoid", points: 7, role: "utility", note: "The same for ranged and magical attacks while you are mid-sequence. Ranged packs are what punish a spear." },
    { skill: "evade", points: 7, role: "utility", note: "The same again while walking or running — the gap the other two leave open, and Valkyrie's prerequisite." },
    {
      skill: "impale",
      points: 1,
      role: "prerequisite",
      note: "**300% weapon damage at level 1**, plus a slow of up to 75%, for a single point. Fend's prerequisite, and worth pressing rather than merely owning — it costs durability, so use it as an opener.",
    },
    { skill: "valkyrie", points: 1, role: "utility", note: "A second body in the fight, and she inherits the ten and seven points of avoidance above." },
    { skill: "decoy", points: 1, role: "utility", note: "Valkyrie's prerequisite, and something for a ranged pack to shoot while you are locked in a Fend." },
    { skill: "slow-missiles", points: 1, role: "utility", note: "Decoy's prerequisite, and the answer to the ranged attacks that kill spear Amazons." },
    { skill: "inner-sight", points: 1, role: "prerequisite", note: "Slow Missiles' prerequisite, and it lowers the defence of everything Fend is about to hit." },
  ],
  flexPoints: [
    "**The plan spends 109 of 110 and contains no synergies whatsoever**, because Jab, Impale and Fend have none. Nothing here multiplies anything else — the points buy a skill's own scaling or a passive, and that is the whole tree.",
    "**Impale is the point most often spent wrong.** It is 300% weapon damage for one point and 775% at twenty, but it costs durability on every hit and cannot be spammed. Keep it at one unless you are specifically building around a single enormous opener.",
    "The Dodge, Avoid and Evade block is where a hardcore character adds and a softcore one cuts. Their curves diminish, so the first points are worth far more than the last ones.",
  ],
  stats: {
    strength: "Enough for the shield and the spear. A Stormshield is 156, a Matriarchal Pike 132 — decide between the shield and the two-handed weapon before spending.",
    dexterity: "Enough for maximum block, and it raises attack rating and weapon damage on top. Never a dead stat here.",
    vitality: "Everything left, and more of it matters here than anywhere else on the site.",
    energy: "None. Fend is 5 mana and Jab is 8 — the cheapest bar the Amazon has.",
    notes: [
      "**The first real decision is one-handed or two.** A javelin plus a Stormshield gives you block, damage reduction and a Valkyrie holding the line; a Matriarchal Pike with a Passion gives you far more damage and Berserk for the physical immunes. This page assumes the shield, and says where the spear wins.",
      "Maximum block matters more here than on any other Amazon and costs less than on any other class — the Amazon shares the Paladin's block table.",
      "Life steal is not optional. Dracul's Grasp, an Andariel's Visage or a Titan's Revenge — take at least one before Hell.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 32,
      frames: 7,
      priority: "required",
      why: "Fend is one long animation and being knocked out of it is what kills this build. This is the number to reach before Hell and it is not negotiable.",
    },
    {
      stat: "fhr",
      value: 52,
      frames: 6,
      priority: "recommended",
      why: "A Shael in a shield plus a Peace armor reaches it, and on a character standing in melee the frame is worth the socket.",
    },
    {
      stat: "fbr",
      value: 32,
      frames: 3,
      priority: "required",
      why: "Block is half of this build's defence, and blocking locks you in an animation of its own. 32% is where that stops compounding with Fend's.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 24 for Fend, on Jab and one point of Impale.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any spear or javelin with +Javelin and Spear Skills",
              why: "Vendors sell magic spears throughout Act 1 and Act 2. A skill level beats a damage roll here because every skill scales off the weapon anyway.",
              lookFor: ["+2-3 Javelin and Spear Skills", "Increased Attack Speed"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances for three Countess runes, and you will be blocking constantly." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "25% Faster Hit Recovery from level 17, which on a spear Amazon is the survival stat." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills for two common runes." }],
        },
      ],
      nextUpgrade: "Level 24 for Fend, and a weapon with real damage on it.",
      notes:
        "**Jab from level 1 and one point of Impale at 12 is a complete kit for the whole of Normal.** Impale at one point already deals 300% weapon damage, which is more than any other single point the Amazon can spend this early.",
    },

    {
      tier: "nightmare",
      goal: "Fend online, life steal in place, and a shield worth blocking with.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "titans-revenge" },
              why: "+4 skill levels across the two lines, 5-9% life steal, and one-handed — which is what keeps the shield on your arm.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "passion" },
                  why: "In a spear: far more damage, 25% attack speed, and **+1 to Berserk, which converts physical damage to magic** and is the two-handed answer to physical immunity.",
                  sockets: "Dol, Ort, Eld, Lem into a 4-socket spear.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and the block chance the Amazon's table makes cheap.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "peace" }, why: "+2 Amazon skills, +2 Critical Strike and 20% Faster Hit Recovery for three cheap runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Life steal, mana steal and damage reduction — three things the spear tree cannot supply." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Life steal and up to 15% damage reduction. **Razortail is a trap on this build** — pierce does nothing for a melee attack." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike and Open Wounds, all of which Jab applies three times per attack." }],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "75% before Hell, on a character who will be surrounded." }],
      nextUpgrade: "A Fortitude, and Dracul's Grasp for the Life Tap.",
      notes:
        "**Attack speed matters and no Amazon number covers it.** A one-handed javelin, a Ceremonial Pike and a Matriarchal Pike all behave differently at the same percentage, and Fend's animation is not Jab's. Take attack speed where it is free and judge it on the weapon you are holding.",
    },

    {
      tier: "early-hell",
      goal: "Enhanced Damage, Life Tap, and maximum block.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "titans-revenge" }, why: "Four skill levels and life steal, one-handed. The shield is worth more than the damage a two-hander would add at this stage." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "stormshield" },
              why: "35% damage reduction and the best block in the game, once 156 Strength is paid for.",
              alternatives: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Keep the two skill levels until the Strength exists." }],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "**+300% Enhanced Damage, and this build is nothing but Enhanced Damage's to multiply.** The largest single upgrade on the list." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life per level and 10% damage reduction at only 50 Strength." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "draculs-grasp" },
              why: "**Life Tap on striking, and Jab strikes three times per attack.** Nothing else in the slot is close for a melee Amazon.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Life steal and damage reduction." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 skills, 20% attack speed and Deadly Strike that scales with level — a second doubling roll alongside Critical Strike." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow against anything with a large health pool, applied per hit." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "75% and life — both matter more in melee than anywhere else." }],
      nextUpgrade: "An Atma's Scarab, and then a decision about Bone Break.",
      notes:
        "**Physical immunity begins here and it is absolute.** You have no second damage type at all unless you took the Passion. The next tier is about buying one.",
    },

    {
      tier: "budget",
      goal: "An answer to physical immunity, and the damage to use it.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "titans-revenge" },
              why: "Skills, leech and a free shield arm.",
              alternatives: [
                { ref: { kind: "runeword", slug: "passion" }, why: "The two-handed fork: **Berserk converts your physical damage to magic**, which is the cleanest answer a melee character has to a physical immune. You give up the shield for it." },
              ],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "atmas-scarab" },
              why: "**Amplify Damage on striking halves physical resistance and usually breaks the immunity**, and Jab applies it three times per attack. On this build the amulet is a damage type rather than a stat line.",
              alternatives: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "More attack speed and Deadly Strike, if the Passion or the mercenary is handling immunes." }],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage and 200% enhanced defence." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "andariels-visage" },
              why: "+2 skills, 20% attack speed and up to 10% life steal. Pay its −30% fire resistance elsewhere first.",
              sockets: "An Um rune returns most of the fire resistance.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "35% damage reduction and block." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Life steal and damage reduction." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating. Chilled attack speed is worst for the character standing still and swinging." }],
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
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Javelin and Spear skill grand charms", why: "The only charms that raise Fend and Jab together." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, on the Amazon who needs the life most." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "A Bone Break charm, and the last charm rolls.",
    },

    {
      tier: "optimized",
      goal: "Two ways to hurt a physical immune, and enough block to stand there while you do.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "titans-revenge" }, why: "Four skill levels, leech, and a shield arm. Every alternative trades the shield for damage." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "35% damage reduction and the best block in the game, socketed with a damage jewel." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage, which is the whole build's damage multiplier." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills, attack speed and life steal, with an Um in the socket." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking, applied three times per Jab." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "atmas-scarab" }, why: "Amplify Damage on striking — the build's damage answer, not a stat." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Life steal and up to 15% damage reduction." }],
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
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, which is percentage-based and therefore best against exactly the bosses Jab is for." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Javelin and Spear skill grand charms with life", why: "Damage and the life a melee Amazon needs." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "A Bone Break for the zones Amplify Damage cannot cover.",
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
              ref: { kind: "unique", slug: "titans-revenge" },
              why: "A maximum Enhanced Damage roll, with the leech and the four skill levels.",
              lookFor: ["+200% Enhanced Damage", "9% Life Stolen per Hit"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Damage reduction, block, and a socket for a damage jewel." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills, attack speed and life steal, Um in the socket." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap. Nothing competes." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "atmas-scarab" }, why: "Amplify Damage on striking." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Life steal and damage reduction." }],
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
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and Open Wounds." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        {
          ref: { kind: "unique", slug: "bone-break" },
          why: "**Read its page before you carry it.** Its penalty is 10 to 20 points of your own physical damage reduction, and physical damage is what melee monsters deal — so on this build, of all builds, the charm that lets you hurt a physical immune also makes every ordinary hit land harder. Carry it for the zone, never as a default.",
        },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      notes:
        "The build ends where it started: a weapon, a shield and three attacks with nothing multiplying them. **Everything left to buy is Enhanced Damage, on-hit effects and attack speed**, and attack speed is still a per-weapon question — Fend's animation is not Jab's, and a javelin is not a Matriarchal Pike. Test it rather than reading a table.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "The Act 2 Desert Mercenary with **Might**, whose aura raises your weapon damage — and on a build with no synergies at all, an aura that multiplies the weapon is worth more here than on any other page. Give him an **Insight** if you want the mana, though this bar barely uses any, and later a **Pride** for the Concentration or an elemental weapon so he can hurt the physical immunes you cannot. **Holy Freeze is the hardcore choice and a strong one**: Fend locks you in an animation, so anything slowed is something that arrives after the animation ends rather than during it.",

  farming: [
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 and dense, with fire and poison among its recorded immunities rather than physical. The best zone on the site for a build with one damage type and that damage type being physical.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85, seconds from a waypoint, poison and cold immune rather than physical, and full of undead that pack tightly around a Fend.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are fire and lightning immune, not physical, and they stand in a group that a single Fend sequence reaches. One of the fastest runs available to this build.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Ten seconds, monster level 86, a single target and no crowd. Jab plus Crushing Blow is exactly what this fight wants.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "The shortest boss run in the game, poison immune rather than physical, and she stands still. Jab with Life Tap running is close to risk-free.",
      minTier: "nightmare",
      rating: 3,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and short, but physical immunity is part of its recorded population — an Amplify Damage zone rather than a free one.",
      minTier: "budget",
      rating: 3,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Physical immunity in the population, and **Iron Maiden from the Oblivion Knights reflects a full Fend sequence back at you**. The single most dangerous zone on the site for this build.",
      minTier: "optimized",
      rating: 2,
    },
  ],

  immunityPlan:
    "**Every point of damage this build deals is physical and it has no second element**, which makes physical immunity a wall rather than a slow-down — and unlike the bow pages, you are standing next to the thing that is not dying. Four answers, in the order most players reach them. **Amplify Damage from an Atma's Scarab** halves the target's physical resistance and usually breaks the immunity outright, and Jab applies it three times per attack, which is what makes a five-percent proc reliable here. **Berserk from a Passion** converts your physical damage to magic entirely; it is the cleanest fix and it costs you the shield, which on this build is half the defence. **Your mercenary** with an elemental weapon kills what you cannot touch, for the price of a hire. And **a Bone Break charm** is the direct answer with the worst fit: its penalty is 10 to 20 points of your own physical damage reduction rather than a resistance, and physical damage is precisely what the monsters in melee range are dealing you. Read its page before picking one up, carry it for the zone, and take it out afterwards.",

  hardcoreNotes:
    "Demanding but genuinely survivable, and the plan reflects it — ten points of Dodge and seven each of Avoid and Evade is the deepest avoidance investment on this site, because this is the only Amazon whose whole job is standing next to things. **Fend's animation is the specific danger**: it plays to completion, so a pack that reaches you mid-sequence gets free hits, which is why 32% hit recovery and 32% block are both marked required rather than recommended. **Iron Maiden is the other one** — the Oblivion Knights reflect physical damage and Fend is several hits per second of it, so a cursed pack in the Chaos Sanctuary can end a character outright. Watch for the curse and walk out of it. Dracul's Grasp before anything else, Holy Freeze on the mercenary, and no Bone Break.",

  selfFoundNotes:
    "**One of the best self-found builds on the site**, and it is the absence of synergies that makes it so. There is no runeword to reach, no mastery to unlock and no −resistance to stack; the build is a weapon and some passives, and it works from level 1 with whatever a vendor sells. Titan's Revenge, String of Ears, Gore Rider, Vampire Gaze and Raven Frost are all common Hell drops, Peace and Spirit are Countess runes, and Fortitude is the only expensive item on the list — worth the runes, since Enhanced Damage is the only multiplier this build has. Physical immunity is the one thing self-found cannot fix cheaply, and an Atma's Scarab is a realistic find.",

  levelingPath: {
    summary:
      "**This build levels as itself from level 1**, which only the bow builds otherwise manage. Jab is available immediately, Impale at 12 is 300% weapon damage for a single point, and Fend at 24 is the clear button you keep. Put the early passive points into Critical Strike as you go — it is a percentage that works from the first point and it never stops being the build's largest multiplier.",
    respecAt: "Not needed. Keep all three Den of Evil tokens.",
  },

  confidence: "verified",
  complete: true,
};
