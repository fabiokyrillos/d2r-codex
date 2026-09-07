import type { Build } from "@/lib/types";

/**
 * The Poison Nova Necromancer.
 *
 * One page for Poisonmancer, Novamancer and Pnova, and Trang-Oul's is an
 * equipment variant on it rather than a build of its own — the set changes what
 * you wear and the two runewords you skip, not the point plan or the way the
 * character is played.
 *
 * THE MECHANIC THE PAGE IS BUILT ON
 * ---------------------------------
 * Poison Nova's `ELen` is 50 frames with no per-level term: **two seconds, at
 * every level, forever**. Poison Dagger's duration grows from 2 to 9.6 seconds
 * and Poison Explosion's does the same; Poison Nova's does not, and that single
 * column is why the build plays the way it does.
 *
 * Poison does not stack. A new application at a higher damage-per-frame
 * replaces the one running; a weaker one does nothing. So casting Nova twice
 * into the same pack is **coverage and renewal, not addition** — a claim worth
 * policing, because "spam it for more damage" is the most repeated wrong
 * sentence about this build, and it leads a reader to skip the second damage
 * type that actually solves its problem.
 *
 * WHY CORPSE EXPLOSION IS CORE HERE AND NOT A LUXURY
 * --------------------------------------------------
 * Ten of the twenty areas in this site's catalogue record poison immunity — the
 * second most resisted element in Hell — and this build has exactly one
 * element. Its two reductions are large together and they are not
 * interchangeable against an immune, which is the distinction the page has to
 * keep:
 *
 * **Lower Resist is a curse, so it breaks a poison immunity — shallowly.** Cut
 * to one fifth while the immunity stands, it is worth −5 from a bare point and
 * −14 at the skill's −70% ceiling, so it reaches 104% and 113% respectively.
 * Above that it does nothing.
 *
 * **Death's Web never breaks one, at any roll.** −% to Enemy Poison Resistance
 * is applied after the immunity check and is skipped entirely while the
 * immunity stands. What it does is land at full value on whatever Lower Resist
 * or a Rotting Fissure has already opened.
 *
 * So the build's answer above 113% is Corpse Explosion: half physical and half
 * fire, costing no synergies, and the reason the build has an answer at all.
 */
