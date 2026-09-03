/**
 * Controls for the Necromancer pass, pinned against the Tier 1 columns they
 * were read from.
 *
 * The pattern is `scripts/item-rules.ts`: a small, explicit control set on the
 * things that went wrong, or would have gone wrong, rather than a second copy
 * of the catalogue. Nothing here reads content; the caller supplies it, so the
 * tests can hand these functions a deliberately corrupted graph.
 */

/**
 * The golem ring, as the game's own rows state it.
 *
 * Each golem's `*Param8 Description` names the stat it *gives* and its `Param8`
 * carries the magnitude, and the other three read that parameter through
 * `skill('X'.par8)`. Those four numbers are the whole reason the extraction rule
 * had to learn about parameter ownership: read off the receiving row instead,
 * Clay Golem's contribution to the Iron Golem would have come out as
 * "attack rating, 20" in every direction, because 20 is Clay Golem's own number
 * and attack rating is Clay Golem's own stat.
 *
 * Pinned here rather than derived from the graph. A control that recomputes what
 * it is checking is the arrangement `docs/sources/README.md` records as the
 * reason fourteen build pages shipped unspendable plans: the validator and the
 * thing under test shared a source, so it could not fail.
 */
export const GOLEM_SYNERGY_CONTROLS: readonly {
  readonly source: string;
  readonly kind: string;
  readonly magnitude: number;
}[] = [
  { source: "clay-golem", kind: "attack-rating", magnitude: 20 },
  { source: "blood-golem", kind: "hp", magnitude: 5 },
  { source: "iron-golem", kind: "armor", magnitude: 35 },
  { source: "fire-golem", kind: "damage", magnitude: 6 },
];

export interface NecromancerProblem {
  rule:
    | "golem-edge-missing"
    | "golem-kind-wrong"
    | "golem-magnitude-wrong"
    | "golem-magnitude-absent"
    | "golem-edge-unaccounted"
    | "golem-self-edge"
    | "published-value-wrong"
    | "published-matches-stale-source"
    | "published-missing"
    | "mana-on-passive";
  message: string;
}

/**
 * Every golem receives from the other three, with the kind and magnitude that
 * belong to the *source*, and from nothing else.
 *
 * The "and from nothing else" half matters as much as the rest. Skeleton
 * Mastery, Golem Mastery and Summon Resist all reach golems and skeletons in
 * the game, and none of them does it through a synergy parameter scaling a base
 * level — so none of them is an edge, and a rule that only checked the twelve
 * expected edges would not notice a fourth arriving.
 */
export function checkGolemSynergies(
  graph: Record<string, { synergies: readonly { from: string; kinds: readonly string[]; magnitude?: number }[] }>,
  controls: typeof GOLEM_SYNERGY_CONTROLS,
): NecromancerProblem[] {
  const problems: NecromancerProblem[] = [];
  const add = (rule: NecromancerProblem["rule"], message: string) =>
    problems.push({ rule, message });

  const golems = controls.map((c) => c.source);
  const controlFor = new Map(controls.map((c) => [c.source, c]));

  for (const receiver of golems) {
    const node = graph[receiver];
    if (!node) {
      add("golem-edge-missing", `${receiver} is not in the graph at all`);
      continue;
    }
    const received = new Map(node.synergies.map((s) => [s.from, s]));

    for (const source of golems) {
      const control = controlFor.get(source)!;
      const edge = received.get(source);

      if (source === receiver) {
        if (edge) add("golem-self-edge", `${receiver} receives a synergy from itself`);
        continue;
      }
      if (!edge) {
        add(
          "golem-edge-missing",
          `${receiver} receives no synergy from ${source}; the game gives it ` +
            `${control.kind} at ${control.magnitude}`,
        );
        continue;
      }
      if (edge.kinds.length !== 1 || edge.kinds[0] !== control.kind) {
        add(
          "golem-kind-wrong",
          `${receiver} <- ${source} is [${edge.kinds.join(", ")}], and ${source}'s own row ` +
            `calls it "${control.kind}"`,
        );
      }
      if (edge.magnitude === undefined) {
        add(
          "golem-magnitude-absent",
          `${receiver} <- ${source} carries no magnitude. The coefficient sits on ${source}'s ` +
            `row, so the graph is able to state it and should.`,
        );
      } else if (edge.magnitude !== control.magnitude) {
        add(
          "golem-magnitude-wrong",
          `${receiver} <- ${source} is ${edge.magnitude}, and ${source}'s Param8 is ` +
            `${control.magnitude}`,
        );
      }
    }

    for (const source of received.keys()) {
      if (!controlFor.has(source)) {
        add(
          "golem-edge-unaccounted",
          `${receiver} receives a synergy from ${source}, which is not one of the four golems. ` +
            `Skeleton Mastery, Golem Mastery and Summon Resist reach golems through their ` +
            `effective level, not through a synergy parameter, and must not become edges.`,
        );
      }
    }
  }

  return problems;
}

