import type { Build } from "@/lib/types";

/**
 * The Rabies Druid — one bite, and then the pack.
 *
 * Four facts, and every one of them changes how the build is played rather
 * than only how it is geared.
 *
 *   **The poison spreads.** One bitten monster infects the ones around it,
 *   which is what turns a single-target melee attack into a clear skill and is
 *   the entire argument for the build. It is also why the correct play is one
 *   bite per pack rather than one bite per monster.
 *
 *   **The number is a total, not a rate.** Every poison figure this site
 *   publishes is the whole amount dealt across the poison's life —
 *   `damageAtLevel` multiplies the per-frame value by the duration precisely so
 *   the published number is the one the game shows. Rabies at twenty hard
 *   points is 924–996 across 290 frames, which is eleven and a half seconds,
 *   and reading that as a per-second figure overstates it by that factor.
 *
 *   **Poison Creeper is its only synergy, at 20% a hard point — and the
 *   synergy does not require the vine.** Synergies read hard points, not
 *   whether the skill is active, so the twenty points buy Rabies' damage
 *   whether or not Poison Creeper is the vine you have out. Only one vine can
 *   be summoned at a time, so the vine you actually summon is Carrion Vine,
 *   for the healing.
 *
 *   **Poison has no mastery anywhere in the game.** There is no Cold Mastery
 *   equivalent, no aura that lowers poison resistance, and Conviction does not
 *   touch it. The ceiling is lower than a fire or cold build's and it is
 *   reached earlier, which is the honest reason this build is niche.
 */
