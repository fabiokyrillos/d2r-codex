import type { Build } from "@/lib/types";

/**
 * The Lightning Strike Amazon — the melee javelin build.
 *
 * The distinction from the Lightning Fury page is mechanical, not editorial,
 * and it comes from `damageModel` on the skills themselves:
 *
 * - **Lightning Strike is `weapon-plus-element`.** The strike rolls against
 *   attack rating and lands the weapon's full damage *plus* the skill's
 *   lightning, and the chain is created separately from the target it hit.
 *   A lightning immune therefore still takes the physical half.
 * - **Charged Strike is `element-only-attack`.** Its stage passes the skill's
 *   empty `SrcDam` straight to the damage allocator, so it contributes none of
 *   the weapon's base physical damage. A lightning immune takes nothing at all.
 *
 * That single difference is why this build carries a physical answer and why
 * its gear list wants Enhanced Damage where the Lightning Fury list does not.
 *
 * Pierce does nothing here. Both skills are melee; nothing leaves the weapon.
 */
export const lightningStrikeAmazon: Build = {
  slug: "lightning-strike-amazon",
  name: "Lightning Strike Amazon",
  classSlug: "amazon",
  summary:
    "A melee javelin that chains lightning between everything nearby, with the game's strongest single-target skill on the same bar.",
  damageTypes: ["lightning", "physical"],
  primarySkill: "lightning-strike",
  playstyle:
    "You fight in melee range with a javelin and a shield. Lightning Strike hits the thing in front of you and starts a chain that jumps between nearby enemies — two jumps at level 1 and one more per level, and it can double back onto a target it already struck, which is why it beats Lightning Fury on spread-out packs. Then Charged Strike for anything that needs to die now: bolts from the spear tip, all of which can land on one target at point-blank range. A Valkyrie holds the front, a Decoy takes the arrows, and your block chance does the rest.",
  strengths: [
    "**Charged Strike is the strongest single-target skill in the game** and this build is built around holding it",
    "Lightning Strike delivers the weapon's damage as well as its own, so a lightning immune still takes something",
    "Melee range with a real shield, a Valkyrie and a Decoy — sturdier than any caster",
    "The chain can double back onto a target it already hit, which suits spread-out packs",
    "No pierce, no projectile, no positioning tax: you hit what is in front of you",
  ],
  weaknesses: [
    "You are in melee range with the smallest health pool of any melee class",
    "**Attack rating is a real constraint** — both skills roll against it, and the Amazon has no Blessed Aim",
    "Charged Strike lands nothing at all on a lightning immune",
    "Clear speed is a fraction of the thrown build's; this is a boss character that clears adequately",
    "**Attack speed has no single number here either** — throwing and striking use different animations, so the target depends on the javelin and the skill",
  ],
  difficulty: "moderate",
  budget: "high",
  ratings: {
    clearSpeed: 3,
    bossing: 5,
    survivability: 4,
    magicFind: 2,
    terrorZones: 3,
    ubers: 2,
    soloSelfFound: 3,
    players8: 4,
  },

  skills: [
    {
      skill: "lightning-strike",
      points: 20,
      role: "main",
      order: 1,
      note: "**Two chain jumps at level 1 and one more per level.** The strike itself lands the weapon's full damage plus the skill's lightning.",
    },
    {
      skill: "charged-strike",
      points: 20,
      role: "main",
      order: 2,
      note: "The boss button. Bolt count rises every five levels and all of them can hit one target at point-blank range.",
    },
    {
      skill: "power-strike",
      points: 20,
      role: "synergy",
      order: 3,
      note: "+14% damage per level to both main skills. Maxed for what it feeds, not for what it does.",
    },
    {
      skill: "lightning-bolt",
      points: 20,
      role: "synergy",
      order: 4,
      note: "The other 14% per level to Charged Strike, and 11% per level to Lightning Strike.",
    },
    {
      skill: "penetrate",
      points: 13,
      role: "utility",
      order: 5,
      note: "**35% attack rating at level 1 and +10% per level.** Both your skills roll against attack rating and the Amazon has no aura to fix it. Hard points here also raise the Valkyrie's.",
    },
    { skill: "jab", points: 1, role: "prerequisite", note: "Power Strike's prerequisite, and the pure physical attack you press at a lightning immune." },
    { skill: "poison-javelin", points: 1, role: "prerequisite", note: "Lightning Bolt's prerequisite. Never pressed." },
    { skill: "plague-javelin", points: 1, role: "prerequisite", note: "Lightning Fury's prerequisite, taken only for the point below it." },
    {
      skill: "lightning-fury",
      points: 1,
      role: "utility",
      note: "**One point, as a thrown clear button.** With your +skills it handles a corridor you would rather not walk into. Maxing it is a different build — see the Lightning Fury page.",
    },
    { skill: "valkyrie", points: 1, role: "utility", note: "She holds the target while you strike it. One point plus +skills." },
    { skill: "decoy", points: 5, role: "utility", note: "Hard points here raise the Valkyrie's life, and a Decoy is what ranged packs shoot at instead of you." },
    { skill: "evade", points: 1, role: "prerequisite", note: "Valkyrie's prerequisite, and avoidance while moving." },
    { skill: "avoid", points: 1, role: "prerequisite", note: "Evade's prerequisite." },
    { skill: "dodge", points: 1, role: "prerequisite", note: "Avoid's prerequisite, and the melee half of the passive — which matters here more than on any other Amazon." },
    { skill: "slow-missiles", points: 1, role: "utility", note: "Decoy's prerequisite, and the best defensive button in the game for one point." },
    { skill: "inner-sight", points: 1, role: "prerequisite", note: "Slow Missiles' prerequisite, and it lowers the defence of everything around you." },
    {
      skill: "critical-strike",
      points: 1,
      role: "prerequisite",
      note: "Penetrate's prerequisite. It doubles **physical** damage, so it helps Lightning Strike's weapon half and does nothing for Charged Strike.",
    },
  ],
  flexPoints: [
    "**The plan spends 109 of 110.** Penetrate is the adjustable block: cut it toward one point if your attack rating is already fine from gear, and spend the difference on Decoy or Critical Strike.",
    "**Do not take Pierce.** Both main skills are melee and nothing leaves the weapon — the chance is wasted. This is the single biggest difference from the thrown build's plan.",
    "**Critical Strike is worth more here than on any other Amazon**, because Lightning Strike carries the weapon's physical damage. If you are running a high-damage javelin, points here are real damage rather than a prerequisite.",
  ],
  stats: {
    strength: "Enough for the shield and belt you have chosen. A Stormshield is 156 and a Thundergod's Vigor is 110.",
    dexterity: "Enough for maximum block, and enough for the javelin — a Thunderstroke asks 151 on its own. This is the build where Dexterity is not optional.",
    vitality: "Everything left, and it is the difference between fighting in melee and dying in it.",
    energy: "None.",
    notes: [
      "**Maximum block matters more here than on any other Amazon**, because this is the only one standing in melee range by design. The Amazon shares the Paladin's block table, so it is affordable.",
      "Dexterity also raises attack rating and the weapon's damage, so unlike on a caster it is never a dead stat here.",
      "Life steal is not a stat you buy with points but it is one you must have. Dracul's Grasp, a Titan's Revenge or an Andariel's Visage — pick at least one before Hell.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 32,
      frames: 7,
      priority: "required",
      why: "A melee character that is stuck in hit recovery is a melee character that is dying. Not optional on this build the way it is on the thrown one.",
    },
    {
      stat: "fhr",
      value: 52,
      frames: 6,
      priority: "recommended",
      why: "Reachable with a Shael in a shield or a Peace armor plus boots, and worth the sockets on a character in melee range.",
    },
    {
      stat: "fbr",
      value: 32,
      frames: 3,
      priority: "required",
      why: "Block is this build's survivability, and blocking locks you in an animation. 32% is where that animation stops being a liability.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Reach level 18 and Charged Strike, then 30 for Lightning Strike.",
      levelRange: [1, 30],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any javelin or spear with +Javelin and Spear Skills",
              why: "A vendor magic javelin with +3 to a skill beats every damage roll you will see before Nightmare.",
              lookFor: ["+2-3 Javelin and Spear Skills"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances for three Countess runes, and a shield you will be blocking with constantly." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "25% Faster Hit Recovery from level 17, which on a melee character is the stat that keeps you alive.",
              alternatives: [{ ref: { kind: "runeword", slug: "peace" }, why: "+2 Amazon skills and 20% more hit recovery at level 29." }],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills for two common runes." }],
        },
      ],
      nextUpgrade: "Level 30 for Lightning Strike, and a javelin with real damage on it.",
      notes:
        "Jab and Power Strike carry the first eighteen levels. Both are kept: Jab stays on the bar forever as the answer to a lightning immune, and every Power Strike point is a 14% synergy for the two skills you are heading toward.",
    },

    {
      tier: "nightmare",
      goal: "Both skills online, life steal in place, and a shield worth blocking with.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "titans-revenge" },
              why: "+4 skill levels between the two lines, 5-9% life steal, and 20 Dexterity toward block. The single best melee javelin available this early.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and mana in the slot you block with.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket shield.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "peace" }, why: "+2 Amazon skills, +2 Critical Strike and 20% Faster Hit Recovery for three cheap runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Life steal, mana steal and damage reduction — three things a melee Amazon needs and cannot get from her tree." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Life steal and up to 15% damage reduction. The melee belt until Thundergod's Vigor is affordable." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, attack rating and Dexterity. Chilled attack speed is worst for the character standing still and swinging." }],
        },
      ],
      charms: [{ label: "Resistance small charms", why: "75% in all four before Hell, and not a point less on a melee character." }],
      nextUpgrade: "An Insight for the mercenary, and resistances capped before Hell begins.",
      notes:
        "**Attack speed starts to matter and there is no single Amazon number to aim at.** Striking with Charged Strike and throwing Lightning Fury do not use the same animation, and a Ceremonial Javelin is not a Matriarchal one. Take attack speed where it is free — Highlord's Wrath, Andariel's Visage, gloves — and judge the result on the weapon you actually hold.",
    },

    {
      tier: "early-hell",
      goal: "Cap resistances, get life steal onto a second slot, and reach maximum block.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "unique", slug: "titans-revenge" }, why: "Still the right javelin, and its life steal is doing more work than its damage." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "+2 skills and block.",
              alternatives: [{ ref: { kind: "unique", slug: "stormshield" }, why: "35% damage reduction and the best block in the game, once 156 Strength is paid for." }],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "unique", slug: "duriels-shell" },
              why: "Cannot Be Frozen and heavy resistances, on a character who cannot afford to be slowed.",
              alternatives: [{ ref: { kind: "runeword", slug: "peace" }, why: "+2 Amazon skills if the resistances are already handled." }],
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life per level and 10% damage reduction at 50 Strength." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              ref: { kind: "unique", slug: "draculs-grasp" },
              why: "**Life Tap on striking.** On a build that hits several times a second it is close to permanent, and it is the single largest survivability item available to a melee Amazon.",
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "thundergods-vigor" }, why: "+3 Lightning Strike, +3 Lightning Fury, and the raised maximum lightning resistance you need standing in packs." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 skills, 20% attack speed, and Deadly Strike that doubles Lightning Strike's physical half." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike and Open Wounds — all three apply to the weapon damage Lightning Strike carries." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "Hold 75% and add life; both matter more in melee." }],
      nextUpgrade: "A Griffon's Eye or an Infinity, and a Fortitude for the Enhanced Damage the physical half actually uses.",
    },

    {
      tier: "budget",
      goal: "Enhanced Damage on the physical half, and the first −enemy lightning resistance.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "titans-revenge" },
              why: "Life steal and four skill levels.",
              alternatives: [{ ref: { kind: "unique", slug: "thunderstroke" }, why: "−15% enemy lightning resistance and up to +4 Javelin and Spear skills, at 151 Dexterity and no life steal." }],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "fortitude" },
              why: "**+300% Enhanced Damage, and here it is not a wasted line** — Lightning Strike delivers the weapon's damage, so this is a real damage upgrade as well as a defensive one.",
              sockets: "El, Sol, Dol, Lo into a 4-socket body armor.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "andariels-visage" },
              why: "+2 skills, 20% attack speed and up to 10% life steal. Pay for its −30% fire resistance elsewhere before you put it on.",
              sockets: "An Um rune, which returns most of the fire resistance it took.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "35% damage reduction and the block that keeps this build standing." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "thundergods-vigor" }, why: "Six skill levels across the two lightning skills, plus lightning absorb." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Attack speed and Deadly Strike." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow against anything with a large health pool." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Javelin and Spear skill grand charms", why: "Skill levels, which are bolts and chain jumps." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders, on the character who needs the life most." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "Griffon's Eye, then an Infinity on the mercenary.",
    },

    {
      tier: "optimized",
      goal: "Both damage types at full strength, and nothing left immune to both.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "unique", slug: "thunderstroke" },
              why: "−15% enemy lightning resistance, stacking with a Griffon's Eye and an Infinity. Now that Dracul's Grasp supplies the leech, losing Titan's is affordable.",
              lookFor: ["+4 Javelin and Spear Skills"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "griffons-eye" },
              why: "−20% enemy lightning resistance and +15% lightning skill damage, applied only to targets that are not immune.",
              sockets: "A lightning Rainbow Facet.",
              alternatives: [{ ref: { kind: "unique", slug: "andariels-visage" }, why: "Keep it if the life steal and attack speed are still carrying you." }],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Damage reduction and block, socketed with a lightning facet." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "fortitude" }, why: "+300% Enhanced Damage on the physical half, and the defence to stand in melee." }],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap on striking." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "thundergods-vigor" }, why: "Six skill levels and lightning absorb." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Attack speed and Deadly Strike, which the weapon half converts into damage." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen and attack rating." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, which is percentage-based and therefore best against bosses." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { label: "Javelin and Spear skill grand charms with life", why: "Skills and life together." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      nextUpgrade: "Facets in every socket, and a better Thunderstroke roll.",
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
              why: "A +4 Javelin and Spear roll with the maximum Enhanced Damage.",
              lookFor: ["+4 Javelin and Spear Skills", "+200% Enhanced Damage"],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "griffons-eye" },
              why: "A −20% and +15% roll, socketed with a lightning facet.",
              lookFor: ["-20% Enemy Lightning Resistance", "+15% Lightning Skill Damage"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "stormshield" }, why: "Damage reduction, block, and a facet in the socket." }],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "fortitude" },
              why: "The Enhanced Damage the physical half spends, and the resistances the Griffon's costs.",
              alternatives: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "Trade damage for +65 all resistances if Hell is punishing you rather than outlasting you." }],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [{ ref: { kind: "unique", slug: "draculs-grasp" }, why: "Life Tap. Nothing else in the slot competes for a melee Amazon." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "thundergods-vigor" }, why: "Six skill levels, +10% maximum lightning resistance and 20 absorb." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Attack speed and Deadly Strike scaling with level." }],
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
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and Open Wounds." }],
        },
      ],
      charms: [
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Hellfire Torch (Amazon)", why: "+3 Amazon skills." },
        { ref: { kind: "unique", slug: "crack-of-the-heavens" }, why: "Only where Infinity cannot reach, and never in a lightning enchanted zone — read its page first." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "The off-hand for the swap." },
      ],
      notes:
        "This build ends with two damage types at full strength and a shield in front of both. **The last real decision is Fortitude against Chains of Honor**, and it is a genuine one: Fortitude's Enhanced Damage feeds the half of Lightning Strike that lands on lightning immunes, and Chains of Honor's resistances are what let you wear a Griffon's Eye and an Andariel's Visage at the same time.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "The Act 2 Desert Mercenary with **Might**, because his physical damage is what kills the lightning immunes your Charged Strike cannot touch — and because Might raises your own weapon damage, which Lightning Strike carries and the thrown build does not. Give him an **Insight** for the mana early and an **Infinity** eventually; Conviction is the only thing that actually breaks lightning immunity. **Holy Freeze** is the hardcore choice, and it is a stronger one here than on a ranged build: anything slowed is something not reaching your melee range.",

  farming: [
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Area level 85, dense enough for the chain and full of the single targets Charged Strike is for. It holds lightning immunes, which Lightning Strike still hurts with its weapon half and Charged Strike does not touch at all. Watch for Iron Maiden from the Oblivion Knights — it reflects the physical half of every strike.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "throne-of-destruction",
      difficulty: "hell",
      why: "Charged Strike is the best answer to Baal in the game, and the waves are close enough together for the chain to reach. The waves carry lightning immunity, so the weapon half of Lightning Strike and a Might mercenary do that share of the work.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "Ten-second runs at monster level 86 against a single target. This is the shape Charged Strike is best against, and there is nothing to clear.",
      minTier: "early-hell",
      rating: 5,
    },
    {
      area: "nihlathak",
      difficulty: "hell",
      why: "A short run to one dangerous target. Keep your distance from the Vipers rather than the man — Charged Strike kills him in a handful of strikes.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Nothing here is lightning immune and the density suits the chain. Slower than the thrown build, but perfectly safe with a shield up.",
      minTier: "nightmare",
      rating: 4,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85 and the best experience in the game. Lightning immunity is common, so this is an Infinity zone or a Jab one.",
      minTier: "optimized",
      rating: 3,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are lightning immune and hit hard in melee. Not a zone for this build until Infinity exists.",
      minTier: "optimized",
      rating: 2,
    },
  ],

  immunityPlan:
    "This build handles lightning immunity better than the thrown one, and the reason is a difference in how the two skills are built. **Lightning Strike delivers the weapon's full physical damage as well as its own lightning**, so a lightning immune still takes the weapon half — with a Fortitude, a Gore Rider and a Might mercenary, that half is substantial. **Charged Strike delivers no weapon damage at all**; against a lightning immune it does literally nothing, which is why Jab stays on the bar. The upgrades are the same as every lightning Amazon's: **Griffon's Eye** and **Thunderstroke** for −enemy resistance applied only to targets that are not immune, and **Infinity on the mercenary** for the Conviction that actually breaks it. A **Crack of the Heavens** works and costs 70 to 90 points of the resistance protecting you from lightning enchanted packs — a worse trade in melee range than at distance.",

  hardcoreNotes:
    "Playable and demanding. You are in melee range with the smallest health pool of any melee character, so the whole plan is block, hit recovery and leech: reach 32% Faster Block Rate and 32% Faster Hit Recovery before Hell, hold a Stormshield, and get Dracul's Grasp on as early as you can — Life Tap on striking is worth more than any amount of raw defence. **Iron Maiden is the specific killer.** The Oblivion Knights in the Chaos Sanctuary reflect physical damage, and Lightning Strike carries a physical half, so a cursed pack can end the character. Watch for the curse and walk out of it. Holy Freeze on the mercenary, not Might.",

  selfFoundNotes:
    "Reasonable. Titan's Revenge, Vampire Gaze, String of Ears, Gore Rider and Raven Frost are all common Hell drops, and Peace and Spirit are Countess runes. Dracul's Grasp is the one item worth going out of your way for and it is findable. What self-found cannot supply is −enemy lightning resistance, which means Charged Strike stops working against a growing share of Hell while Lightning Strike keeps landing its physical half. A self-found version of this build is a physical melee Amazon with a lightning bonus, and it works — it just is not the boss-deleting character the endgame version is.",

  levelingPath: {
    summary:
      "Charged Strike at 18 is early enough that this build genuinely levels as itself from the middle of Normal. Before that it is Jab and Power Strike, and neither is wasted — Power Strike is a 14% synergy and Jab never leaves the bar. **Lightning Strike does not exist until level 30**, so the chain arrives late; that is expected rather than a mistake in your allocation.",
    respecAt: "Usually never. Keep the Den of Evil tokens for a change of mind rather than a correction.",
  },

  confidence: "verified",
  complete: true,
};
