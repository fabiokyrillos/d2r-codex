import type { Build } from "@/lib/types";

/**
 * The Whirlwind Barbarian.
 *
 * THE COLUMN THIS PAGE RESTS ON
 * -----------------------------
 * `calc1 = ln12`, and nothing else. Whirlwind is the only *attack* on the class
 * that neither gives a synergy nor receives one — `synergySourcesOf("whirlwind")`
 * returns an empty list, and no skill in the graph lists it as a source. Twelve
 * of the Barbarian's thirty skills have both lists empty and eleven of those
 * twelve are passives or a corpse skill.
 *
 * That single fact writes the whole point plan. A Sorceress maxing Blizzard
 * spends sixty more points on three synergies; a Whirlwind Barbarian has nothing
 * to spend them on, so the forty-odd points past Whirlwind and its mastery go to
 * Battle Orders and the Warcries — and the page says so plainly rather than
 * leaving a reader to notice the absence and assume the plan is unfinished.
 *
 * WHY FIND POTION IS MAXED IN ONE OF THE PACKAGES
 * ----------------------------------------------
 * Because of Grim Ward, and no guide says so. Grim Ward's fourth aura stat is
 * `-par3 - (skill('Find Potion'.blvl) * par4)` with par3 = 20 and par4 = 5:
 * everything inside the ward takes **+20% more damage, and 5% more per hard
 * point of Find Potion**. Twenty points doubles it.
 *
 * The game does not label that parameter a synergy, so `synergiesFor` correctly
 * draws no edge and the skill page shows none. The relationship is real anyway,
 * and a twenty-point allocation in a level-1 skill is the single most likely
 * thing on this page for a reader to call a mistake — so the allocation note
 * carries the reason, not just the package intro.
 *
 * WHAT THIS PAGE REFUSES TO SAY
 * -----------------------------
 * Whether on-striking procs fire during a whirl. It is not established at any
 * tier this project accepts, and the page says that rather than picking a side.
 *
 * And it does not repeat the 1.1x claim that Whirlwind only takes Increased
 * Attack Speed socketed into the weapon. Patch 2.4.3 states that Whirlwind
 * incorporates attack speed from all equipment, and that while dual wielding the
 * attack frame for each weapon is averaged and rounded up. The breakpoint table
 * here is empty because no per-weapon frame table is sourced — that is a gap in
 * the table, not a licence to print the old myth in its place.
 */