// ---------------------------------------------------------------------------
// Published numbers, against a source that is not the extraction
// ---------------------------------------------------------------------------

/**
 * Reads one skill's published numbers out of the graph, using the app's own
 * functions.
 *
 * Passed in rather than imported so this module stays free of content, and
 * shared so the gate and its test cannot disagree about what a page shows.
 */
export function publishedReader(
  graph: Record<string, { effects?: readonly { labelKey: string }[] }>,
  damageAtLevel: (node: never, level: number) => { min: number; max: number } | undefined,
  durationAtLevel: (node: never, level: number) => { seconds: number } | undefined,
  effectAtLevel: (effect: never, level: number) => number | undefined,
): (slug: string, level: number) => PublishedValues | undefined {
  return (slug, level) => {
    const node = graph[slug];
    if (!node) return undefined;
    const effects: Record<string, number | undefined> = {};
    for (const effect of node.effects ?? []) {
      effects[effect.labelKey] = effectAtLevel(effect as never, level);
    }
    return {
      damage: damageAtLevel(node as never, level),
      durationSeconds: durationAtLevel(node as never, level)?.seconds,
      effects,
    };
  };
}

/**
 * What one skill publishes at one level.
 *
 * `read` is supplied by the caller and is the app's own `damageAtLevel`,
 * `durationAtLevel` and `effectAtLevel`, so these controls check the numbers a
 * reader actually sees rather than a parallel model that happens to agree.
 */
export interface PublishedValues {
  damage?: { min: number; max: number };
  durationSeconds?: number;
  effects: Record<string, number | undefined>;
}

export interface PublishedControl {
  readonly slug: string;
  readonly level: number;
  /** A damage range, a duration in seconds, or one effect keyed by its label. */
  readonly damage?: readonly [number, number];
  readonly durationSeconds?: number;
  readonly effect?: { readonly labelKey: string; readonly value: number };
}

/**
 * Values where the pinned 3.3 extraction and The Arreat Summit agree.
 *
 * The Arreat Summit is Tier 2 and documents 1.11, which makes it the one thing
 * available here that is genuinely independent of `skills.json`: it was written
 * from the game rather than from the same file this repository parses. Where it
 * agrees, the whole pipeline — five damage bands, HitShift, the poison duration
 * multiply, the mana shift, the piecewise minion count — is corroborated end to
 * end by something that did not produce it.
 *
 * Teeth is the clearest single case. Its damage matches at both ends of the
 * table, 2-4 at level 1 and 23-31 at level 20, which means the band arithmetic
 * and the HitShift divisor are right. That matters most for the entries in
 * DIVERGENCES below: a difference there is a difference in the numbers, not a
 * mistake in how they are read.
 */
