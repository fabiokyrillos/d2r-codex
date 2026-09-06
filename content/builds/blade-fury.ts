import type { Build } from "@/lib/types";

/**
 * Blade Fury.
 *
 * THE FACT THAT ORGANISES THE WHOLE PAGE: TWO DAMAGE HALVES THAT DO NOT MEET
 * --------------------------------------------------------------------------
 * Every blade carries two separate quantities, and the skill's own damage
 * formula keeps them in two separate terms:
 *
 *   damage = ((base_damage × SrcDam / 128) + (skill_damage × (100 + synergy) / 100))
 *            × (100 + enhancer) / 100
 *
 * `SrcDam = 96` of 128 is three quarters of a normal attack with the weapon you
 * are holding. `skill_damage` is Blade Fury's own, and the site's own
 * `physicalAtLevel` reads it off the pinned columns as **101–103 at twenty hard
 * points** (8–10 at one, with bands 3/5/8/8/8).
 *
 * The synergy multiplies the second term and **not the first**. The Skills.txt
 * file guide says so in as many words — "DmgSymPerCalc: this field controls the
 * synergy bonus (a percentage) added to the physical damage done by the skill
 * (this does not influence physical damage passed over by SrcDamage)" — and the
 * formula above, from the same guide, shows why: they are two addends, not a
 * product. Cycle 4 listed this as one of four things it could not establish.
 *
 * So the build has **two levers that do not multiply each other**:
 *
 *   the skill half   101–103, times five with Sentinel and Shield maxed,
 *                    = 505–515 per blade, and raised further by `+skills`
 *   the weapon half  75% of whatever a normal attack with that weapon would do,
 *                    untouched by any of the sixty points in the triangle
 *
 * Which is exactly why the gear plan forks, and why the fork is a package.
 *
 * `+SKILLS` RAISE ONE HALF AND NOT THE OTHER, AND THE DISTINCTION IS EXACT
 * -----------------------------------------------------------------------
 * `DmgSymPerCalc` reads `blvl` — hard points only — so a Mara's or a claw with
 * `+3 Traps` adds nothing to the +400%. The 101–103 is a level band, and level
 * bands read the *effective* level, so the same `+skills` raise it directly:
 *
 *   20 hard points          101–103
 *   +4  (level 24)          133–135
 *   +6  (level 26)          149–151
 *   +10 (level 30)          181–183
 *
 * Cycle 4's note that "`+skills` from gear do not feed it" was true of the
 * synergy and read as though it were true of the skill. It is worth about
 * eighty damage a blade to get that right.
 *
 * THE CADENCE IS FIXED AT FIVE FRAMES AND NOTHING SPEEDS IT UP
 * ------------------------------------------------------------
 * `Param4 = 5`, and the D2library mechanics reference states the consequence
 * plainly: "Shooting speed is five Frames per attack and is **neither subject
 * to attack speed nor to cast rate**." Five frames is 0.2 seconds, so this is
 * five blades a second, on every character, in every pair of gloves.
 *
 * That is why there is no Increased Attack Speed row in the breakpoint table
 * and no Faster Cast Rate row for the attack — and, for once on this class, the
 * absence has a published reason rather than a shrug. Two things follow that
 * catch people out:
 *
 *   - **Burst of Speed buys this build run speed and nothing else.** Its up to
 *     60% attack speed cannot reach a fixed cadence.
 *   - Which makes **Fade** nearly free, because the thing it costs you is a
 *     buff that was not paying.
 *
 * VENOM RIDES IT, AND THE TIMING IS BETTER THAN ANYWHERE ELSE ON THE CLASS
 * -----------------------------------------------------------------------
 * The same reference: the 75% weapon share "also includes elemental damage from
 * equipment and buffing skills like Venom". And Venom's `aurastat3 =
 * skill_poison_override_length` with `ELen = 10` pins every poison it touches
 * to ten frames — 0.4 seconds — rather than stacking it.
 *
 * A skill that throws every 0.2 seconds re-applies a 0.4-second poison twice
 * per expiry. **Blade Fury is the fastest-hitting skill on the class meeting
 * the one poison whose length is fixed**, so uptime is total and the 425–445
 * at twenty points is on every blade. That is why Venom is in the core here and
 * a package on the kick page.
 *
 * WHAT A BLADE CARRIES, AND ONE THING IT DOES NOT
 * -----------------------------------------------
 *   life and mana leech   yes — stated outright of this skill
 *   Crushing Blow         yes, and **halved**: a Crushing Blow delivered by a
 *                         ranged attack is cut in half
 *   Open Wounds           yes, and **not** halved — the ranged column of the
 *                         Open Wounds target modifier is 1 against ordinary
 *                         monsters, the same as melee
 *   Deadly Strike         yes — "every successful attack (blowing, throwing,
 *                         shooting) is able to become a critical hit"
 *   cast on striking      yes — `item_skillonhit` carries
 *                         `itemevent2 = domissiledamage`, and "on strike"
 *                         means any successful attack including shooting
 *   Claw Mastery          yes, and this is the opposite of the kicks one tree
 *                         over, where it does nothing
 *   `+x% elemental skill damage`   **no** — Blade Fury counts as a ranged
 *                         attack, so a Rainbow Facet's damage half is dead
 *   cast on **attack**    NOT ESTABLISHED, and not sold. The trigger is
 *                         documented as not working with ranged attacks, and
 *                         this skill is treated as ranged elsewhere, but no
 *                         source says it of this pairing.
 *
 * IT CAN MISS, AND THE PATCH NOTES SAY SO
 * ---------------------------------------
 * `ToHitCalc = "lvl*10"` and the missile's own `ToHit = 1`, where Guided Arrow
 * — the never-miss control — is `ToHit = 0`. Patch 2.4 confirms it from the
 * other side: "Blade Fury — Attack rating increased by 10% per level" is a line
 * nobody writes about a skill that cannot miss. Guides calling this an
 * always-hit skill are wrong, and attack rating is a real stat here.
 *
 * NO SHOTGUN, NO PIERCE, NO NEXT HIT DELAY
 * -----------------------------------------
 * `bladefragment1`: `NumDirections 1`, `CollideKill 1`, `Vel 22`, `Range 40`,
 * `Pierce` unset, and **no next-hit delay at all** (`NextHit` and `NextDelay` are both absent).
 *
 *   - One missile per throw. `Param4` is a delay *between* missiles, so the
 *     blades are separated in time rather than fired in a spread. Nothing here
 *     stacks on a single target the way a shotgun does.
 *   - No pierce, and Pierce% gear cannot grant it: arrows and javelins carry
 *     `Pierce = 1` *and* `LastCollide = 1`, and this carries neither. The first
 *     thing a blade touches is the last.
 *   - No next hit delay is where the density comes from. The contrast is inside
 *     the same three skills: Blade Sentinel's `blade creeper` is
 *     `NextHit 1 / NextDelay 25`, so it can strike one target at most once a
 *     second. Blade Fury has no such ceiling.
 *
 * THE TRIANGLE, AND THE ONE THING THAT SHARES A CEILING
 * -----------------------------------------------------
 * All three blade skills carry `Param8 = 10` and each names the other two, so
 * twenty points in two of them is +400% on the third. All three are Traps-tree
 * skills, which is why the prerequisite chain runs through Fire Blast and Wake
 * of Fire and costs two points outside the blades.
 *
 * And Blade Sentinel is `pettype = "assassintrap"` with `petmax = 5`: it shares
 * the five-trap ceiling with every sentry in the tree. A Blade Fury character
 * who also lays Lightning Sentries is dividing five slots between them, which
 * is the argument against a trap package on this page and is why there is not
 * one.
 *
 * DELAYS, WITH CONTROLS
 * ---------------------
 * `localdelay` is the cast-delay column. Blade Sentinel carries 25 — one
 * second — and Blade Fury carries none at all. The controls are the published
 * ones: Blizzard 45, Meteor 30, Frozen Orb 25. Patch 2.4 halved Sentinel's from
 * two seconds to one, and 25 is what the current data holds.
 *
 * WHAT THE 1.1x REFERENCE GETS WRONG, AND WHY THE PINNED DATA WINS
 * ----------------------------------------------------------------
 * The same reference says Blade Sentinel carries 3/8 of a normal attack and
 * Blade Shield a quarter. Those are pre-2.4 figures: patch 2.4 raised both to
 * 75%, and the pinned 3.3 extraction gives all three `SrcDam = 96`. Where a
 * 1.1x source and the current extraction disagree, the extraction is the
 * baseline. What survives from it is the part 2.4 did not touch — Blade Shield
 * triggers no events at all, and its radius is fixed rather than taken from the
 * weapon.
 *
 * `Half2HSrc = 1`, AND IT REVERSES CYCLE 1
 * ----------------------------------------
 * The flag sits on exactly nine of 742 missiles and all nine are this family.
 * It halves the transferred share on a **two-handed** weapon, and the reference
 * gives the arithmetic: "in case of two-handed weapons it's only 37.5%". Every
 * claw is one-handed and takes no penalty; a two-handed weapon gives up half of
 * the half of the build it was bought for. Cycle 1's note that this is "the one
 * Assassin build that wants a normal weapon" is right only about *one-handed*
 * normal weapons, and this page says which.
 *
 * WHAT IS NOT ESTABLISHED, AND IS NOT PUBLISHED
 * ---------------------------------------------
 * - Whether chance-to-cast **on attack** fires from a blade.
 * - What `Param3 = 3` governs. It is the only unread column on the row.
 * - Whether the 75% share is taken before or after the off-weapon percentage
 *   damage that Claw Mastery supplies. The reference says Claw Mastery's bonus
 *   "is applied"; the order is not stated, so no combined figure is published.
 */
