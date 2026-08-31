import type { Build } from "@/lib/types";

/**
 * The Holy Fire Paladin, and its Dragon variant.
 *
 * This build has a structural problem that the page is built around, because
 * understanding it is the difference between enjoying the build and abandoning
 * it in Hell Act 1.
 *
 * Holy Fire is an aura. You can only have one aura selected. So the standard
 * version runs Holy Fire as its damage — and therefore cannot run Conviction,
 * which is the thing that breaks fire immunity. Fire immunity is the most
 * common immunity in Hell. The build's own damage type is the one it is worst
 * equipped to push through.
 *
 * The **Dragon variant** is the answer, and it is why the variant exists rather
 * than being a luxury: Dragon grants a level 14 Holy Fire aura and Hand of
 * Justice grants a level 16 one, both **from the item**. With the damage coming
 * from gear, the selected aura slot is free for Conviction. That is the whole
 * trick, and it costs a Sur, a Cham, a Lo, a Sol and another Sur.
 *
 * Verified at Tier 1: Holy Fire is a level 6 skill with radius 6 plus 1 per
 * level; Dragon grants `aura(Holy Fire) 14` at required level 61; Hand of
 * Justice grants `aura(Holy Fire) 16` at required level 67 and carries -20%
 * enemy fire resistance; Conviction reduces resistance 30% plus 5% per level.
 *
 * Synergy identities (Resist Fire and Salvation) are published consensus rather
 * than Tier 1 — the extraction records that two synergies exist without naming
 * them. Hence `confidence: "community"`.
 *
 * Both ranked sources put this at the bottom of the Paladin list: Maxroll D
 * overall and D for Ubers, DiabloBytes B. The page says so.
 */
