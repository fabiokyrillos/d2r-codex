import type { Build } from "@/lib/types";

/**
 * The Zealot.
 *
 * The one Paladin that levels as itself from level 12 and never needs a
 * respec, which is why it doubles as the class's default levelling answer.
 *
 * Two numbers from the game's own skills.txt shape the whole page:
 *
 * - Zeal's hit count is `min(2 + level - 1, 5)`, so it reaches its five-hit
 *   ceiling at **skill level 4**. Points five through twenty buy damage only.
 *   That is the difference between "one point or max it" being a real question
 *   and it being folklore.
 * - Zeal's only synergy is Sacrifice, at 12% per level, and its own damage is
 *   +6% per level from level five onward.
 *
 * Fanaticism is 10-40% attack speed and 50% damage baseline with +17% per
 * level; Holy Shield is 10-40% block with Defiance as a 15%-per-level armour
 * synergy.
 */
export const zealot: Build = {
  slug: "zealot",
  name: "Zealot",
  classSlug: "paladin",
  summary:
    "Five hits per swing with a self-cast attack-speed aura and permanent maximum block. The Paladin that never needs a respec.",
  damageTypes: ["physical"],
  primarySkill: "zeal",
  playstyle:
    "Walk into a group and hold the attack button. Zeal locks you into a sequence of up to five swings — the first on your target, the rest on whatever is next to it — and Fanaticism makes that sequence fast. There is no positioning problem and no aiming problem. The two things that will kill you are the animation lock, which means you cannot react mid-sequence, and being chilled, which stretches that lock out. Both have the same fix, and it is a ring.",
  strengths: [
    "Levels as itself from 12 and never needs a respec — the only Paladin build that is true of",
    "Fanaticism is a self-cast aura, so your damage does not depend on finding an aura item",
    "Maximum block with Holy Shield plus high resistances; genuinely hard to kill",
    "Excellent against single targets and Uber bosses, at a fraction of a Smiter's specialisation",
    "New-player friendly. The rotation is one button",
  ],
  weaknesses: [
    "Physical damage only, which makes Hell physical immunes a hard wall",
    "Poor at density. Zeal hits a handful of adjacent targets, not a screen",
    "Heavily weapon-dependent — this build is only as good as what it is holding",
    "The Zeal animation lock means you cannot react, dodge or drink mid-sequence",
    "Repetitive, and honest sources say so",
  ],
  difficulty: "beginner",
  budget: "medium",
  ratings: {
    clearSpeed: 3,
    bossing: 4,
    survivability: 5,
    magicFind: 2,
    terrorZones: 3,
    ubers: 4,
    soloSelfFound: 4,
    players8: 3,
  },

  skills: [
    {
      skill: "zeal",
      points: 20,
      role: "main",
      order: 1,
      note: "**Four points reach the five-hit cap.** Everything after that is +6% damage per point, which is still worth maxing — but knowing where the cap sits tells you when it is safe to spend elsewhere first.",
    },
    {
      skill: "fanaticism",
      points: 20,
      role: "main",
      order: 2,
      note: "Attack speed and damage, on yourself and your mercenary. Available at level 30 and the single biggest jump the build makes.",
    },
    {
      skill: "sacrifice",
      points: 20,
      role: "synergy",
      order: 3,
      note: "Zeal's only synergy, at 12% damage per level. Do not cast it — the self-damage is real. It is a passive investment.",
    },
    {
      skill: "holy-shield",
      points: 20,
      role: "utility",
      order: 4,
      note: "Block and defence. Max this last of the four; the first point already does most of the work for the block requirement.",
    },
    { skill: "smite", points: 1, role: "prerequisite", note: "On the way to Holy Shield, and a free stun when you need one." },
    { skill: "might", points: 1, role: "prerequisite" },
    { skill: "blessed-aim", points: 1, role: "prerequisite" },
    { skill: "concentration", points: 1, role: "prerequisite", note: "On the way to Fanaticism, and the aura to switch to when you would rather not die." },
    { skill: "prayer", points: 1, role: "prerequisite" },
    { skill: "defiance", points: 1, role: "prerequisite" },
    { skill: "vigor", points: 1, role: "utility", note: "Run speed. One point, permanently useful." },
    { skill: "cleansing", points: 1, role: "prerequisite" },
    { skill: "meditation", points: 1, role: "prerequisite" },
    {
      skill: "redemption",
      points: 1,
      role: "utility",
      note: "Corpses into life and mana. Useful even with life steal, because it works between fights when steal cannot.",
    },
    { skill: "resist-fire", points: 1, role: "prerequisite" },
    { skill: "resist-cold", points: 1, role: "prerequisite" },
    { skill: "resist-lightning", points: 1, role: "utility", note: "Raises maximum lightning resistance." },
    { skill: "salvation", points: 1, role: "utility", note: "A one-point resistance aura to swap to in Uber Tristram." },
    { skill: "charge", points: 1, role: "utility", note: "Transport before Enigma." },
  ],
  flexPoints: [
    "**Defiance** is the best remaining sink. It is a 15%-per-level armour synergy for Holy Shield, so it compounds with a stat you are already investing in.",
    "**More Resist Lightning** if you intend to fight Uber Mephisto, whose Conviction aura is aimed squarely at your resistances.",
    "**Holy Freeze** at one point is a legitimate alternative aura when you would rather slow a pack than kill it faster. It costs the prerequisite chain through Holy Fire, so decide before you spend.",
    "**Increased Attack Speed is not published as a breakpoint table here.** Zeal's frame thresholds depend on the weapon's speed modifier and the game's animation data, and no source we treat as reliable publishes them. In practice Fanaticism plus a Grief covers it; we would rather say that than print an unverified number.",
  ],
  stats: {
    strength: "Enough for your gear. The weapon usually sets the number, not the armour.",
    dexterity:
      "Enough for maximum block **with Holy Shield running**, plus your weapon's requirement. A Phase Blade alone asks 136, which for most Zealots covers the block requirement on its own.",
    vitality: "Everything else.",
    energy: "None. Zeal is cheap and Redemption plus an Insight mercenary cover the rest.",
    notes: [
      "**Check block with Holy Shield active.** Checking with the buff down is how Paladins over-invest fifty points in Dexterity and never get them back without a respec.",
      "Pick the weapon before spending anything. A Phase Blade, a Berserker Axe and a scepter have wildly different requirements and the Dexterity plan follows from that choice.",
      "Resistances come from gear and charms, not stats. Do not try to solve Hell with attribute points.",
    ],
  },
  breakpoints: [
    {
      stat: "fhr",
      value: 48,
      frames: 5,
      priority: "recommended",
      why: "The practical target for a build that stands still while its attack plays out. Being interrupted mid-Zeal is how the animation lock turns into a death.",
    },
    {
      stat: "fbr",
      value: 32,
      frames: 3,
      priority: "recommended",
      why: "Cheap, and worth more than the raw block percentage — recovery frames decide whether you can act between blocked hits.",
    },
    {
      stat: "fhr",
      value: 86,
      frames: 4,
      priority: "luxury",
      why: "Reachable with a Verdungo's belt and a rare ring, usually at the cost of resistance you need more.",
    },
  ],

  gearSets: [
    {
      tier: "starter",
      goal: "Zeal at 12, through Normal, into Nightmare.",
      levelRange: [1, 40],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              label: "Any fast one-handed weapon with a good damage roll",
              why: "Zeal multiplies whatever you are holding by up to five hits, so base speed matters more than base damage at this stage. Buy scepters from vendors and re-check every time you are in town.",
              lookFor: ["+2 Combat Skills", "+3 Zeal", "+3 Sacrifice", "High attack speed"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "ancients-pledge" },
              why: "Near-capped resistances for three Countess runes, on a shield class that adds resistance of its own.",
              sockets: "Ral, Ort, Tal into a 3-socket Paladin shield.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "stealth" },
              why: "25% Faster Hit Recovery and 25% run speed, from two of the commonest runes in the game.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [{ ref: { kind: "runeword", slug: "lore" }, why: "+1 to All Skills for two runes." }],
        },
      ],
      nextUpgrade:
        "Level 30 for Fanaticism. Until then, run Might — it is the same idea with a smaller number.",
      notes:
        "Zeal is available at 12 and immediately usable, which is why this is the standard Paladin levelling build. Four points give you all five hits; put the rest wherever you like until 30.",
    },

    {
      tier: "nightmare",
      goal: "Fanaticism online, a real weapon, resistances heading to 75%.",
      levelRange: [30, 60],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "passion" },
              why: "Attack speed and a Berserk charge for the physical immunes you cannot otherwise touch. Cheap, and it solves a real problem early.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "kingslayer" },
                  why: "More damage and 33% Crushing Blow if you can find the four mid runes. Better against bosses, worse against packs.",
                },
              ],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "herald-of-zakarum" },
              why: "+2 Paladin skills, +2 Combat Skills, +50 all resistances and 30% increased blocking. The best-value Paladin shield in the game.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "treachery" },
              why: "The Fade proc raises resistances and cuts physical damage, and it costs three cheap runes.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "vampire-gaze" },
              why: "Life steal and damage reduction. Unlike a Smiter, a Zealot genuinely benefits from the steal.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [
            {
              ref: { kind: "unique", slug: "raven-frost" },
              why: "**Cannot Be Frozen.** Being chilled stretches the Zeal animation lock, which is the single most common way this build dies.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [
            {
              ref: { kind: "unique", slug: "gore-rider" },
              why: "Crushing Blow, Deadly Strike and Open Wounds together, plus 30% run speed. Unlike a Smiter, a Zealot uses all three.",
            },
          ],
        },
      ],
      charms: [
        {
          label: "Resistance and life small charms",
          why: "The cheapest resistance in the game, and resistance is what stops Hell from being impossible.",
        },
      ],
      nextUpgrade: "A Grief, and a plan for physical immunes.",
    },

    {
      tier: "early-hell",
      goal: "Survive Hell and have an answer to physical immunity.",
      levelRange: [60, 75],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "kingslayer" },
              why: "Crushing Blow and Open Wounds carry you against anything with a large health pool, and the +1 Vengeance is a genuine physical-immunity escape hatch.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            { ref: { kind: "unique", slug: "herald-of-zakarum" }, why: "Resistances and skills, unchanged." },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "duress" },
              why: "15% Crushing Blow, cold damage and heavy damage reduction, for three mid runes. The cold damage also chips at physical immunes.",
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Rare or crafted gloves with 20% Increased Attack Speed",
              why: "Attack speed and resistances on a slot with no strong unique competition for this build.",
              lookFor: ["20% Increased Attack Speed", "Resistances", "+2 Combat Skills (crafted)"],
            },
          ],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "Damage reduction and life steal, which is exactly what a melee character in Hell is short of.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "highlords-wrath" },
              why: "+1 all skills, 20% attack speed and Deadly Strike that grows with your level. The default melee amulet, and unlike a Smiter you use every line of it.",
            },
          ],
        },
      ],
      charms: [
        {
          label: "Bone Break (physical Sunder Charm)",
          why: "The direct answer to physical immunity. It costs a charm slot and some damage reduction, and it turns a hard wall into a slow fight.",
        },
        { label: "Resistance and life small charms", why: "Hold 75% in all four." },
      ],
      nextUpgrade: "Grief. It is the largest single damage upgrade this build will ever make.",
      notes:
        "This is the tier where physical immunity stops being theoretical. Decide your answer here — sunder charm, mercenary, or walking past — rather than discovering the problem in Act 2.",
    },

    {
      tier: "budget",
      goal: "Clear Hell comfortably and start on the mini-Ubers.",
      levelRange: [75, 85],
      slots: [
        {
          slot: "weapon",
          picks: [
            {
              ref: { kind: "runeword", slug: "grief" },
              why: "Its flat damage bonus is applied after Enhanced Damage multipliers, which makes it far better on a fast five-hit attack than its listed damage suggests. This is the build's defining item.",
              sockets: "Eth, Tir, Lo, Mal, Ral into a 5-socket Phase Blade.",
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "unique", slug: "herald-of-zakarum" },
              why: "Still excellent. Exile is the upgrade, and it is mostly a defensive one.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "exile" },
                  why: "Life Tap on striking and a Defiance aura. Take it for Ubers; Herald of Zakarum is better for general clearing.",
                },
              ],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "fortitude" },
              why: "+300% Enhanced Damage, which on a physical build is the largest damage line available outside the weapon.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "chains-of-honor" },
                  why: "Trade the damage for +65 all resistances and 8% damage reduction. The right call in Hardcore.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "vampire-gaze" },
              why: "Life steal and damage reduction, cheaply.",
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow, Deadly Strike, Open Wounds." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Skills, attack speed, Deadly Strike." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              ref: { kind: "unique", slug: "nagelring" },
              why: "Magic find while you farm, or a rare ring with life steal and resistances if you are dying.",
            },
          ],
        },
      ],
      charms: [
        { label: "Bone Break (physical Sunder Charm)", why: "Physical immunes." },
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills and resistances." },
        { label: "Annihilus", why: "+1 all skills, attributes and resistances." },
      ],
      weaponSwap: [
        {
          ref: { kind: "runeword", slug: "call-to-arms" },
          why: "Battle Orders before anything dangerous. Roughly a third more life for one keypress.",
        },
      ],
      nextUpgrade: "Fortitude if you took Chains of Honor, or Enigma if you are tired of walking.",
    },

    {
      tier: "optimized",
      goal: "Fast Hell clears and reliable Uber runs.",
      levelRange: [80, 90],
      slots: [
        {
          slot: "weapon",
          picks: [{ ref: { kind: "runeword", slug: "grief" }, why: "Unchanged. Nothing replaces it." }],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "exile" },
              why: "Life Tap, a Defiance aura and +2 Offensive Auras — which raises Fanaticism itself.",
              sockets: "Vex, Ohm, Ist, Dol into a 4-socket Paladin shield. Ethereal base; it repairs itself.",
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "fortitude" },
              why: "+300% Enhanced Damage and +200 defence. The damage armour for a physical build.",
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "crown-of-ages" },
              why: "+1 skills, resistances, damage reduction and up to two sockets for more attack speed.",
              lookFor: ["2 sockets", "30% all resistances", "15% damage reduction"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted Blood gloves with 20% Increased Attack Speed",
              why: "Attack speed, life and resistances in one slot, and craftable rather than found.",
              lookFor: ["20% Increased Attack Speed", "Life", "Resistances"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "The melee boot. Nothing competes." }],
        },
        {
          slot: "belt",
          picks: [{ ref: { kind: "unique", slug: "string-of-ears" }, why: "Damage reduction and life steal." }],
        },
        {
          slot: "amulet",
          picks: [{ ref: { kind: "unique", slug: "highlords-wrath" }, why: "Deadly Strike grows with your level." }],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring with life steal, resistances and Faster Hit Recovery",
              why: "The one slot where a well-rolled rare beats every unique for this build.",
              lookFor: ["6%+ Life Stolen per Hit", "Resistances", "10% Faster Hit Recovery"],
            },
          ],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills." },
        { label: "Annihilus", why: "+1 all skills." },
        { label: "Bone Break (physical Sunder Charm)", why: "Swap in when the zone is full of physical immunes." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap; its +2 skills raise the Battle Orders." },
      ],
      nextUpgrade: "Enigma, for Teleport. It changes clear speed more than any damage upgrade left.",
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
              ref: { kind: "runeword", slug: "grief" },
              why: "A 400-damage roll in an ethereal Phase Blade.",
              lookFor: ["400 damage", "40% Increased Attack Speed"],
            },
          ],
        },
        {
          slot: "offhand",
          picks: [
            {
              ref: { kind: "runeword", slug: "exile" },
              why: "Ethereal Paladin shield with a high all-resistances roll.",
              lookFor: ["Level 16 Defiance", "Ethereal base", "45 all resistances"],
            },
          ],
        },
        {
          slot: "body",
          picks: [
            {
              ref: { kind: "runeword", slug: "enigma" },
              why: "Teleport. At this point mobility is worth more than the damage Fortitude would give.",
              alternatives: [
                {
                  ref: { kind: "runeword", slug: "fortitude" },
                  why: "Keep Fortitude if you have Teleport from elsewhere, or if raw damage matters more than movement to how you play.",
                },
              ],
            },
          ],
        },
        {
          slot: "helm",
          picks: [
            {
              ref: { kind: "unique", slug: "crown-of-ages" },
              why: "Two sockets, maximum resistances, maximum damage reduction.",
              lookFor: ["2 sockets", "30 all resistances", "15% damage reduction"],
            },
          ],
        },
        {
          slot: "gloves",
          picks: [
            {
              label: "Crafted Blood gloves, 20% Increased Attack Speed",
              why: "Attack speed, life, life steal and resistances.",
              lookFor: ["20% Increased Attack Speed", "+3 Combat Skills", "Life steal"],
            },
          ],
        },
        {
          slot: "boots",
          picks: [{ ref: { kind: "unique", slug: "gore-rider" }, why: "Crushing Blow and Deadly Strike." }],
        },
        {
          slot: "belt",
          picks: [
            {
              ref: { kind: "unique", slug: "string-of-ears" },
              why: "15% damage reduction and 8% life steal on maximum rolls.",
            },
          ],
        },
        {
          slot: "amulet",
          picks: [
            {
              ref: { kind: "unique", slug: "highlords-wrath" },
              why: "At level 90 the Deadly Strike roll is worth roughly 34%.",
            },
          ],
        },
        {
          slot: "ring1",
          picks: [{ ref: { kind: "unique", slug: "raven-frost" }, why: "Cannot Be Frozen, 20 Dexterity." }],
        },
        {
          slot: "ring2",
          picks: [
            {
              label: "Rare ring: life steal, resistances, Faster Hit Recovery, Attack Rating",
              why: "The last slot to perfect, and the only one where a rare is the ceiling.",
              lookFor: ["6-7% Life Stolen per Hit", "Two or more resistances", "10% Faster Hit Recovery"],
            },
          ],
        },
      ],
      charms: [
        { label: "Hellfire Torch (Paladin)", why: "+3 Paladin skills, 20 all resistances." },
        { label: "Annihilus", why: "+1 all skills, 20 attributes, 20 resistances." },
        { label: "Life and resistance small charms", why: "The rest of the inventory." },
      ],
      weaponSwap: [
        { ref: { kind: "runeword", slug: "call-to-arms" }, why: "Battle Orders." },
        { ref: { kind: "runeword", slug: "spirit" }, why: "Off-hand for the swap." },
      ],
      notes:
        "The Enigma-versus-Fortitude choice is genuinely open. Fortitude is more damage; Enigma is more content cleared per hour. Most players end up with both and swap by activity.",
    },
  ],

  mercenary: "act-2-desert-mercenary",
  mercenaryNotes:
    "Take **Might** from Nightmare Act 2 — it stacks with your own Fanaticism in the sense that you run Fanaticism and he emanates nothing, so his aura choice is really about his own damage. **Holy Freeze** is the alternative and the more common pick: slowing a pack is worth more to a build with an animation lock than his personal damage is. Give him an Insight for your mana and a Reaper's Toll later if you want Decrepify on everything.",

  farming: [
    {
      area: "travincal",
      difficulty: "hell",
      why: "The Council are tightly packed single targets with large health pools, which is exactly what Zeal and Crushing Blow are for.",
      minTier: "budget",
      rating: 5,
    },
    {
      area: "pit",
      difficulty: "hell",
      why: "Area level 85, dense, and mostly physical-vulnerable. The best general Zealot farm.",
      minTier: "budget",
      rating: 4,
    },
    {
      area: "ancient-tunnels",
      difficulty: "hell",
      why: "Area level 85 with few physical immunes and a short route.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "pindleskin",
      difficulty: "hell",
      why: "A single high-level target ten seconds from a portal.",
      minTier: "early-hell",
      rating: 4,
    },
    {
      area: "uber-tristram",
      difficulty: "hell",
      why: "A Zealot with Life Tap and capped resistances kills Ubers slower than a Smiter but perfectly reliably — and unlike a Smiter it can farm the rest of the game too.",
      minTier: "optimized",
      rating: 3,
    },
    {
      area: "mausoleum",
      difficulty: "hell",
      why: "Area level 85, dense, and close to a waypoint. Undead take extra from nothing you have, but the density suits five-hit swings.",
      minTier: "budget",
      rating: 3,
    },
    {
      area: "chaos-sanctuary",
      difficulty: "hell",
      why: "Doable but not ideal — the Oblivion Knights cast Iron Maiden, which reflects your physical damage straight back.",
      minTier: "optimized",
      rating: 2,
    },
  ],

  immunityPlan:
    "Zeal is pure physical damage, so physical immunity is the build's one real wall — and in Hell it is common. There are three honest answers and you should pick one rather than hoping. **A Bone Break sunder charm** breaks physical immunity directly, at the cost of a charm slot and some damage reduction. **Your mercenary** with an elemental weapon kills what you cannot touch. **A secondary damage source** — Passion's Berserk charge, Duress's cold damage, or the +1 Vengeance on a Kingslayer — gives you something to swing that is not physical. Walking past is also legitimate; you are not obliged to kill everything. The other hazard is not immunity at all: **Iron Maiden from Oblivion Knights in the Chaos Sanctuary reflects your physical damage**, and a five-hit attack against a reflected damage curse kills Zealots outright.",

  hardcoreNotes:
    "Strong in Hardcore with two specific dangers. The first is **Iron Maiden** — a Zealot who holds the attack button into a reflected-damage curse dies to their own swings before they can react, and this is the single most common Hardcore Zealot death. Learn the Oblivion Knight cast animation or avoid the Chaos Sanctuary. The second is the **animation lock**: you cannot drink, dodge or teleport mid-Zeal, so a Cannot Be Frozen source is not optional and Chains of Honor is a better armour than Fortitude. Otherwise maximum block, high resistances and life steal make this one of the safest builds in the game.",

  selfFoundNotes:
    "One of the best self-found Paladins. It levels as itself with no respec, its early weapons come from vendors, Herald of Zakarum and Gore Rider drop in Hell, and Raven Frost is common. Grief is the only genuinely hard requirement and the build clears Hell without it — Kingslayer or a well-rolled rare weapon is enough. The one thing self-found players should plan for is a physical-immunity answer, because that cannot be improvised.",

  levelingPath: {
    summary:
      "This is the levelling build. Zeal is available at level 12 and four points give you all five hits, so it is immediately effective. Run Might until Fanaticism unlocks at 30, then simply keep spending — there is no respec and no transition. If you intend to end as a Smiter or a Hammerdin, this is still the route you take to get there.",
  },

  confidence: "verified",
  complete: true,
};
