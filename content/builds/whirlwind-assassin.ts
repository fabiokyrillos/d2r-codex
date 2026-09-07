import type { Build } from "@/lib/types";

/**
 * Whirlwind Assassin.
 *
 * THE PAGE IS NAMED AFTER A SKILL IT SPENDS NO POINTS IN
 * -----------------------------------------------------
 * `Whirlwind` is `charclass = bar`. The Assassin reaches it exactly one way:
 * **Chaos** (`Fal Ohm Um`, `itype1 = "h2h"` — claws only) grants
 * `oskill Whirlwind` at level 1. There is no skill point to spend, no synergy
 * to buy and no maxing order, so the plan's `primarySkill` is **Claw Mastery**
 * — the skill this build actually maxes first, and the one whose applicability
 * to a whirl is the finding the page is built on.
 *
 * `Param1 = 30` and `Param2 = 5` per level, so the skill's own contribution is
 * +30% damage at level 1. `SrcDam = 128` is the full weapon share. The weapon
 * is the build.
 *
 * WHICH `+SKILLS` RAISE IT, AND WHICH DO NOTHING
 * ---------------------------------------------
 * This inverts the shopping list every other Assassin page gives, and the
 * parameter columns settle it:
 *
 *   `item_allskills`        no `Save Param Bits` at all
 *   `item_addclassskills`   `Save Param Bits 3`, tooltip "+# to [Skill]
 *                           ([Class] only)"
 *   `item_addskill_tab`     `Save Param Bits 16`, keyed to a class tab
 *
 * A stat keyed by a class parameter cannot reach a skill of another class. So
 * **"+2 to Assassin Skills" and "+3 to Martial Arts" do nothing for Whirlwind**
 * and "+1 to All Skills" does. They still raise Claw Mastery, Venom and Weapon
 * Block, which is why both kinds are worth buying — for different halves of the
 * character.
 *
 * THE CLAW'S STAT BLOCK IS COMPOSED, AND THE DIFFERENCE IS FIFTY POINTS
 * ---------------------------------------------------------------------
 * `runes.json` gives Chaos's own `dmg%` block as **240–290%**. What the item
 * page publishes, and what this page quotes, is **+290–340%** — because a
 * runeword's displayed block is its own properties *plus* each constituent
 * rune's mod for that item type, and **Ohm** supplies the other fifty in a
 * weapon. The same composition adds **25% Chance of Open Wounds** (Um) and
 * **+10 to Strength** (Fal), neither of which is in the runeword's own block.
 * Fury composes to no change on damage — Jah, Gul and Eth carry no `dmg%` —
 * but gains **Ignore Target's Defense**, **+20% Bonus to Attack Rating** and
 * **−25% Target Defense**, which is why the off-hand choice below is an
 * accuracy decision as much as a damage one.
 *
 * IT IS THE ONE ASSASSIN MELEE BUILD THAT IS NOT A CHARGE-UP BUILD
 * ---------------------------------------------------------------
 * `finishing = 1` appears on six rows in the whole file: `Attack`,
 * `Left Hand Swing`, `Dragon Talon`, `Dragon Claw`, `Dragon Tail` and
 * `Dragon Flight`. Whirlwind carries neither `finishing` nor
 * `prgchargesconsumed`, so **it releases no charge-up**. Tiger Strike, Cobra
 * Strike, Phoenix Strike, Fists of Fire, Claws of Thunder and Blades of Ice are
 * all dead here. Every other melee page on this class is a charge-up page; this
 * one is not, and that is the single most reliable way to get it wrong.
 *
 * WHAT A WHIRL CARRIES, AND WHY IT IS NOT THE KICK LIST
 * ----------------------------------------------------
 * Whirlwind is an ordinary weapon attack in every column that says so:
 * `itypea1 = mele`, `durability = 1`, `SrcDam = 128`, and `weapsel = 2` — which
 * the `Skills.txt` file guide documents as "it can either use the Right or the
 * Left or Both weapons (used by Whirlwind)". So a hit is a swing of a specific
 * claw, and every `damagerelated` stat on that claw is read for it.
 *
 *   Crushing Blow, Open Wounds, Deadly Strike   yes
 *   life and mana leech                          yes
 *   Venom                                        yes
 *   Claw Mastery                                 yes
 *   Weapon Block, at full effectiveness          yes
 *   Increased Attack Speed from any slot         yes, since patch 2.4.3
 *   chance to cast on attack                     no
 *   chance to cast on striking                   NOT ESTABLISHED
 *   martial-arts charge-ups                      no
 *
 * **Deadly Strike and Claw Mastery are the two the kick pages say no to.** A
 * kick is `weapsel = 4` and uses no weapon, so neither reaches it. A whirl
 * swings the claw, so both do. Two pages on the same class, opposite answers,
 * one column apart.
 *
 * ATTACK SPEED: THE 2011 RULE IS DEAD AND BLIZZARD KILLED IT
 * ---------------------------------------------------------
 * The widely repeated claim is "Whirlwind only profits from Increased Attack
 * Speed socketed into the weapon". Patch 2.4.3 retired it in as many words:
 * "Whirlwind now incorporates Increased Attack Speed (IAS) from all equipment.
 * The frames between each Whirlwind attack are equal to the attack frame of a
 * basic attack for that character (modified by increased attack speed). While
 * dual wielding, the attack frame for each weapon will be averaged (rounding
 * up)."
 *
 * So the off-hand claw is not ignored here — it is half the answer. The rule
 * this site publishes on its kick pages, that off-hand attack speed does not
 * count, is correct for an ordinary swing and for the `weapsel = 3` claw
 * finishers, and **must not be carried onto this page**.
 *
 * WHAT IS NOT ESTABLISHED, AND IS NOT PUBLISHED
 * --------------------------------------------
 * - **Whether Chaos's own two procs fire while whirling.** The claw carries 9%
 *   Frozen Orb and 11% Charged Bolt as `hit-skill`, which is `item_skillonhit`
 *   — "on striking". The 2009 reference that is usually quoted says Whirlwind
 *   "triggers none of the six mentioned chances", but its own table excludes
 *   only *on attack*, and three of its six events are level-up, death and kill,
 *   which no attack skill can suppress. Nothing above community tier settles
 *   the striking case. The page values Chaos on its Enhanced Damage and its
 *   magic damage, which are not in doubt, and sends anything you want to rely
 *   on to the mercenary.
 * - **A frame table.** The 2.4.3 mechanic is stated; the numbers are published
 *   for the Barbarian only. That matrix reproduces exactly from a floor-rounded
 *   formula with a per-weapon-class constant, and the constant for a claw is
 *   not derivable — the Assassin's claw attack runs at animation speed 208,
 *   which no Barbarian row uses. No table rather than a guessed one.
 */
