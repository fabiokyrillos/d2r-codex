import type { Build } from "@/lib/types";

/**
 * The Enchant Sorceress, also published as the Enchantress.
 *
 * The research pass corrected a common misconception here: the modern Enchant
 * build is not a melee character. It is a **crossbow** build, and the melee
 * Sorceress is a separate thing built on Dream and Passion. Maxroll attributes
 * the change to a Patch 2.6 ranged-weapon buff, and Tier 1 confirms the
 * mechanism — Enchant carries a dedicated `% Damage for Ranged Weapons` value
 * of **33**.
 *
 * Verified at Tier 1:
 * - Enchant requires level 18, is `EType = fire`, and lasts 3600 frames plus
 *   600 per level. Prerequisites are Warmth and Fire Ball.
 * - Fire Mastery requires level 30 and gives 30% damage plus 7% per level.
 * - Demon Machine's base, the Chu-Ko-Nu, has a **weapon speed modifier of −60**,
 *   further than any other crossbow, and the unique carries **66% Piercing
 *   Attack**.
 *
 * That combination is the build: a very fast weapon firing piercing bolts, each
 * of which carries Enchant's fire damage through several targets.
 *
 * Maxroll rates it A, DiabloBytes S. The research recommended promoting it from
 * the third implementation batch on that basis.
 */
