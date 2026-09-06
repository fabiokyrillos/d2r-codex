import type { Skill, SkillTree } from "@/lib/types";

/**
 * The Warlock's three skill trees and thirty skills.
 *
 * Added by the paid *Reign of the Warlock* expansion, so every entry here
 * carries `release: "reign-of-the-warlock"` — the first skills on the site that
 * need it. The class page already carries `requiresDlc`.
 *
 * Every unlock level, prerequisite edge and tree coordinate is checked against
 * `content/classes/skill-graph.ts`, which is generated from the game's own
 * `skills.json`. Nothing structural here is authored: the fields that exist are
 * prose, plus the two things the columns cannot say on their own — which
 * `SkillKind` a reader should see, and how an attack's damage relates to the
 * weapon.
 *
 * Tree membership comes from `skilldesc.json`'s `SkillPage`, not from the
 * names, which would have got it wrong twice: Cleave is a weapon skill in the
 * Eldritch tree and Blood Boil is a Demon skill despite dealing fire. Page 1 is
 * Demon, page 2 Eldritch, page 3 Chaos, and `order` follows the pages.
 *
 * Numbers in the prose come from the pinned extraction. Four things are worth
 * stating once, because in each case a plausible reading is wrong:
 *
 *   The demon cap is on the pet *type*, not the skill. All three summons carry
 *   `pettype = demon` and the same `petmax`, so one, two or three demons is the
 *   total across Goatmen, Tainted and Defilers — not one of each. Bind Demon
 *   uses a different pet type and does not share that cap.
 *
 *   Hexes are applied by hitting something. Hex Bane, Hex Purge and Hex Siphon
 *   install their effect through `domeleeattack` / `domissiledamage` events and
 *   require a weapon. They are not curses and nothing about the Necromancer's
 *   one-curse-per-monster rule applies to them.
 *
 *   A sigil's radius steps at hard points 10 and 20 and nowhere else. All three
 *   read `(lvl >= 20) ? 8 : ((lvl >= 10) ? 6 : 4)`, and each also carries an
 *   unread `Radius` parameter of 7 that the expression overrides. The stepped
 *   values are published; the 7 is not.
 *
 *   Levitate is a mastery that counts weapons, not hands. `passiveitype = weap`
 *   with `passivereqweaponcount = 1`: it pays while exactly one weapon is
 *   equipped and is indifferent to whether that weapon is one- or two-handed.
 *
 * Where the columns describe an effect but no expression in the row reads the
 * parameter that would size it, the effect is described and the number is not
 * published. `docs/research/09-warlock.md` §9 lists all six such cases.
 *
 * Synergy magnitudes are authored only where the generator emits the edge
 * today. Three rows — Eldritch Blast, Hex Purge and Hex Siphon — name synergy
 * parameters whose labels are not yet in `SYNERGY_KINDS`; their relationships
 * are described in prose and left out of `synergies` until the graph carries
 * them. See `docs/proposals/warlock-1-wire-skills.md`.
 */

export const warlockTrees: SkillTree[] = [
  {
    slug: "demon",
    name: "Demon",
    classSlug: "warlock",
    order: 1,
    summary: "Enslaved demons, the passives that keep them standing, and the skills that spend them.",
    theme:
      "The tree is an economy rather than an army. You hold at most three demons, and half the tree exists to convert them into something else — Blood Boil detonates one, Engorge feeds one from a corpse, Consume destroys one outright for a buff on yourself. Demonic Mastery is what raises the ceiling from one demon to three, so it is the first real decision the class asks.",
  },
  {
    slug: "eldritch",
    name: "Eldritch",
    classSlug: "warlock",
    order: 2,
    summary: "The weapon tree: a mastery, four ways to swing or throw it, and three hexes carried on the hit.",
    theme:
      "Everything here needs a weapon in hand. Levitate is the class's damage mastery, the four attack skills are different shapes of the same swing — an arc, a throw, a throw that moves you, and a volley of duplicates — and the hexes ride along on whichever of them you are using. It is the only tree where gear choice and skill choice are the same choice.",
  },
  {
    slug: "chaos",
    name: "Chaos",
    classSlug: "warlock",
    order: 3,
    summary: "Ranged fire and void damage, plus three sigils placed on the ground.",
    theme:
      "Two damage schools and a control branch between them. Fire runs Ring of Fire into Flame Wave into Apocalypse; void runs Miasma Bolt into Miasma Chains into Abyss, all of it magic damage that very little resists. The sigils are neither — they are placed objects that hold ground, and the last of them executes anything that falls below a tenth of its life inside the ring.",
  },
];