export const CORROBORATED: readonly PublishedControl[] = [
  // Teeth — damage, projectile count and mana, both ends.
  { slug: "teeth", level: 1, damage: [2, 4] },
  { slug: "teeth", level: 20, damage: [23, 31] },
  { slug: "teeth", level: 1, effect: { labelKey: "effectMissiles", value: 2 } },
  { slug: "teeth", level: 20, effect: { labelKey: "effectMissiles", value: 21 } },
  { slug: "teeth", level: 1, effect: { labelKey: "effectMana", value: 3 } },
  { slug: "teeth", level: 20, effect: { labelKey: "effectMana", value: 12.5 } },

  /*
   * Poison Dagger — the skill that proves the poison model. Its columns are
   * damage per frame at HitShift 1; read as an instant range they floor to
   * nothing. Multiplied by the duration they reproduce the published table
   * exactly at both ends, including the duration itself.
   */
  { slug: "poison-dagger", level: 1, damage: [7, 15] },
  { slug: "poison-dagger", level: 20, damage: [540, 581] },
  { slug: "poison-dagger", level: 1, durationSeconds: 2 },
  { slug: "poison-dagger", level: 20, durationSeconds: 9.6 },

  // Poison Explosion and Poison Nova — the durations agree even where the
  // damage does not, which is what makes the divergence below a damage change.
  { slug: "poison-explosion", level: 1, durationSeconds: 2 },
  { slug: "poison-explosion", level: 20, durationSeconds: 9.6 },
  { slug: "poison-nova", level: 1, durationSeconds: 2 },
  { slug: "poison-nova", level: 20, durationSeconds: 2 },

  // Mana, across every shape the shift produces: flat, a half per level, a
  // quarter per level, a whole one, and one that falls.
  { slug: "poison-nova", level: 20, effect: { labelKey: "effectMana", value: 20 } },
  { slug: "poison-explosion", level: 20, effect: { labelKey: "effectMana", value: 8 } },
  { slug: "bone-spear", level: 1, effect: { labelKey: "effectMana", value: 7 } },
  { slug: "bone-spear", level: 20, effect: { labelKey: "effectMana", value: 11.75 } },
  { slug: "bone-spirit", level: 20, effect: { labelKey: "effectMana", value: 21.5 } },
  { slug: "poison-dagger", level: 20, effect: { labelKey: "effectMana", value: 7.75 } },
  { slug: "bone-armor", level: 20, effect: { labelKey: "effectMana", value: 30 } },
  { slug: "bone-wall", level: 20, effect: { labelKey: "effectMana", value: 17 } },
  { slug: "corpse-explosion", level: 20, effect: { labelKey: "effectMana", value: 34 } },
  { slug: "raise-skeletal-mage", level: 20, effect: { labelKey: "effectMana", value: 27 } },
  // Bone Prison's cost falls with level, which is the one direction a
  // sign error would not otherwise be visible in.
  { slug: "bone-prison", level: 1, effect: { labelKey: "effectMana", value: 27 } },
  { slug: "bone-prison", level: 20, effect: { labelKey: "effectMana", value: 8 } },

  /*
   * The minion count, at every level the piecewise formula bends. The Arreat
   * Summit prints the whole row — 1 2 3 3 3 4 4 4 5 5 5 6 6 6 7 7 7 8 8 8 — and
   * levels 2, 3 and 4 are where `2 + floor(level / 3)` on its own gets it wrong.
   */
  { slug: "raise-skeletal-mage", level: 1, effect: { labelKey: "effectMinions", value: 1 } },
  { slug: "raise-skeletal-mage", level: 2, effect: { labelKey: "effectMinions", value: 2 } },
  { slug: "raise-skeletal-mage", level: 3, effect: { labelKey: "effectMinions", value: 3 } },
  { slug: "raise-skeletal-mage", level: 4, effect: { labelKey: "effectMinions", value: 3 } },
  { slug: "raise-skeletal-mage", level: 6, effect: { labelKey: "effectMinions", value: 4 } },
  { slug: "raise-skeletal-mage", level: 9, effect: { labelKey: "effectMinions", value: 5 } },
  { slug: "raise-skeletal-mage", level: 20, effect: { labelKey: "effectMinions", value: 8 } },
  { slug: "raise-skeleton", level: 2, effect: { labelKey: "effectMinions", value: 2 } },
  { slug: "raise-skeleton", level: 20, effect: { labelKey: "effectMinions", value: 8 } },

  // Both walls stand for 24 seconds at every level.
  { slug: "bone-wall", level: 1, effect: { labelKey: "effectDuration", value: 600 } },
  { slug: "bone-prison", level: 20, effect: { labelKey: "effectDuration", value: 600 } },
];

