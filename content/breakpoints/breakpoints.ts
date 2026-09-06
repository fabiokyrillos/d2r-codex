import type { BreakpointTable } from "@/lib/types";

/**
 * Breakpoint tables.
 *
 * Diablo II animations run at 25 frames per second, and speed stats do nothing
 * until they cross a threshold that removes a whole frame. 104% Faster Cast
 * Rate on a Sorceress is worth exactly as much as 63% — the 105 breakpoint is
 * where the frame actually drops.
 *
 * These are per-class, and several classes have more than one table. The
 * Sorceress's Lightning and Chain Lightning use a slower animation with its own
 * thresholds; planning a Lightning Sorceress against the standard table is a
 * common and expensive mistake.
 *
 * Verified against the D2Runewizard breakpoint database, which includes the
 * Warlock tables added by Reign of the Warlock.
 * See `docs/research/07-breakpoints.md`.
 */

const rows = (pairs: [number, number][]) =>
  pairs.map(([value, frames]) => ({ value, frames }));

export const breakpointTables: BreakpointTable[] = [
  // -------------------------------------------------------------------------
  // Faster Cast Rate
  // -------------------------------------------------------------------------
  {
    slug: "fcr-sorceress",
    name: "Sorceress — Faster Cast Rate",
    summary: "The standard Sorceress cast animation. Governs Teleport as well as spells.",
    stat: "fcr",
    classSlug: "sorceress",
    rows: rows([
      [0, 13],
      [9, 12],
      [20, 11],
      [37, 10],
      [63, 9],
      [105, 8],
      [200, 7],
    ]),
    guidance: [
      "**105% is the target.** It is reachable on a budget and it governs Teleport speed, which is what actually determines how fast you farm.",
      "**63%** is a sensible interim goal while levelling. A Spirit sword (35) plus Magefist (20) plus one 10% ring gets you there.",
      "**200%** requires giving up too much elsewhere on most setups, and there is nothing above it.",
      "A typical 105% setup: Spirit sword 35 + Spirit shield 35 + Magefist 20 + one 10% ring + Arachnid Mesh 20 = 120%.",
    ],
    confidence: "verified",
  },
  {
    slug: "fcr-sorceress-lightning",
    name: "Sorceress — Faster Cast Rate (Lightning)",
    summary:
      "Lightning and Chain Lightning use a different, slower animation with entirely different thresholds.",
    stat: "fcr",
    classSlug: "sorceress",
    variant: "Lightning / Chain Lightning only",
    rows: rows([
      [0, 19],
      [7, 18],
      [15, 17],
      [23, 16],
      [35, 15],
      [52, 14],
      [78, 13],
      [117, 12],
      [194, 11],
    ]),
    guidance: [
      "**This table applies only to Lightning and Chain Lightning.** Every other Sorceress spell — including Teleport — uses the standard table.",
      "A Lightning Sorceress therefore has two targets: **117%** for her damage spells, and **105%** for Teleport. In practice 117% satisfies both.",
      "Planning a Lightning Sorceress around the standard 105% breakpoint leaves her casting Chain Lightning at 13 frames instead of 12.",
    ],
    confidence: "verified",
  },
  {
    slug: "fcr-paladin-necromancer-warlock",
    name: "Paladin, Necromancer & Warlock — Faster Cast Rate",
    summary: "These three classes share an identical Faster Cast Rate table.",
    stat: "fcr",
    rows: rows([
      [0, 15],
      [9, 14],
      [18, 13],
      [30, 12],
      [48, 11],
      [75, 10],
      [125, 9],
    ]),
    guidance: [
      "**75%** is the standard target for a Hammerdin and for most Necromancers — a good balance of cost and benefit.",
      "**125%** is the final breakpoint and is worth chasing on a dedicated caster.",
      "The **Warlock** shares this table, which makes existing Paladin and Necromancer gear advice broadly transferable to the new class.",
    ],
    confidence: "verified",
  },
  {
    slug: "fcr-assassin",
    name: "Assassin — Faster Cast Rate",
    summary:
      "Mind Blast, Cloak of Shadows, Venom, the shadows, Teleport, and whichever of Fade or Burst of Speed you have up — not both. It does not govern trap laying.",
    stat: "fcr",
    classSlug: "assassin",
    variant: "Cast animation only",
    rows: rows([
      [0, 16],
      [8, 15],
      [16, 14],
      [27, 13],
      [42, 12],
      [65, 11],
      [102, 10],
      [174, 9],
    ]),
    guidance: [
      "**This table does not cover laying traps**, and that is the commonest mistake made about the class. A trap plays the Assassin's `S2` animation, which is on the *attack speed* calculation — weapon base speed, Increased Attack Speed and Burst of Speed. The cast animation this table describes is a different animation of a different length, so its numbers are not merely inapplicable to traps, they are the wrong table.",
      "**65%** is a sensible target for a Trapsin anyway, because **Mind Blast** is the button that opens every pack: 16 frames becomes 11.",
      "See the Increased Attack Speed note below for why trap laying cannot be tabulated the way this can.",
    ],
    confidence: "verified",
  },
  {
    slug: "fcr-druid",
    name: "Druid — Faster Cast Rate",
    summary: "Human form. Werewolf and Werebear use separate tables.",
    stat: "fcr",
    classSlug: "druid",
    variant: "Human form",
    rows: rows([
      [0, 18],
      [4, 17],
      [10, 16],
      [19, 15],
      [30, 14],
      [46, 13],
      [68, 12],
      [99, 11],
      [163, 10],
    ]),
    guidance: [
      "**99%** is the Wind Druid target.",
      "Werewolf form uses 0/7/15/26/40/63/99/163 and Werebear 0/6/14/26/40/60/95/157 — **gear planned for one form is wrong for another**.",
    ],
    confidence: "verified",
  },
  {
    slug: "fcr-amazon",
    name: "Amazon — Faster Cast Rate",
    summary: "Relevant mainly for Teleport from an Enigma.",
    stat: "fcr",
    classSlug: "amazon",
    rows: rows([
      [0, 19],
      [7, 18],
      [14, 17],
      [22, 16],
      [32, 15],
      [48, 14],
      [68, 13],
      [99, 12],
      [152, 11],
    ]),
    confidence: "verified",
  },
  {
    slug: "fcr-barbarian",
    name: "Barbarian — Faster Cast Rate",
    summary: "Shares the Sorceress table. Matters for Enigma teleporting and shout speed.",
    stat: "fcr",
    classSlug: "barbarian",
    rows: rows([
      [0, 13],
      [9, 12],
      [20, 11],
      [37, 10],
      [63, 9],
      [105, 8],
      [200, 7],
    ]),
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Faster Hit Recovery
  // -------------------------------------------------------------------------
  {
    slug: "fhr-sorceress",
    name: "Sorceress — Faster Hit Recovery",
    summary:
      "The Sorceress has the most punishing hit-recovery table in the game, and the smallest life pool to absorb the consequences.",
    stat: "fhr",
    classSlug: "sorceress",
    rows: rows([
      [0, 15],
      [5, 14],
      [9, 13],
      [14, 12],
      [20, 11],
      [30, 10],
      [42, 9],
      [60, 8],
      [86, 7],
      [142, 6],
      [280, 5],
    ]),
    guidance: [
      "**60%** is the practical target. Being stun-locked is one of the main ways a Sorceress dies, and 15 frames of recovery is over half a second of standing still.",
      "**30%** is a reasonable minimum while levelling — Stealth alone gives 25%.",
      "Cheap sources: Stealth (25), Spirit (55), Sandstorm Trek (20), rare boots and belts.",
    ],
    confidence: "verified",
  },
  {
    slug: "fhr-necromancer-druid-warlock",
    name: "Necromancer, Druid & Warlock — Faster Hit Recovery",
    summary: "These three share a table.",
    stat: "fhr",
    rows: rows([
      [0, 13],
      [5, 12],
      [10, 11],
      [16, 10],
      [26, 9],
      [39, 8],
      [56, 7],
      [86, 6],
      [152, 5],
      [377, 4],
    ]),
    guidance: ["**56%** is the usual target; **86%** if the slot is cheap."],
    confidence: "verified",
  },
  {
    slug: "fhr-paladin-assassin-barbarian",
    name: "Paladin, Assassin & Barbarian — Faster Hit Recovery",
    summary: "These three share a table.",
    stat: "fhr",
    rows: rows([
      [0, 9],
      [7, 8],
      [15, 7],
      [27, 6],
      [48, 5],
      [86, 4],
      [200, 3],
    ]),
    guidance: [
      "**48%** is the standard target. **86%** is worth it on a melee character that expects to be hit constantly.",
      "Note the Barbarian's table also varies by weapon type in some situations — this is the general case.",
    ],
    confidence: "verified",
  },
  {
    slug: "fhr-amazon",
    name: "Amazon — Faster Hit Recovery",
    stat: "fhr",
    classSlug: "amazon",
    summary: "One of the more forgiving tables.",
    rows: rows([
      [0, 11],
      [6, 10],
      [13, 9],
      [20, 8],
      [32, 7],
      [52, 6],
      [86, 5],
      [174, 4],
      [600, 3],
    ]),
    confidence: "verified",
  },
  {
    slug: "fhr-mercenary",
    name: "Act 2 Desert Mercenary — Faster Hit Recovery",
    summary:
      "The mercenary has his own table, identical to the Sorceress's. Worth planning for if he keeps dying.",
    stat: "fhr",
    variant: "Act 2 Desert Mercenary",
    rows: rows([
      [0, 15],
      [5, 14],
      [9, 13],
      [14, 12],
      [20, 11],
      [30, 10],
      [42, 9],
      [60, 8],
      [86, 7],
      [142, 6],
      [280, 5],
    ]),
    guidance: [
      "Treachery gives him 20% on its own, which is usually enough alongside its Fade proc.",
    ],
    confidence: "verified",
  },

  // -------------------------------------------------------------------------
  // Faster Block Rate
  // -------------------------------------------------------------------------
  {
    slug: "fbr-sorceress",
    name: "Sorceress — Faster Block Rate",
    summary:
      "Only relevant if you are deliberately building for block, which most Sorceresses are not.",
    stat: "fbr",
    classSlug: "sorceress",
    rows: rows([
      [0, 9],
      [7, 8],
      [15, 7],
      [27, 6],
      [48, 5],
      [86, 4],
      [200, 3],
    ]),
    guidance: [
      "Ignore this unless you are running a max-block Sorceress with a Stormshield and heavy Dexterity investment. For most builds the Dexterity is better spent on Vitality.",
    ],
    confidence: "verified",
  },
  {
    slug: "fbr-paladin-amazon-assassin",
    name: "Paladin, Amazon & Assassin — Faster Block Rate",
    summary: "The three classes with the best natural block. They share a table.",
    stat: "fbr",
    rows: rows([
      [0, 5],
      [13, 4],
      [32, 3],
      [86, 2],
      [600, 1],
    ]),
    guidance: [
      "**32%** is the standard target for a blocking Paladin. These classes reach useful block rates far more cheaply than anyone else.",
    ],
    confidence: "verified",
  },
  {
    slug: "fbr-necromancer-druid-warlock",
    name: "Necromancer, Druid & Warlock — Faster Block Rate",
    stat: "fbr",
    summary: "These three share a table.",
    rows: rows([
      [0, 11],
      [6, 10],
      [13, 9],
      [20, 8],
      [32, 7],
      [52, 6],
      [86, 5],
      [174, 4],
      [600, 3],
    ]),
    confidence: "verified",
  },
  {
    slug: "fbr-barbarian",
    name: "Barbarian — Faster Block Rate",
    stat: "fbr",
    classSlug: "barbarian",
    summary: "Between the caster and the blocker tables.",
    rows: rows([
      [0, 7],
      [9, 6],
      [20, 5],
      [42, 4],
      [86, 3],
      [280, 2],
    ]),
    confidence: "verified",
  },
];
