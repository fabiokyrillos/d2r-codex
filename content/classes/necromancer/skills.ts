import type { Skill, SkillTree } from "@/lib/types";

/**
 * The Necromancer's three skill trees and thirty skills.
 *
 * Every unlock level, prerequisite edge and tree coordinate here is checked
 * against `content/classes/skill-graph.ts`, which is generated from the game's
 * own `skills.json`. Nothing structural in this file is authored — the fields
 * that exist are prose, plus the two things the columns cannot say on their own:
 * which `SkillKind` a reader should see, and how an attack's damage relates to
 * the weapon.
 *
 * Numbers in the prose come from the same pinned extraction, and from the
 * reference implementation of the legacy engine where a column alone does not
 * settle behaviour. Three things are worth stating once, because they are the
 * cases where a plausible reading is wrong:
 *
 *   Radius is not one unit. Corpse Explosion's parameters are labelled "half
 *   squares" and the engine halves them; a curse's are labelled "Radius" and
 *   the engine uses them as they are. The same number means two different
 *   distances on the two pages, so no shared conversion is applied.
 *
 *   Dim Vision and Terror are the only two curses whose duration is divided by
 *   the difficulty's `AiCurseDivisor` — 1, 2 and 4 in Normal, Nightmare and
 *   Hell. Every other curse lasts the same time everywhere.
 *
 *   Corpse Explosion does not read the corpse's life. It recomputes the
 *   monster *type's* base life range at that monster's level and difficulty and
 *   takes the average of it, which is why a Champion pack does not explode
 *   harder than the trash beside it and why player count changes nothing.
 *
 * Tree order is the public one — Summoning, Poison and Bone, Curses — and is
 * independent of the game's 1-based `SkillPage`, which numbers them the other
 * way round. `order` drives what a reader sees; `page` stays in the graph as the
 * extraction gave it.
 */

export const necromancerTrees: SkillTree[] = [
  {
    slug: "summoning",
    name: "Summoning Spells",
    classSlug: "necromancer",
    order: 1,
    summary: "An army that fights for you, and the passives that keep it standing.",
    theme:
      "The safest way to play the class and the reason it is a standard Hardcore pick: an army of skeletons absorbs what would otherwise hit you. The two masteries and Summon Resist do far more for the army than another summon type would.",
  },
  {
    slug: "poison-and-bone",
    name: "Poison and Bone Spells",
    classSlug: "necromancer",
    order: 2,
    summary: "Magic damage almost nothing resists, poison over time, and Corpse Explosion.",
    theme:
      "Two damage schools in one tree. Bone deals magic damage, which only a handful of monsters resist; poison is dealt over time and is the one element with no Mastery to raise it. Corpse Explosion sits between them and belongs to every build in the class.",
  },
  {
    slug: "curses",
    name: "Curses",
    classSlug: "necromancer",
    order: 3,
    summary: "Ten debuffs, one at a time per target.",
    theme:
      "A monster carries exactly one curse: casting a second replaces the first. That single rule is what makes the tree a set of choices rather than a stack, and it is why the argument is never which curse is strongest but which one you are giving up.",
  },
];

