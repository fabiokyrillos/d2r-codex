import type { Build } from "@/lib/types";

/**
 * The Phoenix Strike Assassin.
 *
 * WHY ALL FOUR SKILLS ARE MAXED, DERIVED RATHER THAN COPIED
 * ---------------------------------------------------------
 * Every guide maxes Phoenix Strike, Fists of Fire, Claws of Thunder and Blades
 * of Ice, and none of them says why in numbers. The reason is a closed loop
 * with **asymmetric rates**, and half of it is not on the skill rows at all.
 *
 * Outbound, from each charge-up's own row (`Param8`, "Damage synergy"):
 *
 *   Fists of Fire     <- Royal Strike x 12 %/point
 *   Claws of Thunder  <- Royal Strike x  8 %/point
 *   Blades of Ice     <- Royal Strike x  8 %/point
 *
 * Inbound is the half that is easy to miss. **Royal Strike's row carries no
 * synergy column and no damage column** — no `EDmgSymPerCalc`, no EMin/EMax.
 * Nothing feeds "Phoenix Strike", because Phoenix Strike has no damage of its
 * own to feed. It has three missiles, and the missiles carry the synergy:
 *
 *   royalstrikemeteor          20-40 fire   <- Fists of Fire    x 10 %/point
 *   royalstrikechainlightning   1-40 ltng   <- Claws of Thunder x 13 %/point
 *   royalstrikechaosice        16-32 cold   <- Blades of Ice    x 10 %/point
 *
 * So it is a four-way loop that pays 12/8/8 out and 10/13/10 back, and
 * **Claws of Thunder returns 13% per point where the other two return 10%** —
 * which is why it is maxed before them rather than after. (Larger synergy
 * rates exist elsewhere on the class: Lightning Sentry takes 18% from Shock
 * Web. The claim here is about these six rates, not about the Assassin.)
 * Every point in the core does two jobs. That is
 * the argument for maxing four skills, and it is the reason this page has only
 * seventeen points left over when the trap builds had twenty and thirty-seven.
 *
 * WHAT THE CHARGES ARE, AND WHAT SPENDS THEM
 * ------------------------------------------
 * Six rows carry `progressive = 1` and each has its **own** `aurastate` —
 * `progressive_damage`, `progressive_steal`, `progressive_fire`,
 * `progressive_lightning`, `progressive_cold`, `progressive_other`. Distinct
 * states, so charges built by different skills stand at the same time.
 *
 * Four Assassin rows carry `finishing = 1` with `prgchargestocast = 0` and
 * `prgchargesconsumed = 1`: Dragon Talon, Dragon Claw, Dragon Tail and — the
 * one every guide forgets — **Dragon Flight**. Zero charges required to press,
 * charges consumed when it lands.
 *
 * Charges stand for `auralencalc = 375` frames. Fifteen seconds, flat, at
 * every level.
 *
 * AND EACH CHARGE-UP RUNS ITS OWN FIFTEEN SECONDS
 * -----------------------------------------------
 * `states.json` gives every one of the six a `pgsv = 1` row with its own
 * `stat` and its own `pgsvoverlay`, and **none of the six sits in a `group`**.
 * `group` is the column that makes states exclude each other — the control is
 * `group = 1`, which holds exactly the Sorceress armours (`bonearmor`,
 * `chillingarmor`, `frozenarmor`, `shiverarmor`, `mindbarrier`,
 * `psychicward`) whose mutual exclusion nobody disputes. So the timers are
 * six, they are independent, and:
 *
 *   - a second Phoenix Strike hit re-applies `progressive_other` and therefore
 *     restarts *that* fifteen seconds;
 *   - charging Tiger Strike starts `progressive_damage` and does not touch it;
 *   - the charge *count* lives in those stats, which are `Send Bits 3` —
 *     three bits, which is why three is the ceiling.
 *
 * THE MOSAIC CONSEQUENCE, AND WHY IT IS NOT WHAT GUIDES SAY
 * ---------------------------------------------------------
 * `Param8 = 1` on Dragon Claw, Dragon Talon and Dragon Tail, and the row's own
 * description column is explicit:
 *
 *   "Always Hit (0 = disabled | 1 = enabled only when Charges are consumed)"
 *
 * A finisher cannot miss — **on the swing that spends charges.** Mosaic's whole
 * purpose is a 50% chance *not* to spend them, and on exactly those swings the
 * override does not apply.
 *
 * Two independent columns confirm the swing rolls to hit normally, which is
 * what makes the override meaningful rather than decorative:
 *
 *   - `ToHit` / `LevToHit` are present on all three finishers (Dragon Claw
 *     40/25, Dragon Talon 20/35, Dragon Tail 20/15) and on every charge-up
 *     (25/10). Smite, the canonical never-misses skill, carries neither.
 *   - Royal Strike's `aurastat2 = progressive_tohit` with
 *     `aurastatcalc2 = par7 = 25` grants +25% attack rating **per charge** —
 *     a bonus that would be pointless on a swing that cannot miss.
 *
 * So attack rating is dead weight on a Ladder-legal Phoenix Strike and live on
 * a Mosaic one. That is the opposite of the usual advice, and it is why the
 * Claw Mastery package exists.
 *
 * TWO MOSAICS DO GIVE 100%, AND IT IS DERIVED RATHER THAN REPEATED
 * ----------------------------------------------------------------
 * Cycle 4 left this open. It is not open: `item_charge_noconsume` (`*ID 200`)
 * settles it in three columns, each with a control inside the same file.
 *
 *   - **`damagerelated` is absent (0).** That flag is what restricts a stat to
 *     one weapon — d2mods.info's ItemStatCost guide: "restricted to a single
 *     weapon and not stack with the item owners accumulated total ... the game
 *     copies all these stats (from the weapon involved) to a temporary
 *     statlist". 108 stats carry it, and they are exactly the ones nobody
 *     expects to stack across two weapons: every elemental damage pair, both
 *     leeches, `tohit`, `item_fasterattackrate` — the last of which is the
 *     off-hand-IAS rule this project already proved 15/15 in cycle 3. The
 *     sibling property `item_noconsume` **does** carry the flag. This one does
 *     not, so both claws' values reach the accumulated total, the same path
 *     that makes two claws' `+skills` add.
 *   - **No `Save Param Bits`.** Instances are not keyed by a parameter, so two
 *     sources sum into one entry rather than standing as two. The contrast is
 *     `item_skillonhit`, which carries `Save Param Bits 16` precisely so that
 *     two different procs stay separate.
 *   - **No `maxstat`.** Only four stats in the whole file carry one —
 *     `durability`, `hitpoints`, `mana`, `stamina` — and all four are
 *     current/max pairs. There is no cap. `Save Bits 7` holds 0–127, so 100
 *     is representable.
 *
 * One claw 50%. Two claws 100%. **One roll, not two**, because the stat is a
 * single summed value — so there is no application order and no second chance.
 * A finisher that misses spends nothing, so the roll only matters on the one
 * that lands. And because the property's only job is to skip the consumption
 * step, a preserved finisher leaves the fifteen seconds where they were: it
 * does not restart them. That last sentence is derived from the mechanism
 * rather than measured, and the page says so where it says it.
 *
 * WHAT IS STILL NOT ESTABLISHED, AND IS NOT PUBLISHED
 * ---------------------------------------------------
 * - Whether swapping weapons or changing area clears the charge states.
 * - The semantics of `prgchargesconsumed = 1` beyond "charges are consumed".
 *   Whether the 1 counts charges or is a flag is not determinable, so the page
 *   says "spends the standing charges", which is what the skill pages say.
 *
 * SPEED
 * -----
 * Royal Strike is `anim = A1, seqtrans = A1`; Dragon Claw is `SQ -> A1`. Both
 * are attack animations, so this build runs on attack speed. Faster Cast Rate
 * reaches Mind Blast, Cloak of Shadows, Fade and Burst of Speed and nothing
 * else — the same contract `scripts/trap-speed.test.ts` enforces for the trap
 * builds, applied to a different animation family. No universal IAS number is
 * published, for the same reason it is not published there: the requirement
 * depends on both claws' base speed.
 */
