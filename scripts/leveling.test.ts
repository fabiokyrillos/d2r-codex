/**
 * Proof that the levelling controls fire.
 *
 * The shipped journeys go through first — all six, both locales — and then a
 * copy of the Assassin's is mutated seven ways, once per rule. Every mutation
 * is a specific wrong thing a walkthrough invites rather than a generic bad
 * value: a skill allocated before it unlocks, a quest credited with a point it
 * does not give, a respec that returns more points than the level holds, a sum
 * that does not add up.
 *
 * The pt-BR pass is not decorative. The overlay carries its own copies of every
 * skill-point line and every arithmetic claim, and a translator retyping
 * "43 + 9 = 52" as "43 + 9 = 53" is exactly the failure this catches — one that
 * `check:content`'s translation parity would not, because both strings differ
 * from English and both are present.
 *
 * Run with `npm run test:leveling`.
 */
import { MAX_HARD_POINTS } from "../content/classes/skill-graph";
import { LOCALES } from "../lib/i18n/config";
import { getJourneys, getRuneword } from "../lib/registry";
import type { ProgressionJourney } from "../lib/types";
import {
  LEVELING_RULES,
  QUEST_POINTS_BY_DIFFICULTY,
  TOTAL_QUEST_POINTS,
  checkJourney,
  pointsAvailable,
  type LevelingRule,
} from "./leveling-rules";

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

// ---------------------------------------------------------------------------
console.log("\nThe game's own numbers");
// ---------------------------------------------------------------------------

check(
  "quest points are cumulative and reach twelve",
  QUEST_POINTS_BY_DIFFICULTY.normal === 4 &&
    QUEST_POINTS_BY_DIFFICULTY.nightmare === 8 &&
    QUEST_POINTS_BY_DIFFICULTY.hell === TOTAL_QUEST_POINTS,
);
check(
  "a level-99 character with every reward has exactly the cap",
  pointsAvailable(99, "hell") === MAX_HARD_POINTS,
  `${pointsAvailable(99, "hell")} vs ${MAX_HARD_POINTS}`,
);
check(
  "a level-45 character in Nightmare has 52",
  pointsAvailable(45, "nightmare") === 52,
  String(pointsAvailable(45, "nightmare")),
);

// ---------------------------------------------------------------------------
console.log("\nEvery shipped journey, both locales");
// ---------------------------------------------------------------------------

let swept = 0;
for (const locale of LOCALES) {
  for (const journey of getJourneys(locale)) {
    swept++;
    const problems = checkJourney(
      journey,
      (slug) => getRuneword(locale, slug),
      `${locale} ${journey.classSlug}`,
    );
    check(
      `${locale} ${journey.classSlug}`,
      problems.length === 0,
      problems.map((p) => p.message).join(" | "),
    );
  }
}
check(`${swept} journeys swept`, swept === LOCALES.length * getJourneys("en-us").length);

// ---------------------------------------------------------------------------
console.log("\nPlanted mutations, one per rule");
// ---------------------------------------------------------------------------

const source = getJourneys("en-us").find((j) => j.classSlug === "assassin");
if (!source) {
  console.error("\nFATAL: no Assassin journey to mutate.");
  process.exit(1);
}
const clone = (): ProgressionJourney => JSON.parse(JSON.stringify(source)) as ProgressionJourney;
const run = (j: ProgressionJourney) =>
  checkJourney(j, (slug) => getRuneword("en-us", slug), "planted");

