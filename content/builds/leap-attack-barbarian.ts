import type { Build } from "@/lib/types";

/**
 * The Leap Attack Barbarian.
 *
 * THE COLUMNS THIS PAGE RESTS ON
 * ------------------------------
 * Two of them, and together they make this the largest single hit on the class.
 *
 *   `calc1 = ln34 + skill('Leap'.blvl) * par8`, par3 = 200, par4 = 30, par8 = 10
 *   `MinDam` 10, `MaxDam` 20, bands 4/8/12/16/20 and 8/16/24/32/40
 *   `SrcDam = 128`
 *
 * So it carries the weapon's **full** damage at +200% and 30% more per level —
 * 770% at twenty, against Whirlwind's 125% — *and* a physical range of its own
 * on top, 10-20 at one point and 150-300 at twenty. It is the Blade Fury shape:
 * a weapon share and a published table, and the page has to say both.
 *
 * Its attack rating bonus is `ToHit = 100 / LevToHit = 20`, the largest on the
 * class, which is the other half of why the hit lands.
 *
 * WHY THIS IS A PAGE AND NOT A VARIANT OF BERSERK
 * ----------------------------------------------
 * **Leap is its only synergy**, at 10% per hard point, and no other Barbarian
 * build on this site gives Leap more than one point. Forty points — Leap Attack
 * and Leap both maxed — go somewhere nothing else on the class spends them,
 * which is what separates this from the Berserk plan it otherwise resembles in
 * content.
 *
 * THE ONE IT DOES NOT SHARE WITH THE OTHER COMMITTED ATTACKS
 * ---------------------------------------------------------
 * `interrupt = 1`. Concentrate, Frenzy and Whirlwind all leave that column
 * blank and cannot be interrupted; Leap Attack does not, and can be. On a skill
 * whose whole press is a committed animation that is a real weakness, and the
 * page says so rather than assuming the class's uninterruptible reputation
 * covers it.
 *
 * WHY ATTACK SPEED MATTERS LESS HERE THAN ANYWHERE ELSE ON THE CLASS
 * -----------------------------------------------------------------
 * One press is one landing. The rate is set by the leap rather than by the
 * swing, so raw damage per hit is worth more than another point of Increased
 * Attack Speed — the opposite of the Whirlwind and Frenzy pages, where damage is
 * a function of how many times you hit.
 */
