import type { Build } from "@/lib/types";

/**
 * The Meteorb Sorceress — Maxroll publishes it as the Frozen Orb Meteor
 * Sorceress and names "Meteorb Sorc" as the alias.
 *
 * Its entire premise is two damage types, and its entire cost is that neither
 * of them is synergised. Working the point budget out from the game's own
 * prerequisite chains makes that concrete:
 *
 * - Meteor 20, Fire Mastery 20, Frozen Orb 20, Cold Mastery 20 = **80 points**
 * - Fire prerequisites (Fire Bolt, Fire Ball) = 2
 * - Cold prerequisites (Ice Bolt, Ice Blast, Glacial Spike, Blizzard) = 4
 * - Teleport, Warmth, Static Field and defensive utility = 6
 *
 * That is 92 of the 110 a level 99 character has — leaving roughly 18 points
 * for synergies that a specialist spends 40 on. Both halves therefore hit for
 * substantially less than the single-element build they came from, and that
 * trade is the whole page.
 *
 * Verified at Tier 1: Meteor requires level 24 and Fire Mastery 30; Frozen Orb
 * and Cold Mastery both require 30. Fire Mastery raises your damage (30% +7%
 * per level) while **Cold Mastery reduces enemy resistance** (20% +5% per
 * level), which is why the two halves fail in different ways.
 *
 * Both ranked sources place it at B.
 */
