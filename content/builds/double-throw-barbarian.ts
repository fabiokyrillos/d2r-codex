import type { Build } from "@/lib/types";

/**
 * The Double Throw Barbarian — the Thrower.
 *
 * WHY THIS BUILD EXISTS ON THIS BASELINE AND NOT ON THE OLD ONE
 * ------------------------------------------------------------
 * Throwing Mastery is the only mastery of the six with more than three passive
 * stats, and the three extra ones are the whole build:
 *
 *   `skill_pierce`                        0% climbing toward 55%
 *   `passive_mastery_noconsume`           0% climbing toward 66%
 *   `passive_mastery_replenish_oncrit`    a flag, `Param11 = 1`
 *
 * Two thirds of your throws consume nothing and a critical hit puts a weapon
 * back in your hand. Ammunition — the reason every 1.1x-era guide calls throwing
 * unplayable past Normal — stops being a constraint inside the mastery itself.
 * Nothing else on this page matters as much as those three rows.
 *
 * THE OTHER COLUMN: `itypea1 = thro` AND `itypeb1 = thro`
 * ------------------------------------------------------
 * Double Throw is one of five skills in the game that declare an off-hand item
 * requirement, and its requirement is a *second throwing weapon*. There is no
 * shield at any tier of this build, which is why it publishes no Faster Block
 * Rate row — the same reason as the Frenzy page, reached from a different column.
 *
 * WHAT THIS PAGE CANNOT LINK, AND WHY
 * -----------------------------------
 * **This site catalogues no throwing weapon a Barbarian can equip.** The two
 * javelins it does catalogue — Titan's Revenge and Thunderstroke — are both on
 * `ajav`, the Amazon Javelin item type, whose `Class` is `ama`. So every weapon
 * and off-hand pick below is a `label` rather than a `ref`, across all six
 * tiers, and their stat lines are described by role rather than quoted: an
 * uncatalogued item's numbers are not this site's to publish. That is a larger
 * gap than the set-item one on the Whirlwind and Frenzy pages, because here it
 * is the slot the build is named after.
 */
