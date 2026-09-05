import type { Build } from "@/lib/types";

/**
 * The Smiter.
 *
 * Structurally unlike every other melee build on the site, and the reasons are
 * worth stating once here rather than repeating on the page:
 *
 * - Smite never checks Attack Rating and cannot be blocked, so the entire
 *   attack-rating and accuracy layer of melee planning simply does not apply.
 * - Its damage comes from Crushing Blow, which is a percentage of the target's
 *   *current* life. That is why it kills level 110 bosses with a weapon whose
 *   listed damage is irrelevant, and why it is bad at everything else.
 * - Life Steal, Mana Steal and Deadly Strike do not work with Smite at all, so
 *   half the usual melee shopping list is dead weight. Life Tap replaces life
 *   steal, which is why Dracul's Grasp or Exile is a hard requirement rather
 *   than a nice-to-have.
 *
 * Skill values verified against the game's own skills.txt: Smite is a level 1
 * skill with 15% damage baseline and +15% per level; Holy Shield runs 10% to
 * 40% block with Defiance as a 15%-per-level armor synergy; Fanaticism is 10%
 * to 40% attack speed and 50% damage baseline with +17% per level.
 */
export const smiter: Build = {
  slug: "smiter",
  name: "Smiter",
  classSlug: "paladin",
  summary:
    "An attack that cannot miss and cannot be blocked, killing level 110 bosses with Crushing Blow. The Uber specialist.",
  damageTypes: ["physical"],
  primarySkill: "smite",
  playstyle:
    "You walk up to one thing and hold a button. There is no aiming, no attack rating to satisfy, and no chance to miss — Smite always connects and stuns on top. The skill of the build is not the fight, it is the preparation: bringing Life Tap, capping resistances against Uber Mephisto's Conviction aura, and separating the three Ubers so you only ever fight one at a time. Away from bosses this build is genuinely poor, and it is meant to be.",
  strengths: [
    "Smite never misses and cannot be blocked, so it needs no Attack Rating investment at all",
    "Crushing Blow removes a percentage of the target's current life, which scales to any boss regardless of its health pool",
    "Maximum block with Holy Shield, high resistances and a shield up at all times — the most survivable Paladin",
    "A working Uber setup is cheap by endgame standards; the expensive parts are optional",
    "Farms the Hellfire Torch, which upgrades every other character you own",
  ],
  weaknesses: [
    "Almost no area damage. Smite hits one target and that is the whole skill",
    "Life Steal, Mana Steal and Deadly Strike do nothing — a large part of normal melee gear is wasted",
    "Needs Teleport from Enigma to move at any speed, or it walks everywhere",
    "Physical immunes are a hard wall, and there is no elemental fallback",
    "Repetitive by design. One button, one target, no positioning",
  ],
  difficulty: "beginner",
  budget: "medium",
  ratings: {
    clearSpeed: 1,
    bossing: 5,
    survivability: 5,
    magicFind: 1,
    terrorZones: 1,
    ubers: 5,
    soloSelfFound: 3,
    players8: 2,
  },

  skills: [
    {
      skill: "smite",
      points: 20,
      role: "main",
      order: 1,
      note: "Available at level 1. The damage per level matters far less than Crushing Blow does, but the stun length scales with it and that is what keeps a boss from acting.",
    },
    {
      skill: "fanaticism",
      points: 20,
      role: "main",
      order: 2,
      note: "Your active aura. Attack speed and damage, and it applies to your mercenary as well. Available at level 30.",
    },
    {
      skill: "holy-shield",
      points: 20,
      role: "utility",
      order: 3,
      note: "Block chance and a large defence bonus, and it is what lets you stand in front of an Uber rather than beside it.",
    },
    {
      skill: "defiance",
      points: 20,
      role: "synergy",
      order: 4,
      note: "A direct synergy for Holy Shield's defence — 15% more armour per point. Max this last; it is real but it is the least urgent thing on the list.",
    },
    { skill: "might", points: 1, role: "prerequisite", note: "On the way to Fanaticism." },
    { skill: "blessed-aim", points: 1, role: "prerequisite", note: "On the way to Fanaticism." },
    {
      skill: "concentration",
      points: 1,
      role: "prerequisite",
      note: "On the way to Fanaticism. Also a genuinely useful aura when you want to survive rather than kill.",
    },
    { skill: "prayer", points: 1, role: "prerequisite" },
    {
      skill: "vigor",
      points: 1,
      role: "utility",
      note: "Run speed and stamina. Worth one point on any character that walks anywhere.",
    },
    { skill: "cleansing", points: 1, role: "prerequisite" },
    { skill: "meditation", points: 1, role: "utility", note: "Mana regeneration for the party. Not a prerequisite for anything here — take it because it is useful." },
    {
      skill: "redemption",
      points: 1,
      role: "utility",
      note: "Turns corpses into life and mana. On a build with no life steal this is your between-fight recovery.",
    },
    { skill: "resist-fire", points: 1, role: "utility" },
    { skill: "resist-cold", points: 1, role: "utility" },
    {
      skill: "resist-lightning",
      points: 1,
      role: "utility",
      note: "An aura you can swap to for its lightning resistance. **One hard point buys no passive maximum resistance at all** — the passive is half the aura value, rounded down — so this is the aura itself, not a background bonus you keep while Fanaticism is running.",
    },
    {
      skill: "salvation",
      points: 1,
      role: "utility",
      note: "A one-point swap for the Uber Tristram entrance, where every resistance matters more than any damage aura.",
    },
    {
      skill: "charge",
      points: 1,
      role: "utility",
      note: "Free mobility before Enigma. Not damage — transport.",
    },
    {
      skill: "holy-bolt",
      points: 1,
      role: "prerequisite",
      note: "Blessed Hammer's prerequisite, and therefore on the path to Holy Shield.",
    },
    {
      skill: "blessed-hammer",
      points: 1,
      role: "prerequisite",
      note: "**Holy Shield requires Blessed Hammer and Charge.** One point each; the Smiter never casts either.",
    },

  ],
  flexPoints: [
    "**Everything beyond the four maxed skills is optional.** A Smiter is fully functional at around level 85, and the remaining points are comfort rather than capability.",
    "**More Resist Lightning** is the best of the remaining options if Uber Mephisto is killing you — his Conviction drags your resistance down, and a higher *cap* is what keeps you at the top of that fall. Note which number you are buying: a Smiter runs **Fanaticism**, so you keep half the bonus rounded down. Ten hard points is +5% passive; the full +10% needs Resist Lightning as the active aura, which costs you Fanaticism's attack speed and damage for that fight.",
    "**More Vigor** if you play without Enigma. Run speed is the difference between a fifteen-minute Uber run and a nine-minute one.",
    "**Increased Attack Speed is not given as a breakpoint table on this site.** The frame thresholds for Smite depend on your weapon's speed modifier and the game's own animation data, and no source we consider reliable publishes them. Fanaticism supplies 10-40% by itself and Grief another 30-40%, which in practice covers it — but we would rather say that than print a number we cannot verify.",
  ],
  stats: {
    strength: "Enough for your gear and nothing beyond it. A Paladin shield asks very little; the weapon is usually what sets the number.",
    dexterity:
      "Enough for maximum block **with Holy Shield active**, plus whatever your weapon demands. A Grief in a Phase Blade needs 136 Dexterity on its own, which for most Smiters is already past the block requirement.",
    vitality: "Everything else. There is no competing use.",
    energy: "None. Smite costs almost nothing and Redemption covers the rest.",
    notes: [
      "**Check your block percentage with Holy Shield switched on, not off.** Holy Shield supplies a large share of it, and checking with the buff down is the single most common way Paladins waste fifty stat points.",
      "Decide your weapon before you spend Dexterity. A Phase Blade's 136 Dexterity requirement changes the whole plan; a Berserker Axe or a scepter does not.",
      "Do not add Energy. A Smiter's mana problems are solved by one point in Redemption and an Insight on the mercenary.",
    ],
  },
  breakpoints: [
    {
      stat: "fbr",
      value: 86,
      frames: 2,
      priority: "recommended",
      why: "Blocking is your damage mitigation, and the recovery frames are what determine whether you can act between blocked hits. Exile alone gives 30%, Stormshield another 35%.",
    },
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "recommended",
      why: "The practical target. Uber Diablo hits hard enough that hit recovery decides whether you get a heal off.",
    },
    {
      stat: "fhr",
      value: 86,
      frames: 4,
      priority: "luxury",
      why: "Reachable with a Verdungo's belt and a rare ring, but usually at the cost of resistances you need more.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Get through Normal and Nightmare with Smite as a backup, not a main attack.",
      levelRange: [1, 40],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any Paladin scepter with +Combat Skills",
              why: "Smite's damage barely matters yet, but a scepter that adds skill levels raises Holy Shield and Smite together. Vendors restock these constantly.",
              lookFor: ["+2 Combat Skills", "+3 Smite", "+3 Holy Shield"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "Three Countess runes for near-capped resistances, on a Paladin shield that adds its own resistance on top.",
              sockets: "Ral, Ort, Tal into a 3-socket Paladin shield.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "Faster Hit Recovery and run speed for two of the most common runes in the game.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            { ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills for two runes." },
          ],
        },
      ],
      nextUpgrade:
        "Level 30 is the real start of the build — Fanaticism unlocks there. Until then you are simply a Paladin with a shield.",
      notes:
        "Do not try to level with Smite. It has no area damage and no synergies to invest in yet. Level with Zeal or Blessed Hammer and respec later — the Den of Evil gives you a free token in every difficulty.",
    },

    {
      tier: "nightmare",
      goal: "Fanaticism online, Holy Shield running, resistances heading toward 75%.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "kingslayer" },
              why: "33% Crushing Blow is the stat that actually kills bosses, and this is the cheapest place to get a serious amount of it.",
              sockets: "Mal, Um, Gul, Fal into a 4-socket Sword or Axe.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "passion" },
                  why: "Cheaper, and the Zeal it grants gives you something to clear with between bosses.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "herald-of-zakarum" },
              why: "+2 Paladin skills, +2 Combat Skills, 30% increased blocking and +50 all resistances. The single best value shield a Smiter can wear before Exile.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "treachery" },
              why: "The Fade proc raises all resistances and cuts physical damage taken, and it costs three cheap runes.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "vampire-gaze" },
              why: "15-20% damage reduction. Life steal is wasted on Smite, but the damage reduction is not.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "gore-rider" },
              why: "15% Crushing Blow and 30% run speed. Its Deadly Strike does nothing for you — take it for the Crushing Blow.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "raven-frost" },
              why: "Cannot Be Frozen. Being chilled while locked in an attack animation is how melee characters die.",
            },
          ],
        },
      ],
      charms: [
        {
          label: "Small charms with resistances and life",
          why: "Resistances are the constraint from here to the end of the game, and charms are the cheapest place to buy them.",
        },
      ],
      nextUpgrade:
        "A Life Tap source. Until you have one, Uber Mephisto is not attemptable.",
      notes:
        "Fanaticism at 30 is when the build starts to feel like itself. Before that, Might is a reasonable stand-in.",
    },

    {
      tier: "early-hell",
      goal: "Reach Hell with 75% resistances and a real Crushing Blow total.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "kingslayer" },
              why: "Still doing the job. Crushing Blow does not care about your weapon's damage, which is why this holds up far longer than it looks like it should.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "herald-of-zakarum" },
              why: "The resistances matter more in Hell than the block does, and this gives both.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted Blood gloves, or rares with 20% Increased Attack Speed",
              why: "**Dracul's Grasp is the item that makes Ubers possible, and it requires level 76** — one level past this tier. Life Tap converts your damage into healing, which is the only sustain a Smiter has, because life steal does not work with Smite. Until you can wear it, take attack speed, life and resistances here, and carry a Life Tap wand on weapon swap for anything that needs the curse now.",
              lookFor: ["20% Increased Attack Speed", "Life per hit", "Resistances"],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "duress" },
              why: "15% Crushing Blow on the armour slot, plus damage reduction, for three mid runes.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "+2 skills, +65 all resistances and 8% damage reduction. Better, and considerably more expensive.",
                },
              ],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "10-15% damage reduction on a belt slot, which is worth more here than any stat total.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 all skills and +20-30 all resistances. The resistances are the reason.",
            },
          ],
        },
      ],
      charms: [
        {
          label: "Resistance and life small charms",
          why: "You are aiming at 75% in all four resistances before you go anywhere near Uber Mephisto.",
        },
      ],
      nextUpgrade:
        "The three keys, then an Exile. Once Life Tap and 75% resistances are in place, the mini-Ubers are attemptable.",
      notes:
        "This is the tier where the build becomes what it is for. Everything above it is about doing the same job faster and more safely.",
    },

    {
      tier: "budget",
      goal: "Kill the three mini-Ubers reliably and start collecting organs.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "Grief's flat damage bonus applies to Smite even though the character sheet never shows it. It is the standard Smiter weapon and it is not close.",
              sockets: "Eth, Tir, Lo, Mal, Ral into a 5-socket Phase Blade.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "heavens-light" },
                  why: "33% Crushing Blow and +2-3 Paladin skills, at a fraction of Grief's cost.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "exile" },
              why: "15% chance of Life Tap on striking, a Defiance aura and +2 Offensive Auras. It is a second Life Tap source and a defensive shield at once.",
              sockets: "Vex, Ohm, Ist, Dol into a 4-socket Paladin shield. Use an ethereal base — Exile repairs itself.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "herald-of-zakarum" },
                  why: "If Exile is out of reach. You then need Dracul's Grasp for Life Tap, not as a backup but as the only source.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "vampire-gaze" },
              why: "Damage reduction, cheaply. A Guillaume's Face or a socketed helm with Crushing Blow is the alternative if you find one.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 skills, +65 all resistances and 8% damage reduction. Against Uber Mephisto's Conviction, the resistances are what keep you standing.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "draculs-grasp" },
              why: "Keep it even with Exile. Two Life Tap sources means the curse is essentially always up.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "15% more Crushing Blow." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, permanently." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              ref: { kind: "unique", slug: "stone-of-jordan" },
              why: "+1 all skills. A rare ring with resistances is a legitimate alternative if you need the cap.",
            },
          ],
        },
      ],
      charms: [
        {
          label: "Hellfire Torch (Paladin)",
          why: "+3 Paladin skills and +10-20 all resistances. You are farming it — the first one you keep should be your own.",
        },
        { label: "Annihilus", why: "+1 all skills, +10-20 all attributes, +10-20 all resistances." },
        {
          label: "Resistance small charms",
          why: "Whatever it takes to hold 75% in all four while Conviction is on you.",
        },
      ],
      weaponSwap: [
        {
          ref: { kind: "runeword", slug: "call-to-arms" },
          why: "Battle Orders before every portal. It is a flat life increase of roughly a third and it costs a keypress.",
        },
      ],
      nextUpgrade:
        "Enigma. Not for damage — for the ability to reach the fight and to separate the Ubers.",
      notes:
        "The mini-Ubers are individually far easier than Uber Tristram. Clear them until you are comfortable before opening the final portal.",
    },

    {
      tier: "optimized",
      goal: "Clear Uber Tristram consistently and quickly.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "Unchanged. Nothing displaces it.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "exile" }, why: "Unchanged. Ethereal base." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport. It is how you separate the three Ubers, and separating them is most of the fight.",
              sockets: "Jah, Ith, Ber into a 3-socket body armour. Its +0.75 Strength per level also pays for your gear.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "crown-of-ages" },
              why: "+1 skills, +20-30 all resistances, 10-15% damage reduction and up to two sockets. The best Smiter helm.",
              lookFor: ["2 sockets", "30% all resistances", "15% damage reduction"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap. Still mandatory." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow." }],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Damage reduction, which matters more than any stat total in this fight.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "highlords-wrath" },
              why: "+1 all skills and 20% attack speed. Its Deadly Strike does nothing for Smite — you are buying the other two lines.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "maras-kaleidoscope" },
                  why: "Take this instead whenever resistances are the thing standing between you and a kill.",
                },
              ],
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              ref: { kind: "unique", slug: "stone-of-jordan" },
              why: "+1 all skills, or a rare ring with resistances and Faster Hit Recovery.",
            },
          ],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills." },
        { label: "Annihilus", why: "+1 all skills and resistances." },
        {
          label: "Resistance and life small charms",
          why: "Fill the remaining inventory with whatever holds your resistances at maximum.",
        },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        {
          ref: { kind: "runeword", slug: "spirit" },
          why: "The off-hand for the Call to Arms swap. Its +2 skills raise the Battle Orders you cast.",
        },
      ],
      nextUpgrade:
        "Maximum resistances above 75%, through Crown of Ages sockets and an Exile roll. That is the last meaningful upgrade.",
    },

    {
      tier: "bis",
      goal: "Nothing left to fix. Uber Tristram on demand.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "A 400-damage roll in an ethereal Phase Blade.",
              lookFor: ["400 damage", "40% Increased Attack Speed", "ethereal Phase Blade"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "exile" },
              why: "A 16 Defiance roll in an ethereal Paladin shield that already carried +45 all resistances.",
              lookFor: ["Level 16 Defiance", "260% Enhanced Defense", "Ethereal base"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "crown-of-ages" },
              why: "Two sockets, 30% all resistances, 15% damage reduction.",
              lookFor: ["2 sockets", "30 all resistances", "15% damage reduction"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow." }],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "15% damage reduction on a maximum roll.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "maras-kaleidoscope" },
              why: "+2 all skills and +30 all resistances. At this tier the resistance cap is the binding constraint, not the skill total.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, 20 Dexterity." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              ref: { kind: "unique", slug: "stone-of-jordan" },
              why: "+1 all skills, or a rare ring carrying resistances, Faster Hit Recovery and life.",
            },
          ],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills, 20 all resistances." },
        { label: "Annihilus", why: "+1 all skills, 20 all attributes, 20 all resistances." },
        {
          label: "Life and resistance small charms",
          why: "The rest of the inventory. Nothing else competes at this point.",
        },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "There is no damage upgrade left to chase, because Crushing Blow has no ceiling to push against. Everything at this tier is resistances, damage reduction and comfort.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Hire the Nightmare Act 2 mercenary with **Might** for the damage, or **Holy Freeze** if you want the Ubers slowed. Holy Freeze is the safer pick and most Smiters take it. He will die in Uber Tristram regardless — bring revival gold and do not build him an expensive weapon before you have your own gear sorted.",

  farming: [
    {
      area: "uber-tristram",
      difficulty: "hell",
      why: "The reason the build exists. Three level 110 bosses, and the only source of the Hellfire Torch.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "countess",
      difficulty: "hell",
      why: "Key of Terror, and runes for Exile on the way.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "arcane-sanctuary",
      difficulty: "hell",
      why: "The Summoner drops the Key of Hate, and the run is short.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "nihlathak",
      difficulty: "hell",
      why: "Key of Destruction. Dangerous for the wrong build; a Smiter with maximum block is not the wrong build.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Ten seconds from a portal, and a single target — which is the only kind of target a Smiter is good at.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are three tightly packed single targets. Slower than a Hammerdin here, but perfectly viable.",
      minTier: "budget",
      rating: 3,
    },
  ],

  immunityPlan:
    "Smite is pure physical damage, so physical immunity is a hard stop with no elemental fallback. This matters much less than it sounds: none of the Ubers are physical immune, and the build is not a general farmer. Where you do meet physical immunes, the answer is your mercenary, or a Bone Break sunder charm, or simply walking past — you are not obliged to kill anything that is inconvenient. Uber Mephisto's permanent Conviction aura is the real resistance problem, and it works in the opposite direction: it strips **your** resistances, which is why 75% before you enter is not negotiable.",

  hardcoreNotes:
    "The most Hardcore-friendly Paladin, with one caveat. Maximum block, high damage reduction and a shield that never comes down make ordinary Hell content close to safe. Uber Tristram is the exception and it is not a small one: three level 110 bosses with a Conviction aura between them will kill an unprepared character in seconds. Do the three mini-Ubers many times before you open the final portal, keep Battle Orders up, and accept that the Torch may not be worth the character.",

  selfFoundNotes:
    "More self-found-friendly than it looks. Kingslayer is four mid runes, Herald of Zakarum drops in Hell, Gore Rider is common, and Dracul's Grasp is the only genuinely rare requirement. Exile and Grief are upgrades, not entry requirements — a self-found Smiter with Kingslayer, Herald of Zakarum and Dracul's Grasp can kill the mini-Ubers. The keys are also self-found by definition, since they only drop from three specific bosses.",

  levelingPath: {
    summary:
      "Do not level as a Smiter. Smite has no area damage and nothing to invest in before level 30. Level as a Zealot or a Hammerdin, then respec at 75 or later once you have the Life Tap source that makes the build work.",
    respecAt: "Level 75+, once Dracul's Grasp or Exile is in hand",
    viaBuild: "hammerdin",
  },

  confidence: "verified",
  complete: true,
};
