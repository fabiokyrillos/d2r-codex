import type { Build } from "@/lib/types";

/**
 * The Apocalypse Warlock — the Chaos tree's fire half.
 *
 * Three extracted facts shape this page more than anything else.
 *
 *   Apocalypse's base damage is 80-100 at level 1, several times anything else
 *   the class casts, and its synergy triangle is closed: Ring of Fire and Flame
 *   Wave each feed it 10% per level and feed each other at 10% and 15%. Sixty
 *   points buy the whole tree branch and there is nothing else to put them in.
 *
 *   The skill carries its own −5% to enemy fire resistance, +1% per level to a
 *   40-point ceiling. That is a pierce, not an immunity break — it is skipped
 *   entirely while an immunity stands. The build's answer to a fire immune is a
 *   Flame Rift or the void package, and the page says so rather than implying
 *   the pierce covers it.
 *
 *   Sixty-three of 110 points finish the core. That is the largest surplus of
 *   any Warlock build and it is why this page carries packages rather than a
 *   paragraph: forty-seven points is a second half of a character, and the two
 *   things worth doing with them are genuinely different characters.
 *
 * The gear has one number that reorganises the stat plan. A Blasphemous
 * Grimoire — the base under the class's best off-hand — asks **106 Strength**.
 * For a caster whose base is 15, that is most of a stat plan, and every tier
 * below `bis` is built around not paying it yet.
 */