export const doubleThrowBarbarian: Build = {
  slug: "double-throw-barbarian",
  name: "Double Throw Barbarian",
  classSlug: "barbarian",
  summary:
    "The only Barbarian who fights at range, and the only build on the class whose central mechanic is not damage but ammunition.",
  damageTypes: ["physical"],
  primarySkill: "double-throw",
  playstyle:
    "You throw both weapons at once and you almost never run out, which is the part that takes getting used to. Every 1.1x instinct says to conserve, pick up what you threw and swap to melee when the stack runs low; none of that applies. Throwing Mastery gives back two thirds of what you throw and replenishes on a critical hit, so the correct play is to throw constantly and keep moving. With pierce from the mastery and a Razortail, a single throw goes through a line of monsters, so you fight down corridors rather than into rooms. The mercenary tanks, you stand behind him, and the one thing that reliably kills this build is something reaching you — which is what Battle Cry, Grim Ward and Leap are on the bar for.",
  strengths: [
    "**Safe from range** — the only Barbarian who is not standing in what he is killing",
    "Ammunition is solved inside the mastery: two thirds of throws consume nothing, and criticals replenish",
    "Pierce from the mastery and from Razortail turns one throw into a line of hits",
    "The steepest per-level damage slope in the Combat tree: +8% a level against Whirlwind's +5%",
    "A great elite hunter — single-target damage at range with no exposure",
  ],
  weaknesses: [
    "**Two throwing weapons, so no shield and no block**, at any tier",
    "Physical damage only, and the plan has room for one small answer to that",
    "Area damage is poor: pierce is a line, not a radius",
    "**No throwing weapon on this build is catalogued on this site**, so its gear list is labels rather than links",
    "Heavily weapon-dependent, and throwing bases are rarer and worse-supported than melee ones",
  ],
  difficulty: "advanced",
  budget: "high",
  ratings: {
    clearSpeed: 3,
    bossing: 4,
    survivability: 4,
    magicFind: 3,
    terrorZones: 3,
    ubers: 2,
    soloSelfFound: 2,
    players8: 3,
  },
  skills: [
    {
      skill: "double-throw",
      points: 20,
      role: "main",
      order: 1,
      note: "+16% damage at one point and **8% more per level** — the steepest per-level slope of any Barbarian attack, against Whirlwind's 5% and Bash's 5%. It throws both weapons at once and they need not be the same weapon. It costs 1 mana. Its attack rating bonus is +20% and 10% per level, the second largest on the class.",
    },
    {
      skill: "double-swing",
      points: 20,
      role: "synergy",
      order: 2,
      note: "+8% Double Throw damage per hard point, and the prerequisite as well. You will never press it — it is a melee skill on a ranged build — but it is twenty points of the primary skill's damage, which is why it is maxed second.",
    },
    {
      skill: "throwing-mastery",
      points: 20,
      role: "main",
      order: 3,
      note: "**The reason this build works.** +28% damage and 5% per level and +44% attack rating and 8% per level like any mastery — and then three rows no other mastery has: pierce climbing from 0% toward 55%, a no-consume chance climbing from 0% toward 66%, and quantity replenished on a critical hit. Ammunition stops being a constraint. Its item type covers throwing axes, throwing knives, javelins and missile potions.",
    },
    {
      skill: "battle-orders",
      points: 20,
      role: "utility",
      order: 4,
      note: "+92% maximum life at twenty. Not a Double Throw synergy — it is here because after the primary, its synergy and the mastery there is nothing else worth twenty points, and a ranged character still dies to what reaches him.",
    },
    { skill: "bash", points: 1, role: "prerequisite", note: "Double Swing's prerequisite, and the head of the chain this build levels through." },
    { skill: "stun", points: 1, role: "prerequisite", note: "Concentrate's prerequisite, which is Berserk's." },
    { skill: "concentrate", points: 1, role: "prerequisite", note: "Berserk's prerequisite. Also the melee swing to use if something closes and you have to fight it." },
    { skill: "berserk", points: 1, role: "utility", note: "One point in the core and fifteen in its package. It is the only route this build has to magic damage, and it means swapping to a melee weapon to use it — which is a real cost on a character built around two throwing weapons." },
    { skill: "howl", points: 1, role: "prerequisite", note: "Shout's and Taunt's prerequisite, and a genuine panic button for a character with no shield." },
    { skill: "shout", points: 1, role: "utility", note: "Party defence, and 5 seconds per hard point onto Battle Orders' duration." },
    { skill: "battle-command", points: 1, role: "utility", note: "+1 to all skills, flat at every level. Cast it first: Battle Command, Battle Orders, Shout, then heal." },
    { skill: "taunt", points: 1, role: "utility", note: "Battle Cry's prerequisite, and better on this build than on most: pulling one monster out of a pack towards you, at range, is how a thrower picks its fights." },
    { skill: "battle-cry", points: 1, role: "utility", note: "Enemy defence −50% and 2% more per level, and enemy damage down with it. Fifteen points in its package." },
    { skill: "find-potion", points: 1, role: "utility", note: "Find Item's prerequisite, and 5% per hard point onto Grim Ward's debuff." },
    { skill: "find-item", points: 1, role: "utility", note: "A second drop roll off a corpse, and Grim Ward's prerequisite." },
    { skill: "grim-ward", points: 1, role: "utility", note: "The slow is what matters here. A thrower's whole problem is things reaching him, and a field that cuts movement by up to 75% is the cheapest answer on the bar." },
    { skill: "increased-stamina", points: 1, role: "prerequisite", note: "Increased Speed's prerequisite." },
    { skill: "increased-speed", points: 1, role: "utility", note: "Always-on run speed. A thrower kites, and kiting is running." },
    { skill: "iron-skin", points: 1, role: "prerequisite", note: "Natural Resistance's prerequisite." },
    { skill: "natural-resistance", points: 1, role: "utility", note: "All four resistances, added before the cap, with no shield to help." },
  ],
  skillPackages: [
    {
      id: "the-last-fourteen",
      name: "The last fourteen points",
      choose: "one",
      intro:
        "The core is 96 and closes every prerequisite. The remaining fourteen answer one of the build's two real problems: it deals only physical damage, or it has nothing to do when something closes the distance. Both cost the same and only one is affordable.",
      packages: [
        {
          id: "berserk",
          name: "Berserk — the melee swap",
          when: "You solo without a Bone Break and want an answer to a physical immune that does not depend on an item.",
          tradeoff: "Battle Cry stays at one point, so enemy defence stays high and your attack rating has to carry the whole hit chance.",
          skills: [
            { skill: "berserk", points: 15, role: "main", note: "All of its damage is delivered as magic, so a physical immune takes the whole of it. **The cost is the weapon swap**: Berserk is a melee attack and your hands are full of throwing weapons, so this means a second weapon set and a real pause in the middle of a fight. It is worth it because the alternative is walking away." },
          ],
          rotationNote:
            "Double Throw for everything. On a physical immune, swap to the melee set, Battle Cry it, and Berserk it down. Swap back before the next pack.",
          contentNote: "Solo Hell, the Pit, Chaos Sanctuary — anywhere immunes appear and no charm covers them.",
          remainderNote: "Nothing is left over. 96 + 14 = 110.",
        },
        {
          id: "battle-cry",
          name: "Battle Cry — defence at range",
          when: "You carry a Bone Break, or you play in a party where somebody else breaks immunities.",
          tradeoff: "Berserk stays at one point, which is not enough to kill a physical immune in any reasonable time.",
          skills: [
            { skill: "battle-cry", points: 15, role: "utility", note: "−50% enemy defence and 2% more per level — −78% at fifteen — plus the same reduction to their damage. On a build whose attack rating is spread across two thrown weapons, halving the number it is checked against is worth more than any attack-rating item, and it lands on a whole pack at once from a safe distance." },
          ],
          rotationNote:
            "Battle Cry into the pack, then throw. The damage reduction is the half that keeps you alive when something does reach you.",
          contentNote: "Party play, Terror Zones, and dense areas where the debuff lands on many things at once.",
          remainderNote: "Nothing is left over. 96 + 14 = 110.",
        },
      ],
    },
  ],
  flexPoints: [
    "**There are none.** The core is 96 and either package is exactly 14, so a level-99 sheet reads 110 spent with nothing unassigned.",
    "Below 99 the order is Double Throw, Throwing Mastery, Double Swing, then Battle Orders, then the package. The mastery comes second rather than third because its no-consume chance is what makes the build playable at all.",
    "The one point in Berserk should come early even if you intend the Battle Cry package. It is the difference between walking away from an immune pack and killing it slowly.",
  ],
  stats: {
    strength: "Enough for both throwing weapons and the body armour. Throwing bases are light, so this is usually the smallest Strength requirement of the six builds.",
    dexterity: "Enough for both weapons, and **nothing beyond that** — there is no shield on this build at any tier, so Dexterity never buys block. Some throwing bases do have real Dexterity requirements, so check both hands.",
    vitality: "Everything else. A ranged character still needs the life, because the thing that kills a thrower is the thing that reached him.",
    energy: "None. Double Throw costs 1 mana.",
    notes: [
      "**No shield at any tier**, so there is no block number to reach and no Dexterity beyond the weapon requirements. The Whirlwind and Berserk plans both hold one and both block at full effectiveness — a whirling Barbarian loses no block at all — and that is precisely the option this build gives up.",
      "Two weapons means two requirement sets, and on throwing bases they are frequently different from each other.",
      "Faster Run/Walk is worth more here than on any other Barbarian page, because kiting is the defensive plan.",
    ],
  },
  breakpoints: [
    { stat: "fhr", value: 48, frames: 5, why: "Five frames on the table shared with the Paladin and the Assassin. A thrower with no shield who gets hit is a thrower who has already lost the spacing; recovering fast is how you get it back.", priority: "required" },
    { stat: "fhr", value: 86, frames: 4, why: "Four frames. Worth it on a build with no block to fall back on.", priority: "recommended" },
    { stat: "fcr", value: 63, frames: 9, why: "Only with an Enigma. Teleport is repositioning rather than travel here — a thrower who can leave a closed distance instantly is a different character.", priority: "luxury" },
  ],
  breakpointNotes:
    "**No attack-speed row and no block row.** No attack speed because frames depend on the weapon's base speed and the skill, so no single percentage is correct for a class — and this build throws two different weapons, which makes a class-wide number worse than useless. No block row because Double Throw requires a throwing weapon in each hand: there is no shield at any tier, so Faster Block Rate is not a stat this build can have. Chase Increased Attack Speed continuously — it is the largest single damage multiplier available to a thrower — and prefer the faster of two otherwise-equal bases.",
  gearSets: [
    {
      tier: "starter",
      goal: "Two throwing weapons and Throwing Mastery underway. Before that the build does not function, because you will run out of ammunition.",
      levelRange: [1, 40],
      slots: [
        { slot: "weapon", picks: [{ label: "Any magic or rare throwing axe or throwing knife with Increased Attack Speed", why: "**A label rather than a link: this site catalogues no throwing weapon a Barbarian can equip.** At this tier the base matters less than having two of them and a few points in the mastery." }] },
        { slot: "offhand", picks: [{ label: "A second throwing weapon — it need not match the first", why: "Double Throw explicitly throws two *different* weapons, so unlike Frenzy there is no matched-pair rule here." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to all skills in any 2-socket helm.", sockets: "Ort + Sol." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "+25% faster run/walk and +25% hit recovery. Kiting is the defensive plan and this is the cheapest way to do it." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "**+33% Piercing Attack at level 32**, and pierce is the stat that turns one throw into a line of hits. It stacks with the mastery's own pierce and it is the single most build-defining item available this early." }] },
        { slot: "boots", picks: [{ label: "Any rare or magic boots with Faster Run/Walk and resistances", why: "Spacing is survival." }] },
        { slot: "gloves", picks: [{ label: "Rare or magic gloves with 20% Increased Attack Speed", why: "Attack speed is the largest damage multiplier a thrower has." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Attack rating, which fails before damage does." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with attack rating and resistances", why: "Two thrown weapons means two chances to miss." }] },
        { slot: "amulet", picks: [{ label: "A rare or magic amulet with +2 Barbarian skills", why: "+2 skills is +2 Double Throw and +2 mastery at once." }] },
      ],
      charms: [{ label: "Small charms with life and resistances", why: "Nothing exotic exists yet." }],
      nextUpgrade: "Throwing Mastery to a level where the no-consume chance is real, and a pair of elite throwing bases.",
    },
    {
      tier: "nightmare",
      goal: "The mastery's no-consume chance high enough that ammunition stops mattering, and enough resistance to enter Hell.",
      levelRange: [40, 65],
      slots: [
        { slot: "weapon", picks: [{ label: "Lacerator (Winged Axe) — a label, not a link", why: "The classic thrower unique: it casts Amplify Damage on striking, which is a physical-resistance reduction on the damage type this build deals. **Its stat lines are not quoted here because the item is not catalogued on this site.**" }, { label: "A rare Winged Axe or Winged Knife with Increased Attack Speed and Replenish Quantity", why: "Frequently better than the uniques, and a rare with attack speed and its own replenish stacks with the mastery's." }] },
        { slot: "offhand", picks: [{ label: "Warshrike (Winged Knife) — a label, not a link", why: "The other classic thrower unique, and the one built around piercing. Uncatalogued here, so its lines are described rather than quoted." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+2 Barbarian skills and +2 Combat Skills — and unlike the War Cry page, **both halves land here**: Double Throw and Double Swing are both Combat Skills, so this is +4 to the primary and +4 to its synergy." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "+45% Increased Attack Speed at level 43, and attack speed is this build's best damage stat." }, { ref: { kind: "runeword", slug: "lionheart" }, why: "The resistances and Strength instead, if the second weapon's requirement is what is blocking you." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "Still the belt. Pierce does not stop being the build's defining stat." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and flat damage at level 42 — and the flat damage applies to a thrown weapon like any other." }, { ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow instead, which works at range and is the better choice against single elites." }] },
        { slot: "gloves", picks: [{ label: "Crafted Blood gloves with 20% Increased Attack Speed", why: "Attack speed, and the life steal works at range like any other on-hit effect." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating. Being chilled ruins the spacing a thrower depends on." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with attack rating, life and resistances", why: "Still the constraint." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "atmas-scarab" }, why: "Amplify Damage on striking is −100% physical resistance, and this build's damage is entirely physical. It triggers on a thrown hit like any other." }] },
      ],
      charms: [{ label: "Combat Skills grand charms, and life/resistance small charms", why: "A Combat Skills skiller raises Double Throw and Double Swing together." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders above your own level. The swap is also where a melee weapon lives if you take the Berserk package." }],
      nextUpgrade: "Elite throwing bases, and the pierce total that makes a line of monsters one throw.",
    },
    {
      tier: "early-hell",
      goal: "Enough pierce that a throw hits three things, enough resistance to survive what closes, and the mastery finished.",
      levelRange: [65, 75],
      slots: [
        { slot: "weapon", picks: [{ label: "Gimmershred (Flying Axe) — a label, not a link", why: "The elemental thrower unique. Its fire, lightning and cold damage is the one route this build has to damage that is not physical *without* swapping to melee — which makes it worth considering even against the Berserk package. Uncatalogued here, so no lines are quoted." }, { label: "Lacerator (Winged Axe)", why: "Amplify Damage on striking, on a build that deals physical damage. Still excellent." }] },
        { slot: "offhand", picks: [{ label: "Warshrike (Winged Knife), or a rare elite throwing weapon", why: "The two hands do not need to match, so the correct off-hand is simply the best throwing weapon you own that is not in the main hand." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+4 to the primary and its synergy, plus 30% faster hit recovery and +30 all resistances." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% enhanced damage, which applies to a thrown weapon exactly as it does to a swung one." }, { ref: { kind: "runeword", slug: "treachery" }, why: "The attack speed instead, when the damage is already sufficient and the throw rate is not." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "+33% pierce. There is no substitute and there is no tier at which it stops being correct." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike and Open Wounds, all of which work at range." }] },
        { slot: "gloves", picks: [{ label: "Crafted Blood gloves with 20% Increased Attack Speed and life stolen per hit", why: "Life steal works from a thrown weapon like any other on-hit effect. **Dracul's Grasp requires level 76**, past this tier's band, and takes over in the next one." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "A second, for the attack rating two thrown weapons need." }, { ref: { kind: "unique", slug: "stone-of-jordan" }, why: "The +1 skill instead, once attack rating is handled." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 all skills, 20% Increased Attack Speed and Deadly Strike — three stats this build wants, in one slot." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Magic find and gold in one grand charm." }, { label: "Combat Skills skillers and life/resistance small charms", why: "Each skiller raises Double Throw and Double Swing together." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "The shouts, and the melee set if you took Berserk." }],
      nextUpgrade: "Enigma, which on this build is repositioning rather than travel.",
    },
    {
      tier: "budget",
      goal: "A finished Hell thrower: pierce, attack speed, and the ability to leave any distance that gets closed.",
      levelRange: [75, 85],
      slots: [
        { slot: "weapon", picks: [{ label: "Gimmershred (Flying Axe) or Lacerator (Winged Axe) — labels, not links", why: "The two elite thrower uniques, and the choice between them is elemental damage or Amplify Damage. Neither is catalogued on this site, so neither is linked and neither has its lines quoted." }] },
        { slot: "offhand", picks: [{ label: "The best throwing weapon you own that is not in the main hand", why: "Two different weapons is what the skill throws, so there is no pair to complete." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+4 to the primary and its synergy." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "**Teleport, used defensively.** Every other Barbarian takes Enigma to arrive; this one takes it to leave. A thrower whose spacing has been closed can restore it instantly, which is the single largest survivability upgrade the build has.", sockets: "Jah + Ith + Ber." }, { ref: { kind: "runeword", slug: "fortitude" }, why: "The damage instead, if the runes are not there." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "Pierce." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow at range." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap from a thrown weapon." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "The second." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Skills, attack speed and Deadly Strike." }, { ref: { kind: "unique", slug: "metalgrid" }, why: "+400-450 attack rating and +25-35 all resistances, when hit chance is what is failing." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Magic find and gold." }, { ref: { kind: "unique", slug: "bone-break" }, why: "**The physical Sunder Charm, and on this build it is what makes the Battle Cry package viable** — it answers immunity without the melee swap." }, { label: "Combat Skills skillers, Annihilus, Hellfire Torch", why: "The Torch is +3 Barbarian skills, which raises the primary, its synergy and the mastery together." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "The shouts, and the melee weapon for the Berserk package." }],
      nextUpgrade: "Perfect throwing bases, and the last of the attack speed.",
    },
    {
      tier: "optimized",
      goal: "Maximum pierce and throw rate, with Teleport to keep the distance the build depends on.",
      levelRange: [85, 95],
      slots: [
        { slot: "weapon", picks: [{ label: "Gimmershred (Flying Axe) — a label, not a link", why: "The elemental lines are the closest this build gets to a second damage type without giving up the range." }] },
        { slot: "offhand", picks: [{ label: "Lacerator (Winged Axe) or a perfect rare elite throwing weapon", why: "Amplify Damage on striking in the second hand, or whichever rare rolls better attack speed and damage." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+4 to the two skills that matter." }, { ref: { kind: "unique", slug: "crown-of-ages" }, why: "30% damage reduction and two sockets, for a build with no shield to provide any." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, defensively." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "Pierce, still, at every tier." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Freeze immunity and attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "The second." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "The attack speed is what makes this beat Metalgrid on a finished character." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Find and gold." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The physical Sunder, which frees the package for Battle Cry." }, { label: "Combat Skills skillers, Annihilus, Hellfire Torch", why: "Three skills raised per point of +skills." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "The shouts." }],
      nextUpgrade: "Ethereal throwing bases, which do not lose durability because they are thrown rather than swung.",
    },
    {
      tier: "bis",
      goal: "Nothing left to buy. Maximum pierce, maximum throw rate, and a distance that cannot be closed.",
      levelRange: [90, 99],
      slots: [
        { slot: "weapon", picks: [{ label: "A perfect Gimmershred (Flying Axe) — a label, not a link", why: "The elemental damage, at the top of its rolls." }] },
        { slot: "offhand", picks: [{ label: "A perfect Lacerator (Winged Axe), or the best rare elite throwing weapon in the game", why: "Two different weapons is the skill's own requirement, so the best pair is simply the best two." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "Upgraded, with a perfect life-steal roll." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, in the lightest base your Strength allows." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "+33% pierce, and there is still no substitute." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Upgraded." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap from range." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "A 250 attack rating roll." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "The second 250." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Skills, attack speed and Deadly Strike at the top rolls." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "40% magic find at the top roll." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The physical Sunder Charm." }, { label: "Combat Skills skillers, a maximum Annihilus, a maximum Hellfire Torch", why: "Every +1 raises Double Throw, Double Swing and Throwing Mastery at once." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "A level 6 Battle Orders from a slot you do not throw from." }],
      notes: "**Every weapon and off-hand pick on this page is a label rather than a link, at every tier.** This site catalogues no throwing weapon a Barbarian can equip: the two javelins it does catalogue, Titan's Revenge and Thunderstroke, are both on the Amazon Javelin item type, which is class-restricted. Their stat lines are described by role rather than quoted, because an uncatalogued item's numbers are not this site's to publish.",
    },
  ],
  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Act 2, Nightmare, Might** — his aura raises physical damage, and unlike the War Cry page this build's damage *is* weapon damage, so it applies in full. He also does something for this build that he does for no other Barbarian: he is the front line. A thrower's plan is that the mercenary is between him and everything else, so gear him to survive rather than to kill — a Fortitude, a Vampire Gaze, and Insight for the aura more than for the mana, since Double Throw costs one. **The Reaper's Toll is the standout here**: Decrepify on striking is −50% enemy physical resistance *and* a slow, and a slowed monster is a monster that does not reach you. On a build whose defensive plan is distance, an aura or a proc that preserves distance is worth more than one that adds damage.",
  farming: [
    { area: "pit", difficulty: "hell", why: "Area level 85, and a corridor-shaped area is exactly what a piercing line attack wants. Its physical immunes are the build's one wall — bring the Bone Break or the Berserk package.", minTier: "early-hell", rating: 4 },
    { area: "chaos-sanctuary", difficulty: "hell", why: "The seal bosses die to single-target damage at range, and the Oblivion Knights cannot curse what they cannot reach, which makes it one of the safest places this build runs. **It records physical immunity**, though, and a physical-only thrower answers that with a Bone Break or with the Berserk package's melee swap.", minTier: "budget", rating: 4 },
    { area: "worldstone-keep", difficulty: "hell", why: "Area level 85 and dense, and the long corridors suit pierce. Density is not this build's strength, but the layout is. **It records physical immunity**, which on a physical-only build makes the Bone Break part of the kit rather than a luxury.", minTier: "early-hell", rating: 4 },
    { area: "ancient-tunnels", difficulty: "hell", why: "Area level 85 with no physical immunes among its population, which removes this build's only real obstacle. Short and repeatable.", minTier: "early-hell", rating: 4 },
    { area: "travincal", difficulty: "hell", why: "Three high-value targets you can kill without entering the room they are standing in. A thrower runs Travincal more safely than any melee Barbarian.", minTier: "nightmare", rating: 4 },
    { area: "pindleskin", difficulty: "hell", why: "Area level 83, one target, and single-target damage at range is this build's best case. The shortest run in the game.", minTier: "nightmare", rating: 4 },
  ],
  immunityPlan:
    "**Physical damage only, and the answer costs either fourteen points or a charm slot.** The Berserk package buys a magic attack, but using it means swapping to a melee weapon set — a real interruption on a build whose whole method is distance. A **Bone Break** avoids that entirely: the physical Sunder Charm turns an immune into something merely resistant, and it is why the Battle Cry package exists as a serious alternative rather than a luxury. A mercenary carrying Infinity does the same for a party, and The Reaper's Toll's Decrepify is −50% physical resistance on anything not fully immune. One item on the gear list is a partial third answer: **Gimmershred**, whose fire, lightning and cold damage is the only route this build has to a second damage type *without* giving up the range — which is why it appears above its apparent tier.",
  hardcoreNotes:
    "The safest Barbarian to play badly and one of the harder ones to play well, because the entire defensive plan is a distance you have to maintain by hand. There is no shield, no block, and no defence worth the name — what keeps you alive is that nothing has reached you. So: keep the mercenary alive before yourself, take Increased Speed and Faster Run/Walk seriously rather than as an afterthought, reach the 86% hit-recovery breakpoint rather than 48%, and treat Cannot Be Frozen as mandatory — a chilled thrower loses the spacing and cannot get it back. Grim Ward's slow is the panic button and it is worth pressing early rather than late. Take the Battle Cry package: its enemy damage reduction is a defensive stat, where the Berserk package's answer requires standing still in melee range, which is the last thing this build should ever do.",
  selfFoundNotes:
    "**The hardest of the six to build self-found**, and the reason is the weapon slot rather than the runes. Throwing bases drop rarely, elite throwing bases more rarely still, and you need two of them rather than one — and unlike every other Barbarian build there is no runeword to fall back on, because no runeword in the game goes in a throwing weapon. Razortail, Arreat's Face, Gore Rider and Raven Frost all drop readily and the rest of the list is ordinary. But a self-found thrower is at the mercy of a narrow drop table for the only slot that matters, which is why this page rates solo self-found lowest of the six.",
  levelingPath: {
    summary:
      "**This build needs no respec**, and it is one of only two on the class that does not. Bash feeds Double Swing at 10% a hard point, and Double Swing is Double Throw's prerequisite *and* its synergy at 8% — so the chain you level through is the chain you finish on. The one thing to get right is that the class journey's level-40 respec is for a *melee* mastery, and you want Throwing Mastery: if you are heading here, skip that respec entirely and put the points into the mastery you actually want from level 6.",
    respecAt: "None required. Skip the class journey's level-40 respec rather than spending it — it exists to fix a melee mastery this build never takes.",
  },
  confidence: "verified",
  complete: true,
};
