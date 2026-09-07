import type { UniqueItem } from "@/lib/types";

/**
 * Unique items referenced by the guides currently on the site.
 *
 * Every entry has been verified against the D2Runewizard unique-item database.
 * Ranges are written as the game rolls them, so a reader can tell a good roll
 * from a bad one — that distinction matters more than the average value.
 *
 * This is intentionally not "every unique in the game". Items get catalogued
 * when a guide needs them, which keeps the accuracy bar high.
 */
export const uniques: UniqueItem[] = [
  // -------------------------------------------------------------------------
  // Helms
  // -------------------------------------------------------------------------
  {
    slug: "harlequin-crest",
    name: "Harlequin Crest",
    summary:
      "Universally known as 'Shako'. +2 skills, life, mana, 50% magic find and 10% damage reduction — the best all-round caster helm in the game.",
    quality: "unique",
    base: "Shako",
    category: "helm",
    tier: "elite",
    slots: ["helm"],
    requiredLevel: 62,
    requiredStrength: 50,
    maxSockets: 2,
    stats: [
      { text: "+2 to All Skills", notable: true },
      { text: "+1.5 to Life per Character Level", notable: true },
      { text: "+1.5 to Mana per Character Level" },
      { text: "+2 to Strength, Dexterity, Vitality and Energy" },
      { text: "Damage Reduced by 10%", notable: true },
      { text: "50% Better Chance of Getting Magic Items", notable: true },
      { text: "Defense: 98-141", variable: true },
    ],
    drop: {
      summary:
        "Drops from any monster in an area level 58+ zone. Extremely common as high-end uniques go — it is usually one of the first good items a new character finds.",
      areas: ["ancient-tunnels", "pit", "travincal", "chaos-sanctuary"],
      minMonsterLevel: 58,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "The 50 Strength requirement is trivially low for an elite helm, and the +1.5 life per level means it scales with your character. At level 90 that is 135 life and 135 mana on top of everything else.",
    confidence: "verified",
  },
  {
    slug: "nightwings-veil",
    name: "Nightwing's Veil",
    summary:
      "+2 skills and up to +15% Cold Skill Damage. The best-in-slot helm for every cold build.",
    quality: "unique",
    base: "Spired Helm",
    category: "helm",
    tier: "elite",
    slots: ["helm"],
    requiredLevel: 67,
    requiredStrength: 192,
    maxSockets: 2,
    stats: [
      { text: "+2 to All Skills", notable: true },
      { text: "+8-15% to Cold Skill Damage", variable: true, notable: true },
      { text: "+90-120% Enhanced Defense", variable: true },
      { text: "+10-20 to Dexterity", variable: true },
      { text: "Cold Absorb 5-9%", variable: true },
      { text: "Half Freeze Duration" },
      { text: "Requirements -50%", notable: true },
    ],
    drop: {
      summary:
        "Requires an area level 79+ zone. Realistically this means Hell Chaos Sanctuary, Worldstone Keep, high Terror Zones, or trading.",
      areas: ["chaos-sanctuary", "worldstone-keep", "travincal"],
      minMonsterLevel: 79,
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "The listed 192 Strength looks impossible for a Sorceress, but Requirements -50% is applied to the item's own requirement — the effective cost is 96 Strength. Socket it with a Cold Rainbow Facet for more cold damage.",
    alternatives: [
      { kind: "unique", slug: "harlequin-crest" },
    ],
    confidence: "verified",
  },
  {
    slug: "tarnhelm",
    name: "Tarnhelm",
    summary:
      "+1 to All Skills and up to 50% magic find at level 15. An outstanding early-game helm.",
    quality: "unique",
    base: "Skull Cap",
    category: "helm",
    tier: "normal",
    slots: ["helm"],
    requiredLevel: 15,
    requiredStrength: 15,
    maxSockets: 2,
    stats: [
      { text: "+1 to All Skills", notable: true },
      { text: "25-50% Better Chance of Getting Magic Items", variable: true, notable: true },
      { text: "75% Extra Gold from Monsters" },
      { text: "Defense: 8-11" },
    ],
    drop: {
      summary:
        "Drops from level 15+ monsters, so it can appear from Act 2 Normal onward. Commonly gambled.",
      minMonsterLevel: 5,
      gamblable: true,
      tradeability: "abundant",
      confidence: "verified",
    },
    notes:
      "Almost no defence, but +1 skills and 50% magic find at level 15 is a real gift on a fresh character. It stays useful until a Lore or a Shako replaces it.",
    confidence: "verified",
  },
  {
    slug: "vampire-gaze",
    name: "Vampire Gaze",
    summary:
      "Life steal, mana steal, and up to 20% damage reduction. The default mercenary helm for most of the game.",
    quality: "unique",
    base: "Grim Helm",
    category: "helm",
    tier: "exceptional",
    slots: ["helm"],
    requiredLevel: 41,
    requiredStrength: 58,
    maxSockets: 2,
    stats: [
      { text: "6-8% Life stolen per hit", variable: true, notable: true },
      { text: "6-8% Mana stolen per hit", variable: true },
      { text: "Damage Reduced by 15-20%", variable: true, notable: true },
      { text: "Magic Damage Reduced by 10-15", variable: true },
      { text: "+100% Enhanced Defense" },
      { text: "Adds 6-22 Cold Damage" },
      { text: "15% Slower Stamina Drain" },
    ],
    drop: {
      summary: "Area level 41+. Common in Nightmare Act 4 and 5, and in Hell everywhere.",
      minMonsterLevel: 50,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "On a mercenary this is often better than a more expensive helm: life steal keeps him alive, and physical damage reduction stacks with everything else.",
    confidence: "verified",
  },

  {
    slug: "griffons-eye",
    name: "Griffon's Eye",
    summary:
      "The lightning helm. -15-20% enemy lightning resistance and +10-15% lightning skill damage, on a slot with no strength requirement.",
    quality: "unique",
    base: "Diadem",
    category: "helm",
    tier: "elite",
    slots: ["helm"],
    requiredLevel: 76,
    maxSockets: 3,
    stats: [
      { text: "-15-20% to Enemy Lightning Resistance", variable: true, notable: true },
      { text: "+10-15% to Lightning Skill Damage", variable: true, notable: true },
      { text: "+25% Faster Cast Rate", notable: true },
      { text: "+1 to All Skills" },
      { text: "+100-200 Defense", variable: true },
    ],
    drop: {
      summary: "Area level 84+, which in practice means Hell area level 85 farming or trading.",
      minMonsterLevel: 84,
      tradeability: "rare",
      confidence: "verified",
    },
    notes:
      "The enemy-resistance line is the reason, not the skill damage — it stacks with Conviction and with Lower Resist, and it applies before immunity is checked. A Diadem has no strength requirement, which makes this unusually easy to wear for what it does.",
    alternatives: [{ kind: "unique", slug: "harlequin-crest" }],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Weapons / orbs
  // -------------------------------------------------------------------------
  {
    slug: "the-oculus",
    name: "The Oculus",
    summary:
      "+3 Sorceress skills, 30% Faster Cast Rate, +20 all resistances and 50% magic find. The classic magic-find orb.",
    quality: "unique",
    base: "Swirling Crystal",
    category: "orb",
    tier: "exceptional",
    slots: ["weapon"],
    requiredLevel: 42,
    maxSockets: 3,
    stats: [
      { text: "+3 to Sorceress Skill Levels", notable: true },
      { text: "+30% Faster Cast Rate", notable: true },
      { text: "All Resistances +20", notable: true },
      { text: "50% Better Chance of Getting Magic Items", notable: true },
      { text: "+20 to Vitality" },
      { text: "+20 to Energy" },
      { text: "+20% Enhanced Defense" },
      { text: "+5 to Mana after each Kill" },
      { text: "25% Chance to cast level 1 Teleport when struck" },
    ],
    drop: {
      summary:
        "Area level 50+. Very commonly found, and the standard Sorceress upgrade out of a Spirit sword when magic find is the goal.",
      areas: ["mephisto", "andariel", "ancient-tunnels", "pit"],
      minMonsterLevel: 50,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "The random Teleport-when-struck proc is genuinely dangerous — it can teleport you into a pack. Many players still use it because the stat line is so good, but it is a real reason to prefer Death's Fathom or a Spirit shield setup in Hardcore.",
    alternatives: [
      { kind: "runeword", slug: "spirit" },
      { kind: "unique", slug: "deaths-fathom" },
    ],
    confidence: "verified",
  },
  {
    slug: "deaths-fathom",
    name: "Death's Fathom",
    summary:
      "+3 Sorceress skills and up to +30% Cold Skill Damage. The best-in-slot weapon for a Blizzard Sorceress.",
    quality: "unique",
    base: "Dimensional Shard",
    category: "orb",
    tier: "elite",
    slots: ["weapon"],
    requiredLevel: 73,
    maxSockets: 3,
    stats: [
      { text: "+3 to Sorceress Skill Levels", notable: true },
      { text: "+15-30% to Cold Skill Damage", variable: true, notable: true },
      { text: "+20% Faster Cast Rate" },
      { text: "Fire Resist +25-40%", variable: true },
      { text: "Lightning Resist +25-40%", variable: true },
    ],
    drop: {
      summary:
        "Requires an area level 85 zone, which is what makes it genuinely rare. Chaos Sanctuary, Worldstone Keep, The Pit, Ancient Tunnels and high Terror Zones.",
      areas: ["chaos-sanctuary", "worldstone-keep", "pit", "ancient-tunnels"],
      minMonsterLevel: 85,
      tradeability: "rare",
      confidence: "verified",
    },
    notes:
      "The +Cold Skill Damage roll varies from 15% to 30%, and the difference is large. Socket with a Cold Rainbow Facet. Note it provides only 20% Faster Cast Rate against Heart of the Oak's 40%, so switching to Death's Fathom usually means finding that FCR elsewhere.",
    alternatives: [
      { kind: "runeword", slug: "heart-of-the-oak" },
      { kind: "unique", slug: "the-oculus" },
    ],
    confidence: "verified",
  },
  {
    slug: "wizardspike",
    name: "Wizardspike",
    summary:
      "50% Faster Cast Rate and +75 all resistances on one item. No +skills at all, which is the trade.",
    quality: "unique",
    base: "Bone Knife",
    category: "dagger",
    tier: "exceptional",
    slots: ["weapon"],
    requiredLevel: 61,
    requiredStrength: 38,
    requiredDexterity: 75,
    stats: [
      { text: "+50% Faster Cast Rate", notable: true },
      { text: "All Resistances +75", notable: true },
      { text: "Increase Maximum Mana 15%" },
      { text: "+2 to Mana per Character Level" },
      { text: "Regenerate Mana 15%" },
      { text: "Indestructible" },
    ],
    drop: {
      summary: "Area level 58+. Reasonably common.",
      minMonsterLevel: 58,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "+75 all resistances from a single slot is unmatched, and it solves Hell resistances outright. The cost is zero +skills, which for a damage-focused Sorceress is usually too much. It shines on characters whose damage does not scale with skills.",
    confidence: "verified",
  },

  {
    slug: "heavens-light",
    name: "Heaven's Light",
    summary:
      "A Paladin scepter with 33% Crushing Blow and up to three sockets. The cheap route to boss damage without a Grief.",
    quality: "unique",
    base: "Mighty Scepter",
    category: "scepter",
    tier: "elite",
    slots: ["weapon"],
    requiredLevel: 61,
    requiredStrength: 125,
    requiredDexterity: 65,
    maxSockets: 3,
    stats: [
      { text: "+2-3 to Paladin Skill Levels", variable: true, notable: true },
      { text: "33% Chance of Crushing Blow", notable: true },
      { text: "+250-300% Enhanced Damage", variable: true },
      { text: "+20% Increased Attack Speed" },
      { text: "-33% Target Defense" },
      { text: "+15-20 Life after each Demon Kill", variable: true },
      { text: "+3 to Light Radius" },
      { text: "Socketed (1-3)", variable: true },
    ],
    drop: {
      summary:
        "Area level 69+. Uncommon, and rarely traded because most Paladins want a Grief instead.",
      minMonsterLevel: 69,
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "The reason to use it is the Crushing Blow, which is what actually kills a boss — a percentage of current life, ignoring almost everything the boss has. Paired with Gore Rider it reaches 48% chance, which is the number Fist of the Heavens hybrids build around.",
    alternatives: [{ kind: "runeword", slug: "grief" }],
    confidence: "verified",
  },

  {
    slug: "eschutas-temper",
    name: "Eschuta's Temper",
    summary:
      "+1-3 Sorceress skills and 40% Faster Cast Rate, with fire and lightning skill damage on the same orb.",
    quality: "unique",
    base: "Eldritch Orb",
    category: "orb",
    tier: "elite",
    slots: ["weapon"],
    requiredLevel: 72,
    maxSockets: 3,
    stats: [
      { text: "+1-3 to Sorceress Skill Levels", variable: true, notable: true },
      { text: "+40% Faster Cast Rate", notable: true },
      { text: "+10-20% to Fire Skill Damage", variable: true, notable: true },
      { text: "+10-20% to Lightning Skill Damage", variable: true, notable: true },
      { text: "+20-30 to Energy", variable: true },
    ],
    drop: {
      summary: "Area level 80+. Uncommon, and heavily traded because two build families want it.",
      minMonsterLevel: 80,
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "The rolls matter more here than on most uniques: +1 versus +3 Sorceress skills, and 10% versus 20% skill damage, is a large spread. It has no resistances and no magic find, so it is a pure damage weapon — a Spirit or an Oculus is often the better all-round choice on a budget.",
    alternatives: [
      { kind: "unique", slug: "deaths-fathom" },
      { kind: "unique", slug: "the-oculus" },
    ],
    confidence: "verified",
  },

  {
    slug: "demon-machine",
    name: "Demon Machine",
    summary:
      "66% Piercing Attack on the fastest crossbow in the game. The item the Enchant Sorceress is named after.",
    quality: "unique",
    base: "Chu-Ko-Nu",
    category: "crossbow",
    tier: "exceptional",
    slots: ["weapon"],
    requiredLevel: 49,
    requiredStrength: 80,
    requiredDexterity: 95,
    maxSockets: 5,
    stats: [
      { text: "66% Piercing Attack", notable: true },
      { text: "Fires Explosive Arrows or Bolts (Level 6)", notable: true },
      { text: "+123% Enhanced Damage" },
      { text: "+66 to Maximum Damage" },
      { text: "+632 to Attack Rating" },
      { text: "+321 Defense" },
      { text: "+36 to Mana" },
    ],
    drop: {
      summary:
        "Area level 57+. Uncommon, and almost never traded because only one build wants it.",
      minMonsterLevel: 57,
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "The Chu-Ko-Nu base is the fastest crossbow in the game — its weapon speed modifier is −60, further than any other. Combined with 66% Piercing Attack, each bolt carries whatever elemental damage you have added onto it through several targets at once, which is the entire mechanism behind the Enchant Sorceress. The 95 Dexterity requirement is the real cost, and it is not small for a caster.",
    confidence: "verified",
  },

  {
    slug: "andariels-visage",
    name: "Andariel's Visage",
    summary:
      "+2 skills, 20% attack speed and up to 10% life steal — bought with 30 points of your own fire resistance.",
    quality: "unique",
    base: "Demonhead",
    category: "helm",
    tier: "elite",
    slots: ["helm"],
    requiredLevel: 83,
    requiredStrength: 102,
    maxSockets: 3,
    stats: [
      { text: "+2 to All Skills", notable: true },
      { text: "+20% Increased Attack Speed", notable: true },
      { text: "8-10% Life Stolen per Hit", variable: true, notable: true },
      { text: "Fire Resist -30%", notable: true },
      { text: "+25-30 to Strength", variable: true },
      { text: "Poison Resist +70%" },
      { text: "+10% to Maximum Poison Resist" },
      { text: "15% Chance to cast level 15 Poison Nova when struck" },
      { text: "Level 3 Venom (20 Charges)" },
      { text: "+100-150% Enhanced Defense", variable: true },
    ],
    drop: {
      summary:
        "Hell only, and one of the higher required levels in the game at 83. Traded rather than farmed.",
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "**The −30% fire resistance is not a footnote.** Hell already applies −100, so this helm has to be paid for somewhere else before it goes on — an Um rune in a shield, a resistance charm row, or simply not wearing it in a fire-heavy zone. What it buys is the best attack-speed-plus-skills helm an attacking character can wear, and the life steal is what keeps a melee Amazon standing without a Life Tap source. Socket it with an Um for the resistance it took away, or a 15% attack speed jewel if you can afford the resistance elsewhere.",
    alternatives: [{ kind: "unique", slug: "vampire-gaze" }],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Bows, crossbows and Amazon weapons
  //
  // Verified against the pinned blizzhackers/d2data extraction
  // (fc46999, patch 3.3), `json/uniqueitems.json` joined to `json/weapons.json`
  // for the base's requirements and socket ceiling. See docs/sources/README.md.
  // -------------------------------------------------------------------------
  {
    slug: "titans-revenge",
    name: "Titan's Revenge",
    summary:
      "+2 Amazon skills and +2 Javelin and Spear skills on a javelin that refills itself. The javelin Amazon's weapon for most of her life.",
    quality: "unique",
    base: "Ceremonial Javelin",
    category: "javelin",
    tier: "exceptional",
    slots: ["weapon"],
    requiredLevel: 42,
    requiredStrength: 25,
    requiredDexterity: 109,
    stats: [
      { text: "+2 to Amazon Skill Levels", notable: true },
      { text: "+2 to Javelin and Spear Skills (Amazon Only)", notable: true },
      { text: "Replenishes Quantity", notable: true },
      { text: "+150-200% Enhanced Damage", variable: true },
      { text: "+30% Faster Run/Walk" },
      { text: "+20 to Strength" },
      { text: "+20 to Dexterity" },
      { text: "5-9% Life Stolen per Hit", variable: true },
      { text: "Adds 25-50 Damage" },
      { text: "Increased Stack Size (60)" },
    ],
    drop: {
      summary:
        "Drops from Hell and late Nightmare content, and is one of the most commonly traded Amazon items in the game because every javelin build wants one.",
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "Replenishes Quantity is the line that matters most day to day: a javelin build throws its weapon, and without self-refill you are picking javelins off the floor between packs. The four skill levels it carries — two class-wide and two more on the Javelin and Spear tab — are worth more than any raw damage a rare javelin can roll.",
    alternatives: [{ kind: "unique", slug: "thunderstroke" }],
    confidence: "verified",
  },
  {
    slug: "thunderstroke",
    name: "Thunderstroke",
    summary:
      "The only Amazon weapon that lowers enemy lightning resistance. The lightning javelin's endgame, and it does not replenish.",
    quality: "unique",
    base: "Matriarchal Javelin",
    category: "javelin",
    tier: "elite",
    slots: ["weapon"],
    requiredLevel: 69,
    requiredStrength: 107,
    requiredDexterity: 151,
    stats: [
      { text: "-15% to Enemy Lightning Resistance", notable: true },
      { text: "+2-4 to Javelin and Spear Skills (Amazon Only)", variable: true, notable: true },
      { text: "+3 to Lightning Bolt (Amazon Only)" },
      { text: "Adds 1-511 Lightning Damage", notable: true },
      // `hit-skill par=Lightning min=20 max=14`: min is the chance, max is the
      // skill level. Published the other way round until the audit caught it —
      // the four items the decoder was calibrated against carry no
      // cast-on-striking line at all, so nothing exercised this column's order.
      { text: "20% Chance to cast level 14 Lightning on striking" },
      { text: "+150-200% Enhanced Damage", variable: true },
      { text: "+15% Increased Attack Speed" },
    ],
    drop: {
      summary:
        "A Hell-only drop and a genuinely rare one. Most Amazons buy it rather than find it.",
      tradeability: "rare",
      confidence: "verified",
    },
    notes:
      "The −15% enemy lightning resistance is applied only to targets that are not immune, exactly as Griffon's Eye is, which makes this the one piece of Amazon gear that helps against lightning immunity rather than merely against resistance. It carries **no Replenishes Quantity**, so a Thunderstroke Amazon either buys the perfect-roll version and accepts refilling by hand, or keeps a Titan's Revenge on the swap for clearing. That trade-off is the whole decision between the two javelins.",
    alternatives: [{ kind: "unique", slug: "titans-revenge" }],
    confidence: "verified",
  },
  {
    slug: "windforce",
    name: "Windforce",
    summary:
      "The highest-damage bow in the game, on a base that fires fast. Knockback is both its signature and its main drawback.",
    quality: "unique",
    base: "Hydra Bow",
    category: "bow",
    tier: "elite",
    slots: ["weapon"],
    requiredLevel: 73,
    requiredStrength: 134,
    requiredDexterity: 167,
    maxSockets: 6,
    stats: [
      { text: "+250% Enhanced Damage", notable: true },
      {
        text: "+3.125 to Maximum Damage per Character Level",
        notable: true,
      },
      { text: "+20% Increased Attack Speed", notable: true },
      { text: "Knockback", notable: true },
      { text: "6-8% Mana Stolen per Hit", variable: true },
      { text: "+10 to Strength" },
      { text: "+5 to Dexterity" },
      { text: "Heal Stamina Plus 30%" },
    ],
    drop: {
      summary:
        "Hell only, and among the rarer elite bows. Usually traded rather than found.",
      tradeability: "rare",
      confidence: "verified",
    },
    notes:
      "At level 90 the per-level line alone is worth about 281 maximum damage, which is why this out-damages every other bow by a wide margin. **Knockback is not free.** It pushes a target out of a Strafe sequence and out of the middle of a Multiple Shot cone, so on those two skills it costs you hits; against a boss standing still it costs you nothing and buys safety. Players who dislike it use a Faith bow instead and accept the lower ceiling.",
    alternatives: [{ kind: "runeword", slug: "faith" }],
    confidence: "verified",
  },
  {
    slug: "buriza-do-kyanon",
    name: "Buriza-Do Kyanon",
    summary:
      "100% Piercing Attack with no skill points spent. A crossbow that solves pierce outright, at the cost of speed.",
    quality: "unique",
    base: "Balista",
    category: "crossbow",
    tier: "exceptional",
    slots: ["weapon"],
    requiredLevel: 41,
    requiredStrength: 110,
    requiredDexterity: 80,
    maxSockets: 6,
    stats: [
      { text: "100% Piercing Attack", notable: true },
      { text: "+80% Increased Attack Speed", notable: true },
      { text: "+150-200% Enhanced Damage", variable: true },
      { text: "+2.5 to Maximum Damage per Character Level", notable: true },
      { text: "Adds 32-196 Cold Damage" },
      { text: "Freezes Target +3" },
      { text: "+35 to Dexterity" },
      { text: "+75-150 Defense", variable: true },
    ],
    drop: {
      summary:
        "Available from late Nightmare onward and widely traded. One of the cheapest genuinely endgame-capable weapons in the game.",
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "The 80% attack speed is on a crossbow base, and crossbows are slow enough that the number is smaller than it looks — a Balista with 80% still fires more slowly than most bows with none. What you are buying is **100% Piercing Attack for free**, which lets a levelling Amazon skip Pierce entirely and spend those points elsewhere. The cold damage also chills, which is a real defensive line on a character with no shield up while shooting.",
    confidence: "verified",
  },
  {
    slug: "widowmaker",
    name: "Widowmaker",
    summary:
      "Ignore Target's Defense and 33% Deadly Strike on a light bow base. The cheap answer to a bow build's attack rating problem.",
    quality: "unique",
    base: "Ward Bow",
    category: "bow",
    tier: "elite",
    slots: ["weapon"],
    requiredLevel: 65,
    requiredStrength: 72,
    requiredDexterity: 146,
    maxSockets: 5,
    stats: [
      { text: "Ignore Target's Defense", notable: true },
      { text: "33% Deadly Strike", notable: true },
      { text: "+150-200% Enhanced Damage", variable: true },
      { text: "+3-5 to Guided Arrow", variable: true },
      { text: "Fires Magic Arrows (Level 11)" },
    ],
    drop: {
      summary: "A Hell drop, and uncommon rather than rare. Cheap to buy.",
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "Ignore Target's Defense removes the attack-rating roll against normal monsters entirely, which is worth more on a bow Amazon than the raw damage of a bigger base — a missed arrow does no damage at all. The 72 Strength requirement is the lowest of any elite bow, so this fits a stat plan that a Hydra Bow does not. **The +3-5 to Guided Arrow is not a reason to buy it** on a Strafe or Multiple Shot plan; treat it as a bonus, not a build.",
    confidence: "verified",
  },
  {
    slug: "eaglehorn",
    name: "Eaglehorn",
    summary:
      "+1 Amazon skills, Ignore Target's Defense, and damage that grows with your level. The bow to socket.",
    quality: "unique",
    base: "Crusader Bow",
    category: "bow",
    tier: "elite",
    slots: ["weapon"],
    requiredLevel: 69,
    requiredStrength: 97,
    requiredDexterity: 121,
    maxSockets: 6,
    stats: [
      { text: "+1 to Amazon Skill Levels", notable: true },
      { text: "Ignore Target's Defense", notable: true },
      { text: "+200% Enhanced Damage", notable: true },
      { text: "+2% Enhanced Damage per Character Level", variable: true, notable: true },
      { text: "+1.5 to Attack Rating per Character Level" },
      { text: "+25 to Dexterity" },
    ],
    drop: {
      summary: "Hell only, and uncommon. Traded steadily because several builds want it.",
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "The two per-level lines are what make this scale: at level 90 the enhanced damage is 200% plus roughly 180% more, and the attack rating is up another 135. It is also the bow a Bowazon most often sockets — six sockets on an elite base with +1 skills is the cheapest route to stacking damage jewels or an Amn rune for leech.",
    alternatives: [{ kind: "unique", slug: "widowmaker" }],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Body armor
  // -------------------------------------------------------------------------
  {
    slug: "skin-of-the-vipermagi",
    name: "Skin of the Vipermagi",
    summary:
      "+1 skills, 30% Faster Cast Rate and up to +35 all resistances at level 29. The best budget caster armor in the game.",
    quality: "unique",
    base: "Serpentskin Armor",
    category: "body-armor",
    tier: "exceptional",
    slots: ["body"],
    requiredLevel: 29,
    requiredStrength: 43,
    maxSockets: 4,
    stats: [
      { text: "+1 to All Skills", notable: true },
      { text: "+30% Faster Cast Rate", notable: true },
      { text: "All Resistances +20-35", variable: true, notable: true },
      { text: "+120% Enhanced Defense" },
      { text: "Magic Damage Reduced by 9-13", variable: true },
    ],
    drop: {
      summary:
        "Area level 36+, so it can drop from late Normal onwards. One of the most reliably found useful uniques in the game.",
      areas: ["countess", "andariel", "mephisto"],
      minMonsterLevel: 36,
      tradeability: "abundant",
      confidence: "verified",
    },
    notes:
      "30% Faster Cast Rate in the armor slot is rare, and at only 43 Strength it costs a Sorceress almost nothing. This is the armor that carries most casters from level 29 until a Chains of Honor or Enigma.",
    alternatives: [
      { kind: "runeword", slug: "stealth" },
      { kind: "runeword", slug: "chains-of-honor" },
    ],
    confidence: "verified",
  },
  {
    slug: "ormus-robes",
    name: "Ormus' Robes",
    summary:
      "A random +1-3 to one specific skill, plus up to +15% damage to fire, lightning and cold skills.",
    quality: "unique",
    base: "Dusk Shroud",
    category: "body-armor",
    tier: "elite",
    slots: ["body"],
    requiredLevel: 75,
    requiredStrength: 77,
    maxSockets: 3,
    stats: [
      { text: "+1-3 to a random single skill (class-specific)", variable: true, notable: true },
      { text: "+10-15% to Cold Skill Damage", variable: true, notable: true },
      { text: "+10-15% to Fire Skill Damage", variable: true },
      { text: "+10-15% to Lightning Skill Damage", variable: true },
      { text: "+20% Faster Cast Rate" },
      { text: "Regenerate Mana 10-15%", variable: true },
      { text: "Defense: 361-467", variable: true },
    ],
    drop: {
      summary: "Area level 65+. The value depends entirely on the random skill roll.",
      minMonsterLevel: 65,
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "A Blizzard roll on Ormus' Robes is one of the largest single damage upgrades available to the build. Any other roll makes it a mediocre armor. This is the definitive 'check the roll before you trade for it' item.",
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Gloves, belts, boots
  // -------------------------------------------------------------------------
  {
    slug: "magefist",
    name: "Magefist",
    summary:
      "20% Faster Cast Rate and mana regeneration at level 23. The cheapest FCR in the game.",
    quality: "unique",
    base: "Light Gauntlets",
    category: "gloves",
    tier: "exceptional",
    slots: ["gloves"],
    requiredLevel: 23,
    requiredStrength: 45,
    stats: [
      { text: "+20% Faster Cast Rate", notable: true },
      { text: "+1 to Fire Skills" },
      { text: "Regenerate Mana 25%", notable: true },
      { text: "+20-30% Enhanced Defense", variable: true },
      { text: "+10 Defense" },
      { text: "Adds 1-6 Fire Damage" },
    ],
    drop: {
      summary:
        "Area level 20+. Cheap, abundant, and available from the middle of Normal difficulty.",
      minMonsterLevel: 20,
      gamblable: true,
      tradeability: "abundant",
      confidence: "verified",
    },
    notes:
      "20% Faster Cast Rate for essentially nothing. Every caster wears these until they find something with FCR *and* resistances. The +1 Fire Skills is wasted on a cold build but the FCR is not.",
    confidence: "verified",
  },
  {
    slug: "frostburn",
    name: "Frostburn",
    summary: "+40% maximum mana. An Energy Shield item, not a general-purpose one.",
    quality: "unique",
    base: "Gauntlets",
    category: "gloves",
    tier: "normal",
    slots: ["gloves"],
    requiredLevel: 29,
    requiredStrength: 60,
    stats: [
      { text: "Increase Maximum Mana 40%", notable: true },
      { text: "Adds 1-6 Cold Damage" },
      { text: "+10-20% Enhanced Defense", variable: true },
      { text: "+30 Defense" },
      { text: "+5% Enhanced Damage" },
    ],
    drop: {
      summary: "Area level 27+. Common.",
      minMonsterLevel: 27,
      tradeability: "abundant",
      confidence: "verified",
    },
    notes:
      "No Faster Cast Rate, which is why most Sorceresses prefer Magefist. Frostburn is for Energy Shield builds where the mana pool *is* the health pool.",
    confidence: "verified",
  },
  {
    slug: "arachnid-mesh",
    name: "Arachnid Mesh",
    summary:
      "+1 to All Skills and 20% Faster Cast Rate in the belt slot. Effectively mandatory on endgame casters.",
    quality: "unique",
    base: "Spiderweb Sash",
    category: "belt",
    tier: "elite",
    slots: ["belt"],
    requiredLevel: 80,
    requiredStrength: 50,
    stats: [
      { text: "+1 to All Skills", notable: true },
      { text: "+20% Faster Cast Rate", notable: true },
      { text: "Increase Maximum Mana 5%" },
      { text: "Slows Target by 10%" },
      { text: "+90-120% Enhanced Defense", variable: true },
      { text: "Level 3 Venom (11/11 Charges)" },
    ],
    drop: {
      summary:
        "Area level 61+, but its level 80 requirement means you cannot use it until very late. Widely traded.",
      minMonsterLevel: 61,
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "The only belt in the game with both +skills and Faster Cast Rate, which is why almost every caster FCR plan assumes it. Only 12 potion slots, versus 16 on a full belt — a real trade-off.",
    confidence: "verified",
  },
  {
    slug: "war-traveler",
    name: "War Traveler",
    summary: "Up to 50% magic find on boots, plus Strength and Vitality.",
    quality: "unique",
    base: "Battle Boots",
    category: "boots",
    tier: "exceptional",
    slots: ["boots"],
    requiredLevel: 42,
    requiredStrength: 95,
    stats: [
      { text: "30-50% Better Chance of Getting Magic Items", variable: true, notable: true },
      { text: "+25% Faster Run/Walk" },
      { text: "+10 to Strength" },
      { text: "+10 to Vitality" },
      { text: "+150-190% Enhanced Defense", variable: true },
      { text: "Adds 15-25 Damage" },
      { text: "40% Slower Stamina Drain" },
      { text: "Attacker Takes Damage of 5-10", variable: true },
    ],
    drop: {
      summary: "Area level 49+. Common and heavily traded.",
      minMonsterLevel: 49,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "95 Strength is a real cost for a Sorceress — roughly 40 stat points that could have been Vitality. Worth it on a dedicated magic-find setup, questionable otherwise. The +10 Strength it grants offsets part of its own requirement.",
    alternatives: [{ kind: "unique", slug: "sandstorm-trek" }],
    confidence: "verified",
  },
  {
    slug: "sandstorm-trek",
    name: "Sandstorm Trek",
    summary:
      "20% Faster Hit Recovery, Strength, Vitality and large poison resistance. The survivability boot.",
    quality: "unique",
    base: "Scarabshell Boots",
    category: "boots",
    tier: "elite",
    slots: ["boots"],
    requiredLevel: 64,
    requiredStrength: 91,
    stats: [
      { text: "+20% Faster Hit Recovery", notable: true },
      { text: "+20% Faster Run/Walk" },
      { text: "+10-15 to Strength", variable: true, notable: true },
      { text: "+10-15 to Vitality", variable: true },
      { text: "Poison Resist +40-70%", variable: true },
      { text: "+140-170% Enhanced Defense", variable: true },
      { text: "50% Slower Stamina Drain" },
      { text: "Repairs 1 durability in 5 seconds" },
    ],
    drop: {
      summary: "Area level 66+. Uncommon but not rare.",
      minMonsterLevel: 66,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "The Faster Hit Recovery is what matters: it is often the cheapest way to reach a Sorceress FHR breakpoint, and the +Strength helps pay for a Monarch shield.",
    confidence: "verified",
  },

  {
    slug: "draculs-grasp",
    name: "Dracul's Grasp",
    summary:
      "Life Tap on striking, with no skill point spent. The single item that makes a Smiter survive Uber Mephisto.",
    quality: "unique",
    base: "Vampirebone Gloves",
    category: "gloves",
    tier: "elite",
    slots: ["gloves"],
    requiredLevel: 76,
    requiredStrength: 50,
    stats: [
      {
        text: "5% Chance to cast level 10 Life Tap on striking",
        notable: true,
      },
      { text: "7-10% Life Stolen per Hit", variable: true, notable: true },
      { text: "25% Chance of Open Wounds" },
      { text: "+90-120% Enhanced Defense", variable: true },
      { text: "+5-10 Life after each Kill", variable: true },
      { text: "+10-15 to Strength", variable: true },
    ],
    drop: {
      summary:
        "Area level 84+, which in practice means Hell area level 85 farming. Always in demand.",
      minMonsterLevel: 84,
      tradeability: "rare",
      confidence: "verified",
    },
    notes:
      "Life Tap is the point. It converts your damage into healing for the duration, which is what carries a melee character through a fight it could not otherwise out-heal. The 5% chance sounds low until you remember Smite and Zeal hit several times a second.",
    alternatives: [{ kind: "runeword", slug: "exile" }],
    confidence: "verified",
  },
  {
    slug: "gore-rider",
    name: "Gore Rider",
    summary:
      "15% Crushing Blow, 15% Deadly Strike and 10% Open Wounds on one pair of boots. The default melee boot.",
    quality: "unique",
    base: "War Boots",
    category: "boots",
    tier: "elite",
    slots: ["boots"],
    requiredLevel: 47,
    requiredStrength: 94,
    stats: [
      { text: "15% Chance of Crushing Blow", notable: true },
      { text: "15% Deadly Strike", notable: true },
      { text: "+30% Faster Run/Walk", notable: true },
      { text: "10% Chance of Open Wounds" },
      { text: "+160-200% Enhanced Defense", variable: true },
      { text: "Requirements -25%" },
      { text: "+20 Maximum Stamina" },
      { text: "+10 Maximum Durability" },
    ],
    drop: {
      summary:
        "Area level 55+. Common enough to find while levelling and cheap to trade for.",
      minMonsterLevel: 55,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "The strength requirement shown is after the item's own -25% requirement reduction; the War Boots base itself asks for 125. Deadly Strike does nothing for a Smiter — Smite ignores it — but the Crushing Blow alone still justifies the slot.",
    confidence: "verified",
  },

  {
    slug: "razortail",
    name: "Razortail",
    summary:
      "33% Piercing Attack in a belt slot. The cheapest pierce on the site, and the reason Lightning Fury works before Pierce is maxed.",
    quality: "unique",
    base: "Sharkskin Belt",
    category: "belt",
    tier: "exceptional",
    slots: ["belt"],
    requiredLevel: 32,
    requiredStrength: 20,
    stats: [
      { text: "33% Piercing Attack", notable: true },
      { text: "+15 to Dexterity", notable: true },
      { text: "+120-150% Enhanced Defense", variable: true },
      { text: "+10 to Maximum Damage" },
      { text: "+15 Defense" },
      { text: "+1 Attacker Takes Damage per Character Level" },
    ],
    drop: {
      summary:
        "Available from Nightmare onward, abundant, and cheap to buy. One of the best value items in the game for the builds that want it.",
      tradeability: "abundant",
      confidence: "verified",
    },
    notes:
      "Pierce from gear and pierce from the skill are one pool, and this is 33 points of it for a belt slot and 20 Strength. On Lightning Fury that is not a damage increase of 33% — every enemy the javelin passes through releases another burst of bolts, so it multiplies. It is equally load-bearing on a bow build, where an arrow that pierces hits the row behind the one you aimed at. **It is worth nothing at all to Charged Strike, Lightning Strike, Jab or Fend**, which are melee attacks that never fire a projectile.",
    confidence: "verified",
  },
  {
    slug: "thundergods-vigor",
    name: "Thundergod's Vigor",
    summary:
      "+3 to Lightning Strike and +3 to Lightning Fury, plus the lightning absorb that keeps a javelin Amazon alive in her own element.",
    quality: "unique",
    base: "War Belt",
    category: "belt",
    tier: "exceptional",
    slots: ["belt"],
    requiredLevel: 47,
    requiredStrength: 110,
    stats: [
      { text: "+3 to Lightning Fury (Amazon Only)", notable: true },
      { text: "+3 to Lightning Strike (Amazon Only)", notable: true },
      { text: "+10% to Maximum Lightning Resist", notable: true },
      { text: "+20 Lightning Absorb", notable: true },
      { text: "Adds 1-50 Lightning Damage" },
      { text: "5% Chance to cast level 7 Fist of the Heavens when struck" },
      { text: "+160-200% Enhanced Defense", variable: true },
      { text: "+20 to Strength" },
      { text: "+20 to Vitality" },
    ],
    drop: {
      summary:
        "Drops from Nightmare onward and trades cheaply, because only the javelin Amazon really wants it.",
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "Six skill levels split across the two skills a javelin Amazon actually presses, in a slot whose competition is a belt with resistances. The 110 Strength requirement is the real price and it is not small on a character who also has to reach a shield. The lightning absorb and the raised maximum lightning resistance are the other half of the argument: **lightning enchanted packs are what kill javelin Amazons**, and this belt is the cheapest answer to them.",
    alternatives: [{ kind: "unique", slug: "razortail" }],
    confidence: "verified",
  },
  {
    slug: "waterwalk",
    name: "Waterwalk",
    summary:
      "Life, Dexterity and a raised maximum fire resistance on a light boot. The defensive alternative to magic-find boots.",
    quality: "unique",
    base: "Sharkskin Boots",
    category: "boots",
    tier: "exceptional",
    slots: ["boots"],
    requiredLevel: 32,
    requiredStrength: 47,
    stats: [
      { text: "+45-65 to Life", variable: true, notable: true },
      { text: "+15 to Dexterity", notable: true },
      { text: "+5% to Maximum Fire Resist", notable: true },
      { text: "+20% Faster Run/Walk" },
      { text: "+180-210% Enhanced Defense", variable: true },
      { text: "+100 Defense vs. Missile" },
      { text: "+40 to Stamina" },
      { text: "Heal Stamina Plus 50%" },
    ],
    drop: {
      summary: "Nightmare onward, abundant and cheap.",
      tradeability: "abundant",
      confidence: "verified",
    },
    notes:
      "The Dexterity counts toward maximum block, and on a class that blocks well that makes this quietly better than its stat line reads. The raised maximum fire resistance is the line hardcore players buy it for — 80% instead of 75% is a fifth less damage from every fire source in Hell, and no amount of ordinary resistance gets you there.",
    alternatives: [{ kind: "unique", slug: "gore-rider" }],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Jewellery
  // -------------------------------------------------------------------------
  {
    slug: "the-cats-eye",
    name: "The Cat's Eye",
    summary:
      "Movement, attack speed and Dexterity in one amulet. The physical bow Amazon's default neck slot.",
    quality: "unique",
    base: "Amulet",
    category: "amulet",
    tier: "elite",
    slots: ["amulet"],
    requiredLevel: 50,
    stats: [
      { text: "+20% Increased Attack Speed", notable: true },
      { text: "+30% Faster Run/Walk", notable: true },
      { text: "+25 to Dexterity", notable: true },
      { text: "+100 Defense" },
      { text: "+100 Defense vs. Missile" },
    ],
    drop: {
      summary: "Nightmare onward, common, and cheap to buy.",
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "No skills at all, which is why it is not on a caster's list. What it is instead is the cheapest 20% attack speed on the site paired with 25 Dexterity, and on a bow build both of those turn directly into damage — Dexterity raises attack rating and the base damage of every arrow. The 30% Faster Run/Walk is the reason a Bowazon wearing it plays differently: this class kites, and movement is a defensive stat.",
    alternatives: [{ kind: "unique", slug: "highlords-wrath" }],
    confidence: "verified",
  },
  {
    slug: "atmas-scarab",
    name: "Atma's Scarab",
    summary:
      "Amplify Damage on striking. The one amulet that answers physical immunity without spending a charm slot.",
    quality: "unique",
    base: "Amulet",
    category: "amulet",
    tier: "elite",
    slots: ["amulet"],
    requiredLevel: 60,
    stats: [
      { text: "5% Chance to cast level 2 Amplify Damage on striking", notable: true },
      { text: "Poison Resist +75%", notable: true },
      { text: "+102 Poison Damage over 4 seconds" },
      { text: "20% Bonus to Attack Rating" },
      { text: "Attacker Takes Damage of 5" },
      { text: "+3 to Light Radius" },
    ],
    drop: {
      summary: "Nightmare onward. Uncommon, and traded steadily for the curse alone.",
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "**Amplify Damage halves the target's physical resistance, and against a physical immune that is often enough to break the immunity outright.** Five percent per hit sounds small until you count the hits: Strafe fires up to ten arrows in a burst and Fend strikes every adjacent enemy in one sequence, so a multi-hit physical build applies it constantly. On a single-hit build it is unreliable and the amulet is not worth the slot. Poison Resist +75% is the other half of the case, and it is a real line in the Hell zones full of poison.",
    confidence: "verified",
  },
  {
    slug: "stone-of-jordan",
    name: "The Stone of Jordan",
    summary:
      "+1 to All Skills and +25% maximum mana. The reference trade currency for two decades.",
    quality: "unique",
    base: "Ring",
    category: "ring",
    tier: "normal",
    slots: ["ring1", "ring2"],
    requiredLevel: 29,
    stats: [
      { text: "+1 to All Skills", notable: true },
      { text: "Increase Maximum Mana 25%", notable: true },
      { text: "+20 to Mana" },
      { text: "+1 to Minimum Lightning Damage" },
      { text: "+12 to Maximum Lightning Damage" },
    ],
    drop: {
      summary:
        "Rings have no level-gated base, so a Stone of Jordan can drop almost anywhere — but it is genuinely rare. Most players trade for one.",
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "Selling a Stone of Jordan to a vendor advances your server's Diablo Clone progress by one. Offline, selling one spawns Diablo Clone immediately. You cannot buy it back, so do not sell one by accident.",
    confidence: "verified",
  },
  {
    slug: "nagelring",
    name: "Nagelring",
    summary: "Up to 30% magic find at level 7. The first magic find item most characters own.",
    quality: "unique",
    base: "Ring",
    category: "ring",
    tier: "normal",
    slots: ["ring1", "ring2"],
    requiredLevel: 7,
    stats: [
      { text: "15-30% Better Chance of Getting Magic Items", variable: true, notable: true },
      { text: "+50-75 to Attack Rating", variable: true },
      { text: "Magic Damage Reduced by 3" },
      { text: "Attacker Takes Damage of 3" },
    ],
    drop: {
      summary: "Available from very early Normal, and commonly gambled.",
      gamblable: true,
      tradeability: "abundant",
      confidence: "verified",
    },
    notes:
      "Two Nagelrings is 60% magic find at level 7. A genuinely good early choice for a magic-find character, and worthless later.",
    confidence: "verified",
  },
  {
    slug: "maras-kaleidoscope",
    name: "Mara's Kaleidoscope",
    summary:
      "+2 to All Skills and up to +30 all resistances. The default endgame caster amulet.",
    quality: "unique",
    base: "Amulet",
    category: "amulet",
    tier: "elite",
    slots: ["amulet"],
    requiredLevel: 67,
    stats: [
      { text: "+2 to All Skills", notable: true },
      { text: "All Resistances +20-30", variable: true, notable: true },
      { text: "+5 to Strength, Dexterity, Vitality and Energy" },
    ],
    drop: {
      summary:
        "Amulets are not level-gated by base, so it can drop from any sufficiently high monster. Widely traded.",
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "Simple and hard to beat. A crafted or rare amulet can exceed it if it rolls +2 class skills together with Faster Cast Rate — Mara's has no FCR at all, which is its one real weakness in an FCR-tight setup.",
    confidence: "verified",
  },

  {
    slug: "raven-frost",
    name: "Raven Frost",
    summary:
      "Cannot Be Frozen in a ring slot, plus Dexterity and Attack Rating. Effectively mandatory for melee.",
    quality: "unique",
    base: "Ring",
    category: "ring",
    tier: "elite",
    slots: ["ring1", "ring2"],
    requiredLevel: 45,
    stats: [
      { text: "Cannot Be Frozen", notable: true },
      { text: "+15-20 to Dexterity", variable: true, notable: true },
      { text: "+150-250 to Attack Rating", variable: true },
      { text: "Adds 15-45 Cold Damage" },
      { text: "Cold Absorb 20%" },
      { text: "+40 to Mana" },
    ],
    drop: {
      summary:
        "Area level 53+. Common, and the cheapest solution to a problem every melee character has.",
      minMonsterLevel: 53,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "Chilled attack speed is the quiet killer of melee characters, and it is worst for Zeal, whose attack sequence locks you in place while it plays out. Cannot Be Frozen removes that entirely. The Dexterity roll also counts toward maximum block, so it pays twice.",
    confidence: "verified",
  },
  {
    slug: "highlords-wrath",
    name: "Highlord's Wrath",
    summary:
      "+1 all skills, 20% Increased Attack Speed and Deadly Strike that scales with level. The melee amulet.",
    quality: "unique",
    base: "Amulet",
    category: "amulet",
    tier: "elite",
    slots: ["amulet"],
    requiredLevel: 65,
    stats: [
      { text: "+1 to All Skills", notable: true },
      { text: "+20% Increased Attack Speed", notable: true },
      {
        text: "+0.375% Deadly Strike per Character Level",
        notable: true,
      },
      { text: "Lightning Resist +35%" },
      { text: "Adds 1-30 Lightning Damage" },
      { text: "Attacker Takes Lightning Damage of 15" },
    ],
    drop: {
      summary: "Area level 73+. Uncommon but widely traded.",
      minMonsterLevel: 73,
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "At level 90 the Deadly Strike roll is worth about 34%, which is why the amulet gets better the longer you play it. Worth knowing that Deadly Strike does nothing at all for a Smiter — for that build the amulet is only its +1 skills and attack speed.",
    alternatives: [{ kind: "unique", slug: "maras-kaleidoscope" }],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Sunder Charms
  //
  // Catalogued rather than named in prose, because a build whose immunity plan
  // is a charm needs the charm's own cost on a page of its own. Every line here
  // is the pinned blizzhackers/d2data extraction (fc46999, patch 3.3),
  // `json/uniqueitems.json`: one `pierce-immunity-*` property and one penalty
  // to the carrier, and nothing else. Five of the six are here; the magic one,
  // Black Cleft, is not, because no build on the site deals magic damage.
  // -------------------------------------------------------------------------
  {
    slug: "bone-break",
    name: "Bone Break",
    summary:
      "Sunders physical immunity, and takes 10 to 20 points off your own physical damage reduction to do it.",
    quality: "unique",
    base: "Grand Charm",
    category: "charm",
    tier: "normal",
    slots: [],
    requiredLevel: 75,
    stats: [
      { text: "Monster Physical Immunity is Sundered", notable: true },
      { text: "-10 to -20% Physical Damage Reduction", variable: true, notable: true },
    ],
    drop: {
      summary:
        "Hell only. Drops from the Terror Zone Herald at any level, or from ordinary monsters at a much reduced rate since patch 3.3 raised the minimum drop level to 75.",
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "**Its penalty is unlike the other five.** The elemental Sunder Charms cost you 70 to 90 points of one resistance, which a resistance-stacked character can partly absorb. This one instead subtracts from your physical damage reduction, and physical damage is what melee monsters deal — so the charm that lets a physical build hurt a physical immune is also the charm that makes every ordinary hit land harder. On a Jab and Fend Amazon standing in melee range, that is the trade to think hardest about; on a bow Amazon at range it costs far less. Carry it for the zones that need it and leave it in the stash otherwise.",
    confidence: "verified",
  },
  {
    slug: "crack-of-the-heavens",
    name: "Crack of the Heavens",
    summary:
      "Sunders lightning immunity, at 70 to 90 points of your own lightning resistance.",
    quality: "unique",
    base: "Grand Charm",
    category: "charm",
    tier: "normal",
    slots: [],
    requiredLevel: 75,
    stats: [
      { text: "Monster Lightning Immunity is Sundered", notable: true },
      { text: "Lightning Resist -70 to -90%", variable: true, notable: true },
    ],
    drop: {
      summary:
        "Hell only, from the Terror Zone Herald or at a reduced rate from ordinary monsters above level 75.",
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "The most expensive of the six to carry, for a reason that has nothing to do with its number: **lightning enchanted monsters are the ones that kill lightning characters**, and this charm removes most of the resistance that protects you from them. A javelin Amazon carrying it is standing in the middle of packs with 70 to 90 points less lightning resistance than she thinks she has. Infinity on the mercenary does the same job with no penalty at all, and costs a Ber and a Jah.",
    confidence: "verified",
  },
  {
    slug: "cold-rupture",
    name: "Cold Rupture",
    summary: "Sunders cold immunity, at 70 to 90 points of your own cold resistance.",
    quality: "unique",
    base: "Grand Charm",
    category: "charm",
    tier: "normal",
    slots: [],
    requiredLevel: 75,
    stats: [
      { text: "Monster Cold Immunity is Sundered", notable: true },
      { text: "Cold Resist -70 to -90%", variable: true, notable: true },
    ],
    drop: {
      summary:
        "Hell only, from the Terror Zone Herald or at a reduced rate from ordinary monsters above level 75.",
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "The cheapest of the six to carry in practice, because cold damage in Hell mostly arrives as a chill rather than as the thing that kills you. It is what turns the Pit and the Worldstone Keep — both area level 85, and both recording cold among their immunities — into zones a cold build can farm rather than pick around.",
    confidence: "verified",
  },
  {
    slug: "flame-rift",
    name: "Flame Rift",
    summary: "Sunders fire immunity, at 70 to 90 points of your own fire resistance.",
    quality: "unique",
    base: "Grand Charm",
    category: "charm",
    tier: "normal",
    slots: [],
    requiredLevel: 75,
    stats: [
      { text: "Monster Fire Immunity is Sundered", notable: true },
      { text: "Fire Resist -70 to -90%", variable: true, notable: true },
    ],
    drop: {
      summary:
        "Hell only, from the Terror Zone Herald or at a reduced rate from ordinary monsters above level 75.",
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "Fire is the most commonly resisted element in Hell, which makes this the most frequently carried of the six and the one whose penalty is felt most often. Anything with a fire aura, an Immolation attack or a fire enchantment hurts substantially more while it is in the inventory. Wearing an Andariel's Visage at the same time is 100 to 120 points of fire resistance given away between two items.",
    confidence: "verified",
  },
  {
    slug: "rotting-fissure",
    name: "Rotting Fissure",
    summary: "Sunders poison immunity, at 70 to 90 points of your own poison resistance.",
    quality: "unique",
    base: "Grand Charm",
    category: "charm",
    tier: "normal",
    slots: [],
    requiredLevel: 75,
    stats: [
      { text: "Monster Poison Immunity is Sundered", notable: true },
      { text: "Poison Resist -70 to -90%", variable: true, notable: true },
    ],
    drop: {
      summary:
        "Hell only, from the Terror Zone Herald or at a reduced rate from ordinary monsters above level 75.",
      tradeability: "rare",
      confidence: "verified",
    },
    notes:
      "The least traded of the six, because poison is the least played damage type — which also means it is the one most often missing when a poison build finally needs it. Poison resistance is easy to over-cap from charms and an Atma's Scarab, so the penalty is more absorbable than the fire or lightning equivalents.",
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Shields
  // -------------------------------------------------------------------------
  {
    slug: "stormshield",
    name: "Stormshield",
    summary:
      "35% damage reduction, +30 Strength and huge block. The most defensive shield in the game.",
    quality: "unique",
    base: "Monarch",
    category: "shield",
    tier: "elite",
    slots: ["offhand"],
    requiredLevel: 73,
    requiredStrength: 156,
    maxSockets: 1,
    stats: [
      { text: "Damage Reduced by 35%", notable: true },
      { text: "+30 to Strength", notable: true },
      { text: "25% Increased Chance of Blocking", notable: true },
      { text: "+35% Faster Block Rate" },
      { text: "Cold Resist +60%" },
      { text: "Lightning Resist +25%" },
      { text: "+3.75 Defense per Character Level" },
      { text: "Attacker Takes Lightning Damage of 10" },
      { text: "Indestructible" },
    ],
    drop: {
      summary: "Area level 72+. Uncommon, and always in demand.",
      minMonsterLevel: 72,
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "No +skills and no Faster Cast Rate, so a caster gives up real damage and often an FCR breakpoint to wear it. It is a Hardcore and max-block choice, not a default.",
    alternatives: [{ kind: "runeword", slug: "spirit" }],
    confidence: "verified",
  },

  {
    slug: "lidless-wall",
    name: "Lidless Wall",
    summary:
      "+1 all skills and 20% Faster Cast Rate on a cheap shield, with mana on kill. The budget caster off-hand.",
    quality: "unique",
    base: "Grim Shield",
    category: "shield",
    tier: "exceptional",
    slots: ["offhand"],
    requiredLevel: 41,
    requiredStrength: 58,
    maxSockets: 2,
    stats: [
      { text: "+1 to All Skills", notable: true },
      { text: "+20% Faster Cast Rate", notable: true },
      { text: "+3-5 to Mana after each Kill", variable: true },
      { text: "+80-130% Enhanced Defense", variable: true },
      { text: "Increase Maximum Mana 10%" },
      { text: "+10 to Energy" },
      { text: "+1 to Light Radius" },
    ],
    drop: {
      summary: "Area level 49+. Common, and available well before a Spirit shield is realistic.",
      minMonsterLevel: 49,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "Worth knowing what it is not: a Spirit in a 4-socket shield gives +2 skills and 35% Faster Cast Rate for four Countess runes. Lidless Wall wins only when you cannot find a 4-socket base, or when the mana-on-kill genuinely solves a problem — which on a build with no Energy investment it sometimes does.",
    alternatives: [{ kind: "runeword", slug: "spirit" }],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Paladin
  // -------------------------------------------------------------------------
  {
    slug: "herald-of-zakarum",
    name: "Herald of Zakarum",
    summary:
      "+2 Paladin skills, +2 Combat skills, +50 all resistances and 30% increased blocking. The Paladin's defensive shield.",
    quality: "unique",
    base: "Gilded Shield",
    category: "paladin-shield",
    tier: "exceptional",
    slots: ["offhand"],
    requiredLevel: 42,
    requiredStrength: 89,
    maxSockets: 4,
    stats: [
      { text: "+2 to Paladin Skill Levels", notable: true },
      { text: "+2 to Combat Skills (Paladin only)", notable: true },
      { text: "All Resistances +50", notable: true },
      { text: "30% Increased Chance of Blocking", notable: true },
      { text: "+30% Faster Block Rate" },
      { text: "+150-200% Enhanced Defense", variable: true },
      { text: "+20 to Strength" },
      { text: "+20 to Vitality" },
      { text: "20% Bonus to Attack Rating" },
    ],
    drop: {
      summary:
        "Area level 51+. Common enough to find while progressing through Hell, and cheaply traded.",
      minMonsterLevel: 51,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "+4 effective skill levels to Blessed Hammer in one slot, with resistances and block attached. Its weakness against a Spirit is Faster Cast Rate — Herald has none. Which is correct depends entirely on whether your breakpoint is already covered. Upgrading it to a Zakarum Shield (Ko + Lem + Perfect Diamond) raises the requirement to level 68 and improves its defence.",
    alternatives: [{ kind: "runeword", slug: "spirit" }],
    confidence: "verified",
  },
  {
    slug: "crown-of-ages",
    name: "Crown of Ages",
    summary:
      "+1 skills, 30% Faster Hit Recovery, up to 15% damage reduction and up to two sockets. The Hardcore helm.",
    quality: "unique",
    base: "Corona",
    category: "helm",
    tier: "elite",
    slots: ["helm"],
    requiredLevel: 82,
    requiredStrength: 174,
    maxSockets: 2,
    stats: [
      { text: "+1 to All Skills" },
      { text: "+30% Faster Hit Recovery", notable: true },
      { text: "Damage Reduced by 10-15%", variable: true, notable: true },
      { text: "All Resistances +20-30", variable: true, notable: true },
      { text: "Socketed (1-2)", variable: true },
      { text: "+50% Enhanced Defense" },
      { text: "+100-150 Defense", variable: true },
      { text: "Indestructible" },
    ],
    drop: {
      summary: "Requires an area level 85 zone. Genuinely rare, and always in demand.",
      areas: ["chaos-sanctuary", "worldstone-keep", "pit", "ancient-tunnels"],
      minMonsterLevel: 85,
      tradeability: "rare",
      confidence: "verified",
    },
    notes:
      "The roll spread is enormous: a 2-socket, 15% damage reduction, 30 all-resistance Crown of Ages is worth many times a 1-socket, 10%, 20% one. Its 174 Strength requirement is a real cost. Chosen over a Harlequin Crest when survivability matters more than magic find.",
    alternatives: [{ kind: "unique", slug: "harlequin-crest" }],
    confidence: "verified",
  },
  {
    slug: "duriels-shell",
    name: "Duriel's Shell",
    summary:
      "Cannot Be Frozen, +15 Strength, +1 life per level and strong resistances. A quietly excellent defensive armor.",
    quality: "unique",
    base: "Cuirass",
    category: "body-armor",
    tier: "exceptional",
    slots: ["body"],
    requiredLevel: 41,
    requiredStrength: 65,
    maxSockets: 4,
    stats: [
      { text: "Cannot Be Frozen", notable: true },
      { text: "+15 to Strength", notable: true },
      { text: "+1 to Life per Character Level", notable: true },
      { text: "Cold Resist +50%" },
      { text: "Fire Resist +20%" },
      { text: "Lightning Resist +20%" },
      { text: "Poison Resist +20%" },
      { text: "+160-200% Enhanced Defense", variable: true },
      { text: "+1.25 Defense per Character Level" },
    ],
    drop: {
      summary: "Area level 47+. Common through Nightmare and Hell.",
      minMonsterLevel: 47,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "Cannot Be Frozen in the armor slot is worth more than it looks — it frees your helm and shield from having to provide it, and being chilled slows your cast rate. A strong mercenary armor as well as a player one.",
    confidence: "verified",
  },
  {
    slug: "string-of-ears",
    name: "String of Ears",
    summary:
      "Up to 15% physical damage reduction and 8% life steal, at only 20 Strength.",
    quality: "unique",
    base: "Demonhide Sash",
    category: "belt",
    tier: "exceptional",
    slots: ["belt"],
    requiredLevel: 29,
    requiredStrength: 20,
    stats: [
      { text: "Damage Reduced by 10-15%", variable: true, notable: true },
      { text: "6-8% Life stolen per hit", variable: true, notable: true },
      { text: "Magic Damage Reduced by 10-15", variable: true },
      { text: "+150-180% Enhanced Defense", variable: true },
      { text: "+15 Defense" },
    ],
    drop: {
      summary: "Area level 36+. Very common.",
      minMonsterLevel: 36,
      tradeability: "abundant",
      confidence: "verified",
    },
    notes:
      "Physical damage reduction is multiplicative with other sources and stacks toward the 50% cap, which makes this belt disproportionately good on any character that gets hit. Only 12 potion slots, and no skills or cast rate — a pure survivability pick.",
    alternatives: [{ kind: "unique", slug: "arachnid-mesh" }],
    confidence: "verified",
  },
  {
    slug: "nightsmoke",
    name: "Nightsmoke",
    summary:
      "+10 all resistances and 50% damage-taken-to-mana at level 20. An excellent early belt for a build with no Energy.",
    quality: "unique",
    base: "Belt",
    category: "belt",
    tier: "normal",
    slots: ["belt"],
    requiredLevel: 20,
    requiredStrength: 25,
    stats: [
      { text: "All Resistances +10", notable: true },
      { text: "50% Damage Taken Goes to Mana", notable: true },
      { text: "+20 to Mana" },
      { text: "+30-50% Enhanced Defense", variable: true },
      { text: "Damage Reduced by 2" },
    ],
    drop: {
      summary: "Area level 12+. Available from early Normal, and commonly gambled.",
      minMonsterLevel: 12,
      gamblable: true,
      tradeability: "abundant",
      confidence: "verified",
    },
    notes:
      "Only 8 potion slots, which is its real cost. The damage-to-mana conversion is genuinely useful on a caster with no Energy investment — it turns incoming damage into spell casts.",
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Necromancer class items
  //
  // Decoded from `json/uniqueitems.json` joined to `json/weapons.json` and
  // `json/armor.json` at the pinned commit, and checked against the column
  // semantics in `scripts/item-rules.ts` — which these three exercise more
  // thoroughly than anything else in the catalogue:
  //
  //   - `skilltab.par` is a tree index, not a skill id. Necromancer tabs are
  //     6 (Curses), 7 (Poison and Bone) and 8 (Summoning), and those numbers
  //     are also three Amazon skill ids.
  //   - Arm of King Leoric carries TWO of them, naming two different trees.
  //     Merging them into one line leaves something that reads complete.
  //   - `gethit-skill` is min-is-chance, max-is-level, and Arm of King Leoric
  //     has one of each shape: 5/10 and 10/2. Swapped, the second becomes
  //     "2% chance of level 10", which is exactly as plausible.
  //   - `mana/lvl` carries a raw parameter over a divisor of eight, the same
  //     conversion that turns Harlequin Crest's par=12 into +1.5 life per level.
  //
  // One entity's public name differs from the extraction's — the table spells
  // Death's Web "Deaths's Web" — and it is documented at the point of use
  // rather than silently reconciled. Its five properties agree with the
  // extraction and with the independent sources checked against them, and are
  // pinned positively by `DEATHS_WEB_FIELDS`.
  // -------------------------------------------------------------------------
  {
    slug: "homunculus",
    name: "Homunculus",
    summary:
      "+2 Necromancer skills and +2 Curses on a shield that blocks like a shield. The class's own answer to Spirit.",
    quality: "unique",
    base: "Heirophant Trophy",
    category: "necromancer-head",
    tier: "exceptional",
    slots: ["offhand"],
    requiredLevel: 42,
    requiredStrength: 58,
    maxSockets: 2,
    stats: [
      { text: "+2 to Necromancer Skill Levels", notable: true },
      { text: "+2 to Curses (Necromancer Only)", notable: true },
      { text: "+150-200% Enhanced Defense", variable: true },
      { text: "+40% Increased Chance of Blocking", notable: true },
      { text: "30% Faster Block Rate" },
      { text: "All Resistances +40", notable: true },
      { text: "Regenerate Mana 33%", notable: true },
      { text: "+5 to Mana after each Kill" },
      { text: "+20 to Energy" },
    ],
    drop: {
      summary: "Area level 50+, from Nightmare onward. Common enough to find and cheap to buy.",
      minMonsterLevel: 50,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "**Four skill levels from one slot, and the +40% block is not decoration.** A Necromancer standing behind an army still gets hit by what walks past it, and this is the only class item that pays for that. All Resistances +40 covers most of Hell's −100 on its own, and Regenerate Mana 33% is the largest single mana-recovery line available to the class — which matters more than it sounds when rebuilding an army costs a full bar. **The +2 to Curses raises Amplify Damage and Decrepify together**, and neither wants hard points beyond the first, so this is where their levels come from.",
    alternatives: [{ kind: "runeword", slug: "splendor" }],
    confidence: "verified",
  },
  {
    slug: "deaths-web",
    name: "Death's Web",
    summary:
      "The only item in the game that lowers enemy poison resistance. A poison Necromancer's endgame, and nothing substitutes for it.",
    quality: "unique",
    base: "Unearthed Wand",
    category: "wand",
    tier: "elite",
    slots: ["weapon"],
    requiredLevel: 66,
    requiredStrength: 25,
    maxSockets: 2,
    stats: [
      { text: "-40-50% to Enemy Poison Resistance", variable: true, notable: true },
      { text: "+2 to All Skills", notable: true },
      { text: "+1-2 to Poison and Bone Skills (Necromancer Only)", variable: true, notable: true },
      { text: "+7-12 Life after each Kill", variable: true },
      { text: "+7-12 Mana after each Kill", variable: true },
    ],
    drop: {
      summary:
        "Area level 74+, so Hell only and only in the deepest zones. One of the least commonly found items in the game and priced accordingly.",
      minMonsterLevel: 74,
      tradeability: "very-rare",
      confidence: "verified",
    },
    notes:
      "**−40-50% to Enemy Poison Resistance exists nowhere else.** Poison has no Mastery, so a poison build's only other reduction is Lower Resist — and the two stack, which is the whole reason a Poison Nova Necromancer is a build rather than a novelty. Against a merely resistant monster this is the difference between a slow kill and a fast one. **Against a poison immune it does nothing at all** — a −% to Enemy Resistance line is applied after the immunity check and skipped while the immunity stands, so no roll of this wand has ever broken one. Lower Resist is the half of the pair that can break one: cut to one fifth it reaches 104% from a bare point and 113% at the skill's ceiling, and the wand's full value lands on whatever it opens.\n\n**Read the two skill lines separately.** +2 to All Skills is flat rather than a range, and the +1-2 to Poison and Bone Skills sits on top of it as a second, tree-specific line — so a rolled wand gives a Poison Nova Necromancer three or four effective levels, not two. All five properties were checked against the pinned extraction and against independent sources, and they agree.\n\n**What it does not carry is +% to Poison Skill Damage.** That stat exists, and it comes from a Bramble rather than from here — a wand and a chest armor, so the two stack rather than compete.",
    confidence: "verified",
  },
  {
    slug: "arm-of-king-leoric",
    name: "Arm of King Leoric",
    summary:
      "+2 to two whole skill trees and ten more levels across four named summoning skills. The levelling Summoner's wand, and it arrives at 36.",
    quality: "unique",
    base: "Tomb Wand",
    category: "wand",
    tier: "exceptional",
    slots: ["weapon"],
    requiredLevel: 36,
    requiredStrength: 25,
    maxSockets: 2,
    stats: [
      { text: "+2 to Summoning Skills (Necromancer Only)", notable: true },
      { text: "+2 to Poison and Bone Skills (Necromancer Only)", notable: true },
      { text: "+3 to Raise Skeleton (Necromancer Only)", notable: true },
      { text: "+3 to Skeleton Mastery (Necromancer Only)", notable: true },
      { text: "+2 to Raise Skeletal Mage (Necromancer Only)" },
      { text: "+2 to Terror (Necromancer Only)" },
      { text: "+10% Faster Cast Rate" },
      { text: "10% Chance to cast level 2 Bone Prison when struck" },
      { text: "5% Chance to cast level 10 Bone Spirit when struck" },
      { text: "+1.25 to Mana per Character Level" },
    ],
    drop: {
      summary:
        "Area level 44+, which is late Nightmare. Common, cheap, and routinely handed to a new Necromancer.",
      minMonsterLevel: 44,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "**Read the two tab lines together.** +2 to Summoning stacks with +3 to Raise Skeleton and +3 to Skeleton Mastery, so a level-36 character holding this is raising skeletons at five effective levels above their hard points and making them count at five above too — and the +2 to Poison and Bone raises Corpse Explosion's radius at the same time. Nothing else at this level does both halves of a Summoner at once.\n\nThe two procs fire when *you* are struck rather than when you strike, which suits a character who is not in melee: they are a defensive Bone Prison and an occasional Bone Spirit rather than a damage plan. **This wand is outgrown rather than replaced** — a White gives more to the bone tree and nothing to summoning, and the endgame answer is a rare or crafted wand with +3 to a summoning skill and +Necromancer skills.",
    alternatives: [{ kind: "runeword", slug: "white" }],
    confidence: "verified",
  },
  {
    slug: "arreats-face",
    name: "Arreat's Face",
    summary:
      "The Barbarian's signature helm. +2 to his skills, +2 to Combat Skills, 30% Faster Hit Recovery and all resistances.",
    quality: "unique",
    base: "Slayer Guard",
    category: "barbarian-helm",
    tier: "elite",
    slots: ["helm"],
    requiredLevel: 42,
    requiredStrength: 118,
    maxSockets: 3,
    stats: [
      { text: "+2 to Barbarian Skill Levels", notable: true },
      { text: "+2 to Combat Skills (Barbarian only)", notable: true },
      { text: "30% Faster Hit Recovery", notable: true },
      { text: "All Resistances +30", notable: true },
      { text: "+150-200% Enhanced Defense", variable: true },
      { text: "3-6% Life stolen per hit", variable: true },
      { text: "20% Bonus to Attack Rating" },
      { text: "+20 to Strength" },
      { text: "+20 to Dexterity" },
    ],
    drop: {
      summary: "Area level 50+. A Barbarian-only base, so it drops from the class-item pool rather than the general helm pool.",
      minMonsterLevel: 50,
      tradeability: "common",
      confidence: "verified",
    },
    notes:
      "Four skill levels in one slot — two class-wide and two more on the Combat tab — plus the resistances and the recovery that a melee character otherwise has to buy elsewhere. The `skilltab` index is 12, which is the Barbarian's first tab; the tab indices run three per class in `SkillPage` order, which is how the Necromancer's Curses, Poison and Bone and Summoning come out as 6, 7 and 8.",
    confidence: "verified",
  },

  {
    slug: "verdungos-hearty-cord",
    name: "Verdungo's Hearty Cord",
    summary:
      "Vitality, 10% Faster Hit Recovery and up to 15% physical damage reduction in a belt.",
    quality: "unique",
    base: "Mithril Coil",
    category: "belt",
    tier: "elite",
    slots: ["belt"],
    requiredLevel: 63,
    requiredStrength: 106,
    stats: [
      { text: "Damage Reduced by 10-15%", variable: true, notable: true },
      { text: "+30-40 to Vitality", variable: true, notable: true },
      { text: "10% Faster Hit Recovery", notable: true },
      { text: "+90-140% Enhanced Defense", variable: true },
      { text: "Replenish Life +10-13", variable: true },
      { text: "+100-120 Maximum Stamina", variable: true },
    ],
    drop: {
      summary: "Area level 71+. Hell only in practice.",
      minMonsterLevel: 71,
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "The game's tables spell this **Verdugo's**, with one `n` fewer, and `allstrings-eng.json` publishes **Verdungo's**. The site publishes the name the game shows, as it does everywhere the two disagree.",
    confidence: "verified",
  },

  {
    slug: "goldwrap",
    name: "Goldwrap",
    summary:
      "80% extra gold and 30% magic find in a belt anyone can wear from level 27.",
    quality: "unique",
    base: "Heavy Belt",
    category: "belt",
    tier: "normal",
    slots: ["belt"],
    requiredLevel: 27,
    requiredStrength: 45,
    stats: [
      { text: "50-80% Extra Gold from Monsters", variable: true, notable: true },
      { text: "30% Better Chance of Getting Magic Items", notable: true },
      { text: "10% Increased Attack Speed" },
      { text: "+40-60% Enhanced Defense", variable: true },
      { text: "+25 Defense" },
      { text: "+2 to Light Radius" },
    ],
    drop: {
      summary: "Area level 36+. Cheap, common, and the first gold-find item most characters own.",
      minMonsterLevel: 36,
      tradeability: "common",
      confidence: "verified",
    },
    confidence: "verified",
  },

  {
    slug: "chance-guards",
    name: "Chance Guards",
    summary:
      "200% extra gold and up to 40% magic find, from level 15. The cheapest magic-find gloves in the game.",
    quality: "unique",
    base: "Chain Gloves",
    category: "gloves",
    tier: "normal",
    slots: ["gloves"],
    requiredLevel: 15,
    requiredStrength: 25,
    stats: [
      { text: "200% Extra Gold from Monsters", notable: true },
      { text: "25-40% Better Chance of Getting Magic Items", variable: true, notable: true },
      { text: "+25 to Attack Rating" },
      { text: "+20-30% Enhanced Defense", variable: true },
      { text: "+15 Defense" },
      { text: "+2 to Light Radius" },
    ],
    drop: {
      summary: "Area level 20+. One of the earliest useful uniques there is.",
      minMonsterLevel: 20,
      tradeability: "common",
      confidence: "verified",
    },
    confidence: "verified",
  },

  {
    slug: "metalgrid",
    name: "Metalgrid",
    summary:
      "Defence, attack rating and all resistances in an amulet, plus charges of Iron Golem and Iron Maiden.",
    quality: "unique",
    base: "Amulet",
    category: "amulet",
    tier: "normal",
    slots: ["amulet"],
    requiredLevel: 81,
    stats: [
      { text: "+400-450 to Attack Rating", variable: true, notable: true },
      { text: "All Resistances +25-35", variable: true, notable: true },
      { text: "+300-350 Defense", variable: true },
      { text: "Level 22 Iron Golem (11 Charges)" },
      { text: "Level 12 Iron Maiden (20 Charges)" },
    ],
    drop: {
      summary: "Area level 85. One of the highest-level amulets in the game.",
      minMonsterLevel: 85,
      tradeability: "rare",
      confidence: "verified",
    },
    notes:
      "The two charge lines read backwards from every other skill property on an item. For `charged`, **min is the charge count and max is the level** — `min=11 max=22` is eleven charges of a level 22 Iron Golem, and `min=20 max=12` is twenty charges of a level 12 Iron Maiden. `scripts/item-rules.ts` pins that column's argument order because the sibling `hit-skill` column inverts it.",
    confidence: "verified",
  },

  {
    slug: "gheeds-fortune",
    name: "Gheed's Fortune",
    summary:
      "The magic-find grand charm: up to 40% magic find, 160% extra gold, and cheaper vendors.",
    quality: "unique",
    base: "Grand Charm",
    category: "charm",
    tier: "normal",
    slots: [],
    requiredLevel: 62,
    stats: [
      { text: "20-40% Better Chance of Getting Magic Items", variable: true, notable: true },
      { text: "80-160% Extra Gold from Monsters", variable: true, notable: true },
      { text: "Reduces All Vendor Prices 10-15%", variable: true },
    ],
    drop: {
      summary: "Area level 70+. Hell only, and the roll range is wide enough that a low one is worth little.",
      minMonsterLevel: 70,
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "A charm, so it occupies no equipment slot and works from the inventory. Only one may be equipped at a time — the same restriction the expansion's Colossal Ancients jewels carry.",
    confidence: "verified",
  },
  {
    slug: "ars-al-diablolos",
    name: "Ars Al'Diablolos",
    summary:
      "The Chaos Warlock's best-in-slot Grimoire. +2 to Chaos Skills, +3-5 to Apocalypse, and fire skill damage on top.",
    quality: "unique",
    base: "Blasphemous Grimoire",
    category: "grimoire",
    tier: "elite",
    slots: ["offhand"],
    requiredLevel: 80,
    maxSockets: 2,
    stats: [
      { text: "+2 to Chaos Skills (Warlock only)", notable: true },
      { text: "+3-5 to Apocalypse (Warlock only)", variable: true, notable: true },
      { text: "+15-25% to Fire Skill Damage", variable: true, notable: true },
      { text: "25% Faster Cast Rate", notable: true },
      { text: "Fire Resist +20-30%", variable: true },
      { text: "+170-200% Enhanced Defense", variable: true },
      { text: "15% Chance to cast level 1 Terror when struck" },
      { text: "+5-10 to Mana after each Kill", variable: true },
      { text: "+5-10 to Light Radius", variable: true },
    ],
    drop: {
      summary: "Area level 85. Requires Reign of the Warlock.",
      minMonsterLevel: 85,
      tradeability: "rare",
      confidence: "verified",
    },
    notes:
      "Two skill lines on one item, both class-scoped: `skilltab par=23` is the Warlock's third tab, which is Chaos, and `skill par=Apocalypse` names the capstone directly. The tab indices run three per class in `SkillPage` order, so the Warlock's are 21, 22 and 23 — the same arithmetic that makes the Necromancer's 6, 7 and 8.",
    release: "reign-of-the-warlock",
    confidence: "verified",
  },

  {
    slug: "ars-tor-baalos",
    name: "Ars Tor'Baalos",
    summary:
      "The Demon tree in one off-hand: +2 to Demon Skills and four more skill lines on top of it.",
    quality: "unique",
    base: "Blasphemous Compendium",
    category: "grimoire",
    tier: "elite",
    slots: ["offhand"],
    requiredLevel: 73,
    maxSockets: 2,
    stats: [
      { text: "+2 to Demon Skills (Warlock only)", notable: true },
      { text: "+2-4 to Blood Boil (Warlock only)", variable: true, notable: true },
      { text: "+2-3 to Demonic Mastery (Warlock only)", variable: true, notable: true },
      { text: "+2-3 to Engorge (Warlock only)", variable: true },
      { text: "+2-3 to Consume (Warlock only)", variable: true },
      { text: "+1.5 to Life per Character Level", notable: true },
      { text: "Damage Reduced by 5-10%", variable: true },
      { text: "+120-150% Enhanced Defense", variable: true },
      { text: "15% Chance to cast level 1 Decrepify when struck" },
    ],
    drop: {
      summary: "Area level 85. Requires Reign of the Warlock.",
      minMonsterLevel: 85,
      tradeability: "rare",
      confidence: "verified",
    },
    notes:
      "Four named skills plus the tab, and every one of them is scoped to the class — `item_singleskill` carries `Save Param Bits 3`, so none of it does anything for the other seven. The life line is a raw `par=12` read through the per-level divisor of eight, which is the same conversion Harlequin Crest's is.",
    release: "reign-of-the-warlock",
    confidence: "verified",
  },

  {
    slug: "ars-dul-mephistos",
    name: "Ars Dul'Mephistos",
    summary:
      "The magic-pierce Grimoire: -10-20% to enemy magic resistance, and a level 28 Blizzard when struck.",
    quality: "unique",
    base: "Occult Tome",
    category: "grimoire",
    tier: "elite",
    slots: ["offhand"],
    requiredLevel: 78,
    maxSockets: 2,
    stats: [
      { text: "-10-20% to Enemy Magic Resistance", variable: true, notable: true },
      { text: "+2 to Warlock Skill Levels", notable: true },
      { text: "20-30% Faster Cast Rate", variable: true, notable: true },
      { text: "30% Faster Hit Recovery", notable: true },
      { text: "+70-115% Enhanced Damage", variable: true },
      { text: "+50-70% Bonus to Attack Rating", variable: true },
      { text: "+140-170% Enhanced Defense", variable: true },
      { text: "10-25% Better Chance of Getting Magic Items", variable: true },
      { text: "15% Chance to cast level 28 Blizzard when struck" },
    ],
    drop: {
      summary: "Area level 85. Requires Reign of the Warlock.",
      minMonsterLevel: 85,
      tradeability: "rare",
      confidence: "verified",
    },
    notes:
      "The magic-pierce line is the one that matters and it is easy to read past. `pierce-mag` resolves to \"-X% to Enemy Magic Resistance\", and it is the reason the Warlock's magic damage is better supported by gear than its fire damage is — the class's only *skill* that breaks resistance is Apocalypse's fire pierce.",
    release: "reign-of-the-warlock",
    confidence: "verified",
  },

  {
    slug: "measured-wrath",
    name: "Measured Wrath",
    summary:
      "The Warlock's first real off-hand, at level 52. +1 to all his skills, three named fire lines, and resistances.",
    quality: "unique",
    base: "Burnt Text",
    category: "grimoire",
    tier: "exceptional",
    slots: ["offhand"],
    requiredLevel: 52,
    maxSockets: 2,
    stats: [
      { text: "+1 to Warlock Skill Levels", notable: true },
      { text: "25% Faster Cast Rate", notable: true },
      { text: "All Resistances +20-30", variable: true, notable: true },
      { text: "+1-3 to Ring of Fire (Warlock only)", variable: true },
      { text: "+1-3 to Flame Wave (Warlock only)", variable: true },
      { text: "+1-3 to Summon Tainted (Warlock only)", variable: true },
      { text: "+10-20 to Vitality", variable: true },
      { text: "+3-5 Life after each Kill", variable: true },
      { text: "+130-180% Enhanced Defense", variable: true },
      { text: "5% Chance to cast level 25 Ring of Fire when struck" },
    ],
    drop: {
      summary: "Area level 58. Requires Reign of the Warlock. The earliest Warlock-specific unique there is.",
      minMonsterLevel: 58,
      tradeability: "uncommon",
      confidence: "verified",
    },
    notes:
      "Level 52 is the lowest requirement on any Warlock unique, and the next three are 73, 78 and 80. So a levelling Warlock's off-hand is a two-socket runeword — Rhyme, Splendor or Vigilance — until this drops, and that is a fact about playing a class the game shipped last, not a gap in this catalogue.",
    release: "reign-of-the-warlock",
    confidence: "verified",
  },
];
