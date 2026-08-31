import type { Build } from "@/lib/types";

/**
 * The Avenger.
 *
 * The research pass found two sources flatly contradicting each other on this
 * build's cost — one calling it "a very expensive build… a late-game switch",
 * the other "one of the cheapest endgame Paladins to gear". Working the numbers
 * out from the game's own skills.txt resolves it, and the resolution is the
 * most useful thing on this page.
 *
 * Vengeance's damage is `70% baseline + 6% per level`, with **four** synergies:
 * Resist Fire, Resist Cold and Resist Lightning at 10% each, plus Salvation at
 * 2%. (One published guide lists only the three resistance skills. The game
 * data includes Salvation.)
 *
 * So a fully realised Avenger wants Vengeance 20, all three resistance skills
 * at 20, and Conviction at 20 — 100 points — plus seven for the prerequisite
 * chains: Sacrifice and Zeal to reach Vengeance, and Might, Holy Fire, Holy
 * Freeze, Thorns and Sanctuary to reach Conviction. That is 107 of the 110 a
 * level 99 character has.
 *
 * What it cannot afford is Holy Shield. The game requires Blessed Hammer and
 * Charge for it, and Charge requires Smite — a five-point detour into a tree
 * this build otherwise never opens. An earlier version of this page listed
 * Holy Shield at one point, which was only possible because our prerequisite
 * data was wrong.
 *
 * The build is therefore cheap in currency and expensive in levels. Both
 * sources were describing something true; neither said which resource it was
 * talking about. See `docs/research/01-paladin-builds.md`.
 */
