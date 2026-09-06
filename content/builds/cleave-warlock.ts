import type { Build } from "@/lib/types";

/**
 * The Cleave Warlock — the Eldritch tree, and the class's signature loadout.
 *
 * This is the build the class was designed around, and one number decides its
 * shape. The Eldritch tree offers two ways to swing — an arc and a throw — and
 * they are not two builds:
 *
 *   Cleave          fed 10% per level by Eldritch Blast, Hex: Purge and
 *                   Mirrored Blades          -> +600% at twenty each
 *   Echoing Strike  fed 5% per level by Blade Warp and Mirrored Blades
 *                                            -> +200%
 *
 * Both carry the weapon's full damage, so the multiplier is the whole
 * comparison and it is three to one. Echoing Strike is a ranged utility skill
 * on a melee bar, not an alternative plan, and this page does not offer it as a
 * package either — a menu option a third as good is a trap with a menu around
 * it.
 *
 * The plan that results is the tightest of the four: **104 of 110 points**, five
 * skills at twenty and four prerequisites at one, with six points left over and
 * nothing invented to absorb them.
 *
 * Two things the reader has to be told plainly. **Levitation Mastery pays while
 * exactly one weapon is equipped and does not care whether it has one hand or
 * two** — that is the levitation rule as the tables express it, and it is why a
 * Warlock swings a two-handed weapon and still holds a Grimoire. And **no item
 * in the game carries +2 to Eldritch Skills**: only tabs 21 and 23, demon and
 * chaos, appear on any unique. This tree's class support is generic +Warlock
 * skills and one weapon with +3 Mirrored Blades on it.
 */
