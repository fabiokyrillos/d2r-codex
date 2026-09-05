import type { Build } from "@/lib/types";

/**
 * The Melee Sorceress — one page covering two variants, the **Zeal Sorceress**
 * and the **Werebear Sorceress**.
 *
 * The research pass merged them deliberately. Both are single-source (Maxroll
 * has full guides, DiabloBytes' 54-build tier list carries neither, Wowhead has
 * neither), both sit at Maxroll's C tier, and both are the same idea: a
 * Sorceress who does not cast, whose damage comes from a Dream runeword's Holy
 * Shock aura, and whose attack is granted by another runeword. Two pages would
 * have been two near-identical gear tables. The same reasoning kept Omnidin
 * inside the Holy Fire Paladin page.
 *
 * The two variants differ in exactly one place — where the attack comes from:
 *
 * - **Zeal Sorceress:** a **Passion** runeword grants Zeal as an Oskill.
 * - **Werebear Sorceress:** a **Beast** runeword grants Werebear as an Oskill,
 *   and you fight in bear form.
 *
 * Verified at Tier 1: Beast's Werebear and Shape Shifting are both marked
 * `oskill`, which is what makes a non-Druid transformation possible at all;
 * Dream grants `aura(Holy Shock) 15` in a helm or a shield, so two stack to an
 * effective 30; Energy Shield consumes two mana per point of damage at base.
 *
 * `confidence: "community"` — the item mechanics are Tier 1, but the build's
 * existence and skill plan rest on a single source.
 */
