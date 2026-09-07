import type { Build } from "@/lib/types";

/**
 * The Frenzy Barbarian.
 *
 * THE COLUMN THIS PAGE RESTS ON
 * -----------------------------
 * `itypea1 = mele` **and** `itypeb1 = mele`, with `weapsel = 3`. Frenzy is one
 * of five skills in the game that declare an off-hand item requirement — the
 * other four are Double Swing, Double Throw and the Assassin's Dragon Claw and
 * Weapon Block. **Not the same set as `weapsel = 3`**, which has seven rows: the
 * Assassin's Fists of Fire, Claws of Thunder and Blades of Ice swing both
 * weapons without requiring a second one. Counted rather than inferred, because
 * an earlier draft of this comment said seven by conflating the two columns. And
 * the
 * game's own description closes it: "requires you to equip two weapons". There
 * is no one-handed Frenzy and no shield variant — which is why this page has no
 * Faster Block Rate row where the Whirlwind page has one.
 *
 * THE TWO PACKAGES COST THE SAME EIGHTEEN
 * ---------------------------------------
 * Frenzy's damage is `ln12 + (Double Swing + Taunt) * par8`, par8 = 8. Double
 * Swing is in the core because it is also the prerequisite chain; Taunt is not,
 * and eighteen points there is +144% damage.
 *
 * Against that sits Berserk, which is not a synergy at all. Frenzy's `calc4` is
 * `skill('Berserk'.blvl)` under a column the game calls "% Damage Dealt as
 * Elemental", with `EType = mag`: **1% of Frenzy's damage is converted to magic
 * per hard point of Berserk**, and nineteen points is 19%. The graph correctly
 * draws no edge for it, because the parameter is not labelled a synergy.
 *
 * So the choice is 144% more physical damage, or the ability to hurt a physical
 * immune at all. Both cost 18 and only one is affordable, which is the whole
 * argument of the page.
 *
 * THE THIRD RELATIONSHIP, ALSO NOT A SYNERGY
 * ------------------------------------------
 * `auralencalc = par7 + skill('Increased Stamina'.blvl) * 10`. Frenzy's buff
 * lasts 150 frames — six seconds — and gains **10 frames per hard point of
 * Increased Stamina**. The coefficient is a bare literal rather than a `parN`,
 * so `synergiesFor` drops the reference and no edge exists. It is in the core at
 * one point because twenty there would cost the whole of a package to buy
 * fourteen seconds of a buff you refresh by hitting things anyway.
 *
 * WHY FURY IS ON THIS PAGE AND NOT ONLY IN ITS TIER
 * ------------------------------------------------
 * `+5 to Frenzy (Barbarian only)` is a dead line on every other page on this
 * site and the largest single skill bonus available to this one. It is the only
 * class-scoped stat in the catalogue that lands on the build it names.
 */