export const meteorbSorceress: Build = {
  slug: "meteorb-sorceress",
  name: "Meteorb Sorceress",
  classSlug: "sorceress",
  summary:
    "Fire and cold on the same character, so almost nothing is immune to both. Neither half hits as hard as a specialist's.",
  damageTypes: ["fire", "cold"],
  primarySkill: "frozen-orb",
  playstyle:
    "Lead with whichever element the pack is not resisting. Frozen Orb is the button you hold — it travels, it chills, and it needs no aiming; Meteor is dropped on things that are staying still, and on anything cold immune. The build is never fast, because you are switching rather than committing, and it is never stopped either. If you have ever abandoned a run because everything in the room resisted your one element, this is the build that fixes that specific frustration.",
  strengths: [
    "Two damage types means almost nothing in Hell is immune to both",
    "Frozen Orb chills everything, which is defence as well as damage",
    "**Cold Mastery reduces enemy resistance**, so the cold half keeps working deep into Hell without gear bought for it",
    "Genuinely cheap. It reaches its ceiling without a single high rune",
    "The most forgiving build on the site for a player who does not want to plan around immunity at all",
  ],
  weaknesses: [
    "**Neither half is synergised.** A specialist spends 40 points on synergies; this build has about 18 to split",
    "Both key skills unlock at level 30, and the cold chain to reach Frozen Orb is four prerequisites long",
    "Slower than either parent build at the thing that parent build is for",
    "Fire Mastery raises damage rather than breaking immunity, so the fire half still meets walls",
    "Both ranked sources place it mid-table, and the reason is exactly the trade above",
  ],
  difficulty: "beginner",
  budget: "low",
  ratings: {
    clearSpeed: 3,
    bossing: 3,
    survivability: 4,
    magicFind: 4,
    terrorZones: 4,
    ubers: 1,
    soloSelfFound: 5,
    players8: 3,
  },

  skills: [
    {
      skill: "frozen-orb",
      points: 20,
      role: "main",
      order: 1,
      note: "Level 30. Your default button — it travels, it chills, and it needs no aiming.",
    },
    {
      skill: "cold-mastery",
      points: 20,
      role: "main",
      order: 2,
      note: "**Reduces enemy cold resistance by 20% at level 1 and 5% per level.** This is why the cold half stays useful without synergies behind it, and why it should be maxed before the fire side.",
    },
    {
      skill: "meteor",
      points: 20,
      role: "main",
      order: 3,
      note: "Level 24. The answer to anything cold immune, and to anything standing still.",
    },
    {
      skill: "fire-mastery",
      points: 20,
      role: "main",
      order: 4,
      note: "30% damage at level 1 and +7% per level. It raises the fire half; it does not break fire immunity.",
    },
    { skill: "fire-bolt", points: 1, role: "prerequisite", note: "Meteor's synergy as well as its prerequisite — this is where spare points go if you favour fire." },
    { skill: "fire-ball", points: 1, role: "prerequisite", note: "Meteor's prerequisite, and a faster spell than Meteor for things that move." },
    { skill: "ice-bolt", points: 1, role: "prerequisite", note: "Frozen Orb's synergy as well as the start of its chain — the other place spare points go." },
    { skill: "ice-blast", points: 1, role: "prerequisite", note: "The second Frozen Orb synergy, and the next link in the chain." },
    { skill: "glacial-spike", points: 1, role: "prerequisite", note: "On the way to Blizzard, and a genuine emergency freeze." },
    { skill: "blizzard", points: 1, role: "prerequisite", note: "Frozen Orb's prerequisite. One point, mandatory." },
    { skill: "warmth", points: 1, role: "utility", note: "Mana regeneration from level 1." },
    { skill: "telekinesis", points: 1, role: "prerequisite" },
    { skill: "teleport", points: 1, role: "utility", note: "**One point forever.**" },
    { skill: "static-field", points: 1, role: "utility", note: "Takes 25% of a target's current life — useful on a build whose damage is split." },
    { skill: "frozen-armor", points: 1, role: "utility", note: "Defence and a freeze on attackers." },
    {
      skill: "frost-nova",
      points: 1,
      role: "prerequisite",
      note: "**Blizzard requires Frost Nova and Glacial Spike.** One point.",
    },
    {
      skill: "inferno",
      points: 1,
      role: "prerequisite",
      note: "Blaze's prerequisite, on the chain Meteor needs.",
    },
    { skill: "blaze", points: 1, role: "prerequisite", note: "Fire Wall's prerequisite." },
    {
      skill: "fire-wall",
      points: 1,
      role: "prerequisite",
      note: "**Meteor requires Fire Ball and Fire Wall.** Three points of chain for one skill you never cast — the real cost of the fire half of this build.",
    },
  
  ],
  flexPoints: [
    "**The remaining points are the build's real decision.** Roughly eighteen are left after the four maxed skills and the prerequisites, and they go into synergies for whichever half you actually use more. **Ice Bolt and Ice Blast** raise Frozen Orb; **Fire Bolt** raises Meteor. Splitting them evenly is the one option that is clearly worse than the alternatives.",
    "**Favour cold if you are farming**, because Cold Mastery keeps the cold half relevant without help. Favour fire if you keep meeting cold immunes specifically — the Ancient Tunnels are the obvious case.",
    "**Magic find variant:** the build is cheap enough that the gear budget goes to magic find without costing much. Same skill plan.",
    "**Do not put points in Energy.** Warmth and an Insight mercenary are enough.",
  ],
  stats: {
    strength: "Only what the gear needs, which is very little.",
    dexterity: "None.",
    vitality: "Everything else.",
    energy: "None.",
    notes: [
      "As with the two builds it borrows from, there is no block decision and no weapon requirement — this is one of the simplest stat plans on the site.",
      "A Call to Arms swap is worth more than any Vitality you could buy with the same currency.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 105,
      frames: 8,
      priority: "recommended",
      why: "The standard Sorceress target. Both of this build's spells use it, and so does Teleport.",
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
      why: "The standard Sorceress hit-recovery target.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 30 for both halves. Fire Ball and Ice Blast carry you there.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and up to 35% cast rate at level 25 — and it raises both halves equally, which matters on a split build.",
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
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills, which is worth double here." }],
        },
      ],
      nextUpgrade: "Level 30. Frozen Orb, Cold Mastery and Fire Mastery all arrive within a few levels of each other.",
      notes:
        "**Prefer +all skills over +element gear at every tier.** On a split build, an item that raises one element raises half your damage; an item that raises all skills raises all of it. That single rule explains most of this page's gear choices.",
    },

    {
      tier: "nightmare",
      goal: "Both halves online and nothing in Nightmare stopping you.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills to both halves." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A second Spirit — +4 skills and 70% cast rate between them.",
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
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% cast rate. Its +1 Fire Skills only helps half your damage, which is the trade this build always makes." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest path to 75%." }],
      nextUpgrade: "Decide which half you favour, and spend the spare points there.",
    },

    {
      tier: "early-hell",
      goal: "105% cast rate, capped resistances, and Mephisto on farm.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills to both halves." }],
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
                { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances. On a split build the +2 is worth more than usual." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills to both halves, plus life and magic find." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and resistances — exactly the item a split build wants." }],
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
      charms: [{ label: "Resistance and life small charms", why: "Hold 75%." }],
      nextUpgrade: "+all skills wherever you can find it. It is worth double on this build.",
    },

    {
      tier: "budget",
      goal: "Farm Hell without ever needing to check what resists you.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "**+3 to All Skills**, which on a split build raises both halves — and +40 all resistances on top. The single best weapon this build can hold, and by a wider margin than on a specialist.",
              sockets: "Ko, Vex, Pul, Thul into a 4-socket Flail.",
              alternatives: [
                { ref: { kind: "runeword", slug: "spirit" }, why: "Keep the Spirit until Heart of the Oak exists. Both give skills to both halves." },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills and cast rate." }],
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
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% cast rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "**+1 to All Skills** and 20% cast rate — again, worth double here." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and +30 all resistances." }],
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
        { label: "Hellfire Torch (Sorceress)", why: "**+3 Sorceress skills** — the largest single boost to both halves at once." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Resistance and life small charms", why: "Fill the rest." },
      ],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
      nextUpgrade: "There is not much above this. The build is finished cheaply and stays there.",
    },

    {
      tier: "optimized",
      goal: "Both halves as high as a split build takes them.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "heart-of-the-oak" }, why: "+3 all skills and +40 all resistances." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills and 35% cast rate." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 skills and +65 all resistances.",
              alternatives: [
                { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport with a flat mana cost and magic find per level, at the cost of the resistances." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, magic find, damage reduction." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% cast rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 all skills, 20% cast rate." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills, +30 all resistances." }],
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
        { label: "Life and resistance small charms", why: "Skill charms are element-specific, so general charms often serve this build better." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Nothing structural. At this point the build is what it is going to be.",
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
              why: "A +40 all-resistances roll alongside +3 all skills.",
              lookFor: ["+40 all resistances", "Flail base"],
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
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, socketed with an Um rune for resistances rather than a facet — facets are element-specific and half of yours would be wasted.", lookFor: ["2 sockets"] }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% cast rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 all skills." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills, +30 all resistances." }],
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
        { label: "Life and resistance small charms", why: "The rest of the inventory." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "**Facets are the one place where a split build genuinely loses out.** A cold facet does nothing for Meteor and a fire facet does nothing for Frozen Orb, so half of every socket is wasted. That is why this list reaches for +all skills and resistances where a specialist would reach for element damage — and it is a compact summary of the whole build.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Act 2 Desert Mercenary with **Might**, an **Insight** for mana, and a **Vampire Gaze** to keep him alive. This build needs less from him than most — it already has an answer to almost everything — so put runes into his survivability rather than his damage. **Treachery** is the cheap, correct armour.",

  farming: [
    {
      area: "mephisto",
      difficulty: "hell",
      why: "Not immune to either element, twenty seconds from a waypoint, and an excellent drop table. The obvious home for this build.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and short, and whatever resists one element there does not resist the other.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 and heavily cold immune — which is exactly the zone a split build exists for. Meteor handles what Frozen Orb cannot.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Dense area level 85 near a waypoint.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "countess",
      difficulty: "hell",
      why: "Runes, short, and nothing there stops both halves.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "Short and close to a waypoint. She resists fire, so this is a Frozen Orb run.",
      minTier: "starter",
      rating: 4,
    },
  ],

  immunityPlan:
    "This is the build that exists to make immunity a non-issue, and it mostly succeeds. **Almost nothing in Hell is immune to both fire and cold**, so where a specialist meets a wall this build switches buttons. The two halves fail differently and it is worth knowing how. **Cold Mastery reduces enemy cold resistance** (20% at level 1, +5% per level), so the cold half keeps working against resistant-but-not-immune monsters without any gear bought for it. **Fire Mastery raises your damage instead** (30%, +7% per level), so the fire half meets fire immunity head-on with nothing to soften it. In practice that means Frozen Orb is your default and Meteor is your answer to cold immunes — not the other way round. Sunder Charms are available for either element but this build needs them less than any other on the site, and their 70-to-90-point resistance penalty is a poor trade for a character that already has a second option.",

  hardcoreNotes:
    "A good Hardcore choice for an unusual reason: it never gets into the situation where it cannot kill what is in front of it and has to stand there deciding. Frozen Orb chills, Meteor is cast at range, and Glacial Spike is a genuine emergency freeze for one point. The class caveats apply — smallest life pool, no block, 60% Faster Hit Recovery as a floor — but the build's own risk profile is low. Take Chains of Honor over Enigma.",

  selfFoundNotes:
    "Excellent, and arguably the single best self-found choice on the site for a player who does not want to think about immunity. It needs no expensive item, both halves come online at level 30, and its best-in-slot list is skills and resistances rather than element-specific rarities. The honest caveat is that it is slower than the specialists at everything — you trade clear speed for never being stopped.",

  levelingPath: {
    summary:
      "Level with Fire Ball, which arrives at 12 and is Meteor's prerequisite anyway. The cold side is a longer chain — Ice Bolt to Ice Blast to Glacial Spike to Blizzard before Frozen Orb opens at 30 — but every one of those is a single point except the two that are Frozen Orb's synergies. Meteor arrives at 24, and both masteries at 30, so the build assembles itself over levels 24 to 30. **No respec is required.**",
  },

  confidence: "verified",
  complete: true,
};