export const meleeSorceress: Build = {
  slug: "melee-sorceress",
  name: "Melee Sorceress",
  classSlug: "sorceress",
  summary:
    "A Sorceress who does not cast. Dream supplies the damage, another runeword supplies the attack, and Energy Shield keeps her standing.",
  damageTypes: ["lightning", "physical"],
  primarySkill: "energy-shield",
  playstyle:
    "Walk in and swing. The damage is not yours — it comes from the Holy Shock aura on your Dream runewords, which electrocutes everything nearby whether you attack it or not, and from whatever physical damage the weapon does. Your skill points buy survival rather than damage: Energy Shield converts incoming hits into mana, Telekinesis makes that conversion cheaper, and Warmth refills the pool. It is a genuine novelty build and both this page and the sources it comes from say so.",
  strengths: [
    "Completely different to play from any other Sorceress on the site",
    "Energy Shield plus a large mana pool is a real defensive layer, not a gimmick",
    "The Holy Shock aura damages everything nearby without a button press",
    "Lightning plus physical means fewer hard walls than a pure caster",
    "Keeps Teleport, which no other melee character in the game has for free",
  ],
  weaknesses: [
    "**Very expensive for what it is.** Two Dreams is two Jah runes, and the attack runeword is on top",
    "**Single-source.** Only one of the three build sources we consulted documents it, at C tier",
    "Mana burn is lethal rather than annoying, because Energy Shield is your health",
    "Your skill points buy no damage at all — every point of it comes from gear",
    "Slower than the specialists at everything, and it costs more than most of them",
  ],
  difficulty: "advanced",
  budget: "extreme",
  ratings: {
    clearSpeed: 3,
    bossing: 3,
    survivability: 4,
    magicFind: 2,
    terrorZones: 3,
    ubers: 3,
    soloSelfFound: 1,
    players8: 3,
  },

  skills: [
    {
      skill: "energy-shield",
      points: 20,
      role: "main",
      order: 1,
      note: "**Two mana per point of damage at base**, improved by Telekinesis. On a character with a Sorceress's life pool standing in melee range, this is the build's health bar.",
    },
    {
      skill: "telekinesis",
      points: 20,
      role: "utility",
      order: 2,
      note: "**Every hard point here takes one sixteenth off what Energy Shield charges you**, from 32/16ths of mana per point of damage down towards 12/16ths at twenty. **Not a synergy** — the game reads your *hard* points in Telekinesis, so a +3 Lightning Skills amulet does nothing for the ratio and cannot substitute for the twenty points. Max it second anyway.",
    },
    {
      skill: "warmth",
      points: 20,
      role: "utility",
      order: 3,
      note: "Refills the pool Energy Shield is spending. On a build whose health is mana, regeneration is healing. It is also Enchant's damage synergy at 9% per hard point — but Enchant is the skippable half of this plan, so the mana is the reason to buy it.",
    },
    {
      skill: "enchant",
      points: 20,
      role: "flex",
      order: 4,
      note: "**The one damage skill worth taking.** It adds fire damage to your attacks, lasts minutes, and can be cast before shifting into bear form. Skip it if you would rather have deeper armours.",
    },
    { skill: "charged-bolt", points: 1, role: "prerequisite" },
    { skill: "teleport", points: 1, role: "utility", note: "**One point**, and it is the single biggest advantage this build has over any other melee character in the game." },
    { skill: "fire-bolt", points: 1, role: "flex", note: "Only needed if you take the Enchant option below — it is Fire Ball's prerequisite." },
    { skill: "fire-ball", points: 1, role: "flex", note: "Only needed for the Enchant option below, which requires it." },
    { skill: "frozen-armor", points: 1, role: "prerequisite" },
    { skill: "shiver-armor", points: 1, role: "prerequisite" },
    {
      skill: "chilling-armor",
      points: 1,
      role: "utility",
      note: "The armour worth running in melee — it fires a projectile back at whatever shoots you, and its defence applies where you actually are.",
    },
    { skill: "static-field", points: 1, role: "utility", note: "Takes 25% of a target's current life. Your only answer to a boss with a large health pool." },
    { skill: "ice-bolt", points: 1, role: "prerequisite" },
    { skill: "frost-nova", points: 1, role: "utility", note: "Chills everything around you, which on a build standing in the middle is worth its point." },
    {
      skill: "lightning",
      points: 1,
      role: "prerequisite",
      note: "Chain Lightning's prerequisite.",
    },
    {
      skill: "chain-lightning",
      points: 1,
      role: "prerequisite",
      note: "**Energy Shield requires Chain Lightning and Teleport.** Two points of lightning tree on a build that casts neither.",
    },
    {
      skill: "ice-blast",
      points: 1,
      role: "prerequisite",
      note: "**Shiver Armor requires Frozen Armor and Ice Blast.**",
    },

  ],
  flexPoints: [
    "**Zeal variant:** a **Passion** runeword grants Zeal as an Oskill. Faster, hits several adjacent targets, and keeps you in normal form — so you can still cast, drink and teleport freely. This is the more flexible of the two.",
    "**Werebear variant:** a **Beast** runeword grants Werebear as an Oskill. Bear form is tankier and hits harder per swing, but you cannot cast while shifted — buff Enchant and your armour *before* transforming, and accept that Teleport is unavailable until you shift back.",
    "**Skip Enchant** if you would rather push Energy Shield's supporting skills further. The build's damage is the Dream aura either way, and Enchant is a fire-damage bonus rather than a core.",
    "**Do not put points in Energy.** Energy Shield scales with your mana *pool*, and gear supplies far more mana per point than the attribute does. This is the build where that mistake is most tempting and most costly.",
    "**Increased Attack Speed is not published as a breakpoint table on this site** — the same position as the melee Paladin pages. Beast supplies 40% and Passion supplies its own; in practice that covers it.",
  ],
  stats: {
    strength: "Enough for your weapon and armour. Beast itself gives +25-40 Strength, which pays back part of what its base costs.",
    dexterity: "Enough for the weapon. There is no block plan here — the shield slot is a Dream.",
    vitality: "Everything else, and it still will not be much. Energy Shield is doing the work that Vitality does elsewhere.",
    energy: "**None**, despite appearances. Read the flex points — the shield scales with the pool, and gear gives more pool per point than the attribute.",
    notes: [
      "**The most common mistake on this build is investing in Energy.** It feels correct and it is not: mana from gear is far cheaper per point, and Telekinesis improves the conversion ratio in a way Energy never does.",
      "Both defensive slots — helm and shield — are Dreams, so there is no block and no resistance from either. Everything else you wear has to make up for that.",
      "The Werebear variant cannot drink potions in the same way or cast while shifted. Plan the buff order before you transform.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 60,
      frames: 9,
      priority: "required",
      why: "**Required.** You are in melee range with no block, and Dream supplies 20-30% of it per copy — so two Dreams already carry most of the way.",
    },
    {
      stat: "fcr",
      value: 63,
      frames: 9,
      priority: "recommended",
      why: "Only Teleport and your buffs use it. There is no reason to buy more than enough to reposition.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Not this build. Dream requires level 65 and Beast 63.",
      levelRange: [1, 40],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "You are levelling as a caster. Play one of the cold or fire builds and come back.",
              sockets: "Tal, Thul, Ort, Amn into a 4-socket Crystal Sword.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "ancients-pledge" }, why: "Resistances while you level normally." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "stealth" }, why: "Cast rate and hit recovery at level 17." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills." }],
        },
      ],
      nextUpgrade: "Level 65 and two Jah runes, plus a Beast or a Passion. Read the self-found note first.",
      notes:
        "**There is no early version of this build.** Level as a Frozen Orb or Fire Ball Meteor Sorceress, which are both good characters in their own right, and convert with a free Den of Evil respec if the runes ever appear.",
    },

    {
      tier: "nightmare",
      goal: "Still a caster. Bank runes.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Cast rate and skills." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "A second Spirit." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "unique", slug: "skin-of-the-vipermagi" }, why: "+1 skills and resistances at 43 Strength." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "tarnhelm" }, why: "+1 skills and magic find while you farm for runes." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "The cheapest resistance available." }],
      nextUpgrade: "Countess and Travincal runs. Everything about this build is downstream of high runes.",
    },

    {
      tier: "early-hell",
      goal: "Farm Hell as a caster while the runes accumulate.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "Cast rate and skills." }],
        },
        {
          slot: "offhand",
          picks: [{ ref: { kind: "runeword", slug: "spirit" }, why: "The second one." }],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances — and you will want it later too." }],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "unique", slug: "harlequin-crest" }, why: "+2 skills, life and magic find." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 all skills and **increased maximum mana** — the second half is what this build is buying." }],
        },
      ],
      charms: [{ label: "Resistance and life small charms", why: "Hold 75%." }],
      nextUpgrade: "The first Dream, and a decision between the Zeal and Werebear variants.",
      notes:
        "Be honest with yourself here, exactly as on the Tesladin page. If two Jah runes plus a Beast or Passion is not a realistic target for how you play, this build is a page to read rather than a plan to follow.",
    },

    {
      tier: "budget",
      goal: "One Dream and an attack. Half the damage, and a real preview.",
      levelRange: [65, 85],
      slots: [
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "dream" },
              why: "A level 15 Holy Shock aura and 20-30% Faster Hit Recovery. Half of the build's damage, in one slot.",
              sockets: "Io, Jah, Pul into the lightest 3-socket helm you can find.",
            },
          ],
        },
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "passion" },
              why: "**The Zeal variant.** Grants Zeal as an Oskill — several fast hits, and you stay in normal form so you can still cast and teleport freely. The cheaper of the two attacks by a wide margin.",
              sockets: "Dol, Ort, Eld, Lem into a 4-socket weapon.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "beast" },
                  why: "**The Werebear variant.** Grants Werebear as an Oskill plus a Fanaticism aura and 40% attack speed. Tankier and harder-hitting, but you cannot cast while shifted.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "spirit" },
              why: "Keep it until the second Dream exists — the +2 skills raise Energy Shield and Telekinesis, which is your survival.",
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances. With Dreams in your defensive slots, this is where survivability lives." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and **Increase Maximum Mana 5%** — mana is health here." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills and increased maximum mana." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, which any melee build needs — and the Dexterity helps the weapon requirement." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Faster Hit Recovery, Strength and Vitality." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills, which raises Energy Shield and Telekinesis together." },
        { label: "Annihilus", why: "+1 all skills and resistances." },
        { label: "Life and resistance small charms", why: "With both defensive slots spent on damage, charms carry more here than usual." },
      ],
      weaponSwap: [{ ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders raises **mana as well as life**, which on this build is a direct increase to your effective health." }],
      nextUpgrade: "The second Jah. That is the remaining project, exactly as on the Tesladin page.",
    },

    {
      tier: "optimized",
      goal: "Both Dreams. A level 30 Holy Shock aura and an Energy Shield deep enough to stand in it.",
      levelRange: [75, 90],
      slots: [
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "runeword", slug: "dream" },
              why: "Half of the stacked aura.",
              sockets: "Io, Jah, Pul into the lightest 3-socket helm available.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "dream" },
              why: "The other half. Two auras stack to an effective level 30 Holy Shock, which is the moment the build becomes itself.",
              sockets: "Io, Jah, Pul into a 3-socket shield.",
            },
          ],
        },
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "beast" },
              why: "**Werebear variant.** Fanaticism, 40% attack speed, 20% Crushing Blow and the transformation itself.",
              alternatives: [
                { ref: { kind: "runeword", slug: "passion" }, why: "**Zeal variant.** Cheaper, faster, and it keeps you able to cast and teleport at will." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills and +65 all resistances. With no shield and no block, this is not optional." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves with 20% Increased Attack Speed and mana",
              why: "Attack speed, and mana that is functionally life on this build.",
              lookFor: ["20% Increased Attack Speed", "Mana", "Resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills and increased maximum mana." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills and +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills and maximum mana." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Hit recovery and Vitality." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Life and resistance small charms", why: "Both defensive slots are damage; charms make up the difference." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders — mana and life together." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      nextUpgrade: "Mana and resistances. There is no damage upgrade left — the aura level is fixed by the runeword.",
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
              why: "The same, in a shield.",
              lookFor: ["30% Faster Hit Recovery", "All Resistances +20"],
            },
          ],
        },
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "beast" },
              why: "A 270% Enhanced Damage roll in a Berserker Axe.",
              lookFor: ["270% Enhanced Damage", "+40 to Strength"],
              alternatives: [
                { ref: { kind: "runeword", slug: "passion" }, why: "The Zeal variant stays a legitimate endpoint, not a budget one." },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [{ ref: { kind: "runeword", slug: "chains-of-honor" }, why: "+2 skills, +65 all resistances, 8% damage reduction." }],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted gloves: 20% Increased Attack Speed, mana, resistances",
              why: "The one slot where a craft beats every unique here.",
              lookFor: ["20% Increased Attack Speed", "Mana", "Two resistances"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "arachnid-mesh" }, why: "+1 skills, maximum mana." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "maras-kaleidoscope" }, why: "+2 skills, +30 all resistances." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "stone-of-jordan" }, why: "+1 skills, maximum mana." }],
        },
        {
          slot: "ring2",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, Dexterity for the weapon." }],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "sandstorm-trek" }, why: "Hit recovery and Vitality." }],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Sorceress)", why: "+3 Sorceress skills, 20 all resistances." },
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Life and resistance small charms", why: "The rest of the inventory." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "The honest summary, and it is the same one the research reached: this costs more than the Nova Sorceress and clears less than the Frozen Orb Sorceress. Build it because a Sorceress swinging an axe is a thing you want to do, which is a perfectly good reason — not because the numbers point here.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Take **Holy Freeze** rather than Might. You fight from inside the pack and anything slowed stays inside your Holy Shock radius longer, which is worth more than his personal damage. Give him an **Insight** — its Meditation refills the mana that is functionally your health bar, which makes it more valuable on this build than on any caster. **Treachery** and a **Vampire Gaze** keep him alive next to you.",

  farming: [
    {
      area: "secret-cow-level",
      difficulty: "hell",
      why: "Huge density, nothing lightning immune, and everything walks into an aura centred on you. The best thing this build does.",
      minTier: "optimized",
      rating: 5,
    },
    {
      area: "worldstone-keep",
      difficulty: "hell",
      why: "Area level 85 and dense — the packs come to you, which is what a radius aura wants.",
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
      area: "pit",
      difficulty: "hell",
      why: "Area level 85 and short, though the rooms are more open than the aura would like.",
      minTier: "optimized",
      rating: 3,
    },
    {
      area: "uber-tristram",
      difficulty: "hell",
      why: "Genuinely viable, which is unusual for a Sorceress — Energy Shield plus a physical attack plus Crushing Blow from Beast is a real Uber kit. Slower than a Smiter and far more expensive.",
      minTier: "bis",
      rating: 3,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Dense, but the Oblivion Knights' Iron Maiden reflects your physical half — and on a character whose health is a mana pool, that goes badly.",
      minTier: "optimized",
      rating: 2,
    },
  ],

  immunityPlan:
    "Two damage types that fail in different places. The **Holy Shock aura is lightning**, and a lightning immune takes nothing from it — with no Conviction available to a Sorceress, there is no way to break that from your own gear. What still lands is the **physical damage of your attack**, which with Beast's 20% Crushing Blow is more substantial than it sounds. Against something immune to both, the honest answer is to walk past. A **Crack of the Heavens** sunder charm works but costs 70 to 90 points of your own lightning resistance, which on a build standing inside lightning enchanted packs with no shield is one of the worst places in the game to take that trade. Your mercenary's **Infinity** is the clean fix and it is a Ber and a Jah on top of everything else this build already costs.",

  hardcoreNotes:
    "Risky, and the risk is unusual enough to be worth spelling out. **Energy Shield means your health is a mana pool**, so a mana burn monster does not inconvenience you — it removes your health bar. Both defensive slots are Dreams, so there is no block and no resistance from either. And the Werebear variant cannot cast or teleport while shifted, which removes the escape option that makes Sorceresses survivable. If you play this in Hardcore, take the **Zeal variant** rather than Werebear, keep Chains of Honor, and treat mana-burn packs as a reason to leave the area rather than a challenge.",

  selfFoundNotes:
    "No. Two Jah runes plus a Beast (which contains a Ber) or a Passion is not a self-found project, and there is no partial version of the build that works — one Dream is half an aura and no attack runeword is no attack. Read this page as a destination. If the playstyle is what appeals rather than the cost, the Tesladin page describes a Paladin doing the same thing with better class support, and the Zealot page describes it with no high runes at all.",

  levelingPath: {
    summary:
      "There is no levelling version. Dream requires character level 65, Beast 63, and none of the build's skills do damage — a level 40 character with maxed Energy Shield has no way to kill anything. Level as a **Frozen Orb** or **Fire Ball Meteor** Sorceress, both of which are strong characters that need nothing expensive, and convert with a free Den of Evil respec once the runewords are actually in your inventory. Do not respec early.",
    respecAt: "Level 65+, and only once both Dreams and an attack runeword exist",
    viaBuild: "frozen-orb-sorceress",
  },

  confidence: "community",
  complete: true,
};