export const avenger: Build = {
  slug: "avenger",
  name: "Avenger",
  classSlug: "paladin",
  summary:
    "Every swing deals physical, fire, cold and lightning damage at once, under an aura that strips resistance. The build immunity cannot stop.",
  damageTypes: ["physical", "fire", "cold", "lightning"],
  primarySkill: "vengeance",
  playstyle:
    "Run Conviction, walk up to whatever is in front of you, and swing. Vengeance converts a share of your weapon damage into fire, cold and lightning simultaneously, so every attack is four damage types looking for the one the target does not resist. There is no immunity check to plan around and no swapping. What you do plan around is your skill points, because this build wants more of them than the game gives you.",
  strengths: [
    "Four damage types on every swing — you will almost never meet something that resists all of them",
    "Conviction strips resistance from everything nearby, which makes you a strong party member for elemental characters",
    "Cheap to gear. A Kingslayer supplies +1 Vengeance on its own, and the build clears Hell without a single high rune",
    "Maxing three resistance skills gives you unusually high maximum resistances as a side effect",
    "No sunder charm, no Infinity, no immunity shopping list",
  ],
  weaknesses: [
    "**Skill-point starved.** The full plan needs about 113 points and a level 99 character has 110. Something has to give",
    "Single-target. Vengeance hits one thing at a time, so density is slow",
    "No mobility of its own. Without Enigma this build walks everywhere",
    "Damage arrives late — the synergies only pay off once several are near maxed",
    "Neither of the two ranked tier lists we consulted carries it at all, which is a real signal about how it compares",
  ],
  difficulty: "advanced",
  budget: "medium",
  ratings: {
    clearSpeed: 2,
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
      skill: "vengeance",
      points: 20,
      role: "main",
      order: 1,
      note: "70% damage at level 1 and +6% per level, on top of the elemental conversion. Max it first — everything else is a multiplier on it.",
    },
    {
      skill: "resist-fire",
      points: 20,
      role: "synergy",
      order: 2,
      note: "A 10%-per-level fire synergy for Vengeance, and it raises your maximum fire resistance while you do it. The best point-for-point investment in the build.",
    },
    {
      skill: "resist-lightning",
      points: 20,
      role: "synergy",
      order: 3,
      note: "Same 10% per level, for the lightning portion. Ordered before cold because lightning damage in Hell is what kills Paladins.",
    },
    {
      skill: "resist-cold",
      points: 20,
      role: "synergy",
      order: 4,
      note: "The third 10%-per-level synergy. Also the prerequisite for Resist Lightning, so its first point is already paid for.",
    },
    {
      skill: "conviction",
      points: 20,
      role: "main",
      order: 5,
      note: "**This is where the points run out.** 30% resistance reduction at level 1 plus 5% per level. Put every point you have left here and let +skills gear carry it the rest of the way.",
    },
    { skill: "sacrifice", points: 1, role: "prerequisite" },
    { skill: "zeal", points: 1, role: "prerequisite", note: "Vengeance's prerequisite, and a genuinely useful second attack for trash." },
    { skill: "might", points: 1, role: "prerequisite" },
    { skill: "holy-fire", points: 1, role: "prerequisite" },
    { skill: "holy-freeze", points: 1, role: "prerequisite" },
    { skill: "sanctuary", points: 1, role: "prerequisite" },
    {
      skill: "salvation",
      points: 1,
      role: "synergy",
      note: "Vengeance's fourth synergy, at 2% per level — a quarter of what a resistance skill gives. Take one point for the prerequisite value and the aura, and do not invest further until the three resistance skills are maxed.",
    },
    {
      skill: "thorns",
      points: 1,
      role: "prerequisite",
      note: "**Sanctuary requires Holy Freeze and Thorns.** One point, and the only reason to take it.",
    },
  
  ],
  flexPoints: [
    "**The budget is tight but it closes.** Vengeance, the three resistance skills and Conviction all maxed is 100 points, and the prerequisite chains cost exactly seven more. That leaves three points at level 99 — and level 99 is not where most characters stop, so in practice you are choosing which synergy finishes last.",
    "**Holy Shield costs five points, not one.** It requires Blessed Hammer and Charge, and Charge requires Smite. If you want maximum block you are buying a five-point chain through the Combat tree and taking it out of a resistance synergy — a real trade, not a rounding error.",
    "**Conviction is the usual place to come up short**, and it is the right one — every point of +skills on your gear raises it, so gear substitutes for points here in a way it does not for the synergies.",
    "**Holy Shield is the other candidate.** One point plus +skills gives a real but not maximum block. If you would rather have maximum block than the last few points of Conviction, that is a legitimate trade and this page is not going to pretend otherwise.",
    "**Salvation past one point is a trap.** It is a 2%-per-level synergy against the resistance skills' 10%. Max those three first, every time.",
    "**Increased Attack Speed is not published as a breakpoint table here.** Vengeance's frame thresholds depend on your weapon's speed modifier and animation data no reliable source publishes. Fanaticism is not available to you while Conviction is running, so attack speed has to come from gear — Highlord's Wrath, Kingslayer and crafted gloves are where it lives.",
  ],
  stats: {
    strength: "Whatever your weapon and shield need. A Kingslayer in a Cryptic Sword and a Rhyme in a modest shield ask very little; Last Wish in a Berserker Axe asks 138.",
    dexterity:
      "Enough for as much block as you have decided to buy. With Holy Shield at one point this number is higher than it would be on a Zealot, which is part of the cost of the compromise above.",
    vitality: "Everything else.",
    energy: "None. Vengeance costs mana per swing, which is what the mercenary's Insight is for.",
    notes: [
      "**Vengeance has a real mana cost per attack**, unlike Zeal. An Insight on the mercenary is not optional on this build, it is the mana plan.",
      "**Check block with Holy Shield active** — the usual Paladin trap, and it matters more here because you only have one point in it.",
      "Your maximum resistances are unusually high because three resistance skills are maxed as synergies. That is free survivability and it is worth knowing before you over-buy resistance gear.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "recommended",
      why: "A melee build with modest block needs to recover from hits it did not stop.",
    },
    {
      stat: "fbr",
      value: 32,
      frames: 3,
      priority: "recommended",
      why: "Worth having whatever block percentage you settled on, because the recovery frames are what let you act between hits.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 30 as something else. Vengeance opens at 18 but Conviction does not exist until 30.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any Paladin scepter with +Combat Skills",
              why: "Vendor scepters carry class skill bonuses, which raise Zeal and later Vengeance for free.",
              lookFor: ["+2 Combat Skills", "+3 Zeal", "High attack speed"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "Resistances from three Countess runes, on a shield class that adds its own.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Hit recovery and run speed for two common runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills." }],
        },
      ],
      nextUpgrade: "Level 30 for Conviction. Nothing about this build works properly before that.",
      notes:
        "Level with Zeal. It is Vengeance's prerequisite, so the point is not wasted, and it is a better levelling attack than Vengeance is until the synergies exist.",
    },

    {
      tier: "nightmare",
      goal: "Conviction running, synergies started, resistances climbing.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "kingslayer" },
              why: "The natural Avenger weapon: it supplies **+1 to Vengeance** on its own, plus 30% attack speed and 33% Crushing Blow.",
              sockets: "Mal, Um, Gul, Fal into a 4-socket Sword or Axe.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "passion" },
                  why: "Cheaper, and the attack speed is what you are actually short of at this stage.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "rhyme" },
              why: "Cannot Be Frozen, 25% magic find, resistances and block, for two of the cheapest runes in the game. The classic budget Avenger shield.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "herald-of-zakarum" },
                  why: "More skills and far more resistance, when it drops.",
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
              why: "Fade on being struck, plus attack speed. Three cheap runes and it covers two problems.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Life steal and damage reduction." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike and Open Wounds — a physical build uses all three." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest resistance available." }],
      nextUpgrade: "Get the three resistance synergies maxed. Everything about the build's damage is downstream of them.",
    },

    {
      tier: "early-hell",
      goal: "Enter Hell and discover that immunity is not your problem.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "kingslayer" },
              why: "Still the right weapon. Its Crushing Blow covers bosses while your elemental damage covers everything else.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "+2 Paladin skills, +2 Combat Skills and +50 all resistances." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "duress" },
              why: "Crushing Blow, cold damage and damage reduction for three mid runes.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "+2 skills and +65 all resistances. Worth more here than the raw damage, because +2 skills lifts Conviction and all three synergies at once.",
                },
              ],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "highlords-wrath" },
              why: "+1 all skills, 20% attack speed and Deadly Strike. The +1 is worth more on this build than almost any other, because it raises five separate skills you have invested in.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and Dexterity toward block." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "Hold the cap while Conviction is not helping you." }],
      nextUpgrade: "+skills wherever you can find them. On this build every +1 raises Vengeance, three synergies and Conviction together.",
      notes:
        "This is where the build pays off. Walk into a pack of mixed immunes that would stop a Sorceress cold and kill all of it with the same button.",
    },

    {
      tier: "budget",
      goal: "Clear Hell comfortably, including the immune-heavy zones nothing else wants.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "Its flat damage bonus feeds the elemental conversion as well as the physical hit, which makes it the biggest single damage upgrade available.",
              sockets: "Eth, Tir, Lo, Mal, Ral into a 5-socket Phase Blade.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "kingslayer" },
                  why: "Keep it if Grief is out of reach. The +1 Vengeance and Crushing Blow are still doing real work.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "Skills, resistances and block." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances — five invested skills raised at once." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "vampire-gaze" },
              why: "Life steal and damage reduction, cheaply.",
              alternatives: [
                { ref: { kind: "unique", slug: "crown-of-ages" }, why: "+1 skills, resistances, damage reduction and sockets. The upgrade." },
              ],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 skills and 20% attack speed." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and Deadly Strike." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills, which on this build is five skills at once." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills — the single largest skill boost available." },
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Resistance and life small charms", why: "The rest of the inventory." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders. A melee build with modest block wants the life." },
      ],
      nextUpgrade: "Enigma for mobility, or Last Wish if you would rather have a Might aura and heavy Crushing Blow.",
    },

    {
      tier: "optimized",
      goal: "Fast clears in zones other builds avoid.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "Flat damage into four damage types.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "last-wish" },
                  why: "A Might aura, 40-50% Crushing Blow and Life Tap on striking. You give up Grief's flat damage for sustain and boss damage — a real choice, not an upgrade.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "herald-of-zakarum" },
              why: "+4 effective skills and +50 all resistances.",
              alternatives: [
                { ref: { kind: "runeword", slug: "exile" }, why: "Life Tap and a Defiance aura, plus +2 Offensive Auras which raises Conviction." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport. This build has no mobility of its own and feels it more than most.",
              sockets: "Jah, Ith, Ber into a 3-socket body armour.",
              alternatives: [
                { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "Keep it if resistances or the +2 skills matter more to you than movement." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "crown-of-ages" },
              why: "+1 skills, resistances, damage reduction and up to two sockets for attack speed.",
              lookFor: ["2 sockets", "30% all resistances", "15% damage reduction"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted Blood gloves with 20% Increased Attack Speed",
              why: "Attack speed is scarce on this build because Fanaticism is not available while Conviction runs.",
              lookFor: ["20% Increased Attack Speed", "+2 Combat Skills", "Life"],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 skills, attack speed, Deadly Strike." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Life and resistance small charms", why: "The remaining inventory." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "More +skills. Every point of it is worth five skill points to this build.",
    },

    {
      tier: "bis",
      goal: "Nothing left to fix, and the skill bar is still three points short.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "A 400-damage roll in an ethereal Phase Blade.",
              lookFor: ["400 damage", "40% Increased Attack Speed"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "exile" },
              why: "+2 Offensive Auras raises Conviction directly, which is exactly the skill you could not afford to max.",
              lookFor: ["Level 16 Defiance", "Ethereal base", "45 all resistances"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, and +0.75 Strength per level." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "crown-of-ages" },
              why: "Two sockets, maximum resistances, maximum damage reduction.",
              lookFor: ["2 sockets", "30 all resistances", "15% damage reduction"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted Blood gloves, 20% Increased Attack Speed, +3 Combat Skills",
              why: "The only slot where a craft beats every unique for this build.",
              lookFor: ["20% Increased Attack Speed", "+3 Combat Skills", "Life"],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "highlords-wrath" },
              why: "+1 all skills, 20% attack speed, and Deadly Strike worth roughly 34% at level 90.",
              alternatives: [
                { ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills instead, if you would rather have the skills than the attack speed." },
              ],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and Deadly Strike." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "15% damage reduction on a maximum roll." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, 20 Dexterity." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills, 20 all resistances." },
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Life and resistance small charms", why: "The rest." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "Note what best-in-slot means here. Every item on this list was chosen partly for +skills, because the build's ceiling is set by skill points rather than by currency. That is the opposite of how most endgame lists work and it is worth understanding before you trade for anything.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Insight is not optional.** Vengeance costs mana on every swing, and unlike Zeal you cannot ignore that — Meditation from an Insight polearm is the mana plan, and it costs four common runes. For his aura, take **Might** from Nightmare Act 2 for the damage, or **Holy Freeze** if you would rather slow packs. Avoid giving him anything that duplicates what you already do; your Conviction is already breaking resistance for both of you.",

  farming: [
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Dense, high level, and full of mixed immunities that stop other builds and do nothing to this one. Watch for Iron Maiden from the Oblivion Knights — the physical portion of Vengeance reflects.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are fire and lightning immune, which stops most casters. You have cold and physical as well, and Conviction on top.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and a short route. Slower than a Hammerdin here, but nothing in it can stop you.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 with heavy cold immunity, which is precisely the kind of zone this build exists for.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85 and dense. Single-target damage makes this slower than it is for a caster, but every pack dies.",
      minTier: "optimized",
      rating: 3,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "One target, ten seconds from a portal. Exactly what a single-target build wants.",
      minTier: "early-hell",
      rating: 4,
    },
  ],

  immunityPlan:
    "This is the whole reason to play the build, so it is worth being precise. **Vengeance adds fire, cold and lightning damage to your physical attack simultaneously** — it does not convert, it adds, so a swing carries four damage types at once. A monster immune to one of them still takes the other three. Genuine quadruple immunity does not occur naturally. On top of that, **Conviction reduces fire, cold and lightning resistance by 30% at level 1 plus 5% per level**, which shaves the partial resistances that remain. You need no sunder charm, no Infinity, and no second attack. The two things that *do* stop you are **Iron Maiden**, which reflects the physical portion of your damage and is a real danger in the Chaos Sanctuary, and monsters with very high resistance in several elements at once, which Conviction cannot push far enough below zero to matter.",

  hardcoreNotes:
    "Reasonable in Hardcore but not the safest Paladin, and the reason is the skill-point budget: you almost certainly do not have maximum block, because Holy Shield lost the argument with the damage synergies. Compensate with Chains of Honor over Enigma, keep Battle Orders up, and treat **Iron Maiden** as the specific thing that kills you — the physical portion of Vengeance reflects, and a fast attack into a reflected-damage curse is lethal. The high maximum resistances that come free with the three maxed synergies are a genuine Hardcore advantage and partly offset the block problem.",

  selfFoundNotes:
    "One of the strongest self-found Paladins, and this is where the build's reputation for being cheap comes from. Kingslayer is four mid runes and supplies +1 Vengeance by itself; Rhyme is two of the cheapest runes in the game; Treachery is three. None of the damage comes from high runes — it comes from skill points, which are free. A self-found Avenger clears Hell without a single item that would be worth trading. What it cannot do self-found is fix the skill-point shortfall, because that needs +skills gear.",

  levelingPath: {
    summary:
      "Level as a Zealot. Zeal is Vengeance's prerequisite so the point is not wasted, and Vengeance itself is weak until several synergies are invested — swinging it at level 18 with no Conviction is worse than Zeal in every way. Switch when Conviction is available at 30 and you have enough points to make the synergies mean something, which realistically is somewhere in Nightmare.",
    respecAt: "Level 30 at the earliest; Nightmare in practice",
    viaBuild: "zealot",
  },

  confidence: "verified",
  complete: true,
};
