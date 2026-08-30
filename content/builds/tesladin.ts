import type { Build } from "@/lib/types";

/**
 * The Tesladin, also published as the Dream Paladin or Dreamadin.
 *
 * The one build on the site whose damage does not come from a skill you cast.
 * Two Dream runewords — one in a helm, one in a shield — each grant a level 15
 * Holy Shock aura, and the two stack to an effective level 30. You attack with
 * Zeal for the physical damage and the aura kills everything standing near you.
 *
 * Verified against the game's own data:
 * - Dream grants `aura(Holy Shock) 15`, in a helm or a shield. Both, therefore
 *   30. Its required level is 65, set by the Jah rune.
 * - Holy Shock is a level 24 skill with radius 6 plus 1 per level.
 * - Conviction reduces resistance 30% at level 1 plus 5% per level.
 * - Zeal reaches its five-hit ceiling at skill level 4.
 *
 * What is *not* verified at Tier 1 is the identity of Holy Shock's damage
 * synergies. The extraction we use records that two synergies exist and their
 * per-level magnitudes, but not which skills supply them. Every published skill
 * plan maxes Resist Lightning and Salvation, and that consensus is what the
 * plan below follows — hence `confidence: "community"` rather than "verified".
 */
export const tesladin: Build = {
  slug: "tesladin",
  name: "Tesladin",
  classSlug: "paladin",
  summary:
    "Two Dream runewords stack a level 30 Holy Shock aura. You walk into a pack and it dies to a passive.",
  damageTypes: ["lightning", "physical"],
  primarySkill: "holy-shock",
  playstyle:
    "There is no damage button. You run into a group, hold Zeal for the physical half, and the stacked Holy Shock aura electrocutes everything within its radius whether you attack it or not. Conviction is the aura you actually have selected, because it strips the lightning resistance the aura is fighting through. The whole build is a positioning exercise: get close, stay close, and let the passive work.",
  strengths: [
    "Damage that costs no skill points and no button — the aura runs whether you attack or not",
    "Lightning plus physical, so a lightning immune still takes the Zeal half",
    "Fast at density, which is unusual for a melee Paladin",
    "Conviction breaks lightning immunity on the monsters that would otherwise wall it",
    "Maximum block and a shield up permanently",
  ],
  weaknesses: [
    "**Two Jah runes.** This is not an expensive build, it is a very expensive build, and there is no cheap version",
    "The aura has a radius. You have to be in the middle of the pack, which is where things kill you",
    "Nothing before level 65, because that is Dream's required level",
    "Your best defensive slots — helm and shield — are both spent on damage",
    "Single targets die slowly; the aura is area damage and bosses are not areas",
  ],
  difficulty: "moderate",
  budget: "extreme",
  ratings: {
    clearSpeed: 5,
    bossing: 3,
    survivability: 4,
    magicFind: 3,
    terrorZones: 5,
    ubers: 3,
    soloSelfFound: 1,
    players8: 4,
  },

  skills: [
    {
      skill: "resist-lightning",
      points: 20,
      role: "synergy",
      order: 1,
      note: "A Holy Shock synergy, and it raises your maximum lightning resistance while it does it. Max it first — it is the largest damage increase available and it costs nothing but points.",
    },
    {
      skill: "salvation",
      points: 20,
      role: "synergy",
      order: 2,
      note: "The second Holy Shock synergy. It is also a resistance aura you can swap to, which occasionally matters.",
    },
    {
      skill: "conviction",
      points: 20,
      role: "main",
      order: 3,
      note: "Your selected aura. 30% resistance reduction at level 1 plus 5% per level — this is what pushes lightning immunes below the line so the Dream aura can hurt them.",
    },
    {
      skill: "holy-shield",
      points: 20,
      role: "utility",
      order: 4,
      note: "Block and defence. You are standing inside packs by design, so this is not optional.",
    },
    {
      skill: "zeal",
      points: 1,
      role: "utility",
      note: "**One point, and max it last if ever.** Four points reach the five-hit cap, but on this build Zeal is a delivery mechanism for life steal and a physical fallback, not the damage.",
    },
    { skill: "sacrifice", points: 1, role: "prerequisite" },
    { skill: "smite", points: 1, role: "prerequisite" },
    { skill: "might", points: 1, role: "prerequisite" },
    { skill: "holy-fire", points: 1, role: "prerequisite" },
    {
      skill: "holy-freeze",
      points: 1,
      role: "utility",
      note: "On the way to Conviction, and a genuinely useful aura to swap to — slowing a pack you are standing inside is worth more than it sounds.",
    },
    { skill: "holy-shock", points: 1, role: "utility", note: "One point. The aura comes from Dream, not from this — but the point is a Conviction prerequisite anyway." },
    { skill: "sanctuary", points: 1, role: "prerequisite" },
    { skill: "prayer", points: 1, role: "prerequisite" },
    { skill: "defiance", points: 1, role: "prerequisite" },
    { skill: "vigor", points: 1, role: "utility", note: "Run speed, and a Salvation prerequisite." },
    { skill: "resist-fire", points: 1, role: "prerequisite" },
    { skill: "resist-cold", points: 1, role: "prerequisite" },
    { skill: "cleansing", points: 1, role: "prerequisite" },
    { skill: "meditation", points: 1, role: "prerequisite" },
    { skill: "redemption", points: 1, role: "utility", note: "Life and mana from corpses, which is your recovery between packs." },
  ],
  flexPoints: [
    "**More Zeal** once the four core skills are done. It raises the physical half, which is what kills lightning immunes that Conviction cannot break.",
    "**Fanaticism** is worth considering as a second aura for the attack speed, but you cannot run it and Conviction at once — and Conviction is what makes the Dream aura work. Most Tesladins leave it alone.",
    "**Holy Freeze** past one point if you find yourself dying inside packs more than you find yourself killing them slowly.",
    "**Increased Attack Speed is not published as a breakpoint table here**, for the same reason it is not on the other melee Paladins. It matters less on this build than on any of them, because the aura is the damage and it has no attack speed.",
  ],
  stats: {
    strength: "Enough for a 3-socket shield and a 3-socket helm. Neither has to be heavy, and Dream is not a runeword you want to pay a Strength tax for twice.",
    dexterity: "Enough for maximum block **with Holy Shield active**. You are standing in the middle of packs, so this is one of the builds where block genuinely earns its cost.",
    vitality: "Everything else, and take it seriously — your defensive slots are both occupied by damage.",
    energy: "None.",
    notes: [
      "**Both Dream bases should be the cheapest ones that work.** The runeword's stats do not scale with the base, so paying Strength for a heavy helm or shield buys you nothing.",
      "**Check block with Holy Shield running.** The usual Paladin trap.",
      "Life matters more here than on any other Paladin, because the build's core loop is standing inside the thing that is trying to kill you.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "required",
      why: "Two Dreams already supply 40-60% between them, so this is nearly free — and it matters more here than elsewhere because you fight surrounded.",
    },
    {
      stat: "fhr",
      value: 86,
      frames: 4,
      priority: "recommended",
      why: "Reachable with a Verdungo's belt on top of the two Dreams. Worth taking on a build that stands in melee range of everything.",
    },
    {
      stat: "fbr",
      value: 32,
      frames: 3,
      priority: "recommended",
      why: "Block recovery decides whether you can act while a pack is hitting you, which is the whole time.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Not a Tesladin. Level as something else — Dream requires level 65.",
      levelRange: [1, 40],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any Paladin scepter with +Combat Skills",
              why: "You are playing a Zealot for now. Vendor scepters are the cheapest damage available.",
              lookFor: ["+2 Combat Skills", "+3 Zeal"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances for three Countess runes." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Hit recovery and run speed for two common runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills." }],
        },
      ],
      nextUpgrade:
        "Level 65 and two Jah runes. There is no shortcut and no partial version — read the self-found note before committing to this build.",
      notes:
        "Play the Zealot. It is the same class, the same weapon, and the same block plan, and it converts to this build with one respec once the Dreams exist.",
    },

    {
      tier: "nightmare",
      goal: "Still a Zealot. Bank runes.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "passion" }, why: "Attack speed and a Berserk charge, cheaply." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "+50 all resistances and skills. It will be replaced by a Dream, but not for a long time." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "treachery" }, why: "Fade and attack speed for three cheap runes." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, which a Zeal-based build cannot do without." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest resistance in the game." }],
      nextUpgrade: "Keep farming the Countess and Travincal. Everything about this build is downstream of two Jah runes.",
    },

    {
      tier: "early-hell",
      goal: "Clear Hell as a Zealot while the runes accumulate.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "kingslayer" }, why: "Crushing Blow for bosses while you wait." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "Resistances and skills." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "duress" }, why: "Crushing Blow and damage reduction for three mid runes." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "vampire-gaze" }, why: "Life steal and damage reduction." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and run speed." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "Skills and resistances." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "Hold 75%." }],
      nextUpgrade:
        "The first Dream. One is not the build, but it is the point at which you stop being a Zealot and start being a Tesladin with half its damage.",
      notes:
        "Be honest with yourself here. If two Jah runes are not a realistic target for how you play, the Zealot page is the build you are already on and it is a good one.",
    },

    {
      tier: "budget",
      goal: "The first Dream. Half the aura, and a preview of the build.",
      levelRange: [65, 85],
      slots: [
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "dream" },
              why: "A level 15 Holy Shock aura and 20-30% Faster Hit Recovery. On its own it is not a build — it is the first half of one.",
              sockets: "Io, Jah, Pul into a 3-socket helm. Use the lightest 3-socket elite helm you can find; the base contributes nothing.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "herald-of-zakarum" },
              why: "Keep it until the second Dream exists. The resistances are what let you stand in the packs.",
            },
          ],
        },
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "The physical half. It also kills the lightning immunes your aura cannot touch.",
              sockets: "Eth, Tir, Lo, Mal, Ral into a 5-socket Phase Blade.",
              alternatives: [
                { ref: { kind: "runeword", slug: "kingslayer" }, why: "Perfectly adequate while the runes go into Dreams instead." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances, which raises both synergies and Conviction." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and run speed." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills, which lifts both synergies and Conviction at once." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Lightning skill grand charms", why: "Direct damage on the aura, in the slot that has nothing better to do." },
      ],
      nextUpgrade: "The second Jah. That is the whole remaining project.",
    },

    {
      tier: "optimized",
      goal: "Both Dreams. The build finally exists.",
      levelRange: [75, 90],
      slots: [
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "dream" },
              why: "Level 15 Holy Shock, half of the pair.",
              sockets: "Io, Jah, Pul into the lightest 3-socket helm available.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "dream" },
              why: "The second half. Two auras stack to an effective level 30 Holy Shock, and this is the moment the build starts working.",
              sockets: "Io, Jah, Pul into a 3-socket Paladin shield — the class shield adds its own resistances on top.",
            },
          ],
        },
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "The physical damage, and the answer to lightning immunes Conviction cannot break.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "chains-of-honor" },
              why: "+2 skills and +65 all resistances. With both defensive slots spent on Dreams, this is where your survivability lives.",
              alternatives: [
                { ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, at the cost of the resistances. Take it only once your charms can cover the gap." },
              ],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted Blood gloves with 20% Increased Attack Speed",
              why: "Attack speed and life on a slot with no unique worth taking for this build.",
              lookFor: ["20% Increased Attack Speed", "Life", "Resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and run speed." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "+1 skills, 20% attack speed and lightning resistance." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Lightning skill grand charms with life", why: "The best remaining damage, and life you badly need." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders. Your defensive slots are damage, so the life matters." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Enigma, once your resistances survive losing Chains of Honor.",
    },

    {
      tier: "bis",
      goal: "Nothing left to fix.",
      levelRange: [85, 99],
      slots: [
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "dream" },
              why: "A 30% Faster Hit Recovery and 20 all-resistances roll.",
              lookFor: ["30% Faster Hit Recovery", "All Resistances +20"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "dream" },
              why: "In a Paladin class shield, for the innate resistances the build has nowhere else to get.",
              lookFor: ["30% Faster Hit Recovery", "All Resistances +20", "Paladin shield base"],
            },
          ],
        },
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "A 400-damage roll in an ethereal Phase Blade.",
              lookFor: ["400 damage", "40% Increased Attack Speed"],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "enigma" }, why: "Teleport, once charms cover the resistances Chains of Honor was carrying." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted Blood gloves, 20% Increased Attack Speed, +3 Combat Skills",
              why: "Attack speed, life steal and skills in one slot.",
              lookFor: ["20% Increased Attack Speed", "+3 Combat Skills", "Life steal"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "15% damage reduction on a maximum roll." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 all skills and +30 all resistances. On a build wearing two damage items in its defensive slots, the resistances win." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills, 20 all resistances." },
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Lightning skill grand charms with life", why: "Damage and life together." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "The aura level is fixed by the runeword and cannot be raised by +skills, so all remaining upgrades go into the synergies, Conviction, and staying alive inside the radius.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Take **Might** for his damage or **Holy Freeze** for the slow — Holy Freeze is the common pick, because anything slowed stays inside your aura radius longer, which is the same as more damage. Give him an **Insight** for mana. The item most sources point at for him is a Reaper's Toll for its Decrepify proc, which lowers physical resistance and slows on top; the site does not yet document that item, so treat it as a named target rather than a link.",

  farming: [
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Dense and packed tightly, which is exactly what an aura with a radius wants. Watch for Iron Maiden — your Zeal half reflects even though the aura does not.",
      minTier: "optimized",
      rating: 5,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85 and very dense. The best general Tesladin farm.",
      minTier: "optimized",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, short route, and the packs come to you.",
      minTier: "optimized",
      rating: 4,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Dense area level 85 with almost nothing lightning immune.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are lightning immune. Conviction can break naturally occurring lightning immunity, but this is the zone where you should verify that before relying on it, and your Zeal half is doing more of the work than usual.",
      minTier: "optimized",
      rating: 3,
    },
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Enormous density and nothing lightning immune. A stacked aura in a cow herd is the single fastest thing this build does.",
      minTier: "optimized",
      rating: 5,
    },
  ],

  immunityPlan:
    "Two damage types, and they fail in different places. The **Holy Shock aura is lightning**, and lightning immunes take nothing from it — which is why Conviction is your selected aura rather than anything more exciting. Conviction reduces resistance by 30% at level 1 plus 5% per level, enough to break naturally occurring lightning immunity on most of what you will meet. Where it is not enough, **Zeal's physical damage still lands**, and that is the actual fallback: a Grief plus Crushing Blow kills lightning immunes slowly but reliably. The genuine problem is a monster that is immune to both lightning and physical, which is rare, and the honest answer there is to walk past it. **Iron Maiden** deserves a specific mention: the aura is not reflected, but your Zeal is, and a five-hit attack into a reflected-damage curse kills you as fast on this build as on any other.",

  hardcoreNotes:
    "Risky, and for a structural reason rather than a fixable one. The build's damage requires you to stand inside the pack, and both of the slots you would normally use to survive that — helm and shield — are occupied by Dream. Chains of Honor over Enigma is close to mandatory, Battle Orders should be up before every pack, and Holy Freeze on the mercenary is worth more than his damage. Also weigh the loss: this is a two-Jah character, and Hardcore means you can lose both.",

  selfFoundNotes:
    "Realistically, no. Two Jah runes self-found is a very long project — Jah is one of the highest runes in the game and the build needs two, with no partial version that works. A self-found player who wants this playstyle should read this page as a destination rather than a plan, play the Zealot in the meantime, and convert if the runes ever appear. Everything else the build needs is ordinary.",

  levelingPath: {
    summary:
      "Level and play as a Zealot — same class, same weapon, same block plan, and Zeal is the attack this build uses anyway. Dream requires character level 65, so there is no version of this build before then, and no reason to respec until both Dreams are actually in your inventory. The conversion is a single free Den of Evil respec.",
    respecAt: "Level 65+, and only once both Dreams exist",
    viaBuild: "zealot",
  },

  confidence: "community",
  complete: true,
};