/**
 * Values where the pinned extraction and The Arreat Summit disagree.
 *
 * The site publishes the extraction. The Arreat Summit predates Diablo II:
 * Resurrected, and every disagreement below is in the bone and poison trees —
 * exactly the part of the class D2R's rebalancing touched. Teeth's damage
 * agreeing at both ends is what rules out an error in how the columns are read.
 *
 * Pinned in both directions on purpose. The first rule catches the site drifting
 * away from Tier 1; the second catches something worse and quieter — a future
 * author reading the older source, deciding the site is wrong, and "correcting"
 * these numbers to match it.
 */
export const DIVERGENCES: readonly {
  readonly slug: string;
  readonly level: number;
  readonly what: "damage-min" | "damage-max" | "effect";
  readonly labelKey?: string;
  readonly tier1: number;
  readonly arreatSummit: number;
  readonly note: string;
}[] = [
  {
    slug: "bone-armor",
    level: 20,
    what: "effect",
    labelKey: "effectAbsorbed",
    tier1: 305,
    arreatSummit: 210,
    note: "Param2 is 15 damage absorbed per level in the pinned tables and 10 in the 1.11 documentation.",
  },
  {
    slug: "bone-spear",
    level: 1,
    what: "damage-min",
    tier1: 16,
    arreatSummit: 17,
    note: "The whole bone damage table sits a little lower than the 1.11 figures while its synergies sit higher.",
  },
  {
    slug: "bone-spear",
    level: 20,
    what: "damage-max",
    tier1: 204,
    arreatSummit: 218,
    note: "Same table, at the other end.",
  },
  {
    slug: "bone-spirit",
    level: 1,
    what: "damage-min",
    tier1: 20,
    arreatSummit: 22,
    note: "Bone Spirit's synergies read 8% in the pinned tables against 6% in the 1.11 documentation, and its base damage is correspondingly lower.",
  },
  {
    slug: "bone-spirit",
    level: 20,
    what: "damage-max",
    tier1: 369,
    arreatSummit: 413,
    note: "Same table, at the other end.",
  },
  {
    slug: "poison-explosion",
    level: 1,
    what: "damage-min",
    tier1: 25,
    arreatSummit: 28,
    note: "The duration agrees exactly at both ends, so the difference is in the per-frame damage rather than in the window it lands across.",
  },
  {
    slug: "poison-explosion",
    level: 20,
    what: "damage-max",
    tier1: 1410,
    arreatSummit: 1620,
    note: "Same table, at the other end.",
  },
  {
    slug: "poison-nova",
    level: 1,
    what: "damage-min",
    tier1: 50,
    arreatSummit: 52,
    note: "Both sources agree the duration is a fixed two seconds; only the damage packed into it differs.",
  },
  {
    slug: "poison-nova",
    level: 20,
    what: "damage-max",
    tier1: 440,
    arreatSummit: 468,
    note: "Same table, at the other end.",
  },
  {
    /*
     * Not a patch: a unit. The game names Corpse Explosion's radius parameters
     * "half squares" and the engine halves them. The Arreat Summit publishes a
     * yard figure that is the same parameter divided by three — 8 becomes 2.6,
     * 27 becomes 9. Two conventions, neither derivable from the other, so the
     * site publishes the parameter and says the engine halves it rather than
     * asserting a distance in yards.
     */
    slug: "corpse-explosion",
    level: 20,
    what: "effect",
    labelKey: "effectRadiusHalfSquares",
    tier1: 27,
    arreatSummit: 9,
    note: "A unit disagreement, not a value one: the engine halves the parameter and the 1.11 documentation divides it by three.",
  },
];

