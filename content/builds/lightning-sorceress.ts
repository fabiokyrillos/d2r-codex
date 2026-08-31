import type { Build } from "@/lib/types";

/**
 * The Lightning Sorceress.
 *
 * One fact dominates this build and it is the reason the page exists in the
 * shape it does: **Lightning and Chain Lightning use a different cast animation
 * from every other Sorceress spell, with its own breakpoint table.** A player
 * who gears to 105% Faster Cast Rate — the number every other Sorceress guide
 * repeats — lands between the 78 and 117 thresholds on the table that actually
 * applies, and pays for cast rate they do not receive.
 *
 * Verified at Tier 1 (`skills.json`):
 * - Lightning requires level 12, Chain Lightning 18, both `EType = ltng`.
 * - Lightning Mastery requires level 30 and gives **50% damage baseline plus
 *   12% per level** — it increases your damage, it does not reduce enemy
 *   resistance. That is the opposite of Cold Mastery and it is why this build's
 *   immunity plan runs through Infinity rather than through a mastery.
 * - Static Field takes **25% of the target's current life** and has radius 5
 *   plus 1 per level.
 *
 * Both ranked sources place this at S.
 */
export const lightningSorceress: Build = {
  slug: "lightning-sorceress",
  name: "Lightning Sorceress",
  classSlug: "sorceress",
  summary:
    "Enormous damage spikes on a chain that finds its own targets. The most versatile Sorceress, on a breakpoint table of its own.",
  damageTypes: ["lightning"],
  primarySkill: "lightning",
  playstyle:
    "Two spells and a decision between them. Lightning is a bolt down a line and the higher single-target hit; Chain Lightning jumps between targets and clears packs. You teleport in, pick whichever one the situation wants, and hold it. Static Field softens anything with a large health pool by taking a quarter of its current life per cast, and your mercenary's Infinity handles the lightning immunes. The build's damage range is the widest of any Sorceress — the same cast can roll very low or very high — which is why it feels inconsistent until the +damage and -enemy-resistance gear arrives.",
  strengths: [
    "Excellent at both density and single targets, which few builds manage",
    "Static Field trivialises high-health bosses regardless of your damage roll",
    "Chain Lightning finds targets you cannot see, which suits fast teleport clearing",
    "Strong at Baal waves, the Uber key bosses and Arcane Sanctuary",
    "Scales further than most: Griffon's Eye, facets and Infinity all stack multiplicatively-ish on top of each other",
  ],
  weaknesses: [
    "**Its cast animation has its own breakpoint table** — the usual 105% target is the wrong number here",
    "Lightning immunes are common in Hell and Lightning Mastery does not break them",
    "The damage range is very wide, so individual casts feel unreliable at low gear",
    "Needs Infinity to reach its ceiling, and Infinity is a Ber and a Jah",
    "Low life, like every Sorceress — Energy Shield is a real consideration",
  ],
  difficulty: "moderate",
  budget: "high",
  ratings: {
    clearSpeed: 5,
    bossing: 4,
    survivability: 3,
    magicFind: 4,
    terrorZones: 5,
    ubers: 3,
    soloSelfFound: 3,
    players8: 5,
  },

  skills: [
    {
      skill: "lightning",
      points: 20,
      role: "main",
      order: 1,
      note: "Available at level 12. The higher single-target hit, and a synergy for Chain Lightning.",
    },
    {
      skill: "chain-lightning",
      points: 20,
      role: "main",
      order: 2,
      note: "Level 18. The clearing spell — it jumps between targets, which is what makes this build fast.",
    },
    {
      skill: "lightning-mastery",
      points: 20,
      role: "main",
      order: 3,
      note: "**50% damage at level 1 and +12% per level.** It raises your damage; it does not reduce enemy resistance. Do not expect it to break immunity — that is Infinity's job.",
    },
    {
      skill: "charged-bolt",
      points: 20,
      role: "synergy",
      order: 4,
      note: "A synergy for both Lightning and Chain Lightning, and a genuinely useful point-blank spell while levelling.",
    },
    {
      skill: "static-field",
      points: 1,
      role: "utility",
      note: "**Takes 25% of the target's current life per cast**, with a floor of 33% of maximum in Nightmare and 50% in Hell. One point; the only thing more points buy is radius.",
    },
    { skill: "telekinesis", points: 1, role: "prerequisite", note: "Teleport's prerequisite, and it raises Energy Shield's efficiency if you take that route." },
    { skill: "teleport", points: 1, role: "utility", note: "**One point is all you ever need.** More points only reduce the mana cost." },
    { skill: "warmth", points: 1, role: "utility", note: "Mana regeneration from level 1. One point pays for itself immediately." },
    { skill: "frozen-armor", points: 1, role: "utility", note: "Defence and a chance to freeze attackers. A free defensive buff." },
    { skill: "nova", points: 1, role: "synergy", note: "**+5% Lightning damage per level.** One point is all the budget allows, but it is a synergy, not a prerequisite." },
    {
      skill: "thunder-storm",
      points: 1,
      role: "utility",
      note: "A passive strike on a timer. **Lightning Mastery does not require it** — take it for what it does, or not at all.",
    },
    { skill: "energy-shield", points: 1, role: "flex", note: "Optional and genuinely divisive — see the flex points before spending here." },

  ],
  flexPoints: [
    "**Everything past the four maxed skills goes to Charged Bolt or Nova**, both of which are synergies. Charged Bolt first.",
    "**Energy Shield is a real fork.** It converts incoming damage to mana at a base rate of two mana per point of damage, improved by Telekinesis. On a build with no life it can be the difference between surviving a lightning enchanted pack and not — but it also means a mana burn or a drained pool kills you outright. Take it deliberately or not at all.",
    "**Do not put points in Energy.** The mana comes from Warmth, an Insight mercenary and your gear.",
  ],
  stats: {
    strength: "Only what your gear requires. A Spirit Monarch asks 156 and is the usual reason this number is not tiny; a Lidless Wall or a Spirit in a lighter shield asks far less.",
    dexterity: "None, unless you are building for maximum block — and most Lightning Sorceresses are not. Teleport is the defence.",
    vitality: "Everything else. There is no competing use.",
    energy: "None. Even with Energy Shield, gear and Warmth provide more mana per point spent than Energy does.",
    notes: [
      "**Decide the shield before spending Strength.** A Spirit in a Monarch is 156 Strength; the same runeword in a Sacred Targe is a fraction of that.",
      "Energy Shield users are sometimes told to invest in Energy. Do not — the shield scales with your mana *pool*, and gear supplies far more mana per point than the attribute does.",
      "Life is the stat that keeps a Sorceress alive, and Battle Orders from a Call to Arms swap is worth more than any amount of Vitality you can buy.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 117,
      frames: 12,
      priority: "recommended",
      why: "**On the Lightning/Chain Lightning table, not the standard one.** This is the realistic endgame target and the reason the usual 105% advice is wrong for this build.",
    },
    {
      stat: "fcr",
      value: 78,
      frames: 13,
      priority: "required",
      why: "The minimum that feels acceptable. Two Spirits alone reach 70, so this is one 10% ring away.",
    },
    {
      stat: "fcr",
      value: 194,
      frames: 11,
      priority: "luxury",
      why: "One more frame, at a cost that almost always beats out damage or resistance you need more.",
    },
    {
      stat: "fhr",
      value: 60,
      frames: 9,
      priority: "recommended",
      why: "A Sorceress that gets interrupted is a Sorceress that dies. This is the standard Sorceress hit-recovery target.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 18 for Teleport, then level 30 for Lightning Mastery.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and up to 35% Faster Cast Rate at level 25. The single best value item a levelling Sorceress can hold.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket Crystal Sword.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "Resistances for three Countess runes, which is what carries you into Nightmare.",
            },
          ],
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
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate at level 23." }],
        },
      ],
      nextUpgrade:
        "Level 30 and Lightning Mastery. Before that the build is a Charged Bolt character and it is fine at it.",
      notes:
        "Level with Charged Bolt and Nova — both are synergies, so nothing is wasted. Static Field from level 6 handles anything with too much life.",
    },

    {
      tier: "nightmare",
      goal: "Lightning Mastery online, a second Spirit, resistances climbing.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Still the best value weapon available." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A second Spirit. Two of them are +4 skills and 70% Faster Cast Rate, which is most of the way to the 78 threshold on your table.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "lidless-wall" },
                  why: "+1 skills and 20% Faster Cast Rate with no 4-socket base to find. Weaker, but available immediately.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "+1 skills, 30% Faster Cast Rate and up to +35 all resistances at 43 Strength. The standard caster armour for a reason.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find until something better drops." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana on a character with no Energy." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest route to 75% before Hell." }],
      nextUpgrade: "An Insight for the mercenary, then resistances to 75% before you enter Hell.",
    },

    {
      tier: "early-hell",
      goal: "Reach 78% Faster Cast Rate on the lightning table and cap resistances.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% Faster Cast Rate and +2 skills." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "The second one. 70% between them." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "Resistances and cast rate together.",
              alternatives: [
                { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances. The upgrade when the runes appear." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, 50% magic find and 10% damage reduction at 50 Strength." }],
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
              why: "The cheapest remaining cast rate, carrying resistance you still need.",
              lookFor: ["10% Faster Cast Rate", "Two resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster Hit Recovery, Strength and Vitality." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "Hold 75% in all four." }],
      nextUpgrade: "Infinity on the mercenary. It is the difference between clearing Hell and choosing your zones carefully.",
      notes:
        "This is where lightning immunity stops being occasional. Until Infinity exists, plan your farming around zones that are not full of it — the farming list below is ordered with that in mind.",
    },

    {
      tier: "budget",
      goal: "Infinity, and the build's real form.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "+3 skills, 40% Faster Cast Rate and up to +40 all resistances. The biggest single upgrade the build makes.",
              sockets: "Ko, Vex, Pul, Thul into a 4-socket Flail.",
              alternatives: [
                { ref: { kind: "runeword", slug: "spirit" }, why: "Keep the Spirit until Heart of the Oak is in hand — 35% versus 40% is not the gap the price suggests." },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% Faster Cast Rate and +2 skills." }],
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
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
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
              why: "The last cast rate needed to clear the 117 threshold.",
              lookFor: ["10% Faster Cast Rate", "Resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and damage while you farm." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills and +10-20 all resistances." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Lightning skill grand charms", why: "Direct damage, in the slot with nothing better to do." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders. On a character with this little life, it is not optional." },
      ],
      nextUpgrade: "Griffon's Eye, and lightning facets to socket into it.",
    },

    {
      tier: "optimized",
      goal: "117% Faster Cast Rate on the lightning table, with enemy resistance stacked down.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "+3 skills, 40% Faster Cast Rate, resistances.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "eschutas-temper" },
                  why: "More raw damage — up to +3 Sorceress skills and +20% lightning skill damage — at the cost of every resistance Heart of the Oak was giving you.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% Faster Cast Rate and +2 skills." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "griffons-eye" },
              why: "**-15-20% enemy lightning resistance** and +10-15% lightning skill damage. The resistance line stacks with Infinity's Conviction and is applied before immunity is checked.",
              lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage", "1 socket for a facet"],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport without a mana cost that scales, and the Strength to wear whatever you like.",
              sockets: "Jah, Ith, Ber into a 3-socket body armour.",
              alternatives: [
                { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "Keep it while resistances are tight. You already have Teleport as a skill." },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% Faster Cast Rate." }],
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
              why: "The slot where a well-rolled rare beats every unique.",
              lookFor: ["10% Faster Cast Rate", "Two resistances at 20+", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find, or Sandstorm Trek for the hit recovery." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Lightning skill grand charms with life", why: "Damage and life in the same slot." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Lightning facets in every socket you have, and a better Griffon's roll.",
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
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "A +40 all-resistances roll alongside the +3 skills and 40% cast rate.",
              lookFor: ["+40 all resistances", "Flail base"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A 35% Faster Cast Rate roll in a Monarch, socketed if you can afford the Strength.",
              lookFor: ["35% Faster Cast Rate", "Monarch base"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "griffons-eye" },
              why: "A -20% enemy resistance and +15% skill damage roll, socketed with a lightning facet.",
              lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, Strength and magic find per level." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% Faster Cast Rate." }],
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
              lookFor: ["10% Faster Cast Rate", "Two resistances at 20+", "Life and mana"],
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
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Lightning skill grand charms with life", why: "The rest of the inventory." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "Past 117% Faster Cast Rate there is only damage left to buy: facets, a better Griffon's roll, and lightning skill charms. The 194 threshold exists but the cost of reaching it beats out things you need more.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "The Act 2 Desert Mercenary with **Might**, an **Insight** for your mana and — the item this build is waiting for — an **Infinity** in his polearm. Infinity's Conviction aura is what breaks lightning immunity, and until it exists the build has no answer to a lightning immune beyond skipping it. Give him a **Vampire Gaze** for the damage reduction and life steal; he dies more than a melee character's mercenary does.",

  farming: [
    {
      area: "throne-of-destruction",
      difficulty: "hell",
      why: "Five dense waves in one room. Chain Lightning is at its best here, and Static Field brings Baal's health down regardless of your damage roll.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Dense and high level. Watch for lightning-immune packs before Infinity exists.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "arcane-sanctuary",
      difficulty: "hell",
      why: "Long open corridors that suit teleporting, and the Summoner drops a key. Chain Lightning covers the width of the platforms.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85 and very dense — the best general lightning farm once Infinity exists.",
      minTier: "optimized",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, short, and a reasonable amount of it is not lightning immune.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "countess",
      difficulty: "hell",
      why: "Runes for the Infinity you are building. Short, and nothing there resists you meaningfully.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are lightning immune. Without Infinity this is not your zone, and with Infinity it becomes one of the best.",
      minTier: "optimized",
      rating: 3,
    },
  ],

  immunityPlan:
    "Lightning immunity is common in Hell and this build has exactly one real answer to it. **Lightning Mastery does not help** — it is a damage increase (50% at level 1, +12% per level), not a resistance reduction, which makes it the opposite of Cold Mastery and is the single most common misunderstanding about the build. What does work is **Infinity on the mercenary**, whose Conviction aura reduces enemy resistance enough to break most naturally occurring lightning immunity. Before Infinity exists, the honest answers are **Griffon's Eye** (-15-20% enemy lightning resistance, applied before the immunity check), **lightning facets**, and choosing zones that are not full of immunes — the farming list above is ordered with that in mind. A **Crack of the Heavens** sunder charm is the direct fix, at the cost of 70 to 90 points of your own lightning resistance; read the mechanics article before you pick one up.",

  hardcoreNotes:
    "Playable but demanding. The Sorceress's life pool is the smallest in the game and this build has no block, so survival is Teleport, hit recovery and Battle Orders. Two specific dangers: **lightning enchanted** packs, because your own resistance is what saves you and Conviction from an Infinity does not protect you from them; and **mana burn**, which is lethal if you took Energy Shield. Chains of Honor over Enigma, keep a Call to Arms swap, and treat the 60% Faster Hit Recovery target as required rather than recommended.",

  selfFoundNotes:
    "Fine up to a point, and then it stops. Two Spirits are eight Countess runes and are entirely self-found; Skin of the Vipermagi, Harlequin Crest and Mara's Kaleidoscope all drop in Hell. Infinity is where it ends — a Ber and a Jah among four runes is not a realistic self-found target, and without it lightning immunity permanently limits where you can farm. A self-found Lightning Sorceress is a good character that farms a restricted list of zones. If that is not what you want, the Blizzard or Frozen Orb pages describe cold builds with a mastery that does break immunity.",

  levelingPath: {
    summary:
      "Levels as itself, with one wrinkle. Charged Bolt from level 1 and Nova from 12 are both synergies, so nothing you spend early is wasted, and Static Field from level 6 handles anything with too much life. Lightning arrives at 12, Chain Lightning at 18, and Teleport at 18 changes how you move for the rest of the game. **Lightning Mastery does not exist until level 30**, so the build's damage feels flat until then — that is expected, not a mistake in your allocation.",
  },

  confidence: "verified",
  complete: true,
};
