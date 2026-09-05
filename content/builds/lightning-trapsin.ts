import type { Build } from "@/lib/types";

/**
 * The Lightning Trapsin.
 *
 * THE ARITHMETIC
 * --------------
 * The core is ninety of a hundred and ten, and it is *finished* — every synergy
 * Lightning Sentry and Death Sentry have is maxed, so no further point anywhere
 * raises either. Twenty are left, and they are the whole reason this page has
 * packages rather than a paragraph.
 *
 *   Lightning Sentry 20, Charged Bolt Sentry 20, Shock Web 20,
 *   Death Sentry 20, Fire Blast 1                                = 81
 *   Claw Mastery, Burst of Speed, Fade, Weapon Block,
 *   Psychic Hammer, Cloak of Shadows, Shadow Warrior,
 *   Mind Blast, Shadow Master, one each                          =  9
 *                                                                  --
 *                                                                  90
 *
 * Each of the three packages costs exactly 20, so every route closes at 110
 * with nothing left over and no "spend the rest wherever" line.
 *
 * VERIFIED AT TIER 1 (`skills.json` @ blizzhackers/d2data fc46999)
 * ---------------------------------------------------------------
 * - **Lightning Sentry receives 18% per hard point from Shock Web and Charged
 *   Bolt Sentry, and from nothing else.** `EDmgSymPerCalc =
 *   (skill('Shock Field'.blvl) + skill('Charged Bolt Sentry'.blvl))*par8`,
 *   `Param8 = 18`. Forty points of synergy is +720%.
 * - **Death Sentry receives 12% per point from Lightning Sentry, and from
 *   nothing else.** Its `EDmgSymPerCalc` names one skill.
 * - **The corpse explosion is 40-80% of the monster type's base life and does
 *   not scale with Death Sentry's level.** `mon death sentry` Param1 = 40,
 *   Param2 = 80, both flat, against the Necromancer's Corpse Explosion at
 *   70-120%. Param5 = 50 splits it half fire, half physical. Param3 = 10
 *   half-squares of radius with Param4 = 1 more per level — so points buy
 *   radius and the lightning half, never the corpse damage.
 * - **Ten shots per Lightning Sentry, five per Death Sentry** (`Param1`,
 *   cross-checked against each sub-skill's `Param8`, which the column comment
 *   requires to match).
 * - **`petmax = 5` on every sentry, shared.** Five traps in total, not five
 *   each, which is why Charged Bolt Sentry ends up as twenty points in a trap
 *   the finished build never lays.
 * - **Charged Bolt Sentry gains a shot per 4 hard points of Lightning Sentry**
 *   (`Param7 = 4`) and a bolt per 3 of Shock Web (`Param6 = 3`). True, and
 *   decoration once the five slots belong to Lightning and Death Sentry.
 * - **Fire Blast receives 11% per point from all five traps**, which is what
 *   makes the Fire Blast package a real answer to lightning immunity rather
 *   than a consolation prize: with Shock Web, Charged Bolt Sentry and Lightning
 *   Sentry all at 20 it is +660%.
 *
 * BREAKPOINTS
 * -----------
 * Faster Cast Rate, and the reasoning is in `docs/research/07-assassin.md` §5.
 * The site's `fcr-assassin` table already states that it covers trap laying;
 * cycle 1's note arguing otherwise from `UseAttackRate` was a misreading of a
 * column that decides whether an action can miss, not how fast it plays. No
 * Increased Attack Speed row: this character never swings anything.
 */
