import type { Build } from "@/lib/types";

/**
 * The Summoner Necromancer — the page players arrive at typing "Fishymancer".
 *
 * One page, not five. Fishymancer, Summonmancer, Skeletonmancer, Skelemancer
 * and Skeleton Summoner are the same character; each is a search alias and none
 * is a route. The same decision the Amazon pass made about Javazon and Bowazon,
 * for the same reason — a page per nickname publishes one build several times
 * with its gear advice divided between the copies.
 *
 * WHAT THE SUMMONS RESEARCH CHANGED ABOUT THIS PAGE
 * -------------------------------------------------
 * Two things, and both move points around:
 *
 * 1. **Summons do not take the −40 / −100 difficulty resistance penalty.** The
 *    monster table gives every minion the same resistance values in Normal,
 *    Nightmare and Hell. So Summon Resist is not compensating for anything; it
 *    is a straight addition on a curve whose first point is most of it. One
 *    point, and the argument for twenty disappears entirely.
 * 2. **The Iron Golem persists between games, and four separate things destroy
 *    it** — dying, any other golem, a respec that removes the skill, and the
 *    golem being killed. That is enough to write the section the foundation
 *    pass could not, and enough to make the recommendation "cheap and
 *    replaceable" rather than a runeword.
 *
 * WHY THE PLAN STOPS AT 68 + 6
 * ----------------------------
 * Because that is where it genuinely stops. The core is 65 points and the
 * Decrepify chain is three more; everything past that is a real choice between
 * several worthwhile destinations, and inventing an allocation to reach 110
 * would be presenting one reader's taste as the plan. `flexPoints` names the
 * destinations and what each buys instead.
 */