export const bladeFury: Build = {
  slug: "blade-fury",
  name: "Blade Fury",
  classSlug: "assassin",
  summary:
    "A blade every fifth frame, at range, carrying three quarters of your weapon and a poison that never lapses. The one Assassin whose attack speed is a constant.",
  damageTypes: ["physical", "poison"],
  primarySkill: "blade-fury",
  playstyle:
    "You hold the button down and blades leave you five times a second, and that rate never changes — not with attack speed, not with cast rate, not with any glove in the game. Each blade is one missile that stops at the first thing it touches, so this is a skill about angles rather than about crowds: you back down a corridor and let the line of enemies feed itself into the stream. The damage arrives in two independent parcels. Sixty points in the blade triangle multiply Blade Fury's own damage fivefold, and the weapon in your hand adds three quarters of what a normal swing with it would do — and those two numbers never touch each other, which is why the gear decision on this page is a real fork rather than a ladder. Venom runs the whole time, and because a blade lands every 0.2 seconds against a poison pinned to 0.4, it is the only build on the class where the poison is genuinely always up.",
  strengths: [
    "**A fixed five-frame cadence**, so the build performs identically at level 40 and level 99 and needs no attack speed at all",
    "**Ranged, and it is genuinely ranged** — 40 units of missile travel with a normal attack's damage attached to it",
    "**Venom never lapses.** A blade every 0.2 seconds against a 0.4-second poison window is total uptime, which no other Assassin skill achieves",
    "Two damage sources that scale independently, so a poor weapon and good skills, or good weapon and few skills, both work",
    "Blade Shield hurts everything that touches you while you channel, and Blade Sentinel patrols the corridor you are backing down",
    "**No next hit delay**, so density is limited only by how fast blades leave you",
    "Cheap to start: the triangle is complete at level 30 and the weapon half works with whatever you are holding",
  ],
  weaknesses: [
    "**Physical immunity is the wall**, and it closes eight of this site's twenty farming areas to the larger half of the damage",
    "**No shotgun and no pierce.** One missile per throw, and the first thing it touches is the last — this is not a crowd-clearing skill",
    "It can miss. Its +10% attack rating per level helps a great deal and does not make attack rating free",
    "**Burst of Speed does nothing for the attack**, which is the single most common way this build is built wrong",
    "Mana is charged per blade rather than per press, so a held button is a held drain",
    "Blade Sentinel competes for the same five trap slots as any sentry, so the trap tree is not a second act here",
    "Clear speed is moderate. It kills a line very well and a room slowly",
  ],
  difficulty: "moderate",
  budget: "low",
  ratings: {
    clearSpeed: 3,
    bossing: 4,
    survivability: 4,
    magicFind: 3,
    terrorZones: 3,
    ubers: 2,
    soloSelfFound: 5,
    players8: 3,
  },

  skills: [
    {
      skill: "blade-fury",
      points: 20,
      role: "main",
      order: 1,
      note: "**101–103 of its own at twenty points, and three quarters of your weapon on top.** The two are separate addends and only the first is multiplied by the synergies. Maxed first because it is the only one of the three you actually press.",
    },
    {
      skill: "blade-sentinel",
      points: 20,
      role: "synergy",
      order: 2,
      note: "**+200% on Blade Fury, and a skill in its own right.** It is a trap: `pettype = assassintrap` with `petmax = 5`, laid on the `S2` animation like a sentry rather than thrown, and its `blade creeper` carries `NextHit 1 / NextDelay 25`, so it strikes one target at most once a second. One-second cast delay (`localdelay = 25`, against Blizzard's 45 and Frozen Orb's 25).",
    },
    {
      skill: "blade-shield",
      points: 20,
      role: "synergy",
      order: 3,
      note: "**The other +200%, and free damage on everything that touches you.** 112–141 at twenty with three quarters of the weapon attached. It triggers no item events at all, and its radius is fixed rather than taken from the weapon — so this is a synergy that happens to hurt, not a defensive plan.",
    },
    {
      skill: "venom",
      points: 20,
      role: "main",
      order: 4,
      note: "**Core here, and a package on every other Assassin page, for one reason: the timing.** Venom pins poison to ten frames — 0.4 seconds — instead of stacking it, and a blade lands every 0.2. The 425–445 is therefore on every blade rather than on some of them. It is also the answer to physical immunity, which is the only thing that stops the rest of this page.",
    },
    { skill: "fire-blast", points: 1, role: "prerequisite", note: "The tree's only level-one skill, and the way in. The blades are Traps-tree skills, which is why two of these points are spent outside them." },
    { skill: "wake-of-fire", points: 1, role: "prerequisite", note: "Blade Fury's second prerequisite. One point, and never pressed." },
    { skill: "claw-mastery", points: 1, role: "prerequisite", note: "The gateway to the whole Shadow tree: Weapon Block sits behind it, and so does the Fade that Venom needs. **Unlike on the kick page, this one is a damage skill here**: Claw Mastery's bonus is applied to Blade Fury. Whether to spend nineteen more on it is the first package." },
    { skill: "burst-of-speed", points: 1, role: "prerequisite", note: "**One point, and understand what it is for.** It is Fade's prerequisite and it is run speed. Its attack speed cannot touch a fixed five-frame cadence, and treating it as a damage buff here is the standard error." },
    { skill: "fade", points: 1, role: "utility", note: "Venom's prerequisite, and the resistance answer. One point unless you take the Fade package. It excludes Burst of Speed, and the two are the only members of their exclusion group in `states.json` — which on this build costs almost nothing." },
    { skill: "weapon-block", points: 1, role: "utility", note: "One point, and it only does anything with a claw in each hand. If you end on a one-handed weapon and a shield, this stays at one forever." },
    { skill: "psychic-hammer", points: 1, role: "prerequisite", note: "Cloak of Shadows' prerequisite." },
    { skill: "cloak-of-shadows", points: 1, role: "utility", note: "Blinds a room, which for a build that stands still and channels is worth more than it looks. Prerequisite for Mind Blast and the shadows." },
    { skill: "mind-blast", points: 1, role: "utility", note: "Stun and conversion. On a fixed-cadence build there is no rotation to interrupt, so this is a free panic button." },
    { skill: "shadow-warrior", points: 1, role: "prerequisite", note: "Shadow Master's prerequisite. Never worth more than one — it shares a `pettype` with Shadow Master, so the two replace each other." },
    { skill: "shadow-master", points: 1, role: "utility", note: "One point is one shadow, and a shadow is a body between you and the pack. Nineteen more is the third package." },
  ],

  skillPackages: [
    {
      id: "blade-fury-19",
      name: "The last nineteen points",
      choose: "one",
      intro:
        "The core above is 91 of 110, and the triangle is **closed** — Blade Fury, Blade Sentinel and Blade Shield are all at twenty, so no further point anywhere raises the +400%. Venom is closed too. That leaves nineteen, and because the two damage halves scale independently, the three routes below are genuinely different builds rather than degrees of the same one. **Take exactly one.** Each costs exactly nineteen and the plan closes at 110 whichever you choose.",
      packages: [
        {
          id: "claw-mastery",
          name: "Claw Mastery — the weapon half",
          when: "**Take this if you are holding claws**, which most Assassins are. Claw Mastery is `passive = 1` with `passiveitype = \"h2h\"`, so it reads claws and nothing else — and unlike on the kick page one tree over, its bonus *is* applied to Blade Fury.",
          tradeoff: "You give up Fade's resistances and Shadow Master's body. On a build that stands still at range, both of those are real.",
          skills: [
            {
              skill: "claw-mastery",
              points: 20,
              role: "utility",
              note: "**Attack rating and off-weapon damage, on the half the synergies cannot reach — and it is a mastery rather than a synergy.** The skill graph draws no hard-point edge from Claw Mastery to Blade Fury, and it is right not to: what this buys is +220% attack rating, +111% damage and a 25% chance of a critical hit, all of which land on the weapon term rather than on the skill's own. The attack rating half matters more than it looks, because this skill rolls to hit.",
            },
          ],
          gearNote: "This package chooses claws for you. Two claws also switch Weapon Block on, so the one core point in it stops being dead.",
          rotationNote: "Unchanged. There is no rotation to change — the cadence is fixed.",
          contentNote: "Everything, and especially anything with a lot of defence.",
          remainderNote: "None. Nineteen points, and the plan closes at 110.",
        },
        {
          id: "fade",
          name: "Fade — resistances and the curse answer",
          when: "**Take this for Hell and for Hardcore.** Eighteen more points of Fade takes elemental resistance to its ceiling, physical damage reduction to 1% per level, and curse length down by as much as 90%.",
          tradeoff: "You give up Claw Mastery's attack rating and damage, and Shadow Master's body. What you do *not* give up is meaningful attack speed, because Burst of Speed could not reach the cadence anyway.",
          skills: [
            {
              skill: "fade",
              points: 20,
              role: "utility",
              note: "**The Iron Maiden answer, and it matters more here than on most pages.** The curse reflects a share of what you deal, and this build deals it five times a second. Curse length reduction is the mitigation. The resistances are the other half, and they arrive without a single gear slot.",
            },
          ],
          gearNote: "Resistances stop being the thing every ring and charm is chosen for, so those slots go to attack rating, life and `+skills`.",
          statNote: "Unchanged.",
          contentNote: "The Chaos Sanctuary, the Worldstone Keep, and any Hardcore character.",
          remainderNote: "None. Nineteen points exactly.",
        },
        {
          id: "shadow-master",
          name: "Shadow Master — a body in front of you",
          when: "**Take this if you are playing at range and dying anyway.** Twenty points is a shadow with up to 90% resistances, +300% life and +800% attack rating, and it uses your skills.",
          tradeoff: "You give up Claw Mastery's damage and Fade's resistances, and you accept that the shadow chooses its own targets.",
          skills: [
            {
              skill: "shadow-master",
              points: 20,
              role: "utility",
              note: "It shares a `pettype` with Shadow Warrior and replaces it, so the one point in Shadow Warrior stays one point forever. What it buys is the thing a channelling build most wants: something else for the pack to walk towards.",
            },
          ],
          gearNote: "Nothing changes, which is the point — this is the package for a character whose gear is not finished.",
          contentNote: "Terror Zones, players-8 games, and the whole of Hell before the gear plan is done.",
          remainderNote: "None. Nineteen points exactly.",
        },
      ],
    },
  ],

  flexPoints: [
    "There are none. Ninety-one in the core, nineteen in exactly one package, and 110 is what a level-99 character with every quest reward has.",
    "**Do not spend them on the trap tree.** Blade Sentinel already carries `pettype = assassintrap` with `petmax = 5`, so a Lightning Sentry is not a second act — it is a Sentinel you no longer have room to lay.",
    "**Do not spend them on Burst of Speed.** It cannot reach a fixed five-frame cadence, and every point in it is a point that bought run speed at damage prices.",
  ],

  stats: {
    strength: "Enough for your gear, and the number depends entirely on which weapon you end on. A claw route needs almost none; a one-handed weapon and a shield can need well over a hundred.",
    dexterity: "**More than most Assassin pages want, and the reason is that this skill rolls to hit.** Its +10% attack rating per level does most of the work, so this is not an Amazon's dexterity budget — but attack rating is live, and if you have not taken the Claw Mastery package, dexterity is where it comes from.",
    vitality: "Everything left, and it is a lot. This is a build with no strength requirement it cannot choose and no dexterity requirement at all if Claw Mastery is paying.",
    energy: "None. Mana is charged per blade and the answer is leech and a Spirit, not attribute points.",
    notes: [
      "**The strength number is a consequence of the gear fork, not an input.** Decide claws or a one-hander and a shield first; the attribute plan follows and cannot be written before it.",
      "Attack rating is the one place this build differs from the trap pages. A missed blade is a blade that did nothing, at five a second.",
      "If you take the Fade package, resistances arrive from a skill rather than from rings and charms, and those slots become attack rating and life.",
    ],
  },

  breakpoints: [
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "required",
      why: "**Required, because the method is standing still.** This build channels from one spot; being hit-stunned repeatedly is the only thing that stops the stream, and the stream is the damage.",
    },
    {
      stat: "fcr",
      value: 65,
      frames: 11,
      priority: "luxury",
      why: "**For the buffs and Mind Blast, and for nothing you attack with.** Cast rate shortens the Assassin's `SC` animation from 16 frames to 11. Blade Fury is not on that table and is not on the attack table either — its rate is fixed.",
    },
    {
      stat: "fbr",
      value: 86,
      frames: 3,
      priority: "luxury",
      why: "Only if you are on two claws and have spent points in Weapon Block, or on a shield. On the one-handed-plus-shield route this is an ordinary block breakpoint; on the claw route with one point in Weapon Block it is not worth chasing.",
    },
  ],
  breakpointNotes:
    "**There is no Increased Attack Speed row, and for once the reason is a published number rather than a gap.** Blade Fury's row carries `Param4 = 5`, and the D2library mechanics reference states the consequence outright: shooting speed is five frames per attack and is *neither subject to attack speed nor to cast rate*. Five frames is 0.2 seconds. That figure is the same on a fresh level-18 character with no gear and on a finished one wearing every affix in the game, which makes this the only Assassin build on the site whose damage-per-second is a constant times its damage-per-hit. Two consequences worth acting on. **Increased Attack Speed is a dead affix on this build** — not weak, dead — so a claw with 40% IAS and a claw with none throw blades at the same rate, and the slot should be chosen for `+skills` and damage instead. And **Burst of Speed is run speed here and nothing more**, which is why the Fade package gives up so little: the buff it excludes was not paying. Faster Hit Recovery is the breakpoint that actually protects output, because the only thing that interrupts a fixed cadence is being knocked out of it.",

  gearSets: [
    {
      tier: "starter",
      goal: "Reach the triangle. Blade Fury exists at level 18 and Blade Shield at 30, and until then this is a normal-attack character with a Blade Sentinel.",
      levelRange: [1, 30],
      nextUpgrade: "Blade Shield at 30, and any one-handed weapon with real damage on it.",
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Whatever one-handed weapon has the biggest damage range",
              why: "**The weapon half is three quarters of a normal attack with it, so the number on the item is three quarters of a number on your screen.** One-handed matters: a two-handed weapon halves the share to 37.5%, which is the single largest gear mistake available on this page.",
              lookFor: ["Highest average damage", "One-handed", "Sockets"],
            },
            {
              ref: { kind: "runeword", slug: "steel" },
              why: "Two runes, +damage and 50% Increased Attack Speed — of which the attack speed does nothing for the blades and everything for the normal attacks you are still making before level 18.",
            },
          ],
        },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Two runes, and the Faster Hit Recovery is the stat this build actually needs. Available from the Countess at level 17." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 skills, which on this page is worth real damage: the skill half reads the effective level, so a point of `+skills` moves 101–103 upward." }] },
        { slot: "boots", picks: [{ label: "Any boots with Faster Run/Walk and resistances", why: "There is nothing special about this slot on this build — the damage is not in the boots here, which is the opposite of the kick page." }] },
        { slot: "belt", picks: [{ label: "The largest belt you can wear", why: "Mana potions. Blade Fury charges mana per blade and a held button is a held drain." }] },
      ],
    },
    {
      tier: "nightmare",
      goal: "The triangle is complete and Venom is online. This is the first tier where the build is itself.",
      levelRange: [30, 55],
      nextUpgrade: "A real one-handed weapon, and Treachery for the Fade proc.",
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "A rare or crafted claw with +3 to a Traps skill",
              why: "**The claw route.** `+skills` raise the 101–103 directly — six of them takes it to 149–151 — and they cost nothing in the weapon half because claws are one-handed and take no `Half2HSrc` penalty. If you are going to take the Claw Mastery package, decide here.",
              lookFor: ["+3 Blade Fury or +2 Traps", "Any damage", "Not attack speed — it does nothing"],
              alternatives: [
                {
                  label: "A high-damage one-handed sword or axe",
                  why: "**The weapon route.** More damage in the half the synergies cannot touch, at the cost of Weapon Block, Claw Mastery and the `+skills`. Both routes work; what does not work is a two-hander.",
                },
              ],
            },
          ],
        },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "**The Assassin armour, minus the part that usually sells it.** Its 45% Increased Attack Speed is dead here, and the chance to cast Fade when struck is not — free resistance on a build that stands in one place and gets hit." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "Still +1 skills, still real damage." }] },
        { slot: "offhand", picks: [{ label: "A second claw, or a resistance shield", why: "Two claws switch on the one point in Weapon Block and add their `+skills`; a shield adds block and resistances. This is the same fork as the weapon slot, and it should be answered the same way." }] },
        { slot: "gloves", picks: [{ label: "Rare gloves with life, mana and resistances", why: "Nothing in this slot changes the damage. Increased Attack Speed here is dead." }] },
        { slot: "belt", picks: [{ label: "Rare or crafted belt with life and resistances", why: "Life and potion rows." }] },
        { slot: "boots", picks: [{ label: "Rare boots with Faster Run/Walk and resistances", why: "Movement, which on a fixed-cadence build is the only speed you can buy." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Attack rating and magic find, and attack rating is live on this page." }] },
      ],
    },
    {
      tier: "early-hell",
      goal: "Survive the resistance penalty and keep the stream up. Hell applies −100% to all resistances and this build has no ranged escape.",
      levelRange: [55, 70],
      nextUpgrade: "Spirit in the off-hand or a real weapon, and Duress for the body.",
      slots: [
        { slot: "weapon", picks: [{ label: "The best one-handed weapon you own, socketed", why: "Sockets go to damage, not to attack speed. A Shael in this slot is a wasted rune on this build and on no other Assassin build." , lookFor: ["Two or three sockets", "Damage jewels", "One-handed"] }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "**If you are on the shield route.** +2 skills, and the +2 is worth more damage here than most pages, because the skill half reads the effective level. The 35% Faster Cast Rate reaches the buffs and nothing else.", alternatives: [{ label: "A second claw with +skills", why: "If you are on the claw route. Weapon Block, and more of the level bands." }] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "duress" }, why: "Three runes for 15% Crushing Blow — which works from a blade at half rate — plus Enhanced Damage and Faster Hit Recovery.", alternatives: [{ ref: { kind: "runeword", slug: "smoke" }, why: "+50 to all resistances for two runes, if the Hell penalty is the problem rather than the damage." }] }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Damage reduction and life leech, and leech works from a blade — the reference says so of this skill by name." }] },
        { slot: "gloves", picks: [{ label: "Crafted blood gloves", why: "Life, life leech and attack rating. Leech is what pays for standing still." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life leech, on the slot that otherwise does nothing here." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and +damage. The damage is physical min/max, which — unlike on the kick page — this build's weapon half does use." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and 150–250 attack rating. Being frozen slows animations, and attack rating is live." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with attack rating, life and resistances", why: "Attack rating first if you did not take the Claw Mastery package." }] },
        { slot: "amulet", picks: [{ label: "A rare amulet with +2 Assassin skills", why: "+2 skills is a straight move up the level bands: 101–103 becomes 117–119." }] },
      ],
    },
    {
      tier: "budget",
      goal: "A finished Hell character on runes anyone can find. This build reaches its ceiling earlier than any other Assassin page.",
      levelRange: [70, 85],
      nextUpgrade: "A high-rune weapon, and the decision about which half of the damage to buy.",
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "passion" }, why: "**Four runes, and read the lines carefully.** Its +damage and its Berserk charges are real; its 25% Increased Attack Speed is dead here. Take it for the damage, not for the speed.", alternatives: [{ label: "A rare claw with +3 Blade Fury and two damage jewels", why: "The claw route's version of the same tier, and it costs no runes at all." }] }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills and the resistances. Or the second claw, if that is the route." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "duress" }, why: "Crushing Blow, Enhanced Damage and Faster Hit Recovery, for three mid runes." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Leech and damage reduction, socketed for resistances." , sockets: "Two — a Um each, or damage jewels if resistances are already covered." }] },
        { slot: "gloves", picks: [{ label: "Crafted blood gloves with +2 Martial Arts or Traps", why: "The `+skills` half again, plus the leech." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and leech." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Damage and magic find." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills and the mana pool a per-blade cost drains." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 to all resistances — both halves of what this tier is short of." }] },
        { slot: "weapon", picks: [{ label: "Weapon switch: Call to Arms and a Spirit shield", why: "Battle Orders. This build has no life bonus of its own." }] },
      ],
      charms: [{ label: "Grand charms with +1 Traps, small charms with attack rating", why: "Attack rating, life and resistances. A `+1 Traps` grand charm is worth more than most, because the skill half reads the effective level." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, at level 57." }],
    },
    {
      tier: "optimized",
      goal: "Both halves paid for. This is where the two routes stop looking similar.",
      levelRange: [85, 95],
      nextUpgrade: "The high-rune version of whichever half you chose.",
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "**The weapon half, bought outright.** Grief's flat damage is part of what a normal attack with it would do, and three quarters of that rides every blade. It is a phase blade, which is one-handed, so no `Half2HSrc` penalty applies. Its 40% Increased Attack Speed is, as everywhere on this page, dead — and it is still the biggest single number available to this build.",
              sockets: "Eth, Tir, Lo, Mal, Ral in a five-socket phase blade.",
              alternatives: [
                {
                  label: "A rare or crafted claw with +3 Blade Fury and +2 Traps",
                  why: "**The skill half, bought instead.** Five effective levels is 101–103 becoming roughly 141–143, it keeps Weapon Block and Claw Mastery alive, and it costs no runes. Genuinely a choice rather than a downgrade.",
                },
              ],
            },
          ],
        },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "**If you took Grief.** 35% damage reduction and the best block in the game, on a build that stands still.", alternatives: [{ label: "A second claw with +3 Blade Fury", why: "If you took claws. Weapon Block at whatever level the one core point gives it, plus more of the level bands." }] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, +65 to all resistances and 8% damage reduction. The skills are damage here." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 Assassin skills, life leech and 20% Increased Attack Speed — two of those three matter. The −30% fire resistance is the price and it is real in the Chaos Sanctuary.", sockets: "One — a Um, or a ruby for the fire penalty." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "**Life Tap on striking, and this is the build that proves it fires.** `item_skillonhit` carries `domissiledamage` as well as `domeleedamage`, so a thrown blade triggers it — five times a second." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and the mana. A per-blade cost is a real cost at five a second." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and Open Wounds. **Both work from a blade — Crushing Blow at half rate because it was delivered by a ranged attack, Open Wounds at full**, because the ranged column of its target modifier is 1 against ordinary monsters." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills and mana." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }] },
      ],
      charms: [{ label: "Annihilus, Hellfire Torch, grand charms with +1 Traps", why: "Sum the `+skills` and read the level band: twenty hard points is 101–103, +6 is 149–151, +10 is 181–183. Grand charms with `+1 Traps` are the largest small upgrade on the page." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
    },
    {
      tier: "bis",
      goal: "The ceiling on both halves at once, which is the only tier where the fork closes.",
      levelRange: [95, 99],
      nextUpgrade: "Nothing. This build finishes earlier than most and then stops.",
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "In a phase blade. The largest weapon half available, one-handed, no penalty." , sockets: "Eth, Tir, Lo, Mal, Ral." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Damage reduction and block, socketed." , sockets: "One — a Um for resistances." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, resistances, damage reduction." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "crown-of-ages" }, why: "Damage reduction, resistances and two sockets, without Andariel's fire penalty." , sockets: "Two — Um and Um, or damage jewels." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking, at five throws a second." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and mana." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and Open Wounds, both of which travel with a blade." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 resistances." }] },
      ],
      charms: [{ label: "Annihilus, Hellfire Torch, and every grand charm with +1 Traps", why: "Every `+1 Traps` is a step up the level bands, and the bands are worth 8 damage a level in this range." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**A Might mercenary, and understand exactly which half it raises.** Might is a percentage bonus to physical damage, and in the damage formula that lands on the weapon term — the three quarters of a normal attack — rather than on Blade Fury's own damage, which is already carrying its +400%. On the claw route that is a small aura on a small number; on the Grief route it is a large aura on a large one. **Insight is the other reason to take an Act 2 mercenary**, because Meditation answers the one genuine resource problem this build has: mana is charged per blade, and a held button at five blades a second drains a pool faster than any Assassin skill on the site. If physical immunity is the problem rather than mana, an Act 3 Iron Wolf brings a damage type you do not have — but so does your own Venom, which is why it is in the core.",

  farming: [
    {
      area: "travincal",
      difficulty: "hell",
      why: "**The best run on the page.** Fire and lightning are the common immunities here and physical is not, so both halves land — and the Council stands in one place, which is exactly what a stream of single missiles wants. A short run with a fixed pack at the end of it.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "mephisto",
      difficulty: "hell",
      why: "Fire and lightning again, so nothing here resists the blades. He stands still, he has a large health bar, and this build's damage is per-hit at five hits a second with Life Tap available in the glove slot — a boss fight that suits the shape.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "countess",
      difficulty: "hell",
      why: "Fire is the common immunity, not physical, and the tower corridors are the single best geometry for a skill that fires one missile with no pierce. She is also the rune source for most of the gear plan above.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "arcane-sanctuary",
      difficulty: "hell",
      why: "Lightning and magic are the common immunities, so both halves of the damage land on everything — and the platforms are corridors. Long walks between packs are the cost.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, and **physical is one of the common immunities here** — so this is the run that Venom exists for. The poison half is untouched and keeps working on the packs the blades bounce off; expect it to be slower than Travincal and worth it for the drops.",
      minTier: "budget",
      rating: 3,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "**Poison is the common immunity, so your Venom does nothing at all here** — and the physical half is untouched, which makes this the clearest demonstration on the page that the two halves are separate. A fast, repeatable fight for a build that does not need the poison to kill her.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Cold and poison rather than physical, one fixed superunique, and a short corridor. Venom is dead weight here and the weapon half is not, which is enough.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Poison and cold are the common immunities, so the physical half lands on everything even though Venom does not. Dense, undead, and close to a waypoint.",
      minTier: "nightmare",
      rating: 3,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "**Half a recommendation.** Fire, lightning and physical are all listed here, so a physical-immune pack is a Venom fight — and the Iron Maiden that the Oblivion Knights cast is worse for this build than for almost any other, because the curse reflects a share of five hits a second. Take the Fade package before you come here, or do not come.",
      minTier: "optimized",
      rating: 2,
    },
  ],

  immunityPlan:
    "**Physical immunity closes the larger half of this build, and the poison half is the answer that was designed in.** This site's own area census lists physical among the common immunities in eight of twenty farming areas — the Pit, the Cow Level, the Chaos Sanctuary, the Worldstone Keep, the River of Flame, Nihlathak's temple, the Stony Tomb and the Kurast temples — and against those monsters both the weapon share and Blade Fury's own damage stop. What does not stop is **Venom**, which is why it is twenty points of the core rather than a package: it is not physical, it rides every blade, and a blade lands every 0.2 seconds against a poison pinned to 0.4, so its uptime is total rather than partial. Poison is the commoner immunity on paper — ten of twenty areas — but the overlap is what matters, and **only two areas on the whole list carry both**: the Kurast temples and Nihlathak's. Those two are the real walls, and the honest advice for them is to farm something else. Three further notes. **Open Wounds is not physical and cannot be resisted at all**, so a physical immune has no defence against it — the catch is that the state only begins on an enemy already below full life, and against a physical immune it is Venom that draws the first blood. **Crushing Blow is physical and stops at the same wall**, and it is halved on this build anyway because the hit was delivered by a missile. And a **Might mercenary raises the half that is already blocked**, so if physical immunity is the recurring problem, the mercenary is not where the answer is.",

  hardcoreNotes:
    "**Take the Fade package, and take the Iron Maiden problem seriously.** The curse reflects a share of the damage you deal, and this build deals it in five instalments a second with no way to slow down — the cadence is fixed, so you cannot even choose to attack less often within an activation. Fade's curse-length reduction is the mitigation, and eighteen points of it cuts the duration by as much as 90%. Beyond that, the shape of the build is unusually kind to Hardcore: it is genuinely ranged at 40 units, it has no rotation to be interrupted, and being hit-stunned costs output rather than a life — which is why the Faster Hit Recovery breakpoint is marked required and the block breakpoint is not. The two real dangers are the Chaos Sanctuary, which is the worst room on the site for this specific curse, and running out of mana mid-pack: a per-blade cost with a held button empties a pool very fast, and a mercenary carrying Insight is the difference between a fight and a retreat.",

  selfFoundNotes:
    "**The most self-found-complete build on the class, and the reason is that half its damage does not come from an item at all.** Sixty points in the triangle multiply Blade Fury's own damage fivefold with no gear involved whatever, and twenty in Venom add a poison that no drop improves. The weapon half is the only part that wants a good item, and it accepts *any* one-handed weapon — a rare sword, a crafted claw, a Steel, a Passion — because what it reads is the damage range, not a specific affix. Nothing in the first four tiers is a runeword above four runes: Steel, Stealth, Lore, Treachery, Smoke, Duress, Spirit, Passion. There is no ladder gate anywhere on this page and no high rune until the optimized tier, which is optional by construction because the claw alternative sits beside it. **The one thing that is genuinely worth hunting is a plus to your skills**, and claws roll Assassin skills natively from the Act 1 vendor, who restocks on every town entry.",

  levelingPath: {
    summary:
      "**The awkward part is the first eighteen levels, and it is genuinely awkward.** Blade Fury does not exist until 18 and its two prerequisites sit outside the blades, so a character levelling into this build spends the first stretch on Fire Blast and a normal attack. Blade Sentinel arrives at 6 and is a real skill in that window — it patrols, it carries three quarters of your weapon, and one point in it is worth more than one point in anything else you can reach. From 18 the build is itself: Blade Fury, then Blade Sentinel to twenty, then Blade Shield from 30, then Venom from 30. The cadence never changes, so the character does not get faster — it only gets harder, which makes the levelling curve unusually smooth and unusually flat.",
    respecAt:
      "None required. If you have spent points on Burst of Speed expecting it to speed up the blades, that is the one respec this page would justify — and it is the commonest mistake made on this build.",
  },

  confidence: "verified",
  complete: true,
};