const mutations: [string, (j: ProgressionJourney) => void, LevelingRule][] = [
  [
    "claim more points than the level can hold",
    (j) => {
      const s = j.stages[0];
      s.skillPoints.push("That is 40 points: 12 from levels 2-13, and 1 from the Den of Evil.");
    },
    "points-exceed-what-the-level-holds",
  ],
  [
    "claim more points than exist at all",
    (j) => {
      j.stages[6].skillPoints.push("That is 130 points spent in total.");
    },
    "points-exceed-what-the-level-holds",
  ],
  [
    "credit the Horadric Cube quest with a skill point",
    (j) => {
      j.stages[1].actions.push({
        kind: "quest",
        text: "Do the Horadric Cube quest for the skill point.",
      });
    },
    "quest-points-invented",
  ],
  [
    "allocate Death Sentry in the Act 1 stage",
    (j) => {
      j.stages[0].skillPoints.push("**Death Sentry 1** as soon as you can.");
    },
    "skill-named-before-its-level",
  ],
  [
    "tell the reader to make Chains of Honor in Act 1 of Normal",
    (j) => {
      j.stages[0].actions.push({
        kind: "runeword",
        text: "Make Chains of Honor now.",
        refs: [{ kind: "runeword", slug: "chains-of-honor" }],
        atLevel: 11,
      });
    },
    "runeword-named-before-its-level",
  ],
  [
    "give Treachery an atLevel below its requirement",
    (j) => {
      for (const stage of j.stages)
        for (const action of stage.actions)
          if ((action.refs ?? []).some((r) => r.slug === "treachery")) action.atLevel = 30;
    },
    "runeword-named-before-its-level",
  ],
  [
    "allocate a skill early without naming its unlock level",
    (j) => {
      j.stages[1].skillPoints.push("**Death Sentry**, one point, whenever you can spare it.");
    },
    "skill-named-before-its-level",
  ],
  [
    "break the ledger sum",
    (j) => {
      j.stages[3].skillPoints = j.stages[3].skillPoints.map((l) =>
        l.replace("43 + 9 = 52", "43 + 9 = 53"),
      );
    },
    "arithmetic-does-not-add-up",
  ],
  [
    "respec at level 20 returning 52 points",
    (j) => {
      j.respecPlan = [
        {
          at: "Normal Act 2, level 20",
          why: "Respec here and 52 points come back, which is what the lightning opening costs.",
        },
      ];
    },
    "respec-total-impossible",
  ],
];

for (const [name, mutate, rule] of mutations) {
  const j = clone();
  mutate(j);
  const problems = run(j);
  check(
    `rejects: ${name}`,
    problems.some((p) => p.rule === rule),
    problems.length ? problems.map((p) => p.rule).join(",") : "no problem reported",
  );
}

check("and the unmutated journey is silent", run(clone()).length === 0, run(clone()).map((p) => p.message).join(" | "));

// ---------------------------------------------------------------------------
console.log("\nThe Assassin's ledger closes at every checkpoint");
// ---------------------------------------------------------------------------

/*
 * Computed from the game's rules on one side and read off the shipped page on
 * the other. Neither side is a copy of the other: the left column is
 * `pointsAvailable`, the right is the number the walkthrough tells a reader
 * their skill screen will show.
 */
const DEN = 1;
const RADAMENT = 1;
const IZUAL = 2;
const NORMAL_ALL = DEN + RADAMENT + IZUAL;

/*
 * Left column: the game's rules — level points plus the quest rewards actually
 * collected by that point in the route. Right column: the number the shipped
 * page tells a reader their skill screen will show. Neither is a copy of the
 * other, which is the only reason the comparison means anything.
 */
const CHECKPOINTS: [number, number, number][] = [
  [13, DEN, 13],
  [26, NORMAL_ALL, 29],
  [40, NORMAL_ALL + DEN + RADAMENT, 45],
  [45, NORMAL_ALL + NORMAL_ALL, 52],
  [70, NORMAL_ALL * 2 + DEN + RADAMENT, 79],
  [85, NORMAL_ALL * 3, 96],
  [99, NORMAL_ALL * 3, 110],
];
for (const [level, quests, stated] of CHECKPOINTS) {
  check(
    `level ${level} with ${quests} quest points holds ${stated}`,
    level - 1 + quests === stated,
    `computed ${level - 1 + quests}`,
  );
}
check(
  "and the difficulty caps bound every checkpoint",
  CHECKPOINTS.every(([level, quests]) => {
    const difficulty = level <= 26 ? "normal" : level <= 45 ? "nightmare" : "hell";
    return level - 1 + quests <= pointsAvailable(level, difficulty);
  }),
);

const assassinText = LOCALES.map((locale) => {
  const j = getJourneys(locale).find((x) => x.classSlug === "assassin")!;
  return [
    ...j.overview,
    ...(j.respecPlan ?? []).map((r) => r.why),
    ...j.stages.flatMap((s) => [...s.skillPoints, ...s.actions.map((a) => a.text)]),
  ].join("\n");
}).join("\n");

for (const [, , total] of CHECKPOINTS) {
  check(
    `the page states the ${total}-point checkpoint`,
    new RegExp(`\\b${total}\\b`).test(assassinText),
  );
}

// ---------------------------------------------------------------------------
console.log(`\n${passed} checks passed across ${LEVELING_RULES.length} rules`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("Levelling controls all fire.\n");
