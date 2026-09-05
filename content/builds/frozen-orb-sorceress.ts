import type { Build } from "@/lib/types";

/**
 * The Frozen Orb Sorceress.
 *
 * The other half of the cold pair with the Blizzard Sorceress, and the two are
 * genuinely different builds rather than variants: Blizzard is placed on the
 * ground and has a cooldown, Frozen Orb is a travelling projectile that sheds
 * shards along its path. Both ranked sources publish them separately.
 *
 * Verified at Tier 1 (`skills.json`):
 * - **Frozen Orb requires level 30**, and so does Cold Mastery. Every source
 *   calls this a ladder starter and it is one — but not from level 1, and the
 *   page has to say what you play for the first thirty levels.
 * - **Cold Mastery reduces enemy cold resistance by 20% at level 1 plus 5% per
 *   level.** That is the opposite of Fire and Lightning Mastery, which raise
 *   your damage instead. It is the reason cold builds are the least
 *   immunity-troubled casters in the game — but it still does not break a true
 *   immunity, because a mastery is applied after the game has decided the
 *   monster is immune, and that step is skipped while the immunity stands.
 * - **Frozen Orb has exactly one synergy.** Its row reads
 *   `EDmgSymPerCalc = (skill('Ice Bolt'.blvl))*par8` with `par8 = 2`, and that
 *   is the whole list. Ice Blast and Glacial Spike feed Blizzard, Glacial Spike
 *   and each other — not the Orb. A plan that maxes them for the Orb's sake is
 *   spending forty points on nothing, which is the mistake this page used to
 *   make and the reason the skill plan below is short.
 *
 * A short plan is not a finished one. Sixty-nine of the hundred and ten are
 * mandatory and the other forty-one used to be four prose suggestions worth
 * well over a hundred points between them, with nothing saying you may take
 * one. They are now three packages, each costed against the graph and each
 * closing at exactly 110:
 *
 * - **Deep Freeze** maxes Glacial Spike and Frost Nova, and the reason is an
 *   edge the page never used to state in the direction that matters. Both are
 *   *fed by* Frozen Orb, and Glacial Spike by Ice Bolt as well — the forty
 *   points this build already owns arrive with them.
 * - **The Boss Answer** maxes Ice Blast, which Frozen Orb and Ice Bolt also
 *   feed, and Static Field, whose radius is the only thing limiting it.
 * - **Energy Shield** buys Telekinesis, whose *hard* level sets the shield's
 *   mana ratio. That relationship is a parameter in the extraction rather than
 *   a synergy edge, so it is described as a ratio and never labelled one.
 *
 * Uses the standard Sorceress cast table.
 */
