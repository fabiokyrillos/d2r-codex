/**
 * Synergy integrity: the rules in isolation, the real content, and the pages.
 *
 * Both directions of a synergy used to be authored by hand. Ten of the
 * thirty-four edges disagreed with their own reverse — Might's page said it fed
 * Blessed Aim while Blessed Aim's page listed no synergies at all — and eight
 * of the twenty-five identities were contradicted by the game's own formulas.
 *
 * There is now one direction in the graph and one derived reverse, so the tests
 * that matter are: does each rule actually fire, does the real content pass,
 * and do the two rendered directions agree on every page.
 *
 * The page half requires `npm run build`. Run with `npm run test:synergy`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { assertFreshBuild } from "./build-freshness";

import { SKILL_GRAPH } from "../content/classes/skill-graph";
import { LOCALES, type Locale } from "../lib/i18n/config";
import { dictionaryFor } from "../lib/i18n";
import { getSkills } from "../lib/registry";
import { synergyEdges, synergyReceivers } from "../lib/skills";
import { checkSynergies } from "./skill-graph-rules";

let passed = 0;
const failures: string[] = [];
const check = (name: string, ok: boolean, detail = "") => {
  if (ok) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

type Node = {
  classSlug: string;
  synergies: readonly { from: string; kinds: readonly string[] }[];
};
type Graph = Record<string, Node>;

/** A reverse index computed from whatever graph is passed in. */
const reverseOf = (graph: Graph) => (slug: string) =>
  Object.entries(graph)
    .filter(([, n]) => n.synergies.some((s) => s.from === slug))
    .map(([to]) => ({ slug: to }));

const rulesHit = (problems: { rule: string }[], rule: string) =>
  problems.filter((p) => p.rule === rule).length;

// ===========================================================================
console.log("\nFixtures — each rule in isolation");
// ===========================================================================
{
  const clean: Graph = {
    a: { classSlug: "paladin", synergies: [] },
    b: { classSlug: "paladin", synergies: [{ from: "a", kinds: ["damage"] }] },
  };
  check(
    "a clean graph produces no problems",
    checkSynergies(clean, [], reverseOf(clean)).length === 0,
  );

  const unknown: Graph = {
    a: { classSlug: "paladin", synergies: [{ from: "ghost", kinds: ["damage"] }] },
  };
  check(
    "detects a synergy source that is not a skill",
    rulesHit(checkSynergies(unknown, [], reverseOf(unknown)), "synergy-unknown-skill") === 1,
  );

  const cross: Graph = {
    a: { classSlug: "paladin", synergies: [{ from: "b", kinds: ["damage"] }] },
    b: { classSlug: "sorceress", synergies: [] },
  };
  check(
    "detects a synergy crossing classes",
    rulesHit(checkSynergies(cross, [], reverseOf(cross)), "synergy-cross-class") === 1,
  );

  const self: Graph = { a: { classSlug: "paladin", synergies: [{ from: "a", kinds: ["damage"] }] } };
  check(
    "detects a skill listed as its own synergy source",
    rulesHit(checkSynergies(self, [], reverseOf(self)), "synergy-self") === 1,
  );

  const noKind: Graph = {
    a: { classSlug: "paladin", synergies: [] },
    b: { classSlug: "paladin", synergies: [{ from: "a", kinds: [] }] },
  };
  check(
    "detects an edge carrying no synergy kind",
    rulesHit(checkSynergies(noKind, [], reverseOf(noKind)), "synergy-unknown-skill") === 1,
  );

  // A reverse index that disagrees with the graph — the defect this exists for.
  const drifted: Graph = {
    a: { classSlug: "paladin", synergies: [] },
    b: { classSlug: "paladin", synergies: [{ from: "a", kinds: ["damage"] }] },
  };
  check(
    "detects a reverse index that omits an edge the graph has",
    rulesHit(checkSynergies(drifted, [], () => []), "synergy-reverse-drift") === 1,
  );
  check(
    "detects a reverse index claiming an edge the graph lacks",
    rulesHit(
      checkSynergies(drifted, [], (s) => (s === "b" ? [{ slug: "a" }] : reverseOf(drifted)(s))),
      "synergy-reverse-drift",
    ) >= 1,
  );

  check(
    "detects an authored magnitude for an edge the game does not give",
    rulesHit(
      checkSynergies(clean, [{ slug: "b", synergies: [{ skill: "ghost", bonus: "+1" }] }], reverseOf(clean)),
      "authored-synergy-drift",
    ) === 1,
  );
  check(
    "an authored magnitude for a real edge is accepted",
    rulesHit(
      checkSynergies(clean, [{ slug: "b", synergies: [{ skill: "a", bonus: "+1" }] }], reverseOf(clean)),
      "authored-synergy-drift",
    ) === 0,
  );
}

