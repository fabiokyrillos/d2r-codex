import type { Build } from "@/lib/types";

/**
 * The Bone Spear Necromancer — "Bonemancer", and Bone Spirit is on this page
 * rather than on one of its own.
 *
 * WHY THE TWO SHARE A PAGE
 * ------------------------
 * They share every synergy. Both receive damage from Teeth, Bone Wall, Bone
 * Prison and each other, so **the hundred points that max Bone Spear are the
 * same hundred points that max Bone Spirit** — there is no version of this
 * character that has one and not the other, and no point plan that separates
 * them. Splitting them into two pages would publish one build twice with its
 * gear advice divided between the copies, which is the failure this site
 * already decided against for Javazon and Bowazon.
 *
 * Teeth is on the page for the same reason and is not a build either: it is a
 * twenty-point synergy that nobody casts after level 10.
 *
 * THE ARGUMENT FOR THE ELEMENT
 * ----------------------------
 * Magic is the least resisted damage type in the game and this site's own area
 * data says so: **one** of the twenty catalogued areas records magic immunity,
 * against thirteen for fire, ten for poison and eight each for lightning and
 * physical. `EXPECTED_IMMUNITY_CENSUS` pins that count, because the sentence
 * below argues from it and a count drifts silently when an area is added.
 *
 * THE COST
 * --------
 * A hundred points in five skills, which is the largest single-tree commitment
 * on the site. What that leaves is five points, and this page spends them on
 * the Decrepify chain and the golem rather than pretending there is more room.
 */