export const frenzyBarbarian: Build = {
  slug: "frenzy-barbarian",
  name: "Frenzy Barbarian",
  classSlug: "barbarian",
  summary:
    "Two weapons, and every hit makes the next one faster. The quickest melee character in the game, and the Barbarian who kills Ubers.",
  damageTypes: ["physical", "magic"],
  primarySkill: "frenzy",
  playstyle:
    "You start slow and end fast, and the fight is over before you notice the change. Each landed Frenzy stacks run speed toward +200% and attack speed toward +50%, and the stack falls off if you stop hitting things — so the rhythm is to never stop. You open on the nearest trash rather than the dangerous thing, build three or four stacks on it, and arrive at the real target already at full speed. Between packs you keep the stack alive on anything that moves. Berserk sits on the other button for physical immunes, and unlike the Whirlwind Barbarian you do not have to stop and reposition to use it — Frenzy's run speed is what carries you across the map, and it is faster than walking with an Enigma.",
  strengths: [
    "The fastest attack in the game once the stack is up, and the run speed comes with it",
    "Cannot be interrupted, so the stack does not break when something hits you",
    "Two damage synergies at 8% a point each, where most Barbarian attacks have one or none",
    "The class's Uber build: Crushing Blow from several slots on an attack that lands constantly",
    "Fury's +5 to Frenzy is the only class-scoped item stat on this site that lands on the build it names",
  ],
  weaknesses: [
    "**Two weapons are mandatory** — no shield, no block, and no Faster Block Rate row on this page",
    "The stack decays, so the first fight after a town portal is always the slow one",
    "Both hands need attack speed and damage, which is two of everything to find rather than one",
    "Physical damage into a physical immune, and the answer costs the same eighteen points as the second synergy",
    "Attack rating on two weapons at once, against Hell defence values",
  ],
  difficulty: "moderate",
  budget: "high",
  ratings: {
    clearSpeed: 4,
    bossing: 4,
    survivability: 4,
    magicFind: 2,
    terrorZones: 4,
    ubers: 5,
    soloSelfFound: 3,
    players8: 4,
  },
  skills: [
    {
      skill: "frenzy",
      points: 20,
      role: "main",
      order: 1,
      note: "+90% damage at one point and 5% more per level, before either synergy. Each hit stacks run and walk speed from 20% toward 200% and attack speed from 0% toward 50%, both on a diminishing curve, and the buff lasts 6 seconds. **It requires two weapons** — the row carries an off-hand item requirement and the game's own description says so — and it swings both. It cannot be interrupted, and it costs 1.5 mana.",
    },
    {
      skill: "double-swing",
      points: 20,
      role: "synergy",
      order: 2,
      note: "+8% Frenzy damage per hard point, and it is the prerequisite chain as well, so these twenty points are spent twice. Pressed on its own it has no damage of its own at all — its bonus is Bash's level times ten — but as Frenzy's synergy it is the first thing you max after Frenzy.",
    },
    {
      skill: "blade-mastery",
      points: 20,
      role: "main",
      order: 3,
      note: "+28% damage and 5% per level, +40% attack rating and 8% per level, critical strike toward 35%. **Swap it for the mastery your weapons actually are** — and on this build that means *both* of them, so mixing a sword and an axe means one hand is unmastered. Two Griefs in Phase Blades keep it simple.",
    },
    {
      skill: "battle-orders",
      points: 20,
      role: "utility",
      order: 4,
      note: "+92% maximum life at twenty hard points. Not a Frenzy synergy — it is here because after Frenzy, Double Swing and the mastery there is nothing else worth twenty points, and life is what makes the Uber runs survivable.",
    },
    { skill: "bash", points: 1, role: "prerequisite", note: "Double Swing's prerequisite, and the head of the chain this build levels through." },
    { skill: "double-throw", points: 1, role: "prerequisite", note: "Frenzy's only prerequisite. A Frenzy Barbarian passes through the throwing tree without ever throwing anything." },
    { skill: "stun", points: 1, role: "prerequisite", note: "Concentrate's prerequisite, which is Berserk's." },
    { skill: "concentrate", points: 1, role: "prerequisite", note: "Berserk's prerequisite, and the uninterruptible attack that doubles your defence when Berserk's zero defence is unaffordable." },
    {
      skill: "berserk",
      points: 1,
      role: "utility",
      note: "One point in the core and nineteen in its package. **Each hard point also converts 1% of Frenzy's own damage to magic** — Frenzy's row reads Berserk's level directly, under a column the game does not label a synergy, so the skill page draws no edge for it. One point is one percent and an emergency button; nineteen is a real answer to physical immunity.",
    },
    { skill: "howl", points: 1, role: "prerequisite", note: "Shout's prerequisite, and Berserk's synergy at 10% a point if you ever raise it further." },
    { skill: "shout", points: 1, role: "utility", note: "Party defence, and 5 seconds per hard point onto Battle Orders' duration." },
    { skill: "battle-command", points: 1, role: "utility", note: "+1 to all skills, flat at every level. Cast it first — the order is Battle Command, Battle Orders, Shout, then heal." },
    {
      skill: "increased-stamina",
      points: 1,
      role: "prerequisite",
      note: "Increased Speed's prerequisite, and **it extends Frenzy's buff by 10 frames per hard point** — six seconds at one point, past fourteen at twenty. The row scales that with a bare number rather than a synergy parameter, so no edge is drawn. One point is right anyway: you refresh the stack by hitting things, not by waiting.",
    },
    { skill: "increased-speed", points: 1, role: "utility", note: "Always-on run speed underneath Frenzy's own. The curve is steep at the start, so one point is most of what it gives." },
    { skill: "iron-skin", points: 1, role: "prerequisite", note: "Natural Resistance's prerequisite." },
    { skill: "natural-resistance", points: 1, role: "utility", note: "All four resistances, added before the cap, with no buff to keep up." },
  ],
  skillPackages: [
    {
      id: "the-last-eighteen",
      name: "The last eighteen points",
      choose: "one",
      intro:
        "The core is 92 and closes every prerequisite. What is left is exactly eighteen, and the two things worth spending it on cost precisely the same: Frenzy's second damage synergy, or the conversion that lets it hurt a physical immune. This is the page's real decision and no amount of gear resolves it.",
      packages: [
        {
          id: "taunt",
          name: "Taunt — the second synergy",
          when: "You have a physical Sunder Charm, a mercenary with Infinity, or you simply do not run areas where physical immunes appear.",
          tradeoff: "Berserk stays at one point, which means a physical immune is something you walk away from rather than something you kill slowly.",
          skills: [
            { skill: "taunt", points: 18, role: "synergy", note: "+8% Frenzy damage per hard point — +144% at eighteen, on top of the +90% and the +160% Double Swing already gives. It also pulls a single monster out of a pack and cuts its attack rating and damage by 5% and 2% per level, which is a real button on a character with no crowd control." },
          ],
          rotationNote:
            "Unchanged, except that Taunt is now worth pressing: pull the dangerous thing out of the pack, build the stack on the trash around it, then kill it.",
          contentNote: "Ubers, the Worldstone levels, Terror Zones — anywhere the density is high and the immunities are handled by something other than your skill tree.",
          remainderNote: "Nothing is left over. 92 + 18 = 110.",
        },
        {
          id: "berserk",
          name: "Berserk — the immunity answer",
          when: "You solo, you have no Sunder Charm, and you would rather never meet a monster you cannot damage.",
          tradeoff: "Taunt stays at nothing, so Frenzy runs on one synergy instead of two and gives up +144% damage against everything that was never immune.",
          skills: [
            { skill: "berserk", points: 19, role: "main", note: "A second attack whose damage is delivered entirely as magic, so a physical immune takes all of it — and, separately, **19% of Frenzy's own damage becomes magic too**, because Frenzy reads Berserk's hard-point level directly. You are buying both an attack and a conversion, which is why this competes with a 144% damage synergy at all. Your defence is zero while Berserk swings, for about 1.3 seconds at this level." },
          ],
          rotationNote:
            "Frenzy on everything, Berserk held on immunes. Keep the Frenzy stack alive on something else first — Berserk does not build it and you do not want to arrive at the immune pack cold.",
          contentNote: "The Pit, Chaos Sanctuary, Ancient Tunnels, and any solo Hell run without a Sunder Charm in the inventory.",
          remainderNote: "Nothing is left over. 92 + 18 = 110.",
        },
      ],
    },
  ],
  flexPoints: [
    "**There are none.** The core is 92 and either package is exactly 18, so a level-99 sheet reads 110 spent with nothing unassigned.",
    "Below 99 the order is Frenzy, Double Swing, the mastery, Battle Orders, then the package. Berserk's single core point should come early regardless — it is the difference between walking away from an immune pack and killing it slowly.",
    "If you find a Fury before you finish the mastery, re-check which mastery you want: its +5 to Frenzy applies whatever the base is, but the mastery only applies to one weapon family and this build holds two weapons.",
  ],
  stats: {
    strength: "Enough for both weapons and the body armour, and that is genuinely two requirements rather than one — a Grief Phase Blade needs 25 and a Fury in a Berserker Axe needs 138.",
    dexterity: "Enough for both weapons. **Nothing beyond that**: this build cannot hold a shield, so it never blocks, and every point past the requirement is a point of life you did not take.",
    vitality: "Everything else. Four life per point, and Battle Orders nearly doubles it.",
    energy: "None. Frenzy costs 1.5 mana and life steal covers the rest.",
    notes: [
      "**Two weapons means two sets of requirements**, and the off-hand is the one people forget. Work out the heavier of the two before you spend anything.",
      "There is no block on this build at any tier, so Dexterity is a pure requirement stat. That is the single biggest difference between this stat plan and the Whirlwind one.",
      "Life steal matters more here than on any other Barbarian page, because the attack rate is what makes it work — 6% on a Fury is a different number at 4 attacks a second than at 2.",
    ],
  },
  breakpoints: [
    { stat: "fhr", value: 48, frames: 5, why: "Five frames on the table the Barbarian shares with the Paladin and the Assassin. Frenzy itself cannot be interrupted, but the moment between two Frenzies can, and losing the stack is worse than losing the hit.", priority: "required" },
    { stat: "fhr", value: 86, frames: 4, why: "Four frames. Reachable with Arreat's 30% and a Verdungo's 10%, and worth taking on a build that stands still.", priority: "recommended" },
    { stat: "fcr", value: 63, frames: 9, why: "Only with an Enigma. Worth noting that Frenzy's own run speed makes Teleport less essential here than on any other melee build — this is the one Barbarian who is already fast.", priority: "luxury" },
  ],
  breakpointNotes:
    "**No attack-speed row, and no block row.** No attack-speed row because frames depend on the weapon's base speed and the skill, so no single percentage is correct for a class — and on this build it is worse than usual, because patch 2.4.3 established that while dual wielding the attack frame for each weapon is **averaged and rounded up**. Two identical weapons therefore behave differently from a fast weapon paired with a slow one, and the slow one drags. Chase attack speed continuously and prefer matched pairs. No block row because Frenzy requires two weapons: there is no shield at any tier of this build, so Faster Block Rate is not a stat it can have.",
  gearSets: [
    {
      tier: "starter",
      goal: "Two weapons in hand and Frenzy on the bar. Everything else is whatever keeps you alive while the stack teaches you the rhythm.",
      levelRange: [1, 40],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "steel" }, why: "+25% attack speed and 50% Open Wounds for two Countess runes, in any sword, axe or mace. Attack speed is the stat this build converts into everything else.", sockets: "Tir + El in a 2-socket base." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "steel" }, why: "The second one, and it should be the **same base as the first**. The attack frame is averaged between the two hands, so a matched pair beats a better weapon paired with a worse one." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to all skills in any 2-socket helm.", sockets: "Ort + Sol." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Run speed and hit recovery. The run speed is redundant once the stack is up and essential before it is." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "goldwrap" }, why: "10% increased attack speed at level 27, which is the only affordable source of it at this tier." }] },
        { slot: "boots", picks: [{ label: "Any rare or magic boots with Faster Run/Walk and resistances", why: "You are not fast until the stack is up, and the first fight of every run starts cold." }] },
        { slot: "gloves", picks: [{ label: "Rare or magic gloves with 20% Increased Attack Speed", why: "Attack speed is worth more than anything else a glove can roll here, because the stack builds faster and the stack is the build." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Attack rating, which fails before damage does on a low-level melee character." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with attack rating and life", why: "Two weapons means two chances to miss." }] },
        { slot: "amulet", picks: [{ label: "A rare or magic amulet with +2 Barbarian skills", why: "+2 skills beats any stat line at this level." }] },
      ],
      charms: [{ label: "Small charms with life and resistances", why: "Nothing exotic exists yet." }],
      nextUpgrade: "Arreat's Face at 42, and a matched pair of real weapons.",
    },
    {
      tier: "nightmare",
      goal: "A matched pair with real attack speed, Arreat's Face, and enough resistance to enter Hell.",
      levelRange: [40, 65],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "passion" }, why: "Level 43 in any 4-socket weapon: +25% attack speed and +1 to Berserk, which on this build is +1% Frenzy damage converted to magic as well as a better emergency button.", alternatives: [{ ref: { kind: "runeword", slug: "kingslayer" }, why: "Level 53, and its −25% target defence answers this build's attack-rating problem from the weapon slot." }, { ref: { kind: "runeword", slug: "oath" }, why: "Level 49: +210-340% enhanced damage and 50% attack speed — the runeword's own 30% plus Shael's 20%. Its bases are swords, axes and maces, so a matched pair of Oaths is possible in any of the three; the guides use swords." }] }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "passion" }, why: "A matched second one. Two of the same base averages to the best frame; two different bases average to something worse than the faster of them." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+2 Barbarian skills and +2 Combat Skills is +4 Frenzy from one slot, with 30% faster hit recovery, +30 all resistances and 3-6% life steal on top. Nothing displaces it for five tiers." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "+45% increased attack speed at level 43, and on this build attack speed compounds into run speed and the stack. Usually correct over Lionheart here.", alternatives: [{ ref: { kind: "runeword", slug: "lionheart" }, why: "+30 all resistances and +25 Strength instead, if the Strength is what is blocking your off-hand." }] }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal, and it drops constantly." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow on an attack that lands several times a second. This is where the Uber capability starts." }] },
        { slot: "gloves", picks: [{ label: "Crafted Blood gloves with 20% Increased Attack Speed and life steal", why: "Both stats compound with the stack." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, and attack rating for two weapons." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with attack rating, life and resistances", why: "Still the constraint." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "atmas-scarab" }, why: "Amplify Damage on striking is −100% physical resistance, and at this attack rate it is close to permanent uptime." }] },
      ],
      charms: [{ label: "Combat Skills grand charms, and life/resistance small charms", why: "A skiller is +1 Frenzy and +1 Double Swing at the same time, so it is worth more here than on a build with one synergy." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders above your own level. Swap, shout, swap back — you cannot fight on a one-handed swap." }],
      nextUpgrade: "Grief, and then the decision about what goes in the other hand.",
    },
    {
      tier: "early-hell",
      goal: "Grief in one hand, something real in the other, and resistances at the cap.",
      levelRange: [65, 75],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "**The main hand.** Its +340-400 damage is added after every percentage multiplier in the game, and Frenzy applies it on every hit of a very fast attack.", sockets: "Eth + Tir + Lo + Mal + Ral in a Phase Blade." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "fury" }, why: "**+5 to Frenzy, and it is the only class-scoped item stat on this site that lands on the build it names.** Level 65 in any 3-socket melee weapon: +209% enhanced damage, 66% Open Wounds, 33% Deadly Strike, +40% attack speed, Ignore Target's Defense and −25% target defence. The Ignore Target's Defense line is worth as much as the damage on a build whose attack rating is spread across two hands.", alternatives: [{ label: "A second Grief Phase Blade", why: "A matched pair averages to the best possible frame, and two flat-damage lines is a great deal of damage. Fury usually wins on this build because of the +5 Frenzy and the defence lines." }] }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "Still +4 Frenzy from one slot." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% enhanced damage, applied to both weapons." }, { ref: { kind: "runeword", slug: "treachery" }, why: "The attack speed instead, if you are short of it. On a stacking attack that is a defensible choice rather than a budget one." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "Damage reduction, Vitality, and the 10% hit recovery that often reaches the five-frame breakpoint." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike and Open Wounds, all of which scale with how often you hit." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking. At this attack rate it is effectively permanent, and it is the single largest survivability line a melee character has." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen — and freezing is worse here than elsewhere, because a slowed attack loses the stack." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "A second one. Two weapons need twice the attack rating." }, { ref: { kind: "unique", slug: "stone-of-jordan" }, why: "The +1 skill instead, once attack rating is handled." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 all skills, 20% increased attack speed, and Deadly Strike that grows with your level." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Magic find and gold in one grand charm slot." }, { label: "Combat Skills skillers and life/resistance small charms", why: "Each skiller raises Frenzy and its synergy together." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "The shouts, from a slot you do not fight in." }],
      nextUpgrade: "Enigma, or the Uber gear — and on this build those are genuinely different goals.",
    },
    {
      tier: "budget",
      goal: "A finished Hell character, and the point at which Uber Tristram becomes a thing you can attempt.",
      levelRange: [75, 85],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "Unmoved." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "fury" }, why: "+5 Frenzy, Open Wounds and Ignore Target's Defense. On the Ubers this is the hand that matters, because Open Wounds is one of the few things that works on them." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+4 Frenzy, resistances and life steal." }, { label: "Guillaume's Face (set item, worn alone)", why: "15% Crushing Blow, 35% Deadly Strike and 30% faster hit recovery. **A label rather than a link because this site has no set registry** — it is a piece of Orphan's Call, worn on its own for the Crushing Blow, and it is the standard Uber helm." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% enhanced damage on both weapons at once." }, { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport. Less transformative here than on any other melee build, because Frenzy's own run speed already crosses maps — take it for the +1 skills and the Strength if you take it at all.", sockets: "Jah + Ith + Ber." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "Damage reduction and the hit-recovery frame." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, and on the Ubers Crushing Blow is most of your damage." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap, which is how a melee character survives standing next to three Uber bosses." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Attack rating for the second hand." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Skills, speed and Deadly Strike." }, { ref: { kind: "unique", slug: "metalgrid" }, why: "+400-450 attack rating and +25-35 all resistances, at level 81." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Gold and magic find." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The physical Sunder Charm, and on this page it is what makes the Taunt package viable — it answers immunity without spending the eighteen points." }, { label: "Combat Skills skillers, Annihilus, Hellfire Torch", why: "The Torch is +3 Barbarian skills, which raises Frenzy, Double Swing and the mastery together." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders before the portal, not after it." }],
      nextUpgrade: "The Uber loadout proper, and the last of the attack rating.",
    },
    {
      tier: "optimized",
      goal: "Ubers on demand, and a Hell character that does not stop for anything that is not immune.",
      levelRange: [85, 95],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "The flat damage after multipliers, on the fastest attack in the game." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "fury" }, why: "+5 Frenzy, 66% Open Wounds, 33% Deadly Strike and Ignore Target's Defense." }] },
        { slot: "helm", picks: [{ label: "Guillaume's Face (set item, worn alone)", why: "The Uber helm: 15% Crushing Blow and 35% Deadly Strike. A label because the site has no set registry." }, { ref: { kind: "unique", slug: "arreats-face" }, why: "The general-purpose helm, and the correct one outside the Ubers." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "The damage armour, and this build applies it twice." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "15% damage reduction at the top roll." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Upgraded. Crushing Blow does not improve past this on boots." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, 250 attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "The second." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "metalgrid" }, why: "Attack rating and resistances, which are this build's two structural shortages." }, { ref: { kind: "unique", slug: "highlords-wrath" }, why: "Skills and speed instead, when the attack rating is already there." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Gold and magic find." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The Sunder, which is what lets this build take Taunt over Berserk." }, { label: "Combat Skills skillers, Annihilus, Hellfire Torch", why: "Every +1 raises two skills on this plan rather than one." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "The shouts." }],
      nextUpgrade: "Ethereal bases, and perfect rolls.",
    },
    {
      tier: "bis",
      goal: "Nothing left to buy. Two elite runewords, Ubers on demand, and attack rating that is no longer the limit.",
      levelRange: [90, 99],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "In an ethereal Phase Blade — Phase Blades are indestructible, so ethereal is free." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "fury" }, why: "In an ethereal Berserker Axe, with the Strength paid for. +5 Frenzy on top of everything else it does." }] },
        { slot: "helm", picks: [{ label: "Guillaume's Face (set item, worn alone) for Ubers; Arreat's Face otherwise", why: "The two helms this build swaps between, and the reason it swaps: one is Crushing Blow for three bosses, the other is +4 Frenzy and resistances for everything else. Guillaume's is a label because the site has no set registry." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "The damage, in an ethereal base." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "15% damage reduction, 40 Vitality." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Upgraded, perfect." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap, permanently, at four attacks a second." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "250 attack rating and freeze immunity." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "The second 250." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "metalgrid" }, why: "The attack rating and the resistances at the top of both rolls." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "40% magic find at the top roll." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The physical Sunder Charm." }, { label: "Combat Skills skillers, a maximum Annihilus, a maximum Hellfire Torch", why: "Two skills raised per point of +skills, because Frenzy and its synergy are both on this tree." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "A level 6 Battle Orders, which is more life than any armour." }],
      notes: "Guillaume's Face and every Immortal King piece are label picks rather than links: they are set items, and this site has no set registry. Guillaume's is the standard Uber helm on this build and is worn alone, for its Crushing Blow and Deadly Strike rather than for any set bonus.",
    },
  ],
  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Act 2, Nightmare, Might**, for the same reason as every physical Barbarian: his aura multiplies the damage you already deal. Insight ends the mana question early and its Meditation aura is worth more than any weapon he can hold until Infinity, whose Conviction cuts enemy defence as well as resistance — and defence is what a two-weapon build fights hardest. The Reaper's Toll is the other real option and it is a strong one here: Decrepify on striking is −50% enemy physical resistance and a slow, and on the Ubers a slowed boss is a boss that hits you less. Keep him alive with a Fortitude and a Vampire Gaze; **do not take Defiance**, because a defence aura does nothing for a character whose problem is landing hits on two weapons at once.",
  farming: [
    { area: "uber-tristram", difficulty: "hell", why: "This is the build's headline. Crushing Blow from boots and helm, Open Wounds from Fury, Life Tap from Dracul's, and an attack rate that applies all three constantly. The Barbarian who kills the three bosses is this one.", minTier: "budget", rating: 5 },
    { area: "worldstone-keep", difficulty: "hell", why: "Area level 85 and dense, and the stack never has time to fall off. Frenzy's run speed makes the route between packs quick without a Teleport.", minTier: "early-hell", rating: 5 },
    { area: "chaos-sanctuary", difficulty: "hell", why: "Dense and lucrative, and the seal bosses die to Crushing Blow. The Oblivion Knights are the hazard — their curses land on a character who is standing still by design.", minTier: "budget", rating: 4 },
    { area: "pit", difficulty: "hell", why: "Area level 85 with the best density-to-danger ratio in the game. Bring the Berserk package or a Bone Break, because the physical immunes here are the build's one real wall.", minTier: "early-hell", rating: 4 },
    { area: "travincal", difficulty: "hell", why: "Three high-value targets standing together and nothing immune to physical among them. Short, and the stack is up before you reach them.", minTier: "nightmare", rating: 4 },
    { area: "mausoleum", difficulty: "hell", why: "Area level 85 with almost nothing physical-immune in it, which makes it the friendliest 85 zone for the Taunt package.", minTier: "early-hell", rating: 4 },
  ],
  immunityPlan:
    "**Physical immunity, and the page's central decision is what you spend on it.** The Berserk package converts Frenzy's damage to magic at 1% per hard point and adds a second attack that is entirely magic — nineteen points buys both. The alternative is to answer immunity with an item instead and spend the eighteen points on Taunt: a Bone Break makes physical immunes merely resistant, and a mercenary carrying Infinity does the same for a party. Atma's Scarab is not a third answer: Amplify Damage cannot break an immunity on its own, only reduce a physical resistance that is already below 100%. At this attack rate its uptime is close to permanent, which makes it excellent against everything that was never immune and irrelevant to the one thing this section is about. Magic immunity is rare, and Concentrate sits in the core at one point as the physical answer to it.",
  hardcoreNotes:
    "The stack is the danger. A Frenzy Barbarian is at his most fragile in the first two seconds of a fight and at his safest ten seconds in, which is the opposite of how most characters die — so the deaths come from opening on the wrong target, not from being overwhelmed at the end. Open on trash, always. Take the Berserk package rather than Taunt: an immune pack you cannot damage is a pack you have to walk out of, and walking is exactly what this build is bad at with a cold stack. Reach 86% hit recovery rather than 48%, treat Cannot Be Frozen as mandatory — a chilled Frenzy loses the stack — and get Dracul's Grasp earlier than the tier suggests, because Life Tap is worth more than any amount of damage reduction on a character who is always in contact.",
  selfFoundNotes:
    "Better self-found than the Whirlwind Barbarian, because a matched pair of ordinary weapons beats a single great one here and Passion is a level-43 runeword made from common runes. Arreat's Face, Gore Rider, String of Ears, Raven Frost and Atma's Scarab all drop readily. The build only truly stops at Grief and Fury, and Fury's Jah and Ber are as far out of reach as any rune in the game — but a self-found Frenzy Barbarian on two Passions or two Oaths clears Hell perfectly well, because the damage is the attack rate and the flat additions rather than a single enormous weapon.",
  levelingPath: {
    summary:
      "**This build needs no respec at all**, and it is one of only two on the class that does not. Bash feeds Double Swing at 10% a hard point, Double Swing is Frenzy's prerequisite *and* its synergy at 8%, and Double Throw sits between them as the gate — so the levelling chain and the endgame chain are the same chain. The only thing to re-decide is the mastery, and only if the weapons you finish with are a different family from the ones you levelled with.",
    respecAt: "None required. Keep the tokens for a mastery change if your weapons change family.",
  },
  confidence: "verified",
  complete: true,
};
