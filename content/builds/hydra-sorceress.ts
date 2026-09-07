import type { Build } from "@/lib/types";

/**
 * The Hydra Sorceress.
 *
 * The only Sorceress on the site whose damage keeps working after she has left.
 * Hydras are summoned turrets: you place them and they fire on their own for a
 * fixed duration, which makes this the class's answer to bosses and key farming
 * rather than to density.
 *
 * Verified at Tier 1 (`skills.json`):
 * - **Hydra requires level 30**, is `EType = fire`, lasts 250 frames regardless
 *   of skill level, and caps at **18 hydras** — the oldest is removed when a
 *   new one would exceed that.
 * - Its damage synergy is Fire Bolt, which the site's own skill data records.
 * - Fire Mastery requires level 30 and gives 30% damage plus 7% per level.
 * - **Hydra's prerequisite is Enchant**, and Enchant's are Fire Ball and
 *   Warmth. Not Fire Wall and not Meteor: an earlier version of this page said
 *   so, and it cost three points in a plan that never needed them.
 * - Its damage synergies are Fire Bolt and Fire Ball at 3% per level each,
 *   which is why Fire Ball is maxed here rather than taken at one point.
 *
 * Both ranked sources place it at B. Maxroll's Starter variant specs into cold
 * or lightning early for immunity coverage before respeccing fully into fire —
 * the research recorded that as the resolution of the inventory's
 * "Hydra/Frozen Orb" entry, which is a variant rather than a build.
 */
