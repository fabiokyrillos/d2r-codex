import type { Build } from "@/lib/types";

/**
 * The Exploding Arrow Amazon.
 *
 * The fire branch of the bow tree, and the one whose weakness is structural
 * rather than incidental.
 *
 * **Exploding Arrow has exactly one damage synergy: Fire Arrow, at 14% per
 * level.** Immolation Arrow receives from Exploding Arrow and gives nothing
 * back. So the fire half of the plan is two maxed skills and no more, and the
 * points that would otherwise chase a third synergy go to Guided Arrow — pure
 * physical, unable to miss, and the answer to a fire immune.
 *
 * That answer is not optional. Fire is the most commonly resisted element in
 * Hell, and every farming area on this site records its own immunities: of the
 * twenty catalogued, thirteen list fire. The farming list below is ordered by
 * that data rather than by area level.
 */
export const explodingArrowAmazon: Build = {
  slug: "exploding-arrow-amazon",
  name: "Exploding Arrow Amazon",
  classSlug: "amazon",
  summary:
    "Every arrow detonates where it lands, and pierce makes it detonate again. A fire archer with a physical skill on the same bar, because fire alone is not enough in Hell.",
  damageTypes: ["fire", "physical"],
  primarySkill: "exploding-arrow",
  playstyle:
    "You shoot into a pack and it comes apart in a chain of explosions. Exploding Arrow damages everything around the target rather than only the target, and with pierce the arrow travels on and detonates again on the next thing it touches — one shot through a packed corridor is several explosions deep. Immolation Arrow is the second button and it does something different: it leaves a patch of fire burning on the ground, which turns a doorway into a place monsters cannot cross. Guided Arrow is the third, and it is on the bar for a specific reason — fire is the most resisted element in Hell, and this is what you press at the things fire cannot touch.",
  strengths: [
    "**Area damage on every single shot**, with no cooldown and no positioning requirement",
    "Pierce turns one arrow into a chain of explosions rather than one bigger hit",
    "Immolation Arrow's ground fire is genuine area denial — few builds can simply close a corridor",
    "Available at level 12, which is earlier than any other elemental Amazon clear",
    "Flat fire damage from gear raises the explosion, not just the arrow",
  ],
  weaknesses: [
    "**Fire is the most commonly resisted element in Hell** — thirteen of the twenty areas catalogued here list fire immunity",
    "Only one damage synergy, so the fire half of the plan is short and its ceiling is lower than a cold build's",
    "No item on the site raises fire skill damage the way Nightwing's Veil raises cold or Griffon's Eye raises lightning",
    "Immolation Arrow's ground fire does nothing to anything that will not walk into it",
    "**Attack speed is a per-bow question**, so no Amazon breakpoint is published here either",
  ],
  difficulty: "moderate",
  budget: "medium",
  ratings: {
    clearSpeed: 4,
    bossing: 3,
    survivability: 3,
    magicFind: 3,
    terrorZones: 3,
    ubers: 1,
    soloSelfFound: 3,
    players8: 3,
  },

  skills: [
    {
      skill: "exploding-arrow",
      points: 20,
      role: "main",
      order: 1,
      note: "**Area damage on every shot**, and its explosion is raised by flat fire damage from gear as well as by skill level.",
    },
    {
      skill: "fire-arrow",
      points: 20,
      role: "synergy",
      order: 2,
      note: "**The only damage synergy Exploding Arrow has**, at 14% per level. There is nothing else competing for these twenty points.",
    },
    {
      skill: "immolation-arrow",
      points: 20,
      role: "main",
      order: 3,
      note: "A second fire skill rather than a synergy — it receives 10% per level from Exploding Arrow and gives nothing back. The ground fire is what it is for.",
    },
    {
      skill: "guided-arrow",
      points: 20,
      role: "utility",
      order: 4,
      note: "**Pure physical and unable to miss.** On a fire build in Hell this is not a fallback, it is the second half of the character.",
    },
    {
      skill: "pierce",
      points: 14,
      role: "utility",
      order: 5,
      note: "A pierced arrow explodes again wherever it lands next, so pierce multiplies the number of detonations. Count a Razortail into the total before spending the last of these.",
    },
    { skill: "magic-arrow", points: 1, role: "prerequisite", note: "Multiple Shot's prerequisite, and a shot that costs no arrows." },
    { skill: "multiple-shot", points: 1, role: "prerequisite", note: "Exploding Arrow's other prerequisite, and Guided Arrow's. One point covers both." },
    { skill: "cold-arrow", points: 1, role: "prerequisite", note: "Guided Arrow's prerequisite. The chill is a small defensive bonus while levelling." },
    { skill: "penetrate", points: 1, role: "prerequisite", note: "Pierce's prerequisite. Exploding Arrow carries 20% attack rating plus 9% per level of its own." },
    { skill: "critical-strike", points: 1, role: "prerequisite", note: "Penetrate's prerequisite, and it doubles the physical half — which is Guided Arrow's whole damage." },
    { skill: "valkyrie", points: 1, role: "utility", note: "Something standing where the explosions are, so that you are not." },
    { skill: "decoy", points: 4, role: "utility", note: "Raises the Valkyrie's life, and a Decoy placed inside a pack pulls it into the blast." },
    { skill: "evade", points: 1, role: "prerequisite", note: "Valkyrie's prerequisite." },
    { skill: "avoid", points: 1, role: "prerequisite", note: "Evade's prerequisite." },
    { skill: "dodge", points: 1, role: "prerequisite", note: "Avoid's prerequisite." },
    { skill: "slow-missiles", points: 1, role: "utility", note: "Decoy's prerequisite, and the answer to a ranged pack." },
    { skill: "inner-sight", points: 1, role: "prerequisite", note: "Slow Missiles' prerequisite, and it lowers the defence of a whole pack at once." },
  ],
  flexPoints: [
    "**The plan spends 109 of 110.** Pierce is the block to tune once a Razortail is in place.",
    "**Immolation Arrow's twenty points are the honest fork.** It is a second fire skill, not a synergy, so it does nothing for Exploding Arrow's damage. Keep them if you want area denial and a stronger single-target fire hit; move them to Critical Strike and Penetrate if Guided Arrow is doing most of your killing in Hell, which it will be.",
    "**Do not chase a third fire synergy.** There is not one. The tree gives Exploding Arrow exactly Fire Arrow and nothing else.",
  ],
  stats: {
    strength: "Whatever the bow asks. This build has no reason to reach for a heavy base — nothing here scales with the bow's own damage as hard as a physical build does.",
    dexterity: "Enough for the bow, plus what raises attack rating for Guided Arrow. Less critical than on the physical builds.",
    vitality: "Everything left.",
    energy: "None. Exploding Arrow is 20 mana at level 1 and Immolation Arrow 24, so this build wants an Insight but is not starved the way the Freezing Arrow one is.",
    notes: [
      "**Flat fire damage on gear raises the explosion**, so an affix that would be filler on another bow build is real damage here — look for it on rings, amulets and jewels.",
      "Dexterity earns less on this build than on the physical ones, because the fire half does not scale with the bow. Spend it on requirements and stop.",
      "Fire resistance is the one you will most often be short of, because the answer to your own weakness — carrying a Flame Rift — costs 70 to 90 points of it.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 32,
      frames: 7,
      priority: "recommended",
      why: "You fire from a standing position with no shield. This is the affordable target and the one worth reaching before Hell.",
    },
    {
      stat: "fhr",
      value: 52,
      frames: 6,
      priority: "luxury",
      why: "Worth taking if the gear you already wanted supplies it.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Exploding Arrow at level 12, and enough attack speed to use it.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "edge" },
              why: "Attack speed and bonus damage against demons and undead for three low runes, while the explosion is still small.",
              sockets: "Tir, Tal, Amn into a 3-socket bow.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Hit recovery and run speed from level 17." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills, which raises the explosion and the arrow together." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "magefist" },
              why: "**+1 to Fire Skills, and that is not Sorceress-only** — it is the cross-class fire bonus, so it raises Fire Arrow, Exploding Arrow and Immolation Arrow. Available at level 23 for almost nothing.",
            },
          ],
        },
      ],
      nextUpgrade: "Level 24 for Immolation Arrow, then a Melody for the whole tab.",
      notes:
        "**Exploding Arrow at level 12 is the earliest elemental area clear the Amazon has.** Fire Arrow before it is a genuine skill and not a wasted prerequisite — it converts part of the arrow's physical damage to fire and adds more on top.",
    },

    {
      tier: "nightmare",
      goal: "Both fire skills online, and a physical skill for the immunes.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "melody" },
              why: "+3 to the whole bow tab raises every skill on this bar at once, fire and physical alike.",
              sockets: "Shael, Ko, Nef into a 3-socket bow.",
              alternatives: [
                { ref: { kind: "unique", slug: "buriza-do-kyanon" }, why: "Free pierce means every arrow detonates more than once. On this build that is the largest single upgrade available." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "peace" }, why: "+2 Amazon skills and hit recovery for three cheap runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find until something better exists." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 to Fire Skills for a slot with nothing better in it yet." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce, which on this build is 33% more detonations." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating for the Guided Arrow half." }],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "75% before Hell, and fire resistance especially." }],
      nextUpgrade: "An elite bow and a Fortitude, then resistances capped before Hell.",
      notes:
        "**Attack speed matters and no single Amazon number covers it.** The frames depend on the bow's own base speed and on the skill, so take the speed where it is free and judge it on the bow you hold.",
    },

    {
      tier: "early-hell",
      goal: "Capped resistances, and Guided Arrow strong enough to carry the fire immunes.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "buriza-do-kyanon" },
              why: "Free pierce, so each arrow explodes along a line rather than once.",
              alternatives: [
                { ref: { kind: "unique", slug: "eaglehorn" }, why: "+1 Amazon skills, Ignore Target's Defense for Guided Arrow, and six sockets for fire facets." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage, which the Guided Arrow half spends and the explosion does not." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life per level and damage reduction at 50 Strength." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "magefist" },
              why: "+1 Fire Skills. **This is a real trade rather than a free pick** — the alternative is 20% attack speed, which the Guided Arrow half wants more than the fire half does.",
              alternatives: [
                {
                  label: "Rare or crafted gloves with 20% Increased Attack Speed",
                  why: "Take these instead once Guided Arrow is doing most of the killing in Hell.",
                  lookFor: ["20% Increased Attack Speed", "Two resistances"],
                },
              ],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce, and every pierce is another explosion." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and up to +30 all resistances — and fire resistance is the one you will be short of." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "Life and **+5% to maximum fire resistance**, which matters more on this build than on any other because of what you may end up carrying." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "Fire resistance first, then the rest." }],
      nextUpgrade: "A Faith bow, and a decision about the Flame Rift.",
      notes:
        "**This is where fire immunity stops being occasional.** Thirteen of the twenty areas catalogued on this site list fire among their common immunities. The farming list below is ordered by that rather than by area level, and Guided Arrow is why the list is not shorter still.",
    },

    {
      tier: "budget",
      goal: "A Fanaticism aura, and a settled answer to fire immunity.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "faith" },
              why: "Fanaticism raises attack speed, attack rating and damage, and +1-2 all skills raises both halves of the build at once.",
              sockets: "Ohm, Jah, Lem, Eld into a 4-socket bow.",
              alternatives: [
                { ref: { kind: "unique", slug: "demon-machine" }, why: "66% Piercing Attack on the fastest crossbow in the game, and it fires its own explosive arrows. A curiosity here rather than a plan, but a fitting one." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage for the physical half, and the defence a shieldless build needs." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "+2 skills with no resistance penalty. **Andariel's Visage is the wrong helm on this build specifically** — its −30% fire resistance stacks with a Flame Rift's penalty into a number nothing recovers from.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves: 20% Increased Attack Speed, resistances",
              why: "By now Guided Arrow is carrying the fire immunes, and attack speed serves it better than +1 Fire Skills does.",
              lookFor: ["20% Increased Attack Speed", "Two resistances at 20+"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find, or Waterwalk if you have picked up a Flame Rift." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Bow and Crossbow skill grand charms", why: "They raise the fire half and the physical half together." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders on a character with no shield." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "Fire facets in every socket, and a decision about the sunder charm.",
    },

    {
      tier: "optimized",
      goal: "The fire half at its ceiling, and the physical half covering what it cannot reach.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "faith" },
              why: "A level 15 Fanaticism roll with +2 all skills.",
              lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
              alternatives: [
                { ref: { kind: "runeword", slug: "wrath" }, why: "Decrepify and Crushing Blow for the Guided Arrow half, on the swap. Nothing on it helps the fire half at all." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances, which is what makes a Flame Rift survivable if you carry one." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, socketed with a fire facet." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves: 20% Increased Attack Speed, resistances, life",
              why: "Speed for the physical half and resistance for the fire one.",
              lookFor: ["20% Increased Attack Speed", "Two resistances at 30+"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "+5% maximum fire resistance, which is the cheapest defence against your own sunder charm." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Bow and Crossbow skill grand charms with life", why: "Both halves, plus the life." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "The last fire facets, and a Flame Rift if you have decided to pay for one.",
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
              ref: { kind: "runeword", slug: "faith" },
              why: "Level 15 Fanaticism and +2 all skills.",
              lookFor: ["Level 15 Fanaticism", "+2 to All Skills"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills and a fire facet in the socket." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves: 20% Increased Attack Speed, two resistances, life",
              why: "The best version of a slot with no unique worth wearing at this point.",
              lookFor: ["20% Increased Attack Speed", "Two resistances at 30+"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "+5% maximum fire resistance and life." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { ref: { kind: "unique", slug: "flame-rift" }, why: "The direct answer, and the most expensive of the six to live with: fire is the element you are already short of, and this takes 70 to 90 more points of it. Carry it for the zone, never as a default." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "wrath" }, why: "For the Guided Arrow half against a physical immune." },
      ],
      notes:
        "This build ends as two characters sharing a bow: a fire archer that clears anything not immune, and a physical archer that kills what is. **The last real decision is the Flame Rift**, and it is a worse trade here than on a Sorceress — the same charm, but on a build already spending resistance on nothing else. Most players end up carrying it for two or three zones and leaving it in the stash otherwise.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "The Act 2 Desert Mercenary with **Might**, because his damage is physical and yours is half fire — against the immunes he is a second Guided Arrow that never runs out of mana. Give him an **Insight** for your own mana early, and later an **Infinity**, whose Conviction lowers fire resistance as well as lightning and is the only thing on the site that breaks fire immunity without costing you resistance. **Holy Freeze** if you would rather nothing walked out of the Immolation Arrow patch.",

  farming: [
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, short, and its recorded immunities are physical, cold and lightning rather than fire. The best fire zone on the site for exactly that reason.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85, seconds from a waypoint, and immune to poison and cold rather than fire. Undead pack tightly, which is what the explosions want.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Nothing here is fire immune and the herd stands close enough for one arrow to set off several explosions.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "throne-of-destruction",
      difficulty: "hell",
      why: "The waves are cold, lightning and poison immune rather than fire, and they arrive in exactly the density Exploding Arrow wants.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Ten seconds, monster level 86, and not fire immune. Guided Arrow finishes him if the explosions do not.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "arcane-sanctuary",
      difficulty: "hell",
      why: "Lightning and magic immunity rather than fire, and the long narrow platforms suit an Immolation Arrow across the width of one.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "The densest zone in the game and one of the worst matchups on the site: fire immunity is part of its regular population. A Guided Arrow zone with a fire bonus, not the other way round.",
      minTier: "budget",
      rating: 2,
    },
  ],

  immunityPlan:
    "**Fire is the most commonly resisted element in Hell and this build plans around that rather than hoping.** Of the twenty farming areas catalogued on this site, thirteen record fire among their common immunities — which is why Guided Arrow is maxed rather than kept at one point, and why the farming list above is ordered by immunity data instead of by area level. In order of practicality: **Guided Arrow**, pure physical, unable to miss, already on your bar; **your mercenary's physical damage**, which costs nothing; **Infinity on the mercenary**, whose Conviction lowers fire resistance and is the only source here that breaks the immunity without costing you anything; and **a Flame Rift sunder charm**, which is the direct fix and the worst trade of the six for this build in particular — fire is the resistance you are already short of, and the charm takes 70 to 90 more points of it. Do not wear an Andariel's Visage and a Flame Rift at the same time; that is 100 to 120 points of fire resistance given away between two items.",

  hardcoreNotes:
    "The safest thing about this build is that Immolation Arrow can close a doorway, and the most dangerous is that fire immunity is common enough that you will meet packs you cannot hurt while standing still to shoot them. Reach 32% Faster Hit Recovery, keep Slow Missiles on the bar, and treat Guided Arrow as your real weapon in Hell rather than as an afterthought. **Do not carry a Flame Rift in hardcore.** Fire is the most common damage type in the game as well as the most resisted, and 70 to 90 points of fire resistance is not a margin a permanent-death character should give up.",

  selfFoundNotes:
    "Fine, and cheaper than most. Edge, Melody and Peace are Countess runewords, Magefist costs almost nothing and gives a fire skill level, and Buriza-Do Kyanon — the biggest single upgrade — is common from late Nightmare. What self-found cannot fix is the structural problem: there is no fire equivalent of a Nightwing's Veil or a Griffon's Eye on this site, so the fire half's ceiling is lower than a cold or lightning build's however long you farm. The build stays viable because Guided Arrow costs nothing but skill points.",

  levelingPath: {
    summary:
      "**Better than most Amazons at levelling itself.** Fire Arrow from level 1 is a real attack rather than a placeholder, Exploding Arrow arrives at 12 and clears properly, and Immolation Arrow at 24 adds ground denial. Nothing has to be unlearned. Guided Arrow at 18 is the one addition a levelling character might not think to make, and it is the skill that will carry the build through Hell.",
    respecAt: "Not needed. Keep the tokens.",
  },

  confidence: "verified",
  complete: true,
};
