import type { Build } from "@/lib/types";

/**
 * The Lightning Fury Amazon — the build most players mean by "Javazon".
 *
 * Two facts from the pinned extraction shape this page.
 *
 * **Lightning Fury creates 2 lightning missiles at level 1 and one more per
 * level**, with a target search radius of 15 and no cap in the columns. That is
 * why the skill scales with +skills harder than almost anything in the game,
 * and why the gear list is organised around skill levels rather than around
 * raw damage.
 *
 * **Charged Strike is this build's boss button, not a separate build.** It is
 * maxed here, it takes a 14% damage synergy per level from Lightning Bolt,
 * Lightning Strike and Power Strike — the same three skills Lightning Fury
 * needs — and it shares every gear slot. Splitting it onto its own page would
 * publish the same character twice.
 *
 * The third thing worth stating once: Pierce multiplies Lightning Fury and does
 * nothing at all for Charged Strike. See the Pierce article; the gear notes
 * below say which belt is a clearing item and which is not.
 */
export const lightningFuryAmazon: Build = {
  slug: "lightning-fury-amazon",
  name: "Lightning Fury Amazon",
  classSlug: "amazon",
  summary:
    "One thrown javelin fills a screen with lightning. The fastest area clear in the game, and a boss button on the same bar.",
  damageTypes: ["lightning"],
  primarySkill: "lightning-fury",
  playstyle:
    "You throw a javelin into a crowd and it splits into bolts that seek everything within a radius of fifteen. Pierce is what turns that from good into absurd: the javelin travels through the target it hit, and every enemy it passes releases another full burst. In a dense room you press the button once. Then a boss appears, you walk into melee range and press Charged Strike instead, which fires charged bolts from the spear tip — all of which can land on one target at point-blank range. Two buttons, one gear set, and a Valkyrie holding the front while both happen.",
  strengths: [
    "The fastest clear in the game in dense areas — nothing else empties a Cow Level room in one throw",
    "**Charged Strike is on the same bar and the same gear**, so the build has no boss problem",
    "Scales with +skills more steeply than almost anything: every skill level is another bolt",
    "Real block chance and a Valkyrie, which is more survivability than any caster has",
    "Titan's Revenge refills itself, so the build costs nothing to run once it exists",
  ],
  weaknesses: [
    "Lightning immunity is common in Hell and the build has no mastery to reduce it",
    "**Attack speed cannot be planned from a single number** — the frames depend on the javelin, the skill and whether you are throwing or striking, so this page states it per weapon rather than publishing an Amazon breakpoint",
    "Weak until it has −enemy lightning resistance from somewhere: a Griffon's Eye, a Thunderstroke or an Infinity",
    "Splits attributes three ways, which no caster has to do",
    "Lightning enchanted packs are the thing most likely to kill it, and its own element is what saves it",
  ],
  difficulty: "moderate",
  budget: "high",
  ratings: {
    clearSpeed: 5,
    bossing: 4,
    survivability: 4,
    magicFind: 3,
    terrorZones: 5,
    ubers: 2,
    soloSelfFound: 3,
    players8: 5,
  },

  skills: [
    {
      skill: "lightning-fury",
      points: 20,
      role: "main",
      order: 1,
      note: "**Two bolts at level 1 and one more per level**, with a search radius of 15. The whole build.",
    },
    {
      skill: "charged-strike",
      points: 20,
      role: "main",
      order: 2,
      note: "The single-target half of this character, not a separate build. Bolt count rises every five levels, and all of them can land on one target at point-blank range.",
    },
    {
      skill: "lightning-bolt",
      points: 20,
      role: "synergy",
      order: 3,
      note: "Feeds Lightning Fury at +1% per level and Charged Strike at +14% per level. The best point-for-point spend in the plan.",
    },
    {
      skill: "power-strike",
      points: 20,
      role: "synergy",
      order: 4,
      note: "The same two synergies again. Never pressed after the early levels — it is maxed for what it feeds.",
    },
    {
      skill: "lightning-strike",
      points: 12,
      role: "synergy",
      order: 5,
      note: "Feeds both main skills, and is a usable melee chain in its own right. This is where the remaining points go.",
    },
    { skill: "jab", points: 1, role: "prerequisite", note: "Power Strike's prerequisite, and the physical attack you press at a lightning immune." },
    { skill: "poison-javelin", points: 1, role: "prerequisite", note: "Lightning Bolt's prerequisite. One point, and never pressed." },
    { skill: "plague-javelin", points: 1, role: "prerequisite", note: "Lightning Fury's prerequisite. One point." },
    { skill: "valkyrie", points: 1, role: "utility", note: "She holds the front while you throw. One point plus your +skills is enough." },
    {
      skill: "decoy",
      points: 5,
      role: "utility",
      note: "**Hard points here raise the Valkyrie's life**, which is the reason to spend more than one. Also a body enemies shoot at instead of you.",
    },
    { skill: "evade", points: 1, role: "prerequisite", note: "Valkyrie's prerequisite, and a chance to avoid attacks while moving." },
    { skill: "avoid", points: 1, role: "prerequisite", note: "Evade's prerequisite. A chance to avoid ranged attacks while standing still." },
    { skill: "dodge", points: 1, role: "prerequisite", note: "Avoid's prerequisite, and the melee half of the same passive." },
    { skill: "slow-missiles", points: 1, role: "utility", note: "Decoy's prerequisite, and one of the strongest defensive buttons in the game for one point." },
    { skill: "inner-sight", points: 1, role: "prerequisite", note: "Slow Missiles' prerequisite." },
    {
      skill: "pierce",
      points: 1,
      role: "utility",
      note: "**One point, because a Razortail supplies 33% for a belt slot.** Read the Pierce article before spending more — the chance from gear and from the skill are one pool.",
    },
    { skill: "penetrate", points: 1, role: "prerequisite", note: "Pierce's prerequisite, and attack rating you genuinely need for Charged Strike." },
    { skill: "critical-strike", points: 1, role: "prerequisite", note: "Penetrate's prerequisite. Worth nothing to Charged Strike, which deals no physical damage." },
  ],
  flexPoints: [
    "**The plan spends 109 of the 110 hard points a level 99 character has.** Below level 99 the order above is the order to cut from the bottom: Lightning Strike's twelve points are the flexible block.",
    "**More points in Pierce are usually the wrong answer.** A Razortail is 33% for a belt slot, and the skill's own curve is a diminishing one between 10% and 100%. Get the belt first and re-read your total before spending.",
    "Extra points past Lightning Strike go to **Decoy** — it raises the Valkyrie's life — or to **Critical Strike**, which does nothing for your lightning but everything for the Jab you press at a lightning immune.",
  ],
  stats: {
    strength: "Enough for your gear, and it is a real number here — a Thundergod's Vigor asks 110 and a Stormshield asks 156. Decide the belt and the shield before spending.",
    dexterity: "Enough for maximum block with the shield you have chosen, and enough to hold the javelin. A Thunderstroke asks 151 Dexterity on its own.",
    vitality: "Everything left. The Amazon gets 3 life per point, half again what a Sorceress gets.",
    energy: "None. Mana comes from an Insight mercenary and from leech on the javelin.",
    notes: [
      "**This class pays for three attributes where a caster pays for one.** Strength for the belt and shield, Dexterity for the weapon and for block, Vitality for everything else — and the javelins themselves have high Dexterity requirements.",
      "Maximum block is worth reaching. The Amazon shares the Paladin's block table, so the Dexterity cost is far lower than it would be on a caster.",
      "Do not chase a Stormshield's 156 Strength early. Ancient's Pledge or a Lidless Wall costs a fraction of that and the resistances matter more than the block does before Hell.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 32,
      frames: 7,
      priority: "recommended",
      why: "The Amazon's hit-recovery table is one of the more forgiving in the game, and 32% is the point where it stops costing you a whole throw. Reachable from a Peace armor alone.",
    },
    {
      stat: "fhr",
      value: 52,
      frames: 6,
      priority: "luxury",
      why: "Worth taking if it falls out of the gear you already wanted. Not worth buying on its own.",
    },
    {
      stat: "fbr",
      value: 32,
      frames: 3,
      priority: "recommended",
      why: "The standard target on the Paladin, Amazon and Assassin table. A shield you cannot recover from quickly is a shield that gets you killed while it blocks.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 30, where Lightning Fury exists at all.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any javelin with +Javelin and Spear Skills",
              why: "Vendors in Act 1 and Act 2 sell magic javelins, and a +3 to a javelin skill on one of them is worth more than any damage roll at this level.",
              lookFor: ["+2-3 Javelin and Spear Skills", "Replenishes Quantity"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "Resistances for three Countess runes, in a class that can actually use a shield.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "25% Faster Hit Recovery and 25% Faster Run/Walk at level 17, for two common runes.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "peace" },
                  why: "+2 Amazon skills at level 29, which is the largest single upgrade available before Hell.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills for two runes the Countess drops constantly." }],
        },
      ],
      nextUpgrade:
        "Level 30, and then the two skills that make this a build rather than a character: Lightning Fury and, from 18, Charged Strike.",
      notes:
        "**You are not a Lightning Fury Amazon yet and it is not close.** Lightning Fury unlocks at 30 and Charged Strike at 18, so the first act and a half are Jab and Power Strike. Every point you spend on Power Strike is a synergy you keep, so nothing here is wasted.",
    },

    {
      tier: "nightmare",
      goal: "Both main skills online, and the first real javelin.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "titans-revenge" },
              why: "+2 Amazon skills and +2 more on the Javelin and Spear tab, on a javelin that refills itself. The item this build waits for.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and up to +112 mana in a shield, which is four skill levels of bolts alongside the javelin.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "peace" }, why: "+2 Amazon skills and 20% Faster Hit Recovery for three cheap runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find until something better appears." }],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "razortail" },
              why: "33% Piercing Attack for 20 Strength. On Lightning Fury that multiplies rather than adds.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, plus Dexterity that counts toward block and toward the javelin's requirement." }],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "The cheapest route to 75% before Hell begins." }],
      nextUpgrade: "An Insight for the mercenary, then resistances to 75% before entering Hell.",
      notes:
        "**Attack speed starts mattering here, and it cannot be read off one number.** The frames you get depend on the javelin's own base speed, on whether you are throwing Lightning Fury or striking with Charged Strike, and on the rest of your gear — a Titan's Revenge and a Matriarchal Javelin do not behave the same at the same percentage. Aim at attack speed on the amulet and gloves, and judge it by feel on the weapon you actually hold.",
    },

    {
      tier: "early-hell",
      goal: "Cap resistances and get the first −enemy lightning resistance.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "titans-revenge" },
              why: "Still the right javelin. Replenishes Quantity is what makes a throwing build playable at all.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills, and the block chance the Amazon's table makes cheap.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "stormshield" },
                  why: "35% damage reduction and huge block, at 156 Strength. Take it only once the Strength is paid for.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "peace" },
              why: "+2 Amazon skills, and it costs three runes rather than a fortune.",
              alternatives: [
                { ref: { kind: "unique", slug: "duriels-shell" }, why: "Cannot Be Frozen and heavy resistances if you would rather not hold a Raven Frost." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "harlequin-crest" },
              why: "+2 skills, life per level and 10% damage reduction at only 50 Strength.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "thundergods-vigor" },
              why: "+3 Lightning Fury and +3 Lightning Strike, plus the lightning absorb that keeps you alive inside your own element.",
              alternatives: [
                { ref: { kind: "unique", slug: "razortail" }, why: "Swap back to this for dense clearing — the pierce is worth more than the skills when a room is full." },
              ],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and up to +30 all resistances, which is two problems in one slot." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and Dexterity." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "waterwalk" }, why: "Life, Dexterity toward block, and a raised maximum fire resistance." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "Hold 75% in all four resistances." }],
      nextUpgrade:
        "A Griffon's Eye, or an Infinity for the mercenary. Until one of them exists, lightning immunity decides where you can farm.",
      notes:
        "**This is where the build's one real problem appears.** Lightning immunity is common in Hell and nothing in the Amazon's tree reduces enemy resistance — she has no mastery. Jab is on the bar for exactly this reason, and it is not a joke: a physical attack with a Valkyrie in front of you kills a lightning immune slowly and safely.",
    },

    {
      tier: "budget",
      goal: "−enemy lightning resistance, and the build's real damage.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "titans-revenge" },
              why: "Kept for clearing, because it refills itself.",
              alternatives: [
                {
                  ref: { kind: "unique", slug: "thunderstroke" },
                  why: "−15% enemy lightning resistance and up to +4 Javelin and Spear skills, at the cost of refilling by hand. Many players carry both.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "griffons-eye" },
              why: "**−15-20% enemy lightning resistance**, applied only to targets that are not immune, plus lightning skill damage. The largest single damage upgrade the build makes.",
              lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "+2 skills and block, still unbeaten for the price." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "fortitude" },
              why: "+200% Enhanced Damage and +15 all resistances. The Enhanced Damage does nothing for your bolts, but the defence and resistances do.",
              alternatives: [
                { ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances — the better choice if resistances are what is failing." },
              ],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce for clearing. Swap to Thundergod's Vigor for a boss." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves with 20% Increased Attack Speed",
              why: "The cheapest attack speed on the character, in a slot with no unique worth the space.",
              lookFor: ["20% Increased Attack Speed", "Two resistances"],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and Dexterity." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills, which on this build is another bolt." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find while you clear, and Strength toward the belt." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills, which is three more bolts." },
        { label: "Javelin and Spear skill grand charms", why: "Direct skill levels in the slot with nothing better to do." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders before a fight, on a character who takes hits." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "Infinity on the mercenary. It is the difference between choosing your zones and not having to.",
    },

    {
      tier: "optimized",
      goal: "Infinity, and nothing left that is immune.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "thunderstroke" },
              why: "−15% enemy lightning resistance on top of Griffon's Eye and Infinity. Three sources stack, and this is the one you wield.",
              lookFor: ["+4 Javelin and Spear Skills"],
              alternatives: [
                { ref: { kind: "unique", slug: "titans-revenge" }, why: "Kept on the belt for long clearing sessions, because it refills." },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "griffons-eye" },
              why: "−20% enemy lightning resistance and +15% lightning skill damage, socketed with a lightning facet.",
              sockets: "One lightning Rainbow Facet.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "stormshield" },
              why: "35% damage reduction and the best block in the game, now that the Strength is affordable.",
              alternatives: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Keep it if the two skill levels matter more than the damage reduction." }],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances, which pays for the Griffon's and the Infinity together." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce. Still the clearing belt." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves: 20% Increased Attack Speed, resistances",
              why: "Attack speed and the last resistances at once.",
              lookFor: ["20% Increased Attack Speed", "Two resistances at 20+"],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, Dexterity, attack rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "war-traveler" }, why: "Magic find, or Waterwalk if the life matters more." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Javelin and Spear skill grand charms with life", why: "Bolts and life in the same row." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "A better Griffon's roll, more lightning facets, and skill charms.",
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
              ref: { kind: "unique", slug: "thunderstroke" },
              why: "A +4 Javelin and Spear roll. The clearing javelin stays in the belt for long sessions.",
              lookFor: ["+4 Javelin and Spear Skills", "+200% Enhanced Damage"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "griffons-eye" },
              why: "A −20% and +15% roll with a lightning facet in it.",
              lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Damage reduction and block, socketed with a lightning facet." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport, which changes how the build farms more than any damage upgrade left.",
              alternatives: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "Keep it while resistances are the binding constraint." }],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "razortail" }, why: "33% pierce, still unmatched in the slot for clearing." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves: 20% Increased Attack Speed, two resistances, life",
              why: "The one slot where a craft beats every unique.",
              lookFor: ["20% Increased Attack Speed", "Two resistances at 30+"],
            },
          ],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
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
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { ref: { kind: "unique", slug: "crack-of-the-heavens" }, why: "Carried only where Infinity cannot reach. Read its own page first — the penalty lands on the resistance that keeps you alive." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      notes:
        "Past this point there is only skill level left to buy: better charm rolls, a second lightning facet, and the Torch. **Attack speed is the one thing still worth testing rather than reading** — the frames differ between throwing Lightning Fury and striking with Charged Strike, and between a Ceremonial and a Matriarchal Javelin, so the right total is the one that feels fastest on the weapon you actually hold.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "The Act 2 Desert Mercenary, hired in Nightmare, and the item this build is waiting for is his: an **Infinity**, whose Conviction aura reduces enemy lightning resistance enough to break most naturally occurring lightning immunity. Before that exists, give him an **Insight** for the mana — a javelin Amazon throws constantly and has no Warmth — and a **Fortitude** or **Treachery** with a **Vampire Gaze** to keep him standing. Take **Might** for the physical damage that kills what you cannot touch, or **Holy Freeze** if you would rather nothing reached you at all.",

  farming: [
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "The densest room in the game and nothing in it is lightning immune. One throw clears a screen; this is the zone the build exists for.",
      minTier: "nightmare",
      rating: 5,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Area level 85 and the densest zone in the game, which is what Lightning Fury wants. It also carries lightning immunity among its regular population, so this is a good zone before Infinity and a great one after. Charged Strike handles Diablo without changing gear.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "throne-of-destruction",
      difficulty: "hell",
      why: "Five dense waves in one room, which is the shape Lightning Fury is best against, and Charged Strike kills Baal on the same bar. Lightning immunity is common in the waves, so Jab or an Infinity decides how smooth the run is.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85 and very dense. Lightning immunity appears here, so this is an Infinity zone rather than a starting one.",
      minTier: "optimized",
      rating: 4,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, short, and no boss to fight. It does hold lightning immunes, so before Infinity this is a zone you clear with Jab in the gaps rather than one you clear in one pass.",
      minTier: "early-hell",
      rating: 3,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are lightning immune. Without Infinity this is a Jab zone and not worth your time; with Infinity it is one of the fastest runs in the game.",
      minTier: "optimized",
      rating: 3,
    },
    {
      area: "countess",
      difficulty: "hell",
      why: "Runes for the Infinity you are building. Short, and nothing in the tower meaningfully resists lightning.",
      minTier: "nightmare",
      rating: 3,
    },
  ],

  immunityPlan:
    "Lightning immunity is the build's only real problem and the Amazon has **no mastery to reduce enemy resistance** — the whole answer has to come from gear, from the mercenary, or from a second damage type. In order of what most players actually reach: **Griffon's Eye** gives −15-20% enemy lightning resistance, applied only to targets that are not immune; **Thunderstroke** gives another −15% and stacks with it; **Infinity on the mercenary** is the one that actually breaks immunity, through Conviction, and is what turns Travincal and the Worldstone Keep from bad zones into good ones. Before any of those, the honest answer is **Jab** — one physical attack, on the bar from level 1, with a Valkyrie holding the target while it works. A **Crack of the Heavens** sunder charm is the direct fix and the most expensive of the six to carry: it removes 70 to 90 points of the resistance that protects you from lightning enchanted packs, which are the thing most likely to kill this build.",

  hardcoreNotes:
    "Better than it looks. Real block, a Valkyrie, a Decoy and the Dodge passives make this one of the sturdier characters in the game — and Slow Missiles for one point is close to unfair against Hell's ranged packs. The specific danger is **lightning enchanted**, because your own lightning resistance is what saves you and no aura protects you from it. Take **Thundergod's Vigor** for the raised maximum lightning resistance and the absorb, hold 75% everywhere before Hell, and do not carry a Crack of the Heavens. Prefer Holy Freeze on the mercenary over Might.",

  selfFoundNotes:
    "Genuinely good, up to a point. Peace, Spirit, Lore and Ancient's Pledge are all Countess runes; Titan's Revenge, Harlequin Crest, Mara's Kaleidoscope and Razortail all drop in Hell and none of them is rare. What self-found cannot reach is the −enemy lightning resistance: a Griffon's Eye is a level 76 elite helm and an Infinity is a Ber and a Jah. A self-found Lightning Fury Amazon is a very fast character who farms the Cow Level, the Chaos Sanctuary and the Pit, and presses Jab at the things she cannot hurt. That is a real character, and it is worth saying so rather than pretending the endgame is closer than it is.",

  levelingPath: {
    summary:
      "**Do not try to level as this build.** Lightning Fury unlocks at 30 and Charged Strike at 18, so the first eighteen levels are Jab and Power Strike with whatever javelin a vendor sells. None of it is wasted — Power Strike is a 14% synergy for both of the skills you are heading toward — but the character does not feel like a Javazon until level 30, and it does not feel strong until Lightning Bolt is well into its twenties.",
    respecAt:
      "Usually never. If you levelled with points spread across Impale and Fend, the Den of Evil respec at the start of Nightmare recovers them.",
  },

  confidence: "verified",
  complete: true,
};
