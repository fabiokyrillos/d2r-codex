import type { Build } from "@/lib/types";

/**
 * The Poison Javelin Amazon.
 *
 * The rarest of the eight and the one whose numbers are least often published
 * correctly, because poison is the only element whose damage column is not the
 * number the game shows. `EMin`/`EMax` are damage per frame in 256ths and the
 * duration lives in a separate column, so a reader of the extraction who treats
 * poison like every other element publishes zero. `scripts/damage.test.ts`
 * pins both of these:
 *
 *   Poison Javelin  level 1   25-37 poison over 8 seconds
 *   Plague Javelin  level 1   28-42 poison over 3 seconds
 *
 * The two skills are opposites and the page is built on the difference.
 * **Poison Javelin's duration grows** — 200 frames at level 1 plus 50 per level,
 * which is 46 seconds at level 20 — while **Plague Javelin's is fixed at 75
 * frames, three seconds**, as patch 2.4 made it. One is a long, cheap denial
 * effect along a line; the other is a short, heavy burst over an area.
 *
 * Poison is the second most resisted element in Hell on this site's own area
 * data — ten of twenty areas record it — so the build needs a second killer.
 * It is not a second attack: it is the Valkyrie, funded by twenty points of
 * Decoy for her life, twenty of Penetrate for her attack rating, and the
 * Critical Strike and avoidance levels she inherits from you.
 */