export const boneSpearNecromancer: Build = {
  slug: "bone-spear-necromancer",
  name: "Bone Spear Necromancer",
  classSlug: "necromancer",
  summary:
    "A spear of bone that pierces a whole line, a spirit that hunts one target, and magic damage — which one area in twenty resists.",
  damageTypes: ["magic"],
  primarySkill: "bone-spear",
  playstyle:
    "Bone Spear travels in a straight line and passes through everything on it, so you fight down corridors and along walls rather than into the middle of rooms. Bone Spirit is the other half: it curves through the air, seeks a single target, and is what you cast at the thing with a name. Between them you have an answer to a pack and an answer to a boss, both dealing magic damage that almost nothing in Hell resists. Bone Armor stands between you and whatever gets close, refreshed on recast, and Corpse Explosion is on the bar for the one thing the pair is bad at — killing quickly once something has already died.",
  strengths: [
    "**Magic is the least resisted damage in the game.** One of the twenty catalogued areas here records magic immunity, against thirteen for fire and eight for lightning",
    "**Bone Spear pierces everything in a line**, so a corridor of monsters is one cast rather than one cast each",
    "Bone Spirit seeks its target and does not miss, which makes this the best single-target Necromancer",
    "Every synergy is shared: the hundred points that max the spear max the spirit too",
    "Bone Armor, Bone Wall and Bone Prison are three defences that the same points already bought",
  ],
  weaknesses: [
    "**A hundred points in five skills**, which is the largest commitment on the site and leaves five for everything else",
    "**No damage until the synergies are in.** A level-30 Bone Spear with nothing behind it is weak, and the build only becomes itself in the high 70s",
    "You are the one dealing the damage, so you are in range of what you are killing — with no army, no life steal and a small life pool",
    "Mana-hungry: Bone Spear costs about 12 at high levels and you cast constantly",
    "Damage does not scale with gear the way an elemental build's does. There is no +% Magic Skill Damage anywhere",
  ],
  difficulty: "moderate",
  budget: "medium",
  ratings: {
    clearSpeed: 4,
    bossing: 4,
    survivability: 3,
    magicFind: 3,
    terrorZones: 4,
    ubers: 1,
    soloSelfFound: 3,
    players8: 3,
  },

  skills: [
    {
      skill: "bone-spear",
      points: 20,
      role: "main",
      order: 1,
      note: "**16-204 magic damage over twenty points, before synergies** — and the synergies are most of the number. It pierces, so aim along the longest line of monsters you can find rather than at the nearest one.",
    },
    {
      skill: "teeth",
      points: 20,
      role: "synergy",
      order: 2,
      note: "The cheapest twenty points in the plan and the first to max, because it feeds both the spear and the spirit. You will stop casting it around level 10 and keep raising it for the rest of the game.",
    },
    {
      skill: "bone-spirit",
      points: 20,
      role: "main",
      order: 3,
      note: "**20-369 magic damage over twenty points**, and it seeks. This is what a boss is killed with, and it is a synergy for Bone Spear at the same time — the points are never wasted on the packs it is slower against.",
    },
    {
      skill: "bone-wall",
      points: 20,
      role: "synergy",
      order: 4,
      note: "A damage synergy for both attacks, a life synergy for Bone Prison, and an absorb synergy for Bone Armor — three jobs from one block of points. It is also a wall you can drop across a doorway.",
    },
    {
      skill: "bone-prison",
      points: 20,
      role: "synergy",
      order: 5,
      note: "The last twenty, and the same three jobs as Bone Wall. **Its mana cost falls with level** — 27 at one point and 8 at twenty — which is the only skill in the class that gets cheaper.",
    },
    {
      skill: "bone-armor",
      points: 1,
      role: "utility",
      note: "**One point is the right answer here, and it is counter-intuitive.** Bone Armor's own absorb is 305 at twenty hard points, but its two synergies are Bone Wall and Bone Prison — which this plan is already maxing for the damage. One point plus forty levels of synergy is a large shield; twenty points would be forty more absorbed damage bought with points the attack needs.",
    },
    {
      skill: "corpse-explosion",
      points: 1,
      role: "utility",
      note: "One point, plus every +skill you own for radius. It is Bone Spear's prerequisite anyway, and it is how you clear the trash a boss leaves behind without spending a hundred casts on it.",
    },
    {
      skill: "amplify-damage",
      points: 1,
      role: "utility",
      note: "For Corpse Explosion's physical half rather than for your own damage — **nothing in the class lowers magic resistance**, so no curse improves the spear or the spirit directly.",
    },
    { skill: "clay-golem", points: 1, role: "utility", note: "Something to stand in front of you. He slows what he hits, which on a build with no army is the whole of your crowd control." },
    { skill: "raise-skeleton", points: 1, role: "utility", note: "One point plus +skills is three or four bodies between you and the pack. On a build that has to stand still to aim a line, that is worth more than it looks." },
    { skill: "weaken", points: 1, role: "flex", note: "The first of three points toward Decrepify. Useful on its own against a melee pack." },
    { skill: "terror", points: 1, role: "flex", note: "Decrepify's prerequisite." },
    {
      skill: "decrepify",
      points: 1,
      role: "flex",
      note: "**Decrepify unlocks at level 24.** Halving a boss's attack speed and movement is what lets you stand still long enough to land a Bone Spirit, which is the single most useful thing a curse does for this build.",
    },
    { skill: "golem-mastery", points: 1, role: "flex", note: "Keeps the Clay Golem standing long enough to matter." },
    { skill: "summon-resist", points: 1, role: "flex", note: "One point. The curve's first point is most of it, and the golem takes no difficulty penalty to be repaired in the first place." },
  ],
  flexPoints: [
    "**The core is 105 points and the five flex above are the other five**, so this plan genuinely lands on 110 rather than being padded to it. The hundred in the bone tree are not negotiable: every one of the five skills feeds the other two attacks, so cutting any of them cuts both.",
    "**The real decision is Bone Armor, and it is a trap.** Its absorb is 305 at twenty hard points, which sounds like a defensive plan — but its two synergies are Bone Wall and Bone Prison, and this build is maxing both for the damage. One hard point plus forty levels of synergy already gives a large shield. Twenty hard points buys forty more absorbed damage at the cost of forty per cast on your attack. Take the one point.",
    "**If you drop the Decrepify chain**, the three points go to Bone Armor or to Raise Skeleton. That is a defensible swap on a character that plays behind a doorway rather than in the open.",
    "**Do not add Lower Resist.** It lowers fire, cold, lightning and poison resistance and this build deals none of those. There is no magic-resistance curse in the game, which is the price of the element being unresisted.",
    "**Do not max Corpse Explosion here.** It is a complement, not a second build: the twenty points it would cost come directly out of the synergies that make both attacks work, and its radius already grows with the +skills the build wants anyway.",
  ],
  stats: {
    strength: "Enough for your armor and your shrunken head. Nothing here scales with it.",
    dexterity: "Base. Consider maximum block instead if you are playing Hardcore — a Homunculus is +40% Increased Chance of Blocking before a single point.",
    vitality: "Everything else. You are the one in range, and there is no army in front of you.",
    energy: "None. Bone Spear is about 12 mana at high levels and you cast constantly, but the answer is an Insight and a mana pool from gear rather than a stat that gives 2 mana a point.",
    notes: [
      "**This is the most mana-hungry Necromancer.** A mercenary with Insight is not a luxury here; it is the difference between casting and drinking.",
      "Your resistances drop 40 in Nightmare and 100 in Hell, and there is no army standing between you and the consequences.",
      "Faster Cast Rate is the damage stat. There is no +% Magic Skill Damage in the game, so casting more often is the only way the number goes up outside +skills.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 75,
      frames: 10,
      priority: "required",
      why: "Damage per second on this build is damage per cast times casts per second, and the first half is fixed by the point plan. 75% is the minimum that feels like an attack rather than a spell.",
    },
    {
      stat: "fcr",
      value: 125,
      frames: 8,
      priority: "recommended",
      why: "The realistic target with a Spirit and an Arachnid Mesh, and 25% more casts is 25% more damage on a build with no other multiplier.",
    },
    {
      stat: "fhr",
      value: 48,
      frames: 6,
      priority: "recommended",
      why: "You stand still to aim a line. Being locked in hit recovery is how a Bonemancer dies, and Bone Armor absorbing the hit does not stop the interruption.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Teeth to twenty, and Bone Spear the moment it unlocks.",
      levelRange: [1, 35],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any wand with +Teeth or +Poison and Bone Skills",
              why: "Teeth is a real attack until about level 18 and a synergy afterwards, so a wand that raises it does both jobs. Vendors sell these from Act 1.",
              lookFor: ["+2-3 Poison and Bone Skills", "+3 to Teeth", "+1 Necromancer Skills"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Cast rate, hit recovery, run speed and mana regeneration for two runes. Every line of it is on-plan." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills and +10 Energy." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "Any Necromancer shrunken head with +Poison and Bone Skills",
              why: "A shield that carries class skills. Keep every 2-socket one you find for a Splendor later.",
              lookFor: ["+2 Necromancer Skills", "+3 Bone Spear", "2 sockets"],
            },
          ],
        },
      ],
      nextUpgrade: "Level 35 for a White, which is the weapon this build keeps for twenty levels.",
      notes:
        "**Teeth first, and do not feel odd about it.** It is a genuine attack in Normal, it is Corpse Explosion's prerequisite, and every point is a synergy for both endgame skills. Bone Spear unlocks at level 18 and takes over from there.",
    },

    {
      tier: "nightmare",
      goal: "A White wand, and the five bone skills climbing together.",
      levelRange: [35, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "white" },
              why: "**The progression weapon for this build, and it is not close.** +3 to Poison and Bone Skills raises all five bone skills at once, +2 to Bone Spear and +3 to Bone Armor on top of that, and 20% Faster Cast Rate — for two runes in a wand that drops in Act 1.",
              sockets: "Dol and Io into a 2-socket wand. A Bone Wand or Grim Wand is the cheapest base; a plain Wand or Yew Wand caps at one socket and will not work.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and up to 35% Faster Cast Rate. On a build whose only damage multiplier is cast rate, this is a damage item.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "splendor" },
                  why: "+1 skill and +10% cast rate in a 2-socket shrunken head, stacking with the head's own +Poison and Bone. Available at 37 and far cheaper than a Monarch.",
                  sockets: "Eth and Lum into any 2-socket shield — a shrunken head counts.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "bone" },
              why: "+2 Necromancer skills and +100-150 mana on the most mana-hungry build in the class. The Bone Armor proc when struck is genuinely useful here, unlike the Bone Spear one.",
              sockets: "Sol, Um, Um into a 3-socket body armor.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate and mana regeneration, which are the two things this build runs out of." }],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "75% before Hell — and there is no army in front of you." }],
      nextUpgrade: "A Harlequin Crest and a Homunculus, then the long climb to 75% cast rate.",
    },

    {
      tier: "early-hell",
      goal: "75% cast rate, capped resistances, and the synergies finished.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "white" }, why: "Still the best wand you can make. Five skill levels across the tree and 20% cast rate." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "homunculus" },
              why: "+2 Necromancer skills, All Resistances +40 and +40% block. On a build with no army the block is not a bonus — it is the defensive plan.",
              alternatives: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Two skill levels and 35% cast rate, if the resistances are covered elsewhere." }],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 skills, +30 all resistances and 30% Faster Cast Rate. The standard Hell entry armor." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, mana and magic find at 50 Strength." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "belt",
          picks: [
            {
              label: "Rare or crafted caster belt: 10% Faster Cast Rate, life and resistances",
              why: "**Arachnid Mesh is the slot's real answer — +1 all skills and 20% Faster Cast Rate, the two stats that raise this build's damage — and it requires level 80**, past this tier. A rare belt buys the cast rate now and keeps sixteen potion slots while it does.",
              lookFor: ["10% Faster Cast Rate", "Life", "Resistances"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Cast rate and mana regeneration." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills, +20% maximum mana." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Hit recovery and Strength. **Marrowwalk** is the Necromancer boot people name here — it carries Bone Prison charges and +1-2 Skeleton Mastery, and this site has not catalogued it or the behaviour sometimes attributed to it." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "75% everywhere, and life because there is nothing in front of you." }],
      nextUpgrade: "125% cast rate, and then an Enigma or a Heart of the Oak.",
    },

    {
      tier: "budget",
      goal: "125% cast rate and a wand that raises the two attacks directly.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "A rare or crafted wand with +3 Bone Spear and +2 Necromancer Skills",
              why: "The first upgrade over White, and it is a trade rather than a find. +3 to Bone Spear on top of +2 Necromancer skills is five effective levels on the skill you cast most.",
              lookFor: ["+3 to Bone Spear", "+3 to Bone Spirit", "+2 Necromancer Skills", "20% Faster Cast Rate"],
              tradeOnly: true,
              alternatives: [{ ref: { kind: "runeword", slug: "white" }, why: "Still excellent, and free." }],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "homunculus" }, why: "Skills, resistances and block." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "Skills, resistances and cast rate." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, with an Um or a cast-rate jewel in the socket." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and 20% cast rate." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Cast rate and mana regeneration." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and maximum mana." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "A rare ring with 10% Faster Cast Rate and resistances",
              why: "The last few points to 125%, and cheaper than a second Stone of Jordan.",
              lookFor: ["10% Faster Cast Rate", "All resistances", "Life", "Mana"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Hellfire Torch (Necromancer)", why: "+3 Necromancer skills — three levels across all five bone skills at once, which is the largest single charm effect this build can carry." },
        { label: "Poison and Bone skill grand charms", why: "The only charms that raise the whole tree together." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, on a build with a small life pool and nothing in front of it." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "A Heart of the Oak, or an Enigma if you would rather have the mobility.",
    },

    {
      tier: "optimized",
      goal: "Every skill level available, and the cast rate to use them.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "heart-of-the-oak" },
              why: "+3 skills, 40% Faster Cast Rate, +30-40 all resistances and 15% maximum mana. On a build whose only multiplier is cast rate and whose only scaling is skill levels, this is both at once.",
              sockets: "Ko, Vex, Pul, Thul into a 4-socket wand or staff.",
              alternatives: [
                {
                  label: "A crafted wand with +3 Bone Spear, +3 Bone Spirit and +2 Necromancer Skills",
                  why: "Eight effective levels on the two attacks, against Heart of the Oak's three on everything. The wand wins on damage; Heart of the Oak wins on resistances and mana.",
                  tradeOnly: true,
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "homunculus" }, why: "+2 skills, +40 resistances and block. **Boneflame** and **Darkforge Spawn** are the other Necromancer heads named here; neither is catalogued on this site." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport, which on a build that fights along lines means choosing the line rather than walking to it.",
              sockets: "Jah, Ith, Ber into a 3-socket body armor.",
              alternatives: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, +65 all resistances and damage reduction, if the Ber is not happening." }],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills and a socket." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and 20% cast rate." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Cast rate and mana regeneration." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and maximum mana." }],
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
      nextUpgrade: "The last skill levels, from charms and from a better wand.",
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
              ref: { kind: "unique", slug: "deaths-web" },
              why: "**+2 to All Skills, and half of it is wasted here** — the −40-50% enemy poison resistance does nothing for magic damage. It is on this list anyway because two levels on all five bone skills is two levels, and the +1-2 to Poison and Bone stacks on top. A crafted wand with +3 to each attack is the better item; this is the one you will actually be offered.",
              alternatives: [{ ref: { kind: "runeword", slug: "heart-of-the-oak" }, why: "+3 skills and 40% cast rate, and every line of it does something." }],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "homunculus" }, why: "+2 skills, +40 resistances, +40% block. Socket it for whatever is still short." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, with an Um in the socket." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% cast rate." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Cast rate and mana regeneration." }],
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
        { label: "Poison and Bone skill grand charms with life", why: "The last effective levels." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      notes:
        "**There is no damage item for this build**, and that is the honest summary of its endgame. No armor gives +% Magic Skill Damage, no charm does, and no curse lowers magic resistance. Everything above raises skill levels or cast rate, and those are the only two levers. The upside is that the levers are cheap and the element they raise is the one nothing resists.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**An Act 2 mercenary carrying an Insight, and the Insight is the point.** This is the most mana-hungry build in the class — Bone Spear costs about 12 mana at high levels and you cast it constantly — and Meditation is the difference between attacking and drinking. The aura on the mercenary himself matters less than usual, because none of them raises magic damage: **Might** if you want him killing things, **Holy Freeze** if you want the pack slowed while you aim a line, and Holy Freeze is the better answer for most players here.\n\nGear him for survival — **Fortitude** or **Treachery** with a **Vampire Gaze** — and remember that **his resistances take the full −40 in Nightmare and −100 in Hell**, exactly as yours do. Your Clay Golem's do not; the two are different rules and the mercenary is the one that needs the gear.\n\n**Infinity does nothing for your damage.** Conviction lowers fire, cold and lightning resistance; there is no magic resistance for it to lower. It is not on this build's list at any budget.",

  farming: [
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Long straight approaches and packed seal groups, which is exactly the shape Bone Spear's pierce wants. Fire, lightning and physical immunity are recorded here and none of the three touches magic damage.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85, the best experience in the game, and four recorded immunities — physical, fire, lightning and cold — none of which is magic. The corridors suit a line attack better than most level-85 zones.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and short, with physical, cold and lightning among its immunities rather than magic. Bone Spirit handles the boss packs the spear is slower against.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "mephisto",
      difficulty: "hell",
      why: "A single target with a large life pool and no magic resistance, standing still across a moat. This is Bone Spirit's ideal fight and one of the best magic-find runs in the game.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council stand in a tight group on a straight platform, and their fire and lightning immunity is irrelevant to magic damage.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 with no magic immunity recorded, and narrow enough that a pierced line reaches most of a pack. Its fire and poison immunities are somebody else's problem.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "arcane-sanctuary",
      difficulty: "hell",
      why: "**The one zone on this list to avoid.** It is the only catalogued area that records magic immunity, which is precisely this build's blind spot — and Corpse Explosion is the only answer you have there.",
      minTier: "budget",
      rating: 1,
    },
  ],

  immunityPlan:
    "**Magic is the least resisted damage type in the game, and this site's own area data is the argument.** One of the twenty catalogued areas records magic immunity — the Arcane Sanctuary — against thirteen for fire, ten for poison, and eight each for lightning and physical. That single number is most of why this build exists.\n\nThe cost of that is that **there is no help available when it does fail.** No curse in the game lowers magic resistance, so Lower Resist is off the plan entirely. There is no Magic Mastery, no +% Magic Skill Damage on any item, and no sunder charm for magic. A monster that resists magic simply resists it, and nothing you can buy or cast changes that.\n\nSo the answer is **Corpse Explosion**, at one point plus every +skill you own. Half physical and half fire, Amplify Damage on the bar for the physical half, and a radius that grows with the skill levels the build is already collecting. It is not a second build and it is not maxed — it is the thing you cast in the Arcane Sanctuary, and the thing that clears the trash a boss leaves behind everywhere else.",

  hardcoreNotes:
    "**Better than it looks, on one condition: play behind something.** A one-point Clay Golem and three or four skeletons cost four points and are the difference between aiming a line and being surrounded while you aim it. Bone Prison is a genuine escape — twenty points of it is already in the plan for the damage — and Bone Armor at one point plus forty levels of synergy absorbs more than most builds' defensive skills. Reach 48% hit recovery, take the Homunculus for the block rather than the skills, and treat the **Arcane Sanctuary as closed**: it is the one place your damage does not work, and there is no gear answer to that.",

  selfFoundNotes:
    "**Very good, because the weapon is free.** White is two Countess-tier runes in a wand that drops in Act 1, and it carries this build from level 35 into Hell without complaint — +3 to Poison and Bone, +2 to Bone Spear, +3 to Bone Armor and 20% cast rate is a genuinely endgame-adjacent line-up for nothing. Homunculus, Harlequin Crest, Skin of the Vipermagi and Magefist are all ordinary finds. What a self-found version lacks is cast rate, which is the damage stat here — so it clears more slowly rather than failing. The one thing it cannot substitute for is nothing at all, because there is no single item this build depends on.",

  levelingPath: {
    summary:
      "**Levellable as itself from level 1, with Teeth doing the work.** Teeth is a real attack in Normal, it is Corpse Explosion's prerequisite, and every point in it is a synergy for both endgame skills — so nothing is wasted. Bone Spear takes over at 18 and Bone Spirit at 30. Many players still prefer to level as a Summoner and respec, because an army is faster through Normal and Nightmare than a partially-synergised spear; the Necromancer levelling page walks that route.",
    respecAt:
      "Not needed if you level as Teeth and Bone Spear. If you level as a Summoner instead, respec any time after 30. **Unsummon an Iron Golem deliberately before you spend a token** — the respec destroys it and the item inside it.",
    viaBuild: "summoner-necromancer",
  },

  confidence: "verified",
  complete: true,
};