export const frozenOrbSorceress: Build = {
  slug: "frozen-orb-sorceress",
  name: "Frozen Orb Sorceress",
  classSlug: "sorceress",
  summary:
    "A projectile that sheds ice as it travels, under a mastery that strips cold resistance. The most forgiving farming build in the game.",
  damageTypes: ["cold"],
  primarySkill: "frozen-orb",
  playstyle:
    "Cast in the direction of trouble and keep moving. The orb travels forward and throws shards out sideways the whole way, so it covers a wide corridor without you needing to aim precisely — which is why it is the build people recommend to players who find Blizzard's ground-placement fiddly. Everything it touches is chilled or frozen, so the fight slows down as it goes. Cold Mastery is doing quiet work in the background: it strips a large chunk of cold resistance off everything, which is why the damage holds up in Hell.",
  strengths: [
    "Almost no aiming required — the orb covers a wide path on its own",
    "Chills and freezes everything it touches, which is defence as well as damage",
    "**Cold Mastery reduces enemy resistance rather than raising your damage**, so cold builds meet fewer walls than fire or lightning ones",
    "Excellent in Terror Zones, where the density suits a wide travelling projectile",
    "Very cheap. Two Spirits and a Vipermagi is a working Hell character",
  ],
  weaknesses: [
    "**Nothing before level 30** — Frozen Orb and Cold Mastery unlock together",
    "Cold immunes exist and Cold Mastery does not break them, only shrinks resistance on things that are not immune",
    "Single-target damage is modest in the core — only the Boss Answer package fixes it, and it costs you the freeze",
    "Low life, no block, and no defensive layer beyond Teleport and the freeze",
    "One damage type, so a genuine cold immune is a wall rather than a slow-down — the Pit and the Worldstone Keep are where this site records them",
  ],
  difficulty: "beginner",
  budget: "low",
  ratings: {
    clearSpeed: 4,
    bossing: 3,
    survivability: 4,
    magicFind: 5,
    terrorZones: 5,
    ubers: 1,
    soloSelfFound: 5,
    players8: 4,
  },

  skills: [
    {
      skill: "frozen-orb",
      points: 20,
      role: "main",
      order: 1,
      note: "Level 30. The whole build. Max it first and nothing else comes close in value per point.",
    },
    {
      skill: "cold-mastery",
      points: 20,
      role: "main",
      order: 2,
      note: "**Reduces enemy cold resistance by 20% at level 1 and 5% more per level.** It is not a damage multiplier — it is the reason your damage still lands in Hell.",
    },
    {
      skill: "ice-bolt",
      points: 20,
      role: "synergy",
      order: 3,
      note: "**Frozen Orb's only synergy**, at 2% per hard point, and your damage for the first eleven levels. Nothing spent here is wasted — and nothing else in the tree does the same job.",
    },
    { skill: "warmth", points: 1, role: "utility", note: "Mana regeneration from level 1." },
    {
      skill: "ice-blast",
      points: 1,
      role: "prerequisite",
      note: "**On the chain to Frozen Orb** — Ice Bolt, Ice Blast, Glacial Spike, Blizzard, Orb — and a usable single-target spell while you wait for level 30. One point in the core, because nothing it feeds is a skill the core casts. **The Boss Answer package maxes it instead**, and it is worth reading why: Frozen Orb and Ice Bolt both feed Ice Blast, so the forty points already in them arrive with it.",
    },
    { skill: "telekinesis", points: 1, role: "prerequisite" },
    { skill: "teleport", points: 1, role: "utility", note: "**One point forever.** More points only cut the mana cost." },
    { skill: "static-field", points: 1, role: "utility", note: "Takes 25% of a target's current life, which is how a cold build handles a boss it cannot burst. One point casts it; its **radius** is what more points buy, and two of the three packages below buy some." },
    { skill: "frozen-armor", points: 1, role: "utility", note: "Defence and a freeze on attackers." },
    { skill: "frost-nova", points: 1, role: "utility", note: "A point-blank panic button that chills everything around you." },
    { skill: "glacial-spike", points: 1, role: "prerequisite", note: "On the way to Blizzard, and a genuine defensive tool in its own right — one point freezes a pack solid for a moment. **All three packages below raise it**, because Frozen Orb and Ice Bolt both feed it and this plan already maxes them." },
    {
      skill: "blizzard",
      points: 1,
      role: "prerequisite",
      note: "**Frozen Orb's prerequisite**, so this point is mandatory. It is also a whole other build — see the Blizzard Sorceress page if the ground-placement playstyle appeals more than the travelling orb.",
    },

  ],

  skillPackages: [
    {
      id: "spare-points",
      name: "The second half of the plan",
      choose: "one",
      intro:
        "The core above is 69 of 110 and it is **finished** — Frozen Orb has one synergy, Ice Bolt, and it is already maxed, so no point anywhere in the cold tree raises Orb damage. That leaves forty-one, which is not a rounding error: it is more than a third of the character, and until you spend it you are playing a build with a hole in it. **Take exactly one of the three below.** Each is costed to the point, each finishes at 110, and each is a different character.",
      packages: [
        {
          id: "deep-freeze",
          name: "Deep Freeze",
          when: "The default, and the one to take if you are not sure. It buys the thing this build is already best at — nothing on the screen gets to move — and it needs no gear you were not already going to wear.",
          tradeoff:
            "You keep the build's weakest quality: bosses. Static Field ends at 4 rather than 20, so a boss with a large life pool is still a slow fight you win with the mercenary. Take the Boss Answer instead if that is the fight you keep losing.",
          skills: [
            {
              skill: "glacial-spike",
              points: 20,
              role: "main",
              order: 1,
              note: "**Its freeze runs 50 frames at one point and three more per level**, so a maxed Glacial Spike holds a pack still for over four seconds. And it is not a cold spell you are starting from scratch: **Frozen Orb and Ice Bolt both feed it**, and this plan already has twenty in each.",
            },
            {
              skill: "frost-nova",
              points: 20,
              role: "main",
              order: 2,
              note: "**Frozen Orb feeds it too.** A maxed Frost Nova is the button for the thing that is already touching you — it chills everything in a ring around you at once, which is the one situation Glacial Spike's single freeze cannot answer.",
            },
            {
              skill: "static-field",
              points: 4,
              role: "utility",
              order: 3,
              note: "The last three points, and Static Field is the only skill left where one still does something: the radius grows with every point. Four is what is left, not a target.",
            },
          ],
          rotationNote:
            "Orb into the corridor, Glacial Spike at whatever survives it, Frost Nova when something is in your face. Three buttons instead of one, and the second and third are both defensive.",
          gearNote:
            "No change. This is the package that costs nothing outside the skill tree, which is most of the argument for it.",
          statNote:
            "No change. Vitality with everything after gear requirements, exactly as above.",
          contentNote:
            "Terror Zones, 8-player games and Hardcore. Anywhere the danger is the number of things moving toward you rather than the size of one of them.",
        },
        {
          id: "boss-answer",
          name: "The Boss Answer",
          when: "Take this if your farming list is Mephisto, Andariel and Countess rather than the Pit — bosses in a fixed spot, run after run, where the build's modest single-target damage is the whole clock.",
          tradeoff:
            "Frost Nova stays at one point, so you have no panic button for something already on top of you. This is the least safe of the three and the worst pick for Hardcore.",
          skills: [
            {
              skill: "ice-blast",
              points: 20,
              role: "main",
              order: 1,
              note: "**The single-target cold spell the core never casts, and the one the core has already paid for.** Frozen Orb and Ice Bolt both feed Ice Blast, so twenty points here arrive on top of the forty already in them. It also freezes outright rather than chilling.",
            },
            {
              skill: "static-field",
              points: 20,
              role: "utility",
              order: 2,
              note: "**Takes 25% of a target's current life and ignores resistance.** Its radius is the only limit and every point raises it, so a maxed Static Field is the difference between walking into range of a boss and standing where you already are.",
            },
            {
              skill: "glacial-spike",
              points: 4,
              role: "synergy",
              order: 3,
              note: "The last three points, and they are not idle: **Glacial Spike feeds Ice Blast's freeze**, which is the spell this package just maxed. Four is what is left over.",
            },
          ],
          rotationNote:
            "Static Field until the boss is down to the difficulty's floor, then Ice Blast rather than the Orb — the Orb sheds most of its shards on the way past a single target and Ice Blast does not. The Orb stays the answer for everything that is not a boss.",
          gearNote:
            "Static Field's mana cost is what you now cast most, so an **Insight** mercenary stops being a convenience. Nothing else changes.",
          statNote: "No change.",
          contentNote:
            "Mephisto, Andariel, Countess and Pindleskin — short boss routes. It is the worst of the three in the Pit and in Terror Zones, where nothing you meet has a life pool worth a Static Field.",
        },
        {
          id: "energy-shield",
          name: "Energy Shield",
          when: "A second health bar instead of more crowd control, for a Sorceress who keeps dying to the one thing that got through. Take it deliberately or not at all — half of it is worse than none of it.",
          tradeoff:
            "**Mana burn stops being an annoyance and becomes a death**, and a drained pool leaves you with the smallest life total in the game. You also give up Frost Nova and a maxed Static Field, and you spend four points on a lightning chain you will never cast.",
          skills: [
            {
              skill: "telekinesis",
              points: 20,
              role: "utility",
              order: 1,
              note: "**Every hard point here lowers what the shield charges you**, and no amount of +skills gear does the same — the game reads Telekinesis' *hard* level for the ratio. This is the package, and the reason it is not worth taking at five points.",
            },
            {
              skill: "glacial-spike",
              points: 19,
              role: "utility",
              order: 2,
              note: "The shield does not kill anything, so the freeze still has to. Nineteen rather than twenty because that is what the budget leaves after the chain — one point short of maxed, and worth more here than the four points it would cost to get it.",
            },
            {
              skill: "energy-shield",
              points: 1,
              role: "main",
              order: 3,
              note: "**Two mana per point of damage at base**, improved by Telekinesis. One point, because the extraction this site reads does not publish what a second point changes — so the plan buys the ratio, which is measurable, and not the level, which is not.",
            },
            {
              skill: "charged-bolt",
              points: 1,
              role: "prerequisite",
              note: "The first of three points on the chain to the shield. You will never cast it.",
            },
            {
              skill: "lightning",
              points: 1,
              role: "prerequisite",
              note: "The second. On a different cast table from everything else you own, which is another reason not to cast it.",
            },
            {
              skill: "chain-lightning",
              points: 1,
              role: "prerequisite",
              note: "The third, and **Energy Shield's actual prerequisite** alongside Teleport, which the core already pays for.",
            },
          ],
          rotationNote:
            "Unchanged in what you press and changed in what you watch: the mana globe is now the health globe. Glacial Spike before the pack arrives rather than after.",
          gearNote:
            "The plan stops being gear-neutral. Mana on rings and an amulet is worth more than magic find, **Insight on the mercenary becomes required**, and anything that says Mana Burn is a reason to leave. Frostburn's mana bonus finally earns its slot.",
          statNote:
            "Still no points in Energy. The shield scales with the size of the pool and gear supplies far more mana per point spent than the attribute does — that is true here for the same reason it is true everywhere else on this page.",
          contentNote:
            "Hell Terror Zones and 8-player games, where the incoming damage is what stops you rather than the outgoing. Avoid it anywhere mana burn is common.",
        },
      ],
    },
  ],

  flexPoints: [
    "**Forty-one points are spare before you choose, and the package you pick above spends every one of them.** The three are alternatives, not a list: taking one is the plan, taking parts of two is how a character ends up with nothing finished. What follows is the rest of the decision — the parts that are not a skill point.",
    "**The Blizzard question.** Blizzard is the other cold build and it has its own page; it trades this build's forgiving aim for higher single-target damage and a cooldown to play around. They are not variants of each other and the skill plans barely overlap.",
    "**The Meteorb split** — Frozen Orb plus Meteor rather than a cold tree and three packages — is a separate build with its own page. It is the largest change you can make to this character, because it buys a second damage type, and it pays for it by giving up Ice Bolt's forty percent and every package above.",
    "**Magic find variant:** this build has the best magic find profile of any starter, because it clears fast and needs almost nothing from its gear. Swap damage charms for magic find and take War Traveler and a Harlequin Crest. **The skill plan does not change**, and any of the three packages will carry it.",
  ],
  stats: {
    strength: "Only what the gear needs, which for this build is very little.",
    dexterity: "None. Teleport and the freeze are the defence.",
    vitality: "Everything else.",
    energy: "None. Warmth and an Insight mercenary cover it.",
    notes: [
      "This is the cheapest stat plan of any build on the site: no block, no heavy base, no weapon requirement — and **Deep Freeze and the Boss Answer both keep it that way**. Only the Energy Shield package changes what your gear is for, and it changes it towards mana rather than towards attributes.",
      "A Call to Arms swap is worth more life than any amount of Vitality you could buy with the equivalent currency.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 105,
      frames: 8,
      priority: "recommended",
      why: "The standard Sorceress target, and it governs Teleport as well as casting — which on a farming build is most of your time.",
    },
    {
      stat: "fcr",
      value: 63,
      frames: 9,
      priority: "required",
      why: "The starter target, and a Spirit sword plus Magefist nearly reaches it alone.",
    },
    {
      stat: "fhr",
      value: 60,
      frames: 9,
      priority: "recommended",
      why: "The standard Sorceress hit-recovery target. Being interrupted is the main way this build dies.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 30. You are an Ice Bolt Sorceress until then, and that is fine.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and up to 35% Faster Cast Rate at level 25.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket Crystal Sword.",
              alternatives: [
                {
                  label: "Any staff or orb with +Ice Bolt or +Ice Blast",
                  why: "Vendor stock refreshes each time you enter town, and until level 30 Ice Bolt *is* your damage. **+3 Ice Bolt stops paying the moment Frozen Orb arrives** — a synergy counts hard points only, so the staff raises the bolt you no longer cast and not the Orb you do. Buy it for the first thirty levels and expect to replace it.",
                  lookFor: ["+3 Ice Bolt", "+3 Ice Blast", "+2 Cold Skills"],
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances for three Countess runes." }],
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
          picks: [{ ref: { kind: "unique", slug: "frostburn" }, why: "Mana, and +1 to Cold Skills once you find one. Magefist is the alternative if cast rate matters more." }],
        },
      ],
      nextUpgrade:
        "Level 30. Frozen Orb and Cold Mastery arrive together and the character changes completely in one level.",
      notes:
        "Level with Ice Bolt and Ice Blast. **Ice Bolt is the synergy** and every point in it is still working at 90; Ice Blast is the next link in the chain and one point is all it ever needs, so put the rest into Ice Bolt. Static Field from level 6 handles anything with too much life.",
    },

    {
      tier: "nightmare",
      goal: "Frozen Orb online, Mephisto on farm, resistances climbing.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Still the best value item available." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "A second Spirit — +4 skills and 70% Faster Cast Rate between the two.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
              alternatives: [
                { ref: { kind: "unique", slug: "lidless-wall" }, why: "+1 skills and 20% cast rate with no 4-socket base to find." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 skills, 30% cast rate and up to +35 all resistances at 43 Strength." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and up to 50% magic find, which on this build is the point." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest path to 75% before Hell." }],
      nextUpgrade: "Resistances to 75%, an Insight for the mercenary, and then simply farm.",
    },

    {
      tier: "early-hell",
      goal: "105% cast rate, capped resistances, and Mephisto running on repeat.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% cast rate and +2 skills." }],
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
              why: "Resistances and cast rate together, cheaply.",
              alternatives: [
                { ref: { kind: "unique", slug: "ormus-robes" }, why: "+3 to a random spell and +10-15% cold skill damage if the roll is Frozen Orb. A lottery, but a cheap one." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, 50% magic find and 10% damage reduction." }],
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
              why: "The last cast rate you need.",
              lookFor: ["10% Faster Cast Rate", "Two resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find, which is what this build is for." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "Hold 75% in all four." }],
      nextUpgrade: "Nightwing's Veil or Death's Fathom — the two items that turn a cheap build into a fast one.",
      notes:
        "This is where the build is already doing its job. Everything above this tier makes it faster; nothing above it makes it possible.",
    },

    {
      tier: "budget",
      goal: "Fast Mephisto and Terror Zone farming with real magic find.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "the-oculus" },
              why: "+3 Sorceress skills, 30% cast rate, +20 all resistances and 50% magic find. The classic magic find orb, and cheap.",
              alternatives: [
                { ref: { kind: "unique", slug: "deaths-fathom" }, why: "The damage option: up to +30% cold skill damage. Far more expensive and worth it once clear speed is the constraint." },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% cast rate and +2 skills." }],
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
          picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Magic find, on a build whose whole purpose is finding things." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring with 10% Faster Cast Rate",
              why: "Clears 105%.",
              lookFor: ["10% Faster Cast Rate", "Resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and damage." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills and resistances." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Cold skill grand charms with life", why: "Damage and life together." },
      ],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
      nextUpgrade: "Nightwing's Veil, and Death's Fathom when clear speed rather than magic find becomes the constraint.",
    },

    {
      tier: "optimized",
      goal: "Cold damage stacked, and the choice between finding more and killing faster.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "deaths-fathom" },
              why: "Up to +30% cold skill damage on top of +3 Sorceress skills. The largest damage item this build has.",
              lookFor: ["+30% Cold Skill Damage", "+3 Sorceress Skills", "sockets for cold facets"],
              alternatives: [
                { ref: { kind: "unique", slug: "the-oculus" }, why: "Keep the Oculus while magic find matters more than clear speed. That is a real choice and not a lesser one." },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% cast rate and +2 skills." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "nightwings-veil" },
              why: "+2 skills and up to +15% cold skill damage. Its 192 Strength requirement is halved by its own Requirements -50%, so the real cost is 96.",
              lookFor: ["+15% Cold Skill Damage", "2 sockets for cold facets"],
              alternatives: [
                { ref: { kind: "unique", slug: "harlequin-crest" }, why: "Keep the Shako for magic find and the damage reduction if you are farming rather than pushing." },
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
                { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport with no scaling mana cost, plus magic find per level." },
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
              why: "The slot where a rare beats every unique.",
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
        { label: "Cold skill grand charms with life", why: "Damage and life." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Cold facets in every socket, and a Cold Rupture charm if the Pit or the Worldstone Keep are what you want to farm.",
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
              why: "A +30% cold skill damage roll, socketed with cold facets.",
              lookFor: ["+30% Cold Skill Damage", "sockets"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "35% cast rate in a Monarch.",
              lookFor: ["35% Faster Cast Rate", "Monarch base"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "nightwings-veil" },
              why: "+15% cold skill damage with two cold facets in it.",
              lookFor: ["+15% Cold Skill Damage", "2 sockets"],
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
              label: "Rare ring: 10% Faster Cast Rate, two resistances, life, mana",
              why: "The last slot to perfect.",
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
        "The honest note at the top of the ladder: this build's ceiling is lower than the Lightning or Nova Sorceress's, and it reaches that ceiling for a fraction of the price. It stays one of the best magic find characters in the game precisely because it never needed the expensive items to work.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Act 2 Desert Mercenary with **Might**, an **Insight** for your mana, and a **Vampire Gaze** to keep him alive. Unlike the Lightning Sorceress this build does not need an Infinity — Cold Mastery already reduces enemy cold resistance, so the mercenary is there for damage and for the cold immunes you decide not to skip. **Treachery** on his armour is a cheap upgrade whose Fade proc raises his resistances substantially.",

  farming: [
    {
      area: "mephisto",
      difficulty: "hell",
      why: "The reason this build exists. A twenty-second route, he is not cold immune, and the drop table is one of the best in the game.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Ten seconds from a portal and monster level 86. He is cold immune in Hell, so this is a run where your mercenary earns his keep — or where you bring a Cold Rupture.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "Short, near a waypoint, and she dies quickly to a couple of orbs.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "countess",
      difficulty: "hell",
      why: "Runes, and a route the orb clears without you aiming at anything.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, short, and the orb's wide path suits the layout. The best general farm once you have magic find.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Dense area level 85 and close to a waypoint. Density is where a travelling projectile is at its best.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 and one of the best zones in the game, with fire and poison among its recorded immunities rather than cold. The natural home of a cold build, and this one is no exception.",
      minTier: "early-hell",
      rating: 5,
    },
  ],

  immunityPlan:
    "Cold builds meet fewer walls than fire or lightning ones and it is worth understanding why. **Cold Mastery reduces the enemy's cold resistance by 20% at level 1 and 5% more per level**, where Fire and Lightning Mastery instead raise your own damage. Against anything not actually immune, that means your damage keeps landing deep into Hell without a single item bought for the purpose. **It does not break true immunity**, though: a mastery is applied after the game has already decided the monster is immune, and that step is skipped while the immunity stands — so against something at 110% a maxed Cold Mastery is worth nothing at all, not a reduced amount. The answers to genuine cold immunes are a **Cold Rupture** sunder charm at the cost of 70 to 90 points of your own cold resistance, **your mercenary's physical damage**, or **skipping them** — which for a farming build is usually correct. The Pit and the Worldstone Keep are where that choice costs you, and the farming list above is rated accordingly.",

  hardcoreNotes:
    "One of the safest casters in the game, and the reason is the freeze rather than the damage. Everything the orb touches is chilled, so packs approach slowly and in pieces; Frost Nova and Glacial Spike give you two panic buttons that stop a room outright. Take Chains of Honor over Enigma, treat 60% Faster Hit Recovery as required, and keep a Call to Arms swap. The genuine danger is the same as every Sorceress's — cold immune packs that close the distance while you have nothing to slow them with.",

  selfFoundNotes:
    "Alongside Fire Ball Meteor, the best self-found character on the site. Everything it needs below the endgame is a Countess runeword or a vendor purchase, it has no item that is a hard requirement, and Cold Mastery means it does not need an Infinity to keep working in Hell. A self-found Frozen Orb Sorceress farming Mephisto is how a great many players fund every other character they own.",

  levelingPath: {
    summary:
      "Frozen Orb and Cold Mastery both arrive at **level 30**, so the first thirty levels are played as an Ice Bolt and Ice Blast Sorceress — and Ice Bolt is the Orb's one synergy, so those twenty points are the same twenty points you finish with. Static Field from level 6 handles anything with too much life, and Teleport at 18 changes how you move. **No respec is required**, which together with the Fire Ball Meteor Sorceress makes these the two most forgiving starts on the site.",
  },

  confidence: "verified",
  complete: true,
};
