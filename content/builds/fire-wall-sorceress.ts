import type { Build } from "@/lib/types";

/**
 * The Fire Wall Sorceress.
 *
 * The lowest-ranked caster build in the Sorceress research — Maxroll B,
 * DiabloBytes C — and the page says so. It earns its place for one reason:
 * Maxroll tags it for **Ubers**, which almost no Sorceress build is good at,
 * because a wall of fire laid across a doorway damages anything that walks
 * through it regardless of how much health that thing has.
 *
 * Verified at Tier 1 (`skills.json`):
 * - Fire Wall requires level 18, is `EType = fire`, and has two damage
 *   synergies. The site's own skill data records Inferno as one of them.
 * - Its prerequisite is Inferno, which is behind Fire Bolt — a short chain
 *   compared to Hydra's.
 * - Fire Mastery requires level 30 and gives 30% damage plus 7% per level.
 *
 * Uses the standard Sorceress cast table.
 */
export const fireWallSorceress: Build = {
  slug: "fire-wall-sorceress",
  name: "Fire Wall Sorceress",
  classSlug: "sorceress",
  summary:
    "Ground denial rather than damage. You decide where the enemy is allowed to walk, and Ubers walk through it anyway.",
  damageTypes: ["fire"],
  primarySkill: "fire-wall",
  playstyle:
    "Place walls where things have to go, not where they are. Fire Wall damages over time rather than on impact, so it rewards reading a room — a corridor, a doorway, the ground between a boss and you. Against something that moves toward you regardless of what is in the way, which is most of the game's bosses, it is far better than its clear speed suggests. Against a scattered pack in an open room it is one of the worst spells in the game, and no amount of gear fixes that.",
  strengths: [
    "**Genuinely good at Ubers**, which almost no Sorceress build is — Maxroll tags it for exactly that",
    "Damage over time ignores how much health the target has, so bosses are not a wall",
    "Cheap. It needs no expensive item to do what it does",
    "Available at level 18 behind a short prerequisite chain",
    "Stacking several walls on one spot is a real burst option most builds do not have",
  ],
  weaknesses: [
    "**Poor at density in open ground.** If things can walk around it, they will",
    "Fire is the most resisted element in Hell and Fire Mastery does not break immunity",
    "The damage is delayed, so it rewards prediction and punishes reaction",
    "Lowest-ranked caster build in the research — Maxroll B, DiabloBytes C",
    "One damage type and no fallback",
  ],
  difficulty: "advanced",
  budget: "low",
  ratings: {
    clearSpeed: 2,
    bossing: 4,
    survivability: 3,
    magicFind: 3,
    terrorZones: 2,
    ubers: 4,
    soloSelfFound: 3,
    players8: 3,
  },

  skills: [
    {
      skill: "fire-wall",
      points: 20,
      role: "main",
      order: 1,
      note: "Level 18. Damage over time rather than on impact — the whole skill is choosing where to put it.",
    },
    {
      skill: "fire-mastery",
      points: 20,
      role: "main",
      order: 2,
      note: "30% damage at level 1 and +7% per level. A multiplier, not a resistance reduction.",
    },
    {
      skill: "inferno",
      points: 20,
      role: "synergy",
      order: 3,
      note: "Fire Wall's synergy and its prerequisite. Also a genuinely usable point-blank stream while levelling.",
    },
    {
      skill: "meteor",
      points: 20,
      role: "flex",
      order: 4,
      note: "Not a synergy — a second spell, and the one that covers Fire Wall's weakness against things standing still in the open. It is also Fire Mastery's prerequisite, so the first point is already spent.",
    },
    { skill: "fire-bolt", points: 1, role: "prerequisite" },
    { skill: "fire-ball", points: 1, role: "prerequisite", note: "Meteor's prerequisite, and a fast spell for things Fire Wall cannot corner." },
    { skill: "warmth", points: 1, role: "utility", note: "Mana regeneration from level 1. Stacking walls is expensive." },
    { skill: "charged-bolt", points: 1, role: "prerequisite" },
    { skill: "telekinesis", points: 1, role: "prerequisite" },
    { skill: "teleport", points: 1, role: "utility", note: "**One point forever**, and it is how you get behind a wall you just placed." },
    { skill: "static-field", points: 1, role: "utility", note: "Takes 25% of a target's current life — it pairs unusually well with damage over time." },
    { skill: "frozen-armor", points: 1, role: "utility", note: "Defence and a freeze on attackers." },
    { skill: "ice-bolt", points: 1, role: "prerequisite" },
    { skill: "frost-nova", points: 1, role: "utility", note: "Chills a pack so it stays in the wall longer, which is the single most useful non-fire point on the list." },
  ],
  flexPoints: [
    "**Meteor is the flex, and most players take it.** Fire Wall alone cannot handle a scattered pack, and Meteor is already on the prerequisite path to Fire Mastery. Maxing it turns the build into something closer to a Fire Ball Meteor Sorceress that also denies ground.",
    "**More Frost Nova** if you would rather solve the same problem defensively — a chilled pack walks through your wall for longer.",
    "**Magic find variant:** the build is cheap enough that the gear budget can go to magic find. Same skill plan.",
    "**Do not put points in Energy.** Warmth plus an Insight mercenary covers the cost of stacking walls.",
  ],
  stats: {
    strength: "Only what the gear requires.",
    dexterity: "None.",
    vitality: "Everything else.",
    energy: "None.",
    notes: [
      "Nothing unusual here. The build's difficulty is in where you stand, not in what you spend.",
      "A Call to Arms swap is worth more than any Vitality you could buy with the same currency.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 105,
      frames: 8,
      priority: "recommended",
      why: "The standard Sorceress target. It governs how quickly you can stack several walls on one spot, which is this build's burst.",
    },
    {
      stat: "fcr",
      value: 63,
      frames: 9,
      priority: "required",
      why: "The starter target, reachable with a Spirit sword and Magefist.",
    },
    {
      stat: "fhr",
      value: 60,
      frames: 9,
      priority: "recommended",
      why: "The standard Sorceress hit-recovery target. You are usually behind your own wall, but not always.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Fire Wall at 18, and Fire Mastery at 30.",
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
      nextUpgrade: "Level 30 for Fire Mastery. Fire Bolt and Inferno carry you there, and Inferno is a synergy.",
      notes:
        "Fire Wall arrives at 18 but is awkward while levelling, because monsters in the open walk around it. Most players lean on Fire Bolt and Inferno until Meteor at 24 gives them a second option.",
    },

    {
      tier: "nightmare",
      goal: "Fire Mastery online and both spells doing work.",
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
      goal: "105% cast rate, capped resistances, and an answer to fire immunity.",
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
        { label: "Flame Rift (fire Sunder Charm)", why: "The direct answer to fire immunity, at the cost of 70 to 90 points of your own fire resistance." },
      ],
      nextUpgrade: "Eschuta's Temper, and a set of Uber keys if that is what you built this for.",
    },

    {
      tier: "budget",
      goal: "Hell farming, and the mini-Ubers.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "eschutas-temper" },
              why: "Up to +3 Sorceress skills, 40% cast rate and +20% fire skill damage.",
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
      nextUpgrade: "Fire facets, and the resistances to survive standing near your own wall.",
    },

    {
      tier: "optimized",
      goal: "Uber-capable, and comfortable in the zones that suit the spell.",
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
                { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport with a flat mana cost, which matters on a build that repositions constantly." },
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
      nextUpgrade: "Fire facets in every socket. There is little else.",
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
        "The honest note: this is the lowest-ranked caster build in the research and its best-in-slot list is nearly identical to the Fire Ball Meteor Sorceress's, which both sources rate two bands higher. Build it for the Ubers and for the way it plays, not because the gear ceiling is different — it is not.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Holy Freeze rather than Might.** Anything slowed spends longer inside your wall, and on a damage-over-time build that is a direct damage increase in a way it is not for other Sorceresses. Give him an **Insight** for the mana that stacking walls costs, and a **Vampire Gaze** with **Treachery** to keep him holding the ground you are burning. Later, an **Infinity** is the alternative to a Flame Rift charm.",

  farming: [
    {
      area: "uber-tristram",
      difficulty: "hell",
      why: "The reason this build exists. Damage over time ignores how much health a level 110 boss has, and the Ubers move toward you through whatever you have placed. Slower than a Smiter, and far more possible than any other Sorceress.",
      minTier: "optimized",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Corridors and Seal bosses that come to you — the layout this spell was designed for. A good share resists fire, so bring the sunder charm.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Dense area level 85 with narrow approaches, and light on fire immunity.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "stony-tomb",
      difficulty: "hell",
      why: "Area level 85, corridors, and very little fire immunity. One of the few zones where the spell's shape and the map's shape agree.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "She walks straight at you down a short room. Stack walls and step back.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, but open rooms where monsters can simply walk around a wall. This is the map shape the build is worst at.",
      minTier: "optimized",
      rating: 2,
    },
  ],

  immunityPlan:
    "One element and no fallback unless you took Meteor — which is also fire, so it does not help against immunity either. **Fire Mastery does not break it**: 30% damage at level 1 plus 7% per level raises your output, not their resistance, and fire is the most commonly resisted element in Hell. The answers are the same three as every fire build's. **A Flame Rift sunder charm** is the direct fix at the cost of 70 to 90 points of your own fire resistance. **Infinity on the mercenary** does it without the penalty and at a far higher price. **Choosing zones** is free, and it matters more here than elsewhere because the build already wants specific *shapes* of map — Stony Tomb and the Chaos Sanctuary give you both corridors and light fire immunity at once.",

  hardcoreNotes:
    "Better than its clear speed suggests, for a structural reason: you place the damage and then stand somewhere else. A wall in a doorway means the fight happens where you chose rather than where the monsters chose. The usual class caveats apply — smallest life pool, no block, 60% Faster Hit Recovery as a floor — and the specific danger is open ground, where the spell does nothing and you are just a Sorceress with no escape plan. Take Chains of Honor over Enigma and keep Frost Nova bound.",

  selfFoundNotes:
    "Genuinely fine. Nothing the build needs is expensive, Fire Wall arrives at 18 behind a two-skill chain, and its best-in-slot list contains no item that a self-found character cannot eventually find. The honest caveat is the same as every fire build's: fire immunity in Hell, with a Flame Rift as the realistic answer and an Infinity as the one that is not.",

  levelingPath: {
    summary:
      "Level with Fire Bolt and then Fire Ball, both of which are on the way to Meteor and Fire Mastery. Fire Wall arrives at 18 but is awkward while levelling — monsters in open ground walk around it — so most players lean on Inferno, which is Fire Wall's synergy and therefore not wasted, and switch over once Meteor at 24 and Fire Mastery at 30 give the build its second option and its multiplier. **No respec is required.**",
  },

  confidence: "verified",
  complete: true,
};