export const summonerNecromancer: Build = {
  slug: "summoner-necromancer",
  name: "Summoner Necromancer",
  classSlug: "necromancer",
  summary:
    "Eight skeletons, eight mages and a golem do the killing, and Corpse Explosion turns the first body into the rest of the room. The most self-sufficient character in the game.",
  damageTypes: ["physical", "fire"],
  primarySkill: "raise-skeleton",
  playstyle:
    "You find one corpse, raise eight skeletons and eight mages from it and the pack it came out of, and then you stop being the thing that kills. Your job becomes positioning: walk in, cast Amplify Damage on whatever the army has reached, and detonate the first body that drops. Corpse Explosion chains through the pack, each explosion leaving corpses for the next. When something dangerous appears you cast Decrepify on it instead and it becomes slow, weak and easy to hit. You are never the target and you are never out of bodies, which is why this is the character people finish Hell on when nothing else has worked.",
  strengths: [
    "**The army takes no difficulty resistance penalty.** A skeleton's resistances are the same number in Hell as in Normal — the −40 and −100 apply to you and to your mercenary, and to nothing you summon",
    "Corpse Explosion is half physical and half fire, so one button covers two immunity types and Amplify Damage handles the third",
    "**Genuinely playable from level 1 to 99 with no respec**, and the levelling route is this build rather than a detour",
    "Sixteen minions plus a golem plus a mercenary means you are almost never the thing being attacked",
    "Every core item is cheap. Arm of King Leoric at 36 and a White wand are the whole early gear plan",
  ],
  weaknesses: [
    "**Minion stats are written at creation.** Every level-up and every gear change means unsummoning and rebuilding the army to collect it",
    "**Nothing happens until the first corpse exists**, and producing it is your problem — see the mercenary section, because that is what he is for",
    "Slow. The army walks, it does not teleport, and it has to be collected at every waypoint and stairwell",
    "**Fifteen bosses carry a Prime Evil flag that raises the damage they deal to pets specifically**, so the army melts on exactly the fights it was doing so well before",
    "Corpse Explosion's damage does not scale with skill level — points buy radius, and the damage comes from what you killed",
  ],
  difficulty: "beginner",
  budget: "low",
  ratings: {
    clearSpeed: 4,
    bossing: 3,
    survivability: 5,
    magicFind: 4,
    terrorZones: 4,
    ubers: 1,
    soloSelfFound: 5,
    players8: 4,
  },

  skills: [
    {
      skill: "raise-skeleton",
      points: 20,
      role: "main",
      order: 1,
      note: "**The count is what twenty points buy** — eight skeletons at twenty hard points, and more with +skills, because the count reads the effective level. Their strength comes from Skeleton Mastery rather than from here.",
    },
    {
      skill: "skeleton-mastery",
      points: 20,
      role: "main",
      order: 2,
      note: "**+8 life and +2 damage per level, to skeletons, mages and revives alike.** This is what turns sixteen bodies into an army that survives Hell. It reads the effective level, so a wand with +3 to it is worth three hard points — and it is written at creation, so a new wand does nothing until you re-raise.",
    },
    {
      skill: "corpse-explosion",
      points: 20,
      role: "main",
      order: 3,
      note: "**Points buy radius, not damage.** 8 half squares at one point and 27 at twenty, and the 70–120% band never moves. Radius is what makes it a chain instead of a single cast, and it is worth every one of the twenty.",
    },
    {
      skill: "teeth",
      points: 1,
      role: "prerequisite",
      note: "Corpse Explosion's prerequisite. One point, and you will never cast it.",
    },
    {
      skill: "amplify-damage",
      points: 1,
      role: "utility",
      note: "**−100 to physical damage resistance: the largest physical multiplier in the game, and one point is the whole of it.** Against an immune it is cut to −20, which breaks anything from 100% up to 119% — twice as deep as Decrepify's −10 reaches. Extra points buy radius and duration only.",
    },
    {
      skill: "clay-golem",
      points: 1,
      role: "utility",
      note: "One point. He slows what he hits, he has 25% physical and 50% cold resistance of his own, and he is Golem Mastery's prerequisite. Recasting him is also the cheapest distraction you have.",
    },
    {
      skill: "golem-mastery",
      points: 1,
      role: "utility",
      note: "+20% golem life and +25 attack rating per level, and it reads the effective level. One point here is Summon Resist's prerequisite; more is a legitimate flex destination if the golem is dying.",
    },
    {
      skill: "summon-resist",
      points: 1,
      role: "utility",
      note: "**One point, and the case for more collapsed with the penalty question.** The curve runs 20% toward 75% and is steep only at the start — and because summons take no difficulty penalty, this is an addition rather than a repair. Fire, lightning, cold and poison only; it reaches neither physical nor magic, and it does not reach revives.",
    },
    {
      skill: "weaken",
      points: 1,
      role: "prerequisite",
      note: "On the way to Terror and Decrepify. Useful in its own right against a melee pack, and the first curse you will have.",
    },
    {
      skill: "terror",
      points: 1,
      role: "prerequisite",
      note: "Decrepify's prerequisite. Its duration is one of the two the difficulty divides — 8 seconds in Normal and 2 in Hell — so treat it as a panic button rather than a plan.",
    },
    {
      skill: "decrepify",
      points: 1,
      role: "utility",
      note: "**Decrepify unlocks at level 24**, not 30 — the correction matters, because 24 is also where Summon Resist arrives and a route built around 30 wastes six levels waiting. −50% movement, attack speed, damage dealt and physical resistance, all at once, on the one monster that is about to be a problem.",
    },
    {
      skill: "raise-skeletal-mage",
      points: 1,
      role: "flex",
      note: "A separate cap from the skeletons, so the mages are additional rather than an alternative. Their elemental missiles are the army's answer to a physical immune. One point is a real army; more is a genuine flex destination.",
    },
    {
      skill: "bone-armor",
      points: 1,
      role: "flex",
      note: "A shield that absorbs a flat amount of physical damage and refreshes on recast. One point is worth having on any Necromancer; the points that make it large are Bone Wall's and Bone Prison's.",
    },
    {
      skill: "bone-wall",
      points: 1,
      role: "flex",
      note: "Bone Armor's synergy, and a wall you can drop across a corridor. This is where flex points go if you decide Bone Armor should be a real defence rather than a token one.",
    },
    {
      skill: "blood-golem",
      points: 1,
      role: "flex",
      note: "Only as Iron Golem's prerequisite. He shares his life with you both ways, which is a liability on a character who never wants to take damage — do not summon him deliberately.",
    },
    {
      skill: "iron-golem",
      points: 1,
      role: "flex",
      note: "**Optional, and read the golem section below before spending it.** He persists between games, which is the appeal, and he is destroyed by dying, by any other golem, by a respec and by being killed — which is the price.",
    },
    {
      skill: "revive",
      points: 1,
      role: "flex",
      note: "**One point or none.** The count is the effective level, so +skills alone gives a useful number. Three minutes flat, no refresh, and the clock starts when the monster stands up.",
    },
  ],
  flexPoints: [
    "**The core is 65 points**: Raise Skeleton, Skeleton Mastery and Corpse Explosion at twenty each, plus one each in Amplify Damage, Clay Golem, Golem Mastery, Summon Resist and Teeth. **Three more make it 68** if you take Decrepify, which this page recommends — Weaken and Terror are its prerequisites and both are worth their point anyway.",
    "**Six more are spent above as flex**, on Raise Skeletal Mage, Bone Armor, Bone Wall, and the Blood Golem–Iron Golem–Revive chain. That leaves roughly **36 free at level 99**, and this page does not spend them for you: there are five sensible destinations and no strongest one.",
    "**Raise Skeletal Mage** is the largest single improvement for most players. The mages have their own cap, so every point adds a body rather than replacing one, and their elemental damage is the army's answer to a physical immune.",
    "**Golem Mastery** if the golem keeps dying. +20% life per level compounds, and unlike Summon Resist this curve does not flatten.",
    "**Bone Wall**, which is Bone Armor's cheaper synergy and needs only Bone Armor underneath it. Twenty points turns a token shield into several hundred absorbed damage. **Bone Prison is the same idea and costs a point more than it looks** — it requires Bone Spear as well as Bone Wall and Bone Armor, though the Teeth and Corpse Explosion beneath those are already in the core plan. What it buys for the extra point is a wall you can drop between yourself and something the army has not reached.",
    "**Amplify Damage past one point** buys radius and duration — 3 to 22 and 8 seconds to 65. On a build that curses a pack rather than a monster, a wider curse is a real upgrade even though the −100 never changes.",
    "**Corpse Explosion is the one destination you cannot buy.** It is already at the twenty-point cap in the core, so its remaining radius comes from +skills — a White wand, a Homunculus, an Arm of King Leoric — and never from another point.",
    "**Lower Resist and Life Tap are not in this plan**, and adding either is more expensive than it looks. Lower Resist unlocks at level 30. It needs Iron Maiden and Life Tap underneath it on top of the curse chain the core plan already has, so it is six points of curses before the point that buys the skill. It lowers elemental resistances, and this build's damage is physical and fire — the fire half of Corpse Explosion is the only thing it would help. Take it if you are building around that; do not take it because the tree looks incomplete without it.",
    "**Revive is one point or none, and it is not a requirement.** The count is the effective skill level, so a single point plus +skills already raises a useful group. What it is not is an army: each revive lasts three minutes flat at every level, the clock starts when the monster stands up, and **it cannot be refreshed** — so the group you raised walks off a timer you cannot reset. Summon Resist does not reach them either, so a revive carries whatever resistances its own monster type had. It is a burst of bodies for a hard room, and it costs three prerequisite points to reach: Blood Golem, Iron Golem and Raise Skeletal Mage. Take it if you have points spare and want the option; do not build around it, and do not read it as this build's answer to a fight it has no verified answer for.",
    "**The Iron Golem is optional, and it is the one point on this page that can cost you an item.** He is the only minion that survives you leaving a game — stored with the character and rebuilt when you next enter one — which is what makes him worth considering at all. Everything else about him is a way to lose him: **he is gone when he dies, when your character dies, when you summon any other golem, and when a respec removes your point in the skill.** The item he was made from is consumed at the moment of casting and is not returned by any of those. So if you build one, build it from something **cheap and replaceable** — a spare rare, a low runeword you would not miss. This site does not tell you to feed him a Pride, a Beast, an Infinity or anything else you would mind losing, whatever the aura would do for the army: four of the five ways to lose him are not under your control, and one of them is dying. **And check your respec plans before you cast.** If you are still deciding between this build and Poison Nova or Bone Spear, unsummon the golem deliberately first — a token spent while he is standing takes him and the item with him.",
    "**Uber Tristram is not something this page claims.** Necromancer guides commonly present Iron Maiden, or Iron Maiden with Life Tap, as the class's Uber answer, and often add a plan involving Crushing Blow or a particular revive. This site has not researched that fight, so it does not rate this build as an Uber specialist and does not publish a strategy for it. **Iron Maiden and Life Tap do not make a build Uber capable on their own**, and three of the fifteen monsters carrying the Prime Evil pet-damage flag are standing in that one room — which is the part of the problem an army is worst at. Treat the Ubers rating on this page as \"unverified\" rather than as a measured verdict.",
  ],
  stats: {
    strength: "Enough for your armor and your shield, and no more. A Heirophant Trophy needs 58, which is the largest requirement in the plan.",
    dexterity: "Base. You block with a shrunken head and you never make an attack, so Dexterity buys you nothing this build uses.",
    vitality: "Everything else. You are not being hit often, but the times you are will be the times the army let something through.",
    energy: "None, and this is the one build where that is genuinely arguable. Rebuilding sixteen minions is the most expensive thing you do — but the answer is a mercenary with Insight and a large mana pool from gear, not points, because a point of Energy is 2 mana and a point of Vitality is 2 life.",
    notes: [
      "**Faster Cast Rate matters more here than the numbers suggest.** Raising an army is sixteen casts, and you do it after every level-up and every gear change. A slow cast rate turns a routine rebuild into a chore.",
      "Resistances are your problem, not the army's. Yours drop 40 in Nightmare and 100 in Hell; the minions' do not move at all.",
      "Your mercenary's resistances *are* affected, and gearing him is a separate job from gearing yourself.",
    ],
  },
  breakpoints: [
    {
      stat: "fcr",
      value: 75,
      frames: 10,
      priority: "recommended",
      why: "The realistic Necromancer target. You cast sixteen times to rebuild an army and once per pack for the curse, and 75% is reachable from a Homunculus and one FCR ring without giving anything up.",
    },
    {
      stat: "fcr",
      value: 125,
      frames: 8,
      priority: "luxury",
      why: "Worth reaching if an Enigma is in the plan, because a Summoner with Teleport recalls the whole army instantly and rebuilding becomes fast enough to do casually.",
    },
    {
      stat: "fhr",
      value: 48,
      frames: 6,
      priority: "recommended",
      why: "You stand near the fight to cast curses and detonate corpses. Being locked in hit recovery while the army is elsewhere is the one way this build's player dies.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "An army by level 2, and Corpse Explosion by level 8.",
      levelRange: [1, 35],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any wand with +Raise Skeleton or +Skeleton Mastery",
              why: "Vendor magic wands carry them, and both are counted from the effective level — so a +3 wand at level 10 is worth three hard points you have not spent yet.",
              lookFor: ["+2-3 to Raise Skeleton", "+2-3 to Skeleton Mastery", "+1 Necromancer Skills"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              label: "Any Necromancer shrunken head with +skills",
              why: "A shrunken head is a shield that also carries +Necromancer skills and +to a skill tab. Nothing else in the game puts both in the off-hand.",
              lookFor: ["+2 Necromancer Skills", "+3 to Raise Skeleton", "2 sockets"],
              alternatives: [
                { ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances for three Countess runes if no head has dropped." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Faster cast rate, hit recovery and run speed from level 17, for two runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills, which is a skeleton and a little more Corpse Explosion radius at once." }],
        },
      ],
      nextUpgrade: "Level 36 for an Arm of King Leoric, which is the single largest jump this build makes.",
      notes:
        "**Keep every 2-socket Bone Wand and Grim Wand you find.** They are the normal-tier bases that take a White at level 35, and a plain Wand or Yew Wand does not — those cap at one socket.",
    },

    {
      tier: "nightmare",
      goal: "Two full skill trees raised by gear, and an army that clears Nightmare without help.",
      levelRange: [35, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "arm-of-king-leoric" },
              why: "**+2 to Summoning and +2 to Poison and Bone, plus +3 to Raise Skeleton and +3 to Skeleton Mastery.** Both halves of the build at once, from an item that drops in Nightmare and costs nothing.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "white" },
                  why: "+3 to Poison and Bone and +4 to Skeleton Mastery. More Corpse Explosion radius and stronger skeletons, but nothing for the count — take it if the Arm has not dropped, and keep both.",
                  sockets: "Dol and Io into a 2-socket wand. A Bone Wand or Grim Wand is the cheapest base.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "homunculus" },
              why: "**+2 Necromancer skills, +2 to Curses, All Resistances +40 and +40% block.** Four skill levels and most of a resistance plan in one slot, from level 42.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "splendor" },
                  why: "+1 to All Skills and +10% Faster Cast Rate in a 2-socket shrunken head, which stacks with the head's own +Necromancer skills. Cheaper, and available five levels earlier.",
                  sockets: "Eth and Lum into any 2-socket shield — a shrunken head counts.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "bone" },
              why: "+2 Necromancer skills and +100-150 mana, which is the line that matters: rebuilding an army is the most expensive thing you do.",
              sockets: "Sol, Um, Um into any 3-socket body armor.",
              alternatives: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Until two Um runes are spare." }],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find while nothing better exists." }],
        },
        {
          slot: "amulet",
          picks: [
            {
              label: "Any amulet with +2 Necromancer Skills",
              why: "Two skill levels raise the count, the mastery and the explosion radius together. A rare or magic +2 amulet is cheap and is the last common upgrade before endgame.",
              lookFor: ["+2 Necromancer Skills", "Faster Cast Rate", "Resistances"],
            },
          ],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "Yours, not the army's — you are the one who loses 40 and then 100." }],
      nextUpgrade: "Resistances to 75 before Hell, and a Spirit or a second +2 amulet.",
      notes:
        "**Re-raise the army after every one of these.** Minion stats are written at creation, so a new wand improves the next skeleton and none of the eight already standing.",
    },

    {
      tier: "early-hell",
      goal: "Capped resistances, and an army that holds a Hell room without you.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "white" },
              why: "+3 Poison and Bone and +4 Skeleton Mastery. In Hell the mastery is worth more than the count, and the Poison and Bone tab is Corpse Explosion's radius.",
              alternatives: [{ ref: { kind: "unique", slug: "arm-of-king-leoric" }, why: "Keep it on the swap — the +2 to Summoning is what you re-raise the army with." }],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "homunculus" }, why: "All Resistances +40 covers most of Hell's −100 in one slot, and the +2 to Curses is where Amplify Damage's radius comes from." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "skin-of-the-vipermagi" },
              why: "+1 skills, +30 all resistances and 30% Faster Cast Rate. The standard Hell entry armor for every caster.",
              alternatives: [{ ref: { kind: "runeword", slug: "bone" }, why: "Keep it for the mana if resistances are covered elsewhere." }],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life, mana and magic find, at 50 Strength. Nothing else in the slot competes." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances, which is the two things this build wants from one slot." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "+1 fire skills — which raises Corpse Explosion's effective level, because the game tags the skill as fire — plus 20% Faster Cast Rate and mana regeneration. Read the Corpse Explosion article before assuming it raises the damage: it buys radius." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal on a character who wants neither often and both badly when it happens." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and mana." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster hit recovery, Strength toward the Heirophant Trophy, and poison length reduction. **Marrowwalk** is the other name you will hear here — it is a Necromancer boot with charges and +1-2 Skeleton Mastery, and this site has not catalogued it." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "75% everywhere, for you." }],
      nextUpgrade: "A Call to Arms on the swap, and then the question of whether an Enigma is worth its runes.",
    },

    {
      tier: "budget",
      goal: "Battle Orders on the army, and a mercenary who survives being looked at.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "white" }, why: "Still the best cheap wand. A rare wand with +3 to a summoning skill and +2 Necromancer skills is the upgrade, and it is a trade rather than a find." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "homunculus" }, why: "Skills, resistances and block, and no better shrunken head exists at this budget." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "Skills, resistances and cast rate for nothing." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, and socket it with an Um or a resistance jewel." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Cast rate and a fire skill level toward Corpse Explosion's radius." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 all skills and 20% Faster Cast Rate. Sixteen casts per rebuild is where cast rate earns its slot." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "A rare ring with 10% Faster Cast Rate and resistances",
              why: "The 75% cast-rate breakpoint is usually one ring away, and a rare ring is far cheaper than a second Stone of Jordan.",
              lookFor: ["10% Faster Cast Rate", "All resistances", "Life"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find on a build that clears steadily." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills, attributes and resistances." },
        { label: "Hellfire Torch (Necromancer)", why: "+3 Necromancer skills, which is three skeletons' worth of mastery and more explosion radius." },
        { label: "Summoning skill grand charms", why: "The only charms that raise Raise Skeleton and Skeleton Mastery together." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "**Battle Orders raises the whole army's life, and the snapshot means order matters** — cast it, then raise. An army raised before Battle Orders does not get it." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "An Enigma, which is the only item that changes how this build is played.",
    },

    {
      tier: "optimized",
      goal: "Teleport, and an army that reassembles wherever you land.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "A rare or crafted wand with +3 to a summoning skill and +2 Necromancer Skills",
              why: "The genuine endgame weapon and the only slot where a trade beats a catalogued item. +3 Raise Skeleton or +3 Skeleton Mastery on top of +2 Necromancer skills is five effective levels from one line.",
              lookFor: ["+3 to Raise Skeleton", "+3 to Skeleton Mastery", "+2 Necromancer Skills", "20% Faster Cast Rate"],
              tradeOnly: true,
              alternatives: [{ ref: { kind: "runeword", slug: "white" }, why: "Still excellent, and free." }],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "homunculus" }, why: "Nothing has replaced it. **Boneflame** and **Darkforge Spawn** are the two other Necromancer heads people name here; neither is catalogued on this site." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "**Teleport is what an army costs you, and this buys it back.** Teleporting recalls every minion instantly, so the walking, the waypoint-collecting and the stairwell-gathering all stop. It is the single largest quality-of-life change available to the build.",
              sockets: "Jah, Ith, Ber into any 3-socket body armor.",
              alternatives: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, +65 all resistances and damage reduction, if the Ber is not happening." }],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills and a socket." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Cast rate, and a fire skill level toward radius." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and 20% cast rate." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills, and mana for an Enigma's Teleport." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Hellfire Torch (Necromancer)", why: "+3 Necromancer skills." },
        { label: "Summoning skill grand charms with life", why: "Skills and life in one row." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders before you raise, every time." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "Better charms, and a wand with a fourth useful line.",
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
              label: "A crafted wand: +3 Raise Skeleton, +3 Skeleton Mastery, +2 Necromancer Skills, 20% Faster Cast Rate",
              why: "Eight effective levels across the two skills that matter, from one item. This is the ceiling and it is a trade, not a drop.",
              tradeOnly: true,
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "homunculus" }, why: "Four skill levels, +40 resistances and block. Socket it with two Um runes if resistances are still short." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, and the +0.75 Strength per level that pays for the Heirophant Trophy." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, with an Um in the socket." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "magefist" }, why: "Cast rate and a fire skill level." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, 20% cast rate." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Hellfire Torch (Necromancer)", why: "+3 Necromancer skills." },
        { label: "Summoning skill grand charms with life", why: "The last few effective levels." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, cast before the army rather than after it." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      notes:
        "**This build's ceiling is low and it arrives early**, which is a feature rather than a complaint. Everything past a Homunculus and a good wand is +skills, and +skills raises a curve that is already flat. What an Enigma buys is speed, not power, and it is still the best item on the list.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "**An Act 2 mercenary with Might**, and the reason is not his damage: it is that *something has to produce the first corpse*. Raise Skeleton needs a body and cannot make one, so at the start of every fight in a fresh room you, he, or another player has to kill something first. He is the one who does it reliably, and Might raises the army's physical damage as well as his own — one aura, seventeen fighters.\n\nGive him an **Insight** as soon as a Ral, Tir, Tal and Sol are together. Meditation is what makes rebuilding an army from scratch a non-event rather than a full mana bar. **Fortitude** or **Treachery** with a **Vampire Gaze** keeps him upright.\n\n**His resistances are not the army's.** He takes the full −40 in Nightmare and −100 in Hell, and the minions take neither, so gearing him for resistance is a real job and gearing \"the pets\" for it is not a thing that exists.\n\n**Infinity is an endgame option and not a requirement.** Its Conviction lowers elemental resistance, which helps Corpse Explosion's fire half and the skeletal mages and does nothing at all for the skeletons' physical damage — Amplify Damage is what does that, and it costs one point.",

  farming: [
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85, dense, undead, and quick to reach from the Cold Plains waypoint. Its recorded immunities are poison and cold, neither of which this build deals — and a room of bodies is a room of Corpse Explosion.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "The densest zone in the game, which is the shape Corpse Explosion wants. Physical immunity is recorded here and Amplify Damage is the answer to it; the seal packs stand still while the army arrives.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Thirty seconds a run, and his minions are the corpses. Cold and poison immunity are recorded and neither touches a physical army. The one caution is that he hits hard enough to delete skeletons, so re-raise between runs rather than during.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are fire and lightning immune rather than physical, they stand in a group, and the first one to fall clears the rest. A short run that suits an army better than it suits most casters.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "A herd is exactly what a Corpse Explosion chain is for. Physical immunity is recorded here — Amplify Damage breaks it, and the fire half lands regardless.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85 and the best experience in the game. Four immunities are recorded including physical, so this is the zone that most needs Amplify Damage on the bar and the mages in the army.",
      minTier: "budget",
      rating: 3,
    },
    {
      area: "lower-kurast",
      difficulty: "hell",
      why: "A chest run rather than a killing run, and an army is slow at it. Included because a Summoner can do it safely at a gear level where other builds cannot.",
      minTier: "nightmare",
      rating: 3,
    },
  ],

  immunityPlan:
    "**Physical immunity is the one that matters, and Amplify Damage answers it.** Sixteen skeletons deal physical damage and eight areas in this site's catalogue record physical immunity; the curse cuts 100 points of physical damage resistance, and against an immune the one-fifth rule leaves −20 — enough to break anything from 100% up to 119%. **Decrepify breaks the shallow end of that band too**: its −50 becomes −10, which takes a monster sitting at exactly 100% down to 90%, and stops at 109% where Amplify Damage keeps going. Take Amplify Damage for the immunes because it reaches twice as far, and because it is the one that works without knowing the monster's exact number. **Breaking is not beating**, either: that 100% monster is at 80% under Amplify Damage and 90% under Decrepify, taking the hit rather than shrugging it off.\n\n**Corpse Explosion covers the second type for free.** Half its damage is physical and half is fire, so a physical immune still takes the fire half and a fire immune still takes the physical half. Nothing needs to be spent to get that; it is how the skill is built.\n\n**Skeletal mages are the third answer** and the reason the flex points usually go there. Their damage is elemental and rolled from the skill rather than from the monster row, so they keep working in a room where the skeletons have stopped.\n\nWhat this build does **not** need is Lower Resist. It lowers elemental resistances, and the only elemental damage in the core plan is half of Corpse Explosion. Six points of curse prerequisites to improve half of one skill is a worse trade than another six points of Raise Skeletal Mage.",

  hardcoreNotes:
    "**The best Hardcore character on this site, and it is not close.** You are behind sixteen minions, a golem and a mercenary; you never make an attack; and the army takes no difficulty resistance penalty, so the thing standing between you and the monsters is as strong in Hell as it was in Normal. Reach the 48% hit-recovery target, keep Decrepify on anything that looks dangerous rather than saving it, and treat **Prime Evil bosses as the exception** — Andariel, Duriel, Mephisto, Diablo, Baal and their variants deal raised damage to pets specifically, so the army that has been carrying you will evaporate on exactly those fights. Bring corpses, expect to re-raise mid-fight, and do not walk in ahead of the army.",

  selfFoundNotes:
    "**The strongest solo self-found character in the game.** The entire core plan is skills, Arm of King Leoric drops in Nightmare and is common, White is two Countess-tier runes in a wand that drops in Act 1, and Homunculus is an ordinary Nightmare unique. Nothing in the first four gear tiers is a trade item. The army does the killing, so a bad weapon costs you radius rather than kills, and the difficulty penalty that forces every other class to solve resistances before Hell does not apply to the thing doing your fighting. The one genuine wall is Enigma, and Enigma is a convenience.",

  levelingPath: {
    summary:
      "**This build is its own levelling route and needs no respec at any point.** Raise Skeleton at level 1, Skeleton Mastery at 2, Amplify Damage as soon as a point is spare, Clay Golem at 6, Corpse Explosion as soon as Teeth and level 6 allow, Golem Mastery at 12, and Summon Resist and Decrepify together at 24. Every point spent on the way is a point in the finished plan. The full walkthrough is on the Necromancer levelling page.",
    respecAt:
      "Not needed — but keep a token, and read the Iron Golem section before you spend one. **A respec that removes your point in Iron Golem destroys the golem and the item inside it.**",
  },

  confidence: "verified",
  complete: true,
};