export const whirlwindBarbarian: Build = {
  slug: "whirlwind-barbarian",
  name: "Whirlwind Barbarian",
  classSlug: "barbarian",
  summary:
    "The spin that defines the class: physical damage held through a pack, on the only Barbarian attack that neither feeds a synergy nor receives one.",
  damageTypes: ["physical", "magic"],
  primarySkill: "whirlwind",
  playstyle:
    "You hold the button and move through things rather than clicking at them. Whirlwind travels a path you fix when you press it — you cannot steer mid-spin and you cannot be interrupted, which together make it the least reactive melee skill in the game and the safest to commit with. The rhythm is Battle Cry into the pack to halve its defence, one whirl across the middle, and a second back through whatever is still standing. Berserk is on the other mouse button for anything immune to physical, and it is a different character while it is held: all magic damage, and zero defence. Against a boss you stop whirling entirely and stand still with Berserk, because a spin that passes through one target wastes most of its hits.",
  strengths: [
    "Uninterruptible: being hit does not stop the spin, so there is no hit-recovery spiral to fall into",
    "Hits everything on the path rather than one target, and the path can be chosen to cross a whole pack",
    "The simplest gear plan on the class — no synergy to fund, so every point past the core buys life or mastery",
    "A shield blocks at full effectiveness while whirling; it is run speed that the skill cuts, not block",
    "Battle Orders makes it the tankiest thing in a party and buffs everyone else at the same time",
  ],
  weaknesses: [
    "Whirlwind has no synergies in either direction, so its own damage cannot be raised by skill points at all",
    "Attack rating is the real constraint — its +50% and 5% per level is the smallest bonus of any Barbarian attack",
    "Physical damage into a physical immune, and the answer costs a whole package",
    "No published attack-speed frame table exists for a class whose frames depend on the weapon",
    "Single target is its worst case: a spin that passes through one boss wastes most of its hits",
  ],
  difficulty: "moderate",
  budget: "high",
  ratings: {
    clearSpeed: 4,
    bossing: 2,
    survivability: 5,
    magicFind: 3,
    terrorZones: 4,
    ubers: 2,
    soloSelfFound: 3,
    players8: 4,
  },
  skills: [
    {
      skill: "whirlwind",
      points: 20,
      role: "main",
      order: 1,
      note: "+30% damage at one point and 5% more per level — 125% at twenty, which is a small multiplier by this class's standards. The damage comes from the weapon and the number of hits, not from the bonus. **It has no synergies in either direction**: nothing in the game raises it and it raises nothing, which is why this plan has no skill marked as its synergy. Attack rating is +50% and 5% per level, the smallest on any Barbarian attack. It costs 12.5 mana rather than the 25 the raw column shows, climbing to 22 at twenty.",
    },
    {
      skill: "blade-mastery",
      points: 20,
      role: "main",
      order: 2,
      note: "+28% damage and 5% per level, +40% attack rating and 8% per level, and a critical strike chance climbing toward 35% — ten points above what the Assassin's Claw Mastery reaches. **Swap this for the mastery your weapon actually is.** It is gated on the item type the game calls Swords and Knives; a Grief Phase Blade is a sword and takes it, a Grief Berserker Axe is not and takes Axe Mastery instead.",
    },
    {
      skill: "battle-orders",
      points: 20,
      role: "utility",
      order: 3,
      note: "+35% maximum life at one point and 3% more per level — +92% at twenty, on you, the mercenary and the party. It is the largest single purchase available to any character in the game and it is not a Whirlwind synergy; it is here because there is nothing else worth twenty points.",
    },
    { skill: "bash", points: 1, role: "prerequisite", note: "Stun's prerequisite, and through it Concentrate's and Whirlwind's." },
    { skill: "stun", points: 1, role: "prerequisite", note: "Concentrate's prerequisite. Never pressed on this bar." },
    { skill: "concentrate", points: 1, role: "prerequisite", note: "One of Whirlwind's two prerequisites, and a genuinely useful button: it doubles your defence while it swings and it cannot be interrupted, which is the safer answer when something hits hard enough that Berserk's zero defence is unaffordable." },
    { skill: "leap", points: 1, role: "prerequisite", note: "Leap Attack's prerequisite. Also goes over walls, which is worth the button." },
    { skill: "leap-attack", points: 1, role: "prerequisite", note: "Whirlwind's other prerequisite, and the class's only gap-closer before Enigma." },
    { skill: "howl", points: 1, role: "prerequisite", note: "Shout's prerequisite, and Berserk's synergy at 10% a point if the Berserk package is taken." },
    { skill: "shout", points: 1, role: "utility", note: "+100% defence for the party, and it adds 5 seconds per hard point to Battle Orders' duration. One point is enough for both jobs." },
    { skill: "battle-command", points: 1, role: "utility", note: "+1 to all skills, and it does not scale — the parameter is 1 at every level. Cast it before Battle Orders so the life buff is a level higher." },
    { skill: "taunt", points: 1, role: "prerequisite", note: "Battle Cry's prerequisite." },
    { skill: "battle-cry", points: 1, role: "utility", note: "Enemy defence −50% and 2% more per level. Halving a monster's defence is worth more to this build than any attack-rating item, because attack rating is checked against defence rather than against a threshold." },
    {
      skill: "find-potion",
      points: 1,
      role: "utility",
      note: "One point here in the core, and twenty in the Grim Ward package — **because it scales Grim Ward's debuff, not because of the potions**. Grim Ward makes everything inside it take +20% more damage and 5% more per hard point of Find Potion. The game does not label that a synergy, so no edge is drawn, and the number is real regardless.",
    },
    { skill: "find-item", points: 1, role: "utility", note: "A second drop roll off a corpse, and Grim Ward's prerequisite. One point is worth having on any Barbarian bar." },
    { skill: "grim-ward", points: 1, role: "utility", note: "A totem that terrifies and slows up to 75%, and raises the damage everything inside takes. It stands for 40 seconds and that number does not move with points — the radius and the debuff do." },
    { skill: "increased-stamina", points: 1, role: "prerequisite", note: "Increased Speed's prerequisite." },
    { skill: "increased-speed", points: 1, role: "utility", note: "Always-on run speed on a class with no movement skill. The curve is steep at the start: one point is a large fraction of what twenty gives." },
    { skill: "iron-skin", points: 1, role: "prerequisite", note: "Natural Resistance's prerequisite." },
    { skill: "natural-resistance", points: 1, role: "utility", note: "All four resistances at once, added before the cap. This is the cheapest answer to Hell's −100 that any class has, and it needs no buff kept up." },
  ],
  skillPackages: [
    {
      id: "the-last-thirty-three",
      name: "The last thirty-three points",
      choose: "one",
      intro:
        "The core is 77 points and closes every prerequisite. Whirlwind has no synergy to fund, so what remains is a genuine choice rather than a maxing order: either buy an answer to physical immunes, or buy a debuff that makes everything you already kill die faster. Both cost exactly 33 and only one is affordable.",
      packages: [
        {
          id: "berserk",
          name: "Berserk — the immunity answer",
          when: "You solo, you run areas with physical immunes in them, and you would rather have a second attack than a stronger first one.",
          tradeoff: "You give up Grim Ward's debuff, which means slower kills on everything that is not immune, and less for a party.",
          skills: [
            { skill: "berserk", points: 20, role: "main", note: "**All of its damage is delivered as magic, not part of it.** The weapon's physical damage is carried and converted at 100%, so a physical immune takes it in full and only a magic-resistant monster resists it. +150% damage and 15% per level on top. The cost is that your defence is set to zero while the state is up — about 2.7 seconds at one point, *shrinking* to about 1.3 at twenty, so more points mean less time exposed." },
            { skill: "howl", points: 14, role: "synergy", note: "Berserk's synergy at 10% damage per hard point. Howl is a level-1 skill nobody presses, and on this package it is fourteen points of Berserk's damage." },
          ],
          rotationNote:
            "Whirlwind for everything that dies to it, Berserk held on anything immune to physical and on bosses, where a spin through a single target wastes most of its hits.",
          contentNote: "The Pit, Ancient Tunnels, Chaos Sanctuary — anywhere a physical immune can appear and you have nobody else to break it.",
          remainderNote: "Nothing is left over. 77 + 33 = 110, which is every point a level-99 character has.",
        },
        {
          id: "grim-ward",
          name: "Grim Ward — the damage-taken debuff",
          when: "You play in a party, or you farm dense areas where a mercenary and a totem do more than a second attack button.",
          tradeoff: "Berserk stays at fourteen points instead of twenty, so a physical immune is a slower fight than it needs to be.",
          skills: [
            { skill: "find-potion", points: 20, role: "utility", note: "**Twenty points in a level-1 skill, and it is not for the potions.** Find Potion adds 5% to Grim Ward's enemy-damage-taken debuff per hard point, so a maxed one takes the ward from +20% to +120%. It also adds 1% per point to Find Item's chance, which is the second reason. The game labels neither parameter a synergy, so the skill page draws no edge for either." },
            { skill: "berserk", points: 14, role: "main", note: "Still the immunity answer, just fourteen points of it rather than twenty." },
          ],
          rotationNote:
            "Plant Grim Ward on the first corpse, then whirl inside it. Everything in the field takes over twice the damage and moves at a quarter speed, which is worth more than the six Berserk points you gave up.",
          contentNote: "Travincal, the Worldstone Keep levels, Terror Zones — anywhere the pack is big enough that a field beats a second button.",
          remainderNote: "Nothing is left over. 77 + 33 = 110.",
        },
      ],
    },
  ],
  flexPoints: [
    "**There are none, and that is the plan.** The core is 77 and either package is exactly 33, so the sheet reads 110 spent with nothing unassigned at level 99.",
    "Below level 99 the order is: Whirlwind first, then the mastery, then Battle Orders, then the package. The single points can wait — none of them is doing damage.",
    "If you respec into this from the levelling route, the mastery is the point to re-decide. It is gated on an item type and the weapon you finish with is rarely the one you levelled with.",
  ],
  stats: {
    strength: "Enough for your gear and not one point more. A Grief Phase Blade needs 25; the body armour is what actually sets the number, and Lionheart or a Fortitude on a lighter base moves it.",
    dexterity: "Enough for your weapon, plus enough for maximum block **only if you are holding a shield**. A dual-wielding Barbarian never blocks and every point past the weapon requirement is wasted on him.",
    vitality: "Everything else. Four life per point is the highest in the game, and Battle Orders multiplies whatever you have by nearly two.",
    energy: "None. Whirlwind costs 12.5 mana and Insight on the mercenary covers it forever.",
    notes: [
      "**Work the Strength requirement out before you respec, not after.** The respec token returns skill points and never attribute points, so a body armour you did not plan for is twenty points you cannot get back.",
      "The dual-wield versus shield decision is a stat decision as much as a gear one: the shield costs Dexterity for block and gives back an entire slot of resistance and damage reduction.",
      "Life is the stat that decides Hell. A Barbarian at 3000 life with 50% resistances survives things that kill one at 2000 life with 75%.",
    ],
  },
  breakpoints: [
    { stat: "fhr", value: 48, frames: 5, why: "The Barbarian shares a Faster Hit Recovery table with the Paladin and the Assassin. 48% is five frames, and it is the one breakpoint this build genuinely needs — a spin cannot be interrupted, but everything between spins can.", priority: "required" },
    { stat: "fhr", value: 86, frames: 4, why: "Four frames, and reachable once Fortitude and a Verdungo's are both on. Worth it in Hardcore and optional otherwise.", priority: "recommended" },
    { stat: "fcr", value: 63, frames: 9, why: "Only once an Enigma is on. Teleport is a cast, so it uses the cast-rate table, and 63% is where a Barbarian's teleport stops feeling like a liability.", priority: "recommended" },
    { stat: "fbr", value: 42, frames: 4, why: "Shield variant only. A shield blocks at full effectiveness while you whirl — it is run speed the skill cuts, not block — so the block rate is worth reaching if you are holding one at all.", priority: "luxury" },
  ],
  breakpointNotes:
    "**There is no attack-speed row here and there will not be one.** Increased Attack Speed frames depend on the weapon's base speed and on the skill, so no single percentage is correct for a class — this site says so on the breakpoints page and enforces it. What is safe to state: patch 2.4.3 established that **Whirlwind incorporates attack speed from all equipment**, not only from what is socketed into the weapon, and that while dual wielding the attack frame for each weapon is averaged and rounded up. The older claim that only weapon-socketed speed counts is wrong and still widely repeated. Chase attack speed continuously rather than to a threshold, and prefer the faster of two otherwise-equal bases.",
  gearSets: [
    {
      tier: "starter",
      goal: "The character that comes out of the levelling route: a mastery that matches the weapon, Battle Orders on the bar, and enough resistance to enter Hell.",
      levelRange: [1, 40],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "steel" }, why: "Two of them, one in each hand. +25% attack speed and 50% Open Wounds for two runes the Countess drops, and it fits any sword, axe or mace so the mastery choice is yours.", sockets: "Tir + El in a 2-socket base." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "steel" }, why: "The second one. Whirlwind alternates through both hands." }, { ref: { kind: "runeword", slug: "ancients-pledge" }, why: "The shield line instead: +43-48% to every resistance at level 21 for three runes, which is most of the Nightmare penalty answered before you meet it." }] },
        { slot: "helm", picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to all skills in any 2-socket helm, including a Barbarian helm.", sockets: "Ort + Sol." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "+25% faster run/walk and +25% hit recovery on a class with no movement skill." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "goldwrap" }, why: "Available at 27, and the 10% attack speed is the part that matters here — the gold is a bonus while you are still buying scepters." }] },
        { slot: "boots", picks: [{ label: "Any rare or magic boots with Faster Run/Walk and resistances", why: "Run speed is the stat that makes levelling tolerable, and nothing unique is worth chasing yet." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "chance-guards" }, why: "Level 15, 200% extra gold and 25-40% magic find. There is no damage glove worth having at this tier and the loot compounds." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "nagelring" }, why: "Level 7, attack rating and magic find, and two of them is a real amount of both." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with attack rating and resistances", why: "Attack rating is what fails first on a low-level melee character." }] },
        { slot: "amulet", picks: [{ label: "A rare or magic amulet with +2 Barbarian skills", why: "+2 skills is worth more than any stat line an amulet can roll at this level." }] },
      ],
      charms: [{ label: "Small charms with life and resistances", why: "Nothing more exotic exists yet, and life is the stat that carries you." }],
      nextUpgrade: "Arreat's Face at level 42, and a real weapon.",
    },
    {
      tier: "nightmare",
      goal: "Whirlwind at twenty with a mastery that matches the weapon, and the resistances to walk into Hell without dying to the penalty.",
      levelRange: [40, 65],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "oath" }, why: "Shael Pul Mal Lum at level 49: +210-340% enhanced damage, 50% increased attack speed, and Prevent Monster Heal. Its bases are swords, axes **and** maces, so it fits whichever mastery you settled on — but the guides put it in a sword and take Blade Mastery for it, and a Balrog Blade or Cryptic Sword is the usual choice.", sockets: "Four sockets. The 50% attack speed is the runeword's own 30% plus Shael's 20%, which is why it beats its own column.", alternatives: [{ ref: { kind: "runeword", slug: "passion" }, why: "Level 43, four sockets, +1 to Berserk and +25% attack speed — the cheaper stand-in, and it fits whichever mastery you settled on." }, { ref: { kind: "runeword", slug: "kingslayer" }, why: "Level 53, and its −25% target defence does the same job as Battle Cry from the weapon slot." }] }] },
        { slot: "offhand", picks: [{ label: "A second Oath, or a rare sword with +3 Whirlwind", why: "Whirlwind alternates through both hands and the attack frame is averaged between them, so the slower weapon drags the faster one." }, { ref: { kind: "runeword", slug: "rhyme" }, why: "The shield line: cannot be frozen, +25 all resistances and 25% magic find at level 29. Cannot Be Frozen matters more than it sounds on a skill you commit to." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "**The class's defining helm.** +2 Barbarian skills, +2 Combat Skills on top of that, 30% faster hit recovery, +30 to all resistances and 3-6% life stolen per hit. Level 42, and nothing displaces it until an Enigma changes the maths." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "lionheart" }, why: "+25 Strength, +20 Vitality, +50 life and +30 to all resistances at level 41. The Strength alone often pays the next weapon's requirement." }, { ref: { kind: "runeword", slug: "treachery" }, why: "+45% increased attack speed instead, if your resistances are already handled. On Whirlwind that is real damage, because the damage is a function of how many times it hits." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Physical damage reduction and life steal in one belt, and it drops constantly." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Level 47, and the reason a Barbarian kills things above his listed damage: Crushing Blow is a share of the target's current life, and Whirlwind rolls it on every hit it lands." }, { ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find and flat damage instead, at level 42." }] },
        { slot: "gloves", picks: [{ label: "Rare or crafted gloves with 20% increased attack speed", why: "Attack speed on a skill whose damage is hit count. Blood-crafted gloves add life steal on top." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, +150-250 attack rating and +15-20 Dexterity. Freeze immunity is not optional on a skill you cannot cancel." }] },
        { slot: "ring2", picks: [{ label: "A rare ring with attack rating, life and resistances", why: "Attack rating is still the constraint at this tier." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "atmas-scarab" }, why: "Level 60, and its Amplify Damage on striking is −100% physical resistance on whatever it lands on. On a skill that hits this often it is close to permanent." }] },
      ],
      charms: [{ label: "Combat Skills grand charms, and small charms with life and resistances", why: "A Combat Skills skiller is +1 Whirlwind, which is worth more than any small charm." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Level 57. Battle Orders and Battle Command from the swap, at a higher level than your own points buy — shout, swap back, fight." }],
      nextUpgrade: "Grief and Fortitude, both at level 59, and both a step change.",
    },
    {
      tier: "early-hell",
      goal: "A Hell-capable character: Grief in hand, resistances at the cap, and enough life that a pack is a nuisance rather than a death.",
      levelRange: [65, 75],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "**The weapon this build is built around.** Its +340-400 damage is added after every percentage multiplier in the game, which is why it beats weapons with far larger enhanced-damage lines on a skill that hits many times.", sockets: "Eth + Tir + Lo + Mal + Ral in a Phase Blade — a sword, so Blade Mastery applies." }] },
        { slot: "offhand", picks: [{ label: "A second Grief, or a rare sword with +3 Whirlwind and 40% increased attack speed", why: "The second Grief is the largest single upgrade left. Until then the off-hand should be the faster of what you own, because the attack frame is averaged between the two." }, { ref: { kind: "unique", slug: "stormshield" }, why: "The shield line: 35% damage reduction and the highest block in the game. Level 73." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "Still unbeaten. +2 Barbarian skills and +2 Combat Skills is +4 to Whirlwind from one slot." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% enhanced damage and +200% enhanced defence, and it is the largest damage armour in the game for a physical melee character." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "Level 63: 10-15% damage reduction, +30-40 Vitality and 10% faster hit recovery. The hit recovery is often what reaches the five-frame breakpoint." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike and Open Wounds. All three scale with hit count and Whirlwind is hit count." }] },
        { slot: "gloves", picks: [{ label: "Crafted Blood gloves with 20% increased attack speed and life steal", why: "Life steal is how a melee character survives Hell, and the attack speed is damage." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen is not negotiable on a committed attack." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 to all skills and the mana to use it." }, { label: "A rare ring with life, resistances and attack rating", why: "Cheaper and frequently better than a second unique." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Level 65: +1 to all skills, 20% increased attack speed, and Deadly Strike that grows with your level." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Level 62, and it is the magic find and gold find of three small charms in one grand charm slot." }, { label: "Combat Skills skillers and life/resistance small charms", why: "Skillers are the only charm that raises Whirlwind at all, since no skill point can." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders at a level your own points do not reach." }],
      nextUpgrade: "Enigma, which changes how the build moves more than any damage item changes how it kills.",
    },
    {
      tier: "budget",
      goal: "A finished Hell character with Teleport. This is where the build stops being a melee character who walks and becomes one who arrives.",
      levelRange: [75, 85],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "Still the weapon. Nothing displaces it in the main hand." }] },
        { slot: "offhand", picks: [{ label: "A second Grief Phase Blade", why: "Two Griefs is the dual-wield ceiling until Fury, and the averaged attack frame is at its best when both weapons are identical." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "+4 to Whirlwind from one slot, plus the resistances that let the rest of the gear chase damage." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "**Teleport.** The Barbarian has no movement skill, and this is the item that decides whether he runs a map or crosses it. The +1 to all skills and the Strength are what make the rest of the plan affordable.", sockets: "Jah + Ith + Ber in a 3-socket body armour — a Mage Plate or Archon Plate for the weight." }, { ref: { kind: "runeword", slug: "fortitude" }, why: "If you do not have the runes: far more damage, and you walk." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "Damage reduction, Vitality and the hit recovery that reaches five frames." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow on every hit of a skill that hits constantly." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Level 76: 7-10% life stolen per hit and a Life Tap on striking. Life Tap is the single largest survivability line available to a melee character." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills and the mana Enigma's Teleport spends." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Skills, attack speed and Deadly Strike." }, { ref: { kind: "unique", slug: "metalgrid" }, why: "Level 81, and +400-450 attack rating with +25-35 all resistances answers this build's two real problems in one slot." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "Magic find and gold find in one grand charm." }, { ref: { kind: "unique", slug: "bone-break" }, why: "Level 75. A physical Sunder Charm: it makes physical immunes merely resistant, which is the alternative to spending a package on Berserk." }, { label: "Combat Skills skillers, Annihilus, Hellfire Torch", why: "The Torch is +3 Barbarian skills, which is +3 Whirlwind and +3 mastery at once." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders above your own level." }],
      nextUpgrade: "Fury in the off-hand, and the amulet decision between skills and attack rating.",
    },
    {
      tier: "optimized",
      goal: "The build at full strength: Teleport, two elite weapons, and enough attack rating that Hell's defence values stop mattering.",
      levelRange: [85, 95],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "The flat damage after multipliers is still unmatched on a many-hit skill." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "fury" }, why: "Level 65 in any 3-socket melee weapon: +209% enhanced damage, 66% Open Wounds, 33% Deadly Strike and +40% attack speed. Its **+5 to Frenzy is a dead line on this build** and a live one on the Frenzy page — it is here for the speed and the Deadly Strike." }, { label: "A second Grief Phase Blade", why: "Identical weapons average to the best frame, which sometimes beats Fury's larger numbers." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "Nothing has displaced it in five tiers." }, { ref: { kind: "unique", slug: "crown-of-ages" }, why: "Level 82: two sockets, 30% damage reduction and +1 to all skills. The trade is Arreat's +2 Combat Skills for a socketed helm and a lot of mitigation." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, and it does not become optional at any tier above this one." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "Damage reduction and the hit-recovery frame." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking, which on this attack rate is effectively permanent." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, plus the attack rating." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "A second one, for another 150-250 attack rating — the stat this build is short of." }, { ref: { kind: "unique", slug: "stone-of-jordan" }, why: "The +1 skill instead, if your attack rating is already sufficient." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "metalgrid" }, why: "+400-450 attack rating and +25-35 to all resistances. On a build whose attack bonus is the smallest on the class, this is usually the correct amulet." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "The gold and magic find." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The physical Sunder, if you took the Grim Ward package and have no Berserk to fall back on." }, { label: "Combat Skills skillers, Annihilus, Hellfire Torch", why: "Every +1 to Whirlwind here is a point the skill tree cannot give you, because Whirlwind has no synergy to buy." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Shout, Battle Orders, swap." }],
      nextUpgrade: "Ethereal bases, and the last few points of attack rating.",
    },
    {
      tier: "bis",
      goal: "Nothing left to buy. Two elite runewords, Teleport, and attack rating high enough that the chance to hit is no longer the limit.",
      levelRange: [90, 99],
      slots: [
        { slot: "weapon", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "In an ethereal Phase Blade if you can find one — Phase Blades are indestructible, so ethereal costs nothing." }] },
        { slot: "offhand", picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "The second one. Two identical weapons give the best averaged attack frame and the flat damage applies from both." }, { ref: { kind: "runeword", slug: "fury" }, why: "Open Wounds and Deadly Strike instead, if you would rather have the sustain than the second flat-damage line." }] },
        { slot: "helm", picks: [{ ref: { kind: "unique", slug: "arreats-face" }, why: "Upgraded and with a perfect life-steal roll. The +2 Combat Skills is not available anywhere else on the class." }] },
        { slot: "body", picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, in the lightest base your Strength allows." }] },
        { slot: "belt", picks: [{ ref: { kind: "unique", slug: "verdungos-hearty-cord" }, why: "15% damage reduction and 40 Vitality at the top roll." }] },
        { slot: "boots", picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Upgraded. Crushing Blow does not get better than this on boots." }] },
        { slot: "gloves", picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap, permanently, on a skill that strikes several times a second." }] },
        { slot: "ring1", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "A 250 attack rating roll." }] },
        { slot: "ring2", picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "A second, for the attack rating this build is structurally short of." }] },
        { slot: "amulet", picks: [{ ref: { kind: "unique", slug: "metalgrid" }, why: "The attack rating and the resistances, both at the top of the roll." }] },
      ],
      charms: [{ ref: { kind: "unique", slug: "gheeds-fortune" }, why: "40% magic find and 160% gold at the top roll." }, { ref: { kind: "unique", slug: "bone-break" }, why: "The physical Sunder Charm, which turns the one thing this build cannot kill into something it kills slowly." }, { label: "Combat Skills skillers, a maximum Annihilus, a maximum Hellfire Torch", why: "Skills are the only route to a bigger Whirlwind, because the skill tree offers none." }],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "A level 6 Battle Orders from the swap is worth more life than any body armour." }],
      notes: "Guillaume's Face and the Immortal King set are both worth considering here and neither can be linked: they are set items, and this site has no set registry yet. Guillaume's is 15% Crushing Blow and 35% Deadly Strike on a helm, worn alone; Immortal King is the classic budget Whirlwind loadout that Uniques and runewords outgrow.",
    },
  ],
  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**Act 2, Nightmare, Might.** His aura raises physical damage, which is all of this build's damage in the core plan. Insight in a polearm solves the mana problem permanently and its Meditation aura is worth more than any weapon he could otherwise hold, until you can afford an Infinity — whose Conviction lowers enemy defence as well as resistances, and defence is what this build actually fights. Gear him for survival first: a Fortitude or a Treachery, an Andariel's Visage or a Vampire Gaze, and the Reaper's Toll if you would rather have Decrepify on striking than the mana. **Do not take Defiance**; the defence aura does nothing for a character whose problem is landing hits.",
  farming: [
    { area: "pit", difficulty: "hell", why: "Area level 85, short, dense, and its packs are the ones Whirlwind was designed for. The physical immunes here are why the Berserk package or a Sunder Charm exists.", minTier: "early-hell", rating: 5 },
    { area: "travincal", difficulty: "hell", why: "The Council are three high-value targets standing together, which is exactly one whirl. Grim Ward's debuff is at its best here and Find Item takes a second roll off each corpse.", minTier: "early-hell", rating: 4 },
    { area: "worldstone-keep", difficulty: "hell", why: "Dense, area level 85, and the run to Baal is the standard endgame loop. A whirl across a Worldstone pack is the build at its best.", minTier: "budget", rating: 4 },
    { area: "chaos-sanctuary", difficulty: "hell", why: "Dense and lucrative, but the seal bosses and the Oblivion Knights punish a character who has to stand in melee. Bring the Berserk package.", minTier: "budget", rating: 3 },
    { area: "mausoleum", difficulty: "hell", why: "Area level 85 with almost nothing immune to physical in it, which makes it the friendliest 85 zone this build has.", minTier: "early-hell", rating: 4 },
    { area: "pindleskin", difficulty: "hell", why: "Area level 83 and the shortest run in the game. One target, so Whirlwind is at its worst — Berserk is the button here, not the spin.", minTier: "nightmare", rating: 3 },
  ],
  immunityPlan:
    "**Physical immunity is the only thing that stops this build, and it has three answers.** The cheapest is Berserk: its damage is converted to magic at 100%, so a physical immune takes the whole of it, and one point is enough to make the fight possible even if the Grim Ward package leaves it at fourteen. The second is a Bone Break — the physical Sunder Charm — which makes an immune merely resistant and costs a charm slot rather than a package. The third is Atma's Scarab, whose Amplify Damage on striking is −100% physical resistance and, on a skill that hits this often, close to permanent; note that Amplify Damage cannot break an immunity on its own, only reduce a resistance that is already below 100%. Magic immunity exists and is rare; Concentrate is the physical answer to it and is already in the core at one point.",
  hardcoreNotes:
    "Whirlwind is unusually good in Hardcore for a melee skill because it cannot be interrupted, and unusually dangerous because you cannot cancel it: the path is fixed when you press it and you cannot drink a potion until it ends. Keep the whirls short. Take the Berserk package rather than Grim Ward, because a physical immune you cannot damage is a fight you cannot leave. Reach the 86% hit-recovery breakpoint rather than 48%, hold a shield rather than a second weapon — it blocks at full effectiveness while you whirl — and treat Cannot Be Frozen as mandatory rather than as a nice line on Raven Frost.",
  selfFoundNotes:
    "The core of this build is self-foundable and the top of it is not. Arreat's Face, Gore Rider, String of Ears, Raven Frost and Atma's Scarab all drop readily; Steel, Lore, Lionheart, Treachery and Passion are all runes the Countess gives up. Grief needs a Lo and Enigma needs a Jah and a Ber, which is where an untwinked character stops. A self-found Whirlwind Barbarian is entirely viable on Oath or Passion in a good elite base — the build's damage is the weapon and the hit count, and neither requires a high rune to be respectable.",
  levelingPath: {
    summary: "Level on Bash and Double Swing with a mastery matched to the weapon you can actually buy, take the Warcry spine as it unlocks, and respec once at level 40 into this plan. The respec is about the mastery rather than the attack: a mastery is gated on an item type and the weapon you level with is not the one you finish with.",
    respecAt: "Nightmare Act 4, level 40, after The Fallen Angel — 47 points come back and the Whirlwind opening costs exactly 47.",
  },
  confidence: "verified",
  complete: true,
};