export const hydraSorceress: Build = {
  slug: "hydra-sorceress",
  name: "Hydra Sorceress",
  classSlug: "sorceress",
  summary:
    "Fire turrets you place and walk away from. The Sorceress that kills things without being in the room.",
  damageTypes: ["fire"],
  primarySkill: "hydra",
  playstyle:
    "Place hydras where something is going to be, then leave. They fire on their own for their whole duration, which means you can stack several sets onto a boss and teleport out while they work. Against packs this is slower than any other Sorceress — the hydras have to acquire targets — but against a single large health pool it is one of the safest damage patterns in the game, because you are never the thing being attacked.",
  strengths: [
    "Damage that continues after you have moved away — the same trick Fire Wall, the Assassin's sentries, Blade Sentinel and the Warlock's sigils use, and the only one a Sorceress gets that also seeks its target",
    "Genuinely safe against bosses: you place, you leave, they die",
    "Cheap to gear and easy to reach the 105% cast rate target with",
    "Excellent at key farming, where the targets are single super uniques",
    "Fire-and-forget suits Hardcore better than any other Sorceress pattern",
  ],
  weaknesses: [
    "**Poor at density.** Hydras acquire targets slowly and do not follow you",
    "Nothing before level 30 — the wait is character level, not a chain",
    "Fire immunity is the most common in Hell and Fire Mastery does not break it",
    "The 18-hydra cap and fixed 250-frame duration mean there is a ceiling on how much you can stack",
    "Both ranked sources place it mid-table, and the reason is clear speed",
  ],
  difficulty: "beginner",
  budget: "low",
  ratings: {
    clearSpeed: 2,
    bossing: 5,
    survivability: 5,
    magicFind: 4,
    terrorZones: 2,
    ubers: 2,
    soloSelfFound: 4,
    players8: 3,
  },

  skills: [
    {
      skill: "hydra",
      points: 20,
      role: "main",
      order: 1,
      note: "Level 30. Duration is fixed at 250 frames whatever you spend — points buy damage, not uptime. Eighteen is the cap; the oldest disappears past that.",
    },
    {
      skill: "fire-mastery",
      points: 20,
      role: "main",
      order: 2,
      note: "30% damage at level 1 and +7% per level. A damage multiplier, not a resistance reduction.",
    },
    {
      skill: "fire-bolt",
      points: 20,
      role: "synergy",
      order: 3,
      note: "Hydra's damage synergy, and your damage for the first eleven levels. Nothing here is wasted.",
    },
    {
      skill: "fire-ball",
      points: 20,
      role: "synergy",
      order: 4,
      note: "Doing two jobs: **+3% Hydra damage per level**, and Enchant's prerequisite, which is what Hydra actually needs.",
    },
    { skill: "warmth", points: 1, role: "utility", note: "Mana regeneration, and Enchant's other prerequisite." },
    { skill: "telekinesis", points: 1, role: "prerequisite" },
    { skill: "teleport", points: 1, role: "utility", note: "**One point forever**, and it is how you leave after placing." },
    { skill: "static-field", points: 1, role: "utility", note: "Takes 25% of a target's current life — it stacks well with a build that is already patient about bosses." },
    { skill: "frozen-armor", points: 1, role: "utility", note: "Defence and a freeze on attackers." },
    { skill: "frost-nova", points: 1, role: "utility", note: "A panic button for anything that closes on you while the hydras are working." },
    {
      skill: "enchant",
      points: 1,
      role: "prerequisite",
      note: "**Hydra's prerequisite is Enchant** — not Fire Wall or Meteor. One point opens the whole build.",
    },

  ],
  flexPoints: [
    "**The starter split.** Maxroll's Starter variant puts early points into a cold or lightning skill so you have something that works against fire immunes, then respecs fully into fire once a Sunder Charm or Infinity exists. This is what the inventory called 'Hydra/Frozen Orb' — it is a levelling variant of this build, not a separate one.",
    "**Fire Ball versus utility.** Maxing Fire Ball gives you a real clearing spell and turns the build into something closer to a Fire Ball Meteor Sorceress with turrets. Leaving it at one point and spending elsewhere keeps the build's identity but leaves density genuinely slow. Both are defensible; pick based on whether you farm bosses or zones.",
    "**Magic find variant:** the build is safe enough that trading damage for magic find costs you time and not deaths. Same skill plan.",
    "**Do not put points in Energy.** Warmth plus an Insight mercenary covers the cost of placing hydras.",
  ],
  stats: {
    strength: "Only what your gear requires.",
    dexterity: "None. Teleport and distance are the defence.",
    vitality: "Everything else.",
    energy: "None.",
    notes: [
      "This build takes less damage than any other Sorceress on the site, because the hydras are what the monsters are attacking. Vitality still matters, but it matters less here than anywhere else.",
      "Placing three or four hydras in sequence is a real mana cost. Warmth and an Insight mercenary are the answer, not Energy.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 105,
      frames: 8,
      priority: "recommended",
      why: "The standard Sorceress target, and it matters twice over here — it is how fast you place hydras and how fast you teleport away afterwards.",
    },
    {
      stat: "fcr",
      value: 63,
      frames: 9,
      priority: "required",
      why: "The starter target. Two Spirits pass it comfortably.",
    },
    {
      stat: "fhr",
      value: 60,
      frames: 9,
      priority: "recommended",
      why: "Less critical than on other Sorceress builds, because you are usually not the target — but still what saves you when a hydra pulls something onto you.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 30 through the Fire Wall and Meteor chain.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and up to 35% cast rate at level 25.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket Crystal Sword.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances for three Countess runes." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Cast rate and hit recovery at level 17." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 Fire Skills and 20% cast rate." }],
        },
      ],
      nextUpgrade: "Level 30 for Hydra and Fire Mastery together.",
      notes:
        "Fire Bolt carries you to 12 and is Hydra's synergy, so nothing early is wasted. Fire Ball from 12 covers the gap until 30.",
    },

    {
      tier: "nightmare",
      goal: "Hydras placed, Mephisto and the key bosses on farm.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Cast rate and skills." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A second Spirit — 70% cast rate between them.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 skills, cast rate and resistances at 43 Strength." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 Fire Skills." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest path to 75%." }],
      nextUpgrade: "Resistances to 75%, an Insight for the mercenary, and a plan for fire immunes.",
    },

    {
      tier: "early-hell",
      goal: "105% cast rate and an answer to fire immunity.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Cast rate and skills." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "The second one." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "Resistances and cast rate." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, magic find and damage reduction." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }],
        },
        {
          slot: "ring1",
          picks: [
            {
              label: "Rare ring with 10% Faster Cast Rate and resistances",
              why: "The last cast rate you need.",
              lookFor: ["10% Faster Cast Rate", "Two resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Resistance and life small charms", why: "Hold 75%." },
        {
          label: "Flame Rift (fire Sunder Charm)",
          why: "The direct answer to fire immunity, and the one Maxroll's own guide plans around. It costs 70 to 90 points of your own fire resistance.",
        },
      ],
      nextUpgrade: "Death's Fathom is the wrong element — Eschuta's Temper is this build's damage weapon.",
    },

    {
      tier: "budget",
      goal: "Fast key farming and boss kills.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "eschutas-temper" },
              why: "Up to +3 Sorceress skills, 40% cast rate and +20% fire skill damage. The build's damage weapon.",
              alternatives: [
                { ref: { kind: "runeword", slug: "spirit" }, why: "Keep the Spirit while resistances are the constraint — Eschuta's has none." },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Cast rate and skills." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills and magic find." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 Fire Skills." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and 20% cast rate." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
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
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Flame Rift (fire Sunder Charm)", why: "Carry it where the zone demands it." },
      ],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
      nextUpgrade: "Fire facets in every socket you have.",
    },

    {
      tier: "optimized",
      goal: "Maximum fire damage on turrets that never miss.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "eschutas-temper" },
              why: "+3 skills and +20% fire skill damage, socketed with fire facets.",
              lookFor: ["+3 Sorceress Skills", "+20% Fire Skill Damage", "3 sockets"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Cast rate and skills." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 skills and +65 all resistances.",
              alternatives: [
                { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport with a flat mana cost and magic find per level." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, socketed with a fire facet.", lookFor: ["2 sockets"] }],
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
              label: "Rare ring: 10% Faster Cast Rate, resistances, life",
              why: "The slot where a rare wins.",
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
        { label: "Fire skill grand charms with life", why: "Damage and life." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "There is very little left. This build reaches its ceiling early and cheaply.",
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
              why: "A +3 skills and +20% fire damage roll with three fire facets.",
              lookFor: ["+3 Sorceress Skills", "+20% Fire Skill Damage", "3 sockets"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% cast rate in a Monarch.", lookFor: ["35% Faster Cast Rate"] }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport and magic find per level." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills with a fire facet.", lookFor: ["2 sockets"] }],
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
              label: "Rare ring: 10% Faster Cast Rate, two resistances, life",
              why: "The last slot.",
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
        "This build is finished a long way below the top of the market, which is the honest reason both ranked sources put it mid-table. It will never clear like a Nova Sorceress. It will also never need an Infinity.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**He matters more here than on most Sorceress builds**, because hydras are slow to acquire targets and something has to hold the front. Take **Might** for damage or **Holy Freeze** to slow whatever the hydras are shooting, give him an **Insight** for the mana that placing several hydras costs, and a **Treachery** plus **Vampire Gaze** to keep him alive. Later, an **Infinity** on him is the alternative to carrying a Flame Rift.",

  farming: [
    {
      area: "countess",
      difficulty: "hell",
      why: "A single super unique at the end of a short route — exactly what turrets are for. Runes on top.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "One target, monster level 86, ten seconds from a portal. Place, step back, collect.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "mephisto",
      difficulty: "hell",
      why: "He is not fire immune, and the fosse trick means the hydras do the work while nothing can reach you.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "Short, near a waypoint, and a single target.",
      minTier: "starter",
      rating: 4,
    },
    {
      area: "nihlathak",
      difficulty: "hell",
      why: "A key boss, and turrets handle him from outside the range of what makes him dangerous.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "stony-tomb",
      difficulty: "hell",
      why: "Area level 85 and light on fire immunity, though the density suits this build less than a projectile one.",
      minTier: "budget",
      rating: 3,
    },
  ],

  immunityPlan:
    "Fire is the most resisted element in Hell and **Fire Mastery does not break immunity** — it gives 30% damage at level 1 plus 7% per level. Because this build has no second damage type at all, the answer has to come from outside it. **A Flame Rift sunder charm** is the direct fix and the one Maxroll's own guide plans around, at the cost of 70 to 90 points of your own fire resistance. **Infinity on the mercenary** does it without the penalty and at a much higher price. **The starter split** — keeping early points in a cold or lightning skill until one of the above exists — is the free answer while levelling, and is what the inventory's 'Hydra/Frozen Orb' entry actually describes. Choosing targets also works better here than on most builds: the key bosses and Mephisto, which is where this build wants to be anyway, are not fire immune.",

  hardcoreNotes:
    "Arguably the safest Sorceress build in the game. You place hydras and leave; the monsters attack turrets, not you; and against a boss you are never in the room when it dies. The build's weakness — slow clear speed — costs time rather than lives. The usual class caveats still apply: smallest life pool, no block, and 60% Faster Hit Recovery for the moments something walks past a hydra and finds you.",

  selfFoundNotes:
    "Very self-found friendly and better at it than its tier suggests. It needs no expensive item to work, it kills the single targets that drop the most, and its whole gear list below the endgame is Countess runewords and common uniques. Fire immunity is the one thing self-found cannot easily solve — a Flame Rift is a realistic target, an Infinity is not — and the answer meanwhile is to farm the bosses that are not immune.",

  levelingPath: {
    summary:
      "Hydra is a level 30 skill behind an unusually long chain: Fire Bolt to Fire Ball to Meteor, and Fire Bolt to Inferno to Fire Wall, before Hydra opens at all. The good news is that Fire Bolt is also Hydra's damage synergy, so the levelling points pay off twice. Level as a Fire Ball Sorceress and the transition costs nothing — **no respec is required** unless you took the cold or lightning starter split, in which case the free Den of Evil token covers it.",
    respecAt: "Only if you took the cold or lightning starter split",
  },

  confidence: "verified",
  complete: true,
};
