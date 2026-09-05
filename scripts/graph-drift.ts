/**
 * Proof that extending the skill graph did not rewrite the part of it that was
 * already there.
 *
 * WHY THIS EXISTS
 * ---------------
 * The Necromancer pass changed how synergies are extracted. Reading `parN` off
 * the receiving skill's row is correct for every Paladin, Sorceress and Amazon
 * expression and wrong for the golems, so the rule had to change underneath
 * ninety nodes that were already published and already checked.
 *
 * "It still passes" is not evidence there. Every gate in this repository reads
 * the generated graph, so a rule change that quietly moved a magnitude or
 * relabelled a kind would move the expectation with it and the board would stay
 * green. The only statement worth making is the strong one: **the ninety node
 * bodies that existed at the baseline are byte-identical**.
 *
 * So this compares the node bodies in the working file against the node bodies
 * in the file as committed at `BASELINE`, textually, and reports anything that
 * changed. Additions are fine and are counted; a changed or missing node fails.
 *
 * MOVING THE BASELINE
 * -------------------
 * Deliberately, and never as a side effect. A regeneration that genuinely
 * changes an existing node — a game patch, a new column, a corrected rule — is a
 * diff to read and to justify in its own commit. Bump `BASELINE` to that commit
 * afterwards, so the next pass is held to the state this one left behind rather
 * than to a frozen memory of 2026.
 *
 * Run with `npm run check:graph-drift`.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

/**
 * The commit the current hundred and fifty nodes were published at.
 *
 * `24cbd7b` — "Read the three synergies the game keeps on a missile, not on a
 * skill". Moved from `c98e3ed` because that regeneration deliberately changed
 * three of the ninety original node bodies: Fist of the Heavens, Meteor and
 * Immolation Arrow each gained a `missileSynergies` entry, which the check
 * reported and the commit message justifies. Nothing else in the file moved.
 *
 * Moving it is what makes the check mean something again: held to `c98e3ed` it
 * would report those three forever, and a permanently red gate is a gate nobody
 * reads.
 */
const BASELINE = "24cbd7bb360e37d8e4dd2b878a592d87f136d3d8";
const FILE = "content/classes/skill-graph.ts";

/** How many nodes the baseline is expected to carry, as a sanity floor. */
const BASELINE_NODES = 150;

/**
 * Node bodies, keyed by slug.
 *
 * Textual on purpose. Parsing the file into objects and comparing those would
 * compare what a parser chose to keep; comparing the emitted text compares what
 * the repository actually ships, including field order and formatting — which is
 * what "byte-identical" has to mean for a generated file.
 */
function nodeBodies(source: string, where: string): Map<string, string> {
  const start = source.indexOf("export const SKILL_GRAPH");
  if (start < 0) throw new Error(`${where}: no SKILL_GRAPH declaration found`);
  const bodies = new Map<string, string>();
  const pattern = /^ {2}"([a-z0-9-]+)": \{\n([\s\S]*?)^ {2}\},$/gm;
  for (const match of source.slice(start).matchAll(pattern)) {
    bodies.set(match[1], match[2]);
  }
  if (bodies.size === 0) throw new Error(`${where}: parsed zero nodes; the emitted shape moved`);
  return bodies;
}

const baseline = nodeBodies(
  execFileSync("git", ["show", `${BASELINE}:${FILE}`], { encoding: "utf8" }),
  `${FILE} at ${BASELINE.slice(0, 7)}`,
);
const current = nodeBodies(readFileSync(FILE, "utf8"), `${FILE} (working tree)`);

const changed: string[] = [];
const removed: string[] = [];
for (const [slug, body] of baseline) {
  const now = current.get(slug);
  if (now === undefined) removed.push(slug);
  else if (now !== body) changed.push(slug);
}
const added = [...current.keys()].filter((slug) => !baseline.has(slug));

console.log(`Skill graph drift, against ${BASELINE.slice(0, 7)}:`);
console.log(`  baseline   ${baseline.size} nodes`);
console.log(`  current    ${current.size} nodes`);
console.log(`  added      ${added.length}`);
console.log(`  changed    ${changed.length}`);
console.log(`  removed    ${removed.length}`);

const problems: string[] = [];
if (baseline.size !== BASELINE_NODES) {
  problems.push(
    `the baseline carries ${baseline.size} nodes, not the ${BASELINE_NODES} this check was ` +
      `written against — BASELINE was moved without updating BASELINE_NODES`,
  );
}
for (const slug of changed) {
  problems.push(`${slug}: its node body changed since the baseline. Read the diff.`);
}
for (const slug of removed) {
  problems.push(`${slug}: it was in the baseline graph and is no longer in the graph at all.`);
}

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.error(`  x ${p}`));
  process.exit(1);
}

console.log(
  `\nAll ${baseline.size} baseline nodes are byte-identical` +
    (added.length > 0 ? `, and ${added.length} were added.` : "."),
);