export const rabiesDruid: Build = {
  slug: "rabies-druid",
  name: "Rabies Druid",
  classSlug: "druid",
  summary:
    "A werewolf whose bite is contagious: infect one monster in a pack and the poison finds the rest while you walk to the next one.",
  damageTypes: ["poison", "physical"],
  primarySkill: "rabies",
  playstyle:
    "You shift, run into a pack, bite one thing, and leave. The poison spreads from whatever you bit to everything near it, so the pack dies behind you while you are already infecting the next one — the build is played as a route rather than as a series of fights. Feral Rage is the other half of the rhythm: its charges buy movement speed and steal life, so you use it to travel and to top up between packs. What you must not do is keep biting the same monster. Poison from one source does not stack with itself; a second bite restarts the clock rather than adding a second dose, so every extra bite on an infected target is damage you did not deal somewhere else.",
  strengths: [
    "The poison spreads, which is the only melee attack in the class that clears a pack from one hit",
    "Weapon damage lands in full alongside the poison — the bite is not weakened to pay for it",
    "Very cheap to reach: the whole engine is twenty points in a level-18 skill and twenty in a level-1 vine",
    "Poison ignores physical immunity entirely, and physical immunity is what stops the other melee Druids",
    "Feral Rage's charges make it the fastest-moving shapeshifter, which is what a route-based build wants",
  ],
  weaknesses: [
    "**Poison has no mastery anywhere in the game**, so the damage ceiling is low and is reached early",
    "Nothing kills quickly — the poison runs for eleven seconds and a boss simply waits it out",
    "Poison immunity is common in exactly the undead-heavy zones melee builds otherwise like",
    "Biting an already-infected monster restarts its poison instead of adding to it, so damage is easy to waste",
    "No published attack-speed breakpoints exist for either wereform, so gear cannot be planned to a frame",
  ],
  difficulty: "advanced",
  budget: "medium",
  ratings: {
    clearSpeed: 4,
    bossing: 1,
    survivability: 4,
    magicFind: 2,
    terrorZones: 3,
    ubers: 1,
    soloSelfFound: 3,
    players8: 3,
  },

  skills: [
    {
      skill: "rabies",
      points: 20,
      role: "main",
      order: 1,
      note: "924–996 poison at twenty hard points, dealt across 290 frames — eleven and a half seconds — rather than on the hit. The weapon's full damage lands with it.",
    },
    {
      skill: "poison-creeper",
      points: 20,
      role: "synergy",
      order: 2,
      note: "**Rabies' only synergy, at 20% a hard point — so twenty points here is +400%.** Synergies read hard points rather than whether a skill is active, which means these twenty work while a different vine is the one you summoned.",
    },
    {
      skill: "werewolf",
      points: 20,
      role: "main",
      order: 3,
      note: "Attack speed, which on this build is packs infected per minute rather than damage per swing. The bonus climbs from 10% toward a ceiling of 80% on a diminishing curve.",
    },
    {
      skill: "lycanthropy",
      points: 20,
      role: "main",
      order: 4,
      note: "+115% life. A build that runs into the middle of a pack to bite one monster needs it more than it looks.",
    },
    {
      skill: "heart-of-wolverine",
      points: 20,
      role: "utility",
      order: 5,
      note: "+158% attack rating, and that is why it is here rather than for the +153% enhanced damage. A bite that misses infects nothing at all, and the whole build rests on the first bite landing.",
    },
    {
      skill: "feral-rage",
      points: 1,
      role: "prerequisite",
      note: "Required for Rabies, and the build's travel button: charges buy movement speed climbing toward 70% and steal life on every hit. You will press it as often as you press Rabies.",
    },
    {
      skill: "carrion-vine",
      points: 1,
      role: "utility",
      note: "**This is the vine you actually summon.** It heals you for 4% of each corpse plus 1% per level, and taking it costs nothing — Poison Creeper's twenty points keep feeding Rabies from the skill tree regardless of which vine is out.",
    },
    { skill: "oak-sage", points: 1, role: "prerequisite", note: "Required for Heart of Wolverine and the wolves." },
    { skill: "raven", points: 1, role: "prerequisite" },
    { skill: "summon-spirit-wolf", points: 1, role: "prerequisite" },
    { skill: "summon-dire-wolf", points: 1, role: "prerequisite" },
    {
      skill: "summon-grizzly",
      points: 1,
      role: "utility",
      note: "The bear holds the pack together while the poison works, which matters more here than on any other Druid: a scattered pack is a pack the infection does not reach across.",
    },
  ],
  flexPoints: [
    "Three points are spare. **Feral Rage** is the best home for them — more charges is more movement speed and more life stolen, and it is the skill this build presses between every pack.",
    "**Hunger costs three points from here** (Werebear, Maul, Fire Claws) and is not worth them on a build that already leeches through Feral Rage.",
    "**Do not put points in Fury.** It is the same prerequisite chain and it is a different character: Fury is five attack rolls on one target, and this build's whole design is one attack roll on one target per pack.",
    "**Solar Creeper and Poison Creeper are the same slot.** Taking the mana vine means giving up the healing, and neither changes the twenty hard points that feed Rabies.",
  ],
  stats: {
    strength: "Enough for your gear. There is no heavy weapon to qualify for.",
    dexterity: "Enough for the weapon.",
    vitality: "Everything else.",
    energy: "None. Rabies costs ten mana and Feral Rage three.",
    notes: [
      "**Weapon damage matters less here than on any other melee Druid, and attack rating matters more.** The poison is a fixed quantity per infection, so the swing that lands is worth far more than the swing that hits hard — and a swing that misses infects nothing.",
      "Faster run/walk is a damage stat on this build in a way it is on no other, because clear speed is how quickly you reach the next pack rather than how quickly the current one dies.",
      "Life is bought the same way as on every shapeshifter: Vitality multiplied by Lycanthropy's +115%.",
      "Poison length reduction on *your* gear is a defensive stat and does nothing for your own poison. It is worth having anyway in the areas this build is good at.",
    ],
  },
  breakpoints: [],
  breakpointNotes:
    "**Empty, like the other shapeshifting Druids.** Werewolf does not use the human-form frame tables — the site publishes a separate werewolf cast-rate table and says so — and no wereform hit-recovery or attack-speed table exists at a source tier this project accepts. Attack speed is worth buying here, but it buys packs infected per minute rather than damage per hit, and it is bought continuously rather than to a threshold. **Faster run/walk is the stat this build would put in a table if run speed had breakpoints.** It does not; it is linear, and there is nothing to aim at.",

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 18 and Rabies. Before that you are a werewolf with a bite and no reason to be one.",
      levelRange: [1, 40],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "steel" },
              why: "Attack speed and attack rating for two of the cheapest runes in the game. Attack rating is the stat this build never has enough of, from level 18 to level 99.",
              sockets: "Tir + El in any 2-socket Sword, Axe or Mace. Fast beats big; the poison does not care.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "lore" },
              why: "+1 to all skills for Ort + Sol, on a Druid pelt so it stacks with the pelt's own roll.",
              sockets: "Ort + Sol in a 2-socket Druid pelt.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "Faster run/walk from level 17, and run speed is closer to a damage stat on this build than on any other.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              label: "Any boots with 30% faster run/walk",
              why: "The build is a route. Everything that makes the route shorter is damage.",
              lookFor: ["30% Faster run/walk", "Fire and lightning resistance"],
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Attack rating, from an Act 1 drop." }],
        },
      ],
      nextUpgrade:
        "Level 18 and the first point in Rabies, and then twenty points split between it and a vine you will never summon.",
      notes:
        "**Put the early points in Poison Creeper without hesitation.** It is a level-1 skill and Rabies' only synergy, so points spent there at level 5 are still working at level 99 — this build has no wasted levelling investment at all.",
    },

    {
      tier: "nightmare",
      goal: "Nightmare cleared with Rabies and Poison Creeper both well along, and a route rather than a fight.",
      levelRange: [40, 65],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "passion" },
              why: "Attack speed and a very large attack rating bonus at level 43. On a build whose damage does not come from the weapon, attack rating is most of what a weapon is for.",
              sockets: "Dol + Ort + Eld + Lem in a fast 4-socket weapon.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +2 Druid skills and +3 to Shape Shifting skills",
              why: "+3 Shape Shifting raises Rabies itself. It does **not** raise Poison Creeper's synergy contribution, because synergies read hard points — so a +3 Summoning pelt would be worth almost nothing here.",
              lookFor: ["+3 to Shape Shifting Skills", "+2 Druid Skills", "Faster hit recovery", "2 sockets"],
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "lore" },
                  why: "+1 to all skills raises Rabies too, and is available now.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "treachery" },
              why: "45% attack speed and a Fade on being struck. You spend the fight running through packs rather than standing in them, and Fade triggers anyway.",
              sockets: "Shael + Thul + Lem in any 3-socket body armour.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "smoke" },
                  why: "+50 to all resistances for two cheap runes, from level 37. Running into the middle of a pack to bite one monster is a resistances problem before it is anything else.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Any gloves with 20% increased attack speed",
              why: "More bites is more packs, not more damage on a target you have already infected.",
              lookFor: ["20% Increased Attack Speed", "+ to attack rating", "Resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Life stolen per hit and physical damage reduced. The leech works from the weapon half, which lands in full on every bite.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "waterwalk" },
              why: "+65 life and faster run/walk. Gore Rider's crushing blow is worth less here than on any other melee Druid, because you are not standing still hitting anything.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen, and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "A rare ring with attack rating and resistances",
              why: "Attack rating first, every time.",
              lookFor: ["+ to attack rating", "All resistances", "Life stolen per hit"],
            },
          ],
        },
      ],
      nextUpgrade:
        "Bramble, and the only large multiplier this build's poison will ever get from an item.",
      notes:
        "**Bite once and move.** The single most common way to play this build badly is to keep attacking the monster you just infected: poison from one source does not stack with itself, so the second bite restarts the timer instead of adding a second dose.",
    },

    {
      tier: "early-hell",
      goal: "Hell entered, with the areas chosen rather than accepted. Poison immunity decides where this build farms.",
      levelRange: [65, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "passion" },
              why: "Still correct. There is no weapon upgrade that raises the poison, so the weapon's job stays attack speed and attack rating.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "kingslayer" },
                  why: "Crushing blow, open wounds and −25% target defence for the weapon half. A genuine upgrade to the physical damage, and no change at all to the poison.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +3 Shape Shifting skills and two sockets",
              why: "Three effective levels on Rabies, and two sockets for poison facets once resistances are capped elsewhere.",
              lookFor: ["+3 to Shape Shifting Skills", "+2 Druid Skills", "2 sockets"],
              sockets:
                "Two poison rainbow facets, or two 15% all-resistance jewels while resistances are still short. A facet carries both +% poison skill damage and −% to enemy poison resistance, and only one of those two lines works on a target that is still immune.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "smoke" },
              why: "+50 all resistances for Nef + Lum. Keep it until Bramble; there is nothing in between worth the runes on this build.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "duress" },
                  why: "Crushing blow and open wounds for the weapon half, if resistances are already handled.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves with 20% increased attack speed and attack rating",
              why: "Speed and the rating to use it.",
              lookFor: ["20% Increased Attack Speed", "+ to attack rating", "All resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduced, and leech." }],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "war-traveler" },
              why: "Faster run/walk and magic find. Run speed is the clear-speed stat here.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen, and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills, which is +1 to Rabies." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "the-cats-eye" },
              why: "30% faster run/walk, 20% attack speed and +25 Dexterity — the three stats a route-based build actually spends.",
            },
          ],
        },
      ],
      charms: [
        {
          ref: { kind: "unique", slug: "rotting-fissure" },
          why: "**Poison Sunder, and it is the only thing that opens a poison immune to this build.** No aura lowers poison resistance and no mastery exists, so this charm has no substitute. Only one Sunder Charm can be carried at a time, and poison is the only one worth carrying here.",
        },
        {
          label: "Shape Shifting skillers with life",
          why: "+1 effective level to Rabies each. A Summoning skiller raises Poison Creeper's own damage, not its synergy — so it is worth almost nothing on this build.",
        },
      ],
      nextUpgrade: "Bramble. It is the single largest damage upgrade on the page.",
    },

    {
      tier: "budget",
      goal: "Hell farmed on the routes that suit it, with the poison multiplied by the one item that multiplies it.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "beast" },
              why: "Fanaticism: attack speed and attack rating, which are this build's two real weapons. Its enhanced damage raises the bite and not the poison, and that is fine.",
              sockets: "Ber + Tir + Um + Mal + Lum in a 5-socket Axe, Scepter or Hammer.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "passion" },
                  why: "A fraction of the cost for most of the attack speed. This build needs Beast less than any other melee Druid.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +3 Shape Shifting skills and two poison rainbow facets",
              why: "Three effective Rabies levels, and two lots of +% poison skill damage.",
              tradeOnly: true,
              alternatives: [
                {
                  ref: { kind: "unique", slug: "vampire-gaze" },
                  why: "Leech and physical damage reduction, for a character with no shield.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "bramble" },
              why: "**+25–50% to Poison Skill Damage, and it is the only item in the game that multiplies this build's damage.** There is no poison mastery and no aura that lowers poison resistance, so an armour that raises the skill's own damage is doing a job nothing else can do. Its Thorns aura is a bonus nobody plans around.",
              sockets: "Ral + Ohm + Sur + Eth in any 4-socket body armour.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "smoke" },
                  why: "The resistances, until the Sur exists. Bramble is expensive and this build is otherwise cheap.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted blood gloves with 20% increased attack speed and attack rating",
              why: "Speed and rating, cheap and repeatable.",
              lookFor: ["20% Increased Attack Speed", "+ to attack rating", "Life stolen per hit"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduced." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Run speed, and magic find on a route." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen, and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "the-cats-eye" },
              why: "Run speed and attack speed.",
              alternatives: [
                {
                  label: "A rare amulet with +2 Druid skills and attack rating",
                  why: "Two effective Rabies levels, once the speed is covered elsewhere.",
                },
              ],
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "rotting-fissure" }, why: "Poison Sunder. Nothing else opens a poison immune." },
        {
          label: "Shape Shifting skillers with life",
          why: "Effective levels on Rabies; Summoning skillers do nothing for the synergy.",
        },
      ],
      nextUpgrade:
        "A decision rather than an item: whether to give up the weapon entirely for Death's Web. Read the immunity plan.",
    },

    {
      tier: "optimized",
      goal: "Every route this build is good at, run at speed, with the poison as high as items can put it.",
      levelRange: [85, 95],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "beast" },
              why: "Fanaticism, for the attack speed and attack rating. The bite has to land before anything else matters.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "deaths-web" },
                  why: "**The build's most interesting decision, and a real trade rather than an upgrade.** Death's Web carries −40–50% to Enemy Poison Resistance, which is the largest poison multiplier in the game — and it is a wand, so the weapon half of every bite and most of the leech go with it. Take it if you farm the routes below and never fight a boss; keep Beast if you want the character to be able to do anything else.",
                  tradeOnly: true,
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A +3 Shape Shifting, +2 Druid skills pelt with two poison rainbow facets",
              why: "Five effective Rabies levels and two facets. The largest single upgrade left.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "bramble" }, why: "+25–50% to Poison Skill Damage. Nothing else does this." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted blood gloves with 20% increased attack speed and attack rating",
              why: "Dracul's Grasp is the wrong choice here: Life Tap returns a share of damage dealt, and most of this build's damage arrives eleven seconds after the hit.",
              lookFor: ["20% Increased Attack Speed", "+ to attack rating", "Life stolen per hit"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Run speed and magic find." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen, and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "A rare amulet with +2 Druid skills, attack rating and two resistances",
              why: "Two effective Rabies levels and the rating to land the bite.",
              tradeOnly: true,
              alternatives: [{ ref: { kind: "unique", slug: "the-cats-eye" }, why: "Run speed and attack speed." }],
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "rotting-fissure" }, why: "Poison Sunder." },
        {
          label: "Anni, Torch and nine Shape Shifting skillers",
          why: "The Torch's +3 Druid skills is three effective Rabies levels.",
        },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders before shifting." },
      ],
      nextUpgrade: "Nothing structural. The ceiling here is the game's, not the gear's.",
    },

    {
      tier: "bis",
      goal: "Nothing left to buy, which arrives sooner on this build than on any other Druid.",
      levelRange: [90, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "deaths-web" },
              why: "−40–50% to Enemy Poison Resistance, applied at full value once a Sunder Charm or a Lower Resist has broken the immunity. On a finished character farming the routes below, giving up the weapon half of the bite is the correct trade.",
              tradeOnly: true,
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "beast" },
                  why: "Fanaticism, and a character that can still kill something the poison does not reach.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A +3 Shape Shifting, +2 Druid skills pelt with two poison rainbow facets",
              why: "The hardest item on the page.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "bramble" }, why: "+25–50% to Poison Skill Damage." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted blood gloves with 20% increased attack speed and attack rating",
              why: "Speed and rating.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Run speed and magic find." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "A rare amulet with +2 Druid skills and two resistances",
              why: "Two effective Rabies levels.",
              tradeOnly: true,
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "rotting-fissure" }, why: "Poison Sunder." },
        {
          label: "Anni, Torch and nine Shape Shifting skillers with life",
          why: "The finished inventory.",
        },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders before shifting." },
      ],
      notes:
        "**This build reaches its ceiling earlier than any other on the site, and that is a property of the element rather than of the plan.** Fire, cold and lightning each have a mastery, an aura that lowers the matching resistance, or both. Poison has neither. Once Bramble, a Sunder Charm and a pelt are in place, there is nothing further to buy that raises the number, which is why the page is short at this end and honest about it.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**An Act 2 Desert Mercenary with Might, and the reason is that nothing better exists for a poison build.** Might's enhanced damage raises the weapon half of your bite and the mercenary's own kills; at the top end Pride's Concentration does the same, larger. What matters more is what to avoid: **Infinity does nothing for this build.** Its Conviction aura lowers fire, cold and lightning resistance and does not touch poison, so the most expensive mercenary weapon in the game is worth less here than a Fortitude that keeps the mercenary alive. An **Act 1 Rogue Scout with Faith** is the alternative worth considering — Fanaticism's attack speed is packs infected per minute — and it is only worth it if your own hand is not carrying Beast.",

  farming: [
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "The build's home, and the area list says why: the only immunity recorded here is physical, which the poison ignores completely. Density five, one flat map, and a herd that infects itself the moment you bite into it.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Level 85 with the best item density in Act 1, and its recorded immunities are physical, cold and lightning — none of them poison. The physical immunes cost you the smaller half of the bite and nothing else.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Density five, and no poison in its recorded immunities. The seal bosses are the problem rather than the population: a boss simply outlasts an eleven-second poison, so this is a run for the trash and the experience.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Four recorded immunities and not one of them poison, which makes the best experience area in the game unusually friendly to the one element that has no mastery.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "stony-tomb",
      difficulty: "hell",
      why: "Level 85, quick to reach, and its recorded immunities are fire and physical. A short route for a build that is played as a route.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "Fire and lightning immune, which is nothing to you, and the Council stand close enough together that one bite reaches all three. Short, and the drops are good.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "mephisto",
      difficulty: "hell",
      why: "Not poison immune, and reachable in under a minute. He also takes the full eleven seconds and then some, so this is a patience run rather than a fast one.",
      minTier: "budget",
      rating: 3,
    },
  ],

  immunityPlan:
    "**Poison is the only element in the game with no mastery and no aura that lowers its resistance, and that shapes everything below.** Take the four things that touch enemy poison resistance in the right order. **Rotting Fissure**, the poison Sunder Charm, breaks a poison immunity outright — and it has no substitute, because the usual alternative does not exist here. **Lower Resist**, from a Necromancer in your party, is the only other thing that can break one: it is a curse, so it is cut to one fifth against a target that is still immune and it breaks the immunity anyway where a fifth is enough. **Death's Web and poison facets** carry −% to Enemy Poison Resistance, which is item pierce: applied after the immunity check, and that step is skipped while the immunity stands — so against a poison immune they are absent rather than weak, and they land at full value the moment the charm or the curse has broken it. **Bramble's +% to Poison Skill Damage is not resistance reduction at all**; it raises your damage before their resistance is applied, so it helps against everything that is not immune and helps not at all against everything that is. And **Conviction does not appear on this list**, because it lowers fire, cold and lightning resistance and leaves poison alone — which is the single most expensive mistake available on this build. The weapon half of every bite lands in full regardless, so a poison immune is still killed, slowly, by an ordinary melee attack.",

  hardcoreNotes:
    "Riskier than it looks, and the risk is structural: the build's damage arrives eleven seconds after the bite, so a pack that is going to kill you is still alive when it does. You cannot burst yourself out of trouble. What you can do is leave — Feral Rage's charges make this the fastest shapeshifter in the class, and running is a real answer here in a way it is not for a bear. Take **Oak Sage** over Heart of Wolverine and accept that the bite will miss more; keep the Grizzly out to hold the pack you have already infected; and treat Chaos Sanctuary's Oblivion Knights with the same caution every melee Druid does. Above all, do not linger to watch the poison work.",

  selfFoundNotes:
    "Cheap to build and hard to finish. The engine costs nothing — twenty points in a level-18 skill and twenty in a level-1 vine, with Steel and Lore carrying the first fifty levels — and the build is playable in Hell on gear a starter character can assemble. What it cannot do self-found is answer a poison immune: Rotting Fissure comes from a Terror Zone and there is no second route to it, because no aura and no mastery lowers poison resistance. Bramble needs a Sur. Until either exists, a poison-immune pack is killed by your weapon alone, which is why the areas above are chosen from the site's own immunity data rather than from density.",

  levelingPath: {
    summary:
      "No respec, and no wasted point. Poison Creeper is a level-1 skill and Rabies' only synergy, so the points you spend on the vine at level 5 are the same points feeding the bite at level 99; Werewolf and Lycanthropy are maxed by the finished build; and Feral Rage, the prerequisite, is the travel button you keep using.",
    respecAt: "None. The vine you summon at level 2 is the synergy you rely on at level 90.",
  },

  confidence: "verified",
  complete: true,
};
