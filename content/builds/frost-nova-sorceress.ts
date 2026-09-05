import type { Build } from "@/lib/types";

/**
 * The Frost Nova Sorceress.
 *
 * Neither ranked source's inventory in the original brief contained this build,
 * and both Maxroll and DiabloBytes carry it at B — the research pass added it
 * on that basis.
 *
 * There is one structural fact that makes the page worth writing. **Frost Nova
 * is a level 6 skill**, but Cold Mastery — the thing that keeps its damage
 * relevant in Hell — is a level 30 skill. Cold Mastery itself requires no
 * prerequisite at all; what gates the build is character level, not a chain.
 *
 * The second structural fact is which skills feed it. Frost Nova's row reads
 * `EDmgSymPerCalc = (skill('Blizzard'.blvl)+skill('Frozen Orb'.blvl))*par8`
 * with `par8 = 10`. **Blizzard and Frozen Orb are the whole list, at 10% per
 * hard point each.** Ice Bolt, Ice Blast and Glacial Spike feed Blizzard,
 * Frozen Orb and each other; they give Frost Nova nothing, and this page used
 * to max all three of them.
 *
 * - Frost Nova 20 and Cold Mastery 20 = 40
 * - Blizzard 20 and Frozen Orb 20, the two real synergies = 40
 * - The chain that reaches Blizzard: Ice Bolt, Ice Blast, Glacial Spike = 3
 * - Teleport, Telekinesis, Warmth, Static Field, Frozen Armor = 5
 *
 * That is 88 of the 110 a level 99 character has, and the 22 that remain are
 * counted in the flex points. Forty hard points of synergy is **+400%** where
 * the old plan's two points were +20%, so the correction is worth about four
 * times the damage as well as being what the game's own tables say.
 *
 * Verified at Tier 1: Frost Nova requires level 6 and is `EType = cold`; Cold
 * Mastery requires level 30 and reduces enemy cold resistance by 20% plus 5%
 * per level.
 */
