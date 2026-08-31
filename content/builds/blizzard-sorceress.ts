import type { Build } from "@/lib/types";

/**
 * The reference build implementation.
 *
 * Everything about the schema is exercised here: the six-tier gear progression,
 * slot-level alternatives, breakpoint targets with reasoning, farming
 * recommendations gated by gear tier, and explicit self-found / Hardcore notes.
 *
 * Cross-checked against Maxroll, D2Runewizard and DiabloBytes build guides.
 * See `docs/research/06-blizzard-sorceress.md`.
 */
export const blizzardSorceress: Build = {
  slug: "blizzard-sorceress",
  name: "Blizzard Sorceress",
  classSlug: "sorceress",
  summary:
    "The reference magic-find farmer. Native Teleport, huge cold burst, and a Hell-capable setup that costs four common runes.",
  damageTypes: ["cold"],
  primarySkill: "blizzard",
  playstyle:
    "You teleport into a room, drop a Blizzard slightly ahead of where the monsters are heading, and teleport out while it kills them. Glacial Spike covers Blizzard's cooldown and freezes anything that gets close. You are never in melee range, you never tank anything, and if a pack looks dangerous you simply leave. The whole build is built on the idea that you choose which fights happen.",
  strengths: [
    "Teleport from level 18 — no Enigma required, ever",
    "Genuinely Hell-viable on a Spirit sword, Stealth and a Lore helm",
    "Blizzard's freeze and chill make it the safest strong farming skill in the game",
    "The best magic-find farmer in D2R, and the standard first character of a ladder season",
    "Every core item is cheap and self-findable",
  ],
  weaknesses: [
    "Cold immunes are a hard wall without a Sunder Charm, Infinity, or a Might mercenary",
    "Blizzard has a fixed cooldown that no amount of Faster Cast Rate reduces",
    "Lowest life pool in the game — one bad Teleport can end a Hardcore character",
    "Damage is entirely front-loaded into one element",
  ],
  difficulty: "beginner",
  budget: "low",
  ratings: {
    clearSpeed: 4,
    bossing: 4,
    survivability: 3,
    magicFind: 5,
    terrorZones: 4,
    ubers: 1,
    soloSelfFound: 5,
    players8: 3,
  },

  skills: [
    { skill: "blizzard", points: 20, role: "main", order: 1, note: "Max first, always." },
    {
      skill: "glacial-spike",
      points: 20,
      role: "synergy",
      order: 2,
      note: "+5% Blizzard damage per level, and it is the skill you actually cast during the cooldown.",
    },
    {
      skill: "ice-blast",
      points: 20,
      role: "synergy",
      order: 3,
      note: "+5% Blizzard damage per level. Also a usable single-target filler.",
    },
    {
      skill: "ice-bolt",
      points: 20,
      role: "synergy",
      order: 4,
      note: "+5% Blizzard damage per level. You will never cast it.",
    },
    {
      skill: "cold-mastery",
      points: 1,
      role: "main",
      order: 5,
      note: "One hard point early, then dump leftovers here at the very end. See the note below — this is the most misunderstood part of the build.",
    },
    { skill: "teleport", points: 1, role: "utility", note: "One point. Never more." },
    { skill: "telekinesis", points: 1, role: "prerequisite", note: "Teleport prerequisite. Also picks up potions at range." },
    { skill: "static-field", points: 1, role: "utility", note: "Softens cold immunes for your mercenary. Ignores resistance." },
    { skill: "frozen-armor", points: 1, role: "utility", note: "Free defence and it freezes melee attackers." },
    { skill: "warmth", points: 1, role: "utility", note: "Mana regeneration from level 1. Costs nothing." },
    { skill: "frost-nova", points: 1, role: "prerequisite" },
    { skill: "frozen-orb", points: 1, role: "utility", note: "Not a prerequisite for anything here — Cold Mastery requires nothing. Take the point because a travelling orb covers what Blizzard's ground placement cannot." },

  ],
  flexPoints: [
    "Every point after the four maxed skills goes into Cold Mastery.",
    "Do not put points into Energy Shield unless you are deliberately building around it — the mana investment competes directly with the life you need.",
    "Some players keep 5-10 points in Frozen Orb as a no-cooldown backup. It is a legitimate choice, and it costs Blizzard damage.",
  ],

  stats: {
    strength: "Only enough to wear your gear. Nothing more, ever.",
    dexterity: "Base. Leave it alone unless you are deliberately building max block.",
    vitality: "Every single remaining point.",
    energy: "None. Zero. Not one point.",
    notes: [
      "The Sorceress gains 2 life per point of Vitality — the lowest in the game — which is exactly why every spare point must go there.",
      "Energy is a trap. Warmth, an Insight mercenary and mana potions cover everything, and mana does not stop you dying.",
      "Strength is the only judgement call. A Monarch base for a Spirit shield needs 156 Strength, which is roughly 60 stat points — a very large investment. Most players postpone the Spirit shield until Nightwing's Veil (Requirements -50%), Sandstorm Trek (+15 Strength) or an Enigma (+0.75 Strength per level) pay for it instead.",
      "With a Call to Arms Battle Orders buff, aim for 1200-1800 life before you take Hell seriously.",
    ],
  },

  breakpoints: [
    {
      stat: "fcr",
      value: 105,
      frames: 8,
      priority: "required",
      why: "The defining breakpoint of the build. It governs Teleport speed as much as cast speed, so it determines how fast you actually farm. Everything in the gear plan is arranged around reaching it.",
    },
    {
      stat: "fcr",
      value: 63,
      frames: 9,
      priority: "recommended",
      why: "A realistic intermediate target while levelling. Spirit sword (35) plus Magefist (20) plus almost any FCR ring gets you here before Hell.",
    },
    {
      stat: "fcr",
      value: 200,
      frames: 7,
      priority: "luxury",
      why: "The final breakpoint. It requires giving up too much elsewhere to be worth chasing on most setups, and there is no benefit at all above 200.",
    },
    {
      stat: "fhr",
      value: 60,
      frames: 8,
      priority: "recommended",
      why: "The Sorceress FHR table is punishing. 60% is the practical target — being stun-locked is one of the main ways a Sorceress dies.",
    },
    {
      stat: "fhr",
      value: 30,
      frames: 10,
      priority: "recommended",
      why: "A reasonable minimum while levelling. Stealth alone gives 25%.",
    },
  ],

  immunityPlan:
    "Cold Mastery does not break immunity — against a cold-immune monster it operates at one fifth effectiveness and cannot bring resistance below 100%. Your options, in order of practicality: skip the pack and teleport past it; let a Might-aura mercenary kill it with physical damage; use Static Field to strip its current life down toward the Hell floor of 50% so the mercenary finishes it faster; carry a Cold Rupture sunder charm, which sets cold-immune monsters to 95% cold resistance and turns them into ordinary targets; or run an Infinity mercenary, whose Conviction aura breaks many but not all cold immunities. Early on, skipping is the correct answer far more often than players expect.",

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Hire an Act 2 Nightmare mercenary with the Might aura. Might raises his physical damage, which is what actually kills the cold immunes you cannot touch. Give him an Insight the moment you can — Meditation ends your mana problems permanently. Holy Freeze is the alternative pick and is the better choice in Hardcore, at the cost of killing immunes more slowly.",

  gearSets: [
    // -----------------------------------------------------------------------
    {
      tier: "starter",
      goal: "Get through Normal and reach level 25 with enough damage to keep moving.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "The single biggest power spike available to a fresh character. +2 skills and up to 35% Faster Cast Rate at level 25, from four runes the Countess drops in Normal.",
              sockets: "Tal, Thul, Ort, Amn — in that order — into a 4-socket Crystal Sword.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "leaf" },
                  why: "If you levelled as a Fire Sorceress, Leaf carries you to 25. Two runes, level 19.",
                },
                {
                  label: "Any staff or orb with +Blizzard or +cold skills",
                  why: "Shop Drognan and Akara constantly. A staff with +3 Blizzard is worth more than most uniques at this stage.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "Three Countess runes for near-max resistances. This is what gets you through the Nightmare resistance penalty.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "rhyme" },
                  why: "Two runes for +25 all resistances, Cannot Be Frozen and 25% magic find.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "25% Faster Cast Rate, 25% Faster Run/Walk and 25% Faster Hit Recovery for two of the most common runes in the game. Make this the moment you hit level 17.",
              sockets: "Tal then Eth, into any 2-socket body armor. A Breast Plate is ideal.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "lore" },
              why: "+1 to All Skills for two common runes at level 27.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "tarnhelm" },
                  why: "+1 skills and up to 50% magic find at level 15, if you find or gamble one earlier.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "magefist" },
              why: "20% Faster Cast Rate at level 23, and it costs nothing. Gamble for these.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              label: "Any magic or rare ring with Faster Cast Rate",
              why: "10% FCR rings are cheap and push you toward the 63% breakpoint.",
              lookFor: ["10% Faster Cast Rate", "Resistances", "Mana"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              label: "Any belt with 16 slots (a Belt or better)",
              why: "Potion slots matter more than stats at this stage. Upgrade from the 8-slot Sash as soon as possible.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              label: "Any boots with Faster Run/Walk and resistances",
              why: "You still walk a lot before Teleport at 18. Resistances matter more after.",
            },
          ],
        },
      ],
      nextUpgrade:
        "Get to level 25 and make a Spirit sword. Then farm the Countess in Nightmare for the runes for an Insight on your mercenary.",
      notes:
        "Do not level as a Blizzard Sorceress. Blizzard is not available until level 24 and is weak until its synergies are in. Level with Fire (Fire Bolt into Fire Ball) or Lightning (Charged Bolt into Nova), then respec at 24-30 using the Den of Evil token.",
    },

    // -----------------------------------------------------------------------
    {
      tier: "nightmare",
      goal: "Clear Nightmare comfortably and get resistances under control before Hell.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Still correct. There is no reason to replace a Spirit sword until you can afford an Oculus or a Heart of the Oak.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "the-oculus" },
                  why: "+3 Sorceress skills, 30% FCR, +20 all resistances and 50% magic find at level 42. A large upgrade if you find one.",
                },
                {
                  ref: { kind: "runeword", slug: "memory" },
                  why: "+3 Sorceress skills and 33% FCR, if you would rather have raw skills than a shield.",
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
              why: "A second Spirit, this time in a shield. +4 skills total across both slots is enormous.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket Monarch.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "rhyme" },
                  why: "If 156 Strength for a Monarch is too expensive right now — and it usually is — Rhyme in a light shield is the sensible interim.",
                },
                {
                  ref: { kind: "runeword", slug: "ancients-pledge" },
                  why: "Still perfectly serviceable if resistances are your problem.",
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
              why: "+1 skills, 30% Faster Cast Rate and up to +35 all resistances at only 43 Strength. The best budget caster armor in the game and a straight upgrade over Stealth.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "smoke" },
                  why: "+50 all resistances if resistances are the bottleneck and you can live without the FCR.",
                },
                {
                  ref: { kind: "runeword", slug: "stealth" },
                  why: "Still fine. Do not spend runes replacing it until you have something genuinely better.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "lore" },
              why: "Still fine.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "harlequin-crest" },
                  why: "+2 skills, life, mana, 50% magic find and 10% damage reduction. If you find a Shako, wear it immediately.",
                },
              ],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "Any amulet with +2 Sorceress Skills",
              why: "+2 class skills is the single most valuable amulet affix. A magic amulet with nothing else is still worth wearing.",
              lookFor: ["+2 Sorceress Skill Levels", "Faster Cast Rate", "Resistances"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "magefist" },
              why: "Still the correct answer. 20% FCR for free.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              label: "Rare or magic ring: 10% FCR with resistances",
              why: "Two 10% FCR rings plus Spirit sword, Spirit shield and Magefist puts you at 100% — just short of the 105% breakpoint, which one more source closes.",
              lookFor: ["10% Faster Cast Rate", "+Life", "Resistances"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              label: "Rare boots: Faster Run/Walk, Faster Hit Recovery, resistances",
              why: "The cheapest place to pick up the Faster Hit Recovery you need for the 60% breakpoint.",
              lookFor: ["30% Faster Run/Walk", "Faster Hit Recovery", "Two resistances"],
            },
          ],
        },
      ],
      nextUpgrade:
        "A second Spirit in a Monarch shield, and resistances at or near 75% in all four elements before you enter Hell.",
      notes:
        "Nightmare applies a -40% penalty to all your resistances, and Hell applies -100%. Plan for the Hell penalty *now* — arriving in Hell with 40% fire resistance means you are actually at -60%.",
    },

    // -----------------------------------------------------------------------
    {
      tier: "early-hell",
      goal: "Survive Hell Act 1-3 and start farming Mephisto and Andariel for real upgrades.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "the-oculus" },
              why: "+3 skills, 30% FCR, +20 all resistances and 50% magic find. The classic early-Hell magic-find weapon.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "spirit" },
                  why: "A Spirit sword remains genuinely competitive. The Oculus wins on magic find and resistances, not on damage.",
                },
              ],
              tradeOnly: false,
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Spirit Monarch. By now Sandstorm Trek or a Strength charm should make the 156 Strength affordable.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "Still excellent. 30% FCR in the armor slot is hard to replace cheaply.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "+2 skills, +1.5 life per level, 50% magic find and 10% damage reduction. The best all-round helm in the game and very findable.",
              sockets: "A perfect topaz for magic find, or an Um rune for resistances.",
              alternatives: [
                { ref: { kind: "runeword", slug: "lore" }, why: "Still works. Upgrade when you find a Shako." },
              ],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              label: "Rare belt with life, Faster Hit Recovery and resistances",
              why: "Arachnid Mesh requires level 80, so a good rare belt bridges the gap.",
              lookFor: ["+Life", "Faster Hit Recovery", "Two resistances", "16 slots"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "sandstorm-trek" },
              why: "20% Faster Hit Recovery, +10-15 Strength (which helps pay for the Monarch) and huge poison resistance.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "war-traveler" },
                  why: "Up to 50% magic find, at the cost of 95 Strength. Choose these only on a dedicated magic-find setup.",
                },
              ],
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "stone-of-jordan" },
              why: "+1 skills and +25% maximum mana. Never sell one to a vendor by accident — it advances Diablo Clone.",
              alternatives: [
                { label: "Rare 10% FCR ring with resistances", why: "Cheaper, and often better if you need the FCR breakpoint." },
              ],
            },
          ],
        },
      ],
      charms: [
        {
          label: "Small charms with resistances",
          why: "The cheapest resistance in the game. A row of +11 resistance small charms fixes a lot of problems.",
        },
        {
          label: "Cold Skill grand charms",
          why: "+1 Cold Skills each. Directly multiplies Blizzard damage. Look for ones with life attached.",
        },
      ],
      nextUpgrade:
        "Reach 105% Faster Cast Rate. Then farm Mephisto and Andariel until a Nightwing's Veil, a Death's Fathom or the runes for a Heart of the Oak turn up.",
      notes:
        "This is the tier where most characters stall, and the reason is almost always resistances rather than damage. Get all four to 75% before you worry about your weapon.",
    },

    // -----------------------------------------------------------------------
    {
      tier: "budget",
      goal: "A complete, self-found Hell farming setup at 105% Faster Cast Rate.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "the-oculus" },
              why: "30% FCR and 50% magic find. Combined with Spirit shield (35), Magefist (20) and a 10% FCR ring, you reach 95 — one more 10% source closes the 105 breakpoint.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "heart-of-the-oak" },
                  why: "+3 skills, 40% FCR and up to +40 all resistances. The single largest quality-of-life upgrade in the build, and it makes hitting 105% trivial.",
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
              why: "Spirit Monarch. +2 skills and 35% FCR from four Normal-difficulty runes.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "Still holding its own at this tier. 30% FCR and resistances at 43 Strength.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "+2 skills and +65 all resistances. Expensive (Ber and Ist), and it frees up every other slot to chase damage instead of resistances.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "The all-round pick: skills, life, magic find and damage reduction.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "nightwings-veil" },
                  why: "+2 skills and up to +15% Cold Skill Damage. More damage, less magic find and no damage reduction.",
                },
              ],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 all skills and up to +30 all resistances. Simple and very hard to beat.",
              alternatives: [
                {
                  label: "Crafted or rare amulet: +2 Sorceress Skills with 10-20% Faster Cast Rate",
                  why: "Mara's has no FCR at all. An amulet with +2 skills *and* FCR can be worth more if your breakpoint is tight.",
                  lookFor: ["+2 Sorceress Skill Levels", "10-20% Faster Cast Rate", "Life", "Resistances"],
                },
              ],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "arachnid-mesh" },
              why: "The only belt with both +1 skills and 20% Faster Cast Rate. Requires level 80.",
              alternatives: [
                { label: "Rare belt with life, FHR and resistances", why: "Only 12 potion slots on Arachnid Mesh — a good rare belt is a defensible choice." },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "magefist" },
              why: "20% FCR. Still, after eighty levels, one of the best value items you own.",
              alternatives: [
                { label: "Trang-Oul's Claws", why: "20% FCR and +25% cold resistance. A straight upgrade over Magefist if you have the set piece." },
              ],
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "sandstorm-trek" },
              why: "Faster Hit Recovery, Strength and poison resistance.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "stone-of-jordan" },
              why: "+1 skills, +25% maximum mana.",
            },
          ],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: 10% Faster Cast Rate with resistances and life",
              why: "This is nearly always the slot that closes the 105% breakpoint.",
              lookFor: ["10% Faster Cast Rate", "Two resistances", "+Life", "+Mana"],
            },
          ],
        },
      ],
      charms: [
        { label: "Cold Skill grand charms with life", why: "+1 Cold Skills each. The best damage-per-inventory-square available." },
        { label: "Resistance small charms", why: "Fill the gaps in your resistances so your gear can chase damage." },
        { label: "Annihilus", why: "+1 all skills, +10-20 all attributes, +10-20 all resistances. From Uber Diablo." },
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills and +10-20 all resistances. From Uber Tristram." },
        {
          label: "Cold Rupture (Sunder Charm)",
          why: "Sets cold-immune monsters to 95% cold resistance. This is what lets a Blizzard Sorceress farm anywhere instead of only in cold-friendly zones. Note Patch 3.3 raised the Latent Sunder Charm minimum drop level to 75 and restricted magic-find drops to Hell.",
        },
      ],
      weaponSwap: [
        {
          ref: { kind: "runeword", slug: "call-to-arms" },
          why: "Battle Orders in the swap slot is roughly a 40% life increase. Cast Battle Command twice, then Battle Orders, then swap back. Pair it with a Spirit or Lidless Wall in the off-hand for the +skills.",
        },
      ],
      nextUpgrade:
        "A Death's Fathom or a Heart of the Oak, then Nightwing's Veil. Those three are the difference between a good Blizzard Sorceress and a finished one.",
    },

    // -----------------------------------------------------------------------
    {
      tier: "optimized",
      goal: "Near-maximum damage while keeping magic find and resistances intact.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "deaths-fathom" },
              why: "+3 Sorceress skills and up to +30% Cold Skill Damage — the largest single damage source in the build.",
              sockets: "A Cold Rainbow Facet. Prioritise the -enemy cold resistance roll over the +cold damage roll.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "heart-of-the-oak" },
                  why: "40% FCR against Death's Fathom's 20%, plus up to +40 all resistances. Less damage, far easier breakpoints. A completely legitimate endgame choice.",
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
              why: "Spirit Monarch remains best-in-slot for most setups. +2 skills and 35% FCR is not beatable at any price for a caster.",
              alternatives: [
                {
                  label: "Monarch with 4 Cold Rainbow Facets",
                  why: "Maximum cold damage, at the cost of Spirit's +2 skills and 35% FCR. Only correct if your FCR breakpoint is covered elsewhere.",
                },
                {
                  ref: { kind: "unique", slug: "stormshield" },
                  why: "35% damage reduction and huge block. A Hardcore choice — it costs a great deal of damage.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "nightwings-veil" },
              why: "+2 skills and up to +15% Cold Skill Damage. Requirements -50% makes its 192 Strength cost only 96 in practice.",
              sockets: "A Cold Rainbow Facet.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "harlequin-crest" },
                  why: "Trade damage for 50% magic find, +1.5 life per level and 10% damage reduction. On a magic-find setup this is the better helm.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 skills and +65 all resistances. The resistances free every other slot to chase damage.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "ormus-robes" },
                  why: "Only if it rolled +3 Blizzard. That specific roll is one of the biggest damage upgrades in the build; any other roll makes it a mediocre armor.",
                },
                {
                  ref: { kind: "runeword", slug: "enigma" },
                  why: "Less useful on a Sorceress than on any other class — she already has Teleport. Still valuable for +2 skills, the Strength bonus and the level-scaled magic find.",
                },
              ],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 skills and up to +30 all resistances.",
              alternatives: [
                { label: "Crafted caster amulet: +2 Sorceress Skills, 20% FCR, life, mana", why: "Beats Mara's when you need the FCR." },
              ],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and 20% FCR. Effectively mandatory here." }],
        },
        {
          slot: "gloves",
          picks: [
            { label: "Trang-Oul's Claws", why: "20% FCR and +25% cold resistance." },
            { ref: { kind: "unique", slug: "magefist" }, why: "20% FCR. Still perfectly good." },
          ],
        },
        {
          slot: "boots",
          picks: [
            { ref: { kind: "unique", slug: "sandstorm-trek" }, why: "FHR, Strength and poison resistance." },
            {
              label: "Rare boots: FHR, Faster Run/Walk and two resistances",
              why: "A well-rolled rare can beat any unique here.",
              lookFor: ["Faster Hit Recovery", "30% Faster Run/Walk", "Two high resistances"],
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills, +25% maximum mana." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: 10% FCR, resistances, life, mana",
              why: "Whatever closes your 105% breakpoint and patches your worst resistance.",
              lookFor: ["10% Faster Cast Rate", "+Life", "Two resistances"],
            },
          ],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills, all attributes, all resistances." },
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills and +10-20 all resistances." },
        { label: "Cold Skill grand charms with life", why: "As many as your inventory allows." },
        { label: "Cold Rupture (Sunder Charm)", why: "Removes the build's only real weakness. Carry it when farming immune-heavy zones and swap it out when not." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders. Roughly +40% life and mana." },
        { label: "Lidless Wall or a Spirit in the swap off-hand", why: "More +skills means a higher Battle Orders level from the same Call to Arms." },
      ],
      nextUpgrade:
        "An Infinity on the mercenary. It is the last meaningful upgrade — Conviction lowers cold resistance further and breaks many cold immunities outright.",
    },

    // -----------------------------------------------------------------------
    {
      tier: "bis",
      goal: "Absolute maximum. Every slot optimised for damage, with resistances held at cap.",
      levelRange: [90, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "deaths-fathom" },
              why: "A 30% Cold Skill Damage roll, socketed with a -5% enemy cold resistance Rainbow Facet.",
              sockets: "Cold Rainbow Facet, prioritising the -enemy cold resistance roll.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A 35% FCR roll in a Monarch. Nothing has displaced it in twenty years.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "nightwings-veil" },
              why: "A 15% Cold Skill Damage roll, socketed with a Cold Rainbow Facet.",
              sockets: "Cold Rainbow Facet.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 skills, +65 all resistances, 8% damage reduction. The resistances are what make a full-damage setup possible everywhere else.",
              alternatives: [
                { ref: { kind: "unique", slug: "ormus-robes" }, why: "Only with a +3 Blizzard roll, and only if your resistances are covered without Chains of Honor." },
              ],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "Crafted caster amulet: +2 Sorceress Skills, 20% FCR, +life, +mana",
              why: "The one slot where a crafted item genuinely beats every unique, because it can carry skills and FCR together.",
              lookFor: ["+2 Sorceress Skill Levels", "20% Faster Cast Rate", "+Life", "+Mana"],
            },
            { ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "The reliable alternative if the craft never lands." },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% FCR." }],
        },
        {
          slot: "gloves",
          picks: [{ label: "Trang-Oul's Claws", why: "20% FCR and +25% cold resistance." }],
        },
        {
          slot: "boots",
          picks: [
            {
              label: "Rare boots: 30% FRW, Faster Hit Recovery, two high resistances",
              why: "A perfect rare beats every unique boot for a caster.",
              lookFor: ["Faster Hit Recovery", "30% Faster Run/Walk", "Two resistances at 30%+"],
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: 10% FCR, +life, two resistances",
              why: "Tuned to close the 105% breakpoint exactly, with nothing wasted.",
            },
          ],
        },
      ],
      charms: [
        { label: "Annihilus (20/20/20)", why: "+1 all skills, +20 all attributes, +20 all resistances." },
        { label: "Hellfire Torch (Sorceress, 3/20/20)", why: "+3 Sorceress skills." },
        { label: "9 x Cold Skill grand charms with 40+ life", why: "+9 Cold Skills and around 400 life." },
        { label: "Cold Rupture (Sunder Charm)", why: "Swapped in for immune-heavy content." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, cast after two Battle Commands." },
        { label: "Spirit Monarch (swap)", why: "More +skills for a higher Battle Orders level." },
      ],
      nextUpgrade:
        "Nothing in your own gear. From here the upgrades are on the mercenary (Infinity, Fortitude, Andariel's Visage) and in charm rolls.",
      notes:
        "Even at best-in-slot, keep resistances at 75%. A dead Sorceress with perfect damage kills nothing.",
    },
  ],

  farming: [
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 with essentially no cold immunes in the base population. This is the natural home of the build and where most Blizzard Sorceresses spend their time.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "mephisto",
      difficulty: "hell",
      why: "Monster level 87 despite an area level of 83, a twenty-second route, and he is not cold immune. The moat trick makes it nearly risk-free.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "The shortest boss route in the game and she is not cold immune. Lower ceiling than Mephisto but higher volume.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "mephisto",
      difficulty: "nightmare",
      why: "Safe, fast, and drops enough to bootstrap a character that is not yet ready for Hell. The standard target while you fix resistances.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Area level 85 and very dense. Fire and lightning immunes are everywhere here, which a cold build simply ignores.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "countess",
      difficulty: "nightmare",
      why: "Where the runes for Insight, Spirit and Lore come from. Run it until your runewords are made, then stop.",
      minTier: "starter",
      rating: 4,
    },
    {
      area: "lower-kurast",
      difficulty: "hell",
      why: "Chest running needs no gear and no damage. A genuine option for a character that cannot yet fight in Hell.",
      minTier: "nightmare",
      rating: 3,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and dense, but it does contain cold immunes — bring a Might mercenary or a Cold Rupture.",
      minTier: "budget",
      rating: 3,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85, safe, and reachable in seconds. Underrated.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Ten-second runs at monster level 86. He is cold immune, so your mercenary does the work — or bring a Cold Rupture.",
      minTier: "budget",
      rating: 3,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Where you level from 90 to 99. Every immunity type appears, so this is Sunder Charm territory.",
      minTier: "optimized",
      rating: 3,
    },
  ],

  levelingPath: {
    summary:
      "Do not level as Blizzard. Blizzard unlocks at 24 and is weak until its three synergies are in, which is another 60 skill points away. Level with Fire (Fire Bolt, then Fire Ball at 12) or Lightning (Charged Bolt, then Nova at 12), then respec into Blizzard once you have the points to make it work.",
    respecAt:
      "Level 24-30, using the free respec from the Den of Evil quest. Many players wait until Nightmare and use the Normal token, keeping the other two in reserve.",
  },

  selfFoundNotes:
    "This build is designed for self-found play. Spirit, Stealth, Lore, Ancient's Pledge and Insight are all made from runes the Countess drops in Normal and Nightmare, and none of them need trading. Skin of the Vipermagi, Harlequin Crest, The Oculus and Stone of Jordan are all realistically findable. The only genuinely trade-dependent items are Death's Fathom, Nightwing's Veil and the high runes for Chains of Honor — and the build farms perfectly well without them.",

  hardcoreNotes:
    "Viable, but respect the fragility. Take Holy Freeze on the mercenary instead of Might — the chill is worth more than the damage when a mistake is permanent. Avoid The Oculus: its 25% chance to cast Teleport when struck can drop you into the middle of a pack with no warning, which is exactly how Hardcore Sorceresses die. Prioritise Faster Hit Recovery and maximum life over damage at every tier, keep resistances at 75% rather than 'good enough', and treat any pack you cannot identify as a reason to leave the area.",

  modes: {},
  confidence: "verified",
  complete: true,
};
