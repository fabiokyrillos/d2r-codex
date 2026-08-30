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

  // -------------------------------------------------------------------------
  // Jewellery
  // -------------------------------------------------------------------------
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
];