export const frostNovaSorceress: Build = {
  slug: "frost-nova-sorceress",
  name: "Frost Nova Sorceress",
  classSlug: "sorceress",
  summary:
    "An expanding ring of cold centred on you, freezing everything it touches. The cold answer to the Nova Sorceress, at a fraction of the price.",
  damageTypes: ["cold"],
  primarySkill: "frost-nova",
  playstyle:
    "Teleport into the pack and hold the button. The ring expands from where you stand, so there is nothing to aim, and everything it touches is chilled or frozen — which means the pack you are standing inside stops moving. That freeze is the build's real defence and the reason it survives a playstyle that should be suicidal for a Sorceress. Cold Mastery runs quietly behind it, stripping resistance so the damage keeps mattering in Hell.",
  strengths: [
    "**The freeze is the defence.** Everything in the ring stops, which is why standing in the middle works",
    "No aiming at all — the spell is centred on you",
    "Cold Mastery reduces enemy resistance rather than raising your damage, so the build ages well without expensive gear",
    "Very cheap. It reaches its ceiling without a single high rune, unlike the lightning Nova",
    "Its two synergies are two more cold spells, so the damage comes with a ground-placed nuke and a ranged projectile attached",
  ],
  weaknesses: [
    "**Both of its synergies are level 30 skills**, so the ring stays weak for twenty-four levels however you spend before then",
    "Cold immunes are a hard stop, and there is no second damage type",
    "You fight from the centre of the pack, which is where things kill you",
    "The ring itself has poor single-target damage — bosses are a Blizzard and Static Field problem, not a Frost Nova one",
    "Cold Mastery is level 30, so the build's damage is flat until then despite Frost Nova unlocking at 6",
  ],
  difficulty: "moderate",
  budget: "low",
  ratings: {
    clearSpeed: 4,
    bossing: 3,
    survivability: 4,
    magicFind: 4,
    terrorZones: 5,
    ubers: 1,
    soloSelfFound: 4,
    players8: 4,
  },

  skills: [
    {
      skill: "frost-nova",
      points: 20,
      role: "main",
      order: 1,
      note: "Level 6, and available almost immediately — but flat until Cold Mastery arrives at 30. Expands from your position, so the only decision is where to stand.",
    },
    {
      skill: "cold-mastery",
      points: 20,
      role: "main",
      order: 2,
      note: "**Reduces enemy cold resistance by 20% at level 1 and 5% per level.** It does not break true immunity, but it is why the damage still matters deep into Hell.",
    },
    {
      skill: "blizzard",
      points: 20,
      role: "synergy",
      order: 3,
      note: "**One of Frost Nova's two synergies, at 10% per hard point.** Twenty points is +200% on the ring, and it is a strong ground-placed cold spell in its own right for the single targets the ring is bad at.",
    },
    {
      skill: "frozen-orb",
      points: 20,
      role: "synergy",
      order: 4,
      note: "**The other synergy, also 10% per hard point.** Another +200%, and a travelling projectile for the packs you would rather not stand inside. Between them these two are the difference between a Frost Nova that works in Hell and one that does not.",
    },
    { skill: "ice-bolt", points: 1, role: "prerequisite", note: "The first link in the chain to Blizzard. One point: it feeds Blizzard and Frozen Orb rather than the ring, and their own twenty points are worth far more than its." },
    { skill: "ice-blast", points: 1, role: "prerequisite", note: "The second link." },
    { skill: "glacial-spike", points: 1, role: "prerequisite", note: "The third link, and a genuine emergency freeze at one point — its freeze runs 50 frames before any investment at all." },
    { skill: "warmth", points: 1, role: "utility", note: "Mana regeneration from level 1." },
    { skill: "telekinesis", points: 1, role: "prerequisite" },
    { skill: "teleport", points: 1, role: "utility", note: "**One point forever**, and it is how you get into the middle." },
    { skill: "static-field", points: 1, role: "utility", note: "Takes 25% of a target's current life — your only real answer to a boss." },
    { skill: "frozen-armor", points: 1, role: "utility", note: "Defence and a freeze on attackers, stacking with the freeze you are already applying." },

  ],
  flexPoints: [
    "**Twenty-two points are free.** Frost Nova, Cold Mastery, Blizzard and Frozen Orb are eighty and the eight one-point skills are eight, which is 88 of 110. Frost Nova has two synergies and both are already maxed, so **nothing left in the cold tree raises the ring** — the twenty-two buy utility or survival instead.",
    "**Glacial Spike, up to 20 of the 22.** Not a synergy for the ring, but its freeze runs 50 frames at one point and three more per level, and your Blizzard points lengthen it further. This is where more crowd control comes from once the ring is not enough.",
    "**Static Field, up to 20 of the 22.** Its radius grows with every point, and on a build that already stands in the middle, radius is the whole cost of using it.",
    "**Below level 99 the order matters more than the total.** Frost Nova and Cold Mastery first, then Blizzard, then Frozen Orb. Each of the last two is +200% and neither does much half-finished, so complete one before starting the other.",
    "**Magic find variant:** same skill plan, gear swapped for magic find. The build clears fast enough to afford it.",
    "**Do not put points in Energy.** Warmth and an Insight mercenary cover the cost of casting continuously.",
  ],
  stats: {
    strength: "Only what the gear requires.",
    dexterity: "None. The freeze is the defence, not block.",
    vitality: "Everything else, and take it seriously — you fight from the centre of the pack.",
    energy: "None.",
    notes: [
      "Life matters more here than on the ranged cold builds, for the same reason it matters on the Nova Sorceress: you are standing inside what you are killing.",
      "A Call to Arms swap is worth more than any Vitality you could buy with the same currency.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 105,
      frames: 8,
      priority: "recommended",
      why: "The standard Sorceress table. At 105% the rings overlap into something continuous, which is when the freeze becomes reliable rather than intermittent.",
    },
    {
      stat: "fcr",
      value: 63,
      frames: 9,
      priority: "required",
      why: "The minimum for the freeze to keep up with a pack closing on you.",
    },
    {
      stat: "fhr",
      value: 60,
      frames: 9,
      priority: "required",
      why: "**Required, not recommended** — the same as the Nova Sorceress, and for the same reason. You fight surrounded.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Frost Nova from level 6, and the long walk to Cold Mastery at 30.",
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
      ],
      nextUpgrade: "Level 30 for Cold Mastery. The build is genuinely flat until then.",
      notes:
        "Frost Nova is available at 6 but weak, and Cold Mastery is a level 30 skill. Most players level with Ice Blast and Glacial Spike and switch to Frost Nova as the main button around 30. Be clear that those are not the endgame points: neither skill feeds the ring, and the finished plan keeps one point in each.",
    },

    {
      tier: "nightmare",
      goal: "Cold Mastery online and the freeze doing real work.",
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
              why: "A second Spirit — 70% cast rate between them, which is most of the way to a continuous ring.",
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
          picks: [{ ref: { kind: "unique", slug: "frostburn" }, why: "+1 to Cold Skills and a large mana boost, both of which this build uses directly." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest path to 75%." }],
      nextUpgrade: "Life, resistances and cast rate — in that order, because you fight surrounded.",
    },

    {
      tier: "early-hell",
      goal: "105% cast rate, 60% hit recovery, and capped resistances.",
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
                { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances — worth more than usual on a build that fights from the centre." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, magic find and 10% damage reduction. The life is what you are buying." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and resistances." }],
        },
        {
          slot: "ring1",
          picks: [
            {
              label: "Rare ring with 10% Faster Cast Rate, resistances and life",
              why: "Cast rate plus the two things this build is short of.",
              lookFor: ["10% Faster Cast Rate", "Two resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster Hit Recovery and Vitality, both of which matter more here than magic find." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "Hold 75%, and take life over damage." }],
      nextUpgrade: "Nightwing's Veil, and cold facets to socket into it.",
    },

    {
      tier: "budget",
      goal: "Fast Terror Zone and dense-area farming.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "the-oculus" },
              why: "+3 Sorceress skills, 30% cast rate, +20 all resistances and 50% magic find — the resistances matter on a build with no distance.",
              alternatives: [
                { ref: { kind: "unique", slug: "deaths-fathom" }, why: "Up to +30% cold skill damage. The damage option, once your resistances hold without the Oculus." },
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
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, +65 all resistances, 8% damage reduction." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, magic find." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "frostburn" }, why: "+1 Cold Skills." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 all skills and 20% cast rate." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring with 10% Faster Cast Rate and life",
              why: "Clears 105% and carries life.",
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
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Cold skill grand charms with life", why: "Damage and the life a centre-of-the-pack build needs." },
      ],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders. Not optional on this playstyle." }],
      nextUpgrade: "Nightwing's Veil and cold facets, or a Cold Rupture if the Pit and the Worldstone Keep are what you want.",
    },

    {
      tier: "optimized",
      goal: "Cold damage stacked, and a freeze that holds a whole room.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "deaths-fathom" },
              why: "Up to +30% cold skill damage on top of +3 Sorceress skills.",
              lookFor: ["+30% Cold Skill Damage", "sockets for cold facets"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Cast rate and skills." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "nightwings-veil" },
              why: "+2 skills and up to +15% cold skill damage. Its 192 Strength is halved by its own Requirements -50%.",
              lookFor: ["+15% Cold Skill Damage", "2 sockets"],
              alternatives: [
                { ref: { kind: "unique", slug: "harlequin-crest" }, why: "Keep the Shako for the life and damage reduction if you are dying rather than killing slowly." },
              ],
            },
          ],
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
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "frostburn" }, why: "+1 Cold Skills." }],
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
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find, or Sandstorm Trek if hit recovery is still short." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Cold skill grand charms with life", why: "Damage and life." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Cold facets in every socket.",
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
              ref: { kind: "unique", slug: "deaths-fathom" },
              why: "A +30% cold skill damage roll with cold facets socketed.",
              lookFor: ["+30% Cold Skill Damage", "sockets"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% cast rate in a Monarch.", lookFor: ["35% Faster Cast Rate"] }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "nightwings-veil" },
              why: "+15% cold skill damage with two cold facets.",
              lookFor: ["+15% Cold Skill Damage", "2 sockets"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport and magic find per level." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "frostburn" }, why: "+1 Cold Skills." }],
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
        { label: "Cold skill grand charms with life", why: "The rest of the inventory." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "This build finishes cheaply and stays there, which is the honest comparison with the Nova Sorceress it resembles. Frost Nova reaches its ceiling for the price of two Spirits and a Death's Fathom; the lightning Nova needs an Infinity to reach its own. One of those is a far better character. The other is a far better first character.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Act 2 Desert Mercenary with **Might** for damage, an **Insight** for mana, and **Treachery** plus a **Vampire Gaze** to keep him standing — he is in the middle of the pack with you. **Holy Freeze** is the alternative aura and it stacks conceptually with what you are already doing: everything slowed stays inside your ring for longer. Later, an **Infinity** on him is the only real answer to cold immunes short of a Sunder Charm.",

  farming: [
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Enormous density, nothing cold immune, and every cow walks into a ring centred on you. The best thing this build does.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85 and very dense. The freeze is what makes standing in the middle of it survivable.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Dense area level 85, close to a waypoint, and light on cold immunity.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and short, though the rooms are more open than a nova build would like.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Dense and high level. Static Field handles the Seal bosses your ring cannot burst.",
      minTier: "optimized",
      rating: 3,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85, narrow, and its recorded immunities are fire and poison rather than cold. Corridors are where a short-range nova wants to fight, and nothing in this one resists it.",
      minTier: "early-hell",
      rating: 5,
    },
  ],

  immunityPlan:
    "One damage type and no fallback, which is the cost of the build's simplicity. **Cold Mastery reduces enemy cold resistance by 20% at level 1 plus 5% per level**, which keeps the damage relevant against anything resistant but not immune — and that covers most of Hell. Against a true cold immune it does nothing at all, because a mastery is applied after the game has decided the monster is immune, and that step is skipped while the immunity stands. The real answers are a **Cold Rupture** sunder charm at the cost of 70 to 90 points of your own cold resistance, an **Infinity** on the mercenary, or **choosing zones** — and for a build whose best areas are the cow level, the Ancient Tunnels and the Mausoleum, choosing zones is usually enough. The farming list above is ordered with that in mind.",

  hardcoreNotes:
    "Safer than the lightning Nova it resembles, and the difference is the freeze. Everything in your ring stops moving, which converts the most dangerous playstyle in the game into a manageable one — and unlike the Nova Sorceress you keep your shield, because nothing here needs a two-handed weapon. Take Chains of Honor over Enigma, treat 60% Faster Hit Recovery as the hard floor it is listed as, and keep Glacial Spike bound for the moments the ring is not enough.",

  selfFoundNotes:
    "Good, and better than its tier implies for a self-found player. It needs nothing expensive — two Spirits, a Vipermagi and a Shako is a working Hell character — and Cold Mastery means it does not need an Infinity to stay relevant. The self-found weakness is the same as its general one: cold immunes, with no second damage type and no cheap way around them.",

  levelingPath: {
    summary:
      "Awkward, and worth understanding before you commit. Frost Nova is available at **level 6** but stays weak until Cold Mastery, and Cold Mastery is a level 30 skill. It requires nothing else — the wait is character level, not a prerequisite chain — so the honest framing is that you spend twenty-four levels playing a skill that is not yet good. The awkward part is that the skills you level with are not the skills you finish with. Ice Bolt, Ice Blast and Glacial Spike carry you to 30 and then drop to one point each, because Frost Nova's synergies are Blizzard and Frozen Orb and both of those are level 30 skills themselves. Switch to Frost Nova as your main button at 30 and start Blizzard the same day. **A respec is worth taking here**, and the Den of Evil in Nightmare pays for it.",
  },

  confidence: "verified",
  complete: true,
};