// ===========================================================================
console.log("\nPlanted mutations against the real content");
// ===========================================================================
{
  const authored = getSkills("en-us").map((s) => ({ slug: s.slug, synergies: s.synergies }));
  check(
    "the real content passes every synergy rule",
    checkSynergies(SKILL_GRAPH, authored, synergyReceivers).length === 0,
  );

  const clone = (): Graph =>
    JSON.parse(JSON.stringify(SKILL_GRAPH)) as Graph;

  // Re-introduce the exact claim that shipped: Holy Shield fed by Smite.
  const smite = clone();
  smite["holy-shield"].synergies = [{ from: "smite", kinds: ["armor"] }];
  check(
    "reinstating Holy Shield <- Smite is caught as authored drift",
    rulesHit(
      checkSynergies(
        SKILL_GRAPH as unknown as Graph,
        [{ slug: "holy-shield", synergies: [{ skill: "smite", bonus: "+damage per level" }] }],
        synergyReceivers,
      ),
      "authored-synergy-drift",
    ) === 1,
  );

  // A cross-class edge in the real graph.
  const crossed = clone();
  crossed["blessed-hammer"].synergies = [{ from: "ice-bolt", kinds: ["damage"] }];
  check(
    "a Paladin skill taking a Sorceress synergy is detected",
    rulesHit(checkSynergies(crossed, [], reverseOf(crossed)), "synergy-cross-class") === 1,
  );

  // Drop one edge and prove the reverse index notices.
  const dropped = clone();
  dropped["blessed-hammer"].synergies = dropped["blessed-hammer"].synergies.filter(
    (s) => s.from !== "vigor",
  );
  check(
    "removing Blessed Hammer <- Vigor makes the real reverse index diverge",
    rulesHit(checkSynergies(dropped, [], synergyReceivers), "synergy-reverse-drift") >= 1,
  );

  /*
   * Anti-vacuity: the graph must actually carry edges, and every class in it
   * must have some. Pinned to a count of 69 across two classes before, which
   * made a third class a test failure rather than a test subject — the count
   * proved nothing the "every class" check does not prove better.
   */
  const edges = synergyEdges();
  const classesInGraph = new Set(Object.values(SKILL_GRAPH).map((n) => n.classSlug));
  const classesWithEdges = new Set(edges.map((e) => SKILL_GRAPH[e.to].classSlug));
  check("the real graph carries synergy edges", edges.length > 0, `${edges.length}`);
  check(
    "every class in the graph has synergy edges",
    classesWithEdges.size === classesInGraph.size,
    `edges in [${[...classesWithEdges].sort().join(", ")}] of [${[...classesInGraph].sort().join(", ")}]`,
  );
  check(
    "Blessed Hammer receives from Vigor and Blessed Aim, and nothing else",
    JSON.stringify(SKILL_GRAPH["blessed-hammer"].synergies.map((s) => s.from).sort()) ===
      JSON.stringify(["blessed-aim", "vigor"]),
  );
  check(
    "Holy Bolt's Prayer edge is a healing synergy, not a damage one",
    SKILL_GRAPH["holy-bolt"].synergies.find((s) => s.from === "prayer")?.kinds.includes("healing") ===
      true,
  );
}

// ===========================================================================
console.log("\nThe reverse index is exactly the transpose");
// ===========================================================================
{
  let mismatches = 0;
  for (const [to, node] of Object.entries(SKILL_GRAPH)) {
    for (const syn of node.synergies) {
      if (!synergyReceivers(syn.from).some((r) => r.slug === to)) mismatches++;
    }
  }
  check("every edge appears in its source's reverse index", mismatches === 0, `${mismatches}`);

  let extra = 0;
  for (const slug of Object.keys(SKILL_GRAPH)) {
    for (const rec of synergyReceivers(slug)) {
      if (!SKILL_GRAPH[rec.slug].synergies.some((s) => s.from === slug)) extra++;
    }
  }
  check("the reverse index invents nothing", extra === 0, `${extra}`);
}

