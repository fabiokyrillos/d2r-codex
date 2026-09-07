import type { Build } from "@/lib/types";

/**
 * The Fire Trapsin.
 *
 * WHY THIS IS NOT THE LIGHTNING TRAPSIN WITH DIFFERENT COLOURS
 * -----------------------------------------------------------
 * The two builds lay their traps in opposite shapes, and the reason is a single
 * column in `missiles.json`.
 *
 *   `wake of destruction` and `wake of destruction maker`  NextHit 1, NextDelay 4
 *   `inferno sentry 1`                                     no NextHit, no NextDelay
 *
 * Wake of Fire's wave carries the standard four-frame next hit delay. One
 * monster can be hit by Wake of Fire waves at most once every four frames, and
 * that ceiling is per monster, not per trap — so the fifth trap laid on the same
 * square adds nothing to the thing standing on it. Wake of Inferno carries no
 * next hit delay at all, so five of those on one target all land.
 *
 * The column was calibrated against known values before being used: the same
 * file gives `chainlightning`, `frostnova` and `poisonnova` a NextDelay of 4 and
 * `tornado` 25, which are the figures those skills are published with
 * everywhere. Inside this class, `shock field on ground` is 25 — a full second.
 *
 * So: **Wake of Fire covers ground and Wake of Inferno stacks.** The Lightning
 * Trapsin's whole craft is putting five traps on one square; this build's is
 * putting five traps across a line the pack has to walk through, and then
 * switching to a stacked Wake of Inferno the moment the target is one thing
 * that does not walk. That is a different rotation, a different terrain
 * preference, and a different answer to a boss.
 *
 * VERIFIED AT TIER 1 (`skills.json` / `missiles.json` @ blizzhackers/d2data fc46999)
 * ---------------------------------------------------------------------------------
 * - **Wake of Fire and Wake of Inferno each feed the other and both are fed by
 *   Fire Blast.** `EDmgSymPerCalc` on Wake of Fire names Fire Trauma and Inferno
 *   Sentry at `Param8 = 10`; on Wake of Inferno it names Fire Trauma and Wake of
 *   Fire Sentry at `Param8 = 18`. The three maxed skills are a closed triangle,
 *   which is why the core has no loose synergy in it.
 * - **Fire Blast takes 11% per point from all five traps**, so the two fire
 *   sentries alone are +440% on it before any package.
 * - **Five shots per Wake of Fire, ten per Wake of Inferno** (`Param1`,
 *   cross-checked against each sub-skill's `Param8`).
 * - **`petmax = 5`, shared across every sentry.** Running both fire traps
 *   divides the same five slots.
 * - **Wake of Inferno is `HitShift 4`, not 8.** Its damage row is tabulated on a
 *   sixteenth of the usual scale, so the published figure is *per tick* over a
 *   40-frame missile (`Param3 = 40`), not per shot. It must never be compared
 *   with Wake of Fire's per-wave number without saying so, and this page says so
 *   everywhere it quotes one.
 * - **The trap rows read the owner's fire pierce and mastery.** Wake of Fire and
 *   Wake of Inferno both carry `passivecalc1 = stat('item_pierce_fire_immunity')`,
 *   `passivecalc2 = stat('passive_fire_pierce')` and
 *   `passivecalc3 = stat('passive_fire_mastery')`. That is why a fire facet works
 *   on a trap at all — a sentry is a pet, and pets do not normally inherit their
 *   owner's damage stats — and it is why the Sunder Charm reaches them.
 *
 * THE ARITHMETIC
 * --------------
 *   Fire Blast 20, Wake of Fire 20, Wake of Inferno 20                = 60
 *   Shock Web 1, Charged Bolt Sentry 1, Lightning Sentry 1,
 *     Death Sentry 1        (Death Sentry's prerequisite chain)       =  4
 *   Claw Mastery, Burst of Speed, Fade, Weapon Block, Psychic Hammer,
 *     Cloak of Shadows, Shadow Warrior, Mind Blast, Shadow Master     =  9
 *                                                                      --
 *                                                                      73
 *
 * Thirty-seven are left, which is a third of the character, and each of the
 * three packages costs exactly thirty-seven.
 *
 * SPEED
 * -----
 * Trap laying is attack speed — see `docs/research/07-assassin.md` §5 and
 * `scripts/trap-speed.test.ts`. It matters more here than on the Lightning
 * Trapsin, because covering ground means laying more traps in more places
 * rather than five on one square.
 */