export const lightningTrapsin: Build = {
  slug: "lightning-trapsin",
  name: "Lightning Trapsin",
  classSlug: "assassin",
  summary:
    "Five sentries laid on one spot, ten piercing bolts each, and a Death Sentry that turns the first corpse into the whole room. The Assassin's flagship, and it needs no runeword to work.",
  damageTypes: ["lightning", "fire", "physical"],
  primarySkill: "lightning-sentry",
  playstyle:
    "You never attack. Mind Blast stuns the pack, you lay four Lightning Sentries and a Death Sentry into it, and you walk backwards while ten bolts each pierce through everything standing in line. The first thing that dies starts a chain: Death Sentry explodes corpses for a share of their own life, and in a dense room that is one cast and a cleared screen. The whole craft of the build is where you stand — bolts pierce, so a corridor is worth three times an open cavern, and traps laid where nothing will walk are traps you did not lay.",
  strengths: [
    "**No runeword is required.** A rare claw and two Spirits is the finished build; everything above that is speed",
    "Death Sentry's corpse chain clears rooms from one kill, and its damage comes from the corpse rather than from your points",
    "You fight from behind five turrets, with a stun and a blind and a bodyguard",
    "Half of Death Sentry's explosion is fire and half physical, so it still works on lightning immunes",
    "Levels into itself with one free respec — see the walkthrough",
  ],
  weaknesses: [
    "**Lightning immunity is a wall.** There is no Lightning Mastery on this class and no Conviction you can wield",
    "Five traps in total, not five per skill. Running two sentry skills divides the same five",
    "Traps are laid where you stand, so anything that moves faster than you re-aims the whole rotation",
    "Almost nothing in the Uber Tristram fight walks into a trap field, and Lister's pack does not stand still",
    "Charged Bolt Sentry is twenty points in a skill the finished build never casts. It is a synergy, and the page says so rather than pretending otherwise",
  ],
  difficulty: "moderate",
  budget: "low",
  ratings: {
    clearSpeed: 4,
    bossing: 4,
    survivability: 4,
    magicFind: 3,
    terrorZones: 4,
    ubers: 2,
    soloSelfFound: 5,
    players8: 4,
  },

  skills: [
    {
      skill: "lightning-sentry",
      points: 20,
      role: "main",
      order: 1,
      note: "**Ten shots per sentry and the bolts pierce.** That is why five go on one spot rather than spread across a room, and why a doorway kills three times faster than open ground.",
    },
    {
      skill: "charged-bolt-sentry",
      points: 20,
      role: "synergy",
      order: 2,
      note: "**18% per hard point to Lightning Sentry**, and the finished build never lays one — the five-trap ceiling belongs to Lightning and Death Sentry. Twenty points in a skill you stop casting is still the second-largest damage increase on the page. Maxed before Shock Web because during the fifty levels it takes, this one fires by itself.",
    },
    {
      skill: "shock-web",
      points: 20,
      role: "synergy",
      order: 3,
      note: "The other **18% per hard point**. Unlike Charged Bolt Sentry it is a skill you can still press — six missiles at one point, one more per four levels, and **one more per three hard points of Fire Blast**. Worth a slot on the bar even at the end.",
    },
    {
      skill: "death-sentry",
      points: 20,
      role: "main",
      order: 4,
      note: "**Maxed last, because one point already buys the whole chain reaction.** The corpse explosion is 40-80% of the monster type's base life whatever the skill level — the Necromancer's is 70-120% — and points buy radius (5 yards, +0.5 per level) and the lightning half. Half fire and half physical, which is why it keeps working on lightning immunes.",
    },
    {
      skill: "fire-blast",
      points: 1,
      role: "prerequisite",
      note: "The chain's first rung, and the only trap-tree skill at level 1. One point in the core — **and the Fire Blast package below is the one route that takes it to twenty**, where all five traps feeding it at 11% each make it a second damage type.",
    },
    {
      skill: "claw-mastery",
      points: 1,
      role: "prerequisite",
      note: "Gate on Burst of Speed and Weapon Block. Its own bonuses are melee ones this build never uses.",
    },
    {
      skill: "burst-of-speed",
      points: 1,
      role: "prerequisite",
      note: "Bought for Fade, not to run. **The two are mutually exclusive** — casting one drops the other — and a trapper runs Fade.",
    },
    {
      skill: "fade",
      points: 1,
      role: "utility",
      note: "Resistances, curse length reduction and 1% physical damage reduction per level, for two minutes a cast. One point in the core; **the Fade package takes it to twenty**, which is what a Hardcore trapper does with the spare budget.",
    },
    {
      skill: "weapon-block",
      points: 1,
      role: "utility",
      note: "**Not shield block.** Its own passive, gated on holding a claw in each hand, and it works with no shield at all. One point, because this build stands behind its traps rather than in front of them — and because a Spirit shield turns it off entirely.",
    },
    {
      skill: "psychic-hammer",
      points: 1,
      role: "prerequisite",
      note: "Cloak of Shadows' gate, and the only reason it is on the plan.",
    },
    {
      skill: "cloak-of-shadows",
      points: 1,
      role: "utility",
      note: "Blinds a screen and cuts its defence. On a build that needs three seconds of nothing happening to lay a full field, this is the second-best button after Mind Blast.",
    },
    {
      skill: "shadow-warrior",
      points: 1,
      role: "prerequisite",
      note: "Shadow Master's gate. **They share a pet type with a ceiling of one**, so the two never stand together and this point is spent to unlock the better of them.",
    },
    {
      skill: "mind-blast",
      points: 1,
      role: "utility",
      note: "**The button that makes the build work.** Radius 4, 50 frames of stun at one point, and a share of what it hits converted to fight for you. Fifty frames is exactly long enough to lay a full field into a pack that cannot move.",
    },
    {
      skill: "shadow-master",
      points: 1,
      role: "utility",
      note: "One point, and its resistances still climb toward 90% — above the player cap, which is most of why it survives Hell. It picks its own skills rather than mirroring yours. **The Shadow Master package takes it to twenty**, where it is a body that fights.",
    },
  ],

  skillPackages: [
    {
      id: "the-last-twenty",
      name: "The second half of the plan",
      choose: "one",
      intro:
        "The core above is 90 of 110 and it is **finished**: Lightning Sentry's two synergies are maxed, Death Sentry's one synergy is maxed, and no further point anywhere raises either. Twenty are left — nearly a fifth of the character. **Take exactly one of the three below.** Each costs exactly twenty, so whichever you choose the plan closes at 110 with nothing spare, and each buys a different thing the core cannot do: survive, kill what it cannot kill, or put something between you and the pack.",
      packages: [
        {
          id: "fade",
          name: "Fade",
          when: "The default, and the only answer on Hardcore. Hell applies -100% to every resistance you own, and this is the twenty points that take it back without costing a single gear slot.",
          tradeoff:
            "It does nothing at all about lightning immunity. A Fade trapper in a lightning-immune Terror Zone is a spectator, and the Fire Blast package is the one that fixes that.",
          skills: [
            {
              skill: "fade",
              points: 20,
              role: "main",
              order: 1,
              note: "**All four resistances climbing toward 75%, curse length cut by up to 90%, and 1% physical damage reduction per level.** The physical reduction is the half people forget and the half that matters most in the Chaos Sanctuary. Nineteen points on top of the core's one.",
            },
            {
              skill: "shadow-master",
              points: 2,
              role: "utility",
              order: 2,
              note: "The twentieth point, and it goes here rather than into a twenty-first of anything: the Shadow Master's own resistances scale with its level, so this route's bodyguard gets slightly tougher for free.",
            },
          ],
          rotationNote:
            "Unchanged in what you press. Changed in what you can stand in: Fade at twenty is the difference between leaving a Terror Zone and clearing it.",
          gearNote:
            "**The largest gear change of the three, in what it stops you needing.** Twenty points of Fade is resistance you no longer buy on rings, amulet and charms, so those slots go to lightning damage and Faster Cast Rate instead. It also stacks with the Treachery proc rather than replacing it.",
          statNote: "No change. Vitality with everything after gear requirements.",
          contentNote:
            "Hell Terror Zones, the Chaos Sanctuary, and every Hardcore character on the site.",
        },
        {
          id: "fire-blast",
          name: "Fire Blast",
          when: "You keep meeting lightning immunes and walking away. This is the second damage type, it needs no new prerequisite, and it changes nothing about your gear.",
          tradeoff:
            "You give up Fade at twenty, which means resistances stay a gear problem all the way to 110. It is also a button you have to aim, on a character that otherwise never aims anything.",
          skills: [
            {
              skill: "fire-blast",
              points: 20,
              role: "main",
              order: 1,
              note: "**Every trap feeds it at 11% per hard point**, and this build maxes three of them: Shock Web, Charged Bolt Sentry and Lightning Sentry, sixty points, +660%. That is a thrown bomb dealing 646-859 in a radius of 5, for nineteen points and no new prerequisite.",
            },
            {
              skill: "wake-of-fire",
              points: 1,
              role: "synergy",
              order: 2,
              note: "The twentieth point, and the only one of the three routes where the last point is not a rounding error: **Wake of Fire feeds Fire Blast at 11% too**, so this is +11% on the skill you just maxed, for one point, using a prerequisite the core already paid.",
            },
          ],
          rotationNote:
            "Two rotations now. Against anything that is not lightning immune, nothing changes. Against a lightning immune pack: Mind Blast, then throw — Fire Blast arcs to where you aim rather than waiting to be walked over, which is also what makes it the answer to anything that will not enter a trap field.",
          gearNote:
            "**No change**, which is the argument for it. Both damage types ride the same +skills, and a Hellfire Torch or an Annihilus pays for both halves at once. Fire facets are a real option in a helm if you commit, but nothing here requires them.",
          statNote: "No change.",
          contentNote:
            "The Pit, the Ancient Tunnels and any Terror Zone with a mixed immunity list. Also the fastest route through Hell for a character who has not found resistance gear yet, because it kills the packs that were previously a wall.",
        },
        {
          id: "shadow-master",
          name: "The Shadow Master",
          when: "You keep dying while laying the field rather than after it. Twenty points buys a companion whose resistances go above the player cap and whose life scales 15% per level, and it fights in front of you.",
          tradeoff:
            "The least measurable of the three. It does not raise your damage and it does not raise your resistances; it buys a body, and the site cannot put a number on how often that body is standing where you needed it.",
          skills: [
            {
              skill: "shadow-master",
              points: 20,
              role: "main",
              order: 1,
              note: "**Resistances from 5% toward 90%** — above the 75% a player can reach, which is most of why it survives Hell — plus 15% life and 40% attack rating per level. It picks Assassin skills of its own rather than mirroring yours, including traps and Mind Blast.",
            },
            {
              skill: "fade",
              points: 2,
              role: "utility",
              order: 2,
              note: "The twentieth point. This route has bought a bodyguard and not a resistance, so the one spare point goes where the resistance is.",
            },
          ],
          rotationNote:
            "Recast it after every death and after every town portal — it does not follow you between areas. Otherwise unchanged: it goes in first and you lay behind it.",
          gearNote:
            "**Nothing on your character raises it except +skills**, and it reads all of them, so a Hellfire Torch is worth more on this route than on the other two. Nothing you equip transfers to it.",
          statNote: "No change.",
          contentNote:
            "Eight-player games and dense Terror Zones, where the thing that kills a trapper is being reached before the field is down.",
        },
      ],
    },
  ],

  flexPoints: [
    "**There are no flex points.** The core is 90, each package costs exactly 20, and 90 + 20 = 110. If your skill screen shows an unspent point, one of the three routes above is not finished.",
    "**Do not split the twenty across two packages.** Fade at ten is 40% resistance instead of 75%; Fire Blast at ten is a bomb that does not kill the immune pack you took it for. Each of the three is worth taking whole and none is worth half.",
    "**Venom is not on this page**, and it is the most common wrong answer. It adds poison to *attacks*, and this character makes none — traps are summons and their damage is not yours.",
    "**Blade Fury and Blade Shield are not on this page either.** They live in the same tree, they take three quarters of your weapon damage, and this build carries a claw chosen for +skills rather than for damage.",
  ],

  stats: {
    strength: "Exactly enough for the body armour you intend to wear, and nothing beyond it. A three-socket Dusk Shroud for Treachery is the usual target; Chains of Honor and Enigma both ask for more.",
    dexterity:
      "**None.** This build has no weapon to land and no block chance it funds — see the note below, which is the part most stat advice gets wrong.",
    vitality: "Everything else, at 3 life per point.",
    energy:
      "None. The mercenary's Insight solves the mana entirely, and gear supplies more mana per point than the attribute does.",
    notes: [
      "**Weapon Block is not shield block and this plan does not fund it.** It is its own passive, it needs a claw in each hand, and it stops working the moment you equip a Spirit shield — which most gear tiers here do. Whether it reads Dexterity the way shield block does is not something the extraction settles, so no Dexterity is spent chasing a number this site cannot compute.",
      "**Insight on the mercenary is worth more than any Energy you could buy.** Meditation refills a trapper between packs, and a trapper's mana bill is five casts every few seconds.",
      "A Call to Arms on the weapon swap is Battle Orders, and Battle Orders is life. On a character with the second-smallest life pool in the game it is not a luxury.",
    ],
  },

  breakpoints: [
    {
      stat: "fcr",
      value: 65,
      frames: 11,
      priority: "required",
      why: "**Faster Cast Rate is how fast you lay traps**, not just how fast you cast Mind Blast — the Assassin's table covers both. 65% is the practical target and the difference between laying a field before the pack arrives and laying it after.",
    },
    {
      stat: "fcr",
      value: 102,
      frames: 10,
      priority: "recommended",
      why: "One frame faster, and the last row worth chasing: 174% is one further frame for nearly double the investment.",
    },
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "recommended",
      why: "The standard target on the table the Assassin shares with the Paladin and the Barbarian. You are not meant to be hit, but the moment you are, the recovery is what lets you finish the field.",
    },
  ],
  breakpointNotes:
    "**There is no Increased Attack Speed row here, deliberately.** This character never swings anything: traps are laid, Fire Blast is thrown, and Mind Blast is cast. Guides that list an IAS target for a trapper are carrying it over from the kick builds, where it is the whole gear axis. The one place attack speed would matter is Burst of Speed — and a trapper runs Fade instead, because the two cannot both be up.",

  gearSets: [
    {
      tier: "starter",
      goal: "Get to Lightning Sentry with resistances intact. Nothing here costs more than three Countess runes.",
      levelRange: [1, 45],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Magic claw: +3 Lightning Sentry, +2 Traps",
              why: "**The largest damage item in the game for this build, and it is a vendor roll.** Claw skill affixes go to +3 on a single skill and +2 on the whole tab, and Charsi restocks every time you re-enter town.",
              lookFor: ["+3 to Lightning Sentry", "+2 to Traps", "+3 to Death Sentry"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 to All Skills and up to 35% Faster Cast Rate at level 25. Cast rate is trap-laying speed here.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "ancients-pledge" },
                  why: "Resistances for three Countess runes, if the Amn is not there yet.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "25% Faster Cast Rate and 25% Faster Hit Recovery at level 17, for two of the commonest runes in the game.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills for an Ort and a Sol." }],
        },
      ],
      nextUpgrade:
        "Level 45 and the respec. Until then you are levelling on fire — the walkthrough is the page for that half.",
      notes:
        "**A staff can hold Leaf and an Assassin can wield one**, which is why the levelling half of this character often finishes Normal holding a staff rather than a claw. From the respec onward nothing you cast is fire and the claw goes back on.",
    },

    {
      tier: "nightmare",
      goal: "65% cast rate, two Spirits if you can, and Treachery the moment three mid runes exist.",
      levelRange: [45, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Rare or magic claw: +3 Lightning Sentry, +3 Death Sentry",
              why: "A claw carrying both is worth more than any unique at this tier and costs a fraction as much.",
              lookFor: ["+3 to Lightning Sentry", "+3 to Death Sentry", "+2 to Traps", "20% Faster Cast Rate"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "35% cast rate and +2 skills. Note it turns Weapon Block off — that is the trade, and on this build it is the right one.",
              alternatives: [
                {
                  label: "Second claw: +2 Traps, resistances",
                  why: "Keeps Weapon Block alive and doubles the skill affixes. Worth it only if the second claw genuinely carries +2 Traps.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "treachery" },
              why: "**+2 to Assassin Skill Levels** for Shael, Thul and Lem, plus a 5% chance to cast level 15 Fade when struck — Fade you did not have to press.",
              sockets: "Shael, Thul, Lem into a 3-socket body armour. A Dusk Shroud is the light base.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "tarnhelm" },
              why: "+1 skills and magic find while nothing better exists. **A Harlequin Crest needs level 62 and this tier ends at 60**, so it belongs to the tier below rather than here.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate, which is trap-laying speed." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "nightsmoke" }, why: "Resistances and damage-to-mana while the mercenary's Insight is still being built." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest route to 75% before Hell's -100%." }],
      nextUpgrade: "Decide the package before Hell. It changes what your charms are for.",
    },

    {
      tier: "early-hell",
      goal: "75% resistances, 65% cast rate held, and an answer for lightning immunes.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Rare claw: +3 Lightning Sentry, +3 Death Sentry, 20% Faster Cast Rate",
              why: "Three affixes on one item, and it is still cheaper than any of the runewords on this page.",
              lookFor: ["+3 to Lightning Sentry", "+3 to Death Sentry", "20% Faster Cast Rate"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills and 35% cast rate." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "treachery" },
              why: "+2 Assassin skills and the Fade proc.",
              alternatives: [
                { ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 skills, 30% cast rate and up to +35 all resistances — the resistance answer if you did not take the Fade package." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, +1.5 life per level, damage reduction." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Physical damage reduction and life leech on a character with neither. **Arachnid Mesh is the belt this build actually wants and it needs level 80**, which is the tier above this one.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster hit recovery, stamina and two resistances. Kick damage on boots is irrelevant here — nothing on this page kicks." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: 10% Faster Cast Rate, two resistances, life",
              why: "Where the last few points of cast rate come from on the way to 65%.",
              lookFor: ["10% Faster Cast Rate", "Two resistances at 20+", "Life"],
            },
          ],
        },
      ],
      nextUpgrade: "102% cast rate, and an amulet that is not carrying resistances alone.",
    },

    {
      tier: "budget",
      goal: "102% cast rate reached with items that cost mid runes rather than high ones.",
      levelRange: [70, 82],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Rare claw: +3 Lightning Sentry, +3 Death Sentry, 20% Faster Cast Rate",
              why: "Unchanged from the tier below, because there is nothing to upgrade to — the claw is a vendor roll and it stays best in slot to the end.",
              lookFor: ["+3 to Lightning Sentry", "+3 to Death Sentry", "20% Faster Cast Rate"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "35% cast rate and +2 skills. Still the cheapest 35% on the character." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "treachery" },
              why: "+2 Assassin skills and the Fade proc, for three mid runes.",
              alternatives: [
                { ref: { kind: "runeword", slug: "lionheart" }, why: "+30 all resistances and the Strength to wear a heavier base, if the Fade package is not the one you took." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life per level and damage reduction." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and 20% cast rate — the single largest cast-rate item outside the shield." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and maximum mana." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: 10% Faster Cast Rate, two resistances, life",
              why: "35 (Spirit) + 20 (Magefist) + 20 (Arachnid) + 10 (ring) + 20 (Stealth or Vipermagi, if either is still on) clears 102% with room to spare.",
              lookFor: ["10% Faster Cast Rate", "Two resistances at 20+", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Hit recovery and resistances until survival is settled." }],
        },
      ],
      charms: [
        { label: "Trap skill grand charms with life", why: "The tab this build spends points in, and the life it is short of." },
        { label: "Resistance small charms", why: "Only if you did not take the Fade package. If you did, these slots go to lightning damage instead." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders. The life this build is always short of." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "A Griffon's Eye — the only item on the page that reduces enemy resistance rather than adding damage.",
    },

    {
      tier: "optimized",
      goal: "102% cast rate, resistances over the cap, and enemy lightning resistance in the floor.",
      levelRange: [75, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Rare claw: +3 Lightning Sentry, +3 Death Sentry, +2 Traps, 20% Faster Cast Rate",
              why: "Four affixes. At this point the claw is worth more than everything else on the character combined and there is no runeword that beats it.",
              lookFor: ["+3 to Lightning Sentry", "+3 to Death Sentry", "+2 to Traps", "20% Faster Cast Rate"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "35% cast rate and +2 skills, with a lightning facet in a shield that has the socket.",
              alternatives: [
                { ref: { kind: "unique", slug: "lidless-wall" }, why: "+1 skills, 20% cast rate and mana after each kill." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 all skills and **+65 all resistances**, which is what lets a non-Fade route reach the cap.",
              alternatives: [
                { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport. It turns a trapper from a build that walks to doorways into one that arrives at them, and the Strength per level pays for the base." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "griffons-eye" },
              why: "**-15 to -20% enemy lightning resistance** and +10-15% lightning skill damage, plus 25% cast rate. The only item on the page that reduces resistance rather than adding damage.",
              lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage", "1 socket"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% cast rate, maximum mana." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be Frozen, which is the affix a stationary caster misses most." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find once survival is settled. Sandstorm Trek if it is not." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Assassin)", why: "+3 Assassin skills. On the Shadow Master route it is worth more than on the other two." },
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Trap skill grand charms with life", why: "The tab this build actually spends points in." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Lightning facets in every socket that will take one.",
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
              label: "Rare claw: +3 Lightning Sentry, +3 Death Sentry, +2 Traps, 20% Faster Cast Rate",
              why: "Still the best weapon in the game for this build, and still not a runeword.",
              lookFor: ["+3 to Lightning Sentry", "+3 to Death Sentry", "+2 to Traps", "20% Faster Cast Rate"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "With a lightning facet in the socket." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, and the clear speed that comes with never walking again." }],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "griffons-eye" },
              why: "A -20% roll with a lightning facet socketed.",
              lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "20% Faster Cast Rate." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and 20% cast rate." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot be Frozen." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Assassin)", why: "+3 Assassin skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Trap skill grand charms with life", why: "The last percentages of damage, and the life to carry them." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Nothing. Spend the currency on a second character.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Insight, and it is not optional.** Meditation is the whole of this build's mana plan — five casts every few seconds, on a character with no life leech and no Warmth. Take the Defiance aura variant on Nightmare: his job is to hold a corridor while the field does the work, not to kill anything. A Treachery body gives him the Fade proc too, and Andariel's Visage is the helm once his life pool can carry it.",

  farming: [
    {
      area: "travincal",
      difficulty: "hell",
      why: "Dense, enclosed and short. Every pack walks into the same doorway, which is exactly the terrain piercing bolts want.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "lower-kurast",
      difficulty: "hell",
      why: "Chests rather than kills, so the build's one weakness never comes up. The fastest rune-hunting run available to a character with no Enigma.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Two enclosed levels at the highest area level in Act 1. Mixed immunities, which is where the Fire Blast package earns its twenty points.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Corridors and seal packs — everything arrives in a line. The Oblivion Knights curse, which is what Fade's curse-length reduction is for.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Three levels of enclosed corridors at the highest area level in the game. Watch for the lightning-immune packs.",
      minTier: "optimized",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "One room, high density, and the corpse chain does most of it. A good place to learn where a trap field wants to go.",
      minTier: "nightmare",
      rating: 3,
    },
  ],

  immunityPlan:
    "**Lightning immunity is the build's one real problem and there is no clean fix.** The Assassin has no Lightning Mastery, no Conviction she can wield, and no Lower Resist. Three partial answers, in order of how much they actually help. First, **Death Sentry's corpse explosion is half fire and half physical**, so once anything in the pack dies the chain works on the immunes — which means bringing something that can kill one of them. Second, the **Fire Blast package** is the deliberate answer: nineteen points for a second damage type that needs no gear change, dealing 646-859 per throw with the core's three maxed traps feeding it. Third, a **Crack of the Heavens** Sunder Charm turns lightning immunity into 95% resistance, at the cost of -70 to your own lightning resistance and one charm slot. **Griffon's Eye and lightning facets do not break immunity** — reducing a 100% resistance by 20 leaves it at 100 for immunity purposes. They are damage against everything that was never immune.",

  hardcoreNotes:
    "**Take the Fade package.** Twenty points of Fade is 75% resistance and 20% physical damage reduction that no gear slot has to pay for, and the curse-length reduction is what keeps an Oblivion Knight's Amplify Damage from being fatal. Beyond that, the build is already one of the safest in the game: you never enter melee, Mind Blast stuns before you commit, Cloak of Shadows blinds a screen, and the Shadow Master arrives first. The two things that kill Hardcore trappers are laying a field into a pack that was already moving, and Iron Maiden.",

  selfFoundNotes:
    "**This is the strongest self-found build the Assassin has and one of the strongest on the site.** Nothing in the first three tiers is a runeword above three runes: Stealth, Lore, Spirit, Ancients' Pledge, Treachery. The weapon — the single largest damage item — is a magic or rare claw from a vendor, and vendors restock every time you re-enter town. The one thing worth hunting deliberately is a claw with +3 Lightning Sentry and +3 Death Sentry together.",

  levelingPath: {
    summary:
      "**Do not level as this build.** Every lightning trap has a minimum damage of 1 at every level, so a half-funded Lightning Sentry does not deal half damage. Level on fire — Fire Blast to 11, then Wake of Fire — and respec once at level 45, Nightmare Act 4, where 52 points come back and the lightning opening costs exactly 52.",
    respecAt: "Level 45, Nightmare Act 4, using the Nightmare Den of Evil token",
  },

  confidence: "verified",
  complete: true,
};