export const holyFirePaladin: Build = {
  slug: "holy-fire-paladin",
  name: "Holy Fire Paladin",
  classSlug: "paladin",
  summary:
    "A fire aura that burns everything near you while you attack with Zeal. Enjoyable, cheap to start, and walled by the most common immunity in the game.",
  damageTypes: ["fire", "physical"],
  primarySkill: "holy-fire",
  playstyle:
    "Run Holy Fire, walk into a group and hold Zeal. The aura damages everything in a radius around you continuously and adds fire damage to each of your hits, so the build kills by proximity as much as by attacking. It is fast, tactile and cheap to get going. Then you reach Hell, meet the first fire-immune pack, and discover that the aura you are running is also the aura slot you would need for Conviction. Everything above the Dragon tier on this page is about solving that.",
  strengths: [
    "Very cheap to start. Holy Fire is a level 6 skill and it carries a character through Normal on its own",
    "Fire damage plus physical damage from Zeal, so there are two things to fall back on",
    "Fast and physical to play — the aura kills things you never attacked",
    "Excellent self-sustain through life steal on the Zeal half",
    "The Dragon variant is one of the few genuinely novel gearing puzzles in the game",
  ],
  weaknesses: [
    "**Fire immunity is the most common immunity in Hell**, and it is your damage type",
    "You cannot run Holy Fire and Conviction at once, so the standard version has no immunity break",
    "The fix — Dragon plus Hand of Justice — costs two Sur, a Cham, a Lo and a Sol",
    "Both ranked sources we consulted rate it last or near-last among Paladin builds",
    "Poor at Ubers: Maxroll places it in D tier there specifically",
  ],
  difficulty: "moderate",
  budget: "high",
  ratings: {
    clearSpeed: 3,
    bossing: 2,
    survivability: 4,
    magicFind: 2,
    terrorZones: 3,
    ubers: 1,
    soloSelfFound: 3,
    players8: 2,
  },

  skills: [
    {
      skill: "holy-fire",
      points: 20,
      role: "main",
      order: 1,
      note: "Available at level 6, which is why this build carries a character so early. Radius 6 plus 1 per level, so points widen the kill zone as well as deepening it.",
    },
    {
      skill: "resist-fire",
      points: 20,
      role: "synergy",
      order: 2,
      note: "A Holy Fire synergy, and at 20 hard points it also carries **+10% maximum fire resistance passively** — the full +20% only if Resist Fire is the aura you are running, which it is not. The best points in the build.",
    },
    {
      skill: "salvation",
      points: 20,
      role: "synergy",
      order: 3,
      note: "The second synergy. It is also a resistance aura worth swapping to when the aura you are running is not helping.",
    },
    {
      skill: "zeal",
      points: 20,
      role: "main",
      order: 4,
      note: "The physical half, and your answer to fire immunes. Four points reach the five-hit cap; the rest is damage.",
    },
    {
      skill: "holy-shield",
      points: 1,
      role: "utility",
      note: "One point plus gear. You are standing in melee range of everything, so consider more if you are dying.",
    },
    { skill: "sacrifice", points: 1, role: "prerequisite", note: "Zeal's prerequisite, and Zeal's only synergy if you have points spare." },
    { skill: "smite", points: 1, role: "prerequisite" },
    { skill: "might", points: 1, role: "prerequisite" },
    { skill: "holy-freeze", points: 1, role: "prerequisite" },
    { skill: "holy-shock", points: 1, role: "utility", note: "A one-point aura swap. It is Fist of the Heavens' synergy, which this build does not use." },
    { skill: "sanctuary", points: 1, role: "prerequisite" },
    {
      skill: "conviction",
      points: 1,
      role: "utility",
      note: "**One point, and it matters more than its level suggests** — but only if your Holy Fire comes from gear. Read the Dragon variant before deciding how much to invest here.",
    },
    { skill: "blessed-aim", points: 1, role: "prerequisite" },
    { skill: "concentration", points: 1, role: "prerequisite" },
    { skill: "fanaticism", points: 1, role: "utility", note: "For the mercenary, or for the moments you would rather swing faster than burn." },
    { skill: "prayer", points: 1, role: "prerequisite" },
    { skill: "defiance", points: 1, role: "prerequisite" },
    { skill: "vigor", points: 1, role: "utility", note: "Run speed. **Salvation requires nothing** — this point buys movement, not access." },
    { skill: "resist-cold", points: 1, role: "utility" },
    { skill: "resist-lightning", points: 1, role: "utility" },
    { skill: "cleansing", points: 1, role: "prerequisite" },
    { skill: "meditation", points: 1, role: "utility", note: "Mana regeneration. A useful aura, not a prerequisite." },
    { skill: "redemption", points: 1, role: "utility", note: "Life and mana from corpses." },
    {
      skill: "thorns",
      points: 1,
      role: "prerequisite",
      note: "**Sanctuary requires Holy Freeze and Thorns**, and Sanctuary is what opens Conviction.",
    },
    {
      skill: "holy-bolt",
      points: 1,
      role: "prerequisite",
      note: "Blessed Hammer's prerequisite, on the path to Holy Shield.",
    },
    {
      skill: "blessed-hammer",
      points: 1,
      role: "prerequisite",
      note: "Holy Shield's prerequisite, together with Charge.",
    },
    {
      skill: "charge",
      points: 1,
      role: "prerequisite",
      note: "Holy Shield's other prerequisite, and usable mobility on the way.",
    },

  ],
  flexPoints: [
    "**The Dragon variant is the build's real form.** Dragon grants a level 14 Holy Fire aura and Hand of Justice a level 16 one — both from the item. Once your damage aura comes from gear, the aura you *select* can be Conviction, and the build's structural problem disappears. If you intend to go there, invest in Conviction rather than Holy Fire.",
    "**Standard version:** max Holy Fire and run it. Cheap, fun through Nightmare, and it hits a wall in Hell that no amount of gear inside this variant fixes.",
    "**Sacrifice** is worth points once the core is done — it is Zeal's synergy, and Zeal is what kills the fire immunes.",
    "**Omnidin, the aura-swapping variant.** With Dragon, Dream, Doom and Exile you can carry Holy Fire, Holy Shock, Holy Freeze and Defiance simultaneously and select whichever aura the party needs. It is a group-support playstyle rather than a damage build, only one source we consulted documents it, and it is documented here rather than given its own page for that reason.",
    "**Increased Attack Speed is not published as a breakpoint table here**, for the same reason as the other melee Paladins.",
  ],
  stats: {
    strength: "Enough for your gear. If you are heading for a Dragon body armour, note that it gives +0.375 Strength per level itself, which pays for a good deal of what it costs.",
    dexterity: "Enough for as much block as you have bought, with Holy Shield active.",
    vitality: "Everything else.",
    energy: "None.",
    notes: [
      "**Your own maximum fire resistance goes up as a side effect** of maxing Resist Fire for the synergy — by 10%, to an 85% cap, because a Paladin keeps half the bonus passively and you are running Holy Fire rather than Resist Fire. Real survivability, and easy to forget you have it.",
      "**Check block with Holy Shield running**, as with every Paladin.",
      "Cannot Be Frozen is not optional on any Zeal-based build, because being chilled stretches the attack animation you are locked into.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "recommended",
      why: "You fight surrounded by the pack your aura is burning, so hit recovery decides whether you can act.",
    },
    {
      stat: "fbr",
      value: 32,
      frames: 3,
      priority: "recommended",
      why: "Block recovery, on a build that is always inside melee range.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Level 6 to the end of Normal, on almost nothing.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any fast one-handed weapon",
              why: "Holy Fire does the killing at this stage and it does not care what you are holding. Take speed over damage.",
              lookFor: ["+2 Combat Skills", "High attack speed"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances for three Countess runes." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Hit recovery and run speed." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills." }],
        },
      ],
      nextUpgrade: "Zeal at 12, and then simply keep pouring points into Holy Fire and Resist Fire.",
      notes:
        "This is genuinely one of the strongest early builds in the game. Holy Fire at level 6 kills entire screens in Normal with no gear at all. Enjoy it — and read the Hell section before you plan around it.",
    },

    {
      tier: "nightmare",
      goal: "Push Holy Fire and its synergies, and start thinking about Hell.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "passion" },
              why: "Attack speed and a Berserk charge. The Berserk is a physical-damage escape hatch you will want.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "+2 Paladin skills, +2 Combat Skills, +50 all resistances." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "Fade and attack speed for three cheap runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Life steal and damage reduction." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen. Non-negotiable on a Zeal build." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest resistance available." }],
      nextUpgrade:
        "Decide now whether you are going to fund a Dragon and a Hand of Justice. The answer changes what you do with the next thirty levels.",
    },

    {
      tier: "early-hell",
      goal: "Meet fire immunity and have something to do about it.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "kingslayer" },
              why: "Crushing Blow and Open Wounds. Against a fire immune, your physical damage is the entire plan, and this is the cheapest way to make it serious.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "Resistances, which you will be short of." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "duress" }, why: "Crushing Blow, cold damage and damage reduction. The cold damage is a third damage type against fire immunes." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike and Open Wounds — all of which help the half of your damage that still works." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 skills and 20% attack speed." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal." }],
        },
      ],
      charms: [
        { label: "Resistance and life small charms", why: "Hold 75%." },
        {
          label: "Flame Rift (fire Sunder Charm)",
          why: "The direct answer to fire immunity, at the cost of a charm slot and some damage reduction. Worth knowing this exists before you spend a fortune on the Dragon route.",
        },
      ],
      nextUpgrade:
        "Either a fire Sunder Charm, or the Dragon and Hand of Justice pair. These are the two real answers and they cost wildly different amounts.",
      notes:
        "This is the tier where the build's central problem arrives. One published source counts 102 fire-immune monsters in Hell, of which it says roughly a third need Conviction rather than a curse to break. Whether or not the exact count is right, the shape of it is: fire immunity is everywhere, and Zeal alone is slow.",
    },

    {
      tier: "budget",
      goal: "Clear Hell with Zeal doing more of the work than the aura.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "The physical half becomes the main half. Grief's flat damage is what carries this tier.",
              sockets: "Eth, Tir, Lo, Mal, Ral into a 5-socket Phase Blade.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "Skills and resistances." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Life steal and damage reduction." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 skills, attack speed, Deadly Strike." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
      ],
      charms: [
        { label: "Flame Rift (fire Sunder Charm)", why: "The cheap answer to the build's central problem." },
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills." },
        { label: "Annihilus", why: "+1 all skills." },
      ],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
      nextUpgrade:
        "A Dragon. It is the point at which this build stops being a Zealot with a nice aura and becomes its own thing.",
    },

    {
      tier: "optimized",
      goal: "The Dragon variant. Holy Fire from gear, Conviction selected.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "dragon" },
              why: "**The key item.** A level 14 Holy Fire aura from the armour, which frees your selected aura slot for Conviction. Its +0.375 Strength per level also pays for itself.",
              sockets: "Sur, Lo, Sol into the lightest 3-socket body armour you can find.",
            },
          ],
        },
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "hand-of-justice" },
              why: "A second Holy Fire aura at level 16, and -20% enemy fire resistance on top of your Conviction. The two auras stack, and now you have an immunity break as well.",
              sockets: "Sur, Cham, Amn, Lo into a 4-socket weapon. A Phase Blade for speed, a Berserker Axe for damage.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "grief" },
                  why: "If Hand of Justice is out of reach, keep Grief and run only Dragon's aura. You get Conviction but half the fire damage.",
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
              why: "Skills and resistances. With both damage auras now on other slots, this one goes back to keeping you alive.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "crown-of-ages" },
              why: "+1 skills, resistances, damage reduction and sockets.",
              lookFor: ["2 sockets", "30% all resistances"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted Blood gloves with 20% Increased Attack Speed",
              why: "Attack speed and life.",
              lookFor: ["20% Increased Attack Speed", "Life", "Resistances"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Fire skill grand charms with life", why: "Direct damage on the aura." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade:
        "Conviction, invested properly. With the auras on gear, every point in it is now doing what Holy Fire points used to.",
      notes:
        "Respec here. The standard build's points in Holy Fire are largely wasted once the aura comes from Dragon and Hand of Justice — put them into Conviction and Zeal instead. Keep Resist Fire and Salvation; they still synergise the item auras.",
    },

    {
      tier: "bis",
      goal: "Two stacked fire auras, Conviction selected, and a fire sunder in reserve.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "dragon" },
              why: "The Holy Fire aura and the Strength that pays for the rest of your gear.",
              lookFor: ["+5 to all Attributes", "light 3-socket base"],
            },
          ],
        },
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "hand-of-justice" },
              why: "The second aura, the attack speed, the life steal and -20% enemy fire resistance.",
              lookFor: ["330% Enhanced Damage", "Phase Blade or Berserker Axe base"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "Skills, resistances, block." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "crown-of-ages" },
              why: "Two sockets, maximum resistances, maximum damage reduction.",
              lookFor: ["2 sockets", "30 all resistances", "15% damage reduction"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted Blood gloves, 20% Increased Attack Speed",
              why: "Attack speed, life steal and skills.",
              lookFor: ["20% Increased Attack Speed", "+3 Combat Skills"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and Deadly Strike." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "15% damage reduction." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills, 20 all resistances." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Flame Rift (fire Sunder Charm)", why: "Carry it for the monsters even Conviction cannot push under." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "Worth stating plainly at the top of the ladder: this is an expensive character that both ranked sources we consulted place below the Paladin builds that cost far less. Build it because the aura-stacking puzzle is fun, not because the numbers say to.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Might** for damage, or **Holy Freeze** to keep packs inside your aura radius for longer — the same logic as the Tesladin, and for the same reason. Give him an **Insight** for mana. Once you are running Conviction yourself, there is no need to duplicate it on him; put the runes into his survivability instead.",

  farming: [
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Huge density, nothing fire immune, and everything walks into your aura. The single best zone for this build.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Dense area level 85 and largely fire-vulnerable Undead.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and short. Some fire immunes, which is what the Zeal half is for.",
      minTier: "optimized",
      rating: 3,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 and cold-immune heavy, which does not affect you at all.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Dense, but full of fire-resistant demons and Iron Maiden from the Oblivion Knights, which reflects your Zeal. Possible, not comfortable.",
      minTier: "optimized",
      rating: 2,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are fire immune. Without the Dragon variant's Conviction this is simply not your zone.",
      minTier: "optimized",
      rating: 2,
    },
  ],

  immunityPlan:
    "This is the build's defining problem, so it gets the honest version. **Fire immunity is the most common immunity in Hell**, and fire is your damage. Worse, the standard build cannot break it: Holy Fire is your selected aura, and Conviction would have to occupy the same slot. There are three real answers. **A fire Sunder Charm** breaks fire immunity directly for the price of a charm slot and some damage reduction — the cheapest fix by a wide margin. **The Dragon variant** moves Holy Fire onto your gear so the selected aura can be Conviction; that plus Hand of Justice's -20% enemy fire resistance is the complete solution and also the expensive one. **Zeal's physical damage** is always available and is what actually kills fire immunes at every tier below Dragon — which is why the gear lists lean on Crushing Blow far more than a fire build would suggest.",

  hardcoreNotes:
    "Safer than it looks. High personal fire resistance falls out of maxing Resist Fire as a synergy, life steal from Zeal keeps you topped up, and Holy Shield plus a Paladin shield gives real block. The two dangers are the same as every Zealot's: **Iron Maiden**, which reflects your physical half, and the **animation lock**, which needs Cannot Be Frozen. The Dragon variant is also a large amount of currency to carry on a character that can die.",

  selfFoundNotes:
    "The standard build is genuinely self-found friendly and one of the strongest early characters in the game — Holy Fire needs nothing but skill points. Hell is where it stops: a fire Sunder Charm is a realistic self-found target and is the fix to aim for, while the Dragon variant needs two Sur, a Cham, a Lo and a Sol and is not a self-found project. Plan for the sunder charm, treat Dragon as a distant maybe.",

  levelingPath: {
    summary:
      "This one levels as itself, and it is very good at it. Holy Fire is available at level 6 and clears screens through Normal on no gear at all; Zeal arrives at 12 and gives you a second damage type. No respec is needed until you commit to the Dragon variant, at which point the points you sank into Holy Fire itself are better spent on Conviction — the free Den of Evil token covers that.",
    respecAt: "Only when converting to the Dragon variant",
  },

  confidence: "community",
  complete: true,
};