export const necromancerSkills: Skill[] = [
  // -------------------------------------------------------------------------
  // Summoning Spells
  // -------------------------------------------------------------------------
  {
    slug: "skeleton-mastery",
    name: "Skeleton Mastery",
    classSlug: "necromancer",
    tree: "summoning",
    kind: "passive",
    requiredLevel: 1,
    prerequisites: ["raise-skeleton"],
    summary:
      "Adds life and damage to every skeleton, skeletal mage and revive you raise.",
    mechanics: [
      "Each hard point adds **+8 life and +2 damage** to a raised minion, and the game reads this skill's *effective* level — so +skills gear counts here, unlike a synergy.",
      "It carries two further parameters the game labels for Revive alone: **+5% life and +10% damage per level** on a revived monster.",
      "The bonus is written onto a minion when it is created. Raising this skill does nothing for the skeletons already standing; the army has to be re-raised to collect it.",
    ],
    confidence: "verified",
  },
  {
    slug: "raise-skeleton",
    name: "Raise Skeleton",
    classSlug: "necromancer",
    tree: "summoning",
    kind: "summon",
    requiredLevel: 1,
    summary: "Raises a skeleton warrior from a corpse. The backbone of the Summoner.",
    mechanics: [
      "The cap is **one skeleton per level up to three, then two plus one for every three levels** — eight at hard level 20, and more as +skills raise the effective level.",
      "Each cast needs a corpse, so the first kill in a room is always the slow one.",
      "Skeletal mages are counted separately and do not share this cap.",
    ],
    confidence: "verified",
  },
  {
    slug: "clay-golem",
    name: "Clay Golem",
    classSlug: "necromancer",
    tree: "summoning",
    kind: "summon",
    requiredLevel: 6,
    summary: "A slow, tough golem whose hits slow what they touch.",
    synergies: [
      { skill: "blood-golem", bonus: "+5% life per level" },
      { skill: "fire-golem", bonus: "+6% damage per level" },
      { skill: "iron-golem", bonus: "+35 defence per level" },
    ],
    mechanics: [
      "The slow it applies climbs from **0% toward a 75% ceiling** on a diminishing curve — the strongest slow available to the class, and the reason one point in it is worth having on builds that never summon anything else.",
      "You can have **one golem at a time**. All four golem skills share a single pet type with a maximum of one, so summoning another replaces this one.",
    ],
    confidence: "verified",
  },
  {
    slug: "golem-mastery",
    name: "Golem Mastery",
    classSlug: "necromancer",
    tree: "summoning",
    kind: "passive",
    requiredLevel: 12,
    prerequisites: ["clay-golem"],
    summary: "Raises golem life, speed and attack rating. Affects whichever golem is out.",
    mechanics: [
      "**+20% life at one point and +20% more per level**, plus **+25 attack rating and +25 more per level**.",
      "It also raises golem movement speed from **0% toward a 40% ceiling** on a diminishing curve, which is what stops a Clay Golem being left behind.",
      "This is not a synergy in the game's sense: golems read this skill's effective level, so gear that grants +skills raises it.",
    ],
    confidence: "verified",
  },
  {
    slug: "raise-skeletal-mage",
    name: "Raise Skeletal Mage",
    classSlug: "necromancer",
    tree: "summoning",
    kind: "summon",
    requiredLevel: 12,
    prerequisites: ["raise-skeleton"],
    summary:
      "Raises a skeleton that casts one of four elements, chosen at random when it is raised.",
    mechanics: [
      "Same count formula as Raise Skeleton and a **separate cap**: a Summoner fields both armies at once.",
      "The element is rolled when the mage is raised and cannot be chosen, which is why the group's damage is unreliable against anything with a matching immunity.",
      "Its own attack skill level scales with Skeleton Mastery, so the mages get stronger from the same passive the warriors do.",
    ],
    confidence: "verified",
  },
  {
    slug: "blood-golem",
    name: "Blood Golem",
    classSlug: "necromancer",
    tree: "summoning",
    kind: "summon",
    requiredLevel: 18,
    prerequisites: ["clay-golem"],
    summary: "A golem that steals life from what it hits, and shares some of it with you.",
    synergies: [
      { skill: "clay-golem", bonus: "+20 attack rating per level" },
      { skill: "fire-golem", bonus: "+6% damage per level" },
      { skill: "iron-golem", bonus: "+35 defence per level" },
    ],
    mechanics: [
      "Its life steal climbs from **75% toward a 150% ceiling** on a diminishing curve, and **30% of what it steals is passed to you**.",
      "**25% of the healing you receive is passed to the golem**, so potions keep it alive as well as you.",
      "The old life-link — the caster taking a share of the damage the golem takes — is **not in the pinned tables**: the column that carries it is zero. Guides written before that changed still describe it as a risk on Hardcore.",
    ],
    confidence: "verified",
  },
  {
    slug: "summon-resist",
    name: "Summon Resist",
    classSlug: "necromancer",
    tree: "summoning",
    kind: "passive",
    requiredLevel: 24,
    prerequisites: ["golem-mastery"],
    summary: "Gives your minions elemental and poison resistance. One point is a large jump.",
    mechanics: [
      "Resistance climbs from **20% toward a 75% ceiling** on a diminishing curve, so the first point buys most of what twenty do.",
      "It is applied to a minion when the minion is created, which means raising the skill does nothing for an army already standing.",
      "It does not overwrite an element a minion already absorbs — the Fire Golem keeps its own fire absorb rather than being handed fire resistance.",
      "In the reference implementation of the legacy engine it is applied to skeletons, skeletal mages and golems, and **not** to revives. Whether Diablo II: Resurrected changed that is not something this repository has established.",
    ],
    confidence: "single",
  },
  {
    slug: "iron-golem",
    name: "Iron Golem",
    classSlug: "necromancer",
    tree: "summoning",
    kind: "summon",
    requiredLevel: 24,
    prerequisites: ["blood-golem"],
    summary:
      "Consumes an item to build a golem that carries that item's properties. The item is gone.",
    synergies: [
      { skill: "blood-golem", bonus: "+5% life per level" },
      { skill: "clay-golem", bonus: "+20 attack rating per level" },
      { skill: "fire-golem", bonus: "+6% damage per level" },
    ],
    mechanics: [
      "The item you target is **destroyed** and becomes the golem. This is the one skill in the class that can cost you something you cannot get back.",
      "It carries a damage-return aura of its own, on top of whatever the item it was made from provides.",
      "Still one golem at a time: summoning any other golem replaces it, and the item does not come back.",
    ],
    confidence: "verified",
  },
  {
    slug: "fire-golem",
    name: "Fire Golem",
    classSlug: "necromancer",
    tree: "summoning",
    kind: "summon",
    element: "fire",
    requiredLevel: 30,
    prerequisites: ["iron-golem"],
    summary: "A golem that runs a Holy Fire aura and is healed rather than hurt by fire.",
    synergies: [
      { skill: "blood-golem", bonus: "+5% life per level" },
      { skill: "clay-golem", bonus: "+20 attack rating per level" },
      { skill: "iron-golem", bonus: "+35 defence per level" },
    ],
    mechanics: [
      "It runs **Holy Fire at level 7, rising by one per skill level to a cap of 30** — a real aura, affecting everything near it.",
      "Its fire absorb climbs from **25% toward 100%** on a diminishing curve, which is why it is the golem that survives Hell's fire enchanted packs.",
      "The damage table on this page is the fire damage the aura adds, not a weapon range.",
    ],
    confidence: "verified",
  },
  {
    slug: "revive",
    name: "Revive",
    classSlug: "necromancer",
    tree: "summoning",
    kind: "summon",
    requiredLevel: 30,
    prerequisites: ["iron-golem", "raise-skeletal-mage"],
    summary:
      "Raises a dead monster to fight for you for three minutes. The count is the skill's level.",
    mechanics: [
      "**The number you can hold is the skill's effective level**, so +skills gear raises it directly.",
      "Each revive lasts **4500 frames — three minutes** — and cannot be refreshed. This is what makes it a burst of bodies rather than a standing army.",
      "The revive's life is **re-rolled from that monster type's base life range** at its level and difficulty, not copied from the corpse. A Champion revives with the ordinary life of its kind.",
      "If the monster's level is above your character level, its life is scaled down in that proportion.",
      "Only monsters the game flags as revivable can be raised, which is why some packs never yield one.",
    ],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Poison and Bone Spells
  // -------------------------------------------------------------------------
  {
    slug: "teeth",
    name: "Teeth",
    classSlug: "necromancer",
    tree: "poison-and-bone",
    kind: "spell",
    element: "magic",
    requiredLevel: 1,
    summary: "A spray of bone shards. The cheapest magic damage in the game at level one.",
    synergies: [
      { skill: "bone-prison", bonus: "+15% damage per level" },
      { skill: "bone-spear", bonus: "+15% damage per level" },
      { skill: "bone-spirit", bonus: "+15% damage per level" },
      { skill: "bone-wall", bonus: "+15% damage per level" },
    ],
    mechanics: [
      "Fires **two projectiles at level 1 and one more per level, capped at 24** — the same ceiling Multiple Shot uses, read from the same shape of column.",
      "The projectiles spread, so the count matters far more against a group than against a single target.",
      "Deals magic damage, which only a handful of monsters in the game resist.",
    ],
    confidence: "verified",
  },
  {
    slug: "bone-armor",
    name: "Bone Armor",
    classSlug: "necromancer",
    tree: "poison-and-bone",
    kind: "buff",
    requiredLevel: 1,
    summary: "A shield that absorbs a flat amount of damage, then breaks and is recast.",
    synergies: [
      { skill: "bone-prison", bonus: "+15 damage absorbed per level" },
      { skill: "bone-wall", bonus: "+15 damage absorbed per level" },
    ],
    mechanics: [
      "Absorbs **20 damage at level 1 and 15 more per level**, and **+15 more for every point in Bone Wall and Bone Prison**.",
      "It absorbs **physical** damage — melee and missile. An elemental hit goes straight through it, which is the opposite of what the name suggests to most readers.",
      "Once the pool is spent the buff ends and has to be recast. It is not a duration.",
    ],
    confidence: "verified",
  },
  {
    slug: "poison-dagger",
    name: "Poison Dagger",
    classSlug: "necromancer",
    tree: "poison-and-bone",
    kind: "attack",
    element: "poison",
    requiredLevel: 6,
    // A weapon attack that adds poison on top. The table is the poison alone,
    // and without this the page would print that range and say nothing about
    // the dagger swinging with it.
    damageModel: "weapon-plus-element",
    summary: "A melee attack that adds poison damage. Requires a dagger.",
    synergies: [
      { skill: "poison-explosion", bonus: "+20% damage per level" },
      { skill: "poison-nova", bonus: "+20% damage per level" },
    ],
    mechanics: [
      "**The dagger's own damage lands as well.** The table on this page is the poison the skill adds, not the whole hit.",
      "The poison lasts **2 seconds at level 1 and 0.4 seconds longer per level**, and the damage in the table is the total spread across that window rather than an instant hit.",
      "It only works with a dagger equipped, which is what keeps it a curiosity rather than a build.",
    ],
    confidence: "verified",
  },
  {
    slug: "corpse-explosion",
    name: "Corpse Explosion",
    classSlug: "necromancer",
    tree: "poison-and-bone",
    kind: "spell",
    // Deliberately no `element`: the damage is half physical and half fire, and
    // a single badge would say one of those and hide the other. The split is
    // the first thing the mechanics list states instead.
    //
    // `corpse-life` rather than falling through to "no damage table". The graph
    // has no EMin/EMax for this skill because the number is not the skill's —
    // it is a share of the exploded monster type's base life — and the page
    // used to announce that it dealt no direct damage at all.
    damageModel: "corpse-life",
    requiredLevel: 6,
    prerequisites: ["teeth"],
    summary:
      "Detonates a corpse for damage based on that monster type's base life. Half physical, half fire.",
    mechanics: [
      "**Half the damage is physical and half is fire**, split from one rolled total. Each half is then reduced by the target's resistance to that type, so a fire immune still takes the physical half.",
      "The damage is **70%–120% of the monster type's average base life**, and that life is recomputed from the game's own table at the corpse's level and difficulty — not read off the corpse. Player count, Champion, Unique and Super Unique bonuses do not raise it.",
      "**Skill points buy radius, not damage.** The radius parameter starts at 8 and rises by 1 per level, and the engine halves it: roughly 4 units at level 1 and 13 at level 20.",
      "If your character level is below the corpse's monster level, the damage is scaled down in that proportion. Levelling raises it; the skill's own level does not.",
      "Amplify Damage acts on the physical half — the same 100-point cut to physical damage resistance every other physical hit gets.",
      "There is a full article on this: see the Corpse Explosion mechanics page.",
    ],
    confidence: "verified",
  },
  {
    slug: "bone-wall",
    name: "Bone Wall",
    classSlug: "necromancer",
    tree: "poison-and-bone",
    kind: "summon",
    requiredLevel: 12,
    prerequisites: ["bone-armor"],
    summary: "Raises a wall of bone that blocks movement until it is broken.",
    synergies: [
      { skill: "bone-armor", bonus: "+10% life per level" },
      { skill: "bone-prison", bonus: "+10% life per level" },
    ],
    mechanics: [
      "**Eight segments**, and the count does not grow with skill level — points buy the wall's life instead, at **+25% per level**.",
      "It stands for **600 frames — 24 seconds** — at every level.",
      "Its real use is as a door: monsters have to break it, which buys a caster the seconds a Teleport would otherwise cost.",
    ],
    confidence: "verified",
  },
  {
    slug: "poison-explosion",
    name: "Poison Explosion",
    classSlug: "necromancer",
    tree: "poison-and-bone",
    kind: "spell",
    element: "poison",
    requiredLevel: 18,
    prerequisites: ["corpse-explosion", "poison-dagger"],
    summary: "Detonates a corpse into a poison cloud. Needs a body, like everything around it.",
    synergies: [
      { skill: "poison-dagger", bonus: "+15% damage per level" },
      { skill: "poison-nova", bonus: "+15% damage per level" },
    ],
    mechanics: [
      "The poison lasts **2 seconds at level 1 and 0.4 seconds longer per level**; the table gives the total damage spread across that window.",
      "It consumes the corpse, so it competes with Corpse Explosion and with Raise Skeleton for the same bodies.",
      "Unlike Corpse Explosion, the damage is the skill's own and does not depend on what died.",
    ],
    confidence: "verified",
  },
  {
    slug: "bone-spear",
    name: "Bone Spear",
    classSlug: "necromancer",
    tree: "poison-and-bone",
    kind: "spell",
    element: "magic",
    requiredLevel: 18,
    prerequisites: ["corpse-explosion"],
    summary:
      "A piercing spear of bone. Magic damage in a straight line, and the tree's main attack.",
    synergies: [
      { skill: "bone-prison", bonus: "+8% damage per level" },
      { skill: "bone-spirit", bonus: "+8% damage per level" },
      { skill: "bone-wall", bonus: "+8% damage per level" },
      { skill: "teeth", bonus: "+8% damage per level" },
    ],
    mechanics: [
      "It **pierces every target in its path**, which is what makes it a line-clearing skill rather than a single-target one.",
      "Magic damage: only a handful of monsters in the game resist it, and none of them are common in the places this build farms.",
      "It has no Mastery. Damage comes from the four synergies and from +skills, and from nothing else.",
    ],
    confidence: "verified",
  },
  {
    slug: "bone-prison",
    name: "Bone Prison",
    classSlug: "necromancer",
    tree: "poison-and-bone",
    kind: "summon",
    requiredLevel: 24,
    prerequisites: ["bone-spear", "bone-wall"],
    summary: "Cages a target in bone. The same wall, wrapped around something.",
    synergies: [
      { skill: "bone-armor", bonus: "+8% life per level" },
      { skill: "bone-wall", bonus: "+8% life per level" },
    ],
    mechanics: [
      "Life scales at **+25% per level**, and it stands for **600 frames — 24 seconds** — like Bone Wall.",
      "Its mana cost **falls** with level rather than rising: 27 at level 1, one less per level.",
      "Boxing a ranged attacker is what it is for; it does not stop anything that can teleport or that already stands next to you.",
    ],
    confidence: "verified",
  },
  {
    slug: "poison-nova",
    name: "Poison Nova",
    classSlug: "necromancer",
    tree: "poison-and-bone",
    kind: "spell",
    element: "poison",
    requiredLevel: 30,
    summary: "A ring of poison expanding from you. The class's one true area attack.",
    prerequisites: ["poison-explosion"],
    synergies: [
      { skill: "poison-dagger", bonus: "+10% damage per level" },
      { skill: "poison-explosion", bonus: "+10% damage per level" },
    ],
    mechanics: [
      "The poison lasts **2 seconds at every level**. The columns that lengthen the other two poison skills are simply absent here, so all the growth goes into damage.",
      "The table gives the **total** damage over those two seconds, not damage per second and not an instant hit.",
      "It needs no corpse, which is what separates it from the rest of the tree.",
      "Poison has no Mastery. Lower Resist is the only thing in the class that reduces poison resistance.",
    ],
    confidence: "verified",
  },
  {
    slug: "bone-spirit",
    name: "Bone Spirit",
    classSlug: "necromancer",
    tree: "poison-and-bone",
    kind: "spell",
    element: "magic",
    requiredLevel: 30,
    prerequisites: ["bone-spear"],
    summary: "A homing skull that seeks a target. Higher single-target damage than Bone Spear.",
    synergies: [
      { skill: "bone-prison", bonus: "+8% damage per level" },
      { skill: "bone-spear", bonus: "+8% damage per level" },
      { skill: "bone-wall", bonus: "+8% damage per level" },
      { skill: "teeth", bonus: "+8% damage per level" },
    ],
    mechanics: [
      "It **seeks** rather than travelling straight, and hits one target — the opposite trade to Bone Spear's pierce.",
      "Higher base damage than Bone Spear at the same level, which is why it is the boss half of a bone build rather than a build of its own.",
      "It shares Bone Spear's synergies, so the two are spent on together rather than chosen between.",
    ],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Curses
  // -------------------------------------------------------------------------
  {
    slug: "amplify-damage",
    name: "Amplify Damage",
    classSlug: "necromancer",
    tree: "curses",
    kind: "curse",
    requiredLevel: 1,
    summary:
      "Cuts a monster's physical damage resistance by 100. The largest physical multiplier in the game.",
    mechanics: [
      "It lowers physical damage **resistance** by 100 points rather than multiplying damage: a monster at 0% resistance goes to −100%, taking double. One at 50% goes to −50%, and the same curse is worth far more there.",
      "Against a monster that is **physically immune** the curse lands at one fifth strength, cutting 20 points rather than 100. That is exactly enough to break a monster sitting at 100% physical resistance, and not enough for one above 120%.",
      "Radius grows by 1 per level from 3, and it lasts 8 seconds at level 1 with 3 seconds more per level.",
      "One point is usually all a physical party needs; the duration and radius are what extra points buy.",
    ],
    confidence: "verified",
  },
  {
    slug: "dim-vision",
    name: "Dim Vision",
    classSlug: "necromancer",
    tree: "curses",
    kind: "curse",
    requiredLevel: 6,
    summary: "Blinds a pack so it cannot see you. The Summoner's safety curse.",
    mechanics: [
      "A blinded monster stops chasing and stops using ranged attacks until something hits it.",
      "**Its duration is divided by the difficulty**: 7 seconds at level 1 in Normal, half that in Nightmare and a quarter of it in Hell. Only this curse and Terror are treated that way.",
      "Because it is a curse, casting it removes whatever curse was already on the target — including Amplify Damage.",
    ],
    confidence: "verified",
  },
  {
    slug: "weaken",
    name: "Weaken",
    classSlug: "necromancer",
    tree: "curses",
    kind: "curse",
    requiredLevel: 6,
    prerequisites: ["amplify-damage"],
    summary: "Reduces the physical damage a monster deals. Large radius, long duration.",
    mechanics: [
      "**−33% damage dealt at level 1, one point more per level**, so twenty points reach −52%.",
      "Its radius starts at 9 — the joint largest of any curse — which is what makes it a room-wide defensive cast rather than a targeted one.",
      "It is the safer half of the Amplify Damage decision: one lowers what you take, the other raises what you deal, and a target can only carry one of them.",
    ],
    confidence: "verified",
  },
  {
    slug: "iron-maiden",
    name: "Iron Maiden",
    classSlug: "necromancer",
    tree: "curses",
    kind: "curse",
    requiredLevel: 12,
    prerequisites: ["amplify-damage"],
    summary: "Returns a large share of a monster's melee damage to it. The classic Uber tool.",
    mechanics: [
      "Returns **200% of the damage dealt at level 1, +25% per level** — 675% at twenty points.",
      "It only returns damage from attacks that connect in melee, so it does nothing against casters and ranged monsters.",
      "This is the curse that kills things far above your own damage output, which is why it is the Necromancer's contribution to Uber Tristram.",
    ],
    confidence: "verified",
  },
  {
    slug: "terror",
    name: "Terror",
    classSlug: "necromancer",
    tree: "curses",
    kind: "curse",
    requiredLevel: 12,
    prerequisites: ["weaken"],
    summary: "Makes monsters flee. Useful for breaking a pack, dangerous for scattering it.",
    mechanics: [
      "**Divided by difficulty like Dim Vision**: 8 seconds at level 1 in Normal, four in Nightmare, two in Hell.",
      "Fleeing monsters spread out, which is the opposite of what a Corpse Explosion build wants — it is a panic button, not a routine cast.",
      "Distance fled grows with level, which mostly makes the problem larger.",
    ],
    confidence: "verified",
  },
  {
    slug: "confuse",
    name: "Confuse",
    classSlug: "necromancer",
    tree: "curses",
    kind: "curse",
    requiredLevel: 18,
    prerequisites: ["dim-vision"],
    summary: "Monsters attack whatever is nearest, including each other.",
    mechanics: [
      "Confused monsters pick targets at random, so a dense pack fights itself while your army arrives.",
      "It is a crowd-control curse rather than a damage one: nothing about it raises what you deal.",
      "Radius and duration are what points buy — 6 and 10 seconds at level 1, growing by 1 and 2 per level.",
    ],
    confidence: "verified",
  },
  {
    slug: "life-tap",
    name: "Life Tap",
    classSlug: "necromancer",
    tree: "curses",
    kind: "curse",
    requiredLevel: 18,
    prerequisites: ["iron-maiden"],
    summary:
      "Half the physical damage dealt to a cursed monster comes back as life. The best party curse.",
    mechanics: [
      "**50% of the damage dealt returns as life**, and the figure does not change with level — points buy radius and duration only.",
      "It works for everyone hitting the target, which makes it the strongest thing a Necromancer brings to a melee party.",
      "Dracul's Grasp casts it on striking, so a melee character can carry it without a Necromancer in the party.",
    ],
    confidence: "verified",
  },
  {
    slug: "attract",
    name: "Attract",
    classSlug: "necromancer",
    tree: "curses",
    kind: "curse",
    requiredLevel: 24,
    prerequisites: ["confuse"],
    summary: "Everything nearby attacks the cursed monster instead of you.",
    mechanics: [
      "The longest curse in the tree: 12 seconds at level 1 and 3.6 seconds more per level.",
      "Its radius is 9 and does not grow, matching Weaken's as the largest in the tree.",
      "**No curse can be applied to a target while Attract is on it** — not another Attract, and not Amplify Damage. It is the one curse in the tree that locks the slot rather than sharing it.",
    ],
    confidence: "verified",
  },
  {
    slug: "decrepify",
    name: "Decrepify",
    classSlug: "necromancer",
    tree: "curses",
    kind: "curse",
    requiredLevel: 24,
    prerequisites: ["terror"],
    summary:
      "Slows, weakens and exposes a monster at once. Shorter than Amplify Damage, and does more.",
    mechanics: [
      "One curse, four effects, all at **−50% and none of them growing with level**: movement speed, attack speed, damage dealt, and physical damage resistance.",
      "The resistance half is Amplify Damage's effect at half strength — so against a monster at 0% physical resistance, Amplify doubles your damage and Decrepify multiplies it by 1.5.",
      "Against a **physically immune** monster it is cut to one fifth like every other resistance curse, which leaves 10 points — not enough to break a 100% immunity that Amplify Damage does break. Immunes are the one place the choice between the two is not a judgement call.",
      "A Reaper's Toll casts it on striking, which is why that polearm is a standard mercenary weapon for physical builds outside this class.",
      "It is the shortest curse in the tree: 4 seconds at level 1, 0.6 seconds more per level. Points buy duration and nothing else.",
      "The usual answer is both: Amplify Damage for clearing, Decrepify for anything that is actually dangerous.",
    ],
    confidence: "verified",
  },
  {
    slug: "lower-resist",
    name: "Lower Resist",
    classSlug: "necromancer",
    tree: "curses",
    kind: "curse",
    requiredLevel: 30,
    prerequisites: ["decrepify", "life-tap"],
    summary:
      "Lowers fire, cold, lightning and poison resistance. The only thing in the class that touches poison resistance.",
    mechanics: [
      "The reduction climbs from **25% toward a 70% ceiling** on a diminishing curve, so the first point is worth far more than the twentieth.",
      "It covers **poison as well as the three elements**, which no aura and no other curse does — and poison has no Mastery, so this is the whole of a poison build's resistance answer.",
      "Against a monster that is *immune* to the element it works at one fifth strength — and, unlike a mastery or a −% to Enemy Resistance, it still breaks the immunity if a fifth is enough. At the skill's −70% ceiling that fifth is −14, which reaches 113%; from a bare point it is −5, which reaches 104%.",
      "It is a curse like any other: it replaces Amplify Damage on the target rather than stacking with it.",
    ],
    confidence: "verified",
  },
];