export const warlockSkills: Skill[] = [
  // -------------------------------------------------------------------------
  // Demon
  // -------------------------------------------------------------------------
  {
    slug: "summon-goatman",
    name: "Summon Goatman",
    classSlug: "warlock",
    tree: "demon",
    kind: "summon",
    requiredLevel: 1,
    summary: "A melee demon that learns four abilities of its own as the skill grows.",
    mechanics: [
      "It gains a skill of its own at each of the first five hard points: **Stun at 2, Berserk at 3, Frenzy at 4 and Cleave at 5**. The first four points buy behaviour rather than numbers, which makes them cheap and the ones after them ordinary.",
      "Its damage starts at **+10% and climbs 10% per level**, its attack rating at **140 with 40 more per level**, and its defence at **100 with 20 more per level**. Demonic Mastery adds to the first two on top of that.",
      "**How many you get is not decided here.** All three summons share the `demon` pet type and the same cap — one, rising to two at 5 hard points of Demonic Mastery and three at 10 — so the ceiling is a total across every demon type, not one of each.",
      "Points in **Death Mark** give it Crushing Blow: **5% at one point, plus 1% per Death Mark level**.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "demonic-mastery",
    name: "Demonic Mastery",
    classSlug: "warlock",
    tree: "demon",
    kind: "passive",
    requiredLevel: 1,
    prerequisites: ["summon-goatman"],
    summary: "Raises every demon's damage, attack rating and speed — and is the only thing that raises how many you get.",
    mechanics: [
      "**Five hard points take the demon cap from one to two, and ten take it to three.** Nothing else in the game moves that number, and `+skills` from gear do not: the two thresholds read hard points only.",
      "Each demon gains **+10% damage with 10% more per level**, **+25% attack rating with 25% more per level**, and **+5% attack speed with 1% more per level**.",
      "Movement speed is the exception to the pattern — it rises on a diminishing curve from **+5% toward a 39% ceiling**, so the first point is worth far more than the twentieth.",
      "The skill has no effect of its own. It writes a state that every demon's row reads, which is why nothing shows on your own character sheet.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "death-mark",
    name: "Death Mark",
    classSlug: "warlock",
    tree: "demon",
    kind: "curse",
    requiredLevel: 6,
    prerequisites: ["summon-goatman"],
    summary: "Marks one monster: your demons teleport to it, and it takes more damage from everything.",
    mechanics: [
      "The mark cuts the target's damage reduction by **5, and 2 more per level**, and its defence by **50, and 35 more per level**. Both are large early and the defence line stays large.",
      "Your demons **teleport to the marked target** — the row carries a warp distance of 38 — which is what turns three slow melee minions into something that arrives. This is the skill that makes the Demon tree playable at range.",
      "It **requires a demon to be out**. With no pet the skill has nothing to command.",
      "It also clears some crowd control from the pet it sends, and it feeds two other skills: Summon Goatman's Crushing Blow, and Bind Demon's chance to capture.",
      "Duration is **125 frames with 13 more per level** — about five seconds at one point, and it is meant to be recast on the next target rather than maintained.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "summon-tainted",
    name: "Summon Tainted",
    classSlug: "warlock",
    tree: "demon",
    kind: "summon",
    requiredLevel: 12,
    prerequisites: ["summon-goatman"],
    element: "fire",
    summary: "A ranged demon that throws fire and carries your Blood Boil.",
    mechanics: [
      "It casts **Fire Ball at your level in this skill**, and it resists fire in its own right — one level of Resist Fire per point, capped at 30.",
      "It knows **Blood Boil at your hard-point level in that skill**, which is the tree's one case of a summon carrying one of your own skills rather than a version of it.",
      "Defence is **75 with 20 more per level**, life **+35% per level**, the same growth every demon gets.",
      "It shares the `demon` cap with Goatmen and Defilers. Summoning one does not add to your total, it fills a slot.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "summon-defiler",
    name: "Summon Defiler",
    classSlug: "warlock",
    tree: "demon",
    kind: "summon",
    requiredLevel: 18,
    prerequisites: ["summon-tainted"],
    summary: "The tanky demon. Carries Health Link, and is the sturdiest thing the tree summons.",
    mechanics: [
      "Defence is **125 with 20 more per level**, the highest base of the three, and its damage grows **10% per level of this skill and per level of Demonic Mastery** — the only summon whose damage reads the mastery's hard points directly.",
      "It carries **Health Link**, a skill of its own that the other two demons do not have.",
      "Same shared cap as the other two, and it is the most expensive of the three to cast at 70 mana.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "blood-oath",
    name: "Blood Oath",
    classSlug: "warlock",
    tree: "demon",
    kind: "passive",
    requiredLevel: 6,
    prerequisites: ["demonic-mastery"],
    summary: "Redirects damage you take onto your demons, and hardens them so they survive it.",
    mechanics: [
      "The share of damage sent to a demon rises on a diminishing curve **toward 30%**, so the first few points buy most of it.",
      "Demons gain resistance on the same shape of curve — from **3% toward 79%** — and physical damage reduction from **1 toward 12**. Together these are what let a demon absorb a hit that was aimed at you.",
      "It raises demon life by **50% at one point and 35% more per level**, which is why the Demon tree's summons scale with a passive rather than with the summon skills themselves.",
      "It feeds **Engorge** twice: +25 defence and +5 life regeneration per hard point of this skill, both applied through Engorge's aura.",
      "The row also carries a life, mana and stamina bonus for the Warlock — 10% with 1% more per level — that no expression in the tables reads. It is presumably applied by the skill's server function, and no number for it is published here.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "blood-boil",
    name: "Blood Boil",
    classSlug: "warlock",
    tree: "demon",
    kind: "spell",
    requiredLevel: 18,
    prerequisites: ["death-mark"],
    element: "fire",
    synergies: [
      { skill: "engorge", bonus: "+20% to the physical half per level" },
      { skill: "blood-oath", bonus: "+20% to the fire half per level" },
    ],
    summary: "Detonates one of your demons. Half fire, half physical, paid for out of the demon's life.",
    mechanics: [
      "The damage is **two tables, not one**: 10-20 fire and 10-20 physical at level 1, with identical growth. They are separately synergised — Blood Oath raises the fire and Engorge raises the physical — which is the evidence that they are two halves rather than one number written twice.",
      "It **costs the demon life, and the cost falls as you spend more demons**: 15% of one demon's life at level 1, halved per demon with two out and divided by three with three out, never below 5%.",
      "The blast radius steps at hard points: **6 at level 1, 9 at 5 and 12 at 10**.",
      "It needs a demon out. With none, there is nothing to boil.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "engorge",
    name: "Engorge",
    classSlug: "warlock",
    tree: "demon",
    kind: "buff",
    requiredLevel: 24,
    prerequisites: ["blood-boil"],
    summary: "Feeds a corpse to your demons. Heals them and gives them life steal, speed and damage reduction.",
    mechanics: [
      "It targets a **corpse**, which makes it the one skill in the tree with an economy outside your own demons.",
      "The heal is **30% of the demon's life with 1% more per level**, and the buff that comes with it grants **5% damage reduction**, life steal, and attack rate rising toward a **35% ceiling**.",
      "Duration is **125 frames with 75 more per level** — five seconds at one point, and roughly a minute at twenty.",
      "Two of its aura lines come from **Blood Oath** rather than from this skill: +25 defence and +5 life regeneration per hard point there.",
      "It is also the physical-damage synergy for **Blood Boil**, so the two are usually taken together rather than either alone.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "consume",
    name: "Consume",
    classSlug: "warlock",
    tree: "demon",
    kind: "buff",
    requiredLevel: 30,
    prerequisites: ["blood-oath"],
    summary: "Destroys one of your own demons outright and takes its life force as maximum life and speed.",
    mechanics: [
      "The demon is consumed entirely — the row spends **100% of its health** — so this is a one-way conversion, not a drain.",
      "You gain **+5% maximum life with 1% more per level**, and movement speed on a diminishing curve from **+10% toward a 46% ceiling**.",
      "Duration is **1000 frames with 500 more per level**: forty seconds at one point, twenty seconds more for each after it.",
      "It is a **periodic** effect that clears its own aura when it lapses, so the buff ends cleanly rather than being refreshed by re-consuming mid-duration.",
      "It also feeds **Hex Bane**'s damage, which is the tree's one link into the Eldritch tree and the reason a hex build sometimes takes a single point here.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "bind-demon",
    name: "Bind Demon",
    classSlug: "warlock",
    tree: "demon",
    kind: "summon",
    requiredLevel: 30,
    prerequisites: ["engorge", "summon-defiler"],
    summary: "Enslaves a demon you meet in the world. It does not count against your summon cap.",
    mechanics: [
      "The bound demon uses a **different pet type from the three summons, with a maximum of one**. A Warlock at ten points of Demonic Mastery holds three summoned demons *and* one bound one — this is the single largest reason to take the skill.",
      "It gains **monster affixes at hard points**: Extra Strong at 5, Extra Fast at 10, Spectral Hit at 15 and Aura Enchanted at 20. Those four thresholds are the skill's real progression.",
      "It is given **+75% damage with 5% more per level**, **+100% life with 5% more per level**, and flat damage of **50 with 25 more per level**.",
      "**Death Mark raises the chance to bind.** The capture chance itself starts at 12 and is capped at 64, but the curve between them is resolved in a file outside this extraction, so no per-level chance is published.",
      "Unlike an ordinary summon it regenerates life, and the row says so explicitly rather than leaving it to the elite-monster default.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },

  // -------------------------------------------------------------------------
  // Eldritch
  // -------------------------------------------------------------------------
  {
    slug: "levitate",
    name: "Levitate",
    classSlug: "warlock",
    tree: "eldritch",
    kind: "passive",
    requiredLevel: 1,
    summary: "The class's weapon mastery. Counts weapons, not hands — which is the whole point of the class.",
    mechanics: [
      "It pays while **exactly one weapon is equipped**, and the row is indifferent to whether that weapon is one-handed or two-handed. That is the levitation rule as the tables express it, and it is why the usual one-hand-versus-two-hand argument does not apply to this class.",
      "**+25% damage with 4% more per level**, and **+40% attack rating with 5% more per level**. Both are ordinary mastery numbers; the class gets them without giving up an off-hand.",
      "It also grants a critical-hit chance that rises on a diminishing curve from **0 toward 35%**.",
      "The line worth planning around: **−2% to weapon requirements with 2% more per level, down to a −50% floor**. A Warlock deep in this skill pays half the listed Strength and Dexterity for his weapon, which changes attribute allocation more than the damage does.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "cleave",
    name: "Cleave",
    classSlug: "warlock",
    tree: "eldritch",
    kind: "attack",
    requiredLevel: 6,
    prerequisites: ["levitate"],
    synergies: [
      { skill: "eldritch-blast", bonus: "+10% damage per level" },
      { skill: "hex-purge", bonus: "+10% damage per level" },
      { skill: "mirrored-blades", bonus: "+10% damage per level" },
    ],
    summary: "A wide melee arc that swings faster than a normal attack and costs almost no mana.",
    mechanics: [
      "The arc is measured in slices of a circle divided into thirty: **eleven at level 1, one more per level, capped at twenty**. That is roughly 132° opening to 240° — most of the way around you.",
      "It carries the **weapon's full damage**, and adds **20% with 5% more per level** on top. Attack speed rises on a curve from **+10% toward 30%**.",
      "It costs a **flat 3 mana that does not grow with level**, and the row lets it swing even with no mana at all. This is the skill you hold down.",
      "It is a prerequisite for Psychic Ward and a synergy for it, so the two are usually bought together.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "echoing-strike",
    name: "Echoing Strike",
    classSlug: "warlock",
    tree: "eldritch",
    kind: "attack",
    requiredLevel: 12,
    prerequisites: ["levitate"],
    element: "physical",
    damageModel: "weapon-plus-element",
    synergies: [
      { skill: "blade-warp", bonus: "+5% damage per level" },
      { skill: "mirrored-blades", bonus: "+5% damage per level" },
    ],
    summary: "Throws the levitated melee weapon at range and keeps most of its damage.",
    mechanics: [
      "The throw carries **116/128 — about 91% — of the weapon's damage**, plus a physical table of its own starting at 8-12. The weapon share is the larger half of it, which is why the skill wants a heavy weapon rather than a fast one.",
      "**+30% damage with 5% more per level**, and **+10% attack rating per level**.",
      "**Mirrored Blades adds throws**: one at base, and one more per five hard points there, up to five. Without Mirrored Blades it throws once.",
      "The weapon **comes back**, and the missile carries a chance to pull targets along on the return trip. The chance itself is a column the game leaves empty, so no number for it is published.",
      "It consumes weapon durability. A melee weapon only — the row restricts it in a way Mirrored Blades does not.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "blade-warp",
    name: "Blade Warp",
    classSlug: "warlock",
    tree: "eldritch",
    kind: "attack",
    requiredLevel: 18,
    prerequisites: ["echoing-strike"],
    element: "magic",
    damageModel: "element-only-attack",
    synergies: [
      { skill: "echoing-strike", bonus: "+24% damage per level" },
      { skill: "mirrored-blades", bonus: "+24% damage per level" },
    ],
    summary: "Hurls the weapon, teleports you to where it lands, and detonates it for magic damage.",
    mechanics: [
      "**The magic table is the whole of the damage.** Unlike Echoing Strike and Mirrored Blades, which run on the same server function and both declare a weapon share, this row declares none and sets its damage and flat-damage columns to zero. If a later extraction gives it a weapon share, this is the sentence that changes.",
      "It is the class's **movement skill**: the warp is the point, and the 8-10 magic explosion in a radius of 4 is what you get for using it offensively.",
      "It costs a **flat 15 mana at every level**, which makes it cheap to spam late and expensive early.",
      "Its synergy is the largest in the tree at **24% per level**, from two skills a weapon build already wants.",
    ],
    confidence: "single",
    release: "reign-of-the-warlock",
  },
  {
    slug: "mirrored-blades",
    name: "Mirrored Blades",
    classSlug: "warlock",
    tree: "eldritch",
    kind: "attack",
    requiredLevel: 30,
    prerequisites: ["blade-warp", "eldritch-blast"],
    summary: "Attacks with ethereal duplicates of the weapon. Two at base, five at fifteen points.",
    mechanics: [
      "**Two attacks at one point, three at 5, four at 10 and five at 15.** The count is the skill; everything after fifteen points is damage on attacks you already had.",
      "Each attack carries the **weapon's full damage**. Duplicates after the first land at a reduced share that rises on a curve from **50% toward 120%** — above 100% at high levels, which is unusual and is why the skill scales past its own count.",
      "**Crushing Blow is divided on the duplicates**, and how heavily depends on level: by 8 below 5 points, 12 below 10, 16 below 15 and 20 above it. A Crushing Blow build gets less from the extra swings than the swing count suggests.",
      "It works with **any weapon**, not only melee — the only skill in the tree that does — and it feeds Cleave, Echoing Strike and Blade Warp as a synergy.",
      "The row's own damage-synergy expression reads a parameter the row does not have, so the graph emits no synergy into this skill. Nothing is published about one in either direction.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "hex-bane",
    name: "Hex Bane",
    classSlug: "warlock",
    tree: "eldritch",
    kind: "attack",
    requiredLevel: 1,
    element: "magic",
    damageModel: "weapon-plus-element",
    synergies: [{ skill: "eldritch-blast", bonus: "+5 frames of hex duration per level" }],
    summary: "A weapon swing that adds magic damage and leaves the target easier to hit and easier to hurt.",
    mechanics: [
      "The weapon's full damage lands and the magic table lands with it — **9-16 at level 1**. The same rolled range is also written onto your character as flat magic weapon damage, so the skill is an imbue as well as an attack.",
      "The hex strips **30% of the target's defence with 1% more per level, to a 50% ceiling**, and **25% of its attack rating**.",
      "It lasts **3600 frames with 300 more per level** — around two and a half minutes at one point. This is a debuff you apply once per pack, not one you maintain.",
      "It **cannot be used with hand-to-hand weapons**. Every other weapon type works.",
      "Consume, Hex Purge and Mirrored Blades each raise its damage in the game's own tables, but through a parameter the graph does not currently read; the relationship is real and no magnitude for it is published here.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "hex-purge",
    name: "Hex Purge",
    classSlug: "warlock",
    tree: "eldritch",
    kind: "attack",
    requiredLevel: 12,
    prerequisites: ["hex-bane"],
    element: "magic",
    damageModel: "weapon-plus-element",
    summary: "A hex that detonates. Most hits explode, and the explosion has charges.",
    mechanics: [
      "The weapon's damage lands with a magic table of **10-15 at level 1** on top of it.",
      "The explosion fires on about **69% of hits at base**, and **Sigil Death raises that by 1% per level** — the tree's one link into the Chaos tree.",
      "It carries **charges**: one explosion at base, two at 10 hard points and three at 20. Radius is a flat 4. The row also names a per-level radius growth that no expression reads, so none is published.",
      "It grants **+10% attack speed with 1% more per level** while active, which makes it the cheapest attack-speed source the class has.",
      "Eldritch Blast lengthens its debuff and Hex Bane raises its damage. Both relationships are in the tables; the graph does not carry the second yet, so no magnitudes are published for them here.",
      "Like the other two hexes it needs a weapon, and not a hand-to-hand one.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "hex-siphon",
    name: "Hex Siphon",
    classSlug: "warlock",
    tree: "eldritch",
    kind: "attack",
    requiredLevel: 24,
    prerequisites: ["hex-purge"],
    summary: "A hex that cuts what the target deals and returns life and mana on every kill.",
    mechanics: [
      "The hex cuts the target's damage by **33%**. The row also carries a per-level increase to that figure which no expression reads, so **whether it grows past 33% is not established** and only the flat value is published.",
      "It grants **heal-after-kill and mana-after-kill of 1, with 1 more per level**, both raised further by hard points in **Engorge**. On a build clearing packs this is the class's sustain.",
      "It carries **no damage table of its own** — the weapon is the whole of the damage, unlike the other two hexes.",
      "Duration matches the rest of the family at **3600 frames with 300 more per level**, and Eldritch Blast lengthens it.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "psychic-ward",
    name: "Psychic Ward",
    classSlug: "warlock",
    tree: "eldritch",
    kind: "buff",
    requiredLevel: 18,
    prerequisites: ["cleave"],
    synergies: [
      { skill: "levitate", bonus: "+15 damage absorbed per level" },
      { skill: "cleave", bonus: "+15 damage absorbed per level" },
    ],
    summary: "A pool that absorbs damage and stuns whatever melees you while it holds.",
    mechanics: [
      "The pool absorbs **15 damage at level 1 with 10 more per level**, plus **15 per hard point of Levitate and Cleave** — which means the two skills a weapon build already maxes are most of the ward.",
      "Anything that hits you in melee while it is up is **stunned**, for a length that rises on a curve from **37 frames toward 85**.",
      "Mana is **20 with 2 more per level**, the steepest per-level mana growth in the tree.",
      "It is the prerequisite for Eldritch Blast and lengthens it, so the Eldritch tree's two non-weapon skills are bought as a pair.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "eldritch-blast",
    name: "Eldritch Blast",
    classSlug: "warlock",
    tree: "eldritch",
    kind: "spell",
    requiredLevel: 24,
    prerequisites: ["psychic-ward"],
    element: "magic",
    summary: "A repeating magic nova that re-applies Hex Bane's mark and steals life and mana while it runs.",
    mechanics: [
      "It fires **every 30 frames on its own** once cast, rather than per activation, and each nova **re-applies the Hex Bane debuff** to what it touches. It is the only skill in the class that maintains a hex without swinging.",
      "While it runs you gain **5% life steal and 5% mana steal, with 1% more of each per level**.",
      "Its own damage is small — **2-6 magic at level 1** — and is raised by Blade Warp and Hex Purge. The relationship is in the tables; the graph does not carry it yet, so no magnitude is published here.",
      "Base duration is **1000 frames**, with **50 more per hard point of Psychic Ward** — the prerequisite pays twice.",
      "It is also a prerequisite for Mirrored Blades, which is why a pure weapon build still spends a point here.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },

  // -------------------------------------------------------------------------
  // Chaos
  // -------------------------------------------------------------------------
  {
    slug: "miasma-bolt",
    name: "Miasma Bolt",
    classSlug: "warlock",
    tree: "chaos",
    kind: "spell",
    requiredLevel: 1,
    element: "magic",
    synergies: [
      { skill: "miasma-chains", bonus: "+10% damage per level" },
      { skill: "abyss", bonus: "+10% damage per level" },
    ],
    summary: "The starting bolt, and magic damage that almost nothing in the game resists.",
    mechanics: [
      "**2-4 magic at level 1** and 4 mana, which makes it the cheapest thing on the class's bar.",
      "Magic is the element with no monster mastery to raise it and very few immunities to stop it — the reason this branch stays useful into Hell without a sunder charm.",
      "Its range is 50, the longest reach in the tree.",
      "It is fed **10% per level by Miasma Chains and Abyss**, which is why a void build maxes it even after it stops being the skill you cast.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "ring-of-fire",
    name: "Ring of Fire",
    classSlug: "warlock",
    tree: "chaos",
    kind: "spell",
    requiredLevel: 6,
    element: "fire",
    synergies: [
      { skill: "flame-wave", bonus: "+10% damage per level" },
      { skill: "apocalypse", bonus: "+10% damage per level" },
    ],
    summary: "A ring of fire missiles thrown outward from you. Doubles its missile count at ten points.",
    mechanics: [
      "**Sixteen missiles below ten hard points and thirty-two at ten and above.** That single threshold roughly doubles the skill and is the only step in it.",
      "**6-10 fire at level 1** per missile, and the missiles travel outward, so the damage a single monster takes depends on how close it is standing.",
      "It is the fire branch's entry point and its cheapest synergy: Flame Wave and Apocalypse each feed it 10% per level, and it feeds both of them back.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "sigil-lethargy",
    name: "Sigil Lethargy",
    classSlug: "warlock",
    tree: "chaos",
    kind: "spell",
    requiredLevel: 6,
    summary: "A sigil placed on the ground that halves movement and attack speed inside it.",
    mechanics: [
      "**−50% movement and −50% attack rate**, both flat: the row applies them from a parameter pair with no per-level growth, so one hard point buys the whole slow.",
      "What points buy instead is **size**. The sigil steps at hard points 10 and 20 — radius 4, then 6, then 8 — and draws a larger mark at each step. Nothing between the thresholds changes it.",
      "It costs a **flat 4 mana at every level**, the cheapest sigil.",
      "A third line reads the target's defence from a parameter the row labels as damage dealt. The stat and the label disagree and nothing settles it, so **that effect is not quantified here**.",
    ],
    confidence: "single",
    release: "reign-of-the-warlock",
  },
  {
    slug: "miasma-chains",
    name: "Miasma Chains",
    classSlug: "warlock",
    tree: "chaos",
    kind: "spell",
    requiredLevel: 12,
    prerequisites: ["miasma-bolt"],
    element: "magic",
    synergies: [
      { skill: "miasma-bolt", bonus: "+10% damage per level" },
      { skill: "abyss", bonus: "+10% damage per level" },
    ],
    summary: "Spawns a spray of miasma bolts. Three at base, rising toward twelve.",
    mechanics: [
      "The bolt count rises on a diminishing curve from **3 toward a cap of 12**, so early points add bolts quickly and late ones barely move it.",
      "**6-9 magic at level 1** per chain, on top of whatever the bolts themselves do.",
      "**Its rate follows the attack animation, not the cast animation** — the row sets `UseAttackRate`, and no other Chaos skill does. What that means for a Faster Cast Rate breakpoint on this one skill is not established and no breakpoint is published for it.",
      "**Enhanced Entropy** raises its damage, range and duration as a passive, on top of the two synergies.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "sigil-rancor",
    name: "Sigil Rancor",
    classSlug: "warlock",
    tree: "chaos",
    kind: "spell",
    requiredLevel: 12,
    prerequisites: ["sigil-lethargy"],
    summary: "A sigil that turns a pack against itself — and makes it hit harder while it does.",
    mechanics: [
      "**A 75% chance to confuse the AI** of a monster caught in it. That figure is flat and does not grow with level.",
      "The sigil carries **+50% damage with 5% more per level** and **+5% attack speed with 1% more per level**. Nothing in the row names who receives them, and this page does not guess: the magnitudes are published and the recipient is left open.",
      "Size steps at hard points 10 and 20 like the other two sigils — radius 4, then 6, then 8.",
      "Mana is a **flat 12 at every level**.",
    ],
    confidence: "single",
    release: "reign-of-the-warlock",
  },
  {
    slug: "flame-wave",
    name: "Flame Wave",
    classSlug: "warlock",
    tree: "chaos",
    kind: "spell",
    requiredLevel: 18,
    prerequisites: ["ring-of-fire"],
    element: "fire",
    synergies: [
      { skill: "ring-of-fire", bonus: "+15% damage per level" },
      { skill: "apocalypse", bonus: "+15% damage per level" },
    ],
    summary: "A wall of fire that rolls away from you down a corridor.",
    mechanics: [
      "**13-17 fire at level 1**, the largest base damage in the tree until Apocalypse.",
      "The wave is **four missiles wide and runs seven lengths**, with a 17-frame delay between steps — so it clears a corridor rather than a room, and standing at the mouth of one is how the skill is used.",
      "Its synergies are the steepest in the fire branch at **15% per level** each, from the two skills either side of it.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "sigil-death",
    name: "Sigil Death",
    classSlug: "warlock",
    tree: "chaos",
    kind: "spell",
    requiredLevel: 24,
    prerequisites: ["sigil-rancor"],
    element: "fire",
    summary: "An execution ring. Anything inside it that drops below a tenth of its life dies and explodes.",
    mechanics: [
      "A monster inside the sigil that falls below **13% of its life dies outright**, and a champion, unique or superunique below **10%** does the same. Both thresholds are flat — points do not raise them.",
      "What dies **explodes**, which is what turns the skill from an execution into clearing speed.",
      "Size steps at hard points 10 and 20 like the other two sigils.",
      "It is also the reason a hex build looks at this tree: **Hex Purge's chance to explode rises 1% per hard point here**.",
      "The row carries fire as its element but publishes no damage table of its own — the execution is a life threshold, not damage.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "enhanced-entropy",
    name: "Enhanced Entropy",
    classSlug: "warlock",
    tree: "chaos",
    kind: "passive",
    requiredLevel: 24,
    prerequisites: ["miasma-chains"],
    summary: "A passive that raises the void branch's damage, reach and duration at once.",
    mechanics: [
      "**Miasma: +2% damage with 2% more per level, +5% range with 1% more per level, +2% duration with 2% more per level.**",
      "**Abyss: +2% damage with 3% more per level** — the steepest line in the skill — **and +2% duration with 2% more per level.**",
      "It is the prerequisite for Abyss, so a void build reaches its capstone through this rather than through the bolts.",
      "Nothing here touches the fire branch. It is a void-only passive and a fire build should not take it.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "apocalypse",
    name: "Apocalypse",
    classSlug: "warlock",
    tree: "chaos",
    kind: "spell",
    requiredLevel: 30,
    prerequisites: ["flame-wave", "sigil-death"],
    element: "fire",
    synergies: [
      { skill: "ring-of-fire", bonus: "+10% damage per level" },
      { skill: "flame-wave", bonus: "+10% damage per level" },
    ],
    summary: "The fire capstone. Huge damage over a huge area, and it strips fire resistance while it burns.",
    mechanics: [
      "**80-100 fire at level 1**, several times anything else in the tree, and it grows by roughly 25 a level band.",
      "It **cuts the target's fire resistance by 5, with 1 more per level, to a 40-point ceiling** — the class's only resistance pierce, and the reason the fire branch can function in Hell without outside help.",
      "Radius steps at hard points 10 and 20: **13, then 15, then 17**. Even the smallest is larger than anything else the class casts.",
      "Reaching it costs a point in Sigil Death as well as the fire chain, which is the tree's one forced crossover.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
  {
    slug: "abyss",
    name: "Abyss",
    classSlug: "warlock",
    tree: "chaos",
    kind: "spell",
    requiredLevel: 30,
    prerequisites: ["enhanced-entropy"],
    element: "magic",
    synergies: [
      { skill: "miasma-bolt", bonus: "+10% damage per level" },
      { skill: "miasma-chains", bonus: "+10% damage per level" },
    ],
    summary: "The void capstone. Collapses an area for magic damage and leaves the ground burning.",
    mechanics: [
      "**20-40 magic at level 1** in a **radius of 6**, and magic is the element the fewest monsters resist — so this is the class's answer to a pack that stops everything else.",
      "It leaves fire on the ground afterwards. The row gives that a duration of **2 with no unit named**, so nothing is published about how long it lasts.",
      "**Mana is charged when the skill resolves rather than when it starts**, which matters for interrupting it.",
      "It feeds Miasma Bolt and Miasma Chains as well as being fed by them, so the void branch is a closed triangle: every point in it raises the other two.",
      "**Enhanced Entropy** adds damage and duration on top of the synergies, at a steeper rate than it gives the miasma skills.",
    ],
    confidence: "verified",
    release: "reign-of-the-warlock",
  },
];
