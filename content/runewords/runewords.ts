import type { Runeword } from "@/lib/types";

/**
 * Runewords relevant to the guides currently on the site.
 *
 * Sources: D2Runewizard runeword database (cross-checked against The Arreat
 * Summit for pre-1.11 runewords), Blizzard's Reign of the Warlock announcement
 * for the expansion runewords. See `docs/research/02-runewords.md`.
 *
 * Stat lines are written as the finished item displays them, which means rune
 * contributions are already folded in. That is what a player sees, and quoting
 * the raw runeword-only lines has confused readers of other sites for years.
 *
 * This is deliberately not the full list of ~100 runewords. Accuracy over
 * breadth: every entry here has been verified.
 */
export const runewords: Runeword[] = [
  // -------------------------------------------------------------------------
  // Leveling
  // -------------------------------------------------------------------------
  {
    slug: "stealth",
    name: "Stealth",
    summary:
      "The first runeword almost every character makes. Cheap, and its 25 FCR / 25 FRW / 25 FHR block carries you through all of Normal.",
    runes: ["tal", "eth"],
    sockets: 2,
    requiredLevel: 17,
    tier: "starter",
    bases: {
      categories: ["body-armor"],
      display: "Any 2-socket Body Armor",
      exclusions: [
        "Body armor only — this does not work in helms or shields.",
        "The base must be a plain (white or grey) item, never magic, rare, set or unique.",
      ],
    },
    stats: [
      { text: "+25% Faster Run/Walk", notable: true },
      { text: "+25% Faster Cast Rate", notable: true },
      { text: "+25% Faster Hit Recovery", notable: true },
      { text: "+6 to Dexterity" },
      { text: "Regenerate Mana 15%" },
      { text: "+15 Maximum Stamina" },
      { text: "Poison Resist +30%" },
      { text: "Magic Damage Reduced by 3" },
    ],
    recommendedBases: [
      "Breast Plate — only 30 Strength, and its low weight keeps you at Fast run speed.",
      "Any light armor you can wear. Do not over-invest Strength for a heavier base.",
    ],
    usedBy:
      "Every class, every build, on every fresh character. The single best value-per-rune item in the game.",
    commonMistakes: [
      "Making it in a 3-socket armor. The base must have exactly 2 sockets.",
      "Socketing Eth before Tal. Rune order is Tal then Eth, left to right.",
    ],
    confidence: "verified",
  },
  {
    slug: "leaf",
    name: "Leaf",
    summary:
      "+3 Fire Skills in a two-rune staff. Turns a level 19 Fire Sorceress into a genuine killer.",
    runes: ["tir", "ral"],
    sockets: 2,
    requiredLevel: 19,
    tier: "starter",
    bases: {
      categories: ["staff"],
      display: "Any 2-socket Staff",
      exclusions: [
        "Staves only — not wands, not orbs, not Sorceress orbs.",
      ],
    },
    stats: [
      { text: "+3 to Fire Skills", notable: true },
      { text: "Adds 5-30 Fire Damage" },
      { text: "+3 to Inferno (Sorceress only)" },
      { text: "+3 to Fire Bolt (Sorceress only)" },
      { text: "+3 to Warmth (Sorceress only)" },
      { text: "+2 Defense per Character Level" },
      { text: "Cold Resist +33%" },
      { text: "+2 to Mana after each Kill" },
    ],
    recommendedBases: [
      "Any cheap staff. Base staves with innate Sorceress skill bonuses stack on top, so a staff that already rolls +Fire Ball or +Warmth is a genuine upgrade.",
    ],
    usedBy:
      "Fire Sorceresses through Normal. Also a cheap early wand-slot filler for any caster who wants the Warmth bonus.",
    commonMistakes: [
      "Buying a staff with sockets already present but the wrong count.",
    ],
    confidence: "verified",
  },
  {
    slug: "ancients-pledge",
    name: "Ancients' Pledge",
    summary:
      "Three common runes for near-max resistances. The cheapest answer to the Nightmare resistance penalty.",
    runes: ["ral", "ort", "tal"],
    sockets: 3,
    requiredLevel: 21,
    tier: "starter",
    bases: {
      categories: ["shield", "paladin-shield"],
      display: "Any 3-socket Shield",
      exclusions: ["Shields only — not body armor, not helms."],
    },
    stats: [
      { text: "+50% Enhanced Defense" },
      { text: "Cold Resist +43%", notable: true },
      { text: "Fire Resist +48%", notable: true },
      { text: "Lightning Resist +48%", notable: true },
      { text: "Poison Resist +48%", notable: true },
      { text: "10% Damage Taken Goes to Mana" },
    ],
    recommendedBases: [
      "Any shield with a Strength requirement you already meet.",
      "For a Paladin, a Paladin-only shield adds its innate resistance bonus on top.",
    ],
    usedBy:
      "Any character entering Nightmare without a resistance plan. Often the difference between dying constantly and progressing.",
    commonMistakes: [
      "All three runes are Countess drops in Normal — do not trade for these.",
    ],
    notes:
      "Resistance values shown are the totals on the finished shield, including the individual rune shield bonuses.",
    confidence: "verified",
  },
  {
    slug: "lore",
    name: "Lore",
    summary: "+1 to All Skills in a helm for two common runes.",
    runes: ["ort", "sol"],
    sockets: 2,
    requiredLevel: 27,
    tier: "starter",
    bases: {
      categories: ["helm", "barbarian-helm", "druid-pelt", "circlet"],
      display: "Any 2-socket Helm",
      exclusions: ["Helms only — not shields, despite both being 'armor'."],
    },
    stats: [
      { text: "+1 to All Skills", notable: true },
      { text: "+10 to Energy" },
      { text: "Lightning Resist +30%" },
      { text: "Damage Reduced by 7" },
      { text: "+2 to Mana after each Kill" },
      { text: "+2 to Light Radius" },
    ],
    recommendedBases: [
      "Any light helm. Class-specific helms (Barbarian helms, Druid pelts) can roll their own +skills on top.",
    ],
    usedBy:
      "Every class from the late 20s until a better helm appears. Holds up surprisingly deep into Nightmare.",
    confidence: "verified",
  },
  {
    slug: "steel",
    name: "Steel",
    summary: "A level 13 weapon runeword. Open Wounds and attack speed for two of the cheapest runes.",
    runes: ["tir", "el"],
    sockets: 2,
    requiredLevel: 13,
    tier: "starter",
    bases: {
      categories: ["sword", "axe", "mace"],
      display: "Any 2-socket Sword, Axe or Mace",
      exclusions: ["Not polearms, not spears, not hammers or scepters."],
    },
    stats: [
      { text: "+25% Increased Attack Speed", notable: true },
      { text: "+20% Enhanced Damage" },
      { text: "+3 to Minimum Damage" },
      { text: "+3 to Maximum Damage" },
      { text: "+50 to Attack Rating" },
      { text: "50% Chance of Open Wounds", notable: true },
      { text: "+2 to Mana after each Kill" },
      { text: "+1 to Light Radius" },
    ],
    usedBy: "Melee characters in early Normal, and early mercenary weapons.",
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Core progression
  // -------------------------------------------------------------------------
  {
    slug: "spirit",
    name: "Spirit",
    summary:
      "The most important budget runeword in the game. +2 skills and up to 35% Faster Cast Rate, from four Normal-difficulty runes.",
    runes: ["tal", "thul", "ort", "amn"],
    sockets: 4,
    requiredLevel: 25,
    tier: "starter",
    bases: {
      categories: ["sword", "shield", "paladin-shield"],
      display: "Any 4-socket Sword, or any 4-socket Shield",
      exclusions: [
        "Swords and shields only. Not axes, not maces, not staves, not orbs.",
        "A Crystal Sword is the standard sword base; a Monarch is the standard shield base.",
      ],
    },
    stats: [
      { text: "+2 to All Skills", notable: true },
      { text: "+25-35% Faster Cast Rate", variable: true, notable: true },
      { text: "+55% Faster Hit Recovery", notable: true },
      { text: "+250 Defense vs. Missile" },
      { text: "+22 to Vitality" },
      { text: "+89-112 to Mana", variable: true },
      { text: "Magic Absorb 3-8%", variable: true },
      { text: "In swords: adds cold, lightning and poison damage, 7% Life Steal" },
      { text: "In shields: +35% Cold, Lightning and Poison Resist, Attacker Takes Damage of 14" },
    ],
    recommendedBases: [
      "Sword: a Crystal Sword. It reaches 4 sockets, has a trivial 43 Strength requirement, and is bought from Charsi or gambled cheaply.",
      "Shield: a Monarch. It is the lowest-Strength shield (156) that can roll 4 sockets — still a real investment for a caster, so most characters run a Spirit sword first and add the shield later.",
      "Broad Sword and Long Sword also reach 4 sockets and are lighter than a Crystal Sword.",
    ],
    usedBy:
      "Practically every caster, and most non-casters as an off-hand. A Spirit sword at level 25 is the single largest power spike available to a fresh character.",
    commonMistakes: [
      "Trying it in a Sorceress Orb. Orbs are not swords — this does not work.",
      "Buying a Crystal Sword that already has 3 or 5 sockets. It must be exactly 4.",
      "Rolling it in an expensive base before you can meet the Strength requirement.",
    ],
    notes:
      "The Faster Cast Rate roll is random between 25 and 35. Because the runes are cheap, players routinely make several Spirits and keep the best roll — 35% is what most FCR breakpoint plans assume.",
    confidence: "verified",
  },
  {
    slug: "insight",
    name: "Insight",
    summary:
      "A Meditation aura on your mercenary. Solves caster mana permanently, and costs four common runes.",
    runes: ["ral", "tir", "tal", "sol"],
    sockets: 4,
    requiredLevel: 27,
    tier: "starter",
    bases: {
      categories: ["polearm", "staff", "bow", "crossbow"],
      display: "Any 4-socket Polearm, Staff or Missile Weapon (bow/crossbow)",
      exclusions: [
        "Not spears. Polearms and spears are different item classes, and this is the single most common Insight mistake.",
        "Not swords, axes or maces.",
      ],
    },
    stats: [
      { text: "Level 12-17 Meditation Aura When Equipped", variable: true, notable: true },
      { text: "+35% Faster Cast Rate" },
      { text: "+200-260% Enhanced Damage", variable: true },
      { text: "+9 to Minimum Damage" },
      { text: "180-250% Bonus to Attack Rating", variable: true },
      { text: "Adds 5-30 Fire Damage" },
      { text: "Adds 75 Poison Damage over 5 seconds" },
      { text: "+1-6 to Critical Strike", variable: true },
      { text: "+5 to all Attributes" },
      { text: "+2 to Mana after each Kill" },
      { text: "23% Better Chance of Getting Magic Items" },
    ],
    recommendedBases: [
      "For an Act 2 mercenary: a Partizan or Bill (normal), a Great Poleaxe or Lochaber Axe (exceptional), or a Giant Thresher / Cryptic Axe (elite) — all polearms.",
      "Ethereal bases give higher damage and the mercenary never breaks them, so an ethereal elite polearm is the endgame version.",
      "A 4-socket staff version exists for a self-cast character, but the aura is the point, so the mercenary version is nearly always correct.",
    ],
    usedBy:
      "Almost every caster's Act 2 mercenary. Meditation removes mana potions from the game for the rest of the character's life.",
    commonMistakes: [
      "Using a spear base (War Pike, Ghost Spear). Insight does not work in spears.",
      "Giving it to an Act 1 or Act 5 mercenary — they cannot use polearms.",
    ],
    confidence: "verified",
  },
  {
    slug: "rhyme",
    name: "Rhyme",
    summary:
      "Two cheap runes for Cannot Be Frozen, all resistances, and magic find on a shield.",
    runes: ["shael", "eth"],
    sockets: 2,
    requiredLevel: 29,
    tier: "starter",
    bases: {
      categories: ["shield", "paladin-shield", "necromancer-head"],
      display: "Any 2-socket Shield",
    },
    stats: [
      { text: "+60% Faster Block Rate" },
      { text: "Regenerate Mana 15%" },
      { text: "All Resistances +25", notable: true },
      { text: "Cannot Be Frozen", notable: true },
      { text: "50% Extra Gold from Monsters" },
      { text: "25% Better Chance of Getting Magic Items" },
    ],
    usedBy:
      "Magic-find characters, and anyone who needs Cannot Be Frozen without spending a Cham rune.",
    notes:
      "Cannot Be Frozen matters more than the resistances for most builds — being chilled slows your cast rate and your movement.",
    confidence: "verified",
  },
  {
    slug: "smoke",
    name: "Smoke",
    summary: "+50 to all resistances in a body armor, for two mid-tier runes.",
    runes: ["nef", "lum"],
    sockets: 2,
    requiredLevel: 37,
    tier: "nightmare",
    bases: {
      categories: ["body-armor"],
      display: "Any 2-socket Body Armor",
    },
    stats: [
      { text: "All Resistances +50", notable: true },
      { text: "+20% Faster Hit Recovery" },
      { text: "+75% Enhanced Defense" },
      { text: "+280 Defense vs. Missile" },
      { text: "+10 to Energy" },
      { text: "-1 to Light Radius" },
      { text: "Level 6 Weaken (18/18 Charges)" },
    ],
    usedBy:
      "Any character struggling with Hell resistances who does not yet have a better armor. The -1 light radius is genuinely annoying but rarely a dealbreaker.",
    confidence: "verified",
  },
  {
    slug: "lionheart",
    name: "Lionheart",
    summary: "Stats and +30 all resistances. The armor that fixes your Strength requirements.",
    runes: ["hel", "lum", "fal"],
    sockets: 3,
    requiredLevel: 41,
    tier: "nightmare",
    bases: {
      categories: ["body-armor"],
      display: "Any 3-socket Body Armor",
    },
    stats: [
      { text: "+25 to Strength", notable: true },
      { text: "+15 to Dexterity" },
      { text: "+20 to Vitality" },
      { text: "+10 to Energy" },
      { text: "+50 to Life" },
      { text: "All Resistances +30", notable: true },
      { text: "+20% Enhanced Damage" },
      { text: "Requirements -15%" },
    ],
    usedBy:
      "Melee characters through Nightmare and into Hell. The +25 Strength effectively refunds 25 stat points, which is why it beats Smoke for many builds despite lower resistances.",
    confidence: "verified",
  },
  {
    slug: "treachery",
    name: "Treachery",
    summary:
      "45 IAS and a chance to self-cast Fade. The default mercenary armor for most of the game.",
    runes: ["shael", "thul", "lem"],
    sockets: 3,
    requiredLevel: 43,
    tier: "nightmare",
    bases: {
      categories: ["body-armor"],
      display: "Any 3-socket Body Armor",
    },
    stats: [
      { text: "25% Chance to cast level 15 Venom on striking" },
      { text: "5% Chance to cast level 15 Fade when struck", notable: true },
      { text: "+2 to Assassin Skill Levels" },
      { text: "+45% Increased Attack Speed", notable: true },
      { text: "+20% Faster Hit Recovery" },
      { text: "Cold Resist +30%" },
      { text: "50% Extra Gold from Monsters" },
    ],
    usedBy:
      "Mercenaries, overwhelmingly. Fade gives the mercenary a large resistance and damage-reduction buff whenever it procs, which keeps an Act 2 merc alive in Hell far better than raw defense would.",
    notes:
      "The Fade proc is the whole point. Venom and the Assassin skills are irrelevant on a mercenary.",
    confidence: "verified",
  },
  {
    slug: "wealth",
    name: "Wealth",
    summary: "300% gold find and 100% magic find. A gold-farming armor, not a combat armor.",
    runes: ["lem", "ko", "tir"],
    sockets: 3,
    requiredLevel: 43,
    tier: "nightmare",
    bases: {
      categories: ["body-armor"],
      display: "Any 3-socket Body Armor",
    },
    stats: [
      { text: "300% Extra Gold from Monsters", notable: true },
      { text: "100% Better Chance of Getting Magic Items", notable: true },
      { text: "+10 to Dexterity" },
      { text: "+2 to Mana after each Kill" },
    ],
    usedBy:
      "Dedicated magic-find and gold-find characters. It gives no defensive value at all, so only wear it somewhere you cannot die.",
    confidence: "verified",
  },
  {
    slug: "memory",
    name: "Memory",
    summary: "+3 Sorceress skills and 33% Faster Cast Rate in a staff.",
    runes: ["lum", "io", "sol", "eth"],
    sockets: 4,
    requiredLevel: 37,
    tier: "nightmare",
    bases: {
      categories: ["staff"],
      display: "Any 4-socket Staff",
      exclusions: ["Staves only — not orbs, not wands."],
    },
    stats: [
      { text: "+3 to Sorceress Skill Levels", notable: true },
      { text: "+33% Faster Cast Rate", notable: true },
      { text: "+3 to Energy Shield (Sorceress only)" },
      { text: "+2 to Static Field (Sorceress only)" },
      { text: "+9 to Minimum Damage" },
      { text: "-25% Target Defense" },
      { text: "+50% Enhanced Defense" },
      { text: "+10 to Vitality" },
      { text: "+10 to Energy" },
      { text: "Increase Maximum Mana 20%" },
      { text: "Magic Damage Reduced by 7" },
    ],
    usedBy:
      "Sorceresses who want more raw +skills than a Spirit sword gives, and who can give up the shield slot. A staff base with innate Sorceress skills stacks on top.",
    notes:
      "Two-handed, so it costs you your shield. Most Sorceresses prefer Spirit sword plus a shield until they can afford an orb.",
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Endgame
  // -------------------------------------------------------------------------
  {
    slug: "call-to-arms",
    name: "Call to Arms",
    summary:
      "Battle Orders on any class. A permanent ~40% life increase, carried on your weapon swap.",
    runes: ["amn", "ral", "mal", "ist", "ohm"],
    sockets: 5,
    requiredLevel: 57,
    tier: "optimized",
    bases: {
      categories: [
        "sword",
        "axe",
        "mace",
        "hammer",
        "scepter",
        "polearm",
        "spear",
        "staff",
        "wand",
        "dagger",
        "claw",
      ],
      display: "Any 5-socket Weapon",
      exclusions: [
        "Weapons only. Five sockets is the constraint — most weapon types cannot reach five.",
      ],
    },
    stats: [
      { text: "+1 to All Skills" },
      { text: "+2-6 to Battle Command", variable: true, notable: true },
      { text: "+1-6 to Battle Orders", variable: true, notable: true },
      { text: "+1-4 to Battle Cry", variable: true },
      { text: "+40% Increased Attack Speed" },
      { text: "+250-290% Enhanced Damage", variable: true },
      { text: "Adds 5-30 Fire Damage" },
      { text: "7% Life stolen per hit" },
      { text: "Prevent Monster Heal" },
      { text: "Replenish Life +12" },
      { text: "30% Better Chance of Getting Magic Items" },
    ],
    recommendedBases: [
      "A Crystal Sword or Flail — cheap, low Strength, and can roll 5 sockets.",
      "The base's stats do not matter. You never fight with it; you cast Battle Command twice and Battle Orders once, then swap back.",
    ],
    usedBy:
      "Every class, in the weapon-swap slot. Battle Orders is a large life and mana multiplier that no other item provides.",
    commonMistakes: [
      "Making it in a good base. It is a buff stick — use the cheapest 5-socket weapon you can find.",
      "Forgetting to cast Battle Command twice before Battle Orders. The second Battle Command boosts the Battle Orders that follows.",
    ],
    confidence: "verified",
  },
  {
    slug: "heart-of-the-oak",
    name: "Heart of the Oak",
    summary:
      "+3 skills, 40% Faster Cast Rate and up to +40 all resistances. The default endgame caster weapon.",
    runes: ["ko", "vex", "pul", "thul"],
    sockets: 4,
    requiredLevel: 55,
    tier: "optimized",
    bases: {
      categories: ["staff", "mace"],
      display: "Any 4-socket Staff or Mace",
      exclusions: [
        "Maces specifically — not hammers, not scepters, not clubs that classify as another type.",
        "Not swords, not orbs, not wands.",
      ],
    },
    stats: [
      { text: "+3 to All Skills", notable: true },
      { text: "+40% Faster Cast Rate", notable: true },
      { text: "All Resistances +30-40", variable: true, notable: true },
      { text: "+75% Damage to Demons" },
      { text: "+100 to Attack Rating against Demons" },
      { text: "Adds 3-14 Cold Damage" },
      { text: "7% Mana stolen per hit" },
      { text: "+10 to Dexterity" },
      { text: "Replenish Life +20" },
      { text: "Increase Maximum Mana 15%" },
      { text: "Level 4 Oak Sage (25/25 Charges)" },
      { text: "Level 14 Raven (60/60 Charges)" },
    ],
    recommendedBases: [
      "A Flail — one-handed, only 41 Strength, and reaches 4 sockets. This is the standard choice.",
      "Avoid two-handed staff bases unless you have no use for a shield.",
    ],
    usedBy:
      "Casters of every class once they can afford a Vex rune. The combination of +3 skills, 40 FCR and up to 40 all resistances is unmatched at its cost.",
    confidence: "verified",
  },
  {
    slug: "enigma",
    name: "Enigma",
    summary:
      "Teleport on any class. The most transformative item in the game, and priced accordingly.",
    runes: ["jah", "ith", "ber"],
    sockets: 3,
    requiredLevel: 65,
    tier: "optimized",
    bases: {
      categories: ["body-armor"],
      display: "Any 3-socket Body Armor",
    },
    stats: [
      { text: "+1 to Teleport", notable: true },
      { text: "+2 to All Skills", notable: true },
      { text: "+45% Faster Run/Walk" },
      { text: "+750-775 Defense", variable: true },
      { text: "+0.75 to Strength per Character Level", notable: true },
      { text: "Increase Maximum Life 5%" },
      { text: "Damage Reduced by 8%" },
      { text: "+14 Life after each Kill" },
      { text: "15% Damage Taken Goes to Mana" },
      { text: "+1% Better Chance of Getting Magic Items per Character Level" },
    ],
    recommendedBases: [
      "A Mage Plate or Archon Plate — light, low Strength, and the +0.75 Strength per level makes almost any base wearable anyway.",
      "Do not use a heavy base for the defense. The defense is irrelevant next to Teleport.",
    ],
    usedBy:
      "Every class that is not a Sorceress. For a Sorceress it is still strong (+2 skills, huge Strength, magic find) but far less essential, because she already has Teleport.",
    notes:
      "The Strength bonus is why Enigma unlocks heavy gear on casters: at level 90 it grants 67 Strength, often enough to wear a Monarch shield with no stat investment.",
    confidence: "verified",
  },
  {
    slug: "chains-of-honor",
    name: "Chains of Honor",
    summary: "+2 skills and +65 all resistances. The safest endgame caster armor.",
    runes: ["dol", "um", "ber", "ist"],
    sockets: 4,
    requiredLevel: 63,
    tier: "optimized",
    bases: {
      categories: ["body-armor"],
      display: "Any 4-socket Body Armor",
    },
    stats: [
      { text: "+2 to All Skills", notable: true },
      { text: "All Resistances +65", notable: true },
      { text: "Damage Reduced by 8%", notable: true },
      { text: "+70% Enhanced Defense" },
      { text: "+20 to Strength" },
      { text: "+200% Damage to Demons" },
      { text: "+100% Damage to Undead" },
      { text: "8% Life stolen per hit" },
      { text: "Replenish Life +7" },
      { text: "25% Better Chance of Getting Magic Items" },
    ],
    usedBy:
      "Sorceresses and other casters who already have Teleport and would rather have resistances than an Enigma. In Hell, +65 all resistances frees up an enormous amount of gear budget elsewhere.",
    confidence: "verified",
  },
  {
    slug: "fortitude",
    name: "Fortitude",
    summary:
      "+300% Enhanced Damage in a weapon, or +200% Enhanced Defense and big life in an armor.",
    runes: ["el", "sol", "dol", "lo"],
    sockets: 4,
    requiredLevel: 59,
    tier: "optimized",
    bases: {
      categories: [
        "body-armor",
        "sword",
        "axe",
        "mace",
        "polearm",
        "spear",
        "bow",
        "crossbow",
      ],
      display: "Any 4-socket Body Armor or Weapon",
    },
    stats: [
      { text: "20% Chance to cast level 15 Chilling Armor when struck" },
      { text: "+25% Faster Cast Rate" },
      { text: "+1-1.5 to Life per Character Level", variable: true, notable: true },
      { text: "All Resistances +25-30", variable: true },
      { text: "12% Damage Taken Goes to Mana" },
      { text: "In armor: +200% Enhanced Defense, Damage Reduced by 7, +5% Max Lightning Resist" },
      { text: "In weapons: +300% Enhanced Damage, 20% Deadly Strike, Hit Causes Monster to Flee 25%" },
    ],
    recommendedBases: [
      "Armor version: an Archon Plate for the low Strength requirement, or a heavier base if you want the defense to actually matter.",
      "Weapon version: usually for a mercenary. Note the Hit Causes Monster to Flee, which is a real downside on a merc weapon.",
    ],
    usedBy:
      "Physical-damage builds (weapon version) and almost any character wanting a large life pool (armor version). The armor is the more common choice.",
    confidence: "verified",
  },
  {
    slug: "infinity",
    name: "Infinity",
    summary:
      "A Conviction aura that breaks lightning immunity. The single most build-defining runeword for elemental casters.",
    runes: ["ber", "mal", "ber", "ist"],
    sockets: 4,
    requiredLevel: 63,
    tier: "bis",
    bases: {
      categories: ["polearm", "spear"],
      display: "Any 4-socket Polearm or Spear",
      exclusions: [
        "Polearms and spears only. Unlike Insight, spears DO work here — check the item class carefully.",
      ],
    },
    stats: [
      { text: "Level 12 Conviction Aura When Equipped", notable: true },
      { text: "-45 to -55% to Enemy Lightning Resistance", variable: true, notable: true },
      { text: "50% Chance to cast level 20 Chain Lightning when you Kill an Enemy" },
      { text: "+35% Faster Run/Walk" },
      { text: "40% Chance of Crushing Blow" },
      { text: "Prevent Monster Heal" },
      { text: "+0.5 to Vitality per Character Level" },
      { text: "30% Better Chance of Getting Magic Items" },
      { text: "Level 21 Cyclone Armor (30/30 Charges)" },
      { text: "+255-325% Enhanced Damage", variable: true },
    ],
    recommendedBases: [
      "An ethereal Giant Thresher or Cryptic Axe for an Act 2 mercenary. Ethereal is preferred: mercenaries do not break equipment.",
      "A Great Poleaxe or Thresher if elite bases are out of reach.",
    ],
    usedBy:
      "Lightning Sorceresses above all — Conviction plus the -lightning-resist line breaks Hell lightning immunity outright. Also transformative for Javazons and any physical build that wants the defense reduction.",
    commonMistakes: [
      "Assuming Conviction lowers all resistances equally. Conviction reduces fire, cold and lightning resistance; the extra -45-55% line applies only to lightning.",
      "Putting it on an Act 1 or Act 5 mercenary. Only the Act 2 mercenary uses polearms and spears.",
    ],
    notes:
      "Two Ber runes make this one of the most expensive items in the game. It is the classic 'the build works without it, but it is a different build with it' item.",
    confidence: "verified",
  },
  {
    slug: "duress",
    name: "Duress",
    summary:
      "40% Faster Hit Recovery, Crushing Blow and Open Wounds in a body armor. The budget melee armor.",
    runes: ["shael", "um", "thul"],
    sockets: 3,
    requiredLevel: 47,
    tier: "nightmare",
    bases: { categories: ["body-armor"], display: "Any 3-socket Body Armor" },
    stats: [
      { text: "+40% Faster Hit Recovery", notable: true },
      { text: "15% Chance of Crushing Blow", notable: true },
      { text: "33% Chance of Open Wounds", notable: true },
      { text: "Adds 37-133 Cold Damage" },
      { text: "+150-200% Enhanced Defense", variable: true },
      { text: "+10-20% Enhanced Damage", variable: true },
      { text: "All Resistances +15" },
      { text: "Cold Resist +30%" },
      { text: "-20% Slower Stamina Drain" },
    ],
    usedBy:
      "Melee characters who want Crushing Blow without giving up an equipment slot to get it. Crushing Blow removes a percentage of a monster's current life, which makes it disproportionately good against bosses.",
    confidence: "verified",
  },
  {
    slug: "crescent-moon",
    name: "Crescent Moon",
    summary:
      "-35% enemy lightning resistance on a weapon, for three mid runes. The budget answer to lightning immunity.",
    runes: ["shael", "um", "tir"],
    sockets: 3,
    requiredLevel: 47,
    tier: "nightmare",
    bases: {
      categories: ["axe", "sword", "polearm"],
      display: "Any 3-socket Axe, Sword or Polearm",
      exclusions: ["Not maces, not hammers, not spears."],
    },
    stats: [
      { text: "-35% to Enemy Lightning Resistance", notable: true },
      { text: "Ignore Target's Defense", notable: true },
      { text: "+20% Increased Attack Speed" },
      { text: "+180-220% Enhanced Damage", variable: true },
      { text: "10% Chance to cast level 17 Chain Lightning on striking" },
      { text: "7% Chance to cast level 13 Static Field on striking" },
      { text: "25% Chance of Open Wounds" },
      { text: "Magic Absorb 9-11%", variable: true },
      { text: "+2 to Mana after each Kill" },
      { text: "Level 18 Summon Spirit Wolf (30/30 Charges)" },
    ],
    usedBy:
      "Lightning builds that cannot afford an Infinity. -35% enemy lightning resistance is roughly two thirds of what Infinity's line provides, for a tiny fraction of the cost — though it lacks Conviction, so it will not break immunity.",
    confidence: "verified",
  },
  {
    slug: "passion",
    name: "Passion",
    summary:
      "A cheap weapon runeword granting Zeal and Berserk to any class. Mostly used to reach Berserk for physical immunes.",
    runes: ["dol", "ort", "eld", "lem"],
    sockets: 4,
    requiredLevel: 43,
    tier: "nightmare",
    bases: {
      categories: ["sword", "axe", "mace", "hammer", "polearm", "spear", "staff", "dagger", "claw"],
      display: "Any 4-socket Weapon",
    },
    stats: [
      { text: "+1 to Zeal", notable: true },
      { text: "+1 to Berserk", notable: true },
      { text: "+25% Increased Attack Speed" },
      { text: "+160-210% Enhanced Damage", variable: true },
      { text: "50-80% Bonus to Attack Rating", variable: true },
      { text: "+75% Damage to Undead" },
      { text: "+50 to Attack Rating against Undead" },
      { text: "Adds 1-50 Lightning Damage" },
      { text: "Hit Blinds Target +10" },
      { text: "Hit Causes Monster to Flee 25%" },
      { text: "75% Extra Gold from Monsters" },
      { text: "Level 3 Heart of Wolverine (12/12 Charges)" },
    ],
    usedBy:
      "Barbarians and any melee character who wants access to Berserk. Berserk converts physical damage to magic, which is the standard answer to a physical-immune monster.",
    notes:
      "The Hit Causes Monster to Flee is a real drawback — monsters running away from you are monsters you have to chase.",
    confidence: "verified",
  },
  {
    slug: "death",
    name: "Death",
    summary:
      "50% Crushing Blow and level-scaled Deadly Strike. A cheap bossing weapon.",
    runes: ["hel", "el", "vex", "ort", "gul"],
    sockets: 5,
    requiredLevel: 55,
    tier: "optimized",
    bases: {
      categories: ["sword", "axe"],
      display: "Any 5-socket Sword or Axe",
      exclusions: ["Swords and axes only — five sockets is the real constraint."],
    },
    stats: [
      { text: "50% Chance of Crushing Blow", notable: true },
      { text: "+0.5% Deadly Strike per Character Level", notable: true },
      { text: "25% Chance to cast level 18 Glacial Spike on attack" },
      { text: "100% Chance to cast level 44 Chain Lightning when you Die" },
      { text: "20% Bonus to Attack Rating" },
      { text: "+50 to Attack Rating" },
      { text: "Adds 1-50 Lightning Damage" },
      { text: "7% Mana stolen per hit" },
      { text: "Level 22 Blood Golem (15 Charges)" },
      { text: "+1 to Light Radius" },
      { text: "Indestructible" },
    ],
    usedBy:
      "Melee bossing characters. 50% Crushing Blow is the highest of any runeword and it strips a percentage of the target's current life per hit, which is exactly what you want against something with an enormous health pool.",
    confidence: "verified",
  },
  {
    slug: "grief",
    name: "Grief",
    summary:
      "A flat +340-400 damage that ignores enhanced-damage scaling entirely. The best physical melee weapon in the game.",
    runes: ["eth", "tir", "lo", "mal", "ral"],
    sockets: 5,
    requiredLevel: 59,
    tier: "bis",
    bases: {
      categories: ["sword", "axe"],
      display: "Any 5-socket Sword or Axe",
      exclusions: [
        "Swords and axes only. A Phase Blade is the standard base — it is indestructible and very fast.",
      ],
    },
    stats: [
      { text: "Damage +340-400", variable: true, notable: true },
      { text: "Ignore Target's Defense", notable: true },
      { text: "+30-40% Increased Attack Speed", variable: true, notable: true },
      { text: "20% Deadly Strike" },
      { text: "-25% Target Defense" },
      { text: "-20-25% to Enemy Poison Resistance", variable: true },
      { text: "+1.875% Damage to Demons per Character Level" },
      { text: "35% Chance to cast level 15 Venom on striking" },
      { text: "Adds 5-30 Fire Damage" },
      { text: "Prevent Monster Heal" },
      { text: "+10-15 Life after each Kill", variable: true },
      { text: "+2 to Mana after each Kill" },
    ],
    recommendedBases: [
      "A Phase Blade. It is indestructible, has the fastest base speed of any sword, and cannot be affected by defence at all.",
      "Berserker Axe if you want the higher base damage and can live with repairing it.",
    ],
    usedBy:
      "Every physical melee build that can afford it. Its flat damage bonus is applied after enhanced-damage multipliers rather than before, which is why it outperforms weapons with far higher listed damage.",
    notes:
      "The flat +damage is the whole point and it is easy to misread: it does not scale with +% Enhanced Damage, which paradoxically makes it *better* on fast weapons with low base damage.",
    confidence: "verified",
  },
  {
    slug: "doom",
    name: "Doom",
    summary:
      "A Holy Freeze aura plus -40 to -60% enemy cold resistance. Slows everything and breaks cold resistance at once.",
    runes: ["hel", "ohm", "um", "lo", "cham"],
    sockets: 5,
    requiredLevel: 67,
    tier: "bis",
    bases: {
      categories: ["axe", "polearm", "hammer"],
      display: "Any 5-socket Axe, Polearm or Hammer",
      exclusions: ["Not swords, not spears, not maces or scepters."],
    },
    stats: [
      { text: "Level 12 Holy Freeze Aura When Equipped", notable: true },
      { text: "-40 to -60% to Enemy Cold Resistance", variable: true, notable: true },
      { text: "+2 to All Skills", notable: true },
      { text: "+45% Increased Attack Speed" },
      { text: "+330-370% Enhanced Damage", variable: true },
      { text: "20% Deadly Strike" },
      { text: "25% Chance of Open Wounds" },
      { text: "Prevent Monster Heal" },
      { text: "Freezes Target +3" },
      { text: "5% Chance to cast level 18 Volcano on striking" },
      { text: "Requirements -20%" },
    ],
    usedBy:
      "Cold builds that want their mercenary to lower cold resistance the way Infinity lowers lightning resistance — and melee characters who want a permanent slow on everything nearby.",
    notes:
      "Holy Freeze from an item does not stack with a Holy Freeze mercenary aura. Pick one.",
    confidence: "verified",
  },
  {
    slug: "bramble",
    name: "Bramble",
    summary:
      "+25-50% poison skill damage and a Thorns aura. The defining armor for poison builds.",
    runes: ["ral", "ohm", "sur", "eth"],
    sockets: 4,
    requiredLevel: 61,
    tier: "optimized",
    bases: { categories: ["body-armor"], display: "Any 4-socket Body Armor" },
    stats: [
      { text: "+25-50% to Poison Skill Damage", variable: true, notable: true },
      { text: "Level 15-21 Thorns Aura When Equipped", variable: true, notable: true },
      { text: "+50% Faster Hit Recovery", notable: true },
      { text: "Poison Resist +100%" },
      { text: "Fire Resist +30%" },
      { text: "+5% to Maximum Cold Resist" },
      { text: "+300 Defense" },
      { text: "Increase Maximum Mana 5%" },
      { text: "Regenerate Mana 15%" },
      { text: "+13 Life after each Kill" },
      { text: "Level 13 Spirit of Barbs (33/33 Charges)" },
    ],
    usedBy:
      "Poison Necromancers above all — the +poison skill damage roll is a direct damage multiplier and nothing else in the game offers it in the armor slot.",
    notes:
      "The poison damage roll varies from 25% to 50%, which is an enormous spread. Check the roll before trading for one.",
    confidence: "verified",
  },
  {
    slug: "pride",
    name: "Pride",
    summary:
      "A level 16-20 Concentration aura on a mercenary weapon. The physical-damage equivalent of Infinity.",
    runes: ["cham", "sur", "io", "lo"],
    sockets: 4,
    requiredLevel: 67,
    tier: "bis",
    bases: {
      categories: ["polearm", "spear"],
      display: "Any 4-socket Polearm or Spear",
      exclusions: ["Polearms and spears only, like Infinity."],
    },
    stats: [
      { text: "Level 16-20 Concentration Aura When Equipped", variable: true, notable: true },
      { text: "260-300% Bonus to Attack Rating", variable: true, notable: true },
      { text: "Adds 50-280 Lightning Damage" },
      { text: "+1% Damage to Demons per Character Level" },
      { text: "20% Deadly Strike" },
      { text: "Hit Blinds Target +1" },
      { text: "Freezes Target +3" },
      { text: "+10 to Vitality" },
      { text: "Replenish Life +8" },
      { text: "25% Chance to cast level 17 Fire Wall when struck" },
      { text: "+1.875% Extra Gold from Monsters per Character Level" },
    ],
    usedBy:
      "Physical builds, on the mercenary. Concentration multiplies physical damage for you as well as him — and on a Hammerdin it stacks with nothing, because Concentration does not stack with itself.",
    notes:
      "It has no Enhanced Damage line at all, which surprises people. Its value is the aura and the attack rating, not the weapon's own damage.",
    confidence: "verified",
  },
  {
    slug: "faith",
    name: "Faith",
    summary:
      "A Fanaticism aura in a bow. Attack speed, attack rating and damage for the whole party.",
    runes: ["ohm", "jah", "lem", "eld"],
    sockets: 4,
    requiredLevel: 65,
    tier: "bis",
    bases: {
      categories: ["bow", "crossbow"],
      display: "Any 4-socket Bow or Crossbow",
      exclusions: ["Missile weapons only — not Amazon-only bows unless they are also 4-socket."],
    },
    stats: [
      { text: "Level 12-15 Fanaticism Aura When Equipped", variable: true, notable: true },
      { text: "+1-2 to All Skills", variable: true, notable: true },
      { text: "+330% Enhanced Damage", notable: true },
      { text: "300% Bonus to Attack Rating" },
      { text: "Ignore Target's Defense" },
      { text: "+75% Damage to Undead" },
      { text: "+50 to Attack Rating against Undead" },
      { text: "Adds 120 Fire Damage" },
      { text: "All Resistances +15" },
      { text: "Reanimate As: Returned" },
      { text: "75% Extra Gold from Monsters" },
    ],
    usedBy:
      "Bowazons, and Act 1 Rogue mercenaries. Fanaticism's attack speed bonus applies to you as well as the wielder, which makes it one of the few genuinely valuable mercenary bow runewords.",
    confidence: "verified",
  },

  {
    slug: "exile",
    name: "Exile",
    summary:
      "A Paladin-only shield that carries a Defiance aura, +2 Offensive Auras and Life Tap on striking. The Smiter's sustain in one item.",
    runes: ["vex", "ohm", "ist", "dol"],
    sockets: 4,
    requiredLevel: 57,
    tier: "bis",
    bases: {
      categories: ["shield"],
      display: "Any 4-socket Paladin shield",
      exclusions: [
        "Paladin class shields only — Auric Shields and their Normal/Exceptional equivalents. It cannot be made in a Monarch or any other ordinary shield.",
      ],
    },
    stats: [
      { text: "15% Chance to cast level 5 Life Tap on striking", notable: true },
      {
        text: "Level 13-16 Defiance Aura When Equipped",
        variable: true,
        notable: true,
      },
      { text: "+2 to Offensive Auras (Paladin Only)", notable: true },
      { text: "+30% Faster Block Rate" },
      { text: "Freezes Target +1" },
      { text: "+220-260% Enhanced Defense", variable: true },
      { text: "Replenish Life +7" },
      { text: "+5% to Maximum Cold Resist" },
      { text: "+5% to Maximum Fire Resist" },
      { text: "25% Better Chance of Getting Magic Items" },
      { text: "Repairs 1 durability in 25 seconds" },
    ],
    recommendedBases: [
      "An **ethereal** Paladin shield. Exile repairs itself, so the usual reason to avoid ethereal bases does not apply — and ethereal adds 50% to the base defence.",
      "A base that rolls +45 to all resistances is the one to hold out for. The shield type itself matters less than that roll.",
    ],
    usedBy:
      "Smiters above all — the Life Tap proc is what keeps a Paladin alive through Uber Mephisto, and it needs no skill points. Also worn by Zealots and by aura-swapping Paladins who want Defiance on tap.",
    commonMistakes: [
      "Trying to make it in a Monarch. Exile is Paladin-only; the base has to be a class shield.",
      "Avoiding ethereal bases out of habit. Here they are strictly better, because the runeword repairs itself.",
    ],
    confidence: "verified",
  },
  {
    slug: "kingslayer",
    name: "Kingslayer",
    summary:
      "Crushing Blow, Open Wounds and a free point in Vengeance on a mid-tier weapon. The cheapest real answer to a boss.",
    runes: ["mal", "um", "gul", "fal"],
    sockets: 4,
    requiredLevel: 53,
    tier: "budget",
    bases: {
      categories: ["sword", "axe"],
      display: "Any 4-socket Sword or Axe",
      exclusions: [
        "Swords and axes only. Not maces, not scepters, not polearms — the same class restriction people get wrong with Grief.",
      ],
    },
    stats: [
      { text: "+30% Increased Attack Speed", notable: true },
      { text: "+230-270% Enhanced Damage", variable: true, notable: true },
      { text: "33% Chance of Crushing Blow", notable: true },
      { text: "25% Chance of Open Wounds" },
      { text: "-25% Target Defense" },
      { text: "20% Bonus to Attack Rating" },
      { text: "+1 to Vengeance" },
      { text: "Prevent Monster Heal" },
      { text: "+10 to Strength" },
      { text: "40% Extra Gold from Monsters" },
    ],
    recommendedBases: [
      "A Cryptic Sword or Berserker Axe for the damage, or a Phase Blade if you want the speed and indestructibility.",
    ],
    usedBy:
      "Melee characters who cannot yet afford Grief. The +1 to Vengeance also makes it the natural first weapon for an Avenger, since it supplies the skill before any point investment.",
    notes:
      "Open Wounds reads 25% in the game's own data. Several community databases still list 50%, which appears to be a stale figure.",
    confidence: "verified",
  },
  {
    slug: "last-wish",
    name: "Last Wish",
    summary:
      "A Might aura, heavy Crushing Blow and Life Tap on striking, on a six-socket weapon that costs three Jah runes.",
    runes: ["jah", "mal", "jah", "sur", "jah", "ber"],
    sockets: 6,
    requiredLevel: 65,
    tier: "bis",
    bases: {
      categories: ["sword", "hammer", "axe"],
      display: "Any 6-socket Sword, Hammer or Axe",
      exclusions: [
        "Swords, hammers and axes. Not polearms — which rules out most of the bases a mercenary would otherwise want.",
      ],
    },
    stats: [
      { text: "Level 17 Might Aura When Equipped", notable: true },
      {
        text: "40-50% Chance of Crushing Blow",
        variable: true,
        notable: true,
      },
      { text: "10% Chance to cast level 18 Life Tap on striking", notable: true },
      { text: "6% Chance to cast level 11 Fade when struck", notable: true },
      { text: "20% Chance to cast level 20 Charged Bolt on attack" },
      { text: "+330-375% Enhanced Damage", variable: true },
      { text: "Ignore Target's Defense" },
      { text: "Prevent Monster Heal" },
      { text: "Hit Blinds Target +1" },
      {
        text: "0.5% Better Chance of Getting Magic Items per Character Level",
      },
    ],
    recommendedBases: [
      "A Berserker Axe or Colossus Blade, for the damage the Enhanced Damage roll multiplies.",
      "Most often built for a mercenary rather than the player, because the Might aura it emanates benefits whoever stands next to it.",
    ],
    usedBy:
      "Physical melee characters and their mercenaries. The combination of a Might aura, Crushing Blow and a Life Tap proc means one item covers damage, boss damage and sustain at once.",
    commonMistakes: [
      "Three Jah runes is the real cost, not the six sockets. Budget for that before hunting a base.",
      "Building it in a polearm. Last Wish does not accept polearms, which is the base most mercenary weapons use.",
    ],
    notes:
      "Crushing Blow reads 40-50% in the game's own data. Several community databases still list 60-70%, which appears to be a stale figure.",
    confidence: "verified",
  },

  {
    slug: "dream",
    name: "Dream",
    summary:
      "A level 15 Holy Shock aura from an item. Wear two and the aura stacks to level 30, which is an entire build's damage.",
    runes: ["io", "jah", "pul"],
    sockets: 3,
    requiredLevel: 65,
    tier: "bis",
    bases: {
      categories: ["helm", "shield"],
      display: "Any 3-socket Helm or Shield",
      exclusions: [
        "Helms and shields only — not body armour. Dragon is the one that goes in armour, and mixing the two up is the most common mistake here.",
      ],
    },
    stats: [
      { text: "Level 15 Holy Shock Aura When Equipped", notable: true },
      { text: "+20-30% Faster Hit Recovery", variable: true, notable: true },
      { text: "All Resistances +5-20", variable: true },
      { text: "10% Chance to cast level 15 Confuse when struck" },
      { text: "+150-220 Defense", variable: true },
      { text: "+0.625 to Mana per Character Level" },
      { text: "12-25% Better Chance of Getting Magic Items", variable: true },
      { text: "In a helm: +10 Vitality, Increase Maximum Life 5%, +30% Enhanced Defense" },
      { text: "In a shield: +10 Vitality, +50 to Life, +30% Enhanced Defense" },
    ],
    recommendedBases: [
      "A helm and a shield, both of them. One Dream is a curiosity; two Dreams is the Tesladin, because the auras stack to an effective level 30.",
      "For the shield, a Paladin class shield adds its own resistances on top. For the helm, any 3-socket elite helm with low requirements.",
    ],
    usedBy:
      "Tesladins, who wear two of them and let a level 30 Holy Shock aura do the killing while they attack with Zeal. Also worn singly by aura-swapping Paladins who want lightning damage on tap.",
    commonMistakes: [
      "Making it in body armour. Dream does not accept armour; that is Dragon.",
      "Making only one. The build is built on the two auras stacking, and a single Dream is not most of the way there.",
      "Underestimating the cost. Two Dreams is two Jah runes, which is the real price of the build.",
    ],
    notes:
      "The last two stat lines depend on which base you use — the game grants different bonuses in a helm than in a shield. Everything above them applies to both.",
    confidence: "verified",
  },
  {
    slug: "dragon",
    name: "Dragon",
    summary:
      "A level 14 Holy Fire aura from body armour or a shield, plus Strength that scales with your level.",
    runes: ["sur", "lo", "sol"],
    sockets: 3,
    requiredLevel: 61,
    tier: "bis",
    bases: {
      categories: ["body-armor", "shield"],
      display: "Any 3-socket Body Armor or Shield",
      exclusions: [
        "Body armour and shields — not helms. Dream is the helm one.",
      ],
    },
    stats: [
      { text: "Level 14 Holy Fire Aura When Equipped", notable: true },
      { text: "+0.375 to Strength per Character Level", notable: true },
      { text: "+360 Defense" },
      { text: "+230 Defense vs. Missile" },
      { text: "+3-5 to All Attributes", variable: true },
      { text: "12% Chance to cast level 15 Hydra on striking" },
      { text: "20% Chance to cast level 18 Venom when struck" },
      { text: "In body armour: Increase Maximum Mana 5%, +5% Maximum Lightning Resist, Damage Reduced by 7" },
      { text: "In a shield: +50 to Mana, +5% Maximum Lightning Resist, Damage Reduced by 7" },
    ],
    recommendedBases: [
      "A low-requirement 3-socket body armour, because the Strength-per-level line means you do not want to be paying for the base twice.",
      "A Paladin class shield if you are building a Dragon Paladin and want the innate resistances.",
    ],
    usedBy:
      "Dragon Paladins, usually paired with a Hand of Justice weapon so that two Holy Fire auras stack. The Strength per level also quietly pays for heavier gear elsewhere.",
    commonMistakes: [
      "Expecting the aura to be enough on its own. A single level 14 Holy Fire does not kill anything in Hell — it is half of a pair.",
      "Building it in a helm. Dragon does not accept helms.",
    ],
    notes:
      "The last two stat lines depend on the base. Everything above them applies to both body armour and shields.",
    confidence: "verified",
  },
  {
    slug: "hand-of-justice",
    name: "Hand of Justice",
    summary:
      "A level 16 Holy Fire aura on a weapon, with attack speed, life steal and -20% enemy fire resistance.",
    runes: ["sur", "cham", "amn", "lo"],
    sockets: 4,
    requiredLevel: 67,
    tier: "bis",
    bases: {
      categories: ["sword", "axe", "mace", "hammer", "scepter", "polearm", "spear"],
      display: "Any 4-socket Weapon",
      exclusions: [
        "Any weapon type, which is unusually permissive — the constraint is finding a 4-socket base worth putting four high runes into.",
      ],
    },
    stats: [
      { text: "Level 16 Holy Fire Aura When Equipped", notable: true },
      { text: "-20% to Enemy Fire Resistance", notable: true },
      { text: "+33% Increased Attack Speed", notable: true },
      { text: "+280-330% Enhanced Damage", variable: true },
      { text: "Ignore Target's Defense" },
      { text: "7% Life stolen per hit" },
      { text: "20% Deadly Strike" },
      { text: "Freezes Target +3" },
      { text: "Hit Blinds Target +1" },
      { text: "100% Chance to cast level 36 Blaze when you Level-Up" },
      { text: "100% Chance to cast level 48 Meteor when you Die" },
    ],
    recommendedBases: [
      "A Phase Blade for the speed and indestructibility, or a Berserker Axe for the damage the Enhanced Damage roll multiplies.",
    ],
    usedBy:
      "Dragon Paladins, who pair it with a Dragon runeword so the two Holy Fire auras stack — and its -20% enemy fire resistance compounds with that directly. Also used by melee characters who simply want the attack speed and life steal.",
    commonMistakes: [
      "Treating the Meteor-on-death line as a feature. It fires when you die; it is flavour, not a plan.",
      "Buying it for the aura alone without a second Holy Fire source. One aura is not a build.",
    ],
    confidence: "verified",
  },

  {
    slug: "beast",
    name: "Beast",
    summary:
      "A Fanaticism aura and +3 to Werebear on a weapon — which lets any class transform, not just a Druid.",
    runes: ["ber", "tir", "um", "mal", "lum"],
    sockets: 5,
    requiredLevel: 63,
    tier: "bis",
    bases: {
      categories: ["axe", "scepter", "hammer"],
      display: "Any 5-socket Axe, Scepter or Hammer",
      exclusions: [
        "Axes, scepters and hammers only — not swords, which is the base most people reach for first.",
      ],
    },
    stats: [
      { text: "Level 9 Fanaticism Aura When Equipped", notable: true },
      { text: "+3 to Werebear (Oskill)", notable: true },
      { text: "+3 to Shape Shifting (Oskill)", notable: true },
      { text: "+40% Increased Attack Speed", notable: true },
      { text: "+240-270% Enhanced Damage", variable: true },
      { text: "20% Chance of Crushing Blow" },
      { text: "25% Chance of Open Wounds" },
      { text: "Prevent Monster Heal" },
      { text: "+25-40 to Strength", variable: true },
      { text: "+10 to Energy" },
      { text: "+2 to Mana after each Kill" },
      { text: "Level 13 Summon Grizzly (5 charges)" },
    ],
    recommendedBases: [
      "A Berserker Axe for the damage the Enhanced Damage roll multiplies, or a Scourge if the Strength requirement is the problem.",
      "For a non-Druid using it to transform, the base matters less than usual — the Werebear form's own attack is what you are buying.",
    ],
    usedBy:
      "Two very different readers. **Summoners and party characters** want the Fanaticism aura, which it emanates to everything nearby without occupying your own aura slot. **Non-Druid characters** want the +3 Werebear, because `Oskill` means the skill is granted to any class — it is the only way a Sorceress or Barbarian can transform.",
    commonMistakes: [
      "Building it in a sword. Beast does not accept swords.",
      "Expecting the Fanaticism to stack with a Paladin's own. It does not — one aura is active at a time, and a Paladin running Fanaticism gains nothing from Beast's.",
    ],
    notes:
      "The `Oskill` on Werebear and Shape Shifting is the unusual part: an Oskill is granted to every class rather than only to the one that owns the tree. That single word is what makes the Werebear Sorceress and Werebear Barbarian possible at all.",
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Reign of the Warlock
  // -------------------------------------------------------------------------
  {
    slug: "authority",
    name: "Authority",
    summary:
      "A Reign of the Warlock body armor runeword. Runes and base confirmed; stat lines not yet verified.",
    runes: ["hel", "shael", "ral"],
    sockets: 3,
    requiredLevel: 29,
    tier: "nightmare",
    bases: { categories: ["body-armor"], display: "Any 3-socket Body Armor" },
    stats: [
      { text: "Stat lines not yet verified — see the note below." },
    ],
    release: "reign-of-the-warlock",
    confidence: "unverified",
    notes:
      "The rune combination and base type come from Blizzard's Reign of the Warlock announcement. The stat lines were not published there and have not been confirmed against an in-game source, so they are deliberately left blank rather than guessed. The level requirement shown is the minimum implied by its highest rune — Shael at level 29, not Ral at 19; Hel has no level requirement at all — and the real requirement may be higher.",
  },
  {
    slug: "coven",
    name: "Coven",
    summary:
      "A Reign of the Warlock helm runeword. Runes and base confirmed; stat lines not yet verified.",
    runes: ["ist", "ral", "io"],
    sockets: 3,
    requiredLevel: 51,
    tier: "optimized",
    bases: {
      categories: ["helm", "circlet", "barbarian-helm", "druid-pelt"],
      display: "Any 3-socket Helm",
    },
    stats: [{ text: "Stat lines not yet verified — see the note below." }],
    release: "reign-of-the-warlock",
    confidence: "unverified",
    notes:
      "Runes and base from Blizzard's announcement. Stat lines unpublished and unverified. Level requirement shown is the minimum implied by Ist (level 51).",
  },
  {
    slug: "void",
    name: "Void",
    summary:
      "A Reign of the Warlock dagger runeword, and one of very few that use a Zod. Stat lines not yet verified.",
    runes: ["thul", "zod", "ist"],
    sockets: 3,
    requiredLevel: 69,
    tier: "bis",
    bases: {
      categories: ["dagger"],
      display: "Any 3-socket Dagger",
      exclusions: ["Daggers only — not swords, not claws."],
    },
    stats: [{ text: "Stat lines not yet verified — see the note below." }],
    release: "reign-of-the-warlock",
    confidence: "unverified",
    notes:
      "Runes and base from Blizzard's announcement. A Zod rune makes this one of the most expensive runewords in the game regardless of what it does. Stat lines unpublished and unverified.",
  },
  {
    slug: "vigilence",
    name: "Vigilence",
    summary:
      "A Reign of the Warlock shield runeword. Runes and base confirmed; stat lines not yet verified.",
    runes: ["dol", "gul"],
    sockets: 2,
    requiredLevel: 53,
    tier: "optimized",
    bases: {
      categories: ["shield", "paladin-shield", "necromancer-head"],
      display: "Any 2-socket Shield",
    },
    stats: [{ text: "Stat lines not yet verified — see the note below." }],
    release: "reign-of-the-warlock",
    confidence: "unverified",
    notes:
      "Spelled 'Vigilence' in Blizzard's own announcement, which is almost certainly a typo for 'Vigilance' — the in-game spelling has not been confirmed. Runes and base from that same announcement; stat lines unpublished and unverified.",
  },
  {
    slug: "ritual",
    name: "Ritual",
    summary:
      "A Reign of the Warlock dagger runeword. Runes and base confirmed; stat lines not yet verified.",
    runes: ["amn", "shael", "ohm"],
    sockets: 3,
    requiredLevel: 57,
    tier: "optimized",
    bases: {
      categories: ["dagger"],
      display: "Any 3-socket Dagger",
      exclusions: ["Daggers only."],
    },
    stats: [{ text: "Stat lines not yet verified — see the note below." }],
    release: "reign-of-the-warlock",
    confidence: "unverified",
    notes:
      "Runes and base from Blizzard's announcement. Stat lines unpublished and unverified. Level requirement shown is the minimum implied by Ohm (level 57).",
  },

  // -------------------------------------------------------------------------
  // Bows, crossbows and the Amazon
  //
  // Verified against the pinned blizzhackers/d2data extraction (fc46999,
  // patch 3.3), `json/runes.json`. A runeword's displayed stat block is the
  // runeword's own properties PLUS each constituent rune's mod for that item
  // type, which is why Faith reads +330% Enhanced Damage where the table says
  // 280 — Ohm's weapon mod supplies the other 50. Every list below is composed
  // that way, from this repository's own rune data.
  //
  // The game's `miss` item type covers bows and crossbows, and Amazon-only
  // bows sit under it (`abow` -> `bow` -> `miss`), so all of these can be made
  // in a Matriarchal or Grand Matron Bow. Javelins cannot take any runeword at
  // all: `ajav` resolves to `mele`, not `miss`, and no Amazon javelin base has
  // a socket.
  // -------------------------------------------------------------------------
  {
    slug: "edge",
    name: "Edge",
    summary:
      "A Thorns aura, 35% attack speed and enormous bonus damage against demons and undead, for three Countess runes.",
    runes: ["tir", "tal", "amn"],
    sockets: 3,
    requiredLevel: 25,
    tier: "starter",
    bases: {
      categories: ["bow", "crossbow"],
      display: "Any 3-socket Bow or Crossbow",
      exclusions: [
        "Missile weapons only. Amazon-only bows count; javelins and spears do not.",
      ],
    },
    stats: [
      { text: "Level 15 Thorns Aura When Equipped", notable: true },
      { text: "+35% Increased Attack Speed", notable: true },
      { text: "+320-380% Damage to Demons", variable: true, notable: true },
      { text: "+280% Damage to Undead" },
      { text: "7% Life Stolen per Hit" },
      { text: "Prevent Monster Heal" },
      { text: "+5-10 to All Attributes", variable: true },
      { text: "+2 to Mana after each Kill" },
      { text: "+75 Poison Damage over 5 seconds" },
      { text: "15% Reduced Vendor Prices" },
    ],
    recommendedBases: [
      "Any 3-socket bow you can hold. This is a levelling runeword and the base matters far less than having it at all.",
      "A fast base beats a heavy one — the 35% attack speed compounds with the base's own speed, and nothing here scales off raw weapon damage.",
    ],
    usedBy:
      "Levelling Amazons and Act 1 Rogue mercenaries. The two damage lines cover most of what a character kills between level 25 and Hell, and the reduced vendor prices pay for repairs and shopping along the way.",
    commonMistakes: [
      "Expecting the demon and undead bonuses to help against everything. They do nothing at all to an animal, a construct or a human — which is most of Act 3.",
    ],
    confidence: "verified",
  },
  {
    slug: "peace",
    name: "Peace",
    summary:
      "+2 Amazon skills and a Valkyrie that summons herself. The cheapest body armor an Amazon will ever want.",
    runes: ["shael", "thul", "amn"],
    sockets: 3,
    requiredLevel: 29,
    tier: "starter",
    bases: {
      categories: ["body-armor"],
      display: "Any 3-socket Body Armor",
      exclusions: ["Body armor only — not helms, not shields."],
    },
    stats: [
      { text: "+2 to Amazon Skill Levels", notable: true },
      { text: "+2 to Critical Strike", notable: true },
      { text: "2% Chance to cast level 15 Valkyrie on striking", notable: true },
      { text: "4% Chance to cast level 5 Slow Missiles when struck" },
      { text: "+20% Faster Hit Recovery" },
      { text: "Cold Resist +30%" },
      { text: "Attacker Takes Damage of 14" },
    ],
    recommendedBases: [
      "The lightest 3-socket armor you can find. Nothing here scales with defence, so Strength spent on a heavy base is Strength wasted.",
      "A Breast Plate or Light Plate keeps you in the Fast run speed and costs 30 to 41 Strength.",
    ],
    usedBy:
      "Every Amazon between level 29 and a Fortitude or a Chains of Honor, and it is not only a levelling item — the +2 skills alone match a Skin of the Vipermagi's +1 with a second skill level on top.",
    commonMistakes: [
      "**The +2 to Critical Strike is an Oskill**, granted to any class, while the +2 to Amazon Skill Levels is not. A non-Amazon making this gets the passive and the two procs and nothing else.",
      "Treating the level 15 Valkyrie proc as a replacement for the skill. Two percent per hit summons her occasionally; a build that wants a Valkyrie holding the front puts a point in her.",
    ],
    confidence: "verified",
  },
  {
    slug: "melody",
    name: "Melody",
    summary:
      "+3 to Bow and Crossbow Skills and three more passives, in three runes. The Bowazon's levelling weapon.",
    runes: ["shael", "ko", "nef"],
    sockets: 3,
    requiredLevel: 39,
    tier: "nightmare",
    bases: {
      categories: ["bow", "crossbow"],
      display: "Any 3-socket Bow or Crossbow",
      exclusions: [
        "Missile weapons only. Amazon-only bows count; javelins and spears do not.",
      ],
    },
    stats: [
      { text: "+3 to Bow and Crossbow Skills (Amazon Only)", notable: true },
      { text: "+3 to Critical Strike (Amazon Only)", notable: true },
      { text: "+3 to Dodge (Amazon Only)" },
      { text: "+3 to Slow Missiles (Amazon Only)" },
      { text: "+300% Damage to Undead" },
      { text: "+50% Enhanced Damage" },
      { text: "+20% Increased Attack Speed" },
      { text: "+10 to Dexterity" },
      { text: "Knockback" },
    ],
    recommendedBases: [
      "A fast 3-socket bow. The +50% Enhanced Damage is small, so the base's own speed and damage are doing most of the work.",
      "An Amazon-only bow if one drops with three sockets — its base damage is higher than a common bow's at the same level.",
    ],
    usedBy:
      "Bow Amazons from level 39 until a Faith or an endgame unique replaces it. Twelve skill levels for three low runes is a better rate than anything else available at that point in the game.",
    commonMistakes: [
      "Making it for a non-Amazon. Every skill line here is class-restricted, so a Rogue mercenary gets the damage and the attack speed and none of the skills.",
      "**Knockback fights Strafe and Multiple Shot**, pushing targets out of the sequence you are firing. It is a levelling weapon, and this is one reason it stops being one.",
    ],
    confidence: "verified",
  },
  {
    slug: "harmony",
    name: "Harmony",
    summary:
      "A Vigor aura in a bow, plus a Valkyrie any class can summon. The reason bow Amazons move the way they do.",
    runes: ["tir", "ith", "sol", "ko"],
    sockets: 4,
    requiredLevel: 39,
    tier: "nightmare",
    bases: {
      categories: ["bow", "crossbow"],
      display: "Any 4-socket Bow or Crossbow",
      exclusions: [
        "Missile weapons only. Amazon-only bows count; javelins and spears do not.",
      ],
    },
    stats: [
      { text: "Level 10 Vigor Aura When Equipped", notable: true },
      { text: "+2-6 to Valkyrie", variable: true, notable: true },
      { text: "+200-275% Enhanced Damage", variable: true, notable: true },
      { text: "Adds 55-160 Fire Damage" },
      { text: "Adds 55-160 Lightning Damage" },
      { text: "Adds 55-160 Cold Damage" },
      { text: "+9 to Minimum Damage" },
      { text: "+9 to Maximum Damage" },
      { text: "+10 to Dexterity" },
      { text: "Regenerate Mana 20%" },
      { text: "+2 to Mana after each Kill" },
      { text: "+2 to Light Radius" },
      { text: "Level 20 Revive (25 Charges)" },
    ],
    recommendedBases: [
      "A 4-socket bow you can hold at level 39. Harmony is worn for the aura and the elemental damage, neither of which scales with the base.",
      "**Not a weapon-swap item.** An aura only runs from the weapon set you are actually holding, so a Harmony parked on the swap gives you nothing until you switch to it.",
    ],
    usedBy:
      "Bow Amazons of every kind, and plenty of characters who are not Amazons at all — the Valkyrie is an Oskill, so any class that can hold a bow can summon her. Also a standard mercenary bow for the movement speed it gives the whole party.",
    commonMistakes: [
      "Expecting the 55-160 elemental damage to break an immunity. It is three separate small elemental lines, and each is resisted normally.",
      "Reading the Vigor aura as a damage line. It is movement speed and stamina, and on a kiting build that is worth more than it sounds.",
    ],
    confidence: "verified",
  },
  {
    slug: "wrath",
    name: "Wrath",
    summary:
      "Decrepify on striking, 20% Crushing Blow and magic damage in a bow. The physical Bowazon's answer to physical immunity.",
    runes: ["pul", "lum", "ber", "mal"],
    sockets: 4,
    requiredLevel: 63,
    tier: "bis",
    bases: {
      categories: ["bow", "crossbow"],
      display: "Any 4-socket Bow or Crossbow",
      exclusions: [
        "Missile weapons only. Amazon-only bows count; javelins and spears do not.",
      ],
    },
    stats: [
      { text: "30% Chance to cast level 1 Decrepify on striking", notable: true },
      { text: "5% Chance to cast level 10 Life Tap on striking", notable: true },
      { text: "Adds 85-120 Magic Damage", notable: true },
      { text: "20% Chance of Crushing Blow", notable: true },
      { text: "+375% Damage to Demons" },
      { text: "+250-300% Damage to Undead", variable: true },
      { text: "Adds 41-240 Lightning Damage" },
      { text: "+100 to Attack Rating against Demons" },
      { text: "Prevent Monster Heal" },
      { text: "Cannot Be Frozen" },
      { text: "+10 to Energy" },
    ],
    recommendedBases: [
      "A fast 4-socket bow. Every line here is per-hit rather than per-damage, so hit rate is what you are buying.",
      "**Not an Amazon-only base with high requirements.** Wrath is worth making in whatever 4-socket bow you can hold, because none of its damage comes from the base.",
    ],
    usedBy:
      "Strafe and Multiple Shot Amazons above all. Decrepify halves a target's physical resistance and breaks most physical immunity outright, which is the one thing a pure physical bow build cannot otherwise do; Life Tap is the sustain that lets it stand still and fire.",
    commonMistakes: [
      "Comparing it to Faith on raw damage and concluding it loses. It does — Wrath is bought for the curses, the Crushing Blow and the magic damage, none of which Faith has.",
      "**Decrepify from an item does not stack with a Necromancer's curse.** One curse holds a monster at a time; the last one applied wins.",
    ],
    confidence: "verified",
  },
  {
    slug: "ice",
    name: "Ice",
    summary:
      "-20% to Enemy Cold Resistance and a Holy Freeze aura, in a bow. The one runeword a cold Amazon is actually waiting for.",
    runes: ["amn", "shael", "jah", "lo"],
    sockets: 4,
    requiredLevel: 65,
    tier: "bis",
    bases: {
      categories: ["bow", "crossbow"],
      display: "Any 4-socket Bow or Crossbow",
      exclusions: [
        "Missile weapons only. Amazon-only bows count; javelins and spears do not.",
      ],
    },
    stats: [
      { text: "-20% to Enemy Cold Resistance", notable: true },
      { text: "+25-30% to Cold Skill Damage", variable: true, notable: true },
      { text: "Level 18 Holy Freeze Aura When Equipped", notable: true },
      { text: "+140-210% Enhanced Damage", variable: true },
      { text: "25% Chance to cast level 22 Frost Nova on striking" },
      { text: "100% Chance to cast level 40 Blizzard when you Level-Up" },
      { text: "+20% Increased Attack Speed" },
      { text: "Ignore Target's Defense" },
      { text: "20% Deadly Strike" },
      { text: "7% Life Stolen per Hit" },
      { text: "+3.125% Extra Gold from Monsters per Character Level" },
    ],
    recommendedBases: [
      "A fast 4-socket bow — Matriarchal Bow if you can reach 187 Dexterity, a Crusader Bow if you cannot.",
      "The Holy Freeze aura already chills everything nearby, so a base with its own cold damage adds nothing you do not have.",
    ],
    usedBy:
      "Freezing Arrow Amazons. The −20% enemy cold resistance is applied only to targets that are not immune, and stacked with cold facets it is what keeps a single-element bow build relevant deep into Hell.",
    commonMistakes: [
      "Expecting −20% enemy cold resistance to break a cold immune on its own. It does not, and no total of it ever will: a −% to Enemy Resistance line is not applied to an immune monster at all. It is a damage line against everything that is merely resistant, and it lands at full value once something else has broken the immunity.",
      "Ignoring **Holy Freeze on a Freezing Arrow build**. The aura chills, the skill freezes, and a frozen monster cannot be chilled further — the two overlap more than the stat block suggests.",
    ],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Necromancer runewords
  //
  // Composed the same way as the Amazon set: the runeword's own properties from
  // `json/runes.json` at the pinned commit, plus each constituent rune's mod for
  // the item type, from this repository's own rune data. Bone's "All Resistances
  // +30" is two Um armor mods rather than a line the runeword carries.
  //
  // Two item-type facts decide where these go, and both come from
  // `json/itemtypes.json` rather than from a database listing:
  //
  //   - A Necromancer shrunken head is a shield. `head` (Voodoo Heads) resolves
  //     to `shld`, so every shield runeword — Splendor here, Rhyme and Spirit
  //     already catalogued — can be made in one. That is not a footnote for this
  //     class: a head carries +Necromancer skills of its own on top.
  //   - Most normal wands cannot take White. `gemsockets` is 1 on the plain Wand
  //     and the Yew Wand, and 1 on the exceptional Burnt Wand. Bone Wand and
  //     Grim Wand are the two normal bases that reach 2, which is why a level-35
  //     runeword is routinely made in a base that drops in Act 1.
  // -------------------------------------------------------------------------
  {
    slug: "white",
    name: "White",
    summary:
      "Two runes for +3 Poison and Bone Skills and nine effective levels spread across three named skills. The cheapest weapon a bone or Corpse Explosion Necromancer will ever hold.",
    runes: ["dol", "io"],
    sockets: 2,
    requiredLevel: 35,
    tier: "starter",
    bases: {
      categories: ["wand"],
      display: "Any 2-socket Wand",
      exclusions: [
        "Wands only — not staves, not orbs, not scepters.",
        "**The base must reach 2 sockets.** A plain Wand, a Yew Wand and a Burnt Wand cap at one and cannot hold this.",
      ],
    },
    stats: [
      { text: "+3 to Poison and Bone Skills (Necromancer Only)", notable: true },
      { text: "+4 to Skeleton Mastery (Necromancer Only)", notable: true },
      { text: "+3 to Bone Armor (Necromancer Only)" },
      { text: "+2 to Bone Spear (Necromancer Only)", notable: true },
      { text: "+20% Faster Cast Rate", notable: true },
      { text: "Magic Damage Reduced by 4" },
      { text: "+13 to Mana" },
      { text: "Hit Causes Monster to Flee 25%" },
      { text: "+10 to Vitality" },
    ],
    recommendedBases: [
      "A **Bone Wand** or **Grim Wand**. Both are normal-tier, both reach 2 sockets, both require no level and no Strength, and both drop from the first act onward.",
      "A Tomb Wand or Grave Wand if you would rather have the higher base damage — it is irrelevant to a caster, and the required level of 25 is not.",
      "Larzuk's socket quest on a normal, un-socketed white base is the reliable way to get exactly 2.",
    ],
    usedBy:
      "Bone Spear Necromancers before an elite wand exists, and Summoners for the +4 to Skeleton Mastery, which is worth more to an army than any single skill line on the list. **The +3 to Poison and Bone Skills also raises Corpse Explosion**, which lives in that tree — so this is a Summoner's weapon as much as a caster's.",
    commonMistakes: [
      "Making it in a 1-socket wand's worth of hope. Check `gemsockets` before you spend the runes: Bone Wand and Grim Wand are the normal bases that take two.",
      "**Reading +4 to Skeleton Mastery as four more skeletons.** It raises what each one is worth, not how many there are — the count comes from Raise Skeleton's own level.",
      "Wearing it to raise an army you already summoned. Minion stats are written at creation; the wand has to be in your hand *before* you raise them.",
    ],
    confidence: "verified",
  },
  {
    slug: "splendor",
    name: "Splendor",
    summary:
      "+1 to All Skills and +10% Faster Cast Rate for two runes, in a shield — and a Necromancer shrunken head is a shield.",
    runes: ["eth", "lum"],
    sockets: 2,
    requiredLevel: 37,
    tier: "starter",
    bases: {
      categories: ["shield", "paladin-shield", "necromancer-head"],
      display: "Any 2-socket Shield",
      exclusions: [
        "**Necromancer shrunken heads and Paladin auric shields both count.** The game resolves each to the shield type, so either can hold this.",
      ],
    },
    stats: [
      { text: "+1 to All Skills", notable: true },
      { text: "+10% Faster Cast Rate", notable: true },
      { text: "20% Faster Block Rate" },
      { text: "+60-100% Enhanced Defense", variable: true },
      { text: "20% Better Chance of Getting Magic Items" },
      { text: "50% Extra Gold from Monsters" },
      { text: "+3 to Light Radius" },
      { text: "Regenerate Mana 15%" },
      { text: "+10 to Energy" },
    ],
    recommendedBases: [
      "**A 2-socket Necromancer shrunken head**, which carries its own +Necromancer Skills and +to a skill tab before the runeword adds anything. This is the cheapest way a Necromancer reaches +3 or more from one slot.",
      "Any light 2-socket shield for another class — the Strength requirement is the base's, and nothing here scales with defence enough to justify a heavy one.",
    ],
    usedBy:
      "Any caster who cannot yet afford a Spirit, and Necromancers specifically, because the head it goes into is a class item that stacks skills of its own. A Spirit is two skill levels against this one, and needs four sockets and a 156-Strength Monarch to beat it.",
    commonMistakes: [
      "Comparing it to Spirit on skills alone and stopping there. In a shrunken head the comparison is +1 *plus the head's own* against +2, and the head usually wins on the total.",
      "Rolling it for the 60% Enhanced Defense. The spread to 100% is real and it is the least valuable line on the item for the characters that want it.",
    ],
    confidence: "verified",
  },
  {
    slug: "bone",
    name: "Bone",
    summary:
      "+2 Necromancer skills, a mana pool and two procs, in a body armor made from three mid runes.",
    runes: ["sol", "um", "um"],
    sockets: 3,
    requiredLevel: 47,
    tier: "nightmare",
    bases: {
      categories: ["body-armor"],
      display: "Any 3-socket Body Armor",
      exclusions: ["Body armor only — not helms, not shields."],
    },
    stats: [
      { text: "+2 to Necromancer Skill Levels", notable: true },
      { text: "15% Chance to cast level 10 Bone Armor when struck", notable: true },
      { text: "15% Chance to cast level 10 Bone Spear on striking" },
      { text: "+100-150 to Mana", variable: true, notable: true },
      { text: "All Resistances +30", notable: true },
      { text: "Damage Reduced by 7" },
    ],
    recommendedBases: [
      "The lightest 3-socket armor you can find. Nothing on the list scales with defence, so Strength spent on a heavy base is Strength wasted.",
      "A Breast Plate or Light Plate keeps you in the Fast run speed at 30 to 41 Strength.",
    ],
    usedBy:
      "Necromancers between level 47 and a Skin of the Vipermagi or a Chains of Honor. **The +100-150 mana is the line that matters most in practice** — a Summoner rebuilding an army or a bone caster spamming Bone Spear runs out of mana long before running out of anything else, and this is a bigger pool than any other armor at the tier.",
    commonMistakes: [
      "Expecting the Bone Spear proc to be damage. It is level 10 on a 15% trigger from *your* melee hits, which a caster almost never makes. The Bone Armor proc, which fires when you are struck, is the half that does work.",
      "Making it before an Um is spare. Two Um runes is a real cost at level 47, and a Stealth or a Smoke covers the gap for a fraction of it.",
      "**The +2 is to Necromancer Skill Levels, not to All Skills.** A mercenary wearing this gets the resistances, the mana and the damage reduction and nothing else.",
    ],
    confidence: "verified",
  },
];