export const apocalypseWarlock: Build = {
  slug: "apocalypse-warlock",
  name: "Apocalypse Warlock",
  classSlug: "warlock",
  summary:
    "The largest single fire spell in the game, dropped on a radius nothing else the class covers, with a resistance pierce built into the skill.",
  damageTypes: ["fire"],
  primarySkill: "apocalypse",
  playstyle:
    "You cast one enormous spell and walk. Apocalypse covers a radius of 13 at one point and 17 at twenty, which is larger than anything else the Warlock puts on the ground, and it strips fire resistance off everything caught in it while it burns. Ring of Fire is the panic button for something that has closed the distance — sixteen missiles below ten hard points and thirty-two above — and Flame Wave is the corridor tool. Sigil: Death goes down once per pack and executes anything that falls below a tenth of its life, which is the difference between clearing a room and finishing one. There is no aiming problem and no channelling; the decision is where to stand.",
  strengths: [
    "Apocalypse's 80-100 base is the largest damage table the class has by a factor of four",
    "A radius of 13 to 17 — the widest thing the Warlock can put on the ground",
    "The only resistance pierce in any Warlock skill, up to 40 points of enemy fire resistance",
    "The core finishes at 63 of 110 points, so the character is complete early and has a second half to spend",
    "Cheap to start: Ring of Fire is online at level 6 and carries most of Normal",
  ],
  weaknesses: [
    "Fire is the most commonly resisted element in Hell — this site's own area data records fire immunity in twelve of eighteen catalogued areas",
    "The skill's own pierce does nothing at all against a monster that is still immune",
    "Apocalypse does not unlock until level 30 and is not finished until the high eighties",
    "No movement skill without an Enigma; every point of the plan is in one tree",
    "The class has no fire mastery skill, so damage comes from hard points and gear alone",
  ],
  difficulty: "moderate",
  budget: "medium",
  ratings: {
    clearSpeed: 4,
    bossing: 4,
    survivability: 3,
    magicFind: 3,
    terrorZones: 4,
    ubers: 2,
    soloSelfFound: 3,
    players8: 4,
  },

  skills: [
    {
      skill: "apocalypse",
      points: 20,
      role: "main",
      order: 1,
      note: "The whole build. 80-100 at level 1, and the radius steps at ten and twenty hard points — 13, then 15, then 17.",
    },
    {
      skill: "flame-wave",
      points: 20,
      role: "synergy",
      order: 2,
      note: "+10% Apocalypse damage per level, and a usable corridor spell in its own right at 13-17 fire.",
    },
    {
      skill: "ring-of-fire",
      points: 20,
      role: "synergy",
      order: 3,
      note: "+10% Apocalypse damage per level. Also doubles its own missile count from sixteen to thirty-two at the tenth hard point, so it stays on the bar.",
    },
    {
      skill: "sigil-death",
      points: 1,
      role: "utility",
      note: "One point is the whole skill. The execute thresholds are a flat 13% of life for a normal monster and 10% for a champion, unique or superunique, and neither rises with level — points buy radius and nothing else.",
    },
    { skill: "sigil-rancor", points: 1, role: "prerequisite" },
    { skill: "sigil-lethargy", points: 1, role: "prerequisite" },
  ],

  skillPackages: [
    {
      id: "the-second-half",
      name: "The second half",
      choose: "one",
      intro:
        "The core is 63 points and every synergy in it is maxed. Forty-seven points is not a rounding error — it is a second character, and the two useful things to do with it lead to different places. Take one.",
      packages: [
        {
          id: "void-answer",
          name: "The void answer",
          when: "You intend to play Hell on this character and you do not want twelve of the site's eighteen catalogued areas closed to you. Miasma Chain is magic damage, which one area in the whole catalogue records an immunity to.",
          tradeoff:
            "Forty points that could have been demons. You get a second damage type and no additional survivability whatsoever — this route is a glass cannon with two barrels.",
          skills: [
            { skill: "apocalypse", points: 20, role: "main", order: 1 },
            { skill: "flame-wave", points: 20, role: "synergy", order: 2 },
            { skill: "ring-of-fire", points: 20, role: "synergy", order: 3 },
            { skill: "sigil-death", points: 1, role: "utility" },
            { skill: "sigil-rancor", points: 1, role: "prerequisite" },
            { skill: "sigil-lethargy", points: 1, role: "prerequisite" },
            {
              skill: "miasma-chain",
              points: 20,
              role: "main",
              order: 4,
              note: "The second bar. 6-9 magic and three to twelve bolts per cast.",
            },
            {
              skill: "miasma-bolt",
              points: 20,
              role: "synergy",
              order: 5,
              note: "+10% Miasma Chain damage per level.",
            },
          ],
          rotationNote:
            "Apocalypse on everything, and Miasma Chain on anything the fire did not move. You are not switching builds mid-fight — you are switching elements, which is a keypress.",
          contentNote:
            "Chaos Sanctuary, Travincal, the Kurast Temples and River of Flame all record fire immunity. This is the package that lets you run them.",
          remainderNote:
            "Seven points spare at 103 of 110. Both remaining sinks step at ten and twenty hard points and seven reaches neither from one, so put them in Sigil: Death and take the radius at the next three level-ups.",
        },
        {
          id: "demon-wall",
          name: "The demon wall",
          when: "You are playing Hardcore, or you are playing solo and would rather not be the only thing in the room. Three demons with Blood Oath behind them absorb what would otherwise reach a caster with 3 life per point of Vitality.",
          tradeoff:
            "You keep no answer to a fire immune except a Flame Rift, and until one drops you skip those packs. That is a real cost and this page will not pretend otherwise.",
          skills: [
            { skill: "apocalypse", points: 20, role: "main", order: 1 },
            { skill: "flame-wave", points: 20, role: "synergy", order: 2 },
            { skill: "ring-of-fire", points: 20, role: "synergy", order: 3 },
            { skill: "sigil-death", points: 1, role: "utility" },
            { skill: "sigil-rancor", points: 1, role: "prerequisite" },
            { skill: "sigil-lethargy", points: 1, role: "prerequisite" },
            {
              skill: "summon-goatman",
              points: 1,
              role: "utility",
              note: "One point summons them; how many you get is decided by Demonic Mastery, not here.",
            },
            {
              skill: "demonic-mastery",
              points: 20,
              role: "utility",
              order: 4,
              note: "Five hard points take the cap from one demon to two and ten take it to three. Nothing else in the game moves that number, and +skills from gear do not — both thresholds read hard points.",
            },
            {
              skill: "blood-oath",
              points: 20,
              role: "utility",
              order: 5,
              note: "Sends up to 30% of the damage you take to a demon instead, and raises their life by 50% plus 35% per level so they survive receiving it.",
            },
          ],
          statNote:
            "Vitality matters slightly less here, because a share of the damage never reaches you. It still gets everything spare.",
          rotationNote:
            "Summon three before the pack, then cast exactly as before. The demons are not a damage source and should not be waited for.",
          remainderNote: "Six points spare at 104 of 110. Sigil: Lethargy takes them toward its ten-point radius step.",
        },
      ],
    },
  ],

  stats: {
    strength: "Enough for your off-hand, and read the note — this is the stat the class breaks the usual advice on.",
    dexterity: "Base. Nothing in the plan reads it and a Grimoire blocks without it.",
    vitality: "Everything that is left, at every level.",
    energy: "None. Mana comes from the gear and from Insight on the mercenary.",
    notes: [
      "**The Strength requirement is the stat plan.** The class's best off-hand, a Blasphemous Grimoire, asks **106 Strength** against a base of 15. Every other caster on this site is told to leave Strength alone, and that advice is wrong here.",
      "So the tiers below `bis` are deliberately built on lighter bases. A **Burnt Text asks 38** and an **Occult Tome asks 82** — the same slot at a third and at four fifths of the cost. Choose the off-hand first and let it set the Strength number, rather than the other way round.",
      "**Levitation Mastery reduces item requirements by 2% per level to a −50% floor**, and if that applies to armour as well as weapons it would halve the number above. Its passive is gated on holding exactly one weapon, and nothing reached so far establishes whether the reduction is weapon-only. It is not assumed here, and no point is budgeted for it.",
      "Dexterity stays at base even though a Grimoire can block. A caster who is being hit has already made the mistake that matters, and 12 points of block chance is not the fix.",
    ],
  },

  breakpoints: [
    {
      stat: "fcr",
      value: 75,
      frames: 10,
      why: "The standard target, and the Warlock shares the Paladin and Necromancer table rather than having one of its own. Reachable with Spirit and one faster-cast ring.",
      priority: "required",
    },
    {
      stat: "fcr",
      value: 125,
      frames: 9,
      why: "The last breakpoint on the table. One frame for fifty percent more Faster Cast Rate, which is worth it only once the rest of the gear is finished.",
      priority: "luxury",
    },
    {
      stat: "fhr",
      value: 56,
      frames: 7,
      why: "The usual target on the Necromancer/Druid/Warlock table. A caster that is being interrupted is not casting.",
      priority: "recommended",
    },
  ],
  breakpointNotes:
    "There is no attack-speed row here and there is none anywhere on this site: no Increased Attack Speed table is published for any class, because weapon speed depends on the base weapon and the animation rather than on the character alone. Nothing in this build swings a weapon, so nothing is lost by its absence.",

  gearSets: [
    {
      tier: "starter",
      goal: "Ring of Fire from level 6, and enough resistance to reach Nightmare.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any staff, wand or sceptre with +to Warlock skills",
              why: "The Warlock levitates the weapon, so a two-handed staff costs you nothing in the off-hand. This is the one class that can take the biggest +skills stick it finds and still hold a Grimoire.",
              lookFor: ["+1-3 to Warlock Skills", "+to Ring of Fire", "Faster Cast Rate"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "Any Grimoire with +to Warlock skills",
              why: "Grimoires are the class's own off-hand — a shield-equivalent restricted to the Warlock that rolls staffmods. Normal-tier bases ask between 12 and 25 Strength, so any of them is free at this level.",
              lookFor: ["+2 to Warlock Skills", "+to Ring of Fire", "2 sockets"],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "Faster cast rate, hit recovery and run speed for two runes from the Countess.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            { ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills for two runes, which is a level of Ring of Fire you have not earned yet." },
          ],
        },
        {
          slot: "belt",
          picks: [{ label: "Any belt with life and resistance", why: "Nothing clever. Four rows and whatever resistance it happens to carry." }],
        },
        {
          slot: "boots",
          picks: [{ label: "Any boots with Faster Run/Walk and resistance", why: "Movement is survivability on a build with no movement skill." }],
        },
      ],
      nextUpgrade: "A Spirit in any four-socket sword the moment you have Tal, Thul, Ort and Amn.",
    },
    {
      tier: "nightmare",
      goal: "Flame Wave online, 75% Faster Cast Rate, and resistances that survive the Nightmare penalty.",
      levelRange: [30, 50],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 to All Skills and 25-35% Faster Cast Rate in a four-socket sword. A Warlock can hold a sword like anyone else, and this is the cheapest +2 skills in the game.",
              sockets: "Tal Thul Ort Amn in a four-socket Crystal Sword.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "Any Grimoire with +2 Warlock skills and a Chaos tab",
              why: "The Warlock's skill tabs are 21, 22 and 23 — demon, eldritch and chaos. A +2 Chaos tab on a Grimoire is worth two levels of Apocalypse before you can cast it.",
              lookFor: ["+2 to Warlock Skills", "+2 to Chaos Skills", "Faster Cast Rate"],
              alternatives: [
                { ref: { kind: "runeword", slug: "rhyme" }, why: "Two runes, all resistances and cannot be frozen. It fits a Grimoire because a Grimoire is a shield by type — and because it is two runes, which is the whole trick." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            { ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 to All Skills, 30% Faster Cast Rate and 20-35% all resistance in one cheap armour. The default Nightmare body for every caster and no less so here." },
          ],
        },
        {
          slot: "helm",
          picks: [
            { ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 to All Skills and magic find while nothing better exists." },
            { ref: { kind: "runeword", slug: "lore" }, why: "The same +1 skills for less, if the Tarnhelm has not dropped." },
          ],
        },
        {
          slot: "gloves",
          picks: [
            { ref: { kind: "unique", slug: "magefist" }, why: "+1 to Fire Skills and 20% Faster Cast Rate. The only pair of gloves in the catalogue that raises this build's damage." },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Faster cast is not on it, but 50% of damage taken goes to mana and the resistances are free." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "Life, Dexterity and a large stamina pool for a build that walks everywhere." }],
        },
        {
          slot: "amulet",
          picks: [{ label: "Any amulet with +2 Warlock skills", why: "Two levels of everything. A rare or magic amulet does this for almost nothing and is worth gambling for." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Magic find while the rings are placeholders." }],
        },
      ],
      nextUpgrade: "The Coven runeword the moment a helm with three sockets and an Ist rune line up.",
    },
    {
      tier: "early-hell",
      goal: "Apocalypse cast, 75% Faster Cast Rate held, and resistances back at maximum after the Hell penalty.",
      levelRange: [50, 70],
      slots: [
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "coven" },
              why: "Ist, Ral and Io in a three-socket helm: +1 to All Skills, 20% Faster Cast Rate, and 26-40% magic find once Ist's own helm modifier is counted. An expansion runeword and one of the cheapest +1 skills helms in the game.",
              sockets: "Ist Ral Io in any three-socket helm. A Circlet keeps the Strength requirement near zero.",
            },
          ],
        },
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Still the best cast-rate weapon at this tier, and still +2 skills." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "Measured Wrath",
              why: "A Burnt Text at level 52: +1 to Warlock skills, +1-3 Ring of Fire, +1-3 Flame Wave, 25% Faster Cast Rate and +20-30 all resistance. It asks 38 Strength, which is the point — this is the elite off-hand's job done at a third of the stat cost.",
              lookFor: ["+3 Ring of Fire", "+3 Flame Wave", "+30 all resistance"],
              alternatives: [
                { ref: { kind: "runeword", slug: "vigilance" }, why: "Dol and Gul in a Grimoire — all resistances, life, mana and a large defence bonus. It is Grimoire-first by type and it is two runes, which is the only rune count a Grimoire can take." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "Unchanged. Nothing at this tier beats +1 skills and 30% Faster Cast Rate for the price." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Unchanged, and still the only fire gloves." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to All Skills and 20% Faster Cast Rate. The single largest cast-rate item in the game outside a weapon." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Strength, Vitality, poison length reduction, and it is the boot that helps pay the Grimoire's Strength bill." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "the-cats-eye" }, why: "30% Faster Run/Walk and 20% Increased Attack Speed you will not use — taken for the speed and the Dexterity, and replaced by Mara's the moment one drops." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to All Skills and the mana pool that lets you keep casting." }],
        },
        {
          slot: "ring2",
          picks: [{ label: "Any rare ring with 10% Faster Cast Rate and resistance", why: "The cheapest ten points of cast rate on the character, and the slot where the 75 breakpoint is usually closed." }],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "flame-rift" }, why: "Sunders fire immunity at the cost of 70 to 90 points of your own fire resistance. This is the item that opens twelve of the eighteen catalogued areas to this build, and it is worth reorganising the rest of the gear around.", tradeOnly: false },
      ],
      nextUpgrade: "Harlequin Crest, and then the decision about whether to pay 106 Strength.",
    },
    {
      tier: "budget",
      goal: "Every area open, and the character finished apart from the two expensive slots.",
      levelRange: [70, 85],
      slots: [
        {
          slot: "helm",
          picks: [
            { ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 to All Skills, life and mana per level, 10% damage reduction and 50% magic find. Two levels of Apocalypse and a fifth of a survivability plan in one slot." },
            { ref: { kind: "runeword", slug: "coven" }, why: "Keep the Coven instead if the cast rate is what closes your breakpoint. The Shako is more skills; the Coven is more speed." },
          ],
        },
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Held until Heart of the Oak. There is no cheaper +2 skills and 35% cast rate in the game." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "Ars Dul'Mephistos",
              why: "An Occult Tome at level 78: +2 to Warlock skills, 20-30% Faster Cast Rate, and 10-20% to Enemy Magic Resistance. The magic pierce is dead weight on this build — it is here for the two skills and the cast rate, and for the 82 Strength rather than 106.",
              lookFor: ["+2 Warlock Skills", "30% Faster Cast Rate"],
              alternatives: [
                { label: "Measured Wrath", why: "Keep the Burnt Text if 82 Strength is more than you want to pay. Three levels of Ring of Fire and Flame Wave against two of everything is closer than it looks." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            { ref: { kind: "runeword", slug: "authority" }, why: "Hel, Shael and Ral in a three-socket body armour: +2 to Warlock skills, 40-60% enhanced defence, and a chance to cast Miasma Chains when struck. An expansion runeword that does for the body slot what Spirit does for the weapon." },
            { ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "If the cast rate is needed more than the second skill level." },
          ],
        },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Unchanged." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "Unchanged." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and Strength, both of which this build wants for different reasons." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 to All Skills and +20-30 to all resistances, which is most of a Flame Rift's cost paid back." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ label: "Any rare ring with 10% Faster Cast Rate, resistance and life", why: "Still where the breakpoint is closed." }] },
      ],
      charms: [
        { ref: { kind: "unique", slug: "flame-rift" }, why: "Now mandatory rather than a luxury. Twelve of eighteen areas record fire immunity and this build has no other answer to one." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders on a character with 3 life per point of Vitality is a larger percentage gain than it is for anyone else." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The other half of the swap." },
      ],
      nextUpgrade: "Heart of the Oak, and the Strength to wear a Blasphemous Grimoire under it.",
    },
    {
      tier: "optimized",
      goal: "125% Faster Cast Rate, and the class's own signature loadout: a two-handed weapon and an off-hand at once.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "+3 to All Skills and 40% Faster Cast Rate in a four-socket staff. **A staff is two-handed and the Warlock levitates it**, so this is the one class in the game that wears the best caster weapon and keeps its off-hand. No other character can do this and no generic gear guide will tell you to.",
              sockets: "Ko Vex Pul Thul in a four-socket staff. A Warlock has no reason to use the mace version.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "Ars Al'Diablolos",
              why: "A Blasphemous Grimoire at level 80: **+2 to Chaos Skills, +3-5 to Apocalypse, +15-25% to Fire Skill Damage**, 25% Faster Cast Rate and +20-30 fire resistance. It is the only item in the game that raises this build's damage twice — once through skill levels and once through a damage multiplier the class has no skill for.",
              lookFor: ["+5 to Apocalypse", "+25% to Fire Skill Damage", "+30 Fire Resist"],
              alternatives: [
                { label: "Ars Dul'Mephistos", why: "82 Strength instead of 106, and no Fire Skill Damage. The Strength difference is roughly twenty stat points, which is 60 life." },
              ],
            },
          ],
        },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "Unchanged, and socketed with a facet or a perfect ruby." }] },
        {
          slot: "body",
          picks: [
            { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport. The build has no movement skill of its own and this is the only one available to it." },
            { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "If a Jah is out of reach: +2 skills, +65 all resistances and 8% damage reduction." },
            { ref: { kind: "runeword", slug: "authority" }, why: "The cheapest of the three and still +2 Warlock skills." },
          ],
        },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Unchanged. There is still nothing else with +Fire Skills on it." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "Unchanged." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Unchanged, and its Strength is now load-bearing." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "Unchanged." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "A second one, once the cast-rate breakpoint is closed elsewhere." }] },
      ],
      charms: [
        { ref: { kind: "unique", slug: "flame-rift" }, why: "Unchanged and still mandatory." },
        { label: "Grand charms with +1 to Chaos Skills", why: "The Chaos tab is 23 and the charm exists. Nine of them is nine levels of Apocalypse, which is the cheapest damage on the character." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Unchanged." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Unchanged." },
      ],
      nextUpgrade: "Nothing structural. Facets in the helm and body, and better rolls on the same items.",
    },
    {
      tier: "bis",
      goal: "Nothing left to change.",
      levelRange: [90, 99],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "heart-of-the-oak" }, why: "Two-handed and free of charge, which remains the single best thing about playing this class." }] },
        {
          slot: "offhand",
          picks: [
            { label: "Ars Al'Diablolos", why: "Rolled at +5 Apocalypse and +25% Fire Skill Damage. There is no second candidate.", lookFor: ["+5 to Apocalypse", "+25% to Fire Skill Damage"] },
          ],
        },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "Socketed with a Rainbow Facet of fire." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport is worth more than any statline that would replace it." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Unchanged, and the point at which the catalogue runs out of fire gear." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "Unchanged." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Unchanged." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "Unchanged." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
      ],
      charms: [
        { ref: { kind: "unique", slug: "flame-rift" }, why: "Unchanged." },
        { label: "Nine grand charms with +1 to Chaos Skills and life", why: "The last nine levels of Apocalypse anyone is going to give you." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Unchanged." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Unchanged." },
      ],
      notes:
        "There is no fire helm, no fire body armour and no fire amulet in the catalogue that a Warlock can wear — the three orbs that carry +% Fire Skill Damage are Sorceress-restricted. Ars Al'Diablolos is the entire fire-damage gear plan, which is why the off-hand is worth 106 Strength.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Act 2, Nightmare, Might for damage or Holy Freeze for control — Holy Freeze is the better answer for a caster with no movement skill, because everything arrives slower. Insight in the polearm is the mana plan for the whole build: Apocalypse costs 32 mana at base plus 1 per level, and nothing in this plan spends a point on Energy.",

  farming: [
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85 two screens from the Cold Plains waypoint, and its recorded immunities are poison and cold — neither of which this build deals. A fire caster's best area in the game and almost nobody runs it.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Thirty seconds a run, cold and poison immunity recorded, and a single pack standing in one radius. Apocalypse is a spell you cast once here.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 with physical, cold and lightning immunity recorded and no fire immunity at all. The build's damage type is the one the zone does not answer.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "Poison immunity only, a short run, and a boss that stands still inside a radius of 17. Worth running long past the level her drops suggest.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "The densest zone in the game and the shape a 17-radius spell wants. Fire, lightning and physical immunity are all recorded here, so this needs a Flame Rift or the void package before it is worth the trip.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council stand in a heap, which is one cast. Fire and lightning immunity are recorded and the Council themselves are not fire immune, so the Flame Rift matters for the trash rather than the target.",
      minTier: "budget",
      rating: 3,
    },
  ],

  immunityPlan:
    "**Fire is the worst element to build on in Hell, and this site's own area data is the argument.** Twelve of the eighteen catalogued areas record fire immunity — Chaos Sanctuary, Travincal, the Kurast Temples, River of Flame, the Ancient Tunnels, Nihlathak's temple, Stony Tomb, the Maggot Lair, Lower Kurast, Mephisto, the Countess and the Worldstone Keep. That is the cost of the largest damage table in the class and it should be understood before the character is made.\n\n**Apocalypse's own pierce does not solve it.** The skill lowers enemy fire resistance by 5 points plus 1 per level to a 40-point ceiling. That is a −% to Enemy Fire Resistance line, and against a monster whose immunity still stands it is skipped entirely rather than reduced — it is worth nothing there, not a fraction. The pierce is what makes a resistant monster soft; it is not what makes an immune one killable.\n\nSo there are exactly two answers and the build has to take one.\n\n**A Flame Rift.** The fire sunder charm sets fire-immune monsters to a resistance you can actually reduce, at the cost of 70 to 90 points of your own fire resistance. It is the reason Mara's Kaleidoscope and Chains of Honor appear in the gear tiers where they do, and it is a level 75 drop, so it is a Hell-tier plan rather than a Nightmare one.\n\n**The void package.** Forty points into Miasma Chain and Miasma Bolt buys a second damage type on the same bar. Magic immunity is recorded in exactly one of the eighteen catalogued areas — the Arcane Sanctuary — so the second element closes almost everything the first one leaves open, and it does it without a drop.\n\nA character that takes neither is a Normal and Nightmare character. That is a real way to play and this page is not going to pretend it is a Hell plan.",

  hardcoreNotes:
    "Take the demon wall. Three demons with Blood Oath behind them send up to 30% of incoming damage somewhere that is not you, and a Warlock has 3 life per point of Vitality rather than the Sorceress's 2 — the class is sturdier than its role suggests and the package leans into that. The cost is that you have no answer to a fire immune until a Flame Rift drops, which in Hardcore is an argument for running the Mausoleum and Pindleskin rather than the Chaos Sanctuary anyway.",

  selfFoundNotes:
    "Spirit is four common runes from the Countess and Coven needs one Ist, so the cast-rate plan is reachable without trading. The off-hand is the problem: a Grimoire with +2 Warlock skills is a gamble target rather than a drop you wait for, and Measured Wrath at level 52 is the first one worth hunting. Until then any Grimoire with the Chaos tab on it beats a better-rolled one without.",

  levelingPath: {
    summary:
      "Ring of Fire at level 6 clears Normal on its own. Flame Wave at 18 replaces it for corridors and Apocalypse at 30 replaces both. Nothing in the plan is wasted and no respec is needed: every point spent on the way is a point the finished build wants.",
  },

  release: "reign-of-the-warlock",
  confidence: "single",
  complete: true,
};
