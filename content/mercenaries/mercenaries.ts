import type { Mercenary } from "@/lib/types";

/**
 * Mercenaries.
 *
 * The important practical facts: the aura or skill a mercenary offers is fixed
 * by the *difficulty you hire in*, not by the act alone, and a mercenary hired
 * in an earlier difficulty keeps their aura when you level them up. This is why
 * "hire an Act 2 Nightmare Might mercenary" is such a common instruction.
 */
export const mercenaries: Mercenary[] = [
  {
    slug: "act-2-desert-mercenary",
    name: "Act 2 Desert Mercenary",
    summary:
      "The default choice for almost every build. Carries an aura, uses polearms and spears, and is the reason Insight and Infinity exist.",
    act: 2,
    hireAdvice:
      "Hire in Nightmare. Nightmare offers the strongest aura selection for most builds, and the mercenary levels with you regardless of when you hired them. Hiring in Hell is more expensive with no lasting benefit.",
    abilities: [
      {
        name: "Might",
        difficulty: "nightmare",
        description:
          "Increases the physical damage of the mercenary and everyone nearby. The default pick for caster builds that need something to kill immune monsters.",
      },
      {
        name: "Holy Freeze",
        difficulty: "nightmare",
        description:
          "Chills everything around the mercenary, slowing attacks and movement. The strongest defensive aura in the game and a common Hardcore choice.",
      },
      {
        name: "Defiance",
        difficulty: "nightmare",
        description:
          "Increases defense. Rarely chosen — defense scales poorly in Hell compared with simply not being hit.",
      },
      {
        name: "Blessed Aim",
        difficulty: "normal",
        description:
          "Increases attack rating. Useful for physical builds that struggle to hit, otherwise skippable.",
      },
      {
        name: "Prayer / Thorns",
        difficulty: "normal",
        description:
          "Prayer regenerates life for the party. Niche, but a genuine option for a very low-budget Hardcore character.",
      },
    ],
    weaponTypes: ["Polearms", "Spears", "Javelins"],
    strengths: [
      "The aura applies to you as well as to him",
      "Polearms and spears carry Insight, Infinity, Fortitude and Pride",
      "Highest damage output of any mercenary once geared",
      "Meditation from Insight solves caster mana permanently",
    ],
    weaknesses: [
      "Melee only — he has to reach what he is killing",
      "Dies easily in Hell without life steal and resistances",
      "Slow to catch up when you Teleport across a zone",
    ],
    bestFor:
      "Nearly every build. A caster wants Insight for Meditation and Might to kill immunes; a physical build wants Might or Fanaticism-adjacent damage; a Hardcore character wants Holy Freeze.",
    gear: [
      {
        slot: "weapon",
        tier: "budget",
        ref: { kind: "runeword", slug: "insight" },
        why: "Meditation removes mana potions from your life. Make this the moment you have four common runes and a 4-socket polearm — it is the highest-impact item in the whole mercenary setup.",
      },
      {
        slot: "weapon",
        tier: "endgame",
        ref: { kind: "runeword", slug: "infinity" },
        why: "Conviction lowers enemy resistances for you, and the -45-55% enemy lightning resistance breaks lightning immunity outright. Build-defining for lightning casters, strong for everyone else.",
      },
      {
        slot: "body",
        tier: "budget",
        ref: { kind: "runeword", slug: "treachery" },
        why: "The 5% chance to cast Fade when struck is the single best survivability effect available on a cheap mercenary armor. Fade grants a large resistance and damage-reduction buff.",
      },
      {
        slot: "body",
        tier: "endgame",
        ref: { kind: "runeword", slug: "fortitude" },
        why: "+200% enhanced defense and a large life bonus per level. The standard endgame mercenary armor once you can afford a Lo rune.",
      },
      {
        slot: "helm",
        tier: "budget",
        ref: { kind: "unique", slug: "vampire-gaze" },
        why: "Life steal keeps him alive, and 15-20% physical damage reduction stacks with everything else. Cheap and available from Nightmare.",
      },
      {
        slot: "helm",
        tier: "endgame",
        label: "Andariel's Visage",
        why: "+2 all skills, high increased attack speed and strong life steal. Its -30% fire resistance is a real drawback — pair it with a Ral rune socketed to offset the penalty.",
      },
    ],
    survivability:
      "Life steal is not optional in Hell — without it he will die repeatedly regardless of his defense. Aim for life steal on the helm, Fade or resistances on the armor, and accept that he is a damage source, not a tank.",
    notes: [
      "Reviving a dead mercenary costs gold that scales with your level. It becomes expensive but never prohibitive.",
      "He keeps his aura from the difficulty you hired in, permanently. You cannot change it later without re-hiring.",
      "Ethereal weapons are ideal: mercenaries do not reduce durability, so an ethereal Giant Thresher lasts forever at higher damage.",
    ],
    confidence: "verified",
  },
  {
    slug: "act-1-rogue-scout",
    name: "Act 1 Rogue Scout",
    summary:
      "A ranged mercenary who applies Cold or Fire arrows. Safer positioning, much lower damage.",
    act: 1,
    hireAdvice:
      "Hire in Nightmare if you want one. Cold Arrow is the more useful of the two variants because the chill it applies is real crowd control.",
    abilities: [
      {
        name: "Cold Arrow",
        description:
          "Adds cold damage and chills targets. The chill is worth more than the damage — it slows everything she hits.",
      },
      {
        name: "Fire Arrow",
        description: "Adds fire damage. Straightforwardly worse than Cold Arrow for most builds.",
      },
    ],
    weaponTypes: ["Bows"],
    strengths: [
      "Attacks from range, so she survives without gear investment",
      "Cold Arrow chills, which helps every build",
      "Can use bow runewords like Faith and Harmony",
    ],
    weaknesses: [
      "Very low damage compared with an Act 2 mercenary",
      "No aura — she contributes nothing to your own character",
      "Bows have far fewer good runeword options than polearms",
    ],
    bestFor:
      "Builds that want a safe, self-sufficient body double rather than a damage source. A reasonable early-game choice, rarely correct at endgame.",
    gear: [
      {
        slot: "weapon",
        tier: "budget",
        label: "Any high-damage bow",
        why: "Her damage is low regardless, so a cheap bow with good base damage is fine.",
      },
      {
        slot: "body",
        tier: "budget",
        ref: { kind: "runeword", slug: "treachery" },
        why: "Same reasoning as on the Act 2 mercenary — the Fade proc is the value.",
      },
      {
        slot: "helm",
        tier: "budget",
        ref: { kind: "unique", slug: "vampire-gaze" },
        why: "Damage reduction. She steals less usefully than a melee mercenary because she is rarely being hit.",
      },
    ],
    survivability:
      "Naturally good — she stays at range and rarely takes hits. This is her main selling point.",
    confidence: "verified",
  },
  {
    slug: "act-3-iron-wolf",
    name: "Act 3 Iron Wolf",
    summary:
      "A spellcasting mercenary who uses a weapon and shield. Widely considered the weakest option.",
    act: 3,
    hireAdvice:
      "Generally, do not. If you want one, the Cold variant's Glacial Spike provides some crowd control.",
    abilities: [
      { name: "Fire", description: "Casts Fire Ball and Inferno." },
      { name: "Cold", description: "Casts Glacial Spike and Frozen Armor. The most useful of the three." },
      { name: "Lightning", description: "Casts Lightning and Charged Bolt." },
    ],
    weaponTypes: ["Swords", "Shields"],
    strengths: [
      "The only mercenary that can equip a shield, so he can carry a Spirit or a resistance shield",
      "His spell damage ignores physical immunity",
    ],
    weaknesses: [
      "Very low damage; his spells do not scale with your gear meaningfully",
      "No aura",
      "Fragile, and he closes to a dangerous range to cast",
    ],
    bestFor:
      "Almost nothing at endgame. He exists mainly as a curiosity and for players who want a shield slot to park an item in.",
    gear: [
      {
        slot: "weapon",
        tier: "budget",
        label: "Any sword with +skills",
        why: "His damage comes from his own spell levels, so +skills matters more than weapon damage.",
      },
    ],
    survivability: "Poor. He is a caster with melee positioning instincts.",
    confidence: "verified",
  },
  {
    slug: "act-5-barbarian",
    name: "Act 5 Barbarian",
    summary:
      "A pure melee bruiser with a large life pool. No aura, but he can dual-wield and he does not die.",
    act: 5,
    hireAdvice:
      "Hire in Nightmare. He is a durability pick, not a damage pick.",
    abilities: [
      {
        name: "Bash / Stun",
        description:
          "He attacks with Bash and can stun. In current versions he can dual-wield, which meaningfully raises his damage ceiling.",
      },
    ],
    weaponTypes: ["Swords", "Axes", "Maces"],
    strengths: [
      "By far the largest life pool of any mercenary",
      "Can dual-wield one-handed weapons",
      "Survives content that kills an Act 2 mercenary outright",
    ],
    weaknesses: [
      "No aura at all — he gives your character nothing",
      "Cannot use polearms, so no Insight and no Infinity",
      "Damage is mediocre without expensive weapons",
    ],
    bestFor:
      "Builds that need a body to absorb hits rather than an aura. A defensible Hardcore choice, and a reasonable pick for a character that already has all the mana and resistances it needs.",
    gear: [
      {
        slot: "weapon",
        tier: "budget",
        label: "Two one-handed weapons with life steal",
        why: "Dual-wielding roughly doubles his attacks. Life steal keeps him standing.",
      },
      {
        slot: "body",
        tier: "budget",
        ref: { kind: "runeword", slug: "treachery" },
        why: "The Fade proc, as with every other mercenary.",
      },
      {
        slot: "helm",
        tier: "budget",
        ref: { kind: "unique", slug: "vampire-gaze" },
        why: "Life steal and damage reduction.",
      },
    ],
    survivability:
      "The best of any mercenary. If your problem is 'my mercenary keeps dying', he is the answer — as long as you can live without an aura.",
    notes: [
      "Giving up Insight is the real cost. If you are a caster relying on Meditation, this trade is usually wrong.",
    ],
    confidence: "single",
  },
];
