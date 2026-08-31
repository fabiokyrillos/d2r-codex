import type { Build } from "@/lib/types";

/**
 * The Fire Ball Meteor Sorceress — published variously as the Fire Sorc, the
 * Fireball Sorc and the Meteor Sorc. The research pass established these as
 * names for one build rather than three; Maxroll publishes a single guide under
 * several of them.
 *
 * Verified at Tier 1 (`skills.json`):
 * - Fire Ball requires level 12, Meteor 24, Fire Mastery 30.
 * - **Fire Mastery gives 30% damage at level 1 and +7% per level.** Like
 *   Lightning Mastery and unlike Cold Mastery, it raises your damage rather
 *   than reducing enemy resistance — so it does not break fire immunity.
 * - Meteor's explosion radius is 6 and it leaves ground fire for 30 frames plus
 *   15 per level, which is why it is a delayed-damage skill rather than a
 *   burst one.
 *
 * Uses the **standard** Sorceress cast table (0/9/20/37/63/105/200), not the
 * Lightning one.
 *
 * Both ranked sources place this at S, and both tag it a starter.
 */
export const fireballMeteorSorceress: Build = {
  slug: "fireball-meteor-sorceress",
  name: "Fire Ball Meteor Sorceress",
  classSlug: "sorceress",
  summary:
    "A fast projectile and a delayed explosion that share every synergy. One of the two best ladder starters in the game.",
  damageTypes: ["fire"],
  primarySkill: "fire-ball",
  playstyle:
    "Two spells that feed each other. Fire Ball is instant and travels, so it is what you hold down; Meteor is dropped ahead of where things are going and lands a second later for far more damage. Against a boss you drop Meteor on it and fill the gap with Fire Ball. Against a pack you lead with Meteor and let the ground fire finish what the explosion started. Both scale from the same synergies and the same mastery, so nothing you invest is split between them — which is the reason this build works so early on so little gear.",
  strengths: [
    "A genuine ladder starter that also has a real endgame — few builds are both",
    "Fire Ball at level 12 and Meteor at 24 means the build comes online early and keeps growing",
    "Both spells share synergies, so there is no point tax for playing two skills",
    "Kills Andariel, Mephisto and the Countess quickly with almost no gear",
    "Uses the standard cast table, so the familiar 63% and 105% targets apply",
  ],
  weaknesses: [
    "**Fire immunity is the most common immunity in Hell**, and Fire Mastery does not break it",
    "Meteor has a landing delay, so it misses anything that moves after you cast",
    "Low life and no block, like every Sorceress",
    "The endgame answer to immunity is either a Sunder Charm's large penalty or an Infinity",
    "Fire damage is heavily resisted by several of the best farming targets",
  ],
  difficulty: "beginner",
  budget: "low",
  ratings: {
    clearSpeed: 4,
    bossing: 5,
    survivability: 3,
    magicFind: 4,
    terrorZones: 4,
    ubers: 3,
    soloSelfFound: 5,
    players8: 4,
  },

  skills: [
    {
      skill: "fire-ball",
      points: 20,
      role: "main",
      order: 1,
      note: "Level 12, and the spell you actually hold down. Explosion radius 4. Max it first — it is your damage for the twelve levels before Meteor exists.",
    },
    {
      skill: "meteor",
      points: 20,
      role: "main",
      order: 2,
      note: "Level 24. Explosion radius 6 plus ground fire that lasts longer per point. The delay is the cost of the damage.",
    },
    {
      skill: "fire-mastery",
      points: 20,
      role: "main",
      order: 3,
      note: "**30% damage at level 1, +7% per level.** It raises your damage; it does not reduce enemy fire resistance. It will not break an immunity.",
    },
    {
      skill: "fire-bolt",
      points: 20,
      role: "synergy",
      order: 4,
      note: "A synergy for both Fire Ball and Meteor, and your damage for the first eleven levels. Nothing spent here is wasted.",
    },
    { skill: "warmth", points: 1, role: "utility", note: "Mana regeneration from level 1. One point, permanently worth it." },
    { skill: "telekinesis", points: 1, role: "prerequisite" },
    { skill: "teleport", points: 1, role: "utility", note: "**One point forever.** More points only cut the mana cost." },
    { skill: "static-field", points: 1, role: "utility", note: "Takes 25% of a target's current life. The answer to anything with a health pool you cannot chew through." },
    { skill: "frozen-armor", points: 1, role: "utility", note: "Free defence and a chance to freeze whatever hits you." },
    { skill: "frost-nova", points: 1, role: "utility", note: "A point-blank panic button that also chills. Cheap insurance on a character with no block." },
    {
      skill: "inferno",
      points: 1,
      role: "prerequisite",
      note: "Blaze's prerequisite. One point on the path Meteor actually needs.",
    },
    { skill: "blaze", points: 1, role: "prerequisite", note: "Fire Wall's prerequisite." },
    {
      skill: "fire-wall",
      points: 1,
      role: "prerequisite",
      note: "**Meteor requires Fire Ball and Fire Wall.** Fire Wall is the half most guides omit, and it costs a three-point chain from Inferno.",
    },

  ],
  flexPoints: [
    "**Remaining points go to Inferno**, which is Fire Ball's other synergy, or to more Frost Nova if survival is the problem rather than damage.",
    "**The Meteorb split.** Instead of Fire Mastery and Fire Bolt, some players take Frozen Orb and Cold Mastery for a second damage type. That is a materially different build with a different immunity plan and a different point budget — it has its own page rather than living here as a variant.",
    "**Magic find variant:** swap Fire skill charms for magic find, take a Tarnhelm or Harlequin Crest and War Traveler, and accept slower kills. The skill plan does not change at all, which is why this is a gear decision rather than a build.",
    "**Do not put points in Energy.** Warmth plus an Insight mercenary covers the mana.",
  ],
  stats: {
    strength: "Only what the gear needs. This build has no reason to want a heavy shield.",
    dexterity: "None. Teleport is the defence, not block.",
    vitality: "Everything else.",
    energy: "None.",
    notes: [
      "This is one of the few Sorceress builds where the stat plan is genuinely trivial — there is no block decision and no heavy base to fund.",
      "Life is what keeps you alive. A Call to Arms swap is worth more than any amount of Vitality you could buy with the same currency.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 105,
      frames: 8,
      priority: "recommended",
      why: "The standard Sorceress endgame target, and it governs Teleport as well as casting. Two Spirits plus Magefist plus a 10% ring passes it.",
    },
    {
      stat: "fcr",
      value: 63,
      frames: 9,
      priority: "required",
      why: "The starter target. A Spirit sword and Magefist alone get you most of the way, and the build feels acceptable here.",
    },
    {
      stat: "fhr",
      value: 60,
      frames: 9,
      priority: "recommended",
      why: "Meteor has a cast animation you do not want interrupted, and a Sorceress that is stun-locked is a dead one.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Fire Bolt to 12, Fire Ball to 24, Meteor from there. Almost no gear required.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and up to 35% Faster Cast Rate at level 25. The best value item in the game for a levelling caster.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket Crystal Sword.",
              alternatives: [
                {
                  label: "Any staff or orb with +Fire Ball or +Fire Bolt",
                  why: "Vendor stock refreshes every time you enter town, and a +3 Fire Ball staff beats most early uniques outright.",
                  lookFor: ["+3 Fire Ball", "+3 Fire Bolt", "+2 Fire Skills"],
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances for three Countess runes." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "25% Faster Cast Rate and 25% Faster Hit Recovery at level 17." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills for two common runes." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate **and +1 to Fire Skills**, which on this build is a damage item as well as a speed one." }],
        },
      ],
      nextUpgrade: "Meteor at 24, Fire Mastery at 30. Then start farming Mephisto.",
      notes:
        "Fire Bolt carries you to 12 and it is a synergy, so those points stay useful for the entire life of the character. This is as forgiving as levelling gets.",
    },

    {
      tier: "nightmare",
      goal: "Fire Mastery online and Mephisto on farm.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Still the best value available." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A second Spirit — +4 skills and 70% Faster Cast Rate between the two, which clears the 63 target with room to spare.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
              alternatives: [
                { ref: { kind: "unique", slug: "lidless-wall" }, why: "+1 skills and 20% cast rate with no 4-socket base to hunt." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 skills, 30% Faster Cast Rate and up to +35 all resistances at 43 Strength." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find while you farm." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 Fire Skills and 20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest path to 75% before Hell." }],
      nextUpgrade: "Resistances to 75%, an Insight for the mercenary, then a plan for fire immunity.",
    },

    {
      tier: "early-hell",
      goal: "Enter Hell at 105% cast rate and decide what to do about fire immunes.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% cast rate and +2 skills." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "The second one." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "Resistances and cast rate.",
              alternatives: [
                { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances when the runes appear." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, 50% magic find and 10% damage reduction." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and +20-30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [
            {
              label: "Rare ring with 10% Faster Cast Rate and resistances",
              why: "The last cast rate you need, carrying resistance you also need.",
              lookFor: ["10% Faster Cast Rate", "Two resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster Hit Recovery, Strength and Vitality." }],
        },
      ],
      charms: [
        { label: "Resistance and life small charms", why: "Hold 75% in all four." },
        {
          label: "Flame Rift (fire Sunder Charm)",
          why: "The direct answer to fire immunity, at the cost of 70 to 90 points of your own fire resistance. Read the resistances article before you commit to carrying one.",
        },
      ],
      nextUpgrade: "Death's Fathom or a Fire facet setup, and a decision on the Sunder Charm.",
      notes:
        "Fire is the most resisted element in Hell, and this is where that becomes your problem rather than a footnote. Pick one of the three answers in the immunity plan and build toward it rather than discovering it in Act 3.",
    },

    {
      tier: "budget",
      goal: "Farm Hell reliably with an answer to fire immunity in hand.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "+3 skills, 40% Faster Cast Rate and up to +40 all resistances.",
              sockets: "Ko, Vex, Pul, Thul into a 4-socket Flail.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "eschutas-temper" },
                  why: "More damage: up to +3 Sorceress skills, 40% cast rate and +20% fire skill damage — but no resistances at all.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% cast rate and +2 skills." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, +65 all resistances, 8% damage reduction." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills and 50% magic find." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 Fire Skills and 20% cast rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 all skills and 20% Faster Cast Rate." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and mana." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring with 10% Faster Cast Rate",
              why: "Clears the 105 target.",
              lookFor: ["10% Faster Cast Rate", "Resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and damage." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills and resistances." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Flame Rift (fire Sunder Charm)", why: "Carry it into the zones that need it and leave it in the stash otherwise." },
      ],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
      nextUpgrade: "Fire facets, and either Infinity on the mercenary or a permanent Sunder Charm slot.",
    },

    {
      tier: "optimized",
      goal: "Fire damage stacked, immunity answered, magic find on top.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "eschutas-temper" },
              why: "Up to +3 Sorceress skills, 40% cast rate and +20% fire skill damage. The damage weapon once your resistances come from elsewhere.",
              lookFor: ["+3 Sorceress Skills", "+20% Fire Skill Damage", "3 sockets for facets"],
              alternatives: [
                { ref: { kind: "runeword", slug: "heart-of-the-oak" }, why: "Keep it if the +40 all resistances is what is holding your cap together." },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% cast rate and +2 skills." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 skills and the resistances that let you wear Eschuta's.",
              alternatives: [
                { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport for free and Strength per level. You already have Teleport as a skill, so this is about the mana cost and the Strength." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, magic find, damage reduction. Socket a fire facet." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 Fire Skills and 20% cast rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% cast rate." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: 10% Faster Cast Rate, resistances, life",
              why: "The slot where a rare beats every unique for this build.",
              lookFor: ["10% Faster Cast Rate", "Two resistances at 20+", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Fire skill grand charms with life", why: "Damage and life in one slot." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Fire facets in every socket, and Infinity if you would rather not carry a Sunder Charm.",
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
              ref: { kind: "unique", slug: "eschutas-temper" },
              why: "A +3 skills and +20% fire skill damage roll with three sockets of fire facets.",
              lookFor: ["+3 Sorceress Skills", "+20% Fire Skill Damage", "3 sockets"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "35% cast rate in a Monarch.",
              lookFor: ["35% Faster Cast Rate", "Monarch base"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, Strength and magic find per level." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "+2 skills, socketed with a fire facet.",
              lookFor: ["2 sockets"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 Fire Skills." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% cast rate." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: 10% Faster Cast Rate, two resistances, life, mana",
              why: "The last slot to perfect.",
              lookFor: ["10% Faster Cast Rate", "Two resistances at 20+", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills, 20 all resistances." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Fire skill grand charms with life", why: "The rest of the inventory." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "Above 105% cast rate the only remaining purchases are fire facets, better rolls, and whichever immunity answer you settled on. The build's ceiling is lower than the Lightning Sorceress's, and its floor is far higher — which is the trade it has been making since level 12.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Act 2 Desert Mercenary with **Might**, and an **Insight** in his polearm as early as you can build it — Meditation solves a Sorceress's mana permanently for four common runes. Later, **Infinity** is the alternative to carrying a Sunder Charm: its Conviction aura breaks many fire immunities without costing you 70 to 90 points of your own fire resistance. Give him a **Vampire Gaze** in the meantime.",

  farming: [
    {
      area: "mephisto",
      difficulty: "hell",
      why: "The classic. A twenty-second route, he is not fire immune, and the drop table is excellent. This build kills him faster than almost anything else at the same gear level.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "Short, close to a waypoint, and she dies to a single Meteor and a few Fire Balls.",
      minTier: "starter",
      rating: 4,
    },
    {
      area: "countess",
      difficulty: "hell",
      why: "Runes, and nothing in the tower resists fire meaningfully.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "stony-tomb",
      difficulty: "hell",
      why: "Area level 85, close to a waypoint, and light on fire immunity. One of the best fire-build zones in the game.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and short. Some fire immunes, which is what your Sunder Charm or Infinity is for.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 and cold-immune heavy, which does not affect you at all.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Dense and high level, but a good share of it resists fire. Comfortable only once immunity is answered.",
      minTier: "optimized",
      rating: 3,
    },
  ],

  immunityPlan:
    "Fire is the most commonly resisted element in Hell, and **Fire Mastery does not help** — it gives 30% damage at level 1 and +7% per level, raising your output rather than lowering their resistance. There are three honest answers and you should pick one before Act 3 rather than during it. **A Flame Rift sunder charm** breaks fire immunity directly and costs 70 to 90 points of your own fire resistance, which in a difficulty that already applies −100 is a serious price. **Infinity on the mercenary** breaks many fire immunities through Conviction with no penalty to you, and costs a Ber and a Jah. **Choosing zones** is legitimate and free: Stony Tomb, the Ancient Tunnels and Mephisto are all light on fire immunity, and the farming list above is ordered accordingly. **Static Field** is not an immunity answer but it is a boss answer — it takes a quarter of current life regardless of what the target resists.",

  hardcoreNotes:
    "One of the more survivable Sorceress builds, for an unglamorous reason: Meteor is cast at a distance and Fire Ball travels, so you spend less time near what you are killing than a Blizzard or Nova Sorceress does. The dangers are the class's, not the build's — no block, the smallest life pool in the game, and death by being interrupted. Take Chains of Honor over Enigma, treat 60% Faster Hit Recovery as required, keep Frost Nova on a key as a panic button, and use a Call to Arms swap before anything dangerous.",

  selfFoundNotes:
    "The best self-found Sorceress on the site alongside Blizzard, and arguably better because fire skills come online earlier. Fire Bolt from level 1, Fire Ball from 12, and everything the build wants below the endgame is either a Countess runeword or a vendor purchase. The one genuine wall is fire immunity in Hell, and its cheapest answer — picking zones that do not have much of it — costs nothing at all. A Flame Rift is a realistic self-found target; Infinity is not.",

  levelingPath: {
    summary:
      "This is a levelling build in its own right, and one of the two best. Fire Bolt from level 1 is a synergy, so nothing is wasted; Fire Ball at 12 is a genuine step up; Static Field at 6 handles anything with too much life; Teleport at 18 changes how you move. Meteor arrives at 24 and Fire Mastery at 30, so the build is only fully assembled at 30 — but unlike most, it was never weak on the way there. **No respec is required at any point.**",
  },

  confidence: "verified",
  complete: true,
};
