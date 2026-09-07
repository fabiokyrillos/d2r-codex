import type { Build } from "@/lib/types";

/**
 * The War Cry Barbarian — the Singer.
 *
 * THE COLUMN THIS PAGE RESTS ON
 * -----------------------------
 * War Cry carries **no `SrcDam` at all**. Every other Barbarian attack has one:
 * Bash, Stun, Concentrate, Berserk, Leap Attack and Whirlwind all carry 128, the
 * full weapon share. War Cry carries none, so the `MinDam`/`MaxDam` range the
 * graph publishes — 30-40 at one point, 198-208 at twenty — is the **whole** of
 * its damage.
 *
 * Everything unusual about this build follows from that one absence:
 *
 *   no weapon mastery      Twenty points that every other Barbarian page spends,
 *                          this one does not. A mastery raises weapon damage and
 *                          this build has none.
 *   no weapon damage       The weapon slot is chosen for +skills and cast rate,
 *                          which is why a Singer's gear list reads like a
 *                          Sorceress's rather than a Barbarian's.
 *   Faster Cast Rate       War Cry is cast, not swung. This is the only Barbarian
 *                          build on this site whose primary breakpoint is FCR.
 *   the mercenary's aura   Might multiplies weapon damage. This build has none,
 *                          so the aura is chosen for what it does to the enemy
 *                          rather than for what it does to you.
 *
 * THE POINT PLAN, AND WHY IT IS THE TIGHTEST ON THE CLASS
 * ------------------------------------------------------
 * War Cry takes three synergies — Howl, Taunt and Battle Cry, at 6% per hard
 * point each — which is more than any other Barbarian skill. Three maxed
 * synergies plus the skill itself is eighty points before anything else, and
 * with Battle Orders that is close to the whole budget.
 *
 * WHAT IT CANNOT DO
 * -----------------
 * Its damage is physical and there is no room in the plan for a second damage
 * type unless you buy one. Berserk's chain costs four points — Bash, Stun,
 * Concentrate, Berserk — and the package below is where they come from.
 */