// ===========================================================================
console.log("\nAs rendered");
// ===========================================================================
const root = assertFreshBuild();

const visible = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ");

const skills = getSkills("en-us");
const nameIn = (locale: Locale, slug: string) =>
  getSkills(locale).find((s) => s.slug === slug)!.name;

for (const locale of LOCALES) {
  const t = dictionaryFor(locale).skills;
  let receivedOk = 0;
  let feedsOk = 0;
  let checkedReceived = 0;
  let checkedFeeds = 0;

  for (const skill of skills) {
    const node = SKILL_GRAPH[skill.slug];
    if (!node) continue;
    const file = join(root, locale, "classes", skill.classSlug, "skills", `${skill.slug}.html`);
    if (!existsSync(file)) continue;
    const text = visible(readFileSync(file, "utf8"));

    // Every source the graph gives must be named under "Synergies received".
    if (node.synergies.length > 0) {
      const section = text.slice(text.indexOf(t.synergiesTitle));
      for (const syn of node.synergies) {
        checkedReceived++;
        if (section.includes(nameIn(locale, syn.from))) receivedOk++;
      }
    }
    // And every receiver must be named under "Skills this feeds".
    const receivers = synergyReceivers(skill.slug);
    if (receivers.length > 0) {
      const section = text.slice(text.indexOf(t.feedsTitle));
      for (const rec of receivers) {
        checkedFeeds++;
        if (section.includes(nameIn(locale, rec.slug))) feedsOk++;
      }
    }
  }

  check(`${locale}: every graph source is named on the receiving page`,
    checkedReceived > 0 && receivedOk === checkedReceived, `${receivedOk}/${checkedReceived}`);
  check(`${locale}: every receiver is named on the feeding page`,
    checkedFeeds > 0 && feedsOk === checkedFeeds, `${feedsOk}/${checkedFeeds}`);
  check(`${locale}: both directions cover the same ${synergyEdges().length} edges`,
    checkedReceived === synergyEdges().length && checkedFeeds === synergyEdges().length,
    `${checkedReceived} / ${checkedFeeds}`);

  // The specific contradiction that shipped: Might feeding Blessed Aim.
  const blessedAim = join(root, locale, "classes", "paladin", "skills", "blessed-aim.html");
  const might = join(root, locale, "classes", "paladin", "skills", "might.html");
  if (existsSync(blessedAim) && existsSync(might)) {
    const aimText = visible(readFileSync(blessedAim, "utf8"));
    const mightText = visible(readFileSync(might, "utf8"));
    const mightName = nameIn(locale, "might");
    const claimsFeed = mightText.includes(t.feedsTitle)
      ? mightText.slice(mightText.indexOf(t.feedsTitle)).includes(nameIn(locale, "blessed-aim"))
      : false;
    const claimsReceive = aimText.includes(t.synergiesTitle)
      ? aimText.slice(aimText.indexOf(t.synergiesTitle)).includes(mightName)
      : false;
    check(`${locale}: Might no longer claims to feed Blessed Aim`, !claimsFeed);
    check(`${locale}: the two pages agree about Might -> Blessed Aim`, claimsFeed === claimsReceive);
  }

  // A page must never print a bare slug where a link belongs.
  let bareSlugs = 0;
  for (const skill of skills.slice(0, 12)) {
    const file = join(root, locale, "classes", skill.classSlug, "skills", `${skill.slug}.html`);
    if (!existsSync(file)) continue;
    const text = visible(readFileSync(file, "utf8"));
    for (const syn of SKILL_GRAPH[skill.slug]?.synergies ?? []) {
      if (text.includes(` ${syn.from} `)) bareSlugs++;
    }
  }
  check(`${locale}: no synergy renders as a bare slug`, bareSlugs === 0, `${bareSlugs}`);
}

console.log(`\n${passed} checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
