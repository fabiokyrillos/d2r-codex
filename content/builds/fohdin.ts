import type { Build } from "@/lib/types";

/**
 * The FoHdin.
 *
 * The only ranged Paladin the site documents, and the only Paladin build that
 * deals two damage types at once.
 *
 * Verified against the game's own skills.txt:
 * - Fist of the Heavens is `EType = ltng` — the bolt itself is lightning.
 * - Holy Bolt is `EType = mag` — the waves that spread out are magic damage.
 * - Fist of the Heavens requires **level 30**, and so does Conviction. This
 *   build genuinely cannot exist before 30, which is why the levelling section
 *   is not optional advice.
 * - Fist of the Heavens creates 6 Holy Bolt missiles at level 1 and one more
 *   per level, so the area coverage scales directly with points spent.
 * - Conviction reduces resistances by 30% at level 1 and 5% more per level.
 *
 * The two hybrid variants the research found — Smite/FoH ("Vindicator Templar")
 * and FoH/Blessed Hammer ("Tri-Brid") — are documented in flexPoints rather
 * than as separate builds, because both keep this skill core and change only
 * which second button is bound. See `docs/research/01-paladin-builds.md`.
 */
export const fohdin: Build = {
  slug: "fohdin",
  name: "FoHdin",
  classSlug: "paladin",
  summary:
    "Lightning at range with magic waves that shred Undead and Demons, and an aura that breaks lightning immunity. The Paladin that fights from a distance.",
  damageTypes: ["lightning", "magic"],
  primarySkill: "fist-of-the-heavens",
  playstyle:
    "You pick a target at maximum range, cast, and the bolt lands on it while Holy Bolts spray outward through everything nearby. Conviction runs constantly and strips resistance off anything in range, which is what makes the lightning half work in Hell. Against a pack you aim at the middle and let the waves do the clearing; against a single elite you name-lock it and hold the button. It is the highest-actions-per-minute Paladin on the site and the only one that never has to be in melee range.",
  strengths: [
    "Two damage types at once — lightning from the bolt, magic from the Holy Bolt waves",
    "Conviction breaks lightning immunity on naturally immune monsters, so the build's own wall mostly disappears",
    "Ranged. The whole class of problems that comes from standing next to things does not apply",
    "Holy Shield still gives maximum block, so it is a ranged build that survives being reached",
    "Party support: Conviction helps every elemental character standing near you",
  ],
  weaknesses: [
    "Nothing before level 30. Fist of the Heavens and Conviction unlock at the same level and the build does not exist until then",
    "High actions per minute — this is not a hold-one-button build",
    "Magic immunity blunts the Holy Bolt half, and a few monsters resist both halves",
    "Needs 125% Faster Cast Rate to feel good, which is a real gear requirement",
    "Damage is skill-point hungry: the bolt, the synergy, the aura and the shield all want maxing",
  ],
  difficulty: "advanced",
  budget: "medium",
  ratings: {
    clearSpeed: 4,
    bossing: 4,
    survivability: 4,
    magicFind: 4,
    terrorZones: 4,
    ubers: 3,
    soloSelfFound: 3,
    players8: 4,
  },

  skills: [
    {
      skill: "fist-of-the-heavens",
      points: 20,
      role: "main",
      order: 1,
      note: "Level 30. Six Holy Bolt waves at one point and one more per level, so every point widens the clear as well as raising the damage.",
    },
    {
      skill: "holy-bolt",
      points: 20,
      role: "synergy",
      order: 2,
      note: "The damage synergy, and it is also the magic-damage half of what you fire. Max it second.",
    },
    {
      skill: "conviction",
      points: 20,
      role: "main",
      order: 3,
      note: "Your active aura. 30% resistance reduction at level 1 and 5% more per level — at 20 that is 125%, and gear pushes it higher. This is what breaks lightning immunity.",
    },
    {
      skill: "holy-shield",
      points: 20,
      role: "utility",
      order: 4,
      note: "Block and defence. The most flexible of the four — if you are short of points, this is the one to leave under-invested.",
    },
    { skill: "sacrifice", points: 1, role: "prerequisite", note: "On the way to Holy Bolt." },
    { skill: "blessed-hammer", points: 1, role: "prerequisite", note: "A prerequisite for Fist of the Heavens, and the seed of the Tri-Brid variant." },
    { skill: "smite", points: 1, role: "prerequisite", note: "On the way to Holy Shield, and the seed of the Smite hybrid." },
    { skill: "might", points: 1, role: "prerequisite" },
    { skill: "holy-fire", points: 1, role: "prerequisite" },
    { skill: "holy-freeze", points: 1, role: "prerequisite", note: "On the way to Conviction, and a useful slow if you ever need one." },
    { skill: "holy-shock", points: 1, role: "synergy", note: "**Fist of the Heavens' damage synergy, +7% per level.** One point here because the build's points are committed elsewhere — maxing it is the documented alternative below." },
    { skill: "sanctuary", points: 1, role: "prerequisite", note: "On the way to Conviction. It also knocks back Undead, which is occasionally the thing that saves you." },
    { skill: "blessed-aim", points: 1, role: "prerequisite" },
    { skill: "concentration", points: 1, role: "prerequisite" },
    {
      skill: "fanaticism",
      points: 1,
      role: "utility",
      note: "Not for you — for your mercenary. Swap to it when you meet something Conviction cannot break and let him kill it.",
    },
    { skill: "prayer", points: 1, role: "prerequisite" },
    { skill: "defiance", points: 1, role: "prerequisite" },
    { skill: "vigor", points: 1, role: "utility", note: "Run speed before Enigma." },
    { skill: "cleansing", points: 1, role: "prerequisite" },
    { skill: "meditation", points: 1, role: "utility", note: "Mana regeneration. A useful aura, not a prerequisite." },
    { skill: "redemption", points: 1, role: "utility", note: "Life and mana from corpses. On a caster with no life steal this is the whole sustain plan." },
    { skill: "resist-fire", points: 1, role: "utility" },
    { skill: "resist-cold", points: 1, role: "utility" },
    { skill: "resist-lightning", points: 1, role: "utility", note: "Maximum lightning resistance, which matters in exactly the zones you want to farm." },
    { skill: "salvation", points: 1, role: "utility", note: "A one-point resistance aura for the moments Conviction is the wrong choice." },
    {
      skill: "zeal",
      points: 1,
      role: "prerequisite",
      note: "Vengeance's prerequisite, on the path to Conversion and then Fist of the Heavens.",
    },
    {
      skill: "vengeance",
      points: 1,
      role: "prerequisite",
      note: "Conversion's prerequisite. The FoHdin never swings it.",
    },
    {
      skill: "conversion",
      points: 1,
      role: "prerequisite",
      note: "**Fist of the Heavens requires Blessed Hammer and Conversion.** This is the point most FoHdin guides forget.",
    },
    {
      skill: "thorns",
      points: 1,
      role: "prerequisite",
      note: "**Sanctuary requires Holy Freeze and Thorns**, and Sanctuary opens Conviction.",
    },
    {
      skill: "charge",
      points: 1,
      role: "prerequisite",
      note: "Holy Shield's prerequisite, together with Blessed Hammer.",
    },
  
  ],
  flexPoints: [
    "**The build is genuinely point-hungry.** Four maxed skills plus the prerequisite chains to Conviction and Fist of the Heavens is most of a character. Expect to be finishing Holy Shield somewhere in the high eighties.",
    "**Smite hybrid (\"Vindicator Templar\").** Put your remaining points into Fanaticism, carry a Grief, and bind Smite as a second button. Fist of the Heavens clears the room and Smite kills the boss. It costs you nothing structurally because Smite is already a prerequisite.",
    "**Blessed Hammer hybrid (\"Tri-Brid\").** Blessed Hammer is already a prerequisite; investing in it plus Concentration gives you a magic-damage answer for the packs Conviction cannot help with. Pair with Heaven's Light and Gore Rider for a Crushing Blow bossing option.",
    "**More Resist Lightning** if you farm zones full of lightning enemies. It raises your maximum resistance rather than your current one, which is the half Conviction cannot take from you.",
  ],
  stats: {
    strength: "Only what your gear needs. A Spirit Monarch asks 156 and is the usual reason the number is not tiny; a Herald of Zakarum asks far less.",
    dexterity:
      "Enough for maximum block **with Holy Shield running**. Unlike the melee Paladins there is no weapon requirement pushing this higher, so the number is genuinely just the block requirement.",
    vitality: "Everything else.",
    energy: "None. Redemption plus an Insight mercenary covers a caster's mana perfectly well.",
    notes: [
      "**Decide the shield before you spend Strength.** Spirit in a Monarch costs 156 Strength; Spirit in a Sacred Targe costs a fraction of that at the price of some defence. Herald of Zakarum sits between them.",
      "**Check block with Holy Shield on.** The same trap that catches every Paladin.",
      "Faster Cast Rate comes entirely from gear. No stat point contributes to it.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 125,
      frames: 9,
      priority: "recommended",
      why: "The endgame target and the one that makes the build feel fast. Heart of the Oak (40) plus two Spirits (70) plus a 20% ring already passes it.",
    },
    {
      stat: "fcr",
      value: 75,
      frames: 10,
      priority: "required",
      why: "The minimum for the build to play acceptably. Two Spirits alone get you to 70, so this is a low bar once you have them.",
    },
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "recommended",
      why: "You fight at range but you get reached, and a ranged build that is stun-locked is a dead one.",
    },
    {
      stat: "fbr",
      value: 32,
      frames: 3,
      priority: "luxury",
      why: "Worth having if you have committed to maximum block, and worth nothing if you have not.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 30. You are not a FoHdin yet and pretending otherwise wastes a character.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and up to 35% Faster Cast Rate at level 25. Every Paladin caster starts here.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket Crystal Sword.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "Resistances while you level, from three Countess runes.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "25% Faster Cast Rate at level 17." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate at level 23." }],
        },
      ],
      nextUpgrade:
        "Level 30, and then a second Spirit. Fist of the Heavens and Conviction arrive together and the character changes completely.",
      notes:
        "Level with Zeal or Blessed Hammer. Blessed Hammer is the better choice here because it is already a prerequisite — the points are not wasted.",
    },

    {
      tier: "nightmare",
      goal: "Fist of the Heavens working, 75% Faster Cast Rate, resistances climbing.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Still the best value weapon in the game for a Paladin caster.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A second Spirit in a shield. Two Spirits are +4 skills and 70% Faster Cast Rate, which is most of the way to the breakpoint that matters.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield. A Sacred Targe needs far less Strength than a Monarch.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "herald-of-zakarum" },
                  why: "More resistances and skills, no Faster Cast Rate at all. Check your breakpoint before switching — this is the classic way a Paladin loses a frame without noticing.",
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
              why: "+1 skills, 30% Faster Cast Rate and up to +35 all resistances, at 43 Strength. The standard caster armour.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find until a Shako appears." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana on a build with no Energy." }],
        },
      ],
      charms: [
        { label: "Resistance and life small charms", why: "The cheapest route to 75% before Hell." },
      ],
      nextUpgrade: "Conviction maxed, and an Insight for the mercenary so mana stops being a consideration.",
    },

    {
      tier: "early-hell",
      goal: "Enter Hell with capped resistances and a Conviction that breaks lightning immunity.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Unchanged until Heart of the Oak." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Second Spirit. 70% Faster Cast Rate between the two." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "Resistances and cast rate together, cheaply.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "+2 skills and +65 all resistances. The upgrade, when the runes appear.",
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
              why: "+2 skills, life, mana, 50% magic find and 10% damage reduction, at 50 Strength.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 all skills and +20-30 all resistances. Both halves matter here.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              label: "Rare ring with 10% Faster Cast Rate and resistances",
              why: "The cheapest remaining source of cast rate, and it carries resistance you still need.",
              lookFor: ["10% Faster Cast Rate", "Two or more resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "sandstorm-trek" },
              why: "Faster Hit Recovery, Strength and Vitality. The Strength is what pays for a Monarch if you go that way.",
            },
          ],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "Hold 75% in all four." }],
      nextUpgrade: "125% Faster Cast Rate, then Enigma.",
      notes:
        "Conviction is the difference between this build working in Hell and not. Get it maxed before you worry about any gear upgrade above.",
    },

    {
      tier: "budget",
      goal: "Farm Hell reliably at 125% Faster Cast Rate.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "+3 skills, 40% Faster Cast Rate and up to +40 all resistances. The single biggest upgrade the build makes.",
              sockets: "Ko, Vex, Pul, Thul into a 4-socket Flail — the cheapest base that takes it.",
              alternatives: [
                { ref: { kind: "runeword", slug: "spirit" }, why: "Keep the Spirit until Heart of the Oak is actually in hand. It is 35% versus 40%, not a chasm." },
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
              why: "The last 10% that carries you over the 125% line.",
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
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills and +10-20 all resistances." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Resistance small charms", why: "Whatever holds the cap." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders. A caster with no life steal wants the life." },
      ],
      nextUpgrade: "Enigma, and Infinity on the mercenary if you intend to farm lightning-heavy zones.",
    },

    {
      tier: "optimized",
      goal: "Fast, safe Hell farming with real magic find.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "heart-of-the-oak" }, why: "+3 skills, 40% Faster Cast Rate, resistances." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "35% Faster Cast Rate. A Monarch base if you have the Strength, a Sacred Targe if you would rather spend it elsewhere.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "herald-of-zakarum" },
                  why: "Take it only if you can hold 125% Faster Cast Rate without the Spirit. Most setups cannot.",
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
              why: "Teleport. It changes how much of the game you can farm more than any damage upgrade left.",
              sockets: "Jah, Ith, Ber into a 3-socket body armour.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, magic find, damage reduction." }],
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
              why: "The slot where a rare beats every unique for this build.",
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
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Lightning skill grand charms", why: "Direct damage on a build whose main hit is lightning." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Infinity on the mercenary. Two Conviction auras do not stack, but his frees you to run Fanaticism for him.",
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
              why: "A maximum roll: +40 all resistances alongside the +3 skills and 40% cast rate.",
              lookFor: ["+40 all resistances", "Flail or Mace base"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A 35% Faster Cast Rate roll in a Monarch.",
              lookFor: ["35% Faster Cast Rate", "Monarch base with 4 sockets"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "Socket it with a lightning facet for direct damage, or an Um rune for resistances.",
              lookFor: ["2 sockets"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate and +1 fire skills." }],
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
              lookFor: ["10% Faster Cast Rate", "Two resistances at 20+", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find, or Sandstorm Trek for the Faster Hit Recovery." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills, 20 all resistances." },
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Lightning skill grand charms with life", why: "Damage and life in the same slot." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "Above 125% Faster Cast Rate there is nothing to buy but damage and resistance. This is the point where the Smite or Blessed Hammer hybrid becomes worth the remaining skill points.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Take **Might** for his damage, and give him an **Insight** immediately — Meditation solves a caster Paladin's mana permanently and costs four common runes. Later, **Infinity** on his polearm is the upgrade that matters: his Conviction and yours do not stack, but with him carrying it you can run **Fanaticism** instead and get the attack speed and damage into him while your Conviction effect still applies. A **Reaper's Toll** is the cheaper version of the same idea through Decrepify.",

  farming: [
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Almost everything here is Undead or a Demon, which is exactly what the Holy Bolt waves are for. The best FoHdin zone in the game.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85, dense, and full of Demons. Conviction handles the lightning immunes it does spawn.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and a short route, and Conviction covers the lightning immunes.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85 and almost entirely Undead. Holy Bolt is at its best here.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are lightning immune, but Conviction breaks naturally occurring lightning immunity — and they are Demons, so the Holy Bolt half lands regardless. Verify your Conviction level before relying on this.",
      minTier: "optimized",
      rating: 3,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Undead, ten seconds from a portal, and dies to a single cast at range.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 with no lightning immunes worth worrying about. Comfortable, if less rewarding than the Undead-heavy zones.",
      minTier: "early-hell",
      rating: 3,
    },
  ],

  immunityPlan:
    "This is the Paladin with the best answer to immunity and it comes from two directions at once. **Conviction reduces resistance by 30% at level 1 and 5% more per level**, which at level 20 is 125% and higher with +skills gear; that is enough to break naturally occurring lightning immunity on the monsters you will actually meet. Where it is not, the **Holy Bolt waves are magic damage** and land anyway, because lightning immunity and magic immunity are different things. The genuine wall is a monster immune to both, and there are few of them. The practical fallback is your mercenary: put one point in Fanaticism, swap to it, and let him kill what you cannot. Note that Conviction is capped in how far it can push a monster below zero resistance, so a monster at very high lightning resistance stays effectively immune no matter how much +skills you stack.",

  hardcoreNotes:
    "A good Hardcore build with one structural caveat. Fighting at range plus maximum block plus Holy Shield is an unusually safe combination, and Conviction lets you kill things before they arrive. The caveat is the **levelling gap**: this build does not exist before level 30, so a Hardcore FoHdin spends its most fragile thirty levels playing something else. Level as a Blessed Hammer Paladin — the points are prerequisites either way — and treat the transition as the moment the character becomes safe rather than the moment it becomes strong.",

  selfFoundNotes:
    "Reasonable self-found, with one hard dependency: two Spirits. Both are four Countess runes each, so they are farmable rather than tradeable, but you do need eight runes and two 4-socket bases. After that the build works — Skin of the Vipermagi, Harlequin Crest and Mara's Kaleidoscope all drop in Hell, and Heart of the Oak is an upgrade rather than a requirement. The 125% Faster Cast Rate breakpoint is the part that genuinely needs trading or luck.",

  levelingPath: {
    summary:
      "You cannot level as a FoHdin. Fist of the Heavens and Conviction both unlock at level 30, and the prerequisite chain to Conviction runs through five skills you have no other use for. Level as a Blessed Hammer Paladin — Blessed Hammer and Holy Bolt are both prerequisites, so nothing is wasted — and use the free Den of Evil respec at 30 or later to convert. Nightmare is the natural place to make the switch.",
    respecAt: "Level 30 at the earliest, more comfortably in Nightmare",
    viaBuild: "hammerdin",
  },

  confidence: "verified",
  complete: true,
};