export const poisonJavelinAmazon: Build = {
  slug: "poison-javelin-amazon",
  name: "Poison Javelin Amazon",
  classSlug: "amazon",
  summary:
    "A line of poison that stops a pack regenerating for the better part of a minute, and a Valkyrie built to kill whatever poison cannot.",
  damageTypes: ["poison"],
  primarySkill: "poison-javelin",
  playstyle:
    "You throw a javelin across a group and it leaves poison behind it. Nothing dies immediately — poison is damage over time and this build never pretends otherwise — but everything you have hit stops regenerating and starts losing life while you throw the next one. Plague Javelin is the burst version: a cloud where the javelin stops, three seconds of far heavier damage, and the reason this build clears the Cow Level as fast as it does. Meanwhile a Valkyrie with four hundred percent more life than a one-point summon walks into the pack and kills whatever is poison immune. She is not a pet on this build; she is the second half of it.",
  strengths: [
    "**Poison stops a monster regenerating** for as long as it is applied, which at high levels is most of a minute",
    "Plague Javelin's cloud covers more ground than any other javelin attack — a Cow Level skill",
    "Cheap to run: 16 and 14 mana, no attack-rating requirement on the main skill, and a self-refilling javelin",
    "**A twenty-point Decoy makes the Valkyrie a real fighter**, and she inherits your Critical Strike and avoidance",
    "Bramble exists, and nothing else in the game offers poison skill damage in an armor slot",
  ],
  weaknesses: [
    "**Nothing dies when you hit it.** Poison is damage over time and the build feels slow even when it is fast",
    "Poison is the second most resisted element in Hell — ten of the twenty areas here record it",
    "Damage does not stack: a second application refreshes the poison rather than adding to it",
    "Corpses do not shatter and monsters die out of your sight, which makes loot collection its own chore",
    "No single-target burst at all. Bosses die on poison's schedule or on the Valkyrie's",
  ],
  difficulty: "advanced",
  budget: "medium",
  ratings: {
    clearSpeed: 3,
    bossing: 2,
    survivability: 4,
    magicFind: 3,
    terrorZones: 3,
    ubers: 1,
    soloSelfFound: 3,
    players8: 4,
  },

  skills: [
    {
      skill: "poison-javelin",
      points: 20,
      role: "main",
      order: 1,
      note: "**25-37 poison over 8 seconds at level 1, and the duration grows by 50 frames per level** — two seconds more each time. At twenty it is spread over the better part of a minute.",
    },
    {
      skill: "plague-javelin",
      points: 20,
      role: "main",
      order: 2,
      note: "**Fixed at three seconds since patch 2.4**, whatever its level. Far more damage packed into far less time, over a far wider area. This is the clearing button.",
    },
    {
      skill: "decoy",
      points: 20,
      role: "utility",
      order: 3,
      note: "**+20% Valkyrie life per level** — the graph records this as an `hp` synergy, not a damage one, and twenty points is four hundred percent more life on the thing doing your physical killing.",
    },
    {
      skill: "penetrate",
      points: 20,
      role: "utility",
      order: 4,
      note: "**Hard points raise the Valkyrie's attack rating as well as your own.** On a build whose damage is a status effect, this is the skill that makes her hit things.",
    },
    {
      skill: "critical-strike",
      points: 14,
      role: "utility",
      order: 5,
      note: "She inherits your level in it, and it doubles physical damage — hers. It does nothing at all for your poison.",
    },
    { skill: "lightning-bolt", points: 1, role: "prerequisite", note: "Plague Javelin's prerequisite. One point, and never thrown." },
    { skill: "valkyrie", points: 1, role: "utility", note: "One point plus +skills. The twenty in Decoy is what makes her survive, not the level here." },
    { skill: "dodge", points: 3, role: "utility", note: "She inherits it, and so do you. Three points rather than one because two characters use it." },
    { skill: "avoid", points: 3, role: "utility", note: "The same, for ranged attacks — and it is ranged packs that kill Valkyries." },
    { skill: "evade", points: 3, role: "utility", note: "The same again, while moving. Also Valkyrie's prerequisite." },
    { skill: "slow-missiles", points: 1, role: "utility", note: "Decoy's prerequisite, and the best one-point defensive skill in the game." },
    { skill: "inner-sight", points: 1, role: "prerequisite", note: "Slow Missiles' prerequisite, and it lowers the defence of everything the Valkyrie is fighting." },
    { skill: "jab", points: 1, role: "utility", note: "One point, and the only physical attack you will personally make. Three thrusts, on the javelin you are already holding." },
    { skill: "pierce", points: 1, role: "utility", note: "One point, because a Razortail supplies 33%. The javelin travels through a line and poisons everything on it, so pierce genuinely matters — read the article before spending more." },
  ],
  flexPoints: [
    "**The plan spends 109 of 110.** Critical Strike is the adjustable block: it serves the Valkyrie and not you, so cut it if you would rather have Dodge, Avoid and Evade higher.",
    "**Do not max Lightning Bolt as a second damage type.** It receives its synergies from four lightning skills you are not taking, so a lone maxed Lightning Bolt is a weak skill with no support. If you want lightning, the Lightning Fury page is that build.",
    "Poison Javelin and Plague Javelin are each other's only synergy, at 12% and 14% per level. There is no third to look for.",
  ],
  stats: {
    strength: "Enough for the shield and belt. There is no heavy weapon to reach for — a javelin's Strength requirement is small.",
    dexterity: "Enough for maximum block and for the javelin. **Neither of your main skills rolls against attack rating**, so Dexterity here is for the shield and for Jab, not for landing poison.",
    vitality: "Everything left.",
    energy: "None. Sixteen and fourteen mana are the cheapest main skills on any Amazon page.",
    notes: [
      "**This is the one Amazon whose main damage never misses.** Poison Javelin's row carries no attack-rating bonus because it does not need one — the javelin poisons what it passes. That frees Dexterity for block in a way no other build here manages.",
      "Maximum block is worth reaching, because standing still while poison works is what this build does.",
      "Poison Resist is the resistance to over-cap rather than merely cap, if you intend to carry a Rotting Fissure later.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 32,
      frames: 7,
      priority: "recommended",
      why: "You throw, then wait. Being stunned during the waiting is what turns a safe fight into a bad one.",
    },
    {
      stat: "fhr",
      value: 52,
      frames: 6,
      priority: "recommended",
      why: "A Bramble alone is 50% Faster Hit Recovery, so on this build the higher target arrives with the armor rather than instead of something.",
    },
    {
      stat: "fbr",
      value: 32,
      frames: 3,
      priority: "recommended",
      why: "The standard target on the Paladin, Amazon and Assassin table, and this build has both the shield and the Dexterity to spare for it.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Poison Javelin at level 6, and Plague Javelin at 18.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any javelin with +Javelin and Spear Skills",
              why: "Vendor magic javelins carry it, and a skill level is worth more than any damage roll to a skill that deals none of the weapon's damage.",
              lookFor: ["+2-3 Javelin and Spear Skills"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances for three Countess runes, and a shield you will actually be blocking with." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Hit recovery and run speed from level 17." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills, which raises the poison and the duration together." }],
        },
      ],
      nextUpgrade: "Level 18 for Plague Javelin, then level 24 for a Decoy worth investing in.",
      notes:
        "**Poison Javelin is available at level 6 and is genuinely usable from then on**, which no other elemental Amazon skill manages. It will not feel strong, because poison never does — check whether things are dying rather than whether they flinch.",
    },

    {
      tier: "nightmare",
      goal: "Both javelins maxed, and a Valkyrie who survives being looked at.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "titans-revenge" },
              why: "+4 skill levels across the two lines, and Replenishes Quantity — a build that throws every second needs a javelin that refills.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills in the slot you block with. Two more skill levels is more poison and more duration.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "peace" }, why: "+2 Amazon skills and hit recovery for three cheap runes, until a Bramble exists." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find while nothing better exists." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce, so the javelin poisons a second row it would otherwise have stopped at." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and Dexterity toward block." }],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "75% before Hell." }],
      nextUpgrade: "A Bramble, which is the only armor in the game that raises poison skill damage.",
      notes:
        "**Attack speed matters less on this build than on any other Amazon.** Poison applies on the throw and does not stack, so the second javelin into the same pack refreshes rather than adds. Throw rate is worth having for coverage, not for damage, and there is no Amazon number to aim at in any case.",
    },

    {
      tier: "early-hell",
      goal: "Poison skill damage, and a Valkyrie that holds a room.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "titans-revenge" }, why: "Four skill levels and self-refilling. Nothing else in the slot competes for a thrower." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "bramble" },
              why: "**+25-50% to Poison Skill Damage** — the only source of it in an armor slot in the game — plus 50% Faster Hit Recovery and a Thorns aura that helps the Valkyrie.",
              sockets: "Ral, Ohm, Sur, Eth into a 4-socket body armor.",
              lookFor: ["+50% to Poison Skill Damage"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "andariels-visage" },
              why: "+2 skills and a large poison resistance, on a build that will eventually want to over-cap it. Its −30% fire resistance is the price.",
              alternatives: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills with no penalty, and easier to reach at 50 Strength." }],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills and block." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce along the poison line." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "atmas-scarab" },
              why: "**Amplify Damage on striking helps the Valkyrie, not you** — she is the one hitting things — and Poison Resist +75% is exactly the line this build wants to over-cap.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and Dexterity." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "Life, Dexterity toward block, and a raised maximum fire resistance for the Andariel's." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "75% everywhere, and poison over-capped if you can." }],
      nextUpgrade: "A better Bramble roll — the poison damage spread runs from 25% to 50% and the difference is enormous.",
    },

    {
      tier: "budget",
      goal: "Poison damage at its ceiling, and a Valkyrie that outlives the pack.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "titans-revenge" }, why: "Still the right javelin. Nothing on the site raises poison skill damage in a weapon." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "bramble" }, why: "A +50% Poison Skill Damage roll if you can find one. The spread is the largest of any runeword on the site." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills, poison resistance and +10% maximum poison resist. Socket an Um for the fire it takes." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "stormshield" },
              why: "35% damage reduction and the best block in the game, on a build that stands still while poison works.",
              alternatives: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Keep the two skill levels if the Strength for a Monarch is not paid for." }],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances, if the Valkyrie no longer needs the Amplify Damage." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and Dexterity." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find on a build that clears steadily rather than quickly." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills, which is poison damage and duration together." },
        { label: "Javelin and Spear skill grand charms", why: "The only charms that raise both javelins at once." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, and the Valkyrie benefits from it too." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "A Rotting Fissure if the zones you want are closed, and better skill charms otherwise.",
    },

    {
      tier: "optimized",
      goal: "Nothing left that resists poison and survives the Valkyrie.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "titans-revenge" }, why: "Four skill levels, self-refilling, and 20 Dexterity toward block." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "bramble" }, why: "+50% Poison Skill Damage and 50% Faster Hit Recovery." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills and the poison resistance to over-cap, with an Um in the socket." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Damage reduction and block." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and Dexterity." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Javelin and Spear skill grand charms with life", why: "Skills and life in one row." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "A Rotting Fissure, and the last charm rolls.",
    },

    {
      tier: "bis",
      goal: "Nothing left to fix.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "titans-revenge" }, why: "The javelin this build never replaces." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "bramble" },
              why: "A maximum-roll Bramble. Twenty-five percent against fifty is the largest single difference any item on this list makes.",
              lookFor: ["+50% to Poison Skill Damage"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills, +10% maximum poison resist, Um in the socket." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Damage reduction and block." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { ref: { kind: "unique", slug: "rotting-fissure" }, why: "The least traded of the six, and the one this build is most likely to want. Poison resistance is easy to over-cap from charms and an Atma's Scarab, so its penalty is more absorbable here than a fire or lightning charm's would be." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      notes:
        "This build ends at a ceiling lower than the lightning ones and reaches it far more cheaply. **Bramble is the whole endgame**, and its roll is the difference between a working build and a strong one. Everything after that is skill levels, which raise poison damage and Plague Javelin's area — but never its duration, which the game fixed at three seconds and no amount of gear moves.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "The Act 2 Desert Mercenary with **Might**, whose aura raises the Valkyrie's damage as well as his own — on this build that is two physical fighters bought with one hire. Give him an **Insight** early if you want the mana, though this is the least mana-hungry Amazon on the site, and a **Fortitude** or **Treachery** with a **Vampire Gaze** to keep him upright. **Holy Freeze deserves a second look here**: a poison build wins by making fights last, and slowing everything down is exactly that.",

  farming: [
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Plague Javelin's cloud covers more ground than any other javelin attack, and a herd is the only thing in the game shaped like the cloud. Physical is the recorded immunity here, not poison.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Area level 85 and the densest zone in the game, with fire, lightning and physical among its immunities rather than poison. The clouds do the work while the Valkyrie holds the seal packs.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, short, and nothing there is recorded poison immune. A steady zone rather than a fast one, which suits damage over time.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are fire and lightning immune, not poison, and they stand still in a group — which is the ideal target for a cloud that lasts three seconds.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85 and the best experience in the game, and its recorded immunities are physical, fire, lightning and cold rather than poison.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "arcane-sanctuary",
      difficulty: "hell",
      why: "Lightning and magic immunity rather than poison, and long narrow platforms are exactly the shape a poison line wants.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85 and quick to reach, but its population is recorded poison immune — a Valkyrie zone rather than a poison one.",
      minTier: "early-hell",
      rating: 2,
    },
  ],

  immunityPlan:
    "**Poison is the second most resisted element in Hell on this site's own area data** — ten of the twenty catalogued areas record it, against thirteen for fire and eight for lightning — and unlike a lightning Amazon you have no Conviction to fall back on and no weapon damage in your main skills. The answer this build actually uses is **the Valkyrie**, and that is why she is funded rather than tolerated: twenty points of Decoy for her life, twenty of Penetrate for her attack rating, and the Critical Strike, Dodge, Avoid and Evade levels she inherits from you. A Might mercenary raises her damage further, and an **Atma's Scarab** casts Amplify Damage from *her* hits rather than yours. Beyond her: **Jab**, one point, on the javelin you already hold, for the single target she is slow against; and a **Rotting Fissure** sunder charm, which is the least traded of the six and the one this build is most likely to want. Its penalty is more absorbable here than most, because poison resistance is easy to over-cap from charms and an Atma's Scarab.",

  hardcoreNotes:
    "Better than its reputation. You throw from range, you carry a shield, you block well, and the thing walking into the pack is a Valkyrie with four hundred percent more life than a one-point summon. The real hazard is the pace: poison kills slowly, so fights last longer and you spend more time in the room than any other Amazon does. Reach the 32% block and hit-recovery targets, keep **Slow Missiles** for the ranged packs that would otherwise pick the Valkyrie apart, and treat a poison-immune pack as a Valkyrie's problem rather than a puzzle to stand in. Holy Freeze on the mercenary suits this build better than Might if you are playing to survive.",

  selfFoundNotes:
    "Cheap to start and genuinely gated at the end. Titan's Revenge, Razortail, Raven Frost and Atma's Scarab are all common Hell finds, Peace and Spirit are Countess runes, and both main skills are available before level 20. **Bramble is the wall**: Ral, Ohm, Sur and Eth is a serious rune investment, and it is the only source of poison skill damage in the game. A self-found version works and simply deals less damage — which on a damage-over-time build means fights that take longer rather than fights you lose.",

  levelingPath: {
    summary:
      "**One of the two Amazons that level as themselves.** Poison Javelin is available at level 6 and stays on the bar forever; Plague Javelin arrives at 18 and becomes the clear button. Nothing before either is wasted, and no respec is planned. The one thing to know is that it will not feel strong at any point before the two are maxed — poison never feels strong, and that is not a sign the plan is wrong.",
    respecAt: "Not needed. Keep the tokens.",
  },

  confidence: "verified",
  complete: true,
};