export const poisonNovaNecromancer: Build = {
  slug: "poison-nova-necromancer",
  name: "Poison Nova Necromancer",
  classSlug: "necromancer",
  summary:
    "A ring of poison that stops a whole room regenerating, the largest single source of lowered enemy poison resistance in the game, and Corpse Explosion for everything immune to both.",
  damageTypes: ["poison", "physical", "fire"],
  primarySkill: "poison-nova",
  playstyle:
    "You walk into the middle of a pack and cast a nova, and everything around you is poisoned for two seconds. Nothing dies on the cast — poison is damage over time and this build never pretends otherwise — so you cast again, and again, keeping the room covered while the damage lands. Lower Resist goes on first if the pack is a problem, and Death's Web is doing the rest whether you notice it or not. Then something dies, and Corpse Explosion turns it into a physical and fire explosion that clears whatever the poison could not touch. The rhythm is nova, nova, curse, detonate, and the whole build is about knowing which of those the room needs.",
  strengths: [
    "**Death's Web is the largest −% to Enemy Poison Resistance in the game, and the only one on a body slot worth building around**, and it stacks with Lower Resist",
    "Poison stops a monster regenerating for as long as it is applied, which is what makes it work on things with large life pools",
    "Two damage types on one bar: poison from the nova, and physical plus fire from Corpse Explosion",
    "The nova is centred on you and hits everything around you, so a full room is one cast",
    "Cheap to cast — 20 mana at level 20 — and there is no cooldown to plan around",
  ],
  weaknesses: [
    "**Nothing dies when you cast.** Poison is damage over time, and the build feels slow even when it is clearing quickly",
    "**Poison Nova's duration is fixed at two seconds at every level**, so a stronger nova is more damage packed into the same window rather than a longer one",
    "**Casting again does not add damage.** A stronger application replaces the one running and a weaker one does nothing — spam is coverage and renewal, never addition",
    "Poison is the second most resisted element in Hell: ten of the twenty areas here record poison immunity",
    "You stand in the middle of the pack to cast, on a class with no block plan by default and no life steal",
  ],
  difficulty: "advanced",
  budget: "high",
  ratings: {
    clearSpeed: 3,
    bossing: 2,
    survivability: 3,
    magicFind: 3,
    terrorZones: 3,
    ubers: 1,
    soloSelfFound: 2,
    players8: 3,
  },

  skills: [
    {
      skill: "poison-nova",
      points: 20,
      role: "main",
      order: 1,
      note: "**Two seconds, at every level.** The duration column carries no per-level term, so twenty points is more damage inside the same two-second window — not a longer one. That is the whole reason this build casts constantly rather than once.",
    },
    {
      skill: "poison-explosion",
      points: 20,
      role: "main",
      order: 2,
      note: "Poison Nova's largest synergy, and a usable skill in its own right when you have a corpse and do not want to walk into the pack. Its own duration does grow — 2 seconds to 9.6 — unlike the nova's.",
    },
    {
      skill: "poison-dagger",
      points: 20,
      role: "main",
      order: 3,
      note: "The other synergy, and you will never stab anything with it. Its published damage — 7-15 at level 1 growing to 540-581 at twenty — is the clearest proof of how poison numbers work: those are totals over the duration, not per hit.",
    },
    {
      skill: "corpse-explosion",
      points: 20,
      role: "main",
      order: 4,
      note: "**The second damage type, and not optional on a single-element build.** Half physical and half fire, so it answers the poison immunes sitting above Lower Resist's 113% reach — which is every one Death's Web was never going to touch either. Points buy radius; the 70–120% damage band never moves.",
    },
    {
      skill: "lower-resist",
      points: 1,
      role: "utility",
      order: 5,
      note: "**One point, and it is the only skill in the game that lowers poison resistance.** It stacks with Death's Web, and it is the half of that pair that can break an immunity: cut to one fifth it is worth −5 from a bare point and −14 at the skill's −70% ceiling, so it reaches 104% and 113%. Death's Web reaches none of them, and lands at full value on whatever this opens. Above 113% the job is Corpse Explosion's.",
    },
    { skill: "teeth", points: 1, role: "prerequisite", note: "Corpse Explosion's prerequisite." },
    {
      skill: "amplify-damage",
      points: 1,
      role: "prerequisite",
      note: "On the way to the rest of the curse tree, and worth its point on its own: it is what makes Corpse Explosion's physical half land on a physical immune.",
    },
    { skill: "weaken", points: 1, role: "prerequisite", note: "Terror's prerequisite, and a real defensive curse against a melee pack." },
    { skill: "terror", points: 1, role: "prerequisite", note: "Decrepify's prerequisite." },
    {
      skill: "decrepify",
      points: 1,
      role: "utility",
      note: "**Decrepify unlocks at level 24.** On a build that stands inside the pack, slowing everything in it by half is the difference between casting again and running.",
    },
    { skill: "iron-maiden", points: 1, role: "prerequisite", note: "Life Tap's prerequisite. Genuinely useful against a melee pack that is hitting your mercenary." },
    { skill: "life-tap", points: 1, role: "prerequisite", note: "Lower Resist's second prerequisite, and the reason your mercenary survives a fight that poison is taking its time over." },
    { skill: "raise-skeleton", points: 1, role: "utility", note: "One point plus +skills is three or four skeletons — enough to hold a doorway while a nova works, and enough to stop something reaching you." },
    { skill: "skeleton-mastery", points: 1, role: "utility", note: "One point. It reads the effective level, so +skills does most of the work here." },
    { skill: "clay-golem", points: 1, role: "utility", note: "He slows what he hits and he is Golem Mastery's prerequisite. On a build that needs the pack to stay in the nova, slowing it is on-plan." },
    { skill: "golem-mastery", points: 1, role: "utility", note: "Summon Resist's prerequisite, and it keeps the golem standing." },
    { skill: "summon-resist", points: 1, role: "utility", note: "One point. Fire, lightning, cold and poison, on a curve whose first point is most of it — and the summons take no difficulty penalty, so this is an addition rather than a repair." },
    { skill: "bone-armor", points: 1, role: "utility", note: "One point, refreshed on recast. You are standing in the pack; take the free absorption." },
  ],
  flexPoints: [
    "**The plan spends 94 of 110**, leaving about 16 at level 99. Everything mandatory is above: the three poison skills and Corpse Explosion at twenty each, the full curse chain to Lower Resist, and one point in each utility summon.",
    "**Raise Skeletal Mage is the first flex destination.** A mage army is elemental damage from a second source, and it costs one point to start. On a build whose whole weakness is having one element, that is the cheapest diversification available.",
    "**More Raise Skeleton and Skeleton Mastery** if you find yourself being hit while casting. This build stands in the middle of what it is killing, and more bodies between you and the pack is a defensive investment rather than an offensive one.",
    "**Bone Wall and Bone Prison**, if you would rather the answer to being surrounded be a wall than a skeleton. They are Bone Armor's synergies, so the points do two things.",
    "**Amplify Damage past one point** for radius, on the packs where Corpse Explosion is doing the work instead of the poison.",
    "**Nothing goes into a fourth poison skill, because there is not one.** Poison Nova's synergies are Poison Dagger and Poison Explosion and that is the complete list — the tree has no third source to find.",
  ],
  stats: {
    strength: "Enough for your armor and your shrunken head. A Bramble is a body armor like any other; a Heirophant Trophy needs 58.",
    dexterity: "Base, unless you are building for maximum block — which is a defensible choice on a build that stands in the middle of the pack.",
    vitality: "Everything else, and more of it than a Summoner needs. You are the one in the room.",
    energy: "None. Twenty mana a cast is cheap, and an Insight covers the rest.",
    notes: [
      "**Poison Resist is the resistance to over-cap** if you intend to carry a Rotting Fissure later, and it is the one an Andariel's Visage hands you for free.",
      "Your resistances drop 40 in Nightmare and 100 in Hell. Your skeletons' and your golem's do not move at all, and your mercenary's drop exactly as yours do.",
      "Faster Cast Rate is the stat that decides how much of the room stays covered, because coverage is a function of how often you can renew it.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 75,
      frames: 10,
      priority: "required",
      why: "This build renews rather than accumulates, so cast rate is the throughput. Below 75% the two-second window closes before the next nova lands and the room stops being covered.",
    },
    {
      stat: "fcr",
      value: 125,
      frames: 8,
      priority: "recommended",
      why: "The realistic endgame target once an Arachnid Mesh and a Spirit are in. Two frames per cast is a large fraction of a two-second effect.",
    },
    {
      stat: "fhr",
      value: 48,
      frames: 6,
      priority: "recommended",
      why: "You cast from inside the pack. Being locked in hit recovery is the failure mode, and it is the reason a Bramble's own 50% is worth as much as its poison damage.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 30 for the nova. Before that you are levelling as something else.",
      levelRange: [1, 35],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any wand with +Poison and Bone Skills",
              why: "Poison Nova unlocks at level 30 and nothing before it is this build. Level as a Summoner — the Necromancer levelling page walks that route — and keep any wand that raises the poison tree for the day you respec.",
              lookFor: ["+2-3 Poison and Bone Skills", "+1 Necromancer Skills"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Cast rate, hit recovery and run speed for two runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "Any Necromancer shrunken head with +Poison and Bone Skills",
              why: "A shrunken head is a shield that carries class skills, which is a combination no other slot offers.",
              lookFor: ["+2 Necromancer Skills", "+3 Poison Nova", "2 sockets"],
            },
          ],
        },
      ],
      nextUpgrade: "Level 30, then the respec token from the Den of Evil.",
      notes:
        "**This build does not exist before level 30**, and pretending otherwise is how a character gets stuck. Poison Nova is the last skill in its tree, its two synergies are 40 points on their own, and a partial version of it kills nothing. Level as a Summoner and swap.",
    },

    {
      tier: "nightmare",
      goal: "The three poison skills climbing, and a mercenary who keeps you alive while they work.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "white" },
              why: "+3 Poison and Bone Skills — which is Poison Nova, Poison Explosion, Poison Dagger and Corpse Explosion at once — plus 20% Faster Cast Rate for two cheap runes.",
              sockets: "Dol and Io into a 2-socket wand. A Bone Wand or Grim Wand is the cheapest base.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and up to 35% Faster Cast Rate, which on this build is throughput rather than convenience.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "splendor" },
                  why: "+1 skill and +10% cast rate in a 2-socket shrunken head, which stacks with the head's own class skills. Far cheaper than a Monarch.",
                  sockets: "Eth and Lum into any 2-socket shield — a shrunken head counts.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "bone" }, why: "+2 Necromancer skills and a large mana pool, until a Bramble exists.", sockets: "Sol, Um, Um into a 3-socket body armor." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate and mana regeneration." }],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "75% before Hell." }],
      nextUpgrade: "A Bramble, and then the long wait for a Death's Web.",
    },

    {
      tier: "early-hell",
      goal: "+% Poison Skill Damage in the armor slot, and Corpse Explosion carrying the immunes.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "white" }, why: "Still the best wand available before level 66. Three skill levels across the whole poison tree." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "bramble" },
              why: "**+25-50% to Poison Skill Damage — the only source of that stat in an armor slot in the game** — plus 50% Faster Hit Recovery, which is exactly what a caster standing inside the pack needs.",
              sockets: "Ral, Ohm, Sur, Eth into a 4-socket body armor.",
              lookFor: ["+50% to Poison Skill Damage"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "+2 skills with no penalty and a low Strength requirement. **Andariel's Visage is the helm this build ends on — +2 skills, Poison Resist +70% and +10% maximum poison resist — and it requires level 83**, so it arrives with the next set and not this one.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "homunculus" }, why: "+2 Necromancer skills, +2 to Curses — which is Lower Resist's level — and All Resistances +40 in one slot." }],
        },
        {
          slot: "belt",
          picks: [
            {
              label: "Rare or crafted caster belt: 10% Faster Cast Rate, life and resistances",
              why: "**Arachnid Mesh is the slot's real answer — +1 all skills and 20% Faster Cast Rate, and cast rate is coverage — and it requires level 80**, past this tier. A rare belt reaches the same cast-rate breakpoint for a fraction of the price and keeps sixteen potion slots while it does.",
              lookFor: ["10% Faster Cast Rate", "Life", "Resistances"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Cast rate, and a fire skill level that raises Corpse Explosion's effective level and therefore its radius." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and mana." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Hit recovery and poison length reduction. **Marrowwalk** is the Necromancer boot people name here, and this site has not catalogued it." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "75% everywhere, and poison over-capped if you can." }],
      nextUpgrade: "Death's Web, which is the item this build is waiting for and the only one it cannot substitute.",
      notes:
        "**Trang-Oul's Avatar is the other route through this tier**, and it is an equipment variant rather than a different build: the set gives +25% poison skill damage, a large cast-rate block and Fire Ball charges, at the cost of most of your resistance planning and the Bramble slot. This site has not catalogued set items, so it is named here rather than laid out. The point plan does not change either way.",
    },

    {
      tier: "budget",
      goal: "Death's Web, and the two reductions running together.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "deaths-web" },
              why: "**−40-50% to Enemy Poison Resistance, and the two Rainbow Facet rolls and Defender's Bile carry 3-10% of it; nothing else comes near Death's Web's twenty-five.** With Lower Resist on top, a resistant monster stops being resistant. Note what it does not have: no +% Poison Skill Damage line — that stat comes from the Bramble, which is a different slot, so the two stack.",
              lookFor: ["-50% to Enemy Poison Resistance", "+2 to Poison and Bone Skills"],
              tradeOnly: true,
              alternatives: [{ ref: { kind: "runeword", slug: "white" }, why: "Until one exists. It is not a substitute — nothing is — but it is three skill levels." }],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "bramble" }, why: "+50% Poison Skill Damage if the roll allows. The spread from 25% to 50% is the largest of any runeword on the site." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills and the poison resistance to over-cap, with an Um for the fire." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "homunculus" }, why: "Skills, curses and resistances, and it blocks." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and 20% cast rate." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Cast rate and a fire skill level toward Corpse Explosion's radius." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "A rare ring with 10% Faster Cast Rate and resistances",
              why: "The last few points toward 125% cast rate, and cheaper than a second Stone of Jordan.",
              lookFor: ["10% Faster Cast Rate", "All resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find on a build that clears steadily." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Hellfire Torch (Necromancer)", why: "+3 Necromancer skills — three levels on the nova and its two synergies at once." },
        { label: "Poison and Bone skill grand charms", why: "The only charms that raise the three poison skills together." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, on a build with a small life pool that stands in the middle of the fight." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "An Enigma, so that standing in the pack becomes a choice rather than a commitment.",
    },

    {
      tier: "optimized",
      goal: "125% cast rate, both reductions, and a way out of the room.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "deaths-web" }, why: "A −50% roll. The difference between −40 and −50 is a tenth of every monster's poison resistance." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport, which turns standing in the middle of the pack from a commitment into a decision you can reverse.",
              sockets: "Jah, Ith, Ber into a 3-socket body armor.",
              alternatives: [{ ref: { kind: "runeword", slug: "bramble" }, why: "**This is the real trade-off of the build.** Bramble is up to +50% poison skill damage and Enigma is Teleport, and they are the same slot. Damage or mobility; there is no version that has both." }],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills and over-capped poison resistance." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "homunculus" }, why: "+2 skills, +2 curses, resistances and block." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and cast rate." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Cast rate and a fire skill level." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
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
        { label: "Hellfire Torch (Necromancer)", why: "+3 Necromancer skills." },
        { label: "Poison and Bone skill grand charms with life", why: "Skills and life in one row." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "A Rotting Fissure, if the zones you want keep turning out to be poison immune.",
    },

    {
      tier: "bis",
      goal: "Nothing left that resists poison and survives Corpse Explosion.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "deaths-web" }, why: "The item the build is named around in practice. A −50% roll with +2 Poison and Bone." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "bramble" }, why: "A maximum-roll Bramble. If you have an Enigma too, this is the swap you make for a boss and reverse for a clear." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 skills, +10% maximum poison resist, Um in the socket." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "homunculus" }, why: "+2 skills, +2 curses, +40 resistances." }],
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
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Cast rate and a fire skill level." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
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
        { label: "Hellfire Torch (Necromancer)", why: "+3 Necromancer skills." },
        { ref: { kind: "unique", slug: "rotting-fissure" }, why: "The sunder charm that puts poison immunes at 95% poison resistance and makes them ordinary targets. Its own penalty is the most absorbable of the six here, because this build over-caps poison resistance anyway." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      notes:
        "**Fully geared, this build has two answers and no third.** Poison with both reductions running handles everything that is merely resistant; Corpse Explosion handles what is immune. A Rotting Fissure collapses the two into one by making the immunes resistant instead — which is why it is the single most valuable charm this build can carry, and why it is listed here rather than as a curiosity.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**An Act 2 mercenary, and the aura choice is genuinely open here.** Might raises his physical damage, which matters because he is often the one finishing something the poison has already stopped regenerating. **Holy Freeze deserves a serious look**: this build wins by making fights last, and slowing everything down is exactly that — and it keeps the pack inside the nova.\n\nGive him an **Insight** early. **Fortitude** or **Treachery** with a **Vampire Gaze** keeps him standing, and **Life Tap** is in your plan partly for him.\n\n**His resistances take the full −40 in Nightmare and −100 in Hell.** Your skeletons' and golem's do not, and confusing the two is how a page ends up gearing the wrong member of the party.\n\n**Infinity is optional and it is not aimed at your damage.** Conviction lowers fire, cold and lightning resistance, not poison — so it does nothing for the nova and something real for Corpse Explosion's fire half. Death's Web and Lower Resist are the reductions this build actually needs, and neither is a runeword.",

  farming: [
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "The densest zone in the game, and poison is not among its recorded immunities — fire, lightning and physical are. A nova covers a seal pack in one cast and Corpse Explosion clears the physical immunes.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, short, and nothing there is recorded poison immune. A steady zone rather than a fast one, which is what damage over time wants.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "A herd standing shoulder to shoulder is the shape a nova is drawn for, and the recorded immunity here is physical rather than poison.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85 and the best experience in the game, with physical, fire, lightning and cold among its immunities rather than poison.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are fire and lightning immune, not poison, and they stand in a group — which is a nova's ideal target. Their life pools are large, which suits a build that stops regeneration.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "arcane-sanctuary",
      difficulty: "hell",
      why: "Lightning and magic immunity rather than poison, and long narrow platforms keep packs in one place. Slow, but nothing there resists you.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85 and quick, but its recorded population is poison immune — a Corpse Explosion run rather than a poison one, and only worth it once that half of the build is geared.",
      minTier: "budget",
      rating: 2,
    },
  ],

  immunityPlan:
    "**Poison is the second most resisted element in Hell**: ten of the twenty catalogued areas here record poison immunity, against thirteen for fire and eight for lightning. This build has one element, and the plan is two-layered.\n\n**Against something merely resistant, stack the reductions.** Death's Web is −40-50% to Enemy Poison Resistance and Lower Resist is a further −25% to −70%, and the two apply together. That is enough to turn a resistant monster into an ordinary one and it is the whole reason the build works in Hell.\n\n**Against something actually immune the two behave differently, and the difference is the plan.** Lower Resist is a curse, so it is cut to one fifth against a target already at 100% or more — and it still breaks the immunity if that fifth is enough. From a bare point it is −5 and reaches 104%; at the skill's −70% ceiling it is −14 and reaches 113%. **Death's Web breaks nothing, at any roll**: a −% to Enemy Poison Resistance line is applied after the immunity check and skipped entirely while the immunity stands. What it does is land at full value the moment Lower Resist has opened the door — which is why the pair is worth carrying together and why they are not two grades of the same thing.\n\n**Above 113% neither reaches, and the answer is Corpse Explosion**, which is why it is core rather than flex here: half physical and half fire, twenty points of radius, and no synergies to pay for. Amplify Damage is on the bar for the physical half.\n\n**A Rotting Fissure sunder charm is the third answer** and the only one that makes poison itself work on an immune, by putting it at 95% resistance instead. Its penalty costs you poison resistance, which this build over-caps anyway.\n\n**Uber Mephisto and Uber Andariel are not this build's targets**, whatever the elemental match-up suggests. This site has not researched Uber Tristram, three of the fifteen monsters carrying the Prime Evil pet-damage flag stand in that room, and a two-second damage-over-time effect against enormous life pools on a timer is the least favourable version of this build's argument. Nothing here should be read as a plan for that fight.",

  hardcoreNotes:
    "**The hardest of the three Necromancers to play safely**, because the nova is centred on you: clearing a room means standing in it. Take the block route seriously — a Homunculus is +40% Increased Chance of Blocking before you spend a point of Dexterity — reach the 48% hit-recovery target, and keep **Decrepify** for anything that reaches you rather than saving it for a boss. A one-point skeleton wall plus a Clay Golem is a doorway you can put between yourself and a charge, and it is why the utility summons are in the core plan rather than the flex list. An Enigma changes the risk profile more than any defensive item, because leaving is always better than surviving.",

  selfFoundNotes:
    "**The weakest of the three self-found, and the gap is one item.** Everything up to level 66 is reachable: White is two cheap runes, Homunculus and Andariel's Visage are ordinary finds, and Bramble is a rune investment rather than a trade. **Death's Web is the wall.** It drops only from area level 74 and up, it is among the least commonly found items in the game, and nothing substitutes for it — there is no second source of −% to Enemy Poison Resistance anywhere. A self-found version leans much harder on Corpse Explosion and on Lower Resist, and it works; it simply spends more of its time on the half of the build that is not poison.",

  levelingPath: {
    summary:
      "**You do not level as this.** Poison Nova unlocks at level 30, its two synergies are forty points on their own, and a partial version kills nothing. Level as a Summoner — that route is on the Necromancer levelling page and needs no respec of its own — and spend a token at 30 or later, once Poison Explosion and Poison Dagger have somewhere to go. The Den of Evil gives one free token per difficulty, so the swap costs nothing.",
    respecAt:
      "Level 30 at the earliest, and later is fine. **If you built an Iron Golem while levelling, unsummon it deliberately before you spend the token** — a respec that removes the skill destroys the golem and the item inside it.",
    viaBuild: "summoner-necromancer",
  },

  confidence: "verified",
  complete: true,
};