export const whirlwindAssassin: Build = {
  slug: "whirlwind-assassin",
  name: "Whirlwind Assassin",
  classSlug: "assassin",
  summary:
    "The Assassin borrows the Barbarian's spin from a claw runeword, at skill level one, and spends every point of her own on the things a weapon cannot buy. The only melee Assassin that is not a charge-up build.",
  damageTypes: ["physical", "magic", "poison"],
  primarySkill: "claw-mastery",
  playstyle:
    "You hold the button and cross the pack. There is no rotation, no charge to build and no finisher to release — Whirlwind carries no `finishing` flag, so the entire martial arts tree is inert and the thing you press is the only thing you press. What you actually manage is where the whirl starts and where it ends, because since patch 2.4.3 it travels to where the target was rather than following it, and you can start a new one the instant the last ends. Venom goes up before the pack and Fade or Burst of Speed stays up all the time. The character underneath is doing the work the claw cannot: Claw Mastery is +220% attack rating and +111% Enhanced Damage on every hit, Weapon Block is a block chance climbing toward 65% that keeps working at full effectiveness while you spin, and Venom is the damage a physical immune cannot stop.",
  strengths: [
    "**Two weapons, both read.** Since 2.4.3 dual wielding averages each claw's attack frame instead of ignoring the off-hand, and every attack picks two targets — so the second claw is half the build rather than a `+skills` stick",
    "**Claw Mastery is finally worth twenty points**: +220% attack rating, +111% Enhanced Damage and a critical-hit chance climbing toward `Param6 = 25`. It is one point on every other page of this class and nothing at all on the two kick pages",
    "**Deadly Strike works here.** Highlord's Wrath and Gore Rider are bought for the reason they are usually bought, which is not true of either kicker",
    "**Weapon Block is a named exception in the block rules** — whirling blocks at full effectiveness where running is cut to a third",
    "Chaos's 216–471 magic damage is not physical, so the physical immunes that close the Dragon Tail entirely do not close this",
    "Increased Attack Speed from any slot counts, which makes gloves, helm and jewels live again",
    "No mana problem: `AttackNoMana = 1`, so the cost is paid to start the spin rather than per hit",
  ],
  weaknesses: [
    "**The button does not exist until Chaos does.** Ohm is level 57 and the runeword is claw-only. There is no starter version of this build and no levelling with it",
    "**+2 to Assassin Skills and +3 to Martial Arts do nothing for the damage skill.** Only +All Skills reaches an oskill, which deletes most of the affixes the rest of the class shops for",
    "**No charge-ups.** Whirlwind carries no `finishing` flag, so the largest multipliers in the Martial Arts tree are unavailable — this build has no Tiger Strike",
    "Weak on a single target: the skill's own bonus is +30% at level 1, there is no multiplier to stack, and dual wielding spends its two picks on two targets",
    "**Whether Chaos's own Frozen Orb and Charged Bolt procs fire while whirling is not established**, so the two lines that look best on the item are the two you cannot count on",
    "No published frame table exists for a claw, so attack-speed planning is directional rather than exact",
    "An Assassin has no mastery, no Battle Orders and no Berserk — a Barbarian doing the same thing is doing it better",
  ],
  difficulty: "advanced",
  budget: "high",
  ratings: {
    clearSpeed: 4,
    bossing: 2,
    survivability: 4,
    magicFind: 2,
    terrorZones: 4,
    ubers: 1,
    soloSelfFound: 2,
    players8: 3,
  },

  skills: [
    {
      skill: "claw-mastery",
      points: 20,
      role: "main",
      order: 1,
      note: "**The build's own damage, and the finding the page rests on.** `ln12` is +30% attack rating baseline and +10% per level; `ln34` is +35% Enhanced Damage baseline and +4% per level; `dm56` is a critical-hit chance climbing toward `Param6 = 25`. Twenty points is +220% attack rating and +111% Enhanced Damage on every whirl hit. It is `itypea1 = h2h` and a whirl is a claw melee attack, so unlike on a kick it applies in full.",
    },
    {
      skill: "venom",
      points: 20,
      role: "main",
      order: 2,
      note: "**The damage a physical immune does not stop.** It writes `poisonmindam` and `poisonmaxdam` on the character through `aurastate = venomclaws` rather than on a weapon, so it is not restricted to one claw and rides every hit from both. Its length is pinned at ten frames and overrides rather than stacks, which suits an attack that hits very often.",
    },
    {
      skill: "weapon-block",
      points: 20,
      role: "main",
      order: 3,
      note: "**Up to 65% block, and it keeps working while you spin.** `Param2 = 65` is the ceiling, and it is the skill's own rather than a shield's 75. It needs `itypea1 = h2h` and `itypeb1 = h2h` — a claw in each hand, which this build has because both hands are the weapon. Whirlwind is named as a full-effectiveness state in the block rules where running is cut to a third.",
    },
    { skill: "burst-of-speed", points: 1, role: "prerequisite", note: "Fade's prerequisite, and Claw Mastery is its own — already paid. One point unless you take the speed package, which is where the case for twenty is made and where 2.4.3 changed the answer." },
    { skill: "fade", points: 1, role: "prerequisite", note: "Venom's prerequisite. One point unless you take a package that raises it. It and Burst of Speed overwrite each other, so the two can never both be up." },
    { skill: "psychic-hammer", points: 1, role: "prerequisite", note: "Cloak of Shadows' prerequisite, and it also feeds Mind Blast's conversion chance through `skill('Psychic Hammer'.blvl)`." },
    { skill: "cloak-of-shadows", points: 1, role: "utility", note: "Blinds the pack and cuts its defence by `Param5 = 15` baseline and `Param6 = 3` per level. On a build that rolls to hit many times a second, a defence reduction is an attack stat." },
    { skill: "shadow-warrior", points: 1, role: "prerequisite", note: "Shadow Master's prerequisite, and replaced by it — they share a `pettype` with room for one." },
    { skill: "shadow-master", points: 1, role: "utility", note: "One point is one shadow, and a body between you and the pack is worth more here than on a ranged page. Nineteen more is a package." },
    { skill: "mind-blast", points: 1, role: "utility", note: "`Param1 = 50` stun baseline and `Param2 = 5` per level, plus a conversion chance. The only skill on this page Faster Cast Rate touches." },
  ],

  skillPackages: [
    {
      id: "whirlwind-43",
      name: "The last forty-three points",
      choose: "one",
      intro:
        "The core is 67 of 110 and it is closed in an unusual way: **the damage skill takes no points at all**, Claw Mastery, Venom and Weapon Block are each at twenty, and nothing in the graph feeds any of them. So the remaining forty-three do not buy damage — they buy the shape of the character around a button that is already as good as it gets. **Take exactly one.** Each costs exactly forty-three and closes at 110. The first two are opposed by mechanism as well as by budget: Fade and Burst of Speed write the same kind of self-state and casting one drops the other.",
      packages: [
        {
          id: "stand",
          name: "Fade and Blade Shield — stand in it",
          when: "**Take this for Hell and for Hardcore.** The whirl parks you inside the pack, so make the inside safe and make it hurt. Fade takes elemental resistance toward `Param2 = 75`, adds physical damage reduction at `Param7/8 = 1` baseline and per level, and cuts curse length toward 90% — which is the Iron Maiden answer, and Iron Maiden is worse for this build than for any other on the class because reflection is per hit and this attack is nothing but hits.",
          tradeoff: "You give up Burst of Speed, and with it the largest attack-speed source on the class. The spin gets slower and the character stops dying.",
          skills: [
            { skill: "fade", points: 20, role: "utility", note: "Resistances, physical damage reduction, and the curse-length line. It excludes Burst of Speed, which is the whole trade." },
            { skill: "fire-blast", points: 1, role: "prerequisite", note: "The first link of the Traps chain. It is here to be walked through, not pressed." },
            { skill: "blade-sentinel", points: 1, role: "prerequisite", note: "The second link, and one of Blade Fury's two prerequisites." },
            { skill: "wake-of-fire", points: 1, role: "prerequisite", note: "Blade Fury's other prerequisite." },
            { skill: "blade-fury", points: 1, role: "prerequisite", note: "Blade Shield's prerequisite. One point, and it is a perfectly good ranged answer on the rare pack you would rather not walk into." },
            { skill: "blade-shield", points: 20, role: "utility", note: "`SrcDam = 96`: **three quarters of the same weapon damage the whirl uses**, applied to everything within `Param4 = 6` every `Param3 = 25` frames, for as long as it is up. It is the only way this build damages something without pointing at it, and it runs while you spin." },
          ],
          gearNote: "Resistances arrive from Fade, so rings and charms become attack rating and life. Blade Shield reads the same claw damage the whirl does, so it is a second reason to buy the biggest Enhanced Damage roll you can find.",
          contentNote: "The Chaos Sanctuary, the Worldstone Keep, Hardcore, and anywhere Iron Maiden is on the curse list.",
          remainderNote: "None. Forty-three points, and the plan closes at 110.",
        },
        {
          id: "speed",
          name: "Burst of Speed and Cloak of Shadows — spin faster",
          when: "**Take this for clearing, and note that 2.4.3 is why it is a real choice.** Before that patch Whirlwind read attack speed only from the weapon; it now takes it from all equipment, and Burst of Speed's `Param3/4 = 15 → 60` is skill-sourced and undiminished — the largest single speed number available to this class. Cloak of Shadows is what turns extra swings into extra landed swings.",
          tradeoff: "You give up Fade, and therefore the resistances, the physical damage reduction and the curse-length reduction. In the Chaos Sanctuary that is the wrong trade.",
          skills: [
            { skill: "burst-of-speed", points: 20, role: "utility", note: "**Up to 60% attack speed, undiminished, plus run speed.** It does not go through the item formula's diminishing returns, and since 2.4.3 the whirl reads it." },
            { skill: "cloak-of-shadows", points: 20, role: "utility", note: "A long blind and a defence reduction that reaches `Param5 + 19 × Param6` on everything in the radius. More hits are only more damage if they land." },
            { skill: "mind-blast", points: 6, role: "utility", note: "The last five points. `Param1 = 50` baseline and `Param2 = 5` per level, so six is 75 frames of stun rather than 55 — three seconds rather than a little over two, on the button that buys a melee character the room to start the next whirl." },
          ],
          gearNote: "Increased Attack Speed on either claw counts and so does Increased Attack Speed anywhere else, which is the opposite of what the kick pages say. Cannot Be Frozen matters: being chilled slows the same animation.",
          rotationNote: "Cloak first, then whirl. The blind lands before the first hit rather than after it.",
          contentNote: "Terror Zones, the Cow Level, Travincal, and anywhere the problem is a room rather than a monster.",
          remainderNote: "None. Forty-three points exactly.",
        },
        {
          id: "shadow",
          name: "Fade and Shadow Master — put something else in front",
          when: "**Take this if the problem is being the only target.** A twenty-point shadow carries resistances toward `Param4 = 90`, has life scaling at `Param1 = 15` per level and uses your skills, and it is the closest thing this class has to the Battle Orders it does not get. Fade is here as well because a melee character whose plan is 'be somewhere else' still has to survive the moments when it is not.",
          tradeoff: "You give up Burst of Speed and Blade Shield both — no undiminished attack speed, and no damage you did not aim.",
          skills: [
            { skill: "fade", points: 20, role: "utility", note: "Resistances, physical damage reduction and the curse-length line." },
            { skill: "shadow-master", points: 20, role: "utility", note: "It replaces Shadow Warrior rather than joining it — one `pettype` slot between them. What it buys is a second body in a pack that would otherwise be entirely yours." },
            { skill: "mind-blast", points: 6, role: "utility", note: "The last five points, into stun length and a higher conversion chance. Converted monsters are more bodies, which is the same plan as the shadow." },
          ],
          gearNote: "Faster Cast Rate finally does something — for Mind Blast, and for nothing you attack with.",
          contentNote: "Players-8 games, dense Terror Zones, and the whole of Hell before the second claw is finished.",
          remainderNote: "None. Forty-three points exactly.",
        },
      ],
    },
  ],

  flexPoints: [
    "There are none. Sixty-seven in the core, forty-three in exactly one package, and 110 is the total.",
    "**Do not spend them on Tiger Strike or any other charge-up.** Whirlwind carries no `finishing` flag, so a charge stood up in front of a whirl is never released. This is the most expensive mistake available on this page.",
    "**Do not spend them on Whirlwind.** There is nothing to spend: it is an oskill from an item and the skill screen has no entry for it.",
  ],

  stats: {
    strength: "**Whatever the claws ask, and they ask a lot.** Runic Talons want 115 and Feral Claws 113, and you need two. This is the largest strength requirement on any Assassin page and it is the reason the elite bases arrive late.",
    dexterity: "**The same number again, and that is the trap.** Claws are the only weapon family that asks for as much dexterity as strength — Runic Talons want 115 of each. Attack rating is not the reason to buy it; Claw Mastery's +220% covers that. The base requirement is.",
    vitality: "Everything left, which will not be as much as you want.",
    energy: "None. `AttackNoMana = 1` means the whirl costs mana to start rather than per hit.",
    notes: [
      "**Two elite claws is roughly 230 points of requirements split across two stats.** Plan the base you are ending on before you spend anything: Greater Talons ask 79/79 and Runic Talons 115/115 for the same −30 speed.",
      "A Chaos claw's own level requirement is 57, from Ohm. Nothing about this build happens before that.",
      "If you take the Fade package the resistance slots free up, and those points go to vitality rather than to more attack rating.",
    ],
  },

  breakpoints: [
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "required",
      why: "**Required.** A whirl that is interrupted is a whirl that has to be started again, and you can only start a new one once the last has ended.",
    },
    {
      stat: "fbr",
      value: 86,
      frames: 3,
      priority: "recommended",
      why: "Weapon Block is twenty core points and blocks at full effectiveness while spinning, so the recovery is what decides whether the block was worth having.",
    },
    {
      stat: "fcr",
      value: 65,
      frames: 11,
      priority: "luxury",
      why: "**For Mind Blast and the buffs only.** Cast rate shortens the Assassin's `SC` animation from 16 frames to 11 and touches nothing you attack with.",
    },
  ],
  breakpointNotes:
    "**There is no Increased Attack Speed row, and for a different reason than on the rest of this class.** Patch 2.4.3 rewrote how the whirl's cadence is computed and said so plainly: \"Whirlwind now incorporates Increased Attack Speed (IAS) from all equipment. The frames between each Whirlwind attack are equal to the attack frame of a basic attack for that character (modified by increased attack speed). While dual wielding, the attack frame for each weapon will be averaged (rounding up).\" Three consequences, and all three contradict advice that is still repeated everywhere. **Increased Attack Speed on gloves, helm and jewels counts**, where the widely quoted 2011 rule says only the weapon does. **The off-hand claw is not ignored** — its own attack frame is half of the average, so its base speed and its own affix both matter, which is the reverse of the rule this site publishes on its kick pages. And **slower claws gained the most**, because the patch note ends \"slower weapons will attack notably faster\". What is not published here is a table. The only independently published D2R matrix covers the Barbarian, it reproduces exactly from a floor-rounded formula with a per-weapon-class constant, and that constant is not derivable for a claw: the Assassin's claw attack is 11 frames at animation speed 208, an animation speed no Barbarian row uses. Buy the fastest claw bases you can wear — Runic Talons and Greater Talons are −30 and Hatchet Hands and Fascia are +10, a forty-point spread before a single affix — take Increased Attack Speed wherever it is free, and use an attack-speed calculator for a specific pair.",

  gearSets: [
    {
      tier: "starter",
      goal: "You are not this build yet and cannot be. Level an Assassin, put the first points where this plan wants them, and kill with an ordinary swing — which Claw Mastery raises in full.",
      levelRange: [1, 30],
      nextUpgrade: "Any three-socket claw you can hold on to, and Venom at level 30.",
      slots: [
        { slot: "weapon", picks: [{ label: "Any claw, and hoard the three-socket bases", why: "**Chaos needs three sockets and claws only.** Of the claw bases, Blade Talons, Claws and Scissors Katar take three at normal quality and Katar, Cestus, Wrist Blade, Fascia and Hatchet Hands do not. Nothing you find now will be the one, but the habit of checking is the whole gear plan later.", lookFor: ["Three sockets", "+skills", "Increased Attack Speed"] }] },
        { slot: "offhand", picks: [{ label: "A second claw", why: "Weapon Block needs `itypea1 = h2h` and `itypeb1 = h2h` — a claw in each hand — from level 12, and this build never puts anything else in either slot." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Two runes, and Faster Hit Recovery is the stat this build is marked required on." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills, which is the kind of `+skills` that will still be working when Whirlwind arrives." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Attack rating and magic find, from level 7." }] },
        { slot: "belt", picks: [{ label: "The largest belt you can wear", why: "Potions. There is no leech in the plan until a weapon provides it." }] },
      ],
    },
    {
      tier: "nightmare",
      goal: "Finish the core. Claw Mastery, Venom from level 30 and Weapon Block are the whole character, and none of them needs the runeword.",
      levelRange: [30, 55],
      nextUpgrade: "Ohm, and an exceptional claw worth putting it in.",
      slots: [
        { slot: "weapon", picks: [{ label: "A three-socket exceptional claw, held empty", why: "**Greater Talons (−30 base speed), Greater Claws (−20), Quhab and Scissors Quhab (0) all take three sockets**; Hand Scythe takes two and cannot ever hold Chaos. Greater Talons ask 79 strength and 79 dexterity, which is the number to plan toward. Ethereal is fine — a runeword claw is not repaired, and the extra damage is free.", lookFor: ["Three sockets", "Superior quality", "Ethereal"] }] },
        { slot: "offhand", picks: [{ label: "A second claw with +Shadow Disciplines", why: "Both claws' `+skills` are read, and Shadow Disciplines is the tree this build maxes three skills in." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "45% Increased Attack Speed, which — unlike on the kick pages — counts in full once Whirlwind arrives, plus a chance to cast Fade when struck." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Life leech and damage reduction from level 41. Leech is `damagerelated`, and a helm is not a weapon, so it applies to every hit rather than to one claw's." }] },
        { slot: "gloves", picks: [{ label: "Rare gloves with 20% Increased Attack Speed", why: "Since 2.4.3 this counts. It did not before, and most guides still say it does not." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life leech, on a character standing in the middle of everything." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "**Crushing Blow, Open Wounds and Deadly Strike, and here all three work.** The kick pages buy this for two of the three; a whirl swings the claw, so Deadly Strike is live." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating. Being chilled slows the whirl's animation like any other." }] },
      ],
    },
    {
      tier: "early-hell",
      goal: "**Chaos.** Ohm is level 57, so this is the earliest tier the build can exist in at all. One claw is enough to start.",
      levelRange: [55, 70],
      nextUpgrade: "A second runeword claw, and the strength for an elite base.",
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "chaos" }, why: "**The build.** `oskill Whirlwind` at level 1, +290–340% Enhanced Damage, 216–471 magic damage, 35% Increased Attack Speed and two on-striking procs. `itype1 = \"h2h\"` makes it claw-only, and Ohm sets the level requirement at 57. Build it in the fastest three-socket base you can wear — Greater Talons at −30 if the elite bases are still out of reach, and superior quality for the extra Enhanced Damage under the runeword's own.", lookFor: ["Three-socket claw", "The fastest base you can wear", "Superior quality"] }] },
        { slot: "offhand", picks: [{ label: "A claw with +Shadow Disciplines and Increased Attack Speed", why: "Its attack frame is averaged with the first one's, so its base speed and its own Increased Attack Speed both count. That is specific to Whirlwind and specific to 2.4.3." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "duress" }, why: "15% Crushing Blow, Enhanced Damage and Faster Hit Recovery for three mid runes.", alternatives: [{ ref: { kind: "runeword", slug: "smoke" }, why: "+50 to all resistances if the Hell penalty is the immediate problem." }] }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Leech and damage reduction, socketed for resistances.", sockets: "Two — Um and Um, or attack-speed jewels." }] },
        { slot: "gloves", picks: [{ label: "Crafted blood gloves with Increased Attack Speed", why: "Life, leech and speed. Every one of the three now reaches the whirl." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and leech." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Open Wounds and Deadly Strike, all three of which a whirl reads." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, and 150–250 attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "**+1 to All Skills, which is the kind that reaches Whirlwind.** A rare ring with +2 Assassin skills would not exist, and if it did it would not help the spin." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 to All Skills, 20% Increased Attack Speed and Deadly Strike that scales with your level — and on this page all three lines do something." }] },
      ],
    },
    {
      tier: "budget",
      goal: "The second claw, and the choice that defines the character: another Chaos, or Fury.",
      levelRange: [70, 85],
      nextUpgrade: "Elite claw bases, and the strength and dexterity to hold two of them.",
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "chaos" }, why: "Enhanced Damage and the magic damage are read from the claw that made the hit, so the base under the runeword is the number that moves." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "fury" }, why: "`itype1 = \"mele\"`, and `itemtypes.json` gives `h2h` the parent `mele` — **so a claw takes it.** 66% Open Wounds, 33% Deadly Strike, 6% life steal, and **Ignore Target's Defense** on top of a +20% attack rating bonus. Every one of those is `damagerelated`, so they apply to the hits *this* claw makes — which on an attack that uses either hand or both is about half of them, and it is why the other half still needs Claw Mastery's attack rating. Jah is level 65.", lookFor: ["Three-socket claw", "The fastest base you can wear"], alternatives: [{ ref: { kind: "runeword", slug: "chaos" }, why: "A second Chaos instead: it puts the 216–471 magic damage on every hit rather than half of them, and its Enhanced Damage is a hundred points higher. Fury answers the other problem — leech, Ignore Target's Defense, and 66% Open Wounds against Chaos's 25%. Damage against sustain, and the mechanism is the same either way." }] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "300% Enhanced Damage, and Enhanced Damage from armour is not weapon-restricted — it reaches both claws' hits.", alternatives: [{ ref: { kind: "runeword", slug: "duress" }, why: "Crushing Blow and hit recovery if the runes are not there yet." }] }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Leech and damage reduction, still the cheapest answer in the slot.", sockets: "Two — Um and Um." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "**For the 7–10% life steal and the 25% Open Wounds, not for the Life Tap.** The Life Tap is `hit-skill` — chance to cast on striking — which is the one thing on this page that is not established to fire while whirling. The two lines above it are, and they are enough." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and leech." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Open Wounds and Deadly Strike." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to All Skills." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 to All Skills, attack speed and Deadly Strike." }] },
      ],
      charms: [{ label: "Annihilus, grand charms with +1 Shadow Disciplines, and a Bone Break sunder charm", why: "**Annihilus is +1 to All Skills and therefore the only charm in the game that raises the whirl.** The grand charms raise Claw Mastery, Venom and Weapon Block instead, which is where the character's own numbers live. Bone Break opens the physical immunes — though this build already answers them twice, with magic damage and with poison." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, at level 57. The Assassin has no life skill of her own and this is a melee character." }],
    },
    {
      tier: "optimized",
      goal: "Elite bases under both runewords, and the strength and dexterity to wear them.",
      levelRange: [85, 95],
      nextUpgrade: "The last few points of Enhanced Damage, and a helm that does not cost resistance.",
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "chaos" }, why: "**In Runic Talons or Feral Claws: −30 and −20 base speed, three sockets each, 115/115 and 113/113 requirements.** The base speed is worth more than the affix and the requirement is the price." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "fury" }, why: "In Runic Talons, and a second Chaos is the alternative. Both claws' attack frames are averaged, so a slow off-hand claw slows the whole spin — which is the part of 2.4.3 most gear advice has not caught up with.", alternatives: [{ ref: { kind: "runeword", slug: "chaos" }, why: "The damage answer rather than the sustain one, and the same base advice applies to it." }] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "300% Enhanced Damage on a character whose damage is all weapon.", alternatives: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 to All Skills and +65 to all resistances — the +2 reaches Whirlwind, which almost nothing else does." }] }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "+2 to Assassin Skills, 20% Increased Attack Speed and 8–10% life steal. The +2 does nothing for Whirlwind and a great deal for Claw Mastery, Venom and Weapon Block — this is the clearest item on the page for that split.", sockets: "One — Um, or a ruby for the −30% fire resistance." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life steal and Open Wounds. The Life Tap is a bonus you cannot plan around." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to All Skills, which on this page is a damage line for the whirl as well as for everything else." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Open Wounds, Deadly Strike." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to All Skills." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 to All Skills and +30 to all resistances. The only amulet that raises both halves of this character at once.", alternatives: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "If the attack speed and the Deadly Strike are worth more than the resistances." }] }] },
      ],
      charms: [{ label: "Annihilus, Hellfire Torch, +1 Shadow Disciplines grand charms, Bone Break", why: "**Annihilus raises the whirl and the Torch does not** — the Torch's +3 is class-scoped, and Whirlwind is not an Assassin skill. It is still worth wearing for Claw Mastery, Venom and Weapon Block." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
    },
    {
      tier: "bis",
      goal: "The ceiling: two elite runeword claws, every point of +All Skills the game offers, and enough block and damage reduction to stay inside the pack.",
      levelRange: [95, 99],
      nextUpgrade: "Nothing.",
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "chaos" }, why: "In superior Runic Talons: −30 base speed, and the largest Enhanced Damage roll the base can carry under the runeword's own +290–340%." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "chaos" }, why: "**A second one, and two Chaos claws put 216–471 magic damage on every hit rather than half of them** — magic damage is the one type this site's own census records as a common immunity in a single area. Fury stays the answer if leech and Ignore Target's Defense are worth more to you than the magic damage.", alternatives: [{ ref: { kind: "runeword", slug: "fury" }, why: "The sustain half: 6% life steal, 66% Open Wounds and Ignore Target's Defense, all read from the hits this claw makes." }] }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 to All Skills, +65 to all resistances and 8% damage reduction. The +2 is worth +10% whirl damage and 10% attack rating on top of everything else." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "crown-of-ages" }, why: "Damage reduction, resistances and two sockets without Andariel's fire penalty, on a character who is always surrounded.", sockets: "Two — Um and Um, or 15% Increased Attack Speed jewels." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life steal and Open Wounds." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 to All Skills." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Open Wounds and Deadly Strike, all three live." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to All Skills." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 to All Skills and resistances." }] },
      ],
      charms: [{ label: "Annihilus, Hellfire Torch, +1 Shadow Disciplines grand charms, Bone Break", why: "Every +1 to All Skills is +5% whirl damage and +5% attack rating; every +1 to Shadow Disciplines is Claw Mastery, Venom and Weapon Block." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." }],
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**A Might mercenary, and he is also where every proc you want to rely on goes.** Might raises physical damage and this build's largest number is physical, so the aura is the straightforward pick. The less obvious half is the interesting one: because whether a chance-to-cast-on-striking effect fires during Whirlwind is not established, anything you actually want to happen — a Decrepify to break physical immunity, an Amplify Damage, a Life Tap — belongs on the mercenary's weapon rather than on yours. A Reaper's Toll on an Act 2 mercenary is the standard answer and it is standard for exactly this reason: he swings normally, so his procs are not in question. **Insight** is the alternative if you want the mana rather than the damage, though a skill that pays its cost on activation rather than per hit rarely needs it.",

  farming: [
    {
      area: "travincal",
      difficulty: "hell",
      why: "**The best run on the page.** Fire and lightning are the common immunities and physical is not, so the whirl lands in full — and the Council stand close enough together that an attack which picks two targets per swing is picking two of the three you came for. Short, repeatable, and it drops the high runes the second claw needs.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Poison and cold are the common immunities, so Venom is dead weight and everything else lands. The density is what a moving multi-hit attack is for, and there is nothing here that punishes standing in the middle.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Cold and poison, one fixed superunique and a short corridor. Venom does nothing and the claws do everything, which is a clean demonstration that the poison is an answer to a specific problem rather than the build's damage.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "**Area level 85, and the immunity story here is what separates this page from the kick pages.** Physical is one of the common immunities, and where the Dragon Tail loses both halves of its damage to that, this build keeps two — Chaos's magic damage is not physical and Venom's poison is not either. Slower on those packs, not stopped by them.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Physical is the listed immunity and the density is exactly what the spin wants. Bring a Bone Break charm if you have one; without it the magic damage and the poison carry the immune packs at a slower pace.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "lower-kurast",
      difficulty: "hell",
      why: "Fire and poison are the common immunities and the chests are the point rather than the monsters, which suits an attack that crosses a screen and keeps going.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "countess",
      difficulty: "hell",
      why: "Fire is the common immunity, the tower packs are tight, and the runes are the reason to come — this build spends more of them than any other page on the class.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "mephisto",
      difficulty: "hell",
      why: "Fire and lightning, so nothing here resists what you do. He is a single target, which is the shape this build is worst at — the skill's own bonus is +30% and there is no charge-up to stack on top of it — but the drops are worth a slow fight.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "**The one place on this list to be careful.** Fire, lightning and physical are all common immunities here, and the room is the home of Iron Maiden — which is worse for this build than for any other on the class, because reflection is charged per hit and this attack is made of nothing but hits. Take the Fade package before you come, for its curse-length line rather than its resistances.",
      minTier: "optimized",
      rating: 2,
    },
  ],

  immunityPlan:
    "**This build answers physical immunity twice, and that is the argument for it over the two kick pages.** The whirl's own damage is the claw's, so a physical immune takes almost none of it — but two of the three things this character deals are not physical. **Chaos's 216–471 magic damage** is a separate damage type with a separate resistance, and this site's own census lists magic among the common immunities in exactly one of its twenty areas. **Venom** is twenty core points of poison that rides every hit from both claws, because it writes its stats on the character rather than on a weapon. So a physical-immune pack is a slower fight rather than a wall, which is the opposite of the Dragon Tail — there the second damage type is computed *from* the physical, so a physical immune closes both halves at once. Where the whirl does hit a wall is the same place every physical build does: **a Bone Break sunder charm** puts a physical immune at 95% physical resistance and restores the largest of the three numbers. It is worth having and it is not required, which is a sentence very few melee pages on this site can write. Two caveats. **Crushing Blow is physical**, so it does nothing at all through a physical immunity, and it is the most commonly over-sold line on melee gear. And **Venom is dead in the Mausoleum, at Pindleskin and against Andariel**, all of which list poison — the poison is an answer to a specific problem, not a floor.",

  hardcoreNotes:
    "**Take the Fade package, and read the curse line before the resistances.** Iron Maiden is the specific danger on this page and it is a worse one here than anywhere else on the class: reflected damage is charged per hit, and this attack makes more hits per second than any other Assassin attack. Fade's curse-length reduction reaches toward `Param4 = 90`, which is the difference between a curse you whirl out of and one that kills you mid-spin. Beyond that the build is unusually solid for a melee Hardcore character: **Weapon Block blocks at full effectiveness while whirling** — it is named as an exception in the block rules where running is cut to a third of its value — so a character with two claws blocks at the same rate for the whole fight rather than losing it the moment they move. Faster Hit Recovery is marked required because an interrupted whirl has to be restarted, and Cannot Be Frozen matters because a chilled animation is a slow one. The two rooms to avoid are the Chaos Sanctuary, for the curse, and any pack that is both physical immune and dangerous, because the fight there is long.",

  selfFoundNotes:
    "**Honestly: this is the least self-found-friendly page on the class.** The build does not exist until you own an **Ohm**, and it does not become itself until you own a second three-socket claw worth putting runes in — a **Jah** if the answer is Fury, another Ohm if it is a second Chaos. Nothing else on the page is hard: Gore Rider, Vampire Gaze, String of Ears and Raven Frost are all common, the body armour is a mid runeword, and the entire skill plan is points rather than drops. But the two claws are the build, and there is no substitute item and no cheaper version of the button. **The honest advice is to level as a Kicksin**, which needs a boot rather than a rune, farm Travincal and Terror Zones for the runes with that character, and respec the moment the first Chaos is finished. Claw Mastery, Venom and Weapon Block are all useful on the way, which softens the respec — the twenty points in Dragon Talon are the only ones you lose. **Nothing here varies by mode.** Chaos is `*Patch Release: 110` and Fury `109`, and `runes.json` gives neither of them a `firstLadderSeason`, a `lastLadderSeason` or the `disallowCraftingInLadder` flag that exactly one row in the file carries — so the three modes this site distinguishes would read the same word three times, and the page says that once rather than printing a table of it.",

  levelingPath: {
    summary:
      "**There is no levelling with Whirlwind, because there is no Whirlwind until level 57 at the earliest.** Level as a Kicksin: the damage is a boot, it works from level 1, and it shares Claw Mastery's claws, Venom, Fade and the whole Shadow suite with this plan. Keep the three-socket claws you find. When the first Chaos is finished, respec, move twenty points out of Dragon Talon and into Claw Mastery, and the character you have been playing becomes this one with the same gear in eight of ten slots.",
    respecAt:
      "The moment Chaos is finished. Before that there is nothing to respec into.",
    viaBuild: "kicksin",
  },

  confidence: "verified",
  complete: true,
};