export const fireTrapsin: Build = {
  slug: "fire-trapsin",
  name: "Fire Trapsin",
  classSlug: "assassin",
  summary:
    "Wake of Fire lays a line of ground waves the pack has to walk through; Wake of Inferno stacks five jets on the one thing that will not walk. The Assassin's answer to a lightning-immune world, and the build she levels as.",
  damageTypes: ["fire", "lightning", "physical"],
  primarySkill: "wake-of-fire",
  playstyle:
    "You read the room before you lay anything. Wake of Fire throws waves along the ground, and a monster can only be hit by those waves once every four frames however many traps are running — so five traps on one square is four traps wasted, and five traps spread across the mouth of a corridor is a wall of fire nothing crosses intact. You lay across the path, not on the pack, and you back up while they come to you. Then the room ends and a boss is standing there not walking anywhere, and the rotation inverts completely: five Wake of Infernos on the same spot, which do stack, plus Fire Blast thrown by hand while they burn. Two skills, two opposite shapes, and knowing which one you are in is the whole build.",
  strengths: [
    "**It costs no respec and wastes no point.** The three skills it maxes are the three it levels on, so a point spent at level 12 is still working at 99 — which the Lightning Trapsin cannot say",
    "**It is the build you level as**, so the first sixty levels are not a detour — see the walkthrough",
    "Wake of Inferno has no next hit delay, so it stacks on a boss where Wake of Fire cannot",
    "Fire Blast is a real skill here, not just a synergy: +440% from the two fire sentries before any package",
    "Fire facets and −% enemy fire resistance genuinely reach the traps, which is unusual for a pet",
  ],
  weaknesses: [
    "**Wake of Fire's four-frame next hit delay caps what one monster can take**, so this build cannot burst a single target the way the Lightning Trapsin can",
    "It asks more of your positioning than any other trap build. Waves laid where nothing will walk are waves you did not lay",
    "Five traps in total, not five per skill. Running both fire sentries divides the same five",
    "Wake of Inferno's published damage is per tick and looks small next to numbers that are not — comparing it to anything requires care",
    "No Fire Mastery on this class, and no Conviction you can wield",
    "**Fire is the commonest immunity on this site's own area census** — thirteen of twenty farming areas list it, against lightning's eight. This build needs an immunity plan more than its lightning sibling does, not less",
  ],
  difficulty: "moderate",
  budget: "low",
  ratings: {
    clearSpeed: 4,
    bossing: 3,
    survivability: 4,
    magicFind: 3,
    terrorZones: 4,
    ubers: 1,
    soloSelfFound: 5,
    players8: 3,
  },

  skills: [
    {
      skill: "wake-of-fire",
      points: 20,
      role: "main",
      order: 1,
      note: "**Five waves per trap, and a four-frame next hit delay on the wave.** That delay is the build: one monster can only be hit six times a second by Wake of Fire no matter how many traps are down, so the traps go *across* the path rather than on top of each other. Fed 10% per hard point by Fire Blast and by Wake of Inferno, both maxed here, for +400%.",
    },
    {
      skill: "wake-of-inferno",
      points: 20,
      role: "main",
      order: 2,
      note: "**No next hit delay at all**, which is exactly what Wake of Fire lacks — so this is the trap that stacks, and the answer to anything that stands still. Ten shots each. Fed 18% per hard point by Fire Blast and Wake of Fire for +720%. Its damage row shifts by 4 rather than 8, so the figure the game shows is **per tick** over a 40-frame missile, not per shot.",
    },
    {
      skill: "fire-blast",
      points: 20,
      role: "main",
      order: 3,
      note: "**A synergy that is also a button.** It feeds Wake of Fire at 10% and Wake of Inferno at 18% per hard point, so these twenty points are mandatory whatever else you do — and they leave you holding a thrown bomb that takes 11% per point from all five traps, is not a sentry, does not use a trap slot, and has no next hit delay. It is what you press at something the field cannot reach.",
    },
    {
      skill: "shock-web",
      points: 1,
      role: "prerequisite",
      order: 4,
      note: "Charged Bolt Sentry's gate, on the way to Death Sentry. Worth knowing that its ground missile carries a **25-frame** next hit delay — a full second — which is the longest in the tree and the reason it is never a clear skill.",
    },
    {
      skill: "charged-bolt-sentry",
      points: 1,
      role: "prerequisite",
      order: 5,
      note: "Lightning Sentry's gate. One point, and you will not cast it.",
    },
    {
      skill: "lightning-sentry",
      points: 1,
      role: "prerequisite",
      order: 6,
      note: "Death Sentry's gate. **The Death Sentry package takes it to nineteen**, where it stops being a prerequisite and becomes the second element this build otherwise lacks.",
    },
    {
      skill: "death-sentry",
      points: 1,
      role: "utility",
      order: 7,
      note: "**Four points of prerequisite for the best single point in the class.** Its corpse explosion is 40–80% of the dead monster's own life, half fire and half physical, and it does not scale with this skill's level — so one point is the whole chain. The physical half is the reason it still works in a fire-immune pack, provided something in that pack has died.",
    },
    {
      skill: "claw-mastery",
      points: 1,
      role: "prerequisite",
      order: 8,
      note: "The gate on the entire Shadow tree.",
    },
    {
      skill: "burst-of-speed",
      points: 1,
      role: "utility",
      order: 9,
      note: "**Fade's prerequisite, and on this build a genuine choice rather than a formality.** It adds as much as 60% attack speed undiminished, and attack speed is trap-laying speed — though what those points buy in frames depends on the claw base you are holding, which the breakpoint note below sets out. It matters more to a build that lays across ground than to one that lays on a spot. Fade and Burst of Speed cannot both be up.",
    },
    {
      skill: "fade",
      points: 1,
      role: "utility",
      order: 10,
      note: "Resistances, curse length reduction and 1% physical damage reduction per level. **The Fade package takes it to twenty**; the cost is the laying speed Burst of Speed was giving you, because casting either one drops the other, and the page says which trade to make where.",
    },
    {
      skill: "weapon-block",
      points: 1,
      role: "prerequisite",
      order: 11,
      note: "**Not shield block** — its own passive, gated on a claw in each hand, and off entirely the moment a Spirit shield goes on. One point, as Shadow Warrior's gate.",
    },
    {
      skill: "psychic-hammer",
      points: 1,
      role: "prerequisite",
      order: 12,
      note: "Cloak of Shadows' gate, and the only reason it is on the plan.",
    },
    {
      skill: "cloak-of-shadows",
      points: 1,
      role: "utility",
      order: 13,
      note: "Blinds a screen and cuts its defence. **The Fade package takes it to nineteen**, where the blind lasts long enough to cover a whole corridor's worth of laying.",
    },
    {
      skill: "shadow-warrior",
      points: 1,
      role: "prerequisite",
      order: 14,
      note: "Shadow Master's gate. They share a pet type with a ceiling of one, so this point buys the better of the two rather than a second body.",
    },
    {
      skill: "mind-blast",
      points: 1,
      role: "utility",
      order: 15,
      note: "**Used differently here than on the lightning build, and getting it wrong is the commonest mistake.** A stunned pack does not walk, and this build needs the pack to walk across the waves. So you stun them *after* they are standing in the field, not before — or you do not stun at all and let them come.",
    },
    {
      skill: "shadow-master",
      points: 1,
      role: "utility",
      order: 16,
      note: "One point, and its resistances still climb toward 90%. **Warning specific to this build: it shares your five-trap ceiling and lays its own traps**, so it can replace a Wake of Inferno you wanted with something weaker.",
    },
  ],

  skillPackages: [
    {
      id: "the-last-thirty-seven",
      name: "The third of the character the core does not spend",
      choose: "one",
      intro:
        "The core above is 73 of 110, and the fire half of it is **finished**: Wake of Fire and Wake of Inferno each feed the other, Fire Blast feeds both, and all three are maxed, so no further point anywhere raises the two skills you actually clear with. Thirty-seven are left — a third of the character. **Take exactly one of the three below.** Each costs exactly thirty-seven, so the plan closes at 110 whichever you take, and each buys something the core genuinely cannot do: a second element, a body that survives Hell, or control of where the pack is standing.",
      packages: [
        {
          id: "death-sentry",
          name: "Death Sentry",
          when: "The default, and the answer to fire immunity. Take it unless you are on Hardcore or you already know your resistances are fine.",
          tradeoff:
            "It spends thirty-seven points outside the fire tree, and the lightning sentry it turns on competes for the same five trap slots your fire traps want. You are buying a second element, and paying for it in slots.",
          skills: [
            {
              skill: "death-sentry",
              points: 20,
              role: "main",
              order: 1,
              note: "Nineteen points on top of the core's one. **They do not raise the corpse explosion** — that is a flat 40–80% of the dead monster's life at every level. What they buy is radius, at half a yard per level from a base of five, and the lightning half of the skill.",
            },
            {
              skill: "lightning-sentry",
              points: 19,
              role: "synergy",
              order: 2,
              note: "**Death Sentry's only synergy, at 12% per hard point** — eighteen more points is +216% on its lightning half. It also feeds Fire Blast another 11% per point, which is the part people miss: this package quietly makes your thrown bomb nearly twice as hard.",
            },
          ],
          rotationNote:
            "One Death Sentry goes down with every field, and it is the trap you replace last. Against a fire-immune pack you now have two jobs: kill one thing with lightning, then let the corpse chain do the rest.",
          gearNote:
            "Nothing changes, which is most of the case for this route. It is thirty-seven skill points buying an immunity answer that no gear slot has to pay for.",
          statNote: "No change.",
          contentNote:
            "Hell Terror Zones with mixed immunities, the Pit, and anywhere a fire-immune pack can corner you.",
        },
        {
          id: "fade",
          name: "Fade and Cloak",
          when: "Hardcore, and any character whose resistances are being held together by rings and charms that could be doing something else.",
          tradeoff:
            "It does nothing whatsoever about fire immunity — a Fade Trapsin in a fire-immune Terror Zone is a spectator. It also costs you Burst of Speed, and therefore trap-laying speed, because the two buffs cannot both be up.",
          skills: [
            {
              skill: "fade",
              points: 20,
              role: "main",
              order: 1,
              note: "**All four resistances climbing toward 75%, curse length cut by up to 90%, and 1% physical damage reduction per level.** Nineteen points on the core's one, and the physical reduction is the half that matters in the Chaos Sanctuary.",
            },
            {
              skill: "cloak-of-shadows",
              points: 19,
              role: "utility",
              order: 2,
              note: "**The right partner for Fade on this build specifically.** A blinded pack still walks, which is exactly what a Wake of Fire line needs — unlike a stun, the blind does not freeze them off your waves. Eighteen points buys the duration to cover a whole corridor.",
            },
          ],
          rotationNote:
            "Cloak first, then lay the line, then back up. You are no longer stunning anything, which on this build is a feature.",
          gearNote:
            "**The largest gear change of the three, in what it stops you needing.** Twenty points of Fade is resistance you no longer buy on rings, amulet and charms, so those slots go to fire damage and to the Increased Attack Speed that lays the field faster.",
          statNote: "No change. Vitality with everything after gear requirements.",
          contentNote: "Hardcore, the Chaos Sanctuary, and Hell Terror Zones you intend to stand in.",
        },
        {
          id: "shadow-master",
          name: "Shadow Master and Mind Blast",
          when: "Eight-player games and open ground, where the problem is not what you can kill but whether anything walks where you put the fire.",
          tradeoff:
            "The least measurable of the three, and it has a specific cost this build does not share with its lightning sibling: **the Shadow Master lays its own traps into your five-slot ceiling**, so a bodyguard you invested thirty-seven points in can overwrite the Wake of Inferno you wanted.",
          skills: [
            {
              skill: "shadow-master",
              points: 20,
              role: "main",
              order: 1,
              note: "Resistances from 5% toward 90% — above the player cap — plus 15% life and 40% attack rating per level. It picks Assassin skills of its own rather than mirroring yours.",
            },
            {
              skill: "mind-blast",
              points: 19,
              role: "utility",
              order: 2,
              note: "**Stun radius, stun length and up to 40% conversion.** On this build the conversion is worth more than the stun: a converted monster fights for you *and* keeps moving, and a pack that keeps moving keeps crossing your waves.",
            },
          ],
          rotationNote:
            "Lay the line first, then Mind Blast into it to hold what is already standing on fire. Reversing those two is the mistake — a pack stunned at range stands still somewhere you did not lay anything.",
          gearNote: "No change.",
          statNote: "No change.",
          contentNote: "Players-8 games, open outdoor Terror Zones, and Worldstone Keep.",
        },
      ],
    },
  ],

  flexPoints: [
    "**There are no flex points.** The core is 73, each package costs exactly 37, and 73 + 37 = 110. If your skill screen shows an unspent point, one of the three routes above is not finished.",
    "**Do not split the thirty-seven across two packages.** Death Sentry at ten is the same corpse explosion with a smaller radius, and Fade at ten is half the physical damage reduction — that half of the skill is flat, a point per level, so the second ten buys exactly what the first did. Each of the three is worth taking whole and none is worth half.",
    "**Fire Blast's remaining synergies are the tempting wrong answer.** Shock Web, Charged Bolt Sentry and Lightning Sentry each add 11% per point to Fire Blast, so thirty-seven points there would nearly double your thrown bomb. It is still wrong: Fire Blast is one target at a time, and all three packages buy something that scales with the whole room.",
    "**Venom is not on this page.** It adds poison to *attacks*, and this character makes none — traps are summons and their damage is not yours.",
    "**Fire Mastery does not exist on this class.** There is no Assassin equivalent of the Sorceress's mastery, which is why the immunity plan leans on the Sunder Charm rather than on stacking your own damage.",
  ],

  stats: {
    strength: "Exactly enough for the body armour you intend to wear and nothing beyond it. A three-socket Dusk Shroud for Treachery is the usual target.",
    dexterity:
      "**None.** No weapon to land, and no block chance this plan funds — see the note below.",
    vitality: "Everything else, at 3 life per point.",
    energy: "None. Insight on the mercenary solves the mana bill entirely.",
    notes: [
      "**Weapon Block is not shield block and this plan does not fund it.** It is its own passive, it needs a claw in each hand, and a Spirit shield turns it off. No Dexterity is spent chasing a number this site cannot compute.",
      "**This build's mana bill is higher than the Lightning Trapsin's**, because covering ground means re-laying more often and from more places. Insight is not optional and Meditation is the whole plan.",
      "A Call to Arms on the weapon swap is Battle Orders, and Battle Orders is life on a character with the second-smallest life pool in the game.",
    ],
  },

  breakpoints: [
    {
      stat: "fcr",
      value: 65,
      frames: 11,
      priority: "recommended",
      why: "**For Mind Blast and Cloak of Shadows, not for the traps.** Cast rate shortens the Assassin's `SC` animation and nothing else; 16 frames becomes 11. It does not affect how fast a trap goes down — see the note below, which is where this build's real speed stat is.",
    },
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "recommended",
      why: "The standard target on the table the Assassin shares with the Paladin and the Barbarian. You lay from behind the line, but the moment something reaches you, recovery is what lets you finish it.",
    },
  ],
  breakpointNotes:
    "**Trap-laying speed is attack speed, and it matters more here than on the Lightning Trapsin.** That build puts five traps on one square; this one lays across ground and re-lays as the pack moves, so laying speed is closer to being the clear speed. A trap plays the Assassin's `S2` animation, which runs on the attack-speed calculation — the claw's own base speed, Increased Attack Speed from gear, and Burst of Speed. Faster Cast Rate does not touch it. There is no Increased Attack Speed row above because the claw's base speed is an input to the same formula, so a single percentage would be wrong for most readers. Concrete instead, all derived, all with no Burst of Speed up: **two Runic Talons or Greater Talons** (base speed −30) lay a trap in 12 frames bare and 9 frames at 42% IAS; **two Feral or Greater Claws** (−20), 13 bare and 9 at 63%; **a Suwayyah, Quhab, Cestus or Wrist Blade** (0), 15 bare and 9 at 125%; **two Hatchet Hands or Fascia** (+10), 17 bare and 9 only at 174%. Five frames of spread before a single point of IAS is bought — the base is worth more than the affix. Three rules decide whether the IAS you own counts: two claws use the **average** of both bases; Increased Attack Speed on the **off-hand claw does not count at all**; and **Burst of Speed adds as much as 60% undiminished**, which is roughly two frames — and since it cannot be up at the same time as Fade, those two frames are the real price of the Fade package. Being chilled slows the animation, so Cannot Be Frozen protects laying speed. For claws other than these four, use an attack-speed calculator and give it the base, both claws' IAS, and your Burst of Speed level.",

  gearSets: [
    {
      tier: "starter",
      goal: "Reach Wake of Inferno at 24 with resistances intact. Nothing here costs more than three Countess runes.",
      levelRange: [1, 30],
      nextUpgrade: "A claw with +3 to Wake of Fire, and Spirit the moment you are 25.",
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any claw with +3 to Wake of Fire or +2 to Traps",
              why: "The single largest damage item you will hold, and it comes from a vendor. Claws roll Assassin skills natively, and Charsi and Akara restock every time you re-enter town.",
              lookFor: ["+3 to Wake of Fire", "+2 to Traps", "+3 to Fire Blast"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "Three Countess runes for resistances that carry you into Nightmare.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to all skills and lightning resistance, for two runes." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Faster hit recovery, faster run and mana regeneration, for two of the commonest runes in the game." }],
        },
        {
          slot: "gloves",
          picks: [{ label: "Any gloves with resistances or 20% Increased Attack Speed", why: "Attack speed is laying speed. This early, resistances usually win; from Nightmare on, the IAS does." }],
        },
        {
          slot: "belt",
          picks: [{ label: "Any belt with life and resistances", why: "Four rows and something to fill them with." }],
        },
        {
          slot: "boots",
          picks: [{ label: "Any boots with faster run/walk and resistances", why: "You do a great deal of walking backwards on this build." }],
        },
        {
          slot: "ring1",
          picks: [{ label: "Any ring with resistances or life", why: "Nothing clever needed yet." }],
        },
        {
          slot: "ring2",
          picks: [{ label: "Any ring with resistances or life", why: "As above." }],
        },
        {
          slot: "amulet",
          picks: [{ label: "Any amulet with +1 to Assassin skills or resistances", why: "+1 to Assassin skills is worth more than any single resistance here." }],
        },
      ],
    },
    {
      tier: "nightmare",
      goal: "Two Spirits if you can, 65% cast rate for Mind Blast, and Treachery once three mid runes exist.",
      levelRange: [30, 60],
      nextUpgrade: "Resistances to 75% before Hell, and a faster claw base.",
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Rare or magic claw on a fast base: +3 Wake of Fire, +3 Wake of Inferno",
              why: "Still a vendor roll, and still the biggest item on the character. **Prefer a fast base** — Greater Talons and Greater Claws lay two to three frames faster than a Suwayyah before any affix is counted.",
              lookFor: ["A Greater Talons or Greater Claws base", "+3 to Wake of Fire", "+3 to Wake of Inferno", "+2 to Traps"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 to All Skills and up to 35% Faster Cast Rate at level 25. The skills are the damage; the cast rate is for Mind Blast.",
            },
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "Resistances for three Countess runes, if Amn has not appeared yet.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 to all skills and magic find while nothing better exists." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "treachery" },
              why: "**+2 to Assassin Skill Levels, 45% Increased Attack Speed, and a Fade proc when struck.** All three halves land on this build: the skills are damage, the attack speed is laying speed, and the Fade is resistance you did not have to press.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ label: "Any gloves with 20% Increased Attack Speed", why: "Laying speed, and gloves are the cheapest place to buy it. Magefist is the alternative if you would rather have the cast rate for Mind Blast." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana while the mercenary's Insight is still being assembled." }],
        },
        {
          slot: "boots",
          picks: [{ label: "Any boots with faster run/walk and two resistances", why: "Movement and resistances. Kick damage on boots is irrelevant — nothing on this page kicks." }],
        },
        {
          slot: "ring1",
          picks: [{ label: "Any ring with resistances and life", why: "Resistances are the Nightmare problem." }],
        },
        {
          slot: "ring2",
          picks: [{ label: "Any ring with resistances and life", why: "As above." }],
        },
        {
          slot: "amulet",
          picks: [{ label: "Any amulet with +2 Assassin skills", why: "+2 to Assassin skills raises every trap on the bar." }],
        },
      ],
    },
    {
      tier: "early-hell",
      goal: "75% resistances, an answer for fire immunes, and a claw base you are not ashamed of.",
      levelRange: [60, 75],
      nextUpgrade: "Fire facets, and an amulet that is not carrying resistances on its own.",
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Rare claw on a fast base: +3 Wake of Fire, +3 Wake of Inferno, 20% Increased Attack Speed",
              why: "Four affixes on a vendor item, and no runeword in the game beats it for this build.",
              lookFor: ["A Greater Talons or Runic Talons base", "+3 to Wake of Fire", "+3 to Wake of Inferno", "20% Increased Attack Speed"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills and 35% cast rate. Note it turns Weapon Block off; on this build that is the right trade." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 to all skills, life, mana and damage reduction. The best generalist helm in the game." }],
        },
        {
          slot: "body",
          picks: [
            { ref: { kind: "runeword", slug: "treachery" }, why: "+2 Assassin skills, 45% attack speed and the Fade proc, for three mid runes." },
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "+1 skills, 30% cast rate and up to +35 all resistances — the resistance answer if you did not take the Fade package.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ label: "Any gloves with 20% Increased Attack Speed and resistances", why: "Laying speed first, resistances second." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduction and life leech that the mercenary's aura cannot supply." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster hit recovery, stamina and two resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ label: "Rare ring: two resistances, life, mana", why: "Resistances are still the wall in early Hell." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, which **protects trap-laying speed** — being chilled slows the animation." }],
        },
        {
          slot: "amulet",
          picks: [{ label: "Rare amulet: +2 Assassin skills and two resistances", why: "Two jobs in one slot while the rest of the plan is still resistances." }],
        },
      ],
      charms: [
        {
          ref: { kind: "unique", slug: "flame-rift" },
          why: "**The fire Sunder Charm, and the cleanest answer this build has to immunity.** It sets fire-immune monsters to 95% fire resistance, at 70 to 90 points of your own fire resistance and a charm slot. Note that Patch 3.3 restricted Latent Sunder Charm magic-find drops to Hell, and it requires level 75.",
        },
      ],
    },
    {
      tier: "budget",
      goal: "Fire facets in every socket that takes one, and resistances comfortably over the cap.",
      levelRange: [75, 85],
      nextUpgrade: "Chains of Honor, and the last few points of laying speed.",
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Rare claw on a fast base: +3 Wake of Fire, +3 Wake of Inferno, +2 Traps, 20% Increased Attack Speed",
              why: "Unchanged, because there is nothing to upgrade to. The claw is a vendor roll and it stays best in slot to the end.",
              lookFor: ["A Runic Talons base", "+3 to Wake of Fire", "+3 to Wake of Inferno", "+2 to Traps", "20% Increased Attack Speed"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Still the answer, and a fire facet in the fourth socket if you have one to spare." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "Socket it with a fire facet — **the traps read your fire pierce**, which is why this works at all on a pet." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "+2 Assassin skills, attack speed and the Fade proc. Still the best three runes on the page." }],
        },
        {
          slot: "gloves",
          picks: [{ label: "Crafted or rare gloves: 20% Increased Attack Speed and two resistances", why: "Laying speed and resistances in one slot." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to all skills and 20% Faster Cast Rate. The +1 is the reason." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and faster run/walk, on a build that walks backwards a great deal." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills and mana. Every trap on the bar goes up." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, protecting laying speed, plus attack rating you do not need and Dexterity you do not spend." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 to all skills and +20 to all resistances. Two problems, one slot." }],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "flame-rift" }, why: "Carry it for fire-immune zones and swap it out when the zone does not need it — the 70 to 90 points of your own fire resistance are real." },
        { label: "Small charms with fire skill damage and life", why: "The cheapest fire damage per inventory square available to this build." },
      ],
    },
    {
      tier: "optimized",
      goal: "Chains of Honor, facets everywhere, and laying speed at nine frames.",
      levelRange: [85, 99],
      nextUpgrade: "Enigma, if you would rather teleport to the corridor than walk to it.",
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Rare Runic Talons: +3 Wake of Fire, +3 Wake of Inferno, +2 Traps, 20% Increased Attack Speed",
              why: "Still the best weapon in the game for this build, and still not a runeword. On a Runic Talons base, nine-frame laying costs 42% Increased Attack Speed — which Treachery alone covers.",
              lookFor: ["A Runic Talons base", "+3 to Wake of Fire", "+3 to Wake of Inferno", "+2 to Traps", "20% Increased Attack Speed"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills, cast rate, and a fire facet in the spare socket." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills and a fire facet. Nothing displaces it." }],
        },
        {
          slot: "body",
          picks: [
            { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "**+2 to all skills, +65 all resistances and 8% damage reduction.** It is the item that makes the Fade package optional." },
            { ref: { kind: "runeword", slug: "treachery" }, why: "Keep it if the 45% attack speed is doing more for your laying speed on the claw base you actually hold than Chains of Honor's resistances are doing for your survival. On a slow base it often is." },
          ],
        },
        {
          slot: "gloves",
          picks: [{ label: "Crafted blood gloves: 20% Increased Attack Speed, two resistances, life", why: "Laying speed, resistances and life in one slot." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and movement." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen. On a build whose clear speed is its laying speed, this is not a luxury." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +20 all resistances." }],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "flame-rift" }, why: "Swapped in for fire-immune zones." },
        { label: "Fire skill damage small charms with life", why: "The last of the damage that is not a skill point." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, which is the largest life increase available to the character." },
      ],
    },
    {
      tier: "bis",
      goal: "Nothing left to fix.",
      levelRange: [90, 99],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Rare Runic Talons: +3 Wake of Fire, +3 Wake of Inferno, +2 Traps, 20% Increased Attack Speed, two open sockets",
              why: "Two fire facets in the sockets. The traps read fire pierce, so both of them count.",
              lookFor: ["A Runic Talons base", "+3 to Wake of Fire", "+3 to Wake of Inferno", "+2 to Traps", "Two sockets"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Nothing has displaced it in twenty years." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, and a fire facet." }],
        },
        {
          slot: "body",
          picks: [
            { ref: { kind: "runeword", slug: "enigma" }, why: "**Teleport, which on this build is a positioning tool rather than a movement one** — it is how you get to the far side of a corridor before the pack does. The +1 skills and the Strength are the rest." },
            { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 resistances if you would rather have the survivability than the mobility." },
          ],
        },
        {
          slot: "gloves",
          picks: [{ label: "Crafted blood gloves: 20% Increased Attack Speed, two resistances, life", why: "Unchanged. There is no unique that beats a good craft here." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and movement." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +20 all resistances." }],
        },
      ],
      charms: [
        { ref: { kind: "unique", slug: "flame-rift" }, why: "For the zones that need it." },
        { label: "Fire skill damage small charms with life", why: "Every square that is not a resistance." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
      ],
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Insight, and it is not optional.** This build re-lays more often than the Lightning Trapsin does, so its mana bill is larger, and Meditation is the whole answer. Take the Defiance variant on Nightmare — his job is to hold the far end of the corridor while the pack walks into your fire, not to kill anything. A Treachery body gives him the Fade proc as well. **Do not give him Infinity here**: Conviction lowers resistances, which is real, but it is a two-socket-runeword-worth of high runes to do what a Flame Rift charm does for immunity and a facet does for resistance.",

  farming: [
    {
      area: "pit",
      difficulty: "hell",
      why: "**The best fit on the page**, and the area data is why: the Pit's common immunities are physical, cold and lightning, and fire is not among them. Two enclosed levels at the highest area level in Act 1, which is exactly the terrain a line of ground waves wants.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "A herd that walks at you across open ground in a straight line is the single best thing that can happen to Wake of Fire, and the only common immunity here is physical. Lay across their approach and back up.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "One room, high density, and no fire among its common immunities. The corpses do half the work once Death Sentry is down, and it is the best place to learn where a line of waves wants to go.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "A short corridor, a fixed pack, and cold and poison rather than fire on the immunity list. Lay across the doorway before you open it.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "The terrain is ideal — corridors and seal approaches mean everything arrives along a line — but **fire is on this area's immunity list**, so this is the run that decides whether you took the Death Sentry package or bought a Flame Rift. With neither, expect to walk past packs.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "Poison rather than fire on the immunity list, a corridor to the throne, and a boss that stands still — which is the Wake of Inferno half of the build rather than the Wake of Fire half.",
      minTier: "nightmare",
      rating: 3,
    },
  ],

  immunityPlan:
    "**Fire immunity is the build's wall, and it is a higher wall than most fire builds admit.** This site's own area census lists fire among the common immunities in thirteen of twenty farming areas — more than any other element, and more than the lightning this build's sibling struggles with. Anyone telling you a fire trapper dodges the immunity problem has not counted. So the plan below is not optional reading, and the Death Sentry package is the default for that reason. Four answers, in order of how much they help. First, a **Flame Rift Sunder Charm** sets fire-immune monsters to 95% fire resistance and is the only thing on this list that genuinely breaks immunity; it costs 70 to 90 points of your own fire resistance and a charm slot, and it requires level 75. Second, the **Death Sentry package**: its corpse explosion is half fire and half **physical**, and the physical half lands on a fire immune — but something has to die first, which is what the package's nineteen points of Lightning Sentry are for. Third, **fire facets and −% enemy fire resistance do reach the traps**, which is not obvious: a sentry is a pet, and pets do not normally inherit their owner's damage stats, but the Wake of Fire and Wake of Inferno rows explicitly read `passive_fire_pierce` and `passive_fire_mastery` from you. Fourth, and least: **skip the pack**. Against a fire-immune Terror Zone with no Sunder Charm, walking past is the correct answer far more often than players expect. What does **not** work is stacking facets to break the immunity — reducing a 100% resistance by 20 leaves it at 100 for immunity purposes.",

  hardcoreNotes:
    "**Take the Fade and Cloak package**, and accept that you are giving up the fire-immunity answer along with the laying speed Burst of Speed was providing. The build is already safe: you never enter melee, you lay from behind the line and walk backwards, and the Shadow Master arrives first. The two things that kill a Hardcore trapper here are laying a line into a pack that is already on top of you — this build's waves need distance in a way the lightning build's do not — and Iron Maiden, which is why the Chaos Sanctuary deserves the curse-length reduction Fade provides.",

  selfFoundNotes:
    "**The strongest self-found start the Assassin has, because it is also her levelling build.** Nothing in the first three tiers is a runeword above three runes: Lore, Stealth, Ancients' Pledge, Spirit, Treachery. The weapon is a vendor claw, and vendors restock on every town entry — the thing worth hunting deliberately is a claw with +3 Wake of Fire and +3 Wake of Inferno together, on a Greater Talons or Runic Talons base. The one item on the page you cannot vendor or craft your way to is the Flame Rift, and until it drops the honest plan is to farm the zones that do not need it.",

  levelingPath: {
    summary:
      "**This is the levelling build.** Fire Blast to 11, then Wake of Fire from 12, then Wake of Inferno at 24 — the same three skills the endgame core maxes, in the order the walkthrough spends them. Unlike the Lightning Trapsin there is no respec in the plan and nothing is wasted: every point spent at level 12 is still working at level 99.",
    viaBuild: "fire-trapsin",
  },

  confidence: "verified",
  complete: true,
};