/**
 * Skills that must never publish a mana cost.
 *
 * All three carry a `mana` column and none of them can be cast. Summon Resist's
 * reads 44 falling by 3 per level, which taken at face value would put a
 * 44-mana price on a passive.
 */
export const NEVER_PUBLISHES_MANA: readonly string[] = [
  "skeleton-mastery",
  "golem-mastery",
  "summon-resist",
];

export function checkPublishedNumbers(
  read: (slug: string, level: number) => PublishedValues | undefined,
  corroborated: typeof CORROBORATED,
  divergences: typeof DIVERGENCES,
  neverManaSlugs: readonly string[],
): NecromancerProblem[] {
  const problems: NecromancerProblem[] = [];
  const add = (rule: NecromancerProblem["rule"], message: string) =>
    problems.push({ rule, message });

  for (const control of corroborated) {
    const values = read(control.slug, control.level);
    if (!values) {
      add("published-missing", `${control.slug} is not in the graph`);
      continue;
    }
    const where = `${control.slug} at level ${control.level}`;
    if (control.damage) {
      const [min, max] = control.damage;
      if (!values.damage) {
        add("published-missing", `${where}: no damage at all, and ${min}-${max} is expected`);
      } else if (values.damage.min !== min || values.damage.max !== max) {
        add(
          "published-value-wrong",
          `${where}: ${values.damage.min}-${values.damage.max}, and both the pinned tables ` +
            `and the 1.11 documentation give ${min}-${max}`,
        );
      }
    }
    if (control.durationSeconds !== undefined) {
      if (values.durationSeconds === undefined) {
        add(
          "published-missing",
          `${where}: no duration, and ${control.durationSeconds}s is expected. Poison damage ` +
            `without its window is meaningless — the columns are per frame.`,
        );
      } else if (values.durationSeconds !== control.durationSeconds) {
        add(
          "published-value-wrong",
          `${where}: ${values.durationSeconds}s against an expected ${control.durationSeconds}s`,
        );
      }
    }
    if (control.effect) {
      const got = values.effects[control.effect.labelKey];
      if (got === undefined) {
        add("published-missing", `${where}: publishes no ${control.effect.labelKey}`);
      } else if (got !== control.effect.value) {
        add(
          "published-value-wrong",
          `${where}: ${control.effect.labelKey} is ${got} against an expected ${control.effect.value}`,
        );
      }
    }
  }

  for (const d of divergences) {
    const values = read(d.slug, d.level);
    if (!values) {
      add("published-missing", `${d.slug} is not in the graph`);
      continue;
    }
    const got =
      d.what === "effect"
        ? values.effects[d.labelKey!]
        : d.what === "damage-min"
          ? values.damage?.min
          : values.damage?.max;
    const where = `${d.slug} at level ${d.level} (${d.labelKey ?? d.what})`;
    if (got === undefined) {
      add("published-missing", `${where}: nothing published, and ${d.tier1} is expected`);
    } else if (got === d.arreatSummit) {
      add(
        "published-matches-stale-source",
        `${where}: ${got}, which is the 1.11 figure rather than the pinned ${d.tier1}. ` +
          `${d.note} The site publishes the extraction; do not move a value to agree with the ` +
          `older source.`,
      );
    } else if (got !== d.tier1) {
      add(
        "published-value-wrong",
        `${where}: ${got}, which is neither the pinned ${d.tier1} nor the 1.11 ${d.arreatSummit}`,
      );
    }
  }

  for (const slug of neverManaSlugs) {
    const values = read(slug, 1);
    if (values?.effects.effectMana !== undefined) {
      add(
        "mana-on-passive",
        `${slug} publishes a mana cost of ${values.effects.effectMana}. It is a passive; its ` +
          `mana column is vestigial and taking it at face value prices a skill that is never cast.`,
      );
    }
  }

  return problems;
}
