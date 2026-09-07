import type { Build } from "@/lib/types";

/**
 * The Berserk Barbarian — and the Gold Find Barbarian, which is this build.
 *
 * THE COLUMN THIS PAGE RESTS ON
 * -----------------------------
 * `calc4 = 100` under `EType = mag`. Berserk converts **all** of its damage to
 * magic, not part of it: the weapon's physical damage is carried and delivered
 * as magic, so a physical immune takes the whole of it and only a
 * magic-resistant monster resists. Every other Barbarian attack is stopped by
 * physical immunity and this one is not, which is the entire reason the build
 * exists and the reason it farms areas the others avoid.
 *
 * The cost is on the same row. `aurastat2 = armor_override_percent` at −100 sets
 * defence to zero while the state is up, and `aurastat1 = damageresist` reads
 * `par5`, which is **0** — so Berserk grants no damage reduction at all. Any
 * guide that credits it with some is describing a different version.
 *
 * The duration behaves backwards and it is worth knowing: `par4 - min(((110 *
 * lvl) / (lvl + 6) * (par4 - par3) / 100), par4 - par3)` with par3 = 25 and
 * par4 = 75. About 68 frames at one point, about 33 at twenty — **more points
 * mean less time defenceless**, which is the opposite of what a reader expects
 * from a drawback that scales.
 *
 * WHY GOLD FIND IS A PACKAGE HERE AND NOT A PAGE
 * ---------------------------------------------
 * The two plans share four of their five maxed skills — Berserk, the mastery,
 * Howl and Find Potion — and differ only in whether the last twenty points buy
 * Find Item or Battle Orders, plus a gear axis that stacks Extra Gold where the
 * other stacks Magic Find. The community calls the same character the Horker,
 * the GF Barb, the Gambler, the Pit Zerker and the Travincal Barb. A page for
 * it would have been a page for one area, which is the failure this roster was
 * built to avoid. See `docs/research/08-barbarian.md` §10.1.
 *
 * WHY THE HORK PACKAGE SPLITS ITS POINTS INSTEAD OF MAXING FIND ITEM
 * -----------------------------------------------------------------
 * Find Item's chance is `calc1 = dm12 + skill('Find Potion'.blvl) * par8`, with
 * par8 = 1. So Find Item's own contribution is a **diminishing** curve from 5%
 * to 60%, while Find Potion adds a **flat one percentage point per hard point**
 * on top of it. A flat term eventually beats a diminishing one, and sixteen
 * points is enough for it to matter:
 *
 *   Find Item 17 + Find Potion  1   50.7%   Grim Ward +25%
 *   Find Item 13 + Find Potion  5   51.4%   Grim Ward +45%    <- the package
 *   Find Item  9 + Find Potion  9   50.3%   Grim Ward +65%
 *   Find Item  1 + Find Potion 17   30.6%   Grim Ward +105%
 *
 * The split is not a compromise: 13/5 is a **higher find chance** than putting
 * all sixteen into Find Item, and it comes with twenty more points of Grim
 * Ward's debuff for nothing. Find Potion also feeds Grim Ward at 5% per hard
 * point, and the game labels neither parameter a synergy, so the graph
 * correctly draws no edge for either and both numbers are real.
 */
