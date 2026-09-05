import type { Build } from "@/lib/types";

/**
 * The Wind Druid — Tornado and Hurricane.
 *
 * The one build on this site whose immunity plan is "there isn't one, and that
 * is the point". Tornado's damage is entirely **physical** and Hurricane's is
 * entirely **cold**, both from the same tree, both maxed by the same points.
 * Nothing else in the game gives one character two damage types with no
 * mercenary aura, no Sunder Charm and no second weapon behind either.
 *
 * Two numbers shape every decision below and both come from the extraction.
 *
 *   Hurricane lasts 250 frames — ten seconds — and `Param2` for its duration is
 *   **zero**. Maxing Hurricane does not make it last a moment longer. Fifty
 *   frames per hard point in **Cyclone Armor** does, which is why a build that
 *   looks like it is buying a defensive buff is really buying uptime.
 *
 *   Tornado re-damages the same target only every 15 frames and its radius is
 *   3. Volume beats precision, and volume is Faster Cast Rate, which is why
 *   99% FCR is a required breakpoint rather than a nice one.
 */
export const windDruid: Build = {
  slug: "wind-druid",
  name: "Wind Druid",
  classSlug: "druid",
  summary:
    "Physical and cold damage on one character, from one tree, with no aura and no Sunder Charm. The safest Hell farmer the class has.",
  damageTypes: ["physical", "cold"],
  primarySkill: "tornado",
  playstyle:
    "You cast Hurricane, forget about it for forty seconds, and spend that time throwing Tornadoes into packs while a Grizzly holds the front. Tornado's path is erratic and you do not aim it — you stand where the pack has to come through and cast until it stops moving. Cyclone Armor eats the elemental damage that would otherwise punish standing still, and when something dangerous closes, Hurricane has already chilled it. It is a build with almost no rotation and almost no way to be surprised, which is why it reads as slow and finishes fast.",
  strengths: [
    "Two damage types from one skill tree — physical and cold cover Hell with nothing bought",
    "Hurricane runs while you cast, walk and fight; it is damage you are not spending time on",
    "Cyclone Armor is both the defensive layer and Hurricane's duration synergy, so nothing is wasted",
    "Cheap: the build works with a Spirit, a Lore and a Stealth, and scales smoothly from there",
    "Very forgiving in Hardcore — no melee range, a body-blocking bear, and a real elemental shield",
  ],
  weaknesses: [
    "Tornado's flight path is genuinely erratic; damage per cast varies with luck",
    "Needs 99% Faster Cast Rate before it feels like a farmer rather than a chore",
    "Mana-hungry — Tornado is cast continuously and there is no Warmth on this class",
    "No movement skill without an Enigma, and the class has no native Teleport",
    "Single-target damage is mediocre; bosses take a while",
  ],
  difficulty: "moderate",
  budget: "low",
  ratings: {
    clearSpeed: 4,
    bossing: 3,
    survivability: 5,
    magicFind: 3,
    terrorZones: 4,
    ubers: 2,
    soloSelfFound: 5,
    players8: 3,
  },

  skills: [
    {
      skill: "tornado",
      points: 20,
      role: "main",
      order: 1,
      note: "The whole of the build's physical damage. Maxed first, and it is the only skill here whose own level raises its own damage.",
    },
    {
      skill: "hurricane",
      points: 20,
      role: "main",
      order: 2,
      note: "Maxed second for its own cold damage and because it is a 9%-per-point synergy to Tornado.",
    },
    {
      skill: "cyclone-armor",
      points: 20,
      role: "synergy",
      order: 3,
      note: "Hurricane's *duration* synergy — 50 frames a point — and a Tornado damage synergy, and the elemental shield. Three jobs, one skill.",
    },
    {
      skill: "twister",
      points: 20,
      role: "synergy",
      order: 4,
      note: "The last 9% synergy to Tornado and 10% to Hurricane. Nothing else left to buy.",
    },
    {
      skill: "arctic-blast",
      points: 1,
      role: "prerequisite",
      note: "Required for Cyclone Armor. It also adds 2 frames of stun to Twister, which is free.",
    },
    {
      skill: "oak-sage",
      points: 1,
      role: "utility",
      note: "+30% life to you, the mercenary and the bear. One point, and the standard Hardcore pick.",
    },
    {
      skill: "raven",
      points: 1,
      role: "utility",
      note: "Five birds that blind, and the prerequisite for the wolves. The cheapest crowd control in the class.",
    },
    {
      skill: "heart-of-wolverine",
      points: 1,
      role: "flex",
      note: "The Softcore alternative to Oak Sage: +20% damage to the mercenary and the bear instead of life to you.",
    },
    { skill: "summon-spirit-wolf", points: 1, role: "prerequisite" },
    { skill: "summon-dire-wolf", points: 1, role: "prerequisite" },
    {
      skill: "summon-grizzly",
      points: 1,
      role: "utility",
      note: "One bear, and it taunts. It is the reason you get to stand still and cast.",
    },
  ],
  flexPoints: [
    "**Twenty-three points are spare at level 99, which is the largest slack of the seven Druid builds.** The four maxed skills and the eight one-point ones are 87 of 110, and nothing in the wind tree takes another synergy. **Oak Sage** is the first home for them — its party life bonus keeps scaling and the totem is what the build actually lacks — but it caps at twenty, so three are still yours after it is full.",
    "**Arctic Blast** is a legitimate second home for them if you like Twister as a panic button: every point there is two more frames of stun.",
    "Do not put points in the fire tree. Nothing on the wind side takes a synergy from it, and a half-levelled Fissure kills nothing in Hell.",
  ],
  stats: {
    strength: "Exactly enough for your gear, and not one point more.",
    dexterity: "Base, unless you are building for maximum block with a shield.",
    vitality: "Everything else.",
    energy: "None. Not a single point.",
    notes: [
      "The Druid gains 2 life per point of Vitality — the same as a Sorceress — so every spare point has to go there.",
      "Energy is the trap on this build specifically, because the mana problem is real and Energy is still the wrong answer to it. An Insight mercenary, a Solar Creeper or a belt of mana potions all cost nothing you needed.",
      "The Strength decision is the shield. A Spirit in a Monarch wants 156 Strength; most Wind Druids run a smaller base until Sandstorm Trek or an Enigma pays for it.",
      "With Battle Orders from a Call to Arms, 1400 or more life is a comfortable Hell number for this build.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 99,
      frames: 11,
      why: "The breakpoint the build is planned around. Tornado is cast continuously and its damage is a function of how many you get out, so cast rate is damage here in a way it is not for a skill with a cooldown.",
      priority: "required",
    },
    {
      stat: "fcr",
      value: 68,
      frames: 12,
      why: "The realistic waypoint while levelling. A Spirit sword alone is 35%, and one Faster Cast Rate ring gets most of the way to it.",
      priority: "recommended",
    },
    {
      stat: "fcr",
      value: 163,
      frames: 10,
      why: "One more frame, for a great deal of gear. Worth it only once nothing else is missing.",
      priority: "luxury",
    },
    {
      stat: "fhr",
      value: 56,
      frames: 7,
      why: "You cast standing still, so being locked in hit recovery is the way this build dies. 56% is the usual target on the shared Necromancer/Druid table.",
      priority: "recommended",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 30 and get Hurricane up. Nothing here costs more than three Countess runes.",
      levelRange: [1, 40],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "35% Faster Cast Rate, +2 to all skills and a large mana pool, in a four-socket sword you can buy from Larzuk's stock or find in Act 3. It is the single best value item in the game and this build wants every line on it.",
              sockets: "Tal + Thul + Ort + Amn, in a 4-socket Crystal Sword or Broad Sword.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "leaf" },
                  why: "If you are still in Normal: a two-rune staff with +3 to a fire tree is worthless here, so skip it and hold the Spirit runes instead.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "Any shield with resistances and a socket",
              why: "Until a second Spirit, resistances are worth more than anything else this slot can carry.",
              lookFor: ["All resistances", "Faster hit recovery", "2-3 sockets"],
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "rhyme" },
                  why: "Cannot be frozen and 25% magic find for two shael-tier runes. Cheap and permanently useful.",
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
              why: "+1 to all skills and lightning resistance for Ort + Sol. On a Druid pelt it stacks with the pelt's own +skills roll.",
              sockets: "Ort + Sol in any 2-socket helm; a Druid pelt is strictly better than a plain one.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "25% Faster Cast Rate, 25% Faster Hit Recovery and faster running, from level 17, for Tal + Eth.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              label: "Any boots with resistances and faster run/walk",
              why: "Nothing exotic. You are walking everywhere until an Enigma, so run speed is real.",
              lookFor: ["Faster run/walk", "Fire and lightning resistance"],
            },
          ],
        },
      ],
      nextUpgrade:
        "Level 30 and the twentieth point in Tornado. Until Hurricane is up you are a Fire Druid; see the leveling journey.",
      notes:
        "**Hold Countess runes rather than spending them.** Tal, Thul, Ort and Amn build the Spirit that carries this character from level 25 to the end of Nightmare, and burning Ort on a Lore first is the common mistake.",
    },

    {
      tier: "nightmare",
      goal: "Nightmare cleared and Hell entered with both storms maxed enough to matter.",
      levelRange: [40, 65],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Unchanged, and still the best weapon in this slot until Heart of the Oak. There is no upgrade in between worth the runes.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A second Spirit in a Monarch takes the pair to 60% Faster Cast Rate and +4 to all skills, which is most of the way to the breakpoint and most of the way to the damage.",
              sockets: "The same four runes in a 4-socket Monarch. 156 Strength is the cost; a smaller 4-socket base is a legitimate compromise.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "ancients-pledge" },
                  why: "If the Strength is not there yet: +50% to all resistances for three Countess runes, which matters more in Nightmare than cast rate does.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +2 Druid skills and +3 to a wind skill",
              why: "Pelts are the only helms that roll +to a Druid skill directly. A +2/+3 Tornado pelt is worth more than any unique helm you can find at this level.",
              lookFor: ["+2 Druid Skills", "+3 to Tornado", "+3 to Hurricane", "Faster hit recovery"],
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "lore" },
                  why: "If nothing has dropped. Charsi's imbue on a white pelt after level 30 is the deliberate way to fix this slot.",
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
              why: "+1 to all skills, 30% Faster Cast Rate and up to 35 all resistances in one common unique. For this build it is very close to a best-in-slot until Enigma.",
              sockets: "One socket: a perfect diamond for resistances, or an Um.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "magefist" },
              why: "20% Faster Cast Rate and mana regeneration, which is the exact pair of problems this build has.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "nightsmoke" },
              why: "Resistances and 50% of damage taken from mana — which is a real defensive line on a character with a large mana pool from two Spirits.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "waterwalk" },
              why: "+65 life and 15 Dexterity, and the life is what a Hardcore Druid is buying.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "sandstorm-trek" },
                  why: "If Strength for a Monarch is the blocker: +15 Strength and +15 Vitality solves it directly.",
                },
              ],
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              label: "Any ring with 10% Faster Cast Rate",
              why: "The cheapest ten percent in the game. Two of them plus two Spirits is 80%, which is the last step before the 99% breakpoint.",
              lookFor: ["10% Faster Cast Rate", "Resistances", "Life"],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "Any amulet with +2 Druid skills",
              why: "Two skill levels is roughly two hard points across four maxed skills. Nothing else in this slot competes at this stage.",
              lookFor: ["+2 Druid Skills", "10% Faster Cast Rate", "Resistances"],
            },
          ],
        },
      ],
      nextUpgrade:
        "The 99% Faster Cast Rate breakpoint, and then Hell resistances. Both are gear problems, not skill problems.",
      notes:
        "**Use Anya's resistance reward and Charsi's imbue deliberately.** Imbuing a white Druid pelt after level 30 is the most reliable way this build gets a +2/+3 helm without trading.",
    },

    {
      tier: "early-hell",
      goal: "Hell resistances capped and 99% Faster Cast Rate reached.",
      levelRange: [65, 80],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Still here. The next weapon is Heart of the Oak and there is nothing between them.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "The second Spirit is now mandatory rather than optional: 60% of the 99% comes from the pair.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "+2 to all skills, +life, +mana and magic find. On a build with four maxed skills, two skill levels is a large damage line and the life is not negotiable in Hell.",
              sockets: "A perfect ruby for life, or an Um for resistances.",
              alternatives: [
                {
                  label: "Jalal's Mane",
                  why: "The Druid pelt unique: +2 Druid skills, +2 to the Shape Shifting tab and a large Energy bonus. Equal to a Shako here and better if the pelt's own tab roll lands on Elemental.",
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
              why: "Unchanged. Its 30% cast rate is doing structural work toward the breakpoint.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "magefist" },
              why: "Unchanged — the 20% is part of the breakpoint arithmetic.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "arachnid-mesh" },
              why: "+1 to all skills and 20% Faster Cast Rate in one slot. It is the piece that turns 80% into the 99% breakpoint.",
              tradeOnly: false,
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "sandstorm-trek" },
              why: "Strength, Vitality, poison length reduction and faster hit recovery. The Strength is what finally pays for the Monarch.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "stone-of-jordan" },
              why: "+1 to all skills and a large mana pool, which is the build's other problem solved in the same slot.",
              alternatives: [
                {
                  label: "A rare ring with 10% Faster Cast Rate and resistances",
                  why: "Cheaper, and the cast rate is the part the breakpoint needs.",
                },
              ],
            },
          ],
        },
        {
          slot: "ring2",
          picks: [
            {
              ref: { kind: "unique", slug: "raven-frost" },
              why: "Cannot be frozen, which on a build that stands still and casts is a survival line rather than a convenience.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 to all skills and +20 to all resistances. The resistances are half of why Hell stops being a problem.",
            },
          ],
        },
      ],
      charms: [
        {
          ref: { kind: "unique", slug: "bone-break" },
          why: "The physical Sunder Charm. A physical immune is the only monster in Hell that Tornado cannot touch, and this is the answer — it sets that immunity to 95% resistance instead.",
          alternatives: [
            {
              label: "No sunder at all",
              why: "Legitimate on this build and unusual to be able to say. Hurricane's cold covers most physical immunes on its own; the charm is for making them fast rather than possible.",
            },
          ],
        },
      ],
      nextUpgrade:
        "Heart of the Oak, and then an Enigma. Between them they change how the build moves as much as how hard it hits.",
    },

    {
      tier: "budget",
      goal: "Every Hell area farmable, with the breakpoint held and resistances capped.",
      levelRange: [80, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "+3 to all skills, 40% Faster Cast Rate, +30-40 to all resistances and a very large mana pool. It replaces a Spirit and solves the cast-rate arithmetic, the resistance problem and the mana problem in one item.",
              sockets: "Ko + Vex + Pul + Thul in a 4-socket Flail or Crystal Sword. The base has no bearing on the build; take the lightest one.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "The shield Spirit stays. With Heart of the Oak in hand the pair is +5 skills and 75% cast rate before anything else.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "splendor" },
                  why: "If the Monarch's Strength is still unaffordable: +1 to all skills and 20% Faster Cast Rate on any base.",
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
              why: "Unchanged, and now socketed with an Um or a perfect ruby depending on which of resistances or life is short.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport. The Druid has no movement skill of his own, and this is the single largest change to how the character plays — clear speed roughly doubles because you stop walking between packs.",
              sockets: "Jah + Ith + Ber in any 3-socket body armour. A light base is worth more than a heavy one; you are not being hit in melee.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
                  why: "Until the Ber and Jah exist. Nothing else in this slot is close for a caster on a budget.",
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
              why: "Still the cheapest 20% cast rate in the game.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "frostburn" },
                  why: "If mana rather than cast rate is the binding constraint: +40% maximum mana.",
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
              why: "Unchanged. +1 skill and 20% cast rate is not replaceable at this budget.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "sandstorm-trek" },
              why: "With an Enigma paying the Strength bill, these become a hit-recovery and Vitality slot instead.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "war-traveler" },
                  why: "If the character is farming for items rather than clearing: 50% magic find and +10 Vitality.",
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
              why: "+1 skill and the mana pool.",
            },
          ],
        },
        {
          slot: "ring2",
          picks: [
            {
              ref: { kind: "unique", slug: "raven-frost" },
              why: "Cannot be frozen. On this build that is not optional.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 skills and +20 resistances.",
            },
          ],
        },
      ],
      charms: [
        {
          ref: { kind: "unique", slug: "bone-break" },
          why: "Physical Sunder. With it, the last category of monster that slowed this build down stops existing.",
        },
        {
          label: "Skillers with life",
          why: "Elemental grand charms carry +1 to the Elemental tree, which is +1 to four maxed skills at once. They are the densest damage per inventory square this build has.",
          lookFor: ["+1 Elemental Skills", "+life", "+resistances on small charms"],
        },
      ],
      weaponSwap: [
        {
          ref: { kind: "runeword", slug: "call-to-arms" },
          why: "Battle Orders on a swap is +35-50% life and mana for the whole party. On a class whose life per Vitality is 2, it is the largest single defensive item in the game.",
        },
      ],
      nextUpgrade:
        "Chains of Honor if resistances are still the limit, or a second skiller row. Neither changes the build, only its margins.",
    },

    {
      tier: "optimized",
      goal: "Terror Zones at players 8, and the clear speed the build is capable of.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "Unchanged and unreplaced. Nothing in the game beats +3 skills, 40% cast rate and 40 all resistances for a Druid caster.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Still the best value shield here; the alternative is a resistance-focused rare Monarch with a high block roll.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A Druid pelt with +3 Tornado, +2 Druid skills and 2 sockets",
              why: "This is where a pelt finally beats a Shako. +3 Tornado and +2 Druid skills is five effective levels in one slot, and the sockets still take resistance jewels.",
              lookFor: ["+3 to Tornado", "+2 Druid Skills", "Faster hit recovery", "2 sockets"],
              tradeOnly: true,
              alternatives: [
                {
                  ref: { kind: "unique", slug: "harlequin-crest" },
                  why: "The safe answer, and never a bad one. Two skills, life, mana and magic find with nothing to roll.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport, +2 skills and Strength that pays for every other slot's requirement.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "magefist" },
              why: "20% cast rate. The slot has no better option for a Druid.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "arachnid-mesh" },
              why: "+1 skill and 20% cast rate.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "sandstorm-trek" },
              why: "Hit recovery, Vitality and poison length. The alternative is War Traveler when the run is a magic-find run.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            { ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skill and mana." },
          ],
        },
        {
          slot: "ring2",
          picks: [
            {
              ref: { kind: "unique", slug: "raven-frost" },
              why: "Cannot be frozen, +Dexterity and +attack rating you do not need but do not mind.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 skills, +20 all resistances.",
              alternatives: [
                {
                  label: "A rare amulet with +2 Druid skills and 10% Faster Cast Rate",
                  why: "Better than Mara when resistances are already capped, because the class-specific roll is worth more than the generic one.",
                },
              ],
            },
          ],
        },
      ],
      charms: [
        {
          ref: { kind: "unique", slug: "bone-break" },
          why: "Physical Sunder, for the rare pack that is physically immune and not worth chilling to death.",
        },
        {
          ref: { kind: "unique", slug: "cold-rupture" },
          why: "Cold Sunder, and the honest use case: it is for the monsters that are immune to *cold*, so that Hurricane keeps contributing where Tornado is already doing the work. Only one Sunder Charm can be held at a time.",
        },
        {
          label: "Nine Elemental skillers with life",
          why: "+9 effective levels across four maxed skills. Nothing else fills an inventory better on this build.",
        },
      ],
      weaponSwap: [
        {
          ref: { kind: "runeword", slug: "call-to-arms" },
          why: "Battle Orders. Cast it, swap back, and the character has a third more life for the next four minutes.",
        },
      ],
      nextUpgrade:
        "Chains of Honor over Enigma when a second character can lend the Teleport, or a perfect pelt. The build is finished before this point.",
    },

    {
      tier: "bis",
      goal: "Nothing left to buy.",
      levelRange: [90, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "In a base with the lowest requirements available. There is no upgrade.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "In a Monarch, rolled at 35% cast rate and 112 mana.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "stormshield" },
                  why: "The Hardcore answer: 35% damage reduction and the highest block in the game, at the cost of every offensive line on a Spirit.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              label: "A +3 Tornado, +2 Druid skills Druid pelt with two 15% all-resistance jewels",
              why: "Five effective skill levels and 30 resistances from one slot. The single largest upgrade left.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport is not replaceable on a class with no movement skill.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "+2 skills, +65 all resistances and 8% damage reduction. Strictly better than Enigma in every way except the one that matters most.",
                },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% cast rate; nothing else fits." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skill, 20% cast rate." }],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "sandstorm-trek" },
              why: "Hit recovery and Vitality, or War Traveler when magic find is the point of the run.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skill and mana." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "A rare amulet with +2 Druid skills, 10% Faster Cast Rate and two resistances",
              why: "The best amulet in the game for this build, and the hardest single item to find.",
              tradeOnly: true,
              alternatives: [
                { ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "Never wrong." },
              ],
            },
          ],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "bone-break" }, why: "Physical Sunder for physical immunes." },
        {
          label: "Anni, Torch and nine Elemental skillers",
          why: "The standard endgame inventory. The Torch's +3 Druid skills is three effective levels on four maxed skills.",
        },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, always." },
      ],
      notes:
        "**There is no weapon upgrade past Heart of the Oak for this build, and that is unusual.** Most classes end on a runeword that trades resistances for raw damage. A Wind Druid's damage is all skill levels and cast rate, and Heart of the Oak is the best source of both in one hand.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "An Act 2 Desert Mercenary with **Insight**, and it is not a close call. Tornado is cast continuously and the Druid has no Warmth; Meditation is the difference between casting and stopping to drink. Take Might in Nightmare for the physical damage aura, which raises Tornado not at all — auras do not touch spell damage — but does raise the mercenary's own kills and the bear's. Later, Infinity is worth far less to this build than to an elemental caster, because Conviction lowers *elemental* resistance and most of your damage is physical.",

  farming: [
    {
      area: "countess",
      difficulty: "nightmare",
      why: "The runes that build the Spirits, and a short run a half-geared Wind Druid can hold.",
      minTier: "starter",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Level 85, dense, and full of exactly the mixed-immunity packs that a physical-plus-cold build walks through without changing anything.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Level 85 with no cold immunes at all, which means Hurricane is contributing on every kill rather than most of them.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Dense, level 85, and reachable early. A good first Hell area for a build that wants packs rather than bosses.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Physical and cold together handle the seal bosses without a Sunder Charm; the Oblivion Knights are the real problem and Hurricane chills them before they cast.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "The best experience in the game and the densest packs. Wants the 99% breakpoint and capped resistances first.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Absurd density, and physical is the only immunity the area carries — which is precisely the half Hurricane's cold covers for free. Tornado rewards density more than it rewards aim.",
      minTier: "early-hell",
      rating: 4,
    },
  ],

  immunityPlan:
    "**The build's answer is that it has two damage types and they do not overlap.** Tornado is entirely physical, Hurricane entirely cold, and both are maxed by the same set of points — so a fire immune, a lightning immune and a poison immune are all simply irrelevant. A physical immune still takes Hurricane's cold; a cold immune still takes Tornado's physical. The only monster that genuinely resists this character is immune to both at once, and that combination is rare enough that many Wind Druids finish the game having never carried a Sunder Charm. **Bone Break** is the upgrade rather than the fix: it makes physical immunes fast instead of merely possible.",

  hardcoreNotes:
    "One of the two or three safest builds in the game and the standard Hardcore Druid. You never enter melee range, the Grizzly taunts what would reach you, Cyclone Armor absorbs the elemental damage that kills casters, and Oak Sage adds 30% life on top of a class that already has Lycanthropy-free Vitality scaling. The real risks are the ones every caster has: a Fanaticism-boosted ranged pack, and Teleporting into an Oblivion Knight's Iron Maiden with an Enigma. Keep Cyclone Armor up, cap resistances before Hell rather than during it, and do not teleport blind.",

  selfFoundNotes:
    "The best solo self-found build the Druid has, and one of the best in the game. Everything in the starter and Nightmare sets is a Countess rune, a vendor purchase or a common unique, and the build's core skills need no item to function at all. Charsi's imbue on a white Druid pelt after level 30 is the one deliberate step worth planning for; it is the most reliable +2/+3 helm a self-found character will see.",

  levelingPath: {
    summary:
      "Level on Firestorm, Molten Boulder and Fissure, then respec into the wind tree once Tornado is available and the fire tree's damage has stopped keeping up. The two halves of the elemental tree share no synergies, so this is a genuine respec rather than a re-spend.",
    respecAt: "Nightmare Act 3, before Mephisto — roughly level 38.",
    viaBuild: "fire-druid",
  },

  confidence: "verified",
  complete: true,
};
