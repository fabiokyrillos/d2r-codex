import type { Build } from "@/lib/types";

/**
 * The Freezing Arrow Amazon.
 *
 * Three facts from the pinned extraction decide the shape of this page.
 *
 * **Freezing Arrow has exactly one damage synergy: Cold Arrow.** Ice Arrow's
 * contribution is a `freeze` synergy, not a damage one — the graph records the
 * kinds separately and they are not interchangeable. So the damage plan is
 * short and the rest of the points buy safety, single-target damage and pierce.
 *
 * **Its own freeze length does not scale with its own level.** Only Ice Arrow
 * extends it. That is the whole argument for putting twenty points into a skill
 * that adds no damage at all.
 *
 * **It costs 36 mana at level 1 and one more per level** — 55 at level 20,
 * before +skills, which is the most expensive skill any Amazon has by a wide
 * margin. Mana is a gearing constraint on this build in a way it is not on any
 * other bow Amazon, and the pages say so rather than leaving it as a surprise.
 *
 * M'avina's Battle Hymn is described here as a variant rather than given a page
 * of its own: this site does not catalogue set items yet, and a set page with
 * no verified stat lines behind it would be worse than a paragraph that says
 * what the set does and what it costs.
 */
export const freezingArrowAmazon: Build = {
  slug: "freezing-arrow-amazon",
  name: "Freezing Arrow Amazon",
  classSlug: "amazon",
  summary:
    "An arrow that bursts into a field of cold and freezes everything it catches. The safest Amazon in the game, and the most expensive to feed.",
  damageTypes: ["cold", "physical"],
  primarySkill: "freezing-arrow",
  playstyle:
    "You fire into a crowd and it stops moving. Freezing Arrow bursts over a radius of five and freezes solid everything it catches, and a frozen pack is a pack that is not attacking anybody — which makes this the safest way to play the class and the one most forgiving of a mistake. The damage arrives while they stand there. Guided Arrow is the second button, and it matters more here than on any other cold build: it is pure physical, so it is what you press at the cold immunes your one element cannot touch. The cost is mana. Freezing Arrow is the most expensive skill the Amazon has and you will feel it in every gear decision.",
  strengths: [
    "**Freezing a pack is as good as killing it** for as long as it lasts — the safest Amazon on the site",
    "Cold is among the least-resisted elements in Hell, so the immunity problem is smaller than a fire or lightning build's",
    "Guided Arrow on the same bar is a pure physical answer to the cold immunes that do appear",
    "One damage synergy means the skill plan is short and the mistakes are few",
    "Ice, Nightwing's Veil and cold facets all stack −enemy cold resistance, which is applied only to targets that are not immune",
  ],
  weaknesses: [
    "**36 mana at level 1 and 55 at level 20**, which is the most expensive skill in the class and a real gear constraint",
    "**Ice Arrow adds no damage at all** — its synergy is freeze length, and twenty points there buy safety rather than kills",
    "Cold immunes take nothing from the main skill; the whole answer is Guided Arrow and the mercenary",
    "Freezing removes the corpse-shattering that makes some zones profitable, and stops Corpse Explosion allies cold",
    "**Attack speed is a per-bow question**, as on every bow build here, so no single Amazon number is published",
  ],
  difficulty: "beginner",
  budget: "medium",
  ratings: {
    clearSpeed: 4,
    bossing: 3,
    survivability: 5,
    magicFind: 3,
    terrorZones: 4,
    ubers: 1,
    soloSelfFound: 4,
    players8: 3,
  },

  skills: [
    {
      skill: "freezing-arrow",
      points: 20,
      role: "main",
      order: 1,
      note: "**Radius 5, and 36 mana rising by one per level.** The freeze is the defence and the damage is the reward.",
    },
    {
      skill: "cold-arrow",
      points: 20,
      role: "synergy",
      order: 2,
      note: "**The only damage synergy Freezing Arrow has.** Twelve percent per level, and there is nothing else competing for these points.",
    },
    {
      skill: "ice-arrow",
      points: 20,
      role: "synergy",
      order: 3,
      note: "**A freeze-length synergy, not a damage one.** Freezing Arrow's own level does not extend its freeze; only this does. Twenty points here buy time rather than damage, and on this build time is the point.",
    },
    {
      skill: "guided-arrow",
      points: 20,
      role: "utility",
      order: 4,
      note: "**Pure physical, and the answer to a cold immune.** It also cannot miss, which makes it the boss skill a cold area build otherwise lacks.",
    },
    {
      skill: "pierce",
      points: 15,
      role: "utility",
      order: 5,
      note: "A pierced arrow bursts again where it lands next, so pierce multiplies the number of freezes as well as the damage. Count your Razortail before spending the last of these.",
    },
    { skill: "magic-arrow", points: 1, role: "prerequisite", note: "Multiple Shot's prerequisite, and a shot that costs neither mana worth mentioning nor arrows." },
    { skill: "multiple-shot", points: 1, role: "prerequisite", note: "Guided Arrow's other prerequisite. One point, and a usable spread while levelling." },
    { skill: "penetrate", points: 1, role: "prerequisite", note: "Pierce's prerequisite. Freezing Arrow carries 40% attack rating plus 9% per level of its own, so one point is enough." },
    { skill: "critical-strike", points: 1, role: "prerequisite", note: "Penetrate's prerequisite. It doubles physical damage, so it helps Guided Arrow and the arrow's own damage rather than the cold burst." },
    { skill: "valkyrie", points: 1, role: "utility", note: "She holds whatever is not frozen. One point plus +skills." },
    { skill: "decoy", points: 4, role: "utility", note: "Raises the Valkyrie's life, and gives a frozen pack something else to look at." },
    { skill: "evade", points: 1, role: "prerequisite", note: "Valkyrie's prerequisite." },
    { skill: "avoid", points: 1, role: "prerequisite", note: "Evade's prerequisite." },
    { skill: "dodge", points: 1, role: "prerequisite", note: "Avoid's prerequisite." },
    { skill: "slow-missiles", points: 1, role: "utility", note: "Decoy's prerequisite, and a second way to stop a ranged pack that freezing did not reach." },
    { skill: "inner-sight", points: 1, role: "prerequisite", note: "Slow Missiles' prerequisite." },
  ],
  flexPoints: [
    "**The plan spends 109 of 110.** Pierce is the block to tune once a Razortail or a Buriza is in place — gear and skill are one pool.",
    "**Ice Arrow's twenty points are the ones people argue about.** They add no damage. Cut them to one and put the difference into Guided Arrow's supporting passives if you would rather kill cold immunes faster than keep everything else frozen; keep them if the reason you are playing this build is that it is safe.",
    "Immolation Arrow is the usual suggestion for a second element and it is the wrong one here: it needs Exploding Arrow and Fire Arrow underneath it, which is three maxed skills for a damage type Guided Arrow already covers more cheaply.",
  ],
  stats: {
    strength: "Whatever the bow asks. An Ice runeword in a Crusader Bow is 97 Strength; in a Matriarchal Bow it is 87 with 187 Dexterity.",
    dexterity: "High — the bow requires it, and it raises attack rating and the arrow's physical damage.",
    vitality: "Everything left. Nothing frozen is hitting you, but nothing immune is frozen either.",
    energy: "**None, and this is the one build where that advice needs defending.** Freezing Arrow's cost is real, but Energy is a poor way to pay it: an Insight mercenary, mana per kill and mana leech all supply more mana per slot than the attribute does per point.",
    notes: [
      "**Mana is this build's binding constraint and it is solved with gear, not with Energy.** An Insight on the mercenary is close to mandatory; mana after each kill and mana stolen per hit are the two affixes to look for on rings and gloves.",
      "Dexterity does double duty — it pays for the bow and it raises the physical half of every arrow, which is what hurts a cold immune.",
      "No shield, so Vitality and hit recovery are the whole defence when the freeze fails.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 32,
      frames: 7,
      priority: "recommended",
      why: "Lower priority than on the other bow builds, because a frozen monster is not interrupting you. It still matters against everything immune to cold.",
    },
    {
      stat: "fhr",
      value: 52,
      frames: 6,
      priority: "luxury",
      why: "Only worth buying if it falls out of the gear you already wanted.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 30 for Freezing Arrow, on Cold Arrow and Multiple Shot.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "edge" },
              why: "Attack speed and a large bonus against demons and undead for three low runes, while your damage is still the bow's.",
              sockets: "Tir, Tal, Amn into a 3-socket bow.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Hit recovery, run speed and a little mana regeneration from level 17." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills and +10 Energy, which is more useful on this build than on any other bow Amazon." }],
        },
        {
          slot: "belt",
          picks: [
            {
              label: "Any belt with mana or resistances",
              why: "Freezing Arrow is thirty-six mana a shot from the moment you get it. Anything that helps is worth wearing.",
              lookFor: ["+Mana", "Resistances"],
            },
          ],
        },
      ],
      nextUpgrade: "Level 30, then an Insight on the mercenary before anything else.",
      notes:
        "**Cold Arrow is a real skill while you level, not just a synergy.** It chills, which is a defensive line at a point in the game where you have none, and every point in it is kept.",
    },

    {
      tier: "nightmare",
      goal: "Freezing Arrow online, and the mana to press it.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "melody" },
              why: "+3 to the whole bow tab, which is +3 to Freezing Arrow, Cold Arrow, Ice Arrow and Guided Arrow at once.",
              sockets: "Shael, Ko, Nef into a 3-socket bow.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "buriza-do-kyanon" },
                  why: "100% Piercing Attack means every arrow bursts more than once, and its own cold damage chills what the burst misses.",
                },
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
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find while nothing better exists." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Gloves with Increased Attack Speed and mana leech",
              why: "Mana stolen per hit is the cheapest answer to a fifty-mana skill, and this is the slot it lives in.",
              lookFor: ["20% Increased Attack Speed", "Mana Stolen per Hit"],
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, attack rating, and +40 mana that this build genuinely notices." }],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "75% before Hell." }],
      nextUpgrade: "An Insight for the mercenary — on this build it is not optional — then Nightwing's Veil.",
      notes:
        "**Attack speed matters and there is no Amazon table for it.** A slow crossbow and a fast Amazon bow reach their frames at completely different totals, so take the speed where it is free and judge it on the bow in your hand.",
    },

    {
      tier: "early-hell",
      goal: "Cold skill damage, and a physical answer for the immunes.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "buriza-do-kyanon" },
              why: "Free pierce means each arrow bursts again where it travels on to. More freezes for no skill points.",
              alternatives: [
                { ref: { kind: "unique", slug: "eaglehorn" }, why: "+1 Amazon skills and Ignore Target's Defense on a faster base, with six sockets for cold facets." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "nightwings-veil" },
              why: "**+2 skills and up to +15% Cold Skill Damage**, plus −enemy cold resistance. The best-in-slot helm for any cold build, and it fits here as well as it does on a Sorceress.",
              sockets: "A cold Rainbow Facet.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "peace" }, why: "+2 Amazon skills and hit recovery, still unbeaten for three runes." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce, which on this build is 33% more bursts as well as more arrows." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and up to +30 all resistances — skills for the burst, resistances for Hell." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, attack rating and mana." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "Life and a raised maximum fire resistance on a character with no shield." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "75% in all four, and life for the packs that do not freeze." }],
      nextUpgrade: "An Ice runeword, which is the only bow made for this build.",
      notes:
        "**M'avina's Battle Hymn is the set most often associated with this build.** Its bow and its bonuses aim at exactly this skill, and it is a legitimate way to play — but this site does not catalogue set items yet, and publishing a set page whose stat lines are not verified would be worse than saying so. If you have the set, its own bow replaces the weapon slot here and the rest of this list still applies.",
    },

    {
      tier: "budget",
      goal: "−enemy cold resistance, and mana that stops being a problem.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "ice" },
              why: "**−20% enemy cold resistance and +25-30% Cold Skill Damage**, plus a Holy Freeze aura that chills whatever the burst misses. The bow this build has been waiting for.",
              sockets: "Amn, Shael, Jah, Lo into a 4-socket bow.",
              alternatives: [
                { ref: { kind: "runeword", slug: "faith" }, why: "More attack speed and attack rating and no cold damage at all. The choice if Guided Arrow is doing most of your killing." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "nightwings-veil" }, why: "+2 skills, cold skill damage and −enemy cold resistance, with a facet in the socket." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 skills and +65 all resistances, which is what lets the rest of this list be selfish.",
              alternatives: [{ ref: { kind: "runeword", slug: "peace" }, why: "Keep it until the runes exist. +2 Amazon skills is most of what Chains of Honor gives you here." }],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves: 20% Increased Attack Speed, mana leech",
              why: "Attack speed and the mana a fifty-cost skill drinks.",
              lookFor: ["20% Increased Attack Speed", "Mana Stolen per Hit"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce, and every pierce is another burst." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, attack rating, mana." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and +25% maximum mana, which is the single most useful ring line on this build." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find on a build that is safe enough to farm anywhere." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Bow and Crossbow skill grand charms", why: "Every skill level is damage and freeze length together." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, which also raises the mana pool this build lives on." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "Cold facets in every socket, and a Cold Rupture for the zones that need it.",
    },

    {
      tier: "optimized",
      goal: "Enemy cold resistance stacked down as far as it goes.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "ice" },
              why: "A +30% Cold Skill Damage roll. Its −20% enemy cold resistance stacks with the helm's and with every facet.",
              lookFor: ["+30% to Cold Skill Damage", "+210% Enhanced Damage"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "nightwings-veil" }, why: "+15% Cold Skill Damage and −enemy cold resistance, socketed with a cold facet." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves: 20% Increased Attack Speed, mana leech, resistances",
              why: "Speed, mana and resistances from one slot.",
              lookFor: ["20% Increased Attack Speed", "Mana Stolen per Hit"],
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
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and the mana pool." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Bow and Crossbow skill grand charms with life", why: "Skills and life in one row." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "The last facets, and a Cold Rupture if the zone you want is closed to you.",
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
              ref: { kind: "runeword", slug: "ice" },
              why: "A maximum-roll Ice in the fastest 4-socket bow your Dexterity reaches.",
              lookFor: ["+30% to Cold Skill Damage"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "nightwings-veil" }, why: "A +15% Cold Skill Damage roll with a cold facet in it." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves: 20% Increased Attack Speed, mana leech, two resistances",
              why: "The slot with no unique worth wearing, at its best.",
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
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and mana." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { ref: { kind: "unique", slug: "cold-rupture" }, why: "The cheapest of the six to carry in practice, because cold damage in Hell mostly arrives as a chill. Swap it in for a cold-immune zone and leave it in the stash otherwise." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      notes:
        "**Everything left is skill level and enemy resistance**, and the two do different jobs: skill levels raise the damage and the radius, and −enemy cold resistance is what keeps them landing on the things that resist. Attack speed remains a per-bow question and always will be — an Ice in a Grand Matron Bow and an Ice in a Crusader Bow reach their frames at different totals.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Insight is not optional on this build.** Freezing Arrow costs 36 mana at level 1 and 55 at level 20, and the Meditation aura from an Insight is the difference between firing continuously and firing in bursts between potions. Beyond that, take **Might** so his physical damage kills the cold immunes, and give him a **Fortitude** or a **Treachery** with a **Vampire Gaze** to keep him standing. **Holy Freeze is redundant here** in a way it is not elsewhere — you are already freezing everything — so Might is the clear choice even in hardcore.",

  farming: [
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85, dense and self-contained, and its regular population carries fire and poison immunity rather than cold. The natural home for this build, as it is for a Blizzard Sorceress.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Area level 85, the densest zone in the game, and no cold immunity in its regular population — its immunities are fire, lightning and physical. Freezing a seal pack is the safest way anyone clears this room.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "A herd that stops moving is a herd you kill at your own pace, and nothing here resists cold.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "mephisto",
      difficulty: "hell",
      why: "A twenty-second run against a target that is not cold immune, and the freeze makes the moat trick redundant.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are fire and lightning immune rather than cold, and they stand close enough together for one burst to catch all of them.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and short, but its population includes cold immunes — a zone where Guided Arrow does a real share of the work.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "The best experience in the game and dense enough to freeze, but every immunity type appears here including cold. Sunder charm territory.",
      minTier: "optimized",
      rating: 3,
    },
  ],

  immunityPlan:
    "Cold is among the least-resisted elements in Hell, so this build meets fewer walls than a fire or lightning one — and it still has two answers rather than none. **Guided Arrow is pure physical**, on the same bar, maxed, and unable to miss; against a cold immune it is not a fallback so much as a second main skill, which is why the plan spends twenty points on it. **−enemy cold resistance stacks, and it is applied after the immunity check rather than before it**: an Ice runeword is −20%, a Nightwing's Veil is more, and cold facets add further. That cannot break a true immunity at any total — against a monster that is still immune the whole stack is skipped rather than reduced — but it keeps the burst relevant against everything merely resistant, which is most of Hell, and it lands at full value the moment a Cold Rupture or a Conviction has broken the immunity for it. A **Cold Rupture** sunder charm is the direct fix and the cheapest of the six to carry, because cold damage in Hell mostly arrives as a chill rather than as the thing that kills you.",

  hardcoreNotes:
    "**The safest Amazon on the site, and one of the safest characters in the game.** A frozen monster is not attacking anybody, and the radius is wide enough that a whole pack stops at once. The two things that still kill this build are cold immunes, which do not freeze, and mana — running dry mid-pack means standing in a room full of unfrozen monsters with no button to press. Carry an Insight mercenary, keep mana potions in the belt, and treat a cold-immune pack as a reason to leave rather than a puzzle to solve. Might on the mercenary rather than Holy Freeze; you are already the source of the chill.",

  selfFoundNotes:
    "Very good. Edge, Melody, Peace and Insight are all low-rune runewords, Buriza-Do Kyanon drops from late Nightmare and gives free pierce, and Nightwing's Veil — the best-in-slot helm — is a realistic Hell find. Ice is the one item genuinely out of reach at four runes topped by a Jah, and the build works without it because cold is not heavily resisted to begin with. Guided Arrow costs nothing but skill points and covers the immunes.",

  levelingPath: {
    summary:
      "Cold Arrow from level 6 and Multiple Shot from 6 carry the first two acts, and both are kept — Cold Arrow as the damage synergy, Multiple Shot as a prerequisite you still press. Ice Arrow at 18 is a genuine upgrade and not just a stepping stone. **Freezing Arrow itself does not exist until level 30**, so the build's identity arrives late even though nothing before it is wasted.",
    respecAt: "Not needed. Keep the tokens.",
  },

  confidence: "verified",
  complete: true,
};
