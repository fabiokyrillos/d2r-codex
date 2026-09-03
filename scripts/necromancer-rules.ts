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
    | "golem-self-edge";
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