export const leapAttackBarbarian: Build = {
  slug: "leap-attack-barbarian",
  name: "Leap Attack Barbarian",
  classSlug: "barbarian",
  summary:
    "The largest single hit the class has, delivered from across the room. Seven hundred and seventy percent weapon damage, plus a physical range of its own.",
  damageTypes: ["physical", "magic"],
  primarySkill: "leap-attack",
  playstyle:
    "You do not walk to anything. Every engagement starts with a leap that crosses walls, ledges and the pack standing between you and the thing you want dead, and lands as the biggest hit on the class in a radius of seven. Then you leap out, or leap to the next one. It is the highest skill cap of the six because the leap is a commitment — you cannot steer it once pressed, you *can* be interrupted on landing, and a mis-aimed leap puts you in the middle of something you meant to jump past. Played well it never touches the ground between elites; played badly it is a slow melee character with an expensive movement button. Berserk is the second mouse button for physical immunes, and it is also what you press when something survives the landing.",
  strengths: [
    "**The largest single hit on the class** — 770% weapon damage at twenty, plus its own 150-300 physical on top",
    "The largest attack-rating bonus on the class, +100% and 20% more per level, so the hit lands without gear carrying it",
    "Crosses walls and packs: this is a movement skill and an attack in the same press",
    "Area damage in a radius of seven on landing, which no other single-target Barbarian attack has",
    "Its forty points go into Leap and Leap Attack, which nothing else on the class competes for",
  ],
  weaknesses: [
    "**It can be interrupted**, unlike Concentrate, Frenzy and Whirlwind — the three attacks it is otherwise grouped with",
    "One press is one landing, so sustained damage against a single target is poor",
    "The highest skill cap of the six: a mis-aimed leap is a leap into the pack you meant to skip",
    "10 mana a press, the most expensive Barbarian attack there is",
    "Physical damage, and the answer costs one of the two packages",
  ],
  difficulty: "advanced",
  budget: "high",
  ratings: {
    clearSpeed: 3,
    bossing: 3,
    survivability: 4,
    magicFind: 4,
    terrorZones: 3,
    ubers: 2,
    soloSelfFound: 3,
    players8: 3,
  },
  skills: [
    {
      skill: "leap-attack",
      points: 20,
      role: "main",
      order: 1,
      note: "**+200% damage and 30% more per level** — 770% at twenty, where Whirlwind reaches 125% and Berserk 435%. The weapon's full damage is carried and its own physical range lands on top: 10-20 at one point, **150-300 at twenty**. Radius 7 on landing. Attack rating +100% and 20% per level, the largest on the class. It costs 10 mana, the most of any Barbarian attack, and **it can be interrupted** — the column the other committed attacks leave blank, this one fills.",
    },
    {
      skill: "leap",
      points: 20,
      role: "synergy",
      order: 2,
      note: "+10% Leap Attack damage per hard point, and **its only synergy**. No other Barbarian build on this site gives Leap more than one point, which is exactly what makes this a separate page rather than a Berserk variant. It also rolls no attack rating and deals no damage of its own — it is a knockback and a jump, and here it is forty percent of the primary skill's damage.",
    },
    {
      skill: "axe-mastery",
      points: 20,
      role: "main",
      order: 3,
      note: "+28% damage and 5% per level, +40% attack rating and 8% per level, critical strike toward 35%. **Axe rather than Blade for a reason you can check**: of the thirty-two weapon runewords this site catalogues, fourteen accept an axe and thirteen a sword — more elite bases for a build that wants one very large weapon. Swap it if your weapon is something else; the mastery is gated on the item type, not on the build.",
    },
    {
      skill: "battle-orders",
      points: 20,
      role: "utility",
      order: 4,
      note: "+92% maximum life at twenty. Not a Leap Attack synergy — Leap is the only one — so this is here because after the primary, Leap and the mastery there is nothing else worth twenty points, and a character who lands in the middle of packs needs the life.",
    },
    { skill: "bash", points: 1, role: "prerequisite", note: "Stun's prerequisite." },
    { skill: "stun", points: 1, role: "prerequisite", note: "Concentrate's prerequisite." },
    { skill: "concentrate", points: 1, role: "prerequisite", note: "Berserk's prerequisite, and the swing to use when you have landed and cannot leap out — it doubles your defence and cannot be interrupted, which Leap Attack itself cannot say." },
    { skill: "berserk", points: 1, role: "utility", note: "One point in the core and seventeen in its package. All of its damage is magic, so it is the answer to a physical immune — and it is also the button for anything that survived the landing, since a second leap costs 10 mana and a moment you may not have." },
    { skill: "howl", points: 1, role: "prerequisite", note: "Shout's prerequisite, and a genuine escape for a character who has just landed somewhere he should not have." },
    { skill: "shout", points: 1, role: "utility", note: "Party defence, and 5 seconds per hard point onto Battle Orders' duration." },
    { skill: "battle-command", points: 1, role: "utility", note: "+1 to all skills, flat at every level. Cast it first: Battle Command, Battle Orders, Shout, then heal." },
    { skill: "find-potion", points: 1, role: "utility", note: "Find Item's prerequisite, and 5% per hard point onto Grim Ward's debuff." },
    { skill: "find-item", points: 1, role: "utility", note: "A second drop roll off a corpse, and Grim Ward's prerequisite. Seventeen points in its package: a build that leaps between elites is a build that leaves a trail of high-value corpses." },
    { skill: "grim-ward", points: 1, role: "utility", note: "The slow, mostly. A character who commits to a landing wants whatever is around him moving as slowly as possible." },
    { skill: "increased-stamina", points: 1, role: "prerequisite", note: "Increased Speed's prerequisite." },
    { skill: "increased-speed", points: 1, role: "utility", note: "Always-on run speed, for the ground you cover between leaps." },
    { skill: "iron-skin", points: 1, role: "prerequisite", note: "Natural Resistance's prerequisite." },
    { skill: "natural-resistance", points: 1, role: "utility", note: "All four resistances, added before the cap. You land in the middle of things by design." },
  ],
  skillPackages: [
    {
      id: "the-last-sixteen",
      name: "The last sixteen points",
      choose: "one",
      intro:
        "The core is 94 and closes every prerequisite. The remaining sixteen go to the same two places the Berserk page's do, and for the same reason — this build hunts single elites across whole maps, so its choice is between killing what it cannot hurt and taking more from what it kills.",
      packages: [
        {
          id: "berserk",
          name: "Berserk — the immunity answer",
          when: "You solo, you have no Bone Break, and you would rather never leap onto something you cannot damage.",
          tradeoff: "Find Item stays at one point, which costs most of the loot a build that hunts elites would otherwise collect.",
          skills: [
            { skill: "berserk", points: 17, role: "main", note: "All of its damage is delivered as magic, so a physical immune takes the whole of it. On this build it is also the follow-up: you leap in, and whatever is still standing gets Berserked rather than leapt at again. Your defence is zero while it swings — about 1.3 seconds at this level — which matters more here than elsewhere because you are already standing in the pack you landed on." },
          ],
          rotationNote:
            "Leap Attack in, Berserk anything that survives or resists. Concentrate instead of Berserk when the landing went badly and zero defence is unaffordable.",
          contentNote: "Solo Hell, the Pit, Chaos Sanctuary — anywhere an elite pack can turn out to be immune to the only damage the primary skill deals.",
          remainderNote: "Nothing is left over. 94 + 16 = 110.",
        },
        {
          id: "hork",
          name: "Find Item — the elite hunter's second job",
          when: "You carry a Bone Break, or you play where immunities are somebody else's problem, and you want the leaping to pay.",
          tradeoff: "Berserk stays at one point, so a physical immune is a slow fight rather than a quick one.",
          skills: [
            { skill: "find-item", points: 17, role: "utility", note: "A second drop roll off every corpse, with your full Magic Find applied to it. This build leaps from elite to elite across a whole map and leaves exactly the corpses worth rolling — the two halves fit together better here than on any page except Berserk's own." },
          ],
          gearNote: "Magic find becomes worth chasing in the slots that are not carrying damage: War Traveler, Chance Guards and Gheed's Fortune all earn their place once Find Item is real.",
          contentNote: "Any area with champions and uniques spread across it — which is most of Hell, and why this build's own guide calls it a build that farms anywhere.",
          remainderNote: "Nothing is left over. 94 + 16 = 110.",
        },
      ],
    },
  ],
  flexPoints: [
    "**There are none.** The core is 94 and either package is exactly 16, so a level-99 sheet reads 110 spent with nothing unassigned.",
    "Below 99 the order is Leap Attack, Leap, the mastery, then Battle Orders, then the package. Leap second is the part people get wrong: it looks like a movement skill and it is forty percent of your damage.",
    "The single point in Berserk should come early whichever package you intend. Leaping onto a physical immune with no answer is the way this build wastes the most time.",
  ],
  stats: {
    strength: "Enough for one large weapon and the body armour. This build holds a single weapon, so unlike Frenzy and Double Throw there is only one requirement to meet — and it can afford a heavy one.",
    dexterity: "Enough for the weapon, plus maximum block if you hold a shield. A shield is a genuine option here, because the build carries one weapon rather than two.",
    vitality: "Everything else. You land in the middle of packs on purpose.",
    energy: "None. Leap Attack costs 10 mana, the most of any Barbarian attack, and Insight on the mercenary covers it.",
    notes: [
      "**One weapon, so one requirement** — and that is what lets this build carry the heaviest weapon of the six without the Strength problem Frenzy has.",
      "A shield is viable and often correct, which is not true of Frenzy or Double Throw. If you hold one, the block breakpoint is worth reaching.",
      "Prefer damage per hit over attack speed when the two compete. One press is one landing, so the swing rate is not what sets your damage.",
    ],
  },
  breakpoints: [
    { stat: "fhr", value: 48, frames: 5, why: "Five frames on the table shared with the Paladin and the Assassin. **Leap Attack can be interrupted** — the column Concentrate, Frenzy and Whirlwind leave blank, this one fills — so hit recovery matters more here than on any other committed Barbarian attack.", priority: "required" },
    { stat: "fhr", value: 86, frames: 4, why: "Four frames, and worth the slots on a build that lands inside packs by design.", priority: "recommended" },
    { stat: "fbr", value: 42, frames: 4, why: "With a shield, which this build can hold because it carries one weapon. Four frames of block on a character who commits to a landing is a real defensive line.", priority: "recommended" },
    { stat: "fcr", value: 63, frames: 9, why: "Only with an Enigma — and this is the one build where Teleport genuinely competes with the skill it would replace, since Leap Attack is already a gap-closer. Take it for the +1 skills and the Strength more than for the travel.", priority: "luxury" },
  ],
  breakpointNotes:
    "**No attack-speed row, and on this page it matters least of the six.** Frames depend on the weapon's base speed and the skill, so no single percentage is correct for a class and this site publishes none. But the reason to care is weaker here than anywhere: one press is one landing, and the rate is set by the leap rather than by the swing. Where the Whirlwind and Frenzy pages tell you to chase Increased Attack Speed continuously, this one tells you to buy raw damage per hit instead — a slower, larger weapon is usually the better pick, which is the opposite advice and follows from the same fact.",
  gearSets: [
    {
      tier: "starter",
      goal: "Leap Attack on the bar at 18, Leap climbing behind it, and a weapon big enough that one landing means something.",
      levelRange: [1, 40],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "steel" }, why: "Two Countess runes in any sword, axe or mace. At this tier the point is simply to have a weapon whose damage is worth multiplying by 200%.", sockets: "Tir + El in a 2-socket base." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "+43-48% to every resistance at level 21. This build holds one weapon, so a shield is free — take it." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to all skills in any 2-socket helm.", sockets: "Ort + Sol." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Run speed and hit recovery. Hit recovery matters here from the first level, because Leap Attack can be interrupted." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "goldwrap" }, why: "Gold and magic find at level 27, on a build that will end up hunting elites." }] },
        { slot: "boots", picks: [{ label: "Any rare or magic boots with Faster Run/Walk and resistances", why: "The ground between leaps." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "chance-guards" }, why: "Level 15, gold and magic find, and nothing at this tier competes for a build that will take the Find Item package." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Attack rating and magic find." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with attack rating and life", why: "Attack rating is less of a problem here than on any other Barbarian build, but it is not zero yet." }] },
        { slot: "amulet", picks: [{ label: "A rare or magic amulet with +2 Barbarian skills", why: "+2 skills is +2 Leap Attack and +2 Leap — which on this build is +2 to the skill and to its only synergy." }] },
      ],
      charms: [{ label: "Small charms with life and resistances", why: "Nothing exotic exists yet." }],
      nextUpgrade: "Arreat's Face at 42, and a weapon worth leaping with.",
    },
    {
      tier: "nightmare",
      goal: "One large weapon, Arreat's Face, and Leap high enough that the synergy is doing real work.",
      levelRange: [40, 65],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "oath" }, why: "**+210-340% enhanced damage** at level 49 in a 4-socket sword, axe or mace, plus 50% increased attack speed and Prevent Monster Heal. On a build that multiplies one hit, a large enhanced-damage line is worth more than it is anywhere else on the class.", sockets: "Shael + Pul + Mal + Lum. In an axe, if you took Axe Mastery.", alternatives: [{ ref: { kind: "runeword", slug: "kingslayer" }, why: "Level 53 in a 4-socket sword or axe: −25% target defence and Crushing Blow, both of which suit one enormous landing." }, { ref: { kind: "runeword", slug: "crescent-moon" }, why: "Level 47 in a 3-socket axe, sword or polearm, and its −35% enemy lightning resistance does nothing here — take it for the Open Wounds and the cheaper runes only." }] }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "rhyme" }, why: "Cannot Be Frozen, +25 all resistances and magic find at level 29, and no Strength requirement worth the name." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+2 Barbarian skills and +2 Combat Skills — **+4 to Leap Attack and +4 to Leap**, since both are Combat Skills. That is +4 to the primary and to its only synergy from one slot." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "lionheart" }, why: "+30 all resistances, +50 life and +25 Strength, which pays for a heavier weapon." }, { ref: { kind: "runeword", slug: "smoke" }, why: "+50 to all resistances instead, when that is what is failing." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal, and life steal on a 770% hit returns a great deal at once." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike and Open Wounds. Deadly Strike doubling one very large hit is worth more here than on a many-hit build." }, { ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find instead, on the Find Item route." }] },
        { slot: "gloves", picks: [{ label: "Crafted Blood gloves with life steal and attack rating", why: "One press is one landing, so a faster swing buys nothing here — take the steal and the rating instead." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, and a chilled leap is a leap that lands late." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with life, resistances and attack rating", why: "Life first: you land where the monsters are." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "atmas-scarab" }, why: "Amplify Damage on striking is −100% physical resistance, and this build's primary damage is physical. One landing applies it to everything in radius 7." }] },
      ],
      charms: [{ label: "Combat Skills grand charms, and life/resistance small charms", why: "A Combat Skills skiller is +1 Leap Attack and +1 Leap at once — the skill and its only synergy." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders above your own level." }],
      nextUpgrade: "Grief or Death, and the decision about whether to keep the shield.",
    },
    {
      tier: "early-hell",
      goal: "A weapon whose one hit ends an elite, and enough resistance to survive the landing.",
      levelRange: [65, 75],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "**+340-400 flat damage, added after every percentage multiplier** — and this build has the largest multiplier on the class in front of it. In a 5-socket axe if you took Axe Mastery, a Phase Blade if you took Blade.", sockets: "Eth + Tir + Lo + Mal + Ral." }, { ref: { kind: "runeword", slug: "death" }, why: "Level 55 in a 5-socket sword or axe: 100% Crushing Blow on a single enormous hit, plus Chance to cast Glacial Spike on striking. An unusually good fit for one big landing." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "35% damage reduction and the highest block in the game, at level 73. This build can hold a shield and probably should." }, { ref: { kind: "runeword", slug: "rhyme" }, why: "The cheaper shield, with Cannot Be Frozen and magic find." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+4 to Leap Attack and +4 to Leap from one slot." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% enhanced damage, applied to the hit that is already being multiplied by 770%." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "Damage reduction, Vitality and the 10% hit recovery that often reaches five frames — which this build needs more than the other committed attacks do." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and Deadly Strike, both at their best on one very large hit." }] },
        { slot: "gloves", picks: [{ label: "Crafted Blood gloves with life stolen per hit and attack rating", why: "A 770% hit returns a great deal of life at once. **Dracul's Grasp requires level 76**, past this tier's band, and its Life Tap takes over in the next one." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills, and the mana for a 10-cost attack." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 all skills and Deadly Strike that grows with your level — doubling a 770% hit is the largest single damage line available to this build." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Magic find and gold, on a build that leaves elite corpses behind it." }, { label: "Combat Skills skillers and life/resistance small charms", why: "Each skiller raises the primary and its only synergy together." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders above your own level." }],
      nextUpgrade: "Enigma, and the question of whether you still want it.",
    },
    {
      tier: "budget",
      goal: "A finished Hell character that crosses a map elite to elite without touching the ground.",
      levelRange: [75, 85],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "The flat damage after multipliers, in front of the largest multiplier on the class." }, { ref: { kind: "runeword", slug: "death" }, why: "100% Crushing Blow instead — on a single hit that is a quarter of an elite's current life every landing." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Damage reduction and block, both of which survive the landing." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+4 to the skill and +4 to its synergy." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% enhanced damage. **On this build Fortitude usually beats Enigma**, which is not true on any other Barbarian page — Leap Attack is already a gap-closer, so Teleport buys less here than the damage does." }, { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport anyway, for the +1 skills and the Strength, if you would rather have the utility than the damage.", sockets: "Jah + Ith + Ber." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "Damage reduction and the hit-recovery frame." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and Deadly Strike." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on the whole radius." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills and the mana." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Deadly Strike on the biggest hit on the class." }, { ref: { kind: "unique", slug: "metalgrid" }, why: "Attack rating and resistances, though this build needs the first less than any other." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Magic find and gold." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The physical Sunder Charm, and what makes the Find Item package viable — it answers immunity without spending the sixteen points." }, { label: "Combat Skills skillers, Annihilus, Hellfire Torch", why: "The Torch is +3 Barbarian skills, which is +3 Leap Attack and +3 Leap." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "The shouts." }],
      nextUpgrade: "The last of the damage per hit, and perfect Deadly Strike rolls.",
    },
    {
      tier: "optimized",
      goal: "One landing kills an elite pack. Everything after this is rolls.",
      levelRange: [85, 95],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "death" }, why: "100% Crushing Blow and 50% Deadly Strike on the largest single hit in the class. In a 5-socket elite axe." }, { ref: { kind: "runeword", slug: "grief" }, why: "The flat damage instead, which is the higher raw number and the lower ceiling against big life pools." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Damage reduction and block." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+4 to the skill and its synergy." }, { ref: { kind: "unique", slug: "crown-of-ages" }, why: "30% damage reduction and two sockets, for the landings that go wrong." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% enhanced damage." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "15% damage reduction at the top roll." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Upgraded." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Deadly Strike, which doubles the largest hit on the class." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Find and gold." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The physical Sunder, freeing the package for Find Item." }, { label: "Combat Skills skillers, Annihilus, Hellfire Torch", why: "Two skills raised per point of +skills, and they are the only two that matter." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "The shouts." }],
      nextUpgrade: "Ethereal bases, and the decision between Death and Grief on a perfect roll.",
    },
    {
      tier: "bis",
      goal: "Nothing left to buy. One press crosses the room and removes what was standing there.",
      levelRange: [90, 99],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "death" }, why: "In an ethereal elite axe. 100% Crushing Blow on a hit this large is the highest practical damage the class reaches against a single target." }] },
        { slot: "offhand", picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Upgraded, perfect damage reduction." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "Upgraded, with a perfect life-steal roll." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% enhanced damage, in an ethereal base." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "15% damage reduction, 40 Vitality." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Upgraded, for the Crushing Blow and Deadly Strike." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap across the whole landing radius." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and 250 attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills and the mana pool." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Deadly Strike at the top roll, doubling the largest hit the class has." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "40% magic find at the top roll." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The physical Sunder Charm." }, { label: "Combat Skills skillers, a maximum Annihilus, a maximum Hellfire Torch", why: "Every +1 raises Leap Attack and Leap together — the skill and the only synergy it has." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "A level 6 Battle Orders before the run." }],
      notes: "No set items on this list. Immortal King is a Whirlwind budget set and Guillaume's Face is an Uber helm; this build wants raw damage per hit and hit recovery, and the Barbarian sets offer neither well.",
    },
  ],
  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Act 2, Nightmare, Might** — his aura raises physical damage, which is what a 770% multiplier is multiplying. Insight answers the mana, and this is the build that needs it most: 10 mana a press is the highest cost of any Barbarian attack, and a leap you cannot afford is a leap you do not make. **The Reaper's Toll is the strong late choice** for a reason specific to this build: Decrepify on striking is −50% physical resistance, and unlike a many-hit character you get one application per landing, so a mercenary applying it independently is worth more here than on a build that would have applied it itself. He also has to keep up with you, which nothing gears around — expect to out-leap him and to land alone more often than the other five builds do. Keep him alive with a Fortitude and a Vampire Gaze.",
  farming: [
    { area: "pit", difficulty: "hell", why: "Area level 85 and full of champion packs spread across two levels, which is exactly the shape this build crosses fastest. Its physical immunes are the reason the Berserk package exists.", minTier: "early-hell", rating: 4 },
    { area: "worldstone-keep", difficulty: "hell", why: "Three area-level-85 floors of elites, and a build that leaps between them without clearing the trash in between covers them faster than it looks. **It records physical immunity**, which is the worst thing to land on — take the Berserk package or carry a Bone Break before running it.", minTier: "early-hell", rating: 4 },
    { area: "mausoleum", difficulty: "hell", why: "Area level 85 with almost nothing immune to physical in it, which lets the Find Item package be the one you take.", minTier: "early-hell", rating: 4 },
    { area: "ancient-tunnels", difficulty: "hell", why: "Area level 85, no physical immunes in the population, and a compact layout — the friendliest 85 zone this build has.", minTier: "early-hell", rating: 4 },
    { area: "chaos-sanctuary", difficulty: "hell", why: "Leaping between the seals crosses the ground this build is worst at covering on foot. The Oblivion Knights are the hazard, because a landing is a commitment and their curses land on a stationary target — and **it records physical immunity**, which is not something to discover mid-leap.", minTier: "budget", rating: 3 },
    { area: "pindleskin", difficulty: "hell", why: "Area level 83, one target, and one very large hit is a good match — but a single monster is also where a one-press-one-landing build has the least to offer over simply swinging.", minTier: "nightmare", rating: 3 },
  ],
  immunityPlan:
    "**Physical, and this build meets it at the worst possible moment** — you have already committed the leap and landed in the middle of a pack you cannot hurt. So the answer wants to be on the bar before you jump, not bought afterwards. The Berserk package is the direct one: seventeen points of an attack whose damage is entirely magic, and on this build it doubles as the follow-up for anything that survived the landing. The alternative is a **Bone Break**, the physical Sunder Charm, which turns an immune into something merely resistant for a charm slot and frees the sixteen points for Find Item. Atma's Scarab helps against everything not fully immune, and one landing applies its Amplify Damage to the whole radius. Whichever you choose, keep the one core point in Berserk: leaping onto an immune with literally no answer is how this build wastes the most time.",
  hardcoreNotes:
    "**The most dangerous of the six, and the reason is one column.** Leap Attack carries `interrupt = 1` where Concentrate, Frenzy and Whirlwind leave it blank — so unlike the class's other committed attacks, this one can be interrupted, and it puts you in the middle of a pack by design. The leap cannot be cancelled once pressed and cannot be steered. So: hold a shield and reach the block breakpoint, take 86% hit recovery rather than 48%, and treat Concentrate as the real second button rather than Berserk — it doubles defence and cannot be interrupted, which is exactly what you want after a landing that went wrong. Take the Berserk package anyway, because an immune pack you have already landed in is worse than one you can walk away from. And leap *out* as readily as you leap in; the button is a movement skill in both directions and Hardcore players forget the second one.",
  selfFoundNotes:
    "Middling, and for an unusual reason: the build wants one very large weapon rather than two good ones or a specific runeword, so almost any elite axe or sword with a big damage roll gets it working. Oath at level 49 is four common-ish runes and carries it a long way; Arreat's Face, Gore Rider, Raven Frost and Atma's Scarab all drop readily; and the shield line means Ancients' Pledge and Rhyme are both real answers. Grief and Death are the walls, and neither is required — a self-found Leap Attack Barbarian on an Oath axe clears Hell perfectly well, because 770% of a mediocre weapon plus 150-300 of its own is still the largest hit on the class.",
  levelingPath: {
    summary:
      "Follow the class journey to level 40 and respec into this plan. The route serves it well: it already spends a point on Leap at 6 and Leap Attack at 18 as Whirlwind's prerequisites, so the two skills this build maxes are both already on the bar when the respec arrives — you are raising them rather than discovering them.",
    respecAt: "Nightmare Act 4, level 40, after The Fallen Angel. The 47 points come back and go into Leap Attack, Leap and the mastery.",
  },
  confidence: "verified",
  complete: true,
};