export const cleaveWarlock: Build = {
  slug: "cleave-warlock",
  name: "Cleave Warlock",
  classSlug: "warlock",
  summary:
    "A 240-degree arc carrying the full damage of a two-handed weapon, with a Grimoire still in the off-hand and three hexes riding on every swing.",
  damageTypes: ["physical", "magic"],
  primarySkill: "cleave",
  playstyle:
    "You hold one button. Cleave sweeps eleven of thirty slices of a circle at one point and twenty at twenty — roughly 132 degrees opening to 240 — carries the weapon's full damage, costs a flat 3 mana that never grows, and swings even when you have no mana at all. Mirrored Blades is the boss button: two ethereal duplicates at one point and five at fifteen, each one a full weapon hit. The hexes are applied by hitting things rather than cast, so they land while you are already doing the thing you were going to do — Hex: Bane strips defence and writes magic damage onto the weapon, Hex: Purge detonates on about seven hits in ten. It is the least fussy melee build on this site and the only one that never runs out of mana.",
  strengths: [
    "+600% weapon damage from three synergies, the largest multiplier available to any Warlock skill",
    "A two-handed weapon and an off-hand at the same time — no other class in the game can do this",
    "Cleave costs a flat 3 mana at every level and swings without mana at all",
    "Physical and magic at once: physical immunity is recorded in eight catalogued areas and magic in one",
    "Levitation Mastery cuts item requirements by up to half, which pays for the weapon it wants",
  ],
  weaknesses: [
    "104 of 110 points, so almost nothing is optional and a mistake is a respec",
    "No item in the game carries +2 to Eldritch Skills — this tree gets generic +Warlock skills and nothing dedicated",
    "Mirrored Blades divides Crushing Blow across the duplicates, so the swing count is worth less than it reads",
    "Melee range on a class with 3 life per Vitality and no shapeshift",
    "No attack-speed breakpoint table exists on this site for any class, so weapon speed has to be judged rather than looked up",
  ],
  difficulty: "advanced",
  budget: "high",
  ratings: {
    clearSpeed: 4,
    bossing: 5,
    survivability: 3,
    magicFind: 2,
    terrorZones: 4,
    ubers: 4,
    soloSelfFound: 2,
    players8: 3,
  },

  skills: [
    {
      skill: "cleave",
      points: 20,
      role: "main",
      order: 1,
      note: "Eleven of thirty slices at one point, one more per level, capped at twenty. The weapon's full damage plus 20% and 5% per level, and an attack-speed bonus rising from 10% toward 30%.",
    },
    {
      skill: "mirrored-blades",
      points: 20,
      role: "synergy",
      order: 2,
      note: "+10% Cleave damage per level, and the boss button in its own right: two attacks at one point, three at 5, four at 10 and five at 15. Everything past fifteen is damage on swings you already had.",
    },
    {
      skill: "hex-purge",
      points: 20,
      role: "synergy",
      order: 3,
      note: "+10% Cleave damage per level. It also grants +10% attack speed with 1% more per level, which is the cheapest attack speed the class has.",
    },
    {
      skill: "eldritch-blast",
      points: 20,
      role: "synergy",
      order: 4,
      note: "+10% Cleave damage per level, and it is the sustain: 5% life and 5% mana steal with 1% more of each per level, while a nova every 30 frames re-applies the Hex: Bane mark for free.",
    },
    {
      skill: "levitation-mastery",
      points: 20,
      role: "utility",
      order: 5,
      note: "The class mastery. +25% damage with 4% more per level, +40% attack rating with 5% more per level, a critical chance rising toward 35%, and −2% item requirements with 2% more per level to a −50% floor. It is not a graph synergy of Cleave and is not labelled one here.",
    },
    {
      skill: "hex-bane",
      points: 1,
      role: "prerequisite",
      note: "One point, and it earns it: the skill writes its own rolled magic damage onto your character as flat magic weapon damage, so every Cleave swing carries magic as well as physical.",
    },
    { skill: "echoing-strike", points: 1, role: "prerequisite" },
    { skill: "blade-warp", points: 1, role: "prerequisite", note: "The class's only movement skill without an Enigma — you throw the weapon and teleport to it. One point is all the plan can afford and all it needs." },
    { skill: "psychic-ward", points: 1, role: "prerequisite" },
  ],

  flexPoints: [
    "**Six points, and the plan is 104 of 110.** That is the tightest of the four Warlock builds and there is no package group here because there is no room for one.",
    "**One into Hex: Siphon.** It needs Hex: Purge, which is already maxed. The hex cuts what the target deals by a flat 33% and returns 1 life and 1 mana per kill, raised further by Engorge — which this build does not have, so take it for the damage reduction rather than the sustain.",
    "**The other five into Psychic Ward.** The absorb pool is 15 plus 10 per level, and 15 more for each hard point of Levitation Mastery and Cleave — which this build has forty of. Five points is 50 more absorb on top of roughly 600 the two maxed skills already supply.",
    "If you would rather not spend them at all, hold them. Nothing in this plan is improved by a partial investment and the level 99 character has exactly six spare.",
  ],

  stats: {
    strength: "Enough for the weapon and the Grimoire, and Levitation Mastery makes that number smaller than it looks.",
    dexterity: "Enough for the weapon. Nothing here is built on blocking.",
    vitality: "Everything else, at every level.",
    energy: "None. Cleave costs 3 mana flat and the build steals the rest.",
    notes: [
      "**Levitation Mastery reduces item requirements by 2% at one point and 2% more per level, to a −50% floor.** At twenty hard points that is −40%, and a few +skills reach the floor. On a build that wants a heavy two-handed weapon and a Blasphemous Grimoire, half off is a large number of stat points.",
      "It is established that the reduction applies to the weapon. **Whether it reaches armour and the off-hand is not established** — the passive is gated on holding exactly one weapon, which is a condition on when it pays rather than on what it discounts, and nothing reached settles it. Plan the Grimoire's Strength at full price and treat any discount as a refund.",
      "The Grimoire prices, unreduced: a **Burnt Text asks 38**, an **Occult Tome 82**, a **Blasphemous Compendium 95** and a **Blasphemous Grimoire 106**. A melee Warlock is paying Strength anyway, which is why this is the build that can afford the elite bases.",
      "Dexterity to the weapon requirement and no further. A Grimoire blocks, but 12% block chance is not a defensive plan and the points are worth more as life.",
    ],
  },

  breakpoints: [
    { stat: "fhr", value: 56, frames: 7, why: "The Necromancer/Druid/Warlock table. A melee character that is being knocked about is not swinging.", priority: "required" },
    { stat: "fhr", value: 86, frames: 6, why: "Worth taking if the slot is cheap, which on a build with no cast-rate requirement it usually is.", priority: "recommended" },
    { stat: "fcr", value: 75, frames: 10, why: "For Blade Warp only. The build casts nothing else, so this is a mobility target rather than a damage one.", priority: "luxury" },
  ],
  breakpointNotes:
    "**There is no attack-speed row here and that is not an omission on this page.** This site publishes no Increased Attack Speed table for any class, because weapon speed depends on the base weapon's speed and the attack animation rather than on the character alone, and no Warlock animation data has been established at a source tier this project accepts. Cleave's own bonus — from 10% toward 30% — and Hex: Purge's 10% plus 1% per level are real and are in the skill notes; what is not published is the frame count they buy. Judge the weapon by feel and prefer more attack speed to less, which is the honest version of the advice.",

  gearSets: [
    {
      tier: "starter",
      goal: "Cleave at level 6, and a weapon big enough that its full damage is worth carrying.",
      levelRange: [1, 30],
      slots: [
        { slot: "weapon", picks: [{ label: "The largest two-handed weapon you can wear", why: "Cleave carries the weapon's **full** damage, so the base matters more than on any caster. A two-hander costs you nothing here — the Warlock levitates it and the off-hand stays free, which is true of no other class in the game.", lookFor: ["High two-handed damage", "+to Warlock Skills", "Increased Attack Speed"] }] },
        { slot: "offhand", picks: [{ label: "Any Grimoire with +to Warlock skills", why: "Normal-tier Grimoires ask 12 to 25 Strength. Free, and the slot exists only because of the class passive.", lookFor: ["+2 to Warlock Skills", "+to Cleave"] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Hit recovery and run speed for two Countess runes." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills, which on a build with five maxed skills is worth five levels of nothing in particular and one of everything." }] },
        { slot: "gloves", picks: [{ label: "Any gloves with Increased Attack Speed", why: "The one stat this build wants that nothing else in the tier supplies." }] },
      ],
      nextUpgrade: "A Steel or an Edge in something with sockets, and then a real weapon.",
    },
    {
      tier: "nightmare",
      goal: "Mirrored Blades is still ten levels away, so this tier is about the weapon and staying alive to reach it.",
      levelRange: [30, 50],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "passion" }, why: "Dol Ort Eth Lem: 160-210% enhanced damage and 25% Increased Attack Speed in anything with four sockets. Cheap, and it holds until an elite base is worth socketing.", sockets: "Dol Ort Eth Lem in a four-socket two-hander." }, { ref: { kind: "runeword", slug: "kingslayer" }, why: "If a Mal and a Um are available: more damage, Crushing Blow and Open Wounds — though see the Mirrored Blades note about Crushing Blow." }] },
        { slot: "offhand", picks: [{ label: "Any Grimoire with +2 Warlock skills", why: "There is no +Eldritch tab on any item in the game, so generic +Warlock skills is the best this slot can do until an elite unique.", lookFor: ["+2 to Warlock Skills", "+3 to Cleave"], alternatives: [{ ref: { kind: "runeword", slug: "rhyme" }, why: "Two runes and all resistances. It fits because a Grimoire is a shield by type and because two is the only rune count its sockets allow." }] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "lionheart" }, why: "Hel Lum Fal: +25 to all attributes and 15-20% enhanced damage, and the Hel reduces requirements on top of Levitation Mastery." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Life and mana steal before Eldritch Blast supplies them, and 15-20% damage reduction that this build will keep wanting." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Life steal and 10-15% damage reduction." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Open Wounds and Deadly Strike, all of which land on the first swing of a Mirrored Blades volley at full value." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be frozen, and the Dexterity pays part of the weapon requirement." }] },
      ],
      nextUpgrade: "Mirrored Blades at level 30, and then an elite weapon base worth its runes.",
    },
    {
      tier: "early-hell",
      goal: "All five core skills unlocked, the hexes landing, and enough leech to stand in melee range in Hell.",
      levelRange: [50, 70],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "passion" }, why: "Held. Every rune spent here is a rune not spent on the weapon that replaces it." }, { ref: { kind: "runeword", slug: "ritual" }, why: "Amn Shael Ohm in a three-socket dagger: 250-320% enhanced damage, 200-260% attack rating, 40% Increased Attack Speed and 150-250% damage to demons, plus a chance to cast Sigil: Death when struck. An expansion runeword, and the damage-to-demons line is worth more in Act 4 and 5 than the number suggests." }] },
        { slot: "offhand", picks: [{ label: "Measured Wrath", why: "A Burnt Text at level 52. +1 to Warlock skills, +20-30 all resistance and 25% Faster Cast Rate for Blade Warp, at 38 Strength. The fire skills on it are dead weight and it is still the best Grimoire this build can wear at this level." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "duress" }, why: "Shael Um Thul: 15% Crushing Blow, 33% Open Wounds and 150-200% enhanced defence, and the cold damage is a slow that a melee build feels." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Unchanged, and the damage reduction is doing more now than the leech is." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life steal, a chance to cast Life Tap on striking, and Open Wounds. Life Tap on a build that swings this often is most of a survivability plan." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Unchanged." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Unchanged." }] },
        { slot: "amulet", picks: [{ label: "Any amulet with +2 Warlock skills and life", why: "Two levels across five maxed skills. There is no Eldritch-specific amulet in the game." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ label: "Any rare ring with life, resistance and attack rating", why: "Attack rating is the stat this build is short of before Levitation Mastery is maxed." }] },
      ],
      nextUpgrade: "Dreadfang, which is the only weapon in the game with +Mirrored Blades on it.",
    },
    {
      tier: "budget",
      goal: "The weapon the build is built around, and enough damage reduction to hold melee range in an area level 85 zone.",
      levelRange: [70, 85],
      slots: [
        { slot: "weapon", picks: [{ label: "Dreadfang", why: "A Legend Sword at level 61: **+3 to Mirrored Blades**, 133-166% enhanced damage, 33% Increased Attack Speed, 33% Deadly Strike, 33% chance to cast Amplify Damage on striking, and −33% requirements. It is the only weapon in the game that raises an Eldritch skill, and the Amplify Damage answers the eight areas that record physical immunity.", lookFor: ["+3 to Mirrored Blades", "166% Enhanced Damage", "33% Deadly Strike"] }, { ref: { kind: "runeword", slug: "ritual" }, why: "More raw damage and 40% attack speed against three levels of Mirrored Blades and a free Amplify Damage. The Amplify usually wins." }] },
        { slot: "offhand", picks: [{ label: "Ars Dul'Mephistos", why: "An Occult Tome at level 78: **+2 to Warlock skills, 70-115% enhanced damage and 50-70% attack rating**, plus 20-30% Faster Cast Rate. The only Grimoire in the game that raises weapon damage, and it asks 82 Strength rather than 106.", lookFor: ["+2 Warlock Skills", "115% Enhanced Damage", "70% Attack Rating"] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "El Sol Dol Lo: 300% enhanced damage and +15 to all resistances. The single largest damage item available to a melee character." }, { ref: { kind: "runeword", slug: "duress" }, why: "If a Lo is out of reach — the Crushing Blow is worth keeping." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Held for the damage reduction until Crown of Ages." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Unchanged. Life Tap is the reason." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Unchanged." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Unchanged." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 to All Skills, 20% Increased Attack Speed and Deadly Strike that scales with level." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to All Skills and the mana pool for Blade Warp." }] },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders on 3 life per Vitality point is worth more here than on any caster." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The other half of the swap." },
      ],
      nextUpgrade: "Crown of Ages, and the 106 Strength for a Blasphemous Grimoire.",
    },
    {
      tier: "optimized",
      goal: "The full 600% synergy multiplier behind a real weapon, and enough damage reduction to ignore what hits back.",
      levelRange: [85, 99],
      slots: [
        { slot: "weapon", picks: [{ label: "Dreadfang", why: "Unchanged. Nothing replaces +3 Mirrored Blades and a free Amplify Damage.", lookFor: ["+3 to Mirrored Blades", "166% Enhanced Damage"] }, { ref: { kind: "runeword", slug: "grief" }, why: "The flat damage on Grief is added after enhanced damage rather than multiplied by it, which on a build with three 10%-per-level synergies behind the weapon is a smaller share than usual. Worth testing against Dreadfang rather than assumed to beat it." }] },
        { slot: "offhand", picks: [{ label: "Ars Al'Diablolos", why: "A Blasphemous Grimoire at 106 Strength. Its Chaos tab and its +Apocalypse are dead on this build, and its 170-200% enhanced defence and 25% Faster Cast Rate are not. **Take Ars Dul'Mephistos instead unless you are already paying the Strength** — the weapon damage on the Occult Tome is worth more here than anything on the Grimoire.", alternatives: [{ label: "Ars Dul'Mephistos", why: "The correct answer for this build, and it is not close. +2 Warlock skills, 115% enhanced damage and 70% attack rating." }] }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "crown-of-ages" }, why: "Damage reduction, all resistances and two sockets on the sturdiest helm in the game." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "Unchanged. 300% enhanced damage." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Unchanged." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Unchanged." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Unchanged." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Unchanged." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
      ],
      charms: [{ label: "Grand charms with +1 to Eldritch Skills", why: "The charm exists even though no unique does — the Eldritch tab is index 22. Nine of them is nine levels across all five maxed skills, and it is the only Eldritch-specific item in the game." }],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Unchanged." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Unchanged." },
      ],
      nextUpgrade: "Better rolls on the same items. The plan does not change again.",
    },
    {
      tier: "bis",
      goal: "Nothing left to argue about.",
      levelRange: [90, 99],
      slots: [
        { slot: "weapon", picks: [{ label: "Dreadfang", why: "At +3 Mirrored Blades and 166% enhanced damage." }] },
        { slot: "offhand", picks: [{ label: "Ars Dul'Mephistos", why: "At 115% enhanced damage and 70% attack rating. The Blasphemous Grimoire is the better item on paper and the worse item here." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "crown-of-ages" }, why: "Two sockets, and both of them jewels of enhanced damage and attack speed." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "Unchanged." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Unchanged." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Unchanged." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Unchanged." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Unchanged." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Unchanged." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "Unchanged." }] },
      ],
      charms: [{ label: "Nine grand charms with +1 to Eldritch Skills and life", why: "Unchanged, and still the only Eldritch-specific items in the game." }],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Unchanged." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Unchanged." },
      ],
      notes:
        "The finished character wears a two-handed weapon and an off-hand at the same time, which is the one thing about this class that no amount of gear on any other character can imitate. Every generic melee guide you will read assumes you gave up a shield for that weapon. You did not.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Act 2, Nightmare, Might. This build's damage is mostly the weapon's, and Might multiplies exactly that. Insight is not needed here — Cleave costs 3 mana flat and Eldritch Blast steals 5% plus 1% per level of both life and mana — so the mercenary's polearm is free for Pride or Infinity instead. Pride's Concentration is the larger damage aura; Infinity is only worth it if the party has an elemental character in it.",

  farming: [
    { area: "mausoleum", difficulty: "hell", why: "Area level 85 with poison and cold immunity recorded and neither physical nor magic among them. Undead, dense enough for a 240-degree arc, and two screens from a waypoint.", minTier: "early-hell", rating: 5 },
    { area: "ancient-tunnels", difficulty: "hell", why: "Area level 85 with fire and poison immunity recorded — neither of which this build deals. One of the few zones where a physical character has nothing to work around.", minTier: "early-hell", rating: 5 },
    { area: "travincal", difficulty: "hell", why: "Fire and lightning immunity recorded, the Council standing in a heap, and Mirrored Blades putting five full weapon hits into one of them at a time.", minTier: "budget", rating: 5 },
    { area: "mephisto", difficulty: "hell", why: "Fire and lightning immunity recorded and neither touches this build. A single boss, which is what Mirrored Blades is for.", minTier: "early-hell", rating: 4 },
    { area: "pit", difficulty: "hell", why: "Area level 85 and the best drops in Act 1, but physical immunity is recorded here — this is where Hex: Bane's magic damage and Dreadfang's Amplify Damage stop being a footnote.", minTier: "budget", rating: 4 },
    { area: "chaos-sanctuary", difficulty: "hell", why: "The densest zone in the game and the shape a 240-degree arc wants. Physical immunity is recorded, so bring the Amplify Damage weapon rather than the raw-damage one.", minTier: "budget", rating: 4 },
  ],

  immunityPlan:
    "**This build deals two damage types on the same swing and that is the plan.** Cleave carries the weapon's full physical damage, and one hard point in Hex: Bane writes that skill's own rolled magic range onto your character as flat magic weapon damage — so it lands on every hit, including Cleave's arc and each of Mirrored Blades' duplicates.\n\nThe numbers behind that: **physical immunity is recorded in eight of the eighteen catalogued areas and magic immunity in one.** A monster that stops the physical half almost never stops the magic half, and the reverse is even rarer.\n\n**Against the eight, the answer is Amplify Damage.** Dreadfang casts it on 33% of hits, which on a build swinging a 240-degree arc means it is up almost continuously. The curse lowers physical resistance by 100 points, and against a monster that is still physically immune it lands at one fifth strength — 20 points — which is exactly enough to break one sitting at 100% and not enough above 120%. That is the honest boundary and it is where a Bone Break sunder charm takes over if you own one.\n\n**Against the one, nothing.** No magic sunder charm exists and no curse lowers magic resistance. The Arcane Sanctuary is the area, and the physical half of your damage is the answer there — which is the mirror image of everywhere else, and the reason carrying both is worth a hard point.",

  hardcoreNotes:
    "The hardest of the four to take into Hardcore, because the range is zero and the class has no shapeshift to hide behind. What makes it survivable is stacked and worth listing in order: Dracul's Grasp casting Life Tap, Eldritch Blast stealing 5% plus 1% per level of life on a nova that runs itself, Psychic Ward absorbing 15 plus 10 per level plus 15 for each of the forty hard points in Levitation Mastery and Cleave, and Vampire Gaze or Crown of Ages for flat damage reduction. Take the five flex points into Psychic Ward rather than Hex: Siphon and re-cast it before every pack.",

  selfFoundNotes:
    "The most gear-dependent of the four and the one to avoid self-found first. Cleave carries the weapon's damage, so a bad weapon is a bad build in a way that does not apply to a caster — and the two weapons this page is built around are a level 61 unique and a runeword needing an Ohm. Passion is four common runes and holds up surprisingly long. The off-hand is easier: any Grimoire with +2 Warlock skills is a gamble target, and Measured Wrath at level 52 is a realistic drop.",

  levelingPath: {
    summary:
      "Cleave arrives at level 6 and is the whole character until 30. It costs 3 mana at every level and swings without mana, which makes it the most forgiving low-level skill in the class. Mirrored Blades at 30 changes the build from an arc into an arc plus a boss button, and nothing before it is wasted — every point on the way up is one of the five the finished plan maxes.",
  },

  release: "reign-of-the-warlock",
  confidence: "single",
  complete: true,
};