export const enchantSorceress: Build = {
  slug: "enchant-sorceress",
  name: "Enchant Sorceress",
  classSlug: "sorceress",
  summary:
    "A Sorceress whose damage comes from a crossbow. Piercing bolts carrying fire damage, and a buff the whole party wants.",
  damageTypes: ["fire", "physical"],
  primarySkill: "enchant",
  playstyle:
    "Cast Enchant on yourself and hold the attack button. Every bolt carries the fire damage the buff added, and Demon Machine's 66% Piercing Attack sends most of them straight through the first target into whatever is behind it. The Chu-Ko-Nu is the fastest crossbow in the game, so this becomes a stream rather than a series of shots. You are a ranged physical attacker who happens to be a Sorceress — which means Attack Rating matters, Increased Attack Speed matters, and Faster Cast Rate only matters for Teleport.",
  strengths: [
    "Two damage types on every bolt — physical from the weapon, fire from the buff",
    "Piercing means one shot hits a line of enemies, which is enormous in dense areas",
    "**A genuine party support build.** Enchant can be cast on other players and on your mercenary, and it lasts minutes",
    "Teleport plus a ranged attack is a combination almost nothing else in the game has",
    "Physical damage means fire immunity is only half a problem",
  ],
  weaknesses: [
    "**95 Dexterity and 80 Strength** for the crossbow, which is a lot of attribute points for a caster",
    "The crossbow is two-handed, so there is **no shield** — no Spirit, no block, no resistances from that slot",
    "Needs Attack Rating, which no other Sorceress build cares about at all",
    "Increased Attack Speed matters and this site does not publish an IAS table — see the flex points",
    "Demon Machine is the build. Without it, this is a different and much worse character",
  ],
  difficulty: "moderate",
  budget: "medium",
  ratings: {
    clearSpeed: 4,
    bossing: 3,
    survivability: 3,
    magicFind: 4,
    terrorZones: 4,
    ubers: 2,
    soloSelfFound: 3,
    players8: 4,
  },

  skills: [
    {
      skill: "enchant",
      points: 20,
      role: "main",
      order: 1,
      note: "Level 18. Adds fire damage to your attacks and **33% more of it when the weapon is ranged** — the parameter that makes this build exist. Lasts minutes, and can be cast on allies.",
    },
    {
      skill: "fire-mastery",
      points: 20,
      role: "main",
      order: 2,
      note: "30% damage at level 1 and +7% per level, applied to the fire half of every bolt. It raises your damage; it does not break fire immunity.",
    },
    {
      skill: "warmth",
      points: 20,
      role: "synergy",
      order: 3,
      note: "Enchant's synergy as well as its prerequisite, and it solves your mana at the same time. There is no reason to hold back on it.",
    },
    { skill: "fire-bolt", points: 1, role: "prerequisite", note: "Fire Ball's prerequisite." },
    { skill: "fire-ball", points: 1, role: "prerequisite", note: "**Enchant requires Fire Ball and Warmth.** One point, and you will never cast it." },
    { skill: "telekinesis", points: 1, role: "prerequisite" },
    { skill: "teleport", points: 1, role: "utility", note: "**One point forever.** Teleport plus a ranged weapon is most of why this build is good." },
    { skill: "static-field", points: 1, role: "utility", note: "Takes 25% of a target's current life — your answer to bosses that shrug off bolts." },
    { skill: "frozen-armor", points: 1, role: "utility", note: "Defence and a chance to freeze whatever closes the distance. You have no shield, so take it." },
    { skill: "frost-nova", points: 1, role: "utility", note: "A point-blank panic button for when something reaches you, which on a build with no shield is when you are in trouble." },

  ],
  flexPoints: [
    "**Remaining points go to Fire Ball**, which gives you a real spell for the moments a ranged attack is the wrong tool, or to more Frozen Armor for survivability you badly need without a shield.",
    "**Max Enchant variant:** every remaining point into Enchant and its synergy, gear chosen entirely for +skills. The buff you cast on your party gets better too, which is the reason to do it in a group.",
    "**Magic find variant:** the build clears fast enough that trading damage for magic find costs less than it does elsewhere. Same skill plan; War Traveler, Harlequin Crest and magic find charms.",
    "**Increased Attack Speed is not published as a breakpoint table on this site**, for the same reason it is not on the melee Paladin pages — the thresholds depend on weapon speed and animation data no source we consider reliable publishes. The Chu-Ko-Nu's own speed modifier of −60 is doing most of the work here; Highlord's Wrath and crafted gloves supply the rest.",
  ],
  stats: {
    strength: "**80**, for Demon Machine. Not a point more unless your armour asks for it.",
    dexterity:
      "**95**, for Demon Machine — and this is the single biggest difference between this build and every other Sorceress on the site. Raven Frost's +15-20 Dexterity can cover part of it, which is worth planning around before you spend the points.",
    vitality: "Everything after the two requirements above are met.",
    energy: "None. Warmth is maxed as a synergy, which already solves the mana.",
    notes: [
      "**Check what your gear supplies before spending Dexterity.** A Raven Frost rolls +15-20, and that is 15-20 points you do not have to buy.",
      "**Attack Rating matters here and nowhere else on this class.** Demon Machine's +632 covers most of it; Raven Frost and Highlord's Wrath cover the rest. If you are missing, it is Attack Rating and not damage.",
      "There is no block decision, because there is no shield. That simplifies the plan and it is also the build's main defensive weakness.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 60,
      frames: 9,
      priority: "required",
      why: "**Required, not recommended.** You have no shield and no block, so hit recovery is the only thing standing between an interruption and a death.",
    },
    {
      stat: "fcr",
      value: 63,
      frames: 9,
      priority: "recommended",
      why: "Only Teleport uses it — your damage is an attack, not a cast. 63% is enough to reposition comfortably and there is little reason to buy more.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 18 for Enchant, and 49 for Demon Machine. You are a Fire Ball Sorceress until then.",
      levelRange: [1, 40],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and cast rate while you level as a caster. You will replace it with a crossbow, so do not over-invest.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket Crystal Sword.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances while you still have a shield slot. Enjoy it — the crossbow takes it away." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Faster Hit Recovery and run speed for two common runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills." }],
        },
      ],
      nextUpgrade:
        "Demon Machine at level 49, and the 80 Strength and 95 Dexterity to hold it. Plan those points before you need them.",
      notes:
        "Level as a Fire Ball Sorceress — Fire Bolt and Fire Ball are both on the way to Enchant anyway. The transition happens when the crossbow appears, not at a particular level.",
    },

    {
      tier: "nightmare",
      goal: "Demon Machine in hand and Enchant doing the damage.",
      levelRange: [40, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "demon-machine" },
              why: "**The build.** 66% Piercing Attack on the fastest crossbow in the game, so each bolt carries Enchant's fire damage through a line of enemies.",
              lookFor: ["Any roll will do"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 skills and up to +35 all resistances at 43 Strength. With no shield, resistance has to come from somewhere." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find while you farm." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "**+1 to Fire Skills**, which raises Enchant directly. The cast rate is incidental here." }],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "raven-frost" },
              why: "Cannot Be Frozen, **+15-20 Dexterity toward the crossbow's requirement**, and +150-250 Attack Rating. Three things this build specifically needs, in one ring.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "With no shield, charms carry more of your resistance than usual." }],
      nextUpgrade: "Fire Mastery at 30, then resistances to 75% before Hell.",
    },

    {
      tier: "early-hell",
      goal: "Fire Mastery maxed, resistances capped, Attack Rating sufficient.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "demon-machine" }, why: "Unchanged. Nothing replaces it." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "Resistances, cheaply.",
              alternatives: [
                { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances. On a shieldless build this is worth more than usual." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, magic find and 10% damage reduction. The life and damage reduction are what you are buying." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 Fire Skills." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "highlords-wrath" },
              why: "+1 all skills, **20% Increased Attack Speed** and Deadly Strike that scales with level. Every line of it works on this build, which is unusual for a Sorceress item.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, Dexterity and Attack Rating." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike and Open Wounds — a physical attack build uses all three, which no other Sorceress can say." }],
        },
      ],
      charms: [
        { label: "Resistance and life small charms", why: "Hold 75% without a shield to help." },
        { label: "Flame Rift (fire Sunder Charm)", why: "Only if the fire half is what is failing. Your physical damage still lands on fire immunes, so this matters less here than on a pure fire build." },
      ],
      nextUpgrade: "Fortitude, which multiplies the physical half of every bolt.",
    },

    {
      tier: "budget",
      goal: "Both halves of the damage scaling together.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "demon-machine" }, why: "Still the build." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "fortitude" },
              why: "**+300% Enhanced Damage**, applied to the physical half of every bolt. This is the largest damage upgrade the build makes, and no other Sorceress on the site wants it.",
              sockets: "El, Sol, Dol, Lo into a 4-socket body armour.",
              alternatives: [
                { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "Trade the damage for +2 skills and +65 all resistances. On a shieldless build that is a defensible choice, not a lesser one." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, magic find, damage reduction." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted or rare gloves with 20% Increased Attack Speed",
              why: "Attack speed is scarce on this build and this is one of the few slots that supplies it.",
              lookFor: ["20% Increased Attack Speed", "+2 Fire Skills (crafted)", "Resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 all skills, which raises Enchant." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 skills, 20% attack speed, Deadly Strike." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, Dexterity, Attack Rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills, or a rare ring with Attack Rating and resistances if you are missing shots." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and +Strength, which offsets part of the crossbow requirement." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills, which raises Enchant three levels." },
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Fire skill grand charms with life", why: "Damage and the life a shieldless build needs." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders. With no shield and a Sorceress life pool, this is not optional." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap — the one moment you get a shield slot back." },
      ],
      nextUpgrade: "+skills wherever you can find it. Every point raises Enchant, and Enchant is on every bolt.",
    },

    {
      tier: "optimized",
      goal: "Maximum Enchant, and a build that clears the cow level in one pass.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "demon-machine" }, why: "Unchanged, permanently." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "fortitude" },
              why: "+300% Enhanced Damage on the physical half.",
              alternatives: [
                { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport with a flat mana cost, +Strength per level covering the crossbow requirement, and magic find. A real alternative if mobility is what limits you." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "+2 skills and the survivability a shieldless build is short of. Socket a fire facet.",
              lookFor: ["2 sockets"],
              alternatives: [
                { ref: { kind: "unique", slug: "crown-of-ages" }, why: "More resistances and damage reduction, fewer skills. The Hardcore choice." },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves: 20% Increased Attack Speed, +2 Fire Skills",
              why: "The only slot that gives attack speed and fire skills together.",
              lookFor: ["20% Increased Attack Speed", "+2 Fire Skills", "Resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 all skills." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and +30 all resistances — the resistances matter more once your attack speed is settled." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, Dexterity, Attack Rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and Strength." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Fire skill grand charms with life", why: "Damage and life." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Fire facets, and a decision between Fortitude's damage and Enigma's mobility.",
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
              ref: { kind: "unique", slug: "demon-machine" },
              why: "Socket it with fire facets — it takes up to five.",
              lookFor: ["Sockets for fire facets"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage and +200 defence." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "+2 skills with a fire facet socketed.",
              lookFor: ["2 sockets"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves: 20% Increased Attack Speed, +3 Fire Skills",
              why: "The best possible roll in the slot that matters most for speed.",
              lookFor: ["20% Increased Attack Speed", "+3 Fire Skills", "Two resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 all skills." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, 20 Dexterity, 250 Attack Rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and Strength." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills, 20 all resistances." },
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Fire skill grand charms with life", why: "The rest of the inventory." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "Worth stating once at the top: everything on this list was chosen for +skills, attack speed or Attack Rating, and almost none of it is what a Sorceress list normally contains. That is the honest summary of the build — it is a ranged physical character wearing a Sorceress's skill tree.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Cast Enchant on him.** It is the same buff, it lasts minutes, and it turns an Act 2 mercenary into a genuine second damage source — this is the reason the build carries a Support tag. Take **Might** for the physical damage that Enchant then multiplies, give him an **Insight** if your mana still needs help after maxing Warmth, and a **Vampire Gaze** or **Treachery** to keep him standing. He matters more here than on any other Sorceress build, because you have no shield and want something else for monsters to look at.",

  farming: [
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Piercing bolts down a line of cows is the single best expression of this build. Nothing there is fire immune and the density is enormous.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "stony-tomb",
      difficulty: "hell",
      why: "Area level 85, close to a waypoint, light on fire immunity, and the corridors line targets up for the piercing.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and short. The open rooms suit a ranged attacker with Teleport.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Dense area level 85 with corridors, which is what piercing wants.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 and cold-immune heavy, which does not affect either half of your damage.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Dense and high level, but a good share resists fire and the Oblivion Knights' Iron Maiden reflects the physical half of your damage. Possible, not comfortable.",
      minTier: "optimized",
      rating: 2,
    },
  ],

  immunityPlan:
    "Two damage types on every bolt makes this the least immunity-troubled fire build on the site. **Fire immunes still take the physical half**, which is substantial once Fortitude is on — so where a Fire Ball Meteor Sorceress stops entirely, this build simply gets slower. **Physical immunes still take the fire half**, for the same reason in reverse. Only something immune to both is a genuine wall, and there is little of that. **Fire Mastery does not break fire immunity** — it is a damage multiplier at 30% plus 7% per level. If the fire half is what you need back, a **Flame Rift** sunder charm does it at the cost of 70 to 90 points of your own fire resistance, which on a build with no shield is a heavier price than usual. The honest recommendation is usually to accept the slower kill and keep the resistance.",

  hardcoreNotes:
    "Risky in a specific, structural way: **the crossbow is two-handed, so you have no shield at all.** No block, no Spirit, and no resistances from that slot, on a class with the smallest life pool in the game. Everything else about the build is safe — you fight at range and you have Teleport — but when something does reach you there is nothing between it and you. Take Chains of Honor over Fortitude, Crown of Ages over Harlequin Crest, treat 60% Faster Hit Recovery as a hard floor, and keep Frost Nova bound. Also note the **Iron Maiden** risk in the Chaos Sanctuary: your physical damage reflects.",

  selfFoundNotes:
    "More achievable than it looks. Demon Machine drops from area level 57 and is rarely traded because only one build wants it — so it is one of the few build-defining items you are more likely to find than to buy. Everything else is ordinary: Skin of the Vipermagi, Harlequin Crest, Raven Frost and Magefist all drop in Hell. Fortitude is the only expensive piece and the build works without it. The genuine obstacle is that you need the crossbow before the build exists at all, and there is no partial version.",

  levelingPath: {
    summary:
      "Level as a Fire Ball Sorceress. Fire Bolt and Fire Ball are both prerequisites on the way to Enchant, so none of it is wasted, and Warmth is a synergy you would max anyway. Enchant itself arrives at 18 but does very little until you have a weapon worth enchanting — **the real transition is Demon Machine at level 49**, not a skill level. Plan the 80 Strength and 95 Dexterity before you get there, and check what your rings can supply first.",
    respecAt: "Optional, when Demon Machine appears",
  },

  confidence: "verified",
  complete: true,
};