export const phoenixStrike: Build = {
  slug: "phoenix-strike",
  name: "Phoenix Strike",
  classSlug: "assassin",
  summary:
    "Three charges, three elements, released by a finisher. The Assassin who answers an immunity by having two more, and the one build on the class whose best claw cannot be obtained on Ladder at all.",
  damageTypes: ["fire", "lightning", "cold", "physical"],
  primarySkill: "phoenix-strike",
  playstyle:
    "You swing to charge and swing to spend. Three hits with Phoenix Strike stack three charges — a meteor, then chain lightning, then a burst of sixteen ice bolts — and a finisher releases them into whatever you are standing next to. Charges stand for fifteen seconds, so the rhythm is not frantic: charge on the way in, release on the thing that matters, and let the fifteen seconds cover the walk to the next pack. What changes everything about that rhythm is one claw. Without Mosaic, every finisher spends the charges and every finisher therefore lands automatically, so the cadence is a fixed three-and-release and attack rating is worth nothing to you. With Mosaic, half your finishers keep the charges — and those are exactly the swings that have to roll to hit. The build gets faster and starts caring about attack rating in the same instant.",
  strengths: [
    "**Fire, lightning and cold from one button.** An immune pack does not stop this build; it just costs you one of the three",
    "**Every point in the core does two jobs.** Phoenix Strike feeds the other three at 12/8/8 per point, and each of them feeds one of its missiles back at 10/13/10 — a closed loop, not a pile of synergies",
    "Charges last a flat fifteen seconds at every level, so the rotation survives walking, looting and a chase",
    "A finisher cannot miss on the swing that spends charges, so the Ladder-legal version needs no attack rating at all",
    "It is the only Assassin build that can be played on Ladder today and be materially better on Non-Ladder — the same page, one claw apart",
  ],
  weaknesses: [
    "**It is melee, on a class with no life-per-level to speak of.** Everything here is delivered by walking up to the thing",
    "**The best-in-slot claw cannot be obtained on the current Ladder by any route** — not made, not traded, not carried in. The block above is not a footnote",
    "Four skills maxed leaves seventeen points. This is the tightest point budget on the class, and there is no fourth package to be had",
    "**Iron Maiden.** The Chaos Sanctuary punishes a fast multi-hit melee attack harder than it punishes anything else on this site",
    "The damage is spread across three elements, so a single-element facet or Sunder Charm buys you a third of what it buys a Sorceress",
    "Dragon Claw needs a claw in **both** hands, so there is no shield on this build and no Spirit block",
  ],
  difficulty: "advanced",
  budget: "medium",
  ratings: {
    clearSpeed: 4,
    bossing: 4,
    survivability: 3,
    magicFind: 3,
    terrorZones: 4,
    ubers: 2,
    soloSelfFound: 3,
    players8: 3,
  },

  skills: [
    {
      skill: "phoenix-strike",
      points: 20,
      role: "main",
      order: 1,
      note: "**The charge engine, and the only synergy the other three have.** Twenty points here is +240% on Fists of Fire, +160% on Claws of Thunder and +160% on Blades of Ice — before it has fired a single missile of its own. It is maxed first because it is the one skill that pays into everything else on the page.",
    },
    {
      skill: "claws-of-thunder",
      points: 20,
      role: "synergy",
      order: 2,
      note: "**Maxed before the other two, and the reason is a rate.** The chain-lightning missile — the two-charge release — reads `EDmgSymPerCalc = (skill('Claws of Thunder'.blvl))*13`, so this skill pays 13% per hard point into it, against the 10% that Fists of Fire and Blades of Ice pay into theirs. Three points of difference on twenty points is why this one goes first. It is also a charge-up in its own right, so the points are never idle.",
    },
    {
      skill: "fists-of-fire",
      points: 20,
      role: "synergy",
      order: 3,
      note: "Feeds the one-charge meteor at 10% per hard point, and takes the most back from Phoenix Strike of the three at 12%. Max it third and the meteor stops being the charge you release by accident.",
    },
    {
      skill: "blades-of-ice",
      points: 20,
      role: "synergy",
      order: 4,
      note: "Feeds the three-charge ice burst at 10% per hard point — sixteen bolts, and the release you will actually be aiming for. Last only because it is the one whose element the fewest monsters resist, so it is the least urgent, not the least useful.",
    },
    {
      skill: "tiger-strike",
      points: 1,
      role: "prerequisite",
      note: "Required for Cobra Strike, and therefore for Phoenix Strike. **Worth pressing anyway**: its charges sit in a different state (`progressive_damage`) from Phoenix Strike's, so the two stand at the same time and one finisher spends both.",
    },
    {
      skill: "cobra-strike",
      points: 1,
      role: "prerequisite",
      note: "The other half of Phoenix Strike's prerequisite. Its charges are `progressive_steal` — life and mana leech on the release — and on a build with no leech in the gear plan until the fourth tier, that is not nothing.",
    },
    {
      skill: "dragon-talon",
      points: 1,
      role: "prerequisite",
      note: "Dragon Claw's prerequisite. It is also a perfectly good emergency finisher: its damage comes from the boots rather than the claws, so it works when the claws are the problem.",
    },
    {
      skill: "dragon-claw",
      points: 1,
      role: "utility",
      note: "**The finisher, and one point is the whole cost.** A finisher's job is to release the charges, and the release damage is the missiles' — not the finisher's. Points above one buy the finisher's own weapon damage, which is what the Claw Mastery package is for. It strikes with both claws, so this build holds two.",
    },
    { skill: "claw-mastery", points: 1, role: "utility", note: "Attack rating, damage and critical chance with claws — and a 4% per point damage synergy for Dragon Claw. One point now; see the packages." },
    { skill: "burst-of-speed", points: 1, role: "utility", note: "Run speed and up to 60% attack speed, undiminished. On a build that swings to charge and swings to spend, attack speed is the clear speed." },
    { skill: "weapon-block", points: 1, role: "utility", note: "Block with two claws and no shield. The only reason a melee Assassin can stand where this build stands." },
    { skill: "psychic-hammer", points: 1, role: "prerequisite", note: "The Shadow tree's other root, and Cloak of Shadows' prerequisite." },
    { skill: "cloak-of-shadows", points: 1, role: "utility", note: "Blinds a room and strips its defence. On a melee build it is the opener, not the escape." },
    { skill: "fade", points: 1, role: "utility", note: "Resistances, curse length and physical damage reduction. One point now; the Hardcore package takes it to eighteen." },
    { skill: "shadow-warrior", points: 1, role: "prerequisite", note: "Shadow Master's prerequisite. Replaced by it, since both share `pettype = shadowwarrior` with `petmax = 1`." },
    { skill: "mind-blast", points: 1, role: "utility", note: "Stun and convert. The one skill on this page that is genuinely a cast — it plays the `SC` animation and is the only thing your Faster Cast Rate is buying." },
    { skill: "shadow-master", points: 1, role: "utility", note: "A second body in the pack, which on a melee build is a second thing for the pack to hit." },
  ],

  skillPackages: [
    {
      id: "the-last-seventeen",
      name: "The seventeen points four maxed skills leave you",
      choose: "one",
      intro:
        "The core above is 93 of 110, and the loop is **closed**: Phoenix Strike and its three elements are all at twenty, so no further point anywhere raises a missile. Seventeen are left — the tightest budget on the class, and the reason there are three routes here rather than four. **Take exactly one.** Each costs exactly seventeen and the plan closes at 110 whichever you take. The first is the answer if you have Mosaic, the second if you have not, and the third if dying would end the character.",
      packages: [
        {
          id: "claw-mastery",
          name: "Claw Mastery",
          when: "**The Mosaic package.** Take it when you are holding one or two Mosaics — which, on the current Ladder, you are not and cannot be.",
          tradeoff:
            "Every one of the seventeen points is spent on landing and enlarging a swing rather than on surviving one. Against Iron Maiden and in the Chaos Sanctuary you will feel the Fade package you did not take.",
          skills: [
            {
              skill: "claw-mastery",
              points: 18,
              role: "main",
              order: 1,
              note: "**Attack rating, and this is the one build where that sentence needs defending.** Without Mosaic every finisher consumes charges, so `Param8 = 1` makes every finisher hit and attack rating is worth nothing. With Mosaic, half of them preserve charges — and a preserving swing is not a consuming swing, so the Always Hit override is off and the swing rolls to hit like any other. Mosaic buys uptime and sells you the guaranteed hit. This is what buys it back, and it raises Dragon Claw's damage 4% per point on the way.",
            },
          ],
          rotationNote:
            "Unchanged in shape, faster in cadence. With charges preserved you press the finisher far more often than one swing in four, which is the whole point of the claw.",
          gearNote:
            "It changes what you look for on the rings and amulet: attack rating becomes a real affix on this route and is worthless on the other two.",
          statNote: "No change.",
          contentNote: "Non-Ladder and offline, where Mosaic can actually be made.",
        },
        {
          id: "venom",
          name: "Venom",
          when: "**The default, and the only one of the three that is fully available on Ladder.** Take it unless you are on Hardcore.",
          tradeoff:
            "It does nothing for attack rating, which is fine here — without Mosaic your finisher cannot miss anyway — and nothing for resistances, which is not fine in the Chaos Sanctuary.",
          skills: [
            {
              skill: "venom",
              points: 17,
              role: "main",
              order: 1,
              note: "**A fourth element, on a build whose case is already that it has three.** Poison rides every swing, and this build makes a great many swings. Two things to know, both from the row: its length is `ELen = 10` under `skill_poison_override_length` — four tenths of a second, and it **overrides** rather than stacks, so more hits per second buy uptime and not magnitude. And it is a Shadow Disciplines skill, so Fade's one core point already paid its prerequisite.",
            },
          ],
          rotationNote:
            "Re-cast it with Burst of Speed at the start of a run. At seventeen points it stands for the better part of six minutes.",
          gearNote: "Nothing changes, which is most of the case for this route on a Ladder character.",
          statNote: "No change.",
          contentNote: "Ladder, and anywhere a pack resists one of your three elements and not poison.",
        },
        {
          id: "fade",
          name: "Fade",
          when: "Hardcore, and any character who intends to run the Chaos Sanctuary on purpose.",
          tradeoff:
            "**It costs you Burst of Speed, and therefore attack speed**, because the two cannot be up together — and on a build that swings to charge, attack speed is clear speed. It also spends nothing on damage.",
          skills: [
            {
              skill: "fade",
              points: 18,
              role: "main",
              order: 1,
              note: "**All four resistances climbing toward 75%, curse length cut by up to 90%, and 1% physical damage reduction per level.** On this build the curse line is the one that matters: Iron Maiden reflects a share of the damage you deal, and a fast multi-hit melee attack is the worst thing you can be holding when it lands. Eighteen points cuts how long it sticks.",
            },
          ],
          rotationNote:
            "You lose Burst of Speed's attack speed, so the fixed three-charges-and-release cadence gets slower. Cloak of Shadows becomes the opener rather than a luxury.",
          gearNote:
            "**The largest gear change of the three, in what it stops you needing.** Eighteen points of Fade is resistance you no longer buy on rings, amulet and charms, so those slots go to attack speed and damage instead.",
          statNote: "No change. Vitality with everything after gear requirements.",
          contentNote: "Hardcore, the Chaos Sanctuary, and any Terror Zone you intend to stand still in.",
        },
      ],
    },
  ],

  flexPoints: [
    "There are none, and that is the honest answer. Four maxed skills, nine one-point utilities and four prerequisites come to 93; the package spends the remaining 17 exactly. If you are reading this before level 99, the order in the core above is the order to spend in.",
    "**Quest skill points are already counted.** The 110 total is 99 level-ups minus one, plus twelve quest points across three difficulties. A character who has skipped Izual or the Golden Bird has fewer, and should hold the package until the end.",
  ],

  stats: {
    strength: "Enough for your claws and your armour, and not one point more. Claws are the lightest weapon class in the game — a Runic Talons needs 79 — so the armour is usually what sets the number.",
    dexterity: "Enough for your gear, then stop. **Attack rating from dexterity is worth nothing on the Ladder-legal route**, because a finisher that spends charges cannot miss. On the Mosaic route it is worth something, and even there Claw Mastery buys more attack rating per point than dexterity does.",
    vitality: "Everything else. This is a melee build on a class with no Battle Orders of its own until you find a Call to Arms.",
    energy: "None. Mana comes from Cobra Strike's charges, from leech, and from a belt.",
    notes: [
      "**Block is not a dexterity decision here.** Weapon Block is a skill, not a stat, and it works with two claws and no shield — which is the only reason a build with no shield slot can stand in melee at all.",
      "The Mosaic route and the Ladder route want the same attributes. Nothing in this plan changes with the claw; only the skill package does.",
      "If you take the Fade package, resistances arrive from skill rather than gear, and the points you would have spent reaching a resistance requirement go to vitality instead.",
    ],
  },

  breakpoints: [
    {
      stat: "fcr",
      value: 65,
      frames: 11,
      priority: "recommended",
      why: "**For Mind Blast, Cloak of Shadows, and whichever of Fade or Burst of Speed you have up — not both, since one drops the other — and not for anything you attack with.** Cast rate shortens the Assassin's `SC` animation, taking 16 frames to 11. Phoenix Strike and Dragon Claw are attack animations and are not on this table at all.",
    },
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "required",
      why: "**Required rather than recommended, because this build stands in the pack.** The trap builds lay from behind a line and can treat recovery as a luxury; a melee Assassin being hit-stunned between a charge and a release loses the charge window, not just a second.",
    },
    {
      stat: "fbr",
      value: 86,
      frames: 3,
      priority: "recommended",
      why: "Weapon Block gives you a block chance without a shield, and a block you do not recover from quickly is a block you are still paying for. Worth reaching once Weapon Block has levels from +skills.",
    },
  ],
  breakpointNotes:
    "**This build runs on attack speed, and there is deliberately no Increased Attack Speed row above.** Phoenix Strike is `anim = A1, seqtrans = A1` and Dragon Claw is `SQ -> A1` — both attack animations, so the claw's own base speed is an input to the same formula that the affix feeds, and a single percentage would be wrong for most readers. The same three rules apply here as on the trap pages, and they are the ones that catch people out: **two claws use the average of both bases**; **Increased Attack Speed on the off-hand claw does not count**; and **Burst of Speed adds as much as 60% undiminished**, which is why the Fade package genuinely costs you speed rather than merely costing you a buff. Mosaic itself carries +20% Increased Attack Speed on the claw that has it, so a Mosaic route arrives with some of the requirement already paid. Being chilled slows the animation, so Cannot Be Frozen protects the cadence. For a specific pair of claws, use an attack-speed calculator and give it both bases, the Increased Attack Speed on the main hand only, and your Burst of Speed level. **Faster Cast Rate does not touch any of this** — it buys Mind Blast and the buffs, which is why the table above says so in the row rather than leaving you to assume.",

  gearSets: [
    {
      tier: "starter",
      goal: "Reach Phoenix Strike at level 30 alive. Nothing here is worth more than a handful of low runes, and the claws come from a vendor.",
      levelRange: [1, 32],
      nextUpgrade: "A second claw with +Martial Arts, and Spirit on the switch the moment you are 25.",
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any claw with +3 to a Martial Arts skill, or +2 to Martial Arts",
              why: "Claws roll Assassin skills natively and Charsi restocks on every town entry. Until level 30 you are levelling on Tiger Strike and Dragon Claw, so +3 Tiger Strike is the affix that carries you.",
              lookFor: ["+2 to Martial Arts", "+3 to Tiger Strike", "+3 to Dragon Claw", "Increased Attack Speed"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "A second claw, any claw",
              why: "**Dragon Claw strikes with both hands and needs two claws equipped to do what it says.** A bad second claw is worth more than a good shield here, and that stays true for the whole build.",
              lookFor: ["+2 to Martial Arts", "Increased Attack Speed"],
            },
          ],
        },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to all skills for two runes, and the lightning resistance is the one you are shortest of in Act 3." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Faster hit recovery and faster run, for two of the commonest runes in the game. The hit recovery matters more here than on a trap build." }] },
        { slot: "gloves", picks: [{ label: "Any gloves with Increased Attack Speed", why: "Attack speed is how fast you charge and how fast you release. Twenty percent from a blue pair beats resistances at this level." }] },
        { slot: "belt", picks: [{ label: "Any belt with life and resistances", why: "Four rows, and something to put in them." }] },
        { slot: "boots", picks: [{ label: "Any boots with faster run/walk and resistances", why: "You close distance for a living now." }] },
        { slot: "ring1", picks: [{ label: "Any ring with life or resistances", why: "Not attack rating. Your finisher cannot miss while it is spending charges." }] },
        { slot: "ring2", picks: [{ label: "Any ring with life or resistances", why: "Same again." }] },
        { slot: "amulet", picks: [{ label: "Any amulet with +Assassin skills or resistances", why: "+skills is kick-for-kick the best affix on the class." }] },
      ],
    },
    {
      tier: "nightmare",
      goal: "Phoenix Strike is online and the loop has begun. Resistances to 75 by the end of Nightmare, and the first real claws.",
      levelRange: [32, 55],
      nextUpgrade: "Two claws with +2 Martial Arts and Increased Attack Speed together, and a Treachery.",
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "A claw with +2 to Martial Arts and Increased Attack Speed",
              why: "**Both affixes on one claw is the hunt.** +2 Martial Arts raises Phoenix Strike and all three of its synergies at once, which on this build is four skills from one line of text.",
              lookFor: ["+2 to Martial Arts", "+3 to Phoenix Strike", "Increased Attack Speed", "Life stolen per hit"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "A second claw, favouring the faster base",
              why: "Two claws average their base speed, so a fast off-hand pulls the whole attack faster even though its own Increased Attack Speed does not count.",
              lookFor: ["+2 to Martial Arts", "A Greater Talons or Runic Talons base"],
            },
          ],
        },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find while you farm the runes for everything below.", alternatives: [{ ref: { kind: "runeword", slug: "lore" }, why: "Still fine, and still two runes." }] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "**The Assassin armour.** 45% Increased Attack Speed, and a chance to cast Fade when you are struck — which is free resistance on a build that is being struck.", alternatives: [{ ref: { kind: "runeword", slug: "smoke" }, why: "If the Lem is not there yet: +50 to all resistances for two runes." }] }] },
        { slot: "gloves", picks: [{ label: "Rare or crafted gloves with 20% Increased Attack Speed", why: "Twenty percent is the whole slot. Resistances on top of it are a bonus." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduction and life leech, which is exactly what a melee Assassin is short of in Nightmare." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "Sixty-five life and a heal, on a class that has very little of either." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "**Cannot Be Frozen, which on this build is a speed stat** — being chilled lengthens the attack animation." }] },
        { slot: "ring2", picks: [{ label: "Any rare ring with life, resistances and leech", why: "Leech is how a melee character stays up before the gear plan provides it." }] },
        { slot: "amulet", picks: [{ label: "+2 Assassin skills, or +3 Martial Arts", why: "+3 Martial Arts is four of your five core skills at once." }] },
      ],
    },
    {
      tier: "early-hell",
      goal: "Survive the resistance penalty and start clearing. This is where the build's three elements begin to pay and where melee starts to hurt.",
      levelRange: [55, 70],
      nextUpgrade: "Two claws with +3 Phoenix Strike, and the decision about which package you are taking.",
      slots: [
        { slot: "weapon", picks: [{ label: "A claw with +3 to Phoenix Strike and +2 Martial Arts", why: "+3 Phoenix Strike is +36% to Fists of Fire and +24% to each of the other two, on top of the missile it fires itself.", lookFor: ["+3 to Phoenix Strike", "+2 to Martial Arts", "Increased Attack Speed", "Life stolen per hit"] }] },
        { slot: "offhand", picks: [{ label: "A second claw with +2 Martial Arts on a fast base", why: "Its Increased Attack Speed does not count, so buy skills and base speed with this slot and attack speed with the other one." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Physical damage reduction and life stolen per hit. The single most useful helm a melee Assassin can find rather than build." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "Still the answer, and still 45% attack speed." }] },
        { slot: "gloves", picks: [{ label: "Crafted or rare gloves with 20% Increased Attack Speed and life stolen per hit", why: "Attack speed and leech in one slot. **Dracul's Grasp is the upgrade here and it needs level 76**, which is a tier away — do not plan this slot around it yet.", lookFor: ["20% Increased Attack Speed", "Life stolen per hit", "Resistances"] }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduction is the stat that keeps a melee Assassin alive in Hell." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Open Wounds and Deadly Strike. **They apply to Dragon Claw, not to the released missiles** — the missiles are the charge damage and do not swing a weapon." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, still a speed stat." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with life, leech and resistances", why: "Resistance is the Hell tax and this is where you pay it." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 to all resistances, which is both halves of the problem in one slot." }] },
      ],
      charms: [{ label: "Martial Arts skillers, and life/resistance small charms", why: "A Martial Arts skiller raises Phoenix Strike and all three synergies, which makes it worth more on this build than on any other page on the site." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders is the largest single life increase available to this class, and it is claw-capable — so it goes on a spare claw rather than costing you a weapon type. Level 57, which is why it arrives at this tier and not the last one." }],
    },
    {
      tier: "budget",
      goal: "A finished Ladder-legal character. Everything here can be made or found on the current Ladder — deliberately, because the tier above cannot.",
      levelRange: [70, 85],
      nextUpgrade: "Mosaic — but only if you can make one, which means Non-Ladder or offline. On Ladder the tier above is closed to you, and this is the finished build rather than a stop on the way to it.",
      slots: [
        { slot: "weapon", picks: [{ label: "The best +3 Phoenix Strike claw you can find, with 20% Increased Attack Speed", why: "**On Ladder this is your endgame weapon slot, so buy it properly.** A rare Runic Talons with +3 Phoenix Strike, +2 Martial Arts and 20% Increased Attack Speed is the target.", lookFor: ["+3 to Phoenix Strike", "+2 to Martial Arts", "20% Increased Attack Speed", "Runic Talons or Greater Talons base"] }] },
        { slot: "offhand", picks: [{ label: "A second Runic Talons with +3 Phoenix Strike", why: "Base speed averages across both hands, so an elite claw base in the off-hand is worth real frames even though its attack-speed affix is not." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "coven" }, why: "+2 skills and resistance in a helm you can make. On Ladder, made beats found." }, { ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 Assassin skills and 20% Increased Attack Speed, at the cost of −30% fire resistance you have to answer elsewhere." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, +65 resistances and 8% damage reduction. The best body armour a melee Assassin can wear that is not Enigma.", alternatives: [{ ref: { kind: "runeword", slug: "duress" }, why: "Far cheaper, and its Crushing Blow lands on Dragon Claw." }] }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking remains the best survivability line available to the slot." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduction, still." }, { ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills if your resistances are already handled." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow on the finisher." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills and the mana to press a charge-up without thinking about it." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 resistances." }, { ref: { kind: "unique", slug: "highlords-wrath" }, why: "Deadly Strike scaling with level and 20% Increased Attack Speed, if resistances are covered." }] },
      ],
      charms: [{ label: "Martial Arts skillers with life", why: "Four skills per skiller. Nothing else on this page scales like it." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders on a claw switch. Made from runes, so it is available on Ladder." }],
    },
    {
      tier: "optimized",
      goal: "The Mosaic character. **This tier is not reachable on the current Ladder** — see the availability block at the top of the page — and everything in it assumes Non-Ladder online or offline.",
      levelRange: [85, 99],
      nextUpgrade: "A second Mosaic, which is the difference between half your finishers preserving and all of them.",
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "mosaic" },
              why: "**50% chance for finishing moves to not consume charges — and that is a percent chance, not a guarantee.** It also carries +2 Martial Arts, +20% Increased Attack Speed and 200–250% Enhanced Damage. What it changes is not damage but cadence: charges that survive a finisher are charges you did not spend three swings rebuilding. **What it costs you is the guaranteed hit** — a swing that preserves charges is not a swing that consumes them, so the Always Hit flag is off and it rolls to hit. Take the Claw Mastery package with this claw.",
              sockets: "Mal, Gul, Amn, in that order, into a 3-socket claw. Getting the order wrong costs three high runes.",
              modes: { ladder: ["non-ladder"] },
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "mosaic" },
              why: "**A second Mosaic takes the chance to 100%, and that is derived rather than repeated.** `item_charge_noconsume` carries no `damagerelated` flag, so unlike weapon damage or leech it is not restricted to one hand and both claws reach the character's accumulated total. It carries no `Save Param Bits`, so the two values sum into one entry rather than rolling separately — **one roll per finisher, at 100%, not two rolls at 50%**. And only four stats in the entire file carry a `maxstat` cap; this is not one of them. So the second claw is the whole build: every finisher preserves, and the three-swings-then-release cadence stops existing. What it does not do is restart the fifteen seconds — the property skips the consumption step and touches nothing else.",
              sockets: "Mal, Gul, Amn again.",
              modes: { ladder: ["non-ladder"] },
              alternatives: [{ label: "A rare Runic Talons with +3 Phoenix Strike", why: "One Mosaic and one good rare is a perfectly reasonable stopping point, and it is three high runes cheaper." }],
            },
          ],
        },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "dream" }, why: "Holy Shock as an aura you wear, and +30 to all resistances. Its lightning damage is one of the three elements you already deal." }, { ref: { kind: "unique", slug: "crown-of-ages" }, why: "Damage reduction and two sockets, if you would rather not spend a Jah." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, +65 resistances, 8% damage reduction." }, { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, which changes how a melee build reaches a pack more than any damage affix would." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking — and with Mosaic you strike more often." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills." }, { ref: { kind: "unique", slug: "string-of-ears" }, why: "If physical damage is what is killing you." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow on Dragon Claw." }, { ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Stamina, poison length reduction and far better strength/vitality, if Crushing Blow is not the bottleneck." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, and **attack rating that is finally worth something** on a Mosaic character." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }, { ref: { kind: "unique", slug: "highlords-wrath" }, why: "Deadly Strike and 20% Increased Attack Speed." }] },
      ],
      charms: [{ label: "Martial Arts skillers, Annihilus, Hellfire Torch", why: "The Torch is +3 Assassin skills, which is three levels on every skill in the loop at once." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, on a spare claw." }],
    },
    {
      tier: "bis",
      goal: "The ceiling. Two Mosaics, and gear chosen to make the swings between releases matter as much as the releases.",
      levelRange: [90, 99],
      nextUpgrade: "Nothing. Roll a Kicksin and take the boots you have been ignoring.",
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "mosaic" }, why: "On the fastest elite claw base you can find. Runic Talons at −30 base speed is the usual answer.", sockets: "Mal, Gul, Amn.", modes: { ladder: ["non-ladder"] } }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "mosaic" }, why: "The second one, and the reason this tier exists. 50 on its own row plus 50 on the other reaches **100% preservation on a single roll**, because the stat is neither weapon-restricted nor parameter-keyed nor capped. Charges stop being a resource.", sockets: "Mal, Gul, Amn.", modes: { ladder: ["non-ladder"] } }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "dream" }, why: "An aura you wear, on a build that wants to be standing next to things anyway." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport. On a melee build with a fifteen-second charge window, the ability to arrive is worth more than another damage line." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, and the faster cast rate reaches Mind Blast." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, upgraded to Myrmidon Greaves if you have the strength for it." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Deadly Strike and attack speed, with resistances covered by Dream and Enigma." }] },
      ],
      charms: [{ label: "Annihilus, Hellfire Torch, Martial Arts skillers with life", why: "+3 Assassin skills from the Torch alone is three levels on all four core skills." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Might, not Holy Freeze, and the reason is the charge window.** A Holy Freeze merc chills the pack, which is usually a gift and is a small tax here: a chilled monster walks out of the release radius more slowly, but this build's problem is never that things reach it too fast — it is standing next to them already. Might raises the physical half of every charge-up swing and Dragon Claw's own damage. Prayer is a defensible second choice on Hardcore. Give him Insight if mana is tight before you have leech, and Fortitude once you can. **What he cannot help with is Iron Maiden** — the curse is on you, not on him.",

  farming: [
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "**The best fit on the page.** The only common immunity here is physical, so all three of your elements land on everything, and a herd that walks into melee range is a build that never has to close distance. Charge on the approach, release into the middle.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "Fire and lightning are the common immunities, which leaves **cold — the three-charge release, the one you were aiming for anyway**. A short run, a fixed pack, and everything stands in one place for a melee character.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Physical, cold and lightning are the common immunities here, so **fire is the charge that answers this area** — the one-charge meteor, released early rather than held. Two enclosed levels at the highest area level in Act 1.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Poison and cold, so fire and lightning both land. High density in one room, which is what a build with a fifteen-second charge window wants — you charge once and release three times.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "andariel",
      difficulty: "hell",
      why: "Poison only, so nothing you deal is resisted. A corridor to the throne and a boss that stands still while you charge to three.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "**Cold is the answer here** — fire, lightning and physical are all on this area's immunity list and cold is not. But read the immunity plan before you go: this is the Iron Maiden room, and a fast multi-hit melee attack is the worst thing to be holding when that curse lands. Take the Fade package or learn to watch for the Oblivion Knights.",
      minTier: "budget",
      rating: 3,
    },
  ],

  immunityPlan:
    "**This build's answer to immunity is that it has three of them, and the honest version of that sentence has a caveat.** Phoenix Strike releases fire on one charge, lightning on two and cold on three, so a pack that resists one element is answered by the other two without changing a single point or item. That is a real structural advantage and it is why this page rates Terror Zones well. The caveat is that the advantage is *dilution*, not penetration: a single Sunder Charm or a stack of facets buys a Sorceress a whole build and buys you a third of one, because only a third of your damage is the element it names. **Do not build around a facet here.** Four things actually help, in order. First, **choose which charge you release**. This is the skill the build is really about: release at one charge in the Pit where lightning and cold are resisted, hold to three in Travincal where fire and lightning are. A player who always charges to three is playing a cold build with two wasted charges. Second, **Dragon Claw's own physical damage** lands on anything that is not physical immune, and Crushing Blow from Gore Rider applies to it — the finisher is a weapon attack, so the boots' Crushing Blow works on it even though it does nothing for the released missiles. Third, the **Venom package**, which adds a fourth element that almost nothing on the farming list resists. Fourth, and worth saying because the census says it: **Worldstone Keep lists physical, fire, lightning and cold among its common immunities** — all three of your elements and your weapon damage. It is the one area on this site where 'I have three elements' is not an answer, and it is not on the farming list above for that reason.",

  hardcoreNotes:
    "**Take the Fade package, and take the Chaos Sanctuary seriously.** This is a melee build on a class with no innate life bonus, and the two things that kill it are the same two every time. Iron Maiden reflects a share of the damage you deal, and a fast multi-hit attack with Crushing Blow on the boots is close to the worst possible thing to be doing when it is on you — Fade's curse-length reduction is the mitigation, and eighteen points of it cuts the duration by up to 90%. The other is simply arriving: a melee character with no Teleport walks into rooms, and Cloak of Shadows before you walk in is the difference. Weapon Block is not optional here, which means two claws is not optional either. **And one thing specific to Non-Ladder Hardcore:** Blizzard's stated reason for disabling Mosaic on Ladder was a graphics fault that could crash clients in the Chaos Sanctuary. That fix has never appeared in a patch note, so on the modes where Mosaic *is* legal, the risk it was disabled for has not been announced as resolved. On Hardcore that is a reason to think twice, not a reason to panic.",

  selfFoundNotes:
    "**Better self-found than it looks, and the reason is the vendor.** Claws roll Assassin skills natively and Charsi restocks every time you re-enter town, so the single most important item on the page — a claw with +3 Phoenix Strike and +2 Martial Arts — is something you shop for rather than farm. Nothing in the first four tiers is a runeword above four runes: Lore, Stealth, Treachery, Coven. The build is fully finished at the budget tier without a single high rune. **What is not available self-found on Ladder is the optimized tier at all**, and that is a mode restriction rather than a rarity one — no amount of farming produces a Mosaic on a Ladder character. Offline and Non-Ladder self-found, Mal + Gul + Amn is a realistic target from Countess runs and the Hellforge.",

  levelingPath: {
    summary:
      "**Phoenix Strike does not exist until level 30, so the first thirty levels are somebody else's build.** The honest route is Tiger Strike and Dragon Claw with a vendor claw — Tiger Strike's charges multiply the physical damage of the swing that spends them, which is enough through Normal — and then the four-skill loop from 30 onward. Nothing spent on Tiger Strike or Cobra Strike is wasted: both are prerequisites the endgame plan pays for anyway, and both hold charges alongside Phoenix Strike's.",
    respecAt: "Level 30, when Phoenix Strike unlocks — and only if you overspent on Dragon Claw before then. A clean run needs no respec at all.",
  },

  gatedBy: ["mosaic"],
  confidence: "verified",
  complete: true,
};