export const berserkBarbarian: Build = {
  slug: "berserk-barbarian",
  name: "Berserk Barbarian",
  classSlug: "barbarian",
  summary:
    "Magic damage from a physical weapon, and a second roll off every corpse. The Barbarian nothing is immune to, and the one that farms gold.",
  damageTypes: ["magic"],
  primarySkill: "berserk",
  playstyle:
    "You hunt individual dangerous things rather than clearing rooms. Berserk is a single enormous swing that converts your weapon's damage to magic, so the elite pack with a physical immunity that stops every other melee character is the pack you were looking for — but it is one target at a time, and your defence is zero while you swing. The rhythm is Battle Cry to strip defence, Berserk the champion, then Find Item every corpse it leaves. Between packs you are hitting the Find Item button more often than the attack button, which is what the build is actually for. Concentrate is the swing you use when something hits hard enough that zero defence is not survivable.",
  strengths: [
    "**All of its damage is magic**, so physical immunity — the wall every other Barbarian hits — does not exist for it",
    "Find Item generates loot that did not drop, which no other class in the game can do",
    "Two twenty-point synergies at 10% a hard point each, both from a tree it wanted anyway",
    "The best magic-find and gold-find Barbarian, and the two are the same character",
    "Attack rating +100% and 15% per level, the largest on the class after Leap Attack",
  ],
  weaknesses: [
    "**Your defence is zero while it swings** — and the skill grants no damage reduction, whatever older guides say",
    "One target at a time. This is the worst density farmer on the class and it is not close",
    "Magic-resistant monsters are its bad matchup, and Concentrate is the only answer in the plan",
    "Heavily weapon-dependent: the conversion is of the weapon's damage, so a bad weapon is bad magic damage",
    "It wants magic find and damage from the same slots, and they compete",
  ],
  difficulty: "moderate",
  budget: "medium",
  ratings: {
    clearSpeed: 2,
    bossing: 3,
    survivability: 3,
    magicFind: 5,
    terrorZones: 3,
    ubers: 2,
    soloSelfFound: 4,
    players8: 3,
  },
  skills: [
    {
      skill: "berserk",
      points: 20,
      role: "main",
      order: 1,
      note: "+150% damage at one point and 15% more per level, **delivered entirely as magic**. The weapon's physical damage is carried and converted at 100%, which is why a physical immune takes all of it. Your defence is set to zero while the state runs — about 2.7 seconds at one point, shrinking to about 1.3 at twenty, so more points mean *less* time exposed. It grants no damage reduction: the row has the stat and the parameter feeding it is zero at every level.",
    },
    {
      skill: "howl",
      points: 20,
      role: "synergy",
      order: 2,
      note: "+10% Berserk damage per hard point. A level-1 skill that this build maxes and never presses — although the fear is a genuine escape button on a character standing in the open with no defence.",
    },
    {
      skill: "battle-orders",
      points: 20,
      role: "synergy",
      order: 3,
      note: "**+10% Berserk damage per hard point, and +92% maximum life at twenty.** These are the only twenty points in this plan that buy damage and survivability at the same time, which is why it never has to choose between them.",
    },
    {
      skill: "blade-mastery",
      points: 20,
      role: "main",
      order: 4,
      note: "+28% damage and 5% per level, +40% attack rating and 8% per level, critical strike toward 35%. **The mastery still applies**: Berserk converts the weapon's damage after the mastery has raised it, so a mastery is not wasted on a magic attack. Swap it for whatever family your weapon is.",
    },
    { skill: "bash", points: 1, role: "prerequisite", note: "Stun's prerequisite." },
    { skill: "stun", points: 1, role: "prerequisite", note: "Concentrate's prerequisite." },
    {
      skill: "concentrate",
      points: 1,
      role: "utility",
      note: "Berserk's prerequisite, and the build's answer to two different problems: a magic-resistant monster, and anything that hits hard enough that zero defence is unaffordable. It doubles your defence while it swings and cannot be interrupted. Seventeen points in its package if you meet magic resistance often.",
    },
    {
      skill: "find-potion",
      points: 1,
      role: "utility",
      note: "One point here and five in the hork package, and neither is about potions. It adds **1% to Find Item's chance per hard point** and **5% to Grim Ward's enemy-damage-taken debuff per hard point**. Both are flat rather than diminishing, which is why the package below puts points here rather than all of them into Find Item — see its note for the arithmetic. The game labels neither parameter a synergy, so the skill page draws no edge for either.",
    },
    {
      skill: "find-item",
      points: 1,
      role: "utility",
      note: "One point in the core and thirteen in the hork package. It rolls a **second drop from a corpse that has already dropped**, which no other class can do, and your Magic Find applies to that roll. The base chance runs 5% to 60% on a diminishing curve, plus one flat point per hard point of Find Potion; 30% of what it finds is high quality and 5% magic or better.",
    },
    { skill: "grim-ward", points: 1, role: "utility", note: "A totem that terrifies, slows up to 75%, and raises the damage everything inside takes by 20% plus 5% per hard point of Find Potion — +45% on the hork package's five. One point is the whole field; the radius is what further points buy." },
    { skill: "shout", points: 1, role: "utility", note: "Battle Orders' prerequisite, party defence, and 5 seconds per hard point onto Battle Orders' duration." },
    { skill: "battle-command", points: 1, role: "utility", note: "+1 to all skills, flat at every level. Cast it first — Battle Command, Battle Orders, Shout, then heal." },
    { skill: "taunt", points: 1, role: "prerequisite", note: "Battle Cry's prerequisite, and a way to pull one champion out of a pack — which is exactly how this build wants to fight." },
    { skill: "battle-cry", points: 1, role: "utility", note: "Enemy defence −50% and 2% more per level. On a build whose whole job is landing one enormous swing on one dangerous thing, halving its defence is worth more than any attack-rating item." },
    { skill: "increased-stamina", points: 1, role: "prerequisite", note: "Increased Speed's prerequisite." },
    { skill: "increased-speed", points: 1, role: "utility", note: "Always-on run speed. This build walks between corpses more than it fights." },
    { skill: "iron-skin", points: 1, role: "prerequisite", note: "Natural Resistance's prerequisite. Its defence bonus is worth nothing while Berserk is swinging, since defence is zero regardless." },
    { skill: "natural-resistance", points: 1, role: "utility", note: "All four resistances, added before the cap. On a character with no defence and no block in the main line, resistances are most of the mitigation there is." },
  ],
  skillPackages: [
    {
      id: "the-last-sixteen",
      name: "The last sixteen points",
      choose: "one",
      intro:
        "The core is 94 and closes every prerequisite. The remaining sixteen decide what kind of Barbarian this is: the one that maximises what falls out of a corpse, or the one that carries a physical swing for the things magic cannot hurt. This is where the Gold Find and Horker builds live — they are this page with the first package and a different gear axis, not a separate character.",
      packages: [
        {
          id: "hork",
          name: "The hork — Gold Find, Horker, Travincal",
          when: "Loot is the point. You run Travincal or the Pit on repeat, and you would rather roll the corpse twice than kill the next thing faster.",
          tradeoff: "Concentrate stays at one point, so a magic-resistant monster is a long fight with a weapon that is doing the wrong kind of damage.",
          skills: [
            { skill: "find-item", points: 13, role: "utility", note: "Thirteen rather than seventeen, and that is not a compromise — it is the higher number. Find Item's own contribution is a diminishing curve toward 60%, so its last points are worth a fraction of its first; Find Potion adds a flat point per hard point on top. **Find Item 13 with Find Potion 5 is 51.4% against 50.7% for all sixteen in Find Item**, and it comes with twenty more points of Grim Ward's debuff for free." },
            { skill: "find-potion", points: 5, role: "utility", note: "Four points more than the core, buying four percentage points of Find Item's chance — flat, not diminishing — and +20% on Grim Ward's enemy-damage-taken debuff, taking it from +25% to +45%." },
          ],
          gearNote:
            "**This is where the gear axis forks.** For gold: Goldwrap, Chance Guards, a Rhyme shield for its 50% Extra Gold, Gheed's Fortune, and a Wealth armour once the runes allow — the Travincal Council drop gold in quantity and the mercenary's Gold Find stacks with yours when he lands the killing blow. For loot: War Traveler, Chance Guards, Gheed's, and as much Magic Find as the damage will tolerate. The two lists overlap in three slots and diverge in three.",
          contentNote: "Travincal for gold, the Pit and Pindleskin for items. Both are short, both are dense in high-value targets, and neither needs the clear speed this build does not have.",
          remainderNote: "Nothing is left over. 94 + 16 = 110.",
        },
        {
          id: "concentrate",
          name: "Concentrate — the physical swing",
          when: "You run Terror Zones or Chaos Sanctuary, where magic-resistant monsters are common enough that an all-magic character stalls.",
          tradeoff: "Find Item stays at one point, which costs you most of the loot the build is otherwise famous for.",
          skills: [
            { skill: "concentrate", points: 17, role: "main", note: "+70% damage and 5% per level, physical, plus 5% per hard point of Bash and **10% per hard point of Battle Orders** — which this plan already maxes, so the synergy is paid for. It doubles your defence while it swings and it cannot be interrupted, which makes it the safe button as well as the physical one." },
          ],
          rotationNote:
            "Berserk on everything, Concentrate on anything that resists magic and on anything hitting hard enough that zero defence is a problem. Battle Cry first either way.",
          contentNote: "Chaos Sanctuary, Terror Zones, and any content where you cannot choose your targets.",
          remainderNote: "Nothing is left over. 94 + 16 = 110.",
        },
      ],
    },
  ],
  flexPoints: [
    "**There are none.** The core is 94 and either package is exactly 16, so a level-99 sheet reads 110 spent with nothing unassigned.",
    "Below 99 the order is Berserk, Battle Orders, the mastery, then Howl, then the package. Battle Orders before the mastery is deliberate: it is damage and life in the same twenty points.",
    "The hork package's split between Find Item and Find Potion is the one allocation on this page that looks like a mistake and is not — thirteen and five beats sixteen and none, and the package note shows the arithmetic.",
  ],
  stats: {
    strength: "Enough for your weapon and body armour. This build can hold a shield, so the requirement is usually the armour rather than the weapon.",
    dexterity: "Enough for the weapon, plus maximum block if you hold a shield — and you probably should, because block is the only mitigation that still works when your defence is zero.",
    vitality: "Everything else. Four life per point and Battle Orders on top of it.",
    energy: "None. Berserk costs 4 mana.",
    notes: [
      "**Block still works while Berserk swings.** Berserk sets *defence* to zero, and block is a separate roll — so a shield is the one defensive item the skill does not cancel, which is why this is the Barbarian most likely to hold one.",
      "Do not buy Dexterity for damage. The mastery and the synergies are where damage comes from; Dexterity here is a weapon requirement and a block number, nothing else.",
      "Life matters more than usual because defence is zero by design and there is no damage reduction on the skill to compensate.",
    ],
  },
  breakpoints: [
    { stat: "fhr", value: 48, frames: 5, why: "Five frames on the table shared with the Paladin and the Assassin. Berserk cannot be interrupted mid-swing, but a character with zero defence is hit often, and the recovery between swings is where a bad fight becomes a death.", priority: "required" },
    { stat: "fhr", value: 86, frames: 4, why: "Four frames. Worth reaching on a build whose defensive plan is 'do not get hit for long'.", priority: "recommended" },
    { stat: "fbr", value: 42, frames: 4, why: "Only with a shield, and a shield is unusually good here: Berserk zeroes defence and block is a separate roll, so blocking is mitigation the skill cannot cancel.", priority: "recommended" },
    { stat: "fcr", value: 63, frames: 9, why: "Only with an Enigma. Teleport turns this from a build that walks between corpses into one that arrives at them, and it is the single largest quality-of-life upgrade the build has.", priority: "luxury" },
  ],
  breakpointNotes:
    "**No attack-speed row.** Increased Attack Speed frames depend on the weapon's base speed and the skill, so no single percentage is correct for a class, and this site does not publish one. Attack speed is low-value on this build for a reason of its own: Berserk is one large swing rather than a stream of small ones, so raw damage per hit is worth more than another swing per second. Prefer damage and attack rating over speed when the two compete.",
  gearSets: [
    {
      tier: "starter",
      goal: "Berserk on the bar with a weapon worth converting, and enough magic find that the corpses are worth horking.",
      levelRange: [1, 40],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "steel" }, why: "+25% attack speed and 50% Open Wounds for two Countess runes. Berserk converts whatever the weapon deals, so early on any decent base works.", sockets: "Tir + El in a 2-socket base." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "+43-48% to every resistance at level 21. This build holds a shield more happily than any other Barbarian, because Berserk cancels defence and not block." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to all skills in any 2-socket helm.", sockets: "Ort + Sol." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Run speed and hit recovery, both of which matter to a character who walks between corpses." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "goldwrap" }, why: "50-80% Extra Gold and 30% Magic Find at level 27. On this build, from this tier onward, that is a damage stat by another name." }] },
        { slot: "boots", picks: [{ label: "Any rare or magic boots with Faster Run/Walk and resistances", why: "You are always walking to the next corpse." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "chance-guards" }, why: "**Level 15, 200% Extra Gold and 25-40% Magic Find.** This is the single best value item on the whole build and it drops in Normal." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Attack rating and 15-30% Magic Find, and two of them is a real amount of both." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "The second one. Magic Find applies to the Find Item roll as well as to the kill." }] },
        { slot: "amulet", picks: [{ label: "A rare or magic amulet with +2 Barbarian skills", why: "+2 skills is +2 Berserk and +2 mastery at once." }] },
      ],
      charms: [{ label: "Small charms with life, resistances and magic find", why: "Magic find charms earn double here, because they apply to the hork as well." }],
      nextUpgrade: "Arreat's Face at 42, and Battle Orders to twenty.",
    },
    {
      tier: "nightmare",
      goal: "A weapon with real damage to convert, Arreat's Face, and the magic-find core in place.",
      levelRange: [40, 65],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "passion" }, why: "**+1 to Berserk** on top of +25% attack speed at level 43 — a runeword that names the build's own skill, in any 4-socket weapon.", alternatives: [{ ref: { kind: "runeword", slug: "oath" }, why: "Level 49: +210-340% enhanced damage, and **enhanced damage is converted along with the rest**, so none of it is wasted on a magic attack. Its bases are swords, axes and maces, so it fits any mastery." }, { ref: { kind: "runeword", slug: "kingslayer" }, why: "Level 53, −25% target defence from the weapon slot." }] }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "rhyme" }, why: "**50% Extra Gold and 25% Magic Find on a shield**, plus Cannot Be Frozen and +25 all resistances, at level 29. On the gold route this is one of the best slots on the character." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+2 Barbarian skills and +2 Combat Skills — +4 Berserk from one slot — with 30% faster hit recovery, +30 all resistances and life steal." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "lionheart" }, why: "+30 all resistances, +50 life and +25 Strength. Resistances are the mitigation this build has instead of defence." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "goldwrap" }, why: "Still the gold belt, and 10% attack speed with it." }, { ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal instead, if you are dying rather than farming." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "**25-50% Magic Find and flat damage** at level 42. The magic find applies to the hork, which is why this beats Gore Rider on the loot route." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "chance-guards" }, why: "200% Extra Gold and up to 40% Magic Find. Nothing displaces it on either route." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Magic find and attack rating." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "atmas-scarab" }, why: "Level 60. Its Amplify Damage is a physical-resistance reduction, so it does nothing for Berserk's magic damage — but it is excellent on the Concentrate package's swings, and the +5 to all attributes and resistances are always worth having." }] },
      ],
      charms: [{ label: "Combat Skills grand charms, magic find small charms", why: "A Combat Skills skiller is +1 Berserk. Magic find charms count twice on this build." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders above your own level — and on this build Battle Orders is a damage synergy as well as life, so a higher one is a bigger Berserk." }],
      nextUpgrade: "Grief, and the decision between the gold shield and a damage off-hand.",
    },
    {
      tier: "early-hell",
      goal: "A Hell farmer: enough damage to one-shot champions, enough resistance to stand in the open, and enough magic find that it is worth doing.",
      levelRange: [65, 75],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "**Its +340-400 flat damage is added after every multiplier and is then converted with the rest**, which is why the best physical weapon in the game is also the best magic-damage weapon for this build.", sockets: "Eth + Tir + Lo + Mal + Ral in a Phase Blade." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "35% damage reduction and the highest block in the game, at level 73. Block is the mitigation Berserk does not cancel." }, { ref: { kind: "runeword", slug: "rhyme" }, why: "The gold and magic find instead, on the hork route." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+4 Berserk from one slot, and the resistances that let the rest of the gear chase find." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% enhanced damage — converted along with everything else — and +200% enhanced defence, which is worth nothing while Berserk swings and a great deal while it does not." }, { ref: { kind: "runeword", slug: "wealth" }, why: "**300% Extra Gold** at level 43, on the gold route. It is the largest single gold line available and it costs three common runes." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "10-15% damage reduction, +30-40 Vitality and the 10% hit recovery that often reaches five frames." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find that applies to the hork, and flat damage that is converted." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "chance-guards" }, why: "Still unbeaten on both routes." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and 150-250 attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills." }, { ref: { kind: "unique", slug: "nagelring" }, why: "Magic find instead, on the hork route." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 all skills, attack speed, and Deadly Strike — which doubles physical damage before the conversion, so it works here." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "**20-40% Magic Find and 80-160% Extra Gold in one grand charm**, and it reduces vendor prices — which matters on the build that gambles what it farms." }, { label: "Combat Skills skillers and magic find small charms", why: "Skills for the swing, find for the corpse." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "A higher Battle Orders is a bigger Berserk on this page specifically." }],
      nextUpgrade: "Enigma. This build walks more than any other and benefits more from not having to.",
    },
    {
      tier: "budget",
      goal: "Teleport, and a finished Hell farmer that can pick its own targets across a map.",
      levelRange: [75, 85],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "Unmoved. Flat damage after multipliers, converted whole." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Damage reduction and block, the two mitigations Berserk leaves intact." }, { ref: { kind: "runeword", slug: "rhyme" }, why: "Gold and find, on the hork route." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+4 Berserk and the resistances." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "**Teleport.** On a build that spends more time walking to corpses than fighting, this is worth more than any damage armour — and its +1 to all skills is +1 Berserk on top.", sockets: "Jah + Ith + Ber." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "Damage reduction and the hit-recovery frame." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find on the corpse roll." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "chance-guards" }, why: "Gold and find." }, { ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap instead, if you are dying to the zero-defence window rather than farming comfortably." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills and the mana Teleport spends." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Skills and Deadly Strike." }, { ref: { kind: "unique", slug: "metalgrid" }, why: "+400-450 attack rating and +25-35 all resistances at level 81, if attack rating is what is failing." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Find, gold and cheaper gambling." }, { ref: { kind: "unique", slug: "bone-break" }, why: "Only if you take the Concentrate package — the physical Sunder is meaningless to a magic attack and useful to a physical one." }, { label: "Combat Skills skillers, Annihilus, Hellfire Torch", why: "The Torch is +3 Barbarian skills, which is +3 Berserk and +3 to both synergies." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, which is damage here." }],
      nextUpgrade: "The magic-find ceiling, and perfect rolls on the find items.",
    },
    {
      tier: "optimized",
      goal: "A farmer that clears its targets instantly and rolls every corpse, with Teleport between them.",
      levelRange: [85, 95],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "The flat damage, converted." }, { ref: { kind: "runeword", slug: "fury" }, why: "+209% enhanced damage, Ignore Target's Defense and −25% target defence. Its +5 to Frenzy is a **dead line on this build** — it is here for the damage and the defence reduction." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "The block and damage reduction line." }, { ref: { kind: "runeword", slug: "rhyme" }, why: "The gold and find line." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+4 Berserk, unbeaten across five tiers." }, { ref: { kind: "unique", slug: "crown-of-ages" }, why: "Two sockets, 30% damage reduction and +1 all skills, at level 82." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, and it does not become optional." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "15% damage reduction at the top roll." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "50% magic find at the top roll." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "chance-guards" }, why: "40% magic find and 200% gold." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Freeze immunity and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }, { ref: { kind: "unique", slug: "nagelring" }, why: "A perfect 30% magic find instead." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "metalgrid" }, why: "Attack rating and resistances, both of which this build is short of." }, { ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and +20-30 all resistances at level 67 — usually the better amulet once attack rating is handled." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "The find, the gold and the vendor prices." }, { label: "Combat Skills skillers, Annihilus, Hellfire Torch, magic find small charms", why: "Skills raise Berserk and both its synergies; find raises the corpse roll." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "The shouts." }],
      nextUpgrade: "Ethereal bases and the last of the resistances.",
    },
    {
      tier: "bis",
      goal: "Nothing left to buy. The best magic find on the class, Teleport, and a swing nothing is immune to.",
      levelRange: [90, 99],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "In an ethereal Phase Blade — indestructible, so ethereal is free." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Upgraded, with a perfect damage-reduction roll." }, { ref: { kind: "runeword", slug: "rhyme" }, why: "The gold shield, on the Travincal route." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "Upgraded, with a perfect life-steal roll." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, in the lightest base your Strength allows." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "15% damage reduction, 40 Vitality." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "A perfect 50% magic find." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "chance-guards" }, why: "A perfect 40% magic find with 200% gold." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "250 attack rating and freeze immunity." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills, and the mana pool for constant Teleport." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and +30 all resistances. On a build with no defence, the resistances are the mitigation." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "40% magic find, 160% gold, 15% off every gamble." }, { label: "Combat Skills skillers, a maximum Annihilus, a maximum Hellfire Torch", why: "Every +1 raises Berserk and both of its synergies at once, which no other Barbarian build can say." }, { label: "Magic find small charms", why: "They apply to the kill and to the hork, which is why this build values them above life charms at the top end." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "A level 6 Battle Orders is both the life and a damage synergy here." }],
      notes: "Immortal King and Guillaume's Face are label picks elsewhere on this class and neither belongs here: this build wants find and resistances rather than Crushing Blow, and its swing already ignores the immunity that Crushing Blow would have helped with.",
    },
  ],
  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Act 2, Nightmare, Might** — his aura raises the *physical* damage that Berserk then converts, so it works despite the conversion. Insight ends the mana question; The Reaper's Toll is the better late choice, because Decrepify on striking slows a champion that would otherwise be hitting a character with no defence. **The gold detail worth knowing: if the mercenary lands the killing blow, his Extra Gold From Monsters and yours are added together.** On the Travincal route that makes his belt and gloves a real part of the gold plan rather than an afterthought, and it is the rare piece of mercenary gearing that is about loot rather than survival. Keep him alive with a Fortitude and a Vampire Gaze; **do not take Defiance**, whose defence aura helps a character whose own defence is zero by design not at all.",
  farming: [
    { area: "pit", difficulty: "hell", why: "Area level 85, and every physical immune in it is a target rather than an obstacle. This is the build's home and the reason it exists.", minTier: "nightmare", rating: 5 },
    { area: "travincal", difficulty: "hell", why: "**The gold route.** Three Council members standing together, enormous gold drops, and a corpse each to hork. Short enough that the run is measured in seconds.", minTier: "nightmare", rating: 5 },
    { area: "pindleskin", difficulty: "hell", why: "Area level 83 and the shortest run in the game. One target, which is this build's best case rather than its worst — and a corpse to roll afterwards.", minTier: "nightmare", rating: 5 },
    { area: "mausoleum", difficulty: "hell", why: "Area level 85, and the density is low enough that a one-target-at-a-time build is not punished for it.", minTier: "early-hell", rating: 4 },
    { area: "andariel", difficulty: "hell", why: "A single boss with a fixed, generous drop table and a very short run. Berserk's single-target damage is exactly the right shape.", minTier: "nightmare", rating: 4 },
    { area: "worldstone-keep", difficulty: "hell", why: "Area level 85 and lucrative, but dense — and density is this build's weakness. Worth running for the champions rather than the trash.", minTier: "budget", rating: 3 },
  ],
  immunityPlan:
    "**This is the Barbarian with no immunity problem, and the reason is one column.** Berserk's `calc4` is 100 under `EType = mag`: the weapon's physical damage is carried and delivered entirely as magic, so a physical immune — the wall that stops every other build on this class — takes the full hit. Nothing needs to be spent on answering it. The inverse is the build's real weakness: **magic-resistant and magic-immune monsters**, which are rare but do exist, and against which an all-magic character has nothing. Concentrate is the answer and it is in the core at one point, or at seventeen in its package. A physical Sunder Charm is useless here for the same reason the immunity is: it operates on a damage type this build does not deal.",
  hardcoreNotes:
    "Zero defence is a bad property in Hardcore and it is worth taking seriously rather than working around. Two things make it survivable: **block still works** — Berserk cancels defence, not the block roll — so hold a shield and reach the block breakpoint, and the defenceless window *shrinks* as Berserk levels, from about 2.7 seconds at one point to about 1.3 at twenty, so maxing it early is a defensive purchase as well as an offensive one. Use Concentrate rather than Berserk on anything you have not already softened with Battle Cry: it doubles defence instead of removing it and cannot be interrupted. Take the Concentrate package rather than the hork; loot is worth less than a character. And treat Dracul's Grasp as a required item rather than a budget alternative, because Life Tap is mitigation that does not care what your defence is.",
  selfFoundNotes:
    "**The most self-found-friendly build on the class**, and it is not close. Its best items are Chance Guards at level 15, Goldwrap at 27, Nagelring at 7 and War Traveler at 42 — all common, all Normal or Nightmare drops. Arreat's Face, Raven Frost and Atma's Scarab follow. Passion at level 43 gives +1 Berserk from four common runes, and Rhyme is two. The build farms its own upgrades better than any other Barbarian because Find Item rolls every corpse twice, so a self-found character compounds rather than plateaus. Grief and Enigma are the only real walls and neither is needed to farm Hell productively.",
  levelingPath: {
    summary:
      "Level on Bash and Double Swing with a mastery matched to the weapon you can buy, take the Warcry spine as it unlocks, and respec once at level 40 into this plan. Berserk itself carries the character from level 30 onward, so the transition into this build is the gentlest of the six — you are already pressing the button before the respec that funds it.",
    respecAt: "Nightmare Act 4, level 40, after The Fallen Angel. The levelling route's Bash and Double Swing points come back and go into Howl, Find Potion and the mastery.",
  },
  confidence: "verified",
  complete: true,
};