export const warCryBarbarian: Build = {
  slug: "war-cry-barbarian",
  name: "War Cry Barbarian",
  classSlug: "barbarian",
  summary:
    "The Barbarian who kills with a shout. No weapon damage, no mastery, and the only one on the class whose breakpoint is cast rate.",
  damageTypes: ["physical"],
  primarySkill: "war-cry",
  playstyle:
    "You stand in the middle and shout, and everything in a radius of seven is damaged and stunned at the same time. The stun is the point as much as the damage: a screen of monsters that is permanently stunned is a screen that never attacks, which is why the Singer is one of the safest characters in the game despite standing where a caster never would. The rhythm is one War Cry to open, then War Cry again before the stun expires, and again, and again — this is a build with one button and a very high press rate. Battle Cry goes down first on anything tough, because halving defence is free damage. Grim Ward goes on the first corpse in a long fight.",
  strengths: [
    "**Damages and stuns everything in a radius at once**, and the stun refreshes faster than it expires",
    "No weapon damage means no weapon requirement — every gear slot can chase skills, cast rate and magic find",
    "Three damage synergies at 6% a hard point each, more than any other Barbarian skill has",
    "Battle Orders and Battle Command make it the best party support in the game while it does this",
    "Nothing about it depends on attack rating, which is the stat every other Barbarian fights",
  ],
  weaknesses: [
    "**Physical damage only**, and unlike every other build on this class there is no room in the plan for a second type",
    "Cannot kill an act boss efficiently — one target in a radius skill is most of the radius wasted",
    "Very high press rate. This is the most APM-hungry Barbarian by a distance",
    "Its damage ceiling is the skill's own table, so gear cannot raise it the way a weapon raises everything else",
    "Best-in-slot is a caster's list and competes with every caster on the ladder for the same items",
  ],
  difficulty: "moderate",
  budget: "high",
  ratings: {
    clearSpeed: 4,
    bossing: 1,
    survivability: 5,
    magicFind: 5,
    terrorZones: 4,
    ubers: 1,
    soloSelfFound: 3,
    players8: 4,
  },
  skills: [
    {
      skill: "war-cry",
      points: 20,
      role: "main",
      order: 1,
      note: "**It carries no weapon damage at all.** The published range is the whole of it — 30-40 at one point, 198-208 at twenty — which is why this build takes no mastery and why its weapon is chosen for skills rather than damage. It stuns for 25 frames at one point and 5 more per level, inside radius 7. **It costs 10 mana, not the 40 the raw column shows**, climbing to about 24 at twenty.",
    },
    {
      skill: "howl",
      points: 20,
      role: "synergy",
      order: 2,
      note: "+6% War Cry damage per hard point. A level-1 skill carrying a fifth of this build's damage.",
    },
    {
      skill: "taunt",
      points: 20,
      role: "synergy",
      order: 3,
      note: "+6% War Cry damage per hard point, and a genuine button: it cuts the target's attack rating and damage by 5% and 2% more per level, and drags it to you — which on a build that wants everything inside radius 7 is exactly the right effect.",
    },
    {
      skill: "battle-cry",
      points: 20,
      role: "synergy",
      order: 4,
      note: "+6% War Cry damage per hard point, **and** −50% enemy defence and 2% more per level. The only skill on the class that is a damage synergy and a debuff at once, and this build presses it as well as maxing it.",
    },
    {
      skill: "battle-orders",
      points: 16,
      role: "utility",
      order: 5,
      note: "War Cry's prerequisite, and +35% maximum life plus 3% per level for you and the party. Sixteen rather than twenty because the last four points are a choice — see the package below. It is not a War Cry synergy; the three that are, are already maxed above.",
    },
    { skill: "shout", points: 1, role: "utility", note: "Battle Orders' prerequisite, party defence, and 5 seconds per hard point onto Battle Orders' duration." },
    { skill: "battle-command", points: 1, role: "utility", note: "+1 to all skills, flat at every level — and on this build that +1 raises War Cry and all three of its synergies at once. Cast it first: Battle Command, Battle Orders, Shout, then heal." },
    { skill: "find-potion", points: 1, role: "utility", note: "Find Item's prerequisite, and 5% per hard point onto Grim Ward's enemy-damage-taken debuff. One point is what this plan can afford." },
    { skill: "find-item", points: 1, role: "utility", note: "A second drop roll off a corpse, and Grim Ward's prerequisite. On the build with the most magic find on the class, one point here is free value." },
    { skill: "grim-ward", points: 1, role: "utility", note: "Terrifies, slows up to 75%, and raises the damage everything inside takes. On a build that wants monsters gathered and stunned, the slow is worth as much as the debuff." },
    { skill: "leap", points: 1, role: "utility", note: "The only mobility this build has before Enigma, and it goes over walls. Also the escape when a stun-lock finally breaks." },
    { skill: "increased-stamina", points: 1, role: "prerequisite", note: "Increased Speed's prerequisite." },
    { skill: "increased-speed", points: 1, role: "utility", note: "Always-on run speed. A Singer walks into the middle of things, so getting there matters." },
    { skill: "iron-skin", points: 1, role: "prerequisite", note: "Natural Resistance's prerequisite." },
    { skill: "natural-resistance", points: 1, role: "utility", note: "All four resistances, added before the cap. This build stands in the open surrounded by things, so it is worth more here than almost anywhere." },
  ],
  skillPackages: [
    {
      id: "the-last-four",
      name: "The last four points",
      choose: "one",
      intro:
        "Three maxed synergies and the skill itself is eighty points, and Battle Orders takes it to ninety-six. The core leaves exactly four, and they go one of two places: more life, or the only route this build has to a damage type that is not physical.",
      packages: [
        {
          id: "louder",
          name: "Battle Orders to twenty",
          when: "You play in a party, or you have a Bone Break and do not need a second damage type.",
          tradeoff: "You have no answer at all to a physical immune except gear. On this build that is a real gap, because there is nothing else in the plan to fall back on.",
          skills: [
            { skill: "battle-orders", points: 20, role: "utility", note: "+92% maximum life at twenty rather than +80% at sixteen, on you, the mercenary and everyone in the party — and 20 seconds more duration for each of Shout and Battle Command's hard points to extend." },
          ],
          contentNote: "Party play, Terror Zones, and any content where a Sunder Charm covers the immunity for you.",
          remainderNote: "Nothing is left over. 106 + 4 = 110.",
        },
        {
          id: "magic-answer",
          name: "Four points to Berserk",
          when: "You solo without a Bone Break, and you would rather have a slow answer to a physical immune than no answer.",
          tradeoff: "Battle Orders stays at sixteen, which is twelve percentage points of life on you and on everyone standing near you.",
          skills: [
            { skill: "bash", points: 1, role: "prerequisite", note: "The first rung. Never pressed." },
            { skill: "stun", points: 1, role: "prerequisite", note: "The second rung." },
            { skill: "concentrate", points: 1, role: "prerequisite", note: "The third, and worth having anyway: it doubles your defence while it swings and cannot be interrupted." },
            { skill: "berserk", points: 1, role: "main", note: "**One point, and it is entirely magic damage.** It will not kill anything quickly at level 1 with no synergies behind it — but it kills a physical immune, and the alternative is walking away. This is the cheapest immunity answer on the class and it costs this build four points it would rather spend elsewhere." },
          ],
          rotationNote:
            "War Cry for everything. When a pack turns out to be physical immune, Battle Cry it, then swing Berserk at it one target at a time. It is slow and it works.",
          contentNote: "Solo Hell, the Pit, Chaos Sanctuary — anywhere you cannot choose what you meet and have no charm for it.",
          remainderNote: "Nothing is left over. 106 + 4 = 110.",
        },
      ],
    },
  ],
  flexPoints: [
    "**There are none.** The core is 106 and either package is exactly 4, so a level-99 sheet reads 110 spent with nothing unassigned.",
    "Below 99 the order is War Cry, then Battle Cry — because it is a synergy and a debuff at once — then Battle Orders to sixteen, then Taunt and Howl. The single points can wait.",
    "This is the tightest plan of the six. Three synergies and Battle Orders leave less room than any other Barbarian build has, which is why the choice at the end is four points rather than sixteen or thirty-three.",
  ],
  stats: {
    strength: "Enough for the body armour you intend to wear, and nothing for a weapon — a Heart of the Oak in a mace needs almost none, which is part of why that weapon is chosen.",
    dexterity: "Enough for maximum block if you hold a shield, and you should: this build stands in the middle of what it is killing.",
    vitality: "Everything else. Four life per point, and Battle Orders on top of it.",
    energy: "None, and it is worth saying because this build casts. War Cry costs 10 mana rather than 40 — the raw column is shifted — and Insight on the mercenary covers the press rate.",
    notes: [
      "**This is the only Barbarian stat plan with no weapon requirement in it.** A Singer's weapon is chosen for +skills and cast rate, and the usual candidates need little Strength.",
      "Block is worth more here than on any other page on this class, because the build's whole method is to stand still inside the pack it is stunning.",
      "Faster Cast Rate is bought with gear, not with attributes — but it is the stat to plan the gear around, which no other Barbarian page can say.",
    ],
  },
  breakpoints: [
    { stat: "fcr", value: 105, frames: 8, why: "**The breakpoint that defines this build.** War Cry is cast rather than swung, so it uses the Barbarian cast-rate table, and the whole method depends on shouting again before the stun expires. 105% is eight frames and it is the practical target.", priority: "required" },
    { stat: "fcr", value: 63, frames: 9, why: "Nine frames, and reachable long before 105 — a Spirit in a sword or shield alone is most of the way there. Aim here first.", priority: "recommended" },
    { stat: "fcr", value: 200, frames: 7, why: "Seven frames, and it costs almost every slot to reach. Worth it only if the rest of the character is already finished.", priority: "luxury" },
    { stat: "fhr", value: 48, frames: 5, why: "Five frames on the table shared with the Paladin and the Assassin. A Singer stands in the open surrounded, and a hit-recovery lock is how the method fails.", priority: "recommended" },
    { stat: "fbr", value: 42, frames: 4, why: "With a shield, which this build should hold. Blocking is the mitigation that costs it nothing, because it has no second weapon to give up.", priority: "recommended" },
  ],
  breakpointNotes:
    "**No attack-speed row, and here it is not a refusal but an absence.** Every other Barbarian page omits an Increased Attack Speed table because frames depend on the weapon and the skill. This one omits it because the build does not attack: War Cry is cast, its damage is its own published range rather than the weapon's, and Increased Attack Speed does nothing for it whatsoever. Faster Cast Rate is the stat in its place, and it is the only Barbarian build on this site for which that is true.",
  gearSets: [
    {
      tier: "starter",
      goal: "War Cry on the bar at level 30, and the first cast rate. Before 30 you are levelling as something else entirely.",
      levelRange: [1, 40],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "**+2 to all skills and +25-35% Faster Cast Rate at level 25**, in a Crystal Sword that costs nothing. This is the single best item a Singer can hold for most of the game and it is available before the skill is.", sockets: "Tal + Thul + Ort + Amn in a 4-socket sword." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "rhyme" }, why: "Cannot Be Frozen, +25 all resistances and 25% magic find at level 29 — and being frozen is what stops the shout rhythm.", sockets: "Shael + Eth in any 2-socket shield." }, { ref: { kind: "runeword", slug: "ancients-pledge" }, why: "+43-48% to every resistance instead, if the resistances are the problem." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to all skills, which on this build is +1 to War Cry and all three synergies.", sockets: "Ort + Sol." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "+25% Faster Cast Rate at level 17. On a Sorceress this is a stopgap; here it is the first real cast-rate item you will own." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "goldwrap" }, why: "Gold and magic find at level 27, and this build will out-farm every other Barbarian." }] },
        { slot: "boots", picks: [{ label: "Any rare or magic boots with Faster Run/Walk and resistances", why: "You walk into the middle of things. Get there faster." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "**+20% Faster Cast Rate at level 23.** Its fire-skill bonus is dead on a Barbarian and the cast rate is not — this is a caster glove on a Barbarian page, which is the shape of this whole gear list." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Magic find, and there is nothing better this early." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with Faster Cast Rate and resistances", why: "10% cast rate on a ring is worth more here than any damage line." }] },
        { slot: "amulet", picks: [{ label: "A rare or magic amulet with +2 Barbarian skills", why: "+2 skills is +2 War Cry and +2 to each synergy." }] },
      ],
      charms: [{ label: "Small charms with life and resistances", why: "Nothing more exotic exists yet." }],
      nextUpgrade: "The 63% cast-rate breakpoint, and Battle Orders to sixteen.",
    },
    {
      tier: "nightmare",
      goal: "Nine frames of cast rate, resistances for Hell, and the three synergies underway.",
      levelRange: [40, 65],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Still +2 skills and up to 35% cast rate, and still cheap. Nothing displaces it until Heart of the Oak." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "splendor" }, why: "**+1 to all skills and +10-20% Faster Cast Rate on a shield**, at level 37, for two runes. Skills and cast rate from the shield slot is exactly what this build wants.", sockets: "Eth + Lum in a 2-socket shield." }, { ref: { kind: "runeword", slug: "rhyme" }, why: "The magic find and Cannot Be Frozen instead." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+2 Barbarian skills, 30% faster hit recovery and +30 all resistances. **Note that its +2 Combat Skills does nothing here** — War Cry is a Warcry, so half of Arreat's skill bonus is to the wrong tree. It is still good; it is just worth less on this page than on any other Barbarian one." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "lionheart" }, why: "+30 all resistances, +50 life and +25 Strength for three runes. Resistances are what let you stand still." }, { ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "**+1 all skills, +30% Faster Cast Rate and +20-35 all resistances** at level 29 — a Sorceress armour that is close to ideal here." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal — though the life steal does nothing for a shout, so this is the damage reduction line." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find at level 42, on the build that will farm more than any other Barbarian." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+20% cast rate, still." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and the mana pool a high press rate wants." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with 10% Faster Cast Rate, life and resistances", why: "The cheapest ten percent of cast rate you will find." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "atmas-scarab" }, why: "Its Amplify Damage on striking is −100% physical resistance — and **War Cry's damage is physical**, so unlike on the Berserk page this works. It triggers on the shout." }] },
      ],
      charms: [{ label: "Warcries grand charms, and life/resistance small charms", why: "**A Warcries skiller, not a Combat Skills one** — this is the only Barbarian build on the site for which that is true." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders and Battle Command above your own level. Shout, swap back to the Spirit, fight." }],
      nextUpgrade: "Heart of the Oak, and the 105% cast-rate breakpoint.",
    },
    {
      tier: "early-hell",
      goal: "Eight frames of cast rate and enough resistance to stand where the build wants to stand.",
      levelRange: [65, 75],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "heart-of-the-oak" }, why: "**The Singer's weapon.** +3 to all skills, +40% Faster Cast Rate and +30-40 to all resistances at level 55. Its bases are staves and maces, and a mace is a weapon this class can hold — which is the one place where being a Barbarian helps rather than hinders on this list.", sockets: "Ko + Vex + Pul + Thul in a 4-socket mace." }, { ref: { kind: "runeword", slug: "spirit" }, why: "The budget answer, and it is not far behind: +2 skills and 35% cast rate." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "A Spirit **shield** as well as a Spirit sword — +2 skills and up to 35% more cast rate. A Monarch needs 156 Strength, which is the cost." }, { ref: { kind: "runeword", slug: "splendor" }, why: "+1 skill and 20% cast rate for two runes and almost no Strength." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "**+2 to all skills, damage reduction and magic find** at level 62. On this build it beats Arreat's Face outright, because all of its skill bonus lands and half of Arreat's does not." }, { ref: { kind: "unique", slug: "arreats-face" }, why: "The resistances and hit recovery instead, if you are short of both." }] },
        { slot: "body", picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 skill, +30% cast rate and resistances, still one of the best bodies for this build at any price." }, { ref: { kind: "runeword", slug: "smoke" }, why: "+50 to all resistances instead, when resistances are what is failing." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "Damage reduction, Vitality and 10% faster hit recovery." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find, and this build has slots to spare for it." }, { ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster hit recovery and Strength instead, if a Spirit Monarch is the goal." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+20% cast rate, and nothing else in the slot competes." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, which keeps the rhythm — take it if the shield is not Rhyme." }, { label: "A rare ring with 10% Faster Cast Rate", why: "If freeze is already covered, the cast rate is worth more." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and +20-30 all resistances at level 67. On a build with four skills to raise, +2 is enormous." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Magic find and gold, on the Barbarian with the most spare slots for both." }, { label: "Warcries skillers, life and resistance small charms", why: "Each Warcries skiller is +1 War Cry and +1 to all three synergies." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "The shouts, above your own level." }],
      nextUpgrade: "Enigma, and the last of the cast rate.",
    },
    {
      tier: "budget",
      goal: "105% cast rate, Teleport, and resistances at the cap. The build is finished here and everything after is refinement.",
      levelRange: [75, 85],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "heart-of-the-oak" }, why: "+3 skills, 40% cast rate, +30-40 resistances. Nothing replaces it." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "The Monarch version: +2 skills and up to 35% cast rate, and it is where the 105% breakpoint usually comes from." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 all skills, magic find, and damage reduction — all three of which this build wants." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "**Teleport**, +1 to all skills and the Strength for a Spirit Monarch in one item. On a build that has to be in the middle of the pack, arriving there instantly is worth as much as the damage.", sockets: "Jah + Ith + Ber." }, { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 all skills and +65 to all resistances instead, if you would rather have the skills than the Teleport." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "**+1 to all skills and +20% Faster Cast Rate** at level 80 — the only belt in the game that gives either, and this build wants both." }, { ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "Damage reduction and Vitality instead, when survivability is the problem." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+20% cast rate." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "A second, for another +1 to everything." }, { ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, if nothing else provides it." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and the resistances that let you stand still." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Magic find and gold." }, { ref: { kind: "unique", slug: "bone-break" }, why: "**The physical Sunder Charm, and on this page it is close to required** — War Cry is physical only, and this is the alternative to spending the package on Berserk." }, { label: "Warcries skillers, Annihilus, Hellfire Torch", why: "The Torch is +3 Barbarian skills, which raises War Cry and all three synergies at once." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "A higher Battle Orders than your own sixteen or twenty points buy." }],
      nextUpgrade: "The seven-frame breakpoint, if you want it.",
    },
    {
      tier: "optimized",
      goal: "Everything the build wants, with magic find in the slots that are left over.",
      levelRange: [85, 95],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "heart-of-the-oak" }, why: "In a mace, which a Barbarian can hold and a Sorceress cannot." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "The Monarch, for +2 skills and the cast rate." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, magic find, damage reduction." }, { ref: { kind: "unique", slug: "crown-of-ages" }, why: "30% damage reduction, +1 skills and two sockets, at level 82 — the durable choice over the magic-find one." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and 20% cast rate." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }, { ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Hit recovery and Strength instead." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "The cast rate." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "The second." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 resistances." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Magic find and gold." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The physical Sunder, which frees the package for Battle Orders." }, { label: "Warcries skillers, Annihilus, Hellfire Torch", why: "Four skills raised per point of +skills — more than any other Barbarian build gets." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "The shouts." }],
      nextUpgrade: "Perfect rolls, and the decision about whether seven frames is worth the slots.",
    },
    {
      tier: "bis",
      goal: "Nothing left to buy. Eight frames or seven, +6 to every skill on the bar, and a screen that never gets to attack.",
      levelRange: [90, 99],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "heart-of-the-oak" }, why: "+3 skills and 40% cast rate, in a mace." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "A 35% cast-rate roll in a Monarch." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, 50% magic find, 10% damage reduction, socketed for whatever is missing." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, in the lightest base the Spirit Monarch's Strength requirement leaves room for." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skill and 20% cast rate — there is no alternative that does either." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "50% magic find at the top roll." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% cast rate, and nothing else in the slot gives any." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "The second +1." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 to all resistances." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "40% magic find at the top roll." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The physical Sunder Charm, which is what lets the package go to Battle Orders instead of Berserk." }, { label: "Warcries skillers, a maximum Annihilus, a maximum Hellfire Torch", why: "Every +1 raises War Cry, Howl, Taunt and Battle Cry together — four skills, where every other Barbarian build raises one or two." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "A level 6 Battle Orders is more life than the package's four points ever were." }],
      notes: "There are no set items on this list and no Immortal King. This build wants skills, cast rate and resistances, and the Barbarian sets offer none of the three.",
    },
  ],
  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**This is the only Barbarian on the site whose mercenary aura is not chosen for his own damage.** Might multiplies weapon damage, and War Cry carries no weapon damage at all — its range is its own. So take **Holy Freeze**, the Act 2 Nightmare defensive aura: it slows everything around him, which stacks with the stun and with Grim Ward's slow to produce a pack that is barely moving at all. Insight in a polearm answers the mana cost of a very high press rate, and it is the best weapon he can hold until an Infinity, whose Conviction lowers enemy resistances — including physical, which is the one this build cares about. The Reaper's Toll is the strong alternative: Decrepify on striking is −50% enemy physical resistance and a slow, and both halves land on the damage type War Cry actually deals. Keep him alive with a Fortitude and a Vampire Gaze.",
  farming: [
    { area: "secret-cow-level", difficulty: "hell", why: "Wall-to-wall density with nothing in it immune to physical, which is exactly what a radius-7 shout wants. The best single area for this build in the game.", minTier: "early-hell", rating: 5 },
    { area: "worldstone-keep", difficulty: "hell", why: "Area level 85 and dense enough that every shout lands on a dozen things. The standard endgame loop, and the Singer runs it faster than any other Barbarian.", minTier: "early-hell", rating: 5 },
    { area: "lower-kurast", difficulty: "hell", why: "Chests rather than monsters, and a build with this much magic find and Teleport clears the supers faster than it clears anything else.", minTier: "budget", rating: 4 },
    { area: "chaos-sanctuary", difficulty: "hell", why: "Dense and lucrative, and the stun handles the Oblivion Knights before their curses land. Diablo himself is the problem — one target is this build's worst case.", minTier: "budget", rating: 3 },
    { area: "pit", difficulty: "hell", why: "Area level 85 and dense, but its physical immunes are the wall this build has the least answer to. Bring the Bone Break.", minTier: "early-hell", rating: 3 },
    { area: "travincal", difficulty: "hell", why: "Three targets standing together and a short run. Fine rather than exceptional — three monsters is not the density this build is built for.", minTier: "nightmare", rating: 3 },
  ],
  immunityPlan:
    "**This is the build with the least room to answer immunity, and the page will not pretend otherwise.** War Cry's damage is physical and there is nothing else in the plan: three maxed synergies and Battle Orders leave four points, and buying a second damage type means spending all four on Berserk's prerequisite chain for a level-1 Berserk that kills slowly. The better answer for most players is a **Bone Break** — the physical Sunder Charm turns an immune into something merely resistant for the cost of a charm slot, and it is why the Battle Orders package exists at all. A mercenary carrying Infinity does the same job for a party, and The Reaper's Toll's Decrepify is −50% physical resistance on anything already below the immunity threshold. Atma's Scarab works here where it does not on the Berserk page, because its Amplify Damage reduces *physical* resistance and physical is what this build deals.",
  hardcoreNotes:
    "The safest Barbarian on the site, and for a reason that is easy to miss: a permanently stunned screen never attacks. The stun refreshes faster than it expires at any reasonable cast rate, so the failure mode is not being overwhelmed — it is being *interrupted*, by a freeze, a hit-recovery lock or running out of mana. So reach the 48% hit-recovery breakpoint, treat Cannot Be Frozen as mandatory, hold a shield and block, and keep Insight on the mercenary from the moment you can make it. Take the Battle Orders package rather than Berserk: a level-1 Berserk will not save you from anything, and twelve percentage points of life will. Carry the Bone Break so a physical immune is a slow fight rather than a fight you have to walk out of backwards.",
  selfFoundNotes:
    "Awkward early and excellent late. The build does not exist until level 30 and is not really itself until the synergies are in, so a self-found Singer levels as something else for a long time — the journey's route serves it worst of the six and says so. But its gear is unusually findable: Spirit is four common runes in a Crystal Sword, Splendor is two, Rhyme is two, Stealth is two, and Magefist and Skin of the Vipermagi are ordinary drops. Heart of the Oak needs a Vex and Enigma needs a Jah and a Ber, and neither is required to farm Hell — a Singer on two Spirits and a Vipermagi clears the Cow Level indefinitely, which is how a self-found one funds everything else.",
  levelingPath: {
    summary:
      "**This is the destination the class journey does not serve.** That route commits to a weapon mastery at level 3 and respecs at 40 to get the mastery right — and this build takes no mastery at all, because War Cry carries no weapon damage. A player heading here should follow the journey to level 30, then respec in Nightmare rather than at 40, and put everything into War Cry and its three synergies from there.",
    respecAt: "Nightmare, once War Cry is available at level 30 — not the level-40 respec the class journey plans, which exists to fix a mastery this build never takes.",
  },
  confidence: "verified",
  complete: true,
};
